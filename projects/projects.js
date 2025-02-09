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
document.addEventListener('DOMContentLoaded', loadProjects);
let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
  ];

  // Create a color scale
  let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Create arc generator
  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);
  
  // Create slice generator
  let sliceGenerator = d3.pie().value((d) => d.value);
  
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

d3.select('svg')
  .selectAll('path')
  .data(arcs)
  .enter()
  .append('path')
  .attr('d', d => d)
  .attr('fill', (d, i) => colorScale(i));
  let legend = d3.select('.legend');
  data.forEach((d, idx) => {
      legend.append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colorScale(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
  