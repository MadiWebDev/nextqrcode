import type { Article } from '../articles';
import { art } from './helper';

export const batch21: Article[] = [
  art(
    'qr-code-for-pharmacovigilance',
    'QR Codes for Pharmacovigilance: Adverse Event Reporting Made Easy',
    'qr code adverse event reporting pharmacovigilance',
    'Use QR codes on medicine packaging to simplify adverse drug reaction reporting by patients and healthcare professionals.',
    'Business & Regional',
    '6 min read',
    '2027-01-31',
    `
### 1. Why Fast Reporting Matters

Adverse drug reactions that go unreported delay safety signal detection. A QR on the outer carton reduces the friction from incident to report.

### 2. Patient-Facing Reporting

A QR on the packaging links to the national yellow card or MedWatch form, pre-populated with the drug name, batch number, and market authorisation holder. The patient adds the reaction and submits.

### 3. Healthcare Professional Workflow

A QR in the prescribing information pamphlet (SmPC) links to the professional reporting portal. HCPs complete and submit during a consultation or at a convenient moment.

### 4. Regulatory Requirements

Many regulators (EMA, FDA, MHRA) accept electronic adverse event reports. Ensure the QR links to an official portal or a licensed pharmacovigilance system that forwards to the regulator. Verify compliance before launch.
    `,
    [
      { question: 'Does a QR on medicine packaging satisfy regulatory reporting obligations?', answer: 'It facilitates reporting but does not satisfy the MAH\'s own signal detection and reporting obligations, which are separate.' },
      { question: 'Should the reporting QR work offline?', answer: 'No. Reports require submission to a live system. Prompt the user to save a draft if they have no connection.' },
    ]
  ),
  art(
    'qr-code-for-holiday-lets',
    'QR Codes for Holiday Lets and Airbnb: Guest Guides, WiFi, and Checkout Instructions',
    'qr code holiday let airbnb guest guide',
    'Use QR codes in self-catering properties for arrival instructions, WiFi, and local recommendations.',
    'Business & Regional',
    '5 min read',
    '2027-02-01',
    `
### 1. Welcome QR

A QR on the welcome card or the front door links to the digital guest guide: entry codes, WiFi credentials, appliance guides, checkout time, and bin day.

### 2. WiFi QR

A WiFi QR (WIFI: URI) on a card in the kitchen connects guests to the network in one scan. No hunting for a password written on a drawer.

### 3. Local Recommendations

A QR links to the host's curated local guide: best restaurants, nearest supermarket, parking, and things to do. A personal recommendation page beats a generic tourist booklet.

### 4. Emergency and Host Contact

A QR links to the emergency contacts page: property address for emergency services, host phone, and local doctor. This page should be cached by the guest's phone for offline access.

### 5. Checkout Instructions

A QR on the fridge or notice board links to the checkout checklist: where to leave keys, how to set the heating, and what to do with rubbish. Reduces checkout mistakes.
    `,
    [
      { question: 'Should a holiday let QR code be the same for all guests?', answer: 'Yes for general guides and WiFi. Use a guest-specific code only if you personalise the guide with their name or check-in date.' },
      { question: 'What if guests arrive after the host goes to bed?', answer: 'A QR with the entry code and full welcome guide allows self check-in at any hour without the host being present.' },
    ]
  ),
  art(
    'qr-code-for-cleaning-services',
    'QR Codes for Cleaning Companies: Job Sheets, Photo Evidence, and Client Feedback',
    'qr code cleaning service job sheet',
    'Use QR codes on cleaning job cards and client premises for task assignment, evidence, and ratings.',
    'Business & Regional',
    '4 min read',
    '2027-02-02',
    `
### 1. Job Sheet Access

A QR on the job card links to the digital task sheet: rooms to clean, special instructions, supplies to use, and any hazards noted by the client. Cleaners access it on their phone without paper.

### 2. Photo Evidence

After completing each area, the cleaner scans a location QR and submits before-and-after photos. The client receives a visual log of the clean. Reduces disputes about work quality.

### 3. Client Feedback

A QR on the feedback card (left on the kitchen counter) links to a three-question rating form. Clients rate the clean while the experience is fresh. Responses go directly to the operations manager.

### 4. Consumable Tracking

A QR on supply bottles links to a stock level log. The cleaner updates when a product runs low. The office orders before the next visit without a separate call.
    `,
    [
      { question: 'Should client homes have a fixed QR sticker for the cleaner?', answer: 'Yes. A permanent QR on the client\'s inside door or utility cupboard gives the cleaner instant access to the job sheet every visit.' },
      { question: 'Is photo evidence required for commercial cleaning contracts?', answer: 'Often yes, especially in regulated environments like healthcare or hospitality. QR-triggered photo submission makes this frictionless.' },
    ]
  ),
  art(
    'qr-code-for-local-elections',
    'QR Codes for Local Elections: Candidate Profiles, Polling Locations, and Results',
    'qr code local election candidate information',
    'Use QR codes in local election campaigns and official notices for balanced voter information.',
    'Business & Regional',
    '5 min read',
    '2027-02-03',
    `
### 1. Candidate Profile QR

Each candidate's campaign literature carries a QR linking to their profile page: biography, policy positions, endorsements, and contact. Voters research before deciding.

### 2. Polling Location Finder

Electoral commission QR on official polling cards links to the verified polling place finder. One scan shows the correct location, accessible routes, and opening hours.

### 3. Declaration of Result

A QR on the official count notice links to the live results page. Journalists and observers scan for real-time updates without needing a separate URL.

### 4. Non-Partisan Balance

Election authority QRs must be strictly non-partisan. Candidate QRs are inherently partisan. Keep campaign QRs on campaign materials and official QRs on official notices — never mix them.
    `,
    [
      { question: 'Can official election QR codes point to candidate pages?', answer: 'No. Official authority QRs must only link to non-partisan government information. Candidate links appear only on campaign material.' },
      { question: 'Is there a risk that a campaign QR points to false information?', answer: 'Yes. Campaign QRs are the responsibility of the candidate. Voters should verify the domain matches the official campaign website.' },
    ]
  ),
  art(
    'qr-code-for-pet-grooming',
    'QR Codes for Pet Grooming Salons: Appointment Booking, Style Photos, and Care Advice',
    'qr code pet grooming salon appointment',
    'Use QR codes in grooming salons for appointment management, style reference images, and post-groom care.',
    'Business & Regional',
    '4 min read',
    '2027-02-04',
    `
### 1. Appointment Booking

A QR on the salon window and on post-groom receipts links to the booking system. Pet owners book the next appointment before leaving rather than forgetting over the following weeks.

### 2. Style and Trim Reference

A QR on the client card links to the style notes and reference photo for that pet. Groomers access the brief before the appointment. Owners can update preferred styles online between visits.

### 3. Post-Groom Care Guide

A QR on the aftercare leaflet links to breed-specific coat care tips, recommended brushing intervals, and the products used during the groom. Owners who follow up between visits keep coats healthier.

### 4. Breed Care Library

A QR in the reception area links to a breed care library. Owners waiting for their pet browse tips for their breed, discover products available in the salon, and ask informed questions.
    `,
    [
      { question: 'Should a grooming salon QR booking system require pre-payment?', answer: 'Optional pre-payment with a small deposit reduces no-shows. The booking QR can trigger the payment flow before confirming the slot.' },
      { question: 'Can a QR track which groom style was used for each visit?', answer: 'Yes if the groomer completes a QR-triggered session form with style and product notes. The client history builds automatically.' },
    ]
  ),
  art(
    'qr-code-for-cycling-routes',
    'QR Codes on Cycling Routes: Trail Maps, Safety Notices, and Bike Repair Stations',
    'qr code cycling route trail map',
    'Place QR codes at cycling route junctions and bike repair stations for maps, safety, and maintenance help.',
    'Business & Regional',
    '4 min read',
    '2027-02-05',
    `
### 1. Route Map and GPX Download

A QR at the trailhead or junction links to a downloadable GPX file and an interactive route map. Cyclists load the route into their app without pre-planning on a computer.

### 2. Safety Notices

A QR on trail signage links to current safety notices: surface condition warnings, temporary closures, and wildlife precautions. Updates published centrally are instantly visible at every trailhead.

### 3. Bike Repair Station

A QR at each repair station links to a guide for the tools available: how to fix a puncture, adjust brakes, and true a wheel. Short videos work well for roadside guidance.

### 4. Durable Label for Wet Environments

Cycling trail signs get wet. Use laminated aluminium or acrylic signs with UV-printed QR codes. Place at handlebar height (about 100 to 110 cm) so cyclists can scan without fully dismounting.
    `,
    [
      { question: 'Can a cyclist scan a QR while riding?', answer: 'No. Design the placement for stopped riders. Use clear "stop here to scan" call to action at designated points.' },
      { question: 'Should cycling route QR pages work offline?', answer: 'Yes. Implement as a PWA. Riders who scan at the trailhead can access the route map and safety notes without signal mid-trail.' },
    ]
  ),
  art(
    'qr-code-for-farmers-markets',
    'QR Codes at Farmers Markets: Producer Profiles, Provenance, and Pre-Order',
    'qr code farmers market produce provenance',
    'Use QR codes at farmers market stalls to share farm stories, certifications, and weekly ordering.',
    'Business & Regional',
    '5 min read',
    '2027-02-06',
    `
### 1. Producer Profile

A QR on the stall banner links to the farm's profile: location map, farming methods, certifications (organic, free-range, heritage breed), and the family story. Buyers connect with producers personally.

### 2. Provenance and Batch Info

A QR on produce packaging or a printed tag links to the harvest date, variety, and field origin. For meat, it links to the farm's welfare standards and slaughter date.

### 3. Weekly Pre-Order

A QR links to the weekly order form so regular customers pre-order their box. Producers know demand before harvest and reduce waste. Customers get first pick of limited produce.

### 4. Seasonal Availability Alerts

A "follow this farm" QR links to a sign-up page for seasonal availability notifications. Customers receive an email or SMS when asparagus season starts or the orchard harvest begins.
    `,
    [
      { question: 'Should farmers market QR codes be printed on reusable tags?', answer: 'Yes. Laminated cards or wooden tags that can be updated work well. Avoid single-use stickers on every item.' },
      { question: 'Can a QR verify organic certification?', answer: "Link to the certification body's register page or the farm's certification document. The buyer can cross-check against the official registry." },
    ]
  ),
  art(
    'qr-code-for-music-festivals',
    'QR Codes at Music Festivals: Lineup, Stage Maps, Set Times, and Lost and Found',
    'qr code music festival lineup map',
    'Deploy QR codes at festival gates, stages, and info points for live schedule updates and safety info.',
    'Business & Regional',
    '5 min read',
    '2027-02-07',
    `
### 1. Live Lineup and Set Times

A QR at the festival entrance and on printed wristbands links to the live schedule app or page. Set time changes, cancellations, and stage swaps update in real time.

### 2. Stage and Facility Map

A QR links to an interactive map showing stage locations, toilets, medical points, water stations, and silent disco. More useful than a static printed map that becomes wrong by day two.

### 3. Lost and Found

A QR at the info tent links to the digital lost and found log. Festivalgoers report lost items and search for found items without queuing at the desk.

### 4. Safety and Welfare

A QR on welfare tent signage links to drug harm reduction resources, mental health support contacts, and the festival's consent and safety policy. Fast access to help when needed.

### 5. Cashless Wristband

Many modern festivals encode a cashless payment token on the wristband. A QR on the wristband activation card links to the top-up page and balance check.
    `,
    [
      { question: 'Should festival QR codes work without mobile data in a crowded field?', answer: 'Festival sites often have poor signal. Partner with a telecom sponsor for temporary capacity, and implement an offline-cached PWA for the schedule.' },
      { question: 'Can the wristband QR and information QR be the same code?', answer: 'No. The wristband encodes an account token; the information QR links to public content. Use separate codes for each function.' },
    ]
  ),
  art(
    'qr-code-for-yoga-studios',
    'QR Codes in Yoga Studios: Class Schedules, Teacher Profiles, and On-Demand Content',
    'qr code yoga studio class schedule',
    'Use QR codes in yoga studios to share class timetables, teacher bios, and online class links.',
    'Business & Regional',
    '4 min read',
    '2027-02-08',
    `
### 1. Class Schedule

A QR at the studio entrance and reception links to the current class schedule with teacher, time, level, and style. Members check from their phone rather than a printed timetable that changes weekly.

### 2. Teacher Profiles

A QR near each teacher's photo links to their profile: training background, teaching style, specialist classes, and any teacher training they offer.

### 3. Online and On-Demand Content

A QR links to the studio's on-demand class library. Members who miss a class or practise at home access the archive. Drives additional revenue without a separate marketing push.

### 4. New Member Welcome

A QR on the welcome pack links to studio etiquette, what to bring, and a beginner guide to the first class. Reduces new member anxiety and improves retention.
    `,
    [
      { question: 'Should a yoga studio QR schedule require a login?', answer: 'Public schedule: no login needed. Booking a spot and accessing on-demand content: login required.' },
      { question: 'Can a QR replace the printed studio timetable?', answer: 'For most members yes, but keep a small printed version for members who prefer paper or have limited smartphone access.' },
    ]
  ),
  art(
    'qr-code-for-sports-coaching-certificates',
    'QR Codes on Sports Coaching Certificates: Credential Verification for Parents and Clubs',
    'qr code sports coaching certificate verification',
    'Issue QR-verified coaching certificates so parents and clubs can instantly confirm qualifications.',
    'Business & Regional',
    '5 min read',
    '2027-02-09',
    `
### 1. The Safeguarding Context

Parents entrust coaches with their children. A QR on the coaching certificate links to the awarding body's registry, confirming the qualification is genuine, current, and that the coach has passed required background checks.

### 2. What the QR Links To

The awarding body's verification page shows: coach name, qualification level, issue date, expiry, and that required DBS or equivalent safeguarding check is current. No sensitive personal data is exposed.

### 3. Club Verification Workflow

Club administrators scan all new coaches before they take their first session. The scan event is logged, providing an audit record that due diligence was carried out.

### 4. Volunteer Coaches

Volunteer club coaches often have multiple certifications: first aid, safeguarding awareness, and the sport-specific qualification. Each certificate can carry its own QR, or a combined profile page lists all.
    `,
    [
      { question: 'Does a QR on a certificate prove it has not been tampered with?', answer: 'Only if the QR links to the awarding body\'s own registry. A self-generated certificate with a QR to a self-controlled page can still be faked.' },
      { question: 'Should parents scan a coach\'s certificate QR?', answer: 'Encouraged. Transparent verification builds trust. Coaches with genuine qualifications welcome the practice.' },
    ]
  ),
];
