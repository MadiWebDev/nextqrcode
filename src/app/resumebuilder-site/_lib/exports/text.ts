/**
 * Text-based exports (TXT, Markdown, standalone HTML), all generated
 * from the same block model the templates render — never a second
 * hand-maintained copy of the content logic.
 */
import type { ResumeDoc, RichText } from '../schema';
import type { TemplateDef, Block } from '../templates/types';
import {
  buildBlocks,
  type EntryPayload,
  type HeaderPayload,
  type SkillsPayload,
} from '../templates/build-blocks';

function richLines(rich: RichText): string[] {
  const lines: string[] = [];
  for (const b of rich) {
    if (b.type === 'paragraph') lines.push(b.spans.map((s) => s.text).join(''));
    else for (const item of b.items) lines.push(`- ${item.map((s) => s.text).join('')}`);
  }
  return lines;
}

interface FlatLine {
  kind: 'title' | 'heading' | 'subheading' | 'text' | 'bullet' | 'entry';
  text: string;
}

/** Flatten the block model into a linear reading-order line list. */
export function flattenBlocks(doc: ResumeDoc, template: TemplateDef): FlatLine[] {
  const blocks = buildBlocks(doc, template);
  const out: FlatLine[] = [];
  for (const block of blocks as Block[]) {
    switch (block.kind) {
      case 'header': {
        const p = block.payload as HeaderPayload;
        out.push({ kind: 'title', text: p.name });
        if (p.headline) out.push({ kind: 'text', text: p.headline });
        if (p.contactLine) out.push({ kind: 'text', text: p.contactLine });
        if (p.linksLine) out.push({ kind: 'text', text: p.linksLine });
        if (p.sensitiveLine) out.push({ kind: 'text', text: p.sensitiveLine });
        break;
      }
      case 'section-title':
        out.push({ kind: 'heading', text: (block.payload as { title: string }).title });
        break;
      case 'entry-head': {
        const p = block.payload as EntryPayload;
        const head = [p.title, p.subtitle].filter(Boolean).join(' — ');
        if (head) out.push({ kind: 'subheading', text: head });
        const meta = [p.location, p.dateLine].filter(Boolean).join(' · ');
        if (meta) out.push({ kind: 'text', text: meta });
        for (const m of p.meta ?? []) out.push({ kind: 'text', text: m });
        for (const line of richLines(p.body)) {
          out.push({ kind: line.startsWith('- ') ? 'bullet' : 'text', text: line.replace(/^- /, '') });
        }
        break;
      }
      case 'rich':
        for (const line of richLines((block.payload as { blocks: RichText }).blocks)) {
          out.push({ kind: line.startsWith('- ') ? 'bullet' : 'text', text: line.replace(/^- /, '') });
        }
        break;
      case 'skills': {
        const p = block.payload as SkillsPayload;
        for (const g of p.groups) {
          const names = g.skills.map((s) => s.name).join(' · ');
          out.push({ kind: 'entry', text: g.name ? `${g.name}: ${names}` : names });
        }
        break;
      }
      case 'tags':
        out.push({ kind: 'entry', text: (block.payload as { tags: string[] }).tags.join(' · ') });
        break;
      case 'table': {
        const rows = (block.payload as { rows: string[][] }).rows;
        for (const row of rows) out.push({ kind: 'entry', text: row.join(' | ') });
        break;
      }
      case 'line': {
        const p = block.payload as { text: string };
        out.push({ kind: 'entry', text: p.text });
        break;
      }
    }
  }
  return out;
}

export function toPlainText(doc: ResumeDoc, template: TemplateDef): string {
  return flattenBlocks(doc, template)
    .map((l) => {
      switch (l.kind) {
        case 'title':
          return l.text;
        case 'heading':
          return `\n${l.text.toUpperCase()}`;
        case 'bullet':
          return `- ${l.text}`;
        default:
          return l.text;
      }
    })
    .join('\n');
}

export function toMarkdown(doc: ResumeDoc, template: TemplateDef): string {
  return flattenBlocks(doc, template)
    .map((l) => {
      switch (l.kind) {
        case 'title':
          return `# ${l.text}`;
        case 'heading':
          return `\n## ${l.text}`;
        case 'subheading':
          return `### ${l.text}`;
        case 'bullet':
          return `- ${l.text}`;
        default:
          return l.text;
      }
    })
    .join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * A single self-contained HTML file (inline styles, no external
 * requests) — safe to email or open offline. Simple semantic markup
 * with real heading levels: the most accessible export format.
 */
export function toStandaloneHtml(doc: ResumeDoc, template: TemplateDef): string {
  const lines = flattenBlocks(doc, template);
  const parts: string[] = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      parts.push('</ul>');
      inList = false;
    }
  };
  for (const l of lines) {
    if (l.kind !== 'bullet') closeList();
    switch (l.kind) {
      case 'title':
        parts.push(`<h1>${escapeHtml(l.text)}</h1>`);
        break;
      case 'heading':
        parts.push(`<h2>${escapeHtml(l.text)}</h2>`);
        break;
      case 'subheading':
        parts.push(`<h3>${escapeHtml(l.text)}</h3>`);
        break;
      case 'bullet':
        if (!inList) {
          parts.push('<ul>');
          inList = true;
        }
        parts.push(`<li>${escapeHtml(l.text)}</li>`);
        break;
      default:
        parts.push(`<p>${escapeHtml(l.text)}</p>`);
    }
  }
  closeList();
  const rtl = doc.meta.direction === 'rtl';
  return `<!DOCTYPE html>
<html lang="${escapeHtml(doc.meta.language)}"${rtl ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<title>${escapeHtml(doc.basics.name)} — Resume</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 44rem; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.5; }
  h1 { margin-bottom: 0.2rem; }
  h2 { border-bottom: 2px solid ${template.tokens.accent}; padding-bottom: 0.2rem; margin-top: 1.6rem; }
  h3 { margin-bottom: 0.1rem; }
</style>
</head>
<body>
${parts.join('\n')}
</body>
</html>`;
}

