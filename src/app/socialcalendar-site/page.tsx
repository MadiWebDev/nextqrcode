import Link from 'next/link';
import { JsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/AdSlot';
import { PLATFORMS, chipBackground } from './_lib/platforms';

const BASE = 'https://socialcalendar.freeqrcode.tools';

const FAQS = [
  {
    q: 'Is the Social Media Calendar really free?',
    a: 'Yes. The full planner — calendar views, campaigns, approvals, analytics and exports — works without an account or subscription. It runs entirely in your browser, so there is no server cost to pass on to you.',
  },
  {
    q: 'Where is my content stored?',
    a: 'In your own browser, in a local database (IndexedDB). Your captions, notes and media are never uploaded to our servers. You can export a backup file at any time and restore it on another device.',
  },
  {
    q: 'Does it post to Instagram, TikTok or other platforms for me?',
    a: 'No — and it will never pretend to. This is a planning tool: it helps you prepare, schedule and organize content, track approvals and record results. Publishing happens in each platform\u2019s own app, where you stay in control.',
  },
  {
    q: 'Can I manage several clients or brands?',
    a: 'Yes. Create a separate workspace per client or brand, each with its own calendar, time zone, campaigns, brand kit and analytics. Switch between them instantly and export client-ready PDF reports.',
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Your calendar would be deleted with it, which is why the app reminds you to keep a backup. Export a JSON backup (optionally encrypted with a passphrase) and store it somewhere safe — restoring takes seconds.',
  },
  {
    q: 'Can I import an existing content plan?',
    a: 'Yes. Import CSV, XLSX, ICS or JSON files with a guided column-mapping wizard that previews every row, flags duplicates and errors, and lets you undo the whole import.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. After your first visit the workspace is cached on your device and every core feature — planning, editing, exporting — works without a connection.',
  },
];

const FEATURES = [
  {
    title: 'Ten calendar views',
    body: 'Month, week, day, agenda, timeline, kanban pipeline, feed preview, planning board, campaign calendar and editorial overview — all reading the same posts, so nothing is ever duplicated or lost when you switch.',
  },
  {
    title: 'Platform-smart captions',
    body: 'One master caption with per-platform overrides, live character counters that follow each platform\u2019s real counting rules, hashtag groups and truncation warnings before you copy anything over.',
  },
  {
    title: 'Campaigns & content pillars',
    body: 'Group posts into campaigns with goals and budgets, and balance your mix against content-pillar targets — the gap detector shows exactly which platforms, days and pillars need attention.',
  },
  {
    title: 'Approvals without the chaos',
    body: 'A clear pipeline from idea to published, with checklists, reviewer notes and a full activity history — all stored locally in the workspace.',
  },
  {
    title: 'Honest analytics',
    body: 'Dashboards computed from your plan and the results you enter or import yourself. No invented metrics, no fake engagement numbers — ever.',
  },
  {
    title: 'Exports that respect your brand',
    body: 'Client-ready PDF calendars and reports with your brand kit, plus CSV, XLSX, ICS, PNG and SVG exports, and passphrase-encrypted backups.',
  },
];

const EXAMPLE_POSTS: Record<number, { label: string; color: string }[]> = {
  3: [{ label: 'IG · Product tip', color: '#e1306c' }],
  5: [{ label: 'TikTok · Behind the scenes', color: '#111111' }],
  9: [
    { label: 'LinkedIn · Case study', color: '#0a66c2' },
    { label: 'X · Announcement', color: '#333333' },
  ],
  12: [{ label: 'IG · Carousel: 5 mistakes', color: '#e1306c' }],
  17: [{ label: 'YouTube · Tutorial', color: '#ff0000' }],
  21: [{ label: 'FB · Community question', color: '#1877f2' }],
  26: [{ label: 'IG · Customer story', color: '#e1306c' }],
};

export default function LandingPage() {
  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Social Media Calendar',
            url: BASE,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web browser',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description:
              'Free, privacy-first social media content calendar. Plan, approve and analyze posts for 15 platforms — data stays in your browser.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The social media calendar that keeps your content on your device
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Plan posts for Instagram, TikTok, LinkedIn, YouTube, X and ten more platforms.
            Organize campaigns, balance your content pillars, run approvals and track
            results — free, with no sign-up, and with every caption stored privately in
            your browser instead of on someone else&rsquo;s server.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              Open the free calendar
            </Link>
            <a
              href="#features"
              className="rounded-md border border-border px-5 py-3 font-medium hover:bg-muted"
            >
              See what it does
            </a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            No account. No uploads. Works offline after the first visit.
          </p>
        </div>

        {/* Example preview — illustrative sample content, rendered server-side */}
        <figure className="mt-10 overflow-hidden rounded-xl border border-border shadow-sm">
          <figcaption className="border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            Example preview — a planned month with sample posts
          </figcaption>
          <div className="grid grid-cols-7 text-sm" role="img" aria-label="Illustration of a planned content month with posts on several days">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="border-b border-border bg-muted/20 px-2 py-1 font-medium">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div key={day} className="min-h-16 border-b border-r border-border/60 p-1.5">
                <span className="text-xs text-muted-foreground">{day}</span>
                {(EXAMPLE_POSTS[day] ?? []).map((p) => (
                  <span
                    key={p.label}
                    className="mt-1 block truncate rounded px-1 py-0.5 text-[11px] text-white"
                    style={{ backgroundColor: chipBackground(p.color) }}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </figure>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Everything a content team actually needs</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-lg border border-border p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdSlot id="socialcalendar-landing-mid" format="horizontal-banner" />
      </div>

      {/* Platforms */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Plan for 15 platforms in one place</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Each platform in the planner carries its current caption limits, image and
          video dimensions, and hashtag guidance, so what you prepare fits where it
          will be published.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <li
              key={p.id}
              className="rounded-full border border-border px-3 py-1 text-sm"
            >
              <span
                aria-hidden
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">From idea to published, in four steps</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Capture', 'Drop ideas into the idea bank or start from 100+ industry templates.'],
            ['Plan', 'Drag posts onto the calendar; the scheduler suggests times and spots gaps.'],
            ['Approve', 'Move posts through review with checklists and reviewer notes.'],
            ['Measure', 'Log results or import them by CSV and see what actually worked.'],
          ].map(([title, body], i) => (
            <li key={title} className="rounded-lg border border-border p-5">
              <span className="text-sm font-bold text-primary">Step {i + 1}</span>
              <h3 className="mt-1 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
          <h2 className="text-3xl font-bold">Private by architecture, not by promise</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Most planners upload your unpublished campaigns, client notes and media to
            their cloud. This one cannot: there is no server database for calendar
            content at all. Everything is stored in your browser&rsquo;s local database,
            share links carry their data inside the link itself (never through a
            server), and backups are files you hold — optionally encrypted with a
            passphrase only you know.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>No account, no sign-up wall, no content tracking.</li>
            <li>Backups and exports are generated on your device.</li>
            <li>Delete everything, permanently, in two clicks from the workspace.</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/app"
            className="inline-block rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Start planning — it&rsquo;s free
          </Link>
        </div>
      </section>
    </main>
  );
}
