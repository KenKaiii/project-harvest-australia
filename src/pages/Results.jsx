import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { extractProjectData } from '../services/csvService';
import { analyzeChatGPT } from '../services/chatGptService';

const Results = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatGptStatus, setChatGptStatus] = useState('Not connected');
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedState, selectedInfoType } = location.state || {};

  useEffect(() => {
    if (selectedState && selectedInfoType) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          console.log(`Fetching data for ${selectedState}, ${selectedInfoType}`);
          const data = await extractProjectData(selectedState, selectedInfoType);
          console.log('Data extracted successfully:', data);
          setProjectData(data);

          // Check ChatGPT API connection
          try {
            const analyzedData = await analyzeChatGPT(data);
            console.log('ChatGPT analysis complete:', analyzedData);
            setChatGptStatus('Connected and analyzed data');
          } catch (chatGptError) {
            console.error('Error connecting to ChatGPT API:', chatGptError);
            setChatGptStatus('Connection failed');
          }
        } catch (err) {
          console.error('Error in fetchData:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      console.error('Missing selectedState or selectedInfoType');
      setError('Missing state or information type');
      setIsLoading(false);
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
        <p className="mb-2">
          State: <span className="font-semibold">{selectedState}</span>
        </p>
        <p className="mb-2">
          Information Type: <span className="font-semibold">{selectedInfoType}</span>
        </p>
        <p className="mb-4">
          ChatGPT API Status: <span className="font-semibold">{chatGptStatus}</span>
        </p>
        <div className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap">
            {projectData.length > 0 ? (
              projectData.map((project, index) => (
                `Project ${index + 1}:
Name: ${project.name}
Budget: ${project.budget}
Year: ${project.year}

`
              ))
            ) : (
              'No data extracted'
            )}
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