const character = document.querySelector('.gaze-character');
const eyes = [...character.querySelectorAll('.eye')];
const stage = document.querySelector('#stage');
const hero = stage.closest('.hero');
const connections = hero.querySelector('.connections');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const image = character.querySelector('img');
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let frame = 0;

function paint() {
  frame = 0;
  current.x += (target.x - current.x) * .17;
  current.y += (target.y - current.y) * .17;
  for (const eye of eyes) {
    // Bounds are relative to the displayed eye, so the same range works on mobile.
    eye.style.setProperty('--look-x', (current.x * eye.clientWidth * .14).toFixed(3) + 'px');
    eye.style.setProperty('--look-y', (current.y * eye.clientHeight * .10).toFixed(3) + 'px');
  }
  if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > .001) schedule();
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(paint);
}
function reset() {
  target.x = target.y = 0;
  schedule();
}
function preferencesChanged() {
  target.x = target.y = current.x = current.y = 0;
  schedule();
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reducedMotion.matches || !finePointer.matches) return;
  const rect = character.getBoundingClientRect();
  const eyeX = rect.left + rect.width * .514;
  const eyeY = rect.top + rect.height * .24;
  const dx = (event.clientX - eyeX) / (rect.width * .75);
  const dy = (event.clientY - eyeY) / (rect.height * .35);
  const distance = Math.max(1, Math.hypot(dx, dy));
  target.x = dx / distance;
  target.y = dy / distance;
  schedule();
}, { passive: true });
document.documentElement.addEventListener('pointerleave', reset);
window.addEventListener('blur', reset);
document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
reducedMotion.addEventListener('change', preferencesChanged);
finePointer.addEventListener('change', preferencesChanged);

// Keep the existing navigation labels aligned with the new fixed character.
const landmarks = {
  brain: [.50, .137],
  lungs: [.425, .61],
  heart: [.585, .63],
  clipboard: [.23, .76],
};
function alignAnnotations() {
  const portrait = character.getBoundingClientRect();
  const base = hero.getBoundingClientRect();
  const explorer = hero.querySelector('.explorer');
  if (matchMedia('(max-width:800px)').matches) {
    explorer.style.top = (stage.getBoundingClientRect().top - base.top + stage.clientHeight * .13) + 'px';
  } else explorer.style.top = '';
  connections.replaceChildren();
  for (const [name, [x, y]] of Object.entries(landmarks)) {
    const label = hero.querySelector('[data-zone="' + name + '"]').getBoundingClientRect();
    const startX = portrait.left - base.left + portrait.width * x;
    const startY = portrait.top - base.top + portrait.height * y;
    const endX = label.left - base.left;
    const endY = label.top - base.top + label.height / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M ' + startX + ' ' + startY + ' H ' + (endX - 25) + ' L ' + endX + ' ' + endY);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', startX);
    dot.setAttribute('cy', startY);
    dot.setAttribute('r', '3');
    connections.append(path, dot);
  }
  schedule();
}
new ResizeObserver(alignAnnotations).observe(hero);
window.addEventListener('annotations-resize', alignAnnotations);
document.fonts.ready.then(alignAnnotations);
if (image.complete) alignAnnotations();
else image.addEventListener('load', alignAnnotations, { once: true });
