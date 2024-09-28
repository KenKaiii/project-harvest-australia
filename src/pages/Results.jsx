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
          console.log(`Fetching data for ${selectedState}, ${selectedInfoType}, keywords: ${keywords}`);
          const data = await extractProjectData(selectedInfoType, keywords);
          console.log('Data extracted successfully:', data);
          setProjectData(data);

          try {
            const analyzedData = await analyzeChatGPT(data);
            console.log('ChatGPT analysis complete:', analyzedData);
            setChatGptStatus('Connected');
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
    const words = text.split(' ');
    let result = '';
    let lines = 1;
    for (let word of words) {
      if ((result + word).length > maxLength) {
        if (lines >= 2) {
          return result.trim() + '...';
        }
        result += '\n';
        lines++;
      }
      result += word + ' ';
    }
    return result.trim();
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
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="max-w-6xl w-full space-y-4">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">Here's what we've got you..</h1>
        <div className="flex justify-center items-center space-x-8 text-white">
          <p>State: <span className="font-semibold">{selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}</span></p>
          <p>Information Type: <span className="font-semibold">{selectedInfoType}</span></p>
          <p>Keywords: <span className="font-semibold">{keywords || 'None'}</span></p>
        </div>
        <div className="flex justify-center items-center space-x-2 text-white">
          <span className="text-sm">ChatGPT API Status:</span>
          <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
            chatGptStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'
          } shadow-lg flex items-center`}>
            {chatGptStatus === 'Connected' && (
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            )}
            {chatGptStatus}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate('/')} className="text-sm bg-transparent hover:bg-white/20 text-white border border-white">
            Back to Home
          </Button>
          <Button onClick={handleDownloadCSV} className="text-sm bg-transparent hover:bg-white/20 text-white border border-white">
            Download as CSV
          </Button>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full text-sm">
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
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2 border-b">
                    <div className="w-64 whitespace-pre-wrap line-clamp-2 text-sm" title={project.by}>
                      {truncateText(project.by, 80)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="w-64 whitespace-pre-wrap line-clamp-2 text-sm" title={project.name}>
                      {truncateText(project.name, 80)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="w-64 whitespace-pre-wrap line-clamp-2 text-sm" title={project.area}>
                      {truncateText(project.area, 80)}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b font-bold">{formatBudget(project.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;