import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'accountant-ledger',
  name: 'Ledger & Close',
  profession: 'Accountant',
  category: 'Finance',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'left',
  heading: 'dot-leader',
  fontPair: 'lora-plex',
  tokens: { accent: '#334155', palettes: ['#334155', '#166534', '#1d4ed8', '#7c2d12'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
  why: 'Finance teams hire on systems, standards and close speed. Dot-leader dates keep tenures scannable while the single column lets screening software read every ledger keyword in order.',
  sample: () =>
    makeSample({
      templateId: 'accountant-ledger',
      name: 'Grace Mwangi',
      headline: 'Management Accountant',
      email: 'grace.mwangi@example.com',
      phone: '+254 700 000000',
      location: 'Nairobi, Kenya',
      summary:
        'Management accountant with 7 years across manufacturing and retail. Owns month-end close, budgeting and variance analysis; cut close time from 8 to 4 days at current employer.',
      experience: [
        {
          role: 'Management Accountant',
          org: 'Savanna Foods Ltd (fictional)',
          location: 'Nairobi',
          start: [2020, 5],
          current: true,
          bullets: [
            'Produce monthly management accounts for 3 business units by working day 4',
            'Built a rolling 13-week cash-flow forecast used by the executive team',
            'Led the annual budget process for a KES 1.2bn cost base (fictional)',
          ],
        },
        {
          role: 'Assistant Accountant',
          org: 'Example Retail Group (fictional)',
          location: 'Nairobi',
          start: [2017, 3],
          end: [2020, 4],
          bullets: ['Reconciled 14 bank accounts and 300 supplier statements monthly', 'Prepared VAT returns and supported two clean external audits'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Accounting & Finance', studyType: 'BCom', start: [2013], end: [2017], score: 'Second Class Upper' },
      ],
      skillGroups: [
        { name: 'Accounting', skills: ['Month-end close', 'Budgeting & forecasting', 'Variance analysis', 'IFRS', 'VAT & payroll taxes'] },
        { name: 'Systems', skills: ['SAP Business One', 'QuickBooks', 'Advanced Excel (Power Query)'] },
      ],
      extraSections: [
        extraSection('certifications', 'Professional Qualifications', {
          certifications: [{ id: 'a1', name: 'CPA (Part III)', issuer: 'Example Institute of Accountants (fictional)' }],
        }),
      ],
    }),
});
