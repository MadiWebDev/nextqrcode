'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Root error boundary — catches errors in the root layout itself.
 * Must be a client component and cannot use the root layout (it failed),
 * so it renders a complete minimal HTML shell.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#555' }}>
            QR Studio hit an unexpected error. Nothing you entered was sent anywhere — all
            processing happens in your browser.
          </p>
          {error.digest && <p style={{ fontSize: '0.75rem', color: '#888' }}>{error.digest}</p>}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginTop: '1.5rem',
            }}
          >
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
