import React, { useEffect, useState, useRef } from "react";
import "./Landing.css";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header/Header";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import image from "../../assets/landing/2.svg";
import image2 from "../../assets/landing/1.svg";
import image3 from "../../assets/landing/1-update.svg";
import image4 from "../../assets/landing/cross-platform.svg";
import image5 from "../../assets/landing/crm-choice.svg";

function Landing(props) {
  const [category, selectCategory] = useState("crm");
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
