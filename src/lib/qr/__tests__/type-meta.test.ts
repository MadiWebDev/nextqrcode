import { describe, expect, it } from 'vitest';
import { getQrTypeMeta } from '@/lib/qr/type-meta';
import type { QRType } from '@/types';

const ALL_TYPES: QRType[] = [
  'text',
  'url',
  'pdf',
  'audio',
  'whatsapp',
  'phone',
  'sms',
  'email',
  'address',
  'wifi',
  'vcard',
  'social',
  'video',
  'image',
  'menu',
  'app',
  'coupon',
  'event',
  'business_card',
  'freelance',
  'ecommerce',
  'cleaning',
  'logistics',
  'finance',
  'cv',
  'mecard',
  'geo',
  'telegram',
  'zoom',
  'google_meet',
  'teams',
  'youtube',
  'linkedin',
  'spotify',
  'paypal',
  'upi',
  'bitcoin',
  'ethereum',
  'sepa',
  'google_review',
];

describe('getQrTypeMeta', () => {
  it('covers all 40 QR types with label, generator link and blurb', () => {
    for (const t of ALL_TYPES) {
      const m = getQrTypeMeta(t);
      expect(m.label.length, t).toBeGreaterThan(0);
      expect(m.blurb.length, t).toBeGreaterThan(30);
      expect(m.generatorHref.startsWith('/'), t).toBe(true);
    }
  });

  it('points known types at their dedicated generator pages', () => {
    expect(getQrTypeMeta('url').generatorHref).toBe('/url-qr-code-generator');
    expect(getQrTypeMeta('wifi').generatorHref).toBe('/wifi-qr-code-generator');
    expect(getQrTypeMeta('vcard').generatorHref).toBe('/vcard-qr-code-generator');
  });

  it('falls back gracefully for unknown types', () => {
    const m = getQrTypeMeta('nonexistent-type');
    expect(m.label).toBe('QR Code');
    expect(m.generatorHref).toBe('/');
  });

  it('uses the canonical type labels', () => {
    expect(getQrTypeMeta('vcard').label).toBe('vCard');
    expect(getQrTypeMeta('upi').label).toBe('UPI Payment');
    expect(getQrTypeMeta('url').label).toBe('Website URL');
  });
});
