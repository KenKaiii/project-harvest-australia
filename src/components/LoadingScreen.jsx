import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing...");

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 5000; // 5 seconds

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update messages based on progress
      if (newProgress < 20) {
        setMessage("Connecting to database...");
      } else if (newProgress < 40) {
        setMessage("Fetching project records...");
      } else if (newProgress < 60) {
        setMessage("Processing data...");
      } else if (newProgress < 80) {
        setMessage("Analyzing with ChatGPT...");
      } else if (newProgress < 95) {
        setMessage("Preparing results...");
      } else {
        setMessage("Finalizing...");
      }

      if (newProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 500); // Small delay to ensure the final state is seen
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Loading Project Data</h2>
        <Progress value={progress} className="w-full mb-4" />
        <p className="text-center text-lg font-semibold">{message}</p>
        <p className="text-center text-sm mt-2 text-gray-500">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;