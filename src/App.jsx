import React, { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Index from "./pages/Index";
import Results from "./pages/Results";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <LoadingScreen key="loading" setIsTransitioning={setIsTransitioning} />
            ) : (
              <Routes>
                <Route path="/" element={<Index setIsTransitioning={setIsTransitioning} />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;