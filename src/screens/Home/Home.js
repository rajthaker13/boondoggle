/*global chrome*/
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Callout } from "@tremor/react";

function Home(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [twitterLinked, setTwitterLinked] = useState(false);
  const [emailLinked, setEmailLinked] = useState(false);
  const [linkedInLinked, setLinkedInLinked] = useState(false);
  const [crmType, setCRMType] = useState("");
  const [crm, setCRM] = useState([]);
  const [toDos, setToDos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [openCookieModal, setOpenCookieModal] = useState(false);
  const [cookieError, setCookieError] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [memberWelcome, setMemberWelcome] = useState(false);

  // const client_id = "989e97a9-d4ee-4979-9e50-f0d9909fc450";
  const client_id = process.env.REACT_APP_AIRTABLE_KEY;
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  function generateUniqueId() {
    const timestamp = Date.now().toString(); // Get current timestamp as string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    const uniqueId = timestamp + randomString; // Concatenate timestamp and random string
    return uniqueId; // Extract first 10 characters to ensure 10-digit length
  }

  async function searchCRMforContact(options) {
    try {
      // Attempt the request
      const results = await axios.request(options);
      return results;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limited, wait for 2 seconds and retry the request
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return searchCRMforContact(options); // Retry the request
      } else {
        // For other errors, throw the error
        throw error;
      }
    }
  }

  async function pushToAirtable(new_entries, source) {
    const connection_id = await getAirtableRefreshToken();
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    const baseID = data[0].baseID;
    const tableID = data[0].tableID;

    const companyField = data[0].fieldOptions.company;
    const emailField = data[0].fieldOptions.email;
    const nameField = data[0].fieldOptions.fullName;
    const notesField = data[0].fieldOptions.summary;

    let new_contacts = [];

    for (const entry of new_entries) {
      if (
        (source == "Email" && entry.status == "Completed") ||
        source == "Twitter" ||
        source == "LinkedIn"
      ) {
        let encodedFormula;
        if (source == "Email") {
          let formula = `({${emailField}} = "${entry.email}")`;
          encodedFormula = encodeURIComponent(formula);
        } else if (source == "Twitter" || source == "LinkedIn") {
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
      }
    }

    for (let i = 0; i < new_contacts.length; i += 10) {
      const batch = new_contacts.slice(
        i,
        i + 10 > new_contacts.length ? new_contacts.length : i + 10
      );

      const newContactURL = `https://api.airtable.com/v0/${baseID}/${tableID}`;
      const records = batch.map((contact) => ({
        fields: {
          [nameField]: contact.customer,
          [emailField]: source == "Email" ? contact.email : "",
          [notesField]: contact.title + ":" + contact.summary,
        },
      }));

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

  async function pushToAirtableUpdate(new_entries, source) {
    const connection_id = await getAirtableRefreshToken();
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    const baseID = data[0].baseID;
    const differentTables = data[0].fieldOptions.differentTables;
    const nameFieldObject = data[0].fieldOptions.entryID;
    const notesFieldObject = data[0].fieldOptions.summary;
    const linkFieldObject = data[0].fieldOptions.link;
    const emailFieldObject = data[0].fieldOptions.email;
    const twitterFieldObject = data[0].fieldOptions.twitter;
    const linkedInFieldObject = data[0].fieldOptions.linkedIn;

    const entryTypeObject = data[0].fieldOptions.entryType;
    const entryDateObject = data[0].fieldOptions.entryDate;

    const nameField = nameFieldObject.data.id;
    const notesField = notesFieldObject.data.id;
    const entryTypeField =
      entryTypeObject == false ? false : entryTypeObject.data.id;
    const entryDateField =
      entryDateObject == false ? false : entryDateObject.data.id;
    const emailField =
      emailFieldObject == false ? false : emailFieldObject.data.id;
    const linkedInField =
      linkFieldObject == false ? false : linkedInFieldObject.data.id;
    // const twitterField =
    //   twitterFieldObject == false ? false : twitterFieldObject.data.id;

    const tableID = nameFieldObject.tableID;

    let new_contacts = [];
    let new_entries_data = [];

    if (differentTables) {
      const linkField = linkFieldObject.data.id;
      console.log("LINKFIELD", linkFieldObject);
      for (let i = 0; i < new_entries.length; i++) {
        const formula = `({${nameField}} = "${new_entries[i].customer}")`;
        const encodedFormula = encodeURIComponent(formula);
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
          const recordID = recordResponse.data.records[0].id;
          new_entries_data.push({
            id: recordID,
            data: new_entries[i],
          });
        } else {
          new_contacts.push(new_entries[i]);
        }
      }
      for (let i = 0; i < new_contacts.length; i += 10) {
        const batch = new_contacts.slice(
          i,
          i + 10 > new_contacts.length ? new_contacts.length : i + 10
        );
        const newContactURL = `https://api.airtable.com/v0/${baseID}/${tableID}`;
        const records = batch.map((contact) => ({
          fields: {
            ...(nameField !== false ? { [nameField]: contact.customer } : {}),
            ...(linkedInField !== false
              ? { [linkedInField]: contact.url }
              : {}),
          },
        }));
        const newContactResponse = await axios.post(
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
        console.log("Respomse", newContactResponse);
        newContactResponse.data.records.map((record, index) => {
          new_entries_data.push({
            id: record.id,
            data: new_contacts[index],
          });
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      console.log("NEW CONTACTS RECORDS", new_entries_data);
      const reverseLinkedTableID = linkFieldObject.data.options.linkedTableId;
      const reverseLinkFieldID =
        linkFieldObject.data.options.inverseLinkFieldId;
      for (let i = 0; i < new_entries_data.length; i += 10) {
        const batch = new_entries_data.slice(
          i,
          i + 10 > new_entries_data.length ? new_entries_data.length : i + 10
        );
        console.log("Btach", batch);
        const newEntryURL = `https://api.airtable.com/v0/${baseID}/${reverseLinkedTableID}`;
        const records = batch.map((contact) => ({
          fields: {
            ...(entryTypeField !== false ? { [entryTypeField]: "Email" } : {}),
            ...(reverseLinkFieldID !== false
              ? { [reverseLinkFieldID]: [contact.id] }
              : {}),
            ...(entryDateField !== false
              ? { [entryDateField]: new Date(contact.data.date).toISOString() }
              : {}),
            ...(notesField !== false
              ? { [notesField]: contact.data.summary }
              : {}),
          },
        }));
        console.log("RECORDS", records);
        const newEntryResponse = await axios.post(
          newEntryURL,
          {
            records,
            typecast: true,
          },

          {
            headers: {
              Authorization: `Bearer ${connection_id}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("NEW ENTRY", newEntryResponse);
      }
    }
    setIsLoading(false);
  }

  async function linkWithTwitter() {
    if (isOnboarding) {
      const uid = localStorage.getItem("uid");
      await props.db
        .from("user_data")
        .update({
          onboardingStep: 4,
        })
        .eq("id", uid);
    }

    const url = window.location.href;
    const { data, error } = await props.db.functions.invoke("twitter-login-3", {
      body: { url },
    });
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  async function sendToCRM(new_crm_data, source) {
    const connection_id = localStorage.getItem("connection_id");

    await Promise.all(
      new_crm_data.map(async (update) => {
        if (
          (source == "Email" && update.status == "Completed") ||
          source == "Twitter" ||
          source == "LinkedIn"
        ) {
          if (update.customer != "") {
            let regexCustomer;
            if (source == "Twitter") {
              regexCustomer = update.customer.replace(
                /\s(?=[\uD800-\uDFFF])/g,
                ""
              );
            } else if (source == "Email") {
              regexCustomer = update.email;
            } else if (source == "LinkedIn") {
              regexCustomer = update.customer;
            }

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
                limit: 10,
                query: regexCustomer,
              },
            };
            // let results;
            // try {
            //   results = await axios.request(options);
            // } catch {
            //   await new Promise((resolve) => setTimeout(resolve, 2000));
            //   results = await axios.request(options);
            // }
            const results = await searchCRMforContact(options);
            const current_crm = results.data[0];

            const idOptions = {
              method: "GET",
              url: `https://api.unified.to/hris/${connection_id}/employee`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };

            let idResults;

            try {
              idResults = await axios.request(idOptions);
            } catch {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              idResults = await axios.request(idOptions);
            }
            const user_crm_id = idResults.data[0].id;

            if (current_crm != undefined) {
              const event = {
                id: current_crm.id,
                type: "NOTE",
                note: {
                  description:
                    update.title +
                    "\n" +
                    update.summary +
                    "\n Summarized by Boondoggle AI",
                },
                company_ids: current_crm.company_ids,
                contact_ids: [current_crm.id],
                user_id: user_crm_id,
              };
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
              } else if (source == "LinkedIn") {
                contact = {
                  name: update.customer,
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
                      update.summary + "\n Summarized by Boondoggle AI",
                    user_id: user_crm_id,
                  },
                }
              );
            }
          }
        }
      })
    );
  }

  async function getUserCRMData() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    return {
      crm_data: data[0].crm_data,
      tasks: data[0].tasks,
    };
  }

  async function getCRMData() {
    const connection_id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);
    const admin_crm_data = data[0].crm_data;
    const admin_to_dos = data[0].tasks;
    const type = data[0].type;
    let baseID;
    let fieldOptions;
    if (type == "airtable") {
      baseID = data[0].baseID;
      fieldOptions = data[0].fieldOptions;
    }

    let user_crm_data;
    let user_to_dos;

    if (localStorage.getItem("isAdmin") == "true") {
      user_crm_data = admin_crm_data;
      user_to_dos = admin_to_dos;
    } else {
      const fetch_user_crm = await getUserCRMData();
      user_crm_data = fetch_user_crm.crm_data;
      user_to_dos = fetch_user_crm.tasks;
    }
    return {
      admin_crm_data: admin_crm_data,
      admin_to_dos: admin_to_dos,
      user_crm_data: user_crm_data,
      user_to_dos: user_to_dos,
      type: type,
      baseID: baseID,
      fieldOptions: fieldOptions,
    };
  }

  async function updateCRM(userData) {
    const connection_id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    const fetch_crm = await getCRMData();

    let admin_crm_update = fetch_crm.admin_crm_data;
    let admin_to_dos = fetch_crm.admin_to_dos;
    let user_crm_update = fetch_crm.user_crm_data;
    let user_to_dos = fetch_crm.user_to_dos;
    let new_crm_data = [];

    let type = fetch_crm.type;
    let baseID = fetch_crm.baseID;
    let tableID = fetch_crm.tableID;
    let fieldOptions = fetch_crm.fieldOptions;

    let twitter_messages = [];

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
        admin_crm_update.push(obj);
        user_crm_update.push(obj);
        new_crm_data.push(obj);
        admin_to_dos.push(toDoObject);
        user_to_dos.push(toDoObject);
        // }
      })
    );

    const type_crm = localStorage.getItem("crmType");

    if (type_crm == "airtable") {
      await pushToAirtable(new_crm_data, "Twitter");
    } else {
      await sendToCRM(new_crm_data, "Twitter");
    }
    const new_connection_id = localStorage.getItem("connection_id");
    const uid = localStorage.getItem("uid");

    await props.db
      .from("data")
      .update({
        crm_data: admin_crm_update,
        twitter_messages: userData.messages,
        twitterLinked: true,
        tasks: admin_to_dos,
      })
      .eq("connection_id", new_connection_id);
    await props.db
      .from("users")
      .update({
        crm_data: user_crm_update,
        twitterLinked: true,
        tasks: user_to_dos,
      })
      .eq("id", uid);
    setTwitterLinked(true);
    setIsLoading(false);
    localStorage.setItem("twitterLinked", true);
    setCRM(user_crm_update);
    setToDos(user_to_dos);
    localStorage.setItem("to_dos", user_to_dos);
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }

  async function captureOauthVerifier() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const oauthVerifier = urlParams.get("oauth_verifier");

    // Now oauthVerifier contains the value of oauth_verifier parameter
    const token = localStorage.getItem("oauth_token");
    const secret = localStorage.getItem("oauth_secret");
    const { data, error } = await props.db.functions.invoke("get-twitter-dms", {
      body: { token: token, secret: secret, oauthVerifier: oauthVerifier },
    });
    if (data) {
      await updateCRM(data);
    }
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

  async function checkOnBoarding() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("user_data")
      .select("")
      .eq("id", uid);
    const onboardingValues = {
      hasOnboarded: data[0].hasOnboarded,
      onboardingStep: data[0].onboardingStep,
      subscription_status: data[0].subscription_status,
    };

    return onboardingValues;
  }

  async function getConnections() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("id", uid);

    setTwitterLinked(data[0].twitterLinked);
    setEmailLinked(data[0].emailLinked);
    setLinkedInLinked(data[0].linkedinLinked);
    const isAdmin = data[0].isAdmin;
    setIsAdmin(isAdmin);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("twitterLinked", data[0].twitterLinked);
    localStorage.setItem("linkedInLinked", data[0].linkedinLinked);

    localStorage.setItem("connection_id", data[0].crm_id);
  }

  async function checkLinks() {
    const onboardingValues = await checkOnBoarding();
    setIsAdmin(localStorage.getItem("isAdmin"));
    console.log(isAdmin);

    if (onboardingValues.onboardingStep > 1) {
      await getConnections();
      const id = localStorage.getItem("connection_id");

      const { data, error } = await props.db
        .from("data")
        .select("")
        .eq("connection_id", id);

      setCRM(data[0].crm_data);
      setToDos(data[0].tasks);
      setIsOnboarding(!onboardingValues.hasOnboarded);
      setOnboardingStep(onboardingValues.onboardingStep);

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
        localStorage.setItem("crmType", "airtable");
      }
    } else if (!onboardingValues.hasOnboarded) {
      setIsOnboarding(true);
      setOnboardingStep(onboardingValues.onboardingStep);
    }
  }

  async function getAirtableRefreshToken() {
    const id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("crm_id", id);

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
    if (isOnboarding) {
      const uid = localStorage.getItem("uid");
      await props.db
        .from("user_data")
        .update({
          onboardingStep: 4,
        })
        .eq("id", uid);
    }
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];
    const { data, error } = await props.db.functions.invoke("email-auth", {
      body: { source: urlWithoutParams },
    });
    window.open(data.url, "_self");
  }

  async function getEmails() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const { data, error } = await props.db.functions.invoke("email-callback", {
      body: { code: code, source: urlWithoutParams },
    });

    if (error == null) {
      localStorage.setItem("email_grant_id", data.id);

      const uid = localStorage.getItem("uid");

      await props.db
        .from("users")
        .update({
          email_grant_id: data.id,
        })
        .eq("id", uid);

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

    const emails = data.data.data;

    const curData = await getCurrentData();
    const fetch_crm = await getCRMData();

    let admin_crm_update = fetch_crm.admin_crm_data;
    let admin_to_dos = fetch_crm.admin_to_dos;
    let user_crm_update = fetch_crm.user_crm_data;
    let user_to_dos = fetch_crm.user_to_dos;
    let new_crm_data = [];

    let type = fetch_crm.type;
    let baseID = fetch_crm.baseID;
    let tableID = fetch_crm.tableID;
    let fieldOptions = fetch_crm.fieldOptions;

    let new_emails = [];

    await Promise.all(
      emails.map(async (email) => {
        let spamRespone;
        try {
          spamRespone = await axios.post(
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
        } catch (error) {
          if (error) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            spamRespone = await axios.post(
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
          }
        }

        if (
          email.latestDraftOrMessage.from[0].name != "" &&
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
          const fromIndex = new_emails.findIndex(
            (item) => item.customer === email.latestDraftOrMessage.from[0].name
          );

          const toIndex = new_emails.findIndex(
            (item) => item.customer === email.latestDraftOrMessage.to[0].name
          );

          let status;
          if (spamRespone.data.score >= 7) {
            status = "Completed";
          } else if (spamRespone.data.score >= 5) {
            status = "Pending";
          } else {
            status = "Rejected";
          }

          if (fromIndex != -1) {
            new_emails[fromIndex].snippet = [
              ...new_emails[fromIndex].snippet,
              {
                message: email.snippet,
                sender: email.latestDraftOrMessage?.from[0]?.name
                  ? email.latestDraftOrMessage?.from[0]?.name
                  : email.latestDraftOrMessage?.from[0]?.email,
              },
            ];
          } else if (toIndex != -1) {
            new_emails[toIndex].snippet = [
              ...new_emails[toIndex].snippet,
              {
                message: email.snippet,
                sender: email.latestDraftOrMessage?.from[0]?.name
                  ? email.latestDraftOrMessage?.from[0]?.name
                  : email.latestDraftOrMessage?.from[0]?.email,
              },
            ];
          } else {
            if (email.latestDraftOrMessage.from[0]?.email == userEmail) {
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
                status: status,
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
                status: status,
              };

              new_emails.push(obj);
            }
          }
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
            status: email.status,
          };

          admin_crm_update.push(obj);
          user_crm_update.push(obj);
          new_crm_data.push(obj);

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
            emailStatus: email.status,
          };
          admin_to_dos.push(toDoObject);
          user_to_dos.push(toDoObject);
        }
      })
    );

    await props.db
      .from("data")
      .update({
        crm_data: admin_crm_update,
        tasks: admin_to_dos,
      })
      .eq("connection_id", connection_id);
    const uid = localStorage.getItem("uid");
    await props.db
      .from("users")
      .update({
        crm_data: user_crm_update,
        tasks: user_to_dos,
        emailLinked: true,
      })
      .eq("id", uid);
    setEmailLinked(true);

    if (type == "airtable") {
      await pushToAirtable(new_crm_data, "Email");
    } else {
      await sendToCRM(new_crm_data, "Email");
    }

    setIsLoading(false);

    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
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
    const apiKey = process.env.REACT_APP_API_KEY;
    console.log("APIKEY", apiKey);
  }, []);

  async function nextOnboardingStep() {
    const uid = localStorage.getItem("uid");
    await props.db
      .from("user_data")
      .update({
        onboardingStep: onboardingStep + 1,
      })
      .eq("id", uid);

    setOnboardingStep(onboardingStep + 1);
  }

  async function completeOnboarding() {
    const uid = localStorage.getItem("uid");
    await props.db
      .from("user_data")
      .update({
        hasOnboarded: true,
        onboardingStep: 12,
      })
      .eq("id", uid);

    setOnboardingStep(onboardingStep + 1);
    setIsOnboarding(false);
  }

  async function getSessionCookie() {
    // Extension ID
    setIsLoading(true);

    const extensionId = "lgeokfaihmdoipgmajekijkfppdmcnib";

    // Message you want to send to the extension
    const message = {
      action: "getCookie",
      url: "https://www.linkedin.com/", // Specify the correct URL
      cookieName: "li_at", // Specify the correct cookie name
    };

    try {
      window.chrome.runtime.sendMessage(
        extensionId,
        message,
        async function (response) {
          if (response && response.cookie != null) {
            if (isOnboarding) {
              const uid = localStorage.getItem("uid");
              await props.db
                .from("user_data")
                .update({
                  onboardingStep: 4,
                })
                .eq("id", uid);
            }
            const fetch_crm = await getCRMData();
            const cookie = response.cookie;
            const { data, error } = await props.db.functions.invoke(
              "linked-scrape",
              {
                body: { session_cookie: cookie },
              }
            );
            const messageArray = data.text;
            let admin_crm_update = fetch_crm.admin_crm_data;
            let admin_to_dos = fetch_crm.admin_to_dos;
            let user_crm_update = fetch_crm.user_crm_data;
            let user_to_dos = fetch_crm.user_to_dos;
            let new_crm_data = [];

            let type = fetch_crm.type;
            let baseID = fetch_crm.baseID;
            let fieldOptions = fetch_crm.fieldOptions;
            await Promise.all(
              messageArray.map(async (messageData) => {
                const customer = messageData.name;
                const messagesString = messageData.messages
                  .map(
                    (messageObject) =>
                      `${messageObject.sender}: ${messageObject.text}`
                  )
                  .join("\n");
                const titleCompletion = await openai.chat.completions.create({
                  messages: [
                    {
                      role: "system",
                      content:
                        "You are a system that takes two inputs: A Customer Name and a string of messages between you and the customer on LinkedIn with a goal to automate CRM entries. Using the name of the customer and an array of messages (converted to a string) with each object formatted as a {senderName}: {senderMessage} you are to generate a title that summarizes the conversaton and captures what it is about. Please wrtie this in first-person and not as a third-party service as if you are logging the information to the CRM yourself but mention who is logging the entry (without using words like I, myself, etc).",
                    },
                    {
                      role: "user",
                      content: `The customer name is ${customer} and the string array of conversation is ${messagesString}`,
                    },
                  ],
                  model: "gpt-4",
                });
                const title = titleCompletion.choices[0].message.content;
                const summaryCompletion = await openai.chat.completions.create({
                  messages: [
                    {
                      role: "system",
                      content:
                        "You are a system that takes two inputs: A Customer Name and a string of messages between you and the customer on LinkedIn with a goal to automate CRM entries. Using the name of the customer and an array of messages (converted to a string) with each object formatted as a {senderName}: {senderMessage} you are to generate a brief summary that summarizes the conversaton and captures what it is about.  Please wrtie this in first-person and not as a third-party service as if you are logging the information to the CRM yourself (without using words like I, myself, etc).",
                    },
                    {
                      role: "user",
                      content: `The customer name is ${customer} and the string array of conversation is ${messagesString}`,
                    },
                  ],
                  model: "gpt-4",
                });
                const summary = summaryCompletion.choices[0].message.content;

                const toDoTitleCompletion =
                  await openai.chat.completions.create({
                    messages: [
                      {
                        role: "system",
                        content:
                          "You are a system that takes two inputs: A Customer Name and a string of messages between you and the customer on LinkedIn with a goal to automate CRM entries. Using the name of the customer and an array of messages (converted to a string) with each object formatted as a {senderName}: {senderMessage} you are to generate a title for a to-do action item that summarizes the conversaton and captures what it is about.  Please wrtie this in first-person and not as a third-party service as if you are logging the information to the CRM yourself (without using words like I, myself, etc).",
                      },
                      {
                        role: "user",
                        content: `The customer name is ${customer} and the string array of conversation is ${messagesString}`,
                      },
                    ],
                    model: "gpt-4",
                  });
                const toDoTitle =
                  toDoTitleCompletion.choices[0].message.content;

                const responseCompletion = await openai.chat.completions.create(
                  {
                    messages: [
                      {
                        role: "system",
                        content:
                          "You are a system that takes two inputs: A Customer Name and a string of messages between you and the customer on LinkedIn with a goal to automate CRM entries. Using the name of the customer and an array of messages (converted to a string) with each object formatted as a {senderName}: {senderMessage} you are to generate a response/follow-up to the last message of this conversation that I can copy and paste over that summarizes the conversaton and captures what it is about.  Please wrtie this in first-person and not as a third-party service as if you are logging the information to the CRM yourself (without using words like I, myself, etc).",
                      },
                      {
                        role: "user",
                        content: `The customer name is ${customer} and the string array of conversation is ${messagesString}`,
                      },
                    ],
                    model: "gpt-4",
                  }
                );
                const toDoResponse =
                  responseCompletion.choices[0].message.content;
                const date = Date.now();
                const uniqueId = generateUniqueId();

                console.log("MessageData", messageData);

                var obj = {
                  id: uniqueId,
                  customer: customer,
                  title: title,
                  summary: summary,
                  date: date,
                  url: messageData.url,
                  source: "LinkedIn",
                  status: "Completed",
                };

                var toDoObject = {
                  id: uniqueId,
                  customer: customer,
                  title: toDoTitle,
                  response: toDoResponse,
                  date: date,
                  source: "LinkedIn",
                  status: "Incomplete",
                };
                admin_crm_update.push(obj);
                user_crm_update.push(obj);
                new_crm_data.push(obj);
                admin_to_dos.push(toDoObject);
                user_to_dos.push(toDoObject);
              })
            );
            const type_crm = localStorage.getItem("crmType");

            if (type_crm == "airtable") {
              await pushToAirtableUpdate(new_crm_data, "LinkedIn");
            } else {
              await sendToCRM(new_crm_data, "LinkedIn");
            }
            const new_connection_id = localStorage.getItem("connection_id");
            const uid = localStorage.getItem("uid");
            await props.db
              .from("data")
              .update({
                crm_data: admin_crm_update,
                tasks: admin_to_dos,
              })
              .eq("connection_id", new_connection_id);
            await props.db
              .from("users")
              .update({
                crm_data: user_crm_update,
                tasks: user_to_dos,
                linkedinLinked: true,
              })
              .eq("id", uid);
            setLinkedInLinked(true);
            setIsLoading(false);
            localStorage.setItem("linkedInLinked", true);
            setCRM(user_crm_update);
            setToDos(user_to_dos);
            localStorage.setItem("to_dos", user_to_dos);
            setOpenCookieModal(false);
            window.location.reload();
          } else {
            console.log(cookieError);
            setCookieError("LoggedIn");
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      setCookieError("Extension");
      setIsLoading(false);
    }
  }

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="container">
        <div className="content-container">
          {openCookieModal && (
            <div className="modal-overlay">
              <div
                className="modal-content"
                style={{
                  width: "40vw",
                  width: "auto",
                  maxWidth: "60vw",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                <div className="cookie-modal-logo-row">
                  <div className="cookie-modal-logo-info-container">
                    <div className="cookie-modal-logo-pic-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="39"
                        height="39"
                        viewBox="0 0 39 39"
                        fill="none"
                      >
                        <path
                          d="M0.46875 19.5625C0.46875 9.06909 8.97534 0.5625 19.4688 0.5625C29.9622 0.5625 38.4688 9.06909 38.4688 19.5625C38.4688 30.0559 29.9622 38.5625 19.4688 38.5625C8.97534 38.5625 0.46875 30.0559 0.46875 19.5625Z"
                          fill="#0077B5"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.179 12.2971C14.179 13.5393 13.2439 14.5333 11.7426 14.5333H11.7151C10.2695 14.5333 9.33496 13.5393 9.33496 12.2971C9.33496 11.0287 10.298 10.0625 11.7709 10.0625C13.2439 10.0625 14.151 11.0287 14.179 12.2971ZM13.8959 16.2991V29.2363H9.59009V16.2991H13.8959ZM29.4239 29.2363L29.4241 21.8185C29.4241 17.8448 27.2999 15.9953 24.4665 15.9953C22.1804 15.9953 21.1569 17.251 20.5854 18.1319V16.2995H16.2791C16.3358 17.5134 16.2791 29.2367 16.2791 29.2367H20.5854V22.0115C20.5854 21.6248 20.6133 21.2391 20.7272 20.9623C21.0384 20.1898 21.7469 19.3901 22.9365 19.3901C24.4952 19.3901 25.1183 20.5764 25.1183 22.3149V29.2363H29.4239Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="cookie-modal-logo-text-container">
                      <span className="cookie-modal-logo-text-header">
                        LinkedIn
                      </span>
                      <span className="cookie-modal-logo-text-subheader">
                        Messages
                      </span>
                    </div>
                  </div>
                  <button
                    className="cookie-modal-connect-cookie-button"
                    onClick={async () => {
                      await getSessionCookie();
                    }}
                  >
                    <span className="cookie-modal-connect-cookie-button-text">
                      Pull Messages
                    </span>
                  </button>
                </div>
                <br />
                <div className="cookie-modal-info-text-container">
                  <span className="cookie-modal-info-text">
                    Every time you log into LinkedIn on your browser, a new
                    cookie is created for that “session”. If you log out or are
                    disconnected, the cookie expires.
                  </span>
                </div>
                <br />
                <div className="cookie-modal-info-text-container">
                  <span className="cookie-modal-info-text">
                    If you have Boondoggle AI’s extension installed, just click
                    on the "Pull Messages" button.
                  </span>
                </div>
                {cookieError == "Extension" && (
                  <>
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        marginTop: "2vh",
                      }}
                    >
                      <div className="modal-error-container">
                        <span className="modal-error-container-text">
                          You have not downloaded the Boondoggle Chrome
                          extension, please make sure that you are currently
                          logged in to LinkedIn and have the Boondoggle AI
                          extension downloaded by clicking the button below then
                          trying again.
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        marginTop: "2vh",
                      }}
                    >
                      <button
                        className="download-extension-button"
                        onClick={() => {
                          window.open(
                            "https://chromewebstore.google.com/detail/boondoggle/lgeokfaihmdoipgmajekijkfppdmcnib",
                            "_blank"
                          );
                          setCookieError("");
                        }}
                      >
                        <span className="download-extension-button-text">
                          Download extension
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {cookieError == "LoggedIn" && (
                  <>
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        marginTop: "2vh",
                      }}
                    >
                      <div className="modal-error-container">
                        <span className="modal-error-container-text">
                          You are not currently logged into LinkedIn on your
                          browser, please make sure that you are currently
                          logged in to LinkedIn by clicking the button below,
                          logging in, then trying again.
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        marginTop: "2vh",
                      }}
                    >
                      <button
                        className="download-extension-button"
                        onClick={() => {
                          window.open("https://www.linkedin.com/", "_blank");
                          setCookieError("");
                        }}
                      >
                        <span className="download-extension-button-text">
                          Log into LinkedIn
                        </span>
                      </button>
                    </div>
                  </>
                )}

                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "2vh",
                  }}
                >
                  <button
                    className="linked-button"
                    onClick={() => {
                      setOpenCookieModal(false);
                    }}
                  >
                    <p className="link-button-text">Close</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isOnboarding &&
            (isAdmin
              ? onboardingStep == 0
              : onboardingStep == 2 && !memberWelcome) && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Welcome to Boondoggle Beta
                  </p>
                  <br />
                  <p style={{ textAlign: "left" }}>
                    This is our first public release, & we're excited to share a
                    glimpse into the early tech we've been working on over the
                    past few weeks. <br /> <br /> Our goal for this beta is to
                    get feedback on your user experience, the
                    integrations/features most important to your workday, and
                    any other improvements you'd love to see.
                  </p>
                  <p style={{ textAlign: "left" }}>Beta features include:</p>
                  <ul style={{ textAlign: "left" }}>
                    <li>
                      <p>Summarize your emails and twitter direct messages.</p>
                    </li>
                    <li>
                      <p>Push those summaries/contacts to a CRM of choice.</p>
                    </li>
                    <li>
                      <p>
                        Automatically create completable to-do tasks with
                        AI-generated responses.
                      </p>
                    </li>
                  </ul>
                  <p style={{ textAlign: "left" }}>
                    We're excited to continue building new integrations and
                    features. Stay tuned for updates! For any feedback, bugs, or
                    feature requests, please email{" "}
                    <span style={{ color: "blue" }}>support@boondoggle.ai</span>
                    , and thanks again for supporting Boondoggle!
                  </p>
                  <br />
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginTop: "2vh",
                    }}
                  >
                    <button
                      className="linked-button"
                      onClick={async () => {
                        if (isAdmin) {
                          await nextOnboardingStep();
                        } else {
                          setMemberWelcome(true);
                        }
                      }}
                    >
                      <p className="link-button-text">Get Started</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {isOnboarding && onboardingStep == 14 && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  You are officialy a Boondoggler!
                </p>
                <br />
                <p style={{ textAlign: "left" }}>
                  You're ready to start automating your entries and saving time
                  everyday.
                </p>
                <p style={{ textAlign: "left" }}>
                  Here's a quick refreshser...Boondogggle:
                </p>
                <ul style={{ textAlign: "left" }}>
                  <li>
                    <p>Summarizes your emails and twitter direct messages.</p>
                  </li>
                  <li>
                    <p>Pushes those summaries/contacts to a CRM of choice.</p>
                  </li>
                  <li>
                    <p>
                      Automatically creates completable to-do tasks with
                      AI-generated responses.
                    </p>
                  </li>
                </ul>
                <p style={{ textAlign: "left" }}>
                  We're excited to continue building new integrations and
                  features. Stay tuned for updates! For any feedback, bugs, or
                  feature requests, please email{" "}
                  <span style={{ color: "blue" }}>support@boondoggle.ai</span>,
                  and thanks again for supporting Boondoggle!
                </p>
                <br />
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "2vh",
                  }}
                >
                  <button
                    className="linked-button"
                    onClick={async () => {
                      await completeOnboarding();
                    }}
                  >
                    <p className="link-button-text">Enter Boondogle</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          <Sidebar
            selectedTab={0}
            isOnboarding={isOnboarding}
            onboardingStep={onboardingStep}
            db={props.db}
          />
          <div className="dashboard-2">
            <div className="mx-auto max-w-lg space-y-6">
              <Callout title="Sales Performance" color="red">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Callout>
            </div>
          </div>
          <div
            style={
              isOnboarding && onboardingStep == 5
                ? { flexDirection: "column", filter: "blur(5px)" }
                : { flexDirection: "column" }
            }
          >
            <div className="dashboard-header">
              <div className="header-text-container">
                <span className="header-text-1">
                  <span className="header-text-2">Integrations</span>
                </span>
              </div>
            </div>
            <div className="dashboard">
              <div
                className="connected-apps-container"
                style={
                  isOnboarding &&
                  (onboardingStep == 1 ||
                    onboardingStep == 2 ||
                    onboardingStep == 4)
                    ? { filter: "blur(5px)" }
                    : isOnboarding && onboardingStep == 3
                    ? { border: "5px solid red" }
                    : {}
                }
              >
                <div className="connected-apps-header-container">
                  <p className="connected-apps-header">Connected Apps</p>
                </div>
                {isOnboarding && onboardingStep == 3 && (
                  <div
                    className="connected-apps-howto-container"
                    style={{ background: "#1c1c1c" }}
                  >
                    <div className="connected-apps-howto-text-container">
                      <span
                        className="connected-apps-howto-text-1"
                        style={{
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        Connect your first social app to start automating
                        entries into your connected CRM.
                      </span>
                    </div>
                  </div>
                )}
                {!isOnboarding ||
                  (onboardingStep > 3 && (
                    <div className="connected-apps-howto-container">
                      <div className="connected-apps-howto-text-container">
                        <span className="connected-apps-howto-text-1">
                          To automate access to your social accounts, Boondoggle
                          uses your session cookie. When you log into an
                          account, a new session cookie is created. When you log
                          out or are disconnected, the cookie expires. We will
                          notify you if any of your accounts disconnect.
                        </span>
                      </div>
                    </div>
                  ))}

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
                      style={
                        isOnboarding && onboardingStep == 3
                          ? { border: "5px solid red" }
                          : {}
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
                      style={
                        isOnboarding && onboardingStep == 3
                          ? { border: "5px solid red" }
                          : {}
                      }
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
                    <button
                      className={
                        linkedInLinked ? "linked-button" : "link-button"
                      }
                      disabled={linkedInLinked}
                      onClick={async () => {
                        if (!linkedInLinked) {
                          setOpenCookieModal(true);
                        }
                      }}
                      style={
                        isOnboarding && onboardingStep == 3
                          ? { border: "5px solid red" }
                          : {}
                      }
                    >
                      <p
                        className="link-button-text"
                        style={!linkedInLinked ? { color: "black" } : {}}
                      >
                        {linkedInLinked == true ? "Connected" : "Connect"}
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

              <div
                className="connected-apps-container"
                style={
                  isOnboarding && (onboardingStep == 3 || onboardingStep == 4)
                    ? { filter: "blur(5px)" }
                    : {}
                }
              >
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
                    <div
                      style={
                        (
                          isOnboarding && isAdmin
                            ? onboardingStep == 2
                            : memberWelcome && onboardingStep == 2
                        )
                          ? {
                              display: "flex",
                              flex: "1 0 0",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "5px solid red",
                            }
                          : {
                              display: "flex",
                              flex: "1 0 0",
                              alignItems: "center",
                              justifyContent: "center",
                            }
                      }
                    >
                      <img src={image} style={{ marginRight: "1vw" }} />
                      <div className="connected-app-info-container">
                        <p className="connected-app-info-1">{crmType}</p>
                      </div>
                    </div>
                    {(isOnboarding && isAdmin
                      ? onboardingStep == 2
                      : memberWelcome && onboardingStep == 2) && (
                      <div
                        className="onboarding-tooltip"
                        style={{ width: "15vw" }}
                      >
                        <p
                          className="link-button-text"
                          style={{ lineHeight: "100%" }}
                        >
                          {isAdmin
                            ? "Congratulations! You just connected your CRM to Boondoggle."
                            : "Your admin has successfully connected your CRM to Boondoggle"}
                        </p>
                        <button
                          className="onboarding-tooltip-button"
                          style={{ marginBottom: "1vh" }}
                          onClick={async () => {
                            await nextOnboardingStep();
                          }}
                        >
                          {" "}
                          <p
                            className="link-button-text"
                            style={{
                              color: "black",
                              fontSize: "12px",
                            }}
                          >
                            Continue
                          </p>
                        </button>
                      </div>
                    )}
                    {isOnboarding && onboardingStep == 1 && (
                      <div className="onboarding-tooltip">
                        <p
                          className="link-button-text"
                          style={{ lineHeight: "100%" }}
                        >
                          Begin by connecting <br /> your CRM
                        </p>
                      </div>
                    )}

                    {isOnboarding && onboardingStep < 2 && (
                      <button
                        className="link-button"
                        style={
                          isOnboarding && onboardingStep == 1
                            ? { width: "auto", border: "5px solid red" }
                            : { width: "auto" }
                        }
                      >
                        <p
                          className="link-button-text"
                          style={{ color: "black" }}
                          onClick={() => {
                            navigation("/link");
                          }}
                        >
                          {isOnboarding ? "Connect CRM" : "Switch CRM"}
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="connected-apps-container"
                style={
                  isOnboarding &&
                  (onboardingStep == 1 ||
                    onboardingStep == 2 ||
                    onboardingStep == 3)
                    ? { filter: "blur(5px)" }
                    : {}
                }
              >
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
                      style={
                        isOnboarding && onboardingStep == 4
                          ? {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                              border: "5px solid red",
                            }
                          : {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                            }
                      }
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
                      style={
                        isOnboarding && onboardingStep == 4
                          ? {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                              border: "5px solid red",
                            }
                          : {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                            }
                      }
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

                  {linkedInLinked && (
                    <div
                      style={
                        isOnboarding && onboardingStep == 4
                          ? {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                              border: "5px solid red",
                            }
                          : {
                              flexDirection: "row",
                              display: "flex",
                              width: "95%",
                              alignItems: "flex-start",
                              alignSelf: "stretch",
                            }
                      }
                    >
                      <div className="integrations-table-column">
                        <p
                          className="integrations-table-column-text"
                          style={{ fontWeight: 700 }}
                        >
                          LinkedIn
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
              {isOnboarding &&
                onboardingStep == 4 &&
                (emailLinked || twitterLinked || linkedInLinked) && (
                  <div className="onboarding-tooltip" style={{ width: "15vw" }}>
                    <p
                      className="link-button-text"
                      style={{ lineHeight: "100%", paddingInline: "1vw" }}
                    >
                      Amazing! You just connected your first social connection
                      to Boondoggle...here's to many more 🥂.
                    </p>
                    <button
                      className="onboarding-tooltip-button"
                      style={{ marginBottom: "1vh" }}
                      onClick={async () => {
                        await nextOnboardingStep();
                      }}
                    >
                      {" "}
                      <p
                        className="link-button-text"
                        style={{
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Continue
                      </p>
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Home;
