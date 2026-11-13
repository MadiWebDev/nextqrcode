import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'HTML Sitemap — QR Code Tools',
  description:
    'Complete HTML sitemap of QR Code Tools. Browse all free QR generators, bulk tools, industry suites, print calculators, safety tools, blog articles, and reference guides.',
  alternates: { canonical: 'https://freeqrcode.tools/sitemap-page' },
  robots: { index: true, follow: true },
};

function SitemapSection({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3 text-foreground">{heading}</h2>
      <ul className="space-y-1.5 columns-1 sm:columns-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-primary hover:underline text-xs sm:text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">
          QR Code Tools Directory & Sitemap
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          A complete index of all free QR tools and generators, research articles, and reference
          guides. Browse the interactive{' '}
          <Link href="/tools" className="text-primary hover:underline font-medium">
            tools directory
          </Link>{' '}
          for a categorised view.
        </p>
      </header>
      <AdSlot id="sitemap-page-top" format="horizontal-banner" />

      <SitemapSection
        heading="Diagnostics & Specialized Engineering Tools"
        links={[
          { label: 'QR Size & Scan-Distance Calculator', href: '/qr-size-calculator' },
          { label: 'QR Safety & Phishing Checker', href: '/qr-safety-checker' },
          { label: 'Printed-QR Quality & Contrast Tester', href: '/printed-qr-tester' },
          { label: 'Error-Correction & Damage Simulator', href: '/error-correction-simulator' },
          { label: 'Large-Data QR Splitter & Reassembly Scanner', href: '/qr-splitter-scanner' },
          { label: 'Animated-QR Offline File Transfer', href: '/animated-qr-transfer' },
          { label: 'Emergency Medical ID QR Card', href: '/medical-id-qr' },
          { label: 'Printable WiFi Signs (RTL Urdu & Arabic)', href: '/wifi-sign-generator' },
          {
            label: 'Regional Payment QR (Raast, JazzCash, Easypaisa, UPI)',
            href: '/pakistan-payment-qr',
          },
          { label: 'Avery Sticker Sheet Layout Printer', href: '/qr-sticker-sheet-printer' },
          { label: 'Pet Tag & Lost-and-Found QR', href: '/pet-tag-qr' },
          { label: 'Bulk vCard QR from CSV', href: '/bulk-vcard-qr' },
          { label: 'UTM Campaign QR Builder', href: '/utm-builder' },
          { label: 'QR Placement by Material Checklist', href: '/qr-placement-guide' },
          { label: '1D Barcode Generator with Checksum Validation', href: '/barcode-generator' },
        ]}
      />

      <SitemapSection
        heading="Standard QR Code Generators"
        links={[
          { label: 'Free URL QR Code Generator', href: '/url-qr-code-generator' },
          { label: 'Instant WiFi QR Code Generator', href: '/wifi-qr-code-generator' },
          { label: 'Digital vCard 3.0 Generator', href: '/vcard-qr-code-generator' },
          { label: 'MeCard QR Code Generator', href: '/mecard-qr-code-generator' },
          { label: 'Direct WhatsApp Link QR', href: '/whatsapp-qr-code-generator' },
          { label: 'UPI Payment QR Generator', href: '/upi-qr-code-generator' },
          { label: 'Bitcoin & Crypto Address QR', href: '/bitcoin-qr-code-generator' },
          { label: 'Crypto Wallet Address QR', href: '/crypto-wallet-qr-code-generator' },
          { label: 'Email QR Code Generator', href: '/email-qr-code-generator' },
          { label: 'SMS QR Code Generator', href: '/sms-qr-code-generator' },
          { label: 'Calendar Event QR Code Generator', href: '/calendar-event-qr-code-generator' },
          { label: 'App Store QR Code Generator', href: '/app-store-qr-code-generator' },
          { label: 'PDF QR Code Generator', href: '/pdf-qr-code-generator' },
          { label: 'Zoom Meeting QR Code Generator', href: '/zoom-meeting-qr-code-generator' },
          { label: 'Coupon QR Code Generator', href: '/coupon-qr-code-generator' },
          { label: 'Ticket QR Code Generator', href: '/ticket-qr-code-generator' },
          { label: 'Survey QR Code Generator', href: '/survey-qr-code-generator' },
          { label: 'Social Profile QR Code Generator', href: '/social-profile-qr-code-generator' },
          { label: 'Playlist QR Code Generator', href: '/playlist-qr-code-generator' },
          { label: 'Podcast QR Code Generator', href: '/podcast-qr-code-generator' },
          { label: 'Resume QR Code Generator', href: '/resume-qr-code-generator' },
          { label: 'Menu QR Code Generator', href: '/menu-qr-code-generator' },
          { label: 'Feedback QR Code Generator', href: '/feedback-qr-code-generator' },
          { label: 'Donation QR Code Generator', href: '/donation-qr-code-generator' },
          { label: 'Event RSVP QR Code Generator', href: '/event-rsvp-qr-code-generator' },
          { label: 'Loyalty Card QR Code Generator', href: '/loyalty-card-qr-code-generator' },
        ]}
      />

      <SitemapSection
        heading="More QR Generators"
        links={[
          { label: 'QR Link Menu Generator', href: '/qr-link-menu-generator' },
          { label: 'App Review Link QR Generator', href: '/app-review-link-qr-generator' },
          { label: 'vCard Photo QR Generator', href: '/vcard-photo-qr-generator' },
          { label: 'Event Countdown QR Generator', href: '/event-countdown-qr-generator' },
          { label: 'Gift Card QR Generator', href: '/gift-card-qr-generator' },
          { label: 'Membership Card QR Generator', href: '/membership-card-qr-generator' },
          { label: 'Parking Spot QR Generator', href: '/parking-spot-qr-generator' },
          { label: 'Table Order QR Generator', href: '/table-order-qr-generator' },
          { label: 'Room Booking QR Generator', href: '/room-booking-qr-generator' },
          { label: 'Shipment Tracking QR Generator', href: '/shipment-tracking-qr-generator' },
          { label: 'Invoice Payment QR Generator', href: '/invoice-payment-qr-generator' },
          { label: 'Fundraiser QR Generator', href: '/fundraiser-qr-generator' },
          { label: 'Course Enrollment QR Generator', href: '/course-enrollment-qr-generator' },
          { label: 'Webinar Join QR Generator', href: '/webinar-join-qr-generator' },
          { label: 'Pet Adoption QR Generator', href: '/pet-adoption-qr-generator' },
          { label: 'Job Application QR Generator', href: '/job-application-qr-generator' },
          { label: 'Car Listing QR Generator', href: '/car-listing-qr-generator' },
          { label: 'Property Tour QR Generator', href: '/property-tour-qr-generator' },
          { label: 'Prescription Refill QR Generator', href: '/prescription-refill-qr-generator' },
          { label: 'Geo QR Code Generator', href: '/geo-qr-code-generator' },
          { label: 'WhatsApp Order QR Generator', href: '/whatsapp-order-qr-generator' },
          { label: 'Live Stream QR Generator', href: '/live-stream-qr-generator' },
          { label: 'Google Review QR Generator', href: '/google-review-qr-generator' },
          { label: 'Boarding Pass QR Generator', href: '/boarding-pass-qr-generator' },
          { label: 'Luggage Tag QR Generator', href: '/luggage-tag-qr-generator' },
          { label: 'Plant Care QR Generator', href: '/plant-care-qr-generator' },
          { label: 'Recipe QR Generator', href: '/recipe-qr-generator' },
          { label: 'Warranty QR Generator', href: '/warranty-qr-generator' },
          { label: 'Visitor Badge QR Generator', href: '/visitor-badge-qr-generator' },
          { label: 'Seat Finder QR Generator', href: '/seat-finder-qr-generator' },
          { label: 'Appointment Booking QR Generator', href: '/appointment-booking-qr-generator' },
          { label: 'Quote Request QR Generator', href: '/quote-request-qr-generator' },
          { label: 'Kid-Safe QR Card Generator', href: '/kid-safe-qr-card-generator' },
        ]}
      />
      <SitemapSection
        heading="Document & Business Generators"
        links={[
          { label: 'QR Scanner', href: '/qr-scanner' },
          { label: 'Invoice Generator', href: '/invoice-generator' },
          { label: 'Quote Generator', href: '/quote-generator' },
          { label: 'Receipt Generator', href: '/receipt-generator' },
          { label: 'Student ID Card Generator', href: '/student-id-card-generator' },
          { label: 'Employee ID Card Generator', href: '/employee-id-card-generator' },
          { label: 'Certificate Generator', href: '/certificate-generator' },
          { label: 'Price Tag Maker', href: '/price-tag-maker' },
          { label: 'Sale Poster Maker', href: '/sale-poster-maker' },
          { label: 'Image to PDF Converter', href: '/image-to-pdf-converter' },
          { label: 'Passport Photo Maker', href: '/passport-photo-maker' },
          { label: 'Proforma Invoice Generator', href: '/proforma-invoice-generator' },
          { label: 'Purchase Order Generator', href: '/purchase-order-generator' },
          { label: 'Credit Note Generator', href: '/credit-note-generator' },
          { label: 'Debit Note Generator', href: '/debit-note-generator' },
          { label: 'Commercial Invoice Generator', href: '/commercial-invoice-generator' },
          { label: 'Timesheet Invoice Generator', href: '/timesheet-invoice-generator' },
          { label: 'Delivery Note Generator', href: '/delivery-note-generator' },
          {
            label: 'Payment Reminder Letter Generator',
            href: '/payment-reminder-letter-generator',
          },
          { label: 'Salary Slip Generator', href: '/salary-slip-generator' },
          { label: 'Late Fee Calculator', href: '/late-fee-calculator' },
          { label: 'GST/VAT Calculator', href: '/gst-vat-calculator' },
          { label: 'Discount Margin Calculator', href: '/discount-margin-calculator' },
          { label: 'Amount to Words Converter', href: '/amount-to-words-converter' },
          { label: 'Regional Payment QR', href: '/regional-payment-qr' },
          { label: 'Bulk vCard Generator', href: '/bulk-vcard-generator' },
        ]}
      />
      <SitemapSection
        heading="Calculators & Checkers"
        links={[
          { label: 'QR Batch Failure Estimator', href: '/qr-batch-failure-estimator' },
          { label: 'QR Cost Per Scan Calculator', href: '/qr-cost-per-scan-calculator' },
          {
            label: 'QR Dynamic vs Static ROI Calculator',
            href: '/qr-dynamic-vs-static-roi-calculator',
          },
          { label: 'QR Frame Text Size Calculator', href: '/qr-frame-text-size-calculator' },
          { label: 'QR Roll Label Planner', href: '/qr-roll-label-planner' },
          { label: 'QR Off-Axis Scan Calculator', href: '/qr-off-axis-scan-calculator' },
          { label: 'QR Glare Risk Checker', href: '/qr-glare-risk-checker' },
          { label: 'QR Wear Lifetime Estimator', href: '/qr-wear-lifetime-estimator' },
          { label: 'QR Print Waste Estimator', href: '/qr-print-waste-estimator' },
          {
            label: 'QR Campaign Break-Even Calculator',
            href: '/qr-campaign-break-even-calculator',
          },
          { label: 'QR Dot Gain Tolerance Checker', href: '/qr-dot-gain-tolerance-checker' },
          { label: 'QR Footfall Scan Estimator', href: '/qr-footfall-scan-estimator' },
          { label: 'QR Scan Funnel Calculator', href: '/qr-scan-funnel-calculator' },
          {
            label: 'QR A/B Test Significance Calculator',
            href: '/qr-ab-test-significance-calculator',
          },
          { label: 'QR Scan Test Sample Calculator', href: '/qr-scan-test-sample-calculator' },
          { label: 'QR UTM Audit Checker', href: '/qr-utm-audit-checker' },
          { label: 'QR Version Estimator', href: '/qr-version-estimator' },
          { label: 'QR Print Area Calculator', href: '/qr-print-area-calculator' },
          { label: 'QR Readability Score Calculator', href: '/qr-readability-score-calculator' },
          { label: 'QR Code Retirement Planner', href: '/qr-code-retirement-planner' },
        ]}
      />
      <SitemapSection
        heading="QR Print Calculators"
        links={[
          { label: 'QR Contrast Checker', href: '/qr-contrast-checker' },
          { label: 'QR Print Cost Calculator', href: '/qr-print-cost-calculator' },
          { label: 'QR Billboard Size Calculator', href: '/qr-billboard-size-calculator' },
          { label: 'QR Quiet Zone Calculator', href: '/qr-quiet-zone-calculator' },
          { label: 'QR DPI Calculator', href: '/qr-dpi-calculator' },
          { label: 'QR Data Capacity Calculator', href: '/qr-data-capacity-calculator' },
          { label: 'QR Logo Safe Area Calculator', href: '/qr-logo-safe-area-calculator' },
          { label: 'QR Label Count Calculator', href: '/qr-label-count-calculator' },
          { label: 'QR Batch Cost Calculator', href: '/qr-batch-cost-calculator' },
          { label: 'QR Ink Coverage Estimator', href: '/qr-ink-coverage-estimator' },
          { label: 'QR Curved Surface Calculator', href: '/qr-curved-surface-calculator' },
          { label: 'QR Fade Risk Checker', href: '/qr-fade-risk-checker' },
          { label: 'QR Module Size Calculator', href: '/qr-module-size-calculator' },
          { label: 'QR Error Budget Calculator', href: '/qr-error-budget-calculator' },
          { label: 'QR Minimum Size Checker', href: '/qr-minimum-size-checker' },
        ]}
      />
      <SitemapSection
        heading="Validators & Security Tools"
        links={[
          { label: 'QR Homograph Detector', href: '/qr-homograph-detector' },
          { label: 'QR Payload Linter', href: '/qr-payload-linter' },
          { label: 'QR Allowlist Tester', href: '/qr-allowlist-tester' },
          { label: 'QR Blocklist Tester', href: '/qr-blocklist-tester' },
          { label: 'QR Scheme Safety Checker', href: '/qr-scheme-safety-checker' },
          { label: 'QR Expiry Policy Builder', href: '/qr-expiry-policy-builder' },
          { label: 'QR Clone Risk Scorer', href: '/qr-clone-risk-scorer' },
          { label: 'QR Permission Explainer', href: '/qr-permission-explainer' },
          { label: 'QR Image Metadata Auditor', href: '/qr-image-metadata-auditor' },
          { label: 'QR URL Anatomy Checker', href: '/qr-url-anatomy-checker' },
          { label: 'QR Payload Hash Verifier', href: '/qr-payload-hash-verifier' },
          { label: 'QR Batch Duplicate Detector', href: '/qr-batch-duplicate-detector' },
          { label: 'QR Tracking Parameter Auditor', href: '/qr-tracking-parameter-auditor' },
          { label: 'QR Safe Scan Checklist Builder', href: '/qr-safe-scan-checklist-builder' },
          { label: 'QR Incident Report Builder', href: '/qr-incident-report-builder' },
          { label: 'QR Brand Impersonation Checker', href: '/qr-brand-impersonation-checker' },
          { label: 'QR Destination Change Detector', href: '/qr-destination-change-detector' },
          { label: 'QR Redirect Chain Viewer', href: '/qr-redirect-chain-viewer' },
          { label: 'QR Payload Inspector', href: '/qr-payload-inspector' },
          { label: 'QR Allowlist Builder', href: '/qr-allowlist-builder' },
          { label: 'QR Metadata Stripper', href: '/qr-metadata-stripper' },
          { label: 'QR Offline Verifier', href: '/qr-offline-verifier' },
          { label: 'QR Tamper Evidence Planner', href: '/qr-tamper-evidence-planner' },
          { label: 'QR Expiry Checker', href: '/qr-expiry-checker' },
          { label: 'QR Checksum Generator', href: '/qr-checksum-generator' },
          { label: 'QR Scan Log', href: '/qr-scan-log' },
          { label: 'QR Consent Note Builder', href: '/qr-consent-note-builder' },
          { label: 'QR Print Proof Checklist', href: '/qr-print-proof-checklist' },
          { label: 'QR Signature Note Builder', href: '/qr-signature-note-builder' },
          { label: 'QR Batch Validator', href: '/qr-batch-validator' },
          { label: 'QR Typosquat Checker', href: '/qr-typosquat-checker' },
          { label: 'QR Phishing Pattern Trainer', href: '/qr-phishing-pattern-trainer' },
        ]}
      />
      <SitemapSection
        heading="QR Design & Export Tools"
        links={[
          { label: 'QR Gradient Maker', href: '/qr-gradient-maker' },
          { label: 'QR Frame Designer', href: '/qr-frame-designer' },
          { label: 'QR Quiet Zone Adder', href: '/qr-quiet-zone-adder' },
          { label: 'QR SVG/PNG/PDF Exporter', href: '/qr-svg-png-pdf-exporter' },
          { label: 'QR Size Presets', href: '/qr-size-presets' },
          { label: 'QR Color Pair Tester', href: '/qr-color-pair-tester' },
          { label: 'QR Batch Renamer', href: '/qr-batch-renamer' },
          { label: 'QR Zip Packager', href: '/qr-zip-packager' },
          { label: 'QR Print Sheet Planner', href: '/qr-print-sheet-planner' },
          { label: 'QR Scan Instruction Card', href: '/qr-scan-instruction-card' },
          { label: 'QR Embed Code Builder', href: '/qr-embed-code-builder' },
          { label: 'QR API Playground', href: '/qr-api-playground' },
          { label: 'QR to PDF Converter', href: '/qr-to-pdf-converter' },
          { label: 'QR Image Enhancer', href: '/qr-image-enhancer' },
          { label: 'QR Code Rotator', href: '/qr-code-rotator' },
          { label: 'QR Code Cropper', href: '/qr-code-cropper' },
          { label: 'QR Call-to-Action Builder', href: '/qr-call-to-action-builder' },
          { label: 'QR Analytics Simulator', href: '/qr-analytics-simulator' },
          { label: 'QR A/B Test Planner', href: '/qr-a-b-test-planner' },
          { label: 'QR Campaign Planner', href: '/qr-campaign-planner' },
        ]}
      />
      <SitemapSection
        heading="Bulk QR Generators"
        links={[
          { label: 'Bulk URL QR Generator', href: '/bulk-url-qr-generator' },
          { label: 'Bulk WiFi QR Generator', href: '/bulk-wifi-qr-generator' },
          { label: 'Bulk Email QR Generator', href: '/bulk-email-qr-generator' },
          { label: 'Bulk SMS QR Generator', href: '/bulk-sms-qr-generator' },
          { label: 'Bulk Business Card QR Generator', href: '/bulk-business-card-qr-generator' },
          { label: 'Bulk Event Badge QR Generator', href: '/bulk-event-badge-qr-generator' },
          { label: 'Bulk Asset Tag QR Generator', href: '/bulk-asset-tag-qr-generator' },
          { label: 'Bulk Student ID QR Generator', href: '/bulk-student-id-qr-generator' },
          { label: 'Bulk Table Tent QR Generator', href: '/bulk-table-tent-qr-generator' },
          { label: 'Bulk Feedback QR Generator', href: '/bulk-feedback-qr-generator' },
          { label: 'Bulk Donation QR Generator', href: '/bulk-donation-qr-generator' },
          { label: 'Bulk Check-In QR Generator', href: '/bulk-check-in-qr-generator' },
          { label: 'Bulk Inventory QR Generator', href: '/bulk-inventory-qr-generator' },
          { label: 'Bulk Ticket QR Generator', href: '/bulk-ticket-qr-generator' },
          { label: 'Bulk Pet Tag QR Generator', href: '/bulk-pet-tag-qr-generator' },
          { label: 'Bulk Certificate QR Generator', href: '/bulk-certificate-qr-generator' },
          { label: 'Bulk Coupon QR Generator', href: '/bulk-coupon-qr-generator' },
          { label: 'Bulk Calendar QR Generator', href: '/bulk-calendar-qr-generator' },
          { label: 'Bulk MeCard Generator', href: '/bulk-mecard-generator' },
          { label: 'Bulk Survey QR Generator', href: '/bulk-survey-qr-generator' },
          { label: 'Bulk Menu Item QR Generator', href: '/bulk-menu-item-qr-generator' },
          { label: 'Bulk Shipping Label QR Generator', href: '/bulk-shipping-label-qr-generator' },
          { label: 'Bulk Shelf Label QR Generator', href: '/bulk-shelf-label-qr-generator' },
          { label: 'Bulk Coupon Expiry Auditor', href: '/bulk-coupon-expiry-auditor' },
          { label: 'Bulk RSVP QR Generator', href: '/bulk-rsvp-qr-generator' },
          { label: 'Bulk Loyalty Card QR Generator', href: '/bulk-loyalty-card-qr-generator' },
          { label: 'Bulk Seat QR Generator', href: '/bulk-seat-qr-generator' },
          { label: 'Bulk Invoice QR Generator', href: '/bulk-invoice-qr-generator' },
          { label: 'Bulk Review QR Generator', href: '/bulk-review-qr-generator' },
          { label: 'Bulk PDF QR Generator', href: '/bulk-pdf-qr-generator' },
          { label: 'Bulk vCard QR from CSV', href: '/bulk-vcard-qr' },
          { label: 'Bulk QR Generator (Universal)', href: '/bulk-generator' },
        ]}
      />
      <AdSlot id="sitemap-page-in-content" format="in-article" />
      <SitemapSection
        heading="Industry QR Suites"
        links={[
          { label: 'Restaurant QR Suite', href: '/restaurant-qr-suite' },
          { label: 'Retail QR Suite', href: '/retail-qr-suite' },
          { label: 'Clinic QR Suite', href: '/clinic-qr-suite' },
          { label: 'School QR Suite', href: '/school-qr-suite' },
          { label: 'Gym QR Suite', href: '/gym-qr-suite' },
          { label: 'Hotel QR Suite', href: '/hotel-qr-suite' },
          { label: 'Real Estate QR Suite', href: '/real-estate-qr-suite' },
          { label: 'Salon QR Suite', href: '/salon-qr-suite' },
          { label: 'Pharmacy QR Suite', href: '/pharmacy-qr-suite' },
          { label: 'Museum QR Suite', href: '/museum-qr-suite' },
          { label: 'Library QR Suite', href: '/library-qr-suite' },
          { label: 'Warehouse QR Suite', href: '/warehouse-qr-suite' },
          { label: 'Farm QR Suite', href: '/farm-qr-suite' },
          { label: 'Veterinary QR Suite', href: '/vet-qr-suite' },
          { label: 'Hostel QR Suite', href: '/hostel-qr-suite' },
          { label: 'Courier QR Suite', href: '/courier-qr-suite' },
          { label: 'Co-Working Space QR Suite', href: '/co-working-qr-suite' },
          { label: 'Bakery QR Suite', href: '/bakery-qr-suite' },
          { label: 'Barber Shop QR Suite', href: '/barber-qr-suite' },
          { label: 'Boutique QR Suite', href: '/boutique-qr-suite' },
          { label: 'Car Wash QR Suite', href: '/car-wash-qr-suite' },
          { label: 'Dentist QR Suite', href: '/dentist-qr-suite' },
          { label: 'Florist QR Suite', href: '/florist-qr-suite' },
          { label: 'Food Truck QR Suite', href: '/food-truck-qr-suite' },
          { label: 'Laundromat QR Suite', href: '/laundromat-qr-suite' },
          { label: 'Spa QR Suite', href: '/spa-qr-suite' },
          { label: 'Event Venue QR Suite', href: '/event-venue-qr-suite' },
          { label: 'Driving School QR Suite', href: '/driving-school-qr-suite' },
          { label: 'Church QR Suite', href: '/church-qr-suite' },
          { label: 'Taxi & Ride Service QR Suite', href: '/taxi-qr-suite' },
        ]}
      />

      <SitemapSection
        heading="Technical Research & Engineering Guides"
        links={articles.map((a) => ({
          label: a.title,
          href: `/blog/${a.slug}`,
        }))}
      />

      <SitemapSection
        heading="Reference Guides & Industry Collections"
        links={[
          { label: 'QR Codes by Industry', href: '/industries' },
          { label: 'QR Code Glossary', href: '/glossary' },
          { label: 'QR Code Scanning Guides', href: '/scan-guide' },
          { label: 'QR Code Size Guide', href: '/qr-size-guide' },
          { label: 'QR Code Design Templates', href: '/templates' },
          { label: 'QR Label Sheets', href: '/qr-labels' },
          { label: 'WhatsApp QR by Country', href: '/whatsapp-qr' },
          { label: 'Payment QR Schemes', href: '/payment-qr' },
        ]}
      />

      <p className="text-xs text-muted-foreground">
        Individual entries in these collections that pass the content audit are listed in{' '}
        <Link href="/sitemap.xml" className="text-primary hover:underline">
          /sitemap.xml
        </Link>
        .
      </p>

      <AdSlot id="sitemap-page-pre-related" format="horizontal-banner" />
      <SitemapSection
        heading="Trust & Compliance"
        links={[
          { label: 'About the Engineering Team', href: '/about' },
          { label: 'Contact & Support Desk', href: '/contact' },
          { label: 'Privacy Policy (Zero-Data Stored)', href: '/privacy' },
          { label: 'Cookie Policy & Consent Platform', href: '/cookie-policy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Medical & Regional Payment Disclaimer', href: '/disclaimer' },
        ]}
      />
      <AdSlot id="sitemap-page-bottom" format="horizontal-banner" />
    </div>
  );
}
