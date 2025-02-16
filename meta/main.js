const width = 1000;
const height = 600

let data = [];
let commits = d3.groups(data, (d) => d.commit);

// Define the function to load and convert the CSV data
async function loadData() {
  data = await d3.csv('./loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // Convert line to a number
    depth: Number(row.depth), // Convert depth to a number
    length: Number(row.length), // Convert length to a number
    date: new Date(row.date + 'T00:00' + row.timezone), // Convert date and timezone
    datetime: new Date(row.datetime), // Convert datetime
  }));

  processCommits();  // Ensure commits are populated before displaying stats
  displayStats();
  
  // Call the createScatterplot function after data is loaded



}


function processCommits() {
    commits = d3.groups(data, (d) => d.commit)
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
          writable: false,
          enumerable: false,
          configurable: false,

        });
  
        return ret;
      });

  }
  
function createScatterplot() {
// Create the SVG element
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

// Create the scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, 24]) // From 0 to 24 hours of the day
    .range([height, 0]);

// Draw the scatterplot (dots)
  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))  // X position based on datetime
    .attr('cy', (d) => yScale(d.hourFrac))  // Y position based on hour of the day
    .attr('r', 5)  // Radius of the circle
    .attr('fill', 'steelblue');  // Fill color for the circles
  
  
    dots
    .on('mouseenter', (event, commit) => {
      updateTooltipContent(commit);
      updateTooltipVisibility(true);
    })
    .on('mouseleave', () => {
      updateTooltipContent({});
      updateTooltipVisibility(false);
    });
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };
  
  // Update scales with new ranges
  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
  .axisLeft(yScale)
  .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

// Add X axis
  svg
  .append('g')
  .attr('transform', `translate(0, ${usableArea.bottom})`)
  .call(xAxis);

// Add Y axis
  svg
  .append('g')
  .attr('transform', `translate(${usableArea.left}, 0)`)
  .call(yAxis);

  const gridlines = svg
  .append('g')
  .attr('class', 'gridlines')
  .attr('transform', `translate(${usableArea.left}, 0)`);

// Create gridlines as an axis with no labels and full-width ticks
gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
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
    dl.append('dd').text(numFiles);

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


function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const author = document.getElementById('commit-author');
    const lines = document.getElementById('commit-lines');
    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime?.toLocaleString('en', {
      dateStyle: 'full',
    });
    author.textContent = commit.author;

    // Update lines edited
   
    lines.textContent = commit.totalLines;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData(); // Wait for the data to load before proceeding
    createScatterplot();
  });

