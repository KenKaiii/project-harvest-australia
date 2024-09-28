import Papa from 'papaparse';

const stateCSVMap = {
  queensland: 'https://raw.githubusercontent.com/KenKaiii/project-harvest-australia/main/budgets/QLDBudgets.csv',
  // Add other states here as they become available
  // 'new-south-wales': '/budgets/NSWBudgets.csv',
  // 'victoria': '/budgets/VICBudgets.csv',
};

export const extractProjectData = async (state, infoType) => {
  const csvFileUrl = stateCSVMap[state.toLowerCase()];
  
  if (!csvFileUrl) {
    console.error(`No CSV file found for state: ${state}`);
    throw new Error(`No CSV file found for state: ${state}`);
  }

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
          let filteredData;
          if (infoType === 'Department of Transport and Main Roads') {
            filteredData = results.data.filter(row => 
              row.department && row.department.toLowerCase().includes('transport and main roads')
            );
          } else {
            filteredData = results.data.filter(row => 
              row.type && row.type.toLowerCase() === infoType.toLowerCase()
            );
          }
          console.log(`Filtered rows for ${infoType}: ${filteredData.length}`);
          const processedData = filteredData.map(row => ({
            name: row.name || 'N/A',
            budget: row.budget || 'N/A',
            year: row.year || 'N/A',
            department: row.department || 'N/A'
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