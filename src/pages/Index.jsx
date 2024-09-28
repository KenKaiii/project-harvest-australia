import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from 'lucide-react';

const Index = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedInfoType, setSelectedInfoType] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const navigate = useNavigate();

  const handleExtract = () => {
    if (selectedState && selectedInfoType) {
      setIsExtracting(true);
      setTimeout(() => {
        setIsExtracting(false);
        navigate('/results', { state: { selectedState, selectedInfoType, keywords } });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full space-y-8 animate-pulse-glow">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">BuzzBeam Tools</h1>
          <p className="text-xl text-white opacity-80">Uncover hidden insights in seconds</p>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-60">
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
            <Select value={selectedInfoType} onValueChange={setSelectedInfoType}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-60">
                <SelectValue placeholder="Select information type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transport and Main Roads">Transport and Main Roads</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Department of Housing, Local Government, Planning and Public Works">Department of Housing, Local Government, Planning and Public Works</SelectItem>
                <SelectItem value="QBuild">QBuild</SelectItem>
                <SelectItem value="Queensland Treasury">Queensland Treasury</SelectItem>
              </SelectContent>
            </Select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Enter keywords (optional)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-60"
            />
          </div>

          <Button 
            onClick={handleExtract} 
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:brightness-110 ${isExtracting ? 'animate-pulse' : ''} border-2 border-white animate-glow`}
            disabled={!selectedState || !selectedInfoType || isExtracting}
          >
            {isExtracting ? 'Extracting...' : 'Extract'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;