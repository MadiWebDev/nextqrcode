/**
 * Shareable read-only links (spec §9): the resume is encoded into
 * the URL fragment (#…), which browsers never send to a server, so
 * the link works without any backend or storage. The photo never
 * travels (it lives only in this browser's database); sensitive
 * fields travel only when the user explicitly ticks the box, and the
 * UI says plainly that anyone with the link can read what it carries.
 */
import type { ResumeDoc } from './schema';
import { ResumeDocSchema } from './schema';

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deflate(data: Uint8Array): Promise<Uint8Array | null> {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    return null;
  }
}

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Strip what must not travel and return the shareable document. */
export function shareableDoc(doc: ResumeDoc, includeSensitive: boolean): ResumeDoc {
  return {
    ...doc,
    photo: { ...doc.photo, originalId: undefined, croppedId: undefined, show: false },
    sensitive: includeSensitive
      ? doc.sensitive
      : Object.fromEntries(Object.entries(doc.sensitive).map(([k, v]) => [k, v ? { ...v, include: false } : v])),
  };
}

export async function encodeShareLink(doc: ResumeDoc, includeSensitive: boolean, origin: string): Promise<string> {
  const clean = shareableDoc(doc, includeSensitive);
  const json = JSON.stringify(clean);
  const raw = new TextEncoder().encode(json);
  const deflated = await deflate(raw);
  const payload = deflated ? `v1.d.${toBase64Url(deflated)}` : `v1.r.${toBase64Url(raw)}`;
  return `${origin}/view#${payload}`;
}

export async function decodeShareLink(fragment: string): Promise<ResumeDoc | null> {
  const match = fragment.replace(/^#/, '').match(/^v1\.([dr])\.(.+)$/);
  if (!match) return null;
  try {
    const bytes = fromBase64Url(match[2]);
    const raw = match[1] === 'd' ? await inflate(bytes) : bytes;
    const parsed: unknown = JSON.parse(new TextDecoder().decode(raw));
    const result = ResumeDocSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
