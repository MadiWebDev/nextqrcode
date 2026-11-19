import { describe, it, expect } from 'vitest';
import { analyseTimeline, formatDateRange, totalExperienceMonths } from '../dates';
import { isValidEmail, normaliseUrl, sanitiseRichText, resumeFilename } from '../validation';
import { rt } from '../schema';

describe('dates', () => {
  it('formats ranges with Present for current roles', () => {
    expect(formatDateRange({ y: 2021, m: 9 }, undefined, true, 'mmm-yyyy')).toBe('Sep 2021 – Present');
    expect(formatDateRange({ y: 2019 }, { y: 2021 }, false, 'yyyy')).toBe('2019 – 2021');
    expect(formatDateRange({ y: 2020, m: 3 }, { y: 2022, m: 6 }, false, 'mm-yyyy')).toBe('03/2020 – 06/2022');
  });

  it('detects a gap longer than 3 months', () => {
    const findings = analyseTimeline(
      [
        { id: 'a', label: 'Job A', start: { y: 2018, m: 1 }, end: { y: 2019, m: 12 } },
        { id: 'b', label: 'Job B', start: { y: 2020, m: 8 }, end: { y: 2021, m: 1 } },
      ],
      2025 * 12,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('gap');
    expect(findings[0].months).toBe(7);
  });

  it('detects an overlap', () => {
    const findings = analyseTimeline(
      [
        { id: 'a', label: 'Job A', start: { y: 2020, m: 1 }, end: { y: 2021, m: 6 } },
        { id: 'b', label: 'Job B', start: { y: 2021, m: 3 }, end: { y: 2022, m: 1 } },
      ],
      2025 * 12,
    );
    expect(findings[0].type).toBe('overlap');
  });

  it('counts union experience months without double-counting overlaps', () => {
    const months = totalExperienceMonths(
      [
        { id: 'a', label: 'A', start: { y: 2020, m: 1 }, end: { y: 2020, m: 12 } },
        { id: 'b', label: 'B', start: { y: 2020, m: 7 }, end: { y: 2021, m: 6 } },
      ],
      2025 * 12,
    );
    expect(months).toBe(18);
  });
});

describe('validation', () => {
  it('validates emails', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
  });

  it('normalises URLs by adding https', () => {
    expect(normaliseUrl('example.com/work')).toBe('https://example.com/work');
    expect(normaliseUrl('https://x.dev')).toBe('https://x.dev');
    expect(normaliseUrl('  ')).toBe('');
  });

  it('sanitises rich text: strips javascript: links, keeps https', () => {
    const dirty = [
      {
        type: 'paragraph' as const,
        spans: [
          { text: 'bad', marks: { link: 'javascript:alert(1)' } },
          { text: 'good', marks: { link: 'https://example.com', bold: true } },
        ],
      },
    ];
    const clean = sanitiseRichText(dirty);
    const para = clean[0];
    if (para.type !== 'paragraph') throw new Error('expected paragraph');
    expect(para.spans[0].marks).toBeUndefined();
    expect(para.spans[1].marks?.link).toBe('https://example.com');
    expect(para.spans[1].marks?.bold).toBe(true);
  });

  it('builds sanitised filenames with a Unicode-safe fallback', () => {
    expect(resumeFilename('Ayesha Khan', 'Teacher', 'pdf')).toBe('Ayesha-Khan-Teacher-Resume.pdf');
    expect(resumeFilename('', '', 'docx')).toBe('Resume-Resume.docx');
    expect(resumeFilename('José Núñez', '', 'pdf')).toBe('Jose-Nunez-Resume.pdf');
    expect(resumeFilename('a/b\\c:d', 'x', 'pdf')).not.toMatch(/[/\\:]/);
    expect(rt.plain([rt.p('x')])).toBe('x');
  });
});
