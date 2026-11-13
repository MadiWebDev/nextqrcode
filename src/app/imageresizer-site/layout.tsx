import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ImageFooter } from './_components/ImageFooter';
import { ImageHeader } from './_components/ImageHeader';

const TITLE = 'Free Online Image Resizer – Resize, Compress & Convert Images | Free QR Code Tools';
const DESCRIPTION =
  'Resize, compress, crop and convert images online for free. Optimize JPG, PNG, WebP and more, process images in bulk, and create social media and passport photos privately in your browser.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://imageresizer.freeqrcode.tools/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://imageresizer.freeqrcode.tools/',
    type: 'website',
    siteName: 'Free QR Code Tools – Image Resizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // The image site's own brand identity (overrides the root layout's QR
  // logo icons for imageresizer-site routes only; the main site is unaffected).
  icons: {
    icon: [{ url: '/imageresizer-logo.svg', type: 'image/svg+xml' }],
    shortcut: '/imageresizer-logo.svg',
  },
};

/**
 * The image resizer site's own chrome. The main site's AppHeader / AppFooter
 * are hidden on these pages by the :has() rule in src/app/globals.css (the
 * rule lives in that external stylesheet — an inline <style> would be at the
 * mercy of CSP, the lesson learned on the invoice site).
 */
export default function ImageResizerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="imageresizer-site-root">
      <ImageHeader />
      {children}
      <ImageFooter />
    </div>
  );
}
