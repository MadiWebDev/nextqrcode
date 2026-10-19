# Decisions

Every non-obvious choice made during the autonomous build: decision, alternatives considered, reason.
The user asked for zero questions — the best default is chosen and recorded here.

---

## Phase 0

### D0.1 — Test framework: Vitest over Jest

- **Decision:** Vitest 5 + jsdom + Testing Library; Playwright for e2e.
- **Alternatives:** Jest (slower, more config), Cypress (heavier).
- **Reason:** Vitest is the fastest TS-native runner, shares the Vite transform pipeline, and
  Playwright is the standard for cross-browser e2e including mobile viewports.

### D0.2 — @types/node upgraded 20 → 24

- **Decision:** Bumped `@types/node` to `^24`.
- **Alternatives:** Pin Vitest 3, or `--legacy-peer-deps`.
- **Reason:** Vitest 5 requires `@types/node ^22 || >=24`; runtime is Node 24.20.0, so aligning
  types with the runtime is the correct, non-hacky fix. No code impact.

### D0.3 — Husky v9 hook format

- **Decision:** `.husky/pre-commit` contains only `npx lint-staged` (no `_/husky.sh` sourcing).
- **Reason:** Husky 9 removed the `_/husky.sh` shim; the old line would break the hook.

### D0.4 — CI runs e2e only on Chromium

- **Decision:** GitHub Actions: quality job (prettier, eslint, tsc, vitest, build) then Playwright
  smoke on Chromium only.
- **Alternatives:** Full browser matrix on every push.
- **Reason:** Speed and cost; the mobile project runs locally and in the nightly extended suite
  (Phase 9). Chromium catches the vast majority of regressions.

### D0.5 — Brand/domain: keep `config/site.ts` as single source of truth (Phase 1)

- **Decision:** Resolve the "QR Code Tools" vs `nextqrcode` / `freeqrcode.tools` inconsistency via
  a central `config/site.ts` in Phase 1, not by renaming the repo.
- **Reason:** Renaming the GitHub repo mid-program would break the user's existing Vercel
  deployment links; a config-driven brand is reversible.

### D0.6 — Byline `codexengr` kept as site-team identity

- **Decision:** Keep `codexengr` ("QR Studio by codexengr") as the author/operator byline.
- **Alternatives:** Invent a staff-writer persona; strip bylines.
- **Reason:** `.agents/tasks/phase0-plan.md` (prior repo convention) establishes `codexengr` as the
  operator handle across footer, contact pages and content. It is not a fabricated third-party
  persona; replacing it would break repo continuity. The master spec allows "real or site-team name".

### D0.7 — Adopt prior plan's style rules as code conventions

- **Decision:** Adopt the page style rules from `.agents/tasks/phase0-plan.md` (wrapper classes,
  h2/h3/body styles, `<time dateTime>`, link styles, per-page metadata + BreadcrumbList JSON-LD).
- **Reason:** Master spec rule 1: repo files win for code conventions. These rules are already
  applied across existing pages; Phase 1 codifies them into the design system.

## Phase 1

### D1.1 — Brand: "QR Studio" via config/site.ts

- **Decision:** Product brand = "QR Studio", operator = codexengr, canonical URL default
  `https://freeqrcode.tools` (override via `NEXT_PUBLIC_SITE_URL`); all in `src/config/site.ts`.
- **Reason:** Matches the repo's established identity (footer, prior plan); centralizes the
  previously scattered brand/domain literals (D0.5).

### D1.2 — Typography: Space Grotesk display + Inter body via next/font

- **Decision:** Google Fonts loaded with `next/font` (`display: swap`), CSS variables.
- **Alternatives:** System font stack (zero network dependency).
- **Reason:** Distinctive but professional; `next/font` self-hosts at build time (no runtime
  Google request, no CLS). Connectivity to fonts.googleapis.com verified in-sandbox.

### D1.3 — Page-level canonical literals left in place

- **Decision:** Hardcoded `https://freeqrcode.tools` in page metadata/JSON-LD stays; only
  infrastructure (layout, sitemap, robots, qr-helpers, cards API) now reads `siteConfig.url`.
- **Reason:** Literals equal the config default (behavior-neutral); the 20 page files get
  regenerated metadata from the content model in Phase 5 anyway.

### D1.4 — AdSense loader gated on consent + flag now; full policy in Phase 7

- **Decision:** `GoogleAdSense` renders only when ads flag on + client ID set + consent granted.
  Third-party ahrefs analytics moved behind the same consent gate (`ConsentScripts`).
- **Reason:** Privacy architecture belongs in Phase 1; placement/eligibility rules are Phase 7.

### D1.5 — PWA: manifest route + minimal offline service worker

- **Decision:** `src/app/manifest.ts` (replaces `public/manifest.json`); `public/sw.js`
  cache-first for assets, network-first for navigations, never caches `/api/*` or `/r/*`;
  registered only in production.
- **Reason:** Offline shell for the static generator per spec; kept minimal and best-effort.

### D1.6 — error.tsx must be a client component

- **Decision:** Added `'use client'` to `src/app/error.tsx` after the build failed
  ("Ecmascript file had an error").
- **Reason:** Next.js requires error boundaries to be client components; the cryptic build
  error was exactly this.

## Phase 2

### D2.1 — Payload fixes: spec-correct, not backward-compatible where broken

- **Decision:** Fixed SEPA (real newlines), vCard (RFC 6350 4.0), event (RFC 5545 ICS),
  Ethereum (wei), WiFi (single trailing `;`) even though payload strings changed.
- **Reason:** The old outputs were broken/non-scannable; "never break what works" does not
  protect broken output. Untouched types are byte-identical (regression-tested).

### D2.2 — WiFi empty password still allowed

- **Decision:** `buildWifi` encodes empty password as `P:;` instead of throwing.
- **Reason:** The generator form marks password optional; throwing degraded to an empty
  payload (worse UX than the old behavior).

### D2.3 — PDF via jsPDF with crop marks, not print dialog

- **Decision:** Real `.pdf` download (A4, 80mm code, 3mm-bleed crop marks) via dynamically
  imported `jspdf`; the old print-dialog flow stays as the separate Print button.
- **Reason:** Spec requires print-ready PDF download; dynamic import keeps it out of the bundle.

### D2.4 — Round-trip tests rasterize the QR matrix in Node (no canvas)

- **Decision:** Vitest round-trip builds `qrcode` module matrix → raw RGBA → jsQR decode.
- **Reason:** jsdom has no canvas; matrix rasterization tests the real encode/decode path
  without a browser. Playwright covers the UI path for 3 key types.

## Phase 3

### D3.1 — Mongoose alongside the legacy raw MongoClient (cards)

- **Decision:** New code uses Mongoose (`src/lib/db/mongoose.ts`, `src/models/`); the legacy
  digital-cards API keeps its raw MongoClient in `src/lib/mongodb.ts`.
- **Reason:** Migrating cards risks breaking a working feature; the spec does not cover cards.
  Two DB layers is acknowledged tech debt (see AUDIT tech-debt list).

### D3.2 — passwordHash as a declared schema field

- **Decision:** Added `passwordHash: String` to the QrCode schema instead of the
  `strict:false` updateOne workaround; dashboard exposes only `hasPassword: boolean`.
- **Reason:** Declared fields persist through normal `set()`/`save()` and are type-safe;
  the hash never leaves the server (DTOs strip it).

### D3.3 — Auth.js v5 with MongoDBAdapter, JWT sessions

- **Decision:** MongoDBAdapter persists users/verification tokens; sessions are JWT
  (server-side session revocation is not possible — account deletion signs the client out).
- **Reason:** Standard Auth.js v5 pattern; documented in the dashboard settings caveat.

### D3.4 — In-memory rate limit fallback is a real implementation

- **Decision:** When Upstash is unconfigured, rate limiting uses a real in-memory fixed-window
  bucket, not a no-op.
- **Reason:** Spec forbids mock-as-default; single-instance fallback still protects the origin.

### D3.5 — Safe Browsing degraded path returns 'unavailable', not 'clean'

- **Decision:** Without GOOGLE_SAFE_BROWSING_API_KEY the check returns 'unavailable' and the
  link is created with moderation.status='pending' + a shortener warning where applicable.
- **Reason:** Never claim a check passed that never ran.

### D3.6 — localStorage onboarding seed in e2e (carried from Phase 2)

- Unchanged: onboarding tour modal blocks input; tests seed `qr-onboarded`.

### D3.7 — Removed the root loading.tsx (redirect vs streaming conflict)

- **Decision:** Deleted `src/app/loading.tsx`. A root loading file wraps every route in a
  Suspense/streaming context, which degrades ALL `redirect()` calls (dashboard auth gate,
  login signed-in redirect, unlock page) from real 307s into `200` + meta-refresh with a ~1s
  delay. Verified with curl: without it, `/dashboard` → `307 /login`; with it, `200` +
  `<meta http-equiv="refresh" content="1;url=/login"/>`.
- **Reason:** Correct auth gating (immediate 307, no content flash) outweighs global loading
  skeletons. Route-level `loading.tsx` files may be added later, but never on redirect-gated
  routes.

## Phase 4

### D4.1 — Deleted QR codes: hard delete + helpful 404 (no true 410)

- **Decision:** The API hard-deletes QR documents, so "deleted" and "never existed" are
  indistinguishable — both render the helpful 404 page. No soft-delete, no middleware 410.
- **Reason:** App Router pages cannot emit a 410 status without middleware; adding a
  DB-touching middleware (or soft-delete filtering across dashboard/API//r//q/) for a
  marginal SEO distinction (Google treats 404 and 410 nearly identically for removal)
  was not worth the complexity. The not-found page is helpful per spec.

### D4.2 — Indexing rule for /q/ pages

- **Decision:** `qrPageEligibility()`: indexable only when public + moderation passed +
  unique owner title (≥8 chars, not generic). Ads additionally require "substantive"
  (description ≥40 chars or 10+ scans). Sitemap mirrors the rule.
- **Reason:** Direct implementation of the spec's "indexing only when public + moderated +
  unique title/description" and "ads only on public+moderated+substantive pages".

### D4.3 — OG image renders the real QR server-side

- **Decision:** `opengraph-image.tsx` (nodejs runtime) generates the QR PNG with the
  `qrcode` package and embeds it in the ImageResponse.
- **Reason:** Real QR in social previews; graceful brand-art fallback when DB/unconfigured.

## Phase 5

### D5.1 — One phase-5 commit, not per-batch content commits

- **Decision:** All Phase 5 content work ships in the single `phase-5` commit, not in
  `content: <family> batch N` commits.
- **Reason:** Standing constraint (one local commit per phase; pushes happen phase-by-phase
  at the very end) overrides the spec's per-batch commit convention, which assumed
  per-batch pushing. The ordered push plan still shows phase-5 as one unit.

### D5.2 — Quality gate applies to the legacy blog; failing pages noindexed

- **Decision:** `scripts/content-audit.ts` enforces the §7.4 minima (≥400 words, 3–6 unique
  FAQs, ≥5 working internal links, byline, last-reviewed) on the legacy blog as well as
  the new typed families. Result: 0/581 blog pages pass → all noindex + sitemap-excluded
  until remediated (backlog in docs/CONTENT_AUDIT.md). 25 duplicate slugs fail closed.
- **Reason:** Standing constraint 11 is unconditional ("Failing pages → noindex"). 299
  articles are under 150 words — textbook thin content that risks domain-wide quality
  penalties. Noindexing protects the domain; pages are restorable once remediated.
  Remediation (expand + interlink) is the documented follow-up, not silent deletion.

### D5.3 — Audit is page-gating, not build-failing (except corrupt data)

- **Decision:** `prebuild` runs the audit. Schema violations / duplicate slugs in typed
  families exit 1 (build-blocking). Per-page quality failures exit 0 but write the
  manifest that drives noindex + sitemap exclusion.
- **Reason:** A single thin page must never block a deploy; corrupt data must never ship.

## Phase 6

### D6.1 — QR lib stays in the main chunk (perf tradeoff)

- **Decision:** The `qrcode` package remains statically imported (home generator is
  above-the-fold; lazy-loading would delay first render). jsQR/jszip/jspdf are
  route-split or dynamic-imported — they only load on the routes that use them.
- **Reason:** Measured tradeoff; per-route code splitting already isolates heavy libs.

### D6.2 — Only one redirect justified (/home → /)

- **Decision:** Added a single permanent redirect (/home → /). /view exists as a real
  page, so no redirect was added for it.
- **Reason:** No invented redirects; each entry justified from the repo.

### D7.1 — Legacy public/ads.txt removed (shadowed the env route)

- **Decision:** Moved the hardcoded `public/ads.txt` (pub-4860681021797211, non-standard
  relationship ID) to recoverable trash; the new `src/app/ads.txt/route.ts` now serves
  the file from `ADSENSE_PUBLISHER_ID`.
- **Reason:** In Next.js a static public/ file shadows an app route; keeping it would
  serve a stale hardcoded publisher ID forever. Recoverable via trash.

### D7.2 — Certified CMP deferred to EEA config

- **Decision:** Kept the custom Consent Mode v2 banner; documented in docs/ADSENSE.md that
  a Google-certified CMP is required for EEA personalized ads, with the integration point
  (qrs_cookie_consent / qrs:consent-changed) ready.
- **Reason:** A certified CMP needs an owner account and vendor contract; no mock CMP.

### D8.1 — next-intl middleware REMOVED (broke 200+ routes)

- **Decision:** Deleted `src/middleware.ts`. The `[locale]` routes are self-sufficient
  via `setRequestLocale` + `hasLocale` in the locale layout; next-intl v4's middleware
  rewrites every non-prefixed path to `/en/...` internally, which 404'd all pages not
  duplicated under `[locale]`.
- **Reason:** Verified by reading next-intl's middleware source + live curl tests.
  Accept-Language auto-redirect is deferred (hreflang covers SEO).

### D8.2 — Locale routes scoped to home + 4 top tools

- **Decision:** Only `/`, `/wifi`, `/vcard`, `/url`, `/text` have `[locale]` variants.
- **Reason:** Spec explicitly excludes machine-translating the 1,000 pages.

### D8.3 — Raast QR builder omitted (unverifiable)

- **Decision:** No Raast builder — SBP delegates field-level MAI format to the scheme
  operator (unpublished) and the annex example contradicts the normative ID table.
- **Reason:** Building from contradictory sources would be fabrication. Documented in
  `src/data/regional-payment-specs.ts` with `supported: false`.
