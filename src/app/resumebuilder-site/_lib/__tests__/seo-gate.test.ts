import { describe, it, expect } from 'vitest';
import { SEO_PAGES, evaluateSeoPage, gateReport, publishedSeoPages, type SeoPage } from '../seo-pages';

describe('SEO quality gate (D-RB-01)', () => {
  it('every page in the starter set passes the gate', () => {
    const failures = gateReport();
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });

  it('publishes a small starter set, not the full programmatic volume', () => {
    const published = publishedSeoPages();
    expect(published.length).toBe(SEO_PAGES.length);
    expect(published.length).toBeLessThanOrEqual(20);
    expect(published.filter((p) => p.type === 'role').length).toBeGreaterThanOrEqual(8);
  });

  it('rejects a thin page', () => {
    const thin: SeoPage = {
      slug: 'thin', type: 'role', title: 'Thin Page Title For Testing Purposes',
      description: 'x'.repeat(130), h1: 'Thin', intro: ['Only one paragraph.'], faqs: [],
    };
    expect(evaluateSeoPage(thin, SEO_PAGES).length).toBeGreaterThan(0);
  });

  it('rejects a near-duplicate of a sibling', () => {
    const nurse = SEO_PAGES.find((p) => p.slug === 'nurse')!;
    const clone: SeoPage = { ...nurse, slug: 'nurse-copy', title: 'Nurse Resume Template Copy — Free' };
    const reasons = evaluateSeoPage(clone, [...SEO_PAGES, clone]);
    expect(reasons.some((r) => r.includes('similar'))).toBe(true);
  });
});
