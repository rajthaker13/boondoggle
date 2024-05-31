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
  const index = pinecone.index("boondoggle-data-3");

  let score = 0;
  let maxScore = 0;
  let issuesArray = [];

  const scoreCompleteness = (item, type) => {
    let itemScore = 0;
    let totalWeight = 0;

    let criteria;

    if (type === "Contact") {
      criteria = {
        fields: {
          name: 25,
          title: 10,
          company: 20,
          emails: {
            email: 15,
            type: 5,
          },
          telephones: {
            telephone: 15,
            type: 5,
          },
          deal_ids: 10,
          company_ids: 10,
          address: {
            address1: 5,
            address2: 2,
            city: 5,
            region: 5,
            region_code: 2,
            postal_code: 5,
            country: 5,
            country_code: 2,
          },
        },
      };
    } else if (type === "Deal") {
      criteria = {
        fields: {
          name: 20,
          amount: 25,
          currency: 10,
          stage: 20,
          source: 10,
          pipeline: 10,
          probability: 10,
          tags: 5,
          closed_at: 2,
          lost_reason: 1.5,
          won_reason: 1.5,
        },
      };
    } else if (type === "Company") {
      criteria = {
        fields: {
          name: 25,
          deal_ids: 10,
          emails: {
            email: 15,
            type: 5,
          },
          telephones: {
            telephone: 15,
            type: 5,
          },
          websites: 10,
          address: {
            address1: 5,
            address2: 2,
            city: 5,
            region: 5,
            region_code: 2,
            postal_code: 5,
            country: 5,
            country_code: 2,
          },
          is_active: 10,
          tags: 5,
          description: 10,
          industry: 10,
          link_urls: 5,
          employees: 5,
          timezone: 5,
        },
      };
    } else if (type === "Event") {
      criteria = {
        fields: {
          type: 25,
          company_ids: 20,
          contact_ids: 20,
          lead_ids: 20,
          ...(item.type === "NOTE" && {
            note: {
              description: 5,
              title: 5,
            },
          }),
          ...(item.type === "MEETING" && {
            meeting: {
              start_at: 5,
              end_at: 5,
              title: 5,
              description: 5,
            },
          }),
          ...(item.type === "EMAIL" && {
            email: {
              from: 5,
              to: 5,
              cc: 2,
              subject: 5,
              body: 5,
              attachment_file_ids: 3,
            },
          }),
          ...(item.type === "CALL" && {
            call: {
              duration: 5,
              description: 5,
              start_at: 5,
            },
          }),
          ...(item.type === "TASK" && {
            task: {
              name: 5,
              status: 5,
              description: 5,
              due_at: 5,
            },
          }),
        },
      };
    } else if (type === "Lead") {
      criteria = {
        fields: {
          name: 25,
          user_id: 10,
          creator_user_id: 5,
          contact_id: 10,
          company_id: 10,
          company_name: 10,
          is_active: 10,
          address: {
            address1: 5,
            address2: 2,
            city: 5,
            region: 5,
            region_code: 2,
            postal_code: 5,
            country: 5,
            country_code: 2,
          },
          emails: {
            email: 15,
            type: 5,
          },
          telephones: {
            telephone: 15,
            type: 5,
          },
          source: 10,
          status: 10,
        },
      };
    }

    let missingFields = [];

    for (const [field, weight] of Object.entries(criteria.fields)) {
      if (typeof weight === "object") {
        // Nested object handling for note field
        if (item[field] !== undefined) {
          for (const [subField, subWeight] of Object.entries(weight)) {
            totalWeight += subWeight;
            if (item[field][subField] !== undefined) {
              itemScore += subWeight;
            } else {
              missingFields.push(`${field}.${subField}`);
            }
          }
        } else {
          for (const subField of Object.keys(weight)) {
            totalWeight += weight[subField];
            missingFields.push(`${field}.${subField}`);
          }
        }
      } else {
        totalWeight += weight;
        if (item[field] !== undefined) {
          itemScore += weight;
        } else {
          missingFields.push(field);
        }
      }
    }

    if (missingFields.length > 0) {
      issuesArray.push({
        item: item,
        type: type,
        missingFields: missingFields,
      });
    }
    console.log(type, item, "SCORE", itemScore, "Weight", totalWeight);

    return {
      itemScore: itemScore,
      totalWeight: totalWeight,
    };
  };

  // Define API request options
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
            await new Promise((resolve) => setTimeout(resolve, attempt * 5000)); // Increase delay with each attempt
          }
        }

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

  const contactData = await fetchData("contact");
  const dealData = await fetchData("deal");
  const companyData = await fetchData("company");
  const eventData = await fetchData("event");
  const leadData = await fetchData("lead");

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

            const completenessScore = scoreCompleteness(item, type);
            score += completenessScore.itemScore;
            maxScore += completenessScore.totalWeight;

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

  const finalScore = Math.round((score / maxScore) * 100);

  console.log("Points", score);
  console.log("Max", maxScore);

  console.log("FINAL SCORE", finalScore);
  console.log("ISSUEs", issuesArray);

  return {
    score: finalScore,
    issuesArray: issuesArray,
    points: score,
    maxPoints: maxScore,
  };
}
