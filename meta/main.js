let data = [];

// Define the function to load and convert the CSV data
async function loadData() {
  data = await d3.csv('meta/loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // Convert line to a number
    depth: Number(row.depth), // Convert depth to a number
    length: Number(row.length), // Convert length to a number
    date: new Date(row.date + 'T00:00' + row.timezone), // Convert date and timezone
    datetime: new Date(row.datetime), // Convert datetime
  }));
}

// Wait for the DOM content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', async () => {
  await loadData(); // Wait for the data to load before proceeding
});
