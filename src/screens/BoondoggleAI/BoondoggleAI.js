import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedDirectory from "@unified-api/react-directory";
import axios from "axios";
import Stripe from "stripe";
import "./BoondoggleAI.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import LoadingOverlay from "react-loading-overlay";

//65eb615fb3dfb5cfb7c939c5

function BoondogggleAI(props) {
  const client_id = "989e97a9-d4ee-4979-9e50-f0d9909fc450";
  const pinecone = new Pinecone({
    apiKey: "6d937a9a-2789-4947-aedd-f13a7eecb479",
  });

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are an assistant that helps automatically analyze data from CRMs that are fed to you by Boondoggle AI. I will provide you with a user-generated  query related to data in their CRM as well as the most relevent data from their vector database. Your job is to use the provided data to answer their question based on their query.`,
    },
  ]);

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
      const searchQuery = query;
      const boondoggleAiChatContent = document.getElementById(
        "boondoggle-ai-chat-content"
      );

      const userQueryContainer = document.createElement("div");
      userQueryContainer.className = "boondoggle-ai-chat";
      const userQueryText = document.createElement("p");
      userQueryText.className = "boondoggle-ai-chat-text-query";
      userQueryText.textContent = searchQuery;
      userQueryContainer.appendChild(userQueryText);
      boondoggleAiChatContent.appendChild(userQueryContainer);

      setQuery("");
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${searchQuery}`,
      });

      const index = pinecone.index("boondoggle-data-2");
      const id = localStorage.getItem("connection_id");
      const uid = localStorage.getItem("uid");
      const type = "crm";
      const ns1 = index.namespace(type == "crm" ? id : uid);
      // const ns1 = index.namespace("661ec76d6ccf24ccd623adf5");

      const queryResponse = await ns1.query({
        topK: 20,
        vector: embedding.data[0].embedding,
        includeMetadata: true,
      });

      const matches = queryResponse.matches;

      console.log("Matches", matches);

      let queryArray = [];

      if (type == "crm") {
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
              const results = await axios.request(options);
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
              const results = await axios.request(options);
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
              const results = await axios.request(options);
              queryArray.push(results.data);
            } else if (matchType == "Event") {
              const options = {
                method: "GET",
                url: `https://api.unified.to/crm/${id}/event/${match.id}`,
                headers: {
                  authorization:
                    "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
                },
              };
              const results = await axios.request(options);
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
              const results = await axios.request(options);
              queryArray.push(results.data);
            }
          })
        );
      } else if (type == "airtable") {
        const airtable_id = await getAirtableRefreshToken();
        const { baseID, tableID } = await getAirtableData(airtable_id);

        for (const match of matches) {
          const recordsURL = `https://api.airtable.com/v0/${baseID}/${tableID}/${match.id}`;
          let recordResponse;
          try {
            recordResponse = await axios.get(recordsURL, {
              headers: {
                Authorization: `Bearer ${airtable_id}`,
              },
            });
          } catch (error) {
            if (error) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              recordResponse = await axios.get(recordsURL, {
                headers: {
                  Authorization: `Bearer ${airtable_id}`,
                },
              });
            }
          }
          queryArray.push(recordResponse.data);
        }
      }

      const queryArrayString = queryArray
        .map((item) => `${JSON.stringify(item)}`)
        .join("\n");

      let temp_messages = messages;
      console.log("TEMP", temp_messages);

      const queryCompletion = await openai.chat.completions.create({
        messages: [
          ...temp_messages,
          {
            role: "user",
            content: `The query is ${searchQuery}. And the relevent data is ${queryArrayString}`,
          },
        ],
        model: "gpt-4",
      });
      temp_messages.push({
        role: "user",
        content: `The query is ${searchQuery}`,
      });
      const answer = queryCompletion.choices[0].message.content;

      const aiAnswerContainer = document.createElement("div");
      aiAnswerContainer.className = "boondoggle-ai-chat";

      // const svgElement = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "svg"
      // );
      // svgElement.style.display = "inline-flex";
      // svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      // svgElement.setAttribute("width", "32");
      // svgElement.setAttribute("height", "32");
      // svgElement.setAttribute("viewBox", "0 0 32 32");
      // svgElement.setAttribute("fill", "none");

      // const path1 = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "path"
      // );
      // path1.setAttribute("fill-rule", "evenodd");
      // path1.setAttribute("clip-rule", "evenodd");
      // path1.setAttribute(
      //   "d",
      //   "M13.5 6.76304L12.2389 10.171C11.8844 11.129 11.1291 11.8844 10.1711 12.2389L6.7631 13.5L10.1711 14.761C11.1291 15.1155 11.8844 15.8709 12.2389 16.8289L13.5 20.2369L14.7611 16.8289C15.1156 15.8709 15.8709 15.1155 16.8289 14.761L20.2369 13.5L16.8289 12.2389C15.8709 11.8844 15.1156 11.129 14.7611 10.171L13.5 6.76304ZM14.9068 4.80171C14.4236 3.49578 12.5765 3.49578 12.0932 4.80171L10.3632 9.47696C10.2113 9.88754 9.8876 10.2113 9.47702 10.3632L4.80177 12.0932C3.49584 12.5764 3.49584 14.4235 4.80177 14.9067L9.47702 16.6367C9.8876 16.7887 10.2113 17.1124 10.3632 17.523L12.0932 22.1982C12.5765 23.5041 14.4236 23.5041 14.9068 22.1982L16.6368 17.523C16.7887 17.1124 17.1124 16.7887 17.523 16.6367L22.1983 14.9067C23.5042 14.4235 23.5042 12.5764 22.1983 12.0932L17.523 10.3632C17.1124 10.2113 16.7887 9.88754 16.6368 9.47696L14.9068 4.80171Z"
      // );
      // path1.setAttribute("fill", "#1C1C1C");

      // const path2 = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "path"
      // );
      // path2.setAttribute("fill-rule", "evenodd");
      // path2.setAttribute("clip-rule", "evenodd");
      // path2.setAttribute(
      //   "d",
      //   "M23.4998 20.3223L23.0405 21.5636C22.7873 22.2479 22.2477 22.7875 21.5635 23.0407L20.3221 23.5L21.5635 23.9593C22.2477 24.2125 22.7873 24.7521 23.0405 25.4364L23.4998 26.6777L23.9591 25.4364C24.2124 24.7521 24.7519 24.2125 25.4362 23.9593L26.6775 23.5L25.4362 23.0407C24.7519 22.7875 24.2124 22.2479 23.9591 21.5636L23.4998 20.3223ZM24.4377 18.5345C24.1155 17.6639 22.8841 17.6639 22.562 18.5345L21.6337 21.0431C21.5324 21.3168 21.3166 21.5326 21.0429 21.6339L18.5343 22.5622C17.6637 22.8843 17.6637 24.1157 18.5343 24.4379L21.0429 25.3661C21.3166 25.4674 21.5324 25.6832 21.6337 25.9569L22.562 28.4655C22.8841 29.3361 24.1155 29.3361 24.4377 28.4655L25.3659 25.9569C25.4672 25.6832 25.683 25.4674 25.9567 25.3661L28.4653 24.4379C29.3359 24.1157 29.3359 22.8843 28.4653 22.5622L25.9567 21.6339C25.683 21.5326 25.4672 21.3168 25.3659 21.0431L24.4377 18.5345Z"
      // );
      // path2.setAttribute("fill", "#1C1C1C");
      // svgElement.appendChild(path1);
      // svgElement.appendChild(path2);
      const aiAnswerText = document.createElement("p");
      aiAnswerText.className = "boondoggle-ai-chat-text";
      temp_messages.push({
        role: "assistant",
        content: answer,
      });
      const answerLines = answer.split("\n");
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
      setMessages(temp_messages);
    }
  }
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="container">
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
