import React, { useEffect, useState } from "react";
import "./Link.css";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedDirectory from "@unified-api/react-directory";
import axios from "axios";

function Link(props) {
  const navigation = useNavigate();
  useEffect(() => {
    async function storeData() {
      const urlParams = new URLSearchParams(window.location.search);
      const connection_id = urlParams.get("id");
      console.log(connection_id);
      localStorage.setItem("connection_id", connection_id);
      const options = {
        method: "GET",
        url: `https://api.unified.to/crm/${connection_id}/contact`,
        headers: {
          authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0`,
        },
        params: {
          sort: "updated_at",
          order: "asc",
          query: "",
        },
      };
      const results = await axios.request(options);
      const crm_table = [];
      results.data.map((lead) => {
        const dataObject = {
          id: lead.id,
          customer: lead.name,
          title: "Introduction",
          role: `${lead.title} @ ${lead.company}`,
          contact: lead.emails[0].email,
          location: `${lead.address.city}, ${lead.address.region}`,
          source: "CRM",
        };
        crm_table.push(dataObject);
      });

      await await props.db
        .from("data")
        .insert({ connection_id: connection_id, crm_data: crm_table });

      const uid = localStorage.getItem("uid");
      const { error } = await props.db
        .from("users")
        .insert({ id: uid, crm_id: connection_id });
      navigation("/home");
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      storeData();
    }
  }, []);
  return (
    <div className="login-container">
      <div className="crm-container">
        <h1 className="crm-text">Link Your CRM</h1>
        <div className="crm-link">
          <UnifiedDirectory
            workspace_id={"65c02dbec9810ed1f215c33b"}
            categories={["crm"]}
            success_redirect={window.location.href}
          />
        </div>
      </div>
    </div>
  );
}

export default Link;
