import { Card, ProgressBar } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { getProgress } from "../../functions/crm_entries";

function LoadingBar({ messages, isLoading, scanComplete }) { // Correct props destructuring
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {

        const progressMarker = 100/messages.length;
        let progressMarkerIdx = 1;
        let mi = 0;

        // Function to update progress
        const updateProgress = () => {
            const progressValue = getProgress();
            setProgress(progressValue);
            console.log("progress value: ", progressValue);
            console.log("progress marker: ", progressMarker*progressMarkerIdx);
            console.log("message index: ", mi);
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

    }, [isLoading, scanComplete]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
            <div className="w-72">
                <Card className="p-4">
                    <ProgressBar value={progress} color="teal" className="mt-3" />
                    <p className="text-center font-mono text-sm text-slate-500 mt-3">
                        {messages[messageIndex]}
                    </p>
                </Card>
            </div>
        </div>
    );
}

export default LoadingBar;
