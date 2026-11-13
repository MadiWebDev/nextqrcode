import Link from 'next/link';
import { Lock } from 'lucide-react';

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Tools',
    links: [
      { href: '/resize-image', label: 'Image Resizer' },
      { href: '/bulk-image-resizer', label: 'Bulk Image Resizer' },
      { href: '/compress-image', label: 'Image Compressor' },
      { href: '/compress-image-to-100kb', label: 'Compress to Exact KB' },
      { href: '/image-converter', label: 'Image Converter' },
      { href: '/crop-image', label: 'Crop Image' },
      { href: '/rotate-image', label: 'Rotate Image' },
      { href: '/flip-image', label: 'Flip Image' },
    ],
  },
  {
    heading: 'About',
    links: [
      { href: '/#privacy', label: 'Privacy — how it works' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Family',
    links: [
      { href: 'https://freeqrcode.tools/', label: 'Free QR Code Tools' },
      { href: 'https://invoicegenerator.freeqrcode.tools/', label: 'Invoice Generator' },
    ],
  },
];

export function ImageFooter() {
  return (
    <footer className="imageresizer-foot border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark served from /public */}
              <img src="/imageresizer-logo.svg" alt="" width={40} height={40} className="w-10 h-10" />
              <span className="leading-tight">
                <span className="block font-bold text-base">Image Resizer</span>
                <span className="block text-[11px] text-muted-foreground">by Free QR Code Tools</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Resize, compress, convert and edit images online — free, with no
              sign-up and no watermark.
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
              <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
              Your images are processed directly in your browser. They are not
              uploaded to our servers for normal image-processing operations.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={`Footer — ${col.heading}`}>
              <h3 className="text-sm font-semibold mb-3">{col.heading}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Free QR Code Tools — Image Resizer. Free for personal and commercial use.</p>
          <p>Made for the open web. No images ever leave your device.</p>
        </div>
      </div>
    </footer>
  );
}
