const loader = document.querySelector('.loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 650));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const cursor = document.querySelector('.cursor');
let pointerX = -100, pointerY = -100, cursorX = -100, cursorY = -100;
window.addEventListener('pointermove', (event) => { pointerX = event.clientX; pointerY = event.clientY; });
function animateCursor() {
  cursorX += (pointerX - cursorX) * .16;
  cursorY += (pointerY - cursorY) * .16;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('.project').forEach((project) => {
  project.addEventListener('pointerenter', () => cursor.classList.add('show'));
  project.addEventListener('pointerleave', () => cursor.classList.remove('show'));
});

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const rect = item.getBoundingClientRect();
    item.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .18}px, ${(event.clientY - rect.top - rect.height / 2) * .18}px)`;
  });
  item.addEventListener('pointerleave', () => item.style.transform = '');
});

const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
});
nav.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = 'Menu';
}));
