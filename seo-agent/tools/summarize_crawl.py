#!/usr/bin/env python3
"""
Summarize the Phase 0 baseline crawl CSV by route family.
Reads seo-agent/baseline/crawl-2026-11-17.csv, writes
seo-agent/baseline/summary-by-family.md and prints headline stats.
"""
import csv
import statistics
from collections import Counter, defaultdict
from urllib.parse import urlparse

IN = "seo-agent/baseline/crawl-2026-11-17.csv"
OUT = "seo-agent/baseline/summary-by-family.md"


def family(url):
    u = urlparse(url)
    host, path = u.netloc, u.path
    if host.startswith("invoicegenerator"):
        return "invoice-site"
    if host.startswith("imageresizer"):
        if path.startswith("/guides"):
            return "imageresizer-guides"
        if path.startswith("/categories"):
            return "imageresizer-categories"
        return "imageresizer-tools"
    seg = [s for s in path.split("/") if s]
    if not seg:
        return "core-hubs"
    first = seg[0]
    if first == "blog":
        return "blog" if len(seg) > 1 else "core-hubs"
    if first in ("scan-guide", "glossary", "industries", "qr-size-guide", "templates",
                "qr-labels", "whatsapp-qr", "payment-qr"):
        return first
    if first.startswith("bulk-"):
        return "bulk-tools"
    if first.endswith("-qr-suite"):
        return "suites"
    if len(seg) == 1:
        return "tool-pages"
    return "core-hubs"


def num(v):
    try:
        return int(v)
    except (TypeError, ValueError):
        return 0


def fnum(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def pct(n, d):
    return f"{(100.0 * n / d):.1f}%" if d else "—"


def main():
    rows = list(csv.DictReader(open(IN)))
    fams = defaultdict(list)
    for r in rows:
        fams[family(r["url"])].append(r)

    lines = []
    lines.append("# Baseline crawl summary by route family — 2026-11-17")
    lines.append("")
    lines.append(f"Source: `crawl-2026-11-17.csv` ({len(rows)} sitemap URLs, live fetch, normal UA).")
    lines.append("Word count = visible text with nav/header/footer/script/style stripped (approximation of main content).")
    lines.append("")
    hdr = ("| Family | URLs | Status 200 | Redirected | Median title len | % no title | % dup titles (in family) | "
           "Median desc len | % no desc | % dup desc (in family) | % non-self canonical | % noindex | Median words | "
           "% FAQ schema | % FAQ visible | % FAQ visible, no schema | Median resp (s) |")
    lines.append(hdr)
    lines.append("|" + "---|" * 17)

    all_titles = Counter(r["title"] for r in rows if r["title"])
    all_descs = Counter(r["description"] for r in rows if r["description"])

    for fam in sorted(fams, key=lambda f: -len(fams[f])):
        rs = fams[fam]
        n = len(rs)
        ok = sum(1 for r in rs if r["status"] == "200")
        redir = sum(1 for r in rs if r["redirect_chain"])
        tl = [num(r["title_len"]) for r in rs]
        dl = [num(r["description_len"]) for r in rs]
        no_t = sum(1 for r in rs if not r["title"])
        no_d = sum(1 for r in rs if not r["description"])
        tc = Counter(r["title"] for r in rs if r["title"])
        dc = Counter(r["description"] for r in rs if r["description"])
        dup_t = sum(1 for r in rs if r["title"] and tc[r["title"]] > 1)
        dup_d = sum(1 for r in rs if r["description"] and dc[r["description"]] > 1)
        nonself = sum(1 for r in rs if r["canonical_self"] == "no")
        noindex = sum(1 for r in rs if r["noindex"] == "yes")
        words = [num(r["word_count"]) for r in rs]
        fs = sum(1 for r in rs if r["faq_schema"] == "yes")
        fv = sum(1 for r in rs if r["faq_visible"] == "yes")
        fv_ns = sum(1 for r in rs if r["faq_visible"] == "yes" and r["faq_schema"] == "no")
        resp = [fnum(r["response_s"]) for r in rs]
        lines.append(
            f"| {fam} | {n} | {pct(ok, n)} | {redir} | {statistics.median(tl):.0f} | {pct(no_t, n)} | {pct(dup_t, n)} | "
            f"{statistics.median(dl):.0f} | {pct(no_d, n)} | {pct(dup_d, n)} | {pct(nonself, n)} | {pct(noindex, n)} | "
            f"{statistics.median(words):.0f} | {pct(fs, n)} | {pct(fv, n)} | {pct(fv_ns, n)} | {statistics.median(resp):.2f} |")

    lines.append("")
    lines.append("## Global")
    lines.append("")
    lines.append(f"- Total URLs crawled: {len(rows)}")
    lines.append(f"- Status distribution: {dict(Counter(r['status'] for r in rows))}")
    lines.append(f"- URLs with a redirect chain: {sum(1 for r in rows if r['redirect_chain'])}")
    lines.append(f"- Duplicate titles globally: {sum(1 for r in rows if r['title'] and all_titles[r['title']] > 1)} URLs share a title with at least one other URL")
    lines.append(f"- Duplicate descriptions globally: {sum(1 for r in rows if r['description'] and all_descs[r['description']] > 1)} URLs")
    lines.append(f"- Missing descriptions: {sum(1 for r in rows if not r['description'])}; missing titles: {sum(1 for r in rows if not r['title'])}")
    lines.append(f"- Non-self canonicals: {sum(1 for r in rows if r['canonical_self'] == 'no')}; no canonical tag: {sum(1 for r in rows if not r['canonical'])}")
    lines.append(f"- noindex (meta robots): {sum(1 for r in rows if r['noindex'] == 'yes')}")
    lines.append(f"- H1 count != 1: {sum(1 for r in rows if r['h1_count'] != '1')} URLs (0 H1: {sum(1 for r in rows if r['h1_count'] == '0')}, >1 H1: {sum(1 for r in rows if num(r['h1_count']) > 1)})")
    lines.append(f"- FAQ schema present: {sum(1 for r in rows if r['faq_schema'] == 'yes')}; FAQ visible (heuristic): {sum(1 for r in rows if r['faq_visible'] == 'yes')}; visible without schema: {sum(1 for r in rows if r['faq_visible'] == 'yes' and r['faq_schema'] == 'no')}; schema without visible: {sum(1 for r in rows if r['faq_schema'] == 'yes' and r['faq_visible'] == 'no')}")
    lines.append(f"- Median response time: {statistics.median([fnum(r['response_s']) for r in rows]):.2f}s; p90: {sorted(fnum(r['response_s']) for r in rows)[int(len(rows) * 0.9)]:.2f}s")
    thin = sum(1 for r in rows if num(r["word_count"]) < 300)
    lines.append(f"- Pages under 300 words (heuristic): {thin} ({pct(thin, len(rows))})")
    lines.append("")
    open(OUT, "w").write("\n".join(lines))
    print("\n".join(lines))


if __name__ == "__main__":
    main()
