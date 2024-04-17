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
} from "@remixicon/react";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import LoadingOverlay from "react-loading-overlay";
import hubspot from "../../assets/landing/integrations/crm_svg/hubspot.svg";

export default function DemoThree(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-center gap-[18px] inline-flex">
      <div class="p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="h-7 justify-start items-center gap-2.5 flex">
            <div className="w-[50px] h-7 px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
              <RiLinkedinBoxFill color="#0077B5" width={15} height={15} />
              <img src={hubspot} className="w-[15px] h-[15px]" />
            </div>
            <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
              LinkedIn {`->`} HubSpot
            </div>
          </div>
          <div class="px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
            <div class="text-blue-700 text-xs font-normal font-['Inter']">
              2 slots
            </div>
          </div>
        </div>
        <div class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
          Automate the entry of your LinkedIn messages daily into HubSpot,
          create <br /> contacts, update contacts, and more.
        </div>
        <div class="p-[31.15px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-4 flex">
          <div class="self-stretch h-[419.36px] flex-col justify-start items-start gap-4 flex">
            <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
              Customize this Workflow
            </div>
            <div class="self-stretch h-[158px] px-[15.57px] py-[10.38px] bg-white rounded-[10.27px] shadow border border-gray-200 justify-start items-start gap-[10.38px] inline-flex">
              <div class="grow shrink basis-0 text-gray-900 text-sm font-normal font-['Inter'] leading-tight">
                Only deploy my LinkedIn messages with founders at B2B SaaS AI
                companies
                <br />
                that responded to our 50% off promotional offer last month.
              </div>
              <div class="w-[10.38px] h-[10.38px] relative"></div>
            </div>
            <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
              Select Accounts
            </div>
            <div class="grow shrink basis-0 px-[15.57px] w-[100%] py-[10.38px] bg-white rounded-[10.27px] shadow border border-gray-200 justify-start items-center gap-3 inline-flex">
              <RiLinkedinBoxFill color="#0077B5" />
              <div class="w-[365.04px] text-gray-900 text-lg font-normal font-['Inter'] leading-relaxed">
                Raj Thaker
              </div>
              <div class="p-[5.73px] rounded border border-gray-200"></div>
            </div>
            <div class="self-stretch grow shrink basis-0 px-[15.57px] py-[10.38px] bg-white rounded-[10.27px] shadow border border-gray-200 justify-start items-center gap-3 inline-flex">
              <img src={hubspot} className="w-[25px] h-[25px]" />
              <div class="w-[365.04px] text-gray-900 text-lg font-normal font-['Inter'] leading-relaxed">
                Boondoggle AI HubSpot
              </div>
            </div>
          </div>
          <Button
            className="w-[100%]"
            onClick={() => {
              props.setStep(3);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
