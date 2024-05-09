import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const pinecone = new Pinecone({
  apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
});

export async function createPineconeIndexes(connection_id) {
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

  let eventData;

  try {
    const eventResults = await axios.request(eventOptions);

    eventData = eventResults.data;
  } catch {
    eventData = [];
  }

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

  if (eventData.length > 0) {
    await Promise.all(
      eventData.map(async (item) => {
        const values = Object.values(item);
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: `${values}`,
        });

        var obj = {
          id: item.id,
          values: embedding.data[0].embedding,
          metadata: {
            created_at: item.created_at,
            updated_at: item.updated_at,
            type: item.type,
            ...(item.note && { note: JSON.stringify(item.note) }),
            ...(item.meeting && { meeting: JSON.stringify(item.meeting) }),
            ...(item.call && { call: JSON.stringify(item.call) }),
            ...(item.task && { task: JSON.stringify(item.task) }),
            deal_ids: item.deal_ids,
            company_ids: item.company_ids,
            contact_ids: item.contact_ids,
            lead_ids: item.lead_ids,
          },
        };
        events.push(obj);
      })
    );
  }

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
            telephones: JSON.stringify(item.telephones),
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
