import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'software-engineer-clean',
  name: 'Software Engineer Clean ATS',
  profession: 'Software Engineer',
  category: 'Engineering',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'left',
  heading: 'plain-caps',
  tokens: { accent: '#1d4ed8', headingFont: 'Arial, Helvetica, sans-serif', palettes: ['#1d4ed8', '#0f766e', '#111827', '#7c3aed'] },
  sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
  why: 'Software hiring runs through parsers before people. This layout puts a scannable skills block directly under the summary, keeps every heading standard, and orders projects by evidence rather than decoration.',
  sample: () =>
    makeSample({
      templateId: 'software-engineer-clean',
      name: 'Daniel Okafor',
      headline: 'Software Engineer — Backend Systems',
      email: 'daniel.okafor@example.com',
      phone: '+1 555 010 2030',
      location: 'Austin, TX',
      summary:
        'Backend engineer with 5 years building payment and notification services. Comfortable owning a service end to end: design, rollout, on-call and the post-incident write-up.',
      experience: [
        {
          role: 'Software Engineer',
          org: 'Fictional Fintech Labs',
          location: 'Remote',
          start: [2022, 3],
          current: true,
          bullets: [
            'Cut payment-webhook processing latency from 900 ms to 210 ms by batching database writes',
            'Led migration of a legacy monolith module to a standalone service used by 40k merchants',
            'Mentor 2 junior engineers; run the team design-review rotation',
          ],
        },
        {
          role: 'Junior Software Engineer',
          org: 'Example Commerce Group (fictional)',
          start: [2020, 6],
          end: [2022, 2],
          bullets: [
            'Built internal order-tracking pages used by 300 support staff daily',
            'Wrote the integration test suite that cut release regressions by half',
          ],
        },
      ],
      education: [
        { institution: 'State University of Example (fictional)', area: 'Computer Science', studyType: 'BSc', start: [2016], end: [2020] },
      ],
      skillGroups: [
        { name: 'Languages', skills: ['TypeScript', 'Python', 'SQL', 'Go (working knowledge)'] },
        { name: 'Systems', skills: ['PostgreSQL', 'Redis', 'Kafka', 'Docker', 'AWS'] },
        { name: 'Practice', skills: ['API design', 'Observability', 'Incident response', 'Code review'] },
      ],
      extraSections: [
        extraSection('projects', 'Projects', {
          projects: [
            {
              id: 'p1',
              name: 'Open-source rate limiter',
              description: [],
              stack: ['TypeScript', 'Redis'],
              url: 'https://example.com/rate-limiter',
            },
          ],
        }),
      ],
    }),
});
