/**
 * Phase 0 smoke test: payload builder sanity + contrast utility.
 * Comprehensive per-type payload tests land in Phase 2.
 */
import { describe, expect, it } from 'vitest';
import { generateQRData, getContrastRatio } from '@/lib/qr-helpers';

describe('generateQRData (smoke)', () => {
  it('builds a WIFI payload with escaping', () => {
    const out = generateQRData('wifi', { ssid: 'My;Net', password: 'p"ass', encryption: 'WPA' });
    expect(out).toBe('WIFI:S:My\\;Net;T:WPA;P:p\\"ass;;');
  });

  it('builds a geo URI', () => {
    expect(generateQRData('geo', { lat: '35.6762', lng: '139.6503' })).toBe('geo:35.6762,139.6503');
  });

  it('returns empty string when required fields are missing', () => {
    expect(generateQRData('wifi', { ssid: '' })).toBe('');
    expect(generateQRData('url', {})).toBe('');
  });
});

describe('getContrastRatio', () => {
  it('returns ~21 for black on white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('returns 1 for identical colors', () => {
    expect(getContrastRatio('#123456', '#123456')).toBeCloseTo(1, 2);
  });
});
