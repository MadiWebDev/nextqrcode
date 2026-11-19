import type { ResumeStore } from './db';
import { migrateToCurrent } from './migrations';
import type { CoverLetter, ResumeDoc, TrackerItem } from './schema';

/**
 * Backups (spec §5): full export/import as JSON with photos embedded as
 * base64, plus an optional password-protected format —
 * AES-256-GCM, PBKDF2-SHA-256 at 600,000 iterations, random salt + IV
 * per file, versioned header. A forgotten password cannot be recovered;
 * the UI states this before the user sets one.
 */

export const BACKUP_FORMAT = 'resumebuilder-backup';
export const ENCRYPTED_FORMAT = 'resumebuilder-backup-encrypted';
export const PBKDF2_ITERATIONS = 600_000;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: 1;
  exportedAt: string;
  resumes: ResumeDoc[];
  coverLetters: CoverLetter[];
  trackerItems: TrackerItem[];
  photos: Array<{ id: string; resumeId: string; kind: 'original' | 'cropped'; mime: string; base64: string }>;
}

export interface EncryptedBackupFile {
  format: typeof ENCRYPTED_FORMAT;
  version: 1;
  kdf: { name: 'PBKDF2'; hash: 'SHA-256'; iterations: number; salt: string };
  cipher: { name: 'AES-GCM'; iv: string };
  data: string;
}

// ── base64 helpers (browser + Node test runtime) ─────────────────────────────

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  return bytesToBase64(buf);
}

// ── Plain backup ─────────────────────────────────────────────────────────────

export async function buildBackup(store: ResumeStore): Promise<BackupFile> {
  const resumes = await store.listResumes();
  const coverLetters = await store.listCoverLetters();
  const trackerItems = await store.listTrackerItems();
  const photos: BackupFile['photos'] = [];
  // Photos are reachable through each resume's photo refs.
  const photoIds = new Set<string>();
  for (const r of resumes) {
    if (r.photo.originalId) photoIds.add(r.photo.originalId);
    if (r.photo.croppedId) photoIds.add(r.photo.croppedId);
  }
  for (const id of photoIds) {
    const rec = await store.getPhoto(id);
    if (rec) {
      photos.push({
        id: rec.id,
        resumeId: rec.resumeId,
        kind: rec.kind,
        mime: rec.mime,
        base64: await blobToBase64(rec.blob),
      });
    }
  }
  return {
    format: BACKUP_FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    resumes,
    coverLetters,
    trackerItems,
    photos,
  };
}

export function parseBackup(text: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON, so it cannot be a backup.');
  }
  const file = parsed as Partial<BackupFile>;
  if (file.format !== BACKUP_FORMAT || !Array.isArray(file.resumes)) {
    throw new Error('This file is not a Resume Builder backup.');
  }
  return file as BackupFile;
}

/** Import replaces nothing silently: resumes are written by id (same id = explicit overwrite by user action). */
export async function importBackup(store: ResumeStore, file: BackupFile): Promise<{ resumes: number }> {
  let count = 0;
  for (const raw of file.resumes) {
    const doc = migrateToCurrent(raw);
    await store.putResume(doc);
    count += 1;
  }
  for (const letter of file.coverLetters ?? []) {
    await store.putCoverLetter(letter);
  }
  for (const item of file.trackerItems ?? []) {
    await store.putTrackerItem(item);
  }
  for (const photo of file.photos ?? []) {
    const bytes = base64ToBytes(photo.base64);
    await store.putPhoto({
      id: photo.id,
      resumeId: photo.resumeId,
      kind: photo.kind,
      mime: photo.mime,
      blob: new Blob([bytes.buffer as ArrayBuffer], { type: photo.mime }),
      createdAt: Date.now(),
    });
  }
  return { resumes: count };
}

// ── Encrypted backup ─────────────────────────────────────────────────────────

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptBackup(plaintext: string, password: string): Promise<EncryptedBackupFile> {
  if (password.length < 8) {
    throw new Error('Use a password of at least 8 characters.');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    new TextEncoder().encode(plaintext),
  );
  return {
    format: ENCRYPTED_FORMAT,
    version: 1,
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: PBKDF2_ITERATIONS, salt: bytesToBase64(salt) },
    cipher: { name: 'AES-GCM', iv: bytesToBase64(iv) },
    data: bytesToBase64(new Uint8Array(cipherBuf)),
  };
}

export async function decryptBackup(file: EncryptedBackupFile, password: string): Promise<string> {
  if (file.format !== ENCRYPTED_FORMAT) {
    throw new Error('This file is not an encrypted Resume Builder backup.');
  }
  const key = await deriveKey(password, base64ToBytes(file.kdf.salt), file.kdf.iterations);
  try {
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(file.cipher.iv).buffer as ArrayBuffer },
      key,
      base64ToBytes(file.data).buffer as ArrayBuffer,
    );
    return new TextDecoder().decode(plainBuf);
  } catch {
    // AES-GCM authentication failure: wrong password or a damaged file.
    // Deliberately one message for both — and no recovery exists.
    throw new Error(
      'That password did not unlock this backup (or the file is damaged). Encrypted backups cannot be recovered without the password.',
    );
  }
}

export function isEncryptedBackup(text: string): boolean {
  try {
    return (JSON.parse(text) as { format?: string }).format === ENCRYPTED_FORMAT;
  } catch {
    return false;
  }
}
