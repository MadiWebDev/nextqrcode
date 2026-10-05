import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free WhatsApp QR Code Generator — Start Conversations Instantly',
  description: 'Generate a WhatsApp QR code that opens a chat to your number with an optional pre-filled message. Ideal for customer support, shops, restaurants, and personal promotion.',
  alternates: { canonical: 'https://freeqrcode.tools/whatsapp-qr-code-generator' },
};

export default function WhatsappLandingPage() {
  return (
    <LandingGenerator
      type="whatsapp"
      data={{
        title: 'Free WhatsApp QR Code Generator — Start Conversations Instantly',
        description: 'Generate a WhatsApp QR code that opens a chat to your number with an optional pre-filled message. Ideal for customer support, shops, restaurants, and personal promotion.',
        howTo: [
          'Select the WhatsApp QR type and enter your phone number in international format, for example +447911123456.',
          'Optionally type a pre-filled message that the scanner will see before sending.',
          'Download the QR code and place it on your website, flyer, storefront, or business card.',
        ],
        faqs: [
          { q: 'Does the recipient need WhatsApp installed to scan the QR code?', a: 'Yes. The QR code encodes a wa.me link which opens the WhatsApp app. If WhatsApp is not installed, the link opens whatsapp.com in a browser.' },
          { q: 'Does the pre-filled message send automatically?', a: 'No. The message appears in the text input field so the recipient can edit or delete it before tapping Send. This is a WhatsApp platform limitation designed to prevent spam.' },
          { q: 'Can I use a WhatsApp Business number?', a: 'Yes. Enter your WhatsApp Business number in international format. The QR code works identically for personal and business accounts.' },
        ],
        relatedTypes: [
          { type: 'sms', label: 'SMS Generator', slug: '/?type=sms' },
          { type: 'telegram', label: 'Telegram Generator', slug: '/?type=telegram' },
        ],
      }}
    />
  );
}
