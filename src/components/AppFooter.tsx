import Link from 'next/link';

const toolLinks = [
  { label: 'QR Size Calculator', href: '/qr-size-calculator' },
  { label: 'WiFi Sign Generator', href: '/wifi-sign-generator' },
  { label: 'Barcode Generator', href: '/barcode-generator' },
  { label: 'UTM Builder', href: '/utm-builder' },
  { label: 'QR Safety Checker', href: '/qr-safety-checker' },
  { label: 'Medical ID QR', href: '/medical-id-qr' },
  { label: 'Pet Tag QR', href: '/pet-tag-qr' },
  { label: 'Pakistan Payment QR', href: '/pakistan-payment-qr' },
  { label: 'Bulk vCard QR', href: '/bulk-vcard-qr' },
];

const resourceLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Sitemap', href: '/sitemap-page' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-3">{heading}</p>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block mb-1.5"
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
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border/60 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn heading="Tools" links={toolLinks} />
          <FooterColumn heading="Resources" links={resourceLinks} />
          <FooterColumn heading="Legal" links={legalLinks} />
          <FooterColumn heading="Company" links={companyLinks} />
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p>
          © 2024–2025 QR Studio · All processing in-browser · No data stored · Built by{' '}
          <span className="font-medium text-foreground">codexengr</span>
        </p>
        <p className="mt-1 space-x-3">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
