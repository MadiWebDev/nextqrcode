import type { Article } from '../articles';
import { art } from './helper';

export const batch60: Article[] = [
  art(
    'qr-code-patient-wristband',
    'QR Codes on Patient Wristbands: Improving Safety and Reducing Medication Errors',
    'qr code patient wristband hospital safety',
    'How QR codes on patient wristbands improve medication safety, reduce identification errors, and speed up clinical workflows in hospitals.',
    'Security & Scanning',
    '5 min read',
    '2027-04-11',
    `
### The Patient Identification Problem

Wrong-patient errors — administering medication, blood products, or procedures to the incorrect patient — are among the most serious adverse events in healthcare. The Joint Commission (US) and NHS Patient Safety team cite patient misidentification as a root cause in a significant proportion of serious incidents annually.

QR codes on patient wristbands provide a machine-readable, instant verification mechanism that human visual inspection of printed text cannot match.

### How QR Wristband Systems Work

**Wristband generation:**
When a patient is admitted, the Electronic Patient Record (EPR) generates a wristband. The wristband includes printed information (name, date of birth, NHS/hospital number) and a unique QR code encoding the patient identifier.

**Verification workflow:**
Before administering medication, taking a blood sample, or performing a procedure:

1. Clinician scans the patient's wristband QR with a handheld scanner or smartphone
2. The scanner app queries the EPR for: patient name, DOB, allergies, current medication orders
3. Clinician verbally confirms the displayed details with the patient ("Can you confirm your date of birth?")
4. If everything matches, proceed. If any mismatch — stop and investigate.

**Closed-loop medication administration:**
The scanner also verifies the medication QR: is this the correct drug, correct dose, correct route, and is it prescribed for this patient? This "five rights" verification in a single scan event significantly reduces administration errors.

### Implementation in NHS Settings

**Relevant standards:**
- GS1 UK guidance on healthcare barcoding
- NHS England CNST maternity standards (scan-to-verify wristbands in maternity settings)
- HTM 07-01 (management of medical devices)

**EPR systems supporting QR wristbands:**
- Epic (in use at several NHS Trusts)
- Oracle Cerner (widely deployed in UK)
- System C Medway
- TPP SystmOne (primarily GP, but expanding)

### Special Populations

**Paediatrics:** Children's wristbands require smaller physical dimensions. QR codes on paediatric wristbands must be legible at very small sizes — use maximum error correction (Level H) and the simplest possible data encoding (hospital number only, EPR lookup handles the rest).

**Allergies:**
QR wristband systems can flag allergy alerts on the scanner screen when the patient's wristband is scanned, even if the clinician does not specifically look up the allergy record. This passive alert capability reduces allergy-related adverse events.
    `,
    [
      {
        question: 'Can a patient\'s QR wristband be scanned without their knowledge or consent?',
        answer: 'In clinical care contexts, wristband scanning for identification is part of standard care procedures — patients consent to identification checks when agreeing to treatment. The information accessed via the QR is limited to the care team and protected by NHS data governance frameworks. Non-clinical scanning of patient wristbands outside care contexts is not authorised.',
      },
      {
        question: 'What happens if a patient\'s wristband QR code becomes unreadable (damaged, wet)?',
        answer: 'Wristband replacement protocols require clinical staff to print and apply a new wristband when the existing one is damaged, obscured, or removed. Until replaced, verbal identification using minimum two patient identifiers (name + DOB) with EPR lookup is the required procedure. Degraded wristbands should not be tolerated as adequate identification.',
      },
      {
        question: 'Are QR codes on patient wristbands secure enough to prevent data breaches?',
        answer: 'The QR on a wristband encodes only an identifier (hospital number), not clinical data. The clinical data resides in the secured EPR — accessible only to authorised users with valid credentials. Capturing the QR pattern itself provides the identifier but grants no access to clinical records without EPR authentication.',
      },
    ]
  ),
  art(
    'qr-code-prescription-label',
    'QR Codes on Prescription Labels: Medication Information, Safety, and Patient Access',
    'qr code prescription label medication safety',
    'How QR codes on prescription labels provide patients and pharmacists with detailed medication information, dosing guides, and safety alerts.',
    'Security & Scanning',
    '5 min read',
    '2027-04-12',
    `
### The Information Gap on Prescription Labels

A standard UK prescription label contains: patient name, medication name, dose, frequency, prescriber details, and dispensing date. Space constraints mean detailed patient information leaflets must be provided separately — and are frequently lost or not read.

A QR code on the prescription label provides unlimited space for patient-facing information accessible on demand.

### What QR Prescription Labels Can Link To

**Patient information leaflet (PIL):**
The full manufacturer's PIL for the medication, always the most current version. QR links eliminate the problem of outdated printed PILs accompanying dispensed medication.

**Video explanation:**
A 2-minute explainer video from a pharmacist or the manufacturer explaining what the medication is for, how to take it, common side effects, and what to do if a dose is missed.

**Interaction checker:**
A link to a medication interaction checker pre-populated with the patient's current dispensed medications (if the pharmacy system supports it).

**NHS or manufacturer safety alerts:**
If a safety recall or alert is issued for the medication, the QR destination can be updated to include the alert — dynamic QR codes make this possible without reprinting.

### Implementation Considerations

**Current UK regulatory position:**
The Medicines and Healthcare products Regulatory Agency (MHRA) is reviewing digital labelling requirements. QR codes on prescription labels are permitted as supplementary information but cannot currently replace mandatory printed label content. Monitor MHRA guidance for updates.

**Privacy:**
Prescription label QR codes must not encode personal patient data readable by anyone who scans the label. Encode only a product identifier or a generic URL. Patient-specific data should require authentication (patient NHS login or a PIN) to access.

**Accessibility:**
QR codes benefit patients comfortable with smartphones. Ensure printed PILs remain available for patients who cannot or prefer not to use QR links. Large-print PILs for visually impaired patients should also remain standard.

### Pharmacist Workflow Use

A QR on the dispensing label can also serve the pharmacist:

- Link to the product's full summary of product characteristics (SmPC)
- Link to interaction database entries
- Link to storage requirements and handling notes

This provides the dispensing team with instant reference access during high-volume dispensing periods.
    `,
    [
      {
        question: 'Can patients use a QR code on a prescription label to request a repeat?',
        answer: 'Not via the label QR directly, but a QR on the label could link to the NHS App or pharmacy\'s repeat prescription ordering page, with the medication pre-selected. This is a useful design consideration — a link that says "Scan to request your repeat prescription" on the label simplifies a key patient action. Implement with appropriate authentication so prescriptions are not requested without patient verification.',
      },
      {
        question: 'Do QR codes on prescription labels work for patients with visual impairments?',
        answer: 'Screen reader apps on smartphones can describe QR codes, and the linked digital content can be made accessible (large text, text-to-speech compatible). However, patients with severe visual impairment may not be able to locate or align the QR for scanning. Alternative formats (audio patient information, large-print leaflets) must always remain available alongside QR-linked resources.',
      },
    ]
  ),
  art(
    'qr-code-healthcare-appointment',
    'QR Code Appointment Booking in Healthcare: From GP to Specialist',
    'qr code healthcare appointment booking',
    'How QR codes streamline appointment booking in NHS and private healthcare — reducing phone queues, improving accessibility, and capturing patient preferences.',
    'Business & Regional',
    '5 min read',
    '2027-04-13',
    `
### The Phone Queue Problem in Healthcare

GP surgeries, physiotherapy clinics, and dental practices face the same problem: appointment booking is phone-heavy, peak demand is concentrated in the morning, and staff time is consumed by appointment administration. QR codes that link to online booking reduce phone volume and allow patients to book at any time.

### QR Placement for Appointment Booking

**Surgery waiting room:**
A QR poster: "Book your next appointment online — no hold time." Links to the surgery's online booking portal (NHS App, Systmone patient online, AccuRx).

**After-visit documentation:**
Every discharge letter, referral letter, and follow-up summary includes a QR linking to the relevant booking page. Patients receiving the letter at home can book immediately rather than calling.

**SMS and email reminders:**
Appointment reminders include a QR (as a clickable link in digital format) for easy rescheduling — linked directly to the rescheduling page, not the homepage.

**Pharmacy:**
A QR on the prescription bag linking to the patient's GP surgery's booking page. Patients picking up medication may realise they need a review and can book on the spot.

### NHS Digital Booking Systems

| System | QR/Link Booking | Patient Facing |
|---|---|---|
| NHS App | Yes (Choose and Book) | Yes |
| AccuRx | Patient triage forms via link | Yes |
| SystmOne Online | Yes | Yes |
| EMIS Patient Access | Yes | Yes |
| DrDoctor | Yes | Outpatient specialist |

### Reducing Did-Not-Attends (DNAs)

DNA rates in NHS outpatient settings are 5–12% nationally. QR-linked appointment confirmation with easy rescheduling (2-tap cancel and rebook) reduces DNAs by making cancellation and rebooking frictionless.

The key: the QR in the appointment confirmation links to an easy rescheduling page — not a generic contact form. Every step of friction added to the cancellation process converts a "cancel and rebook" into a "DNA."

### Private Healthcare QR Booking

Private clinics and hospitals use QR codes on:
- Outdoor advertising and posters
- GP referral letters (for self-pay patients)
- Business cards of consultants
- Post-treatment follow-up paperwork

All linking to direct-to-calendar appointment booking, often with automated deposit collection.
    `,
    [
      {
        question: 'Is online booking via QR appropriate for urgent and same-day appointments?',
        answer: 'Same-day urgent appointments typically require clinical triage before booking — not all urgent needs are equivalent. Online QR booking is most appropriate for routine and follow-up appointments. For same-day urgent requests, a QR can link to a triage form (AccuRx or similar) rather than a direct booking page, ensuring clinical review before an appointment slot is allocated.',
      },
      {
        question: 'How do we ensure elderly patients can still book appointments if QR-first?',
        answer: 'Never QR-first, always QR-alongside. Phone booking must remain available. QR booking is an additional channel that reduces pressure on phone lines, benefiting all patients. Elderly patients who prefer phone booking continue to use it. Practices that remove phone booking entirely create access barriers — this is not a QR issue, it is a service design issue.',
      },
      {
        question: 'Can a GP surgery\'s online booking QR handle interpreter and accessibility requests?',
        answer: 'Yes if the booking form includes appropriate fields. Include: preferred language and interpreter required, hearing loop or BSL interpreter, accessible appointment (ground floor, extra time), and any other access needs. Capturing this at booking allows the surgery to prepare appropriately rather than managing access needs at the appointment itself.',
      },
    ]
  ),
  art(
    'qr-code-hospital-wayfinding',
    'QR Code Hospital Wayfinding: Helping Patients Navigate Complex Buildings',
    'qr code hospital wayfinding navigation',
    'Deploy QR codes in hospitals for indoor wayfinding — linking patients to maps, department directories, and step-by-step directions.',
    'Business & Regional',
    '4 min read',
    '2027-04-14',
    `
### The Hospital Navigation Problem

Large hospital sites can cover tens of thousands of square metres across multiple buildings, with departments relocating regularly. Static printed signage goes out of date; digital QR wayfinding updates instantly.

### How QR Hospital Wayfinding Works

QR codes placed at key decision points (entrances, lift lobbies, major corridors) link to a mobile-optimised wayfinding page. The patient enters their destination (department name, ward number, consultant's clinic) and receives step-by-step directions from their current location.

Technologies that power this:

- **Google Maps indoor maps:** Available for large hospitals with floor plan data submitted
- **Pointr, MazeMap, or HereNav:** Specialist indoor navigation platforms
- **Simple static page:** A photographed floor plan with department locations marked — lower tech but immediately useful

### QR Placement Strategy

| Location | QR Content |
|---|---|
| Main entrance | Full hospital map with "Where are you going?" prompt |
| Lift lobbies | Floor-specific department list with directions |
| Long corridors | "You are here" confirmation + remaining route |
| Department waiting areas | Confirmation of arrival + parking validation link |
| Car park entry | Wayfinding to relevant entrance from car park |

### Reducing Missed Appointments

Patients who cannot find their clinic arrive late or give up entirely — contributing to DNA rates. QR wayfinding on appointment letters provides directions from home, from the car park, and from the hospital entrance in one QR.

Structure the linked page as: 1) How to get here by public transport / car; 2) Where to park; 3) Which entrance to use; 4) Directions within the building to your department.

### Accessibility Considerations

QR wayfinding must include accessible route options:

- Lift-only routes for wheelchair users and those who cannot use stairs
- Accessible entrances (automatic doors, step-free)
- Hearing loop locations
- Blue Badge parking spaces

Offer text-size controls on the wayfinding page — hospital visitors frequently include elderly patients who benefit from larger text.
    `,
    [
      {
        question: 'Can QR wayfinding work without the patient having mobile data inside the hospital?',
        answer: 'Many hospitals have poor indoor mobile coverage. To address this: provide a guest WiFi QR code at the entrance that connects patients automatically, ensure the wayfinding page caches after first load (Progressive Web App), and display a simple static floor plan alongside the QR as a non-digital fallback. Never rely solely on mobile data for wayfinding in a building with known coverage issues.',
      },
      {
        question: 'How often does hospital QR wayfinding need updating?',
        answer: 'Department relocations in large hospitals can occur quarterly. Assign a wayfinding content owner responsible for updating the linked pages whenever a department moves. A digital wayfinding system that requires a simple URL redirect update is far easier to maintain than reprinting hundreds of static signs. Set a calendar reminder for quarterly audits of all wayfinding QR destinations.',
      },
    ]
  ),
  art(
    'qr-code-medical-records-access',
    'QR Codes for Patient Medical Records: Secure Access in Emergency and Routine Care',
    'qr code patient medical records access',
    'How QR codes can provide clinicians and patients with secure, rapid access to medical records — in emergencies and routine care settings.',
    'Security & Scanning',
    '5 min read',
    '2027-04-15',
    `
### Why Rapid Medical Record Access Matters

In emergency situations, clinicians need immediate access to: current medications, known allergies, blood type, previous diagnoses, and advance care directives. Without rapid access, treatment decisions are made without this context — increasing adverse event risk.

QR codes linked to secure medical record summaries bridge the gap between the emergency presentation and the available clinical record.

### The MedicAlert and Emergency QR Approach

**MedicAlert-style personal QR:**
A QR worn as a wristband, on a lanyard, or on a medical alert card encodes a URL linking to the patient's emergency medical summary. This summary — maintained by the patient or their GP — includes: critical allergies, medications, conditions, and emergency contacts.

This approach is already implemented by several services:

- NHS Summary Care Record (accessible via NHS App, not yet QR-linked directly for emergency use)
- iMedAlert and similar personal health record services
- Emergency Access QR solutions from Epic and Oracle Cerner in pilot trusts

**What should be in the emergency summary:**
- Full name and date of birth
- NHS number
- Active medications with doses
- Severe allergies (type of reaction noted)
- Chronic conditions
- Blood type (if known)
- Emergency contact name and number
- Advance care directive status

### Security Architecture for Medical QR Records

A QR that links directly to full medical records without authentication is a privacy and security risk. The appropriate architecture:

**Level 1 (emergency):** The QR links to a summary visible to emergency responders without login. Contains: allergies, critical medications, advance directives, and emergency contact only. Does not contain full medical history.

**Level 2 (GP/clinical):** The QR links to an authenticated portal requiring NHS login or clinical credentials. Contains full records.

**Level 3 (patient self-service):** Patient accesses their own full record via NHS App or equivalent, authenticated by the patient's own credentials.

### UK NHS Context

The NHS App provides patient access to GP records, medications, and test results. The NHS is exploring emergency access to Summary Care Records without login for paramedics — the QR mechanism for this is in development. Monitor NHS England digital health publications for current status.
    `,
    [
      {
        question: 'Is it safe to put medical information in a QR code on a person\'s body?',
        answer: 'Best practice is to encode only a reference (URL or identifier) in the QR, not the medical data itself. The QR links to a secure system that holds the data. Encoding medical data directly in the QR pattern means anyone who scans it can read it — including strangers. A URL linking to a properly authenticated access system provides both emergency usability and privacy protection.',
      },
      {
        question: 'Can patients update their own emergency medical QR records?',
        answer: 'In patient-controlled systems (iMedAlert, personal health record apps), yes — the patient updates their own summary. In NHS systems, the GP practice maintains the record. Patient-controlled updates are faster to reflect real-world changes (new allergy discovered, medication changed) but carry the risk of inaccurate patient self-reporting. GP-maintained records are more clinically accurate but may lag real-world changes.',
      },
      {
        question: 'How do we ensure a medical QR code card is noticed and scanned in an emergency?',
        answer: 'Visibility and labelling are critical. The card or wristband should clearly state: "Emergency Medical Information — Scan QR Code." Use a universally recognised medical symbol (red cross or star of life). Brief first responders and emergency contacts about the card\'s existence. A card in a wallet may not be found as quickly as a wristband — consider the patient\'s mobility and likely scenario when choosing the medium.',
      },
    ]
  ),
];
