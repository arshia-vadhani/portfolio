console.log('IT’S ALIVE!');
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Theme handling code remains here
if ('colorScheme' in localStorage) {
  const savedColorScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedColorScheme);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `<label class="color-scheme">
      Theme:
      <select id="theme-selector">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="automatic">Automatic</option>
      </select>
  </label>`
);

const select = document.querySelector('.color-scheme select');
select.addEventListener('input', function (event) {
  const newColorScheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', newColorScheme);
  localStorage.colorScheme = newColorScheme;
  console.log('Color scheme changed to:', newColorScheme);
});

document.addEventListener('DOMContentLoaded', function () {
  const ARE_WE_HOME = document.documentElement.classList.contains('home');

  let pages = [
      { url: '', title: 'Home' },
      { url: 'projects/', title: 'Projects' },
      { url: 'contact/', title: 'Contact' },
      { url: 'CV/', title: 'CV'},
      { url: 'https://github.com/arshia-vadhani', title: 'Github', external: true }
  ];

  let nav = document.createElement('nav');
  document.body.prepend(nav);

  for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname
    );
    if (p.external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    nav.append(a);
  }
});

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
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear the existing content of the container element only once
  containerElement.innerHTML = '';

  // Loop through each project and create its corresponding element
  projects.forEach(project => {
      // Create a new <article> element for the project
      const article = document.createElement('article');

      // Dynamically set the heading level using the headingLevel parameter
      const heading = document.createElement(headingLevel);  // Create the dynamic heading element
      heading.textContent = project.title;  // Set the project title

      // Populate the <article> element with dynamic content using innerHTML
      article.innerHTML = `
          ${heading.outerHTML}  <!-- Insert the dynamic heading here -->
          <img src="${project.image}" alt="${project.title}">
          <p>${project.description}</p>
      `;

      // Append the article element to the container
      containerElement.appendChild(article);
  });
}
async function fetchJSON(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching JSON:', error);
      return null;
  }
}

// Function to render projects
function renderProjects(projects) {
  const projectsContainer = document.querySelector('.projects');
  if (!projectsContainer) return;

  projectsContainer.innerHTML = '';
  projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project');
      projectElement.innerHTML = `
          <h2>${project.name}</h2>
          <p>${project.description}</p>
      `;
      projectsContainer.appendChild(projectElement);
  });
}

// Function to handle theme switching and persistence
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  document.getElementById('theme-toggle').addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
  });

  // Adjust navigation links
  const isHomepage = document.body.classList.contains('home');
  document.querySelectorAll('nav a').forEach(link => {
      if (!isHomepage && link.getAttribute('href') === 'index.html') {
          link.setAttribute('href', './');
      }
  });
});

export { fetchJSON, renderProjects };



