import { fetchJSON, renderProjects } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects'); // Select the container for displaying projects

  try {
    // Fetch the project data from projects.json located in the lib folder
    const projects = await fetchJSON('./lib/projects.json'); 

    // Check if the projects data is valid
    if (projects && projects.length > 0) {
      // Filter the first 3 projects from the fetched data
      const latestProjects = projects.slice(0, 3);

      // Use the renderProjects function to display the filtered projects
      renderProjects(latestProjects, projectsContainer, 'h2');
    } else {
      console.error('No projects found in the data.');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
});
