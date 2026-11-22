import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Eye,
  Lock,
  ScrollText,
} from 'lucide-react';

const DESCRIPTION =
  'Meet the free Social Media Calendar by QR Studio: why we built it, why it is free, and the principles behind it — private by architecture, no sign-up, honest planning.';

export const metadata: Metadata = {
  title: 'About — Social Media Calendar',
  description: DESCRIPTION,
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/about' },
  openGraph: {
    title: 'About — Social Media Calendar by QR Studio',
    description: DESCRIPTION,
    url: 'https://socialcalendar.freeqrcode.tools/about',
    type: 'website',
    siteName: 'Social Media Calendar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Social Media Calendar by QR Studio',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'Private by architecture',
    text: 'Your workspaces live in your browser\u2019s own database, on your device. There is no account to create and no server holding your content calendar — privacy here is the design, and the policy page just describes it.',
  },
  {
    icon: Eye,
    title: 'Honest about what it does',
    text: 'This is a planning tool. It prepares, organises and reviews your content, and it says so plainly: publishing happens in each platform\u2019s own app, where you stay in control. It will never pretend to post for you.',
  },
  {
    icon: CheckCircle2,
    title: 'No sign-up, no catch',
    text: 'No account, no subscription, no trial clock and no feature held back for a paid tier. The full planner — views, campaigns, approvals, analytics and exports — works the moment the page loads.',
  },
];

const CAPABILITIES = [
  'Ten calendar views, from month grids to campaign timelines',
  'Planning for 15 platforms, with per-platform caption guidance',
  'Campaigns and content pillars with a target mix to balance against',
  'Approval statuses that keep drafts, reviews and sign-offs straight',
  'An idea library and holiday dates to plan around',
  'Analytics you record yourself, charted against your plan',
  'Exports to CSV, spreadsheet and calendar (ICS) files',
  'Password-encrypted backups and read-only share links',
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          A content calendar that keeps your plans on your own device
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          The Social Media Calendar is built by <strong className="text-foreground">QR Studio</strong>,
          the small team behind{' '}
          <a href="https://freeqrcode.tools" className="text-primary underline underline-offset-2">
            freeqrcode.tools
          </a>{' '}
          — a family of free, browser-based tools. This one is for the creators, small businesses
          and freelancers who plan their own social media and are tired of planning it in a
          spreadsheet — or paying a monthly fee to a platform that wants their account passwords
          as the price of a calendar.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Most planning tools start by asking you to connect every social account you own. That
          connection is what you are really paying for, and it comes with a server somewhere
          holding your unpublished campaigns, your drafts and your strategy. For a large team
          publishing hundreds of posts, that trade can make sense. For most people planning a
          month of content, it is far more access than the job needs.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          This planner takes the other route. Everything runs in your browser: your workspaces are
          stored on your device, exports are files you download, and sharing a plan means sending
          a link that carries the content inside it — not inviting someone into an account. You
          plan here, and you publish in each platform&rsquo;s own app, where your accounts stay
          yours.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Why is it free?</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Because it can be. A tool that runs in your browser has no servers storing your calendar
          and no per-user infrastructure to pay for — our costs look like a static website, not a
          subscription platform. The wider freeqrcode.tools family is supported by the main site,
          and every tool in it follows the same rule: free to use, in full, with no account.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">The principles</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <p.icon className="w-5 h-5" />
              </span>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold tracking-tight">What it does</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <li key={c} className="flex gap-2.5 text-muted-foreground leading-relaxed">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          The{' '}
          <Link href="/guides" className="text-primary underline underline-offset-2">
            guides
          </Link>{' '}
          show the method behind the tool — building a month of content from pillars, batching a
          week of posts in one sitting, and reviewing what actually performed — written from
          practice, for people who do their own marketing.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Who uses it</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Solo creators planning a month of posts in one sitting. Small businesses keeping their
          offers, seasons and holidays in one view. Freelancers holding a separate workspace per
          client and sharing a read-only link instead of a login. What they share is not an
          industry — it is a preference: a proper planning tool that does not ask for their
          accounts, their audience data, or a monthly fee.
        </p>
        <div className="mt-10 rounded-3xl border border-border bg-card p-8 text-center">
          <CalendarRange className="w-8 h-8 text-primary mx-auto" />
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Try it — open the workspace</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create a workspace, drop in your first week of posts, and export the plan. No account,
            nothing to install, nothing uploaded.
          </p>
          <Link
            href="/app"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <CalendarRange className="w-4 h-4" /> Open the free workspace
          </Link>
          <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Built by QR Studio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> Guides on planning method
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Part of freeqrcode.tools
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
