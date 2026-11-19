import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { loadTemplate } from '../../templates/registry';
import { toPlainText, toMarkdown, toStandaloneHtml, flattenBlocks } from '../text';
import { buildDocx } from '../docx';

describe('exports', () => {
  it('plain text follows the block reading order: header, main sections, side sections', async () => {
    const template = await loadTemplate('mechanical-engineer-sidebar');
    const doc = template.sample();
    const flat = flattenBlocks(doc, template).map((l) => l.text);
    expect(flat[0]).toBe('Tomasz Nowak');
    const text = toPlainText(doc, template);
    // Main-column experience appears before side-column skills content.
    expect(text.indexOf('EXPERIENCE')).toBeLessThan(text.indexOf('SolidWorks'));
    expect(text).toContain('Senior Mechanical Design Engineer');
  });

  it('markdown uses real heading levels', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    const md = toMarkdown(doc, template);
    expect(md.startsWith('# Maryam Siddiqui')).toBe(true);
    expect(md).toContain('## Experience');
    expect(md).toContain('- Raised the grade 9 class average');
  });

  it('standalone HTML is self-contained with semantic headings and no external refs', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    const html = toStandaloneHtml(doc, template);
    expect(html).toContain('<h1>Maryam Siddiqui</h1>');
    expect(html).toContain('<h2>Experience</h2>');
    expect(html).not.toMatch(/src=|href="http/);
  });

  it('DOCX contains ordered headings, a bullet numbering definition and core properties', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    const blob = await buildDocx(doc, template);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const xml = await zip.file('word/document.xml')!.async('text');
    expect(xml).toContain('Maryam Siddiqui');
    expect(xml.indexOf('Experience')).toBeLessThan(xml.indexOf('Education'));
    expect(xml).toContain('Heading1');
    const numbering = await zip.file('word/numbering.xml')!.async('text');
    expect(numbering).toContain('bullet');
    const core = await zip.file('docProps/core.xml')!.async('text');
    expect(core).toContain('Maryam Siddiqui');
  });

  it('DOCX for an RTL resume marks paragraphs bidirectional', async () => {
    const template = await loadTemplate('one-page-compact');
    const base = template.sample();
    const doc = { ...base, meta: { ...base.meta, direction: 'rtl' as const, language: 'ur' } };
    const blob = await buildDocx(doc, template);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const xml = await zip.file('word/document.xml')!.async('text');
    expect(xml).toContain('<w:bidi/>');
  });
});
