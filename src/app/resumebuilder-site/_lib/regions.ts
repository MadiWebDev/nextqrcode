import type { RegionId, SectionKind, SensitiveKey } from './schema';

/**
 * Regional modes (spec §6). Each sets default sections, the photo
 * recommendation, page-length guidance, date format and which sensitive
 * fields are *offered* (never pre-filled, never on by default).
 * Guidance is phrased as "commonly expected", not legal rules, and
 * carries the date it was last reviewed.
 */
export interface RegionDef {
  id: RegionId;
  label: string;
  photo: 'expected' | 'optional' | 'discouraged';
  photoNote: string;
  defaultSections: SectionKind[];
  sensitiveOffered: SensitiveKey[];
  dateFormat: 'mmm-yyyy' | 'mm-yyyy' | 'yyyy' | 'mmm-yyyy-range';
  spelling: string;
  pageGuidance: string;
  reviewedAt: string;
}

export const REGION_REVIEWED_AT = '2026-11-19';

export const REGIONS: Record<RegionId, RegionDef> = {
  'us-ca': {
    id: 'us-ca',
    label: 'United States / Canada',
    photo: 'discouraged',
    photoNote:
      'Photos are commonly discouraged in the US and Canada because of anti-discrimination practice. Most templates hide the photo in this mode.',
    defaultSections: ['summary', 'experience', 'education', 'skills', 'projects'],
    sensitiveOffered: [],
    dateFormat: 'mmm-yyyy',
    spelling: 'American English spelling (e.g. "organized") is customary.',
    pageGuidance: 'One page is customary under ~10 years of experience; two pages maximum for most roles.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  'uk-ie': {
    id: 'uk-ie',
    label: 'United Kingdom / Ireland',
    photo: 'discouraged',
    photoNote:
      'Photos and dates of birth are commonly left off UK and Irish CVs. "CV" is the usual word for the document.',
    defaultSections: ['summary', 'experience', 'education', 'skills'],
    sensitiveOffered: [],
    dateFormat: 'mmm-yyyy',
    spelling: 'British English spelling (e.g. "organised") is customary.',
    pageGuidance: 'Two pages is customary; one page for early-career applicants.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  eu: {
    id: 'eu',
    label: 'European Union',
    photo: 'optional',
    photoNote:
      'A professional photo is commonly included in many EU countries (e.g. Germany, France, Spain), and optional in others. The Europass-style template follows the public Europass conventions.',
    defaultSections: ['summary', 'experience', 'education', 'skills', 'languages'],
    sensitiveOffered: ['dateOfBirth', 'nationality'],
    dateFormat: 'mm-yyyy',
    spelling: 'British English spelling is customary for English-language EU CVs.',
    pageGuidance: 'Two pages is customary; academic and research CVs run longer.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  gulf: {
    id: 'gulf',
    label: 'Gulf / Middle East',
    photo: 'expected',
    photoNote:
      'A photo, nationality and visa status are commonly expected on Gulf-region CVs, and many employers ask for them explicitly in the job advert.',
    defaultSections: ['summary', 'experience', 'education', 'skills', 'languages'],
    sensitiveOffered: ['nationality', 'visaStatus', 'dateOfBirth', 'maritalStatus'],
    dateFormat: 'mmm-yyyy',
    spelling: 'British English spelling is customary.',
    pageGuidance: 'Two pages is customary; detailed project and site histories are valued in construction and engineering.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  'south-asia': {
    id: 'south-asia',
    label: 'South Asia (Pakistan, India & neighbours)',
    photo: 'expected',
    photoNote:
      'A photo is commonly expected, and many local employers still ask for date of birth, nationality and sometimes a parent\'s name. Add only what a specific employer asks for — each field below is off until you turn it on.',
    defaultSections: ['summary', 'experience', 'education', 'skills', 'languages', 'declaration'],
    sensitiveOffered: ['dateOfBirth', 'nationality', 'maritalStatus', 'parentName', 'drivingLicence'],
    dateFormat: 'mmm-yyyy',
    spelling: 'British English spelling is customary.',
    pageGuidance: 'Two to three pages is customary, including a signed declaration where employers expect one.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  'au-nz': {
    id: 'au-nz',
    label: 'Australia / New Zealand',
    photo: 'discouraged',
    photoNote:
      'Photos and personal details such as date of birth are commonly left off Australian and New Zealand resumes.',
    defaultSections: ['summary', 'experience', 'education', 'skills'],
    sensitiveOffered: ['visaStatus'],
    dateFormat: 'mmm-yyyy',
    spelling: 'Australian/New Zealand English spelling (e.g. "organised") is customary.',
    pageGuidance: 'Two to three pages is customary; cover letters are usually expected alongside.',
    reviewedAt: REGION_REVIEWED_AT,
  },
  academic: {
    id: 'academic',
    label: 'Academic CV (worldwide)',
    photo: 'optional',
    photoNote:
      'Photos are uncommon on academic CVs in most countries. Completeness matters more than length: publications, research and teaching are listed in full.',
    defaultSections: ['summary', 'education', 'research', 'publications', 'experience', 'courses', 'memberships', 'awards'],
    sensitiveOffered: [],
    dateFormat: 'yyyy',
    spelling: 'Match the spelling of the institution you are applying to.',
    pageGuidance: 'No fixed limit — a full record is expected. Order by the conventions of your field.',
    reviewedAt: REGION_REVIEWED_AT,
  },
};
