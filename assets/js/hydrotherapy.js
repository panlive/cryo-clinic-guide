'use strict';

const programs = [...document.querySelectorAll('#hydro-programs > details')];
const toggle = document.querySelector('#toggle-programs');
const allOpen = () => programs.every(program => program.open);

function syncToggle() {
  toggle.textContent = allOpen() ? 'Свернуть всё' : 'Раскрыть всё';
}

toggle.addEventListener('click', () => {
  const open = !allOpen();
  programs.forEach(program => { program.open = open; });
  syncToggle();
});
programs.forEach(program => program.addEventListener('toggle', syncToggle));
toggle.hidden = false;

function followAnchor() {
  const program = programs.find(item => '#' + item.id === location.hash);
  if (!program) return;
  program.open = true;
  program.scrollIntoView({ block: 'start', behavior: 'instant' });
}

window.addEventListener('hashchange', followAnchor);
window.addEventListener('load', followAnchor, { once: true });
followAnchor();
syncToggle();
