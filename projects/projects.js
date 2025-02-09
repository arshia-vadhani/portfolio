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

let projects = [];
let filteredProjects = [];
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
  d3.select('.legend').html('');

  // Update paths
  svg.selectAll('path')
    .data(newArcs)
    .enter()
    .append('path')
    .attr('d', d => d)
    .attr('fill', (d, i) => colorScale(i));

  // Update legend
  let legend = d3.select('.legend');
  newData.forEach((d, i) => {
    legend.append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colorScale(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

function setQuery(query) {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
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
      filteredProjects = setQuery(event.target.value);
      renderProjects(filteredProjects, projectsContainer, 'h2');
      renderPieChart(filteredProjects);
    });

  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);