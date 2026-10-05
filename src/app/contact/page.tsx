import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact QR Code Tools — Get in Touch',
  description:
    'Contact the QR Code Tools team. Report bugs, request features, or ask questions. We respond within 48 hours.',
  alternates: { canonical: 'https://freeqrcode.tools/contact' },
  openGraph: {
    title: 'Contact QR Code Tools — Get in Touch',
    description:
      'Contact the QR Code Tools team. Report bugs, request features, or ask questions. We respond within 48 hours.',
    url: 'https://freeqrcode.tools/contact',
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeqrcode.tools/' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://freeqrcode.tools/contact' },
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
          <li aria-current="page" className="text-foreground">Contact</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Contact QR Code Tools</h1>
      </header>

      {/* Intro */}
      <section className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Whether you&apos;ve spotted a bug, want to suggest a new QR type, have a question about a
          regional payment format, or just want to say hello — this is the right place. QR Code Tools is
          a solo project, so every message comes directly to the developer and every piece of
          feedback genuinely shapes what gets built next.
        </p>
        <p>
          You&apos;re welcome to ask about anything on the site: how a specific QR type works, why a
          barcode checksum is failing, whether a payment spec is supported, or how the Medical ID
          tool handles data storage (short answer: it doesn&apos;t — everything stays in the QR code
          itself). Accessibility-related feedback is especially valued and will always be
          prioritised.
        </p>
      </section>

      {/* Response time */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Response Time</h2>
        <p className="text-muted-foreground leading-relaxed">
          Messages are typically answered within 48 hours on weekdays (Monday to Friday, Pakistan
          Standard Time). During busy periods response may take a little longer, but every message
          gets a reply. If you need to report a security vulnerability, please use the security
          address below and mark your message &apos;Security&apos; in the subject line — these are treated
          as urgent.
        </p>
      </section>

      {/* Before you write */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Before You Write</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          A quick check in two places might save you waiting for a reply:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
          <li>
            The <a href="/about" className="text-primary hover:underline">About page FAQ</a> covers
            the most common questions about privacy, data storage, offline use, and commercial rights.
          </li>
          <li>
            The <a href="/blog" className="text-primary hover:underline">Blog</a> has step-by-step
            guides for individual QR types and printing best practices.
          </li>
          <li>
            Each tool page includes a dedicated FAQ section that answers usage questions specific to
            that tool.
          </li>
        </ul>
      </section>

      {/* Direct email addresses */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Direct Email Addresses</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you prefer to email directly without using the form below, use the address that matches
          your enquiry:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left font-semibold p-2 border-b border-border">Enquiry type</th>
                <th className="text-left font-semibold p-2 border-b border-border">Email address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-border/50 text-muted-foreground">General questions &amp; feature requests</td>
                <td className="p-2 border-b border-border/50">
                  <a href="mailto:contact@freeqrcode.tools" className="text-primary hover:underline">
                    contact@freeqrcode.tools
                  </a>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Privacy &amp; GDPR requests</td>
                <td className="p-2 border-b border-border/50">
                  <a href="mailto:privacy@freeqrcode.tools" className="text-primary hover:underline">
                    privacy@freeqrcode.tools
                  </a>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-border/50 text-muted-foreground">Security vulnerabilities</td>
                <td className="p-2 border-b border-border/50">
                  <a href="mailto:security@freeqrcode.tools" className="text-primary hover:underline">
                    security@freeqrcode.tools
                  </a>
                </td>
              </tr>
              <tr>
                <td className="p-2 text-muted-foreground">Legal &amp; terms enquiries</td>
                <td className="p-2">
                  <a href="mailto:legal@freeqrcode.tools" className="text-primary hover:underline">
                    legal@freeqrcode.tools
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What to include */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">What to Include</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-xl font-semibold mb-3 text-foreground">For bug reports</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
              <li>Your browser and version (e.g. Chrome 125)</li>
              <li>Operating system (Windows, macOS, iOS, Android)</li>
              <li>The QR type you were using</li>
              <li>Steps to reproduce the issue</li>
              <li>What you expected vs. what happened</li>
              <li>A screenshot if possible</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-xl font-semibold mb-3 text-foreground">For feature requests</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
              <li>Describe the use case, not just the feature name</li>
              <li>Who would benefit (businesses, individuals, a specific region)</li>
              <li>Any relevant spec or standard (e.g. an official payment format document)</li>
              <li>How you currently work around the missing feature</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Send a Message</h2>
        <p className="text-muted-foreground text-sm mb-6">
          The form below opens your mail client with the message pre-filled. No account or
          third-party service needed — your message goes directly by email.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
