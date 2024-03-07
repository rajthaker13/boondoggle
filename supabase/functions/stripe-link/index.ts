// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { corsHeaders } from '../_shared/cors.ts';
import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";

const stripe = Stripe("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", {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjc2Nzk4MywiZXhwIjoyMDIyMzQzOTgzfQ.-KRrMzS7RXyjZpqhf_84CkmDMkp0g0Himi0btAMP96g"
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { planId, stripeId, source } = await req.json();

  const session = await stripe.checkout.sessions.create({
    customer: stripeId,
    payment_method_types: ["card"],
    mode: "subscription",
    subscription_data: {
      items: [
        {
          plan: planId,
        },
      ],
      trial_period_days: 14, 
    },
    // COMMUNITY TODO: Work out whether in prod or dev to use the correct URL
    success_url:
      `${source}?success=true`,
    cancel_url: `${source}?success=false`,
  });

  return new Response(JSON.stringify({ id: session.id}), {
    headers: {...corsHeaders},
  });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-link' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
