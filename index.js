import { fetchGitHubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const githubUsername = 'arshia-vadhani';  // Replace with your GitHub username
  const profileStats = document.querySelector('#profile-stats');  // The container where we’ll display the profile stats

  try {
    // Fetch the data for the specified GitHub user
    const githubData = await fetchGitHubData(githubUsername);
    
    // If the data was successfully fetched
    if (githubData) {
      // Extract relevant stats from the GitHub data
      const followersCount = githubData.followers;
      const publicRepos = githubData.public_repos;
      const followingCount = githubData.following;
      
      // Create a string of stats to display
      const statsHTML = `
        <p>Followers: ${followersCount}</p>
        <p>Following: ${followingCount}</p>
        <p>Public Repositories: ${publicRepos}</p>
      `;

      // Display the stats in the profileStats container
      profileStats.innerHTML = statsHTML;
    } else {
      console.error('No data available for this user.');
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }
});
