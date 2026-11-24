# Cloudflare Migration — Phase 1 Audit

- **Date:** 2026-11-23
- **Tree:** `~/workspace/invoice-platform/build`, synced with GitHub `main` at `21caa86f`
- **Scope:** local audit + local implementation only. No production deployment, no DNS change, no paid resource, no external account change was made.

## 1. Stack inventory (inspected)

| Item | Finding | Source |
|---|---|---|
| Framework | Next.js **16.3.8**, React **19.2.8**, TypeScript strict | `package.json` |
| Package manager | **npm** (`package-lock.json` present, no other lockfile) | tree root |
| i18n | next-intl **^4.14.9** (installed 4.14.x), 14 locales (en, es, fr, de, pt, ar, ur, hi, id, tr, ru, ja, ko, zh), `localePrefix: 'as-needed'`, RTL for ar/ur | `src/i18n/routing.ts`, `src/i18n/request.ts` |
| Middleware equivalent | `src/proxy.ts` (Next 16 Proxy convention). **No `src/middleware.ts` exists.** | tree |
| Auth | Auth.js v5 (`next-auth ^5.0.0-beta.32`), Google provider + Nodemailer email provider, both env-gated; JWT sessions; MongoDB adapter only when Mongo configured | `src/lib/auth.ts` |
| Database | Mongoose ^9.11.2 + mongodb ^6.21.0, connection cached on `globalThis`, `bufferCommands: false`; app degrades gracefully when `MONGODB_URI` unset | `src/lib/db/mongoose.ts`, `.env.example` |
| Uploads/media | Cloudinary ^2.11.0 (signed upload routes) | `src/app/api/uploads/*` |
| Email | Nodemailer ^8.0.11 (Auth.js email provider, env-gated) | `src/lib/auth.ts` |
| Rate limiting | Upstash Redis REST when configured, in-memory fallback otherwise | `src/lib/security/rate-limit.ts` |
| Abuse checks | Google Safe Browsing API fetch (env-gated) | `src/lib/security/abuse.ts` |
| Vercel coupling | **No `@vercel/*` packages.** One Vercel-specific signal: `x-vercel-ip-country` header read in scan logging (`src/app/r/[publicId]/route.ts`) — patched to prefer Cloudflare's `CF-IPCountry` with the Vercel header as fallback. `vercel.json` exists (build command + static/sitemap cache headers); Cloudflare ignores it. | grep, `vercel.json` |
| Edge runtime | **No `export const runtime = "edge"` anywhere in `src/`** — important because the OpenNext Cloudflare adapter does not support the Edge runtime. | grep |
| Server Actions | None found (`"use server"` matched only prose in a content file). Forms post to route handlers / client-side logic. | grep |
| Crons / webhooks | No cron routes or webhook handlers found. | grep |

## 2. What `src/proxy.ts` does (must survive any migration)

The proxy is load-bearing. Any target architecture that cannot run it (or reproduce it exactly) is a blocker, not a detail:

1. **www → apex 308** redirect.
2. **Cross-host internal-tree redirects (301):** e.g. `resumebuilder.freeqrcode.tools/invoice-site/…` → the correct host with the tree prefix stripped.
3. **Subdomain rewrites:** `invoicegenerator.`, `imageresizer.`, `socialcalendar.`, `resumebuilder.` hosts are rewritten into `src/app/{invoice,imageresizer,socialcalendar,resumebuilder}-site/` route trees, with invoice tool-path exceptions (`/invoice-generator`, `/quote-generator`, `/receipt-generator`).
4. **410 Gone policy:** exact paths classified REMOVED by `src/lib/seo/indexing-policy.ts` (**87 URLs**) answer `410` with an HTML body, before routing. Apex host only in effect.
5. **CSP + response headers** on next/rewrite/gone responses (see §5).
6. Matcher excludes `api`, `_next`, `ads.txt`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `manifest.webmanifest`, and prefetch requests. Static files (by extension) are exempt from the routing rules.

## 3. Route inventory

Evidence base: the production `.next` build output in the tree — `prerender-manifest.json` (**2,182 prerendered routes**, 18 parameterized dynamic-route templates) and `routes-manifest.json` (326 static routes, 38 dynamic routes, redirects incl. trailing-slash 308 and `/home` → `/` 308), plus source inspection of every route handler.

### Class A — fully static (serve from CDN/assets, no Worker execution needed)

- ~2,182 prerendered routes: tool/generator landing pages, blog articles (1,591 routes under `/blog`), glossary (41), industries (41), scan-guide (31), templates (31), qr-size-guide (27), and the four sub-site trees (invoice 25, imageresizer 66, socialcalendar 15, resumebuilder 21 routes in the prerender manifest).
- Sitemap children (`generateSitemaps()` ids 0–11) + static index `public/sitemap.xml`.
- `ads.txt` route (the single route with `initialRevalidateSeconds = 3600`), `robots.txt`, `.well-known/security.txt` (`force-static`).
- Static files in `public/` (incl. `ads.txt` copy, service workers `sw.js` / `resume-sw.js`, manifests, logos).

### Class B — static shell + client interactivity (still no server execution per visit)

- QR generators/scanners: QR generation uses `qrcode`/`QRCode.toCanvas` and scanning uses `jsQR` — **in the browser**. Image-resizer tools process files on canvas in the browser. Invoice/resume/social-calendar apps persist to `localStorage`/IndexedDB (Dexie) in the browser.
- These pages are prerendered HTML + client JS; they are the bulk of the suite and the reason a static-first host fits.

### Class C — genuinely request-time (require a server runtime)

| Route | Why it is request-time |
|---|---|
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js handlers (env-gated providers) |
| `src/app/api/qrcodes/route.ts`, `api/qrcodes/[id]/route.ts`, `api/qrcodes/[id]/unlock/route.ts` | Mongo reads/writes, `node:crypto` password tokens |
| `src/app/api/cards/route.ts`, `api/cards/[slug]/route.ts` | Mongo-backed digital cards |
| `src/app/api/account/route.ts` (`force-dynamic`) | Account deletion |
| `src/app/api/reports/route.ts` | Abuse reports → Mongo + Safe Browsing |
| `src/app/api/upload/route.ts`, `api/uploads/route.ts`, `api/uploads/sign/route.ts` | Cloudinary signing/uploads |
| `src/app/r/[publicId]/route.ts` | Dynamic-QR redirect: DB lookup, paused/blocked/expired → 410, password gate → `/unlock/[publicId]`, moderation interstitial, scan-event logging, 307 redirect |
| `src/app/q/[publicId]/page.tsx` (`force-dynamic`) | DB-backed QR landing + OG image |
| `src/app/card/[slug]/page.tsx` | Mongo-backed card page |
| Dashboard (`src/app/dashboard/**`, `force-dynamic`) | Auth + per-user Mongo queries |
| `src/app/blog/page.tsx` (index only) | Consumes `searchParams` for `?page=` pagination — the base route is static-shaped but query variants are request-rendered |
| `src/app/login/page.tsx` | Server component calling `auth()`; redirects signed-in users to `/dashboard` |
| `src/app/unlock/[publicId]/page.tsx` | Per-request DB read of the QR password hash (POST target is the unlock API) |
| Per-slug `opengraph-image.tsx` routes (10 files) | The content-family OG routes (glossary/industries/templates/qr-size-guide/scan-guide) render an `ImageResponse` **at request time** despite their pages being SSG with `dynamicParams = false`; the `/q/[publicId]` OG route additionally does a DB lookup and renders the QR server-side with the `qrcode` package |
| `social-sw.js` / `socialcalendar-manifest.webmanifest` route handlers | Generated per-tree assets (cheap, but Worker-executed) |

All Class C routes degrade gracefully when their env vars are absent (503/401-style configured responses rather than crashes) — verified in code (`isAuthConfigured()`, `dbConnect()` throwing only when called without `MONGODB_URI`).

### Class D — unknown until tested on the target runtime

1. **`src/proxy.ts` under the OpenNext Cloudflare adapter.** OpenNext documents Node middleware (`proxy.ts`) as *experimental support since `@opennextjs/cloudflare` 1.20.3*; Cloudflare's own OpenNext page (updated 2026-10-12) still lists Node.js in Middleware as "Not yet supported". This is the single most important behaviour to prove in a local Workers preview.
2. **Mongoose connection reuse in Workers.** The `globalThis`-cached connection pattern is standard on Node/Vercel; Workers cannot reuse I/O objects across requests the same way, and Cloudflare's MongoDB guide documents ~300 ms fresh-connection overhead per request (or a Durable-Object-held client, ~35 ms warm). Behaviour must be tested with a real `MONGODB_URI` in a staging deploy — it cannot be proven locally without credentials.
3. **NextAuth email/Google flows in workerd** (JWT crypto CPU cost, Nodemailer over `nodejs_compat` sockets).
4. **OG-image route** for `/q/[publicId]` (DB read + image generation in workerd).
5. **Service-worker routes** and the WebSite-schema client behaviour under the adapter's prerendering.
6. **Homepage / locale-entry rendering mode.** An older saved build table marked `/` and `/[locale]` dynamic with no source-level cause found (no `force-dynamic`, no `headers()`/`cookies()` in the page path — `WebSiteSchema` explicitly avoids `headers()` to prevent exactly this deopt). The fresh build run for this migration completed page generation, but the ƒ/○ status of `/` should be re-confirmed from the staging build's route table: if the homepage is genuinely dynamic, it is the single largest avoidable Worker-CPU cost in the suite.
7. **Cards in-memory fallback.** `api/cards` falls back to an in-process `Map` when Mongo is unconfigured; on Workers, isolate churn makes that fallback even less durable than on Vercel. Behaviour is unchanged by this migration, but it must not be mistaken for persistence in staging tests.

## 4. Why Vercel's Hobby limits blew — evidence vs hypothesis

Vercel paused the deployment after: **ISR Reads 1.2M / 1M**, **Fast Origin Transfer 10.19 GB / 10 GB**, **Fluid Active CPU 4h01 / 4h**.

**Evidence (from the build output and code):**

- 2,182 prerendered routes is a very large ISR surface. Every prerendered route is an ISR asset on Vercel; crawlers + visitors reading across a 2,000+-page corpus (1,591 blog routes alone) generate ISR reads at corpus scale, not at homepage scale.
- Only 1 of 2,182 routes declares a revalidation interval; the rest are `revalidate = false`, so ISR reads are mostly *reads of static entries*, i.e. the volume is a traffic×corpus-size product, not a revalidation storm.
- The proxy runs on essentially every page request (matcher excludes only api/_next/ads/robots/sitemap/favicon/manifest/prefetch), adding Fluid CPU per request on top of page serving.
- Fast Origin Transfer is consistent with a large HTML corpus (2,193-page build) being served from origin rather than edge cache whenever cache keys vary (locale prefixes, query pagination on `/blog`, host-based rewrites across 5 hosts multiplying cache entries).
- Class C routes (dashboard, `/r/`, `/q/`, APIs) execute per request and hold Mongo connections — real CPU, but a small share of total requests compared with the static corpus.
- Two per-request multipliers inside Class C: every `/q/[publicId]` view costs ≥2 sequential DB reads (metadata + page) plus a third + a server-side QR render if its OG image is fetched; and the five content families' OG images render at origin per social scrape instead of being prerendered assets.

**Hypothesis (labelled as such — code inspection cannot prove historical traffic):**

- Crawler behaviour (search engines working through 856 not-yet-indexed URLs plus the indexed corpus) likely accounts for a large share of ISR reads; the October indexing backlog makes bot traffic plausibly dominant over human traffic. This cannot be confirmed without Vercel analytics exports, which were not available to this audit.
- The relative split between the 5 hosts is unknown for the same reason.

**Migration implication:** the fix is not "fewer pages" — it is serving the static corpus from a host where static-asset requests are free and unlimited (Cloudflare Workers Static Assets), and reserving metered execution for the proxy + Class C routes only.

## 5. Rendering / CSP findings (Phase 3)

- **The old `next.config.ts` comment block was wrong and has been corrected.** It claimed CSP is owned by `src/middleware.ts` with per-request nonces. There is no `src/middleware.ts`; `docs/SECURITY.md` §9 repeats the same stale claim. Reality: `src/proxy.ts` sets **one fixed CSP, deliberately nonce-free**, because a nonce + static prerender previously killed hydration on a sub-site (under CSP3 a nonce makes browsers ignore `'unsafe-inline'`, and prerendered flight-data scripts carry no nonce). The corrected comment now says exactly this. `docs/SECURITY.md` §9 should be corrected in a follow-up doc pass (noted, not silently rewritten here beyond this audit's scope — flagged for the parent).
- **CSP was not weakened.** No directive was added or loosened. The existing `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`:
  - `'unsafe-inline'` is structurally required by the nonce-free static-prerender design above.
  - `'unsafe-eval'`: the Next.js 16 CSP guide states it is required in **development** and **not required for production by default**. The previous comment's claim that "the Next.js runtime requires it" in production was therefore misleading and has been corrected. It is **retained for now** solely because the third-party ad/analytics snippets (AdSense/Adsterra/GTM) are not verified to run without it; removing it is a per-script verification task, recorded here as a known residual risk rather than silently fixed or silently kept.
- **Security headers preserved:** HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options remain in `next.config.ts` `headers()` (these apply to Worker-generated responses under OpenNext). Content cache headers (`s-maxage` for content sections, discovery cache for sitemap/robots) are unchanged.
- **`/home` → `/` permanent redirect preserved** via `next.config.ts` `redirects()` — a mechanism the OpenNext Worker honours (it is part of the Next build output, `routes-manifest.json` shows the 308). It is **not** moved to `_redirects`, because `_redirects` on Cloudflare governs static-asset responses only (see §6).
- **Images:** exactly one `next/image` usage (`src/components/AppHeader.tsx`, the header logo). `sharp`-based optimization cannot run in workerd; the supported path is the Cloudflare Images `IMAGES` binding (declared in `wrangler.jsonc`) or disabling optimization. See the migration doc for the cost note.

## 6. Architecture decision (Phase 2 summary; full rationale in `docs/cloudflare-migration.md`)

Researched 2026-11-23 against official sources (OpenNext Cloudflare docs, Cloudflare Workers limits/pricing, Next.js 16 docs — citations and access date in `docs/cloudflare-migration.md`):

- **Static export (`output: 'export'`) — rejected.** Next 16's static-export guide lists dynamic server functions as unsupported; Class C (auth, APIs, `/r/` redirects, dashboard, uploads) would break. The commission forbids breaking features to fit a plan.
- **vinext — rejected.** Cloudflare now defaults new Next.js setups to vinext, but it is explicitly **beta** and is a Vite reimplementation of the Next.js API. The commission forbids beta framework replacements.
- **Chosen: `@opennextjs/cloudflare` (OpenNext adapter) on Workers + Workers Static Assets.** The existing Next build is preserved; prerendered pages become static assets (free, unlimited requests); the Worker runs the proxy + Class C routes.
- **Version pin that matters:** the installed Next is 16.3.8. The latest adapter (1.20.18) requires Next ≥ 16.4.5 and would **not** install cleanly. Adapter **1.20.11** is the newest whose peer range (`>=15.5.27 <16 || >=16.3.8`) accepts Next 16.3.8, and it is ≥ 1.20.3, i.e. it includes the experimental Node-middleware (`proxy.ts`) support line. Wrangler resolved to **4.166.0** (peer `^4.148.0`). Upgrading Next to ≥ 16.4.5 to unlock newer adapters is a separate, separately-approved change — not bundled into this migration.
- **`_headers` / `_redirects` scope (verified, not assumed):** on Cloudflare these files govern **static-asset responses only**; they are *not* applied to Worker-generated responses. Therefore: security headers/CSP stay in `next.config.ts` + `src/proxy.ts`; the `/home` redirect stays in `next.config.ts`; `public/_headers` is used only for immutable caching of `/_next/static/*` assets — the one thing it can actually govern. `vercel.json` is ignored by Cloudflare and is left in place (harmless; removing it is a separate decision).

## 7. Free-tier suitability (evidence-based)

Official Workers Free limits (accessed 2026-11-23): **100,000 Worker requests/day**, **10 ms CPU per invocation**, 128 MB memory, 50 subrequests/request, 20,000 static-asset files per Worker version, 25 MiB per asset file. **Requests to static assets are free and unlimited.**

- Asset count: the build's static output (2,182 prerendered routes + `public/` + `_next/static`) must be counted against the 20,000-file limit — done in Phase 5 verification.
- The corpus fits the *static* side of Free comfortably. The risk is the *Worker* side: every non-asset request runs the proxy, and Class C requests add SSR + (when configured) Mongo/Auth work. Cloudflare's own Vercel→Workers migration guidance warns SSR apps usually need Workers Paid because of the 10 ms CPU limit. **Verdict: Free is realistic for the static corpus and for launch-level dynamic traffic; it is NOT proven sufficient for this app's full dynamic surface, and no honest audit can promise it before a staging deploy measures real CPU per request.** Local preview timing is not production CPU evidence.

## 8. Phase 5 verification results (2026-11-23, this VM: ~6 GB RAM cell)

| Check | Result |
|---|---|
| `npm install -D @opennextjs/cloudflare@1.20.11 wrangler@^4.148.0` | ✅ Resolved: adapter **1.20.11**, wrangler **4.166.0**; `package-lock.json` updated |
| `npm run typecheck` | ✅ Clean |
| `npm run test:run` (full vitest) | ✅ **600/600 passed** (51 files) |
| `npm run lint` | ⚠️ 7 errors / 362 warnings — all 7 errors **pre-existing** in unrelated files (`bulk-generator/BulkClient.tsx`, `privacy/page.tsx`, `terms/page.tsx`); the files changed by this migration lint clean individually (exit 0) |
| `next build` (inside the adapter pipeline) | ✅ Completed — 2,193 pages generated; the build output lists **ƒ Proxy (Middleware)**, i.e. `src/proxy.ts` was picked up |
| OpenNext bundling: middleware function | ✅ Completed — with the adapter's own warning: *"Node.js middleware support is experimental in cloudflare, and not officially maintained by OpenNext maintainers. Use at your own risk."* (verbatim from build log) |
| OpenNext bundling: static + cache assets | ✅ Completed — 543 asset files / 20 MB at that pipeline stage; largest single file 1.3 MiB (limit 25 MiB); ≈2,800 files expected in total vs the 20,000-file Workers limit |
| OpenNext bundling: **server function (esbuild)** | ❌ **OOM-killed (exit 137) in 5 attempts** on this VM, including with `--skipNextBuild` and `--noMinify`, and with Node/Go memory limits set. The Next build, middleware bundle and asset bundle complete; the final monolithic server bundle exceeds this machine's ~6 GB. **Build-environment limitation, not an app incompatibility** — rerun on ≥ 16 GB RAM or Cloudflare Workers Builds. |
| Cloudflare local preview (`opennextjs-cloudflare preview`, workerd) | ⛔ **Not run** — blocked by the server-bundle OOM above (no `.open-next/worker.js` could be produced here). All preview smoke tests (proxy host routing, 410s, redirects, CSP headers, API degradation responses) are therefore **unverified** and are gated as the staging checklist in `docs/cloudflare-migration.md` §8. |
| Worker size vs 3 MiB / 64 MiB limits | ⛔ Unverified — no final bundle produced locally; measure via `wrangler deploy --dry-run` at staging. (Docs conflict on the size limit itself — Cloudflare's current Limits page, updated 2026-11-19, states 64 MiB uncompressed for both plans; OpenNext's index still cites 3 MiB gzipped on Free. Trust the dry-run output + current Limits page.) |
| Class C routes with real secrets (Mongo/Auth/Cloudinary) | ⛔ Unverified — no credentials on this VM by design; staging-only checks. |

**Net verification position:** everything that can be proven without the final bundle is proven (install, types, tests, Next build, adapter acceptance of the app + proxy, asset limits). The workerd runtime behaviour — the Class D items in §3 — remains genuinely untested and must not be claimed compatible until the §8 staging checklist passes.

## 9. Startup-CPU failure (error 10021) — root cause and fix (2026-11-24)

**Symptom (owner's Windows machine):** with Next 16.4.6 + @opennextjs/cloudflare 1.20.18 + @opennextjs/aws 4.2.0 + wrangler 4.166.0, every build step succeeds (Next build, TypeScript, 2,193 static pages, OpenNext bundling, asset upload; Worker upload ≈ 62,486 KiB) and the deployment then fails final validation: `Script startup exceeded CPU time limit [code: 10021]`. Cloudflare's Limits documentation (updated 2026-11-19, accessed 2026-11-24) defines the budget: a Worker must **parse and execute its global scope within 1 second**; larger bundles and expensive global-scope initialization increase startup time, and the prescribed remedy is moving initialization into the handler or to build time.

**Evidence base (and its limit):** the owner's startup CPU profile (`.wrangler/tmp/.../worker.cpuprofile`) exists only on their machine and was NOT available to this audit — no claim below rests on it. The root cause is established from bundle composition measured locally: file-size ranking of the Next server output and the partial `.open-next` artifacts, plus import tracing of the largest contributors. Local stack was first aligned to the owner's exact deployment versions (next 16.3.8 → **16.4.6**, @opennextjs/cloudflare 1.20.11 → **1.20.18**; @opennextjs/aws resolved to 4.2.0, wrangler 4.166.0 — identical to the failing environment).

### 9.1 Ranked startup contributors (measured, pre-fix build)

| # | Contributor | Measured size | Why it costs startup CPU |
|---|---|---|---|
| 1 | **Blog article corpus, eagerly imported and duplicated** — `src/lib/articles.ts` imported all 170 batch modules (`src/lib/pages/Batch*.ts`, ~10 MB of article full text) via `./pages/index`; every metadata-only consumer dragged the whole corpus in | **10,031,965 B** chunk referenced only by the sitemap route + **9,904,956 B** SSR chunk referenced by `/`, `/[locale]`, `/blog`, `/blog/[slug]`, `/sitemap-page` = **19.94 MB = 48.8 % of all server chunk JS** (total 40,824,902 B across 1,647 files) | ~1,591 articles' full text (content + FAQs + howTo) parsed/registered as two giant chunks in the server graph, although 4 of the 5 consumers use only slug/title/description/dates |
| 2 | **Middleware (proxy) bundle** — statically imported by `worker.js`, so unambiguously inside the startup graph | 3,462,569 B (adapter 1.20.11 build) | Contents probed: no articles/mongoose/auth/jspdf — it is the Next edge runtime + Turbopack runtime + `src/proxy.ts` + the 54 KB indexing policy. `proxy.ts`'s own import graph was already minimal (routing/redirects/410/CSP only); the bulk is framework runtime, reduced by the adapter upgrade (see 9.3) |
| 3 | **MongoDB connection attempt at module evaluation** — `src/lib/auth.ts` called `MongoDBAdapter(getMongoClient())` at module top level; in production mode `getMongoClient()` creates the client and starts `client.connect()` immediately | n/a (behaviour, not bytes) | Importing the auth module (auth routes, dashboard, login) opened a network connection during module evaluation — exactly the global-scope work the 1 s budget penalises. The Mongoose helper (`src/lib/db/mongoose.ts`) was already lazy and is unchanged |
| 4 | Client-only libraries present in SSR chunks: `heic2any` 1,351,666 B, `pdfjs-dist` ~1.77 MB (source map) | per-route SSR chunks | Already behind dynamic `import()` at the call site (`imageresizer-site/_lib/engine/decode.ts`); they ship as lazy per-route chunks and are not evaluated at startup. Recorded for completeness; no change made |
| 5 | `src/data/*` content families (~1.1 MB: industries, glossary, devices, templates-gallery, size-guides) | per-route chunks | Used by SSG family pages at build time; not in the startup graph. No change |

Explicitly NOT the cause (checked): the duplicate-`case` / nullish-coalescing warnings come from `heic2any`'s bundled dist (item 4) — a lazy chunk, not a startup contributor. The indexing policy (53,929 B source) is a Set lookup. Cloudinary's module-level `config()` call is a plain object assignment. No cron/webhook/server-action modules exist.

### 9.2 The fix (implemented 2026-11-24)

1. **Article metadata/content split** (`src/lib/articles.ts` rewritten as an access layer):
   - Seed articles + the SERP override table moved verbatim to `src/lib/articles-seed.ts` (110,115 B, byte-identical content).
   - New generated module `src/lib/articles-meta.generated.ts`: `ARTICLE_META` — all 1,591 articles' metadata **without** content/faqs/howTo (868 KB source) — plus `ARTICLE_BATCH_BY_SLUG`.
   - New generated module `src/lib/pages/loaders.generated.ts`: `BATCH_LOADERS` — one dynamic `import()` per batch, so full text loads as ~60 KB per-batch chunks only when an article is actually rendered.
   - `scripts/generate-article-meta.ts` regenerates both files from the corpus (batch order parsed from `pages/index.ts`; overrides applied; first-occurrence-wins for duplicate slugs, matching historical `getArticleBySlug` semantics).
   - Consumers migrated: `blog/page.tsx`, `blog/[slug]/page.tsx` (params from meta; metadata from meta; body via `getArticleBySlugAsync`), `sitemap.ts` §5, `sitemap-page/page.tsx`, `components/home/HomePage.tsx` — all now metadata-only.
   - The eager full-corpus accessors survive as `src/lib/articles-full.ts`, imported ONLY by the offline scripts (`scripts/content-audit.ts`, `scripts/analyze-batches.ts` — the latter's seed-source scan now reads `articles-seed.ts`). No route imports it.
   - Equivalence proven by direct comparison: same 1,591 articles, same order, identical metadata fields (incl. overrides), and byte-identical content/faqs/howTo returned by the lazy loader for seed, mid-corpus and last-corpus articles; unknown slug → `undefined` (404 path preserved).
2. **Lazy Auth.js adapter client** (`src/lib/mongodb.ts` + `src/lib/auth.ts`): new `getMongoClientLazy()` returns a thenable that does not call `getMongoClient()` until first awaited; the adapter now receives it, so no connection is opened at module evaluation. The adapter only awaits the client inside per-request methods — sign-in/session behaviour unchanged.
3. **Version alignment** (above): the adapter upgrade also shrank the middleware bundle (9.3).

Nothing was deleted: all 2,193 routes still generate; no page, API, auth flow, sitemap section, the 410 policy, subdomain routing, or CSP changed.

### 9.3 Measured results (this VM)

| Metric | Before | After |
|---|---|---|
| Next build | ✅ (16.3.8) | ✅ **2,193/2,193 pages** (16.4.6) |
| TypeScript (`npm run typecheck`) | ✅ | ✅ clean |
| Vitest (`npm run test:run`) | 600/600 | ✅ **600/600** |
| Lint on changed files | — | ✅ 0 errors (6 pre-existing warnings) |
| Server chunk JS total | 40,824,902 B / 1,647 files | **30,719,851 B / 2,432 files (−24.8 %)** |
| Article corpus in shared chunks | 19,936,921 B (two ~10 MB chunks) | **882,448 B** SSR meta chunk + **834,240 B** sitemap chunk (meta) — the corpus full text now sits in 340 per-batch lazy chunks (20,521,732 B total, ~60 KB each, loaded on demand only) |
| Middleware handler (`.open-next`) | 3,462,569 B | **1,953,909 B (−44 %)** |
| Worker upload (owner-reported baseline) | 62,486 KiB | ⛔ not measurable locally — see below |

### 9.4 What remains unverified, and why

The final OpenNext esbuild bundle step (`⚙️ Bundling the OpenNext server…`) was **OOM-killed on this 6 GiB VM in 3 further attempts** (8 total across both programs), including with `NODE_OPTIONS=--max-old-space-size=3072` and `=2048`, with `--noMinify`, with `--skipNextBuild`, and with all 2,797 `.next/server` source maps (70.6 MB) removed. The bundler Node process was observed at 5.6 GB RSS before the kill. Everything upstream of that step completes: the pipeline produced `worker.js`, the middleware bundle, assets and `server-functions/default/index.mjs`; only `handler.mjs` (the bundled server) is missing, so **`opennextjs-cloudflare preview` smoke tests could not run here**. This is the same build-machine limitation recorded in §8 — the owner's Windows machine completes this step (their deployment reached validation), so the verification path is: pull the fix, `npm run build:cloudflare`, deploy, and read wrangler's `startup_time_ms` output; if validation still fails, wrangler writes a fresh `worker.cpuprofile` that can be analysed function-by-function. **Deployment success is NOT claimed.**
