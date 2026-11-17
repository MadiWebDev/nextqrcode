# STEP 4 REPORT — Classification of the 856 not-indexed URLs

**Date:** 2026-11-17 · **Step 4 of the Indexing Fix program** (owner-approved
2026-11-17 after DIAGNOSIS.md). **Lists only — nothing has been changed:**
no code, sitemap, robots, redirect or indexability edits were made.
Machine output: `output/url-actions.csv` (856 rows). Classifier:
`tools/step4_classify.py`; workings: `output/step4-workings.json`.

## Executive summary

1. All 856 URLs are classified: **431 KEEP-INDEX-READY, 191 PROTECT,
   144 IMPROVE, 87 REMOVE, 3 ASSET-UTILITY, 0 CONSOLIDATE** (E-050).
2. The headline surprise: **zero content consolidations** — inside this URL
   set, no pair is *both* ≥0.8 textually identical *and* truly the same
   topic. The ≥0.8 pairs are noun-swap siblings (same text, different
   promised topic); the same-topic pairs have independently templated
   bodies. Each failure mode gets a different fix (E-051).
3. All 280 PROTECT pages are untouched by construction: 191 sit in
   PROTECT/none-deferred and 89 qualified as KEEP on their own merits with
   their protect status recorded in the reason (E-052).
4. REMOVE (87) contains zero pages with clicks, zero PROTECT pages, and
   splits into 26 unsourced-YMYL and 61 generic low-value pages.
5. The YMYL re-screen (R-012) found corroborated sourcing on only 24 of
   213 flagged pages; 145 are unsourced advice, 44 are mention/tool
   artefacts. 66 unsourced-YMYL pages are PROTECT earners — they are the
   single biggest deferred decision in this package.

## Decision rules, in the order applied

Scores were never used alone (R-010). Each URL passed through these gates
in this exact order; the first gate that fired decided its class:

1. **Asset gate.** URL is a font file or the web-app manifest
   (risk_class = ASSET) → ASSET-UTILITY / exclude-from-sitemap
   (informational; they are already correctly absent, E-045).
2. **Cluster pass.** Union-find groups over within-set pairs ≥0.8
   (22 groups, 97 pages). The survivor is chosen by: protect status >
   clicks > impressions > position > unique-text ratio > score. A member
   merges (CONSOLIDATE / merge-301) only if it has a *direct* ≥0.8 pair
   with the survivor **and** the two slugs are truly equivalent (token
   sets differing only by filler verbs/format words — any differing
   content token, e.g. *acrylic* vs *canvas*, *South Africa* vs
   *Venezuela*, means a different promised topic). PROTECT members never
   merge in this pass (→ PROTECT / none-deferred). Non-equivalent members
   → IMPROVE (differentiate), or REMOVE if a ≥0.95 verbatim clone of the
   survivor with no demand (none occurred).
3. **PROTECT gate.** protect=YES (E-042) → KEEP-INDEX-READY only if the
   page independently qualifies (max-similarity <0.8, unique-text ≥0.5,
   intent_fit ≥3, not unsourced YMYL), with the protect status stated in
   the reason; otherwise PROTECT / none-deferred, with the reason naming
   what is deferred (improve candidate, unsourced-YMYL rewrite candidate,
   or merge candidate).
4. **Trust gate.** /about, /contact, /privacy, /cookie-policy,
   /disclaimer are never REMOVE (real user/legal function) → KEEP or
   IMPROVE on their merits.
5. **YMYL re-screen (R-012).** Every one of the 213 flagged pages was
   re-screened against its full stored content. Verdicts: **SOURCED**
   requires named-authority-grade evidence (≥2 strong signals — named
   authorities, .gov, "according to", a sources/references section — or
   one strong signal corroborated by another signal or a disclaimer);
   topical vocabulary alone (*official, regulation, specification*) does
   not count. Non-advice families (tools) → MENTION-OR-TOOL. Unsourced
   advice with demand ≥2 or substantial content (≥800 words and
   unique_value ≥4) → IMPROVE with the mandated reason ("sourced rewrite
   with named sources required — no generated rewrite"); otherwise
   REMOVE / remove-410. Sourced pages are never 410'd on heuristics.
6. **Indexed-twin rule.** max-similarity ≥0.8 to a page *outside* the set:
   ≥0.95 → IMPROVE naming the 301-into-the-twin recommendation (the
   target is outside this file's URL set, so it cannot be a CONSOLIDATE
   row); 0.8–0.95 → IMPROVE (differentiate).
7. **REMOVE test.** demand ≤1 **and** ≥2 weakness signals (unique_value
   ≤2, unique-text <0.5, <500 words, intent_fit ≤2). Guard (A-009):
   working tool/landing pages (tool families with intent_fit ≥3) are
   exempt — their low word count is tool UI, not thin content — and go
   to IMPROVE instead. No noindex-follow actions are used in this pass:
   the one natural candidate, /sitemap-page, is PROTECT and is deferred
   inside that class.
8. **Slug-intent twin rule.** Slug-equivalent pairs whose bodies differ
   (similarity <0.8): the weaker twin → IMPROVE (fold the intent into the
   stronger page or differentiate the angle in Step 5). Not a merge —
   rule 3's ≥0.8 condition is not met.
9. **IMPROVE (residual).** Anything failing the KEEP bar with a named,
   specific deficiency (template ratio, missing preset/specs, sibling
   similarity 0.65–0.8, thin artefacts).
10. **KEEP-INDEX-READY (default).** Technically clean, max-similarity
    <0.8, unique-text ≥0.5, intent_fit ≥3 — victims of the site-level
    triage (DIAGNOSIS H1/H2), not of their own defects.

## Counts

### Per class

| Class | Action | n |
|---|---|---|
| KEEP-INDEX-READY | keep | 431 |
| PROTECT | none-deferred | 191 |
| IMPROVE | rewrite | 144 |
| REMOVE | remove-410 | 87 |
| ASSET-UTILITY | exclude-from-sitemap | 3 |
| CONSOLIDATE | merge-301 | **0** |
| **Total** | | **856** |

(Plus 89 protect=YES pages inside KEEP-INDEX-READY with protect status
recorded — total PROTECT-gated pages = 280, matching E-042.)

### Per class × family

| Family | KEEP | PROTECT | IMPROVE | REMOVE | ASSET | Total |
|---|---|---|---|---|---|---|
| blog | 177 | 183 | 126 | 85 | 0 | 571 |
| root (tools) | 199 | 0 | 6 | 0 | 1 | 206 |
| scan-guide | 13 | 5 | 1 | 0 | 0 | 19 |
| glossary | 11 | 2 | 2 | 0 | 0 | 15 |
| qr-size-guide | 11 | 1 | 2 | 0 | 0 | 14 |
| industries | 11 | 0 | 0 | 2 | 0 | 13 |
| templates | 8 | 0 | 0 | 0 | 0 | 8 |
| whatsapp-qr | 0 | 0 | 4 | 0 | 0 | 4 |
| payment-qr | 0 | 0 | 3 | 0 | 0 | 3 |
| qr-labels | 1 | 0 | 0 | 0 | 0 | 1 |
| _next | 0 | 0 | 0 | 0 | 2 | 2 |
| **Total** | **431** | **191** | **144** | **87** | **3** | **856** |

### YMYL (213 flagged) — re-screen verdict × class

| Verdict | KEEP | IMPROVE | REMOVE | PROTECT | Total |
|---|---|---|---|---|---|
| UNSOURCED-ADVICE | 0 | 53 | 26 | 66 | 145 |
| SOURCED | 13 | 4 | 0 | 7 | 24 |
| MENTION-OR-TOOL | 38 | 6 | 0 | 0 | 44 |
| **Total** | **51** | **63** | **26** | **73** | **213** |

Calibration note: against the Step 2 manual sample (E-041), this stricter
verdict agrees on 17/26 pages; all 9 disagreements are PROTECT pages whose
class is identical under either verdict, so the disagreement changes no
outcome in the sample. The sample counted any single mention (e.g. the
word "official") as a source signal; Step 4 requires corroborated
named-authority evidence before calling a page "sourced".

## Consolidation clusters — why CONSOLIDATE is 0

Rule 3 requires a pair to be **both** ≥0.8 textually near-identical
**and** truly topic-equivalent. Inside the 856, the two conditions never
coincide (E-051):

- **Same text, different topic (the ≥0.8 pairs).** The 22 groups below
  (97 pages) are template families chained by pairwise ≥0.8 links —
  *qr-payments-in-<country>*, *cost-of-bulk-<object>-qr-codes*,
  *mistakes-printing-qr-codes-on-<substrate>*. Merging Venezuela's
  payments page into South Africa's (similarity 0.93) would send readers
  to the wrong country's content. These are classified IMPROVE
  (differentiate) around a chosen survivor, or PROTECT where earning.
- **Same topic, different text (the slug twins).** 10 slug-equivalent
  groups (below) — including the pairs the brief itself flagged
  (static-vs-dynamic, government-services, data-matrix/-2, pet-id-tag) —
  have content similarity **<0.5**: independently templated bodies for
  one search intent. Weaker twins → IMPROVE (fold intent or
  differentiate), not a content merge.
- **The real merges straddle the set boundary.** The two verbatim pairs
  (similarity 1.00) each have one foot outside the 856: /bulk-vcard-qr ↔
  indexed /bulk-vcard-generator, and /regional-payment-qr ↔ indexed
  /pakistan-payment-qr. Both in-set pages are IMPROVE rows whose reasons
  recommend a 301 into the indexed twin as a Step 5 extension — a merge
  target must belong to this file, so they cannot be CONSOLIDATE rows
  here. Most of the 481 earning twins (E-043) create the same situation:
  the consolidation opportunity lives between this set and the indexed
  corpus, and approving it is a separate decision (see QUESTIONS).

### The 22 near-duplicate groups (survivor → members; M = merged)

No group produced a merge (M = 0 everywhere) for the reasons above.
"Survivor" is the group's strongest page (ranking rule 2), kept as the
canonical version the siblings must differentiate from.


**G1. Survivor: /blog/how-to-create-a-qr-code-for-a-waitlist-signup [PROTECT]** (10 pages)
- /blog/how-to-create-a-qr-code-for-a-luggage-tag [IMPROVE]
- /blog/how-to-create-a-qr-code-for-a-pet-id-tag [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-business-card [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-job-application [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-product-manual [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-salon-booking [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-taxi-booking [PROTECT]
- /blog/how-to-make-a-qr-code-for-a-warranty-registration [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-whatsapp-group [IMPROVE]

**G2. Survivor: /blog/cost-of-bulk-price-tags-qr-codes [KEEP-INDEX-READY]** (9 pages)
- /blog/cost-of-bulk-business-cards-qr-codes [IMPROVE]
- /blog/cost-of-bulk-donation-slips-qr-codes [IMPROVE]
- /blog/cost-of-bulk-event-badges-qr-codes [IMPROVE]
- /blog/cost-of-bulk-feedback-cards-qr-codes [IMPROVE]
- /blog/cost-of-bulk-invoices-qr-codes [IMPROVE]
- /blog/cost-of-bulk-membership-cards-qr-codes [IMPROVE]
- /blog/cost-of-bulk-parking-permits-qr-codes [IMPROVE]
- /blog/cost-of-bulk-shelf-labels-qr-codes [IMPROVE]

**G3. Survivor: /blog/bulk-qr-codes-for-business-cards-setup [KEEP-INDEX-READY]** (7 pages)
- /blog/bulk-qr-codes-for-inventory-labels-setup [IMPROVE]
- /blog/bulk-qr-codes-for-invoices-setup [IMPROVE]
- /blog/bulk-qr-codes-for-menus-setup [IMPROVE]
- /blog/bulk-qr-codes-for-parking-permits-setup [IMPROVE]
- /blog/bulk-qr-codes-for-shelf-labels-setup [IMPROVE]
- /blog/bulk-qr-codes-for-shipping-labels-setup [IMPROVE]

**G4. Survivor: /blog/printing-bulk-shipping-labels-qr-codes [IMPROVE]** (6 pages)
- /blog/printing-bulk-business-cards-qr-codes [IMPROVE]
- /blog/printing-bulk-feedback-cards-qr-codes [IMPROVE]
- /blog/printing-bulk-menus-qr-codes [IMPROVE]
- /blog/printing-bulk-price-tags-qr-codes [IMPROVE]
- /blog/printing-bulk-tickets-qr-codes [IMPROVE]

**G5. Survivor: /blog/how-to-test-qr-print-vs-screen [PROTECT]** (6 pages)
- /blog/how-to-test-qr-accessibility [IMPROVE]
- /blog/how-to-test-qr-contrast [IMPROVE]
- /blog/how-to-test-qr-gradients [IMPROVE]
- /blog/how-to-test-qr-sizing [IMPROVE]
- /blog/how-to-test-qr-transparency [IMPROVE]

**G6. Survivor: /blog/mistakes-printing-qr-codes-on-acrylic [PROTECT]** (5 pages)
- /blog/mistakes-printing-qr-codes-on-canvas [IMPROVE]
- /blog/mistakes-printing-qr-codes-on-glow-in-the-dark-film [IMPROVE]
- /blog/mistakes-printing-qr-codes-on-polypropylene-film [PROTECT]
- /blog/mistakes-printing-qr-codes-on-window-film [IMPROVE]

**G7. Survivor: /blog/qr-label-cost-on-waterproof-synthetic [PROTECT]** (5 pages)
- /blog/qr-label-cost-on-canvas [IMPROVE]
- /blog/qr-label-cost-on-floor-vinyl [IMPROVE]
- /blog/qr-label-cost-on-static-cling [IMPROVE]
- /blog/qr-label-cost-on-uncoated-paper [IMPROVE]

**G8. Survivor: /blog/qr-code-durability-on-canvas [PROTECT]** (5 pages)
- /blog/qr-code-durability-on-acrylic [IMPROVE]
- /blog/qr-code-durability-on-coated-paper [IMPROVE]
- /blog/qr-code-durability-on-recycled-paper [IMPROVE]
- /blog/qr-code-durability-on-rigid-board [IMPROVE]

**G9. Survivor: /blog/qr-mistakes-yoga-studios-avoid [PROTECT]** (5 pages)
- /blog/qr-mistakes-bakeries-avoid [IMPROVE]
- /blog/qr-mistakes-clinics-avoid [IMPROVE]
- /blog/qr-mistakes-food-trucks-avoid [IMPROVE]
- /blog/qr-mistakes-hostels-avoid [IMPROVE]

**G10. Survivor: /blog/qr-payments-in-jamaica [PROTECT]** (4 pages)
- /blog/qr-payments-in-nepal [IMPROVE]
- /blog/qr-payments-in-south-africa [IMPROVE]
- /blog/qr-payments-in-venezuela [IMPROVE]

**G11. Survivor: /blog/how-to-make-a-qr-code-for-a-calendar-event-with-a-reminder [PROTECT]** (4 pages)
- /blog/how-to-make-a-qr-code-for-a-pdf [IMPROVE]
- /blog/how-to-make-a-qr-code-for-a-spotify-playlist [IMPROVE]
- /blog/how-to-make-a-qr-code-for-an-instagram-profile [IMPROVE]

**G12. Survivor: /blog/qr-payments-in-saudi-arabia [PROTECT]** (4 pages)
- /blog/qr-payments-in-brazil [IMPROVE]
- /blog/qr-payments-in-malaysia [IMPROVE]
- /blog/qr-payments-in-taiwan [PROTECT]

**G13. Survivor: /blog/qr-payments-in-jordan [PROTECT]** (4 pages)
- /blog/qr-payments-in-kenya [IMPROVE]
- /blog/qr-payments-in-myanmar [PROTECT]
- /blog/qr-payments-in-peru [PROTECT]

**G14. Survivor: /blog/qr-payments-in-kuwait [PROTECT]** (3 pages)
- /blog/qr-payments-in-cambodia [IMPROVE]
- /blog/qr-payments-in-costa-rica [IMPROVE]

**G15. Survivor: /blog/qr-payments-in-qatar [PROTECT]** (3 pages)
- /blog/qr-payments-in-new-zealand [IMPROVE]
- /blog/qr-payments-in-nicaragua [PROTECT]

**G16. Survivor: /blog/qa-checklist-for-bulk-inventory-labels-qr-codes [PROTECT]** (3 pages)
- /blog/qa-checklist-for-bulk-invoices-qr-codes [PROTECT]
- /blog/qa-checklist-for-bulk-wristbands-qr-codes [PROTECT]

**G17. Survivor: /blog/qr-payments-in-thailand [PROTECT]** (3 pages)
- /blog/qr-payments-in-mongolia [PROTECT]
- /blog/qr-payments-in-paraguay [PROTECT]

**G18. Survivor: /blog/qr-payments-in-poland [PROTECT]** (3 pages)
- /blog/qr-payments-in-ethiopia [PROTECT]
- /blog/qr-payments-in-sri-lanka [IMPROVE]

**G19. Survivor: /blog/qr-payments-in-laos [PROTECT]** (2 pages)
- /blog/qr-payments-in-oman [IMPROVE]

**G20. Survivor: /blog/measuring-qr-results-for-veterinary-clinics [IMPROVE]** (2 pages)
- /blog/measuring-qr-results-for-spas [IMPROVE]

**G21. Survivor: /blog/qr-payments-with-mobilepay [IMPROVE]** (2 pages)
- /blog/qr-payments-with-yoomoney [IMPROVE]

**G22. Survivor: /blog/qr-payments-with-laoqr [PROTECT]** (2 pages)
- /blog/qr-payments-with-fps [IMPROVE]

### The 10 slug-intent twin groups (stronger page first)

1. /blog/how-to-create-a-qr-code-for-a-luggage-tag [IMPROVE], /luggage-tag-qr-generator [IMPROVE]
2. /blog/how-to-create-a-qr-code-for-a-pet-id-tag [IMPROVE], /blog/qr-code-pet-id-tag [IMPROVE]
3. /blog/how-to-make-a-qr-code-for-a-job-application [IMPROVE], /job-application-qr-generator [IMPROVE]
4. /blog/how-to-make-a-qr-code-for-a-pdf [IMPROVE], /pdf-qr-code-generator [IMPROVE]
5. /blog/how-to-make-wifi-qr-code [KEEP-INDEX-READY], /wifi-qr-code-generator [IMPROVE]
6. /blog/qr-code-for-government-services [IMPROVE], /blog/qr-code-government-services [KEEP-INDEX-READY]
7. /blog/qr-code-for-manufacturing-work-instructions [PROTECT], /industries/manufacturing-work-instructions [KEEP-INDEX-READY]
8. /blog/qr-code-vs-data-matrix [IMPROVE], /blog/qr-code-vs-data-matrix-2 [IMPROVE]
9. /blog/static-qr-vs-dynamic-qr [IMPROVE], /blog/static-vs-dynamic-qr-codes [IMPROVE]
10. /blog/structured-append-qr-codes [PROTECT], /glossary/structured-append [IMPROVE]

## REMOVE breakdown (87, all remove-410)

| Reason | n | Notes |
|---|---|---|
| Unsourced templated YMYL advice | 26 | Full-content re-screen: no sources, no disclaimer; demand ≤1. Includes elections (/blog/qr-code-for-local-elections, /blog/qr-code-for-political-campaigns), medical (/blog/qr-code-for-emergency-services, /industries/healthcare-patient-wristband-id), financial (/blog/bitcoin-payment-qr-code-bip21) |
| Generic low value | 61 | demand ≤1 **and** ≥2 of: unique_value ≤2, unique-text <0.5, <500 words, intent_fit ≤2. All 61 are blog pages, mostly *qr-code-for-\** posts whose text is ≥50% family template (the 2 industries REMOVEs are both in the YMYL row above) |

Safety checks on REMOVE: **0 pages with clicks >0** (verified against
scores.csv), **0 PROTECT pages**, 0 working tools (the A-009 guard moved
all 7 tool/landing candidates — Brazil Pix, SGQR, Swiss QR-Bill, 4
WhatsApp country pages — to IMPROVE). No noindex-follow actions: no
REMOVE page has a live user-flow dependency that justifies one; the one
candidate elsewhere (/sitemap-page) is PROTECT and deferred.

## IMPROVE composition (144)

| Deficiency (from the row's reason) | n |
|---|---|
| Cluster sibling — differentiate from the group survivor | 64 |
| Unsourced YMYL — sourced rewrite, named sources, no generated text | 39 |
| Weak execution (template ratio / thin artefacts / sibling similarity) | 18 |
| Slug-intent twin — fold intent or differentiate angle | 7 |
| Working tool/landing page, thin surrounding content | 7 |
| Near-duplicate of an indexed twin — differentiate | 5 |
| Sourced YMYL but thin — strengthen, don't delete | 2 |
| Verbatim twin of an indexed page — 301 recommended (Step 5 extension) | 2 |

## Worked examples (5 per class)

**KEEP-INDEX-READY**
- `/app-review-link-qr-generator` (19) — clean tool, max-sim 0.09, unique-text 0.91, intent 5/5; never crawled, purely a triage victim.
- `/bakery-qr-suite` (19) — same pattern: unique suite tool, no defects of its own.
- `/about` (24) — PROTECT earner (1 click) that also qualifies on merits; protect status recorded in its reason.
- `/blog/cost-of-bulk-price-tags-qr-codes` — survivor of a 9-page group; the strongest version stays, siblings differentiate.
- `/qr-image-metadata-auditor` (19) — KEEP on merits, **plus the standing technical fix in its reason: it serves no canonical (E-046)**, to be repaired in Step 5 regardless of class.

**IMPROVE**
- `/payment-qr/swiss-qr-bill` — working scheme tool (intent 4) in a thin page (419 words): add scheme-specific guidance around the tool; the A-009 guard kept it out of REMOVE.
- `/bulk-vcard-qr` — verbatim twin (1.00) of indexed /bulk-vcard-generator; reason recommends the 301 as a Step 5 extension.
- `/blog/static-qr-vs-dynamic-qr` — slug-intent twin of /blog/static-vs-dynamic-qr-codes with a *different* body (similarity 0.69): fold intent or differentiate, not a content merge.
- `/blog/ai-anti-counterfeit-qr-verification` — YMYL (government), 1,119 words, zero sourcing signals: sourced rewrite with named sources required — no generated rewrite.
- `/blog/bulk-qr-codes-for-invoices-setup` — 0.88-similar to the business-cards survivor but a different topic: differentiate with invoice-specific substance.

**REMOVE**
- `/blog/qr-code-for-art-galleries` (16) — demand 1, unique_value 2, unique-text 0.32: two-thirds family template.
- `/blog/qr-code-for-local-elections` — unsourced elections advice, no disclaimer, no demand: the YMYL risk class the diagnosis warned about.
- `/blog/bitcoin-payment-qr-code-bip21` (16) — unsourced financial (crypto) content, demand 1, unique_value 2.
- `/blog/qr-code-for-emergency-services` — unsourced medical advice pattern, no sourcing, no demand.
- `/industries/healthcare-patient-wristband-id` — unsourced medical industry page; its blog sibling is also REMOVE, so no orphan link target is created inside the set.

**PROTECT** (all none-deferred; reasons name the deferred action)
- `/blog/qr-code-for-election-voter-information` — 3 clicks, 21 impressions, *and* unsourced YMYL: the hardest page in the set; deferred whole, needs its own explicit decision.
- `/blog/barcode-vs-qr-code-difference` — 24 impressions but unique-text 0.46: improve candidate, deferred.
- `/blog/mistakes-printing-qr-codes-on-acrylic` — group survivor *and* earner: siblings differentiate from it; it is not touched.
- `/blog/qr-payments-in-taiwan` — merge-shaped candidate inside the Saudi-Arabia group: PROTECT pages are never merged in this pass.
- `/sitemap-page` — an HTML sitemap utility that earns impressions; the natural noindex-follow candidate, deferred rather than actioned.

**ASSET-UTILITY** (only 3 exist)
- `/_next/static/immutable/media/0c89a48fa5027cee-s.p.1ii7211jqpzi_.woff2`, `/_next/static/immutable/media/83afe278b6a6bb3c-s.p.45535valc9rzk.woff2`, `/manifest.webmanifest` — files, not pages; already correctly excluded from the sitemap (E-045).

**CONSOLIDATE** — no examples exist; see the clusters section for why
that is a finding, not an omission.

## What Step 5 would do with each class (preview only — no implementation here)

- **KEEP-INDEX-READY (431):** nothing to the pages themselves. They stay
  in the rebuilt sitemap; Step 5's job for them is the shared plumbing —
  real per-page lastmod, the single isIndexable() source of truth, CI
  checks — plus the internal-link strengthening the diagnosis's weak-H4
  calls for, so the cohort's re-crawl case improves as the corpus around
  them shrinks.
- **PROTECT (191):** nothing at all without the separate approvals listed
  in QUESTIONS. In Step 5 they are carried into the sitemap unchanged
  and explicitly excluded from every batch's change set; the deferred
  sub-lists (merge candidates, unsourced-YMYL earners, improve
  candidates) are decided one by one.
- **IMPROVE (144):** the rewrite queue, worked in the staged rollout
  order — differentiation briefs for the 64 cluster siblings (each names
  its survivor and the angle it must own), sourced rewrites for the 39
  YMYL pages (human-sourced, named references, disclaimers; no generated
  text), content build-out around the 7 working tools, and intent folds
  for the 7 slug twins. Each rewritten page is re-audited before it
  re-enters the sitemap as index-ready.
- **REMOVE (87):** return a real 410, delete from the sitemap and from
  internal links (the link graph in output/graph.csv identifies every
  in-set linker), and add the CI rule that a removed URL can never
  reappear in the sitemap. Rollout in the last batch, after IMPROVE,
  per the staged plan.
- **CONSOLIDATE (0 in-set; 2 recommended extensions):** no in-set
  merges. If the owner approves the extension, /bulk-vcard-qr →
  /bulk-vcard-generator and /regional-payment-qr →
  /pakistan-payment-qr become the program's first two 301s, with the
  same treatment then evaluated for the wider indexed-twin population.
- **ASSET-UTILITY (3):** no action; the Step 5 sitemap builder and CI
  checks simply guarantee assets can never be emitted as pages.

## Verification (all re-derived independently of the classifier)

- ✅ Exactly 856 rows; URL set identical to the two input Table.csv
  files; no duplicates; status column matches the input issue per URL.
- ✅ 0 PROTECT pages in CONSOLIDATE or REMOVE; 0 pages with clicks >0
  in REMOVE (REMOVE's maximum lifetime clicks = 0; only 38 pages in the
  whole set have clicks, split 27 PROTECT / 11 KEEP-with-protect-noted).
- ✅ CONSOLIDATE is empty, so the target checks (target exists, is
  KEEP/IMPROVE/PROTECT, returned 200, no chains) hold vacuously; the
  checks are coded and will bind any future merge rows.
- ✅ Class and action vocabularies match the brief exactly; every row
  carries a reason and evidence IDs (E-050 is this classification;
  per-row IDs cite E-035/E-037/E-038/E-040/E-041/E-042/E-046/E-048 as
  applicable).

## Red-team 5 — how this classification could be wrong

1. **CONSOLIDATE = 0 could be a rule artifact.** The ≥0.8 *and*
   slug-equivalence conjunction is strict: chained groups mean some
   ≥0.9 pairs never faced the survivor test (e.g. South Africa ↔
   Venezuela at 0.93 are both non-survivors). I judged those pairs
   non-equivalent by topic; an owner who reads the two bodies and finds
   them interchangeable can move named pairs to CONSOLIDATE — the pairs
   are all listed in the cluster section for exactly that review.
2. **The YMYL SOURCED bar is a judgment call.** It disagrees with the
   Step 2 signal scan on 9/26 sample pages (all PROTECT, so no outcome
   changed there). On non-PROTECT pages the same strictness pushed
   borderline pages toward REMOVE/IMPROVE-rewrite; if the owner prefers
   the looser bar, ~a dozen IMPROVE-rewrite rows soften to KEEP and a
   few REMOVE rows become rewrites. The 26 REMOVE-YMYL rows are listed
   in url-actions.csv for line-by-line veto.
3. **Demand is measured through a capped export.** The Performance
   export truncates at 1,000 rows; "demand ≤1" can mean "absent from a
   truncated export" (scores-README). A page Google was beginning to
   reward could sit in REMOVE's generic bucket. Mitigation already
   applied: clicks >0 is impossible in REMOVE, and family-fallback
   demand was used, never raw absence — but a fresh full export before
   Step 5 applies the 410s would retire this risk.
4. **KEEP = 431 is a bet on the diagnosis.** If H1's site-level form is
   wrong and the true cause is per-page quality after all, hundreds of
   KEEP pages will stay unindexed and Step 6's observation windows —
   not this list — are what will catch it. The staged rollout exists
   precisely so this bet is tested on batches before it is believed.
5. **Heuristic components still steer the middle.** unique_value and
   intent_fit are feature proxies (A-009); the A-009 guard caught the
   tool pages, but blog pages near the REMOVE/IMPROVE boundary
   (unique_value 2 vs 3) are decided by proxy margins. The owner
   hand-checking a 20-page boundary sample before Step 5 would either
   validate the boundary or re-base it, per A-009's own terms.

## QUESTIONS — approval needed next (updated)

Step 4 is complete. **Nothing in url-actions.csv will be applied**
until the owner approves. The approvals, in the order Step 5 needs
them:

1. **The lists as a whole** — approve url-actions.csv as the Step 5
   input (KEEP 431 / IMPROVE 144 / REMOVE 87 / ASSET 3), or return it
   with line vetoes (every row is individually reversible at this
   stage).
2. **Separately: the PROTECT deferred sub-lists** (191 pages) — (a) 11
   merge candidates, (b) 66 unsourced-YMYL earners needing sourced
   rewrites, (c) ~103 improve candidates. Recommend deciding (b) first:
   it is the largest risk concentration in the program.
3. **Separately: the consolidation extension** — the two verbatim-twin
   301s (/bulk-vcard-qr, /regional-payment-qr) whose targets are indexed
   pages outside this set, and whether Step 5 may evaluate the same
   treatment for other in-set pages with ≥0.95 indexed twins.
4. **Still open from before (unchanged blockers):** Manual Actions +
   Security confirmation (H6), Crawl Stats, Sitemaps detail — see
   QUESTIONS.md; a fresh, uncapped Performance > Pages export would
   also retire red-team item 3 before any 410 is applied.
