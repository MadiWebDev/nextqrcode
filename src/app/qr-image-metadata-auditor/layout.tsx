import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * Metadata for /qr-image-metadata-auditor. The page itself is a client
 * component (it parses files in the browser), so its metadata lives in
 * this layout — the same pattern as the other client tool pages.
 * Added in Step 5 of the indexing program: this page previously served
 * no canonical at all (seo-agent E-046).
 */
export const metadata: Metadata = {
  title: 'QR Image Metadata Auditor — QR Studio',
  description:
    'Upload a QR image file and see the metadata actually stored inside it — camera make and model, date taken, software, and GPS coordinates — with a plain-language privacy warning for each field. Everything runs in your browser; the file is never uploaded.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-image-metadata-auditor',
  },
  openGraph: {
    title: 'QR Image Metadata Auditor — QR Studio',
    description:
      'Upload a QR image file and see the metadata actually stored inside it — camera make and model, date taken, software, and GPS coordinates — with a plain-language privacy warning for each field. Everything runs in your browser; the file is never uploaded.',
    url: 'https://freeqrcode.tools/qr-image-metadata-auditor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Image Metadata Auditor — QR Studio',
    description:
      'See the EXIF and PNG metadata stored inside a QR image — camera, dates, software, GPS — with a privacy warning for each field. Parsed locally in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
