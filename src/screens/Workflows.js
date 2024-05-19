import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import WorkflowSidebar from "../components/WorkflowSidebar";
import {
  Button,
  SearchSelect,
  SearchSelectItem,
  Dialog,
  DialogPanel,
} from "@tremor/react";
import LoadingOverlay from "react-loading-overlay";
import workflowData from "../data/workflows";
import ClickAwayListener from "react-click-away-listener";

function Workflows(props) {
  const client_id = process.env.REACT_APP_AIRTABLE_KEY;
  const [openModal, setOpenModal] = useState(false);
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
  const [source, setSource] = useState("Email");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [cookieError, setCookieError] = useState("");

  const [selectedBase, setSelectedBase] = useState([]);
  const [airtableTables, setAirtableTables] = useState([]);
  const [airtableFields, setAirtableFields] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [twitterField, setTwitterField] = useState("");
  const [linkedInField, setLinkedInField] = useState("");
  const [socialField, setSocialField] = useState("");
  const [notesField, setNotesField] = useState("");

  const [isAdmin, setIsAdmin] = useState(true);
  const [memberWelcome, setMemberWelcome] = useState(false);
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

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

  async function selectTable(event) {
    console.log(event);
    setSelectedTable(event);
    if (event != "") {
      const tableObject = airtableTables.find((table) => table.id == event);
      console.log(tableObject);
      setAirtableFields(tableObject.fields);
    } else {
      setAirtableFields([]);
    }
  }

  useEffect(() => {
    async function checkData() {
      console.log("Hey");
      const id = localStorage.getItem("connection_id");
      const options = {
        method: "GET",
        url: `https://api.unified.to/crm/${id}/deal`,
        headers: {
          authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
        },
      };
      const results = await axios.request(options);

      console.log("RESULTS", results);
    }

    async function compareStrings() {
      console.log("Compaire");
    }

    compareStrings();

    // checkData();
  }, []);

  async function twitterCredentials() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    return data[0].twitter_info;
  }

  async function twitterContacts() {
    const twitterInfo = await twitterCredentials();
    const { data, error } = await props.db.functions.invoke("get-twitter-dms", {
      body: {
        token: twitterInfo.token,
        secret: twitterInfo.secret,
        oauthVerifier: twitterInfo.oauthVerifier,
      },
    });
    if (data) {
      await updateCRM(data);
    }
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
    await sendToCRM(new_crm_data, "Twitter");

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

  function generateUniqueId() {
    const timestamp = Date.now().toString(); // Get current timestamp as string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    const uniqueId = timestamp + randomString; // Concatenate timestamp and random string
    return uniqueId; // Extract first 10 characters to ensure 10-digit length
  }

  async function getUserCRMData() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    return {
      crm_data: data[0].crm_data,
      tasks: data[0].tasks,
    };
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
            await sendToCRM(new_crm_data, "LinkedIn");

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

  async function getEmailCredentials() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("id", uid);

    return {
      id: data[0].email_grant_id,
      userEmail: data[0].connected_email,
    };
  }

  async function uploadEmails() {
    setIsLoading(true);
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const emailCreds = await getEmailCredentials();
    console.log("CREDS", emailCreds);
    const id = emailCreds.id;
    const userEmail = emailCreds.userEmail;

    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { identifier: id, source: urlWithoutParams },
    });

    const connection_id = localStorage.getItem("connection_id");

    const emails = data.data.data;

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
        // let spamRespone;
        // try {
        //   spamRespone = await axios.post(
        //     "https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://spamcheck.postmarkapp.com/filter",
        //     {
        //       email: email.latestDraftOrMessage.body,
        //       options: "short",
        //     },
        //     {
        //       headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //       },
        //     }
        //   );
        // } catch (error) {
        //   if (error) {
        //     await new Promise((resolve) => setTimeout(resolve, 5000));
        //     spamRespone = await axios.post(
        //       "https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://spamcheck.postmarkapp.com/filter",
        //       {
        //         email: email.latestDraftOrMessage.body,
        //         options: "short",
        //       },
        //       {
        //         headers: {
        //           Accept: "application/json",
        //           "Content-Type": "application/json",
        //         },
        //       }
        //     );
        //   }
        // }

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

          let status = "Completed";
          // if (spamRespone.data.score >= 7) {
          //   status = "Completed";
          // } else if (spamRespone.data.score >= 5) {
          //   status = "Pending";
          // } else {
          //   status = "Rejected";
          // }

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

    await sendToCRM(new_crm_data, "Email");

    // if (type == "airtable") {
    //   await pushToAirtable(new_crm_data, "Email");
    // } else {
    //   await sendToCRM(new_crm_data, "Email");
    // }

    setIsLoading(false);

    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }

  async function linkWithTwitter() {
    const url = window.location.href;
    const { data, error } = await props.db.functions.invoke("twitter-login-3", {
      body: { url },
    });
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div>
        <Dialog
          open={openCookieModal}
          onClose={(val) => setOpenCookieModal(val)}
          static={true}
        >
          <DialogPanel>
            <div
              className="modal-content"
              style={{
                height: "auto",
                width: "100%",
                maxWidth: "60vw",
                display: "flex",
                flexDirection: "column",
                background: "#fff",
              }}
            >
              <div class="text-gray-700 text-lg font-bold font-['Inter'] leading-7 mb-[2vh]">
                Create Workflow
              </div>
              <div class="w-[100%] h-9 justify-start items-center gap-2.5 inline-flex mb-[2vh]">
                <div class="grow shrink basis-0 pl-3 pr-2.5 py-2 bg-white rounded-md shadow border border-gray-200 flex-col justify-start items-start gap-2.5 inline-flex">
                  <div class="self-stretch justify-start items-start gap-2.5 inline-flex">
                    <div class="grow shrink basis-0 text-gray-700 text-sm font-normal font-['Inter'] leading-tight">
                      {source}
                    </div>
                    <div class="w-5 h-5 relative"></div>
                  </div>
                </div>
                <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                  {`->`}
                </div>
                <div class="grow shrink basis-0 pl-3 pr-2.5 py-2 bg-white rounded-md shadow border border-gray-200 flex-col justify-start items-start gap-2.5 inline-flex">
                  <div class="self-stretch justify-start items-start gap-2.5 inline-flex">
                    <div class="grow shrink basis-0 text-gray-700 text-sm font-normal font-['Inter'] leading-tight">
                      {localStorage.getItem("crmType") == "airtable"
                        ? "Airtable"
                        : "CRM"}
                    </div>
                    <div class="w-5 h-5 relative"></div>
                  </div>
                </div>
              </div>

              <div class="w-[338px] text-gray-700 text-sm font-bold font-['Inter'] leading-tight mb-[2vh]">
                What type of messages do you want scraped?
              </div>
              <input
                class="px-3 py-2 bg-white rounded-lg shadow border border-gray-200 justify-start items-start gap-2 inline-flex mb-[5vh]"
                placeholder="Type anything you want..."
              ></input>
              <Button
                variant="primary"
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 5000));
                  localStorage.setItem("linkedinLinked", true);
                  setOpenCookieModal(false);
                  setIsLoading(false);
                  // if (source == "Email") {
                  //   await uploadEmails();
                  // } else if (source == "LinkedIn") {
                  //   await getSessionCookie();
                  // } else if (source == "Twitter") {
                  //   await twitterContacts();
                  // }
                }}
              >
                Confirm
              </Button>
            </div>
          </DialogPanel>
        </Dialog>

        <Sidebar db={props.db} selectedTab={1} />
        <div class="w-[100vw] h-[auto] min-h-[92vh] p-[38px] bg-gray-50 justify-center items-start gap-[18px] inline-flex">
          <WorkflowSidebar
            selectedWorkflow={selectedWorkflow}
            setSelectedWorkflow={setSelectedWorkflow}
          />
          <div class="w-[100vw] h-[auto] justify-start items-center gap-[18px] flex-column">
            <div class="flex flex-wrap justify-start gap-[18px]">
              {workflowData.map((workflow) => {
                if (selectedWorkflow != "") {
                  if (workflow.source == selectedWorkflow) {
                    return (
                      <div
                        class="w-[445px] h-[285px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex hover:bg-blue-200"
                        onClick={() => {
                          setSource(workflow.source);
                          setOpenCookieModal(true);
                        }}
                      >
                        <img src={workflow.src}></img>
                        <div class="self-stretch justify-start items-center gap-2.5 inline-flex">
                          <div class="grow shrink basis-0 text-gray-700 text-lg font-semibold font-['Inter'] leading-7">
                            {workflow.title}
                          </div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div
                      class="w-[445px] h-[285px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex hover:bg-blue-200"
                      onClick={() => {
                        setSource(workflow.source);
                        setOpenCookieModal(true);
                      }}
                    >
                      <img src={workflow.src}></img>
                      <div class="self-stretch justify-start items-center gap-2.5 inline-flex">
                        <div class="grow shrink basis-0 text-gray-700 text-sm font-semibold font-['Inter'] leading-7 whitespace-nowrap overflow-hidden">
                          {workflow.title}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Workflows;
