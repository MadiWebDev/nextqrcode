import type { Article } from '../articles';
import { art } from './helper';

export const batch41: Article[] = [
  art(
    'qr-code-for-mental-health-resources',
    'QR Codes for Mental Health Awareness Campaigns: Reducing Stigma and Connecting to Support',
    'qr code mental health awareness campaign support',
    'Deploy QR codes in mental health awareness campaigns to connect people with crisis support, self-help tools, and community resources.',
    'Business & Regional',
    '5 min read',
    '2026-11-21',
    `
### 1. Crisis Line QR

A QR on posters in high-risk locations (GP surgeries, university campuses, public toilets, train stations) links to crisis support resources: Samaritans (116 123), Crisis Text Line, and local mental health crisis team contact. The QR should be large, clearly signed ("Struggling? Scan here"), and placed at eye level.

### 2. Self-Assessment QR

A QR on workplace and community wellness materials links to a validated self-assessment tool (PHQ-9 for depression, GAD-7 for anxiety). Anonymous completion with immediate signposting to appropriate support based on score. No login required — lower barrier than a healthcare portal.

### 3. Stigma Reduction Campaign QR

A QR on campaign posters links to personal stories, myth-busting content, and "it's OK to talk" resources. Normalising help-seeking through authentic stories is the primary lever for stigma reduction. Video content performs best for this application.

### 4. Community Support Group Finder QR

A QR links to a local support group directory: peer support groups, drop-in services, talking therapies waitlist registration. Filtered by postcode. Reduces the gap between awareness of need and first contact with support.

### 5. Manager and Peer Support QR

A QR in workplace wellness contexts links to the mental health first aider directory and manager conversation guides. For many people, the first disclosure of mental health difficulty is to a manager or peer, not a clinician — equipping non-clinical first contacts is critical.
    `,
    [
      { question: 'Should mental health QR codes require creating an account?', answer: 'No. The first touch with a mental health resource must be completely frictionless. Account creation is appropriate for personalised tracking tools at a later stage — not for initial crisis or awareness contact.' },
      { question: 'How do you measure the impact of mental health QR campaigns?', answer: 'Track QR scan rate, landing page engagement (time on page, resource clicks), and if possible, self-assessment completion rates. Partner with service providers to correlate campaign periods with referral or service access volume. Note: direct attribution is intentionally limited to preserve anonymity.' },
    ]
  ),
  art(
    'qr-code-for-wine-and-spirits',
    'QR Codes on Wine and Spirits Labels: Tasting Notes, Origin Stories, and Regulatory Compliance',
    'qr code wine spirits label tasting notes origin',
    'Use QR codes on wine and spirits labels for tasting notes, producer stories, ingredient declaration, and regulatory compliance.',
    'Business & Regional',
    '5 min read',
    '2026-11-22',
    `
### 1. EU Wine Label QR Regulation (EU 2021/2117)

EU Regulation 2021/2117 requires wine sold in the EU to provide an ingredients list and nutrition information. The regulation allows this information to be provided via a QR code on the label rather than printed in full, provided the QR links to a page containing only the required regulatory information — no marketing content on the same destination.

This is the most significant mandatory QR code regulation for the food and beverage sector in recent years.

### 2. Tasting Notes and Food Pairing QR

A QR on the bottle links to the winery's tasting notes: primary aromas, palate structure, finish, and food pairing suggestions. Video content from the winemaker explaining the vintage and their production philosophy dramatically increases consumer engagement and brand loyalty.

### 3. Origin and Terroir Story QR

A QR links to the estate or region story: geography, viticulture philosophy, harvest date, and a map of the vineyard parcels used for this wine. Provenance storytelling is the primary value driver in premium wine — the QR is the most practical delivery mechanism for this content on the bottle.

### 4. Responsible Drinking QR

UK Alcohol Labelling regulations and responsible drinking commitments require signposting to drinkaware.co.uk and unit information. A QR on the label linking to the unit calculator and responsible drinking guidance demonstrates compliance and consumer care.

### 5. Age Verification Gateway

Where required (duty-free, online, certain events), a QR-linked landing page for premium spirits content should include an age gate. Keep age gates simple (birth year entry) and store confirmation in a session cookie — do not ask for age on every page load.
    `,
    [
      { question: 'Does the EU wine label QR requirement apply to wines exported to the EU from outside the EU?', answer: 'Yes. EU Regulation 2021/2117 applies to wines placed on the EU market regardless of origin. Non-EU producers selling to the EU must comply for EU-destined shipments.' },
      { question: 'Can the same QR on a wine label serve both the regulatory compliance information and the marketing content?', answer: 'Under EU 2021/2117, the QR destination page for nutrition and ingredients must contain only that regulatory information. Maintain a separate marketing QR if you want to direct consumers to tasting notes and producer stories.' },
    ]
  ),
  art(
    'qr-code-for-airports-and-travel-hubs',
    'QR Codes at Airports and Travel Hubs: Boarding Passes, Wayfinding, and Duty Free',
    'qr code airport boarding pass wayfinding duty free',
    'Use QR codes at airports and transport hubs for mobile boarding passes, interactive wayfinding, lounge access, and duty-free offers.',
    'Business & Regional',
    '5 min read',
    '2026-11-23',
    `
### 1. Mobile Boarding Pass QR

The mobile boarding pass is one of the highest-volume QR applications globally. The IATA standard (BCBP — Bar Coded Boarding Pass) defines the data structure encoded in the QR:

- Passenger name.
- Origin, destination, airline, flight number.
- Date, seat, class.
- Sequential ticket number.
- Check-in sequence number (boarding order).

The QR must display in high-brightness mode on phone screens to scan reliably in variable airport lighting.

### 2. Airport Wayfinding QR

A QR at each gate, terminal entrance, and transport interchange links to the interactive airport map pre-centred on the current location. Real-time flight information, departure board, and shop/restaurant finder in the same page. Particularly valuable in large airports for first-time visitors.

### 3. Lounge Access QR

Priority lounge access QRs are scanned at the lounge entrance to verify eligibility (credit card benefit, airline status, day pass purchase). The QR is issued per-entry by the credit card app or airline portal, time-limited to the current day and flight.

### 4. Duty-Free Personalisation QR

A QR at the duty-free entrance linked to the passenger's booking reference (scanned from the boarding pass) personalises the shopping experience: your duty-free allowance, recommended products based on destination country's allowances, and pre-order for collection at arrival.

### 5. Fast-Track Security QR

A QR in the booking confirmation or airline app links to the fast-track security slot booking for the departure time. Pre-booked fast-track QRs are scanned at the security lane entrance, ensuring orderly access without physical queue management.
    `,
    [
      { question: 'What happens if my mobile boarding pass QR will not scan at the gate?', answer: 'Modern gate scanners read IATA BCBP QR codes in all orientations. Failures are typically caused by low screen brightness, screen protector glare, or a damaged/corrupt QR image. Always ensure maximum screen brightness and have a backup screenshot. The airline can always print a boarding pass at a desk.' },
      { question: 'Do airport wayfinding QR codes work in terminal buildings with poor signal?', answer: 'Airports are investing heavily in indoor WiFi for operational reasons. For passenger-facing wayfinding, airports increasingly provide free WiFi specifically so digital services work throughout terminals. The QR should link to a CDN-hosted lightweight page that loads quickly on airport WiFi.' },
    ]
  ),
  art(
    'qr-code-accessibility-best-practices',
    'Accessible QR Codes: WCAG Compliance, Screen Readers, and Inclusive Design',
    'qr code accessibility wcag screen reader inclusive',
    'Make QR codes accessible for disabled users with WCAG-compliant design, screen reader support, and inclusive alternative access methods.',
    'Fundamentals',
    '6 min read',
    '2026-11-24',
    `
### 1. The Accessibility Challenge of QR Codes

QR codes are inherently visual. Users who are blind, have low vision, or have significant motor impairments face barriers to QR scanning. Accessible QR deployment requires both the QR design and the surrounding context to be inclusive.

### 2. Alt Text for Digital QR Codes

Every QR code image in digital contexts (web pages, emails, PDFs, apps) must have descriptive alt text. The alt text should describe what the QR does, not just "QR code":

\`\`\`html
<img src="qr-contact.png" 
     alt="QR code: scan to save Alex Rahman's contact details (vCard)" />
\`\`\`

For screen reader users, the alt text description should be accompanied by the underlying URL or action as a visible or accessible text link alongside the QR.

### 3. Adjacent Text Link

Every QR code should have a visible text link or URL displayed alongside it. This serves:
- Screen reader users who cannot scan.
- Users with motor impairments who cannot hold a phone steady to scan.
- Users in environments where scanning is impractical.
- Users who want to verify the destination before scanning.

### 4. Contrast and Size for Low Vision Users

For users with low vision who use smartphone camera magnification to scan QRs:
- Minimum 7:1 contrast ratio (vs the 4:1 standard requirement).
- Minimum 3 cm × 3 cm print size in contexts where low-vision users are likely.
- Avoid complex backgrounds or gradients behind the QR.

### 5. Physical QR Accessibility

For physical QR codes in public spaces (signage, menus, heritage sites):
- Place at a consistent height (between 80–120 cm from the ground for wheelchair users and standing users both).
- Ensure the physical substrate is stable (mounted, not flapping in the wind or loose on a table).
- Consider tactile signage alongside QR for venue wayfinding.
    `,
    [
      { question: 'Is a QR code on a website covered by WCAG accessibility requirements?', answer: 'Yes. The QR image requires appropriate alt text (WCAG 1.1.1), the surrounding context must be understandable without the QR, and an alternative access method (text link or URL) must be provided. Full WCAG 2.2 compliance requires manual testing with assistive technologies.' },
      { question: 'Can a visually impaired person scan a QR code using assistive technology?', answer: 'Yes. iOS VoiceOver with the camera can identify and scan QR codes in some configurations. Android TalkBack with Google Lens has QR detection capability. However, these require specific setup and are not universally reliable — always provide a text alternative.' },
    ]
  ),
  art(
    'qr-code-for-childcare-and-nurseries',
    'QR Codes for Childcare and Nurseries: Daily Reports, Parent Communication, and Safety',
    'qr code childcare nursery daily report parent communication',
    'Use QR codes in nurseries and childcare settings for daily activity reports, parent communication, safeguarding, and staff check-in.',
    'Business & Regional',
    '4 min read',
    '2026-11-25',
    `
### 1. Daily Activity Report QR

A QR in the nursery parent app or daily handover bag links to the child's daily report: meals eaten, naps, activities, mood, and a photo (with media consent). Parents access the day's report without a phone call to the nursery.

### 2. Parent Check-In and Collection QR

A QR at the nursery entrance for parents to check in on arrival. The system records time of arrival and links to the child's registration. For collection, the system verifies the collecting adult is on the authorised collection list — a critical safeguarding check.

### 3. Allergy and Medical Alert QR

A QR on the child's named peg or drawer links to their allergy and medical alert profile: allergens, emergency medication, dosage, and emergency contact. Staff can scan during any meal or activity to verify current information.

### 4. Parent Communication QR

A QR on the nursery newsletter or notice board links to the digital parent communication hub: upcoming events, policy updates, consent forms for trips, and developmental milestone trackers. Reduces paper and ensures all parents receive the same information simultaneously.

### 5. Ofsted and Inspection Readiness QR

A QR in the manager's office links to the inspection readiness checklist and live document library: current policies, staff qualifications, risk assessments, and safeguarding training records. Instant access to compliance documentation during an Ofsted visit.
    `,
    [
      { question: 'Do nursery QR systems for child data comply with GDPR?', answer: 'Yes if the platform is compliant. Child data is particularly sensitive under GDPR. Choose platforms that process data within the UK/EEA, have a DPA (Data Processing Agreement), and allow parents to access and delete their child\'s data on request.' },
      { question: 'Can a QR collection verification system prevent unauthorised collection?', answer: 'A QR system can verify that the presenting adult is on the authorised collection list. It cannot physically prevent an unauthorised person from attempting collection. Always combine digital verification with staff recognition and challenge procedures.' },
    ]
  ),
  art(
    'qr-code-for-funerals-and-memorials',
    'QR Codes for Funerals and Memorial Services: Tribute Pages, Donations, and Life Stories',
    'qr code funeral memorial tribute page donation',
    'Use QR codes at funerals and memorial services for digital tribute pages, charitable donations in memory, and life story archives.',
    'Business & Regional',
    '4 min read',
    '2026-11-26',
    `
### 1. Digital Tribute Page QR

A QR on the order of service links to the digital tribute page for the deceased: biography, photographs, video memories, and a guest book where mourners leave messages. The family receives a permanent digital memorial that outlasts the physical service materials.

### 2. Donation in Memory QR

A QR on the order of service and funeral notice links to the chosen charity's donation page in memory of the deceased. Digital donation in lieu of flowers is now the preferred option for many families. The QR removes the friction of finding and navigating to the charity website.

### 3. Life Story Archive QR

A QR links to a life story archive: interviews with family members, historical photographs, news clippings, military records, and career achievements. For those who lived through significant historical periods, a life story archive QR turns a memorial service into a historical document.

### 4. Eulogy and Service Recording QR

A QR distributed after the service links to the recording of the service and eulogies. Family members who could not attend due to distance or health can view the service. The recording is preserved for future generations.

### 5. Cemetery and Memorial QR Plaque

A QR plaque on a headstone or memorial wall links to the tribute page. Permanent outdoor QR plaques must be manufactured in weather-resistant materials (stainless steel etching, porcelain tile printing) with a short, memorable URL as a backup. Hosting must be committed to a very long time horizon — link permanence is critical for memorial applications.
    `,
    [
      { question: 'How long should a digital tribute page QR remain active?', answer: 'Indefinitely is the standard expectation for memorial applications. Choose a platform specifically designed for memorial hosting — generic website builders and QR redirect services may not provide the longevity guarantee appropriate for this context.' },
      { question: 'Are QR codes appropriate in the context of a funeral?', answer: 'Yes, when introduced sensitively. The QR is placed on printed materials the family chooses, not displayed conspicuously. Families who use memorial QR services consistently report high satisfaction — the digital element extends the reach of the tribute beyond those physically present.' },
    ]
  ),
  art(
    'qr-code-for-vr-ar-experiences',
    'QR Codes as Gateways to AR and VR: Marker-Based AR, WebXR, and Immersive Campaigns',
    'qr code ar vr augmented reality webxr marker',
    'Use QR codes as launch points for augmented reality experiences, WebXR applications, and marker-based AR campaigns.',
    'Fundamentals',
    '6 min read',
    '2026-11-27',
    `
### 1. QR as an AR Launch Trigger

The most practical consumer AR deployment uses a QR code as the entry point. The user scans the QR, which opens a mobile web page or app that activates the camera and overlays digital content on the real world. This removes the "which app do I download?" barrier entirely when using WebXR.

### 2. WebXR and Web-Based AR

WebXR Device API (supported in Chrome for Android, with partial iOS support via Safari or dedicated WebXR app) enables AR experiences that run entirely in the mobile browser:

\`\`\`javascript
navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['hit-test', 'dom-overlay'],
  optionalFeatures: ['light-estimation']
})
\`\`\`

The QR encodes the WebXR experience URL. No app install. The experience opens immediately in the browser camera view.

### 3. Marker-Based AR

In marker-based AR, the QR code itself is the marker — the camera detects the QR pattern and anchors 3D content on top of it in the camera view. Libraries like AR.js and 8th Wall support QR marker detection:
- The QR scanned by the native camera opens the web AR experience.
- The web AR experience re-reads the QR pattern in the camera stream and anchors the 3D model.
- The QR simultaneously conveys the payload (URL) and serves as the physical anchor.

### 4. Marketing and Retail AR Applications

- **Product visualisation:** A QR on packaging launches an AR view of the assembled product, product in the user's room, or product in use.
- **Try-before-you-buy:** Beauty brands use AR via QR for virtual make-up try-on.
- **Print media activation:** Magazine ads with QR launch 3D product demos in AR.
- **Outdoor advertising activation:** Billboard QRs launch AR experiences in the viewer's phone camera.

### 5. Platform Considerations

WebXR AR remains inconsistent across iOS and Android. Test on target devices before launch. 8th Wall (Niantic Lightship) provides a polished cross-platform web AR SDK at a cost. For consumer campaigns with broad reach, budget for cross-platform testing and graceful fallback to a standard video for unsupported devices.
    `,
    [
      { question: 'Does WebXR AR work on an iPhone?', answer: 'iOS Safari has partial WebXR support as of iOS 17. Full immersive-ar sessions are not yet supported natively in Safari. 8th Wall and similar platforms work around this with their own camera access layer. Test on your target iOS version before committing to a WebXR approach on iPhone.' },
      { question: 'Can a QR code and an AR marker be the same image?', answer: 'Yes. In marker-based AR systems like AR.js, a QR code can function as both the information payload (decoded by the native camera) and the visual marker (detected by the AR engine in the camera stream). The two reads are sequential: native camera QR decode first, then AR engine marker detect.' },
    ]
  ),
  art(
    'qr-code-for-corporate-training',
    'QR Codes for Corporate Training: Microlearning, Compliance, and Skills Verification',
    'qr code corporate training microlearning compliance',
    'Use QR codes to deliver microlearning modules, compliance briefings, and skills verification in corporate training programmes.',
    'Business & Regional',
    '5 min read',
    '2026-11-28',
    `
### 1. Microlearning QR

A QR on a poster, workstation card, or physical training prop links to a 3–5 minute microlearning module: a short video, interactive scenario, or quick quiz. Microlearning via QR works because it meets employees in context — a QR on a piece of equipment links to the tutorial for that specific equipment, exactly when they need it.

### 2. Mandatory Compliance Training QR

A QR on compliance reminder posters (fire safety, GDPR, manual handling, food hygiene) links to the annual compliance training module with embedded completion tracking. Scan → complete → record: the LMS logs completion against the employee's record without manual administration.

### 3. Safety Briefing QR

A QR on a new project briefing pack or induction folder links to a 10-minute safety briefing video specific to the work environment. The employee watches on their phone, signs digitally, and the record is submitted to the project safety file. No group classroom required.

### 4. Skills Verification QR

A QR on a completed training certificate links to the live skills register: the certificate holder's name, qualification, issuing body, date earned, and expiry. Employers, clients, and site managers scan to verify credentials without calling the training provider.

### 5. Conference and Workshop QR

A QR displayed at the end of a training session links to the course evaluation form and CPD logging page. Post-session QR evaluations achieve significantly higher response rates than emailed forms — the engagement window is the immediate post-session moment.
    `,
    [
      { question: 'Can QR-based microlearning replace formal classroom training?', answer: 'For refresher training, compliance updates, and equipment-specific guidance, QR microlearning is highly effective. It does not replace structured skill development programmes requiring practice, coaching, and assessment — it complements them.' },
      { question: 'How do I ensure employees actually scan training QRs rather than ignoring them?', answer: 'Integrate QR completion into workflow requirements (cannot proceed without completing the safety QR briefing) or incentivise completion (visible team completion scoreboards). Passive posters without a workflow consequence have low completion rates.' },
    ]
  ),
  art(
    'qr-code-for-architecture-and-property-development',
    'QR Codes for Architecture and Property Development: Planning Applications, Show Homes, and Site Progress',
    'qr code architecture property development planning show home',
    'Use QR codes on architecture hoardings, planning notices, and show home brochures for development information, virtual tours, and buyer registration.',
    'Business & Regional',
    '5 min read',
    '2026-11-29',
    `
### 1. Planning Notice QR

A QR on a statutory planning notice links to the full planning application on the local authority portal: site plans, design and access statement, environmental assessment, and the public comment submission form. Public access to planning information via QR increases legitimate engagement and reduces the "I didn't know about it" objection.

### 2. Development Hoarding QR

A QR on the development site hoarding links to the developer's project page: CGI visualisations, show home opening dates, available unit types, and buyer registration. Converts passive passerby interest (high intent, since they are physically at the site) into registered leads.

### 3. Show Home Interactive Tour

A QR on the show home specification sheet links to the interactive 3D virtual tour of the show home. Buyers who have visited can re-explore remotely. Buyers who cannot visit (non-local investors, international buyers) can explore the product digitally.

### 4. Site Progress Updates QR

A QR on the hoarding links to a monthly site progress update: construction photographs, revised completion dates, and milestones reached. Buyers who have exchanged contracts are anxious about build progress — proactive communication via QR-linked updates reduces buyer anxiety and pre-completion enquiry volume.

### 5. Warranty and Handover QR

At legal completion, the buyer's welcome pack contains a QR linking to the handover information portal: appliance manuals, warranty documents, utility connections, emergency contacts, and the 2-year builder's warranty reporting portal. Digital handover packs have higher completion and retention rates than physical binders.
    `,
    [
      { question: 'Should a development site QR on outdoor hoarding be weather-resistant?', answer: 'Yes. Hoardings are exposed to sun, rain, and UV. Use UV-stabilised vinyl prints with a gloss UV overlaminate, or direct-UV print on aluminium composite panels. Plan for replacement every 12 months on exposed sites.' },
      { question: 'Can a QR on a planning notice increase the number of public consultation responses?', answer: 'Yes significantly. Removing the step of navigating to the local authority planning portal (which many residents do not know how to find) dramatically increases the proportion of interested parties who actually submit a response.' },
    ]
  ),
  art(
    'qr-code-scan-rate-benchmarks',
    'QR Code Scan Rate Benchmarks: Industry Averages, Top Performers, and What Drives Results',
    'qr code scan rate benchmarks industry average',
    'Understand real-world QR code scan rate benchmarks across industries, what top performers achieve, and which variables drive scan rates.',
    'Business & Regional',
    '5 min read',
    '2026-11-30',
    `
### 1. What Scan Rate Means

Scan rate = (scans ÷ estimated impressions) × 100. The challenge is measuring impressions for physical QR codes. Proxies: footfall data, print run volume, page views for digital QR. Treat benchmarks as directional, not absolute.

### 2. Industry Scan Rate Benchmarks

Based on aggregated data from major QR campaign platforms and published case studies:

| Context | Typical Scan Rate | Top Performer Range |
|---|---|---|
| Restaurant table QR | 25–40% | 50–65% |
| Product packaging | 1.5–4% | 8–15% |
| Retail in-store poster | 0.5–2% | 4–8% |
| Direct mail | 2–5% | 8–12% |
| Event signage | 5–15% | 20–35% |
| Business card | 8–20% | 30–45% |
| Outdoor billboard | 0.1–0.5% | 1–2% |

### 3. Factors That Drive Above-Average Scan Rates

1. **Specific value proposition in CTA** — "Scan for today's specials" > "Scan here".
2. **Eye-level placement** — 80–150 cm from floor.
3. **Uncluttered surroundings** — QR placed with 5 cm clear space on all sides.
4. **Fast loading destination** — < 2 seconds on 4G.
5. **Mobile-first landing page** — Not a desktop page pinch-zoomed.
6. **Relevance to immediate context** — QR beside a product about that product, not a generic homepage.

### 4. Benchmarks by QR Type

- **Static QR (URL only):** No measurable scan analytics without a redirect layer.
- **Dynamic QR:** Full scan analytics including device type, OS, location, and time-of-day.
- **Wallet pass QR:** Not applicable — interaction is measured by wallet save and presentation events.

### 5. The Vanity Metric Trap

High scan rate with no conversion is not success. A restaurant QR with 40% scan rate but only 5% of scanners actually ordering is a landing page problem, not a scan rate problem. Always track through to the business outcome, not just the scan count.
    `,
    [
      { question: 'Is a 1% scan rate on a product package good or bad?', answer: '1–2% on product packaging is within normal range for passively placed codes. 8%+ requires an active, compelling CTA and a genuinely valuable content offer. Evaluate against the cost of production (near zero for a QR on existing packaging) — even 1% at scale can be significant volume.' },
      { question: 'How do I measure scan rate for a physical QR code?', answer: 'Use a redirect URL that logs each scan request. The redirect service gives you raw scan counts. Divide by estimated impressions (footfall, print run, distribution count) to approximate scan rate. Visitor survey data can supplement impression estimates.' },
    ]
  ),
];
