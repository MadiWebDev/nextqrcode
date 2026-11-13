'use client';

// Read-only rendering of an invoice decoded from a view-QR share link.
// The payload arrives in the URL fragment (#…), which browsers never send
// to a server: decoding happens entirely here, and the shared invoice is
// rendered with the app's own preview, totals engine and PDF renderer —
// the same code paths the editor uses, so the numbers always match.
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Download, FileWarning, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InvoicePreview,
  STATUS_LABELS,
  computeTotals,
  effectiveStatus,
  normalizeInvoice,
  normalizeProfile,
  type Invoice,
  type Profile,
} from '../InvoiceApp';
import { buildInvoicePdf } from '../_lib/pdf';
import {
  INVOICE_SITE_HOST,
  decodeSharePayload,
  sharePayloadToInvoice,
  sharePayloadToProfile,
} from '../_lib/share';
import { event as gaEvent } from '@/lib/gtag';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'ready'; invoice: Invoice; profile: Profile };

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash(): string {
  return window.location.hash;
}

function readServerHash(): string {
  return '';
}

export function ViewInvoice() {
  // location.hash is an external store: the server snapshot is empty, so
  // prerendering and hydration agree on the loading state, then the real
  // fragment is read on the client.
  const rawHash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);

  const state = useMemo<ViewState>(() => {
    if (!rawHash) return { kind: 'loading' };
    const payload = decodeSharePayload(rawHash.replace(/^#/, ''));
    if (!payload) return { kind: 'error' };
    // Reconstructed objects go through the app's normalizers as a final
    // safety pass, exactly like invoices loaded from local storage.
    return {
      kind: 'ready',
      invoice: normalizeInvoice(sharePayloadToInvoice(payload)),
      profile: normalizeProfile(sharePayloadToProfile(payload)),
    };
  }, [rawHash]);

  useEffect(() => {
    if (state.kind === 'ready') {
      document.title = `Invoice ${state.invoice.number} — ${
        state.profile.businessName || 'Shared invoice'
      }`;
    }
  }, [state]);

  const totals = useMemo(
    () => (state.kind === 'ready' ? computeTotals(state.invoice) : null),
    [state]
  );

  if (state.kind === 'loading') {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Opening the shared invoice…</p>
      </div>
    );
  }

  if (state.kind === 'error' || !totals) {
    const homeHref =
      typeof window !== 'undefined' && window.location.hostname === INVOICE_SITE_HOST
        ? '/'
        : '/invoice-site';
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <FileWarning className="w-10 h-10 mx-auto text-amber-500" />
          <h1 className="mt-4 text-xl font-bold">This invoice link is incomplete</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The link or QR code does not contain a complete invoice — it may have been copied
            partially or damaged in transit. Please ask the sender to open the invoice, choose
            &ldquo;Share / QR code&rdquo; and send you a fresh link.
          </p>
          <Link
            href={homeHref}
            className="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create your own free invoice
          </Link>
        </div>
      </div>
    );
  }

  const { invoice, profile } = state;
  const eff = effectiveStatus(invoice);
  const stamp =
    eff === 'paid' ? 'PAID' : eff === 'overdue' ? 'OVERDUE' : eff === 'draft' ? 'DRAFT' : null;

  const downloadPdf = async () => {
    const doc = await buildInvoicePdf(invoice, profile, totals, STATUS_LABELS[eff], stamp);
    doc.save(`${invoice.number || 'invoice'}.pdf`);
    gaEvent({ action: 'pdf_downloaded', category: 'invoice', label: 'shared_view' });
  };

  const printPdf = async () => {
    const doc = await buildInvoicePdf(invoice, profile, totals, STATUS_LABELS[eff], stamp);
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="mr-auto min-w-52">
          <h1 className="text-xl font-bold">Invoice {invoice.number}</h1>
          <p className="text-sm text-muted-foreground">
            From {profile.businessName || 'the sender'} · shared as a read-only view — nothing
            here can be edited.
          </p>
        </div>
        <Button variant="outline" onClick={downloadPdf} className="gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <Button variant="outline" onClick={printPdf} className="gap-2">
          <Printer className="w-4 h-4" /> Print
        </Button>
      </div>

      <InvoicePreview inv={invoice} profile={profile} totals={totals} qrDataUrl="" />

      <p className="mt-4 text-xs text-muted-foreground">
        This invoice was shared with a private link generated by the free Invoice Generator. The
        invoice data travelled inside the link itself — it was not loaded from an account or a
        server.
      </p>
    </div>
  );
}
