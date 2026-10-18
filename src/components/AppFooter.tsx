import Link from 'next/link';
import { footerNav } from '@/config/site';

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t border-border mt-10">
      <nav
        aria-label="Footer"
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {footerNav.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-foreground mb-3">{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block mb-1.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© {year} QR Studio by codexengr. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
            Cookie Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
