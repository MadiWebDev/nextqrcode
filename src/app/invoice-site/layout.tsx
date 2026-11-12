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
 * The platform root layout renders the main site's AppHeader (<header>) and
 * AppFooter (<footer>) as DIRECT children of the same wrapper <div> that
 * holds <main>, and invoice pages live inside that <main>. The invoice site
 * ships its own chrome (InvoiceHeader / InvoiceFooter below), so this rule
 * hides the main site's header/footer — but only on invoice pages, and only
 * the wrapper's direct children. The invoice site's own header/footer are
 * rendered inside <main>, never as direct children of that wrapper, so this
 * selector can never hide them.
 */
const hideMainSiteChromeCss = `
/* Layer 1 — structural (every browser): this style block only exists on
   invoice-site pages, and there the only direct-child <header>/<footer> of a
   body-level wrapper <div> are the platform's AppHeader/AppFooter. The
   invoice site's own header/footer live inside <main> (deeper nesting), and
   are additionally protected by the :not() guards. */
body > div > header:not(.invoice-nav), body > div > footer:not(.invoice-foot) { display: none !important; }
/* Layer 2 — the AppHeader's utility-class signature, as a fallback. */
header.sticky.top-0.z-50:not(.invoice-nav) { display: none !important; }
/* Layer 3 — relational: wrapper divs that contain <main> with the invoice
   root give up their direct-child header/footer. */
div:has(> main .invoice-site-root) > header, div:has(> main .invoice-site-root) > footer { display: none !important; }
`;

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{hideMainSiteChromeCss}</style>
      <div className="invoice-site-root">
        <InvoiceHeader />
        {children}
        <InvoiceFooter />
      </div>
    </>
  );
}
