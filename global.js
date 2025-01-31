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

// Navigation code starts here
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
export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Log the fetched data
      console.log("Fetched Data:", data); 

      return data; // Return the fetched JSON data
  } catch (error) {
      console.error("Error fetching or parsing JSON data:", error);
  }
}

// Call the function with the correct path
fetchJSON("lib/projects.json");

