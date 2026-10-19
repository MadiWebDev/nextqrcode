import type { Article } from '../articles';
import { art } from './helper';

export const batch4: Article[] = [
  art(
    'qr-code-parking-payment-scams',
    'QR Code Parking Scams: How They Work and How to Avoid Them',
    'qr code parking scam',
    'Learn how fraudsters overlay fake QR stickers on parking meters and how drivers and operators can respond.',
    'Security & Scanning',
    '5 min read',
    '2026-08-14',
    `
### 1. The Scam

Attackers stick a counterfeit QR code over the legitimate one on a meter or sign. Drivers who scan are sent to a look-alike payment page that captures card details. Use our [QR safety checker](/qr-safety-checker) guidance to identify suspicious codes.

### 2. Driver Protections

* Check for sticker edges or a raised code—scan with a [QR scanner](/qr-scanner) app that previews URLs.
* Prefer the operator's official app, downloaded from the app store, or the meter's card reader.
* Verify the domain shown before entering payment information.
* Check that the URL matches the legitimate service provider.

### 3. Operator Protections

* Print codes on tamper-evident labels or engrave them into the meter.
* Inspect sites regularly and record how each code should look—use our [printed QR tester](/printed-qr-tester) methodology.
* Publish the official payment domain on signage and your website.
* Provide a fast channel for reporting fake codes.
* Generate secure payment codes with our [URL QR code generator](/url-qr-code-generator) and track usage with our [UTM builder](/utm-builder).

Use proper sizing with our [QR size calculator](/qr-size-calculator) and follow our [QR placement guide](/qr-placement-guide) for tamper-resistant positioning.
    `,
    [
      {
        question: 'Is it safe to pay by QR at a parking meter?',
        answer:
          'It can be if you verify the code is not a sticker and the domain matches the operator. Using the official app is safer.',
      },
      {
        question: 'How can operators stop sticker overlays?',
        answer: 'Use tamper-evident or engraved codes and inspect them on a schedule.',
      },
      {
        question: 'What should I do if I paid through a fake parking QR?',
        answer:
          'Contact your bank immediately to cancel the card, report the scam to the parking operator and local authorities, and monitor your account for fraud.',
      },
    ]
  ),
  art(
    'quishing-defense-for-it-teams',
    'Quishing Defense for IT Teams: Detecting QR Phishing in Email and Documents',
    'quishing protection enterprise',
    'Controls that detect QR phishing, from gateway image analysis to mobile policies and user training.',
    'Security & Scanning',
    '7 min read',
    '2026-08-15',
    `
### 1. Why It Slips Through

Text-based URL scanners may not inspect pixels. A QR code inside an image or PDF can hide the link, and the victim opens it on a personal phone outside corporate controls. Our [QR safety checker](/qr-safety-checker) guidance helps identify these threats.

### 2. Technical Controls

* Use email security that decodes QR codes in images and attachments and evaluates the target URL.
* Enforce phishing-resistant multi-factor authentication such as passkeys or hardware keys, so stolen passwords alone are not enough.
* Apply conditional access that checks device compliance for sign-ins.
* Provide managed mobile browsers or DNS protection on corporate devices.
* Train staff to use proper [QR scanner](/qr-scanner) apps that preview URLs before opening.

### 3. Process Controls

Require out-of-band verification for any QR request involving credentials or payments, and publish a simple reporting path. Legitimate business codes should be generated using trusted tools like our [URL QR code generator](/url-qr-code-generator) with proper tracking via our [UTM builder](/utm-builder).

### 4. Training

Run simulations that include QR lures and teach staff to read the destination domain before opening it. Use our [QR placement guide](/qr-placement-guide) principles to help staff recognize legitimate vs suspicious placements. Educate on using our [printed QR tester](/printed-qr-tester) methodology for verifying organizational codes.
    `,
    [
      {
        question: 'Why is quishing hard to filter?',
        answer:
          'The malicious URL is inside an image, so basic text link scanning does not see it.',
      },
      {
        question: 'What is the strongest single control?',
        answer:
          'Phishing-resistant MFA, because it limits the damage when a user lands on a fake login page.',
      },
      {
        question: 'Can AI detect malicious QR codes in email?',
        answer:
          'Advanced email security solutions can decode QR images and analyze destination URLs, but effectiveness varies. Layer with user training and MFA.',
      },
    ]
  ),
  art(
    'url-shorteners-and-qr-code-risks',
    'URL Shorteners in QR Codes: Hidden Destinations, Expiry, and Abuse',
    'url shortener qr code risk',
    'The trade-offs of putting shortened links in QR codes, and safer alternatives.',
    'Security & Scanning',
    '5 min read',
    '2026-08-16',
    `
### 1. The Risks

* **Opacity:** The camera shows only the short domain, so users cannot judge the real destination when scanning with a [QR scanner](/qr-scanner).
* **Dependency:** If the shortener changes policy or shuts down, printed codes break.
* **Abuse:** Shortened links are favored by phishers, so some filters and users distrust them.

### 2. Safer Alternatives

Use a short path on a domain you own (example.com/menu) created with our [UTM builder](/utm-builder). It is readable, brandable, and under your control. Generate codes with our [URL QR code generator](/url-qr-code-generator). If you use a shortener, pick a reputable one and a custom branded domain. Size codes appropriately with our [QR size calculator](/qr-size-calculator) and follow our [QR placement guide](/qr-placement-guide). Test with our [printed QR tester](/printed-qr-tester) before deployment.

### 3. Verify Expansion

Before printing, check where the link actually lands, including any redirect chain, and confirm it uses HTTPS. Use our [QR safety checker](/qr-safety-checker) verification process.
    `,
    [
      {
        question: 'Are shortened links always unsafe?',
        answer:
          'No, but they hide the destination and add a dependency. A branded domain you control is better.',
      },
      {
        question: 'How do I check a short link?',
        answer: 'Use a link expander or open it in a safe environment and read the final address.',
      },
      {
        question: 'Do URL shorteners track users?',
        answer:
          'Most shorteners log clicks, IP addresses, and referrer data. Own-domain redirects give you control over what is tracked.',
      },
    ]
  ),
  art(
    'safe-qr-scanning-habits-for-employees',
    'Safe QR Scanning Habits for Employees: A One-Page Policy',
    'safe qr code scanning tips',
    'A short checklist employees can follow to scan QR codes safely at work and in public.',
    'Security & Scanning',
    '5 min read',
    '2026-08-17',
    `
### 1. The Rules

1. Read the URL preview in your [QR scanner](/qr-scanner) before opening.
2. Do not sign in from a page reached by an unsolicited QR code.
3. Do not install apps from outside the official store.
4. Treat QR codes on stickers, flyers, and emails with the same suspicion as unknown links.
5. Report suspicious codes to IT or facilities.

### 2. For Printed Materials Your Company Distributes

Use branded domains, tamper-evident labels, and consistent design so staff know what is genuine. Generate official codes with our [URL QR code generator](/url-qr-code-generator) and track them with our [UTM builder](/utm-builder). Follow our [QR placement guide](/qr-placement-guide) for tamper-evident positioning. Verify quality with our [printed QR tester](/printed-qr-tester). Apply our [QR safety checker](/qr-safety-checker) guidelines.

### 3. Make Reporting Easy

Offer a single email alias or form. Quick reports let you remove fake stickers before they harm others. Size codes appropriately with our [QR size calculator](/qr-size-calculator) to ensure legitimate codes are easily recognizable.
    `,
    [
      {
        question: 'Should employees scan any QR code on the office wall?',
        answer: 'Only if it is part of known signage. Unfamiliar stickers should be reported.',
      },
      {
        question: 'Does scanning alone infect a phone?',
        answer: 'No. Harm usually comes from opening a link and acting on it.',
      },
      {
        question: 'How can employees distinguish legitimate company QR codes from fake ones?',
        answer:
          'Look for consistent branding, professional print quality, integration with signage (not added stickers), and URLs matching company domains.',
      },
    ]
  ),
  art(
    'qr-codes-and-android-apk-sideloading',
    'QR Codes That Push App Installs: Android Sideloading Risks Explained',
    'qr code malware android apk',
    'Why a QR code cannot silently install malware, and which prompts should make you stop.',
    'Security & Scanning',
    '5 min read',
    '2026-08-18',
    `
### 1. What Actually Happens

A QR code scanned with a [QR scanner](/qr-scanner) holds text. Scanning produces a link. Installing an app from a non-store source requires you to download an APK and allow installs from that source, which Android asks you to enable per app.

### 2. Warning Prompts

* A page urging you to "update" an app by downloading a file.
* A prompt to enable installs from unknown sources for your browser.
* A request for accessibility service access or device administrator rights.

### 3. Safe Practice

Install apps only from the official store, keep Play Protect enabled, and deny permissions that do not match the app's purpose. For legitimate apps, use official links generated with our [URL QR code generator](/url-qr-code-generator). Verify app download codes using our [QR safety checker](/qr-safety-checker) guidelines.

### 4. For Developers

Publish your app through official stores and link to the store listing in QR campaigns using our [UTM builder](/utm-builder) for tracking—to avoid training users to sideload. Size codes with our [QR size calculator](/qr-size-calculator), follow our [QR placement guide](/qr-placement-guide), and test with our [printed QR tester](/printed-qr-tester).
    `,
    [
      {
        question: 'Can a QR code install malware by itself?',
        answer:
          'No. The user must follow the link, download a file, and grant installation permission.',
      },
      {
        question: 'What should I do if I installed a suspicious app?',
        answer:
          'Uninstall it, run a security scan, change important passwords, and review accounts.',
      },
      {
        question: 'Are all APK files dangerous?',
        answer:
          'No, but APKs from unknown sources bypass store security checks. Only install from trusted official stores or verified developers.',
      },
    ]
  ),
  art(
    'wifi-qr-code-security-risks',
    'WiFi QR Code Security: Password Exposure, Evil Twins, and Guest Networks',
    'wifi qr code security',
    'Reduce risk when sharing network credentials through QR codes in homes, shops, and offices.',
    'Security & Scanning',
    '6 min read',
    '2026-08-19',
    `
### 1. Password Is in Plain Text

The payload holds the SSID and key as readable text. Anyone who scans can view it and can also photograph the code. Generate WiFi codes securely with our [WiFi QR code generator](/wifi-qr-code-generator) and verify with a [QR scanner](/qr-scanner).

### 2. Reduce Exposure

* Use a separate guest network isolated from internal devices and cash registers.
* Rotate the key periodically and reprint using our [printed QR tester](/printed-qr-tester) verification.
* Use client isolation so guests cannot see each other.
* Do not use the same key for staff networks.

### 3. Evil Twin Risk

An attacker can broadcast a network with the same name. Using WPA2 or WPA3 with a strong key and checking the network list helps, though a QR alone does not prove authenticity. Follow our [QR safety checker](/qr-safety-checker) guidelines for positioning codes to prevent tampering.

### 4. Public Venues

Place the code where staff can see it so overlays are noticed. Use our [QR placement guide](/qr-placement-guide) for tamper-evident positioning, size appropriately with our [QR size calculator](/qr-size-calculator), and generate trackable variants with our [UTM builder](/utm-builder) if linking to a landing page instead of direct WiFi credentials.
    `,
    [
      {
        question: 'Is it safe to put my WiFi QR on a table?',
        answer: 'Yes for a properly isolated guest network. Do not use your main network password.',
      },
      {
        question: 'How often should I change the key?',
        answer:
          'Whenever staff change or if you suspect misuse, and at a regular interval such as quarterly.',
      },
      {
        question: 'Can I password-protect the QR code itself?',
        answer:
          'No, QR codes are static data. Protect the network with a strong WPA3 password and proper guest network isolation.',
      },
    ]
  ),
  art(
    'merchant-qr-payment-fraud-prevention',
    'Merchant QR Payment Fraud: Protecting Counter Codes from Replacement',
    'qr code payment fraud prevention',
    'Practical steps for shops and stalls to prevent attackers from swapping their payment QR code.',
    'Security & Scanning',
    '6 min read',
    '2026-08-20',
    `
### 1. The Attack

A criminal places their own payment code over the shop's, so payments flow to their account. Customers and owners may not notice until money is missing. Use our [QR safety checker](/qr-safety-checker) defenses to prevent this.

### 2. Merchant Controls

* Mount the code in a fixed holder or behind clear acrylic with the shop name.
* Check it every opening and closing.
* Enable payment notifications and reconcile them with sales.
* Use a code displaying your business name—generate with our [UPI QR code generator](/upi-qr-code-generator) or relevant payment generator.

### 3. Customer Habit

Customers should confirm the payee name shown in their banking app matches the shop before approving. Test your code with a [QR scanner](/qr-scanner) regularly.

### 4. Staff Training

Teach staff how the genuine code looks and to report any change immediately. Use our [printed QR tester](/printed-qr-tester) methodology for verification. Position codes following our [QR placement guide](/qr-placement-guide) principles. Size appropriately with our [QR size calculator](/qr-size-calculator). Track multiple locations with our [UTM builder](/utm-builder) if using URL-based payment pages.
    `,
    [
      {
        question: 'How do I know a payment arrived at my shop?',
        answer: 'Use transaction alerts from your bank or wallet and compare them to sales.',
      },
      {
        question: 'Should customers verify the payee name?',
        answer: 'Yes. Most payment apps show the merchant name before confirmation.',
      },
      {
        question: 'What material prevents QR code replacement?',
        answer:
          'Tamper-evident labels, codes behind sealed acrylic, or engraved/etched codes on permanent signage work best.',
      },
    ]
  ),
  art(
    'what-scanning-a-qr-code-reveals-privacy',
    'What Does Scanning a QR Code Reveal? A Privacy Explainer',
    'qr code privacy tracking',
    'What data a destination server receives when a person scans a QR code, and what stays on the phone.',
    'Security & Scanning',
    '5 min read',
    '2026-08-21',
    `
### 1. On the Phone

Decoding happens locally in the camera or [QR scanner](/qr-scanner) app. The symbol itself does not report anything to a server.

### 2. When the Link Opens

Opening a URL lets the destination server see standard request data: IP address, browser and device type, time, language settings, and the page requested. Analytics scripts and cookies can add more. Track responsibly with our [UTM builder](/utm-builder) conventions.

### 3. Static vs Dynamic

A static code generated with our [URL QR code generator](/url-qr-code-generator) sends nothing before the visit. A dynamic code first contacts a redirect service that may log scan details.

### 4. Reducing Exposure

* Preview the URL and decline if unsure.
* Use browser privacy settings and tracker blocking.
* Site owners should disclose analytics and honor privacy law.

Generate privacy-respecting codes with our tools. Size with our [QR size calculator](/qr-size-calculator), place following our [QR placement guide](/qr-placement-guide), and verify with our [printed QR tester](/printed-qr-tester). Apply our [QR safety checker](/qr-safety-checker) principles for user-facing codes.
    `,
    [
      {
        question: 'Does the QR code know who scanned it?',
        answer:
          'No. Only the destination or redirect server sees visit data after the link is opened.',
      },
      {
        question: 'Do static QR codes track users?',
        answer: 'The code itself does not. Whatever website it points to can still collect data.',
      },
      {
        question: 'Can scanning a QR code track my location?',
        answer:
          'The destination server sees your IP address, which provides approximate location. Precise GPS location requires you to grant permission to the website.',
      },
    ]
  ),
  art(
    'qr-codes-for-hotels-and-guest-services',
    'QR Codes for Hotels: Room Service, WiFi, Check-In, and Local Guides',
    'qr codes for hotels',
    'Where QR codes add value in hotels, and how to design them for guests who are tired, traveling, and on roaming data.',
    'Business & Regional',
    '6 min read',
    '2026-08-22',
    `
### 1. High-Value Placements

* **Room card:** WiFi QR generated with our [WiFi QR generator](/wifi-qr-code-generator) plus link to the digital directory.
* **Bedside:** Room service or housekeeping request page created with our [URL QR code generator](/url-qr-code-generator).
* **Lobby:** Check-in forms and local attraction guides.
* **Elevator and corridor signs:** Event schedules.

### 2. Guest-Friendly Design

Guests may be on roaming data, so keep pages light. Offer multiple languages, large tap targets, and no forced app installs or sign-ups. Test with a [QR scanner](/qr-scanner) on multiple devices.

### 3. Operational Tips

Use a branded domain, put the code on durable material, and print the short URL beside it. Replace damaged cards between stays, and keep tamper-evident sleeves on shared surfaces. Size codes with our [QR size calculator](/qr-size-calculator), follow our [QR placement guide](/qr-placement-guide), verify quality with our [printed QR tester](/printed-qr-tester), and track engagement with our [UTM builder](/utm-builder).
    `,
    [
      {
        question: 'Should hotel QR pages require an app?',
        answer: 'No. Mobile web pages are faster and avoid roaming data and install friction.',
      },
      {
        question: 'How do I support international guests?',
        answer:
          'Offer language selection on the landing page rather than encoding different codes.',
      },
      {
        question: 'What QR code size works on a hotel key card?',
        answer:
          "Approximately 2-2.5cm for codes scanned at arm's length. Test on actual card stock before mass printing.",
      },
    ]
  ),
  art(
    'qr-codes-for-real-estate-listings',
    'QR Codes for Real Estate: Signs, Flyers, and Virtual Tours',
    'qr codes real estate signs',
    'Use QR codes on for-sale signs and brochures to deliver listing details, tours, and agent contact.',
    'Business & Regional',
    '6 min read',
    '2026-08-23',
    `
### 1. Sign Placement

Drivers cannot safely scan from a moving car, so signs should serve pedestrians and people parked or walking by. Place the code at hand height on the rider or in a flyer box. Size with our [QR size calculator](/qr-size-calculator) for viewing distance.

### 2. What to Link

* A mobile listing page with photos, price, and floor plan created with our [URL QR code generator](/url-qr-code-generator).
* A virtual tour.
* A contact form or vCard for the agent using our [vCard QR generator](/vcard-qr-code-generator).

### 3. Weather Durability

Use UV-stable print on rigid coroplast or aluminum, matte finish, and level Q for outdoor wear. Test with a [QR scanner](/qr-scanner) and verify with our [printed QR tester](/printed-qr-tester).

### 4. Tracking

Use a different short path per property created with our [UTM builder](/utm-builder) so you know which signs generate visits, and update the target page when a property sells. Follow our [QR placement guide](/qr-placement-guide) for sign positioning and apply our [QR safety checker](/qr-safety-checker) principles to prevent tampering.
    `,
    [
      {
        question: 'What size QR for a for-sale sign?',
        answer: 'About 8 to 15 cm for pedestrians at 1 to 1.5 meters.',
      },
      {
        question: 'Should the link change after the sale?',
        answer:
          'Yes. Point it to a sold notice or your agent page. A redirect you control makes that easy.',
      },
      {
        question: 'How long do outdoor real estate sign QR codes last?',
        answer:
          'With UV-stable materials and proper error correction, 6-12 months minimum. Inspect monthly and replace when fading affects scannability.',
      },
    ]
  ),
];
