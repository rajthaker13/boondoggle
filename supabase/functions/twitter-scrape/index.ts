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

  const session_cookie = "05def44f865a41581990e5da30c707d85111c93a"
  const page = await browser.newPage();
  const url = "https://twitter.com/messages/904070160356696065-1516937484747296771"
  // const cookies = await page.cookies()
  await page.setCookie({ name: "auth_token", value: session_cookie, domain: ".twitter.com" })
  await page.goto(url);

  const test = await page.content()

  const data = {
    text: test
  }
  await browser.close();


  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" } },
  )
})
