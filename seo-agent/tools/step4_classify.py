#!/usr/bin/env python3
"""Step 4 classification for the 856 not-indexed URLs (lists only, no changes).

Inputs : seo-agent/input/{crawled,discovered}-not-indexed/Table.csv (authoritative set)
         output/scores.csv, output/audit.csv, output/similarity-pairs.csv,
         output/content-index.csv + output/content/*.txt (YMYL re-screen, R-012)
Output : output/url-actions.csv + output/step4-workings.json (for the report)
Rules  : see STEP4-REPORT.md (decision rules, applied in the order coded here).
"""
import csv, json, re, sys
from collections import defaultdict, Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
OUT = BASE / "output"

def load_csv(p):
    with open(p, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def num(v, default=0):
    try: return float(v)
    except (TypeError, ValueError): return default

def inum(v, default=0):
    try: return int(float(v))
    except (TypeError, ValueError): return default

# ---------- authoritative URL set ----------
inputs = {}   # url -> status
for name, status in [("crawled-not-indexed", "crawled"), ("discovered-not-indexed", "discovered")]:
    for r in load_csv(BASE / "input" / name / "Table.csv"):
        inputs[r["URL"].strip()] = status
assert len(inputs) == 856, len(inputs)

scores = {r["url"]: r for r in load_csv(OUT / "scores.csv")}
audit  = {r["url"]: r for r in load_csv(OUT / "audit.csv")}
assert set(scores) == set(inputs) and set(audit) == set(inputs)

# ---------- content store (for YMYL re-screen) ----------
cidx = {r["url"]: r["content_id"] for r in load_csv(OUT / "content-index.csv")}
def content_of(url):
    cid = cidx.get(url)
    if not cid: return ""
    p = OUT / "content" / f"{cid}.txt"
    return p.read_text(encoding="utf-8", errors="replace") if p.exists() else ""

# ---------- YMYL re-screen on full content (R-012) ----------
SOURCE_STRONG = [
    r"according to", r"\bsources?\b\s*[:\-]", r"\breferences\b",
    r"\bCDC\b", r"\bWHO\b", r"\bFDA\b", r"\bIRS\b", r"\bHMRC\b", r"\bECP\b",
    r"\bNADRA\b", r"\bFBR\b", r"\bSECP\b", r"\bNPCI\b", r"\bSBP\b", r"\.gov\b",
]
SOURCE_WEAK = [  # topical vocabulary on QR/spec pages — mentions, not sourcing
    r"official", r"regulation", r"guideline", r"\bISO\b", r"\bGS1\b", r"specification",
]
DISCLAIMER_PATTERNS = [
    r"disclaimer", r"not (legal|medical|financial|tax|professional) advice",
    r"consult (a|your|an)", r"informational purposes", r"seek (professional|medical|legal)",
    r"does not (constitute|provide)", r"for information only",
]
ADVICE_FAMILIES = {"blog", "scan-guide", "glossary", "qr-size-guide", "industries"}

def ymyl_rescreen(url, row):
    """Returns (verdict, n_source_signals, n_disclaimer_signals).
    verdict: NOT-FLAGGED | SOURCED | UNSOURCED-ADVICE | MENTION-OR-TOOL"""
    if not row["risk_class"].startswith("YMYL"):
        return ("NOT-FLAGGED", 0, 0)
    text = content_of(url)
    low = text.lower()
    ns = sum(1 for p in SOURCE_STRONG if re.search(p.lower(), low))
    nw = sum(1 for p in SOURCE_WEAK if re.search(p.lower(), low))
    nd = sum(1 for p in DISCLAIMER_PATTERNS if re.search(p.lower(), low))
    if row["family"] not in ADVICE_FAMILIES:
        return ("MENTION-OR-TOOL", ns + nw, nd)
    # SOURCED needs named-authority-grade evidence, not topical vocabulary:
    # >=2 strong signals, or strong + corroborating weak/disclaimer signal.
    if ns >= 2 or (ns >= 1 and (nw >= 1 or nd >= 1)):
        return ("SOURCED", ns + nw, nd)
    return ("UNSOURCED-ADVICE", ns + nw, nd)

ymyl = {}
for url, row in scores.items():
    if row["risk_class"].startswith("YMYL"):
        ymyl[url] = ymyl_rescreen(url, row)

# ---------- similarity clusters within the 856 (>=0.8) ----------
pairs = []
for r in load_csv(OUT / "similarity-pairs.csv"):
    s = num(r["similarity"])
    if s >= 0.8 and r["url_a"] in inputs and r["url_b"] in inputs:
        pairs.append((s, r["url_a"], r["url_b"]))
pair_sim = {(a, b): s for s, a, b in pairs} | {(b, a): s for s, a, b in pairs}

parent = {u: u for u in inputs}
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]; x = parent[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb: parent[ra] = rb
for s, a, b in pairs: union(a, b)
clusters = defaultdict(list)
for u in inputs: clusters[find(u)].append(u)
clusters = {k: sorted(v) for k, v in clusters.items() if len(v) > 1}
cluster_of = {u: k for k, v in clusters.items() for u in v}

# ---------- slug topic-equivalence ----------
STOP = {"qr", "code", "codes", "for", "the", "a", "an", "on", "in", "of", "to",
        "how", "vs", "and", "with", "your", "guide", "guides", "explained",
        "complete", "ultimate", "free", "online", "generator", "maker", "creator"}
def slug_tokens(url):
    seg = url.rstrip("/").split("/")[-1]
    toks = [t for t in re.split(r"[^a-z0-9]+", seg.lower()) if t and not t.isdigit()]
    return set(toks) - STOP
FILLER = {"create", "make", "making", "use", "using", "build", "building",
          "get", "getting", "generate", "generating", "complete", "ultimate",
          "best", "top", "easy", "simple", "step", "steps", "blog", "post",
          "tips", "basics"}
def slug_equivalent(a, b):
    """Truly-equivalent topics: slug token sets may differ ONLY by filler
    verbs/format words. Any differing content token (acrylic vs canvas,
    South Africa vs Venezuela) means a different promised topic -> not a merge."""
    ta, tb = slug_tokens(a), slug_tokens(b)
    if not ta or not tb or not (ta & tb): return False
    return (ta ^ tb) <= FILLER

# ---------- survivor ranking ----------
def rank_key(url):
    r = scores[url]
    pos = num(r["avg_position"], 999) if r["avg_position"] else 999
    return (0 if r["protect"] == "YES" else 1,
            -inum(r["clicks"]), -inum(r["impressions"]), pos,
            -num(r["unique_text_ratio"]), -inum(r["score_total"]))

results = {}   # url -> dict(class, action, target_url, reason, evidence_ids)
def put(url, cls, action, target, reason, ev):
    results[url] = {"class": cls, "action": action, "target_url": target,
                    "reason": reason, "evidence_ids": ev}

EV_AUDIT, EV_SIM, EV_SCORE, EV_PROT, EV_YMYL, EV_SITEMAP, EV_LINK = \
    "E-035", "E-040", "E-048", "E-042", "E-041", "E-037", "E-038"
EV_STEP4 = "E-050"

def f(url):  # short display
    return url.replace("https://freeqrcode.tools", "")

# ---------- pass 0: assets ----------
for url, row in scores.items():
    if row["risk_class"].startswith("ASSET") or url.endswith((".woff2", ".webmanifest")):
        put(url, "ASSET-UTILITY", "exclude-from-sitemap", "",
            "Non-page asset (font/manifest) that appeared in the Coverage report; already correctly absent from the sitemap and not linked as a page — no action beyond keeping it excluded.",
            f"{EV_STEP4};E-045")

# ---------- pass 1: clusters — survivors + merges ----------
cluster_report = []
for cid, members in sorted(clusters.items(), key=lambda kv: -len(kv[1])):
    ranked = sorted(members, key=rank_key)
    survivor = ranked[0]
    sr = scores[survivor]
    # survivor's own class
    s_protect = sr["protect"] == "YES"
    s_substantial = num(sr["unique_text_ratio"]) >= 0.5 and inum(sr["unique_value"]) >= 3 and inum(sr["intent_fit"]) >= 3
    if s_protect and not (num(sr["max_similarity"]) < 0.8 and s_substantial):
        # protect survivor whose cluster twin is being merged into it: still PROTECT class,
        # but it IS a valid merge target (rule 3: target may be PROTECT).
        put(survivor, "PROTECT", "none-deferred", "",
            f"PROTECT page (protect=YES, E-042) and survivor of near-duplicate group of {len(members)} pages linked pairwise at ≥0.8; merges into it are listed in this file, but any change to this page itself is deferred for separate approval.",
            f"{EV_PROT};{EV_SIM};{EV_STEP4}")
    elif s_protect:
        put(survivor, "KEEP-INDEX-READY", "keep", "",
            f"Cluster survivor and PROTECT page (protect=YES, E-042): earns demand and is the strongest version; protect status noted — flagged here so it is not altered without approval.",
            f"{EV_PROT};{EV_SIM};{EV_STEP4}")
    elif ymyl.get(survivor, ("",))[0] == "UNSOURCED-ADVICE":
        put(survivor, "IMPROVE", "rewrite", "",
            f"Survivor of a near-duplicate group of {len(members)} pages linked pairwise at ≥0.8, but YMYL-flagged ({sr['risk_class']}) with no source/disclaimer signals on full-content re-screen: sourced rewrite with named sources required — no generated rewrite — absorbing the group's useful material. (The flag may prove to be a mention artefact; Step 5 confirms before rewriting.)",
            f"{EV_SIM};{EV_YMYL};{EV_STEP4}")
    elif s_substantial:
        put(survivor, "KEEP-INDEX-READY", "keep", "",
            f"Survivor of a near-duplicate group of {len(members)} pages linked pairwise at ≥0.8 (chosen by protect > demand > uniqueness > score); the strongest, most unique version — stays in the sitemap; its twins are merged into it.",
            f"{EV_SIM};{EV_STEP4}")
    else:
        put(survivor, "IMPROVE", "rewrite", "",
            f"Survivor of a near-duplicate group of {len(members)} pages linked pairwise at ≥0.8 but its own content is thin/templated (unique-text {sr['unique_text_ratio']}, unique_value {sr['unique_value']}): rewrite as the single canonical version, absorbing the merged twins' useful material.",
            f"{EV_SIM};{EV_STEP4}")
    merged, held = [], []
    for m in ranked[1:]:
        mr = scores[m]
        sim_ms = pair_sim.get((m, survivor), 0)
        if mr["protect"] == "YES":
            put(m, "PROTECT", "none-deferred", "",
                f"PROTECT page (protect=YES, E-042) inside a near-duplicate cluster (similarity {sim_ms:.2f} to survivor {f(survivor)}): merge candidate, but PROTECT pages are never merged in this pass — deferred for separate explicit approval.",
                f"{EV_PROT};{EV_SIM};{EV_STEP4}")
            held.append(m); continue
        if sim_ms >= 0.8 and slug_equivalent(m, survivor):
            put(m, "CONSOLIDATE", "merge-301", survivor,
                f"Near-duplicate of cluster survivor {f(survivor)} (similarity {sim_ms:.2f}); topics truly equivalent — the served content is the same document — so 301 to the survivor.",
                f"{EV_SIM};{EV_STEP4}")
            merged.append(m)
        elif sim_ms >= 0.95:
            put(m, "REMOVE", "remove-410", "",
                f"Verbatim-grade clone (similarity {sim_ms:.2f}) of {f(survivor)} under a different topic slug: the page serves another page's text, has demand score {mr['demand']} and no unique value of its own.",
                f"{EV_SIM};{EV_STEP4}")
            held.append(m)
        else:
            put(m, "IMPROVE", "rewrite", "",
                f"Near-duplicate of {f(survivor)} (similarity {sim_ms:.2f}) but the topic is not equivalent (different audience/subject in the slug): differentiate with genuinely topic-specific content or it stays a clone.",
                f"{EV_SIM};{EV_STEP4}")
            held.append(m)
    cluster_report.append({"survivor": survivor, "members": members,
                           "merged": merged, "held": held})

# ---------- slug-intent twins (same topic, independently templated text) ----------
# Pairs the >=0.8 content rule cannot see: slug-equivalent topics whose bodies
# differ. Weaker twin -> IMPROVE (merge intent / differentiate), never a
# content CONSOLIDATE (rule 3 needs >=0.8 AND equivalence; these fail >=0.8).
all_urls = sorted(inputs)
twin_parent = {u: u for u in all_urls}
def tfind(x):
    while twin_parent[x] != x:
        twin_parent[x] = twin_parent[twin_parent[x]]; x = twin_parent[x]
    return x
for i, a in enumerate(all_urls):
    for b in all_urls[i+1:]:
        if slug_equivalent(a, b):
            ra, rb = tfind(a), tfind(b)
            if ra != rb: twin_parent[ra] = rb
twin_groups = defaultdict(list)
for u in all_urls: twin_groups[tfind(u)].append(u)
intent_dup_of = {}
twin_group_list = []
for g in twin_groups.values():
    if len(g) > 1:
        ranked = sorted(g, key=rank_key)
        twin_group_list.append({"best": ranked[0], "members": sorted(g)})
        for m in ranked[1:]:
            intent_dup_of[m] = ranked[0]

# ---------- helpers for remaining pages ----------
TRUST = {"/about", "/contact", "/privacy", "/cookie-policy", "/disclaimer"}
def path(url): return url.replace("https://freeqrcode.tools", "") or "/"

def keep_qualifies(r):
    return (num(r["max_similarity"]) < 0.8 and num(r["unique_text_ratio"]) >= 0.5
            and inum(r["intent_fit"]) >= 3)

# ---------- pass 2: every remaining page ----------
for url, r in scores.items():
    if url in results: continue
    a = audit[url]
    words = inum(a["word_count_raw"])
    demand, uv, intent = inum(r["demand"]), inum(r["unique_value"]), inum(r["intent_fit"])
    utr, sim = num(r["unique_text_ratio"]), num(r["max_similarity"])
    clicks, impr = inum(r["clicks"]), inum(r["impressions"])
    yv = ymyl.get(url, ("NOT-FLAGGED", 0, 0))[0]
    canon_note = " Technical fix required regardless of class: this page serves no canonical tag (E-046)." if url.endswith("/qr-image-metadata-auditor") else ""

    # --- PROTECT gate (rule 1) ---
    if r["protect"] == "YES":
        if keep_qualifies(r) and yv != "UNSOURCED-ADVICE":
            put(url, "KEEP-INDEX-READY", "keep", "",
                f"Earning page (protect=YES: {clicks} clicks, {impr} impressions, E-042) that also qualifies as index-ready on its own merits (max similarity {sim:.2f}, unique-text {utr:.2f}); protect status recorded — do not alter without approval." + canon_note,
                f"{EV_PROT};{EV_SCORE};{EV_STEP4}")
        else:
            if sim >= 0.8: why = f"it sits in/near a duplicate cluster (max similarity {sim:.2f} to {f(r['most_similar_url'])}) and would otherwise be a merge/improve candidate"
            elif yv == "UNSOURCED-ADVICE": why = "it is YMYL-flagged advice with no source or disclaimer signals on full-content re-screen (R-012) and would otherwise need a sourced rewrite"
            elif not keep_qualifies(r): why = f"its execution is weak (unique-text {utr:.2f}, intent_fit {intent}, unique_value {uv}) and would otherwise be an improve candidate"
            else: why = "it needs individual review"
            put(url, "PROTECT", "none-deferred", "",
                f"PROTECT page (protect=YES: {clicks} clicks, {impr} impressions, E-042): {why} — deferred untouched for separate explicit approval." + canon_note,
                f"{EV_PROT};{EV_STEP4}")
        continue

    # --- trust / legal pages (real user + legal need; never REMOVE) ---
    if path(url) in TRUST:
        if keep_qualifies(r):
            put(url, "KEEP-INDEX-READY", "keep", "",
                "Trust/legal page with a real user and compliance function; unique text and technically clean. Its absence from the index is low-harm and not a defect to fix by removal." + canon_note,
                f"{EV_AUDIT};{EV_STEP4}")
        else:
            put(url, "IMPROVE", "rewrite", "",
                "Trust/legal page that must exist for users but is thin as published: add substantive, specific content (who runs the site, contact routes, policy specifics)." + canon_note,
                f"{EV_AUDIT};{EV_STEP4}")
        continue

    # --- YMYL unsourced advice (rule 5) ---
    if yv == "UNSOURCED-ADVICE":
        if demand >= 2:
            put(url, "IMPROVE", "rewrite", "",
                f"YMYL topic ({r['risk_class']}) with some demand (score {demand}) but zero source/disclaimer signals on full-content re-screen: sourced rewrite with named sources required — no generated rewrite." + canon_note,
                f"{EV_YMYL};{EV_STEP4}")
        elif uv >= 4 and words >= 800:
            put(url, "IMPROVE", "rewrite", "",
                f"YMYL topic ({r['risk_class']}), substantial content ({words} words) but zero source/disclaimer signals on full-content re-screen: sourced rewrite with named sources required — no generated rewrite." + canon_note,
                f"{EV_YMYL};{EV_STEP4}")
        else:
            put(url, "REMOVE", "remove-410", "",
                f"Unsourced templated YMYL advice ({r['risk_class']}): full-content re-screen found no sources and no disclaimer (R-012, E-041 base rate), demand score {demand}, unique_value {uv}. Removal, not a generated rewrite." + canon_note,
                f"{EV_YMYL};{EV_STEP4}")
        continue

    # --- near-duplicate outside clusters (twin outside the 856) ---
    if sim >= 0.8:
        if sim >= 0.95:
            put(url, "IMPROVE", "rewrite", "",
                f"Verbatim twin (similarity {sim:.2f}) of {f(r['most_similar_url'])}, which sits OUTSIDE this not-indexed set and is indexed: the evidence-backed fix is a 301 into that twin, but a merge target must belong to this URL set, so it is classed IMPROVE here and named in the report as a recommended Step 5 extension." + canon_note,
                f"{EV_SIM};{EV_STEP4}")
        else:
            put(url, "IMPROVE", "rewrite", "",
                f"Near-duplicate (similarity {sim:.2f}) of {f(r['most_similar_url'])}, which sits outside this not-indexed set: differentiate with unique, topic-specific content — merging is not available in this pass because the twin is not part of it." + canon_note,
                f"{EV_SIM};{EV_STEP4}")
        continue

    # --- REMOVE test (rule 4): low demand AND >=2 weakness signals ---
    # Guard (A-009): working tool/landing pages (intent_fit >= 3 in a tool
    # family) are not thin *content* — their low word count is the tool UI,
    # so the generic thin-content test must not 410 them.
    TOOL_FAMILIES = {"root", "whatsapp-qr", "payment-qr", "qr-labels"}
    weaknesses = []
    if uv <= 2: weaknesses.append(f"unique_value {uv}")
    if utr < 0.5: weaknesses.append(f"unique-text ratio {utr:.2f} (mostly family template)")
    if words < 500: weaknesses.append(f"thin content ({words} words)")
    if intent <= 2: weaknesses.append(f"intent_fit {intent} (no working preset / concrete substance)")
    if demand <= 1 and len(weaknesses) >= 2 and not (r["family"] in TOOL_FAMILIES and intent >= 3) and yv != "SOURCED":
        put(url, "REMOVE", "remove-410", "",
            f"Low value with no measured demand (demand score {demand}; absent from or negligible in the Performance export): " + "; ".join(weaknesses) + "." + canon_note,
            f"{EV_SCORE};{EV_AUDIT};{EV_STEP4}")
        continue
    if yv == "SOURCED" and demand <= 1 and len(weaknesses) >= 2:
        put(url, "IMPROVE", "rewrite", "",
            f"YMYL topic ({r['risk_class']}) with corroborated source signals on re-screen but thin execution (" + "; ".join(weaknesses) + "): strengthen with named sources and a disclaimer, or fold into the family's hub page — sourced content is not 410'd on heuristics alone." + canon_note,
            f"{EV_YMYL};{EV_SCORE};{EV_STEP4}")
        continue
    if demand <= 1 and len(weaknesses) >= 2 and r["family"] in TOOL_FAMILIES and intent >= 3:
        put(url, "IMPROVE", "rewrite", "",
            f"Working tool/landing page (intent_fit {intent}) that Google has never taken up: the tool functions, but the page around it is thin ({words} words, unique_value {uv}) — add scheme/use-case-specific guidance, examples and FAQs around the tool rather than removing a working tool." + canon_note,
            f"{EV_SCORE};{EV_AUDIT};{EV_STEP4}")
        continue

    # --- IMPROVE: valuable topic, weak execution (rule 6) ---
    if not keep_qualifies(r):
        deficits = []
        if utr < 0.5: deficits.append(f"unique-text ratio only {utr:.2f} — most of the page is shared family template")
        if intent <= 2: deficits.append(f"intent_fit {intent} — no working tool preset, concrete steps or verified specs detected")
        if uv <= 2: deficits.append(f"unique_value {uv} — short and lacking concrete artefacts (tables, worked examples)")
        if sim >= 0.65: deficits.append(f"max similarity {sim:.2f} to {f(r['most_similar_url'])} — too close to its sibling")
        if yv == "SOURCED": deficits.append("YMYL topic with some sourcing signals — strengthen with named sources and a disclaimer during the rewrite")
        put(url, "IMPROVE", "rewrite", "",
            "Valuable topic, weak execution: " + "; ".join(deficits) + "." + canon_note,
            f"{EV_SCORE};{EV_STEP4}")
        continue

    # --- slug-intent twin: same topic as a stronger page, distinct text ---
    if url in intent_dup_of:
        twin = intent_dup_of[url]
        put(url, "IMPROVE", "rewrite", "",
            f"Topic-intent duplicate of {f(twin)}: the slugs promise the same search intent but the bodies are independently templated (content similarity {sim:.2f}, below the 0.8 merge bar), so this is not a content consolidation — Step 5 should either fold this intent into {f(twin)} or give this page a genuinely different angle." + canon_note,
            f"{EV_SIM};{EV_STEP4}")
        continue

    # --- KEEP ---
    extra = ""
    if yv == "SOURCED": extra = " YMYL-flagged but carries source/disclaimer signals on re-screen; monitor only."
    if yv == "MENTION-OR-TOOL": extra = " YMYL screening flag is a mention/tool artefact on full-content re-screen, not advice content."
    put(url, "KEEP-INDEX-READY", "keep", "",
        f"Technically clean (200, self-canonical, in sitemap, depth {a['click_depth']}), unique enough (max similarity {sim:.2f}, unique-text {utr:.2f}) with real intent fit ({intent}/5). A victim of the site-level triage, not of its own defects — stays in the sitemap untouched." + extra + canon_note,
        f"{EV_AUDIT};{EV_SCORE};{EV_STEP4}")

# ---------- write url-actions.csv ----------
rows_out = []
for url in sorted(results):
    r, res = scores[url], results[url]
    rows_out.append({"url": url, "family": r["family"], "status": inputs[url],
                     "score": r["score_total"], "class": res["class"],
                     "action": res["action"], "target_url": res["target_url"],
                     "reason": res["reason"], "evidence_ids": res["evidence_ids"]})
with open(OUT / "url-actions.csv", "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=["url", "family", "status", "score", "class",
                                       "action", "target_url", "reason", "evidence_ids"])
    w.writeheader(); w.writerows(rows_out)

# ---------- verification ----------
errs = []
if len(rows_out) != 856: errs.append(f"row count {len(rows_out)} != 856")
if {x['url'] for x in rows_out} != set(inputs): errs.append("URL set mismatch vs inputs")
by_url = {x['url']: x for x in rows_out}
for x in rows_out:
    r = scores[x['url']]
    if r["protect"] == "YES" and x["class"] in ("CONSOLIDATE", "REMOVE"):
        errs.append(f"PROTECT in {x['class']}: {x['url']}")
    if x["class"] == "REMOVE" and inum(r["clicks"]) > 0:
        errs.append(f"clicks>0 in REMOVE: {x['url']}")
    if x["class"] == "CONSOLIDATE":
        t = by_url.get(x["target_url"])
        if not t: errs.append(f"target missing: {x['url']} -> {x['target_url']}")
        elif t["class"] not in ("KEEP-INDEX-READY", "IMPROVE", "PROTECT"):
            errs.append(f"target class {t['class']}: {x['url']} -> {x['target_url']}")
        elif audit[x["target_url"]]["status"] != "200":
            errs.append(f"target not 200: {x['target_url']}")
        if t and t["class"] == "CONSOLIDATE": errs.append(f"merge chain: {x['url']}")

counts_class = Counter(x["class"] for x in rows_out)
counts_cf = Counter((x["class"], x["family"]) for x in rows_out)
ymyl_by_class = Counter()
for x in rows_out:
    if x["url"] in ymyl: ymyl_by_class[x["class"]] += 1
ymyl_verdicts = Counter(v[0] for v in ymyl.values())
workings = {"counts_class": dict(counts_class),
            "counts_class_family": {f"{k[0]}|{k[1]}": v for k, v in sorted(counts_cf.items())},
            "ymyl_total": len(ymyl), "ymyl_by_class": dict(ymyl_by_class),
            "ymyl_verdicts": dict(ymyl_verdicts),
            "clusters": cluster_report, "n_clusters": len(cluster_report),
            "slug_twin_groups": twin_group_list,
            "n_slug_twin_pages": len(intent_dup_of),
            "n_merged": sum(1 for x in rows_out if x["class"] == "CONSOLIDATE"),
            "verification_errors": errs}
json.dump(workings, open(OUT / "step4-workings.json", "w"), indent=1)
print(json.dumps({k: workings[k] for k in ("counts_class", "ymyl_total", "ymyl_by_class",
      "ymyl_verdicts", "n_clusters", "n_merged", "verification_errors")}, indent=1))
print("class x family:")
for k, v in workings["counts_class_family"].items(): print(" ", k, v)
