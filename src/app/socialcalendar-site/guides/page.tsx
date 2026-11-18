import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '../_data/guides';

export const metadata: Metadata = {
  title: 'Guides — Social Media Calendar',
  description:
    'Practical, honest guides to planning social media content: content calendars, pillars, posting times, repurposing, and small-business workflows.',
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/guides' },
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Guides</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A small set of practical guides, written from real planning work — no filler, no
        listicles-for-clicks. Each one teaches a method you can run with or without this tool.
      </p>
      <ul className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <li key={g.slug} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">
              <Link href={`/guides/${g.slug}`} className="hover:underline">
                {g.h1}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">Updated {g.updatedAt}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        Ready to plan?{' '}
        <Link href="/app" className="font-medium text-primary underline">
          Open the free workspace
        </Link>{' '}
        — no sign-up, everything stored locally in your browser.
      </p>
    </main>
  );
}
