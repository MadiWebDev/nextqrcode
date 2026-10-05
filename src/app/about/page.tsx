import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About QR Code Tools — Built by codexengr | Free Browser-Based QR Tools',
  description:
    'QR Code Tools is a free, privacy-first QR code generator built by codexengr. 40+ QR types, no sign-up, no server uploads. Learn our story and mission.',
  alternates: { canonical: 'https://freeqrcode.tools/about' },
  openGraph: {
    title: 'About QR Code Tools — Built by codexengr | Free Browser-Based QR Tools',
    description:
      'QR Code Tools is a free, privacy-first QR code generator built by codexengr. 40+ QR types, no sign-up, no server uploads.',
    url: 'https://freeqrcode.tools/about',
  },
};

export default function AboutPage() {
  const faqItems = [
    {
      question: 'Is QR Code Tools really free?',
      answer:
        'Yes, completely free forever. No sign-up, no premium tier, no watermarks. Every feature — custom colours, logo upload, SVG/PDF download — is available to everyone at no cost.',
    },
    {
      question: 'Do you store my QR code data?',
      answer:
        'Never. All QR codes are generated entirely in your browser using JavaScript. No data ever reaches our servers. Your WiFi passwords, contact details, payment references, and medical information stay on your device.',
    },
    {
      question: 'Can I use QR Code Tools QR codes commercially?',
      answer:
        'Absolutely. QR codes you generate belong entirely to you. Use them on business cards, product packaging, restaurant menus, event materials, or anywhere else you need without restriction.',
    },
    {
      question: 'What QR code size should I print?',
      answer:
        'A good rule of thumb is a minimum of 2 cm × 2 cm for indoor scanning at arm\'s length. For billboards or large-format print, use our QR Size Calculator to compute the exact dimensions based on your viewing distance and error-correction level.',
    },
    {
      question: 'Does QR Code Tools work offline?',
      answer:
        'After your first visit, QR Code Tools is fully functional offline. All QR generation logic is bundled into the page — there are no external API calls required at generation time.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeqrcode.tools/' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://freeqrcode.tools/about' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-foreground">About</li>
        </ol>
      </nav>

      {/* H1 */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">About QR Code Tools</h1>
      </header>

      {/* Author bio card */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 text-primary-foreground font-bold text-xl">
          C
        </div>
        <div>
          <p className="font-semibold text-foreground text-lg">codexengr</p>
          <p className="text-sm text-muted-foreground mb-2">Developer &amp; Designer</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I build tools that respect your privacy. QR Code Tools started as a personal project after
            frustration with paywalled generators that upload your data to servers you don&apos;t control.
            The goal was simple: every feature, free, in the browser, forever.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Our Story</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            QR Code Tools began out of genuine frustration. Every QR generator I tried in 2023 fell into
            one of three traps: a hard paywall for basic features like SVG export or transparent
            backgrounds, a mandatory sign-up that was really just an email harvesting exercise, or —
            most concerning — server-side generation that sent every WiFi password, personal contact,
            and payment reference to a third-party server you had never agreed to trust. For a tool
            handling data as sensitive as that, those choices felt wrong.
          </p>
          <p>
            The first version was a weekend project. I wanted to prove that a fully capable QR
            generator — custom colours, dot styles, eye shapes, logo embedding, multiple formats —
            could be built entirely client-side without any compromises on quality. The <code>qrcode</code>{' '}
            library handles the low-level matrix generation; everything else — styling, rendering,
            export — is handled by the browser. No server receives any input data, ever.
          </p>
          <p>
            Since that first version, QR Code Tools has grown to cover 40+ QR types and serve users
            internationally. The tools now include region-specific payment formats (UPI for India;
            Raast, JazzCash, and Easypaisa for Pakistan), multilingual WiFi sign generators with RTL
            support for Urdu and Arabic, bulk vCard generation for teams, and specialised formats like
            emergency medical ID cards and pet tag QR codes. Every new tool follows the same rule: if
            it touches your data, it stays in your browser.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The web works best when powerful tools are freely accessible to everyone — not gated
            behind subscriptions or monetised through surveillance. QR Code Tools&apos;s mission is to
            maintain a genuinely free, genuinely private QR toolset that professionals, small
            businesses, students, and individuals can rely on without compromising their data.
          </p>
          <p>
            Privacy-first means more than a checkbox in a settings panel. It means the architecture
            itself makes data collection structurally impossible: there is no backend service to log
            your inputs, no analytics SDK phoning home with your content, no account system to breach.
            No registration is required for any tool on this site, and that will never change.
          </p>
        </div>
      </section>

      {/* Technology */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">How It Works — Technology</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            QR Code Tools is built on Next.js 16 App Router with React 19 and TypeScript. The UI layer
            uses Tailwind CSS v4 (with CSS custom-property design tokens) and shadcn/ui for accessible,
            composable components. All QR generation uses the open-source <code>qrcode</code> npm
            package, running entirely inside a browser JavaScript context — not on any server.
          </p>
          <p>
            There is no backend QR generation API. When you configure a QR code and click download,
            the browser itself renders the QR matrix to a canvas element and exports it as PNG, SVG,
            or PDF using browser-native APIs. No data leaves the tab. The shareable-link feature
            encodes your complete design state into the URL query string — the server never sees the
            content, only the page request.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Key Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          {[
            '40+ QR code types: URL, vCard, WiFi, WhatsApp, UPI, Bitcoin, Raast, JazzCash, Easypaisa, SEPA, and more',
            'Custom colours, dot styles, eye shapes, and logo upload with live preview',
            'Download as PNG (standard or 4× HD), SVG, JPEG, or print-ready PDF',
            'Shareable link — your entire design state encoded in the URL, no account needed',
            'Offline-capable after first load — no external API calls at generation time',
            'WCAG 2.2 AA accessible with full keyboard navigation and screen-reader support',
            'Dark, light, and system theme with no flash on load',
            'No sign-up, no watermarks, no premium tier — every feature is free forever',
          ].map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why Trust Us */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Why Trust Us?</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All QR generation happens locally in your browser. You can verify this by opening your
            browser&apos;s network panel while generating a QR code — you will see no outbound request
            carrying your content. The architecture enforces privacy rather than relying on policy
            promises.
          </p>
          <p>
            The QR generation core uses the well-established open-source <code>qrcode</code> npm
            package, which is maintained by the community and auditable by anyone. Payment QR formats
            (UPI, Raast, JazzCash, Easypaisa) are implemented against each scheme&apos;s official
            published specification, and the implementation notes are documented on each tool&apos;s page.
          </p>
          <p>
            Medical ID data encoded with our Medical ID QR tool never leaves your device under any
            circumstances. There is no account system, no sync feature, and no server-side storage.
            The QR code itself contains everything — readable offline, by any standard QR scanner.
            We are GDPR-friendly by architecture, not just by policy.
          </p>
        </div>
      </section>

      {/* The Author */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">The Author</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            codexengr is an independent engineer focused on privacy-respecting developer tools and
            web applications. With experience across frontend systems, payment integrations, and
            international technical standards, the focus is on tools that work precisely to spec —
            including regional payment formats like UPI, Raast, JazzCash, and Easypaisa, and
            accessibility standards like WCAG 2.2 AA.
          </p>
          <p>
            QR Code Tools is maintained as a solo project. Feedback, bug reports, and feature requests
            are welcomed — see the <a href="/contact" className="text-primary hover:underline">Contact page</a> for
            how to get in touch.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-border/60 pb-5 last:border-0">
              <h3 className="text-xl font-semibold mb-3 text-foreground">{item.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get in Touch */}
      <section className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Get in Touch</h2>
        <p className="text-muted-foreground text-sm">
          Have a question, found a bug, or want to suggest a new tool?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Reach out on the Contact page
          </a>{' '}
          — we respond within 48 hours on weekdays.
        </p>
      </section>
    </div>
  );
}
