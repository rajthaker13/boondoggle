import React from "react";

function ContactsDemo(props) {
  return (
    <>
      <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Contacts
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
        <div class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Raj Thaker
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Twitter: @rajhacks
          </div>
        </div>
        <div class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Blake Faulkner
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Company: Boondoggle AI
          </div>
        </div>
        <div class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Roy Periera
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Title: CEO @ Unified.to
          </div>
        </div>
        <div class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Kelly LaBuff
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Location: Austin, Texas
          </div>
        </div>
        <div class="self-stretch py-2 border-b border-gray-200 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Shravan Reddy
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            LinkedIn: linkedin.com/in/shrredd/
          </div>
        </div>
        <div class="self-stretch py-2 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Stephanie Kim
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Email: stephaniechkim@github.com
          </div>
        </div>
        <div class="self-stretch py-2 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Kevin B.
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Name: Kevin Bronander
          </div>
        </div>
        <div class="self-stretch py-2 justify-between items-start inline-flex">
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Farza Mujeed
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight">
            Company: buildspace
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactsDemo;
