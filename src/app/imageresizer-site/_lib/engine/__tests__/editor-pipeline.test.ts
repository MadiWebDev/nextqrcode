// @vitest-environment node
/** Editor pipeline tests: stage order and composition behave end-to-end. */
import { describe, expect, it } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { nodeEnv } from './node-env';
import {
  DEFAULT_EDITOR_SETTINGS,
  renderEditorPipeline,
  type EditorSettings,
} from '../../editor';
import type { CanvasSurface } from '../canvas-env';

function photo(w = 100, h = 80): CanvasSurface {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3366cc';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffcc33';
  ctx.fillRect(10, 10, 30, 30);
  return canvas as unknown as CanvasSurface;
}

const settings = (patch: Partial<EditorSettings>): EditorSettings => ({
  ...DEFAULT_EDITOR_SETTINGS,
  adjustments: { ...DEFAULT_EDITOR_SETTINGS.adjustments },
  ...patch,
});

describe('renderEditorPipeline', () => {
  it('identity settings return an equal-size copy', () => {
    const out = renderEditorPipeline(nodeEnv, photo(), settings({}));
    expect(out.width).toBe(100);
    expect(out.height).toBe(80);
  });

  it('crop fractions then resize produce the exact target size', () => {
    const out = renderEditorPipeline(
      nodeEnv,
      photo(),
      settings({
        crop: { x: 0, y: 0, w: 0.5, h: 0.5 }, // → 50x40
        resize: { width: 200, height: 160 },
      })
    );
    expect(out.width).toBe(200);
    expect(out.height).toBe(160);
  });

  it('rotate 90 swaps dimensions after crop/resize', () => {
    const out = renderEditorPipeline(nodeEnv, photo(), settings({ angle: 90 }));
    expect(out.width).toBe(80);
    expect(out.height).toBe(100);
  });

  it('border grows the canvas last (after rotation)', () => {
    const out = renderEditorPipeline(
      nodeEnv,
      photo(),
      settings({ angle: 90, borderWidth: 4 })
    );
    expect(out.width).toBe(88);
    expect(out.height).toBe(108);
  });

  it('text watermark + adjustments compose without error', () => {
    const out = renderEditorPipeline(
      nodeEnv,
      photo(),
      settings({
        adjustments: { ...DEFAULT_EDITOR_SETTINGS.adjustments, grayscale: 100 },
        textWatermark: {
          text: '© test',
          position: 'bottom-right',
          opacity: 0.8,
          sizeFraction: 0.06,
          color: '#ffffff',
        },
      })
    );
    expect(out.width).toBe(100);
    const d = out.getContext('2d').getImageData(50, 70, 1, 1).data;
    expect(d[0]).toBe(d[1]); // grayscale held away from the watermark corner
    expect(d[1]).toBe(d[2]);
  });
});
