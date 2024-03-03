// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from '../_shared/cors.ts'
import Nylas from "npm:nylas"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { code } = await req.json()

  console.log("CODE", code)

  const config = {
    clientId: "bcfea5e3-89e3-4586-8251-1f7f82e41c98",
    callbackUri: "https://boondoggle.ai/home",
    apiKey: "nyk_v0_Dk8U2N1IQwzWQ8XvAmPcDuoJzQCuwQFodQhUu7uQ7XnbtZ9eJaf6ILrvRKypOSM7",
    apiUri: "https://api.us.nylas.com",
  };


  const codeExchangePayload = {
    clientSecret: config.apiKey,
    clientId: config.clientId,
    redirectUri: config.callbackUri,
    code,
  };


  const nylas = new Nylas({
    apiKey: config.apiKey,
    apiUri: config.apiUri
  });

  const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
  const { grantId } = response;

  const data = {
    id: grantId,
  }

  console.log(grantId, "GRSANT")

  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/email-callback' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
