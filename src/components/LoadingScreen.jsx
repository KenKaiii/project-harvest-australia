import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Binoculars, Fingerprint, Lock, Search } from 'lucide-react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing sneaky mode...");
  const [icon, setIcon] = useState(<Binoculars className="w-6 h-6 text-white animate-pulse" />);

  useEffect(() => {
    const duration = Math.random() * (4000 - 2000) + 2000; // Random duration between 2-4 seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(newProgress);

      // Update messages and icons based on progress
      if (newProgress < 20) {
        setMessage("Sneaking into the database...");
        setIcon(<Lock className="w-6 h-6 text-white animate-pulse" />);
      } else if (newProgress < 40) {
        setMessage("Snooping around for project records...");
        setIcon(<Search className="w-6 h-6 text-white animate-pulse" />);
      } else if (newProgress < 60) {
        setMessage("Decoding top-secret data...");
        setIcon(<Fingerprint className="w-6 h-6 text-white animate-pulse" />);
      } else if (newProgress < 80) {
        setMessage("Covering our tracks...");
        setIcon(<Binoculars className="w-6 h-6 text-white animate-pulse" />);
      } else {
        setMessage("Mission accomplished! Exfiltrating...");
        setIcon(<Binoculars className="w-6 h-6 text-white animate-bounce" />);
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
      <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full space-y-8 animate-pulse-slow">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">BuzzBeam Covert Ops</h2>
        <div className="flex justify-center mb-6">{icon}</div>
        <Progress value={progress} className="w-full mb-4" />
        <p className="text-center text-lg font-semibold text-white">{message}</p>
        <p className="text-center text-sm mt-2 text-white opacity-80">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;