import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OnboardingTour } from '@/components/OnboardingTour';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { CookieConsent } from '@/components/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Free QR Code Generator — QR Studio',
    template: '%s | QR Studio',
  },
  description: 'Create beautiful, custom QR codes for free. 40+ types, custom colors, logo upload. Download PNG, SVG, PDF instantly. No sign-up needed.',
  metadataBase: new URL('https://freeqrcode.tools'),
  openGraph: {
    type: 'website',
    siteName: 'QR Studio',
    url: 'https://freeqrcode.tools',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider delayDuration={300}>
            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-background px-4 py-2 rounded-lg border border-border text-sm font-medium"
            >
              Skip to content
            </a>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
              <AppHeader />
              <main id="main-content">
                {children}
              </main>
              <AppFooter />
            </div>
            <Toaster position="bottom-right" richColors />
            <OnboardingTour />
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
