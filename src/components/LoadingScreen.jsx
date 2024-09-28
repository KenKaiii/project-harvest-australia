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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full space-y-8 animate-pulse-glow">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">BuzzBeam Tools</h2>
        <p className="text-xl text-white opacity-80 text-center mb-6">Uncovering hidden insights...</p>
        <Progress value={progress} className="w-full mb-4" />
        <p className="text-center text-lg font-semibold text-white">{message}</p>
        <p className="text-center text-sm mt-2 text-white opacity-80">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;