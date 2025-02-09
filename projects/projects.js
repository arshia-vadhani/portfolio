// Import the necessary functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Function to load projects from the JSON file
async function loadProjects() {
    try {
        // Fetch project data from the projects.json file
        const projects = await fetchJSON('../lib/projects.json');

        // Check if data was fetched successfully
        if (projects) {
            // Select the container element in the HTML
            const projectsContainer = document.querySelector('.projects');
            
            // Render the projects with <h2> headings
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            console.error('No projects data found');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call the loadProjects function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadProjects);
