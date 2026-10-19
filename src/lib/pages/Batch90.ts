import type { Article } from '../articles';
import { art } from './helper';

export const batch90: Article[] = [
  art(
    'how-to-spot-quishing-attack',
    'How to Spot a Quishing Attack Before You Scan',
    'how to spot quishing attack',
    'Learn how to spot a quishing attack before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-08',
    `
### What is happening here

Quishing is phishing delivered through a QR code. Instead of a clickable link that email filters can inspect, the attacker hides the destination inside a QR image, and the victim supplies the missing step by scanning it with a phone.

Quishing usually arrives as an email, a message, or a printed notice urging quick action: verify an account, release a parcel, or confirm a payment. The QR image sits where a link would normally be, which lets it slip past link scanners that only read plain text.

### Red flags to check before you scan

- The message creates urgency: an account closure, a missed delivery, or a payment hold that needs action now.
- The sender is unfamiliar, or the message arrives outside any conversation you were already having.
- The notice asks you to scan rather than offering a typed web address you can check.
- The QR image is embedded in an email or PDF instead of appearing on an official page you navigated to yourself.
- The wording asks for sign-in, payment, or personal details right after the scan.

### Verify before you trust it

1. Pause and treat the message as unproven, however urgent it sounds.
2. Go to the organisation through an address you already trust, such as a bookmark or the official app, and check for the same alert there.
3. If the QR is printed on paper, look for signs it was added later, such as a sticker edge or a mismatch with the rest of the document.
4. Ask the sender through a separate, known channel whether they sent it before you scan.

### Putting this into practice

Build a habit you can use in seconds. Pause before every unexpected scan, read the destination preview, and check the domain against what you already know. If the code is printed in public, look for sticker edges and compare it with nearby signs. If the code arrived in a message, verify it through a separate channel you trust. The pause costs almost nothing, and it is the step that catches most of these scams.

### Common mistakes to avoid

The most common mistake is scanning to find out whether a code is safe. A scan that opens a page can already expose you to a fake login or a payment trap. Another mistake is trusting a familiar logo, since logos are easy to copy. A third is acting under urgency, which is exactly what the message is designed to create. Slow down, verify through a channel you control, and treat any request for credentials or payment as a reason to stop.

### Quick checklist

- Pause before you scan any unexpected code.
- Read the full destination preview, not just the first hop.
- Compare the domain with the official one you already know.
- Check printed codes for sticker edges and mismatched print.
- Never enter passwords, codes, or card details from a surprise scan.
- Verify through a separate, trusted channel before you act.

### Related tools and guides

- Run the destination through the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Inspect the code with the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Check the address with the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a quishing attack just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a quishing attack?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a quishing attack even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-quishing-attack',
    'What to Do If You Scanned a Quishing Attack',
    'what to do if you scanned quishing attack',
    'Scanned a quishing attack? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-09',
    `
### First, do not panic

Quishing is phishing delivered through a QR code. Instead of a clickable link that email filters can inspect, the attacker hides the destination inside a QR image, and the victim supplies the missing step by scanning it with a phone.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page at once if it asks for a password, payment, or code you did not expect to give.
2. Do not enter credentials, card details, or one-time codes on a page reached from an unexpected QR code.
3. If you typed a password, change it from a clean browser session and turn on two-factor authentication.
4. If you entered card details, contact your card issuer and ask them to watch the card or replace it.

### What to check next

- Check the accounts the page asked about for unfamiliar sign-ins, messages, or changes.
- Review recent sent messages and app permissions in case anything was approved during the scan.
- Keep the suspicious message or photo of the code so you can report it accurately.
- Tell the impersonated organisation through its official reporting channel so it can warn others.

### Reporting helps the next person

Reporting is not just paperwork. It helps the impersonated organisation warn other customers, helps platforms remove the fake page, and helps investigators connect one scam to others. Report promptly, and include the time, the place or message, and what you entered. You do not need to feel embarrassed about reporting. These scams are built to fool busy people, and a fast report protects everyone who comes after you.

### Putting this into practice

Work through the steps in order: contain, check, then report. Start with the highest-risk exposure first. If money is involved, the bank comes before everything else. If credentials are involved, change the password from a clean session and review active sessions and linked devices. Write down what happened while it is fresh, including the page address, the payee name, and the time, because those details make reports and disputes easier.

### Common mistakes to avoid

One mistake is trying to fix things by scanning the code again or following more links from the fake page. Another is assuming nothing happened because nothing looks wrong yet. A third is delaying the report out of embarrassment, which gives the attacker more time to use what was taken. Act on the exposure you had, not on whether you can see damage yet.

### Quick checklist

- Close the fake page and do not follow further links from it.
- Change any exposed password from a clean session.
- Review active sessions, linked devices, and recent activity.
- Contact your bank at once if money or card details were involved.
- Report the code to the impersonated organisation and the platform.
- Keep a written record of what happened and when.

### Related tools and guides

- Run the destination through the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Inspect the code with the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Check the address with the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Practise spotting patterns with the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a quishing attack. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a quishing attack?',
        answer:
          'Act at once, starting with the highest-risk exposure. If money or card details were involved, contact your bank first. If credentials were involved, change the password from a clean session and review active sessions. Fast action limits what an attacker can do with what was shared, even if nothing looks wrong yet.',
      },
      {
        question: 'Should I report it if I am not sure it was a scam?',
        answer:
          'Yes. Report what happened, what the page asked for, and what you entered, and let the organisation and the platform decide how to treat it. An uncertain report is still useful, because it can connect to other reports about the same code. Keep a written record of the time, the page address, and the details you shared.',
      },
    ]
  ),
  art(
    'how-to-spot-sticker-overlay-scam',
    'How to Spot a Sticker Overlay Scam Before You Scan',
    'how to spot sticker overlay scam',
    'Learn how to spot a sticker overlay scam before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-09',
    `
### What is happening here

A sticker overlay scam happens when someone places a fake QR sticker on top of a genuine printed code. The surface looks normal at a glance, but the scan goes to the attacker instead of the business or service named on the sign.

Overlays show up on parking meters, restaurant tables, posters, donation boxes, and any public sign where a QR code is printed in the open. The attacker only needs a printer and a few seconds alone with the sign.

### Red flags to check before you scan

- The QR area feels raised, glossy, or thicker than the surrounding print.
- The edges of the code peel slightly, or a corner lifts when you look closely.
- The code sits off-centre, covers nearby text, or overlaps a border or logo.
- The sign looks tampered with: bubbles, double layers, or a code that does not match the style of the rest of the sign.
- The destination preview, if you scan, names a domain you do not recognise.

### Verify before you trust it

1. Look at the code from an angle and run a fingertip lightly near its edge to feel for a second layer.
2. Compare the code with another identical sign nearby, if one exists, and note any difference.
3. Read the URL preview your camera shows before you tap through, and stop if the domain is unfamiliar.
4. Ask staff whether the code is theirs, and use a typed address or the official app instead when in doubt.

### Putting this into practice

Build a habit you can use in seconds. Pause before every unexpected scan, read the destination preview, and check the domain against what you already know. If the code is printed in public, look for sticker edges and compare it with nearby signs. If the code arrived in a message, verify it through a separate channel you trust. The pause costs almost nothing, and it is the step that catches most of these scams.

### Common mistakes to avoid

The most common mistake is scanning to find out whether a code is safe. A scan that opens a page can already expose you to a fake login or a payment trap. Another mistake is trusting a familiar logo, since logos are easy to copy. A third is acting under urgency, which is exactly what the message is designed to create. Slow down, verify through a channel you control, and treat any request for credentials or payment as a reason to stop.

### Quick checklist

- Pause before you scan any unexpected code.
- Read the full destination preview, not just the first hop.
- Compare the domain with the official one you already know.
- Check printed codes for sticker edges and mismatched print.
- Never enter passwords, codes, or card details from a surprise scan.
- Verify through a separate, trusted channel before you act.

### Related tools and guides

- Run the destination through the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Inspect the code with the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Check the address with the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a sticker overlay scam just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a sticker overlay scam?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a sticker overlay scam even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-sticker-overlay-scam',
    'What to Do If You Scanned a Sticker Overlay Scam',
    'what to do if you scanned sticker overlay scam',
    'Scanned a sticker overlay scam? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-09',
    `
### First, do not panic

A sticker overlay scam happens when someone places a fake QR sticker on top of a genuine printed code. The surface looks normal at a glance, but the scan goes to the attacker instead of the business or service named on the sign.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter any payment or personal details.
2. If you paid, contact your bank or card issuer and describe the payment and the location of the sign.
3. If you entered a password, change it from a clean session and enable two-factor authentication.
4. Photograph the overlay without touching it further, so the business can see exactly what was placed there.

### What to check next

- Check bank and account activity for anything you did not authorise after the scan.
- Tell the business or venue owner so they can remove the overlay and check other signs.
- Report the incident to the organisation named on the sign and to local police if money was taken.
- Keep the photo and the time and place of the scan for any report you file.

### Reporting helps the next person

Reporting is not just paperwork. It helps the impersonated organisation warn other customers, helps platforms remove the fake page, and helps investigators connect one scam to others. Report promptly, and include the time, the place or message, and what you entered. You do not need to feel embarrassed about reporting. These scams are built to fool busy people, and a fast report protects everyone who comes after you.

### Putting this into practice

Work through the steps in order: contain, check, then report. Start with the highest-risk exposure first. If money is involved, the bank comes before everything else. If credentials are involved, change the password from a clean session and review active sessions and linked devices. Write down what happened while it is fresh, including the page address, the payee name, and the time, because those details make reports and disputes easier.

### Common mistakes to avoid

One mistake is trying to fix things by scanning the code again or following more links from the fake page. Another is assuming nothing happened because nothing looks wrong yet. A third is delaying the report out of embarrassment, which gives the attacker more time to use what was taken. Act on the exposure you had, not on whether you can see damage yet.

### Quick checklist

- Close the fake page and do not follow further links from it.
- Change any exposed password from a clean session.
- Review active sessions, linked devices, and recent activity.
- Contact your bank at once if money or card details were involved.
- Report the code to the impersonated organisation and the platform.
- Keep a written record of what happened and when.

### Related tools and guides

- Run the destination through the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Inspect the code with the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Check the address with the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Practise spotting patterns with the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a sticker overlay scam. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a sticker overlay scam?',
        answer:
          'Act at once, starting with the highest-risk exposure. If money or card details were involved, contact your bank first. If credentials were involved, change the password from a clean session and review active sessions. Fast action limits what an attacker can do with what was shared, even if nothing looks wrong yet.',
      },
      {
        question: 'Should I report it if I am not sure it was a scam?',
        answer:
          'Yes. Report what happened, what the page asked for, and what you entered, and let the organisation and the platform decide how to treat it. An uncertain report is still useful, because it can connect to other reports about the same code. Keep a written record of the time, the page address, and the details you shared.',
      },
    ]
  ),
  art(
    'how-to-spot-fake-parking-ticket',
    'How to Spot a Fake Parking Ticket Before You Scan',
    'how to spot fake parking ticket',
    'Learn how to spot a fake parking ticket before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-10',
    `
### What is happening here

A fake parking ticket is a slip left on a windscreen, or a notice sent by message, that claims you owe a fine and points you to a QR code to pay. Real parking enforcement rarely depends on a windscreen QR code for payment, which is what makes this trick work.

The ticket looks official at a glance: a reference number, a vehicle description, a penalty amount, and a QR code for quick payment. The pressure is the point. A driver who is annoyed and in a hurry may pay before checking whether the ticket is real.

### Red flags to check before you scan

- There is no official issuing authority, badge number, or verifiable reference format on the slip.
- The payment page is reached only through the QR code, with no official website or phone number you can check independently.
- The wording threatens immediate towing, clamping, or a doubled fine if you do not pay within hours.
- The slip is flimsy, misaligned, or printed on plain paper that does not match other tickets in the area.
- The QR code is a sticker added to the slip rather than printed as part of it.

### Verify before you trust it

1. Do not scan the code to find out whether it is real. Treat the slip as unverified paper.
2. Check with the parking operator or council through contact details you find independently, not the ones on the slip.
3. Look for an official ticket machine, bay signage, or warden who can confirm whether a ticket was issued.
4. Compare the reference format with a genuine ticket or with the operator published appeal process.

### Putting this into practice

Build a habit you can use in seconds. Pause before every unexpected scan, read the destination preview, and check the domain against what you already know. If the code is printed in public, look for sticker edges and compare it with nearby signs. If the code arrived in a message, verify it through a separate channel you trust. The pause costs almost nothing, and it is the step that catches most of these scams.

### Common mistakes to avoid

The most common mistake is scanning to find out whether a code is safe. A scan that opens a page can already expose you to a fake login or a payment trap. Another mistake is trusting a familiar logo, since logos are easy to copy. A third is acting under urgency, which is exactly what the message is designed to create. Slow down, verify through a channel you control, and treat any request for credentials or payment as a reason to stop.

### Quick checklist

- Pause before you scan any unexpected code.
- Read the full destination preview, not just the first hop.
- Compare the domain with the official one you already know.
- Check printed codes for sticker edges and mismatched print.
- Never enter passwords, codes, or card details from a surprise scan.
- Verify through a separate, trusted channel before you act.

### Related tools and guides

- Run the destination through the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Inspect the code with the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Check the address with the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake parking ticket just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake parking ticket?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake parking ticket even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-parking-ticket',
    'What to Do If You Scanned a Fake Parking Ticket',
    'what to do if you scanned fake parking ticket',
    'Scanned a fake parking ticket? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-10',
    `
### First, do not panic

A fake parking ticket is a slip left on a windscreen, or a notice sent by message, that claims you owe a fine and points you to a QR code to pay. Real parking enforcement rarely depends on a windscreen QR code for payment, which is what makes this trick work.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the payment page at once and do not enter card details.
2. If you paid, contact your bank or card issuer and ask about disputing the payment.
3. If you entered account credentials, change the password from a clean session.
4. Keep the slip and a photo of where the vehicle was parked.

### What to check next

- Check the card statement for further charges and ask the issuer to block the merchant if one appears.
- Report the slip to the parking operator and to local police, including the location and time.
- If a fine later arrives through official channels, appeal it through the published process rather than the QR link.
- Warn nearby drivers if the same slips are appearing on other vehicles.

### Reporting helps the next person

Reporting is not just paperwork. It helps the impersonated organisation warn other customers, helps platforms remove the fake page, and helps investigators connect one scam to others. Report promptly, and include the time, the place or message, and what you entered. You do not need to feel embarrassed about reporting. These scams are built to fool busy people, and a fast report protects everyone who comes after you.

### Putting this into practice

Work through the steps in order: contain, check, then report. Start with the highest-risk exposure first. If money is involved, the bank comes before everything else. If credentials are involved, change the password from a clean session and review active sessions and linked devices. Write down what happened while it is fresh, including the page address, the payee name, and the time, because those details make reports and disputes easier.

### Common mistakes to avoid

One mistake is trying to fix things by scanning the code again or following more links from the fake page. Another is assuming nothing happened because nothing looks wrong yet. A third is delaying the report out of embarrassment, which gives the attacker more time to use what was taken. Act on the exposure you had, not on whether you can see damage yet.

### Quick checklist

- Close the fake page and do not follow further links from it.
- Change any exposed password from a clean session.
- Review active sessions, linked devices, and recent activity.
- Contact your bank at once if money or card details were involved.
- Report the code to the impersonated organisation and the platform.
- Keep a written record of what happened and when.

### Related tools and guides

- Run the destination through the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Inspect the code with the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Check the address with the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Practise spotting patterns with the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake parking ticket. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake parking ticket?',
        answer:
          'Act at once, starting with the highest-risk exposure. If money or card details were involved, contact your bank first. If credentials were involved, change the password from a clean session and review active sessions. Fast action limits what an attacker can do with what was shared, even if nothing looks wrong yet.',
      },
      {
        question: 'Should I report it if I am not sure it was a scam?',
        answer:
          'Yes. Report what happened, what the page asked for, and what you entered, and let the organisation and the platform decide how to treat it. An uncertain report is still useful, because it can connect to other reports about the same code. Keep a written record of the time, the page address, and the details you shared.',
      },
    ]
  ),
  art(
    'how-to-spot-fake-parcel-notice',
    'How to Spot a Fake Parcel Notice Before You Scan',
    'how to spot fake parcel notice',
    'Learn how to spot a fake parcel notice before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-10',
    `
### What is happening here

A fake parcel notice claims a delivery could not be completed and asks you to scan a QR code to reschedule, pay a redelivery fee, or confirm your address. Couriers do leave cards, but they do not usually demand payment through a QR code on a door tag.

These notices arrive as door tags, slips in the letterbox, texts, or emails. They borrow the look of a courier brand and lean on the fact that many people are genuinely waiting for a parcel.

### Red flags to check before you scan

- The notice gives no tracking number you recognise, or the number does not match anything you ordered.
- It asks for a small redelivery fee, customs charge, or address confirmation before releasing the parcel.
- The wording is vague about which courier, which parcel, and which address.
- The QR code is the only way to act. There is no depot address, phone number, or app you can check.
- The notice arrived when you are not expecting any delivery, or it names an item you never ordered.

### Verify before you trust it

1. Check the tracking number in the courier official app or site by typing the address yourself.
2. Look at your order history and messages from the retailer to see whether a delivery is actually on its way.
3. If a card was left at your door, check whether it matches the style of cards that courier normally leaves.
4. Do not scan the code to see where it goes. Verify the delivery through a channel you already trust.

### Putting this into practice

Build a habit you can use in seconds. Pause before every unexpected scan, read the destination preview, and check the domain against what you already know. If the code is printed in public, look for sticker edges and compare it with nearby signs. If the code arrived in a message, verify it through a separate channel you trust. The pause costs almost nothing, and it is the step that catches most of these scams.

### Common mistakes to avoid

The most common mistake is scanning to find out whether a code is safe. A scan that opens a page can already expose you to a fake login or a payment trap. Another mistake is trusting a familiar logo, since logos are easy to copy. A third is acting under urgency, which is exactly what the message is designed to create. Slow down, verify through a channel you control, and treat any request for credentials or payment as a reason to stop.

### Quick checklist

- Pause before you scan any unexpected code.
- Read the full destination preview, not just the first hop.
- Compare the domain with the official one you already know.
- Check printed codes for sticker edges and mismatched print.
- Never enter passwords, codes, or card details from a surprise scan.
- Verify through a separate, trusted channel before you act.

### Related tools and guides

- Run the destination through the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Inspect the code with the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Check the address with the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake parcel notice just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake parcel notice?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake parcel notice even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-parcel-notice',
    'What to Do If You Scanned a Fake Parcel Notice',
    'what to do if you scanned fake parcel notice',
    'Scanned a fake parcel notice? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-11',
    `
### First, do not panic

A fake parcel notice claims a delivery could not be completed and asks you to scan a QR code to reschedule, pay a redelivery fee, or confirm your address. Couriers do leave cards, but they do not usually demand payment through a QR code on a door tag.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter card, address, or account details.
2. If you paid a fee, contact your bank or card issuer about disputing it.
3. If you entered account credentials, change the password from a clean session and enable two-factor authentication.
4. Keep the notice, message, or screenshot for reporting.

### What to check next

- Check the accounts you entered for unfamiliar orders, address changes, or messages.
- Report the notice to the courier being impersonated through its official fraud channel.
- Report the message to your phone provider or anti-phishing service if it arrived by text or email.
- Tell neighbours if identical notices are circulating on your street.

### Reporting helps the next person

Reporting is not just paperwork. It helps the impersonated organisation warn other customers, helps platforms remove the fake page, and helps investigators connect one scam to others. Report promptly, and include the time, the place or message, and what you entered. You do not need to feel embarrassed about reporting. These scams are built to fool busy people, and a fast report protects everyone who comes after you.

### Putting this into practice

Work through the steps in order: contain, check, then report. Start with the highest-risk exposure first. If money is involved, the bank comes before everything else. If credentials are involved, change the password from a clean session and review active sessions and linked devices. Write down what happened while it is fresh, including the page address, the payee name, and the time, because those details make reports and disputes easier.

### Common mistakes to avoid

One mistake is trying to fix things by scanning the code again or following more links from the fake page. Another is assuming nothing happened because nothing looks wrong yet. A third is delaying the report out of embarrassment, which gives the attacker more time to use what was taken. Act on the exposure you had, not on whether you can see damage yet.

### Quick checklist

- Close the fake page and do not follow further links from it.
- Change any exposed password from a clean session.
- Review active sessions, linked devices, and recent activity.
- Contact your bank at once if money or card details were involved.
- Report the code to the impersonated organisation and the platform.
- Keep a written record of what happened and when.

### Related tools and guides

- Run the destination through the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Inspect the code with the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Check the address with the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Practise spotting patterns with the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake parcel notice. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake parcel notice?',
        answer:
          'Act at once, starting with the highest-risk exposure. If money or card details were involved, contact your bank first. If credentials were involved, change the password from a clean session and review active sessions. Fast action limits what an attacker can do with what was shared, even if nothing looks wrong yet.',
      },
      {
        question: 'Should I report it if I am not sure it was a scam?',
        answer:
          'Yes. Report what happened, what the page asked for, and what you entered, and let the organisation and the platform decide how to treat it. An uncertain report is still useful, because it can connect to other reports about the same code. Keep a written record of the time, the page address, and the details you shared.',
      },
    ]
  ),
  art(
    'how-to-spot-fake-invoice-qr',
    'How to Spot a Fake Invoice Qr Before You Scan',
    'how to spot fake invoice qr',
    'Learn how to spot a fake invoice QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-11',
    `
### What is happening here

A fake invoice QR code arrives inside a bill that looks like it came from a supplier, utility, or service you use. The invoice may carry your name and a plausible amount, but the QR code routes payment to someone else.

These invoices reach businesses and households by email or post. The attacker counts on accounts staff or a busy homeowner paying a familiar-looking bill without checking the payment destination.

### Red flags to check before you scan

- The invoice uses a new bank account, payment link, or QR destination that differs from your usual payment details for that supplier.
- The invoice pressures immediate payment, threatens service cut-off, or mentions a changed payment method.
- Line items, dates, or reference numbers do not match your records or your contract.
- The sender address, letterhead, or logo looks slightly off, or the layout differs from earlier invoices.
- The QR code is the only payment route offered, with no matching details in your supplier records.

### Verify before you trust it

1. Compare the invoice against your purchase order, contract, or previous invoices from the same supplier.
2. Call the supplier on a number you already have, not one printed on the invoice, and confirm the amount and payment details.
3. Check whether the payment destination matches the one you have on file before any money moves.
4. Ask a second person to review any invoice that changes payment instructions.

### Putting this into practice

Build a habit you can use in seconds. Pause before every unexpected scan, read the destination preview, and check the domain against what you already know. If the code is printed in public, look for sticker edges and compare it with nearby signs. If the code arrived in a message, verify it through a separate channel you trust. The pause costs almost nothing, and it is the step that catches most of these scams.

### Common mistakes to avoid

The most common mistake is scanning to find out whether a code is safe. A scan that opens a page can already expose you to a fake login or a payment trap. Another mistake is trusting a familiar logo, since logos are easy to copy. A third is acting under urgency, which is exactly what the message is designed to create. Slow down, verify through a channel you control, and treat any request for credentials or payment as a reason to stop.

### Quick checklist

- Pause before you scan any unexpected code.
- Read the full destination preview, not just the first hop.
- Compare the domain with the official one you already know.
- Check printed codes for sticker edges and mismatched print.
- Never enter passwords, codes, or card details from a surprise scan.
- Verify through a separate, trusted channel before you act.

### Related tools and guides

- Run the destination through the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Inspect the code with the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Check the address with the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake invoice QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake invoice QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake invoice QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-invoice-qr',
    'What to Do If You Scanned a Fake Invoice Qr',
    'what to do if you scanned fake invoice qr',
    'Scanned a fake invoice QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-11',
    `
### First, do not panic

A fake invoice QR code arrives inside a bill that looks like it came from a supplier, utility, or service you use. The invoice may carry your name and a plausible amount, but the QR code routes payment to someone else.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Stop the payment if it has not cleared, and contact your bank at once about recalling it.
2. Do not enter further credentials on any page the QR code opened.
3. If you entered account details, change the password from a clean session and alert your finance team.
4. Keep the invoice and the payment confirmation for the bank and any report.

### What to check next

- Reconcile recent payments to the same supplier and look for other invoices with altered details.
- Tell the supplier that its name is being used, so it can warn other customers.
- Report the invoice to your bank fraud team and to local police if money was sent.
- Record the new payment instructions so the same change is not accepted again without verification.

### Reporting helps the next person

Reporting is not just paperwork. It helps the impersonated organisation warn other customers, helps platforms remove the fake page, and helps investigators connect one scam to others. Report promptly, and include the time, the place or message, and what you entered. You do not need to feel embarrassed about reporting. These scams are built to fool busy people, and a fast report protects everyone who comes after you.

### Putting this into practice

Work through the steps in order: contain, check, then report. Start with the highest-risk exposure first. If money is involved, the bank comes before everything else. If credentials are involved, change the password from a clean session and review active sessions and linked devices. Write down what happened while it is fresh, including the page address, the payee name, and the time, because those details make reports and disputes easier.

### Common mistakes to avoid

One mistake is trying to fix things by scanning the code again or following more links from the fake page. Another is assuming nothing happened because nothing looks wrong yet. A third is delaying the report out of embarrassment, which gives the attacker more time to use what was taken. Act on the exposure you had, not on whether you can see damage yet.

### Quick checklist

- Close the fake page and do not follow further links from it.
- Change any exposed password from a clean session.
- Review active sessions, linked devices, and recent activity.
- Contact your bank at once if money or card details were involved.
- Report the code to the impersonated organisation and the platform.
- Keep a written record of what happened and when.

### Related tools and guides

- Run the destination through the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Inspect the code with the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Check the address with the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Practise spotting patterns with the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake invoice QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake invoice QR code?',
        answer:
          'Act at once, starting with the highest-risk exposure. If money or card details were involved, contact your bank first. If credentials were involved, change the password from a clean session and review active sessions. Fast action limits what an attacker can do with what was shared, even if nothing looks wrong yet.',
      },
      {
        question: 'Should I report it if I am not sure it was a scam?',
        answer:
          'Yes. Report what happened, what the page asked for, and what you entered, and let the organisation and the platform decide how to treat it. An uncertain report is still useful, because it can connect to other reports about the same code. Keep a written record of the time, the page address, and the details you shared.',
      },
    ]
  ),
];
