import { describe, expect, it } from 'vitest';
import {
  estimateModules,
  printSizeFor,
  scoreScanability,
  type ScanabilityInput,
} from '@/lib/qr/scanability';

const baseInput: ScanabilityInput = {
  fgColor: '#000000',
  bgColor: '#ffffff',
  hasLogo: false,
  logoSizeRatio: 0,
  payloadLength: 10,
  ecLevel: 'M',
  quietZoneModules: 4,
  outputSizePx: 300,
};

describe('scoreScanability', () => {
  it('scores a perfect black-on-white code at 100 with no warnings', () => {
    const result = scoreScanability(baseInput);
    expect(result.score).toBe(100);
    expect(result.warnings).toEqual([]);
  });

  it('heavily penalizes poor contrast (< 3)', () => {
    const result = scoreScanability({ ...baseInput, fgColor: '#aaaaaa' });
    expect(result.warnings.some((w) => w.includes('Poor contrast'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('may not scan'))).toBe(true);
    expect(result.score).toBe(60);
  });

  it('moderately penalizes low contrast (< 4.5)', () => {
    const result = scoreScanability({ ...baseInput, fgColor: '#888888' });
    expect(result.warnings.some((w) => w.includes('Low contrast'))).toBe(true);
    expect(result.score).toBe(85);
  });

  it('flags inverted colors (light modules on dark background)', () => {
    const result = scoreScanability({
      ...baseInput,
      fgColor: '#ffffff',
      bgColor: '#000000',
    });
    expect(result.warnings.some((w) => w.includes('Inverted colors'))).toBe(true);
    expect(result.score).toBe(90);
  });

  it('flags an oversized logo covering > 25% of the code', () => {
    const result = scoreScanability({
      ...baseInput,
      hasLogo: true,
      logoSizeRatio: 0.3,
      ecLevel: 'H',
    });
    expect(result.warnings.some((w) => w.includes('>25%'))).toBe(true);
    expect(result.score).toBe(75);
  });

  it('flags a logo when the EC level is not H or Q', () => {
    const result = scoreScanability({
      ...baseInput,
      hasLogo: true,
      logoSizeRatio: 0.1,
      ecLevel: 'M',
    });
    expect(result.warnings.some((w) => w.includes('H or Q'))).toBe(true);
    expect(result.score).toBe(80);
  });

  it('accepts a modest logo with EC level H without warnings', () => {
    const result = scoreScanability({
      ...baseInput,
      hasLogo: true,
      logoSizeRatio: 0.1,
      ecLevel: 'H',
    });
    expect(result.score).toBe(100);
    expect(result.warnings).toEqual([]);
  });

  it('flags a very dense code and small render size', () => {
    const result = scoreScanability({
      ...baseInput,
      payloadLength: 600,
      outputSizePx: 200,
    });
    expect(result.warnings.some((w) => w.includes('Very dense'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('too small'))).toBe(true);
    expect(result.score).toBe(80);
  });

  it('flags a quiet zone narrower than 4 modules', () => {
    const result = scoreScanability({ ...baseInput, quietZoneModules: 2 });
    expect(result.warnings.some((w) => w.includes('Quiet zone'))).toBe(true);
    expect(result.score).toBe(90);
  });

  it('clamps the score at 0 when everything is wrong', () => {
    const result = scoreScanability({
      ...baseInput,
      fgColor: '#111111', // poor contrast AND inverted vs black
      bgColor: '#000000',
      hasLogo: true,
      logoSizeRatio: 0.4,
      ecLevel: 'L',
      quietZoneModules: 1,
    });
    expect(result.score).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(3);
  });

  it('scores an empty payload at 0 with a warning', () => {
    const result = scoreScanability({ ...baseInput, payloadLength: 0 });
    expect(result.score).toBe(0);
    expect(result.warnings.some((w) => w.includes('Empty payload'))).toBe(true);
    expect(result.printSize.minCm).toBe(0);
  });

  it('computes sane print sizes (29 modules → ≈2.8 cm incl. quiet zone)', () => {
    const modules = estimateModules(30, 'M');
    expect(modules).toBe(29);
    const result = scoreScanability({ ...baseInput, payloadLength: 30 });
    // (29 + 2×4 quiet zone) × 0.075 cm = 2.775 cm → 2.8 cm
    expect(result.printSize.minCm).toBeGreaterThan(2.4);
    expect(result.printSize.minCm).toBeLessThan(3.1);
    expect(result.printSize.recommendedCm).toBeCloseTo(result.printSize.minCm * 1.5, 1);
  });
});

describe('printSizeFor', () => {
  it('applies the distance/10 rule of thumb', () => {
    expect(printSizeFor(2)).toBe(20);
    expect(printSizeFor(0.5)).toBe(5);
    expect(printSizeFor(1.23)).toBeCloseTo(12.3, 1);
  });

  it('returns 0 for non-positive distances', () => {
    expect(printSizeFor(0)).toBe(0);
    expect(printSizeFor(-3)).toBe(0);
  });
});
