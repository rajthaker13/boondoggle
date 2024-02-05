import { corsHeaders } from '../_shared/cors.ts';
import { auth, Client } from "npm:twitter-api-sdk";
// import { encode } from "https://deno.land/std/encoding/base64.ts";


const client_id = "NWVMYlZucXprS0otLUVEQWQ1Wk46MTpjaQ";
const redirect_uri = "https://gwjtbxxhdsqrelswpgdi.supabase.co/auth/v1/callback";
const GET_DM_EVENTS_URL = "https://api.twitter.com/2/dm_events";

console.log(`Function "browser-with-cors" up and running!`);

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authClient = new auth.OAuth2User({
      client_id: "NWVMYlZucXprS0otLUVEQWQ1Wk46MTpjaQ",
      client_secret: "7SMIDqfa25U2wOgtY2rKVacr_6I0o_G4eQEN07gPiw6dAsV03n",
      callback: "https://gwjtbxxhdsqrelswpgdi.supabase.co/auth/v1/callback",
      scopes: ["tweet.read", "users.read", "offline.access"],
    });

    const access = await handleOAuth(authClient, req.url);

    const response = await getUserConversationEvents(access);

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

// async function sha256(input) {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(input);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
//   return hashHex;
// }


async function handleOAuth(authClient, url) {
  const params = new URLSearchParams(url.substring(url.indexOf("?") + 1));
  const code = params.get("code");
  const state = params.get("state");

  // Verify state here if needed

  const code_verifier = "challenge";
  const code_challenge = "challenge";  

  const token = await authClient.requestAccessToken({
    code,
    code_verifier,
  });

  return token.access_token;
}

async function getUserConversationEvents(access) {
  const headers = {
    "Authorization": `Bearer ${access}`,
    "Content-Type": "application/json",
    "User-Agent": "TwitterDevSampleCode",
    "X-TFE-Experiment-environment": "staging1",
    "Dtab-Local": "/s/gizmoduck/test-users-temporary => /s/gizmoduck/gizmoduck",
  };

  const response = await fetch(GET_DM_EVENTS_URL, { headers });

  if (!response.ok) {
    throw new Error(`Request returned an error: ${response.status} ${await response.text()}`);
  }

  return response;
}
