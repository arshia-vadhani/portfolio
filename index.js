import { fetchJSON, renderProjects } from './global.js';
const projects = await fetchJSON('./lib/projects.json'); // Select the container for displaying projects
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

import { fetchGitHubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const githubUsername = 'arshia-vadhani'; // Replace with your GitHub username
  const profileStats = document.querySelector('#profile-stats'); // The container for displaying the GitHub stats

  try {
    console.log('Fetching GitHub data...');  // Log to confirm the fetch process is starting
    const githubData = await fetchGitHubData(githubUsername);

    // Check if the data is returned
    console.log('GitHub Data:', githubData);

    if (githubData) {
      // Use template literals to display data inside the profileStats container
      profileStats.innerHTML = `
        <h2>GitHub Profile Stats</h2>
        <dl style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
      `;
    } else {
      console.error('No data found');
      profileStats.innerHTML = 'Error loading data.';
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    profileStats.innerHTML = 'Error loading data.';
  }
});

