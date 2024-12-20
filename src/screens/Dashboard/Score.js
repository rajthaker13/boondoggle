import React, { useEffect, useState } from "react";
import { ProgressCircle, Select, SelectItem } from "@tremor/react";
import { RiUserLine, RiFireLine, RiTableLine } from "@remixicon/react";
import axios from "axios";

function Score(props) {
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [crmType, setCRMType] = useState("");

  useEffect(() => {
    /**
     * Retrieves CRM integrations and connection details from the Unified API.
     * Integrations are fetched based on the workspace ID, and authentication
     * URLs are obtained for each integration. Connection details are retrieved
     * if a connection ID is available in the localStorage.
     */
    async function getCRMIntegrations() {
      const workspace_id = "65c02dbec9810ed1f215c33b";

      // Fetch CRM integrations from the Unified API
      const integrations = await (
        await fetch(
          `https://api.unified.to/unified/integration/workspace/${workspace_id}?summary=true&active=true&categories=crm`
        )
      ).json();

      let integrationData = [];

      // Retrieve authentication URLs for each integration
      await Promise.all(
        integrations.map(async (integration) => {
          const url = `https://api.unified.to/unified/integration/auth/${workspace_id}/${integration.type}?success_redirect=${window.location.href}`;
          const urlResponse = await axios.get(url);

          // Push integration data (integration object and authentication URL) to integrationData array
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

      // Retrieve CRM type
      if (localStorage.getItem("connection_id") != null) {
        const id = localStorage.getItem("connection_id");

        const connectionOptions = {
          method: "GET",
          url: `https://api.unified.to/unified/connection/${id}`,
          headers: {
            authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
          },
        };

        const connectionResponse = await axios.request(connectionOptions);
        setCRMType(connectionResponse.data.integration_type);
      }
      setAvailableIntegrations(integrationData);
    }

    getCRMIntegrations();
  }, []);
  return (
    <>
      {props.crmConnected && (
        <div class="w-[95%] ml-[2vw] mr-[2vw] mt-[5vh] h-[200.64px] p-[37.21px] bg-white rounded-lg shadow border-2 border-gray-200 justify-between items-center inline-flex">
          <div class="flex-col justify-start items-start gap-[15px] inline-flex">
            <div class="flex-col justify-start items-start flex">
              <div class="self-stretch">
                <span class="text-gray-700 text-[27.91px] font-medium font-['Inter'] leading-[43.41px]">
                  CRM Health:{" "}
                </span>
                <span class="text-emerald-500 text-[27.91px] font-bold font-['Inter'] leading-[43.41px]">
                  Excellent
                </span>
              </div>
              <div class="self-stretch">
                <span class="text-gray-500 text-base font-normal font-['Inter'] leading-[31.01px]">
                  Last Scan: Today |{" "}
                </span>
                <span class="text-gray-500 text-base font-bold font-['Inter'] leading-[31.01px]">
                  {props.issuesResolved ? "0" : props.numIssues} issues{" "}
                </span>
                <span class="text-gray-500 text-base font-normal font-['Inter'] leading-[31.01px]">
                  identified
                </span>
              </div>
            </div>
          </div>
          <ProgressCircle size="xl" value={props.crmScore} color="emerald-500">
            <div class="w-[65.44px] text-center text-emerald-500 text-[21.22px] font-bold font-['Inter']">
              {props.crmScore}
            </div>
          </ProgressCircle>
        </div>
      )}
      {!props.crmConnected && (
        <div class="w-[95%] ml-[2vw] mr-[2vw] mt-[5vh] h-[200.64px] p-[37.21px] bg-white rounded-lg shadow border-2 border-gray-200 justify-between items-center inline-flex">
          <div class="flex-col justify-start items-start gap-[15px] inline-flex">
            <div class="flex-col justify-start items-start flex">
              <div class="self-stretch">
                <span class="text-gray-700 text-[27.91px] font-medium font-['Inter'] leading-[43.41px]">
                  CRM Health:{" "}
                </span>
                <span class="text-gray-400 text-[27.91px] font-bold font-['Inter'] leading-[43.41px]">
                  Disconnected
                </span>
              </div>
              <div class="self-stretch text-gray-500 text-base font-normal font-['Inter'] leading-[31.01px]">
                Connect your CRM below to view health status.
              </div>
            </div>
            <Select>
              {availableIntegrations.map((integration) => {
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
                      localStorage.setItem(
                        "selectedIntegrationCat",
                        integration.data.categories[0]
                      );
                      window.open(integration.url, "_self");
                    }}
                  >
                    {imageElement}
                    {integration.data.name}
                  </SelectItem>
                );
              })}
            </Select>
          </div>
          <ProgressCircle size="xl" value={props.crmScore} color="gray-400">
            <div class="w-[65.44px] text-center text-gray-400 text-[21.22px] font-bold font-['Inter']">
              {props.crmScore}
            </div>
          </ProgressCircle>
        </div>
      )}
    </>
  );
}

export default Score;
