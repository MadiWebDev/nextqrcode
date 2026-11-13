import type { Metadata } from 'next';
import { ViewInvoice } from './ViewInvoice';

/**
 * Read-only view of an invoice shared with a view-QR link (see _lib/share.ts).
 * The invoice data lives in the URL fragment, which is only ever read by the
 * client component below — nothing here is rendered or stored server-side,
 * and the page is kept out of search indexes.
 */
export const metadata: Metadata = {
  title: 'View shared invoice — Invoice Generator',
  description: 'A read-only invoice shared with a private view link.',
  robots: { index: false, follow: false },
};

export default function SharedInvoicePage() {
  return <ViewInvoice />;
}
