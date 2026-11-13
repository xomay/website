import './gaze.js';
import './anatomy-reveal.js';

const areas = {
  brain: ['Brain', 'Cerveau', 'How can brain images and signals help us understand neurological disease?', 'Que peuvent nous apprendre les images et signaux cérébraux sur les maladies neurologiques ?'],
  lungs: ['Lungs', 'Poumons', 'I’m interested in what machine learning can reveal in chest images.', 'Je m’intéresse à ce que l’apprentissage automatique peut révéler sur les images thoraciques.'],
  heart: ['Heart', 'Cœur', 'I’d like to explore how models learn from physiological signals over time.', 'J’aimerais explorer comment les modèles apprennent à partir de signaux physiologiques dans le temps.'],
  clipboard: ['Clipboard', 'Plaquette', 'Engineering projects beyond medicine.', 'Mes projets d’ingénierie hors médecine.']
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
    const clipboard = area === 'clipboard';
    document.querySelector('#zone-state').textContent = clipboard ? '' : (french ? 'Aucun projet publié pour le moment.' : 'No project published yet.');
    document.querySelector('#zone-project').hidden = !clipboard;
  }
  window.dispatchEvent(new CustomEvent('highlight', {detail:area}));
  window.dispatchEvent(new Event('annotations-resize'));
}
function visitFlower() {
  const project = document.querySelector('#flower');
  project.open = true;
  project.querySelector('summary').focus({preventScroll:true});
  project.scrollIntoView({block:'center'});
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) project.animate([{background:'#c4d8ff'},{background:'#eff4ff'}], {duration:950});
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
  visitFlower();
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
