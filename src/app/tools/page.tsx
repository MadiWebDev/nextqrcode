/**
 * /tools — QR Code Tools Directory Hub
 *
 * Critical crawl bridge: links to every tool, bulk generator, suite and
 * calculator page as real HTML <Link> elements so Googlebot can discover
 * and crawl all tool pages without relying solely on the sitemap.
 *
 * Server component (no 'use client'). Statically generated at build time.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'All QR Code Tools & Generators Directory — QR Studio',
  description:
    'Browse every free QR tool on QR Studio: 40+ generators, 30+ bulk tools, 25+ industry suites, print calculators, safety checkers, and design tools. No sign-up needed.',
  alternates: { canonical: `${siteConfig.url}/tools` },
  robots: { index: true, follow: true },
};

interface ToolLink {
  href: string;
  label: string;
}

interface ToolCategory {
  heading: string;
  description: string;
  tools: ToolLink[];
}

const categories: ToolCategory[] = [
  {
    heading: 'QR Code Generators',
    description:
      'Create free QR codes for URLs, WiFi networks, contact cards, payments, events, and 30+ more data types. Every generator runs in the browser — no data leaves your device.',
    tools: [
      { href: '/url-qr-code-generator', label: 'URL QR Code Generator' },
      { href: '/wifi-qr-code-generator', label: 'WiFi QR Code Generator' },
      { href: '/vcard-qr-code-generator', label: 'vCard QR Code Generator' },
      { href: '/whatsapp-qr-code-generator', label: 'WhatsApp QR Code Generator' },
      { href: '/upi-qr-code-generator', label: 'UPI Payment QR Generator' },
      { href: '/bitcoin-qr-code-generator', label: 'Bitcoin QR Code Generator' },
      { href: '/email-qr-code-generator', label: 'Email QR Code Generator' },
      { href: '/sms-qr-code-generator', label: 'SMS QR Code Generator' },
      { href: '/calendar-event-qr-code-generator', label: 'Calendar Event QR Generator' },
      { href: '/app-store-qr-code-generator', label: 'App Store QR Code Generator' },
      { href: '/pdf-qr-code-generator', label: 'PDF QR Code Generator' },
      { href: '/zoom-meeting-qr-code-generator', label: 'Zoom Meeting QR Generator' },
      { href: '/crypto-wallet-qr-code-generator', label: 'Crypto Wallet QR Generator' },
      { href: '/coupon-qr-code-generator', label: 'Coupon QR Code Generator' },
      { href: '/ticket-qr-code-generator', label: 'Ticket QR Code Generator' },
      { href: '/survey-qr-code-generator', label: 'Survey QR Code Generator' },
      { href: '/social-profile-qr-code-generator', label: 'Social Profile QR Generator' },
      { href: '/playlist-qr-code-generator', label: 'Playlist QR Code Generator' },
      { href: '/resume-qr-code-generator', label: 'Resume QR Code Generator' },
      { href: '/menu-qr-code-generator', label: 'Menu QR Code Generator' },
      { href: '/feedback-qr-code-generator', label: 'Feedback QR Code Generator' },
      { href: '/donation-qr-code-generator', label: 'Donation QR Code Generator' },
      { href: '/mecard-qr-code-generator', label: 'MeCard QR Code Generator' },
      { href: '/whatsapp-qr', label: 'WhatsApp QR by Country' },
      { href: '/payment-qr', label: 'Payment QR Schemes' },
    ],
  },
  {
    heading: 'Bulk QR Generators',
    description:
      'Generate hundreds of QR codes from a CSV file in a single batch. Download as a ZIP of PNGs or as a printable PDF sheet. Perfect for events, inventory, and team onboarding.',
    tools: [
      { href: '/bulk-url-qr-generator', label: 'Bulk URL QR Generator' },
      { href: '/bulk-wifi-qr-generator', label: 'Bulk WiFi QR Generator' },
      { href: '/bulk-email-qr-generator', label: 'Bulk Email QR Generator' },
      { href: '/bulk-sms-qr-generator', label: 'Bulk SMS QR Generator' },
      { href: '/bulk-business-card-qr-generator', label: 'Bulk Business Card QR Generator' },
      { href: '/bulk-event-badge-qr-generator', label: 'Bulk Event Badge QR Generator' },
      { href: '/bulk-asset-tag-qr-generator', label: 'Bulk Asset Tag QR Generator' },
      { href: '/bulk-student-id-qr-generator', label: 'Bulk Student ID QR Generator' },
      { href: '/bulk-table-tent-qr-generator', label: 'Bulk Table Tent QR Generator' },
      { href: '/bulk-feedback-qr-generator', label: 'Bulk Feedback QR Generator' },
      { href: '/bulk-donation-qr-generator', label: 'Bulk Donation QR Generator' },
      { href: '/bulk-check-in-qr-generator', label: 'Bulk Check-In QR Generator' },
      { href: '/bulk-inventory-qr-generator', label: 'Bulk Inventory QR Generator' },
      { href: '/bulk-ticket-qr-generator', label: 'Bulk Ticket QR Generator' },
      { href: '/bulk-pet-tag-qr-generator', label: 'Bulk Pet Tag QR Generator' },
      { href: '/bulk-certificate-qr-generator', label: 'Bulk Certificate QR Generator' },
      { href: '/bulk-coupon-qr-generator', label: 'Bulk Coupon QR Generator' },
      { href: '/bulk-survey-qr-generator', label: 'Bulk Survey QR Generator' },
      { href: '/bulk-menu-item-qr-generator', label: 'Bulk Menu Item QR Generator' },
      { href: '/bulk-calendar-qr-generator', label: 'Bulk Calendar QR Generator' },
      { href: '/bulk-review-qr-generator', label: 'Bulk Review QR Generator' },
      { href: '/bulk-pdf-qr-generator', label: 'Bulk PDF QR Generator' },
      { href: '/bulk-rsvp-qr-generator', label: 'Bulk RSVP QR Generator' },
      { href: '/bulk-loyalty-card-qr-generator', label: 'Bulk Loyalty Card QR Generator' },
      { href: '/bulk-mecard-generator', label: 'Bulk MeCard Generator' },
      { href: '/bulk-vcard-qr', label: 'Bulk vCard QR from CSV' },
      { href: '/bulk-generator', label: 'Bulk QR Generator (Universal)' },
    ],
  },
  {
    heading: 'Industry QR Suites',
    description:
      'Pre-configured QR tool bundles for specific industries. Each suite includes ready-to-print QR codes, payload templates, and best-practice guidance tailored to the business type.',
    tools: [
      { href: '/restaurant-qr-suite', label: 'Restaurant QR Suite' },
      { href: '/retail-qr-suite', label: 'Retail QR Suite' },
      { href: '/clinic-qr-suite', label: 'Clinic QR Suite' },
      { href: '/school-qr-suite', label: 'School QR Suite' },
      { href: '/gym-qr-suite', label: 'Gym QR Suite' },
      { href: '/hotel-qr-suite', label: 'Hotel QR Suite' },
      { href: '/real-estate-qr-suite', label: 'Real Estate QR Suite' },
      { href: '/salon-qr-suite', label: 'Salon QR Suite' },
      { href: '/pharmacy-qr-suite', label: 'Pharmacy QR Suite' },
      { href: '/museum-qr-suite', label: 'Museum QR Suite' },
      { href: '/library-qr-suite', label: 'Library QR Suite' },
      { href: '/warehouse-qr-suite', label: 'Warehouse QR Suite' },
      { href: '/farm-qr-suite', label: 'Farm QR Suite' },
      { href: '/vet-qr-suite', label: 'Veterinary QR Suite' },
      { href: '/hostel-qr-suite', label: 'Hostel QR Suite' },
      { href: '/courier-qr-suite', label: 'Courier QR Suite' },
      { href: '/co-working-qr-suite', label: 'Co-Working Space QR Suite' },
      { href: '/bakery-qr-suite', label: 'Bakery QR Suite' },
      { href: '/barber-qr-suite', label: 'Barber Shop QR Suite' },
      { href: '/boutique-qr-suite', label: 'Boutique QR Suite' },
      { href: '/car-wash-qr-suite', label: 'Car Wash QR Suite' },
      { href: '/dentist-qr-suite', label: 'Dentist QR Suite' },
      { href: '/florist-qr-suite', label: 'Florist QR Suite' },
      { href: '/food-truck-qr-suite', label: 'Food Truck QR Suite' },
      { href: '/laundromat-qr-suite', label: 'Laundromat QR Suite' },
      { href: '/spa-qr-suite', label: 'Spa QR Suite' },
      { href: '/event-venue-qr-suite', label: 'Event Venue QR Suite' },
      { href: '/driving-school-qr-suite', label: 'Driving School QR Suite' },
      { href: '/church-qr-suite', label: 'Church QR Suite' },
      { href: '/taxi-qr-suite', label: 'Taxi & Ride Service QR Suite' },
    ],
  },
  {
    heading: 'Print & Size Tools',
    description:
      'Calculate the minimum QR code size for any print medium — business cards, banners, packaging, billboards, and labels. Ensure every printed QR code is scannable at its intended distance.',
    tools: [
      { href: '/qr-size-calculator', label: 'QR Size & Scan-Distance Calculator' },
      { href: '/qr-print-cost-calculator', label: 'QR Print Cost Calculator' },
      { href: '/qr-billboard-size-calculator', label: 'QR Billboard Size Calculator' },
      { href: '/qr-module-size-calculator', label: 'QR Module Size Calculator' },
      { href: '/qr-quiet-zone-calculator', label: 'QR Quiet Zone Calculator' },
      { href: '/qr-data-capacity-calculator', label: 'QR Data Capacity Calculator' },
      { href: '/qr-dpi-calculator', label: 'QR DPI Calculator' },
      { href: '/qr-logo-safe-area-calculator', label: 'QR Logo Safe Area Calculator' },
      { href: '/qr-label-count-calculator', label: 'QR Label Count Calculator' },
      { href: '/qr-batch-cost-calculator', label: 'QR Batch Cost Calculator' },
      { href: '/qr-frame-text-size-calculator', label: 'QR Frame Text Size Calculator' },
      { href: '/qr-roll-label-planner', label: 'QR Roll Label Planner' },
      { href: '/qr-print-area-calculator', label: 'QR Print Area Calculator' },
      { href: '/qr-size-presets', label: 'QR Size Presets' },
      { href: '/qr-print-sheet-planner', label: 'QR Print Sheet Planner' },
      { href: '/qr-sticker-sheet-printer', label: 'QR Sticker Sheet Printer' },
      { href: '/qr-labels', label: 'QR Label Sheets (Avery-compatible)' },
    ],
  },
  {
    heading: 'Safety & Security Tools',
    description:
      'Inspect, verify, and audit QR code payloads before scanning. Detect phishing URLs, typosquatting, redirect chains, and brand impersonation in QR codes from unknown sources.',
    tools: [
      { href: '/qr-safety-checker', label: 'QR Safety & Phishing Checker' },
      { href: '/qr-contrast-checker', label: 'QR Contrast Checker' },
      { href: '/qr-payload-inspector', label: 'QR Payload Inspector' },
      { href: '/qr-expiry-checker', label: 'QR Expiry Checker' },
      { href: '/qr-offline-verifier', label: 'QR Offline Verifier' },
      { href: '/qr-payload-linter', label: 'QR Payload Linter' },
      { href: '/qr-url-anatomy-checker', label: 'QR URL Anatomy Checker' },
      { href: '/qr-payload-hash-verifier', label: 'QR Payload Hash Verifier' },
      { href: '/qr-allowlist-builder', label: 'QR Allowlist Builder' },
      { href: '/qr-blocklist-tester', label: 'QR Blocklist Tester' },
      { href: '/qr-phishing-pattern-trainer', label: 'QR Phishing Pattern Trainer' },
      { href: '/qr-typosquat-checker', label: 'QR Typosquat Checker' },
      { href: '/qr-homograph-detector', label: 'QR Homograph Detector' },
      { href: '/qr-brand-impersonation-checker', label: 'QR Brand Impersonation Checker' },
      { href: '/qr-destination-change-detector', label: 'QR Destination Change Detector' },
      { href: '/qr-redirect-chain-viewer', label: 'QR Redirect Chain Viewer' },
      { href: '/qr-clone-risk-scorer', label: 'QR Clone Risk Scorer' },
      { href: '/qr-scheme-safety-checker', label: 'QR Scheme Safety Checker' },
      { href: '/qr-permission-explainer', label: 'QR Permission Explainer' },
      { href: '/qr-safe-scan-checklist-builder', label: 'QR Safe-Scan Checklist Builder' },
    ],
  },
  {
    heading: 'Design & Output Tools',
    description:
      'Customise, brand, and export QR codes in any format. Add logos, frames, gradients, and call-to-action text. Export to SVG, PNG, PDF, or ZIP bundles for print-ready production.',
    tools: [
      { href: '/qr-frame-designer', label: 'QR Frame Designer' },
      { href: '/qr-color-pair-tester', label: 'QR Color Pair Tester' },
      { href: '/qr-gradient-maker', label: 'QR Gradient Maker' },
      { href: '/qr-svg-png-pdf-exporter', label: 'QR SVG / PNG / PDF Exporter' },
      { href: '/qr-image-enhancer', label: 'QR Image Enhancer' },
      { href: '/qr-code-rotator', label: 'QR Code Rotator' },
      { href: '/qr-code-cropper', label: 'QR Code Cropper' },
      { href: '/qr-quiet-zone-adder', label: 'QR Quiet Zone Adder' },
      { href: '/qr-scan-instruction-card', label: 'QR Scan Instruction Card' },
      { href: '/qr-embed-code-builder', label: 'QR Embed Code Builder' },
      { href: '/qr-call-to-action-builder', label: 'QR Call-to-Action Builder' },
      { href: '/qr-batch-renamer', label: 'QR Batch Renamer' },
      { href: '/qr-zip-packager', label: 'QR ZIP Packager' },
      { href: '/qr-print-proof-checklist', label: 'QR Print Proof Checklist' },
      { href: '/qr-to-pdf-converter', label: 'QR to PDF Converter' },
      { href: '/wifi-sign-generator', label: 'WiFi Sign Generator' },
      { href: '/qr-placement-guide', label: 'QR Placement Guide' },
    ],
  },
  {
    heading: 'Analytics & Campaign Tools',
    description:
      'Plan, measure, and optimise QR code campaigns. Estimate scan rates, model ROI, run A/B tests, and audit UTM parameters — all without sending data to third-party servers.',
    tools: [
      { href: '/qr-a-b-test-planner', label: 'QR A/B Test Planner' },
      { href: '/qr-ab-test-significance-calculator', label: 'QR A/B Test Significance Calculator' },
      { href: '/qr-scan-log', label: 'QR Scan Log' },
      { href: '/qr-analytics-simulator', label: 'QR Analytics Simulator' },
      { href: '/qr-campaign-planner', label: 'QR Campaign Planner' },
      { href: '/qr-cost-per-scan-calculator', label: 'QR Cost Per Scan Calculator' },
      {
        href: '/qr-dynamic-vs-static-roi-calculator',
        label: 'Dynamic vs Static QR ROI Calculator',
      },
      { href: '/qr-scan-funnel-calculator', label: 'QR Scan Funnel Calculator' },
      { href: '/qr-footfall-scan-estimator', label: 'QR Footfall Scan Estimator' },
      { href: '/qr-campaign-break-even-calculator', label: 'QR Campaign Break-Even Calculator' },
      { href: '/qr-batch-failure-estimator', label: 'QR Batch Failure Estimator' },
      { href: '/qr-scan-test-sample-calculator', label: 'QR Scan Test Sample Calculator' },
      { href: '/qr-utm-audit-checker', label: 'QR UTM Audit Checker' },
      { href: '/utm-builder', label: 'UTM Campaign QR Builder' },
    ],
  },
  {
    heading: 'Technical & Advanced Tools',
    description:
      'Advanced optical engineering tools for QR code analysis, error correction simulation, version estimation, and offline file transfer. Ideal for developers and print engineers.',
    tools: [
      { href: '/printed-qr-tester', label: 'Printed QR Tester' },
      { href: '/animated-qr-transfer', label: 'Animated QR File Transfer' },
      { href: '/qr-scanner', label: 'QR Code Scanner' },
      { href: '/error-correction-simulator', label: 'Error Correction Simulator' },
      { href: '/qr-splitter-scanner', label: 'QR Splitter & Scanner' },
      { href: '/qr-version-estimator', label: 'QR Version Estimator' },
      { href: '/qr-readability-score-calculator', label: 'QR Readability Score Calculator' },
      { href: '/qr-off-axis-scan-calculator', label: 'QR Off-Axis Scan Calculator' },
      { href: '/qr-minimum-size-checker', label: 'QR Minimum Size Checker' },
      { href: '/qr-error-budget-calculator', label: 'QR Error Budget Calculator' },
      { href: '/qr-fade-risk-checker', label: 'QR Fade Risk Checker' },
      { href: '/qr-dot-gain-tolerance-checker', label: 'QR Dot Gain Tolerance Checker' },
      { href: '/qr-glare-risk-checker', label: 'QR Glare Risk Checker' },
      { href: '/qr-wear-lifetime-estimator', label: 'QR Wear Lifetime Estimator' },
      { href: '/qr-code-retirement-planner', label: 'QR Code Retirement Planner' },
      { href: '/qr-batch-duplicate-detector', label: 'QR Batch Duplicate Detector' },
      { href: '/qr-checksum-generator', label: 'QR Checksum Generator' },
      { href: '/qr-api-playground', label: 'QR API Playground' },
      { href: '/barcode-generator', label: 'Barcode Generator' },
    ],
  },
];

/** Reusable section component — renders heading, description and a responsive link grid. */
function ToolsSection({ category }: { category: ToolCategory }) {
  return (
    <section aria-labelledby={`cat-${category.heading.replace(/\s+/g, '-').toLowerCase()}`}>
      <h2
        id={`cat-${category.heading.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3"
      >
        {category.heading}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
        {category.description}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-colors"
            >
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ToolsDirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* BreadcrumbList JSON-LD for rich results */}
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
        ]}
      />

      {/* Visible breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="hover:text-slate-900 dark:hover:text-slate-100 hover:underline"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-700 dark:text-slate-300">
            Tools
          </li>
        </ol>
      </nav>

      <AdSlot id="tools-top" format="horizontal-banner" />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mt-6 mb-3">
        QR Code Tools Directory
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-400 max-w-3xl mb-10 leading-relaxed">
        Every free QR code tool on QR Studio, organised by category. From single-type generators to
        bulk CSV importers, industry suites, print calculators, safety checkers, and advanced
        optical engineering tools — all run in your browser with no sign-up required.
      </p>

      <div className="space-y-14">
        {categories.map((cat) => (
          <ToolsSection key={cat.heading} category={cat} />
        ))}
      </div>

      <AdSlot id="tools-bottom" format="horizontal-banner" />
    </div>
  );
}
