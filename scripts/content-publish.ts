#!/usr/bin/env npx tsx
/**
 * Publish report for the content quality gate (§7.5, Phase 10).
 *
 * READ-ONLY: this script never modifies any files. It reads the audit
 * manifest written by `scripts/content-audit.ts` and prints which pages
 * are publishable (passed) vs held back (failed), per content family,
 * listing held-back slugs together with their failure reasons.
 *
 * Usage:
 *   npx tsx scripts/content-publish.ts        # human-readable report
 *   npx tsx scripts/content-publish.ts --json # machine-readable JSON
 *
 * Exit codes: 0 on success; 1 if the manifest is missing or unreadable.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'src', 'content', '__generated__', 'audit-manifest.json');

interface Verdict {
  passed: boolean;
  reasons: string[];
}

interface FamilyReport {
  family: string;
  prefix: string;
  published: string[];
  heldBack: { url: string; reasons: string[] }[];
}

function readManifest(): Record<string, Verdict> {
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest not found: ${MANIFEST}`);
    console.error(
      'Run `npx tsx scripts/content-audit.ts` first (it runs automatically at prebuild).'
    );
    process.exit(1);
  }
  try {
    const raw = JSON.parse(readFileSync(MANIFEST, 'utf8')) as Record<string, Verdict>;
    return raw ?? {};
  } catch (err) {
    console.error(`Could not parse manifest: ${MANIFEST}`, err);
    process.exit(1);
  }
}

async function buildReport(): Promise<FamilyReport[]> {
  const { CONTENT_FAMILIES, FAMILY_PREFIXES } = await import('../src/content/schema.js');
  const families: { family: string; prefix: string }[] = [
    ...(CONTENT_FAMILIES as readonly string[]).map((family) => ({
      family,
      prefix: (FAMILY_PREFIXES as Record<string, string>)[family],
    })),
    // Legacy blog is audit-gated too (D5.2) — report it as its own family.
    { family: 'blog', prefix: '/blog' },
  ];

  const manifest = readManifest();
  return families.map(({ family, prefix }) => {
    const published: string[] = [];
    const heldBack: { url: string; reasons: string[] }[] = [];
    for (const [url, verdict] of Object.entries(manifest)) {
      if (url !== prefix && !url.startsWith(`${prefix}/`)) continue;
      if (verdict.passed) published.push(url);
      else heldBack.push({ url, reasons: verdict.reasons });
    }
    published.sort();
    heldBack.sort((a, b) => (a.url < b.url ? -1 : 1));
    return { family, prefix, published, heldBack };
  });
}

function printHuman(report: FamilyReport[]): void {
  const totalPublished = report.reduce((n, f) => n + f.published.length, 0);
  const totalHeldBack = report.reduce((n, f) => n + f.heldBack.length, 0);

  console.log('Content publish report (quality gate §7.5)');
  console.log(`Published: ${totalPublished} · Held back (noindex): ${totalHeldBack}`);
  console.log('');

  for (const { family, prefix, published, heldBack } of report) {
    console.log(
      `== ${family} (${prefix}) — ${published.length} published, ${heldBack.length} held back`
    );
    if (heldBack.length > 0) {
      if (heldBack.length <= 20) {
        for (const { url, reasons } of heldBack) {
          console.log(`  ${url}`);
          for (const reason of reasons) console.log(`    - ${reason}`);
        }
      } else {
        // Long tails (e.g. the blog backlog) get a reason summary, not 581 full listings.
        const counts = new Map<string, number>();
        for (const { reasons } of heldBack)
          for (const reason of reasons) counts.set(reason, (counts.get(reason) ?? 0) + 1);
        for (const [reason, n] of [...counts.entries()].sort((a, b) => b[1] - a[1]))
          console.log(`  ${n} pages: ${reason}`);
      }
    }
    console.log('');
  }

  console.log(
    'Held-back pages are noindex + excluded from the sitemap until remediated. ' +
      'See docs/CONTENT_AUDIT.md for the full list.'
  );
}

function printJson(report: FamilyReport[]): void {
  const out = {
    generatedAt: new Date().toISOString(),
    families: report.map(({ family, prefix, published, heldBack }) => ({
      family,
      prefix,
      published: published.length,
      heldBack: heldBack.length,
      publishedUrls: published,
      heldBackPages: heldBack,
    })),
    totals: {
      published: report.reduce((n, f) => n + f.published.length, 0),
      heldBack: report.reduce((n, f) => n + f.heldBack.length, 0),
    },
  };
  console.log(JSON.stringify(out, null, 2));
}

async function main() {
  const report = await buildReport();
  if (process.argv.includes('--json')) printJson(report);
  else printHuman(report);
}

main().catch((err) => {
  console.error('content-publish crashed:', err);
  process.exit(1);
});
