/**
 * Unit tests for the spec-correct QR payload builders (`@/lib/qr/payloads`)
 * plus regression coverage that `generateQRData` delegates correctly and
 * leaves untouched types byte-identical.
 */
import { describe, expect, it } from 'vitest';
import {
  BitcoinSchema,
  EthereumSchema,
  IcsEventSchema,
  PayloadError,
  SepaSchema,
  UpiSchema,
  VCardSchema,
  WifiSchema,
  buildBitcoin,
  buildEmail,
  buildEthereum,
  buildGeo,
  buildIcsEvent,
  buildMeCard,
  buildPhone,
  buildSepa,
  buildSms,
  buildTelegram,
  buildUpi,
  buildVCard,
  buildWhatsapp,
  buildWifi,
} from '@/lib/qr/payloads';
import { generateQRData } from '@/lib/qr-helpers';

describe('buildWifi', () => {
  it('builds a WPA payload with a single trailing semicolon', () => {
    expect(buildWifi('MyNet', 'secret', 'WPA', false)).toBe('WIFI:S:MyNet;T:WPA;P:secret;');
  });

  it('escapes \\ ; , : " with a backslash', () => {
    expect(buildWifi('My;Net', 'p"ass', 'WPA', false)).toBe('WIFI:S:My\\;Net;T:WPA;P:p\\"ass;');
  });

  it('adds H:true for hidden networks and omits P: for nopass', () => {
    expect(buildWifi('Hidden', 'secret', 'WPA', true)).toBe('WIFI:S:Hidden;T:WPA;P:secret;H:true;');
    expect(buildWifi('Open', '', 'nopass', false)).toBe('WIFI:S:Open;T:nopass;');
  });

  it('throws PayloadError when the SSID is missing', () => {
    expect(() => buildWifi('', 'secret', 'WPA', false)).toThrow(PayloadError);
    expect(() => buildWifi('', 'secret', 'WPA', false)).toThrow('SSID is required');
  });

  it('encodes an empty password as an empty P: field (form marks it optional)', () => {
    expect(buildWifi('Net', '', 'WPA', false)).toBe('WIFI:S:Net;T:WPA;P:;');
  });
});

describe('buildVCard', () => {
  it('builds an RFC 6350 vCard 4.0 with CRLF separators', () => {
    const out = buildVCard({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      org: 'Acme',
      title: 'Engineer',
      url: 'https://example.com',
      address: '123 Main St',
    });
    expect(out).toBe(
      [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'FN:John Doe',
        'N:Doe;John;;;',
        'TEL:+1234567890',
        'EMAIL:john@example.com',
        'ORG:Acme',
        'TITLE:Engineer',
        'URL:https://example.com',
        'ADR:;;123 Main St;;;;',
        'END:VCARD',
      ].join('\r\n')
    );
  });

  it('omits empty optional fields', () => {
    expect(buildVCard({ firstName: 'Jane' })).toBe(
      ['BEGIN:VCARD', 'VERSION:4.0', 'FN:Jane', 'N:;Jane;;;', 'END:VCARD'].join('\r\n')
    );
  });

  it('escapes commas, semicolons and newlines', () => {
    const out = buildVCard({ firstName: 'Doe; John', address: '123 Main St, Apt 4\nFloor 2' });
    expect(out).toContain('FN:Doe\\; John');
    expect(out).toContain('ADR:;;123 Main St\\, Apt 4\\nFloor 2;;;;');
  });

  it('folds lines longer than 75 octets with CRLF + space', () => {
    const longOrg = 'A'.repeat(100);
    const out = buildVCard({ firstName: 'Jane', org: longOrg });
    expect(out).toContain(`ORG:${'A'.repeat(71)}\r\n ${'A'.repeat(29)}`);
    // No unfolded line exceeds 75 octets.
    for (const line of out.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  it('throws PayloadError when both names are missing', () => {
    expect(() => buildVCard({})).toThrow(PayloadError);
  });
});

describe('buildMeCard', () => {
  it('builds a MECARD payload with double-semicolon terminator', () => {
    expect(
      buildMeCard({
        name: 'Yamada Taro',
        tel: '+819012345678',
        email: 'yamada@example.com',
        url: 'https://example.com',
        address: '1-2-3 Shibuya',
        nickname: 'Taro',
        birthday: '19900101',
      })
    ).toBe(
      'MECARD:N:Yamada Taro;TEL:+819012345678;EMAIL:yamada@example.com;' +
        'URL:https\\://example.com;ADR:1-2-3 Shibuya;NICKNAME:Taro;BDAY:19900101;;'
    );
  });

  it('escapes \\ ; : , in values', () => {
    expect(
      buildMeCard({ name: 'Doe; John: Jr, Sr' }).startsWith('MECARD:N:Doe\\; John\\: Jr\\, Sr;')
    ).toBe(true);
  });

  it('throws PayloadError when the name is missing', () => {
    expect(() => buildMeCard({})).toThrow(PayloadError);
  });
});

describe('buildIcsEvent', () => {
  it('builds an RFC 5545 VEVENT inside a VCALENDAR with UTC timestamps', () => {
    const out = buildIcsEvent({
      title: 'Launch Party',
      start: new Date('2026-10-20T10:00:00Z'),
      end: new Date('2026-10-20T12:30:00Z'),
      location: 'Lahore, Pakistan',
      description: 'Celebration; bring friends, family',
    });
    expect(out.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(out).toContain('DTSTART:20261020T100000Z');
    expect(out).toContain('DTEND:20261020T123000Z');
    expect(out).toContain('SUMMARY:Launch Party');
    expect(out).toContain('LOCATION:Lahore\\, Pakistan');
    expect(out).toContain('DESCRIPTION:Celebration\\; bring friends\\, family');
    expect(out).toContain('UID:');
    expect(out.endsWith('END:VEVENT\r\nEND:VCALENDAR')).toBe(true);
  });

  it('accepts date strings and works without optional fields', () => {
    const out = buildIcsEvent({ title: 'Standup', start: '2026-10-21T09:00:00Z' });
    expect(out).toContain('DTSTART:20261021T090000Z');
    expect(out).not.toContain('DTEND:');
    expect(out).not.toContain('LOCATION:');
  });

  it('escapes newlines in the description as \\n', () => {
    const out = buildIcsEvent({ title: 'T', start: '2026-10-21T09:00:00Z', description: 'a\nb' });
    expect(out).toContain('DESCRIPTION:a\\nb');
  });

  it('throws PayloadError on a missing title or invalid date', () => {
    expect(() => buildIcsEvent({ title: '', start: '2026-10-21' })).toThrow(PayloadError);
    expect(() => buildIcsEvent({ title: 'T', start: 'not-a-date' })).toThrow(PayloadError);
  });
});

describe('buildGeo', () => {
  it('builds a geo URI', () => {
    expect(buildGeo(35.6762, 139.6503)).toBe('geo:35.6762,139.6503');
    expect(buildGeo('35.6762', '139.6503')).toBe('geo:35.6762,139.6503');
  });

  it('throws PayloadError on non-numeric coordinates', () => {
    expect(() => buildGeo('abc', '1')).toThrow(PayloadError);
    expect(() => buildGeo('', '')).toThrow(PayloadError);
  });
});

describe('buildBitcoin', () => {
  const addr = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';

  it('builds a BIP-21 URI with amount, label and message', () => {
    expect(buildBitcoin(addr, '0.001', 'Donation', 'Thanks!')).toBe(
      `bitcoin:${addr}?amount=0.001&label=Donation&message=Thanks!`
    );
  });

  it('URL-encodes label and message', () => {
    expect(buildBitcoin(addr, undefined, 'My Label', 'a b&c')).toContain(
      'label=My%20Label&message=a%20b%26c'
    );
  });

  it('omits the query string when no params are given', () => {
    expect(buildBitcoin(addr)).toBe(`bitcoin:${addr}`);
  });

  it('throws PayloadError on a missing address or bad amount', () => {
    expect(() => buildBitcoin('')).toThrow(PayloadError);
    expect(() => buildBitcoin(addr, '1.123456789')).toThrow(PayloadError);
  });
});

describe('buildEthereum', () => {
  const addr = '0xAbC1234567890abcdef1234567890ABCDEF12345';

  it('converts ETH to wei with BigInt (EIP-681)', () => {
    expect(buildEthereum(addr, '0.01')).toBe(`ethereum:${addr}?value=10000000000000000`);
    expect(buildEthereum(addr, '1.5')).toBe(`ethereum:${addr}?value=1500000000000000000`);
    expect(buildEthereum(addr)).toBe(`ethereum:${addr}`);
  });

  it('appends the chain ID when provided', () => {
    expect(buildEthereum(addr, undefined, 1)).toBe(`ethereum:${addr}@1`);
    expect(buildEthereum(addr, '2', 137)).toBe(`ethereum:${addr}@137?value=2000000000000000000`);
  });

  it('throws PayloadError on a bad address or bad amount', () => {
    expect(() => buildEthereum('0x123')).toThrow(PayloadError);
    expect(() => buildEthereum('not-an-address')).toThrow(PayloadError);
    expect(() => buildEthereum(addr, 'abc')).toThrow(PayloadError);
  });
});

describe('buildUpi', () => {
  it('builds an NPCI UPI URI with cu=INR fixed', () => {
    expect(buildUpi({ pa: 'john@okhdfc', pn: 'John Doe', amount: '100', note: 'Invoice #1' })).toBe(
      'upi://pay?pa=john%40okhdfc&pn=John%20Doe&am=100&cu=INR&tn=Invoice%20%231'
    );
  });

  it('works with only the required pa field', () => {
    expect(buildUpi({ pa: 'shop@paytm' })).toBe('upi://pay?pa=shop%40paytm&cu=INR');
  });

  it('throws PayloadError on a missing or malformed pa', () => {
    expect(() => buildUpi({ pa: '' })).toThrow(PayloadError);
    expect(() => buildUpi({ pa: 'not-a-vpa' })).toThrow(PayloadError);
    expect(() => buildUpi({ pa: '@' })).toThrow(PayloadError);
  });

  it('throws PayloadError on a bad amount', () => {
    expect(() => buildUpi({ pa: 'john@okhdfc', amount: 'abc' })).toThrow(PayloadError);
  });
});

describe('buildSepa', () => {
  const input = {
    name: 'Max Mustermann',
    iban: 'DE89370400440532013000',
    bic: 'COBADEFFXXX',
    amount: '100.00',
    reason: 'Invoice 2024-001',
  };

  it('builds an EPC069-12 payload with REAL newlines', () => {
    const out = buildSepa(input);
    expect(out).toBe(
      'BCD\n002\n1\nSCT\nCOBADEFFXXX\nMax Mustermann\nDE89370400440532013000\nEUR100.00\n\n\nInvoice 2024-001'
    );
    // Regression: the old code emitted the literal two-char sequence backslash-n.
    expect(out).not.toContain('\\n');
  });

  it('normalises a spaced/lowercase IBAN and allows empty optional fields', () => {
    const out = buildSepa({ name: 'Jane', iban: 'de89 3704 0044 0532 0130 00' });
    expect(out).toBe('BCD\n002\n1\nSCT\n\nJane\nDE89370400440532013000\nEUR\n\n\n');
  });

  it('throws PayloadError on a bad IBAN (format or checksum)', () => {
    expect(() => buildSepa({ name: 'Jane', iban: 'DE00' })).toThrow(PayloadError);
    // Correct length/format but wrong mod-97 checksum.
    expect(() => buildSepa({ name: 'Jane', iban: 'DE00370400440532013000' })).toThrow(PayloadError);
  });

  it('throws PayloadError on a bad BIC or amount', () => {
    expect(() => buildSepa({ name: 'Jane', iban: input.iban, bic: 'XX' })).toThrow(PayloadError);
    expect(() => buildSepa({ name: 'Jane', iban: input.iban, amount: 'abc' })).toThrow(
      PayloadError
    );
  });
});

describe('buildSms / buildEmail / buildPhone / buildWhatsapp / buildTelegram', () => {
  it('buildSms encodes the body', () => {
    expect(buildSms('+1234567890', 'Hello there!')).toBe('sms:+1234567890?body=Hello%20there!');
    expect(buildSms('+1234567890')).toBe('sms:+1234567890');
  });

  it('buildEmail builds a mailto with encoded subject/body', () => {
    expect(buildEmail('a@b.com', 'Hi & bye', 'Line 1\nLine 2')).toBe(
      'mailto:a@b.com?subject=Hi%20%26%20bye&body=Line%201%0ALine%202'
    );
    expect(buildEmail('a@b.com')).toBe('mailto:a@b.com');
  });

  it('buildPhone builds a tel: URI', () => {
    expect(buildPhone('+1234567890')).toBe('tel:+1234567890');
  });

  it('buildWhatsapp strips non-digits and encodes the message', () => {
    expect(buildWhatsapp('+1 (234) 567-890', 'Hello!')).toBe(
      'https://wa.me/1234567890?text=Hello!'
    );
    expect(buildWhatsapp('1234567890')).toBe('https://wa.me/1234567890');
  });

  it('buildTelegram strips a leading @ and encodes the message', () => {
    expect(buildTelegram('@myuser', 'Hello world')).toBe('https://t.me/myuser?text=Hello%20world');
    expect(buildTelegram('myuser')).toBe('https://t.me/myuser');
  });

  it('throws PayloadError when required input is missing', () => {
    expect(() => buildSms('')).toThrow(PayloadError);
    expect(() => buildEmail('')).toThrow(PayloadError);
    expect(() => buildPhone('')).toThrow(PayloadError);
    expect(() => buildWhatsapp('abc')).toThrow(PayloadError);
    expect(() => buildTelegram('')).toThrow(PayloadError);
  });
});

describe('Zod schemas', () => {
  it('WifiSchema validates the wifi form', () => {
    expect(WifiSchema.safeParse({ ssid: 'Net', encryption: 'WPA', hidden: false }).success).toBe(
      true
    );
    expect(WifiSchema.safeParse({ ssid: '', encryption: 'WPA', hidden: false }).success).toBe(
      false
    );
    expect(WifiSchema.safeParse({ ssid: 'Net', encryption: 'WPA3', hidden: false }).success).toBe(
      false
    );
  });

  it('VCardSchema requires a first or last name', () => {
    expect(VCardSchema.safeParse({}).success).toBe(false);
    expect(VCardSchema.safeParse({ firstName: 'John' }).success).toBe(true);
    expect(VCardSchema.safeParse({ firstName: 'John', email: 'bad' }).success).toBe(false);
  });

  it('IcsEventSchema requires a title and start', () => {
    expect(IcsEventSchema.safeParse({ title: 'T', start: new Date() }).success).toBe(true);
    expect(IcsEventSchema.safeParse({ start: '2026-10-21' }).success).toBe(false);
  });

  it('UpiSchema enforces the VPA shape on pa', () => {
    expect(UpiSchema.safeParse({ pa: 'john@okhdfc' }).success).toBe(true);
    expect(UpiSchema.safeParse({ pa: 'nope' }).success).toBe(false);
    expect(UpiSchema.safeParse({}).success).toBe(false);
  });

  it('SepaSchema validates the IBAN with mod-97', () => {
    expect(SepaSchema.safeParse({ name: 'Max', iban: 'DE89370400440532013000' }).success).toBe(
      true
    );
    expect(SepaSchema.safeParse({ name: 'Max', iban: 'DE00' }).success).toBe(false);
    expect(SepaSchema.safeParse({ name: 'Max', iban: 'DE00370400440532013000' }).success).toBe(
      false
    );
  });

  it('BitcoinSchema validates the amount format', () => {
    expect(BitcoinSchema.safeParse({ address: 'bc1q...' }).success).toBe(true);
    expect(BitcoinSchema.safeParse({ address: 'bc1q...', amount: '1.123456789' }).success).toBe(
      false
    );
  });

  it('EthereumSchema validates the 0x address shape', () => {
    const addr = '0xAbC1234567890abcdef1234567890ABCDEF12345';
    expect(EthereumSchema.safeParse({ address: addr, amount: '0.01' }).success).toBe(true);
    expect(EthereumSchema.safeParse({ address: '0x123' }).success).toBe(false);
  });
});

describe('generateQRData — untouched types are byte-identical', () => {
  it('url', () => {
    expect(generateQRData('url', { url: 'https://example.com' })).toBe('https://example.com');
  });

  it('sms', () => {
    expect(generateQRData('sms', { number: '+123', message: 'Hi!' })).toBe('sms:+123?body=Hi!');
    expect(generateQRData('sms', { number: '+123' })).toBe('sms:+123');
    expect(generateQRData('sms', {})).toBe('');
  });

  it('phone', () => {
    expect(generateQRData('phone', { number: '+123' })).toBe('tel:+123');
    expect(generateQRData('phone', {})).toBe('');
  });

  it('email', () => {
    expect(generateQRData('email', { email: 'a@b.com', subject: 'Hi', body: 'Yo' })).toBe(
      'mailto:a@b.com?subject=Hi&body=Yo'
    );
    expect(generateQRData('email', { email: 'a@b.com' })).toBe('mailto:a@b.com');
  });

  it('geo', () => {
    expect(generateQRData('geo', { lat: '35.6762', lng: '139.6503' })).toBe('geo:35.6762,139.6503');
  });

  it('bitcoin', () => {
    expect(
      generateQRData('bitcoin', { address: 'bc1qabc', amount: '0.001', label: 'L', message: 'M' })
    ).toBe('bitcoin:bc1qabc?amount=0.001&label=L&message=M');
    expect(generateQRData('bitcoin', { address: 'bc1qabc' })).toBe('bitcoin:bc1qabc');
  });

  it('whatsapp', () => {
    expect(generateQRData('whatsapp', { phone: '+123', message: 'Hi' })).toBe(
      'https://wa.me/123?text=Hi'
    );
    expect(generateQRData('whatsapp', {})).toBe('');
  });

  it('telegram', () => {
    expect(generateQRData('telegram', { username: 'user', message: 'Hi' })).toBe(
      'https://t.me/user?text=Hi'
    );
    expect(generateQRData('telegram', {})).toBe('');
  });

  it('mecard', () => {
    expect(generateQRData('mecard', { name: 'Yamada Taro', tel: '+8190' })).toBe(
      'MECARD:N:Yamada Taro;TEL:+8190;;;'
    );
  });
});

describe('generateQRData — fixed branches delegate to the builders', () => {
  it('wifi ends with a single trailing ; (was ;;)', () => {
    expect(generateQRData('wifi', { ssid: 'My;Net', password: 'p"ass', encryption: 'WPA' })).toBe(
      'WIFI:S:My\\;Net;T:WPA;P:p\\"ass;'
    );
    expect(
      generateQRData('wifi', { ssid: 'Net', password: 'pw', encryption: 'WPA', hidden: 'true' })
    ).toBe('WIFI:S:Net;T:WPA;P:pw;H:true;');
    expect(generateQRData('wifi', { ssid: '' })).toBe('');
  });

  it('vcard keeps the cardUrl shortcut and otherwise emits vCard 4.0', () => {
    expect(generateQRData('vcard', { cardUrl: 'https://example.com/card' })).toBe(
      'https://example.com/card'
    );
    const out = generateQRData('vcard', {
      name: 'John Doe',
      phone: '+123',
      email: 'j@x.com',
      org: 'Acme',
    });
    expect(out).toBe(
      [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'FN:John Doe',
        'N:Doe;John;;;',
        'TEL:+123',
        'EMAIL:j@x.com',
        'ORG:Acme',
        'END:VCARD',
      ].join('\r\n')
    );
    expect(generateQRData('vcard', {})).toBe('');
  });

  it('event emits ICS (not a Google Calendar URL)', () => {
    const out = generateQRData('event', {
      title: 'Party',
      date: '2026-10-20',
      time: '10:00',
      location: 'Lahore',
      description: 'Fun',
    });
    expect(out.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(out).toContain('SUMMARY:Party');
    expect(out).toContain('LOCATION:Lahore');
    expect(out).toContain('DTSTART:');
    expect(out).not.toContain('calendar.google.com');
    expect(generateQRData('event', {})).toBe('');
  });

  it('ethereum value is in wei (was ETH units)', () => {
    const addr = '0xAbC1234567890abcdef1234567890ABCDEF12345';
    expect(generateQRData('ethereum', { address: addr, amount: '0.01' })).toBe(
      `ethereum:${addr}?value=10000000000000000`
    );
    expect(generateQRData('ethereum', { address: addr })).toBe(`ethereum:${addr}`);
    expect(generateQRData('ethereum', { address: '0xbad' })).toBe('');
    expect(generateQRData('ethereum', {})).toBe('');
  });

  it('sepa uses real newlines (was literal \\n)', () => {
    const out = generateQRData('sepa', {
      name: 'Max Mustermann',
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      amount: '100.00',
      reason: 'Invoice 2024-001',
    });
    expect(out).toBe(
      'BCD\n002\n1\nSCT\nCOBADEFFXXX\nMax Mustermann\nDE89370400440532013000\nEUR100.00\n\n\nInvoice 2024-001'
    );
    expect(generateQRData('sepa', { name: 'Max', iban: 'bogus' })).toBe('');
    expect(generateQRData('sepa', {})).toBe('');
  });

  it('upi keeps cu=INR and validates the VPA', () => {
    expect(
      generateQRData('upi', { pa: 'john@okhdfc', pn: 'John', amount: '100', tn: 'Note' })
    ).toBe('upi://pay?pa=john%40okhdfc&pn=John&am=100&cu=INR&tn=Note');
    expect(generateQRData('upi', { pa: 'not-a-vpa' })).toBe('');
    expect(generateQRData('upi', {})).toBe('');
  });
});
