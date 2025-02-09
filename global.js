// console.log('ALIVE');
// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }


// function init() {
//   // Create and insert navigation bar
//   const ARE_WE_HOME = document.documentElement.classList.contains('home');
// }
// let pages = [
//   { url: '', title: 'Home' },
//   { url: 'projects/', title: 'Projects' },
//   { url: 'contact/', title: 'Contact' },
//   { url: 'CV/', title: 'CV' },
//   { url: 'https://github.com/arshia-vadhani', title: 'Github', external: true }
// ];

// let nav = document.createElement('nav');
// nav.classList.add('topnav');
// document.body.prepend(nav);

// for (let p of pages) {
//   let url = p.url;
//   let title = p.title;

//   if (!ARE_WE_HOME && !url.startsWith('http')) {
//     url = '../' + url;
//   }

//   let a = document.createElement('a');
//   a.href = url;
//   a.textContent = title;

//   a.classList.toggle(
//     'current',
//     a.host === location.host && a.pathname === location.pathname
//   );
//   a.target = a.host !== location.host ? '_blank' : '_self';
//   nav.append(a);
//   }



//   // Insert theme selector
//   document.body.insertAdjacentHTML(
//     'afterbegin',
//     `<label class="color-scheme">
//         Theme:
//         <select id="theme-selector">
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//             <option value="automatic">Automatic</option>
//         </select>
//     </label>`
//   );

//   const select = document.querySelector('#theme-selector');

//   const savedTheme = localStorage.getItem('color-scheme') || 'automatic';
//   document.documentElement.style.setProperty('color-scheme', savedTheme)


// select.value = savedColorScheme;


// select.addEventListener('input', function (event) {
//   const newColorScheme = event.target.value;

//   console.log('Color scheme changed to', newColorScheme);


//   document.documentElement.style.setProperty('color-scheme', newColorScheme);


//   localStorage.setItem('colorScheme', newColorScheme);
// });

//   select.value = savedTheme

//   const themeToggle = document.getElementById('theme-toggle');
//   if (themeToggle) {
//     themeToggle.addEventListener('click', () => {
//       const newTheme =
//         document.documentElement.getAttribute('data-theme') === 'light'
//           ? 'dark'
//           : 'light';
//       applyTheme(newTheme);
//     });
//   }

//   // Adjust navigation links
//   const isHomepage = document.body.classList.contains('home');
//   document.querySelectorAll('nav a').forEach(link => {
//     if (!isHomepage && link.getAttribute('href') === 'index.html') {
//       link.setAttribute('href', './');
//     }
//   });
// }

// function applyTheme(theme) {
//   document.documentElement.setAttribute('data-theme', theme);
//   localStorage.setItem('theme', theme);
// }

// // // Ensure the script runs regardless of when DOMContentLoaded is fired
// // if (document.readyState === 'loading') {
// //   document.addEventListener('DOMContentLoaded', init);
// // } else {
// //   init();
// // }

// // export async function fetchJSON(url) {
// //   try {
// //     const response = await fetch(url);
// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch projects: ${response.statusText}`);
// //     }
// //     return await response.json();
// //   } catch (error) {
// //     console.error('Error fetching or parsing JSON data:', error);
// //   }
// // }

// // export function renderProjects(projects, containerElement, headingLevel = 'h2') {
// // containerElement.innerHTML = '';
// // projects.forEach(project => {
// //   const article = document.createElement('article');
// //   const heading = document.createElement(headingLevel);
// //   heading.textContent = project.title;
// //   article.innerHTML = `
// //     ${heading.outerHTML}
// //     <img src="${project.image}" alt="${project.title}">
// //     <p>${project.description}</p>
// //   `;
// //   containerElement.appendChild(article);
// // });
// // }



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
        <option value="auto">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

  const select = document.querySelector('#theme-switcher');

  const savedColorScheme = localStorage.getItem('colorScheme') || 'auto';


document.documentElement.style.setProperty('color-scheme', savedColorScheme);


select.value = savedColorScheme;


select.addEventListener('input', function (event) {
  const newColorScheme = event.target.value;

  console.log('Color scheme changed to', newColorScheme);


  document.documentElement.style.setProperty('color-scheme', newColorScheme);


  localStorage.setItem('colorScheme', newColorScheme);
});