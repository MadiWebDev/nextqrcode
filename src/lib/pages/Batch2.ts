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

A full UTM string such as utm_source, utm_medium, and utm_campaign can add 60 or more characters. That increases the QR version and shrinks modules, making scanning harder at the planned print size. Our [QR size calculator](/qr-size-calculator) shows how payload length affects symbol density.

### 2. A Cleaner Pattern

1. Give each placement a short path on your own site, e.g. example.com/m1 for the lobby poster—use our [UTM builder](/utm-builder) to plan your tracking structure.
2. Have your web server redirect that path to the long UTM URL.
3. Analytics then attributes the visit correctly while the printed code stays small.
4. Generate the short-URL code with our [URL QR code generator](/url-qr-code-generator).

### 3. Naming Conventions

Use utm_medium=qr consistently, lowercase values, and one utm_campaign per print run. Use a different path per location so you can compare placements. Before printing, verify scan quality with our [printed QR tester](/printed-qr-tester) and review [placement guidelines](/qr-placement-guide) for optimal results.

### 4. Trade-off

A redirect you control is still a redirect: if you lose the domain or break the path, printed codes fail. Keep the mapping documented. Consider using our [bulk generator](/bulk-generator) if you need many trackable codes for different locations.
    

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
`,
    [
      {
        question: 'Do I need a dynamic QR service for UTM tracking?',
        answer:
          'No. A short path on your own domain that redirects to the UTM URL gives the same attribution without a third party.',
      },
      {
        question: 'What should utm_medium be for QR codes?',
        answer: 'Use a consistent value such as qr so reports group all QR traffic.',
      },
      {
        question: 'How many characters can I save with short URLs?',
        answer:
          'A full UTM URL with parameters can be 100+ characters. A short redirect like example.com/m1 is under 20, potentially dropping you from Version 5 to Version 2.',
      },
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

The first is the older scanner convention and the second follows URI style. Behavior differs between phones and apps, so test both on iOS and Android. Unlike our [URL QR code generator](/url-qr-code-generator) or [WiFi generator](/wifi-qr-code-generator), SMS QR codes must account for platform-specific parsing.

### 2. Encoding Tips

* Use international E.164 numbers with a leading plus sign.
* URL-encode spaces and special characters in the sms: form.
* Keep the message short, since long bodies enlarge the code—check the impact with our [QR size calculator](/qr-size-calculator).
* Test with a [QR scanner](/qr-scanner) on multiple devices before printing.

### 3. Use Cases

Opt-in keywords ("text JOIN to 12345"), quick feedback lines, and appointment confirmations. Check local regulations on marketing messages before launching a campaign. For printed deployment, follow our [QR placement guide](/qr-placement-guide) and verify quality using the [printed QR tester](/printed-qr-tester).
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.
`,
    [
      {
        question: 'Will the message send automatically?',
        answer: 'No. The phone opens the messaging app with a draft; the user must tap send.',
      },
      {
        question: 'Which format should I choose?',
        answer:
          'Test both. If you target a single platform, use whichever opens correctly on your test devices.',
      },
      {
        question: 'Can I include a recipient number and message body in one code?',
        answer:
          'Yes, using either format. The sms: URI format with ?body= is more standards-compliant.',
      },
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

Spaces become %20, commas %2C, and line breaks %0A. Multiple parameters are joined with an ampersand. Generate these easily with our [URL QR code generator](/url-qr-code-generator) by encoding the full mailto URI. Test the resulting code with a [QR scanner](/qr-scanner) on both desktop and mobile devices.

### 2. Alternative Format

Some older scanners use the MATMSG format (MATMSG:TO:...;SUB:...;BODY:...;;). Phone cameras handle mailto reliably, so prefer it. For business contact sharing, consider our [vCard QR code generator](/vcard-qr-code-generator) as an alternative that includes email along with other contact details.

### 3. Tips

* Keep the body short to avoid dense symbols—our [QR size calculator](/qr-size-calculator) helps estimate the result.
* Use a monitored shared inbox, not a personal address.
* Printed email addresses attract spam, so consider a dedicated alias.
* Verify print quality with our [printed QR tester](/printed-qr-tester) and follow [placement best practices](/qr-placement-guide).
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.
`,
    [
      {
        question: 'Can I add attachments through a QR code?',
        answer: 'No. mailto links cannot attach files. Link to a hosted file instead.',
      },
      {
        question: 'Does mailto work on all phones?',
        answer: 'Yes, provided a default mail app is configured.',
      },
      {
        question: 'How long can the subject and body be?',
        answer:
          'Technically unlimited, but long text creates a dense QR code. Keep combined text under 100 characters for best results.',
      },
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

\`geo:24.8607,67.0011\` follows RFC 5870. Android opens it in a maps app. iOS support is less consistent. Test both formats with a [QR scanner](/qr-scanner) on your target devices.

### 2. Web Map Links

\`https://maps.google.com/?q=24.8607,67.0011\` works on both platforms through the browser or map app. For a named business, link its map listing so the visitor sees reviews and opening hours. Generate these links easily using our [URL QR code generator](/url-qr-code-generator).

### 3. Recommendation

For mixed audiences, encode a web map link. Use geo: only when targeting Android in a controlled environment. Verify coordinates by pasting them into a map before printing. Check QR code density using our [QR size calculator](/qr-size-calculator) and ensure proper sizing with the [printed QR tester](/printed-qr-tester). For optimal placement on signage, consult our [QR placement guide](/qr-placement-guide).
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.

### Related tools and guides

- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
`,
    [
      {
        question: 'Why does my geo QR code fail on iPhone?',
        answer: 'iOS does not reliably handle geo: URIs from the camera. Use a web map link.',
      },
      {
        question: 'How precise should coordinates be?',
        answer: 'Four to five decimal places (about 1 to 10 meters) is enough.',
      },
      {
        question: 'Can I add a label or place name to a geo URI?',
        answer:
          'Yes, using geo:24.8607,67.0011?q=Restaurant%20Name but support varies. Web map links are more reliable for labeled locations.',
      },
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

Times use UTC (Z suffix) or a defined time zone. Some readers expect the block wrapped in BEGIN:VCALENDAR and END:VCALENDAR. Test the payload with a [QR scanner](/qr-scanner) on multiple devices before printing.

### 2. Compatibility

Behavior varies by reader. The most reliable approach is to encode a short link to a hosted .ics file using our [URL QR code generator](/url-qr-code-generator), which both iOS and Android handle well. This also keeps the QR symbol smaller—verify with our [QR size calculator](/qr-size-calculator).

### 3. Tips

Convert times to UTC carefully, keep summary and location short, and test with your own phones. For printed event materials, use our [printed QR tester](/printed-qr-tester) to verify scannability and follow the [QR placement guide](/qr-placement-guide) for optimal positioning.
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.

### Related tools and guides

- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
`,
    [
      {
        question: 'Why did my event import at the wrong time?',
        answer: 'The time zone was missing or mismatched. Use a UTC timestamp or include a TZID.',
      },
      {
        question: 'Is a hosted .ics link better?',
        answer: 'Usually, because it keeps the symbol small and is widely supported.',
      },
      {
        question: 'Can I include recurring events in a QR code?',
        answer:
          'Yes, using RRULE in the vEvent format, but the payload becomes large. A hosted .ics file is more practical.',
      },
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

Use E.164: a plus sign, country code, then the national number without the leading zero. A Pakistani mobile number written locally as 0300 1234567 becomes +92 300 1234567. Generate these using our [URL QR code generator](/url-qr-code-generator) by encoding the tel: URI.

### 2. Behavior

Phones show a call prompt, and the user must confirm. No call is placed automatically. Test with a [QR scanner](/qr-scanner) to ensure the number displays correctly before printing.

### 3. Tips

* Never include spaces or dashes in the payload.
* Add the number in plain text near the code for accessibility and as a fallback—see our [QR placement guide](/qr-placement-guide).
* For business contacts consider a [vCard QR code](/vcard-qr-code-generator) so people can save the full contact.
* Verify print quality with our [printed QR tester](/printed-qr-tester) before mass production.
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.

### Related tools and guides

- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
`,
    [
      {
        question: 'Do I include the leading zero?',
        answer: 'Not with the country code. Drop the national trunk zero in E.164.',
      },
      {
        question: 'Can the code dial an extension?',
        answer: 'Pause characters are inconsistently supported. Use a direct line instead.',
      },
      {
        question: 'Will international callers be charged more?',
        answer:
          'Callers pay their normal international rates. Make this clear on signage if targeting tourists.',
      },
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

The amount is in BTC, not satoshis. Label and message are optional URL-encoded text. Many wallets also accept a bare address. Generate these using our [Bitcoin QR code generator](/bitcoin-qr-code-generator) for proper formatting.

### 2. Safety Practices

* Generate a fresh address per invoice where your wallet supports it.
* Compare the first and last characters of the address shown in the wallet with your records before sending.
* On printed or counter displays, protect the code against sticker overlays using our [QR safety checker](/qr-safety-checker) guidance.
* Verify the code scans correctly with a [QR scanner](/qr-scanner) on multiple wallet apps before deployment.

### 3. Fiat Volatility

Because prices move, show the fiat value and a payment deadline on checkout pages rather than on permanent printed signs. Use our [QR size calculator](/qr-size-calculator) to plan the appropriate size for counter displays and follow the [QR placement guide](/qr-placement-guide) for optimal positioning.
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
`,
    [
      { question: 'Is the amount in BTC or satoshis?', answer: 'BTC, expressed as a decimal.' },
      {
        question: 'Can I reuse one address on a printed sign?',
        answer:
          'You can, but address reuse reduces privacy and makes tampering harder to notice. Rotate where practical.',
      },
      {
        question: 'How do I protect against sticker overlay attacks?',
        answer:
          'Use tamper-evident materials, regular inspections, and educate customers to verify the payment address before confirming.',
      },
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

A static code can hold only one of these. Generate the URL with our [URL QR code generator](/url-qr-code-generator) after setting up the redirect.

### 2. One Code for Both

Encode a URL on your own domain, such as example.com/app. A tiny server-side script reads the User-Agent header and redirects iOS to the App Store, Android to Google Play, and desktop to a landing page. A client-side script on a landing page can do the same. Track installations using our [UTM builder](/utm-builder) conventions.

### 3. Tips

Keep a fallback landing page with both store badges. Test with real devices before printing using a [QR scanner](/qr-scanner) on iOS and Android. Verify print quality with our [printed QR tester](/printed-qr-tester) and follow [placement guidelines](/qr-placement-guide) for optimal results.
    

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

Codes that stay in circulation need occasional attention. Links change, pages move, and printed materials fade, so review each live code on a regular schedule and confirm it still opens the right destination. When a destination changes, update a dynamic code or reprint a static one on the same day, and remove old codes from circulation so nobody scans a dead link. Keep a simple register of where each code appears, what it points to, and when it was last tested, because a code nobody owns is a code nobody fixes.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
`,
    [
      {
        question: 'Can a static QR code choose the store by itself?',
        answer:
          'No. A static code is fixed text. The platform logic must run on the page it links to.',
      },
      {
        question: 'What if the app listing URL changes?',
        answer:
          'Because your domain performs the redirect, you update the target without reprinting.',
      },
      {
        question: 'Should I create separate QR codes for iOS and Android?',
        answer:
          'No need if you use a smart redirect. One code keeps signage cleaner and reduces user confusion.',
      },
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

A business card is held about 20 to 30 cm from the camera. Using the 10:1 rule from our [QR size calculator](/qr-size-calculator), the minimum is 2 to 3 cm. Aim for 2.5 cm (about 1 inch) for comfort, never below 2 cm on smooth stock.

### 2. Quiet Zone

Leave 4 modules of blank margin. For a Version 2 code (25 modules) at 2.5 cm total symbol width, each module is 1 mm, so the margin is 4 mm. Printed designs often forget this on the back of a card. Review our [QR placement guide](/qr-placement-guide) for proper spacing.

### 3. Payload Advice

Link to a short URL created with our [URL QR code generator](/url-qr-code-generator). A full vCard with several fields can produce a dense symbol that struggles at this size—our [vCard QR generator](/vcard-qr-code-generator) can create optimized versions, or use a profile link instead. Test the final card with a [QR scanner](/qr-scanner) and verify quality with our [printed QR tester](/printed-qr-tester).

### 4. Finish

Matte uncoated or matte laminate scans better than glossy foil. Avoid embossing or spot UV across the modules. Use our [error correction simulator](/error-correction-simulator) to understand how surface treatments affect scannability.
    

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
`,
    [
      {
        question: 'Should I print the QR on the front or the back?',
        answer:
          'Either works. The back gives space for a proper quiet zone and short instruction text.',
      },
      {
        question: 'Can I use gold foil for the code?',
        answer: 'Not recommended. Low contrast and reflections reduce reliability.',
      },
      {
        question: 'What if my card design has no space for a 2.5cm code?',
        answer:
          'Reduce the payload length to lower the version, or accept that 2cm is the practical minimum on high-quality stock.',
      },
    ]
  ),
  art(
    'qr-code-size-for-product-packaging',
    'QR Code Size for Product Packaging: Module Size and Surface Rules',
    'qr code size packaging',
    'Calculate packaging QR sizes from module width, substrate, and print process.',
    'Printing & Sizing',
    '13 min read',
    '2026-08-03',
    `
### 1. A code that prints well and still will not scan

A label can look perfect on screen and then fail on the shelf, at the till, or in a customer's kitchen. The usual cause is not the artwork. It is size: the code was made too small for the data inside it, for the material it was printed on, or for the distance it must be scanned from.

This article is for packaging designers, brand and production staff, and small producers printing their own labels. It explains how QR size is decided, starting from the module, the small square every QR code is built from. It gives worked examples you can check with a ruler, practical floors for different materials and print processes, and rules for curved surfaces such as bottles and jars.

Treat every number here as practical guidance, not a compliance rule for any industry scheme. Prove it on your real packaging before a full print run.

### 2. What the code should carry, and why shorter is smaller

Size begins with content. A QR code stores its payload in a grid, and more data needs more rows and columns. On packaging the payload is usually a link: a product page, instruction page, allergen page, reorder page, or support page. It can also be plain text, such as a short product identifier, readable without an internet connection.

Keep the payload as short as you honestly can. A short, clean link needs far fewer modules than a long link full of tracking parameters and campaign codes. If you need tracking, do it on the page the link opens, where you can change it later. Every extra character can push the code to a higher version, meaning more modules in the same printed space, or a bigger code to keep modules readable.

Do not fit a full manual or long ingredients list inside the code. Put that on the page the code opens.

Our generators produce static codes only, so the payload is fixed once printed. You cannot shorten or correct a printed link later. That makes checking before files go to print the most important stage of all.

### 3. Step-by-step: create the codes with our tools

Work in this order: fix the payload, work out the version and module count, set the module size for your material, then check the finished size before designing around it.

1. Write the final payload exactly as printed, ideally a short link. Open the [QR size calculator](/qr-size-calculator) and enter it to see the size implications before committing to artwork.
2. Use the [QR module size calculator](/qr-module-size-calculator) to work from the module up. Enter the version or module count and your planned module width, and confirm the total width including quiet zone. Reserve that total on the pack.
3. Run the result through the [QR minimum size checker](/qr-minimum-size-checker). If it warns the code is below a practical minimum, shorten the payload or increase the size, and check again.
4. Check artwork resolution with the [QR DPI calculator](/qr-dpi-calculator) so module edges land cleanly at final output size, rather than being scaled by a fraction at the printer.
5. For bottles, jars, and tubes, enter the container diameter and label width in the [QR curved surface calculator](/qr-curved-surface-calculator) and keep the code within its recommended width for that curve.
6. For uncoated or corrugated material, or a process that spreads ink, check the allowance with the [QR dot gain tolerance checker](/qr-dot-gain-tolerance-checker) and increase module size if it advises.
7. Check a proof with the [QR contrast checker](/qr-contrast-checker), using the exact ink and background colours of the final pack.
8. For a label run, generate the set with the [bulk shelf label QR generator](/bulk-shelf-label-qr-generator), keeping the same module size across the set.

### 4. Sizes, contrast and error correction

A QR grid is measured in modules across. Version 1 has 21 modules. Each higher version adds 4 modules, so Version 2 has 25 and Version 3 has 29. Around the grid add a quiet zone of 4 modules on every side: plain empty space that helps a scanner find the code.

To work out any printed size, add 8 modules to the grid width for both quiet zones, then multiply by the width of one module.

Example one: a short link fits Version 2, at 25 modules. With quiet zones you need 33 modules across. At 0.5 mm per module, total width is 33 multiplied by 0.5 mm, which is 16.5 mm. The code alone is 12.5 mm, but you must reserve the full 16.5 mm on the pack.

Example two: a longer link needs Version 3, at 29 modules, or 37 including quiet zones. At 0.5 mm per module that is 18.5 mm total. At 0.75 mm per module, suiting a rougher material, it needs 27.75 mm. A longer payload and a rougher material both push size up, and they multiply together.

Example three: shorten the link to fit Version 1, at 29 modules including quiet zones. At 0.5 mm per module that is 14.5 mm total.

For module width floors, smooth coated stock can go smaller, around 0.33 mm to 0.5 mm per module in careful print conditions, because edges stay sharp. Uncoated paper, kraft board, and corrugated board spread ink, so start nearer 0.5 mm to 0.75 mm per module, and larger for coarse corrugated board. These are starting points for a proof, not guarantees.

Match size to scan distance: code width should be roughly one tenth of the intended scan distance. Scanned from about 20 cm, use roughly 20 mm wide; from about 50 cm, roughly 50 mm wide.

Error correction lets a code survive damage. Levels L, M, Q, and H recover roughly 7, 15, 25, and 30 percent of the code. Higher correction adds modules, so it can increase version and size. For clean, flat, indoor packaging, M is often enough. For codes that may be scuffed or damp, Q is safer. Use H only when needed, and recheck size afterwards.

Keep contrast dark on light, ideally black on white or a very pale panel. Never invert the code to light on dark. Do not use a colour close in tone to the background: a camera reads brightness more than hue. Keep gloss varnish, foil, and heavy lamination off the code area, because reflections can hide modules even when the print underneath is perfect.

Leave bleed and safe margins so cutting shifts cannot trim the quiet zone. Print processes differ: thermal is sharp but can fade, inkjet spreads on uncoated stock, flexo gains on films, offset is sharpest on coated board. Proof with your actual process.

### 5. Real-world use cases

A jam maker prints jar labels linking to ingredients and a reorder form. Because the jar curves, the code is kept small relative to the curve and placed on the flat label panel.

A coffee roaster uses coated bags with a flat back panel. A short link fits a low version, so the code prints modestly on the back, on a white panel that guarantees contrast.

A soap producer wraps bars in uncoated kraft paper. Ink spreads there, so the producer uses a larger module width and a short link, keeps strong brightness contrast, and proofs each new paper batch before a full run.

An electronics brand puts a code on a corrugated outer box. The board is rough and scanning distance is longer in a warehouse, so the code is much larger, away from folds and tape.

### 6. Testing

Always proof on the real substrate at final size. A screen proof or a print on office paper tells you almost nothing about ink spread, contrast, or glare on the actual pack.

Print a test sheet on the production material, using the production process where possible. Include the code at your planned size, one size larger, and one size smaller, to see where scanning starts to fail.

Scan each proof with several phones, including an older phone, in the light where the product will be used. Scan at the intended distance, at an angle, and through any film. Use the [printed QR tester](/printed-qr-tester) routine to check size, quiet zone, and contrast.

Test the worst case: a label from the start and end of a run, and a code after handling, chilling, or stacking. If any proof needs several attempts, do not ship it. Increase module size, shorten the payload, improve contrast, or move the code, then proof again.

Keep one approved proof with its settings recorded: payload, version, module width, total width, material, process, and error-correction level. When anything changes, proof again.

### 7. Common mistakes and how to fix them

**Shrinking the code to fit the layout instead of sizing the layout to fit the code.** This squeezes modules below what the material can hold. Fix it by calculating total width including quiet zones first, reserving that space, and shortening the payload if the space cannot grow.

**Forgetting the quiet zone in the calculation.** A correct grid still fails if artwork, text, or a pack edge crowds it. Fix it by adding 4 modules of clear space on every side to every size figure, and keeping all other elements outside it.

**Using a long link with tracking parameters.** Extra characters raise the version and shrink modules at a fixed print size. Fix it by using the shortest clean link you control, and handling tracking on the landing page instead.

**Printing the same small size on every material.** A size that works on coated board can fail on corrugated or kraft paper because of dot gain, where printed dots grow and fill the gaps between modules. Fix it by setting module width per substrate and proofing each material separately.

**Placing a wide code around a tight curve.** Edge modules wrap away from the camera and distort, so the scanner sees a warped grid. Fix it by keeping the code small relative to the curve, using the curved surface calculator, or moving it to the flat label panel.

**Covering the code with gloss varnish.** A sharp code under a reflective layer can disappear at common angles. Fix it by leaving the code unvarnished where possible and testing the sealed pack.

**Approving the design on screen without a physical proof.** Screens hide ink spread, low contrast, and cutting drift. Fix it by requiring a final size proof on the real substrate before releasing a run.

### 8. Privacy and security notes

A packaging code is public by design: anyone can scan, photograph, and share it. Never encode anything you would not print in plain text on the pack: no internal links, admin pages, single-customer discount codes, or staff personal details.

These generators run entirely in your browser, with no account or sign-up. Codes are created locally and nothing you type is uploaded, so drafts stay on your machine until you publish them.

The site does not track scans, so you will not see a scan count from the code itself. Measure visits on the product page with your normal website tools, and explain in your privacy notice what that page collects.

Static codes never expire and work offline once printed. For a link code, the page must stay live while packaging is in circulation, which can be years. Before a large run, check the link goes to a page you control and that a future redesign will keep it working.

Check the link as a customer would, on a phone with no login.

### 9. Related tools and guides

- [QR module size calculator](/qr-module-size-calculator) — Total width from version, module width, and quiet zone.
- [QR size calculator](/qr-size-calculator) — Printed size a given payload will need.
- [QR minimum size checker](/qr-minimum-size-checker) — Whether a planned size is below a practical minimum.
- [QR DPI calculator](/qr-dpi-calculator) — Match artwork resolution to final module size.
- [QR curved surface calculator](/qr-curved-surface-calculator) — Sizing for bottles, jars, and curved packs.
- [QR contrast checker](/qr-contrast-checker) — Check ink and background colours for readable contrast.
`,
    [
      {
        question: 'How do I calculate the printed size of a QR code for packaging?',
        answer:
          'Take the modules across for the version, add eight modules for the quiet zones on both sides, then multiply by your module width. A Version 2 code is 25 modules, so 33 modules across at 0.5 millimetres per module gives a total printed width of 16.5 millimetres including quiet zones.',
      },
      {
        question: 'What is the smallest module size I should use on packaging?',
        answer:
          'On smooth coated stock, modules around 0.33 to 0.5 millimetres can work in careful print conditions. On uncoated paper, kraft board, or corrugated board, start nearer 0.5 to 0.75 millimetres because ink spreads. Treat these as starting points and always proof on the real material at final size.',
      },
      {
        question: 'Why does a longer link make a packaging QR code harder to scan?',
        answer:
          'More data needs a higher version, which means more modules in the grid. If the printed size stays the same, each module gets smaller and harder to print and read cleanly. Shorten the link, handle tracking on the landing page, and the code can stay larger, simpler, and more reliable.',
      },
      {
        question: 'How large should a QR code be for its scanning distance?',
        answer:
          'Use the rough guide that code width should be about one tenth of the intended scan distance. For scanning from about 20 centimetres, make the code roughly 20 millimetres wide. For about 50 centimetres, on a shelf edge or outer case, make it roughly 50 millimetres wide.',
      },
      {
        question: 'Can I print a QR code on a curved bottle or jar?',
        answer:
          'Yes, if you keep the code small relative to the curve or place it on the flat label panel. Wide codes wrap around the curve, distorting edge modules so scanners struggle. Check the diameter and label width with a curved surface calculator, then test the filled container before production.',
      },
      {
        question: 'What contrast and finish work best for packaging QR codes?',
        answer:
          'Use dark modules on a light background, ideally black on white or a very pale panel, and never invert the code. Avoid colours close in tone, and keep gloss varnish, foil, or heavy lamination off the code area where possible, because reflections can hide modules from a phone camera.',
      },
      {
        question: 'How should I test a packaging QR code before a print run?',
        answer:
          'Proof on the real substrate, at final size, using the real print process. Scan with several phones, including an older one, at the intended distance and in real lighting. Test start and end of run samples and handled packs. If any proof needs repeated attempts, resize and proof again.',
      },
    ]
  ),
];
