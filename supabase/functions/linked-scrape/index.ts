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

  const session_cookie = "AQEDATM8nvYClQ4aAAABjdfzId8AAAGN-_-l31YAraw4kzupwgwiwrEej49v4_Uns3LpZLEcFwiPmELQnwFHEV1f7_fkqs700cCKnbsD8KS-TcPeCo2NuxKcOPxDIWTZHIo0-Y7y3bEl8oNFII4Hph76"
  const page = await browser.newPage();
  const url = "https://www.linkedin.com/"
  // const cookies = await page.cookies()
  await page.setCookie({ name: "li_at", value: session_cookie, domain: "www.linkedin.com" })
  await page.goto(url);
  await page.click('a[href="https://www.linkedin.com/messaging/?"]');
  await page.waitForNavigation();

  const test = await page.content()

  const conversationLinks = await page.$$eval('a.msg-conversation-listitem__link', links => links.map(link => link.href));

  // console.log("Conversations", conversationLinks)


  const conversationContents = [];
  const result = []

  for (const link of conversationLinks) {
    // console.log(link)
    // await page.click(link)
    const relativePath = new URL(link).pathname;
    console.log(relativePath)
    await page.click(`a[href="${relativePath}"]`)
    // await page.waitForNavigation()
    await page.waitForSelector('body');
    const fullPageContent = await page.content()
    console.log(fullPageContent);
    conversationContents.push(fullPageContent)

    const messages = await page.$$eval('p.msg-s-event-listitem__body', paragraphs => {
      return paragraphs.map(paragraph => paragraph.textContent.trim());
    });
    const profileURL = await page.$$eval('a.app-aware-link.msg-thread__link-to-profile', links => links.map(link => link.href)); 

    console.log("PRIFLE", profileURL)

    const name = await page.$$eval('h2.msg-entity-lockup__entity-title', paragraphs => {
      return paragraphs.map(paragraph => paragraph.textContent.trim());
    }); 

    const senders = await page.$$eval('span.msg-s-message-group__profile-link.msg-s-message-group__name', spans => {
      return spans.map(span => span.textContent.trim());
    });

    console.log("Name", name)

    const data = {
      name: name[0],
      url: profileURL[0],
      messages: messages,
      senders: senders
    }
    result.push(data)
  }

  const data = {
    message: conversationContents,
    text: result
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
