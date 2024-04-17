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

export default function DemoOne(props) {
  return (
    <div class="w-[100vw] h-[90vh] p-[38px] bg-gray-50 justify-center items-center gap-[18px] inline-flex">
      <div class="w-[500.98px] mt-[10vh] h-[70%] self-stretch p-[31.15px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-start items-start gap-[31.15px] inline-flex">
        <div class="self-stretch h-[461.75px] flex-col justify-start items-start gap-[31.25px] flex">
          <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
            What do you do for work?
          </div>
          <div class="w-[439px] h-[158px] px-[15.57px] py-[10.38px] bg-white rounded-[10.27px] shadow border border-gray-200 justify-start items-start gap-[10.38px] inline-flex">
            <div class="grow shrink basis-0 text-gray-900 text-sm font-normal font-['Inter'] leading-tight">
              I’m a Sales Director at a B2B SaaS startup where we sell to
              enterprises.
            </div>
            <div class="w-[10.38px] h-[10.38px] relative"></div>
          </div>
          <div class="self-stretch text-gray-700 text-lg font-medium font-['Inter'] leading-relaxed">
            What do you wish was automated in your job?
          </div>
          <div class="w-[439px] h-[158px] px-[15.57px] py-[10.38px] bg-white rounded-[10.27px] shadow border border-gray-200 justify-start items-start gap-[10.38px] inline-flex">
            <div class="grow shrink basis-0 text-gray-900 text-sm font-normal font-['Inter'] leading-tight">
              I send lots of outbound messages on LinkedIn and have to update my
              HubSpot manually everyday.
            </div>
            <div class="w-[10.38px] h-[10.38px] relative"></div>
          </div>
        </div>
        <Button
          variant="primary"
          className="w-[100%]"
          onClick={() => {
            props.setStep(1);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
