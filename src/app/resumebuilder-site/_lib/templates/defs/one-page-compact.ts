import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'one-page-compact',
  name: 'One-Page Compact',
  profession: 'General',
  category: 'General',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'rule-double',
  heading: 'dot-leader',
  tokens: { accent: '#111827', baseSize: 12.5, sectionGap: 10, entryGap: 5, palettes: ['#111827', '#1d4ed8', '#166534'] },
  sectionOrder: ['summary', 'experience', 'skills', 'education'],
  why: 'For early-career and high-volume applications where one page is the expectation. Type and spacing are tightened honestly — nothing is shrunk below a legible size; if content cannot fit, the builder warns instead of squeezing.',
  sample: () =>
    makeSample({
      templateId: 'one-page-compact',
      name: 'Lucas Meyer',
      headline: 'Customer Service Representative',
      email: 'lucas.meyer@example.com',
      phone: '+49 170 000 0000',
      location: 'Hamburg, Germany',
      region: 'eu',
      summary:
        'Customer service representative with 3 years in e-commerce support. Handles 60+ contacts a day across chat, email and phone with a 96% satisfaction score.',
      experience: [
        {
          role: 'Customer Service Representative',
          org: 'Fictional Shop Group',
          location: 'Hamburg',
          start: [2023, 1],
          current: true,
          bullets: [
            'Resolve 60+ contacts a day; 96% post-contact satisfaction over 12 months',
            'Handle escalations for delivery and refunds in German and English',
          ],
        },
        {
          role: 'Retail Assistant',
          org: 'Example Stores GmbH (fictional)',
          start: [2021, 6],
          end: [2022, 12],
          bullets: ['Till operation, stock and customer queries in a busy city-centre store'],
        },
      ],
      education: [
        { institution: 'Example Commercial School (fictional)', area: 'Business & Retail', studyType: 'Certificate', start: [2019], end: [2021] },
      ],
      skillGroups: [
        { name: 'Service', skills: ['De-escalation', 'Order systems', 'Written German & English'] },
        { name: 'Tools', skills: ['Helpdesk software (example)', 'Office suite', 'Fast, accurate typing'] },
      ],
    }),
});
