const character = document.querySelector('.gaze-character');
const stage = document.querySelector('#stage');
const surface = character.querySelector('.character-base');
const targets = [...character.querySelectorAll('[data-anatomy-zone]')];
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let overCharacter = false;
let selected = null;
let alphaMap;
let previousZone = null;
let anatomyReady = false;

for (const button of targets) button.dataset.labelEn = button.getAttribute('aria-label');

// A tiny alpha map distinguishes the silhouette from the transparent image margins.
async function prepareSilhouette() {
  await surface.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 192;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(surface, 0, 0, canvas.width, canvas.height);
  alphaMap = context.getImageData(0, 0, canvas.width, canvas.height).data;
}
prepareSilhouette().catch(() => { /* The labelled controls remain available if the image fails. */ });

function onSilhouette(event) {
  if (!alphaMap) return false;
  const rect = character.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / rect.width * 128);
  const y = Math.floor((event.clientY - rect.top) / rect.height * 192);
  return x >= 0 && x < 128 && y >= 0 && y < 192 && alphaMap[(y * 128 + x) * 4 + 3] > 150;
}
function update() {
  const visible = anatomyReady && (overCharacter || !!selected);
  character.classList.toggle('anatomy-visible', visible);
  stage.dataset.revealed = String(visible);
  for (const button of targets) {
    const active = button.dataset.anatomyZone === selected;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-expanded', String(active));
    button.setAttribute('aria-controls', 'preview');
  }
}
function hover(zone) {
  if (previousZone === zone) return;
  previousZone = zone;
  window.dispatchEvent(new CustomEvent('organ-hover', { detail: zone }));
}
stage.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !finePointer.matches) return;
  overCharacter = onSilhouette(event);
  update();
  const zone = event.target.closest('[data-anatomy-zone]')?.dataset.anatomyZone ?? null;
  hover(zone);
});
stage.addEventListener('pointerleave', () => {
  overCharacter = false;
  hover(null);
  update();
});
for (const button of targets) {
  button.addEventListener('focus', () => {
    selected = button.dataset.anatomyZone;
    update();
    window.dispatchEvent(new CustomEvent('organ-hover', { detail: selected }));
  });
  button.addEventListener('blur', () => hover(null));
  button.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('organ-pick', { detail: button.dataset.anatomyZone }));
  });
}
window.addEventListener('highlight', event => {
  selected = event.detail;
  update();
});
window.addEventListener('blur', () => {
  overCharacter = false;
  hover(null);
  update();
});
update();

Promise.all([...character.querySelectorAll('.anatomy-layer img')].map(image => image.decode()))
  .then(() => { anatomyReady = true; update(); })
  .catch(() => { /* Keep the portrait opaque and project navigation usable. */ });
