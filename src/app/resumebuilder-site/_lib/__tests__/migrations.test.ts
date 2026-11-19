import { describe, it, expect } from 'vitest';
import { migrate0to1, migrateToCurrent } from '../migrations';
import { newResumeDoc } from '../defaults';

/** Fixture: a v0 (pre-release flat draft) document. */
const V0_FIXTURE = {
  id: 'legacy-1',
  title: 'Old CV',
  name: 'Bilal Ahmed',
  headline: 'Electrician',
  email: 'bilal@example.com',
  phone: '+92 300 0000000',
  location: 'Lahore, Pakistan',
  createdAt: 1700000000000,
  jobs: [
    { title: 'Electrician', company: 'Example Electricals', location: 'Lahore' },
    { title: 'Apprentice', company: 'Fictional Wiring Co.' },
  ],
};

describe('migrations', () => {
  it('migrates the v0 fixture to a valid v1 document', () => {
    const doc = migrateToCurrent(V0_FIXTURE);
    expect(doc.schemaVersion).toBe(1);
    expect(doc.basics.name).toBe('Bilal Ahmed');
    expect(doc.basics.headline).toBe('Electrician');
    const exp = doc.sections.find((s) => s.kind === 'experience');
    expect(exp?.experience).toHaveLength(2);
    expect(exp?.experience?.[0].organization).toBe('Example Electricals');
    expect(doc.extras).toMatchObject({ migratedFrom: 0 });
  });

  it('migrate0to1 is pure (input untouched)', () => {
    const copy = JSON.parse(JSON.stringify(V0_FIXTURE)) as typeof V0_FIXTURE;
    migrate0to1(copy);
    expect(copy).toEqual(V0_FIXTURE);
  });

  it('passes a current document through unchanged', () => {
    const doc = newResumeDoc({ title: 'Current' });
    const out = migrateToCurrent(JSON.parse(JSON.stringify(doc)));
    expect(out.meta.title).toBe('Current');
    expect(out.id).toBe(doc.id);
  });

  it('throws a plain-language error for non-resume input', () => {
    expect(() => migrateToCurrent(null)).toThrow(/does not contain a resume/);
    expect(() => migrateToCurrent('hello')).toThrow(/does not contain a resume/);
  });

  it('throws for a damaged current-version document', () => {
    expect(() => migrateToCurrent({ schemaVersion: 1, id: 'x' })).toThrow(/damaged or incomplete/);
  });
});
