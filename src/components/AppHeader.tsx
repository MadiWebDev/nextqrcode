'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const toolCategories = [
  {
    category: 'Diagnostics & Calculators',
    tools: [
      { label: 'QR Size & Distance Calculator', href: '/qr-size-calculator' },
      { label: 'QR Safety & Phishing Checker', href: '/qr-safety-checker' },
      { label: 'Printed-QR Quality Tester', href: '/printed-qr-tester' },
      { label: 'Error-Correction Damage Simulator', href: '/error-correction-simulator' },
      { label: 'Placement by Material Guide', href: '/qr-placement-guide' },
    ],
  },
  {
    category: 'Specialty & Offline Generators',
    tools: [
      { label: 'Printable WiFi Signs (RTL Urdu/Arabic)', href: '/wifi-sign-generator' },
      { label: 'Emergency Medical ID QR Card', href: '/medical-id-qr' },
      { label: 'Pet Tag / Lost & Found QR', href: '/pet-tag-qr' },
      { label: 'Regional Payment QR (UPI / Raast)', href: '/pakistan-payment-qr' },
      { label: '1D Barcode Generator with Checksum', href: '/barcode-generator' },
    ],
  },
  {
    category: 'Batch & Data Transfer',
    tools: [
      { label: 'Avery Sticker Sheet Layout Printer', href: '/qr-sticker-sheet-printer' },
      { label: 'Bulk vCard QR from CSV', href: '/bulk-vcard-qr' },
      { label: 'Large-Data Splitter & Scanner', href: '/qr-splitter-scanner' },
      { label: 'Animated-QR Offline File Transfer', href: '/animated-qr-transfer' },
      { label: 'UTM Campaign QR Builder', href: '/utm-builder' },
    ],
  },
];

const navLinks = [
  { label: 'Guides & Standards', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <QrCode className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight">QR Code Tools</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">100% Client-Side Suite</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-2">
            {/* Mega Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
                  Tools ({toolCategories.flatMap((c) => c.tools).length}) <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2">
                {toolCategories.map((group, gIdx) => (
                  <div key={group.category}>
                    {gIdx > 0 && <DropdownMenuSeparator className="my-1.5" />}
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 px-2 py-1">
                      {group.category}
                    </DropdownMenuLabel>
                    {group.tools.map((tool) => (
                      <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href} className="text-xs cursor-pointer py-1 px-2 rounded-md hover:bg-muted">
                          {tool.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-background border-b border-border shadow-lg p-4 space-y-4 max-h-[85vh] overflow-y-auto z-40">
          {toolCategories.map((group) => (
            <div key={group.category} className="space-y-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
                {group.category}
              </p>
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="border-t border-border pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-xs font-medium text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors"
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
