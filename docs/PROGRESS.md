# Build Progress

Running log: what was done per phase, assumptions, known gaps. Updated at each phase commit.

---

## Phase 0 — Audit & cleanup ✅

**Done:**

- Full `src/` inventory → `docs/AUDIT.md`: architecture map, 40 QR types with payload-builder
  correctness table (SEPA `\\n` bug = P0, vCard→MECARD, event→GCal URL, ETH wei unit = P1),
  data-layer/security/SEO/ads/accessibility findings, build+bundle baseline.
- Deleted committed junk: `build-output.txt`, `tsc_err.txt`, `tsc_out.txt`, `tsc_output.txt`;
  `.gitignore` extended (log dumps, lighthouse artifacts, playwright reports, content drafts).
- Rewrote README (features, setup, env vars, scripts, architecture, contributing, content quality).
- Fixed all 53 ESLint errors (3 parallel agents: `set-state-in-effect` restructures,
  `<a>`→`<Link>`, entity escaping, `any`→precise types, impure-render moves).
- `tsc --noEmit`: clean (was already clean at baseline).
- `npm run build`: PASS (exit 0; 40 static routes, 581 SSG blog paths; `.next/static` 2.5 MB,
  largest chunk 224 KB).
- Tooling added: Prettier (+check/write scripts), Vitest 5 + Testing Library + jsdom
  (5/5 smoke tests pass), Playwright (Chromium installed; smoke suite), Husky v9 + lint-staged,
  GitHub Actions CI (prettier → eslint → tsc → vitest → build → playwright smoke on Chromium),
  `.env.example` (all Phase 10 variables documented).
- `docs/DECISIONS.md` started (D0.1–D0.5).

**Assumptions:**

- Bumped `@types/node` 20→24 to satisfy Vitest 5 peer deps (runtime is Node 24).
- Playwright e2e in CI installs Chromium via `npx playwright install --with-deps chromium`.

**Known gaps / UNVERIFIED:**

- Lighthouse baseline: no headless Chrome available in sandbox → UNVERIFIED, deferred to Phase 9
  (Lighthouse CI in GitHub Actions).
- Warnings: 86 ESLint warnings remain (mostly `react-hooks/exhaustive-deps`); triaged, not blocking.

## Phase 1 — Architecture & foundation ✅

**Done:**

- `src/config/site.ts`: brand, canonical URL, feature flags (`ads`, `accounts`, `dynamicQr`,
  `analytics`, `i18n`), AdSense slots, nav models (`primaryNav`, `footerNav`).
- Design system: Space Grotesk + Inter via `next/font`; brand accent tokens; visible
  `:focus-visible` rings; `prefers-reduced-motion` support; codified page typography
  (`.page-wrap/.page-h1/.page-h2/.page-h3/.page-prose` per repo style rules D0.7).
- Header mega-menu (Radix NavigationMenu, keyboard-accessible, 4 groups from config) +
  mobile menu; footer full link directory (4 columns from config, 34 links).
- `layout.tsx`: config-driven metadata, Organization + WebSite JSON-LD, viewport theme-color,
  consent-gated AdSense loader + ahrefs analytics (`ConsentScripts`), SW registration.
- Error boundaries: `error.tsx` (client), `global-error.tsx` (minimal shell), `not-found.tsx`
  (helpful links, noindex), `loading.tsx` (skeleton shell).
- PWA: `src/app/manifest.ts` → `/manifest.webmanifest`; `public/sw.js` offline shell
  (never caches `/api/*`, `/r/*`); old `public/manifest.json` removed.
- `robots.ts`: array-form rules, disallow `/api/ /r/ /dashboard/ /card/`, Mediapartners-Google
  allow, sitemap from config. Hardcoded domains centralized in infra files (D1.3).
- `src/lib/seo/jsonld.tsx`: sanitized JSON-LD helpers (`JsonLd`, `BreadcrumbJsonLd`).

**Final gate numbers:** `format:check` PASS · `lint` 0 errors (83 warnings) · `typecheck` clean ·
`vitest run` 5/5 · `playwright` 9/9 · `build` PASS (manifest + _not-found routes present).

**Assumptions:** brand "QR Studio" kept per repo convention; page-level canonical literals equal
the config default.

**Known gaps:** full AdSense placement/eligibility policy → Phase 7; accounts/dynamicQr/analytics
flags off until Phase 3.

## Phase 2 — QR engine upgrade ✅

**Done:**
- `src/lib/qr/payloads.ts`: spec-correct builders (WiFi, vCard 4.0 w/ folding+escaping, MeCard,
  ICS VEVENT, geo, BIP-21, EIP-681 wei, NPCI UPI, EPC/SEPA real newlines, SMS, mailto, tel:,
  wa.me, t.me) + Zod schemas + `PayloadError`. `generateQRData` delegates for wifi/vcard/event/
  ethereum/sepa/upi; all other types byte-identical.
- Fixed audit P0/P1s: SEPA literal `\n`, GCal-URL event, ETH-unit value, WiFi `;;`.
- `src/lib/qr/scanability.ts` + `ScanabilityPanel` (jsQR decode round-trip of the live canvas,
  0–100 score, warnings, print-size recommendation) integrated into HomeGenerator (mobile +
  desktop) and LandingGenerator.
- Design: quiet-zone control (0–10 modules, spec-minimum warning), foreground gradient option,
  real print-ready PDF export (jsPDF, A4, crop marks w/ 3mm bleed) — print dialog kept separate.
- `/qr-scanner`: camera + upload scanning with safe-link preview (shortener/non-https/punycode
  warnings, never auto-navigates). `/bulk-generator`: CSV → Web Worker → JSZip download (500-row
  limit, client-side only).
- Tests: 62 payload unit + 14 scanability + 41 all-type round-trip (Vitest) + 3 Playwright UI
  round-trips (url/wifi/vcard decode the rendered canvas in-browser).

**Final gate numbers:** `format:check` PASS · `lint` 0 errors (83 warnings) · `typecheck` clean ·
`vitest run` 122/122 · `playwright` 12/12 · `build` PASS (new routes present).

**Known gaps:** e2e needed onboarding-tour dismissal seeding (modal blocks input on first visit);
  template save-as-template needs accounts → Phase 3.
