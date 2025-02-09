import { fetchJSON, renderProjects } from './global.js';

async function loadLatestProjects() {
  try {
    const projects = await fetchJSON('./lib/projects.json');
    console.log('Fetched projects:', projects); // Debugging log

    if (projects && projects.length > 0) {
      const latestProjects = projects.slice(0, 3); // Get the first 3 projects
      const projectsContainer = document.querySelector('.projects');

      if (projectsContainer) {
        renderProjects(latestProjects, projectsContainer, 'h3');
        console.log('Rendered latest projects'); // Debugging log
      } else {
        console.error('Projects container not found');
      }
    } else {
      console.error('No projects data found or empty array.');
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadLatestProjects);
