import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — QR Studio',
  description: 'QR Studio privacy policy. All QR generation happens in your browser — no data is ever sent to our servers.',
  alternates: { canonical: 'https://qrstudio.app/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm">Last updated: October 2026</p>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Data we collect</h2>
        <p>QR Studio generates all QR codes entirely in your browser using JavaScript. No QR content, URLs, contact details, WiFi passwords, or any other data you enter into the generator is ever transmitted to our servers.</p>
        <p>We collect anonymised analytics (page views, country, device type) via privacy-friendly tooling with no personal identifiers stored.</p>
      </section>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Cookies</h2>
        <p>We use localStorage (not cookies) to remember your last QR type selection and theme preference. This data never leaves your device.</p>
      </section>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Contact</h2>
        <p>Questions? Email <a href="mailto:privacy@qrstudio.app" className="text-primary hover:underline">privacy@qrstudio.app</a>.</p>
      </section>
    </div>
  );
}
