'use client';

/** Downloads the user's QR codes as JSON (GET /api/qrcodes?limit=1000). */

import { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function ExportButton() {
  const [busy, setBusy] = useState(false);

  async function onExport() {
    setBusy(true);
    try {
      const res = await fetch('/api/qrcodes?limit=1000');
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Export failed (${res.status})`);
      }
      const payload: unknown = await res.json();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrstudio-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={onExport} disabled={busy}>
      <DownloadIcon className="size-4" aria-hidden />
      {busy ? 'Exporting…' : 'Download my data (JSON)'}
    </Button>
  );
}
