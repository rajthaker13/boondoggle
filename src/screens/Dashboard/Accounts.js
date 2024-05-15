import {
  RiMailLine,
  RiTwitterFill,
  RiLinkedinBoxFill,
  RiGridLine,
  RiUserAddLine,
} from "@remixicon/react";
import {
  Card,
  DonutChart,
  List,
  ListItem,
  ProgressCircle,
} from "@tremor/react";

import React from "react";

function Accounts(props) {
  return (
    <div class="w-[96vw] mt-[5vh] ml-[2vw] mr-[2vw] h-[76px] justify-start items-center gap-[17px] inline-flex">
      <div class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex">
            <div className="flex gap-1.5 items-center">
              <RiMailLine />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                Email
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                Connected
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </div>
      </div>

      <div class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex">
            <div className="flex gap-1.5 items-center">
              <RiTwitterFill color="#349DF0" />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                Twitter
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                Connected
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </div>
      </div>

      <div class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex">
            <div className="flex gap-1.5 items-center">
              <RiLinkedinBoxFill color="#0077B5" />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                LinkedIn
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                Connected
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </div>
      </div>

      <div class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex">
            <div className="flex gap-1.5 items-center">
              <RiGridLine />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                CRM
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                Connected
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </div>
      </div>

      <div class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex">
            <div className="flex gap-1.5 items-center">
              <RiUserAddLine />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                Enrichment
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div class="text-emerald-600 text-xs font-normal font-['Inter']">
                Connected
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
