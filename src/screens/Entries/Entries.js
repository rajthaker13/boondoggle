import React, { useEffect, useState } from "react";
import "./Entries.css";
import { useNavigate } from "react-router-dom";
import Unified from "unified-ts-client";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import Sidebar from "../../components/Sidebar/Sidebar";
import LoadingOverlay from "react-loading-overlay";

function Entries(props) {
  const navigation = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewTasks, setViewTasks] = useState(false);
  const [viewCompleted, setViewCompleted] = useState(false);

  const [seeCompletedEntries, setSeeCompletedEntries] = useState(true);
  const [seePendingEntries, setSeePendingEntries] = useState(false);
  const [seeRejectedEntries, setSeeRejectedEntries] = useState(false);

  const [selectedEntries, setSelectedEntries] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  let renderedData = [];

  let renderedTasks = [];

  async function sendToCRM() {
    const connection_id = localStorage.getItem("connection_id");

    Promise.all(
      selectedEntries.map(async (id) => {
        const matchedEntryIndex = tableData.findIndex(
          (entry) => entry.id == id
        );
        const update = tableData[matchedEntryIndex];
        console.log("UPDATE", update);
        const source = update.source;
        console.log("SOURCE", source);
        if (update.customer != "") {
          let regexCustomer;
          if (source == "Twitter") {
            regexCustomer = update.customer.replace(
              /\s(?=[\uD800-\uDFFF])/g,
              ""
            );
          } else if (source == "Email") {
            regexCustomer = update.email;
          }

          if (update.customer == "Blake Faulkner 🌉") {
            regexCustomer = "Blake Faulkner";
          }
          const options = {
            method: "GET",
            url: `https://api.unified.to/crm/${connection_id}/contact`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
            params: {
              limit: 1000,
              query: regexCustomer,
            },
          };
          let results;
          try {
            results = await axios.request(options);
          } catch (error) {
            if (error) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              results = await axios.request(options);
            }
          }
          const current_crm = results.data[0];

          const idOptions = {
            method: "GET",
            url: `https://api.unified.to/hris/${connection_id}/employee`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
          };

          let idResults;

          try {
            idResults = await axios.request(idOptions);
          } catch {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            idResults = await axios.request(idOptions);
          }
          const user_crm_id = idResults.data[0].id;

          if (current_crm != undefined) {
            const event = {
              id: current_crm.id,
              type: "NOTE",
              note: {
                description: update.title + "\n" + update.summary,
              },
              company_ids: current_crm.company_ids,
              contact_ids: [current_crm.id],
              user_id: user_crm_id,
            };
            const { data, error } = await props.db.functions.invoke(
              "update-crm-unified",
              {
                body: { connection_id: connection_id, event: event },
              }
            );
          } else {
            let contact;
            if (source == "Twitter") {
              contact = {
                name: regexCustomer,
              };
            } else if (source == "Email") {
              contact = {
                name: update.customer,
                emails: [
                  {
                    email: regexCustomer,
                    type: "WORK",
                  },
                ],
              };
            }
            const { data, error } = await props.db.functions.invoke(
              "new-contact-unified",
              {
                body: {
                  connection_id: connection_id,
                  contact: contact,
                  title: update.title,
                  description:
                    update.summary + "\n + Summarized by Boondoggle AI",
                  user_id: user_crm_id,
                },
              }
            );
          }
        }
      })
    );
    setTableData(tableData);
    setTasks(tasks);
    setSelectedEntries([]);
    setAllSelected(false);
    setIsLoading(false);
  }

  async function deployEntries() {
    selectedEntries.map((id) => {
      const matchedEntryIndex = tableData.findIndex((entry) => entry.id == id);
      const toDoEntryIndex = tasks.findIndex((entry) => entry.id == id);
      tableData[matchedEntryIndex].status = "Completed";
      tasks[toDoEntryIndex].emailStatus = "Completed";
    });

    const connection_id = localStorage.getItem("connection_id");

    await props.db
      .from("data")
      .update({
        crm_data: tableData,
        tasks: tasks,
      })
      .eq("connection_id", connection_id);

    const crmType = localStorage.getItem("crmType");

    if (crmType == "crm") {
      await sendToCRM();
    }
  }

  async function pushEntriesCRM() {
    const connection_id = localStorage.getItem("connection_id");
  }

  async function rejectEntries() {
    selectedEntries.map((id) => {
      const matchedEntryIndex = tableData.findIndex((entry) => entry.id == id);
      const toDoEntryIndex = tasks.findIndex((entry) => entry.id == id);
      tableData[matchedEntryIndex].status = "Rejected";
      tasks[toDoEntryIndex].emailStatus = "Rejected";
    });

    const connection_id = localStorage.getItem("connection_id");

    await props.db
      .from("data")
      .update({
        crm_data: tableData,
        tasks: tasks,
      })
      .eq("connection_id", connection_id);

    setTableData(tableData);
    setTasks(tasks);
    setSelectedEntries([]);
    setAllSelected(false);
    setIsLoading(false);
  }

  async function nextOnboardingStep() {
    const uid = localStorage.getItem("uid");
    await props.db
      .from("user_data")
      .update({
        onboardingStep: onboardingStep + 1,
      })
      .eq("id", uid);

    setOnboardingStep(onboardingStep + 1);
  }

  async function completeTask(index, isCompleted) {
    let reverseTasks = tasks.reverse();
    reverseTasks[index].status = isCompleted ? "Complete" : "Incomplete";
    reverseTasks = reverseTasks.reverse();

    const connection_id = localStorage.getItem("connection_id");

    await props.db
      .from("data")
      .update({
        tasks: reverseTasks,
      })
      .eq("connection_id", connection_id);

    setTasks(reverseTasks);

    console.log(reverseTasks);
  }

  useEffect(() => {
    async function getData() {
      const connection_id = localStorage.getItem("connection_id");
      console.log(connection_id);

      const { data, error } = await props.db
        .from("data")
        .select()
        .eq("connection_id", connection_id);
      setTableData(data[0].crm_data);
      setTasks(data[0].tasks);
    }

    async function checkOnBoarding() {
      console.log("HERE?");
      const uid = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("user_data")
        .select("")
        .eq("id", uid);
      setIsOnboarding(!data[0].hasOnboarded);
      setOnboardingStep(data[0].onboardingStep);
    }

    checkOnBoarding();

    getData();
  }, []);

  function timeAgo(timestamp) {
    const currentTime = new Date();
    const targetTime = new Date(timestamp);

    const timeDifference = currentTime - targetTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  }

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="container">
        <div className="content-container">
          <Sidebar
            selectedTab={2}
            db={props.db}
            onboardingStep={onboardingStep}
          />
          <div
            style={
              isOnboarding && onboardingStep == 10
                ? { flexDirection: "column", filter: "blur(5px)" }
                : { flexDirection: "column" }
            }
          >
            <div className="dashboard-header">
              <div className="header-text-container">
                <span className="header-text-1">
                  <span className="header-text-2">
                    {!viewTasks ? "Entries" : "Tasks & Reminders"}
                  </span>
                </span>
              </div>
            </div>
            <div className="entries-buttons-container">
              {!viewTasks && (
                <>
                  <div className="entries-task-left-button-container">
                    <p className="entries-filter-label">Filter entries by:</p>
                    <button
                      onClick={() => {
                        if (!seeCompletedEntries) {
                          setAllSelected(false);
                          setSelectedEntries([]);
                          setSeePendingEntries(false);
                          setSeeRejectedEntries(false);
                          setSeeCompletedEntries(true);
                        }
                      }}
                      className={
                        seeCompletedEntries
                          ? "entries-task-button-selected"
                          : "entries-tasks-button"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path d="M9 2.09375C7.63408 2.09375 6.29882 2.49879 5.1631 3.25766C4.02737 4.01653 3.14218 5.09514 2.61946 6.35709C2.09674 7.61904 1.95998 9.00766 2.22645 10.3473C2.49293 11.687 3.15069 12.9176 4.11655 13.8835C5.0824 14.8493 6.31298 15.5071 7.65266 15.7735C8.99234 16.04 10.381 15.9033 11.6429 15.3805C12.9049 14.8578 13.9835 13.9726 14.7423 12.8369C15.5012 11.7012 15.9063 10.3659 15.9063 9C15.9043 7.16894 15.1761 5.41343 13.8813 4.11868C12.5866 2.82393 10.8311 2.09568 9 2.09375ZM9 14.8438C7.84422 14.8438 6.71439 14.501 5.75339 13.8589C4.79239 13.2168 4.04338 12.3041 3.60108 11.2363C3.15878 10.1685 3.04306 8.99352 3.26854 7.85994C3.49402 6.72636 4.05058 5.68511 4.86785 4.86784C5.68511 4.05058 6.72637 3.49402 7.85994 3.26854C8.99352 3.04305 10.1685 3.15878 11.2363 3.60108C12.3041 4.04338 13.2168 4.79239 13.8589 5.75339C14.501 6.71439 14.8438 7.84422 14.8438 9C14.842 10.5493 14.2258 12.0347 13.1302 13.1302C12.0347 14.2257 10.5493 14.842 9 14.8438ZM5.8125 7.67188C5.8125 7.51427 5.85924 7.3602 5.9468 7.22916C6.03436 7.09811 6.15882 6.99597 6.30443 6.93566C6.45004 6.87534 6.61026 6.85956 6.76484 6.89031C6.91942 6.92106 7.06141 6.99695 7.17285 7.1084C7.2843 7.21984 7.36019 7.36183 7.39094 7.51641C7.42169 7.67099 7.40591 7.83122 7.34559 7.97683C7.28528 8.12244 7.18314 8.24689 7.0521 8.33445C6.92105 8.42201 6.76698 8.46875 6.60938 8.46875C6.39803 8.46875 6.19535 8.38479 6.0459 8.23535C5.89646 8.08591 5.8125 7.88322 5.8125 7.67188ZM12.1875 7.67188C12.1875 7.82948 12.1408 7.98355 12.0532 8.11459C11.9656 8.24564 11.8412 8.34778 11.6956 8.40809C11.55 8.46841 11.3897 8.48419 11.2352 8.45344C11.0806 8.42269 10.9386 8.3468 10.8272 8.23535C10.7157 8.12391 10.6398 7.98192 10.6091 7.82734C10.5783 7.67276 10.5941 7.51253 10.6544 7.36692C10.7147 7.22131 10.8169 7.09686 10.9479 7.0093C11.079 6.92174 11.233 6.875 11.3906 6.875C11.602 6.875 11.8047 6.95896 11.9541 7.1084C12.1035 7.25784 12.1875 7.46053 12.1875 7.67188ZM12.1164 10.8594C11.4331 12.0407 10.2969 12.7188 9 12.7188C7.70309 12.7188 6.56754 12.0414 5.88422 10.8594C5.84578 10.7989 5.81997 10.7313 5.80835 10.6606C5.79672 10.5899 5.79951 10.5176 5.81656 10.448C5.8336 10.3784 5.86455 10.313 5.90754 10.2556C5.95052 10.1983 6.00466 10.1503 6.06669 10.1144C6.12872 10.0786 6.19737 10.0556 6.26849 10.047C6.33962 10.0384 6.41176 10.0442 6.48057 10.0642C6.54938 10.0841 6.61344 10.1178 6.6689 10.1632C6.72436 10.2085 6.77007 10.2646 6.80328 10.3281C7.29934 11.1854 8.07895 11.6562 9 11.6562C9.92106 11.6562 10.7007 11.1848 11.1961 10.3281C11.2665 10.2061 11.3826 10.117 11.5187 10.0805C11.6548 10.044 11.7998 10.0631 11.9219 10.1336C12.0439 10.204 12.133 10.3201 12.1695 10.4562C12.206 10.5923 12.1869 10.7373 12.1164 10.8594Z" />
                      </svg>
                      <p className="entries-tasks-button-text">Completed</p>
                    </button>
                    <button
                      onClick={() => {
                        if (!seePendingEntries) {
                          setAllSelected(false);
                          setSelectedEntries([]);
                          setSeeCompletedEntries(false);
                          setSeeRejectedEntries(false);
                          setSeePendingEntries(true);
                        }
                      }}
                      className={
                        seePendingEntries
                          ? "entries-task-button-selected"
                          : "entries-tasks-button"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path d="M9 2.09375C7.63408 2.09375 6.29882 2.49879 5.1631 3.25766C4.02737 4.01653 3.14218 5.09514 2.61946 6.35709C2.09674 7.61904 1.95998 9.00766 2.22645 10.3473C2.49293 11.687 3.15069 12.9176 4.11655 13.8835C5.0824 14.8493 6.31298 15.5071 7.65266 15.7735C8.99234 16.04 10.381 15.9033 11.6429 15.3805C12.9049 14.8578 13.9835 13.9726 14.7423 12.8369C15.5012 11.7012 15.9063 10.3659 15.9063 9C15.9043 7.16894 15.1761 5.41343 13.8813 4.11868C12.5866 2.82393 10.8311 2.09568 9 2.09375ZM9 14.8438C7.84422 14.8438 6.71439 14.501 5.75339 13.8589C4.79239 13.2168 4.04338 12.3041 3.60108 11.2363C3.15878 10.1685 3.04306 8.99352 3.26854 7.85994C3.49402 6.72636 4.05058 5.68511 4.86785 4.86784C5.68511 4.05058 6.72637 3.49402 7.85994 3.26854C8.99352 3.04305 10.1685 3.15878 11.2363 3.60108C12.3041 4.04338 13.2168 4.79239 13.8589 5.75339C14.501 6.71439 14.8438 7.84422 14.8438 9C14.842 10.5493 14.2258 12.0347 13.1302 13.1302C12.0347 14.2257 10.5493 14.842 9 14.8438ZM12.1875 11.125C12.1875 11.2659 12.1315 11.401 12.0319 11.5007C11.9323 11.6003 11.7971 11.6562 11.6563 11.6562H6.34375C6.20286 11.6562 6.06773 11.6003 5.9681 11.5007C5.86847 11.401 5.8125 11.2659 5.8125 11.125C5.8125 10.9841 5.86847 10.849 5.9681 10.7493C6.06773 10.6497 6.20286 10.5938 6.34375 10.5938H11.6563C11.7971 10.5938 11.9323 10.6497 12.0319 10.7493C12.1315 10.849 12.1875 10.9841 12.1875 11.125ZM5.8125 7.67188C5.8125 7.51427 5.85924 7.3602 5.9468 7.22916C6.03436 7.09811 6.15882 6.99597 6.30443 6.93566C6.45004 6.87534 6.61026 6.85956 6.76484 6.89031C6.91942 6.92106 7.06141 6.99695 7.17285 7.1084C7.2843 7.21984 7.36019 7.36183 7.39094 7.51641C7.42169 7.67099 7.40591 7.83122 7.34559 7.97683C7.28528 8.12244 7.18314 8.24689 7.0521 8.33445C6.92105 8.42201 6.76698 8.46875 6.60938 8.46875C6.39803 8.46875 6.19535 8.38479 6.0459 8.23535C5.89646 8.08591 5.8125 7.88322 5.8125 7.67188ZM12.1875 7.67188C12.1875 7.82948 12.1408 7.98355 12.0532 8.11459C11.9656 8.24564 11.8412 8.34778 11.6956 8.40809C11.55 8.46841 11.3897 8.48419 11.2352 8.45344C11.0806 8.42269 10.9386 8.3468 10.8272 8.23535C10.7157 8.12391 10.6398 7.98192 10.6091 7.82734C10.5783 7.67276 10.5941 7.51253 10.6544 7.36692C10.7147 7.22131 10.8169 7.09686 10.9479 7.0093C11.079 6.92174 11.233 6.875 11.3906 6.875C11.602 6.875 11.8047 6.95896 11.9541 7.1084C12.1035 7.25784 12.1875 7.46053 12.1875 7.67188Z" />
                      </svg>
                      <p className="entries-tasks-button-text">Pending</p>
                    </button>
                    <button
                      onClick={() => {
                        if (!seeRejectedEntries) {
                          setAllSelected(false);
                          setSelectedEntries([]);
                          setSeeCompletedEntries(false);
                          setSeePendingEntries(false);
                          setSeeRejectedEntries(true);
                        }
                      }}
                      className={
                        seeRejectedEntries
                          ? "entries-task-button-selected"
                          : "entries-tasks-button"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="18"
                        viewBox="0 0 17 18"
                        fill="none"
                      >
                        <path
                          className="entry-icon"
                          d="M8.5 2.09375C7.13408 2.09375 5.79882 2.49879 4.6631 3.25766C3.52737 4.01653 2.64218 5.09514 2.11946 6.35709C1.59674 7.61904 1.45998 9.00766 1.72645 10.3473C1.99293 11.687 2.65069 12.9176 3.61655 13.8835C4.5824 14.8493 5.81298 15.5071 7.15266 15.7735C8.49234 16.04 9.88096 15.9033 11.1429 15.3805C12.4049 14.8578 13.4835 13.9726 14.2423 12.8369C15.0012 11.7012 15.4063 10.3659 15.4063 9C15.4043 7.16894 14.6761 5.41343 13.3813 4.11868C12.0866 2.82393 10.3311 2.09568 8.5 2.09375ZM8.5 14.8438C7.34422 14.8438 6.21439 14.501 5.25339 13.8589C4.29239 13.2168 3.54338 12.3041 3.10108 11.2363C2.65878 10.1685 2.54306 8.99352 2.76854 7.85994C2.99402 6.72636 3.55058 5.68511 4.36785 4.86784C5.18511 4.05058 6.22637 3.49402 7.35994 3.26854C8.49352 3.04305 9.6685 3.15878 10.7363 3.60108C11.8041 4.04338 12.7168 4.79239 13.3589 5.75339C14.001 6.71439 14.3438 7.84422 14.3438 9C14.342 10.5493 13.7258 12.0347 12.6302 13.1302C11.5347 14.2257 10.0493 14.842 8.5 14.8438ZM5.3125 7.67188C5.3125 7.51427 5.35924 7.3602 5.4468 7.22916C5.53436 7.09811 5.65882 6.99597 5.80443 6.93566C5.95004 6.87534 6.11026 6.85956 6.26484 6.89031C6.41942 6.92106 6.56141 6.99695 6.67285 7.1084C6.7843 7.21984 6.86019 7.36183 6.89094 7.51641C6.92169 7.67099 6.90591 7.83122 6.84559 7.97683C6.78528 8.12244 6.68314 8.24689 6.5521 8.33445C6.42105 8.42201 6.26698 8.46875 6.10938 8.46875C5.89803 8.46875 5.69535 8.38479 5.5459 8.23535C5.39646 8.08591 5.3125 7.88322 5.3125 7.67188ZM11.6875 7.67188C11.6875 7.82948 11.6408 7.98355 11.5532 8.11459C11.4656 8.24564 11.3412 8.34778 11.1956 8.40809C11.05 8.46841 10.8897 8.48419 10.7352 8.45344C10.5806 8.42269 10.4386 8.3468 10.3272 8.23535C10.2157 8.12391 10.1398 7.98192 10.1091 7.82734C10.0783 7.67276 10.0941 7.51253 10.1544 7.36692C10.2147 7.22131 10.3169 7.09686 10.4479 7.0093C10.579 6.92174 10.733 6.875 10.8906 6.875C11.102 6.875 11.3047 6.95896 11.4541 7.1084C11.6035 7.25784 11.6875 7.46053 11.6875 7.67188ZM11.6158 11.9219C11.6542 11.9823 11.68 12.05 11.6917 12.1207C11.7033 12.1914 11.7005 12.2637 11.6834 12.3333C11.6664 12.4029 11.6355 12.4683 11.5925 12.5256C11.5495 12.5829 11.4953 12.631 11.4333 12.6668C11.3713 12.7027 11.3026 12.7256 11.2315 12.7343C11.1604 12.7429 11.0882 12.7371 11.0194 12.7171C10.9506 12.6971 10.8866 12.6635 10.8311 12.6181C10.7756 12.5727 10.7299 12.5166 10.6967 12.4531C10.2007 11.5958 9.42106 11.125 8.5 11.125C7.57895 11.125 6.79934 11.5965 6.30328 12.4531C6.27007 12.5166 6.22436 12.5727 6.1689 12.6181C6.11344 12.6635 6.04938 12.6971 5.98057 12.7171C5.91176 12.7371 5.83962 12.7429 5.76849 12.7343C5.69737 12.7256 5.62872 12.7027 5.56669 12.6668C5.50466 12.631 5.45052 12.5829 5.40754 12.5256C5.36455 12.4683 5.3336 12.4029 5.31656 12.3333C5.29951 12.2637 5.29672 12.1914 5.30835 12.1207C5.31997 12.05 5.34578 11.9823 5.38422 11.9219C6.06754 10.7405 7.20309 10.0625 8.5 10.0625C9.79692 10.0625 10.9325 10.7398 11.6158 11.9219Z"
                        />
                      </svg>
                      <p className="entries-tasks-button-text">Rejected</p>
                    </button>
                    {(seePendingEntries || seeRejectedEntries) &&
                      selectedEntries.length > 0 && (
                        <>
                          <p className="entries-filter-label">
                            Adjust pending entries:
                          </p>
                          <button
                            className="entries-table-deploy-button"
                            onClick={async () => {
                              setIsLoading(true);
                              await deployEntries();
                            }}
                          >
                            <p className="entries-tasks-button-text">Deploy</p>
                          </button>
                          {seePendingEntries && (
                            <button
                              className="entries-table-reject-button"
                              onClick={async () => {
                                setIsLoading(true);
                                await rejectEntries();
                              }}
                            >
                              <p className="entries-tasks-button-text">
                                Reject
                              </p>
                            </button>
                          )}
                        </>
                      )}
                  </div>
                  <button
                    className="entries-tasks-button"
                    style={
                      isOnboarding && onboardingStep == 9
                        ? { border: "5px solid red" }
                        : { flex: "0 0 1" }
                    }
                    onClick={() => {
                      if (!isOnboarding || onboardingStep == 9) {
                        setViewTasks(true);
                      }
                    }}
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path d="M9.00041 6.34365C8.47505 6.34365 7.96149 6.49944 7.52468 6.79131C7.08786 7.08318 6.7474 7.49803 6.54635 7.9834C6.34531 8.46876 6.29271 9.00285 6.3952 9.51811C6.49769 10.0334 6.75067 10.5067 7.12216 10.8782C7.49364 11.2496 7.96694 11.5026 8.4822 11.6051C8.99746 11.7076 9.53155 11.655 10.0169 11.454C10.5023 11.2529 10.9171 10.9125 11.209 10.4756C11.5009 10.0388 11.6567 9.52526 11.6567 8.9999C11.6567 8.29542 11.3768 7.61979 10.8787 7.12165C10.3805 6.62351 9.70489 6.34365 9.00041 6.34365ZM9.00041 10.5937C8.6852 10.5937 8.37706 10.5002 8.11497 10.3251C7.85288 10.1499 7.6486 9.90102 7.52798 9.6098C7.40735 9.31858 7.37579 8.99813 7.43728 8.68898C7.49878 8.37982 7.65057 8.09584 7.87346 7.87295C8.09635 7.65006 8.38033 7.49827 8.68948 7.43677C8.99864 7.37528 9.31909 7.40684 9.61031 7.52747C9.90153 7.64809 10.1504 7.85237 10.3256 8.11446C10.5007 8.37655 10.5942 8.68469 10.5942 8.9999C10.5942 9.42259 10.4262 9.82797 10.1274 10.1269C9.82847 10.4257 9.4231 10.5937 9.00041 10.5937ZM13.8952 11.0678C13.667 11.6074 13.351 12.1055 12.9602 12.542C12.8656 12.6444 12.7345 12.7055 12.5952 12.7121C12.4559 12.7187 12.3196 12.6703 12.2157 12.5773C12.1119 12.4843 12.0487 12.3542 12.0399 12.215C12.0311 12.0759 12.0773 11.9388 12.1687 11.8335C12.8662 11.0546 13.2519 10.0458 13.2519 9.00023C13.2519 7.95467 12.8662 6.94586 12.1687 6.16701C12.1208 6.11525 12.0838 6.0545 12.0596 5.98828C12.0355 5.92206 12.0248 5.8517 12.0281 5.78131C12.0315 5.71091 12.0488 5.64188 12.0791 5.57824C12.1093 5.5146 12.152 5.45761 12.2045 5.41061C12.257 5.3636 12.3183 5.32752 12.3849 5.30445C12.4515 5.28138 12.522 5.2718 12.5924 5.27625C12.6627 5.2807 12.7314 5.29911 12.7946 5.33039C12.8578 5.36167 12.9141 5.4052 12.9602 5.45846C13.631 6.20907 14.075 7.13467 14.2405 8.12764C14.406 9.12062 14.2863 10.1402 13.8952 11.0678ZM5.08244 7.34572C4.76899 8.08772 4.67285 8.90353 4.80524 9.69807C4.93762 10.4926 5.29308 11.2332 5.83017 11.8335C5.92151 11.9388 5.96776 12.0759 5.95895 12.215C5.95014 12.3542 5.88697 12.4843 5.78308 12.5773C5.67919 12.6703 5.5429 12.7187 5.40363 12.7121C5.26435 12.7055 5.13325 12.6444 5.03861 12.542C4.16642 11.5685 3.68413 10.3073 3.68413 9.00023C3.68413 7.69314 4.16642 6.432 5.03861 5.45846C5.13257 5.35322 5.26449 5.28963 5.40534 5.28166C5.54619 5.27369 5.68444 5.322 5.78967 5.41596C5.8949 5.50992 5.9585 5.64183 5.96647 5.78268C5.97444 5.92353 5.92613 6.06178 5.83217 6.16701C5.51873 6.5157 5.26537 6.91402 5.08244 7.34572ZM16.9692 8.9999C16.9724 11.0862 16.1544 13.09 14.6921 14.578C14.6437 14.6298 14.5855 14.6713 14.5208 14.7002C14.4562 14.7291 14.3864 14.7447 14.3156 14.7463C14.2448 14.7478 14.1744 14.7351 14.1085 14.7091C14.0427 14.683 13.9827 14.644 13.9321 14.5944C13.8816 14.5448 13.8414 14.4856 13.8141 14.4203C13.7867 14.355 13.7727 14.2848 13.7729 14.214C13.773 14.1432 13.7873 14.0731 13.8149 14.0079C13.8426 13.9427 13.883 13.8837 13.9337 13.8343C15.1999 12.5442 15.9093 10.8088 15.9093 9.00123C15.9093 7.19363 15.1999 5.45821 13.9337 4.16818C13.8347 4.06762 13.7798 3.93185 13.7809 3.79075C13.782 3.64965 13.8391 3.51478 13.9397 3.4158C14.0403 3.31682 14.176 3.26184 14.3171 3.26296C14.4582 3.26408 14.5931 3.32121 14.6921 3.42178C16.1544 4.90983 16.9724 6.91359 16.9692 8.9999ZM4.06709 13.8329C4.11601 13.8827 4.15465 13.9417 4.18079 14.0064C4.20693 14.0711 4.22007 14.1404 4.21946 14.2102C4.21884 14.28 4.20448 14.349 4.1772 14.4132C4.14991 14.4775 4.11024 14.5357 4.06045 14.5847C4.01065 14.6336 3.95171 14.6722 3.88698 14.6984C3.82226 14.7245 3.75302 14.7376 3.68321 14.737C3.61341 14.7364 3.54441 14.7221 3.48016 14.6948C3.4159 14.6675 3.35765 14.6278 3.30873 14.578C1.84659 13.0895 1.02734 11.0864 1.02734 8.9999C1.02734 6.91339 1.84659 4.91029 3.30873 3.42178C3.35711 3.37005 3.41534 3.32852 3.48001 3.29963C3.54467 3.27074 3.61445 3.25507 3.68526 3.25354C3.75607 3.25201 3.82647 3.26466 3.89232 3.29074C3.95816 3.31681 4.01813 3.35579 4.0687 3.40538C4.11926 3.45497 4.1594 3.51417 4.18675 3.5795C4.21411 3.64483 4.22812 3.71497 4.22797 3.78579C4.22782 3.85662 4.21351 3.92669 4.18588 3.99191C4.15825 4.05712 4.11786 4.11615 4.06709 4.16553C2.8009 5.45556 2.09153 7.19097 2.09153 8.99857C2.09153 10.8062 2.8009 12.5416 4.06709 13.8316V13.8329Z" />
                    </svg>
                    <p className="entries-tasks-button-text">View Tasks</p>
                  </button>
                </>
              )}

              {viewTasks && (
                <>
                  <button
                    className="entries-tasks-button"
                    onClick={() => {
                      if (!isOnboarding) {
                        setViewTasks(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.61292 3.87347L6.91289 5.76494C6.71611 6.29665 6.29685 6.71585 5.76512 6.91257L3.87357 7.61238L5.76504 8.31242C6.29675 8.5092 6.71595 8.92845 6.91267 9.46018L7.61248 11.3517L8.31252 9.46027C8.5093 8.92856 8.92855 8.50936 9.46028 8.31263L11.3518 7.61282L9.46037 6.91279C8.92866 6.71601 8.50946 6.29675 8.31273 5.76502L7.61292 3.87347ZM8.39378 2.78494C8.12561 2.06011 7.10045 2.06005 6.8322 2.78485L5.87186 5.37965C5.78752 5.60753 5.60784 5.78719 5.37996 5.8715L2.78504 6.83153C2.06021 7.09969 2.06015 8.12486 2.78495 8.39311L5.37975 9.35345C5.60763 9.43778 5.78729 9.61746 5.8716 9.84535L6.83163 12.4403C7.09979 13.1651 8.12496 13.1652 8.39321 12.4404L9.35355 9.84555C9.43788 9.61768 9.61756 9.43802 9.84545 9.35371L12.4404 8.39368C13.1652 8.12551 13.1653 7.10034 12.4405 6.8321L9.84565 5.87176C9.61778 5.78742 9.43812 5.60774 9.35381 5.37986L8.39378 2.78494Z"
                        fill="#1C1C1C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.1626 11.3995L12.9076 12.0884C12.767 12.4682 12.4676 12.7677 12.0878 12.9082L11.3988 13.1631L12.0877 13.418C12.4675 13.5586 12.767 13.8581 12.9075 14.2379L13.1624 14.9269L13.4174 14.2379C13.5579 13.8581 13.8574 13.5587 14.2372 13.4182L14.9262 13.1633L14.2372 12.9083C13.8574 12.7677 13.558 12.4683 13.4175 12.0885L13.1626 11.3995ZM13.6832 10.4072C13.5044 9.92402 12.8209 9.92398 12.6421 10.4072L12.1268 11.7995C12.0706 11.9514 11.9508 12.0712 11.7989 12.1274L10.4066 12.6425C9.92333 12.8213 9.92329 13.5047 10.4065 13.6835L11.7988 14.1988C11.9507 14.255 12.0705 14.3748 12.1267 14.5267L12.6418 15.9191C12.8206 16.4023 13.504 16.4024 13.6828 15.9192L14.1981 14.5269C14.2544 14.375 14.3741 14.2552 14.5261 14.199L15.9184 13.6839C16.4016 13.5051 16.4017 12.8216 15.9185 12.6428L14.5262 12.1275C14.3743 12.0713 14.2545 11.9515 14.1983 11.7996L13.6832 10.4072Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <p className="entries-tasks-button-text">View Entries</p>
                  </button>
                  <button
                    className="entries-tasks-button"
                    onClick={() => {
                      if (!isOnboarding) {
                        setViewCompleted(!viewCompleted);
                      }
                    }}
                  >
                    <p className="entries-tasks-button-text">
                      {viewCompleted ? "View To-Dos" : "View Completed"}
                    </p>
                  </button>
                </>
              )}
            </div>
            <div className="dashboard">
              <div className="entries-container">
                <div className="connected-apps-header-container">
                  {!viewTasks && (
                    <>
                      <div className="entries-table-row-head">
                        <div className="entries-table-column">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => {
                              let newSelectedEntries;
                              if (!allSelected) {
                                if (seePendingEntries || seeRejectedEntries) {
                                  const newSelectedEntriesObjects =
                                    tableData.filter((entry) =>
                                      entry.status == seePendingEntries
                                        ? "Pending"
                                        : "Rejected"
                                    );
                                  newSelectedEntries =
                                    newSelectedEntriesObjects.map(
                                      (entry) => entry.id
                                    );
                                  setSelectedEntries(newSelectedEntries);
                                  setAllSelected(true);
                                }
                              } else {
                                setSelectedEntries([]);
                                setAllSelected(false);
                              }
                            }}
                          ></input>
                        </div>
                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Entry ID
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Customer
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Entry Title
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Summary
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Date Deployed
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Source
                          </p>
                        </div>

                        <div className="entries-table-column">
                          <p className="integrations-table-column-header">
                            Status
                          </p>
                        </div>
                      </div>
                      {tableData
                        .slice()
                        .reverse()
                        .map((lead, index) => {
                          const timestamp = lead.date;
                          const timeAgoString = timeAgo(timestamp);
                          const isExpanded = expandedRow === lead.id;
                          const itemIndex = renderedData.findIndex(
                            (item) => item === lead.customer
                          );
                          let checked;
                          const selectedIndex = selectedEntries.findIndex(
                            (item) => item === lead.id
                          );
                          if (selectedIndex == -1) {
                            checked = false;
                          } else {
                            checked = true;
                          }
                          if (
                            itemIndex == -1 &&
                            ((lead.status == "Completed" &&
                              seeCompletedEntries) ||
                              (lead.status == "Pending" && seePendingEntries) ||
                              (lead.status == "Rejected" && seeRejectedEntries))
                          ) {
                            renderedData.push(lead.customer);
                            return (
                              <div
                                className={
                                  isExpanded
                                    ? "entries-table-row-chosen"
                                    : "entries-table-row"
                                }
                                onClick={() => setExpandedRow(lead.id)}
                                key={lead.id}
                              >
                                <div
                                  className="entries-table-column"
                                  style={{
                                    justifyContent: "center",
                                    alignContent: "center",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      if (!checked) {
                                        setSelectedEntries([
                                          ...selectedEntries,
                                          lead.id,
                                        ]);
                                      } else {
                                        const newSelectedEntries =
                                          selectedEntries.filter(
                                            (entry) => entry !== lead.id
                                          );
                                        setSelectedEntries(newSelectedEntries);
                                      }
                                    }}
                                  />
                                </div>
                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {lead.id}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {lead.customer}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {lead.title}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {isExpanded
                                      ? lead.summary
                                      : lead.summary.slice(0, 50) + "..."}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {timeAgoString}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <p className="integrations-table-column-info">
                                    {lead.source}
                                  </p>
                                </div>

                                <div className="entries-table-column">
                                  <div className=".entries-table-status-container">
                                    <p
                                      className="integrations-table-column-info"
                                      style={{ color: "#34b233" }}
                                    >
                                      {lead.status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                    </>
                  )}
                  {viewTasks && (
                    <>
                      <div className="entries-table-row-head">
                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Task
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Contact
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Point of Contact
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Last Contact
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Generated Response
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Type
                          </p>
                        </div>

                        <div className="to-do-table-column">
                          <p className="integrations-table-column-header">
                            Completed
                          </p>
                        </div>
                      </div>
                      {tasks
                        .slice()
                        .reverse()
                        .map((lead, index) => {
                          const timestamp = lead.date;
                          const timeAgoString = timeAgo(timestamp);
                          const isExpanded = expandedRow === lead.id;
                          const itemIndex = renderedTasks.findIndex(
                            (item) => item === lead.customer
                          );
                          const status = viewCompleted
                            ? "Complete"
                            : "Incomplete";
                          if (itemIndex == -1) {
                            renderedTasks.push(lead.customer);
                            if (
                              lead.status == status &&
                              lead.emailStatus == "Completed"
                            ) {
                              return (
                                <div
                                  className={
                                    isExpanded
                                      ? "entries-table-row-chosen"
                                      : "entries-table-row"
                                  }
                                  onClick={() => setExpandedRow(lead.id)}
                                  key={lead.id}
                                >
                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {lead.id}
                                    </p>
                                  </div>

                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {lead.customer}
                                    </p>
                                  </div>

                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {lead.title}
                                    </p>
                                  </div>

                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {timeAgoString}
                                    </p>
                                  </div>

                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {isExpanded
                                        ? lead.response
                                        : lead.response.slice(0, 50) + "..."}
                                    </p>
                                  </div>

                                  <div className="to-do-table-column">
                                    <p className="integrations-table-column-info">
                                      {lead.type}
                                    </p>
                                  </div>

                                  <div
                                    className="to-do-table-column"
                                    style={{
                                      justifyContent: "center",
                                      alignContent: "center",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      onChange={(e) => {
                                        if (!viewCompleted) {
                                          completeTask(index, true);
                                        } else {
                                          completeTask(index, false);
                                        }
                                      }}
                                      checked={viewCompleted}
                                    ></input>
                                  </div>
                                </div>
                              );
                            }
                          }
                        })}
                    </>
                  )}
                </div>
              </div>
              {isOnboarding && onboardingStep == 8 && (
                <div className="onboarding-tooltip" style={{ width: "15vw" }}>
                  <p
                    className="link-button-text"
                    style={{ lineHeight: "100%", paddingInline: "1vw" }}
                  >
                    On the Entries tab, Boondoggle shows you which entries have
                    been deployed to your CRM and summaries of those
                    conversations.
                  </p>
                  <button
                    className="onboarding-tooltip-button"
                    style={{ marginBottom: "1vh" }}
                    onClick={async () => {
                      await nextOnboardingStep();
                    }}
                  >
                    {" "}
                    <p
                      className="link-button-text"
                      style={{
                        color: "black",
                        fontSize: "12px",
                      }}
                    >
                      Continue
                    </p>
                  </button>
                </div>
              )}
              {isOnboarding && onboardingStep == 9 && viewTasks && (
                <div className="onboarding-tooltip" style={{ width: "15vw" }}>
                  <p
                    className="link-button-text"
                    style={{ lineHeight: "100%", paddingInline: "1vw" }}
                  >
                    Boondoggle also creates to-dos based on your conversations
                    for you to save time on your work everyday!
                  </p>
                  <button
                    className="onboarding-tooltip-button"
                    style={{ marginBottom: "1vh" }}
                    onClick={async () => {
                      await nextOnboardingStep();
                    }}
                  >
                    {" "}
                    <p
                      className="link-button-text"
                      style={{
                        color: "black",
                        fontSize: "12px",
                      }}
                    >
                      Got It!
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Entries;
