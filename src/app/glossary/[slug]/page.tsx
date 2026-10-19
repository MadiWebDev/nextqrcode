import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { loadGlossary } from '@/content/families/glossary';
import { getGlossaryEntryBySlug, type GlossaryEntry } from '@/data/glossary';
import { auditVerdict } from '@/content/audit';
import { JsonLd, BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return loadGlossary().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadGlossary().find((e) => e.slug === slug);
  if (!entry) {
    return { title: 'Glossary term not found | QR Studio' };
  }
  const verdict = auditVerdict(`/glossary/${slug}`);
  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: `${siteConfig.url}/glossary/${slug}` },
    robots: verdict.passed ? undefined : { index: false, follow: false },
  };
}

/* ------------------------------------------------------------------ */
/* Minimal markdown → HTML renderer (no new dependencies).            */
/* Supports: headings, bold, inline code, fenced code, ul/ol lists,   */
/* tables, links, paragraphs. All raw text is HTML-escaped first.     */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(escaped: string): string {
  const segments = escaped.split('`');
  let out = '';
  for (let i = 0; i < segments.length; i++) {
    if (i % 2 === 1) {
      out += `<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm">${segments[i]}</code>`;
    } else {
      let t = segments[i];
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      t = t.replace(
        /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
        '<a href="$2" class="text-blue-700 underline hover:text-blue-900">$1</a>'
      );
      out += t;
    }
  }
  return out;
}

function isTableRow(line: string): boolean {
  return /^\|.*\|\s*$/.test(line.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s|:-]+\|\s*$/.test(line.trim());
}

function renderTable(rows: string[]): string {
  const cells = (row: string) =>
    row
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => renderInline(escapeHtml(c.trim())));
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  const th = head
    .map(
      (c) =>
        `<th class="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold">${c}</th>`
    )
    .join('');
  const trs = body
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td class="border border-slate-300 px-3 py-2">${c}</td>`).join('')}</tr>`
    )
    .join('');
  return `<div class="overflow-x-auto mb-4"><table class="w-full border-collapse text-sm"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let i = 0;
  let inCode = false;
  let codeBuf: string[] = [];

  const isListStart = (l: string) => /^\s*([-*]|\d+\.)\s+/.test(l);
  const isBlockStart = (l: string) =>
    /^\s*$/.test(l) || /^#{1,4}\s/.test(l) || /^```/.test(l) || isListStart(l) || isTableRow(l);

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      if (inCode) {
        html.push(
          `<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`
        );
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const rows: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(lines[i]);
        i++;
      }
      html.push(renderTable(rows));
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 4);
      const cls = level === 2 ? 'text-2xl font-bold mt-8 mb-4' : 'text-xl font-semibold mt-6 mb-3';
      html.push(`<h${level} class="${cls}">${renderInline(escapeHtml(heading[2]))}</h${level}>`);
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      html.push(
        `<ul class="list-disc pl-6 mb-4 space-y-2 text-slate-700 leading-relaxed">${items
          .map((it) => `<li>${renderInline(escapeHtml(it))}</li>`)
          .join('')}</ul>`
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      html.push(
        `<ol class="list-decimal pl-6 mb-4 space-y-2 text-slate-700 leading-relaxed">${items
          .map((it) => `<li>${renderInline(escapeHtml(it))}</li>`)
          .join('')}</ol>`
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && !isBlockStart(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length > 0) {
      html.push(
        `<p class="mb-4 text-slate-700 leading-relaxed">${renderInline(escapeHtml(para.join(' ')))}</p>`
      );
    }
  }
  return html.join('\n');
}

/* ------------------------------------------------------------------ */

const CATEGORY_LABELS: Record<GlossaryEntry['category'], string> = {
  encoding: 'Encoding & Structure',
  'error-correction': 'Error Correction',
  printing: 'Printing & Design',
  security: 'Security',
  standards: 'Standards',
  scanning: 'Scanning & Analytics',
  payments: 'Payments',
  formats: 'Formats & Variants',
};

const TOOL_LABELS: Record<string, string> = {
  '/qr-size-calculator': 'QR Size Calculator',
  '/error-correction-simulator': 'Error Correction Simulator',
  '/qr-safety-checker': 'QR Safety Checker',
  '/printed-qr-tester': 'Printed QR Tester',
  '/qr-placement-guide': 'QR Placement Guide',
  '/url-qr-code-generator': 'URL QR Code Generator',
  '/wifi-qr-code-generator': 'WiFi QR Code Generator',
  '/vcard-qr-code-generator': 'vCard QR Code Generator',
  '/whatsapp-qr-code-generator': 'WhatsApp QR Code Generator',
  '/upi-qr-code-generator': 'UPI Payment QR Generator',
  '/bitcoin-qr-code-generator': 'Bitcoin QR Code Generator',
  '/utm-builder': 'UTM Builder',
  '/qr-scanner': 'QR Scanner',
  '/barcode-generator': 'Barcode Generator',
  '/bulk-generator': 'Bulk QR Generator',
  '/bulk-vcard-qr': 'Bulk vCard QR',
  '/bulk-vcard-generator': 'Bulk vCard Generator',
  '/regional-payment-qr': 'Regional Payment QR',
  '/pakistan-payment-qr': 'Pakistan Payment QR',
  '/payment-qr': 'Payment QR Schemes',
  '/qr-sticker-sheet-printer': 'Sticker Sheet Printer',
  '/qr-splitter-scanner': 'QR Splitter & Scanner',
  '/blog': 'Blog & Guides',
};

function toolLabel(path: string): string {
  return (
    TOOL_LABELS[path] ??
    path
      .replace(/^\//, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const entry = loadGlossary().find((e) => e.slug === slug);
  if (!entry) notFound();

  const data = getGlossaryEntryBySlug(slug);
  const verdict = auditVerdict(`/glossary/${slug}`);
  const canonical = `${siteConfig.url}/glossary/${slug}`;

  const relatedTerms = (data?.relatedTerms ?? [])
    .map((t) => ({ slug: t, term: getGlossaryEntryBySlug(t)?.term ?? t }))
    .filter((t) => t.slug !== slug);
  const relatedTools = (data?.relatedTools ?? []).filter((t) => TOOL_LABELS[t] !== undefined);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Glossary', url: '/glossary' },
          { name: entry.h1, url: `/glossary/${slug}` },
        ]}
      />
      {verdict.passed && (
        <WebPageJsonLd name={entry.title} url={canonical} description={entry.metaDescription} />
      )}
      <JsonLd data={faqJsonLd} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/glossary" className="hover:text-slate-900">
              Glossary
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-900 font-medium">
            {entry.h1}
          </li>
        </ol>
      </nav>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
        {data ? CATEGORY_LABELS[data.category] : 'Glossary'}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">{entry.h1}</h1>
      <p className="mb-8 text-sm text-slate-500">
        By {entry.author} · Last reviewed: {entry.lastReviewed}
      </p>

      <article dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }} />

      {entry.faqs.length > 0 && (
        <section className="mt-10" aria-label="Frequently asked questions">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="space-y-4">
            {entry.faqs.map((f) => (
              <div key={f.question} className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-2 font-semibold text-slate-900">{f.question}</h3>
                <p className="text-slate-700 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {entry.sources.length > 0 && (
        <section className="mt-10" aria-label="Sources">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Sources</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            {entry.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedTerms.length > 0 && (
        <section className="mt-10" aria-label="Related terms">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Related terms</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map((t) => (
              <Link
                key={t.slug}
                href={`/glossary/${t.slug}`}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:border-blue-600 hover:text-blue-700"
              >
                {t.term}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedTools.length > 0 && (
        <section className="mt-10" aria-label="Related tools">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Related tools</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedTools.map((t) => (
              <li key={t}>
                <Link
                  href={t}
                  className="block rounded-lg border border-slate-200 p-4 hover:border-blue-600 hover:shadow-sm"
                >
                  <span className="font-medium text-blue-700">{toolLabel(t)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
