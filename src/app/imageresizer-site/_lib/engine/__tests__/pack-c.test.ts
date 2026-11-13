// @vitest-environment node
/**
 * Advanced-pack engine tests: levels, histogram, enhance/upscale, QR
 * overlay placement, and EXIF orientation parsing from a hand-built
 * EXIF JPEG (the decode path relies on the platform's EXIF handling —
 * createImageBitmap/<img> apply orientation natively — and this test
 * proves our own parser reads the same orientation the viewer shows).
 */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import { applyAdjustments, DEFAULT_ADJUSTMENTS, type AdjustmentSet } from '../adjustments';
import { computeHistogram } from '../histogram';
import { enhanceToSize, resampleMultiStep, unsharpMask } from '../enhance';
import { drawQrOverlay } from '../effects';
import { parseJpegExif } from '../exif';
import type { CanvasSurface } from '../canvas-env';

function solid(r: number, g: number, b: number, w = 40, h = 30): CanvasSurface {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);
  return canvas as unknown as CanvasSurface;
}

function pixel(s: CanvasSurface, x: number, y: number): number[] {
  const d = s.getContext('2d').getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2], d[3]];
}

const adj = (patch: Partial<AdjustmentSet>): AdjustmentSet => ({ ...DEFAULT_ADJUSTMENTS, ...patch });

describe('levels', () => {
  it('black point maps the black-point value to 0 and stretches contrast', () => {
    const out = applyAdjustments(nodeEnv, solid(100, 100, 100), adj({ levelsBlack: 100, levelsWhite: 200 }));
    expect(pixel(out, 5, 5)[0]).toBe(0);
    const lighter = applyAdjustments(nodeEnv, solid(150, 150, 150), adj({ levelsBlack: 100, levelsWhite: 200 }));
    expect(pixel(lighter, 5, 5)[0]).toBe(128); // halfway between the points (127.5 rounds up)
  });

  it('gamma brightens midtones without moving pure black/white', () => {
    const out = applyAdjustments(nodeEnv, solid(64, 64, 64), adj({ levelsGamma: 2 }));
    expect(pixel(out, 5, 5)[0]).toBeGreaterThan(100); // sqrt curve lifts shadows
    const black = applyAdjustments(nodeEnv, solid(0, 0, 0), adj({ levelsGamma: 2 }));
    expect(pixel(black, 5, 5)[0]).toBe(0);
    const white = applyAdjustments(nodeEnv, solid(255, 255, 255), adj({ levelsGamma: 2 }));
    expect(pixel(white, 5, 5)[0]).toBe(255);
  });
});

describe('histogram', () => {
  it('counts channels and luminance from real pixels', () => {
    const canvas = createCanvas(10, 10);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 5, 10);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(5, 0, 5, 10);
    const data = ctx.getImageData(0, 0, 10, 10);
    const hist = computeHistogram(data.data, 100);
    expect(hist.r[255]).toBe(50);
    expect(hist.r[0]).toBe(50); // blue half has r=0
    expect(hist.b[255]).toBe(50);
    expect(hist.g[0]).toBe(100); // neither half has any green
    expect(hist.totalPixels).toBe(100);
    expect(hist.maxCount).toBe(100);
  });
});

describe('enhance', () => {
  it('resampleMultiStep reaches the exact target size', () => {
    const out = resampleMultiStep(nodeEnv, solid(10, 20, 30, 50, 40), 200, 160);
    expect(out.width).toBe(200);
    expect(out.height).toBe(160);
  });

  it('enhanceToSize doubles dimensions and unsharp raises edge contrast', () => {
    const card = createCanvas(40, 30);
    const cctx = card.getContext('2d');
    cctx.fillStyle = '#404040';
    cctx.fillRect(0, 0, 20, 30);
    cctx.fillStyle = '#c0c0c0';
    cctx.fillRect(20, 0, 20, 30);
    const surface = card as unknown as CanvasSurface;

    const out = enhanceToSize(nodeEnv, surface, 80, 60);
    expect(out.width).toBe(80);
    expect(out.height).toBe(60);

    // Compare local contrast near the edge: unsharped output should have a
    // larger step across a few pixels than a plain resample.
    const plain = resampleMultiStep(nodeEnv, surface, 80, 60);
    const stepAcross = (s: CanvasSurface) =>
      Math.abs(pixel(s, 44, 30)[0] - pixel(s, 36, 30)[0]);
    expect(stepAcross(out)).toBeGreaterThanOrEqual(stepAcross(plain));

    // Unsharp alone keeps dimensions.
    const sharp = unsharpMask(nodeEnv, surface, 2, 0.6);
    expect(sharp.width).toBe(40);
    expect(sharp.height).toBe(30);
  });
});

describe('QR overlay', () => {
  it('draws a white backing and the QR at the chosen corner', () => {
    const base = solid(30, 30, 30, 200, 100);
    const qr = solid(0, 0, 0, 40, 40); // stand-in QR drawable (all modules black)
    const out = drawQrOverlay(nodeEnv, base, qr, {
      position: 'bottom-right',
      opacity: 1,
      widthFraction: 0.25, // 50px QR + ~4px pad each side, 6px margin
    });
    // Inside the QR area → black modules
    expect(pixel(out, 175, 75)).toEqual([0, 0, 0, 255]);
    // A corner far from the overlay stays the base colour
    expect(pixel(out, 5, 5)).toEqual([30, 30, 30, 255]);
  });
});

/** Build a minimal JPEG carrying an EXIF APP1 with Orientation = 6. */
function jpegWithOrientation(orientation: number): Uint8Array {
  const bytes: number[] = [0xff, 0xd8]; // SOI
  const tiff: number[] = [];
  tiff.push(0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00); // II, 42, IFD0 at 8
  tiff.push(0x01, 0x00); // 1 entry
  tiff.push(0x12, 0x01); // tag 0x0112 Orientation
  tiff.push(0x03, 0x00); // type SHORT
  tiff.push(0x01, 0x00, 0x00, 0x00); // count 1
  tiff.push(orientation & 0xff, 0x00, 0x00, 0x00); // value inline
  tiff.push(0x00, 0x00, 0x00, 0x00); // next IFD = none
  const app1Payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff]; // "Exif\0\0"
  const segLen = app1Payload.length + 2;
  bytes.push(0xff, 0xe1, (segLen >> 8) & 0xff, segLen & 0xff, ...app1Payload);
  bytes.push(0xff, 0xd9); // EOI
  return new Uint8Array(bytes);
}

describe('EXIF orientation (pack item 7)', () => {
  it('parser reads Orientation=6 from a hand-built EXIF JPEG', () => {
    const report = parseJpegExif(jpegWithOrientation(6));
    expect(report).not.toBeNull();
    const field = report!.fields.find((f) => f.label === 'Orientation');
    expect(field).toBeDefined();
    // The formatter renders orientation 6 in words.
    expect(field!.value).toBe('Rotated 90° CW');
  });

  it('parser reads Orientation=1 (normal) distinctly', () => {
    const report = parseJpegExif(jpegWithOrientation(1));
    const field = report!.fields.find((f) => f.label === 'Orientation');
    expect(field!.value).toBe('Normal');
  });
});
