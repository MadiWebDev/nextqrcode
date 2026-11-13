// @vitest-environment node
/**
 * Adjustment + effect tests with pixel-level assertions on real canvases:
 * each operation must provably change the right pixels in the right way.
 */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import { applyAdjustments, DEFAULT_ADJUSTMENTS, type AdjustmentSet } from '../adjustments';
import { addBorder, drawImageWatermark, drawTextWatermark, roundCorners, setBackground } from '../effects';
import type { CanvasSurface } from '../canvas-env';

function solid(r: number, g: number, b: number, a = 255, w = 40, h = 30): CanvasSurface {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
  ctx.fillRect(0, 0, w, h);
  return canvas as unknown as CanvasSurface;
}

function pixel(surface: CanvasSurface, x: number, y: number): number[] {
  const d = surface.getContext('2d').getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2], d[3]];
}

const adj = (patch: Partial<AdjustmentSet>): AdjustmentSet => ({ ...DEFAULT_ADJUSTMENTS, ...patch });

describe('adjustments', () => {
  it('brightness raises and lowers channel values', () => {
    const up = applyAdjustments(nodeEnv, solid(100, 100, 100), adj({ brightness: 20 }));
    expect(pixel(up, 5, 5)[0]).toBeGreaterThan(140);
    const down = applyAdjustments(nodeEnv, solid(100, 100, 100), adj({ brightness: -20 }));
    expect(pixel(down, 5, 5)[0]).toBeLessThan(60);
  });

  it('grayscale makes r=g=b; invert negates; sepia warms', () => {
    const gray = applyAdjustments(nodeEnv, solid(200, 60, 30), adj({ grayscale: 100 }));
    const [r, g, b] = pixel(gray, 5, 5);
    expect(r).toBe(g);
    expect(g).toBe(b);
    const inv = applyAdjustments(nodeEnv, solid(10, 100, 250), adj({ invert: true }));
    expect(pixel(inv, 5, 5)).toEqual([245, 155, 5, 255]);
    const sep = applyAdjustments(nodeEnv, solid(200, 60, 30), adj({ sepia: 100 }));
    const [sr, , sb] = pixel(sep, 5, 5);
    expect(sr).toBeGreaterThan(sb); // sepia shifts toward warm brown
  });

  it('saturation 0 equals grayscale; exposure brightens multiplicatively', () => {
    const desat = applyAdjustments(nodeEnv, solid(200, 60, 30), adj({ saturation: -100 }));
    const [r, g, b] = pixel(desat, 5, 5);
    expect(r).toBe(g);
    expect(g).toBe(b);
    const exp = applyAdjustments(nodeEnv, solid(64, 64, 64), adj({ exposure: 50 }));
    expect(pixel(exp, 5, 5)[0]).toBeGreaterThan(110); // ~2^1 gain
  });

  it('blur reduces local contrast; sharpen increases edge contrast', () => {
    // Half black / half white test card.
    const card = createCanvas(40, 30);
    const cctx = card.getContext('2d');
    cctx.fillStyle = '#000';
    cctx.fillRect(0, 0, 20, 30);
    cctx.fillStyle = '#fff';
    cctx.fillRect(20, 0, 20, 30);
    const surface = card as unknown as CanvasSurface;

    const blurred = applyAdjustments(nodeEnv, surface, adj({ blur: 3 }));
    const edgePixel = pixel(blurred, 19, 15)[0];
    expect(edgePixel).toBeGreaterThan(30); // no longer pure black at the edge
    expect(edgePixel).toBeLessThan(225);

    const sharpened = applyAdjustments(nodeEnv, surface, adj({ sharpen: 80 }));
    expect(pixel(sharpened, 19, 15)[0]).toBe(0); // still clipped black
    expect(pixel(sharpened, 10, 15)[0]).toBe(0);
    expect(pixel(sharpened, 30, 15)[0]).toBe(255);
  });

  it('pixelate produces uniform blocks', () => {
    const gradient = createCanvas(40, 30);
    const gctx = gradient.getContext('2d');
    const grad = gctx.createLinearGradient(0, 0, 40, 0);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(1, '#ffffff');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 40, 30);
    const out = applyAdjustments(nodeEnv, gradient as unknown as CanvasSurface, adj({ pixelate: 10 }));
    // Within one 10px block, pixels share a value.
    expect(pixel(out, 1, 5)).toEqual(pixel(out, 8, 5));
    expect(pixel(out, 1, 5)).not.toEqual(pixel(out, 35, 5));
  });

  it('default adjustments are a no-op copy', () => {
    const out = applyAdjustments(nodeEnv, solid(12, 34, 56), adj({}));
    expect(pixel(out, 3, 3)).toEqual([12, 34, 56, 255]);
  });
});

describe('effects', () => {
  it('roundCorners clears the corner pixels and keeps the centre', () => {
    const out = roundCorners(nodeEnv, solid(255, 0, 0, 255, 40, 40), 12);
    expect(pixel(out, 0, 0)[3]).toBe(0);
    expect(pixel(out, 39, 39)[3]).toBe(0);
    expect(pixel(out, 20, 20)).toEqual([255, 0, 0, 255]);
  });

  it('addBorder grows the canvas and paints the frame colour', () => {
    const out = addBorder(nodeEnv, solid(0, 0, 255, 255, 20, 10), 5, '#00ff00');
    expect(out.width).toBe(30);
    expect(out.height).toBe(20);
    expect(pixel(out, 2, 2)).toEqual([0, 255, 0, 255]);
    expect(pixel(out, 15, 10)).toEqual([0, 0, 255, 255]);
  });

  it('setBackground fills transparency with the chosen colour', () => {
    const out = setBackground(nodeEnv, solid(255, 0, 0, 0, 10, 10), '#123456');
    expect(pixel(out, 5, 5)).toEqual([0x12, 0x34, 0x56, 255]);
  });

  it('text watermark changes pixels in its area; image watermark places the overlay', () => {
    const base = solid(255, 255, 255, 255, 200, 100);
    const marked = drawTextWatermark(nodeEnv, base, {
      text: 'DRAFT',
      position: 'center',
      opacity: 0.9,
      sizeFraction: 0.12,
      color: '#000000',
    });
    const centre = pixel(marked, 100, 50);
    expect(centre[0]).toBeLessThan(255); // dark text over white centre

    const logo = solid(255, 0, 0, 255, 20, 20);
    const withLogo = drawImageWatermark(nodeEnv, base, logo, {
      position: 'bottom-right',
      opacity: 1,
      widthFraction: 0.2,
    });
    // Overlay: 40x40 at bottom-right with 6px margin → spans x 154-193, y 54-93.
    expect(pixel(withLogo, 170, 75)).toEqual([255, 0, 0, 255]);
    expect(pixel(withLogo, 5, 5)).toEqual([255, 255, 255, 255]);
  });
});
