// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { decryptJson, encryptJson, isEncryptedEnvelope } from '../crypto';
import {
  SHARE_MAX_CHARS,
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
} from '../share';
import type { Post } from '../types';

const post = (patch: Partial<Post>): Post => ({
  id: 'p1',
  workspaceId: 'w',
  calendarId: 'cal',
  title: 'Launch',
  caption: 'Big day',
  description: '',
  platformCaptions: {},
  platformIds: ['instagram'],
  scheduledAt: '2026-12-01T05:30:00.000Z',
  timezone: 'Asia/Karachi',
  status: 'scheduled',
  contentType: 'text',
  priority: 'normal',
  tags: [],
  assigneeLabel: 'Alex',
  internalNotes: 'Secret note',
  mediaIds: [],
  checklist: [{ label: 'Check', done: true }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...patch,
});

describe('encrypted backups (AES-GCM + PBKDF2)', () => {
  it('round-trips JSON with the right password', async () => {
    const envelope = await encryptJson('{"hello":"world"}', 'correct horse battery');
    expect(isEncryptedEnvelope(envelope)).toBe(true);
    expect(envelope.ciphertext).not.toContain('hello');
    await expect(decryptJson(envelope, 'correct horse battery')).resolves.toBe('{"hello":"world"}');
  });

  it('rejects a wrong password with a clear error', async () => {
    const envelope = await encryptJson('{"a":1}', 'right password');
    await expect(decryptJson(envelope, 'wrong password')).rejects.toThrow(/password is wrong/i);
  });

  it('refuses short passwords', async () => {
    await expect(encryptJson('{}', 'short')).rejects.toThrow(/at least 8/);
  });

  it('uses a fresh salt/iv per encryption', async () => {
    const a = await encryptJson('{}', 'long enough password');
    const b = await encryptJson('{}', 'long enough password');
    expect(a.salt).not.toBe(b.salt);
    expect(a.iv).not.toBe(b.iv);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });
});

describe('share links', () => {
  it('round-trips a payload through gzip + base64url', async () => {
    const payload = buildSharePayload([post({})], 'Acme', 'Asia/Karachi', { stripPrivate: false });
    const encoded = await encodeSharePayload(payload);
    expect(encoded.length).toBeLessThan(SHARE_MAX_CHARS);
    expect(encoded).not.toMatch(/[+/=]/);
    const decoded = await decodeSharePayload(encoded);
    expect(decoded.posts).toHaveLength(1);
    expect(decoded.posts[0].title).toBe('Launch');
    expect(decoded.workspaceName).toBe('Acme');
  });

  it('strips private fields when asked', () => {
    const payload = buildSharePayload([post({})], 'Acme', 'Asia/Karachi', { stripPrivate: true });
    expect(payload.posts[0].internalNotes).toBe('');
    expect(payload.posts[0].assigneeLabel).toBe('');
    expect(payload.posts[0].checklist).toEqual([]);
  });

  it('filters by date range and excludes unscheduled posts', () => {
    const payload = buildSharePayload(
      [
        post({ id: 'a', scheduledAt: '2026-12-01T05:30:00.000Z' }),
        post({ id: 'b', scheduledAt: '2027-02-01T05:30:00.000Z' }),
        post({ id: 'c', scheduledAt: null }),
      ],
      'Acme',
      'Asia/Karachi',
      { stripPrivate: false, fromDate: '2026-11-01', toDate: '2026-12-31' },
    );
    expect(payload.posts.map((p) => p.id)).toEqual(['a']);
  });

  it('rejects a foreign payload', async () => {
    const foreign = new CompressionStream('gzip');
    void foreign;
    await expect(decodeSharePayload('aGVsbG8td29ybGQ')).rejects.toThrow();
  });
});
