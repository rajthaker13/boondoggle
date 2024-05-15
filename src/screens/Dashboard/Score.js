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

function Score(props) {
  return (
    <div class="w-[96vw] ml-[2vw] mr-[2vw] mt-[5vh] h-[200.64px] p-[37.21px] bg-white rounded-lg shadow border-2 border-gray-200 justify-between items-center inline-flex">
      <div class="flex-col justify-start items-start gap-[15px] inline-flex">
        <div class="flex-col justify-start items-start flex">
          <div class="self-stretch">
            <span class="text-gray-700 text-[27.91px] font-medium font-['Inter'] leading-[43.41px]">
              CRM Health:{" "}
            </span>
            <span class="text-emerald-500 text-[27.91px] font-bold font-['Inter'] leading-[43.41px]">
              Excellent
            </span>
          </div>
          <div class="self-stretch">
            <span class="text-gray-500 text-base font-normal font-['Inter'] leading-[31.01px]">
              Last Scan: 1 hour ago |{" "}
            </span>
            <span class="text-gray-500 text-base font-bold font-['Inter'] leading-[31.01px]">
              25 issues{" "}
            </span>
            <span class="text-gray-500 text-base font-normal font-['Inter'] leading-[31.01px]">
              identified
            </span>
          </div>
        </div>
        <div class="justify-start items-start gap-[15.50px] inline-flex">
          <div class="p-[6.58px] bg-white rounded-md shadow border border-emerald-500 justify-center items-center gap-[7.58px] flex">
            <div className="flex gap-1.5 items-center">
              <RiUserLine />
              <div class="text-gray-700 text-xs font-medium font-['Inter'] leading-[18.44px]">
                Contacts
              </div>
            </div>
          </div>
          <div class="p-[6.41px] bg-white rounded-[5.13px] shadow border border-emerald-500 justify-center items-center gap-2 flex">
            <div className="flex gap-1.5 items-center">
              <RiFireLine />
              <div class="text-gray-700 text-xs font-medium font-['Inter'] leading-[18.44px]">
                Deal Status
              </div>
            </div>
          </div>
          <div class="p-[6.58px] bg-white rounded-md shadow border border-emerald-500 justify-center items-center gap-[7.58px] flex">
            <div className="flex gap-1.5 items-center">
              <RiTableLine />
              <div class="text-gray-700 text-xs font-medium font-['Inter'] leading-[18.44px]">
                Pipeline
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProgressCircle size="xl" value={75} color="emerald-500">
        <div class="w-[65.44px] text-center text-emerald-500 text-[21.22px] font-bold font-['Inter']">
          75
        </div>
      </ProgressCircle>
    </div>
  );
}

export default Score;
