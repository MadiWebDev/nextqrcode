import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { loadIndustries } from '@/content/families/industries';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'QR Codes by Industry — QR Studio',
  description:
    'Explore QR code use cases by industry: retail, restaurants, healthcare, education, logistics, real estate, events, hospitality, manufacturing, and fitness.',
  alternates: { canonical: `${siteConfig.url}/industries` },
  robots: { index: true, follow: true },
};

/** Industry label derived from the slug prefix (matches the data file grouping). */
function industryOf(slug: string): string {
  const prefix = slug.split('-')[0];
  const map: Record<string, string> = {
    retail: 'Retail',
    restaurant: 'Restaurants',
    healthcare: 'Healthcare',
    education: 'Education',
    logistics: 'Logistics',
    real: 'Real Estate',
    events: 'Events',
    hospitality: 'Hospitality',
    manufacturing: 'Manufacturing',
    fitness: 'Fitness',
  };
  return map[prefix] ?? prefix;
}

export default function IndustriesHubPage() {
  const entries = loadIndustries();

  // Group entries by industry, preserving data order.
  const ordered: { industry: string; items: typeof entries }[] = [];
  const seen = new Map<string, (typeof entries)[number][]>();
  for (const entry of entries) {
    const industry = industryOf(entry.slug);
    if (!seen.has(industry)) {
      seen.set(industry, []);
      ordered.push({ industry, items: seen.get(industry)! });
    }
    seen.get(industry)!.push(entry);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-slate-900 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-700">
            Industries
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        QR Codes by Industry
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        Practical QR code deployments for ten industries — payload design, print specifications, and
        operational best practices for each use case. Every guide includes a working generator
        configured for the job.
      </p>

      {ordered.map(({ industry, items }) => (
        <section key={industry} aria-labelledby={`industry-${industry}`} className="mt-12">
          <h2
            id={`industry-${industry}`}
            className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-900"
          >
            {industry}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {items.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/industries/${entry.slug}`}
                  className="block h-full rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {entry.metaDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
