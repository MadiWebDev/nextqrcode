/**
 * Animated GIF decode/encode with real frame compositing.
 *
 * Decode: gifuct-js (dynamic import — only loaded for GIF inputs). Frames are
 * composited onto a full-size RGBA buffer honouring disposal modes:
 *   0/1 keep, 2 restore to transparent, 3 restore previous frame.
 * Encode: gifenc — per-frame quantization + palette application.
 *
 * GIF is an indexed format: encoding quantizes each frame to ≤256 colours,
 * so an animated round-trip is faithful in dimensions/timing but lossy in
 * colour fidelity. The UI says this where GIF output is offered.
 */
import { ImageToolError } from './types';

export interface GifFrame {
  /** Full-frame composited RGBA pixels. */
  pixels: Uint8ClampedArray;
  delayMs: number;
}

export interface DecodedGif {
  width: number;
  height: number;
  frames: GifFrame[];
  /** True when the source actually has more than one frame. */
  animated: boolean;
}

export async function decodeGif(bytes: ArrayBuffer): Promise<DecodedGif> {
  const { parseGIF, decompressFrames } = await import('gifuct-js');
  let parsed;
  try {
    parsed = parseGIF(bytes);
  } catch {
    throw new ImageToolError('gif-decode-failed', 'This GIF could not be read — the file may be corrupted.');
  }
  const width = parsed.lsd.width;
  const height = parsed.lsd.height;
  const rawFrames = decompressFrames(parsed, true);
  if (rawFrames.length === 0) {
    throw new ImageToolError('gif-no-frames', 'This GIF contains no readable frames.');
  }

  const frames: GifFrame[] = [];
  let canvas = new Uint8ClampedArray(width * height * 4);
  let previous: Uint8ClampedArray | null = null;

  for (const frame of rawFrames) {
    // Disposal of the *previous* frame happens before drawing the next one;
    // gifuct reports each frame's own disposal for use at that point.
    if (frames.length > 0) {
      const prevDisposal = rawFrames[frames.length - 1].disposalType;
      if (prevDisposal === 2) {
        // Restore the previous frame's rect to transparent.
        const prev = rawFrames[frames.length - 1];
        for (let y = 0; y < prev.dims.height; y++) {
          const rowStart = ((prev.dims.top + y) * width + prev.dims.left) * 4;
          canvas.fill(0, rowStart, rowStart + prev.dims.width * 4);
        }
      } else if (prevDisposal === 3 && previous) {
        canvas = new Uint8ClampedArray(previous);
      }
    }
    previous = new Uint8ClampedArray(canvas);

    const { dims, patch } = frame;
    for (let y = 0; y < dims.height; y++) {
      for (let x = 0; x < dims.width; x++) {
        const srcIdx = (y * dims.width + x) * 4;
        if (patch[srcIdx + 3] === 0) continue; // transparent pixel: keep what's under it
        const dstIdx = ((dims.top + y) * width + (dims.left + x)) * 4;
        canvas[dstIdx] = patch[srcIdx];
        canvas[dstIdx + 1] = patch[srcIdx + 1];
        canvas[dstIdx + 2] = patch[srcIdx + 2];
        canvas[dstIdx + 3] = patch[srcIdx + 3];
      }
    }
    frames.push({ pixels: new Uint8ClampedArray(canvas), delayMs: Math.max(20, frame.delay || 100) });
  }

  return { width, height, frames, animated: frames.length > 1 };
}

export interface EncodeGifOptions {
  /** Loop count: 0 = forever. */
  repeat?: number;
}

/** Encode full-frame RGBA frames as an animated GIF blob. */
export async function encodeGif(
  frames: GifFrame[],
  width: number,
  height: number,
  options: EncodeGifOptions = {}
): Promise<Blob> {
  if (frames.length === 0) {
    throw new ImageToolError('gif-no-frames', 'There are no frames to encode.');
  }
  const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
  const encoder = GIFEncoder();
  frames.forEach((frame, i) => {
    const palette = quantize(frame.pixels, 256);
    const index = applyPalette(frame.pixels, palette);
    encoder.writeFrame(index, width, height, {
      palette,
      first: i === 0,
      repeat: options.repeat ?? 0,
      delay: frame.delayMs, // gifenc expects milliseconds (converts to 1/100s itself)
    });
  });
  encoder.finish();
  const bytes = encoder.bytes();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'image/gif' });
}
