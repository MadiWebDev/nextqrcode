import Link from 'next/link';
import { Lock } from 'lucide-react';

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { href: '/#create', label: 'Create invoice' },
      { href: '/#create', label: 'Dashboard' },
      { href: '/#features', label: 'Features' },
      { href: '/#templates', label: 'Templates' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { href: '/invoice-generator', label: 'Invoice Generator' },
      { href: '/quote-generator', label: 'Quote Generator' },
      { href: '/receipt-generator', label: 'Receipt Generator' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { href: '/invoice-for-freelancers', label: 'Invoices for Freelancers' },
      { href: '/invoice-for-small-business', label: 'Invoices for Small Business' },
      { href: '/invoice-for-contractors', label: 'Invoices for Contractors' },
      { href: '/vat-invoice-generator', label: 'VAT Invoice Generator' },
      { href: '/gst-invoice-generator', label: 'GST Invoice Generator' },
      { href: '/recurring-invoice-generator', label: 'Recurring Invoices' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export function InvoiceFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="invoice-foot border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark served from /public */}
              <img
                src="/invoice-logo.svg"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="leading-tight">
                <span className="block font-bold text-base">Invoice Generator</span>
                <span className="block text-[11px] text-muted-foreground">by QR Studio</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Create, send and track professional invoices in minutes — free forever, with no
              sign-up and no watermark on your PDFs.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Data stays in your browser — nothing is uploaded.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold tracking-wide">{col.heading}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
          <p>
            © {year} Invoice Generator by QR Studio · part of the{' '}
            <a
              href="https://freeqrcode.tools"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              freeqrcode.tools
            </a>{' '}
            family
          </p>
          <p className="sm:ml-auto">Free forever — no sign-up</p>
        </div>
      </div>
    </footer>
  );
}
