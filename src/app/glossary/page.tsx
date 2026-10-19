import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import {
  GLOSSARY_CATEGORIES,
  getGlossaryEntriesByCategory,
  type GlossaryEntry,
} from '@/data/glossary';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'QR Code Glossary: 40 Technical Terms Explained | QR Studio',
  description:
    'A complete glossary of QR code terminology: finder patterns, error correction levels, encoding modes, versions, payments, printing, and security — each term explained in depth.',
  alternates: { canonical: `${siteConfig.url}/glossary` },
};

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

const CATEGORY_DESCRIPTIONS: Record<GlossaryEntry['category'], string> = {
  encoding: 'How data becomes modules: patterns, versions, masks, and encoding modes.',
  'error-correction': 'Reed-Solomon math and the L/M/Q/H resilience levels.',
  printing: 'Sizes, contrast, styling, and print production guidance.',
  security: 'URL reputation, homograph attacks, and safe scanning.',
  standards: 'ISO specifications, GS1 modes, and character encodings.',
  scanning: 'Scan distance, analytics, deep links, and campaign tracking.',
  payments: 'Bitcoin, Ethereum, EPC GiroCode, UPI, and EMVCo payment QR formats.',
  formats: 'Static vs dynamic codes, Micro QR, rMQR, and contact formats.',
};

export default function GlossaryHubPage() {
  const total = GLOSSARY_CATEGORIES.reduce((n, c) => n + getGlossaryEntriesByCategory(c).length, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Glossary', url: '/glossary' },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-900 font-medium">
            Glossary
          </li>
        </ol>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">QR Code Glossary</h1>
      <p className="mb-10 max-w-2xl text-slate-600 leading-relaxed">
        {total} technical terms explained in depth — from finder patterns and Reed-Solomon error
        correction to UPI intents, GS1 Digital Link, and print sizing. Written and reviewed by QR
        systems engineers.
      </p>

      <div className="space-y-12">
        {GLOSSARY_CATEGORIES.map((category) => {
          const entries = getGlossaryEntriesByCategory(category).filter(
            (e) => e.status === 'approved'
          );
          if (entries.length === 0) return null;
          return (
            <section key={category} aria-label={CATEGORY_LABELS[category]}>
              <h2 className="mb-1 text-2xl font-bold text-slate-900">
                {CATEGORY_LABELS[category]}
              </h2>
              <p className="mb-5 text-sm text-slate-500">{CATEGORY_DESCRIPTIONS[category]}</p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {entries.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/glossary/${entry.slug}`}
                      className="block h-full rounded-lg border border-slate-200 p-5 hover:border-blue-600 hover:shadow-sm"
                    >
                      <h3 className="mb-2 font-semibold text-blue-700">{entry.term}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {entry.shortDefinition}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
