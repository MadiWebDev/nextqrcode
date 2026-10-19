# NextQRCode — Production Deployment Guide

## 1. Vercel

### Project setup

1. Import the `MadiWebDev/nextqrcode` repository in the Vercel dashboard.
2. Framework preset: **Next.js**. Build and output settings are the defaults.

### Build

| Setting          | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Build command    | `npm run build` (runs `prebuild` → `content:audit`, then `next build`) |
| Install command  | `npm install`                                                          |
| Output directory | `.next` (Next.js default)                                              |
| Node.js version  | 20.x (set in Project Settings → General if needed)                     |

Note: `prebuild` runs `tsx scripts/content-audit.ts`, which regenerates
`src/content/__generated__/audit-manifest.json`. No extra env vars are required
for the build — the app builds with none of them set.

### Cron jobs

There is **no `vercel.json`** in this repo and no cron jobs are defined.
No scheduled functions are required for launch.

### Environment variables

Add every variable listed in `.env.example` under **Project Settings →
Environment Variables**, scoped to **Production** (and Preview if you want
preview deployments fully functional). Variables prefixed `NEXT_PUBLIC_` are
inlined at build time — a changed value requires a redeploy.

Minimum production set: `NEXT_PUBLIC_SITE_URL`, `MONGODB_URI`, `AUTH_SECRET`,
`EMAIL_SERVER`, `EMAIL_FROM`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`.

## 2. MongoDB Atlas

1. Create a cluster (M0 free tier is fine for launch; use M10+ for production
   traffic) in your preferred region.
2. **Network access (IP allowlist):** Vercel uses dynamic egress IPs, so add
   `0.0.0.0/0` (allow access from anywhere). Restrict access with a strong
   database-user password and least-privilege roles instead of IP filtering.
3. Create a database user with `readWrite` on the application database and
   copy its credentials.
4. Connection string format:

   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nextqrcode?retryWrites=true&w=majority
   ```

   Set this as `MONGODB_URI`. URL-encode special characters in the password.

5. **Replica set note:** Atlas clusters are always replica sets, which is what
   `?retryWrites=true&w=majority` expects. Do **not** point production at a
   standalone MongoDB instance — transactions/retryable writes would fail.
6. The app connects lazily through `src/lib/db/mongoose.ts`, which caches the
   connection on `globalThis` for serverless reuse (`bufferCommands: false`,
   so misconfiguration fails fast instead of hanging).

## 3. Cloudinary

Used for logo uploads in the QR studio (signed uploads).

1. In the Cloudinary dashboard, create an **upload preset** named
   `nextqrcode` with **Signing mode: Signed** and allowed formats restricted
   to `png`, `jpg`, `jpeg`, `webp`, `svg`.
2. Folder structure for uploaded assets:
   - `nextqrcode/logos/` — user-uploaded logos (default folder for the preset)
   - `nextqrcode/og/` — generated Open Graph images (if enabled)
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   Alternatively a single `CLOUDINARY_URL` (`cloudinary://<key>:<secret>@<cloud>`)
   is accepted by `src/lib/cloudinary.ts`.

## 4. Auth.js v5

1. `AUTH_SECRET` — generate with `openssl rand -base64 32`. Required; the app
   refuses to start auth flows without it.
2. `AUTH_URL` — the canonical production URL, e.g.
   `https://www.example.com`. Auth.js v5 derives callback URLs from it; it must
   match the deployed origin exactly (scheme + host, no trailing slash).
3. Google OAuth (optional — enables "Continue with Google"):
   - Create OAuth credentials in the Google Cloud Console.
   - Authorized redirect URI:
     `https://<your-domain>/api/auth/callback/google`
   - Set `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
4. Email magic link (optional — passwordless sign-in):
   - Set `EMAIL_SERVER` (SMTP URL) and `EMAIL_FROM`.

**Allowed callback URLs** — every sign-in provider callback must be registered
with the provider:

- Google: `https://<your-domain>/api/auth/callback/google`
- (Add one line per additional provider at `/api/auth/callback/<provider>`.)

## 5. Custom domain

1. In Vercel: **Project → Settings → Domains → Add** your domain
   (e.g. `www.example.com`, plus the apex `example.com` if desired).
2. DNS at your registrar:
   - Apex (`example.com`): `A` record → `76.76.21.21` (Vercel's IP), or use
     Vercel nameservers.
   - `www`: `CNAME` → `cname.vercel-dns.com`.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.example.com` — `siteConfig.url`
   (`src/config/site.ts`) reads this value and uses it for the canonical URL,
   sitemap, hreflang alternates, OG tags and short links. **Redeploy after
   changing it** (it is inlined at build time).
4. Update `AUTH_URL` and provider callback URLs to the new domain (section 4).

## 6. AdSense

1. Create an AdSense account and get your publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` (the alias
   `NEXT_PUBLIC_ADSENSE_CLIENT_ID` also works).
3. Set `ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX` (digits only). This is
   server-only and feeds the `/ads.txt` route (`src/app/ads.txt/route.ts`),
   which serves:

   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```

4. Optional slot overrides: `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`,
   `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`.
5. Ads are consent-gated and render nothing when the client ID is empty, so it
   is safe to deploy before AdSense approval — just expect no ads.
6. After Google approves the site, verify `https://<your-domain>/ads.txt`
   returns the publisher line.

## 7. Sentry (optional)

Error tracking is forwarded only when a DSN is configured
(`src/lib/observability.ts`):

- `SENTRY_DSN` — server-side errors.
- `NEXT_PUBLIC_SENTRY_DSN` — client-side errors (inlined at build time).

If neither is set, errors are logged to the console and nothing leaves the
runtime. Safe to omit at launch.

## 8. Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin; redeployed after any change.
- [ ] `MONGODB_URI` points at the Atlas replica set; app connects (check `/api/health` or logs).
- [ ] `AUTH_SECRET` generated and set; `AUTH_URL` matches the deployed origin.
- [ ] OAuth redirect URIs registered with each provider (Google: `/api/auth/callback/google`).
- [ ] Cloudinary upload preset `nextqrcode` created (signed) with folder `nextqrcode/logos/`.
- [ ] `ads.txt` serves the publisher line (`/ads.txt` returns 200 with `google.com, pub-…`).
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` all green.
- [ ] `npx tsc --noEmit` clean on deploy artifacts.
- [ ] `robots.txt` / sitemap return the production canonical URLs.
- [ ] Optional: Sentry DSNs set; Upstash Redis set for distributed rate limiting
      (falls back to in-memory per instance); `GOOGLE_SAFE_BROWSING_API_KEY`
      set for dynamic-link destination checks.
- [ ] No secrets committed to the repo; `.env.local` is gitignored.
