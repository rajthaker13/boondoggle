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
      let date = null;
      while (!dataFetched) {
        let response;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            response = await axios.request(apiOptions(type, date));
            break; // Exit the loop if the request is successful
          } catch (err) {
            if (attempt === 3) {
              throw err; // Rethrow the error after the final attempt
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 5000)); // Increase delay with each attempt
          }
        }

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
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Increase delay with each attempt
      return result;
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  const contactData = await fetchData("contact");
  const dealData = await fetchData("deal");
  const companyData = await fetchData("company");
  const eventData = await fetchData("event");
  const leadData = await fetchData("lead");

  // const [contactData, dealData, companyData, eventData, leadData] =
  //   await Promise.all(types.map(fetchData));

  const generateEmbeddings = async (data, type) => {
    const chunkData = (array, size) =>
      array.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(array.slice(i, i + size));
        return acc;
      }, []);

    const processChunk = async (chunk) => {
      return await Promise.all(
        chunk.map(async (item) => {
          try {
            const values = Object.values(item).join(" ");

            const splitter = new RecursiveCharacterTextSplitter({
              chunkSize: 200,
              chunkOverlap: 15,
            });

            const output = await splitter.createDocuments([
              JSON.stringify(item),
            ]);

            let result = [];
            await Promise.all(
              output.map(async (chunk) => {
                let response;

                for (let attempt = 1; attempt <= 3; attempt++) {
                  try {
                    response = await openai.embeddings.create({
                      model: "text-embedding-3-small",
                      input: chunk.pageContent,
                    });
                    break; // Exit the loop if the request is successful
                  } catch (err) {
                    if (attempt === 3) {
                      throw err; // Rethrow the error after the final attempt
                    }
                    await new Promise((resolve) =>
                      setTimeout(resolve, attempt * 2000)
                    ); // Increase delay with each attempt
                  }
                }

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

    const dataChunks = chunkData(data, 100); // Process data in chunks of 100

    let allResults = [];
    for (let chunk of dataChunks) {
      const chunkResults = await processChunk(chunk);
      allResults = allResults.concat(chunkResults);
    }

    return allResults;
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
