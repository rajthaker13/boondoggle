import React from "react";
import {
  RiMailLine,
  RiTwitterFill,
  RiLinkedinBoxFill,
  RiCloseCircleFill,
} from "@remixicon/react";
import { Button } from "@tremor/react";

function WorkflowSidebar(props) {
  const unselectedClass =
    "grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex";
  const selectedClass =
    "grow shrink bg-blue-500 basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex";

  const unselectedText =
    "text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500";
  const selectedText =
    "text-left text-white text-s font-normal font-['Inter'] leading-tight w-[70%]";

  return (
    <div class="w-[auto] h-[auto] px-5 rounded-lg  flex-col justify-start items-center inline-flex mr-2">
      <Button variant="secondary">Request Integration</Button>
      <div class="w-[100%] h-[auto] rounded-lg flex-col justify-center items-start gap-2 inline-flex py-5">
        <p class="text-center text-gray-500 text-m font-normal font-['Inter'] leading-tight whitespace-nowrap">
          Social Media
        </p>
        <div
          class="w-[100%] h-[auto] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (props.selectedWorkflow === "Email") {
              props.setSelectedWorkflow("");
            } else {
              props.setSelectedWorkflow("Email");
            }
          }}
        >
          <div
            class={
              props.selectedWorkflow === "Email"
                ? selectedClass
                : unselectedClass
            }
          >
            <RiMailLine
              size={16}
              color={props.selectedWorkflow === "Email" ? "white" : ""}
            />
            <div
              class={
                props.selectedWorkflow === "Email"
                  ? selectedText
                  : unselectedText
              }
            >
              Email
            </div>
            {props.selectedWorkflow === "Email" && (
              <div className="justify-end flex-1">
                <RiCloseCircleFill color="white" size={16} />
              </div>
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (props.selectedWorkflow === "LinkedIn") {
              props.setSelectedWorkflow("");
            } else {
              props.setSelectedWorkflow("LinkedIn");
            }
          }}
        >
          <div
            class={
              props.selectedWorkflow === "LinkedIn"
                ? selectedClass
                : unselectedClass
            }
          >
            <RiLinkedinBoxFill
              color={
                props.selectedWorkflow === "LinkedIn" ? "white" : "#0077B5"
              }
              size={16}
            />
            <div
              class={
                props.selectedWorkflow === "LinkedIn"
                  ? selectedText
                  : unselectedText
              }
            >
              LinkedIn
            </div>
            {props.selectedWorkflow === "LinkedIn" && (
              <RiCloseCircleFill color="white" size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowSidebar;
