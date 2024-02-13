import React, { useEffect, useState } from "react";
import "./Airtable.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";

function Airtable(props) {
  const [bases, setBases] = useState([]);
  const navigation = useNavigate();
  useEffect(() => {
    async function getData() {
      const connection_id = localStorage.getItem("connection_id");
      console.log(connection_id);

      const url = `https://api.airtable.com/v0/meta/bases`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${connection_id}`,
          },
        })
        .then((res) => {
          console.log(res);
          setBases(res.data.bases);
        });
    }
    getData();
  }, []);

  async function connectExistingAirtable(id) {
    navigation("/connectAirtable", {
      state: {
        id: id,
      },
    });
  }

  async function createAirtable() {
    const url = "https://api.airtable.com/v0/meta/bases";

    const body = {
      name: "Boondoggle CRM",
      tables: [
        {
          description: "A new CRM created by Boondoggle",
          fields: [
            {
              id: "fldge5wexdCcgZfCl",
              name: "Opportunity name",
              type: "singleLineText",
            },
            {
              id: "fldGsiZuVh6hx0zz0",
              name: "Status",
              options: {
                choices: [
                  {
                    color: "blueBright",
                    id: "sel82Ev6E9iyCI9m2",
                    name: "Qualification",
                  },
                  {
                    color: "cyanBright",
                    id: "selH7dalqdVupjrcJ",
                    name: "Proposal",
                  },
                  {
                    color: "yellowBright",
                    id: "selNprVontUH7UEbo",
                    name: "Evaluation",
                  },
                  {
                    color: "purpleBright",
                    id: "selyZwTs1xWEBvQ6L",
                    name: "Negotiation",
                  },
                  {
                    color: "greenBright",
                    id: "sel7kt5MA648rYnbB",
                    name: "Closed—won",
                  },
                  {
                    color: "redBright",
                    id: "seltad5VW089GVQEu",
                    name: "Closed—lost",
                  },
                ],
              },
            },
          ],
        },
      ],
    };
    axios
      .post(url, body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
      });
  }
  return (
    <div className="login-container">
      <div className="crm-container">
        <div className="crm-header-container">
          <p className="crm-header-text">Choose existing Airtable</p>
        </div>
        <div className="unified_vendors">
          {bases.map((base) => {
            return (
              <div
                key={base.id}
                className="unified_vendor"
                style={{ flexDirection: "column", display: "flex" }}
                onClick={async () => {
                  await connectExistingAirtable(base.id);
                }}
              >
                <img
                  src={require("../../assets/airtable.png")}
                  className="unified_image"
                ></img>
                <p className="unified_vendor_name">{base.name}</p>
              </div>
            );
          })}
        </div>
        <div className="crm-header-container">
          <p className="crm-header-text">Or create a new CRM</p>
        </div>
        <button
          className="sign-in-button"
          style={{ width: "20%" }}
          onClick={async () => {
            await createAirtable();
          }}
        >
          Create a New Airtable
        </button>
      </div>
    </div>
  );
}

export default Airtable;
