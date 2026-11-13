const character = document.querySelector('.gaze-character');
const eyes = [...character.querySelectorAll('.eye')];
const stage = document.querySelector('#stage');
const hero = stage.closest('.hero');
const connections = hero.querySelector('.connections');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const image = character.querySelector('img');
// Aim each eye from its own centre, with a little depth to the fixation point.
// This produces subtle convergence nearby and smooth saturation farther away.
const gaze = eyes.map(eye => ({
  eye, target: { x: 0, y: 0 }, current: { x: 0, y: 0 }, velocity: { x: 0, y: 0 },
}));
let pointer = null;
let frame = 0;
let lastTime = 0;

function renderEyes() {
  for (const { eye, current } of gaze) {
    eye.style.setProperty('--look-x', (current.x * eye.clientWidth * .155).toFixed(3) + 'px');
    eye.style.setProperty('--look-y', (current.y * eye.clientHeight * .11).toFixed(3) + 'px');
    // The iris becomes slightly narrower as it turns around the eyeball.
    eye.style.setProperty('--iris-scale-x', (1 - .08 * current.x ** 2).toFixed(4));
    eye.style.setProperty('--iris-scale-y', (1 - .04 * current.y ** 2).toFixed(4));
  }
}
function paint(time) {
  frame = 0;
  const dt = Math.min(.032, Math.max(.001, (time - (lastTime || time - 16.667)) / 1000));
  lastTime = time;
  // Exact critically damped spring: consistent timing at different refresh rates,
  // a quick start, then a gentle stop without the old fixed-per-frame easing.
  const speed = 38;
  const decay = Math.exp(-speed * dt);
  let moving = false;
  for (const state of gaze) {
    for (const axis of ['x', 'y']) {
      const offset = state.current[axis] - state.target[axis];
      const step = (state.velocity[axis] + speed * offset) * dt;
      state.current[axis] = state.target[axis] + (offset + step) * decay;
      state.velocity[axis] = (state.velocity[axis] - speed * step) * decay;
      if (Math.abs(state.current[axis] - state.target[axis]) < .0001 && Math.abs(state.velocity[axis]) < .001) {
        state.current[axis] = state.target[axis];
        state.velocity[axis] = 0;
      } else moving = true;
    }
    const radius = Math.hypot(state.current.x, state.current.y);
    if (radius > 1) {
      state.current.x /= radius;
      state.current.y /= radius;
    }
  }
  renderEyes();
  if (moving) frame = requestAnimationFrame(paint);
  else lastTime = 0;
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(paint);
}
function aim() {
  if (!pointer || reducedMotion.matches || !finePointer.matches) return;
  const depth = character.getBoundingClientRect().width * .55;
  for (const state of gaze) {
    const rect = state.eye.getBoundingClientRect();
    const dx = pointer.x - (rect.left + rect.width / 2);
    const dy = pointer.y - (rect.top + rect.height * .51);
    const distance = Math.hypot(dx, dy, depth);
    state.target.x = dx / distance;
    state.target.y = dy / distance;
  }
  schedule();
}
function reset(immediate = false) {
  pointer = null;
  for (const state of gaze) {
    state.target.x = state.target.y = 0;
    if (immediate) {
      state.current.x = state.current.y = 0;
      state.velocity.x = state.velocity.y = 0;
    }
  }
  if (immediate) {
    cancelAnimationFrame(frame);
    frame = lastTime = 0;
    renderEyes();
  } else schedule();
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reducedMotion.matches || !finePointer.matches) return;
  pointer = { x: event.clientX, y: event.clientY };
  aim();
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => reset());
window.addEventListener('blur', () => reset(true));
window.addEventListener('scroll', aim, { passive: true });
window.addEventListener('gaze-pose', aim);
document.addEventListener('visibilitychange', () => { if (document.hidden) reset(true); });
reducedMotion.addEventListener('change', () => reset(true));
finePointer.addEventListener('change', () => reset(true));

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
    // Leave the next label on this side reachable when a larger card is open.
    const nextLabels = [...hero.querySelectorAll('.markers button')]
      .map(button => button.getBoundingClientRect())
      .filter(rect => rect.top > label.top + 1
        && (rect.left + rect.width / 2 < portrait.left + portrait.width / 2) === onLeft);
    const bottom = Math.min(stageTop + stage.clientHeight - 12,
      ...nextLabels.map(rect => rect.top - base.top - 12));
    const above = label.top - base.top - cardHeight - 12;
    const top = mobile ? stageTop + stage.clientHeight + 12
      : below + cardHeight <= bottom || above < stageTop + 12 ? below : above;
    preview.style.left = Math.max(12, Math.min(left, base.width - cardWidth - 12)) + 'px';
    preview.style.top = Math.max(stageTop + 12, top) + 'px';
    hero.style.setProperty('--detail-height', mobile ? (cardHeight + 24) + 'px' : '0px');
  } else hero.style.setProperty('--detail-height', '0px');
  aim();
}
new ResizeObserver(alignAnnotations).observe(hero);
// Clip the portrait at the actual separator, including wrapped mobile copy.
const footer = hero.querySelector('.hero-foot');
new ResizeObserver(() => {
  hero.style.setProperty('--hero-footer-height', footer.getBoundingClientRect().height + 'px');
  alignAnnotations();
}).observe(footer);
window.addEventListener('annotations-resize', alignAnnotations);
document.fonts.ready.then(alignAnnotations);
if (image.complete) alignAnnotations();
else image.addEventListener('load', alignAnnotations, { once: true });
