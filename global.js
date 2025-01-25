console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");
console.log(navLinks);
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );
currentLink?.classList.add('current');
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'CV/', title: 'CV'},
    { url: 'https://github.com/arshia-vadhani', title: 'Github' }

  ];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    }
const ARE_WE_HOME = document.documentElement.classList.contains('home');
url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
a.classList.toggle(
  'current',
  a.host === location.host && a.pathname === location.pathname
  );
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select id="theme-selector">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="automatic">Automatic</option>
        </select>
    </label>`
  );

if ('colorScheme' in localStorage) {
  const savedColorScheme = localStorage.colorScheme;

  // Set the color scheme to the saved value
  document.documentElement.style.setProperty('color-scheme', savedColorScheme);

  const select = document.querySelector('.color-scheme select');
  select.value = savedColorScheme;
}

const select = document.querySelector('.color-scheme select');

select.addEventListener('input', function (event) {
  const newColorScheme = event.target.value;
  console.log('Color scheme changed to:', newColorScheme);

  document.documentElement.style.setProperty('color-scheme', newColorScheme);

  localStorage.colorScheme = newColorScheme;
});