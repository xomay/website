const character = document.querySelector('.gaze-character');
const portrait = character.querySelector('.character-base');
const details = character.querySelector('.head-details');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const random = (min, max) => min + Math.random() * (max - min);
let ready = false;
let visible = true;
let active = false;
let blinkTimer;
let tiltTimer;
let tiltFrame = 0;
let blink;
let draw = () => {};

function scheduleBlink(first = false) {
  blinkTimer = setTimeout(() => closeEyes(), first ? random(1800, 3500) : random(3500, 7000));
}
function closeEyes(second = false) {
  if (!active) return;
  const animation = details.animate([
    { '--blink': '0', offset: 0 },
    { '--blink': '1', offset: .34 },
    { '--blink': '1', offset: .43 },
    { '--blink': '0', offset: 1 },
  ], { duration: second ? 220 : 280, easing: 'ease-in-out' });
  blink = animation;
  animation.finished.then(() => {
    if (blink !== animation || !active) return;
    blink = null;
    if (!second && Math.random() < .15) blinkTimer = setTimeout(() => closeEyes(true), 140);
    else scheduleBlink();
  }).catch(() => { /* Cancellation opens the eyes immediately on anatomy reveal. */ });
}
function scheduleTilt(first = false) {
  tiltTimer = setTimeout(() => tilt(), first ? random(2200, 4200) : random(6500, 11500));
}
function tilt() {
  if (!active) return;
  const start = performance.now();
  const duration = random(2400, 3200);
  const amplitude = random(.6, 1) * (Math.random() < .5 ? -1 : 1);
  function step(time) {
    if (!active) return;
    const progress = Math.min(1, (time - start) / duration);
    // Ease in and out of a small neck pivot; return to the exact original pose.
    draw(progress === 1 ? 0 : amplitude * Math.sin(Math.PI * progress) ** 2);
    if (progress < 1) tiltFrame = requestAnimationFrame(step);
    else { tiltFrame = 0; scheduleTilt(); }
  }
  tiltFrame = requestAnimationFrame(step);
}
function reconcile() {
  const next = ready && visible && !document.hidden && !reducedMotion.matches
    && !character.classList.contains('anatomy-visible');
  if (next === active) return;
  active = next;
  if (active) {
    scheduleBlink(true);
    scheduleTilt(true);
  } else {
    clearTimeout(blinkTimer);
    clearTimeout(tiltTimer);
    cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    blink?.cancel();
    blink = null;
    draw(0);
  }
}
new MutationObserver(reconcile).observe(character, { attributes: true, attributeFilter: ['class'] });
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  reconcile();
}, { threshold: 0 }).observe(character);
document.addEventListener('visibilitychange', reconcile);
reducedMotion.addEventListener('change', reconcile);

async function prepare() {
  await portrait.decode();
  const width = portrait.naturalWidth, height = portrait.naturalHeight;
  const makeCanvas = (h = height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = h;
    return canvas;
  };
  // Separate the head at the neck with a soft overlap. Only these cached layers
  // are composited during a tilt; no additional illustration is downloaded.
  const neckTop = height * .397;
  const neckBottom = height * .45;
  const pivotX = width * .515, pivotY = height * .436;
  const body = makeCanvas();
  const bodyContext = body.getContext('2d');
  bodyContext.drawImage(portrait, 0, 0);
  // Match each lid to the actual lighting around that eye instead of using
  // the same flat skin colour on both sides of the face.
  const skin = (x, y) => {
    const pixels = bodyContext.getImageData(Math.round(x) - 1, Math.round(y) - 1, 3, 3).data;
    const colour = [0, 0, 0];
    for (let i = 0; i < pixels.length; i += 4) {
      for (let channel = 0; channel < 3; channel++) colour[channel] += pixels[i + channel] / 9;
    }
    return 'rgb(' + colour.map(Math.round).join(' ') + ')';
  };
  for (const eye of details.querySelectorAll('.eye')) {
    const x = eye.offsetLeft / character.clientWidth * width;
    const y = eye.offsetTop / character.clientHeight * height;
    const w = eye.clientWidth / character.clientWidth * width;
    const h = eye.clientHeight / character.clientHeight * height;
    const leftEye = eye.classList.contains('eye-left');
    eye.style.setProperty('--lid-top', skin(x + w * .5, y - h * .12));
    eye.style.setProperty('--lid-bottom', skin(x + w * .5, y + h * 1.12));
    eye.style.setProperty('--lid-side', skin(x + w * (leftEye ? -.14 : 1.14), y + h * .5));
    eye.style.setProperty('--lid-inner', skin(x + w * (leftEye ? 1.14 : -.14), y + h * .5));
    eye.style.setProperty('--lid-light-x', leftEye ? '85%' : '15%');
  }
  bodyContext.clearRect(0, 0, width, neckTop);
  const head = makeCanvas(Math.ceil(neckBottom));
  const headContext = head.getContext('2d');
  headContext.drawImage(portrait, 0, 0);
  const fade = headContext.createLinearGradient(0, neckTop, 0, neckBottom);
  fade.addColorStop(0, '#fff');
  fade.addColorStop(1, '#fff0');
  headContext.globalCompositeOperation = 'destination-in';
  headContext.fillStyle = fade;
  headContext.fillRect(0, 0, width, neckBottom);
  const canvas = makeCanvas();
  canvas.className = 'character-motion';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  context.imageSmoothingQuality = 'high';
  draw = angle => {
    context.clearRect(0, 0, width, height);
    if (angle === 0) context.drawImage(portrait, 0, 0);
    else {
      context.drawImage(body, 0, 0);
      context.save();
      context.translate(pivotX, pivotY);
      context.rotate(angle * Math.PI / 180);
      context.drawImage(head, -pivotX, -pivotY);
      context.restore();
    }
    character.style.setProperty('--head-angle', angle + 'deg');
    window.dispatchEvent(new Event('gaze-pose'));
  };
  draw(0);
  portrait.after(canvas);
  portrait.classList.add('life-ready');
  ready = true;
  reconcile();
}
prepare().catch(() => { /* Keep the original portrait and gaze if decoding fails. */ });
