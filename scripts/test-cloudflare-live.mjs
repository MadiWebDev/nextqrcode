// scripts/test-cloudflare-live.mjs
// Live production test against Cloudflare Workers deployment

const WORKER_URL = 'https://nextqrcode.testinggacc361.workers.dev';

async function testEndpoint(name, path, options = {}) {
  const url = `${WORKER_URL}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'CloudflareLiveTest/1.0',
        ...(options.headers || {}),
      },
      redirect: 'manual',
    });
    const duration = Date.now() - start;
    const text = await res.text();
    const ok = options.expectedStatus
      ? res.status === options.expectedStatus
      : res.status >= 200 && res.status < 400;

    return {
      name,
      path,
      status: res.status,
      durationMs: duration,
      bodyLength: text.length,
      sample: text.slice(0, 120),
      ok,
    };
  } catch (err) {
    return {
      name,
      path,
      status: 'ERR',
      durationMs: Date.now() - start,
      error: err.message,
      ok: false,
    };
  }
}

async function run() {
  console.log(`Testing Live Cloudflare Deployment: ${WORKER_URL}\n`);

  const testCases = [
    // 1. Static Assets
    { name: 'Robots.txt', path: '/robots.txt', expectedStatus: 200 },
    { name: 'Sitemap.xml', path: '/sitemap.xml', expectedStatus: 200 },
    { name: 'Security.txt', path: '/.well-known/security.txt', expectedStatus: 200 },
    { name: 'Ads.txt', path: '/ads.txt', expectedStatus: 200 },
    { name: 'Favicon', path: '/favicon.ico', expectedStatus: 200 },

    // 2. Core Apex Pages
    { name: 'Live Homepage', path: '/', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Live Tools Hub', path: '/tools', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'About Page', path: '/about', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Contact Page', path: '/contact', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Privacy Policy', path: '/privacy', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Terms of Service', path: '/terms', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },

    // 3. Blog & Content routes
    { name: 'Blog Index', path: '/blog', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Blog Article (how-qr-codes-work)', path: '/blog/how-qr-codes-work', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Scan Guide Index', path: '/scan-guide', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Templates Hub', path: '/templates', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },

    // 4. QR Generators
    { name: 'URL QR Generator', path: '/url-qr-code-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'WiFi QR Generator', path: '/wifi-qr-code-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'vCard QR Generator', path: '/vcard-qr-code-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'WhatsApp QR Generator', path: '/whatsapp-qr-code-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Bulk QR Generator', path: '/bulk-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Barcode Generator', path: '/barcode-generator', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 200 },

    // 5. Removed 410 Policy
    { name: '410 Policy Check', path: '/blog/bitcoin-payment-qr-code-bip21', headers: { Host: 'freeqrcode.tools' }, expectedStatus: 410 },

    // 6. Subdomain Sites via Proxy
    { name: 'Invoice Generator Subdomain', path: '/', headers: { Host: 'invoicegenerator.freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Image Resizer Subdomain', path: '/', headers: { Host: 'imageresizer.freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Social Calendar Subdomain', path: '/', headers: { Host: 'socialcalendar.freeqrcode.tools' }, expectedStatus: 200 },
    { name: 'Resume Builder Subdomain', path: '/', headers: { Host: 'resumebuilder.freeqrcode.tools' }, expectedStatus: 200 },

    // 7. API Endpoints
    { name: 'API QRCodes (unauthenticated list)', path: '/api/qrcodes', expectedStatus: 401 },
    { 
      name: 'API Cards (POST validation)', 
      path: '/api/cards', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name: 'Live Production Test' }), 
      expectedStatus: 200 
    },
    { name: 'API Reports (method validation)', path: '/api/reports', expectedStatus: 405 },
    { name: 'API Uploads Sign (unauthenticated)', path: '/api/uploads/sign', expectedStatus: 401 },

    // 8. Redirects
    { name: '/home to / redirect', path: '/home', expectedStatus: 308 },
  ];

  let passCount = 0;
  let failCount = 0;

  for (const tc of testCases) {
    const res = await testEndpoint(tc.name, tc.path, {
      method: tc.method,
      body: tc.body,
      headers: tc.headers,
      expectedStatus: tc.expectedStatus,
    });
    const mark = res.ok ? '✓ PASS' : '✗ FAIL';
    if (res.ok) passCount++;
    else failCount++;
    console.log(`${mark} [${String(res.status).padEnd(3)}] ${tc.name.padEnd(35)} (${res.durationMs}ms) - len:${res.bodyLength}`);
    if (!res.ok) {
      console.log(`       Expected: ${tc.expectedStatus}, got ${res.status}`);
      if (res.error) console.log(`       Error: ${res.error}`);
      else console.log(`       Sample: ${res.sample.replace(/\s+/g, ' ')}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Live Summary: ${passCount} passed, ${failCount} failed (${testCases.length} total)`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

run();
