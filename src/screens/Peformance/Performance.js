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

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

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

      const uid = localStorage.getItem("uid");
      const connection_id = localStorage.getItem("connection_id");
      const isAdmin = localStorage.getItem("isAdmin");

      let crm_data;

      if (isAdmin == "true") {
        const { data, error } = await props.db
          .from("data")
          .select()
          .eq("connection_id", connection_id);
        crm_data = data[0].crm_data;
      } else {
        const { data, error } = await props.db
          .from("users")
          .select()
          .eq("id", uid);
        crm_data = data[0].crm_data;
      }

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
  return (
    <div className="container">
      <div className="content-container">
        <Sidebar
          selectedTab={1}
          db={props.db}
          onboardingStep={onboardingStep}
        />
        <div
          style={
            isOnboarding && onboardingStep == 7
              ? { flexDirection: "column", filter: "blur(5px)" }
              : { flexDirection: "column" }
          }
        >
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
            {isOnboarding && onboardingStep == 6 && (
              <div className="onboarding-tooltip" style={{ width: "15vw" }}>
                <p
                  className="link-button-text"
                  style={{ lineHeight: "100%", paddingInline: "1vw" }}
                >
                  Here you can see how many entries Boondoggle automatically
                  deployed to your CRM. We use spam filters to make sure that
                  every entry is relevent to your work!
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;
