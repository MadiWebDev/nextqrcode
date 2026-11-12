import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, PenLine } from 'lucide-react';
import { JsonLd } from '@/lib/seo/jsonld';
import { articles, type Article } from '../_data/articles';

const BLOG_DESCRIPTION =
  'Practical invoicing guides for freelancers and small businesses: how to write an invoice, set payment terms, chase late payments and get paid on time.';

export const metadata: Metadata = {
  title: 'Invoice Blog — Invoicing Guides & Tips',
  description: BLOG_DESCRIPTION,
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/blog' },
  openGraph: {
    title: 'Invoice Blog — Invoicing Guides & Tips',
    description: BLOG_DESCRIPTION,
    url: 'https://invoicegenerator.freeqrcode.tools/blog',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invoice Blog — Invoicing Guides & Tips',
    description: BLOG_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArticleMeta({ article, light = false }: { article: Article; light?: boolean }) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${
        light ? 'text-primary-foreground/85' : 'text-muted-foreground'
      }`}
    >
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ${
          light ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-primary/10 text-primary'
        }`}
      >
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
  );
}

export default function BlogIndexPage() {
  const [featured, ...rest] = articles;

  return (
    <div className="bg-background text-foreground">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Invoice Generator Blog',
          description: BLOG_DESCRIPTION,
          url: 'https://invoicegenerator.freeqrcode.tools/blog',
          blogPost: {
            '@type': 'ItemList',
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://invoicegenerator.freeqrcode.tools/blog/${a.slug}`,
              name: a.title,
            })),
          },
        }}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">The invoice blog</h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Invoicing is a skill, not paperwork. These guides cover the craft end to end — writing
          invoices clients can approve in seconds, setting terms that protect your cash flow, and
          chasing late payments without burning the relationship. Written from practice, with
          numbers and scripts you can copy.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href={`/blog/${featured.slug}`}
          className="block rounded-3xl bg-primary text-primary-foreground p-7 sm:p-10 hover:opacity-[0.97] transition-opacity"
        >
          <ArticleMeta article={featured} light />
          <h2 className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight max-w-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 text-primary-foreground/85 leading-relaxed max-w-3xl">
            {featured.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Read the guide <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col hover:border-primary/50 transition-colors"
            >
              <ArticleMeta article={article} />
              <h2 className="mt-3 font-semibold text-lg leading-snug">{article.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Put it into practice — free
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every guide on this blog maps to something the invoice generator does for you:
            correct totals, saved payment details, automatic due dates, statuses and reminders
            built on a tracked invoice list.
          </p>
          <Link
            href="/#create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <PenLine className="w-4 h-4" /> Create a free invoice
          </Link>
        </div>
      </section>
    </div>
  );
}
