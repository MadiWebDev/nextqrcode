#!/usr/bin/env python3
"""
Baseline sitemap crawl for the freeqrcode.tools SEO program (Phase 0).

Fetches every URL listed in the live sitemap index (politely: global rate
limit <= 5 req/s, honest user-agent), and records per URL: status, redirect
chain, canonical, meta robots, title/description (+lengths), H1 count,
JSON-LD @types, FAQ visibility heuristic, approx. main-content word count
(nav/header/footer/script/style stripped), and response time.

Usage:
  python3 crawl_baseline.py crawl        # full sitemap crawl -> baseline CSV
  python3 crawl_baseline.py spotcheck    # Googlebot-UA vs normal-UA sample
Output paths are relative to the repo root (run from repo root).
"""
import csv
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urlparse

import requests

BASE = "https://freeqrcode.tools"
OUT_CSV = "seo-agent/baseline/crawl-2026-11-17.csv"
OUT_SPOT = "seo-agent/baseline/googlebot-spotcheck-2026-11-17.csv"
UA = "Mozilla/5.0 (compatible; SEOBaselineCrawler/1.0; +https://freeqrcode.tools/about)"
GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
RATE_PER_SEC = 5.0

_rate_lock = threading.Lock()
_last_req = [0.0]


def rate_wait():
    with _rate_lock:
        now = time.monotonic()
        wait = _last_req[0] + (1.0 / RATE_PER_SEC) - now
        if wait > 0:
            time.sleep(wait)
        _last_req[0] = time.monotonic()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts = []
        self._in_title = False
        self.description = ""
        self.robots_meta = ""
        self.canonical = ""
        self.h1_count = 0
        self.dt_count = 0
        self._skip_depth = 0  # inside script/style/nav/header/footer
        self.text_parts = []
        self.ldjson_blocks = []
        self._in_ldjson = False
        self._ld_parts = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "nav", "header", "footer"):
            self._skip_depth += 1
            if tag == "script" and a.get("type") == "application/ld+json":
                self._in_ldjson = True
                self._ld_parts = []
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            if a.get("name") == "description":
                self.description = a.get("content", "")
            elif a.get("name") == "robots":
                self.robots_meta = a.get("content", "")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "dt":
            self.dt_count += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "header", "footer"):
            if tag == "script" and self._in_ldjson:
                self.ldjson_blocks.append("".join(self._ld_parts))
                self._in_ldjson = False
            self._skip_depth = max(0, self._skip_depth - 1)
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_ldjson:
            self._ld_parts.append(data)
            return
        if self._in_title:
            self.title_parts.append(data)
        if self._skip_depth == 0:
            self.text_parts.append(data)


def schema_types(blocks):
    types = set()

    def walk(node):
        if isinstance(node, dict):
            t = node.get("@type")
            if isinstance(t, str):
                types.add(t)
            elif isinstance(t, list):
                types.update(x for x in t if isinstance(x, str))
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    for b in blocks:
        try:
            walk(json.loads(b))
        except Exception:
            # Next.js flight data can embed escaped JSON-LD; fall back to regex.
            for m in re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"', b):
                types.add(m)
    return sorted(types)


def fetch(url, ua=UA):
    rate_wait()
    t0 = time.monotonic()
    try:
        r = requests.get(url, headers={"User-Agent": ua}, timeout=25, allow_redirects=True)
        elapsed = time.monotonic() - t0
        chain = " > ".join(str(h.status_code) for h in r.history)
        return r, chain, elapsed
    except Exception as e:
        return None, f"ERROR: {e}", time.monotonic() - t0


def parse_page(url, r):
    p = PageParser()
    try:
        p.feed(r.text)
    except Exception:
        pass
    title = " ".join("".join(p.title_parts).split())
    text = " ".join(" ".join(p.text_parts).split())
    words = len(text.split()) if text else 0
    types = schema_types(p.ldjson_blocks)
    faq_visible = ("frequently asked questions" in text.lower()) or p.dt_count >= 3
    return {
        "url": url,
        "status": r.status_code,
        "title": title,
        "title_len": len(title),
        "description": p.description,
        "description_len": len(p.description),
        "canonical": p.canonical,
        "canonical_self": "yes" if p.canonical.rstrip("/") == url.rstrip("/") else ("no" if p.canonical else ""),
        "meta_robots": p.robots_meta,
        "noindex": "yes" if "noindex" in p.robots_meta.lower() else "no",
        "h1_count": p.h1_count,
        "word_count": words,
        "schema_types": ";".join(types),
        "faq_schema": "yes" if "FAQPage" in types else "no",
        "faq_visible": "yes" if faq_visible else "no",
    }


def sitemap_urls():
    r, _, _ = fetch(f"{BASE}/sitemap.xml")
    children = re.findall(r"<loc>([^<]+)</loc>", r.text)
    urls = []
    for child in children:
        rr, _, _ = fetch(child)
        urls.extend(re.findall(r"<loc>([^<]+)</loc>", rr.text))
    return children, urls


def crawl():
    children, urls = sitemap_urls()
    print(f"sitemap index children: {len(children)}; total URLs: {len(urls)}", flush=True)
    rows = []
    lock = threading.Lock()
    done = [0]

    def work(url):
        r, chain, elapsed = fetch(url)
        if r is None:
            row = {"url": url, "status": "ERROR", "redirect_chain": chain, "response_s": round(elapsed, 2)}
        else:
            row = parse_page(url, r)
            row["redirect_chain"] = chain
            row["response_s"] = round(elapsed, 2)
            row["final_url"] = r.url
        with lock:
            rows.append(row)
            done[0] += 1
            if done[0] % 200 == 0:
                print(f"  {done[0]}/{len(urls)}", flush=True)

    with ThreadPoolExecutor(max_workers=4) as ex:
        list(ex.map(work, urls))

    rows.sort(key=lambda x: x["url"])
    fields = ["url", "status", "final_url", "redirect_chain", "response_s", "title", "title_len",
              "description", "description_len", "canonical", "canonical_self", "meta_robots",
              "noindex", "h1_count", "word_count", "schema_types", "faq_schema", "faq_visible"]
    with open(OUT_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {OUT_CSV} with {len(rows)} rows", flush=True)


def spotcheck():
    # Stratified sample: homepage, winners, one per family, both subdomains.
    sample = [
        "https://freeqrcode.tools/",
        "https://freeqrcode.tools/pakistan-payment-qr",
        "https://freeqrcode.tools/qr-splitter-scanner",
        "https://freeqrcode.tools/scan-guide/scan-qr-code-fire-tablet",
        "https://freeqrcode.tools/scan-guide/fix-qr-camera-permission",
        "https://freeqrcode.tools/blog/why-your-qr-code-shows-a-404-error",
        "https://freeqrcode.tools/blog/qr-code-for-election-voter-information",
        "https://freeqrcode.tools/wifi-qr-code-generator",
        "https://freeqrcode.tools/glossary/alignment-pattern",
        "https://freeqrcode.tools/industries/education-campus-wayfinding-tours",
        "https://freeqrcode.tools/qr-size-guide/apparel-hang-tags",
        "https://freeqrcode.tools/templates/automotive-carbon",
        "https://freeqrcode.tools/tools",
        "https://invoicegenerator.freeqrcode.tools/",
        "https://imageresizer.freeqrcode.tools/",
    ]
    # Fill any 404-prone family samples from the crawl CSV if present.
    out = []
    for url in sample:
        rn, _, _ = fetch(url, UA)
        rg, _, _ = fetch(url, GOOGLEBOT_UA)
        def sig(r):
            if r is None:
                return "ERROR"
            p = PageParser()
            try:
                p.feed(r.text)
            except Exception:
                pass
            title = " ".join("".join(p.title_parts).split())
            return f"{r.status_code}|{title[:60]}|canon={p.canonical}|robots={p.robots_meta}|bytes={len(r.content)}"
        sn, sg = sig(rn), sig(rg)
        out.append({"url": url, "normal": sn, "googlebot": sg, "identical": "yes" if sn == sg else "NO"})
        print(url, "identical:", "yes" if sn == sg else "NO", flush=True)
    with open(OUT_SPOT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["url", "normal", "googlebot", "identical"])
        w.writeheader()
        w.writerows(out)
    print(f"wrote {OUT_SPOT}", flush=True)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "crawl"
    if cmd == "crawl":
        crawl()
    elif cmd == "spotcheck":
        spotcheck()
