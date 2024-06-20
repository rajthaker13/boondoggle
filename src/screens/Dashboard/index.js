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
  const [emailLinked, setEmailLinked] = useState(false);
  const [storeDataExecuted, setStoreDataExecuted] = useState(false);
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

        if(!data || !data[0]) {
          return;
        }
        
        const contactIssuesTemp = data[0].issuesArray.filter(
          (item) => item.type === "Contact"
        );
        const companyIssuesTemp = data[0].issuesArray.filter(
          (item) => item.type === "Company"
        );
        setContactIssues(contactIssuesTemp);
        setCompanyIssues(companyIssuesTemp);
        // Calc final score
        const finalScore = Math.round(
          (data[0].crm_points / data[0].crm_max_points) * 100
        );
        setCRMScore(finalScore);
        setNumIssues(data[0].issuesArray.length);
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
          scanResult = await createPineconeIndexes(connection_id);
          const newScore = scanResult.score;
          const issuesArray = scanResult.issuesArray;
          console.log(issuesArray);

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
          setNumIssues(issuesArray.length);
          setCRMScore(newScore);
          var cleanUrl = window.location.href.split("?")[0];
          window.history.replaceState({}, document.title, cleanUrl);
          setCRMConnected(true);
        } catch (error) {
          console.log(error);
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
            url: `https://api.unified.to/unified/connection/${emailConnectionID}`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
          };

          const connectionResponse = await axios.request(connectionOptions);
          const expiryDate = new Date(connectionResponse.data.auth.expiry_date);
          const currentDate = new Date(connectionResponse.data.updated_at);

          let emailIDObj = {
            email: connectionResponse.data.auth.emails[0],
            connection_id: emailConnectionID,
            name: connectionResponse.data.auth.name,
            updated_at: currentDate,
            expiry_date: expiryDate,
          };

          try {
            const { data, error } = await props.db
            .from("users")
            .select()
            .eq("id", uid);

            // Check if emailIDObj's email already exists in data[0].email_data
            const emailExists = data[0].email_data.some(
              (item) => item.email === emailIDObj.email
            );

            let update_package = [...data[0].email_data];

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
            else {
              const updatedEmailData = data[0].email_data.map((item) =>
                item.email === emailIDObj.email ? { 
                  ...item, 
                  connection_id: emailIDObj.connection_id, 
                  updated_at: currentDate,
                  expiry_date: expiryDate,
                } : item
              );
              await props.db
                .from("users")
                .update({
                  email_data: updatedEmailData,
                  emailLinked: true,
                })
                .eq("id", uid);
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    }

    /**
     * Checks if gmail token is expired, if so, uses refresh token to get new 
     * access token and updates unified connection
     */
    async function checkGmailToken() {
      const uid = localStorage.getItem("uid");
      
      const { data, error } = await props.db
            .from("users")
            .select("email_data")
            .eq("id", uid);

      if(data && data[0]) {
        let emailData = data[0].email_data
        for(let i = 0; i < emailData.length; i++) {
          let email = emailData[i];
          if(true) {
            let connectionResponse = await retrieveUnifiedConnection(email.connection_id);
            
            const refresh_token = connectionResponse.data.auth.refresh_token;
            const token_url = connectionResponse.data.auth.token_url;
            const integration = connectionResponse.data.integration_type;
            const new_access_token = await generateNewAccessToken(refresh_token, token_url, integration);

            console.log("old token: ", connectionResponse.data.auth.access_token);
            console.log("new token: ", new_access_token);

            connectionResponse.data.auth.access_token = new_access_token;
            console.log("new new token: ", connectionResponse.data.auth.access_token);

            const updateResponse = await updateUnifiedConnection(email.connection_id, connectionResponse.data.auth, integration);
            console.log("update token: ", updateResponse);

            const expiryDate = new Date(updateResponse.data.auth.expiry_date);
            const currentDate = new Date(updateResponse.data.updated_at);

            try {
              const { data, error } = await props.db
                .from("users")
                .select()
                .eq("id", uid);

              const updatedEmailData = data[0].email_data.map((item) =>
                item.connection_id == connectionResponse.data.id ? { 
                  ...item, 
                  updated_at: currentDate,
                  expiry_date: expiryDate,
                } : item
              );
              
              await props.db
                .from("users")
                .update({
                  email_data: updatedEmailData,
                })
                .eq("id", uid);

            } catch(error) {
              console.log(error);
            }
          }
        }
      }
    }

    /**
    * Retrieves unified connection so that the auth field can be updated with new access token
    */
    async function retrieveUnifiedConnection(connection_id) {
      const connectionOptions = {
        method: "GET",
        url: `https://api.unified.to/unified/connection/${connection_id}`,
        headers: {
          authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
        },
      };

      return await axios.request(connectionOptions);
    }

    /**
     * Updates the unified connection with the new access token we just got
     */
    async function updateUnifiedConnection(connection_id, update_package, integration) {
      const connectionOptions = {
        method: "PUT",
        url: `https://api.unified.to/unified/connection/${connection_id}`,
        headers: {
          authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
        },
        data: {
          permissions: ["messaging_message_read"],
          integration_type: integration,
          categories: ["messaging"],
          auth: update_package
        }
      };

      return await axios.request(connectionOptions);
    }
    
    /**
     * Calls api to generate new access token from the refresh token and returns
     */
    async function generateNewAccessToken(refresh_token, token_url, integration) {
      
      const payload = new URLSearchParams({
        client_id: integration == "googlemail" ? process.env.REACT_APP_GMAIL_CLIENT_ID : process.env.REACT_APP_OUTLOOK_CLIENT_ID,
        client_secret: integration == "googlemail" ? process.env.REACT_APP_GMAIL_CLIENT_SECRET : process.env.REACT_APP_OUTLOOK_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      });

      const options = {
        method: 'POST',
        url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/${token_url}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: payload
      };
      
      try {
        const response = await axios(options);
        console.log("google response: ", response);
        return response.data.access_token; 
      } catch (error) {
        console.log(error);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id && !storeDataExecuted) {
      setStoreDataExecuted(true);
      storeData();
      // const tmpObj = { email: "josh@meetapollo.io" };
      // const res = fetchEnrichmentProfile(tmpObj);
      // console.log("RES", res);
    }

    getDashboardData();
    checkGmailToken();
  }, [storeDataExecuted]);

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          {modalStep == 0 && <ContactsDemo issues={contactIssues} />}
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
                : "flex-shrink-0 w-[100%] h-[46.77px] px-[20.77px] py-[10.38px] bg-blue-500 rounded-[10.27px] shadow justify-center items-center hover:bg-blue-400"
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
          emailLinked={emailLinked}
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
