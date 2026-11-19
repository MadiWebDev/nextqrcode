/**
 * DOCX export via the `docx` library — the direct-download editable
 * format. Real named heading styles, a real bullet numbering
 * definition, tables preserved as tables, hyperlinks, photo and QR
 * images, RTL paragraph direction, and document core properties.
 *
 * Known, documented differences from the PDF (shown in the UI):
 * fonts fall back to the reader's installed set, pagination follows
 * Word/LibreOffice rules rather than the on-screen pages, and designed
 * templates simplify to a clean single-column reading layout.
 */
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ParagraphChild,
} from 'docx';
import type { ResumeDoc, RichSpan, RichText } from '../schema';
import { isSafeLink } from '../validation';
import type { TemplateDef, Block } from '../templates/types';
import {
  buildBlocks,
  type EntryPayload,
  type HeaderPayload,
  type SkillsPayload,
} from '../templates/build-blocks';

export interface DocxAssets {
  photo?: { data: ArrayBuffer; widthPx: number; heightPx: number };
  qrPng?: ArrayBuffer;
}

function spanChildren(spans: RichSpan[]): ParagraphChild[] {
  return spans.map((span) => {
    const marks = span.marks ?? {};
    if (marks.link && isSafeLink(marks.link)) {
      return new ExternalHyperlink({
        link: marks.link,
        children: [
          new TextRun({ text: span.text, bold: marks.bold, italics: marks.italic, style: 'Hyperlink' }),
        ],
      });
    }
    return new TextRun({ text: span.text, bold: marks.bold, italics: marks.italic });
  });
}

function richParagraphs(rich: RichText, rtl: boolean): Paragraph[] {
  const out: Paragraph[] = [];
  for (const block of rich) {
    if (block.type === 'paragraph') {
      out.push(new Paragraph({ bidirectional: rtl, children: spanChildren(block.spans) }));
    } else {
      for (const item of block.items) {
        out.push(
          new Paragraph({
            bidirectional: rtl,
            numbering: { reference: 'resume-bullets', level: 0 },
            children: spanChildren(item),
          }),
        );
      }
    }
  }
  return out;
}

function firstFamily(stack: string): string {
  return stack.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') || 'Calibri';
}

export async function buildDocx(
  doc: ResumeDoc,
  template: TemplateDef,
  assets: DocxAssets = {},
): Promise<Blob> {
  const rtl = doc.meta.direction === 'rtl';
  const blocks = buildBlocks(doc, template);
  const children: (Paragraph | Table)[] = [];

  if (assets.photo) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: assets.photo.data,
            transformation: {
              width: 110,
              height: Math.round((110 * assets.photo.heightPx) / Math.max(1, assets.photo.widthPx)) || 110,
            },
            altText: { title: 'Profile photo', description: 'Profile photo', name: 'photo' },
            type: 'jpg',
          }),
        ],
      }),
    );
  }

  for (const block of blocks as Block[]) {
    switch (block.kind) {
      case 'header': {
        const p = block.payload as HeaderPayload;
        children.push(
          new Paragraph({
            heading: HeadingLevel.TITLE,
            bidirectional: rtl,
            children: [new TextRun({ text: p.name, bold: true })],
          }),
        );
        if (p.headline) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: p.headline, italics: true })] }));
        if (p.contactLine) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: p.contactLine })] }));
        if (p.linksLine) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: p.linksLine })] }));
        if (p.sensitiveLine) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: p.sensitiveLine })] }));
        break;
      }
      case 'section-title':
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: rtl,
            children: [new TextRun({ text: (block.payload as { title: string }).title, bold: true })],
          }),
        );
        break;
      case 'entry-head': {
        const p = block.payload as EntryPayload;
        const head = [p.title, p.subtitle].filter(Boolean).join(' — ');
        if (head) {
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              bidirectional: rtl,
              children: [new TextRun({ text: head, bold: true })],
            }),
          );
        }
        const meta = [p.location, p.dateLine].filter(Boolean).join(' · ');
        if (meta) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: meta, italics: true })] }));
        for (const m of p.meta ?? []) children.push(new Paragraph({ bidirectional: rtl, children: [new TextRun({ text: m })] }));
        children.push(...richParagraphs(p.body, rtl));
        break;
      }
      case 'rich':
        children.push(...richParagraphs((block.payload as { blocks: RichText }).blocks, rtl));
        break;
      case 'skills': {
        const p = block.payload as SkillsPayload;
        for (const g of p.groups) {
          const names = g.skills.map((s) => s.name).join(' · ');
          children.push(
            new Paragraph({
              bidirectional: rtl,
              children: g.name
                ? [new TextRun({ text: `${g.name}: `, bold: true }), new TextRun({ text: names })]
                : [new TextRun({ text: names })],
            }),
          );
        }
        break;
      }
      case 'tags':
        children.push(
          new Paragraph({
            bidirectional: rtl,
            children: [new TextRun({ text: (block.payload as { tags: string[] }).tags.join(' · ') })],
          }),
        );
        break;
      case 'table': {
        const rows = (block.payload as { rows: string[][] }).rows;
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: rows.map(
              (row) =>
                new TableRow({
                  children: row.map(
                    (cell, i) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: rtl,
                            children: [new TextRun({ text: cell, bold: i === 0 })],
                          }),
                        ],
                      }),
                  ),
                }),
            ),
          }),
        );
        break;
      }
      case 'line': {
        const p = block.payload as { text: string; strong?: string; sub?: string };
        const runs: TextRun[] = [];
        if (p.strong && p.text.startsWith(p.strong)) {
          runs.push(new TextRun({ text: p.strong, bold: true }));
          const rest = p.text.slice(p.strong.length);
          if (rest) runs.push(new TextRun({ text: rest }));
        } else {
          runs.push(new TextRun({ text: p.text }));
        }
        if (p.sub && !p.text.includes(p.sub)) runs.push(new TextRun({ text: ` — ${p.sub}` }));
        children.push(new Paragraph({ bidirectional: rtl, children: runs }));
        break;
      }
    }
  }

  if (assets.qrPng) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: assets.qrPng,
            transformation: { width: 96, height: 96 },
            altText: { title: 'Contact QR code', description: 'QR code with contact details', name: 'qr' },
            type: 'png',
          }),
        ],
      }),
    );
  }

  const pageSize =
    doc.theme.pageSize === 'letter'
      ? { width: 12240, height: 15840 } // twips
      : { width: 11906, height: 16838 };

  const document = new Document({
    creator: doc.basics.name,
    title: `${doc.basics.name} — Resume`,
    description: `Resume of ${doc.basics.name}${doc.basics.headline ? `, ${doc.basics.headline}` : ''}`,
    numbering: {
      config: [
        {
          reference: 'resume-bullets',
          levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT }],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: firstFamily(template.tokens.bodyFont) } },
        heading1: {
          run: { font: firstFamily(template.tokens.headingFont), color: template.tokens.accent.replace('#', '') },
        },
        title: { run: { font: firstFamily(template.tokens.headingFont) } },
      },
    },
    sections: [
      {
        properties: {
          page: { size: pageSize, margin: { top: 720, bottom: 720, left: 900, right: 900 } },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(document);
}
