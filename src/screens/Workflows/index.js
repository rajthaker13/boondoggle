import React, { useState } from "react";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header";
import WorkflowSidebar from "../../components/WorkflowSidebar";
import { Button, Dialog, DialogPanel } from "@tremor/react";
import LoadingOverlay from "react-loading-overlay";
import workflowData from "../../data/workflows";

function Workflows(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openCookieModal, setOpenCookieModal] = useState(false);
  const [source, setSource] = useState("Email");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [cookieError, setCookieError] = useState("");

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  /**
   * Uses an id variable in local storage to get twitter account credentials from Supabase
   * @returns Information about a user's twitter account
   */
  async function twitterCredentials() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    return data[0].twitter_info;
  }

  /**
   * Gets the twitter dms of a user using their credentials and calls uploadTwitter with the data
   */
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
      await uploadTwitter(data);
    }
  }

  /**
   * Updates CRM and database based on Twitter DMs.
   * 
   * Gets current CRM data then iterates through each message within the new data that it is passed.
   * If the chat history exists, it is updated. If it doesn't exist, a message object is created and pushed to twitter_messages. 
   * 
   * twitter_messages (now updated) is iterated through, and for each chat history, a title, summary, to-do item, and response is 
   * generated and saved as data objects. An array of these objects is sent to the CRM and saved.
   * 
   * These objects are then saved in the Supabase db.
   * 
   * @param userData - Twitter DM data with which the CRM is to be updated
   */
  async function uploadTwitter(userData) {
    const fetch_crm = await getCRMData();

    let admin_crm_update = fetch_crm.admin_crm_data;
    let admin_to_dos = fetch_crm.admin_to_dos;
    let user_crm_update = fetch_crm.user_crm_data;
    let user_to_dos = fetch_crm.user_to_dos;
    let new_crm_data = [];

    let twitter_messages = [];

    const meUser = userData.meUser.data.username;
    const meName = userData.meUser.data.name;

    //Updates twitter_messages with new data
    await Promise.all(
      userData.messages.map(async (lead) => {
        const itemIndex = twitter_messages.findIndex(
          (item) => item.id === lead.messageData.dm_conversation_id
        );
        if (itemIndex !== -1) {
          if (lead.userData[0].username !== meUser) {
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
        
        const response = await generateTwitterCRMData(dm)

        const date = Date.now();

        //saves title, summary, todos, and response in data objects
        var obj = {
          id: dm.id,
          customer: dm.customer != meName ? dm.customer : "No Response",
          title: response.title,
          summary: response.summary,
          date: date,
          source: "Twitter",
          status: "Completed",
        };
        var toDoObject = {
          id: dm.id,
          customer: dm.customer != meName ? dm.customer : "No Response",
          title: response.toDoTitle,
          response: response.toDoResponse,
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

    /**
     * Generates title, summary, to-do item, response for each twitter chat history
     * @param dm An instance of a Twitter chat
     * @returns An object containing title, summary, toDoTitle, and toDoResponse.
     */
    async function generateTwitterCRMData(dm) {
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

        return {
          title: titleCompletion,
          summary: summary,
          toDoTitle: toDoTitle,
          toDoResponse: toDoResponse
        };
    }


    const type_crm = localStorage.getItem("crmType");
    //Updates the CRM
    await sendToCRM(new_crm_data, "Twitter");

    const new_connection_id = localStorage.getItem("connection_id");
    const uid = localStorage.getItem("uid");

    //Updates Supabase
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
    setIsLoading(false);
    localStorage.setItem("twitterLinked", true);
    localStorage.setItem("to_dos", user_to_dos);
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }

  /**
   * captures the OAuth verifier from the URL, and retrieves stored OAuth tokens from localStorage. Calls Supabase function to fetch Twitter DMs,
   * if successful, calls uploadTwitter() to update the CRM with the fetched data.
   */
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
      await uploadTwitter(data);
    }
  }

  /**
   * Generates a unique id based on time+random num.
   * @returns 10 digit unique ID string
   */
  function generateUniqueId() {
    const timestamp = Date.now().toString(); // Get current timestamp as string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    const uniqueId = timestamp + randomString; // Concatenate timestamp and random string
    return uniqueId; // Extract first 10 characters to ensure 10-digit length
  }

  /**
   * Gets saved CRM data from Supabase based on the uid and returns it as an object
   * @returns An object containing the CRM data as well as to-do tasks for the user
   */
  async function getUserCRMData() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    return {
      crm_data: data[0].crm_data,
      tasks: data[0].tasks,
    };
  }

  /**
   * Queries Unified for the CRM data of a particular customer
   * @param {JSON} options parameters for the Axios request to Unified API, including customer name
   * @returns Reponse from Unified containg CRM data for a particular customer
   */
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

  /**
   * For each new data object, the CRM is queried using Unified for its particular contact. 
   * A Supabase function is called to update the CRM if the contact exists, if not, a Supabase function creates a new contact in the CRM.
   * @param new_crm_data - an array of data objects
   * @param {string} source - what 3rd party the data came from
   */
  async function sendToCRM(new_crm_data, source) {
    const connection_id = localStorage.getItem("connection_id");

    //iterates through all new data objects
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

            //queries for CRM data of a particular contact
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
            //queries for ID  of a particular contact
            try {
              idResults = await axios.request(idOptions);
            } catch {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              idResults = await axios.request(idOptions);
            }
            const user_crm_id = idResults.data[0].id;

            //if contanct exists, updates the contact in the CRM
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
            } else { //if contact does not exist, creates contact in the CRM
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

  /**
   * Gets saved CRM data from Supabase based on the connection_id and returns it as an object
   * @returns an object containing fields for all relevant CRM data
   */
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

  /**
   * Updates CRM and database based on Linkedin messages.
   * 
   * Fetches Linkedin session cookie and if successful, calls Supabase function to scrape Linkedin messages. 
   * 
   * Iterates through chat histories and for each chat history, a title, summary, to-do item, and response is 
   * generated and saved as data objects. An array of these objects is sent to the CRM and saved.
   * 
   * These objects are then saved in the Supabase db.
   */
  async function uploadLinkedin() {
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
      //Fetches Linkedin cookie
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

            //Generates title, summary, to-do item, response for each chat history
            await Promise.all(
              messageArray.map(async (messageData) => {
                const customer = messageData.name;
                const response = await generateLinkedinCRMData(messageData)

                const date = Date.now();
                const uniqueId = generateUniqueId();

                console.log("MessageData", messageData);

                //saves title, summary, todos, and response in data objects
                var obj = {
                  id: uniqueId,
                  customer: customer,
                  title: response.title,
                  summary: response.summary,
                  date: date,
                  url: messageData.url,
                  source: "LinkedIn",
                  status: "Completed",
                };

                var toDoObject = {
                  id: uniqueId,
                  customer: customer,
                  title: response.toDoTitle,
                  response: response.toDoResponse,
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
            //updates the CRM
            await sendToCRM(new_crm_data, "LinkedIn");

            const new_connection_id = localStorage.getItem("connection_id");
            const uid = localStorage.getItem("uid");

            //updates Supabase
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
            setIsLoading(false);
            localStorage.setItem("linkedInLinked", true);
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

  /**
   * Generates title, summary, to-do item, and reponse for a Linkedin message
   * @param messageData - A Linkedin chat history
   * @returns An object containing title, summary, toDoTitle, and toDoResponse.
   */
  async function generateLinkedinCRMData(messageData) {
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

    return {
      title: title,
      summary: summary,
      toDoTitle: toDoTitle,
      toDoResponse: toDoResponse
    };
  }

  /**
   * Gets email credentials based on the uid
   * @returns An object containing the email and its id
   */
  async function getEmailCredentials() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("id", uid);

    console.log("uid")
    console.log(uid)

    console.log("email creds")
    console.log(data)

    console.log("crm id: ", data[0].crm_id)

    return {
      id: data[0].email_grant_id,
    };
  }

  /**
   * Uploads emails, processes them, and updates the CRM with relevant information.
   * 
   * Fetches email credentials and retrieves emails from the server using Nylas. Iterates through all emails, filtering out undesirable emails.
   * If an email exists in the CRM, it is updated, if not, it is created and added to new_emails.
   * 
   * new_emails is iterated through, and for each email, a title, summary, to-do item, and response is generated
   */
  async function uploadEmails() {
    setIsLoading(true);
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const emailCreds = await getEmailCredentials();
    const id = emailCreds.id;

    const connection_id = localStorage.getItem("connection_id")

    //fetches emails
    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { connection_id: connection_id, user_id: id }
    });

    console.log("This is the email data")
    console.log(data) 
    console.log("This is the error")
    console.log(error)

    let channels = data.channelData
    let emails = data.emailData
    console.log("emails: ", typeof(emails))
    console.log(emails)

    let userEmail = channels[0].members[0].email

    //fetches and saves current CRM data from Supabase
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

    //Filters and processes each email
    for(const email of emails) {
      if (shouldProcessEmail(email)) {
        const fromIndex = new_emails.findIndex(
            (item) => item.customer === email.author_member.name
        );
        const toIndex = new_emails.findIndex(
            (item) => item.customer === email.destination_members[0].name
        );

        if (fromIndex !== -1 || toIndex !== -1) {
            updateExistingEmail(new_emails, fromIndex, toIndex, email);
        } else {
            createNewEmail(new_emails, email, userEmail);
        }
      }
    }

    // Generate CRM entries for new emails
    await Promise.all(
        new_emails.map(async (email) => {
            if (email.customer) {
                const { title, summary, toDoTitle, toDoResponse } = await generateEmailCRMData(email, userEmail);
                const date = Date.now();

                const obj = {
                    id: email.id,
                    customer: email.customer,
                    email: email.email,
                    title: title,
                    summary: summary,
                    date: date,
                    source: "Email",
                    status: email.status,
                };

                const toDoObject = {
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

                admin_crm_update.push(obj);
                user_crm_update.push(obj);
                new_crm_data.push(obj);
                admin_to_dos.push(toDoObject);
                user_to_dos.push(toDoObject);
            }
        })
    );

    // Update CRM with new data
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

    await sendToCRM(new_crm_data, "Email");

    // End loading indicator
    setIsLoading(false);

    // Clean up URL by removing query parameters
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }

  /**
   * Checks if an email should be processed based on certain criteria.
   * @param {Object} email - The email to check.
   * @returns {boolean} - Whether the email should be processed.
   */
  function shouldProcessEmail(email) {
    const body = email.message.toLowerCase();
    const author = email.author_member.name;
    return (
        author !== "" &&
        !body.includes("verify") &&
        !body.includes("verification") &&
        !body.includes("alert") &&
        !body.includes("confirmation") &&
        !body.includes("invitation") &&
        !body.includes("webinar") &&
        !body.includes("activation") &&
        !body.includes("unsubscribe") &&
        !body.includes("considering") &&
        !body.includes("tax") &&
        !body.includes("taxes") &&
        !body.includes("notification") &&
        !body.includes("demo") &&
        !body.includes("hesitate") &&
        !body.includes("registration") &&
        !body.includes("contact us") &&
        !body.includes("faq") &&
        !body.includes("luma") &&
        !body.includes("receipt") &&
        !body.includes("automation") &&
        !body.includes("automated") &&
        email.channel_id !== "DRAFT"
    );
  }

  /**
   * Updates an existing email entry in the new_emails array.
   * @param new_emails - The array of new emails.
   * @param fromIndex - The index of the email with the matching 'from' field.
   * @param toIndex - The index of the email with the matching 'to' field.
   * @param email - The email data to update.
   */
  function updateExistingEmail(new_emails, fromIndex, toIndex, email) {
    const sender = email.author_member.name
        ? email.author_member.name
        : email.author_member.email;

    if (fromIndex !== -1) {
        new_emails[fromIndex].snippet.push({ message: email.message, sender });
    } else if (toIndex !== -1) {
        new_emails[toIndex].snippet.push({ message: email.message, sender });
    }
  }

  /**
  * Creates a new email entry in the new_emails array.
  * @param new_emails - The array of new emails.
  * @param email - The email data to add.
  * @param userEmail - The user's email address.
  */
  function createNewEmail(new_emails, email, userEmail) {
    const sender = email.author_member.name
    ? email.author_member.name
    : email.author_member.email;
   

    if (email.author_member.email == userEmail) {
      var obj = {
        id: email.id,
        customer: email.destination_members[0].name
          ? email.destination_members[0].name
          : email.destination_members[0].email,
        email: email.destination_members[0].email,
        data: email,
        snippet: [
          {
            message: email.message,
            sender: sender
          },
        ],
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member
        ],
        type: "OUTBOUND",
        status: "Completed",
      };

      new_emails.push(obj);
    } else {
      var obj = {
        id: email.id,
        customer: email.author_member.name
          ? email.author_member.name
          : email.author_member.email,
        email: email.author_member.email,
        data: email,
        snippet: [
          {
            message: email.message,
            sender: sender
          },
        ],
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member
        ],
        type: "INBOUND",
        status: "Completed",
      };

      new_emails.push(obj);
    }
  }

  /**
 * Generates title, summary, to-do item, and response for an email.
 * @param {Object} email - The email data.
 * @param {string} userEmail - The user's email address.
 * @returns An object containing title, summary, toDoTitle, and toDoResponse.
 */
async function generateEmailCRMData(email, userEmail) {
  const from = `${email.data.author_member.name} (${email.data.author_member.email})`;
  const subject = email.data.subject;

  const snippetString = email.snippet
      .map((message) => `${message.sender}: ${message.message}`)
      .join("\n");

  const participantsString = email.participants
      .map((user) => user.name ? `${user.name}: ${user.email}` : user.email)
      .join("\n");

  const emailContext = `You are an automated CRM entry assistant. I have a conversation sent from ${from} with these participants: ${participantsString}. This is an array containing the content of the conversation: ${snippetString} under the subject: ${subject}. This is a ${email.type} conversation and in this context, you are the user associated with ${userEmail}.`;

  const titleCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `${emailContext} Give a short title that captures what this email thread was about.` }],
      model: "gpt-4",
  });

  const summaryCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `${emailContext} Generate me a summary of this email thread in a few short sentences.` }],
      model: "gpt-4",
  });

  const toDoTitleCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `${emailContext} Generate me a title for a to-do action item based on the context of this conversation.` }],
      model: "gpt-4",
  });

  const responseType = email.type === "OUTBOUND" ? "Follow-Up" : "Response";

  const responseCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `${emailContext} Generate me a ${responseType} to the last message of this conversation that I can copy and paste over based on the context of this conversation.` }],
      model: "gpt-4",
  });

  return {
      title: titleCompletion.choices[0].message.content,
      summary: summaryCompletion.choices[0].message.content,
      toDoTitle: toDoTitleCompletion.choices[0].message.content,
      toDoResponse: responseCompletion.choices[0].message.content,
  };
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
                   if (source == "Email") { //just uncommedted all these if statements
                     await uploadEmails();
                   } else if (source == "LinkedIn") {
                     await uploadLinkedin();
                   } else if (source == "Twitter") {
                     await uploadTwitter();
                   }
                }}
              >
                Confirm
              </Button>
            </div>
          </DialogPanel>
        </Dialog>

        <Header db={props.db} selectedTab={1} />
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
