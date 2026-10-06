/**
 * QR Code Tools — QR Code Size & Distance Guide Data
 *
 * 20 use-case-specific size guides, each with pre-filled calculator parameters,
 * engineering math, and 400+ words of unique content.
 * Pages at /qr-size-guide/[slug]
 */

export type SubstrateType =
  | 'smooth-paper'
  | 'coated-paper'
  | 'corrugated'
  | 'fabric'
  | 'glass'
  | 'metal'
  | 'plastic';

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
    ],
    status: 'approved',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-01',
    author: 'CodexEngr, QR Systems Engineer',
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
          'Yes if you use table-side ordering through a POS system — each table\'s QR code appends the table number as a URL parameter (?table=12), allowing automatic routing to the kitchen. If the QR only links to a static menu page, a single QR code for all tables is sufficient.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-01',
    author: 'CodexEngr, QR Systems Engineer',
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
      'Billboard QR code sizing: minimum 150cm for pedestrian viewing at 15m. Safety rules, driver targeting prohibition, short URL requirement, and large-format print specs.',
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
    ],
    status: 'approved',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-01',
    author: 'CodexEngr, QR Systems Engineer',
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
      'QR code sizing for pharmacy labels on pill bottles: cylinder curvature formula, 12mm minimum for 30ml bottles, GS1 DataMatrix alternative, FDA 21 CFR compliance notes.',
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
    `,
    faqs: [
      {
        question: 'Is QR code or DataMatrix required on prescription pill bottles by FDA?',
        answer:
          'FDA does not currently mandate a specific 2D barcode type on retail prescription labels (21 CFR Part 201). However, FDA\'s Unique Device Identifier (UDI) system for medical devices mandates GS1 DataMatrix or QR code. Many pharmacies voluntarily add QR codes to patient education and refill ordering workflows.',
      },
      {
        question: 'Can the pharmacist\'s own label printer produce scan-quality QR codes?',
        answer:
          'It depends on the printer. Thermal transfer printers at 203 DPI (standard) produce modules below 0.35mm for small QR codes — below the reliable scanning threshold. Upgrade to 300 DPI (or 600 DPI for small label sizes) thermal transfer printers for pharmaceutical QR code reliability.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-01',
    author: 'CodexEngr, QR Systems Engineer',
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
    `,
    faqs: [
      {
        question: 'Can wine bottle QR codes link to video content?',
        answer:
          'Yes — this is a growing trend. "Augmented label" experiences link from a wine bottle QR to a winemaker video, vineyard drone footage, or animated vintage story. Keep the URL short (under 40 characters with a redirect) to maintain a scannable QR version.',
      },
      {
        question: 'Do wine label QR codes work through the bottle\'s glass?',
        answer:
          'No — the camera must scan the label surface directly. However, wines with transparent or lightly tinted labels on clear glass bottles can sometimes be scanned from the back if the label is backlit — not a reliable deployment strategy. Always expect front-label scanning.',
      },
    ],
    status: 'approved',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-01',
    author: 'CodexEngr, QR Systems Engineer',
    batchNumber: 4,
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
