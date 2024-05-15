import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Unified from "unified-ts-client";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import Sidebar from "../../components/Sidebar/Sidebar";
import LoadingOverlay from "react-loading-overlay";
import Donut from "./Donut";
import Usage from "./Usage";
import Chart from "./Chart";
import {
  Card,
  DonutChart,
  List,
  ListItem,
  ProgressCircle,
} from "@tremor/react";
import Accounts from "./Accounts";
import Issues from "./Issues";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningFill,
  RiMailLine,
  RiTwitterFill,
  RiAddLine,
  RiLinkedinBoxFill,
  RiAlignJustify,
  RiCheckLine,
  RiUserLine,
  RiFireLine,
  RiTableLine,
} from "@remixicon/react";
import Score from "./Score";
function Dashboard(props) {
  useEffect(() => {
    async function getDashboardData() {
      console.log("Hello");
    }

    getDashboardData();
  }, []);
  return (
    <div className="w-[100vw] h-[100vh] justify-center items-center">
      <Sidebar selectedTab={0} db={props.db} />

      <Score />

      <Accounts />
      <Issues />
    </div>
  );
}

export default Dashboard;
