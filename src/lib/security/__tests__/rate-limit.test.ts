// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rateLimit, getClientIp } from '../rate-limit';

const WINDOW_MS = 60_000;

afterEach(() => {
  vi.useRealTimers();
});

function freshKey(prefix: string): string {
  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

describe('rateLimit (in-memory fallback)', () => {
  it('allows up to the limit, then blocks', async () => {
    const key = freshKey('cap');
    for (let i = 0; i < 3; i++) {
      const r = await rateLimit(key, { limit: 3, windowMs: WINDOW_MS });
      expect(r.ok).toBe(true);
      expect(r.remaining).toBe(2 - i);
    }
    const blocked = await rateLimit(key, { limit: 3, windowMs: WINDOW_MS });
    expect(blocked.ok).toBe(false);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets when the window expires', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const key = freshKey('window');
    await rateLimit(key, { limit: 2, windowMs: 1_000 });
    await rateLimit(key, { limit: 2, windowMs: 1_000 });
    const blocked = await rateLimit(key, { limit: 2, windowMs: 1_000 });
    expect(blocked.ok).toBe(false);

    vi.setSystemTime(new Date('2026-01-01T00:00:02Z'));
    const after = await rateLimit(key, { limit: 2, windowMs: 1_000 });
    expect(after.ok).toBe(true);
    expect(after.remaining).toBe(1);
  });

  it('tracks different keys independently', async () => {
    const keyA = freshKey('keyA');
    const keyB = freshKey('keyB');
    const firstA = await rateLimit(keyA, { limit: 1, windowMs: WINDOW_MS });
    expect(firstA.ok).toBe(true);
    const secondA = await rateLimit(keyA, { limit: 1, windowMs: WINDOW_MS });
    expect(secondA.ok).toBe(false);
    const firstB = await rateLimit(keyB, { limit: 1, windowMs: WINDOW_MS });
    expect(firstB.ok).toBe(true);
    expect(firstB.remaining).toBe(0);
  });

  it('falls back to default limit of 60', async () => {
    const key = freshKey('default');
    const r = await rateLimit(key);
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(59);
  });
});

describe('getClientIp', () => {
  it('prefers the first x-forwarded-for entry', () => {
    const req = new Request('https://x.test/', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const req = new Request('https://x.test/', { headers: { 'x-real-ip': '9.9.9.9' } });
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  it('returns unknown when no ip headers are present', () => {
    expect(getClientIp(new Request('https://x.test/'))).toBe('unknown');
  });
});
