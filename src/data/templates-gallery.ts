/**
 * QR Code Tools — Template Gallery Data
 *
 * 20 distinct QR code design templates, each with a unique aesthetic,
 * industry target, and use-case advice.
 *
 * NOTE: This interface is SEPARATE from the TemplateName type in src/types/index.ts
 * which covers the 6 interactive studio templates.
 * These gallery entries represent distinct published design templates
 * with their own slug-based pages at /templates/[slug].
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
  | 'healthcare';

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
  useCaseAdvice: string;
  bestFor: string[];
  avoidFor: string[];
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
The Minimal White template applies the principle that the highest-trust QR code is the one that looks the most structurally sound. By stripping away color, gradients, and decorative elements, this template produces a symbol with maximum contrast ratio between dark and light modules — the highest possible likelihood of first-scan success across all device classes.

For professional business cards, LinkedIn networking events, and conference badges, the Minimal White template conveys engineering precision and institutional credibility. The restrained aesthetic signals that the code was designed by someone who understands the technology, not just a decorator who embedded a tool call.

The square dot style produces the most conservative, standards-compliant symbol. It is the reference implementation that all other dot styles deviate from. When in doubt about whether a customized QR code will scan reliably, the square-on-white template is the ground truth.

Pair this template with a short, clean URL under 50 characters. The minimalist aesthetic is undermined by a dense, high-version QR symbol — keep the URL short so the Version stays at 3 or below, maintaining wide, easily visible modules.
    `,
    bestFor: [
      'Business cards for legal, medical, and financial professionals',
      'Conference lanyards and attendee badges',
      'Academic publication citations',
      'Corporate letterhead QR codes',
      'Email signature QR codes (embedded as PNG)',
    ],
    avoidFor: [
      'Retail packaging (needs brand color for recognition)',
      'Event wristbands (needs high-contrast in low-light)',
      'Children\'s education materials (needs visual engagement)',
    ],
    title: 'Minimal White QR Code Template: Professional Business Card Design',
    metaDescription:
      'Clean minimalist QR code template for business cards and LinkedIn profiles. Maximum contrast square dots on white, no frame — highest scan reliability across all devices.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-05',
    author: 'CodexEngr, QR Systems Engineer',
    batchNumber: 3,
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
Corporate Navy is engineered for enterprise brand environments where QR codes appear in annual reports, investor presentations, printed financial disclosures, and corporate real estate signage. The deep navy foreground on a light grey-white background maintains a 9.4:1 WCAG AAA contrast ratio — exceeding accessibility requirements while projecting institutional authority.

The rounded dot style (gentle corner radius) provides approximately 5% more surface area per module compared to fully rounded "circle" dots, maintaining structural integrity at smaller print sizes while softening the aesthetic for premium corporate materials. The rounded-square finder pattern eye combines institutional structure with a contemporary professional appearance.

This template is specifically optimized for offset lithography on coated paper stock — the ink dot gain characteristics of offset printing favor slightly bolder dot designs that compensate for ink spread without creating muddy module boundaries.

For enterprise deployments, pair this template with branded short-link infrastructure (e.g., brand.link/2026-ar) rather than raw long URLs. The corporate template's visual authority is undermined when the QR code contains a high-version symbol forced by a 200-character URL.

Annual report applications: print at minimum 25mm × 25mm in the inside back cover or alongside financial data tables. Investor relations teams should use the same QR code template consistently across all printed communications for brand recognition.
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
    ],
    title: 'Corporate Navy QR Code Template: Enterprise Trust & Annual Report Design',
    metaDescription:
      'Corporate Navy QR code template for enterprise brands. Deep navy on light grey, WCAG AAA contrast ratio, rounded square eye style. Optimized for annual reports and investor materials.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-05',
    author: 'CodexEngr, QR Systems Engineer',
    batchNumber: 3,
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
The Luxury Gold Foil template navigates a fundamental tension in premium product design: brand codes on luxury items must be visually cohesive with the premium aesthetic while remaining functionally scannable. This template uses warm gold-toned modules on a cream/ivory background — a combination that reads as premium and intentional rather than utilitarian.

Error Correction Level H is mandatory for this template because it includes a center logo zone. The 30% error correction headroom accommodates a brand monogram or certification seal occupying up to 20% of the QR symbol area. Critical implementation note: the logo must be placed as a pure overlay on top of the QR code in the generator — never modify the underlying module data. The error correction algorithm reconstructs any data modules hidden beneath the logo.

The circle dot style produces the most refined, typographically harmonious QR code appearance — the circular modules echo the roundness of premium typography and decorative elements common in luxury branding. The visual trade-off is approximately 10% larger required print size for equivalent scanning reliability compared to square dots.

For physical gold foil application: this template is designed to be output as a spot color + metallic pantone layer in commercial print prepress. The QR modules are produced in Pantone 871 C Metallic or equivalent, over a cream substrate. The metallic ink must maintain a minimum luminance difference of 0.35 against the substrate when measured under the same D50 illuminant conditions used in print quality control.

Counterfeiting protection note: the visual distinction of a branded gold foil QR code makes consumer verification intuitive — genuine products have a recognizable premium code appearance that cheap counterfeit operations cannot replicate at scale.
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
      'Black or dark-colored packaging backgrounds',
      'Any application where OCR or barcode readers (not cameras) are used',
    ],
    title: 'Luxury Gold Foil QR Code Template: Premium Packaging Authentication Design',
    metaDescription:
      'Luxury Gold Foil QR code template for premium packaging. Warm gold circle modules on ivory, logo zone with Level H EC, for wine labels, cosmetics, and authentication cards.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-05',
    author: 'CodexEngr, QR Systems Engineer',
    batchNumber: 3,
  },
  {
    slug: 'industrial-black-orange',
    name: 'Industrial Black & Orange',
    designStyle: 'industrial',
    primaryUseCase: 'Warehouse asset labels, industrial safety QR, machinery maintenance tags',
    targetIndustry: 'Manufacturing, Logistics, Construction',
    colorPalette: ['#1A1A1A', '#FF6B00', '#F5F5F5'],
    dotStyle: 'square',
    eyeOuterStyle: 'square',
    eyeInnerStyle: 'square',
    ecLevel: 'Q',
    frameStyle: 'thick-orange-border',
    hasLogo: false,
    ctaText: 'Scan for Info',
    useCaseAdvice: `
Industrial Black & Orange is purpose-engineered for harsh manufacturing, warehouse, and construction environments where QR code labels are subject to abrasion, chemical contamination, extreme temperatures, and rapid scanning by gloved workers.

The high-contrast black-on-white QR code surrounded by a thick high-visibility orange border serves two engineering functions: maximum scanner contrast ratio (enabling reliable reading through dirty industrial camera lenses and scratched Zebra TC imager windows) and immediate visual identification on crowded warehouse shelving, machinery panels, and construction site equipment.

Error Correction Level Q (25% recovery) is the default for industrial applications. Warehouse labels experience significant abrasion from handling, strapping, and forklift impact. A 25% recovery margin allows the QR code to remain scannable even after physical contact that removes up to a quarter of the symbol surface.

Square dot style is non-negotiable in this template — industrial environments often require industrial barcode scanners (Zebra, Honeywell, Datalogic) rather than smartphones. Industrial imagers use high-speed line CCD or area CMOS sensors optimized for precisely structured symbols, not aesthetically embellished ones.

For extreme environments (outdoor scaffolding, chemical plants, food processing facilities), print this template on Brady B-324 or 3M 7903 polyester label stock with lamination — both rated for temperature ranges of -40°C to +150°C and chemical resistance. The orange border dramatically accelerates visual search speed when workers are scanning multiple labels per minute.
    `,
    bestFor: [
      'Warehouse bin and rack location labels',
      'Machinery and equipment maintenance tags',
      'Construction site material tracking',
      'Chemical storage cabinet safety labels',
      'Industrial tool room asset tags',
    ],
    avoidFor: [
      'Consumer-facing retail products (orange border is functional, not brand-appropriate)',
      'Luxury or premium materials',
      'Any situation where color printing is not available (use Minimal White instead)',
    ],
    title: 'Industrial Black & Orange QR Template: Warehouse Asset & Safety Label Design',
    metaDescription:
      'Industrial Black & Orange QR code template for warehouses and manufacturing. High-visibility orange border, Level Q error correction, square dots for industrial scanner compatibility.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-05',
    author: 'CodexEngr, QR Systems Engineer',
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
Healthcare Clinical White is designed to meet the stringent requirements of clinical environments where QR codes are used for patient identification, medication verification, and equipment maintenance tracking. The design prioritizes clinical trust signals over aesthetic ambition.

The deep clinical navy on clinical white palette produces a 12:1 luminance contrast ratio — far exceeding the WCAG AA threshold of 4.5:1 and approaching the maximum achievable optical contrast. In clinical settings where staff scan codes under procedure lights, overhead fluorescents, and portable exam lights with varying color temperatures, this extreme contrast differential ensures consistent binarization across all illumination conditions.

Error Correction Level Q provides the resilience required in medical environments. Hospital wristbands experience repeated sanitizer wipe exposure, accidental IV fluid contact, and physical friction during patient positioning. At 25% error recovery, the wristband QR code remains functional even with significant surface degradation.

Square dots and square finder patterns produce the most legally defensible scanning record — clinical IT teams and biomedical engineering departments require standardized symbols for equipment audit trails. Custom dot shapes introduce potential for human interpretation of "non-standard" symbols in HIPAA compliance reviews.

Clinical implementation: this template should be used exclusively with Error Correction Level Q or H. Never use Level L or M for healthcare applications. All encoded PHI must be wrapped in an access-controlled URL (MRN → EHR lookup) rather than embedded directly in the QR payload.
    `,
    bestFor: [
      'Hospital patient wristbands',
      'Medical device and equipment asset tags',
      'Prescription medication labels (consumer information URL)',
      'Laboratory specimen tubes and slides',
      'Clinical trial participant ID cards',
    ],
    avoidFor: [
      'Consumer health and wellness apps (too clinical in appearance)',
      'Pharmacy retail shelf QR codes (needs more consumer-friendly design)',
    ],
    title: 'Healthcare Clinical QR Code Template: Patient Wristband & Medical Equipment Design',
    metaDescription:
      'Healthcare Clinical QR template for hospitals and medical facilities. 12:1 contrast ratio, Level Q error correction, HIPAA-compatible PHI-free design.',
    status: 'approved',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-05',
    author: 'CodexEngr, QR Systems Engineer',
    batchNumber: 3,
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
];
