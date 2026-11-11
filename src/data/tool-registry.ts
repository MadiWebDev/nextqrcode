/**
 * Tool registry — single source of truth for every tool / generator route.
 *
 * Powers the /tools hub page and the RelatedTools internal-linking block.
 * Every `slug` here is a real route under `src/app/`; keep this list in sync
 * when a tool is added or removed. Blurbs are one factual sentence describing
 * what the tool actually does — no marketing claims.
 */

export type ToolCategory =
  | 'Generators'
  | 'Bulk & Print'
  | 'Safety & Testing'
  | 'Sizing & Placement'
  | 'Payments'
  | 'Specialty';

export interface ToolEntry {
  /** Site-relative route, e.g. "/qr-scanner". */
  slug: string;
  name: string;
  /** One factual sentence about what the tool does. */
  blurb: string;
  category: ToolCategory;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Generators',
  'Bulk & Print',
  'Safety & Testing',
  'Sizing & Placement',
  'Payments',
  'Specialty',
];

export const TOOL_REGISTRY: ToolEntry[] = [
  // ── Generators ────────────────────────────────────────────────────────────
  {
    slug: '/url-qr-code-generator',
    name: 'URL QR Code Generator',
    blurb: 'Turn any web address into a downloadable QR code you can print or share.',
    category: 'Generators',
  },
  {
    slug: '/wifi-qr-code-generator',
    name: 'WiFi QR Code Generator',
    blurb: 'Encode a network name and password so guests join WiFi by scanning instead of typing.',
    category: 'Generators',
  },
  {
    slug: '/vcard-qr-code-generator',
    name: 'vCard QR Code Generator',
    blurb:
      'Create a QR code that saves your name, phone, email and address straight to a phone address book.',
    category: 'Generators',
  },
  {
    slug: '/whatsapp-qr-code-generator',
    name: 'WhatsApp QR Code Generator',
    blurb:
      'Build a QR code that opens a WhatsApp chat with your number and an optional pre-filled message.',
    category: 'Generators',
  },
  {
    slug: '/upi-qr-code-generator',
    name: 'UPI QR Code Generator',
    blurb: 'Generate a UPI payment QR code from a payee address using the standard intent format.',
    category: 'Generators',
  },
  {
    slug: '/bitcoin-qr-code-generator',
    name: 'Bitcoin QR Code Generator',
    blurb: 'Create a BIP21 payment QR code from a Bitcoin wallet address with an optional amount.',
    category: 'Generators',
  },
  {
    slug: '/barcode-generator',
    name: 'Barcode Generator',
    blurb:
      'Generate standard one-dimensional barcodes alongside QR codes for labels and packaging.',
    category: 'Generators',
  },

  // ── Bulk & Print ──────────────────────────────────────────────────────────
  {
    slug: '/bulk-generator',
    name: 'Bulk QR Code Generator',
    blurb:
      'Generate up to 500 QR codes at once from a pasted list or CSV and download them as a single ZIP file.',
    category: 'Bulk & Print',
  },
  {
    slug: '/bulk-vcard-qr',
    name: 'Bulk vCard QR',
    blurb:
      'Create contact QR codes for a whole list of people in one batch instead of one at a time.',
    category: 'Bulk & Print',
  },
  {
    slug: '/bulk-vcard-generator',
    name: 'Bulk vCard Generator',
    blurb:
      'Turn a list of contacts into individual vCard QR codes ready for badges and business cards.',
    category: 'Bulk & Print',
  },
  {
    slug: '/qr-sticker-sheet-printer',
    name: 'QR Sticker Sheet Printer',
    blurb:
      'Lay out QR codes on printable sticker sheets with grid sizes matched to common label stock.',
    category: 'Bulk & Print',
  },
  {
    slug: '/qr-labels',
    name: 'QR Label Sheets',
    blurb:
      'Browse ready-made QR label sheet layouts for asset tags, inventory and product labelling.',
    category: 'Bulk & Print',
  },

  // ── Safety & Testing ──────────────────────────────────────────────────────
  {
    slug: '/qr-scanner',
    name: 'QR Code Scanner',
    blurb:
      'Scan QR codes with your camera or an uploaded image and check URL destinations for safety warnings before opening them.',
    category: 'Safety & Testing',
  },
  {
    slug: '/qr-safety-checker',
    name: 'QR Safety Checker',
    blurb:
      'Inspect a QR code destination for phishing signals such as shorteners and lookalike domains before you visit it.',
    category: 'Safety & Testing',
  },
  {
    slug: '/printed-qr-tester',
    name: 'Printed QR Tester',
    blurb:
      'Check a printed QR code photo for contrast, quiet-zone and damage problems that stop phones from scanning it.',
    category: 'Safety & Testing',
  },
  {
    slug: '/qr-splitter-scanner',
    name: 'QR Splitter & Scanner',
    blurb:
      'Split long content across multiple QR codes and scan multi-part codes back into the original payload.',
    category: 'Safety & Testing',
  },

  // ── Sizing & Placement ────────────────────────────────────────────────────
  {
    slug: '/qr-size-calculator',
    name: 'QR Size Calculator',
    blurb:
      'Calculate the minimum print size for a QR code from its scanning distance and data density.',
    category: 'Sizing & Placement',
  },
  {
    slug: '/error-correction-simulator',
    name: 'Error Correction Simulator',
    blurb:
      'Simulate damage on a QR code to see how much each error-correction level can recover before scanning fails.',
    category: 'Sizing & Placement',
  },
  {
    slug: '/qr-placement-guide',
    name: 'QR Placement Guide',
    blurb:
      'Work out where to place QR codes — height, lighting and viewing angle — so people can actually scan them.',
    category: 'Sizing & Placement',
  },

  // ── Payments ──────────────────────────────────────────────────────────────
  {
    slug: '/payment-qr',
    name: 'Payment QR Schemes',
    blurb:
      'Browse country payment QR schemes and build codes that follow each scheme’s official format.',
    category: 'Payments',
  },
  {
    slug: '/pakistan-payment-qr',
    name: 'Pakistan Payment QR',
    blurb: 'Create payment QR codes for Pakistani schemes with the field format local apps expect.',
    category: 'Payments',
  },
  {
    slug: '/regional-payment-qr',
    name: 'Regional Payment QR',
    blurb:
      'Generate payment QR codes for regional schemes such as Pix, SGQR and SEPA EPC (GiroCode).',
    category: 'Payments',
  },

  // ── Specialty ─────────────────────────────────────────────────────────────
  {
    slug: '/medical-id-qr',
    name: 'Medical ID QR',
    blurb:
      'Create a QR code carrying emergency medical information that first responders can scan from a card or band.',
    category: 'Specialty',
  },
  {
    slug: '/pet-tag-qr',
    name: 'Pet Tag QR',
    blurb:
      'Make a QR code for a pet tag with your contact details so a finder can reach you without an app.',
    category: 'Specialty',
  },
  {
    slug: '/wifi-sign-generator',
    name: 'WiFi Sign Generator',
    blurb:
      'Design a printable sign that shows your WiFi network name, password and a join-by-scan QR code.',
    category: 'Specialty',
  },
  {
    slug: '/animated-qr-transfer',
    name: 'Animated QR Transfer',
    blurb:
      'Transfer a file between devices as a sequence of animated QR codes with no network or cables involved.',
    category: 'Specialty',
  },
  {
    slug: '/utm-builder',
    name: 'UTM Builder',
    blurb:
      'Add UTM campaign parameters to a URL so scans and clicks are attributed correctly in analytics.',
    category: 'Specialty',
  },
  {
    slug: '/whatsapp-qr',
    name: 'WhatsApp QR by Country',
    blurb:
      'Build WhatsApp QR codes with the correct calling code and number format for each country.',
    category: 'Specialty',
  },
];

export function getToolByPath(path: string): ToolEntry | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === path);
}

export function getToolsByCategory(category: ToolCategory): ToolEntry[] {
  return TOOL_REGISTRY.filter((t) => t.category === category);
}
