import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./BoondoggleAI.css";
import Sidebar from "../../components/Sidebar/Sidebar";
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

function BoondogggleAI(props) {
  const chatContentRef = useRef(null);
  const pinecone = new Pinecone({
    apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
  });

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are an assistant that helps automatically analyze data from CRMs that are fed to you by Boondoggle AI. With the data I provide you, your job is to assign any question the user may ask related to data in their CRM. Type out your answers in plain English, and leave our any irrelevent data that is inputted. Be as detailed as possible, and provide any patterns/insights you may see to help the user answer questions.`,
    },
  ]);
  const [langchainMessages, setLangChainMessages] = useState([]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [answer]);

  async function onBoondoggleQuery(event) {
    if (event.key == "Enter") {
      setIsLoading(true);
      setAnswer("");
      const boondoggleAiChatContent = document.getElementById(
        "boondoggle-ai-chat-content"
      );
      const userQueryContainer = document.createElement("div");
      userQueryContainer.className = "boondoggle-ai-chat";
      const userQueryText = document.createElement("p");
      userQueryText.className = "boondoggle-ai-chat-text-query";
      userQueryText.textContent = query;
      userQueryContainer.appendChild(userQueryText);
      boondoggleAiChatContent.appendChild(userQueryContainer);

      let temp_langchain = langchainMessages;

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

      const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE],
        new MessagesPlaceholder("messages"),
      ]);

      const documentChain = await createStuffDocumentsChain({
        llm: llm,
        prompt: questionAnsweringPrompt,
      });

      const parseRetrieverInput = (params) => {
        return params.messages[params.messages.length - 1].content;
      };

      const queryTransformPrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("messages"),
        [
          "user",
          "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
        ],
      ]);

      const queryTransformationChain = queryTransformPrompt.pipe(llm);

      const newQuery = await queryTransformationChain.invoke({
        messages: [...temp_langchain, new HumanMessage(query)],
      });

      const searchQuery = `User query: ${query}, Edited Query: ${newQuery.content}`;

      setQuery("");
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${searchQuery}`,
      });

      const index = pinecone.index("boondoggle-data-2");
      const id = localStorage.getItem("connection_id");

      const ns1 = index.namespace(id);

      const dealsResponse = await ns1.query({
        topK: 20,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "Deal" },
        },
      });

      const dealsMatches = dealsResponse.matches;

      const contactResponse = await ns1.query({
        topK: 20,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "Lead" },
        },
      });

      const contactMatches = contactResponse.matches;

      const notesResponse = await ns1.query({
        topK: 20,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
        filter: {
          type: { $eq: "NOTE" },
        },
      });

      const notesMatches = notesResponse.matches;

      const matches = [...dealsMatches, ...contactMatches, ...notesMatches];

      let queryArray = [];

      await Promise.all(
        matches.map(async (match, index) => {
          const matchType = match.metadata.type;

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
            } catch (err) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              results = await axios.request(options);
            }
            queryArray.push(results.data);
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
            } catch (err) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              results = await axios.request(options);
            }
            queryArray.push(results.data);
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
            } catch (err) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              results = await axios.request(options);
            }
            queryArray.push(results.data);
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
            } catch (err) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              results = await axios.request(options);
            }
            queryArray.push(results.data);
          }
        })
      );

      const queryArrayString = queryArray
        .map((item) => `${JSON.stringify(item)}`)
        .join("\n");

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 15,
      });

      const splits = await textSplitter.createDocuments([queryArrayString]);

      const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new OpenAIEmbeddings({
          apiKey: process.env.REACT_APP_OPENAI_KEY,
          model: "text-embedding-3-small",
        })
      );

      const retriever = vectorStore.asRetriever(25);

      const queryTransformingRetrieverChain = RunnableBranch.from([
        [
          (params) => params.messages.length === 1,
          RunnableSequence.from([parseRetrieverInput, retriever]),
        ],
        queryTransformPrompt
          .pipe(llm)
          .pipe(new StringOutputParser())
          .pipe(retriever),
      ]).withConfig({ runName: "chat_retriever_chain" });

      const conversationalRetrievalChain = RunnablePassthrough.assign({
        context: queryTransformingRetrieverChain,
      }).assign({
        answer: documentChain,
      });

      function formatText(text) {
        const formattedAnswer = text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>bold</strong>
          .replace(/#### (.*?)(?=\n|$)/g, "<h4>$1</h4>") // Convert #### to <h4> tags
          .replace(/### (.*?)(?=\n|$)/g, "<h3>$1</h3>") // Convert ### to <h3> tags
          .replace(/\n/g, "<br>"); // Convert newlines to <br> tags
        return formattedAnswer;
      }

      const aiAnswerContainer = document.createElement("div");
      aiAnswerContainer.className = "boondoggle-ai-chat";

      const aiAnswerText = document.createElement("p");
      aiAnswerText.className = "boondoggle-ai-chat-text";
      aiAnswerContainer.appendChild(aiAnswerText);

      boondoggleAiChatContent.appendChild(aiAnswerContainer);

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
              aiAnswerText.innerHTML += formattedChunk;
              setAnswer(formattedChunk);

              // Remove the processed part from accumulatedText
              accumulatedText = accumulatedText.substring(endIndex);
            }
          }
          currentKey = key;
        }
      }

      temp_langchain.push(
        new HumanMessage(searchQuery),
        new AIMessage(finalAnswer)
      );

      setLangChainMessages(temp_langchain);
    }
  }
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="w-[100vw] h-[100vh] overflow-y-scroll">
        <div>
          <Sidebar db={props.db} selectedTab={3} />
          <div class="ml-[2vw] flex-col">
            <div
              class="flex flex-col items-start gap-[35px] self-stretch overflow-y-auto h-[80vh] mb-[2vh] mt-[2vh]"
              id="boondoggle-ai-chat-content"
              ref={chatContentRef}
            />

            <input
              onKeyDown={async (event) => await onBoondoggleQuery(event)}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex w-[95vw] mb-[1vh] p-4 flex-col justify-center items-start gap-2 relative rounded-[24px] border border-brand-light bg-gradient-to-r from-[rgba(128,84,255,0.05)] to-[rgba(1,131,251,0.05)] bg-white bg-opacity-80 backdrop-blur-[50px]"
            ></input>
            <p>Press Enter to Query</p>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default BoondogggleAI;
