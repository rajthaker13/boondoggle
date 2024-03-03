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
  await page.setJavaScriptEnabled(true);
  
  const url = "https://twitter.com/messages"
  // const cookies = await page.cookies()
  await page.setCookie({ name: "auth_token", value: session_cookie, domain: ".twitter.com" })
  await page.goto(url);

  await page.waitForSelector('section.css-175oi2r');



  const cellElements = await page.$$('section.css-175oi2r div[data-testid="conversation"]');

  console.log("EKENEEJE")
  console.log(cellElements)

  const cellContents = [];
  for (const cellElement of cellElements) {
    try {
      // Click on the cellElement
      await cellElement.click();

      // Push the content into cellContents after clicking
      cellContents.push(await page.content());

      // Navigate back to the previous page
      await page.goBack();
  } catch (error) {
      console.error("Error interacting with cellElement:", error);
      // Handle any errors that occur during interaction
      // Optionally, you can continue with the loop or break depending on your requirements
  }
  }


  //PROFILE
  // await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div/div')
  // await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/article')
  // const innerHtml = await page.waitForSelector('.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj');


  // await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/form/div[1]/div/div/div/label/div[2]/div/input');

 
  // await page.waitForSelector('.css-175oi2r.r-kemksi.r-16y2uox.r-1jgb5lz.r-13qz1uu');


  const data = {
    text: test,
    data: cellContents
  }
  await browser.close();


  return new Response(
    JSON.stringify(data),
    { headers: {...corsHeaders, "Content-Type": "application/json" } },
  )
})
