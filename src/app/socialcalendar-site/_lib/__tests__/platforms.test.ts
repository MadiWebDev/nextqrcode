import { describe, expect, it } from 'vitest';
import {
  PLATFORM_IDS,
  PLATFORM_SPECS_REVIEWED,
  PLATFORM_SPECS_VERSION,
  PLATFORMS,
  getPlatform,
} from '../platforms';

const EXPECTED_IDS = [
  'instagram',
  'facebook',
  'tiktok',
  'youtube',
  'youtube-shorts',
  'linkedin',
  'x',
  'pinterest',
  'threads',
  'snapchat',
  'whatsapp-status',
  'reddit',
  'telegram',
  'bluesky',
  'google-business',
];

describe('platform registry', () => {
  it('has exactly the 15 expected unique platform ids', () => {
    expect(PLATFORMS).toHaveLength(15);
    expect(new Set(PLATFORM_IDS).size).toBe(15);
    expect([...PLATFORM_IDS].sort()).toEqual([...EXPECTED_IDS].sort());
    expect(PLATFORM_IDS).toEqual(PLATFORMS.map((p) => p.id));
  });

  it('is versioned and dated', () => {
    expect(PLATFORM_SPECS_VERSION).toBe(1);
    expect(PLATFORM_SPECS_REVIEWED).toBe('2026-11-17');
  });

  it('every spec is complete with positive media dimensions', () => {
    for (const spec of PLATFORMS) {
      expect(spec.name.length).toBeGreaterThan(0);
      expect(spec.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(spec.charLimit).toBeGreaterThanOrEqual(0);
      expect(spec.hashtagGuidance.length).toBeGreaterThan(0);
      expect(spec.maxHashtagsGuidance).toBeGreaterThanOrEqual(0);
      expect(spec.contentTypes.length).toBeGreaterThan(0);
      expect(spec.notes.length).toBeGreaterThan(0);
      expect(spec.imageSpecs.length).toBeGreaterThan(0);
      expect(spec.videoSpecs.length).toBeGreaterThan(0);
      for (const img of spec.imageSpecs) {
        expect(img.width).toBeGreaterThan(0);
        expect(img.height).toBeGreaterThan(0);
      }
      for (const vid of spec.videoSpecs) {
        expect(vid.width).toBeGreaterThan(0);
        expect(vid.height).toBeGreaterThan(0);
        expect(vid.maxDurationSec).toBeGreaterThan(0);
      }
    }
  });

  it('carries the X weighted-counting rules and plain rules elsewhere', () => {
    const x = getPlatform('x');
    expect(x?.charLimit).toBe(280);
    expect(x?.urlCountsAs).toBe(23);
    expect(x?.emojiWeight).toBe(2);
    for (const spec of PLATFORMS.filter((p) => p.id !== 'x')) {
      expect(spec.emojiWeight).toBe(1);
      expect(spec.urlCountsAs).toBeNull();
    }
  });

  it('marks the visual-first platforms with a zero character limit', () => {
    expect(getPlatform('snapchat')?.charLimit).toBe(0);
    expect(getPlatform('whatsapp-status')?.charLimit).toBe(0);
  });

  it('getPlatform resolves known ids and returns undefined otherwise', () => {
    expect(getPlatform('instagram')?.name).toBe('Instagram');
    expect(getPlatform('google-business')?.charLimit).toBe(1500);
    expect(getPlatform('myspace')).toBeUndefined();
    expect(getPlatform('')).toBeUndefined();
  });
});
