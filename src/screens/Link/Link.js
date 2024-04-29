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
    apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
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
    const index = pinecone.index("boondoggle-data-2");

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

    let contactData;

    try {
      const contactResults = await axios.request(contactOptions);
      contactData = contactResults.data;
    } catch {
      contactData = [];
    }

    console.log("Contact Data", contactData);

    let dealData;

    try {
      const dealResults = await axios.request(dealOptions);

      dealData = dealResults.data;
    } catch {
      dealData = [];
    }

    console.log("Deal Data", dealData);

    let companyData;

    try {
      const companyResults = await axios.request(companyOptions);

      companyData = companyResults.data;
    } catch {
      companyData = [];
    }

    console.log("Company Data", companyData);

    // const eventResults = await axios.request(eventOptions);

    // const eventData = eventResults.data;

    // console.log("Event Data", eventData);

    let leadData;

    try {
      const leadResults = await axios.request(leadOptions);

      leadData = leadResults.data;
    } catch {
      leadData = [];
    }

    console.log("Lead Data", leadData);

    let contacts = [];
    let deals = [];
    let companies = [];
    let events = [];
    let leads = [];

    const ns1 = index.namespace(id);

    if (contactData.length > 0) {
      await Promise.all(
        contactData.map(async (item) => {
          const values = Object.values(item);
          console.log("CONTACT VALUEs", values);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${values}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: {
              type: "Contact",
              created_at: item.created_at,
              updated_at: item.updated_at,
              name: item.name,
              title: item.title,
              company: item.company,
              emails: JSON.stringify(item.emails),
              telephones: JSON.stringify(item.telephones),
              deal_ids: item.deal_ids,
              company_ids: item.company_ids,
              address: JSON.stringify(item.address),
            },
          };
          contacts.push(obj);
        })
      );
    }

    if (dealData.length > 0) {
      await Promise.all(
        dealData.map(async (item) => {
          const values = Object.values(item);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${values}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: {
              type: "Deal",
              created_at: item.created_at,
              updated_at: item.updated_at,
              name: item.name,
              amount: item.amount,
              currency: item.currency,
              closed_at: item.closed_at,
              stage: item.stage,
              pipeline: item.pipeline,
              souce: item.source,
              probability: item.probability,
              tags: item.tags,
              lost_reason: item.lost_reason,
              won_reason: item.won_reason,
            },
          };
          deals.push(obj);
        })
      );
    }

    if (companyData.length > 0) {
      await Promise.all(
        companyData.map(async (item) => {
          const values = Object.values(item);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${values}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: {
              type: "Company",
              created_at: item.created_at,
              updated_at: item.updated_at,
              name: item.name,
              deal_ids: item.deal_ids,
              emails: JSON.stringify(item.emails),
              telephones: item.telephones,
              websites: item.websites,
              address: item.address,
              is_active: item.is_active,
              tags: item.tags,
              description: item.description,
              industry: item.industry,
              link_urls: item.link_urls,
              employees: item.employees,
              timezone: item.timezone,
            },
          };
          companies.push(obj);
        })
      );
    }

    // if (eventData.length > 0) {
    //   await Promise.all(
    //     eventData.map(async (item) => {
    //       const values = Object.values(item);
    //       const embedding = await openai.embeddings.create({
    //         model: "text-embedding-3-small",
    //         input: `${values}`,
    //       });

    //       var obj = {
    //         id: item.id,
    //         values: embedding.data[0].embedding,
    //         metadata: {
    //           type: "Event",
    //           created_at: item.created_at,
    //           updated_at: item.updated_at,
    //           type: item.type,
    //           ...(item.note && { note: JSON.stringify(item.note) }),
    //           ...(item.meeting && { meeting: JSON.stringify(item.meeting) }),
    //           ...(item.call && { call: JSON.stringify(item.call) }),
    //           ...(item.task && { task: JSON.stringify(item.task) }),
    //           deal_ids: item.deal_ids,
    //           company_ids: item.company_ids,
    //           contact_ids: item.contact_ids,
    //           lead_ids: item.lead_ids,
    //         },
    //       };
    //       events.push(obj);
    //     })
    //   );
    // }

    if (leadData.length > 0) {
      await Promise.all(
        leadData.map(async (item) => {
          const values = Object.values(item);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${values}`,
          });

          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: {
              type: "Lead",
              created_at: item.created_at,
              updated_at: item.updated_at,
              name: item.name,
              user_id: item.user_id,
              creator_user_id: item.creator_user_id,
              contact_id: item.contact_id,
              company_id: item.company_id,
              company_name: item.company_name,
              is_active: item.is_active,
              address: JSON.stringify(item.address),
              emails: JSON.stringify(item.emails),
              telephones: item.telephones,
              source: item.source,
              status: item.status,
            },
          };
          leads.push(obj);
        })
      );
    }

    console.log("Contacts Embeddings", contacts);
    console.log("Deals Embeddings", deals);
    console.log("Companies Embeddings", companies);
    console.log("Events Embeddings", events);
    console.log("Leads Embeddings", leads);

    if (contacts.length > 0) {
      try {
        await ns1.upsert(contacts);
      } catch (err) {
        console.log(err);
      }
    }

    if (deals.length > 0) {
      try {
        await ns1.upsert(deals);
      } catch (err) {
        console.log(err);
      }
    }

    if (companies.length > 0) {
      try {
        await ns1.upsert(companies);
      } catch (err) {
        console.log(err);
      }
    }
    if (events.length > 0) {
      try {
        await ns1.upsert(events);
      } catch (err) {
        console.log(err);
      }
    }
    if (leads.length > 0) {
      try {
        await ns1.upsert(leads);
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    async function storeData() {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const connection_id = urlParams.get("id");

      localStorage.setItem("connection_id", connection_id);

      console.log("Connection ID", connection_id);

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
            {/* [
                "crm_company_read",
                "crm_contact_read",
                "crm_deal_read",
                "crm_event_read",
                "crm_lead_read",
                "crm_company_write",
                "crm_contact_write",
                "crm_event_write",
                "crm_deal_write",
                "hris_employee_read",
                "crm_lead_write",
                "hris_group_read",
              ] */}
          </div>
          <div className="crm-link">
            <UnifiedDirectory
              workspace_id={"65c02dbec9810ed1f215c33b"}
              categories={["crm"]}
              scopes={[
                "crm_company_read",
                "crm_contact_read",
                "crm_deal_read",
                "crm_event_read",
                "crm_lead_read",
                "crm_company_write",
                "crm_contact_write",
                "crm_event_write",
                "crm_deal_write",
                "hris_employee_read",
                "crm_lead_write",
                "hris_group_read",
              ]}
              success_redirect={window.location.href}
              nostyle={true}
            />
          </div>
          {/* <p className="crm-header-text">Utilize an Alternative CRM</p> */}
          {/* <div className="unified_vendors">
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
          </div> */}
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Link;
