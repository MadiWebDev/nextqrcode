import type { Article } from '../articles';
import { art } from './helper';

export const batch6: Article[] = [
  art(
    'qr-code-generator-api-overview',
    'QR Code Generator APIs: REST, SVG Endpoints, and Rate Limits',
    'qr code generator api',
    'Compare server-side QR generation approaches: self-hosted libraries, cloud APIs, and client-side rendering.',
    'Fundamentals',
    '6 min read',
    '2026-09-03',
    `
### 1. Three Approaches

* **Client-side library:** JavaScript runs in the browser, no server required, data stays local, and there is no rate limit. Suitable for most web apps.
* **Self-hosted library:** Node.js, Python, Go, or Java library runs on your own server, giving full control over output format and size.
* **Third-party cloud API:** A hosted endpoint that accepts parameters and returns an image or SVG. Quickest to integrate but adds a network hop, cost, and a dependency.

### 2. Common REST Pattern

\`\`\`
GET /qr?data=https%3A%2F%2Fexample.com&ecl=M&size=300
\`\`\`
Typical parameters include \`data\` (URL-encoded payload), \`ecl\` (error correction level), \`size\` (pixels), and \`format\` (png or svg).

### 3. What to Watch

* Self-host or use a client library for sensitive payloads, because cloud APIs receive your data.
* Cache generated images to avoid regenerating the same code.
* Verify the output by scanning it programmatically in CI, not just visually.

### 4. SVG vs PNG from an API

SVG responses are resolution-independent. PNG responses need a size parameter; request at least 300 × 300 pixels and scale up for print.
    `,
    [
      { question: 'Should I use a cloud API or a client-side library?', answer: 'For public links, either works. For sensitive payloads, generate client-side so the data never leaves the browser.' },
      { question: 'Can I generate QR codes at build time?', answer: 'Yes. Run a library in your build script, cache the images, and serve them as static assets.' },
    ]
  ),
  art(
    'qr-code-in-pdf-documents',
    'Embedding QR Codes in PDFs: Vector Quality and Link Integrity',
    'qr code in pdf',
    'Best practices for adding scannable QR codes to PDF invoices, certificates, and reports.',
    'Printing & Sizing',
    '5 min read',
    '2026-09-04',
    `
### 1. Always Use Vector

Embed the code as a vector path inside the PDF, not a raster image. Most PDF generation libraries accept SVG directly. A vector code prints sharply at any size without pixelation.

### 2. Verifying the Link

Before distributing a PDF, scan the embedded code on a real device. PDF viewers sometimes rasterize embedded images at low resolution during preview.

### 3. Quiet Zone

PDF layout tools can shrink graphics to fit a box. Check that the quiet zone is preserved after layout; add extra padding inside the graphic if needed.

### 4. Accessibility

Add alt text to the QR code image element and include the URL as visible text or a hyperlink nearby. Screen readers cannot scan QR images.
    `,
    [
      { question: 'What format should I embed in a PDF?', answer: 'SVG or a native PDF path object. Avoid JPEG or low-resolution PNG.' },
      { question: 'How do I make the QR accessible in a PDF?', answer: 'Add alt text to the image and include the destination URL as plain text or a hyperlink.' },
    ]
  ),
  art(
    'qr-code-in-email-marketing',
    'QR Codes in Email Marketing: When They Work and When They Fail',
    'qr code in email',
    'Understand why most email QR codes go unscanned and the narrow use cases where they add value.',
    'Business & Regional',
    '5 min read',
    '2026-09-05',
    `
### 1. The Paradox

People who read email on a phone have no second device to scan with. People who read on a desktop can scan, but most will just click a link instead.

### 2. Where Email QR Codes Work

* Print-and-use coupons: the recipient prints the email and scans the code at the till.
* Transfer to a mobile device: a desktop reader clicks nothing but scans the code to open a deep link on their phone.
* Event tickets: the email contains the admission code as a QR.

### 3. Design for the Use Case

If the code is meant to be scanned from a printed page, embed a high-resolution image (at least 400 × 400 px). Include the URL in plain text and a hyperlink for readers who stay on screen.

### 4. Track Properly

Use a unique path per campaign so you distinguish QR scans from hyperlink clicks.
    `,
    [
      { question: 'Should every marketing email have a QR code?', answer: 'No. Only include one when there is a genuine reason to scan, such as a printable voucher or a phone handoff.' },
      { question: 'What resolution image should I embed?', answer: 'At least 400 × 400 pixels so it prints clearly from a typical email client.' },
    ]
  ),
  art(
    'qr-code-on-receipts-and-invoices',
    'QR Codes on Receipts and Invoices: e-Invoice Links and Warranty Registration',
    'qr code on receipt',
    'Add QR codes to paper and digital receipts for warranty links, payment confirmation, and e-invoice compliance.',
    'Business & Regional',
    '5 min read',
    '2026-09-06',
    `
### 1. Common Uses

* Link to a digital copy of the invoice on a secure page.
* Open a warranty registration form pre-filled with the order number.
* Confirm payment with a reference code the customer can verify.
* Encode a payment URI for outstanding invoices.

### 2. Payload Choice

For links, keep the URL short and use HTTPS. For payment URIs, follow the standard for your country (UPI, Pix, EPC QR, etc.).

### 3. Thermal Printers

Thermal receipts use heat-sensitive paper that fades over months. If the customer will scan the code much later, keep a digital backup or use a URL that stays valid.

### 4. Regulatory e-Invoice

Several countries now require QR codes on tax invoices (India, Saudi Arabia, Mexico). Follow the published specification from the relevant authority exactly, including any signature or hash fields.
    `,
    [
      { question: 'How long does a QR code on thermal paper last?', answer: 'Often only months before fading. Provide a digital copy for long-term warranty claims.' },
      { question: 'Does my country require a QR on invoices?', answer: 'Many do for B2B or high-value transactions. Check your national tax authority guidance.' },
    ]
  ),
  art(
    'qr-code-for-digital-business-cards',
    'Digital Business Cards and QR Codes: vCard, Links, and Wallet Passes',
    'digital business card qr code',
    'Compare vCard QR codes, profile link codes, and wallet passes for sharing contact details digitally.',
    'Business & Regional',
    '5 min read',
    '2026-09-07',
    `
### 1. vCard QR

Encodes the full vCard 3.0 payload so the recipient saves the contact with no internet needed. Size grows with more fields; keep it to name, phone, email, and one URL.

### 2. Profile Link QR

Encodes a URL to an online profile page. The symbol stays small, links are always current, and you can track visits. Requires connectivity at scan time.

### 3. Apple and Google Wallet Passes

A QR code on a printed card can link to a pass download. The pass adds to the phone wallet and shows updated contact details without requiring a re-scan.

### 4. Choosing

For offline reliability: vCard QR. For updating details without reprinting: link QR. For a premium experience with an app ecosystem: wallet pass.
    `,
    [
      { question: 'Can a vCard QR code include a photo?', answer: 'Technically yes in vCard format, but encoded photos make the symbol extremely dense. Use a URL instead.' },
      { question: 'What is the maximum vCard size that scans well on a business card?', answer: 'Keep the vCard under 200 bytes for a card-sized code. Trim to name, phone, and email.' },
    ]
  ),
  art(
    'qr-code-vs-nfc-comparison',
    'QR Code vs NFC: When to Use Each for Contactless Interactions',
    'qr code vs nfc',
    'Compare QR and NFC across cost, speed, range, device support, and security for physical product interactions.',
    'Fundamentals',
    '6 min read',
    '2026-09-08',
    `
### 1. How They Differ

A QR code is a printed optical symbol scanned by a camera. NFC (Near Field Communication) is a short-range radio protocol requiring a chip embedded in the object and a phone held within a few centimetres.

### 2. Cost

Printing a QR code costs almost nothing. An NFC chip adds roughly 5 to 50 US cents per unit plus integration into packaging or the product.

### 3. Speed and Friction

NFC tap is faster than pointing a camera and waiting to focus. QR code scanning works at a short range from across the room and needs no radio hardware.

### 4. Device Support

QR codes work on any phone with a camera and a reader app. NFC requires an NFC-enabled phone, which is the majority of modern devices but not all.

### 5. Security and Tamper-Evidence

Both can be physically replaced or cloned. NFC chips can implement challenge-response cryptography; QR codes cannot authenticate themselves.

### 6. When to Use Which

Use QR for posters, menus, and large-format print. Use NFC when fast tap interaction matters, such as product authentication or transit cards.
    `,
    [
      { question: 'Is NFC always faster than QR?', answer: 'In good light with a modern phone, QR scanning is nearly instant. NFC is slightly faster and needs no camera pointing.' },
      { question: 'Can a product have both a QR code and NFC?', answer: 'Yes, and it is common in authentication and ticketing. Each serves a different segment of users.' },
    ]
  ),
  art(
    'qr-code-logo-design-best-practices',
    'Adding a Logo to a QR Code: Safe Size, Placement, and Error Correction',
    'qr code logo design',
    'Design rules for placing a brand logo inside a QR code without breaking scan reliability.',
    'Printing & Sizing',
    '6 min read',
    '2026-09-09',
    `
### 1. Error Correction Level

Always generate the base symbol at level H (30% recovery headroom) before placing a logo. A logo covering more than about 15% of the module area with level M or L will destroy the code.

### 2. Coverage Limit

Keep the logo footprint to 15% or less of the total symbol area. For a 100 × 100 px symbol, that is about a 38 × 38 px logo. Centering is almost always best.

### 3. Background Padding

Add a solid white or light background behind the logo to separate it clearly from the dark modules around it. Without padding, modules bleed into the logo edges and confuse decoders.

### 4. Contrast Check

The logo itself must not place dark elements over dark module areas at the edges of the logo zone. Transparent-background logos often cause this. Use a filled white square behind the logo.

### 5. Always Verify

After placing the logo, scan the result on at least three different devices under typical lighting. Do not assume it works because the symbol looks intact.
    `,
    [
      { question: 'What error correction level should I use with a logo?', answer: 'Level H. It provides 30% recovery capacity, which the logo area consumes.' },
      { question: 'How big can a logo be in the center?', answer: 'Up to about 15% of the symbol area at level H. Going larger risks scan failure.' },
    ]
  ),
  art(
    'qr-code-colors-accessibility',
    'QR Code Colors and Accessibility: Meeting WCAG Contrast for Scannable Codes',
    'qr code colors accessibility',
    'Design colorful QR codes that meet accessibility contrast standards and still scan reliably.',
    'Printing & Sizing',
    '5 min read',
    '2026-09-10',
    `
### 1. Two Audiences

A QR code must satisfy an optical sensor (contrast ratio for the decoder) and a human reader (WCAG 1.4.3 contrast ratio of 4.5:1 for surrounding text, and general visual clarity).

### 2. Sensor Contrast

Camera-based decoders require a luminance contrast of at least 4:1 between dark modules and the background. The ISO standard recommends 7:1 or better for reliable scanning.

### 3. Using Brand Colors Safely

Test candidate palettes with a luminance contrast calculator before printing:
* Dark modules must be darker than the background in grayscale.
* Avoid red on white: red appears bright in a grayscale conversion.
* Blues, dark greens, dark purples, and charcoals generally work well.

### 4. Practical Steps

1. Pick your background (ideally off-white or light grey, not pure white on OLED screens, which can cause bloom).
2. Choose a foreground at least 4:1 contrast ratio.
3. Generate and scan the result on a real device in ambient indoor light.
    `,
    [
      { question: 'Can I use my brand colour for QR modules?', answer: 'Yes, if it passes a 4:1 luminance contrast check against the background. Test on real devices before printing.' },
      { question: 'Why does a red QR code often fail to scan?', answer: 'Red is bright in grayscale. The decoder sees low contrast between red modules and white, making binarization unreliable.' },
    ]
  ),
  art(
    'qr-code-testing-before-printing',
    'QR Code Testing Checklist Before Going to Print',
    'test qr code before printing',
    'A reproducible testing checklist to catch silent QR failures before a print run.',
    'Printing & Sizing',
    '6 min read',
    '2026-09-11',
    `
### 1. Test on Real Devices

Emulators and design software previews are not enough. Scan on a recent iPhone, a mid-range Android, and an older budget Android.

### 2. Test Conditions

* Good indoor light (office).
* Dim light (corridor, evening).
* Bright outdoor light with glare on the surface.
* The code held at the intended scanning distance, not closer.

### 3. Verify the Destination

Scan the code and confirm the destination URL is correct and loads fully. A typo in a URL is impossible to see by looking at the code.

### 4. Print a Proof

Print the design at actual size on the actual stock and scan the proof, not a monitor rendering. Colors shift and module sharpness changes between screen and print.

### 5. Check the Quiet Zone

On the print proof, measure the quiet zone with a ruler. It should be at least four modules wide on all sides.

### 6. Document the Code

Keep a record of every code printed: the slug or campaign name, the destination URL, the date, and the location. You will need this when a destination changes.
    `,
    [
      { question: 'Is scanning on a laptop webcam a valid test?', answer: 'No. Use real phones. Webcams have different optics and autofocus behavior.' },
      { question: 'Do I need to test every variant in a batch?', answer: 'Test a representative sample. If all codes share the same template and payload length, one thorough test covers the batch.' },
    ]
  ),
  art(
    'qr-code-for-feedback-and-surveys',
    'QR Codes for Customer Feedback and Surveys: Response Rate Tips',
    'qr code customer feedback survey',
    'Use QR codes to collect customer feedback at the point of experience and improve response rates.',
    'Business & Regional',
    '5 min read',
    '2026-09-12',
    `
### 1. Why QR for Feedback

Paper forms get abandoned or lost. A QR code at the moment of experience, such as at a restaurant table or checkout counter, lowers the effort barrier significantly.

### 2. Survey Design

Keep the survey to three to five questions. More than five questions kills completion rates on mobile. Use rating scales and one open text field.

### 3. Placement

Place the code on receipts, table tents, or the product packaging. Include a short reason: "Your feedback improves our menu" is better than a bare code.

### 4. Incentives

A small discount or entry into a draw increases response rates but can bias answers. Decide whether you want volume or unbiased quality.

### 5. Closing the Loop

Share a summary of actions taken on the feedback. Customers who see results are more likely to respond next time.
    `,
    [
      { question: 'How long should a feedback survey be?', answer: 'Three to five questions for mobile. Any more and completion rates fall sharply.' },
      { question: 'Should I offer an incentive for completing the survey?', answer: 'It helps response volume but may introduce response bias. Use incentives for low-stakes satisfaction surveys.' },
    ]
  ),
];
