import type { Article } from '../articles';
import { art } from './helper';

export const batch31: Article[] = [
  art(
    'qr-code-for-recruitment-agencies',
    'QR Codes for Recruitment Agencies: Job Listings, CV Upload, and Candidate Portals',
    'qr code recruitment agency job listing cv upload',
    'Use QR codes on job posters and agency materials to direct candidates to live listings and CV submission.',
    'Business & Regional',
    '5 min read',
    '2027-05-11',
    `
### 1. Job Poster QR

A QR on a physical job poster at a transport hub, campus, or shop window links to the live job listing page. Candidates apply immediately on their phone while the motivation is high.

### 2. CV Upload

A QR links to the speculative CV submission form. Candidates who do not see a matching live role submit their details and are notified when a suitable vacancy arises.

### 3. Candidate Portal

A QR on interview confirmation letters links to the candidate portal: interview preparation tips, company profile, interview format, and documents to bring.

### 4. Referral Programme

A QR on employee referral programme materials links to the referral submission form. Current employees submit referrals from their phone without navigating the HR system.
    `,
    [
      { question: 'Should job poster QR codes link to the live listing or a general jobs page?', answer: 'Directly to the specific listing. Candidates who land on a general jobs page often leave without applying. One scan, one job, one application.' },
      { question: 'Can a QR poster work if the job fills before the poster comes down?', answer: 'Yes if the listing page updates to "closed". Redirect closed listings to similar vacancies rather than a 404.' },
    ]
  ),
  art(
    'qr-code-for-car-parks-permit-management',
    'QR Codes for Car Park Permit Management: Multi-Site, Enforcement, and Overflow',
    'qr code car park permit management multi-site',
    'Manage complex car park permit schemes across multiple sites with QR-verified digital permits.',
    'Business & Regional',
    '5 min read',
    '2027-05-12',
    `
### 1. Multi-Site Permit Verification

A QR-based permit encodes the permitted sites, valid hours, and vehicle registration. Enforcement officers at any site scan to verify without checking a separate list.

### 2. Overflow and Visitor Management

During busy periods, temporary overflow permits are issued with short-validity QR codes. Parking managers issue from a web form; the permit arrives by SMS in seconds.

### 3. Permit Applications

A QR on the car park entrance sign links to the permit application form: number of permits available, eligibility criteria, and a waitlist if full.

### 4. Enforcement Audit Log

Each scan by an enforcement officer is logged with time, location, and officer ID. The log provides evidence for appeals and identifies sites with high non-compliance rates.
    `,
    [
      { question: 'Can a QR permit system replace physical permit stickers on windscreens?', answer: 'Yes. A digital display of the QR permit on the phone, or a printed permit, are both verified the same way by enforcement scanners.' },
      { question: 'How do overflow permits prevent abuse from the previous day?', answer: 'Set a validity window of hours, not days. A permit valid from 8 am to 6 pm on a specific date cannot be reused the following day.' },
    ]
  ),
  art(
    'qr-code-for-retail-fitting-rooms',
    'QR Codes in Fitting Rooms: Size Requests, Style Suggestions, and Basket Saving',
    'qr code fitting room size request retail',
    'Use QR codes in fitting rooms to let shoppers request sizes, save their basket, and discover complementary items.',
    'Business & Regional',
    '4 min read',
    '2027-05-13',
    `
### 1. Size Request Without Leaving

A QR in the fitting room links to a size request form pre-filled with the room number. The shopper submits a different size; a staff member brings it without the shopper having to dress, leave, and return.

### 2. Complete the Look

A QR links to a "complete the look" page for the item being tried on: suggested tops, shoes, and accessories. Shoppers discover combinations without leaving the fitting room.

### 3. Save to Basket

A QR links to a basket-saving page where shoppers add items they are trying to their online basket. They purchase in-store or complete the order later at home.

### 4. Feedback

A QR links to a brief fitting room feedback form: is the room clean and well-lit, is the correct size range available, and any other comments. Real-time feedback to the floor manager.
    `,
    [
      { question: 'Can a fitting room QR increase conversion rates?', answer: 'Yes. Reducing the friction of requesting a size increases the likelihood of completing a purchase, particularly during busy periods when staff are stretched.' },
      { question: 'Should fitting room QRs be the same for every room?', answer: 'No. Use a unique QR per room so size requests and feedback are attributed to the correct space.' },
    ]
  ),
  art(
    'qr-code-for-nhs-gp-practices',
    'QR Codes for GP Practices: Online Booking, NHS App Links, and Repeat Prescription Requests',
    'qr code gp practice nhs appointment booking',
    'Use QR codes in GP waiting rooms and on correspondence for appointment booking, prescription requests, and self-help.',
    'Business & Regional',
    '5 min read',
    '2027-05-14',
    `
### 1. Online Appointment Booking

A QR in the waiting room and on prescription bags links to the practice's online appointment booking system. Reduces phone queue length and offers 24/7 booking access.

### 2. NHS App Deep Link

A QR links to the NHS App download or to a specific task in the app: repeat prescription, medical record access, or appointment booking. Increases NHS App adoption, which reduces practice admin workload.

### 3. Repeat Prescription Request

A QR on the prescription bag links to the repeat request form. Patients order their next prescription from home without a phone call.

### 4. Self-Help Resources

A QR in the waiting room links to NHS-approved self-help guides for common conditions: upper respiratory tract infections, mental health first aid, and minor injury management. Reduces unnecessary appointments.
    `,
    [
      { question: 'Should a GP practice QR link to unofficial health websites?', answer: 'No. Link only to NHS.uk, BNF, or NICE-approved resources. Unofficial sites may contain inaccurate or harmful health information.' },
      { question: 'Can a QR replace the prescription delivery counter?', answer: 'Not entirely. Patients without smartphones still need a counter service. QR accelerates the process for digital-comfortable patients.' },
    ]
  ),
  art(
    'qr-code-for-language-exchange',
    'QR Codes for Language Exchange and Tandem Learning: Partner Matching and Session Notes',
    'qr code language exchange tandem learning partner',
    'Use QR codes in language exchange programmes for partner matching, session scheduling, and conversation note sharing.',
    'Business & Regional',
    '4 min read',
    '2027-05-15',
    `
### 1. Partner Profile QR

Each participant receives a personal QR linking to their language exchange profile: native language, target language, level, availability, and topics of interest. Scan at a meet-up to connect profiles.

### 2. Session Schedule

A QR in the language exchange group's communication links to the session calendar: upcoming exchanges, facilitator, location or video link, and topic theme.

### 3. Conversation Prompts

A QR at the start of a session links to that week's conversation prompt cards: topic questions, vocabulary list, and cultural notes. Participants prepare or refer to them during the exchange.

### 4. Progress Notes

After each session, a QR links to a brief note-taking form: vocabulary learned, grammar points practised, and what to focus on next. A record the learner builds over time.
    `,
    [
      { question: 'Should language exchange profiles be publicly searchable?', answer: 'Only within the programme\'s own community. Publicly listed profiles create privacy and safety risks. Use an opt-in community directory.' },
      { question: 'Can a QR profile replace business cards at a language exchange meet-up?', answer: 'Yes. Scanning a QR profile card is faster, richer, and more useful than a business card exchange.' },
    ]
  ),
  art(
    'qr-code-for-escape-rooms-accessibility',
    'Accessible Escape Rooms: Designing QR Puzzles for Players with Disabilities',
    'qr code escape room accessibility disability',
    'Design QR-based escape room puzzles that are accessible to players with visual, motor, and cognitive differences.',
    'Business & Regional',
    '5 min read',
    '2027-05-16',
    `
### 1. Visual Impairment

Provide audio descriptions of each QR clue's visual content as an audio track on the linked page. Large-print cards with Braille equivalents can sit beside QR puzzles for tactile discovery.

### 2. Motor Impairment

Ensure QR codes are at accessible heights (80 to 120 cm) and on stable surfaces, not concealed in tight or high locations that require reaching or crouching. A phone or tablet stand in each room removes the need to hold a device precisely.

### 3. Cognitive Accessibility

Keep linked page text concise. Use icons alongside text instructions. Offer a simplified mode on the hint system with less complex language for neurodivergent players.

### 4. Adjustable Difficulty

A QR at the host desk links to an accessibility settings page: simpler clue language, extended timer, skip options for specific puzzles. Teams self-select the experience level that works for them.

### 5. Pre-Visit Information

A QR in the booking confirmation links to an accessibility guide: which rooms are step-free, what sensory conditions are present (lighting levels, audio), and how to request adaptations.
    `,
    [
      { question: 'Can an escape room be fully accessible to a wheelchair user?', answer: 'With intentional design yes: step-free entry, clue placement at seated height, and no physical dexterity puzzles. Many venues are retrofitting for this.' },
      { question: 'Should accessibility adaptations require advance booking?', answer: 'Yes for significant adaptations. Spontaneous access improvements (audio descriptions, large print) should be standard and always available.' },
    ]
  ),
  art(
    'qr-code-for-job-applications-manufacturing',
    'QR Codes on Manufacturing Job Postings: Apply, Site Tour Video, and Shift Options',
    'qr code manufacturing job application site tour',
    'Recruit production line workers faster with QR codes on job posters linking to short-form applications.',
    'Business & Regional',
    '4 min read',
    '2027-05-17',
    `
### 1. Short-Form Application

A QR on a factory gate or community centre poster links to a three-field application: name, phone number, and available start date. Follow-up by phone within 24 hours.

### 2. Site Tour Video

A QR links to a 90-second virtual site tour: the production floor, welfare facilities, and a shift in the life of a current employee. Reduces no-shows to assessment days by setting realistic expectations.

### 3. Shift and Pay Information

A QR links to a clear breakdown of available shifts: day, night, rotating, and weekend. Hours, pay rates, overtime rules, and shift patterns in plain language. Candidates self-select the right fit.

### 4. Assessment Day Booking

A QR links to an assessment day booking form. Candidates who complete the short-form application are invited by text with a QR to book their slot.
    `,
    [
      { question: 'Why use a short-form QR application for manufacturing roles?', answer: 'High-volume manufacturing recruitment needs speed. A three-field QR form converts opportunistic job seekers who would not return to fill a long form.' },
      { question: 'Should a factory gate job poster QR collect a CV?', answer: 'No for entry-level production roles. CV collection adds friction and CV content is less predictive than assessment performance for these roles.' },
    ]
  ),
  art(
    'qr-code-for-pharmacist-consultations',
    'QR Codes for Pharmacist Minor Illness Consultations: Triage, Service Info, and Referral',
    'qr code pharmacist minor illness consultation triage',
    'Use QR codes in pharmacies for minor illness service triage, consultation preparation, and GP referral flow.',
    'Business & Regional',
    '4 min read',
    '2027-05-18',
    `
### 1. Minor Illness Triage

A QR at the pharmacy entrance links to a brief symptom checker: is this a minor illness suitable for Pharmacy First, or does it need urgent GP or 999 action? Guides patients to the right service.

### 2. Consultation Preparation

A QR links to a pre-consultation form: symptoms, duration, medications already tried, and any relevant medical history. The pharmacist reviews before the consultation begins.

### 3. Service Information

A QR explains what conditions Pharmacy First covers (in the UK), what the consultation involves, and what happens if a prescription is issued. Demystifies the service for first-time users.

### 4. GP or Hospital Referral

After a consultation, a QR on the referral notice links to the GP's online booking system or the urgent care finder. Patients take action immediately.
    `,
    [
      { question: 'Does a Pharmacy First consultation QR need to comply with health data law?', answer: 'Yes. Any pre-consultation form that captures health information must be handled in compliance with GDPR and the Data Security and Protection Toolkit.' },
      { question: 'Can a QR symptom checker replace a pharmacist assessment?', answer: 'No. The QR triage is a signposting tool only. Clinical assessment requires a qualified pharmacist.' },
    ]
  ),
  art(
    'qr-code-for-museum-art-conservation',
    'QR Codes on Conservation Projects: Technique Transparency and Donor Recognition',
    'qr code museum conservation project donor',
    'Use QR codes near conserved artworks to share conservation stories, techniques, and donor acknowledgement.',
    'Business & Regional',
    '5 min read',
    '2027-05-19',
    `
### 1. Conservation Story

A QR beside a recently conserved object links to the conservation story: what condition the object was in, what techniques were used, and what the conservator discovered during the process.

### 2. Before and After

A QR links to before-and-after imagery of the conservation treatment. These are among the most engaging content types in museum digital communication. Visitors are fascinated by the transformation.

### 3. Donor Recognition

Visitors who funded a conservation project see their name or organisation acknowledged on the linked page. QR-linked donor recognition is more visible and shareable than a small wall text.

### 4. Conservation Science Detail

A QR links to the technical report: analysis results (X-ray, infrared reflectography, paint analysis), materials identified, and any historical discoveries. Accessible to specialist visitors without cluttering the gallery label.
    `,
    [
      { question: 'Can a QR on a conservation project help future funding campaigns?', answer: 'Yes. Showing the impact of past conservation funding in detail is among the most persuasive tools for prospective donors and grant funders.' },
      { question: 'Should the conservation report be freely accessible?', answer: 'Yes. Open access to conservation data supports the field, advances scholarship, and demonstrates transparency to funders.' },
    ]
  ),
  art(
    'qr-code-for-home-care-workers',
    'QR Codes for Home Care Workers: Visit Logs, Care Plans, and Medication Records',
    'qr code home care worker visit log care plan',
    'Use QR codes at care recipients\' homes for electronic visit logging, care plan access, and medication records.',
    'Business & Regional',
    '6 min read',
    '2027-05-20',
    `
### 1. Electronic Visit Verification

A QR at the care recipient's front door or beside their photo on the care plan links to the electronic visit check-in. The carer scans on arrival and departure. The agency has a timestamped visit log for compliance and invoicing.

### 2. Care Plan Access

A QR links to the care plan: current needs, daily routine, personal preferences, and risk assessments. Carers access the latest version; changes made by the coordinator appear immediately.

### 3. Medication Records

A QR links to the MAR (Medication Administration Record) for that visit. The carer confirms each medication administered and notes any refusals or concerns. The record is shared with the GP or pharmacist as needed.

### 4. Incident Reporting

A QR at the front door also links to the incident reporting form. Any accident, safeguarding concern, or unplanned event is reported digitally during or immediately after the visit.
    `,
    [
      { question: 'Can home care visit logs via QR satisfy CQC compliance?', answer: 'Yes for many providers. Electronic visit verification with timestamped records is increasingly accepted. Confirm requirements with your specific CQC registration.' },
      { question: 'Should the care plan QR require login for a carer on every visit?', answer: 'A persistent session on a company device is practical. Individual consumer devices should require authentication on each use for security.' },
    ]
  ),
];
