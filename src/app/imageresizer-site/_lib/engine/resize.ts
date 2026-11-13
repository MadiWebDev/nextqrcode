/**
 * Resize geometry + rendering.
 *
 * Geometry (computeResize) is pure and separately testable; rendering draws
 * through the CanvasEnv seam. Fit modes:
 *  - stretch: output is exactly the target box, aspect may change.
 *  - contain: whole image inside the box, letterboxed on `background`
 *    (transparent when no background is given).
 *  - cover:   image fills the box, centre-cropped.
 * Smoothing labels are honest: browsers do not expose Lanczos; 'smooth' is
 * the platform's high-quality resampling, 'nearest' disables smoothing
 * (pixel-art faithful).
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';
import { ImageToolError, MAX_OUTPUT_PIXELS } from './types';

export type FitMode = 'stretch' | 'contain' | 'cover';
export type SmoothingMode = 'smooth' | 'nearest';

export interface ResizeSpec {
  /** Exact output width in px (with targetHeight → box semantics per fit). */
  targetWidth?: number;
  /** Exact output height in px. */
  targetHeight?: number;
  /** Scale both dimensions by this percentage (1–1000). */
  percent?: number;
  fit?: FitMode;
  /** Letterbox / flatten background, CSS colour. Undefined = transparent. */
  background?: string;
  smoothing?: SmoothingMode;
}

export interface ResizeGeometry {
  outWidth: number;
  outHeight: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

function validDim(value: number, label: string): number {
  const v = Math.round(value);
  if (!Number.isFinite(v) || v < 1) {
    throw new ImageToolError('invalid-dimensions', `${label} must be at least 1 pixel.`);
  }
  return v;
}

export function computeResize(srcW: number, srcH: number, spec: ResizeSpec): ResizeGeometry {
  if (srcW < 1 || srcH < 1) {
    throw new ImageToolError('invalid-dimensions', 'The source image has no size.');
  }
  let boxW: number;
  let boxH: number;
  if (spec.percent !== undefined) {
    if (!Number.isFinite(spec.percent) || spec.percent <= 0) {
      throw new ImageToolError('invalid-dimensions', 'Percentage must be greater than zero.');
    }
    boxW = validDim((srcW * spec.percent) / 100, 'Width');
    boxH = validDim((srcH * spec.percent) / 100, 'Height');
    return {
      outWidth: boxW,
      outHeight: boxH,
      sx: 0, sy: 0, sw: srcW, sh: srcH,
      dx: 0, dy: 0, dw: boxW, dh: boxH,
    };
  }
  if (spec.targetWidth !== undefined && spec.targetHeight === undefined) {
    boxW = validDim(spec.targetWidth, 'Width');
    boxH = validDim((srcH * boxW) / srcW, 'Height');
    return {
      outWidth: boxW, outHeight: boxH,
      sx: 0, sy: 0, sw: srcW, sh: srcH,
      dx: 0, dy: 0, dw: boxW, dh: boxH,
    };
  }
  if (spec.targetHeight !== undefined && spec.targetWidth === undefined) {
    boxH = validDim(spec.targetHeight, 'Height');
    boxW = validDim((srcW * boxH) / srcH, 'Width');
    return {
      outWidth: boxW, outHeight: boxH,
      sx: 0, sy: 0, sw: srcW, sh: srcH,
      dx: 0, dy: 0, dw: boxW, dh: boxH,
    };
  }
  if (spec.targetWidth === undefined || spec.targetHeight === undefined) {
    throw new ImageToolError(
      'invalid-dimensions',
      'Give a width, a height, both dimensions, or a percentage.'
    );
  }
  boxW = validDim(spec.targetWidth, 'Width');
  boxH = validDim(spec.targetHeight, 'Height');
  if (boxW * boxH > MAX_OUTPUT_PIXELS) {
    throw new ImageToolError(
      'output-too-large',
      `That output would be ${(boxW * boxH / 1e6).toFixed(0)} megapixels — over the ${MAX_OUTPUT_PIXELS / 1e6} MP safety limit.`
    );
  }
  const fit = spec.fit ?? 'stretch';
  if (fit === 'stretch') {
    return {
      outWidth: boxW, outHeight: boxH,
      sx: 0, sy: 0, sw: srcW, sh: srcH,
      dx: 0, dy: 0, dw: boxW, dh: boxH,
    };
  }
  if (fit === 'contain') {
    const scale = Math.min(boxW / srcW, boxH / srcH);
    const dw = Math.max(1, Math.round(srcW * scale));
    const dh = Math.max(1, Math.round(srcH * scale));
    return {
      outWidth: boxW, outHeight: boxH,
      sx: 0, sy: 0, sw: srcW, sh: srcH,
      dx: Math.round((boxW - dw) / 2), dy: Math.round((boxH - dh) / 2), dw, dh,
    };
  }
  // cover: crop the source centrally to the box's aspect.
  const scale = Math.max(boxW / srcW, boxH / srcH);
  const sw = Math.min(srcW, Math.round(boxW / scale));
  const sh = Math.min(srcH, Math.round(boxH / scale));
  return {
    outWidth: boxW, outHeight: boxH,
    sx: Math.round((srcW - sw) / 2), sy: Math.round((srcH - sh) / 2), sw, sh,
    dx: 0, dy: 0, dw: boxW, dh: boxH,
  };
}

/** Render a resize of any drawable source into a fresh canvas. */
export function renderResize(
  env: CanvasEnv,
  source: Drawable,
  spec: ResizeSpec
): CanvasSurface {
  const geo = computeResize(source.width, source.height, spec);
  const canvas = env.createCanvas(geo.outWidth, geo.outHeight);
  const ctx = canvas.getContext('2d');
  if (spec.background) {
    ctx.fillStyle = spec.background;
    ctx.fillRect(0, 0, geo.outWidth, geo.outHeight);
  }
  if (spec.smoothing === 'nearest') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  ctx.drawImage(source, geo.sx, geo.sy, geo.sw, geo.sh, geo.dx, geo.dy, geo.dw, geo.dh);
  return canvas;
}

/** Draw a source onto a same-size canvas filled with `background` (alpha flatten). */
export function flattenOnto(env: CanvasEnv, source: Drawable, background: string): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, source.width, source.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

// ---------------------------------------------------------------------------
// Print maths — pure conversions between pixels, physical size and DPI.
// ---------------------------------------------------------------------------

export type PrintUnit = 'in' | 'cm' | 'mm';

const MM_PER_UNIT: Record<PrintUnit, number> = { in: 25.4, cm: 10, mm: 1 };

export function pixelsForPrint(size: number, unit: PrintUnit, dpi: number): number {
  if (!(dpi > 0) || !(size > 0)) {
    throw new ImageToolError('invalid-dimensions', 'Print size and DPI must be greater than zero.');
  }
  return Math.round(((size * MM_PER_UNIT[unit]) / 25.4) * dpi);
}

export function printSizeForPixels(pixels: number, dpi: number, unit: PrintUnit): number {
  if (!(dpi > 0)) throw new ImageToolError('invalid-dimensions', 'DPI must be greater than zero.');
  const inches = pixels / dpi;
  return inches * (25.4 / MM_PER_UNIT[unit]);
}

/** ISO A4 at the given DPI. */
export function a4Pixels(dpi: number): { width: number; height: number } {
  return { width: pixelsForPrint(210, 'mm', dpi), height: pixelsForPrint(297, 'mm', dpi) };
}

/** US Letter at the given DPI. */
export function letterPixels(dpi: number): { width: number; height: number } {
  return { width: pixelsForPrint(8.5, 'in', dpi), height: pixelsForPrint(11, 'in', dpi) };
}
