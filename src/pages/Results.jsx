import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { extractProjectData } from '../services/csvService';
import { analyzeChatGPT } from '../services/chatGptService';
import { downloadAsCSV } from '../utils/csvDownload';
import { ChevronUp, ChevronDown } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Results = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatGptStatus, setChatGptStatus] = useState('Not connected');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedState, selectedInfoType, keywords } = location.state || {};

  useEffect(() => {
    if (selectedState && selectedInfoType) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          console.log(`Fetching data for ${selectedState}, ${selectedInfoType}, keywords: ${keywords}`);
          const data = await extractProjectData(selectedInfoType, keywords);
          console.log('Data extracted successfully:', data);
          setProjectData(data);

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
        }
      };
      fetchData();
    } else {
      console.error('Missing selectedState or selectedInfoType');
      setError('Missing state or information type');
    }
  }, [selectedState, selectedInfoType, keywords]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string' || text === null) {
      return 'N/A';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatBudget = (budget) => {
    if (typeof budget !== 'string' || budget === null) {
      return 'N/A';
    }
    const numericValue = parseFloat(budget.replace(/,/g, '')) * 1000;
    return `$${numericValue.toLocaleString()}`;
  };

  const handleDownloadCSV = () => {
    downloadAsCSV(projectData, 'project_data.csv');
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...projectData].sort((a, b) => {
      if (key === 'budget') {
        const aValue = parseFloat(a[key].replace(/,/g, '')) || 0;
        const bValue = parseFloat(b[key].replace(/,/g, '')) || 0;
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      } else {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      }
    });

    setProjectData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} />;
  };


  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Extracted Project Information</h1>
        <p className="mb-2 text-sm">
          State: <span className="font-semibold">{selectedState}</span>
        </p>
        <p className="mb-2 text-sm">
          Information Type: <span className="font-semibold">{selectedInfoType}</span>
        </p>
        <p className="mb-2 text-sm">
          Keywords: <span className="font-semibold">{keywords || 'None'}</span>
        </p>
        <p className="mb-4 text-sm">
          ChatGPT API Status: <span className="font-semibold">{chatGptStatus}</span>
        </p>
        <div className="flex justify-end mb-4">
          <Button onClick={handleDownloadCSV} className="text-sm">
            Download as CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead>
              <tr>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer"
                  onClick={() => sortData('by')}
                >
                  <div className="flex items-center justify-between">
                    By
                    {getSortIcon('by')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer"
                  onClick={() => sortData('name')}
                >
                  <div className="flex items-center justify-between">
                    Project Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer"
                  onClick={() => sortData('area')}
                >
                  <div className="flex items-center justify-between">
                    Area
                    {getSortIcon('area')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer"
                  onClick={() => sortData('budget')}
                >
                  <div className="flex items-center justify-between">
                    Budget
                    {getSortIcon('budget')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((project, index) => (
                <tr key={index} className="hover:bg-black hover:text-white transition-colors duration-200">
                  <td className="px-4 py-2 border-b">
                    <div className="truncate-text text-xs" title={project.by}>
                      {truncateText(project.by, 60)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="truncate-text text-xs" title={project.name}>
                      {truncateText(project.name, 60)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="truncate-text text-xs" title={project.area}>
                      {truncateText(project.area, 60)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b font-bold">{formatBudget(project.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button onClick={() => navigate('/')} className="mt-4 text-sm">
          Back to Home
        </Button>
      </div>
    </div>
};

export default Results;