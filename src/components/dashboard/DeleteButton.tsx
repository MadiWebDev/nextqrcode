'use client';

/** Deletes a QR code via DELETE /api/qrcodes/<id> after confirmation. */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function DeleteButton({ publicId, title }: { publicId: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    const name = title || publicId;
    if (
      !window.confirm(`Delete "${name}"? Its short link will stop working. This cannot be undone.`)
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/qrcodes/${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Delete failed (${res.status})`);
      }
      toast.success('QR code deleted');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete ${title || publicId}`}
      className="text-destructive hover:text-destructive"
    >
      <Trash2Icon className="size-4" aria-hidden />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
