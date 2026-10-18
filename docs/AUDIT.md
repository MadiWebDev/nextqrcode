# NextQRCode — Phase 0 Audit

**Date:** 2026-10-19 · **Auditor:** autonomous build coordinator · **Commit baseline:** `55ddb89` ("adding 25 more batches")
**Stack:** Next.js 16.3.8 (App Router) · React 19.2.8 · TypeScript 5 (strict) · Tailwind CSS v4 (CSS-first) · ESLint 9 + eslint-config-next

> Note per repo `AGENTS.md`: this is a newer Next.js than training data covers. Relevant guides were read in
> `node_modules/next/dist/docs/01-app/` before writing new code (routing, metadata, sitemap/robots, JSON-LD, i18n, CSP).

---

## 1. Architecture map

```
src/
  app/                        # App Router — ~40 static routes + 3 dynamic + 3 API routes
    page.tsx                  # Home: full QR generator (client component, 704 lines)
    layout.tsx                # Root layout: ThemeProvider, header/footer, GA, AdSense, CookieConsent
    globals.css               # Tailwind v4 tokens (oklch), dark variant
    sitemap.ts / robots.ts    # Single sitemap (manual path lists), minimal robots
    api/upload/route.ts       # Cloudinary upload (unauthenticated)
    api/cards/[slug]|route.ts # Digital-card CRUD (Mongo or in-memory fallback)
    <tool>/page.tsx ×17       # Standalone tools (size calc, safety checker, UTM builder, …)
    qr-labels/[slug], whatsapp-qr/[slug], payment-qr/[slug], card/[slug], blog/[slug]
    view/page.tsx             # Media viewer for audio/video/image QR payloads
  components/
    ui/                       # 53 shadcn-style Radix primitives (button, dialog, …)
    HomeGenerator.tsx         # Main generator: type select + dynamic form + preview + export
    LandingGenerator.tsx, QRPreview.tsx, CustomizationPanel.tsx, ExportPanel.tsx,
    DynamicForm.tsx, TemplateSelector.tsx, WifiDetector.tsx, MediaUploader.tsx,
    DigitalCardBuilder.tsx, OnboardingTour.tsx, CookieConsent.tsx,
    GoogleAdSense.tsx, GoogleAnalytics.tsx, AdSlot.tsx, AppHeader/Footer, Breadcrumbs
  hooks/                      # useQRGenerator, useLocalStorage, useDebounce, use-mobile
  lib/
    qr-helpers.ts             # 40 QR type configs + generateQRData() payload builder
    canvas-qr.ts              # Canvas rendering (styled QR)
    quality-gate.ts           # Page quality gate (types + rules — NOT wired into build)
    pages/Batch1..69.ts       # 586 blog articles (Article records)
    articles.ts               # Article interface + aggregation
    mongodb.ts / cloudinary.ts# Raw MongoClient (cached), Cloudinary uploader
    gtag.ts, templates.ts, defaults.ts, utils.ts
  data/                       # payments.ts, countries.ts, devices.ts, industries.ts,
                              # size-guides.ts, labels.ts, glossary.ts, templates-gallery.ts,
                              # page-registry.ts (page inventory + link graph — advisory only)
  types/                      # index.ts (QRType union, 40 types), card.ts
```

**Rendering:** all content pages are static-capable server components; 16 routes are client components
(home generator, tools). No `getServerSideProps`/`getStaticProps` (App Router). No middleware.

---

## 2. QR types inventory (40) — `qrTypeConfigs` / `generateQRData()`

text, url, pdf, audio, whatsapp, phone, sms, email, address, wifi, vcard, social, video, image,
menu, app, coupon, event, business_card, freelance, ecommerce, cleaning, logistics, finance, cv,
mecard, geo, telegram, zoom, google_meet, teams, youtube, linkedin, spotify, paypal, upi, bitcoin,
ethereum, sepa, google_review

### Payload-builder correctness issues (fix in Phase 2, each gets a unit test)

| Type                      | Issue                                                                                                                                                                             | Severity |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `sepa` (EPC QR)           | Template literal uses `\\n` → encodes literal backslash-n, not LF. EPC069-12 requires real line feeds. **Broken payload.**                                                        | P0       |
| `vcard` / `business_card` | Emits `MECARD:` only — no RFC 2426/6350 vCard with line folding, escaping, or `N:`/`FN:` split. `business_card` is plain text.                                                    | P1       |
| `event`                   | Emits Google Calendar template URL, not RFC 5545 `VEVENT` ICS. Not scannable into native calendars.                                                                               | P1       |
| `ethereum`                | `?value=<ETH>` — EIP-681 `value` is in **wei**. Wrong unit.                                                                                                                       | P1       |
| `wifi`                    | Escaping covers `\ ; : " ,` ✓. Trailing `;;` (hiddenTag adds `;` then template adds `;`) — harmless but non-canonical. `T:nopass` handling ✓.                                     | P2       |
| `upi`                     | `am` not URL-encoded; `cu=INR` default ✓ per NPCI spec.                                                                                                                           | P2       |
| `bitcoin`                 | BIP-21 shape ✓ (`amount`/`label`/`message` encoded).                                                                                                                              | OK       |
| `audio/video/image`       | Encodes `/view?type=…&url=…` link on site domain — QR is only useful while the media stays hosted; hardcodes `https://freeqrcode.tools` fallback (brand/domain mismatch, see §6). | P2       |
| `app` (`both`)            | Plain-text two-line payload, not a smart link. Phase 2 should offer a hosted smart-link page.                                                                                     | P2       |

**No unit tests exist for any payload builder.** `jsQR` is a dependency but nothing decodes in-browser yet —
no scan-ability round-trip exists.

---

## 3. Data layer

- `lib/mongodb.ts`: cached `MongoClient` (dev-global pattern ✓ serverless-safe), DB `qrcode-tools`.
  Only used by cards API. **Not Mongoose** (spec wants Mongoose models + indexes) — Phase 3.
- `lib/cloudinary.ts`: basic `upload_stream` wrapper. Signed uploads not enforced server-side;
  `api/upload` accepts any file the client sends (no size cap, no allowlist, **no auth**, **no rate limit**).
- **Auth:** none. No Auth.js/NextAuth. Guests-only today.
- **Dynamic QR / `/r/` / `/q/`:** do not exist. Cards (`/card/[slug]`) are the only persisted entity.

---

## 4. Content system (as found)

- 586 articles in `src/lib/pages/Batch1..69.ts` (helper `art()`), surfaced via `/blog` + `/blog/[slug]`.
- Data-driven pages exist for: payments (PaymentScheme), whatsapp countries, labels, glossary, industries,
  devices, size-guides, templates-gallery — but most are **not routed** (sitemap.ts lists only
  labels/whatsapp-qr/payment-qr/blog sections; industries/devices/sizes/glossary/templates/compare/howto
  routes do not exist yet).
- `lib/quality-gate.ts` and `data/page-registry.ts` define a gate + link graph, but **nothing enforces it**:
  no `content:audit` script, no build integration, no noindex fallback, no sitemap filtering.
- **Byline:** articles credit `Codexengr, QR Systems Engineer`. The repo's own prior plan
  (`.agents/tasks/phase0-plan.md`) establishes `codexengr` as the site operator identity
  ("QR Studio by codexengr", footer, contact addresses). Decision D0.6 keeps `codexengr` as the
  site-team byline rather than inventing a new persona — it is the established operator handle,
  not a fabricated third party.
- **Unverified factual claims** found in `src/data/payments.ts` (examples): Swiss QR-bill called "mandatory"
  under SIX rules; Pix "processing over 3 billion monthly transactions". Per project rules these must be
  verified against primary sources with "Last reviewed" + sources, or removed. Full verification pass in Phase 8.

---

## 5. SEO / metadata (as found)

- `sitemap.ts`: single sitemap, hand-maintained path lists; comment block admits future sections are
  placeholders. No `generateSitemaps` chunking, no quality-gate filtering.
- `robots.ts`: minimal (need to verify disallow of `/api/`, `/r/` once they exist).
- Per-page `generateMetadata` on main pages; JSON-LD present on ~10 pages (about, contact, blog, …).
  Breadcrumbs component emits JSON-LD ✓. No `SoftwareApplication`/`FAQPage`/`DefinedTerm` yet, no validation.
- No `hreflang`, no locale routes, no OG image generation (`opengraph-image.tsx` absent).
- No `next/font` usage — font loading unoptimized.
- Brand/domain inconsistency: metadata says "QR Code Tools" / `https://freeqrcode.tools`, repo + Vercel
  are `nextqrcode`. Resolved in Phase 1 via `config/site.ts`.

---

## 6. Ads & consent (as found)

- `GoogleAdSense` injects the AdSense script globally in `<head>` whenever
  `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set — including on tool pages and (future) `/r/` redirects.
- `AdSlot` renders a visible dashed placeholder box in test mode (spec: render nothing when ineligible),
  has **no consent gating**, no page-eligibility gating, no lazy loading.
- `GoogleAnalytics` has Consent Mode v2 scaffolding reading `qrs_cookie_consent` from localStorage ✓,
  but `CookieConsent` UX/wording needs a legal review pass in Phase 7.
- No `ads.txt`.

---

## 7. Security issues (fix in Phase 3/9)

1. `api/upload`: unauthenticated, no rate limit, no file-size cap, no MIME allowlist, no SVG sanitization
   → stored-XSS vector if SVG served from Cloudinary; abuse vector for free file hosting.
2. `api/cards`: no auth/ownership — anyone can create/read/update cards; 5-char random slug suffix is
   guessable; in-memory fallback leaks across requests on a single instance; no rate limiting.
3. `next.config.ts` is empty — **no security headers** (CSP, HSTS, X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy).
4. `view/page.tsx` renders arbitrary `url` query param in media player — validate allowlist/scheme
   (currently any https URL; check for `javascript:` handling).
5. No dependency audit baseline yet (`npm audit` in Phase 9).
6. Secrets: none committed (`.env*` ignored ✓). No `.env.example` yet — added Phase 0.

---

## 8. Accessibility & performance (as found)

- Skip link ✓, Radix primitives (focus management ✓), `next-themes` dark mode, ThemeToggle.
- No axe tests, no Lighthouse CI, no Core Web Vitals measurement. **Lighthouse baseline:
  UNVERIFIED** — no headless Chrome in this sandbox; will attempt in Phase 9, else document.
- 16 client-component pages; heavy deps (`framer-motion`, `recharts`, `qrcode`) — code-splitting
  opportunities. Bundle baseline: measured from `npm run build` output in Phase 0 (see §10).
- `tw-animate-css` + framer-motion both present — pick one motion system in Phase 1.

---

## 9. Tooling / hygiene (fixed in Phase 0)

- **Deleted:** `build-output.txt`, `tsc_err.txt`, `tsc_out.txt`, `tsc_output.txt` (committed log dumps).
- `.gitignore` extended: log dumps, lighthouse artifacts, playwright reports, content-draft/.
- README was create-next-app boilerplate → rewritten (Phase 0).
- Lint baseline: **53 errors / 86 warnings** (all errors fixed in Phase 0; warnings triaged).
  Error classes: `set-state-in-effect` (React 19 hooks rules), `no-html-link-for-pages`, `no-unescaped-entities`,
  `no-explicit-any`, impure-render, use-before-declare.
- `tsc --noEmit`: clean at baseline.
- Added: Prettier, Vitest + Testing Library, Playwright, Husky + lint-staged, GitHub Actions CI
  (lint → typecheck → unit → build → Playwright smoke).

---

## 10. Build & bundle baseline

- `npm run build` (Next.js 16.3.8): **PASS** (exit 0, ~71 s). 40 static routes + 5 SSG dynamic
  segments (`/blog/[slug]` ×581, `/payment-qr/[slug]`, `/qr-labels/[slug]`, `/whatsapp-qr/[slug]`)
  - 1 dynamic (`/card/[slug]`). Note: Next 16 does **not** run ESLint during `next build`,
    so the 53 lint errors did not block the build.
- Bundle: `.next/static` = **2.5 MB** total; largest shared chunks 224 KB / 172 KB / 160 KB /
  128 KB / 112 KB. Home page is a heavy client component (generator + all deps in one chunk).
  Target budgets — home/generator ≤ 250 kB First Load JS, content pages ≤ 150 kB (Phase 9
  Lighthouse CI enforces CWV; route-level splitting in Phase 2).

---

## 11. Tech-debt register (carried into phases)

- [ ] `useQRGenerator` (400+ lines?) and `HomeGenerator` are oversized — split in Phase 1/2.
- [ ] framer-motion vs tw-animate-css duplication.
- [ ] `memoryCards` in-memory fallback in cards API — remove when Auth+Mongoose land (Phase 3).
- [ ] Hardcoded `https://freeqrcode.tools` fallbacks (qr-helpers, layout) → `config/site.ts`.
- [ ] `art()` helper dates: batches dated 2026-07 → updated 2026-10-05; "Last reviewed" semantics
      need a real review pass before publish waves (Phase 5).
- [ ] `page-registry.ts` link graph is advisory; Phase 5 wires real internal-link auditing.
