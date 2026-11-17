#!/usr/bin/env python3
"""
Step 2: near-duplicate similarity + quality scoring for the 856 not-indexed
URLs of freeqrcode.tools.

Similarity method (no external APIs):
  - Main-content text comes from output/content/*.txt (boilerplate stripped
    by tools/audit.py's extractor).
  - Word 5-shingles, hashed. Within each family, an inverted index finds
    candidate pairs; exact Jaccard similarity is computed for the top
    candidates per page (by shared-shingle count, top 40) and for every
    candidate pair sharing >= 8 shingles when both pages are in the 856.
    High-similarity pairs share many shingles by construction, so the
    candidate step does not miss the pairs that matter for the 0.8/0.9
    thresholds; borderline pairs near a threshold are labelled as such in
    the report.
  - unique_text_ratio(page) = share of the page's shingles that are NOT
    "template shingles" (a shingle is a template shingle if it appears in
    >= 20% of the family's pages).

Scoring rubric (each 0-5, total /25, equal weights - see scores-README.md):
  uniqueness      from max Jaccard similarity to any family sibling
  demand          from the GSC Performance export (Pages.csv); family
                  fallback for URLs absent from the 1,000-row-capped export
  intent_fit      heuristic from fetched page features (documented)
  unique_value    heuristic: length + unique-text ratio + examples/FAQ
  technical_health from Step 1 audit fields (documented deductions)

Outputs: output/similarity-pairs.csv, output/similarity.md,
         output/unique-text.csv, output/scores.csv, output/scores-README.md
Run from repo root after tools/audit.py graph + assemble.
"""
import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from urllib.parse import urlparse

BASE = "https://freeqrcode.tools"
SHINGLE = 5
TEMPLATE_DF = 0.20      # shingle in >=20% of family pages = template shingle
CANDIDATE_MIN_SHARED = 8


def norm(u):
    u = u.split("#")[0].strip()
    p = urlparse(u)
    path = p.path or "/"
    if len(path) > 1 and path.endswith("/"):
        path = path[:-1]
    return f"{p.scheme}://{p.netloc}{path}"


def family_of(u):
    p = urlparse(u)
    if p.netloc != "freeqrcode.tools":
        return p.netloc.split(".")[0] + "-site"
    parts = [x for x in p.path.split("/") if x]
    if not parts:
        return "home"
    if len(parts) == 1:
        return "root"
    return parts[0]


def shingles(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    if len(words) < SHINGLE:
        return {hashlib.md5(" ".join(words).encode()).hexdigest()} if words else set()
    return {hashlib.md5(" ".join(words[i:i + SHINGLE]).encode()).hexdigest()
            for i in range(len(words) - SHINGLE + 1)}


def load_corpus():
    idx = {}
    with open("seo-agent/output/content-index.csv", newline="") as f:
        for r in csv.DictReader(f):
            idx[r["url"]] = r["content_id"]
    ctype = {}
    with open("seo-agent/output/graph.csv", newline="") as f:
        for r in csv.DictReader(f):
            ctype[r["url"]] = r.get("content_type", "")
    texts, shingle_sets = {}, {}
    for u, cid in idx.items():
        if "text/html" not in ctype.get(u, ""):
            continue  # assets (woff2, webmanifest): not pages, no text corpus
        try:
            t = open(f"seo-agent/output/content/{cid}.txt").read()
        except FileNotFoundError:
            continue
        texts[u] = t
        shingle_sets[u] = shingles(t)
    return texts, shingle_sets


def load_drilldown():
    out = {}
    for issue, path in (
            ("crawled", "seo-agent/input/crawled-not-indexed/Table.csv"),
            ("discovered", "seo-agent/input/discovered-not-indexed/Table.csv")):
        with open(path, newline="", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                out[norm(r["URL"])] = issue
    return out


def main():
    texts, sh = load_corpus()
    drill = load_drilldown()
    fams = defaultdict(list)
    for u in sh:
        fams[family_of(u)].append(u)

    # ---- unique-text ratio + template-shingle share
    unique_ratio = {}
    for fam, members in fams.items():
        df = Counter()
        for u in members:
            for s in sh[u]:
                df[s] += 1
        cutoff = max(2, int(TEMPLATE_DF * len(members)))
        template = {s for s, n in df.items() if n >= cutoff}
        for u in members:
            tot = len(sh[u]) or 1
            unique_ratio[u] = round(
                1 - len(sh[u] & template) / tot, 3)

    # ---- similarity: max per 856 URL + pairs
    max_sim = {}       # url -> (sim, other_url)
    pairs = []         # (sim, u, v) with sim >= 0.5, >=1 member in drill
    for fam, members in fams.items():
        inv = defaultdict(list)
        for u in members:
            for s in sh[u]:
                inv[s].append(u)
        shared = Counter()
        for s, us in inv.items():
            if len(us) > 400:      # boilerplate shingle: useless as candidate key
                continue
            for i in range(len(us)):
                for j in range(i + 1, len(us)):
                    a, b = (us[i], us[j]) if us[i] < us[j] else (us[j], us[i])
                    if a in drill or b in drill:
                        shared[(a, b)] += 1
        cand = {p for p, n in shared.items() if n >= CANDIDATE_MIN_SHARED}
        # also: top-40 shared-count candidates per drill page
        per_page = defaultdict(list)
        for (a, b), n in shared.items():
            per_page[a].append((n, b))
            per_page[b].append((n, a))
        for u in members:
            if u in drill:
                for _, v in sorted(per_page.get(u, []), reverse=True)[:40]:
                    cand.add((u, v) if u < v else (v, u))
        for a, b in cand:
            sa, sb = sh[a], sh[b]
            if not sa or not sb:
                continue
            sim = len(sa & sb) / len(sa | sb)
            if sim >= 0.5:
                pairs.append((round(sim, 3), a, b))
            for u, v in ((a, b), (b, a)):
                if u in drill and sim > max_sim.get(u, (0, ""))[0]:
                    max_sim[u] = (round(sim, 3), v)
        print(f"family {fam}: {len(members)} pages, "
              f"{sum(1 for s, a, b in pairs if family_of(a) == fam)} pairs >= 0.5",
              flush=True)

    pairs.sort(reverse=True)
    with open("seo-agent/output/similarity-pairs.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["similarity", "url_a", "url_b", "family"])
        for sim, a, b in pairs:
            w.writerow([sim, a, b, family_of(a)])
    with open("seo-agent/output/unique-text.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["url", "unique_text_ratio"])
        for u in sorted(unique_ratio):
            w.writerow([u, unique_ratio[u]])
    json.dump({u: list(v) for u, v in max_sim.items()},
              open("seo-agent/output/max-sim.json", "w"))
    print(f"pairs >= 0.5: {len(pairs)}; "
          f">= 0.8: {sum(1 for s, _, _ in pairs if s >= 0.8)}; "
          f">= 0.9: {sum(1 for s, _, _ in pairs if s >= 0.9)}")

    write_similarity_md(pairs, texts, drill)
    score(drill, texts, max_sim, unique_ratio)


def clusters(pairs, threshold):
    parent = {}

    def find(x):
        while parent.setdefault(x, x) != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for sim, a, b in pairs:
        if sim >= threshold:
            parent[find(a)] = find(b)
    groups = defaultdict(list)
    for x in list(parent):
        groups[find(x)].append(x)
    return [sorted(g) for g in groups.values() if len(g) > 1]


def write_similarity_md(pairs, texts, drill):
    by_fam = defaultdict(list)
    for sim, a, b in pairs:
        by_fam[family_of(a)].append((sim, a, b))
    lines = ["# Near-duplicate similarity — the 856 not-indexed URLs",
             "",
             "Method: word 5-shingle Jaccard similarity on boilerplate-stripped",
             "main content, within path family. Pairs listed have similarity",
             ">= 0.5 and at least one member in the 856. Clusters use union-find",
             "over pairs at the stated threshold (both members counted when at",
             "least one is in the 856).",
             "",
             "| Family | Pairs >=0.9 | Pairs >=0.8 | Clusters @0.9 | Clusters @0.8 | Pages in clusters @0.8 |",
             "|---|---|---|---|---|---|"]
    for fam in sorted(by_fam):
        ps = by_fam[fam]
        c9 = clusters(ps, 0.9)
        c8 = clusters(ps, 0.8)
        lines.append(
            f"| {fam} | {sum(1 for s, _, _ in ps if s >= 0.9)} | "
            f"{sum(1 for s, _, _ in ps if s >= 0.8)} | {len(c9)} | {len(c8)} | "
            f"{sum(len(g) for g in c8)} |")
    lines += ["", "## Five most-duplicated pairs per family", ""]
    for fam in sorted(by_fam):
        lines += [f"### {fam}", ""]
        for sim, a, b in by_fam[fam][:5]:
            lines.append(f"**{sim:.2f}** — {a} ↔ {b}")
            for u in (a, b):
                excerpt = " ".join(texts.get(u, "").split())[:240]
                lines.append(f"- `{u}`: {excerpt}…")
            lines.append("")
    open("seo-agent/output/similarity.md", "w").write("\n".join(lines))
    print("similarity.md written")


# ------------------------------------------------------------------- scoring
YMYL_GROUPS = {
    "elections": ["election", "voter", "voting", "ballot"],
    "immigration": ["immigration", "visa", "passport", "asylum"],
    "legal": ["will-", "wills", "legal", "lawyer", "attorney", "court",
              "notary", "contract"],
    "medical": ["medical", "health", "prescription", "patient", "doctor",
                "pharmacy", "pharmacies", "medication", "clinic", "hospital",
                "dental", "therapy", "mental-health"],
    "tax": ["tax", "irs", "refund"],
    "insurance": ["insurance"],
    "financial": ["crypto", "bitcoin", "investment", "loan", "banking",
                  "finance", "trading"],
    "government": ["government", "public-services", "id-card", "license",
                   "permit", "registry"],
    "donations": ["donation", "donations", "charity", "fundrais"],
}


def risk_flags(url, text):
    """Screening flag: YMYL term groups matched on word boundaries in the
    slug or the opening content. A flag means 'human review class', not a
    verdict - see the manual sample in output/ymyl-sample.md."""
    hay = (urlparse(url).path + " " + text[:6000]).lower()
    hits = []
    for group, terms in YMYL_GROUPS.items():
        for t in terms:
            pat = r"(?<![a-z0-9])" + re.escape(t).replace(r"\-", r"[- ]") \
                  + r"(?![a-z0-9])"
            if re.search(pat, hay):
                hits.append(group)
                break
    return hits


def score(drill, texts, max_sim, unique_ratio):
    audit = {}
    with open("seo-agent/output/audit.csv", newline="") as f:
        for r in csv.DictReader(f):
            audit[r["url"]] = r
    graph = {}
    with open("seo-agent/output/graph.csv", newline="") as f:
        for r in csv.DictReader(f):
            graph[r["url"]] = r
    perf = {}
    with open("seo-agent/baseline/gsc-export/Pages.csv", newline="",
              encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            perf[norm(r["Top pages"])] = {
                "clicks": int(r["Clicks"]), "impr": int(r["Impressions"]),
                "pos": float(r["Position"])}
    fam_earners = Counter()
    for u, p in perf.items():
        if p["impr"] >= 5:
            fam_earners[family_of(u)] += 1

    def demand(u, fam):
        p = perf.get(u)
        if p:
            if p["clicks"] >= 3 or p["impr"] >= 75:
                s = 5
            elif p["clicks"] >= 1 or p["impr"] >= 40:
                s = 4
            elif p["impr"] >= 15:
                s = 3
            elif p["impr"] >= 5:
                s = 2
            elif p["impr"] >= 1:
                s = 1
            else:
                s = 0
            return s, "gsc-export"
        return (1 if fam_earners.get(fam, 0) >= 5 else 0), \
            "family-fallback (absent from 1,000-row-capped export)"

    def uniq_score(sim):
        if sim >= 0.95: return 0
        if sim >= 0.90: return 1
        if sim >= 0.80: return 2
        if sim >= 0.65: return 3
        if sim >= 0.45: return 4
        return 5

    def intent_fit(u, fam, a, g):
        wc = int(a.get("word_count_raw") or g.get("word_count") or 0)
        faq = a.get("faq_schema") == "yes"
        tools = fam in ("root", "whatsapp-qr", "payment-qr", "qr-labels")
        inter = int(g.get("inputs") or 0) + int(g.get("buttons") or 0)
        s = 0
        if tools:
            if inter >= 3: s += 3
            elif inter >= 1: s += 2
            if wc >= 400: s += 1
            if faq: s += 1
        else:
            if wc >= 800: s += 2
            elif wc >= 500: s += 1
            struct = int(g.get("lists") or 0) + int(g.get("tables") or 0)
            if struct >= 3: s += 1
            if faq: s += 1
            if str(a.get("h1_count")) == "1": s += 1
        return min(s, 5)

    def unique_value(u, a, g):
        wc = int(a.get("word_count_raw") or g.get("word_count") or 0)
        s = 0
        if wc >= 1000: s += 2
        elif wc >= 600: s += 1
        r = unique_ratio.get(u, 0)
        if r >= 0.8: s += 2
        elif r >= 0.6: s += 1
        if int(g.get("tables") or 0) >= 1 or int(g.get("lists") or 0) >= 5:
            s += 1
        return min(s, 5)

    def tech_health(a, g):
        s = 5
        if str(a.get("status")) != "200":
            s -= 2
        chain = a.get("redirect_chain") or ""
        if chain.count(":http") > 1:
            s -= 1
        if a.get("canonical_self") not in ("yes", ""):
            s -= 1
        if a.get("noindex") == "yes" or "noindex" in (a.get("x_robots_tag") or ""):
            s -= 2
        try:
            if float(g.get("ttfb_s") or 0) > 1.5:
                s -= 1
        except ValueError:
            pass
        if str(a.get("h1_count")) not in ("1", ""):
            s -= 1
        return max(s, 0)

    rows = []
    for u in sorted(drill):
        a = audit.get(u, {})
        g = graph.get(u, {})
        fam = family_of(u)
        sim, sim_url = max_sim.get(u, (0.0, ""))
        p = perf.get(u, {})
        d, dsrc = demand(u, fam)
        flags = risk_flags(u, texts.get(u, ""))
        protect = "YES" if (p.get("clicks", 0) > 0 or p.get("impr", 0) >= 15
                            or (p.get("pos") is not None and p.get("pos", 99) <= 20
                                and p.get("impr", 0) > 0)) else "no"
        uv = unique_value(u, a, g)
        uq = uniq_score(sim)
        itf = intent_fit(u, fam, a, g)
        th = tech_health(a, g)
        is_asset = u not in texts  # woff2 / webmanifest: not pages, unscored
        rows.append({
            "url": u, "issue": drill[u], "family": fam,
            "impressions": p.get("impr", ""), "clicks": p.get("clicks", ""),
            "avg_position": p.get("pos", ""), "protect": protect,
            "risk_class": ("ASSET (not a page)" if is_asset else
                           ("YMYL:" + ",".join(flags)) if flags else "standard"),
            "max_similarity": sim if not is_asset else "",
            "most_similar_url": sim_url if not is_asset else "",
            "unique_text_ratio": unique_ratio.get(u, ""),
            "unique_value": uv if not is_asset else "",
            "uniqueness": uq if not is_asset else "",
            "demand": d if not is_asset else "",
            "demand_source": dsrc if not is_asset else "",
            "intent_fit": itf if not is_asset else "",
            "technical_health": th if not is_asset else "",
            "score_total": (uv + uq + d + itf + th) if not is_asset else "",
        })
    fields = list(rows[0].keys())
    with open("seo-agent/output/scores.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"scores.csv: {len(rows)} rows; "
          f"protect=YES: {sum(1 for r in rows if r['protect'] == 'YES')}; "
          f"YMYL: {sum(1 for r in rows if r['risk_class'] != 'standard')}")


if __name__ == "__main__":
    main()
