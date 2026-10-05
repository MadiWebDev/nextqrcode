import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free Bitcoin QR Code Generator — Crypto Payments Made Easy',
  description: 'Generate a Bitcoin payment QR code from a wallet address with an optional amount and label. Compatible with all major Bitcoin wallets. Download PNG or SVG.',
  alternates: { canonical: 'https://qrstudio.app/bitcoin-qr-code-generator' },
};

export default function BitcoinLandingPage() {
  return (
    <LandingGenerator
      type="bitcoin"
      data={{
        title: 'Free Bitcoin QR Code Generator — Crypto Payments Made Easy',
        description: 'Generate a Bitcoin payment QR code from a wallet address with an optional amount and label. Compatible with all major Bitcoin wallets. Download PNG or SVG.',
        howTo: [
          'Select the Bitcoin QR type and paste your Bitcoin wallet address (bc1q..., 1..., or 3... format).',
          'Optionally set a BTC amount, a label, and a message to create a fully descriptive payment request.',
          'Download the QR code and share it with payers or display it at point of sale.',
        ],
        faqs: [
          { q: 'What Bitcoin address formats are supported?', a: 'All standard Bitcoin address formats work: Legacy (1...), P2SH (3...), and native SegWit (bc1q...). The QR code uses the BIP-21 bitcoin: URI scheme which is supported by all major wallets.' },
          { q: 'Can I set a specific BTC amount?', a: 'Yes. Enter the amount in BTC in the Amount field. Most wallets will pre-fill the amount but allow the payer to change it.' },
          { q: 'Is it safe to share a Bitcoin payment QR code?', a: 'Yes. The QR code encodes only your public receiving address and payment parameters. It cannot expose your private key or allow access to your wallet.' },
        ],
        relatedTypes: [
          { type: 'ethereum', label: 'Ethereum Generator', slug: '/?type=ethereum' },
          { type: 'upi', label: 'UPI Generator', slug: '/upi-qr-code-generator' },
        ],
      }}
    />
  );
}
