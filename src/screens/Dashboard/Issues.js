import { Button } from "@tremor/react";
import { RiUserLine, RiFireLine, RiTableLine } from "@remixicon/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Issues(props) {
  const navigation = useNavigate();
  return (
    <div class="w-[96vw] h-[400px] ml-[2vw] mr-[2vw] mt-[5vh] p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-6 inline-flex">
      <div class="self-stretch justify-between items-center inline-flex">
        <div class="text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
          Resolve the following data issues to improve CRM health
        </div>
        {!props.issuesResolved && (
          <Button
            class="p-2 bg-red-500 rounded shadow justify-center items-center gap-[3.17px] flex hover:bg-red-400"
            onClick={() => {
              props.setIsOpen(true);
            }}
          >
            <span class="text-white text-xs font-bold font-['Inter'] leading-[10.56px]">
              Resolve All Issues
            </span>
          </Button>
        )}
      </div>

      {!props.issuesResolved && (
        <>
          <div class="self-stretch justify-between items-center inline-flex">
            <div class="justify-start items-center gap-[5px] flex">
              <div class="justify-start items-center gap-[15px] flex">
                <div class="pl-3 pr-2.5 py-2 bg-white rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
                  <div class="justify-start items-center gap-2.5 flex">
                    <div class="pl-3 pr-2.5 py-2 bg-gray-100 rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
                      <div class="justify-start items-center gap-[5px] flex">
                        <div className="flex gap-1.5 items-center">
                          <RiUserLine />
                          <div class="text-gray-500 text-sm font-medium font-['Inter'] leading-snug">
                            Contacts
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
                    Missing company, contact, email, and other information.
                  </div>
                </div>
              </div>
            </div>
            <Button class="p-2 bg-red-500 rounded shadow justify-center items-center gap-[3.17px] flex hover:bg-red-400">
              <span class="text-white text-xs font-bold font-['Inter'] leading-[10.56px]">
                View 8 Issues
              </span>
            </Button>
          </div>
          <div class="w-[1479px] h-px justify-center items-center inline-flex">
            <div class="w-[1479px] h-px bg-gray-100 rounded-sm"></div>
          </div>
          <div class="self-stretch justify-between items-center inline-flex">
            <div class="justify-start items-center gap-[5px] flex">
              <div class="justify-start items-center gap-[15px] flex">
                <div class="pl-3 pr-2.5 py-2 bg-white rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
                  <div class="justify-start items-center gap-2.5 flex">
                    <div class="pl-3 pr-2.5 py-2 bg-gray-100 rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
                      <div class="justify-start items-center gap-[5px] flex">
                        <div className="flex gap-1.5 items-center">
                          <RiFireLine />
                          <div class="w-[85px] text-gray-500 text-sm font-medium font-['Inter'] leading-[17.94px]">
                            Deal Status
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
                    Infrequent updates, outdated, need follow-ups.
                  </div>
                </div>
              </div>
            </div>
            <Button class="p-2 bg-red-500 rounded shadow justify-center items-center gap-[3.17px] flex hover:bg-red-400">
              <span class="text-white text-xs font-bold font-['Inter'] leading-[10.56px]">
                View 3 Issues
              </span>
            </Button>
          </div>
        </>
      )}

      <div class="w-[1479px] h-px justify-center items-center inline-flex">
        <div class="w-[1479px] h-px bg-gray-100 rounded-sm"></div>
      </div>
      <div class="self-stretch justify-between items-center inline-flex">
        <div class="pl-3 pr-2.5 py-2 bg-white rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
          <div class="pl-3 pr-2.5 py-2 bg-gray-100 rounded-md shadow border border-gray-200 justify-start items-center gap-2.5 flex">
            <div class="justify-start items-center gap-[5px] flex">
              <div className="flex gap-1.5 items-center">
                <RiTableLine />
                <div class="text-gray-500 text-sm font-medium font-['Inter'] leading-[17.94px]">
                  Workflows
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
            Recomended automations for your CRM
          </div>
        </div>
        <Button
          class="p-2 bg-red-500 rounded shadow justify-center items-center gap-[3.17px] flex hover:bg-red-400"
          onClick={() => {
            navigation("/workflows");
          }}
        >
          <span class="text-white text-xs font-bold font-['Inter'] leading-[10.56px]">
            View {props.linkedInLinked ? "8" : "9"} Automations
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Issues;
