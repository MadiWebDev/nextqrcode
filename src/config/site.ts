/**
 * NextQRCode — central site configuration.
 *
 * Single source of truth for brand, canonical URL, feature flags, navigation
 * and ad slots. Every hardcoded site name / domain in the codebase should
 * resolve through here (see docs/DECISIONS.md D0.5).
 */

const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

export const siteConfig = {
  /** Product brand (established repo identity: "QR Studio by codexengr"). */
  name: 'QR Studio',
  /** Short name for PWA / headers. */
  shortName: 'QR Studio',
  tagline: 'Free QR Code Generator & Tools',
  description:
    'Create beautiful, custom QR codes for free. 40+ types, custom colors, logo upload. Download PNG, SVG, PDF instantly. No sign-up needed.',
  /** Canonical base URL. Override with NEXT_PUBLIC_SITE_URL in production. */
  url: envSiteUrl || 'https://freeqrcode.tools',
  locale: 'en',
  author: 'codexengr',
  contactEmail: process.env.CONTACT_EMAIL || 'hello@freeqrcode.tools',

  social: {
    twitter: 'https://x.com/qrstudio',
    github: 'https://github.com/MadiWebDev/nextqrcode',
  },

  /** Feature flags — flip without code changes. */
  flags: {
    /** Render AdSense slots (also requires NEXT_PUBLIC_ADSENSE_CLIENT + consent). */
    ads: true,
    /** User accounts (Auth.js). Off until Phase 3 ships. */
    accounts: false,
    /** Dynamic QR codes + /r/ short links. Off until Phase 3 ships. */
    dynamicQr: false,
    /** Scan analytics. Off until Phase 3 ships. */
    analytics: false,
    /** Locale-prefixed routes + hreflang. Off until Phase 8 ships. */
    i18n: false,
  },

  /** AdSense slot IDs (env-driven; empty = slot not rendered). */
  adsense: {
    client:
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    slotInContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || '',
    slotSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
  },

  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
} as const;

export type SiteConfig = typeof siteConfig;

/** Navigation used by the header mega-menu and footer link directory. */
export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  href: string;
  links: NavLink[];
}

export const primaryNav: NavGroup[] = [
  {
    title: 'QR Generators',
    href: '/#generators',
    links: [
      { href: '/url-qr-code-generator', label: 'URL QR Code' },
      { href: '/wifi-qr-code-generator', label: 'WiFi QR Code' },
      { href: '/vcard-qr-code-generator', label: 'vCard QR Code' },
      { href: '/whatsapp-qr-code-generator', label: 'WhatsApp QR Code' },
      { href: '/upi-qr-code-generator', label: 'UPI Payment QR' },
      { href: '/bitcoin-qr-code-generator', label: 'Bitcoin QR Code' },
    ],
  },
  {
    title: 'Tools',
    href: '/#tools',
    links: [
      { href: '/qr-size-calculator', label: 'QR Size Calculator' },
      { href: '/qr-safety-checker', label: 'QR Safety Checker' },
      { href: '/printed-qr-tester', label: 'Printed QR Tester' },
      { href: '/error-correction-simulator', label: 'Error Correction Simulator' },
      { href: '/qr-splitter-scanner', label: 'QR Splitter & Scanner' },
      { href: '/utm-builder', label: 'UTM Builder' },
      { href: '/barcode-generator', label: 'Barcode Generator' },
      { href: '/qr-sticker-sheet-printer', label: 'Sticker Sheet Printer' },
      { href: '/bulk-vcard-qr', label: 'Bulk vCard QR' },
      { href: '/qr-scanner', label: 'QR Scanner' },
      { href: '/bulk-generator', label: 'Bulk QR Generator' },
    ],
  },
  {
    title: 'Guides',
    href: '/blog',
    links: [
      { href: '/blog', label: 'All Guides' },
      { href: '/blog/how-qr-codes-work', label: 'How QR Codes Work' },
      { href: '/blog/static-vs-dynamic-qr-codes', label: 'Static vs Dynamic QR Codes' },
      { href: '/blog/qr-code-sizes-for-printing', label: 'QR Code Sizes for Printing' },
      { href: '/qr-placement-guide', label: 'QR Placement Guide' },
    ],
  },
  {
    title: 'Regions',
    href: '/regional-payment-qr',
    links: [
      { href: '/regional-payment-qr', label: 'Regional Payment QR' },
      { href: '/pakistan-payment-qr', label: 'Pakistan Payment QR' },
      { href: '/payment-qr', label: 'Payment QR Schemes' },
      { href: '/whatsapp-qr', label: 'WhatsApp by Country' },
    ],
  },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Generators',
    links: [
      { href: '/url-qr-code-generator', label: 'URL QR Code Generator' },
      { href: '/wifi-qr-code-generator', label: 'WiFi QR Code Generator' },
      { href: '/vcard-qr-code-generator', label: 'vCard QR Code Generator' },
      { href: '/whatsapp-qr-code-generator', label: 'WhatsApp QR Code Generator' },
      { href: '/upi-qr-code-generator', label: 'UPI QR Code Generator' },
      { href: '/bitcoin-qr-code-generator', label: 'Bitcoin QR Code Generator' },
      { href: '/barcode-generator', label: 'Barcode Generator' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/qr-size-calculator', label: 'QR Size Calculator' },
      { href: '/qr-safety-checker', label: 'QR Safety Checker' },
      { href: '/printed-qr-tester', label: 'Printed QR Tester' },
      { href: '/error-correction-simulator', label: 'Error Correction Simulator' },
      { href: '/qr-splitter-scanner', label: 'QR Splitter & Scanner' },
      { href: '/animated-qr-transfer', label: 'Animated QR Transfer' },
      { href: '/utm-builder', label: 'UTM Builder' },
      { href: '/qr-sticker-sheet-printer', label: 'Sticker Sheet Printer' },
      { href: '/bulk-vcard-generator', label: 'Bulk vCard Generator' },
      { href: '/bulk-vcard-qr', label: 'Bulk vCard QR' },
      { href: '/wifi-sign-generator', label: 'WiFi Sign Generator' },
      { href: '/qr-placement-guide', label: 'QR Placement Guide' },
      { href: '/qr-scanner', label: 'QR Scanner' },
      { href: '/bulk-generator', label: 'Bulk QR Generator' },
    ],
  },
  {
    title: 'Specialty',
    links: [
      { href: '/medical-id-qr', label: 'Medical ID QR' },
      { href: '/pet-tag-qr', label: 'Pet Tag QR' },
      { href: '/pakistan-payment-qr', label: 'Pakistan Payment QR' },
      { href: '/regional-payment-qr', label: 'Regional Payment QR' },
      { href: '/payment-qr', label: 'Payment QR Schemes' },
      { href: '/qr-labels', label: 'QR Label Sheets' },
      { href: '/whatsapp-qr', label: 'WhatsApp by Country' },
      { href: '/blog', label: 'Blog & Guides' },
      { href: '/sitemap-page', label: 'Sitemap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];
