import Papa from 'papaparse';

const cpQueenslandUrl = '/data/CPQueensland.csv';
const qTripQueenslandUrl = '/data/QTripQueensland.csv';

export const extractProjectData = async (keywords) => {
  try {
    const [cpData, qTripData] = await Promise.all([
      fetchAndParseCSV(cpQueenslandUrl),
      fetchAndParseCSV(qTripQueenslandUrl)
    ]);

    const processedCPData = processCPData(cpData, keywords);
    const processedQTripData = processQTripData(qTripData, keywords);

    return [...processedCPData, ...processedQTripData];
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    throw error;
  }
};

const fetchAndParseCSV = async (url) => {
  const response = await fetch(url);
  const csvData = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
};

const processCPData = (data, keywords) => {
  const keywordsLower = keywords.toLowerCase();
  return data.filter(row => 
    Object.values(row).some(value => 
      value && value.toLowerCase().includes(keywordsLower)
    )
  ).map(row => ({
    name: row['Project Name'] || 'N/A',
    area: row['SA4 Name'] || 'N/A',
    budget: row['Budget 2024-25'] || 'N/A',
    by: row['Agency'] || 'N/A'
  }));
};

const processQTripData = (data, keywords) => {
  const keywordsLower = keywords.toLowerCase();
  return data.filter(row => 
    Object.values(row).some(value => 
      value && value.toLowerCase().includes(keywordsLower)
    )
  ).map(row => ({
    name: row['Investment Name'] || 'N/A',
    area: row['District'] || 'N/A',
    budget: row['2024-25 ($’000)'] || 'N/A',
    by: row['Local Government'] || 'N/A'
  }));
};