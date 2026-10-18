/**
 * Unit tests for the upload helpers in src/lib/cloudinary.ts:
 * real SVG sanitization behavior and signed-upload parameter shape.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { sanitizeSvg, signUploadParams } from '@/lib/cloudinary';

const CLOUDINARY_ENV_KEYS = [
  'CLOUDINARY_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

const savedEnv: Record<string, string | undefined> = {};

function clearCloudinaryEnv() {
  for (const key of CLOUDINARY_ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
}

function stubCloudinaryEnv() {
  clearCloudinaryEnv();
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-key';
  process.env.CLOUDINARY_API_SECRET = 'test-secret';
}

afterEach(() => {
  for (const key of CLOUDINARY_ENV_KEYS) {
    const value = savedEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe('sanitizeSvg', () => {
  it('removes <script> elements and their content', () => {
    const out = sanitizeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('xss')</script><rect width="10" height="10"/></svg>`
    );
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert');
    expect(out).toContain('<rect');
  });

  it('removes on* event-handler attributes', () => {
    const out = sanitizeSvg(
      `<svg><rect width="10" height="10" onclick="steal()" onload='evil()' fill="red"/></svg>`
    );
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('onload');
    expect(out).toContain('fill="red"');
    expect(out).toContain('<rect');
  });

  it('neutralizes javascript: URIs in href attributes', () => {
    const out = sanitizeSvg(
      `<svg><a href="javascript:alert(1)"><text>click</text></a><a xlink:href="JaVaScRiPt:evil()"><text>also</text></a></svg>`
    );
    expect(out).not.toContain('javascript:');
    expect(out).not.toContain('JaVaScRiPt');
    expect(out).toContain('href="#"');
    expect(out).toContain('<text>click</text>');
  });

  it('keeps legitimate rect, path and text elements', () => {
    const input =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
      `<rect x="1" y="1" width="98" height="98" fill="#fff"/>` +
      `<path d="M10 10h80v80h-80z" fill="#000"/>` +
      `<text x="50" y="50">hello</text></svg>`;
    expect(sanitizeSvg(input)).toBe(input);
  });

  it('removes <foreignObject> elements and their content', () => {
    const out = sanitizeSvg(
      `<svg><rect width="10" height="10"/><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">pwned</div></foreignObject></svg>`
    );
    expect(out).not.toContain('foreignObject');
    expect(out).not.toContain('pwned');
    expect(out).toContain('<rect');
  });

  it('removes <iframe>, <embed> and <object> elements', () => {
    const out = sanitizeSvg(
      `<svg><iframe src="https://evil.example"></iframe><embed src="x"/><object data="y"></object><rect width="5"/></svg>`
    );
    expect(out).not.toContain('<iframe');
    expect(out).not.toContain('<embed');
    expect(out).not.toContain('<object');
    expect(out).toContain('<rect');
  });
});

describe('signUploadParams', () => {
  it('throws a clear error when Cloudinary is not configured', () => {
    clearCloudinaryEnv();
    expect(() => signUploadParams('nextqrcode/u1/logos')).toThrow(/not configured/i);
  });

  it('returns a well-shaped signed payload without network calls', () => {
    stubCloudinaryEnv();
    const before = Math.floor(Date.now() / 1000);
    const params = signUploadParams('nextqrcode/u1/logos');

    expect(params.cloudName).toBe('test-cloud');
    expect(params.apiKey).toBe('test-key');
    expect(params.folder).toBe('nextqrcode/u1/logos');
    expect(params.timestamp).toBeGreaterThanOrEqual(before);
    expect(params.timestamp).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    expect(typeof params.signature).toBe('string');
    expect(params.signature.length).toBeGreaterThan(0);
  });
});
