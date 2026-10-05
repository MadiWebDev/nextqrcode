import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Calendar, Clock, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found | QR Studio' };
  }

  return {
    title: `${article.title} — QR Studio`,
    description: article.description,
    alternates: {
      canonical: `https://freeqrcode.tools/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      url: `https://freeqrcode.tools/blog/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'QR Studio',
      url: 'https://freeqrcode.tools',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Resources & Blog', href: '/blog' },
          { label: article.title, href: `/blog/${article.slug}` },
        ]}
      />

      {/* Header */}
      <header className="mb-8 border-b border-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <span>{article.category}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Published {article.publishedAt} (Updated {article.updatedAt})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Peer Reviewed & Fact Checked</span>
          </div>
        </div>
      </header>

      {/* Zero-CLS Top Ad Slot */}
      <AdSlot id={`blog-top-${article.slug}`} format="horizontal-banner" />

      {/* Main Editorial Content */}
      <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{
            __html: article.content
              .replace(/### (.*?)\n/g, '<h2 class="text-xl sm:text-2xl font-bold text-foreground mt-8 mb-4">$1</h2>')
              .replace(/#### (.*?)\n/g, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-2">$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
              .replace(/```text([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto my-4 font-mono">$1</pre>')
              .replace(/\n\n/g, '</p><p class="text-base leading-7">')
              .replace(/^\s*[\r\n]/gm, ''),
          }}
        />
      </article>

      {/* Mid-Article Zero-CLS Ad Slot */}
      <AdSlot id={`blog-mid-${article.slug}`} format="in-article" />

      {/* FAQ Section */}
      {article.faqs.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border/60">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {article.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/70 bg-card p-5 shadow-xs"
              >
                <h3 className="font-semibold text-base text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internal Linking Box: Direct link to related tool */}
      <section className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-foreground">
              Ready to generate high-precision QR codes?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Test your designs in real-time with our 100% client-side QR studio suite. Zero tracking, instant vector downloads.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity shrink-0"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
