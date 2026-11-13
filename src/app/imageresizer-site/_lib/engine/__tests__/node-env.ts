/**
 * Node-side CanvasEnv for engine tests, backed by @napi-rs/canvas (real
 * Skia rasterizer and real PNG/JPEG/WebP/AVIF encoders). This is the test
 * implementation of the exact seam the browser implements with DOM canvas —
 * engine code under test is identical on both sides.
 *
 * Test-only: never imported by application code.
 */
import { createCanvas, loadImage, ImageData as NapiImageData } from '@napi-rs/canvas';
import type { CanvasEnv, CanvasSurface, Drawable } from '../canvas-env';

interface NapiCanvas {
  width: number;
  height: number;
  getContext(type: '2d'): unknown;
  encode(format: string, quality?: number): Promise<Buffer>;
}

const FORMAT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export const nodeEnv: CanvasEnv = {
  createCanvas(width, height) {
    return createCanvas(Math.max(1, Math.round(width)), Math.max(1, Math.round(height))) as unknown as CanvasSurface;
  },

  canvasFromPixels(data, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = new NapiImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvas as unknown as CanvasSurface;
  },

  async decodeRaster(blob) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const img = await loadImage(buffer);
    return img as unknown as Drawable;
  },

  async encode(canvas, mime, quality) {
    const format = FORMAT_BY_MIME[mime];
    if (!format) throw new Error(`nodeEnv cannot encode ${mime}`);
    const napiCanvas = canvas as unknown as NapiCanvas;
    const buffer = await napiCanvas.encode(format, quality === undefined ? undefined : Math.round(quality * 100));
    return new Blob([new Uint8Array(buffer)], { type: mime });
  },

  async probeEncode(mime) {
    if (!FORMAT_BY_MIME[mime]) return false;
    try {
      const canvas = createCanvas(2, 2) as unknown as NapiCanvas;
      const blob = await nodeEnv.encode(canvas as unknown as CanvasSurface, mime, 0.9);
      return blob.type === mime;
    } catch {
      return false;
    }
  },

  async rasterizeSvg(svgText, width, height) {
    const img = await loadImage(Buffer.from(svgText, 'utf-8'));
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas as unknown as CanvasSurface;
  },
};

/**
 * Generate a realistic photo-like test image: smooth gradients + soft shapes
 * + a touch of deterministic grain. Compresses like a real photo (unlike a
 * flat colour block, which would make compression tests meaningless).
 */
export function makePhotoFixture(width = 800, height = 600): CanvasSurface {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#7fb2d9');
  gradient.addColorStop(0.5, '#e8c07d');
  gradient.addColorStop(1, '#5d8a66');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  // Deterministic pseudo-random soft circles (seeded LCG — stable fixtures).
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 60; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = 10 + rand() * 60;
    ctx.fillStyle = `rgba(${Math.floor(rand() * 255)},${Math.floor(rand() * 255)},${Math.floor(rand() * 255)},0.25)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fine grain so encoders can't cheat on flat areas.
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (rand() - 0.5) * 14;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas as unknown as CanvasSurface;
}

/** Pure random-noise image: effectively incompressible — for honest-failure tests. */
export function makeNoiseFixture(width = 512, height = 512): CanvasSurface {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = Math.floor(rand() * 256);
    imageData.data[i + 1] = Math.floor(rand() * 256);
    imageData.data[i + 2] = Math.floor(rand() * 256);
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas as unknown as CanvasSurface;
}
