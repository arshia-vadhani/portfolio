import { fetchJSON, renderProjects } from './global.js';
const projects = await fetchJSON('./lib/projects.json'); // Select the container for displaying projects
const latestProjects = projects.slice(0, 3);
renderProjects(latestProjects, projectsContainer, 'h2');
