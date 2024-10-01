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
  const [displayedData, setDisplayedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatGptStatus, setChatGptStatus] = useState('Not connected');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 50;
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedState, keywords } = location.state || {};

  useEffect(() => {
    if (selectedState && keywords) {
      const fetchData = async () => {
        try {
          console.log(`Fetching data for ${selectedState}, keywords: ${keywords}`);
          const data = await extractProjectData(keywords);
          console.log('Data extracted successfully:', data);
          setProjectData(data);
          setDisplayedData(data.slice(0, resultsPerPage));

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
        } finally {
          // Delay setting isLoading to false to ensure LoadingScreen is fully displayed
          setTimeout(() => {
            setIsLoading(false);
          }, 500); // Add a small delay to ensure the loading screen completes
        }
      };
      fetchData();
    } else {
      console.error('Missing selectedState or keywords');
      setError('Missing state or keywords');
      setIsLoading(false);
    }
  }, [selectedState, keywords]);

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
    setDisplayedData(sortedData.slice(0, currentPage * resultsPerPage));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} />;
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setDisplayedData(projectData.slice(0, nextPage * resultsPerPage));
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <div className="max-w-6xl w-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[1.75rem] font-bold text-white font-inter">BuzzBeam</h1>
          <Button onClick={() => navigate('/')} className="text-sm bg-transparent hover:bg-white/20 text-white border border-white font-inter font-normal">
            Back to Home
          </Button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white text-center font-inter">{projectData.length} records found for your search</h2>
        <div className="flex justify-center items-center space-x-8 text-white font-inter font-normal">
          <p>State: <span className="font-semibold">{selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}</span></p>
          <p>Keywords: <span className="font-semibold">{keywords}</span></p>
        </div>
        <div className="flex justify-center items-center space-x-2 text-white font-inter font-normal">
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
        <div className="flex justify-end">
          <Button onClick={handleDownloadCSV} className="text-sm bg-transparent hover:bg-white/20 text-white border border-white font-inter font-normal">
            Download as CSV
          </Button>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer font-inter font-bold"
                  onClick={() => sortData('by')}
                >
                  <div className="flex items-center justify-between">
                    By
                    {getSortIcon('by')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer font-inter font-bold"
                  onClick={() => sortData('name')}
                >
                  <div className="flex items-center justify-between">
                    Project Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer font-inter font-bold"
                  onClick={() => sortData('area')}
                >
                  <div className="flex items-center justify-between">
                    Area
                    {getSortIcon('area')}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 bg-gray-100 border-b text-left text-[1.32em] cursor-pointer font-inter font-bold"
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
              {displayedData.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2 border-b">
                    <div className="text-[0.8em] whitespace-normal font-inter font-light">{project.by}</div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="text-[0.8em] whitespace-normal font-inter font-light">{project.name}</div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="text-[0.8em] whitespace-normal font-inter font-light">{project.area}</div>
                  </td>
                  <td className="px-4 py-2 border-b font-inter font-bold text-[0.9em]">{formatBudget(project.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayedData.length < projectData.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMore} className="bg-white text-purple-700 hover:bg-purple-100 font-inter font-normal">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;