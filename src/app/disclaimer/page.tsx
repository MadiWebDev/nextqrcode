import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer — QR Studio',
  description:
    'QR Studio disclaimer. Our tools are for informational purposes. Medical ID QR codes are not a substitute for professional medical advice.',
  alternates: { canonical: 'https://qrstudio.app/disclaimer' },
  openGraph: {
    title: 'Disclaimer — QR Studio',
    description:
      'QR Studio disclaimer covering medical ID tools, payment QR codes, external links, and advertising.',
    url: 'https://qrstudio.app/disclaimer',
  },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://qrstudio.app/' },
      { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: 'https://qrstudio.app/disclaimer' },
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
          <li aria-current="page" className="text-foreground">Disclaimer</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: <time dateTime="2026-10-05">October 5, 2026</time>
        </p>
      </header>

      {/* General */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">General Disclaimer</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The information and tools provided on QR Studio (qrstudio.app) are for informational
            and practical purposes only. All tools are provided &quot;as is&quot; and &quot;as available&quot; without
            any warranty of accuracy, completeness, fitness for a particular purpose, or
            non-infringement. Your use of any tool on this site is entirely at your own risk.
          </p>
          <p>
            While we make every effort to ensure the tools generate correct output, we cannot
            guarantee that QR codes, barcodes, or other outputs will function correctly in every
            context, device, or printing environment. You are responsible for testing all generated
            outputs before using them in production.
          </p>
        </div>
      </section>

      {/* Medical ID */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Medical ID QR Code</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The Medical ID QR tool is provided for informational convenience only. It is
            <strong className="text-foreground"> not a substitute for professional medical advice</strong>,
            diagnosis, treatment, or an official medical alert system. The presence of a Medical ID
            QR code does not guarantee that emergency responders will scan it, that scanning devices
            will be available at the scene, or that the encoded information will be acted upon.
          </p>
          <p>
            Users are solely responsible for the accuracy, completeness, and currency of the medical
            information they encode. QR Studio makes no representations regarding whether emergency
            medical personnel in any jurisdiction will use, recognise, or have the ability to read
            QR-based medical ID information.
          </p>
          <p>
            <strong className="text-foreground">Always carry a physical medical ID as backup.</strong>{' '}
            A printed card, a medical alert bracelet, or a wristband containing your critical
            information remains the safest and most universally recognised approach in an emergency.
          </p>
        </div>
      </section>

      {/* Payment QR */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Payment QR Codes</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Payment QR codes generated on QR Studio (UPI, Raast, JazzCash, Easypaisa) follow
            publicly available format specifications for each payment scheme. However, QR Studio
            is not an official application, is not affiliated with, endorsed by, or certified by
            NPCI (National Payments Corporation of India), the State Bank of Pakistan, Jazz
            (Veon), Telenor Pakistan, or any other payment operator or financial regulator.
          </p>
          <p>
            We do not guarantee that all receiving apps, point-of-sale terminals, or banking
            applications will correctly parse every field in a generated payment QR code.
            <strong className="text-foreground"> Always verify payment amounts and recipient
            details before completing any transaction.</strong> QR Studio is not responsible for
            payment errors, incorrect transfers, or financial losses arising from the use of
            payment QR codes generated on this site.
          </p>
        </div>
      </section>

      {/* QR Scannability */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">QR Code Scannability</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR Studio does not guarantee that every generated QR code will be scannable in all
          environments, lighting conditions, or by all QR scanning apps. Factors outside our
          control — including print quality, surface texture, material reflectivity, camera
          quality, and environmental lighting — can affect scannability. The user is responsible
          for testing QR codes in their intended deployment environment before distribution or
          publication.
        </p>
      </section>

      {/* External Links */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">External Links</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR Studio may contain links to third-party websites for reference and convenience. These
          links do not constitute an endorsement of those sites&apos; content, products, or services.
          We do not control and are not responsible for the privacy practices, content accuracy, or
          availability of any external site. You access external links at your own risk.
        </p>
      </section>

      {/* No Warranty */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">No Warranty</h2>
        <p className="text-muted-foreground leading-relaxed">
          To the maximum extent permitted by applicable law, QR Studio and its operator (codexengr)
          expressly disclaim all warranties, express or implied, including but not limited to implied
          warranties of merchantability, fitness for a particular purpose, and non-infringement. We
          do not warrant that the service will be uninterrupted, error-free, or free of harmful
          components. The entire risk arising from use of the service remains with you.
        </p>
      </section>

      {/* Affiliate / Advertising */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Affiliate and Advertising Disclosure</h2>
        <p className="text-muted-foreground leading-relaxed">
          This site may display Google AdSense advertisements. We do not personally endorse
          advertised products or services. Advertisements are served by Google and are not
          hand-selected by QR Studio. Ad placement is designed to clearly separate advertising
          content from tool interfaces.
        </p>
      </section>

      {/* Changes */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Disclaimer</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this disclaimer at any time. Changes will be reflected in the &quot;Last
          updated&quot; date above. Continued use of QR Studio after a change constitutes acceptance
          of the updated disclaimer.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Legal enquiries:{' '}
          <a href="mailto:legal@qrstudio.app" className="text-primary hover:underline">
            legal@qrstudio.app
          </a>
        </p>
      </section>
    </div>
  );
}
