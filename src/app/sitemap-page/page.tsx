import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Full Site Index & Directory — QR Code Tools',
  description: 'Full sitemap of QR Code Tools. Browse all 15 optical engineering tools, generators, technical guides, and standards.',
  alternates: { canonical: 'https://freeqrcode.tools/sitemap-page' },
  robots: { index: true, follow: true },
};

function SitemapSection({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
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
        <h1 className="text-3xl font-extrabold tracking-tight">QR Code Tools Directory & Sitemap</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          A complete index of all 15 client-side QR and barcode engineering tools, generators, and research articles.
        </p>
      </header>

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
          { label: 'Regional Payment QR (Raast, JazzCash, Easypaisa, UPI)', href: '/pakistan-payment-qr' },
          { label: 'Avery Sticker Sheet Layout Printer', href: '/qr-sticker-sheet-printer' },
          { label: 'Pet Tag & Lost-and-Found QR', href: '/pet-tag-qr' },
          { label: 'Bulk vCard QR from CSV', href: '/bulk-vcard-qr' },
          { label: 'UTM Campaign QR Builder', href: '/utm-builder' },
          { label: 'QR Placement by Material Checklist', href: '/qr-placement-guide' },
          { label: '1D Barcode Generator with Checksum Validation', href: '/barcode-generator' },
        ]}
      />

      <SitemapSection
        heading="Core Static QR Generators"
        links={[
          { label: 'Free URL QR Code Generator', href: '/url-qr-code-generator' },
          { label: 'Instant WiFi QR Code Generator', href: '/wifi-qr-code-generator' },
          { label: 'Digital vCard 3.0 Generator', href: '/vcard-qr-code-generator' },
          { label: 'Direct WhatsApp Link QR', href: '/whatsapp-qr-code-generator' },
          { label: 'UPI Payment QR Generator', href: '/upi-qr-code-generator' },
          { label: 'Bitcoin & Crypto Address QR', href: '/bitcoin-qr-code-generator' },
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
    </div>
  );
}
