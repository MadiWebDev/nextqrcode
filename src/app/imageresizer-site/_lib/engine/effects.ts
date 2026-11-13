/**
 * Canvas effects: rounded corners, borders/frames, background replacement,
 * and watermarks (text + image overlay). All render through the CanvasEnv
 * seam and return fresh canvases — the editor applies them as pipeline
 * stages over the untouched original.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';

/** Round the corners of an image (radius in px, or % of the short edge). */
export function roundCorners(
  env: CanvasEnv,
  source: Drawable,
  radiusPx: number
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  const r = Math.max(0, Math.min(radiusPx, Math.min(source.width, source.height) / 2));
  if (r === 0) {
    ctx.drawImage(source, 0, 0);
    return canvas;
  }
  // Draw the source, then keep only the rounded-rect area via
  // destination-in compositing; fall back to pixel clearing where the
  // vector path API is unavailable (older browsers).
  ctx.drawImage(source, 0, 0);
  if (typeof ctx.roundRect === 'function') {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, source.width, source.height, r);
    ctx.fill();
    ctx.restore();
    return canvas;
  }
  const imageData = ctx.getImageData(0, 0, source.width, source.height);
  const data = imageData.data;
  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      const inCornerX = x < r || x >= source.width - r;
      const inCornerY = y < r || y >= source.height - r;
      if (!inCornerX || !inCornerY) continue;
      const cx = x < r ? r : source.width - r;
      const cy = y < r ? r : source.height - r;
      const dist = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (dist > r) {
        const idx = (y * source.width + x) * 4;
        data[idx + 3] = 0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/** Add a solid border (frame) around the image, growing the canvas. */
export function addBorder(
  env: CanvasEnv,
  source: Drawable,
  widthPx: number,
  color: string
): CanvasSurface {
  const w = Math.max(0, Math.round(widthPx));
  if (w === 0) {
    const canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }
  const canvas = env.createCanvas(source.width + w * 2, source.height + w * 2);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, w, w);
  return canvas;
}

/**
 * Replace transparent pixels with a solid background colour (the honest
 * version of "change background": it fills transparency — it does not claim
 * to cut out subjects).
 */
export function setBackground(
  env: CanvasEnv,
  source: Drawable,
  color: string
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, source.width, source.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export type WatermarkPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'center'
  | 'tile';

export interface TextWatermarkOptions {
  text: string;
  position: WatermarkPosition;
  /** 0..1 */
  opacity: number;
  /** Font size as a fraction of image width (0.01..0.2). */
  sizeFraction: number;
  color: string;
}

export function drawTextWatermark(
  env: CanvasEnv,
  source: Drawable,
  options: TextWatermarkOptions
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  const fontPx = Math.max(10, Math.round(source.width * options.sizeFraction));
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, options.opacity));
  ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
  ctx.fillStyle = options.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const pad = fontPx;
  const positions: Record<Exclude<WatermarkPosition, 'tile'>, [number, number]> = {
    'bottom-right': [source.width - pad * 2.2, source.height - pad],
    'bottom-left': [pad * 2.2, source.height - pad],
    'top-right': [source.width - pad * 2.2, pad],
    'top-left': [pad * 2.2, pad],
    center: [source.width / 2, source.height / 2],
  };
  if (options.position === 'tile') {
    ctx.translate(source.width / 2, source.height / 2);
    ctx.rotate(-Math.PI / 7);
    const stepX = fontPx * 9;
    const stepY = fontPx * 5;
    for (let y = -source.height; y < source.height; y += stepY) {
      for (let x = -source.width; x < source.width; x += stepX) {
        ctx.fillText(options.text, x, y);
      }
    }
  } else {
    const [x, y] = positions[options.position];
    ctx.fillText(options.text, x, y);
  }
  ctx.restore();
  return canvas;
}

export interface ImageWatermarkOptions {
  position: Exclude<WatermarkPosition, 'tile'>;
  /** 0..1 */
  opacity: number;
  /** Overlay width as a fraction of image width (0.05..0.6). */
  widthFraction: number;
  marginFraction?: number;
}export function drawImageWatermark(
  env: CanvasEnv,
  source: Drawable,
  overlay: Drawable,
  options: ImageWatermarkOptions
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  const w = Math.max(8, Math.round(source.width * options.widthFraction));
  const h = Math.max(8, Math.round((w * overlay.height) / overlay.width));
  const margin = Math.round(source.width * (options.marginFraction ?? 0.03));
  const positions: Record<string, [number, number]> = {
    'bottom-right': [source.width - w - margin, source.height - h - margin],
    'bottom-left': [margin, source.height - h - margin],
    'top-right': [source.width - w - margin, margin],
    'top-left': [margin, margin],
    center: [(source.width - w) / 2, (source.height - h) / 2],
  };
  const [x, y] = positions[options.position];
  ctx.globalAlpha = Math.min(1, Math.max(0, options.opacity));
  ctx.drawImage(overlay, x, y, w, h);
  ctx.globalAlpha = 1;
  return canvas;
}

export interface QrOverlayOptions {
  position: Exclude<WatermarkPosition, 'tile'>;
  /** 0..1 — applied to the QR modules; the white backing stays solid so codes remain scannable. */
  opacity: number;
  /** QR width as a fraction of image width (0.08..0.5). */
  widthFraction: number;
}

/**
 * Overlay a QR code drawable with a solid white backing + quiet-zone
 * padding: QR codes need contrast and a quiet zone to scan, so the backing
 * is never made transparent even when the code itself is softened.
 */
export function drawQrOverlay(
  env: CanvasEnv,
  source: Drawable,
  qr: Drawable,
  options: QrOverlayOptions
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  const size = Math.max(24, Math.round(source.width * options.widthFraction));
  const pad = Math.max(4, Math.round(size * 0.08));
  const margin = Math.round(source.width * 0.03);
  const total = size + pad * 2;
  const positions: Record<string, [number, number]> = {
    'bottom-right': [source.width - total - margin, source.height - total - margin],
    'bottom-left': [margin, source.height - total - margin],
    'top-right': [source.width - total - margin, margin],
    'top-left': [margin, margin],
    center: [(source.width - total) / 2, (source.height - total) / 2],
  };
  const [x, y] = positions[options.position];
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, total, total);
  ctx.globalAlpha = Math.min(1, Math.max(0.1, options.opacity));
  ctx.drawImage(qr, x + pad, y + pad, size, size);
  ctx.globalAlpha = 1;
  return canvas;
}

