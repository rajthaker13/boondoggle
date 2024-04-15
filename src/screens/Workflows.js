import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import WorkflowSidebar from "../components/WorkflowSidebar";
import { TextInput, Card, Badge, Button } from "@tremor/react";
import {
  RiSearchLine,
  RiMailLine,
  RiAddLin,
  RiLinkedinBoxFill,
  RiTwitterFill,
} from "@remixicon/react";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import hubspot from "../assets/landing/integrations/crm_svg/hubspot.svg";
import LoadingOverlay from "react-loading-overlay";

function Workflows(props) {
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
  const [cookieError, setCookieError] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [memberWelcome, setMemberWelcome] = useState(false);
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

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div>
        {openCookieModal && (
          <div className="modal-overlay">
            <div
              className="modal-content"
              style={{
                height: "auto",
                width: "30vw",
                maxWidth: "60vw",
                display: "flex",
                flexDirection: "column",
                background: "#fff",
              }}
            >
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7 mb-[5vh]">
                Create Workflow
              </div>
              <div class="w-[338px] text-gray-700 text-sm font-medium font-['Inter'] leading-tight mb-[5vh]">
                What type of messages do you want scraped?
              </div>
              <input class="w-[100%] h-[5vh] text-gray-700 text-sm font-medium font-['Inter'] leading-tight mb-[5vh]"></input>
              <Button
                variant="primary"
                onClick={async () => {
                  await getSessionCookie();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}

        <Sidebar db={props.db} selectedTab={1} />
        <div class="w-[100vw] h-[88vh] p-[38px] bg-gray-50 justify-center items-start gap-[18px] inline-flex">
          <WorkflowSidebar />
          <div class="w-[100vw] h-[auto] justify-start items-center gap-[18px] flex-column">
            <TextInput icon={RiSearchLine} placeholder="Search..." />
            <div class="flex flex-wrap justify-start gap-[18px] mt-[5vh]">
              <Card className="mx-auto w-[25vw]">
                <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                  <div className="flex gap-1.5 mr-20 items-center">
                    <div className="w-[50px] h-7 px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                      <HiOutlineMail width={15} height={15} />
                      <img src={hubspot} className="w-[15px] h-[15px]" />
                    </div>
                    <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7n whitespace-nowrap">
                      Gmail {`->`} HubSpot
                    </p>
                  </div>
                  <Badge color="emerald-500">
                    <p>Connected</p>
                  </Badge>
                </div>
                <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                  Automate the entry of your emails daily into HubSpot, <br />
                  create contacts, update contacts, and more.
                </p>

                <Button variant="primary" className="w-[100%]">
                  Use template
                </Button>
              </Card>
              <Card className="mx-auto w-[25vw]">
                <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                  <div className="flex gap-1.5 mr-20 items-center">
                    <div className="w-[50px] h-7 px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                      <RiLinkedinBoxFill
                        color="#0077B5"
                        width={15}
                        height={15}
                      />
                      <img src={hubspot} className="w-[15px] h-[15px]" />
                    </div>
                    <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7n whitespace-nowrap">
                      LinkedIn {`->`} HubSpot
                    </p>
                  </div>
                  <Badge color="emerald-500">
                    <p>Connected</p>
                  </Badge>
                </div>
                <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                  Automate the entry of your LinkedIn messages daily into <br />
                  HubSpot, create contacts, update contacts, and more.
                </p>

                <Button
                  variant="primary"
                  className="w-[100%]"
                  onClick={() => {
                    setOpenCookieModal(true);
                  }}
                >
                  Use template
                </Button>
              </Card>
              <Card className="mx-auto w-[25vw]">
                <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                  <div className="flex gap-1.5 mr-20 items-center">
                    <div className="w-[50px] h-7 px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                      <RiTwitterFill color="#349DF0" />
                      <img src={hubspot} className="w-[15px] h-[15px]" />
                    </div>
                    <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7n whitespace-nowrap">
                      Twitter {`->`} HubSpot
                    </p>
                  </div>
                  <Badge color="emerald-500">
                    <p>Connected</p>
                  </Badge>
                </div>
                <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                  Automate the entry of your Twitter messages daily into <br />
                  HubSpot, create contacts, update contacts, and more.
                </p>

                <Button variant="primary" className="w-[100%]">
                  Use template
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Workflows;
