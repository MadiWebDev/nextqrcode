'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { primaryNav } from '@/config/site';

const directLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation. Adjusted during render (the
  // React-recommended pattern for resetting state when a value changes)
  // instead of cascading setState from an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="QR Code Tools logo"
            width={50}
            height={50}
            className="rounded-lg"
            priority
          />
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight">QR Code Tools</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              100% Client-Side Suite
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu viewport={false} className="mr-2">
            <NavigationMenuList>
              {primaryNav.map((group) => (
                <NavigationMenuItem key={group.title}>
                  <NavigationMenuTrigger className="h-auto bg-transparent text-xs text-muted-foreground hover:text-foreground px-2 py-1.5">
                    {group.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href={group.href}
                          className="block text-xs font-semibold px-2 py-1.5 rounded hover:bg-accent"
                        >
                          All {group.title}
                        </Link>
                      </NavigationMenuLink>
                      {group.links.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            href={link.href}
                            className="block text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              {directLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
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
          {primaryNav.map((group) => (
            <div key={group.title} className="space-y-1">
              <Link
                href={group.href}
                className="block text-[11px] font-bold text-foreground uppercase tracking-wider px-2 py-1 hover:text-primary"
              >
                {group.title}
              </Link>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="border-t border-border pt-3 space-y-1">
            {directLinks.map((link) => (
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
