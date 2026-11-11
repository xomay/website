const avatar = document.getElementById('avatar');
const controls = avatar.querySelector('.avatar-controls');
const panel = document.getElementById('area-panel');
const title = document.getElementById('area-title');
const empty = panel.querySelector('.area-empty');
const list = panel.querySelector('.project-list');
const catalogue = document.querySelector('#projects .project-list');
let selected;

function closePanel() {
  panel.hidden = true;
  selected.setAttribute('aria-expanded', 'false');
  selected.focus();
  selected = undefined;
}

function openPanel(button) {
  selected?.setAttribute('aria-expanded', 'false');
  selected = button;
  button.setAttribute('aria-expanded', 'true');
  title.textContent = button.textContent;

  const area = button.dataset.area;
  const selector = area === 'briefcase'
    ? '[data-category="non-medical"]'
    : `[data-category="medical"][data-organs~="${CSS.escape(area)}"]`;
  const entries = Array.from(catalogue.querySelectorAll(selector), entry => entry.cloneNode(true));
  list.replaceChildren(...entries);
  list.hidden = entries.length === 0;
  empty.hidden = entries.length > 0;
  panel.hidden = false;
  title.focus();
}

for (const button of controls.querySelectorAll('button')) {
  button.addEventListener('click', () => {
    if (button === selected) closePanel();
    else openPanel(button);
  });
}

panel.querySelector('.area-close').addEventListener('click', closePanel);
avatar.addEventListener('keydown', event => {
  if (event.key === 'Escape' && selected) {
    event.preventDefault();
    closePanel();
  }
});
controls.hidden = false;
document.getElementById('avatar-instructions').hidden = false;
