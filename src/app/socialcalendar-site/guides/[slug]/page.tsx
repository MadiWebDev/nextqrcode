import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { GUIDES, type Guide } from '../../_data/guides';

const BASE = 'https://socialcalendar.freeqrcode.tools';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `${BASE}/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${BASE}/guides/${guide.slug}`,
      type: 'article',
      siteName: 'Social Media Calendar',
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description },
  };
}

function guideJsonLd(guide: Guide) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.h1,
      description: guide.description,
      dateModified: guide.updatedAt,
      mainEntityOfPage: `${BASE}/guides/${guide.slug}`,
      author: { '@type': 'Organization', name: 'Social Media Calendar' },
      publisher: { '@type': 'Organization', name: 'Social Media Calendar' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE}/guides` },
        { '@type': 'ListItem', position: 3, name: guide.h1, item: `${BASE}/guides/${guide.slug}` },
      ],
    },
  ];
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();
  const related = GUIDES.filter((g) => guide.related.includes(g.slug));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(guide)) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> {' / '}
        <Link href="/guides" className="hover:underline">Guides</Link> {' / '}
        <span aria-current="page">{guide.h1}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{guide.h1}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated {guide.updatedAt}</p>
      {guide.intro.map((p) => (
        <p key={p.slice(0, 32)} className="mt-4 leading-relaxed">
          {p}
        </p>
      ))}

      {guide.sections.map((section, i) => (
        <section key={section.heading} aria-labelledby={`s-${i}`}>
          <h2 id={`s-${i}`} className="mt-8 text-xl font-semibold">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="mt-3 leading-relaxed">
              {p}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-3 list-inside list-disc space-y-1">
              {section.bullets.map((b) => (
                <li key={b.slice(0, 32)}>{b}</li>
              ))}
            </ul>
          )}
          {i === 1 && (
            <div className="my-6">
              <AdSlot id={`socialcalendar-guide-${guide.slug}`} format="horizontal-banner" />
            </div>
          )}
        </section>
      ))}

      <section aria-labelledby="guide-faq" className="mt-10">
        <h2 id="guide-faq" className="text-xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-4">
          {guide.faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-primary/40 bg-card p-5">
        <h2 className="font-semibold">Put it into practice</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The free Social Media Calendar workspace runs this exact method — pillars with target
          percentages, gap detection, batch planning and exports — with everything stored locally
          in your browser.
        </p>
        <Link
          href="/app"
          className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Open the workspace
        </Link>
      </section>

      {related.length > 0 && (
        <nav aria-label="Related guides" className="mt-10">
          <h2 className="text-lg font-semibold">Related guides</h2>
          <ul className="mt-3 space-y-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="font-medium text-primary underline">
                  {g.h1}
                </Link>
                <span className="text-sm text-muted-foreground"> — {g.description}</span>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
