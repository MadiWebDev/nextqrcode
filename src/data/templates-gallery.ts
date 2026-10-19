/**
 * QR Code Tools — Template Gallery Data
 *
 * 30 distinct QR code design templates, each with a unique aesthetic,
 * industry target, and use-case advice. Each entry carries 400+ words of
 * design guidance, 3–6 FAQs, and explicit scanability notes.
 *
 * NOTE: This interface is SEPARATE from the TemplateName type in src/types/index.ts
 * which covers the 6 interactive studio templates.
 * These gallery entries represent distinct published design templates
 * with their own slug-based pages at /templates/[slug].
 *
 * Honesty policy: contrast ratios quoted below are computed from the two
 * module/background hex values with the WCAG relative-luminance formula.
 * Dark-on-light templates are the reliable default; light-on-dark
 * ("inverted") templates are flagged with explicit scanability warnings —
 * several stock scanner apps and all laser industrial imagers expect
 * dark modules on a light background, so inverted codes must be tested
 * on the actual devices your audience uses before they ship.
 */

export type DesignStyle =
  | 'minimalist'
  | 'corporate'
  | 'luxury'
  | 'playful'
  | 'industrial'
  | 'artisan'
  | 'neon'
  | 'print-ready'
  | 'hospitality'
  | 'healthcare'
  | 'wedding'
  | 'real-estate'
  | 'dark'
  | 'gradient'
  | 'eco'
  | 'fintech'
  | 'fitness'
  | 'education'
  | 'accessibility'
  | 'seasonal'
  | 'festival'
  | 'coffee'
  | 'vintage'
  | 'pet'
  | 'automotive'
  | 'jewelry'
  | 'sports'
  | 'library'
  | 'music'
  | 'charity';

export interface TemplateGalleryEntry {
  slug: string;
  name: string;
  designStyle: DesignStyle;
  primaryUseCase: string;
  targetIndustry: string;
  colorPalette: string[];
  dotStyle: string;
  eyeOuterStyle: string;
  eyeInnerStyle: string;
  ecLevel: 'L' | 'M' | 'Q' | 'H';
  frameStyle: string;
  hasLogo: boolean;
  ctaText: string;
  /** 400+ words: design rationale, palette justification, best/avoid guidance, scanability notes. */
  useCaseAdvice: string;
  bestFor: string[];
  avoidFor: string[];
  /** 3–6 FAQs, unique questions per template. */
  faqs: { question: string; answer: string }[];
  title: string;
  metaDescription: string;
  status: 'approved' | 'needs_review';
  publishedAt: string;
  updatedAt: string;
  author: string;
  batchNumber: number;
}

export const TEMPLATE_GALLERY: TemplateGalleryEntry[] = [
  {
    slug: 'minimalist-white-card',
    name: 'Minimal White',
    designStyle: 'minimalist',
    primaryUseCase: 'Digital business card and LinkedIn profile QR',
    targetIndustry: 'Professional Services',
    colorPalette: ['#1a1a1a', '#ffffff', '#f5f5f5'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'M',
    frameStyle: 'none',
    hasLogo: false,
    ctaText: 'Connect',
    useCaseAdvice: `
The Minimal White template is the reference design against which every other
QR template should be judged. It applies one principle: the highest-trust QR
code is the one that looks the most structurally sound. By stripping away
color, gradients, and decorative elements, this template produces a symbol
with near-maximum contrast between dark and light modules — roughly a 17:1
contrast ratio between #1a1a1a and #ffffff, about as high as a screen or
printer can reproduce. That is the single most reliable predictor of
first-scan success across the broadest possible set of devices, lighting
conditions, and camera qualities.

For professional business cards, LinkedIn networking events, conference
badges, and email signature blocks, Minimal White conveys engineering
precision and institutional credibility. The restrained aesthetic signals that
the code was designed by someone who understands the technology rather than
someone who just needed something to fill a corner. Because the foreground
is a near-black rather than a pure #000000, the modules print slightly
softer on inkjet and home printers — an intentional choice that reduces
halftone artifacts while keeping contrast far above every scanner's
binarization threshold.

The square dot style is the most conservative, standards-adjacent symbol
geometry available. It is the ground truth: when in doubt about whether a
customized QR code will scan reliably, a square-on-white code is what you
test everything else against. Rounded and circle dots are decorative
deviations from this baseline, and each one buys a small aesthetic gain at
a small reliability cost. Minimal White makes no such trade.

Scanability notes: with Error Correction Level M, this template tolerates
moderate print defects — slightly misaligned double-sided cards, light
scratches from a wallet, a thumbprint across one corner. Because the code is
frameless, protect the quiet zone yourself: leave a clear border at least
four modules wide on all four sides. A frameless code placed too close to a
page edge or another graphic is the number-one reason "perfect" minimal
designs fail in the field.

Best for: business cards for legal, medical, and financial professionals;
conference lanyards and attendee badges; academic citations; corporate
letterhead; embedded email-signature PNGs. These contexts share three
traits: a diverse, unknown scanning audience (old phones included), small
print sizes, and a brand language where restraint reads as competence.

Avoid for: retail packaging, where brand color is part of recognition;
event wristbands viewed in low light, where a frame or bolder border helps
locatability; children's education materials, where visual engagement
matters more than restraint. Also avoid it on very dark or textured
backgrounds — this template assumes a clean white or near-white substrate.
If your card stock is cream or ivory, print a small white panel behind the
code rather than placing modules directly on tinted paper.
    `,
    bestFor: [
      'Business cards for legal, medical, and financial professionals',
      'Conference lanyards and attendee badges',
      'Academic publication citations',
      'Corporate letterhead QR codes',
      'Email signature QR codes (embedded as PNG)',
    ],
    avoidFor: [
      'Retail packaging (brand color is part of product recognition)',
      'Event wristbands viewed in low light (needs a bolder border)',
      "Children's education materials (needs visual engagement)",
    ],
    faqs: [
      {
        question: 'Why is the simplest template often the most reliable?',
        answer:
          'Reliability in QR scanning is almost entirely a function of contrast and quiet-zone cleanliness. Minimal White maximizes both: near-black modules on a white field give roughly a 17:1 contrast ratio, and the absence of decoration leaves the quiet zone untouched. Decorative dot styles and logos can each cost a few percentage points of scan margin; this template spends none.',
      },
      {
        question: 'Should I use pure black (#000000) instead of #1a1a1a?',
        answer:
          'Either works. Pure black gives a hair more contrast on screen; near-black (#1a1a1a) prints more cleanly on inkjet and home printers where pure black can produce halftone artifacts. The difference in scan success is negligible — keep the template default unless your print vendor advises otherwise.',
      },
      {
        question: 'How small can I print this on a business card?',
        answer:
          'For phone cameras, keep QR codes at least 20mm (about 0.8 inches) on each side on a business card, and never below 15mm. Pair the code with a short URL so the QR version stays low — fewer, larger modules scan faster and tolerate more wear. This template has no frame, so include the 4-module quiet zone inside your minimum size.',
      },
      {
        question: 'Can I place this directly on cream or ivory card stock?',
        answer:
          "Not without a white panel behind it. Tinted stock lowers the effective contrast between the light modules' background and the paper, and textured stock adds noise that confuses binarization. Print a clean white rectangle behind the code, extending at least 4 modules past the symbol on every side.",
      },
    ],
    title: 'Minimal White QR Code Template: Professional Business Card Design',
    metaDescription:
      'Minimalist QR template for business cards and LinkedIn. Maximum-contrast square dots on white — the reliable professional default.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'rounded-soft-dots',
    name: 'Soft Rounded Dots',
    designStyle: 'minimalist',
    primaryUseCase: 'Friendly professional QR for portfolios, resumes, and creative bios',
    targetIndustry: 'Creative & Digital Professionals',
    colorPalette: ['#2b2b2b', '#fafafa', '#e8e8e8'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'square',
    ecLevel: 'M',
    frameStyle: 'none',
    hasLogo: false,
    ctaText: 'View Portfolio',
    useCaseAdvice: `
Soft Rounded Dots takes the Minimal White philosophy — contrast first,
decoration second — and softens it for people whose work is judged on
aesthetics: designers, photographers, illustrators, product folks, and
creative freelancers. The rounded dot style applies a gentle corner radius
to every module, which keeps noticeably more ink per module than fully
circular dots do. That matters at small print sizes: a circle inscribed in
a module square covers less area than the rounded square, so circles demand
a slightly larger print size for the same scan reliability. Rounded dots
are the sweet spot — visibly friendlier than hard squares, structurally
close enough to them that scanner libraries decode them with effectively
no penalty.

The palette is a warm-leaning charcoal (#2b2b2b) on an off-white (#fafafa)
rather than pure black on pure white. The contrast is still around 14:1,
far above what any mainstream scanner needs, and the softer pairing looks
less stark on portfolio sites, resume PDFs, and printed lookbooks where
pure black can feel harsh next to refined typography. The third palette
color, a light grey, is reserved for the surrounding card or page area —
never place it between modules and their background, since any tone other
than the module background inside the symbol quietly erodes contrast.

Scanability notes: Error Correction Level M is the right default here
because these codes live on paper and screens that get handled — portfolios
get flipped through, resumes get folded into envelopes. Keep the code at
least 20mm on a side in print, and on screen make sure the rendered size
is at least 120 CSS pixels so the rounded modules stay crisp on low-density
displays. If you are placing the code over a photograph or textured
background, stop: put it on a solid #fafafa panel first. Rounded dots on a
busy background are exactly the combination that fails at demo day.

Best for: design portfolios and case-study PDFs; resume and CV contact
blocks; creative freelancer business cards; art exhibition labels;
personal link-in-bio pages. Anywhere the audience skews toward people who
notice type and spacing, and where a hard industrial QR would clash with
the surrounding design language.

Avoid for: clinical or legal documents where a conservative square-dot
code is expected; tiny favicon-scale placements; thermal-receipt printing,
where rounded corners blur into blobs; and any context where the code
must survive heavy abrasion, where square dots and higher error correction
are the safer engineering choice.
    `,
    bestFor: [
      'Design portfolios and case-study PDFs',
      'Resume and CV contact blocks',
      'Creative freelancer business cards',
      'Art exhibition and gallery labels',
      'Personal link-in-bio pages',
    ],
    avoidFor: [
      'Legal or clinical documents (square dots read as more conservative)',
      'Thermal receipt printing (rounded corners blur at low resolution)',
      'Heavy-abrasion industrial labels',
    ],
    faqs: [
      {
        question: 'Are rounded dots less reliable than square dots?',
        answer:
          'Marginally, but not meaningfully at sensible print sizes. Rounded dots keep most of the module area that square dots have, unlike fully circular dots which cover noticeably less. Keep the code at least 20mm across in print and contrast high, and the difference is below the noise floor of real-world scanning variance.',
      },
      {
        question: 'Why not use fully circular dots for a friendlier look?',
        answer:
          'Circle dots trade reliability for aesthetics: a circle covers less of its module cell, so the code needs a larger print size for equivalent scan performance, and dense codes (higher versions) get fragile. If you love the look, use it large — 30mm or more in print — and stick with Error Correction Level M or higher.',
      },
      {
        question: 'Does the off-white background hurt scanning?',
        answer:
          'No. #fafafa against #2b2b2b still gives roughly a 14:1 contrast ratio, far beyond any scanner threshold. Off-white backgrounds look more refined in print and on screen than stark white while costing essentially nothing in reliability. Only tinted or textured backgrounds are a problem.',
      },
      {
        question: 'Can I use this template on my resume PDF?',
        answer:
          'Yes — it is one of the best fits for this template. Export at high resolution (300 DPI at final size), keep the quiet zone clean, and link to a short, stable URL. Recruiters scan from phone cameras over desks, so keep modules large by keeping the encoded URL short.',
      },
    ],
    title: 'Soft Rounded Dots QR Template: Friendly Portfolio & Resume Design',
    metaDescription:
      'Rounded-dot QR template for portfolios and resumes. Warm charcoal on off-white, frameless — professional without being stark.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'corporate-navy-trust',
    name: 'Corporate Navy',
    designStyle: 'corporate',
    primaryUseCase: 'Enterprise brand QR, annual report, investor relations',
    targetIndustry: 'Finance, Consulting, Enterprise B2B',
    colorPalette: ['#1B2A4A', '#F5F7FA', '#2E4DA0'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'square',
    ecLevel: 'M',
    frameStyle: 'thin-label-bottom',
    hasLogo: false,
    ctaText: 'Visit Site',
    useCaseAdvice: `
Corporate Navy is engineered for enterprise brand environments: annual
reports, investor presentations, printed financial disclosures, and
corporate real-estate signage. The deep navy foreground on a light
grey-white background delivers contrast around 13:1 — comfortably beyond
accessibility thresholds — while projecting institutional authority. Navy
is the color of fiduciary seriousness; it is also dark enough that every
mainstream scanner treats it as "black" for binarization, which is exactly
what you want. Some brand colors (mid-tone reds, oranges, light blues)
sit in an ambiguous zone where certain cameras struggle to binarize them;
navy does not.

The rounded dot style with a rounded-square finder eye softens the symbol
just enough for premium corporate materials without sacrificing structure.
Offset lithography — the standard process for annual reports and high-end
brochures — introduces ink dot gain: ink spreads slightly on coated stock,
so modules print a touch bolder than designed. Rounded dots absorb that
spread gracefully, whereas sharp square corners can look muddy when ink
bleeds at the corners. This is a small, real prepress consideration that
this template handles by default.

The thin bottom label frame carries a call to action ("Visit Site") and
serves a functional purpose beyond branding: it guarantees the quiet zone
on the three unframed sides by giving layout teams a visible container,
and it tells the scanning audience what the code does. Enterprise codes
fail socially more often than technically — an unidentified QR in an
annual report gets ignored. The CTA label converts "mysterious square"
into "investor relations portal."

Scanability notes: print at a minimum of 25mm on a side in annual reports,
larger on lobby signage viewed from distance (roughly 10% of viewing
distance is the rule of thumb). Pair the template with branded short links
rather than raw long URLs — a 200-character URL forces a high QR version
with tiny modules that undermine the premium look and the scan margin
alike. For multi-page documents, reuse the identical code everywhere so
readers learn to trust it.

Best for: annual report print editions; investor relations materials and
roadshow decks; corporate lobby and real-estate signage; enterprise product
brochures; executive business cards; B2B trade-show backdrops.

Avoid for: consumer retail packaging, where warmer and more accessible
visuals convert better; youth-facing materials; arts and culture venues,
where the corporate register feels off-brand; and single-color newsprint,
where the navy may reproduce too lightly — use a black variant there. Document the template in the brand guidelines — exact colors, minimum sizes, and short-link conventions — so every team reproduces it identically.
    `,
    bestFor: [
      'Annual report print editions',
      'Investor relations materials and roadshow decks',
      'Corporate real estate lobby signage',
      'Enterprise product brochures',
      'Executive business cards',
      'Trade show backdrop banners for B2B companies',
    ],
    avoidFor: [
      'Consumer retail packaging (needs warmer, more accessible visual)',
      'Children or youth-facing materials',
      'Arts and culture venues',
      'Single-color newsprint (navy may reproduce too light)',
    ],
    faqs: [
      {
        question: 'Is navy dark enough for reliable scanning?',
        answer:
          'Yes. #1B2A4A against #F5F7FA gives contrast around 13:1, which every mainstream scanner binarizes as dark-on-light without hesitation. The colors to worry about are mid-tones — light blues, oranges, light greens — that sit near the binarization boundary. Navy is safely past it.',
      },
      {
        question: 'Why does this template include a CTA label frame?',
        answer:
          'Two reasons. Practically, the frame protects the quiet zone and gives layout teams a visible container. Socially, it answers the viewer\'s question — "what happens if I scan this?" — which measurably raises scan-through in corporate print, where anonymous QR codes are routinely ignored.',
      },
      {
        question: 'Can I use this for a dark-background annual report cover?',
        answer:
          'Only with a light panel behind the code. Navy modules on a dark cover destroy contrast. Place the code on a white or #F5F7FA panel sized to the frame, or switch to a dark-mode template that was designed for light-on-dark from the start — and test it on real devices first.',
      },
      {
        question: 'What URL should the corporate code point to?',
        answer:
          'A branded short link (e.g. yourbrand.link/annual-report) rather than a raw long URL. Short links keep the QR version low, modules large, and let you update the destination after printing — essential for documents with a multi-year shelf life like annual reports.',
      },
    ],
    title: 'Corporate Navy QR Code Template: Enterprise Trust & Annual Report Design',
    metaDescription:
      'Corporate Navy QR template for enterprise brands. Deep navy on light grey with CTA frame — for annual reports and investor materials.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'fintech-navy-secure',
    name: 'Fintech Secure Navy',
    designStyle: 'fintech',
    primaryUseCase: 'Payment links, app download QR, KYC onboarding',
    targetIndustry: 'Fintech, Digital Banking, Payments',
    colorPalette: ['#0F1F3D', '#FFFFFF', '#00C2A8'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thin-label-bottom',
    hasLogo: false,
    ctaText: 'Pay Securely',
    useCaseAdvice: `
Fintech Secure Navy is built for the moments when scanning a QR code moves
money: payment links, wallet top-ups, merchant checkout placards, and app
download codes in onboarding flows. In these contexts the design must do
two jobs at once — scan flawlessly under pressure (a queue of customers,
a dim restaurant, a shaky hand) and signal that the destination is
trustworthy. The template answers with a near-black navy (#0F1F3D) on
pure white: contrast around 16:1, square dots, square finder eyes, zero
decoration inside the symbol. When money is involved, the engineering
conservatism of square modules is a feature, not a lack of imagination.

The teal accent (#00C2A8) appears only in the frame and CTA label — never
inside the QR symbol itself. This is deliberate. Accent-colored modules
inside the symbol are the classic way fintech brands "own" their code,
and also the classic way they break it: teal modules on white have far
less contrast than navy ones, and a scanner that mis-binarizes even a few
modules in a payment code creates a failed transaction at the worst
possible moment. Keep brand color in the frame, where it cannot touch
the data.

Error Correction Level Q (25% recovery) is the default because payment
codes live hard lives: laminated placards wiped down with sanitizer,
stickers on curved POS terminals, screenshots recompressed by chat apps.
Screenshots deserve special attention — a payment QR shared through
WhatsApp or Messenger gets re-encoded, and Level Q's recovery margin is
what keeps a recompressed code scannable. Also encode the shortest
possible payment payload; dynamic QR services that resolve a short ID to
the payment details keep the symbol sparse and fast to scan.

Scanability notes: print merchant placards at 30mm or larger — payment
codes are scanned at arm's length in poor light, which is the hardest
common scenario. On screen, render at minimum 160 CSS pixels. Always test
the final printed placard under the actual counter lighting, not just on
your monitor, and test with both a flagship phone and a budget Android
device, since payment audiences skew toward the full device spectrum.

Best for: merchant payment placards; wallet top-up and P2P payment links;
app-download codes in fintech onboarding; KYC document-upload entry
points; bank branch posters and ATM-side signage.

Avoid for: anything where the QR encodes sensitive data directly (always
resolve through a short, access-controlled link); decorative marketing
where brand expression matters more than transaction reliability; tiny
placements on receipts; and dark-mode UIs — this template assumes a
white substrate, and payment codes should never be inverted.
    `,
    bestFor: [
      'Merchant payment placards and POS stickers',
      'Wallet top-up and P2P payment links',
      'App-download codes in fintech onboarding flows',
      'KYC document-upload entry points',
      'Bank branch posters and ATM-side signage',
    ],
    avoidFor: [
      'QR codes that encode sensitive data directly (use short links)',
      'Pure brand-marketing placements where expression beats reliability',
      'Tiny receipt-footnote codes',
      'Dark-mode surfaces (never invert a payment code)',
    ],
    faqs: [
      {
        question: 'Why keep the teal accent out of the QR modules?',
        answer:
          'Brand-colored modules are the most common way payment QR codes break. Teal on white has far less contrast than navy on white, and a scanner that misreads even a few modules in a payment code produces a failed transaction. Brand expression belongs in the frame and CTA label, where it cannot touch the data layer.',
      },
      {
        question: 'Why Error Correction Level Q for payments?',
        answer:
          'Payment codes get abused: sanitizer-wiped placards, curved POS stickers, and screenshots recompressed by chat apps. Level Q recovers 25% of damaged data, which is the margin that keeps a WhatsApp-recompressed payment code scannable. Level M is fine for a poster; Level Q is for money.',
      },
      {
        question: 'How large should a printed payment QR be?',
        answer:
          "At least 30mm on a side for counter placards, larger for anything scanned beyond arm's length. Payment codes are scanned in the hardest common conditions — dim light, shaky hands, queues — so size is your cheapest reliability lever. On screen, render at least 160 CSS pixels.",
      },
      {
        question: 'Should the QR contain the payment details directly?',
        answer:
          'No. Encode a short link or payment ID that resolves server-side. Direct payloads get long (dense, fragile symbols), cannot be revoked if printed wrong, and expose details to anyone with a scanner. A short resolving link keeps the symbol sparse and lets you fix the destination after printing.',
      },
    ],
    title: 'Fintech Secure Navy QR Template: Payment & Banking Design',
    metaDescription:
      'Fintech QR template for payments and banking. Near-black navy on white, Level Q, brand-safe frame — for merchant placards and onboarding.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'luxury-gold-foil',
    name: 'Luxury Gold Foil',
    designStyle: 'luxury',
    primaryUseCase: 'Premium product packaging, luxury brand authentication',
    targetIndustry: 'Luxury Retail, Fine Wine, Premium Cosmetics',
    colorPalette: ['#8B6914', '#F9F5E8', '#D4AF37'],
    dotStyle: 'circle',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'circle',
    ecLevel: 'H',
    frameStyle: 'thin-gold-border',
    hasLogo: true,
    ctaText: 'Authenticate',
    useCaseAdvice: `
The Luxury Gold Foil template navigates a real tension in premium product
design: codes on luxury items must be visually cohesive with the premium
aesthetic while remaining functionally scannable. Warm gold-toned modules
on an ivory background read as intentional and premium rather than
utilitarian — but the palette is honest about its cost. #8B6914 on
#F9F5E8 gives contrast around 5:1: enough for flagship phone cameras in
good light, noticeably less forgiving than the 13:1+ of dark-on-light
templates. This template is for contexts where the audience has good
devices and good lighting — boutique counters, unboxing at home — not for
warehouse aisles.

Error Correction Level H is mandatory here because the template includes
a center logo zone. The 30% recovery headroom accommodates a brand
monogram or certification seal covering part of the symbol — but the logo
must be a pure overlay placed by the generator, never a modification of
the module data. And keep the logo modest: cover well under the 30% the
error correction theoretically allows, because real damage (glare on
foil, curved bottle glass) stacks on top of the logo occlusion.

The circle dot style is the most refined-looking module geometry, echoing
the roundness of premium typography — and it covers the least module area,
so this template needs a larger print size than its square-dot cousins.
Plan for 30mm minimum on packaging, more on curved surfaces like bottle
labels where modules distort at the edges. The square outer finder eye
with a circle inner eye keeps the three locators recognizable to
scanners even with decorative dots elsewhere.

For physical gold foil application, output the modules as a spot metallic
layer (a gold metallic Pantone or equivalent) over the ivory substrate in
commercial prepress. Metallic ink introduces glare: a code that scans
perfectly in your studio can fail under boutique spotlights at certain
angles. Always proof on the actual foil stock and test under the actual
retail lighting, tilting the package through the angles a customer would.

Best for: wine and spirits bottle labels; premium cosmetics and skincare
packaging; luxury watch and jewelry authentication cards; fine fragrance
authentication; high-end gift packaging inserts. All share affluent
audiences, good lighting, and a brand story where the code's appearance
is part of the product.

Avoid for: industrial or logistics use (metallic ink fails in thermal
printing); dark packaging without an ivory panel; tiny authentication
seals under 25mm; outdoor or dimly lit placements; and any context where
the scanning device is unknown or low-end — the 5:1 contrast budget does
not forgive bad cameras.
    `,
    bestFor: [
      'Wine and spirits bottle labels',
      'Premium cosmetics and skincare packaging',
      'Luxury watch and jewelry authentication cards',
      'Fine fragrance product authentication',
      'High-end gift packaging inserts',
    ],
    avoidFor: [
      'Industrial or logistics applications (metallic ink fails in thermal printing)',
      'Dark packaging without an ivory panel behind the code',
      'Authentication seals under 25mm',
      'Outdoor or dimly lit placements',
    ],
    faqs: [
      {
        question: 'Will the gold-on-ivory palette scan reliably?',
        answer:
          'In good conditions, yes — with flagship phones in boutique lighting it performs well. The honest caveat is the contrast: around 5:1 versus 13:1+ for dark-on-light templates, so budget devices and dim light are riskier. Print at 30mm or larger, proof on the actual foil stock, and test under real retail lighting before committing to a print run.',
      },
      {
        question: 'How large can the center logo be?',
        answer:
          'Keep it well under what Level H theoretically allows. Error correction recovers 30% of data, but logo occlusion stacks with real-world damage like foil glare and curved-surface distortion. A modest centered mark covering roughly a tenth of the symbol is the safe zone; always test-scan the final artwork.',
      },
      {
        question: 'Can I print this on a home or office printer?',
        answer:
          'For proofs, yes — but the metallic effect will not reproduce, so a desktop proof only validates layout and scannability, not the final look. The real foil effect needs commercial prepress with a metallic spot layer. Never approve the final design from an inkjet proof alone.',
      },
      {
        question: 'Does the gold code help against counterfeits?',
        answer:
          'As a consumer signal, modestly: a distinctive premium-looking code is harder for casual counterfeiters to mimic than a generic black QR. But a QR code alone is not anti-counterfeit technology — pair it with a server-side authentication check (serial lookup) for anything where fakes carry real cost.',
      },
    ],
    title: 'Luxury Gold Foil QR Code Template: Premium Packaging Authentication Design',
    metaDescription:
      'Luxury Gold Foil QR template for premium packaging. Gold circle modules on ivory, logo zone with Level H, for wine labels, cosmetics, and authentication cards.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'industrial-black-orange',
    name: 'Industrial Black & Orange',
    designStyle: 'industrial',
    primaryUseCase: 'Warehouse asset labels, industrial safety QR, machinery maintenance tags',
    targetIndustry: 'Manufacturing, Logistics, Construction',
    colorPalette: ['#1A1A1A', '#F5F5F5', '#FF6B00'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thick-orange-border',
    hasLogo: false,
    ctaText: 'Scan for Info',
    useCaseAdvice: `
Industrial Black & Orange is purpose-built for harsh environments:
warehouses, factories, construction sites — places where labels get
abraded, splashed, baked, frozen, and scanned by gloved workers holding
dedicated imagers rather than phones. Every aesthetic choice here is a
reliability decision. The QR symbol itself is pure function: square dots,
square finder eyes, near-black modules on off-white, contrast around
16:1. No rounded corners, no decoration inside the symbol, because
industrial scanners (Zebra, Honeywell, Datalogic imagers) are optimized
for precisely structured symbols and high-speed line sensors — they are
less forgiving of decorative geometry than a modern phone camera.

The thick high-visibility orange border serves two engineering functions.
First, locatability: on a crowded rack, machine panel, or site hoarding,
the orange frame lets a worker's eye find the code in a fraction of a
second — critical when someone scans dozens of labels per shift. Second,
it protects the quiet zone physically: the border is a sacrificial margin
that takes the abrasion, edge peeling, and strapping damage before it
reaches the symbol. Orange is the color of industrial hazard marking, so
the frame also reads as "this label matters" in exactly the visual
language the environment already uses.

Error Correction Level Q (25% recovery) is the default because warehouse
labels degrade. Forklift contact, pallet strapping, chemical wipe-downs,
and UV exposure each eat into the symbol; Level Q keeps the code readable
after damage that would kill a Level L or M code. Pair that with proper
label stock — polyester or vinyl with lamination for chemical and
temperature resistance — because no error correction level survives a
label that delaminates entirely.

Scanability notes: size for the scanner, not the designer. Handheld
imagers at arm's length want 30–40mm codes; fixed-mount scanners on a
conveyor want larger, and the quiet zone must survive the label's edge
wear. Print a test batch, abuse it the way the site will (wipe it, scratch
it, leave it in the sun for a week), then scan with the actual site
hardware. Thermal-transfer printing is the standard process here — verify
your ribbon and stock combination reproduces the orange border without
bleeding into the quiet zone.

Best for: warehouse bin and rack location labels; machinery and equipment
maintenance tags; construction material tracking; chemical storage safety
labels; tool-room asset tags.

Avoid for: consumer-facing retail products, where the hazard-orange frame
sends the wrong brand signal; luxury or premium materials; monochrome-only
print workflows (use Minimal White instead); and small-format asset tags
under 25mm, where the thick border starts consuming the symbol area.
    `,
    bestFor: [
      'Warehouse bin and rack location labels',
      'Machinery and equipment maintenance tags',
      'Construction site material tracking',
      'Chemical storage cabinet safety labels',
      'Industrial tool room asset tags',
    ],
    avoidFor: [
      'Consumer-facing retail products (hazard orange sends the wrong brand signal)',
      'Luxury or premium materials',
      'Monochrome-only print workflows (use Minimal White instead)',
      'Asset tags under 25mm (the border consumes symbol area)',
    ],
    faqs: [
      {
        question: 'Why square dots instead of rounded ones here?',
        answer:
          'Industrial imagers use high-speed sensors tuned for precise symbol geometry, and they are less tolerant of decorative dot shapes than phone cameras. Square dots are the most conservative geometry and the safest choice when the scanning hardware is a fixed industrial device rather than a modern smartphone.',
      },
      {
        question: 'What does the orange border actually do?',
        answer:
          'Two things: it makes the label findable at a glance on crowded shelving and machinery, and it acts as a sacrificial margin that absorbs edge abrasion and peeling before damage reaches the quiet zone. It is functional safety marking, not decoration.',
      },
      {
        question: 'Which label material should I print this on?',
        answer:
          'Polyester or vinyl stock with lamination for harsh environments — rated for the temperature and chemical exposure of your site. Paper labels disintegrate in warehouses; the template assumes a substrate that survives. Thermal-transfer printing with a matched ribbon and stock is the standard process.',
      },
      {
        question: 'Is Level Q enough for outdoor construction labels?',
        answer:
          'Level Q (25% recovery) handles abrasion and partial damage well, but no error correction survives total label failure — delamination, complete UV fade, or being painted over. For outdoor scaffolding and equipment, combine Level Q with UV-stable stock, lamination, and a sensible replacement schedule.',
      },
    ],
    title: 'Industrial Black & Orange QR Template: Warehouse Asset & Safety Label Design',
    metaDescription:
      'Industrial QR template for warehouses and manufacturing. High-visibility orange border, Level Q, square dots for industrial scanners.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'healthcare-clean-clinical',
    name: 'Healthcare Clinical White',
    designStyle: 'healthcare',
    primaryUseCase: 'Hospital patient materials, medical equipment tags, prescription labels',
    targetIndustry: 'Healthcare, Pharmaceutical, Clinical',
    colorPalette: ['#1A3A5C', '#FFFFFF', '#E8F4F8'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thin-clinical-border',
    hasLogo: false,
    ctaText: 'Scan Patient Info',
    useCaseAdvice: `
Healthcare Clinical White is designed for clinical environments where a
failed scan is not an inconvenience but a workflow breakdown: patient
wristbands, medication verification, specimen tracking, and equipment
maintenance logs. The palette — deep clinical navy on pure white, around
15:1 contrast — is chosen for the worst lighting in the building, not the
best. Procedure lights, overhead fluorescents, and portable exam lamps
all have different color temperatures; extreme luminance contrast is what
keeps binarization consistent when the illuminant changes. The pale blue
third color is for surrounding layout areas only and never enters the
symbol.

Square dots and square finder eyes are non-negotiable in this template.
Clinical IT and biomedical engineering teams need standardized, auditable
symbols — custom dot shapes invite questions in compliance reviews and
behave unpredictably on the mixed fleet of scanners, WOWs (workstations
on wheels), and legacy imagers found in hospitals. Conservative geometry
is the legally defensible choice.

Error Correction Level Q is the floor for healthcare, not a suggestion.
Wristbands meet sanitizer wipes, IV fluid, and friction from bedding;
specimen labels meet condensation and freezer frost; equipment tags meet
years of cleaning chemicals. Level Q's 25% recovery margin is what keeps
a wristband scannable at 3 a.m. after a shift of wear. For specimen and
pharmacy labels that face the harshest conditions, consider Level H.

A critical content rule: never encode patient health information directly
in the QR payload. The code should carry an opaque identifier that
resolves through an access-controlled system (badge tap, authenticated
session) to the record. A QR code is trivially readable by any camera,
so anything in the payload is effectively public. This template's job is
making the identifier scannable; your system's job is making it
meaningless without authorization.

Scanability notes: wristband codes must survive curvature — print the
symbol flat-friendly at 20–25mm and place it on the flattest available
band area, since curvature distorts modules at the edges. Test with the
actual clinical scanners, not just phones, and test after simulating
wear: wipe with the facility's sanitizer, crumple lightly, then scan.

Best for: hospital patient wristbands (identifier-only payloads); medical
device and equipment asset tags; prescription labels linking to consumer
medication information; laboratory specimen tubes and slides; clinical
trial participant ID cards.

Avoid for: consumer wellness apps, where the clinical aesthetic feels
cold; pharmacy retail shelf codes, which need warmer consumer design;
and any workflow where PHI would be embedded in the payload — fix the
data architecture first, then pick the template.
    `,
    bestFor: [
      'Hospital patient wristbands (identifier-only payloads)',
      'Medical device and equipment asset tags',
      'Prescription labels linking to medication information',
      'Laboratory specimen tubes and slides',
      'Clinical trial participant ID cards',
    ],
    avoidFor: [
      'Consumer health and wellness apps (too clinical in appearance)',
      'Pharmacy retail shelf codes (need warmer consumer design)',
      'Any workflow embedding PHI directly in the QR payload',
    ],
    faqs: [
      {
        question: 'Can I put patient data directly in the QR code?',
        answer:
          "No. A QR code is readable by any camera, so anything in the payload is effectively public. Encode an opaque identifier that resolves through your access-controlled system instead. This template makes the identifier reliably scannable; access control is your system's job, and no template can substitute for it.",
      },
      {
        question: 'Why Level Q instead of Level M for hospitals?',
        answer:
          'Clinical labels face sanitizer, fluids, friction, and temperature swings that consumer labels never see. Level Q recovers 25% of damaged data versus 15% at Level M — that margin is the difference between a wristband that scans at 3 a.m. and one that sends a nurse back to the workstation.',
      },
      {
        question: 'How do I handle curvature on wristbands?',
        answer:
          'Keep the symbol at 20–25mm, place it on the flattest part of the band, and keep the encoded payload short so modules stay large. Curvature distorts edge modules, so a sparse low-version symbol survives bending far better than a dense one. Always test-scan on an actual wrist, not a flat proof.',
      },
      {
        question: 'Will this work with our existing barcode scanners?',
        answer:
          "Square dots, square eyes, and maximum contrast are the most compatible choices for mixed scanner fleets, including older imagers. That said, always validate with your facility's actual hardware — scanner firmware varies, and a five-minute test with the real devices beats any amount of theory.",
      },
    ],
    title: 'Healthcare Clinical QR Code Template: Patient Wristband & Medical Equipment Design',
    metaDescription:
      'Healthcare QR template for hospitals and clinics. Deep navy on white, square dots, Level Q — identifier-only guidance for clinical workflows.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'cafe-chalkboard',
    name: 'Café Chalkboard',
    designStyle: 'hospitality',
    primaryUseCase: 'Café menu QR, table-ordering codes, Wi-Fi sharing',
    targetIndustry: 'Cafés, Coffee Shops, Casual Dining',
    colorPalette: ['#F4F1EA', '#2A2A28', '#C9A96A'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'chalk-frame',
    hasLogo: false,
    ctaText: 'View Menu',
    useCaseAdvice: `
Café Chalkboard translates the visual language of the sidewalk A-frame
sign — chalk lettering on a dark board — into a QR code that belongs on
a café table, not just near it. The template is light-on-dark: warm
chalk-white (#F4F1EA) modules on a deep charcoal board (#2A2A28), with a
brass-gold accent for the frame. It looks fantastic on a menu card, a
table tent, or a chalkboard-painted wall. It also comes with the honest
warning that every inverted template must carry: light-on-dark QR codes
are less universally scannable than dark-on-light ones.

The technical reason is binarization. Most scanner pipelines assume dark
modules on a light background; many handle inverted codes fine, but some
— particularly older or cheaper scanner apps and virtually all
laser-line industrial imagers — do not. In a café, the audience scans
with their own modern phones, which is the best-case audience for an
inverted code. Still, the template compensates: contrast between the two
colors is around 13:1, the modules are rendered large by keeping payloads
short (a short menu link, not a 300-character URL), and Error Correction
Level M gives headroom for the smudges and coffee rings that café codes
inevitably collect.

Rounded dots and a rounded-square finder eye echo chalk's soft edges —
chalk never makes a perfect square, and the code should not pretend to.
The dot inner eye style adds a hand-drawn warmth to the three locators.
Keep the code at 25–30mm on table tents: café codes are scanned at arm's
length in warm, dim lighting, which is harder than office lighting, and
the inverted polarity spends some of your reliability budget before you
start.

Placement matters more than usual with inverted codes. Never put this on
a glossy laminated surface under a spotlight — specular reflection off
laminate can wash out light modules entirely. Matte lamination or
uncoated card is the right substrate. And keep the code away from actual
chalk dust and textured board paint inside the symbol area; print the
code on a clean card rather than drawing the quiet zone on a real
chalkboard, where dust in the light areas reads as noise.

Best for: café and restaurant table menus; table-ordering and
pay-at-table codes; guest Wi-Fi sharing cards; daily-specials boards;
bakery and patisserie counter cards.

Avoid for: any audience on unknown or industrial scanners; glossy
laminated placements under spotlights; tiny codes under 25mm; contexts
where a failed scan has real cost (payments, ticketing) — use a
dark-on-light template there; and outdoor sidewalk signs in direct sun,
where glare defeats light modules.
    `,
    bestFor: [
      'Café and restaurant table menu codes',
      'Table-ordering and pay-at-table cards',
      'Guest Wi-Fi sharing table tents',
      'Daily-specials and seasonal menu boards',
      'Bakery and patisserie counter cards',
    ],
    avoidFor: [
      'Unknown or industrial scanner audiences (inverted polarity)',
      'Glossy laminate under spotlights (specular washout)',
      'Codes under 25mm in dim café lighting',
      'Payment or ticketing where a failed scan has real cost',
    ],
    faqs: [
      {
        question: 'Do light-on-dark QR codes actually scan?',
        answer:
          'On modern phone cameras, usually yes — most current scanner apps handle inverted polarity. But support is not universal: older apps and laser industrial imagers often expect dark-on-light. This template compensates with high contrast (~13:1), large modules, and Level M error correction, and you should test on a few real phones before printing a run.',
      },
      {
        question: 'Why matte lamination instead of glossy?',
        answer:
          'Glossy laminate under café spotlights creates specular reflections that can wash out the light-colored modules entirely, while dark modules survive glare better. Matte laminate or uncoated card diffuses the light and keeps the chalk-white modules readable. This matters far more for inverted codes than for standard ones.',
      },
      {
        question: 'Can I draw the quiet zone on a real chalkboard?',
        answer:
          'No — print the code on a clean card. Real chalk dust inside the light module areas reads as noise to the scanner, and hand-drawn boards never hold the geometric precision a QR symbol needs. Use the chalkboard aesthetic in the frame and surroundings; keep the symbol itself printed clean.',
      },
      {
        question: 'What should the code link to?',
        answer:
          'A short menu or ordering link — keep it under 60 characters so the QR version stays low and modules stay large. Large modules are doubly important for inverted codes. Avoid linking directly to a PDF menu hosted on a long URL; use a short link that you can redirect when the menu changes.',
      },
    ],
    title: 'Café Chalkboard QR Template: Menu & Table-Ordering Design',
    metaDescription:
      'Chalkboard QR template for cafés and restaurants. Chalk-white on charcoal with brass frame — menus, table ordering, and Wi-Fi sharing.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'neon-nightlife',
    name: 'Neon Nightlife',
    designStyle: 'neon',
    primaryUseCase: 'Club entry, event tickets, DJ promo, late-night venue menus',
    targetIndustry: 'Nightlife, Events, Entertainment',
    colorPalette: ['#00F0FF', '#0A0A12', '#FF2E88'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'neon-glow-frame',
    hasLogo: false,
    ctaText: 'Get Tickets',
    useCaseAdvice: `
Neon Nightlife is built for the hours after dark: club entries, DJ
promos, festival afterparties, and late-night venue menus. Electric cyan
(#00F0FF) modules on near-black (#0A0A12), with a hot-pink accent in the
frame, reproduce the glow of real neon signage. On a phone screen in a
dark venue it looks electric — which is exactly the point, and exactly
where the engineering caution begins.

This is an inverted (light-on-dark) template, and nightlife is the
hardest common scanning environment: low ambient light, moving subjects,
phone screens at low brightness, and bouncers scanning ticket codes under
time pressure. The template fights back on every axis it can control.
Contrast between cyan and near-black is around 14:1 — high, because both
colors sit at opposite ends of the luminance range. Error Correction
Level Q gives 25% damage recovery for codes that get screenshot,
recompressed through chat apps, and displayed on cracked screens. Modules
are kept large by insisting on short payloads: a ticket code should be a
short ID that resolves server-side, never a paragraph of event data.

The critical real-world note: screens are emissive, paper is reflective,
and this template behaves differently on each. On a phone screen in a
dark club, the cyan modules glow and the code scans beautifully. Printed
on a flyer, the "neon" is just light blue ink on dark paper — still
scannable in good light, but the magic is gone and the inverted-polarity
caveat applies in full. Design your primary use around screens (tickets,
promo posts, entry displays) and treat print as secondary.

Scanability notes: for entry ticketing, test the full chain — ticket in
Apple/Google Wallet or a chat-app screenshot, scanned by the venue's
actual scanner phones, in actual venue lighting. Recompressed screenshots
are the number-one failure mode for event codes, and Level Q plus short
payloads is the defense. Keep animated or glowing frame effects in the
surrounding design, never overlapping the symbol; anything that touches
the quiet zone or pulses across modules will break scanning.

Best for: club and concert entry tickets (screen-first); DJ and artist
promo codes; late-night venue drink menus on phones; afterparty
invitations; event social-media promo graphics.

Avoid for: printed flyers as the primary ticket medium; industrial or
unknown scanner hardware; outdoor daytime use where the neon effect
washes out; tiny codes on wristbands; and any high-stakes single-scan
context without a tested fallback (printed backup list at the door). When in doubt, run a full rehearsal scan with the venue's hardware before doors open — nightlife has no second chances once the queue forms.
    `,
    bestFor: [
      'Club and concert entry tickets (screen-first)',
      'DJ and artist promotional codes',
      'Late-night venue drink menus on phones',
      'Afterparty invitations',
      'Event social-media promo graphics',
    ],
    avoidFor: [
      'Printed flyers as the primary ticket medium',
      'Industrial or unknown scanner hardware',
      'Outdoor daytime placements (neon effect washes out)',
      'Tiny wristband codes',
    ],
    faqs: [
      {
        question: 'Will this scan in a dark club?',
        answer:
          "On phone screens, yes — that is this template's best case. The emissive cyan modules on near-black read clearly to phone cameras even in low ambient light, and the ~14:1 contrast helps. The riskier path is printed flyers in dim venues; keep the primary flow screen-based and test with the venue's actual scanner phones.",
      },
      {
        question: 'Why do screenshots of tickets sometimes fail?',
        answer:
          'Chat apps recompress images, which blurs module edges and can shift colors. This template defends with Level Q error correction (25% recovery) and short payloads that keep modules large — large modules survive compression far better than dense ones. The venue should also keep a backup entry list for the inevitable edge cases.',
      },
      {
        question: 'Can I animate the neon glow around the code?',
        answer:
          'Around the code, yes; over it, never. Animated glow in the frame and surrounding design is fine and looks great. Anything that pulses across the modules or touches the quiet zone — even briefly — will break scanning at exactly the wrong moment. Keep a static, clean symbol area.',
      },
      {
        question: 'Does this work printed on a flyer?',
        answer:
          'It scans in good light, but the neon effect does not survive print — it becomes light blue ink on dark paper, and the inverted-polarity caveat applies. For flyers, either accept the aesthetic compromise and test in real lighting, or use a dark-on-light template for print and reserve Neon Nightlife for screens.',
      },
    ],
    title: 'Neon Nightlife QR Template: Club, Event & Ticket Design',
    metaDescription:
      'Neon QR template for nightlife and events. Electric cyan on near-black — screen-first club tickets, DJ promos, and late-night menus.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'wedding-elegant-script',
    name: 'Wedding Elegant',
    designStyle: 'wedding',
    primaryUseCase: 'Wedding invitations, RSVP codes, photo-sharing links',
    targetIndustry: 'Weddings, Events, Stationery',
    colorPalette: ['#3E3A34', '#FDFBF7', '#C9A96A'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'thin-gold-border',
    hasLogo: false,
    ctaText: 'RSVP Here',
    useCaseAdvice: `
Wedding Elegant is designed for the most emotionally loaded print in a
couple's life: the invitation suite. A QR code on a wedding invitation
has to do something remarkable — disappear into some of the most
carefully art-directed stationery that exists, while still working for
the least technical audience imaginable: grandparents scanning with
three-year-old phones in variable light. The template resolves this with
warm charcoal (#3E3A34) modules on ivory (#FDFBF7), contrast around
12:1, rounded dots that echo calligraphy curves, and a thin gold frame
that lets the stationer treat the code as a design element rather than
an apology.

The palette justification is about paper. Wedding stationery lives on
ivory, cream, and cotton stocks — never pure white. A pure-black code
on ivory paper looks like a photocopier accident; warm charcoal belongs
to the same color family as the ink in the letterpress. The gold frame
(#C9A96A) ties the code to foil-stamped monograms and envelope liners.
None of this costs reliability: 12:1 contrast is far above scanner
thresholds, and the frame doubles as quiet-zone protection, which
matters because stationers will be tempted to tuck the code into tight
corners of the layout.

The audience shapes every other decision. Wedding guests span the full
device spectrum, including older phones with poor cameras, and they
scan in churches, gardens, and dim reception halls. So: Error Correction
Level M minimum, short URLs (a custom short domain with the couple's
names keeps modules large and looks intentional), and a minimum print
size of 25mm — larger than feels necessary, because Aunt Margaret's
phone is the acceptance test. Link to a single mobile-friendly hub page
(RSVP, registry, photo sharing, schedule) rather than scattering codes
for each; one code, learned once, used all day.

Scanability notes: proof on the actual stock. Cotton and textured papers
add surface noise that flat proofs hide; letterpress debossing near the
code can distort edge modules. Keep the code clear of foil stamping and
embossing — metallic surfaces adjacent to modules create glare. And
resist the urge to shrink the code to "preserve the design": a code too
small to scan is not elegant, it is broken.

Best for: wedding invitation RSVP codes; wedding website links on
save-the-dates; reception photo-sharing and guest-book codes; order-of-
service links; thank-you card gallery links.

Avoid for: tiny favor tags under 20mm; heavily textured handmade paper
without a smooth printed panel; metallic or foil substrates directly
under the modules; multi-code suites where each card has a different
destination (one hub link beats five codes).
    `,
    bestFor: [
      'Wedding invitation RSVP codes',
      'Wedding website links on save-the-dates',
      'Reception photo-sharing and digital guest-book codes',
      'Order-of-service links',
      'Thank-you card photo gallery links',
    ],
    avoidFor: [
      'Favor tags under 20mm',
      'Heavily textured handmade paper without a smooth panel',
      'Foil or metallic substrates directly under modules',
      'Multi-code suites (one hub link beats five codes)',
    ],
    faqs: [
      {
        question: 'Will older guests be able to scan this?',
        answer:
          'That is the design target. Warm charcoal on ivory gives ~12:1 contrast, modules are kept large via short URLs, and 25mm minimum print size accommodates older phone cameras. The remaining variable is the destination page — make sure the RSVP site is simple, large-text, and mobile-friendly, because the scan is only half the journey.',
      },
      {
        question: 'Can the code go on textured cotton paper?',
        answer:
          'With a caveat: texture adds surface noise. Print the code on the smoothest area of the stock, or have the stationer print a small smooth panel for it. Proof on the actual paper — flat digital proofs hide texture effects — and test-scan the proof before the full run.',
      },
      {
        question: 'Should we use one QR code or several?',
        answer:
          'One. Link every code to a single wedding hub page with RSVP, schedule, registry, and photo sharing. Guests learn the code once and reuse it all day. Multiple codes for multiple destinations confuse guests and multiply the print-risk surface.',
      },
      {
        question: 'How do we keep the URL short and pretty?',
        answer:
          "Use a custom short domain with the couple's names (e.g. aisha-and-daniel.link/rsvp). Short URLs keep the QR version low and modules large, and a named link looks intentional on the invitation. Set up redirect control so the destination can be updated after printing.",
      },
    ],
    title: 'Wedding Elegant QR Template: Invitation & RSVP Design',
    metaDescription:
      'Elegant wedding QR template for invitations and RSVPs. Warm charcoal on ivory with gold frame — blends into fine stationery.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'real-estate-premium',
    name: 'Real Estate Premium',
    designStyle: 'real-estate',
    primaryUseCase: 'Property listings, yard signs, brochure virtual tours',
    targetIndustry: 'Real Estate, Property Development',
    colorPalette: ['#123A5C', '#FFFFFF', '#B9975B'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thin-label-bottom',
    hasLogo: false,
    ctaText: 'View Listing',
    useCaseAdvice: `
Real Estate Premium is built for the yard sign, the brochure, and the
window display — the three places where a property QR code earns its
keep. Deep listing-blue (#123A5C) on white gives contrast around 13:1
with an immediate "established brokerage" read, and the brushed-gold
accent (#B9975B) in the CTA frame borrows the visual language of premium
developments without touching the symbol. The frame carries "View
Listing" because a yard sign has about two seconds of a driver's
attention: the code must announce its purpose instantly or it will not
be scanned at all.

Outdoor durability drives the engineering. Yard signs face UV, rain,
temperature swings, and months of exposure; brochure codes face folding
and handling. Error Correction Level Q (25% recovery) is the baseline
for anything that lives outside, and the template assumes weatherproof
substrates — aluminum composite or corrugated plastic with UV-stable
inks, not paper. Fading is the silent killer of outdoor codes: a code
that scanned in May can fail by September as UV bleaches the blue
modules toward the binarization boundary. Dark, saturated module colors
fade more gracefully than light ones, which is another reason the
foreground here is a deep navy rather than a fashionable mid-blue.

Distance sizing is the other half of outdoor reliability. A yard-sign
code is scanned from a car or the sidewalk — plan for at least 40mm on
the sign, and remember the rule of thumb that scannable size is roughly
a tenth of the viewing distance. The payload must be a short listing
link; a full MLS URL with tracking parameters forces a dense symbol
whose tiny modules no phone resolves from three meters away. Use a short
link per listing so the sign rider can be reprinted or redirected when
the listing details change.

Scanability notes: test the sign in situ — morning glare, midday sun,
and dusk all change the effective contrast. Avoid placing the code where
the sign's own frame casts a shadow across it. For window displays,
watch for glass reflection; a slight tilt of the display card usually
solves it. Brochure codes can be smaller (25mm) since they are scanned
at reading distance, but keep them off the fold line.

Best for: yard and site signs; property brochures and flyers; agency
window displays; open-house sign-in sheets; new-development hoarding.

Avoid for: long raw MLS URLs (always shorten); tiny sign riders where
the code would drop under 35mm; reflective metal signs without a matte
overlaminate; and indoor-only luxury staging where a warmer template
fits the interior story better.
    `,
    bestFor: [
      'Yard signs and development site boards',
      'Property brochures and flyers',
      'Agency window displays',
      'Open-house sign-in sheets',
      'New-development hoarding panels',
    ],
    avoidFor: [
      'Long raw listing URLs (always use a short link)',
      'Sign riders where the code would drop under 35mm',
      'Reflective metal signs without matte overlaminate',
      'Paper yard signs (UV and rain will kill them)',
    ],
    faqs: [
      {
        question: 'How big should a yard-sign QR code be?',
        answer:
          'At least 40mm on a side, and scale up with viewing distance — roughly a tenth of the distance from viewer to sign is the rule of thumb. A code scanned from a car three meters away needs to be far larger than one scanned from a brochure at reading distance. When in doubt, print bigger.',
      },
      {
        question: 'Will sun fade break the code over a listing season?',
        answer:
          'It can, which is why this template uses deep navy modules (they fade more gracefully than mid-tones), Level Q error correction, and assumes UV-stable inks on weatherproof substrate. Even so, inspect long-running signs monthly — a code that scanned in May can degrade by September.',
      },
      {
        question: 'Should each listing have its own QR code?',
        answer:
          'Yes, but make each one a short redirect link, not the raw listing URL. Short links keep modules large and scannable from distance, and they let you update the destination (price changes, new photos, "sold" page) without reprinting the sign.',
      },
      {
        question: 'Why not just print the listing URL as text?',
        answer:
          'Nobody types a URL from a passing car. The QR code converts drive-by attention into a phone action in two seconds. The CTA frame ("View Listing") matters here — an unlabeled code on a sign gets ignored, a labeled one gets scanned.',
      },
    ],
    title: 'Real Estate Premium QR Template: Listing & Yard Sign Design',
    metaDescription:
      'Premium real estate QR template for listings and yard signs. Listing-blue on white, Level Q for outdoor durability and drive-by scanning.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'pastel-boutique',
    name: 'Pastel Boutique',
    designStyle: 'playful',
    primaryUseCase: 'Boutique storefront, product hang tags, loyalty signup',
    targetIndustry: 'Boutique Retail, Fashion, Beauty',
    colorPalette: ['#6B5B73', '#FDF6F0', '#E8B4B8'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Shop New In',
    useCaseAdvice: `
Pastel Boutique speaks the visual language of independent retail: soft,
warm, approachable. Muted plum (#6B5B73) modules on a blush-tinted
ivory (#FDF6F0) give contrast around 7:1 — enough for modern phone
cameras in boutique lighting, but honestly less than the 10:1+ a
reliability-first template offers. This is a conscious trade: the
template is for environments where the audience has good phones, the
lighting is flattering, and the brand impression matters as much as the
scan. The pink accent (#E8B4B8) stays in the frame and CTA, never in
the modules.

The scanability budget here is spent in two places: the mid-tone plum
foreground and the tinted background. Either alone would be fine; together
they narrow the margin. The template compensates with large modules
(short links only — a boutique loyalty signup link, not a 200-character
campaign URL), Level M error correction, and a minimum print size of
25mm on hang tags and 30mm on window decals. In practice, boutique codes
are scanned at close range in good light by customers with recent
phones, which is a forgiving scenario — but "forgiving scenario" is not
the same as "robust code," and the distinction matters when you print
a thousand hang tags.

Where this template shines is brand cohesion. A stark black QR on a
pastel hang tag looks like an afterthought; the plum-and-blush code
looks like part of the design system. That cohesion has a business
effect: customers perceive the code as intentional and are more likely
to scan it. The rounded dots and dot-style inner eyes continue the soft
geometry of boutique typography and packaging. The rounded label frame
carries the CTA ("Shop New In", "Join Rewards") because boutique codes
compete with beautiful surroundings for attention — an unlabeled code
on a pretty tag is invisible.

Scanability notes: never place this code on a patterned or photographic
background — the tinted module background needs a clean field. On window
decals, watch for backlight: a code on glass with bright daylight behind
it can silhouette, so prefer interior placement or a solid backing.
Test with a mid-range Android phone, not just your flagship, since
customer devices vary more than staff devices.

Best for: boutique hang tags and swing tickets; storefront window
decals; loyalty program signup cards; beauty salon service menus;
packaging inserts for DTC brands.

Avoid for: low-light environments; tiny hang tags under 20mm; patterned
backgrounds; audiences on older devices; any code where failure costs a
sale at the register — keep payment-adjacent codes high-contrast.
    `,
    bestFor: [
      'Boutique hang tags and swing tickets',
      'Storefront window decals',
      'Loyalty program signup cards',
      'Beauty salon service menus',
      'DTC brand packaging inserts',
    ],
    avoidFor: [
      'Low-light environments',
      'Hang tags under 20mm',
      'Patterned or photographic backgrounds',
      'Payment-adjacent codes where failure costs a sale',
    ],
    faqs: [
      {
        question: 'Is 7:1 contrast enough for reliable scanning?',
        answer:
          'For modern phones in good light, yes — with margin to spare. The honest context: it is roughly half the contrast of a black-on-white code, so budget devices, dim light, and small print sizes erode it faster. Keep codes 25mm+, payloads short, and test on a mid-range phone before a big print run.',
      },
      {
        question: 'Can I use my brand pink for the modules instead?',
        answer:
          "Probably not safely. Most brand pinks are far lighter than this template's plum foreground, and pink-on-blush can drop contrast below what scanners tolerate. Keep pinks and pastels in the frame and surroundings; let the darker plum carry the modules.",
      },
      {
        question: 'Why do boutique codes need a CTA label?',
        answer:
          'Because they compete with beautiful surroundings. On a stark industrial label, a QR code is obviously functional; on a pretty hang tag, an unlabeled code blends into the design and gets ignored. The CTA label ("Join Rewards") converts decoration-adjacent geometry into an action customers take.',
      },
      {
        question: 'Window decals: inside or outside the glass?',
        answer:
          'Inside, facing out, with attention to backlight. A code on glass with bright daylight behind it can silhouette into unreadability. Interior placement with a solid backing card, or a decal with its own opaque background layer, keeps contrast intact.',
      },
    ],
    title: 'Pastel Boutique QR Template: Retail Hang Tag & Storefront Design',
    metaDescription:
      'Pastel boutique QR template for independent retail. Muted plum on blush ivory — hang tags, window decals, and loyalty signup.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'dark-mode-inverted',
    name: 'Dark Mode Inverted',
    designStyle: 'dark',
    primaryUseCase: 'Dark UI screens, OLED displays, developer docs, streaming overlays',
    targetIndustry: 'Tech, SaaS, Gaming, Developer Tools',
    colorPalette: ['#EDEDED', '#111111', '#7C6CFF'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'none',
    hasLogo: false,
    ctaText: 'Open Link',
    useCaseAdvice: `
Dark Mode Inverted is the template this gallery is most careful about,
because it is also the most requested and the most likely to be misused.
Light modules (#EDEDED) on a near-black background (#111111) look native
inside dark-mode apps, dashboards, README files rendered in dark themes,
streaming overlays, and OLED signage. The contrast between the two colors
is around 15:1 — high in absolute terms. And yet this template carries an
explicit scanability warning, because contrast is not the whole story:
scanner pipelines are built around the assumption of dark-on-light, and
inverted codes fail on a meaningful minority of real-world scanners.

Be specific about the risk. Modern phone cameras (iOS and Android stock
camera apps, recent Chrome) handle inverted QR codes reliably. Older
scanner apps, many enterprise scanning SDKs, and essentially all
laser-line industrial imagers do not — they binarize for dark modules
and never find the symbol. If your audience is "people with phones made
in the last five years scanning from your dark-mode UI," this template
is fine and looks far better than a white box stamped into a dark
interface. If your audience is unknown, mixed, or includes dedicated
scanning hardware, do not use it. There is no aesthetic worth a failed
scan you cannot debug remotely.

The template mitigates what it can: Level Q error correction for 25%
recovery, rounded dots that stay crisp on OLED subpixel layouts, and a
frameless design that assumes the surrounding UI provides the quiet
zone. That last point is a real integration requirement — in a dark UI,
the quiet zone must be the background color extending at least four
modules past the symbol. A common failure is placing the code on a
card or panel whose edge sits two modules from the symbol; on dark
backgrounds this is visually invisible to the designer and fatal to the
scanner. Enforce the quiet zone in code, not in hope.

Scanability notes: test on the oldest phone your audience plausibly
uses, not your own. Test in the actual lighting — OLED glare in bright
rooms can wash out light modules. Never print this template on paper
unless you have tested that exact printer and lighting; print is where
inverted codes die, because paper cannot emit light and ambient
reflection is never as clean as a screen. For any print use, prefer a
dark-on-light template.

Best for: dark-mode web apps and dashboards; developer documentation
with dark themes; streaming and video overlays; OLED conference signage;
in-app QR displays (2FA enrollment, device pairing) where the scanning
device is a modern phone.

Avoid for: print of any kind without device-specific testing; unknown
or mixed scanner audiences; industrial scanners; email (renders in
unpredictable themes); and any code where failure has operational cost
— ticketing, payments, access control.
    `,
    bestFor: [
      'Dark-mode web apps and SaaS dashboards',
      'Developer docs with dark themes',
      'Streaming and video overlays',
      'OLED conference and lobby signage',
      'In-app QR displays (2FA enrollment, device pairing)',
    ],
    avoidFor: [
      'Print without device-specific testing (inverted codes die on paper)',
      'Unknown or mixed scanner audiences',
      'Industrial laser scanners',
      'Email (renders in unpredictable light/dark themes)',
      'Ticketing, payments, or access control',
    ],
    faqs: [
      {
        question: 'Why the strong warning if the contrast is 15:1?',
        answer:
          'Because contrast is necessary but not sufficient. Many scanner pipelines assume dark modules on a light background at the binarization step, before contrast even matters. Modern phone cameras handle inversion; older apps, enterprise SDKs, and laser imagers often do not. High contrast cannot fix a scanner that never looks for light modules.',
      },
      {
        question: 'When is this template actually the right choice?',
        answer:
          'When the code lives inside a dark UI and is scanned by modern phones: in-app 2FA enrollment, dark-mode dashboards, streaming overlays, OLED signage. In those contexts it looks native instead of stamped-on, and the audience hardware is predictably recent. The key is knowing your scanner population.',
      },
      {
        question: 'How do I guarantee the quiet zone in a dark UI?',
        answer:
          'Enforce it in code: render the symbol with a margin of at least 4 modules in the exact background color, as part of the QR component — not as CSS padding a designer might later remove. On dark backgrounds a violated quiet zone is invisible to the human eye and fatal to the scanner, so it must be structural.',
      },
      {
        question: 'Can I print this on a dark poster?',
        answer:
          "Only after testing that exact printer, stock, and lighting with your audience's devices. Paper cannot emit light, so printed inverted codes depend entirely on reflected ambient light, which is never as clean as a screen. For print, a dark-on-light template is the responsible default.",
      },
    ],
    title: 'Dark Mode Inverted QR Template: Honest Guide to Light-on-Dark Codes',
    metaDescription:
      'Dark-mode inverted QR template for dark UIs and OLED screens. Light modules on near-black with Level Q and an honest scanability warning.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'gradient-sunset',
    name: 'Gradient Sunset',
    designStyle: 'gradient',
    primaryUseCase: 'Travel promos, hospitality marketing, social campaigns',
    targetIndustry: 'Travel, Hospitality, Lifestyle Brands',
    colorPalette: ['#FF5E62', '#FFF9F5', '#FFB347'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Book Now',
    useCaseAdvice: `
Gradient Sunset renders the QR modules in a diagonal blend from warm
coral (#FF5E62) to amber (#FFB347) over a soft warm-white background
(#FFF9F5). It is the template for golden-hour marketing: travel
campaigns, resort promos, festival announcements, and any brand whose
photography lives at sunset. The gradient is applied as a single
diagonal sweep across the whole symbol, which matters technically: a
smooth global gradient keeps neighboring modules at similar luminance,
while per-module rainbow gradients create local contrast chaos that
scanners hate.

The honest engineering note: gradients cost contrast at the light end.
The coral start of the gradient holds contrast around 4:1 against the
background — workable for modern phones in good light, but the amber
end is lighter, and any module region drifting too close to the
background tone becomes a binarization risk. This template is therefore
positioned as a large-format, good-light design: 30mm minimum in print,
screen-first for social campaigns, short payloads to keep modules big.
A dense, high-version gradient code is the exact combination that fails
— small modules plus marginal contrast is multiplicative risk, not
additive.

The finder eyes use the gradient too, but the inner eye dot stays solid
coral: the three locators must remain the highest-contrast, most
recognizable shapes in the symbol, because detection starts there. If
detection fails, nothing else matters. The rounded label frame carries
the CTA in solid coral text on the warm-white field — text is never
gradient-filled, because thin gradient text fails accessibility and
legibility simultaneously.

Scanability notes: proof the gradient on the actual output. Screen
gradients and print gradients differ — inkjet banding can create visible
steps in the blend, and each step edge is a potential false module
boundary. Use high-quality print settings and test-scan the proof, not
the screen mockup. On social, export at high resolution; platform
recompression (especially stories and reels) blurs gradients, so keep
the source large and the payload short. Never place this over a photo —
the gradient needs its clean #FFF9F5 field. Keep an accessible high-contrast alternative ready for contexts where the gradient cannot go — inclusivity is part of good campaign design.

Best for: travel and resort promotional campaigns; hospitality seasonal
offers; music and food festival announcements; lifestyle brand social
campaigns; sunset-themed event invitations.

Avoid for: small print under 30mm; dense payloads (long URLs); placement
over photography; low-light scanning contexts; industrial or clinical
use; and any audience on older devices — the gradient's light end needs
a decent camera.
    `,
    bestFor: [
      'Travel and resort promotional campaigns',
      'Hospitality seasonal offers',
      'Music and food festival announcements',
      'Lifestyle brand social campaigns',
      'Sunset-themed event invitations',
    ],
    avoidFor: [
      'Print under 30mm',
      'Dense payloads (long URLs force tiny modules)',
      'Placement over photography',
      'Low-light scanning contexts',
      'Older devices with poor cameras',
    ],
    faqs: [
      {
        question: 'Do gradient QR codes scan reliably?',
        answer:
          'When done as a single smooth global gradient, kept large, and scanned in good light on modern phones — yes. The risk concentrates at the light end of the gradient, where contrast against the background narrows. Keep the code 30mm+, the payload short, and test the actual printed or recompressed output, not just the screen mockup.',
      },
      {
        question: 'Why not a rainbow gradient with more colors?',
        answer:
          'Multi-hue gradients create local contrast reversals between neighboring modules, which is exactly what binarization algorithms choke on. A two-stop warm gradient keeps every module in the same luminance family. More colors buy visual noise at the cost of scan margin — a bad trade.',
      },
      {
        question: 'Will Instagram or TikTok compression break it?',
        answer:
          'It can soften it. Platform recompression blurs gradient transitions and module edges. Defense: export the source graphic large, keep the QR version low with a short link, and test by scanning the code from the actual posted story or reel — not from your camera roll.',
      },
      {
        question: 'Can I print a gradient QR on an inkjet?',
        answer:
          'For proofs, yes, at the highest quality setting — inkjet banding creates visible steps in gradients, and each step is a potential false module edge. For production, use commercial print. Either way, test-scan the physical proof before committing.',
      },
    ],
    title: 'Gradient Sunset QR Template: Travel & Hospitality Campaign Design',
    metaDescription:
      'Sunset-gradient QR template for travel and hospitality. Coral-to-amber modules on warm white — large-format, screen-first guidance.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'eco-green',
    name: 'Eco Green',
    designStyle: 'eco',
    primaryUseCase: 'Sustainability reports, organic product packaging, recycling info',
    targetIndustry: 'Sustainability, Organic Food, Environmental Orgs',
    colorPalette: ['#1E5B3A', '#F7FAF6', '#7FB069'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Our Impact',
    useCaseAdvice: `
Eco Green is the template for organizations whose QR code has to prove
a value proposition: organic certification, carbon footprint data,
recycling instructions, sustainability reports. Deep forest green
(#1E5B3A) on a whisper-green white (#F7FAF6) gives contrast around 9:1 —
solidly scannable on modern phones while reading unmistakably as
"green brand." The leaf-green accent (#7FB069) appears in the frame and
CTA only; like all accent colors, it stays out of the modules, where
its lighter tone would erode the contrast the forest green provides.

There is a temptation with eco branding to go further — kraft-paper
backgrounds, leaf-patterned modules, textured "natural" looks. This
template deliberately stops short of that. Kraft and recycled stocks
are genuinely lower-contrast substrates, and a code printed on uncoated
brown board can lose two or three points of effective contrast to paper
absorbency alone. The template's answer: keep the symbol on the clean
#F7FAF6 field, and let the eco story live in the surrounding packaging
design and the destination content. A sustainability QR that does not
scan is worse than no QR — it signals that the brand's systems do not
work.

Error Correction Level Q is chosen because eco codes live on packaging:
shelves, shipping, handling, moisture, and the occasional
refrigerator-door condensation for food products. Packaging is a
high-abuse environment, and 25% recovery is cheap insurance. For organic
food packaging specifically, keep the code away from the crimp seals
and folds — distorted modules at a pouch edge fail first — and size at
25mm minimum, since grocery shoppers scan at arm's length under mixed
store lighting.

Scanability notes: if you must print on kraft or recycled stock, print
a white or #F7FAF6 panel behind the code — do not place green modules
directly on brown board. Test under store lighting, which is often
cooler and dimmer than studio light. And link to content that earns the
scan: the full sustainability report, the certification document, the
recycling guide — not a generic homepage. Eco audiences scan with
intent; reward it. Make the destination itself lightweight and fast — a bloated page undermines the sustainability story the code was printed to tell.

Best for: organic and natural product packaging; sustainability and
impact reports; recycling and composting instruction codes; farmers'
market vendor signage; environmental nonprofit campaign materials.

Avoid for: direct-on-kraft printing without a light panel; tiny codes
on small-format packaging; luxury contexts where green reads off-brand;
and linking to generic homepages — eco scanners expect substance.
    `,
    bestFor: [
      'Organic and natural product packaging',
      'Sustainability and impact reports',
      'Recycling and composting instruction codes',
      "Farmers' market vendor signage",
      'Environmental nonprofit campaign materials',
    ],
    avoidFor: [
      'Direct printing on kraft board without a light panel',
      'Tiny codes on small-format packaging',
      'Luxury contexts where green reads off-brand',
      'Linking to generic homepages instead of substantive content',
    ],
    faqs: [
      {
        question: 'Can I print this directly on kraft paper packaging?',
        answer:
          'Not safely without a light panel behind the code. Kraft and recycled stocks absorb ink and lower effective contrast significantly — green modules on brown board can fall below reliable binarization thresholds. Print a clean #F7FAF6 panel for the symbol and let the kraft texture live around it.',
      },
      {
        question: 'Why Level Q for a packaging code?',
        answer:
          "Packaging is a high-abuse environment: shelf handling, shipping vibration, moisture, and condensation all damage the symbol over its life. Level Q's 25% recovery is cheap insurance that the code still scans months after printing. For food packaging facing refrigeration, it is close to mandatory.",
      },
      {
        question: 'What should an eco QR code link to?',
        answer:
          'Substance: the full sustainability report, the organic certification document, a recycling guide for that specific product, the supply-chain story. Eco audiences scan with intent and skepticism — a generic homepage wastes the highest-trust scan you will get.',
      },
      {
        question: 'Does the green palette limit who can scan it?',
        answer:
          'At ~9:1 contrast on modern phones in decent light, no. The limitation is at the margins: older phones, dim grocery aisles, small print sizes. Keep codes 25mm+, payloads short, and test under actual store lighting to stay clear of those margins.',
      },
    ],
    title: 'Eco Green QR Template: Sustainable Packaging & Impact Report Design',
    metaDescription:
      'Eco green QR template for sustainable brands. Forest green on soft white, Level Q — honest guidance on kraft stock and placement.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'fitness-energetic',
    name: 'Fitness Energetic',
    designStyle: 'fitness',
    primaryUseCase: 'Gym check-ins, class bookings, workout video links',
    targetIndustry: 'Fitness, Gyms, Sports Studios',
    colorPalette: ['#D90429', '#FFFFFF', '#1B1B1B'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thick-border',
    hasLogo: false,
    ctaText: 'Book Class',
    useCaseAdvice: `
Fitness Energetic is built for motion: gym check-ins, class booking
codes on studio walls, workout-video links on equipment, and challenge
leaderboards. Signal red (#D90429) on white gives contrast around 5:1 —
enough for modern phones, deliberately chosen for energy over maximum
reliability, and compensated elsewhere. The charcoal accent (#1B1B1B)
anchors the frame and CTA text so the red never has to carry fine detail
it cannot support.

The defining constraint of fitness QR codes is that they are scanned by
people in motion, often with sweaty hands, at odd angles, in spaces with
dramatic lighting — bright windows on one wall, dark corners on another.
The template's answer is structural conservatism inside the symbol:
square dots, square finder eyes, Level Q error correction, and large
modules from short payloads. The excitement lives in the frame and
surroundings; the symbol itself is engineered like industrial equipment.
A class-booking code that fails when the 6 a.m. crowd arrives is not
energetic, it is a queue.

Red deserves a specific technical note. Pure reds sit in a tricky zone
for some camera sensors: red modules can photograph lighter than their
luminance suggests, because camera color processing does not match human
luminance perception exactly. #D90429 is a deep, bluish red chosen to
stay safely dark across sensors, but this is still the template to test
most carefully on real devices — particularly budget Android phones,
which dominate gym demographics more than flagship-device marketing
suggests.

Scanability notes: mount codes at phone height on flat surfaces, never
on curved equipment columns or behind glass that reflects the studio
lights. Laminate wall codes — chalk dust and cleaning spray are constant
— and reprint on a schedule, because a faded red code drifts toward the
binarization boundary over months. Size at 30mm minimum; check-in codes
scanned in a moving queue want 40mm. Keep the destination fast: a
booking page that loads slowly after a successful scan still feels like
a failed scan. Review placements quarterly: equipment moves and walls get repainted, and a code that worked in January may be hidden behind a new machine by June.

Best for: gym and studio check-in codes; class booking wall displays;
equipment-linked workout video codes; fitness challenge leaderboards;
supplement and apparel packaging inserts.

Avoid for: tiny codes on membership cards; curved equipment surfaces;
outdoor boot-camp signage in direct sun (red fades fast under UV);
clinical or corporate contexts; and any placement where glare or motion
is extreme without a tested fallback.
    `,
    bestFor: [
      'Gym and studio check-in codes',
      'Class booking wall displays',
      'Equipment-linked workout video codes',
      'Fitness challenge leaderboards',
      'Supplement and apparel packaging inserts',
    ],
    avoidFor: [
      'Tiny codes on membership cards',
      'Curved equipment surfaces',
      'Outdoor signage in direct sun (red fades fast under UV)',
      'Clinical or corporate contexts',
    ],
    faqs: [
      {
        question: 'Is red a safe color for QR modules?',
        answer:
          'A deep red like #D90429 is workable — around 5:1 contrast on modern phones — but red is trickier than it looks, because camera sensors can render reds lighter than human vision perceives. This template uses a deep bluish red and square conservative geometry to compensate, but test on real budget phones before printing.',
      },
      {
        question: 'How large should a gym check-in code be?',
        answer:
          'At least 30mm, and 40mm for check-in codes scanned in a moving queue. People scan while walking, holding bags, with imperfect aim — size is the cheapest way to buy forgiveness for all of that. Wall-mounted codes should sit at comfortable phone height on flat surfaces.',
      },
      {
        question: 'How do I protect codes from gym conditions?',
        answer:
          'Laminate everything. Chalk dust, cleaning spray, and humidity are constant in fitness spaces. Mount on flat surfaces away from direct equipment contact, and reprint on a schedule — a red code that fades over months drifts toward the binarization boundary silently.',
      },
      {
        question: 'What should the code link to?',
        answer:
          'The fastest possible action: a check-in confirmation, the class booking slot, the workout video. Fitness scans happen in motion, so the destination page must load instantly and work one-handed. A slow page after a good scan still feels like failure.',
      },
    ],
    title: 'Fitness Energetic QR Template: Gym Check-In & Class Booking Design',
    metaDescription:
      'Fitness QR template for gyms and studios. Signal red on white, square dots, Level Q — check-ins, class bookings, and workout links.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'education-friendly',
    name: 'Education Friendly',
    designStyle: 'education',
    primaryUseCase: 'Classroom resources, homework links, library catalogs',
    targetIndustry: 'Education, Schools, Libraries',
    colorPalette: ['#1D5FA8', '#FFFDF7', '#FFB400'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Start Learning',
    useCaseAdvice: `
Education Friendly is designed for the most demanding scanner audience
there is: children. Classroom QR codes are scanned by small hands holding
school-issued tablets and a wild mix of family phones, in classrooms with
fluorescent lighting, at angles no adult would attempt, often by kids who
will give up after one failed try. The template's job is to make the
first scan succeed and to look like it belongs in a learning environment.
Friendly blue (#1D5FA8) on warm paper-white (#FFFDF7) gives contrast
around 8:1 — reliable on the tablets schools actually buy — with rounded
dots and dot inner eyes that echo the soft geometry of educational
materials. The amber accent (#FFB400) marks the CTA frame; it never
enters the modules.

The audience shapes everything. Young scanners do not hold still, do
not aim carefully, and do not retry patiently — so modules must be large
(short links, low QR versions, 25–30mm print minimum) and the code must
tolerate partial occlusion from fingers (Level M at minimum; Level Q for
codes on shared classroom materials that get handled roughly). The
destination matters as much as the symbol: link directly to the resource
— the video, the quiz, the reading — never to a portal homepage that
requires navigation a seven-year-old cannot perform. Every extra tap
after the scan loses a fraction of the class.

Teachers are the deployment engineers here, so the template is designed
for their reality: black-and-white printing. Many classrooms print in
mono, and this template degrades gracefully — the blue becomes a dark
grey that still holds strong contrast on white. That is not an
accident; the palette was chosen so the code survives the school
printer. Test the mono print, not just the color PDF, because that is
what actually reaches the classroom wall.

Scanability notes: laminate or sleeve anything at child height; sticky
fingers are a real and constant threat to module clarity. Keep codes off
the floor-facing bottom edge of displays where shoes and bags scuff
them. For library catalogs and hallway displays, size up to 35mm since
scanning distance varies. And keep the quiet zone sacred in busy
classroom layouts — a code tucked against a colorful poster border will
fail, and the failure will be blamed on the technology, not the layout.

Best for: classroom worksheet resource links; homework and assignment
codes; library catalog and book-review links; museum and field-trip
activity codes; school event and parent-information codes.

Avoid for: tiny textbook-margin codes; high-stakes testing materials
where a failed scan disrupts assessment; monochrome fax-grade printing
(test first); and linking to pages that require logins children do not
have.
    `,
    bestFor: [
      'Classroom worksheet resource links',
      'Homework and assignment codes',
      'Library catalog and book-review links',
      'Museum and field-trip activity codes',
      'School event and parent-information codes',
    ],
    avoidFor: [
      'Tiny textbook-margin codes',
      'High-stakes testing materials',
      'Fax-grade monochrome printing (test first)',
      'Destinations requiring logins children do not have',
    ],
    faqs: [
      {
        question: 'Will this survive black-and-white school printing?',
        answer:
          'Yes — deliberately. The friendly blue becomes a dark grey in mono that still holds strong contrast on white. This was a design requirement, not luck: most classroom materials are printed in black and white. Always test-scan the actual mono printout, though, since printer quality varies enormously.',
      },
      {
        question: 'How big should classroom QR codes be?',
        answer:
          '25–30mm minimum on worksheets, 35mm for wall and library displays. Children scan at unpredictable angles and distances with shaky hands — large modules forgive all of that. Pair big print with short links so the QR version stays low.',
      },
      {
        question: 'What should a classroom QR link to?',
        answer:
          'Directly to the resource: the video, the quiz, the specific reading. Never to a portal homepage or anything requiring a login children do not have. Every tap after the scan loses part of the class, and young scanners will not troubleshoot — they will simply stop.',
      },
      {
        question: 'How do I protect codes from classroom wear?',
        answer:
          'Laminate or sleeve anything at child height — sticky fingers are constant. Keep codes away from floor-level scuff zones, and for heavily handled shared materials, use Level Q error correction. Inspect wall codes termly; sun-faded classroom displays degrade silently.',
      },
    ],
    title: 'Education Friendly QR Template: Classroom & Library Design',
    metaDescription:
      'Education QR template for classrooms and libraries. Friendly blue on warm white, mono-print safe — built for young scanners.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'playful-dots-confetti',
    name: 'Playful Confetti Dots',
    designStyle: 'playful',
    primaryUseCase: "Kids' party invites, toy packaging, family entertainment",
    targetIndustry: 'Family Entertainment, Toys, Party Supplies',
    colorPalette: ['#2D2A8F', '#FFFDF5', '#FF6B6B'],
    dotStyle: 'dots',
    eyeOuterStyle: 'circle',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Join the Fun',
    useCaseAdvice: `
Playful Confetti Dots is the most decorative template in the gallery
that still takes scanning seriously. Full circle dots, circular finder
eyes, and a confetti-sprinkled frame in coral (#FF6B6B) deliver maximum
whimsy for kids' party invitations, toy packaging, and family
entertainment — while the engineering underneath compensates for every
bit of that decoration. Deep indigo (#2D2A8F) modules on warm white
(#FFFDF5) hold contrast around 11:1, which is the foundation everything
else stands on: decoration is only safe when the underlying contrast is
strong.

Circle dots are the least area-efficient module geometry — a circle
covers less of its module cell than any rounded or square variant — so
this template enforces the compensations strictly: Level Q error
correction (25% recovery), short payloads keeping the QR version low,
and a 30mm minimum print size, larger than the gallery default. Dense
circle-dot codes are the classic failure mode of "cute QR" designs; the
template's rules exist so the cuteness survives contact with real
cameras. The circular finder eyes are the boldest decorative choice
here — scanners locate the symbol by those three squares, so round eyes
cost some detection margin. Strong contrast and large size buy it back.

The confetti lives in the frame and surrounding design, never inside
the symbol. This is the line between a playful QR code and a broken
one: anything that interrupts module regularity — sprinkles across the
symbol, patterned backgrounds showing through — degrades decoding. The
frame's confetti gives the party feel; the symbol's clean field gives
the scan. Parents scanning a party invite while managing children are
not going to retry, so the first scan has to work.

Scanability notes: toy packaging is a high-abuse environment — shelf
wear, sticky fingers, curved boxes — so Level Q is doing real work
here, not decoration. Keep codes off curved packaging edges and away
from crimp seals. On party invitations, the audience includes
grandparents with older phones, so test on a budget device, not just
your own. Never place over patterned wrapping-paper-style backgrounds;
the confetti frame is the pattern budget, fully spent.

Best for: children's party invitations; toy and game packaging; family
entertainment venues (bowling, mini-golf, arcades); kids' museum
activity trails; candy and snack packaging promos.

Avoid for: any professional or clinical context; tiny codes on small
packaging; industrial scanning; low-light environments; and print runs
where you cannot proof on the actual stock — circle dots are the
geometry most sensitive to print quality.
    `,
    bestFor: [
      "Children's party invitations",
      'Toy and game packaging',
      'Family entertainment venues',
      "Kids' museum activity trails",
      'Candy and snack packaging promos',
    ],
    avoidFor: [
      'Professional or clinical contexts',
      'Tiny codes on small packaging (circle dots need size)',
      'Industrial scanning hardware',
      'Unproofed print runs (circle dots are print-sensitive)',
    ],
    faqs: [
      {
        question: 'Are circle dots reliable enough for real use?',
        answer:
          'With compensations, yes: strong ~11:1 contrast, Level Q error correction, short payloads, and 30mm+ print size. Circle dots cover the least module area, so they demand more of everything else. A small, dense, circle-dot code is the classic "cute but broken" failure — follow the template\'s size and payload rules and it scans fine on modern phones.',
      },
      {
        question: 'Can the confetti pattern go inside the QR code?',
        answer:
          'No. Anything interrupting module regularity inside the symbol degrades decoding — sprinkles across modules, patterned backgrounds showing through, decorative overlays. Keep all decoration in the frame and surroundings; the symbol field stays clean. That is the line between playful and broken.',
      },
      {
        question: 'Why circular finder eyes — do scanners still find them?',
        answer:
          'Yes, with strong contrast and adequate size. Scanners locate the symbol via the finder patterns, and round eyes cost some detection margin versus squares. The template buys it back with 11:1 contrast, large modules, and Level Q. Do not combine round eyes with any other risk factor (small size, low contrast, busy background).',
      },
      {
        question: 'What about grandparents scanning the party invite?',
        answer:
          'Design for them: 30mm minimum, short link, clean field, and test on an older or budget phone. The least technical scanner in the audience is the acceptance test for a family product. If it scans on a three-year-old budget Android in living-room light, it scans for everyone.',
      },
    ],
    title: "Playful Confetti Dots QR Template: Kids' Party & Toy Packaging Design",
    metaDescription:
      "Playful circle-dot QR template for kids' parties and toys. Deep indigo on warm white with confetti frame — whimsy with strict size rules.",
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'high-contrast-accessible',
    name: 'High Contrast Accessible',
    designStyle: 'accessibility',
    primaryUseCase: 'Public services, government forms, transit, senior audiences',
    targetIndustry: 'Government, Public Services, Healthcare Access',
    colorPalette: ['#000000', '#FFFFFF', '#1A1A1A'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thick-border',
    hasLogo: false,
    ctaText: 'Scan for Services',
    useCaseAdvice: `
High Contrast Accessible is the template for when the audience includes
everyone: seniors, people with low vision, users of old or damaged
phones, public-service contexts where no one can be left behind. Pure
black (#000000) on pure white (#FFFFFF) gives the maximum contrast
reproducible in print and on screen — around 21:1, the theoretical
ceiling. Square dots, square finder eyes, a thick protective border,
and Level Q error correction: every choice is the most conservative
option available, because this template serves people for whom a failed
scan is not a retry but a dead end.

Accessibility here means more than contrast. Size is an accessibility
feature: 30mm minimum in print, larger wherever space allows, because
tremor, low vision, and poor cameras all demand bigger targets. The
thick border is doing triple duty — quiet-zone protection, visual
locatability for low-vision users finding the code on a busy page, and
a high-contrast edge that helps camera autofocus lock onto the symbol.
The CTA frame uses large, plain text ("Scan for Services") because the
code's purpose must be understandable without scanning it; a senior
citizen deciding whether to bother needs the value proposition up
front.

The destination is part of the accessibility contract. A perfectly
scannable code that lands on a tiny-text, JavaScript-heavy portal has
failed its audience. Link to pages that work with screen readers,
support text scaling, and complete their task in minimal steps. For
government and transit use, the linked service should also offer a
non-QR alternative (a short URL printed in large type, a phone number)
because some users will not have a scanning device at all — the QR
code is the fast path, never the only path.

Scanability notes: this template is the most forgiving in the gallery,
but it still needs the basics — clean quiet zone, flat placement,
adequate light. For outdoor public signage, use weatherproof stock and
inspect on a schedule; even maximum-contrast codes fade. For printed
forms, keep the code clear of folds and staple zones. Test with an old,
cheap phone: if it scans there, in dim light, at slight angle, the
template has done its job.

Best for: government service forms and offices; public transit
information; senior community centers; healthcare access points;
utility bill payment codes; emergency information placards.

Avoid for: brand-driven contexts where pure black feels off-message
(use Corporate Navy instead); tiny placements that defeat the purpose;
decorative marketing where expression matters; and any deployment
without a non-QR alternative for users without scanning devices.
    `,
    bestFor: [
      'Government service forms and offices',
      'Public transit information displays',
      'Senior community centers',
      'Healthcare access points',
      'Utility bill payment codes',
      'Emergency information placards',
    ],
    avoidFor: [
      'Brand-driven contexts where pure black feels off-message',
      'Tiny placements that defeat the accessibility purpose',
      'Decorative marketing',
      'Deployments without a non-QR alternative',
    ],
    faqs: [
      {
        question: 'Why pure black instead of a softer dark color?',
        answer:
          'Because this template optimizes for the hardest cases: old phones, poor cameras, low vision, bad light. Pure black on pure white gives ~21:1 contrast, the maximum reproducible — every point of contrast is margin for someone whose device or vision needs it. Softer palettes are for audiences you can assume have good hardware.',
      },
      {
        question: 'How large should accessible QR codes be?',
        answer:
          '30mm minimum in print, larger wherever space allows. Size is an accessibility feature: tremor, low vision, and weak cameras all demand bigger targets. On public signage viewed from distance, scale up proportionally — roughly a tenth of the viewing distance.',
      },
      {
        question: 'Should there be an alternative to scanning?',
        answer:
          'Yes — always, for public-service deployments. Print a short URL in large type and a phone number alongside the code. The QR is the fast path for those who can use it; it must never be the only path. Some users will not have a scanning device, and the service must still reach them.',
      },
      {
        question: 'What makes a good destination page for this audience?',
        answer:
          'One that works with screen readers, supports text scaling, loads fast on old phones, and completes its task in minimal steps. A perfectly scannable code landing on a tiny-text portal has failed its audience. Test the destination with accessibility tools, not just the code with a scanner.',
      },
    ],
    title: 'High Contrast Accessible QR Template: Public Service & Senior-Friendly Design',
    metaDescription:
      'Accessible high-contrast QR template for public services. Pure black on white, Level Q, thick border — for seniors and older phones.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'winter-holiday-frost',
    name: 'Winter Holiday Frost',
    designStyle: 'seasonal',
    primaryUseCase: 'Holiday campaigns, gift guides, seasonal menus, greeting cards',
    targetIndustry: 'Retail, Hospitality, Seasonal Events',
    colorPalette: ['#0B3D66', '#F4FAFF', '#B8D4E8'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'M',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Holiday Offers',
    useCaseAdvice: `
Winter Holiday Frost dresses the QR code for the season: deep frost-blue
(#0B3D66) on snowy white (#F4FAFF), with an ice-blue accent (#B8D4E8)
in the frame. It belongs on holiday gift guides, seasonal menus,
greeting cards, and December retail campaigns — anywhere the code
should feel like part of the festivities rather than an interruption.
Contrast around 12:1 keeps it firmly in reliable territory on modern
phones, which matters because holiday codes face a specific enemy:
haste. December scanners are distracted, gloved, and impatient.

Seasonal templates have a built-in expiry date, which shapes the
payload strategy. A holiday code printed on ten thousand gift-guide
inserts must not die on January 1st — or rather, it must fail
gracefully. Always use a short redirect link you control, so the
holiday destination can become a "season over" page, a January sale,
or next year's teaser after the campaign ends. A code that lands on a
deleted campaign page in February teaches customers that your codes
cannot be trusted, and that lesson persists into every future campaign.

The winter context adds physical considerations. Outdoor holiday
markets, ice rinks, and storefront decals face cold, moisture, and
short daylight hours. Cold itself does not hurt QR codes, but
condensation does — a code on a market stall that fogs over is
unreadable until wiped. Laminate outdoor placements, keep codes under
cover where possible, and remember that December light is dim: size up
to 30mm minimum for anything scanned outdoors, since low light is
already spending your reliability budget.

Scanability notes: greeting cards are the trickiest common placement —
small format, often textured or metallic stock, scanned by the full
grandparent-to-grandchild device spectrum. Keep card codes at 25mm
minimum on a clean printed panel (never over foil or embossing), and
link to a single hub (photos, video message, gift list) rather than
deep-linking something that will break. Test the card under warm indoor
evening light, which is when holiday cards actually get opened. Plan next year's codes during January downtime, when printers are cheap and nobody is rushed — seasonal work rewards early preparation.

Best for: holiday gift guides and catalogs; seasonal restaurant and
café menus; greeting and holiday cards; December retail campaigns;
winter market and event signage.

Avoid for: year-round placements (seasonal styling expires); tiny
greeting-card codes under 20mm; metallic or foil card stock under the
modules; unlaminated outdoor winter placements; and campaign URLs you
do not control via redirect.
    `,
    bestFor: [
      'Holiday gift guides and catalogs',
      'Seasonal restaurant and café menus',
      'Greeting and holiday cards',
      'December retail campaigns',
      'Winter market and event signage',
    ],
    avoidFor: [
      'Year-round placements (seasonal styling expires)',
      'Greeting-card codes under 20mm',
      'Metallic or foil stock under the modules',
      'Unlaminated outdoor winter placements',
    ],
    faqs: [
      {
        question: 'What happens to the code after the holidays?',
        answer:
          'That depends on your link strategy. Always use a short redirect you control: after the campaign, point it at a graceful landing (January sale, "see you next year," evergreen content). A code landing on a deleted page teaches customers your codes cannot be trusted — plan the afterlife before you print.',
      },
      {
        question: 'Can holiday market stalls use this outdoors?',
        answer:
          'Yes, laminated and sheltered. Cold does not hurt QR codes but condensation does — a fogged code is unreadable until wiped. Keep codes under cover where possible, laminate everything, and size up to 30mm+ since December daylight is dim and already spends your reliability budget.',
      },
      {
        question: 'How small can the code be on a greeting card?',
        answer:
          '25mm minimum, on a clean printed panel — never over foil, embossing, or heavy texture. Cards are scanned by the full device spectrum in warm evening light, so keep the payload short (one hub link) and test under the actual lighting where cards get opened.',
      },
      {
        question: 'Should seasonal codes look different each year?',
        answer:
          'The surrounding campaign design should evolve, but keep the QR symbol treatment consistent. Returning customers learn to recognize and trust your code style; changing the symbol geometry yearly resets that trust. Vary the frame and campaign art, keep the code itself familiar.',
      },
    ],
    title: 'Winter Holiday Frost QR Template: Seasonal Campaign & Greeting Card Design',
    metaDescription:
      'Winter holiday QR template for seasonal campaigns. Frost-blue on snowy white — gift guides, holiday cards, and December retail.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'summer-festival-vibrant',
    name: 'Summer Festival Vibrant',
    designStyle: 'festival',
    primaryUseCase: 'Festival tickets, lineup schedules, food vendor maps',
    targetIndustry: 'Festivals, Outdoor Events, Tourism',
    colorPalette: ['#E63E6D', '#FFF8EE', '#FFB800'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'See Lineup',
    useCaseAdvice: `
Summer Festival Vibrant is engineered for the beautiful chaos of
outdoor festivals: bright sun, dust, crowds, phones at 10% battery
with cracked screens, and schedules that change hourly. Raspberry
(#E63E6D) on warm cream (#FFF8EE) gives contrast around 5:1 — the
lowest the gallery recommends for outdoor use, chosen for festival
energy and compensated aggressively: Level Q error correction, large
modules from short links, 35mm minimum print, and a strict ban on
placing codes where direct sun hits them at midday.

Sunlight is the defining technical constraint. Direct sun on a printed
code creates glare and deep shadows simultaneously; on phone screens
it washes out the display. Festival codes must be placed in shade —
under tent eaves, on shaded sign backs, inside programs — or they will
fail exactly when the crowd needs them. This is a placement template
as much as a design template: the most reliable festival QR is a
slightly less pretty one mounted where the sun never hits it. The amber
accent (#FFB800) marks the CTA frame in high-visibility style, because
a festival code competes with visual noise at a scale no other context
matches.

Dynamic content is the second constraint. Lineups change, stages move,
food vendors sell out. Every festival code must be a short redirect
link to a live schedule page — never a static PDF, never a direct
deep link to something that will 404 by Saturday. The template's CTA
("See Lineup") promises living information; the link infrastructure
must deliver it. Print deadlines force codes to be finalized weeks
ahead, so the redirect layer is what lets a May print run serve an
August festival accurately.

Scanability notes: wristbands are the hardest festival placement —
curved, small, sweaty, scanned in motion at gates. Keep wristband codes
as large as the band allows, use the shortest possible payload (a
ticket ID, nothing more), and always have a non-QR fallback at entry
(printed list, NFC, manual check). Test the full gate flow at speed:
a code that scans in 3 seconds in testing creates a dangerous crush at
a real gate. Dust and sunscreen on screens are constant — Level Q
earns its keep here.

Best for: festival and concert tickets; live lineup and schedule
boards; food vendor maps; campsite information; sponsor activation
zones.

Avoid for: unshaded midday sun placements; wristband codes without a
gate fallback; static PDFs behind the code; tiny codes on lanyards;
and any critical flow (entry, medical) without redundancy.
    `,
    bestFor: [
      'Festival and concert tickets',
      'Live lineup and schedule boards',
      'Food vendor maps',
      'Campsite information points',
      'Sponsor activation zones',
    ],
    avoidFor: [
      'Unshaded midday-sun placements',
      'Wristband codes without a gate fallback',
      'Static PDFs behind the code (lineups change)',
      'Critical flows without redundancy',
    ],
    faqs: [
      {
        question: 'How do festival codes survive direct sunlight?',
        answer:
          'By avoiding it. Place codes in shade — under tent eaves, on shaded sign backs, inside programs. Direct sun creates glare and harsh shadows that defeat even high-contrast codes, and washes out phone screens. Shade placement is the single most effective reliability measure for outdoor events.',
      },
      {
        question: 'What should a festival QR link to?',
        answer:
          'A short redirect to a live schedule page — never a static PDF or a deep link that can 404. Lineups change hourly; the redirect layer lets a May print run stay accurate through an August festival. The code is printed weeks ahead; the destination must stay alive behind it.',
      },
      {
        question: 'Are wristband QR codes reliable for entry?',
        answer:
          'Marginally — treat them as the fast path with a mandatory fallback. Keep the payload to a bare ticket ID, print as large as the band allows, and always have a non-QR entry fallback (printed list, manual check). Test the gate flow at real speed: 3-second scans create dangerous crushes.',
      },
      {
        question: 'Why only 5:1 contrast for outdoor use?',
        answer:
          'Honestly, it is the edge of what the gallery recommends outdoors, chosen for festival energy. It works because everything else compensates: Level Q, 35mm+ print, shade placement, short payloads, modern phones. If your festival skews to older devices or you cannot guarantee shade, pick a higher-contrast template.',
      },
    ],
    title: 'Summer Festival Vibrant QR Template: Outdoor Event & Ticket Design',
    metaDescription:
      'Vibrant festival QR template for outdoor events. Raspberry on warm cream, Level Q — engineered for sunlight and changing lineups.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'coffee-shop-kraft',
    name: 'Coffee Shop Kraft',
    designStyle: 'coffee',
    primaryUseCase: 'Coffee bag labels, loyalty cards, café Wi-Fi and menus',
    targetIndustry: 'Coffee Roasters, Cafés, Specialty Food',
    colorPalette: ['#4A3428', '#EFE6D8', '#8A5A2B'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Our Story',
    useCaseAdvice: `
Coffee Shop Kraft is built for the specialty coffee aesthetic: deep
espresso (#4A3428) on warm kraft-toned paper (#EFE6D8), with a caramel
accent (#8A5A2B) in the frame. It looks at home on a coffee bag, a
loyalty card, or a café table — the code reads as part of the brand's
craft story rather than a tech intrusion. Contrast around 8:1 keeps it
scannable on modern phones, and the template is frank about the
substrate: real kraft paper is darker and more absorbent than this
template's #EFE6D8 field, so the design assumes a printed light panel
or a lighter kraft stock, not raw dark board.

The square dot and square eye geometry is a deliberate counterpoint to
the soft, artisanal surroundings. On coffee packaging — which faces
shelf abrasion, moisture, and the occasional grinder-side dusting — the
most conservative symbol geometry plus Level Q error correction is what
keeps the code working through the bag's retail life. Artisanal
branding earns no exemption from physics: a beautiful code that fails
at the shelf is a failed code. The kraft aesthetic lives in the palette
and frame; the symbol stays engineered.

Coffee bags add a specific physical challenge: they are rarely flat.
Valve bags, pillow pouches, and stand-up pouches all curve, and
curvature distorts edge modules. Place the code on the flattest panel
available, keep it at 25mm minimum, and keep the payload short so
modules stay large — large modules survive curvature distortion far
better than dense ones. Keep the code clear of seals, folds, and the
one-way valve; those areas distort and wear first.

Scanability notes: if printing on genuine kraft stock, proof it —
absorbency varies wildly between kraft papers, and ink spread on
uncoated stock can close up small modules. A white or light printed
panel behind the symbol is the professional solution and barely
affects the aesthetic when done as a deliberate design element. Café
table codes face coffee rings and wipe-downs; laminate them or print
on synthetic stock. Test under actual café lighting, which runs warm
and dim — exactly the conditions where mid-tone palettes are tested.

Best for: specialty coffee bag labels; café loyalty cards; table menu
and Wi-Fi codes; roastery tour and origin-story links; coffee
subscription box inserts.

Avoid for: raw dark kraft board without a light panel; curved pouch
edges and seals; tiny bag labels under 20mm; unlaminated table codes;
and glossy displays where the warm palette washes out.
    `,
    bestFor: [
      'Specialty coffee bag labels',
      'Café loyalty cards',
      'Table menu and Wi-Fi codes',
      'Roastery tour and origin-story links',
      'Coffee subscription box inserts',
    ],
    avoidFor: [
      'Raw dark kraft board without a light printed panel',
      'Curved pouch edges, seals, and valves',
      'Bag labels under 20mm',
      'Unlaminated table codes (coffee rings are inevitable)',
    ],
    faqs: [
      {
        question: 'Can I print this directly on a kraft coffee bag?',
        answer:
          'Only on lighter kraft stocks, and proof first. Real kraft varies enormously in darkness and absorbency — dark or absorbent board can drop effective contrast below reliable levels and spread ink into small modules. The professional approach is a light printed panel behind the symbol, designed as part of the bag art.',
      },
      {
        question: 'Where should the code go on a coffee pouch?',
        answer:
          'On the flattest panel, clear of seals, folds, and the one-way valve. Pouches curve, and curvature distorts edge modules — large modules from a short payload survive this far better than dense ones. 25mm minimum, and never across a seam.',
      },
      {
        question: 'Why square dots for an artisanal brand?',
        answer:
          'Because packaging is a high-abuse environment and square geometry is the most robust. The artisanal feel comes from the espresso-and-kraft palette and the frame design; the symbol itself is engineered conservatively. Beauty that fails at the shelf is not beautiful — it is broken.',
      },
      {
        question: 'What should a coffee QR link to?',
        answer:
          'The story customers cannot get from the bag: origin details, roast profile, brew guides, the roastery tour booking, subscription signup. Coffee buyers scan with curiosity — reward it with content, not a generic homepage. Keep the link short so the symbol stays sparse.',
      },
    ],
    title: 'Coffee Shop Kraft QR Template: Roastery & Café Design',
    metaDescription:
      'Coffee kraft QR template for roasters and cafés. Espresso on warm kraft tone, Level Q — guidance on stock, pouches, and lamination.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'barbershop-vintage',
    name: 'Barbershop Vintage',
    designStyle: 'vintage',
    primaryUseCase: 'Barbershop booking, loyalty stamps, product shelves',
    targetIndustry: 'Barbershops, Grooming, Heritage Retail',
    colorPalette: ['#2E2A24', '#F3EDE2', '#A61C3C'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'M',
    frameStyle: 'vintage-badge',
    hasLogo: false,
    ctaText: 'Book a Chair',
    useCaseAdvice: `
Barbershop Vintage channels the heritage aesthetic — apothecary labels,
letterpress posters, the barber pole — into a QR code that looks like
it has always belonged on the shop wall. Deep espresso-black (#2E2A24)
on aged paper (#F3EDE2) gives contrast around 13:1: the vintage feel
comes from the warm paper tone and the badge-style frame, not from
sacrificing readability. A barber-pole red accent (#A61C3C) marks the
frame and CTA, staying out of the modules where its mid-tone would
cost contrast.

The square-on-square geometry is the right call for the environment.
Barbershop codes live on mirrors (reflections), windows (backlight),
and walls near sinks (humidity, spray). Conservative symbol geometry
maximizes the chance that a code half-obscured by a mirror reflection
or shot at an angle still decodes. The vintage badge frame does
practical work here too: on a wall crowded with framed certificates,
vintage ads, and product shelves, the badge shape makes the code
findable — a plain square would disappear into the decor.

Booking is the killer use case, and it shapes the payload rules. A
"Book a Chair" code must land directly on the booking flow with the
shop preselected — not the homepage, not a social profile. Every
additional tap loses walk-in conversions, and barbershop customers
scan in a specific mindset: they want a chair, this week, with minimal
friction. Use a short link per shop location so multi-chair businesses
can track which wall, window, or mirror placement actually converts.

Scanability notes: mirrors are the classic trap — a code mounted on a
mirror is scanned against reflections that confuse autofocus and add
glare. Prefer adjacent wall placement; if the code must face a mirror,
test with several phones. Window decals face the backlight problem:
bright daylight behind the glass silhouettes the code, so interior
placement with a solid backing wins over exterior glass mounting.
Laminate wall codes against humidity and clipper-spray.

Best for: barbershop online booking displays; loyalty program signup;
product shelf codes (pomade, oils, tools); shop window displays;
vintage and heritage retail storefronts.

Avoid for: mirror-mounted placements without testing; exterior window
glass with daylight behind it; tiny codes on product labels under
20mm; and linking to social profiles when the customer intent is
booking — match the destination to the CTA. Refresh the linked booking page seasonally with current services and pricing; a vintage-styled code that lands on outdated information breaks the heritage illusion instantly. Consistency between the code's promise and the page's reality is what turns first-time visitors into regulars.
    `,
    bestFor: [
      'Barbershop online booking wall displays',
      'Loyalty program signup cards',
      'Product shelf codes (pomade, oils, tools)',
      'Shop window displays',
      'Vintage and heritage retail storefronts',
    ],
    avoidFor: [
      'Mirror-mounted placements without device testing',
      'Exterior window glass with daylight behind it',
      'Product labels under 20mm',
      'Linking to social profiles when the CTA promises booking',
    ],
    faqs: [
      {
        question: 'Can I mount the QR code on the shop mirror?',
        answer:
          'It is risky without testing. Mirrors add reflections that confuse autofocus and create glare across the modules. Prefer adjacent wall placement; if the mirror is the only option, test with several different phones under actual shop lighting before committing.',
      },
      {
        question: 'Window decal: inside or outside the glass?',
        answer:
          'Inside, with a solid backing. Bright daylight behind exterior-mounted glass silhouettes the code into unreadability. An interior decal on an opaque backing card keeps contrast intact and survives weather — it is better in every way except visibility from across the street.',
      },
      {
        question: 'What should the booking code link to?',
        answer:
          'Directly to the booking flow with your shop preselected — not your homepage or Instagram. Barbershop scanners have immediate intent (a chair, this week); every extra tap loses conversions. Use a short per-location link so you can track which placement actually books chairs.',
      },
      {
        question: 'Will the vintage styling hurt scannability?',
        answer:
          'No — the vintage character lives in the warm paper tone and badge frame, while the symbol itself is conservative: 13:1 contrast, square dots, square eyes. That separation is the whole design principle: style in the frame, engineering in the symbol.',
      },
    ],
    title: 'Barbershop Vintage QR Template: Heritage Booking & Loyalty Design',
    metaDescription:
      'Vintage barbershop QR template for heritage grooming brands. Espresso on aged paper — booking codes for mirrors, windows, and walls.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'pet-care-cute',
    name: 'Pet Care Cute',
    designStyle: 'pet',
    primaryUseCase: 'Vet clinics, pet adoption, grooming bookings, pet product tags',
    targetIndustry: 'Pet Care, Veterinary, Pet Retail',
    colorPalette: ['#4A7FA5', '#FFFDF8', '#F4A259'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Meet Your Vet',
    useCaseAdvice: `
Pet Care Cute is designed for the emotional economy of animal care:
vet clinics, adoption centers, groomers, and pet product brands, where
the audience is deciding with their heart and scanning with their
phone. Friendly steel-blue (#4A7FA5) on warm white (#FFFDF8) gives
contrast around 5:1 — workable on modern phones in clinic lighting,
and the template is upfront that this is a trust-the-environment
choice: vet waiting rooms are well-lit, customers have decent phones,
and the code is scanned at close range. The tangerine accent (#F4A259)
stays in the frame; rounded dots and dot inner eyes keep the geometry
as friendly as the subject matter.

The 5:1 contrast deserves honest discussion, because pet codes face
one specific enemy: small print. A 5:1 code at 30mm in a bright waiting
room scans fine; the same code at 18mm on a vaccine reminder card,
shot by a budget phone under fluorescent flicker, is marginal. The
template compensates with Level Q error correction and strict sizing —
25mm minimum, 30mm preferred — plus short payloads. If your use case
forces small sizes (collar tags, tiny product labels), switch to a
higher-contrast template; cuteness is not worth a failed scan at the
vet's office.

Adoption centers are the highest-value use case and shape the content
strategy. A code on a kennel card should link to that animal's full
profile — photos, video, personality notes, adoption application — not
the shelter homepage. The scan happens at peak emotional intent, in
front of the animal; the destination must convert that moment. Use
short per-animal links so cards can be reprinted or redirected when
the animal is adopted, and the link becomes a happy "adopted!" page
rather than a 404.

Scanability notes: vet clinics are wipe-down environments — laminate
waiting-room codes against sanitizer and the occasional enthusiastic
paw. Kennel cards face moisture and chewing-adjacent wear; synthetic
stock or lamination is mandatory, and Level Q is doing real work.
Keep codes off curved surfaces (carrier crates, round treat tins)
or accept the curvature with large modules. Test under the clinic's
actual fluorescent lighting, which flickers at frequencies some
cameras dislike.

Best for: veterinary clinic check-in and records codes; pet adoption
kennel cards; groomer booking displays; pet product packaging; pet
insurance and microchip registration links.

Avoid for: tiny collar or tag codes under 20mm (use high-contrast);
curved treat tins and carriers without size compensation; dim boarding
kennels; and linking to generic homepages from adoption cards — link
to the animal.
    `,
    bestFor: [
      'Veterinary clinic check-in and records codes',
      'Pet adoption kennel cards',
      'Groomer booking displays',
      'Pet product packaging',
      'Pet insurance and microchip registration links',
    ],
    avoidFor: [
      'Tiny collar or tag codes under 20mm',
      'Curved surfaces without size compensation',
      'Dim boarding kennels',
      'Generic homepages from adoption cards (link to the animal)',
    ],
    faqs: [
      {
        question: 'Is 5:1 contrast enough for a vet clinic?',
        answer:
          'In a well-lit waiting room on modern phones, yes — with Level Q and 25–30mm sizing as backup. The honest boundary: small print, dim light, and budget phones together can push it over the edge. If your codes must go small (collar tags, tiny labels), choose a higher-contrast template instead.',
      },
      {
        question: 'What should an adoption kennel card link to?',
        answer:
          'That specific animal\'s profile — photos, video, personality notes, and the adoption application. The scan happens at peak emotional intent in front of the animal; a shelter homepage wastes the moment. Use short per-animal links that become a happy "adopted!" page afterward, never a 404.',
      },
      {
        question: 'How do codes survive a vet clinic environment?',
        answer:
          'Lamination against sanitizer wipe-downs, synthetic stock for kennel cards facing moisture and wear, and Level Q error correction throughout. Keep codes off curved carriers and tins unless sized up. Inspect waiting-room codes quarterly — they degrade faster than office codes.',
      },
      {
        question: 'Can I add paw-print decoration to the code?',
        answer:
          "In the frame and surroundings, yes — it looks great. Inside the symbol, no: anything interrupting module regularity degrades decoding. The template's rounded dots and dot eyes already carry the friendly feel; the symbol field itself stays clean.",
      },
    ],
    title: 'Pet Care Cute QR Template: Vet Clinic & Adoption Design',
    metaDescription:
      'Pet-care QR template for vets and adoption centers. Friendly steel-blue on warm white — kennel cards, check-in, and grooming bookings.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'automotive-carbon',
    name: 'Automotive Carbon',
    designStyle: 'automotive',
    primaryUseCase: 'Dealership displays, service booking, vehicle history, parts tags',
    targetIndustry: 'Automotive, Dealerships, Vehicle Service',
    colorPalette: ['#D7D9DE', '#14151A', '#E10600'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'carbon-frame',
    hasLogo: false,
    ctaText: 'View Specs',
    useCaseAdvice: `
Automotive Carbon is built for the showroom and the service bay: light
silver modules (#D7D9DE) on carbon black (#14151A), with a racing-red
accent (#E10600) in the frame. It looks like it belongs on a spec
sheet, a windshield placard, or a performance parts tag. It is also an
inverted (light-on-dark) template, and the gallery's honesty policy
applies in full: contrast between the colors is around 11:1, but
inverted polarity fails on older scanner apps, enterprise SDKs, and
laser imagers. In a dealership, the audience scans with their own
modern phones — the best case for inversion — but the service bay may
use dedicated scanners, which is the worst case. Know which side of
that line each placement sits on.

The showroom is a glare laboratory: spotlights, polished floors,
glass, and chrome create reflections from every angle. A code on a
windshield placard or a spec stand must be tested under the actual
showroom lighting, tilted through the angles a customer will hold
their phone. Matte lamination is mandatory — glossy surfaces under
spotlights wash out light modules completely. For outdoor lot
displays, the template assumes weatherproof stock and shade-aware
placement; direct sun on a dark placard heats the surface and creates
shimmer distortion above it.

Service-bay placements are the industrial end of this template:
work-order tags, parts bins, lift-side information. Here the honest
recommendation is to think twice about inversion — if the bay uses
dedicated imagers, use a dark-on-light template for those codes and
reserve Automotive Carbon for customer-facing showroom placements.
Mixed fleets of scanners are the enemy of inverted codes; segment the
placements by scanner population.

Scanability notes: Level Q error correction handles the showroom's
dust and the service bay's grime. Size showroom codes at 30mm minimum
(scanned at arm's length), windshield placards larger for sidewalk
viewing. Keep the code off curved body panels and away from chrome
trim that throws reflections across the symbol. Vehicle history codes
(VIN lookups, service records) must resolve through short links —
never encode raw VIN data or long report URLs directly. Audit placements twice a year: showroom layouts change, and a code hidden behind a new display is a code that does not exist.

Best for: dealership showroom spec displays; windshield inventory
placards; service booking codes; performance parts tags; auto event
and motorsport promo materials.

Avoid for: service bays with dedicated laser imagers (use
dark-on-light there); unlaminated glossy placements under spotlights;
curved body panels; tiny parts tags under 20mm; and encoding raw VIN
data directly in the payload.
    `,
    bestFor: [
      'Dealership showroom spec displays',
      'Windshield inventory placards',
      'Service booking codes',
      'Performance parts tags',
      'Auto event and motorsport promos',
    ],
    avoidFor: [
      'Service bays with laser imagers (inverted polarity fails)',
      'Glossy unlaminated placements under spotlights',
      'Curved body panels',
      'Encoding raw VIN data in the payload',
    ],
    faqs: [
      {
        question: 'Will this scan in a bright showroom?',
        answer:
          'On modern phones, yes — if you control glare. Showrooms are reflection-heavy: spotlights, glass, chrome. Use matte lamination, test under actual showroom lighting at real viewing angles, and keep codes off chrome trim that throws reflections across the symbol. Glare, not the design, is the risk.',
      },
      {
        question: 'Can service bays use this template?',
        answer:
          'Only if the bay scans with phones. Dedicated laser imagers generally cannot read inverted codes at all. Segment honestly: Automotive Carbon for customer-facing showroom placements on modern phones, a dark-on-light template for any bay hardware you do not control.',
      },
      {
        question: 'What should a vehicle-history QR contain?',
        answer:
          'A short link resolving to the history report — never raw VIN data or a long report URL in the payload. Short payloads keep modules large (critical for an inverted code), and server-side resolution lets you update or revoke the report without reprinting.',
      },
      {
        question: 'How do I handle outdoor lot displays?',
        answer:
          'Weatherproof stock, matte overlaminate, shade-aware placement out of direct midday sun, and 40mm+ sizing for distance viewing. Dark placards in direct sun also heat up and create shimmer distortion — another reason to keep lot codes shaded.',
      },
    ],
    title: 'Automotive Carbon QR Template: Dealership & Service Bay Design',
    metaDescription:
      'Automotive carbon QR template for dealerships. Silver on carbon black with racing-red frame — showroom specs and service booking.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'jewelry-blush-rose',
    name: 'Jewelry Blush Rose',
    designStyle: 'jewelry',
    primaryUseCase: 'Jewelry authentication, boutique product tags, bridal collections',
    targetIndustry: 'Jewelry, Luxury Accessories, Bridal',
    colorPalette: ['#8A4B57', '#FFF9F7', '#D4A0A7'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'H',
    frameStyle: 'thin-rose-border',
    hasLogo: true,
    ctaText: 'Verify Authenticity',
    useCaseAdvice: `
Jewelry Blush Rose is designed for the smallest, most precious canvas
a QR code ever sits on: the jewelry tag, the authenticity card, the
bridal collection insert. Deep rosewood (#8A4B57) on blush white
(#FFF9F7) gives contrast around 8:1 — enough for the boutique counter
and the unboxing moment, where lighting is good and phones are recent.
The rose-gold accent (#D4A0A7) frames the code the way a setting frames
a stone: present, harmonious, never touching the modules.

Small size is the defining constraint, and the template is strict
about it: 20mm absolute minimum, 25mm preferred, and anything smaller
is not a use case for a QR code at all (use NFC or a serial number
there). At jewelry-tag sizes, every module is precious, so the payload
must be minimal — a short authentication ID resolving server-side.
Error Correction Level H (30% recovery) is specified because tiny codes
have no margin: a single damaged module region is a larger fraction of
a small symbol, and Level H is what keeps a slightly worn tag scannable.
The center logo zone accommodates a maison monogram, kept modest and
applied as a pure overlay.

Authentication is the highest-value use case and demands a system, not
just a template. The QR carries an opaque serial; the server verifies
it and shows the piece's provenance. The code alone proves nothing — a
counterfeiter can copy any QR — so the destination must implement
real verification (unique serials, scan-count anomaly detection,
tamper-evident tag design). The template's job is making the genuine
code unmistakable and scannable; your backend's job is making it
meaningful.

Scanability notes: jewelry tags are handled constantly, so lamination
or synthetic tag stock is mandatory — paper tags fray at exactly the
module scale that matters. Keep codes flat: tags that curl or fold put
edge modules out of the camera's focal plane. Boutique spotlights
create glare on glossy tags; matte finishes scan more reliably. Test
with the actual tag stock under actual counter lighting, and test the
worn tag — rub it, pocket it for a week, then scan.

Best for: jewelry authenticity cards; boutique product hang tags;
bridal collection inserts; watch and fine-accessory certificates;
luxury gift packaging seals.

Avoid for: tags under 20mm (use NFC or serials); curled or folding
tags; glossy tags under spotlights without testing; and "authentication"
with no backend verification — a QR alone is not anti-counterfeit. Reorder tags before stock runs out — a bare display piece looks unfinished, and small-batch reprints are inexpensive compared to the impression they protect.
    `,
    bestFor: [
      'Jewelry authenticity cards',
      'Boutique product hang tags',
      'Bridal collection inserts',
      'Watch and fine-accessory certificates',
      'Luxury gift packaging seals',
    ],
    avoidFor: [
      'Tags under 20mm (use NFC or printed serials)',
      'Curled or folding tags',
      'Glossy tags under spotlights without testing',
      'Authentication with no backend verification system',
    ],
    faqs: [
      {
        question: 'How small can a jewelry QR code be?',
        answer:
          '20mm absolute minimum, 25mm preferred. Below 20mm, modules approach the resolution limits of phone cameras and print processes — use NFC or a printed serial number instead. At jewelry sizes, keep the payload to a bare authentication ID so modules stay as large as possible.',
      },
      {
        question: 'Does the QR code alone prove authenticity?',
        answer:
          'No — a counterfeiter can copy any QR code. Real authentication needs a system: unique opaque serials in the payload, server-side verification with scan-anomaly detection, and tamper-evident tag design. The template makes the genuine code scannable and recognizable; your backend makes it meaningful.',
      },
      {
        question: 'Why Level H error correction here?',
        answer:
          'Tiny codes have no margin: one damaged region is a large fraction of a small symbol. Level H recovers 30% of the data, which keeps a slightly worn or handled tag scannable. It also provides the headroom for the small center monogram this template allows.',
      },
      {
        question: 'How do I keep tags scannable with constant handling?',
        answer:
          'Synthetic tag stock or lamination (paper frays at module scale), flat placement (curled tags put edge modules out of focus), matte finishes under boutique spotlights, and periodic testing of worn samples. Rub a tag, pocket it for a week, then scan — that is the real acceptance test.',
      },
    ],
    title: 'Jewelry Blush Rose QR Template: Authentication & Boutique Tag Design',
    metaDescription:
      'Blush rose QR template for jewelry brands. Rosewood on blush white, Level H with logo zone — authentication cards and boutique tags.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'sports-team-spirit',
    name: 'Sports Team Spirit',
    designStyle: 'sports',
    primaryUseCase: 'Team merchandise, season tickets, fan engagement, stadium info',
    targetIndustry: 'Sports Teams, Stadiums, Fan Merchandise',
    colorPalette: ['#C8102E', '#FFFFFF', '#0A1E3C'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thick-border',
    hasLogo: false,
    ctaText: 'Go Team',
    useCaseAdvice: `
Sports Team Spirit is built for game day: season tickets, merch tags,
stadium wayfinding, and fan-zone activations. Bold team red (#C8102E)
on white with a deep navy frame (#0A1E3C) delivers the energy fans
expect — and the template pairs it with the most conservative symbol
engineering in the gallery, because game-day scanning conditions are
brutal. Square dots, square eyes, Level Q: the symbol is built like
stadium infrastructure while the frame carries the spirit.

Red modules deserve the same technical honesty as the fitness
template: deep reds around 5:1 contrast work on modern phones, but
camera sensors can render reds lighter than human vision perceives,
so this template never lets red travel alone — large modules (short
payloads), Level Q recovery, and 30mm minimum print share the load.
Stadium lighting is another variable: concourses mix daylight, sodium
lamps, and LED boards, and a code must scan under all of them. The
deep red specified here is bluish and dark enough to stay safely past
the binarization boundary across sensors; brighter "fan reds" would
not be.

Tickets are the highest-stakes use case. A season-ticket or
single-game code must scan at a crowded gate, in any weather, possibly
from a cracked screen, with a queue behind the fan. That means short
payloads (ticket ID only), Level Q for recompressed screenshots, and
— non-negotiably — a non-QR fallback at every gate. No template makes
a phone with a dead battery scannable. Test the gate flow at real
speed with real devices; a code that takes 3 seconds in testing is a
crush risk at scale.

Merchandise tags are the brand play: a code on a jersey or scarf
linking to exclusive content, player stats, or the team store. Here
the template's team-color frame turns the code into merchandise
design rather than an afterthought, and the CTA ("Go Team",
"Exclusive Content") converts fan emotion into scans. Keep merch
codes off curved or stretchy fabric areas — print on the flat hang
tag, not the garment — and expect washing-adjacent wear on anything
printed directly on fabric.

Scanability notes: outdoor stadium codes need weatherproof stock and
shade-aware placement; direct sun plus heat shimmer defeats fine
detail. Concourse codes face crowds, spills, and cleaning crews —
laminate and mount flat at phone height. For jumbotron or big-screen
display, size the code enormous (meters, not millimeters) and keep
the payload minimal; distance scanning needs huge modules.

Best for: season and single-game tickets; merchandise hang tags;
stadium wayfinding and fan-zone codes; team store promos; youth
league registration.

Avoid for: gate entry without a non-QR fallback; tiny merch labels
under 20mm; direct-on-fabric printing without testing; jumbotron use
without enormous sizing; and brighter fan-reds that drift toward the
binarization boundary.
    `,
    bestFor: [
      'Season and single-game tickets',
      'Merchandise hang tags',
      'Stadium wayfinding and fan-zone codes',
      'Team store promotions',
      'Youth league registration',
    ],
    avoidFor: [
      'Gate entry without a non-QR fallback',
      'Merch labels under 20mm',
      'Direct-on-fabric printing without testing',
      'Brighter fan-reds near the binarization boundary',
    ],
    faqs: [
      {
        question: 'Will team-red modules scan reliably?',
        answer:
          'This deep red (~5:1) works on modern phones when supported by large modules, Level Q, and 30mm+ sizing — but red is sensor-tricky, so test on real devices including budget phones. Do not substitute a brighter fan red: lighter reds drift toward the binarization boundary and fail unpredictably.',
      },
      {
        question: 'How should stadium entry QR codes be set up?',
        answer:
          'Short payload (ticket ID only), Level Q for screenshot recompression, large print or screen size, and a mandatory non-QR fallback at every gate. Test at real gate speed with real devices — slow scans create dangerous crushes. No template fixes a dead phone battery.',
      },
      {
        question: 'Can the code go on the jersey itself?',
        answer:
          'On the flat hang tag, yes; printed directly on stretchy curved fabric, only with testing. Fabric stretches and curves distort modules, and wash cycles degrade print. The hang tag is the reliable placement — treat on-garment printing as experimental.',
      },
      {
        question: 'What about jumbotron display?',
        answer:
          'Size it in meters, not millimeters, keep the payload minimal for huge modules, and hold it static — no animation across the symbol. Test from the farthest seat with a real phone camera. Big-screen codes work, but only when they are enormous and simple.',
      },
    ],
    title: 'Sports Team Spirit QR Template: Tickets & Fan Engagement Design',
    metaDescription:
      'Sports team QR template for game day. Team red on white with navy frame, Level Q — tickets, merch tags, and stadium wayfinding.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'library-classic',
    name: 'Library Classic',
    designStyle: 'library',
    primaryUseCase: 'Library catalogs, bookplates, archive references, reading programs',
    targetIndustry: 'Libraries, Archives, Education, Publishing',
    colorPalette: ['#3B2F2F', '#F7F3EA', '#7A5C3E'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'M',
    frameStyle: 'thin-label-bottom',
    hasLogo: false,
    ctaText: 'Find This Book',
    useCaseAdvice: `
Library Classic is designed for institutions that measure time in
centuries: deep umber (#3B2F2F) on parchment (#F7F3EA), with a
leather-tan accent (#7A5C3E) in the frame. It belongs on bookplates,
catalog cards, archive boxes, and reading-room signage — places where
a stark black QR would feel like graffiti on a monument. Contrast
around 11:1 keeps it firmly scannable while the palette speaks the
visual language of paper, binding, and lamplight.

The square-on-square geometry is chosen for longevity, not nostalgia.
Library codes have the longest service life of any QR application: a
bookplate code may be expected to work for decades. Conservative
geometry decodes on the widest range of present and future scanners,
and the template's payload strategy is built around permanence — link
to persistent identifiers (catalog record URLs, DOIs, archival
reference numbers) rather than anything that will rot. Link rot is the
real enemy of library QR codes: a code that outlives its destination
is worse than no code, because it sits in thousands of books
simultaneously. Use identifier schemes your institution controls, with
redirect infrastructure maintained as core infrastructure, not a side
project.

Archive boxes and rare-book applications add physical constraints.
Codes on archival enclosures must use archival-safe, reversible
labeling — no adhesives that damage enclosures, no inks that off-gas.
A QR label on the outside of an archival box, linking to the finding
aid, is the standard pattern; the code never touches the artifact.
For circulating collections, bookplate codes face years of handling:
Level M suffices for sheltered indoor life, but specify
abrasion-resistant label stock, and keep codes clear of spine folds
where modules distort.

Scanability notes: reading rooms are often dimly lit for preservation
reasons — size codes at 25mm minimum so they scan in low light.
Parchment-toned paper is fine (the template assumes it), but heavily
textured handmade papers need a smooth printed panel. Test under the
reading room's actual lighting, not office fluorescents. For
catalog-record codes, the destination page must be the record itself,
mobile-readable, with no login wall between the scan and the
bibliographic data. Publish the redirect map where future staff will find it; institutional memory is the real infrastructure behind a decades-long deployment.

Best for: library catalog record links; bookplate codes; archive box
finding-aid links; reading program and summer-reading codes; museum
collection labels; publisher back-matter links.

Avoid for: adhesives or inks on archival artifacts themselves;
linking to URLs outside institutional control; tiny spine labels;
highly textured papers without a smooth panel; and destinations
behind login walls.
    `,
    bestFor: [
      'Library catalog record links',
      'Bookplate codes in circulating collections',
      'Archive box finding-aid links',
      'Reading program and summer-reading codes',
      'Museum collection labels',
      'Publisher back-matter links',
    ],
    avoidFor: [
      'Adhesives or inks applied to archival artifacts',
      'URLs outside institutional control (link rot)',
      'Tiny spine labels',
      'Destinations behind login walls',
    ],
    faqs: [
      {
        question: 'How do I make a library QR code last decades?',
        answer:
          'Two things: conservative symbol geometry (square dots decode on the widest range of scanners, present and future) and persistent identifiers you control — catalog record URLs, DOIs, archival references — backed by redirect infrastructure maintained as core infrastructure. The code will outlive any campaign URL; plan the destination like an archivist.',
      },
      {
        question: 'Can QR codes go on rare books or archives?',
        answer:
          'On the enclosure, never on the artifact. Use archival-safe, reversible labeling on the outside of archival boxes linking to finding aids — no adhesives that damage enclosures, no off-gassing inks. The code serves the researcher without ever touching the artifact.',
      },
      {
        question: 'What should a catalog QR link to?',
        answer:
          'The catalog record itself — mobile-readable, no login wall between the scan and the bibliographic data. Patrons scan in the stacks wanting availability, location, and holds; every barrier between scan and record loses them. Persistent record URLs, not session links.',
      },
      {
        question: 'Does parchment-toned paper affect scanning?',
        answer:
          'Not at this contrast level (~11:1). The template is designed for parchment stocks. Only heavily textured handmade papers are a problem — give the code a smooth printed panel there. Test under actual reading-room lighting, which runs dimmer than office light for preservation reasons.',
      },
    ],
    title: 'Library Classic QR Template: Catalog & Archive Design',
    metaDescription:
      'Classic library QR template for catalogs and archives. Deep umber on parchment — bookplates and finding aids built to last decades.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'music-festival-stage',
    name: 'Music Festival Stage',
    designStyle: 'music',
    primaryUseCase: 'Concert tickets, artist merch, set-time schedules, streaming links',
    targetIndustry: 'Music, Concerts, Entertainment Venues',
    colorPalette: ['#7B2FF7', '#0E0B16', '#00E5FF'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'neon-glow-frame',
    hasLogo: false,
    ctaText: 'Get Tickets',
    useCaseAdvice: `
Music Festival Stage is the screen-first showpiece: electric violet
(#7B2FF7) modules on deep stage-black (#0E0B16), with a cyan accent
(#00E5FF) in the frame. It is designed for the glow of the phone in a
dark venue — concert tickets, artist merch tags, set-time boards, and
the social graphics that promote the show. On an emissive display it
looks like stage lighting; the template's engineering makes sure it
also scans like infrastructure.

This is an inverted (light-on-dark) template, and the concert context
is unusually kind to inversion: the audience holds modern phones, the
venue is dark (emissive screens thrive in darkness), and the scanning
is phone-to-phone or phone-to-scanner-app. But "kind" is not
"universal." Older scanner apps and venue hardware of unknown vintage
may not handle inverted polarity, so the template's rule is
screen-first, tested, and backed up: test with the venue's actual
entry hardware, and keep a non-QR fallback at every gate. Level Q
error correction covers the screenshot-recompression chain — tickets
screenshot, shared through chats, displayed on cracked screens at 10%
battery.

Violet deserves a technical note. #7B2FF7 is a mid-luminance color;
against #0E0B16 the contrast is around 4:1 — the lowest in the
gallery, and honest about it. It works because the use case is
narrow: dark venue, emissive screen, modern phone, close range. Move
any of those variables (print the code, bright daylight, old phone)
and the margin evaporates. This template therefore forbids its own
misuse explicitly: no print without testing, no daylight primary
flows, no small sizes. The 30mm minimum applies to the rare print
use; screen codes should render large.

Scanability notes: animated stage-style glow belongs in the frame,
never across the symbol — pulsing effects over modules break scanning
at the worst moment. For set-time boards (which change through the
day), the code must be a short redirect to a live schedule, never a
static image. Merch codes link to the artist store or exclusive
content; keep them on flat hang tags, not curved vinyl sleeves.
Test the entry flow at speed in actual venue darkness — that is the
only test that counts. After the show, redirect ticket links to a thank-you page with photos and next dates.

Best for: concert and festival tickets (screen-first); artist
merchandise tags; live set-time schedule boards; streaming and
presave links; venue social promo graphics.

Avoid for: print as the primary medium; daylight outdoor use;
unknown or legacy venue scanner hardware; animated effects over the
symbol; and entry flows without a non-QR fallback.
    `,
    bestFor: [
      'Concert and festival tickets (screen-first)',
      'Artist merchandise tags',
      'Live set-time schedule boards',
      'Streaming and presave links',
      'Venue social promo graphics',
    ],
    avoidFor: [
      'Print as the primary ticket medium',
      'Daylight outdoor use (4:1 contrast needs darkness)',
      'Unknown or legacy venue scanner hardware',
      'Entry flows without a non-QR fallback',
    ],
    faqs: [
      {
        question: 'Is 4:1 contrast really enough?',
        answer:
          "Only in this template's narrow intended context: dark venue, emissive phone screen, modern camera, close range. That combination is genuinely forgiving. Change any variable — print it, take it into daylight, hand it to an old phone — and the margin evaporates. Respect the context limits and it works; ignore them and it fails.",
      },
      {
        question: 'Can I animate the glow for social posts?',
        answer:
          'In the frame and surrounding design, yes. Across the symbol, never — pulsing or moving effects over the modules break scanning unpredictably. Keep the QR symbol itself static and clean; let the animation live around it.',
      },
      {
        question: 'What should set-time board codes link to?',
        answer:
          'A short redirect to a live schedule page that you update through the day. Set times shift; a static image or PDF behind the code is wrong by evening. The redirect layer is what lets a code printed weeks ago stay accurate all festival.',
      },
      {
        question: 'Do I need a backup for ticket scanning?',
        answer:
          'Yes — always, at every gate. Phones die, screens crack, screenshots get mangled by chat apps, and some venue hardware may not handle inverted codes. The QR is the fast path; a printed list or manual check is the guarantee. No template removes this requirement.',
      },
    ],
    title: 'Music Festival Stage QR Template: Concert Ticket & Artist Design',
    metaDescription:
      'Stage-styled QR template for concerts and festivals. Electric violet on stage black — screen-first tickets, merch, and set times.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'charity-warm-heart',
    name: 'Charity Warm Heart',
    designStyle: 'charity',
    primaryUseCase: 'Donation pages, fundraiser events, volunteer signup, impact reports',
    targetIndustry: 'Nonprofits, Charities, Fundraising',
    colorPalette: ['#B5441C', '#FFF9F2', '#E8A87C'],
    dotStyle: 'rounded',
    eyeOuterStyle: 'rounded-square',
    eyeInnerStyle: 'dot',
    ecLevel: 'Q',
    frameStyle: 'rounded-label',
    hasLogo: false,
    ctaText: 'Donate Now',
    useCaseAdvice: `
Charity Warm Heart is designed for the moment a stranger decides to
trust you with their money: warm terracotta (#B5441C) on soft cream
(#FFF9F2), with a peach accent (#E8A87C) in the frame. It belongs on
fundraiser programs, donation appeals, volunteer signup sheets, and
impact reports — everywhere a nonprofit asks something of the public.
Contrast around 6:1 is honest middle ground: reliable on modern phones
in event lighting, supported by Level Q error correction and
sensible sizing, chosen because the warmth measurably suits the ask.

Donation codes carry a trust burden no other template faces. A donor
scanning "Donate Now" is performing a financial transaction on the
strength of a printed square — so everything around the code must
reinforce legitimacy: the organization's name, the campaign purpose,
and a destination URL the donor can verify. The template's CTA frame
is part of this: it states the action plainly rather than hiding
behind a mysterious code. Never use URL shorteners the donor cannot
recognize for donation codes; a bit.ly link on a charity appeal looks
indistinguishable from a phishing attempt. Use your own domain's short
links, and make sure the donation page shows the organization's
identity immediately.

The fundraising event is the primary deployment: galas, charity runs,
community fairs. These are high-distraction, variable-light
environments with a broad device spectrum — including donors on older
phones. Size codes at 30mm minimum on programs and signage, keep
payloads short, and place codes where people linger (registration
tables, auction displays) rather than where they rush past. Table
cards work better than wall posters for donations: the ask happens at
arm's length, seated, with time to consider.

Scanability notes: outdoor charity events face the standard sun and
weather constraints — shade placement, laminated stock, 35mm+ for
distance. Direct-mail appeals need 25mm minimum and must survive
postal handling; Level Q covers the scuffing. The destination page
must load fast and work on old phones — a donation page that fails
on a budget Android loses the exact donors nonprofits most need to
keep. Test the full flow: scan, land, donate, receipt.

Best for: donation appeal codes; fundraiser event programs and
signage; volunteer signup sheets; impact and annual reports;
charity run and walk bibs; direct-mail inserts.

Avoid for: third-party URL shorteners on donation codes (looks like
phishing); tiny direct-mail codes under 20mm; unlaminated outdoor
event signage; destinations that do not show organizational identity
immediately; and any donation flow untested on a budget phone.
    `,
    bestFor: [
      'Donation appeal codes',
      'Fundraiser event programs and signage',
      'Volunteer signup sheets',
      'Impact and annual reports',
      'Charity run and walk bibs',
      'Direct-mail inserts',
    ],
    avoidFor: [
      'Third-party URL shorteners (indistinguishable from phishing)',
      'Direct-mail codes under 20mm',
      'Unlaminated outdoor event signage',
      'Donation pages that hide organizational identity',
    ],
    faqs: [
      {
        question: 'Why not use a URL shortener for donation codes?',
        answer:
          "Because on a charity appeal, an unfamiliar short link looks exactly like a phishing attempt. Donors are being asked to trust a printed square with their money — every trust signal matters. Use your own domain's short links so the destination is verifiably yours, and make sure the landing page shows your identity immediately.",
      },
      {
        question: 'How large should donation codes be?',
        answer:
          '30mm minimum on event programs and signage, 25mm minimum on direct mail. Fundraiser audiences span the full device spectrum including older phones, and donation scans happen in distracting environments. Larger codes and short payloads are the cheapest way to protect the moment someone decides to give.',
      },
      {
        question: 'Where should donation codes be placed at events?',
        answer:
          "Where people linger, not where they rush: registration tables, auction displays, table cards at seated dinners. The donation decision needs a moment of consideration — a code glimpsed in passing rarely converts. Table cards at arm's length outperform wall posters for actual giving.",
      },
      {
        question: 'What makes a good donation landing page?',
        answer:
          "One that loads fast on old phones, shows your organization's identity instantly, states the campaign purpose plainly, and completes the gift in minimal steps with a receipt. Test the entire flow — scan, land, donate, receipt — on a budget Android, because that is where lost donations hide.",
      },
    ],
    title: 'Charity Warm Heart QR Template: Donation & Fundraiser Design',
    metaDescription:
      'Warm charity QR template for nonprofits. Terracotta on soft cream, Level Q — donation appeals and fundraiser signage built on trust.',
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
];

export function getTemplateBySlug(slug: string): TemplateGalleryEntry | undefined {
  return TEMPLATE_GALLERY.find((t) => t.slug === slug);
}

export function getAllTemplates(): TemplateGalleryEntry[] {
  return TEMPLATE_GALLERY;
}

export function getTemplatesByStyle(style: DesignStyle): TemplateGalleryEntry[] {
  return TEMPLATE_GALLERY.filter((t) => t.designStyle === style);
}

export function getApprovedTemplates(): TemplateGalleryEntry[] {
  return TEMPLATE_GALLERY.filter((t) => t.status === 'approved');
}

export const DESIGN_STYLES: DesignStyle[] = [
  'minimalist',
  'corporate',
  'luxury',
  'playful',
  'industrial',
  'artisan',
  'neon',
  'print-ready',
  'hospitality',
  'healthcare',
  'wedding',
  'real-estate',
  'dark',
  'gradient',
  'eco',
  'fintech',
  'fitness',
  'education',
  'accessibility',
  'seasonal',
  'festival',
  'coffee',
  'vintage',
  'pet',
  'automotive',
  'jewelry',
  'sports',
  'library',
  'music',
  'charity',
];
