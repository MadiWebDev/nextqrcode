'use client';

/**
 * Edit form for a single QR code. PATCHes /api/qrcodes/<id>.
 *
 * Password semantics: the input starts empty with placeholder "unchanged".
 * - Untouched (not dirty) → password is omitted from the PATCH body → kept.
 * - Dirty and empty → password: null → cleared on the server.
 * - Dirty with a value → password set to the new value.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QR_STATUSES, QR_VISIBILITIES, type QrCodeDetail } from '@/components/dashboard/types';

/** ISO → "yyyy-MM-ddTHH:mm" for datetime-local inputs (local time). */
function toInputValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function QrEditForm({ code }: { code: QrCodeDetail }) {
  const router = useRouter();
  const [title, setTitle] = useState(code.title ?? '');
  const [tags, setTags] = useState(code.tags.join(', '));
  const [visibility, setVisibility] = useState<QrCodeDetail['visibility']>(code.visibility);
  const [status, setStatus] = useState<QrCodeDetail['status']>(code.status);
  const [destinationUrl, setDestinationUrl] = useState(code.destinationUrl ?? '');
  const [expiresAt, setExpiresAt] = useState(toInputValue(code.expiresAt));
  const [password, setPassword] = useState('');
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        title: title.trim() || null,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        visibility,
        status,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };
      if (code.mode === 'dynamic') body.destinationUrl = destinationUrl.trim() || null;
      if (passwordDirty) body.password = password ? password : null;

      const res = await fetch(`/api/qrcodes/${encodeURIComponent(code.publicId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Save failed (${res.status})`);
      }
      toast.success('QR code updated');
      setPassword('');
      setPasswordDirty(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Summer menu flyer"
          maxLength={120}
        />
      </div>

      <div>
        <Label htmlFor="edit-tags">Tags</Label>
        <Input
          id="edit-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="menu, summer, flyer"
          aria-describedby="edit-tags-hint"
        />
        <p id="edit-tags-hint" className="mt-1 text-xs text-muted-foreground">
          Comma-separated, used for search and filtering.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="edit-visibility">Visibility</Label>
          <Select value={visibility} onValueChange={(v) => setVisibility(v as typeof visibility)}>
            <SelectTrigger id="edit-visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QR_VISIBILITIES.map((v) => (
                <SelectItem key={v} value={v} className="capitalize">
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger id="edit-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QR_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {code.mode === 'dynamic' && (
        <div>
          <Label htmlFor="edit-destination">Destination URL</Label>
          <Input
            id="edit-destination"
            type="url"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://example.com/landing"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Dynamic code — scans redirect here. Changing it updates the target instantly.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="edit-expires">Expiry</Label>
        <Input
          id="edit-expires"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          aria-describedby="edit-expires-hint"
        />
        <p id="edit-expires-hint" className="mt-1 text-xs text-muted-foreground">
          Leave empty for no expiry.
        </p>
      </div>

      <div>
        <Label htmlFor="edit-password">Password</Label>
        <Input
          id="edit-password"
          type="password"
          value={password}
          placeholder="unchanged"
          autoComplete="new-password"
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordDirty(true);
          }}
          aria-describedby="edit-password-hint"
        />
        <p id="edit-password-hint" className="mt-1 text-xs text-muted-foreground">
          {code.hasPassword
            ? 'This code is password-protected. Leave unchanged to keep it, or clear the field to remove protection.'
            : 'No password set. Type one to protect this code.'}
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
