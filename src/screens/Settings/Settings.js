import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedDirectory from "@unified-api/react-directory";
import axios from "axios";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

function Settings(props) {
  const navigation = useNavigate();

  async function handleSubscription(stripe_id) {
    const { data, error } = await props.db.functions.invoke("stripe-portal", {
      body: {
        stripeId: stripe_id,
        source: window.location.href,
      },
    });

    console.log(data);

    window.open(JSON.parse(data).url, "_blank");
  }

  useEffect(() => {
    async function getStripe() {
      const id = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("user_data")
        .select("")
        .eq("id", id);

      const stripe_id = data[0].stripe_customer_id;

      console.log(stripe_id);

      await handleSubscription(stripe_id);
    }
    getStripe();
  }, []);
  return <div className="container"></div>;
}

export default Settings;
