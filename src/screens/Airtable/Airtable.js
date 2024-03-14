import React, { useEffect, useState } from "react";
import "./Airtable.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import { fontWeight } from "@mui/system";

function Airtable(props) {
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [baseSet, setBaseSet] = useState(false);
  const [tableSet, setTableSet] = useState(false);
  const [chosenBase, setChosenBase] = useState();
  const [chosenTable, setChosenTable] = useState();

  const [entryID, setEntryID] = useState("");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");

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

  async function connectExistingAirtable(base) {
    const connection_id = localStorage.getItem("connection_id");
    const url = `https://api.airtable.com/v0/meta/bases/${base.id}/tables`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${connection_id}`,
        },
      })
      .then((res) => {
        console.log(res);
        setTables(res.data.tables);
        setChosenBase(base);
        setBaseSet(true);
      });
  }

  async function getTable(table) {
    setChosenTable(table);
    setTableSet(true);
    console.log(table);
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

  async function submitAirtable() {
    if (fullName != "" && email != "" && company != "" && summary != "") {
      const connection_id = localStorage.getItem("connection_id");
      const uid = localStorage.getItem("uid");

      const chosen_fields = {
        fullName: fullName,
        email: email,
        company: company,
        summary: summary,
      };

      await props.db
        .from("data")
        .update({
          crm_data: [],
          baseID: chosenBase.id,
          tableID: chosenTable.id,
          fieldOptions: chosen_fields,
        })
        .eq("connection_id", connection_id);
      await props.db
        .from("user_data")
        .update({
          onboardingStep: 2,
        })
        .eq("id", uid);
      navigation("/home");
    }
  }
  return (
    <div className="login-container">
      <div className="crm-container">
        {!baseSet && !tableSet && (
          <>
            <div className="crm-header-container">
              <p className="airtable-header">Choose Airtable Base</p>
              <p className="airtable-subheader">
                Choose which workspace contains your CRM
              </p>
            </div>
            <div className="unified_vendors">
              {bases.map((base) => {
                return (
                  <div
                    key={base.id}
                    className="base-choices"
                    style={{ flexDirection: "column", display: "flex" }}
                    onClick={async () => {
                      await connectExistingAirtable(base);
                    }}
                  >
                    <p className="base-name">{base.name}</p>
                  </div>
                );
              })}
            </div>
            {/* <button
              className="create-base-button"
              onClick={async () => {
                await createAirtable();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M16.875 6.125H10.2086L8.04141 4.5C7.82472 4.33832 7.56176 4.25067 7.29141 4.25H3.125C2.79348 4.25 2.47554 4.3817 2.24112 4.61612C2.0067 4.85054 1.875 5.16848 1.875 5.5V16.125C1.875 16.4565 2.0067 16.7745 2.24112 17.0089C2.47554 17.2433 2.79348 17.375 3.125 17.375H16.9445C17.2575 17.3746 17.5575 17.2501 17.7788 17.0288C18.0001 16.8075 18.1246 16.5075 18.125 16.1945V7.375C18.125 7.04348 17.9933 6.72554 17.7589 6.49112C17.5245 6.2567 17.2065 6.125 16.875 6.125ZM16.875 16.125H3.125V5.5H7.29141L9.45859 7.125C9.67528 7.28668 9.93824 7.37433 10.2086 7.375H16.875V16.125ZM12.5 11.75C12.5 11.9158 12.4342 12.0747 12.3169 12.1919C12.1997 12.3092 12.0408 12.375 11.875 12.375H10.625V13.625C10.625 13.7908 10.5592 13.9497 10.4419 14.0669C10.3247 14.1842 10.1658 14.25 10 14.25C9.83424 14.25 9.67527 14.1842 9.55806 14.0669C9.44085 13.9497 9.375 13.7908 9.375 13.625V12.375H8.125C7.95924 12.375 7.80027 12.3092 7.68306 12.1919C7.56585 12.0747 7.5 11.9158 7.5 11.75C7.5 11.5842 7.56585 11.4253 7.68306 11.3081C7.80027 11.1908 7.95924 11.125 8.125 11.125H9.375V9.875C9.375 9.70924 9.44085 9.55027 9.55806 9.43306C9.67527 9.31585 9.83424 9.25 10 9.25C10.1658 9.25 10.3247 9.31585 10.4419 9.43306C10.5592 9.55027 10.625 9.70924 10.625 9.875V11.125H11.875C12.0408 11.125 12.1997 11.1908 12.3169 11.3081C12.4342 11.4253 12.5 11.5842 12.5 11.75Z"
                  fill="#1C1C1C"
                  fill-opacity="0.4"
                />
              </svg>
              <p className="based-button-text">Create Airtable Base</p>
            </button> */}
          </>
        )}
        {baseSet && !tableSet && (
          <>
            <div className="crm-header-container">
              <p className="airtable-header">Choose Airtable Table</p>
              <p className="airtable-subheader">
                Choose which of your CRMs that Boondoggle should deploy entries
                to.
              </p>
            </div>
            <div className="unified_vendors">
              {tables.map((table) => {
                return (
                  <div
                    key={table.id}
                    className="base-choices"
                    style={{ flexDirection: "column", display: "flex" }}
                    onClick={async () => {
                      await getTable(table);
                    }}
                  >
                    <p className="base-name">{table.name}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {baseSet && tableSet && (
          <div style={{ justifyContent: "center", alignContent: "center" }}>
            <div className="crm-header-container">
              <p className="airtable-header">
                Match Airtable Columns to Boondoggle
              </p>
              <p className="airtable-subheader">
                Select which columns Boondoggle data entries should deploy to.
              </p>
              <p
                className="airtable-subheader"
                style={{ fontWeight: 800, paddingInline: "5%" }}
              >
                Boondoggle currently only supports text & email fields. <br />
                Please request more functionality by emailing
                support@boondoggle.ai
              </p>
            </div>
            <div className="column-matching-table">
              <div className="column-matching-column">
                <div className="column-matching-row">
                  <p className="column-matching-header">Column Name</p>
                </div>
                {/* <div className="column-matching-row">
                  <p className="column-matching-entry">Entry ID</p>
                </div> */}
                <div className="column-matching-row">
                  <p className="column-matching-entry">Name</p>
                </div>
                {/* <div className="column-matching-row">
                  <p className="column-matching-entry">First Name</p>
                </div>
                <div className="column-matching-row">
                  <p className="column-matching-entry">Last Name</p>
                </div> */}
                <div className="column-matching-row">
                  <p className="column-matching-entry">Email</p>
                </div>
                <div className="column-matching-row">
                  <p className="column-matching-entry">Company</p>
                </div>
                <div className="column-matching-row">
                  <p className="column-matching-entry">Summary/Notes</p>
                </div>
              </div>
              <div className="column-matching-column">
                <div className="column-matching-row">
                  <p className="column-matching-header">Column Name</p>
                </div>
                {/* <div className="column-matching-row">
                  <select
                    value={entryID}
                    onChange={(e) => {
                      setEntryID(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email"
                      ) {
                        return <option value={field.id}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div> */}
                <div className="column-matching-row">
                  <select
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {/* <option value="create" className="column-matching-entry">
                      CREATE FIELD
                    </option>
                    <option value="skip" className="column-matching-entry">
                      SKIP FIELD
                    </option> */}
                    {chosenTable.fields.map((field) => {
                      console.log(field);
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email" ||
                        field.type == "multilineText"
                      ) {
                        return <option value={field.name}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div>
                {/* <div className="column-matching-row">
                  <select
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email"
                      ) {
                        return <option value={field.id}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div> */}
                {/* <div className="column-matching-row">
                  <select
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>

                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email"
                      ) {
                        return <option value={field.id}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div> */}
                <div className="column-matching-row">
                  <select
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {/* <option value="create" className="column-matching-entry">
                      CREATE FIELD
                    </option>
                    <option value="skip" className="column-matching-entry">
                      SKIP FIELD
                    </option> */}
                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email" ||
                        field.type == "multilineText"
                      ) {
                        return <option value={field.name}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div>
                <div className="column-matching-row">
                  <select
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {/* <option value="create" className="column-matching-entry">
                      CREATE FIELD
                    </option>
                    <option value="skip" className="column-matching-entry">
                      SKIP FIELD
                    </option> */}
                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email" ||
                        field.type == "multilineText"
                      ) {
                        return <option value={field.name}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div>
                <div className="column-matching-row">
                  <select
                    value={summary}
                    onChange={(e) => {
                      setSummary(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {/* <option value="create" className="column-matching-entry">
                      CREATE FIELD
                    </option> */}
                    {chosenTable.fields.map((field) => {
                      if (
                        field.type == "singleLineText" ||
                        field.type == "email" ||
                        field.type == "multilineText"
                      ) {
                        return <option value={field.name}>{field.name}</option>;
                      }
                    })}
                  </select>
                </div>
              </div>
            </div>
            <button
              className="submit-button"
              onClick={async () => {
                await submitAirtable();
              }}
            >
              <p className="based-button-text">Submit</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Airtable;
