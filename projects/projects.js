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


import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = [];
let filteredProjects = [];
let selectedIndex = -1; // Initialize selectedIndex for highlighting
let query = ''; // Initialize search query
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value(d => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map(d => arcGenerator(d));

  // Clear existing paths and legend
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.html('');

  // Update paths with click functionality for filtering
  svg.selectAll('path')
    .data(newArcs)
    .enter()
    .append('path')
    .attr('d', d => d)
    .attr('fill', (d, i) => colorScale(i))
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''))
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      applyFilters();
      renderPieChart(filteredProjects);
    });

  // Update legend with click functionality for filtering
  legend.selectAll('li')
    .data(newData)
    .enter()
    .append('li')
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''))
    .attr('style', (d, i) => `--color:${colorScale(i)}`)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      applyFilters();
       renderPieChart(filteredProjects);
    });
}

function applyFilters() {
  const projectsContainer = document.querySelector('.projects');

  // Filter projects by both query and selected year
  filteredProjects = projects.filter((project) => {
    let matchesQuery = Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
    let matchesYear = selectedIndex === -1 || project.year === newData[selectedIndex]?.label;
    return matchesQuery && matchesYear;
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
   renderPieChart(filteredProjects);
}

async function init() {
  try {
    projects = await fetchJSON('../lib/projects.json');
    filteredProjects = projects;

    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');
    const searchInput = document.querySelector('.searchBar');

    renderProjects(projects, projectsContainer, 'h2');
    if (projectsTitle) {
      projectsTitle.textContent += ` (${projects.length})`;
    }

    renderPieChart(projects);

    searchInput.addEventListener('input', (event) => {
      query = event.target.value.toLowerCase();
      applyFilters();
     renderPieChart(filteredProjects);
    });

  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
