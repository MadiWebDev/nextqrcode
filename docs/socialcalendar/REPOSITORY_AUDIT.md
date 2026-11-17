# Repository Audit — Social Media Calendar (Phase 1)

Audited 2026-11-17 against the working tree of MadiWebDev/nextqrcode.
Remote main head at audit time: `532177e7`. The tree additionally contains the
unmerged `seo/step5-indexing-controls` changes (indexing policy, proxy 410s);
all Social Calendar changes to shared files are strictly additive.

## 1. Next.js version and App Router architecture
Next.js **16.3.8**, App Router throughout (`src/app/`), TypeScript strict,
Tailwind CSS v4 (PostCSS), React Server Components by default with client
islands. Route groups are not used; each tool is a top-level route folder.
Per `AGENTS.md`, this Next version has breaking changes vs. common training
data — framework guides live in `node_modules/next/dist/docs/` and were
consulted for sitemap/manifest/proxy conventions.

## 2. Host-based middleware and domain detection
`src/proxy.ts` (Next 16 proxy convention, exports `proxy` + `middleware`
alias). Host is read from the `host` header, lower-cased, port stripped.
Two subdomain sites exist:
- `invoicegenerator.freeqrcode.tools` → rewrites to `/invoice-site/*`
  (except invoice-family tool paths served under their own paths).
- `imageresizer.freeqrcode.tools` → rewrites to `/imageresizer-site/*`.
Static-asset paths (with a file extension) are exempt from rewriting.
The proxy also sets the site CSP and (Step 5) the www→apex 308 and the
indexing-policy 410s on the apex host. **The CSP deliberately has no nonce**
— a nonce previously disabled hydration on every statically prerendered
page. This must never be reintroduced.

## 3. Existing subdomain / tool registry
There is no central code registry file; a subdomain site is "registered" by
the combination of: (a) a host constant + rewrite block in `src/proxy.ts`,
(b) a route tree under `src/app/<name>-site/`, (c) a `:has()` chrome-hiding
rule in `src/app/globals.css`, (d) a sitemap section id in
`src/app/sitemap.ts` + an entry in the hand-maintained `public/sitemap.xml`,
(e) a logo SVG in `public/`, (f) cross-links in `src/components/AppHeader.tsx`.
Social Calendar follows exactly this combination (minus AppHeader, see
DECISIONS D-SC-09).

## 4. Shared layouts and navigation
The root layout (`src/app/layout.tsx`) renders AppHeader/AppFooter around
`<main>` for every route, plus ThemeProvider (next-themes), Toaster (sonner),
TooltipProvider, consent and analytics components. Subdomain sites render
their own header/footer inside a `.<site>-root` wrapper and the main chrome
is hidden via `div:has(> main .<site>-root) > header/footer { display:none }`
in globals.css. Social Calendar reuses this mechanism with
`.socialcalendar-site-root`.

## 5. AdsSlots and advertisement configuration
Canonical component: `src/components/ads/AdSlot.tsx` (consent-gated,
lazy-loaded; legacy wrapper at `src/components/AdSlot.tsx`). AdSense client
is env-driven (`NEXT_PUBLIC_ADSENSE_CLIENT`); empty = nothing renders.
Social Calendar reuses AdSlot on landing/content pages only — never in the
workspace, editors, dialogs, share viewer or print (spec §27).

## 6. Existing UI components and design tokens
Full shadcn/ui kit in `src/components/ui/` (Radix primitives: dialog, sheet,
drawer (vaul), command (cmdk), resizable panels, tabs, select, popover,
calendar (react-day-picker), chart (recharts), sonner toasts, etc.).
Design tokens are Tailwind v4 CSS variables in globals.css with next-themes
light/dark. Lucide icons. Framer Motion available. **Reuse decision:** the
workspace is built from these primitives; no new UI kit is introduced.

## 7. Authentication and sign-in flow
NextAuth (`next-auth` + `@auth/mongodb-adapter`) with routes
`src/app/api/auth/[...nextauth]/route.ts`, `src/lib/auth.ts`, account API at
`src/app/api/account/`. Auth exists and is Mongo-backed, but it was designed
for QR-code accounts, has no per-user document store suitable for calendar
sync, and wiring calendar content into it would transmit user content to a
server the product promises to keep local. **Decision (D-SC-03): account
sync is NOT implemented; a typed `SyncAdapter` interface is provided
instead** (spec §6 explicitly allows this fallback).

## 8. Database, ORM and existing data models
MongoDB via `mongodb` driver + `mongoose` (`src/lib/mongodb.ts`,
`src/lib/db/mongoose.ts`), used for blog content, QR codes, cards, accounts.
The calendar is local-first by spec: **Dexie/IndexedDB in the browser** is
the product database. No server DB changes are made.

## 9. API routes and server actions
API routes are QR/account/upload focused (`/api/qrcodes`, `/api/cards`,
`/api/account`, `/api/upload(s)`, `/api/reports`, `/api/auth`). The Social
Calendar needs **no new API routes** — all functionality is client-local;
exports/imports/sharing are computed in the browser.

## 10. Environment variables and configuration
Central config: `src/config/site.ts` (brand, canonical URL, feature flags,
AdSense slots). Env is `NEXT_PUBLIC_*`-driven. Social Calendar needs **no
new environment variables** (documented in DEPLOYMENT notes, Phase 10).

## 11. Analytics and consent management
GoogleAnalytics + ConsentScripts + CookieConsent components in the root
layout; analytics never receives user content (spec §30) — the calendar
emits no analytics events containing captions/notes.

## 12. Security headers and CSP
Security headers in `next.config.ts` `headers()`; CSP is set per-response
in the proxy (see §2). Social Calendar adds no CSP changes and no new
external origins: fonts, scripts and data all stay same-origin or blob/data
URLs already allowed (`img-src` includes `data:` and `blob:`).

## 13. SEO metadata, sitemap and robots
`generateSitemaps()` in `src/app/sitemap.ts` declares ids 0–9; the index is
the static `public/sitemap.xml` and **must be kept in sync manually**.
Id 8 = invoice host, id 9 = imageresizer host (absolute URLs). Social
Calendar takes **id 10**. Robots: `src/app/robots.ts` (apex; the proxy
matcher excludes robots.txt, so subdomain hosts serve the same file —
parity with the sibling sites; per-page robots metadata provides the
host-specific control, e.g. the share viewer's noindex).

## 14. Existing PWA and service-worker implementation
`public/sw.js` is a static shell SW for the main site, registered globally
by `src/components/ServiceWorkerRegister.tsx` at scope `/`. The main
manifest is `src/app/manifest.ts` → `/manifest.webmanifest`. Social
Calendar ships its own manifest + service worker served from
app-scoped route handlers (`/socialcalendar-manifest.webmanifest`,
`/social-sw.js`, rewritten by the proxy on its host) so the main site's
SW behaviour is untouched (see ARCHITECTURE §PWA).

## 15. Testing framework and CI/CD
Vitest (jsdom, globals) with include `src/**/*.{test,spec}.{ts,tsx}` and
`@` → `src` alias; Testing Library; Playwright e2e in `e2e/` (per-site
specs exist: imageresizer.spec.ts, invoice-workspace.spec.ts, a11y.spec.ts
with @axe-core/playwright); @vitest/coverage-v8; Lighthouse CI config
present. Build gate: `npm run build:vercel` = content audit + build.

## 16. Deployment configuration and Vercel compatibility
`vercel.json`: build command `npm run content:audit && npm run build`,
cache headers for static/sitemap. The user attaches the subdomain in the
Vercel dashboard + DNS (manual action, listed in the delivery report).
Everything in this product is static/client-side, so it is fully Vercel
compatible with no new serverless functions.

## 17. Shared utilities, hooks and conventions
`src/lib/utils.ts` (cn), `src/lib/seo/jsonld.tsx` (JsonLd component),
`src/lib/seo/indexing-policy.ts` (Step 5 — sitemap filtering),
date-fns for date math, zod for validation, jspdf + jszip already present
(used by exports), recharts for charts, cmdk for the command palette,
react-resizable-panels for panes, vaul drawers for bottom sheets.
**New dependencies (justified, permissive licences):** `dexie` (IndexedDB),
`@dnd-kit/core|sortable|utilities` (accessible drag-and-drop),
`chrono-node` (natural-language date parsing). Timezone handling uses the
native Intl API (ICU tz database) + date-fns — no tz library added.

## Reusable inventory (build on these, do not rebuild)
shadcn/ui kit (all), AdSlot, JsonLd, ThemeProvider/next-themes, sonner,
cmdk Command, vaul Drawer, react-resizable-panels, recharts, jspdf, jszip,
date-fns, zod, next-intl (existing i18n routing for the main site; the
calendar ships its own dictionary module instead — D-SC-07).
