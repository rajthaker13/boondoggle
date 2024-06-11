import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Accounts from "./Accounts";
import Issues from "./Issues";
import Score from "./Score";
import LoadingOverlay from "react-loading-overlay";
import { Dialog, DialogPanel, Button } from "@tremor/react";
import ContactsDemo from "./DemoData/ContactsDemo";
import DealsDemo from "./DemoData/DealsDemo";
import { createPineconeIndexes } from "../../functions/crm_entries";
import axios from "axios";

function Dashboard(props) {
  const [crmConnected, setCRMConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openCookieModal, setOpenCookieModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [crmScore, setCRMScore] = useState(0);
  const [numIssues, setNumIssues] = useState(0);
  const [issuesResolved, setIssuesResolved] = useState(false);
  const [linkedInLinked, setLinkedInLinked] = useState(false);

  useEffect(() => {
    /**
     * Retrieves dashboard data including CRM score based on resolved issues and LinkedIn connectedness.
     * If a connection ID is stored in the local storage, it fetches data accordingly and updates the dashboard state.
     */
    async function getDashboardData() {
      const connection_id = localStorage.getItem("connection_id");
      if (connection_id != null) {
        const resolved = localStorage.getItem("resolvedIssues");
        const linkedIn = localStorage.getItem("linkedinLinked");
        if (resolved != null) {
          setCRMScore(linkedIn != null ? 92 : 90);
          setCRMConnected(true);
          setIssuesResolved(true);
          if (linkedIn != null) {
            setLinkedInLinked(true);
          }
        } else {
          setCRMScore(localStorage.getItem("score"));
          setNumIssues(localStorage.getItem("numIssues"));
          setCRMConnected(true);
        }
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
      console.log("Integration Category: ", integrationCategory);
      if (integrationCategory == "crm") {
        setIsLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const connection_id = urlParams.get("id");

        //retrieve the CRM scan score and the array of issues
        const scanResult = await createPineconeIndexes(connection_id);
        const newScore = scanResult.score;
        const issuesArray = scanResult.issuesArray;

        await props.db.from("data").insert({
          connection_id: connection_id,
          crm_data: [],
          twitter_messages: [],
          twitterLinked: false,
          type: "crm",
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
        });

        //Scoring here
        setIsLoading(false);
        localStorage.setItem("connection_id", connection_id);
        localStorage.setItem("score", newScore);
        localStorage.setItem("numIssues", issuesArray.length);
        setNumIssues(issuesArray.length);
        setCRMScore(newScore);
        var cleanUrl = window.location.href.split("?")[0];
        window.history.replaceState({}, document.title, cleanUrl);
        setCRMConnected(true);
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
            url: `https://api.unified.to/unified/connection/${emailConnectionID}`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
          };

          const connectionResponse = await axios.request(connectionOptions);

          console.log("connect resp: ", connectionResponse);
          let emailIDObj = {
            email: connectionResponse.data.auth.emails[0],
            connection_id: emailConnectionID,
          };
          console.log(emailIDObj);

          const { data, error } = await props.db
            .from("users")
            .select()
            .eq("id", uid);
          console.log("error: ", error);
          console.log("data: ", data);
          console.log(data[0].email_data);

          // Check if emailIDObj's email already exists in data[0].email_data
          const emailExists = data[0].email_data.some(
            (item) => item.email === emailIDObj.email
          );

          let update_package = [...data[0].email_data];

          // Include emailIDObj in update_package only if its email doesn't exist already
          if (!emailExists) {
            update_package.push(emailIDObj);
          }
          console.log("update: ", update_package);

          await props.db
            .from("users")
            .update({
              email_data: update_package,
              emailLinked: true,
            })
            .eq("id", uid);
        }
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      storeData();
    }

    getDashboardData();
  }, []);

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          {modalStep == 0 && <ContactsDemo />}
          {modalStep == 1 && <DealsDemo />}
          {modalStep == 2 && (
            <>
              <ContactsDemo />
              <DealsDemo />
            </>
          )}

          <Button
            class={
              modalStep == 2
                ? "w-[100%] h-[46.77px] px-[20.77px] py-[10.38px] bg-red-500 rounded-[10.27px] shadow justify-center items-center gap-[7.79px] inline-flex hover:bg-red-400"
                : "w-[100%] h-[46.77px] px-[20.77px] py-[10.38px] bg-blue-500 rounded-[10.27px] shadow justify-center items-center gap-[7.79px] inline-flex hover:bg-blue-400"
            }
            onClick={async () => {
              if (modalStep == 2) {
                setIsLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 5000));

                setIsLoading(false);

                setCRMScore(90);
                setIssuesResolved(true);
                setIsOpen(false);
                localStorage.setItem("resolvedIssues", true);
              } else {
                setModalStep(modalStep + 1);
              }
            }}
          >
            <div class="text-white text-sm font-medium font-['Inter'] leading-tight">
              {modalStep == 0
                ? "Continue"
                : modalStep == 1
                ? "Review"
                : "Resolve"}
            </div>
          </Button>
        </DialogPanel>
      </Dialog>
      <div className="justify-center items-center w-[100vw] h-[100vh]">
        <Header selectedTab={0} db={props.db} />
        <Score
          crmConnected={crmConnected}
          setCRMConnected={setCRMConnected}
          setIsLoading={true}
          crmScore={crmScore}
          numIssues={numIssues}
          issuesResolved={issuesResolved}
        />

        <Accounts
          crmConnected={crmConnected}
          linkedInLinked={linkedInLinked}
          db={props.db}
        />
        {crmConnected && (
          <Issues
            crmConnected={crmConnected}
            setIsOpen={setIsOpen}
            setOpenCookieModal={setOpenCookieModal}
            issuesResolved={issuesResolved}
            linkedInLinked={linkedInLinked}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}

export default Dashboard;
