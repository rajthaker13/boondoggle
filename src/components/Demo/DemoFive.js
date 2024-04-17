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

export default function DemoFive(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-6 bg-white rounded-[5.13px] shadow border border-gray-200 flex-col justify-center items-center gap-[25px] inline-flex">
      <div class="flex justify-center ml-[11vw]">
        <div class="w-[1045px] text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
          LinkedIn {`->`} HubSpot Workflow Activity
        </div>
        <Button
          onClick={() => {
            props.setStep(5);
          }}
        >
          Query data
        </Button>
      </div>
      <div class="w-[935.93px] justify-between items-center inline-flex whitespace-nowrap">
        <div class="grow shrink basis-0 h-[470.82px] justify-start items-start flex">
          <div class="self-stretch pr-[10.26px] flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] py-[10.26px] justify-start items-start inline-flex">
              <div class="text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Date
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
            <div class="self-stretch h-[43.18px] py-[16.25px] justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                April 16th, 2024
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-start items-start inline-flex">
              <div class="text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Workflow
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                LinkedIn {`->`} HubSpot
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-start items-start inline-flex">
              <div class="text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Entry Title
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Conversation with Blake about CRM Integration
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Discussed potential partnership with pulling Reddit data
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                {" "}
                Outreach to Amazon partner on integrating with AWS systems at
                discount
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Discussed pulling Gary Vee's Instagram DMs into Salesforce at
                discount
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Set up meeting for potential partnership with Uber special
                projects
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Discussed discount on pulling LinkedIn Messages
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Discount on Airtable feature integration with multiple tables
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Discussed potential custom API integration with self-hosted CRM
                at discount
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Pulling Twitter messages into HubSpot CRM at 50% off
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Conversation regarding pulling Emails from clients into Attio
                CRM
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-center items-center inline-flex">
              <div class="text-center text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Summary
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-center items-center gap-2.5 inline-flex">
              <div class="w-12 px-2.5 py-0.5 bg-gray-100 rounded-md border border-gray-200 justify-start items-center gap-1.5 flex">
                <div class="text-gray-500 text-xs font-normal font-['Inter']">
                  View
                </div>
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-start items-start inline-flex">
              <div class="text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Customer
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Blake Faulkner
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                William Brackett
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Ani B.
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Stehl Carriere
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Vaibhav Jain
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Tim Evans
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Jaaon Samuel
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Zachary Handley
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Matthew Popovich
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Blake Faulkner
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-start items-start inline-flex">
              <div class="text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Company
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Boondoggle AI
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Reddit
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Amazon
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                VaynerX
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Uber
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Powerhouse
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Zemuria Inc.
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Black Leaf Digital
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Legislature.AI
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-start items-center inline-flex">
              <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-[17.10px]">
                Titan AI
              </div>
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-center items-center inline-flex">
              <div class="text-center text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                LinkedIn
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-center items-center inline-flex">
              <RiLinkedinFill size={15} />
            </div>
          </div>
          <div class="self-stretch flex-col justify-start items-start inline-flex">
            <div class="self-stretch h-[39px] p-[10.26px] justify-center items-center inline-flex">
              <div class="text-center text-gray-700 text-xs font-semibold font-['Inter'] leading-[17.10px]">
                Twitter
              </div>
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] border-b border-gray-200 justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
            <div class="self-stretch h-[43.18px] px-[10.26px] py-[16.25px] justify-center items-center inline-flex">
              <RiTwitterLine size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
