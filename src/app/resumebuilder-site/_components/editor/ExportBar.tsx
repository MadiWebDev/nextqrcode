'use client';

/**
 * Export bar (spec §10). PDF goes through the browser print pipeline
 * (see docs/resumebuilder/PDF_SPIKE.md — the only route that renders
 * complex scripts correctly); DOCX/PNG/TXT/MD/HTML/JSON/ZIP download
 * directly. A floating button mirrors the actions on mobile.
 */
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ResumeDoc } from '../../_lib/schema';
import { toJsonResume } from '../../_lib/schema';
import type { ResumeStore } from '../../_lib/db';
import type { TemplateDef } from '../../_lib/templates/types';
import { resumeFilename } from '../../_lib/validation';
import { buildDocx, type DocxAssets } from '../../_lib/exports/docx';
import { toMarkdown, toPlainText, toStandaloneHtml } from '../../_lib/exports/text';
import { exportPageImage } from '../../_lib/exports/image';
import { buildAllFormatsZip, saveBlob } from '../../_lib/exports/download';
import { encodeShareLink } from '../../_lib/share';

export function ExportBar({
  doc,
  template,
  store,
  previewRootId,
  qrDataUrl,
}: {
  doc: ResumeDoc;
  template: TemplateDef | null;
  store: ResumeStore;
  previewRootId: string;
  qrDataUrl?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [includeSensitive, setIncludeSensitive] = useState(false);
  const hasSensitive = Object.values(doc.sensitive).some((f) => f?.include && f.value.trim());
  const titleBeforePrint = useRef<string>('');

  const filename = useCallback(
    (ext: string) => resumeFilename(doc.basics.name, doc.basics.headline ?? '', ext),
    [doc.basics.name, doc.basics.headline],
  );

  const photoAsset = useCallback(async (): Promise<DocxAssets> => {
    const id = doc.photo.croppedId ?? doc.photo.originalId;
    if (!id || !doc.photo.show) return {};
    const rec = await store.getPhoto(id);
    if (!rec) return {};
    const blob = rec.blob;
    const data = await blob.arrayBuffer();
    let widthPx = 480;
    let heightPx = 480;
    try {
      const bmp = await createImageBitmap(blob);
      widthPx = bmp.width;
      heightPx = bmp.height;
      bmp.close();
    } catch {
      /* dimensions fall back to square */
    }
    return { photo: { data, widthPx, heightPx } };
  }, [doc.photo, store]);

  const allAssets = useCallback(async (): Promise<DocxAssets> => {
    const base = await photoAsset();
    if (qrDataUrl) {
      const buf = await (await fetch(qrDataUrl)).arrayBuffer();
      return { ...base, qrPng: buf };
    }
    return base;
  }, [photoAsset, qrDataUrl]);

  const printPdf = useCallback(() => {
    titleBeforePrint.current = document.title;
    document.title = filename('pdf').replace(/\.pdf$/, '');
    const style = document.createElement('style');
    style.id = 'rb-page-style';
    style.textContent = `@page { size: ${doc.theme.pageSize === 'letter' ? 'Letter' : 'A4'}; margin: 0; }`;
    document.head.appendChild(style);
    const restore = () => {
      document.title = titleBeforePrint.current;
      style.remove();
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(restore, 60_000);
    window.print();
  }, [doc.theme.pageSize, filename]);

  const run = useCallback(
    async (label: string, fn: () => Promise<void>) => {
      setBusy(label);
      setError(null);
      try {
        await fn();
      } catch {
        setError('That export did not finish. Your resume is unchanged — please try again.');
      } finally {
        setBusy(null);
      }
    },
    [],
  );

  if (!template) return null;
  const tpl: TemplateDef = template;

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" size="sm" onClick={printPdf}>
        PDF (print)
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy !== null}
        onClick={() =>
          void run('docx', async () => {
            const blob = await buildDocx(doc, tpl, await allAssets());
            saveBlob(blob, filename('docx'));
          })
        }
      >
        {busy === 'docx' ? 'Preparing…' : 'DOCX'}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy !== null}
        onClick={() =>
          void run('png', async () => {
            const root = document.getElementById(previewRootId);
            const pages = root?.querySelectorAll<HTMLElement>('.resume-page');
            if (!pages || pages.length === 0) throw new Error('no-pages');
            for (let i = 0; i < pages.length; i++) {
              const blob = await exportPageImage(pages[i], 'png');
              const base = filename('png').replace(/\.png$/, '');
              saveBlob(blob, pages.length > 1 ? `${base}-page-${i + 1}.png` : `${base}.png`);
            }
          })
        }
      >
        {busy === 'png' ? 'Preparing…' : 'PNG'}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => saveBlob(new Blob([toPlainText(doc, tpl)], { type: 'text/plain' }), filename('txt'))}
      >
        TXT
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => saveBlob(new Blob([toMarkdown(doc, tpl)], { type: 'text/markdown' }), filename('md'))}
      >
        Markdown
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() =>
          saveBlob(new Blob([toStandaloneHtml(doc, tpl)], { type: 'text/html' }), filename('html'))
        }
      >
        HTML
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() =>
          saveBlob(new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' }), filename('json'))
        }
      >
        JSON
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() =>
          saveBlob(
            new Blob([JSON.stringify(toJsonResume(doc), null, 2)], { type: 'application/json' }),
            filename('json').replace(/\.json$/, '-jsonresume.json'),
          )
        }
      >
        JSON Resume
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          void (async () => {
            const link = await encodeShareLink(doc, includeSensitive, window.location.origin);
            try {
              await navigator.clipboard.writeText(link);
              setShareNote('Share link copied. Anyone with the link can read this resume — the photo is never included.');
            } catch {
              setShareNote(link);
            }
          })();
        }}
      >
        Copy share link
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy !== null}
        onClick={() =>
          void run('zip', async () => {
            const root = document.getElementById(previewRootId);
            const pages = root?.querySelectorAll<HTMLElement>('.resume-page');
            const pageImages: { name: string; blob: Blob }[] = [];
            if (pages) {
              for (let i = 0; i < pages.length; i++) {
                const blob = await exportPageImage(pages[i], 'png');
                pageImages.push({ name: `page-${i + 1}.png`, blob });
              }
            }
            const zip = await buildAllFormatsZip(doc, tpl, { ...(await allAssets()), pageImages });
            saveBlob(zip, filename('zip'));
          })
        }
      >
        {busy === 'zip' ? 'Preparing…' : 'All formats (ZIP)'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="hidden lg:block">{actions}</div>
      <p className="text-xs text-muted-foreground">
        PDF opens your browser&apos;s print dialog — choose &ldquo;Save as PDF&rdquo; and turn off
        headers and footers. Printing from the live preview is deliberate: it is the only way Urdu,
        Arabic and other complex scripts print exactly as they look on screen.
      </p>
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">
          How do DOCX and PDF differ?
        </summary>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>PDF looks exactly like the on-screen preview, with fonts embedded by your browser.</li>
          <li>
            DOCX is fully editable in Word or LibreOffice with real heading styles, but its fonts
            and page breaks follow the reader&apos;s software, and designed templates simplify to a
            clean single-column layout.
          </li>
          <li>
            Neither file is a tagged PDF/DOCX with a screen-reader structure tree; the HTML export
            has the cleanest semantic structure. Both contain real, selectable text in the correct
            reading order.
          </li>
          <li>PNG images use your device&apos;s system fonts as a fallback for the template fonts.</li>
        </ul>
      </details>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {hasSensitive ? (
        <label className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={includeSensitive}
            onChange={(e) => setIncludeSensitive(e.target.checked)}
          />
          Include the sensitive fields I marked (ID numbers and similar) in the share link — anyone
          with the link could read them
        </label>
      ) : null}
      {shareNote ? (
        <p className="break-all text-xs text-muted-foreground" role="status">
          {shareNote}
        </p>
      ) : null}

      {/* Mobile: floating download button + sheet with the same actions. */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="fixed bottom-4 right-4 z-40 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
        >
          Download
        </button>
        {mobileOpen ? (
          <div className="fixed inset-x-3 bottom-20 z-40 rounded-lg border bg-card p-3 shadow-xl">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
