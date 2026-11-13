/**
 * Core types for the Image Resizer processing engine.
 *
 * Everything in this folder is framework-free TypeScript: the same engine
 * code runs in the browser (DOM canvas) and in vitest (node, @napi-rs/canvas
 * injected through the CanvasEnv seam — see canvas-env.ts and DECISIONS D7).
 */

export type RasterFormat =
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'avif'
  | 'gif'
  | 'bmp'
  | 'tiff'
  | 'heic'
  | 'svg'
  | 'ico'
  | 'unknown';

/** Formats the engine can encode (subject to runtime feature detection). */
export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif';

export const MIME_BY_FORMAT: Record<Exclude<RasterFormat, 'unknown'>, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  heic: 'image/heic',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
};

export const EXT_BY_FORMAT: Record<Exclude<RasterFormat, 'unknown'>, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif',
  bmp: 'bmp',
  tiff: 'tiff',
  heic: 'heic',
  svg: 'svg',
  ico: 'ico',
};

export const FORMAT_BY_MIME: Record<string, RasterFormat> = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/x-ms-bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/heic': 'heic',
  'image/heif': 'heic',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
};

/** Error type carrying a user-facing message. Engine code never throws raw. */
export class ImageToolError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'ImageToolError';
    this.code = code;
  }
}

/** Input files larger than this are rejected before any decode attempt. */
export const MAX_INPUT_BYTES = 60 * 1024 * 1024; // 60 MB
/** Decoded pixel ceiling — a 100 MP raster is ~400 MB of RGBA in memory. */
export const MAX_PIXELS = 100_000_000;
/** Above this many pixels we warn (but still process). */
export const LARGE_IMAGE_PIXELS = 40_000_000;
/** Output canvas ceiling, same reasoning as MAX_PIXELS. */
export const MAX_OUTPUT_PIXELS = 100_000_000;

export interface FileInspection {
  format: RasterFormat;
  /** True when the signature disagrees with the file extension / MIME type. */
  signatureMismatch: boolean;
  declaredMime: string;
  sizeBytes: number;
}
