import type { Article } from '../articles';
import { art } from './helper';

export const batch28: Article[] = [
  art(
    'qr-code-for-bicycle-repair-shops',
    'QR Codes for Bike Repair Shops: Job Status, Parts Availability, and Service History',
    'qr code bike repair shop service status',
    'Use QR codes in bicycle workshops for customer job updates, parts lookup, and service history access.',
    'Business & Regional',
    '4 min read',
    '2027-04-11',
    `
### 1. Job Status Updates

A QR on the job ticket links to a live status page: awaiting parts, in progress, ready to collect. Customers check without calling the shop. The mechanic updates status from the workbench.

### 2. Parts Availability

A QR near the parts counter links to the shop's current stock page. Customers check whether a specific brake pad or tyre is in stock before making a trip.

### 3. Service History

A QR on the customer's loyalty card links to their bike's service history: all jobs, parts replaced, and dates. Useful when selling the bike or diagnosing a recurring fault.

### 4. Booking

A QR on the window links to the service booking form: type of service, fault description, and preferred date. Reduces phone calls and captures information the mechanic needs before the bike arrives.
    `,
    [
      { question: 'Should a job status QR require a login?', answer: 'A unique unguessable token per job (no login) balances privacy and convenience for a single-ticket use case.' },
      { question: 'Can service history QRs help when selling a bicycle?', answer: 'Yes. A documented service history adds buyer confidence. The QR makes the history shareable without physical paperwork.' },
    ]
  ),
  art(
    'qr-code-for-charity-events',
    'QR Codes at Charity Events: Registration, Silent Auction, and Real-Time Fundraising',
    'qr code charity event fundraising silent auction',
    'Use QR codes at fundraising dinners and charity events for guest check-in, silent auction bids, and real-time totals.',
    'Business & Regional',
    '5 min read',
    '2027-04-12',
    `
### 1. Guest Check-In

Guests scan a QR at the door to check in and receive their table assignment digitally. The system confirms they arrived; the fundraising team tracks attendance in real time.

### 2. Silent Auction Bidding

A QR on each auction item links to the bidding page for that lot. Guests place bids from their phone without paper bid sheets. The highest bid is updated live and guests receive outbid notifications.

### 3. Real-Time Fundraising Total

A QR visible on a screen or programme links to the live fundraising total: money raised so far, pledges outstanding, and percentage of target. Updates in real time throughout the evening.

### 4. Donation Link

A QR at each table links to the donation page so guests who were not reached personally by the fundraising team can still give. Easy giving at the moment of highest emotional engagement.
    `,
    [
      { question: 'Can a QR silent auction replace a dedicated events app?', answer: 'For events without an existing app, a web-based QR auction is faster to set up, requires no download, and reaches all guests equally.' },
      { question: 'Should auction bidding QRs be per item or per event?', answer: 'Per item. Each QR pre-selects the lot so guests land directly on the bidding page for the item they are standing in front of.' },
    ]
  ),
  art(
    'qr-code-for-mountain-rescue',
    'QR Codes for Mountain Rescue: Trailhead Safety Briefings and Location Sharing',
    'qr code mountain rescue trail safety',
    'Use QR codes at mountain trailheads for safety briefings, rescue contact sharing, and location reporting.',
    'Business & Regional',
    '5 min read',
    '2027-04-13',
    `
### 1. Trailhead Safety Briefing

A QR at the trailhead links to a trail-specific safety briefing: grade and length, current conditions, gear requirements, and weather forecast source. Pre-hike scanning increases safety awareness.

### 2. Emergency Contact Sharing

A QR near the trail register links to a page that pre-fills an SMS to the mountain rescue team with the hiker's start time and planned route. The hiker sends and someone knows they are out.

### 3. What3Words Location

A QR links to a guide for using What3Words to share a precise location in an emergency call. Three-word location codes dramatically improve rescue response time.

### 4. Offline Page Caching

Signal fails in mountain environments. Prompt hikers at the trailhead to save the safety page: "Tap the share button and save to home screen." Cached pages work without signal mid-route.
    `,
    [
      { question: 'Can a QR at a mountain trailhead save lives?', answer: 'Yes indirectly. Safety briefings, planned route sharing, and location tools all reduce rescue incidents and improve response when needed.' },
      { question: 'What if hikers do not have signal to scan the trailhead QR?', answer: 'Scan and cache at the car park or visitor centre where signal is available. The QR is the prompt; the phone does the rest offline.' },
    ]
  ),
  art(
    'qr-code-for-second-hand-furniture',
    'QR Codes for Second-Hand Furniture: Provenance, Dimensions, and Delivery Booking',
    'qr code second hand furniture antique shop',
    'Use QR codes on furniture items to share dimensions, material details, and collection or delivery options.',
    'Business & Regional',
    '4 min read',
    '2027-04-14',
    `
### 1. Item Details Page

A QR on a furniture tag links to: exact dimensions (H × W × D), material and finish, condition notes, original manufacturer if known, and additional photos from all angles.

### 2. Delivery and Collection Options

A QR links to the delivery quote calculator and collection slot booking. Customers who find a piece they love book transport before leaving the shop, reducing drop-outs.

### 3. Provenance Story

For antique or interesting pieces, a QR links to the provenance story: era, original use, any restoration work. Buyers who know a piece's history attach more value to it.

### 4. Make an Offer

A QR links to a "make an offer" form. Shop owners set a floor price; offers above it trigger a confirmation email. Enables price negotiation without staff mediation for every enquiry.
    `,
    [
      { question: 'Can a second-hand furniture QR help with online listings?', answer: 'Yes. The same content page linked from the QR can be shared on Facebook Marketplace or Gumtree as the listing link.' },
      { question: 'Should the QR tag be reused or recycled when the item sells?', answer: 'Redirect the URL to "this item has sold" on the same day it sells to avoid customer frustration. The physical tag can be reused for a new item.' },
    ]
  ),
  art(
    'qr-code-for-escape-room-booking-confirmations',
    'QR Codes on Escape Room Booking Confirmations: Waiver, Briefing Video, and Arrival Guide',
    'qr code escape room booking confirmation waiver',
    'Send booking confirmation QRs that complete the waiver, prepare teams, and navigate them to the venue.',
    'Business & Regional',
    '4 min read',
    '2027-04-15',
    `
### 1. Online Waiver Completion

A QR in the booking confirmation email links to the liability waiver form. Teams complete it before arriving. No paper at the door; no time lost on arrival processing.

### 2. Briefing Video

A QR links to the venue's pre-game briefing video: game rules, game master interaction, health and safety information, and what to expect. Teams arrive energised and ready.

### 3. Arrival and Parking Guide

A QR in the confirmation links to: venue address with navigation link, nearest car park, public transport options, and photos of the entrance. Reduces late arrivals.

### 4. Team Photo Booking

A QR offers an optional team photo package add-on after the game. Pre-booking creates an upsell opportunity with minimal friction.
    `,
    [
      { question: 'Does a QR waiver have the same legal effect as a paper signature?', answer: 'In most jurisdictions, yes, provided the form meets electronic signature requirements and the record is retained. Confirm with your legal counsel.' },
      { question: 'Should the briefing video QR be the same for all rooms?', answer: 'No. Briefing content may vary by room complexity. Use room-specific QR links so each team receives the correct preparation.' },
    ]
  ),
  art(
    'qr-code-for-sports-officials',
    'QR Codes for Sports Referees and Umpires: Rule Book, Decision Aids, and Incident Reports',
    'qr code sports referee umpire rulebook',
    'Use QR codes on referee lanyards and official materials for instant rule lookups and incident reporting.',
    'Business & Regional',
    '5 min read',
    '2027-04-16',
    `
### 1. Rule Book Quick Reference

A QR on the referee's credential card links to the current season's rule book. Key rule sections are bookmarkable. Officials clarify complex situations instantly rather than guessing.

### 2. Decision Aid Videos

A QR links to a library of decision aid video examples: what constitutes a foul, obstruction interpretation, and VAR/DRS equivalents. Used during training and available for in-game reference.

### 3. Incident Report Submission

After a match, a QR links to the incident report form pre-filled with the match ID. Referees submit reports on their phone in the car park rather than doing paperwork at the office.

### 4. Referee Development Feedback

A QR links to the performance feedback form sent by the assessor who observed the match. The official reviews the assessment and responds digitally. Replaces slow postal feedback.
    `,
    [
      { question: 'Can a referee look up a rule during a game using a QR?', answer: 'Only in break periods. QR rule references are for pre-match preparation and half-time consultation, not mid-play lookups.' },
      { question: 'Should incident report QRs pre-fill match details?', answer: 'Yes. Pre-fill match ID, date, and competition from a schedule system. The referee adds only the incident-specific content.' },
    ]
  ),
  art(
    'qr-code-for-hospice-and-palliative-care',
    'QR Codes in Hospice and Palliative Care: Family Communication, Advance Directives, and Memorial Resources',
    'qr code hospice palliative care family communication',
    'Use QR codes in hospice settings for family updates, advance directive access, and bereavement support.',
    'Business & Regional',
    '5 min read',
    '2027-04-17',
    `
### 1. Family Communication Hub

A QR in family waiting areas links to a private page with: current care plan summary (with patient consent), visiting guidance, parking, and chaplaincy contacts. Reduces repeated calls to the nursing team.

### 2. Advance Directive Access

A QR in the patient's file links to the current advance care plan and DNACPR decision, so any clinician accessing the record can confirm the patient's documented wishes quickly.

### 3. Bereavement Support Resources

A QR on bereavement information leaflets links to local and national support organisations, online support groups, and a guide to what happens after a death. Removes the need for families to search at a distressing time.

### 4. Dignity and Sensitivity

All content behind hospice QR codes must be reviewed for compassion, clarity, and appropriateness. Technical information (visiting hours, parking) is separate from emotional support content. Plain language is essential.
    `,
    [
      { question: 'Should family members access patient care updates via QR without login?', answer: 'No. Any patient-specific care information requires authentication. QR provides convenient access to the login flow, not a bypass.' },
      { question: 'Can a QR code on a memorial card be appropriate?', answer: 'Yes when sensitively designed. A QR on a tribute card linking to a memorial page provides lasting value without overwhelming the card design.' },
    ]
  ),
  art(
    'qr-code-for-digital-menus-accessibility',
    'Making Digital QR Menus Accessible: Screen Readers, Motor Impairments, and Older Adults',
    'qr code digital menu accessibility wcag',
    'Design QR-linked menus that meet WCAG 2.1 AA and are usable by people with disabilities.',
    'Business & Regional',
    '6 min read',
    '2027-04-18',
    `
### 1. WCAG 2.1 AA Requirements

A QR-linked menu is a web page and must comply with WCAG 2.1 AA. Key requirements: sufficient colour contrast (4.5:1), keyboard navigability, screen reader compatibility, and resizable text without horizontal scrolling.

### 2. Screen Reader Compatibility

Use semantic HTML: proper heading hierarchy, labelled form fields, and alt text on dish images. Avoid CSS-only decorations that carry meaning without accessible equivalents.

### 3. Motor Impairment Considerations

Large tap targets (minimum 44 × 44 px), no hover-only interactions, and sticky navigation reduce difficulty for users with limited hand mobility or tremor.

### 4. Older Adults

Offer a plain text version of the menu with larger default font size. Avoid auto-playing media, pop-ups on first load, and excessive animation. A simple, high-contrast design serves all ages.

### 5. Paper Alternative

Provide a printed menu option on request. Accessibility includes patrons who cannot or choose not to use a smartphone. Train staff to offer this without making the patron feel singled out.
    `,
    [
      { question: 'Does a QR menu need to meet WCAG if it is only used in a restaurant?', answer: 'In the UK and EU, digital services must be accessible. For businesses serving the public, WCAG 2.1 AA is the expected standard.' },
      { question: 'What is the most common accessibility failure in QR menus?', answer: 'Insufficient colour contrast and missing alt text on dish images are the most frequently failed criteria in restaurant web menus.' },
    ]
  ),
  art(
    'qr-code-for-swimming-pools',
    'QR Codes at Swimming Pools: Lane Booking, Water Quality, and Safety Notices',
    'qr code swimming pool lane booking water quality',
    'Use QR codes at leisure pools for lane booking, real-time water quality, and lifeguard safety notices.',
    'Business & Regional',
    '4 min read',
    '2027-04-19',
    `
### 1. Lane Booking

A QR at the pool entrance links to the lane booking system. Swimmers reserve a lane and time slot, reducing overcrowding and improving the experience for regular users.

### 2. Water Quality Data

A QR near the pool links to the current water quality report: chlorine level, pH, temperature, and last test time. Transparent data builds member confidence.

### 3. Safety Notices

A QR on the poolside safety board links to the full rules, depth markings guide, and lifeguard signal meaning. Displayed at the entrance and at key poolside positions.

### 4. Swim Lesson Booking

A QR at reception links to the swim lesson programme: available levels, instructor bios, prices, and available slots. Parents book from the poolside without queuing at the office.
    `,
    [
      { question: 'Can a QR at a public pool replace the safety notice board?', answer: 'No. Safety notices must be displayed prominently in print as a legal requirement. QR provides extended detail, not a replacement.' },
      { question: 'Should water quality data be behind a login?', answer: 'No. Pool water quality data is a public health matter and should be freely accessible without registration.' },
    ]
  ),
  art(
    'qr-code-for-insurance-broker',
    'QR Codes for Insurance Brokers: Policy Comparison, Renewal Prompts, and Claims Fast-Track',
    'qr code insurance broker policy comparison renewal',
    'Use QR codes in insurance broker communications for policy comparison, renewal action, and claims initiation.',
    'Business & Regional',
    '5 min read',
    '2027-04-20',
    `
### 1. Policy Comparison Report

A QR on the broker's recommendation letter links to the full comparison report: premium, cover limits, excess, and key exclusions for each quoted policy. Clients review detail at their own pace.

### 2. Renewal Reminder

A QR on the renewal reminder links to the renewal confirmation page with one-click accept, an option to request a requote, and the broker's direct contact for questions.

### 3. Claims Fast-Track

A QR on the policy schedule links to the claims initiation form pre-filled with the policy number and broker contact. First notice of loss submitted in under two minutes.

### 4. Risk Management Guides

A QR on a commercial policy schedule links to the broker's risk management guide for the client's industry: common claims causes, prevention tips, and the broker's risk assessment portal.
    `,
    [
      { question: 'Should policy comparison QRs require login?', answer: 'Yes. Policy details contain personal and financial information. Require authentication before displaying individual quote comparisons.' },
      { question: 'Can a QR on a renewal letter reduce non-renewals?', answer: 'Yes. Reducing friction in the renewal decision—one scan, review, accept—increases renewal rates compared to requiring a phone call or form.' },
    ]
  ),
];
