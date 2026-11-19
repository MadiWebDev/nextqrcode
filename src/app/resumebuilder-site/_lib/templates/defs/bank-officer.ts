import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'bank-officer',
  name: 'Banking Officer',
  profession: 'Bank Officer',
  category: 'Finance',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'band',
  heading: 'rule-under',
  fontPair: 'source-inter',
  tokens: { accent: '#1e3a5f', palettes: ['#1e3a5f', '#334155', '#166534', '#7c2d12'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
  why: 'Banks screen for compliance, accuracy and customer handling in that order. A formal band header and strict single column present a trustworthy, machine-readable record.',
  sample: () =>
    makeSample({
      templateId: 'bank-officer',
      name: 'Rohan Mehta',
      headline: 'Bank Officer — Retail Banking',
      email: 'rohan.mehta@example.com',
      phone: '+91 98100 00000',
      location: 'Delhi, India',
      summary:
        'Retail bank officer with 5 years in branch operations: account opening, KYC/AML checks, cash management and service recovery. Consistently top-quartile on audit scores.',
      experience: [
        {
          role: 'Bank Officer',
          org: 'National Example Bank (fictional)',
          location: 'Delhi',
          start: [2021, 6],
          current: true,
          bullets: [
            'Process 40+ account openings and KYC reviews a week with zero audit findings in 2024',
            'Handle daily cash and vault operations up to ₹2 crore (fictional) under dual control',
            'Resolve escalated service complaints within the same working day in 92% of cases',
          ],
        },
        {
          role: 'Banking Assistant',
          org: 'Example Co-operative Bank (fictional)',
          location: 'Delhi',
          start: [2019, 4],
          end: [2021, 5],
          bullets: ['Served 80+ counter customers a day across deposits, withdrawals and drafts', 'Trained 3 new assistants on core banking software'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Commerce', studyType: 'BCom (Hons)', start: [2015], end: [2018], score: 'First Division' },
      ],
      skillGroups: [
        { name: 'Banking', skills: ['KYC / AML checks', 'Account opening', 'Cash & vault operations', 'Loan documentation support'] },
        { name: 'Systems', skills: ['Core banking (Finacle)', 'CRM', 'MS Office'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'b1', name: 'Certified AML Associate', issuer: 'Example Banking Institute (fictional)' }],
        }),
      ],
    }),
});
