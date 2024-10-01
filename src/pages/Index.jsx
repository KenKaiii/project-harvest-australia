import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from 'lucide-react';

const Index = () => {
  const [selectedState, setSelectedState] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormFilled(selectedState && keywords);
  }, [selectedState, keywords]);

  const handleExtract = () => {
    if (selectedState && keywords) {
      setIsExtracting(true);
      setTimeout(() => {
        setIsExtracting(false);
        navigate('/results', { state: { selectedState, keywords } });
      }, 2000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleExtract();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full space-y-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[1.75rem] font-bold text-white font-inter">BuzzBeam</h1>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2 font-inter">Project Scanner</h2>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-60 font-inter font-normal">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="queensland">Queensland</SelectItem>
                <SelectItem value="new-south-wales">New South Wales</SelectItem>
                <SelectItem value="victoria">Victoria</SelectItem>
              </SelectContent>
            </Select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Enter project keywords (required)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-80 font-inter font-normal"
              required
            />
          </div>

          <Button 
            onClick={handleExtract} 
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:brightness-110 ${isExtracting ? 'animate-pulse' : ''} ${isFormFilled ? 'animate-glow border-2 border-white' : ''} font-inter font-normal`}
            disabled={!selectedState || !keywords || isExtracting}
          >
            {isExtracting ? 'Extracting...' : 'Extract'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;