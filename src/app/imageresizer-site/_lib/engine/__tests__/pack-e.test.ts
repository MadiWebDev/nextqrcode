// @vitest-environment node
/**
 * Phase E engine tests: ICO container round-trip, redaction, palette,
 * colour-vision simulation, OG card composition, PDF planning helpers.
 */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import { buildIco, FAVICON_SIZES } from '../ico';
import { applyRedactions } from '../redact';
import { extractPalette } from '../palette';
import { simulateColourVision } from '../simulate';
import { composeOgCard } from '../ogcard';
import { parsePageRange, scaleForDpi } from '../../pdf-plan';
import { passportPixels, PASSPORT_PRESETS } from '../../passport-presets';
import type { CanvasSurface } from '../canvas-env';

function solid(r: number, g: number, b: number, w = 60, h = 40): CanvasSurface {
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

describe('ICO writer', () => {
  it('packs a spec-shaped container with PNG entries', () => {
    const fakePng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);
    const ico = buildIco([
      { size: 32, png: fakePng },
      { size: 16, png: fakePng },
    ]);
    const dv = new DataView(ico.buffer);
    expect(dv.getUint16(0, true)).toBe(0); // reserved
    expect(dv.getUint16(2, true)).toBe(1); // type icon
    expect(dv.getUint16(4, true)).toBe(2); // count
    // Entries sorted ascending: first is 16px.
    expect(ico[6]).toBe(16);
    expect(ico[22]).toBe(32);
    expect(dv.getUint32(6 + 8, true)).toBe(fakePng.length);
    const firstOffset = dv.getUint32(6 + 12, true);
    expect(firstOffset).toBe(6 + 2 * 16);
    expect(ico[firstOffset]).toBe(0x89); // PNG magic at the offset
    expect(FAVICON_SIZES).toContain(512);
  });

  it('stores 256 as byte 0 per spec', () => {
    const ico = buildIco([{ size: 256, png: new Uint8Array([1]) }]);
    expect(ico[6]).toBe(0);
  });
});

describe('redaction', () => {
  it('solid mode blacks out exactly the region', () => {
    const out = applyRedactions(nodeEnv, solid(200, 200, 200), [
      { x: 0.5, y: 0, w: 0.5, h: 1, mode: 'solid', strength: 0 },
    ]);
    expect(pixel(out, 45, 20)).toEqual([0, 0, 0, 255]);
    expect(pixel(out, 15, 20)).toEqual([200, 200, 200, 255]);
  });

  it('pixelate makes blocks uniform and destroys detail', () => {
    const out = applyRedactions(nodeEnv, solid(200, 200, 200), [
      { x: 0, y: 0, w: 1, h: 1, mode: 'pixelate', strength: 12 },
    ]);
    expect(pixel(out, 3, 3)).toEqual(pixel(out, 10, 10));
  });

  it('blur lowers local contrast inside the region', () => {
    const card = createCanvas(60, 40);
    const cctx = card.getContext('2d');
    cctx.fillStyle = '#000';
    cctx.fillRect(0, 0, 30, 40);
    cctx.fillStyle = '#fff';
    cctx.fillRect(30, 0, 30, 40);
    const out = applyRedactions(nodeEnv, card as unknown as CanvasSurface, [
      { x: 0.25, y: 0, w: 0.5, h: 1, mode: 'blur', strength: 6 },
    ]);
    const edge = pixel(out, 29, 20)[0];
    expect(edge).toBeGreaterThan(10); // no longer pure black
    expect(edge).toBeLessThan(245);
  });
});

describe('palette', () => {
  it('extracts dominant colours with shares', () => {
    const canvas = createCanvas(20, 10);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 15, 10);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(15, 0, 5, 10);
    const data = ctx.getImageData(0, 0, 20, 10).data;
    const palette = extractPalette(data, 4);
    expect(palette.length).toBeGreaterThanOrEqual(2);
    expect(palette[0].hex).toBe('#ff0000');
    expect(palette[0].share).toBeGreaterThan(0.6);
    expect(palette.some((c) => c.hex === '#0000ff')).toBe(true);
  });
});

describe('colour-vision simulation', () => {
  it('achromatopsia produces grey (r=g=b) output', () => {
    const out = simulateColourVision(nodeEnv, solid(200, 60, 30), 'achromatopsia');
    const [r, g, b] = pixel(out, 10, 10);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('protanopia shifts pure red toward a darker olive', () => {
    const out = simulateColourVision(nodeEnv, solid(255, 0, 0), 'protanopia');
    const [r, g, b] = pixel(out, 10, 10);
    // Machado 1.0: R' = .567*255 ≈ 145, G' = .558*255 ≈ 142, B' = 0
    expect(r).toBeGreaterThan(135);
    expect(r).toBeLessThan(155);
    expect(g).toBeGreaterThan(135);
    expect(b).toBe(0);
  });
});

describe('OG card', () => {
  it('composes at 1200x630 with accent bar and brand colour', () => {
    const out = composeOgCard(nodeEnv, {
      backgroundColor: '#101828',
      accentColor: '#ff5500',
      title: 'A perfectly reasonable test title',
      subtitle: 'Subtitle goes here',
      brand: 'example.com',
      textColor: '#ffffff',
    });
    expect(out.width).toBe(1200);
    expect(out.height).toBe(630);
    expect(pixel(out, 600, 2)).toEqual([0xff, 0x55, 0x00, 255]); // accent bar
    expect(pixel(out, 600, 400)).toEqual([0x10, 0x18, 0x28, 255]); // background away from text
  });
});

describe('PDF planning helpers', () => {
  it('parses page ranges with clamping and de-duplication', () => {
    expect(parsePageRange('1-3,5', 10)).toEqual([1, 2, 3, 5]);
    expect(parsePageRange('2,2,9-20', 8)).toEqual([2, 8]);
    expect(parsePageRange('', 4)).toEqual([1, 2, 3, 4]);
    expect(parsePageRange('garbage', 3)).toEqual([]);
  });

  it('scales for DPI and clamps giant pages', () => {
    expect(scaleForDpi(72, 612, 792)).toBe(1);
    expect(scaleForDpi(144, 612, 792)).toBe(2);
    const clamped = scaleForDpi(300, 612, 792);
    expect(792 * clamped).toBeLessThanOrEqual(4200.5);
  });
});

describe('passport presets', () => {
  it('US 2x2in at 300dpi is 600x600; UK 35x45mm is 413x531', () => {
    const us = PASSPORT_PRESETS.find((p) => p.id === 'us')!;
    expect(passportPixels(us)).toEqual({ width: 600, height: 600 });
    const uk = PASSPORT_PRESETS.find((p) => p.id === 'uk')!;
    expect(passportPixels(uk)).toEqual({ width: 413, height: 531 });
    for (const preset of PASSPORT_PRESETS) {
      expect(preset.source.length).toBeGreaterThan(5);
      expect(preset.verifiedAt).toBe('2026-11-13');
    }
  });
});
