#!/usr/bin/env python3
"""
generate_policy.py — regenerate src/lib/seo/indexing-policy.ts from the
Step 4 classification (seo-agent/output/url-actions.csv).

The policy module is the single source of truth for indexability on the
apex site: sitemap generation, internal-link surfaces and (from Step 5
Commit B) the proxy's 410 handling all read it, so they cannot disagree.

Usage:  python3 seo-agent/tools/generate_policy.py
Output: src/lib/seo/indexing-policy.ts  (deterministic, sorted; do not
        edit the generated file by hand — edit the CSV and re-run.)
"""
import csv
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
CSV_PATH = os.path.join(REPO, "seo-agent", "output", "url-actions.csv")
OUT_PATH = os.path.join(REPO, "src", "lib", "seo", "indexing-policy.ts")
ORIGIN = "https://freeqrcode.tools"

CLASSES = [
    "KEEP-INDEX-READY",
    "PROTECT",
    "IMPROVE",
    "REMOVE",
    "ASSET-UTILITY",
    "CONSOLIDATE",
]


def main() -> int:
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if len(rows) != 856:
        print(f"ERROR: expected 856 classification rows, found {len(rows)}", file=sys.stderr)
        return 1

    classified = {}
    for r in rows:
        url = r["url"]
        if not url.startswith(ORIGIN):
            print(f"ERROR: unexpected origin in {url}", file=sys.stderr)
            return 1
        path = url[len(ORIGIN):] or "/"
        cls = r["class"]
        if cls not in CLASSES:
            print(f"ERROR: unknown class {cls!r} for {url}", file=sys.stderr)
            return 1
        if path in classified:
            print(f"ERROR: duplicate path {path}", file=sys.stderr)
            return 1
        classified[path] = cls

    removed = sorted(p for p, c in classified.items() if c == "REMOVE")
    if len(removed) != 87:
        print(f"ERROR: expected 87 REMOVE paths, found {len(removed)}", file=sys.stderr)
        return 1

    counts = {c: sum(1 for v in classified.values() if v == c) for c in CLASSES}

    lines = []
    lines.append("/**")
    lines.append(" * indexing-policy.ts — GENERATED FILE, do not edit by hand.")
    lines.append(" *")
    lines.append(" * Source of truth: seo-agent/output/url-actions.csv (Indexing Fix")
    lines.append(" * Step 4 classification, owner-approved 2026-11-17). Regenerate with:")
    lines.append(" *   python3 seo-agent/tools/generate_policy.py")
    lines.append(" *")
    lines.append(f" * Classified URLs: {len(classified)} "
                 f"(KEEP-INDEX-READY {counts['KEEP-INDEX-READY']}, "
                 f"PROTECT {counts['PROTECT']}, IMPROVE {counts['IMPROVE']}, "
                 f"REMOVE {counts['REMOVE']}, ASSET-UTILITY {counts['ASSET-UTILITY']}, "
                 f"CONSOLIDATE {counts['CONSOLIDATE']}).")
    lines.append(" *")
    lines.append(" * Defaulting rule (DECISIONS D-016): the policy is a denylist for")
    lines.append(" * data-driven families — blog posts and family/label entries are")
    lines.append(" * enumerated from data, so they are indexable unless classified")
    lines.append(" * REMOVE. Route-based pages (tools, generators, suites, static)")
    lines.append(" * enter the sitemap only via the explicit path lists in")
    lines.append(" * src/app/sitemap.ts, which is the structural freeze for routes:")
    lines.append(" * a brand-new route is not in the sitemap until a developer adds")
    lines.append(" * it there, and every list is filtered through isIndexable() so a")
    lines.append(" * removed path can never be re-listed by accident. The policy")
    lines.append(" * covers the apex site (freeqrcode.tools) only; the invoice and")
    lines.append(" * image-resizer subdomain sites have their own corpora.")
    lines.append(" */")
    lines.append("")
    lines.append("export const POLICY_CLASSES = [")
    for c in CLASSES:
        lines.append(f"  '{c}',")
    lines.append("] as const;")
    lines.append("")
    lines.append("export type PolicyClass = (typeof POLICY_CLASSES)[number];")
    lines.append("")
    lines.append("/** Every URL classified in Step 4, by apex path. */")
    lines.append("export const CLASSIFIED_PATHS: Readonly<Record<string, PolicyClass>> = {")
    for path in sorted(classified):
        lines.append(f"  '{path}': '{classified[path]}',")
    lines.append("};")
    lines.append("")
    lines.append("/** The 87 paths classified REMOVE (Step 5: excluded from the")
    lines.append(" * sitemap and internal links in Commit A; served 410 in Commit B). */")
    lines.append("export const REMOVED_PATHS: readonly string[] = [")
    for p in removed:
        lines.append(f"  '{p}',")
    lines.append("];")
    lines.append("")
    lines.append("const REMOVED_SET: ReadonlySet<string> = new Set(REMOVED_PATHS);")
    lines.append("")
    lines.append("/**")
    lines.append(" * Normalise a path or absolute URL to a bare apex pathname:")
    lines.append(" * strips the origin, query and fragment, and removes a trailing")
    lines.append(" * slash (except for the root path).")
    lines.append(" */")
    lines.append("export function normalizePathname(input: string): string {")
    lines.append("  let p = input;")
    lines.append("  const schemeEnd = p.indexOf('://');")
    lines.append("  if (schemeEnd >= 0) {")
    lines.append("    const slash = p.indexOf('/', schemeEnd + 3);")
    lines.append("    p = slash >= 0 ? p.slice(slash) : '/';")
    lines.append("  }")
    lines.append("  const cut = p.search(/[?#]/);")
    lines.append("  if (cut >= 0) p = p.slice(0, cut);")
    lines.append("  if (!p.startsWith('/')) p = `/${p}`;")
    lines.append("  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);")
    lines.append("  return p;")
    lines.append("}")
    lines.append("")
    lines.append("/** Step 4 classification for a path, or undefined if unclassified. */")
    lines.append("export function getPolicyClass(input: string): PolicyClass | undefined {")
    lines.append("  return CLASSIFIED_PATHS[normalizePathname(input)];")
    lines.append("}")
    lines.append("")
    lines.append("/** True when the path is classified REMOVE in the Step 4 policy. */")
    lines.append("export function isRemoved(input: string): boolean {")
    lines.append("  return REMOVED_SET.has(normalizePathname(input));")
    lines.append("}")
    lines.append("")
    lines.append("/**")
    lines.append(" * True when the path may be presented to search engines as an")
    lines.append(" * indexable apex URL. Under the D-016 defaulting rule this is")
    lines.append(" * exactly \"not classified REMOVE\": data-driven families are")
    lines.append(" * enumerated unless removed, and route sections of the sitemap")
    lines.append(" * are explicit lists filtered through this helper.")
    lines.append(" */")
    lines.append("export function isIndexable(input: string): boolean {")
    lines.append("  return !isRemoved(input);")
    lines.append("}")
    lines.append("")

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"wrote {OUT_PATH}: {len(classified)} classified, {len(removed)} removed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
