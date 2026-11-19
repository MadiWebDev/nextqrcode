import { describe, it, expect } from 'vitest';
import { loadAllTemplates, TEMPLATE_IDS } from '../registry';
import { uniquenessKey } from '../types';
import { buildBlocks } from '../build-blocks';
import { paginate, usableHeight } from '../types';
import { newResumeDoc } from '../../defaults';
import { rt } from '../../schema';

describe('template registry', () => {
  it('loads every registered template with complete metadata', async () => {
    const templates = await loadAllTemplates();
    expect(templates).toHaveLength(TEMPLATE_IDS.length);
    expect(TEMPLATE_IDS.length).toBeGreaterThanOrEqual(12);
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.why.length).toBeGreaterThan(40);
      expect(t.pageSizes).toContain('a4');
      expect(t.supportsRtl).toBe(true);
      expect(t.tokens.palettes.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('enforces the uniqueness rule: no two templates share (layout, header, heading)', async () => {
    const templates = await loadAllTemplates();
    const seen = new Map<string, string>();
    for (const t of templates) {
      const key = uniquenessKey(t);
      expect(seen.has(key), `${t.id} collides with ${seen.get(key)} on ${key}`).toBe(false);
      seen.set(key, t.id);
    }
  });

  it('every template sample builds blocks in reading order and paginates without loss', async () => {
    const templates = await loadAllTemplates();
    for (const t of templates) {
      const sample = t.sample();
      expect(sample.basics.name.length).toBeGreaterThan(2);
      expect(sample.basics.email).toContain('@example.');
      const blocks = buildBlocks(sample, t);
      expect(blocks[0].kind).toBe('header');
      expect(blocks.length).toBeGreaterThan(5);
      // Reading order: all main-column blocks precede side-column blocks.
      const cols = blocks.map((b) => b.column);
      const firstSide = cols.indexOf('side');
      if (firstSide !== -1) {
        expect(cols.slice(firstSide).every((c) => c === 'side')).toBe(true);
      }
      for (const size of ['a4', 'letter'] as const) {
        const pages = paginate(blocks, usableHeight(size, sample.theme.margin));
        const total = pages.reduce((n, p) => n + p.blocks.length, 0);
        expect(total).toBe(blocks.length);
        expect(pages.length).toBeGreaterThanOrEqual(1);
        expect(pages.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('templates work with an empty document and with long content (1–3 pages)', async () => {
    const templates = await loadAllTemplates();
    for (const t of templates) {
      const empty = newResumeDoc({ templateId: t.id });
      const emptyBlocks = buildBlocks(empty, t);
      expect(emptyBlocks).toHaveLength(1); // header only, no crash
      const long = t.sample();
      const exp = long.sections.find((s) => s.kind === 'experience');
      if (exp?.experience) {
        for (let i = 0; i < 8; i++) {
          exp.experience.push({
            ...exp.experience[0],
            id: `extra-${i}`,
            bullets: [rt.bullets(['Delivered measurable results across a long programme of work with multiple stakeholders and a multi-year timeline that required careful planning, steady communication and consistent delivery against agreed milestones and quality standards.'])],
          });
        }
      }
      const blocks = buildBlocks(long, t);
      const pages = paginate(blocks, usableHeight('a4', 'normal'));
      expect(pages.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('paginate keeps headings with the following block', () => {
    const blocks = [
      { id: 'a', kind: 'rich' as const, height: 900, column: 'main' as const, payload: {} },
      { id: 't', kind: 'section-title' as const, height: 30, keepWithNext: true, column: 'main' as const, payload: {} },
      { id: 'b', kind: 'rich' as const, height: 100, column: 'main' as const, payload: {} },
    ];
    const pages = paginate(blocks, 1000);
    expect(pages).toHaveLength(2);
    expect(pages[1].blocks.map((b) => b.id)).toEqual(['t', 'b']);
  });
});
