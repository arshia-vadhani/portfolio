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
if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
  }
a.classList.toggle(
  'current',
  a.host === location.host && a.pathname === location.pathname
  );