import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_LABELS, toolBySlug, type ToolDef } from '../_lib/registry';

/**
 * Registry-driven landing shell for every tool page: breadcrumb, H1, intro,
 * the working tool, how-to steps, FAQs and related tools. Content comes
 * from the registry so a page can never drift from its tool.
 * (AdSlot placements are added to this shell in Phase G.)
 */
export function ToolShell({ tool, children }: { tool: ToolDef; children: ReactNode }) {
  const related = tool.related
    .map((slug) => toolBySlug(slug))
    .filter((t): t is ToolDef => Boolean(t));

  return (
    <main className="min-w-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          <span>{CATEGORY_LABELS[tool.category]}</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          <span aria-current="page" className="text-foreground font-medium">
            {tool.name}
          </span>
        </nav>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{tool.h1}</h1>
        <div className="mt-4 max-w-3xl space-y-3">
          {tool.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <section aria-label={`${tool.name} tool`} className="mt-8">
          {children}
        </section>

        <section aria-label="How to" className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold">How to {tool.name.charAt(0).toLowerCase() + tool.name.slice(1)}</h2>
          <ol className="mt-4 space-y-2.5 list-decimal list-inside text-sm sm:text-base text-muted-foreground leading-relaxed">
            {tool.howTo.map((step) => (
              <li key={step.slice(0, 40)}>{step}</li>
            ))}
          </ol>
        </section>

        {tool.faqs.length > 0 && (
          <section aria-label="Frequently asked questions" className="mt-12 max-w-3xl">
            <h2 className="text-xl font-bold">Frequently asked questions</h2>
            <div className="mt-4 space-y-5">
              {tool.faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-label="Related tools" className="mt-12">
            <h2 className="text-xl font-bold">Related tools</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${rel.slug}`}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
                >
                  <span className="font-semibold text-sm">{rel.name}</span>
                  <span className="block mt-1 text-xs text-muted-foreground leading-relaxed">{rel.summary}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
