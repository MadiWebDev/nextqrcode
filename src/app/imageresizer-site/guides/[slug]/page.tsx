import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { GUIDES, guideBySlug } from '../../_lib/guides';
import { toolBySlug } from '../../_lib/registry';
import { guideJsonLd, SITE_URL } from '../../_lib/schema';
import { JsonLd } from '../../_components/JsonLd';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Image Resizer Guides`,
    description: guide.description,
    alternates: { canonical: `${SITE_URL}/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}/guides/${guide.slug}`,
      type: 'article',
      siteName: 'Free QR Code Tools – Image Resizer',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const tools = guide.relatedTools
    .map((s) => toolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const moreGuides = guide.relatedGuides
    .map((s) => guideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <main className="min-w-0">
      <JsonLd graph={guideJsonLd(guide)} />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/guides" className="hover:text-foreground">Guides</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span aria-current="page" className="font-medium text-foreground">{guide.title}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {guide.readingMinutes} min read · Published {guide.publishedAt} · Updated {guide.updatedAt}
        </p>

        <div className="mt-6 space-y-3">
          {guide.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-9">
            <h2 className="text-xl font-bold">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 40)}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {tools.length > 0 && (
          <section aria-label="Tools mentioned in this guide" className="mt-12 rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">Do it now — free tools from this guide</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="rounded-lg border border-border p-3.5 transition-colors hover:border-primary/60"
                >
                  <span className="text-sm font-semibold">{tool.name}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{tool.summary}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {moreGuides.length > 0 && (
          <section aria-label="Related guides" className="mt-10">
            <h2 className="text-lg font-bold">Keep reading</h2>
            <ul className="mt-3 space-y-2">
              {moreGuides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="font-medium text-blue-700 underline">
                    {g.title}
                  </Link>
                  <span className="text-sm text-muted-foreground"> — {g.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
