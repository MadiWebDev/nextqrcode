import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_LABELS, TOOLS, type ToolCategory } from '../../_lib/registry';
import { categoryJsonLd, SITE_URL } from '../../_lib/schema';
import { JsonLd } from '../../_components/JsonLd';

/** Unique, honest intro copy per category — hub pages, not thin listings. */
const CATEGORY_INTROS: Record<ToolCategory, string[]> = {
  resize: [
    'Resizing is the first operation most images need: fitting a slot, a limit or a screen. These tools change pixel dimensions with high-quality smoothing, keep or deliberately change the aspect ratio, and show you the real before/after numbers.',
    'Work from the original each time — chained resizes compound quality loss, and every tool here leaves your source file untouched.',
  ],
  compress: [
    'Compression trades invisible information for smaller files. These tools give you both kinds of control: a quality slider for judgement calls, and an exact-target engine for hard limits ("under 100KB") that tries quality first, then dimensions, and tells you honestly what was achieved.',
  ],
  convert: [
    'Conversion is format literacy in practice: JPG for compatibility, WebP for the web, PNG for graphics and transparency, plus honest handling of the hard cases — HEIC from iPhones (decoded on your device) and animated GIFs (never silently flattened).',
  ],
  crop: [
    'Cropping decides what a photo is about. These tools give you drag handles, exact pixel inputs, ratio locks for every platform, and the special cases — a circle preview for avatars and a centre-crop grid for profile puzzles.',
  ],
  edit: [
    'Editing changes how an image looks, not just its shape: colour and light adjustments with a live histogram, background colour, rounded corners, watermarks, QR overlays and an honest 2× enhance. The editor is non-destructive — your original is never overwritten, and every step can be undone.',
  ],
  bulk: [
    'Bulk tools exist because the fiftieth photo deserves the same care as the first. A real queue with thumbnails, per-file status, pause/resume and retries processes whole folders on your device, then hands you a single ZIP.',
  ],
  social: [
    'Every platform displays a few exact shapes and crops the rest. These tools encode the published sizes (reviewed against the platforms\' own documentation) as presets, compose link cards, and split grid posts in the correct posting order.',
  ],
  passport: [
    'Passport and ID photos live under strict published rules: exact sizes, backgrounds and recency. The maker here uses sourced, dated presets per country, overlays positioning guides, and generates print sheets — while saying plainly that it cannot fix lighting or backdrops, and that the issuing authority\'s decision is final.',
  ],
  privacy: [
    'Photos carry more than pictures: EXIF diaries with GPS coordinates, faces, plates, documents. These tools let you see exactly what is inside a file, remove metadata with proof, and cover sensitive regions before you share.',
  ],
  utility: [
    'The workbench drawer: favicon sets with a real ICO file, base64 both ways, colour sampling and palettes, a colour-blindness simulator for accessibility checks, and calculators that settle aspect-ratio, DPI and print-size arguments instantly.',
  ],
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as ToolCategory];
  if (!label) return {};
  return {
    title: `${label} Tools — Free Online | Image Resizer`,
    description: CATEGORY_INTROS[category as ToolCategory][0].slice(0, 155),
    alternates: { canonical: `${SITE_URL}/categories/${category}` },
    openGraph: {
      title: `${label} Tools`,
      description: CATEGORY_INTROS[category as ToolCategory][0].slice(0, 155),
      url: `${SITE_URL}/categories/${category}`,
      type: 'website',
      siteName: 'Free QR Code Tools – Image Resizer',
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const key = category as ToolCategory;
  const label = CATEGORY_LABELS[key];
  if (!label) notFound();
  const tools = TOOLS.filter((t) => t.category === key);
  const otherCategories = (Object.keys(CATEGORY_LABELS) as ToolCategory[]).filter((c) => c !== key);

  return (
    <main className="min-w-0">
      <JsonLd graph={categoryJsonLd(key, label, tools)} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span aria-current="page" className="font-medium text-foreground">{label}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{label} tools</h1>
        <div className="mt-4 max-w-3xl space-y-3">
          {CATEGORY_INTROS[key].map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60"
            >
              <span className="font-semibold">{tool.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{tool.summary}</span>
            </Link>
          ))}
        </div>
        <section aria-label="Other categories" className="mt-12">
          <h2 className="text-lg font-bold">Other tool categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c}
                href={`/categories/${c}`}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:border-primary/60"
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
