// @vitest-environment node
/**
 * Crop / rotate / flip tests on real canvas fixtures: output dimensions are
 * parsed from the encoded bytes, and a marker pixel proves orientation
 * actually changed (not just the canvas size).
 */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import { clampCropRect, cropImage, flipImage, rotateImage } from '../crop';
import { headerDimensions } from '../validate';
import type { CanvasSurface } from '../canvas-env';

function markerImage(): CanvasSurface {
  // 100x60, black with a white 10x10 square at the top-left corner.
  const canvas = createCanvas(100, 60);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 100, 60);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 10, 10);
  return canvas as unknown as CanvasSurface;
}

async function dimsOf(surface: CanvasSurface): Promise<{ width: number; height: number }> {
  const blob = await nodeEnv.encode(surface, 'image/png');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return headerDimensions(bytes, 'png')!;
}

function pixelAt(surface: CanvasSurface, x: number, y: number): number[] {
  const ctx = surface.getContext('2d');
  const data = ctx.getImageData(x, y, 1, 1).data;
  return [data[0], data[1], data[2], data[3]];
}

describe('crop', () => {
  it('clamps rectangles to bounds and rejects empty crops', () => {
    expect(clampCropRect({ x: -5, y: 0, width: 500, height: 30 }, 100, 60)).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 30,
    });
    expect(() => clampCropRect({ x: 99, y: 0, width: 0, height: 10 }, 100, 60)).toThrow();
  });

  it('crops the requested region', async () => {
    const out = cropImage(nodeEnv, markerImage(), { x: 0, y: 0, width: 10, height: 10 });
    expect(await dimsOf(out)).toEqual({ width: 10, height: 10 });
    expect(pixelAt(out, 5, 5)).toEqual([255, 255, 255, 255]); // the white marker
    const dark = cropImage(nodeEnv, markerImage(), { x: 50, y: 30, width: 20, height: 20 });
    expect(pixelAt(dark, 5, 5)).toEqual([0, 0, 0, 255]);
  });
});

describe('rotate + flip', () => {
  it('rotates 90° — dimensions swap and the marker moves corner', async () => {
    const out = rotateImage(nodeEnv, markerImage(), 90);
    expect(await dimsOf(out)).toEqual({ width: 60, height: 100 });
    // Top-left white square (10x10) rotated 90° CW lands at the top-right.
    expect(pixelAt(out, 55, 5)).toEqual([255, 255, 255, 255]);
    expect(pixelAt(out, 5, 5)).toEqual([0, 0, 0, 255]);
  });

  it('rotates 180° and arbitrary angles grow the canvas', async () => {
    const half = rotateImage(nodeEnv, markerImage(), 180);
    expect(await dimsOf(half)).toEqual({ width: 100, height: 60 });
    expect(pixelAt(half, 95, 55)).toEqual([255, 255, 255, 255]);
    const tilted = rotateImage(nodeEnv, markerImage(), 30);
    const dims = await dimsOf(tilted);
    expect(dims.width).toBeGreaterThan(100);
    expect(dims.height).toBeGreaterThan(60);
  });

  it('flips horizontally and vertically', async () => {
    const h = flipImage(nodeEnv, markerImage(), true);
    expect(pixelAt(h, 95, 5)).toEqual([255, 255, 255, 255]);
    expect(pixelAt(h, 5, 5)).toEqual([0, 0, 0, 255]);
    const v = flipImage(nodeEnv, markerImage(), false, true);
    expect(pixelAt(v, 5, 55)).toEqual([255, 255, 255, 255]);
  });
});
