import { Card, ProgressBar } from '@tremor/react';
import React, { useEffect, useState } from 'react';

const LoadingBar = ({ isLoading, scanComplete }) => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "Fetching data",
        "Scanning contacts...",
        "Analyzing deals...",
        "Surveying events...",
        "Generating embeddings...",
        "Uploading data...",
    ];

    useEffect(() => {
        if (isLoading) {
          setProgress(0); // Reset progress when loading starts
          let interval = setInterval(() => {
            setProgress(prev => {
              if (scanComplete) {
                return Math.min(prev + 2, 90); // Cap at 90% until complete
              }
              return Math.min(prev + 1, 80); // Increase gradually
            });
          }, 100);
    
          let messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
          }, 2000);
    
          return () => {
            clearInterval(interval);
            clearInterval(messageInterval);
          };
        } else if (scanComplete) {
          setProgress(90);
        } else {
          setProgress(100);
        }
    }, [isLoading, scanComplete]);

    if (!isLoading) {
        return null;
    }
    
    return (
        <div className="space-y-3 text-center">
            <div className="flex justify-center">
                <Card className="max-w-sm">
                <ProgressBar value={progress} color="teal" className="mt-3" />
                </Card>
            </div>
            <p className="text-center font-mono text-sm text-slate-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};
    
export default LoadingBar;