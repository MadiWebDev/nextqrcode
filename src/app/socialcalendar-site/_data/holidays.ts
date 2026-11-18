/**
 * Holidays & seasonal planning dataset (spec §15) — 2026–2028.
 *
 * Self-contained curated data for the local-first Social Media Calendar:
 * the main public holidays for 17 countries plus worldwide (INTL)
 * awareness, cultural and retail days, each with an explicit calendar
 * date for 2026, 2027 and 2028 and a short content-planning suggestion.
 *
 * Movable feasts use year-specific dates:
 *  - Easter-based dates derive from Easter Sunday 2026-04-05,
 *    2027-03-28 and 2028-04-16 (Good Friday = −2 days, Easter Monday
 *    = +1, Ash Wednesday = −46, Ascension = +39, Whit Monday = +50).
 *  - Islamic dates are EXPECTED dates subject to moon sighting — see
 *    MOON_SIGHTING_DISCLAIMER — and are flagged `lunar: true`.
 *  - Diwali, Holi, Chinese New Year, Nyepi and Thaipusam use the
 *    standard published lunisolar dates but are flagged `lunar: false`
 *    (the flag is reserved for moon-sighting-dependent dates).
 *  - UK substitute-day rules are intentionally ignored: the calendar
 *    date is used.
 */

export type HolidayCategory =
  | 'public'
  | 'religious'
  | 'awareness'
  | 'retail'
  | 'business'
  | 'cultural';

export interface Holiday {
  id: string;
  /** Country code from COUNTRIES, or 'INTL' for worldwide days. */
  country: string;
  name: string;
  /** Calendar date, yyyy-mm-dd. */
  date: string;
  category: HolidayCategory;
  /** True for moon-sighting-dependent (Islamic) dates. */
  lunar: boolean;
  /** True where promotional content would be insensitive. */
  solemn: boolean;
  /** One short, practical content-planning suggestion. */
  suggestion: string;
}

export interface CountryInfo {
  code: string;
  name: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'PK', name: 'Pakistan' },
  { code: 'IN', name: 'India' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'TR', name: 'Turkey' },
  { code: 'EG', name: 'Egypt' },
];

/** Pseudo country code used for worldwide awareness / retail days. */
export const INTL_CODE = 'INTL';

export const MOON_SIGHTING_DISCLAIMER =
  'Islamic holiday dates in this calendar are expected dates based on ' +
  'astronomical calculations. The confirmed date depends on the sighting ' +
  'of the new moon and may shift by one day in either direction, so ' +
  'always check the official announcement in your country before ' +
  'scheduling campaigns around Ramadan, Eid and other Hijri observances.';

/* ------------------------------------------------------------------ */
/* Internal definition table                                           */
/*                                                                     */
/* Each definition carries one explicit date per year (2026, 2027,     */
/* 2028). `F` builds the triple for a fixed month-day holiday; `M`     */
/* takes the three explicit year-specific dates of a movable feast.    */
/* ------------------------------------------------------------------ */

type DateTriple = readonly [string, string, string];

const F = (mmdd: string): DateTriple => [
  `2026-${mmdd}`,
  `2027-${mmdd}`,
  `2028-${mmdd}`,
];

const M = (y2026: string, y2027: string, y2028: string): DateTriple => [
  y2026,
  y2027,
  y2028,
];

/* Shared movable-feast triples (expected dates for Islamic entries). */
const RAMADAN_START: DateTriple = M('2026-02-18', '2027-02-08', '2028-01-28');
const EID_AL_FITR: DateTriple = M('2026-03-20', '2027-03-10', '2028-02-28');
const EID_AL_ADHA: DateTriple = M('2026-05-27', '2027-05-17', '2028-05-06');
const ARAFAT_DAY: DateTriple = M('2026-05-26', '2027-05-16', '2028-05-05');
const ISLAMIC_NEW_YEAR: DateTriple = M('2026-06-16', '2027-06-05', '2028-05-25');
const ASHURA: DateTriple = M('2026-06-25', '2027-06-14', '2028-06-03');
const MAWLID: DateTriple = M('2026-08-25', '2027-08-15', '2028-08-04');
const GOOD_FRIDAY: DateTriple = M('2026-04-03', '2027-03-26', '2028-04-14');
const EASTER_MONDAY: DateTriple = M('2026-04-06', '2027-03-29', '2028-04-17');
const ASH_WEDNESDAY: DateTriple = M('2026-02-18', '2027-02-10', '2028-03-01');
const ASCENSION: DateTriple = M('2026-05-14', '2027-05-06', '2028-05-25');
const WHIT_MONDAY: DateTriple = M('2026-05-25', '2027-05-17', '2028-06-05');
const DIWALI: DateTriple = M('2026-10-20', '2027-11-08', '2028-10-27');
const HOLI: DateTriple = M('2026-03-03', '2027-03-22', '2028-03-11');
const CHINESE_NEW_YEAR: DateTriple = M('2026-02-17', '2027-02-06', '2028-01-26');
const NYEPI: DateTriple = M('2026-03-19', '2027-03-08', '2028-02-26');
const THAIPUSAM: DateTriple = M('2026-02-01', '2027-01-21', '2028-01-10');
const MOTHERS_DAY_SUN_MAY: DateTriple = M('2026-05-10', '2027-05-09', '2028-05-14');
const FATHERS_DAY_SUN_JUN: DateTriple = M('2026-06-21', '2027-06-20', '2028-06-18');
const MOTHERING_SUNDAY_GB: DateTriple = M('2026-03-15', '2027-03-07', '2028-03-26');
const BLACK_FRIDAY: DateTriple = M('2026-11-27', '2027-11-26', '2028-11-24');
const CYBER_MONDAY: DateTriple = M('2026-11-30', '2027-11-29', '2028-11-27');

interface HolidayDef {
  country: string;
  slug: string;
  name: string;
  category: HolidayCategory;
  lunar: boolean;
  solemn: boolean;
  suggestion: string;
  dates: DateTriple;
}

const d = (
  country: string,
  slug: string,
  name: string,
  category: HolidayCategory,
  dates: DateTriple,
  suggestion: string,
  lunar = false,
  solemn = false,
): HolidayDef => ({ country, slug, name, category, lunar, solemn, suggestion, dates });

const DEFS: HolidayDef[] = [
  /* ---------------- Pakistan (PK) ---------------- */
  d('PK', 'kashmir-day', 'Kashmir Day', 'public', F('02-05'),
    'Share solidarity content; keep the tone respectful and non-promotional.'),
  d('PK', 'pakistan-day', 'Pakistan Day', 'public', F('03-23'),
    'Plan a flag-colours post and a short history carousel.'),
  d('PK', 'labour-day', 'Labour Day', 'public', F('05-01'),
    'Spotlight your team and the workers behind your products.'),
  d('PK', 'independence-day', 'Independence Day', 'public', F('08-14'),
    'Schedule patriotic creative early; demand peaks the week before.'),
  d('PK', 'iqbal-day', 'Iqbal Day', 'public', F('11-09'),
    'Share a quote graphic from Allama Iqbal with a reflection prompt.'),
  d('PK', 'quaid-e-azam-day', 'Quaid-e-Azam Day', 'public', F('12-25'),
    'Post a Quaid quote; add a Christmas greeting for Christian followers.'),
  d('PK', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Shift posting to iftar and sehri hours; publish a Ramadan calendar.', true),
  d('PK', 'eid-al-fitr', 'Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Eid Mubarak greetings; pause hard selling on Eid day.', true),
  d('PK', 'eid-al-adha', 'Eid al-Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings and Qurbani-season community content.', true),
  d('PK', 'islamic-new-year', 'Islamic New Year — 1 Muharram (expected)', 'religious', ISLAMIC_NEW_YEAR,
    'Post a Hijri new year greeting; keep it simple and respectful.', true),
  d('PK', 'ashura', 'Ashura (expected)', 'religious', ASHURA,
    'Pause promotional posts; share only a respectful observance note.', true, true),
  d('PK', 'mawlid', 'Eid Milad-un-Nabi — Mawlid (expected)', 'religious', MAWLID,
    'Share a respectful greeting; avoid sales pushes today.', true),

  /* ---------------- India (IN) ---------------- */
  d('IN', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Publish a year-in-review reel and set fresh goals with followers.'),
  d('IN', 'republic-day', 'Republic Day', 'public', F('01-26'),
    'Use tricolour creative and a short Republic Day explainer.'),
  d('IN', 'holi', 'Holi', 'cultural', HOLI,
    'Plan colour-filled user content; post greetings before the rush.'),
  d('IN', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'Keep feeds quiet; a simple reflective post is enough.', false, true),
  d('IN', 'eid-al-fitr', 'Eid al-Fitr (Ramzan Eid, expected)', 'religious', EID_AL_FITR,
    'Wish Eid Mubarak; feature festive food and family content.', true),
  d('IN', 'eid-al-adha', 'Eid al-Adha (Bakrid, expected)', 'religious', EID_AL_ADHA,
    'Share Bakrid greetings and community stories.', true),
  d('IN', 'ashura', 'Muharram — Ashura (expected)', 'religious', ASHURA,
    'Avoid promotions; keep any post purely observational.', true, true),
  d('IN', 'independence-day', 'Independence Day', 'public', F('08-15'),
    'Run tricolour creative and freedom-sale teasers a week ahead.'),
  d('IN', 'mawlid', 'Milad-un-Nabi — Mawlid (expected)', 'religious', MAWLID,
    'Post a respectful greeting for followers observing the day.', true),
  d('IN', 'gandhi-jayanti', 'Gandhi Jayanti', 'public', F('10-02'),
    'Share a Gandhi quote graphic; note it is a dry day in many states.'),
  d('IN', 'diwali', 'Diwali (Deepavali)', 'religious', DIWALI,
    'Launch festive offers two weeks ahead; post diya creative on the day.'),
  d('IN', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Schedule festive greetings and a year-end thank-you post.'),

  /* ---------------- UAE (AE) ---------------- */
  d('AE', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post fireworks-season highlights and a new-year offer for residents.'),
  d('AE', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Move posting to evening hours; launch a Ramadan series at iftar.', true),
  d('AE', 'eid-al-fitr', 'Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Eid greetings; expect a long-weekend travel and gifting spike.', true),
  d('AE', 'arafat-day', 'Arafat Day (expected)', 'religious', ARAFAT_DAY,
    'Keep content minimal and reflective ahead of Eid al-Adha.', true),
  d('AE', 'eid-al-adha', 'Eid al-Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings and staycation or travel ideas for the break.', true),
  d('AE', 'islamic-new-year', 'Islamic New Year (expected)', 'religious', ISLAMIC_NEW_YEAR,
    'Post a Hijri new year greeting; keep promotions low-key.', true),
  d('AE', 'mawlid', "Prophet's Birthday — Mawlid (expected)", 'religious', MAWLID,
    'Share a respectful greeting; avoid sales-led content today.', true),
  d('AE', 'commemoration-day', 'Commemoration Day', 'public', F('11-30'),
    'Post a solemn tribute only; no promotions today.', false, true),
  d('AE', 'national-day', 'UAE National Day', 'public', F('12-02'),
    'Use flag-colour creative; plan for the Dec 2–3 holiday peak.'),

  /* ---------------- Saudi Arabia (SA) ---------------- */
  d('SA', 'new-year', "New Year's Day (business observance)", 'business', F('01-01'),
    'Useful marker for international partners; keep local content normal.'),
  d('SA', 'founding-day', 'Saudi Founding Day', 'public', F('02-22'),
    'Share heritage-themed creative marking the First Saudi State.'),
  d('SA', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Shift campaigns to post-iftar hours; prepare a Ramadan content series.', true),
  d('SA', 'eid-al-fitr', 'Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Eid greetings; gifting and fashion demand peaks this week.', true),
  d('SA', 'arafat-day', 'Arafat Day (expected)', 'religious', ARAFAT_DAY,
    'Pause marketing; Hajj coverage dominates attention today.', true),
  d('SA', 'eid-al-adha', 'Eid al-Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings; expect reduced business activity all week.', true),
  d('SA', 'national-day', 'Saudi National Day', 'public', F('09-23'),
    'Go green with patriotic creative; retail offers run all week.'),
  d('SA', 'white-friday', 'White Friday', 'retail', BLACK_FRIDAY,
    'The regional Black Friday: launch offers early, in Arabic first.'),

  /* ---------------- United Kingdom (GB) ---------------- */
  d('GB', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post a fresh-start message; most audiences return online Jan 2.'),
  d('GB', 'ash-wednesday', 'Ash Wednesday', 'religious', ASH_WEDNESDAY,
    'A quiet Lent opener; avoid indulgence-led food promotions.', false, true),
  d('GB', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'Keep the feed subdued; one reflective post is enough.', false, true),
  d('GB', 'easter-monday', 'Easter Monday', 'public', EASTER_MONDAY,
    'Bank-holiday leisure content performs well; post mid-morning.'),
  d('GB', 'early-may-bank-holiday', 'Early May Bank Holiday', 'public',
    M('2026-05-04', '2027-05-03', '2028-05-01'),
    'Plan long-weekend and DIY or garden content for the break.'),
  d('GB', 'spring-bank-holiday', 'Spring Bank Holiday', 'public',
    M('2026-05-25', '2027-05-31', '2028-05-29'),
    'Half-term week: family and travel content lands well.'),
  d('GB', 'summer-bank-holiday', 'Summer Bank Holiday', 'public',
    M('2026-08-31', '2027-08-30', '2028-08-28'),
    'Last summer long weekend: end-of-season offers and festival recaps.'),
  d('GB', 'mothers-day', "Mother's Day (Mothering Sunday)", 'cultural', MOTHERING_SUNDAY_GB,
    'Gift guides must land two weeks before; note the UK date differs from the US.'),
  d('GB', 'bonfire-night', 'Bonfire Night (Guy Fawkes Night)', 'cultural', F('11-05'),
    'Share fireworks-event roundups and pet-safety reminders.'),
  d('GB', 'remembrance-day', 'Remembrance Day', 'cultural', F('11-11'),
    'Observe the two-minute silence at 11am; post a poppy tribute only.', false, true),
  d('GB', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Pre-schedule greetings; teams are offline and feeds are quiet.'),
  d('GB', 'boxing-day', 'Boxing Day', 'public', F('12-26'),
    'Boxing Day sales start early online; schedule offers for 7am.'),

  /* ---------------- United States (US) ---------------- */
  d('US', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post resolutions-themed content; engagement rebounds on Jan 2.'),
  d('US', 'mlk-day', 'Martin Luther King Jr. Day', 'public',
    M('2026-01-19', '2027-01-18', '2028-01-17'),
    'Share a service or community post; avoid sales tie-ins.'),
  d('US', 'ash-wednesday', 'Ash Wednesday', 'religious', ASH_WEDNESDAY,
    'Lent begins; seafood and meat-free offers become relevant.', false, true),
  d('US', 'presidents-day', "Presidents' Day", 'public',
    M('2026-02-16', '2027-02-15', '2028-02-21'),
    'A major retail weekend for mattresses, autos and appliances.'),
  d('US', 'mothers-day', "Mother's Day", 'cultural', MOTHERS_DAY_SUN_MAY,
    'One of the biggest gifting days of the year; start teasers in April.'),
  d('US', 'memorial-day', 'Memorial Day', 'public',
    M('2026-05-25', '2027-05-31', '2028-05-29'),
    'Open with a remembrance post before any summer-sale content.', false, true),
  d('US', 'juneteenth', 'Juneteenth', 'public', F('06-19'),
    'Amplify Black creators and history; keep brand voice in support.'),
  d('US', 'fathers-day', "Father's Day", 'cultural', FATHERS_DAY_SUN_JUN,
    'Gift-guide content peaks the weekend before; post reminders early.'),
  d('US', 'independence-day', 'Independence Day', 'public', F('07-04'),
    'Schedule patriotic creative and cookout content for the week prior.'),
  d('US', 'labor-day', 'Labor Day', 'public',
    M('2026-09-07', '2027-09-06', '2028-09-04'),
    'End-of-summer sales weekend; back-to-school content wraps up.'),
  d('US', 'thanksgiving', 'Thanksgiving', 'public',
    M('2026-11-26', '2027-11-25', '2028-11-23'),
    'Post gratitude content early in the day; feeds shift to shopping at night.'),
  d('US', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Pre-schedule a warm greeting; hold launches until Dec 27.'),

  /* ---------------- Canada (CA) ---------------- */
  d('CA', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post a fresh-start message timed for a slow, family-focused day.'),
  d('CA', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'Keep content reflective; most businesses are closed.', false, true),
  d('CA', 'victoria-day', 'Victoria Day', 'public',
    M('2026-05-18', '2027-05-24', '2028-05-22'),
    'The unofficial start of summer: cottage and patio content lands well.'),
  d('CA', 'mothers-day', "Mother's Day", 'cultural', MOTHERS_DAY_SUN_MAY,
    'Gifting content should peak the week before; flowers and dining lead.'),
  d('CA', 'canada-day', 'Canada Day', 'public', F('07-01'),
    'Use red-and-white creative; schedule before the long weekend.'),
  d('CA', 'civic-holiday', 'Civic Holiday', 'public',
    M('2026-08-03', '2027-08-02', '2028-08-07'),
    'Mid-summer long weekend in most provinces: leisure content works.'),
  d('CA', 'labour-day', 'Labour Day', 'public',
    M('2026-09-07', '2027-09-06', '2028-09-04'),
    'Back-to-school finale; post end-of-summer offers on Sunday.'),
  d('CA', 'truth-and-reconciliation-day', 'National Day for Truth and Reconciliation', 'public', F('09-30'),
    'Wear orange, amplify Indigenous voices; no promotional content.', false, true),
  d('CA', 'thanksgiving', 'Thanksgiving (Canada)', 'public',
    M('2026-10-12', '2027-10-11', '2028-10-09'),
    'Post harvest and gratitude content; note it precedes US Thanksgiving.'),
  d('CA', 'remembrance-day', 'Remembrance Day', 'public', F('11-11'),
    'Post a poppy tribute and observe silence at 11am; no promotions.', false, true),
  d('CA', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Pre-schedule greetings in English and French where relevant.'),
  d('CA', 'boxing-day', 'Boxing Day', 'public', F('12-26'),
    'A top Canadian shopping day; schedule deals for early morning.'),

  /* ---------------- Australia (AU) ---------------- */
  d('AU', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Summer-holiday mode: light, beach-season content performs best.'),
  d('AU', 'australia-day', 'Australia Day', 'public', F('01-26'),
    'Keep content inclusive and low-key; many brands post a simple acknowledgement.'),
  d('AU', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'Most shops close; keep the feed quiet and reflective.', false, true),
  d('AU', 'easter-monday', 'Easter Monday', 'public', EASTER_MONDAY,
    'End of the Easter long weekend: travel-home and sale content works.'),
  d('AU', 'anzac-day', 'ANZAC Day', 'public', F('04-25'),
    'Post a dawn-service tribute only; trading restrictions apply in the morning.', false, true),
  d('AU', 'mothers-day', "Mother's Day", 'cultural', MOTHERS_DAY_SUN_MAY,
    'Breakfast and flowers lead gifting; start reminders two weeks out.'),
  d('AU', 'kings-birthday', "King's Birthday", 'public',
    M('2026-06-08', '2027-06-14', '2028-06-12'),
    'Long weekend in most states; note WA and QLD observe different dates.'),
  d('AU', 'fathers-day', "Father's Day (Australia)", 'cultural',
    M('2026-09-06', '2027-09-05', '2028-09-03'),
    'Australia marks it in September, not June; adjust global calendars.'),
  d('AU', 'melbourne-cup', 'Melbourne Cup Day', 'cultural',
    M('2026-11-03', '2027-11-02', '2028-11-07'),
    'The race that stops a nation: light fashion and sweep content works.'),
  d('AU', 'remembrance-day', 'Remembrance Day', 'cultural', F('11-11'),
    'Observe one minute of silence at 11am; post a simple tribute.', false, true),
  d('AU', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Summer Christmas: outdoor and beach-themed greetings fit best.'),
  d('AU', 'boxing-day', 'Boxing Day', 'public', F('12-26'),
    'Boxing Day sales and Test cricket dominate; schedule offers early.'),

  /* ---------------- Bangladesh (BD) ---------------- */
  d('BD', 'mother-language-day', 'International Mother Language Day (Shaheed Day)', 'public', F('02-21'),
    'Post a solemn tribute to the language martyrs; no promotions.', false, true),
  d('BD', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Shift posting to iftar hours; plan a Ramadan wishes series.', true),
  d('BD', 'independence-day', 'Independence Day', 'public', F('03-26'),
    'Use red-and-green creative with a short independence explainer.'),
  d('BD', 'eid-al-fitr', 'Eid-ul-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Eid greetings; fashion and food content peaks before Chand Raat.', true),
  d('BD', 'pohela-boishakh', 'Pohela Boishakh — Bengali New Year', 'cultural', F('04-14'),
    'Colourful Boishakh greetings and traditional food content work well.'),
  d('BD', 'may-day', 'May Day', 'public', F('05-01'),
    'Acknowledge garment and other workers who power the economy.'),
  d('BD', 'eid-al-adha', 'Eid-ul-Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings; expect a nationwide travel rush beforehand.', true),
  d('BD', 'ashura', 'Ashura (expected)', 'religious', ASHURA,
    'Keep the feed respectful and free of promotions today.', true, true),
  d('BD', 'mawlid', 'Eid-e-Miladunnabi — Mawlid (expected)', 'religious', MAWLID,
    'Post a respectful greeting for followers observing the day.', true),
  d('BD', 'victory-day', 'Victory Day', 'public', F('12-16'),
    'Share patriotic content marking the 1971 victory.'),
  d('BD', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Post greetings for Christian followers and expat audiences.'),

  /* ---------------- Indonesia (ID) ---------------- */
  d('ID', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post a fresh-start message; holiday traffic peaks on travel content.'),
  d('ID', 'chinese-new-year', 'Chinese New Year (Imlek)', 'cultural', CHINESE_NEW_YEAR,
    'Use red-and-gold greetings (Gong Xi Fa Cai) and family content.'),
  d('ID', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Move campaigns to ngabuburit and post-iftar hours.', true),
  d('ID', 'nyepi', 'Nyepi — Balinese Day of Silence', 'religious', NYEPI,
    'Bali goes silent for 24 hours; schedule nothing Bali-targeted today.', false, true),
  d('ID', 'eid-al-fitr', 'Eid al-Fitr — Idul Fitri (expected)', 'religious', EID_AL_FITR,
    'Send Lebaran greetings; mudik travel content dominates the week.', true),
  d('ID', 'good-friday', 'Good Friday (Wafat Isa Almasih)', 'religious', GOOD_FRIDAY,
    'Keep content subdued out of respect for Christian followers.', false, true),
  d('ID', 'labour-day', 'Labour Day', 'public', F('05-01'),
    'Acknowledge workers; expect marches in major cities.'),
  d('ID', 'eid-al-adha', 'Eid al-Adha — Idul Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings and qurban charity content.', true),
  d('ID', 'pancasila-day', 'Pancasila Day', 'public', F('06-01'),
    'Post unity-themed content marking the state philosophy.'),
  d('ID', 'islamic-new-year', 'Islamic New Year — 1 Muharram (expected)', 'religious', ISLAMIC_NEW_YEAR,
    'Post a Hijri new year greeting; keep the tone reflective.', true),
  d('ID', 'independence-day', 'Independence Day', 'public', F('08-17'),
    'Red-and-white creative and lomba (games) content engage well.'),
  d('ID', 'mawlid', 'Mawlid al-Nabi (expected)', 'religious', MAWLID,
    'Share a respectful greeting; avoid sales-led posts today.', true),
  d('ID', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Post festive greetings; year-end travel content peaks this week.'),

  /* ---------------- Malaysia (MY) ---------------- */
  d('MY', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post fresh-start content; many Malaysians travel this week.'),
  d('MY', 'thaipusam', 'Thaipusam', 'religious', THAIPUSAM,
    'Share respectful greetings; Batu Caves coverage draws attention.'),
  d('MY', 'chinese-new-year', 'Chinese New Year', 'cultural', CHINESE_NEW_YEAR,
    'Run reunion-dinner and ang pow season content two weeks ahead.'),
  d('MY', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Bazaar Ramadan and iftar content series perform strongly.', true),
  d('MY', 'eid-al-fitr', 'Hari Raya Aidilfitri (expected)', 'religious', EID_AL_FITR,
    'Send Selamat Hari Raya greetings; balik kampung travel peaks.', true),
  d('MY', 'labour-day', 'Labour Day', 'public', F('05-01'),
    'Acknowledge your team; a short appreciation post is enough.'),
  d('MY', 'eid-al-adha', 'Hari Raya Aidiladha (expected)', 'religious', EID_AL_ADHA,
    'Share Aidiladha greetings and korban community content.', true),
  d('MY', 'islamic-new-year', 'Awal Muharram — Islamic New Year (expected)', 'religious', ISLAMIC_NEW_YEAR,
    'Post a Maal Hijrah greeting with a reflective message.', true),
  d('MY', 'mawlid', 'Mawlid al-Nabi (expected)', 'religious', MAWLID,
    'Share a respectful greeting; keep promotions minimal.', true),
  d('MY', 'national-day', 'National Day (Hari Merdeka)', 'public', F('08-31'),
    'Jalur Gemilang creative and Merdeka offers run through the week.'),
  d('MY', 'malaysia-day', 'Malaysia Day', 'public', F('09-16'),
    'Celebrate East and West Malaysia with unity-themed content.'),
  d('MY', 'deepavali', 'Deepavali', 'religious', DIWALI,
    'Post festival-of-lights greetings and festive food content.'),
  d('MY', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Schedule festive greetings; malls run major year-end sales.'),

  /* ---------------- Nigeria (NG) ---------------- */
  d('NG', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Post a fresh-start message; crossover-service content trends overnight.'),
  d('NG', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'Keep content reflective; church audiences are offline much of the day.', false, true),
  d('NG', 'easter-monday', 'Easter Monday', 'public', EASTER_MONDAY,
    'Picnic and family content works on this public holiday.'),
  d('NG', 'workers-day', "Workers' Day", 'public', F('05-01'),
    'Celebrate your staff publicly; appreciation posts engage well.'),
  d('NG', 'childrens-day', "Children's Day", 'cultural', F('05-27'),
    'Family and education brands should plan school-focused content.'),
  d('NG', 'eid-al-fitr', 'Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Sallah greetings; fashion content peaks in the north.', true),
  d('NG', 'democracy-day', 'Democracy Day', 'public', F('06-12'),
    'Share civic-themed content marking the return to democracy.'),
  d('NG', 'eid-al-adha', 'Eid al-Adha — Eid el-Kabir (expected)', 'religious', EID_AL_ADHA,
    'Send Sallah greetings; ram and travel content trends this week.', true),
  d('NG', 'mawlid', 'Eid el-Maulud — Mawlid (expected)', 'religious', MAWLID,
    'Post a respectful greeting for Muslim followers.', true),
  d('NG', 'independence-day', 'Independence Day', 'public', F('10-01'),
    'Green-and-white creative and Naija-pride content engage strongly.'),
  d('NG', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Detty December begins: events and travel content peak now.'),
  d('NG', 'boxing-day', 'Boxing Day', 'public', F('12-26'),
    'Keep the festive run going with family and owambe content.'),

  /* ---------------- South Africa (ZA) ---------------- */
  d('ZA', 'new-year', "New Year's Day", 'public', F('01-01'),
    'Summer-holiday season: keep content light and outdoor-focused.'),
  d('ZA', 'human-rights-day', 'Human Rights Day', 'public', F('03-21'),
    'Share rights-focused storytelling; keep brand promotion secondary.'),
  d('ZA', 'good-friday', 'Good Friday', 'religious', GOOD_FRIDAY,
    'A quiet start to the Easter long weekend; keep posts subdued.', false, true),
  d('ZA', 'family-day', 'Family Day (Easter Monday)', 'public', EASTER_MONDAY,
    'Family and braai content fits the long-weekend mood.'),
  d('ZA', 'freedom-day', 'Freedom Day', 'public', F('04-27'),
    'Mark the 1994 first democratic election with reflective content.'),
  d('ZA', 'workers-day', "Workers' Day", 'public', F('05-01'),
    'Publicly appreciate your team; short video thank-yous work well.'),
  d('ZA', 'youth-day', 'Youth Day', 'public', F('06-16'),
    'Commemorates the 1976 Soweto uprising; amplify youth voices, no sales.', false, true),
  d('ZA', 'womens-day', "National Women's Day", 'public', F('08-09'),
    'Celebrate women customers and staff with genuine spotlights.'),
  d('ZA', 'heritage-day', 'Heritage Day', 'cultural', F('09-24'),
    'Braai Day energy: food and cultural-heritage content performs well.'),
  d('ZA', 'reconciliation-day', 'Day of Reconciliation', 'public', F('12-16'),
    'Unity-themed content as the festive season begins.'),
  d('ZA', 'christmas', 'Christmas Day', 'public', F('12-25'),
    'Summer Christmas greetings; pre-schedule before teams break.'),
  d('ZA', 'day-of-goodwill', 'Day of Goodwill', 'public', F('12-26'),
    'Leftover-and-beach day: light festive content only.'),

  /* ---------------- Germany (DE) ---------------- */
  d('DE', 'new-year', 'New Year — Neujahr', 'public', F('01-01'),
    'Post Neujahr greetings; audiences return gradually after Jan 6 in the south.'),
  d('DE', 'ash-wednesday', 'Ash Wednesday — Aschermittwoch', 'religious', ASH_WEDNESDAY,
    'Karneval ends and Lent begins; switch to a quieter content tone.', false, true),
  d('DE', 'good-friday', 'Good Friday — Karfreitag', 'religious', GOOD_FRIDAY,
    'A silent holiday (stiller Feiertag); avoid entertainment promotions.', false, true),
  d('DE', 'easter-monday', 'Easter Monday — Ostermontag', 'public', EASTER_MONDAY,
    'Family and spring-outdoor content fits the long weekend.'),
  d('DE', 'labour-day', 'Labour Day — Tag der Arbeit', 'public', F('05-01'),
    'Expect demonstrations in cities; keep brand content neutral.'),
  d('DE', 'ascension', 'Ascension Day — Christi Himmelfahrt', 'religious', ASCENSION,
    'Also Vatertag in Germany: outdoor and group-activity content works.'),
  d('DE', 'whit-monday', 'Whit Monday — Pfingstmontag', 'public', WHIT_MONDAY,
    'A popular short-break weekend; travel content performs well.'),
  d('DE', 'mothers-day', "Mother's Day — Muttertag", 'cultural', MOTHERS_DAY_SUN_MAY,
    'Flowers and brunch gifting lead; reminders should start a week out.'),
  d('DE', 'german-unity-day', 'German Unity Day — Tag der Deutschen Einheit', 'public', F('10-03'),
    'Post a simple unity greeting; retail runs autumn promotions.'),
  d('DE', 'christmas', 'Christmas Day — Weihnachten', 'public', F('12-25'),
    'Advent content matters more than the day itself; start Nov 30.'),
  d('DE', 'boxing-day', 'Second Christmas Day — Zweiter Weihnachtstag', 'public', F('12-26'),
    'A family day at home; keep scheduled content minimal.'),

  /* ---------------- France (FR) ---------------- */
  d('FR', 'new-year', "New Year's Day — Jour de l'An", 'public', F('01-01'),
    'Post bonne année greetings; galette des rois content follows in January.'),
  d('FR', 'easter-monday', 'Easter Monday — Lundi de Pâques', 'public', EASTER_MONDAY,
    'Long-weekend leisure content; chocolate brands peak this week.'),
  d('FR', 'labour-day', 'Labour Day — Fête du Travail', 'public', F('05-01'),
    'Lily-of-the-valley (muguet) imagery is the traditional touch.'),
  d('FR', 'victory-day', 'Victory Day — Victoire 1945', 'public', F('05-08'),
    'A commemorative tone in the morning; leisure content later.'),
  d('FR', 'ascension', 'Ascension Day — Ascension', 'religious', ASCENSION,
    'The Ascension bridge weekend (pont) is peak domestic-travel time.'),
  d('FR', 'whit-monday', 'Whit Monday — Lundi de Pentecôte', 'public', WHIT_MONDAY,
    'Another long weekend; expect audiences to be travelling.'),
  d('FR', 'bastille-day', 'Bastille Day — Fête Nationale', 'public', F('07-14'),
    'Tricolore creative and fireworks content; post before evening events.'),
  d('FR', 'assumption', 'Assumption Day — Assomption', 'religious', F('08-15'),
    'Mid-August exodus: many businesses close; keep content light.'),
  d('FR', 'all-saints', "All Saints' Day — Toussaint", 'religious', F('11-01'),
    'Families visit graves today; keep content respectful and quiet.', false, true),
  d('FR', 'armistice-day', 'Armistice Day — Armistice 1918', 'public', F('11-11'),
    'Post a remembrance note; avoid promotions during ceremonies.', false, true),
  d('FR', 'christmas', 'Christmas Day — Noël', 'public', F('12-25'),
    'Réveillon content lands on Dec 24; greetings on the day itself.'),

  /* ---------------- Turkey (TR) ---------------- */
  d('TR', 'new-year', "New Year's Day — Yılbaşı", 'public', F('01-01'),
    'Post new-year greetings; Milli Piyango lottery content trends.'),
  d('TR', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Shift posting to post-iftar hours; prepare a Ramazan content series.', true),
  d('TR', 'eid-al-fitr', 'Ramazan Bayramı — Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Bayram greetings; family-visit and sweets content peaks.', true),
  d('TR', 'sovereignty-childrens-day', "National Sovereignty and Children's Day", 'public', F('04-23'),
    'Child-focused events and colourful creative are the tradition.'),
  d('TR', 'labour-day', 'Labour and Solidarity Day', 'public', F('05-01'),
    'Acknowledge workers; expect rallies in major squares.'),
  d('TR', 'eid-al-adha', 'Kurban Bayramı — Eid al-Adha (expected)', 'religious', EID_AL_ADHA,
    'Send Bayram greetings; intercity travel surges before the holiday.', true),
  d('TR', 'youth-sports-day', 'Commemoration of Atatürk, Youth and Sports Day', 'public', F('05-19'),
    'Youth and sports content with Atatürk imagery is customary.'),
  d('TR', 'democracy-day', 'Democracy and National Unity Day', 'public', F('07-15'),
    'A solemn commemoration; post a tribute only, no promotions.', false, true),
  d('TR', 'victory-day', 'Victory Day — Zafer Bayramı', 'public', F('08-30'),
    'Patriotic creative and military-parade coverage dominate.'),
  d('TR', 'republic-day', 'Republic Day — Cumhuriyet Bayramı', 'public', F('10-29'),
    'Flag imagery everywhere; schedule celebratory content early.'),
  d('TR', 'ataturk-memorial-day', 'Atatürk Memorial Day', 'cultural', F('11-10'),
    'The nation pauses at 09:05; post a black-and-white tribute only.', false, true),

  /* ---------------- Egypt (EG) ---------------- */
  d('EG', 'coptic-christmas', 'Coptic Christmas', 'religious', F('01-07'),
    'Greet Coptic followers on Jan 7; do not reuse Dec 25 creative.'),
  d('EG', 'revolution-day-jan25', 'January 25 Revolution Day', 'public', F('01-25'),
    'Keep content neutral and commemorative; avoid political angles.'),
  d('EG', 'ramadan-start', 'Ramadan Begins (expected)', 'religious', RAMADAN_START,
    'Ramadan lanterns and iftar series dominate Egyptian feeds.', true),
  d('EG', 'eid-al-fitr', 'Eid al-Fitr (expected)', 'religious', EID_AL_FITR,
    'Send Eid greetings; kahk cookie content is a beloved staple.', true),
  d('EG', 'sinai-liberation-day', 'Sinai Liberation Day', 'public', F('04-25'),
    'Post a patriotic greeting marking the Sinai withdrawal.'),
  d('EG', 'labour-day', 'Labour Day', 'public', F('05-01'),
    'Appreciate your team with a short public thank-you.'),
  d('EG', 'eid-al-adha', 'Eid al-Adha (expected)', 'religious', EID_AL_ADHA,
    'Share Eid greetings; meat and charity content trends this week.', true),
  d('EG', 'revolution-day-jun30', 'June 30 Revolution Day', 'public', F('06-30'),
    'A public holiday; keep brand content light and neutral.'),
  d('EG', 'revolution-day-jul23', 'July 23 Revolution Day', 'public', F('07-23'),
    'Post a simple national greeting; summer travel content continues.'),
  d('EG', 'islamic-new-year', 'Islamic New Year (expected)', 'religious', ISLAMIC_NEW_YEAR,
    'Post a Hijri new year greeting; keep the tone reflective.', true),
  d('EG', 'mawlid', 'Mawlid al-Nabi (expected)', 'religious', MAWLID,
    'Halawet el-Moulid sweets content is traditional; greet respectfully.', true),
  d('EG', 'armed-forces-day', 'Armed Forces Day', 'public', F('10-06'),
    'Commemorates the 1973 crossing; patriotic content is customary.'),

  /* ---------------- Worldwide (INTL) ---------------- */
  d('INTL', 'world-cancer-day', 'World Cancer Day', 'awareness', F('02-04'),
    'Share screening and support resources; survivor stories need consent.'),
  d('INTL', 'valentines-day', "Valentine's Day", 'cultural', F('02-14'),
    'Romance gifting peaks Feb 10–13; last-minute reminders convert.'),
  d('INTL', 'mother-language-day', 'International Mother Language Day', 'awareness', F('02-21'),
    'Post in your audience languages today; celebrate linguistic diversity.'),
  d('INTL', 'womens-day', "International Women's Day", 'awareness', F('03-08'),
    'Spotlight real women on your team and in your community, not slogans.'),
  d('INTL', 'day-of-happiness', 'International Day of Happiness', 'awareness', F('03-20'),
    'Light, positive user-generated content fits the day.'),
  d('INTL', 'world-water-day', 'World Water Day', 'awareness', F('03-22'),
    'Share your water-saving practices with concrete numbers.'),
  d('INTL', 'world-health-day', 'World Health Day', 'awareness', F('04-07'),
    'Partner with credible health sources; never give medical advice.'),
  d('INTL', 'earth-day', 'Earth Day', 'awareness', F('04-22'),
    'Show one real sustainability action; avoid vague green claims.'),
  d('INTL', 'world-book-day', 'World Book and Copyright Day', 'awareness', F('04-23'),
    'Staff reading picks and author spotlights engage book audiences.'),
  d('INTL', 'press-freedom-day', 'World Press Freedom Day', 'awareness', F('05-03'),
    'Acknowledge journalists; media brands can share newsroom stories.'),
  d('INTL', 'world-environment-day', 'World Environment Day', 'awareness', F('06-05'),
    'Publish measurable environmental commitments, not just graphics.'),
  d('INTL', 'world-oceans-day', 'World Oceans Day', 'awareness', F('06-08'),
    'Coastal clean-up content and plastic-reduction updates work well.'),
  d('INTL', 'friendship-day', 'International Day of Friendship', 'awareness', F('07-30'),
    'Tag-a-friend mechanics are natural today; keep prizes modest.'),
  d('INTL', 'youth-day', 'International Youth Day', 'awareness', F('08-12'),
    'Hand the channel to young creators for the day.'),
  d('INTL', 'literacy-day', 'International Literacy Day', 'awareness', F('09-08'),
    'Support a literacy charity and share reading resources.'),
  d('INTL', 'day-of-peace', 'International Day of Peace', 'awareness', F('09-21'),
    'Keep the feed calm and unifying; pause combative campaigns.'),
  d('INTL', 'world-tourism-day', 'World Tourism Day', 'awareness', F('09-27'),
    'Travel brands: spotlight sustainable and local tourism.'),
  d('INTL', 'international-coffee-day', 'International Coffee Day', 'awareness', F('10-01'),
    'Cafés run tastings and offers; others can share team coffee rituals.'),
  d('INTL', 'world-teachers-day', "World Teachers' Day", 'awareness', F('10-05'),
    'Thank-a-teacher posts and education offers land well.'),
  d('INTL', 'world-mental-health-day', 'World Mental Health Day', 'awareness', F('10-10'),
    'Share support resources and signpost helplines; be genuinely helpful.'),
  d('INTL', 'world-food-day', 'World Food Day', 'awareness', F('10-16'),
    'Food brands can highlight waste reduction and food-bank support.'),
  d('INTL', 'halloween', 'Halloween', 'cultural', F('10-31'),
    'Costume and décor content peaks in the final week of October.'),
  d('INTL', 'singles-day', "Singles' Day", 'retail', F('11-11'),
    'The 11.11 sale is huge in Asia; start teasers in late October.'),
  d('INTL', 'world-kindness-day', 'World Kindness Day', 'awareness', F('11-13'),
    'Random-acts-of-kindness content and community shout-outs fit well.'),
  d('INTL', 'black-friday', 'Black Friday', 'retail', BLACK_FRIDAY,
    'The global peak shopping day; schedule deal posts from midnight.'),
  d('INTL', 'cyber-monday', 'Cyber Monday', 'retail', CYBER_MONDAY,
    'Online-only offers; email and social pushes peak in the morning.'),
  d('INTL', 'world-aids-day', 'World AIDS Day', 'awareness', F('12-01'),
    'Share verified prevention and testing resources with a red ribbon.'),
  d('INTL', 'day-of-persons-with-disabilities', 'International Day of Persons with Disabilities', 'awareness', F('12-03'),
    'Audit your content accessibility: captions, alt text, contrast.'),
  d('INTL', 'volunteer-day', 'International Volunteer Day', 'awareness', F('12-05'),
    'Thank your volunteers publicly and recruit for the new year.'),
  d('INTL', 'human-rights-day', 'Human Rights Day', 'awareness', F('12-10'),
    'Share the Universal Declaration story; keep brand promotion minimal.'),
];

const YEARS: readonly number[] = [2026, 2027, 2028];

/** All holidays, sorted by date, then country, then name. */
export const HOLIDAYS: Holiday[] = DEFS.flatMap((def) =>
  def.dates.map((date, index) => ({
    id: `${def.country.toLowerCase()}-${def.slug}-${YEARS[index]}`,
    country: def.country,
    name: def.name,
    date,
    category: def.category,
    lunar: def.lunar,
    solemn: def.solemn,
    suggestion: def.suggestion,
  })),
).sort((a, b) =>
  a.date === b.date
    ? a.country === b.country
      ? a.name.localeCompare(b.name)
      : a.country.localeCompare(b.country)
    : a.date.localeCompare(b.date),
);

const HOLIDAY_BY_ID: ReadonlyMap<string, Holiday> = new Map(
  HOLIDAYS.map((holiday) => [holiday.id, holiday]),
);

/** Holidays for one country code ('INTL' included), optionally one year. */
export function holidaysForCountry(code: string, year?: number): Holiday[] {
  const normalized = code.toUpperCase();
  return HOLIDAYS.filter(
    (holiday) =>
      holiday.country === normalized &&
      (year === undefined || holiday.date.startsWith(`${year}-`)),
  );
}

/**
 * Holidays between two yyyy-mm-dd dates, inclusive on both ends,
 * sorted ascending by date. Optionally restricted to country codes.
 */
export function holidaysInRange(
  fromIso: string,
  toIso: string,
  countryCodes?: string[],
): Holiday[] {
  const allowed =
    countryCodes === undefined
      ? undefined
      : new Set(countryCodes.map((code) => code.toUpperCase()));
  return HOLIDAYS.filter(
    (holiday) =>
      holiday.date >= fromIso &&
      holiday.date <= toIso &&
      (allowed === undefined || allowed.has(holiday.country)),
  ).sort((a, b) =>
    a.date === b.date
      ? a.country === b.country
        ? a.name.localeCompare(b.name)
        : a.country.localeCompare(b.country)
      : a.date.localeCompare(b.date),
  );
}

/** Look up a single holiday by its id, or undefined when unknown. */
export function getHoliday(id: string): Holiday | undefined {
  return HOLIDAY_BY_ID.get(id);
}
