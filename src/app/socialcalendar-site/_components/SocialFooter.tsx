import Link from 'next/link';

const FAMILY = [
  { href: 'https://freeqrcode.tools/', label: 'Free QR Code Generator' },
  { href: 'https://invoicegenerator.freeqrcode.tools/', label: 'Invoice Generator' },
  { href: 'https://imageresizer.freeqrcode.tools/', label: 'Image Resizer' },
];

export function SocialFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold">Social Media Calendar</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan, organize and analyze your social media content. Your calendar lives in
            your browser — no account, no uploads, no tracking of your content.
          </p>
        </div>
        <nav aria-label="Social Media Calendar">
          <p className="font-semibold">Product</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="text-muted-foreground hover:text-foreground" href="/app">Workspace</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/guides">Guides</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/#features">Features</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/#privacy">Privacy</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/#faq">FAQ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="font-semibold">Company</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="text-muted-foreground hover:text-foreground" href="/about">About</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/contact">Contact</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/privacy">Privacy</Link></li>
            <li><Link className="text-muted-foreground hover:text-foreground" href="/terms">Terms</Link></li>
          </ul>
        </nav>
        <nav aria-label="Family of free tools">
          <p className="font-semibold">Family</p>
          <ul className="mt-2 space-y-1 text-sm">
            {FAMILY.map((f) => (
              <li key={f.href}>
                <a className="text-muted-foreground hover:text-foreground" href={f.href}>
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Your data never leaves your device unless you export it yourself.
      </div>
    </footer>
  );
}
