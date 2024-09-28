import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { extractProjectData } from '../services/csvService';

const Results = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedState, selectedInfoType } = location.state || {};

  useEffect(() => {
    if (selectedState && selectedInfoType) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await extractProjectData(selectedState, selectedInfoType);
          setProjectData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedState, selectedInfoType]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Extracted Project Information</h1>
        <p className="mb-4">
          State: <span className="font-semibold">{selectedState}</span>, 
          Information Type: <span className="font-semibold">{selectedInfoType}</span>
        </p>
        <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap">
            {projectData.map((project, index) => (
              `Project Name: ${project.name}
Budget: ${project.budget}
Year: ${project.year}

`
            ))}
          </pre>
        </div>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Results;