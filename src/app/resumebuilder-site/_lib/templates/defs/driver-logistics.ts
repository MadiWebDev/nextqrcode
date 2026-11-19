import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'driver-logistics',
  name: 'On the Road',
  profession: 'Driver / Logistics',
  category: 'Logistics',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'left',
  heading: 'side-tab',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#065f46', palettes: ['#065f46', '#334155', '#1d4ed8', '#9a3412'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'skills', 'education'],
  why: 'Transport managers check licence categories, endorsements and safety record first. Licences lead the page and the driving history reads as clean, dated, parseable lines.',
  sample: () =>
    makeSample({
      templateId: 'driver-logistics',
      name: 'Krzysztof Zieliński',
      headline: 'HGV Driver — Category CE',
      email: 'k.zielinski@example.com',
      phone: '+48 510 000 000',
      location: 'Gdańsk, Poland',
      summary:
        'HGV driver with 10 years and 900,000 km accident-free. Experienced in multi-drop retail deliveries and trunking; calm with customers and meticulous with paperwork.',
      experience: [
        {
          role: 'HGV Driver (CE)',
          org: 'NordFreight Logistics (fictional)',
          location: 'Gdańsk',
          start: [2019, 4],
          current: true,
          bullets: [
            'Complete 8–12 multi-drop deliveries a day across the Tri-City area with 99.2% on-time rate',
            'Zero accidents and zero licence points across 6 years with the company',
            'Train new drivers on vehicle checks and load securing',
          ],
        },
        {
          role: 'Delivery Driver',
          org: 'Example Distribution (fictional)',
          location: 'Gdańsk',
          start: [2016, 1],
          end: [2019, 3],
          bullets: ['Delivered parcels and pallets on fixed rounds of 60+ drops', 'Maintained vehicle defect reports with no missed defects at audit'],
        },
      ],
      education: [
        { institution: 'Example Secondary School (fictional)', area: 'General', studyType: 'Certificate', start: [2010], end: [2014], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Driving', skills: ['Category CE (articulated)', 'Multi-drop planning', 'Load securing', 'Tachograph compliance', 'Vehicle checks'] },
        { name: 'Work habits', skills: ['POD paperwork', 'Customer handover', 'Route apps & scanners'] },
      ],
      extraSections: [
        extraSection('certifications', 'Licences', {
          certifications: [
            { id: 'dr1', name: 'Driving Licence — Categories B, C, CE', issuer: 'National Licensing Authority (fictional)', credentialId: 'DL-000000' },
            { id: 'dr2', name: 'Driver CPC (current)', issuer: 'Example Transport Institute (fictional)' },
          ],
        }),
      ],
    }),
});
