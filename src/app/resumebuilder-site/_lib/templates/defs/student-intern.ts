import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'student-intern',
  name: 'Student & Intern',
  profession: 'Student / Intern',
  category: 'Early Career',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'split',
  heading: 'band-chip',
  fontPair: 'source-inter',
  tokens: { accent: '#2563eb', palettes: ['#2563eb', '#0f766e', '#db2777', '#334155'] },
  sectionOrder: ['summary', 'education', 'projects', 'experience', 'skills'],
  why: 'Students win internships with coursework, projects and society roles — not job titles. Education and projects lead, and part-time work is framed for the reliability and customer skills it proves.',
  sample: () =>
    makeSample({
      templateId: 'student-intern',
      name: 'Zainab Ali',
      headline: 'Computer Science Student — Seeking Summer Internship',
      email: 'zainab.ali@example.com',
      phone: '+92 345 0000000',
      location: 'Faisalabad, Pakistan',
      summary:
        'Final-year computer science student (CGPA 3.7/4.0) looking for a summer software internship. Built 3 full projects in JavaScript and Python; treasurer of the university computing society.',
      experience: [
        {
          role: 'Retail Assistant (part-time)',
          org: 'Example Bookstore (fictional)',
          location: 'Faisalabad',
          start: [2023, 6],
          current: true,
          bullets: ['Serve customers and run the till during weekend shifts', 'Trusted with opening, closing and cashing-up'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Computer Science', studyType: 'BS', start: [2022], end: [2026], score: 'CGPA 3.7 / 4.0 (current)' },
      ],
      skillGroups: [
        { name: 'Technical', skills: ['JavaScript', 'Python', 'HTML & CSS', 'Git', 'SQL basics'] },
        { name: 'General', skills: ['Customer service', 'Cash handling', 'Teamwork', 'Urdu & English'] },
      ],
      extraSections: [
        extraSection('projects', 'Projects', {
          entries: [
            { id: 'si1', title: 'Study Group Finder (course project)', organization: 'Personal project', bullets: bulletsOf(['Web app matching students into study groups; built with JavaScript and a small Python API']) },
            { id: 'si2', title: 'Library Book Tracker', organization: 'University computing society', bullets: bulletsOf(['Tracks society library loans for 120 members']) },
          ],
        }),
      ],
    }),
});
