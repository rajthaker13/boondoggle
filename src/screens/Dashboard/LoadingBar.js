import { Card, ProgressBar, Callout } from "@tremor/react";
import React, { useEffect, useState } from "react";
import { getCrmEntriesProgress } from "../../functions/crm_entries";
import { getWorkflowsProgress } from "../Workflows";

function LoadingBar({ messages, isLoading, screen }) {
  // Correct props destructuring
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressMarker = 100 / messages.length;
    let progressMarkerIdx = 1;
    let mi = 0;

    // Function to update progress
    const updateProgress = () => {
      let progressValue = 0;
      if (screen == "dashboard") {
        progressValue = getCrmEntriesProgress();
      }
      if (screen == "workflows") {
        progressValue = getWorkflowsProgress();
      }
      setProgress(progressValue);
      if (progressValue > progressMarker * progressMarkerIdx) {
        mi++;
        setMessageIndex(mi);
        progressMarkerIdx++;
      }
    };

    // Only set up the interval if isLoading is true
    if (isLoading) {
      updateProgress(); // Update immediately on mount

      const intervalId = setInterval(updateProgress, 1000); // Poll every second

      // Cleanup function to clear interval
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    //CALLOUT TOP RIGHT
    /*
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
            {screen === "dashboard" && (
                <div className="absolute top-4 right-4 w-96">
                    <Callout className="h-28" title="This might take a while..." color="indigo">
                        Don't worry, this scan will only happen once. So sit tight while Boondoggle AI dives into your CRM to identify and fix issues.
                    </Callout>
                </div>
            )}
            <div className="w-72">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
        </div>*/

    //CALLOUT MIDDLE BOTTOM
    /*
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
            <div className="w-[20rem] mb-8">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
            
            {screen === "dashboard" && (
                <Callout className="w-[28rem]" title="This might take a while..." color="indigo">
                    Don't worry, this scan will only happen once. So sit tight while Boondoggle AI dives into your CRM to identify and fix issues.
                </Callout>
            )}
        </div>*/

    //CALLOUT MIDDLE TOP LEFT ALIGN
    /*
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
            {screen === "dashboard" && (
                <div className="absolute top-0 left-0 w-full p-4">
                    <Callout className="w-full" title="This might take a while..." color="indigo">
                        Don't worry, this scan will only happen once. So sit tight while Boondoggle AI dives into your CRM to identify and fix issues.
                    </Callout>
                </div>
            )}
            
            <div className="w-[20rem] mt-24">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
        </div>*/

    //CALLOUT MIDDLE TOP MIDDLE ALIGN
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
      {screen === "dashboard" && (
        <div className="absolute top-0 left-0 w-full p-4">
          <Callout
            className="w-full h-28 flex items-center justify-center border-l-0"
            title="This might take a while..."
            color="blue"
          >
            <p className="text-center">
              Don’t worry, this scan will only happen once. So sit tight while
              Boondoggle AI dives into your CRM to identify and fix issues.
            </p>
          </Callout>
        </div>
      )}

      <div className="w-[20rem] mt-36">
        <Card className="p-4">
          <ProgressBar value={progress} color="blue" className="mt-3" />
          <p className="text-center font-mono text-sm text-slate-500 mt-3">
            {messages[messageIndex]}
          </p>
        </Card>
      </div>
    </div>

    //CALLOUT TOP LEFT LEFT ALIGN
    /*<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
            {screen === "dashboard" && (
                <div className="absolute top-0 left-0 w-[28rem] p-4">
                    <Callout className="h-28 flex items-start justify-start" title="This might take a while..." color="indigo">
                        <p className="text-left">
                            Don’t worry, this scan will only happen once. So sit tight while Boondoggle AI dives into your CRM to identify and fix issues.
                        </p>
                    </Callout>
                </div>
            )}
            
            <div className="w-[20rem] mt-36">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
        </div>*/

    //CALLOUT NO SIDEBAR
    /*
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
            {screen === "dashboard" && (
                <div className="absolute top-0 w-full p-4">
                    <Callout className="h-28 flex flex-col justify-start border-l-0" title="This might take a while..." color="indigo">
                        <p className="text-left">
                            Don’t worry, this scan will only happen once. Boondoggle AI is working in your CRM to identify and fix issues.
                        </p>
                    </Callout>
                </div>
            )}

            <div className="w-[20rem] mt-36">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
        </div>
        */
  );
}

export default LoadingBar;
