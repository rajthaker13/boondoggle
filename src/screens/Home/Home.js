import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";

function Home(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [twitterLinked, setTwitterLinked] = useState(false);

  async function linkWithTwitter() {
    const { data, error } = await props.db.functions.invoke("twitter-login-3");
    console.log(data);
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  function removeKeyFromArray(array, keyToRemove) {
    array.forEach((obj) => {
      if (obj.hasOwnProperty(keyToRemove)) {
        delete obj[keyToRemove];
        return array;
      }
    });
  }

  async function updateCRM(userData) {
    console.log(userData);
    const connection_id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("data")
      .select()
      .eq("connection_id", connection_id);

    let crm_update = data[0].crm_data;
    console.log(crm_update);

    const openai = new OpenAI({
      apiKey: "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",
    });

    await Promise.all(
      userData.messages.map(async (lead) => {
        if (lead.userData[0].username != "joincrewmate") {
          if (crm_update.includes(lead.messageData.dm_conversation_id)) {
            let array = crm_update.filter((msg) => {
              return msg.id !== lead.messageData.dm_conversation_id;
            });
            crm_update = array;
          }

          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `Give me a one sentence summary of what this twitter DM means in the context of updating a CRM...here is the tweet: ${lead.messageData.text}`,
              },
            ],
            model: "gpt-3.5-turbo",
          });

          console.log(chatCompletion);

          var obj = {
            id: lead.messageData.dm_conversation_id,
            role: "--",
            title: lead.messageData.text,
            source: "Twitter",
            contact: lead.userData[0].username,
            customer: lead.userData[0].name,
            location: "--",
          };

          console.log(obj);

          crm_update.push(obj);
        }
      })
    );

    console.log(crm_update);
    console.log(userData.messages);
    console.log(connection_id);

    await props.db
      .from("data")
      .update({
        crm_data: crm_update,
        twitter_messages: userData.messages,
      })
      .eq("connection_id", connection_id);
    setTwitterLinked(true);
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

  async function checkLinks() {
    const uid = localStorage.getItem("uid");
    const { data, error } = await props.db
      .from("users")
      .select("twitterLinked")
      .eq("id", uid);
    console.log(data);
    // console.log(data[0].twitterLinked);
    // setTwitterLinked(data[0].twitterLinked);
  }

  useEffect(() => {
    async function getData() {
      await captureOauthVerifier();
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("oauth_verifier") && !twitterLinked) {
      getData();
    }
    // checkLinks();
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

            <p
              className="tabs-text"
              style={selectedTab == 0 ? { fontWeight: 700 } : {}}
            >
              Integrations
            </p>
          </div>

          <div className="tabs-container">
            {/* <div className="sidebar-tabs">
              <svg
                width="30"
                height="30"
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
                style={selectedTab == 1 ? { fontWeight: 700 } : {}}
              >
                Performance
              </p>
            </div> */}

            <div className="sidebar-tabs">
              <svg
                width="30"
                height="30"
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
                style={selectedTab == 2 ? { fontWeight: 700 } : {}}
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
                    width="40"
                    height="40"
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
                    className="link-button"
                    onClick={async () => {
                      await linkWithTwitter();
                    }}
                  >
                    <p className="link-button-text">Link</p>
                  </button>
                </div>

                <div className="connected-apps-cell">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
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
                  <button
                    className="link-button"
                    style={{ background: "#f7f9fb" }}
                  >
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
                    width="40"
                    height=""
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
                  <button
                    className="link-button"
                    style={{ background: "#f7f9fb" }}
                  >
                    <p className="link-button-text" style={{ color: "black" }}>
                      Coming Soon
                    </p>
                  </button>
                </div>

                <div className="connected-apps-cell">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
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
                  <button
                    className="link-button"
                    style={{ background: "#f7f9fb" }}
                  >
                    <p className="link-button-text" style={{ color: "black" }}>
                      Coming Soon
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
