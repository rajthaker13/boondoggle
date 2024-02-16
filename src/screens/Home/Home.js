import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";

function Home(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [twitterLinked, setTwitterLinked] = useState(false);
  const [crmType, setCRMType] = useState("");
  const client_id = "250580cb-7041-42d1-abf3-f7958c92c1d3";

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

  async function sendToAirtable(crm_update, baseID, tableID, fieldOptions) {
    const id = localStorage.getItem("connection_id");
    console.log("Update", crm_update);
    console.log("base", baseID);
    console.log("tableID", tableID);
    console.log(fieldOptions);
    console.log("test", fieldOptions.fullName);
    console.log("test2", fieldOptions["fullName"]);
    Promise.all(
      crm_update.map(async (update) => {
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

  async function sendToCRM(crm_update) {}

  async function updateCRM(userData) {
    console.log(userData);
    const connection_id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    let crm_update = data[0].crm_data;
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

    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });

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
        var obj = {
          id: dm.id,
          customer: dm.customer != meUser ? dm.customer : "No Response",
          title: title,
          summary: summary,
          date: Date.now(),
          source: "Twitter",
          status: "In Progress",
        };
        crm_update.push(obj);
        // }
      })
    );

    console.log(crm_update);

    if (type == "airtable") {
      console.log("airtable");
      await sendToAirtable(crm_update, baseID, tableID, fieldOptions);
      // await Promise.all(
      //   crm_update.map((update) => {
      //     if (update.customer != "No Response") {
      //       console.log("here");
      //     }
      //   })
      // );
    }
    // console.log(userData.messages);
    // console.log(connection_id);

    await props.db
      .from("data")
      .update({
        crm_data: crm_update,
        twitter_messages: userData.messages,
        twitterLinked: true,
      })
      .eq("connection_id", connection_id);
    setTwitterLinked(true);
    localStorage.setItem("twitterLinked", true);
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

  async function checkLinks() {
    const id = localStorage.getItem("connection_id");

    const { data, error } = await props.db
      .from("data")
      .select("")
      .eq("connection_id", id);

    console.log(data);
    console.log(data[0].type, "fuckers");
    setTwitterLinked(data[0].twitterLinked);
    localStorage.setItem("twitterLinked", data[0].twitterLinked);
    localStorage.setItem("crmType", data[0].type);
    setCRMType(data[0].type);

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
      //     headers: {
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

  useEffect(() => {
    async function getData() {
      if (!twitterLinked) {
        await captureOauthVerifier();
      }
    }

    async function loadCheck() {
      await checkLinks();
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("oauth_verifier") && !twitterLinked) {
      getData();
    }
    loadCheck();
  }, []);

  return (
    <div className="container">
      <div className="content-container">
        <div className="sidebar">
          <div className="name-badge">
            <img
              src={require("../../assets/IconSet.png")}
              className="profile-icon"
            ></img>
            <p className="profile-name">Boondoggler</p>
          </div>

          <div className="sidebar-tabs">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="IdentificationBadge">
                <path
                  id="Vector"
                  d="M15.625 2.5H4.375C4.20924 2.5 4.05027 2.56585 3.93306 2.68306C3.81585 2.80027 3.75 2.95924 3.75 3.125V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V3.125C16.25 2.95924 16.1842 2.80027 16.0669 2.68306C15.9497 2.56585 15.7908 2.5 15.625 2.5ZM10 13.125C9.50555 13.125 9.0222 12.9784 8.61107 12.7037C8.19995 12.429 7.87952 12.0385 7.6903 11.5817C7.50108 11.1249 7.45157 10.6222 7.54804 10.1373C7.6445 9.65232 7.8826 9.20686 8.23223 8.85723C8.58186 8.5076 9.02732 8.2695 9.51227 8.17304C9.99723 8.07657 10.4999 8.12608 10.9567 8.3153C11.4135 8.50452 11.804 8.82495 12.0787 9.23607C12.3534 9.6472 12.5 10.1305 12.5 10.625C12.5 11.288 12.2366 11.9239 11.7678 12.3928C11.2989 12.8616 10.663 13.125 10 13.125Z"
                  fill="#1C1C1C"
                  fill-opacity="0.1"
                />
                <path
                  id="Vector_2"
                  d="M5.87422 15.5C5.9399 15.5494 6.01468 15.5853 6.09426 15.6057C6.17385 15.6262 6.25669 15.6307 6.33803 15.6191C6.41937 15.6075 6.49763 15.58 6.56832 15.5381C6.63901 15.4962 6.70075 15.4408 6.75 15.375C7.12841 14.8705 7.61909 14.4609 8.18319 14.1789C8.7473 13.8968 9.36932 13.75 10 13.75C10.6307 13.75 11.2527 13.8968 11.8168 14.1789C12.3809 14.4609 12.8716 14.8705 13.25 15.375C13.2992 15.4407 13.3609 15.496 13.4316 15.5378C13.5022 15.5796 13.5804 15.6071 13.6616 15.6187C13.7429 15.6303 13.8256 15.6258 13.9051 15.6054C13.9846 15.5851 14.0593 15.5492 14.125 15.5C14.1907 15.4508 14.246 15.3891 14.2878 15.3184C14.3296 15.2478 14.3571 15.1696 14.3687 15.0884C14.3803 15.0071 14.3758 14.9244 14.3554 14.8449C14.3351 14.7654 14.2992 14.6907 14.25 14.625C13.6966 13.883 12.9586 13.2988 12.1094 12.9305C12.5748 12.5056 12.9008 11.9499 13.0447 11.3364C13.1887 10.7229 13.1438 10.0802 12.9159 9.49267C12.688 8.90514 12.2879 8.40023 11.7679 8.0442C11.248 7.68816 10.6325 7.49765 10.0023 7.49765C9.37218 7.49765 8.75673 7.68816 8.23678 8.0442C7.71682 8.40023 7.31666 8.90514 7.08879 9.49267C6.86093 10.0802 6.81602 10.7229 6.95995 11.3364C7.10388 11.9499 7.42993 12.5056 7.89531 12.9305C7.0444 13.2981 6.30472 13.8824 5.75 14.625C5.65046 14.7575 5.60763 14.9241 5.63092 15.0882C5.65422 15.2523 5.74173 15.4004 5.87422 15.5ZM10 8.75C10.3708 8.75 10.7334 8.85997 11.0417 9.06599C11.35 9.27202 11.5904 9.56486 11.7323 9.90747C11.8742 10.2501 11.9113 10.6271 11.839 10.9908C11.7666 11.3545 11.588 11.6886 11.3258 11.9508C11.0636 12.213 10.7295 12.3916 10.3658 12.464C10.0021 12.5363 9.62508 12.4992 9.28247 12.3573C8.93986 12.2154 8.64702 11.975 8.44099 11.6667C8.23497 11.3584 8.125 10.9958 8.125 10.625C8.125 10.1277 8.32254 9.65081 8.67417 9.29917C9.02581 8.94754 9.50272 8.75 10 8.75ZM15.625 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V3.125C16.875 2.79348 16.7433 2.47554 16.5089 2.24112C16.2745 2.0067 15.9565 1.875 15.625 1.875ZM15.625 16.875H4.375V3.125H15.625V16.875ZM6.875 5C6.875 4.83424 6.94085 4.67527 7.05806 4.55806C7.17527 4.44085 7.33424 4.375 7.5 4.375H12.5C12.6658 4.375 12.8247 4.44085 12.9419 4.55806C13.0592 4.67527 13.125 4.83424 13.125 5C13.125 5.16576 13.0592 5.32473 12.9419 5.44194C12.8247 5.55915 12.6658 5.625 12.5 5.625H7.5C7.33424 5.625 7.17527 5.55915 7.05806 5.44194C6.94085 5.32473 6.875 5.16576 6.875 5Z"
                  fill="#1C1C1C"
                />
              </g>
            </svg>

            <p
              className="tabs-text"
              style={selectedTab == 0 ? { fontWeight: 700 } : {}}
            >
              Integrations
            </p>
          </div>

          <div className="tabs-container">
            <div className="sidebar-tabs">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="ChartPieSlice">
                  <path
                    id="Vector"
                    d="M7.50002 2.92969V8.55469L2.62502 11.3672C2.29959 9.61066 2.61183 7.79565 3.50554 6.24885C4.39925 4.70205 5.81572 3.52504 7.50002 2.92969Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M7.81261 9.09609C7.90765 9.04123 7.98656 8.96231 8.04142 8.86727C8.09627 8.77223 8.12514 8.66442 8.12511 8.55469V2.92969C8.12456 2.83004 8.10018 2.73198 8.05402 2.64367C8.00786 2.55536 7.94126 2.47936 7.85976 2.42202C7.77826 2.36469 7.68424 2.32766 7.58553 2.31405C7.48681 2.30043 7.38628 2.31062 7.2923 2.34375C5.46807 2.98939 3.93396 4.26457 2.96575 5.94005C1.99755 7.61554 1.65875 9.58145 2.01027 11.4844C2.02849 11.5828 2.07008 11.6754 2.13153 11.7544C2.19298 11.8333 2.27249 11.8964 2.3634 11.9383C2.44531 11.9766 2.53468 11.9963 2.62511 11.9961C2.73481 11.9961 2.84259 11.9673 2.93761 11.9125L7.81261 9.09609ZM6.87511 3.87656V8.19375L3.13449 10.3523C3.12511 10.2344 3.12511 10.1156 3.12511 10C3.12622 8.73309 3.4769 7.49106 4.13855 6.41066C4.80019 5.33025 5.74713 4.45337 6.87511 3.87656ZM17.0579 5.97812C17.0509 5.96406 17.0439 5.94922 17.0353 5.93516C17.0267 5.92109 17.0196 5.90938 17.0111 5.89688C16.2947 4.67328 15.2707 3.65834 14.0409 2.95282C12.811 2.24729 11.418 1.87572 10.0001 1.875C9.83435 1.875 9.67538 1.94085 9.55817 2.05806C9.44096 2.17527 9.37511 2.33424 9.37511 2.5V9.67422L3.21808 13.2602C3.14664 13.3016 3.0841 13.3567 3.0341 13.4225C2.9841 13.4882 2.94762 13.5632 2.92677 13.6431C2.90592 13.723 2.90112 13.8062 2.91263 13.888C2.92415 13.9698 2.95176 14.0485 2.99386 14.1195C3.8972 15.6578 5.28168 16.856 6.93365 17.5293C8.58561 18.2025 10.4132 18.3134 12.1345 17.8448C13.8557 17.3762 15.3749 16.3541 16.4576 14.9364C17.5403 13.5186 18.1262 11.7839 18.1251 10C18.1269 8.58916 17.759 7.20247 17.0579 5.97812ZM10.6251 3.15313C11.6164 3.24437 12.576 3.54965 13.4378 4.04791C14.2995 4.54617 15.0429 5.22552 15.6165 6.03906L10.6251 8.94609V3.15313ZM10.0001 16.875C8.90903 16.8722 7.83412 16.6111 6.86336 16.113C5.89259 15.6149 5.05357 14.894 4.41496 14.0094L10.3056 10.5789L10.3228 10.568L16.2423 7.12031C16.7255 8.16777 16.9373 9.31996 16.8583 10.4708C16.7793 11.6216 16.4121 12.734 15.7903 13.7057C15.1685 14.6773 14.3123 15.4768 13.3005 16.0307C12.2886 16.5845 11.1536 16.8749 10.0001 16.875Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>

              <p
                className="tabs-text"
                onClick={() => {
                  navigation("/performance");
                }}
              >
                Performance
              </p>
            </div>

            <div className="sidebar-tabs">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="FolderNotch">
                  <path
                    id="Vector"
                    d="M10 6.25L7.66641 8C7.55822 8.08114 7.42664 8.125 7.29141 8.125H2.5V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29141C7.42664 4.375 7.55822 4.41886 7.66641 4.5L10 6.25Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM3.125 5H7.29141L8.95859 6.25L7.29141 7.5H3.125V5ZM16.875 15.625H3.125V8.75H7.29141C7.56176 8.74933 7.82472 8.66168 8.04141 8.5L10.2086 6.875H16.875V15.625Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>

              <p
                className="tabs-text"
                onClick={() => {
                  navigation("/entries");
                }}
              >
                Entries
              </p>
            </div>

            {/* <div className="sidebar-tabs">
              <svg
                width="30"
                height="30"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="IdentificationBadge">
                  <path
                    id="Vector"
                    d="M15.625 2.5H4.375C4.20924 2.5 4.05027 2.56585 3.93306 2.68306C3.81585 2.80027 3.75 2.95924 3.75 3.125V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V3.125C16.25 2.95924 16.1842 2.80027 16.0669 2.68306C15.9497 2.56585 15.7908 2.5 15.625 2.5ZM10 13.125C9.50555 13.125 9.0222 12.9784 8.61107 12.7037C8.19995 12.429 7.87952 12.0385 7.6903 11.5817C7.50108 11.1249 7.45157 10.6222 7.54804 10.1373C7.6445 9.65232 7.8826 9.20686 8.23223 8.85723C8.58186 8.5076 9.02732 8.2695 9.51227 8.17304C9.99723 8.07657 10.4999 8.12608 10.9567 8.3153C11.4135 8.50452 11.804 8.82495 12.0787 9.23607C12.3534 9.6472 12.5 10.1305 12.5 10.625C12.5 11.288 12.2366 11.9239 11.7678 12.3928C11.2989 12.8616 10.663 13.125 10 13.125Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M5.87422 15.5C5.9399 15.5494 6.01468 15.5853 6.09426 15.6057C6.17385 15.6262 6.25669 15.6307 6.33803 15.6191C6.41937 15.6075 6.49763 15.58 6.56832 15.5381C6.63901 15.4962 6.70075 15.4408 6.75 15.375C7.12841 14.8705 7.61909 14.4609 8.18319 14.1789C8.7473 13.8968 9.36932 13.75 10 13.75C10.6307 13.75 11.2527 13.8968 11.8168 14.1789C12.3809 14.4609 12.8716 14.8705 13.25 15.375C13.2992 15.4407 13.3609 15.496 13.4316 15.5378C13.5022 15.5796 13.5804 15.6071 13.6616 15.6187C13.7429 15.6303 13.8256 15.6258 13.9051 15.6054C13.9846 15.5851 14.0593 15.5492 14.125 15.5C14.1907 15.4508 14.246 15.3891 14.2878 15.3184C14.3296 15.2478 14.3571 15.1696 14.3687 15.0884C14.3803 15.0071 14.3758 14.9244 14.3554 14.8449C14.3351 14.7654 14.2992 14.6907 14.25 14.625C13.6966 13.883 12.9586 13.2988 12.1094 12.9305C12.5748 12.5056 12.9008 11.9499 13.0447 11.3364C13.1887 10.7229 13.1438 10.0802 12.9159 9.49267C12.688 8.90514 12.2879 8.40023 11.7679 8.0442C11.248 7.68816 10.6325 7.49765 10.0023 7.49765C9.37218 7.49765 8.75673 7.68816 8.23678 8.0442C7.71682 8.40023 7.31666 8.90514 7.08879 9.49267C6.86093 10.0802 6.81602 10.7229 6.95995 11.3364C7.10388 11.9499 7.42993 12.5056 7.89531 12.9305C7.0444 13.2981 6.30472 13.8824 5.75 14.625C5.65046 14.7575 5.60763 14.9241 5.63092 15.0882C5.65422 15.2523 5.74173 15.4004 5.87422 15.5ZM10 8.75C10.3708 8.75 10.7334 8.85997 11.0417 9.06599C11.35 9.27202 11.5904 9.56486 11.7323 9.90747C11.8742 10.2501 11.9113 10.6271 11.839 10.9908C11.7666 11.3545 11.588 11.6886 11.3258 11.9508C11.0636 12.213 10.7295 12.3916 10.3658 12.464C10.0021 12.5363 9.62508 12.4992 9.28247 12.3573C8.93986 12.2154 8.64702 11.975 8.44099 11.6667C8.23497 11.3584 8.125 10.9958 8.125 10.625C8.125 10.1277 8.32254 9.65081 8.67417 9.29917C9.02581 8.94754 9.50272 8.75 10 8.75ZM15.625 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V3.125C16.875 2.79348 16.7433 2.47554 16.5089 2.24112C16.2745 2.0067 15.9565 1.875 15.625 1.875ZM15.625 16.875H4.375V3.125H15.625V16.875ZM6.875 5C6.875 4.83424 6.94085 4.67527 7.05806 4.55806C7.17527 4.44085 7.33424 4.375 7.5 4.375H12.5C12.6658 4.375 12.8247 4.44085 12.9419 4.55806C13.0592 4.67527 13.125 4.83424 13.125 5C13.125 5.16576 13.0592 5.32473 12.9419 5.44194C12.8247 5.55915 12.6658 5.625 12.5 5.625H7.5C7.33424 5.625 7.17527 5.55915 7.05806 5.44194C6.94085 5.32473 6.875 5.16576 6.875 5Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>

              <p className="profile-name">Settings</p>
            </div> */}
          </div>
        </div>
        <div style={{ flexDirection: "column" }}>
          <div className="dashboard-header">
            <div className="header-text-container">
              <span className="header-text-1">
                Dashboards / <span className="header-text-2">Integrations</span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 24"
                    fill="none"
                  >
                    <path
                      d="M2.18173 24.0028H7.27256V11.6395L0 6.18506V21.821C0 23.0283 0.978161 24.0028 2.18173 24.0028Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M24.7275 24.0028H29.8183C31.0256 24.0028 32.0001 23.0247 32.0001 21.821V6.18506L24.7275 11.6395"
                      fill="#34A853"
                    />
                    <path
                      d="M24.7275 2.18529V11.6396L32.0001 6.18519V3.27616C32.0001 0.578009 28.9201 -0.960077 26.7639 0.658008"
                      fill="#FBBC04"
                    />
                    <path
                      d="M7.27197 11.6394V2.18506L15.999 8.73038L24.7261 2.18506V11.6394L15.999 18.1847"
                      fill="#EA4335"
                    />
                    <path
                      d="M0 3.27616V6.18519L7.27256 11.6396V2.18529L5.23624 0.658008C3.07629 -0.960077 0 0.578009 0 3.27616Z"
                      fill="#C5221F"
                    />
                  </svg>
                  <div className="connected-app-info-container">
                    <p className="connected-app-info-1">
                      Gmail / Google Workspace
                    </p>
                    <p className="connected-app-info-2">Inbox, Sent</p>
                  </div>
                  <button className="link-button">
                    <p className="link-button-text" style={{ color: "black" }}>
                      Coming Soon
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
                      Coming Soon
                    </p>
                  </button>
                </div>

                <div className="connected-apps-cell">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M16 0C7.16337 0 0 7.16337 0 16C0 24.8366 7.16337 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16337 24.8366 0 16 0Z"
                      fill="#40B3E0"
                    />
                    <path
                      d="M23.7852 9.20387L20.9274 23.6122C20.9274 23.6122 20.5278 24.6115 19.4287 24.1319L12.8339 19.0759L10.4359 17.9169L6.39917 16.5579C6.39917 16.5579 5.77967 16.3381 5.71967 15.8585C5.6598 15.3789 6.41917 15.1191 6.41917 15.1191L22.4662 8.82412C22.4662 8.82412 23.7852 8.24462 23.7852 9.20387Z"
                      fill="white"
                    />
                    <path
                      d="M12.3272 23.4505C12.3272 23.4505 12.1347 23.4325 11.8948 22.673C11.655 21.9136 10.436 17.9168 10.436 17.9168L20.1282 11.7618C20.1282 11.7618 20.6878 11.4221 20.6678 11.7618C20.6678 11.7618 20.7677 11.8217 20.4679 12.1015C20.1682 12.3813 12.854 18.956 12.854 18.956"
                      fill="#D2E5F1"
                    />
                    <path
                      d="M15.3626 21.0143L12.7541 23.3926C12.7541 23.3926 12.5503 23.5473 12.3271 23.4503L12.8266 19.0327"
                      fill="#B5CFE4"
                    />
                  </svg>
                  <div className="connected-app-info-container">
                    <p className="connected-app-info-1">Telegram</p>
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
                        width="32"
                        height="24"
                        viewBox="0 0 32 24"
                        fill="none"
                      >
                        <path
                          d="M13.3165 3.24376C14.3485 2.16844 15.7853 1.50154 17.3744 1.50154C19.4867 1.50154 21.3297 2.67943 22.3111 4.42804C23.164 4.04696 24.108 3.83499 25.1013 3.83499C28.9112 3.83499 32 6.95066 32 10.7938C32 14.6375 28.9112 17.7532 25.1013 17.7532C24.6364 17.7532 24.1819 17.7067 23.7424 17.6178C22.8782 19.1594 21.2312 20.201 19.3409 20.201C18.5495 20.201 17.801 20.0182 17.1346 19.6932C16.2585 21.7541 14.2172 23.1991 11.8382 23.1991C9.36068 23.1991 7.24923 21.6315 6.43875 19.4329C6.08456 19.5082 5.71761 19.5474 5.34108 19.5474C2.39134 19.5474 0 17.1314 0 14.1507C0 12.1532 1.07442 10.4091 2.67077 9.47602C2.34211 8.71978 2.15932 7.88513 2.15932 7.00764C2.15932 3.57972 4.94222 0.800915 8.3747 0.800915C10.39 0.800915 12.181 1.75909 13.3165 3.24376Z"
                          fill="#00A1E0"
                        />
                        <path
                          d="M4.63467 12.4161C4.61462 12.4685 4.64197 12.4794 4.64835 12.4885C4.70852 12.5323 4.7696 12.5637 4.83114 12.5988C5.15752 12.7721 5.46567 12.8227 5.78795 12.8227C6.44436 12.8227 6.85188 12.4735 6.85188 11.9114V11.9005C6.85188 11.3808 6.39194 11.1921 5.96026 11.0558L5.90419 11.0376C5.57872 10.9318 5.29792 10.8407 5.29792 10.6264V10.615C5.29792 10.4318 5.46202 10.2968 5.71638 10.2968C5.999 10.2968 6.3345 10.3908 6.55057 10.5102C6.55057 10.5102 6.61393 10.5512 6.63718 10.4897C6.64994 10.4568 6.75935 10.1624 6.77074 10.1305C6.78305 10.0958 6.76117 10.0703 6.73883 10.0566C6.49222 9.90665 6.15125 9.80409 5.79843 9.80409L5.73279 9.80454C5.132 9.80454 4.71262 10.1674 4.71262 10.6875V10.6984C4.71262 11.2468 5.1753 11.4246 5.6088 11.5486L5.67855 11.57C5.99445 11.6671 6.26658 11.7505 6.26658 11.973V11.9839C6.26658 12.1872 6.08972 12.3386 5.80436 12.3386C5.69359 12.3386 5.34031 12.3363 4.95878 12.0951C4.91274 12.0682 4.88584 12.0486 4.85029 12.0272C4.8316 12.0154 4.78464 11.9949 4.76413 12.0568L4.63467 12.4161Z"
                          fill="white"
                        />
                        <path
                          d="M14.2443 12.4161C14.2242 12.4685 14.2516 12.4794 14.258 12.4885C14.3181 12.5323 14.3792 12.5637 14.4408 12.5988C14.7671 12.7721 15.0753 12.8227 15.3976 12.8227C16.054 12.8227 16.4615 12.4735 16.4615 11.9114V11.9005C16.4615 11.3808 16.0016 11.1921 15.5699 11.0558L15.5138 11.0376C15.1883 10.9318 14.9075 10.8407 14.9075 10.6264V10.615C14.9075 10.4318 15.0716 10.2968 15.326 10.2968C15.6086 10.2968 15.9441 10.3908 16.1602 10.5102C16.1602 10.5102 16.2236 10.5512 16.2468 10.4897C16.2596 10.4568 16.369 10.1624 16.3804 10.1305C16.3927 10.0958 16.3708 10.0703 16.3485 10.0566C16.1018 9.90665 15.7609 9.80409 15.4081 9.80409L15.3424 9.80454C14.7416 9.80454 14.3222 10.1674 14.3222 10.6875V10.6984C14.3222 11.2468 14.7849 11.4246 15.2184 11.5486L15.2882 11.57C15.6041 11.6671 15.8767 11.7505 15.8767 11.973V11.9839C15.8767 12.1872 15.6993 12.3386 15.414 12.3386C15.3032 12.3386 14.9499 12.3363 14.5684 12.0951C14.5224 12.0682 14.495 12.0496 14.4604 12.0272C14.4485 12.0195 14.3929 11.998 14.3738 12.0568L14.2443 12.4161Z"
                          fill="white"
                        />
                        <path
                          d="M20.8043 11.3151C20.8043 11.6328 20.7451 11.8831 20.6284 12.0599C20.5131 12.235 20.3385 12.3202 20.0951 12.3202C19.8512 12.3202 19.6775 12.2354 19.564 12.0599C19.4491 11.8835 19.3908 11.6328 19.3908 11.3151C19.3908 10.9978 19.4491 10.748 19.564 10.573C19.6775 10.3998 19.8512 10.3154 20.0951 10.3154C20.3385 10.3154 20.5131 10.3998 20.6289 10.573C20.7451 10.748 20.8043 10.9978 20.8043 11.3151ZM21.3523 10.7262C21.2985 10.5443 21.2146 10.3838 21.1029 10.2503C20.9912 10.1162 20.8499 10.0087 20.6822 9.93026C20.5149 9.85231 20.3171 9.81266 20.0951 9.81266C19.8726 9.81266 19.6748 9.85231 19.5075 9.93026C19.3397 10.0087 19.1984 10.1162 19.0863 10.2503C18.9751 10.3843 18.8912 10.5447 18.8369 10.7262C18.7836 10.9071 18.7567 11.105 18.7567 11.3151C18.7567 11.5252 18.7836 11.7235 18.8369 11.9041C18.8912 12.0855 18.9746 12.2459 19.0867 12.3799C19.1984 12.514 19.3402 12.6211 19.5075 12.6972C19.6752 12.7733 19.8726 12.8121 20.0951 12.8121C20.3171 12.8121 20.5144 12.7733 20.6822 12.6972C20.8495 12.6211 20.9912 12.514 21.1029 12.3799C21.2146 12.2464 21.2985 12.0859 21.3523 11.9041C21.4061 11.7231 21.433 11.5248 21.433 11.3151C21.433 11.1054 21.4061 10.9071 21.3523 10.7262Z"
                          fill="white"
                        />
                        <path
                          d="M25.8518 12.2354C25.8336 12.1821 25.782 12.2021 25.782 12.2021C25.7023 12.2327 25.6175 12.2609 25.5272 12.2751C25.4356 12.2892 25.3349 12.2965 25.2268 12.2965C24.9615 12.2965 24.7509 12.2176 24.6 12.0617C24.4487 11.9058 24.3639 11.6537 24.3648 11.3128C24.3657 11.0023 24.4405 10.769 24.575 10.5912C24.7085 10.4143 24.9118 10.3236 25.1831 10.3236C25.4092 10.3236 25.5815 10.3496 25.762 10.4066C25.762 10.4066 25.8053 10.4253 25.8258 10.3687C25.8737 10.2356 25.9092 10.1404 25.9603 9.99403C25.9749 9.95255 25.9393 9.93477 25.9265 9.92976C25.8554 9.90195 25.6877 9.85682 25.561 9.83768C25.4424 9.81944 25.3039 9.80987 25.1498 9.80987C24.9196 9.80987 24.7145 9.84907 24.539 9.92748C24.3639 10.0054 24.2153 10.113 24.0977 10.247C23.9801 10.381 23.8908 10.5415 23.831 10.7229C23.7718 10.9039 23.7417 11.1026 23.7417 11.3128C23.7417 11.7672 23.8643 12.1347 24.1064 12.4036C24.3489 12.6735 24.7131 12.8107 25.1881 12.8107C25.4689 12.8107 25.757 12.7537 25.9639 12.6721C25.9639 12.6721 26.0036 12.6529 25.9863 12.6069L25.8518 12.2354Z"
                          fill="white"
                        />
                        <path
                          d="M26.8106 11.0107C26.8365 10.8343 26.8853 10.6875 26.9605 10.5731C27.074 10.3995 27.2473 10.3042 27.4907 10.3042C27.7341 10.3042 27.895 10.3999 28.0103 10.5731C28.0869 10.6875 28.1202 10.8407 28.1334 11.0107H26.8106ZM28.6553 10.6228C28.6088 10.4473 28.4935 10.27 28.4179 10.1889C28.2984 10.0603 28.1817 9.97051 28.0659 9.92037C27.9146 9.85564 27.7332 9.81279 27.5344 9.81279C27.3029 9.81279 27.0927 9.85154 26.9222 9.93176C26.7513 10.012 26.6077 10.1214 26.4951 10.2577C26.3825 10.3935 26.2977 10.5554 26.2439 10.7391C26.1897 10.9218 26.1624 11.1211 26.1624 11.3312C26.1624 11.545 26.1906 11.7442 26.2467 11.9233C26.3032 12.1038 26.3935 12.2629 26.5156 12.3947C26.6373 12.5273 26.7941 12.6313 26.982 12.7037C27.1684 12.7758 27.3949 12.8131 27.6552 12.8127C28.1908 12.8109 28.473 12.6914 28.5892 12.6271C28.6098 12.6158 28.6294 12.5957 28.6047 12.5383L28.4835 12.1987C28.4653 12.1481 28.4137 12.1668 28.4137 12.1668C28.2811 12.216 28.0924 12.3044 27.6525 12.3035C27.3649 12.303 27.1515 12.2183 27.018 12.0856C26.8808 11.9498 26.8137 11.7501 26.8019 11.4684L28.6567 11.4702C28.6567 11.4702 28.7055 11.4693 28.7105 11.4219C28.7123 11.4019 28.7743 11.0408 28.6553 10.6228Z"
                          fill="white"
                        />
                        <path
                          d="M11.9561 11.0107C11.9825 10.8343 12.0308 10.6875 12.106 10.5731C12.2195 10.3995 12.3928 10.3042 12.6362 10.3042C12.8796 10.3042 13.0405 10.3999 13.1563 10.5731C13.2324 10.6875 13.2657 10.8407 13.2789 11.0107H11.9561ZM13.8004 10.6228C13.7539 10.4473 13.639 10.27 13.5634 10.1889C13.4439 10.0603 13.3272 9.97051 13.2115 9.92037C13.0601 9.85564 12.8787 9.81279 12.6799 9.81279C12.4488 9.81279 12.2382 9.85154 12.0677 9.93176C11.8968 10.012 11.7532 10.1214 11.6406 10.2577C11.528 10.3935 11.4432 10.5554 11.3895 10.7391C11.3357 10.9218 11.3079 11.1211 11.3079 11.3312C11.3079 11.545 11.3361 11.7442 11.3922 11.9233C11.4487 12.1038 11.539 12.2629 11.6611 12.3947C11.7828 12.5273 11.9397 12.6313 12.1275 12.7037C12.3139 12.7758 12.5405 12.8131 12.8007 12.8127C13.3364 12.8109 13.6185 12.6914 13.7348 12.6271C13.7553 12.6158 13.7749 12.5957 13.7503 12.5383L13.6295 12.1987C13.6108 12.1481 13.5593 12.1668 13.5593 12.1668C13.4266 12.216 13.2383 12.3044 12.7975 12.3035C12.5104 12.303 12.297 12.2183 12.1635 12.0856C12.0263 11.9498 11.9593 11.7501 11.9474 11.4684L13.8022 11.4702C13.8022 11.4702 13.851 11.4693 13.856 11.4219C13.8578 11.4019 13.9198 11.0408 13.8004 10.6228Z"
                          fill="white"
                        />
                        <path
                          d="M7.94688 12.2252C7.8744 12.1674 7.86437 12.1528 7.83976 12.1154C7.80329 12.0584 7.7846 11.9773 7.7846 11.8742C7.7846 11.7111 7.83839 11.5939 7.95007 11.515C7.94871 11.5155 8.10962 11.376 8.48796 11.381C8.75372 11.3847 8.99121 11.4239 8.99121 11.4239V12.2672H8.99167C8.99167 12.2672 8.756 12.3178 8.4907 12.3337C8.11326 12.3565 7.94551 12.2248 7.94688 12.2252ZM8.68489 10.922C8.60967 10.9165 8.51212 10.9133 8.39543 10.9133C8.23634 10.9133 8.08272 10.9334 7.93868 10.9721C7.79372 11.0109 7.66335 11.0715 7.55121 11.1517C7.43862 11.2324 7.34791 11.3354 7.28227 11.4576C7.21663 11.5798 7.18335 11.7238 7.18335 11.8852C7.18335 12.0493 7.21161 12.192 7.26814 12.3087C7.32466 12.4258 7.40626 12.5234 7.51019 12.5986C7.61321 12.6738 7.74039 12.7289 7.88808 12.7622C8.03349 12.7955 8.19851 12.8124 8.37902 12.8124C8.5691 12.8124 8.75873 12.7969 8.94244 12.7654C9.12432 12.7344 9.34768 12.6893 9.40967 12.6752C9.47121 12.6606 9.53959 12.6419 9.53959 12.6419C9.58563 12.6305 9.58198 12.5813 9.58198 12.5813L9.58107 10.8851C9.58107 10.5131 9.4817 10.2373 9.28614 10.0664C9.0915 9.8959 8.80477 9.80974 8.43418 9.80974C8.29514 9.80974 8.07133 9.82889 7.93731 9.85578C7.93731 9.85578 7.53207 9.93419 7.36523 10.0646C7.36523 10.0646 7.32876 10.0873 7.34882 10.1384L7.4801 10.4912C7.49651 10.5368 7.54073 10.5213 7.54073 10.5213C7.54073 10.5213 7.55486 10.5158 7.57127 10.5063C7.92819 10.3121 8.37947 10.318 8.37947 10.318C8.58004 10.318 8.73412 10.3581 8.83805 10.4379C8.93925 10.5154 8.99076 10.6325 8.99076 10.8796V10.958C8.83121 10.9352 8.68489 10.922 8.68489 10.922Z"
                          fill="white"
                        />
                        <path
                          d="M23.6448 9.96628C23.659 9.92434 23.6293 9.90428 23.617 9.89972C23.5856 9.88742 23.4279 9.85414 23.3062 9.84639C23.0732 9.83226 22.9438 9.87146 22.828 9.92343C22.7131 9.97539 22.5855 10.0593 22.5144 10.1545V9.9289C22.5144 9.89745 22.492 9.87237 22.461 9.87237H21.9856C21.9546 9.87237 21.9323 9.89745 21.9323 9.9289V12.6954C21.9323 12.7264 21.9578 12.7519 21.9888 12.7519H22.4761C22.5071 12.7519 22.5321 12.7264 22.5321 12.6954V11.3133C22.5321 11.1278 22.5526 10.9427 22.5937 10.8264C22.6338 10.7116 22.6885 10.6195 22.756 10.5534C22.8239 10.4878 22.9009 10.4417 22.9852 10.4157C23.0714 10.3893 23.1667 10.3806 23.2341 10.3806C23.3312 10.3806 23.4379 10.4057 23.4379 10.4057C23.4734 10.4098 23.4935 10.3879 23.5054 10.3556C23.5373 10.2708 23.6275 10.0169 23.6448 9.96628Z"
                          fill="white"
                        />
                        <path
                          d="M19.0708 8.68408C19.0115 8.66585 18.9577 8.65354 18.8875 8.64032C18.8164 8.62756 18.7317 8.62117 18.6355 8.62117C18.3 8.62117 18.0356 8.71599 17.8501 8.90288C17.6654 9.08887 17.5401 9.37194 17.4772 9.74437L17.4544 9.86972H17.0332C17.0332 9.86972 16.9821 9.8679 16.9712 9.92351L16.9024 10.3096C16.8973 10.3461 16.9133 10.3693 16.9625 10.3693H17.3723L16.9566 12.6905C16.9242 12.8774 16.8869 13.031 16.8454 13.1477C16.8048 13.2625 16.7652 13.3487 16.7159 13.4116C16.6685 13.4718 16.6238 13.5164 16.5464 13.5424C16.4825 13.5639 16.4087 13.5739 16.328 13.5739C16.2833 13.5739 16.2236 13.5666 16.1794 13.5575C16.1356 13.5488 16.1124 13.5392 16.0791 13.5251C16.0791 13.5251 16.0313 13.5069 16.0121 13.5547C15.9971 13.5944 15.8877 13.8948 15.8744 13.9317C15.8617 13.9686 15.8799 13.9974 15.9032 14.006C15.9579 14.0252 15.9984 14.0379 16.0727 14.0557C16.1758 14.0799 16.2628 14.0812 16.3444 14.0812C16.5149 14.0812 16.6708 14.0571 16.7998 14.0106C16.9293 13.9636 17.0423 13.882 17.1426 13.7717C17.2506 13.6523 17.3185 13.5274 17.3833 13.3564C17.4475 13.1878 17.5027 12.9781 17.5465 12.7338L17.9645 10.3693H18.5753C18.5753 10.3693 18.6268 10.3711 18.6373 10.3151L18.7066 9.92944C18.7111 9.89251 18.6956 9.86972 18.646 9.86972H18.0529C18.0561 9.8565 18.083 9.64773 18.1509 9.45126C18.1801 9.36784 18.2348 9.29992 18.2808 9.25343C18.3264 9.20784 18.3788 9.17548 18.4363 9.15679C18.4951 9.13764 18.5621 9.12853 18.6355 9.12853C18.6911 9.12853 18.7462 9.13491 18.7877 9.14357C18.8452 9.15588 18.8675 9.16226 18.8825 9.16682C18.9432 9.18505 18.9514 9.16727 18.9632 9.1381L19.105 8.74881C19.1196 8.70687 19.0836 8.6891 19.0708 8.68408Z"
                          fill="white"
                        />
                        <path
                          d="M10.7848 12.6955C10.7848 12.7265 10.7625 12.7516 10.7315 12.7516H10.2396C10.2086 12.7516 10.1868 12.7265 10.1868 12.6955V8.737C10.1868 8.70601 10.2086 8.68093 10.2396 8.68093H10.7315C10.7625 8.68093 10.7848 8.70601 10.7848 8.737V12.6955Z"
                          fill="white"
                        />
                      </svg>
                      <div className="connected-app-info-container">
                        <p className="connected-app-info-1">Salesforce</p>
                        <p className="connected-app-info-2">
                          Connected Account: blake@boondoggle.ai
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

                  <button className="link-button" style={{ width: "10%" }}>
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
                    <p className="integrations-table-column-text">
                      blake@boondoggle.ai
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
