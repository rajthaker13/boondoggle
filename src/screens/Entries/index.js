import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { RiLinkedinFill, RiMailLine } from "@remixicon/react";

function NewEntries(props) {
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
        const source = update.source;
        if (update.customer != "") {
          let regexCustomer;
          if (source == "Email") {
            regexCustomer = update.email;
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

  useEffect(() => {
    async function getData() {
      const uid = localStorage.getItem("uid");
      const connection_id = localStorage.getItem("connection_id");
      // const connection_id = "662fcf7451a04d41e55dd0c3";
      const isAdmin = localStorage.getItem("isAdmin");

      const { data, error } = await props.db
        .from("data")
        .select()
        .eq("connection_id", connection_id);
      setTableData(data[0].crm_data.reverse());
      setTasks(data[0].tasks);

      //Will uncomment this out when we bring in team manager
      // if (isAdmin == "true" && connection_id != null) {
      //   const { data, error } = await props.db
      //     .from("data")
      //     .select()
      //     .eq("connection_id", connection_id);
      //   setTableData(data[0].crm_data.reverse());
      //   setTasks(data[0].tasks);
      // } else if (isAdmin == "false" && connection_id != null) {
      //   const { data, error } = await props.db
      //     .from("users")
      //     .select()
      //     .eq("id", uid);
      //   setTableData(data[0].crm_data.reverse());
      //   setTasks(data[0].tasks);
      // }
    }

    async function checkOnBoarding() {
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
    <div>
      <Header selectedTab={2} db={props.db} />
      <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-start gap-[18px] flex-col">
        <div class="w-[95vw] h-[85vh] p-6 bg-white rounded-[5.13px] shadow border border-gray-200 flex-col justify-start items-center gap-6 inline-flex">
          <div class="w-[90vw] h-6 justify-start items-center gap-2.5 inline-flex">
            <div class="grow shrink basis-0 text-gray-700 text-base font-medium font-['Inter'] leading-normal">
              Activity Log
            </div>
            {/* <div class="h-[21px] justify-end items-center gap-2.5 flex">
              <div class="w-[77.50px] px-2.5 py-0.5 bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
                <div class="text-blue-700 text-xs font-normal font-['Inter']">
                  Review
                </div>
                <div class="p-[0.75px] bg-blue-500 rounded-sm justify-start items-start gap-[3px] flex">
                  <div class="w-[9px] h-[9px] relative"></div>
                </div>
              </div>
              <div class="w-[91.50px] px-2.5 py-0.5 bg-white bg-opacity-90 rounded border border-white border-opacity-80 justify-start items-center gap-1.5 flex">
                <div class="flex-col justify-start items-center gap-2.5 inline-flex">
                  <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                    Approved
                  </div>
                </div>
                <div class="p-[0.75px] bg-white rounded-sm border border-gray-400 justify-start items-start gap-[3px] flex">
                  <div></div>
                </div>
              </div>
              <div class="w-[86.50px] px-2.5 py-0.5 bg-rose-100 rounded border border-white border-opacity-80 justify-start items-center gap-1.5 flex">
                <div class="flex-col justify-start items-center gap-2.5 inline-flex">
                  <div class="text-rose-700 text-xs font-normal font-['Inter']">
                    Rejected
                  </div>
                </div>
                <div class="p-[0.75px] bg-white rounded-sm border border-gray-400 justify-start items-start gap-[3px] flex">
                  <div></div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="overflow-x-auto">
            <Table className="w-[90vw]">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Customer</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Summary</TableHeaderCell>
                  <TableHeaderCell>Source</TableHeaderCell>
                  <TableHeaderCell>LinkedIn</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {tableData.map((lead, index) => {
                    const timestamp = lead.date;
                    const timeAgoString = timeAgo(timestamp);
                    return (
                      <TableRow key={lead.id}>
                        <TableCell>{timeAgoString}</TableCell>
                        <TableCell className="whitespace-normal w-[20vw]">{`${lead.customer}: ${lead.position} @ ${lead.company}`}</TableCell>
                        <TableCell className="whitespace-normal">
                          {lead.title}
                        </TableCell>
                        <TableCell className="whitespace-normal w-[30vw]">
                          {lead.summary}
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell
                          onClick={() => {
                            window.open(lead.url, "_blank");
                          }}
                        >
                          <RiLinkedinFill />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewEntries;
