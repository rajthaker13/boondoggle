import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import LoadingOverlay from "react-loading-overlay";
import "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
  RunnableBranch,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import Sidebar from "./Sidebar";
import "./index.css";
import boondoggleaiPic from "../../assets/boondoggleAI.png";
import userPic from "../../assets/user.png";

function BoondogggleAI(props) {
  // References and states to manage component behavior
  const chatContentRef = useRef(null);
  const pinecone = new Pinecone({
    apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
  });

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [query, setQuery] = useState(""); // Store user's query input
  const [isLoading, setIsLoading] = useState(false); // Loading state for async
  const [answer, setAnswer] = useState(""); // Store answer output

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  // Init system message for the AI assistant
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are an assistant that helps automatically analyze data from CRMs that are fed to you by Boondoggle AI. With the data I provide you, your job is to assign any question the user may ask related to data in their CRM. Type out your answers in plain English, and leave our any irrelevent data that is inputted. Be as detailed as possible, and provide any patterns/insights you may see to help the user answer questions.`,
    },
  ]);
  const [conversations, setConversations] = useState([]);
  const [convoID, setConvoID] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    // Scroll chat window
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [answer]);

  useEffect(() => {
    loadConversation(convoID);
  }, [convoID]);

  useEffect(() => {
    if (firstLoad) {
      fetchConversations();
      setFirstLoad(false);
    }
  });

  function generateUniqueId() {
    const timestamp = Date.now().toString(); // Get current timestamp as string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    const uniqueId = timestamp + randomString; // Concatenate timestamp and random string
    return uniqueId; // Extract first 10 characters to ensure 10-digit length
  }

  function formatText(text) {
    const formattedAnswer = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>bold</strong>
      .replace(/#### (.*?)(?=\n|$)/g, "<h4>$1</h4>") // Convert #### to <h4> tags
      .replace(/### (.*?)(?=\n|$)/g, "<h3>$1</h3>") // Convert ### to <h3> tags
      .replace(/\n/g, "<br>"); // Convert newlines to <br> tags
    return formattedAnswer;
  }

  const fetchConversations = async () => {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    if (data && data[0]) {
      setConversations(data[0].boondoggle_conversations);
    }
    setFirstLoad(false);
  };

  //get past conversation
  async function loadConversation(conversationId) {
    setConvoID(conversationId);

    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    const supaConversations = data[0].boondoggle_conversations;
    setConversations(supaConversations);

    const selectedConversation = supaConversations.find(
      (c) => c.id === conversationId
    );
    if (selectedConversation) {
      // Simulate loading chat history
      const chatContent = document.getElementById("boondoggle-ai-chat-content");
      chatContent.innerHTML = ""; // Clear current chat

      for (let i = 0; i < selectedConversation.messages.length; i++) {
        let msg = selectedConversation.messages[i];

        const messageElement = document.createElement("div");
        const imgElement = document.createElement("img");

        imgElement.style.width = "35px"; // Adjust the size as needed
        imgElement.style.height = "35px"; // Adjust the size as needed
        imgElement.style.borderRadius = "50%"; // Make it a circle
        imgElement.style.marginRight = "10px"; // Adjust spacing as needed

        const nameElement = document.createElement("span");
        nameElement.style.fontWeight = "bold";

        const profileWrapper = document.createElement("div");
        profileWrapper.className = "profile-wrapper";
        profileWrapper.style.display = "flex";
        profileWrapper.style.alignItems = "center";

        if (i % 2 == 0) {
          imgElement.src = userPic;
          nameElement.textContent = "User";
          profileWrapper.style.marginBottom = "10px"; // Add some spacing between the profile and the message
        } else {
          imgElement.src = boondoggleaiPic;
          nameElement.textContent = "Boondoggle AI";
          profileWrapper.style.marginBottom = "5px"; // Add some spacing between the profile and the message
        }

        profileWrapper.appendChild(imgElement);
        profileWrapper.appendChild(nameElement);

        messageElement.innerHTML = formatText(msg);

        const messageWrapper = document.createElement("div");
        messageWrapper.style.display = "flex";
        messageWrapper.style.flexDirection = "column";
        messageWrapper.style.marginBottom = "40px"; // Add two lines of spacing between messages

        messageWrapper.appendChild(profileWrapper);
        messageWrapper.appendChild(messageElement);

        chatContent.appendChild(messageWrapper);
      }
    }
  }

  // Handle user submits a query
  async function onBoondoggleQuery(event) {
    if (event.key == "Enter") {
      setIsLoading(true);
      const userQuery = query;
      setQuery("");
      setAnswer("");
      const boondoggleAiChatContent = document.getElementById(
        "boondoggle-ai-chat-content"
      );

      const messageElement = document.createElement("div");
      const imgElement = document.createElement("img");

      imgElement.style.width = "35px"; // Adjust the size as needed
      imgElement.style.height = "35px"; // Adjust the size as needed
      imgElement.style.borderRadius = "50%"; // Make it a circle
      imgElement.style.marginRight = "10px"; // Adjust spacing as needed

      const nameElement = document.createElement("span");
      nameElement.style.fontWeight = "bold";

      const profileWrapper = document.createElement("div");
      profileWrapper.className = "profile-wrapper";
      profileWrapper.style.display = "flex";
      profileWrapper.style.alignItems = "center";

      imgElement.src = userPic;
      nameElement.textContent = "User";
      profileWrapper.style.marginBottom = "10px"; // Add some spacing between the profile and the message

      profileWrapper.appendChild(imgElement);
      profileWrapper.appendChild(nameElement);

      messageElement.innerHTML = userQuery;

      const messageWrapper = document.createElement("div");
      messageWrapper.style.display = "flex";
      messageWrapper.style.flexDirection = "column";
      messageWrapper.style.marginBottom = "40px"; // Add two lines of spacing between messages

      messageWrapper.appendChild(profileWrapper);
      messageWrapper.appendChild(messageElement);

      boondoggleAiChatContent.appendChild(messageWrapper);

      let temp_langchain = [];
      const selectedConversation = conversations.find((c) => c.id === convoID);
      let messages = selectedConversation ? selectedConversation.messages : [];
      for (let i = 0; messages != null && i < messages.length; i++) {
        if (i % 2 == 0) {
          const userMess = new HumanMessage(messages[i]);
          temp_langchain.push(userMess);
        } else {
          const aiMess = new AIMessage(messages[i]);
          temp_langchain.push(aiMess);
        }
      }

      // System Prompt here
      const SYSTEM_TEMPLATE = `You are an assistant that helps automatically analyze data from CRMs that are fed to you by Boondoggle AI. With the data I provide you, your job is to assign any question the user may ask related to data in their CRM. Type out your answers in plain English, and leave our any irrelevent data that is inputted. Be as detailed as possible, and provide any patterns/insights you may see to help the user answer questions

      <context>
      {context}
      </context>
      `;

      const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.2,
        openAIApiKey: process.env.REACT_APP_OPENAI_KEY,
      });
      // Generate answering prompt
      const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE],
        new MessagesPlaceholder("messages"),
      ]);
      // Set up the Document Chain
      const documentChain = await createStuffDocumentsChain({
        llm: llm,
        prompt: questionAnsweringPrompt,
      });

      const parseRetrieverInput = (params) => {
        return params.messages[params.messages.length - 1].content;
      };
      // Transform user's input into a search query
      const queryTransformPrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("messages"),
        [
          "user",
          "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
        ],
      ]);

      const queryTransformationChain = queryTransformPrompt.pipe(llm);
      // Generate query based on previous conversation
      const newQuery = await queryTransformationChain.invoke({
        messages: [...temp_langchain, new HumanMessage(userQuery)],
      });
      // Get the new search quergy
      const searchQuery = `User query: ${userQuery}, Edited Query: ${newQuery.content}`;

      //Generate embeddings for a semantic search
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${searchQuery}`,
      });
      // Perform top k semantic search in pinecone based on different type
      const index = pinecone.index("boondoggle-data-4");
      const id = localStorage.getItem("connection_id");

      const ns1 = index.namespace(id);

      const dealsResponse = await ns1.query({
        topK: 10,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "Deal" },
        },
      });

      const dealsMatchesArray = dealsResponse.matches;
      const dealsMatches = dealsMatchesArray.map((deal) => deal.metadata);

      const companiesResponse = await ns1.query({
        topK: 10,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "Company" },
        },
      });

      const companiesMatchesArray = companiesResponse.matches;
      const companiesMatches = companiesMatchesArray.map(
        (company) => company.metadata
      );

      const contactResponse = await ns1.query({
        topK: 10,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "Contact" },
        },
      });

      const contactMatchesArray = contactResponse.matches;
      const contactMatches = contactMatchesArray.map(
        (contact) => contact.metadata
      );

      const notesResponse = await ns1.query({
        topK: 10,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "NOTE" },
        },
      });

      const notesMatchesArray = notesResponse.matches;
      const notesMatches = notesMatchesArray.map((note) => note.metadata);

      // Combine all results
      const matches = [
        ...dealsMatches,
        ...contactMatches,
        ...notesMatches,
        ...companiesMatches,
      ];
      // Fetch all results from unified based on matches
      let queryArray = [];
      // REST API calls
      await Promise.all(
        matches.map(async (match, index) => {
          const matchType = match.type;

          if (matchType == "Deal") {
            const options = {
              method: "GET",
              url: `https://api.unified.to/crm/${id}/deal/${match.id}`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };
            let results;
            try {
              results = await axios.request(options);
            } catch (err) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              results = await axios.request(options);
            }
            queryArray.push(results.data);
          } else if (matchType == "Contact") {
            const options = {
              method: "GET",
              url: `https://api.unified.to/crm/${id}/contact/${match.id}`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };
            let results;
            try {
              results = await axios.request(options);
              queryArray.push(results.data);
            } catch (err) {
              if (err.response && err.response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                results = await axios.request(options);
                queryArray.push(results.data);
              }
            }
          } else if (matchType == "Company") {
            const options = {
              method: "GET",
              url: `https://api.unified.to/crm/${id}/company/${match.id}`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };
            let results;
            try {
              results = await axios.request(options);
              queryArray.push(results.data);
            } catch (err) {
              if (err.response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                results = await axios.request(options);
                queryArray.push(results.data);
              }
            }
          } else if (matchType == "NOTE") {
            const options = {
              method: "GET",
              url: `https://api.unified.to/crm/${id}/event/${match.id}`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };
            let results;
            try {
              results = await axios.request(options);
              queryArray.push(results.data);
            } catch (err) {
              if (err.response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                results = await axios.request(options);
                queryArray.push(results.data);
              }
            }
          } else if (matchType == "Lead") {
            const options = {
              method: "GET",
              url: `https://api.unified.to/crm/${id}/lead/${match.id}`,
              headers: {
                authorization:
                  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
              },
            };
            let results;
            try {
              results = await axios.request(options);
              queryArray.push(results.data);
            } catch (err) {
              if (err.response.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                results = await axios.request(options);
                queryArray.push(results.data);
              }
            }
          }
        })
      );
      // Create a string from the query result array
      const queryArrayString = queryArray
        .map((item) => `${JSON.stringify(item)}`)
        .join("\n");

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 15,
      });
      // Divide the large string into smaller document chunks
      const splits = await textSplitter.createDocuments([queryArrayString]);
      // Convert these text chunks into vector embeddings
      const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new OpenAIEmbeddings({
          apiKey: process.env.REACT_APP_OPENAI_KEY,
          model: "text-embedding-3-small",
        })
      );
      // Define retriever
      const retriever = vectorStore.asRetriever(15);
      // Get context based on retriever from the fetch results
      // Functions for answer streaming
      const queryTransformingRetrieverChain = RunnableBranch.from([
        [
          (params) => params.messages.length === 1,
          RunnableSequence.from([parseRetrieverInput, retriever]),
        ],
        queryTransformPrompt
          .pipe(llm)
          .pipe(new StringOutputParser()) // Output Parser
          .pipe(retriever),
      ]).withConfig({ runName: "chat_retriever_chain" });

      const conversationalRetrievalChain = RunnablePassthrough.assign({
        context: queryTransformingRetrieverChain,
      }).assign({
        answer: documentChain,
      });

      // Add Ai response frontend container
      const aiAnswerContainer = document.createElement("div");
      aiAnswerContainer.className = "boondoggle-ai-chat";

      const messageElement2 = document.createElement("div");
      const imgElement2 = document.createElement("img");

      imgElement2.style.width = "35px"; // Adjust the size as needed
      imgElement2.style.height = "35px"; // Adjust the size as needed
      imgElement2.style.borderRadius = "50%"; // Make it a circle
      imgElement2.style.marginRight = "10px"; // Adjust spacing as needed

      const nameElement2 = document.createElement("span");
      nameElement2.style.fontWeight = "bold";

      const profileWrapper2 = document.createElement("div");
      profileWrapper2.className = "profile-wrapper";
      profileWrapper2.style.display = "flex";
      profileWrapper2.style.alignItems = "center";

      imgElement2.src = boondoggleaiPic;
      nameElement2.textContent = "Boondoggle AI";
      profileWrapper2.style.marginBottom = "5px"; // Add some spacing between the profile and the message

      profileWrapper2.appendChild(imgElement2);
      profileWrapper2.appendChild(nameElement2);

      const messageWrapper2 = document.createElement("div");
      messageWrapper2.style.display = "flex";
      messageWrapper2.style.flexDirection = "column";
      messageWrapper2.style.marginBottom = "40px"; // Add two lines of spacing between messages

      messageWrapper2.appendChild(profileWrapper2);
      messageWrapper2.appendChild(messageElement2);

      boondoggleAiChatContent.appendChild(messageWrapper2);

      setIsLoading(false);

      let finalAnswer = "";

      const output = {};
      let currentKey = null;
      let accumulatedText = "";

      for await (const chunk of await conversationalRetrievalChain.stream({
        messages: [
          ...temp_langchain,
          new HumanMessage(
            `The query is ${searchQuery}. And the relevent data is ${queryArrayString}`
          ),
        ],
      })) {
        for (const key of Object.keys(chunk)) {
          if (output[key] === undefined) {
            output[key] = chunk[key];
          } else {
            output[key] += chunk[key];
          }

          if (key === currentKey) {
            finalAnswer += chunk[key];
            accumulatedText += chunk[key];

            // Check for complete Markdown elements
            let match;
            while (
              (match = accumulatedText.match(
                /(\*\*.*?\*\*|#### .*(?=\n|$)|### .*(?=\n|$)|\n)/
              ))
            ) {
              const completeElement = match[0];
              const endIndex =
                accumulatedText.indexOf(completeElement) +
                completeElement.length;

              // Format and append the complete element
              const formattedChunk = formatText(
                accumulatedText.substring(0, endIndex)
              );
              messageElement2.innerHTML += formattedChunk;
              setAnswer(formattedChunk);

              // Remove the processed part from accumulatedText
              accumulatedText = accumulatedText.substring(endIndex);
            }
          }
          currentKey = key;
        }
      }

      temp_langchain.push(
        new HumanMessage(userQuery),
        new AIMessage(finalAnswer)
      );

      console.log("messages array", temp_langchain);
      let newMessagesArr = [];
      for (const obj of temp_langchain) {
        /*if (obj.constructor.name == "HumanMessage") {
          newMessagesArr.push(extractUserQuery(obj.content));
        } else {
          newMessagesArr.push(obj.content);
        }*/
        newMessagesArr.push(obj.content);
      }

      const uid = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("users")
        .select()
        .eq("id", uid);

      let updatePackage = [];

      if (data && data[0]) {
        const date = Date.now();

        if (convoID == "") {
          //generate title for query
          const titleContext = `You are an automated CRM assistant for businesses and have all of the CRM data for the user. This is an string containing a query that the user has asked you: ${userQuery}, and here is an edited query that might have more context: ${newQuery.content}. You should not respond as if you are an AI.`;
          let completionMessages = [
            { role: "system", content: titleContext },
            {
              role: "user",
              content: `Generate one sentence title that captures what this query is about. Do not return a response longer than a few words.`,
            },
          ];

          const titleCompletion = await openai.chat.completions.create({
            messages: completionMessages,
            model: "gpt-4",
          });

          let title = titleCompletion.choices[0].message.content.replace(
            /^"(.*)"$/,
            "$1"
          );

          console.log(title);

          const newId = generateUniqueId();
          let newConvoObj = {
            messages: newMessagesArr,
            id: newId,
            title: title,
            date: date,
          };

          updatePackage = [...data[0].boondoggle_conversations, newConvoObj];
          await props.db
            .from("users")
            .update({
              boondoggle_conversations: updatePackage,
            })
            .eq("id", uid);
          setConvoID(newId);
          console.log("date var: ", date);
        } else {
          let convoArr = data[0].boondoggle_conversations;
          for (let i = 0; i < convoArr.length; i++) {
            if (convoArr[i].id == convoID) {
              convoArr[i].messages = newMessagesArr;
              convoArr[i].date = date;
            }
          }

          updatePackage = convoArr;

          await props.db
            .from("users")
            .update({
              boondoggle_conversations: updatePackage,
            })
            .eq("id", uid);
        }
      }
    }
  }
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="boondoggle-ai-container">
        <Header db={props.db} selectedTab={3} />
        <div className="boondoggle-ai-content">
          <Sidebar
            conversations={conversations}
            onSelectConversation={loadConversation}
            selectedConversationId={convoID}
            onNewConversation={() => {
              const chatContent = document.getElementById(
                "boondoggle-ai-chat-content"
              );
              chatContent.innerHTML = ""; // Clear current chat
              setConvoID("");
            }}
          />
          <div className="boondoggle-ai-main">
            <div
              className="boondoggle-ai-chat-content"
              id="boondoggle-ai-chat-content"
              ref={chatContentRef}
            ></div>
            <div className="boondoggle-ai-input">
              <input
                onKeyDown={async (event) => await onBoondoggleQuery(event)}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Press Enter to Query"
              />
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default BoondogggleAI;
