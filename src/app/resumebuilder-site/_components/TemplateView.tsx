'use client';

import { useMemo } from 'react';
import type { ResumeDoc, RichText } from '../_lib/schema';
import type { Block, TemplateDef } from '../_lib/templates/types';
import { paginate, usableHeight } from '../_lib/templates/types';
import { buildBlocks } from '../_lib/templates/build-blocks';
import type { EntryPayload, HeaderPayload, SkillsPayload } from '../_lib/templates/build-blocks';

/**
 * Template renderer: consumes the shared block list (reading order is
 * fixed by buildBlocks) and paints it per the template's layout,
 * header and heading primitives. Pages come from the shared paginator;
 * page boxes use min-height so content can never be clipped — a page
 * that overflows its estimate grows instead of losing text.
 */

const PAGE_W = { a4: 794, letter: 816 };
const PAGE_H = { a4: 1123, letter: 1056 };

function Rich({ blocks, bullet }: { blocks: RichText; bullet: string }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'paragraph' ? (
          <p key={i} className="whitespace-pre-wrap">
            {b.spans.map((s, j) =>
              s.marks?.link ? (
                <a key={j} href={s.marks.link} className="underline" target="_blank" rel="noreferrer">
                  {s.text}
                </a>
              ) : (
                <span key={j} style={{ fontWeight: s.marks?.bold ? 600 : undefined, fontStyle: s.marks?.italic ? 'italic' : undefined }}>
                  {s.text}
                </span>
              ),
            )}
          </p>
        ) : (
          <ul key={i} className="space-y-0.5" style={{ listStyle: 'none', paddingInlineStart: 14 }}>
            {b.items.map((item, j) => (
              <li key={j} className="relative">
                {bullet !== 'none' && (
                  <span aria-hidden className="absolute" style={{ insetInlineStart: -14 }}>
                    {bullet === 'dash' ? '–' : bullet === 'arrow' ? '›' : '•'}
                  </span>
                )}
                {item.map((s, k) => (
                  <span key={k} style={{ fontWeight: s.marks?.bold ? 600 : undefined, fontStyle: s.marks?.italic ? 'italic' : undefined }}>
                    {s.text}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

function HeaderBlock({ payload, template, photoUrl, qrUrl, doc }: { payload: HeaderPayload; template: TemplateDef; photoUrl?: string; qrUrl?: string; doc: ResumeDoc }) {
  const t = template.tokens;
  const accent = doc.theme.accent || t.accent;
  const initials = payload.name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const photo = payload.showPhoto && photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- local object URL of the user's own photo
    <img
      src={photoUrl}
      alt="Profile"
      style={{
        width: 92,
        height: doc.photo.shape === 'portrait' ? 116 : 92,
        objectFit: 'cover',
        borderRadius: doc.photo.shape === 'circle' ? '50%' : doc.photo.shape === 'square' ? 4 : 12,
        clipPath: doc.photo.shape === 'hexagon' ? 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' : undefined,
      }}
    />
  ) : null;
  const qr = payload.qrEnabled && qrUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- locally generated QR data URL
    <img src={qrUrl} alt="QR code" style={{ width: doc.qr.sizeMm * 3.78, height: doc.qr.sizeMm * 3.78 }} />
  ) : null;
  const nameEl = (
    <h1 style={{ fontFamily: t.headingFont, fontSize: t.nameSize, lineHeight: 1.1, fontWeight: 700 }}>
      {payload.name || 'Your Name'}
    </h1>
  );
  const metaEl = (
    <>
      {payload.headline ? (
        <p style={{ color: accent, fontWeight: 600, marginTop: 2 }}>{payload.headline}</p>
      ) : null}
      {payload.contactLine ? <p style={{ color: t.muted, fontSize: t.baseSize - 1.5, marginTop: 3 }}>{payload.contactLine}</p> : null}
      {payload.linksLine ? <p style={{ color: t.muted, fontSize: t.baseSize - 1.5 }}>{payload.linksLine}</p> : null}
      {payload.sensitiveLine ? <p style={{ color: t.muted, fontSize: t.baseSize - 1.5 }}>{payload.sensitiveLine}</p> : null}
    </>
  );

  switch (template.header) {
    case 'centered':
      return (
        <header style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: 12 }}>
          {photo ? <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{photo}</div> : null}
          {nameEl}
          {metaEl}
          {qr ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>{qr}</div> : null}
        </header>
      );
    case 'band':
      return (
        <header style={{ background: accent, color: '#fff', margin: '-8px -8px 4px', padding: '16px 20px', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {photo}
            <div style={{ flex: 1, minWidth: 0 }}>
              {nameEl}
              {payload.headline ? <p style={{ fontWeight: 600, marginTop: 2, color: '#fff' }}>{payload.headline}</p> : null}
              {payload.contactLine ? <p style={{ fontSize: t.baseSize - 1.5, marginTop: 3, color: '#fff', opacity: 0.92 }}>{payload.contactLine}</p> : null}
              {payload.linksLine ? <p style={{ fontSize: t.baseSize - 1.5, color: '#fff', opacity: 0.92 }}>{payload.linksLine}</p> : null}
            </div>
            {qr}
          </div>
        </header>
      );
    case 'monogram':
      return (
        <header style={{ display: 'flex', gap: 16, alignItems: 'center', borderBottom: `1px solid ${t.muted}44`, paddingBottom: 12 }}>
          <div aria-hidden style={{ width: 64, height: 64, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.headingFont, fontSize: 24, fontWeight: 700, borderRadius: 8, flexShrink: 0 }}>
            {initials || '—'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {nameEl}
            {metaEl}
          </div>
          {photo}
          {qr}
        </header>
      );
    case 'rule-double':
      return (
        <header style={{ borderBottom: `4px double ${accent}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {nameEl}
              {metaEl}
            </div>
            {photo}
            {qr}
          </div>
        </header>
      );
    case 'split':
      return (
        <header style={{ display: 'flex', gap: 16, alignItems: 'flex-start', borderBottom: `1px solid ${t.muted}44`, paddingBottom: 12 }}>
          <div style={{ flex: 1.4, minWidth: 0 }}>
            {nameEl}
            {payload.headline ? <p style={{ color: accent, fontWeight: 600, marginTop: 2 }}>{payload.headline}</p> : null}
          </div>
          <div style={{ flex: 1, textAlign: 'end', color: t.muted, fontSize: t.baseSize - 1.5 }}>
            {payload.contactLine ? <p>{payload.contactLine}</p> : null}
            {payload.linksLine ? <p>{payload.linksLine}</p> : null}
            {payload.sensitiveLine ? <p>{payload.sensitiveLine}</p> : null}
          </div>
          {photo}
          {qr}
        </header>
      );
    case 'photo-left':
    case 'underline-accent':
    case 'left':
    default:
      return (
        <header
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            paddingBottom: 12,
            borderBottom: template.header === 'underline-accent' ? `3px solid ${accent}` : `1px solid ${t.muted}44`,
          }}
        >
          {photo}
          <div style={{ flex: 1, minWidth: 0 }}>
            {nameEl}
            {metaEl}
          </div>
          {qr}
        </header>
      );
  }
}

function SectionTitle({ title, template, index, doc }: { title: string; template: TemplateDef; index: number; doc: ResumeDoc }) {
  const t = template.tokens;
  const accent = doc.theme.accent || t.accent;
  const text = doc.theme.headingCase === 'upper' ? title.toUpperCase() : doc.theme.headingCase === 'title' ? title.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1)) : title;
  const base: React.CSSProperties = {
    fontFamily: t.headingFont,
    fontSize: t.headingSize,
    fontWeight: 700,
    letterSpacing: doc.theme.headingCase === 'upper' ? 0.6 : 0,
    color: accent,
    margin: 0,
  };
  switch (template.heading) {
    case 'band-chip':
      return (
        <h2 style={{ ...base, background: accent, color: '#fff', display: 'inline-block', padding: '2px 10px', borderRadius: 3 }}>
          {text}
        </h2>
      );
    case 'overline':
      return (
        <h2 style={{ ...base, borderTop: `2px solid ${accent}`, paddingTop: 6 }}>
          {text}
        </h2>
      );
    case 'numbered':
      return (
        <h2 style={{ ...base, borderBottom: `1px solid ${accent}`, paddingBottom: 3 }}>
          {index + 1}. {text}
        </h2>
      );
    case 'boxed':
      return (
        <h2 style={{ ...base, border: `1.5px solid ${accent}`, display: 'inline-block', padding: '2px 10px' }}>
          {text}
        </h2>
      );
    case 'plain-caps':
      return <h2 style={{ ...base, color: t.ink }}>{text}</h2>;
    case 'dot-leader':
      return (
        <h2 style={{ ...base, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span>{text}</span>
          <span aria-hidden style={{ flex: 1, borderBottom: `2px dotted ${accent}` }} />
        </h2>
      );
    case 'side-tab':
      return (
        <h2 style={{ ...base, borderInlineStart: `4px solid ${accent}`, paddingInlineStart: 8 }}>
          {text}
        </h2>
      );
    case 'rule-under':
    default:
      return (
        <h2 style={{ ...base, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3 }}>
          {text}
        </h2>
      );
  }
}

function BlockView({ block, template, doc, sectionIndex }: { block: Block; template: TemplateDef; doc: ResumeDoc; sectionIndex: number }) {
  const t = template.tokens;
  switch (block.kind) {
    case 'header':
      return null; // rendered separately at page top
    case 'section-title':
      return (
        <div style={{ marginTop: t.sectionGap, marginBottom: 6, breakAfter: 'avoid' }}>
          <SectionTitle title={(block.payload as { title: string }).title} template={template} index={sectionIndex} doc={doc} />
        </div>
      );
    case 'entry-head': {
      const p = block.payload as EntryPayload;
      const inner = (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
            <h3 style={{ fontWeight: 700, fontSize: t.baseSize + 0.5, margin: 0 }}>
              {p.title}
              {p.subtitle ? <span style={{ fontWeight: 400 }}> — {p.subtitle}</span> : null}
            </h3>
            {p.dateLine ? (
              <span style={{ color: t.muted, fontSize: t.baseSize - 1.5, whiteSpace: 'nowrap' }}>{p.dateLine}</span>
            ) : null}
          </div>
          {p.location ? <p style={{ color: t.muted, fontSize: t.baseSize - 1.5 }}>{p.location}</p> : null}
          {p.meta?.map((m, i) => (
            <p key={i} style={{ color: t.muted, fontSize: t.baseSize - 1 }}>
              {m}
            </p>
          ))}
          <Rich blocks={p.body} bullet={doc.theme.bulletStyle} />
        </>
      );
      if (template.layout === 'timeline') {
        return (
          <div style={{ position: 'relative', paddingInlineStart: 18, paddingBottom: t.entryGap, breakInside: 'avoid' }}>
            <span aria-hidden style={{ position: 'absolute', insetInlineStart: 3, top: 5, width: 8, height: 8, borderRadius: '50%', background: doc.theme.accent || t.accent }} />
            <span aria-hidden style={{ position: 'absolute', insetInlineStart: 6.5, top: 16, bottom: 0, width: 1.5, background: `${t.muted}55` }} />
            {inner}
          </div>
        );
      }
      return <article style={{ marginBottom: t.entryGap, breakInside: 'avoid' }}>{inner}</article>;
    }
    case 'rich':
      return (
        <div style={{ marginBottom: t.entryGap }}>
          <Rich blocks={(block.payload as { blocks: RichText }).blocks} bullet={doc.theme.bulletStyle} />
        </div>
      );
    case 'skills': {
      const p = block.payload as SkillsPayload;
      return (
        <div style={{ marginBottom: t.entryGap }}>
          {p.groups.map((g) => (
            <p key={g.name} style={{ marginBottom: 3 }}>
              {g.name ? <strong>{g.name}: </strong> : null}
              {g.skills
                .map((s) => (s.level ? `${s.name} (${s.level}/5)` : s.name))
                .join(' · ')}
            </p>
          ))}
        </div>
      );
    }
    case 'tags':
      return (
        <p style={{ marginBottom: t.entryGap }}>
          {(block.payload as { tags: string[] }).tags.join(' · ')}
        </p>
      );
    case 'table': {
      const rows = (block.payload as { rows: string[][] }).rows;
      return (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: t.entryGap, fontSize: t.baseSize - 1 }}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: `1px solid ${t.muted}66`, padding: '3px 6px' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'line': {
      const p = block.payload as { text: string; strong?: string; sub?: string };
      return (
        <p style={{ marginBottom: t.entryGap / 2 }}>
          {p.strong ? <strong>{p.strong}</strong> : null}
          {p.strong && p.text.length > p.strong.length ? <span>{p.text.slice(p.strong.length)}</span> : !p.strong ? p.text : null}
          {p.sub ? <span style={{ display: 'block', color: t.muted, fontSize: t.baseSize - 1 }}>{p.sub}</span> : null}
        </p>
      );
    }
    default:
      return null;
  }
}

export function TemplateView(props: {
  doc: ResumeDoc;
  template: TemplateDef;
  photoUrl?: string;
  qrUrl?: string;
}) {
  const { doc, template } = props;
  const t = template.tokens;
  const blocks = useMemo(() => buildBlocks(doc, template), [doc, template]);
  const header = blocks.find((b) => b.kind === 'header');
  const content = blocks.filter((b) => b.kind !== 'header');
  const usable = usableHeight(doc.theme.pageSize, doc.theme.margin);
  const pad = doc.theme.margin === 'narrow' ? 28 : doc.theme.margin === 'wide' ? 56 : 40;

  const mainBlocks = content.filter((b) => b.column === 'main');
  const sideBlocks = content.filter((b) => b.column === 'side');
  const mainPages = paginate(mainBlocks, usable - (header?.height ?? 90));
  const sidePages = template.columns === 2 ? paginate(sideBlocks, usable - (header?.height ?? 90)) : [];
  const pageCount = Math.max(mainPages.length, sidePages.length, 1);

  let sectionCounter = -1;
  const renderBlocks = (list: Block[], keyPrefix: string) =>
    list.map((b) => {
      if (b.kind === 'section-title') sectionCounter += 1;
      return <BlockView key={`${keyPrefix}-${b.id}`} block={b} template={template} doc={doc} sectionIndex={sectionCounter} />;
    });

  const isLabelColumn = template.layout === 'label-column';
  const isCards = template.layout === 'cards';
  const sidebarFirst = template.layout === 'sidebar-left';

  return (
    <div dir={doc.meta.direction} lang={doc.meta.language} data-testid="template-view">
      {Array.from({ length: pageCount }).map((_, pageIdx) => {
        sectionCounter = pageIdx === 0 ? -1 : sectionCounter;
        const main = mainPages[pageIdx]?.blocks ?? [];
        const side = sidePages[pageIdx]?.blocks ?? [];
        return (
          <div
            key={pageIdx}
            className="resume-page mx-auto bg-white text-neutral-900 shadow-md ring-1 ring-border"
            style={{
              width: '100%',
              maxWidth: PAGE_W[doc.theme.pageSize],
              minHeight: PAGE_H[doc.theme.pageSize],
              padding: pad,
              marginBottom: 20,
              fontFamily: t.bodyFont,
              fontSize: t.baseSize * doc.theme.fontScale,
              lineHeight: doc.theme.lineHeight,
              color: t.ink,
              background: t.surface,
            }}
          >
            {pageIdx === 0 && header ? (
              <HeaderBlock payload={header.payload as HeaderPayload} template={template} photoUrl={props.photoUrl} qrUrl={props.qrUrl} doc={doc} />
            ) : null}
            {template.columns === 2 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isLabelColumn
                    ? '150px 1fr'
                    : sidebarFirst
                      ? '31% 1fr'
                      : '1fr 31%',
                  gap: 22,
                  marginTop: pageIdx === 0 ? 6 : 0,
                }}
              >
                {sidebarFirst || isLabelColumn ? (
                  <>
                    <div>{renderBlocks(side, `p${pageIdx}-side`)}</div>
                    <div style={{ minWidth: 0 }}>{renderBlocks(main, `p${pageIdx}-main`)}</div>
                  </>
                ) : (
                  <>
                    <div style={{ minWidth: 0 }}>{renderBlocks(main, `p${pageIdx}-main`)}</div>
                    <div>{renderBlocks(side, `p${pageIdx}-side`)}</div>
                  </>
                )}
              </div>
            ) : (
              <div style={isCards ? { display: 'grid', gap: 12 } : undefined}>
                {renderBlocks(main, `p${pageIdx}-main`)}
              </div>
            )}
            {doc.qr.enabled && doc.qr.placement === 'footer' && props.qrUrl && pageIdx === pageCount - 1 ? (
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- locally generated QR data URL */}
                <img src={props.qrUrl} alt="QR code" style={{ width: doc.qr.sizeMm * 3.78, height: doc.qr.sizeMm * 3.78 }} />
                {doc.qr.label ? <span style={{ fontSize: t.baseSize - 1.5, color: t.muted }}>{doc.qr.label}</span> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
