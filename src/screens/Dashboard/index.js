import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Accounts from "./Accounts";
import Issues from "./Issues";
import Score from "./Score";
import LoadingBar from "./LoadingBar";
import { Dialog, DialogPanel, Button } from "@tremor/react";
import { createPineconeIndexes } from "../../functions/crm_entries";
import axios from "axios";
import IssuesModal from "./IssuesModal";
import { fetchEnrichmentProfile } from "../../functions/enrich_crm";
import * as Frigade from "@frigade/react";

function Dashboard(props) {
  const [crmConnected, setCRMConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [crmScore, setCRMScore] = useState(0);
  const [numIssues, setNumIssues] = useState(0);
  const [issuesResolved, setIssuesResolved] = useState(false);
  const [linkedInLinked, setLinkedInLinked] = useState(false);
  const [emailLinked, setEmailLinked] = useState(false);
  const [storeDataExecuted, setStoreDataExecuted] = useState(false);
  const [allIssues, setAllIssues] = useState([]);
  const [contactIssues, setContactIssues] = useState([]);
  const [companyIssues, setCompanyIssues] = useState([]);

  useEffect(() => {
    /**
     * Retrieves dashboard data including CRM score based on resolved issues and LinkedIn connectedness.
     * If a connection ID is stored in the local storage, it fetches data accordingly and updates the dashboard state.
     */
    async function getDashboardData() {
      const connection_id = localStorage.getItem("connection_id");
      if (connection_id != null) {
        setCRMConnected(true);
        const { data, error } = await props.db
          .from("data")
          .select()
          .eq("connection_id", connection_id);

        if (data && data[0]) {
          const contactIssuesTemp = data[0].issuesArray.filter(
            (item) => item.type === "Contact"
          );
          const companyIssuesTemp = data[0].issuesArray.filter(
            (item) => item.type === "Company"
          );
          setAllIssues(data[0].issuesArray);
          setContactIssues(contactIssuesTemp);
          setCompanyIssues(companyIssuesTemp);
          // Calc final score
          const finalScore = Math.round(
            (data[0].crm_points / data[0].crm_max_points) * 100
          );
          setCRMScore(finalScore);
          setNumIssues(data[0].issuesArray.length);
        }
      }
      //Check if LinkedIn extension is installed
      try {
        const extensionId = "lgeokfaihmdoipgmajekijkfppdmcnib";
        // Message you want to send to the extension
        const message = {
          action: "getCookie",
          url: "https://www.linkedin.com/", // Specify the correct URL
          cookieName: "li_at", // Specify the correct cookie name
        };
        //Fetches Linkedin cookie
        window.chrome.runtime.sendMessage(
          extensionId,
          message,
          async function (response) {
            if (response != null) {
              setLinkedInLinked(true);
            } else {
              setLinkedInLinked(false);
            }
          }
        );
      } catch (erorr) {
        setLinkedInLinked(false);
        setIsLoading(false); //loading state is reset on error
      }
    }

    /**
     * Stores data related to the current session including CRM connection information,
     * user details, and updates dashboard state with the retrieved data.
     */
    async function storeData() {
      const integrationCategory = localStorage.getItem(
        "selectedIntegrationCat"
      );
      if (integrationCategory == "crm") {
        const urlParams = new URLSearchParams(window.location.search);
        const connection_id = urlParams.get("id");

        setIsLoading(true);

        //retrieve the CRM scan score and the array of issues
        let scanResult;
        try {
          setScanComplete(false);
          scanResult = await createPineconeIndexes(connection_id);
          setScanComplete(true);
          const newScore = scanResult.score;
          const issuesArray = scanResult.issuesArray;

          await props.db.from("data").insert({
            connection_id: connection_id,
            crm_data: [],
            twitter_messages: [],
            twitterLinked: false,
            type: "crm",
            issuesArray: issuesArray,
            crm_points: scanResult.points,
            crm_max_points: scanResult.maxPoints,
          });

          const uid = localStorage.getItem("uid");

          await props.db.from("users").insert({
            id: uid,
            crm_id: connection_id,
            teamMembers: [
              {
                email: localStorage.getItem("email"),
                uid: localStorage.getItem("uid"),
                isAdmin: true,
              },
            ],
            issuesArray: issuesArray,
            crm_points: scanResult.points,
            crm_max_points: scanResult.maxPoints,
          });

          //Scoring here
          setIsLoading(false);
          localStorage.setItem("connection_id", connection_id);
          localStorage.setItem("score", newScore);
          localStorage.setItem("numIssues", issuesArray.length);
          const contactIssuesTemp = issuesArray.filter(
            (item) => item.type === "Contact"
          );
          const companyIssuesTemp = issuesArray.filter(
            (item) => item.type === "Company"
          );
          setAllIssues(issuesArray);
          setContactIssues(contactIssuesTemp);
          setCompanyIssues(companyIssuesTemp);
          setNumIssues(issuesArray.length);
          setCRMScore(newScore);
          var cleanUrl = window.location.href.split("?")[0];
          window.history.replaceState({}, document.title, cleanUrl);
          setCRMConnected(true);
        } catch (error) {
          setIsLoading(false); //loading state is reset on error
        }
      } else if (integrationCategory == "messaging") {
        /**
         * Extracts the id from URL parameters and saves it to db
         */
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("id")) {
          const uid = localStorage.getItem("uid");
          const emailConnectionID = urlParams.get("id");
          var cleanUrl = window.location.href.split("?")[0];
          window.history.replaceState({}, document.title, cleanUrl);

          const connectionOptions = {
            method: "GET",
            url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.unified.to/unified/connection/${emailConnectionID}`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
          };

          const connectionResponse = await axios.request(connectionOptions);

          let emailIDObj = {
            email: connectionResponse.data.auth.emails[0],
            connection_id: emailConnectionID,
            name: connectionResponse.data.auth.name,
          };

          const { data, error } = await props.db
            .from("users")
            .select()
            .eq("id", uid);

          // Check if emailIDObj's email already exists in data[0].email_data
          let emailExists = false;
          let update_package = [];

          if (data && data[0]) {
            emailExists = data[0].email_data.some(
              (item) => item.email === emailIDObj.email
            );
            update_package = [...data[0].email_data];
          }

          // Include emailIDObj in update_package only if its email doesn't exist already
          if (!emailExists) {
            update_package.push(emailIDObj);
            await props.db
              .from("users")
              .update({
                email_data: update_package,
                emailLinked: true,
              })
              .eq("id", uid);
            setEmailLinked(true);
          }
        }
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id && !storeDataExecuted) {
      setStoreDataExecuted(true);
      storeData();
    }

    getDashboardData();
  }, [storeDataExecuted]);
  // Function to update a contact using the API
  async function updateContact(connection_id, contact) {
    const options = {
      method: "PUT",
      url: `https://api.unified.to/crm/${connection_id}/contact/${contact.id}`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
      data: {
        id: contact.id,
        name: contact.customer,
        ...(contact.title && { title: contact.title }),
        ...(contact.company && { company: contact.company }),
        ...(contact.emails &&
          contact.emails.length > 0 && { emails: contact.emails }),
        ...(contact.telephones &&
          contact.telephones.length > 0 && { telephones: contact.telephones }),
        ...(contact.company_ids &&
          contact.company_ids.length > 0 && {
            company_ids: contact.company_ids,
          }),
        ...(contact.address &&
          Object.keys(contact.address).length > 0 && {
            address: contact.address,
          }),
      },
    };
    try {
      const results = await axios.request(options);
      console.log("Contact updated successfully:", results.data);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(contactIssues);
    let crmUpdate = [];
    if (contactIssues.length > 0) {
      console.log("Start fixing");
      let count = 0;
      for (let contact of contactIssues) {
        if (count >= 1) break; // Stop after 3 successful fetches

        if (
          contact.itemData.emails &&
          contact.itemData.emails.length > 0 &&
          contact.itemData.emails[0].email
        ) {
          let profileData = { ...contact.itemData };
          profileData.email = contact.itemData.emails[0].email;
          try {
            const enrichObj = await fetchEnrichmentProfile(
              profileData,
              "Email"
            );
            if (enrichObj !== null) {
              console.log("Fixed", enrichObj); // Logging the enriched profile data

              crmUpdate.push({
                id: contact.UnifiedID,
                customer: enrichObj.name,
                title: enrichObj.title,
                company: enrichObj.company,
                telephones: enrichObj.telephones,
                company_ids: enrichObj.company_ids,
                address: enrichObj.address,
              });
              count++; // Increment only if fetch is successful
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        } else {
          // If issue obj do not have email associated with, enrich it with the company
          let profileData = { ...contact.itemData };
          console.log("SC", profileData);
          try {
            const enrichObj = await fetchEnrichmentProfile(
              profileData,
              "SearchCompany"
            );
            if (enrichObj !== null) {
              console.log("Fixed", enrichObj); // Logging the enriched profile data
              crmUpdate.push({
                id: contact.UnifiedID,
                customer: enrichObj.name,
                title: enrichObj.title,
                company: enrichObj.company,
                telephones: enrichObj.telephones,
                company_ids: enrichObj.company_ids,
                address: enrichObj.address,
                emails: enrichObj.emails,
              });
              count++; // Increment only if fetch is successful
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        }
      }
    }

    // Update all contacts in crmUpdate array
    if (crmUpdate.length > 0) {
      const connection_id = localStorage.getItem("connection_id");

      // Perform all updateContact calls and wait for them to complete
      await Promise.all(
        crmUpdate.map((contact) => updateContact(connection_id, contact))
      );

      // Remove updated contacts from allIssues
      const updatedIssues = allIssues.filter(
        (issue) =>
          !crmUpdate.some((contact) => contact.id === issue.itemData.id)
      );
      setAllIssues(updatedIssues);

      // Wait for the state to update before updating Supabase
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Update Supabase with the modified allIssues array
      await props.db
        .from("data")
        .update({
          issuesArray: updatedIssues,
        })
        .eq("connection_id", connection_id);

      console.log("Supabase updated with modified allIssues array");
    }

    setIsLoading(false);

    // setCRMScore(90);
    setIssuesResolved(true);
    setIsOpen(false);
    localStorage.setItem("resolvedIssues", true);
  };

  const FRIGADE_API_KEY =
    "api_public_p64HUD7ajq3mcgQGzz0R0B44StuQu6r30NpmWSDY9SdLCY8bs0gAdeQMUjDrqmvH";
  const uid = localStorage.getItem("uid");

  console.log("uid: ", uid);

  return (
    <Frigade.Provider apiKey={FRIGADE_API_KEY} userID={uid}>
      <div>
        {isLoading && (
          <LoadingBar
            messages={[
              "Fetching CRM data...",
              "Scanning contacts...",
              "Analyzing deals...",
              "Surveying events...",
              "Generating embeddings...",
              "Finalizing insights and storing findings...",
            ]}
            isLoading={isLoading}
            screen={"dashboard"}
          />
        )}
        <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
          <DialogPanel>
            {modalStep == 0 && (
              <IssuesModal
                issues={contactIssues}
                allIssues={allIssues}
                type="Contact"
              />
            )}
            {/* {modalStep == 1 && (
            <IssuesModal
              issues={companyIssues}
              allIssues={allIssues}
              type="Company"
            />
          )}
          {modalStep == 2 && (
            <>
              <IssuesModal
                issues={allIssues}
                allIssues={allIssues}
                type="All"
              />
            </>
          )} */}

            <Button
              className={
                modalStep === 0
                  ? "w-[100%] h-[46.77px] px-[20.77px] py-[10.38px] bg-red-500 rounded-[10.27px] shadow justify-center items-center gap-[7.79px] inline-flex hover:bg-red-400"
                  : "flex-shrink-0 w-[100%] h-[46.77px] px-[20.77px] py-[10.38px] bg-blue-500 rounded-[10.27px] shadow justify-center items-center hover:bg-blue-400"
              }
              onClick={async () => {
                await handleUpdate();
              }}
            >
              <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                Resolve
              </div>
            </Button>
          </DialogPanel>
        </Dialog>

        {!isLoading && (
          <div className="justify-center items-center w-full h-full">
            <Header selectedTab={0} db={props.db} />
            <Score
              crmConnected={crmConnected}
              setCRMConnected={setCRMConnected}
              crmScore={crmScore}
              numIssues={numIssues}
              issuesResolved={issuesResolved}
            />

            <Accounts
              crmConnected={crmConnected}
              linkedInLinked={linkedInLinked}
              db={props.db}
              emailLinked={emailLinked}
            />
            {crmConnected && (
              <Issues
                crmConnected={crmConnected}
                setIsOpen={setIsOpen}
                issuesResolved={issuesResolved}
                linkedInLinked={linkedInLinked}
                issues={contactIssues}
              />
            )}
          </div>
        )}
      </div>
    </Frigade.Provider>
  );
}

export default Dashboard;
