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
  brain: [.50, .145],
  lungs: [.425, .61],
  heart: [.575, .61],
  clipboard: [.23, .76],
};
function alignAnnotations() {
  const portrait = character.getBoundingClientRect();
  const base = hero.getBoundingClientRect();
  const explorer = hero.querySelector('.explorer');
  const stageTop = stage.getBoundingClientRect().top - base.top;
  explorer.style.setProperty('--stage-top', stageTop + 'px');
  explorer.style.setProperty('--stage-height', stage.clientHeight + 'px');
  connections.replaceChildren();
  for (const [name, [x, y]] of Object.entries(landmarks)) {
    const label = hero.querySelector('[data-zone="' + name + '"]').getBoundingClientRect();
    const startX = portrait.left - base.left + portrait.width * x;
    const startY = portrait.top - base.top + portrait.height * y;
    const onLeft = label.left + label.width / 2 < portrait.left + portrait.width / 2;
    const endX = (onLeft ? label.right : label.left) - base.left;
    const endY = label.top - base.top + label.height / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M ' + startX + ' ' + startY + ' H ' + (endX + (onLeft ? 25 : -25)) + ' L ' + endX + ' ' + endY);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', startX);
    dot.setAttribute('cy', startY);
    dot.setAttribute('r', '3');
    connections.append(path, dot);
  }
  const preview = hero.querySelector('#preview');
  if (!preview.hidden) {
    const mobile = matchMedia('(max-width:800px)').matches;
    const label = hero.querySelector('.markers [data-zone="' + preview.dataset.zone + '"]').getBoundingClientRect();
    const onLeft = label.left + label.width / 2 < portrait.left + portrait.width / 2;
    const cardWidth = preview.offsetWidth;
    const cardHeight = preview.offsetHeight;
    const left = mobile ? (base.width - cardWidth) / 2
      : onLeft ? label.right - base.left - cardWidth : label.left - base.left;
    const below = label.bottom - base.top + 12;
    const bottom = stageTop + stage.clientHeight - 12;
    const top = mobile ? stageTop + stage.clientHeight + 12
      : below + cardHeight <= bottom ? below : label.top - base.top - cardHeight - 12;
    preview.style.left = Math.max(12, Math.min(left, base.width - cardWidth - 12)) + 'px';
    preview.style.top = Math.max(stageTop + 12, top) + 'px';
    hero.style.setProperty('--detail-height', mobile ? (cardHeight + 24) + 'px' : '0px');
  } else hero.style.setProperty('--detail-height', '0px');
  schedule();
}
new ResizeObserver(alignAnnotations).observe(hero);
window.addEventListener('annotations-resize', alignAnnotations);
document.fonts.ready.then(alignAnnotations);
if (image.complete) alignAnnotations();
else image.addEventListener('load', alignAnnotations, { once: true });
