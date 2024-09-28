import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedInfoType, setSelectedInfoType] = useState('');
  const navigate = useNavigate();

  const handleExtract = () => {
    if (selectedState && selectedInfoType) {
      navigate('/results', { state: { selectedState, selectedInfoType } });
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
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>

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