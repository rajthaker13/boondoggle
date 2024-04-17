import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import { TextInput, Card, Badge, Button } from "@tremor/react";
import {
  RiSearchLine,
  RiMailLine,
  RiAddLin,
  RiLinkedinBoxFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiTwitterLine,
} from "@remixicon/react";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import LoadingOverlay from "react-loading-overlay";
import hubspot from "../../assets/landing/integrations/crm_svg/hubspot.svg";
import boondoggleai from "../../assets/ui-update/new-logo.svg";
import raj from "../../assets/ui-update/raj.png";

export default function DemoSix(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-center gap-[18px] inline-flex">
      <div class="w-[1227px] h-[687px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-[30px] inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="grow shrink basis-0 h-7 justify-start items-center gap-2.5 flex">
            <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
              Query data
            </div>
          </div>
        </div>
        <div class="w-[1179px] h-px justify-center items-center inline-flex">
          <div class="w-[1179px] h-px bg-gray-100 rounded-sm"></div>
        </div>
        <div class="rounded-lg justify-start items-center gap-[15px] inline-flex">
          <img class="w-[41px] h-[41px]" src={boondoggleai} />
          <div class="text-gray-700 text-sm font-normal font-['Inter'] leading-tight">
            Happy to help! Ask below and I’ll access and analyze data across
            your connected integrations to produce an answer!
          </div>
        </div>
        <div class="rounded-lg justify-start items-center gap-[15px] inline-flex">
          <img class="w-[41px] h-[41px] rounded-full" src={raj} />
          <div class="text-gray-700 text-sm font-normal font-['Inter'] leading-tight">
            Out of the data I just pulled from my latest LinkedIn refresh, which
            of these contacts work at Enterprise companies?
          </div>
        </div>
        <div class="self-stretch bg-white rounded-lg justify-start items-center gap-4 inline-flex">
          <div class="justify-start items-center gap-[15px] flex">
            <img class="w-[41px] h-[41px]" src={boondoggleai} />
            <div class="w-[1405px] text-gray-700 text-sm font-normal font-['Inter'] leading-tight">
              Sure, here is a list of those contacts and your conversations:
              <br />
              <br />
              • William Brackett (Reddit): Discussed potential partnership with
              pulling Reddit data
              <br />
              <br />
              • Ani B. (Amazon): Outreach to Amazon partner on integrating with
              AWS systems at discount
              <br />
              <br />
              • Stehl Carriere (VaynerX): Discussed pulling Gary Vee's Instagram
              DMs into Salesforce at discount
              <br />
              <br />
              • Vaibhav Jain (Uber): Set up meeting for potential partnership
              with Uber special projects
              <br />
              <br />
              Let me know if there is anything else!
            </div>
          </div>
        </div>
        <div class="px-3 py-2 bg-white rounded-lg shadow border border-blue-600 justify-start items-center gap-2 inline-flex mt-[12vh]">
          <input
            class="w-[1128px] border-0 text-gray-500 text-sm font-normal font-['Inter'] leading-tight"
            placeholder="Ask your apps and data anything.."
          ></input>
          <div class="w-6 self-stretch justify-start items-center gap-2.5 flex">
            <div class="w-6 h-6 relative"></div>
          </div>
          <div class="w-2 h-2 relative"></div>
        </div>
      </div>
    </div>
  );
}
