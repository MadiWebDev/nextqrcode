#!/usr/bin/env python3
"""
Technical audit tool for the freeqrcode.tools "not indexed" program (Steps 1-2).

Polite fetching: global rate limit (default 2 req/s), honest user-agent,
respects robots.txt Disallow rules for the paths it fetches.

Subcommands:
  sitemap   Fetch sitemap index + sections -> output/sitemap-urls.csv
            (url, section, lastmod) and print lastmod/duplicate analysis.
  graph     Fetch every sitemap URL (+ any drilldown URL not in the sitemap):
            status chain, TTFB, X-Robots-Tag, content-type, internal outlinks,
            main-content text. -> output/graph.csv, output/outlinks.json,
            output/content/<id>.txt, output/content-index.csv
  googlebot Fetch the 856 drilldown URLs with a Googlebot UA and compare
            against the normal-UA graph/baseline data.
            -> output/googlebot-pass.csv
  assemble  Join baseline crawl + graph + googlebot + sitemap + drilldown
            inputs -> output/audit.csv (856 rows).

Run from the repo root. All state lives under seo-agent/.
"""
import csv
import hashlib
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

import requests

BASE = "https://freeqrcode.tools"
UA = "QRStudio-SEOAudit/1.0 (+https://freeqrcode.tools/about; owner-run technical audit)"
GB_UA = ("Mozilla/5.0 (compatible; Googlebot/2.1; "
         "+http://www.google.com/bot.html)")
RATE = 2.0  # requests per second, global
DISALLOWED_PREFIXES = ("/api/", "/r/", "/dashboard/", "/card/")

_lock = threading.Lock()
_last = [0.0]


def throttle():
    with _lock:
        now = time.monotonic()
        wait = _last[0] + 1.0 / RATE - now
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.monotonic()


def norm(u):
    """Normalise a URL for joining: strip fragment, trailing slash (not root)."""
    u = u.split("#")[0].strip()
    p = urlparse(u)
    path = p.path or "/"
    if len(path) > 1 and path.endswith("/"):
        path = path[:-1]
    return f"{p.scheme}://{p.netloc}{path}"


def family_of(u):
    path = urlparse(u).path
    parts = [x for x in path.split("/") if x]
    if not parts:
        return "home"
    if len(parts) == 1:
        return "root"
    return parts[0]


# ---------------------------------------------------------------- extraction
class Extractor(HTMLParser):
    """Main-content text + links + head facts, boilerplate stripped."""

    SKIP = {"script", "style", "noscript", "header", "footer", "nav",
            "svg", "iframe", "form"}
    # NOTE: <form> skipped for text (tool UIs), links still collected.

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.text = []
        self.links = []
        self.title = ""
        self._in_title = False
        self.description = ""
        self.canonical = ""
        self.meta_robots = ""
        self.h1 = 0
        self.h2 = 0
        self.jsonld_types = []
        self._in_jsonld = False
        self._jsonld_buf = []
        self.inputs = 0
        self.buttons = 0
        self.imgs = 0
        self.tables = 0
        self.lists = 0
        self.ol_items = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.SKIP:
            self.skip_depth += 1
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            if a.get("name", "").lower() == "description":
                self.description = a.get("content", "")
            elif a.get("name", "").lower() == "robots":
                self.meta_robots = a.get("content", "")
        elif tag == "link":
            if a.get("rel") == "canonical":
                self.canonical = a.get("href", "")
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "h1":
            self.h1 += 1
        elif tag == "h2":
            self.h2 += 1
        elif tag == "input":
            self.inputs += 1
        elif tag == "button":
            self.buttons += 1
        elif tag == "img":
            self.imgs += 1
        elif tag == "table":
            self.tables += 1
        elif tag in ("ul", "ol"):
            self.lists += 1
        elif tag == "li":
            self.ol_items += 1
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_buf = []

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.skip_depth > 0:
            self.skip_depth -= 1
        if tag == "title":
            self._in_title = False
        if tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            try:
                data = json.loads("".join(self._jsonld_buf))
                stack = [data]
                while stack:
                    node = stack.pop()
                    if isinstance(node, dict):
                        t = node.get("@type")
                        if t:
                            self.jsonld_types.append(
                                t if isinstance(t, str) else ";".join(t))
                        stack.extend(node.values())
                    elif isinstance(node, list):
                        stack.extend(node)
            except Exception:
                self.jsonld_types.append("INVALID_JSONLD")

    def handle_data(self, data):
        if self._in_jsonld:
            self._jsonld_buf.append(data)
            return
        if self._in_title:
            self.title += data
            return
        if self.skip_depth == 0:
            t = data.strip()
            if t:
                self.text.append(t)


def extract(html):
    ex = Extractor()
    try:
        ex.feed(html)
    except Exception:
        pass
    return ex


def fetch(url, ua=UA, timeout=30):
    """One polite fetch following redirects manually to record the chain."""
    throttle()
    if urlparse(url).path.startswith(DISALLOWED_PREFIXES):
        return {"url": url, "blocked_by_robots_rule": "yes"}
    s = requests.Session()
    chain = []
    cur = url
    ttfb = None
    resp = None
    t0 = time.monotonic()
    for _ in range(6):
        r = s.get(cur, headers={"User-Agent": ua}, timeout=timeout,
                  allow_redirects=False, stream=True)
        if ttfb is None:
            ttfb = time.monotonic() - t0
        chain.append(f"{r.status_code}:{cur}")
        if r.status_code in (301, 302, 303, 307, 308) and "location" in r.headers:
            cur = urljoin(cur, r.headers["location"])
            r.close()
            continue
        resp = r
        break
    if resp is None:
        return {"url": url, "error": "redirect-loop", "chain": chain}
    try:
        body = resp.content.decode("utf-8", errors="replace")
    except Exception as e:
        return {"url": url, "error": str(e), "chain": chain}
    return {
        "url": url, "final_url": cur, "status": resp.status_code,
        "chain": chain, "ttfb_s": round(ttfb, 3),
        "total_s": round(time.monotonic() - t0, 3),
        "x_robots_tag": resp.headers.get("x-robots-tag", ""),
        "content_type": resp.headers.get("content-type", ""),
        "bytes": len(resp.content), "html": body,
    }


# ------------------------------------------------------------------- sitemap
def cmd_sitemap():
    idx = fetch(f"{BASE}/sitemap.xml")
    sections = sorted(set(re.findall(r"/sitemap/(\d+)\.xml", idx["html"])))
    rows = []
    for sec in sections:
        r = fetch(f"{BASE}/sitemap/{sec}.xml")
        for m in re.finditer(r"<url>\s*<loc>([^<]+)</loc>"
                             r"(?:\s*<lastmod>([^<]+)</lastmod>)?", r["html"]):
            rows.append({"url": norm(m.group(1)), "section": sec,
                         "lastmod": m.group(2) or ""})
    with open("seo-agent/output/sitemap-urls.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["url", "section", "lastmod"])
        w.writeheader()
        w.writerows(rows)
    from collections import Counter
    urls = [r["url"] for r in rows]
    dup = [u for u, n in Counter(urls).items() if n > 1]
    lm = Counter(r["lastmod"][:10] for r in rows)
    print(f"sitemap entries: {len(rows)}, unique: {len(set(urls))}")
    print(f"duplicates: {dup}")
    print(f"sections: {Counter(r['section'] for r in rows)}")
    print(f"lastmod distinct values: {len(lm)}; top: {lm.most_common(8)}")
    print(f"entries with no lastmod: {sum(1 for r in rows if not r['lastmod'])}")


# --------------------------------------------------------------------- graph
def load_drilldown():
    out = {}
    for issue, path in (
            ("crawled", "seo-agent/input/crawled-not-indexed/Table.csv"),
            ("discovered", "seo-agent/input/discovered-not-indexed/Table.csv")):
        with open(path, newline="", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                out[norm(r["URL"])] = {"issue": issue,
                                        "last_crawled": r["Last crawled"]}
    return out


def cmd_graph():
    sm = {}
    with open("seo-agent/output/sitemap-urls.csv", newline="") as f:
        for r in csv.DictReader(f):
            sm[r["url"]] = r
    drill = load_drilldown()
    targets = sorted(set(sm) | set(drill))
    print(f"graph targets: {len(targets)}", flush=True)
    import os
    os.makedirs("seo-agent/output/content", exist_ok=True)
    done = {}
    cpath = "seo-agent/output/content-index.csv"
    if os.path.exists(cpath):
        with open(cpath, newline="") as f:
            for r in csv.DictReader(f):
                done[r["url"]] = r
    todo = [u for u in targets if u not in done]
    print(f"already done: {len(done)}, todo: {len(todo)}", flush=True)
    results = dict(done)
    outlinks = {}
    opath = "seo-agent/output/outlinks.json"
    if os.path.exists(opath):
        outlinks = json.load(open(opath))

    def work(u):
        r = fetch(u)
        if "html" not in r:
            return u, {"url": u, "error": r.get("error", "robots-rule")}, []
        ex = extract(r["html"])
        text = " ".join(ex.text)
        cid = hashlib.sha1(u.encode()).hexdigest()[:16]
        with open(f"seo-agent/output/content/{cid}.txt", "w") as f:
            f.write(text)
        internal = sorted({norm(urljoin(u, h)) for h in ex.links
                           if norm(urljoin(u, h)).startswith(BASE)})
        row = {"url": u, "status": r["status"], "final_url": norm(r["final_url"]),
               "chain": " > ".join(r["chain"]), "ttfb_s": r["ttfb_s"],
               "total_s": r["total_s"], "x_robots_tag": r["x_robots_tag"],
               "content_type": r["content_type"], "bytes": r["bytes"],
               "word_count": len(text.split()), "content_id": cid,
               "outlinks_n": len(internal),
               "inputs": ex.inputs, "buttons": ex.buttons,
               "tables": ex.tables, "lists": ex.lists}
        return u, row, internal

    n = 0
    with ThreadPoolExecutor(max_workers=2) as pool:
        for u, row, internal in pool.map(work, todo):
            results[u] = row
            if internal:
                outlinks[u] = internal
            n += 1
            if n % 100 == 0:
                print(f"  {n}/{len(todo)}", flush=True)
                _save_graph(results, outlinks)
    _save_graph(results, outlinks)
    print(f"graph done: {len(results)} rows")


def _save_graph(results, outlinks):
    fields = ["url", "status", "final_url", "chain", "ttfb_s", "total_s",
              "x_robots_tag", "content_type", "bytes", "word_count",
              "content_id", "outlinks_n", "inputs", "buttons", "tables",
              "lists", "error"]
    with open("seo-agent/output/graph.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for u in sorted(results):
            w.writerow(results[u])
    with open("seo-agent/output/content-index.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["url", "content_id", "word_count"])
        w.writeheader()
        for u in sorted(results):
            if results[u].get("content_id"):
                w.writerow({"url": u,
                            "content_id": results[u]["content_id"],
                            "word_count": results[u]["word_count"]})
    json.dump(outlinks, open("seo-agent/output/outlinks.json", "w"))


# ----------------------------------------------------------------- googlebot
def cmd_googlebot():
    drill = load_drilldown()
    targets = sorted(drill)
    rows = {}

    def work(u):
        r = fetch(u, ua=GB_UA)
        if "html" not in r:
            return u, {"url": u, "error": r.get("error", "robots-rule")}
        ex = extract(r["html"])
        return u, {"url": u, "status": r["status"],
                   "final_url": norm(r["final_url"]), "bytes": r["bytes"],
                   "title": ex.title.strip(),
                   "canonical": norm(ex.canonical) if ex.canonical else "",
                   "meta_robots": ex.meta_robots,
                   "x_robots_tag": r["x_robots_tag"],
                   "word_count": len(" ".join(ex.text).split())}

    with ThreadPoolExecutor(max_workers=2) as pool:
        for u, row in pool.map(work, targets):
            rows[u] = row
    fields = ["url", "status", "final_url", "bytes", "title", "canonical",
              "meta_robots", "x_robots_tag", "word_count", "error"]
    with open("seo-agent/output/googlebot-pass.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for u in sorted(rows):
            w.writerow(rows[u])
    print(f"googlebot pass done: {len(rows)} rows")


# ------------------------------------------------------------------ assemble
def cmd_assemble():
    drill = load_drilldown()
    base = {}
    with open("seo-agent/baseline/crawl-2026-11-17.csv", newline="") as f:
        for r in csv.DictReader(f):
            base[norm(r["url"])] = r
    sm = {}
    with open("seo-agent/output/sitemap-urls.csv", newline="") as f:
        for r in csv.DictReader(f):
            sm[r["url"]] = r
    graph = {}
    with open("seo-agent/output/graph.csv", newline="") as f:
        for r in csv.DictReader(f):
            graph[r["url"]] = r
    gb = {}
    with open("seo-agent/output/googlebot-pass.csv", newline="") as f:
        for r in csv.DictReader(f):
            gb[r["url"]] = r
    outlinks = json.load(open("seo-agent/output/outlinks.json"))
    inlinks = {}
    for src, dsts in outlinks.items():
        for d in dsts:
            inlinks.setdefault(d, []).append(src)
    # click depth: BFS from homepage over outlinks (graph keys carry the
    # trailing-slash form for the root URL)
    depth = {BASE + "/": 0}
    frontier = [BASE + "/"]
    while frontier:
        nxt = []
        for u in frontier:
            for d in outlinks.get(u, []):
                if d not in depth:
                    depth[d] = depth[u] + 1
                    nxt.append(d)
        frontier = nxt
    # duplicate title/description across the whole sitemap corpus (baseline)
    from collections import Counter
    tc = Counter(r["title"] for r in base.values() if r["title"])
    dc = Counter(r["description"] for r in base.values() if r["description"])

    rows = []
    for u in sorted(drill):
        b = base.get(u, {})
        g = graph.get(u, {})
        s = sm.get(u)
        p = urlparse(u).path
        rows.append({
            "url": u, "issue": drill[u]["issue"],
            "gsc_last_crawled": drill[u]["last_crawled"],
            "family": family_of(u),
            "status": g.get("status") or b.get("status", ""),
            "redirect_chain": g.get("chain") or b.get("redirect_chain", ""),
            "final_url": g.get("final_url") or b.get("final_url", ""),
            "canonical": b.get("canonical", ""),
            "canonical_self": b.get("canonical_self", ""),
            "canonical_target_200": ("yes" if b.get("canonical") and
                base.get(norm(b["canonical"]), {}).get("status") == "200"
                else ("" if not b.get("canonical") else "unknown")),
            "meta_robots": b.get("meta_robots", ""),
            "x_robots_tag": g.get("x_robots_tag", ""),
            "robots_txt_blocked": "yes" if p.startswith(DISALLOWED_PREFIXES)
                                  else "no",
            "title": b.get("title", ""), "title_len": b.get("title_len", ""),
            "title_duplicate": "yes" if b.get("title") and tc[b["title"]] > 1
                               else "no",
            "description_len": b.get("description_len", ""),
            "description_duplicate": "yes" if b.get("description")
                                     and dc[b["description"]] > 1 else "no",
            "h1_count": b.get("h1_count", ""),
            "word_count_raw": b.get("word_count", ""),
            "word_count_graph": g.get("word_count", ""),
            "schema_types": b.get("schema_types", ""),
            "faq_schema": b.get("faq_schema", ""),
            "in_sitemap": "yes" if s else "no",
            "sitemap_section": s["section"] if s else "",
            "sitemap_lastmod": s["lastmod"] if s else "",
            "ttfb_s": g.get("ttfb_s", ""),
            "response_s_baseline": b.get("response_s", ""),
            "inlinks_n": len(inlinks.get(u, [])),
            "outlinks_n": g.get("outlinks_n", ""),
            "click_depth": depth.get(u, ""),
            "googlebot_status": gb.get(u, {}).get("status", ""),
            "googlebot_diff": _gb_diff(u, b, g, gb.get(u, {})),
        })
    fields = list(rows[0].keys())
    with open("seo-agent/output/audit.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"audit.csv: {len(rows)} rows")


DEPLOY_CHANGED_TITLES = {
    # Phase 0 metadata batch went live between the baseline crawl and the
    # Googlebot pass; verified 2026-11-17: normal UA now serves these new
    # titles too, so the difference is a deployment, not a UA effect.
    "https://freeqrcode.tools/blog/why-your-qr-code-shows-a-404-error",
    "https://freeqrcode.tools/scan-guide/scan-qr-code-fire-tablet",
    "https://freeqrcode.tools/scan-guide/scan-qr-code-honor",
    "https://freeqrcode.tools/scan-guide/scan-qr-code-oppo",
    "https://freeqrcode.tools/scan-guide/scan-qr-code-realme",
}


def _gb_diff(u, b, g, gbrow):
    if not gbrow:
        return "not-fetched"
    diffs = []
    if str(gbrow.get("status")) != str(g.get("status") or b.get("status")):
        diffs.append("status")
    if gbrow.get("title") and b.get("title") and gbrow["title"] != b["title"]:
        if u not in DEPLOY_CHANGED_TITLES:
            diffs.append("title")
    if gbrow.get("x_robots_tag") != g.get("x_robots_tag", ""):
        diffs.append("x-robots")
    return ";".join(diffs) if diffs else "none"


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sitemap"
    {"sitemap": cmd_sitemap, "graph": cmd_graph,
     "googlebot": cmd_googlebot, "assemble": cmd_assemble}[cmd]()
