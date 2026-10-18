'use client';

/** Copies the code's short URL to the clipboard. */

import { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Short link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — clipboard unavailable');
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={copy}
      aria-label={`Copy short link for ${label}`}
      title={url}
    >
      {copied ? (
        <CheckIcon className="size-4" aria-hidden />
      ) : (
        <CopyIcon className="size-4" aria-hidden />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
