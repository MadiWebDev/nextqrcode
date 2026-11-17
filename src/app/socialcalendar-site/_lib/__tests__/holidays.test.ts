import { describe, expect, it } from 'vitest';
import {
  COUNTRIES,
  HOLIDAYS,
  MOON_SIGHTING_DISCLAIMER,
  getHoliday,
  holidaysForCountry,
  holidaysInRange,
} from '../../_data/holidays';

const YEARS = [2026, 2027, 2028];
const EXPECTED_CODES = [
  'PK', 'IN', 'AE', 'SA', 'GB', 'US', 'CA', 'AU', 'BD',
  'ID', 'MY', 'NG', 'ZA', 'DE', 'FR', 'TR', 'EG',
];

const ISLAMIC_NAME =
  /eid al-fitr|eid al-adha|eid-ul-fitr|eid-ul-adha|eid el-kabir|aidilfitri|aidiladha|idul fitri|idul adha|ramazan bayram|kurban bayram|ramadan begins|ashura|mawlid|milad|islamic new year|awal muharram|1 muharram|arafat/i;

describe('COUNTRIES', () => {
  it('contains exactly the 17 required countries', () => {
    expect(COUNTRIES).toHaveLength(17);
    expect(COUNTRIES.map((c) => c.code).sort()).toEqual([...EXPECTED_CODES].sort());
    for (const country of COUNTRIES) {
      expect(country.name.length).toBeGreaterThan(0);
    }
  });
});

describe('HOLIDAYS data integrity', () => {
  it('has unique ids', () => {
    const ids = HOLIDAYS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every date parses and falls in 2026–2028', () => {
    for (const holiday of HOLIDAYS) {
      expect(holiday.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const parsed = new Date(`${holiday.date}T00:00:00Z`);
      expect(Number.isNaN(parsed.getTime())).toBe(false);
      // Round-trip guards against impossible dates such as 2026-02-30.
      expect(parsed.toISOString().slice(0, 10)).toBe(holiday.date);
      const year = Number(holiday.date.slice(0, 4));
      expect(YEARS).toContain(year);
      expect(holiday.name.length).toBeGreaterThan(0);
      expect(holiday.suggestion.length).toBeGreaterThan(0);
      expect(holiday.id).toContain(holiday.date.slice(0, 4));
    }
  });

  it('every country has at least 6 entries per year', () => {
    for (const code of EXPECTED_CODES) {
      for (const year of YEARS) {
        const entries = holidaysForCountry(code, year);
        expect(entries.length, `${code} ${year}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it('covers every country in every year', () => {
    for (const code of EXPECTED_CODES) {
      for (const year of YEARS) {
        const entries = HOLIDAYS.filter(
          (h) => h.country === code && h.date.startsWith(`${year}-`),
        );
        expect(entries.length, `${code} ${year}`).toBeGreaterThan(0);
      }
    }
  });

  it('marks Islamic holidays as lunar', () => {
    const islamic = HOLIDAYS.filter((h) => ISLAMIC_NAME.test(h.name));
    expect(islamic.length).toBeGreaterThan(30);
    for (const holiday of islamic) {
      expect(holiday.lunar, holiday.id).toBe(true);
    }
  });

  it('only lunar entries are Islamic (moon-sighting) observances', () => {
    for (const holiday of HOLIDAYS.filter((h) => h.lunar)) {
      expect(ISLAMIC_NAME.test(holiday.name), holiday.id).toBe(true);
    }
  });

  it('INTL has at least 20 worldwide awareness entries in total and per year', () => {
    const intl = holidaysForCountry('INTL');
    expect(intl.length).toBeGreaterThanOrEqual(20);
    for (const year of YEARS) {
      const entries = holidaysForCountry('INTL', year);
      expect(entries.length, `INTL ${year}`).toBeGreaterThanOrEqual(20);
      expect(
        entries.filter((h) => h.category === 'awareness').length,
        `INTL awareness ${year}`,
      ).toBeGreaterThanOrEqual(20);
    }
  });

  it('uses known anchor dates', () => {
    const byId = (id: string) => getHoliday(id)?.date;
    expect(byId('us-thanksgiving-2026')).toBe('2026-11-26');
    expect(byId('us-thanksgiving-2027')).toBe('2027-11-25');
    expect(byId('us-thanksgiving-2028')).toBe('2028-11-23');
    expect(byId('gb-good-friday-2026')).toBe('2026-04-03');
    expect(byId('gb-easter-monday-2027')).toBe('2027-03-29');
    expect(byId('de-ascension-2028')).toBe('2028-05-25');
    expect(byId('pk-eid-al-fitr-2026')).toBe('2026-03-20');
    expect(byId('ae-eid-al-adha-2027')).toBe('2027-05-17');
    expect(byId('sa-eid-al-adha-2028')).toBe('2028-05-06');
    expect(byId('in-diwali-2026')).toBe('2026-10-20');
    expect(byId('my-deepavali-2027')).toBe('2027-11-08');
    expect(byId('intl-black-friday-2026')).toBe('2026-11-27');
  });

  it('marks solemn days defensibly (Ashura, Good Friday, Remembrance)', () => {
    expect(getHoliday('pk-ashura-2026')?.solemn).toBe(true);
    expect(getHoliday('gb-good-friday-2026')?.solemn).toBe(true);
    expect(getHoliday('gb-remembrance-day-2026')?.solemn).toBe(true);
    expect(getHoliday('ca-remembrance-day-2027')?.solemn).toBe(true);
    expect(getHoliday('au-anzac-day-2028')?.solemn).toBe(true);
    // Eid days are celebrations, not solemn.
    expect(getHoliday('pk-eid-al-fitr-2026')?.solemn).toBe(false);
    expect(getHoliday('pk-eid-al-adha-2026')?.solemn).toBe(false);
  });
});

describe('helpers', () => {
  it('holidaysForCountry filters by country and year, case-insensitively', () => {
    const pk2027 = holidaysForCountry('pk', 2027);
    expect(pk2027.length).toBeGreaterThanOrEqual(6);
    expect(pk2027.every((h) => h.country === 'PK')).toBe(true);
    expect(pk2027.every((h) => h.date.startsWith('2027-'))).toBe(true);
    expect(holidaysForCountry('PK')).toHaveLength(pk2027.length * 3);
    expect(holidaysForCountry('XX')).toEqual([]);
  });

  it('holidaysInRange returns sorted results within the inclusive range', () => {
    const results = holidaysInRange('2026-12-01', '2026-12-31');
    expect(results.length).toBeGreaterThan(0);
    for (const holiday of results) {
      expect(holiday.date >= '2026-12-01').toBe(true);
      expect(holiday.date <= '2026-12-31').toBe(true);
    }
    const dates = results.map((h) => h.date);
    expect(dates).toEqual([...dates].sort());
    // Inclusive boundaries.
    const single = holidaysInRange('2026-12-25', '2026-12-25');
    expect(single.length).toBeGreaterThan(0);
    expect(single.every((h) => h.date === '2026-12-25')).toBe(true);
    // Empty range.
    expect(holidaysInRange('2027-01-01', '2026-01-01')).toEqual([]);
  });

  it('holidaysInRange can be restricted to country codes', () => {
    const results = holidaysInRange('2026-01-01', '2028-12-31', ['US', 'CA']);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((h) => h.country === 'US' || h.country === 'CA')).toBe(true);
    const dates = results.map((h) => h.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('getHoliday returns a holiday by id and undefined for unknown ids', () => {
    const holiday = getHoliday('us-independence-day-2026');
    expect(holiday?.name).toBe('Independence Day');
    expect(holiday?.date).toBe('2026-07-04');
    expect(getHoliday('does-not-exist')).toBeUndefined();
  });

  it('exports a moon-sighting disclaimer mentioning the moon', () => {
    expect(MOON_SIGHTING_DISCLAIMER.length).toBeGreaterThan(40);
    expect(MOON_SIGHTING_DISCLAIMER.toLowerCase()).toContain('moon');
  });
});
