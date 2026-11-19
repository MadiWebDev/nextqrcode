'use client';

/**
 * Cover letter panel (spec §9): create a letter for this resume,
 * generate an honest starter from the resume's own facts, edit it as
 * plain paragraphs, preview it in the resume's fonts, and export
 * (print-to-PDF via the same pipeline, DOCX, TXT). Letters live in
 * the same local store as resumes.
 */
import { useCallback, useEffect, useState } from 'react';
import type { CoverLetter, ResumeDoc } from '../../_lib/schema';
import { rt } from '../../_lib/schema';
import type { ResumeStore } from '../../_lib/db';
import {
  buildLetterDocx,
  letterPlainText,
  newCoverLetter,
  starterLetter,
  type LetterTone,
} from '../../_lib/coverletter';
import { fontPair } from '../../_lib/fonts';
import { saveBlob } from '../../_lib/exports/download';

function bodyToText(letter: CoverLetter): string {
  return letter.body.map((b) => rt.plain([b])).join('\n\n');
}

function textToBody(text: string): CoverLetter['body'] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => rt.p(p.replace(/\n/g, ' ')));
}

export function CoverLetterPanel({ doc, store }: { doc: ResumeDoc; store: ResumeStore }) {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [current, setCurrent] = useState<CoverLetter | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState(doc.meta.targetRole ?? '');
  const [manager, setManager] = useState('');
  const [tone, setTone] = useState<LetterTone>('warm');

  const refresh = useCallback(async () => {
    const all = await store.listCoverLetters();
    const mine = all.filter((l) => l.resumeId === doc.id).sort((a, b) => b.updatedAt - a.updatedAt);
    setLetters(mine);
    setCurrent((prev) => prev ?? mine[0] ?? null);
  }, [store, doc.id]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      const all = await store.listCoverLetters();
      if (cancelled) return;
      const mine = all.filter((l) => l.resumeId === doc.id).sort((a, b) => b.updatedAt - a.updatedAt);
      setLetters(mine);
      setCurrent((prev) => prev ?? mine[0] ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [store, doc.id]);

  const save = async (letter: CoverLetter) => {
    const updated = { ...letter, updatedAt: Date.now() };
    setCurrent(updated);
    await store.putCoverLetter(updated);
    void refresh();
  };

  const pair = fontPair(doc.theme.fontPair);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Cover letter</h2>
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="block space-y-1">
          <span className="text-xs font-medium">Company</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm" placeholder="Example Ltd" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium">Role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm" placeholder="Staff Nurse" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium">Tone</span>
          <select value={tone} onChange={(e) => setTone(e.target.value as LetterTone)} className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm">
            <option value="formal">Formal</option>
            <option value="warm">Warm</option>
            <option value="confident">Confident</option>
          </select>
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Hiring manager&apos;s name (optional)</span>
        <input value={manager} onChange={(e) => setManager(e.target.value)} className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm" placeholder="Ms A. Khan" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          disabled={!role.trim()}
          onClick={() => {
            const letter = starterLetter(doc, { company, role, hiringManager: manager, tone });
            void save(letter);
          }}
        >
          Generate starter letter
        </button>
        <button
          type="button"
          className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
          onClick={() => void save(newCoverLetter(doc.id))}
        >
          Blank letter
        </button>
        {letters.length > 1 && current ? (
          <select
            aria-label="Your letters for this resume"
            value={current.id}
            onChange={(e) => setCurrent(letters.find((l) => l.id === e.target.value) ?? null)}
            className="min-h-11 rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {letters.map((l) => (
              <option key={l.id} value={l.id}>
                {l.subject || 'Untitled letter'} — {new Date(l.updatedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {current ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-medium">Recipient</span>
              <input
                value={current.recipient}
                onChange={(e) => void save({ ...current, recipient: e.target.value })}
                className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium">Subject</span>
              <input
                value={current.subject}
                onChange={(e) => void save({ ...current, subject: e.target.value })}
                className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-medium">Letter (one paragraph per block, blank line between)</span>
            <textarea
              value={bodyToText(current)}
              onChange={(e) => void save({ ...current, body: textToBody(e.target.value) })}
              rows={12}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <div
            className="cl-letter-page resume-page mx-auto bg-white p-8 text-neutral-900 shadow ring-1 ring-border"
            style={{ maxWidth: 794, fontFamily: pair.body, fontSize: 14.5, lineHeight: 1.6 }}
          >
            <p style={{ fontFamily: pair.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{doc.basics.name}</p>
            <p className="text-sm text-neutral-500">
              {[doc.basics.email, doc.basics.phone, doc.basics.location].filter(Boolean).join(' · ')}
            </p>
            {current.recipient ? <p className="mt-6">{current.recipient}</p> : null}
            {current.subject ? <p className="font-semibold">Re: {current.subject}</p> : null}
            {current.body.map((b, i) => (
              <p key={i} className="mt-3 whitespace-pre-wrap">{rt.plain([b])}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
              onClick={() => {
                const style = document.createElement('style');
                style.textContent =
                  '@media print { .resume-page { visibility: hidden !important; } .cl-letter-page, .cl-letter-page * { visibility: visible !important; } } @page { size: A4; margin: 0; }';
                document.head.appendChild(style);
                const cleanup = () => {
                  style.remove();
                  window.removeEventListener('afterprint', cleanup);
                };
                window.addEventListener('afterprint', cleanup);
                setTimeout(cleanup, 60_000);
                window.print();
              }}
            >
              PDF (print)
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
              onClick={() => void buildLetterDocx(current, doc).then((blob) => saveBlob(blob, 'cover-letter.docx'))}
            >
              DOCX
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
              onClick={() => saveBlob(new Blob([letterPlainText(current, doc)], { type: 'text/plain' }), 'cover-letter.txt')}
            >
              TXT
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md px-3 text-sm font-medium text-destructive"
              onClick={() => {
                void store.deleteCoverLetter(current.id).then(() => {
                  setCurrent(null);
                  void refresh();
                });
              }}
            >
              Delete letter
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No letter yet for this resume. Generate a starter — it uses only facts already on your
          resume, with [bracketed] prompts where you need to add your own words.
        </p>
      )}
    </div>
  );
}
