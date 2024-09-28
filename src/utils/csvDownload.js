export const downloadAsCSV = (data, filename) => {
  const csvContent = [
    ['By', 'Project Name', 'Area', 'Budget'],
    ...data.map(item => [item.by, item.name, item.area, item.budget])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};