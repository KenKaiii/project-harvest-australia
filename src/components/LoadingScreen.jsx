import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("We're diving deep into the records...");

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / 3000) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 25 && newProgress < 50) {
        setMessage("Records found");
      } else if (newProgress >= 50 && newProgress < 75) {
        setMessage("Analysing with ChatGPT");
      } else if (newProgress >= 75 && newProgress < 100) {
        setMessage("Analysis complete");
      } else if (newProgress === 100) {
        setMessage("Delivering your records");
        clearInterval(interval);
        setTimeout(() => {
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 100); // Small delay to ensure the final state is seen
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Extracting Information</h2>
        <Progress value={progress} className="w-full mb-4" />
        <p className="text-center text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;