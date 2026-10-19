/**
 * Spec-verified regional payment QR payload builders.
 *
 * Companion to `@/lib/qr/payloads` — same conventions (pure functions, Zod
 * input schemas, {@link PayloadError} on invalid input), covering regional
 * instant-payment rails whose formats are defined by their central banks or
 * standards bodies:
 *
 * - **Pix** (Brazil) — BR Code (EMVCo merchant-presented mode), per the
 *   Banco Central do Brasil "Manual de Padrões para Iniciação do Pix".
 * - **UPI merchant intent** (India) — the `upi://pay` deep link with the
 *   merchant parameter set from the NPCI UPI Linking Specification, fired
 *   by the merchant app as an OS intent.
 * - **EPC GiroCode** (Europe) — SEPA credit-transfer payload per
 *   EPC069-12 "Quick Response Code: Guidelines to Enable Data Capture for
 *   the Initiation of a SEPA Credit Transfer".
 *
 * Every constant below comes from the cited spec. Raast (Pakistan) is
 * intentionally NOT implemented here — see
 * `@/data/regional-payment-specs` for the reason.
 */
import { z } from 'zod';
import { PayloadError } from './payloads';

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

const encoder = new TextEncoder();

/** Printable ASCII only, no control characters. */
const PRINTABLE_ASCII_RE = /^[\x20-\x7E]*$/;

function requirePrintableAscii(value: string, field: string): void {
  if (!PRINTABLE_ASCII_RE.test(value))
    throw new PayloadError(`${field} must be printable ASCII (transliterate accented characters)`);
}

/* ------------------------------------------------------------------ */
/* Pix (BR Code / EMVCo)                                               */
/* ------------------------------------------------------------------ */

/** Pix GUI registered with EMVCo for the Banco Central do Brasil. */
const PIX_GUI = 'br.gov.bcb.pix';

/**
 * CRC16-CCITT (polynomial 0x1021, initial value 0xFFFF) rendered as 4
 * uppercase hex characters, per EMVCo MPM §4.7.3 (ISO/IEC 13239) and the
 * BCB BR Code manual. Computed over the payload with the `6304` ID+length
 * of the CRC field appended, excluding the CRC value itself.
 */
function crc16ccitt(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** TLV data object: 2-digit ID + 2-digit length + value. */
function tlv(id: string, value: string): string {
  if (value.length > 99) throw new PayloadError(`BR Code field ${id} exceeds 99 characters`);
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

export interface PixQrInput {
  /**
   * `'static'` — reusable code embedding the chave Pix (field 26,
   * subfield 01); `'dynamic'` — one-time code embedding the PSP receiver
   * URL (field 26, subfield 25). The BCB manual's worked examples put
   * subfield 25 (not 01) inside field 26 for dynamic QR codes.
   */
  mode: 'static' | 'dynamic';
  /** Chave Pix. Required for static QR codes; max 77 characters. */
  key?: string;
  /**
   * PSP receiver URL. Required for dynamic QR codes; max 77 characters,
   * WITHOUT the protocol prefix (always HTTPS per the BCB security
   * manual §4.1).
   */
  url?: string;
  /** Receiver name as registered in the DICT. Max 25 characters. */
  name: string;
  /** Receiver city. Max 15 characters. */
  city: string;
  /** Amount in BRL, e.g. `"123.45"`. Omitted = the payer enters the amount. */
  amount?: string;
  /**
   * Transaction identifier: `"***"` (default, no txid) or 1–25
   * alphanumeric characters.
   */
  txid?: string;
  /** Merchant category code, 4 digits. Default `"0000"` (not informed). */
  mcc?: string;
}

const PIX_AMOUNT_RE = /^\d+(\.\d{1,2})?$/;
const PIX_TXID_RE = /^(\*\*\*|[A-Za-z0-9]{1,25})$/;

/**
 * Build a Pix BR Code payload (Banco Central do Brasil, "Manual de Padrões
 * para Iniciação do Pix", latest version published at
 * https://www.bcb.gov.br/estabilidadefinanceira/pix).
 *
 * Layout (TLV per EMVCo QRCPS merchant-presented mode):
 *
 * - `00` = `"01"` (payload format indicator)
 * - `01` = `"12"` (point of initiation; only for dynamic codes, matching
 *   the manual's dynamic example)
 * - `26` = merchant account info: `00` = `br.gov.bcb.pix`, then `01` =
 *   chave (static) or `25` = PSP URL (dynamic)
 * - `52` = MCC (`"0000"` default), `53` = `"986"` (BRL),
 *   `54` = amount (optional), `58` = `"BR"`
 * - `59` = receiver name (≤25), `60` = receiver city (≤15)
 * - `62` = additional data field containing `05` = txid (`"***"` default)
 * - `63` = CRC16-CCITT over the payload plus the literal `"6304"`
 *
 * "Last reviewed: 2026-10-19". Verified against the manual's worked
 * dynamic example, which ends in `…630464E4` — reproduced byte-for-byte
 * by the unit test below.
 */
export function pixQr(input: PixQrInput): string {
  if (isBlank(input.name) || input.name.trim().length > 25)
    throw new PayloadError('Pix receiver name is required (max 25 characters)');
  if (isBlank(input.city) || input.city.trim().length > 15)
    throw new PayloadError('Pix receiver city is required (max 15 characters)');
  requirePrintableAscii(input.name, 'Pix receiver name');
  requirePrintableAscii(input.city, 'Pix receiver city');

  const mcc = input.mcc ?? '0000';
  if (!/^\d{4}$/.test(mcc)) throw new PayloadError('Pix MCC must be 4 digits');

  let receiver: string;
  if (input.mode === 'static') {
    if (isBlank(input.key) || (input.key as string).length > 77)
      throw new PayloadError('A Pix key (max 77 characters) is required for static QR codes');
    requirePrintableAscii(input.key as string, 'Pix key');
    receiver = tlv('01', input.key as string);
  } else {
    if (isBlank(input.url) || (input.url as string).length > 77)
      throw new PayloadError(
        'A PSP receiver URL (max 77 characters) is required for dynamic QR codes'
      );
    requirePrintableAscii(input.url as string, 'Pix receiver URL');
    if (/:\/\//.test(input.url as string))
      throw new PayloadError('Pix receiver URL must not include the protocol prefix');
    receiver = tlv('25', input.url as string);
  }

  const fields: string[] = [tlv('00', '01')];
  if (input.mode === 'dynamic') fields.push(tlv('01', '12'));
  fields.push(tlv('26', tlv('00', PIX_GUI) + receiver));
  fields.push(tlv('52', mcc));
  fields.push(tlv('53', '986'));
  if (!isBlank(input.amount)) {
    if (!PIX_AMOUNT_RE.test(input.amount as string) || Number(input.amount) <= 0)
      throw new PayloadError('Pix amount must be a positive decimal with up to 2 places');
    fields.push(tlv('54', input.amount as string));
  }
  fields.push(tlv('58', 'BR'));
  fields.push(tlv('59', input.name));
  fields.push(tlv('60', input.city));
  const txid = input.txid ?? '***';
  if (!PIX_TXID_RE.test(txid))
    throw new PayloadError('Pix txid must be "***" or 1-25 alphanumeric characters');
  fields.push(tlv('62', tlv('05', txid)));

  const raw = fields.join('');
  return `${raw}6304${crc16ccitt(`${raw}6304`)}`;
}

/* ------------------------------------------------------------------ */
/* UPI merchant intent deep link                                       */
/* ------------------------------------------------------------------ */

export interface UpiIntentInput {
  /** Payee VPA (`<handle>@<bank>`). */
  pa: string;
  /** Payee name shown on the MPIN screen (mandatory per NPCI). Max 99 chars. */
  pn: string;
  /** Merchant category code (ISO 18245), 4 digits. Optional, P2M. */
  mc?: string;
  /** NPCI transaction ID. */
  tid?: string;
  /** Merchant transaction reference. Max 35 characters. */
  tr?: string;
  /** Transaction note. Max 80 characters. */
  tn?: string;
  /** Amount, decimal with up to 2 places. Omitted = open amount. */
  amount?: string;
  /** Invoice / order confirmation URL. */
  refUrl?: string;
  /** Order URL. */
  url?: string;
  /** Generation mode: `01` static QR, `02` dynamic QR, `04` mobile intent. */
  mode?: '01' | '02' | '04';
  /** NPCI-assigned PSP / bank organisation identifier, 4 digits. */
  orgid?: string;
  /** RSA/ECC signature for verified-merchant flows (UPI 2.0 signed intent). */
  sign?: string;
}

const UPI_VPA_RE = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
const UPI_AMOUNT_RE = /^\d+(\.\d{1,2})?$/;

/**
 * Build an NPCI UPI merchant **intent** deep link: the `upi://pay` URI with
 * the merchant parameter set from the NPCI UPI Linking Specification
 * (pa, pn, mc, tid, tr, tn, am, cu, refUrl, url, mode, orgid, sign).
 *
 * This is the payload a merchant app dispatches via
 * `Intent(Intent.ACTION_VIEW, Uri.parse(uri))` on Android (the "intent
 * call" model — see NPCI circular NPCI/UPI/OC No. 18/2016-17 and PayU's
 * "UPI Intent — Non SDK Flow"), or opens directly on iOS. It differs from
 * {@link buildUpi} in `@/lib/qr/payloads` (the simple collect/P2P form)
 * by carrying the merchant-only fields (`mc`, `tid`, `tr`, `refUrl`,
 * `mode`, `orgid`, `sign`).
 *
 * Sources:
 * - https://www.npci.org.in/uploads/Circular18_Bank_Compliances_to_enbale_UPI_Merchantecosystem_0_2b8c52b989.pdf
 * - https://docs.payu.in/docs/upi-smart-intent-non-sdk-flow
 *
 * "Last reviewed: 2026-10-19".
 */
export function upiIntent(input: UpiIntentInput): string {
  if (!UPI_VPA_RE.test(input.pa)) throw new PayloadError('Invalid UPI ID (pa)');
  if (isBlank(input.pn) || (input.pn as string).length > 99)
    throw new PayloadError('UPI payee name (pn) is required (max 99 characters)');

  const params: string[] = [
    `pa=${encodeURIComponent(input.pa)}`,
    `pn=${encodeURIComponent(input.pn)}`,
  ];
  if (!isBlank(input.mc)) {
    if (!/^\d{4}$/.test(input.mc as string)) throw new PayloadError('UPI mc must be a 4-digit MCC');
    params.push(`mc=${encodeURIComponent(input.mc as string)}`);
  }
  if (!isBlank(input.tid)) params.push(`tid=${encodeURIComponent(input.tid as string)}`);
  if (!isBlank(input.tr)) {
    if (!/^[A-Za-z0-9._-]{1,35}$/.test(input.tr as string))
      throw new PayloadError('UPI tr must be 1-35 alphanumeric characters');
    params.push(`tr=${encodeURIComponent(input.tr as string)}`);
  }
  if (!isBlank(input.amount)) {
    if (!UPI_AMOUNT_RE.test(input.amount as string))
      throw new PayloadError('UPI amount must be a decimal with up to 2 places');
    params.push(`am=${encodeURIComponent(input.amount as string)}`);
  }
  params.push('cu=INR');
  if (!isBlank(input.tn)) {
    if ((input.tn as string).length > 80)
      throw new PayloadError('UPI tn must be 80 characters or less');
    params.push(`tn=${encodeURIComponent(input.tn as string)}`);
  }
  if (!isBlank(input.refUrl)) params.push(`refUrl=${encodeURIComponent(input.refUrl as string)}`);
  if (!isBlank(input.url)) params.push(`url=${encodeURIComponent(input.url as string)}`);
  if (!isBlank(input.mode)) {
    if (!['01', '02', '04'].includes(input.mode as string))
      throw new PayloadError('UPI mode must be 01, 02 or 04');
    params.push(`mode=${input.mode}`);
  }
  if (!isBlank(input.orgid)) {
    if (!/^\d{4}$/.test(input.orgid as string))
      throw new PayloadError('UPI orgid must be 4 digits');
    params.push(`orgid=${encodeURIComponent(input.orgid as string)}`);
  }
  if (!isBlank(input.sign)) params.push(`sign=${encodeURIComponent(input.sign as string)}`);

  return `upi://pay?${params.join('&')}`;
}

/* ------------------------------------------------------------------ */
/* EPC GiroCode                                                        */
/* ------------------------------------------------------------------ */

export interface GirocodeInput {
  /** Beneficiary name. Max 70 characters. */
  name: string;
  /** IBAN (spaces/dashes tolerated). Validated: format + ISO 13616 mod-97. */
  iban: string;
  /**
   * BIC. Mandatory with version `'001'`; optional with `'002'`
   * (BIC optional within the EEA).
   */
  bic?: string;
  /** Amount, e.g. `"149.90"`. Omitted = open amount (`EUR` prefix only). */
  amount?: string;
  /** `'001'` (BIC mandatory) or `'002'` (BIC optional). Default `'002'`. */
  version?: '001' | '002';
  /** 4-character purpose code (e.g. `CHAR`), line 9. */
  purpose?: string;
  /**
   * Structured creditor reference (`RF…`, ISO 11649), line 10.
   * Mutually exclusive with `reference`.
   */
  structuredReference?: string;
  /**
   * Unstructured remittance information (e.g. invoice number), max 140
   * characters, line 11. Mutually exclusive with `structuredReference`.
   */
  reference?: string;
  /** Hint text shown to the payer, max 70 characters, line 12. */
  info?: string;
}

/** Basic IBAN validation: format check plus the ISO 13616 mod-97 checksum. */
function isValidIban(iban: string): boolean {
  const s = iban.replace(/[\s-]+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  return BigInt(numeric) % BigInt(97) === BigInt(1);
}

const BIC_RE = /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;

/** ISO 11649 creditor reference: `RF` + 2 check digits + up to 21 chars, mod-97 valid. */
function isValidCreditorReference(ref: string): boolean {
  const s = ref.toUpperCase();
  if (!/^RF\d{2}[A-Z0-9]{1,21}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  return BigInt(numeric) % BigInt(97) === BigInt(1);
}

/**
 * Build an EPC GiroCode payload per EPC069-12, "Quick Response Code:
 * Guidelines to Enable Data Capture for the Initiation of a SEPA Credit
 * Transfer" (European Payments Council;
 * https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation).
 *
 * The 12 `\n`-separated lines:
 *
 * ```
 * BCD
 * <001|002>
 * 1
 * SCT
 * <bic>
 * <name>
 * <iban>
 * EUR<amount>
 * <purpose>
 * <structured RF reference>
 * <unstructured reference>
 * <info>
 * ```
 *
 * Rules enforced from the standard: IBAN format + mod-97 checksum; BIC
 * mandatory with version `001`, optional with `002`; amount `EUR` +
 * decimal with a dot, max 999999999.99; purpose exactly 4 characters;
 * line 10 OR line 11 (never both); trailing empty lines omitted; whole
 * payload ≤ 331 bytes.
 *
 * This is the structured counterpart to {@link buildSepa} in
 * `@/lib/qr/payloads` (which covers the simple name/IBAN/amount/reason
 * case): it adds version selection, BIC requirement logic, purpose code,
 * structured RF references, the payer-hint line, and the 331-byte cap.
 *
 * "Last reviewed: 2026-10-19".
 */
export function girocode(input: GirocodeInput): string {
  const version = input.version ?? '002';
  if (version !== '001' && version !== '002')
    throw new PayloadError('GiroCode version must be 001 or 002');

  if (isBlank(input.name) || (input.name as string).length > 70)
    throw new PayloadError('GiroCode beneficiary name is required (max 70 characters)');

  if (!isValidIban(input.iban)) throw new PayloadError('Invalid IBAN');

  const bic = isBlank(input.bic) ? '' : (input.bic as string).toUpperCase();
  if (version === '001' && bic === '')
    throw new PayloadError('GiroCode version 001 requires a BIC');
  if (bic !== '' && !BIC_RE.test(bic)) throw new PayloadError('Invalid BIC');

  let amount = '';
  if (!isBlank(input.amount)) {
    if (!/^\d+(\.\d{1,2})?$/.test(input.amount as string) || Number(input.amount) > 999999999.99)
      throw new PayloadError(
        'GiroCode amount must be a decimal with up to 2 places (max 999999999.99)'
      );
    amount = input.amount as string;
  }

  const purpose = input.purpose ?? '';
  if (purpose !== '' && !/^[A-Z]{4}$/.test(purpose))
    throw new PayloadError('GiroCode purpose must be a 4-character code');

  const structured = input.structuredReference ?? '';
  const reference = input.reference ?? '';
  if (structured !== '' && reference !== '')
    throw new PayloadError(
      'GiroCode accepts either a structured reference or an unstructured reference, not both'
    );
  if (structured !== '' && !isValidCreditorReference(structured))
    throw new PayloadError('Invalid RF creditor reference');
  if (reference.length > 140)
    throw new PayloadError('GiroCode reference must be 140 characters or less');

  const info = input.info ?? '';
  if (info.length > 70) throw new PayloadError('GiroCode info must be 70 characters or less');

  const lines = [
    'BCD',
    version,
    '1',
    'SCT',
    bic,
    input.name,
    input.iban.replace(/[\s-]+/g, '').toUpperCase(),
    `EUR${amount}`,
    purpose,
    structured.toUpperCase(),
    reference,
    info,
  ];
  // Trailing empty lines may be omitted.
  while (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();

  const payload = lines.join('\n');
  if (encoder.encode(payload).length > 331)
    throw new PayloadError('GiroCode payload exceeds the 331-byte maximum');
  return payload;
}

/* ------------------------------------------------------------------ */
/* Zod schemas for form / API validation                               */
/* ------------------------------------------------------------------ */

/** Validation schema for the Pix (BR Code) form. */
export const PixQrSchema = z
  .object({
    mode: z.enum(['static', 'dynamic']),
    key: z.string().max(77, 'Pix key must be 77 characters or less').optional().or(z.literal('')),
    url: z.string().max(77, 'URL must be 77 characters or less').optional().or(z.literal('')),
    name: z
      .string()
      .min(1, 'Receiver name is required')
      .max(25, 'Receiver name must be 25 characters or less'),
    city: z
      .string()
      .min(1, 'Receiver city is required')
      .max(15, 'Receiver city must be 15 characters or less'),
    amount: z
      .string()
      .regex(PIX_AMOUNT_RE, 'Amount must be a decimal with up to 2 places')
      .optional()
      .or(z.literal('')),
    txid: z
      .string()
      .regex(PIX_TXID_RE, 'txid must be "***" or 1-25 alphanumeric characters')
      .optional()
      .or(z.literal('')),
    mcc: z
      .string()
      .regex(/^\d{4}$/, 'MCC must be 4 digits')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((v, ctx) => {
    if (v.mode === 'static' && isBlank(v.key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A Pix key is required for static QR codes',
        path: ['key'],
      });
    }
    if (v.mode === 'dynamic' && isBlank(v.url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A PSP receiver URL is required for dynamic QR codes',
        path: ['url'],
      });
    }
    if (!isBlank(v.url) && /:\/\//.test(v.url as string)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The URL must not include the protocol prefix',
        path: ['url'],
      });
    }
  });

/** Validation schema for the UPI merchant intent form. */
export const UpiIntentSchema = z.object({
  pa: z
    .string()
    .min(1, 'UPI ID is required')
    .regex(UPI_VPA_RE, 'Enter a valid UPI ID like name@bank'),
  pn: z
    .string()
    .min(1, 'Payee name is required')
    .max(99, 'Payee name must be 99 characters or less'),
  mc: z
    .string()
    .regex(/^\d{4}$/, 'MCC must be 4 digits')
    .optional()
    .or(z.literal('')),
  tid: z.string().optional(),
  tr: z
    .string()
    .regex(/^[A-Za-z0-9._-]{1,35}$/, 'Reference must be 1-35 alphanumeric characters')
    .optional()
    .or(z.literal('')),
  tn: z.string().max(80, 'Note must be 80 characters or less').optional(),
  amount: z
    .string()
    .regex(UPI_AMOUNT_RE, 'Amount must be a decimal with up to 2 places')
    .optional()
    .or(z.literal('')),
  refUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  mode: z.enum(['01', '02', '04']).optional(),
  orgid: z
    .string()
    .regex(/^\d{4}$/, 'Organisation ID must be 4 digits')
    .optional()
    .or(z.literal('')),
  sign: z.string().optional(),
});

/** Validation schema for the EPC GiroCode form. */
export const GirocodeSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Beneficiary name is required')
      .max(70, 'Beneficiary name must be 70 characters or less'),
    iban: z
      .string()
      .min(1, 'IBAN is required')
      .refine((v) => isValidIban(v), { message: 'Enter a valid IBAN' }),
    bic: z.string().regex(BIC_RE, 'Enter a valid BIC').optional().or(z.literal('')),
    amount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a decimal with up to 2 places')
      .optional()
      .or(z.literal('')),
    version: z.enum(['001', '002']).optional(),
    purpose: z
      .string()
      .regex(/^[A-Z]{4}$/, 'Purpose must be a 4-character code')
      .optional()
      .or(z.literal('')),
    structuredReference: z
      .string()
      .refine((v) => v === '' || isValidCreditorReference(v), {
        message: 'Enter a valid RF creditor reference',
      })
      .optional()
      .or(z.literal('')),
    reference: z.string().max(140, 'Reference must be 140 characters or less').optional(),
    info: z.string().max(70, 'Info must be 70 characters or less').optional(),
  })
  .superRefine((v, ctx) => {
    if ((v.version ?? '002') === '001' && isBlank(v.bic)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Version 001 requires a BIC',
        path: ['bic'],
      });
    }
    if (!isBlank(v.structuredReference) && !isBlank(v.reference)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Use either a structured or an unstructured reference, not both',
        path: ['reference'],
      });
    }
  });
