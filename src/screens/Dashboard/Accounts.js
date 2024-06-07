import {
  RiMailLine,
  RiTwitterFill,
  RiLinkedinBoxFill,
  RiGridLine,
  RiUserAddLine,
} from "@remixicon/react";

import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Select,
  SelectItem,
  Button,
} from "@tremor/react";
import axios from "axios";

function Accounts(props) {
  const [availableEnrichment, setAvailableEnrichment] = useState([]);
  const [availableEmail, setAvailableEmail] = useState([]);
  const [selectedEnrichment, setSelectedEnrichment] = useState({});
  const [selectedEmail, setSelectedEmail] = useState({});
  const [emailConnected, setEmailConnected] = useState(false);

  useEffect(() => {
    /**
     * Fetches enrichment integrations from the API and updates state.
     */
    async function getEnrichmentIntegrations() {
      const workspace_id = "65c02dbec9810ed1f215c33b";
      //fetch integrations
      const integrations = await (
        await fetch(
          `https://api.unified.to/unified/integration/workspace/${workspace_id}?summary=true&active=true&categories=enrich`
        )
      ).json();
      console.log("Enrichment Integrations", integrations);
      let integrationData = [];
      //iterates over all integrations
      await Promise.all(
        integrations.map(async (integration) => {
          const url = `https://api.unified.to/unified/integration/auth/${workspace_id}/${integration.type}?success_redirect=${window.location.href}`;
          const urlResponse = await axios.get(url);
          //constructs and saves obj containing integration data + auth URL
          integrationData.push({
            data: integration,
            url: urlResponse.data,
          });
        })
      );
      integrationData.sort(function (a, b) {
        var textA = a.data.name.toUpperCase();
        var textB = b.data.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      async function storeData() {
        console.log("HERE");
      }

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("id")) {
        storeData();
      }

      setAvailableEnrichment(integrationData);
    }

    /**
     * Fetches email integrations from the API and updates state.
     */
    async function getEmailIntegrations() {
      const workspace_id = "65c02dbec9810ed1f215c33b";
      //fetch integrations
      const integrations = await (
        await fetch(
          `https://api.unified.to/unified/integration/workspace/${workspace_id}?summary=true&active=true&categories=messaging`
        )
      ).json();
      console.log("Email Integrations", integrations);
      let integrationData = [];
      //iterates over all integrations
      await Promise.all(
        integrations.map(async (integration) => {
          const url = `https://api.unified.to/unified/integration/auth/${workspace_id}/${integration.type}?success_redirect=${window.location.href}`;
          const urlResponse = await axios.get(url);
          //constructs and saves obj containing integration data + auth URL
          integrationData.push({
            data: integration,
            url: urlResponse.data,
          });
        })
      );
      integrationData.sort(function (a, b) {
        var textA = a.data.name.toUpperCase();
        var textB = b.data.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      setAvailableEmail(integrationData);
    }

    /**
     * Check if email is connected from database
     */
    async function checkEmailConnected() {
      const { data, error } = await props.db.from("users").select().eq("id", localStorage.getItem("uid"));
      let dbEmailConnected = data[0].emailLinked
      setEmailConnected(dbEmailConnected)
    }

    getEmailIntegrations();
    getEnrichmentIntegrations();
  }, []);

  return (
    <div class="w-[96vw] mt-[5vh] ml-[2vw] mr-[2vw]  justify-start items-center gap-[17px] inline-flex flex-wrap">
      <Accordion class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <AccordionHeader class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center  flex-1">
            <div className="flex gap-1.5 items-center">
              <RiUserAddLine />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                Email
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div
                class={
                  emailConnected
                    ? "text-emerald-600 text-xs font-normal font-['Inter']"
                    : "text-orange-600 text-xs font-normal font-['Inter']"
                }
              >
                {emailConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </AccordionHeader>
        <AccordionBody className="leading-6">
          <Select>
            {availableEmail.map((integration) => {
              const imageElement = (
                <img
                  src={integration.data.logo_url}
                  alt={integration.data.name}
                  className="inline-flex w-[25px] px-1 justify-center"
                />
              );

              return (
                <SelectItem 
                  onClick={() => {
                    setSelectedEmail(integration)
                    window.open(integration.url, "_self");
                    localStorage.setItem("selectedIntegrationCat", integration.categories[0])
                  }}
                >
                  {imageElement}
                  {integration.data.name}
                </SelectItem>
              );
            })}
          </Select>
          <Button variant="primary" className="w-[100%] mt-[5%]">
            Connect Email
          </Button>
        </AccordionBody>
      </Accordion>

      <Accordion class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <AccordionHeader class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex-1">
            <div className="flex gap-1.5 items-center">
              <RiLinkedinBoxFill color="#0077B5" />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                LinkedIn
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div
                class={
                  props.linkedInLinked
                    ? "text-emerald-600 text-xs font-normal font-['Inter']"
                    : "text-orange-600 text-xs font-normal font-['Inter']"
                }
              >
                {props.linkedInLinked ? "Connected" : "Disconnected"}
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </AccordionHeader>
        <AccordionBody className="leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          tempor lorem non est congue blandit. Praesent non lorem sodales,
          suscipit est sed, hendrerit dolor.
        </AccordionBody>
      </Accordion>

      <Accordion class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <AccordionHeader class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center gap-2.5 flex-1">
            <div className="flex gap-1.5 items-center">
              <RiGridLine />
              <div class="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                CRM
              </div>
            </div>
          </div>
          <div class="justify-start items-center gap-[5px] flex">
            <div class="px-2 py-[2.50px] bg-white/opacity-90 rounded-md border border-white/opacity-80 justify-start items-center gap-1.5 flex">
              <div
                class={
                  props.crmConnected
                    ? "text-emerald-600 text-xs font-normal font-['Inter']"
                    : "text-orange-600 text-xs font-normal font-['Inter']"
                }
              >
                {props.crmConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
            <div class="w-5 h-5 relative"></div>
          </div>
        </AccordionHeader>
        <AccordionBody className="leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          tempor lorem non est congue blandit. Praesent non lorem sodales,
          suscipit est sed, hendrerit dolor.
        </AccordionBody>
      </Accordion>

      <Accordion class="grow shrink basis-0 p-6 bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-4 inline-flex">
        <AccordionHeader class="self-stretch justify-between items-center inline-flex">
          <div class="justify-start items-center  flex-1">
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
        </AccordionHeader>
        <AccordionBody className="leading-6">
          <Select>
            {availableEnrichment.map((integration) => {
              const imageElement = (
                <img
                  src={integration.data.logo_url}
                  alt={integration.data.name}
                  className="inline-flex w-[25px] px-1 justify-center"
                />
              );

              return (
                <SelectItem 
                  onClick={() => {
                    setSelectedEnrichment(integration)
                    window.open(integration.url, "_self");
                    localStorage.setItem("selectedIntegrationCat", integration.categories[0])
                  }}
                >
                  {imageElement}
                  {integration.data.name}
                </SelectItem>
              );
            })}
          </Select>
          <Button variant="primary" className="w-[100%] mt-[5%]">
            Connect Enrichment
          </Button>
        </AccordionBody>
      </Accordion>
    </div>
  );
}

export default Accounts;
