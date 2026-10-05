import type { Article } from '../articles';
import { art } from './helper';

export const batch2: Article[] = [
  art(
    'utm-parameters-in-qr-codes',
    'UTM Parameters in QR Codes: Track Campaigns Without Bloating the Symbol',
    'utm qr code tracking',
    'Add campaign attribution to printed QR codes while keeping the symbol small and scannable.',
    'Business & Regional',
    '6 min read',
    '2026-07-25',
    `
### 1. The Density Problem

A full UTM string such as utm_source, utm_medium, and utm_campaign can add 60 or more characters. That increases the QR version and shrinks modules.

### 2. A Cleaner Pattern

1. Give each placement a short path on your own site, e.g. example.com/m1 for the lobby poster.
2. Have your web server redirect that path to the long UTM URL.
3. Analytics then attributes the visit correctly while the printed code stays small.

### 3. Naming Conventions

Use utm_medium=qr consistently, lowercase values, and one utm_campaign per print run. Use a different path per location so you can compare placements.

### 4. Trade-off

A redirect you control is still a redirect: if you lose the domain or break the path, printed codes fail. Keep the mapping documented.
    `,
    [
      { question: 'Do I need a dynamic QR service for UTM tracking?', answer: 'No. A short path on your own domain that redirects to the UTM URL gives the same attribution without a third party.' },
      { question: 'What should utm_medium be for QR codes?', answer: 'Use a consistent value such as qr so reports group all QR traffic.' },
    ]
  ),
  art(
    'sms-qr-code-format',
    'SMS QR Codes: SMSTO and sms: URI Formats That Actually Work',
    'sms qr code format',
    'Generate QR codes that open a pre-filled text message and handle platform differences.',
    'Fundamentals',
    '4 min read',
    '2026-07-26',
    `
### 1. Common Formats

* \`SMSTO:+15551234567:Hello there\`
* \`sms:+15551234567?body=Hello%20there\`

The first is the older scanner convention and the second follows URI style. Behavior differs between phones and apps, so test both on iOS and Android.

### 2. Encoding Tips

* Use international E.164 numbers with a leading plus sign.
* URL-encode spaces and special characters in the sms: form.
* Keep the message short, since long bodies enlarge the code.

### 3. Use Cases

Opt-in keywords ("text JOIN to 12345"), quick feedback lines, and appointment confirmations. Check local regulations on marketing messages before launching a campaign.
    `,
    [
      { question: 'Will the message send automatically?', answer: 'No. The phone opens the messaging app with a draft; the user must tap send.' },
      { question: 'Which format should I choose?', answer: 'Test both. If you target a single platform, use whichever opens correctly on your test devices.' },
    ]
  ),
  art(
    'mailto-qr-code-format',
    'Email QR Codes: Building Reliable mailto Links with Subject and Body',
    'email qr code mailto',
    'Create QR codes that open a pre-addressed email with subject and body fields.',
    'Fundamentals',
    '4 min read',
    '2026-07-27',
    `
### 1. The mailto URI

\`mailto:hello@example.com?subject=Quote%20request&body=Hi%2C%20I%20would%20like%20a%20quote.\`

Spaces become %20, commas %2C, and line breaks %0A. Multiple parameters are joined with an ampersand.

### 2. Alternative Format

Some older scanners use the MATMSG format (MATMSG:TO:...;SUB:...;BODY:...;;). Phone cameras handle mailto reliably, so prefer it.

### 3. Tips

* Keep the body short to avoid dense symbols.
* Use a monitored shared inbox, not a personal address.
* Printed email addresses attract spam, so consider a dedicated alias.
    `,
    [
      { question: 'Can I add attachments through a QR code?', answer: 'No. mailto links cannot attach files. Link to a hosted file instead.' },
      { question: 'Does mailto work on all phones?', answer: 'Yes, provided a default mail app is configured.' },
    ]
  ),
  art(
    'geo-location-qr-code',
    'Location QR Codes: geo URIs vs Map Links for Directions',
    'location qr code geo uri',
    'Choose between geo: coordinates and web map links to guide visitors to an address on iOS and Android.',
    'Fundamentals',
    '5 min read',
    '2026-07-28',
    `
### 1. The geo URI

\`geo:24.8607,67.0011\` follows RFC 5870. Android opens it in a maps app. iOS support is less consistent.

### 2. Web Map Links

\`https://maps.google.com/?q=24.8607,67.0011\` works on both platforms through the browser or map app. For a named business, link its map listing so the visitor sees reviews and opening hours.

### 3. Recommendation

For mixed audiences, encode a web map link. Use geo: only when targeting Android in a controlled environment. Verify coordinates by pasting them into a map before printing.
    `,
    [
      { question: 'Why does my geo QR code fail on iPhone?', answer: 'iOS does not reliably handle geo: URIs from the camera. Use a web map link.' },
      { question: 'How precise should coordinates be?', answer: 'Four to five decimal places (about 1 to 10 meters) is enough.' },
    ]
  ),
  art(
    'calendar-event-qr-code-vevent',
    'Calendar Event QR Codes: vEvent Syntax and Compatibility',
    'calendar event qr code',
    'Create QR codes that add an event to a phone calendar, and learn when a hosted .ics link is better.',
    'Fundamentals',
    '5 min read',
    '2026-07-29',
    `
### 1. vEvent Payload

\`\`\`text
BEGIN:VEVENT
SUMMARY:Open House
DTSTART:20261105T180000Z
DTEND:20261105T200000Z
LOCATION:Main Hall
END:VEVENT
\`\`\`

Times use UTC (Z suffix) or a defined time zone. Some readers expect the block wrapped in BEGIN:VCALENDAR and END:VCALENDAR.

### 2. Compatibility

Behavior varies by reader. The most reliable approach is to encode a short link to a hosted .ics file, which both iOS and Android handle well.

### 3. Tips

Convert times to UTC carefully, keep summary and location short, and test with your own phones.
    `,
    [
      { question: 'Why did my event import at the wrong time?', answer: 'The time zone was missing or mismatched. Use a UTC timestamp or include a TZID.' },
      { question: 'Is a hosted .ics link better?', answer: 'Usually, because it keeps the symbol small and is widely supported.' },
    ]
  ),
  art(
    'tel-uri-phone-call-qr-code',
    'Phone Call QR Codes: tel URIs and International Number Formatting',
    'phone number qr code',
    'Build QR codes that start a phone call, with correct E.164 formatting for local and international callers.',
    'Fundamentals',
    '4 min read',
    '2026-07-30',
    `
### 1. Format

\`tel:+923001234567\`

Use E.164: a plus sign, country code, then the national number without the leading zero. A Pakistani mobile number written locally as 0300 1234567 becomes +92 300 1234567.

### 2. Behavior

Phones show a call prompt, and the user must confirm. No call is placed automatically.

### 3. Tips

* Never include spaces or dashes in the payload.
* Add the number in plain text near the code for accessibility and as a fallback.
* For business contacts consider a vCard so people can save the number.
    `,
    [
      { question: 'Do I include the leading zero?', answer: 'Not with the country code. Drop the national trunk zero in E.164.' },
      { question: 'Can the code dial an extension?', answer: 'Pause characters are inconsistently supported. Use a direct line instead.' },
    ]
  ),
  art(
    'bitcoin-payment-qr-code-bip21',
    'Bitcoin Payment QR Codes: BIP21 URI Syntax and Safety',
    'bitcoin qr code bip21',
    'Understand the BIP21 payment URI for QR codes and how to avoid address-substitution mistakes.',
    'Business & Regional',
    '5 min read',
    '2026-07-31',
    `
### 1. BIP21 Format

\`bitcoin:<address>?amount=0.001&label=Shop&message=Order%20118\`

The amount is in BTC, not satoshis. Label and message are optional URL-encoded text. Many wallets also accept a bare address.

### 2. Safety Practices

* Generate a fresh address per invoice where your wallet supports it.
* Compare the first and last characters of the address shown in the wallet with your records before sending.
* On printed or counter displays, protect the code against sticker overlays.

### 3. Fiat Volatility

Because prices move, show the fiat value and a payment deadline on checkout pages rather than on permanent printed signs.
    `,
    [
      { question: 'Is the amount in BTC or satoshis?', answer: 'BTC, expressed as a decimal.' },
      { question: 'Can I reuse one address on a printed sign?', answer: 'You can, but address reuse reduces privacy and makes tampering harder to notice. Rotate where practical.' },
    ]
  ),
  art(
    'app-store-qr-codes-ios-android',
    'App Download QR Codes: One Code for the App Store and Google Play',
    'app download qr code',
    'Send iPhone and Android users to the correct store from a single printed QR code.',
    'Business & Regional',
    '5 min read',
    '2026-08-01',
    `
### 1. Store URLs

* App Store: \`https://apps.apple.com/app/id<APP_ID>\`
* Google Play: \`https://play.google.com/store/apps/details?id=com.example.app\`

A static code can hold only one of these.

### 2. One Code for Both

Encode a URL on your own domain, such as example.com/app. A tiny server-side script reads the User-Agent header and redirects iOS to the App Store, Android to Google Play, and desktop to a landing page. A client-side script on a landing page can do the same.

### 3. Tips

Keep a fallback landing page with both store badges. Test with real devices before printing.
    `,
    [
      { question: 'Can a static QR code choose the store by itself?', answer: 'No. A static code is fixed text. The platform logic must run on the page it links to.' },
      { question: 'What if the app listing URL changes?', answer: 'Because your domain performs the redirect, you update the target without reprinting.' },
    ]
  ),
  art(
    'qr-code-size-for-business-cards',
    'QR Code Size for Business Cards: Minimum and Recommended Dimensions',
    'qr code size business card',
    'Exact print sizes for business card QR codes, including quiet zone and payload advice.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-02',
    `
### 1. Dimensions

A business card is held about 20 to 30 cm from the camera. Using the 10:1 rule, the minimum is 2 to 3 cm. Aim for 2.5 cm (about 1 inch) for comfort, never below 2 cm on smooth stock.

### 2. Quiet Zone

Leave 4 modules of blank margin. For a Version 2 code (25 modules) at 2.5 cm total symbol width, each module is 1 mm, so the margin is 4 mm. Printed designs often forget this on the back of a card.

### 3. Payload Advice

Link to a short URL. A full vCard with several fields can produce a dense symbol that struggles at this size.

### 4. Finish

Matte uncoated or matte laminate scans better than glossy foil. Avoid embossing or spot UV across the modules.
    `,
    [
      { question: 'Should I print the QR on the front or the back?', answer: 'Either works. The back gives space for a proper quiet zone and short instruction text.' },
      { question: 'Can I use gold foil for the code?', answer: 'Not recommended. Low contrast and reflections reduce reliability.' },
    ]
  ),
  art(
    'qr-code-size-for-product-packaging',
    'QR Code Size for Product Packaging: Module Size and Surface Rules',
    'qr code size packaging',
    'Calculate packaging QR sizes from module width, substrate, and print process.',
    'Printing & Sizing',
    '6 min read',
    '2026-08-03',
    `
### 1. Start From the Module

Packaging QR sizing begins with module width, not overall size. Use at least 0.5 mm per module on coated stock and more on corrugated.

### 2. Worked Example

A Version 2 code has 25 modules. Add an 8-module total quiet zone (4 on each side) and you have 33 modules across. At 0.5 mm per module:
$$33 \\times 0.5 = 16.5\\text{ mm}$$
A Version 3 code needs (29 + 8) x 0.5 = 18.5 mm.

### 3. Surface Considerations

* Flexo on kraft or corrugated: 0.85 mm modules or larger.
* Curved or shrink-sleeve surfaces: place on the flattest area.
* Avoid placing across folds, seams, or glue flaps.

### 4. Verify

Run a print proof and grade it, or at minimum scan on an older budget phone.
    `,
    [
      { question: 'What is the minimum QR size on packaging?', answer: 'Around 16 to 20 mm total for low-density codes on smooth stock, larger for dense payloads or rough surfaces.' },
      { question: 'Does shrink film hurt scanning?', answer: 'It can distort and add glare. Test on filled, finished packs.' },
    ]
  ),
];