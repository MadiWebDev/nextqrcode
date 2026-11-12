import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { InvoiceFooter } from './_components/InvoiceFooter';
import { InvoiceHeader } from './_components/InvoiceHeader';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Professional Invoices in Minutes',
  description:
    'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/' },
  openGraph: {
    title: 'Free Invoice Generator — Professional Invoices in Minutes',
    description:
      'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
    url: 'https://invoicegenerator.freeqrcode.tools/',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — Professional Invoices in Minutes',
    description:
      'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
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
