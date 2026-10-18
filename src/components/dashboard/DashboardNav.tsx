'use client';

/** Dashboard sidebar navigation with active-link highlighting. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCodeIcon, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/dashboard', label: 'My QR Codes', icon: QrCodeIcon, exact: true },
  { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon, exact: false },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard">
      <ul className="flex gap-1 sm:flex-col">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
