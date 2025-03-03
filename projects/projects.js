// import { fetchJSON, renderProjects } from '../global.js';
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// // Fetch projects data and set up the container
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

// // Set up arc and pie generators
// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// let sliceGenerator = d3.pie().value(d => d.value);

// // Set up the colors for the pie chart
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// // Function to create the pie chart and update the legend
// function createPieChart(data) {
//     // ... (keep the existing createPieChart function as is)
// }

// // Helper function to update selection styles on both the pie chart and legend
// function updateSelection(svg, selectedIndex) {
//     // ... (keep the existing updateSelection function as is)
// }

// // Helper function to filter and render projects based on the selected year
// function updateProjects(selectedIndex, data) {
//     // ... (keep the existing updateProjects function as is)
// }

// // Aggregate project data by year
// let aggregatedData = d3.rollups(
//     projects,
//     (v) => v.length,
//     (d) => d.year
// ).map(([year, count]) => ({ value: count, label: year }));

// // Render the initial pie chart
// createPieChart(aggregatedData);

// // Search functionality
// let query = '';
// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('input', (event) => {
//     query = event.target.value.toLowerCase();

//     let filteredProjects = projects.filter((project) => {
//         let values = Object.values(project).join('\n').toLowerCase();
//         return values.includes(query);
//     });

//     // Filter the projects based on the pie selection if there's any
//     let selectedIndex = d3.select("#projects-pie-plot").selectAll("path.selected").empty() ? -1 : 
//         d3.select("#projects-pie-plot").selectAll("path").nodes().findIndex(node => node.classList.contains("selected"));
    
//     if (selectedIndex !== -1) {
//         let selectedYear = aggregatedData[selectedIndex]?.label;
//         filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
//     }

//     renderProjects(filteredProjects, projectsContainer, 'h2');

//     let filteredData = d3.rollups(
//         filteredProjects,
//         (v) => v.length,
//         (d) => d.year
//     ).map(([year, count]) => ({ value: count, label: year }));

//     createPieChart(filteredData); // Re-render pie chart with filtered data
// });






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
function renderPieChart(projectsGiven) {
    // Clear previous elements
    d3.select("#projects-pie-plot").selectAll("*").remove();
    d3.select(".legend").selectAll("*").remove();

    // Re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    // Re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // Re-calculate slice generator and arc data
    let newSliceGenerator = d3.pie().value(d => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map(d => arcGenerator(d));

    const svg = d3.select("#projects-pie-plot");

    // Create pie chart paths (wedges)
    newArcs.forEach((arc, idx) => {
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors(idx))
            .style("cursor", "pointer")
            .on("click", () => {
                let selectedIndex = d3.select(this).classed("selected") ? -1 : idx;
                updateSelection(svg, selectedIndex);
                updateProjects(selectedIndex, newData);
            });
    });

    // Create the legend
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', function () {
                let selectedIndex = d3.select(this).classed("selected") ? -1 : idx;
                updateSelection(svg, selectedIndex);
                updateProjects(selectedIndex, newData);
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

// Call this function on page load
renderPieChart(projects);

// Search functionality
let query = '';
let searchInput = document.querySelector('.searchBar');

function setQuery(value) {
    query = value.toLowerCase();
    return projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });
}

searchInput.addEventListener('input', (event) => {
    let filteredProjects = setQuery(event.target.value);
    // Re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

