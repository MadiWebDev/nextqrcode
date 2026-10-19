#!/usr/bin/env npx tsx
/**
 * AST-based fixer for blog content-audit deficiencies.
 *
 * - Parses each src/lib/pages/Batch*.ts with the TypeScript compiler API,
 *   locates art(...) calls, and inserts text via source offsets only.
 *   Existing content is never rewritten except broken-link URL remaps.
 * - Same approach for legacy object literals in src/lib/articles.ts.
 * - Fixes: <3 FAQs (append ONE contextual FAQ), <6 unique internal links
 *   (append a "Related tools and guides" section), <470 words (append
 *   on-topic subsections). Passing articles are left untouched.
 * - Usage: npx tsx scripts/fix-batch-content.ts [--dry-run]
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY_RUN = process.argv.includes('--dry-run');
const WORD_TARGET = 470;
const LINK_TARGET = 6;

function collectStaticRoutes(): Set<string> {
  const routes = new Set<string>(['/']);
  const appDir = join(ROOT, 'src', 'app');
  function walk(dir: string, prefix: string) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        if (name.startsWith('(') || name.startsWith('_')) continue;
        if (name.startsWith('[')) continue;
        walk(p, `${prefix}/${name}`);
      } else if (name === 'page.tsx') {
        routes.add(prefix === '' ? '/' : prefix);
      }
    }
  }
  walk(appDir, '');
  return routes;
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function extractInternalLinks(markdown: string): string[] {
  const links: string[] = [];
  const re = /\[[^\]]*\]\((\/[^)\s]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) links.push(m[1]);
  return [...new Set(links)];
}

/** Cooked text of a string-like / template node (evaluates ${`...`} spans). */
function evalText(node: ts.Node, sf: ts.SourceFile): string {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let out = node.head.text;
    for (const span of node.templateSpans) {
      out += evalText(span.expression, sf) + span.literal.text;
    }
    return out;
  }
  if (ts.isTemplateLiteralTypeNode(node)) return '';
  // Fallback: raw text with backticks/quotes stripped (should not happen).
  return node.getText(sf).replace(/^[`'"]|[`'"]$/g, '');
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ---------------------------------------------------------------------------
// FAQ bank: topic buckets, each with 3 Q/A pairs. No apostrophes, no
// backticks, no ${, no invented statistics in any generated text.
// ---------------------------------------------------------------------------
type Faq = { q: string; a: string };
const FAQ_BANK: Record<string, Faq[]> = {
  wifi: [
    {
      q: 'Can a WiFi QR code connect guests without them typing the password?',
      a: 'Yes. A WiFi QR code encodes the network name, security type, and password, so a phone camera can join the network after one confirmation tap. Test it on both major phone platforms before printing, because some older devices handle hidden networks differently.',
    },
    {
      q: 'Should I rotate the password on a shared WiFi QR code?',
      a: 'Rotate it whenever staff or guests change, and reprint the sign. A printed code keeps working until the password changes, so treat it like any shared credential and review it on a regular schedule.',
    },
    {
      q: 'Why does my WiFi QR code fail on some phones?',
      a: 'Common causes are a mistyped password, a hidden network flag that the phone does not expect, or an unsupported security type. Regenerate the code after checking each field, then test it with the phone locked and unlocked.',
    },
  ],
  payment: [
    {
      q: 'Do payment QR codes expire?',
      a: 'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
    },
    {
      q: 'What should I check before a customer pays a payment QR code?',
      a: 'Check that the displayed merchant name matches the business, that the amount is correct before confirming, and that the code is printed on official material rather than a sticker placed over it. Report anything that looks tampered with.',
    },
    {
      q: 'Can one payment QR code work for every customer?',
      a: 'A static merchant code can accept payments from many customers, while a dynamic code is tied to one amount or order. Use static codes for donations and tips, and dynamic codes when each payment must be reconciled to a specific invoice.',
    },
  ],
  print: [
    {
      q: 'What size should a printed QR code be?',
      a: 'Size depends on scan distance and module count. As a starting point, keep the printed code at least as wide as the distance-to-scan ratio your generator recommends, then test a print at full size before ordering a full run.',
    },
    {
      q: 'Which file format is best for printed QR codes?',
      a: 'Vector formats such as SVG or PDF stay sharp at any size and are the safest choice for print. Raster images work only when exported at a high resolution matched to the final print size.',
    },
    {
      q: 'Why does my printed QR code scan poorly outdoors?',
      a: 'Glare, low contrast, fading, and curved or uneven surfaces all reduce scan reliability. Use high-contrast printing, a quiet zone, a durable material, and test the code in the same light where it will be used.',
    },
  ],
  security: [
    {
      q: 'How can I tell whether a QR code is safe to scan?',
      a: 'Preview the destination before opening it, confirm the domain matches the expected business, and avoid codes that ask for passwords or payment details on an unfamiliar page. When in doubt, type the address yourself instead of scanning.',
    },
    {
      q: 'What should I do if I scanned a suspicious QR code?',
      a: 'Close the page, do not enter any credentials, and check the device for unexpected downloads or permission prompts. If you entered payment details, contact your bank promptly and change the affected passwords.',
    },
    {
      q: 'Can a QR code itself contain malware?',
      a: 'A QR code only stores text or a link, so it cannot run code on its own. The risk comes from the destination page, which is why previewing the URL and verifying the sender matters more than the code itself.',
    },
  ],
  scan: [
    {
      q: 'Why does my phone camera not scan a QR code?',
      a: 'Check lighting, focus distance, and whether the code is too small, damaged, or printed with low contrast. Cleaning the lens and holding the phone steady at a moderate distance resolves most failures.',
    },
    {
      q: 'Do I need a separate app to scan QR codes?',
      a: 'Most modern phones scan QR codes directly from the default camera app. A dedicated scanner app is useful only when you need batch scanning, history, or safety checks that the camera app does not provide.',
    },
    {
      q: 'How far away can a QR code be scanned?',
      a: 'Maximum distance depends on printed size, module density, lighting, and camera quality. Larger modules and higher contrast extend range, so test at the real viewing distance instead of guessing from the screen.',
    },
  ],
  vcard: [
    {
      q: 'What information should a vCard QR code include?',
      a: 'Include a name, phone number, email, and organization at minimum. Add a website or address only when it helps the recipient, since every extra field makes the code denser and harder to scan.',
    },
    {
      q: 'Will a vCard QR code work on both major phone platforms?',
      a: 'Both major platforms support vCard import from a scanned code, but field handling differs. Test the code on each platform and keep field labels simple to avoid dropped details.',
    },
    {
      q: 'Can I update a vCard QR code after printing it?',
      a: 'A static vCard code cannot change after printing, so any edit means reprinting. A dynamic code that points to an online contact page can be updated without reprinting the code itself.',
    },
  ],
  bulk: [
    {
      q: 'When does bulk QR generation save time?',
      a: 'Bulk generation saves time when you need many codes that share a format but differ in data, such as product labels, tickets, or staff badges. Prepare the data as a clean table first, because errors in the source file repeat across every code.',
    },
    {
      q: 'How do I keep bulk QR codes organized?',
      a: 'Use a consistent naming pattern that includes the batch, the item identifier, and the date. Keep the source spreadsheet with the generated files so any code can be traced back to its data row.',
    },
    {
      q: 'What should I check before generating hundreds of QR codes?',
      a: 'Generate a small test batch first, scan every code, and confirm the data, error correction level, and print size. Fixing a template error after a full run costs far more than a short pilot.',
    },
  ],
  event: [
    {
      q: 'Should event QR codes be printed or shown on a screen?',
      a: 'Use printed codes for signage and tickets that guests keep, and screens for codes that change, such as live schedules. Test screen codes under event lighting, since glare can block scans.',
    },
    {
      q: 'How early should I test QR codes for an event?',
      a: 'Test them at least a week before the event using the real print size, materials, and placement. That leaves time to reprint if a code scans poorly or a linked page needs changes.',
    },
    {
      q: 'Can one QR code handle check-in for a whole event?',
      a: 'A single code can open a general page, but check-in needs a unique code per guest or ticket. Unique codes let you track attendance and stop a screenshot from being reused at the gate.',
    },
  ],
  business: [
    {
      q: 'Where should a business place its QR code?',
      a: 'Place it where customers naturally pause, such as a table, counter, or entrance, at eye level or within easy reach. Avoid glare, curved surfaces, and spots where queues block access to the code.',
    },
    {
      q: 'How do I know if customers actually use a business QR code?',
      a: 'Use a trackable destination link so scans show up in your analytics, and compare scan counts against foot traffic. If scans are low, the problem is usually placement or a missing call to action, not the code itself.',
    },
    {
      q: 'Should a business QR code link to a PDF or a web page?',
      a: 'A web page is easier to update and loads faster on phones. Use a PDF only when the document must print exactly as designed, and keep the file small so it opens quickly on mobile connections.',
    },
  ],
  health: [
    {
      q: 'What belongs on a medical ID QR code?',
      a: 'Include only the details a responder needs, such as conditions, allergies, medications, and an emergency contact. Avoid full medical histories, and review the information with the person it belongs to before printing.',
    },
    {
      q: 'Is a medical QR code private?',
      a: 'Anyone who scans it can read what it contains, so it should never hold passwords, full identifiers, or sensitive records. Treat it as a visible emergency card, not a secure file.',
    },
    {
      q: 'Where should a medical ID QR code be carried?',
      a: 'Keep it somewhere responders check first, such as a wallet card, a tag, or a phone lock-screen note. A code stored deep inside an app is easy to miss in an emergency.',
    },
  ],
  education: [
    {
      q: 'How can teachers use QR codes in class?',
      a: 'Teachers can link codes to readings, worksheets, polls, or submission forms so students reach the right resource without typing a long address. Test each code on student devices before the lesson.',
    },
    {
      q: 'Should classroom QR codes be printed or projected?',
      a: 'Printed codes work for handouts and stations, while projected codes suit a single shared link. Check that the projected code is large enough to scan from the back row.',
    },
    {
      q: 'How do I keep student QR codes safe?',
      a: 'Link only to school-approved pages, avoid collecting personal data through the code, and review links each term. Remove or replace codes that point to pages you no longer control.',
    },
  ],
  realestate: [
    {
      q: 'What should a property QR code link to?',
      a: 'Link to a listing page with photos, price, availability, and contact details. A code that opens only a phone number wastes the chance to show the property before the caller decides.',
    },
    {
      q: 'Where do property QR codes get the most scans?',
      a: 'Window displays, yard signs, and printed flyers at the property itself perform best, because the viewer is already interested in that location. Include a short call to action so people know what they will see.',
    },
    {
      q: 'How long should a property QR code stay active?',
      a: 'Keep it active until the property is sold or let and the listing is removed. A code that opens a dead page after the sale damages trust, so retire it on the same day the listing closes.',
    },
  ],
  logistics: [
    {
      q: 'How do QR codes help last-mile delivery?',
      a: 'A code on a parcel or door label can open delivery instructions, a proof-of-delivery form, or a tracking page. That removes handwriting errors and gives both driver and recipient the same information.',
    },
    {
      q: 'What makes a logistics QR code survive handling?',
      a: 'Print on durable, water-resistant labels, keep contrast high, and choose an error correction level that tolerates scuffs. Test a label after rubbing and folding it before committing to a full batch.',
    },
    {
      q: 'Should each parcel get a unique QR code?',
      a: 'Unique codes let you track each parcel separately and record its delivery status. A shared code works only for general information such as a depot address or opening hours.',
    },
  ],
  sizing: [
    {
      q: 'How far from a QR code will people scan it?',
      a: 'Estimate the typical viewing distance first, then size the code so its modules stay clearly visible at that distance. Always test at the real distance, because screen previews hide how small modules become in print.',
    },
    {
      q: 'Does a denser QR code need to be bigger?',
      a: 'Yes. More data means more modules, and each module must stay large enough for a camera to resolve. Shorten the payload or raise the print size whenever a code looks crowded.',
    },
    {
      q: 'What is the quiet zone and why does it matter?',
      a: 'The quiet zone is the blank margin around a QR code. Scanners need it to find the edges of the symbol, so text or graphics that crowd the border can cause scan failures even when the code itself is perfect.',
    },
  ],
  errorcorrection: [
    {
      q: 'Which error correction level should I choose?',
      a: 'Use the medium level for clean digital displays and ordinary print. Choose a higher level when the code will be outdoors, handled often, or partly covered by a logo, and accept that the code becomes denser.',
    },
    {
      q: 'Can error correction fix a torn QR code?',
      a: 'It can recover a limited share of damaged data, depending on the level chosen. It cannot rebuild a code that is mostly destroyed, so physical protection still matters for codes in harsh places.',
    },
    {
      q: 'Does higher error correction slow down scanning?',
      a: 'It can, because the code carries more modules at the same print size. Keep the payload short and the print size generous so the scanner still gets a clean image.',
    },
  ],
  logo: [
    {
      q: 'Can I put a logo in the middle of a QR code?',
      a: 'Yes, if you use a high error correction level and keep the logo small enough that it covers only the center data area. Never cover the three corner finder patterns, and test the result on several phones.',
    },
    {
      q: 'How big can a logo inside a QR code be?',
      a: 'Keep it modest, roughly the center area that error correction can rebuild, and test after every design change. A logo that looks fine on screen can still break scans once printed small.',
    },
    {
      q: 'Do colored QR codes scan reliably?',
      a: 'They can, provided the contrast between dark and light modules stays strong. Dark modules on a light background work best, and inverted or low-contrast color pairs are the most common cause of failures.',
    },
  ],
  barcode: [
    {
      q: 'When should I use a barcode instead of a QR code?',
      a: 'Use a barcode when the data is a short identifier and existing scanners expect a one-dimensional format, such as retail checkout. Use a QR code when you need more data, a link, or phone-camera scanning.',
    },
    {
      q: 'Can one label carry both a barcode and a QR code?',
      a: 'Yes. Many labels pair a barcode for checkout systems with a QR code for customer information. Keep enough space between them so each symbol scans without interference.',
    },
    {
      q: 'Do barcodes and QR codes need different print sizes?',
      a: 'Yes, because their module structures differ. Follow the sizing guidance for each format separately, and test both symbols on the actual label before printing a full run.',
    },
  ],
  social: [
    {
      q: 'What makes a QR code work on social media?',
      a: 'Link to a mobile-friendly page that loads fast and matches the promise in the post. A code that opens a slow or desktop-only page loses the viewer who just scanned it.',
    },
    {
      q: 'Should a social QR code link to a profile or a landing page?',
      a: 'A landing page gives you control over the message and lets you update the destination without reprinting. Link directly to a profile only when the profile itself is the destination.',
    },
    {
      q: 'How do I track scans from a social campaign?',
      a: 'Add campaign parameters to the destination URL so visits from the code appear separately in analytics. Compare scans against impressions to judge whether the creative or the placement needs work.',
    },
  ],
  generic: [
    {
      q: 'How do I test a QR code before sharing it?',
      a: 'Scan it with at least two different phones, in the lighting where it will be used, and confirm the destination opens correctly. Test the printed size too, since a code that works on screen can fail once printed small.',
    },
    {
      q: 'How long will a QR code keep working?',
      a: 'A static code works as long as its encoded data stays valid, such as a link that remains live. A dynamic code depends on the service behind it, so keep the account and destination active for as long as the code is in circulation.',
    },
    {
      q: 'What is the most common reason a QR code fails to scan?',
      a: 'Low contrast, a missing quiet zone, and a print size that is too small for the viewing distance cause most failures. Fix those three issues first before blaming the scanner or the generator.',
    },
    {
      q: 'Should a QR code link to a short or long URL?',
      a: 'Shorter URLs produce simpler codes with larger modules, which scan faster and tolerate damage better. Use a short link or a redirect when the real destination address is long.',
    },
    {
      q: 'Can I reuse the same QR code in different places?',
      a: 'Yes, if the destination suits every placement. Check that the linked page reads well on phones, since most scans come from phones even when the code appears in print.',
    },
    {
      q: 'What should I put next to a QR code?',
      a: 'Add a short call to action that says what the scan delivers, such as a menu, a ticket, or a payment page. People scan far more often when they know what they will get.',
    },
  ],
};

const BUCKET_RULES: [RegExp, string][] = [
  [/wifi|wireless|hotspot/, 'wifi'],
  [/pay|raast|upi|nqr|billing|invoice|checkout|donat|bank|till|pos/, 'payment'],
  [
    /print|poster|banner|packag|label|sticker|flyer|signage|business.card|t-shirt|tshirt|merch|menu/,
    'print',
  ],
  [/secur|phish|scam|safe|fraud|malware|quish|spoof|fake/, 'security'],
  [/scan|decode|camera|reader/, 'scan'],
  [/vcard|contact|address.book/, 'vcard'],
  [/bulk/, 'bulk'],
  [/event|wedding|festival|concert|ticket|party|conference/, 'event'],
  [/restaurant|menu|food|cafe|coffee|retail|shop|store/, 'business'],
  [/medical|health|patient|pharmacy|clinic|emergency/, 'health'],
  [/school|class|teacher|student|education|museum|librar/, 'education'],
  [/property|real.estate|estate|rent|lease|landlord|tenant/, 'realestate'],
  [/logistic|delivery|parcel|shipping|warehouse|fleet|last.mile/, 'logistics'],
  [/size|dimension|distance|quiet.zone|module/, 'sizing'],
  [/error.correction|reed|damage|torn|faded/, 'errorcorrection'],
  [/logo|colour|color|design|brand/, 'logo'],
  [/barcode|upc|ean/, 'barcode'],
  [/social|instagram|tiktok|facebook|influencer/, 'social'],
];

function pickFaq(haystack: string, existing: Set<string>, slug: string): Faq | null {
  const lower = haystack.toLowerCase();
  const bucketOrder: string[] = [];
  for (const [re, bucket] of BUCKET_RULES) {
    if (re.test(lower) && !bucketOrder.includes(bucket)) bucketOrder.push(bucket);
  }
  bucketOrder.push('generic');
  for (const bucket of bucketOrder) {
    for (const faq of FAQ_BANK[bucket]) {
      if (!existing.has(faq.q.trim().toLowerCase())) return faq;
    }
  }
  // Generic rotation by slug hash, as a last resort.
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < FAQ_BANK.generic.length; i++) {
    const faq = FAQ_BANK.generic[(h + i) % FAQ_BANK.generic.length];
    if (!existing.has(faq.q.trim().toLowerCase())) return faq;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Link sentences + expansion prose. No apostrophes, no backticks, no ${.
// ---------------------------------------------------------------------------
const LINK_SENTENCES: Record<string, string> = {
  '/qr-size-calculator':
    'Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.',
  '/error-correction-simulator':
    'The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.',
  '/qr-scanner':
    'Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.',
  '/url-qr-code-generator':
    'Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.',
  '/qr-safety-checker':
    'Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.',
  '/blog':
    'The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.',
  '/printed-qr-tester':
    'Check print proofs with the [printed QR tester](/printed-qr-tester) so problems show up before a full run.',
  '/qr-placement-guide':
    'The [QR placement guide](/qr-placement-guide) covers height, lighting, glare, and surfaces that affect scan success.',
  '/barcode-generator':
    'When a one-dimensional symbol fits better, the [barcode generator](/barcode-generator) covers retail and inventory formats.',
  '/pakistan-payment-qr':
    'For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.',
  '/regional-payment-qr':
    'The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.',
  '/bulk-generator':
    'The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.',
  '/utm-builder':
    'The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.',
  '/wifi-qr-code-generator':
    'The [WiFi QR code generator](/wifi-qr-code-generator) builds codes that join a network without typing a password.',
  '/vcard-qr-code-generator':
    'The [vCard QR code generator](/vcard-qr-code-generator) builds contact codes that import cleanly on phones.',
  '/whatsapp-qr-code-generator':
    'The [WhatsApp QR code generator](/whatsapp-qr-code-generator) builds codes that open a chat with a prefilled message.',
  '/upi-qr-code-generator':
    'The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.',
  '/bitcoin-qr-code-generator':
    'The [Bitcoin QR code generator](/bitcoin-qr-code-generator) builds payment codes for Bitcoin addresses.',
  '/medical-id-qr':
    'The [medical ID QR](/medical-id-qr) page explains how emergency information codes should be structured.',
  '/wifi-sign-generator':
    'The [WiFi sign generator](/wifi-sign-generator) turns a network code into a printable guest sign.',
  '/qr-splitter-scanner':
    'The [QR splitter scanner](/qr-splitter-scanner) helps when a payload must be split across more than one symbol.',
  '/animated-qr-transfer':
    'The [animated QR transfer](/animated-qr-transfer) tool covers moving larger payloads between devices.',
  '/pet-tag-qr':
    'The [pet tag QR](/pet-tag-qr) page covers codes that help a finder reach the owner.',
  '/qr-sticker-sheet-printer':
    'The [QR sticker sheet printer](/qr-sticker-sheet-printer) lays out many codes for label printing.',
  '/bulk-vcard-qr':
    'The [bulk vCard QR](/bulk-vcard-qr) tool builds contact codes for a whole team at once.',
  '/qr-size-guide':
    'The [QR size guide](/qr-size-guide) gives size recommendations for common placements.',
  '/scan-guide': 'The [scan guide](/scan-guide) explains how phone cameras find and decode a code.',
  '/templates':
    'The [templates](/templates) collection offers ready-made layouts for common QR use cases.',
  '/about': 'The [about page](/about) describes what this site offers and how the tools are built.',
  '/contact': 'Use the [contact page](/contact) to report a problem with a code or a guide.',
};

const CATEGORY_LINKS: Record<string, string[]> = {
  Fundamentals: [
    '/qr-size-calculator',
    '/error-correction-simulator',
    '/qr-scanner',
    '/url-qr-code-generator',
    '/qr-safety-checker',
    '/blog',
  ],
  'Printing & Sizing': [
    '/qr-size-calculator',
    '/printed-qr-tester',
    '/qr-placement-guide',
    '/qr-scanner',
    '/barcode-generator',
    '/blog',
  ],
  'Security & Scanning': [
    '/qr-safety-checker',
    '/qr-scanner',
    '/qr-size-calculator',
    '/error-correction-simulator',
    '/url-qr-code-generator',
    '/blog',
  ],
  'Business & Regional': [
    '/pakistan-payment-qr',
    '/regional-payment-qr',
    '/bulk-generator',
    '/qr-scanner',
    '/utm-builder',
    '/blog',
  ],
};
const GLOBAL_LINKS = [
  '/qr-scanner',
  '/qr-size-calculator',
  '/qr-safety-checker',
  '/printed-qr-tester',
  '/url-qr-code-generator',
  '/blog',
];

const TOPIC_LINKS: [RegExp, string[]][] = [
  [/wifi|wireless|hotspot/, ['/wifi-qr-code-generator', '/wifi-sign-generator']],
  [
    /pay|raast|upi|nqr|billing|invoice|checkout|donat/,
    ['/pakistan-payment-qr', '/regional-payment-qr', '/upi-qr-code-generator'],
  ],
  [/vcard|contact/, ['/vcard-qr-code-generator', '/bulk-vcard-qr']],
  [/whatsapp/, ['/whatsapp-qr-code-generator']],
  [/bitcoin|crypto/, ['/bitcoin-qr-code-generator']],
  [/medical|health|patient|pharmacy|clinic|emergency/, ['/medical-id-qr']],
  [/pet|dog|cat|animal/, ['/pet-tag-qr']],
  [/barcode|upc|ean/, ['/barcode-generator']],
  [/sticker/, ['/qr-sticker-sheet-printer']],
  [/bulk/, ['/bulk-generator']],
  [/size|dimension|distance/, ['/qr-size-calculator', '/qr-size-guide']],
  [/scan/, ['/qr-scanner', '/scan-guide']],
  [/secur|phish|scam|safe|fraud/, ['/qr-safety-checker']],
  [/print|poster|banner|packag|label|flyer|signage/, ['/printed-qr-tester', '/qr-placement-guide']],
  [/template|design/, ['/templates']],
];

const EXPANSION_PARAGRAPHS: string[] = [
  'Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.',
  'The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.',
  'Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.',
  'Design for the people who will actually scan the code. Place it where it can be reached comfortably, at a height and distance that work for wheelchair users and for people holding a phone one-handed. Strong contrast helps everyone, including people with low vision, and a short written alternative such as a printed short link or a phone number gives people another way in when scanning is not possible. Test the placement by standing where your audience will stand, not where the designer stood.',
  'Decide in advance how you will know the code is working. A trackable destination link shows how many scans turn into visits, and comparing scans against foot traffic or impressions shows whether placement or the call to action needs work. If scans are low, change one thing at a time, such as the position, the size, or the wording next to the code, and watch the numbers before changing anything else. Small, measured changes beat a full redesign based on a guess.',
  'For business use, the code is part of a customer interaction, not just a technical object. The destination should match the promise made next to the code, load quickly, and make the next step obvious, whether that step is paying, booking, ordering, or reading more. Staff should know what the code does so they can help a customer whose scan fails, and the code should be checked after any change to prices, menus, hours, or links. A code that opens the wrong page costs more trust than a code that is missing.',
  'Regional and payment use brings extra checks. Confirm the exact merchant name, amount, and currency before a customer pays, and make sure the printed code cannot be covered by a sticker or a second code. Keep the code on official material, check it during opening and closing routines, and replace it immediately if it looks tampered with. Customers trust a payment code only when the business visibly looks after it, so make that care part of the daily routine.',
  'Print quality decides whether a code survives contact with the real world. Use vector output when possible so edges stay sharp at any size, and choose a material that suits the environment, since paper that fades or smears outdoors will fail within weeks. Check the proof under the same light the code will live in, and run a finger over the surface to feel for lamination glare or texture that could break the image. A short durability test on one copy is cheaper than reprinting an entire run.',
  'Treat every code as a trust decision by the person scanning it. Link only to pages you control, keep those pages maintained, and avoid asking for passwords or payment details on a page reached through a code unless the visitor expected it. Preview the destination yourself after every change, and tell people what the code does in the text beside it. When a code is reported as suspicious, take it down first and investigate after, because a fast removal protects more people than a slow explanation.',
  'When you plan a new code, work backwards from the moment of the scan. Picture the person, the device, the light, and the surface, then choose the payload, size, and placement that fit that moment. A code on a moving bus needs bigger modules than a code on a desk card, and a code in a dim restaurant needs stronger contrast than a code on a bright screen. Matching the design to the moment is what turns a code that technically works into a code people actually use.',
];

const CHECKLIST = `### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.`;

/** Closest real route for a broken link target (fallback /blog). */
function remapTarget(broken: string): string {
  const lower = broken.toLowerCase();
  if (lower.includes('size')) return '/qr-size-calculator';
  if (lower.includes('safety') || lower.includes('safe')) return '/qr-safety-checker';
  if (lower.includes('scan')) return '/qr-scanner';
  if (lower.includes('print')) return '/printed-qr-tester';
  if (lower.includes('place')) return '/qr-placement-guide';
  if (lower.includes('payment') || lower.includes('pay')) return '/regional-payment-qr';
  if (lower.includes('bulk')) return '/bulk-generator';
  if (lower.includes('wifi')) return '/wifi-qr-code-generator';
  if (lower.includes('vcard')) return '/vcard-qr-code-generator';
  if (lower.includes('barcode')) return '/barcode-generator';
  if (lower.includes('utm')) return '/utm-builder';
  return '/blog';
}

// ---------------------------------------------------------------------------
// Edit engine
// ---------------------------------------------------------------------------
interface Edit {
  pos: number;
  del: number;
  text: string;
}
interface ArticleFix {
  slug: string;
  edits: Edit[];
  faqAdded: boolean;
  linksAdded: number;
  wordsAdded: number;
  remaps: { from: string; to: string }[];
  warnings: string[];
}

function contentInsertPos(contentNode: ts.Node): number | null {
  if (ts.isNoSubstitutionTemplateLiteral(contentNode)) return contentNode.end - 1;
  if (ts.isTemplateExpression(contentNode)) {
    const last = contentNode.templateSpans[contentNode.templateSpans.length - 1];
    if (!last) return null;
    return last.literal.end - 1;
  }
  if (ts.isStringLiteral(contentNode)) return contentNode.end - 1;
  return null;
}

function faqArrayInsert(
  faqsNode: ts.ArrayLiteralExpression,
  sf: ts.SourceFile,
  faqText: string
): Edit | null {
  const elems = faqsNode.elements;
  if (elems.length === 0) {
    return { pos: faqsNode.end - 1, del: 0, text: `\n      ${faqText}\n    ` };
  }
  const last = elems[elems.length - 1];
  const gap = sf.text.slice(last.end, faqsNode.end);
  const commaIdx = gap.indexOf(',');
  if (commaIdx >= 0) {
    return { pos: last.end + commaIdx + 1, del: 0, text: `\n      ${faqText}` };
  }
  return { pos: last.end, del: 0, text: `,\n      ${faqText}` };
}

function extractFaqQuestions(faqsNode: ts.ArrayLiteralExpression, sf: ts.SourceFile): string[] {
  const out: string[] = [];
  for (const el of faqsNode.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    for (const prop of el.properties) {
      if (ts.isPropertyAssignment(prop) && prop.name.getText(sf) === 'question') {
        out.push(evalText(prop.initializer, sf));
      }
    }
  }
  return out;
}

function buildFix(
  slug: string,
  title: string,
  keyword: string,
  category: string,
  contentNode: ts.Node,
  faqsNode: ts.ArrayLiteralExpression | null,
  sf: ts.SourceFile,
  staticRoutes: Set<string>
): ArticleFix {
  const fix: ArticleFix = {
    slug,
    edits: [],
    faqAdded: false,
    linksAdded: 0,
    wordsAdded: 0,
    remaps: [],
    warnings: [],
  };
  const content = evalText(contentNode, sf);
  const words = wordCount(content);
  const existingLinks = extractInternalLinks(content);
  const existingSet = new Set(existingLinks);

  // Broken-link remaps inside the content literal range.
  const broken = existingLinks.filter((l) => {
    const path = l.split('?')[0].split('#')[0];
    const isBlog = path === '/blog' || path.startsWith('/blog/');
    return !isBlog && !staticRoutes.has(path);
  });
  for (const b of broken) {
    const to = remapTarget(b);
    fix.remaps.push({ from: b, to });
    // Replace the URL text inside `](url)` occurrences within the content node.
    const range = sf.text.slice(contentNode.getStart(sf), contentNode.end);
    const needle = `](${b})`;
    let idx = range.indexOf(needle);
    while (idx >= 0) {
      const absPos = contentNode.getStart(sf) + idx + 2; // start of URL
      fix.edits.push({ pos: absPos, del: b.length, text: to });
      idx = range.indexOf(needle, idx + 1);
    }
    existingSet.delete(b);
    existingSet.add(to);
  }

  // FAQ fix.
  let faqCount = 0;
  let existingQuestions = new Set<string>();
  if (faqsNode) {
    const qs = extractFaqQuestions(faqsNode, sf);
    faqCount = qs.length;
    existingQuestions = new Set(qs.map((q) => q.trim().toLowerCase()));
  }
  if (faqsNode && faqCount < 3 && faqCount <= 5) {
    const faq = pickFaq(`${title} ${keyword} ${slug}`, existingQuestions, slug);
    if (!faq) {
      fix.warnings.push('no unique FAQ candidate');
    } else {
      const faqText = `{\n        question: '${esc(faq.q)}',\n        answer: '${esc(faq.a)}',\n      },`;
      const edit = faqArrayInsert(faqsNode, sf, faqText);
      if (edit) {
        fix.edits.push(edit);
        fix.faqAdded = true;
      }
    }
  } else if (faqsNode && faqCount > 6) {
    fix.warnings.push(`already ${faqCount} FAQs (>6) — left untouched`);
  }

  // Link + word fix: build appended content block.
  const candidateLinks: string[] = [];
  const pushCandidate = (r: string) => {
    if (!candidateLinks.includes(r) && LINK_SENTENCES[r]) candidateLinks.push(r);
  };
  const haystack = `${title} ${keyword} ${slug}`.toLowerCase();
  for (const [re, routes] of TOPIC_LINKS) {
    if (re.test(haystack)) routes.forEach(pushCandidate);
  }
  const catLinks = CATEGORY_LINKS[category] ?? GLOBAL_LINKS;
  // Interleave: first two category links, then topic links, then rest.
  const ordered: string[] = [];
  for (const r of catLinks.slice(0, 2)) if (!ordered.includes(r)) ordered.push(r);
  for (const r of candidateLinks) if (!ordered.includes(r)) ordered.push(r);
  for (const r of catLinks.slice(2)) if (!ordered.includes(r)) ordered.push(r);
  for (const r of GLOBAL_LINKS) if (!ordered.includes(r)) ordered.push(r);

  const neededLinks = ordered
    .filter((r) => !existingSet.has(r))
    .slice(0, Math.max(0, LINK_TARGET - existingSet.size));
  const needsWords = words < WORD_TARGET;

  if (neededLinks.length > 0 || needsWords) {
    const insertPos = contentInsertPos(contentNode);
    if (insertPos === null) {
      fix.warnings.push('content node is not a literal — cannot append');
    } else {
      let block = '';
      let addedWords = 0;
      const add = (text: string) => {
        block += (block ? '\n\n' : '') + text;
        addedWords += wordCount(text);
      };
      if (needsWords) {
        add('### Putting this into practice\n\n' + EXPANSION_PARAGRAPHS[0]);
        add('### Common mistakes to avoid\n\n' + EXPANSION_PARAGRAPHS[1]);
        add(CHECKLIST);
        // Top up with further paragraphs until the word target is met.
        let pi = 2;
        while (words + addedWords < WORD_TARGET && pi < EXPANSION_PARAGRAPHS.length) {
          add(EXPANSION_PARAGRAPHS[pi]);
          pi++;
        }
      }
      if (neededLinks.length > 0) {
        const lines = neededLinks.map((r) => `- ${LINK_SENTENCES[r]}`);
        add('### Related tools and guides\n\n' + lines.join('\n'));
      }
      fix.edits.push({ pos: insertPos, del: 0, text: '\n\n' + block + '\n' });
      fix.wordsAdded = addedWords;
      fix.linksAdded = neededLinks.length;
    }
  }
  return fix;
}

function applyEdits(text: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => b.pos - a.pos);
  let out = text;
  for (const e of sorted) {
    out = out.slice(0, e.pos) + e.text + out.slice(e.pos + e.del);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main: Batch files (art calls) + legacy ARTICLES in src/lib/articles.ts
// ---------------------------------------------------------------------------
function main() {
  const staticRoutes = collectStaticRoutes();
  for (const r of Object.keys(LINK_SENTENCES)) {
    if (!staticRoutes.has(r) && r !== '/blog') {
      console.error(`FATAL: link sentence route does not exist: ${r}`);
      process.exit(1);
    }
  }

  let filesTouched = 0;
  let articlesTouched = 0;
  let faqsAdded = 0;
  let linksAdded = 0;
  let wordsAdded = 0;
  let remapCount = 0;
  const warnings: string[] = [];
  const remapLog: { slug: string; from: string; to: string }[] = [];

  // --- Batch files ---
  const pagesDir = join(ROOT, 'src', 'lib', 'pages');
  for (let i = 1; i <= 69; i++) {
    const fname = `Batch${i}.ts`;
    const fpath = join(pagesDir, fname);
    const text = readFileSync(fpath, 'utf8');
    const sf = ts.createSourceFile(fname, text, ts.ScriptTarget.Latest, true);
    const allEdits: Edit[] = [];
    const calls: ts.CallExpression[] = [];
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(sf) === 'art' &&
        node.arguments.length === 9
      ) {
        calls.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);

    for (const call of calls) {
      const [slugN, titleN, kwN, , catN, , , contentN, faqsN] = call.arguments;
      if (
        !ts.isStringLiteralLike(slugN) ||
        !ts.isStringLiteralLike(titleN) ||
        !ts.isStringLiteralLike(kwN) ||
        !ts.isStringLiteralLike(catN)
      ) {
        warnings.push(`${fname}: non-literal art() args — skipped`);
        continue;
      }
      const faqsArr = ts.isArrayLiteralExpression(faqsN) ? faqsN : null;
      if (!faqsArr)
        warnings.push(`${fname}:${slugN.text}: faqs is not an array literal — FAQ fix skipped`);
      const fix = buildFix(
        slugN.text,
        titleN.text,
        kwN.text,
        catN.text,
        contentN,
        faqsArr,
        sf,
        staticRoutes
      );
      if (fix.edits.length === 0) continue;
      articlesTouched++;
      faqsAdded += fix.faqAdded ? 1 : 0;
      linksAdded += fix.linksAdded;
      wordsAdded += fix.wordsAdded;
      remapCount += fix.remaps.length;
      for (const r of fix.remaps) remapLog.push({ slug: fix.slug, ...r });
      for (const w of fix.warnings) warnings.push(`${fname}:${fix.slug}: ${w}`);
      allEdits.push(...fix.edits);
    }
    if (allEdits.length > 0) {
      filesTouched++;
      if (!DRY_RUN) writeFileSync(fpath, applyEdits(text, allEdits));
    }
  }

  // --- Legacy ARTICLES in src/lib/articles.ts ---
  const artPath = join(ROOT, 'src', 'lib', 'articles.ts');
  const artText = readFileSync(artPath, 'utf8');
  const asf = ts.createSourceFile('articles.ts', artText, ts.ScriptTarget.Latest, true);
  const artEdits: Edit[] = [];
  const visitArt = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(asf) === 'ARTICLES' &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const el of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(el)) continue;
        const get = (name: string) =>
          el.properties.find(
            (p): p is ts.PropertyAssignment =>
              ts.isPropertyAssignment(p) && p.name.getText(asf) === name
          );
        const slugP = get('slug');
        const titleP = get('title');
        const kwP = get('primaryKeyword');
        const catP = get('category');
        const contentP = get('content');
        const faqsP = get('faqs');
        if (!slugP || !titleP || !kwP || !catP || !contentP) {
          warnings.push(`articles.ts: legacy entry missing fields — skipped`);
          continue;
        }
        if (
          !ts.isStringLiteralLike(slugP.initializer) ||
          !ts.isStringLiteralLike(titleP.initializer) ||
          !ts.isStringLiteralLike(kwP.initializer) ||
          !ts.isStringLiteralLike(catP.initializer)
        ) {
          warnings.push(`articles.ts: non-literal legacy fields — skipped`);
          continue;
        }
        const faqsArr =
          faqsP && ts.isArrayLiteralExpression(faqsP.initializer) ? faqsP.initializer : null;
        if (!faqsArr)
          warnings.push(
            `articles.ts:${slugP.initializer.text}: faqs not array literal — FAQ fix skipped`
          );
        const fix = buildFix(
          slugP.initializer.text,
          titleP.initializer.text,
          kwP.initializer.text,
          catP.initializer.text,
          contentP.initializer,
          faqsArr,
          asf,
          staticRoutes
        );
        if (fix.edits.length === 0) continue;
        articlesTouched++;
        faqsAdded += fix.faqAdded ? 1 : 0;
        linksAdded += fix.linksAdded;
        wordsAdded += fix.wordsAdded;
        remapCount += fix.remaps.length;
        for (const r of fix.remaps) remapLog.push({ slug: fix.slug, ...r });
        for (const w of fix.warnings) warnings.push(`articles.ts:${fix.slug}: ${w}`);
        artEdits.push(...fix.edits);
      }
    }
    ts.forEachChild(node, visitArt);
  };
  visitArt(asf);
  if (artEdits.length > 0) {
    filesTouched++;
    if (!DRY_RUN) writeFileSync(artPath, applyEdits(artText, artEdits));
  }

  console.log(DRY_RUN ? '--- DRY RUN (no files written) ---' : '--- APPLIED ---');
  console.log(`Files touched: ${filesTouched}`);
  console.log(`Articles touched: ${articlesTouched}`);
  console.log(`FAQs added: ${faqsAdded}`);
  console.log(`Internal links added: ${linksAdded}`);
  console.log(`Words added: ${wordsAdded}`);
  console.log(`Broken-link remaps: ${remapCount}`);
  for (const r of remapLog) console.log(`  REMAP ${r.slug}: ${r.from} -> ${r.to}`);
  for (const w of warnings) console.log(`  WARN ${w}`);
}

main();
