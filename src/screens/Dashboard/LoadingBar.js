import { Card, ProgressBar } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { getProgress } from "../../functions/crm_entries";

function LoadingBar({ isLoading, scanComplete }) { // Correct props destructuring
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const messages = [
        "Fetching data...",
        "Scanning contacts...",
        "Analyzing deals...",
        "Surveying events...",
        "Generating embeddings...",
        "Uploading data...",
    ];

    useEffect(() => {
        // Function to update progress
        const updateProgress = () => {
            const progressValue = getProgress();
            setProgress(progressValue);

            if (progressValue < 15) {
                setMessageIndex(0);
            } else if (progressValue < 30) {
                setMessageIndex(1);
            } else if (progressValue < 45) {
                setMessageIndex(2);
            } else if (progressValue < 60) {
                setMessageIndex(3);
            } else if (progressValue < 75) {
                setMessageIndex(4);
            } else {
                setMessageIndex(5);
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
