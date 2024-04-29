/*global chrome*/
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import Instagram from "../../assets/landing/integrations/social/Instagram.svg";
import LoadingOverlay from "react-loading-overlay";
import affinity from "../../assets/landing/integrations/crm_svg/affinity.svg";
import airtable from "../../assets/landing/integrations/crm_svg/airtable.svg";
import attio from "../../assets/landing/integrations/crm_svg/attio.svg";
import close from "../../assets/landing/integrations/crm_svg/close.svg";
import copper from "../../assets/landing/integrations/crm_svg/copper.svg";
import freshsales from "../../assets/landing/integrations/crm_svg/freshsales.svg";

import highlevel from "../../assets/landing/integrations/crm_svg/highlevel.svg";
import hubspot from "../../assets/landing/integrations/crm_svg/hubspot.svg";
import netsuite from "../../assets/landing/integrations/crm_svg/netsuite.svg";
import pipedrive from "../../assets/landing/integrations/crm_svg/pipedrive.svg";
import recruitcrm from "../../assets/landing/integrations/crm_svg/recruitcrm.svg";
import salesflare from "../../assets/landing/integrations/crm_svg/salesflare.svg";
import salesforce from "../../assets/landing/integrations/crm_svg/salesforce.svg";
import salesloft from "../../assets/landing/integrations/crm_svg/salesloft.svg";
import zendesksell from "../../assets/landing/integrations/crm_svg/zendesksell.svg";
import zohocrm from "../../assets/landing/integrations/crm_svg/zohocrm.svg";
import { Callout, Button, Card, Badge } from "@tremor/react";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningFill,
  RiMailLine,
  RiTwitterFill,
  RiAddLine,
  RiLinkedinBoxFill,
  RiAlignJustify,
  RiCheckLine,
} from "@remixicon/react";

function NewHome(props) {
  const navigation = useNavigate();
  const [linkedInLinked, setLinkedInLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function connectEmail() {
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];
    const { data, error } = await props.db.functions.invoke("email-auth", {
      body: { source: urlWithoutParams },
    });
    window.open(data.url, "_self");
  }

  async function getEmails() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const { data, error } = await props.db.functions.invoke("email-callback", {
      body: { code: code, source: urlWithoutParams },
    });

    if (error == null) {
      localStorage.setItem("email_grant_id", data.id);

      const uid = localStorage.getItem("uid");

      await props.db
        .from("users")
        .update({
          email_grant_id: data.id,
          connected_email: data.email,
        })
        .eq("id", uid);

      setIsLoading(false);
      var cleanUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    async function getEmailData() {
      await getEmails();
    }
    if (urlParams.has("code")) {
      getEmailData();
    }
  }, []);
  return (
    <div>
      <Sidebar selectedTab={0} db={props.db} />
      <div className="mx-10 my-10">
        {/* <Callout
          title="Refresh your integration connections"
          color="red"
          icon={RiErrorWarningFill}
        >
          <div className="flex flex-row justify-between px-4 py-2 rounded-lg items-center flex-auto">
            <p>
              Refresh daily to have accurate information deployments to your
              workflows.
            </p>
            <Button variant="primary" color="red">
              Refresh
            </Button>
          </div>
        </Callout> */}
      </div>
      <div className="mx-10 my-10">
        <p className="text-gray-500 text-xl font-semibold font-['Inter'] leading-tight my-10">
          Connected Integrations
        </p>
        <div class="flex flex-wrap justify-start gap-[18px]">
          <Card className="mx-auto w-[23vw]">
            <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
              <div className="flex gap-1.5 mr-20 items-center">
                <RiMailLine />
                <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                  Email
                </p>
              </div>
              {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
            </div>
            <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
              Integrate with Gmail to access and analyze data <br /> from your
              emails, inbox, and more.
            </p>

            <Button
              variant={
                localStorage.getItem("email_grant_id") == null
                  ? "secondary"
                  : "primary"
              }
              className="w-[100%]"
              icon={
                localStorage.getItem("email_grant_id") == null
                  ? RiAddLine
                  : RiCheckLine
              }
              onClick={async () => {
                await connectEmail();
              }}
              disabled={
                localStorage.getItem("email_grant_id") == null ? false : true
              }
            >
              {localStorage.getItem("email_grant_id") == null
                ? "Add Email account"
                : "Linked"}
            </Button>
          </Card>

          <Card className="mx-auto w-[23vw]">
            <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
              <div className="flex gap-1.5 mr-2 items-center">
                <RiTwitterFill color="#349DF0" />
                <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                  Twitter
                </p>
              </div>
              {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
            </div>
            <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
              Integrate with Twitter to access and analyze data <br /> from your
              emails, inbox, and more.
            </p>

            <Button
              variant={linkedInLinked ? "primary" : "secondary"}
              className="w-[100%]"
              icon={RiAddLine}
              onClick={() => {
                setLinkedInLinked(true);
              }}
            >
              {linkedInLinked ? "Linked" : "Add Twitter account"}
            </Button>
          </Card>

          <Card className="mx-auto w-[23vw]">
            <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
              <div className="flex gap-1.5 mr-20 items-center">
                <RiLinkedinBoxFill color="#0077B5" />
                <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                  LinkedIn
                </p>
              </div>
              {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
            </div>
            <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
              Integrate with LinkedIn to access and analyze data <br /> from
              your emails, inbox, and more.
            </p>

            <Button
              variant="primary"
              className="w-[100%]"
              onClick={() => {
                window.open(
                  "https://chromewebstore.google.com/detail/boondoggle/lgeokfaihmdoipgmajekijkfppdmcnib?pli=1",
                  "_blank"
                );
              }}
            >
              Download Extension
            </Button>
          </Card>

          <Card className="mx-auto w-[23vw]">
            <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
              <div className="flex gap-1.5 mr-20 items-center">
                <RiAlignJustify />
                <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                  CRM
                </p>
              </div>
              {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
            </div>
            <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
              Select your team’s CRM platform. Only one CRM <br />
              tool can be connected per team.
            </p>

            <Button
              variant={
                localStorage.getItem("connection_id") == null
                  ? "secondary"
                  : "primary"
              }
              className="w-[100%]"
              onClick={() => {
                navigation("/link");
              }}
              icon={
                localStorage.getItem("connection_id") == null
                  ? RiAddLine
                  : RiCheckLine
              }
              // disabled={
              //   localStorage.getItem("connection_id") == null ? false : true
              // }
            >
              Add CRM Account
              {/* {localStorage.getItem("connection_id") == null
                ? "Add CRM Account"
                : "Linked"} */}
            </Button>
          </Card>
        </div>
      </div>
      {/* <div className="mx-10 my-10">
        <p className="text-gray-500 text-xl font-semibold font-['Inter'] leading-tight my-10">
          Connected Workflows
        </p>
        <div class="justify-start  gap-[18px] inline-flex">
          <Card className="mx-auto w-[23vw] border-dotted border-2 border-gray-600">
            <p class="text-gray-700 text-lg font-medium font-['Inter'] leading-7 text-center mb-5">
              2 slots remaining
            </p>
            <p class="text-gray-500 text-sm text-center font-normal font-['Inter'] leading-tight mb-5">
              Select your team’s CRM platform. Only one CRM <br />
              tool can be connected per team.
            </p>

            <Button variant="primary" className="w-[100%]">
              Explore Workflows
            </Button>
          </Card>
          <Card className="mx-auto w-[25vw] flex-column">
            <div className="flex flex-row justify-between rounded-lg items-center mb-5">
              <div className="flex gap-1.5 mr-20 items-center">
                <div className="px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                  <RiLinkedinBoxFill color="#0077B5" className="w-[35px]" />
                  <img src={hubspot} className="w-[15px] h-[15px]" />
                </div>
                <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7n whitespace-nowrap">
                  LinkedIn {`->`} HubSpot
                </p>
              </div>
              <Badge color="emerald-500">
                <p>Connected</p>
              </Badge>
            </div>
            <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
              Select your team’s CRM platform. Only one CRM <br />
              tool can be connected per team.
            </p>

            <Button variant="secondary" className="w-[100%]" icon={RiAddLine}>
              Use Template
            </Button>
          </Card>
        </div>
      </div> */}
    </div>
  );
}

export default NewHome;
