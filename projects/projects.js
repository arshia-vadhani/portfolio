import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadProjects() {
  try {
    // Fetch project data from the JSON file
    const projects = await fetchJSON('../lib/projects.json');

    if (projects) {
      // Select the container element in the HTML
      const projectsContainer = document.querySelector('.projects');
      const projectsTitle = document.querySelector('.projects-title');

      // Render projects with <h2> headings
      renderProjects(projects, projectsContainer, 'h2');

      // Update project count in the title
      if (projectsTitle) {
        projectsTitle.textContent += ` (${projects.length})`;
      }
    } else {
      console.error('No projects data found.');
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Load projects when DOM is fully loaded
let query = '';
let projects = [];
let filteredProjects = [];

// Function to update the chart
function updateChart() {
  let rolledData = d3.rollups(
    filteredProjects,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map(d => arcGenerator(d));

  let paths = d3.select('svg')
    .selectAll('path')
    .data(arcs);

  paths.enter()
    .append('path')
    .merge(paths)
    .attr('d', d => d)
    .attr('fill', (d, i) => colorScale(i));

  paths.exit().remove();

  // Update legend
  let legend = d3.select('.legend');
  let items = legend.selectAll('li')
    .data(data);

  items.enter()
    .append('li')
    .merge(items)
    .attr('class', 'legend-item')
    .attr('style', (d, i) => `--color:${colorScale(i)}`)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);

  items.exit().remove();
}

// Initialize the chart
async function initChart() {
  projects = await fetchJSON('./lib/projects.json');
  filteredProjects = projects;
  updateChart();

  let searchInput = document.querySelector('.searchBar');
  searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();
    filteredProjects = projects.filter((project) => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
    updateChart();
  });
}

// Create arc generator
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

// Create color scale
let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Initialize the chart when the DOM is loaded
document.addEventListener('DOMContentLoaded', initChart);