import type { Article } from '../articles';
import { art } from './helper';

export const batch69: Article[] = [
  art(
    'qr-code-phishing-prevention',
    'QR Code Phishing Prevention: How to Spot Fake QR Codes and Stay Safe',
    'qr code phishing prevention safety',
    'Learn to identify and avoid QR code phishing attacks — quishing techniques, red flags to spot, and safe scanning habits.',
    'Security & Scanning',
    '6 min read',
    '2027-05-26',
    `
### What Is QR Code Phishing (Quishing)?

QR code phishing — known as "quishing" — is a cyberattack where a malicious QR code redirects the scanner to a fake website designed to steal login credentials, payment information, or personal data. The QR replaces the traditional email link in a phishing attack because:

- Email security filters scan URLs in email bodies but may not decode QR images
- Users are conditioned to trust QR codes as benign
- Smartphone users scanning QR codes are often away from corporate security tools

### How Quishing Attacks Work

**Method 1 — Sticker replacement:**
A malicious QR sticker is placed over a legitimate QR code (on a parking meter payment terminal, a restaurant table card, or a public health poster). The user scans what appears to be the genuine code.

**Method 2 — Email attachment:**
A phishing email includes a QR image with the message "Scan to verify your account" or "Scan to complete your delivery." The QR leads to a fake login page.

**Method 3 — Physical mail:**
Fake invoices, bank letters, or HMRC correspondence with a QR linking to a phishing page. Physical mail is trusted by many consumers more than email.

**Method 4 — Social engineering:**
A fake "free WiFi" QR at a café or airport leads to a page requesting personal details before "granting" access.

### Red Flags When Scanning QR Codes

**Before scanning:**
- QR sticker appears applied over a printed element (raised edges, misalignment)
- QR in an unexpected location (on a cash machine, on a car windscreen)
- QR in an unsolicited email or physical letter asking for immediate action

**After scanning (before entering any information):**
- The URL in the browser preview does not match the expected organisation
- The URL uses a non-official domain (.xyz, .info, random characters)
- The page asks for login credentials immediately without explaining why
- The padlock (HTTPS) is absent or shows a certificate warning
- The page is poorly formatted or has spelling errors

### Safe Scanning Habits

1. **Preview the URL before opening.** Most modern smartphone cameras show the destination URL when a QR is detected — read it before tapping "Open."
2. **Verify before entering credentials.** If a scanned QR asks for a password, close the page and navigate to the organisation's site directly via your browser.
3. **Be sceptical of physical QR stickers.** In environments where fraud is a known risk (parking meters, restaurant tables in tourist areas), check for overlay stickers.
4. **Report suspicious QR codes.** In the UK, report to Action Fraud (0300 123 2040) or via actionfraud.police.uk.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'How can I tell if a QR code on a restaurant table has been tampered with?',
        answer:
          "Check that the QR is printed directly on the table card or menu rather than applied as a separate sticker on top. If the QR is a sticker, inspect the edges — a fraudulent overlay typically has slightly raised or misaligned edges compared to the original print. After scanning, verify the URL matches the restaurant's domain before entering any payment or personal information.",
      },
      {
        question: 'Are QR codes in emails from my bank safe to scan?',
        answer:
          'UK banks and financial institutions rarely include QR codes in emails for security-sensitive actions (login, payment authorisation). If you receive an email purportedly from your bank with a QR asking you to verify your account, do not scan it. Contact your bank directly via the number on the back of your card. Legitimate bank processes do not require QR code scanning from unsolicited emails.',
      },
      {
        question: 'What should I do if I scanned a malicious QR code and entered my credentials?',
        answer:
          'Act immediately. Change the password for the compromised account and any accounts using the same password. If financial details were entered, contact your bank immediately to flag potential fraud. Enable two-factor authentication where available. Report the incident to Action Fraud and to the organisation being impersonated so they can warn other customers.',
      },
    ]
  ),
  art(
    'qr-code-fraud-detection',
    'QR Code Fraud Detection: How Businesses Identify and Prevent QR Abuse',
    'qr code fraud detection prevention business',
    'How businesses detect and prevent QR code fraud — counterfeit QR stickers, unauthorised redemptions, and technical detection methods.',
    'Security & Scanning',
    '5 min read',
    '2027-05-27',
    `
### Types of QR Code Fraud Affecting Businesses

**1. Sticker replacement fraud:**
A malicious actor places their QR sticker over your legitimate payment or service QR. Customers scan the fraudster's code instead of yours. The business loses the transaction; the customer's payment goes elsewhere.

**2. Coupon and voucher QR fraud:**
Screenshots of valid QR discount codes or vouchers are shared beyond their intended recipients. One QR coupon is redeemed hundreds of times.

**3. Ticket QR fraud:**
Event ticket QR codes are photographed and shared. Multiple people attempt to use the same QR for entry.

**4. Loyalty stamp fraud:**
Customers share screenshots of unredeemed loyalty QR codes to avoid scanning in-person.

**5. Content injection:**
In sophisticated attacks, a dynamic QR's redirect destination is compromised, pointing customers to malicious content rather than the intended destination.

### Detection Methods

**Tamper-evident QR stickers:**
Labels that show evidence of removal (leave behind residue, void pattern, or permanent colour change when peeled). Used on parking meter payment QR panels, ATM screens, and high-risk surfaces.

**Single-use QR validation:**
QR codes for tickets, coupons, and vouchers are validated server-side and marked as used after one scan. Any subsequent scan of the same code triggers a fraud alert.

**Geolocation verification:**
The scan is validated against the expected geographical location. A parking meter QR scanned from a different city is flagged.

**Time-windowed QR:**
QR codes valid only for a specific time window (rotating codes, event-day-only tickets). Screenshots taken before the valid window are useless.

**Rate limiting:**
More than X scans per hour from the same IP address or the same QR code triggers a fraud investigation alert.

### Operational Fraud Prevention

Train staff to:
- Inspect QR code surfaces regularly for overlay stickers
- Report any QR code that appears to have been tampered with
- Never allow customers to screenshot a QR and use it later for in-person redemption without real-time validation
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'How often should businesses physically inspect QR codes for sticker fraud?',
        answer:
          'For high-risk locations (payment QR codes at point of sale, outdoor displays), daily inspection at opening is best practice. Assign one staff member responsible for the QR audit. For medium-risk locations (menu QR codes, loyalty QR at counter), weekly inspection is sufficient. After any report of a suspicious scan or failed payment, inspect immediately.',
      },
      {
        question: 'Can tamper-evident QR labels be applied to existing signage?',
        answer:
          'Yes. Tamper-evident QR label stock is available from specialist label suppliers — it is the same QR code but printed on a substrate that visually indicates removal attempts. For existing signage, replace the current QR sticker with a tamper-evident version as a retrofit security upgrade. The QR code itself (and its destination) does not need to change.',
      },
      {
        question: 'Is QR coupon fraud a significant enough problem to require technical controls?',
        answer:
          'For businesses running high-value promotions (10%+ discount, free product), yes. A viral coupon QR screenshot can result in thousands of unintended redemptions in hours. Implement single-use QR with server-side validation for any coupon with material financial value. For low-value generic promotions (5% off), the control overhead may exceed the fraud cost — assess the risk proportionately.',
      },
    ]
  ),
  art(
    'qr-code-secure-qr-design',
    'Secure QR Code Design: Building Trust and Safety Into Every Code You Create',
    'secure qr code design best practices',
    'Design QR codes with security built in — HTTPS destinations, domain transparency, single-use validation, and user trust signals.',
    'Security & Scanning',
    '5 min read',
    '2027-05-28',
    `
### Security Starts at Design

A QR code that routes users to an insecure destination, an unverifiable URL, or a page that could be impersonated is a security risk regardless of your intentions. Secure QR design integrates trust and safety at the point of creation.

### Principle 1: Always Use HTTPS

Every QR code destination must be HTTPS. An HTTP destination:

- Transmits data in clear text (interceptable on public networks)
- Shows a "Not secure" warning in most browsers
- Signals to users that the page may not be trustworthy
- Violates the baseline expectations of any modern web user

Obtain an SSL certificate for your domain. Free options via Let's Encrypt are available for any domain. There is no legitimate reason to use HTTP for any user-facing QR destination in the current environment.

### Principle 2: Use Recognisable, Owned Domains

The URL a user sees when they preview a QR scan should immediately tell them where they are going. Compare:

- \`menu.yourbrand.com\` — owned, recognisable, trustworthy
- \`qr-8xkz29.dynamicqr-service.io\` — unfamiliar, raises suspicion

Use your own domain for QR redirect URLs wherever possible. If using a third-party QR service with their domain, verify the service's reputation and ensure users will recognise or can verify the domain.

### Principle 3: Validate Destinations Before Printing

Before printing any QR code at scale:

1. Scan the QR and verify the URL preview matches the expected destination
2. Visit the URL and verify the page loads correctly with HTTPS
3. Test on multiple devices (iOS and Android)
4. Verify the destination page has the correct branding and content

Catching a wrong destination before printing 10,000 labels is trivially easy. After printing, it is expensive and embarrassing.

### Principle 4: Single-Use Validation for High-Value QRs

Tickets, coupons, access passes, and one-time-use codes should be validated server-side and invalidated after first use. This prevents:

- Screenshot sharing
- Duplicate redemption
- Screenshot interception (scan-in-transit attacks)

### Principle 5: Display URL Transparency

For any QR displayed publicly, include the destination URL as text alongside the QR. This enables users to:

- Verify the domain before scanning
- Type the URL if they prefer not to scan
- Identify tampering (if the scanned URL does not match the printed URL)

URL transparency is a simple, zero-cost trust signal that significantly reduces the risk of users being deceived by tampered QR codes.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [templates](/templates) collection offers ready-made layouts for common QR use cases.
- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
`,
    [
      {
        question: 'Should businesses use URL shorteners for QR codes given the security concerns?',
        answer:
          'Custom-domain shorteners (go.yourbrand.com) are fine — the domain is recognisable and trustworthy. Generic shorteners (bit.ly, tinyurl.com) obscure the destination domain and make it harder for users to verify where they are going before entering information. For security-sensitive QR codes (payment, login, data collection), use your own domain rather than a generic shortener.',
      },
      {
        question: 'Can QR codes be signed cryptographically to prevent tampering?',
        answer:
          'Yes. The destination URL in a QR can include a digital signature (HMAC or public-key signature) that the destination server verifies before serving content. If the URL has been tampered with (e.g., the destination modified in a sticker overlay), the signature fails and the server denies the request. This is used in high-security contexts (pharmaceutical, luxury goods authentication) where QR tampering is a known attack vector.',
      },
      {
        question: 'How can I tell whether a QR code is safe to scan?',
        answer:
          'Preview the destination before opening it, confirm the domain matches the expected business, and avoid codes that ask for passwords or payment details on an unfamiliar page. When in doubt, type the address yourself instead of scanning.',
      },
    ]
  ),
  art(
    'qr-code-quishing-attack-guide',
    'Quishing Attacks Explained: How QR Code Phishing Works and How to Defend Against It',
    'quishing attack qr code phishing explained',
    'A technical guide to quishing attacks — how cybercriminals use QR codes to bypass email security, and defence strategies for organisations.',
    'Security & Scanning',
    '5 min read',
    '2027-05-29',
    `
### The Security Gap That Quishing Exploits

Email security gateways (Microsoft Defender for Office 365, Proofpoint, Mimecast) are highly effective at detecting malicious URLs in email bodies. Threat intelligence feeds, URL sandboxing, and real-time scanning catch the vast majority of phishing links.

But these tools typically do not extract and analyse URLs embedded within QR code images. A phishing URL embedded in a QR code image in an email body often passes straight through email security filters undetected.

This is the core technical gap that quishing exploits.

### Anatomy of a Quishing Email

A typical quishing email follows this pattern:

1. **Impersonated sender:** Appears to come from Microsoft, HMRC, PayPal, a bank, or HR/IT department
2. **Urgent pretext:** "Your account will be suspended," "Action required — verify your details," "Your package is on hold"
3. **QR image:** Embedded as an image or PDF attachment containing a QR code
4. **Instruction:** "Scan this code with your phone to complete the verification"
5. **Destination:** A cloned login page for the impersonated organisation

The victim scans on their personal phone — outside the corporate network, without corporate endpoint protection — and enters their credentials.

### Defence Strategies for Organisations

**Technical controls:**
- Deploy email security tools with QR image decoding capability (Microsoft Defender for Office 365 now includes this; check your vendor's roadmap)
- Block QR codes in PDF attachments from external senders where not expected
- Implement conditional access policies requiring MFA for all logins regardless of how credentials were captured

**User awareness training:**
- Include quishing scenarios in phishing simulation programmes (KnowBe4, Proofpoint Security Awareness, Mimecast Awareness Training all offer QR phishing simulations)
- Train employees: legitimate internal QR communications are rare; any QR code asking for credentials is a red flag
- Establish a clear reporting mechanism for suspicious QR codes received by email

**Process controls:**
- Establish a policy: IT and HR will never request credential verification via QR code in email
- Document all legitimate internal QR code use cases — anything outside this set is suspicious

### Individual Defence

- Never enter credentials on a page reached via a QR code in an unexpected email
- Verify the destination URL before the page loads (use a QR scanner app that shows the URL preview before opening)
- Report any suspicious QR email to your IT security team and/or Action Fraud
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'How do I check if a QR code in an email is safe before scanning?',
        answer:
          'Forward the email to your desktop and use a QR decoder tool (or Google Lens on desktop) to extract the URL without scanning with your phone. Check the URL: does it use a recognised domain? Is it HTTPS? Does it match what the email claims? If anything looks suspicious, report the email without scanning. Never scan a QR from an unexpected email on a mobile device connected to corporate resources.',
      },
      {
        question: 'Are QR codes in legitimate business emails ever safe?',
        answer:
          'Yes — many legitimate businesses use QR codes in emails for non-credential purposes: newsletter archive links, event ticketing, location maps, and product information. The risk is QR codes that request authentication or payment. Apply extra scrutiny to any QR in an email that asks you to log in, verify your identity, or make a payment. Verify the sender domain and destination URL carefully before proceeding.',
      },
      {
        question: 'What technical tools detect QR codes in email attachments?',
        answer:
          'Microsoft Defender for Office 365 Safe Links (Plan 2) can decode QR codes in email images and PDF attachments as of 2024. Proofpoint and Mimecast have added QR image scanning to their threat detection pipelines. Check with your email security vendor for current capability. If your current tool does not scan QR images, raise it as a gap with your security team or consider supplementing with a specialist email security layer.',
      },
    ]
  ),
  art(
    'qr-code-tamper-proof-labels',
    'Tamper-Proof QR Code Labels: Protecting Products and Payments from Fraud',
    'qr code tamper proof labels anti-fraud',
    'Use tamper-evident and cryptographically secured QR labels to protect payment QR codes, luxury products, and high-value assets from fraud.',
    'Security & Scanning',
    '5 min read',
    '2027-05-30',
    `
### Why Tamper-Proof QR Labels Matter

A standard printed QR code can be photographed, reprinted, and stuck over any other surface. This physical vulnerability is exploited in payment fraud (sticker over a café QR), product counterfeiting (fake QR on replica goods), and warranty fraud (moved QR from genuine to counterfeit product).

Tamper-proof QR labels address this at the physical layer.

### Types of Tamper-Evident Label Technology

**VOID pattern labels:**
When the label is removed, it leaves a "VOID" pattern on the surface below and on the adhesive side of the label. Anyone who peels the label to read the adhesive side (or notices the VOID on the surface) knows the original seal has been broken.

**Destructible vinyl labels:**
Ultra-thin vinyl that tears into fragments when removal is attempted. Cannot be removed in one piece and reapplied. Effective for surface-mount seals.

**Honeycomb pattern adhesive:**
The adhesive leaves a distinctive hexagonal residue on the surface if the label is removed. The original label cannot be cleanly repositioned — visual evidence of removal is permanent.

**Security hologram overprint:**
A holographic overprint on the QR label that is difficult to replicate at scale. Used for anti-counterfeiting on pharmaceutical and luxury goods packaging.

### Cryptographic QR Authentication

Physical tamper evidence is effective but can be countered by printing identical tamper-evident labels. Cryptographic QR authentication adds a layer that cannot be replicated:

**NTAG424 (NFC-based, but similar principle for QR):**
Each QR/NFC tag generates a unique cryptographic signature on every scan. The signature is verified server-side. An identical-looking counterfeit cannot generate the correct signature sequence.

**Signed URL approach for QR:**
The QR encodes a URL containing a time-stamped, product-unique HMAC signature. The server verifies the signature on each scan. A counterfeit QR that does not carry a valid signature for that product fails validation.

### Applications for Tamper-Proof QR Labels

| Application | Technology | Risk Addressed |
|---|---|---|
| Café payment QR | VOID labels on signage | Sticker replacement fraud |
| Luxury product authentication | Hologram + signed URL | Counterfeiting |
| Pharmaceutical packaging | Serialised GS1 QR | Medication fraud |
| Warranty seal | Destructible vinyl | Warranty transfer fraud |
| Event access | Server-side single-use | Ticket duplication |

### Sourcing Tamper-Evident QR Label Materials

UK label suppliers offering tamper-evident stock:

- CCL Label (UK)
- Holoscribe (holograms and security labels)
- Brady Corporation (industrial security labels)
- Avery (consumer and commercial tamper-evident products)

Specify your security requirements clearly: surface type, exposure conditions, required tamper evidence method, and whether cryptographic authentication is required.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- Check print proofs with the [printed QR tester](/printed-qr-tester) so problems show up before a full run.
`,
    [
      {
        question: 'How much more expensive are tamper-evident QR labels than standard labels?',
        answer:
          'Tamper-evident vinyl labels cost 2–5× more than standard labels per unit. For a high-value use case (pharmaceutical unit pack, luxury product, payment terminal), this cost is trivial compared to the fraud or liability risk. For low-value or low-risk applications, standard labels with periodic visual inspection may be a more proportionate response.',
      },
      {
        question:
          'Can a tamper-evident QR label prevent a fraudster from printing an exact replica?',
        answer:
          'Physical tamper evidence alone does not prevent a well-resourced counterfeiter from printing a replica that looks identical. For high-value anti-counterfeiting, combine tamper-evident labels with cryptographic authentication (signed URLs or serialised tokens). The combination of physical evidence (obvious to any inspector) and digital authentication (verifiable by any phone) provides strong deterrence.',
      },
      {
        question:
          'Are there regulatory requirements for tamper-evident labels on specific products?',
        answer:
          'Yes for several categories in the UK. Pharmaceutical packaging is subject to FMD (Falsified Medicines Directive) serialisation requirements, which include a tamper-evident seal and a unique QR/Data Matrix code per pack. Food packaging has seal requirements for some categories. Medical devices have specific labelling requirements. Check applicable regulations for your product category with your regulatory affairs team.',
      },
    ]
  ),
];
