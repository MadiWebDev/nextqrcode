import type { Article } from '../articles';
import { art } from './helper';

export const batch1: Article[] = [
  art(
    'qr-code-versions-and-capacity',
    'QR Code Versions 1-40: Module Sizes and Capacity Tables',
    'qr code versions and capacity',
    'Understand how QR code version, error correction level, and encoding mode determine symbol size and how much data fits.',
    'Fundamentals',
    '6 min read',
    '2026-07-15',
    `
### 1. How Version Determines Size

A QR code version sets the grid size. The formula is:
$$\\text{Modules per side} = 17 + 4V$$
Version 1 is 21x21, Version 10 is 57x57, Version 25 is 117x117, and Version 40 is 177x177. Generators like our [URL QR code generator](/url-qr-code-generator) automatically choose the smallest version that fits your data at the chosen error correction level.

### 2. Reference Capacities

| Version | EC Level | Numeric | Alphanumeric | Byte |
|---|---|---|---|---|
| 1 | L | 41 | 25 | 17 |
| 1 | H | 17 | 10 | 7 |
| 40 | L | 7,089 | 4,296 | 2,953 |
| 40 | H | 3,057 | 1,852 | 1,273 |

### 3. Practical Takeaway

Raising error correction or adding characters pushes the code to a higher version, which means smaller modules at a fixed print size. A 30-character URL at level M fits Version 3 (29x29 modules). The same URL at level H needs a larger version. Keep payloads short to keep modules large and scans fast. You can calculate the optimal size for any placement using our [QR size calculator](/qr-size-calculator). For printed materials, verify your code with our [printed QR tester](/printed-qr-tester) before committing to a full run. Understanding [error correction levels](/error-correction-simulator) helps you balance damage tolerance against symbol density. When generating codes for URLs, consider our [URL shortening tips](/utm-builder) to minimize version growth.
    `,
    [
      {
        question: 'How do I know which version my QR code is?',
        answer:
          'Count the modules along one side (excluding the quiet zone) and solve 17 + 4V. A 33x33 symbol is Version 4.',
      },
      {
        question: 'Can I force a specific QR version?',
        answer:
          'Most libraries allow a minimum version, but you cannot go below what the data requires at the chosen error correction level.',
      },
      {
        question: 'Does a higher version QR code scan slower?',
        answer:
          'Not necessarily, but at a fixed print size, higher versions have smaller modules which require better focus and lighting. Keep the version as low as practical.',
      },
    ]
  ),
  art(
    'history-of-the-qr-code-denso-wave',
    'The History of the QR Code: From Toyota Parts Tracking to Global Standard',
    'history of qr code',
    'How Denso Wave created the QR code in 1994 to track automotive parts, and how it became an open ISO standard.',
    'Fundamentals',
    '5 min read',
    '2026-07-16',
    `
### 1. The Problem in 1994

Denso Wave, a Toyota group company, needed to track automotive parts through production. Standard 1D [barcodes](/barcode-generator) held too little data, so workers had to scan several barcodes per part. A team led by Masahiro Hara developed a two-dimensional code that could be read quickly from any angle using a [QR scanner](/qr-scanner). Hara has said the 1:1:3:1:1 finder pattern ratio was chosen because it is rare in printed material, which reduces false detections.

### 2. Open Standardization

Denso Wave holds patents on the QR code but chose not to enforce them for standard specified uses. The code was standardized as ISO/IEC 18004, first published in 2000, and later revised. The name stands for Quick Response and QR Code is a registered trademark of Denso Wave. Today, anyone can generate QR codes using tools like our [URL QR code generator](/url-qr-code-generator) or [WiFi QR code generator](/wifi-qr-code-generator) without licensing concerns.

### 3. Path to Mainstream

Industrial use came first. Japanese mobile phones added QR reading in the early 2000s. Western adoption lagged until smartphone cameras began scanning codes natively, which accelerated further during the 2020s for menus, payments using systems like [UPI QR codes](/upi-qr-code-generator), and ticketing. For businesses looking to implement QR codes, understanding [placement best practices](/qr-placement-guide) and [size requirements](/qr-size-calculator) ensures successful adoption.
    `,
    [
      {
        question: 'Who invented the QR code?',
        answer: 'Masahiro Hara and a team at Denso Wave invented it in 1994.',
      },
      {
        question: 'Is the QR code free to use?',
        answer:
          'Yes. Denso Wave has stated it will not exercise its patent rights for codes conforming to the published standards, though QR Code is a registered trademark.',
      },
      {
        question: 'When did QR codes become popular in the West?',
        answer:
          'Mass adoption in Western markets began when smartphones added native camera scanning, accelerating significantly during the 2020s for contactless applications.',
      },
    ]
  ),
  art(
    'qr-code-vs-data-matrix',
    'QR Code vs Data Matrix: Which 2D Symbology Should You Use?',
    'qr code vs data matrix',
    'Compare QR Code and Data Matrix across capacity, minimum size, finder structure, and industry use.',
    'Fundamentals',
    '6 min read',
    '2026-07-17',
    `
### 1. Structural Differences

QR Code uses three square finder patterns and a quiet zone of four modules. Data Matrix (ISO/IEC 16022, ECC 200) uses an L-shaped solid finder on two edges and an alternating clock track on the other two, with a quiet zone of one module. You can generate both types using specialized tools, though our [barcode generator](/barcode-generator) focuses on the more widely-adopted formats.

### 2. Capacity and Size

| Feature | QR Code | Data Matrix |
|---|---|---|
| Max numeric | 7,089 | 3,116 |
| Max alphanumeric | 4,296 | 2,335 |
| Smallest symbol | 21x21 | 10x10 |
| Quiet zone | 4 modules | 1 module |

### 3. Where Each Wins

Data Matrix is preferred for tiny parts, such as electronics, medical devices, and pharmaceutical packaging, because of its small footprint and thin quiet zone. QR Code is preferred for consumer scanning because every smartphone [QR scanner](/qr-scanner) app recognizes it. Choose QR for people, Data Matrix for machines and tight spaces. Our [QR size calculator](/qr-size-calculator) can help determine if QR Code is feasible for your space constraints. For consumer-facing applications like [URL encoding](/url-qr-code-generator) or [WiFi sharing](/wifi-qr-code-generator), QR Code is almost always the right choice. When planning printed implementations, check our [placement guide](/qr-placement-guide) for best practices.
    `,
    [
      {
        question: 'Can a phone scan Data Matrix codes?',
        answer:
          'Many dedicated scanner apps can, but default camera apps are built primarily around QR Code. Test your target devices.',
      },
      {
        question: 'Which is more damage tolerant?',
        answer:
          'Both use Reed-Solomon error correction. QR Code offers four selectable levels, while Data Matrix ECC 200 sets correction according to symbol size.',
      },
      {
        question: 'When should I definitely choose Data Matrix over QR?',
        answer:
          'When space is extremely limited (under 5mm), when the quiet zone requirement is prohibitive, or when you need maximum data density on tiny electronic components.',
      },
    ]
  ),
  art(
    'qr-code-model-1-vs-model-2',
    'QR Code Model 1 vs Model 2: What Changed in the Original Standard',
    'qr code model 1 vs model 2',
    'A short technical comparison of the original QR Model 1 and the Model 2 symbols used almost everywhere today.',
    'Fundamentals',
    '4 min read',
    '2026-07-18',
    `
### 1. Two Generations

Model 1 is the original 1994 symbol. It reaches up to Version 14 (73x73 modules) and about 1,167 numeric characters. Model 2 is the enhanced version, extending to Version 40 (177x177) and adding alignment patterns that help decoders cope with distortion in larger symbols. Modern [QR code generators](/url-qr-code-generator) and [scanners](/qr-scanner) exclusively support Model 2.

### 2. Why It Matters Today

Virtually every generator and phone produces and reads Model 2. Model 1 survives mainly in legacy industrial systems. The model is signaled in the format area, so readers distinguish them automatically. When using our [barcode generator](/barcode-generator) or any modern [QR generation tool](/wifi-qr-code-generator), you're creating Model 2 codes. For printing verification, our [printed QR tester](/printed-qr-tester) works with Model 2 codes, and the [QR size calculator](/qr-size-calculator) assumes Model 2 specifications.

### 3. Practical Advice

Unless you are maintaining a legacy factory scanner setup, always generate Model 2. If an old reader cannot scan your code, check whether it supports Model 2 and its larger versions. For modern applications like [vCard sharing](/vcard-qr-code-generator) or [payment links](/upi-qr-code-generator), Model 2 compatibility is universal.
    `,
    [
      {
        question: 'Which model do online QR generators produce?',
        answer: 'Model 2, the standard in ISO/IEC 18004.',
      },
      {
        question: 'Are Model 1 and Model 2 codes visually different?',
        answer:
          'Small versions look very similar. Larger Model 2 symbols include alignment patterns that Model 1 lacks.',
      },
      {
        question: 'Will my phone scan Model 1 codes?',
        answer:
          'Most modern phones support both, but Model 1 is rarely encountered outside of legacy industrial environments.',
      },
    ]
  ),
  art(
    'structured-append-qr-codes',
    'Structured Append: Splitting Large Data Across Multiple QR Codes',
    'structured append qr code',
    'How the structured append feature links up to 16 QR symbols into one logical message, and when to use alternatives.',
    'Fundamentals',
    '5 min read',
    '2026-07-19',
    `
### 1. What It Is

Structured append lets a payload be divided across up to 16 QR symbols. Each symbol carries its position in the sequence, the total count, and a parity byte computed over the full message so a reader can confirm all parts match. This extends the capacity beyond what a single Version 40 symbol can hold, though modern [QR scanners](/qr-scanner) vary in their support for this feature.

### 2. The Catch: Reader Support

Consumer camera apps often ignore structured append, treating each symbol as a separate message. Industrial scanners and some dedicated apps reassemble them. Because support is inconsistent, it is poorly suited to public marketing codes. For consumer applications like [URL sharing](/url-qr-code-generator) or [WiFi credentials](/wifi-qr-code-generator), single-symbol codes are far more reliable.

### 3. Better Alternatives

* Store the data on a server and encode a short link using our [URL builder](/utm-builder).
* Compress or trim the payload so one symbol suffices—see our [QR size calculator](/qr-size-calculator) for capacity planning.
* Print several independent codes, each with a complete, self-contained payload.
* Use [bulk generation](/bulk-generator) to create multiple simple codes rather than one complex structured sequence.
* For very large datasets, consider using a [vCard QR](/vcard-qr-code-generator) with a URL link rather than embedding all fields.
    `,
    [
      { question: 'How many symbols can structured append link?', answer: 'Up to 16.' },
      {
        question: 'Will a normal phone camera combine them?',
        answer: 'Usually not. Plan for readers that treat each code separately.',
      },
      {
        question: 'When is structured append actually useful?',
        answer:
          'In controlled industrial environments with compatible scanners, or when you need to encode very large datasets that cannot be served via a URL.',
      },
    ]
  ),
  art(
    'qr-code-character-encoding-utf8-eci',
    'QR Code Character Encoding: UTF-8, ISO-8859-1, and ECI Explained',
    'qr code utf-8 encoding',
    'Fix garbled accents, Urdu, Arabic, and emoji in QR codes by understanding byte mode and Extended Channel Interpretation.',
    'Fundamentals',
    '6 min read',
    '2026-07-20',
    `
### 1. The Default Is Not UTF-8

In byte mode a QR code stores raw bytes. The original standard defines the default interpretation as ISO/IEC 8859-1 (Latin-1). Many modern readers guess UTF-8 anyway, but guessing is not guaranteed. This affects any QR containing non-ASCII characters, whether from a [URL generator](/url-qr-code-generator), [vCard](/vcard-qr-code-generator), or [WiFi credentials](/wifi-qr-code-generator).

### 2. Extended Channel Interpretation

ECI is a header that tells the reader which character set follows. ECI 3 denotes ISO-8859-1 and ECI 26 denotes UTF-8. Some generators add the ECI header for non-Latin text, and some readers display it incorrectly or reject it, so test both. Before printing non-Latin characters, use our [printed QR tester](/printed-qr-tester) on multiple devices to verify correct decoding.

### 3. Safe Practice for Urdu, Arabic and Emoji

1. Encode as UTF-8.
2. Prefer encoding a URL (ASCII) and putting the Urdu or Arabic text on the destination page—use our [URL builder](/utm-builder) to create trackable short links.
3. Test on at least one iPhone and two Android models before printing.
4. Verify the character rendering using a [QR scanner](/qr-scanner) from different manufacturers.
5. For multilingual applications like [WhatsApp links](/whatsapp-qr-code-generator), keep the QR payload in ASCII and handle language selection on the landing page.
    `,
    [
      {
        question: 'Why do accented letters show as symbols?',
        answer:
          'The reader decoded UTF-8 bytes as Latin-1, or the reverse. Make the encoding explicit with ECI or avoid non-ASCII in the payload.',
      },
      {
        question: 'Can I put Urdu text directly in a QR code?',
        answer:
          'Yes in UTF-8, but a URL to a web page is more reliable and keeps the symbol smaller.',
      },
      {
        question: 'Do emoji work in QR codes?',
        answer:
          'Technically yes with UTF-8 encoding, but reader support varies. Test extensively or use a URL pointing to a page with emoji instead.',
      },
    ]
  ),
  art(
    'qr-code-format-information-bits',
    'QR Code Format Information: How 15 Bits Control Decoding',
    'qr code format information',
    'Decode the 15-bit format string that stores error correction level, mask pattern, and BCH protection.',
    'Fundamentals',
    '5 min read',
    '2026-07-21',
    `
### 1. What the 15 Bits Contain

The format information has 5 data bits and 10 error-check bits. The 5 data bits are 2 bits for the error correction level and 3 bits for the mask pattern (0 to 7). The 10 check bits come from a BCH (15,5) code. This low-level structure is handled automatically by tools like our [URL QR code generator](/url-qr-code-generator) and [barcode generator](/barcode-generator), ensuring every symbol is spec-compliant.

### 2. Masking the Format String

The final 15-bit string is XORed with the fixed pattern 101010000010010. This prevents an all-zero format string and keeps the area from looking like a blank region. When you use our [QR scanner](/qr-scanner) or any standards-compliant reader, it automatically reverses this mask to extract the format data. Understanding these details helps when troubleshooting scanning issues with our [printed QR tester](/printed-qr-tester).

### 3. Redundancy

The format string is written twice: once around the top-left finder pattern, and once split between the other two finders. If one copy is damaged, the reader falls back to the other. Version information (Version 7 and above) is a separate 18-bit block also written twice. This redundancy is one reason why QR codes work reliably even when partially obscured—a critical consideration when using the [error correction simulator](/error-correction-simulator) to plan damage tolerance. For sizing and placement that preserves these critical areas, consult our [QR placement guide](/qr-placement-guide) and [QR size calculator](/qr-size-calculator).
    `,
    [
      {
        question: 'Where is the format information located?',
        answer: 'Next to the separators around the finder patterns, duplicated in two places.',
      },
      {
        question: 'Does the format string store the version?',
        answer:
          'No. The version is derived from the symbol size for small symbols and from a separate version block from Version 7 up.',
      },
      {
        question: 'Can format information corruption make a QR code unscannable?',
        answer:
          'It can, but redundancy helps. If both copies are damaged, the reader cannot determine the error correction level or mask pattern, causing scan failure.',
      },
    ]
  ),
  art(
    'rmqr-rectangular-micro-qr-code',
    'rMQR: The Rectangular Micro QR Code for Narrow Spaces',
    'rmqr code',
    'Learn how rectangular Micro QR (rMQR, ISO/IEC 23941) fits codes into thin labels and cable tags.',
    'Fundamentals',
    '5 min read',
    '2026-07-22',
    `
### 1. Why a Rectangle?

Square symbols waste space on long, narrow surfaces such as cables, pens, tubes, and slim product edges. Rectangular Micro QR Code (rMQR), standardized as ISO/IEC 23941:2022, offers heights from 7 to 17 modules and widths from 27 to 139 modules. While standard QR codes generated by our [URL generator](/url-qr-code-generator) or [barcode tool](/barcode-generator) work great for most applications, rMQR fills a specialized niche.

### 2. Structure

rMQR uses one finder pattern at the top-left, a smaller sub-finder at the bottom-right, timing patterns along the edges, and a two-module quiet zone. It supports numeric, alphanumeric, byte, and kanji modes with Reed-Solomon error correction at levels M and H. The [error correction simulator](/error-correction-simulator) principles apply similarly to rMQR as to standard QR codes.

### 3. Compatibility

rMQR is newer, and common phone camera apps do not all read it. Use it in closed environments with scanners you control, and test before committing to print. For public-facing applications requiring wide compatibility, stick with standard QR codes from our [WiFi generator](/wifi-qr-code-generator), [vCard generator](/vcard-qr-code-generator), or other mainstream tools. Check compatibility using our [QR scanner](/qr-scanner) and [printed QR tester](/printed-qr-tester) before production. For sizing guidance on standard codes, our [QR size calculator](/qr-size-calculator) and [placement guide](/qr-placement-guide) remain the best resources.
    `,
    [
      {
        question: 'Can I use rMQR on a consumer menu?',
        answer: 'Not recommended. Support in default camera apps is not universal.',
      },
      { question: 'What is the quiet zone for rMQR?', answer: 'Two modules.' },
      {
        question: 'Will rMQR become more widely supported?',
        answer:
          'Possibly, as it gains ISO standardization. For now, test compatibility on your target devices before deploying.',
      },
    ]
  ),
  art(
    'frame-qr-and-sqrc-denso-wave',
    'Frame QR and SQRC: Specialty QR Formats from Denso Wave',
    'frame qr sqrc',
    'Understand two proprietary QR variants: Frame QR with a design canvas and SQRC with restricted private data.',
    'Fundamentals',
    '5 min read',
    '2026-07-23',
    `
### 1. Frame QR

Frame QR reserves a rectangular canvas area inside the symbol where an image or text can sit without relying on error correction to hide it. The surrounding data area still scans in standard readers. This differs from simply placing a logo on a standard QR code—consult our [error correction simulator](/error-correction-simulator) to understand how logos affect regular codes. For most branding needs, a standard QR from our [URL generator](/url-qr-code-generator) with appropriate error correction suffices.

### 2. SQRC

SQRC (Secured QR Code) stores two kinds of data in one symbol: public data readable by any [QR reader](/qr-scanner), and private data readable only by readers holding the right key. Typical uses are ticketing, membership cards, and internal inventory. Standard tools like our [vCard generator](/vcard-qr-code-generator) or [WiFi QR generator](/wifi-qr-code-generator) create fully public codes; SQRC requires specialized software.

### 3. Caveats

Both are Denso Wave technologies and are not part of the core ISO symbol definition, and implementation requires compatible generators and readers. For most businesses, a standard QR code at level H with a modest logo is simpler. Use our [QR size calculator](/qr-size-calculator) to plan dimensions, the [printed QR tester](/printed-qr-tester) to verify quality, and the [placement guide](/qr-placement-guide) for optimal positioning. For secure applications where controlled access matters, consider URL-based authentication with codes from our [bulk generator](/bulk-generator) rather than proprietary formats.
    `,
    [
      {
        question: 'Do normal phones read SQRC private data?',
        answer: 'No. Phones read the public portion; the private data needs authorized readers.',
      },
      {
        question: 'Do I need Frame QR for a logo?',
        answer: 'No. A standard code at level H with a small centered logo works for most brands.',
      },
      {
        question: 'Where can I generate Frame QR or SQRC codes?',
        answer:
          'These require Denso Wave-licensed tools. For most use cases, standard QR codes with appropriate error correction are more practical and widely supported.',
      },
    ]
  ),
  art(
    'shorten-qr-code-url-for-cleaner-codes',
    'Shorter URLs, Cleaner QR Codes: Reduce Density Without Losing Function',
    'qr code url length',
    'Practical ways to shorten the data inside a QR code so modules are larger and scans are faster.',
    'Fundamentals',
    '5 min read',
    '2026-07-24',
    `
### 1. Every Character Costs Modules

Byte mode spends 8 bits per character. A 120-character tracking URL can push a code to Version 7 or higher, shrinking each module at a fixed print size. A 25-character URL may fit Version 2 or 3. Use our [QR size calculator](/qr-size-calculator) to see how payload length affects module density, and the [error correction simulator](/error-correction-simulator) to understand the trade-offs between data capacity and damage tolerance.

### 2. Techniques

* Use a short, memorable path on your own domain (for example example.com/menu)—our [URL generator](/url-qr-code-generator) makes this easy.
* Drop unnecessary parameters and move tracking to the server, or use our [UTM builder](/utm-builder) to create short tracking links.
* Use alphanumeric mode: an uppercase-only URL such as HTTPS://EXAMPLE.COM/MENU costs about 5.5 bits per character. This only works if your host treats the path case-insensitively.
* Remove the trailing slash and unneeded subdomains.
* For specialized use cases like [WiFi credentials](/wifi-qr-code-generator), [vCards](/vcard-qr-code-generator), or [WhatsApp links](/whatsapp-qr-code-generator), use the dedicated format rather than embedding everything in a URL.

### 3. Check Before Printing

Generate the code, count the modules, and measure the final module width. Target at least 0.5 mm for packaging and 0.35 mm as an absolute floor on smooth stock. Verify readability with our [printed QR tester](/printed-qr-tester) and ensure optimal placement using the [QR placement guide](/qr-placement-guide). A working [QR scanner](/qr-scanner) test on multiple devices confirms success.
    `,
    [
      {
        question: 'Does a shorter URL make a QR code scan better?',
        answer:
          'Yes. Fewer modules means larger modules at the same print size, which improves focus and tolerance for print gain.',
      },
      {
        question: 'Is uppercase in a URL safe?',
        answer:
          'Domains are case-insensitive, but paths often are not. Only use uppercase if your server handles it.',
      },
      {
        question: 'How much can URL shortening reduce QR code density?',
        answer:
          'Cutting a URL from 100 to 30 characters can drop the version from 5 or 6 down to 2 or 3, making modules significantly larger and improving scan reliability.',
      },
    ]
  ),
];
