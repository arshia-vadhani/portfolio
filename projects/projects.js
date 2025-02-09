import { fetchJSON, renderProjects } from '../global.js';

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
