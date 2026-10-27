import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { auditVerdict } from '@/content/audit';
import { loadScanGuide } from '@/content/families/scan-guide';
import type { ContentEntry } from '@/content/schema';
import { BreadcrumbJsonLd, JsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/ads/AdSlot';

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return loadScanGuide().map((entry) => ({ slug: entry.slug }));
}

function getEntry(slug: string): ContentEntry | undefined {
  return loadScanGuide().find((entry) => entry.slug === slug);
}

function pageUrl(slug: string): string {
  return `${siteConfig.url}/scan-guide/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  const verdict = auditVerdict(`/scan-guide/${slug}`);
  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: pageUrl(slug) },
    robots: verdict.passed ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: pageUrl(slug),
      type: 'article',
    },
  };
}

/* Minimal local markdown → HTML renderer (no new dependencies).
 * Supports ##/### headings, **bold**, *italic*, `code`,
 * [text](https://url) links, and - / 1. lists. */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  return out;
}

function renderMarkdown(md: string): string {
  const html: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length > 0) {
      html.push(`<p>${renderInline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (list) {
      html.push(list === 'ul' ? '</ul>' : '</ol>');
      list = null;
    }
  };

  for (const rawLine of md.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('### ')) {
      flushPara();
      closeList();
      html.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara();
      closeList();
      html.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      continue;
    }
    const ulMatch = /^[-*]\s+(.+)$/.exec(line);
    if (ulMatch) {
      flushPara();
      if (list !== 'ul') {
        closeList();
        html.push('<ul>');
        list = 'ul';
      }
      html.push(`<li>${renderInline(ulMatch[1])}</li>`);
      continue;
    }
    const olMatch = /^\d+\.\s+(.+)$/.exec(line);
    if (olMatch) {
      flushPara();
      if (list !== 'ol') {
        closeList();
        html.push('<ol>');
        list = 'ol';
      }
      html.push(`<li>${renderInline(olMatch[1])}</li>`);
      continue;
    }
    if (line === '') {
      flushPara();
      closeList();
      continue;
    }
    closeList();
    para.push(line);
  }
  flushPara();
  closeList();
  return html.join('\n');
}

export default async function ScanGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const verdict = auditVerdict(`/scan-guide/${slug}`);
  const url = pageUrl(slug);
  const all = loadScanGuide();
  const related = entry.internalLinks
    .filter((link) => link.startsWith('/scan-guide/'))
    .map((link) => all.find((e) => `/scan-guide/${e.slug}` === link))
    .filter((e): e is ContentEntry => e !== undefined)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {verdict.passed && (
        <>
          <BreadcrumbJsonLd
            baseUrl={siteConfig.url}
            trail={[
              { name: 'Scan Guides', url: '/scan-guide' },
              { name: entry.h1, url: `/scan-guide/${entry.slug}` },
            ]}
          />
          <WebPageJsonLd name={entry.title} url={url} description={entry.metaDescription} />
        </>
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: entry.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Scan Guides', href: '/scan-guide' },
          { label: entry.h1, href: `/scan-guide/${entry.slug}` },
        ]}
      />
      <AdSlot
        slot={`scan-guide-${slug}-top`}
        format="leaderboard"
        eligible={verdict.passed}
      />

      <article>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{entry.h1}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          By {entry.author} · Last reviewed{' '}
          <time dateTime={entry.lastReviewed}>{entry.lastReviewed}</time>
        </p>

        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }}
        />

        {/* In-content ad slot — renders only on audit-passing pages */}
        <AdSlot
          slot={siteConfig.adsense.slotInContent}
          format="in-article"
          eligible={verdict.passed}
        />

        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {entry.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium">{faq.question}</dt>
                <dd className="mt-1 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {entry.sources.length > 0 && (
          <section className="mt-12" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-2xl font-semibold">
              Sources
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {entry.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

      <AdSlot
        slot={`scan-guide-${slug}-pre-related`}
        format="leaderboard"
        eligible={verdict.passed}
      />
        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold">
              Related scanning guides
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/scan-guide/${rel.slug}`}
                    className="block rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <span className="font-medium">{rel.h1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <AdSlot
        slot={`scan-guide-${slug}-bottom`}
        format="leaderboard"
        eligible={verdict.passed}
      />
    </main>
  );
}
