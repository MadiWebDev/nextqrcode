/**
 * extract-sitemap-urls.mts — content-program inventory, step 1.
 *
 * Runs the site's REAL sitemap generator (src/app/sitemap.ts) for every
 * section id and dumps the emitted URLs, the indexing-policy class per
 * URL, the article slug→batch map and the seed slug list to JSON.
 *
 * Run from the repo root:  npx tsx seo-agent/tools/extract-sitemap-urls.mts
 * Output: /tmp/sitemap-urls.json (consumed by build-content-inventory.py)
 */
import * as _sm from '../../src/app/sitemap';
import { ARTICLE_BATCH_BY_SLUG } from '../../src/lib/articles-meta.generated';
import { ARTICLES } from '../../src/lib/articles-seed';
import { getPolicyClass } from '../../src/lib/seo/indexing-policy';
import { writeFileSync } from 'node:fs';

const sitemap = (_sm as any).default.default as (p: {
  id: Promise<string>;
}) => Promise<{ url: string }[]>;
const generateSitemaps = (_sm as any).generateSitemaps as () => Promise<{ id: number }[]>;

const ids = await generateSitemaps();
const out: { url: string; section: number }[] = [];
for (const { id } of ids) {
  const entries = await sitemap({ id: Promise.resolve(String(id)) });
  for (const e of entries) out.push({ url: e.url, section: id });
}
const policy: Record<string, string> = {};
for (const { url } of out) {
  const c = getPolicyClass(url);
  if (c) policy[url] = c;
}
writeFileSync(
  '/tmp/sitemap-urls.json',
  JSON.stringify(
    {
      urls: out,
      policy,
      batchBySlug: ARTICLE_BATCH_BY_SLUG,
      seedSlugs: ARTICLES.map((a: any) => a.slug),
    },
    null,
    1
  )
);
console.log('sitemap urls:', out.length);
