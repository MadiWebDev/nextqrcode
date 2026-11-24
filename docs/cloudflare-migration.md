# Vercel → Cloudflare Migration Guide

- **Status:** implemented locally, **not deployed**. No production deployment, DNS change, paid resource, or account change has been made. Deployment and DNS cutover require explicit approval (see §7–§9).
- **Audit:** `docs/cloudflare-migration/AUDIT.md` (route inventory A/B/C/D, Vercel-usage analysis, CSP findings).
- **Docs accessed:** 2026-11-23 (OpenNext Cloudflare docs, Cloudflare Workers limits/pricing, Next.js 16 docs).

## 1. Architecture and rationale

**Chosen: `@opennextjs/cloudflare` (OpenNext adapter) on Cloudflare Workers + Workers Static Assets.**

- The existing Next.js build is preserved unchanged in behaviour: the adapter runs `next build`, then transforms the output into one Worker (`.open-next/worker.js`) plus a static-assets directory (`.open-next/assets`).
- The ~2,182 prerendered pages and all `public/`/`_next/static` files are served as **static assets — free and unlimited on Cloudflare** — which directly removes the Vercel ISR-read/origin-transfer pressure that paused the Hobby deployment.
- The Worker runs only what must execute: `src/proxy.ts` (host routing for the 5 hosts, www→apex 308, cross-host 301s, the 87-URL 410 policy, CSP) and the genuinely request-time routes (auth, `/api/*`, `/r/[publicId]`, `/q/[publicId]`, dashboard).
- Rejected: **static export** (breaks auth/APIs/dynamic-QR routes — Next 16 static exports do not support dynamic server functions) and **vinext** (Cloudflare's new default, but explicitly beta and a framework reimplementation — out of scope per the commission).
- Version pin: **`@opennextjs/cloudflare@1.20.11`** is the newest adapter whose peer range accepts the installed **Next 16.3.8** (the latest adapter, 1.20.18, requires Next ≥ 16.4.5). Wrangler resolved to **4.166.0**. Upgrading Next is a separate decision, not part of this migration.

### How each proxy behaviour is preserved

| Behaviour (today, in `src/proxy.ts`) | On Cloudflare |
|---|---|
| Subdomain rewrites to the four `*-site` trees | Runs in the Worker — OpenNext ≥ 1.20.3 has *experimental* Node-middleware support; the adapter prints this warning at build time (observed). **Must be smoke-tested at staging (§8) before DNS moves.** |
| www → apex 308, cross-host tree 301s | Same Worker code path as above |
| 87 removed URLs → 410 + HTML body | Same Worker code path (`src/lib/seo/indexing-policy.ts`) |
| CSP + security headers | CSP from the proxy; other security headers from `next.config.ts` `headers()` — both apply to **Worker responses**. `public/_headers` applies **only to static-asset responses** on Cloudflare and is used solely for immutable `/_next/static/*` caching; it deliberately contains no security headers. |
| `/home` → `/` permanent (308) | `next.config.ts` `redirects()` — part of the Next build output the Worker honours. Not moved to `_redirects` (asset-only mechanism). |
| Sitemap index + children, robots, ads.txt | Static/prerendered output served as assets; content and URLs unchanged. `public/ads.txt` and the `ads.txt` route are untouched. |
| AdSense / analytics | Client-side snippets unchanged; CSP host allowlist unchanged. |

## 2. Prerequisites

- Node.js + npm (repo uses npm; `package-lock.json` is the lockfile).
- A machine with **≥ 16 GB RAM for the OpenNext bundling step** — see the known limitation in §10: the final esbuild server bundle was OOM-killed (exit 137) five times on the 6 GB build VM used for this migration, after the Next build, middleware bundle, and asset bundle had all completed. Cloudflare **Workers Builds** (git-connected) or any ≥ 16 GB workstation/CI runner satisfies this.
- A Cloudflare account with the `freeqrcode.tools` zone (account-side; nothing in this change creates it).
- For staging validation of Class C routes: the production env values (Mongo, Auth, Cloudinary) entered as Worker secrets — values never enter this repo.

## 3. Exact commands

Local (no approval needed):

```bash
npm install                 # installs @opennextjs/cloudflare + wrangler (devDependencies)
npm run typecheck           # tsc --noEmit
npm run lint                # eslint (7 pre-existing errors in unrelated files; see AUDIT.md)
npm run test:run            # vitest — 600/600 passed at migration time
npm run build:cloudflare    # opennextjs-cloudflare build  (= next build + Worker transform)
npm run preview             # build + opennextjs-cloudflare preview (workerd locally — the faithful pre-deploy test; NOT next dev)
npm run cf-typegen          # optional: generate cloudflare-env.d.ts
```

Requiring deployment approval (do **not** run without it):

```bash
npm run deploy:cloudflare   # opennextjs-cloudflare build && deploy — creates/updates the Worker in the Cloudflare account
npx wrangler secret put <NAME>   # per secret in §5, staging first
```

## 4. Configuration files added/changed

| File | Purpose |
|---|---|
| `open-next.config.ts` | Adapter config (defaults; documents why no R2 incremental cache is configured) |
| `wrangler.jsonc` | Worker name `freeqrcode-tools`, entry `.open-next/worker.js`, `compatibility_date: 2026-11-23`, `compatibility_flags: ["nodejs_compat"]`, `ASSETS` binding, `IMAGES` binding, observability on. **No routes/custom domains declared** — attaching hosts is the approved cutover step, not a config default. |
| `public/_headers` | Immutable caching for `/_next/static/*` **static assets only** (scope explained in the file) |
| `next.config.ts` | Corrected the stale CSP comment (there is no `src/middleware.ts`; CSP is the proxy's fixed nonce-free policy) + `initOpenNextCloudflareForDev()` for local dev bindings. Headers/redirects unchanged in behaviour. |
| `src/app/r/[publicId]/route.ts` | Scan-country header now reads `CF-IPCountry` first, `x-vercel-ip-country` as fallback |
| `package.json` / `package-lock.json` | Adapter + Wrangler devDependencies; scripts `build:cloudflare`, `preview`, `deploy:cloudflare`, `cf-typegen` |
| `.gitignore` | `.open-next/`, `.wrangler/`, `.dev.vars*`, `cloudflare-env.d.ts` |
| `vercel.json` | **Left in place.** Cloudflare ignores it; deleting it is a separate decision for when Vercel is fully retired. |

## 5. Environment variables and bindings

No values are stored in the repo. Set the same variables the app already documents in `.env.example` as Worker secrets/vars at deploy time. Names only:

- Auth: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`, `EMAIL_SERVER`, `EMAIL_FROM`
- Data: `MONGODB_URI`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Media: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL`
- App: `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL`, `PASSWORD_TOKEN_SECRET`, `IP_HASH_SALT`, `GOOGLE_SAFE_BROWSING_API_KEY`
- Ads/analytics (public, build-time): `NEXT_PUBLIC_ADSENSE_CLIENT_ID` / `ADSENSE_PUBLISHER_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`, `NEXT_PUBLIC_ADSTERRA_ENABLED`, `NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY`, `NEXT_PUBLIC_ANALYTICS_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`
- Local Worker preview only: `.dev.vars` with `NEXTJS_ENV=development` (gitignored).

Bindings declared in `wrangler.jsonc`: `ASSETS` (static assets, no cost), `IMAGES` (Cloudflare Images — see §10 cost note). **Not** configured: R2/KV/D1 incremental cache (the site's only revalidating route is `ads.txt` at 3600 s; add R2 later only if real ISR persistence is needed — R2 is billable).

## 6. Local build & preview

`npm run preview` builds and serves the app in **workerd** on localhost — this is the only faithful pre-deploy check of proxy behaviour, CSP headers, and route handlers. `npm run dev` (Next dev server) proves nothing about the Workers runtime.

**Migration-time verification status (2026-11-23, 6 GB VM):** typecheck clean; vitest 600/600; `next build` inside the adapter pipeline completed (2,193 pages; proxy bundled as the middleware function with the adapter's experimental-middleware warning); static/cache asset bundling completed (543 asset files, 20 MB, largest file 1.3 MiB vs the 25 MiB per-file limit; ≈2,800 files expected once prerendered HTML joins, vs the 20,000-file Workers limit). **The final server-function esbuild bundle was OOM-killed (exit 137) on this VM in 5 attempts** (including `--skipNextBuild` and `--noMinify`), so `.open-next/worker.js` could not be produced here and **the workerd preview smoke tests could not be run locally**. This is a build-machine memory limit, not an app incompatibility — the same pipeline is what Cloudflare Workers Builds runs server-side. The smoke checklist in §8 must be executed at staging on adequate hardware before any DNS change.

## 7. Staging deploy (approval required)

1. On a ≥ 16 GB machine or via Workers Builds: `npm run build:cloudflare` → confirm it completes and note the reported Worker size (deploy dry-run: `npx wrangler deploy --dry-run` prints Total Upload).
2. Deploy to a staging Worker (e.g. `wrangler deploy --name freeqrcode-tools-staging` or a `workers.dev` subdomain) — no production hostnames attached.
3. Add the §5 secrets to the staging Worker (`wrangler secret put`), starting with `MONGODB_URI`, `AUTH_SECRET` and one provider pair so Class C routes run for real.
4. Run the full §8 checklist against the staging URL, using `Host`-header or staging-domain mapping for the four subdomains (attach the subdomains to the staging Worker temporarily if Host-header testing is insufficient).
5. Only after §8 passes in full: proceed to §9.

## 8. Validation checklist (staging, then repeated on production after cutover)

- [ ] Homepage `/` 200; a QR tool flow works end-to-end in the browser (generate + scan)
- [ ] Locale entries: `/es`, `/ar` (RTL), `/ur`, `/de` render with correct `lang`/`dir`, canonical + hreflang intact
- [ ] One page per sub-site tree via its real host: invoice, imageresizer, socialcalendar, resumebuilder homepages + one tool page each
- [ ] Blog article, glossary term, template page, guide page samples: 200 + correct metadata
- [ ] `/sitemap.xml` + two child sitemaps, `/robots.txt`, `/ads.txt`: 200, content matches the Vercel-served versions
- [ ] `/home` → 308 → `/`; www host → 308 apex; a cross-host tree URL → 301 to the correct host
- [ ] One of the 87 removed URLs → **410** with the removal page body
- [ ] Unknown path → 404 page
- [ ] Response headers on a page: CSP present (proxy policy), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options; browser console free of CSP errors; AdSense/analytics requests not blocked by CSP
- [ ] API routes without secrets → configured degradation (not 500 crashes); with staging secrets: sign-in flow, create/list QR codes, `/r/<id>` redirect + scan logged with a real country value, unlock flow, upload signing, dashboard after login
- [ ] Header logo (`next/image`) renders via the `IMAGES` binding
- [ ] Service workers (`/sw.js`, resume/social workers) served and registering

## 9. DNS cutover (approval required, production)

Prerequisite: §8 fully green on staging, and Vercel deployment still live as the rollback target.

1. In Cloudflare, attach the five hostnames to the production Worker as custom domains: `freeqrcode.tools`, `invoicegenerator.freeqrcode.tools`, `imageresizer.freeqrcode.tools`, `socialcalendar.freeqrcode.tools`, `resumebuilder.freeqrcode.tools`.
2. Move DNS for the zone to Cloudflare nameservers if not already there (registrar step — owner only).
3. Set the §5 secrets/vars on the production Worker.
4. Re-run §8 against the production hosts.
5. Watch Worker observability + error rate for 24–48 h; keep the Vercel deployment untouched during this window.
6. AdSense: no account change needed — `ads.txt` content, publisher ID and page URLs are unchanged, so no re-verification should trigger. Confirm ads render on two sample pages per host (CSP check in §8 covers the technical side).

## 10. Limitations and costs

- **Free-tier verdict:** Workers Free = 100,000 Worker requests/day, **10 ms CPU/invocation**, static-asset requests free/unlimited (limits accessed 2026-11-23). The static corpus — the overwhelming majority of this site's traffic surface — fits Free. The proxy runs on every non-asset page request and Class C routes add SSR + DB work; Cloudflare's own migration guidance warns SSR apps usually need **Workers Paid** (minimum $5/mo at access date) because of the 10 ms CPU limit. Treat Free as launch-viable, Paid as the realistic steady state; decide from staging CPU measurements, not from this document.
- **Cloudflare Images** (for the single `next/image` logo) is a billable product if enabled on the zone; the zero-cost alternative is serving that one logo unoptimized. Decide at staging.
- **MongoDB on Workers:** each invocation opens a fresh connection (~300 ms overhead per Cloudflare's guide; pooling does not carry over). Low-traffic acceptable; a Durable-Object-held client is the documented optimisation if `/r/` + dashboard latency matters. **Unverified until staging with a real `MONGODB_URI`.**
- **Experimental proxy support:** the adapter warns Node middleware is experimental and not officially maintained by OpenNext. If §8 shows proxy misbehaviour, the fallback is reimplementing the proxy's five behaviours as a small standalone Worker in front of the OpenNext Worker — a contained change, but a change; it is the migration's top risk.
- **Build memory:** the OpenNext bundling step needs a bigger machine than 6 GB RAM for this codebase (see §6). Workers Builds or CI is the practical answer.
- `docs/SECURITY.md` §9 still describes the retired nonce/middleware design; the code and `next.config.ts` comments are correct. A doc-only follow-up should align it.

## 11. Rollback

Rollback is a DNS/hosting revert — no code change:

1. Remove the five custom domains from the Worker (or repoint DNS records back to the Vercel deployment targets).
2. The Vercel deployment was never modified by this migration and remains the previous production; `vercel.json` and all Vercel behaviour (including the `x-vercel-ip-country` fallback in scan logging) still work there.
3. Confirm §8's URL/header checks pass on the Vercel-served hosts, then investigate the Cloudflare issue on staging at leisure.

## 12. Startup-CPU fix — error 10021 (2026-11-24)

**Problem.** On the owner's machine (Next 16.4.6, @opennextjs/cloudflare 1.20.18) the deployment passed every build step and failed final Worker validation: `Script startup exceeded CPU time limit [code: 10021]`, upload ≈ 62,486 KiB. Cloudflare's budget is 1 second to parse + execute the Worker's global scope.

**Root cause (evidence in `docs/cloudflare-migration/AUDIT.md` §9).** The blog article corpus (~1,591 articles, 170 batch modules, ~10 MB of full text) was eagerly imported by `src/lib/articles.ts` and therefore duplicated into two ~10 MB server chunks — 19.94 MB, 48.8 % of all server chunk JS — pulled in by the sitemap route, blog index, article page, HTML sitemap and homepage, although all but one of them need only metadata. Secondary contributors: the 3.46 MB middleware bundle (framework runtime; the proxy's own imports were already minimal) and a MongoDB connection opened at module-evaluation time by the Auth.js adapter setup.

**Fix.**
- Versions aligned to the deployment environment: `next@16.4.6`, `@opennextjs/cloudflare@1.20.18` (brings @opennextjs/aws 4.2.0; middleware bundle shrank 3.46 MB → 1.95 MB).
- Articles split into a generated metadata index (`src/lib/articles-meta.generated.ts`, no body text) + per-batch lazy loaders (`src/lib/pages/loaders.generated.ts`); all listing/sitemap/homepage consumers use metadata only; the article page loads exactly one batch on demand. The eager corpus module survives as `src/lib/articles-full.ts` for offline audit scripts only. After editing any `Batch*.ts` or seed article, regenerate with `npx tsx scripts/generate-article-meta.ts`.
- Auth.js adapter now receives a lazy client promise (`getMongoClientLazy()` in `src/lib/mongodb.ts`): no DB connection during module evaluation.

**Measured after the fix:** server chunk JS 40.82 MB → 30.72 MB (−24.8 %); corpus in shared chunks 19.94 MB → ~1.72 MB of metadata; typecheck clean; vitest 600/600; production build 2,193/2,193 pages. All routes, SEO, sitemaps, the 410 policy and subdomain routing are unchanged.

**Not verified locally:** the final OpenNext bundle + workerd preview remain blocked by this VM's 6 GiB memory (bundling step OOM-killed; see AUDIT.md §9.4). Verify on the deployment machine: run `npm run build:cloudflare` then deploy — wrangler prints `startup_time_ms`; success there is the acceptance test for this fix. Nothing in this section was deployed from the build VM.
