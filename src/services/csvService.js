import Papa from 'papaparse';

const csvFileUrl = 'https://raw.githubusercontent.com/KenKaiii/project-harvest-australia/main/budgets/Queensland.csv';

export const extractProjectData = async (infoType) => {
  try {
    console.log(`Fetching CSV data from: ${csvFileUrl}`);
    const response = await fetch(csvFileUrl);
    const csvData = await response.text();
    console.log('CSV data fetched successfully');

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          console.log('CSV parsing complete');
          console.log(`Total rows in CSV: ${results.data.length}`);
          let filteredData = results.data.filter(row => 
            row['Portfolio'] && row['Portfolio'].toLowerCase().includes(infoType.toLowerCase())
          );
          console.log(`Filtered rows for ${infoType}: ${filteredData.length}`);
          const processedData = filteredData.map(row => ({
            name: row['Project Name'] || 'N/A',
            area: row['SA4 Name'] || 'N/A',
            budget: row['Budget'] || 'N/A'
          }));
          console.log('Processed data:', processedData);
          resolve(processedData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    throw error;
  }
};