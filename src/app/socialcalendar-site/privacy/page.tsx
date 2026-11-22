import type { Metadata } from 'next';
import Link from 'next/link';

const DESCRIPTION =
  'How the Social Media Calendar handles your data: your workspaces, posts and campaigns are stored in your own browser and never uploaded. Read the full policy.';

export const metadata: Metadata = {
  title: 'Privacy Policy — Social Media Calendar',
  description: DESCRIPTION,
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/privacy' },
  openGraph: {
    title: 'Privacy Policy — Social Media Calendar',
    description: DESCRIPTION,
    url: 'https://socialcalendar.freeqrcode.tools/privacy',
    type: 'website',
    siteName: 'Social Media Calendar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Social Media Calendar',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[]; bullets?: string[] }[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'The Social Media Calendar has no accounts and no server-side copy of your planning. Your workspaces, posts, campaigns, captions and settings are stored in your browser\u2019s own database (IndexedDB), on your own device. They are never uploaded to us, never synced to a cloud account, and never visible to our team. The tool also never connects to your social media accounts: it does not ask for your passwords, your tokens, or permission to post on your behalf.',
    ],
  },
  {
    heading: 'What this means in practice',
    paragraphs: [
      'Browser-local storage has consequences you should understand, because they are the trade-off that buys the privacy above:',
    ],
    bullets: [
      'Your calendar lives on one device, in one browser. It does not follow you to your phone, another computer, or a different browser.',
      'Clearing your browser\u2019s site data, using private/incognito mode, or letting a cleaner tool wipe storage permanently deletes your workspaces. We cannot recover them — we never had them.',
      'Anyone who uses this browser on this device can open the workspace and see your planned content. On a shared computer, treat it like a notebook left open on the desk.',
      'The analytics screens chart figures you record yourself, such as reach or engagement you type in after posting. Nothing is pulled from your social accounts, because the tool never connects to them.',
    ],
  },
  {
    heading: 'Backups and exports are your responsibility — and your control',
    paragraphs: [
      'Because nothing is stored on our side, the backup feature is the safety net: it downloads a single file containing your workspaces, and importing that file restores them on any device. You can protect a backup with a password; the file is then encrypted with AES-256 before it is saved, and the password is never stored or sent anywhere — if you forget it, nobody can open the file, including us. Exports work the same way: the CSV, spreadsheet and calendar files the tool generates are created in your browser and downloaded by you. Where those files live, and who can open them, is entirely up to you.',
    ],
  },
  {
    heading: 'Share links carry the content inside them',
    paragraphs: [
      'A share link from this tool works differently from most. The posts you choose to share are encoded inside the link itself, in the part of the URL after the # symbol — the fragment, which browsers do not send to servers when a page loads. We never receive the content of a link you create. The practical consequence: anyone who has the link can open it and see exactly what you shared, and you can add password protection when that matters. Treat a share link the way you would treat the content itself — send it to the people it is meant for, and create a fresh one when the plan changes.',
    ],
  },
  {
    heading: 'The website itself: cookies, analytics and advertising',
    paragraphs: [
      'This site is served on the freeqrcode.tools platform and works like the rest of that platform. The pages themselves are delivered by our hosting provider, whose servers necessarily process standard technical information (such as your IP address and browser type) to serve the page and protect against abuse, in line with the hosting provider\u2019s own policies.',
      'The platform uses essential cookies required for the site to function, and — subject to the consent choices presented on the platform — analytics cookies that help us understand which tools are used, and advertising cookies used by ad partners to show and measure ads. None of these mechanisms receive the contents of your calendar: your posts and campaigns never leave your browser except inside backup files and share links that you create yourself.',
    ],
  },
  {
    heading: 'What we never do',
    paragraphs: [
      'We do not sell personal data — we hold none of yours to sell. We do not read your content calendar, we do not build profiles of what you plan to post, and we do not use your content to train models. There is no account database to breach, subpoena or leak.',
    ],
  },
  {
    heading: 'Contacting us about privacy',
    paragraphs: [
      'If you email us — for example through the contact page — your message travels through your own email provider to our mailbox, and we keep the correspondence so we can answer and follow up. That is the only route by which information about you reaches us, and you control what you put in it. For any privacy question, write to us via the contact page and choose the "Privacy question" topic.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      'If the way this site handles data ever changes — for example if an optional account or sync feature were introduced — this page will be updated and the change made prominent before it takes effect. The current version reflects the product as it exists today: no accounts, no uploads, browser-local data.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: November 2026 · Applies to the Social Media Calendar at
          socialcalendar.freeqrcode.tools, provided by QR Studio.
        </p>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-10 text-2xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed marker:text-primary">
                {section.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="mt-10 text-sm text-muted-foreground">
          See also our{' '}
          <Link href="/terms" className="text-primary underline underline-offset-2">
            terms of use
          </Link>{' '}
          and{' '}
          <Link href="/contact" className="text-primary underline underline-offset-2">
            contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
