// Magnify the illustration itself rather than stacking a clipped, scaled copy.
// A continuous displacement fades out around each subject, leaving no cut edge
// or second organ underneath. Coordinates refer to the approved 1024 × 1536 art.
export function magnifyAnatomy({ canvas, pixels }) {
  const context = canvas.getContext('2d');
  const { width, height, data: source } = pixels;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = (a, b, value) => {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const regions = [
    { key: 'brain', x: 515, y: 227, rx: 170, ry: 120 },
    { key: 'lungs', x: 530, y: 900, rx: 245, ry: 250 },
    { key: 'heart', x: 585, y: 932, rx: 105, ry: 140 },
    // Include the clip and gripping fingers in the same continuous movement.
    { key: 'clipboard', x: 240, y: 1140, rx: 165, ry: 290 },
  ].map(region => {
    const left = Math.max(0, Math.floor((region.x - region.rx) * width / 1024));
    const top = Math.max(0, Math.floor((region.y - region.ry) * height / 1536));
    const right = Math.min(width, Math.ceil((region.x + region.rx) * width / 1024));
    const bottom = Math.min(height, Math.ceil((region.y + region.ry) * height / 1536));
    const field = [];
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        if (!source[(y * width + x) * 4 + 3]) continue;
        const px = x * 1024 / width, py = y * 1536 / height;
        const radius = Math.hypot((px - region.x) / region.rx, (py - region.y) / region.ry);
        let weight = 1 - smooth(0.72, 1, radius);
        // The heart sits in front of the lungs and must remain still when they grow.
        if (region.key === 'lungs') {
          const heart = Math.hypot((px - 585) / 78, (py - 932) / 110);
          weight *= smooth(0.85, 1.35, heart);
        }
        if (weight > 0) field.push(x, y, (x - region.x * width / 1024) * weight,
          (y - region.y * height / 1536) * weight);
      }
    }
    return { ...region, left, top, right, bottom, field: new Float32Array(field), amount: 0 };
  });
  const output = context.createImageData(width, height);
  output.data.set(source);
  let selected = null;
  let frame = 0;
  let lastTime = 0;
  let previousBounds = null;

  function render() {
    // Reset every affected rectangle before sampling the immutable original.
    // Rapid switches and interrupted transitions cannot accumulate image damage.
    if (previousBounds) {
      const { left, top, right, bottom } = previousBounds;
      context.putImageData(pixels, 0, 0, left, top, right - left, bottom - top);
    }
    previousBounds = null;
    const active = regions.filter(r => r.amount > 0);
    if (!active.length) return;
    const left = Math.min(...active.map(r => r.left));
    const top = Math.min(...active.map(r => r.top));
    const right = Math.max(...active.map(r => r.right));
    const bottom = Math.max(...active.map(r => r.bottom));
    previousBounds = { left, top, right, bottom };
    // Accumulate fields so the overlapping heart/lung regions stay continuous.
    const dx = new Float32Array((right - left) * (bottom - top));
    const dy = new Float32Array(dx.length);
    for (const r of active) {
      const factor = r.amount / (1 + r.amount);
      for (let i = 0; i < r.field.length; i += 4) {
        const position = (r.field[i + 1] - top) * (right - left) + r.field[i] - left;
        dx[position] += r.field[i + 2] * factor;
        dy[position] += r.field[i + 3] * factor;
      }
    }
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        const destination = (y * width + x) * 4;
        const position = (y - top) * (right - left) + x - left;
        if (!dx[position] && !dy[position]) {
          output.data[destination] = source[destination];
          output.data[destination + 1] = source[destination + 1];
          output.data[destination + 2] = source[destination + 2];
          output.data[destination + 3] = source[destination + 3];
          continue;
        }
        const sx = Math.max(0, Math.min(width - 1.001, x - dx[position]));
        const sy = Math.max(0, Math.min(height - 1.001, y - dy[position]));
        const ix = Math.floor(sx), iy = Math.floor(sy);
        const fx = sx - ix, fy = sy - iy;
        // Interpolate premultiplied colour to avoid dark fringes at transparent edges.
        const a = (iy * width + ix) * 4, b = a + 4;
        const c = a + width * 4, d = c + 4;
        const wa = (1 - fx) * (1 - fy) * source[a + 3];
        const wb = fx * (1 - fy) * source[b + 3];
        const wc = (1 - fx) * fy * source[c + 3];
        const wd = fx * fy * source[d + 3];
        const alpha = wa + wb + wc + wd;
        for (let channel = 0; channel < 3; channel++) {
          output.data[destination + channel] = alpha
            ? (source[a + channel] * wa + source[b + channel] * wb
              + source[c + channel] * wc + source[d + channel] * wd) / alpha
            : source[destination + channel];
        }
        // Keep the common portrait silhouette stable, including the arm and hand.
        output.data[destination + 3] = source[destination + 3];
      }
    }
    context.putImageData(output, 0, 0, left, top, right - left, bottom - top);
  }

  function animate(time) {
    const elapsed = Math.min(32, time - (lastTime || time - 16));
    lastTime = time;
    let moving = false;
    for (const r of regions) {
      const target = r.key === selected ? 0.025 : 0;
      r.amount += (target - r.amount) * (1 - Math.exp(-elapsed / 45));
      if (Math.abs(target - r.amount) < 0.00005) r.amount = target;
      else moving = true;
    }
    render();
    canvas.dataset.zoomZone = selected || '';
    frame = moving ? requestAnimationFrame(animate) : 0;
  }
  function select(zone) {
    const next = reducedMotion.matches ? null : zone;
    if (next === selected) return;
    selected = next;
    if (!frame) { lastTime = 0; frame = requestAnimationFrame(animate); }
  }
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    cancelAnimationFrame(frame);
    frame = 0;
    selected = null;
    for (const r of regions) r.amount = 0;
    context.putImageData(pixels, 0, 0);
    canvas.dataset.zoomZone = '';
  });
  return select;
}
