/**
 * Crop + geometric transforms (rotate / flip), rendered through the
 * CanvasEnv seam. Rectangles are in source pixels and are clamped to the
 * image bounds; an empty result is an honest error, never a 0px canvas.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';
import { ImageToolError } from './types';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function clampCropRect(rect: CropRect, srcW: number, srcH: number): CropRect {
  const x = Math.min(Math.max(0, Math.round(rect.x)), Math.max(0, srcW - 1));
  const y = Math.min(Math.max(0, Math.round(rect.y)), Math.max(0, srcH - 1));
  const width = Math.min(Math.round(rect.width), srcW - x);
  const height = Math.min(Math.round(rect.height), srcH - y);
  if (width < 1 || height < 1) {
    throw new ImageToolError('invalid-crop', 'The crop area is empty — drag a wider selection.');
  }
  return { x, y, width, height };
}

export function cropImage(
  env: CanvasEnv,
  source: Drawable,
  rect: CropRect,
  background?: string
): CanvasSurface {
  const r = clampCropRect(rect, source.width, source.height);
  const canvas = env.createCanvas(r.width, r.height);
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, r.width, r.height);
  }
  ctx.drawImage(source, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
  return canvas;
}

/**
 * Rotate by an arbitrary angle (degrees, clockwise). The canvas grows to
 * the rotated bounding box; corners are filled with `background` when given,
 * transparent otherwise. Multiples of 90° stay pixel-exact.
 */
export function rotateImage(
  env: CanvasEnv,
  source: Drawable,
  degreesClockwise: number,
  background?: string
): CanvasSurface {
  const normalized = ((degreesClockwise % 360) + 360) % 360;
  if (normalized === 0) {
    const canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }
  const radians = (normalized * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const outW = Math.max(1, Math.round(source.width * cos + source.height * sin));
  const outH = Math.max(1, Math.round(source.width * sin + source.height * cos));
  const canvas = env.createCanvas(outW, outH);
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, outW, outH);
  }
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate(radians);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return canvas;
}

export function flipImage(
  env: CanvasEnv,
  source: Drawable,
  horizontal: boolean,
  vertical = false
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.translate(horizontal ? source.width : 0, vertical ? source.height : 0);
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(source, 0, 0);
  return canvas;
}
