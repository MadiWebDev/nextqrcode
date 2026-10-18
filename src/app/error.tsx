'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary. Rendered when a route segment throws.
 * Offers recovery (retry) and navigation — never a dead end.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-wrap">
      <div className="max-w-xl mx-auto text-center space-y-6 py-16">
        <p className="font-display text-6xl" aria-hidden="true">
          ⚠️
        </p>
        <h1 className="page-h1">Something went wrong</h1>
        <p className="page-prose">
          {siteConfig.name} hit an unexpected error while loading this page. Your QR data never
          leaves your browser, so nothing was lost — try again or head back home.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error reference: <code>{error.digest}</code>
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Still broken?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Report it
          </Link>
        </p>
      </div>
    </div>
  );
}
