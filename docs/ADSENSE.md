# AdSense Policy & Integration (NextQRCode)

This document is the single source of truth for how advertising is served on
the site. Components live in `src/components/ads/AdSlot.tsx`; the
authorized-sellers declaration is served by `src/app/ads.txt/route.ts`.

## Rendering gates (all must pass)

`AdSlot` renders an ad **only** when every gate passes:

1. `siteConfig.flags.ads` is `true` (feature flag, `src/config/site.ts`).
2. An AdSense client ID is configured — `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
   (also read via `siteConfig.adsense.client`, which additionally honors
   `NEXT_PUBLIC_ADSENSE_CLIENT`).
3. `eligible !== false` — the page-level eligibility prop.
4. Advertising consent is granted — read from the `qrs_cookie_consent`
   localStorage value: `'accepted'` → granted; `'custom:<json>'` → parsed
   and the `advertising` key checked; `'rejected'` or missing → denied.
   Consent is re-checked on the `qrs:consent-changed` window event dispatched
   by the cookie-consent banner.

When any gate fails, the component renders **nothing** — not even an empty
`<div>` — to avoid layout weirdness. When eligible but consent is still
unknown (visitor hasn't answered the banner), reserved fixed-size space is
rendered so a later "accept" does not cause layout shift (zero CLS).

## Eligibility rules (where ads may never appear)

Pass `eligible={false}` (or simply don't mount `AdSlot`) on these surfaces:

- `/r/*` — dynamic QR redirect links. These must stay instant and ad-free;
  ads here also risk invalid-traffic flags from redirect chains.
- `/dashboard` — logged-in account area.
- `/login` and other auth pages.
- Error pages (`not-found`, `error.tsx` boundaries, 500).
- Thin or failing-audit pages — pages with insufficient unique content or
  pages flagged by the quality audit (Phase 5/9 gates).
- Any `noindex` page — no point monetizing unindexed traffic, and AdSense
  policies expect ads on crawlable, policy-compliant content.

Default is eligible; ineligible surfaces are an explicit opt-out at the page
level so a future placement can't leak onto them by accident.

## Placement inventory

Formats supported by `AdSlot` (`format` prop):

| Format        | Reserved space        | AdSense mapping                                      |
| ------------- | --------------------- | ---------------------------------------------------- |
| `leaderboard` | 728×90 responsive     | `data-ad-format="horizontal"`, full-width responsive |
| `rectangle`   | 300×250               | `data-ad-format="rectangle"`                         |
| `in-article`  | fluid, min-height 280 | `data-ad-format="fluid"`, layout `in-article`        |

Every slot shows a visible "Advertisement" label and an `aria-label` for
assistive tech. The AdSense script (`pagead2.googlesyndication.com/...`) is
injected lazily and exactly once per page load; `adsbygoogle.push({})` fires
only when a slot enters the viewport (IntersectionObserver, 200px margin).
Slots below the fold never load the script until scrolled to.

Ad-unit slot IDs are passed via the `slot` prop (`data-ad-slot`). Current
env-mapped slot inventory lives in `siteConfig.adsense`:
`NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`.

## CMP / Consent Mode v2

The custom cookie-consent banner (`src/components/CookieConsent.tsx`) writes
`qrs_cookie_consent` (`'accepted' | 'rejected' | 'custom:<json>'`) to
localStorage and calls `updateGoogleConsent()` (`src/lib/gtag.ts`), which
pushes a Google Consent Mode v2 update (`ad_storage`, `ad_user_data`,
`ad_personalization`, `analytics_storage`) via `gtag('consent', 'update', …)`.
`AdSlot` reads the same stored value, so ad rendering and Consent Mode stay
in sync without a third-party CMP.

**EEA traffic note:** for visitors in the European Economic Area, Google
requires a Google-certified CMP for personalized ads. The custom banner is
fine for non-EEA traffic and for non-personalized ads, but before enabling
**personalized** ads for EEA users, integrate a certified CMP (e.g.
via a TCF 2.2 consent string) and wire its decision into the same
`qrs_cookie_consent` key / `qrs:consent-changed` event — `AdSlot` needs no
changes, only the consent source does.

## ads.txt setup

`GET /ads.txt` (`src/app/ads.txt/route.ts`) serves `text/plain`:

- When `ADSENSE_PUBLISHER_ID` is set:
  `google.com, {ADSENSE_PUBLISHER_ID}, DIRECT, f0cb8b1d365ab739`
- Otherwise a `# …not configured…` comment plus `Disallow: /`, so the file
  is honest rather than silently wrong.

Responses carry `Cache-Control: public, max-age=3600, s-maxage=3600` and the
route uses `revalidate = 3600`. After changing the publisher ID, allow up to
an hour for caches to refresh (or redeploy).

`ADSENSE_PUBLISHER_ID` is a **server-only** env var (no `NEXT_PUBLIC_`
prefix) — it never reaches the client bundle.

> **Conflict note (2026-10-19):** the repo currently also ships a static
> `public/ads.txt`. Next.js serves `public/` files ahead of app routes, so
> that static file shadows this route until it is removed or kept in sync.
> Decide on one source of truth before launch (recommended: the env-driven
> route, so the publisher ID isn't hardcoded in the repo).

## How to enable ads

1. In the AdSense dashboard, copy the publisher ID (`ca-pub-…` → use the
   `pub-…` form for ads.txt; the full `ca-pub-…` for the client ID).
2. Set environment variables:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX`
   - `ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX`
   - Optional slot IDs: `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`,
     `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`.
3. Confirm `siteConfig.flags.ads` is `true` (default).
4. Deploy, then verify:
   - `curl https://<domain>/ads.txt` returns the `google.com, …` line.
   - With consent accepted, an ad slot renders the "Advertisement" label and
     loads `adsbygoogle.js` on scroll into view; with consent rejected, the
     slot renders nothing.
   - Ineligible pages (`/r/*`, `/dashboard`, `/login`, errors, noindex)
     never mount `AdSlot` / pass `eligible={false}`.
