/** Download helpers + the all-formats ZIP bundle. */
import JSZip from 'jszip';
import type { ResumeDoc } from '../schema';
import { toJsonResume } from '../schema';
import type { TemplateDef } from '../templates/types';
import { buildDocx, type DocxAssets } from './docx';
import { toMarkdown, toPlainText, toStandaloneHtml } from './text';
import { resumeFilename } from '../validation';

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export interface ZipAssets extends DocxAssets {
  pageImages?: { name: string; blob: Blob }[];
}

/**
 * Every export format in one ZIP. The PDF is deliberately not inside:
 * it is produced by the browser's print pipeline for correct
 * complex-script rendering (see PDF_SPIKE.md), and the README in the
 * bundle says exactly that instead of shipping a lesser PDF silently.
 */
export async function buildAllFormatsZip(
  doc: ResumeDoc,
  template: TemplateDef,
  assets: ZipAssets = {},
): Promise<Blob> {
  const zip = new JSZip();
  const base = resumeFilename(doc.basics.name, doc.basics.headline ?? '', 'pdf').replace(/-Resume\.pdf$/, '');
  zip.file(`${base}.txt`, toPlainText(doc, template));
  zip.file(`${base}.md`, toMarkdown(doc, template));
  zip.file(`${base}.html`, toStandaloneHtml(doc, template));
  zip.file(`${base}.json`, JSON.stringify(doc, null, 2));
  zip.file(`${base}.jsonresume.json`, JSON.stringify(toJsonResume(doc), null, 2));
  const docx = await buildDocx(doc, template, assets);
  zip.file(`${base}.docx`, docx);
  if (assets.pageImages) {
    for (const img of assets.pageImages) zip.file(img.name, img.blob);
  }
  zip.file(
    'README.txt',
    [
      'This bundle was created by the free Resume Builder at resumebuilder.freeqrcode.tools.',
      'Everything was generated on your own device; nothing was uploaded.',
      '',
      'About the PDF: use the PDF button in the editor (it opens your',
      'browser print dialog — choose "Save as PDF" and turn off headers',
      'and footers). The PDF is printed from the live preview so Urdu,',
      'Arabic and other complex scripts render correctly, which a',
      'generated file cannot guarantee.',
    ].join('\n'),
  );
  return zip.generateAsync({ type: 'blob' });
}
