import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '../_lib/guides';
import { SITE_URL } from '../_lib/schema';

export const metadata: Metadata = {
  title: 'Image Guides & Tutorials — Resizing, Formats, EXIF, Printing | Image Resizer',
  description:
    'Practical, honest guides to image resizing, compression, formats, EXIF privacy, passport photos, DPI and social media sizes — written for this site.',
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: 'Image Guides & Tutorials',
    description: 'Practical guides to resizing, compression, formats, EXIF privacy, passport photos, DPI and social sizes.',
    url: `${SITE_URL}/guides`,
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
};

export default function GuidesIndexPage() {
  return (
    <main className="min-w-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Image guides & tutorials</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          Straight answers about working with images — how resizing really works, what formats are
          for, what your photos reveal, and how print sizes are calculated. Every guide links to
          the free tool that does the job it describes.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
            >
              <h2 className="font-semibold leading-snug">{guide.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {guide.description}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {guide.readingMinutes} min read · Updated {guide.updatedAt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
