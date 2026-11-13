/**
 * Histogram computation from real pixels: per-channel counts plus a
 * luminance channel. Pure function over ImageData-like buffers so it is
 * unit-testable and cheap to call on a downsampled copy of the canvas.
 */
export interface HistogramData {
  r: Uint32Array;
  g: Uint32Array;
  b: Uint32Array;
  lum: Uint32Array;
  maxCount: number;
  totalPixels: number;
}

export function computeHistogram(data: Uint8ClampedArray, pixelCount: number): HistogramData {
  const r = new Uint32Array(256);
  const g = new Uint32Array(256);
  const b = new Uint32Array(256);
  const lum = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue; // fully transparent pixels carry no colour
    r[data[i]] += 1;
    g[data[i + 1]] += 1;
    b[data[i + 2]] += 1;
    lum[Math.round(0.213 * data[i] + 0.715 * data[i + 1] + 0.072 * data[i + 2])] += 1;
  }
  let maxCount = 0;
  for (let i = 0; i < 256; i++) {
    maxCount = Math.max(maxCount, r[i], g[i], b[i], lum[i]);
  }
  return { r, g, b, lum, maxCount, totalPixels: pixelCount };
}
