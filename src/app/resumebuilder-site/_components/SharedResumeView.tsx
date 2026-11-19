'use client';

/**
 * Read-only shared resume (/view#…): decodes the fragment locally
 * and renders the shared template. Nothing is fetched or stored.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ResumeDoc } from '../_lib/schema';
import { decodeShareLink } from '../_lib/share';
import { loadTemplate } from '../_lib/templates/registry';
import type { TemplateDef } from '../_lib/templates/types';
import { TemplateView } from './TemplateView';

export function SharedResumeView() {
  const [state, setState] = useState<'loading' | 'ready' | 'invalid'>('loading');
  const [doc, setDoc] = useState<ResumeDoc | null>(null);
  const [template, setTemplate] = useState<TemplateDef | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const decoded = await decodeShareLink(window.location.hash);
      if (cancelled) return;
      if (!decoded) {
        setState('invalid');
        return;
      }
      const def = await loadTemplate(decoded.meta.templateId);
      if (cancelled) return;
      setDoc(decoded);
      setTemplate(def);
      setState('ready');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-lg border bg-card p-4 text-sm">
        <p className="font-medium">You are viewing a shared resume.</p>
        <p className="mt-1 text-muted-foreground">
          It was decoded in your browser from the link itself — nothing was downloaded from a
          server, and nothing about this view is tracked.{' '}
          <Link href="/" className="text-primary underline">
            Build your own resume free
          </Link>
          .
        </p>
      </div>
      {state === 'loading' ? <p className="text-muted-foreground">Opening the shared resume…</p> : null}
      {state === 'invalid' ? (
        <p role="alert" className="text-destructive">
          This link does not contain a readable resume. It may have been copied incompletely — ask
          the sender to copy the full link.
        </p>
      ) : null}
      {state === 'ready' && doc && template ? (
        <div className="resume-print-root">
          <TemplateView doc={doc} template={template} />
        </div>
      ) : null}
    </main>
  );
}
