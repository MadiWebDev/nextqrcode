import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'The terms of use for the free Social Media Calendar by QR Studio: what the planner does, what it does not do, and your responsibilities for the content you plan with it.';

export const metadata: Metadata = {
  title: 'Terms of Use — Social Media Calendar',
  description: DESCRIPTION,
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/terms' },
  openGraph: {
    title: 'Terms of Use — Social Media Calendar',
    description: DESCRIPTION,
    url: 'https://socialcalendar.freeqrcode.tools/terms',
    type: 'website',
    siteName: 'Social Media Calendar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use — Social Media Calendar',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: '1. The service',
    paragraphs: [
      'The Social Media Calendar ("the planner") is a free, browser-based content planning application provided by QR Studio as part of the freeqrcode.tools family. It lets you plan posts for multiple social platforms, organise campaigns and content pillars, track approval statuses, record results, and export your plan — with everything stored in your own browser. By using the planner you accept these terms. If you do not accept them, please do not use the planner.',
    ],
  },
  {
    heading: '2. A planning tool, not a publishing tool',
    paragraphs: [
      'The planner helps you prepare, organise and review content. It does not connect to your social media accounts and it does not publish, schedule or send posts to any platform. Publishing happens in each platform\u2019s own app, under your control and your accounts. Dates and times in the planner are plans, not commitments made to any platform.',
    ],
  },
  {
    heading: '3. Free means free',
    paragraphs: [
      'There is no charge for using the planner, no account to create, and no paid tier. We may support the wider freeqrcode.tools platform with advertising; ads never alter your content, and the files you export contain no advertising.',
    ],
  },
  {
    heading: '4. Your content is your responsibility',
    paragraphs: [
      'You keep all rights in the posts, captions, campaigns and other content you create with the planner, and you are responsible for it — including having the right to use any text, image references and brand assets you plan with, and complying with each platform\u2019s own rules, advertising standards and the law in the places you publish. Platform names mentioned in the planner belong to their respective owners; the planner is a planning aid and is not affiliated with or endorsed by the platforms it helps you plan for.',
      'Suggestions inside the planner — best times to post, holiday dates, caption length guidance — are planning aids based on general data. Holiday observances in particular can shift, including dates set by moon sighting. Verify anything time-critical before you rely on it.',
    ],
  },
  {
    heading: '5. Your data stays with you',
    paragraphs: [
      'As described in the privacy policy, your workspaces are stored only in your browser. You are responsible for keeping your own records: export backups regularly, and keep them somewhere safe. We cannot recover data lost when browser storage is cleared, a device fails, or a backup file is misplaced, because we never held a copy. Share links you create carry the shared content inside the link itself; who you send a link to is your decision and your responsibility.',
    ],
  },
  {
    heading: '6. Acceptable use',
    paragraphs: [
      'Use the planner only for lawful content planning. You must not use it to plan spam, deceptive or unlawful campaigns; to infringe another party\u2019s rights; or to attempt to disrupt, probe or overload the platform that serves it.',
    ],
  },
  {
    heading: '7. No warranty',
    paragraphs: [
      'The planner is provided "as is" and "as available", without warranties of any kind, express or implied — including fitness for a particular purpose, uninterrupted availability, and freedom from errors. Browsers, devices and local storage behave differently; we work to keep the planner correct and reliable, but we do not guarantee that it will be error-free or that stored data will persist in your browser.',
    ],
  },
  {
    heading: '8. Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, QR Studio is not liable for any indirect or consequential loss arising from use of the planner — including a missed posting date, a lost calendar, or a campaign outcome — and our total liability in connection with the planner is limited to the amount you paid to use it, which is zero. Nothing in these terms limits liability that cannot lawfully be limited.',
    ],
  },
  {
    heading: '9. Changes',
    paragraphs: [
      'We may improve, change or withdraw features, and may update these terms; the current version will always be published on this page with its revision date. Continuing to use the planner after a change takes effect means you accept the updated terms. If a future change ever introduced accounts or server storage, it would be introduced as an explicit opt-in, not silently.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of use</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Social Media Calendar by QR Studio
          (socialcalendar.freeqrcode.tools)
        </p>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}
        <p className="mt-10 text-sm text-muted-foreground">
          Questions about these terms? See the{' '}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact page
          </Link>{' '}
          and the{' '}
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
