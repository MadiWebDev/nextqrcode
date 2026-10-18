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
