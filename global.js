console.log('IT IS ALIVE!');
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Theme handling code
if ('colorScheme' in localStorage) {
  const savedColorScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedColorScheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Fetch JSON data
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse and return the JSON data
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// Render projects dynamically
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear existing content
  containerElement.innerHTML = '';

  // Loop through each project and create its corresponding element
  projects.forEach(project => {
    // Create a new <article> element for the project
    const article = document.createElement('article');

    // Dynamically set the heading level using the headingLevel parameter
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;

    // Populate the <article> element with dynamic content using innerHTML
    article.innerHTML = `
      ${heading.outerHTML}
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    // Append the article element to the container
    containerElement.appendChild(article);
  });
}
