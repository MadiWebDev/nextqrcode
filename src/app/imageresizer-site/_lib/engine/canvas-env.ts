/**
 * Canvas environment seam (DECISIONS D7).
 *
 * The engine never touches `document` directly. It works against the small
 * structural interfaces below. In the browser, `browserEnv` wraps real DOM
 * canvases / ImageBitmap. In vitest (node environment), tests inject an env
 * backed by @napi-rs/canvas (real Skia rasterizer + encoders). One engine
 * codebase, real pixels on both sides — this is an architecture boundary,
 * not a mock.
 */

export interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** Anything drawable: a canvas, an ImageBitmap, an <img>, a napi Image. */
export interface Drawable {
  width: number;
  height: number;
}

export interface Ctx2D {
  readonly canvas: CanvasSurface;
  fillStyle: string;
  globalAlpha: number;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: 'low' | 'medium' | 'high';
  drawImage(image: Drawable, dx: number, dy: number): void;
  drawImage(image: Drawable, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(
    image: Drawable,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  getImageData(x: number, y: number, w: number, h: number): PixelData;
  putImageData(data: PixelData, dx: number, dy: number): void;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;
}

export interface CanvasSurface extends Drawable {
  getContext(type: '2d'): Ctx2D;
}

export interface CanvasEnv {
  createCanvas(width: number, height: number): CanvasSurface;
  /** Build a canvas from raw RGBA pixels (TIFF/GIF frame paths). */
  canvasFromPixels(data: Uint8ClampedArray, width: number, height: number): CanvasSurface;
  /**
   * Decode a natively-supported raster blob (JPEG/PNG/WebP/GIF first frame/
   * BMP/AVIF/ICO). EXIF orientation is applied where the platform supports it.
   */
  decodeRaster(blob: Blob): Promise<Drawable>;
  /** Encode a canvas to a Blob. Rejects when the format is unsupported. */
  encode(canvas: CanvasSurface, mime: string, quality?: number): Promise<Blob>;
  /** Cached probe: can this environment encode `mime` at all? */
  probeEncode(mime: string): Promise<boolean>;
  /** Rasterize (already-sanitized) SVG text at an exact pixel size. */
  rasterizeSvg(svgText: string, width: number, height: number): Promise<Drawable>;
}

// ---------------------------------------------------------------------------
// Browser environment
// ---------------------------------------------------------------------------

const encodeProbeCache = new Map<string, Promise<boolean>>();

function domCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Canvas could not encode ${mime}`));
      },
      mime,
      quality
    );
  });
}

export const browserEnv: CanvasEnv = {
  createCanvas(width, height) {
    return domCanvas(width, height) as unknown as CanvasSurface;
  },

  canvasFromPixels(data, width, height) {
    const canvas = domCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvas as unknown as CanvasSurface;
  },

  async decodeRaster(blob) {
    // createImageBitmap is the fast path and honours EXIF orientation.
    if (typeof createImageBitmap === 'function') {
      try {
        return (await createImageBitmap(blob, {
          imageOrientation: 'from-image',
        } as ImageBitmapOptions)) as unknown as Drawable;
      } catch {
        // Fall through to the <img> path (some browsers reject some formats).
      }
    }
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'sync';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image decode failed'));
        img.src = url;
      });
      return img as unknown as Drawable;
    } finally {
      // The bitmap data is decoded by load time; the URL can be released.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  },

  encode(canvas, mime, quality) {
    return canvasToBlob(canvas as unknown as HTMLCanvasElement, mime, quality);
  },

  probeEncode(mime) {
    let probe = encodeProbeCache.get(mime);
    if (!probe) {
      probe = (async () => {
        try {
          const blob = await canvasToBlob(domCanvas(2, 2), mime, 0.9);
          return blob.type === mime;
        } catch {
          return false;
        }
      })();
      encodeProbeCache.set(mime, probe);
    }
    return probe;
  },

  async rasterizeSvg(svgText, width, height) {
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('SVG could not be rasterized'));
        img.src = url;
      });
      const canvas = domCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('2D canvas context unavailable');
      ctx.drawImage(img, 0, 0, width, height);
      return canvas as unknown as CanvasSurface;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  },
};

/** Release a decoded drawable's backing store where the platform allows. */
export function releaseDrawable(drawable: Drawable): void {
  const maybe = drawable as unknown as { close?: () => void };
  if (typeof maybe.close === 'function') {
    try {
      maybe.close();
    } catch {
      // already released
    }
  }
}
