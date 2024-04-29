import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningFill,
  RiMailLine,
  RiTwitterFill,
  RiAddLine,
  RiLinkedinBoxFill,
  RiAlignJustify,
  RiCloseCircleFill,
} from "@remixicon/react";
import affinity from "../assets/landing/integrations/crm_svg/affinity.svg";
import attio from "../assets/landing/integrations/crm_svg/attio.svg";
import airtable from "../assets/landing/integrations/crm_svg/airtable.svg";
import close from "../assets/landing/integrations/crm_svg/close.svg";
import copper from "../assets/landing/integrations/crm_svg/copper.svg";
import freshsales from "../assets/landing/integrations/crm_svg/freshsales.svg";
import highlevel from "../assets/landing/integrations/crm_svg/highlevel.svg";
import hubspot from "../assets/landing/integrations/crm_svg/hubspot.svg";
import netsuite from "../assets/landing/integrations/crm_svg/netsuite.svg";
import pipedrive from "../assets/landing/integrations/crm_svg/pipedrive.svg";
import recruitcrm from "../assets/landing/integrations/crm_svg/recruitcrm.svg";
import salesflare from "../assets/landing/integrations/crm_svg/salesflare.svg";
import salesforce from "../assets/landing/integrations/crm_svg/salesforce.svg";
import salesloft from "../assets/landing/integrations/crm_svg/salesloft.svg";
import zendesksell from "../assets/landing/integrations/crm_svg/zendesksell.svg";
import zohocrm from "../assets/landing/integrations/crm_svg/zohocrm.svg";
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
            if (props.selectedWorkflow == "Email") {
              props.setSelectedWorkflow("");
            } else {
              props.setSelectedWorkflow("Email");
            }
          }}
        >
          <div
            class={
              props.selectedWorkflow == "Email"
                ? selectedClass
                : unselectedClass
            }
          >
            <RiMailLine
              size={16}
              color={props.selectedWorkflow == "Email" ? "white" : ""}
            />
            <div
              class={
                props.selectedWorkflow == "Email"
                  ? selectedText
                  : unselectedText
              }
            >
              Email
            </div>
            {props.selectedWorkflow == "Email" && (
              <div className="justify-end flex-1">
                <RiCloseCircleFill color="white" size={16} />
              </div>
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (props.selectedWorkflow == "LinkedIn") {
              props.setSelectedWorkflow("");
            } else {
              props.setSelectedWorkflow("LinkedIn");
            }
          }}
        >
          <div
            class={
              props.selectedWorkflow == "LinkedIn"
                ? selectedClass
                : unselectedClass
            }
          >
            <RiLinkedinBoxFill
              color={props.selectedWorkflow == "LinkedIn" ? "white" : "#0077B5"}
              size={16}
            />
            <div
              class={
                props.selectedWorkflow == "LinkedIn"
                  ? selectedText
                  : unselectedText
              }
            >
              LinkedIn
            </div>
            {props.selectedWorkflow == "LinkedIn" && (
              <RiCloseCircleFill color="white" size={16} />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (props.selectedWorkflow == "Twitter") {
              props.setSelectedWorkflow("");
            } else {
              props.setSelectedWorkflow("Twitter");
            }
          }}
        >
          <div
            class={
              props.selectedWorkflow == "Twitter"
                ? selectedClass
                : unselectedClass
            }
          >
            <RiTwitterFill
              color={props.selectedWorkflow == "Twitter" ? "white" : "#349DF0"}
              size={16}
            />
            <div
              class={
                props.selectedWorkflow == "Twitter"
                  ? selectedText
                  : unselectedText
              }
            >
              Twitter
            </div>
            {props.selectedWorkflow == "Twitter" && (
              <RiCloseCircleFill color="white" size={16} />
            )}
          </div>
        </div>
      </div>

      {/* <div class="w-[100%] h-[auto] rounded-lg flex-col justify-center items-start gap-2 inline-flex py-5">
        <p class="text-center text-gray-500 text-m font-normal font-['Inter'] leading-tight">
          CRM
        </p>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Affinity") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Affinity");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Affinity" ? selectedClass : unselectedClass
            }
          >
            <img
              src={affinity}
              className={
                selectedWorkflow == "Affinity"
                  ? "w-[20px] bg-white"
                  : "w-[20px]"
              }
            />
            <div
              class={
                selectedWorkflow == "Affinity" ? selectedText : unselectedText
              }
            >
              Affinity
            </div>
            {selectedWorkflow == "Affinity" && (
              <RiCloseCircleFill color="white" size={16} />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Airtable") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Airtable");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Airtable" ? selectedClass : unselectedClass
            }
          >
            <img
              src={airtable}
              className={
                selectedWorkflow == "Airtable" ? "w-[20px]" : "w-[20px]"
              }
            />
            <div
              class={
                selectedWorkflow == "Airtable" ? selectedText : unselectedText
              }
            >
              Airtable
            </div>
            {selectedWorkflow == "Airtable" && (
              <RiCloseCircleFill color="white" size={16} className="ml-5" />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Attio") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Attio");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Attio" ? selectedClass : unselectedClass
            }
          >
            <img
              src={attio}
              className={selectedWorkflow == "Attio" ? "w-[20px]" : "w-[20px]"}
            />
            <div
              class={
                selectedWorkflow == "Attio" ? selectedText : unselectedText
              }
            >
              Attio
            </div>
            {selectedWorkflow == "Attio" && (
              <RiCloseCircleFill color="white" size={16} className="ml-10" />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Close") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Close");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Close" ? selectedClass : unselectedClass
            }
          >
            <img
              src={close}
              className={
                selectedWorkflow == "Close" ? "w-[20px] bg-white" : "w-[20px]"
              }
            />
            <div
              class={
                selectedWorkflow == "Close" ? selectedText : unselectedText
              }
            >
              Close.io
            </div>
            {selectedWorkflow == "Close" && (
              <RiCloseCircleFill color="white" size={16} className="ml-5" />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Copper") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Copper");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Copper" ? selectedClass : unselectedClass
            }
          >
            <img
              src={copper}
              className={selectedWorkflow == "Copper" ? "w-[20px]" : "w-[20px]"}
            />
            <div
              class={
                selectedWorkflow == "Copper" ? selectedText : unselectedText
              }
            >
              Copper
            </div>
            {selectedWorkflow == "Copper" && (
              <RiCloseCircleFill color="white" size={16} className="ml-5" />
            )}
          </div>
        </div>
        <div
          class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex"
          onClick={() => {
            if (selectedWorkflow == "Freshsales") {
              setSelectedWorkflow("");
            } else {
              setSelectedWorkflow("Freshsales");
            }
          }}
        >
          <div
            class={
              selectedWorkflow == "Freshsales" ? selectedClass : unselectedClass
            }
          >
            <img
              src={freshsales}
              className={
                selectedWorkflow == "Freshsales"
                  ? "w-[20px] bg-white"
                  : "w-[20px]"
              }
            />
            <div
              class={
                selectedWorkflow == "Freshsales" ? selectedText : unselectedText
              }
            >
              Freshsales
            </div>
            {selectedWorkflow == "Freshsales" && (
              <RiCloseCircleFill color="white" size={16} />
            )}
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={highlevel} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              HighLevel
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={hubspot} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              HubSpot
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={netsuite} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              NetSuite
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={pipedrive} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              Pipedrive
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={recruitcrm} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              RecruitCRM
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={salesflare} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              Salesflare
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[auto] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={salesforce} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              Salesforce
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={salesloft} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              Salesloft
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={zendesksell} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              ZendeskSell
            </div>
          </div>
        </div>
        <div class="w-[100%] h-[25px] justify-start items-center gap-[5px] inline-flex">
          <div class="grow shrink basis-0 self-stretch px-2 py-[2.50px] rounded-md justify-start items-center gap-1.5 flex">
            <img src={zohocrm} className="w-[20px]" />
            <div class="text-center text-gray-500 text-s font-normal font-['Inter'] leading-tight hover:text-blue-500">
              ZohoCRM
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default WorkflowSidebar;
