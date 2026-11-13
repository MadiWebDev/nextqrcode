/**
 * Format conversion: decode once (decode.ts), optionally resize, encode to
 * the target format. Alpha handling is explicit: formats without an alpha
 * channel (JPEG) flatten onto `background`; the caller must say so in the UI.
 */
import type { CanvasEnv, Drawable } from './canvas-env';
import { flattenOnto, renderResize, type ResizeSpec } from './resize';
import { ImageToolError, MIME_BY_FORMAT, type OutputFormat } from './types';

export interface ConvertOptions {
  format: Exclude<OutputFormat, 'gif'>;
  /** 0–1 for quality formats (jpeg/webp/avif). Ignored for png. */
  quality?: number;
  /** Flatten background for formats without alpha. Default #ffffff. */
  background?: string;
  resize?: ResizeSpec;
}

export interface ConvertResult {
  blob: Blob;
  format: Exclude<OutputFormat, 'gif'>;
  sizeBytes: number;
  width: number;
  height: number;
}

export async function convertImage(
  env: CanvasEnv,
  source: Drawable,
  options: ConvertOptions
): Promise<ConvertResult> {
  const mime = MIME_BY_FORMAT[options.format];
  if (!(await env.probeEncode(mime))) {
    throw new ImageToolError(
      'encode-unsupported',
      options.format === 'avif'
        ? 'This browser cannot create AVIF files (AVIF encoding currently works in Chrome). The image was not converted — try WebP, which compresses almost as well and works everywhere.'
        : `Your browser cannot encode ${options.format.toUpperCase()} images. Try WebP or JPG instead.`
    );
  }
  let working: Drawable = source;
  if (options.resize) {
    working = renderResize(env, source, options.resize);
  }
  let canvas;
  if (options.format === 'jpeg') {
    canvas = flattenOnto(env, working, options.background ?? '#ffffff');
  } else if (working === source && !options.resize) {
    canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
  } else {
    canvas = working as ReturnType<CanvasEnv['createCanvas']>;
  }
  const quality =
    options.format === 'png' ? undefined : Math.min(1, Math.max(0.01, options.quality ?? 0.9));
  const blob = await env.encode(canvas, mime, quality);
  return { blob, format: options.format, sizeBytes: blob.size, width: canvas.width, height: canvas.height };
}
