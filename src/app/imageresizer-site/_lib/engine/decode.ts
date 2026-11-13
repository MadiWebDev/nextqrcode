/**
 * Decode router: turns any supported input blob into a materialized canvas
 * surface the rest of the engine can work on uniformly.
 *
 * Routes by magic-byte signature (never by extension):
 *  - native formats → CanvasEnv.decodeRaster (EXIF orientation applied)
 *  - GIF → native first frame, or full frame decode when animation is kept
 *  - TIFF → UTIF.js (dynamic import, first page)
 *  - HEIC/HEIF → heic2any (dynamic import), then native decode of its output
 *  - SVG → sanitize, then rasterize at intrinsic size (scaled to a sane cap)
 */
import { releaseDrawable, type CanvasEnv, type CanvasSurface, type Drawable } from './canvas-env';
import { decodeGif, type GifFrame } from './gif';
import { inspectFile } from './validate';
import { intrinsicSvgSize, sanitizeSvgText } from './svg';
import {
  ImageToolError,
  LARGE_IMAGE_PIXELS,
  MAX_PIXELS,
  type RasterFormat,
} from './types';

export interface DecodedImage {
  format: RasterFormat;
  width: number;
  height: number;
  /** Materialized first-frame surface (all operations start from this). */
  surface: CanvasSurface;
  /** All frames when an animated GIF was decoded with animation kept. */
  gifFrames?: GifFrame[];
  /** Non-fatal notes the UI should surface (e.g. "TIFF: first page used"). */
  notes: string[];
  release(): void;
}

export interface DecodeOptions {
  /** For GIF: decode every frame (default true). False = first frame only. */
  preserveAnimation?: boolean;
  /** For SVG: longest-edge rasterization cap in px (default 2048). */
  svgMaxDimension?: number;
}

function guardPixels(width: number, height: number, notes: string[]): void {
  const pixels = width * height;
  if (pixels > MAX_PIXELS) {
    throw new ImageToolError(
      'image-too-large',
      `This image is ${width}×${height} (${(pixels / 1e6).toFixed(0)} megapixels). The limit is ${MAX_PIXELS / 1e6} megapixels — decoding it would need more memory than most devices have.`
    );
  }
  if (pixels > LARGE_IMAGE_PIXELS) {
    notes.push(
      `Large image (${(pixels / 1e6).toFixed(0)} MP) — processing may take a while on this device.`
    );
  }
}

async function surfaceFromDrawable(env: CanvasEnv, drawable: Drawable): Promise<CanvasSurface> {
  const canvas = env.createCanvas(drawable.width, drawable.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(drawable, 0, 0);
  return canvas;
}

export async function decodeImage(
  env: CanvasEnv,
  blob: Blob & { name?: string },
  options: DecodeOptions = {}
): Promise<DecodedImage> {
  const inspection = await inspectFile(blob);
  const notes: string[] = [];
  if (inspection.signatureMismatch) {
    notes.push(
      `The file's contents look like ${inspection.format.toUpperCase()} even though its name suggests otherwise — it was processed as ${inspection.format.toUpperCase()}.`
    );
  }
  const format = inspection.format;
  if (format === 'unknown') {
    throw new ImageToolError(
      'unsupported-format',
      'This file type is not supported. Supported inputs: JPG, PNG, WebP, AVIF, GIF, BMP, TIFF, HEIC/HEIF, SVG and ICO.'
    );
  }

  const finish = async (drawable: Drawable, resultFormat: RasterFormat): Promise<DecodedImage> => {
    guardPixels(drawable.width, drawable.height, notes);
    const surface = await surfaceFromDrawable(env, drawable);
    return {
      format: resultFormat,
      width: drawable.width,
      height: drawable.height,
      surface,
      notes,
      release: () => releaseDrawable(drawable),
    };
  };

  switch (format) {
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'avif':
    case 'bmp':
    case 'ico': {
      let drawable: Drawable;
      try {
        drawable = await env.decodeRaster(blob);
      } catch {
        throw new ImageToolError(
          'decode-failed',
          `Your browser could not decode this ${format.toUpperCase()} file. It may be corrupted, or use a variant this browser doesn't support.`
        );
      }
      return finish(drawable, format);
    }

    case 'gif': {
      const preserve = options.preserveAnimation !== false;
      if (preserve) {
        const bytes = await blob.arrayBuffer();
        const gif = await decodeGif(bytes);
        guardPixels(gif.width, gif.height, notes);
        const first = gif.frames[0];
        const surface = env.canvasFromPixels(first.pixels, gif.width, gif.height);
        if (!gif.animated) notes.push('This GIF has a single frame.');
        return {
          format,
          width: gif.width,
          height: gif.height,
          surface,
          gifFrames: gif.frames,
          notes,
          release: () => undefined,
        };
      }
      const drawable = await env.decodeRaster(blob);
      const out = await finish(drawable, format);
      out.notes.push('Only the first frame of the GIF was loaded (static mode).');
      return out;
    }

    case 'tiff': {
      const UTIF = (await import('utif')).default;
      const bytes = await blob.arrayBuffer();
      let images: ReturnType<typeof UTIF.decode>;
      try {
        images = UTIF.decode(bytes);
      } catch {
        throw new ImageToolError('tiff-decode-failed', 'This TIFF file could not be read — it may be corrupted.');
      }
      if (!images || images.length === 0) {
        throw new ImageToolError('tiff-decode-failed', 'This TIFF file contains no readable image.');
      }
      if (images.length > 1) notes.push(`This TIFF has ${images.length} pages — the first page was used.`);
      const image = images[0];
      UTIF.decodeImage(bytes, image);
      const rgba = UTIF.toRGBA8(image);
      guardPixels(image.width, image.height, notes);
      const surface = env.canvasFromPixels(new Uint8ClampedArray(rgba), image.width, image.height);
      return {
        format,
        width: image.width,
        height: image.height,
        surface,
        notes,
        release: () => undefined,
      };
    }

    case 'heic': {
      let converted: Blob | Blob[];
      try {
        const heic2any = (await import('heic2any')).default;
        converted = await heic2any({ blob, toType: 'image/png' });
      } catch {
        throw new ImageToolError(
          'heic-decode-failed',
          'This HEIC/HEIF photo could not be decoded. It may use a variant the bundled decoder cannot read.'
        );
      }
      const firstBlob = Array.isArray(converted) ? converted[0] : converted;
      const drawable = await env.decodeRaster(firstBlob);
      const out = await finish(drawable, 'heic');
      out.notes.push('HEIC photo decoded in your browser (nothing was uploaded).');
      return out;
    }

    case 'svg': {
      const text = await blob.text();
      const clean = sanitizeSvgText(text);
      const size = intrinsicSvgSize(clean);
      if (size.assumed) {
        notes.push('This SVG declares no size — it was rasterized at 1024×1024.');
      }
      const cap = options.svgMaxDimension ?? 2048;
      const scale = Math.min(1, cap / Math.max(size.width, size.height));
      const w = Math.max(1, Math.round(size.width * scale));
      const h = Math.max(1, Math.round(size.height * scale));
      guardPixels(w, h, notes);
      const drawable = await env.rasterizeSvg(clean, w, h);
      return finish(drawable, 'svg');
    }
  }
}
