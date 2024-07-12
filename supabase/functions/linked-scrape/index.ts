// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { session_cookie } = await req.json();

    console.log("SESSION COOKIE", session_cookie);

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=c751be2b-0d3d-4e26-8516-f4c774e0df6f`
    });

    const page = await browser.newPage();
    const url = "https://www.linkedin.com/";
    await page.setCookie({ name: "li_at", value: session_cookie, domain: "www.linkedin.com" });
    await page.goto(url);

    const profileLink = await page.$eval('a[href^="/in/"]', (a) => a.href.split('/')[4]);
    console.log("Profile Link:", profileLink);

    await page.click('a[href="https://www.linkedin.com/messaging/?"]');

    await page.waitForSelector('a.msg-conversation-listitem__link', { timeout: 10000 });
    const conversationLinks = await page.$$eval('a.msg-conversation-listitem__link', links => links.map(link => link.href));

    const result = [];

    for (const link of conversationLinks) {
      try {
        const relativePath = new URL(link).pathname;
        console.log(relativePath);
        await page.click(`a[href="${relativePath}"]`);
        await page.waitForSelector('body');
        await page.waitForTimeout(2000); // Ensure content loads properly

        const messages = await page.$$eval('p.msg-s-event-listitem__body', paragraphs => {
          return paragraphs.map(paragraph => paragraph.textContent.trim());
        });

        const profileURL = await page.$$eval('a.app-aware-link.msg-thread__link-to-profile', links => links.map(link => link.href));

        const name = await page.$$eval('h2.msg-entity-lockup__entity-title', paragraphs => {
          return paragraphs.map(paragraph => paragraph.textContent.trim());
        });

        const senders = await page.$$eval('span.msg-s-message-group__profile-link.msg-s-message-group__name', spans => {
          return spans.map(span => span.textContent.trim());
        });
        
        //msg-s-message-list__time-heading t-12 t-black--light t-bold
        const times = await page.$$eval('time.msg-s-message-list__time-heading.t-12.t-black--light.t-bold', timestamps => {
          const today = new Date();
          const currentYear = today.getFullYear();
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const trimmedTimestamps = timestamps.map(ts => {
              let text = ts.textContent.trim();
              let date;
              // Check if the text is a day of the week
              if (text === "Today") {
                date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
              } else if (daysOfWeek.includes(text)) { // Check if the text is a day of the week
                    let dayIndex = daysOfWeek.indexOf(text);
                    let currentDayIndex = today.getDay();
                    let diff = dayIndex - currentDayIndex;
                    date = new Date(today);
                    date.setDate(today.getDate() + diff);
              } else if (text.includes(',')) {
                  // Full date format with year "Jun 5, 2023"
                  date = new Date(text + " 23:59:59"); // end of the day
              } else if (text.match(/^[A-Za-z]+\s\d+$/)) {
                  // Month and day format "Jun 20"
                  date = new Date(`${text}, ${currentYear} 23:59:59`); // end of the day
              } else {
                  return null;
              }
      
              // Convert to ISO string
              return date.toISOString();
          });
          return trimmedTimestamps.length > 1 ? [trimmedTimestamps.pop()] : trimmedTimestamps;
        });


        let messageData = [];
        messages.forEach((message, index) => {
          messageData.push({ text: message, sender: senders[index] });
        });

        const data = {
          name: name[0],
          url: profileURL[0],
          messages: messageData,
          profile: profileLink,
          time: times,
        };
        result.push(data);
      } catch (err) {
        console.error(`Error processing conversation link ${link}:`, err);
      }
    }

    await browser.close();

    const responseData = { text: result };
    return new Response(JSON.stringify(responseData), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/linked-scrape' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
