import { describe, expect, it } from 'vitest';
import {
  buildUtmUrl,
  findBannedWords,
  findDuplicateTags,
  parseHashtagInput,
  slugifyCampaign,
} from '../utm';

describe('utm builder', () => {
  it('builds a tagged URL and slugifies the campaign', () => {
    const r = buildUtmUrl('https://example.com/landing?ref=home#top', {
      source: 'instagram',
      medium: 'social',
      campaign: 'Spring Sale 2027!',
    });
    expect(r.ok).toBe(true);
    expect(r.url).toContain('utm_source=instagram');
    expect(r.url).toContain('utm_campaign=spring-sale-2027');
    expect(r.url).toContain('ref=home');
    expect(r.url?.endsWith('#top')).toBe(true);
  });

  it('replaces existing utm params instead of duplicating', () => {
    const r = buildUtmUrl('https://example.com/?utm_source=old', {
      source: 'x',
      medium: 'social',
      campaign: 'launch',
    });
    expect(r.url?.match(/utm_source/g)).toHaveLength(1);
    expect(r.url).toContain('utm_source=x');
  });

  it('rejects invalid URLs and missing required params', () => {
    expect(buildUtmUrl('not a url', { source: 'a', medium: 'b', campaign: 'c' }).ok).toBe(false);
    expect(buildUtmUrl('ftp://x.com', { source: 'a', medium: 'b', campaign: 'c' }).ok).toBe(false);
    const missing = buildUtmUrl('https://x.com', { source: '', medium: 'b', campaign: 'c' });
    expect(missing.ok).toBe(false);
    expect(missing.errors.join(' ')).toMatch(/utm_source/);
  });

  it('slugify handles accents and punctuation', () => {
    expect(slugifyCampaign('Café Promo — Été')).toBe('cafe-promo-ete');
  });
});

describe('hashtag helpers', () => {
  it('parses and de-duplicates hashtag input', () => {
    expect(parseHashtagInput('#Food, food #Travel  travel')).toEqual(['Food', 'Travel']);
  });

  it('finds duplicates across groups', () => {
    const dups = findDuplicateTags([
      { name: 'A', tags: ['food', 'travel'] },
      { name: 'B', tags: ['Food', 'recipes'] },
    ]);
    expect(dups).toEqual([{ tag: 'food', groups: ['A', 'B'] }]);
  });

  it('finds banned words as whole words only', () => {
    expect(findBannedWords('This is a scam-free zone, no spam here', ['spam', 'sca'])).toEqual([
      'spam',
    ]);
  });
});
