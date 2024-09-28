import Papa from 'papaparse';

const stateCSVMap = {
  queensland: 'https://raw.githubusercontent.com/KenKaiii/project-harvest-australia/refs/heads/main/budgets/QLDBudgets.csv',
  // Add other states here as they become available
  // 'new-south-wales': '/budgets/NSWBudgets.csv',
  // 'victoria': '/budgets/VICBudgets.csv',
};

export const extractProjectData = async (state, infoType) => {
  const csvFileUrl = stateCSVMap[state.toLowerCase()];
  
  if (!csvFileUrl) {
    throw new Error(`No CSV file found for state: ${state}`);
  }

  try {
    const response = await fetch(csvFileUrl);
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          const filteredData = results.data.filter(row => 
            row.type && row.type.toLowerCase() === infoType.toLowerCase()
          );
          resolve(filteredData.map(row => ({
            name: row.name || 'N/A',
            budget: row.budget || 'N/A',
            year: row.year || 'N/A'
          })));
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    throw error;
  }
};