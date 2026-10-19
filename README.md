# NextQRCode

Free QR code generator & QR tools platform — 40+ QR content types, design studio, scan-ability
checks, bulk generation, saved/dynamic QR codes with short links and privacy-safe analytics,
plus a large library of guides and tools.

**Live:** https://nextqrcode.vercel.app · **Repo:** https://github.com/MadiWebDev/nextqrcode

## Features

- **40+ QR content types** — URL, text, Wi-Fi, vCard/MeCard, email, SMS, phone, geo, calendar event,
  WhatsApp, Telegram, social profiles, app-store links, PDF/file, image/gallery, menu, Google review
  link, Bitcoin/Ethereum, UPI, SEPA/EPC, Swiss QR-bill, Pix and more — each with a spec-correct
  payload builder covered by unit tests.
- **Design studio** — colors/gradients, dot & eye styles, logo with safe area, frames with CTA text,
  error-correction auto-raise, quiet-zone control.
- **Scan-ability guard** — live contrast check, in-browser decode round-trip, print-size recommendations.
- **Exports** — PNG (1x–8x), SVG, print-ready PDF, clipboard copy, Web Share API.
- **Scanner** — camera + image upload with safe-link preview.
- **Bulk generator** — CSV upload → ZIP of PNG/SVG in a Web Worker.
- **Accounts & dynamic QR** — save codes, edit destinations later, pause/expire/password-protect,
  short links (`/r/<id>`), privacy-safe scan analytics (salted daily-rotating IP hashes, no raw IPs).
- **Content library** — type hubs, how-to guides, glossary, troubleshooting, regional payment standards,
  all quality-gated before publishing.
- **Technical SEO** — sitemaps, JSON-LD, canonical/hreflang, dynamic OG images.
- **Policy-compliant ads** — consent-gated AdSense slots, never on redirects/dashboard/errors/login.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you use. The app builds and runs with **no**
credentials — persistence, uploads and auth degrade to documented local behavior:

| Variable                                                                 | Purpose                          | Required for                         |
| ------------------------------------------------------------------------ | -------------------------------- | ------------------------------------ |
| `MONGODB_URI`                                                            | MongoDB Atlas connection string  | saved QR codes, dashboard, analytics |
| `AUTH_SECRET`                                                            | Auth.js session secret           | sign-in                              |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`                                  | Google OAuth                     | Google sign-in                       |
| `EMAIL_SERVER` / `EMAIL_FROM`                                            | SMTP for magic links             | email sign-in                        |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | image uploads                    | logo/asset uploads                   |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`                    | rate limiting                    | production rate limits               |
| `GOOGLE_SAFE_BROWSING_API_KEY`                                           | phishing/malware URL checks      | abuse prevention                     |
| `IP_HASH_SALT`                                                           | salt for privacy-safe IP hashing | analytics                            |
| `NEXT_PUBLIC_ADSENSE_CLIENT` (+ `NEXT_PUBLIC_ADSENSE_SLOT_*`)            | AdSense                          | ads (consent-gated)                  |
| `NEXT_PUBLIC_SITE_URL`                                                   | canonical site URL               | SEO, short links                     |

## Scripts

| Script                            | What it does                          |
| --------------------------------- | ------------------------------------- |
| `npm run dev`                     | dev server                            |
| `npm run build`                   | production build                      |
| `npm run lint`                    | ESLint (must be clean)                |
| `npm run typecheck`               | `tsc --noEmit`                        |
| `npm run format` / `format:check` | Prettier write / check                |
| `npm run test`                    | Vitest unit tests                     |
| `npm run test:e2e`                | Playwright end-to-end                 |
| `npm run content:audit`           | content quality gate (build-blocking) |
| `npm run content:publish`         | publish a content wave                |

## Architecture

```
src/
  app/            # App Router: (marketing), (generator), (content), (app)/dashboard,
                  # q/[publicId] (QR page), r/[publicId] (scan redirect), api/
  components/     # ui/ primitives, qr/, seo/, ads/, layout/
  content/        # structured content source (Zod-validated, quality-gated)
  lib/            # qr/, db/, cloudinary/, auth/, seo/, i18n/, security/, analytics/
  models/         # Mongoose models
  config/site.ts  # name, URL, feature flags, ad slot IDs
scripts/          # content-audit.ts, publish tooling
docs/             # AUDIT, DECISIONS, PROGRESS, SEO_PLAYBOOK, ADSENSE, SECURITY, DEPLOY, …
```

Key docs: [`docs/AUDIT.md`](docs/AUDIT.md) (Phase 0 findings), [`docs/DECISIONS.md`](docs/DECISIONS.md)
(decision log), [`docs/PROGRESS.md`](docs/PROGRESS.md) (phase log).

## Content quality

Every published page passes `npm run content:audit`: family minimum word counts, ≤35% 5-word shingle
similarity within a family, unique title/description/H1, ≥5 internal links, 3–6 unique FAQs,
byline + "Last reviewed" date. Failing pages are forced to `noindex` and excluded from the sitemap —
see `docs/CONTENT_AUDIT.md`.

## Contributing

1. Read `docs/AUDIT.md` and `docs/DECISIONS.md` first.
2. TypeScript strict, no `any`; Zod on every API input; server-only code out of client bundles.
3. Never commit secrets; never fabricate statistics, testimonials, laws or standards — every factual
   claim in regional/payment/legal content needs a primary source + "Last reviewed" date.
4. Run `npm run lint && npm run typecheck && npm run test && npm run build` before pushing.
5. Accessibility (WCAG 2.2 AA) and Core Web Vitals budgets are enforced in CI.

## License

Proprietary — all rights reserved. See `LICENSE` if present.
