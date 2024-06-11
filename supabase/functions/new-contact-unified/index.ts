// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from '../_shared/cors.ts';
console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const {connection_id, contact, title, description, user_id} = await req.json()

  const url = `https://api.unified.to/crm/${connection_id}/contact`;
  const options = {
    method: "POST",
    headers: {
      'Authorization':
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      "Content-Type": "application/json", // Set Content-Type header
    },
    body: JSON.stringify(contact)
  }

  let contactResults

  try {
    contactResults = await fetch(url, options);
  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    contactResults = await fetch(url, options);

  }
  const contactResponse = await contactResults.json()
  console.log(contactResponse)

  const event = {
    id: contactResponse.id,
    type: "NOTE",
    note: {
      description: description,
    },
    company_ids: contactResponse.company_ids,
    contact_ids: [contactResponse.id],
    user_id: user_id,
    // lead_ids: [],
  }

  const updateURL = `https://api.unified.to/crm/${connection_id}/event`;
  const updateOptions = {
    method: "POST",
    headers: {
      'Authorization':
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      "Content-Type": "application/json", // Set Content-Type header
    },
    body: JSON.stringify(event)
  }

  let updateResults

  try {
    updateResults = await fetch(updateURL, updateOptions);
    

  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateResults = await fetch(updateURL, updateOptions);
    

  }

  const updateResponse = await updateResults.json()

  console.log(updateResponse)

  const data = {
    contact: contactResponse,
    event: updateResponse
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/new-contact-unified' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
