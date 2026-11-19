import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'fresher-graduate',
  name: 'Fresher / Graduate — Education First',
  profession: 'Fresher / Graduate',
  category: 'General',
  atsSafe: true,
  columns: 1,
  supportsPhoto: true,
  layout: 'single',
  header: 'underline-accent',
  heading: 'boxed',
  tokens: { accent: '#2563eb', palettes: ['#2563eb', '#0f766e', '#db2777', '#334155'] },
  sectionOrder: ['summary', 'education', 'projects', 'skills', 'experience', 'certifications', 'awards'],
  why: 'With little work history, education and projects are the evidence. This layout leads with qualifications, gives projects full entry treatment, and moves internships and volunteering into a supporting position instead of hiding them.',
  sample: () =>
    makeSample({
      templateId: 'fresher-graduate',
      name: 'Ananya Sharma',
      headline: 'Computer Science Graduate — Aspiring Data Analyst',
      email: 'ananya.sharma@example.com',
      phone: '+91 98000 00000',
      location: 'Pune, India',
      region: 'south-asia',
      summary:
        'Computer science graduate (2025) with strong SQL and Python fundamentals and two data projects completed end to end. Looking for a first analyst role where careful, checked work matters more than speed.',
      experience: [
        {
          role: 'Data Intern',
          org: 'Fictional Analytics Studio',
          location: 'Pune',
          start: [2024, 6],
          end: [2024, 12],
          bullets: [
            'Cleaned and documented a 40,000-row customer dataset used by the reporting team',
            'Built 3 recurring dashboards in a BI tool with written handover notes',
          ],
        },
      ],
      education: [
        { institution: 'Example University (fictional)', area: 'Computer Science', studyType: 'BSc', start: [2021], end: [2025], score: 'CGPA 8.7/10' },
      ],
      skillGroups: [
        { name: 'Data', skills: ['SQL', 'Python (pandas)', 'Excel — pivot tables & lookups', 'Power BI (example tool)'] },
        { name: 'Foundations', skills: ['Statistics', 'Data cleaning', 'Written documentation'] },
      ],
      extraSections: [
        extraSection('projects', 'Projects', {
          projects: [
            {
              id: 'p1',
              name: 'City bus punctuality analysis',
              description: [],
              stack: ['Python', 'SQL'],
            },
            {
              id: 'p2',
              name: 'Personal budget tracker (final-year project)',
              description: [],
              stack: ['Python', 'SQLite'],
            },
          ],
        }),
      ],
    }),
});
