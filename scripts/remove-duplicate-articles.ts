#!/usr/bin/env npx tsx
/**
 * Remove shadowed duplicate blog articles.
 *
 * getArticleBySlug() uses Array.find(), so for a slug that appears in two
 * Batch files the FIRST occurrence in NEW_ARTICLES order (Batch1..69
 * numeric, then array order within a file) is the one actually served.
 * Later occurrences are shadowed: invisible to readers, but the content
 * audit fails them closed as "duplicate blog slug".
 *
 * This script deletes every occurrence after the first, using the
 * TypeScript compiler API to locate each art(...) call and removing it
 * via source offsets only. It never touches the kept (first) copy.
 *
 * Usage: npx tsx scripts/remove-duplicate-articles.ts [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = join(ROOT, 'src', 'lib', 'pages');
const DRY_RUN = process.argv.includes('--dry-run');

interface Occurrence {
  slug: string;
  file: string;
  node: ts.CallExpression;
  sf: ts.SourceFile;
  text: string;
}

function batchFiles(): string[] {
  return readdirSync(PAGES_DIR)
    .filter((f) => /^Batch\d+\.ts$/.test(f))
    .sort((a, b) => parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10))
    .map((f) => join(PAGES_DIR, f));
}

function findArtCalls(file: string): Occurrence[] {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const out: Occurrence[] = [];
  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'art' &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      out.push({ slug: node.arguments[0].text, file, node, sf, text });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return out;
}

/** Removal span: whole lines from the art( line through its trailing comma + newline. */
function removalSpan(occ: Occurrence): [number, number] {
  const { text, node, sf } = occ;
  let start = node.getStart(sf);
  while (start > 0 && text[start - 1] !== '\n') start--;
  let end = node.getEnd();
  while (end < text.length && (text[end] === ' ' || text[end] === '\t')) end++;
  if (text[end] === ',') end++;
  if (text[end] === '\r') end++;
  if (text[end] === '\n') end++;
  return [start, end];
}

function main(): void {
  const all = batchFiles().flatMap(findArtCalls);
  const bySlug = new Map<string, Occurrence[]>();
  for (const occ of all) {
    const list = bySlug.get(occ.slug) ?? [];
    list.push(occ);
    bySlug.set(occ.slug, list);
  }
  const dupSlugs = [...bySlug.entries()].filter(([, list]) => list.length > 1);
  console.log(`Articles scanned: ${all.length}`);
  console.log(`Duplicate slugs: ${dupSlugs.length}`);
  for (const [slug, list] of dupSlugs) {
    if (list.length !== 2) {
      throw new Error(`Slug ${slug} has ${list.length} occurrences (expected exactly 2)`);
    }
  }

  // Group deletions per file.
  const deletions = new Map<string, Occurrence[]>();
  for (const [slug, list] of dupSlugs) {
    const [keep, ...remove] = list;
    for (const occ of remove) {
      const arr = deletions.get(occ.file) ?? [];
      arr.push(occ);
      deletions.set(occ.file, arr);
    }
    console.log(
      `${slug}: KEEP ${keep.file.split('/').pop()} / DELETE ${remove.map((o) => o.file.split('/').pop()).join(', ')}`
    );
  }
  const totalDeletions = [...deletions.values()].reduce((n, arr) => n + arr.length, 0);
  console.log(`Total deletions: ${totalDeletions}`);
  if (DRY_RUN) {
    console.log('Dry run — no files changed.');
    return;
  }

  for (const [file, occs] of deletions) {
    const text = readFileSync(file, 'utf8');
    const spans = occs.map((o) => removalSpan(o)).sort((a, b) => b[0] - a[0]); // descending: earlier offsets stay valid
    let next = text;
    for (const [start, end] of spans) {
      next = next.slice(0, start) + next.slice(end);
    }
    // Re-parse to prove the file is still valid TypeScript.
    const reparsed = ts.createSourceFile(file, next, ts.ScriptTarget.Latest, true);
    const diags = (reparsed as unknown as { parseDiagnostics?: unknown[] }).parseDiagnostics ?? [];
    if (diags.length > 0) {
      throw new Error(`Re-parse failed for ${file}: ${JSON.stringify(diags).slice(0, 500)}`);
    }
    writeFileSync(file, next);
    console.log(`Updated ${file.split('/').pop()}: removed ${occs.length} article(s)`);
  }
}

main();
