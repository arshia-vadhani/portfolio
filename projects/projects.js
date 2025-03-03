import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch projects data and set up the container
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

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

                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    });

    // Create the legend
    const legend = d3.select(".legend");
    data.forEach((d, idx) => {
        legend.append("li")
            .attr("style", `--color:${colors(idx)}`)
            .attr("class", "legend-item")
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on("click", () => {
                // Filter projects by selected year via legend click
                const selectedYear = d.label;
                const filteredProjects = projectsGiven.filter(
                    project => project.year === selectedYear
                );

                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    });
}

// Function to handle search input and filter projects
function handleSearch(event) {
    const query = event.target.value.toLowerCase();

    // Filter projects based on search query (case-insensitive)
    const filteredProjects = projects.filter((project) => {
        const values = Object.values(project).join(' ').toLowerCase();
        return values.includes(query);
    });

    // Render filtered projects in the container
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // Update pie chart and legend based on filtered projects
    renderPieChart(filteredProjects);
}

// Initial rendering of pie chart with all projects
renderPieChart(projects);

// Add event listener for search input
const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', handleSearch);



