'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/app', label: 'Workspace' },
  { href: '/#features', label: 'Features' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/#faq', label: 'FAQ' },
];

export function SocialHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Social Media Calendar — home">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark served from /public */}
            <img src="/socialcalendar-logo.svg" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="leading-tight">
              <span className="block text-base font-bold sm:text-lg">Social Media Calendar</span>
              <span className="block text-[11px] text-muted-foreground">Private, local-first content planning</span>
            </span>
          </Link>
          <nav aria-label="Social Media Calendar site" className="ml-6 hidden items-center gap-6 text-sm lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/app"
              className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 sm:block"
            >
              Open the calendar
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile" className="border-t border-border py-3 lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="block rounded-md px-2 py-2 text-sm hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
