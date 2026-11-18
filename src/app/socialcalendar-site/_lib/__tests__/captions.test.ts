import { describe, expect, it } from 'vitest';
import {
  countCaption,
  countEmojis,
  extractHashtags,
  extractMentions,
  extractUrls,
  trimSuggestion,
  validateCaption,
} from '../captions';
import { getPlatform } from '../platforms';
import type { PlatformSpec } from '../platforms';

const x = getPlatform('x') as PlatformSpec;
const instagram = getPlatform('instagram') as PlatformSpec;
const snapchat = getPlatform('snapchat') as PlatformSpec;

describe('extractUrls', () => {
  it('finds http/https URLs and strips trailing sentence punctuation', () => {
    expect(extractUrls('See https://example.com/a and http://foo.bar/b.')).toEqual([
      'https://example.com/a',
      'http://foo.bar/b',
    ]);
  });
  it('returns an empty array when there are no URLs', () => {
    expect(extractUrls('no links here, just www.example.com')).toEqual([]);
  });
});

describe('extractHashtags / extractMentions', () => {
  it('extracts hashtag bodies without the # sign', () => {
    expect(extractHashtags('Hello #SocialMedia #launch_2026!')).toEqual([
      'SocialMedia',
      'launch_2026',
    ]);
  });
  it('does not treat a URL fragment as a hashtag', () => {
    expect(extractHashtags('Read https://example.com/post#frag #real')).toEqual(['real']);
  });
  it('extracts mentions without the @ sign and ignores email addresses', () => {
    expect(extractMentions('Thanks @alice and @bob.smith!')).toEqual(['alice', 'bob.smith']);
    expect(extractMentions('mail me@example.com please')).toEqual([]);
  });
});

describe('countEmojis', () => {
  it('counts single emojis', () => {
    expect(countEmojis('😀🎉')).toBe(2);
    expect(countEmojis('plain text')).toBe(0);
  });
  it('counts a ZWJ family emoji as one', () => {
    expect(countEmojis('👨‍👩‍👧‍👦')).toBe(1);
    expect(countEmojis('Family 👨‍👩‍👧‍👦 day 😀')).toBe(2);
  });
});

describe('countCaption', () => {
  it('applies X weighting: URL counts as 23 and an emoji counts as 2', () => {
    const counts = countCaption('Hi 😀 https://example.com/abc', x);
    // chars: "Hi " (3) + emoji (1) + " " (1) + URL (23 code points) = 28
    expect(counts.chars).toBe(28);
    // weighted: same 28, except the emoji costs 2 instead of 1 -> 29
    // (the URL's real length is already 23, so its fixed price changes nothing here)
    expect(counts.weighted).toBe(29);
    expect(counts.urls).toBe(1);
    expect(counts.emojis).toBe(1);
    expect(counts.remaining).toBe(280 - 29);
    expect(counts.overLimit).toBe(false);
  });

  it('counts the same caption at face value on Instagram', () => {
    const counts = countCaption('Hi 😀 https://example.com/abc', instagram);
    expect(counts.weighted).toBe(28);
    expect(counts.weighted).toBe(counts.chars);
  });

  it('lets a long URL fit on X because it is weighted at 23', () => {
    const url = `https://example.com/${'a'.repeat(80)}`; // 100 code points
    const counts = countCaption(`${'x'.repeat(250)} ${url}`, x);
    expect(counts.chars).toBe(351);
    expect(counts.weighted).toBe(274);
    expect(counts.overLimit).toBe(false);
  });

  it('detects over-limit captions', () => {
    const counts = countCaption('a'.repeat(281), x);
    expect(counts.weighted).toBe(281);
    expect(counts.overLimit).toBe(true);
    expect(counts.remaining).toBe(-1);
  });

  it('counts hashtags and mentions', () => {
    const counts = countCaption('Hi @alice #one #two', instagram);
    expect(counts.hashtags).toBe(2);
    expect(counts.mentions).toBe(1);
  });

  it('never reports a visual-first platform as over limit', () => {
    const counts = countCaption('some overlaid text', snapchat);
    expect(counts.overLimit).toBe(false);
    expect(counts.remaining).toBe(0);
  });
});

describe('validateCaption', () => {
  it('errors when over the limit', () => {
    const result = validateCaption('a'.repeat(281), x);
    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
  it('warns when hashtags exceed guidance but stays ok', () => {
    const tags = Array.from({ length: 11 }, (_, i) => `#tag${i}`).join(' ');
    const result = validateCaption(`Launch day ${tags}`, instagram);
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
  it('warns on an empty caption for a text-capable platform only', () => {
    expect(validateCaption('   ', instagram).warnings.length).toBeGreaterThan(0);
    expect(validateCaption('', snapchat).warnings).toHaveLength(0);
  });
});

describe('trimSuggestion', () => {
  it('returns the text unchanged when it already fits', () => {
    expect(trimSuggestion('short and sweet', x)).toBe('short and sweet');
    expect(trimSuggestion('any overlaid text', snapchat)).toBe('any overlaid text');
  });

  it('cuts an over-limit caption to a fitting prefix at a boundary', () => {
    const original = 'The quick brown fox jumps over the lazy dog. '.repeat(20).trim();
    const suggestion = trimSuggestion(original, x);
    expect(suggestion.length).toBeLessThan(original.length);
    expect(countCaption(suggestion, x).weighted).toBeLessThanOrEqual(280);
    expect(countCaption(suggestion, x).overLimit).toBe(false);
    // Prefix-preserving: the suggestion is the start of the original,
    // cut where a sentence or word boundary was.
    expect(original.startsWith(suggestion)).toBe(true);
    expect([' ', '.']).toContain(original[suggestion.length]);
  });

  it('preserves a trailing hashtag block when it fits', () => {
    const original = `${'word '.repeat(100).trim()} #launch #sale`;
    const suggestion = trimSuggestion(original, x);
    expect(suggestion.endsWith('#launch #sale')).toBe(true);
    expect(countCaption(suggestion, x).weighted).toBeLessThanOrEqual(280);
  });
});
