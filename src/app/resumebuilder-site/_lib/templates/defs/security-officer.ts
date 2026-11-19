import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'security-officer',
  name: 'Security Professional',
  profession: 'Security Officer',
  category: 'Services',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'band',
  heading: 'numbered',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#1e293b', palettes: ['#1e293b', '#7c2d12', '#166534', '#334155'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'skills', 'education'],
  why: 'Security employers verify licence, first aid and vetting before interview. A numbered, formal structure presents credentials and incident-handling experience with the gravity sites expect.',
  sample: () =>
    makeSample({
      templateId: 'security-officer',
      name: 'Viktor Petrov',
      headline: 'Security Officer — Corporate Sites',
      email: 'viktor.petrov@example.com',
      phone: '+359 88 000 0000',
      location: 'Plovdiv, Bulgaria',
      summary:
        'Licensed security officer with 8 years on corporate and retail sites. De-escalation trained, meticulous incident reporting and trusted with keyholding and alarm response.',
      experience: [
        {
          role: 'Security Officer',
          org: 'ShieldPoint Security (fictional)',
          location: 'Plovdiv',
          start: [2020, 1],
          current: true,
          bullets: [
            'Patrol and monitor a 24-hour logistics site with CCTV, access control and gatehouse duties',
            'Wrote incident reports used in 3 successful insurance claims',
            'Keyholder and first responder for alarm activations across 4 client sites',
          ],
        },
        {
          role: 'Retail Security Officer',
          org: 'Example Guarding Services (fictional)',
          location: 'Plovdiv',
          start: [2017, 6],
          end: [2019, 12],
          bullets: ['Loss-prevention duties in a flagship store; shrinkage down 18% year on year', 'De-escalated confrontations calmly with no injuries recorded'],
        },
      ],
      education: [
        { institution: 'Example Vocational School (fictional)', area: 'General', studyType: 'Certificate', start: [2011], end: [2015], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Security', skills: ['CCTV monitoring', 'Access control', 'Patrolling', 'Incident reporting', 'De-escalation', 'Keyholding'] },
        { name: 'Readiness', skills: ['First aid at work', 'Fire marshal', 'Radio procedure'] },
      ],
      extraSections: [
        extraSection('certifications', 'Licences', {
          certifications: [
            { id: 'so1', name: 'Security Guard Licence', issuer: 'National Licensing Authority (fictional)', credentialId: 'SG-000000' },
            { id: 'so2', name: 'First Aid at Work', issuer: 'Example First Aid Council (fictional)' },
          ],
        }),
      ],
    }),
});
