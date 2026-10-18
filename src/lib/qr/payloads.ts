/**
 * Spec-correct QR payload builders.
 *
 * Pure functions — no DOM, no network — so they are safe to call from server
 * components, API routes, and unit tests alike. Every builder throws
 * {@link PayloadError} on invalid input instead of producing a malformed
 * payload. Callers that must degrade gracefully (e.g. `generateQRData`) should
 * catch `PayloadError` and fall back to an empty string.
 */
import { z } from 'zod';

/** Thrown when a payload cannot be built from the given input. */
export class PayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PayloadError';
    // Maintain a correct prototype chain when targeting ES2017.
    Object.setPrototypeOf(this, PayloadError.prototype);
  }
}

/** Escape the characters `\ ; , : "` with a backslash (WiFi / MeCard style). */
function escapeWifi(value: string): string {
  return value.replace(/([\\;:",])/g, '\\$1');
}

const encoder = new TextEncoder();

/**
 * Fold a content line at 75 octets per RFC 6350 §3.2 / RFC 5545 §3.1:
 * continuation lines begin with CRLF followed by a single space.
 */
function foldLine(line: string): string {
  const maxOctets = 75;
  const segments: string[] = [];
  let current = '';
  let currentLen = 0;
  for (const ch of line) {
    const byteLen = encoder.encode(ch).length;
    if (currentLen + byteLen > maxOctets) {
      segments.push(current);
      current = '';
      currentLen = 0;
    }
    current += ch;
    currentLen += byteLen;
  }
  segments.push(current);
  return segments.join('\r\n ');
}

/** Escape a TEXT value per RFC 6350 §3.4 (vCard TEXT escaping). */
function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/** Escape a TEXT value per RFC 5545 §3.3.11 (iCalendar TEXT escaping). */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/** Escape a MeCard field value (`\`, `:`, `;`, `,` get a backslash prefix). */
function escapeMeCard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/([:;,])/g, '\\$1');
}

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Build a WiFi network configuration payload.
 *
 * De-facto standard format (as consumed by zxing / Android / iOS camera):
 * `WIFI:S:<ssid>;T:<enc>;P:<password>;H:true;`. The characters `\ ; , : "`
 * are escaped with a backslash. `P:` is omitted when `encryption` is
 * `'nopass'`; `H:true` appears only for hidden networks. The payload ends
 * with a single trailing `;`.
 */
export function buildWifi(
  ssid: string,
  password: string,
  encryption: 'WPA' | 'WEP' | 'nopass',
  hidden: boolean
): string {
  if (isBlank(ssid)) throw new PayloadError('WiFi SSID is required');
  // Note: an empty password is allowed (the generator form marks it optional);
  // it is encoded as an empty P: field, matching historical behavior.
  const parts: string[] = [`S:${escapeWifi(ssid)}`, `T:${encryption}`];
  if (encryption !== 'nopass') parts.push(`P:${escapeWifi(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};`;
}

export interface VCardInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  org?: string;
  title?: string;
  url?: string;
  address?: string;
}

/**
 * Build an RFC 6350 (vCard 4.0) payload.
 *
 * Emits `BEGIN:VCARD`, `VERSION:4.0`, the populated properties, `END:VCARD`,
 * separated by CRLF. TEXT values escape `\`, `;`, `,` and newlines; every
 * content line is folded at 75 octets (CRLF + single space) per RFC 6350 §3.2.
 */
export function buildVCard(input: VCardInput): string {
  const { firstName = '', lastName = '', phone, email, org, title, url, address } = input;
  if (isBlank(firstName) && isBlank(lastName))
    throw new PayloadError('vCard requires a first name or a last name');
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:4.0'];
  const fn = `${firstName} ${lastName}`.trim().replace(/\s+/g, ' ');
  lines.push(`FN:${escapeVCardText(fn)}`);
  lines.push(`N:${escapeVCardText(lastName)};${escapeVCardText(firstName)};;;`);
  if (!isBlank(phone)) lines.push(`TEL:${escapeVCardText(phone as string)}`);
  if (!isBlank(email)) lines.push(`EMAIL:${escapeVCardText(email as string)}`);
  if (!isBlank(org)) lines.push(`ORG:${escapeVCardText(org as string)}`);
  if (!isBlank(title)) lines.push(`TITLE:${escapeVCardText(title as string)}`);
  if (!isBlank(url)) lines.push(`URL:${escapeVCardText(url as string)}`);
  if (!isBlank(address)) lines.push(`ADR:;;${escapeVCardText(address as string)};;;;`);
  lines.push('END:VCARD');
  return lines.map(foldLine).join('\r\n');
}

export interface MeCardInput {
  name?: string;
  tel?: string;
  email?: string;
  url?: string;
  address?: string;
  nickname?: string;
  birthday?: string;
}

/**
 * Build a MeCard payload (the compact contact format originating with NTT
 * DoCoMo, widely supported by phone cameras): `MECARD:N:...;TEL:...;...;;`.
 * Field values escape `\`, `:`, `;` and `,` with a backslash.
 */
export function buildMeCard(input: MeCardInput): string {
  if (isBlank(input.name)) throw new PayloadError('MeCard requires a name');
  const parts: string[] = [`N:${escapeMeCard(input.name as string)}`];
  if (!isBlank(input.tel)) parts.push(`TEL:${escapeMeCard(input.tel as string)}`);
  if (!isBlank(input.email)) parts.push(`EMAIL:${escapeMeCard(input.email as string)}`);
  if (!isBlank(input.url)) parts.push(`URL:${escapeMeCard(input.url as string)}`);
  if (!isBlank(input.address)) parts.push(`ADR:${escapeMeCard(input.address as string)}`);
  if (!isBlank(input.nickname)) parts.push(`NICKNAME:${escapeMeCard(input.nickname as string)}`);
  if (!isBlank(input.birthday)) parts.push(`BDAY:${escapeMeCard(input.birthday as string)}`);
  return `MECARD:${parts.join(';')};;`;
}

export interface IcsEventInput {
  title: string;
  start: Date | string;
  end?: Date | string;
  location?: string;
  description?: string;
}

function toIcsUtc(date: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `T${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}Z`
  );
}

function toValidDate(value: Date | string, field: string): Date {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) throw new PayloadError(`Invalid ${field} date`);
  return d;
}

/**
 * Build an RFC 5545 iCalendar payload: a `VEVENT` inside a `VCALENDAR`.
 * `start`/`end` accept a `Date` or any string `new Date()` can parse;
 * they are rendered in UTC as `YYYYMMDDTHHMMSSZ`. `UID` is 16 random hex
 * bytes; `DTSTAMP` is the build time. TEXT values escape `\`, `;`, `,`
 * and newlines (as `\n`) per RFC 5545 §3.3.11; lines fold at 75 octets.
 */
export function buildIcsEvent(input: IcsEventInput): string {
  if (isBlank(input.title)) throw new PayloadError('Event title is required');
  const start = toValidDate(input.start, 'start');
  const end = input.end === undefined ? undefined : toValidDate(input.end, 'end');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//nextqrcode//NONSGML QR Event//EN',
    'BEGIN:VEVENT',
    `UID:${randomHex(16)}@nextqrcode`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
  ];
  if (end !== undefined) lines.push(`DTEND:${toIcsUtc(end)}`);
  lines.push(`SUMMARY:${escapeIcsText(input.title)}`);
  if (!isBlank(input.location)) lines.push(`LOCATION:${escapeIcsText(input.location as string)}`);
  if (!isBlank(input.description))
    lines.push(`DESCRIPTION:${escapeIcsText(input.description as string)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(foldLine).join('\r\n');
}

/**
 * Build an RFC 5870 `geo:` URI, e.g. `geo:35.6762,139.6503`.
 */
export function buildGeo(lat: number | string, lng: number | string): string {
  const la = typeof lat === 'string' ? lat.trim() : String(lat);
  const ln = typeof lng === 'string' ? lng.trim() : String(lng);
  if (la === '' || ln === '' || Number.isNaN(Number(la)) || Number.isNaN(Number(ln)))
    throw new PayloadError('Latitude and longitude must be valid numbers');
  return `geo:${la},${ln}`;
}

/**
 * Build a BIP-21 bitcoin URI: `bitcoin:<address>[?amount=&label=&message=]`.
 * `label` and `message` are URL-encoded; `amount` is validated as a decimal
 * BTC amount with at most 8 fractional digits.
 */
export function buildBitcoin(
  address: string,
  amountBtc?: string,
  label?: string,
  message?: string
): string {
  if (isBlank(address)) throw new PayloadError('Bitcoin address is required');
  const params: string[] = [];
  if (!isBlank(amountBtc)) {
    if (!/^\d+(\.\d{1,8})?$/.test(amountBtc as string))
      throw new PayloadError('Bitcoin amount must be a decimal with up to 8 places');
    params.push(`amount=${amountBtc}`);
  }
  if (!isBlank(label)) params.push(`label=${encodeURIComponent(label as string)}`);
  if (!isBlank(message)) params.push(`message=${encodeURIComponent(message as string)}`);
  return `bitcoin:${address}${params.length > 0 ? `?${params.join('&')}` : ''}`;
}

const ETH_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const ETH_AMOUNT_RE = /^\d+(\.\d{1,18})?$/;

/** Convert a decimal ETH string (e.g. "1.5") to wei as a decimal string. */
function ethToWei(amountEth: string): string {
  if (!ETH_AMOUNT_RE.test(amountEth)) throw new PayloadError('Invalid ETH amount');
  const dot = amountEth.indexOf('.');
  const intPart = dot === -1 ? amountEth : amountEth.slice(0, dot);
  const fracPart = dot === -1 ? '' : amountEth.slice(dot + 1);
  const wei = BigInt(intPart) * BigInt(10) ** BigInt(18) + BigInt(fracPart.padEnd(18, '0'));
  return wei.toString();
}

/**
 * Build an EIP-681 ethereum URI: `ethereum:<0xaddress>[@<chainId>][?value=<wei>]`.
 * The address must be `0x` followed by 40 hex chars; a decimal ETH amount is
 * converted to wei with BigInt (1 ETH = 10^18 wei) — no floating point.
 */
export function buildEthereum(address: string, amountEth?: string, chainId?: number): string {
  if (!ETH_ADDRESS_RE.test(address)) throw new PayloadError('Invalid Ethereum address');
  let out = `ethereum:${address}`;
  if (chainId !== undefined) {
    if (!Number.isInteger(chainId) || chainId <= 0) throw new PayloadError('Invalid chain ID');
    out += `@${chainId}`;
  }
  if (!isBlank(amountEth)) out += `?value=${ethToWei(amountEth as string)}`;
  return out;
}

export interface UpiInput {
  pa: string;
  pn?: string;
  amount?: string;
  note?: string;
}

const VPA_RE = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

/**
 * Build an NPCI UPI payment URI: `upi://pay?pa=..&pn=..&am=..&cu=INR&tn=..`.
 * `pa` (the payee VPA) is required and must match the VPA shape
 * `<handle>@<bank>`; `cu` is always `INR`. All parameters are URL-encoded.
 */
export function buildUpi(input: UpiInput): string {
  if (!VPA_RE.test(input.pa)) throw new PayloadError('Invalid UPI ID (pa)');
  const params: string[] = [`pa=${encodeURIComponent(input.pa)}`];
  if (!isBlank(input.pn)) params.push(`pn=${encodeURIComponent(input.pn as string)}`);
  if (!isBlank(input.amount)) {
    if (!/^\d+(\.\d{1,2})?$/.test(input.amount as string))
      throw new PayloadError('UPI amount must be a decimal with up to 2 places');
    params.push(`am=${encodeURIComponent(input.amount as string)}`);
  }
  params.push('cu=INR');
  if (!isBlank(input.note)) params.push(`tn=${encodeURIComponent(input.note as string)}`);
  return `upi://pay?${params.join('&')}`;
}

export interface SepaInput {
  name: string;
  iban: string;
  bic?: string;
  amount?: string;
  reason?: string;
}

/** Basic IBAN validation: format check plus the ISO 13616 mod-97 checksum. */
function isValidIban(iban: string): boolean {
  const s = iban.replace(/[\s-]+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  return BigInt(numeric) % BigInt(97) === BigInt(1);
}

/**
 * Build an EPC069-12 SEPA credit-transfer payload (the "EPC QR code"):
 *
 * ```
 * BCD
 * 002
 * 1
 * SCT
 * <bic>
 * <name>
 * <iban>
 * EUR<amount>
 *
 *
 * <reason>
 * ```
 *
 * Fields are joined with REAL `\n` newlines (U+000A), not literal
 * backslash-n sequences. The IBAN is validated (format + mod-97).
 */
export function buildSepa(input: SepaInput): string {
  if (isBlank(input.name)) throw new PayloadError('SEPA beneficiary name is required');
  if (!isValidIban(input.iban)) throw new PayloadError('Invalid IBAN');
  if (
    !isBlank(input.bic) &&
    !/^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/.test(input.bic as string)
  )
    throw new PayloadError('Invalid BIC');
  if (!isBlank(input.amount) && !/^\d+(\.\d{1,2})?$/.test(input.amount as string))
    throw new PayloadError('SEPA amount must be a decimal with up to 2 places');
  const iban = input.iban.replace(/[\s-]+/g, '').toUpperCase();
  const fields = [
    'BCD',
    '002',
    '1',
    'SCT',
    (input.bic ?? '').toUpperCase(),
    input.name,
    iban,
    `EUR${input.amount ?? ''}`,
    '',
    '',
    input.reason ?? '',
  ];
  return fields.join('\n');
}

/**
 * Build an SMS payload per RFC 5724: `sms:<number>[?body=<encoded>]`.
 */
export function buildSms(number: string, body?: string): string {
  if (isBlank(number)) throw new PayloadError('Phone number is required');
  return `sms:${number}${!isBlank(body) ? `?body=${encodeURIComponent(body as string)}` : ''}`;
}

/**
 * Build a `mailto:` URI per RFC 6068 with URL-encoded subject and body.
 */
export function buildEmail(to: string, subject?: string, body?: string): string {
  if (isBlank(to)) throw new PayloadError('Email address is required');
  const params: string[] = [];
  if (!isBlank(subject)) params.push(`subject=${encodeURIComponent(subject as string)}`);
  if (!isBlank(body)) params.push(`body=${encodeURIComponent(body as string)}`);
  return `mailto:${to}${params.length > 0 ? `?${params.join('&')}` : ''}`;
}

/**
 * Build a `tel:` URI per RFC 3966.
 */
export function buildPhone(number: string): string {
  if (isBlank(number)) throw new PayloadError('Phone number is required');
  return `tel:${number}`;
}

/**
 * Build a WhatsApp Click-to-Chat link (`wa.me`): the phone is reduced to
 * digits only; an optional message becomes the `text` query parameter.
 */
export function buildWhatsapp(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits === '') throw new PayloadError('Phone number is required');
  return `https://wa.me/${digits}${!isBlank(message) ? `?text=${encodeURIComponent(message as string)}` : ''}`;
}

/**
 * Build a Telegram deep link (`t.me`): leading `@` is stripped; an optional
 * message becomes the `text` query parameter.
 */
export function buildTelegram(username: string, message?: string): string {
  const clean = username.replace(/^@/, '').trim();
  if (clean === '') throw new PayloadError('Telegram username is required');
  return `https://t.me/${clean}${!isBlank(message) ? `?text=${encodeURIComponent(message as string)}` : ''}`;
}

/* ------------------------------------------------------------------ */
/* Zod schemas for form / API validation                               */
/* ------------------------------------------------------------------ */

/** Validation schema for the WiFi form. */
export const WifiSchema = z.object({
  ssid: z.string().min(1, 'Network name is required'),
  password: z.string().optional(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean(),
});

/** Validation schema for the vCard form. */
export const VCardSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
    org: z.string().optional(),
    title: z.string().optional(),
    url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    address: z.string().optional(),
  })
  .refine((v) => !isBlank(v.firstName) || !isBlank(v.lastName), {
    message: 'A first name or last name is required',
  });

/** Validation schema for the calendar-event form. */
export const IcsEventSchema = z.object({
  title: z.string().min(1, 'Event name is required'),
  start: z.union([z.date(), z.string().min(1, 'Start is required')]),
  end: z.union([z.date(), z.string()]).optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

/** Validation schema for the UPI form (NPCI VPA shape for `pa`). */
export const UpiSchema = z.object({
  pa: z.string().min(1, 'UPI ID is required').regex(VPA_RE, 'Enter a valid UPI ID like name@bank'),
  pn: z.string().optional(),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a decimal with up to 2 places')
    .optional()
    .or(z.literal('')),
  note: z.string().max(100, 'Note must be 100 characters or less').optional(),
});

/** Validation schema for the SEPA form. */
export const SepaSchema = z.object({
  name: z.string().min(1, 'Beneficiary name is required'),
  iban: z
    .string()
    .min(1, 'IBAN is required')
    .refine((v) => isValidIban(v), { message: 'Enter a valid IBAN' }),
  bic: z
    .string()
    .regex(/^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/, 'Enter a valid BIC')
    .optional()
    .or(z.literal('')),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a decimal with up to 2 places')
    .optional()
    .or(z.literal('')),
  reason: z.string().max(140, 'Reference must be 140 characters or less').optional(),
});

/** Validation schema for the Bitcoin (BIP-21) form. */
export const BitcoinSchema = z.object({
  address: z.string().min(1, 'Bitcoin address is required'),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,8})?$/, 'Amount must be a decimal with up to 8 places')
    .optional()
    .or(z.literal('')),
  label: z.string().optional(),
  message: z.string().optional(),
});

/** Validation schema for the Ethereum (EIP-681) form. */
export const EthereumSchema = z.object({
  address: z.string().regex(ETH_ADDRESS_RE, 'Enter a valid 0x address'),
  amount: z
    .string()
    .regex(ETH_AMOUNT_RE, 'Amount must be a decimal with up to 18 places')
    .optional()
    .or(z.literal('')),
  chainId: z.number().int().positive().optional(),
});
