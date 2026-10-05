import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — QR Code Tools',
  description:
    'Learn what cookies QR Code Tools uses, why, and how to manage or delete them in your browser.',
  alternates: { canonical: 'https://freeqrcode.tools/cookie-policy' },
  openGraph: {
    title: 'Cookie Policy — QR Code Tools',
    description: 'Learn what cookies QR Code Tools uses, why, and how to manage or delete them in your browser.',
    url: 'https://freeqrcode.tools/cookie-policy',
  },
};

export default function CookiePolicyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeqrcode.tools/' },
      { '@type': 'ListItem', position: 2, name: 'Cookie Policy', item: 'https://freeqrcode.tools/cookie-policy' },
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
          <li aria-current="page" className="text-foreground">Cookie Policy</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: <time dateTime="2026-10-05">October 5, 2026</time>
        </p>
      </header>

      {/* What are cookies */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">What Are Cookies?</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Cookies are small text files that a website stores on your device when you visit. They
            allow the site to remember information about your visit — such as your preferred
            language or login state — so you don&apos;t have to re-enter it on your next visit. Cookies
            are widely used to make websites work more efficiently and to provide information to site
            owners.
          </p>
          <p>
            QR Code Tools uses browser <strong className="text-foreground">localStorage</strong> for
            essential preferences rather than traditional cookies. localStorage stores data directly
            on your device and is never transmitted to any server during normal browsing. The
            distinction matters: localStorage data stays local unless JavaScript code explicitly
            sends it elsewhere — and no QR Code Tools code does that. Third-party advertising and
            analytics platforms (Google) may set traditional cookies if you give consent via the
            banner at the bottom of the page.
          </p>
        </div>
      </section>

      {/* Cookie table */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left font-semibold p-2 border-b border-border">Name</th>
                <th className="text-left font-semibold p-2 border-b border-border">Type</th>
                <th className="text-left font-semibold p-2 border-b border-border">Purpose</th>
                <th className="text-left font-semibold p-2 border-b border-border">Duration</th>
                <th className="text-left font-semibold p-2 border-b border-border">Provider</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border/50 font-mono text-xs">qrs_cookie_consent</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Necessary</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Stores your cookie consent choice</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Persistent (localStorage)</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">QR Code Tools</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 font-mono text-xs">qrs_theme</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Necessary</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Stores your colour theme preference</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Persistent (localStorage)</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">QR Code Tools</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 font-mono text-xs">_ga</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Analytics</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google Analytics visitor ID (not yet active)</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">2 years</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 font-mono text-xs">_ga_*</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Analytics</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google Analytics session data (not yet active)</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">1 year</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 font-mono text-xs">NID, IDE, DSID</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Advertising</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google AdSense ad personalisation (not yet active)</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">6–13 months</td>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Google</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-xs">ar_debug</td>
                <td className="p-2 text-muted-foreground">Advertising</td>
                <td className="p-2 text-muted-foreground">Google AdSense ad serving (not yet active)</td>
                <td className="p-2 text-muted-foreground">Session</td>
                <td className="p-2 text-muted-foreground">Google</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How to control cookies */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">How to Control Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          You can control and delete cookies and localStorage data using your browser settings.
          Note that disabling all cookies may affect site functionality (for example, your theme
          preference will reset on each visit).
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Google Chrome</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Open Settings → Privacy and security → Cookies and other site data. You can delete
              all cookies, or use the search field to remove cookies from freeqrcode.tools specifically.
              For localStorage, open DevTools (F12) → Application → Local Storage.{' '}
              <a
                href="https://support.google.com/chrome/answer/95647"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome cookie help
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Mozilla Firefox</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Open Settings → Privacy &amp; Security → Cookies and Site Data → Manage Data. Search for
              freeqrcode.tools and remove its data. For localStorage, use DevTools (F12) →
              Storage → Local Storage.{' '}
              <a
                href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox cookie help
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Apple Safari</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Open Preferences → Privacy → Manage Website Data. Search for freeqrcode.tools and click
              Remove. On iOS: Settings → Safari → Advanced → Website Data.{' '}
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari cookie help
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Microsoft Edge</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Open Settings → Cookies and site permissions → Manage and delete cookies and site data.
              Click &quot;See all cookies and site data&quot; and filter by freeqrcode.tools.{' '}
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Edge cookie help
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Opting out */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Opting Out of Advertising Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          You can opt out of personalised advertising from Google and other participating ad
          networks using the links below. These opt-outs use their own cookies to remember your
          preference, so do not delete cookies after opting out.
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Google Ad Settings
            </a>
            {' '}— manage Google personalised advertising
          </li>
          <li>
            <a href="https://optout.networkadvertising.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              NAI opt-out
            </a>
            {' '}— Network Advertising Initiative opt-out
          </li>
          <li>
            <a href="https://optout.aboutads.info" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              DAA opt-out
            </a>
            {' '}— Digital Advertising Alliance opt-out
          </li>
        </ul>
      </section>

      {/* Changes */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Cookie Policy when we add new cookies or change our use of existing
          ones. Changes will be reflected by an updated &quot;Last updated&quot; date. Continued use of QR
          Studio after a change constitutes acceptance of the updated policy.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Questions about this Cookie Policy:{' '}
          <a href="mailto:privacy@freeqrcode.tools" className="text-primary hover:underline">
            privacy@freeqrcode.tools
          </a>
        </p>
      </section>
    </div>
  );
}
