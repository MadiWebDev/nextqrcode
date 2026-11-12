import Link from 'next/link';
import { ArrowRight, PenLine } from 'lucide-react';
import { JsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/ads/AdSlot';

export interface SeoSection {
  heading: string;
  paragraphs: string[];
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoLandingProps {
  /** Route path on the invoice subdomain, e.g. "/invoice-for-freelancers". */
  slug: string;
  title: string;
  standfirst: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
  related: { href: string; label: string }[];
}

/**
 * Shared renderer for the invoice site's focused landing pages (spec §12B).
 * Every page supplies genuinely unique content; this component only provides
 * the common structure, breadcrumb + FAQ schema, and the paths into the app.
 */
export function SeoLanding({ slug, title, standfirst, sections, faqs, related }: SeoLandingProps) {
  const url = `https://invoicegenerator.freeqrcode.tools${slug}`;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://invoicegenerator.freeqrcode.tools/',
                },
                { '@type': 'ListItem', position: 2, name: title, item: url },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ],
        }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{' '}
          <span aria-hidden="true">/</span> <span className="text-foreground">{title}</span>
        </nav>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {standfirst}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/#create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <PenLine className="w-4 h-4" /> Create an invoice — free
          </Link>
          <Link
            href="/#templates"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            See the templates
          </Link>
        </div>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
              {section.paragraphs.map((para, i) => (
                <p key={i} className="mt-3 leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <AdSlot format="in-article" />
        </div>

        <section className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Put it into practice — your first invoice takes two minutes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The generator saves your business details and clients in your own browser, tracks
            what has been paid, and produces a polished PDF with your branding. No sign-up, no
            watermark, no per-invoice fees.
          </p>
          <Link
            href="/#create"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Open the free invoice generator <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <AdSlot format="banner" />
        </div>

        {related.length > 0 && (
          <section className="mt-14 border-t border-border/60 pt-8">
            <h2 className="text-lg font-bold tracking-tight">Keep exploring</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {link.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
