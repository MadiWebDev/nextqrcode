import type { ReactNode } from 'react';

/**
 * Renders one or more JSON-LD objects as a single @graph script. Content
 * is built from real site data only (see _lib/schema).
 */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }): ReactNode {
  const payload = { '@context': 'https://schema.org', '@graph': graph };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify of our own structured data; no user input is involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
