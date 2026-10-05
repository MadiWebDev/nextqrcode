export interface LabelSheet {
  slug: string;
  brand: string;
  productCode: string;
  name: string;
  paperSize: 'letter' | 'a4';
  labelsPerSheet: number;
  columns: number;
  rows: number;
  widthMm: number;
  heightMm: number;
  marginTopMm: number;
  marginLeftMm: number;
  gapHorizontalMm: number;
  gapVerticalMm: number;
  recommendedMinModuleMm: number;
  optimalPayloadLength: number;
  compatiblePrinters: string;
  useCases: string[];
  feedAlignmentTip: string;
  commonPitfalls: string;
  title: string;
  metaDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

export const LABEL_SHEETS: LabelSheet[] = [
  {
    slug: 'avery-5160',
    brand: 'Avery',
    productCode: '5160',
    name: 'Avery 5160 Address Labels (30 per Sheet)',
    paperSize: 'letter',
    labelsPerSheet: 30,
    columns: 3,
    rows: 10,
    widthMm: 66.67,
    heightMm: 25.4,
    marginTopMm: 12.7,
    marginLeftMm: 4.76,
    gapHorizontalMm: 3.17,
    gapVerticalMm: 0,
    recommendedMinModuleMm: 0.45,
    optimalPayloadLength: 80,
    compatiblePrinters: 'Laser & Inkjet',
    useCases: [
      'Return mailing addresses with website QR code',
      'Warehouse bin labeling and SKU inventory tags',
      'Event badge name stickers with vCard link',
      'Classroom folder and library book checkout tags'
    ],
    feedAlignmentTip: 'Set printer paper tray guides snugly against the sheet. Ensure "Fit to Page" is disabled in Chrome/Edge and scaling is locked at exactly 100%.',
    commonPitfalls: 'Avery 5160 has zero vertical margin between rows. If your printer has slight mechanical roller slip, bottom rows can overlap. Keep label text 2mm away from top/bottom edges.',
    title: 'Print QR Codes on Avery 5160 Labels (30 per Sheet Template)',
    metaDescription: 'Free online tool to format and print QR codes directly onto Avery 5160 label sheets. Perfect 1" x 2-5/8" calibration, sequential numbers, and zero drift.',
    content: `
Avery 5160 (also sold as Avery 8160 for inkjet) is the standard 30-up address label format across North America. Each sheet measures 8.5 x 11 inches (US Letter) and contains 30 rectangular stickers arranged in 3 columns of 10 rows. Each individual label measures 1 x 2-5/8 inches (25.4 x 66.67 mm).

When printing QR codes on Avery 5160 stock, the primary geometric advantage is the wide 2.625-inch horizontal width. This provides ample physical space to place a 20 x 20 mm QR code on the left side of the sticker while reserving the remaining 40 mm on the right for two to three lines of human-readable text, such as an asset ID, employee name, or instruction caption.

Because the individual sticker height is strictly 25.4 mm, your maximum QR code symbol size should not exceed 20 mm to preserve the mandatory 4-module quiet zone margin. For maximum scan reliability across handheld smartphones, keep your payload concise (under 75 characters) so the QR matrix remains at Version 3 or lower.
    `,
    faqs: [
      { question: 'What are the exact margins for Avery 5160 in millimeters?', answer: 'Top margin: 12.7 mm (0.5 in). Left margin: 4.76 mm (0.1875 in). Label width: 66.67 mm (2.625 in). Label height: 25.4 mm (1.0 in). Horizontal gap: 3.17 mm (0.125 in). Vertical gap: 0 mm.' },
      { question: 'Will Avery 8160 work with this template?', answer: 'Yes. Avery 8160 is the inkjet-specific equivalent of Avery 5160; both share identical physical grid dimensions and label counts.' },
      { question: 'Why are the bottom rows printing slightly off-center on my printer?', answer: 'This is caused by auto-scaling in your PDF viewer. Set print scale to "Actual Size" or 100% and choose paper size "US Letter".' }
    ]
  },
  {
    slug: 'avery-5163',
    brand: 'Avery',
    productCode: '5163',
    name: 'Avery 5163 Shipping Labels (10 per Sheet)',
    paperSize: 'letter',
    labelsPerSheet: 10,
    columns: 2,
    rows: 5,
    widthMm: 101.6,
    heightMm: 50.8,
    marginTopMm: 12.7,
    marginLeftMm: 4.76,
    gapHorizontalMm: 3.55,
    gapVerticalMm: 0,
    recommendedMinModuleMm: 0.65,
    optimalPayloadLength: 200,
    compatiblePrinters: 'Laser & Inkjet',
    useCases: [
      'Shipping box identification with carrier tracking QR',
      'Pallet carton logistics and inventory storage placards',
      'Conference badge inserts with attendee profile and schedule',
      'Equipment warning labels and maintenance instructions'
    ],
    feedAlignmentTip: 'Use manual bypass feed tray on commercial laser printers to prevent thick sticker stock from curling through the fuser rollers.',
    commonPitfalls: 'Because labels are large (2x4 inches), users often place low-resolution 72 DPI images. Ensure vector SVG or 300+ DPI graphics are used.',
    title: 'Print QR Codes on Avery 5163 Labels (10 per Sheet 2" x 4")',
    metaDescription: 'Format and print high-resolution QR codes on Avery 5163 shipping labels. 2x4 inch layout, ideal for warehouse logistics, cartons, and product packaging.',
    content: `
Avery 5163 is a 10-up multipurpose shipping label format on US Letter paper. Arranged in 2 columns and 5 rows, each generous label measures 2 x 4 inches (50.8 x 101.6 mm).

This 2x4 inch format is the preferred standard for logistics, shipping boxes, and equipment asset tagging. The substantial 50.8 mm height allows you to print a large 35 x 35 mm QR code that can be scanned from up to 1.5 meters away by warehouse forklift operators and delivery personnel.

With 10 labels per sheet, you have sufficient surface area to support dense payloads such as full vCard 3.0 contact cards, cryptographic asset serials, or multi-parameter UTM tracking links without sacrificing camera focus speed.
    `,
    faqs: [
      { question: 'What is the printable area on Avery 5163?', answer: 'Each label is 50.8 x 101.6 mm (2 x 4 inches). We recommend keeping artwork inside a 46 x 96 mm safe zone to account for mechanical paper shift.' },
      { question: 'Can I print sequential barcode asset tags on Avery 5163?', answer: 'Yes. Our template supports both identical bulk URLs and incremental serial numbers (e.g. ASSET-0001 through ASSET-0010).' }
    ]
  },
  {
    slug: 'avery-l7160',
    brand: 'Avery',
    productCode: 'L7160',
    name: 'Avery L7160 Address Labels (21 per A4 Sheet)',
    paperSize: 'a4',
    labelsPerSheet: 21,
    columns: 3,
    rows: 7,
    widthMm: 63.5,
    heightMm: 38.1,
    marginTopMm: 15.1,
    marginLeftMm: 7.2,
    gapHorizontalMm: 2.5,
    gapVerticalMm: 0,
    recommendedMinModuleMm: 0.5,
    optimalPayloadLength: 120,
    compatiblePrinters: 'Laser & Inkjet',
    useCases: [
      'European mailing envelopes and parcel returns',
      'Retail shelf-edge price talkers with product info QR',
      'Food packaging ingredient & allergen disclosures',
      'Office document folder archiving'
    ],
    feedAlignmentTip: 'Select A4 paper size explicitly in the print dialogue. Do not allow your driver to convert A4 to US Letter, or rows will gradually drift downward.',
    commonPitfalls: 'Using US Letter software presets on European A4 stock causes severe vertical misalignment because A4 is 18mm longer than Letter.',
    title: 'Print QR Codes on Avery L7160 A4 Labels (21 per Sheet)',
    metaDescription: 'Free template to print QR codes on European Avery L7160 A4 label sheets (63.5 x 38.1mm). 21 labels per sheet with calibrated zero-drift margins.',
    content: `
Avery L7160 is Europe's most ubiquitous address and parcel label format. Designed specifically for standard ISO A4 paper (210 x 297 mm), each sheet features 21 die-cut labels configured in 3 columns of 7 rows. Each label measures 63.5 x 38.1 mm.

The 38.1 mm vertical height provides substantially more breathing room than North American 1-inch labels. This allows you to comfortably position a 25 x 25 mm QR code on the left, leaving the right column for three lines of bold shipping or product description text with full ISO 4-module quiet zones intact.
    `,
    faqs: [
      { question: 'What is the difference between Avery 5160 and L7160?', answer: 'Avery 5160 is designed for US Letter paper (30 labels, 25.4mm high). Avery L7160 is designed for European A4 paper (21 labels, 38.1mm high).' },
      { question: 'Can I print on Avery L7160 using standard desktop printers?', answer: 'Yes. L7160 is manufactured with QuickPEEL technology and is compatible with all standard monochrome and color laser and inkjet desktop printers.' }
    ]
  },
  {
    slug: 'herma-4682',
    brand: 'Herma',
    productCode: '4682',
    name: 'Herma 4682 Universal A4 Labels (24 per Sheet)',
    paperSize: 'a4',
    labelsPerSheet: 24,
    columns: 3,
    rows: 8,
    widthMm: 70.0,
    heightMm: 36.0,
    marginTopMm: 4.5,
    marginLeftMm: 0,
    gapHorizontalMm: 0,
    gapVerticalMm: 0,
    recommendedMinModuleMm: 0.5,
    optimalPayloadLength: 100,
    compatiblePrinters: 'Laser, Copy & Inkjet',
    useCases: [
      'German and EU manufacturing inventory tags',
      'Pharmaceutical sample labeling',
      'Direct mailer promotional coupons',
      'Storage bin barcode tracking'
    ],
    feedAlignmentTip: 'Herma sheets feature an all-round protective edge. Feed narrow-edge first into the multi-purpose tray.',
    commonPitfalls: 'Herma 4682 has zero horizontal gap between labels. Keep printed designs slightly inset from the sticker edge to avoid color bleeding onto adjacent labels.',
    title: 'Print QR Codes on Herma 4682 Labels (70 x 36 mm A4)',
    metaDescription: 'Accurate print template for Herma 4682 universal labels on A4. 24 labels per sheet (70x36mm). Generate batch QR codes with zero alignment drift.',
    content: `
Herma 4682 is a heavy-duty German-engineered universal label format on A4 paper. It provides 24 rectangular labels per sheet arranged in 3 columns of 8 rows, with each sticker measuring 70 x 36 mm.

With zero border margins between individual stickers (butt-cut layout), Herma 4682 maximizes usable surface area. A 24 x 24 mm QR code fits cleanly on the left margin, leaving an expansive 42 x 32 mm area on the right for batch numbers, GS1 barcode data, or bilingual product instructions.
    `,
    faqs: [
      { question: 'What paper size does Herma 4682 require?', answer: 'Standard ISO 216 A4 (210 x 297 mm).' },
      { question: 'Are Herma 4682 labels waterproof?', answer: 'Standard 4682 labels are made of bright white chlorine-free bleached paper. For outdoor waterproof applications, use Herma weatherproof polyester film labels.' }
    ]
  },
  {
    slug: 'avery-pre0200',
    brand: 'Avery',
    productCode: 'PRE0200',
    name: 'Avery 2" Round Circle Stickers (12 per Sheet)',
    paperSize: 'letter',
    labelsPerSheet: 12,
    columns: 3,
    rows: 4,
    widthMm: 50.8,
    heightMm: 50.8,
    marginTopMm: 17.5,
    marginLeftMm: 17.5,
    gapHorizontalMm: 12.7,
    gapVerticalMm: 12.7,
    recommendedMinModuleMm: 0.55,
    optimalPayloadLength: 100,
    compatiblePrinters: 'Laser & Inkjet',
    useCases: [
      'Artisan candle and jam jar lids with ingredient QR',
      'Coffee cup promotional stickers and loyalty scans',
      'Event souvenir stickers and laptop swag',
      'Retail garment hang-tag sealers'
    ],
    feedAlignmentTip: 'Circular labels require centered optical alignment. In our tool, toggle the "Circular Mask Preview" to verify that corner modules do not clip outside the round die-cut boundary.',
    commonPitfalls: 'Placing a large square QR code on a circular sticker can cause the 4 corner finder patterns to clip against the circular cut line. Keep total QR code width below 32 mm.',
    title: 'Print QR Codes on Avery 2" Round Stickers (12 per Sheet)',
    metaDescription: 'Free template for printing QR codes on 2-inch circular labels (Avery 22807 / PRE0200). 12 round stickers per US Letter sheet with centered alignment.',
    content: `
Avery 2-inch round circle labels (compatible with Avery 22807, 22817, and PRE0200) contain 12 circular stickers per US Letter sheet, formatted in 3 columns of 4 rows.

Circular labels present a unique optical geometry challenge: a square QR code inside a circle leaves four crescent-shaped peripheral zones. To prevent the corner finder patterns from clipping the die-cut circle, the maximum recommended square QR code size on a 2-inch (50.8 mm) circle is 32 x 32 mm ($50.8 \times \cos(45^\circ) \approx 35.9\text{ mm}$ minus safe margin).

This 2-inch circular format is the premier choice for cosmetic jars, coffee cups, craft beer bottle caps, and takeaway food packaging seals.
    `,
    faqs: [
      { question: 'What is the maximum square QR code size for a 2-inch circle sticker?', answer: 'The maximum safe square size is 32 x 32 mm (1.25 x 1.25 inches). Anything larger risks having its corner finder patterns cut off during die-cut manufacturing variations.' },
      { question: 'Can I add circular text around the QR code?', answer: 'Yes. The circular margin around the 32mm square QR code provides ideal space for curved header text like "SCAN FOR MENU" or "HANDMADE WITH LOVE".' }
    ]
  }
];

export function getLabelSheetBySlug(slug: string): LabelSheet | undefined {
  return LABEL_SHEETS.find((s) => s.slug === slug);
}

export function getAllLabelSheets(): LabelSheet[] {
  return LABEL_SHEETS;
}
