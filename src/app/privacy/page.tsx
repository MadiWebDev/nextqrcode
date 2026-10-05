import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — QR Code Tools',
  description:
    'QR Code Tools privacy policy. We generate all QR codes in your browser — no data is sent to servers. Learn how we use cookies and Google AdSense.',
  alternates: { canonical: 'https://freeqrcode.tools/privacy' },
  openGraph: {
    title: 'Privacy Policy — QR Code Tools',
    description:
      'QR Code Tools privacy policy. We generate all QR codes in your browser — no data is sent to servers.',
    url: 'https://freeqrcode.tools/privacy',
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeqrcode.tools/' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://freeqrcode.tools/privacy' },
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
          <li aria-current="page" className="text-foreground">Privacy Policy</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: <time dateTime="2026-10-05">October 5, 2026</time>
        </p>
      </header>

      {/* Introduction */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Introduction</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            QR Code Tools (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a free, browser-based QR code generation service
            operated by codexengr. This Privacy Policy explains what information we collect when you
            use freeqrcode.tools, how we use it, and your rights under applicable data protection laws
            including the EU General Data Protection Regulation (GDPR).
          </p>
          <p>
            This policy applies to all pages and tools on freeqrcode.tools. By using the site, you
            agree to the practices described here. If you do not agree, please stop using the site
            and clear any locally stored data using your browser settings.
          </p>
        </div>
      </section>

      {/* Data We Collect */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Data We Collect</h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Data You Enter into QR Tools</h3>
            <p>
              All QR codes are generated entirely inside your browser. Content you type into any
              QR generator — WiFi passwords, contact details, payment references, medical
              information, URLs — is processed by JavaScript running on your device. This data is
              never transmitted to our servers in any form. We have no technical capability to see,
              log, or store it.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Analytics Data</h3>
            <p>
              We may collect anonymous, aggregated analytics — page views, country of visit (derived
              from IP and immediately discarded), and broad device category (desktop/mobile/tablet).
              No personal identifiers, no fingerprinting, no tracking across sites. Analytics data
              is used solely to understand which tools are most useful and to prioritise development.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Server Log Data</h3>
            <p>
              Our hosting provider automatically records standard server logs containing your IP
              address, browser user-agent, request timestamp, and HTTP status code. These logs are
              used only for security monitoring and abuse prevention and are retained for a maximum
              of 30 days before automatic deletion.
            </p>
          </div>
        </div>
      </section>

      {/* Cookies and Local Storage */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies and Local Storage</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            QR Code Tools uses browser localStorage (not cookies) for essential preferences. The keys
            <code className="mx-1 px-1 py-0.5 rounded bg-muted text-sm">qrs_theme</code> (your
            colour scheme preference) and
            <code className="mx-1 px-1 py-0.5 rounded bg-muted text-sm">qrs_cookie_consent</code>{' '}
            (your cookie consent decision) are stored locally on your device. These values are
            never sent to a server and you can delete them at any time via your browser settings.
          </p>
          <p>
            If you accept analytics or advertising cookies via the consent banner, third-party
            cookies from Google may be set. These are described in detail in the{' '}
            <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.
            If you reject non-essential cookies, only the two localStorage keys listed above are used.
          </p>
        </div>
      </section>

      {/* Google AdSense */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Google AdSense and Advertising</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We participate in Google AdSense to display advertisements that help fund the free
            operation of QR Code Tools. Google may use cookies and web beacons to serve ads based on
            your prior visits to this website or other websites. This is subject to your cookie
            consent choice made via the banner.
          </p>
          <p>
            You can opt out of personalised advertising by visiting{' '}
            <a
              href="https://adssettings.google.com"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Ad Settings
            </a>
            {' '}or the{' '}
            <a
              href="https://optout.networkadvertising.org"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NAI opt-out page
            </a>
            . Google is listed as a third-party vendor under applicable privacy regulations
            including GDPR. We do not sell personal data. We do not use interest-based targeting
            beyond what Google&apos;s platform provides.
          </p>
          <p>
            Note: advertising is not yet active. When it becomes active, ad slots will be displayed
            in reserved, clearly marked areas that do not overlap with any tool interface or cause
            layout shift.
          </p>
        </div>
      </section>

      {/* Third-Party Vendors */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Third-Party Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left font-semibold p-2 border-b border-border">Vendor</th>
                <th className="text-left font-semibold p-2 border-b border-border">Purpose</th>
                <th className="text-left font-semibold p-2 border-b border-border">Status</th>
                <th className="text-left font-semibold p-2 border-b border-border">Opt-out</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google Analytics</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Aggregate page-view analytics</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Not yet active</td>
                <td className="p-2 border-b border-border/50">
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Opt out</a>
                </td>
              </tr>
              <tr>
                <td className="p-2 text-muted-foreground">Google AdSense</td>
                <td className="p-2 text-muted-foreground">Display advertising</td>
                <td className="p-2 text-muted-foreground">Not yet active</td>
                <td className="p-2">
                  <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Opt out</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How We Use Your Data */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">How We Use Your Data</h2>
        <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
          <li>Anonymous analytics data: to understand usage patterns and improve the tools.</li>
          <li>Server log data: to detect and prevent abuse, DDoS, and security threats.</li>
          <li>Advertising cookies (if consented): to display relevant advertisements that fund the free service.</li>
        </ul>
      </section>

      {/* Your Rights (GDPR) */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Rights (GDPR / EEA)</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>If you are located in the European Economic Area, you have the following rights:</p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li><strong className="text-foreground">Access:</strong> request a copy of personal data we hold about you.</li>
            <li><strong className="text-foreground">Rectification:</strong> request correction of inaccurate data.</li>
            <li><strong className="text-foreground">Erasure:</strong> request deletion of your data where no overriding legitimate interest applies.</li>
            <li><strong className="text-foreground">Restriction:</strong> request that we restrict processing of your data.</li>
            <li><strong className="text-foreground">Portability:</strong> receive your data in a structured, machine-readable format.</li>
            <li><strong className="text-foreground">Object:</strong> object to processing based on legitimate interests.</li>
            <li><strong className="text-foreground">Complaint:</strong> lodge a complaint with your national data protection supervisory authority.</li>
          </ul>
          <p>
            To exercise any of these rights, contact{' '}
            <a href="mailto:privacy@freeqrcode.tools" className="text-primary hover:underline">
              privacy@freeqrcode.tools
            </a>
            . Because we collect minimal data, many requests can be fulfilled immediately.
          </p>
        </div>
      </section>

      {/* Data Retention */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">
          Server log data is retained for a maximum of 30 days and then permanently deleted.
          localStorage data is stored on your device and is entirely within your control — delete
          it at any time via your browser settings. We do not maintain any server-side database of
          user data.
        </p>
      </section>

      {/* Children */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Children&apos;s Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR Code Tools is not directed at children under 13. We do not knowingly collect any
          information from children. If you believe a child has submitted personal information via
          our contact form, please notify us at{' '}
          <a href="mailto:privacy@freeqrcode.tools" className="text-primary hover:underline">
            privacy@freeqrcode.tools
          </a>{' '}
          and we will delete it promptly.
        </p>
      </section>

      {/* Changes */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last
          updated&quot; date at the top of this page. Continued use of QR Code Tools after a policy change
          constitutes acceptance of the updated terms. We will not make material changes without
          providing reasonable notice via the site.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Privacy-related questions:{' '}
          <a href="mailto:privacy@freeqrcode.tools" className="text-primary hover:underline">
            privacy@freeqrcode.tools
          </a>
        </p>
      </section>
    </div>
  );
}
