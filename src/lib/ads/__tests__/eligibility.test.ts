import { describe, expect, it } from 'vitest';
import { qrPageEligibility } from '@/lib/ads/eligibility';

describe('qrPageEligibility', () => {
  const base = {
    visibility: 'public',
    moderationStatus: 'passed',
    title: 'Summer Festival 2026 Tickets',
  };

  it('marks a public, passed, titled QR indexable', () => {
    const r = qrPageEligibility({
      ...base,
      description: 'A QR code for the summer festival entry gates.',
    });
    expect(r.indexable).toBe(true);
    expect(r.adsEligible).toBe(true);
  });

  it('blocks indexing when not public', () => {
    const r = qrPageEligibility({ ...base, visibility: 'private' });
    expect(r.indexable).toBe(false);
    expect(r.adsEligible).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/visibility/);
  });

  it('blocks indexing when moderation is pending or flagged', () => {
    for (const s of ['pending', 'flagged']) {
      const r = qrPageEligibility({ ...base, moderationStatus: s });
      expect(r.indexable).toBe(false);
    }
  });

  it('blocks indexing without a unique title', () => {
    for (const t of [undefined, '', 'QR Code', 'My QR Code', 'short']) {
      const r = qrPageEligibility({ ...base, title: t });
      expect(r.indexable).toBe(false);
    }
  });

  it('withholds ads from thin but indexable pages', () => {
    const r = qrPageEligibility({ ...base, scanCount: 2 });
    expect(r.indexable).toBe(true);
    expect(r.adsEligible).toBe(false);
  });

  it('allows ads with 10+ scans even without a description', () => {
    const r = qrPageEligibility({ ...base, scanCount: 10 });
    expect(r.adsEligible).toBe(true);
  });
});
