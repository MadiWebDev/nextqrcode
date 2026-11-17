/**
 * Step 5 CI guards for the indexing policy (seo-agent, Indexing Fix).
 *
 * These tests pin the single-source-of-truth contract:
 *  - the generated policy module exactly matches the owner-approved
 *    Step 4 classification in seo-agent/output/url-actions.csv;
 *  - the sitemap generator can never emit a REMOVE URL, a duplicate,
 *    an asset URL, or a non-https URL, and its section ids match the
 *    hand-maintained public/sitemap.xml index;
 *  - the /qr-image-metadata-auditor canonical fix (E-046) stays fixed;
 *  - www → apex is a permanent (308) redirect in the proxy.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import {
  CLASSIFIED_PATHS,
  REMOVED_PATHS,
  getPolicyClass,
  isIndexable,
  isRemoved,
  normalizePathname,
} from '@/lib/seo/indexing-policy';
import sitemap, { generateSitemaps } from '@/app/sitemap';
import { metadata as auditorMetadata } from '@/app/qr-image-metadata-auditor/layout';
import { proxy } from '@/proxy';

/** Minimal RFC 4180 CSV parser (the classification file quotes fields). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

const ORIGIN = 'https://freeqrcode.tools';
const csvRows = parseCsv(
  readFileSync(path.join(process.cwd(), 'seo-agent/output/url-actions.csv'), 'utf-8')
);
const csvClassified = new Map(
  csvRows.map((r) => [r.url.replace(ORIGIN, '') || '/', r.class])
);
const csvRemoved = csvRows
  .filter((r) => r.class === 'REMOVE')
  .map((r) => r.url.replace(ORIGIN, ''))
  .sort();

describe('indexing policy matches the Step 4 classification', () => {
  it('classifies exactly the CSV URLs with the same classes', () => {
    expect(Object.keys(CLASSIFIED_PATHS)).toHaveLength(csvClassified.size);
    for (const [p, cls] of csvClassified) {
      expect(getPolicyClass(p)).toBe(cls);
    }
  });

  it('REMOVE set exactly matches url-actions.csv', () => {
    expect(csvRemoved).toHaveLength(87);
    expect([...REMOVED_PATHS].sort()).toEqual(csvRemoved);
  });

  it('helpers normalise full URLs, trailing slashes and queries', () => {
    const sample = csvRemoved[0];
    expect(isRemoved(sample)).toBe(true);
    expect(isRemoved(`${ORIGIN}${sample}`)).toBe(true);
    expect(isRemoved(`${sample}/`)).toBe(true);
    expect(isRemoved(`${sample}?utm_source=x`)).toBe(true);
    expect(isIndexable(sample)).toBe(false);
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname(`${ORIGIN}/about#team`)).toBe('/about');
  });

  it('does not flag unclassified or PROTECT/KEEP/IMPROVE paths as removed', () => {
    expect(isRemoved('/')).toBe(false);
    expect(isRemoved('/about')).toBe(false);
    expect(isRemoved('/blog/how-qr-codes-work')).toBe(false);
    expect(isIndexable('/some-brand-new-tool')).toBe(true);
  });
});

describe('sitemap generator honours the policy', () => {
  it('section ids match the public sitemap index exactly', async () => {
    const ids = (await generateSitemaps()).map((s) => s.id).sort((a, b) => a - b);
    const indexXml = readFileSync(path.join(process.cwd(), 'public/sitemap.xml'), 'utf-8');
    const indexIds = [...indexXml.matchAll(/\/sitemap\/(\d+)\.xml/g)]
      .map((m) => Number(m[1]))
      .sort((a, b) => a - b);
    expect(ids).toEqual(indexIds);
  });

  it('emits no REMOVE URL, no duplicate, no asset URL, https only', async () => {
    const ids = (await generateSitemaps()).map((s) => s.id);
    const all: string[] = [];
    for (const id of ids) {
      const entries = await sitemap({ id: Promise.resolve(String(id)) });
      const urls = entries.map((e) => e.url);
      all.push(...urls);
      for (const url of urls) {
        expect(url.startsWith('https://')).toBe(true);
        expect(url).not.toContain('/_next/');
        expect(url).not.toContain('.woff2');
        expect(url).not.toContain('manifest.webmanifest');
        expect(isRemoved(url)).toBe(false);
      }
      if (id <= 7) {
        for (const url of urls) expect(url.startsWith(`${ORIGIN}/`) || url === ORIGIN).toBe(true);
      }
      if (id === 8) {
        for (const url of urls) expect(url.startsWith('https://invoicegenerator.freeqrcode.tools')).toBe(true);
      }
      if (id === 9) {
        for (const url of urls) expect(url.startsWith('https://imageresizer.freeqrcode.tools')).toBe(true);
      }
    }
    expect(new Set(all).size).toBe(all.length);
    expect(all.filter((u) => u === `${ORIGIN}/bulk-vcard-qr`)).toHaveLength(1);
  }, 120_000);

  it('blog section enumerates the corpus minus the removed posts', async () => {
    const entries = await sitemap({ id: Promise.resolve('5') });
    expect(entries.length).toBeGreaterThan(1400);
    for (const e of entries) {
      expect(isRemoved(e.url)).toBe(false);
      // Real stored dates only: a lastmod is present and parses.
      if (e.lastModified) expect(Number.isNaN(new Date(e.lastModified).getTime())).toBe(false);
    }
  }, 120_000);
});

describe('canonical fix for /qr-image-metadata-auditor (E-046)', () => {
  it('serves a self-referencing canonical and index robots', () => {
    expect(auditorMetadata.alternates?.canonical).toBe(
      'https://freeqrcode.tools/qr-image-metadata-auditor'
    );
    expect(auditorMetadata.robots).toMatchObject({ index: true, follow: true });
  });
});

describe('proxy canonical-host behaviour', () => {
  it('redirects www to the apex permanently (308), preserving path and query', () => {
    const res = proxy(new NextRequest('https://www.freeqrcode.tools/blog/x?utm=1'));
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('https://freeqrcode.tools/blog/x?utm=1');
  });

  it('does not redirect the apex host', () => {
    const res = proxy(new NextRequest('https://freeqrcode.tools/blog/x'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});
