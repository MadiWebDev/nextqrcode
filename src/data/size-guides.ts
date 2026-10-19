/**
 * QR Studio — QR Code Size Guide Data
 *
 * 26 use-case-specific size guides, each with pre-filled calculator parameters,
 * recommended print sizes, substrate/printing guidance, and 400+ words of
 * unique practical content. Pages served at /qr-size-guide/[slug].
 *
 * Sizing figures are practical rules of thumb (distance-to-size ratios),
 * framed as guidance — not standards or measured statistics.
 */

export type SubstrateType =
  'smooth-paper' | 'coated-paper' | 'corrugated' | 'fabric' | 'glass' | 'metal' | 'plastic';

export type LightingCondition = 'bright' | 'normal' | 'dim';
export type PayloadDensity = 'low' | 'medium' | 'high';

export interface SizeGuide {
  slug: string;
  useCase: string;
  primaryKeyword: string;
  canonicalCalcParams: {
    distanceCm: number;
    substrateType: SubstrateType;
    lightingCondition: LightingCondition;
    payloadDensity: PayloadDensity;
  };
  recommendedSizeMm: number;
  recommendedSizeIn: number;
  substrateMaterial: string;
  printingMethod: string;
  specificWarnings: string[];
  title: string;
  metaDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
  status: 'approved' | 'needs_review';
  publishedAt: string;
  updatedAt: string;
  author: string;
  batchNumber: number;
}

export const SIZE_GUIDES: SizeGuide[] = [
  {
    slug: 'business-card',
    useCase: 'Business Card',
    primaryKeyword: 'qr code size business card',
    canonicalCalcParams: {
      distanceCm: 25,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 20,
    recommendedSizeIn: 0.79,
    substrateMaterial: 'Coated card stock (350–400 gsm)',
    printingMethod: 'Offset lithography or digital laser printing at 1200 DPI',
    specificWarnings: [
      'Minimum 20×20mm — smaller codes fail on thick card stock due to ink spread',
      'Matte finish only — gloss UV coating causes specular glare under office lighting',
      'Leave 3mm clear zone on all sides from card edge — avoid card punching into quiet zone',
      'If using spot UV or foil, never apply to QR area — reflective coatings destroy contrast',
    ],
    title: 'QR Code Size for Business Cards: The 20mm Minimum & Print Specifications',
    metaDescription:
      'Exact QR code size for business cards: 20×20mm minimum for standard 85×55mm cards. Offset print specs, quiet zone rules, matte vs gloss finish guide.',
    content: `
### The Standard Business Card Canvas

A standard ISO 7810 ID-1 business card measures 85.6×54mm (3.370×2.125 inches). This modest canvas must accommodate your name, title, company, contact details, and increasingly a QR code. Getting the QR code sizing right on a business card is both a spatial geometry problem and an optical engineering challenge.

**The 10:1 Distance-to-Size Rule Applied**

A business card is typically scanned from a distance of 20–30 cm — the natural distance at which a person holds a card while looking at it and simultaneously pointing their phone camera. Applying the standard 10:1 optical ratio:

Minimum QR Width = Scanning Distance ÷ 10 = 25cm ÷ 10 = 2.5cm = 25mm

However, for business cards we can apply the aggressive 8:1 ratio (used for well-controlled lighting conditions and modern flagship cameras):

Conservative Minimum = 25cm ÷ 8 = 31mm

In practice, a 20mm QR code works reliably on business cards because modern flagship smartphone cameras (iPhone 16, Pixel 9, Samsung S24) can decode high-quality printed QR codes at 20mm from 25cm in adequate indoor lighting. However, **for maximum compatibility across budget Android devices and older iPhones**, 25–30mm is the recommended target size.

**Optimal Business Card QR Layout**

The QR code typically occupies the bottom-right corner of a standard business card. A 25×25mm QR code with a 3mm quiet zone on all sides requires 31×31mm of total reserved space — approximately 36% of the card's width. This typically works well with a two-column layout where contact text occupies the left 55mm and the QR code occupies the right 31mm.

**Payload and Version Implications**

For a business card QR code, keep the payload minimal:
- **Preferred:** A short URL to your LinkedIn profile or personal website (25–50 characters) → Version 2 at Level M (25×25mm print)
- **Acceptable:** Full vCard 3.0 with name, phone, email, URL (150–250 characters) → Version 6 at Level M (requires 30mm print size)
- **Avoid:** Full vCard with photo, multiple addresses, extended bio (500+ chars) → forces Version 15+ which at 25mm creates modules too small for reliable scanning

**Print Specifications**

Business cards are typically printed by offset lithography at 1200–2400 DPI or by digital laser/inkjet printing at 600–1200 DPI. At 20mm QR code size:
- Module width = 20mm ÷ (modules across for the version)
- For Version 2 (25 modules): module width = 0.80mm — well above the 0.35mm minimum
- For Version 6 (41 modules): module width = 0.49mm — at the threshold; use Level M not Level H

Always send QR codes to the print shop as vector SVG or lossless PDF. Never send a 72 DPI JPEG — the lossy compression creates ringing artifacts at module boundaries.
    `,
    faqs: [
      {
        question: 'Can I make a QR code smaller than 20mm on a business card?',
        answer:
          'Technically yes for very short URLs with flagship smartphone cameras in good lighting. In practice, sub-20mm QR codes fail on budget Android devices, in dim lighting, and when the card shows slight flex or curl. 20mm is the engineering minimum; 25mm is the reliability target.',
      },
      {
        question: 'Should I use Error Correction Level H for a business card QR with my logo?',
        answer:
          'Yes. If embedding a logo in the QR code on a business card, use Level H to provide 30% error correction headroom. Ensure the logo covers less than 20% of the QR code surface area, and the overall symbol remains at least 25mm wide.',
      },
      {
        question: 'Where is the best position for a QR code on a business card?',
        answer:
          'The bottom-right corner of the front, or centered on the back, are the two conventions that work. Keep the code at least 3mm from any trimmed edge so the quiet zone survives cutting, and never let body text or the logo intrude into the quiet zone.',
      },
      {
        question: 'Should a business card QR code link to a vCard or a website?',
        answer:
          'A short URL to a contact or landing page is the safer choice. Full vCards bloat the payload, force dense QR versions with tiny modules, and behave inconsistently across phone contact apps. A short link keeps the code large-modulated and lets you update details without reprinting.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'restaurant-table-tent',
    useCase: 'Restaurant Table Tent',
    primaryKeyword: 'qr code size restaurant table tent',
    canonicalCalcParams: {
      distanceCm: 35,
      substrateType: 'coated-paper',
      lightingCondition: 'dim',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 45,
    recommendedSizeIn: 1.77,
    substrateMaterial: 'Acrylic block or 175-micron matte laminated card',
    printingMethod: 'UV printing on acrylic, or laser printing + cold lamination',
    specificWarnings: [
      'Never use glossy finish — restaurant overhead pendant lighting causes specular glare',
      'Minimum 40mm for dim-lighting environments (candlelit restaurants)',
      'Acrylic blocks resist alcohol sanitizer wipes; laminated paper does not',
      'Table numbers must not intrude into QR quiet zone — maintain 5mm clearance',
    ],
    title: 'QR Code Size for Restaurant Table Tents: 40–50mm Guide for Dim Lighting',
    metaDescription:
      'Restaurant table tent QR code sizing: minimum 40mm in dim lighting, matte finish requirement, acrylic vs laminated substrate, and table number placement rules.',
    content: `
### Restaurant Environment: The Dim Lighting Challenge

Restaurant table QR codes operate in one of the most photonically challenging environments for optical scanning: dim ambient lighting, often supplemented by warm-toned pendant fixtures that cast shadows. Unlike a brightly lit office or retail store, a restaurant dining room typically provides only 50–200 lux of illumination — a fraction of the 500+ lux found in commercial settings.

Low ambient light has two effects on QR code scanning:
1. The camera's auto-gain circuit increases ISO sensitivity, introducing digital noise that masks fine module edges
2. The narrower depth of field at higher apertures means slight hand tremor blurs small modules

The practical result: a QR code that scans reliably on a desk in an office may fail repeatedly on a restaurant table under pendant lighting. This necessitates a larger minimum QR code size than other use cases.

**Sizing Calculation for Restaurant Environments**

Applying the conservative 8:1 distance-to-size ratio for dim lighting:

Typical scanning distance from table surface: 30–40 cm (customer holds phone at comfortable wrist height above table)

Minimum Width (8:1) = 35cm ÷ 8 = 43.75mm → round up to 45mm

For candlelit fine dining environments (< 50 lux), apply a 6:1 ratio:
Minimum Width (6:1) = 35cm ÷ 6 = 58.3mm → target 60mm for maximum reliability

**Table Tent Form Factors**

Standard restaurant table tents come in several configurations:
- **A5 landscape folded (21×14.8cm):** Provides ample space for a 50mm QR code with logo and text
- **DL tri-fold (10×21cm):** Narrower format; 40mm QR fits well on a single panel
- **Custom acrylic block (80×100mm):** Single-sided standing display; 50×50mm QR code is ideal

**Substrate Material Critical Decision**

Restaurant table displays require frequent sanitization with alcohol-based cleaners. This eliminates unlaminated paper immediately — isopropyl alcohol causes paper to warp and ink to smear within hours. The two viable options are:

1. **UV-printed acrylic blocks (5mm thickness):** Chemical-resistant, permanent, premium appearance. QR code is UV-cured directly onto the acrylic surface. Withstands unlimited alcohol wipe cycles. Cost: $5–15 per unit at commercial print quantities.

2. **Matte-laminated polypropylene card:** Cost-effective for seasonal or promotional table cards. Cold lamination (175 micron minimum) provides adequate alcohol resistance for several weeks. Must be replaced every 4–8 weeks. Cost: $0.20–0.80 per unit.

**Never Use Glossy Surfaces**

Restaurant overhead lighting — particularly Edison-style pendant bulbs and track spotlights — creates specular reflections on glossy surfaces that directly impede camera auto-exposure and binarization. A matte or satin finish scatters incident light uniformly, eliminating hotspots.
    `,
    faqs: [
      {
        question: 'How often should restaurant acrylic QR code table tents be replaced?',
        answer:
          'UV-printed acrylic table tents do not need replacement due to wear — they are essentially permanent. Replace only if physically cracked or if the QR code destination changes (restaurant URL or menu platform). Matte-laminated paper table cards should be replaced every 4–8 weeks.',
      },
      {
        question: 'Should each restaurant table have a unique QR code?',
        answer:
          "Yes if you use table-side ordering through a POS system — each table's QR code appends the table number as a URL parameter (?table=12), allowing automatic routing to the kitchen. If the QR only links to a static menu page, a single QR code for all tables is sufficient.",
      },
      {
        question: 'What finish works best for restaurant table tent QR codes?',
        answer:
          'Matte, always. Glossy laminates and acrylics turn pendant lighting into bright hotspots that blind phone cameras. If you must use acrylic, specify a matte or frosted finish on the printed face.',
      },
      {
        question: 'Can I print the QR code on both sides of a table tent?',
        answer:
          'Yes — A-frame and tri-fold tents are made for it. Use the same code and the same size on every face so guests get a consistent experience from any seat, and keep table numbers clear of the quiet zone on each panel.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'highway-billboard',
    useCase: 'Highway Billboard',
    primaryKeyword: 'qr code size billboard outdoor',
    canonicalCalcParams: {
      distanceCm: 1500,
      substrateType: 'metal',
      lightingCondition: 'bright',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 1500,
    recommendedSizeIn: 59.06,
    substrateMaterial: 'Printed vinyl or direct digital inkjet on aluminum composite',
    printingMethod: 'Large-format UV inkjet at 720 DPI (effective resolution)',
    specificWarnings: [
      'CRITICAL SAFETY WARNING: QR codes on highway billboards targeted at moving vehicular traffic create collision hazards and are illegal in some jurisdictions',
      'Only deploy at pedestrian-dense locations: transit stops, drive-thrus, pedestrian bridges, parking structures',
      'Payload must be a short URL (under 30 characters) — dense QR versions are impossible to scan from distance',
      'URL must resolve correctly — a non-loading URL on a 1,000-unit billboard campaign is irreversible',
    ],
    title: 'QR Code Size for Billboards: The 1.5-Meter Minimum & Safety Rules',
    metaDescription:
      'Billboard QR code sizing: 150cm minimum for pedestrian viewing at 15m. Safety rules, short URL requirement, and large-format print specs.',
    content: `
### Billboard QR Codes: The Mathematics and the Ethics

Billboard-scale QR codes represent both the most ambitious application of QR technology and, when implemented irresponsibly, a genuine public safety hazard. Understanding both the engineering mathematics and the safety constraints is essential before deploying QR codes at billboard scale.

**The Safety Rule: No Highway Driver Targeting**

Before discussing size mathematics, a non-negotiable safety constraint must be established: **QR codes on highway billboards targeted at drivers traveling at speed are a collision hazard.**

A vehicle traveling at 100 km/h (62 mph) covers 27.8 meters per second. A driver who takes their eyes off the road for 2 seconds to locate, focus, and scan a QR code on a billboard has traveled 55.6 meters while visually distracted. This is the equivalent of crossing two football fields while blind.

The U.S. Federal Highway Administration (FHWA) and equivalent authorities in the EU, Australia, and most jurisdictions with advanced traffic safety laws either explicitly prohibit QR codes on traffic-adjacent signage or apply general distraction standards that effectively ban them.

**Legitimate Billboard QR Deployments**

QR codes at billboard scale are legitimate and effective in pedestrian-dense environments:
- Transit shelter displays (bus stops, metro entrances)
- Parking structure internal signage
- Drive-through menu boards (vehicle stationary)
- Pedestrian bridge overhead banners
- Shopping center parking lot externals (vehicles entering, not in transit)
- Airport terminal indoor large-format displays

**Sizing Mathematics for Pedestrian Environments**

For transit shelter advertisements viewed from 5 meters:
Minimum Width = 500cm ÷ 10 = 50cm (500mm)

For parking structure QR codes scanned from 10 meters:
Minimum Width = 1,000cm ÷ 10 = 100cm (1,000mm = 1 meter)

For large outdoor displays in pedestrian plazas viewed from 15 meters:
Minimum Width = 1,500cm ÷ 10 = 150cm (1,500mm = 1.5 meters)

**Payload Requirements**

At 15 meters scanning distance, the QR code must be extremely dense-payload-light. A Version 1 code (21×21 modules) at 1,500mm print width has a module width of 1,500 ÷ 21 = 71.4mm — enormous and easily scannable. But the very small data capacity of Version 1 (41 alphanumeric characters) is actually ideal: use the shortest possible URL (freeqrcode.tools/s/abc) and redirect server-side.

Never use a raw 200-character URL on a billboard QR code — the increased module density reduces module size and scanning reliability at distance.

**Test Before the Full Rollout**

Before committing to a full billboard print run, produce a single full-size proof and test it at the real viewing distance with several different phones — a flagship and a mid-range device at minimum. Check the scan in daylight and, for illuminated displays, at night. Verify the destination URL loads quickly on mobile data, since billboard scans arrive over cellular connections. A one-hour field test on a single proof is cheap insurance against a campaign-wide failure.
    `,
    faqs: [
      {
        question: 'Is it legal to put a QR code on a highway billboard?',
        answer:
          'Legality varies by jurisdiction. The US FHWA\'s Highway Beautification Act regulates advertising near federal highways but does not explicitly address QR codes. Many state DOTs and local authorities prohibit "interactive" or "QR code" signage that encourages driver attention. Always check local traffic authority regulations before deploying.',
      },
      {
        question: 'What resolution should large-format outdoor QR codes be printed at?',
        answer:
          'For billboards viewed from 5+ meters, 72 DPI is adequate at the final print size (the eye cannot resolve individual dots at that distance). However, the QR code itself must be generated as a vector (SVG) and rasterized at the print size in the RIP software — never scale up a low-resolution bitmap.',
      },
      {
        question: 'How short should a billboard QR code URL be?',
        answer:
          'Aim for under 30 characters total. A short branded domain plus a short path keeps the QR version at 1 or 2, which means huge, forgiving modules at billboard scale. Resolve campaign tracking and analytics server-side with a redirect rather than stuffing parameters into the printed URL.',
      },
      {
        question: 'What error correction level is best for billboard QR codes?',
        answer:
          'Level M is the practical sweet spot for billboards: it tolerates weathering and minor damage without the density penalty of Level H. Level L is acceptable on huge, pristine prints. Only use Level H if you are embedding a logo, and even then keep the logo small — density is the enemy at distance.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'pharmacy-pill-bottle',
    useCase: 'Pharmacy / Pill Bottle Label',
    primaryKeyword: 'qr code size pharmacy pill bottle',
    canonicalCalcParams: {
      distanceCm: 20,
      substrateType: 'plastic',
      lightingCondition: 'bright',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 12,
    recommendedSizeIn: 0.47,
    substrateMaterial: 'Polypropylene wrap-around label or HDPE direct print',
    printingMethod: 'Thermal transfer printing at 300 DPI minimum',
    specificWarnings: [
      'Cylinder curvature: keep QR code width below circumference ÷ 4 (≈ 0.785 × diameter)',
      'Minimum module size 0.35mm for GS1 DataMatrix; 0.4mm for QR code on small bottles',
      'FDA 21 CFR 111 and EU FMD mandate serialized identifiers — coordinate with regulatory counsel',
      'Dark amber pill bottles reduce contrast — use white label substrate, not transparent',
    ],
    title: 'QR Code Size for Pharmacy Pill Bottles: Cylinder Geometry & FDA Compliance Notes',
    metaDescription:
      'QR code sizing for pharmacy pill-bottle labels: cylinder curvature formula, 12mm minimum, GS1 DataMatrix alternative, and FDA compliance notes.',
    content: `
### Pharmaceutical Label QR Codes: Engineering at Micro Scale

Pharmacy pill bottles present QR code designers with two compounding challenges: extremely small label surface area and cylindrical substrate geometry. A standard 30ml prescription pill bottle has a label area of approximately 35mm × 50mm, of which a significant portion is consumed by mandatory FDA-required text (drug name, dosage, directions, warnings, expiry, lot number). The remaining space for a QR code is typically 12–18mm.

**The Cylinder Curvature Problem**

When a QR code is printed on a wrap-around cylinder label, the left and right edges of the symbol curve away from the camera. This tangential foreshortening compresses the apparent width of modules at the edges.

The safe maximum QR code width on a cylindrical container (preventing module foreshortening beyond the 2:1 threshold) is:
W_max ≤ π × D ÷ 4 ≈ 0.785 × D

For a 30ml pill bottle with a 30mm diameter:
W_max ≤ 0.785 × 30mm = 23.6mm

For a 60ml bottle (diameter ~35mm):
W_max ≤ 0.785 × 35mm = 27.5mm

In practice, the smallest QR code that reliably scans on pharmaceutical packaging at Error Correction Level Q (required for industrial robustness) is 12mm, which needs a minimum symbol version that keeps the module width above 0.35mm.

**GS1 DataMatrix: The Pharmaceutical Industry Standard**

For pharmaceutical serialization under FDA 21 CFR Part 820 and EU FMD, GS1 DataMatrix is the preferred 2D symbol rather than QR code. DataMatrix achieves smaller minimum print sizes (down to 6×6mm for GS1 DataMatrix on vial caps) while maintaining the GS1 Application Identifier structure required for track-and-trace.

QR codes can be used on pharmaceutical packaging for consumer-facing information (patient education URL, refill ordering link) while GS1 DataMatrix handles the serialization and supply chain compliance requirements — the two symbols coexist on the same label for different audiences.

**Thermal Transfer Printing for Pharmaceutical Labels**

Pharmaceutical wrap-around labels are primarily produced by thermal transfer printing (TTR) — a process where wax or wax-resin ribbon is melted onto a polypropylene or polyester label substrate by a thermal printhead.

For QR codes on pharmaceutical labels:
- Minimum print resolution: 300 DPI (0.0846mm dot pitch)
- Ribbon type: Full resin ribbon (superior chemical resistance to isopropyl alcohol, acetone, and hospital disinfectants)
- Substrate: White topcoated polypropylene for maximum contrast
- Laminate: Overprint varnish (OPV) for chemical resistance without compromising QR code optical contrast

**Placement on the Label**

Reserve a dedicated flat zone for the code — ideally a white panel at least 15mm square on the front of the wrap label — and keep mandatory text, logos, and warning icons clear of the quiet zone. Because pharmacy labels are information-dense, it helps to finalize the code placement early in the label design process rather than squeezing it into leftover space at the end.
    `,
    faqs: [
      {
        question: 'Is QR code or DataMatrix required on prescription pill bottles by FDA?',
        answer:
          "FDA does not currently mandate a specific 2D barcode type on retail prescription labels (21 CFR Part 201). However, FDA's Unique Device Identifier (UDI) system for medical devices mandates GS1 DataMatrix or QR code. Many pharmacies voluntarily add QR codes to patient education and refill ordering workflows.",
      },
      {
        question: "Can the pharmacist's own label printer produce scan-quality QR codes?",
        answer:
          'It depends on the printer. Thermal transfer printers at 203 DPI (standard) produce modules below 0.35mm for small QR codes — below the reliable scanning threshold. Upgrade to 300 DPI (or 600 DPI for small label sizes) thermal transfer printers for pharmaceutical QR code reliability.',
      },
      {
        question: 'What is the smallest QR code that still scans on a pill bottle?',
        answer:
          'About 12mm square is the practical floor, and only with a short payload at Error Correction Level Q on a flat label panel. Below 12mm, module widths drop under 0.35mm and even 300 DPI thermal transfer struggles. If you need smaller, switch the machine-readable payload to GS1 DataMatrix.',
      },
      {
        question: 'Should the QR code replace the linear barcode on pharmacy labels?',
        answer:
          'No — let them coexist. Linear barcodes serve pharmacy dispensing systems and insurance workflows that expect them; the QR code serves patients with education and refill links. Removing the linear barcode breaks existing pharmacy automation.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'wine-bottle-label',
    useCase: 'Wine Bottle Label',
    primaryKeyword: 'qr code size wine bottle label',
    canonicalCalcParams: {
      distanceCm: 30,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 22,
    recommendedSizeIn: 0.87,
    substrateMaterial: 'Premium coated self-adhesive wine label paper (130gsm)',
    printingMethod: 'Offset + digital combination; cold foil/emboss QR area separately',
    specificWarnings: [
      'Bordeaux bottle: label curvature is minimal — standard sizing applies',
      'Burgundy bottle: pronounced shoulder curve — keep QR on flat front panel center',
      'Ice bucket / condensation: paper labels absorb moisture — use BOPP synthetic or gloss laminate',
      'Never apply hot foil or emboss over QR code area — raised texture prevents flat camera scan',
    ],
    title: 'QR Code Size for Wine Bottle Labels: 22mm Target, Curvature & Condensation Guide',
    metaDescription:
      'QR code sizing for wine bottle labels: 22mm on standard 75cl Bordeaux bottles, condensation-resistant substrates, flat-panel placement for Burgundy curves.',
    content: `
### Wine Label QR Codes: Blending Aesthetics with Engineering

Wine bottle labels occupy the intersection of luxury branding and consumer technology. As the wine industry increasingly uses QR codes to deliver provenance stories, food pairing recommendations, allergen declarations (now mandatory in the EU under Regulation 2021/2117), and vintage tasting notes, the challenge becomes embedding a functional QR code without compromising the premium label aesthetic.

**Bottle Geometry: Bordeaux vs Burgundy**

The two dominant wine bottle shapes have different label geometry implications:

**Bordeaux (straight-sided):** The cylindrical label area is nearly flat in the center — minimal curvature. A standard 22mm QR code placed in the center of the front label experiences negligible tangential foreshortening and scans reliably.

**Burgundy (tapered shoulder):** The broader shoulder of a Burgundy bottle curves more aggressively near the upper label area. Place QR codes in the lower-center of the Burgundy front label where the cylinder approaches its minimum diameter and the surface is flattest. Avoid placing QR codes near the shoulder curve.

**Scanning Distance for Wine Bottle Labels**

Wine bottles are typically scanned from 20–35 cm — the natural distance at which a consumer holds the bottle while looking at the label. This aligns with business card scanning distance.

Minimum Width (10:1 ratio) = 25cm ÷ 10 = 25mm
Reliable minimum for good lighting = 20mm
Target for maximum compatibility = 25mm

**Condensation: The Underappreciated Wine Label Challenge**

A chilled white wine bottle pulled from an ice bucket develops condensation that saturates standard paper labels within minutes. The absorbed moisture causes:
- Label paper fiber swelling → physical module distortion
- Ink spreading into module boundaries → reduced contrast differential
- Label lifting at edges → physical QR code damage

For wines served chilled, use one of these substrate alternatives:
1. **BOPP (Biaxially Oriented Polypropylene):** Waterproof synthetic label stock indistinguishable from paper when printed. Resists complete submersion.
2. **Heavy-duty cast-coated paper with aqueous overprint varnish:** Moderate condensation resistance; adequate for short-term chilling.
3. **Gloss laminate overlay:** Applied over standard paper after printing. Full waterproofing for the print surface; edges remain moisture-susceptible.

**EU Wine Regulation 2021/2117 Compliance**

From December 2023, all EU wines must list full ingredient and nutritional information. QR codes provide an elegant solution: a small QR code on the label links to the full ingredient declaration page, satisfying EU requirements without overwhelming the label design with text.

**Design Integration**

The most successful wine QR codes are designed into the label from the start rather than added as an afterthought. Allocate the 22mm code plus its quiet zone in the initial layout, choose the substrate (paper, BOPP, or laminated) based on how the wine is served, and proof the code on a filled, chilled bottle — condensation, curvature, and capsule placement all behave differently on the real product than on a flat proof.
    `,
    faqs: [
      {
        question: 'Can wine bottle QR codes link to video content?',
        answer:
          'Yes — this is a growing trend. "Augmented label" experiences link from a wine bottle QR to a winemaker video, vineyard drone footage, or animated vintage story. Keep the URL short (under 40 characters with a redirect) to maintain a scannable QR version.',
      },
      {
        question: "Do wine label QR codes work through the bottle's glass?",
        answer:
          'No — the camera must scan the label surface directly. However, wines with transparent or lightly tinted labels on clear glass bottles can sometimes be scanned from the back if the label is backlit — not a reliable deployment strategy. Always expect front-label scanning.',
      },
      {
        question: 'Where exactly should the QR code sit on a wine bottle label?',
        answer:
          'Lower-center of the front label, on the flattest available area. On Bordeaux bottles the center panel is nearly flat; on Burgundy bottles stay low and centered to avoid the shoulder curve. Keep it clear of foil capsules, embossing, and the back-label regulatory text.',
      },
      {
        question: 'Will a QR code survive an ice bucket on a wine bottle?',
        answer:
          'Only if the label is built for it: BOPP synthetic stock or a full gloss laminate over the print. Standard paper labels absorb condensation within minutes, swelling fibers and spreading ink until the code fails. If the wine is served chilled, specify a waterproof label from the start.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 4,
  },
  {
    slug: 'flyers',
    useCase: 'Flyer',
    primaryKeyword: 'qr code size for flyers',
    canonicalCalcParams: {
      distanceCm: 45,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 50,
    recommendedSizeIn: 1.97,
    substrateMaterial: 'Coated or uncoated paper, 150–250 gsm',
    printingMethod: 'Offset lithography or digital press',
    specificWarnings: [
      'Uncoated stock absorbs ink and softens module edges — stay at the upper end of the size range',
      'Keep the code clear of fold lines on bi-fold or tri-fold flyers — creases through the symbol are fatal',
      'Never let background photos touch the code — place it on a solid light panel with a full quiet zone',
      'Supply the code as vector SVG or PDF — a 72 DPI web JPEG scaled up will blur module boundaries',
    ],
    title: 'QR Code Size for Flyers: 50mm Target & Print Layout Guide',
    metaDescription:
      'Flyer QR code sizing: 50mm minimum for A5 flyers scanned at arm\u2019s length. Quiet zone rules, fold-line placement, uncoated paper warnings, and URL tips.',
    content: `
### Flyers: The Arm's-Length Scan

A flyer is usually picked up, held at arm's length — roughly 40 to 60 cm from the eyes — and scanned within a few seconds, before the reader decides whether to keep it or recycle it. That brief window is your entire opportunity: the QR code must decode on the first or second attempt, because nobody rescans a flyer that failed once. Flyer scanning happens everywhere — cafés, campuses, community boards — in lighting you cannot control, on phones you cannot predict.

### The 10:1 Rule of Thumb

As a practical rule of thumb, divide the expected scanning distance by ten to get the minimum QR code width. For a flyer held at 45 cm: 45 ÷ 10 = 4.5 cm, or 45 mm. Treat this as guidance rather than a guarantee, then add margin for real-world conditions like dim café lighting or older phone cameras. A 50 mm code on a standard A5 or US Letter flyer is the reliable target most designers land on, and it leaves comfortable room for the required quiet zone.

### Recommended Size

Print the code at least 50 × 50 mm (about 2 inches square). On an A5 flyer (148 × 210 mm), a 50 mm code plus its quiet zone occupies roughly a third of the page width — large enough to scan from arm's length, small enough to leave room for the headline, the offer, and branding. If the flyer will be read in dim venues (clubs, evening events), step up to 55–60 mm rather than hoping for the best.

### Substrate and Printing

Flyers are typically printed on 150–250 gsm coated or uncoated paper by offset lithography or a digital press. Uncoated stock absorbs ink into its fibers and softens module edges, so if you print on uncoated paper, stay at the upper end of the size range and avoid dense QR versions with tiny modules. Always supply the code as vector SVG or PDF. A 72 DPI web JPEG scaled up to print size will blur module boundaries and produce a code that looks fine on screen and fails on paper.

### Placement and Practical Tips

- Keep the code out of fold lines on bi-fold or tri-fold flyers; a crease running through the symbol is one of the most common flyer failures.
- Give the code a quiet zone of at least four modules on all sides, and never let background photos or patterns touch it — place it on a solid white or light panel.
- Put a short call to action next to the code ("Scan for the menu", "Scan to RSVP"). Codes without context get ignored, no matter how well printed.
- Keep the linked URL short. A 200-character URL forces a dense QR version with tiny modules; a short redirect keeps modules large and forgiving.
- Proof on the actual stock. A code that scans beautifully on your laser proof can behave differently on the job's uncoated sheet.

### Common Mistakes

- Shrinking the code to squeeze in one more line of text. If space is tight, shorten the URL — not the code.
- Printing in brand colors with weak contrast. Dark modules on a light background remain the most reliable combination in uncontrolled lighting.
- Forgetting to test: scan the printed flyer — not the screen proof — with two different phones before approving the full run.
    `,
    faqs: [
      {
        question: 'What is the minimum QR code size for an A5 flyer?',
        answer:
          '50mm square is the reliable minimum for A5 flyers scanned at arm\u2019s length (about 45cm). You can go slightly smaller with a very short URL and a modern phone, but 50mm covers older devices and poor lighting, which is where flyer scans usually happen.',
      },
      {
        question: 'Can a QR code cross the fold on a tri-fold flyer?',
        answer:
          'No. A crease through the symbol distorts modules and breaks the quiet zone on both panels. Keep the entire code — quiet zone included — on a single flat panel, at least 5mm clear of any fold line.',
      },
      {
        question: 'Does uncoated flyer paper affect QR code scanning?',
        answer:
          'Yes. Uncoated stock wicks ink into its fibers, softening the sharp module edges a QR code depends on. Compensate by printing slightly larger (55mm+), keeping the payload short, and proofing on the actual uncoated sheet before the full run.',
      },
      {
        question: 'Should flyer QR codes link to a homepage or a specific page?',
        answer:
          'Always a specific, mobile-friendly page: the event signup, the menu, the offer. Flyer traffic is entirely phone-based and impatient — every extra tap between the scan and the payoff loses readers.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'posters',
    useCase: 'Poster',
    primaryKeyword: 'qr code size for posters',
    canonicalCalcParams: {
      distanceCm: 150,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 150,
    recommendedSizeIn: 5.91,
    substrateMaterial: 'Satin poster paper 200 gsm, optional matte laminate',
    printingMethod: 'Large-format inkjet or offset printing',
    specificWarnings: [
      'Posters behind glass need 20–30% extra size — reflections force the camera to work harder',
      'Size for the farthest viewer, not the designer standing 50cm away in the studio',
      'Gloss lamination turns into a mirror under spotlights — specify matte for the code area',
      'Outdoor posters need weatherproof inks or lamination — a rain-faded code is a dead code',
    ],
    title: 'QR Code Size for Posters: Distance-Based Sizing Guide',
    metaDescription:
      'Poster QR code sizing by viewing distance: 150mm for A2 posters at 1.5m. Behind-glass glare rules, outdoor weatherproofing, and placement height tips.',
    content: `
### Posters: Designed to Be Read at a Distance

Posters live on walls, in windows, and on notice boards, and they are scanned from wherever the viewer happens to stand — typically 1 to 3 meters away. Unlike a flyer, you cannot count on the viewer stepping closer; the code must work from the farthest reasonable viewing position, not the nearest. Poster scanning is also a one-shot affair: a viewer who tries, fails, and walks away is gone for good.

### The 10:1 Rule of Thumb

Divide the farthest expected scanning distance by ten. A poster in a café viewed from 1.5 m needs at least a 150 mm code as a rule of thumb; a notice-board poster that people read from 3 m needs roughly 300 mm. When in doubt, round up — an oversized code on a poster looks intentional and confident, while a too-small one looks broken and gets ignored. Remember this is guidance for typical conditions; dim hallways and older phones both argue for going larger.

### Recommended Size

For a standard A2 poster (420 × 594 mm) viewed from about 1.5 m, print the code at 150 × 150 mm (about 6 inches). For A1 or larger formats in lobbies, transit areas, and exhibition halls, scale proportionally to the farthest viewer distance. On a crowded notice board where viewers stand shoulder to shoulder at 1 m, 100–120 mm can suffice — but only if the lighting is good and the URL is short.

### Substrate and Printing

Posters are usually printed on 200 gsm satin paper by large-format inkjet or offset, sometimes with a matte laminate for durability. Matte finishes are preferable for the code area: glossy lamination turns into a mirror under spotlights and kills contrast when viewed at an angle. For outdoor posters, UV-stable inks or a protective laminate are mandatory — sun and rain will fade an unprotected code within weeks, long before the campaign ends.

### Placement and Practical Tips

- Posters behind glass (transit shelters, framed notice boards) need extra size — reflections force the camera to work harder, so add 20–30% to the rule-of-thumb size.
- Place the code at a comfortable standing height and away from the poster's edges; codes tucked into corners get cropped by frames or hidden behind neighboring posters.
- Keep the quiet zone clear of the poster's background imagery. A code floating on a busy photograph needs a solid light panel behind it.
- Link to a mobile-friendly page. Poster traffic is entirely phone-based — a desktop-only site wastes every scan.
- If the poster promotes a dated event, make sure the link stays live through the event date plus a grace period.

### Common Mistakes

- Sizing for the designer standing 50 cm away in the studio instead of the viewer 2 m away in the hallway.
- Busy photographic backgrounds bleeding into the quiet zone, especially on music and event posters.
- Long URLs creating dense symbols that fall apart at poster-viewing distances — use a short redirect.
- Mounting the poster where a door swing, plant, or furniture blocks the code at scanning height.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on an A2 poster?',
        answer:
          '150mm square is the reliable target for an A2 poster viewed from about 1.5 meters. If viewers will be farther away — a lobby or transit poster at 3 meters — scale up toward 300mm using the 10:1 distance rule as guidance.',
      },
      {
        question: 'Do QR codes work on posters behind glass?',
        answer:
          'Yes, but glass adds reflections that make the camera work harder. Increase the code size by 20–30% over the normal rule of thumb, use a matte finish on the poster itself, and test with a phone at the actual viewing spot before finalizing.',
      },
      {
        question: 'What is the best finish for poster QR codes?',
        answer:
          'Matte or satin. Gloss lamination looks striking but becomes a mirror under spotlights and ceiling lights, destroying contrast at an angle. If the poster must be glossy for design reasons, keep at least the code panel matte.',
      },
      {
        question: 'Can I use a QR code on an outdoor poster?',
        answer:
          'Yes, with weatherproofing: UV-stable inks or a protective laminate, and a substrate rated for outdoor use. Size generously since outdoor viewing distances are longer, and check the code monthly — sun fade degrades contrast gradually until scans start failing.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'product-packaging',
    useCase: 'Product Packaging',
    primaryKeyword: 'qr code size product packaging',
    canonicalCalcParams: {
      distanceCm: 25,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 22,
    recommendedSizeIn: 0.87,
    substrateMaterial: 'Folding carton, flexible film, or adhesive label stock',
    printingMethod:
      'Flexography, gravure, or digital label press — confirm minimum module size with printer',
    specificWarnings: [
      'Flexible pouches crinkle — place the code on the flattest, most rigid panel, never across a gusset or seal',
      'Metallic foils and holographic films destroy contrast — print the code on a solid light ink panel, never directly on foil',
      'Curved jars and bottles: keep code width well under a quarter of the container circumference',
      'Always proof the code on the actual substrate — office-paper proofs hide flexo dot gain and film distortion',
    ],
    title: 'QR Code Size for Product Packaging: 22mm & Curved-Surface Rules',
    metaDescription:
      'Product packaging QR codes: 22mm on flat panels, curvature limits for jars and bottles, foil contrast warnings, and flexo print proofing tips.',
    content: `
### Packaging: Small Canvas, Curved Surfaces

QR codes on product packaging are scanned at arm's length in stores and at home — typically 20 to 30 cm. The challenge is rarely distance; it is the canvas. Boxes, pouches, jars, and bottles offer limited flat area, curved surfaces, and finishes (metallic foils, embossing, spot varnishes) chosen for shelf appeal rather than scannability. The code must survive the realities of mass production: dot gain on flexo presses, registration drift, and substrates that stretch, crinkle, or condensate.

### The 10:1 Rule of Thumb

At 25 cm scanning distance, the rule of thumb suggests a 25 mm minimum. Packaging designers routinely work slightly below this with short URLs and modern phones, so 20–25 mm is the practical target for most cartons and labels — provided the surface is flat where the code sits. Flatness matters more than raw size here: a 22 mm code on a rigid carton panel outperforms a 30 mm code stretched across a pouch gusset.

### Recommended Size

Print at 22 × 22 mm (about 0.87 inches) on a flat panel of the pack. If the only available flat area is smaller, shorten the URL first — a short redirect keeps the QR version low and modules large — rather than shrinking the code below 20 mm. For tiny packs (single-serve sachets, small jars), consider moving the code to the outer case or shelf talker instead of forcing it onto an unworkable surface.

### Substrate and Printing

Packaging is printed by flexography, gravure, or digital label presses on folding carton, flexible film, or adhesive label stock. Each process has a minimum reproducible module size: flexo in particular suffers dot gain that fattens small modules. Confirm the minimum with your printer before finalizing artwork, and always proof the code on the actual substrate and press — an office laser proof hides every production reality that matters.

### Placement and Practical Tips

- Flexible pouches crinkle. Place the code on the flattest, most rigid panel — never across a gusset, seal, or zipper.
- Metallic foils and holographic films destroy contrast; print the code on a solid white or light ink panel, never directly on foil. If the design demands foil nearby, frame the code with a light knockout.
- On jars and bottles, respect curvature: keep the code width well under a quarter of the container's circumference so edge modules don't foreshorten beyond recognition.
- Chilled or frozen goods condensate — specify moisture-resistant label stocks or laminates, or the code dies in the fridge.
- Link to content worth the effort: recipes, refills, loyalty signup, or sustainability credentials — not just the homepage.

### Common Mistakes

- Wrapping the code around a curve so the outer modules compress beyond recognition.
- Using the brand's metallic gold as the module color on a cream background — it looks premium on the shelf and scans terribly in a kitchen.
- Linking to a 300-character URL loaded with tracking parameters; use a short redirect and keep parameters server-side.
- Approving the code from a PDF proof without ever scanning a production sample off the actual line.
    `,
    faqs: [
      {
        question: 'What is the minimum QR code size for product packaging?',
        answer:
          '22mm square on a flat panel is the practical target for cartons and labels scanned at 25cm. Below 20mm, modules get too small for flexo and gravure presses to reproduce cleanly. If the pack cannot spare 22mm, shorten the URL or move the code to the outer case.',
      },
      {
        question: 'Can QR codes be printed on flexible pouches?',
        answer:
          'Yes, but only on the flattest, most rigid panel — never across gussets, seals, or zippers where crinkling distorts modules. Size at 22mm or larger, keep the payload short, and proof on filled pouches, since filling changes how the film sits.',
      },
      {
        question: 'Why do QR codes fail on metallic packaging?',
        answer:
          'Metallic foils and holographic films reflect light unevenly, collapsing the dark-light contrast the camera needs. Always print the code on a solid white or light ink panel knocked out of the foil, never directly onto the metallic surface.',
      },
      {
        question: 'Should packaging QR codes link to the product page?',
        answer:
          'Link to the most useful destination for someone holding the product: usage instructions, recipes, refill ordering, or warranty registration. Use a short redirect URL so the printed code never needs to change when websites are redesigned.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'receipts',
    useCase: 'Receipt',
    primaryKeyword: 'qr code size for receipts',
    canonicalCalcParams: {
      distanceCm: 20,
      substrateType: 'smooth-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 25,
    recommendedSizeIn: 0.98,
    substrateMaterial: 'Thermal receipt paper (BPA-free)',
    printingMethod: 'Direct thermal printing at 203 DPI',
    specificWarnings: [
      '203 DPI thermal heads cannot resolve tiny modules — keep the payload short (under ~40 characters)',
      'Thermal print fades with heat, sunlight, and time — design for prompt scanning, not archival links',
      'Keep the code clear of the tear edge and side margins — partial printing is a common failure',
      'Test on the actual POS printer model — thermal dithering behaves differently from laser proofs',
    ],
    title: 'QR Code Size for Receipts: Thermal Printer Constraints',
    metaDescription:
      'Receipt QR codes: 25mm minimum on 203 DPI thermal printers. Short-URL requirement, thermal fade limits, tear-edge placement, and POS testing tips.',
    content: `
### Receipts: The Thermal-Printer Constraint

Receipt QR codes — for feedback surveys, digital warranties, e-invoices, or loyalty signup — are scanned from 15 to 25 cm, usually within minutes of printing. The binding constraint is not distance but the printer: most point-of-sale printers are direct-thermal devices at 203 DPI, which renders the small, sharp squares a QR code needs only approximately. A code that looks crisp in the design file can emerge from a tired thermal head as a gray smudge.

### The 10:1 Rule of Thumb and the DPI Floor

At 20 cm, the rule of thumb suggests 20 mm. But on a 203 DPI thermal printer, each dot is about 0.125 mm wide, and modules need several clean dots of width to survive the heat-and-chemistry process. As practical guidance, 25 mm is the reliable minimum on thermal receipts, and the payload must stay short — a long URL forces a dense symbol whose tiny modules the thermal head cannot resolve. Short payload, large modules, generous size: that is the entire thermal receipt strategy.

### Recommended Size

Print at 25 × 25 mm (about 1 inch square). Keep the encoded URL under roughly 40 characters; use a short domain with a server-side redirect. Avoid encoding vCards, Wi-Fi credentials, or long text payloads on receipts entirely — the density will defeat the printer. If your POS software lets you set the QR module size, increase it rather than just scaling the graphic.

### Substrate and Printing

Receipts print on thermal paper — usually BPA-free formulations these days — via direct thermal heads that darken the paper with heat. Thermal print fades with heat, sunlight, and time: a receipt left on a car dashboard in summer can become unreadable in days. Receipt codes therefore have a limited reliable lifespan; they are for prompt actions (rate your visit, download your e-receipt, join the loyalty program), not for links anyone needs in six months.

### Placement and Practical Tips

- Keep the code clear of the tear edge and the paper's side margins — partial printing from a misaligned roll is a common and invisible failure until a customer complains.
- Test on the actual printer model with a fresh roll and a nearly-spent roll; thermal dithering degrades as heads wear.
- Print a short instruction above the code ("Scan for your e-receipt") — receipt codes are easily overlooked in a wall of transaction text.
- Position the code away from the fold if receipts get folded into bags; creases through thermal print crack the image.
- Monitor your short-URL analytics: a sudden drop in receipt scans often means a dying print head, not a marketing problem.

### Common Mistakes

- Encoding the full invoice URL with session tokens and tracking parameters — it creates an unscannable dense symbol on 203 DPI hardware.
- Placing the code where the cashier's thumb, the bag staple, or the receipt spike lands.
- Assuming a code that scans fresh will scan in six months — thermal fade is real, so design receipt links for prompt action.
- Shrinking the code to save paper; the fractions of a cent saved aren't worth the failed scans.
    `,
    faqs: [
      {
        question: 'Why do QR codes fail on thermal receipts?',
        answer:
          'Three usual causes: the payload is too long for 203 DPI thermal heads to resolve, the print head is worn and dithering poorly, or the code was placed where tearing, folding, or stapling damaged it. Shorten the URL, test on the actual printer, and keep the code clear of edges.',
      },
      {
        question: 'How long does a QR code last on thermal paper?',
        answer:
          'It depends on storage: weeks to months in normal conditions, days in heat or direct sunlight. Thermal print fades as a chemical process, so treat receipt codes as prompt-action links (surveys, e-receipts, loyalty signup) rather than anything archival.',
      },
      {
        question: 'What is the best URL length for receipt QR codes?',
        answer:
          'Under about 40 characters. Use a short branded domain plus a short path, and resolve tracking, session data, and analytics server-side with a redirect. Every extra character increases QR density and shrinks modules the thermal printer must reproduce.',
      },
      {
        question: 'Can I print QR codes on any POS printer?',
        answer:
          'Most modern POS printers support QR codes natively, but quality varies enormously between a new 300 DPI unit and a five-year-old 203 DPI workhorse. Qualify each printer model in your fleet with real test scans — never assume.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'window-decals',
    useCase: 'Window Decal',
    primaryKeyword: 'qr code size window decal',
    canonicalCalcParams: {
      distanceCm: 150,
      substrateType: 'glass',
      lightingCondition: 'bright',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 120,
    recommendedSizeIn: 4.72,
    substrateMaterial: 'Perforated one-way-vision vinyl or static-cling film',
    printingMethod: 'UV or latex large-format print with white ink underbase on clear films',
    specificWarnings: [
      'Scanning through glass causes double reflections — size up 20% and test at the actual spot',
      'Clear films need a white ink underbase behind the code — without it the interior shows through and contrast collapses',
      'Decide inside vs outside application before printing — reverse-print for inside-glass reading from outside',
      'Direct sun at midday creates the worst glare — test then, not just in morning shade',
    ],
    title: 'QR Code Size for Window Decals: 120mm Storefront Guide',
    metaDescription:
      'Window decal QR codes: 120mm for pedestrian scanning at 1.5m. White underbase rules, through-glass reflection tips, and sun-glare placement advice.',
    content: `
### Window Decals: Scanning Through Glass

Window decals on shopfronts are scanned by pedestrians standing 1 to 2 meters away, often through the glass itself or from an oblique angle. Glass adds reflections, the street adds glare, and the viewer is usually in motion — walking past, glancing over, deciding in two seconds whether to stop. Everything about this environment argues for generous sizing and ruthless contrast.

### The 10:1 Rule of Thumb

At 1.5 m viewing distance, the rule of thumb gives 150 mm; in practice, 100–150 mm works for storefront decals because pedestrians typically stop and step closer once interested. Size for 1.5 m as the working distance, and treat anything smaller than 100 mm as a close-range-only code that will fail for passersby. If the decal must be scanned through the glass rather than off its surface, add another 20% — the glass costs you contrast you have to buy back with size.

### Recommended Size

Print at 120 × 120 mm (about 4.7 inches). On a standard shopfront, this is clearly visible without dominating the window display, and it survives the contrast losses of glass, glare, and oblique angles. For decals on doors that people approach closely, 100 mm is acceptable; for upper-window placements viewed from across the sidewalk, go to 150 mm.

### Substrate and Printing

Decals use perforated one-way-vision vinyl, static-cling film, or adhesive vinyl, printed by UV or latex large-format printers. On clear films, a white ink underbase behind the code is essential — without it, the bright shop interior shows straight through the code and contrast collapses to nothing. Decide the application side before printing: inside-glass decals that read correctly from outside must be reverse-printed (mirror image), a mistake that is expensive to discover after installation.

### Placement and Practical Tips

- Apply at waist-to-chest height where pedestrians naturally look; ankle-height codes get ignored and above-head codes get neck strain instead of scans.
- Avoid placing the code where interior spotlights reflect directly into the camera; visit at midday when sun glare is worst and test then.
- Perforated one-way-vision vinyl (the kind with tiny holes for see-through from inside) can interfere with fine modules — keep the code off perforated areas or size up to compensate.
- Pair the code with a reason: opening hours, today's offer, the booking link. A naked code on a window is easy to walk past.
- Tinted or low-e glass darkens everything, including your contrast — test through the actual installed glass.

### Common Mistakes

- Clear static-cling film with no white underbase — the code becomes a ghost of the interior and scans only in perfect conditions.
- Mounting at ankle height or above head height instead of the natural sightline.
- Forgetting that the setting sun turns a west-facing window into a mirror for an hour every evening.
- Printing inside/outside orientation backwards and discovering the code reads mirrored from the street.
    `,
    faqs: [
      {
        question: 'Do QR codes work when scanned through shop glass?',
        answer:
          'Yes, with compromises. Glass adds reflections and costs contrast, so increase the code size by about 20% over the normal rule of thumb and test at the actual spot in the worst light (usually midday sun). Anti-reflective films on the glass help if reflections prove stubborn.',
      },
      {
        question: 'What is a white ink underbase and why does a window decal need one?',
        answer:
          'It is a layer of white ink printed behind the code on clear films. Without it, the bright shop interior shows through the transparent areas of the code, destroying the dark-light contrast cameras need. Any clear or translucent decal carrying a QR code needs one.',
      },
      {
        question: 'Should a window decal go inside or outside the glass?',
        answer:
          'Inside lasts longer (no weather, no vandalism) but must be reverse-printed to read correctly from the street. Outside is simpler to install and reads directly, but needs UV-stable inks and weathers faster. Decide before printing — the artwork differs.',
      },
      {
        question: 'How do I stop sun glare from killing my window QR code?',
        answer:
          'Place the code where direct sun rarely hits it straight-on (under an awning or on a north-facing pane if you have the choice), use matte films rather than glossy, and test at midday. If glare is unavoidable at certain hours, a slightly larger code gives the camera more to work with.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'vehicle-wraps',
    useCase: 'Vehicle Wrap',
    primaryKeyword: 'qr code size vehicle wrap',
    canonicalCalcParams: {
      distanceCm: 300,
      substrateType: 'metal',
      lightingCondition: 'bright',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 300,
    recommendedSizeIn: 11.81,
    substrateMaterial: 'Cast vinyl wrap film with protective laminate',
    printingMethod: 'Large-format solvent, latex, or UV print; heat-conformed to bodywork',
    specificWarnings: [
      'Never size or place codes for moving-traffic scanning — a safety hazard and illegal in many jurisdictions',
      'Flat panels only (doors, rear quarters) — never over wheel arches, handles, or deep body creases',
      'Keep the code clear of panel gaps and door shuts — alignment shifts every time a door opens',
      'Matte or satin laminate scans more reliably than high-gloss, which mirrors sunlight',
    ],
    title: 'QR Code Size for Vehicle Wraps: Parked-Viewing Sizing',
    metaDescription:
      'Vehicle wrap QR codes: 300mm on flat door panels for 3m viewing. Parked-only safety rule, curvature limits, matte laminate advice, and panel placement.',
    content: `
### Vehicle Wraps: Parked, Not Moving

A QR code on a wrapped vehicle is scanned when the vehicle is parked — at events, on forecourts, at the curb, or in the company lot — from 2 to 5 meters away. This constraint shapes everything: codes aimed at moving traffic are a safety hazard and, in many jurisdictions, a legal problem, so size and place the code for stationary viewing only. The good news is that vehicle panels are enormous, so the large codes this use case demands look proportionate rather than oversized.

### The 10:1 Rule of Thumb

At 3 m, the rule of thumb suggests 300 mm. That sounds large until you see it on a van's sliding door, where it reads as a confident graphic element rather than a billboard. Treat 250–300 mm as the working range for vehicle livery viewed at 2–4 m. Smaller codes (around 150 mm) can work on cars displayed at events where visitors approach to 1.5 m, but they will not survive curbside distances — match the size to the viewing scenario, not the vehicle.

### Recommended Size

Print at 300 × 300 mm (about 12 inches) on the flattest available panel — typically the rear quarter or the sliding door. Keep the code at standing eye height so pedestrians scan comfortably without crouching or stretching. On box trucks and trailers with vast flat sides, you can go larger still; the 10:1 rule scales without penalty, and bigger codes forgive more.

### Substrate and Printing

Wraps use cast vinyl film, printed by solvent, latex, or UV large-format printers, heat-conformed to the bodywork and protected by a laminate. The laminate adds years of durability but also glare — a matte or satin laminate scans far more reliably than high-gloss, which turns the code into a mirror in direct sun. Calendered vinyl is cheaper but shrinks and suits only flat surfaces; specify cast vinyl for anything with curves.

### Placement and Practical Tips

- Flat panels only: doors, rear quarters, tailgates. Never wrap a code over wheel arches, door handles, fuel flaps, or deep body creases — compound curves distort modules unpredictably.
- Keep the code clear of panel gaps and door shuts; the graphic shifts microscopically every time a door opens, and a code straddling a shut line will eventually misalign.
- Short URLs are mandatory. Dense symbols at 3 m are unforgiving, and there is no second chance with a drive-past viewer.
- Tell the story next to the code: "Scan for a free quote" outperforms a naked symbol by a wide margin.
- Remember both sides of the vehicle get seen — but one well-placed code per side is enough.

### Common Mistakes

- Designing for highway scanning. A code nobody can safely scan is a liability, not marketing — and it may be illegal.
- Letting the code cross panel gaps or door shuts where alignment shifts with use.
- High-gloss laminate under direct sun, turning the code into a mirror exactly when the vehicle is most visible.
- Encoding a long URL with campaign parameters; the resulting dense symbol fails at exactly the distances vehicles are viewed from.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on a van wrap?',
        answer:
          '300mm square on the sliding door or rear quarter panel is the reliable target for viewing at 2–4 meters. That follows the 10:1 distance rule of thumb and looks proportionate on commercial vehicle panels. Event-display cars viewed at 1.5m can use 150mm.',
      },
      {
        question: 'Is it legal to put a QR code on a vehicle for drivers to scan?',
        answer:
          'Targeting moving traffic with a QR code is dangerous and restricted or prohibited in many jurisdictions — a driver scanning a code is a distracted driver. Design vehicle codes for parked viewing: events, forecourts, curbsides, and lots. Check local traffic-advertising rules before deploying.',
      },
      {
        question: 'Can a QR code go over a curved part of a vehicle?',
        answer:
          'Avoid it. Compound curves — wheel arches, creases, handles — distort modules unpredictably as the vinyl conforms. Restrict codes to the flattest panels (doors, rear quarters, tailgates) and keep them clear of panel gaps and door shuts.',
      },
      {
        question: 'Does laminate finish affect QR scanning on wraps?',
        answer:
          'Yes. High-gloss laminate creates specular reflections in sunlight that can blind a phone camera, while matte or satin laminates scatter light evenly. Specify matte or satin laminate over the code area for the most reliable scanning.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'trade-show-banners',
    useCase: 'Trade Show Banner',
    primaryKeyword: 'qr code size trade show banner',
    canonicalCalcParams: {
      distanceCm: 150,
      substrateType: 'fabric',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 120,
    recommendedSizeIn: 4.72,
    substrateMaterial: 'Polyester fabric or PVC banner, matte finish',
    printingMethod: 'Dye-sublimation or UV large-format print',
    specificWarnings: [
      'Retractable mechanisms curl the graphic base — keep the code well above the bottom of the banner',
      'Backlit lightboxes wash out codes — test the code lit, not just in the proof',
      'Chest-to-eye height (1.2–1.6m) — codes near the floor force crouching and fail in crowds',
      'Booth spotlights create hotspots — aim lights away from the code even on matte fabric',
    ],
    title: 'QR Code Size for Trade Show Banners: 120mm Stand Guide',
    metaDescription:
      'Trade show banner QR codes: 120mm at chest height for 1.5m aisles. Retractable curl warnings, backlit washout tips, and booth lighting advice.',
    content: `
### Trade-Show Banners: The Two-Second Glance

Retractable banners and pop-up stands are scanned from 1 to 2 meters in crowded, brightly lit exhibition halls. Attendees give each booth a two-second glance as they move down the aisle; the code must be big, obvious, and instantly scannable while they walk past. Nobody at a trade show stops, waits, and retries a stubborn code — they just keep walking to the next booth.

### The 10:1 Rule of Thumb

At 1.5 m, the rule of thumb gives 150 mm; 120 mm is the practical minimum for banner stands because interested visitors do step closer. For wide pop-up backwalls viewed from 2–3 m across the aisle, scale to 150–200 mm. Exhibition halls are bright, which helps cameras, but aisles are crowded, which means the scan often happens at an angle through a gap in the foot traffic — size buys forgiveness for bad angles too.

### Recommended Size

Print at 120 × 120 mm (about 4.7 inches) on a standard 850 mm retractable banner, positioned at chest-to-eye height (roughly 1.2–1.6 m from the floor). On larger pop-up backwalls, go bigger rather than smaller — a 200 mm code on a 3 m backwall looks intentional and scans from across the aisle.

### Substrate and Printing

Banner stands use polyester fabric or PVC with dye-sublimation or UV printing; pop-up walls are fabric with silicone-edge graphics. Fabric is forgiving of handling, but retractable mechanisms curl the bottom of the graphic — keep the code well above the base, in the top two-thirds of the visible area. Backlit lightbox stands look premium but wash out codes; if the stand is backlit, test the code with the lights on, since proofs never show the washout.

### Placement and Practical Tips

- Chest-to-eye height is the rule — codes near the floor force awkward crouching and disappear behind bags and crowds.
- Link to something instantly valuable: the digital brochure, a show-only offer, the contact card, the demo booking page — not the generic homepage.
- Print a spare graphic. Banner stands get damaged in transit, and a creased or scuffed code is a dead code on opening morning.
- Keep the URL short and the landing page light — exhibition Wi-Fi is famously congested, and a 10 MB PDF will time out.
- If you run a lead-capture form behind the code, pre-fill the event name so scans attribute correctly.

### Common Mistakes

- Placing the code at the bottom of the banner where bags, feet, and the retractable base hide it.
- Booth spotlights creating a hotspot directly on the code — matte fabric helps, but aim lights away regardless.
- A code that links to a heavy download over congested show Wi-Fi; keep the destination instant.
- Reusing last year's banner with a code pointing at last year's campaign page.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on a retractable banner?',
        answer:
          '120mm square at chest-to-eye height is the reliable minimum for aisles scanned at 1–2 meters. Keep it in the top two-thirds of the graphic, clear of the retractable base curl, and pair it with a short call to action.',
      },
      {
        question: 'Why do QR codes fail on backlit banner stands?',
        answer:
          'Backlighting washes out the dark-light contrast, especially on lighter code designs. Test the code with the stand lit — not from the unlit proof — and if washout persists, increase size, deepen the module color, or move the code off the backlit panel.',
      },
      {
        question: 'Where should the QR code go on a trade show booth?',
        answer:
          'At 1.2–1.6m height on the most aisle-facing surface, with a clear call to action. Avoid the bottom third of retractable banners (curl and crowd occlusion), backlit panels (washout), and anywhere a demo station or furniture blocks the approach.',
      },
      {
        question: 'What should a trade show QR code link to?',
        answer:
          'Something instantly valuable and lightweight: the digital brochure, a show-only offer, meeting booking, or contact card. Avoid heavy PDFs and generic homepages — show Wi-Fi is congested and attendee patience is measured in seconds.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'book-covers',
    useCase: 'Book Cover',
    primaryKeyword: 'qr code size book back cover',
    canonicalCalcParams: {
      distanceCm: 30,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 25,
    recommendedSizeIn: 0.98,
    substrateMaterial: 'Coated cover stock with matte laminate',
    printingMethod: 'Offset printing + matte lamination',
    specificWarnings: [
      'Spine curvature on thin books distorts edge modules — keep the code on the flat back panel',
      'Bookstore track spotlights turn gloss laminate into glare — specify matte for the code area',
      'Keep clear of the ISBN barcode — adjacent symbologies confuse some scanner apps',
      'On dust jackets, keep the code away from fold edges where the jacket shifts',
    ],
    title: 'QR Code Size for Book Covers: 25mm Back-Panel Guide',
    metaDescription:
      'Book cover QR codes: 25mm on the back cover for 30cm bookstore scans. Matte laminate rule, spine curvature limits, and ISBN spacing tips.',
    content: `
### Book Covers: The Back-Panel Scan

Book-cover QR codes — linking to author sites, bonus chapters, audiobook samples, discussion guides, or review pages — sit on the back cover and are scanned at 25 to 40 cm in bookstores and libraries. The back cover is also prime real estate for blurbs, review quotes, and the ISBN barcode, so the code must earn a modest footprint without compromising the cover design. Readers browse quickly; the code has to work the first time, in the store's spotlight glare.

### The 10:1 Rule of Thumb

At 30 cm, the rule of thumb suggests 30 mm; 25 mm is the practical target that balances scannability with cover design. Anything under 20 mm on a bookstore shelf is asking for trouble under track spotlights, and anything much over 30 mm starts fighting the blurb copy for space. This is guidance, not law — short URLs and modern phones give you margin, while gloss laminate and dim corners take it away.

### Recommended Size

Print at 25 × 25 mm (about 1 inch) on the back cover's flat area. Keep it clear of the spine — on thin books the cover curves near the spine and distorts edge modules. The bottom corner of the back cover is the convention: readers already look there for the ISBN, so the code rides familiar eye paths instead of interrupting the design.

### Substrate and Printing

Covers print offset on coated cover stock, usually with matte or gloss lamination. Matte laminate is strongly preferred for the code area: bookstore track spotlights turn gloss laminate into blinding glare at exactly the angles browsers hold books. If the cover design demands gloss elsewhere, spot-matte the code panel — most printers can do this without a visible seam.

### Placement and Practical Tips

- Never let the code touch the ISBN barcode. The two symbologies side by side confuse some scanner apps, and the ISBN's quiet zone requirements are strict.
- On dust jackets, remember the jacket shifts on the case — keep the code away from edges and folds where movement misaligns it with the design.
- Dark, moody cover art must not bleed into the quiet zone; frame the code on a light panel even if the cover is black.
- Link to a persistent page (author site, book page, series hub), not a campaign URL that dies after launch month. Books live for years; links should too.
- For ebooks and audiobooks, the "cover" is a thumbnail — skip the code there and use a tappable link instead.

### Common Mistakes

- Gloss UV spot-coating over the code area for a premium feel — it creates a reflective patch that blinds cameras.
- Shrinking the code to fit one more review quote; the quote can be shortened, the code cannot.
- Encoding a long retailer-specific URL; use a short universal link and route by region server-side.
- Forgetting the spine: on books under about 15 mm thick, the back cover's usable flat area shrinks fast.
    `,
    faqs: [
      {
        question: 'Where should the QR code go on a book cover?',
        answer:
          'Bottom corner of the back cover, on the flat panel clear of the spine. That is where readers already look for the ISBN, it keeps the code out of the cover art, and it stays flat even on thin books where the spine area curves.',
      },
      {
        question: 'Can a QR code sit next to the ISBN barcode?',
        answer:
          'Keep them separated by at least a few millimeters of clear space. Adjacent symbologies confuse some scanner apps, and the ISBN has strict quiet-zone requirements of its own. Give each code its own breathing room.',
      },
      {
        question: 'Does gloss lamination affect book cover QR codes?',
        answer:
          'Significantly. Bookstore spotlights turn gloss laminate into glare that destroys contrast at an angle. Specify matte laminate for the code area — or spot-matte just that panel if the rest of the cover must stay glossy.',
      },
      {
        question: 'What should a book QR code link to?',
        answer:
          'A persistent destination: the author site, the book page, bonus content, or the audiobook sample. Avoid campaign URLs that expire — books sell for years, and a dead code on a back cover is permanent embarrassment. Use a redirect you control.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'apparel-hang-tags',
    useCase: 'Apparel Hang Tag',
    primaryKeyword: 'qr code size clothing hang tag',
    canonicalCalcParams: {
      distanceCm: 25,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 20,
    recommendedSizeIn: 0.79,
    substrateMaterial: 'Thick uncoated or coated tag board',
    printingMethod: 'Offset or digital printing',
    specificWarnings: [
      'Swinging tags blur scans — the short URL and 20mm minimum compensate for motion',
      'Keep the string hole and eyelet clear of the quiet zone — punched holes through the code are fatal',
      'Uncoated board softens module edges — do not go below 20mm on uncoated stock',
      'Never print across the tag fold or perforation',
    ],
    title: 'QR Code Size for Apparel Hang Tags: 20mm Minimum',
    metaDescription:
      'Hang tag QR codes: 20mm minimum with short URLs for 25cm scans. String-hole clearance, swing-blur tips, and tag board print advice.',
    content: `
### Hang Tags: Small, Swinging, and Handled Constantly

Apparel hang tags are scanned at 20 to 30 cm, usually while the shopper holds the garment up. The tag itself is small — often just 50 × 90 mm — and it swings on its string, which means the code must decode quickly before motion blur sets in. Tags also endure constant handling: folding, pocketing, rain, and the general abuse of the shop floor. The sizing strategy here is simple — as large as the tag allows, with the shortest URL you can manage.

### The 10:1 Rule of Thumb

At 25 cm the rule suggests 25 mm, but hang-tag real estate rarely allows it. With a short URL and a modern phone, 20 mm is the practical minimum — and the short URL is doing real work here, keeping the QR version low and the modules large and forgiving. If the tag design cannot spare 20 mm plus a full quiet zone, the code doesn't belong on the tag; put it on the packaging or the care label instead.

### Recommended Size

Print at 20 × 20 mm (about 0.8 inches) on the tag's flattest area. On larger boutique tags (70 × 120 mm and up), step up to 25 mm for extra reliability. Anything below 18 mm on a swinging tag is a gamble — it may scan in the studio and fail in the store.

### Substrate and Printing

Tags print offset or digital on thick tag board, usually uncoated for a premium tactile feel. Uncoated board wicks ink slightly and softens module edges, so don't push below 20 mm on uncoated stock; coated board holds sharper edges and is more forgiving at small sizes. Foil stamping and embossing are common on hang tags — keep every decorative process far away from the code area.

### Placement and Practical Tips

- Keep the string hole and eyelet well clear of the quiet zone — a punched hole through the code is an obvious but remarkably common failure.
- Shoppers instinctively hold the tag still to scan; add "hold steady & scan" microcopy if the link matters to conversion.
- Link to size guides, styling videos, fabric care, or sustainability credentials — content that answers fitting-room questions at the moment of decision.
- Consider the tag's reverse: the front sells the brand, the back can carry the code without any design compromise.
- If the garment has a sewn-in fabric label too, don't duplicate the code — one scannable code per garment is plenty.

### Common Mistakes

- Printing the code across the tag's fold or perforation, where it distorts the moment the tag flexes.
- Encoding a 150-character product URL with variants and tracking; use a short link and resolve details server-side.
- Forgetting that tags get handled, folded, rained on, and left in hot cars — uncoated tags in particular wear fast, so link to persistent pages.
- Decorative die-cuts or shaped tags that eat into the quiet zone.
    `,
    faqs: [
      {
        question: 'What is the smallest QR code that works on a hang tag?',
        answer:
          '20mm square is the practical minimum, paired with a short URL (under 40 characters). Below 18mm, module edges soften on tag board and the swinging motion defeats phone cameras. If 20mm plus quiet zone will not fit, move the code to the packaging.',
      },
      {
        question: 'How do I stop the string hole from ruining the QR code?',
        answer:
          'Lay out the tag with the hole position fixed first, then place the code — quiet zone included — clear of it. A good rule is to keep at least 5mm between the hole edge and the quiet zone boundary.',
      },
      {
        question: 'Should the QR code go on the front or back of a hang tag?',
        answer:
          'The back is usually better: the front carries branding and product storytelling, while the back has the space and the flat area a code needs. Shoppers flip tags instinctively, so discoverability is not an issue.',
      },
      {
        question: 'What should a clothing hang tag QR code link to?',
        answer:
          'Content that helps at the point of decision: size and fit guides, styling videos, fabric and care details, or sustainability credentials. Use a short redirect URL so the link survives website redesigns long after the season ends.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'museum-plaques',
    useCase: 'Museum Plaque',
    primaryKeyword: 'qr code size museum label',
    canonicalCalcParams: {
      distanceCm: 80,
      substrateType: 'metal',
      lightingCondition: 'dim',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 80,
    recommendedSizeIn: 3.15,
    substrateMaterial: 'Anodized aluminum, acrylic, or dibond panel',
    printingMethod: 'UV direct print or engraved infill',
    specificWarnings: [
      'Dim gallery lighting punishes small dense codes — use the 8:1 divisor as practical guidance, not 10:1',
      'Protective glass in dark rooms reflects brightly — use anti-reflective glazing or angle the glass',
      'Keep wall text, donor lines, and translations out of the quiet zone',
      'Plaques outlive website redesigns — link via a permanent redirect you control',
    ],
    title: 'QR Code Size for Museum Plaques: Dim-Gallery Guide',
    metaDescription:
      'Museum plaque QR codes: 80mm for dim galleries at 80cm. Low-light sizing rule, protective glass glare tips, and permanent URL advice.',
    content: `
### Museum Plaques: Dim Light, Respectful Distance

Museum and gallery plaques are read from 50 to 100 cm — visitors stand back, often behind a rope line, in deliberately dim lighting that is far darker than a shop or office. Low light forces phone cameras into noisy high-ISO modes, which punishes small, dense codes disproportionately: a code that scans fine under office fluorescents can fail completely in a gallery. Size for the gallery, not the studio.

### The 10:1 Rule of Thumb, Adjusted for Dim Light

At 80 cm the basic rule suggests 80 mm; in dim galleries, treat 8:1 as the practical divisor instead, which points to 100 mm. As guidance: 80 mm is the minimum for moderately lit galleries, and 100 mm is the comfortable target for truly dim rooms. The adjustment exists because camera noise at high ISO blurs fine module edges — larger modules survive the noise. Very dim galleries (candlelit historic interiors, for example) may need larger still; test in situ.

### Recommended Size

Print at 80 × 80 mm (about 3.15 inches) as the minimum, stepping up to 100 mm in dim galleries. The code should be recognizable as a code — not just a texture — from the rope line. On large introductory panels (1 m and up), scale proportionally; a 120 mm code on a big panel looks deliberate and scans from farther back.

### Substrate and Printing

Plaques are anodized aluminum, acrylic, or dibond panels with UV direct print or engraved infill. Engraved-then-ink-filled codes are effectively permanent and ideal for long-term exhibitions. Printed acrylic needs protection from the cleaning chemicals used on gallery surfaces — specify chemical-resistant inks or a protective laminate over the print.

### Placement and Practical Tips

- Keep wall text, donor lines, and translations out of the quiet zone — crowded multilingual plaques are the number-one museum failure.
- If the plaque sits behind protective glass, angle the glass slightly or specify anti-reflective glazing; reflections are worse in dark rooms because the camera exposes for the bright reflection rather than the code.
- Link to the audio-guide entry, the object's deep-dive page, or a multilingual version — and keep that URL stable for years. Plaques outlive website redesigns, CMS migrations, and entire digital strategies.
- Test with the gallery's actual lighting, including motion-triggered spots that change brightness as visitors approach.
- Consider visitors with older phones: galleries attract all ages, and the 8:1 guidance already bakes in some margin for weaker cameras.

### Common Mistakes

- Sizing for the curator's bright office instead of the dim gallery where the plaque actually lives.
- URLs that rot when the museum relaunches its website — use a permanent redirect under a domain you control.
- Tiny codes on crowded multilingual plaques where the quiet zone is aspirational rather than real.
- Engraving the code without ink infill on bare metal — low contrast that only scans in perfect light.
    `,
    faqs: [
      {
        question: 'Why do museum QR codes need to be larger than normal?',
        answer:
          'Galleries are dim, and dim light forces phone cameras into noisy high-ISO modes that blur fine module edges. The practical guidance is to use an 8:1 distance divisor instead of 10:1 — so an 80cm viewing distance calls for a 100mm code rather than 80mm.',
      },
      {
        question: 'How do I stop protective glass from blocking QR scans?',
        answer:
          'Angle the glass slightly so reflections bounce away from typical viewing positions, or specify anti-reflective glazing. Also increase the code size a step — reflections cost contrast, and size buys it back. Test with a phone in the actual gallery lighting.',
      },
      {
        question: 'What should a museum plaque QR code link to?',
        answer:
          'The audio-guide entry, extended object information, or multilingual content — things the physical plaque cannot hold. Most importantly, link through a permanent redirect you control, because plaques stay on walls far longer than websites stay unchanged.',
      },
      {
        question: 'Engraved or printed QR codes for museum plaques?',
        answer:
          'Engraved with ink infill is the most durable — effectively permanent and resistant to cleaning chemicals. UV direct print is excellent and cheaper, but specify chemical-resistant inks since gallery surfaces are wiped down regularly.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'real-estate-signs',
    useCase: 'Real Estate Sign',
    primaryKeyword: 'qr code size real estate sign',
    canonicalCalcParams: {
      distanceCm: 500,
      substrateType: 'metal',
      lightingCondition: 'bright',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 300,
    recommendedSizeIn: 11.81,
    substrateMaterial: 'Aluminum composite, corrugated plastic, or PVC board',
    printingMethod: 'UV flatbed or screen printing with UV-stable inks',
    specificWarnings: [
      'Size for curbside pedestrians, not close-up readers — a business-card-sized code on a yard sign is invisible beyond a meter',
      'UV-stable inks are mandatory — a faded code on a months-long listing is a dead code',
      'Reflective sheeting can interfere with scanning — test at night with a phone, not just in daylight',
      'Keep the listing link live until well after settlement — dead links on sold signs embarrass the brand',
    ],
    title: 'QR Code Size for Real Estate Signs: Curbside Guide',
    metaDescription:
      'Real estate sign QR codes: 300mm for curbside scanning. UV-fade protection, sidewalk-facing placement, reflective sheeting tests, and live-link tips.',
    content: `
### Real-Estate Signs: The Curbside Glance

Yard signs and site boards are viewed from 3 to 10 meters — by pedestrians on the sidewalk and drivers slowing past. Nobody stops their car, gets out, and walks up to scan a 25 mm code; the code must work from the curb, which means it must be big. Real-estate codes compete with everything else on the sign — price, agent photo, phone number — so the code has to earn a large, uncluttered panel.

### The 10:1 Rule of Thumb

At 5 m the rule suggests 500 mm, which is impractical on a standard yard sign. The practical compromise: 250–300 mm codes target pedestrians and slow traffic at 2–4 m, which is honestly where scans happen. Anyone viewing from farther away was never going to scan anyway. On large site hoardings viewed from across the street, scale up proportionally — hoardings have the space, so use it.

### Recommended Size

Print at 300 × 300 mm (about 12 inches) on the sign's main panel or as a separate rider beneath it. Face the code toward the sidewalk at pedestrian eye height — not toward the road at driver height. One code per sign: multiple codes (agent profile, listing, mortgage calculator) paralyze the viewer and none of them gets scanned.

### Substrate and Printing

Signs use aluminum composite, corrugated plastic (coroplast), or PVC board with UV flatbed or screen printing. UV-stable inks are mandatory — a sign that bakes in the sun for a months-long listing will fade an unprotected code into unscannability. Anything less than outdoor-rated materials is a false economy; the sign looks fine while the code silently dies.

### Placement and Practical Tips

- Sidewalk-facing, at pedestrian eye height. The road-facing side is for the phone number in big type; the sidewalk side is where scans happen.
- Link to the live listing or a virtual tour, and keep it live until well after settlement. Dead links on "SOLD" signs are a brand embarrassment that outlives the listing.
- Reflective sheeting is great for night visibility but can interfere with scanning — test at night with an actual phone, not just in daylight.
- Keep the code's panel uncluttered: no "SOLD" rider overlapping it, no balloons tied over it, no fine print crowding the quiet zone.
- Use a short redirect URL per listing so codes stay small-modulated and links can be updated or retired centrally.

### Common Mistakes

- A business-card-sized code on a yard sign — the classic failure, invisible beyond a meter.
- Letting the listing URL expire mid-campaign while the sign is still in the ground.
- Placing the code where the "SOLD" or "UNDER CONTRACT" rider will cover it.
- Encoding the full MLS URL with session parameters instead of a short redirect.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on a real estate yard sign?',
        answer:
          '300mm square is the reliable target for curbside scanning at 2–4 meters. Anything under 200mm on a yard sign is effectively decorative — pedestrians will not cross the lawn to scan it, and drivers cannot safely scan at all.',
      },
      {
        question: 'Should the QR code face the street or the sidewalk?',
        answer:
          'The sidewalk. Drivers should never be scanning while moving, so the road-facing side is for big-type phone numbers. Put the code on the pedestrian side at eye height, where someone walking past can comfortably stop and scan.',
      },
      {
        question: 'How do I keep a real estate QR code working for a long listing?',
        answer:
          'Three things: UV-stable inks and outdoor-rated substrate so the code does not fade; a short redirect URL so the destination can be updated without reprinting; and a commitment to keep the link live until well after the sale closes.',
      },
      {
        question: 'Do reflective real estate signs affect QR scanning?',
        answer:
          'They can. Reflective sheeting improves night visibility for human eyes but creates hotspots for phone cameras. If the sign uses reflective material, test the code at night with several phones before the sign goes in the ground.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'id-badges',
    useCase: 'ID Badge',
    primaryKeyword: 'qr code size id badge',
    canonicalCalcParams: {
      distanceCm: 25,
      substrateType: 'plastic',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 20,
    recommendedSizeIn: 0.79,
    substrateMaterial: 'PVC cards (CR80 / credit-card size)',
    printingMethod: 'Dye-sublimation retransfer printing for sharpest module edges',
    specificWarnings: [
      'Keep the lanyard slot and punched holes clear of the quiet zone',
      'Chest-height scanning means awkward tilted angles — 20mm minimum, never smaller',
      'Encode an opaque identifier only — never access rights or personal data in the code',
      'Keep holographic security overlays and metallic inks away from the code area',
    ],
    title: 'QR Code Size for ID Badges: 20mm Card Guide',
    metaDescription:
      'ID badge QR codes: 20mm on CR80 cards for chest-height scans. Retransfer print sharpness, lanyard clearance, and minimal-payload security tips.',
    content: `
### ID Badges: The Chest-Height Scan

ID badge QR codes — for access control, event check-in, or staff identification — are scanned at 20 to 30 cm, usually while the badge hangs from a lanyard or clip at chest height. The scan geometry is awkward by nature: the holder tilts the badge toward the reader while the reader points back, so the code is routinely scanned at an angle. Everything about badge codes should be optimized for tilted, hurried, repeated scanning.

### The 10:1 Rule of Thumb

At 25 cm the rule suggests 25 mm; 20 mm is the practical standard on a CR80 card (85.6 × 54 mm — the credit-card size), which leaves room for the photo, name, and company branding that badges also carry. Keep the payload minimal — an ID number or short token, never a full profile. A short payload keeps the QR version low and the modules large, which is exactly what tilted scanning needs.

### Recommended Size

Print at 20 × 20 mm (about 0.8 inches) on the badge front or back. Smaller than 15 mm invites failures, especially given the tilted scan angles badges endure and the varying quality of checkpoint lighting. If the badge design cannot fit 20 mm plus quiet zone, put the code on the back — scanners don't care which side it's on, and the front stays clean for human-readable identification.

### Substrate and Printing

Badges print on PVC cards by dye-sublimation (direct-to-card) or retransfer printing. Retransfer — where the image is printed onto a film and then fused to the card — produces sharper module edges and is worth specifying for small codes; direct-to-card printing can leave slightly soft edges that cost reliability at 20 mm. Avoid placing the code over holographic security overlays or metallic inks, both of which destroy the contrast cameras need.

### Placement and Practical Tips

- Keep the lanyard slot, clip hole, and any punched holes well clear of the quiet zone — plan the hole position before placing the code.
- Encode an opaque identifier and resolve permissions server-side; never encode access rights, personal data, or anything sensitive directly in a code that anyone with a phone can read.
- Test with the actual scanners at the actual checkpoints, in the venue's real lighting — phone cameras and dedicated imagers behave differently.
- Matte or satin card finishes scan more reliably than high-gloss under checkpoint lighting; specify accordingly.
- If badges are reprinted often (events, contractors), use a short stable URL pattern so old codes keep resolving.

### Common Mistakes

- Encoding a vCard with photo and biography — the dense symbol won't survive badge-sized printing or tilted scanning.
- Holographic overlays or metallic inks crossing the code area, added by the security team without consulting the code layout.
- Glossy cards under harsh checkpoint downlights creating glare exactly where the code sits.
- Putting the only machine-readable credential on the front where lanyard clips and thumb wear degrade it fastest.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on an ID badge?',
        answer:
          '20mm square is the practical standard on CR80 (credit-card sized) badges scanned at 20–30cm. That leaves room for photo, name, and branding while keeping modules large enough for the tilted, hurried scans badges endure. Do not go below 15mm.',
      },
      {
        question: 'Is it safe to put personal data in a badge QR code?',
        answer:
          'No. Anyone with a phone can read a QR code, so encode only an opaque identifier (an ID number or token) and resolve everything sensitive server-side. Never encode access rights, addresses, or personal details directly in the symbol.',
      },
      {
        question: 'Direct-to-card or retransfer printing for badge QR codes?',
        answer:
          'Retransfer, where the image is printed to film then fused to the card. It produces sharper module edges than direct-to-card dye-sublimation, which matters at 20mm where every fraction of a millimeter of edge sharpness counts.',
      },
      {
        question: 'Front or back of the badge for the QR code?',
        answer:
          'Either works for scanners, so choose based on design: front if the badge is primarily machine-read (access control), back if humans need the front for photo and name. Just keep lanyard slots, holes, and holographic overlays clear of the code.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'tickets-wristbands',
    useCase: 'Tickets & Wristbands',
    primaryKeyword: 'qr code size event ticket wristband',
    canonicalCalcParams: {
      distanceCm: 20,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 25,
    recommendedSizeIn: 0.98,
    substrateMaterial: 'Thermal ticket stock; Tyvek, vinyl, or silicone wristbands',
    printingMethod: 'Thermal transfer or direct thermal printing',
    specificWarnings: [
      'Wristband curvature foreshortens edge modules — place the code on the flattest outer panel only',
      'Sweat and rain smudge cheap thermal print by mid-event — use Tyvek or vinyl for wristbands',
      'Keep tear-off stubs and perforations away from the code — a torn quiet zone voids the ticket',
      'Test with the actual gate hardware in daylight and under floodlights — gate scanners are not phones',
    ],
    title: 'QR Code Size for Tickets & Wristbands: Gate-Ready Guide',
    metaDescription:
      'Event ticket QR codes: 25mm; wristbands 18–20mm on flat panels. Gate scanner testing, curvature limits, sweat-proof materials, and stub placement.',
    content: `
### Tickets and Wristbands: The Gate Rush

Event tickets and wristbands are scanned at gates under time pressure — 15 to 25 cm, often in uneven outdoor light, by staff who need each scan to take under a second. Reliability here is operational, not cosmetic: a 1% failure rate at a 10,000-person gate is a hundred angry attendees and a queue that stops moving. Size for the worst gate conditions (bright sun, tired staff, old scanners), not the best.

### The 10:1 Rule of Thumb

At 20 cm the rule suggests 20 mm; print tickets at 25 mm for margin, because gate scanning is hurried and imperfect. Wristbands are the harder case — the wearable area is small and curved — so 18–20 mm on the flattest panel, with the shortest possible payload doing the heavy lifting. In both cases, encode a short ticket token, never attendee details: density is the enemy of gate speed.

### Recommended Size

Tickets: 25 × 25 mm (about 1 inch). Wristbands: 18–20 mm on the flat outer panel opposite the closure. On wristbands, the flat panel is small, so every millimeter counts — resist the urge to add decorative elements near the code, and keep the token short enough that the QR version stays low.

### Substrate and Printing

Tickets print thermal or thermal-transfer on ticket stock; wristbands are Tyvek, vinyl, or silicone with thermal-transfer print. Tyvek survives sweat, rain, and multi-day festivals; paper wristbands don't — match the material to the event conditions honestly. Thermal-transfer (with ribbon) outlasts direct thermal for multi-day events; direct thermal is fine for single-evening use but fades and smudges with heat and moisture.

### Placement and Practical Tips

- On wristbands, place the code on the flat panel opposite the adhesive closure, and keep it off the curve of the wrist — curvature foreshortens edge modules and the code is scanned while worn.
- Keep tear-off stubs and perforations away from the code; a stub torn through the quiet zone voids the ticket at the worst moment.
- Gate scanners are usually dedicated imagers, not phones — test with the actual gate hardware, in daylight and under floodlights, before doors open.
- Print a human-readable ticket number under the code as a fallback for manual entry when scanning fails.
- For festivals, print a spare batch: wristbands get lost, damaged, and swapped, and reprinting mid-event is chaos.

### Common Mistakes

- Wristband codes printed on the curved section that sits on top of the wrist, where modules compress.
- Cheap direct-thermal wristbands that smudge into illegibility with sweat by mid-event.
- Encoding the entire order confirmation — long payloads make dense symbols and slow every gate transaction.
- No human-readable fallback, so a single scanner failure becomes a customer-service incident.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on an event ticket?',
        answer:
          '25mm square is the gate-reliable target for tickets scanned at 15–25cm. Encode a short ticket token (not the full order), keep the code clear of perforations and stubs, and test with the actual gate scanners before doors open.',
      },
      {
        question: 'How small can a wristband QR code be?',
        answer:
          '18–20mm on the flattest outer panel is the practical floor. Curvature is the limiting factor — place the code opposite the closure where the band sits flattest, keep the payload to a short token, and use Tyvek or vinyl rather than paper for multi-day events.',
      },
      {
        question: 'Why do wristband QR codes stop scanning during festivals?',
        answer:
          'Usually sweat, rain, or abrasion smudging direct-thermal print, or the band stretching so the code distorts. Use thermal-transfer printing on Tyvek or vinyl for anything longer than an evening, and keep a human-readable ticket number as fallback.',
      },
      {
        question: 'Should I test ticket codes with a phone or the gate scanner?',
        answer:
          'The gate scanner — always. Dedicated gate imagers have different optics, lighting, and decode behavior than phone cameras. A code that scans beautifully on your phone can still fail on the event hardware, and you will discover it at the worst possible time.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'menus',
    useCase: 'Menu',
    primaryKeyword: 'qr code size restaurant menu',
    canonicalCalcParams: {
      distanceCm: 40,
      substrateType: 'coated-paper',
      lightingCondition: 'dim',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 40,
    recommendedSizeIn: 1.57,
    substrateMaterial: 'Laminated card or synthetic paper (spill-resistant)',
    printingMethod: 'Digital printing + matte lamination, sealed edges',
    specificWarnings: [
      'Gloss lamination under pendant lights is the most common reason menu codes fail — specify matte',
      'Keep the code off the center fold and spine stitching — folds crack laminate and distort modules',
      'Dim dining rooms need the 8:1 divisor as practical guidance — 40mm minimum, 50mm comfortable',
      'Changing the URL means reprinting the whole run — use a redirect you control',
    ],
    title: 'QR Code Size for Restaurant Menus: Dim-Table Guide',
    metaDescription:
      'Menu QR codes: 40mm for dim dining rooms at 40cm. Matte lamination rule, fold-line placement, spill-proof edges, and mobile page tips.',
    content: `
### Menus: The Dim-Table Scan

Menu QR codes — linking to the full menu, allergen and nutrition information, or table ordering — are scanned at 30 to 50 cm across a table, usually in the dim, warm light of a dining room. This is close kin to the table-tent case, with the same low-light penalty on camera performance, plus the added hazards of spills, nightly wipe-downs, and folds. A menu code has to survive the dining room, not just the design studio.

### The 10:1 Rule of Thumb, Adjusted for Dim Light

At 40 cm the basic rule suggests 40 mm; in dim dining rooms, use the 8:1 divisor as practical guidance, which lands in the same 40–50 mm neighborhood. Treat 40 mm as the minimum and 50 mm as comfortable. Candlelit rooms push toward the upper end. The adjustment is guidance for real conditions — camera noise in low light blurs fine module edges, and larger modules survive it.

### Recommended Size

Print at 40 × 40 mm (about 1.6 inches) on the menu's front or back cover. On large multi-page menus, the back cover keeps the code findable without interrupting the food photography; on single-page menus, a bottom corner works. Keep the code off the center fold and away from spine stitching — folds crack laminate and distort modules exactly where the code sits.

### Substrate and Printing

Menus are typically laminated card or synthetic paper, which survives spills without lamination. If laminating, specify matte — gloss laminate under pendant lights is the single most common reason menu codes fail in real restaurants. Sealed or rounded laminate edges resist the nightly wipe-downs menus endure; unsealed edges peel, admit moisture, and eventually lift the print.

### Placement and Practical Tips

- Add microcopy with the value proposition: "Scan for allergens & nutrition" or "Scan to order" outperforms a naked code that guests ignore.
- If the menu links to ordering, the code must survive the entire print run — changing the URL means reprinting everything, so use a redirect you control from day one.
- Synthetic paper (polypropylene-based) is worth the premium for menus: it survives spills, wiping, and folding far better than laminated card.
- Test in the actual dining room at dinner lighting, not in the office. The difference is often dramatic.
- Keep the landing page instant and mobile-first; diners scan while hungry and impatient.

### Common Mistakes

- Gloss lamination plus pendant lighting equals an unscannable mirror — the classic menu failure.
- Codes printed across the fold of a tent-fold menu, cracking within weeks.
- Linking straight to a PDF menu that renders miserably on phones; link to a proper mobile page.
- Decorative borders or illustrations crowding the quiet zone on designed menus.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on a restaurant menu?',
        answer:
          '40mm square is the minimum for menus scanned at 30–50cm in dim dining rooms; 50mm is more comfortable. The dim light calls for the 8:1 distance divisor as practical guidance, and matte lamination is mandatory under pendant lighting.',
      },
      {
        question: 'Why do menu QR codes fail more than other print codes?',
        answer:
          'Three compounding causes: dim dining-room light (camera noise), gloss lamination under pendant lights (glare), and physical abuse (spills, folding, nightly wipe-downs). Matte laminate, 40mm+ size, and synthetic paper solve nearly all of it.',
      },
      {
        question: 'Where should the QR code go on a menu?',
        answer:
          'Front or back cover, in a bottom corner, clear of folds and stitching. Avoid the center fold entirely — it cracks laminate and distorts modules. On multi-page menus the back cover keeps the code findable without breaking the food photography.',
      },
      {
        question: 'What should a menu QR code link to?',
        answer:
          'The mobile menu, allergen and nutrition information, or table ordering — with a short redirect URL you control, since changing a printed menu URL means reprinting the whole run. Never link directly to a PDF; build a proper mobile page.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'shelf-labels',
    useCase: 'Shelf Label',
    primaryKeyword: 'qr code size shelf edge label',
    canonicalCalcParams: {
      distanceCm: 50,
      substrateType: 'coated-paper',
      lightingCondition: 'normal',
      payloadDensity: 'medium',
    },
    recommendedSizeMm: 35,
    recommendedSizeIn: 1.38,
    substrateMaterial: 'Shelf-edge strips or adhesive price labels',
    printingMethod: 'Thermal transfer at 300 DPI (qualify the actual printer model)',
    specificWarnings: [
      'Low shelves force steep viewing angles that foreshorten the code — size up or move the code to the product',
      'Keep the code on the flat front face of the strip, never wrapping over edges',
      '203 DPI price-gun printing merges fine modules — keep payloads short and qualify each printer',
      'Encode the SKU, not the price — reprinting thousands of labels for a price change is avoidable',
    ],
    title: 'QR Code Size for Shelf Labels: Retail Edge Guide',
    metaDescription:
      'Shelf label QR codes: 35mm on shelf-edge strips for 50cm scans. Steep-angle tips, 300 DPI print rule, shadow-line placement, and SKU URL advice.',
    content: `
### Shelf Labels: The Crouch-and-Scan

Shelf-edge labels and price tickets are scanned from 40 to 80 cm — shoppers crouch, lean, and angle their phones at low shelves while holding a basket in the other hand. The viewing angle is often steep, which foreshortens the code vertically and punishes small modules. Shelf labels also live in the shadow line cast by the shelf above, in lighting that is adequate but rarely generous.

### The 10:1 Rule of Thumb

At 50 cm the rule suggests 50 mm, but shelf-edge strips are rarely that tall — standard strips run 25–40 mm in height. The practical target is 30–35 mm on the flat face of the strip, compensating with a short URL and high-contrast print rather than raw size. Where the strip genuinely cannot fit 30 mm, the code belongs on the product packaging or a shelf talker instead.

### Recommended Size

Print at 35 × 35 mm (about 1.4 inches) on shelf-edge strips; 25–30 mm is workable on adhesive price labels with short payloads and 300 DPI thermal-transfer printing. For bottom shelves scanned at steep crouch angles, favor the upper end — angle foreshortening effectively shrinks the code as seen by the camera.

### Substrate and Printing

Shelf strips print thermal-transfer (300 DPI preferred) on plastic or coated paper strips; price guns and portable label printers vary wildly in quality. Qualify the actual printer model with real test scans — a "thermal transfer printer" category tells you nothing about the specific unit's dot control. Adhesive price labels on products face handling and refrigeration; specify stocks rated for the environment.

### Placement and Practical Tips

- Keep the code on the flat front face of the strip, never wrapping over the strip's top or bottom edge where it distorts.
- Avoid the shadow line cast by the shelf above; codes sitting in shadow lose the contrast margin that makes scanning forgiving.
- If prices change often, link the code to the product page via a stable SKU-based URL, so the label never needs reprinting for a price change.
- On deep shelves, keep the code toward the front edge — codes half-hidden behind the product in front simply don't get scanned.
- For refrigerated cases, condensation is a factor; specify moisture-resistant label stocks.

### Common Mistakes

- 203 DPI price-gun printing of a dense code — modules merge and the code dies at birth.
- Encoding the price instead of the SKU, guaranteeing a full reprint with every price change.
- Codes on the bottom shelf placed for a standing adult's eye line rather than a crouching shopper's.
- Assuming the strip printer in the back office matches the one at the pilot store — qualify every model.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on a shelf-edge strip?',
        answer:
          '35mm square on the flat front face is the reliable target for 40–80cm scans. Standard strips are 25–40mm tall, so 30–35mm is the realistic fit — compensate with a short URL and 300 DPI thermal-transfer printing rather than trying to force more size.',
      },
      {
        question: 'Why do shelf label QR codes fail at low shelves?',
        answer:
          'Steep viewing angles foreshorten the code vertically, effectively shrinking it as the camera sees it. Size toward the upper end for bottom shelves, keep the code on the flat face, and consider moving the code to the product for the lowest shelves.',
      },
      {
        question: 'Can price-gun printers produce scannable QR codes?',
        answer:
          'Some can, many cannot. 203 DPI price guns merge fine modules, so keep payloads very short and test with the exact printer model. For reliable results, use 300 DPI thermal-transfer printers and qualify each unit with real scans.',
      },
      {
        question: 'Should shelf QR codes encode the price or the SKU?',
        answer:
          'The SKU — always. Encoding the price means reprinting thousands of labels with every price change. A SKU-based URL stays stable forever while prices, promotions, and stock levels change behind it.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'laptop-stickers',
    useCase: 'Laptop Sticker',
    primaryKeyword: 'qr code size laptop sticker',
    canonicalCalcParams: {
      distanceCm: 40,
      substrateType: 'plastic',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 30,
    recommendedSizeIn: 1.18,
    substrateMaterial: 'White vinyl (BOPP) with UV-protective laminate',
    printingMethod: 'Digital printing + die cutting',
    specificWarnings: [
      'Clear vinyl on metallic lids collapses contrast — always use white vinyl as the base',
      'Matte laminate over gloss — aluminum lids plus gloss plus office downlights is a glare sandwich',
      'Keep the code on the lid flat center, away from curved edges and the hinge',
      'UV laminate matters — field laptops live in sunlight and faded codes fail quietly',
    ],
    title: 'QR Code Size for Laptop Stickers: 30mm Desk Guide',
    metaDescription:
      'Laptop sticker QR codes: 30mm vinyl for 40cm desk scans. Matte laminate glare rule, metallic lid contrast tips, and UV-fade protection.',
    content: `
### Laptop Stickers: The Desk-Distance Scan

Laptop lid stickers — for asset tags, support links, inventory, or brand flair — are scanned from 30 to 50 cm across a desk or in a meeting room. The lid is a large, flat, usually metallic surface: an opportunity (plenty of space for a generous code) and a hazard (reflections off aluminum under office downlights). Sticker codes also live for years, through sunlight, heat, and cleaning — durability is part of sizing, because a faded code is effectively a smaller code.

### The 10:1 Rule of Thumb

At 40 cm the rule suggests 40 mm; 30 mm is the practical sweet spot — big enough for reliable desk-distance scanning, small enough to sit comfortably on a lid without dominating it or covering the manufacturer's branding (which invites IT to peel it off). Asset-tag stickers can go to 20 mm only if the payload is a short asset ID; anything descriptive needs the full 30 mm.

### Recommended Size

Print at 30 × 30 mm (about 1.2 inches). Keep the code on the lid's flat center, away from curved edges, the hinge, and vents. On 13-inch and smaller lids, 25 mm still scans fine at desk distance — but 30 mm costs nothing and buys margin for glare and aging.

### Substrate and Printing

Use white vinyl (BOPP) with a UV-protective laminate, digitally printed and die-cut. The white base is doing critical contrast work against metallic lids — never print a code on clear vinyl for a silver laptop and expect it to scan outside perfect light. The UV laminate protects against sun fade for field laptops; indoor-only machines can use a standard laminate, but UV costs little extra.

### Placement and Practical Tips

- Matte laminate over gloss, always. Aluminum lids plus gloss laminate plus office downlights create glare that defeats even large codes.
- For asset tags, encode the asset ID only and resolve everything else in the asset management system — short payload, large modules, permanent link.
- Stickers on field laptops live in sunlight, heat, and vehicle dashboards; specify UV-stable inks and laminate rated for it.
- Keep support-link stickers where the user can see them while on a support call — lid center, not hidden under the palm rest.
- If the organization reimages or retires machines, the asset system — not the sticker — should carry the lifecycle; keep sticker payloads stable.

### Common Mistakes

- Clear stickers on metallic lids — contrast collapses and the code only scans in perfect, diffuse light.
- Stickers placed half over the lid's edge curve, distorting the outer modules.
- Giant codes covering the laptop's branding, which guarantees IT removes them.
- Linking to an internal URL that dies when the asset system is migrated — use a stable redirect pattern.
    `,
    faqs: [
      {
        question: 'What size should a QR code sticker be on a laptop lid?',
        answer:
          '30mm square is the sweet spot for desk-distance scanning at 30–50cm. It is large enough to survive glare and aging, small enough to sit comfortably on the lid. Asset tags with short ID payloads can use 20mm.',
      },
      {
        question: 'Why do QR stickers fail on silver laptops?',
        answer:
          'Metallic lids reflect office lighting into the camera, and clear vinyl adds nothing to fight it. Use white vinyl as the base for contrast, matte laminate to kill glare, and keep the code on the flat center of the lid.',
      },
      {
        question: 'How long do laptop QR stickers stay scannable?',
        answer:
          'Years, if specified correctly: white vinyl, UV-protective laminate, and UV-stable inks. Without UV protection, sun-exposed stickers fade within a year or two — and fading fails gradually, so nobody notices until scans stop working.',
      },
      {
        question: 'What should a laptop asset tag QR code contain?',
        answer:
          'The asset ID only — a short, stable token. Resolve model, assignment, warranty, and history in the asset management system. Short payloads keep modules large, and the link never needs reprinting when backend systems change.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'presentation-slides',
    useCase: 'Presentation Slide',
    primaryKeyword: 'qr code size presentation slide',
    canonicalCalcParams: {
      distanceCm: 500,
      substrateType: 'glass',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 150,
    recommendedSizeIn: 5.91,
    substrateMaterial: 'Projected image (screen surface acts as the substrate)',
    printingMethod: 'Digital projection — high contrast black-on-white, no transparency effects',
    specificWarnings: [
      'Correct keystone before presenting — keystone distortion turns squares into trapezoids',
      'Leave the code static for 10–15 seconds — nobody scans a code that vanishes with the next slide',
      'Test from the back row with a mid-range phone, not the front row with a flagship',
      'Projector eco-mode dimming collapses contrast — run full brightness for code slides',
    ],
    title: 'QR Code Size for Presentation Slides: Back-Row Guide',
    metaDescription:
      'Slide QR codes: 10–15% of slide width for back-row scanning. Keystone correction, static display timing, and projector contrast tips.',
    content: `
### Presentation Slides: The Back-Row Scan

Slide QR codes — for feedback forms, resource links, contact sharing, or live polls — are scanned from 3 to 10 meters by an audience holding phones at various angles, in rooms you didn't design, on projectors you didn't choose. You cannot control their distance, their angle, or their phone — so the code must be unmissably large, brutally simple, and displayed long enough to actually be scanned.

### The 10:1 Rule of Thumb

At 5 m the rule suggests 500 mm on the projected image. On a typical 2 m-wide projection, that's a quarter of the image width — which is about right, and a useful gut check against the instinct to make the code "elegant" and small. As practical guidance, the code should occupy at least 10–15% of the slide's width, and never sit as a corner thumbnail. If the code is smaller than your fist at arm's length on your monitor, it's too small for the room.

### Recommended Size

On screen, aim for a code at least 150 mm (6 inches) across on the projected image for rooms up to 5 m deep; scale up for larger venues — a 10 m hall needs 300 mm or more. In slide-design terms: make it the largest element on the slide. Timid codes on slides are the most common conference failure, and the fix is free.

### Substrate and Printing (Digital)

There is no print substrate — but the display chain is the substrate, and it behaves like a bad print job when neglected. Projector lumens, ambient light, and screen material all degrade the code. High contrast is non-negotiable: pure black modules on a pure white panel. Brand-colored codes, transparency effects, and codes over background images all wash out under projection — save the branding for elsewhere on the slide.

### Placement and Practical Tips

- Correct keystone before presenting — keystone distortion turns squares into trapezoids and punishes edge modules first. Physical projector placement beats digital correction, which resamples and softens the image.
- Leave the code static on screen for at least 10–15 seconds; nobody scans a code that animates in and vanishes with the next slide. Park it on the closing slide during Q&A.
- Test from the back row with a mid-range phone, not from the front row with a flagship — your audience's hardware is average by definition.
- Keep the URL short and the landing page instant — conference Wi-Fi is famously hostile, and a slow page wastes the scan.
- Announce the code: "scan this for the slides" converts far better than a silent symbol.

### Common Mistakes

- Animating the code (flying in, fading, spinning) — motion plus distance equals failure.
- Placing the code over a busy background image instead of a clean white panel.
- Projector eco-mode dimming the image until the code's contrast collapses — run full brightness for code slides.
- Removing the slide before the back row has had time to focus, aim, and scan.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on a presentation slide?',
        answer:
          'At least 10–15% of the slide width — 150mm across on the projected image for rooms up to 5m deep, scaling up for larger venues. If it looks small on your monitor, it will be invisible from the back row. Make it the largest element on the slide.',
      },
      {
        question: 'How long should a QR code stay on screen?',
        answer:
          'At least 10–15 seconds, static — no animations. Audience members need time to notice it, unlock their phones, open the camera, and aim. Parking the code on the closing slide during Q&A gives everyone a relaxed window.',
      },
      {
        question: 'Does keystone correction affect QR codes?',
        answer:
          'Yes. Keystone distortion turns the code\u2019s squares into trapezoids, and edge modules suffer first. Fix it with physical projector placement rather than digital correction, which resamples the image and softens module edges.',
      },
      {
        question: 'Why do slide QR codes fail in bright conference rooms?',
        answer:
          'Ambient light washes out projection contrast — the same reason text looks faded. Dim the lights over the screen, run the projector at full brightness (not eco-mode), and use pure black on pure white with no transparency effects.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'email-signatures',
    useCase: 'Email Signature',
    primaryKeyword: 'qr code size email signature',
    canonicalCalcParams: {
      distanceCm: 40,
      substrateType: 'glass',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 30,
    recommendedSizeIn: 1.18,
    substrateMaterial: 'Recipient screen (PNG with white background, ~120px display size)',
    printingMethod: 'Digital image — supply at 2× resolution (240px) for retina displays',
    specificWarnings: [
      'Many email clients block images by default — always pair the code with a plain text link',
      'Transparent backgrounds inherit the client theme and can invert in dark mode — use white background',
      'Keep the file under ~20 KB to avoid tripping attachment and image filters',
      'Test rendering in Gmail, Outlook, and Apple Mail — signature handling differs wildly',
    ],
    title: 'QR Code Size for Email Signatures: 120px Digital Guide',
    metaDescription:
      'Email signature QR codes: 120px with text-link fallback. Image-blocking workarounds, retina scaling, dark-mode tips, and client testing advice.',
    content: `
### Email Signatures: The Optional Scan

QR codes in email signatures — typically linking to a vCard, booking page, or portfolio — are scanned from another screen or a printout at 30 to 50 cm. But email is a hostile medium for images: many clients block them by default, signatures get mangled by replies and forwards, and mobile clients resize unpredictably. An email-signature code is a convenience for the fraction of recipients who see images — never the primary call to action.

### The 10:1 Rule of Thumb

At 40 cm the rule suggests 40 mm on screen — roughly 150 px at standard display scaling. In practice, 100–150 px square is the workable range; larger codes bloat the signature, get stripped by some clients, and look disproportionate next to your name. 120 px displayed (supplied at 240 px for retina sharpness) is the balanced choice most signature designers land on.

### Recommended Size

Render at 120 × 120 px (about 30 mm on a standard display). Supply the image at 2× resolution (240 px) so it stays sharp on retina displays without layout bloat. In HTML signatures, set explicit width and height attributes so clients that resize aggressively still render it correctly.

### Substrate and Printing (Digital)

The "substrate" is the recipient's screen and email client. PNG with a solid white background is the safe format — transparent backgrounds inherit whatever the client renders behind them, and dark mode can invert a transparent-background code into unscannability. Keep the file under ~20 KB so it doesn't trip attachment filters or get stripped as a suspicious payload.

### Placement and Practical Tips

- Never make the code the only call to action — always pair it with a plain text link, because image blocking is the default in many corporate clients and the recipient may never see the code at all.
- Link to something with lasting value (booking page, vCard download, portfolio), not a campaign that expires.
- Test the signature by sending to Gmail, Outlook, and Apple Mail — rendering, image proxying, and dark-mode handling differ wildly between them.
- Remember dark mode: clients that invert or restyle emails can destroy a code without a white background. White background is cheap insurance.
- Changing roles? Use a redirect you control, because your code lives in thousands of sent emails you'll never update.

### Common Mistakes

- A code with no text fallback in a client that blocks images — the recipient sees a broken-image icon where your call to action should be.
- Encoding a 400-character vCard directly; link to a hosted contact page instead and keep the code simple.
- Oversized signature images that get clipped by mobile clients or flagged by corporate filters.
- Forgetting that every reply and forward carries the signature — keep the destination permanent.
    `,
    faqs: [
      {
        question: 'What size should a QR code be in an email signature?',
        answer:
          '120px square displayed (supplied at 240px for retina sharpness) is the balanced choice — about 30mm on a standard screen. Larger codes bloat the signature and risk being stripped; smaller codes strain phone cameras scanning from another screen.',
      },
      {
        question: 'Why does my email signature QR code show as a broken image?',
        answer:
          'Most likely image blocking: many clients (especially corporate Outlook) block remote images by default. Host the image reliably, keep it small, and — most importantly — always pair the code with a plain text link so the call to action survives image blocking.',
      },
      {
        question: 'Does dark mode break email signature QR codes?',
        answer:
          'It can, if the code has a transparent background — some clients restyle or invert the surroundings and contrast collapses. A solid white background behind the code prevents this entirely and costs nothing.',
      },
      {
        question: 'Should a QR code be the main call to action in an email signature?',
        answer:
          'No. Treat it as a convenience for recipients who see images and prefer scanning. The primary call to action should always be a plain text link — it works in every client, with images on or off, on every device.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'tv-screens',
    useCase: 'TV Screen',
    primaryKeyword: 'qr code size tv screen',
    canonicalCalcParams: {
      distanceCm: 300,
      substrateType: 'glass',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 200,
    recommendedSizeIn: 7.87,
    substrateMaterial: 'Emissive display (screen surface)',
    printingMethod: 'Digital display — full-bright white background, pure black modules',
    specificWarnings: [
      'Hold the code static for at least 5 seconds — viewers need time to notice, unlock, and aim',
      'TV codes that work are large: at least 15–20% of screen width for couch distances',
      'Moiré interference between camera sensor and screen pixels punishes fine modules — larger modules resist it',
      'Keep clear of broadcast safe-margin edges, channel bugs, and tickers',
    ],
    title: 'QR Code Size for TV Screens: Couch-Distance Guide',
    metaDescription:
      'TV QR codes: 200mm+ on screen for 3m couch viewing. Static hold timing, moire resistance, safe-margin placement, and glare tips.',
    content: `
### TV Screens: The Couch-Distance Scan

QR codes on TV — in ads, broadcasts, retail displays, and hotel welcome screens — are scanned from 2 to 4 meters by viewers on couches. The screen is emissive, which helps contrast enormously compared to print, but camera sensors interact with screens in tricky ways: moiré interference, refresh-rate banding on some displays, and glare from room windows. And the viewer gets one comfortable attempt before giving up and going back to the show.

### The 10:1 Rule of Thumb

At 3 m the rule suggests 300 mm on screen. On a 55-inch TV (about 1.2 m wide), that's a quarter of the screen width — large, but TV codes that actually get scanned are large. As practical guidance, the code should be at least 15–20% of the screen's width for living-room distances. Timid corner codes are the classic TV failure: visible to the designer, invisible from the couch.

### Recommended Size

Display at a minimum of 200 mm (about 8 inches) across on the screen for living-room distances; 300 mm for retail displays and lobbies viewed from farther away. Bigger is always safer on TV — the screen is huge, the viewer is far, and there is no print cost to going larger. For broadcast, verify the code survives the station's encoding chain; heavy compression softens module edges.

### Substrate and Printing (Digital)

The screen is the substrate. Brightness and contrast settings vary wildly between TV models and user settings, so design for the worst case: full-bright white background, pure black modules, no transparency tricks, no brand-color experiments. What looks elegant in the edit suite must survive a five-year-old TV in eco mode in a bright living room.

### Placement and Practical Tips

- Hold the code static for at least 5 seconds — viewers need time to notice it, unlock their phone, open the camera, and aim. Two-second flashes during fast-cut ads are unscannable theater.
- Keep the code clear of broadcast safe-margin edges, channel bugs, news tickers, and subtitles — any of which can crop or overlap it.
- Beware moiré: the camera sensor's grid interfering with the screen's pixel grid creates shimmer on fine modules. Larger modules resist it; dense codes shimmer into failure.
- Center the code rather than pushing it to a corner — extreme side viewing angles distort it, and corners collect on-screen graphics.
- For retail displays, check glare at different times of day; a code that scans at 9am can wash out at 3pm when the sun swings around.

### Common Mistakes

- Flashing the code for two seconds during a fast-cut ad — nobody scans in time, and the media spend is wasted.
- Small "elegant" corner codes that are invisible beyond the couch.
- Screen glare from windows washing out the code at certain times of day on retail displays.
- Linking to a page that isn't ready for a traffic spike — TV scans arrive all at once.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on a TV screen?',
        answer:
          'At least 15–20% of the screen width for couch viewing at 2–4 meters — 200mm across minimum on a 55-inch TV, 300mm for retail displays viewed from farther. Bigger is always safer on TV since there is no print cost to size.',
      },
      {
        question: 'How long should a TV QR code stay on screen?',
        answer:
          'At least 5 seconds, completely static. Viewers need time to notice the code, unlock their phone, open the camera, and aim. Anything under 3 seconds — common in fast-cut ads — is effectively unscannable.',
      },
      {
        question: 'What is moire interference on TV QR codes?',
        answer:
          'It is the shimmering pattern created when the camera sensor\u2019s pixel grid interferes with the screen\u2019s pixel grid. It attacks fine modules first, which is why dense, small TV codes fail while large, simple ones scan fine. Larger modules are the fix.',
      },
      {
        question: 'Do TV QR codes work in bright rooms?',
        answer:
          'Emissive screens hold contrast well, but direct window glare on the screen can still wash out a code. For retail and lobby displays, check the screen at different times of day and consider placement away from direct sun paths.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'projector-screens',
    useCase: 'Projector Screen',
    primaryKeyword: 'qr code size projector screen',
    canonicalCalcParams: {
      distanceCm: 800,
      substrateType: 'fabric',
      lightingCondition: 'dim',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 300,
    recommendedSizeIn: 11.81,
    substrateMaterial: 'Matte white projection screen (smooth)',
    printingMethod: 'Digital projection — focused, keystone-corrected, full brightness',
    specificWarnings: [
      'Focus the projector on the code slide specifically — edge softness kills outer modules first',
      'Fix keystone with physical placement, not digital correction (which resamples and softens)',
      'Ambient light washout is the number-one projector-code killer — dim house lights over the screen',
      'Wavy pull-down screens turn straight modules into curves — use tensioned or fixed screens',
    ],
    title: 'QR Code Size for Projector Screens: Big-Room Guide',
    metaDescription:
      'Projector QR codes: 300mm+ for 8m rooms. Focus and keystone tips, ambient washout fixes, matte screen advice, and back-row testing.',
    content: `
### Projector Screens: The Big-Room Scan

Projector QR codes — in conference keynotes, classrooms, training rooms, and houses of worship — are scanned from 5 to 15 meters. Everything that makes slides hard (distance, angles, ambient light) is amplified, and the projection itself adds distortion, softness, and washout. A projector code must survive the weakest link in a long chain: the projector's focus, the room's lighting, the screen's condition, and the audience's phones.

### The 10:1 Rule of Thumb

At 8 m the rule suggests 800 mm on the projected image. On a 3 m-wide projection that's more than a quarter of the image — dramatic, but honest about the physics. As practical guidance, the code should span at least 10–15% of the projected image width, and the projector must actually be in focus. An out-of-focus 800 mm code scans worse than a sharp 400 mm one; focus is part of sizing.

### Recommended Size

Project at a minimum of 300 mm (about 12 inches) across on the screen for mid-size rooms; scale with room depth — a 15 m hall needs 500 mm or more. When in doubt, make the code the largest element on the slide. For very large venues, consider displaying the code full-screen during Q&A rather than as a slide element.

### Substrate and Printing (Digital)

Matte white projection screens are ideal; painted walls, wavy pull-down screens, and gray ambient-light-rejecting screens all degrade the code. Screen texture becomes visible to cameras at large projected sizes — smooth and matte wins. If the venue's screen is a wrinkled pull-down veteran, the code inherits every wave as module distortion.

### Placement and Practical Tips

- Focus the projector on the code slide specifically — edge softness kills outer modules first, and projectors are often focused for center text.
- Kill keystone distortion with physical projector placement, not digital correction, which resamples the image and softens every module edge.
- Dim the house lights over the screen. Ambient washout is the number-one projector-code killer, and it's fixed with a light switch, not a bigger code.
- Leave the code up during Q&A, not just for a moment mid-talk — the back row needs a relaxed window.
- Test from the back row with a mid-range phone during the actual pre-event lighting state.

### Common Mistakes

- A slightly defocused projector — text looks acceptable, but the code's fine modules blur into each other.
- Wavy pull-down screens turning straight modules into curves across the code.
- Daylight from tall windows washing out one side of the image while the other side scans fine.
- Digital keystone correction silently softening the image the AV tech "fixed" five minutes before doors.
    `,
    faqs: [
      {
        question: 'How big should a QR code be on a projector screen?',
        answer:
          'At least 10–15% of the projected image width — 300mm across minimum for mid-size rooms, 500mm+ for large halls. Focus matters as much as size: a sharp 400mm code beats a soft 800mm one every time.',
      },
      {
        question: 'Why do projector QR codes fail when text looks fine?',
        answer:
          'Text tolerates softness; QR modules do not. Slight defocus, digital keystone correction, or a wavy screen blurs module edges below what cameras can binarize, while letters remain readable. Focus the projector on the code slide itself.',
      },
      {
        question: 'Does room lighting affect projector QR codes?',
        answer:
          'Enormously. Ambient light washing over the screen collapses projected contrast — the number-one killer of projector codes. Dim the house lights over the screen and run the projector at full brightness, not eco-mode.',
      },
      {
        question: 'Matte white or gray projector screen for QR codes?',
        answer:
          'Matte white, smooth and tensioned. Gray ambient-light-rejecting screens reduce peak brightness (hurting code contrast), and textured or wavy screens distort modules. The screen is the substrate — treat its quality as part of the code spec.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
  {
    slug: 'floor-graphics',
    useCase: 'Floor Graphic',
    primaryKeyword: 'qr code size floor graphic',
    canonicalCalcParams: {
      distanceCm: 150,
      substrateType: 'plastic',
      lightingCondition: 'normal',
      payloadDensity: 'low',
    },
    recommendedSizeMm: 150,
    recommendedSizeIn: 5.91,
    substrateMaterial: 'Adhesive vinyl with textured anti-slip overlaminate',
    printingMethod: 'UV printing + anti-slip overlaminate (never skip the laminate)',
    specificWarnings: [
      'Steep downward viewing angles foreshorten the code — treat 150mm as the minimum, prefer 200mm',
      'Anti-slip laminate texture plus dirt is a contrast tax — white background with black modules survives best',
      'Place where foot traffic pauses (queues, entrances) — nobody scans mid-stride',
      'Keep clear of heavy pivot zones (door swings, till queues) where scuffing concentrates',
    ],
    title: 'QR Code Size for Floor Graphics: 150mm Wayfinding Guide',
    metaDescription:
      'Floor graphic QR codes: 150mm minimum for angled 1.5m scans. Anti-slip laminate contrast tips, pause-point placement, and scuff-zone warnings.',
    content: `
### Floor Graphics: The Looking-Down Scan

Floor graphics in retail aisles, exhibitions, museums, and wayfinding are scanned from 1 to 2 meters — but at a steep downward angle, which foreshortens the code vertically. A code that looks perfectly square on the floor looks like a flattened rectangle to the camera, and the decoder must work harder to normalize it. Add foot traffic, dirt, scuffing, and textured anti-slip laminate, and floor codes face a harsher life than almost any other placement.

### The 10:1 Rule of Thumb, Adjusted for Angle

At 1.5 m the rule suggests 150 mm; because of the viewing angle, treat this as the minimum rather than the target, and prefer 150–200 mm as the working range. Some installers pre-distort (anamorphic) floor codes — stretching them vertically so they appear square from standing height — which is worth discussing with the print vendor for critical placements like wayfinding.

### Recommended Size

Print at 150 × 150 mm (about 6 inches) minimum; 200 mm where foot traffic naturally pauses (queue lines, exhibit entrances, decision points). On vast exhibition floors where viewers stand farther back, scale up — the floor is enormous, and a 300 mm code still looks modest.

### Substrate and Printing

Floor graphics print on adhesive vinyl with a textured anti-slip overlaminate — a safety requirement in public spaces, not an option. The laminate's texture scatters light and slightly reduces contrast, so size up to compensate; never skip the laminate to "improve" scanning, because the slip liability dwarfs any scan-rate concern. UV printing gives the abrasion resistance floor graphics need.

### Placement and Practical Tips

- Place codes where people naturally stop — queue lines, entrances, exhibit thresholds, decision points — not mid-stride where nobody will halt to scan.
- Keep the code away from heavy pivot zones (door swings, till queues, turning circles) where scuffing concentrates and destroys the laminate first.
- The anti-slip texture plus tracked-in dirt is a contrast tax; white-background codes with black modules survive it best. Avoid reversed (white on dark) floor codes.
- Lighting matters: codes under shelving shadows or in dim corners fail; favor well-lit pause points where the camera gets clean light.
- In retail, coordinate with cleaning crews — aggressive scrubbing and harsh chemicals age floor graphics fast.

### Common Mistakes

- Small codes on the floor that read as decoration from standing height and never get scanned.
- High-gloss laminate instead of textured anti-slip — a slip hazard and a glare source in one.
- Placing the code where shopping carts, feet, and pallet jacks grind it away within days.
- Anamorphic distortion done backwards, so the code looks correct on the floor and wrong to the camera.
    `,
    faqs: [
      {
        question: 'What size should a QR code be on a floor graphic?',
        answer:
          '150mm square minimum for 1–2m standing scans, 200mm where foot traffic pauses. The steep downward viewing angle foreshortens the code, so treat the 10:1 rule result as the floor rather than the target.',
      },
      {
        question: 'Does anti-slip laminate affect QR code scanning?',
        answer:
          'Slightly — the texture scatters light and, combined with dirt, costs some contrast. Compensate with larger size and strict black-on-white contrast. Never skip the laminate to improve scanning; the slip-safety requirement outweighs any scan-rate gain.',
      },
      {
        question: 'Where should floor QR codes be placed?',
        answer:
          'Where people naturally pause: queue lines, entrances, exhibit thresholds, and decision points. Avoid mid-stride locations, heavy pivot zones like door swings and till queues, and shadowed areas under shelving.',
      },
      {
        question: 'What is anamorphic distortion for floor QR codes?',
        answer:
          'Pre-stretching the code vertically during artwork so it appears correctly proportioned when viewed at the steep angle of a standing person. It helps for critical placements like wayfinding — discuss it with the print vendor rather than attempting it blindly.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    author: 'Codexengr, QR Systems Engineer',
    batchNumber: 5,
  },
];

export function getSizeGuideBySlug(slug: string): SizeGuide | undefined {
  return SIZE_GUIDES.find((g) => g.slug === slug);
}

export function getAllSizeGuides(): SizeGuide[] {
  return SIZE_GUIDES;
}

export function getApprovedSizeGuides(): SizeGuide[] {
  return SIZE_GUIDES.filter((g) => g.status === 'approved');
}
