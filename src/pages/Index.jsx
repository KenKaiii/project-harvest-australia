import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedInfoType, setSelectedInfoType] = useState('');
  const [keywords, setKeywords] = useState('');
  const navigate = useNavigate();

  const handleExtract = () => {
    if (selectedState && selectedInfoType) {
      navigate('/results', { state: { selectedState, selectedInfoType, keywords } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Project Information Extractor</h1>
        
        <div className="space-y-4">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="queensland">Queensland</SelectItem>
              <SelectItem value="new-south-wales">New South Wales</SelectItem>
              <SelectItem value="victoria">Victoria</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedInfoType} onValueChange={setSelectedInfoType}>
            <SelectTrigger>
              <SelectValue placeholder="Select information type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Transport and Main Roads">Transport and Main Roads</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Enter keywords (e.g., Mount Isa)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          <Button 
            onClick={handleExtract} 
            className="w-full"
            disabled={!selectedState || !selectedInfoType}
          >
            Extract
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;