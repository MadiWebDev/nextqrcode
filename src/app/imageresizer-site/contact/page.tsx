import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock3, Mail, MessageCircleQuestion } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ImageContactForm } from '../_components/ImageContactForm';

const DESCRIPTION =
  'Questions, feedback or a feature request for the free Image Resizer? Email the QR Studio team — we aim to reply within one to two business days.';

export const metadata: Metadata = {
  title: 'Contact — Image Resizer',
  description: DESCRIPTION,
  alternates: { canonical: 'https://imageresizer.freeqrcode.tools/contact' },
  openGraph: {
    title: 'Contact — Image Resizer',
    description: DESCRIPTION,
    url: 'https://imageresizer.freeqrcode.tools/contact',
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
  twitter: { card: 'summary_large_image', title: 'Contact — Image Resizer', description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const email = siteConfig.contactEmail;

  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <h1 className="text-4xl font-extrabold tracking-tight">Talk to a human</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We are a small team, and we read everything ourselves. Whether a tool handled your file
          badly, a size you need is missing, or you have a privacy concern — write to us and a
          person who works on this product will answer. Before you write, the{' '}
          <Link href="/#faq" className="text-primary underline underline-offset-2">
            FAQ on the home page
          </Link>{' '}
          answers the most common questions instantly, including how processing works (in your
          browser — which is why we can never see or recover your files for you).
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="mt-3 font-semibold">Email us directly</h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Prefer your own email app? Write to{' '}
              <a
                href={`mailto:${email}`}
                className="text-primary font-medium underline underline-offset-2"
              >
                {email}
              </a>{' '}
              and include the tool&rsquo;s name and your browser if you are reporting a problem.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Clock3 className="w-6 h-6 text-primary" />
            <h2 className="mt-3 font-semibold">When you will hear back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              We aim to reply within one to two business days. Feature requests are logged and
              reviewed in batches — several of the tools on this site exist because a user asked.
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <MessageCircleQuestion className="w-6 h-6 text-primary" /> Send a message
        </h2>
        <div className="mt-5">
          <ImageContactForm email={email} />
        </div>

        <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
          One important note: because your images are processed only in your own browser, we cannot
          see them, and a description usually helps us more than the file itself. If a tool
          misbehaves, tell us the tool, your browser, and the image&rsquo;s format and size — and
          please do not email images you need to keep private. The{' '}
          <Link href="/guides" className="text-primary underline underline-offset-2">
            guides
          </Link>{' '}
          cover the common jobs step by step.
        </p>
      </section>
    </div>
  );
}
