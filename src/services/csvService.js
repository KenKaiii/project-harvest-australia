// This is a mock service. In the future, this will be replaced with actual CSV processing logic.
export const extractProjectData = async (state, infoType) => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data
  const mockData = [
    { name: "Project A", budget: "$1,000,000", year: "24-25" },
    { name: "Project B", budget: "$2,500,000", year: "25-26" },
    { name: "Project C", budget: "$750,000", year: "24-25" },
  ];

  return mockData;
};