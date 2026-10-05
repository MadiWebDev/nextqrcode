import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free URL QR Code Generator — Link Anything with a QR Code',
  description: 'Turn any website URL into a scannable QR code in seconds. Perfect for marketing materials, business cards, and product packaging. Download in PNG, SVG, or PDF format for free.',
  alternates: { canonical: 'https://freeqrcode.tools/url-qr-code-generator' },
};

export default function UrlLandingPage() {
  return (
    <LandingGenerator
      type="url"
      data={{
        title: 'Free URL QR Code Generator — Link Anything with a QR Code',
        description: 'Turn any website URL into a scannable QR code in seconds. Perfect for marketing materials, business cards, and product packaging. Download in PNG, SVG, or PDF format for free.',
        howTo: [
          'Select the URL QR type and paste or type the full website address, including the https:// prefix.',
          'Customise the design — pick a colour scheme, dot style, or upload your logo to brand the QR code.',
          'Click Download and choose PNG for digital use or SVG for print-quality output.',
        ],
        faqs: [
          { q: 'What is the difference between a static and a dynamic URL QR code?', a: 'A static QR code encodes the URL directly. It cannot be changed after printing. A dynamic QR code points to a short link that you can redirect later. QR Studio currently generates static codes, which are free forever and require no account.' },
          { q: 'How small can a URL QR code be and still scan reliably?', a: 'For a standard URL, a printed size of 2 cm × 2 cm typically scans well at 25–30 cm distance. Shorter URLs produce simpler QR codes that can be printed even smaller.' },
          { q: 'Can I use https redirect links like bit.ly in a URL QR code?', a: 'Yes. Any valid URL works — short links, UTM-tagged links, deep links, and standard https addresses all encode correctly.' },
        ],
        relatedTypes: [
          { type: 'wifi', label: 'WiFi Generator', slug: '/wifi-qr-code-generator' },
          { type: 'vcard', label: 'vCard Generator', slug: '/vcard-qr-code-generator' },
          { type: 'whatsapp', label: 'WhatsApp Generator', slug: '/whatsapp-qr-code-generator' },
        ],
      }}
    />
  );
}
