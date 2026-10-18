import type { QRType } from '@/types';
import { getTypeConfig } from '@/lib/qr-helpers';

/**
 * Per-type metadata for public QR pages (/q/[publicId]).
 *
 * Blurbs are functional descriptions of what each QR type encodes — no
 * marketing claims, no statistics, nothing that needs a primary source.
 * `generatorHref` points at a dedicated generator page when one exists,
 * otherwise the home generator.
 */
export interface QrTypeMeta {
  label: string;
  generatorHref: string;
  blurb: string;
}

const GENERATOR_ROUTES: Partial<Record<QRType, string>> = {
  url: '/url-qr-code-generator',
  wifi: '/wifi-qr-code-generator',
  vcard: '/vcard-qr-code-generator',
  whatsapp: '/whatsapp-qr-code-generator',
  upi: '/upi-qr-code-generator',
  bitcoin: '/bitcoin-qr-code-generator',
};

const BLURBS: Record<QRType, string> = {
  text: 'A Text QR code stores plain written text. Anyone who scans it sees the message directly on their phone — no link, no app, no internet needed.',
  url: 'A URL QR code opens a web page when scanned. It is the most common QR type, used for menus, portfolios, landing pages and anywhere a link needs to work offline-to-online.',
  pdf: 'A PDF QR code links to a PDF document. Scanners open the document in their browser or PDF reader.',
  audio:
    'An Audio QR code links to an audio file or stream. Scanners can listen immediately without downloading an app.',
  whatsapp:
    'A WhatsApp QR code opens a chat with a preset phone number, optionally with a pre-filled message.',
  phone: 'A Phone QR code prompts the scanner to call a phone number with one tap.',
  sms: 'An SMS QR code opens the messaging app with the number and message body pre-filled.',
  email: 'An Email QR code opens the mail app with the recipient, subject and body pre-filled.',
  address: 'An Address QR code encodes a street address so scanners can open it in their maps app.',
  wifi: 'A WiFi QR code shares network credentials. Guests scan it to join the network without typing the password.',
  vcard:
    'A vCard QR code stores contact details in the vCard 4.0 format. Scanners can save the contact straight to their address book.',
  social: 'A Social QR code links to a social media profile or page.',
  video: 'A Video QR code links to a video. Scanners watch it in their browser or video app.',
  image: 'An Image QR code links to an image hosted online.',
  menu: 'A Menu QR code links to a digital menu — widely used by restaurants and cafés.',
  app: 'An App QR code links to an app store listing so scanners can install the app.',
  coupon: 'A Coupon QR code encodes a discount code or links to an offer page.',
  event:
    'An Event QR code stores calendar event details in the iCalendar format, so scanners can add it to their calendar.',
  business_card: 'A Business Card QR code shares professional contact details in a single scan.',
  freelance: 'A Freelancer QR code links to a freelancer profile or portfolio.',
  ecommerce: 'An eCommerce QR code links to an online store or product page.',
  cleaning: 'A Cleaning-service QR code links to booking or service information.',
  logistics: 'A Logistics QR code encodes shipment or tracking references.',
  finance: 'A Finance QR code links to payment or financial service pages.',
  cv: 'A CV QR code links to an online résumé or portfolio.',
  mecard:
    'A MeCard QR code stores compact contact details in the MeCard format, an older alternative to vCard still read by many scanners.',
  geo: 'A Geo QR code encodes latitude and longitude. Scanners open the location in their maps app.',
  telegram: 'A Telegram QR code opens a Telegram chat or channel link.',
  zoom: 'A Zoom QR code encodes a meeting join link.',
  google_meet: 'A Google Meet QR code encodes a video meeting link.',
  teams: 'A Microsoft Teams QR code encodes a meeting join link.',
  youtube: 'A YouTube QR code links to a video or channel.',
  linkedin: 'A LinkedIn QR code links to a LinkedIn profile or company page.',
  spotify: 'A Spotify QR code links to a track, album or playlist.',
  paypal: 'A PayPal QR code links to a PayPal payment page.',
  upi: 'A UPI QR code encodes an Indian UPI payment request with payee address and amount.',
  bitcoin: 'A Bitcoin QR code encodes a BIP-21 payment request with address and optional amount.',
  ethereum: 'An Ethereum QR code encodes an EIP-681 payment request with address and value.',
  sepa: 'A SEPA QR code encodes a European EPC GiroCode bank transfer with IBAN, amount and reference.',
  google_review: 'A Google Review QR code links to a business review page.',
};

/** Fallback for QR types stored before this map existed. */
const FALLBACK_META: QrTypeMeta = {
  label: 'QR Code',
  generatorHref: '/',
  blurb: 'A QR code stores information that any phone camera can read in a single scan.',
};

export function getQrTypeMeta(type: string): QrTypeMeta {
  const t = type as QRType;
  const blurb = (BLURBS as Partial<Record<string, string>>)[t];
  if (!blurb) return FALLBACK_META;
  return {
    label: getTypeConfig(t)?.label ?? t,
    generatorHref: GENERATOR_ROUTES[t] ?? '/',
    blurb,
  };
}
