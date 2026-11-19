import { describe, it, expect } from 'vitest';
import { ResumeDocSchema, toJsonResume, rt } from '../schema';
import { newResumeDoc, makeSection } from '../defaults';

describe('resume schema', () => {
  it('round-trips a full document through parse unchanged', () => {
    const doc = newResumeDoc({ title: 'Test' });
    doc.basics.name = 'Ayesha Khan';
    doc.basics.email = 'ayesha@example.com';
    const exp = doc.sections.find((s) => s.kind === 'experience');
    exp!.experience = [
      {
        id: 'e1',
        role: 'Teacher',
        organization: 'Example School',
        start: { y: 2021, m: 9 },
        current: true,
        bullets: [rt.bullets(['Taught grades 6–8'])],
      },
    ];
    const parsed = ResumeDocSchema.parse(JSON.parse(JSON.stringify(doc)));
    expect(parsed.basics.name).toBe('Ayesha Khan');
    expect(parsed.sections.find((s) => s.kind === 'experience')!.experience![0].current).toBe(true);
  });

  it('rejects a document with the wrong schema version literal', () => {
    const doc = newResumeDoc();
    const bad = { ...doc, schemaVersion: 99 };
    expect(ResumeDocSchema.safeParse(bad).success).toBe(false);
  });

  it('keeps section payloads per kind via makeSection', () => {
    expect(makeSection('skills').skillGroups).toEqual([]);
    expect(makeSection('references').referencesMode).toBe('on-request');
    expect(makeSection('custom').customType).toBe('text');
  });

  it('maps to JSON Resume with work, education and skills', () => {
    const doc = newResumeDoc();
    doc.basics.name = 'Test Person';
    const exp = doc.sections.find((s) => s.kind === 'experience')!;
    exp.experience = [
      {
        id: 'e1',
        role: 'Welder',
        organization: 'Fictional Fabrication Co.',
        start: { y: 2019, m: 3 },
        end: { y: 2022, m: 6 },
        bullets: [rt.bullets(['MIG welding'])],
      },
    ];
    const skills = doc.sections.find((s) => s.kind === 'skills')!;
    skills.skillGroups = [{ id: 'g1', name: 'Welding', skills: [{ id: 's1', name: 'MIG' }] }];
    const jr = toJsonResume(doc) as {
      basics: { name: string };
      work: Array<{ position: string; startDate?: string; endDate?: string; highlights: string[] }>;
      skills: Array<{ name: string }>;
    };
    expect(jr.basics.name).toBe('Test Person');
    expect(jr.work[0].position).toBe('Welder');
    expect(jr.work[0].startDate).toBe('2019-03');
    expect(jr.work[0].endDate).toBe('2022-06');
    expect(jr.work[0].highlights).toEqual(['MIG welding']);
    expect(jr.skills[0].name).toBe('MIG');
  });

  it('rich text plain extraction joins paragraphs and bullets', () => {
    expect(rt.plain([rt.p('Hello'), rt.bullets(['one', 'two'])])).toBe('Hello\none\ntwo');
  });
});
