/**
 * Colour-vision deficiency simulation. Uses the Machado, Oliveira &
 * Fernandes (2009) matrices at full severity for the -opia types (and a
 * 0.6-severity blend for the -omaly types), which are the standard
 * physiologically-based simulation matrices; achromatopsia uses the
 * Rec. 709 luminance the rest of the engine uses.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';

export type ColourVisionType =
  | 'protanopia'
  | 'protanomaly'
  | 'deuteranopia'
  | 'deuteranomaly'
  | 'tritanopia'
  | 'tritanomaly'
  | 'achromatopsia';

export const COLOUR_VISION_LABELS: Record<ColourVisionType, string> = {
  protanopia: 'Protanopia (no red cones)',
  protanomaly: 'Protanomaly (weak red)',
  deuteranopia: 'Deuteranopia (no green cones)',
  deuteranomaly: 'Deuteranomaly (weak green)',
  tritanopia: 'Tritanopia (no blue cones)',
  tritanomaly: 'Tritanomaly (weak blue)',
  achromatopsia: 'Achromatopsia (no colour)',
};

type Matrix3 = [number, number, number, number, number, number, number, number, number];

const MACHADO_1_0: Partial<Record<ColourVisionType, Matrix3>> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};
const MACHADO_0_6: Partial<Record<ColourVisionType, Matrix3>> = {
  protanomaly: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
  deuteranomaly: [0.8, 0.2, 0, 0.267, 0.733, 0, 0, 0.133, 0.867],
  tritanomaly: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
};

export function simulationMatrix(type: ColourVisionType): Matrix3 {
  if (type === 'achromatopsia') {
    return [0.213, 0.715, 0.072, 0.213, 0.715, 0.072, 0.213, 0.715, 0.072];
  }
  return (MACHADO_1_0[type] ?? MACHADO_0_6[type]) as Matrix3;
}

export function simulateColourVision(
  env: CanvasEnv,
  source: Drawable,
  type: ColourVisionType
): CanvasSurface {
  const canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  const m = simulationMatrix(type);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = m[0] * r + m[1] * g + m[2] * b;
    data[i + 1] = m[3] * r + m[4] * g + m[5] * b;
    data[i + 2] = m[6] * r + m[7] * g + m[8] * b;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
