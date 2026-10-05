import type { Article } from '../articles';
import { art } from './helper';

export const batch9: Article[] = [
  art(
    'qr-code-in-augmented-reality',
    'QR Codes and Augmented Reality: Markers, Triggers, and Web AR',
    'qr code augmented reality ar',
    'How QR codes serve as AR anchors in WebXR, Unity, and retail try-on experiences.',
    'Fundamentals',
    '6 min read',
    '2026-10-03',
    `
### 1. QR as an AR Trigger

Pointing a phone at a QR code is already a familiar gesture. AR platforms use the same moment to launch an overlay experience: a product in 3D, an instruction video, or a virtual try-on.

### 2. WebXR and Model-Viewer

For web-based AR, a QR code links to a page with a \`<model-viewer>\` element or a WebXR scene. No app install is needed. The user scans, the browser opens, and the 3D object appears over the camera view.

### 3. Dedicated App Platforms

Unity (with Vuforia or AR Foundation) and Unreal can use QR codes as image targets. The code is detected, and a 3D scene anchors to it. Suitable for industrial maintenance guides or trade show demos.

### 4. Design Considerations

* Use level H for AR markers so partial occlusion does not break detection.
* Keep surrounding contrast high; complex backgrounds reduce AR tracking stability.
* Test in the real lighting environment; dark exhibition halls behave differently from a studio.
    `,
    [
      { question: 'Can AR work without a dedicated app?', answer: 'Yes. WebXR in modern browsers supports AR overlays triggered from a web page. No app install needed.' },
      { question: 'Does the QR need a special design for AR?', answer: 'A standard QR works as an AR trigger. Use level H and high contrast for reliable detection.' },
    ]
  ),
  art(
    'qr-code-for-smart-packaging',
    'Smart Packaging and QR Codes: Connected Consumer Experiences',
    'smart packaging qr code',
    'How brands use QR codes on packaging to deliver personalised content, refills, and circular economy data.',
    'Business & Regional',
    '6 min read',
    '2026-10-04',
    `
### 1. Beyond the Static Link

Smart packaging QR codes link to dynamic experiences: a product how-to video that updates with new content, a refill order page, or a recycling instruction specific to the consumer's postcode.

### 2. First-Party Data

A scan that requires a quick account login or email entry turns packaging into a first-party data touchpoint. Offer clear value—a recipe, a discount, or a personalised recommendation—in exchange.

### 3. Circular Economy

Brands are using QR codes to communicate recycling, return, or refill instructions. Some link to a producer-responsibility platform where consumers log returned packaging for credits.

### 4. Implementation

Use a URL on a domain you control with server-side redirect logic. The printed code never changes; the page behind it evolves with your campaign calendar. Track scan events per SKU and geography.
    `,
    [
      { question: 'Can a QR on packaging capture first-party data?', answer: 'Yes, if you offer a reason to register or sign in. Always disclose data use and comply with privacy law.' },
      { question: 'Do I need a new code per product variant?', answer: 'Usually yes, so each variant links to its specific information and scan events are attributed correctly.' },
    ]
  ),
  art(
    'qr-code-for-menus-print-to-digital',
    'Converting Print Menus to QR Digital Menus: SEO, Performance, and Updates',
    'qr code digital menu',
    'Build a QR menu that loads fast, ranks in search, and costs less to update than reprinting.',
    'Business & Regional',
    '6 min read',
    '2026-10-05',
    `
### 1. The Business Case

A printed menu costs money every time it changes. A QR code links to a page you update in minutes at no print cost. A sudden price change, sold-out item, or seasonal special is live immediately.

### 2. Technical Performance

Mobile menus should load in under 2 seconds on a 4G connection. Use a static site or a CDN-hosted page with optimised images. A heavy single-page JavaScript application can take 5 seconds, losing impatient customers.

### 3. SEO Value

A public digital menu on your domain can rank for local searches. Use schema markup with \`Restaurant\` and \`Menu\` types, real dish names, and prices. This beats a PDF which search engines index poorly.

### 4. Accessibility

Provide sufficient colour contrast, resizable text, and a language toggle. Test with a screen reader on iOS and Android.

### 5. Customer WiFi Prompt

If your venue offers guest WiFi, link to both the menu and the WiFi QR from the same table tent. Customers on weak mobile signal will appreciate the offer.
    `,
    [
      { question: 'Should the digital menu be a PDF or a web page?', answer: 'A web page. PDFs are hard to update, poor for SEO, and awkward to read on small screens.' },
      { question: 'Can the digital menu help with SEO?', answer: 'Yes. A public, well-structured menu page can rank for local food searches and show dish-level content to search engines.' },
    ]
  ),
  art(
    'qr-code-for-gym-and-fitness-equipment',
    'QR Codes for Gyms: Equipment Guides, Check-In, and Class Booking',
    'qr code gym fitness equipment',
    'Place QR codes on gym equipment and reception to improve member experience and reduce staff questions.',
    'Business & Regional',
    '5 min read',
    '2026-10-06',
    `
### 1. Equipment Labels

Attach a QR code to each machine linking to a 90-second video guide, adjustment instructions, and safety notes. Members learn proper use independently; staff answer fewer basic questions.

### 2. Class Check-In

A QR code on the studio door or the instructor's phone allows members to check in to a class without queuing at reception. Scan events feed attendance records automatically.

### 3. Class Booking

Link to your booking page with the specific class pre-selected (use a URL parameter). One tap books without navigation.

### 4. Durability

Gym equipment labels face sweat, cleaning sprays, and UV from skylights. Use laminated polyester labels and replace them on a maintenance schedule. Check regularly that codes still scan.
    `,
    [
      { question: 'Should I link to a YouTube video or host the guide myself?', answer: 'Host it yourself for reliability and no adverts. A YouTube link is quicker to set up but shows competitor ads and can disappear.' },
      { question: 'How do I track whether members use the equipment guides?', answer: 'Use a different short URL per machine and track page visits. You will see which guides get the most use.' },
    ]
  ),
  art(
    'qr-code-for-access-control',
    'QR Codes for Access Control: Visitor Management and Temporary Passes',
    'qr code access control visitor management',
    'Issue time-limited QR passes for visitors, contractors, and events with server-side validation.',
    'Security & Scanning',
    '7 min read',
    '2026-10-07',
    `
### 1. The Core Pattern

The server issues a signed QR containing: visitor name (optional), allowed zones, valid-from and valid-until timestamps, and a random unique ID. The gate reader validates the signature and expiry offline or with a quick server ping.

### 2. One-Time vs Multi-Use

* One-time: invalidated after first use, ideal for single-visit guests.
* Multi-use with expiry: valid for a contractor working for one week, checked each entry against the server.

### 3. Revocation

Server-side revocation works only when the reader has connectivity. For offline or low-connectivity gates, use short expiry windows so revoked passes expire quickly.

### 4. Display

Send the QR to the visitor by email before arrival. Display it on their phone or print it, and include name and date so security can cross-check visually.

### 5. Audit Log

Every scan event creates an immutable audit entry. This is valuable for investigating incidents or satisfying health-and-safety requirements.
    `,
    [
      { question: 'Can a visitor print their QR pass?', answer: 'Yes. A signed pass is equally valid on paper as on screen, provided the signature check occurs at the gate.' },
      { question: 'How do I handle a visitor arriving without their code?', answer: 'Require manual reception check-in as a fallback. Never bypass the access check.' },
    ]
  ),
  art(
    'qr-code-outdoor-signage-durability',
    'Outdoor QR Signage Durability: UV, Rain, and Vandal Resistance',
    'outdoor qr code signage durability',
    'Choose the right substrate and ink for QR signs that survive years of outdoor exposure.',
    'Printing & Sizing',
    '5 min read',
    '2026-10-08',
    `
### 1. UV Degradation

Sunlight bleaches ink and yellows some plastics over months. Use UV-stable inks and substrates: aluminium composite panels, HDR foam board with UV print, or acrylic with UV-cured print.

### 2. Rain and Moisture

Porous materials (uncoated paper, standard foam board) absorb water and warp. Use metal, UV-stable synthetic paper, or aluminium for signs exposed to rain.

### 3. Vandal Resistance

Recessed or countersunk mounting, tamper-evident fasteners, and a protective polycarbonate overlay make replacing the sign the only option for vandals. Anti-graffiti coatings allow cleaning without damaging the code.

### 4. Inspection Schedule

Even durable signs degrade. Set a quarterly visual inspection. Scan the code at each visit to confirm it still reads correctly.

### 5. Error Correction

Use level Q for outdoor signs to tolerate physical damage without losing scannability.
    `,
    [
      { question: 'What is the best material for a permanent outdoor QR sign?', answer: 'Aluminium composite (Dibond) with UV-cured print or powder-coat, or anodised aluminium plate.' },
      { question: 'Should I use level H for outdoor signs?', answer: 'Level Q is usually sufficient. Level H makes the symbol denser without much benefit unless you also embed a logo.' },
    ]
  ),
  art(
    'qr-code-for-healthcare-patient-wristbands',
    'QR Codes on Patient Wristbands: Safety, Privacy, and Workflow',
    'qr code patient wristband hospital',
    'How hospitals use QR wristbands for patient identification, medication checks, and specimen labelling.',
    'Business & Regional',
    '7 min read',
    '2026-10-09',
    `
### 1. Safety-Critical Role

A patient wristband QR links to the correct patient record at every care step: medication administration, specimen collection, imaging, and surgery. Scanning catches misidentifications that visual checks miss.

### 2. What the Code Encodes

Best practice encodes only an opaque patient token, not personal data or health information. The token resolves to the full record in the hospital information system. This limits exposure if a wristband is read by an unauthorised device.

### 3. Privacy

The wristband is worn visibly. A token-only payload reduces risk; a direct patient identifier or health number in plain text is discouraged.

### 4. Wristband Durability

Wristbands face water, hand sanitiser, and physical wear. Use thermal direct labels on approved medical-grade wristband stock tested for durability in clinical conditions.

### 5. Workflow

1. Print at point of registration using the HIS-generated token.
2. Apply and verify at the bedside.
3. Scan and confirm identity at each care event.
4. Never re-use wristbands or tokens across patients.
    `,
    [
      { question: 'Can a wristband QR expose patient health data?', answer: 'Only if the payload contains readable data. Encode an opaque token and protect the patient record behind authentication.' },
      { question: 'Which wristband material is most durable?', answer: 'Vinyl with thermal direct printing tested under relevant clinical standards. Confirm with your hospital procurement.' },
    ]
  ),
  art(
    'qr-code-for-emergency-information',
    'QR Codes for Emergency Information: ICE Cards, Evacuation Plans, and First Responder Data',
    'qr code emergency information ice card',
    'Use QR codes to give first responders quick access to critical medical and evacuation information.',
    'Business & Regional',
    '6 min read',
    '2026-10-10',
    `
### 1. ICE QR on a Card or Phone Case

In Case of Emergency (ICE) QR codes link to a page with blood type, allergies, medications, and emergency contacts. Keep the URL short and on a domain you control.

### 2. Privacy Balance

Medical information is sensitive. A simple lock code on the target page (not a full login, just a shared code like an ICE PIN) deters casual browsers while still being accessible by a paramedic.

### 3. Building Evacuation Plans

A QR code on the fire notice links to the current evacuation plan, assembly point map, and fire warden contact. Updating the plan requires changing the page, not reprinting every notice.

### 4. Haz-Mat and Industrial Safety

Chemical storage labels can carry QR codes linking to SDS (Safety Data Sheet) files. This is supplementary to required printed hazard symbols, not a replacement.

### 5. Offline Fallback

Emergency situations often involve network disruption. Print key information in text alongside the QR, and consider a brief offline-capable page or a vCard fallback.
    `,
    [
      { question: 'Should an ICE QR link to sensitive medical data without a password?', answer: 'Balance access vs security. A simple shared PIN that paramedics know provides meaningful protection without preventing access in emergencies.' },
      { question: 'Can a QR replace a printed evacuation notice?', answer: 'No. Regulations require printed notices. QR is supplementary, providing detail that cannot fit on the notice.' },
    ]
  ),
  art(
    'qr-code-for-pet-identification',
    'QR Pet Tags: Reuniting Lost Pets with Owner Information',
    'qr code pet tag',
    'Design a QR pet tag that helps anyone who finds your pet reach you quickly without exposing personal data.',
    'Business & Regional',
    '5 min read',
    '2026-10-11',
    `
### 1. What to Encode

Encode a short URL to a page with: pet name, description, your contact number, and a "finder" form. Avoid putting your home address in the code directly.

### 2. Tag Material

Stainless steel, aluminium, and silicone tags survive outdoor life. Engrave or UV-print the QR rather than using a sticker that peels. Minimum 2.5 × 2.5 cm for a readable symbol.

### 3. Privacy

Use a hosted profile page where the pet owner controls what is shown. If the URL stops working, the tag is useless. Self-host or use a service with a good uptime track record.

### 4. NFC and QR Together

Some pet tags include both an NFC chip and a QR code. The QR works for phones without NFC or when the chip is blocked by a metal surface.

### 5. Test Before Use

Scan the code before attaching to the collar. Confirm the page loads and the contact form works.
    `,
    [
      { question: 'Should I put my phone number directly in the QR?', answer: 'A tel: URI works, but a web page gives you more control and lets you update your number without making a new tag.' },
      { question: 'What size should a pet tag QR be?', answer: 'At least 2.5 cm to scan reliably. Smaller tags are difficult to scan in low light or with shaking hands.' },
    ]
  ),
  art(
    'qr-code-for-wills-and-legal-documents',
    'QR Codes on Legal Documents: Verification Links and Digital Copies',
    'qr code legal document verification',
    'How lawyers and notaries use QR codes to link paper documents to digital registries and verified copies.',
    'Business & Regional',
    '5 min read',
    '2026-10-12',
    `
### 1. Verification Link

A QR code on a signed document links to an authority-hosted verification page. Entering the document number shows the official record and confirms the paper copy matches.

### 2. Court and Land Registry Systems

Some jurisdictions add official QR codes to certificates of title, court orders, and notarial acts. The code links to the issuing authority's system, making forgery detectable.

### 3. Law Firm Use

Private law firms use QR codes to link clients to a client portal containing the executed agreement, invoices, and correspondence. Authentication is required before access is granted.

### 4. Caution

A QR code does not itself authenticate a document. It provides a link; security depends on the destination system requiring authentication and maintaining an accurate record. A forged QR pointing to a fake page provides no protection.
    `,
    [
      { question: 'Does a QR on a document prove it is genuine?', answer: 'Only if the destination is an authoritative system with a tamper-evident record. A link to a controlled fake page proves nothing.' },
      { question: 'Can clients sign documents via a QR code?', answer: 'A QR can link to an e-signature platform. The legal validity depends on your jurisdiction and the e-signature standard used.' },
    ]
  ),
];
