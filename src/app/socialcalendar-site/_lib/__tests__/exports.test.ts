import { describe, expect, it } from 'vitest';
import {
  csvEscape,
  neutralizeFormula,
  postsToCsv,
  postsToIcs,
  monthSheetSvg,
} from '../exporters';
import {
  buildPerformanceFromRows,
  buildPostsFromRows,
  detectMapping,
  parseCsv,
} from '../importer';
import type { Post } from '../types';

const post = (patch: Partial<Post>): Post => ({
  id: 'p1',
  workspaceId: 'w',
  calendarId: 'cal',
  title: 'Hello',
  caption: 'Cap',
  description: '',
  platformCaptions: {},
  platformIds: ['instagram'],
  scheduledAt: '2026-11-20T04:00:00.000Z',
  timezone: 'Asia/Karachi',
  status: 'scheduled',
  contentType: 'text',
  priority: 'normal',
  tags: [],
  assigneeLabel: '',
  internalNotes: '',
  mediaIds: [],
  checklist: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...patch,
});

const names = { campaign: (id: string) => `C-${id}`, pillar: (id: string) => `P-${id}` };

describe('formula injection neutralization', () => {
  it('prefixes dangerous leading characters', () => {
    expect(neutralizeFormula('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)");
    expect(neutralizeFormula('+cmd')).toBe("'+cmd");
    expect(neutralizeFormula('-2+3')).toBe("'-2+3");
    expect(neutralizeFormula('@SUM(1)')).toBe("'@SUM(1)");
    expect(neutralizeFormula('Normal title')).toBe('Normal title');
  });

  it('csvEscape quotes cells with commas/quotes/newlines', () => {
    expect(csvEscape('a,b')).toBe('"a,b"');
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(csvEscape('plain')).toBe('plain');
  });
});

describe('postsToCsv', () => {
  it('emits headers + localized date/time and neutralizes titles', () => {
    const csv = postsToCsv([post({ title: '=HYPERLINK("x")' })], names);
    const lines = csv.split('\r\n');
    expect(lines[0]).toContain('title');
    expect(lines[1]).toContain('2026-11-20');
    expect(lines[1]).toContain('09:00'); // 04:00 UTC = 09:00 PKT
    expect(lines[1]).toContain("'=HYPERLINK");
  });
});

describe('postsToIcs', () => {
  it('escapes summary punctuation and skips unscheduled posts', () => {
    const ics = postsToIcs(
      [post({ title: 'Launch; big, day' }), post({ id: 'p2', scheduledAt: null })],
      'My Cal',
    );
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Launch\\; big\\, day');
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics).toContain('DTSTART:20261120T040000Z');
  });
});

describe('monthSheetSvg', () => {
  it('renders a branded month grid with post titles', () => {
    const svg = monthSheetSvg(
      2026,
      11,
      1,
      [post({})],
      {
        brandName: 'Acme',
        primaryColor: '#123456',
        secondaryColor: '#000000',
        accentColor: '#000000',
        fontPreference: 'sans',
        tone: '',
        description: '',
        website: '',
        socialLinks: {},
        hashtagPreferences: [],
        guidelines: '',
      },
      'Asia/Karachi',
    );
    expect(svg).toContain('<svg');
    expect(svg).toContain('Acme');
    expect(svg).toContain('Hello');
    expect(svg).toContain('#123456');
  });
});

describe('parseCsv', () => {
  it('handles quotes, embedded commas and newlines', () => {
    const rows = parseCsv('a,b\r\n"x,\ny",2\r\n');
    expect(rows).toEqual([
      ['a', 'b'],
      ['x,\ny', '2'],
    ]);
  });
});

describe('detectMapping + buildPostsFromRows', () => {
  const headers = ['Title', 'Caption', 'Date', 'Time', 'Platform', 'Junk'];
  const rows = [
    ['Launch', 'Big day', '2026-12-01', '10:30', 'Instagram', 'x'],
    ['Launch', 'Big day', '2026-12-01', '10:30', 'Instagram', 'x'],
    ['', '', '', '', '', ''],
  ];

  it('detects standard headers', () => {
    const mapping = detectMapping(headers);
    expect(mapping['Title']).toBe('title');
    expect(mapping['Platform']).toBe('platforms');
    expect(mapping['Junk']).toBe('ignore');
  });

  it('builds posts, flags duplicates and empty rows', () => {
    const preview = buildPostsFromRows(rows, headers, detectMapping(headers), {
      workspaceId: 'w',
      calendarId: 'cal',
      timezone: 'Asia/Karachi',
      existing: [],
      defaultPlatformIds: ['instagram'],
    });
    expect(preview.posts).toHaveLength(1);
    expect(preview.posts[0].scheduledAt).toBe('2026-12-01T05:30:00.000Z'); // 10:30 PKT
    expect(preview.duplicates).toHaveLength(1);
    expect(preview.errors).toHaveLength(1);
  });
});

describe('buildPerformanceFromRows', () => {
  it('matches by title and parses metrics', () => {
    const preview = buildPerformanceFromRows(
      [['Launch', 'Instagram', '2026-12-02', '120', '15']],
      ['Title', 'Platform', 'Date', 'Likes', 'Comments'],
      { workspaceId: 'w', posts: [post({ id: 'p9', title: 'Launch' })] },
    );
    expect(preview.entries).toHaveLength(1);
    expect(preview.entries[0].metrics).toEqual({ likes: 120, comments: 15 });
    expect(preview.entries[0].postId).toBe('p9');
  });

  it('reports unmatched rows', () => {
    const preview = buildPerformanceFromRows([['Nope', 'Instagram', '2026-12-02', '1']], ['Title', 'Platform', 'Date', 'Likes'], {
      workspaceId: 'w',
      posts: [],
    });
    expect(preview.entries).toHaveLength(0);
    expect(preview.errors).toHaveLength(1);
  });
});
