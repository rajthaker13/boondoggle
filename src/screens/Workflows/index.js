import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header";
import WorkflowSidebar from "../../components/WorkflowSidebar";
import { Button, Dialog, DialogPanel, Select, SelectItem } from "@tremor/react";
import LoadingOverlay from "react-loading-overlay";
import workflowData from "../../data/workflows";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

function Workflows(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openCookieModal, setOpenCookieModal] = useState(false);
  const [source, setSource] = useState("Email");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [cookieError, setCookieError] = useState("");
  const [connectedEmailsList, setConnectedEmailsList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState({});

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
  });

  async function getUserData() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("id", uid);
    return data;
  }

  useEffect(() => {
    /**
     * Gets connected emails of user
     */
    async function getConnectedEmails() {
      const { data, error } = await props.db
        .from("users")
        .select()
        .eq("id", localStorage.getItem("uid"));
      if (data && data[0]) {
        let connectedEmails = data[0].email_data;
        setConnectedEmailsList(connectedEmails);
        setSelectedEmail(connectedEmails[0]);
      }
    }
    getConnectedEmails();
  }, []);

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
    let newContacts = [];
    let newEvents = [];
    console.log("New CRm Data", new_crm_data);

    //iterates through all new data objects
    await Promise.all(
      new_crm_data.map(async (update) => {
        if (
          (source == "Email" && update.status == "Completed") ||
          source == "LinkedIn"
        ) {
          if (update.customer != "") {
            let regexCustomer;
            if (source == "Email") {
              regexCustomer = update.email;
            } else if (source == "LinkedIn") {
              regexCustomer = update.customer;
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

            //queries for CRM data of a particular contact
            const results = await searchCRMforContact(options);
            const current_crm = results.data[0];
            let user_crm_id;

            const userData = await getUserData();

            //if employee_id isn't stored, find it using user email and save
            if (!userData[0].employee_id) {
              let idResults;
              const idOptions = {
                method: "GET",
                url: `https://api.unified.to/hris/${connection_id}/employee`,
                headers: {
                  authorization:
                    "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
                },
              };

              //queries for ID  of a particular contact
              try {
                idResults = await axios.request(idOptions);
              } catch {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                idResults = await axios.request(idOptions);
              }
              let foundEmail = false;
              const userEmail = localStorage.getItem("user_email");
              for (const employee of idResults.data) {
                //find id based on useremail in local store and save to db,
                if (foundEmail) {
                  break;
                }
                let employeeEmails = employee.emails;
                for (const email of employeeEmails) {
                  if (email.email == userEmail) {
                    user_crm_id = employee.id;
                    foundEmail = true;
                    break;
                  }
                }
              }
            } else {
              user_crm_id = userData[0].employee_id;
            }

            //if contanct exists, updates the contact in the CRM
            if (current_crm != undefined) {
              const event = {
                id: current_crm.id,
                type: "NOTE",
                note: {
                  description: `<b>${update.title}</b><br/><br/>${update.summary}<br/><br/>Summarized by Boondoggle AI`,
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
              newEvents.push(data.result);
            } else {
              console.log("Update", update);
              //if contact does not exist, creates contact in the CRM
              const companyID = await fetchCompanyEnrichmentDataLinnkedIn(
                update.company,
                update.companyUrl
              );
              console.log("Company ID", companyID);
              let contact;
              if (source == "Email") {
                contact = {
                  name: update.customer,
                  title: update.title,
                  address: update.address,
                  company: update.company,
                  emails: [
                    {
                      email: regexCustomer,
                      type: "WORK",
                    },
                  ],
                  telephones: update.telephones,
                };
              } else if (source == "LinkedIn") {
                contact = {
                  name: update.customer,
                  title: update.title,
                  address: update.address,
                  company: update.company,
                  ...(companyID !== null ? { company_ids: [companyID] } : {}),
                  ...(update.emails && update.emails.length > 0
                    ? { emails: update.emails }
                    : {}),
                  ...(update.telephones && update.telephones.length > 0
                    ? { telephones: update.telephones }
                    : {}),
                };
              }

              console.log("Contact Passed", contact);
              const { data, error } = await props.db.functions.invoke(
                "new-contact-unified",
                {
                  body: {
                    connection_id: connection_id,
                    contact: contact,
                    title: update.title,
                    description: `<b>${update.title}</b><br/><br/>${update.summary}<br/><br/>Summarized by Boondoggle AI`,
                    user_id: user_crm_id,
                  },
                }
              );
              newContacts.push(data.contact);
              newEvents.push(data.event);
            }
          }
        }
      })
    );
    const contactEmbeddings = await generateEmbeddingsMessages(
      newContacts,
      "Contact"
    );
    const eventEmbeddings = await generateEmbeddingsMessages(
      newEvents,
      "Event"
    );
    const allEmbeddings = {
      contacts: contactEmbeddings,
      events: eventEmbeddings,
    };

    const index = pinecone.index("boondoggle-data-4");

    const ns1 = index.namespace(connection_id);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Function to upsert embeddings to Pinecone
    const upsertEmbeddings = async (embeddings, type) => {
      if (Array.isArray(embeddings)) {
        for (const chunk of embeddings) {
          if (Array.isArray(chunk)) {
            let chunkArray = [];
            for (const chunkObject of chunk) {
              chunkArray.push(chunkObject);
            }
            let retries = 3;
            while (retries > 0) {
              try {
                await ns1.upsert(chunkArray);
                break;
              } catch (error) {
                retries--;
                if (retries === 0) {
                  throw error;
                }
                await delay(5000); // Wait for 5 seconds before retrying
              }
            }
          }
        }
      }
    };

    for (const [type, embeddings] of Object.entries(allEmbeddings)) {
      let retries = 3;
      while (retries > 0) {
        try {
          await upsertEmbeddings(embeddings, type);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error;
          }
          await delay(5000); // Wait for 5 seconds before retrying
        }
      }
    }
  }

  async function generateEmbeddingsMessages(data, type) {
    // Chunk large array into small chunks
    const chunkData = (array, size) =>
      array.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(array.slice(i, i + size));
        return acc;
      }, []);

    const processChunk = async (chunk) => {
      return await Promise.all(
        chunk.map(async (item) => {
          try {
            const splitter = new RecursiveCharacterTextSplitter({
              chunkSize: 500,
              chunkOverlap: 100,
            });

            const output = await splitter.createDocuments([
              JSON.stringify(item),
            ]);

            let result = [];
            await Promise.all(
              output.map(async (chunk) => {
                let response;

                for (let attempt = 1; attempt <= 3; attempt++) {
                  try {
                    response = await openai.embeddings.create({
                      model: "text-embedding-3-small",
                      input: chunk.pageContent,
                    });
                    break; // Exit the loop if the request is successful
                  } catch (err) {
                    if (attempt === 3) {
                      throw err; // Rethrow the error after the final attempt
                    }
                    await new Promise((resolve) =>
                      setTimeout(resolve, attempt * 2000)
                    ); // Increase delay with each attempt
                  }
                }

                const embedding = response.data[0].embedding;

                const obj = {
                  id: item.id,
                  values: embedding,
                  metadata: {
                    type,
                    ...item,
                    emails: item.emails && JSON.stringify(item.emails),
                    telephones:
                      item.telephones && JSON.stringify(item.telephones),
                    address: item.address && JSON.stringify(item.address),
                    note: item.note && JSON.stringify(item.note),
                    meeting: item.meeting && JSON.stringify(item.meeting),
                    call: item.call && JSON.stringify(item.call),
                    task: item.task && JSON.stringify(item.task),
                  },
                };

                result.push(obj);
              })
            );

            return result;
          } catch (error) {
            console.error(`Error generating embedding for ${type}:`, error);
            return null;
          }
        })
      );
    };
    const dataChunks = chunkData(data, 100); // Process data in chunks of 100

    let allResults = [];
    for (let chunk of dataChunks) {
      const chunkResults = await processChunk(chunk);
      allResults = allResults.concat(chunkResults);
    }

    return allResults;
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

    let user_crm_data = admin_crm_data;
    let user_to_dos = admin_to_dos;

    //Will use when team manager is implemented
    // if (localStorage.getItem("isAdmin") == "true") {
    //   user_crm_data = admin_crm_data;
    //   user_to_dos = admin_to_dos;
    // } else {
    //   const fetch_user_crm = await getUserCRMData();
    //   user_crm_data = fetch_user_crm.crm_data;
    //   user_to_dos = fetch_user_crm.tasks;
    // }
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

  // Function to fetch enrichment profile data based on the provided linkedin URL
  async function fetchLinkedInProfile(targetObj) {
    // Define API request options
    // Based on linkedIn profile
    const apiOptions = (targetObj) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/v2/linkedin?url=${targetObj.url}&fallback_to_cache=on-error&use_cache=if-present&personal_email=include&personal_contact_number=include`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    try {
      const response = await axios.request(apiOptions(targetObj));
      const profile = response.data;
      console.log("Profile", profile); // Log the response data
      if (profile !== null) {
        // Extracting the most recent experience
        const latestExperience = profile.experiences.reduce(
          (latest, current) => {
            const latestDate = new Date(
              latest.starts_at.year,
              latest.starts_at.month - 1,
              latest.starts_at.day
            );
            const currentDate = new Date(
              current.starts_at.year,
              current.starts_at.month - 1,
              current.starts_at.day
            );
            return currentDate > latestDate ? current : latest;
          },
          profile.experiences[0]
        );

        // Construct the new object
        const conciseProfile = {
          websites: [
            `https://www.linkedin.com/in/${profile.public_identifier}`,
          ],
          url: `https://www.linkedin.com/in/${profile.public_identifier}`,
          title: latestExperience.title,
          name: profile.full_name,
          address: {
            city: profile.city,
            country: profile.country_full_name,
            country_code: profile.country,
            region: profile.state,
          },
          company: latestExperience.company,
          companyUrl: latestExperience.company_linkedin_profile_url,
          emails: profile.personal_emails,
          telephones: profile.personal_numbers,
        };

        console.log("Concise Profile", conciseProfile);
        return conciseProfile;
      } else {
        console.error("Profile data is not available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      // Handle errors appropriately based on the error type
      if (error.response) {
        // Server responded with a status code with error info
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // No response was received after sending the request
        console.error("No response received");
      } else {
        // Error setting up the request
        console.error("Error setting up the request:", error.message);
      }
      return null;
    }
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
            const cookie = response.cookie;
            const { data, error } = await props.db.functions.invoke(
              "linked-scrape",
              {
                body: { session_cookie: cookie },
              }
            );
            const messageArray = data.text;

            let new_crm_data = [];

            //Generates title, summary, to-do item, response for each chat history
            for (let i = 0; i < messageArray.length; i++) {
              const messageData = messageArray[i];
              const customer = messageData.name;
              const response = await generateLinkedinCRMData(messageData);
              const isSpamMessage = await checkLinkedInMessage(
                response.title,
                response.summary
              );

              if (!isSpamMessage) {
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
                  address: {
                    city: null,
                    country: null,
                    country_code: null,
                    region: null,
                  },
                  company: null,
                  emails: [],
                  telephones: [],
                  source: "LinkedIn",
                  status: "Completed",
                };

                if (messageData.url != null) {
                  const enrichObj = await fetchLinkedInProfile(messageData);
                  // Updating 'obj' with 'enrichObj'
                  if (enrichObj != null) {
                    console.log("Enrich object", enrichObj);
                    console.log("Initial Object", obj);
                    obj.customer = enrichObj.name;
                    obj.url = enrichObj.url;
                    obj.title = enrichObj.title;
                    obj.address.city = enrichObj.address.city;
                    obj.address.country = enrichObj.address.country;
                    obj.address.country_code = enrichObj.address.country_code;
                    obj.address.region = enrichObj.address.region;
                    obj.company = enrichObj.company;
                    obj.companyUrl = enrichObj.companyUrl;
                    console.log("Object Update", obj);
                  }
                }
                // Update CRM and ToDo Lists
                new_crm_data.push(obj);
              }
            }

            const fetch_crm = await getCRMData();
            let admin_crm_update = fetch_crm.admin_crm_data;
            let admin_to_dos = fetch_crm.admin_to_dos;
            let user_crm_update = fetch_crm.user_crm_data;
            let user_to_dos = fetch_crm.user_to_dos;

            admin_crm_update = [...admin_crm_update, ...new_crm_data];
            user_crm_update = [...user_crm_update, ...new_crm_data];

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
            // Clean up URL by removing query parameters
            var cleanUrl = window.location.href.split("?")[0];
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
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
      .map((messageObject) => `${messageObject.sender}: ${messageObject.text}`)
      .join("\n");
    const linkedInContext = `You are an automated CRM entry assistant for businesses and have data about a LinkedIn conversation between you (${messageData.profile}) and the person you are talking to who is ${customer}}. This is an string containing the content of the conversation: ${messagesString}. In this context, you are ${messageData.profile} logging the note into the CRM and you should not respond as if you are an AI.`;
    let completionMessages = [
      { role: "system", content: linkedInContext },
      {
        role: "user",
        content: `Generate one sentence title that captures what this LinkedIn conversation is about. Do not return a response longer than one sentence.`,
      },
    ];

    const titleCompletion = await openai.chat.completions.create({
      messages: completionMessages,
      model: "gpt-4",
    });

    const summaryCompletion = await openai.chat.completions.create({
      messages: [
        ...completionMessages,
        {
          role: "assistant",
          content: titleCompletion.choices[0].message.content,
        },

        {
          role: "user",
          content: `Generate me a summary of this LinkedIn conversation. Do not talk as if you are AI, and enter the data as if you are ${messageData.profile} in third-person (Do not use any terms like I, we, etc.)`,
        },
      ],
      model: "gpt-4o",
    });

    return {
      title: titleCompletion.choices[0].message.content.replace(
        /^"(.*)"$/,
        "$1"
      ),
      summary: summaryCompletion.choices[0].message.content,
    };
  }

  // Function to fetch compant enrichment data based on the linkedIn url
  async function fetchCompanyEnrichmentDataLinnkedIn(
    companyName,
    companyLinkedInUrl
  ) {
    const connection_id = localStorage.getItem("connection_id");
    const listCompaniesOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${connection_id}/company`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
      params: {
        limit: 10,
        query: companyName,
      },
    };

    let listCompanyResults;

    try {
      listCompanyResults = await axios.request(listCompaniesOptions);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limited, wait for 2 seconds and retry the request
        await new Promise((resolve) => setTimeout(resolve, 2000));
        listCompanyResults = await axios.request(listCompaniesOptions); // Retry the request
      } else {
        // For other errors, throw the error
        throw error;
      }
    }

    console.log("List Company Results", listCompanyResults);

    const currentCompanyCRM = listCompanyResults.data[0];

    if (currentCompanyCRM != undefined) {
      console.log("Current Company CRM", currentCompanyCRM);
      return currentCompanyCRM.id;
    } else {
      const encodedCompanyLinkedInUrl = encodeURIComponent(companyLinkedInUrl);

      console.log("Encoded URL", encodedCompanyLinkedInUrl);
      const companyEnrichmentOptions = {
        method: "GET",
        maxBodyLength: Infinity,
        url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/company?url=${encodedCompanyLinkedInUrl}`,
        headers: {
          Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
          "X-Requested-With": "XMLHttpRequest",
        },
      };

      try {
        const companyEnrichmentResponse = await axios.request(
          companyEnrichmentOptions
        );
        const companyProfile = companyEnrichmentResponse.data;
        if (companyProfile !== null) {
          console.log("Company Profile", companyProfile);
          const companyCRMObject = {
            name: companyName,
            websites: [companyProfile.website, companyLinkedInUrl],
            address: {
              address1:
                companyProfile.hq.line_1 !== null
                  ? companyProfile.hq.line_1
                  : " ",
              city:
                companyProfile.hq.city !== null ? companyProfile.hq.city : " ",
              postal_code:
                companyProfile.hq.postal_code !== null
                  ? companyProfile.hq.postal_code
                  : " ",
              country:
                companyProfile.hq.country !== null
                  ? companyProfile.hq.country
                  : " ",
            },
            description: companyProfile.description,
            // industry: companyProfile.industry,
            employees: companyProfile.company_size_on_linkedin,
          };
          console.log("Company CRM OBject", companyCRMObject);
          const createCompanyOptions = {
            method: "POST",
            url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.unified.to/crm/${connection_id}/company`,
            headers: {
              authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0`,
            },
            data: companyCRMObject,
          };

          let createCompanyResults;

          try {
            createCompanyResults = await axios.request(createCompanyOptions);
          } catch (createCompanyError) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            createCompanyResults = await axios.request(createCompanyOptions);
          }

          console.log("Create Company results", createCompanyResults);
          return createCompanyResults.data.id;
        } else {
          return null;
        }
      } catch (companyEnrichmentError) {
        console.log(companyEnrichmentError);
        return null;
      }
    }
  }

  // Function to fetch enrichment profile data based on the provided email
  async function fetchEnrichmentProfile(issueObj) {
    // Define API request options
    // Based on enrich_profile, lookup_depth, and email
    const apiOptions = (issueObj) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/profile/resolve/email?enrich_profile=enrich&lookup_depth=deep&email=${issueObj.email}`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    try {
      console.log("APIQUERY", apiOptions(issueObj));
      const response = await axios.request(apiOptions(issueObj));
      const res = response.data;
      console.log("RESENRICH", JSON.stringify(response.data)); // Log the response data
      if (res !== null && res.linkedin_profile_url !== null) {
        const profile = res.profile;
        console.log("RESPROFILE", profile);
        // Extracting the most recent experience
        const latestExperience = profile.experiences.reduce(
          (latest, current) => {
            const latestDate = new Date(
              latest.starts_at.year,
              latest.starts_at.month - 1,
              latest.starts_at.day
            );
            const currentDate = new Date(
              current.starts_at.year,
              current.starts_at.month - 1,
              current.starts_at.day
            );
            return currentDate > latestDate ? current : latest;
          },
          profile.experiences[0]
        );

        const conciseProfile = {
          url: res.linkedin_profile_url,
          title: profile.occupation,
          name: profile.full_name,
          address: {
            city: profile.city,
            country: profile.country_full_name,
            country_code: profile.country,
            region: profile.state,
          },
          company: latestExperience.company,
          emails: profile.personal_emails,
          telephones: profile.personal_numbers,
        };

        console.log("RESCLEAN", conciseProfile);
        return conciseProfile;
      } else {
        console.error("Profile data is not available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      // Handle errors appropriately based on the error type
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // No response was received after sending the request
        console.error("No response received");
      } else {
        // Error setting up the request
        console.error("Error setting up the request:", error.message);
      }
      return null;
    }
  }

  /**
   * Uploads emails, processes them, and updates the CRM with relevant information.
   *
   * Fetches email credentials and retrieves emails from the server using Unified. Iterates through all emails, filtering out undesirable emails.
   * If an email exists in the CRM, it is updated, if not, it is created and added to new_emails.
   *
   * new_emails is iterated through, and for each email, a title, summary, to-do item, and response is generated
   */
  async function uploadEmails() {
    setIsLoading(true);
    const id = selectedEmail.connection_id;
    const userEmail = selectedEmail.email;

    const connection_id = localStorage.getItem("connection_id");

    //fetches emails
    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { user_id: id },
    });

    let emails = data.emailData;

    //let userEmail = channels[0].members[0].email //only works for gmail
    localStorage.setItem("user_email", userEmail);

    let new_crm_data = [];

    let new_emails = [];

    //Filters and processes each email
    for (const email of emails) {
      const isSpamEmail = await checkEmail(email);
      if (!isSpamEmail) {
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
          const { title, summary } = await generateEmailCRMData(
            email,
            userEmail
          );
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
          if (email.email != null) {
            const enrichObj = await fetchEnrichmentProfile(email);
            // Updating 'obj' with 'enrichObj'
            if (enrichObj != null) {
              obj.customer = enrichObj.name;
              obj.url = enrichObj.url;
              obj.title = enrichObj.title;
              obj.address.city = enrichObj.address.city;
              obj.address.country = enrichObj.address.country;
              obj.address.country_code = enrichObj.address.country_code;
              obj.address.region = enrichObj.address.region;
              obj.company = enrichObj.company;
              obj.telephones = enrichObj.telephones;
              console.log("UPDATE", obj);
            }
          }

          new_crm_data.push(obj);
        }
      })
    );

    //fetches and saves current CRM data from Supabase
    const fetch_crm = await getCRMData();

    let admin_crm_update = fetch_crm.admin_crm_data;
    let user_crm_update = fetch_crm.user_crm_data;

    admin_crm_update = [...admin_crm_update, ...new_crm_data];
    user_crm_update = [...user_crm_update, ...new_crm_data];

    // Update CRM with new data
    await props.db
      .from("data")
      .update({
        crm_data: admin_crm_update,
      })
      .eq("connection_id", connection_id);

    const uid = localStorage.getItem("uid");

    await props.db
      .from("users")
      .update({
        crm_data: user_crm_update,
        emailLinked: true,
      })
      .eq("id", uid);

    await sendToCRM(new_crm_data, "Email");

    // End loading indicator
    setIsLoading(false);
    setOpenCookieModal(false);

    // Clean up URL by removing query parameters
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
  /**
   * Checks if an email should be processed based on certain criteria.
   * @param {Object} email - The email to check.
   * @returns {boolean} - Whether the email should be processed.
   */
  async function checkEmail(email) {
    const SPAM_DB_LENGTH = 5170; // Number of emails in training dataset
    const NUM_SPAM_EMAILS = 1499; // Number of emails that are labeled spam in vector db
    const SPAM_EMAIL_COMPARISIONS = 50;
    const MAX_TOKEN_SIZE = 8191; // Define your maximum token size here

    const subject = email.subject.toLowerCase();
    let body = email.message.replace(/<[^>]+>/g, ""); // Remove HTML content
    body = body.substring(0, MAX_TOKEN_SIZE); //Adjusting for additional characters

    const index = pinecone.index("spam-data");
    const ns1 = index.namespace("version-3");

    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `Subject: ${subject} \n ${body}`,
      });

      const spamEmailResponse = await ns1.query({
        topK: SPAM_EMAIL_COMPARISIONS,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
      });

      const spamMatchesArray = spamEmailResponse.matches;
      const spamMatches = spamMatchesArray.map(
        (spamMatch) => spamMatch.metadata
      );

      let spamMatchCount = 0;

      spamMatches.map((spamEmail) => {
        if (spamEmail.label_num == 1) {
          spamMatchCount += 1;
        }
      });

      // Calculate the threshold based on the spam to non-spam ratio in the Vector DB
      const spamRatio = NUM_SPAM_EMAILS / SPAM_DB_LENGTH;
      const nonSpamRatio = 1 - spamRatio;
      const threshold = spamRatio / (spamRatio + nonSpamRatio);

      if (
        subject === "" ||
        email.channel_id === "DRAFT" ||
        spamMatchCount / SPAM_EMAIL_COMPARISIONS > threshold // Check if queried data has higher ratio than threshold
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error processing email:", error);
      return true;
    }
  }

  /**
   * Checks if an email should be processed based on certain criteria.
   * @param {Object} email - The email to check.
   * @returns {boolean} - Whether the email should be processed.
   */
  async function checkLinkedInMessage(title, summary) {
    const SPAM_DB_LENGTH = 5170; //Number of emails in training dataset
    const NUM_SPAM_EMAILS = 1499; //Number of emails that are labeled spam in vector db
    const SPAM_EMAIL_COMPARISIONS = 50;

    const index = pinecone.index("spam-data");
    const ns1 = index.namespace("version-3");

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `Subject: ${title} \n ${summary}`,
    });

    const spamEmailResponse = await ns1.query({
      topK: SPAM_EMAIL_COMPARISIONS,
      vector: embedding.data[0].embedding,
      includeMetadata: true,
    });

    const spamMatchesArray = spamEmailResponse.matches;
    const spamMatches = spamMatchesArray.map((spamMatch) => spamMatch.metadata);

    let spamMatchCount = 0;

    spamMatches.map((spamEmail) => {
      if (spamEmail.label_num == 1) {
        spamMatchCount += 1;
      }
    });

    // Calculate the threshold based on the spam to non-spam ratio in the Vector DB
    const spamRatio = NUM_SPAM_EMAILS / SPAM_DB_LENGTH;
    const nonSpamRatio = 1 - spamRatio;
    const threshold = spamRatio / (spamRatio + nonSpamRatio);

    if (
      spamMatchCount / SPAM_EMAIL_COMPARISIONS >
      threshold //Check if queried data has higher ratio than threshold
    ) {
      return true;
    } else {
      return false;
    }
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
            sender: sender,
          },
        ],
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member,
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
            sender: sender,
          },
        ],
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member,
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
    const MAX_SNIPPET_SIZE = 5000;

    const snippetString = email.snippet
      .map((message) => `${message.sender}: ${message.message}`)
      .join("\n");

    const emailContext = `You are an automated CRM entry assistant for businesses and have a conversation sent from ${from} to ${
      selectedEmail.name
    }. This is an array containing the content of the conversation: ${snippetString.substring(
      0,
      MAX_SNIPPET_SIZE
    )} under the subject: ${subject}. This is a ${
      email.type
    } conversation. In this context, you are ${
      selectedEmail.name
    } logging the note into the CRM and you should not respond as if you are an AI.`;

    let completionMessages = [
      { role: "system", content: emailContext },
      {
        role: "user",
        content: `Generate one sentence title that captures what this email conversation is about. Do not return a response longer than one sentence.`,
      },
    ];

    const titleCompletion = await openai.chat.completions.create({
      messages: completionMessages,
      model: "gpt-4",
    });

    const summaryCompletion = await openai.chat.completions.create({
      messages: [
        ...completionMessages,
        {
          role: "assistant",
          content: titleCompletion.choices[0].message.content,
        },

        {
          role: "user",
          content: `Generate me a summary of this email conversation. Do not talk as if you are AI, and enter the data as if you are ${selectedEmail.name} in third-person (Do not use any terms like I, we, etc.)`,
        },
      ],
      model: "gpt-4o",
    });

    return {
      title: titleCompletion.choices[0].message.content.replace(
        /^"(.*)"$/,
        "$1"
      ),
      summary: summaryCompletion.choices[0].message.content,
    };
  }

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div>
        <Dialog
          open={openCookieModal}
          onClose={(val) => {
            if (!isLoading) {
              setOpenCookieModal(val);
            }
          }}
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

              {source === "Email" && (
                <>
                  <div class="w-[338px] text-gray-700 text-sm font-bold font-['Inter'] leading-tight mb-[2vh]">
                    Select Email
                  </div>
                  <Select className="mb-[2vh]" defaultValue="1">
                    {connectedEmailsList.map((email, index) => {
                      return (
                        <SelectItem
                          value={(index + 1).toString()}
                          onClick={() => {
                            setSelectedEmail(email);
                          }}
                        >
                          {email.email}
                        </SelectItem>
                      );
                    })}
                  </Select>
                </>
              )}

              <Button
                variant="primary"
                onClick={async () => {
                  if (source == "Email") {
                    await uploadEmails();
                  } else if (source == "LinkedIn") {
                    await uploadLinkedin();
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
