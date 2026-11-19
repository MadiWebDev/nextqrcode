import { describe, it, expect } from 'vitest';
import { buildQrPayload, buildVCard, contrastRatio } from '../qr';
import { analyseWriting, atsHealthCheck, matchJobDescription } from '../review';
import { parseResumeText, importJsonResume } from '../importers';
import { encodeShareLink, decodeShareLink, shareableDoc } from '../share';
import { loadTemplate } from '../templates/registry';
import { newResumeDoc } from '../defaults';
import { rt } from '../schema';

describe('QR payloads', () => {
  it('builds a folded, escaped vCard 3.0 with only the chosen fields', () => {
    const doc = newResumeDoc({});
    doc.basics.name = 'Doe, Jane; A.';
    doc.basics.email = 'jane@example.com';
    doc.basics.phone = '+1 555 010 0000';
    doc.qr.target = 'vcard';
    doc.qr.vcardFields = ['name', 'email'];
    const card = buildVCard(doc);
    expect(card.startsWith('BEGIN:VCARD\r\nVERSION:3.0')).toBe(true);
    expect(card).toContain('FN:Doe\\, Jane\\; A.');
    expect(card).toContain('EMAIL;TYPE=INTERNET:jane@example.com');
    expect(card).not.toContain('TEL');
    for (const line of card.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  it('builds WhatsApp and mailto payloads from the resume details', () => {
    const doc = newResumeDoc({});
    doc.basics.phone = '+92 300 1234567';
    doc.basics.email = 'a@b.co';
    doc.qr.target = 'whatsapp';
    expect(buildQrPayload(doc)).toBe('https://wa.me/923001234567');
    doc.qr.target = 'email';
    expect(buildQrPayload(doc)).toBe('mailto:a@b.co');
  });

  it('contrast ratio: black on white is 21, light grey fails the scanner bar', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contrastRatio('#d4d4d4', '#ffffff')).toBeLessThan(4.5);
  });
});

describe('writing + ATS review', () => {
  it('flags weak openers, missing metrics and tense slips', async () => {
    const doc = newResumeDoc({});
    const exp = doc.sections.find((s) => s.kind === 'experience');
    exp!.experience = [
      {
        id: 'e1',
        role: 'Clerk',
        organization: 'Example',
        start: { y: 2019 },
        end: { y: 2021 },
        bullets: [
          rt.bullets([
            'Responsible for filing paperwork and general office duties for the department over two years',
            'Manage the front desk every day',
          ]),
        ],
      },
    ];
    const issues = analyseWriting(doc);
    expect(issues.some((i) => i.kind === 'weak-opener')).toBe(true);
    expect(issues.some((i) => i.kind === 'no-metric')).toBe(true);
    expect(issues.some((i) => i.kind === 'tense')).toBe(true);
  });

  it('ATS check passes a complete ATS-safe resume and warns on a designed one', async () => {
    const ats = await loadTemplate('universal-minimal');
    const designed = await loadTemplate('designer-portfolio');
    const doc = ats.sample();
    const passItems = atsHealthCheck(doc, ats);
    expect(passItems.find((i) => i.id === 'template')?.status).toBe('pass');
    expect(passItems.find((i) => i.id === 'contact')?.status).toBe('pass');
    const designedItems = atsHealthCheck(doc, designed);
    expect(designedItems.find((i) => i.id === 'template')?.status).toBe('warn');
  });

  it('JD matcher separates matched from missing terms literally', async () => {
    const template = await loadTemplate('data-analyst');
    const doc = template.sample();
    const result = matchJobDescription(
      doc,
      'We need SQL, Python and Tableau. Knowledge of Rust and COBOL is a plus. SQL daily.',
    );
    const matched = result.matched.map((m) => m.term);
    const missing = result.missing.map((m) => m.term);
    expect(matched).toContain('sql');
    expect(matched).toContain('tableau');
    expect(missing).toContain('rust');
    expect(result.coverage).toBeGreaterThan(0);
    expect(result.coverage).toBeLessThan(100);
  });
});

describe('importers', () => {
  it('parses a plain-text resume into sections with dates', () => {
    const text = [
      'Alex Morgan',
      'Operations Manager',
      'alex@example.com',
      '+1 555 010 0000',
      '',
      'Summary',
      'Operations manager with 8 years in logistics.',
      '',
      'Experience',
      'Operations Manager - Example Logistics Jan 2020 - Present',
      '• Cut delivery times by 18% across 3 depots',
      '• Manage a team of 14 drivers',
      'Coordinator - Sample Co Feb 2017 - Dec 2019',
      '• Scheduled 200 deliveries a week',
      '',
      'Education',
      'Example University BSc Business 2013 - 2017',
      '',
      'Skills',
      'Excel, Forecasting, Team leadership',
    ].join('\n');
    const result = parseResumeText(text, 'test');
    expect(result.doc.basics.name).toBe('Alex Morgan');
    expect(result.doc.basics.email).toBe('alex@example.com');
    const exp = result.doc.sections.find((s) => s.kind === 'experience');
    expect(exp?.experience?.length).toBe(2);
    expect(exp?.experience?.[0].current).toBe(true);
    expect(exp?.experience?.[0].start).toEqual({ y: 2020, m: 1 });
    const skills = result.doc.sections.find((s) => s.kind === 'skills');
    expect(skills?.skillGroups?.[0].skills.length).toBeGreaterThanOrEqual(3);
  });

  it('maps JSON Resume work and skills', () => {
    const result = importJsonResume({
      basics: { name: 'Sam Reyes', label: 'Designer', email: 'sam@example.com', summary: 'Designer.' },
      work: [{ name: 'Studio', position: 'Designer', startDate: '2020-01-01', highlights: ['Did things'] }],
      skills: [{ name: 'Design', keywords: ['Figma', 'CSS'] }],
    });
    expect(result.doc.basics.name).toBe('Sam Reyes');
    expect(result.doc.sections.find((s) => s.kind === 'experience')?.experience?.[0].role).toBe('Designer');
    expect(result.doc.sections.find((s) => s.kind === 'skills')?.skillGroups?.[0].skills[0].name).toBe('Figma');
  });
});

describe('share links', () => {
  it('round-trips a resume through a fragment link and strips the photo', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    doc.photo = { ...doc.photo, originalId: 'photo-1', croppedId: 'photo-2', show: true };
    const link = await encodeShareLink(doc, false, 'https://resumebuilder.freeqrcode.tools');
    expect(link.startsWith('https://resumebuilder.freeqrcode.tools/view#v1.')).toBe(true);
    const decoded = await decodeShareLink(new URL(link).hash);
    expect(decoded?.basics.name).toBe(doc.basics.name);
    expect(decoded?.photo.originalId).toBeUndefined();
    expect(decoded?.photo.show).toBe(false);
  });

  it('excludes sensitive values unless explicitly included', () => {
    const doc = newResumeDoc({});
    doc.sensitive = { cnic: { label: 'CNIC', value: '35202-0000000-0', include: true } } as never;
    const excluded = shareableDoc(doc, false);
    expect(Object.values(excluded.sensitive).every((f) => !f?.include)).toBe(true);
    const included = shareableDoc(doc, true);
    expect(Object.values(included.sensitive).some((f) => f?.include)).toBe(true);
  });

  it('rejects garbage fragments', async () => {
    expect(await decodeShareLink('#nonsense')).toBeNull();
    expect(await decodeShareLink('#v1.d.%%%')).toBeNull();
  });
});
