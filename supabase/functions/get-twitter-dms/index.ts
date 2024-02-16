// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { TwitterApi } from "npm:twitter-api-v2";
import { corsHeaders } from '../_shared/cors.ts';

console.log("Hello from Functions!")


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { token, secret, oauthVerifier } = await req.json();
  // console.log(token)
  // console.log(secret)
  // console.log(oauthVerifier)
  const client = new TwitterApi({
    appKey: "Abh3jrK5aX8v8hXCRyh87KiNf", 
    appSecret: "Ns1nJm1XGnhFj0O728rKGWgP5mP9tLHdkv1KdFDRFm58dlKWBd",
    accessToken: token,
    accessSecret: secret,
  });


  const { client: loggedClient, accessToken, accessSecret } = await client.login(oauthVerifier)

  const options = {
    'dm_event.fields': 'dm_conversation_id,created_at,sender_id,attachments,participant_ids,referenced_tweets'
  };
  

  
  const meUser = await loggedClient.v2.me({expansions: ['pinned_tweet_id']})
  const messages = await loggedClient.v2.listDmEvents(options);
  console.log(meUser)
  console.log(messages)
  console.log(messages.events)

  let result = []
  
  await Promise.all(messages.events.map(async (message) => {
    const user = await loggedClient.v2.users([message.sender_id])
    console.log("JESUS", user)
    const messageObject = {
      messageData: message,
      userData: user.data
    }
    result.push(messageObject)
  }))

  const data = {
    messages: result,
    meUser: meUser,
    accessToken: accessToken, 
    accessSecret: accessSecret
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })




})