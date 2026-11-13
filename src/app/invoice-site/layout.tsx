import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { InvoiceFooter } from './_components/InvoiceFooter';
import { InvoiceHeader } from './_components/InvoiceHeader';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Create Professional Invoices Online',
  description:
    'Create professional invoices for free — no sign-up, no watermark. Customize templates, calculate taxes, track payments, add a payment QR and download PDF invoices.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/' },
  openGraph: {
    title: 'Free Invoice Generator — Create Professional Invoices Online',
    description:
      'Create professional invoices for free — no sign-up, no watermark. Customize templates, calculate taxes, track payments, add a payment QR and download PDF invoices.',
    url: 'https://invoicegenerator.freeqrcode.tools/',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — Create Professional Invoices Online',
    description:
      'Create professional invoices for free — no sign-up, no watermark. Customize templates, calculate taxes, track payments, add a payment QR and download PDF invoices.',
  },
  robots: { index: true, follow: true },
  // The invoice site's own brand identity (overrides the root layout's QR
  // logo icons for invoice-site routes only; the main site is unaffected).
  icons: {
    icon: [{ url: '/invoice-logo.svg', type: 'image/svg+xml' }],
    shortcut: '/invoice-logo.svg',
  },
};

/**
 * The invoice site's own chrome. The main site's AppHeader / AppFooter are
 * hidden on these pages by the :has() rule in src/app/globals.css — the
 * rule lives in that external stylesheet because the inline <style> version
 * shipped here before was blocked by the site's nonce-based CSP.
 */
export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="invoice-site-root">
      <InvoiceHeader />
      {children}
      <InvoiceFooter />
    </div>
  );
}
