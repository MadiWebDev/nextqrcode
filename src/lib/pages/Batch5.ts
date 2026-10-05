import type { Article } from '../articles';
import { art } from './helper';

export const batch5: Article[] = [
  art(
    'qr-code-event-tickets-security',
    'QR Code Event Tickets: Preventing Duplicates and Screenshot Fraud',
    'qr code event tickets',
    'Design ticket QR codes that are single-use, verifiable, and resistant to copying.',
    'Business & Regional',
    '6 min read',
    '2026-08-24',
    `
### 1. A QR Code Is Not a Secret

Anyone who photographs a ticket QR can present it. Security must come from the backend, not the symbol.

### 2. Design Pattern

* Encode a long, random, unguessable token or a signed payload.
* Validate at the gate against the database and mark the ticket as used on first entry.
* Show clear "already scanned" messages with the time and gate.
* Use short-lived rotating codes in the ticket app for high-value events.

### 3. Offline Gates

If connectivity is poor, preload a signed ticket list to the scanner devices and sync scans when back online.

### 4. Printing

Use level M, large modules, and matte stock for printed tickets.
    `,
    [
      { question: 'Can someone copy my ticket QR code?', answer: 'Yes, so the first valid scan must invalidate it server-side.' },
      { question: 'Should ticket QR codes be static?', answer: 'The symbol can be static if the token is unguessable and validated centrally.' },
    ]
  ),
  art(
    'qr-codes-for-clinics-and-appointments',
    'QR Codes for Clinics: Check-In, Forms, and Appointment Reminders',
    'qr codes for clinics',
    'Use QR codes in clinics to cut waiting-room paperwork while respecting patient privacy.',
    'Business & Regional',
    '6 min read',
    '2026-08-25',
    `
### 1. Useful Applications

* Waiting-room check-in and intake forms.
* Appointment booking pages on reception signage.
* Post-visit instructions and feedback links.

### 2. Privacy First

Never encode patient identifiers or medical details in a printed QR code. Link to an authenticated page. Follow local health data rules such as HIPAA, GDPR, or applicable national law, and use HTTPS only.

### 3. Patient Experience

Provide a paper alternative, large type, and staff assistance for older patients. Keep forms mobile-friendly and short.

### 4. Hygiene Durability

Use wipeable, matte laminated surfaces and replace worn signs promptly.
    `,
    [
      { question: 'Can I put patient names in a QR code?', answer: 'Avoid it. Anyone who sees the code can read the data. Use an authenticated link instead.' },
      { question: 'Should I still offer paper forms?', answer: 'Yes, for accessibility and patients without a smartphone.' },
    ]
  ),
  art(
    'gs1-digital-link-uri-structure',
    'GS1 Digital Link: How a Product QR Code Encodes GTIN, Lot, and Serial',
    'gs1 digital link qr code',
    'Understand the URI structure behind GS1 Digital Link and why retailers are moving to 2D codes.',
    'Business & Regional',
    '6 min read',
    '2026-08-26',
    `
### 1. The URI Pattern

GS1 Digital Link places identifiers in a web address, with each identifier introduced by its Application Identifier:
\`https://example.com/01/09506000134352/10/LOT123/21/SER456\`
* 01 is the GTIN.
* 10 is the batch or lot.
* 21 is the serial number.

### 2. One Code, Two Jobs

The same symbol can be read by point-of-sale scanners that extract the GTIN, and by consumers whose phones open a product page with ingredients, recycling guidance, or authenticity checks.

### 3. Implementation Notes

* Use a stable resolver domain you control.
* Keep identifiers valid, including the GTIN check digit.
* Print to GS1 quality guidance and verify scanning at the point of sale.
    `,
    [
      { question: 'Does GS1 Digital Link replace the EAN barcode?', answer: 'It is intended to coexist and gradually complement it. Retailers must support 2D scanning at checkout.' },
      { question: 'Can I use any QR generator?', answer: 'The payload must follow the GS1 syntax, and print quality must meet GS1 guidance.' },
    ]
  ),
  art(
    'brazil-pix-qr-code-br-code',
    'Brazil Pix QR Codes: BR Code Payload Structure',
    'pix qr code payload',
    'A technical overview of the EMV-based BR Code used for Pix payments in Brazil.',
    'Business & Regional',
    '6 min read',
    '2026-08-27',
    `
### 1. Standard Basis

Pix QR codes follow the EMV merchant-presented format, published by the Central Bank of Brazil as BR Code. The payload is a string of tag-length-value fields.

### 2. Key Fields

* **00:** Payload format indicator, 01
* **26:** Merchant account information containing the GUI br.gov.bcb.pix and the Pix key
* **52:** Merchant category code
* **53:** Currency 986 (Brazilian real)
* **54:** Amount (optional for static)
* **58:** Country code BR
* **59, 60:** Merchant name and city
* **62:** Additional data such as a transaction reference
* **63:** CRC16 checksum

### 3. Notes

Static codes can omit the amount so the payer enters it. Always generate from the official specification and verify by scanning with a banking app. Check the Central Bank's current manual for field limits before implementing.
    `,
    [
      { question: 'What currency code does Pix use?', answer: '986 for Brazilian real.' },
      { question: 'Is the checksum required?', answer: 'Yes. The CRC16 in field 63 must be valid or banking apps will reject the code.' },
    ]
  ),
  art(
    'thailand-promptpay-qr-code-format',
    'Thailand PromptPay QR Codes: EMV Payload and Recipient Formats',
    'promptpay qr code format',
    'Understand how PromptPay QR payloads identify a mobile number or national ID and encode an amount.',
    'Business & Regional',
    '6 min read',
    '2026-08-28',
    `
### 1. Standard Basis

PromptPay QR codes use the EMV merchant-presented format. Currency is 764 (Thai baht) and country is TH.

### 2. Key Fields

* **00:** Payload format indicator
* **01:** Initiation method, 11 for static or 12 for dynamic
* **29:** PromptPay merchant account information, with application identifier A000000677010111
* **54:** Amount (optional)
* **53:** Currency 764
* **58:** Country TH
* **63:** CRC16 checksum

### 3. Recipient Formats

Inside field 29 the recipient can be a mobile number, written with the 0066 country prefix in place of the leading zero, or a national or tax ID. Verify the sub-tag layout against the current Bank of Thailand and operator documentation before you ship.
    `,
    [
      { question: 'What currency code does PromptPay use?', answer: '764 for Thai baht.' },
      { question: 'Can I include an amount?', answer: 'Yes, in field 54, and then set initiation method accordingly. Omit it for an open-amount static code.' },
    ]
  ),
  art(
    'sepa-epc-qr-code-girocode',
    'SEPA EPC QR Code (GiroCode): Payload Format for Euro Bank Transfers',
    'epc qr code sepa',
    'Build the EPC069-12 payload used by European banking apps to prefill a SEPA credit transfer.',
    'Business & Regional',
    '6 min read',
    '2026-08-29',
    `
### 1. Line-Based Payload

The EPC QR code is plain text with one field per line:
\`\`\`text
BCD
002
1
SCT
BICCODEXXX
Account Holder Name
DE89370400440532013000
EUR12.50

Invoice 2026-118
\`\`\`

### 2. Field Notes

* Service tag BCD, version 001 or 002, character set 1 for UTF-8, identification SCT.
* BIC is optional in version 002 within the SEPA area.
* The amount is EUR followed by a decimal number.
* Use either a structured creditor reference or unstructured remittance text, not both.

### 3. Tips

Use error correction level M, keep the name and reference short, and check against your own banking app before printing invoices.
    `,
    [
      { question: 'Which currencies does the EPC QR support?', answer: 'Only euro.' },
      { question: 'Do all banking apps scan it?', answer: 'Many European apps do, but support varies by country and bank. Test before rollout.' },
    ]
  ),
  art(
    'bilingual-english-urdu-qr-signage',
    'Bilingual English and Urdu QR Signage: Layout, RTL Typography, and Quiet Zones',
    'urdu english qr code signage',
    'Design clear bilingual signs where right-to-left Urdu text and left-to-right English sit beside a QR code.',
    'Business & Regional',
    '6 min read',
    '2026-08-30',
    `
### 1. Reading Direction

English reads left to right and Urdu right to left. Place each instruction block aligned to its own language and put the QR code on a neutral central axis, or below both blocks.

### 2. Typography

Urdu is usually set in Nastaliq or a clear Naskh style. Nastaliq needs generous line height, so use a font designed for screens or signage and avoid making the text too small.

### 3. Quiet Zone

Keep at least 4 modules of blank space on all sides of the code, with no Urdu or English text touching it. Do not tuck calligraphic flourishes into the margin.

### 4. Content

Put the action in both languages ("Scan to see the menu" and its Urdu equivalent) and use a destination page that offers a language toggle. Have a native speaker proofread the final print.
    `,
    [
      { question: 'Should I make two QR codes, one per language?', answer: 'Usually not. One code to a page with a language toggle is simpler and cheaper.' },
      { question: 'Can I embed Urdu text directly in the code?', answer: 'It is possible with UTF-8, but a short URL to an Urdu page is more reliable and smaller.' },
    ]
  ),
  art(
    'qr-codes-for-schools-and-classrooms',
    'QR Codes in Classrooms: Practical Uses and Safe Deployment',
    'qr codes in classroom',
    'Use QR codes for assignments, library resources, and parent communication without creating safety risks.',
    'Business & Regional',
    '5 min read',
    '2026-08-31',
    `
### 1. Good Uses

* Link posters to reading lists, videos, and worksheets.
* Label library shelves with catalog pages.
* Give parents quick links to calendars and forms.

### 2. Safety

Link only to vetted, school-controlled pages. Check pages periodically, because third-party sites can change content. Avoid collecting student data via unmanaged forms and follow your school's privacy policy.

### 3. Accessibility

Provide the short URL in text and make sure pages work on shared devices and low-end phones. Offer alternatives for students without phones.

### 4. Durability

Laminate printed codes with a matte finish, and keep a master list of each code and its destination.
    `,
    [
      { question: 'Do students need their own phones?', answer: 'No. Use shared tablets or provide printed links as alternatives.' },
      { question: 'How do I keep linked pages safe?', answer: 'Host them on school systems or review third-party pages regularly.' },
    ]
  ),
  art(
    'qr-codes-for-nonprofits-and-donations',
    'QR Codes for Nonprofits: Donation Pages, Posters, and Pledge Drives',
    'qr code for donations',
    'Raise more with QR codes by linking to fast mobile donation pages and tracking each placement.',
    'Business & Regional',
    '6 min read',
    '2026-09-01',
    `
### 1. Fast Mobile Donation Flow

Most abandonment happens on slow, long forms. Link to a mobile-first page with preset amounts, wallet payment options, and minimal fields.

### 2. Placement and Context

Put codes on posters, receipts, event tables, and thank-you cards. Give a reason: "Scan to give 500 rupees for a school meal" is better than a bare code.

### 3. Tracking

Use a different short path per placement or campaign so you can compare results, and keep the mapping documented.

### 4. Trust

Show the organization's name, registration details, and a visible privacy statement on the page. Protect printed codes against sticker overlays, since fake donation codes are a known risk.
    `,
    [
      { question: 'Should a donation QR use a dynamic service?', answer: 'Not necessarily. A short path on your own domain gives tracking and flexibility without third-party lock-in.' },
      { question: 'Can I put a payment account directly in the code?', answer: 'Yes, in countries with standard payment QR formats, but a donation page also supports receipts and recurring giving.' },
    ]
  ),
  art(
    'qr-codes-for-museums-and-tourism',
    'QR Codes for Museums and Tourist Sites: Multilingual Guides and Accessibility',
    'qr codes for museums',
    'Design visitor QR codes that deliver multilingual audio and text without cluttering exhibits.',
    'Business & Regional',
    '6 min read',
    '2026-09-02',
    `
### 1. Content Approach

Link each exhibit code to a lightweight page with short text, audio, and images. Avoid auto-playing sound, and support captions and transcripts.

### 2. Languages

Offer language selection on arrival rather than separate codes. Test right-to-left languages such as Urdu and Arabic on real devices.

### 3. Connectivity

Many galleries have weak signal. Keep pages small or provide on-site WiFi and a caching progressive web app.

### 4. Physical Design

Mount at a consistent height near the label, with a clear quiet zone and matte, non-reflective material. Add a short URL and a tactile marker so visitors with low vision can find the code.
    `,
    [
      { question: 'Should every exhibit have its own code?', answer: 'Yes, and each should link to a specific page so visitors get relevant content.' },
      { question: 'How do I help visitors with no signal?', answer: 'Provide on-site WiFi or pre-downloadable guides, and keep pages lightweight.' },
    ]
  ),
];