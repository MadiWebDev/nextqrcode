import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { BookOpen, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'QR Code Engineering & Standards Hub — Guides & Research',
  description:
    'Deep-dive engineering guides, Reed-Solomon math, ISO/IEC 18004 standards, printing guidelines, and mobile scan diagnostics from QR Code Tools.',
  alternates: { canonical: 'https://freeqrcode.tools/blog' },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Resources & Guides', href: '/blog' }]} />

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Technical Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Standards, Optics & Guides
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Comprehensive, peer-reviewed engineering analyses covering optical camera physics, Galois
          Field error correction, commercial print substrates, and international payment protocols.
        </p>
      </header>

      {/* Top Banner AdSlot */}
      <AdSlot id="blog-index-top" format="horizontal-banner" />

      {/* Articles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="flex flex-col justify-between border border-border/70 rounded-2xl p-6 bg-card hover:shadow-lg transition-all hover:border-primary/40 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-md bg-muted font-medium text-foreground/80">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {article.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <UserCheck className="w-3 h-3 text-primary" />
                <span className="truncate max-w-[120px]">{article.author}</span>
              </div>
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <AdSlot id="blog-bottom" format="horizontal-banner" />

      {/* Featured Tools — internal link section to boost discovery of key tools from blog */}
      <section className="mt-12 pt-10 border-t border-border/60">
        <h2 className="text-lg font-bold text-foreground mb-1">Featured Tools</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Try the tools mentioned in our guides — all free, no sign-up required.
        </p>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
          {[
            { href: '/url-qr-code-generator', label: 'URL QR Code Generator' },
            { href: '/qr-safety-checker', label: 'QR Safety Checker' },
            { href: '/qr-contrast-checker', label: 'QR Contrast Checker' },
            { href: '/qr-print-cost-calculator', label: 'QR Print Cost Calculator' },
            { href: '/bulk-generator', label: 'Bulk QR Generator' },
            { href: '/qr-payload-inspector', label: 'QR Payload Inspector' },
            { href: '/qr-a-b-test-planner', label: 'QR A/B Test Planner' },
            { href: '/qr-redirect-chain-viewer', label: 'QR Redirect Chain Viewer' },
            { href: '/tools', label: 'All Tools Directory →' },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
