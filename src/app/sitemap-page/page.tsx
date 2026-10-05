import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap — QR Studio',
  description: 'Full sitemap of QR Studio. Browse all QR code generators, guides, and legal pages.',
  alternates: { canonical: 'https://qrstudio.app/sitemap-page' },
  robots: { index: false, follow: true },
};

function SitemapSection({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-foreground">{heading}</h2>
      <ul className="space-y-1.5 columns-1 sm:columns-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-primary hover:underline text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://qrstudio.app/' },
      { '@type': 'ListItem', position: 2, name: 'Sitemap', item: 'https://qrstudio.app/sitemap-page' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-foreground">Sitemap</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Sitemap</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          A complete listing of all pages and tools available on QR Studio.
        </p>
      </header>

      <SitemapSection
        heading="Tools"
        links={[
          { label: 'Home — QR Code Generator', href: '/' },
          { label: 'QR Size Calculator', href: '/qr-size-calculator' },
          { label: 'WiFi Sign Generator', href: '/wifi-sign-generator' },
          { label: 'Barcode Generator', href: '/barcode-generator' },
          { label: 'UTM Builder', href: '/utm-builder' },
          { label: 'QR Safety Checker', href: '/qr-safety-checker' },
          { label: 'Medical ID QR', href: '/medical-id-qr' },
          { label: 'Pet Tag QR', href: '/pet-tag-qr' },
          { label: 'Pakistan Payment QR', href: '/pakistan-payment-qr' },
          { label: 'Bulk vCard QR', href: '/bulk-vcard-qr' },
        ]}
      />

      <SitemapSection
        heading="QR Code Generators"
        links={[
          { label: 'URL QR Code Generator', href: '/url-qr-code-generator' },
          { label: 'WiFi QR Code Generator', href: '/wifi-qr-code-generator' },
          { label: 'vCard QR Code Generator', href: '/vcard-qr-code-generator' },
          { label: 'WhatsApp QR Code Generator', href: '/whatsapp-qr-code-generator' },
          { label: 'UPI QR Code Generator', href: '/upi-qr-code-generator' },
          { label: 'Bitcoin QR Code Generator', href: '/bitcoin-qr-code-generator' },
        ]}
      />

      <SitemapSection
        heading="Resources"
        links={[
          { label: 'Blog', href: '/blog' },
          { label: 'Sitemap', href: '/sitemap-page' },
        ]}
      />

      <SitemapSection
        heading="Legal & Info"
        links={[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Cookie Policy', href: '/cookie-policy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Disclaimer', href: '/disclaimer' },
        ]}
      />

      <SitemapSection
        heading="Company"
        links={[
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ]}
      />
    </div>
  );
}
