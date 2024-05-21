import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoondoggleAI.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import LoadingOverlay from "react-loading-overlay";
import { useChat } from "ai/react";
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
  const client_id = "989e97a9-d4ee-4979-9e50-f0d9909fc450";
  const pinecone = new Pinecone({
    apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
  });

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const { messages2, input, handleInputChange, handleSubmit } = useChat();
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are an assistant that helps automatically analyze data from CRMs that are fed to you by Boondoggle AI. With the data I provide you, your job is to assign any question the user may ask related to data in their CRM. Type out your answers in plain English, and leave our any irrelevent data that is inputted. Be as detailed as possible, and provide any patterns/insights you may see to help the user answer questions.`,
    },
  ]);
  const [langchainMessages, setLangChainMessages] = useState([]);

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

  useEffect(() => {
    async function checkData() {
      const onboardingValues = await checkOnBoarding();
      setIsOnboarding(!onboardingValues.hasOnboarded);
      setOnboardingStep(onboardingValues.onboardingStep);
    }

    checkData();
  }, []);

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

  async function getAirtableData(airtable_id) {
    const { data, error } = await props.db
      .from("data")
      .select("")
      .eq("connection_id", airtable_id);

    return {
      baseID: data[0].baseID,
      tableID: data[0].tableID,
    };
  }

  async function onBoondoggleQuery(event) {
    if (event.key == "Enter") {
      setIsLoading(true);
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
        model: "gpt-3.5-turbo",
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

      const searchQuery = newQuery.content;

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

      console.log(queryArrayString);

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 15,
      });

      const splits = await textSplitter.createDocuments([queryArrayString]);

      console.log(splits);

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

      const final = await conversationalRetrievalChain.invoke({
        messages: [
          ...temp_langchain,
          new HumanMessage(
            `The query is ${searchQuery}. And the relevent data is ${queryArrayString}`
          ),
        ],
      });

      temp_langchain.push(
        new HumanMessage(searchQuery),
        new AIMessage(final.answer)
      );

      const aiAnswerContainer = document.createElement("div");
      aiAnswerContainer.className = "boondoggle-ai-chat";

      const aiAnswerText = document.createElement("p");
      aiAnswerText.className = "boondoggle-ai-chat-text";

      const answerLines = final.answer.split("\n");
      // aiAnswerContainer.appendChild(svgElement);
      answerLines.forEach((line, index) => {
        const textNode = document.createTextNode(line);
        aiAnswerText.appendChild(textNode);
        // Adding a line break after each line, except for the last line
        if (line !== answerLines[answerLines.length - 1]) {
          aiAnswerText.appendChild(document.createElement("br"));
        }
      });
      aiAnswerContainer.appendChild(aiAnswerText);
      setIsLoading(false);
      boondoggleAiChatContent.appendChild(aiAnswerContainer);
      setLangChainMessages(temp_langchain);
    }
  }
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="w-[100vw] h-[100vh] overflow-y-scroll">
        <div className="content-container">
          <Sidebar db={props.db} selectedTab={3} />
          <div
            style={
              isOnboarding && onboardingStep == 13
                ? {
                    flexDirection: "column",
                    marginLeft: "2vw",
                    filter: "blur(5px)",
                  }
                : { flexDirection: "column", marginLeft: "2vw" }
            }
          >
            <div
              className="boondoggle-ai-chat-content"
              id="boondoggle-ai-chat-content"
              style={
                isOnboarding &&
                (onboardingStep == 11 || onboardingStep == 12) &&
                !isLoading
                  ? { height: "69vh" }
                  : { marginTop: "2vh" }
              }
            />

            <input
              onKeyDown={async (event) => await onBoondoggleQuery(event)}
              className="boondoggleai-query-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            ></input>
            <p>Press Enter to Query</p>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default BoondogggleAI;
