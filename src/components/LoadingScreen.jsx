import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("We're diving deep into the records...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50); // Adjust this value to change the overall animation speed

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 25 && progress < 50) {
      setMessage("Records found");
    } else if (progress >= 50 && progress < 75) {
      setMessage("Analysing with ChatGPT");
    } else if (progress >= 75 && progress < 100) {
      setMessage("Analysis complete");
    } else if (progress === 100) {
      setMessage("Delivering your records");
    }
  }, [progress]);

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