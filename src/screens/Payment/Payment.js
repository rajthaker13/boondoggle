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
      "pk_live_51NO1SKGzsfuVxfRNWcPICBJ0Pvez9Vgwgplcxl7ecqh0W8Y0uArSM9HGOlXMnTgUx5ogyOFqFpWfga4B2SRZwbpr00yHjEviLE"
    );

    console.log(JSON.parse(data).id);

    await stripe?.redirectToCheckout({ sessionId: JSON.parse(data).id });
  }

  useEffect(() => {
    async function getStripe() {
      const id = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("user_data")
        .select("")
        .eq("id", id);

      const stripe_id = data[0].stripe_customer_id;

      await handleSubscription(stripe_id, "prod_PhEOMSYN6ZZFLE");
    }

    async function subscribe() {
      const id = localStorage.getItem("uid");
      await props.db
        .from("user_data")
        .update({
          subscription_status: "STARTER",
        })
        .eq("id", id);
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
          subscribe();

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
