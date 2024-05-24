import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Initialize OpenAI and Pinecone clients with API keys from environment variables
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

const pinecone = new Pinecone({
  apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
});

export async function createPineconeIndexes(connection_id) {
  const index = pinecone.index("boondoggle-data-2");

  // Define API request options
  const apiOptions = (type, date) => ({
    method: "GET",
    url: `https://api.unified.to/crm/${connection_id}/${type}?sort=updated_at&order=asc&updated_gte=${date}`,
    headers: {
      authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0`,
    },
  });

  const types = ["contact", "deal", "company", "event", "lead"];

  // Fetch data from all endpoints
  const fetchData = async (type) => {
    try {
      let result = [];
      let dataFetched = false;
      let requests = 0;
      let date = null;
      while (!dataFetched) {
        const response = await axios.request(apiOptions(type, date));
        console.log(type, response.data);
        if (response.data.length == 100) {
          date = response.data[99].updated_at;
          result = [...result, ...response.data];
        } else {
          result = [...result, ...response.data];
          dataFetched = true;
        }
      }
      console.log(type, result);
      return result;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  const [contactData, dealData, companyData, eventData, leadData] =
    await Promise.all(types.map(fetchData));

  // Function to generate embeddings
  const generateEmbeddings = async (data, type) => {
    return await Promise.all(
      data.map(async (item) => {
        try {
          const values = Object.values(item).join(" ");

          const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 15,
          });

          const output = await splitter.createDocuments([JSON.stringify(item)]);

          console.log("output", output);

          let result = [];
          await Promise.all(
            output.map(async (chunk) => {
              console.log("type", typeof chunk.pageContent, chunk.pageContent);

              console.log("CONTENT", chunk.pageContent);

              const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk.pageContent,
              });

              const embedding = response.data[0].embedding;

              const obj = {
                id: item.id,
                values: embedding,
                metadata: {
                  type,
                  ...item,
                  emails: JSON.stringify(item.emails),
                  telephones: JSON.stringify(item.telephones),
                  address: JSON.stringify(item.address),
                  note: item.note && JSON.stringify(item.note),
                  meeting: item.meeting && JSON.stringify(item.meeting),
                  call: item.call && JSON.stringify(item.call),
                  task: item.task && JSON.stringify(item.task),
                },
              };

              result.push(obj);
            })
          );

          return result;
        } catch (error) {
          console.error(`Error generating embedding for ${type}:`, error);
          return null;
        }
      })
    );
  };

  const contacts = await generateEmbeddings(contactData, "Contact");
  const deals = await generateEmbeddings(dealData, "Deal");
  const companies = await generateEmbeddings(companyData, "Company");
  const events = await generateEmbeddings(eventData, "Event");
  const leads = await generateEmbeddings(leadData, "Lead");

  const allEmbeddings = {
    contacts: contacts,
    deals: deals,
    companies: companies,
    events: events,
    leads: leads,
  };

  const ns1 = index.namespace(connection_id);

  // Function to upsert embeddings to Pinecone
  const upsertEmbeddings = async (embeddings, type) => {
    if (embeddings.length > 0) {
      try {
        embeddings.map(async (chunk) => {
          await ns1.upsert(chunk);
        });
        console.log(`${type} embeddings upserted successfully.`);
      } catch (error) {
        console.error(`Error upserting ${type} embeddings:`, error);
      }
    }
  };

  await Promise.all(
    Object.entries(allEmbeddings).map(([type, embeddings]) =>
      upsertEmbeddings(embeddings, type)
    )
  );
}
