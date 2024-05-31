import React, { useEffect, useState } from "react";
import "./Landing.css";
import { useNavigate, useLocation } from "react-router-dom";

function Landing(props) {
  const { state } = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    if (state) {
      const item = document.getElementById(state.id);
      item.scrollIntoView({ behavior: "smooth" });
    } else {
    }

    async function checkLink() {
      const { data: authListener } = props.db.auth.onAuthStateChange(
        async (event, session) => {
          const currentUrl = window.location.href;
          if (
            event === "SIGNED_IN" &&
            currentUrl.includes("#") &&
            currentUrl == "https://boondoggle.ai/#"
          ) {
            console.log("SESSION", session.access_token);
            const access_tokenUID = session.access_token;
            const refresh_tokenUID = session.refresh_token;
            await props.db.auth.setSession({
              access_tokenUID,
              refresh_tokenUID,
            });
            navigation("/invite");
          } else {
            window.open("https://www.boondoggle.ai", "_self");
          }
        }
      );
    }

    checkLink();
  }, []);
  return <></>;
}

export default Landing;
