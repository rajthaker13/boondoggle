// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=c751be2b-0d3d-4e26-8516-f4c774e0df6f`
  });
  const page = await browser.newPage();
  const url = "https://www.linkedin.com/"
  // const cookies = await page.cookies()
  await page.setCookie({ name: "li_at", value: "AQEDATM8nvYEypToAAABjcgCu7YAAAGN7A8_tlYAICw7e2fNjj1PxAAFSAc9MUba-Ev5TmFx-EnSh4_BZek5LoA3fL27gmfDy42C-HwlMCuHYTruKQOqk3vKHgSeV1I-eBnp0-OZST3c0MpF8pty_zfX", domain: "www.linkedin.com" })
  await page.goto(url);
  await page.click('a[href="https://www.linkedin.com/messaging/?"]');
  await page.waitForNavigation();
  const content = await page.content();
  console.log(content);

  const data = {
    message: content,
  }
  await browser.close();


  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/linked-scrape' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
