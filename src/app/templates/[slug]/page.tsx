import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { getTemplateBySlug } from '@/data/templates-gallery';
import { loadTemplates } from '@/content/families/templates';
import { auditVerdict } from '@/content/audit';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd, BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/ads/AdSlot';

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return loadTemplates().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  const url = `${siteConfig.url}/templates/${slug}`;

  if (!template) {
    return { title: 'Template Not Found | QR Studio' };
  }

  const verdict = auditVerdict(`/templates/${slug}`);
  return {
    title: `${template.title} | QR Studio`,
    description: template.metaDescription,
    alternates: { canonical: url },
    ...(verdict.passed ? {} : { robots: { index: false, follow: false } as const }),
    openGraph: {
      title: template.title,
      description: template.metaDescription,
      type: 'article',
      url,
    },
  };
}

/** Minimal markdown renderer for template prose: paragraphs, bold, bullet lists. */
function renderContent(content: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) =>
    esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  const blocks = content.split(/\n{2,}/);
  const html: string[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length > 0) {
      html.push(
        `<ul class="list-disc pl-6 space-y-1.5 my-4">${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`
      );
      list = [];
    }
  };
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 0 && lines.every((l) => l.startsWith('- '))) {
      list.push(...lines.map((l) => l.slice(2)));
      continue;
    }
    flushList();
    const text = lines.join(' ');
    if (/^(Best for|Avoid for):?$/.test(text)) {
      html.push(
        `<h2 class="text-xl font-bold text-foreground mt-8 mb-2">${inline(text.replace(/:$/, ''))}</h2>`
      );
    } else {
      html.push(`<p class="text-base leading-7 mb-4">${inline(text)}</p>`);
    }
  }
  flushList();
  return html.join('\n');
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <th className="text-left text-sm font-semibold text-muted-foreground py-2.5 pr-4 align-top w-40">
        {label}
      </th>
      <td className="text-sm py-2.5">{children}</td>
    </tr>
  );
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const entry = loadTemplates().find((e) => e.slug === slug);
  if (!entry) notFound();

  const verdict = auditVerdict(`/templates/${slug}`);
  const url = `${siteConfig.url}/templates/${slug}`;

  // Live preview: real QR symbol rendered server-side in the template's palette.
  const sampleUrl = `${siteConfig.url}/templates/${slug}`;
  const previewSvg = await QRCode.toString(sampleUrl, {
    type: 'svg',
    errorCorrectionLevel: template.ecLevel,
    margin: 2,
    color: { dark: template.colorPalette[0], light: template.colorPalette[1] },
  });

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const trail = [
    { name: 'Home', url: '/' },
    { name: 'QR Templates', url: '/templates' },
    { name: template.name, url: `/templates/${slug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {verdict.passed && (
        <>
          <BreadcrumbJsonLd trail={trail} baseUrl={siteConfig.url} />
          <WebPageJsonLd name={entry.title} url={url} description={entry.metaDescription} />
        </>
      )}
      <JsonLd data={faqJsonLd} />

      <Breadcrumbs
        items={[
          { label: 'QR Templates', href: '/templates' },
          { label: template.name, href: `/templates/${slug}` },
        ]}
      />

      <header className="mb-8 border-b border-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <span>{template.designStyle}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
          {entry.h1}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>
            By <span className="font-medium text-foreground">{entry.author}</span>
          </span>
          <span>Last reviewed {entry.lastReviewed}</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            {template.targetIndustry}
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 mb-10">
        <figure className="shrink-0">
          <div
            className="rounded-2xl border border-border/60 overflow-hidden bg-white p-4 [&>svg]:w-full [&>svg]:h-auto block"
            dangerouslySetInnerHTML={{ __html: previewSvg }}
            role="img"
            aria-label={`Sample QR code in the ${template.name} color palette`}
          />
          <figcaption className="text-xs text-muted-foreground mt-2 text-center">
            Live sample preview in this template&apos;s palette — scan to test.
          </figcaption>
        </figure>

        <div>
          <h2 className="text-lg font-bold mb-3">Design specification</h2>
          <table className="w-full border-collapse">
            <tbody>
              <SpecRow label="Color palette">
                <span className="flex flex-wrap gap-2">
                  {template.colorPalette.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block w-5 h-5 rounded border border-border/60"
                        style={{ backgroundColor: c }}
                      />
                      <code className="text-xs">{c}</code>
                    </span>
                  ))}
                </span>
              </SpecRow>
              <SpecRow label="Dot style">{template.dotStyle}</SpecRow>
              <SpecRow label="Finder eyes">
                {template.eyeOuterStyle} outer / {template.eyeInnerStyle} inner
              </SpecRow>
              <SpecRow label="Error correction">Level {template.ecLevel}</SpecRow>
              <SpecRow label="Frame">{template.frameStyle}</SpecRow>
              <SpecRow label="CTA text">“{template.ctaText}”</SpecRow>
              <SpecRow label="Logo zone">{template.hasLogo ? 'Yes' : 'No'}</SpecRow>
            </tbody>
          </table>
        </div>
      </div>

      <article
        className="text-slate-700 dark:text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderContent(entry.content) }}
      />

      {/* In-content ad slot — renders only on audit-passing pages */}
      <AdSlot
        slot={siteConfig.adsense.slotInContent}
        format="in-article"
        eligible={verdict.passed}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          {entry.faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-xl border border-border/60 bg-card px-5 py-4"
            >
              <summary className="font-semibold cursor-pointer text-foreground">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
