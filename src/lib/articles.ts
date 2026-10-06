import { NEW_ARTICLES } from './pages/index';

export interface Article {
  slug: string;
  title: string;
  primaryKeyword: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  category: 'Fundamentals' | 'Printing & Sizing' | 'Security & Scanning' | 'Business & Regional';
  content: string; // Markdown or rich HTML-compatible structured content
  faqs: { question: string; answer: string }[];
  howTo?: {
    name: string;
    description: string;
    steps: { name: string; text: string }[];
  };
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-qr-codes-work',
    title: 'How QR Codes Work: The Complete Technical & Mathematical Guide',
    primaryKeyword: 'how do qr codes work',
    description: 'An in-depth technical analysis of QR code architecture: Reed-Solomon error correction, finder patterns, timing tracks, and data masking algorithms.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-03-15',
    updatedAt: '2026-10-01',
    readTime: '9 min read',
    category: 'Fundamentals',
    content: `
### 1. The Anatomy of a Two-Dimensional Matrix Symbol

Quick Response (QR) codes, invented in 1994 by Masahiro Hara at Denso Wave, are two-dimensional matrix symbologies standardized under ISO/IEC 18004. Unlike traditional one-dimensional barcodes that represent data through variable-width parallel lines along a single horizontal axis, QR codes encode information across both horizontal and vertical axes. This orthogonal architecture expands data density exponentially: a standard Version 40 QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 binary bytes within a 177x177 module grid.

The physical structure of every standard Model 2 QR code is governed by five mandatory functional regions:

* **Finder Patterns (Position Detection Markers):** Three identical concentric square structures situated at the top-left, top-right, and bottom-left corners. Each finder pattern adheres to a strict 1:1:3:1:1 module ratio (1 dark module, 1 light module, 3 dark modules, 1 light module, 1 dark module). Optical scanners identify these geometric anchors in 360-degree space to calculate the symbol's orientation, scale, and affine transform distortion without requiring a level scanning angle.
* **Separators:** Single-module-wide white margins immediately surrounding each finder pattern. These isolate the finder patterns from adjacent data modules, preventing optical decoders from misinterpreting arbitrary bit arrangements as additional orientation markers.
* **Timing Patterns:** Alternating dark and light module tracks connecting the inner boundaries of the finder patterns along row 6 and column 6. The timing tracks establish the precise physical pitch and grid coordinate system of the matrix, enabling software algorithms to determine the symbol's version (from Version 1 at 21x21 modules up to Version 40 at 177x177 modules).
* **Alignment Patterns:** Nested square markers (5x5 modules with a central 1x1 black dot) integrated into all symbols of Version 2 (25x25) and above. As QR codes increase in physical dimensions or surface curvature, alignment patterns allow decoders to correct for non-linear perspective warping, barrel distortion, and substrate flex.
* **Quiet Zone:** An unprinted, high-contrast margin measuring at least 4 modules in width on all four external borders. The quiet zone guarantees that ambient textures, typography, and packaging graphics do not corrupt the edge binarization process.

### 2. Encoding Modes and Bit Optimization

Before data is placed into the matrix, the raw input string is parsed into one of four fundamental encoding modes to optimize storage capacity:

1. **Numeric Mode (10 bits per 3 digits):** Encodes digits 0 through 9. Each group of three consecutive digits is packed into a 10-bit binary integer ($2^{10} = 1024 > 999$). Remaining 2 digits use 7 bits; 1 digit uses 4 bits.
2. **Alphanumeric Mode (11 bits per 2 characters):** Encodes 45 characters (0-9, A-Z, space, $, %, *, +, -, ., /, :). Pairs of characters are converted using the formula $45 \times C_1 + C_2$ into an 11-bit representation ($2^{11} = 2048 > 45 \times 44 + 44 = 2024$).
3. **Byte Mode (8 bits per character):** Standard ISO-8859-1 or UTF-8 binary stream. Each byte is placed directly into an 8-bit codeword.
4. **Kanji Mode (13 bits per character):** Compresses Shift JIS double-byte characters into 13 bits.

### 3. Reed-Solomon Error Correction Mathematics

The resilience of QR codes stems from Galois Field arithmetic using non-binary BCH codes, specifically Reed-Solomon error correction over the finite field $GF(2^8)$ with the prime generator polynomial $p(x) = x^8 + x^4 + x^3 + x^2 + 1$ (decimal 285).

Data codewords $D(x)$ are divided by a generator polynomial $g(x) = \prod_{i=0}^{2t-1} (x - \alpha^i)$ to produce remainder polynomials representing parity codewords. This gives QR codes the ability to recover from both erasure errors (known locations of damage) and random bit corruption up to $t$ codewords:
$$\text{Max Recoverable Codewords} = \left\lfloor \frac{R}{2} \right\rfloor$$
where $R$ is the number of error correction parity codewords appended.

The four standardized levels provide distinct recovery ceilings:
* **Level L (Low):** ~7% data restoration headroom. Produces the least dense module count; ideal for clean digital displays or short URLs.
* **Level M (Medium):** ~15% data restoration headroom. The industry standard default for general marketing collateral.
* **Level Q (Quartile):** ~25% restoration headroom. Recommended for industrial environments and transport logistics prone to abrasion.
* **Level H (High):** ~30% data recovery headroom. Mandatory whenever custom logos or iconography are embedded in the center of the QR matrix.

### 4. Data Masking and Scanner Binarization

Once data and parity codewords are interleaved, the raw bit stream may create large clusters of identical modules or unintended false finder patterns. To prevent scanner desynchronization, the matrix is evaluated against 8 standardized mathematical masking patterns:
* **Pattern 0:** $(row + col) \pmod 2 = 0$
* **Pattern 1:** $row \pmod 2 = 0$
* **Pattern 2:** $col \pmod 3 = 0$
* **Pattern 3:** $(row + col) \pmod 3 = 0$
* **Pattern 4:** $(\lfloor row / 2 \rfloor + \lfloor col / 3 \rfloor) \pmod 2 = 0$
* **Pattern 5:** $((row \times col) \pmod 2) + ((row \times col) \pmod 3) = 0$
* **Pattern 6:** $(((row \times col) \pmod 2) + ((row \times col) \pmod 3)) \pmod 2 = 0$
* **Pattern 7:** $(((row + col) \pmod 2) + ((row \times col) \pmod 3)) \pmod 2 = 0$

Each mask is applied via bitwise XOR. A penalty score algorithm computes penalties for consecutive modules of the same color, 2x2 identical blocks, and finder-like sequences. The mask producing the lowest penalty score is written into the format information area alongside the selected error correction level.
    `,
    faqs: [
      { question: 'What is the maximum data capacity of a QR code?', answer: 'A Version 40 QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 binary bytes at Error Correction Level L.' },
      { question: 'Why are there three square boxes on a QR code?', answer: 'Those are finder patterns with a 1:1:3:1:1 geometric ratio. They allow camera sensors to detect the orientation, tilt, and boundaries of the code in 360-degree space.' },
      { question: 'How does a QR code work if it is partially torn or dirty?', answer: 'QR codes use Reed-Solomon error correction over GF(2^8). Redundant parity codewords allow decoders to mathematically recalculate and reconstruct missing or corrupted bits.' }
    ]
  },
  {
    slug: 'qr-code-sizes-for-printing',
    title: 'QR Code Sizes for Printing: The Definitive Scan-Distance Ratio Guide',
    primaryKeyword: 'qr code size for print',
    description: 'Calculate the exact physical print dimensions required for any QR code based on viewing distance, scanner optical resolution, and substrate conditions.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-03-20',
    updatedAt: '2026-10-02',
    readTime: '8 min read',
    category: 'Printing & Sizing',
    content: `
### 1. The Fundamental Distance-to-Size Ratio ($10:1$ and $8:1$ Principles)

A primary cause of QR code failure in physical environments is improper dimensional scaling. Optical sensors on smartphones rely on a minimum number of camera sensor pixels resolving across each individual QR code module.

The baseline industry rule for general smartphone cameras is the **10:1 Distance-to-Size Ratio**:
$$\text{Print Width (cm)} = \frac{\text{Scanning Distance (cm)}}{10}$$

* **At 20 cm (tabletop menu, business card):** Minimum width = $20 / 10 = 2.0\text{ cm}$ (20 mm or 0.8 inches).
* **At 1 meter (retail poster, eye-level window):** Minimum width = $100 / 10 = 10.0\text{ cm}$ (4 inches).
* **At 5 meters (trade show banner, storefront facade):** Minimum width = $500 / 10 = 50.0\text{ cm}$ (19.7 inches).
* **At 25 meters (highway billboard):** Minimum width = $2500 / 10 = 250.0\text{ cm}$ (2.5 meters or 98.4 inches).

When designing for sub-optimal conditions—such as low indoor ambient lighting, scanning through tinted glass, or high-density payloads (Version 10+)—the conservative **8:1 ratio** must be adopted:
$$\text{Conservative Print Width} = \frac{\text{Distance}}{8}$$

### 2. Module Dimension Thresholds ($W_m$)

Regardless of the overall symbol dimensions, the individual module size ($W_m$) determines camera sensor focus thresholds:
$$W_m = \frac{\text{Total Symbol Width}}{\text{Number of Modules Across}}$$

For reliable decoding across legacy entry-level Android devices and high-end flagship smartphones:
* **Absolute Minimum Module Size:** 0.35 mm (0.014 inches) on smooth coated stock.
* **Recommended Minimum Module Size:** 0.50 mm (0.020 inches) for commercial packaging.
* **Corrugated Cardboard / Flexo Printing:** 0.85 mm (0.033 inches) to compensate for ink absorption spread.

### 3. Resolution and DPI Equations for Vector vs Raster

Never export QR codes for commercial printing as lossy raster files (such as 72 DPI JPEG). Always export as vector SVG, EPS, or 300+ DPI lossless PNG.

To calculate the required pixel resolution for raster production:
$$\text{Pixel Resolution} = \text{Print Width (Inches)} \times 300\text{ DPI}$$

For a 2x2 inch QR code:
$$\text{Resolution} = 2 \times 300 = 600 \times 600\text{ pixels minimum}$$

### 4. Quiet Zone Scaling Rules

The ISO/IEC 18004 standard mandates a minimum **quiet zone margin of 4 modules** on all four sides. If your QR code has a module size of 1 mm, your quiet zone must be at least 4 mm wide on every edge. Cutting or cropping into this white border disrupts the scanner's binarization threshold, causing immediate scan failure.
    `,
    faqs: [
      { question: 'What is the absolute smallest size a QR code can be printed?', answer: 'For standard smartphones, the absolute minimum size is 20 x 20 mm (0.8 x 0.8 inches) for low-density static URLs on smooth paper.' },
      { question: 'What size should a QR code be on an A4 poster?', answer: 'On an A4 poster viewed from 1 to 1.5 meters away, the QR code should be between 10 x 10 cm and 15 x 15 cm.' },
      { question: 'Why does my printed QR code look blurry?', answer: 'It was likely exported as a low-resolution raster image (72 DPI) instead of a vector SVG or 300 DPI high-resolution master.' }
    ]
  },
  {
    slug: 'static-vs-dynamic-qr-codes',
    title: 'Static vs Dynamic QR Codes: Architectural, Privacy, and Cost Comparison',
    primaryKeyword: 'static vs dynamic qr codes',
    description: 'Compare permanent static QR codes with server-redirected dynamic QR codes. Discover the hidden trade-offs in uptime, security, privacy, and long-term costs.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-03-25',
    updatedAt: '2026-10-03',
    readTime: '7 min read',
    category: 'Fundamentals',
    content: `
### 1. Structural and Architectural Differences

The distinction between static and dynamic QR codes lies in where the final destination data is resolved:

* **Static QR Codes (Self-Contained Payloads):** The raw target data (URL, WiFi credentials, plain text, or vCard) is directly encoded into the two-dimensional module matrix. The user's camera decodes the bits and executes the action locally on the device without pinging an intermediary server.
* **Dynamic QR Codes (Proxy Redirects):** The matrix encodes a short proxy URL (e.g., \`https://redirect.service/xyz123\`). When scanned, the device reaches the intermediary redirect server, which logs metadata (IP address, user agent, timestamp) and sends an HTTP 301/302 redirect header to the destination URL.

### 2. The Subscription Trap and Vendor Lock-in

Many online generator services advertise "free QR codes" that silently encode dynamic redirect URLs under free trial tiers. Once 14 or 30 days elapse, the vendor disables the redirect link or redirects scans to a payment paywall page. 

For physical print assets (packaging, business cards, books, machinery plates, outdoor signage), a broken dynamic redirect renders thousands of printed units permanently useless. **Static QR codes generated by QR Code Tools never expire, require zero recurring subscriptions, and function permanently for the lifetime of the substrate.**

### 3. Data Privacy and GDPR/CCPA Compliance

Dynamic QR codes inherently track the individual who scans the code by logging their device IP address, geolocation estimates, and browser fingerprint. In enterprise and healthcare contexts, this tracking may require explicit GDPR/CCPA user consent prior to redirect.

Static QR codes offer absolute privacy:
* No external server receives notification when the code is scanned.
* Zero personal telemetry or tracking cookies are collected.
* Ideal for emergency medical IDs, offline WiFi signs, and internal warehouse asset tracking.
    `,
    faqs: [
      { question: 'Do static QR codes ever expire?', answer: 'No. Static QR codes encode the data directly into the matrix and will function indefinitely as long as the printed medium remains legible.' },
      { question: 'Can I change the link in a static QR code after printing?', answer: 'No. Because the payload is physically burned into the black and white modules, you cannot change the destination URL without reprinting the code.' },
      { question: 'When should I use a dynamic QR code instead of static?', answer: 'Use dynamic QR codes only when you need scan-volume analytics or anticipate needing to update the destination URL after printing high-volume physical collateral.' }
    ]
  },
  {
    slug: 'qr-code-error-correction',
    title: 'QR Code Error Correction Explained: Reed-Solomon Levels L, M, Q, and H',
    primaryKeyword: 'qr code error correction levels',
    description: 'Learn how Reed-Solomon error correction mathematically protects QR codes from physical damage, tears, and logo overlays.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-03-28',
    updatedAt: '2026-10-02',
    readTime: '8 min read',
    category: 'Fundamentals',
    content: `
### 1. Reed-Solomon Parity in $GF(2^8)$

QR codes implement non-binary Reed-Solomon error correction over the finite field Galois Field 256 ($GF(2^8)$). In this algebra, numbers from 0 to 255 represent 8-bit bytes, and mathematical operations (addition, subtraction, multiplication, and division) are performed modulo an irreducible primitive polynomial:
$$p(x) = x^8 + x^4 + x^3 + x^2 + 1$$

When generating a QR code, the raw data codewords are treated as coefficients of a polynomial $D(x)$. This polynomial is multiplied by $x^{2t}$ and divided by a generator polynomial $g(x)$:
$$g(x) = (x - \alpha^0)(x - \alpha^1)(x - \alpha^2)\dots(x - \alpha^{2t-1})$$
The remainder polynomial $R(x)$ contains the parity codewords that are appended to the payload.

### 2. Comparison of the Four Standard Levels

| Level | Identifier | Recovery Headroom | Recommended Use Case |
|---|---|---|---|
| **Level L** | Low | ~7% of codewords | High-density data, clean digital screens, micro-labels |
| **Level M** | Medium | ~15% of codewords | Default standard for flyers, brochures, and web links |
| **Level Q** | Quartile | ~25% of codewords | Industrial environments, logistics, outdoor posters |
| **Level H** | High | ~30% of codewords | Embedded logo designs, harsh factory floors, vehicle decals |

### 3. The Logo Overlay Trade-off

When adding a brand logo to the center of a QR code, you are deliberately obliterating valid data modules. If you place a logo covering 20% of the symbol area:
* A code generated at **Level L (7%)** or **Level M (15%)** will become completely unreadable.
* A code generated at **Level H (30%)** will still retain approximately 10% of recovery margin for physical scratches and optical noise.

Always configure your QR generator to **Level H** before embedding custom center artwork.
    `,
    faqs: [
      { question: 'Which error correction level should I choose for marketing materials?', answer: 'Level M (15%) is optimal for standard marketing without logos. If adding a company logo, always use Level H (30%).' },
      { question: 'Does higher error correction make the QR code bigger?', answer: 'Yes. Higher error correction requires more parity codewords, which increases the grid version and module density.' }
    ]
  },
  {
    slug: 'how-to-make-wifi-qr-code',
    title: 'How to Make a WiFi QR Code: Secure WPA3, WPA2, and Hidden SSID Guide',
    primaryKeyword: 'how to create wifi qr code',
    description: 'Generate instant-connect WiFi QR codes for homes, cafes, and hotels with full support for WPA3, WPA2, WEP, and hidden network syntax.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-04-02',
    updatedAt: '2026-10-01',
    readTime: '6 min read',
    category: 'Fundamentals',
    content: `
### 1. The Standardized WiFi URI Schema

Mobile operating systems (iOS 11+ and Android 10+) feature native protocol handlers that parse the standardized \`WIFI:\` URI syntax:
\`\`\`text
WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<PASSWORD>;H:<true|false>;;
\`\`\`

#### Field Specification:
* **\`S:\` (SSID / Network Name):** Case-sensitive name of the wireless access point.
* **\`T:\` (Authentication Type):** \`WPA\` (covers WPA, WPA2-PSK, and WPA3-SAE), \`WEP\` (legacy encryption), or \`nopass\` (unencrypted public hotspot).
* **\`P:\` (Pre-Shared Key / Password):** The raw network security key.
* **\`H:\` (Hidden Network Flag):** \`true\` if the router does not broadcast its beacon SSID; \`false\` or omitted for standard networks.

### 2. Escaping Special Characters

A frequent source of failed WiFi scans is unescaped delimiters. If your SSID or password contains colons (\`:\`), semicolons (\`;\`), backslashes (\`\\\`), commas (\`,\`), or double quotes (\`"\`), each occurrence must be preceded by a backslash escape character (\`\\\`):
\`\`\`text
WIFI:S:Guest\\;Lounge;T:WPA;P:Secret\\:Key\\;123;;
\`\`\`

### 3. RTL Language Typography for Multi-lingual Table Tents

In international hospitality settings (e.g., Middle East, Pakistan, North Africa), WiFi signage must clearly communicate instructions in both Latin and Right-to-Left (RTL) scripts such as Urdu (\`اردو\`) and Arabic (\`العربية\`). Always ensure the QR symbol maintains an unblemished quiet zone separate from RTL typography blocks.
    `,
    faqs: [
      { question: 'Can guests see my WiFi password if they scan the QR code?', answer: 'Yes. Any barcode reader application can display the underlying text payload (WIFI:S:...;P:...). Only share the QR code with individuals you trust with your network password.' },
      { question: 'Do WiFi QR codes work on both iPhone and Android?', answer: 'Yes. Both iOS (Camera app) and Android (Google Lens / native camera) automatically detect the WIFI: string and present a one-tap "Join Network" prompt.' }
    ]
  },
  {
    slug: 'qr-codes-for-restaurants',
    title: 'Best QR Code Practices for Restaurants: Menus, Ordering & Table Tents',
    primaryKeyword: 'restaurant menu qr code best practices',
    description: 'Optimize restaurant table turn rates and eliminate PDF download friction with responsive web menus, high-contrast acrylic stands, and durable substrates.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-04-10',
    updatedAt: '2026-10-02',
    readTime: '7 min read',
    category: 'Business & Regional',
    content: `
### 1. The PDF Menu Anti-Pattern

During the early 2020s, many restaurants adopted QR codes that directed patrons directly to a 25MB multi-page print PDF. This created severe user friction:
* Slow loading speeds on cellular networks inside concrete or basement dining rooms.
* Pinch-to-zoom awkwardness on compact smartphone viewports.
* Inability to search or filter dishes for dietary restrictions (vegan, gluten-free, halal).

**Best Practice:** Direct your table QR codes to a lightweight, mobile-first responsive web page that loads in under 1.5 seconds.

### 2. Substrate Durability on Dining Surfaces

Tabletop QR signage faces continuous exposure to alcohol sanitizers, food grease, condensation, and UV sunlight:
* **Avoid Unlaminated Paper Stickers:** Paper fibers absorb liquid spills within 48 hours, causing dark module ink bleed.
* **Recommended:** Direct UV printing on acrylic blocks or matte-laminated synthetic polyester sheets (such as NeverTear).
* **Matte vs Gloss Finish:** Always choose a **matte finish** to prevent ambient dining room overhead spotlights from reflecting glare into the customer's camera lens.
    `,
    faqs: [
      { question: 'What is the best size for a restaurant table QR code?', answer: 'A minimum print size of 3.5 x 3.5 cm (1.4 x 1.4 inches) is ideal for table tents where customers scan from 30 to 45 cm away.' },
      { question: 'Should I put individual table numbers inside the QR code?', answer: 'Yes, if you offer table-side ordering. Encode unique table parameters (e.g., ?table=12) so your kitchen POS accurately routes orders.' }
    ]
  },
  {
    slug: 'qr-code-security-best-practices',
    title: 'QR Code Security Best Practices: Preventing Quishing, Malicious Redirects & Tampering',
    primaryKeyword: 'qr code security best practices',
    description: 'Comprehensive cybersecurity guide to protecting consumers and enterprises from QR phishing (quishing), sticker overlay attacks, and malicious payloads.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-04-15',
    updatedAt: '2026-10-01',
    readTime: '9 min read',
    category: 'Security & Scanning',
    content: `
### 1. The Mechanics of "Quishing" (QR Phishing)

As email gateways and firewalls improved at stripping malicious hyperlinks from email bodies, cybercriminals shifted to embedding fraudulent URLs inside QR code images. Because many traditional optical character recognition (OCR) inspection filters overlook graphic attachments, the malicious payload bypasses perimeter defenses.

When victims scan the code with their personal smartphones, they bypass corporate VPNs, DNS filtering, and endpoint protections, landing on credential-harvesting phishing portals designed to impersonate Microsoft 365, Google Workspace, or banking portals.

### 2. Physical Tampering: The Sticker Overlay Attack

In public physical environments—such as municipal parking meters, restaurant tables, and outdoor billboards—attackers print high-resolution adhesive stickers containing malicious URLs and paste them directly over legitimate QR codes.

#### Physical Defense Measures:
* **Recessed or Sub-Surface Printing:** Print QR codes behind clear polycarbonate or glass faceplates to make tactile sticker overlays obvious.
* **Routine Visual Audits:** Instruct facility and restaurant staff to run physical finger checks across table codes daily to detect pasted label edges.
* **Distinct Branded Framing:** Use custom visual frames with microprint that cannot be easily replicated by a generic sticker.
    `,
    faqs: [
      { question: 'Can a QR code directly install malware on my phone?', answer: 'No. Scanning a QR code simply parses a string. Malware installation requires the user to open a malicious link, download an APK/executable, and grant execution permissions.' },
      { question: 'How can I check if a QR code is safe before opening it?', answer: 'Use our client-side QR Safety Checker to inspect the raw destination string, expand short links, and check the target domain against security heuristics before opening.' }
    ]
  },
  {
    slug: 'anatomy-of-a-qr-code',
    title: 'The Complete Anatomy of a QR Code: Finder, Timing, and Alignment Modules',
    primaryKeyword: 'parts of a qr code',
    description: 'Deconstruct the functional components of a standard ISO/IEC 18004 QR code: position detection patterns, alignment grids, timing tracks, and format strips.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-04-20',
    updatedAt: '2026-10-02',
    readTime: '8 min read',
    category: 'Fundamentals',
    content: `
### 1. Deconstructing the Matrix

Every standard QR code is composed of functional patterns (which do not encode data but guide the optical reader) and the encoding region (which contains data codewords, error correction codewords, and format bits).

### 2. Functional Patterns Detailed

* **Finder Patterns (3 Corners):** Three nested boxes at top-left, top-right, and bottom-left. The ratio of module widths across any central cross-section is strictly **1:1:3:1:1**. This unique mathematical proportion allows real-time computer vision algorithms to detect candidate symbols in under 15 milliseconds.
* **Timing Tracks:** Alternating black and white modules connecting the finder patterns horizontally and vertically along row 6 and column 6. They provide the optical clock signal.
* **Alignment Patterns:** Present in Version 2 and above. A Version 7 code has 6 alignment patterns, while a Version 40 code contains 137 alignment patterns arranged in a regular grid to eliminate warping across physical curvatures.
* **Format Information:** A 15-bit sequence located adjacent to the separators. It encodes the 2-bit error correction level and 3-bit mask pattern, protected by 10 Bose-Chaudhuri-Hocquenghem (BCH) error correction bits.
    `,
    faqs: [
      { question: 'Why does a QR code not have a finder pattern in the bottom-right corner?', answer: 'The omission of a fourth finder pattern in the bottom-right corner is deliberate; it breaks symmetry and provides unambiguous orientation detection.' },
      { question: 'What are the small squares inside a dense QR code?', answer: 'Those are alignment patterns. They allow scanner algorithms to correct for physical warping and distortion when the code is printed on curved or flexible surfaces.' }
    ]
  },
  {
    slug: 'qr-code-contrast-ratio-requirements',
    title: 'QR Code Contrast Ratio Requirements: Color Pairing, Inversion & Sensor Thresholds',
    primaryKeyword: 'qr code contrast ratio',
    description: 'Ensure 100% scan reliability by mastering luminance contrast ratios, foreground-background pairing, and sensor binarization physics.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-04-28',
    updatedAt: '2026-10-03',
    readTime: '7 min read',
    category: 'Printing & Sizing',
    content: `
### 1. The Physics of Optical Sensor Binarization

Camera sensors do not read color; their CMOS image sensors capture luminance (grayscale intensity). The decoding software applies an adaptive thresholding algorithm (such as Otsu's binarization method or Bradley local thresholding) to partition each pixel into a binary \`0\` (light) or \`1\` (dark).

To achieve reliable binarization across diverse lighting conditions:
* **Minimum Luminance Contrast Ratio:** The relative luminance contrast between the foreground modules and background substrate must exceed **4.0:1** (ISO recommends **> 7.0:1** for commercial production).
* **Color Pairing Guidelines:**
  * **Safe Pairs:** Black on white, dark navy on white, deep forest green on pale yellow, charcoal on cream.
  * **Dangerous Pairs (High Failure Rate):** Red on white (red wavelengths appear bright white to monochrome sensors), yellow on white, gray on silver, orange on wood.

### 2. Can You Invert QR Code Colors (Light-on-Dark)?

While ISO/IEC 18004 allows for "reversed" or inverted symbols (white modules on a black background), **many legacy handheld barcode scanners, logistics imagers, and third-party scanning apps fail to decode inverted QR codes**. Unless your target audience exclusively uses modern iOS or flagship Android devices, always print **dark modules on a light background**.
    `,
    faqs: [
      { question: 'Can I make a QR code with my brand colors?', answer: 'Yes, provided the foreground modules are significantly darker than the background with a contrast ratio of at least 4.5:1. Avoid light pastels, neons, and reds.' },
      { question: 'Do inverted (white on black) QR codes scan reliably?', answer: 'Modern smartphone cameras decode inverted codes easily, but older hardware scanners and budget cameras often fail. Dark-on-light remains the global gold standard.' }
    ]
  },
  {
    slug: 'qr-code-svg-vs-png-vs-pdf',
    title: 'QR Code Export Formats: SVG vs PNG vs PDF for Print and Digital Media',
    primaryKeyword: 'svg vs png qr code',
    description: 'Compare vector SVG, lossless PNG, and print-ready PDF formats to select the right resolution, compression, and scaling for your QR deployment.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-05-04',
    updatedAt: '2026-10-02',
    readTime: '6 min read',
    category: 'Printing & Sizing',
    content: `
### 1. Vector (SVG / PDF) vs Raster (PNG / JPG)

* **Scalable Vector Graphics (SVG):** Encodes the QR code as mathematical paths (\`<rect>\` or \`<path>\` elements). An SVG can be scaled from a 1-centimeter business card to a 20-meter billboard with mathematical precision, zero pixelation, and an infinitesimal file size (< 5 KB).
* **Lossless Raster (PNG):** Stores data as a pixel matrix. High-resolution PNGs (1024x1024 px or 2048x2048 px) are ideal for digital screens, slide decks, and social media graphics.
* **Print PDF:** Embeds vector paths within a standardized document container suitable for prepress workflows, CMYK color spaces, and commercial offset printing.

### 2. Why JPEG Must Never Be Used for QR Codes

JPEG uses lossy discrete cosine transform (DCT) compression. At the crisp boundary between black and white modules, DCT compression generates "ringing artifacts" (fuzzy gray noise around high-frequency edges). This edge blur ruins scanner binarization and significantly increases scan failure rates.
    `,
    faqs: [
      { question: 'Which format should I send to my commercial print shop?', answer: 'Always send vector SVG or print-ready vector PDF. This allows the press operator to scale the artwork without loss of sharpness.' },
      { question: 'Can I use PNG for social media and website graphics?', answer: 'Yes, high-resolution PNG is the preferred format for web and digital displays because of its broad browser compatibility and lossless compression.' }
    ]
  },
  {
    slug: 'pakistan-regional-payment-qr-raast',
    title: 'Pakistan Payment QR Codes: Complete Raast, JazzCash & Easypaisa Integration Spec',
    primaryKeyword: 'raast qr code standard pakistan',
    description: 'Technical implementation details for generating EMVCo-compliant Raast P2M QR codes, JazzCash merchant till codes, and Easypaisa payment links.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-05-12',
    updatedAt: '2026-10-03',
    readTime: '9 min read',
    category: 'Business & Regional',
    content: `
### 1. The State Bank of Pakistan Raast QR Standard

Under the National Payment Systems Strategy, the State Bank of Pakistan (SBP) launched Raast as Pakistan's instant payment system. Raast QR codes comply with the international **EMVCo Merchant-Presented QR Code Specification** using Tag-Length-Value (TLV) payload encoding.

A compliant static Raast QR payload contains structured data objects:
* **Tag \`00\` (Payload Format Indicator):** \`01\`
* **Tag \`01\` (Point of Initiation Method):** \`11\` for static or \`12\` for dynamic
* **Tag \`26\` to \`51\` (Merchant Account Information):** Contains the IBAN / Raast Alias, Member Bank Identifier, and sub-tags
* **Tag \`52\` (Merchant Category Code):** Standard 4-digit ISO 18245 code
* **Tag \`53\` (Transaction Currency):** \`586\` (PKR ISO code)
* **Tag \`58\` (Country Code):** \`PK\`
* **Tag \`63\` (CRC-16/CCITT):** Mandatory 4-character checksum calculated over all preceding characters

### 2. JazzCash & Easypaisa Merchant Integration

For informal micro-merchants and freelance service providers operating outside full Raast corporate acquiring:
* **JazzCash Till Format:** Generates merchant payment strings routing directly to the 8-digit or 11-digit mobile account till identifier.
* **Easypaisa Format:** Encodes merchant wallet numbers with transaction reference parameters for instantaneous P2M settlement.

All payment QR codes generated on QR Code Tools execute client-side with zero intermediary financial storage, ensuring full confidentiality for both merchant and consumer.
    `,
    faqs: [
      { question: 'Is a Raast QR code compatible with all Pakistani banking apps?', answer: 'Yes. Any banking app or digital wallet integrated with the SBP Raast switch can scan and process an EMVCo-compliant Raast QR code.' },
      { question: 'Do customers incur extra fees for scanning a Raast QR code?', answer: 'No. Raast peer-to-peer and merchant payments are designed to be zero-fee or nominal-fee transactions under State Bank of Pakistan regulations.' }
    ]
  },
  {
    slug: 'india-upi-qr-code-specifications',
    title: 'India UPI QR Code Specifications: Deep Dive into the NPCI Protocol',
    primaryKeyword: 'upi qr code generator format',
    description: 'Technical breakdown of the National Payments Corporation of India (NPCI) UPI deep-link URI syntax, parameters, and merchant requirements.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-05-18',
    updatedAt: '2026-10-02',
    readTime: '7 min read',
    category: 'Business & Regional',
    content: `
### 1. The Unified Payments Interface URI Format

The National Payments Corporation of India (NPCI) standardizes UPI payment QR codes using the \`upi://pay\` custom URL scheme:
\`\`\`text
upi://pay?pa=merchant@upi&pn=Store%20Name&mc=5411&tid=TX123456&tr=INV001&tn=Payment&am=150.00&cu=INR
\`\`\`

#### Key URI Query Parameters:
* **\`pa\` (Payee Address):** The verified Virtual Payment Address (VPA) / UPI ID (e.g., \`name@okaxis\`, \`store@icici\`).
* **\`pn\` (Payee Name):** The legal or trade name of the recipient (URL encoded).
* **\`mc\` (Merchant Category Code):** Optional 4-digit code identifying business type.
* **\`am\` (Transaction Amount):** Fixed payment amount (e.g., \`150.00\`). If omitted, the payer enters the amount manually.
* **\`cu\` (Currency Code):** Strictly \`INR\` (Indian Rupee).
* **\`tn\` (Transaction Note):** Memo or invoice note visible to both parties.
    `,
    faqs: [
      { question: 'Can I leave the amount blank in a UPI QR code?', answer: 'Yes. If the "am" parameter is omitted, the customer scans the code and types in their own custom payment amount upon checkout.' },
      { question: 'Which apps can scan this UPI QR code?', answer: 'All NPCI-certified UPI applications, including Google Pay, PhonePe, Paytm, BHIM, and all major Indian banking apps.' }
    ]
  },
  {
    slug: 'qr-code-quiet-zone-rules',
    title: 'The 4-Module Quiet Zone Rule: Why Margins Are Critical for QR Scannability',
    primaryKeyword: 'qr code quiet zone margin',
    description: 'Understand the mathematical necessity of the 4-module quiet zone margin and how cropping borders causes catastrophic scan failures.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-05-24',
    updatedAt: '2026-10-01',
    readTime: '6 min read',
    category: 'Printing & Sizing',
    content: `
### 1. What Is the Quiet Zone?

The quiet zone is an unprinted, high-contrast border surrounding the entire perimeter of a QR code. Under the ISO/IEC 18004 specification, the quiet zone must have a **minimum thickness of four modules (4X)** on all four sides.

For example, if a QR code has an individual module width of 2 mm, the quiet zone must be at least:
$$4 \times 2\text{ mm} = 8\text{ mm on all sides}$$

### 2. Why Camera Sensors Require This Margin

When a mobile scanner captures an image, it searches for the three 1:1:3:1:1 finder patterns. If text, packaging artwork, or dark borders touch the outer modules of the finder pattern, the scanner cannot calculate the ratio. The quiet zone provides a clean baseline reference level for the camera sensor's automatic gain and thresholding circuits.
    `,
    faqs: [
      { question: 'Can I reduce the quiet zone to 2 modules?', answer: 'While Micro QR codes allow a 2-module margin, standard QR codes require 4 modules. Reducing it to 2 modules will cause scan failures in poor lighting or on budget devices.' },
      { question: 'Can the quiet zone be a colored background?', answer: 'Yes, as long as the color matches the light modules of the QR code and provides at least a 4:1 contrast ratio against the dark modules.' }
    ]
  },
  {
    slug: 'custom-logo-in-qr-code-without-breaking',
    title: 'How to Add a Custom Logo to a QR Code Without Breaking Scan Reliability',
    primaryKeyword: 'how to add logo to qr code',
    description: 'Learn the exact math and design constraints for embedding brand icons inside QR codes using Level H error correction and safe module zones.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-05-30',
    updatedAt: '2026-10-03',
    readTime: '7 min read',
    category: 'Fundamentals',
    content: `
### 1. The 30% Damage Budget

Embedding a company logo inside a QR code relies on Reed-Solomon error correction. At **Level H**, up to 30% of the symbol's codewords can be completely obliterated while still permitting 100% mathematical recovery.

However, good engineering requires you to **never consume the entire 30% budget with your logo**:
* **Recommended Logo Area:** Keep your central logo within **15% to 20%** of the total surface area.
* **Reserve Safety Headroom:** Leaving 10% to 15% of unused error correction capacity protects against physical dirt, surface scratches, and lens flare.

### 2. Forbidden Zones: Never Obscure Finder or Timing Patterns

Never place logos or graphics over:
1. The three corner **Finder Patterns** or their 1-module separators.
2. The horizontal and vertical **Timing Tracks** along row 6 and column 6.
3. The **Format Information Bits** bordering the finder patterns.
    `,
    faqs: [
      { question: 'What error correction level is mandatory for logo QR codes?', answer: 'Error Correction Level H (30% recovery) is mandatory whenever embedding a logo or graphic in the center of the code.' },
      { question: 'Should my logo have a white border around it?', answer: 'Yes. A small solid border around the logo prevents the graphic from merging with adjacent data modules, preserving contrast.' }
    ]
  },
  {
    slug: 'qr-codes-on-curved-surfaces',
    title: 'Printing QR Codes on Curved Surfaces: Cylinders, Bottles, and Cans',
    primaryKeyword: 'qr code on curved surface',
    description: 'Engineering formulas and chord-width calculations for placing scannable QR codes on cans, beverage bottles, tubes, and curved packaging.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-06-05',
    updatedAt: '2026-10-02',
    readTime: '7 min read',
    category: 'Printing & Sizing',
    content: `
### 1. The Cylindrical Distortion Problem

When a flat QR code is wrapped around a cylindrical surface (such as an aluminum soda can or glass bottle), the left and right edges recede away from the camera lens. This causes **tangential optical foreshortening**: the square modules on the outer columns appear compressed into thin rectangles.

If the apparent aspect ratio of the outer modules drops below **2:1**, standard binarization filters fail to recognize the modules.

### 2. The Arc-Length to Diameter Formula

To prevent scan failure on cylindrical containers, the horizontal arc width ($W$) of the QR code should not exceed **one-quarter of the cylinder circumference**:
$$W \le \frac{\pi \times D}{4} \approx 0.785 \times D$$
where $D$ is the outer diameter of the cylinder.

For example, on a beverage can with a diameter of 66 mm:
$$W_{\text{max}} \le \frac{3.14159 \times 66}{4} \approx 51.8\text{ mm}$$
Adhering to this limit ensures that the perspective distortion angle across the outer finder patterns stays below 45 degrees.
    `,
    faqs: [
      { question: 'Can I print a QR code vertically on a bottle?', answer: 'Yes. Placing the code on a flat vertical face of a tapered bottle avoids horizontal curve compression, resulting in faster scans.' },
      { question: 'What error correction should I use on curved containers?', answer: 'Use Error Correction Level Q (25%) or Level H (30%) to compensate for edge distortion caused by cylinder curvature.' }
    ]
  },
  {
    slug: 'vcard-standard-compatibility-ios-android',
    title: 'vCard QR Codes: Version 3.0 vs 4.0 Compatibility Across iOS and Android',
    primaryKeyword: 'vcard qr code format compatibility',
    description: 'Ensure digital business cards import seamlessly into Apple Contacts and Google Contacts without field truncation or encoding errors.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-06-12',
    updatedAt: '2026-10-01',
    readTime: '8 min read',
    category: 'Fundamentals',
    content: `
### 1. Why vCard 3.0 Remains the Universal Standard

The Internet Engineering Task Force (IETF) defines two prominent vCard specifications: vCard 3.0 (RFC 2426) and vCard 4.0 (RFC 6350). While vCard 4.0 provides modern syntax and UTF-8 enforcement, **vCard 3.0 remains the most universally supported format by native iOS and Android camera parsers**.

Many legacy mobile contact managers fail to recognize vCard 4.0 properties. For maximum reliability, QR Code Tools formats digital contact QR codes using strictly verified vCard 3.0 syntax.

### 2. Standard vCard 3.0 Payload Structure
\`\`\`text
BEGIN:VCARD
VERSION:3.0
N:Tariq;Hammad;;;
FN:CodexEngr
ORG:QR Code Tools
TITLE:Lead Systems Architect
TEL;TYPE=WORK,VOICE:+1234567890
EMAIL;TYPE=PREF,INTERNET:contact@freeqrcode.tools
URL:https://freeqrcode.tools
ADR;TYPE=WORK:;;Main Street;Karachi;;;Pakistan
END:VCARD
\`\`\`

### 3. Avoiding Payload Bloat

Encoding high-resolution base64 profile pictures or extensive biographical notes directly into a vCard QR code rapidly bloats the character count beyond 1,500 characters. This forces the matrix into Version 20+ (97x97 modules), resulting in an extremely dense symbol that entry-level smartphone cameras struggle to resolve. Keep vCard fields concise.
    `,
    faqs: [
      { question: 'Why does my vCard QR code show raw text instead of adding a contact?', answer: 'This occurs when mandatory headers (BEGIN:VCARD and VERSION:3.0) or delimiters are missing or corrupted.' },
      { question: 'Can I include a photo in an offline vCard QR code?', answer: 'Technically yes via BASE64, but it creates a massive, ultra-dense QR code that is nearly impossible to scan reliably on paper.' }
    ]
  },
  {
    slug: 'choosing-dpi-for-large-format-qr-banners',
    title: 'Billboard and Banner QR Codes: Resolution, DPI, and Viewing Distance Math',
    primaryKeyword: 'billboard qr code size dpi',
    description: 'Mathematical guidelines for calculating billboard QR code print dimensions, viewing distance angles, and driver scan feasibility.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-06-18',
    updatedAt: '2026-10-02',
    readTime: '7 min read',
    category: 'Printing & Sizing',
    content: `
### 1. The Human and Optical Geometry of Billboard Scans

Placing QR codes on highway billboards or elevated building wraps requires calculating both viewing distance and the angular optical resolution of mobile telephoto lenses:
$$\text{Symbol Dimension} = \frac{\text{Distance}}{10}$$

If an elevated billboard is positioned 30 meters from pedestrians standing at an intersection:
$$\text{Minimum Symbol Width} = \frac{30\text{ meters}}{10} = 3.0\text{ meters (approx. 10 feet)}$$

### 2. The Dangerous Fallacy of Highway Driver QR Codes

**Safety Warning:** Never place QR codes on highway billboards targeted at moving vehicular traffic. A vehicle traveling at 100 km/h (62 mph) moves approximately 28 meters per second. Attempting to locate, focus, and scan a QR code while driving introduces severe collision hazards. QR billboards should only be deployed in pedestrian-dense areas, transit waiting platforms, or static drive-thru lanes.
    `,
    faqs: [
      { question: 'What DPI should large banners be printed at for QR codes?', answer: 'For banners viewed from 2 to 5 meters, 100 to 150 DPI is sufficient. For highway billboards viewed from 20+ meters, 20 to 30 DPI is common.' },
      { question: 'Can phone cameras zoom in to scan distant QR codes?', answer: 'Modern smartphones with dedicated 3x and 5x optical telephoto lenses can scan smaller codes at distance, but you should never rely on user zoom for broad consumer campaigns.' }
    ]
  },
  {
    slug: 'barcode-vs-qr-code-difference',
    title: 'Barcode vs QR Code: 1D vs 2D Storage, Durability, and Industry Use Cases',
    primaryKeyword: 'barcode vs qr code difference',
    description: 'Compare linear 1D barcodes (EAN-13, UPC, Code 128) with 2D QR codes across data density, omnidirectional scanning, and error correction capabilities.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-06-25',
    updatedAt: '2026-10-03',
    readTime: '8 min read',
    category: 'Fundamentals',
    content: `
### 1. Structural Comparison: 1D vs 2D

* **1D Linear Barcodes (UPC, EAN-13, Code 128):** Store information horizontally using parallel bars and spaces of varying widths. They typically hold between 12 and 30 alphanumeric characters. They require a laser beam or linear CCD sensor aligned perpendicularly across all bars to decode.
* **2D Matrix Codes (QR Codes, Data Matrix):** Store data both horizontally and vertically across a grid of black and white modules. They store thousands of characters, feature built-in Reed-Solomon error correction, and support omnidirectional 360-degree scanning from any angle.

### 2. The GS1 Digital Link Migration

The global retail supply chain is actively transitioning from legacy 1D EAN/UPC barcodes to **GS1 Digital Link 2D QR codes**. A single GS1 QR code on retail packaging satisfies point-of-sale checkout scanners while simultaneously directing consumers to nutritional information, origin tracking, and recycling instructions when scanned by a smartphone.
    `,
    faqs: [
      { question: 'Can a smartphone camera read standard supermarket barcodes?', answer: 'Yes, modern smartphone cameras and dedicated scanner apps can read standard 1D barcodes like UPC and EAN-13, though QR codes scan faster and more reliably from any angle.' },
      { question: 'Why are 1D barcodes still used if QR codes are superior?', answer: '1D barcodes are deeply embedded in global point-of-sale infrastructure, automated warehouse laser conveyor sorters, and legacy retail cash registers.' }
    ]
  },
  {
    slug: 'qr-codes-for-visually-impaired',
    title: 'Accessible QR Codes: Tactile Indicators, High Contrast, and Inclusive Design',
    primaryKeyword: 'accessible qr code visually impaired',
    description: 'Design truly inclusive physical QR codes with tactile cutouts, high-contrast borders, and screen-reader accessible destination targets.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-07-02',
    updatedAt: '2026-10-01',
    readTime: '7 min read',
    category: 'Business & Regional',
    content: `
### 1. The Physical Discovery Challenge

For a blind or visually impaired individual, finding where a QR code is located on a flat piece of paper or packaging is the primary obstacle. Without a tactile indicator, the user cannot point their camera at the code.

#### Accessibility Engineering Guidelines:
* **Tactile Corner Notches:** Cut a physical semi-circular or triangular notch directly adjacent to the quiet zone of the QR code so users can locate it by touch.
* **Embossed Borders:** Utilize blind debossing or raised spot UV varnish along the perimeter of the quiet zone.
* **Braille Identification:** Include Grade 2 Braille text labeling the purpose of the code (e.g., "Scan for Audio Menu").
* **Accessible Landing Pages:** Ensure the target URL is fully compliant with WCAG 2.2 AA standards, featuring proper ARIA labels and screen-reader optimized headings.
    `,
    faqs: [
      { question: 'What is NaviLens and how does it compare to QR codes?', answer: 'NaviLens is a specialized high-contrast color matrix system that can be detected by visually impaired users from much greater distances and wider angles without precise camera alignment.' },
      { question: 'Can tactile embossing damage the QR code?', answer: 'As long as the embossing follows the outer border of the quiet zone and does not distort the inner module matrix, it provides excellent accessibility without compromising readability.' }
    ]
  },
  {
    slug: 'micro-qr-code-specifications',
    title: 'Micro QR Code Specifications: M1 to M4 Formats for Ultra-Small Components',
    primaryKeyword: 'micro qr code specification',
    description: 'Explore the compact Micro QR standard (M1 through M4), designed for microscopic electronics, medical vials, and space-constrained machinery.',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-07-10',
    updatedAt: '2026-10-03',
    readTime: '7 min read',
    category: 'Fundamentals',
    content: `
### 1. Why Standard QR Codes Cannot Fit Small Parts

A standard Version 1 QR code requires a 21x21 module grid plus a 4-module quiet zone, totaling 29x29 modules. When marking tiny printed circuit boards (PCBs), pharmaceutical vials, or watch movements, this spatial footprint is prohibitive.

### 2. Micro QR Architecture (ISO/IEC 18004 Annex K)

Micro QR codes conserve massive physical space through three architectural changes:
1. **Single Finder Pattern:** Contains only **one** position detection marker located at the top-left corner (instead of three).
2. **Reduced Quiet Zone:** Requires a quiet zone of only **2 modules** instead of 4.
3. **Compact Matrix Sizes:**
   * **M1 (11x11 modules):** Stores up to 5 numeric digits.
   * **M2 (13x13 modules):** Stores up to 10 numeric digits or 6 alphanumeric characters.
   * **M3 (15x15 modules):** Stores up to 21 numeric digits or 15 bytes.
   * **M4 (17x17 modules):** Stores up to 35 numeric digits or 21 alphanumeric characters with Reed-Solomon error correction.
    `,
    faqs: [
      { question: 'Can standard smartphone cameras scan Micro QR codes?', answer: 'Many default camera apps look specifically for three finder patterns and may not decode Micro QR codes without specialized industrial scanning apps.' },
      { question: 'What is the primary application for Micro QR codes?', answer: 'Micro QR codes are primarily used in electronics manufacturing, aerospace component tracking, and medical laboratory test tube labeling.' }
    ]
  }
];

const ALL_ARTICLES: Article[] = [...ARTICLES, ...NEW_ARTICLES];

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return ALL_ARTICLES;
}
