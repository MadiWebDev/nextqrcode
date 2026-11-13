/**
 * User-defined processing pipelines: an ordered list of steps applied to
 * every image in a batch. Steps are plain serializable data (so pipelines
 * can be saved as presets and shared as JSON), and the runner maps each
 * step onto the same engine functions the single tools use — a pipeline
 * never does anything a single tool cannot.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './engine/canvas-env';
import { cropImage, flipImage, rotateImage } from './engine/crop';
import { renderResize } from './engine/resize';
import { applyAdjustments, DEFAULT_ADJUSTMENTS } from './engine/adjustments';
import {
  addBorder,
  drawTextWatermark,
  roundCorners,
  setBackground,
  type WatermarkPosition,
} from './engine/effects';
import type { OutputFormat } from './engine/types';

export type PipelineStepType =
  | 'crop-percent'
  | 'resize-percent'
  | 'resize-exact'
  | 'rotate'
  | 'flip'
  | 'adjust'
  | 'background'
  | 'corners'
  | 'border'
  | 'watermark-text';

export interface PipelineStep {
  id: string;
  type: PipelineStepType;
  enabled: boolean;
  params: Record<string, number | string | boolean>;
}

export interface PipelineDef {
  name: string;
  steps: PipelineStep[];
  outputFormat: Exclude<OutputFormat, 'gif'>;
  quality: number;
}

export const STEP_LABELS: Record<PipelineStepType, string> = {
  'crop-percent': 'Crop (percent)',
  'resize-percent': 'Resize by percent',
  'resize-exact': 'Resize to exact size',
  rotate: 'Rotate',
  flip: 'Flip',
  adjust: 'Adjust colours',
  background: 'Fill background',
  corners: 'Rounded corners',
  border: 'Add border',
  'watermark-text': 'Text watermark',
};

let stepCounter = 0;
export function newStepId(): string {
  stepCounter += 1;
  return `step-${Date.now().toString(36)}-${stepCounter}`;
}

export function defaultStep(type: PipelineStepType): PipelineStep {
  const params: Record<string, number | string | boolean> = {};
  switch (type) {
    case 'crop-percent':
      Object.assign(params, { x: 0, y: 0, w: 100, h: 100 });
      break;
    case 'resize-percent':
      Object.assign(params, { percent: 50 });
      break;
    case 'resize-exact':
      Object.assign(params, { width: 1200, height: 1200, fit: 'contain' });
      break;
    case 'rotate':
      Object.assign(params, { angle: 90 });
      break;
    case 'flip':
      Object.assign(params, { horizontal: true, vertical: false });
      break;
    case 'adjust':
      Object.assign(params, { brightness: 0, contrast: 0, saturation: 0, grayscale: 0 });
      break;
    case 'background':
      Object.assign(params, { color: '#ffffff' });
      break;
    case 'corners':
      Object.assign(params, { radius: 24 });
      break;
    case 'border':
      Object.assign(params, { width: 8, color: '#111827' });
      break;
    case 'watermark-text':
      Object.assign(params, {
        text: '© My Brand',
        position: 'bottom-right',
        opacity: 60,
        size: 5,
        color: '#ffffff',
      });
      break;
  }
  return { id: newStepId(), type, enabled: true, params };
}

const num = (step: PipelineStep, key: string, fallback: number): number => {
  const v = step.params[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
};
const str = (step: PipelineStep, key: string, fallback: string): string => {
  const v = step.params[key];
  return typeof v === 'string' ? v : fallback;
};
const bool = (step: PipelineStep, key: string, fallback: boolean): boolean => {
  const v = step.params[key];
  return typeof v === 'boolean' ? v : fallback;
};

/** Apply every enabled step in order. Returns a fresh canvas. */
export function runPipeline(
  env: CanvasEnv,
  source: Drawable,
  def: PipelineDef
): CanvasSurface {
  let current: Drawable = source;
  for (const step of def.steps) {
    if (!step.enabled) continue;
    switch (step.type) {
      case 'crop-percent': {
        const x = (num(step, 'x', 0) / 100) * current.width;
        const y = (num(step, 'y', 0) / 100) * current.height;
        const w = (num(step, 'w', 100) / 100) * current.width;
        const h = (num(step, 'h', 100) / 100) * current.height;
        current = cropImage(env, current, { x, y, width: w, height: h });
        break;
      }
      case 'resize-percent':
        current = renderResize(env, current, { percent: num(step, 'percent', 100) });
        break;
      case 'resize-exact':
        current = renderResize(env, current, {
          targetWidth: num(step, 'width', current.width),
          targetHeight: num(step, 'height', current.height),
          fit: str(step, 'fit', 'contain') === 'stretch' ? 'stretch' : 'contain',
        });
        break;
      case 'rotate':
        current = rotateImage(env, current, num(step, 'angle', 0));
        break;
      case 'flip':
        current = flipImage(env, current, bool(step, 'horizontal', false), bool(step, 'vertical', false));
        break;
      case 'adjust':
        current = applyAdjustments(env, current, {
          ...DEFAULT_ADJUSTMENTS,
          brightness: num(step, 'brightness', 0),
          contrast: num(step, 'contrast', 0),
          saturation: num(step, 'saturation', 0),
          grayscale: num(step, 'grayscale', 0),
        });
        break;
      case 'background':
        current = setBackground(env, current, str(step, 'color', '#ffffff'));
        break;
      case 'corners':
        current = roundCorners(env, current, num(step, 'radius', 0));
        break;
      case 'border':
        current = addBorder(env, current, num(step, 'width', 0), str(step, 'color', '#111827'));
        break;
      case 'watermark-text': {
        const text = str(step, 'text', '');
        if (text.trim()) {
          current = drawTextWatermark(env, current, {
            text,
            position: str(step, 'position', 'bottom-right') as WatermarkPosition,
            opacity: num(step, 'opacity', 60) / 100,
            sizeFraction: num(step, 'size', 5) / 100,
            color: str(step, 'color', '#ffffff'),
          });
        }
        break;
      }
    }
  }
  if (current === source) {
    const canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }
  return current as CanvasSurface;
}

/** Built-in starter pipelines — plain definitions of the same step types. */
export const BUILTIN_PIPELINES: PipelineDef[] = [
  {
    name: 'Web optimize',
    outputFormat: 'webp',
    quality: 0.82,
    steps: [
      { id: 'b1', type: 'resize-exact', enabled: true, params: { width: 1600, height: 1600, fit: 'contain' } },
    ],
  },
  {
    name: 'Social square',
    outputFormat: 'jpeg',
    quality: 0.9,
    steps: [
      { id: 'b2', type: 'crop-percent', enabled: true, params: { x: 10, y: 10, w: 80, h: 80 } },
      { id: 'b3', type: 'resize-exact', enabled: true, params: { width: 1080, height: 1080, fit: 'contain' } },
    ],
  },
  {
    name: 'Watermark & compress',
    outputFormat: 'jpeg',
    quality: 0.8,
    steps: [
      {
        id: 'b4',
        type: 'watermark-text',
        enabled: true,
        params: { text: '© My Brand', position: 'bottom-right', opacity: 60, size: 5, color: '#ffffff' },
      },
      { id: 'b5', type: 'resize-exact', enabled: true, params: { width: 1920, height: 1920, fit: 'contain' } },
    ],
  },
];
