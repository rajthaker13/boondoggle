import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Unified from "unified-ts-client";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import Sidebar from "../components/Sidebar/Sidebar";
import LoadingOverlay from "react-loading-overlay";

function Dashboard(props) {
  useEffect(() => {
    async function getDashboardData() {
      console.log("Hello");
    }

    getDashboardData();
  }, []);
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}

export default Dashboard;
