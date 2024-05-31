import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import UnifiedDirectory from "@unified-api/react-directory";

function Messaging(props) {
  useEffect(() => {
    async function storeData() {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const messageOptions = {
        method: "GET",
        url: `https://api.unified.to/messaging/${id}/message`,
        headers: {
          authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
        },
      };
      let messageData;

      try {
        const messageResults = await axios.request(messageOptions);
        console.log("MESSAGE RESULTS", messageResults);
      } catch (err) {
        console.log("ERROR", err);
        messageData = [];
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      storeData();
    }
  }, []);
  return (
    <div className="w-[100vw] h-[100vh] overflow-y-scroll">
      <div className="content-container">
        <Sidebar db={props.db} selectedTab={2} />
        <div className="login-container">
          <div className="crm-container">
            <div className="crm-header-container">
              <p className="crm-header-text">Choose your Messaging</p>
            </div>
            <div className="crm-link">
              <UnifiedDirectory
                workspace_id={"65c02dbec9810ed1f215c33b"}
                categories={["messaging"]}
                success_redirect={window.location.href}
                nostyle={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
