'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { updateGoogleConsent } from '@/lib/gtag';

const CONSENT_KEY = 'qrs_cookie_consent';

export function CookieConsent() {
  // Initial render must match the server (which has no localStorage and
  // renders nothing): reading localStorage in the useState initializer made
  // the first client render differ from the SSR HTML on every first visit,
  // throwing a React hydration mismatch (#418) and forcing a full client
  // re-render of the page. The stored choice is applied in the mount effect
  // below instead — the banner still appears immediately after mount, with
  // its slide-up animation unchanged.
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored !== null) {
      // Sync Google Consent Mode with saved preference
      updateGoogleConsent(stored === 'accepted');
    }
    // Reveal (if no stored choice) and trigger the slide-up animation on the
    // next frame, after hydration has completed.
    const frame = requestAnimationFrame(() => {
      if (stored === null) setVisible(true);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function persist(choice: 'accepted' | 'rejected') {
    localStorage.setItem(CONSENT_KEY, choice);
    updateGoogleConsent(choice === 'accepted');
    window.dispatchEvent(new CustomEvent('qrs:consent-changed', { detail: choice }));
    setVisible(false);
  }

  function accept() {
    persist('accepted');
  }

  function reject() {
    persist('rejected');
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
