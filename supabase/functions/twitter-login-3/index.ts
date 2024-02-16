// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { TwitterApi } from "npm:twitter-api-v2";
import { corsHeaders } from '../_shared/cors.ts';

console.log("Hello from Functions!")


// const CALLBACK_URL = "http://localhost:3000/home"; 
// const CALLBACK_URL = "https://gwjtbxxhdsqrelswpgdi.supabase.co/functions/v1/twitter-callback"; // Update the callback URL to match your application's URL

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { url} = await req.json()


  const client = new TwitterApi({ appKey: "Abh3jrK5aX8v8hXCRyh87KiNf", appSecret: "Ns1nJm1XGnhFj0O728rKGWgP5mP9tLHdkv1KdFDRFm58dlKWBd" });
  // const authLink = await client.generateAuthLink(CALLBACK_URL); //Sus
  const authLink = await client.generateAuthLink(url, { linkMode: 'authorize' });

  const data = {
    url: authLink
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });


})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/twitter-login-3' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
