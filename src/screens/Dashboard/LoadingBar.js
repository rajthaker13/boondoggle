import { Card, ProgressBar, Callout } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { getCrmEntriesProgress } from "../../functions/crm_entries";
import { getWorkflowsProgress } from '../Workflows';

function LoadingBar({ messages, isLoading, screen }) { // Correct props destructuring
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {

        const progressMarker = 100/messages.length;
        let progressMarkerIdx = 1;
        let mi = 0;

        // Function to update progress
        const updateProgress = () => {
            let progressValue = 0;
            if(screen == "dashboard") {
                progressValue = getCrmEntriesProgress();
            }
            if(screen == "workflows") {
                console.log("progress: ", getWorkflowsProgress());
                progressValue = getWorkflowsProgress();
            }
            setProgress(progressValue);
            /*console.log("progress value: ", progressValue);
            console.log("progress marker: ", progressMarker*progressMarkerIdx);
            console.log("message index: ", mi);*/
            if (progressValue > progressMarker*progressMarkerIdx) {
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
        /*
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
            {screen === "dashboard" && (
                <div className="absolute top-4 right-4 w-96">
                    <Callout className="h-28" title="This might take a while..." color="indigo">
                        Don't worry, this scan will only happen once. Boondoggle AI is diving into your CRM to identify and fix issues.
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
        </div>
        
    );
}

export default LoadingBar;
