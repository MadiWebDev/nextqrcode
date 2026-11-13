/**
 * Enhance / upscale: honest, resampling-based enhancement.
 *
 * Multi-step resampling (never more than ~1.5× per step, high-quality
 * smoothing) avoids the blocky single-jump upscale, and a classic unsharp
 * mask (original + amount × (original − blurred)) restores edge contrast.
 * This adds NO new detail and the UI says so — it is not "AI upscaling".
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';
import { boxBlur } from './adjustments';

/** Multi-step upscale (or downscale) of a drawable to an exact target size. */
export function resampleMultiStep(
  env: CanvasEnv,
  source: Drawable,
  targetWidth: number,
  targetHeight: number
): CanvasSurface {
  let current: Drawable = source;
  // Walk toward the target in bounded steps.
  for (let guard = 0; guard < 12; guard++) {
    const ratioW = targetWidth / current.width;
    const ratioH = targetHeight / current.height;
    if (Math.abs(ratioW - 1) < 0.01 && Math.abs(ratioH - 1) < 0.01) break;
    const stepW = Math.min(1.5, Math.max(0.6, ratioW));
    const stepH = Math.min(1.5, Math.max(0.6, ratioH));
    const nextW =
      ratioW > 1 ? Math.min(targetWidth, Math.round(current.width * stepW)) : Math.max(targetWidth, Math.round(current.width * stepW));
    const nextH =
      ratioH > 1 ? Math.min(targetHeight, Math.round(current.height * stepH)) : Math.max(targetHeight, Math.round(current.height * stepH));
    const canvas = env.createCanvas(Math.max(1, nextW), Math.max(1, nextH));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, canvas.width, canvas.height);
    current = canvas;
    if (canvas.width === targetWidth && canvas.height === targetHeight) break;
  }
  if (current.width !== targetWidth || current.height !== targetHeight) {
    const canvas = env.createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, targetWidth, targetHeight);
    current = canvas;
  }
  return current as CanvasSurface;
}

/** Unsharp mask: out = orig + amount × (orig − blurred(orig)). */
export function unsharpMask(
  env: CanvasEnv,
  source: Drawable,
  radius: number,
  amount: number
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const blurred = new Uint8ClampedArray(imageData.data);
  boxBlur(blurred, canvas.width, canvas.height, Math.max(1, Math.round(radius)));
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v = data[i + c] + amount * (data[i + c] - blurred[i + c]);
      data[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * The Enhance operation: multi-step resample to the target size, then an
 * unsharp pass (radius scales mildly with size; amount kept moderate so
 * halos stay subtle).
 */
export function enhanceToSize(
  env: CanvasEnv,
  source: Drawable,
  targetWidth: number,
  targetHeight: number
): CanvasSurface {
  const resampled = resampleMultiStep(env, source, targetWidth, targetHeight);
  return unsharpMask(env, resampled, 2, 0.55);
}
