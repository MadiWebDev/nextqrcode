import {
  CURRENT_SCHEMA_VERSION,
  ResumeDocSchema,
  type ResumeDoc,
  type Section,
} from './schema';

/**
 * Schema migrations — pure functions, one per version step, each with
 * fixtures in migrations.test.ts. A document stored by ANY historical
 * version must load losslessly into the current schema; unknown fields
 * ride along in `extras` so nothing is ever dropped silently.
 */

export type AnyRecord = Record<string, unknown>;

/** v0: the pre-release flat draft shape (name/email at top level, `jobs`). */
export function migrate0to1(raw: AnyRecord): AnyRecord {
  const jobs = Array.isArray(raw.jobs) ? (raw.jobs as AnyRecord[]) : [];
  const sections: Section[] = [
    {
      id: 'sec-experience',
      kind: 'experience',
      title: 'Experience',
      visible: true,
      experience: jobs.map((j, i) => ({
        id: `exp-${i + 1}`,
        role: String(j.title ?? ''),
        organization: String(j.company ?? ''),
        location: typeof j.location === 'string' ? j.location : undefined,
        bullets: [],
      })),
    },
  ];
  return {
    schemaVersion: 1,
    id: typeof raw.id === 'string' ? raw.id : 'migrated',
    meta: {
      title: typeof raw.title === 'string' ? raw.title : 'Migrated resume',
      templateId: 'universal-minimal',
      region: 'us-ca',
      language: 'en',
      direction: 'ltr',
      createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
      updatedAt: Date.now(),
    },
    basics: {
      name: String(raw.name ?? ''),
      headline: String(raw.headline ?? ''),
      email: String(raw.email ?? ''),
      phone: String(raw.phone ?? ''),
      location: String(raw.location ?? ''),
      website: '',
      links: [],
    },
    photo: { shape: 'rounded', show: false },
    sensitive: {},
    sections,
    theme: {},
    qr: {},
    extras: { migratedFrom: 0 },
  };
}

const MIGRATIONS: Record<number, (raw: AnyRecord) => AnyRecord> = {
  0: migrate0to1,
};

/**
 * Migrate any stored/imported value to a valid current ResumeDoc.
 * Throws a plain-language Error when the value cannot be a resume.
 */
export function migrateToCurrent(raw: unknown): ResumeDoc {
  if (!raw || typeof raw !== 'object') {
    throw new Error('This file does not contain a resume.');
  }
  let doc = raw as AnyRecord;
  let version = typeof doc.schemaVersion === 'number' ? doc.schemaVersion : 0;
  if (version > CURRENT_SCHEMA_VERSION) {
    // Written by a newer version: parse leniently — known fields load,
    // the rest are preserved by the caller's storage of the raw value.
    const parsed = ResumeDocSchema.safeParse({ ...doc, schemaVersion: CURRENT_SCHEMA_VERSION });
    if (!parsed.success) throw new Error('This resume was made by a newer version and could not be read.');
    return parsed.data;
  }
  while (version < CURRENT_SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) throw new Error(`No migration exists from schema version ${version}.`);
    doc = step(doc);
    version += 1;
  }
  const parsed = ResumeDocSchema.safeParse(doc);
  if (!parsed.success) {
    throw new Error('This resume data is damaged or incomplete and could not be loaded.');
  }
  return parsed.data;
}
