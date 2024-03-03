/*global chrome*/
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";

function Home(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [twitterLinked, setTwitterLinked] = useState(false);
  const [emailLinked, setEmailLinked] = useState(false);
  const [crmType, setCRMType] = useState("");
  const [crm, setCRM] = useState([]);
  const [toDos, setToDos] = useState([]);
  const client_id = "9455bca6-66a9-4ab8-88a0-164a93c89c52";
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

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
          setTimeout(function () {
            console.log("Executed after 1 second");
          }, 2000);
          console.log(regexCustomer, searchResult.data);
        }
      })
    );
  }

  async function sendToCRM(new_crm_data) {
    console.log("new_crm", new_crm_data);
    const connection_id = localStorage.getItem("connection_id");

    Promise.all(
      new_crm_data.map(async (update) => {
        if (update.customer != "") {
          console.log(update);
          let regexCustomer = update.customer.replace(
            /\s(?=[\uD800-\uDFFF])/g,
            ""
          );
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
              user_id: current_crm.user_id,
            };
            console.log("event", event);
            const { data, error } = await props.db.functions.invoke(
              "update-crm-unified",
              {
                body: { connection_id: connection_id, event: event },
              }
            );
          } else {
            const contact = {
              name: regexCustomer,
            };
            const { data, error } = await props.db.functions.invoke(
              "new-contact-unified",
              {
                body: {
                  connection_id: connection_id,
                  contact: contact,
                  title: update.title,
                  description:
                    update.summary + "\n + Summarized by Boondoggle AI",
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

    let crm_update = crm;
    let new_crm_data = [];
    let to_dos = toDos;
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
        };
        crm_update.push(obj);
        new_crm_data.push(obj);
        to_dos.push(toDoObject);
        // }
      })
    );

    console.log("TODOS", to_dos);

    if (type == "airtable") {
      console.log("airtable");
      await sendToAirtable(new_crm_data, baseID, tableID, fieldOptions);
      // await Promise.all(
      //   crm_update.map((update) => {
      //     if (update.customer != "No Response") {
      //       console.log("here");
      //     }
      //   })
      // );
    } else {
      await sendToCRM(new_crm_data);
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
    localStorage.setItem("twitterLinked", true);
    setCRM(crm_update);
    setToDos(to_dos);
    localStorage.setItem("to_dos", to_dos);
  }

  async function captureOauthVerifier() {
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

    setCRMType(data[0].type);

    // const options = {
    //   method: "GET",
    //   url: `https://api.unified.to/unified/connection/${id}`,
    //   headers: {
    //     authorization:
    //       "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
    //   },
    // };

    // const results = await axios.request(options);
    // console.log("RESULTS", results);

    // await linkedInTest();

    // await twitterTest();

    // await extensionTest();

    //testing
    if (crmType == "airtable") {
      // const baseID = data[0].baseID;
      // const tableID = data[0].tableID;
      // console.log("base", baseID);
      // console.log(tableID);
      // const formula = '({fld46Pr3RcS1A5pe5} = "Blake Faulkner")';
      // const encodedFormula = encodeURIComponent(formula);
      // const url = `https://api.airtable.com/v0/${baseID}/${tableID}?filterByFormula=${encodedFormula}`;
      // axios
      //   .get(url, {
      //     headers: {I have
      //       Authorization: `Bearer ${id}`,
      //     },
      //   })
      //   .then(async (res) => {
      //     let data = res.data.records;
      //     console.log(data);
      //   })
      //   .catch(async (err) => {
      //     if (err.response.status == 401) {
      //       await getRefreshTokenAirtable(id);
      //     }
      //   });
    }

    // const url = `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://airtable.com/oauth2/v1/token`;

    // axios
    //   .post(
    //     url,
    //     {
    //       code: code,
    //       client_id: client_id,
    //       redirect_uri: "http://localhost:3000/link",
    //       grant_type: "authorization_code",
    //       code_verifier: verifier,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //     }
    //   )
    //   .then(async (res) => {
    //     console.log(res.data.access_token);
    //     await props.db.from("data").insert({
    //       connection_id: res.data.access_token,
    //       crm_data: [],
    //       twitter_messages: [],
    //       twitterLinked: false,
    //       type: "airtable",
    //     });
    //   })
  }

  async function connectEmail() {
    const { data, error } = await props.db.functions.invoke("email-auth");
    console.log(data);
    window.open(data.url, "_self");
  }

  async function getEmails() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("CODE", code);

    const { data, error } = await props.db.functions.invoke("email-callback", {
      body: { code: code },
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

      await uploadEmails(data.id);
    }
  }

  async function uploadEmails(id) {
    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { identifier: id },
    });

    const connection_id = localStorage.getItem("connection_id");

    console.log(data);

    const emails = data.data.data;
    console.log(emails);

    const curData = await getCurrentData();

    let updated_CRM = curData.data;
    let to_dos = curData.tasks;

    let new_emails = [];

    await Promise.all(
      emails.map((email) => {
        const itemIndex = new_emails.findIndex(
          (item) => item.customer === email.from[0].name
        );

        if (itemIndex != -1) {
          new_emails[itemIndex].snippet = [
            ...new_emails[itemIndex].snippet,
            {
              message: email.snippet,
              sender: email.to,
            },
          ];
        } else {
          var obj = {
            id: email.id,
            customer: email.from[0].name,
            data: email,
            snippet: [
              {
                message: email.snippet,
                sender: email.to,
              },
            ],
          };

          new_emails.push(obj);
        }
      })
    );

    await Promise.all(
      new_emails.map(async (email) => {
        const from = `${email.data.from[0].name} (${email.data.from[0].email})`;
        const subject = email.data.subject;

        const snippetString = email.snippet
          .map((message) => `${message.sender}: ${message.message}`)
          .join("\n");

        const emailContext = `I have an conversation sent from ${from} to this array of  emails ${email.data.to}. This is an array containing the content of the conversaton: ${snippetString} under the subject: ${subject}.`;

        const titleCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${emailContext} Give a short title that captures what this conversation was about.`,
            },
          ],
          model: "gpt-4",
        });
        const title = titleCompletion.choices[0].message.content;
        const summaryCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${emailContext} Generate me a summary of this email in a few short sentences.`,
            },
          ],
          model: "gpt-4",
        });
        const summary = summaryCompletion.choices[0].message.content;

        const date = Date.now();

        var obj = {
          id: email.id,
          customer: email.customer,
          title: title,
          summary: summary,
          date: date,
          source: "Email",
          status: "Completed",
        };

        updated_CRM.push(obj);

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

        const responseCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${emailContext} Generate me a response to the last message of this conversation that I can copy and paste over based on the context of this conversation.`,
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
          source: "Email",
        };
        to_dos.push(toDoObject);
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
  }, []);

  return (
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
                    To automate access to your social accounts, Boondoggle uses
                    your session cookie. When you log into an account, a new
                    session cookie is created. When you log out or are
                    disconnected, the cookie expires. We will notify you if any
                    of your accounts disconnect.{" "}
                    <span className="connected-apps-howto-text-2">
                      Learn More
                    </span>
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
                    className={twitterLinked ? "linked-button" : "link-button"}
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
                      await connectEmail();
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
                    <p className="link-button-text" style={{ color: "black" }}>
                      Connect
                    </p>
                  </button>
                </div>

                <div className="connected-apps-cell">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                  <div className="connected-app-info-container">
                    <p className="connected-app-info-1">Instagram</p>
                    <p className="connected-app-info-2">Direct Messages</p>
                  </div>
                  <button className="link-button">
                    <p className="link-button-text" style={{ color: "black" }}>
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
                  {crmType == "crm" && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="35"
                        viewBox="0 0 33 35"
                        fill="none"
                      >
                        <path
                          d="M25.33 12.1601V8.14209C25.8615 7.89326 26.3116 7.49882 26.6279 7.00453C26.9443 6.51025 27.114 5.93638 27.1174 5.34953V5.25494C27.1151 4.43473 26.7884 3.64874 26.2086 3.06863C25.6287 2.48852 24.8429 2.16145 24.0227 2.15884H23.9281C23.1079 2.16107 22.3219 2.48779 21.7418 3.06764C21.1617 3.64748 20.8346 4.43332 20.832 5.25353V5.34812C20.8346 5.93172 21.0018 6.50273 21.3145 6.99549C21.6272 7.48826 22.0727 7.88276 22.5996 8.13362L22.6179 8.14209V12.1686C21.0817 12.4033 19.6352 13.0415 18.4263 14.0181L18.4432 14.0053L7.39155 5.39895C7.60175 4.61057 7.53198 3.7737 7.19413 3.03102C6.85628 2.28834 6.27128 1.68584 5.53887 1.32627C4.80647 0.966689 3.97201 0.872294 3.17779 1.05918C2.38357 1.24606 1.67876 1.70265 1.18355 2.3511C0.688334 2.99954 0.433379 3.79968 0.462156 4.61509C0.490932 5.43049 0.801659 6.21067 1.34135 6.82259C1.88105 7.43451 2.61629 7.84028 3.42171 7.97071C4.22713 8.10114 5.05285 7.94815 5.75809 7.53784L5.74115 7.54631L16.6064 16.0045C15.6458 17.4447 15.1357 19.1383 15.141 20.8696C15.141 22.7656 15.741 24.5233 16.7603 25.9606L16.742 25.9337L13.4355 29.2402C13.1708 29.1548 12.8948 29.1095 12.6167 29.1061H12.6138C12.0462 29.1061 11.4912 29.2744 11.0192 29.5898C10.5472 29.9052 10.1794 30.3534 9.96211 30.8779C9.74487 31.4024 9.68803 31.9795 9.79878 32.5362C9.90953 33.093 10.1829 33.6044 10.5843 34.0058C10.9857 34.4072 11.4971 34.6806 12.0539 34.7914C12.6107 34.9021 13.1878 34.8453 13.7122 34.628C14.2367 34.4108 14.685 34.0429 15.0003 33.5709C15.3157 33.0989 15.4841 32.544 15.4841 31.9763C15.4807 31.6908 15.4335 31.4075 15.3443 31.1363L15.3499 31.156L18.6211 27.8849C19.6872 28.6989 20.925 29.2591 22.2402 29.5227C23.5554 29.7863 24.9134 29.7465 26.2109 29.4062C27.5084 29.0659 28.7111 28.4342 29.7277 27.559C30.7442 26.6839 31.5478 25.5884 32.0772 24.3559C32.6066 23.1234 32.8479 21.7864 32.7827 20.4466C32.7175 19.1069 32.3476 17.7996 31.7011 16.6243C31.0546 15.449 30.1486 14.4367 29.0519 13.6643C27.9552 12.892 26.6968 12.3799 25.3724 12.1672L25.3216 12.1601H25.33ZM23.969 25.3987C23.0743 25.3964 22.2003 25.1291 21.4575 24.6304C20.7146 24.1317 20.1362 23.424 19.7954 22.5967C19.4545 21.7695 19.3665 20.8597 19.5424 19.9825C19.7183 19.1052 20.1503 18.2998 20.7838 17.6679C21.4172 17.036 22.2237 16.606 23.1014 16.4323C23.9791 16.2586 24.8886 16.3489 25.7151 16.6918C26.5415 17.0347 27.2477 17.6148 27.7446 18.3589C28.2414 19.103 28.5066 19.9777 28.5066 20.8724V20.8752C28.5066 22.0757 28.0297 23.2269 27.1809 24.0758C26.332 24.9246 25.1808 25.4015 23.9803 25.4015L23.969 25.3987Z"
                          fill="#FF9D2A"
                        />
                      </svg>
                      <div className="connected-app-info-container">
                        <p className="connected-app-info-1">HubSpot</p>
                        <p className="connected-app-info-2">
                          Connected Account: raj@boondoggle.ai
                        </p>
                      </div>
                    </>
                  )}
                  {crmType == "airtable" && (
                    <>
                      <img
                        src={require("../../assets/landing/integrations/crm/airtable.png")}
                      ></img>
                      <div className="connected-app-info-container">
                        <p className="connected-app-info-1">Airtable</p>
                        {/* <p className="connected-app-info-2">
                          Connected Account: blake@boondoggle.ai
                        </p> */}
                      </div>
                    </>
                  )}

                  <button className="link-button" style={{ width: "auto" }}>
                    <p className="link-button-text" style={{ color: "black" }}>
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
                    <p className="integrations-table-column-header">Platform</p>
                  </div>

                  <div className="integrations-table-column">
                    <p className="integrations-table-column-header">
                      Account/Cookie/Key
                    </p>
                  </div>

                  <div className="integrations-table-column">
                    <p className="integrations-table-column-header">Accessed</p>
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
                      <p className="integrations-table-column-text">rajhacks</p>
                    </div>
                    <div className="integrations-table-column">
                      <p className="integrations-table-column-text">Just now</p>
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
                        raj@boondoggle.ai
                      </p>
                    </div>
                    <div className="integrations-table-column">
                      <p className="integrations-table-column-text">Just now</p>
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
  );
}

export default Home;
