import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 5000; // Fixed duration of 5 seconds
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onLoadingComplete) {
              onLoadingComplete();
            }
            navigate('/results');
          }, 500); // Delay to allow for exit animation
          return 100;
        }
        return prevProgress + 1;
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [onLoadingComplete, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Loading...</h2>
        <Progress value={progress} className="w-full mb-4" />
        <p className="text-center text-lg font-semibold text-white">Please wait while we process your request</p>
        <p className="text-center text-sm mt-2 text-white opacity-80">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;