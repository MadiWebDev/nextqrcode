import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLabelSheets } from '@/data/labels';
import { Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'QR Code Label Sheet Templates — Avery, Herma & More',
  description:
    'Free print-ready QR code templates for popular label sheets: Avery 5160, 5163, L7160, Herma 4682, and more. Calibrated dimensions, zero drift.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-labels' },
};

export default function QrLabelsIndexPage() {
  const sheets = getAllLabelSheets();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Label Sheet Templates
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Calibrated print templates for popular Avery, Herma, and compatible label sheets. Generate
          batch QR codes and print them at exactly the right size — zero drift.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheets.map((sheet) => (
          <Link
            key={sheet.slug}
            href={`/qr-labels/${sheet.slug}`}
            className="p-5 border border-border/60 rounded-2xl bg-card hover:border-blue-500/40 hover:shadow-md transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {sheet.brand} {sheet.productCode}
              </span>
              <Tag className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
            <h2 className="text-sm font-bold text-foreground leading-snug">{sheet.name}</h2>
            <p className="text-xs text-muted-foreground">{sheet.metaDescription}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {sheet.labelsPerSheet} per sheet
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {sheet.paperSize === 'a4' ? 'A4' : 'US Letter'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {sheet.widthMm}×{sheet.heightMm}mm
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
