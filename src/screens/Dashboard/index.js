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

        <Accounts crmConnected={crmConnected} linkedInLinked={linkedInLinked} db={props.db}/>
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
