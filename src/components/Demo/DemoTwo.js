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

export default function DemoTwo(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-center gap-[18px] inline-flex">
      <div class="p-[31.15px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-[31.15px] inline-flex">
        <div class="self-stretch h-[281.25px] flex-col justify-start items-start gap-[31.25px] flex">
          <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
            These are the most popular bundles of AI workflows used by Sales
            Directors like you!
          </div>
          <div class="justify-start items-start gap-[31px] inline-flex">
            <div class="w-[432px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
              <div class="self-stretch justify-between items-center inline-flex">
                <div class="h-7 justify-start items-center gap-2.5 flex">
                  <div className="w-[50px] h-7 px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                    <HiOutlineMail width={15} height={15} />
                    <img src={hubspot} className="w-[15px] h-[15px]" />
                  </div>
                  <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    Gmail {`->`} HubSpot
                  </div>
                </div>
                <div class="px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
                  <div class="text-blue-700 text-xs font-normal font-['Inter']">
                    2 slots
                  </div>
                </div>
              </div>
              <div class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                Automate the entry of your emails daily into HubSpot, create
                contacts, update contacts, and more.
              </div>
              <div class="self-stretch text-gray-500 text-sm font-bold font-['Inter'] leading-tight">
                See more +
              </div>
              <div class="self-stretch px-4 py-2.5 bg-blue-500 rounded-lg shadow justify-center items-center gap-1.5 inline-flex">
                <div class="text-white text-sm font-medium font-['Inter'] leading-tight">
                  Use template
                </div>
              </div>
            </div>
            <div class="w-[432px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
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
                create contacts, update contacts, and more.
              </div>
              <div class="self-stretch text-gray-500 text-sm font-bold font-['Inter'] leading-tight">
                See more +
              </div>
              <Button
                className="w-[100%]"
                onClick={() => {
                  props.setStep(2);
                }}
              >
                Use Template
              </Button>
            </div>
            <div class="w-[432px] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
              <div class="self-stretch justify-between items-center inline-flex">
                <div class="h-7 justify-start items-center gap-2.5 flex">
                  <div class="w-[50px] self-stretch px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
                    <RiTwitterFill color="#349DF0" />
                    <img src={hubspot} className="w-[15px] h-[15px]" />
                  </div>
                  <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    Twitter {`->`} HubSpot
                  </div>
                </div>
                <div class="px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 flex">
                  <div class="text-blue-700 text-xs font-normal font-['Inter']">
                    2 slots
                  </div>
                </div>
              </div>
              <div class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
                Automate the entry of your Twitter messages daily into HubSpot,
                create contacts, update contacts, and more.
              </div>
              <div class="self-stretch text-gray-500 text-sm font-bold font-['Inter'] leading-tight">
                See more +
              </div>
              <div class="self-stretch px-4 py-2.5 bg-blue-500 rounded-lg shadow justify-center items-center gap-1.5 inline-flex">
                <div class="text-white text-sm font-medium font-['Inter'] leading-tight">
                  Use template
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
