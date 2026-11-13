'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, PenLine, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#create', label: 'Create invoice' },
  { href: '/#tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/#faq', label: 'FAQ' },
];

export function InvoiceHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="invoice-nav sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Invoice Generator — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark served from /public */}
            <img src="/invoicegenerator.webp" alt="" width={40} height={40} className="w-10 h-10" />
            <span className="leading-tight">
              <span className="block font-bold text-base sm:text-lg">Invoice Generator</span>
              <span className="block text-[11px] text-muted-foreground">by QR Studio</span>
            </span>
          </Link>

          <nav aria-label="Invoice site" className="hidden md:flex items-center gap-6 text-sm ml-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/#create"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-4 h-4" />
              Create free invoice
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Invoice site (mobile)"
          className="md:hidden border-t border-border bg-background"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-medium border-b border-border/50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#create"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold"
            >
              <PenLine className="w-4 h-4" />
              Create free invoice
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
