import { TwitterApi } from "npm:twitter-api-v2";
import { corsHeaders } from '../_shared/cors.ts';

console.log("Hello from Callback Function!")

const CALLBACK_URL = "http://localhost:3000"; // Update the callback URL to match your application's URL

Deno.serve(async (req) => {
  // Extract tokens from query string
  // console.log(req)
  // const url = new URL(req.url);
  // const oauth_token = url.searchParams.get("oauth_token");
  // const oauth_verifier = url.searchParams.get("oauth_verifier");
  return new Response("Hello", {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })

  
});
