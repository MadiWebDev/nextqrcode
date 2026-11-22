import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  Images,
  Lock,
  MousePointerClick,
  ScrollText,
} from 'lucide-react';

const DESCRIPTION =
  'Meet the free Image Resizer by QR Studio: why we built it, why it is free, and the principles behind it — your files stay on your device, no sign-up, no watermark.';

export const metadata: Metadata = {
  title: 'About — Image Resizer',
  description: DESCRIPTION,
  alternates: { canonical: 'https://imageresizer.freeqrcode.tools/about' },
  openGraph: {
    title: 'About — Image Resizer by QR Studio',
    description: DESCRIPTION,
    url: 'https://imageresizer.freeqrcode.tools/about',
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Image Resizer by QR Studio',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'Private by architecture',
    text: 'Every tool processes your files in your browser, on your device. Your photos are never uploaded to our servers — privacy here is not a promise in a policy, it is how the tools are built. The policy just describes it.',
  },
  {
    icon: CheckCircle2,
    title: 'No sign-up, no watermark',
    text: 'No account, no email wall, no per-file credits and no watermark stamped on your downloads. The tool you open is the whole tool, and it works the moment the page loads.',
  },
  {
    icon: Images,
    title: 'Real tools, not demos',
    text: 'Bulk processing for a whole folder, compression to an exact file size in KB, and a pipeline builder that chains steps together. These are the jobs people actually have, so they are the tools we built.',
  },
];

const CAPABILITIES = [
  'Resize, compress, crop, rotate and flip JPG, PNG, WebP and more',
  'Bulk resize, compress, convert and watermark for whole folders',
  'Compress an image to an exact target size, such as 100 KB',
  'Passport and ID photos to common official sizes',
  'Social media sizes, plus an Instagram grid splitter',
  'Favicon and app icon generator, and an OG image generator',
  'GIF maker, PDF to images and images to PDF',
  'EXIF metadata viewer and remover, blur and redact, circle crop',
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Proper image tools that never ask for your files
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          The Image Resizer is built by <strong className="text-foreground">QR Studio</strong>, the
          small team behind{' '}
          <a href="https://freeqrcode.tools" className="text-primary underline underline-offset-2">
            freeqrcode.tools
          </a>{' '}
          — a family of free, browser-based tools for people who need a job done quickly and would
          rather not hand their files to a stranger&rsquo;s server to get it done.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Most online image tools work the same way: you upload a photo, it sits on a server
          somewhere, you wait in a queue, and the download arrives with a watermark, a size limit,
          or a request to create an account. Desktop software avoids that, at the price of
          installing and learning a program built for professionals when all you needed was a
          product photo at 1200 pixels wide.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Modern browsers can do this work themselves. Every tool here runs on your device, using
          the image engine already inside your browser. Files open instantly because they never
          travel, bulk jobs run at the speed of your machine, and a photo of your family is treated
          the same as a product shot: it stays yours.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Why is it free?</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Because it can be. A tool that runs in your browser costs us roughly what a static
          website costs — there are no servers chewing through your uploads and no storage bill for
          other people&rsquo;s photos. The wider freeqrcode.tools family is supported by the main
          site, and every tool in it follows the same rule: free to use, in full, with no account.
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
          walk through the common jobs end to end — preparing a passport photo, getting a photo
          under a portal&rsquo;s file-size limit, stripping location data before you share a
          picture — using only the tools on this site.
        </p>
        <h2 className="mt-10 text-2xl font-bold tracking-tight">Who uses it</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Online sellers resizing a folder of product photos to one consistent size. Job applicants
          making a passport photo and then squeezing it under an application portal&rsquo;s limit.
          Social media managers cutting one image into the sizes five platforms demand. Website
          owners compressing page images so their sites load faster. Office staff turning scans
          into PDFs and PDFs back into images. The jobs differ; the pattern is the same — a file
          needs to change, and it needs to change now, without an account or an upload.
        </p>
        <div className="mt-10 rounded-3xl border border-border bg-card p-8 text-center">
          <MousePointerClick className="w-8 h-8 text-primary mx-auto" />
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Try it — pick a tool and drop an image in</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every tool is free and runs in this browser tab. Your file stays on your device from
            start to finish.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Images className="w-4 h-4" /> Browse the tools
          </Link>
          <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Built by QR Studio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> Guides for common jobs
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
