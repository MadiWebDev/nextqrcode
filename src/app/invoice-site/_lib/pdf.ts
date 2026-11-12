// _lib/pdf.ts — professional invoice PDF renderer (jsPDF).
// Extracted from InvoiceApp so the editor download, the print/preview action
// and the multi-invoice ZIP export all produce identical documents.
// Layout is driven by the shared template definitions (_lib/templates.ts):
// A4/Letter, portrait/landscape, repeated items-table header on every page,
// page numbers, per-page footers, and PAID / OVERDUE / DRAFT stamps.
import JsPDF from 'jspdf';
import { toDataURL } from 'qrcode';
import { currencyDigits } from '../_data/currencies';
import { templateDef, type TemplateSettings } from './templates';

export interface PdfLineItem {
  description: string;
  detail: string;
  sku: string;
  unit: string;
  qty: number;
  unitPrice: number;
}

export interface PdfPayment {
  date: string;
  amount: number;
  method: string;
  note: string;
}

export interface PdfInvoice {
  number: string;
  issueDate: string;
  dueDate: string;
  poNumber: string;
  referenceNumber: string;
  docTitle: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  currency: string;
  items: PdfLineItem[];
  discountType: 'pct' | 'fixed';
  discountValue: number;
  taxLabel: string;
  taxPct: number;
  shipping: number;
  notes: string;
  terms: string;
  footerText: string;
  showQr: boolean;
  qrPayload: string;
  payments: PdfPayment[];
  template: string;
  templateSettings: TemplateSettings;
}

export interface PdfProfile {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  logoDataUrl: string;
  stampDataUrl: string;
  brandColor: string;
  paymentDetails: string;
}

export interface PdfTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  additionalCharges: number;
  roundingAdjustment: number;
  total: number;
  totalPaid: number;
  balance: number;
  lines: Array<{ net: number; discount: number }>;
}

export type PdfStamp = 'PAID' | 'OVERDUE' | 'DRAFT' | null;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return { r: 29, g: 78, b: 216 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** PDF money: ISO code instead of symbols the built-in Latin fonts cannot draw. */
function moneyPdf(value: number, currency: string): string {
  const digits = currencyDigits(currency);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
      .format(value)
      .replace(/\u00a0/g, ' ');
  } catch {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}`;
  }
}

const clampPct = (v: number): number => Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));

function addImageSafe(
  doc: JsPDF,
  dataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  if (!dataUrl) return;
  try {
    doc.addImage(dataUrl, dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG', x, y, w, h);
  } catch {
    /* images are decorative in the PDF */
  }
}

export async function buildInvoicePdf(
  inv: PdfInvoice,
  profile: PdfProfile,
  totals: PdfTotals,
  statusLabel: string,
  stamp: PdfStamp
): Promise<JsPDF> {
  const s = inv.templateSettings;
  const def = templateDef(inv.template);
  const doc = new JsPDF({
    orientation: s.orientation,
    unit: 'mm',
    format: s.paperSize,
  });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const brand = hexToRgb(profile.brandColor || '#1d4ed8');
  const secondary = hexToRgb(s.secondaryColor || profile.brandColor || '#1d4ed8');
  const dark = { r: 30, g: 41, b: 59 };
  const font = def.font === 'serif' ? 'times' : 'helvetica';
  const title = inv.docTitle || 'INVOICE';
  let y = 15;

  const qrPayloadText = inv.showQr ? inv.qrPayload.trim() || profile.paymentDetails.trim() : '';
  let qrDataUrl = '';
  if (qrPayloadText) {
    try {
      qrDataUrl = await toDataURL(qrPayloadText, { width: 280, margin: 1 });
    } catch {
      qrDataUrl = '';
    }
  }

  const drawTableHeader = () => {
    if (def.table === 'filled') {
      doc.setFillColor(brand.r, brand.g, brand.b);
      doc.rect(15, y - 4.5, pageW - 30, 7.5, 'F');
      doc.setTextColor(255, 255, 255);
    } else if (def.table === 'striped') {
      doc.setFillColor(243, 244, 246);
      doc.rect(15, y - 4.5, pageW - 30, 7.5, 'F');
      doc.setTextColor(30, 30, 30);
    } else {
      if (def.table === 'ruled') {
        doc.setDrawColor(160, 160, 160);
        doc.line(15, y + 3, pageW - 15, y + 3);
      }
      doc.setTextColor(30, 30, 30);
    }
    doc.setFont(font, 'bold');
    doc.setFontSize(9.5);
    doc.text('Description', 17, y + 1);
    doc.text('Qty', pageW - 78, y + 1, { align: 'right' });
    doc.text('Unit price', pageW - 44, y + 1, { align: 'right' });
    doc.text('Amount', pageW - 17, y + 1, { align: 'right' });
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'normal');
    y += 8;
  };

  const ensure = (need: number, inTable = false) => {
    if (y + need > pageH - 18) {
      doc.addPage();
      y = 15;
      if (inTable) drawTableHeader();
    }
  };

  /* ── Header ── */
  if (def.header === 'band') {
    const tone = def.bandTone === 'dark' ? dark : brand;
    doc.setFillColor(tone.r, tone.g, tone.b);
    doc.rect(0, 0, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(font, 'bold');
    doc.setFontSize(13);
    doc.text(profile.businessName || 'Your Business', 15, 13);
    doc.setFontSize(9);
    doc.setFont(font, 'normal');
    doc.text(profile.email || '', 15, 20);
    doc.text(profile.phone || '', 15, 25);
    doc.setFontSize(20);
    doc.setFont(font, 'bold');
    doc.text(title, pageW - 15, 14, { align: 'right' });
    doc.setFontSize(10);
    doc.text(inv.number, pageW - 15, 21, { align: 'right' });
    doc.setTextColor(30, 30, 30);
    y = 40;
    if (s.showLogo && profile.logoDataUrl) {
      addImageSafe(doc, profile.logoDataUrl, pageW - 45, y - 6, 30, 12);
    }
  } else if (def.header === 'serif') {
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.text(title, 15, y + 6);
    doc.setFontSize(12);
    doc.text(inv.number, pageW - 15, y + 6, { align: 'right' });
    y += 12;
    doc.setLineWidth(0.8);
    doc.line(15, y, pageW - 15, y);
    doc.setLineWidth(0.25);
    doc.line(15, y + 1.2, pageW - 15, y + 1.2);
    y += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(profile.businessName || 'Your Business', 15, y);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(
      [profile.address, profile.email, profile.phone].filter(Boolean).join('\n'),
      80
    ) as string[];
    lines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
    if (s.showLogo && profile.logoDataUrl) {
      addImageSafe(doc, profile.logoDataUrl, pageW - 45, y - 4, 30, 12);
    }
    y += 6 + lines.length * 4.5;
  } else if (def.header === 'centered') {
    if (s.showLogo && profile.logoDataUrl) {
      addImageSafe(doc, profile.logoDataUrl, pageW / 2 - 15, y - 4, 30, 12);
      y += 12;
    }
    doc.setFont(font, 'bold');
    doc.setFontSize(15);
    doc.text(profile.businessName || 'Your Business', pageW / 2, y + 4, { align: 'center' });
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      [profile.address, profile.email, profile.phone].filter(Boolean).join(' · '),
      pageW / 2,
      y + 9,
      { align: 'center' }
    );
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'bold');
    doc.setFontSize(19);
    doc.setTextColor(secondary.r, secondary.g, secondary.b);
    doc.text(title, pageW / 2, y + 18, { align: 'center' });
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'normal');
    doc.setFontSize(10.5);
    doc.text(inv.number, pageW / 2, y + 24, { align: 'center' });
    y += 30;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, y - 3, pageW - 15, y - 3);
  } else if (def.header === 'side') {
    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.rect(0, 0, 5, 34, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.text(title, 15, y + 5);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.text(inv.number, pageW - 15, y + 5, { align: 'right' });
    doc.setFont(font, 'bold');
    doc.setFontSize(11.5);
    doc.text(profile.businessName || 'Your Business', 15, y + 13);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    doc.text(
      [profile.address, profile.email, profile.phone].filter(Boolean).join(' · '),
      15,
      y + 18.5
    );
    if (s.showLogo && profile.logoDataUrl) {
      addImageSafe(doc, profile.logoDataUrl, pageW - 45, y + 10, 30, 12);
    }
    y += 26;
  } else {
    // plain (minimal)
    doc.setFont(font, 'normal');
    doc.setFontSize(15);
    doc.setTextColor(90, 90, 90);
    doc.text(title === 'INVOICE' ? 'Invoice' : title, 15, y + 4);
    doc.setFontSize(11);
    doc.text(inv.number, pageW - 15, y + 4, { align: 'right' });
    doc.setTextColor(30, 30, 30);
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, y, pageW - 15, y);
    y += 7;
    doc.setFont(font, 'bold');
    doc.setFontSize(10.5);
    doc.text(profile.businessName || 'Your Business', 15, y);
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(
      [profile.address, profile.email, profile.phone].filter(Boolean).join(' · '),
      pageW - 30
    ) as string[];
    lines.forEach((line, i) => doc.text(line, 15, y + 4.5 + i * 4.5));
    if (s.showLogo && profile.logoDataUrl) {
      addImageSafe(doc, profile.logoDataUrl, pageW - 45, y - 3, 30, 12);
    }
    y += 6 + lines.length * 4.5;
  }

  /* ── Meta: dates + bill to ── */
  ensure(34);
  doc.setFont(font, 'normal');
  doc.setFontSize(9.5);
  doc.text(`Issue date: ${inv.issueDate}`, pageW - 15, y, { align: 'right' });
  doc.text(`Due date: ${inv.dueDate}`, pageW - 15, y + 5, { align: 'right' });
  let metaY = y + 10;
  if (inv.poNumber.trim()) {
    doc.text(`PO / Ref: ${inv.poNumber.trim()}`, pageW - 15, metaY, { align: 'right' });
    metaY += 5;
  }
  if (inv.referenceNumber.trim()) {
    doc.text(`Reference: ${inv.referenceNumber.trim()}`, pageW - 15, metaY, { align: 'right' });
    metaY += 5;
  }
  doc.text(`Status: ${statusLabel.toUpperCase()}`, pageW - 15, metaY, { align: 'right' });
  doc.setFont(font, 'bold');
  doc.text('Bill to', 15, y);
  doc.setFont(font, 'normal');
  const billLines = doc.splitTextToSize(
    [inv.clientName || 'Client', inv.clientAddress, inv.clientEmail, inv.clientPhone]
      .filter(Boolean)
      .join('\n'),
    95
  ) as string[];
  billLines.forEach((line, i) => doc.text(line, 15, y + 5 + i * 4.5));
  y += Math.max(16, metaY - y + 5, 5 + billLines.length * 4.5) + 4;

  /* ── Items table (header repeats on every page) ── */
  drawTableHeader();
  doc.setFontSize(9.5);
  inv.items.forEach((item, idx) => {
    const lineNet = totals.lines[idx]?.net ?? 0;
    const lineDiscount = totals.lines[idx]?.discount ?? 0;
    const desc = doc.splitTextToSize(item.description || '-', pageW - 118) as string[];
    const extra: string[] = [];
    if (item.detail.trim()) {
      (doc.splitTextToSize(item.detail.trim(), pageW - 118) as string[]).forEach((l) =>
        extra.push(l)
      );
    }
    if (item.sku.trim()) extra.push(`SKU: ${item.sku.trim()}`);
    if (lineDiscount > 0) extra.push(`Item discount: -${moneyPdf(lineDiscount, inv.currency)}`);
    const rowLines = [...desc, ...extra];
    ensure(Math.max(6, rowLines.length * 4.8) + 2, true);
    rowLines.forEach((line, i) => doc.text(line, 17, y + i * 4.8));
    const qtyText = item.unit ? `${item.qty || 0} ${item.unit}` : String(item.qty || 0);
    doc.text(qtyText, pageW - 78, y, { align: 'right' });
    doc.text(moneyPdf(item.unitPrice || 0, inv.currency), pageW - 44, y, { align: 'right' });
    doc.text(moneyPdf(lineNet, inv.currency), pageW - 17, y, { align: 'right' });
    y += Math.max(6, rowLines.length * 4.8) + 1.5;
  });

  /* ── Totals ── */
  const discountLabel =
    inv.discountType === 'fixed' ? 'Discount' : `Discount (${clampPct(inv.discountValue)}%)`;
  const rows: Array<[string, string, boolean]> = [
    ['Subtotal', moneyPdf(totals.subtotal, inv.currency), false],
    ...(totals.discountAmount > 0
      ? [[discountLabel, `-${moneyPdf(totals.discountAmount, inv.currency)}`, false] as [
          string,
          string,
          boolean,
        ]]
      : []),
    ...(totals.taxAmount > 0
      ? [
          [
            `${inv.taxLabel || 'Tax'} (${clampPct(inv.taxPct)}%)`,
            moneyPdf(totals.taxAmount, inv.currency),
            false,
          ] as [string, string, boolean],
        ]
      : []),
    ...(inv.shipping > 0
      ? [['Shipping', moneyPdf(inv.shipping, inv.currency), false] as [string, string, boolean]]
      : []),
    ...(totals.additionalCharges > 0
      ? [
          [
            'Additional charges',
            moneyPdf(totals.additionalCharges, inv.currency),
            false,
          ] as [string, string, boolean],
        ]
      : []),
    ...(totals.roundingAdjustment !== 0
      ? [
          [
            'Rounding adjustment',
            `${totals.roundingAdjustment > 0 ? '+' : '-'}${moneyPdf(
              Math.abs(totals.roundingAdjustment),
              inv.currency
            )}`,
            false,
          ] as [string, string, boolean],
        ]
      : []),
    ['Total', moneyPdf(totals.total, inv.currency), true],
    ...(totals.totalPaid > 0
      ? [['Total paid', moneyPdf(totals.totalPaid, inv.currency), false] as [
          string,
          string,
          boolean,
        ]]
      : []),
    ['Balance due', moneyPdf(totals.balance, inv.currency), true],
  ];
  ensure(rows.length * 5.5 + 12);
  y += 3;
  if (def.totals === 'boxed') {
    doc.setDrawColor(secondary.r, secondary.g, secondary.b);
    doc.setLineWidth(0.4);
    doc.rect(pageW - 97, y - 6, 82, rows.length * 5.5 + 9);
    doc.setLineWidth(0.2);
  } else {
    doc.setDrawColor(200, 200, 200);
    doc.line(pageW - 97, y - 3, pageW - 15, y - 3);
  }
  rows.forEach(([label, value, bold]) => {
    doc.setFont(font, bold ? 'bold' : 'normal');
    doc.text(label, pageW - 92, y);
    doc.text(value, pageW - 15, y, { align: 'right' });
    y += 5.5;
  });
  doc.setFont(font, 'normal');

  if (s.showStamp && profile.stampDataUrl) {
    addImageSafe(doc, profile.stampDataUrl, 15, y - 26, 40, 20);
  }

  /* ── Payments received ── */
  if (s.showPayments && inv.payments.length > 0) {
    ensure(12 + inv.payments.length * 5);
    y += 3;
    doc.setFont(font, 'bold');
    doc.setFontSize(9.5);
    doc.text('Payments received', 15, y);
    doc.setFont(font, 'normal');
    y += 5;
    inv.payments.forEach((p) => {
      ensure(5);
      const line = `${p.date || '—'} · ${p.method}${p.note ? ` · ${p.note}` : ''}`;
      doc.text(line, 15, y);
      doc.text(moneyPdf(p.amount, inv.currency), 100, y, { align: 'right' });
      y += 4.8;
    });
    y += 2;
  }

  /* ── QR + notes + terms ── */
  if (qrDataUrl) {
    ensure(48);
    y += 4;
    doc.setFont(font, 'bold');
    doc.setFontSize(9.5);
    doc.text('Scan to pay', 15, y);
    addImageSafe(doc, qrDataUrl, 15, y + 3, 34, 34);
    doc.setFont(font, 'normal');
    const payLines = doc.splitTextToSize(qrPayloadText, pageW - 84) as string[];
    payLines.slice(0, 6).forEach((line, i) => doc.text(line, 54, y + 8 + i * 4.8));
    y += 42;
  }
  if (s.showNotes && inv.notes.trim()) {
    ensure(14);
    y += 3;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(`Notes: ${inv.notes.trim()}`, pageW - 30) as string[];
    lines.forEach((line) => {
      ensure(5);
      doc.text(line, 15, y);
      y += 4.5;
    });
  }
  if (s.showTerms && inv.terms.trim()) {
    ensure(14);
    y += 2;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(`Terms: ${inv.terms.trim()}`, pageW - 30) as string[];
    lines.forEach((line) => {
      ensure(5);
      doc.text(line, 15, y);
      y += 4.5;
    });
  }

  /* ── Stamp (last page, on top) ── */
  if (stamp) {
    const pageCount = doc.getNumberOfPages();
    doc.setPage(pageCount);
    if (stamp === 'PAID') doc.setTextColor(120, 195, 150);
    else if (stamp === 'OVERDUE') doc.setTextColor(235, 150, 150);
    else doc.setTextColor(190, 190, 190);
    doc.setFont(font, 'bold');
    doc.setFontSize(54);
    doc.text(stamp, pageW / 2, pageH / 2, { align: 'center', angle: 24 });
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'normal');
  }

  /* ── Footers on every page: custom footer, credit line, page numbers ── */
  const total_pages = doc.getNumberOfPages();
  for (let i = 1; i <= total_pages; i++) {
    doc.setPage(i);
    if (inv.footerText.trim()) {
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text(inv.footerText.trim(), pageW / 2, pageH - 13, { align: 'center' });
    }
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      'Created with the free Invoice Generator — invoicegenerator.freeqrcode.tools',
      pageW / 2,
      pageH - 8,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${total_pages}`, pageW - 15, pageH - 8, { align: 'right' });
  }

  return doc;
}
