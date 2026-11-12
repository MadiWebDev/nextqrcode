import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { InvoiceFooter } from './_components/InvoiceFooter';
import { InvoiceHeader } from './_components/InvoiceHeader';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Create Professional Invoices Online',
  description:
    'Create, customize, download and track professional invoices for free — no sign-up. Save your business profile and clients, pick from ten templates, add tax and a payment QR, record payments and download a polished PDF in minutes.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/' },
  openGraph: {
    title: 'Free Invoice Generator — Create Professional Invoices Online',
    description:
      'Create, customize, download and track professional invoices for free — no sign-up. Save your business profile and clients, pick from ten templates, add tax and a payment QR, record payments and download a polished PDF in minutes.',
    url: 'https://invoicegenerator.freeqrcode.tools/',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — Create Professional Invoices Online',
    description:
      'Create, customize, download and track professional invoices for free — no sign-up. Save your business profile and clients, pick from ten templates, add tax and a payment QR, record payments and download a polished PDF in minutes.',
  },
  robots: { index: true, follow: true },
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
