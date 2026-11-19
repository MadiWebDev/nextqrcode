import Link from 'next/link';

const FAMILY_LINKS = [
  { href: 'https://freeqrcode.tools/', label: 'Free QR Code Generator' },
  { href: 'https://invoicegenerator.freeqrcode.tools/', label: 'Invoice Generator' },
  { href: 'https://imageresizer.freeqrcode.tools/', label: 'Image Resizer' },
  { href: 'https://socialcalendar.freeqrcode.tools/', label: 'Social Media Calendar' },
];

const SITE_LINKS = [
  { href: '/#templates', label: 'Resume templates' },
  { href: '/#features', label: 'Features' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/#faq', label: 'FAQ' },
];

export function ResumeFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">Resume Builder</p>
            <p className="mt-2 text-sm text-muted-foreground">
              A free resume and CV builder that runs entirely in your browser. No sign-up, no
              watermark, no paywalled downloads — and your resume data never leaves your device.
            </p>
          </div>
          <nav aria-label="Resume Builder pages">
            <p className="font-semibold">This site</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {SITE_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Family of free tools">
            <p className="font-semibold">Family</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {FAMILY_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Your resumes, photos and personal details are stored only in this browser. Clearing
          your browser data deletes them — export a backup from the builder if you need a copy.
        </p>
      </div>
    </footer>
  );
}
