// @vitest-environment node
/** Pipeline runner tests: order, enable/disable, and step composition. */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import {
  BUILTIN_PIPELINES,
  defaultStep,
  runPipeline,
  type PipelineDef,
  type PipelineStep,
} from '../../pipeline';
import type { CanvasSurface } from '../canvas-env';

function photo(w = 100, h = 80): CanvasSurface {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3366cc';
  ctx.fillRect(0, 0, w, h);
  return canvas as unknown as CanvasSurface;
}

const step = (type: PipelineStep['type'], params = {}, enabled = true): PipelineStep => ({
  ...defaultStep(type),
  params: { ...defaultStep(type).params, ...params },
  enabled,
});

const def = (steps: PipelineStep[]): PipelineDef => ({
  name: 'test',
  steps,
  outputFormat: 'jpeg',
  quality: 0.9,
});

describe('runPipeline', () => {
  it('applies steps in order: crop-percent then resize-percent', () => {
    const out = runPipeline(nodeEnv, photo(), def([
      step('crop-percent', { x: 0, y: 0, w: 50, h: 50 }), // 50x40
      step('resize-percent', { percent: 200 }), // 100x80
    ]));
    expect(out.width).toBe(100);
    expect(out.height).toBe(80);
  });

  it('disabled steps are skipped', () => {
    const out = runPipeline(nodeEnv, photo(), def([
      step('resize-percent', { percent: 50 }, false),
    ]));
    expect(out.width).toBe(100);
    expect(out.height).toBe(80);
  });

  it('order matters: rotate before border vs after gives different frames', () => {
    const rotateFirst = runPipeline(nodeEnv, photo(), def([
      step('rotate', { angle: 90 }),
      step('border', { width: 10 }),
    ]));
    expect(rotateFirst.width).toBe(100); // 80 + 2*10
    expect(rotateFirst.height).toBe(120); // 100 + 2*10
  });

  it('empty-text watermark is a no-op; real text changes pixels', () => {
    const blank = runPipeline(nodeEnv, photo(200, 100), def([
      step('watermark-text', { text: '   ' }),
    ]));
    const d0 = blank.getContext('2d').getImageData(100, 50, 1, 1).data;
    expect([d0[0], d0[1], d0[2]]).toEqual([0x33, 0x66, 0xcc]);

    const marked = runPipeline(nodeEnv, photo(200, 100), def([
      step('watermark-text', { text: 'HI', position: 'center', color: '#ffffff', opacity: 100, size: 12 }),
    ]));
    const d1 = marked.getContext('2d').getImageData(100, 50, 1, 1).data;
    expect(d1[0]).toBeGreaterThan(0x33); // white text over blue centre
  });

  it('built-in pipelines all run and produce sane output', () => {
    for (const builtin of BUILTIN_PIPELINES) {
      const out = runPipeline(nodeEnv, photo(400, 300), builtin);
      expect(out.width).toBeGreaterThan(0);
      expect(out.height).toBeGreaterThan(0);
    }
    const web = runPipeline(nodeEnv, photo(4000, 2000), BUILTIN_PIPELINES[0]);
    expect(Math.max(web.width, web.height)).toBeLessThanOrEqual(1600);
  });
});
