/**
 * Pixel-level image adjustments.
 *
 * Pointwise adjustments (exposure, brightness, contrast, saturation, hue,
 * grayscale mix, sepia mix, invert) run in a single ImageData pass using the
 * standard colour matrices (the same math as SVG feColorMatrix). Spatial
 * adjustments (blur, sharpen, pixelate) run as separate convolution /
 * resampling passes. The pipeline order is fixed and documented in the
 * editor UI: pointwise first, then blur/sharpen, then pixelate.
 *
 * All values are plain numbers so adjustment sets serialize cleanly into
 * editor history / presets / pipelines.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';

export interface AdjustmentSet {
  /** -100..100 (multiplicative gain = 1 + v/100 applied in linear-ish space) */
  exposure: number;
  /** -100..100 (additive: v * 2.55) */
  brightness: number;
  /** -100..100 */
  contrast: number;
  /** -100..100 (0 = unchanged) */
  saturation: number;
  /** -180..180 degrees */
  hue: number;
  /** 0..100 mix toward grayscale */
  grayscale: number;
  /** 0..100 mix toward sepia */
  sepia: number;
  /** Invert colours. */
  invert: boolean;
  /** Levels input black point 0..254 (default 0). */
  levelsBlack: number;
  /** Levels input white point 1..255 (default 255). */
  levelsWhite: number;
  /** Levels gamma 0.2..3 (default 1). */
  levelsGamma: number;
  /** Box blur radius in px, 0..20 */
  blur: number;
  /** 0..100 convolution sharpen strength */
  sharpen: number;
  /** Pixel block size in px, 0 = off */
  pixelate: number;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentSet = {
  exposure: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  grayscale: 0,
  sepia: 0,
  invert: false,
  levelsBlack: 0,
  levelsWhite: 255,
  levelsGamma: 1,
  blur: 0,
  sharpen: 0,
  pixelate: 0,
};

export function isDefaultAdjustments(a: AdjustmentSet): boolean {
  return (Object.keys(DEFAULT_ADJUSTMENTS) as Array<keyof AdjustmentSet>).every(
    (k) => a[k] === DEFAULT_ADJUSTMENTS[k]
  );
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

function applyPointwise(data: Uint8ClampedArray, a: AdjustmentSet): void {
  const exposureGain = Math.pow(2, a.exposure / 50); // ±2 stops at ±100
  const brightnessAdd = a.brightness * 2.55;
  const contrastFactor = (259 * (a.contrast * 2.55 + 255)) / (255 * (259 - a.contrast * 2.55));
  const sat = 1 + a.saturation / 100;
  const grayMix = a.grayscale / 100;
  const sepiaMix = a.sepia / 100;

  // Saturation + hue combined matrix (feColorMatrix saturate ∘ hueRotate).
  const cosA = Math.cos((a.hue * Math.PI) / 180);
  const sinA = Math.sin((a.hue * Math.PI) / 180);
  const lumR = 0.213, lumG = 0.715, lumB = 0.072;
  // hueRotate matrix rows
  const hr = [
    lumR + cosA * (1 - lumR) + sinA * -lumR,
    lumG + cosA * -lumG + sinA * -lumG,
    lumB + cosA * -lumB + sinA * (1 - lumB),
  ];
  const hg = [
    lumR + cosA * -lumR + sinA * 0.143,
    lumG + cosA * (1 - lumG) + sinA * 0.14,
    lumB + cosA * -lumB + sinA * -0.283,
  ];
  const hb = [
    lumR + cosA * -lumR + sinA * -(1 - lumR),
    lumG + cosA * -lumG + sinA * lumG,
    lumB + cosA * (1 - lumB) + sinA * lumB,
  ];
  // saturation matrix rows
  const sr = [lumR + (1 - lumR) * sat, lumG * (1 - sat), lumB * (1 - sat)];
  const sg = [lumR * (1 - sat), lumG + (1 - lumG) * sat, lumB * (1 - sat)];
  const sb = [lumR * (1 - sat), lumG * (1 - sat), lumB + (1 - lumB) * sat];
  // combined m = hue ∘ saturation (apply saturation first, then hue)
  const m = [
    [
      hr[0] * sr[0] + hr[1] * sg[0] + hr[2] * sb[0],
      hr[0] * sr[1] + hr[1] * sg[1] + hr[2] * sb[1],
      hr[0] * sr[2] + hr[1] * sg[2] + hr[2] * sb[2],
    ],
    [
      hg[0] * sr[0] + hg[1] * sg[0] + hg[2] * sb[0],
      hg[0] * sr[1] + hg[1] * sg[1] + hg[2] * sb[1],
      hg[0] * sr[2] + hg[1] * sg[2] + hg[2] * sb[2],
    ],
    [
      hb[0] * sr[0] + hb[1] * sg[0] + hb[2] * sb[0],
      hb[0] * sr[1] + hb[1] * sg[1] + hb[2] * sb[1],
      hb[0] * sr[2] + hb[1] * sg[2] + hb[2] * sb[2],
    ],
  ];

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // input levels first (black/white points + gamma)
    if (a.levelsBlack !== 0 || a.levelsWhite !== 255 || a.levelsGamma !== 1) {
      const range = Math.max(1, a.levelsWhite - a.levelsBlack);
      const gammaExp = 1 / Math.max(0.05, a.levelsGamma);
      const level = (v: number) => {
        const t = Math.min(1, Math.max(0, (v - a.levelsBlack) / range));
        return 255 * Math.pow(t, gammaExp);
      };
      r = level(r);
      g = level(g);
      b = level(b);
    }

    // colour matrix (saturation + hue)
    const mr = m[0][0] * r + m[0][1] * g + m[0][2] * b;
    const mg = m[1][0] * r + m[1][1] * g + m[1][2] * b;
    const mb = m[2][0] * r + m[2][1] * g + m[2][2] * b;
    r = mr;
    g = mg;
    b = mb;

    // exposure + brightness + contrast
    r = contrastFactor * (r * exposureGain + brightnessAdd - 128) + 128;
    g = contrastFactor * (g * exposureGain + brightnessAdd - 128) + 128;
    b = contrastFactor * (b * exposureGain + brightnessAdd - 128) + 128;

    // grayscale mix
    if (grayMix > 0) {
      const lum = lumR * r + lumG * g + lumB * b;
      r += (lum - r) * grayMix;
      g += (lum - g) * grayMix;
      b += (lum - b) * grayMix;
    }
    // sepia mix
    if (sepiaMix > 0) {
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      r += (tr - r) * sepiaMix;
      g += (tg - g) * sepiaMix;
      b += (tb - b) * sepiaMix;
    }
    if (a.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    data[i] = clamp255(r);
    data[i + 1] = clamp255(g);
    data[i + 2] = clamp255(b);
  }
}

/** Separable box blur, `passes` iterations approximate a gaussian. Exported for the enhance module's unsharp mask. */
export function boxBlur(data: Uint8ClampedArray, width: number, height: number, radius: number): void {
  if (radius < 1) return;
  const tmp = new Uint8ClampedArray(data.length);
  const passes = 2;
  for (let pass = 0; pass < passes; pass++) {
    // horizontal
    for (let y = 0; y < height; y++) {
      const acc = [0, 0, 0, 0];
      const row = y * width;
      for (let x = -radius; x <= radius; x++) {
        const cx = Math.min(width - 1, Math.max(0, x));
        const idx = (row + cx) * 4;
        acc[0] += data[idx];
        acc[1] += data[idx + 1];
        acc[2] += data[idx + 2];
        acc[3] += data[idx + 3];
      }
      const count = radius * 2 + 1;
      for (let x = 0; x < width; x++) {
        const idx = (row + x) * 4;
        tmp[idx] = acc[0] / count;
        tmp[idx + 1] = acc[1] / count;
        tmp[idx + 2] = acc[2] / count;
        tmp[idx + 3] = acc[3] / count;
        const leaveX = Math.max(0, x - radius);
        const enterX = Math.min(width - 1, x + radius + 1);
        const li = (row + leaveX) * 4;
        const ei = (row + enterX) * 4;
        acc[0] += data[ei] - data[li];
        acc[1] += data[ei + 1] - data[li + 1];
        acc[2] += data[ei + 2] - data[li + 2];
        acc[3] += data[ei + 3] - data[li + 3];
      }
    }
    data.set(tmp);
    // vertical
    for (let x = 0; x < width; x++) {
      const acc = [0, 0, 0, 0];
      for (let y = -radius; y <= radius; y++) {
        const cy = Math.min(height - 1, Math.max(0, y));
        const idx = (cy * width + x) * 4;
        acc[0] += data[idx];
        acc[1] += data[idx + 1];
        acc[2] += data[idx + 2];
        acc[3] += data[idx + 3];
      }
      const count = radius * 2 + 1;
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        tmp[idx] = acc[0] / count;
        tmp[idx + 1] = acc[1] / count;
        tmp[idx + 2] = acc[2] / count;
        tmp[idx + 3] = acc[3] / count;
        const leaveY = Math.max(0, y - radius);
        const enterY = Math.min(height - 1, y + radius + 1);
        const li = (leaveY * width + x) * 4;
        const ei = (enterY * width + x) * 4;
        acc[0] += data[ei] - data[li];
        acc[1] += data[ei + 1] - data[li + 1];
        acc[2] += data[ei + 2] - data[li + 2];
        acc[3] += data[ei + 3] - data[li + 3];
      }
    }
    data.set(tmp);
  }
}

function sharpenPass(data: Uint8ClampedArray, width: number, height: number, strength: number): void {
  const src = new Uint8ClampedArray(data);
  const center = 1 + 4 * strength;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const up = (Math.max(0, y - 1) * width + x) * 4;
      const down = (Math.min(height - 1, y + 1) * width + x) * 4;
      const left = (y * width + Math.max(0, x - 1)) * 4;
      const right = (y * width + Math.min(width - 1, x + 1)) * 4;
      for (let c = 0; c < 3; c++) {
        data[idx + c] = clamp255(
          center * src[idx + c] - strength * (src[up + c] + src[down + c] + src[left + c] + src[right + c])
        );
      }
    }
  }
}

function pixelatePass(
  env: CanvasEnv,
  canvas: CanvasSurface,
  blockSize: number
): CanvasSurface {
  const { width, height } = canvas;
  const smallW = Math.max(1, Math.round(width / blockSize));
  const smallH = Math.max(1, Math.round(height / blockSize));
  const small = env.createCanvas(smallW, smallH);
  const sctx = small.getContext('2d');
  sctx.imageSmoothingEnabled = true;
  sctx.drawImage(canvas, 0, 0, smallW, smallH);
  const out = env.createCanvas(width, height);
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, smallW, smallH, 0, 0, width, height);
  return out;
}

/** Apply an adjustment set to a source, returning a new canvas. */
export function applyAdjustments(
  env: CanvasEnv,
  source: Drawable,
  adjustments: AdjustmentSet
): CanvasSurface {
  let canvas = env.createCanvas(source.width, source.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0);

  const needsPointwise =
    adjustments.exposure !== 0 ||
    adjustments.brightness !== 0 ||
    adjustments.contrast !== 0 ||
    adjustments.saturation !== 0 ||
    adjustments.hue !== 0 ||
    adjustments.grayscale !== 0 ||
    adjustments.sepia !== 0 ||
    adjustments.invert ||
    adjustments.levelsBlack !== 0 ||
    adjustments.levelsWhite !== 255 ||
    adjustments.levelsGamma !== 1;
  if (needsPointwise || adjustments.blur > 0 || adjustments.sharpen > 0) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (needsPointwise) applyPointwise(imageData.data, adjustments);
    if (adjustments.blur > 0) {
      boxBlur(imageData.data, canvas.width, canvas.height, Math.round(adjustments.blur));
    }
    if (adjustments.sharpen > 0) {
      sharpenPass(imageData.data, canvas.width, canvas.height, adjustments.sharpen / 100);
    }
    ctx.putImageData(imageData, 0, 0);
  }
  if (adjustments.pixelate > 1) {
    canvas = pixelatePass(env, canvas, Math.round(adjustments.pixelate));
  }
  return canvas;
}
