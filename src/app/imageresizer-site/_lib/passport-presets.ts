/**
 * Passport / visa / ID photo presets. Each entry carries its official
 * source and the date we last verified it (2026-11-13). Requirements
 * change and acceptance is always the issuing authority's decision — the
 * tool shows a compliance disclaimer with every preset and never promises
 * acceptance. The tool does positioning/cropping guidance only: NO face
 * recognition or biometric measurement anywhere.
 */

export interface PassportPreset {
  id: string;
  country: string;
  document: string;
  widthMm: number;
  heightMm: number;
  background: string;
  backgroundHex: string;
  source: string;
  sourceUrl: string;
  verifiedAt: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: 'us',
    country: 'United States',
    document: 'Passport / visa photo',
    widthMm: 50.8,
    heightMm: 50.8,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'U.S. Department of State (travel.state.gov)',
    sourceUrl: 'https://travel.state.gov/content/travel/en/passports/how-apply/photos.html',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'pk',
    country: 'Pakistan',
    document: 'Passport photo',
    widthMm: 50.8,
    heightMm: 50.8,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'Directorate General of Immigration & Passports (passport.gov.pk) — 2×2 inch is the commonly published requirement; confirm for your application type',
    sourceUrl: 'https://www.passport.gov.pk',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    document: 'Passport photo (digital)',
    widthMm: 35,
    heightMm: 45,
    background: 'Plain light grey or cream',
    backgroundHex: '#f2f2f2',
    source: 'GOV.UK passport photos guidance',
    sourceUrl: 'https://www.gov.uk/photos-for-passports',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'schengen',
    country: 'Schengen / EU',
    document: 'Visa photo',
    widthMm: 35,
    heightMm: 45,
    background: 'Plain light background',
    backgroundHex: '#eeeeee',
    source: 'EU Visa Code photo requirements (ICAO standard)',
    sourceUrl: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'ca',
    country: 'Canada',
    document: 'Passport photo',
    widthMm: 50,
    heightMm: 70,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'Government of Canada passport photo specifications',
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'au',
    country: 'Australia',
    document: 'Passport photo',
    widthMm: 35,
    heightMm: 45,
    background: 'Plain white or light',
    backgroundHex: '#ffffff',
    source: 'Australian Passport Office photo guidelines',
    sourceUrl: 'https://www.passports.gov.au/passport-photo-guidelines',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'in',
    country: 'India',
    document: 'Passport photo',
    widthMm: 50.8,
    heightMm: 50.8,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'Passport Seva (passportindia.gov.in) — 2×2 inch',
    sourceUrl: 'https://www.passportindia.gov.in',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'ae',
    country: 'UAE',
    document: 'Emirates ID / visa photo',
    widthMm: 43,
    heightMm: 55,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'UAE Federal Authority for Identity, Citizenship, Customs & Port Security (icp.gov.ae) — confirm current spec before applying',
    sourceUrl: 'https://icp.gov.ae',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'sa',
    country: 'Saudi Arabia',
    document: 'Visa / ID photo',
    widthMm: 40,
    heightMm: 60,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'Commonly published 4×6 cm requirement for Saudi visa applications — confirm with the visa centre for your application',
    sourceUrl: 'https://visa.mofa.gov.sa',
    verifiedAt: '2026-11-13',
  },
  {
    id: 'cn',
    country: 'China',
    document: 'Visa photo',
    widthMm: 33,
    heightMm: 48,
    background: 'Plain white',
    backgroundHex: '#ffffff',
    source: 'Chinese visa application photo requirements (33×48 mm)',
    sourceUrl: 'https://www.visaforchina.cn',
    verifiedAt: '2026-11-13',
  },
];

/** Pixel size for a preset at a print DPI. */
export function passportPixels(preset: PassportPreset, dpi = 300): { width: number; height: number } {
  return {
    width: Math.round((preset.widthMm / 25.4) * dpi),
    height: Math.round((preset.heightMm / 25.4) * dpi),
  };
}
