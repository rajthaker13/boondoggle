// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import Stripe from "https://esm.sh/stripe?target=deno";
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";

const stripe = Stripe("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", {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjc2Nzk4MywiZXhwIjoyMDIyMzQzOTgzfQ.-KRrMzS7RXyjZpqhf_84CkmDMkp0g0Himi0btAMP96g"
);

// const server = Deno.listen({ port: 8080 });
// console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

Deno.serve(async (req) => {
  // const signature = request.headers.get("Stripe-Signature");

  // const body = await request.text();
  // let receivedEvent;
  // try {
  //   receivedEvent = await stripe.webhooks.constructEventAsync(
  //     body,
  //     signature,
  //     Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET"),
  //     undefined
  //   );
  // } catch (err) {
  //   return new Response(err.message, { status: 400 });
  // }
  const {record} = await req.json()
  console.log("HEY", {record})

  const customer = await stripe.customers.create({
    email: record.email,
    metadata: {
      supabase_id: record.id,
    },
  });

  const { data, error } = await supabase
    .from("user_data")
    .update({
      stripe_customer_id: customer.id,
    })
    .match({ id: record.id });

  console.log("DATA", {data})

  return new Response(JSON.stringify({ customer_stripe_id: customer.id }), {
    headers: { 'Content-Type': 'application/json' },
  })

})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
