'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const toolLinks = [
  { label: 'QR Size Calculator', href: '/qr-size-calculator' },
  { label: 'WiFi Sign Generator', href: '/wifi-sign-generator' },
  { label: 'Barcode Generator', href: '/barcode-generator' },
  { label: 'UTM Builder', href: '/utm-builder' },
  { label: 'QR Safety Checker', href: '/qr-safety-checker' },
  { label: 'Medical ID QR', href: '/medical-id-qr' },
  { label: 'Pet Tag QR', href: '/pet-tag-qr' },
  { label: 'Pakistan Payment QR', href: '/pakistan-payment-qr' },
  { label: 'Bulk vCard QR', href: '/bulk-vcard-qr' },
];

const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <QrCode className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight">QR Studio</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Free QR Code Generator</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-2">
            {/* Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
                  Tools <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {toolLinks.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="text-sm cursor-pointer">
                      {tool.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-background border-b border-border shadow-lg p-4 space-y-2 z-40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">Tools</p>
          {toolLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block text-sm text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors"
            >
              {tool.label}
            </Link>
          ))}
          <div className="border-t border-border/60 pt-2 mt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
