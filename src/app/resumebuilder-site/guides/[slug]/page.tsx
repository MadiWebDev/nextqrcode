import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoPageView, { seoPageMetadata } from '../../_components/SeoPageView';
import { publishedSeoPages } from '../../_lib/seo-pages';

const TYPE = 'guide' as const;
const SEGMENT = 'guides';

export function generateStaticParams() {
  return publishedSeoPages().filter((p) => p.type === TYPE).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = publishedSeoPages().find((p) => p.type === TYPE && p.slug === slug);
  if (!page) return {};
  return seoPageMetadata(page, `/${SEGMENT}/${page.slug}`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = publishedSeoPages().find((p) => p.type === TYPE && p.slug === slug);
  if (!page) notFound();
  return <SeoPageView page={page} path={`/${SEGMENT}/${page.slug}`} />;
}
