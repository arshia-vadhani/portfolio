// Import the necessary functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Fetch project data from the projects.json file
async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        
        // Select the projects container in the HTML
        const projectsContainer = document.querySelector('.projects');
        
        // Render the projects with <h2> headings
        renderProjects(projects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call the loadProjects function to fetch and render the data
loadProjects();
