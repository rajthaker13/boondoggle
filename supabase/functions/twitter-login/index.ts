import { corsHeaders } from '../_shared/cors.ts'
import { Client, auth } from "npm:twitter-api-sdk";

console.log(`Function "browser-with-cors" up and running!`)

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authClient = new auth.OAuth2User({
      client_id: "NWVMYlZucXprS0otLUVEQWQ1Wk46MTpjaQ",
      client_secret: "7SMIDqfa25U2wOgtY2rKVacr_6I0o_G4eQEN07gPiw6dAsV03n",
      callback: "https://gwjtbxxhdsqrelswpgdi.supabase.co/auth/v1/callback",
      scopes: ["tweet.read", "users.read", "offline.access"],
    });
    const client = new Client(authClient);
    const authUrl = authClient.generateAuthURL({
      code_challenge_method: "s256",
    });
    console.log("hello")
    console.log(authUrl);
    const { name } = await req.json()
    const data = {
      url: authUrl,
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})