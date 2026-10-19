#!/usr/bin/env npx tsx
/**
 * Content quality gate (§7.5). Run at build time (prebuild) and in CI.
 *
 * What it does:
 *  1. Validates every typed content family against the Zod schemas in
 *     src/content/schema.ts, checking per-page minima: ≥400 words, 3–6
 *     unique FAQs, ≥5 internal links (resolving to real site paths), byline,
 *     lastReviewed date.
 *  2. Audits legacy blog articles against the same minima (words, FAQs,
 *     internal links extracted from markdown, byline).
 *  3. Writes src/content/__generated__/audit-manifest.json mapping each page
 *     URL to { passed, reasons }. Page components read this to set noindex;
 *     the sitemap excludes failing URLs.
 *  4. Writes docs/CONTENT_AUDIT.md with the full failure list.
 *
 * Exit codes: 1 on corrupt data (schema violations, duplicate slugs) — the
 * build must not ship those. Quality failures do NOT fail the build; they
 * fail the PAGE (noindex + sitemap exclusion) per the spec.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED_DIR = join(ROOT, 'src', 'content', '__generated__');

interface CheckResult {
  url: string;
  passed: boolean;
  reasons: string[];
}

const results: CheckResult[] = [];
let corrupt = false;

function fail(url: string, reason: string) {
  let r = results.find((x) => x.url === url);
  if (!r) {
    r = { url, passed: true, reasons: [] };
    results.push(r);
  }
  r.passed = false;
  r.reasons.push(reason);
}

function pass(url: string) {
  if (!results.find((x) => x.url === url)) results.push({ url, passed: true, reasons: [] });
}

/** Collect all static route paths from page.tsx files under src/app. */
function collectStaticRoutes(): Set<string> {
  const routes = new Set<string>(['/']);
  const appDir = join(ROOT, 'src', 'app');
  function walk(dir: string, prefix: string) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        if (name.startsWith('(') || name.startsWith('_')) continue;
        if (name.startsWith('[')) continue;
        walk(p, `${prefix}/${name}`);
      } else if (name === 'page.tsx') {
        routes.add(prefix === '' ? '/' : prefix);
      }
    }
  }
  walk(appDir, '');
  return routes;
}

type SchemaLike = {
  safeParse(u: unknown): {
    success: boolean;
    data?: {
      slug: string;
      faqs: { question: string }[];
      internalLinks: string[];
      sources: unknown[];
      status: string;
    };
    error?: { issues: { path: (string | number)[]; message: string }[] };
  };
};

async function auditFamilies(
  families: readonly string[],
  prefixes: Record<string, string>,
  schema: SchemaLike,
  loaders: Record<string, () => Promise<unknown[]>>,
  staticRoutes: Set<string>
) {
  const seenSlugs = new Set<string>();
  for (const family of families) {
    const prefix = prefixes[family];
    const load = loaders[family];
    if (!load) {
      console.error(`No loader for family "${family}" — skipping`);
      continue;
    }
    for (const raw of await load()) {
      const parsed = schema.safeParse(raw);
      const slugGuess =
        typeof raw === 'object' && raw !== null && 'slug' in raw
          ? String((raw as { slug: unknown }).slug)
          : '?';
      const url = `${prefix}/${slugGuess}`;

      if (!parsed.success) {
        corrupt = true;
        for (const issue of parsed.error?.issues ?? []) {
          fail(url, `schema: ${issue.path.join('.')}: ${issue.message}`);
        }
        continue;
      }
      const entry = parsed.data!;
      const key = `${family}:${entry.slug}`;
      if (seenSlugs.has(key)) {
        corrupt = true;
        fail(url, 'duplicate slug within family');
      }
      seenSlugs.add(key);

      const questions = entry.faqs.map((f) => f.question.trim().toLowerCase());
      if (new Set(questions).size !== questions.length) {
        fail(url, 'duplicate FAQ questions within the page');
      }

      for (const link of entry.internalLinks) {
        const path = link.split('?')[0].split('#')[0];
        const isFamilyUrl = Object.values(prefixes).some(
          (p) => path === p || path.startsWith(`${p}/`)
        );
        if (!isFamilyUrl && !staticRoutes.has(path)) {
          fail(url, `internal link target does not exist: ${link}`);
        }
      }

      const wantsSources = (raw as { requiresSources?: boolean }).requiresSources === true;
      if (wantsSources && entry.sources.length === 0) {
        fail(url, 'factual claims present but no sources listed');
      }
      if (entry.status !== 'published') fail(url, 'status is not published');
      pass(url);
    }
  }
}

/** Extract internal (site-relative) links from markdown content. */
function extractInternalLinks(markdown: string): string[] {
  const links: string[] = [];
  const re = /\[[^\]]*\]\((\/[^)\s]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) links.push(m[1]);
  return [...new Set(links)];
}

async function auditBlog(staticRoutes: Set<string>) {
  const { getAllArticles } = await import('../src/lib/articles.js');
  const articles = getAllArticles() as {
    slug: string;
    title: string;
    content: string;
    faqs: { question: string; answer: string }[];
    author: string;
    updatedAt: string;
  }[];
  // Two passes: first find duplicate slugs (legacy data issue), then audit.
  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.slug, (counts.get(a.slug) ?? 0) + 1);
  const dupes = new Set([...counts.entries()].filter(([, n]) => n > 1).map(([s]) => s));
  const seenInstance = new Set<string>();
  for (const a of articles) {
    const url = `/blog/${a.slug}`;
    if (dupes.has(a.slug)) {
      // Both instances fail closed (noindex) until the dupe is resolved.
      if (!seenInstance.has(url)) fail(url, 'duplicate blog slug — shadowed content');
      seenInstance.add(url);
      continue;
    }

    const words = a.content.split(/\s+/).filter(Boolean).length;
    if (words < 400) fail(url, `content is ${words} words (<400 minimum)`);
    if (a.faqs.length < 3) fail(url, `only ${a.faqs.length} FAQs (<3 minimum)`);
    if (a.faqs.length > 6) fail(url, `${a.faqs.length} FAQs (>6 maximum)`);
    const questions = a.faqs.map((f) => f.question.trim().toLowerCase());
    if (new Set(questions).size !== questions.length) {
      fail(url, 'duplicate FAQ questions within the page');
    }
    const links = extractInternalLinks(a.content);
    if (links.length < 5) fail(url, `only ${links.length} internal links (<5 minimum)`);
    for (const link of links) {
      const path = link.split('?')[0].split('#')[0];
      const isBlog = path === '/blog' || path.startsWith('/blog/');
      if (!isBlog && !staticRoutes.has(path)) {
        fail(url, `internal link target does not exist: ${link}`);
      }
    }
    if (!a.author || a.author.trim().length < 3) fail(url, 'missing byline');
    if (!/^\d{4}-\d{2}-\d{2}/.test(a.updatedAt)) fail(url, 'missing last-reviewed date');
    pass(url);
  }
}

function writeOutputs() {
  mkdirSync(GENERATED_DIR, { recursive: true });
  const manifest: Record<string, { passed: boolean; reasons: string[] }> = {};
  for (const r of results) manifest[r.url] = { passed: r.passed, reasons: r.reasons };
  writeFileSync(join(GENERATED_DIR, 'audit-manifest.json'), JSON.stringify(manifest, null, 2));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed);
  // Keep the report readable: summarize blog failures by reason, list family failures fully.
  const familyFailed = failed.filter((r) => !r.url.startsWith('/blog/'));
  const blogFailed = failed.filter((r) => r.url.startsWith('/blog/'));
  const blogReasons = new Map<string, number>();
  for (const r of blogFailed)
    for (const reason of r.reasons) {
      const key = reason.replace(/\d+/g, 'N');
      blogReasons.set(key, (blogReasons.get(key) ?? 0) + 1);
    }
  const lines = [
    '# Content Audit Report',
    '',
    `Generated: ${new Date().toISOString().split('T')[0]}`,
    `Pages checked: ${results.length} · Passed: ${passed} · Failed: ${failed.length}`,
    '',
    'Quality bar (§7.4): ≥400 words, 3–6 unique FAQs, ≥5 working internal links, byline,',
    'last-reviewed date. Failing pages are noindex + excluded from the sitemap.',
    '',
    ...(failed.length === 0
      ? ['All pages passed the quality gate. 🎉']
      : [
          `## Blog remediation backlog (${blogFailed.length} pages)`,
          '',
          'Failing legacy blog pages are noindexed until remediated. Top failure reasons:',
          '',
          ...[...blogReasons.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([reason, n]) => `- ${reason}: ${n} pages`),
          '',
          ...(familyFailed.length > 0
            ? [
                `## Typed family failures (${familyFailed.length} pages)`,
                '',
                ...familyFailed.flatMap((r) => [
                  `### ${r.url}`,
                  ...r.reasons.map((reason) => `- ${reason}`),
                  '',
                ]),
              ]
            : []),
        ]),
  ];
  writeFileSync(join(ROOT, 'docs', 'CONTENT_AUDIT.md'), lines.join('\n'));

  console.log(`Content audit: ${passed}/${results.length} passed.`);
  if (failed.length > 0) {
    console.log(
      `Failing pages (${failed.length}) → noindex + sitemap exclusion. See docs/CONTENT_AUDIT.md`
    );
  }
  if (corrupt) {
    console.error('CORRUPT DATA: schema violations or duplicate slugs — failing the build.');
    process.exit(1);
  }
}

async function main() {
  const { CONTENT_FAMILIES, FAMILY_PREFIXES, ContentEntrySchema } =
    await import('../src/content/schema.js');
  const { familyLoaders } = await import('../src/content/families/index.js');
  const staticRoutes = collectStaticRoutes();
  await auditFamilies(
    CONTENT_FAMILIES as unknown as readonly string[],
    FAMILY_PREFIXES as unknown as Record<string, string>,
    ContentEntrySchema as unknown as SchemaLike,
    familyLoaders as unknown as Record<string, () => Promise<unknown[]>>,
    staticRoutes
  );
  await auditBlog(staticRoutes);
  writeOutputs();
}

main().catch((err) => {
  console.error('Content audit crashed:', err);
  process.exit(1);
});
