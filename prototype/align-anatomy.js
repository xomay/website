// Register the anatomical illustration to the approved portrait at render time.
// Both states share the approved portrait alpha, with edge colours extended locally.
export async function alignAnatomy(portrait, anatomy) {
  await Promise.all([portrait.decode(), anatomy.decode()]);
  const width = portrait.naturalWidth;
  const height = portrait.naturalHeight;
  if (anatomy.naturalWidth !== width || anatomy.naturalHeight !== height) {
    throw new Error('Anatomical illustrations must share the portrait dimensions.');
  }
  const read = image => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, width, height).data;
  };
  const reference = read(portrait);
  const source = read(anatomy);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.className = anatomy.className;
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  const output = context.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const destination = (y * width + x) * 4;
      if (reference[destination + 3] === 0) continue;
      let sampleX = x;
      // Extend the nearest anatomical edge colour across the few pixels where
      // its source outline is narrower than the approved portrait.
      if (source[destination + 3] < 128) {
        for (let distance = 1; distance <= 24; distance++) {
          const left = x - distance;
          const right = x + distance;
          if (left >= 0 && source[(y * width + left) * 4 + 3] >= 128) {
            sampleX = left;
            break;
          }
          if (right < width && source[(y * width + right) * 4 + 3] >= 128) {
            sampleX = right;
            break;
          }
        }
      }
      const sample = (y * width + sampleX) * 4;
      const hasColour = source[sample + 3] > 0;
      output.data[destination] = hasColour ? source[sample] : 220;
      output.data[destination + 1] = hasColour ? source[sample + 1] : 231;
      output.data[destination + 2] = hasColour ? source[sample + 2] : 240;
      output.data[destination + 3] = reference[destination + 3];
    }
  }
  context.putImageData(output, 0, 0);
  anatomy.replaceWith(canvas);
  return { canvas, pixels: output };
}
