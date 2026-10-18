'use client';

/**
 * Account deletion. DELETE /api/account removes the user's codes, scan
 * events, templates and user record; the client then signs out (JWT sessions
 * cannot be revoked server-side, so clearing the session cookie locally is
 * what completes the sign-out).
 */

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function DeleteAccountButton() {
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);

  async function onDelete() {
    if (!armed) {
      setArmed(true);
      return;
    }
    if (
      !window.confirm(
        'Permanently delete your account and ALL your QR codes and scan data? This cannot be undone.'
      )
    ) {
      setArmed(false);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Delete failed (${res.status})`);
      }
      toast.success('Account deleted');
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
      setBusy(false);
      setArmed(false);
    }
  }

  return (
    <Button type="button" variant="destructive" onClick={onDelete} disabled={busy}>
      {busy ? 'Deleting…' : armed ? 'Click again to confirm deletion' : 'Delete my account'}
    </Button>
  );
}
