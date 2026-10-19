import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { loadIndustries } from '@/content/families/industries';
import { auditVerdict } from '@/content/audit';
import { BreadcrumbJsonLd, WebPageJsonLd, JsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/ads/AdSlot';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return loadIndustries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadIndustries().find((e) => e.slug === slug);
  if (!entry) {
    return { title: 'Industry Guide Not Found — QR Studio' };
  }
  const url = `/industries/${slug}`;
  const verdict = auditVerdict(url);
  return {
    title: `${entry.title} — QR Studio`,
    description: entry.metaDescription,
    alternates: { canonical: `${siteConfig.url}${url}` },
    robots: verdict.passed ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/** Minimal markdown → HTML converter (no new dependencies). */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMd(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return out;
}

function mdToHtml(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let list: 'ul' | 'ol' | null = null;
  const closeList = () => {
    if (list) {
      html += `</${list}>`;
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') {
      closeList();
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    const h2 = line.match(/^##\s+(.+)$/);
    const ul = line.match(/^-\s+(.+)$/);
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (h3) {
      closeList();
      html += `<h3>${inlineMd(h3[1])}</h3>`;
    } else if (h2) {
      closeList();
      html += `<h2>${inlineMd(h2[1])}</h2>`;
    } else if (ul) {
      if (list !== 'ul') {
        closeList();
        html += '<ul>';
        list = 'ul';
      }
      html += `<li>${inlineMd(ul[1])}</li>`;
    } else if (ol) {
      if (list !== 'ol') {
        closeList();
        html += '<ol>';
        list = 'ol';
      }
      html += `<li>${inlineMd(ol[1])}</li>`;
    } else {
      closeList();
      html += `<p>${inlineMd(line)}</p>`;
    }
  }
  closeList();
  return html;
}

const WORD_FIX: Record<string, string> = {
  qr: 'QR',
  url: 'URL',
  wifi: 'Wi-Fi',
  vcard: 'vCard',
  utm: 'UTM',
  pos: 'POS',
  sms: 'SMS',
};

/** Turn a site path into a human-readable link label. */
function linkLabel(path: string): string {
  const seg = path.split('/').filter(Boolean).pop() ?? 'home';
  return seg
    .split('-')
    .map((w) => WORD_FIX[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default async function IndustryUseCasePage({ params }: Props) {
  const { slug } = await params;
  const entry = loadIndustries().find((e) => e.slug === slug);
  if (!entry) {
    notFound();
  }

  const url = `/industries/${slug}`;
  const verdict = auditVerdict(url);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: entry.title, url },
        ]}
      />
      {verdict.passed && (
        <WebPageJsonLd
          name={entry.title}
          url={`${siteConfig.url}${url}`}
          description={entry.metaDescription}
        />
      )}
      <JsonLd data={faqJsonLd} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-slate-900 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/industries" className="hover:text-slate-900 hover:underline">
              Industries
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-700">
            {entry.title}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{entry.h1}</h1>
      <p className="mt-4 text-sm text-slate-500">
        By {entry.author} <span aria-hidden="true">·</span> Last reviewed: {entry.lastReviewed}
      </p>

      <div
        className="mt-8 space-y-5 leading-relaxed text-slate-700 [&_a]:text-blue-700 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:pt-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:text-[1.02rem] [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: mdToHtml(entry.content) }}
      />

      {/* In-content ad slot — renders only on audit-passing pages */}
      <AdSlot
        slot={siteConfig.adsense.slotInContent}
        format="in-article"
        eligible={verdict.passed}
      />

      <section aria-labelledby="faq-heading" className="mt-12">
        <h2 id="faq-heading" className="text-2xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-6">
          {entry.faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 leading-relaxed text-slate-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {entry.sources.length > 0 && (
        <section aria-labelledby="sources-heading" className="mt-12">
          <h2 id="sources-heading" className="text-2xl font-bold text-slate-900">
            Sources
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            {entry.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="related-heading" className="mt-12">
        <h2 id="related-heading" className="text-2xl font-bold text-slate-900">
          Related pages
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {entry.internalLinks.map((link) => (
            <li key={link}>
              <Link
                href={link}
                className="block rounded-lg border border-slate-200 bg-white p-4 text-blue-700 hover:border-blue-300 hover:bg-blue-50 hover:underline"
              >
                {linkLabel(link)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
