import React, { useEffect, useState } from "react";
import "./Link.css";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedDirectory from "@unified-api/react-directory";
import axios from "axios";
import Stripe from "stripe";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import LoadingOverlay from "react-loading-overlay";

function Link(props) {
  const navigation = useNavigate();
  // const client_id = "989e97a9-d4ee-4979-9e50-f0d9909fc450";
  const client_id = process.env.REACT_APP_AIRTABLE_KEY;
  const redirect_uri = process.env.REACT_APP_LINK_REDIRECT;
  let airtableConnected = false;

  const pinecone = new Pinecone({
    apiKey: "6d937a9a-2789-4947-aedd-f13a7eecb479",
  });

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const [airTableState, setAirTableState] = useState("");
  const [airTableVerifier, setAirTableVerifier] = useState("");
  const [airTableCodeChallene, setAirTableCodeChallenge] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function airTableLogin() {
    const { data, error } = await props.db.functions.invoke("airtable-login");
    console.log(data.codeVerifier);

    localStorage.setItem("verifier", data.codeVerifier);

    const url = `https://airtable.com/oauth2/v1/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=data.records:read%20data.records:write%20schema.bases:read%20schema.bases:write%20user.email:read&state=${data.state}&code_challenge=${data.codeChallenge}&code_challenge_method=S256`;
    window.open(url, "_self");
  }

  async function createPineconeIndexes(connection_id) {
    const index = pinecone.index("boondoggle-data");

    const id = connection_id;

    const contactOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${id}/contact`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
    };

    const dealOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${id}/deal`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
    };

    const companyOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${id}/company`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
    };

    const eventOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${id}/event`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
    };
    const leadOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${id}/lead`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
    };

    const contactResults = await axios.request(contactOptions);

    const contactData = contactResults.data;

    const dealResults = await axios.request(dealOptions);

    const dealData = dealResults.data;

    const companyResults = await axios.request(companyOptions);

    const companyData = companyResults.data;

    const eventResults = await axios.request(eventOptions);

    const eventData = eventResults.data;

    const leadResults = await axios.request(leadOptions);

    const leadData = leadResults.data;

    let contacts = [];
    let deals = [];
    let companies = [];
    let events = [];
    let leads = [];

    const ns1 = index.namespace(id);

    if (contactData.length > 0) {
      await Promise.all(
        contactData.map(async (item) => {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Contact" },
          };
          contacts.push(obj);
        })
      );
    }

    if (dealData.length > 0) {
      await Promise.all(
        dealData.map(async (item) => {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Deal" },
          };
          deals.push(obj);
        })
      );
    }

    if (companyData.length > 0) {
      await Promise.all(
        companyData.map(async (item) => {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Company" },
          };
          companies.push(obj);
        })
      );
    }

    if (eventData.length > 0) {
      await Promise.all(
        eventData.map(async (item) => {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Event" },
          };
          events.push(obj);
        })
      );
    }

    if (leadData.length > 0) {
      await Promise.all(
        leadData.map(async (item) => {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Lead" },
          };
          leads.push(obj);
        })
      );
    }

    if (contacts.length > 0) {
      await ns1.upsert(contacts);
    }
    if (deals.length > 0) {
      await ns1.upsert(deals);
    }
    if (companies.length > 0) {
      await ns1.upsert(companies);
    }
    if (events.length > 0) {
      await ns1.upsert(events);
    }
    if (leads.length > 0) {
      await ns1.upsert(leads);
    }
  }

  useEffect(() => {
    async function storeData() {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const connection_id = urlParams.get("id");

      localStorage.setItem("connection_id", connection_id);

      await createPineconeIndexes(connection_id);

      await props.db.from("data").insert({
        connection_id: connection_id,
        crm_data: [],
        twitter_messages: [],
        twitterLinked: false,
        type: "crm",
      });

      const uid = localStorage.getItem("uid");

      await props.db.from("users").insert({
        id: uid,
        crm_id: connection_id,
        teamMembers: [
          {
            email: localStorage.getItem("email"),
            uid: localStorage.getItem("uid"),
            isAdmin: true,
          },
        ],
      });

      await props.db
        .from("user_data")
        .update({
          onboardingStep: 2,
        })
        .eq("id", uid);

      setIsLoading(false);

      navigation("/home");
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
            redirect_uri: redirect_uri,
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
          // localStorage.setItem("twitterLinked", false);
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

    console.log("Airtable ID", client_id);
    console.log("REDIRECT", redirect_uri);
  }, []);
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="login-container">
        <div className="crm-container">
          <div className="crm-header-container">
            <p className="crm-header-text">Choose your CRM</p>
            {/* <p className="crm-subheader-text">
              Boondoggle will read your CRM structure to match <br /> your
              entries to your team’s existing structure.
            </p>
            <p className="crm-subheader-text">
              Learn more about our data access at Privacy Policy
            </p> */}
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
    </LoadingOverlay>
  );
}

export default Link;
