/**
 * Shared "canvas → output blob" helper for the single-image tools: handles
 * the GIF single-frame path and the honest AVIF-unsupported error so every
 * tool reports format limits the same way.
 */
import { browserEnv, type CanvasSurface } from './engine/canvas-env';
import { encodeGif } from './engine/gif';
import { MIME_BY_FORMAT, type OutputFormat } from './engine/types';

export async function encodeCanvasOutput(
  canvas: CanvasSurface,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  if (format === 'gif') {
    const ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return encodeGif([{ pixels: pixels.data, delayMs: 100 }], canvas.width, canvas.height);
  }
  const mime = MIME_BY_FORMAT[format];
  if (!(await browserEnv.probeEncode(mime))) {
    throw new Error(
      format === 'avif'
        ? 'This browser cannot create AVIF files (AVIF encoding currently works in Chrome). Choose WebP or JPG instead.'
        : `This browser cannot create ${format.toUpperCase()} files. Choose another format.`
    );
  }
  return browserEnv.encode(canvas, mime, format === 'png' ? undefined : quality);
}
