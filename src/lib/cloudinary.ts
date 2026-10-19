import { v2 as cloudinary } from 'cloudinary';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
}

if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

export { cloudinary };

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'qrcode-tools',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<{ secure_url: string; public_id: string; format: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials not configured in environment variables.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export interface SignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

/**
 * Sign direct-from-browser upload parameters for a folder.
 * Credentials are read at call time; throws a clear error when Cloudinary
 * is not configured (supports CLOUDINARY_URL or the three separate vars).
 */
export function signUploadParams(folder: string): SignedUploadParams {
  if (!folder || typeof folder !== 'string') {
    throw new Error('A non-empty upload folder is required.');
  }

  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL);
      cloudName = cloudName || parsed.hostname;
      apiKey = apiKey || decodeURIComponent(parsed.username);
      apiSecret = apiSecret || decodeURIComponent(parsed.password);
    } catch {
      // Fall through to the explicit error below.
    }
  }

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary API credentials are not configured. Set CLOUDINARY_URL or ' +
        'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.'
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return { cloudName, apiKey, timestamp, folder, signature };
}

// ---------------------------------------------------------------------------
// SVG sanitization (string-based so it runs in any runtime, no DOM needed)
// ---------------------------------------------------------------------------

const SCRIPT_ELEMENT_RE = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
const STYLE_ELEMENT_RE = /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi;
const DANGEROUS_ELEMENT_NAMES = 'iframe|embed|object|foreignobject';
const DANGEROUS_ELEMENT_RE = new RegExp(
  `<(?:${DANGEROUS_ELEMENT_NAMES})\\b[^>]*>[\\s\\S]*?<\\/(?:${DANGEROUS_ELEMENT_NAMES})\\s*>`,
  'gi'
);
const DANGEROUS_SELF_CLOSING_RE = new RegExp(`<(?:${DANGEROUS_ELEMENT_NAMES})\\b[^>]*/>`, 'gi');
// Event-handler attributes such as onclick="..." (quoted or unquoted values).
const EVENT_ATTR_RE = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi;
// href / xlink:href / src attributes, captured with their raw values.
const URI_ATTR_RE = /\s((?:xlink:)?href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

/** Detect a javascript: URI, tolerating case tricks and whitespace smuggling. */
function isJavaScriptUri(rawValue: string): boolean {
  const normalized = rawValue.replace(/[\s\x00-\x1f\x7f]+/g, '').toLowerCase();
  return normalized.startsWith('javascript:');
}

/**
 * Strip executable/dangerous content from an SVG document:
 * - <script> and <style> elements (CSS can carry `url(javascript:)` in legacy engines)
 * - <iframe>, <embed>, <object>, <foreignObject> elements (can host HTML/JS)
 * - on* event-handler attributes
 * - javascript: URIs in href/xlink:href/src (neutralized to "#")
 *
 * Shapes, paths, text and presentation attributes are preserved untouched.
 */
export function sanitizeSvg(svg: string): string {
  let out = svg;

  out = out.replace(SCRIPT_ELEMENT_RE, '');
  out = out.replace(STYLE_ELEMENT_RE, '');
  out = out.replace(DANGEROUS_ELEMENT_RE, '');
  out = out.replace(DANGEROUS_SELF_CLOSING_RE, '');
  out = out.replace(EVENT_ATTR_RE, '');

  out = out.replace(URI_ATTR_RE, (match, attrName: string, rawValue: string) => {
    const value = rawValue.replace(/^["']|["']$/g, '');
    if (isJavaScriptUri(value)) {
      return ` ${attrName}="#"`;
    }
    return match;
  });

  return out;
}
