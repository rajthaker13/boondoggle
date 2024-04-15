import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";

function WorkflowSidebar(props) {
  return (
    <div class="w-[auto] h-[auto] px-5 rounded-lg shadow flex-col justify-start items-center gap-5 inline-flex">
      <div class="px-2.5 py-1.5 rounded-lg shadow border border-blue-500 justify-center items-center gap-1.5 inline-flex">
        <div class="text-blue-500 text-xs font-normal font-['Inter'] leading-tight whitespace-nowrap">
          Request Integration
        </div>
      </div>
      <div class="h-[119px] rounded-lg flex-col justify-center items-start gap-2 flex">
        <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
          Social Media
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <div class="w-3.5 h-[10.50px] relative"></div>
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Gmail
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <div class="w-3.5 h-3.5 relative">
              <img
                class="w-[7.40px] h-[7.06px] left-[3.27px] top-[3.50px] absolute"
                src="https://via.placeholder.com/7x7"
              />
            </div>
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              LinkedIn
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <div class="w-3.5 h-3.5 justify-center items-center flex">
              <div class="w-3.5 h-3.5 relative flex-col justify-start items-start flex">
                <div class="w-3.5 h-3.5 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Twitter
            </div>
          </div>
        </div>
      </div>
      <div class="h-[218px] rounded-lg flex-col justify-center items-start gap-2 flex">
        <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
          CRM
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <div class="w-3.5 h-[9.80px] relative">
              <div class="w-[10.54px] h-[2.39px] left-[2.02px] top-[3.42px] absolute"></div>
            </div>
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Salesforce
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              HubSpot
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img class="w-3.5 h-3.5" src="https://via.placeholder.com/14x14" />
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Pipedrive
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img class="w-3.5 h-3.5" src="https://via.placeholder.com/14x14" />
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Affinity
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img
              class="w-3.5 h-[11.55px] rounded-[10px]"
              src="https://via.placeholder.com/14x12"
            />
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Attio
            </div>
          </div>
        </div>
        <div class="w-[85px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img
              class="w-3.5 h-[11.71px]"
              src="https://via.placeholder.com/14x12"
            />
            <div class="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-tight">
              Airtable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowSidebar;
