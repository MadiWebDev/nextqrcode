'use client';

import type { ResumeDoc, RichText, Section } from '../../_lib/schema';
import { rt } from '../../_lib/schema';
import { formatDateRange } from '../../_lib/dates';
import { REGIONS } from '../../_lib/regions';

/**
 * Live preview. Phase 3 renders a faithful structured preview of the
 * document; Phase 4 replaces the internals with the template engine's
 * paginated page model (same props contract: doc + photo object URL).
 */

function Rich({ blocks }: { blocks: RichText }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'paragraph' ? (
          <p key={i} className="whitespace-pre-wrap">
            {b.spans.map((s, j) => (
              <span key={j} className={s.marks?.bold ? 'font-semibold' : undefined} style={s.marks?.italic ? { fontStyle: 'italic' } : undefined}>
                {s.text}
              </span>
            ))}
          </p>
        ) : (
          <ul key={i} className="list-disc space-y-0.5 pl-5">
            {b.items.map((item, j) => (
              <li key={j}>{item.map((s) => s.text).join('')}</li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

function SectionPreview({ section, doc }: { section: Section; doc: ResumeDoc }) {
  const fmt = doc.theme.dateFormat;
  const hasContent =
    (section.text?.length ?? 0) > 0 ||
    (section.experience?.length ?? 0) > 0 ||
    (section.education?.length ?? 0) > 0 ||
    (section.skillGroups?.some((g) => g.skills.length > 0) ?? false) ||
    (section.projects?.length ?? 0) > 0 ||
    (section.certifications?.length ?? 0) > 0 ||
    (section.awards?.length ?? 0) > 0 ||
    (section.languages?.length ?? 0) > 0 ||
    (section.publications?.length ?? 0) > 0 ||
    (section.entries?.length ?? 0) > 0 ||
    (section.references?.length ?? 0) > 0 ||
    (section.tags?.length ?? 0) > 0 ||
    (section.table?.length ?? 0) > 0 ||
    section.referencesMode === 'on-request';
  if (!hasContent) return null;
  return (
    <section className="mt-4">
      <h2
        className="border-b pb-1 text-[13px] font-bold tracking-wide"
        style={{ color: doc.theme.accent, borderColor: doc.theme.accent }}
      >
        {doc.theme.headingCase === 'upper' ? section.title.toUpperCase() : section.title}
      </h2>
      <div className="mt-2 space-y-2.5">
        {section.text && <Rich blocks={section.text} />}
        {section.experience?.map((e) => (
          <article key={e.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                {e.role}
                {e.organization ? <span className="font-normal"> — {e.organization}</span> : null}
              </h3>
              <span className="text-xs text-neutral-500">{formatDateRange(e.start, e.end, e.current, fmt)}</span>
            </div>
            {e.location ? <p className="text-xs text-neutral-500">{e.location}</p> : null}
            <Rich blocks={e.bullets} />
          </article>
        ))}
        {section.education?.map((e) => (
          <article key={e.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                {[e.studyType, e.area].filter(Boolean).join(', ')}
                {e.institution ? <span className="font-normal"> — {e.institution}</span> : null}
              </h3>
              <span className="text-xs text-neutral-500">{formatDateRange(e.start, e.end, e.current, fmt)}</span>
            </div>
            {e.score ? <p className="text-xs">Result: {e.score}</p> : null}
            <Rich blocks={e.bullets} />
          </article>
        ))}
        {section.skillGroups?.map((g) => (
          <p key={g.id}>
            {g.name ? <strong>{g.name}: </strong> : null}
            {g.skills.map((s) => s.name).join(' · ')}
          </p>
        ))}
        {section.projects?.map((p) => (
          <article key={p.id}>
            <h3 className="font-semibold">{p.name}</h3>
            {p.stack.length > 0 ? <p className="text-xs text-neutral-500">{p.stack.join(' · ')}</p> : null}
            <Rich blocks={p.description} />
          </article>
        ))}
        {section.certifications?.map((c) => (
          <p key={c.id}>
            <strong>{c.name}</strong>
            {c.issuer ? ` — ${c.issuer}` : ''}
            {c.credentialId ? ` · ${c.credentialId}` : ''}
          </p>
        ))}
        {section.awards?.map((a) => (
          <p key={a.id}>
            <strong>{a.title}</strong>
            {a.awarder ? ` — ${a.awarder}` : ''}
            {a.summary ? <span className="block text-xs">{a.summary}</span> : null}
          </p>
        ))}
        {section.languages?.map((l) => (
          <p key={l.id}>
            {l.language}
            {l.fluency ? ` — ${l.fluency}` : ''}
          </p>
        ))}
        {section.publications?.map((p) => (
          <p key={p.id}>
            <strong>{p.title}</strong>
            {p.publisher ? ` — ${p.publisher}` : ''}
          </p>
        ))}
        {section.entries?.map((e) => (
          <article key={e.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                {e.title}
                {e.organization ? <span className="font-normal"> — {e.organization}</span> : null}
              </h3>
              <span className="text-xs text-neutral-500">{formatDateRange(e.start, e.end, e.current, fmt)}</span>
            </div>
            <Rich blocks={e.bullets} />
          </article>
        ))}
        {section.referencesMode === 'on-request' && section.kind === 'references' ? (
          <p className="italic">References available on request.</p>
        ) : null}
        {section.references?.map((r) => (
          <p key={r.id}>
            <strong>{r.name}</strong>
            {r.role ? ` — ${r.role}` : ''}
            {r.contact ? <span className="block text-xs">{r.contact}</span> : null}
          </p>
        ))}
        {section.tags && section.tags.length > 0 ? <p>{section.tags.join(' · ')}</p> : null}
        {section.table && section.table.length > 0 ? (
          <table className="w-full border-collapse text-xs">
            <tbody>
              {section.table.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-neutral-300 px-1.5 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </section>
  );
}

export function ResumePreview(props: { doc: ResumeDoc; photoUrl?: string }) {
  const { doc } = props;
  const region = REGIONS[doc.meta.region];
  const sensitiveShown = Object.entries(doc.sensitive)
    .filter(([, f]) => f?.include && f.value.trim())
    .map(([k, f]) => ({ key: k, value: f!.value }));
  const pageWidth = doc.theme.pageSize === 'a4' ? 794 : 816; // ~96dpi px
  const pageHeight = doc.theme.pageSize === 'a4' ? 1123 : 1056;
  return (
    <div
      className="mx-auto bg-white text-neutral-900 shadow-md ring-1 ring-border"
      style={{
        width: '100%',
        maxWidth: pageWidth,
        minHeight: pageHeight * 0.75,
        padding: doc.theme.margin === 'narrow' ? 28 : doc.theme.margin === 'wide' ? 56 : 40,
        fontSize: 13.5 * doc.theme.fontScale,
        lineHeight: doc.theme.lineHeight,
      }}
      dir={doc.meta.direction}
      lang={doc.meta.language}
      data-testid="resume-preview"
    >
      <header className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight">{doc.basics.name || 'Your Name'}</h1>
          {doc.basics.headline ? <p className="mt-0.5 font-medium" style={{ color: doc.theme.accent }}>{doc.basics.headline}</p> : null}
          <p className="mt-1.5 text-xs text-neutral-600">
            {[doc.basics.email, doc.basics.phone, doc.basics.location, doc.basics.website]
              .filter(Boolean)
              .join('  ·  ')}
          </p>
          {doc.basics.links.length > 0 ? (
            <p className="text-xs text-neutral-600">
              {doc.basics.links.map((l) => `${l.label}: ${l.url}`).join('  ·  ')}
            </p>
          ) : null}
          {sensitiveShown.length > 0 ? (
            <p className="text-xs text-neutral-600">
              {sensitiveShown.map((s) => s.value).join('  ·  ')}
            </p>
          ) : null}
        </div>
        {doc.photo.show && props.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL of the user's own photo
          <img
            src={props.photoUrl}
            alt="Profile"
            className={
              doc.photo.shape === 'circle'
                ? 'h-24 w-24 shrink-0 rounded-full object-cover'
                : doc.photo.shape === 'portrait'
                  ? 'h-28 w-24 shrink-0 rounded object-cover'
                  : 'h-24 w-24 shrink-0 rounded-lg object-cover'
            }
          />
        ) : null}
      </header>
      {doc.sections
        .filter((s) => s.visible)
        .map((s) => (
          <SectionPreview key={s.id} section={s} doc={doc} />
        ))}
      <p className="mt-6 border-t border-dashed border-neutral-200 pt-2 text-[10px] text-neutral-400">
        Preview — {doc.theme.pageSize === 'a4' ? 'A4' : 'US Letter'} · {region.label} defaults · final
        pagination and template design apply in the exported file.
      </p>
      <span className="sr-only">{rt.plain([])}</span>
    </div>
  );
}
