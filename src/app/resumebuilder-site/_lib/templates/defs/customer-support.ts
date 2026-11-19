import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'customer-support',
  name: 'Support Star',
  profession: 'Customer Support Specialist',
  category: 'Support',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'plain-caps',
  fontPair: 'source-inter',
  tokens: { accent: '#7c3aed', palettes: ['#7c3aed', '#0369a1', '#0f766e', '#334155'] },
  sectionOrder: ['summary', 'experience', 'skills', 'education', 'languages'],
  why: 'Support hiring runs on metrics and tone: CSAT, first-response time, channels and languages. This layout puts measured service results and language coverage in the exact order support managers scan.',
  sample: () =>
    makeSample({
      templateId: 'customer-support',
      name: 'Ana Beatriz Lima',
      headline: 'Customer Support Specialist — Chat & Email',
      email: 'ana.lima@example.com',
      phone: '+55 11 90000 0000',
      location: 'São Paulo, Brazil',
      summary:
        'Customer support specialist with 4 years across chat, email and phone for e-commerce. CSAT 4.9/5 over 6,000+ conversations; writes help-centre articles customers actually find.',
      experience: [
        {
          role: 'Customer Support Specialist',
          org: 'ShopNorte (fictional)',
          location: 'São Paulo',
          start: [2022, 1],
          current: true,
          bullets: [
            'Handle 55–70 chats and emails a day with a 4.9/5 CSAT and 3-minute median first response',
            'Wrote 24 help-centre articles that deflect ~400 tickets a month',
            'Coach new starters on tone and de-escalation during their first month',
          ],
        },
        {
          role: 'Support Agent',
          org: 'Example Telecom (fictional)',
          location: 'São Paulo',
          start: [2020, 6],
          end: [2021, 12],
          bullets: ['Resolved billing and connectivity cases on phone and email', 'Met quality scores of 95%+ across 6 consecutive reviews'],
        },
      ],
      education: [
        { institution: 'Example Technical College (fictional)', area: 'Business Administration', studyType: 'Diploma', start: [2018], end: [2020], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Support', skills: ['Live chat', 'Email support', 'De-escalation', 'Knowledge-base writing', 'QA reviews'] },
        { name: 'Tools', skills: ['Zendesk', 'Intercom', 'Slack', 'Notion'] },
      ],
      extraSections: [
        extraSection('languages', 'Languages', {
          languages: [
            { id: 'l1', language: 'Portuguese', fluency: 'Native' },
            { id: 'l2', language: 'English', fluency: 'Fluent (written support)' },
            { id: 'l3', language: 'Spanish', fluency: 'Intermediate' },
          ],
        }),
      ],
    }),
});
