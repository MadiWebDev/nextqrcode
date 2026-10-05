import Link from 'next/link';

const diagnosticTools = [
  { label: 'QR Size & Distance Calculator', href: '/qr-size-calculator' },
  { label: 'QR Safety & Phishing Checker', href: '/qr-safety-checker' },
  { label: 'Printed-QR Quality Tester', href: '/printed-qr-tester' },
  { label: 'Damage & Error Simulator', href: '/error-correction-simulator' },
  { label: 'Material Placement Checklist', href: '/qr-placement-guide' },
];

const specialtyTools = [
  { label: 'WiFi Sign Maker (RTL Urdu/Arabic)', href: '/wifi-sign-generator' },
  { label: 'Emergency Medical ID QR', href: '/medical-id-qr' },
  { label: 'Pet Tag Lost & Found QR', href: '/pet-tag-qr' },
  { label: 'Pakistan Payment QR (Raast)', href: '/pakistan-payment-qr' },
  { label: '1D Barcode Checksum Generator', href: '/barcode-generator' },
];

const batchTools = [
  { label: 'Avery Sticker Sheet Printer', href: '/qr-sticker-sheet-printer' },
  { label: 'Bulk vCard from CSV', href: '/bulk-vcard-qr' },
  { label: 'Large-Data Splitter & Scanner', href: '/qr-splitter-scanner' },
  { label: 'Animated-QR Offline Transfer', href: '/animated-qr-transfer' },
  { label: 'UTM Campaign QR Builder', href: '/utm-builder' },
];

const resourceLinks = [
  { label: 'Engineering Guides & Blog', href: '/blog' },
  { label: 'How QR Codes Work', href: '/blog/how-qr-codes-work' },
  { label: 'Print Sizing & Distance Math', href: '/blog/qr-code-sizes-for-printing' },
  { label: 'Static vs Dynamic Codes', href: '/blog/static-vs-dynamic-qr-codes' },
  { label: 'HTML Sitemap', href: '/sitemap-page' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Medical & Payment Disclaimer', href: '/disclaimer' },
  { label: 'About Engineering Team', href: '/about' },
  { label: 'Contact & Support', href: '/contact' },
];

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">{heading}</p>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AppFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <FooterColumn heading="Diagnostics & Math" links={diagnosticTools} />
          <FooterColumn heading="Specialty Formats" links={specialtyTools} />
          <FooterColumn heading="Batch & Advanced" links={batchTools} />
          <FooterColumn heading="Guides & Standards" links={resourceLinks} />
          <FooterColumn heading="Legal & Trust" links={legalLinks} />
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p>
          © 2026 QR Code Tools · All decoding and encoding executes 100% client-side · Zero server telemetry.
        </p>
        <p className="mt-1 space-x-3">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
        </p>
      </div>
    </footer>
  );
}
