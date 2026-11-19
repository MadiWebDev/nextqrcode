'use client';

/**
 * QR panel (spec §9): configure the resume's QR code, preview it,
 * run the in-browser scan self-test, and download the vCard file or
 * a digital business card image.
 */
import { useEffect, useRef, useState } from 'react';
import type { ResumeDoc } from '../../_lib/schema';
import { generateQr, selfTestQr, type QrResult } from '../../_lib/qr';
import { exportPageImage } from '../../_lib/exports/image';
import { saveBlob } from '../../_lib/exports/download';

const VCARD_FIELDS = [
  { id: 'name', label: 'Name' },
  { id: 'title', label: 'Job title' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'location', label: 'Location' },
  { id: 'website', label: 'Website' },
] as const;

export function QrPanel({
  doc,
  patch,
  onQrReady,
}: {
  doc: ResumeDoc;
  patch: (fn: (d: ResumeDoc) => ResumeDoc) => void;
  onQrReady: (dataUrl: string) => void;
}) {
  const [qr, setQr] = useState<QrResult | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'testing' | 'pass' | 'fail'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);
  const qrConfig = doc.qr;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      if (!qrConfig.enabled) {
        setQr(null);
        onQrReady('');
        return;
      }
      const result = await generateQr(doc);
      if (cancelled) return;
      setQr(result);
      setScanState('idle');
      onQrReady(result.dataUrl);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrConfig.enabled, qrConfig.target, qrConfig.url, qrConfig.vcardFields.join(','), doc.basics.name, doc.basics.email, doc.basics.phone, doc.basics.website, doc.basics.headline, doc.basics.location, doc.theme.accent]);

  const set = (partial: Partial<ResumeDoc['qr']>) =>
    patch((d) => ({ ...d, qr: { ...d.qr, ...partial } }));

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">QR code</h2>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={qrConfig.enabled}
          onChange={(e) => set({ enabled: e.target.checked })}
        />
        Show a QR code on this resume
      </label>
      {qrConfig.enabled ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">QR opens</span>
              <select
                value={qrConfig.target}
                onChange={(e) => set({ target: e.target.value as ResumeDoc['qr']['target'] })}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="vcard">My contact card (vCard)</option>
                <option value="url">A web link (portfolio, LinkedIn…)</option>
                <option value="whatsapp">WhatsApp chat</option>
                <option value="email">Email me</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Placement</span>
              <select
                value={qrConfig.placement}
                onChange={(e) => set({ placement: e.target.value as ResumeDoc['qr']['placement'] })}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="header">Header</option>
                <option value="sidebar">Sidebar (two-column templates)</option>
                <option value="footer">Footer of last page</option>
              </select>
            </label>
          </div>
          {qrConfig.target === 'url' ? (
            <label className="block space-y-1">
              <span className="text-sm font-medium">Link</span>
              <input
                value={qrConfig.url ?? ''}
                onChange={(e) => set({ url: e.target.value })}
                placeholder="https://…"
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
          ) : null}
          {qrConfig.target === 'vcard' ? (
            <fieldset>
              <legend className="text-sm font-medium">Contact card includes</legend>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {VCARD_FIELDS.map((f) => (
                  <label key={f.id} className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={qrConfig.vcardFields.includes(f.id)}
                      onChange={(e) =>
                        set({
                          vcardFields: e.target.checked
                            ? [...qrConfig.vcardFields, f.id]
                            : qrConfig.vcardFields.filter((x) => x !== f.id),
                        })
                      }
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <label className="block space-y-1">
            <span className="text-sm font-medium">Printed size: {qrConfig.sizeMm} mm</span>
            <input
              type="range"
              min={15}
              max={40}
              value={qrConfig.sizeMm}
              onChange={(e) => set({ sizeMm: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Caption under the code (optional)</span>
            <input
              value={qrConfig.label ?? ''}
              onChange={(e) => set({ label: e.target.value })}
              placeholder="Scan to save my contact"
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          {qr?.dataUrl ? (
            <div className="flex flex-wrap items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr.dataUrl} alt="QR code preview" className="h-32 w-32 rounded border bg-white p-1" />
              <div className="min-w-48 flex-1 space-y-2">
                {qr.warnings.map((w) => (
                  <p key={w} className="text-xs text-amber-700 dark:text-amber-300">{w}</p>
                ))}
                <button
                  type="button"
                  className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
                  onClick={() => {
                    setScanState('testing');
                    void selfTestQr(qr.dataUrl, qr.payload).then((ok) => setScanState(ok ? 'pass' : 'fail'));
                  }}
                >
                  {scanState === 'testing' ? 'Testing…' : 'Run scan test'}
                </button>
                {scanState === 'pass' ? (
                  <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
                    Scan test passed — a phone camera can read this code and it decodes to exactly your details.
                  </p>
                ) : null}
                {scanState === 'fail' ? (
                  <p className="text-sm text-destructive" role="alert">
                    The scan test could not read this code back. Try a larger printed size or fewer vCard fields.
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {qrConfig.target === 'vcard' ? (
                    <button
                      type="button"
                      className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
                      onClick={() => saveBlob(new Blob([qr.payload], { type: 'text/vcard' }), 'contact.vcf')}
                    >
                      Download contact card (.vcf)
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
                    onClick={() => {
                      if (!cardRef.current) return;
                      void exportPageImage(cardRef.current, 'png').then((blob) => saveBlob(blob, 'business-card.png'));
                    }}
                  >
                    Download business card (PNG)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{qr?.warnings[0] ?? 'Preparing your QR code…'}</p>
          )}
          {/* Digital business card, rendered for the PNG download. */}
          {qr?.dataUrl ? (
            <div
              ref={cardRef}
              style={{
                width: 420,
                background: '#ffffff',
                color: '#111827',
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr.dataUrl} alt="" style={{ width: 110, height: 110 }} />
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{doc.basics.name}</p>
                <p style={{ fontSize: 14, margin: '2px 0', color: '#374151' }}>{doc.basics.headline}</p>
                <p style={{ fontSize: 13, margin: '2px 0', color: '#4b5563' }}>{doc.basics.email}</p>
                <p style={{ fontSize: 13, margin: '2px 0', color: '#4b5563' }}>{doc.basics.phone}</p>
                <p style={{ fontSize: 12, margin: '6px 0 0', color: '#6b7280' }}>{qrConfig.label || 'Scan to save my contact'}</p>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          A QR code lets an employer save your contact details with one scan. It is generated on
          your device from the details on this resume.
        </p>
      )}
    </div>
  );
}
