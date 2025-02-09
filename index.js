import { fetchJSON, renderProjects } from './global.js';
const projects = await fetchJSON('./lib/projects.json'); // Select the container for displaying projects
const latestProjects = projects.slice(0, 3);
renderProjects(latestProjects, projectsContainer, 'h2');
import { fetchGitHubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const githubUsername = 'arshia-vadhani';  // Replace this with your GitHub username
  const followersContainer = document.querySelector('.followers'); // This will be the HTML element where we display the followers count

  try {
    const githubData = await fetchGitHubData(githubUsername);
    if (githubData) {
      const followersCount = githubData.followers;
      
      // Display the followers count
      followersContainer.textContent = `Followers: ${followersCount}`;
    } else {
      console.error('No GitHub data found.');
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }
});