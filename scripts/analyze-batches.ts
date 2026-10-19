#!/usr/bin/env npx tsx
/**
 * Analyze every audited blog article (Batch1–69 + legacy ARTICLES) for
 * content-audit deficiencies: <400 words, <3 or >6 FAQs, duplicate FAQ
 * questions, <5 unique internal links, links to non-existent routes.
 * Writes .agents/tasks/batch-analysis.json. Source of truth for values is
 * the runtime getAllArticles() — the same data the audit reads.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

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

function extractInternalLinks(markdown: string): string[] {
  const links: string[] = [];
  const re = /\[[^\]]*\]\((\/[^)\s]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) links.push(m[1]);
  return [...new Set(links)];
}

function buildSourceMap(): Map<string, { source: string; file: string }> {
  const map = new Map<string, { source: string; file: string }>();
  const pagesDir = join(ROOT, 'src', 'lib', 'pages');
  for (let i = 1; i <= 69; i++) {
    const fname = `Batch${i}.ts`;
    const text = readFileSync(join(pagesDir, fname), 'utf8');
    const sf = ts.createSourceFile(fname, text, ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sf) === 'art' &&
        node.arguments.length >= 1 &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        map.set(node.arguments[0].text, { source: `Batch${i}`, file: `src/lib/pages/${fname}` });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  // Legacy ARTICLES in src/lib/articles.ts
  const artText = readFileSync(join(ROOT, 'src', 'lib', 'articles.ts'), 'utf8');
  const asf = ts.createSourceFile('articles.ts', artText, ts.ScriptTarget.Latest, true);
  const visit2 = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(asf) === 'slug' &&
      ts.isStringLiteralLike(node.initializer)
    ) {
      const slug = node.initializer.text;
      if (!map.has(slug)) map.set(slug, { source: 'legacy', file: 'src/lib/articles.ts' });
    }
    ts.forEachChild(node, visit2);
  };
  visit2(asf);
  return map;
}

async function main() {
  const staticRoutes = collectStaticRoutes();
  const sourceMap = buildSourceMap();
  const { getAllArticles } = await import('../src/lib/articles.js');
  const articles = getAllArticles() as {
    slug: string;
    title: string;
    primaryKeyword: string;
    category: string;
    content: string;
    faqs: { question: string; answer: string }[];
    author: string;
    updatedAt: string;
  }[];

  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.slug, (counts.get(a.slug) ?? 0) + 1);
  const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([s]) => s);

  const perSlug: Record<string, unknown> = {};
  const brokenTargets: Record<string, string[]> = {};
  let nFewFaqs = 0,
    nManyFaqs = 0,
    nDupFaqs = 0,
    nFewLinks = 0,
    nFewWords = 0,
    nBroken = 0,
    nMissingByline = 0,
    nMissingDate = 0;

  for (const a of articles) {
    const words = a.content.split(/\s+/).filter(Boolean).length;
    const questions = a.faqs.map((f) => f.question.trim().toLowerCase());
    const dupFaq = new Set(questions).size !== questions.length;
    const links = extractInternalLinks(a.content);
    const broken = links.filter((l) => {
      const path = l.split('?')[0].split('#')[0];
      const isBlog = path === '/blog' || path.startsWith('/blog/');
      return !isBlog && !staticRoutes.has(path);
    });
    for (const b of broken) {
      (brokenTargets[b] ??= []).push(a.slug);
    }
    const deficiencies: string[] = [];
    if (words < 400) {
      deficiencies.push(`words:${words}`);
      nFewWords++;
    }
    if (a.faqs.length < 3) {
      deficiencies.push(`faqs:${a.faqs.length}`);
      nFewFaqs++;
    }
    if (a.faqs.length > 6) {
      deficiencies.push(`faqs:${a.faqs.length}`);
      nManyFaqs++;
    }
    if (dupFaq) {
      deficiencies.push('duplicate-faq-questions');
      nDupFaqs++;
    }
    if (links.length < 5) {
      deficiencies.push(`links:${links.length}`);
      nFewLinks++;
    }
    if (broken.length > 0) {
      deficiencies.push(`broken-links:${broken.join(',')}`);
      nBroken++;
    }
    if (!a.author || a.author.trim().length < 3) {
      deficiencies.push('missing-byline');
      nMissingByline++;
    }
    if (!/^\d{4}-\d{2}-\d{2}/.test(a.updatedAt)) {
      deficiencies.push('missing-date');
      nMissingDate++;
    }
    const src = sourceMap.get(a.slug) ?? { source: 'unknown', file: 'unknown' };
    perSlug[a.slug] = {
      source: src.source,
      file: src.file,
      title: a.title,
      category: a.category,
      words,
      faqCount: a.faqs.length,
      uniqueFaqQuestions: new Set(questions).size,
      linkCount: links.length,
      linkTargets: links,
      brokenLinks: broken,
      deficiencies,
    };
  }

  const failing = Object.values(perSlug).filter(
    (v) => (v as { deficiencies: string[] }).deficiencies.length > 0
  ).length;
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalArticles: articles.length,
      passing: articles.length - failing,
      failing,
      fewFaqs: nFewFaqs,
      manyFaqs: nManyFaqs,
      duplicateFaqQuestions: nDupFaqs,
      fewLinks: nFewLinks,
      fewWords: nFewWords,
      withBrokenLinks: nBroken,
      missingByline: nMissingByline,
      missingDate: nMissingDate,
      duplicateSlugs: dupes,
      staticRouteCount: staticRoutes.size,
    },
    brokenLinkTargets: brokenTargets,
    articles: perSlug,
  };
  const out = join(ROOT, '.agents', 'tasks', 'batch-analysis.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
