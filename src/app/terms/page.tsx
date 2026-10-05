import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — QR Studio',
  description:
    'QR Studio terms of service. Read our acceptable use policy, intellectual property rights, and limitation of liability.',
  alternates: { canonical: 'https://qrstudio.app/terms' },
  openGraph: {
    title: 'Terms of Service — QR Studio',
    description:
      'QR Studio terms of service: acceptable use, intellectual property, liability limits, and governing law.',
    url: 'https://qrstudio.app/terms',
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://qrstudio.app/' },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://qrstudio.app/terms' },
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
          <li aria-current="page" className="text-foreground">Terms of Service</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: <time dateTime="2026-10-05">October 5, 2026</time>
        </p>
      </header>

      {/* Acceptance */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Agreement to Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using QR Studio (qrstudio.app), you agree to be bound by these Terms of
          Service and our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          If you do not agree to these terms, please do not use the service. These terms apply to
          all visitors and users of the service. QR Studio is provided by codexengr, an independent
          developer.
        </p>
      </section>

      {/* Description of Service */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Description of Service</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR Studio provides a free, browser-based QR code generation toolset. All QR code
          generation happens entirely in your browser — no account is required, no input data is
          transmitted to or stored on our servers. The service includes QR code generators for 40+
          types, customisation options, download in multiple formats, and a suite of specialist
          tools (barcode generators, WiFi sign generators, payment QR generators, and others).
          Service availability is provided on a best-effort basis without any uptime guarantee.
        </p>
      </section>

      {/* Acceptable Use */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Use of the Service</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            You are permitted to use QR Studio for personal, commercial, and non-commercial purposes,
            free of charge. There is no restriction on the volume of QR codes you generate for
            legitimate purposes.
          </p>
          <p>The following uses are strictly prohibited:</p>
          <ul className="list-disc list-inside space-y-1.5 text-sm">
            <li>Generating QR codes that link to or encode illegal content under applicable law</li>
            <li>Creating phishing QR codes designed to deceive users into revealing credentials or payment information</li>
            <li>Distributing QR codes that deliver malware, ransomware, or other harmful software</li>
            <li>Using the service to impersonate another person, organisation, or brand in a misleading way</li>
            <li>Automated scraping or bulk downloading of the QR Studio application code or assets</li>
            <li>Attempting to circumvent any rate limiting, security measure, or access control on the service</li>
            <li>Encoding content that infringes the intellectual property rights of any third party</li>
          </ul>
          <p>
            We reserve the right to block access to users who appear to be using the service for
            prohibited purposes, though we have no technical ability to inspect the content you
            encode.
          </p>
        </div>
      </section>

      {/* Intellectual Property */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Intellectual Property</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            QR codes you generate using QR Studio belong entirely to you. We claim no rights over
            the output of the QR generation tools. You are free to use, reproduce, modify, and
            distribute generated QR codes without restriction.
          </p>
          <p>
            The QR Studio name, logo, site design, and all original written content on this site
            are the intellectual property of QR Studio / codexengr. You may not copy, reproduce,
            or resell the QR Studio platform, interface, or branding without express written
            permission. You may link to QR Studio from your own website without permission.
          </p>
          <p>
            You grant us no rights or licence to the data you input into QR generator tools. Your
            input data is processed locally in your browser and is never transmitted to or accessed
            by us.
          </p>
        </div>
      </section>

      {/* User Responsibilities */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">User Responsibilities</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            You are solely responsible for the content you choose to encode in QR codes generated
            with this service. This includes ensuring that the encoded content is accurate, lawful,
            and does not infringe any third-party rights.
          </p>
          <p>
            Before deploying any QR code for public use — on print materials, products, signage,
            or digital distribution — you are responsible for testing the QR code in your intended
            environment, on representative devices, and in the expected lighting conditions. QR
            Studio does not guarantee scannability in all scenarios.
          </p>
          <p>
            For payment QR codes, you are responsible for verifying that the amount, recipient
            identifier, and currency are correct before distributing or displaying the QR code.
            Always test payment QR codes with a live transaction before deploying them in a
            commercial setting.
          </p>
        </div>
      </section>

      {/* Disclaimer of Warranties */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Disclaimer of Warranties</h2>
        <p className="text-muted-foreground leading-relaxed">
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties,
          express or implied, including implied warranties of merchantability, fitness for a
          particular purpose, or non-infringement. We do not warrant that the service will be
          uninterrupted, error-free, or free from security vulnerabilities. We reserve the right
          to modify, suspend, or discontinue any part of the service at any time without notice.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Limitation of Liability</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            To the maximum extent permitted by applicable law, QR Studio and codexengr shall not
            be liable for any direct, indirect, incidental, special, consequential, or punitive
            damages arising from or related to your use of the service, even if we have been
            advised of the possibility of such damages.
          </p>
          <p>
            Without limiting the foregoing, we are specifically not liable for: QR code scan
            failures in emergency medical situations; financial losses arising from incorrect
            payment QR codes; damages resulting from QR codes being unreadable after printing;
            losses arising from reliance on the Medical ID QR tool in an emergency.
          </p>
          <p>
            See the <a href="/disclaimer" className="text-primary hover:underline">Disclaimer page</a> for
            additional specific limitations relating to Medical ID QR codes and payment QR codes.
          </p>
        </div>
      </section>

      {/* Third-Party Services */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR Studio may display Google AdSense advertisements. The display of these ads is governed
          by Google&apos;s own terms and privacy policies. We do not endorse the content of third-party
          advertisements. Google&apos;s use of advertising cookies is subject to your cookie consent
          choice. See the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{' '}
          <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> for details.
        </p>
      </section>

      {/* Governing Law */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms of Service are governed by and construed in accordance with the laws of
          Pakistan (Islamabad Capital Territory), without regard to its conflict of law provisions.
          Any dispute arising under or relating to these terms shall be subject to the exclusive
          jurisdiction of the courts of Islamabad, Pakistan.
        </p>
      </section>

      {/* Changes */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to These Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may revise these Terms of Service at any time. Changes will be effective immediately
          upon posting to this page with an updated &quot;Last updated&quot; date. Your continued use of
          QR Studio after any change constitutes acceptance of the revised terms. If you disagree
          with any revision, your remedy is to stop using the service.
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
