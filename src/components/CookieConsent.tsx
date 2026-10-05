'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'qrs_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === null) {
      setVisible(true);
    }
    // Trigger slide-up animation after mount
    requestAnimationFrame(() => setMounted(true));
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-border/60 shadow-lg p-4 transition-transform duration-300 ${
        mounted ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          We use cookies for analytics and to serve relevant ads. By continuing you agree, or you
          can reject non-essential cookies.{' '}
          <Link href="/cookie-policy" className="text-primary hover:underline">
            Learn more
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            Accept All
          </Button>
          <Button variant="ghost" size="sm" onClick={reject}>
            Reject Non-Essential
          </Button>
        </div>
      </div>
    </div>
  );
}
