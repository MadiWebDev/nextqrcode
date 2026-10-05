# Implementation Plan — Phase 0 AdSense-Readiness Blockers

## Project Context (read before writing any code)

- **Stack**: Next.js 16.3.8 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Build command**: `npm run build` (in `d:\My-Projects\NEXT\qrcode\nextapp`)
- **Dev command**: `npm run dev`
- **Lint command**: `npm run lint`
- **No test runner configured** — verification is via build + lint pass
- **Domain placeholder**: `https://qrstudio.app`
- **Author byline**: `codexengr`
- **No new npm packages** — use only what is already in package.json
- **Tailwind v4** — uses `@import "tailwindcss"` in globals.css, NOT a tailwind.config.js. All design tokens are CSS custom properties (oklch values). Do NOT add a tailwind.config.js.
- **Next.js 16.3.8 specifics from docs**: `'use client'` required for useState/useEffect/browser APIs. `metadata` export works only in Server Components (no `'use client'` in the same file). JSON-LD goes in `<script type="application/ld+json">` inside a Server Component.
- **sitemap.ts v16**: `id` in generateSitemaps is now a Promise; not relevant here since we use the simple array form.

## Style Rules (apply to every file)

These are **mandatory** — every page must follow them:

```
Page wrapper:    max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10
Section h2:      text-2xl font-bold mb-4 text-foreground
Section h3:      text-xl font-semibold mb-3 text-foreground
Body text:       text-muted-foreground leading-relaxed
Dates:           <time dateTime="2026-10-05">October 5, 2026</time>
Links:           text-primary hover:underline
```

Every non-home page must export:

```tsx
export const metadata: Metadata = {
  title: '...',
  description: '...',
  alternates: { canonical: 'https://qrstudio.app/...' },
  openGraph: { title: '...', description: '...', url: 'https://qrstudio.app/...' },
};
```

Every non-home page must include a BreadcrumbList JSON-LD `<script>` block (inline in the Server Component JSX, inside a `<script type="application/ld+json">` tag with `dangerouslySetInnerHTML`).

---

## Items

- [ ] 1. Update `src/components/AppHeader.tsx` — convert to client component with full navigation.

  **What**: Add `'use client'` directive. Replace the current minimal nav with: logo (unchanged), a Tools dropdown using `@radix-ui/react-dropdown-menu` (already installed), a Blog link, an About link, a Contact link, a hamburger mobile menu (useState-controlled), and ThemeToggle on the far right. Remove the standalone Info tooltip button — it adds no nav value.

  **Tools dropdown links** (9 items):
  - `/qr-size-calculator` — QR Size Calculator
  - `/wifi-sign-generator` — WiFi Sign Generator
  - `/barcode-generator` — Barcode Generator
  - `/utm-builder` — UTM Builder
  - `/qr-safety-checker` — QR Safety Checker
  - `/medical-id-qr` — Medical ID QR
  - `/pet-tag-qr` — Pet Tag QR
  - `/pakistan-payment-qr` — Pakistan Payment QR
  - `/bulk-vcard-qr` — Bulk vCard QR

  **Mobile menu**: When hamburger is clicked, a full-width panel drops below the header listing all nav links (Tools links flat, then Blog/About/Contact). Use `useState<boolean>` for `mobileOpen`. Close on route change using `usePathname` from `next/navigation`.

  **Styling**: Match existing header (`sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/60`). Dropdown trigger: ghost button with `ChevronDown` icon from lucide-react. Dropdown items: `text-sm` with hover highlight using `DropdownMenuItem` from `@radix-ui/react-dropdown-menu`. Mobile panel: `absolute top-14 left-0 w-full bg-background border-b border-border shadow-lg p-4 space-y-2`. All links use `next/link`.

  **Important**: Because this file now has `'use client'`, it cannot export `metadata`. The file currently has no `metadata` export, so this is fine.

  **Files**: `src/components/AppHeader.tsx`

  **Verify**: `npm run build` — no TypeScript errors. Open dev server and confirm dropdown opens/closes and mobile menu works at 320px viewport.

---

- [ ] 2. Create `src/components/AppFooter.tsx` — full site footer.

  **What**: Server component (no `'use client'`). Four link columns plus a bottom bar.

  **Columns**:
  - **Tools**: QR Size Calculator (`/qr-size-calculator`), WiFi Sign Generator (`/wifi-sign-generator`), Barcode Generator (`/barcode-generator`), UTM Builder (`/utm-builder`), QR Safety Checker (`/qr-safety-checker`), Medical ID QR (`/medical-id-qr`), Pet Tag QR (`/pet-tag-qr`), Pakistan Payment QR (`/pakistan-payment-qr`), Bulk vCard QR (`/bulk-vcard-qr`)
  - **Resources**: Blog (`/blog`), Sitemap (`/sitemap-page`), About (`/about`)
  - **Legal**: Privacy Policy (`/privacy`), Cookie Policy (`/cookie-policy`), Terms of Service (`/terms`), Disclaimer (`/disclaimer`)
  - **Company**: About (`/about`), Contact (`/contact`)

  **Bottom bar**: `© {new Date().getFullYear()} QR Studio by codexengr. All rights reserved.` with links to Privacy and Terms inline.

  **Styling**: `bg-muted/40 border-t border-border mt-10`. Grid: `grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`. Column heading: `text-sm font-semibold text-foreground mb-3`. Links: `text-sm text-muted-foreground hover:text-foreground transition-colors block mb-1.5`. Bottom bar: `border-t border-border py-6 text-center text-xs text-muted-foreground`.

  **Files**: `src/components/AppFooter.tsx`

  **Verify**: `npm run build` — no errors. Footer renders at the bottom of the page after step 13 (layout update) is done.

---

- [ ] 3. Create `src/components/CookieConsent.tsx` — GDPR cookie consent banner.

  **What**: `'use client'` component. Uses `localStorage` key `qrs_cookie_consent` (value `"accepted"` or `"rejected"`). On first visit (no key present), shows a bottom banner. After Accept or Reject, writes the key and hides the banner. "Learn more" links to `/cookie-policy`.

  **Behaviour**:
  - Read localStorage in a `useEffect` (not during render, to avoid SSR mismatch).
  - If consent is already set, render `null`.
  - Banner slides up from the bottom using a CSS `translate-y` transition (Tailwind `transition-transform duration-300`). Use a `mounted` boolean state to trigger the animation after mount.
  - Three buttons: **Accept** (primary, stores `"accepted"`), **Reject** (ghost, stores `"rejected"`), **Learn more** (`<Link href="/cookie-policy">`, opens in same tab).

  **Styling**: `fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-2xl`. Inner: `max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4`. Text: `text-sm text-muted-foreground flex-1`. Buttons in a `flex gap-2 shrink-0` wrapper. Accept: `<Button size="sm">Accept</Button>`. Reject: `<Button variant="ghost" size="sm">Reject</Button>`.

  **Files**: `src/components/CookieConsent.tsx`

  **Verify**: `npm run build` — no errors. Check that banner appears on first load and disappears after clicking Accept.

---

- [ ] 4. Update `src/app/layout.tsx` — wire up AppFooter and CookieConsent.

  **What**: Import `AppFooter` from `@/components/AppFooter` and `CookieConsent` from `@/components/CookieConsent`. Place `<AppFooter />` after `</main>` and inside the `div.min-h-screen` wrapper. Place `<CookieConsent />` inside `<TooltipProvider>` after `<Toaster />`. No other changes.

  **Files**: `src/app/layout.tsx`

  **Verify**: `npm run build` — no errors. Dev server shows footer and cookie banner.

---

- [ ] 5. Rewrite `src/app/about/page.tsx` — 700+ words, codexengr story, FAQ JSON-LD.

  **What**: Server component. Rewrite the page with substantive original content (minimum 700 words total across all prose). Structure:

  - **H1**: "About QR Studio — The Story Behind the Tools"
  - **Section: Who We Are** (~120 words): codexengr is an independent developer and engineer. QR Studio was built because existing tools were either slow, required sign-ups, added watermarks, or sent data to servers. The goal: a genuinely fast, privacy-first, fully client-side QR toolset that professionals can trust.
  - **Section: Our Mission** (~80 words): Every tool on QR Studio processes data entirely in the browser. Nothing you type — not a WiFi password, not medical data, not a payment reference — ever touches a server. The mission is to make powerful QR tools freely accessible without trading privacy for convenience.
  - **Section: The Tech Stack** (~80 words): Built on Next.js 16 App Router with React 19 and TypeScript. Styled with Tailwind CSS v4 and shadcn/ui. QR codes rendered via the `qrcode` library in a Web Worker-ready architecture. No backend, no database, no authentication layer.
  - **Section: What Makes QR Studio Different** (bulleted list, ~100 words): 40+ QR types, full custom styling (dots, eyes, logo), download PNG/SVG/PDF, offline-capable after first load, WCAG 2.2 AA accessible, zero sign-up, zero watermark, zero server-side data handling.
  - **Section: The Author** (~80 words): codexengr is an engineer focused on privacy-respecting developer tools. With experience across frontend systems, payment integrations, and international standards, the focus is on tools that work precisely to spec — including regional payment formats (UPI, Raast, JazzCash, Easypaisa) and accessibility standards.
  - **Section: Why Trust Our Tools** (~80 words): All source code is inspectable in the browser. QR generation uses the well-established open-source `qrcode` npm package. Payment QR formats reference official specifications for each scheme. Medical ID data never leaves the device. There is no analytics collection tied to personal identifiers.
  - **Section: FAQ** (5 Q&As, ~150 words): Is QR Studio really free? / Does QR Studio store my data? / Can I use QR codes commercially? / What QR code size should I print? / Does it work offline?
  - **Section: Get in Touch** (~30 words): link to `/contact`.

  **Metadata**:
  ```tsx
  title: 'About QR Studio — Privacy-First QR Code Tools by codexengr',
  description: 'Learn about QR Studio: a free, privacy-first QR code tool suite built by codexengr. All processing is in your browser — no sign-up, no data collection.',
  alternates: { canonical: 'https://qrstudio.app/about' },
  openGraph: { ... }
  ```

  **JSON-LD**: Two scripts:
  1. `FAQPage` schema with the 5 FAQ items from the FAQ section.
  2. `BreadcrumbList`: Home → About.

  **Files**: `src/app/about/page.tsx`

  **Verify**: `npm run build` — no errors. Word count passes 700 via manual review.

---

- [ ] 6. Rewrite `src/app/contact/page.tsx` — working form, react-hook-form + zod, 400+ words.

  **What**: Split into a Server Component page file (for metadata + JSON-LD) and a `'use client'` form component `src/components/ContactForm.tsx`. The page imports and renders `ContactForm`.

  **ContactForm** (`src/components/ContactForm.tsx`):
  - `'use client'`
  - Schema (zod): `name` (min 2), `email` (valid email), `subject` (min 5), `message` (min 20, max 2000)
  - On submit: `window.location.href = mailto:contact@qrstudio.app?subject=...&body=...` with encoded values (mailto fallback, no server needed). Then call `toast.success('Message sent — we'll reply within 48 hours.')` from `sonner`.
  - Show field-level error messages using `<p className="text-sm text-destructive mt-1">`.
  - Submit button: `<Button type="submit" disabled={isSubmitting}>Send Message</Button>` with a `Loader2` spinner icon when submitting.
  - Form layout: `space-y-5`. Each field: label (`<label className="text-sm font-medium text-foreground">`), input/textarea, error.
  - Textarea for message: `rows={6}`, `resize-y`.

  **Page prose** (400+ words, on the page above the form):
  - H1: "Contact QR Studio"
  - Intro paragraph: what kinds of questions/feedback are welcome (bugs, feature requests, payment spec questions, accessibility reports, general feedback).
  - Section "Response Time": typically within 48 hours on business days.
  - Section "Before You Write": check the FAQ on the About page, check the blog for guides.
  - Section "Direct Email Addresses": table with General / Privacy / Security and their respective `@qrstudio.app` addresses.
  - Section "What to Include": for bug reports — browser, OS, QR type, steps to reproduce. For feature requests — describe the use case, not just the feature.

  **Metadata**:
  ```tsx
  title: 'Contact QR Studio — Bug Reports, Feature Requests & Feedback',
  description: 'Get in touch with the QR Studio team. Report bugs, request features, or ask questions about QR codes, payment specs, or privacy.',
  alternates: { canonical: 'https://qrstudio.app/contact' },
  ```

  **JSON-LD**: BreadcrumbList: Home → Contact.

  **Files**: `src/app/contact/page.tsx`, `src/components/ContactForm.tsx`

  **Verify**: `npm run build` — no TypeScript errors. Form renders, zod validation fires on blur, mailto link fires on submit.

---

- [ ] 7. Rewrite `src/app/privacy/page.tsx` — full GDPR privacy policy with AdSense section.

  **What**: Server component. Full privacy policy. Last updated date: `<time dateTime="2026-10-05">October 5, 2026</time>`.

  **Required sections** (each a `<section>` with an H2):
  1. **Introduction** — who we are, what this policy covers, last updated date.
  2. **Data We Collect** — sub-sections: (a) Data You Enter (none collected — all stays in browser); (b) Analytics Data (anonymous page views, country, device — no personal identifiers, no fingerprinting); (c) Log Data (server logs: IP address, user agent, timestamp — retained max 30 days, used only for security and abuse prevention).
  3. **Cookies and Local Storage** — explain the distinction; list cookies set: (a) Theme preference (localStorage, key `qrs_theme`, expires never, no server); (b) Consent preference (localStorage, key `qrs_cookie_consent`, expires never, no server); (c) Google AdSense cookies (third-party, used to serve relevant advertisements — Google's privacy policy linked). Note: ads are not yet active; this section prepares the policy.
  4. **Google AdSense and Advertising** — explain that we participate in Google AdSense. Google uses cookies to serve ads based on prior visits to this site and other sites. Users can opt out via [Google's Ad Settings](https://adssettings.google.com) or the [NAI opt-out page](https://optout.networkadvertising.org). We do not use interest-based targeting beyond what Google's platform provides. We do not sell personal data.
  5. **How We Use Your Data** — analytics (improve site), log data (security), advertising (fund free tools).
  6. **Data Sharing** — only Google (Analytics/AdSense as a processor). No sale of data. No other third parties.
  7. **Your Rights (GDPR/EEA)** — access, rectification, erasure, restriction, portability, objection, lodge complaint with supervisory authority.
  8. **Data Retention** — log data 30 days, localStorage client-side only (user controls via browser settings).
  9. **Children's Privacy** — not directed at under-13s.
  10. **Changes to This Policy** — how we notify users.
  11. **Contact** — privacy@qrstudio.app.

  **Metadata**:
  ```tsx
  title: 'Privacy Policy — QR Studio',
  description: 'QR Studio privacy policy. Learn how we handle your data, our use of Google AdSense, your GDPR rights, and cookie usage.',
  alternates: { canonical: 'https://qrstudio.app/privacy' },
  ```

  **JSON-LD**: BreadcrumbList: Home → Privacy Policy.

  **Files**: `src/app/privacy/page.tsx`

  **Verify**: `npm run build` — no errors. Page has all 11 sections.

---

- [ ] 8. Create `src/app/cookie-policy/page.tsx` — full GDPR cookie policy with cookie table.

  **What**: Server component. New route at `/cookie-policy`. Last updated: October 5, 2026.

  **Sections**:
  1. **What Are Cookies** — plain-language explanation; distinction between cookies and localStorage.
  2. **Cookies We Use** — HTML table with columns: Name / Type / Purpose / Duration / Provider:
     - `qrs_theme` | Functional | Stores theme preference | Persistent (localStorage) | QR Studio
     - `qrs_cookie_consent` | Functional | Stores cookie consent decision | Persistent (localStorage) | QR Studio
     - `_ga` | Analytics | Google Analytics visitor ID | 2 years | Google
     - `_ga_*` | Analytics | Google Analytics session | 1 year | Google
     - `NID`, `IDE`, `DSID` | Advertising | Google AdSense ad personalisation | 6–13 months | Google
  3. **How to Control Cookies** — per-browser instructions (Chrome, Firefox, Safari, Edge) — each as an H3 with step-by-step. Link to each browser's cookie settings help page.
  4. **Opting Out of Advertising Cookies** — link to [Google Ad Settings](https://adssettings.google.com), [NAI opt-out](https://optout.networkadvertising.org), [DAA opt-out](https://optout.aboutads.info).
  5. **Changes** — how policy changes are communicated.
  6. **Contact** — privacy@qrstudio.app.

  **Table styling**: `w-full text-sm border-collapse`. `<th>`: `text-left font-semibold p-2 border-b border-border`. `<td>`: `p-2 border-b border-border/50 text-muted-foreground`. Wrap in `overflow-x-auto` div.

  **Metadata**:
  ```tsx
  title: 'Cookie Policy — QR Studio',
  description: 'Full cookie policy for QR Studio. Learn which cookies we use, why, and how to control or disable them.',
  alternates: { canonical: 'https://qrstudio.app/cookie-policy' },
  ```

  **JSON-LD**: BreadcrumbList: Home → Cookie Policy.

  **Files**: `src/app/cookie-policy/page.tsx`

  **Verify**: `npm run build` — no errors. Table renders at 320px without overflow.

---

- [ ] 9. Create `src/app/disclaimer/page.tsx` — general disclaimer page.

  **What**: Server component. New route at `/disclaimer`. Last updated: October 5, 2026.

  **Sections**:
  1. **General Disclaimer** — service provided "as is", no warranty of accuracy or fitness for any particular purpose.
  2. **Medical ID Disclaimer** (~100 words) — the Medical ID QR tool is provided for informational convenience only. It is not a substitute for professional medical advice, diagnosis, or treatment. The QR code is not guaranteed to be scanned in an emergency. Users are solely responsible for the accuracy of medical data they encode. We make no representations about how or whether emergency responders will use it.
  3. **Payment QR Disclaimer** (~100 words) — UPI, Raast, JazzCash, and Easypaisa QR codes generated here follow publicly available format specifications. We do not guarantee that all receiving apps will parse every field. Always verify payment amounts and recipients before completing any transaction. We are not affiliated with NPCI, SBP, Jazz, Telenor, or any payment operator.
  4. **No Warranty** — standard limitation of liability clause.
  5. **External Links** — we are not responsible for content or privacy practices of external sites linked from this site.
  6. **Affiliate / Advertising Disclosure** — this site may display Google AdSense advertisements. We do not personally endorse advertised products or services.
  7. **Changes** — disclaimer may be updated; continued use constitutes acceptance.
  8. **Contact** — legal@qrstudio.app.

  **Metadata**:
  ```tsx
  title: 'Disclaimer — QR Studio',
  description: 'Read the QR Studio disclaimer covering medical ID tools, payment QR codes, external links, and advertising.',
  alternates: { canonical: 'https://qrstudio.app/disclaimer' },
  ```

  **JSON-LD**: BreadcrumbList: Home → Disclaimer.

  **Files**: `src/app/disclaimer/page.tsx`

  **Verify**: `npm run build` — no errors.

---

- [ ] 10. Expand `src/app/terms/page.tsx` — 500+ words, comprehensive terms.

  **What**: Rewrite with full terms of service (500+ words). Keep last updated: October 2026 (use `<time dateTime="2026-10-01">`).

  **Sections**:
  1. **Acceptance of Terms** — using the site constitutes acceptance.
  2. **Description of Service** — free browser-based QR toolset; no account required; no data stored server-side.
  3. **Acceptable Use** (~100 words) — permitted uses; prohibited uses (illegal content, malware QR codes, phishing, content violating any applicable law, circumventing rate limits or automated scraping of generated outputs, impersonating others).
  4. **Intellectual Property** (~80 words) — the QR Studio name, logo, site design, and original written content are owned by codexengr. QR codes you generate belong to you. You grant us no rights to your input data.
  5. **Disclaimer of Warranties** — as-is basis; no uptime guarantee; tool availability may change without notice.
  6. **Limitation of Liability** (~80 words) — not liable for direct, indirect, incidental, special, or consequential damages. Not liable for QR code scan failures in emergency situations (see Disclaimer page).
  7. **Third-Party Services** — site may embed Google AdSense ads; Google's terms and privacy policy govern those interactions.
  8. **Governing Law** — laws of Pakistan (Islamabad Capital Territory) without regard to conflict of law provisions. Disputes resolved in the courts of Islamabad.
  9. **Changes to Terms** — we may revise terms at any time; continued use = acceptance.
  10. **Contact** — legal@qrstudio.app.

  **Metadata**:
  ```tsx
  title: 'Terms of Service — QR Studio',
  description: 'QR Studio terms of service. Read our acceptable use policy, intellectual property terms, liability limits, and governing law.',
  alternates: { canonical: 'https://qrstudio.app/terms' },
  ```

  **JSON-LD**: BreadcrumbList: Home → Terms of Service.

  **Files**: `src/app/terms/page.tsx`

  **Verify**: `npm run build` — no errors.

---

- [ ] 11. Create `src/app/sitemap-page/page.tsx` — HTML sitemap listing all pages.

  **What**: Server component. Human-readable HTML sitemap at `/sitemap-page`. Grouped into categories.

  **Categories and links** (use `<ul>` + `<li>` + `<Link>` for each):
  - **Main Pages**: Home (`/`), About (`/about`), Blog (`/blog`), Contact (`/contact`)
  - **Tools**: QR Size Calculator (`/qr-size-calculator`), WiFi Sign Generator (`/wifi-sign-generator`), Barcode Generator (`/barcode-generator`), UTM Builder (`/utm-builder`), QR Safety Checker (`/qr-safety-checker`), Medical ID QR (`/medical-id-qr`), Pet Tag QR (`/pet-tag-qr`), Pakistan Payment QR (`/pakistan-payment-qr`), Bulk vCard QR (`/bulk-vcard-qr`)
  - **QR Code Generators**: URL QR (`/url-qr-code-generator`), WiFi QR (`/wifi-qr-code-generator`), vCard QR (`/vcard-qr-code-generator`), WhatsApp QR (`/whatsapp-qr-code-generator`), UPI QR (`/upi-qr-code-generator`), Bitcoin QR (`/bitcoin-qr-code-generator`)
  - **Legal & Info**: Privacy Policy (`/privacy`), Cookie Policy (`/cookie-policy`), Terms of Service (`/terms`), Disclaimer (`/disclaimer`)

  **Styling**: H1 + category H2s with the standard style rules. Each `<li>`: `<Link className="text-primary hover:underline text-sm">` showing the page title.

  **Metadata**:
  ```tsx
  title: 'Sitemap — QR Studio',
  description: 'Browse all pages and tools on QR Studio.',
  alternates: { canonical: 'https://qrstudio.app/sitemap-page' },
  robots: { index: false, follow: true },  // HTML sitemaps need not be indexed
  ```

  **JSON-LD**: BreadcrumbList: Home → Sitemap.

  **Files**: `src/app/sitemap-page/page.tsx`

  **Verify**: `npm run build` — no errors. All links resolve to real or planned routes.

---

- [ ] 12. Create `public/ads.txt` — Google AdSense placeholder.

  **What**: Create `public/ads.txt` with a comment placeholder so the file exists and is served at `/ads.txt`. Google AdSense requires this file when applying for approval. The actual publisher ID is filled in after AdSense approval.

  **Content**:
  ```
  # ads.txt placeholder — replace with your AdSense publisher line after approval.
  # Format: google.com, pub-XXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
  ```

  **Files**: `public/ads.txt`

  **Verify**: `npm run build` — no errors. File exists at `public/ads.txt`.

---

- [ ] 13. Update `src/app/sitemap.ts` — add all new routes.

  **What**: Add the following URLs to the pages array (existing entries stay unchanged):

  ```ts
  { url: `${base}/cookie-policy`, priority: 0.3 },
  { url: `${base}/disclaimer`, priority: 0.3 },
  { url: `${base}/sitemap-page`, priority: 0.3 },
  // Future tool placeholders (priority 0.8 — pages planned):
  { url: `${base}/qr-size-calculator`, priority: 0.8 },
  { url: `${base}/wifi-sign-generator`, priority: 0.8 },
  { url: `${base}/barcode-generator`, priority: 0.8 },
  { url: `${base}/utm-builder`, priority: 0.8 },
  { url: `${base}/qr-safety-checker`, priority: 0.8 },
  { url: `${base}/medical-id-qr`, priority: 0.8 },
  { url: `${base}/pet-tag-qr`, priority: 0.8 },
  { url: `${base}/pakistan-payment-qr`, priority: 0.8 },
  { url: `${base}/bulk-vcard-qr`, priority: 0.8 },
  ```

  **Files**: `src/app/sitemap.ts`

  **Verify**: `npm run build` — no errors. `npm run dev` then fetch `http://localhost:3000/sitemap.xml` — new URLs appear.

---

- [ ] 14. Update `src/app/robots.ts` — verify ads.txt is not disallowed.

  **What**: The existing `disallow: ['/api/']` is correct. Ads.txt lives in `public/` and is never under `/api/`, so it is already allowed. The only change needed: add explicit `allow: '/ads.txt'` to be unambiguous, and ensure the sitemap URL is still correct.

  **New content**:
  ```ts
  rules: [
    { userAgent: '*', allow: '/', disallow: ['/api/'] },
    { userAgent: 'Mediapartners-Google', allow: '/' },  // allows AdSense crawler
  ],
  sitemap: 'https://qrstudio.app/sitemap.xml',
  ```

  Note: Next.js `MetadataRoute.Robots` accepts `rules` as either a single object or an array; use the array form here.

  **Files**: `src/app/robots.ts`

  **Verify**: `npm run build` — no TypeScript errors. Fetch `http://localhost:3000/robots.txt` and confirm `Mediapartners-Google` rule appears.

---

## Dependency Order

Items must be implemented in this order (each depends on the previous being buildable):

```
1 (AppHeader) → 2 (AppFooter) → 3 (CookieConsent) → 4 (layout.tsx wire-up)
→ 5 (about) → 6 (contact) → 7 (privacy) → 8 (cookie-policy) → 9 (disclaimer)
→ 10 (terms) → 11 (sitemap-page) → 12 (ads.txt) → 13 (sitemap.ts) → 14 (robots.ts)
```

Items 5–11 are independent of each other and can be done in any order after item 4. Items 12–14 are independent of 5–11 and can be done in any order.

## Final Verification

After all 14 items:

```
npm run build
npm run lint
```

Both must pass with zero errors. Then start dev server and manually verify:
- Header dropdown opens with all 9 tool links
- Mobile menu works at 320px
- Footer renders with all four columns
- Cookie banner appears on first load
- `/about` has 700+ words
- `/contact` form validates and fires mailto
- `/privacy`, `/cookie-policy`, `/disclaimer`, `/terms` all render
- `/sitemap-page` lists all pages
- `http://localhost:3000/ads.txt` returns the placeholder file
- `http://localhost:3000/robots.txt` contains the `Mediapartners-Google` rule
- `http://localhost:3000/sitemap.xml` contains all new URLs
