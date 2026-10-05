import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free WiFi QR Code Generator — Share Your Network Instantly',
  description: 'Create a WiFi QR code that connects guests to your network in one scan — no password typing, no errors. Download PNG, SVG, or PDF for free.',
  alternates: { canonical: 'https://qrstudio.app/wifi-qr-code-generator' },
};

export default function WifiLandingPage() {
  return (
    <LandingGenerator
      type="wifi"
      data={{
        title: 'Free WiFi QR Code Generator — Share Your Network Instantly',
        description: 'Create a WiFi QR code that connects guests to your network in one scan — no password typing, no errors. Download PNG, SVG, or PDF for free. Works on every modern smartphone.',
        howTo: [
          'Select the WiFi QR type and enter your network name (SSID) exactly as it appears in your router settings.',
          'Choose your encryption type — WPA/WPA2 is the most common. Enter your WiFi password.',
          'Optionally customise colours and add a logo, then click Download to save your QR code as PNG or SVG.',
        ],
        faqs: [
          { q: 'Is my WiFi password stored anywhere?', a: 'No. All QR generation happens entirely in your browser using JavaScript. Your password never leaves your device and is never sent to any server.' },
          { q: 'Which devices can scan a WiFi QR code natively?', a: 'Android 10 and above can scan WiFi QR codes with the built-in Camera app. iOS 11 and above on iPhone and iPad also support scanning WiFi QR codes natively without a third-party app.' },
          { q: 'Does the WiFi QR code work for hidden networks?', a: 'The WIFI QR standard includes an H:true flag for hidden networks. Check the hidden-network option in the form and the QR code will include this flag so compatible devices can connect.' },
          { q: 'Can I print the WiFi QR code for my café or hotel?', a: 'Absolutely. Download the SVG version for the sharpest results at any print size. We recommend a minimum printed size of 2 cm × 2 cm for reliable scanning at a normal reading distance.' },
        ],
        relatedTypes: [
          { type: 'url', label: 'URL Generator', slug: '/url-qr-code-generator' },
          { type: 'vcard', label: 'vCard Generator', slug: '/vcard-qr-code-generator' },
        ],
      }}
    />
  );
}
