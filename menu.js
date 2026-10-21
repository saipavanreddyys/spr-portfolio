const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-items');

function closeMenu() {
  button?.setAttribute('aria-expanded', 'false');
  button?.setAttribute('aria-label', 'Open navigation');
  links?.classList.remove('open');
}

button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  button.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  links?.classList.toggle('open', !open);
});
links?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
