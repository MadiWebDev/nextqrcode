#!/usr/bin/env npx tsx
/**
 * Static audit for the 100-more-tools program.
 *
 * Reads the 100 tool slugs from docs/TOOLS-100-MORE-PLAN.md §4 (single source
 * of truth) and checks, for each tool:
 *  - src/app/<slug>/page.tsx exists
 *  - contains 'use client'
 *  - contains at least one real event handler / computed value
 *    (onClick, onChange, useMemo, or useEffect)
 *  - zero banned strings (TODO, FIXME, lorem, "coming soon") — input
 *    `placeholder=` attribute values are stripped before scanning, since
 *    placeholder text is allowed
 *  - slug is registered in src/app/sitemap.ts and src/app/sitemap-page/page.tsx
 *
 * Usage: npx tsx scripts/verify-new-tools.ts
 * Exit code 1 if any check fails.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function main(): void {
  const plan = readFileSync(join(ROOT, 'docs', 'TOOLS-100-MORE-PLAN.md'), 'utf8');
  const start = plan.indexOf('## 4. The 100 new tools');
  const end = plan.indexOf('## 5.', start);
  const section4 = plan.slice(start, end);
  const slugs = [...section4.matchAll(/^### [A-Z]+\d+\. `([^`]+)`/gm)].map((m) => m[1]);
  if (slugs.length !== 100) {
    console.error(`Expected 100 slugs in manifest, found ${slugs.length}`);
    process.exit(1);
  }
  const sitemap = readFileSync(join(ROOT, 'src', 'app', 'sitemap.ts'), 'utf8');
  const sitemapPage = readFileSync(join(ROOT, 'src', 'app', 'sitemap-page', 'page.tsx'), 'utf8');

  const banned = [/TODO/, /FIXME/, /lorem/i, /coming soon/i];
  let failures = 0;
  for (const slug of slugs) {
    const problems: string[] = [];
    let src: string;
    try {
      src = readFileSync(join(ROOT, 'src', 'app', slug, 'page.tsx'), 'utf8');
    } catch {
      console.log(`FAIL /${slug} — page.tsx missing`);
      failures++;
      continue;
    }
    if (!src.includes("'use client'")) problems.push("missing 'use client'");
    if (!/(onClick|onChange|useMemo|useEffect)/.test(src)) {
      problems.push('no event handler / computed value (onClick|onChange|useMemo|useEffect)');
    }
    // Strip input placeholder attribute values before the banned-string scan.
    const scrubbed = src
      .replace(/placeholder="[^"]*"/g, 'placeholder=""')
      .replace(/placeholder=\{[^}]*\}/g, 'placeholder={}');
    for (const re of banned) {
      if (re.test(scrubbed)) problems.push(`banned string: ${re.source}`);
    }
    if (!sitemap.includes(`'/${slug}'`)) problems.push('not in sitemap.ts');
    if (!sitemapPage.includes(`'/${slug}'`)) problems.push('not in sitemap-page');
    if (problems.length > 0) {
      console.log(`FAIL /${slug} — ${problems.join('; ')}`);
      failures++;
    } else {
      console.log(`PASS /${slug}`);
    }
  }
  console.log(`\nverify-new-tools: ${slugs.length - failures}/${slugs.length} passed.`);
  if (failures > 0) process.exit(1);
}

main();
