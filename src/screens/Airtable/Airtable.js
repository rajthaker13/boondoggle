import React, { useEffect, useState } from "react";
import "./Airtable.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import { fontWeight } from "@mui/system";
import { Pinecone } from "@pinecone-database/pinecone";

function Airtable(props) {
  // const client_id = "989e97a9-d4ee-4979-9e50-f0d9909fc450";
  const client_id = process.env.REACT_APP_AIRTABLE_KEY;
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [baseSet, setBaseSet] = useState(false);
  const [tableSet, setTableSet] = useState(false);
  const [chosenBase, setChosenBase] = useState();
  const [chosenTable, setChosenTable] = useState();

  const [differentTables, setDifferentTables] = useState(false);

  const [idFields, setIDFieds] = useState([]);
  const [notesFields, setNotesFields] = useState([]);
  const [emailFields, setEmailFields] = useState([]);
  const [urlFields, setURLFields] = useState([]);
  const [companyFields, setCompanyFields] = useState([]);
  const [entryTypeFields, setEntryTypeFields] = useState([]);
  const [entryDateFields, setEntryDateFields] = useState([]);

  const [entryID, setEntryID] = useState("");
  const [summary, setSummary] = useState("");
  const [connectingField, setConnectingField] = useState("");

  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [twitter, setTwitter] = useState("");
  const [company, setCompany] = useState("");

  const [entryType, setEntryType] = useState("");
  const [entryDate, setEntryDate] = useState("");

  const navigation = useNavigate();

  const pinecone = new Pinecone({
    apiKey: "6d937a9a-2789-4947-aedd-f13a7eecb479",
  });

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

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

  async function getAirtableRefreshToken() {
    const id = localStorage.getItem("connection_id");
    const { data, error } = await props.db
      .from("users")
      .select("")
      .eq("crm_id", id);

    const url = `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://airtable.com/oauth2/v1/token`;
    const refreshTokenResponse = await axios.post(
      url,
      {
        client_id: client_id,
        refresh_token: data[0].refresh_token,
        grant_type: "refresh_token",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const new_access_token = refreshTokenResponse.data.access_token;
    const new_refresh_token = refreshTokenResponse.data.refresh_token;

    await props.db
      .from("users")
      .update({
        crm_id: new_access_token,
        refresh_token: new_refresh_token,
      })
      .eq("id", localStorage.getItem("uid"));

    await props.db
      .from("data")
      .update({
        connection_id: new_access_token,
      })
      .eq("connection_id", id);
    localStorage.setItem("connection_id", new_access_token);

    return new_access_token;
  }

  async function createPineconeIndexesAirtable(baseID, tableID) {
    const index = pinecone.index("boondoggle-data");
    const uid = localStorage.getItem("uid");
    const connection_id = await getAirtableRefreshToken();

    const recordsURL = `https://api.airtable.com/v0/${baseID}/${tableID}`;
    const recordResponse = await axios.get(recordsURL, {
      headers: {
        Authorization: `Bearer ${connection_id}`,
      },
    });

    const recordData = recordResponse.data.records;

    let airtableEmbeddings = [];

    if (recordData.length > 0) {
      await Promise.all(
        recordData.map(async (item) => {
          console.log(item);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: `${item}`,
          });
          var obj = {
            id: item.id,
            values: embedding.data[0].embedding,
            metadata: { type: "Contact" },
          };
          airtableEmbeddings.push(obj);
        })
      );

      const ns1 = index.namespace(uid);

      if (airtableEmbeddings.length > 0) {
        await ns1.upsert(airtableEmbeddings);
      }
    }
  }

  async function createAirtablePinecone(base) {
    const connection_id = localStorage.getItem("connection_id");
    const recordsURL = `https://api.airtable.com/v0/meta/bases/${base.id}/tables`;
    const recordResponse = await axios.get(recordsURL, {
      headers: {
        Authorization: `Bearer ${connection_id}`,
      },
    });
    const tableList = recordResponse.data.tables;
    console.log(tableList);

    let airtableEmbeddings = [];

    await Promise.all(
      tableList.map(async (table) => {
        const tableUrl = `https://api.airtable.com/v0/${base.id}/${table.id}`;
        let tableResponse;
        try {
          tableResponse = await axios.get(tableUrl, {
            headers: {
              Authorization: `Bearer ${connection_id}`,
            },
          });
        } catch (error) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          tableResponse = await axios.get(tableUrl, {
            headers: {
              Authorization: `Bearer ${connection_id}`,
            },
          });
        }
        const tableData = tableResponse.data.records;
        if (tableData.length > 0) {
          await Promise.all(
            tableData.map(async (item) => {
              const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: `${item}`,
              });
              var obj = {
                id: item.id,
                values: embedding.data[0].embedding,
                metadata: {
                  baseID: base.id,
                  tableID: table.id,
                },
              };
              airtableEmbeddings.push(obj);
            })
          );
        }
      })
    );

    const index = pinecone.index("boondoggle-data-2");
    const uid = localStorage.getItem("uid");
    const ns1 = index.namespace(uid);

    console.log("EMBEDDINGS", airtableEmbeddings);

    if (airtableEmbeddings.length > 0) {
      await ns1.upsert(airtableEmbeddings);
    }
    localStorage.setItem("crmType", "airtable");
    await props.db
      .from("data")
      .update({
        baseID: base.id,
      })
      .eq("connection_id", connection_id);
    navigation("/home");
  }

  async function connectExistingAirtable(base) {
    const connection_id = await getAirtableRefreshToken();
    const recordsURL = `https://api.airtable.com/v0/meta/bases/${base.id}/tables`;
    const recordResponse = await axios.get(recordsURL, {
      headers: {
        Authorization: `Bearer ${connection_id}`,
      },
    });
    const tableList = recordResponse.data.tables;
    let identifierList = [];
    let notesList = [];
    let emailsList = [];
    let urlList = [];
    let companyList = [];
    let entryTypeList = [];
    let entryDateList = [];
    tableList.map((table) => {
      console.log(table);
      const tableName = table.name;
      const tableID = table.id;
      const primaryFieldId = table.primaryFieldId;
      table.fields.map((field, index) => {
        if (field.type == "singleLineText" || field.type == "multilineText") {
          identifierList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
          companyList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
          entryTypeList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "formula") {
          identifierList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "multipleRecordLinks") {
          notesList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
          companyList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "email") {
          emailsList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "date") {
          entryDateList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "externalSyncSource" || field.type == "url") {
          urlList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        } else if (field.type == "singleSelect") {
          entryTypeList.push({
            data: field,
            name: `${tableName} - ${field.name}`,
            type: field.type,
            tableID: tableID,
            primaryFieldId: primaryFieldId,
            tableData: table,
          });
        }
      });
      setIDFieds(identifierList);
      setNotesFields(notesList);
      setEmailFields(emailsList);
      setURLFields(urlList);
      setCompanyFields(companyList);
      setEntryTypeFields(entryTypeList);
      setEntryDateFields(entryDateList);
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

  async function chooseFields() {
    const entryIDObject = idFields.find((entry) => entry.name === entryID);
    const summaryObject = idFields.find((entry) => entry.name === summary);
    let linkObject = {};
    if (differentTables) {
      linkObject = notesFields.find((entry) => entry.name === connectingField);
    }

    let emailObject;
    let linkedInObject;
    let twitterObject;
    let companyObject;
    let entryTypeObject;
    let entryDateObject;

    if (email != "skip") {
      emailObject = emailFields.find((entry) => entry.name === email);
    } else {
      emailObject = false;
    }

    if (linkedIn != "skip") {
      linkedInObject = urlFields.find((entry) => entry.name === linkedIn);
    } else {
      linkedInObject = false;
    }

    if (twitter != "skip") {
      twitterObject = urlFields.find((entry) => entry.name === twitter);
    } else {
      twitterObject = false;
    }

    if (company != "skip") {
      companyObject = companyFields.find((entry) => entry.name === company);
    } else {
      companyObject = false;
    }

    if (entryType != "skip") {
      entryTypeObject = entryTypeFields.find(
        (entry) => entry.name === entryType
      );
    } else {
      entryTypeObject = false;
    }

    if (entryDate != "skip") {
      entryDateObject = entryDateFields.find(
        (entry) => entry.name === entryDate
      );
    } else {
      entryDateObject = false;
    }

    const uid = localStorage.getItem("uid");
    const connection_id = await getAirtableRefreshToken();

    const fieldOptions = {
      entryID: entryIDObject,
      summary: summaryObject,
      link: linkObject,
      email: emailObject,
      linkedIn: linkedInObject,
      twitter: twitterObject,
      company: companyObject,
      entryType: entryTypeObject,
      entryDate: entryDateObject,
      differentTables: differentTables,
    };

    await props.db
      .from("data")
      .update({
        crm_data: [],
        baseID: chosenBase.id,
        fieldOptions: fieldOptions,
      })
      .eq("connection_id", connection_id);

    const index = pinecone.index("boondoggle-data");
    let airtableEmbeddings = [];
    if (differentTables) {
      const idRecordsURL = `https://api.airtable.com/v0/${chosenBase.id}/${entryIDObject.tableID}`;
      const idRecordsResponse = await axios.get(idRecordsURL, {
        headers: {
          Authorization: `Bearer ${connection_id}`,
        },
      });
      const idrRecordData = idRecordsResponse.data.records;

      const entryRecordsURL = `https://api.airtable.com/v0/${chosenBase.id}/${summaryObject.tableID}`;
      const entryRecordsResponse = await axios.get(entryRecordsURL, {
        headers: {
          Authorization: `Bearer ${connection_id}`,
        },
      });

      const entryrRecordData = entryRecordsResponse.data.records;

      if (idrRecordData.length > 0) {
        await Promise.all(
          idrRecordData.map(async (item) => {
            const embedding = await openai.embeddings.create({
              model: "text-embedding-ada-002",
              input: `${item}`,
            });
            var obj = {
              id: item.id,
              values: embedding.data[0].embedding,
              metadata: { type: "Contact" },
            };
            airtableEmbeddings.push(obj);
          })
        );
      }

      if (entryrRecordData.length > 0) {
        await Promise.all(
          entryrRecordData.map(async (item) => {
            // console.log("ENTRY", item);
            const embedding = await openai.embeddings.create({
              model: "text-embedding-ada-002",
              input: `${item}`,
            });
            var obj = {
              id: item.id,
              values: embedding.data[0].embedding,
              metadata: { type: "Entry" },
            };
            airtableEmbeddings.push(obj);
          })
        );
      }

      const ns1 = index.namespace(uid);

      if (airtableEmbeddings.length > 0) {
        await ns1.upsert(airtableEmbeddings);
      }

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
                      await createAirtablePinecone(base);
                    }}
                  >
                    <p className="base-name">{base.name}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {baseSet && !tableSet && (
          <div style={{ justifyContent: "center", alignContent: "center" }}>
            <div className="crm-header-container">
              <p className="airtable-header">
                Match Airtable Columns to Boondoggle
              </p>
              <p className="airtable-subheader">
                Select which columns Boondoggle data entries should deploy to.
              </p>
            </div>
            <div className="column-matching-table">
              <div className="column-matching-column">
                <div className="column-matching-row">
                  <p className="column-matching-header">Column Name</p>
                </div>

                <div className="column-matching-row">
                  <p className="column-matching-entry">Contact Name</p>
                </div>

                <div className="column-matching-row">
                  <p className="column-matching-entry">Summary/Notes</p>
                </div>

                {differentTables && (
                  <div className="column-matching-row">
                    <p className="column-matching-entry">Common Field</p>
                  </div>
                )}
              </div>
              <div className="column-matching-column">
                <div className="column-matching-row">
                  <p className="column-matching-header">Column Name</p>
                </div>
                <div className="column-matching-row">
                  <select
                    value={entryID}
                    onChange={(e) => {
                      if (summary != "" && e.target.value != "") {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === e.target.value
                        );
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const entryTable = entryIDObject.tableID;
                        const summaryTable = summaryObject.tableID;

                        if (entryTable != summaryTable) {
                          setDifferentTables(true);
                        } else {
                          setDifferentTables(false);
                        }
                      } else {
                        setDifferentTables("");
                      }
                      setEntryID(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>
                    {idFields.map((field, index) => {
                      {
                        return (
                          <option key={index} value={field.name}>
                            {field.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>

                <div className="column-matching-row">
                  <select
                    value={summary}
                    onChange={(e) => {
                      if (entryID != "" && e.target.value != "") {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );
                        const summaryObject = idFields.find(
                          (entry) => entry.name === e.target.value
                        );

                        const entryTable = entryIDObject.tableID;
                        const summaryTable = summaryObject.tableID;

                        if (entryTable != summaryTable) {
                          setDifferentTables(true);
                        } else {
                          setDifferentTables(false);
                        }
                      } else {
                        setDifferentTables(false);
                      }
                      setSummary(e.target.value);
                    }}
                  >
                    <option value="" className="column-matching-entry"></option>

                    {idFields.map((field, index) => {
                      {
                        return (
                          <option key={index} value={field.name}>
                            {field.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>

                {differentTables && (
                  <div className="column-matching-row">
                    <select
                      value={connectingField}
                      onChange={(e) => {
                        setConnectingField(e.target.value);
                      }}
                    >
                      <option
                        value=""
                        className="column-matching-entry"
                      ></option>

                      {notesFields.map((field, index) => {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const entryTable = entryIDObject.tableID;
                        const summaryTable = summaryObject.tableID;
                        if (
                          entryTable == field.tableID &&
                          summaryTable == field.data.options.linkedTableId
                        ) {
                          {
                            return (
                              <option key={index} value={field.name}>
                                {field.name}
                              </option>
                            );
                          }
                        }
                      })}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <button
              className="submit-button"
              onClick={async () => {
                setTableSet(true);
              }}
            >
              <p className="based-button-text" style={{ color: "black" }}>
                Next
              </p>
            </button>
          </div>
        )}
        {baseSet && tableSet && (
          <>
            <div
              style={{
                justifyContent: "center",
                alignContent: "center",
                paddingInline: "10vw",
              }}
            >
              <div className="crm-header-container">
                <p className="airtable-header">
                  Select Extended Contact Fields
                </p>
                {/* <p className="airtable-subheader">
                  Select extended contact fields
                </p> */}
              </div>
              <div className="column-matching-table">
                <div className="column-matching-column">
                  <div className="column-matching-row">
                    <p className="column-matching-header">Column Name</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">Email</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">LinkedIn</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">Twitter</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">Company</p>
                  </div>
                </div>
                <div className="column-matching-column">
                  <div className="column-matching-row">
                    <p className="column-matching-header">Column Name</p>
                  </div>
                  <div className="column-matching-row">
                    <select
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    >
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>
                      {emailFields.map((field) => {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );

                        const entryTable = entryIDObject.tableID;

                        if (field.tableID == entryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <div className="column-matching-row">
                    <select
                      value={linkedIn}
                      onChange={(e) => {
                        setLinkedIn(e.target.value);
                      }}
                    >
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>
                      {urlFields.map((field) => {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const entryTable = entryIDObject.tableID;
                        const summaryTable = summaryObject.tableID;
                        if (field.tableID == entryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <div className="column-matching-row">
                    <select
                      value={twitter}
                      onChange={(e) => {
                        setTwitter(e.target.value);
                      }}
                    >
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>
                      {urlFields.map((field) => {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const entryTable = entryIDObject.tableID;
                        const summaryTable = summaryObject.tableID;
                        if (field.tableID == entryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
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
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>
                      {companyFields.map((field) => {
                        const entryIDObject = idFields.find(
                          (entry) => entry.name === entryID
                        );

                        const entryTable = entryIDObject.tableID;

                        if (field.tableID == entryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <div className="crm-header-container">
                <p className="airtable-header">Select Extended Entry Fields</p>
                {/* <p className="airtable-subheader">
                  Select extended entry fields
                </p> */}
              </div>
              <div className="column-matching-table">
                <div className="column-matching-column">
                  <div className="column-matching-row">
                    <p className="column-matching-header">Column Name</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">Entry Type</p>
                  </div>

                  <div className="column-matching-row">
                    <p className="column-matching-entry">Entry Date</p>
                  </div>
                </div>
                <div className="column-matching-column">
                  <div className="column-matching-row">
                    <p className="column-matching-header">Column Name</p>
                  </div>

                  <div className="column-matching-row">
                    <select
                      value={entryType}
                      onChange={(e) => {
                        setEntryType(e.target.value);
                      }}
                    >
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>

                      {entryTypeFields.map((field) => {
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const summaryTable = summaryObject.tableID;
                        if (field.tableID == summaryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <div className="column-matching-row">
                    <select
                      value={entryDate}
                      onChange={(e) => {
                        setEntryDate(e.target.value);
                      }}
                    >
                      <option value="skip" className="column-matching-entry">
                        SKIP FIELD
                      </option>

                      {entryDateFields.map((field) => {
                        const summaryObject = idFields.find(
                          (entry) => entry.name === summary
                        );

                        const summaryTable = summaryObject.tableID;
                        if (field.tableID == summaryTable) {
                          return (
                            <option value={field.name}>{field.name}</option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="submit-button"
                onClick={async () => {
                  await chooseFields();
                }}
              >
                <p className="based-button-text">Submit</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Airtable;
