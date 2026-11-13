/**
 * Dominant-colour palette extraction: histogram quantization over RGB
 * buckets (5 bits/channel), weighted by saturation so muddy background
 * averages don't drown out the colours a human would name, then greedy
 * diversity selection so the palette isn't five shades of the same beige.
 */

export interface PaletteColour {
  hex: string;
  r: number;
  g: number;
  b: number;
  /** Share of sampled pixels (0..1). */
  share: number;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const part = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function extractPalette(data: Uint8ClampedArray, count = 6): PaletteColour[] {
  interface Bucket {
    rSum: number;
    gSum: number;
    bSum: number;
    n: number;
    weight: number;
  }
  const buckets = new Map<number, Bucket>();
  let total = 0;
  // Sample every pixel of the (already downsampled by the caller) buffer.
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue; // ignore (near-)transparent pixels
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { rSum: 0, gSum: 0, bSum: 0, n: 0, weight: 0 };
      buckets.set(key, bucket);
    }
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    bucket.rSum += r;
    bucket.gSum += g;
    bucket.bSum += b;
    bucket.n += 1;
    bucket.weight += 0.35 + saturation; // vibrant colours count more
    total += 1;
  }
  if (total === 0) return [];

  const candidates = [...buckets.values()]
    .map((bucket) => ({
      r: bucket.rSum / bucket.n,
      g: bucket.gSum / bucket.n,
      b: bucket.bSum / bucket.n,
      share: bucket.n / total,
      weight: bucket.weight,
    }))
    .sort((a, b) => b.weight - a.weight);

  const picked: typeof candidates = [];
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    // Diversity: skip colours too close to an already-picked one.
    const tooClose = picked.some((p) => {
      const d = Math.hypot(p.r - candidate.r, p.g - candidate.g, p.b - candidate.b);
      return d < 48;
    });
    if (!tooClose) picked.push(candidate);
  }
  // If diversity filtering starved the list, top up with the next best.
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return picked.map((c) => ({
    hex: rgbToHex(c.r, c.g, c.b),
    r: Math.round(c.r),
    g: Math.round(c.g),
    b: Math.round(c.b),
    share: c.share,
  }));
}
