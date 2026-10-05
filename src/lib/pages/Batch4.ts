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

Attackers stick a counterfeit QR code over the legitimate one on a meter or sign. Drivers who scan are sent to a look-alike payment page that captures card details.

### 2. Driver Protections

* Check for sticker edges or a raised code.
* Prefer the operator's official app, downloaded from the app store, or the meter's card reader.
* Verify the domain shown before entering payment information.

### 3. Operator Protections

* Print codes on tamper-evident labels or engrave them into the meter.
* Inspect sites regularly and record how each code should look.
* Publish the official payment domain on signage and your website.
* Provide a fast channel for reporting fake codes.
    `,
    [
      { question: 'Is it safe to pay by QR at a parking meter?', answer: 'It can be if you verify the code is not a sticker and the domain matches the operator. Using the official app is safer.' },
      { question: 'How can operators stop sticker overlays?', answer: 'Use tamper-evident or engraved codes and inspect them on a schedule.' },
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

Text-based URL scanners may not inspect pixels. A QR code inside an image or PDF can hide the link, and the victim opens it on a personal phone outside corporate controls.

### 2. Technical Controls

* Use email security that decodes QR codes in images and attachments and evaluates the target URL.
* Enforce phishing-resistant multi-factor authentication such as passkeys or hardware keys, so stolen passwords alone are not enough.
* Apply conditional access that checks device compliance for sign-ins.
* Provide managed mobile browsers or DNS protection on corporate devices.

### 3. Process Controls

Require out-of-band verification for any QR request involving credentials or payments, and publish a simple reporting path.

### 4. Training

Run simulations that include QR lures and teach staff to read the destination domain before opening it.
    `,
    [
      { question: 'Why is quishing hard to filter?', answer: 'The malicious URL is inside an image, so basic text link scanning does not see it.' },
      { question: 'What is the strongest single control?', answer: 'Phishing-resistant MFA, because it limits the damage when a user lands on a fake login page.' },
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

* **Opacity:** The camera shows only the short domain, so users cannot judge the real destination.
* **Dependency:** If the shortener changes policy or shuts down, printed codes break.
* **Abuse:** Shortened links are favored by phishers, so some filters and users distrust them.

### 2. Safer Alternatives

Use a short path on a domain you own (example.com/menu). It is readable, brandable, and under your control. If you use a shortener, pick a reputable one and a custom branded domain.

### 3. Verify Expansion

Before printing, check where the link actually lands, including any redirect chain, and confirm it uses HTTPS.
    `,
    [
      { question: 'Are shortened links always unsafe?', answer: 'No, but they hide the destination and add a dependency. A branded domain you control is better.' },
      { question: 'How do I check a short link?', answer: 'Use a link expander or open it in a safe environment and read the final address.' },
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

1. Read the URL preview before opening.
2. Do not sign in from a page reached by an unsolicited QR code.
3. Do not install apps from outside the official store.
4. Treat QR codes on stickers, flyers, and emails with the same suspicion as unknown links.
5. Report suspicious codes to IT or facilities.

### 2. For Printed Materials Your Company Distributes

Use branded domains, tamper-evident labels, and consistent design so staff know what is genuine.

### 3. Make Reporting Easy

Offer a single email alias or form. Quick reports let you remove fake stickers before they harm others.
    `,
    [
      { question: 'Should employees scan any QR code on the office wall?', answer: 'Only if it is part of known signage. Unfamiliar stickers should be reported.' },
      { question: 'Does scanning alone infect a phone?', answer: 'No. Harm usually comes from opening a link and acting on it.' },
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

A QR code holds text. Scanning produces a link. Installing an app from a non-store source requires you to download an APK and allow installs from that source, which Android asks you to enable per app.

### 2. Warning Prompts

* A page urging you to "update" an app by downloading a file.
* A prompt to enable installs from unknown sources for your browser.
* A request for accessibility service access or device administrator rights.

### 3. Safe Practice

Install apps only from the official store, keep Play Protect enabled, and deny permissions that do not match the app's purpose.

### 4. For Developers

Publish your app through official stores and link to the store listing in QR campaigns to avoid training users to sideload.
    `,
    [
      { question: 'Can a QR code install malware by itself?', answer: 'No. The user must follow the link, download a file, and grant installation permission.' },
      { question: 'What should I do if I installed a suspicious app?', answer: 'Uninstall it, run a security scan, change important passwords, and review accounts.' },
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

The payload holds the SSID and key as readable text. Anyone who scans can view it and can also photograph the code.

### 2. Reduce Exposure

* Use a separate guest network isolated from internal devices and cash registers.
* Rotate the key periodically and reprint.
* Use client isolation so guests cannot see each other.
* Do not use the same key for staff networks.

### 3. Evil Twin Risk

An attacker can broadcast a network with the same name. Using WPA2 or WPA3 with a strong key and checking the network list helps, though a QR alone does not prove authenticity.

### 4. Public Venues

Place the code where staff can see it so overlays are noticed.
    `,
    [
      { question: 'Is it safe to put my WiFi QR on a table?', answer: 'Yes for a properly isolated guest network. Do not use your main network password.' },
      { question: 'How often should I change the key?', answer: 'Whenever staff change or if you suspect misuse, and at a regular interval such as quarterly.' },
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

A criminal places their own payment code over the shop's, so payments flow to their account. Customers and owners may not notice until money is missing.

### 2. Merchant Controls

* Mount the code in a fixed holder or behind clear acrylic with the shop name.
* Check it every opening and closing.
* Enable payment notifications and reconcile them with sales.
* Use a code displaying your business name.

### 3. Customer Habit

Customers should confirm the payee name shown in their banking app matches the shop before approving.

### 4. Staff Training

Teach staff how the genuine code looks and to report any change immediately.
    `,
    [
      { question: 'How do I know a payment arrived at my shop?', answer: 'Use transaction alerts from your bank or wallet and compare them to sales.' },
      { question: 'Should customers verify the payee name?', answer: 'Yes. Most payment apps show the merchant name before confirmation.' },
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

Decoding happens locally in the camera or scanner app. The symbol itself does not report anything to a server.

### 2. When the Link Opens

Opening a URL lets the destination server see standard request data: IP address, browser and device type, time, language settings, and the page requested. Analytics scripts and cookies can add more.

### 3. Static vs Dynamic

A static code sends nothing before the visit. A dynamic code first contacts a redirect service that may log scan details.

### 4. Reducing Exposure

* Preview the URL and decline if unsure.
* Use browser privacy settings and tracker blocking.
* Site owners should disclose analytics and honor privacy law.
    `,
    [
      { question: 'Does the QR code know who scanned it?', answer: 'No. Only the destination or redirect server sees visit data after the link is opened.' },
      { question: 'Do static QR codes track users?', answer: 'The code itself does not. Whatever website it points to can still collect data.' },
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

* **Room card:** WiFi QR plus link to the digital directory.
* **Bedside:** Room service or housekeeping request page.
* **Lobby:** Check-in forms and local attraction guides.
* **Elevator and corridor signs:** Event schedules.

### 2. Guest-Friendly Design

Guests may be on roaming data, so keep pages light. Offer multiple languages, large tap targets, and no forced app installs or sign-ups.

### 3. Operational Tips

Use a branded domain, put the code on durable material, and print the short URL beside it. Replace damaged cards between stays, and keep tamper-evident sleeves on shared surfaces.
    `,
    [
      { question: 'Should hotel QR pages require an app?', answer: 'No. Mobile web pages are faster and avoid roaming data and install friction.' },
      { question: 'How do I support international guests?', answer: 'Offer language selection on the landing page rather than encoding different codes.' },
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

Drivers cannot safely scan from a moving car, so signs should serve pedestrians and people parked or walking by. Place the code at hand height on the rider or in a flyer box.

### 2. What to Link

* A mobile listing page with photos, price, and floor plan.
* A virtual tour.
* A contact form or vCard for the agent.

### 3. Weather Durability

Use UV-stable print on rigid coroplast or aluminum, matte finish, and level Q for outdoor wear.

### 4. Tracking

Use a different short path per property so you know which signs generate visits, and update the target page when a property sells.
    `,
    [
      { question: 'What size QR for a for-sale sign?', answer: 'About 8 to 15 cm for pedestrians at 1 to 1.5 meters.' },
      { question: 'Should the link change after the sale?', answer: 'Yes. Point it to a sold notice or your agent page. A redirect you control makes that easy.' },
    ]
  ),
];