import type { Metadata } from 'next';
import { LandingGenerator } from '@/components/LandingGenerator';

export const metadata: Metadata = {
  title: 'Free UPI QR Code Generator — Accept Payments Instantly',
  description: 'Create a UPI payment QR code that lets customers pay you directly through BHIM, Google Pay, PhonePe, Paytm, and any other UPI app. Set a fixed amount or leave it open.',
  alternates: { canonical: 'https://qrstudio.app/upi-qr-code-generator' },
};

export default function UpiLandingPage() {
  return (
    <LandingGenerator
      type="upi"
      data={{
        title: 'Free UPI QR Code Generator — Accept Payments Instantly',
        description: 'Create a UPI payment QR code that lets customers pay you directly through BHIM, Google Pay, PhonePe, Paytm, and any other UPI app. Set a fixed amount or leave it open.',
        howTo: [
          'Select the UPI QR type and enter your UPI ID (VPA), for example yourname@upi or 9999999999@paytm.',
          'Enter your name, an optional fixed amount, and a transaction note.',
          'Download the QR code and display it at your checkout counter, on invoices, or share it digitally.',
        ],
        faqs: [
          { q: 'Which apps can scan a UPI QR code?', a: 'Any UPI-enabled app in India can scan the QR code — BHIM, Google Pay, PhonePe, Paytm, Amazon Pay, banking apps, and many more. The QR code uses the standard upi://pay URI scheme.' },
          { q: 'Can I set a fixed amount in the QR code?', a: 'Yes. Fill in the "Amount" field and the UPI app will pre-fill that amount. The payer can still modify it before confirming the transaction.' },
          { q: 'Is it safe to share a UPI QR code publicly?', a: 'Yes. A UPI QR code only lets people send money to you. It does not expose any bank account details or allow withdrawals.' },
        ],
        relatedTypes: [
          { type: 'paypal', label: 'PayPal Generator', slug: '/?type=paypal' },
          { type: 'bitcoin', label: 'Bitcoin Generator', slug: '/bitcoin-qr-code-generator' },
        ],
      }}
    />
  );
}
