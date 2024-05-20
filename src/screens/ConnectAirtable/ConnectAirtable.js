import React, { useEffect } from "react";
import "./ConnectAirtable.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ConnectAirtable(props) {
  const { state } = useLocation();

  useEffect(() => {
    async function getSchema() {
      const connection_id = localStorage.getItem("connection_id");
      const url = `https://api.airtable.com/v0/meta/bases/${state.id}/tables`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${connection_id}`,
          },
        })
        .then((res) => {
          console.log(res);
        });
    }
    getSchema();
  }, []);
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}

export default ConnectAirtable;
