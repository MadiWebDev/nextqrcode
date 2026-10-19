/**
 * Sanitized JSON-LD script component.
 *
 * Renders schema.org structured data as `application/ld+json`. Per the Next.js
 * docs, `JSON.stringify` output is scrubbed of `<` (as \u003c) to prevent
 * XSS via injected closing script tags.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** BreadcrumbList JSON-LD from a trail of { name, url } (urls are paths). */
export function BreadcrumbJsonLd({
  trail,
  baseUrl,
}: {
  trail: { name: string; url: string }[];
  baseUrl: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`,
        })),
      }}
    />
  );
}

/** WebPage JSON-LD for indexable content pages. Only rendered when the page is indexed. */
export function WebPageJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name,
        url,
        description,
      }}
    />
  );
}

/**
 * DefinedTerm JSON-LD for glossary entries. `name` must be the term shown on
 * the page and `description` the definition shown on the page.
 * `inDefinedTermSet` links the term to the visible glossary index page.
 */
export function DefinedTermJsonLd({
  name,
  description,
  url,
  inDefinedTermSet,
}: {
  name: string;
  description: string;
  url: string;
  inDefinedTermSet: { name: string; url: string };
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name,
        description,
        url,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: inDefinedTermSet.name,
          url: inDefinedTermSet.url,
        },
      }}
    />
  );
}
