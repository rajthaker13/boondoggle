// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { user_id } = await req.json()

  const channelUrl = `https://api.unified.to/messaging/${user_id}/channel`;
  const channelOptions = {
    method: "GET",
    headers: {
      authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
    }
  }
  const emailUrl = `https://api.unified.to/messaging/${user_id}/message?limit=50`;
  const emailOptions = {
    method: "GET",
    headers: {
      authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
    }
  }

  let channelResults;

  try {
    channelResults = await fetch(channelUrl, channelOptions);
  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    channelResults = await fetch(channelUrl, channelOptions);
  }

  const channelResponse = await channelResults.json()
  console.log(channelResponse)

  let emailResults;

  try {
    emailResults = await fetch(emailUrl, emailOptions);
  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    emailResults = await fetch(emailUrl, emailOptions);
  }

  const emailResponse = await emailResults.json()
  console.log(emailResponse)
  
  const data = {
    channelData: channelResponse,
    emailData: emailResponse
  }

  console.log("This is the response")
  console.log(data)

  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" }, })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-emails' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
