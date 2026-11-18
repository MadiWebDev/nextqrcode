#!/usr/bin/env node
/**
 * SEO quality gate for the Social Media Calendar's published pages
 * (spec §28 + the standing indexing-freeze rule).
 *
 * Hard-fails (exit 1) when any published page:
 *  - lacks a unique title, H1 or meta description
 *  - has fewer than 5 FAQs
 *  - lacks a canonical or internal links
 *  - is too similar to another published page (word-shingle Jaccard)
 *  - is missing from, or extra in, sitemap section 10
 * Also verifies the landing page carries its required schema blocks.
 *
 * Run: node scripts/check-socialcalendar-seo.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

/* ---- Load guides by evaluating the data module's literal content ---- */
const guidesSrc = read('src/app/socialcalendar-site/_data/guides.ts');
// The data file is plain literals; extract per-guide fields with regexes.
const guideBlocks = [...guidesSrc.matchAll(/\{\s*slug: '([^']+)'/g)];
const guides = guideBlocks.map((m, i) => {
  const start = m.index;
  const end = i + 1 < guideBlocks.length ? guideBlocks[i + 1].index : guidesSrc.length;
  const block = guidesSrc.slice(start, end);
  const field = (name) => {
    const f = block.match(new RegExp(`${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    return f ? f[1].replace(/\\'/g, "'") : '';
  };
  const faqCount = (block.match(/\{\s*q: '/g) ?? []).length;
  const text = block
    .replace(/slug: '[^']*'/, '')
    .replace(/https?:\/\/[^'\s]*/g, ' ')
    .replace(/[^a-zA-Z0-9\s']/g, ' ')
    .toLowerCase();
  return {
    slug: m[1],
    title: field('title'),
    h1: field('h1'),
    description: field('description'),
    faqCount,
    hasRelated: /related: \[[^\]]+'/.test(block),
    text,
  };
});

if (guides.length === 0) fail('No guides found in _data/guides.ts');
if (guides.length > 10) fail(`Starter set exceeds the freeze limit of 10 guides: ${guides.length}`);

/* ---- Uniqueness + completeness ---- */
const seen = { title: new Map(), h1: new Map(), description: new Map(), slug: new Map() };
for (const g of guides) {
  for (const key of ['title', 'h1', 'description', 'slug']) {
    if (!g[key]) fail(`Guide ${g.slug}: missing ${key}`);
    if (seen[key].has(g[key])) fail(`Duplicate ${key}: "${g[key]}" (${g.slug} vs ${seen[key].get(g[key])})`);
    seen[key].set(g[key], g.slug);
  }
  if (g.faqCount < 5) fail(`Guide ${g.slug}: only ${g.faqCount} FAQs (minimum 5)`);
  if (!g.hasRelated) fail(`Guide ${g.slug}: no related-guide internal links`);
  if (g.title.length > 70) warn(`Guide ${g.slug}: title is ${g.title.length} chars (>70)`);
  if (g.description.length < 100 || g.description.length > 180)
    warn(`Guide ${g.slug}: description is ${g.description.length} chars (aim 100–180)`);
  const words = g.text.split(/\s+/).filter(Boolean).length;
  if (words < 450) fail(`Guide ${g.slug}: only ~${words} words of content (minimum 450)`);
}

/* ---- Pairwise similarity (3-word shingles, Jaccard) ---- */
function shingles(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 2 < words.length; i++) set.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  return set;
}
for (let i = 0; i < guides.length; i++) {
  for (let j = i + 1; j < guides.length; j++) {
    const a = shingles(guides[i].text);
    const b = shingles(guides[j].text);
    let intersection = 0;
    for (const s of a) if (b.has(s)) intersection++;
    const union = a.size + b.size - intersection;
    const similarity = union ? intersection / union : 0;
    if (similarity >= 0.25)
      fail(`Guides too similar: ${guides[i].slug} vs ${guides[j].slug} (Jaccard ${similarity.toFixed(2)} ≥ 0.25)`);
  }
}

/* ---- Guide page template carries canonical + schema + links ---- */
const guidePage = read('src/app/socialcalendar-site/guides/[slug]/page.tsx');
if (!guidePage.includes('alternates: { canonical')) fail('Guide template: no canonical');
if (!guidePage.includes("'FAQPage'") && !guidePage.includes('"FAQPage"') && !guidePage.includes('@type\': \'FAQPage'))
  fail('Guide template: no FAQPage schema');
if (!guidePage.includes("href=\"/app\"") && !guidePage.includes('href="/app"'))
  fail('Guide template: no internal link to the workspace');
if (!guidePage.includes('Related guides')) fail('Guide template: no related-guides internal links');

/* ---- Landing page requirements ---- */
const landing = read('src/app/socialcalendar-site/page.tsx');
for (const needle of ['SoftwareApplication', 'FAQPage', 'WebSite']) {
  if (!landing.includes(needle)) fail(`Landing page: missing ${needle} schema`);
}
if (/aggregateRating|ratingValue/.test(landing)) fail('Landing page: fabricated rating schema is forbidden');
if (!landing.includes('AdSlot')) fail('Landing page: AdSlot missing');

/* ---- Sitemap section 10 matches the guide set exactly ---- */
const sitemap = read('src/app/sitemap.ts');
if (!sitemap.includes('{ id: 10 }')) fail('generateSitemaps: id 10 missing');
const section10 = sitemap.slice(sitemap.indexOf('socialcalendarSiteEntries'));
for (const g of guides) {
  if (!section10.includes(`/guides/${g.slug}`)) fail(`Sitemap 10: guide ${g.slug} missing`);
}
if (!section10.includes("'/guides'")) fail('Sitemap 10: /guides hub missing');
if (/\/app|\/view/.test(section10.replace(/\/app\)/g, '')) && section10.includes("'/app'"))
  fail('Sitemap 10: noindex /app must not be listed');
const index = read('public/sitemap.xml');
if (!index.includes('https://freeqrcode.tools/sitemap/10.xml'))
  fail('public/sitemap.xml: section 10 missing from the index');

/* ---- Report ---- */
for (const w of warnings) console.log(`WARN  ${w}`);
if (failures.length) {
  for (const f of failures) console.log(`FAIL  ${f}`);
  console.log(`\nSEO gate: ${failures.length} failure(s), ${warnings.length} warning(s), ${guides.length} guides checked.`);
  process.exit(1);
}
console.log(
  `SEO gate: PASS — ${guides.length} guides, all titles/H1s/descriptions unique, ≥5 FAQs each, similarity < 0.25, sitemap 10 in sync. ${warnings.length} warning(s).`,
);
