import React, { useEffect, useState } from "react";
import "./Entries.css";
import { useNavigate } from "react-router-dom";
import Unified from "unified-ts-client";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";

function Entries(props) {
  const navigation = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    async function getData() {
      const connection_id = localStorage.getItem("connection_id");
      console.log(connection_id);

      const { data, error } = await props.db
        .from("data")
        .select()
        .eq("connection_id", connection_id);
      setTableData(data[0].crm_data);

      // const client = new Unified({ api_token: "65c02dbec9810ed1f215c33b" });

      // const results = client.crm(connection_id).contact.create(tableData[0]);
      // console.log(results);
    }

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
    <div className="container">
      <div
        className="content-container"
        style={{
          height: "auto",
          marginBottom: "2vh",
          minHeight: "96vh",
          marginTop: "2vh",
        }}
      >
        <div className="sidebar">
          <div className="name-badge">
            <img
              src={require("../../assets/IconSet.png")}
              className="profile-icon"
            ></img>
            <p className="profile-name">Boondoggler</p>
          </div>

          <div className="sidebar-tabs">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="IdentificationBadge">
                <path
                  id="Vector"
                  d="M15.625 2.5H4.375C4.20924 2.5 4.05027 2.56585 3.93306 2.68306C3.81585 2.80027 3.75 2.95924 3.75 3.125V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V3.125C16.25 2.95924 16.1842 2.80027 16.0669 2.68306C15.9497 2.56585 15.7908 2.5 15.625 2.5ZM10 13.125C9.50555 13.125 9.0222 12.9784 8.61107 12.7037C8.19995 12.429 7.87952 12.0385 7.6903 11.5817C7.50108 11.1249 7.45157 10.6222 7.54804 10.1373C7.6445 9.65232 7.8826 9.20686 8.23223 8.85723C8.58186 8.5076 9.02732 8.2695 9.51227 8.17304C9.99723 8.07657 10.4999 8.12608 10.9567 8.3153C11.4135 8.50452 11.804 8.82495 12.0787 9.23607C12.3534 9.6472 12.5 10.1305 12.5 10.625C12.5 11.288 12.2366 11.9239 11.7678 12.3928C11.2989 12.8616 10.663 13.125 10 13.125Z"
                  fill="#1C1C1C"
                  fill-opacity="0.1"
                />
                <path
                  id="Vector_2"
                  d="M5.87422 15.5C5.9399 15.5494 6.01468 15.5853 6.09426 15.6057C6.17385 15.6262 6.25669 15.6307 6.33803 15.6191C6.41937 15.6075 6.49763 15.58 6.56832 15.5381C6.63901 15.4962 6.70075 15.4408 6.75 15.375C7.12841 14.8705 7.61909 14.4609 8.18319 14.1789C8.7473 13.8968 9.36932 13.75 10 13.75C10.6307 13.75 11.2527 13.8968 11.8168 14.1789C12.3809 14.4609 12.8716 14.8705 13.25 15.375C13.2992 15.4407 13.3609 15.496 13.4316 15.5378C13.5022 15.5796 13.5804 15.6071 13.6616 15.6187C13.7429 15.6303 13.8256 15.6258 13.9051 15.6054C13.9846 15.5851 14.0593 15.5492 14.125 15.5C14.1907 15.4508 14.246 15.3891 14.2878 15.3184C14.3296 15.2478 14.3571 15.1696 14.3687 15.0884C14.3803 15.0071 14.3758 14.9244 14.3554 14.8449C14.3351 14.7654 14.2992 14.6907 14.25 14.625C13.6966 13.883 12.9586 13.2988 12.1094 12.9305C12.5748 12.5056 12.9008 11.9499 13.0447 11.3364C13.1887 10.7229 13.1438 10.0802 12.9159 9.49267C12.688 8.90514 12.2879 8.40023 11.7679 8.0442C11.248 7.68816 10.6325 7.49765 10.0023 7.49765C9.37218 7.49765 8.75673 7.68816 8.23678 8.0442C7.71682 8.40023 7.31666 8.90514 7.08879 9.49267C6.86093 10.0802 6.81602 10.7229 6.95995 11.3364C7.10388 11.9499 7.42993 12.5056 7.89531 12.9305C7.0444 13.2981 6.30472 13.8824 5.75 14.625C5.65046 14.7575 5.60763 14.9241 5.63092 15.0882C5.65422 15.2523 5.74173 15.4004 5.87422 15.5ZM10 8.75C10.3708 8.75 10.7334 8.85997 11.0417 9.06599C11.35 9.27202 11.5904 9.56486 11.7323 9.90747C11.8742 10.2501 11.9113 10.6271 11.839 10.9908C11.7666 11.3545 11.588 11.6886 11.3258 11.9508C11.0636 12.213 10.7295 12.3916 10.3658 12.464C10.0021 12.5363 9.62508 12.4992 9.28247 12.3573C8.93986 12.2154 8.64702 11.975 8.44099 11.6667C8.23497 11.3584 8.125 10.9958 8.125 10.625C8.125 10.1277 8.32254 9.65081 8.67417 9.29917C9.02581 8.94754 9.50272 8.75 10 8.75ZM15.625 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V3.125C16.875 2.79348 16.7433 2.47554 16.5089 2.24112C16.2745 2.0067 15.9565 1.875 15.625 1.875ZM15.625 16.875H4.375V3.125H15.625V16.875ZM6.875 5C6.875 4.83424 6.94085 4.67527 7.05806 4.55806C7.17527 4.44085 7.33424 4.375 7.5 4.375H12.5C12.6658 4.375 12.8247 4.44085 12.9419 4.55806C13.0592 4.67527 13.125 4.83424 13.125 5C13.125 5.16576 13.0592 5.32473 12.9419 5.44194C12.8247 5.55915 12.6658 5.625 12.5 5.625H7.5C7.33424 5.625 7.17527 5.55915 7.05806 5.44194C6.94085 5.32473 6.875 5.16576 6.875 5Z"
                  fill="#1C1C1C"
                />
              </g>
            </svg>

            <p
              className="tabs-text"
              onClick={() => {
                navigation("/home");
              }}
            >
              Integrations
            </p>
          </div>

          <div className="tabs-container">
            <div className="sidebar-tabs">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="ChartPieSlice">
                  <path
                    id="Vector"
                    d="M7.50002 2.92969V8.55469L2.62502 11.3672C2.29959 9.61066 2.61183 7.79565 3.50554 6.24885C4.39925 4.70205 5.81572 3.52504 7.50002 2.92969Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M7.81261 9.09609C7.90765 9.04123 7.98656 8.96231 8.04142 8.86727C8.09627 8.77223 8.12514 8.66442 8.12511 8.55469V2.92969C8.12456 2.83004 8.10018 2.73198 8.05402 2.64367C8.00786 2.55536 7.94126 2.47936 7.85976 2.42202C7.77826 2.36469 7.68424 2.32766 7.58553 2.31405C7.48681 2.30043 7.38628 2.31062 7.2923 2.34375C5.46807 2.98939 3.93396 4.26457 2.96575 5.94005C1.99755 7.61554 1.65875 9.58145 2.01027 11.4844C2.02849 11.5828 2.07008 11.6754 2.13153 11.7544C2.19298 11.8333 2.27249 11.8964 2.3634 11.9383C2.44531 11.9766 2.53468 11.9963 2.62511 11.9961C2.73481 11.9961 2.84259 11.9673 2.93761 11.9125L7.81261 9.09609ZM6.87511 3.87656V8.19375L3.13449 10.3523C3.12511 10.2344 3.12511 10.1156 3.12511 10C3.12622 8.73309 3.4769 7.49106 4.13855 6.41066C4.80019 5.33025 5.74713 4.45337 6.87511 3.87656ZM17.0579 5.97812C17.0509 5.96406 17.0439 5.94922 17.0353 5.93516C17.0267 5.92109 17.0196 5.90938 17.0111 5.89688C16.2947 4.67328 15.2707 3.65834 14.0409 2.95282C12.811 2.24729 11.418 1.87572 10.0001 1.875C9.83435 1.875 9.67538 1.94085 9.55817 2.05806C9.44096 2.17527 9.37511 2.33424 9.37511 2.5V9.67422L3.21808 13.2602C3.14664 13.3016 3.0841 13.3567 3.0341 13.4225C2.9841 13.4882 2.94762 13.5632 2.92677 13.6431C2.90592 13.723 2.90112 13.8062 2.91263 13.888C2.92415 13.9698 2.95176 14.0485 2.99386 14.1195C3.8972 15.6578 5.28168 16.856 6.93365 17.5293C8.58561 18.2025 10.4132 18.3134 12.1345 17.8448C13.8557 17.3762 15.3749 16.3541 16.4576 14.9364C17.5403 13.5186 18.1262 11.7839 18.1251 10C18.1269 8.58916 17.759 7.20247 17.0579 5.97812ZM10.6251 3.15313C11.6164 3.24437 12.576 3.54965 13.4378 4.04791C14.2995 4.54617 15.0429 5.22552 15.6165 6.03906L10.6251 8.94609V3.15313ZM10.0001 16.875C8.90903 16.8722 7.83412 16.6111 6.86336 16.113C5.89259 15.6149 5.05357 14.894 4.41496 14.0094L10.3056 10.5789L10.3228 10.568L16.2423 7.12031C16.7255 8.16777 16.9373 9.31996 16.8583 10.4708C16.7793 11.6216 16.4121 12.734 15.7903 13.7057C15.1685 14.6773 14.3123 15.4768 13.3005 16.0307C12.2886 16.5845 11.1536 16.8749 10.0001 16.875Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>
              <p
                className="tabs-text"
                onClick={() => {
                  navigation("/performance");
                }}
              >
                Performance
              </p>
            </div>

            <div className="sidebar-tabs">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="FolderNotch">
                  <path
                    id="Vector"
                    d="M10 6.25L7.66641 8C7.55822 8.08114 7.42664 8.125 7.29141 8.125H2.5V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29141C7.42664 4.375 7.55822 4.41886 7.66641 4.5L10 6.25Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM3.125 5H7.29141L8.95859 6.25L7.29141 7.5H3.125V5ZM16.875 15.625H3.125V8.75H7.29141C7.56176 8.74933 7.82472 8.66168 8.04141 8.5L10.2086 6.875H16.875V15.625Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>

              <p className="tabs-text" style={{ fontWeight: 700 }}>
                Entries
              </p>
            </div>

            {/* <div className="sidebar-tabs">
              <svg
                width="30"
                height="30"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="IdentificationBadge">
                  <path
                    id="Vector"
                    d="M15.625 2.5H4.375C4.20924 2.5 4.05027 2.56585 3.93306 2.68306C3.81585 2.80027 3.75 2.95924 3.75 3.125V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V3.125C16.25 2.95924 16.1842 2.80027 16.0669 2.68306C15.9497 2.56585 15.7908 2.5 15.625 2.5ZM10 13.125C9.50555 13.125 9.0222 12.9784 8.61107 12.7037C8.19995 12.429 7.87952 12.0385 7.6903 11.5817C7.50108 11.1249 7.45157 10.6222 7.54804 10.1373C7.6445 9.65232 7.8826 9.20686 8.23223 8.85723C8.58186 8.5076 9.02732 8.2695 9.51227 8.17304C9.99723 8.07657 10.4999 8.12608 10.9567 8.3153C11.4135 8.50452 11.804 8.82495 12.0787 9.23607C12.3534 9.6472 12.5 10.1305 12.5 10.625C12.5 11.288 12.2366 11.9239 11.7678 12.3928C11.2989 12.8616 10.663 13.125 10 13.125Z"
                    fill="#1C1C1C"
                    fill-opacity="0.1"
                  />
                  <path
                    id="Vector_2"
                    d="M5.87422 15.5C5.9399 15.5494 6.01468 15.5853 6.09426 15.6057C6.17385 15.6262 6.25669 15.6307 6.33803 15.6191C6.41937 15.6075 6.49763 15.58 6.56832 15.5381C6.63901 15.4962 6.70075 15.4408 6.75 15.375C7.12841 14.8705 7.61909 14.4609 8.18319 14.1789C8.7473 13.8968 9.36932 13.75 10 13.75C10.6307 13.75 11.2527 13.8968 11.8168 14.1789C12.3809 14.4609 12.8716 14.8705 13.25 15.375C13.2992 15.4407 13.3609 15.496 13.4316 15.5378C13.5022 15.5796 13.5804 15.6071 13.6616 15.6187C13.7429 15.6303 13.8256 15.6258 13.9051 15.6054C13.9846 15.5851 14.0593 15.5492 14.125 15.5C14.1907 15.4508 14.246 15.3891 14.2878 15.3184C14.3296 15.2478 14.3571 15.1696 14.3687 15.0884C14.3803 15.0071 14.3758 14.9244 14.3554 14.8449C14.3351 14.7654 14.2992 14.6907 14.25 14.625C13.6966 13.883 12.9586 13.2988 12.1094 12.9305C12.5748 12.5056 12.9008 11.9499 13.0447 11.3364C13.1887 10.7229 13.1438 10.0802 12.9159 9.49267C12.688 8.90514 12.2879 8.40023 11.7679 8.0442C11.248 7.68816 10.6325 7.49765 10.0023 7.49765C9.37218 7.49765 8.75673 7.68816 8.23678 8.0442C7.71682 8.40023 7.31666 8.90514 7.08879 9.49267C6.86093 10.0802 6.81602 10.7229 6.95995 11.3364C7.10388 11.9499 7.42993 12.5056 7.89531 12.9305C7.0444 13.2981 6.30472 13.8824 5.75 14.625C5.65046 14.7575 5.60763 14.9241 5.63092 15.0882C5.65422 15.2523 5.74173 15.4004 5.87422 15.5ZM10 8.75C10.3708 8.75 10.7334 8.85997 11.0417 9.06599C11.35 9.27202 11.5904 9.56486 11.7323 9.90747C11.8742 10.2501 11.9113 10.6271 11.839 10.9908C11.7666 11.3545 11.588 11.6886 11.3258 11.9508C11.0636 12.213 10.7295 12.3916 10.3658 12.464C10.0021 12.5363 9.62508 12.4992 9.28247 12.3573C8.93986 12.2154 8.64702 11.975 8.44099 11.6667C8.23497 11.3584 8.125 10.9958 8.125 10.625C8.125 10.1277 8.32254 9.65081 8.67417 9.29917C9.02581 8.94754 9.50272 8.75 10 8.75ZM15.625 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V3.125C16.875 2.79348 16.7433 2.47554 16.5089 2.24112C16.2745 2.0067 15.9565 1.875 15.625 1.875ZM15.625 16.875H4.375V3.125H15.625V16.875ZM6.875 5C6.875 4.83424 6.94085 4.67527 7.05806 4.55806C7.17527 4.44085 7.33424 4.375 7.5 4.375H12.5C12.6658 4.375 12.8247 4.44085 12.9419 4.55806C13.0592 4.67527 13.125 4.83424 13.125 5C13.125 5.16576 13.0592 5.32473 12.9419 5.44194C12.8247 5.55915 12.6658 5.625 12.5 5.625H7.5C7.33424 5.625 7.17527 5.55915 7.05806 5.44194C6.94085 5.32473 6.875 5.16576 6.875 5Z"
                    fill="#1C1C1C"
                  />
                </g>
              </svg>

              <p className="profile-name">Settings</p>
            </div> */}
          </div>
        </div>
        <div style={{ flexDirection: "column" }}>
          <div className="dashboard-header">
            <div className="header-text-container">
              <span className="header-text-1">
                Dashboards / <span className="header-text-2">Entries</span>
              </span>
            </div>
          </div>
          <div className="dashboard">
            <div className="entries-stats-container">
              {/* <div className="entries-stats-cell">
                <div className="entries-stats-text-container"></div>
                <span className="stats-line-text-1">
                  Rejected <span className="stats-line-text-2">6</span>
                </span>
                <div className="stats-line-container">
                  <div className="stats-line"></div>
                </div>
              </div> */}

              <div className="entries-stats-cell">
                <div className="entries-stats-text-container"></div>
                <span className="stats-line-text-1">
                  Rejected <span className="stats-line-text-2">6</span>
                </span>
                <div className="stats-line-container">
                  <div
                    className="stats-line"
                    style={{ background: "var(--Secondary-Purple, #C6C7F8)" }}
                  ></div>
                </div>
              </div>

              {/* <div className="entries-stats-cell">
                <div className="entries-stats-text-container"></div>
                <span className="stats-line-text-1">
                  Pending <span className="stats-line-text-2">4</span>
                </span>
                <div className="stats-line-container">
                  <div
                    className="stats-line"
                    style={{ background: "#B1E3FF" }}
                  ></div>
                </div>
              </div> */}

              <div className="entries-stats-cell">
                <div className="entries-stats-text-container"></div>
                <span className="stats-line-text-1">
                  Completed <span className="stats-line-text-2">6</span>
                </span>
                <div className="stats-line-container">
                  <div
                    className="stats-line"
                    style={{ background: "#A1E3CB" }}
                  ></div>
                </div>
              </div>
            </div>
            {/* <div className="sort-container">
              <div className="filter-container">
                <div className="filter-button">
                  <div className="filter-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.625 4.375C10.625 4.02982 10.3452 3.75 10 3.75C9.65482 3.75 9.375 4.02982 9.375 4.375V9.375H4.375C4.02982 9.375 3.75 9.65482 3.75 10C3.75 10.3452 4.02982 10.625 4.375 10.625H9.375V15.625C9.375 15.9702 9.65482 16.25 10 16.25C10.3452 16.25 10.625 15.9702 10.625 15.625V10.625H15.625C15.9702 10.625 16.25 10.3452 16.25 10C16.25 9.65482 15.9702 9.375 15.625 9.375H10.625V4.375Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </div>
                </div>

                <div className="filter-button">
                  <div className="filter-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.625 4.375C10.625 4.02982 10.3452 3.75 10 3.75C9.65482 3.75 9.375 4.02982 9.375 4.375V9.375H4.375C4.02982 9.375 3.75 9.65482 3.75 10C3.75 10.3452 4.02982 10.625 4.375 10.625H9.375V15.625C9.375 15.9702 9.65482 16.25 10 16.25C10.3452 16.25 10.625 15.9702 10.625 15.625V10.625H15.625C15.9702 10.625 16.25 10.3452 16.25 10C16.25 9.65482 15.9702 9.375 15.625 9.375H10.625V4.375Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </div>
                </div>

                <div className="filter-button">
                  <div className="filter-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.625 4.375C10.625 4.02982 10.3452 3.75 10 3.75C9.65482 3.75 9.375 4.02982 9.375 4.375V9.375H4.375C4.02982 9.375 3.75 9.65482 3.75 10C3.75 10.3452 4.02982 10.625 4.375 10.625H9.375V15.625C9.375 15.9702 9.65482 16.25 10 16.25C10.3452 16.25 10.625 15.9702 10.625 15.625V10.625H15.625C15.9702 10.625 16.25 10.3452 16.25 10C16.25 9.65482 15.9702 9.375 15.625 9.375H10.625V4.375Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <input className="search-container" placeholder="Search"></input>
            </div> */}
            <div className="entries-container">
              <div className="connected-apps-header-container">
                <div className="entries-table-row-head">
                  {/* <div className="entries-table-column" style={{ width: "5%" }}>
                    <div className="integrations-table-column-checkbox">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1 7.4C1 5.15979 1 4.03968 1.43597 3.18404C1.81947 2.43139 2.43139 1.81947 3.18404 1.43597C4.03968 1 5.15979 1 7.4 1H8.6C10.8402 1 11.9603 1 12.816 1.43597C13.5686 1.81947 14.1805 2.43139 14.564 3.18404C15 4.03968 15 5.15979 15 7.4V8.6C15 10.8402 15 11.9603 14.564 12.816C14.1805 13.5686 13.5686 14.1805 12.816 14.564C11.9603 15 10.8402 15 8.6 15H7.4C5.15979 15 4.03968 15 3.18404 14.564C2.43139 14.1805 1.81947 13.5686 1.43597 12.816C1 11.9603 1 10.8402 1 8.6V7.4Z"
                          fill="#1C1C1C"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.0087 6.1989C11.3131 6.47985 11.3321 6.95435 11.0511 7.25871L8.23979 10.3043C7.83664 10.7411 7.1438 10.7319 6.75241 10.2845L5.18558 8.49388C4.91282 8.18215 4.9444 7.70833 5.25613 7.43557C5.56786 7.16281 6.04168 7.1944 6.31444 7.50613L7.51493 8.87811L9.94891 6.24129C10.2299 5.93693 10.7044 5.91795 11.0087 6.1989Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div> */}

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">Entry ID</p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">Customer</p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">
                      Entry Title
                    </p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">Summary</p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">
                      Date Deployed
                    </p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">Source</p>
                  </div>

                  <div className="entries-table-column">
                    <p className="integrations-table-column-header">Status</p>
                  </div>
                </div>
                {tableData
                  .slice()
                  .reverse()
                  .map((lead) => {
                    const timestamp = lead.date;
                    const timeAgoString = timeAgo(timestamp);
                    const isExpanded = expandedRow === lead.id;
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
                              style={{ color: "#8A8CD9" }}
                            >
                              {lead.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entries;