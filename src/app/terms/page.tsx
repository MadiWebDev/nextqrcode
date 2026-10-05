import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — QR Studio',
  description: 'QR Studio terms of service.',
  alternates: { canonical: 'https://qrstudio.app/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="text-muted-foreground text-sm">Last updated: October 2026</p>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Use of the service</h2>
        <p>QR Studio provides a free, browser-based QR code generator. You may use it for personal and commercial purposes. You must not use the service to generate QR codes that link to illegal, harmful, or malicious content.</p>
      </section>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Disclaimer</h2>
        <p>The service is provided &quot;as is&quot; without warranty of any kind. We are not liable for any damages arising from use of the service or QR codes generated through it.</p>
      </section>
      <section className="space-y-3 text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-bold text-foreground">Contact</h2>
        <p>Questions? Email <a href="mailto:legal@qrstudio.app" className="text-primary hover:underline">legal@qrstudio.app</a>.</p>
      </section>
    </div>
  );
}
