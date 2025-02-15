import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch projects data and set up the container
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Set up arc and pie generators
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value(d => d.value);

// Set up the colors for the pie chart
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Function to create the pie chart and update the legend
function createPieChart(data) {
    // Clear previous elements
    d3.select("#projects-pie-plot").selectAll("*").remove();
    d3.select(".legend").selectAll("*").remove();

    // Generate arcs from the data
    const arcData = sliceGenerator(data);
    const arcs = arcData.map(d => arcGenerator(d));
    const svg = d3.select("#projects-pie-plot");

    // Initialize selectedIndex as -1 (no selection initially)
    let selectedIndex = -1;

    // Create pie chart paths (wedges)
    arcs.forEach((arc, idx) => {
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors(idx))
            .style("cursor", "pointer")
            .on("click", () => {
                selectedIndex = (selectedIndex === idx) ? -1 : idx;

                // Toggle the 'selected' class on wedges and legend items
                updateSelection(svg, selectedIndex);

                // Filter and render projects based on the selected year
                updateProjects(selectedIndex, data);
            });
    });

    // Create the legend
    let legend = d3.select('.legend');
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', function () {
                selectedIndex = selectedIndex === idx ? -1 : idx;
    
                d3.selectAll('path')
                  .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
    
                d3.selectAll('.legend li')
                  .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
    
                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2'); // Reset projects
                } else {
                    let selectedYear = data[selectedIndex]?.label;
                    let filteredProjects = projects.filter(project => project.year === selectedYear);
                    renderProjects(filteredProjects, projectsContainer, 'h2'); // Filter projects by year
                }
            });
    });
}

// Helper function to update selection styles on both the pie chart and legend
function updateSelection(svg, selectedIndex) {
    svg.selectAll("path")
        .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

    d3.selectAll(".legend li")
        .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));
}

// Helper function to filter and render projects based on the selected year
function updateProjects(selectedIndex, data) {
    const selectedYear = selectedIndex === -1 ? null : data[selectedIndex]?.label;
    const filteredProjects = selectedYear
        ? projects.filter(project => project.year === selectedYear)
        : projects;

    renderProjects(filteredProjects, projectsContainer, "h2");
}

// Aggregate project data by year
let aggregatedData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year
).map(([year, count]) => ({ value: count, label: year }));

// Render the initial pie chart
createPieChart(aggregatedData);

// Search functionality
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });

    // Filter the projects based on the pie selection if there's any
    if (selectedIndex !== -1) {
        let selectedYear = aggregatedData[selectedIndex]?.label;
        filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
    }

    renderProjects(filteredProjects, projectsContainer, 'h2');

    let filteredData = d3.rollups(
        filteredProjects,
        (v) => v.length,
        (d) => d.year
    ).map(([year, count]) => ({ value: count, label: year }));

    createPieChart(filteredData); // Re-render pie chart with filtered data
});
