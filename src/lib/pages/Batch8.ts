import type { Article } from '../articles';
import { art } from './helper';

export const batch8: Article[] = [
  art(
    'qr-code-for-inventory-management',
    'QR Codes for Inventory Management: Labelling, Scanning Workflows, and Asset Tracking',
    'qr code inventory management',
    'Replace spreadsheets and barcode scanners with QR-based inventory workflows for small to mid-size warehouses.',
    'Business & Regional',
    '6 min read',
    '2026-09-23',
    `
### 1. Why QR for Inventory

A QR code can store a unique item ID, location, and batch reference in a single symbol. Most staff smartphones can scan without a dedicated device, lowering hardware costs.

### 2. Label Design

Print the item ID in human-readable text alongside the code. Use level Q, 0.5 mm minimum module size, and durable polyester or synthetic labels in environments with moisture or chemicals.

### 3. Scanning Workflow

1. Receive: scan item QR into the system as "in stock" at a specific location.
2. Pick: scan to decrement stock and record who moved it.
3. Ship: scan for outbound confirmation.
4. Count: periodic scan to reconcile actual with system stock.

### 4. Unique Code Per Item vs Per SKU

Serialised codes (one per unit) enable precise tracking but cost more to print and manage. SKU-level codes are simpler but cannot track individual items.

### 5. System Integration

Expose a simple POST endpoint or use a spreadsheet-backed webhook. Keep the mapping of QR payload to item description in a database you control.
    `,
    [
      { question: 'Should I use a QR code or a barcode for inventory?', answer: 'QR codes hold more data and scan at any angle. Standard 1D barcodes work fine for SKU-only tracking with existing handheld scanners.' },
      { question: 'How do I prevent duplicate label printing?', answer: 'Generate IDs server-side with a unique constraint and print from a confirmed batch, never re-printing without a new ID.' },
    ]
  ),
  art(
    'qr-code-for-library-books',
    'QR Codes in Libraries: Shelf Labels, Self-Checkout, and Catalogue Links',
    'qr code library books',
    'Use QR codes on library shelves and books to simplify checkout, hold requests, and digital catalogue access.',
    'Business & Regional',
    '5 min read',
    '2026-09-24',
    `
### 1. Applications

* Book spine or inside-cover label linking to the catalogue record.
* Shelf-end signs with a QR to the catalogue browse for that section.
* Self-checkout machine supplement: scan book then member card.
* Hold-pickup shelf: member scans a code to confirm collection.

### 2. Catalogue Link Format

Encode a stable permalink to the catalogue item. Many library catalogue systems support a direct URL per record. Avoid session-based or search-result URLs that expire.

### 3. Privacy

Member QR codes for borrowing must not contain personal data in plain text. Use a unique opaque token that the backend resolves to the member account.

### 4. Durability

Book labels face abrasion. Use a durable adhesive label with matte laminate, and place the label in a consistent position such as the lower inside cover.
    `,
    [
      { question: 'Can a patron scan a shelf QR without logging in?', answer: 'Yes for public catalogue links. Reserve authentication for checkout or hold requests.' },
      { question: 'Should member QR codes contain their name or barcode?', answer: 'Use an opaque token. Including a member number in plain text exposes personal data.' },
    ]
  ),
  art(
    'qr-code-for-manufacturing-work-instructions',
    'QR Codes for Manufacturing: Work Instructions, Travellers, and MES Integration',
    'qr code manufacturing work instructions',
    'Link shop-floor QR codes on parts, jigs, and stations to digital work instructions and quality records.',
    'Business & Regional',
    '6 min read',
    '2026-09-25',
    `
### 1. The Traveller

A manufacturing traveller is a document that travels with a part through production. A QR code printed on the traveller links to the job record in the MES (Manufacturing Execution System), giving operators instant access to the latest work instruction revision.

### 2. Station Codes

Fixed QR codes at each station link to the station's current work instruction and calibration records. When instructions change, update the target page; the printed code stays valid.

### 3. Part Serialisation

A QR code on each part encodes its serial number. Scanning at each operation records the timestamp, operator, and pass/fail result, building a complete production history.

### 4. DPM on Metal

For metal parts that go through heat treatment or other harsh processes, use direct part marking, not labels. See the direct part marking article for method choices.
    `,
    [
      { question: 'Do I need a dedicated MES to use QR codes on the shop floor?', answer: 'No. A simple web app backed by a spreadsheet or database can receive scan events and serve instruction pages.' },
      { question: 'What if the floor has no WiFi?', answer: 'Use short-lived offline-capable progressive web apps that cache the current instruction set, or synchronise via local network.' },
    ]
  ),
  art(
    'qr-code-plant-labels-and-gardening',
    'QR Codes for Plant Labels and Garden Identification',
    'qr code plant label garden',
    'Add QR codes to plant pots, botanical displays, and community gardens for growing guides and species identification.',
    'Business & Regional',
    '4 min read',
    '2026-09-26',
    `
### 1. What to Link

* Species and common name pages.
* Watering and care instructions.
* Harvest calendar for vegetable gardens.
* Botanical garden exhibit information in multiple languages.

### 2. Durable Labels

Outdoor plant labels face UV, moisture, and soil contact. Use UV-stabilised acrylic, slate, or ceramic tiles with engraved or UV-printed codes. Avoid paper labels outdoors.

### 3. Size and Module Count

Keep the payload to a short URL. Even a 3 × 3 cm code is readable in good outdoor light. Test scanning in direct sunlight and partial shade.

### 4. Community Garden Setup

A central QR index sign can link to a plot map where visitors tap individual plot squares for that plot's growing guide. This avoids one physical code per plant.
    `,
    [
      { question: 'What material lasts longest for outdoor plant QR labels?', answer: 'UV-stable acrylic, engraved slate, and ceramic resist weather best. Standard paper labels fade and peel within weeks.' },
      { question: 'Can I link to a Wikipedia page?', answer: 'Yes, but host your own copy or a curated page if you want controlled, branded content.' },
    ]
  ),
  art(
    'qr-code-for-food-labelling',
    'QR Codes on Food Labels: Ingredients, Allergens, and Country-Specific Rules',
    'qr code food labelling',
    'Use QR codes on food packaging to extend label space with ingredient details, allergen info, and sustainability data.',
    'Business & Regional',
    '6 min read',
    '2026-09-27',
    `
### 1. Regulatory Context

In the EU, UK, and many other markets, mandatory allergen information must appear in print on the label, not only behind a QR code. QR codes are supplementary. Check your market's rules before removing mandatory text.

### 2. Beneficial Uses

* Full ingredient list when space is limited.
* Nutritional information in multiple languages.
* Origin story and sustainability report.
* Recipes and serving suggestions.

### 3. GS1 Digital Link

Retailers and supply chains increasingly use GS1 Digital Link QR codes that combine the GTIN with traceable data. This supports both consumer information and supply-chain verification from one symbol.

### 4. Accessibility

Provide a plain-text URL near the code. Consumers with disabilities who cannot scan should be able to access the same information online.
    `,
    [
      { question: 'Can I put all allergen information only in a QR code?', answer: 'In most jurisdictions, no. Allergen information must be printed on the label. QR is supplementary.' },
      { question: 'What is GS1 Digital Link and should I use it?', answer: 'It is the GS1 standard for embedding a GTIN and traceability data in a QR code. Large retailers are beginning to require it.' },
    ]
  ),
  art(
    'qr-code-for-pharmaceutical-packaging',
    'QR Codes on Pharmaceutical Packaging: Serialisation, DSCSA, and FMD Compliance',
    'qr code pharmaceutical packaging',
    'How QR codes on drug packs satisfy track-and-trace regulations in the USA, EU, and other markets.',
    'Business & Regional',
    '7 min read',
    '2026-09-28',
    `
### 1. Why Regulation Drives Pharma QR

Counterfeit medicines kill. Regulators require unique serial numbers on saleable units so pharmacists can verify authenticity before dispensing.

### 2. USA: DSCSA

The Drug Supply Chain Security Act requires a 2D barcode (typically Data Matrix) encoding the GTIN, serial number, lot, and expiry in GS1 Application Identifier format. From 2025, all dispensers must be able to verify these codes electronically.

### 3. EU: Falsified Medicines Directive

FMD requires Data Matrix or QR codes on most prescription packs with the product code, serial number, batch, and expiry. Codes are verified against a pan-European repository at the point of dispensing.

### 4. Implementation

Use a GS1-certified packaging software vendor. Do not attempt manual generation of serialised pharma codes. Generate, print, verify, and report to the relevant national repository as required by law.
    `,
    [
      { question: 'Can I use a QR code instead of Data Matrix for pharma compliance?', answer: 'DSCSA allows any GS1-conformant 2D barcode. EU FMD permits both Data Matrix and QR. Check the current regulations for your market.' },
      { question: 'Do I need to register each code?', answer: 'Yes, in most regulated markets. Codes must be reported to the national or supranational repository at batch release.' },
    ]
  ),
  art(
    'qr-code-for-vehicle-identification',
    'QR Codes for Vehicle Identification: VIN, Service History, and Inspection Labels',
    'qr code vehicle identification',
    'Use QR codes on vehicles for VIN lookups, service history access, and roadworthiness inspection stickers.',
    'Business & Regional',
    '5 min read',
    '2026-09-29',
    `
### 1. Use Cases

* Windscreen sticker linking to the vehicle's public registration and MOT or inspection records.
* Service label inside the bonnet with the VIN and a link to the workshop service history.
* Parking permit sticker linking to the registration system.
* Fleet management codes on heavy goods vehicles.

### 2. Payload

Encode the VIN or a short URL to a lookup page. Do not encode the full service record in the QR itself; the symbol would be too dense and the data would quickly be out of date.

### 3. Durability

Windscreen stickers face UV, heat, and cleaning chemicals. Use polyester or polycarbonate labels rated for automotive use. Test before committing to a full fleet print run.

### 4. Privacy

Linking a VIN to a public page is fine. Avoid linking to pages that expose the owner's personal details without authentication.
    `,
    [
      { question: 'Should I encode the full service history in the QR?', answer: 'No. Encode a URL to a hosted record. The data is too large for a reliable symbol and will be out of date after the next service.' },
      { question: 'What label material works on a hot engine bay?', answer: 'Polyimide or metal-faced labels rated above 150°C. Standard paper and vinyl will fail.' },
    ]
  ),
  art(
    'qr-code-for-property-management',
    'QR Codes for Property Management: Maintenance Requests, Tenant Guides, and Access',
    'qr code property management',
    'Use QR codes in rental properties and offices to simplify maintenance reporting and tenant onboarding.',
    'Business & Regional',
    '5 min read',
    '2026-09-30',
    `
### 1. Maintenance Request Codes

Place a QR in each room or common area. Scanning opens a pre-filled form that records the unit number and area automatically via the URL parameter. The tenant describes the fault; the team receives a structured ticket.

### 2. Tenant Welcome Pack

A QR code in the welcome letter links to a digital guide covering WiFi, utility contacts, rubbish days, and emergency numbers. Updating the page keeps the printed code valid without reprinting.

### 3. Utilities and Meter Reading

Link codes near meters to the utility provider's self-meter-read portal or a form the managing company monitors.

### 4. Access Control

QR codes are used in some smart lock systems as a temporary access token. These must use a signed, time-limited payload verified by the lock server; a static or guessable code creates a security risk.
    `,
    [
      { question: 'Can a tenant submit maintenance requests without an app?', answer: 'Yes. A web form linked from the QR code works on any phone without installation.' },
      { question: 'Are QR smart lock codes secure?', answer: 'Only if they use short-lived signed tokens verified server-side. Static QR codes for locks are a security risk.' },
    ]
  ),
  art(
    'qr-code-for-product-authentication',
    'QR Codes for Product Authentication: Anti-Counterfeit Approaches',
    'qr code product authentication anti-counterfeit',
    'How brands use QR codes combined with cryptographic signatures, covert features, and databases to fight counterfeiting.',
    'Security & Scanning',
    '7 min read',
    '2026-10-01',
    `
### 1. The Problem with Plain QR Codes

A standard QR code is trivially copyable. A counterfeiter can photograph the code and reproduce it on their fake product. Authentication requires something the counterfeiter cannot easily replicate.

### 2. Signed Payloads

Encode a cryptographically signed token containing the serial number, product code, and expiry. Verification requires the brand's public key. A copied token verifies correctly but the server flags the duplicate serial as counterfeit on the second scan.

### 3. Server-Side Scan Counting

Every scan is logged with time and location. Patterns like thousands of scans from one location, or simultaneous scans from different continents, flag suspicious activity. A legitimate consumer scans once at purchase.

### 4. Covert Physical Features

Pair the QR with a covert label feature (micro-text, security fibres, holograms) that cannot be reproduced by a printer. The digital QR check and the physical feature together raise the counterfeit cost.

### 5. Consumer-Facing Verification

Keep the verification flow simple: scan, see a confirmation screen with the product image and origin, and a "first scanned" date. Consumers trust clear, fast results.
    `,
    [
      { question: 'Can a plain QR code prevent counterfeiting?', answer: 'No. Without server-side validation and physical anti-copy features, any QR code can be reproduced.' },
      { question: 'What is the cheapest effective anti-counterfeit approach?', answer: 'Server-side serialised scan counting with a signed token adds minimal cost and catches most opportunistic counterfeiting.' },
    ]
  ),
  art(
    'qr-code-for-cold-chain-tracking',
    'QR Codes for Cold Chain: Tracking Temperature-Sensitive Goods',
    'qr code cold chain tracking',
    'Use QR codes to log and verify temperature exposure for pharmaceuticals, food, and biologics.',
    'Business & Regional',
    '6 min read',
    '2026-10-02',
    `
### 1. Cold Chain Risk

Vaccines, biologics, fresh produce, and certain pharmaceuticals are damaged by temperature excursions. A broken cold chain can be invisible on arrival without monitoring.

### 2. QR as a Lookup Key

Print a QR on the shipment label that encodes a tracking ID. Scanning at any point in the chain calls an API that returns the temperature log, excursion history, and current disposition.

### 3. Sensor Integration

Pair the QR label with a printed or attached temperature logger. Some smart labels record temperature and encode the result as a visual indicator or a short-range NFC/BLE read. The QR links these data to the shipment record.

### 4. Regulatory Requirements

Many pharma and food regulations require documented temperature records. QR-linked digital logs satisfy this more reliably than paper records.

### 5. Label Durability

Cold-chain labels must adhere at temperatures down to -20°C or lower and survive condensation when removed from a freezer. Use cryogenic-rated label stock.
    `,
    [
      { question: 'Can a QR code itself monitor temperature?', answer: 'No. A standard QR is passive. Pair it with an electronic temperature logger; the QR links to the log data.' },
      { question: 'What label stock works at -20°C?', answer: 'Use cryogenic-rated polyester or polypropylene labels tested to the required minimum temperature.' },
    ]
  ),
];
