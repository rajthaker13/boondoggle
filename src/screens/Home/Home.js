/*global chrome*/
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import Instagram from "../../assets/landing/integrations/social/Instagram.svg";
import LoadingOverlay from "react-loading-overlay";
import affinity from "../../assets/landing/integrations/crm_svg/affinity.svg";
import airtable from "../../assets/landing/integrations/crm_svg/airtable.svg";
import attio from "../../assets/landing/integrations/crm_svg/attio.svg";
import close from "../../assets/landing/integrations/crm_svg/close.svg";
import copper from "../../assets/landing/integrations/crm_svg/copper.svg";
import freshsales from "../../assets/landing/integrations/crm_svg/freshsales.svg";
import highlevel from "../../assets/landing/integrations/crm_svg/highlevel.svg";
import hubspot from "../../assets/landing/integrations/crm_svg/hubspot.svg";
import netsuite from "../../assets/landing/integrations/crm_svg/netsuite.svg";
import pipedrive from "../../assets/landing/integrations/crm_svg/pipedrive.svg";
import recruitcrm from "../../assets/landing/integrations/crm_svg/recruitcrm.svg";
import salesflare from "../../assets/landing/integrations/crm_svg/salesflare.svg";
import salesforce from "../../assets/landing/integrations/crm_svg/salesforce.svg";
import salesloft from "../../assets/landing/integrations/crm_svg/salesloft.svg";
import zendesksell from "../../assets/landing/integrations/crm_svg/zendesksell.svg";
import zohocrm from "../../assets/landing/integrations/crm_svg/zohocrm.svg";

function Home(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [twitterLinked, setTwitterLinked] = useState(false);
  const [emailLinked, setEmailLinked] = useState(false);
  const [crmType, setCRMType] = useState("");
  const [crm, setCRM] = useState([]);
  const [toDos, setToDos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();

  const client_id = "626db426-e15c-45ff-8a39-1e2632f8ba1b";
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  async function pushToAirtable(new_entries, source) {
    const connection_id = await getAirtableRefreshToken();
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    console.log(data);
    const baseID = data[0].baseID;
    const tableID = data[0].tableID;

    const companyField = data[0].fieldOptions.company;
    const emailField = data[0].fieldOptions.email;
    const nameField = data[0].fieldOptions.fullName;
    const notesField = data[0].fieldOptions.summary;

    let new_contacts = [];

    await Promise.all(
      new_entries.map(async (entry) => {
        let encodedFormula;
        if (source == "Email") {
          let formula = `({${emailField}} = "${entry.email}")`;
          encodedFormula = encodeURIComponent(formula);
        } else if (source == "Twitter") {
          let formula = `({${nameField}} = "${entry.customer}")`;
          encodedFormula = encodeURIComponent(formula);
        }
        const existingContactURL = `https://api.airtable.com/v0/${baseID}/${tableID}?filterByFormula=${encodedFormula}`;
        let recordResponse;
        try {
          recordResponse = await axios.get(existingContactURL, {
            headers: {
              Authorization: `Bearer ${connection_id}`,
            },
          });
        } catch (error) {
          if (error) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            recordResponse = await axios.get(existingContactURL, {
              headers: {
                Authorization: `Bearer ${connection_id}`,
              },
            });
          }
        }

        if (recordResponse.data.records.length > 0) {
          const currentNotes =
            recordResponse.data.records[0].fields[`${notesField}`];
          const recordID = recordResponse.data.records[0].id;
          const updateContactURL = `https://api.airtable.com/v0/${baseID}/${tableID}/${recordID}`;

          await axios.patch(
            updateContactURL,
            {
              fields: {
                [notesField]:
                  currentNotes + "\n" + entry.title + ":" + entry.summary,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${connection_id}`,
                "Content-Type": "application/json",
              },
            }
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          new_contacts.push(entry);
        }
      })
    );

    console.log("NEW SHIT", new_contacts);

    for (let i = 0; i < new_contacts.length; i += 10) {
      const batch = new_contacts.slice(
        i,
        i + 10 > new_contacts.length ? new_contacts.length : i + 10
      );

      console.log(`BATCH: ${i}`, batch);

      const newContactURL = `https://api.airtable.com/v0/${baseID}/${tableID}`;
      const records = batch.map((contact) => ({
        fields: {
          [nameField]: contact.customer,
          [emailField]: source == "Email" ? contact.email : "",
          [notesField]: contact.title + ":" + contact.summary,
        },
      }));

      console.log(`RECORDS: ${i}`, records);

      await axios.post(
        newContactURL,
        {
          records,
        },

        {
          headers: {
            Authorization: `Bearer ${connection_id}`,
            "Content-Type": "application/json",
          },
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  async function linkWithTwitter() {
    const url = window.location.href;
    console.log(url);
    const { data, error } = await props.db.functions.invoke("twitter-login-3", {
      body: { url },
    });
    console.log(data);
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  async function sendToAirtable(new_crm_data, baseID, tableID, fieldOptions) {
    const id = localStorage.getItem("connection_id");
    console.log("Update", new_crm_data);
    console.log("base", baseID);
    console.log("tableID", tableID);
    console.log(fieldOptions);
    console.log("test", fieldOptions.fullName);
    console.log("test2", fieldOptions["fullName"]);
    Promise.all(
      new_crm_data.map(async (update) => {
        if (update.customer != "") {
          const regexCustomer = update.customer.replace(
            /\s(?=[\uD800-\uDFFF])/g,
            ""
          );
          console.log(regexCustomer);

          const formula = `({${fieldOptions.fullName}} = "${regexCustomer}")`;
          // const formula = '({fld46Pr3RcS1A5pe5} = "Blake Faulkner")';
          console.log("FORMULA", formula);
          // console.log("FORMULA 2 ", formula2);
          const encodedFormula = encodeURIComponent(formula);
          const url = `https://api.airtable.com/v0/${baseID}/${tableID}?filterByFormula=${encodedFormula}`;
          const searchResult = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${id}`,
            },
          });
          await setTimeout(function () {}, 2000);
          console.log(regexCustomer, searchResult.data);
        }
      })
    );
  }

  async function sendToCRM(new_crm_data, source) {
    const connection_id = localStorage.getItem("connection_id");

    Promise.all(
      new_crm_data.map(async (update) => {
        if (update.customer != "") {
          console.log(update);
          let regexCustomer;
          if (source == "Twitter") {
            regexCustomer = update.customer.replace(
              /\s(?=[\uD800-\uDFFF])/g,
              ""
            );
          } else if (source == "Email") {
            regexCustomer = update.email;
          }
          console.log("REGES", regexCustomer);
          if (update.customer == "Blake Faulkner 🌉") {
            regexCustomer = "Blake Faulkner";
          }
          const options = {
            method: "GET",
            url: `https://api.unified.to/crm/${connection_id}/contact`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
            params: {
              limit: 1000,
              query: regexCustomer,
            },
          };
          const results = await axios.request(options);
          console.log("Rsults", results);
          const current_crm = results.data[0];

          const idOptions = {
            method: "GET",
            url: `https://api.unified.to/hris/${connection_id}/employee`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
          };

          const idResults = await axios.request(idOptions);
          const user_crm_id = idResults.data[0].id;

          console.log(current_crm);

          if (current_crm != undefined) {
            const event = {
              id: current_crm.id,
              type: "NOTE",
              note: {
                description: update.title + "\n" + update.summary,
              },
              company_ids: current_crm.company_ids,
              contact_ids: [current_crm.id],
              user_id: user_crm_id,
            };
            console.log("event", event);
            const { data, error } = await props.db.functions.invoke(
              "update-crm-unified",
              {
                body: { connection_id: connection_id, event: event },
              }
            );
          } else {
            let contact;
            if (source == "Twitter") {
              contact = {
                name: regexCustomer,
              };
            } else if (source == "Email") {
              contact = {
                name: update.customer,
                emails: [
                  {
                    email: regexCustomer,
                    type: "WORK",
                  },
                ],
              };
            }
            const { data, error } = await props.db.functions.invoke(
              "new-contact-unified",
              {
                body: {
                  connection_id: connection_id,
                  contact: contact,
                  title: update.title,
                  description:
                    update.summary + "\n + Summarized by Boondoggle AI",
                  user_id: user_crm_id,
                },
              }
            );
          }
        }
      })
    );

    // const arraySearch = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user",
    //       content: `I have an array of objects as follows: ${current_crm} (This is the dataset I will be reffering to for this question). I want you to output the index where the object's property customer = "Blake Faulkner" and if does not exist then output -1. I don't want any code, I just want you to output the index where the object's property of customer is equal to "Blake Faulkner".`,
    //     },
    //   ],
    //   model: "gpt-3.5-turbo",
    // });

    // console.log(arraySearch);
    // const number = parseInt(
    //   arraySearch.choices[0].message.content.match(/\d+/)[0]
    // );
    // console.log(current_crm[number]);
  }

  async function updateCRM(userData) {
    console.log(userData);
    const connection_id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    let crm_update = data[0].crm_data;
    let new_crm_data = [];
    let to_dos = data[0].tasks;
    let type = data[0].type;
    let baseID;
    let tableID;
    let fieldOptions;
    if (type == "airtable") {
      console.log("LOCAL STORAGE FTW");
      baseID = data[0].baseID;
      tableID = data[0].tableID;
      fieldOptions = data[0].fieldOptions;
    }
    let twitter_messages = [];
    console.log(crm_update);

    console.log(userData);
    const meUser = userData.meUser.data.username;
    const meName = userData.meUser.data.name;

    await Promise.all(
      userData.messages.map(async (lead) => {
        const itemIndex = twitter_messages.findIndex(
          (item) => item.id === lead.messageData.dm_conversation_id
        );
        if (itemIndex !== -1) {
          if (lead.userData[0].username != meUser) {
            twitter_messages[itemIndex].customer = lead.userData[0].name;
            twitter_messages[itemIndex].messages = [
              ...twitter_messages[itemIndex].messages,
              {
                name: lead.userData[0].name,
                username: lead.userData[0].username,
                text: lead.messageData.text,
              },
            ];
          } else {
            twitter_messages[itemIndex].messages = [
              ...twitter_messages[itemIndex].messages,
              {
                name: lead.userData[0].name,
                username: lead.userData[0].username,
                text: lead.messageData.text,
              },
            ];
          }
        } else {
          twitter_messages.push({
            id: lead.messageData.dm_conversation_id,
            customer: lead.userData[0].name,
            messages: [
              {
                name: lead.userData[0].name,
                username: lead.userData[0].username,
                text: lead.messageData.text,
              },
            ],
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      })
    );

    console.log(twitter_messages);

    await Promise.all(
      twitter_messages.map(async (dm) => {
        // if (dm.customer != meName) {
        const messagesString = dm.messages
          .map(
            (message) =>
              `${message.name} (${message.username}): ${message.text}`
          )
          .join("\n");
        const titleCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `I have an array of Twitter direct messages between you and ${dm.customer} as follows: ${messagesString}. Give a short title that captures what this conversation was about.`,
            },
          ],
          model: "gpt-4",
        });
        const title = titleCompletion.choices[0].message.content;
        const summaryCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `I have an array of Twitter direct messages between you and ${dm.customer} as follows: ${messagesString}. Give a brief summary of this conversation that captures what it was about.`,
            },
          ],
          model: "gpt-4",
        });
        const summary = summaryCompletion.choices[0].message.content;

        const toDoTitleCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `I have an array of Twitter direct messages between you and ${dm.customer} as follows: ${messagesString}. Generate me a title for a to-do action item based on the context of this conversation.`,
            },
          ],
          model: "gpt-4",
        });

        const toDoTitle = toDoTitleCompletion.choices[0].message.content;

        const responseCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `I have an array of Twitter direct messages between you and ${dm.customer} as follows: ${messagesString}. Generate me a response to the last message of this conversation that I can copy and paste over based on the context of this conversation.`,
            },
          ],
          model: "gpt-4",
        });

        const toDoResponse = responseCompletion.choices[0].message.content;
        const date = Date.now();
        var obj = {
          id: dm.id,
          customer: dm.customer != meName ? dm.customer : "No Response",
          title: title,
          summary: summary,
          date: date,
          source: "Twitter",
          status: "Completed",
        };
        var toDoObject = {
          id: dm.id,
          customer: dm.customer != meName ? dm.customer : "No Response",
          title: toDoTitle,
          response: toDoResponse,
          date: date,
          source: "Twitter",
          status: "Incomplete",
        };
        crm_update.push(obj);
        new_crm_data.push(obj);
        to_dos.push(toDoObject);
        // }
      })
    );

    console.log("TODOS", to_dos);

    if (crmType == "Airtable") {
      await pushToAirtable(new_crm_data, "Twitter");
    } else {
      await sendToCRM(new_crm_data, "Twitter");
    }
    // console.log(userData.messages);
    // console.log(connection_id);

    await props.db
      .from("data")
      .update({
        crm_data: crm_update,
        twitter_messages: userData.messages,
        twitterLinked: true,
        tasks: to_dos,
      })
      .eq("connection_id", connection_id);
    setTwitterLinked(true);
    setIsLoading(false);
    localStorage.setItem("twitterLinked", true);
    setCRM(crm_update);
    setToDos(to_dos);
    localStorage.setItem("to_dos", to_dos);
  }

  async function captureOauthVerifier() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const oauthVerifier = urlParams.get("oauth_verifier");

    // Now oauthVerifier contains the value of oauth_verifier parameter
    console.log("Verifier " + oauthVerifier);
    const token = localStorage.getItem("oauth_token");
    const secret = localStorage.getItem("oauth_secret");
    console.log(token);
    console.log(secret);
    const { data, error } = await props.db.functions.invoke("get-twitter-dms", {
      body: { token: token, secret: secret, oauthVerifier: oauthVerifier },
    });
    console.log(data);
    if (data) {
      await updateCRM(data);
    }
  }

  async function getRefreshTokenAirtable(id) {
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("crm_id", id);
    console.log(data[0].refresh_token);

    const url = `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://airtable.com/oauth2/v1/token`;

    axios
      .post(
        url,
        {
          client_id: client_id,
          refresh_token: data[0].refresh_token,
          grant_type: "refresh_token",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(async (res) => {
        console.log(res.data);
        await props.db
          .from("users")
          .update({
            crm_id: res.data.access_token,
            refresh_token: res.data.refresh_token,
          })
          .eq("id", localStorage.getItem("uid"));
        await props.db
          .from("data")
          .update({
            connection_id: res.data.access_token,
          })
          .eq("connection_id", id);
        localStorage.setItem("connection_id", res.data.access_token);
        window.location.reload();
      });
  }

  async function linkedInTest() {
    const { data, error } = await props.db.functions.invoke("linked-scrape");
    console.log("SHIT", data);
  }

  async function twitterTest() {
    const { data, error } = await props.db.functions.invoke("twitter-scrape");
    console.log("SHITTWEET", data);
  }

  async function extensionTest() {
    chrome.runtime.sendMessage(
      "lgeokfaihmdoipgmajekijkfppdmcnib",
      { action: "getCookie", url: "https://linkedin.com", cookieName: "li_at" },
      (response) => {
        console.log("Response from extension:", response);
      }
    );
  }

  async function getCurrentData() {
    const id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select("")
      .eq("connection_id", id);
    return {
      data: data[0].crm_data,
      tasks: data[0].tasks,
    };
  }
  async function checkLinks() {
    const id = localStorage.getItem("connection_id");
    console.log("ID", id);

    const { data, error } = await props.db
      .from("data")
      .select("")
      .eq("connection_id", id);

    setTwitterLinked(data[0].twitterLinked);
    setEmailLinked(data[0].emailLinked);
    setCRM(data[0].crm_data);
    setToDos(data[0].tasks);
    localStorage.setItem("twitterLinked", data[0].twitterLinked);
    localStorage.setItem("crmType", data[0].type);

    const type = data[0].type;

    if (type == "crm") {
      const options = {
        method: "GET",
        url: `https://api.unified.to/unified/connection/${id}`,
        headers: {
          authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
        },
      };

      const results = await axios.request(options);

      const connected_crm = results.data.integration_type;

      if (connected_crm == "affinity") {
        setImage(affinity);
        setCRMType("Affinity");
      } else if (connected_crm == "attio") {
        setImage(attio);
        setCRMType("Attio");
      } else if (connected_crm == "close.io") {
        setImage(close);
        setCRMType("Close.io");
      } else if (connected_crm == "copper") {
        setImage(copper);
        setCRMType("Copper");
      } else if (connected_crm == "freshsalescrm") {
        setImage(freshsales);
        setCRMType("Freshales CRM");
      } else if (connected_crm == "highlevel") {
        setImage(highlevel);
        setCRMType("HighLevel");
      } else if (connected_crm == "hubspot") {
        setImage(hubspot);
        setCRMType("HubSpot");
      } else if (connected_crm == "pipedrive") {
        setImage(pipedrive);
        setCRMType("Pipedrive");
      } else if (connected_crm == "salesflare") {
        setImage(salesflare);
        setCRMType("Salesflare");
      } else if (connected_crm == "salesforce") {
        setImage(salesforce);
        setCRMType("Salesforce");
      } else if (connected_crm == "salesloft") {
        setImage(salesloft);
        setCRMType("Salesloft");
      } else if (connected_crm == "zohocrm") {
        setImage(zohocrm);
        setCRMType("ZohoCRM");
      }
    } else if (type == "airtable") {
      setImage(airtable);
      setCRMType("Airtable");
    }
  }

  async function getAirtableRefreshToken() {
    const id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("crm_id", id);
    console.log(data[0].refresh_token);

    const url = `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://airtable.com/oauth2/v1/token`;
    const refreshTokenResponse = await axios.post(
      url,
      {
        client_id: client_id,
        refresh_token: data[0].refresh_token,
        grant_type: "refresh_token",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const new_access_token = refreshTokenResponse.data.access_token;
    const new_refresh_token = refreshTokenResponse.data.refresh_token;

    await props.db
      .from("users")
      .update({
        crm_id: new_access_token,
        refresh_token: new_refresh_token,
      })
      .eq("id", localStorage.getItem("uid"));

    await props.db
      .from("data")
      .update({
        connection_id: new_access_token,
      })
      .eq("connection_id", id);
    localStorage.setItem("connection_id", new_access_token);

    return new_access_token;
  }

  async function connectEmail() {
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];
    const { data, error } = await props.db.functions.invoke("email-auth", {
      body: { source: urlWithoutParams },
    });
    console.log(data);
    window.open(data.url, "_self");
  }

  async function getEmails() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("CODE", code);
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const { data, error } = await props.db.functions.invoke("email-callback", {
      body: { code: code, source: urlWithoutParams },
    });

    console.log("ERROR", error);

    if (error == null) {
      console.log("HERE");
      localStorage.setItem("email_grant_id", data.id);

      const connection_id = localStorage.getItem("connection_id");

      await props.db
        .from("data")
        .update({
          email_grant_id: data.id,
        })
        .eq("connection_id", connection_id);

      await uploadEmails(data.id, data.email);
    }
  }

  async function uploadEmails(id, userEmail) {
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { identifier: id, source: urlWithoutParams },
    });

    const connection_id = localStorage.getItem("connection_id");

    console.log(data);

    const emails = data.data.data;
    console.log(emails);

    const curData = await getCurrentData();

    let updated_CRM = curData.data;
    let new_updates = [];
    let to_dos = curData.tasks;

    let new_emails = [];

    await Promise.all(
      emails.map(async (email) => {
        const spamRespone = await axios.post(
          "https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://spamcheck.postmarkapp.com/filter",
          {
            email: email.latestDraftOrMessage.body,
            options: "short",
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (
          email.latestDraftOrMessage.from[0].name != "" &&
          spamRespone.data.score >= 7 &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("verify") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("verification") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("alert") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("confirmation") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("invitation") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("webinar") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("activation") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("webinar") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("unsubscribe") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("confirmation") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("considering") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("tax") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("taxes") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("notification") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("demo") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("hesitate") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("invitation") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("registration") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("contact us") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("faq") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("luma") &&
          !email.latestDraftOrMessage.body.toLowerCase().includes("receipt") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("automation") &&
          !email.latestDraftOrMessage.body
            .toLowerCase()
            .includes("automated") &&
          email.folders[0] != "DRAFT"
        ) {
          // const itemIndex = new_emails.findIndex(
          //   (item) => item.customer === email.latestDraftOrMessage.from[0].name
          // );

          // if (itemIndex != -1) {
          //   new_emails[itemIndex].snippet = [
          //     ...new_emails[itemIndex].snippet,
          //     {
          //       message: email.snippet,
          //       sender: email.latestDraftOrMessage.from[0].name,
          //     },
          //   ];
          // } else {
          if (email.latestDraftOrMessage.from[0]?.email == userEmail) {
            console.log("YOBLAKE", email);
            console.log({
              data: email,
              customer: email.latestDraftOrMessage.to[0].name,
            });
            var obj = {
              id: email.id,
              customer: email.latestDraftOrMessage?.to[0]?.name
                ? email.latestDraftOrMessage?.to[0]?.name
                : email.latestDraftOrMessage?.to[0]?.email,
              email: email.latestDraftOrMessage.to[0].email,
              data: email,
              snippet: [
                {
                  message: email.snippet,
                  sender: email.latestDraftOrMessage?.from[0]?.name
                    ? email.latestDraftOrMessage?.from[0]?.name
                    : email.latestDraftOrMessage?.from[0]?.email,
                },
              ],
              participants: email.participants,
              type: "OUTBOUND",
            };

            new_emails.push(obj);
          } else {
            var obj = {
              id: email.id,
              customer: email.latestDraftOrMessage?.from[0]?.name
                ? email.latestDraftOrMessage?.from[0]?.name
                : email.latestDraftOrMessage?.from[0]?.email,
              email: email.latestDraftOrMessage.from[0].email,
              data: email,
              snippet: [
                {
                  message: email.snippet,
                  sender: email.latestDraftOrMessage?.from[0]?.name
                    ? email.latestDraftOrMessage?.from[0]?.name
                    : email.latestDraftOrMessage?.from[0]?.email,
                },
              ],
              participants: email.participants,
              type: "INBOUND",
            };

            new_emails.push(obj);
          }
          // }
        }
      })
    );

    await Promise.all(
      new_emails.map(async (email) => {
        if (email.customer) {
          const from = `${email.data.latestDraftOrMessage.from[0].name} (${email.data.latestDraftOrMessage.from[0].email})`;
          const subject = email.data.subject;

          const snippetString = email.snippet
            .map((message) => `${message.sender}: ${message.message}`)
            .join("\n");

          const participantsString = email.participants
            .map((user) => {
              if (user.name && user.name.trim() !== "") {
                return `${user.name}: ${user.email}`;
              } else {
                return user.email;
              }
            })
            .join("\n");

          const emailContext = `You are an automated CRM entry assistant. I have an conversation sent from ${from} with these participants ${participantsString}. This is an array containing the content of the conversaton: ${snippetString} under the subject: ${subject}. This is a ${email.type} conversation and in this context you are the user associated with ${userEmail}.`;

          const titleCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `${emailContext} Give a short title that captures what this email thread was about.`,
              },
            ],
            model: "gpt-4",
          });
          const title = titleCompletion.choices[0].message.content;
          const summaryCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `${emailContext} Generate me a summary of this email thread in a few short sentences.`,
              },
            ],
            model: "gpt-4",
          });
          const summary = summaryCompletion.choices[0].message.content;

          const date = Date.now();

          var obj = {
            id: email.id,
            customer: email.customer,
            email: email.email,
            title: title,
            summary: summary,
            date: date,
            source: "Email",
            status: "Completed",
          };

          updated_CRM.push(obj);
          new_updates.push(obj);

          const toDoTitleCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `${emailContext} Generate me a title for a to-do action item based on the context of this conversation.`,
              },
            ],
            model: "gpt-4",
          });

          const toDoTitle = toDoTitleCompletion.choices[0].message.content;

          let responseType;
          if (email.type == "OUTBOUND") {
            responseType = "Follow-Up";
          } else {
            responseType = "Response";
          }

          const responseCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `${emailContext} Generate me a ${responseType} to the last message of this conversation that I can copy and paste over based on the context of this conversation.`,
              },
            ],
            model: "gpt-4",
          });

          const toDoResponse = responseCompletion.choices[0].message.content;

          var toDoObject = {
            id: email.id,
            customer: email.customer,
            title: toDoTitle,
            response: toDoResponse,
            date: date,
            type: email.type == "OUTBOUND" ? "Follow-Up" : "Respond",
            source: "Email",
            status: "Incomplete",
          };
          to_dos.push(toDoObject);
        }
      })
    );

    await props.db
      .from("data")
      .update({
        crm_data: updated_CRM,
        tasks: to_dos,
        emailLinked: true,
      })
      .eq("connection_id", connection_id);
    setEmailLinked(true);
    await pushToAirtable(new_updates, "Email");

    // if (crmType == "Airtable") {
    //   await pushToAirtable(new_updates, "Email");
    // } else {
    //   await sendToCRM(new_updates, "Email");
    // }

    setIsLoading(false);
  }

  useEffect(() => {
    async function getTwitterData() {
      if (!twitterLinked) {
        await captureOauthVerifier();
      }
    }

    async function getEmailData() {
      await getEmails();
    }

    async function loadCheck() {
      await checkLinks();
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("oauth_verifier") && !twitterLinked) {
      getTwitterData();
    }
    if (urlParams.has("code") && !emailLinked) {
      getEmailData();
    }
    loadCheck();
    console.log(window.location);
  }, []);

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="container">
        <div className="content-container">
          <Sidebar selectedTab={0} />
          <div style={{ flexDirection: "column" }}>
            <div className="dashboard-header">
              <div className="header-text-container">
                <span className="header-text-1">
                  <span className="header-text-2">Integrations</span>
                </span>
              </div>
            </div>
            <div className="dashboard">
              <div className="connected-apps-container">
                <div className="connected-apps-header-container">
                  <p className="connected-apps-header">Connected Apps</p>
                </div>
                <div className="connected-apps-howto-container">
                  <div className="connected-apps-howto-text-container">
                    <span className="connected-apps-howto-text-1">
                      To automate access to your social accounts, Boondoggle
                      uses your session cookie. When you log into an account, a
                      new session cookie is created. When you log out or are
                      disconnected, the cookie expires. We will notify you if
                      any of your accounts disconnect.{" "}
                      {/* <span className="connected-apps-howto-text-2">
                        Learn More
                      </span> */}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    width: "95%",
                    gap: "30px",
                  }}
                >
                  <div className="connected-apps-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                        fill="#1DA1F2"
                      />
                      <path
                        d="M24.3127 11.0875C23.7252 11.3468 23.0971 11.5218 22.4346 11.6031C23.1096 11.1968 23.6283 10.5562 23.8721 9.7937C23.2408 10.1625 22.5377 10.4312 21.7939 10.5812C21.1971 9.9437 20.3502 9.5437 19.4064 9.5437C17.6002 9.5437 16.1346 11.0093 16.1346 12.8125C16.1346 13.0718 16.1658 13.3218 16.2189 13.5593C13.5002 13.4312 11.0877 12.125 9.4752 10.15C9.19082 10.6312 9.03145 11.1875 9.03145 11.7968C9.03145 12.9343 9.60957 13.9343 10.4877 14.5218C9.9502 14.5031 9.44707 14.3562 9.00645 14.1125V14.1531C9.00645 15.7406 10.1314 17.0625 11.6314 17.3625C11.3564 17.4375 11.0658 17.475 10.7689 17.475C10.5596 17.475 10.3596 17.4562 10.1596 17.4187C10.5783 18.7187 11.7846 19.6656 13.2221 19.6906C12.1064 20.5687 10.6877 21.0906 9.16582 21.0906C8.90645 21.0906 8.64707 21.075 8.3877 21.0468C9.84395 21.975 11.5596 22.5156 13.4127 22.5156C19.4283 22.5156 22.7189 17.5312 22.7189 13.2156C22.7189 13.0781 22.7189 12.9375 22.7096 12.7968C23.3471 12.3375 23.9064 11.7593 24.3439 11.1031L24.3127 11.0875Z"
                        fill="white"
                      />
                    </svg>
                    <div className="connected-app-info-container">
                      <p className="connected-app-info-1">Twitter</p>
                      <p className="connected-app-info-2">Direct Messages</p>
                    </div>
                    <button
                      className={
                        twitterLinked ? "linked-button" : "link-button"
                      }
                      onClick={async () => {
                        if (!twitterLinked) {
                          await linkWithTwitter();
                        }
                      }}
                    >
                      <p
                        className="link-button-text"
                        style={!twitterLinked ? { color: "black" } : {}}
                      >
                        {twitterLinked == true ? "Connected" : "Connect"}
                      </p>
                    </button>
                  </div>

                  <div className="connected-apps-cell">
                    <HiOutlineMail size={32} />
                    <div className="connected-app-info-container">
                      <p className="connected-app-info-1">Email</p>
                      <p className="connected-app-info-2">Inbox, Sent</p>
                    </div>
                    <button
                      className={emailLinked ? "linked-button" : "link-button"}
                      disabled={emailLinked}
                      onClick={async () => {
                        if (!emailLinked) {
                          await connectEmail();
                        }
                      }}
                    >
                      <p
                        className="link-button-text"
                        style={!emailLinked ? { color: "black" } : {}}
                      >
                        {emailLinked == true ? "Connected" : "Connect"}
                      </p>
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    width: "95%",
                    gap: "30px",
                  }}
                >
                  <div className="connected-apps-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M29.6393 0.000121181H2.36066C1.74172 -0.00617778 1.14557 0.233313 0.703 0.666044C0.260435 1.09877 0.00760951 1.6894 0 2.30832V29.6972C0.00898566 30.3152 0.262416 30.9045 0.704831 31.3361C1.14725 31.7677 1.74262 32.0064 2.36066 32.0001H29.6393C30.2583 32.005 30.8541 31.7647 31.2964 31.3317C31.7387 30.8987 31.9917 30.3082 32 29.6893V2.30045C31.989 1.68334 31.7348 1.09554 31.2928 0.664792C30.8507 0.234048 30.2565 -0.00481565 29.6393 0.000121181Z"
                        fill="#0076B2"
                      />
                      <path
                        d="M4.73708 11.9949H9.48724V27.2788H4.73708V11.9949ZM7.11347 4.38831C7.6583 4.38831 8.19088 4.5499 8.64384 4.85264C9.09681 5.15538 9.44981 5.58566 9.65818 6.08906C9.86655 6.59246 9.92094 7.14635 9.81446 7.68067C9.70798 8.21498 9.44542 8.70571 9.05999 9.09077C8.67456 9.47584 8.18358 9.73793 7.64916 9.8439C7.11475 9.94987 6.56091 9.89496 6.05771 9.6861C5.55451 9.47725 5.12456 9.12384 4.82225 8.67059C4.51994 8.21734 4.35886 7.6846 4.35938 7.13978C4.36007 6.4098 4.65054 5.70996 5.16696 5.19403C5.68338 4.67811 6.3835 4.38831 7.11347 4.38831Z"
                        fill="white"
                      />
                      <path
                        d="M12.4668 11.9949H17.0202V14.0932H17.0832C17.7179 12.8919 19.2655 11.625 21.5763 11.625C26.3868 11.6145 27.2786 14.7804 27.2786 18.8854V27.2788H22.5284V19.8427C22.5284 18.0722 22.497 15.7929 20.0602 15.7929C17.6235 15.7929 17.2091 17.7234 17.2091 19.7273V27.2788H12.4668V11.9949Z"
                        fill="white"
                      />
                    </svg>
                    <div className="connected-app-info-container">
                      <p className="connected-app-info-1">LinkedIn</p>
                      <p className="connected-app-info-2">Direct Messages</p>
                    </div>
                    <button className="link-button">
                      <p
                        className="link-button-text"
                        style={{ color: "black" }}
                      >
                        Coming Soon
                      </p>
                    </button>
                  </div>

                  <div className="connected-apps-cell">
                    <img src={Instagram}></img>
                    <div className="connected-app-info-container">
                      <p className="connected-app-info-1">Instagram</p>
                      <p className="connected-app-info-2">Direct Messages</p>
                    </div>
                    <button className="link-button">
                      <p
                        className="link-button-text"
                        style={{ color: "black" }}
                      >
                        Coming Soon
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="connected-apps-container">
                <div className="connected-apps-header-container">
                  <p className="connected-apps-header">Connected CRM</p>
                </div>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    width: "95%",
                    gap: "30px",
                  }}
                >
                  <div className="connected-apps-cell">
                    <>
                      <img src={image} />
                      <div className="connected-app-info-container">
                        <p className="connected-app-info-1">{crmType}</p>
                      </div>
                    </>

                    <button className="link-button" style={{ width: "auto" }}>
                      <p
                        className="link-button-text"
                        style={{ color: "black" }}
                        onClick={async () => {
                          await getAirtableRefreshToken();
                        }}
                      >
                        Switch CRM
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="connected-apps-container">
                <div className="connected-apps-header-container">
                  <p className="connected-apps-header">Integrations</p>

                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      width: "95%",
                      alignItems: "flex-start",
                      alignSelf: "stretch",
                    }}
                  >
                    <div className="integrations-table-column">
                      <p className="integrations-table-column-header">
                        Platform
                      </p>
                    </div>

                    <div className="integrations-table-column">
                      <p className="integrations-table-column-header">
                        Account/Cookie/Key
                      </p>
                    </div>

                    <div className="integrations-table-column">
                      <p className="integrations-table-column-header">
                        Accessed
                      </p>
                    </div>

                    <div className="integrations-table-column">
                      <p className="integrations-table-column-header">Status</p>
                    </div>
                  </div>
                  {twitterLinked && (
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "95%",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                      }}
                    >
                      <div className="integrations-table-column">
                        <p
                          className="integrations-table-column-text"
                          style={{ fontWeight: 700 }}
                        >
                          Twitter
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p className="integrations-table-column-text">
                          {localStorage.getItem("uid")}
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p className="integrations-table-column-text">
                          Just now
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p
                          className="integrations-table-column-text"
                          style={{ color: "#4AA785" }}
                        >
                          Approved
                        </p>
                      </div>
                    </div>
                  )}

                  {emailLinked && (
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "95%",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                      }}
                    >
                      <div className="integrations-table-column">
                        <p
                          className="integrations-table-column-text"
                          style={{ fontWeight: 700 }}
                        >
                          Email
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p className="integrations-table-column-text">
                          {localStorage.getItem("connection_id").slice(0, 20)}
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p className="integrations-table-column-text">
                          Just now
                        </p>
                      </div>
                      <div className="integrations-table-column">
                        <p
                          className="integrations-table-column-text"
                          style={{ color: "#4AA785" }}
                        >
                          Approved
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Home;
