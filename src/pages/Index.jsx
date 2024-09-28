import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from "@/components/ui/select";
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
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
            placeholder="Select a state"
          >
            <Select.Item value="queensland">Queensland</Select.Item>
            <Select.Item value="new-south-wales">New South Wales</Select.Item>
            <Select.Item value="victoria">Victoria</Select.Item>
            {/* Add more states as needed */}
          </Select>

          <Select
            value={selectedInfoType}
            onValueChange={setSelectedInfoType}
            placeholder="Select information type"
          >
            <Select.Item value="infrastructure">Infrastructure</Select.Item>
            <Select.Item value="healthcare">Healthcare</Select.Item>
            {/* Add more information types as needed */}
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