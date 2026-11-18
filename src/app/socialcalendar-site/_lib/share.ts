import { decryptJson, encryptJson, type EncryptedEnvelope } from './crypto';
import type { Post } from './types';

/**
 * Read-only share links (spec §18). The payload lives entirely in the
 * URL fragment (#…), which browsers never send to a server — so sharing
 * a link transmits nothing to us or anyone else. Payloads are
 * gzip-compressed (CompressionStream) and base64url-encoded.
 *
 * Hard limit: if the encoded fragment would exceed SHARE_MAX_CHARS,
 * encoding refuses and the UI offers a file export instead.
 */

export const SHARE_MAX_CHARS = 180_000;

export interface SharePayload {
  app: 'socialcalendar-share';
  version: 1;
  workspaceName: string;
  timezone: string;
  sharedAt: string;
  posts: Post[];
}

export interface ShareOptions {
  /** Remove internal notes, assignee labels and checklist state. */
  stripPrivate: boolean;
  fromDate?: string;
  toDate?: string;
}

export function buildSharePayload(
  posts: Post[],
  workspaceName: string,
  timezone: string,
  options: ShareOptions,
): SharePayload {
  const selected = posts.filter((p) => {
    if (!p.scheduledAt) return false;
    const date = p.scheduledAt.slice(0, 10);
    if (options.fromDate && date < options.fromDate) return false;
    if (options.toDate && date > options.toDate) return false;
    return true;
  });
  const cleaned = selected.map((p) => {
    if (!options.stripPrivate) return p;
    return {
      ...p,
      internalNotes: '',
      assigneeLabel: '',
      checklist: [],
    };
  });
  return {
    app: 'socialcalendar-share',
    version: 1,
    workspaceName,
    timezone,
    sharedAt: new Date().toISOString(),
    posts: cleaned,
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function compressBytes(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function decompressBytes(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodeSharePayload(payload: SharePayload): Promise<string> {
  const json = JSON.stringify(payload);
  const compressed = await compressBytes(new TextEncoder().encode(json));
  const encoded = bytesToBase64Url(compressed);
  if (encoded.length > SHARE_MAX_CHARS) {
    throw new Error(
      `This selection is too large for a link (${encoded.length.toLocaleString()} characters; limit ${SHARE_MAX_CHARS.toLocaleString()}). Narrow the date range or export a file instead.`,
    );
  }
  return encoded;
}

export async function decodeSharePayload(encoded: string): Promise<SharePayload> {
  const bytes = base64UrlToBytes(encoded);
  const plain = await decompressBytes(bytes);
  const parsed: unknown = JSON.parse(new TextDecoder().decode(plain));
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as SharePayload).app !== 'socialcalendar-share' ||
    !Array.isArray((parsed as SharePayload).posts)
  ) {
    throw new Error('This share link is not a valid Social Media Calendar link.');
  }
  return parsed as SharePayload;
}

export function shareUrl(encoded: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/view#${encoded}`;
}

/* -------- Encrypted share links: fragment = "e." + base64url(envelope JSON) -------- */

export async function encodeEncryptedSharePayload(
  payload: SharePayload,
  password: string,
): Promise<string> {
  const envelope = await encryptJson(JSON.stringify(payload), password);
  return `e.${bytesToBase64Url(new TextEncoder().encode(JSON.stringify(envelope)))}`;
}

export function isEncryptedShare(encoded: string): boolean {
  return encoded.startsWith('e.');
}

export async function decryptSharePayload(
  encoded: string,
  password: string,
): Promise<SharePayload> {
  const envelope = JSON.parse(
    new TextDecoder().decode(base64UrlToBytes(encoded.slice(2))),
  ) as EncryptedEnvelope;
  const json = await decryptJson(envelope, password);
  const parsed: unknown = JSON.parse(json);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as SharePayload).app !== 'socialcalendar-share'
  ) {
    throw new Error('This share link is not a valid Social Media Calendar link.');
  }
  return parsed as SharePayload;
}
