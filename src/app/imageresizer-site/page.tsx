import Link from 'next/link';
import { Lock, MousePointerClick, SlidersHorizontal, Zap } from 'lucide-react';
import { ResizerTool } from './_components/ResizerTool';
import { HistoryPanel } from './_components/HistoryPanel';
import { JsonLd } from './_components/JsonLd';
import { CATEGORY_LABELS, TOOLS, type ToolCategory } from './_lib/registry';
import { GUIDES } from './_lib/guides';
import { homeJsonLd } from './_lib/schema';
import { AdSlot } from '@/components/ads/AdSlot';

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS) as ToolCategory[];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Every tool on this site runs entirely in your browser using its built-in image engine. Your files never leave your device, which is also why the tools work instantly and stay free.',
  },
  {
    q: 'Which image formats can I use?',
    a: 'You can open JPG, PNG, WebP, AVIF, GIF (including animated GIFs), BMP, TIFF, HEIC/HEIF photos, SVG and ICO files. You can save as JPG, PNG, WebP and GIF everywhere; AVIF saving works in Chrome-based browsers.',
  },
  {
    q: 'Will resizing reduce my image quality?',
    a: 'Shrinking an image discards pixels, so some detail is inevitably lost — but the resizer uses high-quality resampling and lets you pick the output format and quality, so you stay in control of the size/quality balance. Enlarging cannot add real detail.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Files up to 60 MB and 100 megapixels are accepted. Those limits exist because decoding happens on your device — a larger image could exhaust the memory of a phone. In practice, almost every camera photo is far below them.',
  },
];

export default function ImageResizerHome() {
  return (
    <main className="min-w-0">
      <JsonLd graph={homeJsonLd(FAQS)} />
      {/* Hero + working workspace */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight">
            Free Online Image Resizer – Resize, Compress &amp; Edit Images
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Resize images to exact dimensions, compress photos to specific KB sizes, convert image formats, crop
            pictures, and process multiple files at once. Free, fast, private, and easy to use.
          </p>

          <div id="resize" className="mt-8 scroll-mt-24">
            <ResizerTool />
          </div>
        </div>
      </section>

      <div className="flex justify-center px-4 py-8">
        <AdSlot format="leaderboard" />
      </div>

      {/* Tool directory */}
      <section aria-label="All image tools" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold">Popular image tools</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Every tool runs in your browser — pick one and drop an image in.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
              >
                <span className="font-semibold text-sm">{tool.name}</span>
                <span className="block mt-1 text-xs text-muted-foreground leading-relaxed">{tool.summary}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section aria-label="Browse tools by category" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold">Browse by job</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_ORDER.map((category) => {
              const count = TOOLS.filter((t) => t.category === category).length;
              return (
                <Link
                  key={category}
                  href={`/categories/${category}`}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
                >
                  <span className="font-semibold text-sm">{CATEGORY_LABELS[category]}</span>
                  <span className="block mt-1 text-xs text-muted-foreground">
                    {count} free tool{count === 1 ? '' : 's'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section aria-label="Guides and tutorials" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">Guides worth your five minutes</h2>
            <Link href="/guides" className="shrink-0 font-medium text-blue-700 underline">
              All guides
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.slice(0, 4).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
              >
                <span className="font-semibold text-sm leading-snug">{guide.title}</span>
                <span className="block mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {guide.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* On-device history */}
      <section aria-label="Your recent activity" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <HistoryPanel />
        </div>
      </section>

      {/* Trust strip */}
      <section id="privacy" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: 'Private by design',
                text: 'Images are processed directly in your browser and are not uploaded to our servers.',
              },
              {
                icon: Zap,
                title: 'Instant results',
                text: 'No upload queues or waiting rooms — your own device does the work immediately.',
              },
              {
                icon: SlidersHorizontal,
                title: 'Real control',
                text: 'Exact pixels, percentages, fit/fill modes, output format and quality — no fake "one-click" magic.',
              },
              {
                icon: MousePointerClick,
                title: 'No sign-up, no watermark',
                text: 'Open a tool, drop an image, download the result. Nothing is added to your files.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <item.icon className="w-6 h-6 text-primary" aria-hidden />
                <h2 className="mt-3 font-semibold">{item.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center px-4 py-8">
        <AdSlot format="banner" />
      </div>

      {/* FAQ */}
      <section id="faq" className="border-t border-border scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
