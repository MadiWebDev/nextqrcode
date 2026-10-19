/**
 * Unit tests for the spec-verified regional payment payload builders
 * (`@/lib/qr/regional-payments`).
 *
 * Real-world-format assertions (checked against the cited specs):
 * - `pixQr` dynamic output reproduces the Banco Central do Brasil "Manual de
 *   Padrões para Iniciação do Pix" worked example byte-for-byte, including
 *   the official `64E4` CRC — which also verifies the CRC16-CCITT
 *   implementation independently of this codebase.
 * - `girocode` reproduces the Belgian Red Cross EPC sample content
 *   (BCD/001/…/CHAR/…) from the EPC QR code specification examples.
 * - `upiIntent` produces an NPCI merchant deep link in `upi://pay` form.
 */
import { describe, expect, it } from 'vitest';
import {
  GirocodeSchema,
  PixQrSchema,
  UpiIntentSchema,
  girocode,
  pixQr,
  upiIntent,
} from '@/lib/qr/regional-payments';
import { PayloadError } from '@/lib/qr/payloads';

describe('pixQr', () => {
  it('reproduces the BCB manual dynamic-QR worked example byte-for-byte (incl. CRC 64E4)', () => {
    const out = pixQr({
      mode: 'dynamic',
      url: 'pix.example.com/8b3da2f39a4140d1a91abd93113bd441',
      name: 'Fulano de Tal',
      city: 'BRASILIA',
    });
    expect(out).toBe(
      '00020101021226700014br.gov.bcb.pix2548pix.example.com/8b3da2f39a4140d1a91abd93113bd44' +
        '15204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***630464E4'
    );
  });

  it('builds a static QR with the chave in subfield 01 and no point-of-initiation field', () => {
    const out = pixQr({
      mode: 'static',
      key: 'fulano@example.com',
      name: 'Fulano de Tal',
      city: 'BRASILIA',
      amount: '123.45',
      txid: 'RP12345678',
    });
    expect(out.startsWith('00020126')).toBe(true);
    expect(out).toContain('0014br.gov.bcb.pix0118fulano@example.com');
    expect(out).not.toContain('010212');
    expect(out).toContain('5406123.45');
    expect(out).toContain('62140510RP12345678');
    expect(out).toMatch(/6304[0-9A-F]{4}$/);
  });

  it('omits the amount field when the payer enters the amount', () => {
    const out = pixQr({ mode: 'static', key: '11987654321', name: 'Loja', city: 'SAO PAULO' });
    // Currency (53) is immediately followed by country (58): no amount (54) field.
    expect(out).toContain('53039865802BR');
    expect(out).toContain('62070503***');
  });

  it('rejects a receiver URL that includes the protocol prefix', () => {
    expect(() =>
      pixQr({
        mode: 'dynamic',
        url: 'https://pix.example.com/abc',
        name: 'Loja',
        city: 'SAO PAULO',
      })
    ).toThrow(PayloadError);
  });

  it('requires a key for static and a URL for dynamic QR codes', () => {
    expect(() => pixQr({ mode: 'static', name: 'Loja', city: 'SAO PAULO' })).toThrow(PayloadError);
    expect(() => pixQr({ mode: 'dynamic', name: 'Loja', city: 'SAO PAULO' })).toThrow(PayloadError);
  });

  it('rejects bad txid, amount and oversized name/city', () => {
    const base = { mode: 'static', key: 'k', name: 'Loja', city: 'SP' } as const;
    expect(() => pixQr({ ...base, txid: 'has space!' })).toThrow(PayloadError);
    expect(() => pixQr({ ...base, amount: '10.999' })).toThrow(PayloadError);
    expect(() => pixQr({ ...base, amount: '0' })).toThrow(PayloadError);
    expect(() => pixQr({ ...base, name: 'A'.repeat(26) })).toThrow(PayloadError);
    expect(() => pixQr({ ...base, city: 'B'.repeat(16) })).toThrow(PayloadError);
  });
});

describe('upiIntent', () => {
  it('builds an NPCI merchant intent deep link with the merchant parameter set', () => {
    const out = upiIntent({
      pa: 'shop@okhdfcbank',
      pn: 'Aziz General Store',
      mc: '5411',
      tid: 'TXN20261019',
      tr: 'ORD-12345',
      amount: '499.00',
      tn: 'Order 12345',
      mode: '04',
      orgid: '0000',
    });
    expect(out).toBe(
      'upi://pay?pa=shop%40okhdfcbank&pn=Aziz%20General%20Store&mc=5411&tid=TXN20261019' +
        '&tr=ORD-12345&am=499.00&cu=INR&tn=Order%2012345&mode=04&orgid=0000'
    );
  });

  it('builds a minimal intent with cu=INR', () => {
    expect(upiIntent({ pa: 'ab@cd', pn: 'X' })).toBe('upi://pay?pa=ab%40cd&pn=X&cu=INR');
  });

  it('rejects an invalid VPA, bad MCC, oversized tr/tn and bad mode', () => {
    expect(() => upiIntent({ pa: 'not-a-vpa', pn: 'X' })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: '' })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: 'X', mc: 'abc' })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: 'X', tr: 'R'.repeat(36) })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: 'X', tn: 'N'.repeat(81) })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: 'X', mode: '03' as '01' })).toThrow(PayloadError);
    expect(() => upiIntent({ pa: 'ab@cd', pn: 'X', orgid: '00' })).toThrow(PayloadError);
  });
});

describe('girocode', () => {
  it('reproduces the Belgian Red Cross EPC sample content exactly', () => {
    const out = girocode({
      version: '001',
      bic: 'BPOTBEB1',
      name: 'Red Cross',
      iban: 'BE72000000001616',
      amount: '1',
      purpose: 'CHAR',
      reference: 'Urgency fund',
      info: 'Sample EPC QR code',
    });
    expect(out).toBe(
      'BCD\n001\n1\nSCT\nBPOTBEB1\nRed Cross\nBE72000000001616\nEUR1\nCHAR\n\nUrgency fund\nSample EPC QR code'
    );
  });

  it('accepts version 002 without a BIC and trims trailing empty lines', () => {
    const out = girocode({ name: 'Muster GmbH', iban: 'DE89370400440532013000', amount: '149.90' });
    expect(out).toBe('BCD\n002\n1\nSCT\n\nMuster GmbH\nDE89370400440532013000\nEUR149.90');
  });

  it('supports a structured RF creditor reference (ISO 11649)', () => {
    const out = girocode({
      name: 'Muster GmbH',
      iban: 'DE89370400440532013000',
      structuredReference: 'RF18539007547034',
    });
    expect(out).toBe(
      'BCD\n002\n1\nSCT\n\nMuster GmbH\nDE89370400440532013000\nEUR\n\nRF18539007547034'
    );
  });

  it('validates IBAN checksum, BIC, version/BIC rule and reference exclusivity', () => {
    const base = { name: 'Muster GmbH', iban: 'DE89370400440532013000' };
    expect(() => girocode({ ...base, iban: 'DE00370400440532013000' })).toThrow('Invalid IBAN');
    expect(() => girocode({ ...base, bic: 'BAD' })).toThrow('Invalid BIC');
    expect(() => girocode({ ...base, version: '001' })).toThrow('requires a BIC');
    expect(() =>
      girocode({ ...base, structuredReference: 'RF18539007547034', reference: 'inv-1' })
    ).toThrow('not both');
    expect(() => girocode({ ...base, structuredReference: 'RF00BOGUS' })).toThrow(
      'Invalid RF creditor reference'
    );
    expect(() => girocode({ ...base, purpose: 'TOOLONG' })).toThrow('4-character');
    expect(() => girocode({ ...base, amount: '1000000000' })).toThrow('max 999999999.99');
    expect(() => girocode({ ...base, info: 'I'.repeat(71) })).toThrow('70 characters');
    expect(() => girocode({ ...base, name: 'N'.repeat(71) })).toThrow('max 70');
  });

  it('rejects payloads over the 331-byte EPC maximum', () => {
    expect(() =>
      girocode({
        name: 'N'.repeat(70),
        iban: 'DE89370400440532013000',
        bic: 'MARKDEFF',
        amount: '999999999.99',
        purpose: 'CHAR',
        reference: 'R'.repeat(140),
        info: 'I'.repeat(70),
      })
    ).toThrow('331-byte');
  });
});

describe('Zod schemas', () => {
  it('PixQrSchema requires a key for static and a URL for dynamic', () => {
    expect(
      PixQrSchema.safeParse({ mode: 'static', name: 'Loja', city: 'SP', key: 'k@x.com' }).success
    ).toBe(true);
    expect(PixQrSchema.safeParse({ mode: 'static', name: 'Loja', city: 'SP' }).success).toBe(false);
    expect(
      PixQrSchema.safeParse({ mode: 'dynamic', name: 'Loja', city: 'SP', url: 'pix.example.com/a' })
        .success
    ).toBe(true);
    expect(PixQrSchema.safeParse({ mode: 'dynamic', name: 'Loja', city: 'SP' }).success).toBe(
      false
    );
    expect(
      PixQrSchema.safeParse({
        mode: 'dynamic',
        name: 'Loja',
        city: 'SP',
        url: 'https://pix.example.com/a',
      }).success
    ).toBe(false);
  });

  it('UpiIntentSchema validates the VPA and merchant fields', () => {
    expect(UpiIntentSchema.safeParse({ pa: 'shop@bank', pn: 'Shop', mc: '5411' }).success).toBe(
      true
    );
    expect(UpiIntentSchema.safeParse({ pa: 'nope', pn: 'Shop' }).success).toBe(false);
    expect(UpiIntentSchema.safeParse({ pa: 'shop@bank', pn: 'Shop', mc: '99' }).success).toBe(
      false
    );
  });

  it('GirocodeSchema enforces the version-001 BIC rule and reference exclusivity', () => {
    const base = { name: 'Muster GmbH', iban: 'DE89370400440532013000' };
    expect(GirocodeSchema.safeParse(base).success).toBe(true);
    expect(GirocodeSchema.safeParse({ ...base, version: '001' }).success).toBe(false);
    expect(GirocodeSchema.safeParse({ ...base, version: '001', bic: 'MARKDEFF' }).success).toBe(
      true
    );
    expect(
      GirocodeSchema.safeParse({
        ...base,
        structuredReference: 'RF18539007547034',
        reference: 'inv-1',
      }).success
    ).toBe(false);
    expect(GirocodeSchema.safeParse({ ...base, iban: 'bogus' }).success).toBe(false);
  });
});
