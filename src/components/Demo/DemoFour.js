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

export default function DemoFour(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-center gap-[18px] inline-flex">
      <div class="p-[31.15px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-[31.15px] inline-flex">
        <div class="self-stretch h-[267.25px] flex-col justify-start items-start gap-[31.25px] flex">
          <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
            Your published workflow is now available on your dashboard and will
            run daily.
          </div>
          <div class="h-[184px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 flex w-[100%]">
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
            <div class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-tight w-[100%]">
              Deploy LinkedIn messages to HubSpot from B2B SaaS AI founders{" "}
              <br />
              who responded to our recent 50% off offer.
            </div>
            <div class="self-stretch h-9 justify-start items-center gap-4 inline-flex">
              <div class="p-2 bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
                <div class="w-9 h-5 relative">
                  <div class="w-9 h-3 left-0 top-[4px] absolute bg-blue-500 rounded-[999px]"></div>
                  <div class="w-4 h-4 left-[20px] top-[2px] absolute bg-blue-500 rounded-full shadow border-2 border-white"></div>
                </div>
                <div class="text-blue-500 text-sm font-bold font-['Inter']">
                  On
                </div>
              </div>
              <div class="text-gray-500 text-xs font-normal font-['Inter']">
                Enabled (last refreshed 40 hrs ago)
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            props.setStep(4);
          }}
          className="w-[100%]"
        >
          View Results
        </Button>
      </div>
    </div>
  );
}
