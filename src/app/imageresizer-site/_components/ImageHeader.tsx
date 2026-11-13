'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Expand, Menu, X } from 'lucide-react';

/**
 * Nav grows with the registry: a link is only added here once its route
 * actually exists (no dead links in production navigation — master prompt
 * Phase 15). Phase B added the essential tools; later phases extend this.
 */
const NAV_LINKS = [
  { href: '/resize-image', label: 'Resize' },
  { href: '/compress-image', label: 'Compress' },
  { href: '/crop-image', label: 'Crop' },
  { href: '/image-converter', label: 'Convert' },
  { href: '/image-editor', label: 'Editor' },
  { href: '/bulk-image-resizer', label: 'Bulk Tools' },
  { href: '/guides', label: 'Guides' },
  { href: '/#faq', label: 'FAQ' },
];

export function ImageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="imageresizer-nav sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Image Resizer — home">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark served from /public */}
            <img src="/imageresizer-logo.svg" alt="" width={40} height={40} className="w-10 h-10" />
            <span className="leading-tight">
              <span className="block font-bold text-base sm:text-lg">Image Resizer</span>
              <span className="block text-[11px] text-muted-foreground">by Free QR Code Tools</span>
            </span>
          </Link>

          <nav aria-label="Image Resizer site" className="hidden lg:flex items-center gap-6 text-sm ml-6">
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
              href="/#resize"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Expand className="w-4 h-4" />
              Start resizing
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Image Resizer site (mobile)" className="lg:hidden border-t border-border bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-medium text-foreground border-b border-border/60 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
