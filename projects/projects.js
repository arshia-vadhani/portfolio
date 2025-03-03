import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch projects data and set up the container
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2'); // Initial render

// Set up arc and pie generators
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().value(d => d.value);

// Set up colors for the pie chart
const colors = d3.scaleOrdinal(d3.schemeTableau10);

// Function to render the pie chart and legend
function renderPieChart(projectsGiven) {
    // Clear previous elements
    d3.select("#projects-pie-plot").selectAll("*").remove();
    d3.select(".legend").selectAll("*").remove();

    // Re-calculate rolled-up data by year
    const rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    // Transform rolled-up data into a format suitable for D3
    const data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    // Generate arcs from the data
    const arcData = sliceGenerator(data);

    // Select SVG container for pie chart
    const svg = d3.select("#projects-pie-plot");

    // Create pie chart paths (wedges)
    arcData.forEach((d, idx) => {
        svg.append("path")
            .attr("d", arcGenerator(d))
            .attr("fill", colors(idx))
            .style("cursor", "pointer")
            .on("click", () => {
                // Filter projects by selected year
                const selectedYear = data[idx].label;
                const filteredProjects = projectsGiven.filter(
                    project => project.year === selectedYear
                );

                // Update both the project list and pie chart based on selection
                renderProjects(filteredProjects, projectsContainer, 'h2');
                renderPieChart(filteredProjects);
            });
    });

    // Create the legend
    const legend = d3.select(".legend");
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on("click", () => {
                // Filter projects by selected year via legend click
                const selectedYear = d.label;
                const filteredProjects = projectsGiven.filter(
                    project => project.year === selectedYear
                );

                // Update both the project list and pie chart based on selection
                renderProjects(filteredProjects, projectsContainer, 'h2');
                renderPieChart(filteredProjects);
            });
    });
}

// Function to handle search input and filter projects
let query = '';
let searchInput = document.querySelector('.searchBar');

// Add event listener for search input
searchInput.addEventListener('change', (event) => {
  // Update query value
  query = event.target.value;
  
  // Filter projects based on search query (case-insensitive, search across all metadata)
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join(' ').toLowerCase(); // Join all values of a project and make case-insensitive
    return values.includes(query.toLowerCase()); // Filter based on query
  });

  // Render filtered projects in the container
  renderProjects(filteredProjects, projectsContainer, 'h2');

  // Update pie chart and legend based on filtered projects
  renderPieChart(filteredProjects);
});

// Initial rendering of pie chart with all projects
renderPieChart(projects);

