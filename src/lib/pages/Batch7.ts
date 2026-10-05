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
    `,
    [
      { question: 'Is the amount mandatory in a UPI QR?', answer: 'No. Omitting it creates a static code the customer fills in. Include it for specific invoices or order amounts.' },
      { question: 'What is a VPA?', answer: 'A Virtual Payment Address, also called a UPI ID, such as name@bank. It routes the payment to the correct account.' },
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
    `,
    [
      { question: 'What currency code does Raast use?', answer: '586 for the Pakistani rupee.' },
      { question: 'Is CRC16 required?', answer: 'Yes. Banking apps validate the checksum and will reject a code with an incorrect value.' },
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
    `,
    [
      { question: 'Can anyone generate a DuitNow QR code?', answer: 'Merchants must register through a participating bank. Self-generated payloads will not link to a verified account.' },
      { question: 'What currency code does DuitNow use?', answer: '458 for Malaysian ringgit.' },
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
    `,
    [
      { question: 'What currency code does NQR use?', answer: '566 for the Nigerian naira.' },
      { question: 'Can I generate an NQR code manually?', answer: 'No. NQR codes must be issued through a NIBSS-certified financial institution.' },
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
    `,
    [
      { question: 'What currency code does PayNow use?', answer: '702 for the Singapore dollar.' },
      { question: 'Can tourists pay with PayNow from their home banking app?', answer: 'Yes, under the ASEAN cross-border QR framework, if their bank participates.' },
    ]
  ),
  art(
    'kenya-mpesa-qr-code',
    'Kenya M-Pesa QR Codes: Merchant Payments and Lipa na M-Pesa',
    'mpesa qr code kenya',
    'How M-Pesa QR codes work for Kenyan merchants, including the Lipa na M-Pesa till and paybill flows.',
    'Business & Regional',
    '6 min read',
    '2026-09-18',
    `
### 1. Overview

M-Pesa is Safaricom's mobile money service, widely used in Kenya and other East African markets. The QR code standard encodes either a Lipa na M-Pesa (till number or paybill) or a personal phone number.

### 2. Payload Format

M-Pesa uses a proprietary payload format within a QR code or a structured link. The typical merchant flow encodes:
* Business name.
* Till number or paybill number.
* Optional account reference.
* Optional amount.

Safaricom provides a merchant portal and API to generate valid QR payloads. Do not construct payloads manually outside Safaricom's tools, as the format may change.

### 3. Consumer Experience

The customer scans with the M-Pesa app or the Safaricom app. The app pre-fills the merchant details; the customer enters the amount if not preset and confirms with their PIN.

### 4. Display Tips

Print the till number and paybill in plain text beside the code so customers who prefer to type can still pay.
    `,
    [
      { question: 'Can I scan an M-Pesa QR with a generic QR reader?', answer: 'The code is technically a standard QR, but the payload is processed only by M-Pesa-compatible apps.' },
      { question: 'Do I need to register to get a merchant QR?', answer: 'Yes. Register as a Lipa na M-Pesa merchant through Safaricom or your bank.' },
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
    `,
    [
      { question: 'Are Saudi payment QR codes based on EMV?', answer: 'Yes. mada and other SAMA-regulated schemes follow the EMVCo merchant-presented QR framework.' },
      { question: 'Can a merchant generate their own mada QR?', answer: 'No. The QR must be issued by a certified acquirer linked to the merchants registered account.' },
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
    `,
    [
      { question: 'Does JPQR work with all Japanese payment apps?', answer: 'Only participating apps. Coverage is broad but not universal. Check the enrolled provider list.' },
      { question: 'Is JPQR based on a standard protocol?', answer: 'The payload uses a URL scheme that enrolled apps resolve. The underlying QR is a standard Model 2 symbol.' },
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
    `,
    [
      { question: 'Can a screenshot be used to cheat a loyalty QR?', answer: 'Yes, if the code is static. Use a rotating token or sign the payload with a timestamp to prevent replay.' },
      { question: 'Do I need a mobile app for a QR loyalty program?', answer: 'No. A web-based flow with email or phone authentication can work without an app.' },
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
    `,
    [
      { question: 'How do I revoke access if a subscription is cancelled?', answer: 'Online check mode revokes instantly. Offline signed tokens cannot be revoked until they expire, so use short expiry windows.' },
      { question: 'Can a subscriber share their QR code?', answer: 'They can share a screenshot, but a rotating token limits its useful life. Biometric confirmation adds another layer.' },
    ]
  ),
];
