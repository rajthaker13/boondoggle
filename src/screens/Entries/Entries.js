import React, { useEffect, useState } from "react";
import "./Entries.css";
import { useNavigate } from "react-router-dom";
import Unified from "unified-ts-client";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import Sidebar from "../../components/Sidebar/Sidebar";

function Entries(props) {
  const navigation = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewTasks, setViewTasks] = useState(false);

  let renderedData = [];

  let renderedTasks = [];

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
      <div className="content-container">
        <Sidebar selectedTab={2} />
        <div style={{ flexDirection: "column" }}>
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
              <button
                className="entries-tasks-button"
                onClick={() => {
                  setViewTasks(true);
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
                    d="M9.00041 6.34365C8.47505 6.34365 7.96149 6.49944 7.52468 6.79131C7.08786 7.08318 6.7474 7.49803 6.54635 7.9834C6.34531 8.46876 6.29271 9.00285 6.3952 9.51811C6.49769 10.0334 6.75067 10.5067 7.12216 10.8782C7.49364 11.2496 7.96694 11.5026 8.4822 11.6051C8.99746 11.7076 9.53155 11.655 10.0169 11.454C10.5023 11.2529 10.9171 10.9125 11.209 10.4756C11.5009 10.0388 11.6567 9.52526 11.6567 8.9999C11.6567 8.29542 11.3768 7.61979 10.8787 7.12165C10.3805 6.62351 9.70489 6.34365 9.00041 6.34365ZM9.00041 10.5937C8.6852 10.5937 8.37706 10.5002 8.11497 10.3251C7.85288 10.1499 7.6486 9.90102 7.52798 9.6098C7.40735 9.31858 7.37579 8.99813 7.43728 8.68898C7.49878 8.37982 7.65057 8.09584 7.87346 7.87295C8.09635 7.65006 8.38033 7.49827 8.68948 7.43677C8.99864 7.37528 9.31909 7.40684 9.61031 7.52747C9.90153 7.64809 10.1504 7.85237 10.3256 8.11446C10.5007 8.37655 10.5942 8.68469 10.5942 8.9999C10.5942 9.42259 10.4262 9.82797 10.1274 10.1269C9.82847 10.4257 9.4231 10.5937 9.00041 10.5937ZM13.8952 11.0678C13.667 11.6074 13.351 12.1055 12.9602 12.542C12.8656 12.6444 12.7345 12.7055 12.5952 12.7121C12.4559 12.7187 12.3196 12.6703 12.2157 12.5773C12.1119 12.4843 12.0487 12.3542 12.0399 12.215C12.0311 12.0759 12.0773 11.9388 12.1687 11.8335C12.8662 11.0546 13.2519 10.0458 13.2519 9.00023C13.2519 7.95467 12.8662 6.94586 12.1687 6.16701C12.1208 6.11525 12.0838 6.0545 12.0596 5.98828C12.0355 5.92206 12.0248 5.8517 12.0281 5.78131C12.0315 5.71091 12.0488 5.64188 12.0791 5.57824C12.1093 5.5146 12.152 5.45761 12.2045 5.41061C12.257 5.3636 12.3183 5.32752 12.3849 5.30445C12.4515 5.28138 12.522 5.2718 12.5924 5.27625C12.6627 5.2807 12.7314 5.29911 12.7946 5.33039C12.8578 5.36167 12.9141 5.4052 12.9602 5.45846C13.631 6.20907 14.075 7.13467 14.2405 8.12764C14.406 9.12062 14.2863 10.1402 13.8952 11.0678ZM5.08244 7.34572C4.76899 8.08772 4.67285 8.90353 4.80524 9.69807C4.93762 10.4926 5.29308 11.2332 5.83017 11.8335C5.92151 11.9388 5.96776 12.0759 5.95895 12.215C5.95014 12.3542 5.88697 12.4843 5.78308 12.5773C5.67919 12.6703 5.5429 12.7187 5.40363 12.7121C5.26435 12.7055 5.13325 12.6444 5.03861 12.542C4.16642 11.5685 3.68413 10.3073 3.68413 9.00023C3.68413 7.69314 4.16642 6.432 5.03861 5.45846C5.13257 5.35322 5.26449 5.28963 5.40534 5.28166C5.54619 5.27369 5.68444 5.322 5.78967 5.41596C5.8949 5.50992 5.9585 5.64183 5.96647 5.78268C5.97444 5.92353 5.92613 6.06178 5.83217 6.16701C5.51873 6.5157 5.26537 6.91402 5.08244 7.34572ZM16.9692 8.9999C16.9724 11.0862 16.1544 13.09 14.6921 14.578C14.6437 14.6298 14.5855 14.6713 14.5208 14.7002C14.4562 14.7291 14.3864 14.7447 14.3156 14.7463C14.2448 14.7478 14.1744 14.7351 14.1085 14.7091C14.0427 14.683 13.9827 14.644 13.9321 14.5944C13.8816 14.5448 13.8414 14.4856 13.8141 14.4203C13.7867 14.355 13.7727 14.2848 13.7729 14.214C13.773 14.1432 13.7873 14.0731 13.8149 14.0079C13.8426 13.9427 13.883 13.8837 13.9337 13.8343C15.1999 12.5442 15.9093 10.8088 15.9093 9.00123C15.9093 7.19363 15.1999 5.45821 13.9337 4.16818C13.8347 4.06762 13.7798 3.93185 13.7809 3.79075C13.782 3.64965 13.8391 3.51478 13.9397 3.4158C14.0403 3.31682 14.176 3.26184 14.3171 3.26296C14.4582 3.26408 14.5931 3.32121 14.6921 3.42178C16.1544 4.90983 16.9724 6.91359 16.9692 8.9999ZM4.06709 13.8329C4.11601 13.8827 4.15465 13.9417 4.18079 14.0064C4.20693 14.0711 4.22007 14.1404 4.21946 14.2102C4.21884 14.28 4.20448 14.349 4.1772 14.4132C4.14991 14.4775 4.11024 14.5357 4.06045 14.5847C4.01065 14.6336 3.95171 14.6722 3.88698 14.6984C3.82226 14.7245 3.75302 14.7376 3.68321 14.737C3.61341 14.7364 3.54441 14.7221 3.48016 14.6948C3.4159 14.6675 3.35765 14.6278 3.30873 14.578C1.84659 13.0895 1.02734 11.0864 1.02734 8.9999C1.02734 6.91339 1.84659 4.91029 3.30873 3.42178C3.35711 3.37005 3.41534 3.32852 3.48001 3.29963C3.54467 3.27074 3.61445 3.25507 3.68526 3.25354C3.75607 3.25201 3.82647 3.26466 3.89232 3.29074C3.95816 3.31681 4.01813 3.35579 4.0687 3.40538C4.11926 3.45497 4.1594 3.51417 4.18675 3.5795C4.21411 3.64483 4.22812 3.71497 4.22797 3.78579C4.22782 3.85662 4.21351 3.92669 4.18588 3.99191C4.15825 4.05712 4.11786 4.11615 4.06709 4.16553C2.8009 5.45556 2.09153 7.19097 2.09153 8.99857C2.09153 10.8062 2.8009 12.5416 4.06709 13.8316V13.8329Z"
                    fill="#1C1C1C"
                  />
                </svg>
                <p className="entries-tasks-button-text">View Tasks</p>
              </button>
            )}

            {viewTasks && (
              <button
                className="entries-tasks-button"
                onClick={() => {
                  setViewTasks(false);
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
            )}
          </div>
          <div className="dashboard">
            <div className="entries-container">
              <div className="connected-apps-header-container">
                {!viewTasks && (
                  <>
                    <div className="entries-table-row-head">
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
                        if (itemIndex == -1) {
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
                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">Task</p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">
                          Contact
                        </p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">
                          Point of Contact
                        </p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">
                          Last Contact
                        </p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">
                          Generated Response
                        </p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">Type</p>
                      </div>

                      <div className="entries-table-column">
                        <p className="integrations-table-column-header">
                          Completed
                        </p>
                      </div>
                    </div>
                    {tasks
                      .slice()
                      .reverse()
                      .map((lead) => {
                        const timestamp = lead.date;
                        const timeAgoString = timeAgo(timestamp);
                        const isExpanded = expandedRow === lead.id;
                        const itemIndex = renderedTasks.findIndex(
                          (item) => item === lead.customer
                        );
                        if (itemIndex == -1) {
                          renderedTasks.push(lead.customer);
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
                                  {timeAgoString}
                                </p>
                              </div>

                              <div className="entries-table-column">
                                <p className="integrations-table-column-info">
                                  {isExpanded
                                    ? lead.response
                                    : lead.response.slice(0, 50) + "..."}
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
                                    Test
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Entries;
