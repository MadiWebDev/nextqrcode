/**
 * Region redaction: blur, pixelate or solid-black rectangles over chosen
 * areas (faces, plates, addresses). Regions are fractions of the image so
 * they survive re-rendering at any size. Blur strength uses the shared box
 * blur; pixelation reuses the block-resample approach.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';
import { boxBlur } from './adjustments';

export type RedactMode = 'blur' | 'pixelate' | 'solid';

export interface RedactRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  mode: RedactMode;
  /** blur: radius px at full size · pixelate: block px · solid: unused */
  strength: number;
}

export function applyRedactions(
  env: CanvasEnv,
  source: Drawable,
  regions: RedactRegion[]
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  if (regions.length === 0) return canvas;

  for (const region of regions) {
    const x = Math.max(0, Math.round(region.x * source.width));
    const y = Math.max(0, Math.round(region.y * source.height));
    const w = Math.min(source.width - x, Math.round(region.w * source.width));
    const h = Math.min(source.height - y, Math.round(region.h * source.height));
    if (w < 2 || h < 2) continue;

    if (region.mode === 'solid') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, w, h);
      continue;
    }
    const imageData = ctx.getImageData(x, y, w, h);
    if (region.mode === 'blur') {
      const radius = Math.max(2, Math.round(region.strength));
      // Pad-blur needs context around the edges; a tight crop slightly
      // softens region borders, which is acceptable — and edges are also
      // covered because the blur pass runs a few iterations.
      boxBlur(imageData.data, w, h, radius);
      boxBlur(imageData.data, w, h, radius);
    } else {
      // pixelate: average each block
      const block = Math.max(2, Math.round(region.strength));
      const data = imageData.data;
      for (let by = 0; by < h; by += block) {
        for (let bx = 0; bx < w; bx += block) {
          let r = 0, g = 0, b = 0, a = 0, n = 0;
          for (let yy = by; yy < Math.min(h, by + block); yy++) {
            for (let xx = bx; xx < Math.min(w, bx + block); xx++) {
              const idx = (yy * w + xx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              n += 1;
            }
          }
          const avg = [Math.round(r / n), Math.round(g / n), Math.round(b / n), Math.round(a / n)];
          for (let yy = by; yy < Math.min(h, by + block); yy++) {
            for (let xx = bx; xx < Math.min(w, bx + block); xx++) {
              const idx = (yy * w + xx) * 4;
              data[idx] = avg[0];
              data[idx + 1] = avg[1];
              data[idx + 2] = avg[2];
              data[idx + 3] = avg[3];
            }
          }
        }
      }
    }
    ctx.putImageData(imageData, x, y);
  }
  return canvas;
}
