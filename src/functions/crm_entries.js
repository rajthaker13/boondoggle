import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CRITERIA_WEIGHTS } from "./schemas/criteria_weights";

// Initialize OpenAI and Pinecone clients with API keys from environment variables
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

const pinecone = new Pinecone({
  apiKey: process.env.REACT_APP_LINK_PINECONE_KEY,
});

let progress = 0;

// Create Pinecone indexes and manage data embedding and upsertion
export async function createPineconeIndexes(connection_id) {
  progress = 0;
  let scoreMultiplier = 1.47;
  const startTime = Date.now();
  console.log("start time: ", 0);

  try {
    const index = pinecone.index("boondoggle-data-4");

    let score = 0;
    let maxScore = 0;
    let issuesArray = [];
    const typeCounter = {};
    // Calculate completeness score for different types of CRM data
    const scoreCompleteness = (item, type) => {
      if (!typeCounter[type]) {
        typeCounter[type] = 0;
      }
      typeCounter[type] += 1;
      let itemScore = 0;
      let totalWeight = 0;

      // Define scoring criteria based on data type (Contact, Deal, etc.)
      let criteria;
      if (type === "Contact") {
        criteria = CRITERIA_WEIGHTS.contact;
      } else if (type === "Deal") {
        criteria = CRITERIA_WEIGHTS.deal;
      } else if (type === "Company") {
        criteria = CRITERIA_WEIGHTS.company;
      }

      let missingFields = [];
      let missingFieldsPenalty = 0;
      // Calculate score based on presence of fields and their weighted importance
      // Add missing fields to the issue arrays
      for (const [field, weight] of Object.entries(criteria.fields)) {
        if (typeof weight === "object") {
          // Nested object handling for note field
          if (item[field] !== undefined) {
            for (const [subField, subWeight] of Object.entries(weight)) {
              totalWeight += subWeight;
              if (Array.isArray(item[field])) {
                if (
                  item[field][0] !== undefined &&
                  item[field][0][subField] !== undefined
                ) {
                  itemScore += subWeight;
                } else {
                  missingFields.push(`${field}[0].${subField}`);
                  missingFieldsPenalty += subWeight;
                }
              } else if (item[field][subField] !== undefined) {
                itemScore += subWeight;
              } else {
                missingFields.push(`${field}.${subField}`);
                missingFieldsPenalty += subWeight;
              }
            }
          } else {
            for (const subField of Object.keys(weight)) {
              totalWeight += weight[subField];
              missingFields.push(`${field}.${subField}`);
              missingFieldsPenalty += weight[subField];
            }
          }
        } else {
          totalWeight += weight;
          if (item[field] !== undefined) {
            itemScore += weight;
          } else {
            missingFields.push(field);
            missingFieldsPenalty += weight;
          }
        }
      }

      // Calculate recency score based on the updated_at field
      const lastUpdated = new Date(item.updated_at);
      const createdAt = new Date(item.created_at);
      const today = new Date();

      // Calculate days since last update
      const daysSinceUpdate = (today - lastUpdated) / (1000 * 3600 * 24);
      const recencyScore = Math.max(0, 100 - Math.floor(daysSinceUpdate));

      // Calculate days since creation
      const daysSinceCreation = (today - createdAt) / (1000 * 3600 * 24);
      const creationScore = Math.max(0, 100 - Math.floor(daysSinceCreation));

      // Check if the item is active
      if (item.is_active === false) {
        return null; // Discard inactive items
      }

      const maxPossibleScore = 100; // Maximum possible score, considering recency, creation, and no missing fields

      // Normalize scores to 0-100 scale
      const missingFieldNormalized = (missingFieldsPenalty / totalWeight) * 100; // Missing fields normalized score

      const objectPriority = recencyScore * 0.7 + creationScore * 0.3;

      const enrichmentPriority =
        missingFieldNormalized * 0.7 + objectPriority * 0.3;

      if (missingFields.length > 0 && type !== "Deal") {
        issuesArray.push({
          UnifiedID: item.id,
          itemData: item,
          type: type,
          missingFields: missingFields,
          priority: enrichmentPriority,
        });
      }

      return {
        itemScore: (100 - missingFieldNormalized) * objectPriority, // Adjusted score calculation
        totalWeight: maxPossibleScore * objectPriority, // Account for recency weight in the total weight
      };
    };

    // Define API request options
    // Based on type and date
    const apiOptions = (type, date) => ({
      method: "GET",
      url: `https://api.unified.to/crm/${connection_id}/${type}?sort=updated_at&order=asc&updated_gte=${date}`,
      headers: {
        authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0`,
      },
    });

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
                throw err;
                // Rethrow the error after the final attempt
              }
              await new Promise((resolve) =>
                setTimeout(resolve, attempt * 5000)
              ); // Increase delay with each attempt
            }
          }
          // Handle pagination
          if (response.data.length == 100) {
            date = response.data[99].updated_at;
            result = [...result, ...response.data];
          } else {
            result = [...result, ...response.data];
            dataFetched = true;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Increase delay with each attempt
        return result;
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return [];
      }
    };

    console.log("elapsed time before fetching data: ", Date.now()-startTime);
    const contactData = await fetchData("contact");
    console.log("elapsed time after contacts: ", Date.now()-startTime);
    progress += 2;
    const dealData = await fetchData("deal");
    console.log("elapsed time after deals: ", Date.now()-startTime);
    progress += 1;
    const companyData = await fetchData("company");
    console.log("elapsed time after companies: ", Date.now()-startTime);
    progress += 1;
    const eventData = await fetchData("event");
    progress += 5;
    console.log("elapsed time after events: ", Date.now()-startTime);

    // Handle embedding generation and upsert operations for each type
    const generateEmbeddings = async (data, type) => {
      // Chunk large array into small chunks
      const chunkData = (array, size) =>
        array.reduce((acc, _, i) => {
          if (i % size === 0) acc.push(array.slice(i, i + size));
          return acc;
        }, []);

      const processChunk = async (chunk) => {
        return await Promise.all(
          chunk.map(async (item) => {
            try {
              const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 100,
              });

              const output = await splitter.createDocuments([
                JSON.stringify(item),
              ]);

              if (type != "Event") {
                const completenessScore = scoreCompleteness(item, type);
                score += completenessScore.itemScore;
                maxScore += completenessScore.totalWeight;
              }

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
                      emails: item.emails && JSON.stringify(item.emails),
                      telephones:
                        item.telephones && JSON.stringify(item.telephones),
                      address: item.address && JSON.stringify(item.address),
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
    console.log("elapsed time before embeddings: ", Date.now()-startTime);
    // Fetch all data types and process embeddings
    const contacts = await generateEmbeddings(contactData, "Contact");
    console.log("elapsed time after contact embeddings: ", Date.now()-startTime);
    progress += 1;
    const deals = await generateEmbeddings(dealData, "Deal");
    console.log("elapsed time after deal embeddings: ", Date.now()-startTime);
    progress += 1;
    const companies = await generateEmbeddings(companyData, "Company");
    console.log("elapsed time after company embeddings: ", Date.now()-startTime);
    progress += 1;
    const events = await generateEmbeddings(eventData, "Event");
    console.log("elapsed time after event embeddings: ", Date.now()-startTime);
    progress += 8; // == 32 now

    const allEmbeddings = {
      contacts: contacts,
      deals: deals,
      companies: companies,
      events: events,
    };

    const ns1 = index.namespace(connection_id);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Function to upsert embeddings to Pinecone
    const upsertEmbeddings = async (embeddings, type) => {
      if (Array.isArray(embeddings)) {
        for (const chunk of embeddings) {
          if (Array.isArray(chunk)) {
            let chunkArray = [];
            for (const chunkObject of chunk) {
              chunkArray.push(chunkObject);
            }
            let retries = 3;
            while (retries > 0) {
              try {
                await ns1.upsert(chunkArray);
                break;
              } catch (error) {
                retries--;
                if (retries === 0) {
                  throw error;
                }
                await delay(5000); // Wait for 5 seconds before retrying
              }
            }
          }
        }
      }
    };

    console.log("elapsed time before upserting: ", Date.now()-startTime);
    for (const [type, embeddings] of Object.entries(allEmbeddings)) {
      let retries = 3;
      while (retries > 0) {
        try {
          await upsertEmbeddings(embeddings, type);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error;
          }
          await delay(5000); // Wait for 5 seconds before retrying
        }
      }
      progress += 8;
    }
    // Calc final score
    const finalScore = Math.round(
      (Math.round(score) / Math.round(maxScore)) * 100
    );

    // Sort issuesArray based on priority, descending
    issuesArray.sort((a, b) => b.priority - a.priority);

    return {
      score: finalScore,
      issuesArray: issuesArray,
      typeCounter: typeCounter,
      points: Math.round(score),
      maxPoints: Math.round(maxScore),
    };
  } catch (error) {}
}

export function getProgress() {
  return progress
}
