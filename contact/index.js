import { fetchJSON, renderProjects } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('.projects'); // The container to display projects
  
    try {
      // Fetch the project data
      const projects = await fetchJSON('./projects.json'); // Update with the correct path to your JSON data file
  
      // Check if the projects data is valid
      if (projects && projects.length > 0) {
        // Limit to the first 3 projects
        const latestProjects = projects.slice(0, 3);
  
        // Render the first 3 projects using the reusable renderProjects function
        renderProjects(latestProjects, projectsContainer, 'h3');
      } else {
        console.error('No projects found in the data.');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  });
  