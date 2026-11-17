# scores-README — how scores.csv was computed (Step 2, 2026-11-17)

Tool: `seo-agent/tools/similarity.py`. Every one of the 856 drilldown URLs is
scored on five components, each 0–5, summed to `score_total` /25 with **equal
weights (20% each)**. The formula is a triage aid for Step 4, not a verdict:
the totals compress at the top (median 19, min 12) because technical health is
near-perfect site-wide and the intent-fit heuristic is generous. Step 4 must
read the components, `protect`, `risk_class` and `max_similarity` together —
never the total alone.

## Components

| Component | Source | Mapping |
|---|---|---|
| `uniqueness` | Max word-5-shingle Jaccard similarity to any same-family sibling (`max_similarity`) | ≥0.95→0 · ≥0.90→1 · ≥0.80→2 · ≥0.65→3 · ≥0.45→4 · <0.45→5 |
| `demand` | GSC Performance export (`baseline/gsc-export/Pages.csv`), joined by URL | clicks ≥3 or impressions ≥75 → 5 · clicks ≥1 or impr ≥40 → 4 · impr ≥15 → 3 · impr ≥5 → 2 · impr ≥1 → 1 · impr 0 → 0. URLs **absent** from the export get a family fallback (`demand_source` says so): 1 if their family has ≥5 pages earning ≥5 impressions in the export, else 0. The export is capped at 1,000 rows — **absence ≠ zero demand**. |
| `intent_fit` | Fetched page features (heuristic proxy for "working tool preset / concrete steps / verified specs") | Tool families (root, whatsapp-qr, payment-qr, qr-labels): ≥3 form inputs+buttons → +3 (≥1 → +2); ≥400 words → +1; FAQ schema → +1. Content families: ≥800 words → +2 (≥500 → +1); ≥3 lists+tables → +1; FAQ schema → +1; exactly one H1 → +1. Capped at 5. |
| `unique_value` | Length + unique-text ratio + concrete artefacts | ≥1,000 words → +2 (≥600 → +1); unique-text ratio ≥0.8 → +2 (≥0.6 → +1); ≥1 table or ≥5 lists → +1. Capped at 5. Heuristic proxy — it cannot judge whether the content is *right*, only whether it is substantial and non-templated. |
| `technical_health` | Step 1 audit fields | Start 5. −2 status ≠ 200 · −1 redirect chain >1 hop · −1 canonical not self-referencing · −2 noindex (meta or X-Robots-Tag) · −1 TTFB > 1.5 s (proxy-inflated measurement, generous threshold) · −1 H1 count ≠ 1. Floor 0. |

## Similarity method

Word 5-shingles over boilerplate-stripped main content (same extractor as the
baseline crawl). Within each path family, an inverted index generates
candidate pairs; exact Jaccard is computed for pairs sharing ≥8 shingles and
for each drilldown page's top-40 candidates by shared-shingle count. Pairs at
≥0.9/≥0.8 share so many shingles by construction that the candidate step
cannot miss them; pairs near the 0.5 reporting floor may be undercounted and
are labelled as floor estimates in similarity.md. Clusters use union-find at
the stated threshold over pairs with ≥1 member in the 856.

## unique_text_ratio

Share of a page's shingles that are **not** template shingles, where a
template shingle is one appearing in ≥20% of the family's pages. 1.0 = no
shared template text detected; lower = more of the page is family boilerplate
prose. Merged into `audit.csv` as `unique_text_ratio` (+ `max_similarity`,
`most_similar_url`).

## protect flag

`protect = YES` when the Performance export shows clicks > 0, **or**
impressions ≥ 15, **or** average position ≤ 20 with impressions > 0 (the
commissioning brief's rule). 280 of 856 are protect=YES — all in the
crawled set (a never-crawled page cannot have impressions). Protect means:
Step 4 must not touch these without the owner's explicit approval.

## risk_class

Screening flag, **not a verdict**: YMYL term groups (elections, immigration,
legal, medical, tax, insurance, financial, government, donations) matched on
word boundaries in the slug or the first ~6,000 characters of main content.
213 of 856 flagged. The flag over-triggers on mentions (e.g. a scan guide
mentioning banking apps) and under-triggers on euphemism; the manual sample
in `ymyl-sample.md` is the ground-truth check. The 3 non-page assets
(2 × .woff2, manifest.webmanifest) are marked `ASSET (not a page)` and left
unscored.
