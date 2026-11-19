#!/usr/bin/env node
/**
 * Scaffold a new Resume Builder template (spec §7: under 30 minutes).
 * Usage: npm run new:template -- <template-id> "<Display Name>" "<Profession>" <Category>
 * Creates src/app/resumebuilder-site/_lib/templates/defs/<id>.ts with a
 * starter definition and prints the registry lines to add. The
 * uniqueness test will fail until (layout, header, heading) differs
 * from every existing template — choose a fresh combination.
 */
import { writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [id, name, profession, category] = process.argv.slice(2);
if (!id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Usage: npm run new:template -- <kebab-id> "<Name>" "<Profession>" <Category>');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/app/resumebuilder-site/_lib/templates/defs', `${id}.ts`);
if (existsSync(target)) {
  console.error(`Template already exists: ${target}`);
  process.exit(1);
}
const content = `import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: '${id}',
  name: '${name ?? id}',
  profession: '${profession ?? 'General'}',
  category: '${category ?? 'General'}',
  atsSafe: true,
  columns: 1,
  supportsPhoto: true,
  layout: 'single', // TODO: pick a (layout, header, heading) triple nobody else uses
  header: 'left',
  heading: 'rule-under',
  tokens: { accent: '#0f766e' },
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
  why: 'TODO: two or three honest sentences on who this template serves and why its structure fits that profession.',
  sample: () =>
    makeSample({
      templateId: '${id}',
      name: 'Fictional Person',
      headline: '${profession ?? 'Professional'}',
      email: 'person@example.com',
      phone: '+1 555 010 0000',
      location: 'Example City',
      summary: 'TODO: an original two-sentence fictional summary.',
      experience: [
        {
          role: 'Example Role',
          org: 'Fictional Employer',
          start: [2022, 1],
          current: true,
          bullets: ['A measurable, honest achievement written for this sample only'],
        },
      ],
      education: [
        { institution: 'Example University (fictional)', area: 'Example Field', studyType: 'Degree', start: [2016], end: [2020] },
      ],
      skillGroups: [{ name: 'Core', skills: ['Example skill'] }],
    }),
});
`;
writeFileSync(target, content);
console.log(`Created ${target}`);
console.log('Now add to src/app/resumebuilder-site/_lib/templates/registry.ts:');
console.log(`  LOADERS: '${id}': () => import('./defs/${id}'),`);
console.log(`  TEMPLATE_META: { id: '${id}', name: '${name ?? id}', profession: '${profession ?? 'General'}', category: '${category ?? 'General'}' },`);
console.log('Then run: npx vitest run src/app/resumebuilder-site/_lib/templates (uniqueness + matrix tests).');
