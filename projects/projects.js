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
let selectedIndex = -1; 
let query = ''; 
let newData = []; // Store globally
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function renderPieChart(projectsGiven) {
  // Aggregate data by year and count projects per year
  newData = d3.rollups(projectsGiven, v => v.length, d => d.year).map(([year, count]) => ({
    value: count,
    label: year
  }));

  let newSliceGenerator = d3.pie().value(d => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map(d => arcGenerator(d));

  let svg = d3.select('svg');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.html(''); // Clear previous legend
  
  // Add legend items dynamically based on new data
  newData.forEach((d, idx) => {
    // Create <li> items for the legend
    legend.append('li')
      .attr('style', `--color:${colorScale(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        selectedIndex = selectedIndex === newData.findIndex(item => item.label === d.label) ? -1 : newData.findIndex(item => item.label === d.label);
        applyFilters();
      });
  });

  svg.selectAll('path')
    .data(newArcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (_, i) => colorScale(i))
    .attr('class', (d, i) => (i === selectedIndex ? 'selected' : ''))
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      selectedIndex = selectedIndex === newData.findIndex(item => item.label === d.data.label) ? -1 : newData.findIndex(item => item.label === d.data.label);
      applyFilters();
    })
    .on('mouseover', (event, d) => {
      // Add hover effect: fade out all other wedges
      svg.selectAll('path')
        .style('opacity', 0.5);
      d3.select(event.target)
        .style('opacity', 1); // Keep hovered path fully visible
    })
    .on('mouseout', () => {
      svg.selectAll('path').style('opacity', 1); // Reset opacity on mouse out
    })
    .transition()
    .duration(300)
    .style('transition', 'opacity 300ms');

  // Apply highlighting for selected wedge
  d3.selectAll('.selected')
    .style('fill', '--color: oklch(60% 45% 0) !important;');
}

function applyFilters() {
  const projectsContainer = document.querySelector('.projects');

  filteredProjects = projects.filter((project) => {
    let matchesQuery = Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
    let matchesYear = selectedIndex === -1 || project.year === newData[selectedIndex]?.label;
    return matchesQuery && matchesYear;
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);

  // Update project count
  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent = `Projects (${filteredProjects.length})`;
  }
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
    });

  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
