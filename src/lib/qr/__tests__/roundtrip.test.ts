/**
 * Phase 2 — QR round-trip tests.
 *
 * For every QR content type: build the payload with generateQRData(), render the
 * module matrix with the `qrcode` library, rasterize it to raw pixels in Node,
 * decode with jsQR, and assert the decoded text equals the original payload.
 * This proves every generated code is actually scannable.
 */
import { describe, expect, it } from 'vitest';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { generateQRData, qrTypeConfigs } from '@/lib/qr-helpers';
import type { QRData, QRType } from '@/types';

/** Rasterize a QR module matrix to raw RGBA pixels (white quiet zone included). */
function rasterize(
  payload: string,
  scale = 8,
  quiet = 4
): { data: Uint8ClampedArray; size: number } {
  const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
  const modules = qr.modules.size;
  const px = (modules + quiet * 2) * scale;
  const data = new Uint8ClampedArray(px * px * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;
  }
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (qr.modules.get(r, c)) {
        for (let y = 0; y < scale; y++) {
          for (let x = 0; x < scale; x++) {
            const pr = (r + quiet) * scale + y;
            const pc = (c + quiet) * scale + x;
            const idx = (pr * px + pc) * 4;
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 255;
          }
        }
      }
    }
  }
  return { data, size: px };
}

function decodeRoundTrip(payload: string): string | null {
  const { data, size } = rasterize(payload);
  const result = jsQR(data, size, size);
  return result ? result.data : null;
}

/** Representative valid input per type (covers every required field). */
const SAMPLE_DATA: Record<QRType, QRData> = {
  text: { text: 'Hello, QR world!' },
  url: { url: 'https://example.com/page?q=1' },
  pdf: { url: 'https://example.com/document.pdf' },
  audio: { url: 'https://example.com/audio.mp3', usePremiumViewer: 'false' },
  whatsapp: { phone: '+14155552671', message: 'Hello!' },
  phone: { number: '+14155552671' },
  sms: { number: '+14155552671', message: 'Hi there' },
  email: { email: 'someone@example.com', subject: 'Hello', body: 'Test body' },
  address: { address: '1600 Amphitheatre Parkway, Mountain View, CA' },
  wifi: { ssid: 'My;Net"work', password: 'p,ass:word', encryption: 'WPA', hidden: 'true' },
  vcard: { name: 'John Doe', phone: '+14155552671', email: 'john@example.com', org: 'Acme Inc' },
  social: { platform: 'instagram', username: 'someuser' },
  video: { url: 'https://example.com/video.mp4', usePremiumViewer: 'false' },
  image: { url: 'https://example.com/image.jpg', usePremiumViewer: 'false' },
  menu: { title: 'Testaurant', items: 'Burger - $10\nFries - $5', url: 'https://example.com/menu' },
  app: {
    platform: 'both',
    iosUrl: 'https://apps.apple.com/app/id123',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.example',
  },
  coupon: { code: 'SAVE20', description: '20% off', url: 'https://example.com/shop' },
  event: {
    title: 'Launch Party',
    date: '2026-11-01',
    time: '18:30',
    location: 'Main Hall',
    description: 'Celebration',
  },
  business_card: {
    name: 'Jane Doe',
    title: 'Engineer',
    company: 'Acme',
    phone: '+14155552671',
    email: 'jane@acme.com',
    website: 'https://acme.com',
    address: '1 Main St',
  },
  freelance: {
    name: 'Jane Designer',
    skill: 'UI/UX',
    portfolio: 'https://portfolio.example.com',
    email: 'hi@example.com',
  },
  ecommerce: { productName: 'Widget', price: '$29.99', url: 'https://store.example.com/p/1' },
  cleaning: {
    company: 'Sparkle Clean',
    phone: '+14155552671',
    url: 'https://sparkle.example.com/book',
  },
  logistics: { trackingNumber: 'TRACK123', url: 'https://logistics.example.com/track?id=TRACK123' },
  finance: { service: 'PayMe', account: '@payme', url: 'https://pay.example.com/send' },
  cv: { name: 'John Doe', title: 'Developer', url: 'https://example.com/cv.pdf' },
  mecard: {
    name: 'Yamada Taro',
    tel: '+81123456789',
    email: 'y@example.com',
    url: 'https://example.com',
    address: 'Tokyo',
    nickname: 'Taro',
    birthday: '19900101',
  },
  geo: { lat: '35.6762', lng: '139.6503' },
  telegram: { username: 'someuser', message: 'Hello!' },
  zoom: { url: 'https://zoom.us/j/123456789' },
  google_meet: { url: 'https://meet.google.com/abc-defg-hij' },
  teams: { url: 'https://teams.microsoft.com/l/meetup-join/abc' },
  youtube: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
  linkedin: { url: 'https://linkedin.com/in/someuser' },
  spotify: { url: 'https://open.spotify.com/track/abc123' },
  paypal: { username: 'someuser', amount: '10.00', currency: 'USD' },
  upi: { pa: 'john@upi', pn: 'John Doe', amount: '100', tn: 'Test payment' },
  bitcoin: {
    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    amount: '0.001',
    label: 'Donation',
    message: 'Thanks',
  },
  ethereum: { address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', amount: '0.01' },
  sepa: {
    name: 'Max Mustermann',
    iban: 'DE89370400440532013000',
    bic: 'COBADEFFXXX',
    amount: '100.00',
    reason: 'Invoice 001',
  },
  google_review: { url: 'https://g.page/r/abc123/review' },
};

describe('QR round-trip: generate → decode (all types)', () => {
  // Every registered type must have a sample — catches types added without coverage.
  it('has sample data for every registered QR type', () => {
    const registered = qrTypeConfigs.map((c) => c.type).sort();
    const sampled = (Object.keys(SAMPLE_DATA) as QRType[]).sort();
    expect(sampled).toEqual(registered);
  });

  for (const { type } of qrTypeConfigs) {
    it(`round-trips: ${type}`, () => {
      const payload = generateQRData(type, SAMPLE_DATA[type]);
      expect(payload.length).toBeGreaterThan(0);
      const decoded = decodeRoundTrip(payload);
      expect(decoded).toBe(payload);
    });
  }
});
