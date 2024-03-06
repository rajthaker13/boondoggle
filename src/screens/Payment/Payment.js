import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

function Payment(props) {
  const navigation = useNavigate();

  async function handleSubscription(stripe_id, productId) {
    const { data, error } = await props.db.functions.invoke("stripe-link", {
      body: {
        planId: "price_1OrI9UGzsfuVxfRN3bWrN3aV",
        stripeId: stripe_id,
        source: window.location.href,
      },
    });

    const stripe = await loadStripe(
      "pk_test_51NO1SKGzsfuVxfRNsyxoUVdhyvJ7CC9M0VJLRF2yZ6N7yBCI99l4hxEVXWGQatwFchpFsoX968jOhmWLbBM2zQhL00jFCbL7XA"
    );

    console.log(JSON.parse(data).id);

    await stripe?.redirectToCheckout({ sessionId: JSON.parse(data).id });

    console.log("WORKPLS", data[0]);
  }

  useEffect(() => {
    async function getStripe() {
      const id = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("user_data")
        .select("")
        .eq("id", id);

      const stripe_id = data[0].stripe_customer_id;

      await handleSubscription(stripe_id, "prod_PgfUENZu6CBtgR");
    }

    console.log(window.location.pathname);

    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.pathname == "/payment") {
      if (urlParams.has("success")) {
        const result = urlParams.get("success");

        if (result == "false") {
          navigation("/payment");
          getStripe();
        } else if (result == "true") {
          navigation("/home");
        }
      } else {
        getStripe();
      }
    }
  }, []);
  return <div className="container"></div>;
}

export default Payment;
