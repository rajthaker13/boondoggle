import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header";
import WorkflowSidebar from "../../components/WorkflowSidebar";
import { Button, Dialog, DialogPanel, Select, SelectItem } from "@tremor/react";
import workflowData from "../../data/workflows";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQAMapReduceChain } from "langchain/chains";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import LoadingBar from "../Dashboard/LoadingBar";
import { CRITERIA_WEIGHTS } from "../../functions/schemas/criteria_weights";
import SpamModal from "./SpamModal";
import { useFlow } from "@frigade/react";

let progress = 0;

export function getWorkflowsProgress() {
  return progress;
}

function Workflows(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openCookieModal, setOpenCookieModal] = useState(false);
  const [source, setSource] = useState("Email");
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [cookieError, setCookieError] = useState("");
  const [connectedEmailsList, setConnectedEmailsList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState({});
  const [hamEmails, setHamEmails] = useState([]);
  const [spamEmails, setSpamEmails] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [showSpamModal, setShowSpamModal] = useState(false);
  const [fetchingEmails, setFetchingEmails] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [emailWorkflow, setEmailWorkflow] = useState(false);
  const [linkedinWorkflow, setLinkedinWorkflow] = useState(false);
  const [modalArray, setModalArray] = useState([]);

  // Calculate completeness score for different types of CRM data
  const scoreCompleteness = (item, type) => {
    let itemScore = 0;
    let totalWeight = 0;

    // Define scoring criteria based on data type (Contact, Deal, etc.)
    let criteria;
    if (type === "Contact") {
      criteria = CRITERIA_WEIGHTS.contact;
    } else if (type === "Deal") {
      criteria = CRITERIA_WEIGHTS.deal;
    } else if (type === "Company") {
      criteria = CRITERIA_WEIGHTS.company;
    }

    let missingFields = [];
    let missingFieldsPenalty = 0;
    // Calculate score based on presence of fields and their weighted importance
    // Add missing fields to the issue arrays
    for (const [field, weight] of Object.entries(criteria.fields)) {
      if (typeof weight === "object") {
        // Nested object handling for note field
        if (item[field] !== undefined) {
          for (const [subField, subWeight] of Object.entries(weight)) {
            totalWeight += subWeight;
            if (Array.isArray(item[field])) {
              if (
                item[field][0] !== undefined &&
                item[field][0][subField] !== undefined
              ) {
                itemScore += subWeight;
              } else {
                missingFields.push(`${field}[0].${subField}`);
                missingFieldsPenalty += subWeight;
              }
            } else if (item[field][subField] !== undefined) {
              itemScore += subWeight;
            } else {
              missingFields.push(`${field}.${subField}`);
              missingFieldsPenalty += subWeight;
            }
          }
        } else {
          for (const subField of Object.keys(weight)) {
            totalWeight += weight[subField];
            missingFields.push(`${field}.${subField}`);
            missingFieldsPenalty += weight[subField];
          }
        }
      } else {
        totalWeight += weight;
        if (item[field] !== undefined) {
          itemScore += weight;
        } else {
          missingFields.push(field);
          missingFieldsPenalty += weight;
        }
      }
    }

    const maxPossibleScore = 100; // Maximum possible score, considering recency, creation, and no missing fields
    const objectPriority = 100; //Maximum Priority because the entry is new

    // Normalize scores to 0-100 scale
    const missingFieldNormalized = (missingFieldsPenalty / totalWeight) * 100; // Missing fields normalized score

    return {
      itemScore: (100 - missingFieldNormalized) * objectPriority, // Adjusted score calculation
      totalWeight: maxPossibleScore * objectPriority, // Account for recency weight in the total weight
      missingFields: missingFields,
    };
  };

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
    let allContacts = [];
    let allCompanies = [];
    let newContacts = [];
    let newEvents = [];
    let newCompanies = [];
    let crmUpdate = [];

    //fetches and saves current CRM data from Supabase
    const fetch_crm = await getCRMData();
    let admin_crm_update = fetch_crm.admin_crm_data;
    let user_crm_update = fetch_crm.user_crm_data;
    let crm_points = fetch_crm.crm_points;
    let crm_max_points = fetch_crm.crm_max_points;

    //iterates through all new data objects
    await Promise.all(
      new_crm_data.map(async (update) => {
        const regexCustomer = update.customer.replace(/\s*\([^)]*\)/g, "");
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
          const supabaseContact = admin_crm_update.find(
            (contact) => contact["customer"] === current_crm.name
          );

          const uniqueId = generateUniqueId();

          if (supabaseContact) {
            crmUpdate.push({
              id: uniqueId,
              date: update.date,
              customer: supabaseContact.customer,
              title: update.title,
              position: supabaseContact.position,
              summary: update.summary,
              company: supabaseContact.company,
              url: supabaseContact.url,
              source: source,
              ...(source === "Email"
                ? { email: update.email }
                : supabaseContact.email != null
                ? { email: supabaseContact.email }
                : { email: null }),
            });
          } else {
            let userURL = null;
            if (source === "LinkedIn") {
              userURL = update.url;
            } else if (source === "Email") {
              userURL = await fetchEnrichmentProfile(update, "EmailURL");
            }

            if (userURL === null) {
              userURL = "";
            }

            crmUpdate.push({
              id: uniqueId,
              date: update.date,
              customer: current_crm.name,
              title: update.title,
              position: current_crm.title,
              summary: update.summary,
              company: current_crm.company,
              url: userURL,
              source: source,
              ...(source === "Email"
                ? { email: update.email }
                : update.email != null
                ? { email: update.email }
                : { email: null }),
            });
          }

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
          data.result.title = update.title;
          data.result.summary = update.summary;
          if (!allContacts.some((contact) => contact.id === current_crm.id)) {
            allContacts.push(current_crm);
          }
          newEvents.push(data.result);
        } else {
          //if contact does not exist, creates contact in the CRM
          let contact;
          if (source == "Email") {
            const enrichObj = await fetchEnrichmentProfile(update, "Email");
            if (enrichObj !== null) {
              contact = {
                name: enrichObj.name,
                title: enrichObj.title,
                address: enrichObj.address,
                company: enrichObj.company,
                company_ids: enrichObj.company_ids,
                emails: [
                  {
                    email: update.email,
                    type: "WORK",
                  },
                ],
              };
              const uniqueId = generateUniqueId();
              crmUpdate.push({
                id: uniqueId,
                date: update.date,
                customer: enrichObj.name,
                title: update.title,
                position: enrichObj.title,
                summary: update.summary,
                company: enrichObj.company,
                email: update.email,
                url: enrichObj.url,
                source: source,
              });
              if (enrichObj.isNewCompany) {
                if (
                  allCompanies.length == 0 ||
                  !allCompanies.some(
                    (company) => company.name == enrichObj.companyData.name
                  )
                ) {
                  allCompanies.push(enrichObj.companyData);
                  newCompanies.push(enrichObj.companyData);
                }
              } else {
                if (
                  allCompanies.length == 0 ||
                  !allCompanies.some(
                    (company) => company.name == enrichObj.companyData.name
                  )
                ) {
                  allCompanies.push(enrichObj.companyData);
                }
              }
            } else {
              contact = null;
            }
          } else if (source == "LinkedIn") {
            const enrichObj = await fetchEnrichmentProfile(
              update.messageData,
              "LinkedIn"
            );
            // Updating with 'enrichObj'
            if (enrichObj != null) {
              contact = {
                name: enrichObj.name,
                title: enrichObj.title,
                address: enrichObj.address,
                company: enrichObj.company,
                company_ids: enrichObj.company_ids,
              };
              const uniqueId = generateUniqueId();
              crmUpdate.push({
                id: uniqueId,
                date: update.date,
                customer: enrichObj.name,
                title: update.title,
                position: enrichObj.title,
                summary: update.summary,
                company: enrichObj.company,
                email: null,
                url: enrichObj.url,
                source: source,
              });
              if (enrichObj.isNewCompany) {
                allCompanies.push(enrichObj.companyData);
                newCompanies.push(enrichObj.companyData);
              } else if (
                allCompanies.length == 0 ||
                !allCompanies.some(
                  (company) => company.name == enrichObj.companyData.name
                )
              ) {
                allCompanies.push(enrichObj.companyData);
              }
            } else {
              contact = null;
            }
          }
          if (contact !== null) {
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
            data.event.title = update.title;
            data.event.summary = update.summary;
            if (!data.contact.error) {
              if (
                !allContacts.some((contact) => contact.id === data.contact.id)
              ) {
                allContacts.push(data.contact);
                newContacts.push(data.contact);
              }
            }
            if (data.event && !data.event.error) {
              newEvents.push(data.event);
            }
          }
        }
      })
    );

    let tempModalArray = [];
    for (const contact of allContacts) {
      let modalObj = {
        contact: contact,
        company: null,
        events: [],
        contactIsNew: false,
      };
      for (const newContact of newContacts) {
        if (newContact.id == contact.id) {
          modalObj.contactIsNew = true;
        }
      }
      for (const company of allCompanies) {
        if (contact.company == company.name) {
          modalObj.company = company;
        }
      }
      for (const event of newEvents) {
        for (const id of event.contact_ids) {
          if (id == contact.id) {
            modalObj.events.push(event);
          }
        }
      }
      tempModalArray.push(modalObj);
    }
    setModalArray(tempModalArray);

    const contactEmbeddings = await generateEmbeddingsMessages(
      newContacts,
      "Contact"
    );
    const eventEmbeddings = await generateEmbeddingsMessages(
      newEvents,
      "Event"
    );
    const companyEmbeddings = await generateEmbeddingsMessages(
      newCompanies,
      "Company"
    );
    const allEmbeddings = {
      contacts: contactEmbeddings,
      events: eventEmbeddings,
      companies: companyEmbeddings,
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

    if (crmUpdate.length > 0) {
      admin_crm_update = [...admin_crm_update, ...crmUpdate];
      user_crm_update = [...user_crm_update, ...crmUpdate];

      if (newContacts.length > 0) {
        newContacts.map((item) => {
          const completenessScore = scoreCompleteness(item, "Contact");
          crm_points += completenessScore.itemScore;
          crm_max_points += completenessScore.totalWeight;
        });
      }
      if (newCompanies.length > 0) {
        newCompanies.map((item) => {
          const completenessScore = scoreCompleteness(item, "Company");
          crm_points += completenessScore.itemScore;
          crm_max_points += completenessScore.totalWeight;
        });
      }

      // Update CRM with new data
      await props.db
        .from("data")
        .update({
          crm_data: admin_crm_update,
          crm_points: crm_points,
          crm_max_points: crm_max_points,
        })
        .eq("connection_id", connection_id);

      const uid = localStorage.getItem("uid");

      await props.db
        .from("users")
        .update({
          crm_data: user_crm_update,
        })
        .eq("id", uid);
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
    const current_crm_points = data[0].crm_points;
    const current_crm_max_points = data[0].crm_max_points;
    const type = data[0].type;

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
      crm_points: current_crm_points,
      crm_max_points: current_crm_max_points,
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
  async function fetchLinkedin() {
    // Extension ID
    setIsLoading(true);
    setShowSpamModal(false);
    setFetchingEmails(true);

    const extensionId = "lgeokfaihmdoipgmajekijkfppdmcnib";

    // Message you want to send to the extension
    const message = {
      action: "getCookie",
      url: "https://www.linkedin.com/", // Specify the correct URL
      cookieName: "li_at", // Specify the correct cookie name
    };

    try {
      progress = 0;

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
            progress = 40;
            const messageArray = data.text;
            console.log(messageArray);

            let messageObjects = [];
            for (let i = 0; i < messageArray.length; i++) {
              const messageData = messageArray[i];
              if (messageData.name !== "" && messageData.url) {
                //generates title and summary
                const response = await generateLinkedinCRMData(messageData);
                progress++;
                //checks if spam based on summary and message data
                const isSpamMessage = await checkLinkedInMessage(
                  response.summary,
                  messageData
                );
                progress += 2;

                //create message obj that is compatible with spam modal
                const date = Date.now();
                const uniqueId = generateUniqueId();

                const messageObj = {
                  id: uniqueId,
                  data: {
                    author_member: {
                      name: messageData.name,
                    },
                    subject: response.title,
                  },
                  summary: response.summary,
                  customer: messageData.name,
                  date: date,
                  messageData: messageData,
                  title: response.title,
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

                messageObj.isSpam = isSpamMessage;
                messageObjects.push(messageObj);
              } else {
                progress += 3;
              }
            }

            messageObjects.sort((a, b) => a.isSpam - b.isSpam);

            setAllEmails(messageObjects);

            setIsLoading(false);
            setShowSpamModal(true);
            setLinkedinWorkflow(true);
            setFetchingEmails(false);
            progress = 0;
          } else {
            setCookieError("LoggedIn");
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      setCookieError("Extension");
      setIsLoading(false);
      progress = 0;
    }
  }

  async function uploadLinkedin() {
    setIsLoading(true);
    setShowSpamModal(false);

    let new_crm_data = [];
    progress = 0;

    //Generates title, summary, to-do item, response for each chat history
    for (let i = 0; i < allEmails.length; i++) {
      if (!allEmails[i].isSpam && allEmails[i].url != null) {
        // Update CRM and ToDo Lists
        new_crm_data.push(allEmails[i]);
      }
      progress++;
    }

    progress = 65;

    //updates the CRM
    await sendToCRM(new_crm_data, "LinkedIn");

    progress = 100;

    setIsLoading(false);
    localStorage.setItem("linkedInLinked", true);
    setOpenCookieModal(false);
    setShowSpamModal(true);
    setLinkedinWorkflow(false);
    progress = 0;
    // Clean up URL by removing query parameters
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
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

  async function createCompanyCRM(
    companyName,
    companyProfile,
    companyLinkedIn
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
        return {
          id: 0,
          data: {},
          isNewCompany: false,
        };
      }
    }

    const currentCompanyCRM = listCompanyResults.data[0];

    var companyCRMObject = {
      name: companyName,
      websites: [companyProfile.website, companyLinkedIn],
      ...(companyProfile.hq !== null
        ? {
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
          }
        : { address: {} }),
      description: companyProfile.description,
      employees: companyProfile.company_size_on_linkedin,
    };

    if (currentCompanyCRM != undefined) {
      companyCRMObject.id = currentCompanyCRM.id;
      return {
        id: currentCompanyCRM.id,
        data: companyCRMObject,
        isNewCompany: false,
      };
    } else {
      const createCompanyOptions = {
        method: "POST",
        url: `https://api.unified.to/crm/${connection_id}/company`,
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
      companyCRMObject.id = createCompanyResults.data.id;
      return {
        id: createCompanyResults.data.id,
        data: companyCRMObject,
        isNewCompany: true,
      };
    }
  }

  // Function to fetch enrichment profile data based on the provided email
  async function fetchEnrichmentProfile(profileData, source) {
    // Define API request options
    // Based on enrich_profile, lookup_depth, and email
    const getLinkedInURLByEmail = (email) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/profile/resolve/email?lookup_depth=deep&email=${email}`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const getLinkedInProfileByURL = (url) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/v2/linkedin?url=${url}&use_cache=if-recent`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const fetchCompanyInformation = (url) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/company?url=${url}`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    try {
      let userLinkedInUrl;
      let profile = null;
      if (source === "Email") {
        console.log("Profile Data", profileData);
        try {
          const userURLResponse = await axios.request(
            getLinkedInURLByEmail(profileData.email)
          );
          const userURLData = userURLResponse.data;

          if (userURLData.linkedin_profile_url !== null) {
            const userProfileResponse = await axios.request(
              getLinkedInProfileByURL(userURLData.linkedin_profile_url)
            );
            userLinkedInUrl = userURLData.linkedin_profile_url;
            profile = userProfileResponse.data;
          } else {
            return null;
          }
        } catch (error) {
          console.error("URL BY EMAIL ERROR", error);
          return null;
        }
      } else if (source === "LinkedIn") {
        try {
          const userProfileResponse = await axios.request(
            getLinkedInProfileByURL(profileData.url)
          );
          userLinkedInUrl = profileData.url;
          profile = userProfileResponse.data;
        } catch (error) {
          console.error("LinkedIn url error", error);
          return null;
        }
      } else if (source === "EmailURL") {
        const userURLResponse = await axios.request(
          getLinkedInURLByEmail(profileData.email)
        );
        const userURLData = userURLResponse.data;

        if (userURLData.linkedin_profile_url !== null) {
          return userURLData.linkedin_profile_url;
        } else {
          return null;
        }
      }

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

        if (
          latestExperience.company_linkedin_profile_url !== null &&
          latestExperience.company !== null
        ) {
          const companyProfileResponse = await axios.request(
            fetchCompanyInformation(
              latestExperience.company_linkedin_profile_url
            )
          );
          const companyProfile = companyProfileResponse.data;

          const createCompanyResponse = await createCompanyCRM(
            companyProfile.name,
            companyProfile,
            latestExperience.company_linkedin_profile_url
          );

          const conciseProfile = {
            websites: [
              `https://www.linkedin.com/in/${profile.public_identifier}`,
            ],
            url: `https://www.linkedin.com/in/${profile.public_identifier}`,
            title: latestExperience.title,
            name: profile.full_name,
            address: createCompanyResponse.data.address,
            company: companyProfile.name,
            companyUrl: latestExperience.company_linkedin_profile_url,
            emails: profile.personal_emails,
            telephones: profile.personal_numbers,
            company_ids: [createCompanyResponse.id],
            isNewCompany: createCompanyResponse.isNewCompany,
            companyData: createCompanyResponse.data,
          };

          return conciseProfile;
        } else {
          return null;
        }
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

  //Checks if email is automated
  function isAutomatedEmail(customerEmail) {
    const regex =
      /no[-]?reply|invoice|notifications|notification|support|team/i;
    return regex.test(customerEmail);
  }

  /**
   * Uploads emails, processes them, and updates the CRM with relevant information.
   *
   * Fetches email credentials and retrieves emails from the server using Unified. Iterates through all emails, filtering out undesirable emails.
   * If an email exists in the CRM, it is updated, if not, it is created and added to new_emails.
   *
   * new_emails is iterated through, and for each email, a title, summary, to-do item, and response is generated
   */
  async function fetchEmails() {
    setIsLoading(true);
    setFetchingEmails(true);
    setShowSpamModal(false);
    setModalStep(0);

    const id = selectedEmail.connection_id;
    const userEmail = selectedEmail.email;

    //fetches emails
    const { data, error } = await props.db.functions.invoke("get-emails", {
      body: { user_id: id },
    });

    progress = 50;

    let emails = data.emailData;
    setAllEmails(emails);

    console.log("All emails", emails);

    localStorage.setItem("user_email", userEmail);

    let new_emails = [];

    let validEmailsIndex = 0;

    // Filters each email
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      //Check if email has author name and should be summarized
      if (email.author_member.name !== "") {
        // Find other emails with the same parent_message_id
        const children = emails.filter((child, index) => {
          if (
            child.parent_message_id === email.parent_message_id &&
            index !== i
          ) {
            return true; // Include child in children list
          }
          return false; // Exclude child from children list
        });

        // Remove children from emails array
        children.forEach((child) => {
          const index = emails.indexOf(child);
          if (index > -1) {
            emails.splice(index, 1);
          }
        });

        const isAutomated = isAutomatedEmail(email.author_member.email);

        if (!isAutomated) {
          createNewEmailObj(new_emails, email, userEmail, validEmailsIndex);

          const { title, summary } = await generateEmailCRMData(
            new_emails[validEmailsIndex]
          );
          new_emails[validEmailsIndex].title = title;
          new_emails[validEmailsIndex].summary = summary;

          const isSpamEmail = await checkEmail(new_emails[validEmailsIndex]);
          new_emails[validEmailsIndex].isSpam = isSpamEmail;

          validEmailsIndex++;
        }
      }

      progress++;
    }

    new_emails.sort((a, b) => a.isSpam - b.isSpam);

    console.log("new_emails", new_emails);

    setAllEmails(new_emails);

    setIsLoading(false);
    setFetchingEmails(false);
    setShowSpamModal(true);
    setEmailWorkflow(true);

    progress = 0;
  }

  async function uploadEmails() {
    setModalArray([]);

    progress = 0;

    let new_crm_data = [];

    allEmails.map(async (email) => {
      if (!email.isSpam) {
        new_crm_data.push(email);
      }
      progress++;
    });

    progress = 67;

    await sendToCRM(new_crm_data, "Email");

    progress = 100;

    // End loading indicator
    setIsLoading(false);
    setShowSpamModal(true);
    setEmailWorkflow(false);
    progress = 0;

    // Clean up URL by removing query parameters
    var cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }

  /**
   * Checks if an email is spam based on certain criteria.
   * @param {Object} email - The email to check.
   * @returns {boolean} - Returns whether the email is a spam message or not.
   */
  async function checkEmail(email) {
    const SPAM_DB_LENGTH = 5170; // Number of emails in training dataset
    const NUM_SPAM_EMAILS = 1499; // Number of emails that are labeled spam in vector db
    const SPAM_EMAIL_COMPARISIONS = 50;
    const MAX_TOKEN_SIZE = 8191; // Define your maximum token size here

    const subject = email.data.subject.toLowerCase();

    let body = email.data.message.replace(/<[^>]+>/g, ""); // Remove HTML content

    const index = pinecone.index("spam-data");
    const ns1 = index.namespace("version-3");

    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `Subject: ${subject} \r\n ${body}`.substring(0, MAX_TOKEN_SIZE),
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
        spamMatchCount / SPAM_EMAIL_COMPARISIONS > threshold // Check if queried data has higher ratio than threshold
      ) {
        return true;
      } else {
        const customer = email.data.author_member.name;
        const emailMessageTypes = [
          new Document({ pageContent: "Marketing" }),
          new Document({ pageContent: "Sales" }),
          new Document({ pageContent: "Recruiting" }),
          new Document({ pageContent: "Networking" }),
          new Document({ pageContent: "Spam" }),
          new Document({ pageContent: "Customer" }),
        ];
        const emailMessageTypesText = [
          "Marketing",
          "Sales",
          "Recruiting",
          "Networking",
          "Spam",
          "Customer",
        ];
        const model = new ChatOpenAI({
          model: "gpt-4o",
          temperature: 0.2,
          openAIApiKey: process.env.REACT_APP_OPENAI_KEY,
        });
        const chain = loadQAMapReduceChain(model);
        const res = await chain.invoke({
          input_documents: emailMessageTypes,
          question:
            `Based on the following summary of a Email conversation from ${customer}, determine what type of message this is. Only return 'Customer' if the conversation should be logged in a company's CRM. Here is the coversation: Subject: ${subject} \r\n ${body}.`.substring(
              0,
              MAX_TOKEN_SIZE
            ),
        });
        const filteredMessageType = emailMessageTypesText.find((messageType) =>
          res.text.includes(messageType)
        );
        if (filteredMessageType === "Customer") {
          return false;
        } else {
          return true;
        }
      }
    } catch (error) {
      console.error("Error processing email:", error);
      return true;
    }
  }

  /**
   * Checks if an LinkedIn conversaton is spam
   * @param {String} summary - The summary of the LinkedIn conversation.
   * @param {Object} messageData = Message object with details of the LinkedIn conversation
   * @returns {boolean} - Returns whether the LinkedIn conversation is spam or not.
   */
  async function checkLinkedInMessage(summary, messageData) {
    const customer = messageData.name;
    const linkedInMessageTypes = [
      new Document({ pageContent: "Marketing" }),
      new Document({ pageContent: "Sales" }),
      new Document({ pageContent: "Recruiting" }),
      new Document({ pageContent: "Networking" }),
      new Document({ pageContent: "Spam" }),
      new Document({ pageContent: "Customer" }),
    ];

    const linkedInMessageTypesText = [
      "Marketing",
      "Sales",
      "Recruiting",
      "Networking",
      "Spam",
      "Customer",
    ];
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.2,
      openAIApiKey: process.env.REACT_APP_OPENAI_KEY,
    });
    const chain = loadQAMapReduceChain(model);
    const res = await chain.invoke({
      input_documents: linkedInMessageTypes,
      question: `Based on the following summary of a LinkedIn conversation between ${customer} and ${messageData.profile}, determine what type of message this is. Only return 'Customer' if the conversation is related to sales for offerings that ${messageData.profile} is providing and should be logged in their company's CRM. You are placing these messages from the point of view of ${messageData.profile}. Here is the summary: ${summary}.`,
    });
    const filteredMessageType = linkedInMessageTypesText.find((messageType) =>
      res.text.includes(messageType)
    );

    if (filteredMessageType === "Customer") {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Creates a new email entry in the new_emails array.
   * @param new_emails - The array of new emails.
   * @param email - The email data to add.
   * @param userEmail - The user's email address.
   */
  function createNewEmailObj(new_emails, email, userEmail, index) {
    const date = Date.now();

    if (email.author_member.email == userEmail) {
      var obj = {
        id: email.id,
        customer: email.destination_members[0].name
          ? email.destination_members[0].name
          : "",
        email: email.destination_members[0].email
          ? email.destination_members[0].email
          : "",
        data: email,
        emailObject: email,
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member,
        ],
        date: date,
        url: null,
        address: {
          city: null,
          country: null,
          country_code: null,
          region: null,
        },
        type: "OUTBOUND",
        company: null,
        emails: [],
        telephones: [],
        source: "Email",
        status: "Completed",
      };

      new_emails.splice(index, 0, obj);
    } else {
      var obj = {
        id: email.id,
        customer: email.author_member.name ? email.author_member.name : "",
        email: email.author_member.email ? email.author_member.email : "",
        data: email,
        emailObject: email,
        participants: [
          ...(email.mentioned_members || []),
          ...(email.hidden_members || []),
          ...(email.destination_members || []),
          email.author_member,
        ],
        date: date,
        url: null,
        address: {
          city: null,
          country: null,
          country_code: null,
          region: null,
        },
        type: "INBOUND",
        company: null,
        emails: [],
        telephones: [],
        source: "Email",
        status: "Completed",
      };

      new_emails.splice(index, 0, obj);
    }
  }

  /**
   * Generates title, summary, to-do item, and response for an email.
   * @param {Object} email - The email data.
   * @param {string} concatString - A string of the email chain, if there is a chain
   * @returns An object containing title, summary, toDoTitle, and toDoResponse.
   */
  async function generateEmailCRMData(email) {
    const from = `${email.data.author_member.name} (${email.data.author_member.email})`;
    const to = email.data.destination_members
      ? `${email.data.destination_members[0].name} (${email.data.destination_members[0].email})`
      : `${selectedEmail.name}`;
    const subject = email.data.subject;
    const MAX_SNIPPET_SIZE = 5000;

    const emailContext = `You are an automated CRM entry assistant for businesses and have a conversation sent from ${from} to ${to}. 
    This is a string containing the content of the conversation: ${email.data.message.substring(
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

  const flowId = "flow_YBmeka6n";
  const { flow } = useFlow(flowId);

  useEffect(() => {
    if (flow && flow.getCurrentStep().id == "workflows-tooltip") {
      flow.getCurrentStep().complete();
    }
  }, [flow]);

  return (
    <div>
      {isLoading && !fetchingEmails && (
        <LoadingBar
          messages={["Analyzing content...", "Uploading data to CRM..."]}
          isLoading={isLoading}
          screen={"workflows"}
        />
      )}

      {isLoading && fetchingEmails && (
        <LoadingBar
          messages={[
            "Fetching messages...",
            "Filtering spam...",
            "Generating summaries...",
          ]}
          isLoading={isLoading}
          screen={"workflows"}
        />
      )}
      {!isLoading && (
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
                      setOpenCookieModal(false);
                      await fetchEmails();
                    } else if (source == "LinkedIn") {
                      await fetchLinkedin();
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </DialogPanel>
          </Dialog>

          <Dialog
            open={showSpamModal}
            onClose={(val) => {
              if (!isLoading && !showSpamModal) {
                setShowSpamModal(val);
              }
            }}
            static={true}
          >
            <DialogPanel
              style={{
                width: "100%",
                maxWidth: "75vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div class="text-gray-700 text-lg font-bold font-['Inter'] leading-7 mb-[2vh]">
                {modalStep == 0
                  ? "Adjust Messages"
                  : modalStep == 1
                  ? "Review Messages"
                  : "Review Updates"}
              </div>
              {modalStep == 0 && (
                <SpamModal
                  allEmails={allEmails}
                  setAllEmails={setAllEmails}
                  step={modalStep}
                />
              )}
              {modalStep == 1 && (
                <SpamModal allEmails={hamEmails} step={modalStep} />
              )}
              {modalStep == 2 && (
                <SpamModal allEmails={modalArray} step={modalStep} />
              )}
              <div className="flex flex-col space-y-2 mt-4 items-center">
                <Button
                  variant="primary"
                  color="blue"
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    width: "30%",
                  }}
                  onClick={async () => {
                    if (modalStep == 1) {
                      setIsLoading(true);
                      setModalStep(2);
                      setShowSpamModal(false);
                      if (emailWorkflow) {
                        await uploadEmails();
                      } else if (linkedinWorkflow) {
                        await uploadLinkedin();
                      }
                    } else if (modalStep == 0) {
                      let tempHamEmails = [];
                      for (const email of allEmails) {
                        if (!email.isSpam) {
                          tempHamEmails.push(email);
                        }
                      }
                      setHamEmails(tempHamEmails);
                      setModalStep(1);
                    } else {
                      setShowSpamModal(false);
                      flow.steps.get("workflows-checklist").complete();
                    }
                  }}
                >
                  {modalStep === 0
                    ? "Continue"
                    : modalStep == 1
                    ? "Finish"
                    : "Done"}
                </Button>
                {modalStep === 1 && (
                  <Button
                    variant="secondary"
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      width: "30%",
                    }}
                    onClick={() => setModalStep(0)}
                  >
                    Back
                  </Button>
                )}
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
      )}
    </div>
  );
}

export default Workflows;
