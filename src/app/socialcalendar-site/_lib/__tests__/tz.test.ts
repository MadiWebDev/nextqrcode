import { describe, expect, it } from 'vitest';
import {
  getTimezoneOffsetMs,
  toDateStrInZone,
  utcToZonedParts,
  wallTimeToUtc,
  zonedTimeToUtc,
} from '../tz';
import { expandRecurrence } from '../recurrence';
import { monthGrid, weekDates, addDays, diffDays } from '../dates';

describe('timezone engine', () => {
  it('Asia/Karachi is a fixed +05:00 (no DST)', () => {
    const instant = zonedTimeToUtc('Asia/Karachi', 2026, 1, 15, 9, 0);
    expect(instant.toISOString()).toBe('2026-01-15T04:00:00.000Z');
    expect(getTimezoneOffsetMs('Asia/Karachi', instant)).toBe(5 * 3600_000);
  });

  it('America/New_York spring forward: post-gap time uses EDT', () => {
    // 2026-03-08: clocks jump 02:00 → 03:00.
    expect(zonedTimeToUtc('America/New_York', 2026, 3, 8, 1, 30).toISOString()).toBe(
      '2026-03-08T06:30:00.000Z',
    );
    expect(zonedTimeToUtc('America/New_York', 2026, 3, 8, 3, 30).toISOString()).toBe(
      '2026-03-08T07:30:00.000Z',
    );
  });

  it('America/New_York gap time resolves to an instant after the gap', () => {
    const resolved = zonedTimeToUtc('America/New_York', 2026, 3, 8, 2, 30);
    const parts = utcToZonedParts('America/New_York', resolved);
    // 02:30 does not exist; the engine must not return an instant whose
    // wall time reads earlier than requested — it lands at/after 03:00.
    expect(parts.hour).toBeGreaterThanOrEqual(3);
    expect(parts.day).toBe(8);
  });

  it('Europe/London BST vs GMT', () => {
    expect(zonedTimeToUtc('Europe/London', 2026, 6, 15, 12, 0).toISOString()).toBe(
      '2026-06-15T11:00:00.000Z',
    );
    expect(zonedTimeToUtc('Europe/London', 2026, 1, 15, 12, 0).toISOString()).toBe(
      '2026-01-15T12:00:00.000Z',
    );
  });

  it('Australia/Lord_Howe has a 30-minute DST shift (+11 / +10:30)', () => {
    expect(zonedTimeToUtc('Australia/Lord_Howe', 2026, 1, 15, 9, 0).toISOString()).toBe(
      '2026-01-14T22:00:00.000Z',
    );
    expect(zonedTimeToUtc('Australia/Lord_Howe', 2026, 7, 15, 9, 0).toISOString()).toBe(
      '2026-07-14T22:30:00.000Z',
    );
  });

  it('round-trips wall times in all five spec zones', () => {
    for (const zone of [
      'Asia/Karachi',
      'America/New_York',
      'Europe/London',
      'Australia/Lord_Howe',
      'Pacific/Auckland',
    ]) {
      const instant = zonedTimeToUtc(zone, 2027, 5, 20, 14, 45);
      const parts = utcToZonedParts(zone, instant);
      expect([parts.year, parts.month, parts.day, parts.hour, parts.minute]).toEqual([
        2027, 5, 20, 14, 45,
      ]);
      expect(toDateStrInZone(zone, instant)).toBe('2027-05-20');
    }
  });

  it('wallTimeToUtc parses date + time strings', () => {
    expect(wallTimeToUtc('Asia/Karachi', '2026-02-01', '18:30').toISOString()).toBe(
      '2026-02-01T13:30:00.000Z',
    );
  });
});

describe('civil dates', () => {
  it('monthGrid returns 42 cells aligned to week start', () => {
    const grid = monthGrid(2026, 2, 1); // Feb 2026, Monday start
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2026-01-26');
    expect(grid).toContain('2026-02-01');
    expect(grid[41]).toBe('2026-03-08');
  });

  it('weekDates and addDays/diffDays agree', () => {
    expect(weekDates('2026-02-11', 1)).toEqual([
      '2026-02-09',
      '2026-02-10',
      '2026-02-11',
      '2026-02-12',
      '2026-02-13',
      '2026-02-14',
      '2026-02-15',
    ]);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(diffDays('2026-01-01', '2026-01-31')).toBe(30);
  });
});

describe('recurrence', () => {
  const base = {
    scheduledAt: '2026-03-02T14:00:00.000Z', // Mon 09:00 in New York (EST)
    timezone: 'America/New_York',
  };

  it('weekly recurrence keeps 9:00 local across the DST change', () => {
    const occ = expandRecurrence(
      { ...base, recurrence: { freq: 'weekly', interval: 1, count: 3 } },
      new Date('2026-03-01T00:00:00Z'),
      new Date('2026-04-01T00:00:00Z'),
    );
    expect(occ.map((o) => o.localDate)).toEqual(['2026-03-02', '2026-03-09', '2026-03-16']);
    // After 2026-03-08 the zone is EDT (UTC-4): 09:00 local = 13:00Z.
    expect(occ[1].scheduledAt).toBe('2026-03-09T13:00:00.000Z');
    expect(occ[2].scheduledAt).toBe('2026-03-16T13:00:00.000Z');
  });

  it('daily recurrence honours interval and until', () => {
    const occ = expandRecurrence(
      {
        scheduledAt: '2026-01-01T04:00:00.000Z',
        timezone: 'Asia/Karachi',
        recurrence: { freq: 'daily', interval: 2, until: '2026-01-07' },
      },
      new Date('2025-12-31T00:00:00Z'),
      new Date('2026-02-01T00:00:00Z'),
    );
    expect(occ.map((o) => o.localDate)).toEqual([
      '2026-01-01',
      '2026-01-03',
      '2026-01-05',
      '2026-01-07',
    ]);
  });

  it('monthly recurrence clamps to short months', () => {
    const occ = expandRecurrence(
      {
        scheduledAt: '2026-01-31T12:00:00.000Z',
        timezone: 'Europe/London',
        recurrence: { freq: 'monthly', interval: 1, count: 3 },
      },
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-06-01T00:00:00Z'),
    );
    expect(occ.map((o) => o.localDate)).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
  });

  it('non-recurring post yields itself only inside the range', () => {
    const occ = expandRecurrence(
      base,
      new Date('2026-03-01T00:00:00Z'),
      new Date('2026-03-31T00:00:00Z'),
    );
    expect(occ).toHaveLength(1);
    expect(
      expandRecurrence(base, new Date('2026-05-01T00:00:00Z'), new Date('2026-05-31T00:00:00Z')),
    ).toHaveLength(0);
  });
});
