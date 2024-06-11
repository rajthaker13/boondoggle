/*
Idea:

Get a pretty large data set of business related emails and spam emails 
For each set, generate embeddings and mark in the metadata whether they are spam or not 
Upload these embeddings to a pinecone index
When scraping the user’s emails, query that email and get back the most similar 
(or top 3, 5, etc) email(s), if it (or majority) are spam, then the email is considered spam.
For each note/email, user can mark if it is spam or not, then the email can be added to db
to improve the querying 
*/

///SAMPLE CODE
///Upserting
/*
import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })
const index = pc.index("pinecone-index")

await index.upsert([
  {
    "id": "A", 
    "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    "metadata": {
	"spam": true
     }
  },
  {
    "id": "B", 
    "values": [0.2, 0.12, 0.2, 0.2, 0.5, 0.2, 0.26, 0.2]
    "metadata": {
	"spam": false
     }
  },
  {
    "id": "C", 
    "values": [0.2, 0.1, 0.2, 0.3, 0.2, 0.5, 0.2, 0.2]
    "metadata": {
	"spam": false
     }
  },
  {
    "id": "D", 
    "values": [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
    "metadata": {
	"spam": true
     }
  }
]);*/


///Querying
/*
const queryResponse = await index.namespace('example-namespace').query({
    vector: [0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 0.2, 0.1],
    topK: 3,
    includeValues: true,
});
// Returns:
// { 
//   matches: [
//             { 
//               id: 'B',
//               score: 0.000072891,
//               values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
//		 metadata: {spam: false}
//             },
//             {
//               id: 'A',
//               score: 0.080000028,
//               values: [0.2, 0.12, 0.2, 0.2, 0.5, 0.2, 0.26, 0.2]
//		 metadata: {spam: true}
//             },
//             {
//               id: 'D',
//               score: 0.0800001323,
//               values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
//		 metadata: {spam: true}
//             }
//           ],
//   namespace: 'example-namespace',
//   usage: {readUnits: 5}}
// }

let spamYes, spamNo = 0;
for(const match of queryResponse.matches) {
  if(match.metadata.spam) {
    spamYes++;
  }
  else {
    spamNo++;
  }
}

return spamYes > spamNo; //return in the shouldProcessEmail() function
*/