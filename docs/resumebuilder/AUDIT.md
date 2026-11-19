# Resume Builder — Repository & Live-Site Audit (Phase 0/1)

Audit date: 2026-11-19. Auditor: build coordinator, from the working tree at
`~/workspace/invoice-platform/build` (base: main `6328231f`) plus a live fetch of
the target host. Every claim below was read from code or observed live, not assumed.

## 1. Framework and routing

- **Next.js 16.3.8**, App Router, React 19.2.8, TypeScript strict, Tailwind v4.
- Host routing lives in **`src/proxy.ts`** (Next 16 proxy convention, formerly
  middleware). It matches on the `Host` header against constants
  (`INVOICE_SITE_HOST`, `IMAGE_RESIZER_SITE_HOST`, `SOCIALCALENDAR_SITE_HOST`)
  and rewrites each subdomain into its route tree (`src/app/<name>-site/`),
  with a static-asset guard (extensioned paths are never rewritten) and a CSP
  header set on every response.
- **CSP hard rule:** no nonce may ever be added — all pages are statically
  prerendered, and a nonce makes browsers ignore `'unsafe-inline'`, which
  kills hydration site-wide (this once broke the invoice site completely).
- The root layout (`src/app/layout.tsx`) renders the main site's
  `AppHeader`/`AppFooter` around every page; each subdomain site hides them
  with a `:has(> main .<site>-root)` rule in `src/app/globals.css` and ships
  its own chrome. The resume site follows the identical pattern
  (`.resumebuilder-site-root` rule added in Phase 1).
- **Service-worker trap (known, fixed 2026-11-18):** the root layout's
  `ServiceWorkerRegister` registers the main site's `/sw.js` on every host
  except `socialcalendar.freeqrcode.tools`. On the resume host the main
  worker would precache `/` of the resume origin. The resume app ships its
  own worker in Phase 7; the skip list is extended in that same phase and
  the resume update prompt is bound to its own script URL (the exact
  failure mode that looped the Social Calendar prompt).

## 2. What already exists for "resume"

- **No resume builder exists.** The only resume-related surface is a
  main-site tool page, `/resume-qr-code-generator` (a QR generator variant),
  plus mentions in the tools index. There is no editor, no resume data
  model, no saved-resume storage anywhere in the repo. Nothing to migrate;
  no public resume-builder URLs to preserve beyond that one tool page,
  which stays untouched on the main host.
- The target host **resumebuilder.freeqrcode.tools is attached** (DNS +
  Vercel) and returns 200 — but until Phase 1 it served the **main site's
  home page**, because no proxy rule existed for it. Phase 1 adds the rule.

## 3. Reusable infrastructure (verified present)

| Need | Existing asset | Notes |
| --- | --- | --- |
| IndexedDB | `dexie` 4.4.7 (Social Calendar) | Reuse for the resume store |
| Schema validation | `zod` 3.25 | Resume schema + import validation |
| QR generation | `qrcode` 1.5.4 (+ `@types/qrcode`) | Used across the main site |
| QR decode (self-test) | `jsqr` 1.4.0 | Present (image resizer) |
| PDF (existing approach) | `jspdf` 4.2.1, hand-rolled layout in `src/app/invoice-site/_lib/pdf.ts` | Invoice PDFs are drawn programmatically; the resume PDF spike (§10 of the spec) still compares print-CSS vs a layout engine in Phase 5 |
| PDF reading (import) | `pdfjs-dist` 4.10.38 | For resume import extraction |
| ZIP | `jszip` 3.10.1 | Backups / all-formats export |
| Drag & drop | `@dnd-kit/*` | Section/entry reordering with keyboard support |
| Ads | `src/components/AdSlot.tsx` (+ `src/components/ads/*`) | Landing/content only, never in the editor |
| JSON-LD | `src/lib/seo/jsonld.tsx` (`JsonLd`, breadcrumbs, WebPage) | Reuse for all resume pages |
| Date handling | `date-fns` 4.4 | Date formatting |
| Natural-language dates | `chrono-node` | Not needed for resumes; ignored |
| Auth / DB | `next-auth` 5 beta + MongoDB adapter exist for the main platform | The resume product is local-first; per spec §5, with no resume account product defined, Phase 2 ships a `SyncAdapter` interface only and transmits nothing |
| UI kit | Radix UI primitives + `src/components/ui/*`, `lucide-react` icons | Reuse |

**Missing dependencies the spec requires** (added in the phases that need
them, each logged in DECISIONS.md): `docx` (genuine DOCX export, Phase 5),
`libphonenumber-js` (phone formatting, Phase 3), `mammoth` (DOCX import,
Phase 7).

## 4. SEO infrastructure

- Sitemaps: `generateSitemaps()` in `src/app/sitemap.ts`, numeric ids 0–10,
  plus a **hand-maintained static index** at `public/sitemap.xml` — both
  must change together. Resume host = **new id 11** (Phase 1, landing only;
  later URLs appended by the SEO phase as pages pass the quality gate).
- An indexing policy (`src/lib/seo/indexing-policy.ts`, from the SEO
  recovery program) filters REMOVE-classified URLs out of sitemaps.
- `robots.ts` is a **single deployment-wide route**; the proxy matcher
  excludes `robots.txt`, so per-host robots.txt is not achievable without
  restructuring shared infra. Precedent (Social Calendar) accepted the
  shared robots.txt, which points at the shared sitemap index that
  includes every host's section. Deviation logged as D-RB-05.
- Indexing context: the freeqrcode.tools estate is under an **indexing
  freeze** (856-URL not-indexed backlog from an October mass dump). This
  drives reconciliation D-RB-01: the full programmatic-SEO machinery is
  built, but only a starter set of pages ships.

## 5. Testing and build tooling

- Vitest (jsdom) — `src/**/*.{test,spec}.{ts,tsx}`; 512 tests green at base.
- Playwright (`e2e/`, chromium + mobile projects, `@axe-core/playwright`
  available) against a locally built+started server.
- Gates available as npm scripts: `typecheck`, `lint`, `test:run`,
  `test:e2e`, `build`, `content:audit`.
- The production build is slow on this VM (~8–10 min); phases that touch
  runtime code run it, docs-only changes do not need it.

## 6. Live-site baseline (2026-11-19)

- `https://resumebuilder.freeqrcode.tools/` → 200, serving the **main
  site's QR-generator home page** (title "Free QR Code Generator — No
  Sign-Up…"). No resume content, no resume sitemap section, no indexing
  presence as a resume product. Lighthouse baseline for the *resume*
  product is therefore not meaningful until Phase 1 deploys; performance
  is measured on the shipped product in Phase 9 and reported honestly.
- After Phase 1 deploys, the same URL serves the Resume Builder landing
  from `src/app/resumebuilder-site/`.

## 7. Gap analysis against the spec

| Spec area | State | Gap closed in |
| --- | --- | --- |
| Host separation (§4) | Missing entirely | Phase 1 (proxy, shell, sitemap 11, host tests) |
| Data model + local store (§5) | Nothing exists | Phase 2 (schema, Dexie, snapshots, encrypted backup, SyncAdapter interface) |
| Editor (§6) | Nothing exists | Phase 3 (split view, guided + advanced, sections, regional modes, undo/redo) |
| Template engine (§7) | Nothing exists | Phase 4 (engine + first 12), Phase 6 (to 47 + gallery/customisation) |
| Photo (§8) | Nothing exists (image-resizer crop code is a different product surface; not reusable as-is) | Phase 4 (cropper in the resume app) |
| QR on resume (§9) | QR engine exists; no resume integration | Phase 7 |
| Exports (§10) | Invoice-only jsPDF code | Phase 5 (spike, PDF + DOCX + other formats) |
| Writing/ATS tools (§11) | Nothing exists | Phase 7 |
| Extra tools (§12) | Nothing exists | Phase 7 (cover letter, tracker, importers, share link, PWA) |
| SEO pages (§13) | Landing only after Phase 1 | Phase 8 (starter set per D-RB-01) |
| QA/perf/a11y/security (§14) | Repo-level tooling exists | Phase 9 |
| Docs (§15 Phase 10) | This file is the start | Phase 10 |

## 8. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R-1 | Shared working tree: other agents/user push to main while this program builds on a branch | Medium | Merge conflicts in proxy.ts/sitemap.ts/globals.css | Re-verify remote head before every phase staging; keep shared-file edits minimal and additive |
| R-2 | Service-worker scope fight on the resume host (the 2026-11-18 loop) | Medium if unhandled | Update prompt loops; stale shells | Phase 7 extends the register skip + binds the prompt to the resume worker URL; e2e offline test |
| R-3 | PDF parity: browser print vs layout engine divergence, esp. RTL/complex scripts | Medium | Wrong-looking or unparseable PDFs | Time-boxed spike in Phase 5 with text-extraction acceptance tests before committing |
| R-4 | IndexedDB blocked/quota in private mode | Medium | Data loss complaints | Storage-health check, visible save status, one-click JSON backup fallback (Phase 2) |
| R-5 | Template breadth (47) vs quality bar | High | Thin/overflowing templates | Data-driven engine; uniqueness + layout-matrix tests gate every template; breadth is the designated cut lever |
| R-6 | Programmatic SEO volume vs indexing freeze | Certain if ignored | Worse indexing backlog | D-RB-01 starter-set reconciliation + automated quality gate |
| R-7 | Bundle size: PDF/DOCX/pdf.js/mammoth in the editor route | Medium | Slow editor on mid-range phones | Mandatory dynamic imports; bundle measured per phase |
| R-8 | Photo privacy expectations | Low | Trust damage | Photo never leaves the device; EXIF stripped on import; stated in UI and privacy copy |
