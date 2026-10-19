# TOOLS — 100 More: Batch 3 Verification

Batch 3 — 20 tools (13 calculators/checkers + 7 validators/security). All files left
**uncommitted** on branch `growth/100-more-tools`. No other files touched. No push, no merge.

Verification method: re-read each file; ran `eslint` on each `page.tsx` (0 errors, 0 warnings
after fixes — see notes); grepped all 20 files for `TODO|FIXME|lorem|coming soon` → 0 matches
(excluding input `placeholder=` attributes). Hand-checked key math in Node (see notes).

- `/qr-wear-lifetime-estimator` — recomputes lifetime + replacement/inspection dates on every select/date change; lifetime = material baseline × environment factor × lamination factor.
- `/qr-print-waste-estimator` — recomputes on every change; hand-checked: 1,000 good codes at 3% waste → 1,031 total prints.
- `/qr-campaign-break-even-calculator` — recomputes on every change; hand-checked: 500 fixed cost ÷ 2.50 margin = 200 break-even scans; shows "Never" when margin ≤ 0.
- `/qr-dot-gain-tolerance-checker` — recomputes pass/fail + minimum safe module on every slider change; pass rule total spread ≤ 25% of module.
- `/qr-footfall-scan-estimator` — recomputes expected-scans range (0.6×–1.6× central estimate) on every change.
- `/qr-scan-funnel-calculator` — recomputes stage counts + overall conversion % on every change; funnel bars scale with stage counts.
- `/qr-ab-test-significance-calculator` — real chi-square (2×2, 1 df) + p-value via Abramowitz & Stegun erf; hand-checked defaults A 50/1000 vs B 68/1000 → χ² ≈ 2.92, p ≈ 0.088, not significant; warns when any expected cell < 5.
- `/qr-scan-test-sample-calculator` — one-sample n = z²·p(1−p)/E² and two-sample per-variant n = (zα+zβ)²·[p₁(1−p₁)+p₂(1−p₂)]/(p₂−p₁)²; recomputes on every change.
- `/qr-utm-audit-checker` — real `URL` parsing on every edit; flags missing/empty utm_source/medium/campaign, uppercase, spaces, unusual chars, duplicates, non-https.
- `/qr-version-estimator` — byte-mode capacity table (all 40 versions × L/M/Q/H) lookup on every edit; hand-checked: "https://example.com/menu" (24 bytes) at M → version 2, 25×25 modules.
- `/qr-print-area-calculator` — recomputes usable width/height/area + % lost on every change; warns when margins + bleed consume the stock.
- `/qr-readability-score-calculator` — recomputes weighted 0–100 score (30/30/20/20) + grade + weakest factor on every change.
- `/qr-code-retirement-planner` — retirement date = earliest of campaign end / link expiry with reason; next review = last review + cadence; recomputes on every change.
- `/qr-homograph-detector` — real confusable table (Cyrillic/Greek/fullwidth lookalikes) with per-character position, code point, script, and ASCII skeleton; flags mixed scripts.
- `/qr-payload-linter` — real per-scheme linting (URL, mailto:, tel:, sms:, geo: with lat/lng ranges, WIFI: fields, vCard, VEVENT, dangerous schemes) + length/whitespace checks on every edit.
- `/qr-allowlist-tester` — real wildcard matching (exact host, `*.domain`, scheme prefix, path `*`); recomputes allow/deny + matched rules on every edit.
- `/qr-blocklist-tester` — same real matcher as allowlist; recomputes block/allow + matched rules on every edit.
- `/qr-scheme-safety-checker` — real scheme extraction + fixed classification table (https/http/mailto/tel/sms/geo/WIFI:/bitcoin/javascript:/data:/file:/intent:/unknown) with risk verdict on every edit.
- `/qr-expiry-policy-builder` — generates policy text + review schedule + 30/7/1-day reminders from campaign dates + cadence; copy + download .txt both work.
- `/qr-clone-risk-scorer` — recomputes 0–100 points score + risk band + per-factor breakdown + mitigations tied to the highest factors on every change.

Notes:

- ESLint first pass found 1 parse error (A/B erf parentheses) and 3 warnings (unused `Input` import in version estimator, unused `upper` in payload linter, `placementFactor` exhaustive-deps in footfall estimator). All fixed; re-ran ESLint on the 6 affected files → 0 errors, 0 warnings. The other 14 files were 0 errors / 0 warnings on the first pass.
- The A/B erf approximation was verified numerically in Node: erf(0) ≈ 0, erf(3) ≈ 0.99998, and the default inputs reproduce χ² ≈ 2.92 / p ≈ 0.088.
- No full-project typecheck/build/content-audit run, per batch instructions (coordinator runs whole-project gates later).
