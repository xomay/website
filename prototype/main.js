import './gaze.js';
import './anatomy-reveal.js';
import './character-life.js';
import { refreshThemeLabel } from './theme.js';

const areas = {
  brain: ['Tumorstral', 'Tumorstral', 'Forecasting tumour growth with mechanistic models and zero-shot Timestral.', 'Prévision de croissance tumorale avec des modèles mécanistes et Timestral en zéro-shot.'],
  lungs: ['Hailth', 'Hailth', 'Multi-label classification of 14 thoracic findings in chest X-rays with PyTorch.', 'Classification multi-label de 14 observations thoraciques sur radiographies avec PyTorch.'],
  heart: ['Heart', 'Cœur', 'I’d like to explore how models learn from physiological signals over time.', 'J’aimerais explorer comment les modèles apprennent à partir de signaux physiologiques dans le temps.'],
  clipboard: ['Clipboard', 'Plaquette', 'Engineering projects beyond medicine.', 'Mes projets d’ingénierie hors médecine.']
};
const projectsByArea = {
  brain: { id: 'tumorstral', name: 'Tumorstral' },
  lungs: { id: 'hailth', name: 'Hailth' },
  clipboard: { id: 'flower', name: 'Flower' },
};
const buttons = [...document.querySelectorAll('[data-zone]')];
const preview = document.querySelector('#preview');
const languageButton = document.querySelector('#language');
const translated = [...document.querySelectorAll('[data-fr]')].map(el => [el, el.textContent]);
let french = false;
let active = null;
let pinned = false;

function display(area) {
  active = area;
  preview.dataset.zone = area || '';
  preview.hidden = !area;
  for (const button of buttons) {
    const selected = button.dataset.zone === area;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-expanded', String(selected));
    button.setAttribute('aria-controls', 'preview');
  }
  if (area) {
    const text = areas[area];
    document.querySelector('#zone-title').textContent = text[french ? 1 : 0];
    document.querySelector('#zone-copy').textContent = text[french ? 3 : 2];
    const project = projectsByArea[area];
    const link = document.querySelector('#zone-project');
    const state = document.querySelector('#zone-state');
    state.hidden = !!project;
    state.textContent = project
      ? ''
      : (french ? 'Aucun projet publié pour le moment.' : 'No project published yet.');
    link.hidden = !project;
    if (project) {
      link.href = '#' + project.id;
      document.querySelector('#zone-project-label').textContent = project.name;
    } else link.removeAttribute('href');
  }
  window.dispatchEvent(new CustomEvent('highlight', {detail:area}));
  window.dispatchEvent(new Event('annotations-resize'));
}
function visitProject(id) {
  const project = document.getElementById(id);
  if (!project) return;
  project.open = true;
  project.querySelector('summary').focus({preventScroll:true});
  project.scrollIntoView({block:'center'});
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = getComputedStyle(project);
    project.animate([{ background: style.getPropertyValue('--project-flash') }, { background: style.backgroundColor }], { duration: 950 });
  }
  display(null);
  pinned = false;
}
let closeTimer;
function cancelClose() {
  clearTimeout(closeTimer);
}
function scheduleClose() {
  cancelClose();
  closeTimer = setTimeout(() => {
    if (!pinned && !preview.matches(':hover') && !preview.contains(document.activeElement)) display(null);
  }, 350);
}
function showArea(area) {
  cancelClose();
  display(area);
}
function activate(area) {
  pinned = !!area;
  showArea(area);
}
for (const button of buttons) {
  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') {
      pinned = false;
      showArea(button.dataset.zone);
    }
  });
  button.addEventListener('pointerleave', scheduleClose);
  button.addEventListener('focus', () => showArea(button.dataset.zone));
  button.addEventListener('click', () => activate(button.dataset.zone));
}
window.addEventListener('organ-hover', event => {
  if (event.detail) {
    pinned = false;
    showArea(event.detail);
  } else scheduleClose();
});
window.addEventListener('organ-pick', event => activate(event.detail));
preview.addEventListener('pointerenter', cancelClose);
preview.addEventListener('pointerleave', scheduleClose);
preview.addEventListener('focusin', cancelClose);
preview.addEventListener('focusout', scheduleClose);
document.querySelector('#zone-project').addEventListener('click', event => {
  event.preventDefault();
  visitProject(event.currentTarget.hash.slice(1));
});
function dismiss() {
  cancelClose();
  const previous = active;
  if (preview.contains(document.activeElement)) buttons.find(button => button.dataset.zone === previous)?.focus();
  pinned = false;
  display(null);
}
document.querySelector('#dismiss').onclick = dismiss;
document.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
document.querySelector('.hero').addEventListener('pointerleave', scheduleClose);
languageButton.onclick = () => {
  french = !french;
  document.documentElement.lang = french ? 'fr' : 'en';
  refreshThemeLabel();
  languageButton.textContent = french ? 'EN' : 'FR';
  languageButton.setAttribute('aria-label', french ? 'Switch to English' : 'Afficher en français');
  for (const [el,en] of translated) el.textContent = french ? el.dataset.fr : en;
  document.querySelector('#dismiss').setAttribute('aria-label',french ? 'Fermer' : 'Close');
  display(active);
  for (const button of document.querySelectorAll('[data-anatomy-zone]')) {
    button.setAttribute('aria-label', french ? button.dataset.labelFr : button.dataset.labelEn);
  }
  window.dispatchEvent(new Event('annotations-resize'));
};
display(null);
