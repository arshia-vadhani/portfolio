let data = [];
let commits = d3.groups(data, (d) => d.commit);

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
  displayStats();

}


function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
      });

  }
  

  function displayStats() {
    // Process commits first
    processCommits();
  
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Add more stats as needed...
    const numFiles = d3.group(data, (d) => d.file).size;
    dl.append('dt').text('Number of files in the codebase');
    dl.append('dd').text(uniqueFiles.size); 

    const maxFileLength = d3.max(data, (d) => d.length);// Assuming 'length' column contains the number of lines per file
    dl.append('dt').text('Maximum file length (lines)');
    dl.append('dd').text(maxFileLength);

    const maxDepth = d3.max(data, (d) => d.depth); // Assuming 'depth' column contains depth info
    dl.append('dt').text('Maximum depth');
    dl.append('dd').text(maxDepth);
    const fileLengths = d3.rollups(
        data,
        (v) => d3.mean(v, (d) => d.length), // Calculate average length for each file
        (d) => d.file
      );
      const avgFileLength = d3.mean(fileLengths, (d) => d[1]);
      dl.append('dt').text('Average file length (lines)');
      dl.append('dd').text(avgFileLength.toFixed(2)); // Display the average file length
    
      // Calculate the average depth (average depth of all files)
      const avgDepth = d3.mean(data, (d) => d.depth); // Average depth across the dataset
      dl.append('dt').text('Average depth');
      dl.append('dd').text(avgDepth.toFixed(2)); // Display the average depth
}

  document.addEventListener('DOMContentLoaded', async () => {
    await loadData(); // Wait for the data to load before proceeding
  });

