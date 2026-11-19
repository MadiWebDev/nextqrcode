import Link from 'next/link';
import type { SeoPage } from '../_lib/seo-pages';
import { TEMPLATE_META } from '../_lib/templates/registry';

const SITE = 'https://resumebuilder.freeqrcode.tools';

export function seoPageMetadata(page: SeoPage, path: string) {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { title: page.title, description: page.description, url: `${SITE}${path}`, type: 'article' as const },
    twitter: { card: 'summary' as const, title: page.title, description: page.description },
  };
}

export default function SeoPageView({ page, path }: { page: SeoPage; path: string }) {
  const meta = page.templateId ? TEMPLATE_META.find((t) => t.id === page.templateId) : undefined;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Resume Builder', item: SITE },
      { '@type': 'ListItem', position: 2, name: page.h1, item: `${SITE}${path}` },
    ],
  };
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    mainEntityOfPage: `${SITE}${path}`,
    author: { '@type': 'Organization', name: 'Resume Builder' },
    publisher: { '@type': 'Organization', name: 'Resume Builder' },
  };
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm" style={{ color: 'var(--rb-muted)' }}>
        <Link href="/" className="underline">Resume Builder</Link> <span aria-hidden="true">/</span> <span>{page.h1}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{page.h1}</h1>
      {page.intro.map((para, i) => (
        <p key={i} className="mt-4 leading-7" style={{ color: 'var(--rb-muted)' }}>{para}</p>
      ))}

      {page.lookFor && page.lookFor.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">What employers look for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
            {page.lookFor.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      {page.skills && page.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Skills worth listing</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {page.skills.map((skill) => (
              <li key={skill} className="rounded-full border px-3 py-1 text-sm" style={{ borderColor: 'var(--rb-border)' }}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {page.sectionGuide && page.sectionGuide.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Section by section</h2>
          <div className="mt-3 space-y-4">
            {page.sectionGuide.map((g) => (
              <div key={g.heading}>
                <h3 className="font-semibold">{g.heading}</h3>
                <p className="mt-1 leading-7" style={{ color: 'var(--rb-muted)' }}>{g.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {page.sections?.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          {section.paragraphs.map((para, i) => (
            <p key={i} className="mt-3 leading-7" style={{ color: 'var(--rb-muted)' }}>{para}</p>
          ))}
        </section>
      ))}

      {meta && (
        <section className="mt-8 rounded-xl border p-5" style={{ borderColor: 'var(--rb-border)', background: 'var(--rb-surface)' }} aria-label="Recommended template">
          <h2 className="text-xl font-semibold">Recommended template: {meta.name}</h2>
          {page.templateWhy && (
            <p className="mt-2 leading-7" style={{ color: 'var(--rb-muted)' }}>{page.templateWhy}</p>
          )}
          <p className="mt-2 text-sm" style={{ color: 'var(--rb-muted)' }}>
            Profession: {meta.profession} · Category: {meta.category}. Free, no sign-up, and your
            data never leaves your browser. Open the gallery to preview this template live with
            its fictional sample and start from it.
          </p>
          <Link
            href="/templates"
            className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: 'var(--rb-accent)', color: 'var(--rb-accent-contrast)' }}
          >
            Use this template
          </Link>
        </section>
      )}

      {page.mistakes && page.mistakes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Mistakes to avoid</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
            {page.mistakes.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-3 space-y-4">
          {page.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1 leading-7" style={{ color: 'var(--rb-muted)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
