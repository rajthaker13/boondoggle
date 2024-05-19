import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

function DealsDemo(props) {
  return (
    <>
      <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Deals
      </h3>
      <div class="w-[100%] h-[100%] mt-[2vh] mb-[2vh] flex-col justify-start items-start inline-flex">
        <div class="self-stretch justify-between items-center inline-flex">
          <div class="text-gray-700 font-semibold  mb-[2vh] text-sm font-medium font-['Inter'] leading-tight">
            Name
          </div>
          <div class="text-gray-700 font-semibold mb-[2vh] text-sm font-medium font-['Inter'] leading-tight">
            Missing
          </div>
        </div>
        <div
          data-tooltip-id="my-tooltip-1"
          class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex"
        >
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Salad Paid Pilot
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Stage: Review
          </div>
        </div>
        <ReactTooltip
          id="my-tooltip-1"
          place="bottom"
          content="Blake Faulkner recently had a conversation with Derick from Salad who expressed interest next steps in signing a paid pilot"
        />
        <div
          data-tooltip-id="my-tooltip-2"
          class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex"
        >
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Try Teddy Design Partnership
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Stage: Cancelled
          </div>
        </div>
        <ReactTooltip
          id="my-tooltip-2"
          place="bottom"
          content="Raj Thaker from Boondoggle AI mentioned that Boondoggle was archiving their Airtable integrations in order to move up market according to an note logged from an email sent to Drake Dukes last week."
        />
        <div
          data-tooltip-id="my-tooltip-3"
          class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex"
        >
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Reddit Letter of Intent
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Amount: $3,000
          </div>
        </div>
        <ReactTooltip
          id="my-tooltip-3"
          place="bottom"
          content="Blake Faulkner sent an offer to the Head of Data Parterships at Reddit Inc for an annual contract of $250 per month."
        />
      </div>
    </>
  );
}

export default DealsDemo;
