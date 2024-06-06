// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { connection_id, user_id } = await req.json()

  const url = `https://api.unified.to/messaging/${connection_id}/message`;
  const options = {
    method: "GET",
    headers: {
      'Authorization':
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
    },
    params: {}
  }

  let results;

  try {
    results = await fetch(url, options);
  
  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    results = await fetch(url, options);
  }

  const response = await results.json()
  const data = {
    data: response
  }

  console.log("This is the response")
  console.log(data)

  /*const urlChannel = `https://api.unified.to/messaging/${connection_id}/channel`;
  const optionsChannel = {
    method: "GET",
    headers: {
      'Authorization':
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
    },
    params: {}
  }

  let resultsChannel;

  try {
    resultsChannel = await fetch(urlChannel, optionsChannel);
  
  }
  catch {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    resultsChannel = await fetch(urlChannel, optionsChannel);
  }

  const responseChannel = await resultsChannel.json()
  const dataChannel = {
    data: responseChannel
  }

  console.log("channel results")
  console.log(dataChannel)*/

  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders },
      status: 200
  })
})

  /*const { identifier, source } = await req.json()

  const config = {
    clientId: "bcfea5e3-89e3-4586-8251-1f7f82e41c98",
    callbackUri: source,
    apiKey: "nyk_v0_Dk8U2N1IQwzWQ8XvAmPcDuoJzQCuwQFodQhUu7uQ7XnbtZ9eJaf6ILrvRKypOSM7",
    apiUri: "https://api.us.nylas.com",
  };


  const nylas = new Nylas({
    apiKey: config.apiKey,
    apiUri: config.apiUri
  });


  const messages = await nylas.threads.list({
    identifier,
    queryParams: {
      limit: 50,
    },
  });

  console.log('Recent Threads:', messages)

  const data = {
    data: messages,
  }


  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" } },
  )
})*/

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-emails' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
