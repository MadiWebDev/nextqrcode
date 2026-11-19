# Deployment — Resume Builder

## How it ships

Resume Builder is not a separate deployment. It is one site inside the
shared Next.js app (`MadiWebDev/nextqrcode`), served on its own
subdomain by the host routing in `src/proxy.ts`:

- Host `resumebuilder.freeqrcode.tools` → paths rewrite to
  `src/app/resumebuilder-site/*`.
- The subdomain was already attached in DNS/Vercel before the build
  started (Phase 1 audit: the live host returned 200 serving main-site
  HTML because the proxy rule was the only missing piece). No DNS or
  Vercel project changes are needed.
- Merging branch `resumebuilder/build` into `main` and deploying the
  main project (the owner's normal deploy) ships everything: landing,
  `/app`, `/templates`, `/tracker`, `/view`, the 16 SEO pages and
  sitemap section 11.

## Pre-merge checklist

1. All ten phase commits landed in order (see
   `~/workspace/resumebuilder-platform/PROGRESS.md` for the exact
   commit messages and staging manifests).
2. `npx vitest run` green (589/589 at Phase 9), `npx tsc --noEmit`
   clean, production build exit 0.
3. E2E green on chromium + mobile (commands in `README.md`).

## Post-deploy checks (owner, ~5 minutes)

1. Open https://resumebuilder.freeqrcode.tools/ — landing renders with
   the Resume Builder header (not the QR site's).
2. Create a resume in `/app`, download the DOCX, and use PDF (print) →
   Save as PDF once on a real phone and a desktop browser.
3. Submit sitemap section 11 in Google Search Console
   (the index `https://freeqrcode.tools/sitemap.xml` already lists
   `/sitemap/11.xml`; the section lists 18 URLs).
4. Optional: generate PNG PWA icons (192/512) from
   `public/resumebuilder-logo.svg` and upload them via the GitHub web
   UI (binary files cannot travel the text-only push channel); the
   manifest currently references the SVG, which modern browsers
   accept.

## Rollback

The site is additive: reverting the merge (or the phase commits in
reverse order) removes it cleanly. The proxy change is one host rule;
the sitemap change is one section. No database or server state exists
to roll back — all user data lives in visitors' own browsers.
