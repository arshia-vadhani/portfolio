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
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });
let data = [1, 2];
let colors = ['gold', 'purple'];
let total = 0;
for (let d of data) {
  total += d;
}
let angle = 0;
let arcData = data.map(d => {
  let startAngle = angle;
  let endAngle = angle + (d / total) * 2 * Math.PI;
  angle = endAngle;
  return { startAngle, endAngle };
});

// Generate arc paths
let arcs = arcData.map(d => arcGenerator(d));

// Create pie chart
arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors[idx]);
});