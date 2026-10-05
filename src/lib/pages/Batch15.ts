import type { Article } from '../articles';
import { art } from './helper';

export const batch15: Article[] = [
  art(
    'qr-code-for-street-art-and-murals',
    'QR Codes on Street Art and Murals: Artist Info, Audio Tours, and AR Overlays',
    'qr code street art mural',
    'Attach QR codes to public art installations for artist context, audio commentary, and AR experiences.',
    'Business & Regional',
    '5 min read',
    '2026-12-02',
    `
### 1. Artist Context

A small plaque near a mural carries a QR linking to: artist biography, inspiration, creation process, and related works. Browsers who would not stop for a long panel text will scan.

### 2. Audio Tour Integration

A city walking tour QR at each mural plays an audio segment when scanned. Keep audio under three minutes and offer a transcript for accessibility.

### 3. AR Overlay

A QR triggers an AR experience that shows the mural in an earlier state, an animation layer on top of the artwork, or the artist drawing in time-lapse.

### 4. Vandal Resistance

Street art environments are high-risk for label damage. Use engraved stainless steel plaques or recessed acrylic panels. Avoid adhesive labels that can be peeled or defaced.

### 5. City Trail QR Network

A network of mural QR codes can form a self-guided art trail. Each code links to the current piece and shows the map to the next one, building a continuous experience.
    `,
    [
      { question: 'What material lasts longest for a street art QR plaque?', answer: 'Engraved and paint-filled stainless steel or anodised aluminium. Adhesive labels peel and fade within weeks outdoors.' },
      { question: 'Can a QR on a mural show the painting process?', answer: 'Yes. Link to a time-lapse video or AR animation. Check that the landing page works on slow mobile connections.' },
    ]
  ),
  art(
    'qr-code-for-parking-lot-navigation',
    'QR Codes for Parking Lot Navigation: Level, Zone, and Vehicle Recovery',
    'qr code parking navigation car park',
    'Help drivers find their parked vehicle in large car parks using QR codes and digital maps.',
    'Business & Regional',
    '4 min read',
    '2026-12-03',
    `
### 1. Level and Zone Marking

A QR at the elevator or stairwell on each level and zone links to a map highlighting the current position. Drivers scan when they park and bookmark or screenshot the page.

### 2. Vehicle Recovery

Some parking systems link the entry ticket QR to the vehicle's last-known parking slot, captured by a camera at entry or on floor sensors. Scan the ticket to see a highlighted map to the car.

### 3. Call to Action

Place a visible sign encouraging drivers to scan when they park: "Scan to save your spot." People are more likely to scan immediately than when trying to find their car later.

### 4. Accessibility

Include large-print level and zone identifiers as text alongside the QR. Visitors with visual impairments need the information available without a scan.
    `,
    [
      { question: 'Can a QR navigate me exactly to my car?', answer: 'Only with floor sensor or camera data linked to your ticket. Without those, it shows your zone; you do the final search.' },
      { question: 'Should the map be accessible without internet?', answer: 'Ideally cache the map on first scan. Underground car parks often have poor signal.' },
    ]
  ),
  art(
    'qr-code-for-hotel-room-service',
    'Hotel Room Service QR Codes: Order Flow, Menu Updates, and Allergy Filters',
    'qr code hotel room service menu',
    'Design room service QR codes that allow guests to order, filter allergens, and track delivery.',
    'Business & Regional',
    '5 min read',
    '2026-12-04',
    `
### 1. Room Service Order Flow

The in-room QR links to a mobile page pre-filled with the room number. The guest browses the menu, selects items, notes any dietary requirements, and submits. The kitchen receives the order; no phone call needed.

### 2. Allergen Filtering

A filter for common allergens (nut-free, gluten-free, halal, vegan) reduces anxiety for guests with dietary needs. This also reduces call-backs from the kitchen.

### 3. Menu Updates

Menu items change with availability and season. Because the QR links to a live page, items can be removed instantly when sold out or a supplier changes.

### 4. Order Tracking

A confirmation page with a simple status indicator (order received, in preparation, on its way) reduces the "where is my food?" phone call.

### 5. Multi-Language

Hotels serve international guests. Offer at minimum English, Spanish, Arabic, and French on the menu page with a language toggle on load.
    `,
    [
      { question: 'Should room service QR codes be unique per room?', answer: 'Yes. Encode the room number in the URL so the order form is pre-filled and routed correctly.' },
      { question: 'What if a guest prefers to call?', answer: 'Include the room service phone number prominently on the page and on the table tent below the QR.' },
    ]
  ),
  art(
    'qr-code-for-sports-coaching',
    'QR Codes for Sports Coaching: Drill Libraries, Technique Videos, and Athlete Portfolios',
    'qr code sports coaching drill library',
    'Use QR codes on training cards and equipment to link athletes to coaching content and performance data.',
    'Business & Regional',
    '5 min read',
    '2026-12-05',
    `
### 1. Drill Cards

Laminated drill cards with a QR link to a video demonstrating the correct technique. Athletes self-serve rather than waiting for a coach to demonstrate each time.

### 2. Equipment Guidance

A QR on a gym machine or piece of training equipment links to the correct setup and usage guide for that specific item in the facility.

### 3. Athlete Portfolio

A personal QR code on an athlete's profile card links to their performance history, training logs, and video clips of technique. Useful for recruitment and scholarship applications.

### 4. Coaching Notes

After a session, a coach prints a summary card with a QR linking to the session video analysis and personalised feedback. The athlete reviews between sessions.
    `,
    [
      { question: 'Should drill videos be hosted on YouTube?', answer: 'YouTube works but carries ads and may go offline or change access policy. Self-hosting gives long-term control.' },
      { question: 'Can QR codes replace a coaching app?', answer: 'For small clubs or individual coaches, QR to a web page is a low-cost alternative to building or buying a coaching app.' },
    ]
  ),
  art(
    'qr-code-for-government-transit-passes',
    'QR Codes for Government Transit Passes: Contactless Access and Reduced Fare Verification',
    'qr code transit pass government',
    'How transit authorities use QR codes on digital passes for gate access, concession verification, and inspection.',
    'Business & Regional',
    '6 min read',
    '2026-12-06',
    `
### 1. Digital Pass on a Phone

Transit authorities issue QR-based digital passes that live in a wallet or app. Passengers present the phone screen at the gate or to an inspector instead of a physical card.

### 2. Gate Access

The QR encodes a signed, time-limited token. The gate reader validates the signature and checks the token against a current validity list. The gate opens in under a second.

### 3. Concession and Reduced Fare Verification

The signed token embeds the fare class (child, senior, student, concession). Inspectors scan to verify the class shown on screen matches the claimed class.

### 4. Offline Gate Operation

Gates may lose connectivity. Cache a signed token list locally on the gate device and synchronise regularly. Short token validity windows limit the exposure if the list is not fresh.

### 5. Accessibility

Provide a physical alternative for passengers without smartphones or who face difficulty with screen brightness at outdoor gates.
    `,
    [
      { question: 'What happens if the passengers phone dies at the gate?', answer: 'Authorities must provide a fallback. A physical card issue desk or staff override are common alternatives.' },
      { question: 'How do inspectors verify a QR pass on a train?', answer: 'Using a handheld scanner connected to the validity system. The screen shows the pass class and valid-to date.' },
    ]
  ),
  art(
    'qr-code-for-waste-management',
    'QR Codes for Waste Management: Bin Identification, Collection Schedules, and Complaint Reporting',
    'qr code waste management bin collection',
    'Use QR codes on waste bins and signs to link residents to collection schedules and reporting tools.',
    'Business & Regional',
    '5 min read',
    '2026-12-07',
    `
### 1. Bin Identification

A QR on each bin links to: the bin's property address, collection day, accepted waste types, and recycling guidance. Useful when a bin is in the wrong place or contents are contaminated.

### 2. Collection Schedule

A QR on a schedule reminder card or communal bin store links to the dynamic collection calendar for that postcode. Schedule changes update online without distributing new cards.

### 3. Fly-Tip Reporting

A QR at a fly-tipping hotspot links directly to the council's report-a-fly-tip form, pre-filled with the location. Faster reporting improves response times.

### 4. Hazardous Waste Guidance

QR codes at recycling centres link to accepted materials lists and disposal instructions for specific items: batteries, paint, chemicals, and electronics.
    `,
    [
      { question: 'Can a QR on a bin tell the driver it is full?', answer: 'Not directly. Smart bins use a sensor; the QR is for residents. Combine both for a full smart waste solution.' },
      { question: 'How do I update collection schedules without reprinting?', answer: 'The QR links to a page you control. Update the schedule on the server; all existing printed codes immediately show the new data.' },
    ]
  ),
  art(
    'qr-code-for-press-releases-and-media',
    'QR Codes in Press Releases and Media Kits: Supporting Assets and Journalist Access',
    'qr code press release media kit',
    'Add QR codes to press materials to give journalists instant access to hi-res images, quotes, and data.',
    'Business & Regional',
    '5 min read',
    '2026-12-08',
    `
### 1. What to Link in a Media Kit

* Hi-res logos and product images in print-ready format.
* Executive headshots and approved quote sheets.
* Supporting data tables and research PDFs.
* Video B-roll and press conference recordings.

### 2. QR in a Printed Press Release

A QR at the foot of a printed release links to the online news room or a specific story page with all assets in one place. Journalists scan to download without emailing a request.

### 3. Press Conference

A QR on the stage backdrop or distributed cards links to the online news room updated in real time. Supporting materials go live as the conference proceeds.

### 4. Expiry and Archive

After the embargo lifts, assets become public. Ensure the linked page transitions cleanly from embargoed to public access at the announced time.
    `,
    [
      { question: 'Should press kit QR codes require a login?', answer: 'For embargoed materials, yes. For general press assets, a public news room is more accessible and builds media relationships.' },
      { question: 'Can a QR in a press release go to a PDF?', answer: 'Better to link to a news room page. PDFs cannot be updated if a correction is needed, and they are less accessible.' },
    ]
  ),
  art(
    'qr-code-for-3d-printing-files',
    'QR Codes for 3D Printing Files: File Retrieval, Version Control, and Maker Communities',
    'qr code 3d printing file download',
    'Attach QR codes to 3D-printed objects to link to the source file, print settings, and remix licence.',
    'Fundamentals',
    '5 min read',
    '2026-12-09',
    `
### 1. File Retrieval from a Printed Object

A QR on a 3D-printed item links to the source STL or 3MF file on a platform like Thingiverse, Printables, or a self-hosted repository. Anyone who has the object can access the design.

### 2. Print Settings

The linked page includes the recommended settings: material, layer height, supports, and infill. This helps others reproduce the part reliably without guesswork.

### 3. Version Control

When the design is updated, the QR URL stays the same but the linked page shows the latest version. Old printed objects remain linked to current documentation.

### 4. Licence Information

Creative Commons or open-source licences are communicated via the linked page. Commercial users know whether they can sell or modify the design.

### 5. Embedding the QR in the Print

Some designers extrude a small QR code directly into the surface of the model. This is elegant but requires a large enough model, high print quality, and testing the scan result.
    `,
    [
      { question: 'Can a QR code be embedded in the surface of a 3D print?', answer: 'Yes. Model the QR as a relief in the file. Use at least 10 cm total size and high contrast filament for reliable scanning.' },
      { question: 'What platform should I host 3D files on?', answer: 'Thingiverse, Printables, and MakerWorld are community platforms. Self-hosting gives more control but requires maintenance.' },
    ]
  ),
  art(
    'qr-code-for-fashion-and-apparel-sustainability',
    'QR Codes for Fashion Sustainability: Material Passports and Care Instructions',
    'qr code fashion sustainability material passport',
    'Use QR codes on clothing labels to communicate material sourcing, carbon footprint, and care guidance.',
    'Business & Regional',
    '6 min read',
    '2026-12-10',
    `
### 1. Digital Product Passport

EU regulations are moving toward mandatory Digital Product Passports for apparel. A QR code will link to material composition, supplier chain, certifications, and end-of-life options.

### 2. Material Transparency

Link from the care label to: fibre content and sourcing country, certifications (GOTS, OEKO-TEX, Fairtrade), and recyclability status. Consumers who research sustainability can access full detail.

### 3. Care Instructions in Detail

The physical label carries simplified care symbols. A QR links to full written instructions in the customer's language, video demonstrations for specialist care, and care tips to extend garment life.

### 4. Take-Back and Recycling

Link to the brand's take-back programme, resale platform, or textile recycling locator. End-of-life guidance reduces landfill and builds brand loyalty among sustainability-conscious consumers.
    `,
    [
      { question: 'Are Digital Product Passports required for clothing yet?', answer: 'EU regulations are phasing them in. Check the current timeline for your product category; early adoption demonstrates leadership.' },
      { question: 'What information must be on a fashion label vs behind a QR?', answer: 'Fibre content and care symbols are legally required in print in most markets. QR extends, not replaces, this information.' },
    ]
  ),
  art(
    'qr-code-for-outdoor-markets-and-stalls',
    'QR Codes for Market Stalls and Pop-Up Shops: Contactless Payment and Customer List Building',
    'qr code market stall pop up shop',
    'Use QR codes at outdoor markets for mobile payments, newsletter sign-up, and social following.',
    'Business & Regional',
    '5 min read',
    '2026-12-11',
    `
### 1. Contactless Payment

Display a payment QR (UPI, PayNow, Pix, or another regional scheme) prominently at the stall. Many market shoppers now prefer not to carry cash. Include the business name beside the code.

### 2. Newsletter and Social List Building

A "stay in touch" QR links to a short sign-up form for the email list or a follow button for the social account. Capture customers who want to know about upcoming markets and new products.

### 3. Product Links

Stall inventory is limited. A QR on a product links to the full online shop where customers can browse and order items not stocked at the market.

### 4. Durability for Outdoor Markets

Table QR signs face wind, light rain, and UV. Use laminated polyester cards in a weighted display stand. Matte finish prevents glare from outdoor light.

### 5. Contact Details

A vCard QR or link to a contact card lets customers save your details for repeat orders. Include the days and markets you attend.
    `,
    [
      { question: 'What is the simplest contactless payment QR for a market stall?', answer: 'A static QR for your countrys dominant payment scheme (UPI, PayNow, Pix, etc.) covers most buyers at zero cost.' },
      { question: 'Should a market stall QR link to Instagram or an email sign-up?', answer: 'Both via a link-in-bio style page. Let the customer choose their preferred way to stay connected.' },
    ]
  ),
];
