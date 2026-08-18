const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const boot = $('.boot');
const bootNumber = $('.boot-status b');
let bootValue = 0;
const bootTimer = setInterval(() => {
  bootValue = Math.min(100, bootValue + Math.ceil(Math.random() * 13));
  bootNumber.textContent = String(bootValue).padStart(3, '0');
  if (bootValue === 100) clearInterval(bootTimer);
}, 55);
window.addEventListener('load', () => setTimeout(() => boot.classList.add('done'), reduceMotion ? 0 : 800));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
$$('.reveal').forEach((element) => observer.observe(element));

const nav = $('.nav');
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
});
$$('.nav nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
}));

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const now = window.scrollY;
  nav.classList.toggle('nav-hidden', now > lastScroll && now > 180 && !nav.classList.contains('open'));
  nav.classList.toggle('nav-solid', now > 40);
  lastScroll = now;
}, { passive: true });

const cursor = $('.cursor');
let pointerX = -100, pointerY = -100, cursorX = -100, cursorY = -100;
window.addEventListener('pointermove', (event) => { pointerX = event.clientX; pointerY = event.clientY; });
function animateCursor() {
  cursorX += (pointerX - cursorX) * 0.17;
  cursorY += (pointerY - cursorY) * 0.17;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
$$('[data-cursor]').forEach((item) => {
  item.addEventListener('pointerenter', () => {
    cursor.classList.add('show');
    cursor.querySelector('span').textContent = item.dataset.cursor;
  });
  item.addEventListener('pointerleave', () => cursor.classList.remove('show'));
});

$$('.magnetic').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const rect = item.getBoundingClientRect();
    item.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.13}px, ${(event.clientY - rect.top - rect.height / 2) * 0.13}px)`;
  });
  item.addEventListener('pointerleave', () => { item.style.transform = ''; });
});

const canvas = $('#signal-canvas');
const context = canvas.getContext('2d');
let nodes = [];
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  nodes = Array.from({ length: window.innerWidth < 700 ? 18 : 34 }, () => ({
    x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight,
    vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 2 + 0.7
  }));
}
function drawSignal() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  nodes.forEach((node, index) => {
    if (!reduceMotion) {
      node.x += node.vx; node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }
    nodes.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(node.x - other.x, node.y - other.y);
      if (distance < 150) {
        context.strokeStyle = `rgba(241,240,235,${(1 - distance / 150) * 0.14})`;
        context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(other.x, other.y); context.stroke();
      }
    });
    context.fillStyle = index % 9 === 0 ? '#f04a3a' : index % 7 === 0 ? '#3155ff' : 'rgba(241,240,235,.55)';
    context.beginPath(); context.arc(node.x, node.y, node.r, 0, Math.PI * 2); context.fill();
  });
  requestAnimationFrame(drawSignal);
}
resizeCanvas(); drawSignal(); window.addEventListener('resize', resizeCanvas);

const reel = $('#reel');
const openReel = () => {
  reel.showModal(); reel.classList.remove('playing'); requestAnimationFrame(() => reel.classList.add('playing')); document.body.classList.add('dialog-open');
};
const closeReel = () => { reel.close(); reel.classList.remove('playing'); document.body.classList.remove('dialog-open'); };
$$('[data-open-reel]').forEach((button) => button.addEventListener('click', openReel));
$('[data-close-reel]').addEventListener('click', closeReel);
reel.addEventListener('click', (event) => { if (event.target === reel) closeReel(); });

const projects = {
  '01': { index: '01 / AI PLATFORM / 2026', title: 'Neural Shift', lead: 'A living identity for an imagined AI platform—turning invisible intelligence into a responsive, magnetic visual core.', className: 'case-red', visual: '<div class="case-orb"><i></i><i></i><i></i><b>NS</b></div>', facts: [['Role', 'Art direction, design, 3D motion'], ['Idea', 'Intelligence as an evolving field'], ['Outputs', 'Launch film, identity loops, social toolkit']] },
  '02': { index: '02 / SPATIAL COMPUTING / 2026', title: 'Signal / OS', lead: 'A launch world for a spatial operating system where data becomes architecture and every interface has physical presence.', className: 'case-blue', visual: '<div class="case-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div><strong>SIGNAL<br>/OS</strong>', facts: [['Role', 'Creative direction, CGI, motion'], ['Idea', 'Digital space you can almost touch'], ['Outputs', 'Product film, launch assets, motion principles']] },
  '03': { index: '03 / DIGITAL INFRASTRUCTURE / 2025', title: 'Flux Network', lead: 'A kinetic identity for a decentralized network, driven by modular typography, live data and constantly shifting connections.', className: 'case-yellow', visual: '<div class="case-flux">F<span>L</span>U<span>X</span></div>', facts: [['Role', 'Art direction, identity, 2D animation'], ['Idea', 'No center. Constant movement.'], ['Outputs', 'Brand film, kinetic type system, digital campaign']] }
};

const caseDialog = $('#case-dialog');
const caseVisual = $('#case-visual');
$$('[data-project]').forEach((button) => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  caseDialog.className = `case-dialog ${project.className}`;
  $('#case-index').textContent = project.index; $('#case-title').textContent = project.title; $('#case-lead').textContent = project.lead;
  caseVisual.innerHTML = project.visual;
  $('#case-facts').innerHTML = project.facts.map(([label, value]) => `<div><span class="mono">${label}</span><p>${value}</p></div>`).join('');
  caseDialog.showModal(); document.body.classList.add('dialog-open');
}));
const closeCase = () => { caseDialog.close(); document.body.classList.remove('dialog-open'); };
$('.case-close').addEventListener('click', closeCase);
caseDialog.addEventListener('click', (event) => { if (event.target === caseDialog) closeCase(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.body.classList.remove('dialog-open'); });
