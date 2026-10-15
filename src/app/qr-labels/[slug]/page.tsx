import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLabelSheets, getLabelSheetBySlug } from '@/data/labels';
import { LandingGenerator } from '@/components/LandingGenerator';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Tag, Printer, Ruler, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLabelSheets().map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getLabelSheetBySlug(slug);

  if (!sheet) {
    return { title: 'Label Sheet Not Found | QR Code Tools' };
  }

  return {
    title: sheet.title,
    description: sheet.metaDescription,
    alternates: {
      canonical: `https://freeqrcode.tools/qr-labels/${sheet.slug}`,
    },
    openGraph: {
      title: sheet.title,
      description: sheet.metaDescription,
      url: `https://freeqrcode.tools/qr-labels/${sheet.slug}`,
    },
  };
}

export default async function LabelSheetPage({ params }: Props) {
  const { slug } = await params;
  const sheet = getLabelSheetBySlug(slug);

  if (!sheet) {
    notFound();
  }

  const allSheets = getAllLabelSheets();
  const otherSheets = allSheets.filter((s) => s.slug !== sheet.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'QR Label Sheets', href: '/qr-sticker-sheet-printer' },
          { label: sheet.name, href: `/qr-labels/${sheet.slug}` },
        ]}
      />

      {/* Generator */}
      <LandingGenerator
        type="url"
        data={{
          title: sheet.title,
          description: `${sheet.metaDescription} ${sheet.labelsPerSheet} labels per ${sheet.paperSize === 'a4' ? 'A4' : 'US Letter'} sheet.`,
          howTo: [
            `Enter your URL or payload — keep it under ${sheet.optimalPayloadLength} characters for best scan speed.`,
            `Download the SVG or PNG and insert it into your ${sheet.brand} ${sheet.productCode} label template at exactly ${sheet.widthMm} × ${sheet.heightMm} mm.`,
            `Print at 100% scale (no "Fit to Page") on ${sheet.compatiblePrinters} printers.`,
          ],
          faqs: sheet.faqs.map((f) => ({ q: f.question, a: f.answer })),
          relatedTypes: [
            { type: 'url', label: 'URL QR Generator', slug: '/url-qr-code-generator' },
            { type: 'vcard', label: 'vCard QR Generator', slug: '/vcard-qr-code-generator' },
          ],
        }}
      />

      {/* AdSlot */}
      <AdSlot id={`label-${sheet.slug}-mid`} format="horizontal-banner" />

      {/* Technical Specs */}
      <section className="bg-card border border-border/70 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Ruler className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-foreground">
            Print Specifications: {sheet.name}
          </h2>
        </div>

        {/* Dimension grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
          {[
            { label: 'Paper Size', value: sheet.paperSize === 'a4' ? 'ISO A4 (210×297mm)' : 'US Letter (8.5×11 in)' },
            { label: 'Labels per Sheet', value: String(sheet.labelsPerSheet) },
            { label: 'Label Dimensions', value: `${sheet.widthMm} × ${sheet.heightMm} mm` },
            { label: 'Layout', value: `${sheet.columns} col × ${sheet.rows} rows` },
            { label: 'Top Margin', value: `${sheet.marginTopMm} mm` },
            { label: 'Left Margin', value: `${sheet.marginLeftMm} mm` },
            { label: 'Horizontal Gap', value: `${sheet.gapHorizontalMm} mm` },
            { label: 'Compatible Printers', value: sheet.compatiblePrinters },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-muted/60 space-y-1">
              <span className="text-muted-foreground block text-[11px]">{label}</span>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Alignment tip */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
          <Printer className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Printer Feed Tip</span>
            {sheet.feedAlignmentTip}
          </div>
        </div>

        {/* Common pitfalls */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
          <Tag className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Common Pitfalls</span>
            {sheet.commonPitfalls}
          </div>
        </div>

        {/* Use cases */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">Typical Use Cases:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {sheet.useCases.map((uc) => (
              <li key={uc}>{uc}</li>
            ))}
          </ul>
        </div>

        {/* Long-form content */}
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line pt-4 border-t border-border/50">
          {sheet.content.trim()}
        </div>
      </section>

      {/* FAQs */}
      {sheet.faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {sheet.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border/70 bg-card p-5">
                <h3 className="font-semibold text-base text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other label sheets */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Explore Other Label Sheet Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherSheets.map((s) => (
            <Link
              key={s.slug}
              href={`/qr-labels/${s.slug}`}
              className="p-3.5 border border-border/60 rounded-xl bg-card hover:border-blue-500/40 hover:shadow-sm transition-all text-xs font-medium text-foreground flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold block">{s.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {s.labelsPerSheet} labels · {s.paperSize === 'a4' ? 'A4' : 'Letter'} · {s.widthMm}×{s.heightMm}mm
                </span>
              </div>
              <Tag className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
