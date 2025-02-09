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
let projects = await fetchJSON('./lib/projects.json');
let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year
  );
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // Create a color scale
  let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Create arc generator
  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);
  
  // Create slice generator
  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map(d => arcGenerator(d));
  
d3.select('svg')
.selectAll('path')
.data(arcs)
.enter()
.append('path')
.attr('d', d => d)
.attr('fill', (d, i) => colorScale(i));
let legend = d3.select('.legend');
legend.selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('class', 'legend-item')
    .attr('style', (d, i) => `--color:${colorScale(i)}`)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  