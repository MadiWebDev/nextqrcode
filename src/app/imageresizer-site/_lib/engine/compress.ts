/**
 * Compression engine.
 *
 * Two honest paths:
 *  - compressWithSettings: one encode at the user's quality/format/size.
 *  - compressToTarget: the exact-size algorithm. For quality formats it
 *    binary-searches quality; if the target still isn't met it steps the
 *    dimensions down and searches again. It NEVER claims success it didn't
 *    achieve: `achieved` is computed from the real output byte size, and on
 *    failure the smallest result found is returned with an explanation.
 *
 * PNG has no quality control in canvas encoding; its path is re-encode
 * (which strips metadata) plus optional dimension steps, and the result
 * notes say exactly that.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';
import { flattenOnto, renderResize } from './resize';
import { ImageToolError, MIME_BY_FORMAT, type OutputFormat } from './types';

export interface CompressSettings {
  format: Exclude<OutputFormat, 'gif'>;
  /** 0–1, quality formats only. */
  quality?: number;
  /** Cap the longest edge (px) — the image is scaled down to fit if larger. */
  maxDimension?: number;
  /** Background used to flatten transparency for JPEG. Default #ffffff. */
  background?: string;
}

export interface CompressedResult {
  blob: Blob;
  format: Exclude<OutputFormat, 'gif'>;
  sizeBytes: number;
  width: number;
  height: number;
  quality: number | null;
}

function prepareCanvas(
  env: CanvasEnv,
  source: Drawable,
  format: CompressSettings['format'],
  maxDimension?: number,
  background?: string
): CanvasSurface {
  let working: Drawable = source;
  if (maxDimension && Math.max(source.width, source.height) > maxDimension) {
    const scale = maxDimension / Math.max(source.width, source.height);
    working = renderResize(env, source, {
      targetWidth: Math.max(1, Math.round(source.width * scale)),
      targetHeight: Math.max(1, Math.round(source.height * scale)),
    });
  }
  if (format === 'jpeg') {
    return flattenOnto(env, working, background ?? '#ffffff');
  }
  if (working === source) {
    // Nothing to transform: still materialize so encode has a canvas.
    const canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }
  return working as CanvasSurface;
}

export async function compressWithSettings(
  env: CanvasEnv,
  source: Drawable,
  settings: CompressSettings
): Promise<CompressedResult> {
  const mime = MIME_BY_FORMAT[settings.format];
  if (!(await env.probeEncode(mime))) {
    throw new ImageToolError(
      'encode-unsupported',
      `Your browser cannot encode ${settings.format.toUpperCase()} images. Try WebP or JPG instead.`
    );
  }
  const canvas = prepareCanvas(env, source, settings.format, settings.maxDimension, settings.background);
  const quality = settings.format === 'png' ? undefined : Math.min(1, Math.max(0.01, settings.quality ?? 0.85));
  const blob = await env.encode(canvas, mime, quality);
  return {
    blob,
    format: settings.format,
    sizeBytes: blob.size,
    width: canvas.width,
    height: canvas.height,
    quality: quality ?? null,
  };
}

// ---------------------------------------------------------------------------
// Exact-target compression
// ---------------------------------------------------------------------------

export interface TargetCompressOptions {
  targetBytes: number;
  format: Exclude<OutputFormat, 'gif'>;
  background?: string;
  /** Checked between attempts; set .cancelled = true to abort. */
  signal?: { cancelled: boolean };
  onProgress?: (info: { attempt: number; sizeBytes: number; scale: number; quality: number | null }) => void;
}

export interface TargetCompressResult extends CompressedResult {
  targetBytes: number;
  /** True only when sizeBytes <= targetBytes — measured, never assumed. */
  achieved: boolean;
  /** True when dimensions had to be reduced to approach the target. */
  scaledDown: boolean;
  scale: number;
  attempts: number;
  notes: string[];
}

const SCALE_STEPS = [1, 0.85, 0.7, 0.55, 0.42, 0.32, 0.24, 0.18, 0.13];
const MIN_DIMENSION = 24;

interface EncodeOutcome {
  blob: Blob;
  quality: number | null;
  canvas: CanvasSurface;
}

/** Binary-search the highest quality whose output fits `targetBytes`. */
async function searchQuality(
  env: CanvasEnv,
  canvas: CanvasSurface,
  mime: string,
  targetBytes: number,
  countAttempt: (size: number, quality: number) => void
): Promise<EncodeOutcome | null> {
  let lo = 0.02;
  let hi = 0.98;
  let best: EncodeOutcome | null = null;
  // First probe the top: if max quality already fits, refine upward is moot.
  const top = await env.encode(canvas, mime, hi);
  countAttempt(top.size, hi);
  if (top.size <= targetBytes) return { blob: top, quality: hi, canvas };
  for (let i = 0; i < 7; i++) {
    const mid = (lo + hi) / 2;
    const blob = await env.encode(canvas, mime, mid);
    countAttempt(blob.size, mid);
    if (blob.size <= targetBytes) {
      best = { blob, quality: mid, canvas };
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return best;
}

export async function compressToTarget(
  env: CanvasEnv,
  source: Drawable,
  options: TargetCompressOptions
): Promise<TargetCompressResult> {
  const { targetBytes, format } = options;
  if (!Number.isFinite(targetBytes) || targetBytes < 1024) {
    throw new ImageToolError('invalid-target', 'Target size must be at least 1 KB.');
  }
  const mime = MIME_BY_FORMAT[format];
  if (!(await env.probeEncode(mime))) {
    throw new ImageToolError(
      'encode-unsupported',
      `Your browser cannot encode ${format.toUpperCase()} images. Try WebP or JPG instead.`
    );
  }
  const notes: string[] = [];
  let attempts = 0;
  let smallest: (CompressedResult & { scale: number }) | null = null;

  const scaledCanvas = (scale: number): CanvasSurface => {
    const base =
      scale === 1
        ? prepareCanvas(env, source, format, undefined, options.background)
        : renderResize(env, source, {
            targetWidth: Math.max(1, Math.round(source.width * scale)),
            targetHeight: Math.max(1, Math.round(source.height * scale)),
          });
    if (format === 'jpeg' && scale !== 1) {
      return flattenOnto(env, base, options.background ?? '#ffffff');
    }
    return base;
  };

  for (const scale of SCALE_STEPS) {
    if (options.signal?.cancelled) {
      throw new ImageToolError('cancelled', 'Compression was cancelled.');
    }
    if (scale !== 1) {
      const w = Math.round(source.width * scale);
      const h = Math.round(source.height * scale);
      if (Math.min(w, h) < MIN_DIMENSION) break;
    }
    const canvas = scaledCanvas(scale);
    let outcome: EncodeOutcome | null = null;

    if (format === 'png') {
      const blob = await env.encode(canvas, mime);
      attempts++;
      options.onProgress?.({ attempt: attempts, sizeBytes: blob.size, scale, quality: null });
      if (!smallest || blob.size < smallest.sizeBytes) {
        smallest = {
          blob, format, sizeBytes: blob.size,
          width: canvas.width, height: canvas.height, quality: null, scale,
        };
      }
      if (blob.size <= targetBytes) outcome = { blob, quality: null, canvas };
    } else {
      outcome = await searchQuality(env, canvas, mime, targetBytes, (size, quality) => {
        attempts++;
        options.onProgress?.({ attempt: attempts, sizeBytes: size, scale, quality });
      });
      if (!outcome) {
        // Even the lowest quality at this scale was too big; encode once at
        // the floor quality to record the honest best-effort candidate.
        const floor = await env.encode(canvas, mime, 0.02);
        if (!smallest || floor.size < smallest.sizeBytes) {
          smallest = {
            blob: floor, format, sizeBytes: floor.size,
            width: canvas.width, height: canvas.height, quality: 0.02, scale,
          };
        }
      }
    }

    if (outcome) {
      if (scale !== 1) {
        notes.push(
          `Quality alone couldn't reach the target, so the image was also scaled to ${Math.round(scale * 100)}% (${canvas.width}×${canvas.height}).`
        );
      }
      return {
        blob: outcome.blob,
        format,
        sizeBytes: outcome.blob.size,
        width: canvas.width,
        height: canvas.height,
        quality: outcome.quality,
        targetBytes,
        achieved: true,
        scaledDown: scale !== 1,
        scale,
        attempts,
        notes,
      };
    }
  }

  if (format === 'png') {
    notes.push(
      'PNG has no quality setting, so the only levers are re-encoding and reducing dimensions. For much smaller files, JPG or WebP usually works far better.'
    );
  }
  notes.push(
    'The target could not be reached even at the lowest quality and smallest sensible size. This is the smallest result found.'
  );
  if (!smallest) {
    throw new ImageToolError('compress-failed', 'Compression failed to produce any output.');
  }
  return {
    ...smallest,
    targetBytes,
    achieved: false,
    scaledDown: smallest.scale !== 1,
    attempts,
    notes,
  };
}
