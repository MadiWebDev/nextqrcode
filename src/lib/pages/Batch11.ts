import type { Article } from '../articles';
import { art } from './helper';

export const batch11: Article[] = [
  art(
    'qr-code-for-churches-and-places-of-worship',
    'QR Codes for Churches and Places of Worship: Bulletins, Donations, and Outreach',
    'qr code church worship',
    'Use QR codes in religious settings for giving links, service order downloads, and community connection.',
    'Business & Regional',
    '5 min read',
    '2026-10-23',
    `
### 1. Giving and Tithing

A QR on the weekly bulletin or a pew card links to the online giving page. Mobile giving at the point of offering increases participation from members without cash. Keep the landing page fast and mobile-first.

### 2. Service Orders and Lyrics

Link to a PDF or web page with the order of service, sermon notes, and song lyrics. Visitors follow along without a printed bulletin, reducing paper costs.

### 3. Community Connection

QR codes on community boards link to event sign-up forms, volunteer rosters, and small group directories. Update the linked page without reprinting the board sign.

### 4. Outreach Materials

Leaflets and banners at community events carry a QR linking to information about the congregation. Provide a language selection on the landing page for multilingual communities.
    `,
    [
      { question: 'Can a QR code replace the collection plate?', answer: 'It supplements it. Some members prefer digital giving; others prefer cash. Offer both.' },
      { question: 'How often should the bulletin QR link change?', answer: 'Each week if linking to a specific order of service, or use a permanent URL that always shows the current week.' },
    ]
  ),
  art(
    'qr-code-for-sports-events',
    'QR Codes at Sports Events: Ticketing, Stats, and Fan Engagement',
    'qr code sports events ticketing',
    'Deploy QR codes at stadiums and sports venues for entry, merchandise, and live statistics.',
    'Business & Regional',
    '6 min read',
    '2026-10-24',
    `
### 1. Ticketing and Entry

Digital ticket QR codes must be single-use (invalidated after first scan) to prevent duplicate entry from screenshots. Use a signed token verified by the gate system.

### 2. Concessions and Merchandise

QR codes at pop-up stands allow fans to order and pay without queuing. Link to a mobile ordering page pre-loaded with the stand's menu.

### 3. Live Stats and Line-Ups

A QR on the match programme or seat-back links to a live stats page that updates throughout the game. This gives fans richer data than the scoreboard shows.

### 4. Fan Competitions

In-stadium competitions use QR codes to capture entries. Each scan registers the seat number, allowing prize delivery without a form. Keep the entry page to one tap.

### 5. Accessibility

Provide printed programme QRs and in-seat prompts. Not all fans will scan, so important information must also be available on the big screen and PA.
    `,
    [
      { question: 'How do I stop fans sharing a screenshot of their ticket?', answer: 'Server-side single-use validation. The first valid scan invalidates the token; subsequent scans of the same code are rejected.' },
      { question: 'What size QR works on a match day programme?', answer: 'Programmes are read at arm length, so 3 to 4 cm is comfortable for a 30 to 40 cm scan distance.' },
    ]
  ),
  art(
    'qr-code-for-coworking-spaces',
    'QR Codes in Coworking Spaces: Desk Booking, WiFi, and Visitor Check-In',
    'qr code coworking space desk booking',
    'Streamline coworking operations with QR codes for hot-desking, meeting rooms, and visitor management.',
    'Business & Regional',
    '5 min read',
    '2026-10-25',
    `
### 1. Hot-Desk Booking

A QR on each desk links to a booking page pre-populated with the desk ID. Members claim their desk for the day with one scan and a confirmation tap.

### 2. Meeting Room Management

A QR outside each room links to the calendar booking for that room. Members see current availability and book or release the room on the spot.

### 3. WiFi Provisioning

Print WiFi QR codes at each desk zone or meeting room with the network for that area. Guests connect without staff assistance.

### 4. Visitor Check-In

Visitors scan a reception QR to enter their name and host. The host receives a notification. This creates an audit log and reduces reception workload.

### 5. Member Onboarding

A welcome QR on the member pack links to a digital onboarding guide covering access codes, printer setup, and community guidelines.
    `,
    [
      { question: 'Can members book a desk with just a QR scan?', answer: 'Yes. Encode the desk ID in the URL and authenticate via a linked member account. One scan, one tap to confirm.' },
      { question: 'How do I prevent a member from squatting a desk all day?', answer: 'Auto-release after a set period of inactivity, or require a mid-day confirmation scan.' },
    ]
  ),
  art(
    'qr-code-for-real-estate-open-homes',
    'QR Codes at Open Home Events: Register Interest and Follow Up Buyers',
    'qr code open home real estate event',
    'Use QR at open homes to capture buyer contact details, share property documents, and automate follow-up.',
    'Business & Regional',
    '5 min read',
    '2026-10-26',
    `
### 1. Entry Registration

A QR at the door links to a short form: name, email, phone, and whether they are buying with a mortgage. Data flows to the agent's CRM for follow-up.

### 2. Property Documents

QR codes on the property brochure link to the floor plan PDF, LIM report summary, and inspection records. Buyers access full detail on their phone during the viewing.

### 3. Automated Follow-Up

On form submission, trigger an automated email with the property listing link, agent contact, and an invitation to register an offer. Keep the CRM updated from each open home.

### 4. Privacy

Inform visitors that their contact details will be used for follow-up. Provide an opt-out option. Comply with local privacy law.
    `,
    [
      { question: 'Should visitors be required to register via QR before entering?', answer: 'You can ask but cannot legally compel without a valid purpose. Most agents offer it as an optional convenience.' },
      { question: 'How do I follow up with QR leads automatically?', answer: 'Connect the form to your CRM or email marketing tool and trigger a follow-up sequence on submission.' },
    ]
  ),
  art(
    'qr-code-for-funeral-services',
    'QR Codes at Funerals and Memorials: Tribute Pages and Programme Links',
    'qr code funeral memorial tribute',
    'Use QR codes on funeral programmes and memorial cards to link to tribute pages and legacy content.',
    'Business & Regional',
    '5 min read',
    '2026-10-27',
    `
### 1. Tribute Page

A QR on the funeral programme links to a memorial page with the life story, photos, video tributes, and a condolence book. Family members and friends who cannot attend can view and contribute.

### 2. Programme Downloads

Many attendees want a digital copy of the order of service. A QR saves reprinting and allows latecomers to follow along.

### 3. Donation Link

Link to the nominated charity collection page. QR donations are easier to process than collecting cash at the door.

### 4. Sensitive Design

Keep the code small and tasteful, placed on the back of a programme or a memorial card. Use the family's preference for font and layout around the code.

### 5. Longevity

Memorial pages should remain accessible for years. Use a hosted service with a good track record or your own domain. Document the URL and access credentials for the family.
    `,
    [
      { question: 'How long should a memorial page stay live?', answer: 'Ideally indefinitely, or at least for several years. Discuss longevity with the family and ensure someone holds the hosting account details.' },
      { question: 'Can remote family view the funeral via the QR?', answer: 'Yes, if you link to a live-stream page. Ensure the stream link is tested before the service.' },
    ]
  ),
  art(
    'qr-code-for-car-parks-and-parking',
    'QR Codes in Car Parks: Pay and Exit, Permit Verification, and Dispute Resolution',
    'qr code car park parking payment',
    'Deploy QR codes for cashless car park payments, digital permit display, and dispute evidence.',
    'Business & Regional',
    '6 min read',
    '2026-10-28',
    `
### 1. Pay and Display via QR

Entry or bay QR codes link to a payment page pre-filled with the bay number and tariff. The driver pays on their phone, and the system logs the paid session against the vehicle or bay.

### 2. Digital Permit Display

Season permit holders display a QR code on a card in the windscreen. Enforcement officers scan to verify current permit status in real time, replacing physical sticker permits.

### 3. Dispute Resolution

A scan log with timestamp and location provides evidence in any dispute about payment or parking time. The system knows exactly when each code was scanned.

### 4. Security

See the parking scam article for defence against sticker overlays. Use tamper-evident holders or integrate the code into the signage surface.
    `,
    [
      { question: 'Can a driver pay for parking via QR without an app?', answer: 'Yes. A web-based payment page works on any smartphone browser. App-based systems add friction for occasional visitors.' },
      { question: 'How do I prevent one driver paying for another bay?', answer: 'Encode the bay ID in the QR URL so the payment page pre-fills the correct bay, reducing manual entry errors.' },
    ]
  ),
  art(
    'qr-code-generator-offline-tools',
    'Offline QR Code Generators: When to Avoid Cloud Tools',
    'offline qr code generator',
    'Generate QR codes entirely in the browser or on a local device for sensitive payloads without network exposure.',
    'Security & Scanning',
    '5 min read',
    '2026-10-29',
    `
### 1. Why Offline Matters

Any data you send to a cloud API is received by a third party. For WiFi passwords, internal URLs, patient identifiers, or private contacts, a client-side generator keeps the payload off the internet.

### 2. Browser-Based Client-Side Generation

JavaScript libraries (qrcode.js, qrcode-generator, nayuki) render the QR entirely in the browser. The payload never leaves your device. Our QR Code Tools generator works this way.

### 3. Command-Line and Local Tools

Python (qrcode library), Go (skip2/go-qrcode), and command-line tools (qrencode) generate offline. Useful in scripts, CI pipelines, and air-gapped environments.

### 4. What to Check

Verify that the tool you choose actually generates client-side. Some advertise "privacy" while still sending the payload to a backend. Check the network tab in browser developer tools.
    `,
    [
      { question: 'Can I generate a WiFi QR code without sending my password online?', answer: 'Yes. Use a client-side browser tool or a local library. Your password never leaves your device.' },
      { question: 'How do I check if a generator is truly client-side?', answer: 'Open the browser developer tools, go to the network tab, and watch for requests when you generate a code.' },
    ]
  ),
  art(
    'qr-code-for-packaging-recycling',
    'QR Codes for Packaging Recycling: Consumer Guidance and EPR Data',
    'qr code packaging recycling',
    'Use QR codes on packaging to give location-specific recycling instructions and feed EPR compliance data.',
    'Business & Regional',
    '5 min read',
    '2026-10-30',
    `
### 1. The Problem with Static Recycling Icons

A generic recycling icon says nothing about whether the local authority accepts that specific material. A QR can deliver local-authority-specific guidance based on the consumer's postcode.

### 2. Dynamic Location Content

Link to a page that asks for a postcode and returns the correct bin to use for that packaging type in that area. This is useful in the UK and Australia where local authority recycling rules vary widely.

### 3. Extended Producer Responsibility

EPR schemes in the EU and UK require producers to report on packaging placed on market and recovery rates. QR-scannable packaging can signal material type to sorting systems (via GS1 Digital Link) and feed data to EPR reporting platforms.

### 4. Consumer Communication

Use the QR landing page to explain why packaging is designed the way it is, what it is made from, and how to prepare it for recycling (rinse, flatten, cap on or off).
    `,
    [
      { question: 'Can one recycling QR work across all countries?', answer: 'Yes if the landing page adapts to location. Recycling rules vary by country and even by city, so a dynamic page is essential.' },
      { question: 'Is this required by law?', answer: 'Not universally, but EU and UK EPR regulations are creating pressure to disclose material composition in machine-readable form, which GS1 Digital Link supports.' },
    ]
  ),
  art(
    'qr-code-for-corporate-id-cards',
    'QR Codes on Corporate ID Cards: Access Credentials and Employee Verification',
    'qr code corporate id card employee',
    'Design secure QR codes for employee ID cards used for building access, cafeteria payment, and event check-in.',
    'Security & Scanning',
    '6 min read',
    '2026-10-31',
    `
### 1. What to Encode

Encode an opaque token that maps to the employee record in your identity system. Never encode personal data, home address, or salary information in a printed QR.

### 2. Rotating vs Static

For building access, a static token is acceptable if the reader verifies against the current access control list on each scan. For high-security zones, use a time-based rotating token (TOTP) similar to an authenticator app.

### 3. Revocation

When an employee leaves, disable the token in the identity system. All gate readers check the token status on each scan, so access is revoked immediately on termination.

### 4. Multipurpose Use

The same QR can serve multiple systems: building access, cafeteria cashless payment, event check-in, and IT asset sign-out. Each system checks the token independently, reducing the number of cards issued.

### 5. Card Durability

Corporate ID cards are PVC or polycarbonate. Print the QR code in the card substrate layer or laminate, not on an adhesive label that can be peeled and swapped.
    `,
    [
      { question: 'Should an employee ID QR contain their employee number?', answer: 'Only an opaque token. Employee numbers are often guessable and should not be exposed in plain text on a physical card.' },
      { question: 'How quickly is access revoked when an employee leaves?', answer: 'Immediately, if the gate reader validates against a live or frequently-synced token revocation list.' },
    ]
  ),
  art(
    'qr-code-for-agricultural-produce',
    'QR Codes for Farm-to-Table: Traceability Labels on Agricultural Produce',
    'qr code agricultural produce traceability',
    'Use QR codes on fruit, vegetable, and grain packaging to provide origin, pesticide, and certification data.',
    'Business & Regional',
    '6 min read',
    '2026-11-01',
    `
### 1. Consumer Demand for Origin Data

Shoppers increasingly want to know where their food was grown, by whom, and under which standards. A QR on a produce sticker or carton links to this story without crowding the label.

### 2. Traceability Payload

Encode a batch or lot code linked to the harvest record. A scan reveals: farm name and location, harvest date, variety, input records (pesticide and fertiliser), and certification (organic, GlobalGAP, Fairtrade).

### 3. GS1 Application Identifiers

Use GS1 AI 10 for batch/lot and AI 11 for production date within a GS1 Digital Link URL. This makes the code readable by supply-chain scanners as well as consumer phones.

### 4. Label Materials for Produce

Produce stickers use polypropylene or polyethylene. QR codes on these must be small (under 2 cm) and high contrast. Test in refrigerated and humid environments before full deployment.
    `,
    [
      { question: 'Can a produce QR help if there is a contamination recall?', answer: 'Yes. Lot-level traceability lets you identify exactly which units from which harvest are affected and notify the supply chain quickly.' },
      { question: 'What QR size works on a small produce sticker?', answer: 'Keep payload to a short URL. Version 3 or 4 at level M fits in under 2 cm on smooth polypropylene.' },
    ]
  ),
];
