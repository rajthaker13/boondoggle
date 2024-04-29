// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createHash } from "https://deno.land/std@0.111.0/hash/mod.ts";
import { corsHeaders } from '../_shared/cors.ts';


console.log("Hello from Functions!")


Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  function generateState(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_";
    const randomBytesArray = new Uint8Array(length);
    crypto.getRandomValues(randomBytesArray);
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = randomBytesArray[i] % characters.length;
        result += characters.charAt(index);
    }
    return result;
}

  function generateCodeVerifier(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_";
    const randomBytesArray = new Uint8Array(length);
    crypto.getRandomValues(randomBytesArray);
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = randomBytesArray[i] % characters.length;
        result += characters.charAt(index);
    }
    return result;
  }

  async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await createHash("sha256").update(data).digest();
    const base64url = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    return base64url;
  }
  const state = generateState(16)
  console.log("State", state)

  const codeVerifier = generateCodeVerifier(43 + Math.floor(Math.random() * (128 - 43 + 1))); // Generate a length between 43 and 128 characters
  console.log("Verify", codeVerifier)

  const codeChallenge = await generateCodeChallenge(codeVerifier)
  console.log("challenge", codeChallenge)

  const data = {
    state: state,
    codeVerifier: codeVerifier,
    codeChallenge: codeChallenge
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders,"Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/airtable-login' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
