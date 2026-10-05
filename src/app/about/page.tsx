import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About QR Studio — Free QR Code Generator',
  description: 'QR Studio is a free, privacy-first QR code generator with 40+ types, advanced customization, and instant download. No sign-up, no data collection.',
  alternates: { canonical: 'https://qrstudio.app/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">About QR Studio</h1>
      </header>
      <section className="space-y-4 text-muted-foreground leading-relaxed">
        <p>QR Studio is a free, open-source QR code generator built for designers, marketers, developers, and businesses of all sizes. We believe creating professional QR codes should be fast, private, and completely free — with no sign-up required, no watermarks, and no data ever sent to a server. Every QR code is generated entirely inside your browser using JavaScript.</p>
        <p>We support 40+ QR code types, from everyday use cases like WiFi and vCard to specialised formats like UPI payment links, Bitcoin addresses, SEPA bank transfers, and Google Meet join links. Advanced customization options — custom colours, dot styles, eye shapes, logo embedding, and printable frames — make it easy to create branded QR codes that match your identity without expensive design software.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Key features</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            '40+ QR code types across Popular, Social, Payments, Business, and Utilities categories',
            'Custom dot styles, eye shapes, foreground/background colours, and logo upload',
            'Download as PNG (standard or 4× HD), SVG, JPEG, or print-ready PDF',
            'Shareable link — encodes your full design state into a URL you can bookmark or share',
            'WCAG 2.2 AA accessible with full keyboard navigation',
            'Dark, light, and system theme with no flash on load',
            'Works offline after first load — no external API calls',
          ].map((f, i) => (
            <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>{f}</li>
          ))}
        </ul>
      </section>
      <section className="text-sm text-muted-foreground">
        <p>Questions or feedback? Reach us at <a href="mailto:contact@qrstudio.app" className="text-primary hover:underline">contact@qrstudio.app</a>.</p>
      </section>
    </div>
  );
}
