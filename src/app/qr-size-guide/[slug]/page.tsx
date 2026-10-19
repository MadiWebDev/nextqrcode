import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { loadSizeGuide } from '@/content/families/size-guide';
import { getAllSizeGuides, getSizeGuideBySlug } from '@/data/size-guides';
import { auditVerdict } from '@/content/audit';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd, BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/ads/AdSlot';

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return loadSizeGuide().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadSizeGuide().find((e) => e.slug === slug);
  if (!entry) {
    return { title: 'Size Guide Not Found' };
  }
  const url = `${siteConfig.url}/qr-size-guide/${slug}`;
  const verdict = auditVerdict(`/qr-size-guide/${slug}`);
  return {
    title: `${entry.title} | ${siteConfig.name}`,
    description: entry.metaDescription,
    alternates: { canonical: url },
    robots: verdict.passed ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      type: 'article',
      url,
    },
  };
}

/** Minimal markdown → HTML renderer for guide content (no new dependencies). */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineFormat(s: string): string {
  return s
    .replace(
      /`([^`]+?)`/g,
      '<code class="px-1 py-0.5 rounded bg-muted text-[0.85em] font-mono">$1</code>'
    )
    .replace(/\*\*([^*]+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>');
}

function markdownToHtml(md: string): string {
  const lines = escapeHtml(md).split('\n');
  const out: string[] = [];
  let listOpen: 'ul' | 'ol' | null = null;
  let inPre = false;
  const pre: string[] = [];

  const closeList = () => {
    if (listOpen === 'ul') out.push('</ul>');
    if (listOpen === 'ol') out.push('</ol>');
    listOpen = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith('```')) {
      if (inPre) {
        out.push(
          `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto my-4 font-mono">${pre.join('\n')}</pre>`
        );
        pre.length = 0;
        inPre = false;
      } else {
        closeList();
        inPre = true;
      }
      continue;
    }
    if (inPre) {
      pre.push(raw);
      continue;
    }
    if (line === '') {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      const hashes = heading[1] ?? '';
      const text = heading[2] ?? '';
      const tag = hashes.length >= 4 ? 'h3' : 'h2';
      const cls =
        tag === 'h3'
          ? 'text-lg font-semibold text-foreground mt-6 mb-2'
          : 'text-xl sm:text-2xl font-bold text-foreground mt-8 mb-4';
      out.push(`<${tag} class="${cls}">${inlineFormat(text)}</${tag}>`);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      if (listOpen !== 'ul') {
        closeList();
        out.push('<ul class="list-disc pl-6 space-y-1.5 my-3">');
        listOpen = 'ul';
      }
      out.push(`<li class="text-base leading-7">${inlineFormat(ul[1] ?? '')}</li>`);
      continue;
    }

    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ol) {
      if (listOpen !== 'ol') {
        closeList();
        out.push('<ol class="list-decimal pl-6 space-y-1.5 my-3">');
        listOpen = 'ol';
      }
      out.push(`<li class="text-base leading-7">${inlineFormat(ol[1] ?? '')}</li>`);
      continue;
    }

    closeList();
    out.push(`<p class="text-base leading-7 my-3">${inlineFormat(line)}</p>`);
  }

  closeList();
  if (inPre) {
    out.push(`<pre>${pre.join('\n')}</pre>`);
  }
  return out.join('\n');
}

export default async function SizeGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = loadSizeGuide().find((e) => e.slug === slug);
  const guide = getSizeGuideBySlug(slug);

  if (!entry || !guide) {
    notFound();
  }

  const verdict = auditVerdict(`/qr-size-guide/${slug}`);
  const url = `${siteConfig.url}/qr-size-guide/${slug}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const all = getAllSizeGuides();
  const idx = all.findIndex((g) => g.slug === slug);
  const related = [...all.slice(idx + 1), ...all.slice(0, idx)].slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <JsonLd data={faqJsonLd} />
      {verdict.passed && (
        <>
          <BreadcrumbJsonLd
            baseUrl={siteConfig.url}
            trail={[
              { name: 'Home', url: '/' },
              { name: 'QR Size Guides', url: '/qr-size-guide' },
              { name: entry.h1, url: `/qr-size-guide/${slug}` },
            ]}
          />
          <WebPageJsonLd name={entry.title} url={url} description={entry.metaDescription} />
        </>
      )}

      <Breadcrumbs
        items={[
          { label: 'QR Size Guides', href: '/qr-size-guide' },
          { label: entry.h1, href: `/qr-size-guide/${slug}` },
        ]}
      />

      <AdSlot
        slot={`qr-size-guide-${slug}-top`}
        format="leaderboard"
        eligible={verdict.passed}
      />

      <header className="mb-8 border-b border-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <span>{guide.useCase}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
          {entry.h1}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            By <span className="font-medium text-foreground/80">{entry.author}</span>
          </span>
          <span>
            Last reviewed: <time dateTime={entry.lastReviewed}>{entry.lastReviewed}</time>
          </span>
        </div>
      </header>

      {/* Spec table */}
      <section aria-label="Size specifications" className="mb-8">
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50">
                <th className="text-left font-semibold text-foreground px-5 py-3 w-40 align-top">
                  Recommended size
                </th>
                <td className="px-5 py-3 text-muted-foreground">
                  {guide.recommendedSizeMm} × {guide.recommendedSizeMm} mm (
                  {guide.recommendedSizeIn} × {guide.recommendedSizeIn} in)
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <th className="text-left font-semibold text-foreground px-5 py-3 w-40 align-top">
                  Typical scan distance
                </th>
                <td className="px-5 py-3 text-muted-foreground">
                  {guide.canonicalCalcParams.distanceCm} cm
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <th className="text-left font-semibold text-foreground px-5 py-3 w-40 align-top">
                  Substrate
                </th>
                <td className="px-5 py-3 text-muted-foreground">{guide.substrateMaterial}</td>
              </tr>
              <tr className="border-b border-border/50">
                <th className="text-left font-semibold text-foreground px-5 py-3 w-40 align-top">
                  Printing method
                </th>
                <td className="px-5 py-3 text-muted-foreground">{guide.printingMethod}</td>
              </tr>
              <tr>
                <th className="text-left font-semibold text-foreground px-5 py-3 w-40 align-top">
                  Key warnings
                </th>
                <td className="px-5 py-3 text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-1">
                    {guide.specificWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot
        slot={`qr-size-guide-${slug}-after-tool`}
        format="leaderboard"
        eligible={verdict.passed}
      />

      {/* Guide content */}
      <article className="text-slate-700 dark:text-slate-300 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(entry.content) }} />
      </article>

      {/* In-content ad slot — renders only on audit-passing pages */}
      <AdSlot
        slot={siteConfig.adsense.slotInContent}
        format="in-article"
        eligible={verdict.passed}
      />

      {/* FAQ */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {entry.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-base text-foreground mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      {entry.sources.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border/60">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Sources</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            {entry.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdSlot
        slot={`qr-size-guide-${slug}-pre-related`}
        format="leaderboard"
        eligible={verdict.passed}
      />

      {/* Related guides */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Related Size Guides</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/qr-size-guide/${r.slug}`}
              className="rounded-xl border border-border/70 bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="text-xs font-semibold text-primary mb-2">{r.useCase}</div>
              <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                {r.title}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {r.recommendedSizeMm} × {r.recommendedSizeMm} mm
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools CTA */}
      <section className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-foreground">
              Calculate the exact size for your project
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Plug in your scan distance, substrate, and lighting to get a tailored QR size
              recommendation.
            </p>
          </div>
          <Link
            href="/qr-size-calculator"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity shrink-0"
          >
            Open Size Calculator
          </Link>
        </div>
      </section>

      <AdSlot
        slot={`qr-size-guide-${slug}-bottom`}
        format="leaderboard"
        eligible={verdict.passed}
      />

    </div>
  );
}
