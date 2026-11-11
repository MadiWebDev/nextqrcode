import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Professional Invoices in Minutes',
  description:
    'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/' },
  openGraph: {
    title: 'Free Invoice Generator — Professional Invoices in Minutes',
    description:
      'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
    url: 'https://invoicegenerator.freeqrcode.tools/',
    type: 'website',
    siteName: 'Invoice Generator by QR Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — Professional Invoices in Minutes',
    description:
      'Create and track professional invoices for free: save your business profile and clients, pick a template, add tax and a payment QR, and download a polished PDF.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
