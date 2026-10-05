import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free vCard QR Code Generator — Digital Business Card',
  description: 'Create a vCard QR code that saves your full contact details directly into the scanner\'s address book. Replace paper business cards with a stylish, sustainable digital alternative.',
  alternates: { canonical: 'https://qrstudio.app/vcard-qr-code-generator' },
};

export default function VcardLandingPage() {
  return (
    <LandingGenerator
      type="vcard"
      data={{
        title: 'Free vCard QR Code Generator — Digital Business Card',
        description: 'Create a vCard QR code that saves your full contact details directly into the scanner\'s address book. Replace paper business cards with a stylish, sustainable digital alternative.',
        howTo: [
          'Select the vCard QR type and fill in your name, phone number, email, and organisation.',
          'Optionally add your website URL and a job title for a complete digital business card.',
          'Download your QR code, print it on your business cards, or share it digitally.',
        ],
        faqs: [
          { q: 'What contact fields does the vCard QR code support?', a: 'The QR Studio vCard type supports name, phone number, email address, and organisation. For a more detailed contact record with multiple numbers, address, and social links, try the Business Card type.' },
          { q: 'How does a recipient save my details from a vCard QR code?', a: 'When scanned with the native camera app on iOS or Android, the phone prompts the user to create a new contact. It pre-fills all the fields you encoded, and the user just taps Save.' },
          { q: 'Does a vCard QR code expire?', a: 'No. Static QR codes do not expire. The contact details are stored inside the QR code pattern itself and will work as long as the printed code is readable.' },
        ],
        relatedTypes: [
          { type: 'email', label: 'Email Generator', slug: '/?type=email' },
          { type: 'url', label: 'URL Generator', slug: '/url-qr-code-generator' },
        ],
      }}
    />
  );
}
