import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, PenLine } from 'lucide-react';
import { JsonLd } from '@/lib/seo/jsonld';
import { articles } from '../../_data/articles';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `https://invoicegenerator.freeqrcode.tools/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      siteName: 'Invoice Generator by QR Studio',
      publishedTime: article.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const moreGuides = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const url = `https://invoicegenerator.freeqrcode.tools/blog/${article.slug}`;

  return (
    <div className="bg-background text-foreground">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://invoicegenerator.freeqrcode.tools/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://invoicegenerator.freeqrcode.tools/blog' },
            { '@type': 'ListItem', position: 3, name: article.title, item: url },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          author: { '@type': 'Organization', name: 'QR Studio' },
          publisher: { '@type': 'Organization', name: 'QR Studio' },
          mainEntityOfPage: url,
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All guides
        </Link>

        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-semibold">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(article.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5" />
            {article.readingMinutes} min read
          </span>
        </p>

        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

        <div className="mt-6">
          {article.sections.map((section, i) => (
            <div key={section.heading}>
              <section className="pt-8">
                <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 40)} className="flex gap-2.5 text-muted-foreground leading-relaxed">
                        <Check className="w-4 h-4 mt-1 shrink-0 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {i === 1 && (
                <aside className="mt-10 rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">Do it the easy way — free</h2>
                    <p className="mt-1.5 text-sm text-primary-foreground/85 leading-relaxed">
                      The invoice generator applies this guide automatically: saved business and
                      client details, calculated totals, due dates from your terms, and a payment
                      QR on every PDF.
                    </p>
                  </div>
                  <Link
                    href="/#create"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground text-primary px-5 py-3 text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity"
                  >
                    <PenLine className="w-4 h-4" /> Create an invoice
                  </Link>
                </aside>
              )}
            </div>
          ))}
        </div>
      </article>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
        <h2 className="text-2xl font-bold tracking-tight">More guides</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreGuides.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="rounded-2xl border border-border bg-card p-6 block hover:border-primary/50 transition-colors"
            >
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-semibold">
                  {a.category}
                </span>
                <span>{formatDate(a.date)}</span>
                <span>{a.readingMinutes} min read</span>
              </p>
              <h3 className="mt-3 font-semibold leading-snug">{a.title}</h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
