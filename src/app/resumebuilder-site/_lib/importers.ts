/**
 * Importers (spec §9): PDF (pdf.js), DOCX (mammoth), JSON Resume and
 * LinkedIn data-export ZIP. Everything is parsed locally into a
 * *draft* ResumeDoc plus plain-language warnings; the user reviews
 * the result and chooses to save it as a NEW resume. Imports never
 * overwrite an existing resume silently (or at all).
 */
import JSZip from 'jszip';
import type { ResumeDoc, Section } from './schema';
import { rt } from './schema';
import { makeSection, newResumeDoc, uid } from './defaults';

export interface ImportResult {
  doc: ResumeDoc;
  warnings: string[];
  source: string;
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_RE = /\+?[\d][\d\s().-]{6,}\d/;
const DATE_RANGE_RE =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:–|-|—|to)\s*(Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})/i;

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseDate(text: string): { y: number; m?: number } | undefined {
  const t = text.trim();
  const yearOnly = t.match(/^(\d{4})$/);
  if (yearOnly) return { y: Number(yearOnly[1]) };
  const slash = t.match(/^(\d{1,2})\/(\d{4})$/);
  if (slash) return { y: Number(slash[2]), m: Number(slash[1]) };
  const named = t.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (named) {
    const m = MONTHS[named[1].slice(0, 3).toLowerCase()];
    if (m) return { y: Number(named[2]), m };
  }
  return undefined;
}

const HEADINGS: Array<{ kind: Section['kind']; patterns: RegExp }> = [
  { kind: 'summary', patterns: /^(professional\s+)?summary|profile|about(\s+me)?|objective/i },
  { kind: 'experience', patterns: /^(work\s+|professional\s+)?experience|employment(\s+history)?|career\s+history/i },
  { kind: 'education', patterns: /^education|academic/i },
  { kind: 'skills', patterns: /^(technical\s+)?skills|competencies|expertise/i },
  { kind: 'projects', patterns: /^projects/i },
  { kind: 'certifications', patterns: /^certifications?|licen[cs]es?/i },
  { kind: 'languages', patterns: /^languages/i },
  { kind: 'awards', patterns: /^awards|honou?rs/i },
];

/** Heuristic plain-text resume parser shared by the PDF/DOCX paths. */
export function parseResumeText(text: string, source: string): ImportResult {
  const warnings: string[] = [
    'Imported resumes are a starting draft: check every date, title and bullet against the original before using it.',
  ];
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const doc = newResumeDoc({ title: 'Imported resume' });
  const email = text.match(EMAIL_RE)?.[0];
  if (email) doc.basics.email = email;
  const phone = text.match(PHONE_RE)?.[0];
  if (phone) doc.basics.phone = phone.trim();

  // Split into headed chunks.
  const chunks: Array<{ kind: Section['kind'] | 'header'; lines: string[] }> = [
    { kind: 'header', lines: [] },
  ];
  for (const line of lines) {
    if (!line) continue;
    const heading = HEADINGS.find((h) => h.patterns.test(line) && line.length < 42);
    if (heading) chunks.push({ kind: heading.kind, lines: [] });
    else chunks[chunks.length - 1].lines.push(line);
  }

  const headerLines = chunks[0].lines.filter((l) => l !== email && l !== phone?.trim());
  if (headerLines[0]) doc.basics.name = headerLines[0];
  if (headerLines[1] && headerLines[1].length < 90) doc.basics.headline = headerLines[1];
  if (!doc.basics.name) warnings.push('Could not find a name — the first line of the document was expected to be one.');

  const sections: Section[] = [];
  for (const chunk of chunks.slice(1)) {
    if (chunk.lines.length === 0) continue;
    if (chunk.kind === 'summary') {
      const s = makeSection('summary');
      s.text = [rt.p(chunk.lines.join(' '))];
      sections.push(s);
    } else if (chunk.kind === 'experience' || chunk.kind === 'education') {
      const s = makeSection(chunk.kind);
      // Entries are separated by date-range lines or blank-line groups.
      let current: { head: string[]; bullets: string[]; dates?: RegExpMatchArray } | null = null;
      const flush = () => {
        if (!current || current.head.length === 0) return;
        const [title, org] = current.head[0].split(/\s+[-–—|@]\s+/);
        const start = current.dates ? parseDate(current.dates[1]) : undefined;
        const endRaw = current.dates?.[2] ?? '';
        const isCurrent = /present|current/i.test(endRaw);
        const end = isCurrent ? undefined : parseDate(endRaw);
        if (chunk.kind === 'experience') {
          s.experience = [
            ...(s.experience ?? []),
            {
              id: uid('exp'),
              role: title?.trim() ?? '',
              organization: (org ?? current.head[1] ?? '').trim(),
              start,
              end,
              current: isCurrent,
              bullets: current.bullets.length ? [rt.bullets(current.bullets)] : [],
            },
          ];
        } else {
          s.education = [
            ...(s.education ?? []),
            {
              id: uid('edu'),
              institution: title?.trim() ?? '',
              studyType: (org ?? '').trim(),
              area: '',
              start,
              end,
              bullets: [],
            },
          ];
        }
      };
      for (const line of chunk.lines) {
        const dates = line.match(DATE_RANGE_RE);
        const isBullet = /^[•\-*·]/.test(line);
        if (dates && !isBullet) {
          flush();
          current = { head: [line.replace(DATE_RANGE_RE, '').trim()].filter(Boolean), bullets: [], dates };
        } else if (isBullet) {
          if (!current) current = { head: [], bullets: [] };
          current.bullets.push(line.replace(/^[•\-*·]\s*/, ''));
        } else if (current && current.head.length < 2 && current.bullets.length === 0) {
          current.head.push(line);
        } else if (!current) {
          current = { head: [line], bullets: [] };
        } else {
          current.bullets.push(line);
        }
      }
      flush();
      if ((s.experience?.length ?? 0) + (s.education?.length ?? 0) > 0) sections.push(s);
      else warnings.push(`The ${chunk.kind} section was found but no entries could be separated — it was skipped.`);
    } else if (chunk.kind === 'skills') {
      const s = makeSection('skills');
      const names = chunk.lines
        .flatMap((l) => l.split(/[•·,|]/))
        .map((x) => x.trim())
        .filter((x) => x.length > 1 && x.length < 48);
      s.skillGroups = [{ id: uid('grp'), name: 'Skills', skills: names.map((name) => ({ id: uid('sk'), name })) }];
      if (names.length) sections.push(s);
    } else {
      const s = makeSection('custom');
      s.title = chunk.lines[0] ? chunk.kind : s.title;
      s.customType = 'text';
      s.text = [rt.p(chunk.lines.join(' '))];
      sections.push(s);
    }
  }
  if (sections.length) doc.sections = sections;
  else warnings.push('No recognisable sections were found. The document may use unusual headings or be a scanned image (image-only PDFs carry no text to import).');
  return { doc, warnings, source };
}

export async function importPdf(file: File): Promise<ImportResult> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageTexts: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    // Group text items into lines by their y coordinate.
    const rows = new Map<number, Array<{ x: number; str: string }>>();
    for (const item of content.items) {
      if (!('str' in item)) continue;
      const y = Math.round(item.transform[5]);
      const row = rows.get(y) ?? [];
      row.push({ x: item.transform[4], str: item.str });
      rows.set(y, row);
    }
    const lines = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) => items.sort((a, b) => a.x - b.x).map((i) => i.str).join(' '));
    pageTexts.push(lines.join('\n'));
  }
  const result = parseResumeText(pageTexts.join('\n'), 'PDF');
  if (!pageTexts.join('').trim()) {
    result.warnings.push('This PDF contains no extractable text — it is probably a scanned image. Type the content or use a text-based PDF.');
  }
  return result;
}

export async function importDocx(file: File): Promise<ImportResult> {
  const mammoth = await import('mammoth');
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return parseResumeText(value, 'DOCX');
}

export function importJsonResume(json: unknown): ImportResult {
  const warnings: string[] = [];
  const data = json as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const doc = newResumeDoc({ title: 'Imported resume (JSON Resume)' });
  const basics = data.basics ?? {};
  doc.basics.name = basics.name ?? '';
  doc.basics.headline = basics.label ?? '';
  doc.basics.email = basics.email ?? '';
  doc.basics.phone = basics.phone ?? '';
  doc.basics.website = basics.url ?? '';
  doc.basics.location = [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(', ');
  doc.basics.links = (basics.profiles ?? []).map((p: any) => ({ label: p.network ?? 'Profile', url: p.url ?? '' })); // eslint-disable-line @typescript-eslint/no-explicit-any
  const sections: Section[] = [];
  if (basics.summary) {
    const s = makeSection('summary');
    s.text = [rt.p(basics.summary)];
    sections.push(s);
  }
  if (Array.isArray(data.work) && data.work.length) {
    const s = makeSection('experience');
    s.experience = data.work.map((w: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: uid('exp'),
      role: w.position ?? '',
      organization: w.name ?? '',
      location: w.location,
      start: w.startDate ? parseDate(w.startDate.slice(0, 7).replace('-', '/')) ?? parseDate(w.startDate.slice(0, 4)) : undefined,
      end: w.endDate ? parseDate(w.endDate.slice(0, 4)) : undefined,
      current: !w.endDate,
      bullets: [rt.bullets([...(w.highlights ?? []), ...(w.summary ? [w.summary] : [])])],
    }));
    sections.push(s);
  }
  if (Array.isArray(data.education) && data.education.length) {
    const s = makeSection('education');
    s.education = data.education.map((e: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: uid('edu'),
      institution: e.institution ?? '',
      area: e.area ?? '',
      studyType: e.studyType ?? '',
      start: e.startDate ? parseDate(e.startDate.slice(0, 4)) : undefined,
      end: e.endDate ? parseDate(e.endDate.slice(0, 4)) : undefined,
      score: e.score,
      bullets: [],
    }));
    sections.push(s);
  }
  if (Array.isArray(data.skills) && data.skills.length) {
    const s = makeSection('skills');
    s.skillGroups = data.skills.map((g: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: uid('grp'),
      name: g.name ?? 'Skills',
      skills: (g.keywords ?? []).map((name: string) => ({ id: uid('sk'), name })),
    }));
    sections.push(s);
  }
  if (sections.length) doc.sections = sections;
  else warnings.push('This JSON did not contain the usual JSON Resume sections (basics, work, education, skills).');
  return { doc, warnings, source: 'JSON Resume' };
}

/** Minimal CSV parser (handles quoted fields and commas inside quotes). */
function parseCsv(text: string): Array<Record<string, string>> {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((c) => c.trim())) rows.push(row);
  }
  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((cells) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (cells[i] ?? '').trim()])),
  );
}

export async function importLinkedInZip(file: File): Promise<ImportResult> {
  const warnings: string[] = [
    'LinkedIn exports vary by account and year; check the imported draft carefully.',
  ];
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const read = async (name: string) => {
    const entry = Object.keys(zip.files).find((k) => k.toLowerCase().endsWith(name.toLowerCase()));
    return entry ? zip.files[entry].async('text') : null;
  };
  const doc = newResumeDoc({ title: 'Imported from LinkedIn' });
  const sections: Section[] = [];
  const profileCsv = await read('Profile.csv');
  if (profileCsv) {
    const profile = parseCsv(profileCsv)[0] ?? {};
    doc.basics.name = [profile['First Name'], profile['Last Name']].filter(Boolean).join(' ');
    doc.basics.headline = profile['Headline'] ?? '';
    doc.basics.location = profile['Geo Location'] ?? '';
    if (profile['Summary']) {
      const s = makeSection('summary');
      s.text = [rt.p(profile['Summary'])];
      sections.push(s);
    }
  } else warnings.push('No Profile.csv found in the ZIP — name and summary could not be imported.');
  const positionsCsv = await read('Positions.csv');
  if (positionsCsv) {
    const rows = parseCsv(positionsCsv);
    if (rows.length) {
      const s = makeSection('experience');
      s.experience = rows.map((r) => ({
        id: uid('exp'),
        role: r['Title'] ?? '',
        organization: r['Company Name'] ?? '',
        location: r['Location'],
        start: r['Started On'] ? parseDate(r['Started On']) : undefined,
        end: r['Finished On'] ? parseDate(r['Finished On']) : undefined,
        current: !r['Finished On'],
        bullets: r['Description'] ? [rt.p(r['Description'])] : [],
      }));
      sections.push(s);
    }
  }
  const educationCsv = await read('Education.csv');
  if (educationCsv) {
    const rows = parseCsv(educationCsv);
    if (rows.length) {
      const s = makeSection('education');
      s.education = rows.map((r) => ({
        id: uid('edu'),
        institution: r['School Name'] ?? '',
        area: r['Field of Study'] ?? '',
        studyType: r['Degree Name'] ?? '',
        start: r['Start Date'] ? parseDate(r['Start Date']) : undefined,
        end: r['End Date'] ? parseDate(r['End Date']) : undefined,
        bullets: [],
      }));
      sections.push(s);
    }
  }
  const skillsCsv = await read('Skills.csv');
  if (skillsCsv) {
    const rows = parseCsv(skillsCsv);
    if (rows.length) {
      const s = makeSection('skills');
      s.skillGroups = [
        { id: uid('grp'), name: 'Skills', skills: rows.map((r) => ({ id: uid('sk'), name: r['Name'] ?? '' })).filter((x) => x.name) },
      ];
      sections.push(s);
    }
  }
  if (sections.length) doc.sections = sections;
  return { doc, warnings, source: 'LinkedIn export' };
}

export async function importFile(file: File): Promise<ImportResult> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return importPdf(file);
  if (name.endsWith('.docx')) return importDocx(file);
  if (name.endsWith('.zip')) return importLinkedInZip(file);
  if (name.endsWith('.json')) {
    const parsed: unknown = JSON.parse(await file.text());
    // A native backup/resume JSON from this app also parses here.
    if (parsed && typeof parsed === 'object' && 'basics' in (parsed as object) && 'sections' in (parsed as object)) {
      const { ResumeDocSchema } = await import('./schema');
      const doc = ResumeDocSchema.parse(parsed);
      return { doc: { ...doc, id: uid('resume'), meta: { ...doc.meta, title: `${doc.meta.title} (imported)` } }, warnings: [], source: 'Resume JSON' };
    }
    return importJsonResume(parsed);
  }
  throw new Error('unsupported-file');
}
