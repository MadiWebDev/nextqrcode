import type { Article } from '../articles';
import { art } from './helper';

export const batch19: Article[] = [
  art(
    'qr-code-for-airport-wayfinding',
    'QR Codes in Airports: Wayfinding, Gate Changes, and Duty-Free Offers',
    'qr code airport wayfinding gate information',
    'Help travellers navigate airports and respond to gate changes quickly using QR codes on signage and boarding passes.',
    'Business & Regional',
    '5 min read',
    '2027-01-11',
    `
### 1. Wayfinding at Scale

Airports are large and change layouts frequently. A QR on each major corridor sign links to a live interactive map showing the current terminal layout, gate assignments, and walking times.

### 2. Gate Change Alerts

A QR on the boarding pass links to a real-time flight status page. Passengers in the lounge or shops can scan once and bookmark the page to receive gate change updates without refreshing the departure board.

### 3. Duty-Free Offers

A QR at duty-free store entrances links to the day's featured deals and product availability. Pre-purchase and collect on arrival at the destination is also an option.

### 4. Accessibility Information

A QR at accessibility desks and information points links to a guide for passengers with reduced mobility: assistance request forms, accessible routes, and priority boarding procedures.

### 5. Link Stability

Airports have multiple terminals and the layout changes with construction. Use a URL structure that supports terminal and version parameters so links remain valid through building work.
    `,
    [
      { question: 'Can a QR code replace airport signage?', answer: 'No. Static directional signage must remain. QR supplements with dynamic, detailed, or personalised information.' },
      { question: 'What if a passenger has no roaming data in the airport?', answer: 'Airports typically offer free WiFi. Make the connected WiFi QR prominent, then all subsequent QR content works via WiFi.' },
    ]
  ),
  art(
    'qr-code-for-charity-shops',
    'QR Codes in Charity Shops: Item Stories, Donation Drives, and Gift Aid',
    'qr code charity shop thrift store',
    'Use QR codes in charity retail to share item provenance, run donation campaigns, and capture Gift Aid declarations.',
    'Business & Regional',
    '5 min read',
    '2027-01-12',
    `
### 1. Item Stories

A QR on a vintage or donated item links to a brief provenance story: "This was donated by a family in Lahore who wanted it to find a new home." Stories increase perceived value and dwell time.

### 2. Gift Aid Declaration

In the UK, donations to registered charities qualify for Gift Aid. A QR on receipts and donation bags links to a digital Gift Aid declaration form. More declarations mean more government top-up per item sold.

### 3. Current Donation Drive

A QR in the window links to the charity's current priority list of needed items. Donors bring what is actually needed rather than what happens to be in their cupboard.

### 4. Online Shop

A QR links to the charity's online shop where items not sold locally are listed. Customers who do not find what they need in-store can browse the wider selection.
    `,
    [
      { question: 'Does Gift Aid apply to QR-captured declarations?', answer: 'Yes, as long as the form meets HMRC requirements and the declaration is retained. Verify with your charity\'s finance team.' },
      { question: 'Can a charity shop QR help value rare items?', answer: 'Link to a condition guide or category valuation page to help customers understand pricing and trust it.' },
    ]
  ),
  art(
    'qr-code-for-coworking-hot-desks',
    'QR Codes for Hot Desk Booking in Coworking: Real-Time Availability and Desk Policy',
    'qr code hot desk booking coworking',
    'Manage hot desk occupancy in coworking spaces with per-desk QR codes and real-time booking.',
    'Business & Regional',
    '4 min read',
    '2027-01-13',
    `
### 1. Per-Desk QR

Each hot desk has a unique QR. Scanning shows current availability, today's bookings, and the desk's equipment (monitor, USB hub, standing converter). One scan to book the specific desk.

### 2. Availability Dashboard

A QR at the entrance shows a floor-plan view of all desks with availability status. Members choose their preferred spot before walking to it.

### 3. Check-In Enforcement

Booked desks that are not checked in by scanning within 15 minutes are released back to availability. This prevents the frustrating scenario of reserved but empty desks.

### 4. Desk Policy Link

A QR on the desk links to the coworking code of conduct and hot desk policy: what is and is not allowed at shared desks, quiet zones, and call policies.
    `,
    [
      { question: 'How do I prevent members holding desks without being present?', answer: 'Auto-release bookings that are not confirmed by a check-in scan within a defined window after the booking start time.' },
      { question: 'Can desk QR codes track usage patterns?', answer: 'Yes. Scan events create a time-stamped occupancy record. Use this to identify underused areas and popular desk features.' },
    ]
  ),
  art(
    'qr-code-for-vending-machines',
    'QR Codes on Vending Machines: Cashless Payment, Allergen Info, and Fault Reports',
    'qr code vending machine payment',
    'Modernise vending machines with QR codes for contactless payment, nutritional transparency, and maintenance.',
    'Business & Regional',
    '4 min read',
    '2027-01-14',
    `
### 1. Cashless Payment

A QR on each product slot or on the machine panel initiates a payment flow via the machine operator's payment gateway. No coins, no card terminal — just a phone scan and approve.

### 2. Allergen and Nutritional Info

A QR beside each item slot links to the product's full nutritional panel and allergen list. Customers with dietary requirements can check before purchasing.

### 3. Fault Reporting

A QR on the machine links to a fault report form pre-filled with the machine ID. Customers report jammed items, payment failures, or out-of-stock slots without calling an 0800 number.

### 4. Operator Restocking

A QR accessible to operators opens the stock management view for that machine, showing current levels and restocking history. Efficient route planning for multi-machine operators.
    `,
    [
      { question: 'Can customers pay via QR on any vending machine?', answer: 'Only on machines integrated with a QR payment gateway. Retrofitting existing machines requires a connected payment module.' },
      { question: 'Does a vending machine QR need to be unique per machine?', answer: 'Yes. Encode the machine ID in the URL so payment, fault reports, and stock data link to the correct machine.' },
    ]
  ),
  art(
    'qr-code-for-voter-registration-drives',
    'QR Codes for Voter Registration Drives: Tabling, Door Knocking, and Campus Outreach',
    'qr code voter registration drive',
    'Use QR codes in registration drives to remove barriers to sign-up at events, on campuses, and during canvassing.',
    'Business & Regional',
    '5 min read',
    '2027-01-15',
    `
### 1. Registration Table

A QR on the table banner links directly to the online voter registration form for the relevant state or jurisdiction. Visitors scan and complete on their phone in two minutes.

### 2. Door Knocking Canvassing

Canvassers carry a printed card with a QR. Residents who are interested but busy scan to register later rather than turning the canvasser away.

### 3. Campus Outreach

Large QR posters in student unions, dining halls, and lecture theatres link to the registration form and deadline reminders. Small format QRs on flyers can be distributed at orientation.

### 4. Non-Partisan Compliance

Non-partisan registration drives must not influence candidate choice. The QR links only to the official government registration page, not any campaign or advocacy material.
    `,
    [
      { question: 'Can a QR voter registration drive target a specific party?', answer: 'Non-partisan QR drives cannot. Partisan campaigns can use QR for canvassing but must follow election law on disclosures.' },
      { question: 'How do I know if the linked registration page is up to date?', answer: 'Use the official government registration URL. Check it before each deployment; registration systems update around deadlines.' },
    ]
  ),
  art(
    'qr-code-for-auction-houses',
    'QR Codes at Auction Houses: Lot Details, Condition Reports, and Remote Bidding',
    'qr code auction house lot bidding',
    'Place QR codes beside auction lots for condition reports, provenance, and online bidding links.',
    'Business & Regional',
    '5 min read',
    '2027-01-16',
    `
### 1. Lot Detail Pages

A QR beside each lot links to the full catalogue entry: high-resolution images from multiple angles, dimensions, condition report, provenance, and estimate range. Buyers research without staff assistance.

### 2. Condition Reports

A QR links to a detailed condition report with macro photographs of any damage, restoration history, and conservator's notes. Buyers at preview events access professional assessments on their phone.

### 3. Remote Bidding Registration

A QR at the preview links to the absentee and telephone bid registration form. Buyers who cannot attend in person register before the sale.

### 4. Live Online Bidding

A QR displayed during the sale links to the real-time online bidding platform. Broadcast to social channels so remote buyers can scan and join the room.
    `,
    [
      { question: 'Should every lot have its own QR?', answer: 'Yes. Each lot needs a unique code linking to its specific catalogue entry, condition report, and bidding page.' },
      { question: 'Can a buyer complete a purchase via QR?', answer: 'Bidding and payment can be initiated via QR-linked web platforms. Final invoicing usually requires account verification.' },
    ]
  ),
  art(
    'qr-code-for-trade-certification',
    'QR Codes on Trade Certifications and Licences: Verification and Expiry Check',
    'qr code trade licence certification verification',
    'Use QR codes on contractor licences and trade certifications to allow quick on-site verification.',
    'Business & Regional',
    '5 min read',
    '2027-01-17',
    `
### 1. On-Site Verification

A homeowner or project manager scans the electrician's or plumber's licence QR to confirm it is current, issued by the correct authority, and covers the right trade classification.

### 2. Issuing Authority Backend

The QR encodes a token linking to the licence record in the issuing authority's system. The page shows: name, licence number, classification, issue date, and expiry. No more calling the authority to verify.

### 3. Fraud Prevention

Forged licences are a serious problem in skilled trades. A QR that verifies against a live government database is nearly impossible to fake convincingly.

### 4. Expiry Alerts

Some systems send an expiry reminder to the licence holder when the record is queried near the expiry date. This helps keep the industry compliant.
    `,
    [
      { question: 'Does a QR on a licence prove it is genuine?', answer: 'Only if the QR links to a verified government or authority database. A QR linking to a privately controlled page can be forged.' },
      { question: 'Can a contractor print their own licence QR?', answer: 'Only the issuing authority should generate and control the QR. Self-generated licence QRs have no verification value.' },
    ]
  ),
  art(
    'qr-code-for-shared-workspaces',
    'QR Codes in Shared Workspaces: Printer Setup, Network Access, and Room Booking',
    'qr code shared office workspace printer wifi',
    'Simplify shared office technology with QR codes for printer drivers, WiFi login, and room booking.',
    'Business & Regional',
    '4 min read',
    '2027-01-18',
    `
### 1. Printer Setup QR

A QR on each printer links to the driver download page, IP address, and a step-by-step setup guide. Reduces IT support tickets from new staff.

### 2. WiFi Network QR

A WiFi QR (WIFI: URI format) on each desk or meeting room wall allows guests to join the office network with one scan. Eliminate the embarrassing hunt for the password.

### 3. Meeting Room Booking

A QR on each meeting room door opens the room's calendar for that day. Scan to see availability and book the next free slot without navigating a booking system.

### 4. AV Setup Guides

A QR near the projector or screen links to a quick-start AV guide: which cable to use, how to share from Mac or Windows, and who to call for support.
    `,
    [
      { question: 'Should the printer QR link to a driver download?', answer: 'Yes. Include the drivers for Windows, Mac, and Linux, along with the IP address and setup screenshots.' },
      { question: 'Is a WiFi QR code secure in a shared office?', answer: 'Use a separate guest SSID with client isolation. Do not put the main staff network password in a shared QR.' },
    ]
  ),
  art(
    'qr-code-for-dentist-practices',
    'QR Codes for Dental Practices: Check-In, Treatment Plans, and Aftercare',
    'qr code dentist dental practice',
    'Reduce dental reception workload with QR codes for patient check-in, form completion, and aftercare.',
    'Business & Regional',
    '5 min read',
    '2027-01-19',
    `
### 1. Patient Check-In

A QR at the reception desk links to the check-in page. Patients confirm their arrival, update any medical history changes, and accept the appointment reminder without staff intervention.

### 2. Medical History Form

New patients scan to complete the medical history and consent form on their phone before their first appointment. Existing patients scan to review and update their records.

### 3. Treatment Plan Access

After a consultation, a QR on the treatment plan printout links to a detailed digital version with diagrams, alternative treatment options, and cost breakdown. Patients review at home before deciding.

### 4. Post-Treatment Aftercare

A QR on the aftercare leaflet links to videos demonstrating correct brushing after a filling, orthodontic appliance cleaning, or implant care. Better compliance reduces return visits.
    `,
    [
      { question: 'Can patient data be accessed via a QR without authentication?', answer: 'No. Any patient-specific data must be behind authentication. The QR triggers the login flow for the patient portal.' },
      { question: 'Should the QR aftercare guide ever expire?', answer: 'No. Use a permanent URL. Patients may refer back months later for a refresher.' },
    ]
  ),
  art(
    'qr-code-for-art-therapy',
    'QR Codes in Art Therapy and Creative Workshops: Prompt Libraries and Portfolio Sharing',
    'qr code art therapy creative workshop',
    'Use QR codes to deliver creative prompts, share participant portfolios, and document therapeutic outcomes.',
    'Business & Regional',
    '4 min read',
    '2027-01-20',
    `
### 1. Creative Prompt Libraries

A QR at each workshop station links to a set of visual or written prompts tailored to the session theme. Facilitators update the prompt library centrally; all stations show the current set.

### 2. Participant Portfolios

With participant consent, finished artwork is photographed and added to their digital portfolio linked from a personal QR. Progress over multiple sessions is visible in one place.

### 3. Therapeutic Documentation

Facilitators scan a session QR to access the observation form for that group. Notes are stored digitally and contribute to outcome tracking required by funding bodies.

### 4. Privacy and Consent

Photograph and share only with explicit consent, especially in vulnerable adult or child settings. Use anonymised identifiers rather than names on digital portfolios.
    `,
    [
      { question: 'Can participants access their own portfolios via QR?', answer: 'Yes with appropriate authentication. A simple PIN or email link provides access without a complex account system.' },
      { question: 'Should artwork be identifiable in a digital portfolio?', answer: 'Only with the participant\'s informed consent. Default to anonymised images with a code identifier.' },
    ]
  ),
];
