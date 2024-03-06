// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { corsHeaders } from '../_shared/cors.ts'
import Nylas from "npm:nylas"

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const config = {
    apiKey: "nyk_v0_Dk8U2N1IQwzWQ8XvAmPcDuoJzQCuwQFodQhUu7uQ7XnbtZ9eJaf6ILrvRKypOSM7",
    apiUri: "https://api.us.nylas.com",
  };

  const nylas = new Nylas({
    apiKey: config.apiKey,
    apiUri: config.apiUri
  });

  const contact = await nylas.contacts.find({
    identifier: "608f59c9-0c2a-4919-9bec-d407db36863e",
    contactId: process.env.CONTACT_ID,
    queryParams: {},
  })


  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-current-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
