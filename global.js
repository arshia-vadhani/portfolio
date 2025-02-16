console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}



const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'CV/', title: 'Resume' },
  { url: 'meta/', title: 'Meta'},
  { url: 'https://github.com/somythl/', title: 'GitHub' },
];

let nav = document.createElement('nav');
nav.classList.add('topnav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;


  if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
  }


  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;


  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );


  a.target = a.host !== location.host ? '_blank' : '_self';


  nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="theme-switcher">
        <option value="automatic">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

  const select = document.querySelector('#theme-switcher');

  const savedColorScheme = localStorage.getItem('color-Scheme') || 'automatic';


document.documentElement.style.setProperty('color-scheme', savedColorScheme);


select.value = savedColorScheme;


select.addEventListener('input', function (event) {
  const newColorScheme = event.target.value;

  console.log('Color scheme changed to', newColorScheme);


  document.documentElement.style.setProperty('color-scheme', newColorScheme);


  localStorage.setItem('colorScheme', newColorScheme);
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
// containerElement.innerHTML = '';
projects.forEach(project => {
  const article = document.createElement('article');
  const heading = document.createElement(headingLevel);
  heading.textContent = project.title;
  const year = document.createElement('p');
  year.classList.add('project-year');
  year.textContent = `Year: ${project.year}`; 
  article.innerHTML = `
    ${heading.outerHTML}
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
  `;
  article.appendChild(year);
  containerElement.appendChild(article);
});
}

// global.js

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
