import React, { useEffect, useState } from "react";
import "./Link.css";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedDirectory from "@unified-api/react-directory";
import axios from "axios";
import Stripe from "stripe";

function Link(props) {
  const navigation = useNavigate();
  const client_id = "48135e9a-a46d-4f6c-84bb-94c108457705";
  const redirect_uri = window.location.href;
  let airtableConnected = false;

  const [airTableState, setAirTableState] = useState("");
  const [airTableVerifier, setAirTableVerifier] = useState("");
  const [airTableCodeChallene, setAirTableCodeChallenge] = useState("");

  async function airTableLogin() {
    const { data, error } = await props.db.functions.invoke("airtable-login");
    console.log(data.codeVerifier);

    localStorage.setItem("verifier", data.codeVerifier);

    const url = `https://airtable.com/oauth2/v1/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=data.records:read%20data.records:write%20schema.bases:read%20schema.bases:write%20user.email:read&state=${data.state}&code_challenge=${data.codeChallenge}&code_challenge_method=S256`;
    window.open(url, "_self");
  }
  useEffect(() => {
    async function storeData() {
      const urlParams = new URLSearchParams(window.location.search);
      const connection_id = urlParams.get("id");
      console.log(connection_id);
      localStorage.setItem("connection_id", connection_id);

      await props.db.from("data").insert({
        connection_id: connection_id,
        crm_data: [],
        twitter_messages: [],
        twitterLinked: false,
        type: "crm",
      });

      const uid = localStorage.getItem("uid");
      const { error } = await props.db
        .from("users")
        .insert({ id: uid, crm_id: connection_id });
      navigation("/payment");
    }

    async function connectAirTable() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const code_challenge = urlParams.get("code_challenge");
      const verifier = localStorage.getItem("verifier");

      const url = `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://airtable.com/oauth2/v1/token`;

      axios
        .post(
          url,
          {
            code: code,
            client_id: client_id,
            redirect_uri: "https://boondoggle.ai/link",
            grant_type: "authorization_code",
            code_verifier: verifier,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(async (res) => {
          console.log(res.data.access_token);
          await props.db.from("data").insert({
            connection_id: res.data.access_token,
            crm_data: [],
            twitter_messages: [],
            twitterLinked: false,
            type: "airtable",
          });

          const uid = localStorage.getItem("uid");
          const { error } = await props.db.from("users").insert({
            id: uid,
            crm_id: res.data.access_token,
            refresh_token: res.data.refresh_token,
          });
          localStorage.setItem("twitterLinked", false);
          localStorage.setItem("connection_id", res.data.access_token);
          navigation("/airtable");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      storeData();
    } else if (urlParams.has("code_challenge_method")) {
      connectAirTable();
      airtableConnected = true;
    }
  }, []);
  return (
    <div className="login-container">
      <div className="crm-container">
        <div className="crm-header-container">
          <p className="crm-header-text">Choose your CRM</p>
          <p className="crm-subheader-text">
            Boondoggle will read your CRM structure to match <br /> your entries
            to your team’s existing structure.
          </p>
          <p className="crm-subheader-text">
            Learn more about our data access at Privacy Policy
          </p>
        </div>
        <div className="crm-link">
          <UnifiedDirectory
            workspace_id={"65c02dbec9810ed1f215c33b"}
            categories={["crm"]}
            success_redirect={window.location.href}
            nostyle={true}
          />
        </div>
        <p className="crm-header-text">Utilize an Alternative CRM</p>
        <div className="unified_vendors">
          <div
            className="unified_vendor"
            onClick={async () => {
              await airTableLogin();
            }}
          >
            <img
              src={require("../../assets/airtable.png")}
              className="unified_image"
            ></img>
            <p className="unified_vendor_name">Airtable</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Link;
