import type { Article } from '../articles';
import { art } from './helper';

export const batch7: Article[] = [
  art(
    'india-upi-qr-code-format',
    'India UPI QR Codes: UPI URI Payload, VPA Format, and Merchant Codes',
    'upi qr code format',
    'Build and verify UPI payment QR codes using the official URI scheme for static and dynamic flows.',
    'Business & Regional',
    '6 min read',
    '2026-09-13',
    `
### 1. URI Structure

\`\`\`
upi://pay?pa=merchant@bank&pn=Merchant+Name&mc=5411&tid=TXN001&tr=Ref001&tn=Purchase&am=500.00&cu=INR
\`\`\`

* \`pa\` – payee VPA (Virtual Payment Address), required.
* \`pn\` – payee name, recommended.
* \`mc\` – merchant category code, for merchants.
* \`am\` – amount; omit for a variable-amount static code.
* \`cu\` – currency, always INR.
* \`tr\` – transaction reference.
* \`tn\` – transaction note.

### 2. Static vs Dynamic

A static QR omits the amount and reference so any payer can enter their own amount. A dynamic QR includes a pre-filled amount and reference, suitable for specific invoices.

### 3. Verification

Scan with BHIM or any UPI-enabled bank app before printing. Confirm the payee name shown matches the VPA holder.

### 4. Error Correction

Use level M for screen display and level Q or H for printed signage.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Is the amount mandatory in a UPI QR?',
        answer:
          'No. Omitting it creates a static code the customer fills in. Include it for specific invoices or order amounts.',
      },
      {
        question: 'What is a VPA?',
        answer:
          'A Virtual Payment Address, also called a UPI ID, such as name@bank. It routes the payment to the correct account.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'pakistan-raast-qr-code-format',
    'Pakistan Raast QR Codes: EMV Payload Structure and IBFT Details',
    'raast qr code pakistan',
    'Understand the Raast instant payment QR standard from the State Bank of Pakistan.',
    'Business & Regional',
    '6 min read',
    '2026-09-14',
    `
### 1. Overview

Raast is Pakistan's instant payment system, operated by the State Bank of Pakistan. The QR code standard follows the EMV merchant-presented model with Pakistan-specific merchant account sub-tags.

### 2. Key Fields

* **00:** Payload format indicator.
* **01:** Initiation method, 11 static or 12 dynamic.
* **26:** Merchant account information with Raast application identifier and IBAN or Raast ID.
* **52:** Merchant category code.
* **53:** Currency 586 (Pakistani rupee).
* **54:** Amount (optional for static codes).
* **58:** Country PK.
* **59, 60:** Merchant name and city.
* **63:** CRC16 checksum.

### 3. Implementation

Follow the published SBP Raast QR specification for exact sub-tag numbers and length limits. Verify by scanning with a Raast-enabled banking app before deploying.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      { question: 'What currency code does Raast use?', answer: '586 for the Pakistani rupee.' },
      {
        question: 'Is CRC16 required?',
        answer:
          'Yes. Banking apps validate the checksum and will reject a code with an incorrect value.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'malaysia-duitnow-qr-code',
    'Malaysia DuitNow QR: EMV Payload and Merchant Registration',
    'duitnow qr code malaysia',
    'How DuitNow QR codes work for Malaysian merchants and what the EMV payload contains.',
    'Business & Regional',
    '6 min read',
    '2026-09-15',
    `
### 1. Standard

DuitNow QR follows the EMVCo merchant-presented QR specification. The national standard is published by PayNet Malaysia and is broadly shared with regional schemes.

### 2. Payload Highlights

* **00:** Payload format indicator 01.
* **01:** Initiation method 11 for static, 12 for dynamic.
* **26 or 29:** Merchant account information with the DuitNow application identifier.
* **52:** Merchant category code.
* **53:** Currency 458 (Malaysian ringgit).
* **58:** Country MY.
* **63:** CRC16.

### 3. Merchant Registration

DuitNow QR codes must be issued through a participating financial institution. Individual merchants register through their bank to get a verified QR linked to their account.

### 4. Interoperability

DuitNow is interoperable with other ASEAN instant payment QR schemes including Singapore PayNow, Thailand PromptPay, and the Philippines InstaPay, under the ASEAN cross-border payment framework.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Can anyone generate a DuitNow QR code?',
        answer:
          'Merchants must register through a participating bank. Self-generated payloads will not link to a verified account.',
      },
      { question: 'What currency code does DuitNow use?', answer: '458 for Malaysian ringgit.' },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'nigeria-nibss-qr-code-nqr',
    'Nigeria NQR: NIBSS QR Code Standard for Merchant Payments',
    'nqr nibss nigeria qr code',
    'An overview of Nigerias NQR scheme, its EMV basis, and how merchants and banks implement it.',
    'Business & Regional',
    '6 min read',
    '2026-09-16',
    `
### 1. What Is NQR

NQR is the national QR payment standard operated by Nigeria Inter-Bank Settlement System (NIBSS). It follows the EMVCo merchant-presented specification, with Nigeria-specific fields.

### 2. Payload Fields

The payload follows the standard TLV EMV structure. Key additions include the CBN-assigned merchant identifier and bank-specific sub-tag for the account routing. Currency code is 566 (Nigerian naira) and country code is NG.

### 3. Merchant Onboarding

Merchants register through their bank or fintech provider. The QR is generated and certified by the participating institution, not self-generated.

### 4. Consumer App

NQR works with mobile banking apps and licensed payment apps. The consumer scans, reviews the amount and merchant name, then authorises using their PIN or biometric.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      { question: 'What currency code does NQR use?', answer: '566 for the Nigerian naira.' },
      {
        question: 'Can I generate an NQR code manually?',
        answer: 'No. NQR codes must be issued through a NIBSS-certified financial institution.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'singapore-paynow-qr-code',
    'Singapore PayNow QR Codes: EMV Payload and Cross-Border ASEAN Interoperability',
    'paynow qr code singapore',
    'How PayNow QR codes work for Singapore businesses, including NRIC, UEN, and proxy transfers.',
    'Business & Regional',
    '6 min read',
    '2026-09-17',
    `
### 1. Standard Basis

PayNow QR follows the EMV merchant-presented format. Currency is 702 (Singapore dollar) and country code is SG.

### 2. Proxy Types

PayNow supports several identifier types in the merchant account field:
* UEN (Unique Entity Number) for registered businesses.
* Mobile number for individuals.
* NRIC or FIN for personal transfers.
* Virtual payment address.

### 3. Interoperability

PayNow links to Malaysia DuitNow, Thailand PromptPay, India UPI, and other ASEAN schemes. Cross-border QR scans use the recipient's domestic identifier and convert currency at the point of transfer.

### 4. Dynamic Codes

Dynamic PayNow QR codes include an amount and a reference so the payer's bank pre-fills both fields. Always validate the generated payload by scanning with a Singapore banking app before going live.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- When a one-dimensional symbol fits better, the [barcode generator](/barcode-generator) covers retail and inventory formats.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
`,
    [
      { question: 'What currency code does PayNow use?', answer: '702 for the Singapore dollar.' },
      {
        question: 'Can tourists pay with PayNow from their home banking app?',
        answer: 'Yes, under the ASEAN cross-border QR framework, if their bank participates.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'kenya-mpesa-qr-code',
    'Kenya M-Pesa QR Codes: Merchant Payments and Lipa na M-Pesa',
    'mpesa qr code kenya',
    'How Kenyan merchants use a displayed M-Pesa QR code for till and paybill payments, with printing guidance and the daily checks that stop sticker-swap fraud.',
    'Business & Regional',
    '12 min read',
    '2026-09-18',
    `
### 1. The problem at the till

Every Kenyan merchant who takes M-Pesa knows the small frictions by heart. A customer types the till number from memory and sends money to the wrong business. A queue builds while someone reads a long paybill number and account reference aloud, digit by digit. A new cashier gives out the wrong number on a busy Saturday. None of these are technology failures — they are transcription failures, and a printed QR code at the payment point is a simple way to remove most of them.

An M-Pesa QR code displayed at your till, counter or market stall carries your payment details in a form the customer's phone can read in one scan, so the number goes into the payment flow without being typed. This guide explains how Lipa na M-Pesa payments work with a displayed code, how to create one with our free payment tools, how to print and place it so it survives a shop counter, and — most importantly — the verification habits that keep both merchant and customer safe, because a QR code helps money go to the right place only when the person paying checks the name on the confirmation screen before entering a PIN.

### 2. Lipa na M-Pesa: the three ways customers pay you

M-Pesa is Safaricom's mobile money service, and most merchant payments in Kenya run through one of three Lipa na M-Pesa arrangements:

- **Till Number (Buy Goods and Services).** The standard choice for shops, eateries, stalls and service businesses. The customer enters the till number and the amount; the payment lands in the business's M-Pesa account and both sides get a confirmation message.
- **Paybill.** Used by organisations that need an account reference as well as a number — schools, utilities, landlords, churches, suppliers collecting invoice payments. The customer enters the paybill number, then an account number that identifies them or the invoice.
- **Pochi la Biashara.** A till arrangement tied to a personal M-Pesa line, widely used by sole traders and small sellers who receive business payments on their own number while keeping those payments separate from personal transfers.

Whichever arrangement you use, the customer's side of the payment follows the same shape: open M-Pesa (the app, the SIM toolkit menu, or the USSD service), choose Lipa na M-Pesa, enter the number and amount, review the confirmation screen that shows the registered name of the business or number, then authorise with the M-Pesa PIN. A QR code improves the middle of that flow — the number entry — and the confirmation screen remains the customer's safety check.

### 3. What a displayed QR code does in that flow

A printed QR code at the payment point can carry your till or paybill details as scannable text. The customer scans it with their phone camera or the scanner in their banking or M-Pesa app, and the details are captured without typing. What the code cannot do is complete or authorise a payment: the customer still enters the amount, still sees the confirmation screen with the registered name, and still enters their own PIN. No legitimate payment code can skip those steps, and any code or person suggesting otherwise should be treated with suspicion.

That division of labour is exactly right. The code removes the typing errors; the human keeps the verification. For the merchant, the benefit compounds across hundreds of small transactions: fewer wrong-number payments to unwind, faster queues, and no dependence on a customer hearing a number correctly in a noisy shop.

Merchants with several payment points — a supermarket with six tills, a petrol station with several pumps, a restaurant where customers pay at the table — use one code per point only if the points genuinely have different till numbers. Most small businesses have one till number, and one well-placed code design, printed several times, serves the whole premises.

### 4. Step-by-step: create your M-Pesa payment code

**Step 1 — Confirm your official details first.** Before generating anything, confirm your till number (or paybill number and the account format you give customers) from your own M-Pesa records or a recent transaction message. The code will faithfully reproduce whatever you type — including a mistake — so this check is the whole ballgame.

**Step 2 — Open the payment QR tools.** Start from our [payment QR hub](/payment-qr), which covers the regional payment schemes, or build the code with the [URL QR code generator](/url-qr-code-generator) if your payment page or instructions live at a web address. Enter the till details exactly as customers should use them.

**Step 3 — Add a clear label in the design.** The printed piece should say, in words, what the code is for: the business name, 'Lipa na M-Pesa', and the till number printed as readable text beneath the code. The text is the fallback for a customer whose phone cannot scan, and it lets your staff verify at a glance that the right code is on display.

**Step 4 — Generate and scan it yourself.** Scan the preview with your own phone and confirm the details it captures match your till exactly — number, and business name where shown. Then make a tiny test payment from a personal line, or have a trusted customer do the first live scan, and confirm the payment arrives in the right account before the code goes on public display.

**Step 5 — Download for print.** Choose SVG or the largest PNG. Counter cards get printed, reprinted and resized by copy shops; a crisp master file keeps every copy scannable.

**Step 6 — Print and mount.** Follow the sizing and material guidance in section 5, and keep a dated master copy so a damaged or faded display can be replaced identically.

### 5. Printing and placing the code in a real shop

- **Size:** at least **30 × 30 mm** for a counter card scanned across a till, and **40 × 40 mm or more** for a wall or window sign scanned from a step or two away. Payment codes are scanned by every kind of phone, including older and cheaper models with modest cameras — size is your insurance.
- **Error correction:** use **Q or H**. Counter cards get wiped, splashed and sun-faded; the higher levels keep a worn code working. If your design includes a logo, H is the right default.
- **Contrast:** black on white. Brand colours are for the card around the code, not the code itself.
- **Material:** laminate the card or print on synthetic stock. Behind the counter glass is fine if the glass is clean and the code still scans through it — test it in place, at night as well as in daylight, because reflections change.
- **Placement:** where the customer naturally stands to pay, at about chest height, with the till number in text beside it. One obvious code at the payment point beats three codes in three places, which invite doubt about which is current.
- **One current version.** When a till number changes, replace every displayed copy the same day and destroy the old ones. Two different payment codes on display is an invitation to error and to fraud.

### 6. Safety: the checks that make QR payments trustworthy

Payment codes attract a specific crime: **sticker swapping**. A fraudster prints their own code and sticks it over the merchant's, so customer payments flow to the fraudster's till until someone notices. It is simple, it is known, and it is defeated by simple habits:

- **Inspect your displayed codes daily.** Run a fingertip over the code — a sticker on top of your card has an edge you can feel. Check the printed till number in the text matches yours.
- **Do a tiny test payment** after any reprint, replacement, or suspicion, and confirm it lands in your account.
- **Mount codes where staff can see them** and prefer rigid, sealed displays over loose paper that is easy to cover.
- **Teach the confirmation habit.** The strongest protection in the whole system is the customer's confirmation screen: it shows the registered name the money is going to before the PIN is entered. A small line on your counter card — 'Check the name on your phone matches our shop name before you pay' — protects your customers and your reputation at the same time.
- **Customers: never pay from a code sent by a stranger** asking you to 'confirm' or 'receive' money. Receiving money never requires you to scan a code and enter your PIN. Anyone saying otherwise is running a scam, in Kenya and everywhere else.

For merchants, a daily glance and a weekly test scan should be part of opening routine, like checking the float.

### 7. Privacy and data notes

A payment QR code of this kind is a static code: it carries the till details you put into it, and nothing else. It does not track who scans it, it does not collect customer data, and it does not expire. The codes our tools create are generated in your browser — the till details you enter are not sent to or stored by us, there is no account, and there is no scan analytics. The transaction record itself lives where it always lives: in M-Pesa, in the confirmation messages both sides receive. If your till number changes, the old code keeps pointing at the old number forever, which is why replacing displayed copies promptly matters.

One more boundary worth stating: a QR code is a display convenience, not a payment service. Disputes, reversals and wrong payments are handled through M-Pesa's own processes, and a merchant's records — the confirmation messages — are what support those cases. Keep them.

### 8. Common mistakes and how to fix them

**Generating the code from memory.** One transposed digit routes every payment to a stranger. Fix: copy the till number from an official source, then test with a real small payment before displaying the code.

**A code with no text label.** Customers cannot tell what it is for, and staff cannot verify it at a glance. Fix: business name, 'Lipa na M-Pesa' and the till number in readable text on the same card.

**Old and new codes both on display.** After a till change, a leftover card at a second entrance keeps collecting to the old number. Fix: same-day replacement everywhere, and destroy old prints.

**Tiny code on a big sign.** A 20 mm code on a shopfront sign cannot be scanned from the pavement. Fix: size for the scanning distance — 40 mm minimum for signs, more for window displays.

**Laminated glare.** A glossy card under a spotlight reflects instead of scanning. Fix: matte lamination, a slight tilt, or a different position; test at night under shop lighting.

**Assuming the code verifies the payment.** It does not — it only carries the number. Fix: check the confirmation message for each payment as you normally would; the code changes nothing about settlement.

### 9. Related tools and guides

- The [payment QR hub](/payment-qr) covers regional payment code schemes and how customers use them.
- The [Pakistan payment QR](/pakistan-payment-qr) page explains a neighbouring market's payment code flow.
- The [printed QR tester](/printed-qr-tester) checks a counter card before it goes on display.
- The [QR size calculator](/qr-size-calculator) gives a size for any scanning distance.
- Our [QR code security best practices](/blog/qr-code-security-best-practices) guide covers safe scanning for merchants and customers.
`,
    [
      {
        question: 'How does an M-Pesa QR code work for a customer?',
        answer:
          'The customer scans the displayed code so the till or paybill details are captured without typing, then enters the amount, checks the registered business name on the confirmation screen, and authorises with their M-Pesa PIN. The code removes typing errors; it never skips the confirmation or the PIN.',
      },
      {
        question: 'Is it safe to display a QR code for my till number?',
        answer:
          'Yes, if the code faithfully carries your correct till details and you have tested it with a real small payment. Always copy the number from an official source, print the till number as readable text beside the code, and confirm the first live payment lands in your account.',
      },
      {
        question: 'What is the difference between a till number, paybill and Pochi la Biashara?',
        answer:
          'A till number serves one business location or operation. A paybill number is used with an account reference that identifies the payer or invoice, which suits schools, utilities, landlords and suppliers. Pochi la Biashara suits sole traders receiving business payments on a personal line.',
      },
      {
        question: 'How big should a printed M-Pesa QR code be?',
        answer:
          'At least 30 x 30 mm for a counter card, and 40 x 40 mm or more for wall or window signs. Use error correction Q or H, black on white, and test the mounted card in day and night lighting before relying on it.',
      },
      {
        question: 'How do I protect my payment code from sticker swapping?',
        answer:
          'Inspect it daily — a fraudulent sticker stuck over your code has a feelable edge — do a small test payment after any reprint, mount codes where staff can see them, and remind customers to check that the name on their confirmation screen matches your business before they enter a PIN.',
      },
      {
        question: 'Does the QR code store my till details or track customers?',
        answer:
          'No. The code our tools create is generated in your browser and simply carries the till details you enter. Nothing is sent to or stored by us, there is no account, and the transaction record itself stays in M-Pesa as usual.',
      },
      {
        question: 'What happens to my printed codes if my till number changes?',
        answer:
          'Immediately. Replace every displayed copy on the same day and destroy the old prints. A static code keeps pointing at the old number forever, so a leftover card at a second entrance would keep collecting payments to the wrong till.',
      },
    ]
  ),
  art(
    'saudi-arabia-stc-pay-qr-code',
    'Saudi Arabia STC Pay and mada QR Codes: Local Payment Standards',
    'saudi arabia qr code payment',
    'Overview of QR payment standards in Saudi Arabia, including SAMA-regulated requirements and the mada network.',
    'Business & Regional',
    '6 min read',
    '2026-09-19',
    `
### 1. Regulatory Context

Payment QR codes in Saudi Arabia are regulated by the Saudi Central Bank (SAMA). The Oman, UAE, and GCC region is increasingly moving toward harmonised EMV-based QR standards.

### 2. mada QR

mada is the Saudi national debit network. mada QR codes follow the EMVCo merchant-presented framework with Saudi-specific fields. Merchants must be registered through a mada-certified acquirer.

### 3. STC Pay

STC Pay is a Telco-backed wallet. Merchants display an STC Pay QR and consumers scan with the STC Pay app. The payload links to the registered merchant account.

### 4. General Guidance

For any Saudi payment QR deployment, obtain the QR through the acquiring bank or payment service provider. Self-generated codes that mimic the payload format may not route correctly. Verify by scanning in the target app before going live.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Are Saudi payment QR codes based on EMV?',
        answer:
          'Yes. mada and other SAMA-regulated schemes follow the EMVCo merchant-presented QR framework.',
      },
      {
        question: 'Can a merchant generate their own mada QR?',
        answer:
          'No. The QR must be issued by a certified acquirer linked to the merchants registered account.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'japan-jpqr-payment-standard',
    'Japan JPQR: Unified Payment QR Standard and Merchant Adoption',
    'japan jpqr payment qr code',
    'How Japans JPQR initiative unifies multiple payment app QR codes into a single symbol for merchants.',
    'Business & Regional',
    '6 min read',
    '2026-09-20',
    `
### 1. The Problem JPQR Solves

Japan has many competing smartphone payment services, each with its own QR format. JPQR is an initiative coordinated by the Ministry of Internal Affairs and Communications to let a single QR code work across participating apps.

### 2. How It Works

A JPQR code encodes a URL that the participating payment app resolves to the correct merchant account on its network. One printed symbol works for customers using PayPay, LINE Pay, d払い, and other enrolled apps.

### 3. Merchant Registration

Merchants apply through their acquiring bank or JPQR-participating payment service provider. The resulting code is certified for use at the point of sale.

### 4. Limitations

Participation varies by app and region. Not every Japanese payment service supports JPQR. Check the current list of enrolled providers before promising full coverage to customers.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Does JPQR work with all Japanese payment apps?',
        answer:
          'Only participating apps. Coverage is broad but not universal. Check the enrolled provider list.',
      },
      {
        question: 'Is JPQR based on a standard protocol?',
        answer:
          'The payload uses a URL scheme that enrolled apps resolve. The underlying QR is a standard Model 2 symbol.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
  art(
    'qr-code-for-loyalty-programs',
    'QR Codes for Loyalty Programs: Earn, Redeem, and Stamp Card Designs',
    'qr code loyalty program',
    'Design a QR-based loyalty flow that earns points on scan without exposing member accounts.',
    'Business & Regional',
    '5 min read',
    '2026-09-21',
    `
### 1. Two Common Patterns

* **Customer shows code:** The member app or wallet displays a QR with the member ID. Staff or a fixed reader scans it to credit points.
* **Merchant code at point of sale:** The customer scans a static or session QR. The server links the scan to the signed-in member account and credits points.

### 2. Security

Member codes should include a rotating TOTP token or a signed timestamp so a screenshot of the code cannot be replayed indefinitely. Check code freshness on the server side.

### 3. Digital Stamp Cards

A simple version: each scan adds a stamp entry in a database; no NFC or app needed. The customer presents a phone number or email and the merchant scans a campaign QR. Track eligibility server-side.

### 4. App-less Entry

For small businesses, a campaign QR linking to a web form with the customer's email can substitute for a full loyalty app. Keep the form short and the reward clear.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [templates](/templates) collection offers ready-made layouts for common QR use cases.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Can a screenshot be used to cheat a loyalty QR?',
        answer:
          'Yes, if the code is static. Use a rotating token or sign the payload with a timestamp to prevent replay.',
      },
      {
        question: 'Do I need a mobile app for a QR loyalty program?',
        answer: 'No. A web-based flow with email or phone authentication can work without an app.',
      },
      {
        question: 'Can I put a logo in the middle of a QR code?',
        answer:
          'Yes, if you use a high error correction level and keep the logo small enough that it covers only the center data area. Never cover the three corner finder patterns, and test the result on several phones.',
      },
    ]
  ),
  art(
    'qr-code-for-metered-paywall',
    'QR Codes for Metered Paywalls and Subscriber Verification',
    'qr code subscriber verification',
    'Use QR codes to verify subscriptions at venues or gates without an internet check at the door.',
    'Business & Regional',
    '6 min read',
    '2026-09-22',
    `
### 1. Signed Token Pattern

Issue each subscriber a QR code containing a digitally signed token with member ID, expiry, and tier. The gate scanner verifies the signature using a shared public key without a live database call.

### 2. Expiry and Refresh

Short-lived tokens (24-hour or 7-day) limit the window for a stolen or shared code. Issue a refresh via the subscriber app on each login.

### 3. Revocation

Offline-verified tokens cannot be instantly revoked. For high-value access, require a short online check or fall back to online mode when connectivity is available.

### 4. Display in App

Show the QR on a screen that refreshes periodically, with a clear expiry indicator so subscribers do not present an expired code.
    

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
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [pet tag QR](/pet-tag-qr) page covers codes that help a finder reach the owner.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
`,
    [
      {
        question: 'How do I revoke access if a subscription is cancelled?',
        answer:
          'Online check mode revokes instantly. Offline signed tokens cannot be revoked until they expire, so use short expiry windows.',
      },
      {
        question: 'Can a subscriber share their QR code?',
        answer:
          'They can share a screenshot, but a rotating token limits its useful life. Biometric confirmation adds another layer.',
      },
      {
        question: 'Do payment QR codes expire?',
        answer:
          'Static payment codes stay valid until the account or merchant details change. Dynamic codes created for a single order can carry an expiry, so confirm with your provider whether a code is meant for one payment or repeated use.',
      },
    ]
  ),
];
