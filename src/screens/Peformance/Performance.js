import React, { useEffect, useState } from "react";
import "./Performance.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import { BarChart, ResponsiveChartContainer } from "@mui/x-charts";
import Unified from "unified-ts-client";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";

function Performance(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [performanceLabels, setPerformanceLabels] = useState(["Test"]);
  const [performanceData, setPerformanceData] = useState([0]);
  const [crmData, setCRMData] = useState([]);

  const [daily_labels, setDailyLabels] = useState([]);
  const [monthly_labels, setMonthlyLabels] = useState([]);
  const [yearly_labels, setYearlyLabels] = useState([]);

  const [daily_data, setDailyData] = useState([]);
  const [monthly_data, setMonthlyData] = useState([]);
  const [year_data, setYearData] = useState([]);

  const [pushed, setPushed] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // async function updateTabs(id) {
  //   console.log(id);
  //   if (id == "Daily" && selectedTab != 0) {
  //     const currentDate = new Date();

  //     // Array to store the dates
  //     const labels = [];
  //     const tableDates = [];

  //     // Loop to get the last 12 days
  //     for (let i = 11; i >= 0; i--) {
  //       // Get the date for the current iteration
  //       const date = new Date(currentDate);
  //       // Subtract 'i' days from the current date
  //       date.setDate(currentDate.getDate() - i);
  //       console.log("test", date.getMonth());
  //       // Push the formatted date (month/day) to the array
  //       labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
  //       tableDates.push(date);
  //     }
  //     const performance_data = [];

  //     tableDates.map((date) => {
  //       const currentDay = new Date(date);
  //       currentDay.setHours(0, 0, 0, 0);

  //       let counter = 0;

  //       crmData.map((update) => {
  //         const dataDate = new Date(update.date);
  //         dataDate.setHours(0, 0, 0, 0);
  //         if (dataDate.getTime() == currentDay.getTime()) {
  //           counter += 1;
  //         }
  //       });
  //       performance_data.push(counter);
  //     });

  //     setPerformanceLabels(labels);
  //     setPerformanceData(performance_data);
  //     setSelectedTab(0);
  //   } else if (id == "Monthly" && selectedTab != 1) {
  //     // Get the current date
  //     const currentDate = new Date();

  //     // Array to store the dates
  //     const labels = [];
  //     const tableDates = [];

  //     // Loop to get the last 12 months
  //     for (let i = 11; i >= 0; i--) {
  //       // Get the date for the current iteration
  //       const date = new Date(currentDate);
  //       // Subtract 'i' months from the current date
  //       date.setMonth(currentDate.getMonth() - i);
  //       // Push the formatted date (month/year) to the array
  //       labels.push(`${date.getMonth()}`);
  //       tableDates.push(date);
  //     }
  //     setPerformanceLabels(labels);
  //     setSelectedTab(1);
  //   }
  // }

  useEffect(() => {
    async function getData() {
      const currentDate = new Date();

      // Array to store the dates
      const dailyLabels = [];
      const dailyDates = [];

      const monthlyLabels = [];
      const monthlyDates = [];

      const yearLabels = [];
      const yearDates = [];

      // Loop to get the last 12 days
      for (let i = 11; i >= 0; i--) {
        // Get the date for the current iteration
        const day = new Date(currentDate);
        const month = new Date(currentDate);
        const year = new Date(currentDate);
        // Subtract 'i' days from the current date
        day.setDate(currentDate.getDate() - i);

        month.setMonth(currentDate.getMonth() - i);

        year.setFullYear(currentDate.getFullYear() - i);

        // Push the formatted date (month/day) to the array
        dailyLabels.push(`${day.getMonth() + 1}/${day.getDate()}`);
        dailyDates.push(day);

        monthlyLabels.push(monthNames[month.getMonth()]);
        monthlyDates.push(month);

        yearLabels.push(year.getFullYear());
        yearDates.push(year);
      }

      const connection_id = localStorage.getItem("connection_id");
      const { data, error } = await props.db
        .from("data")
        .select()
        .eq("connection_id", connection_id);

      const crm_data = data[0].crm_data;

      const dailyData = [];
      const monthlyData = [];
      const yearlyData = [];

      Promise.all(
        dailyDates.map((date, index) => {
          const currentDay = new Date(date);
          currentDay.setHours(0, 0, 0, 0);

          const currentMonth = new Date(monthlyDates[index]);
          const currentYear = new Date(yearDates[index]);

          let dailyCounter = 0;
          let monthlyCounter = 0;
          let yearCounter = 0;

          Promise.all(
            crm_data.map((update) => {
              const dataDate = new Date(update.date);
              dataDate.setHours(0, 0, 0, 0);
              if (dataDate.getTime() == currentDay.getTime()) {
                dailyCounter += 1;
              }
              if (dataDate.getMonth() == currentMonth.getMonth()) {
                monthlyCounter += 1;
              }
              if (dataDate.getFullYear() == currentYear.getFullYear()) {
                yearCounter += 1;
              }
            })
          );
          dailyData.push(dailyCounter);
          monthlyData.push(monthlyCounter);
          yearlyData.push(yearCounter);
        })
      );

      setPerformanceLabels(dailyLabels);
      setPerformanceData(dailyData);
      setCRMData(crm_data);

      setDailyLabels(dailyLabels);
      setMonthlyLabels(monthlyLabels);
      setYearlyLabels(yearLabels);

      setDailyData(dailyData);
      setMonthlyData(monthlyData);
      setYearData(yearlyData);
      setSelectedTab(0);

      // if (!pushed) {
      //   await testPushCRM();
      // }
      console.log(pushed);

      // const connection_id = localStorage.getItem("connection_id");
      // const options = {
      //   method: "GET",
      //   url: `https://api.unified.to/crm/${connection_id}/contact`,
      //   headers: {
      //     authorization:
      //       "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      //   },
      //   params: {
      //     query: "Blake",
      //   },
      // };
      // const results = await axios.request(options);
      // const customer = results.data[0];
      // console.log(customer["id"]);
      // const { data, error } = await props.db.functions.invoke("airtable-login");
      // const url =
      //   "https://airtable.com/oauth2/v1/authorize?client_id=e193ec31-2ca6-4c1b-8e01-94093e5c4cef&redirect_uri=http://localhost:3000/link&response_type=code&scope=data.records:read%20data.records:write%20schema.bases:read%20schema.bases:write%20user.email:read&state=aR58Klz4zGfK7P05&code_challenge=kXzBSrKLf7W-9JjVGAOLuHLOp48JVN1U8MokoIoJdzk&code_challenge_method=S256";
      // window.open(url, "_self");
    }

    getData();
  }, []);

  async function testPushCRM() {
    const connection_id = localStorage.getItem("connection_id");
    Promise.all(
      crmData.map(async (update) => {
        if (update.customer != "") {
          console.log(update);
          const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
          const regexCustomer = update.customer.replace(regex, "");
          const finalString = regexCustomer.trim();
          console.log("REeeeeeEX", finalString);
          const options = {
            method: "GET",
            url: `https://api.unified.to/crm/${connection_id}/contact`,
            headers: {
              authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
            },
            params: {
              limit: 1000,
              query: finalString,
            },
          };
          const results = await axios.request(options);
          console.log("eeeeeee", results.data);
          const current_crm = results.data[0];

          console.log(current_crm);

          if (current_crm != undefined) {
            const event = {
              id: current_crm.id,
              type: "NOTE",
              note: {
                description: update.title + "\n" + update.summary,
              },
              company_ids: current_crm.company_ids,
              contact_ids: [current_crm.id],
              user_id: "718171982",
            };
            console.log("eveddnt", event);
            const { data, error } = await props.db.functions.invoke(
              "update-crm-unified",
              {
                body: { connection_id: connection_id, event: event },
              }
            );
          } else {
            const contact = {
              id: update.id,
              name: finalString,
            };
            const { data, error } = await props.db.functions.invoke(
              "new-contact-unified",
              {
                body: {
                  connection_id: connection_id,
                  contact: contact,
                  title: update.title,
                  description: update.summary,
                },
              }
            );
            console.log("dstatat", data);
          }
        }
        console.log("Donee");
        setPushed(true);
      })
    );
  }
  return (
    <div className="container">
      <div className="content-container">
        <Sidebar selectedTab={1} />
        <div style={{ flexDirection: "column" }}>
          <div className="dashboard-header">
            <div className="header-text-container">
              <span className="header-text-1">
                <span className="header-text-2">Performance</span>
              </span>
            </div>
          </div>
          <div className="dashboard">
            {/* <button
              onClick={async () => {
                await testPushCRM();
              }}
            >
              CRM TEST
            </button>
            <button>Airtable TEST</button> */}
            <div
              className="connected-apps-container"
              style={{ justifyContent: "center" }}
            >
              <div
                className="connected-apps-header-container"
                style={{
                  flexDirection: "row",
                  flex: "1 0 0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p className="connected-apps-header">Connected Apps</p>
                <div className="chart-filters-container">
                  <button
                    id="Daily"
                    onClick={() => {
                      setPerformanceLabels(daily_labels);
                      setPerformanceData(daily_data);
                      setSelectedTab(0);
                    }}
                    className={
                      selectedTab == 0
                        ? "chart-filter-button-selected"
                        : "chart-filter-button"
                    }
                  >
                    <p
                      className="chart-filter-text"
                      style={selectedTab == 0 ? { color: "white" } : {}}
                    >
                      Daily
                    </p>
                  </button>
                  <button
                    id="Monthly"
                    onClick={() => {
                      setPerformanceLabels(monthly_labels);
                      setPerformanceData(monthly_data);
                      setSelectedTab(1);
                    }}
                    className={
                      selectedTab == 1
                        ? "chart-filter-button-selected"
                        : "chart-filter-button"
                    }
                  >
                    <p
                      className="chart-filter-text"
                      style={selectedTab == 1 ? { color: "white" } : {}}
                    >
                      Monthly
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setPerformanceLabels(yearly_labels);
                      setPerformanceData(year_data);
                      setSelectedTab(2);
                    }}
                    className={
                      selectedTab == 2
                        ? "chart-filter-button-selected"
                        : "chart-filter-button"
                    }
                  >
                    <p
                      className="chart-filter-text"
                      style={selectedTab == 2 ? { color: "white" } : {}}
                    >
                      Yearly
                    </p>
                  </button>
                </div>
              </div>
              <div
                className="connected-apps-howto-container"
                style={{ width: "100%" }}
              >
                <BarChart
                  xAxis={[
                    {
                      id: "barCategories",
                      data: performanceLabels,
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: performanceData,
                      color: "var(--Secondary-Cyan, #A8C5DA)",
                    },
                  ]}
                  width={window.innerWidth * 0.8}
                  height={window.innerHeight * 0.4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;
