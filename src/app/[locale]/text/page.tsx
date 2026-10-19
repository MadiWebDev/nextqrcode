/**
 * Localized Text tool page (Phase 8).
 *
 * There is no standalone English `/text` landing page (text generation lives
 * in the home studio), so this wrapper renders `LandingGenerator` with
 * `type="text"` directly. English/x-default hreflang targets `/`, the English
 * entry point for the text generator.
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LandingGenerator } from '@/components/LandingGenerator';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';
import { AdSlot } from '@/components/AdSlot';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Free Text QR Code Generator — Encode Any Text Instantly',
    description:
      'Turn plain text, notes, or messages into a scannable QR code in seconds. 100% client-side, no sign-up. Download in PNG, SVG, or PDF format for free.',
    alternates: {
      canonical: `${siteConfig.url}/${locale}/text`,
      languages: localizedLanguages('/', '/text'),
    },
  };
}

export default async function LocalizedTextPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AdSlot id={`locale-text-${locale}-top`} format="horizontal-banner" />
      <LandingGenerator
        type="text"
        data={{
          title: 'Free Text QR Code Generator — Encode Any Text Instantly',
          description:
            'Turn plain text, notes, or messages into a scannable QR code in seconds. 100% client-side, no sign-up. Download in PNG, SVG, or PDF format for free.',
          howTo: [
            'Select the Text QR type and type or paste your message into the content field.',
            'Customise the design — pick a colour scheme, dot style, or upload your logo to brand the QR code.',
            'Click Download and choose PNG for digital use or SVG for print-quality output.',
          ],
          faqs: [
            {
              q: 'How much text can a QR code hold?',
              a: 'A QR code can encode up to 4,296 alphanumeric characters. Longer text produces a denser code — keep messages concise for the most reliable scanning.',
            },
            {
              q: 'Does a text QR code need the internet to scan?',
              a: 'No. The text is encoded directly in the QR pattern, so it scans and displays offline on any device with a camera.',
            },
            {
              q: 'Is my text sent to a server?',
              a: 'No. All QR generation happens entirely in your browser using JavaScript. Your text never leaves your device.',
            },
          ],
          relatedTypes: [
            { type: 'url', label: 'URL Generator', slug: '/url-qr-code-generator' },
            { type: 'wifi', label: 'WiFi Generator', slug: '/wifi-qr-code-generator' },
            { type: 'vcard', label: 'vCard Generator', slug: '/vcard-qr-code-generator' },
          ],
        }}
      />
      <AdSlot id={`locale-text-${locale}-bottom`} format="horizontal-banner" />
    </>
  );
}
