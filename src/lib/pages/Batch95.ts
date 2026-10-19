import type { Article } from '../articles';
import { art } from './helper';

export const batch95: Article[] = [
  art(
    'how-to-spot-fake-atm-overlay',
    'How to Spot a Fake Atm Overlay Before You Scan',
    'how to spot fake atm overlay',
    'Learn how to spot a fake ATM overlay before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-25',
    `
### What is happening here

A fake ATM overlay involves a QR code placed on or near a cash machine that pretends to help you: verify your card, unlock the machine, or report a problem. The code leads to a page that harvests card or account details.

Overlays and fake instructions appear on machine surrounds, on nearby signs, and on slips left on the machine. Real ATMs do not ask you to scan a QR code to use them.

### Red flags to check before you scan

- A QR code is stuck to the machine, its surround, or a nearby sign.
- The sign claims the machine needs a QR scan to work, or asks you to verify your card first.
- The instructions look added later, with mismatched print or a sticker edge.
- The page asks for card numbers, PINs, or one-time codes.
- The machine itself behaves oddly, such as a loose card slot or an unusual attachment.

### Verify before you trust it

1. Do not scan any QR code on or near a cash machine.
2. Use a different machine if anything on the one in front of you looks tampered with.
3. Report the machine to the bank that operates it before you use it.
4. Never enter a PIN on a page reached from a QR code.

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

- Run the destination through the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Inspect the code with the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Check the address with the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake ATM overlay just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake ATM overlay?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake ATM overlay even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-atm-overlay',
    'What to Do If You Scanned a Fake Atm Overlay',
    'what to do if you scanned fake atm overlay',
    'Scanned a fake ATM overlay? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-25',
    `
### First, do not panic

A fake ATM overlay involves a QR code placed on or near a cash machine that pretends to help you: verify your card, unlock the machine, or report a problem. The code leads to a page that harvests card or account details.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Do not enter card, PIN, or account details on the page.
2. If you entered card details, contact your card issuer at once and ask for the card to be blocked.
3. If you entered account credentials, change the password from a clean session.
4. Leave the machine and report it to the bank.

### What to check next

- Check your bank statements for unfamiliar withdrawals or transactions.
- Report the overlay to the bank and to local police.
- Keep a photo of the machine and the QR code if it is safe to take one.
- Warn others not to use that machine until it has been checked.

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

- Run the destination through the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Inspect the code with the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Check the address with the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Practise spotting patterns with the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake ATM overlay. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake ATM overlay?',
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
    'how-to-spot-fake-delivery-locker',
    'How to Spot a Fake Delivery Locker Before You Scan',
    'how to spot fake delivery locker',
    'Learn how to spot a fake delivery locker QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-26',
    `
### What is happening here

A fake delivery locker QR code claims to open a locker, release a parcel, or confirm a pickup. The page behind it harvests account or payment details, while the parcel either does not exist or sits elsewhere.

Fake locker notices arrive by message, email, or on slips near locker banks. They borrow the look of a locker provider and rely on the recipient being eager to collect a parcel.

### Red flags to check before you scan

- The locker notice has no tracking number you recognise, or the number does not match your orders.
- The page asks for payment, a fee, or account sign-in to release the parcel.
- The domain does not belong to the locker provider named in the notice.
- The notice arrived when you are not expecting a parcel.
- The QR code is a sticker on the locker bank rather than part of the official screen or signage.

### Verify before you trust it

1. Check the tracking number in the locker provider official app or site by typing the address yourself.
2. Look at your order history to confirm a parcel is actually waiting.
3. Ask the locker provider through its official support channel whether the notice is genuine.
4. Do not scan a locker QR code from a message you did not expect.

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
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake delivery locker QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake delivery locker QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question:
          'Should I report a fake delivery locker QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-delivery-locker',
    'What to Do If You Scanned a Fake Delivery Locker',
    'what to do if you scanned fake delivery locker',
    'Scanned a fake delivery locker QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-26',
    `
### First, do not panic

A fake delivery locker QR code claims to open a locker, release a parcel, or confirm a pickup. The page behind it harvests account or payment details, while the parcel either does not exist or sits elsewhere.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter payment or account details.
2. If you paid, contact your bank or card issuer about disputing the payment.
3. If you entered account credentials, change the password from a clean session.
4. Keep the notice or message for the report.

### What to check next

- Check the accounts you entered for unfamiliar activity.
- Report the notice to the locker provider and to the retailer if one is named.
- Report the message to your phone or email provider if it arrived unsolicited.
- Keep a note of the locker location and the time.

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
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake delivery locker QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake delivery locker QR code?',
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
    'how-to-spot-fake-job-offer',
    'How to Spot a Fake Job Offer Before You Scan',
    'how to spot fake job offer',
    'Learn how to spot a fake job offer QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-26',
    `
### What is happening here

A fake job offer QR code promises quick hiring, flexible work, or a high wage, and routes you to a form or chat that harvests personal data or asks for upfront fees. Genuine employers do not hire through a random QR code and a fee.

Fake offers appear on flyers, social posts, messaging groups, and job boards. They often target people looking for part-time, remote, or entry-level work.

### Red flags to check before you scan

- The offer promises high pay for little work, with no interview or vetting.
- The recruiter asks for upfront fees, training payments, or equipment deposits.
- The application form asks for bank details, identity documents, or passwords early in the process.
- The company name is vague, misspelled, or cannot be verified through official records.
- The QR code leads to a chat on a personal account rather than a company careers page.

### Verify before you trust it

1. Search for the company and the role through official job boards and the company own site.
2. Check the company registration and contact details independently.
3. Treat any upfront fee as a warning sign and stop the process.
4. Ask for a written offer and a verifiable company contact before you share sensitive details.

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
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake job offer QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake job offer QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake job offer QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-job-offer',
    'What to Do If You Scanned a Fake Job Offer',
    'what to do if you scanned fake job offer',
    'Scanned a fake job offer QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-27',
    `
### First, do not panic

A fake job offer QR code promises quick hiring, flexible work, or a high wage, and routes you to a form or chat that harvests personal data or asks for upfront fees. Genuine employers do not hire through a random QR code and a fee.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Stop the application and do not send fees, documents, or bank details.
2. If you shared identity documents, consider reporting identity exposure to the relevant authority.
3. If you entered account credentials, change the password from a clean session.
4. If you paid a fee, contact your bank or payment provider about disputing it.

### What to check next

- Check your accounts for unfamiliar activity.
- Report the offer to the job platform or social network where you found it.
- Report the incident to local police if identity documents or money were involved.
- Keep the offer, messages, and payment details for the report.

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
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake job offer QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake job offer QR code?',
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
    'how-to-spot-fake-giveaway-qr',
    'How to Spot a Fake Giveaway Qr Before You Scan',
    'how to spot fake giveaway qr',
    'Learn how to spot a fake giveaway QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-27',
    `
### What is happening here

A fake giveaway QR code promises a prize, voucher, or free product, and the claim step is where the scam happens: a form that collects personal data, a payment for shipping, or a sign-in that steals credentials.

Giveaway codes appear on social posts, flyers, messages, and fake brand pages. The prize is the bait, and urgency keeps people from checking.

### Red flags to check before you scan

- The prize is generous and the entry effort is tiny.
- The claim page asks for payment, shipping fees, or card details to release a free prize.
- The giveaway is not listed on the brand official site or verified social account.
- The page asks for passwords, one-time codes, or identity documents to claim the prize.
- The message claims you already won a draw you never entered.

### Verify before you trust it

1. Check the brand official site or verified account for the giveaway.
2. Read the claim form before you fill it in, and stop if it asks for payment or credentials.
3. Treat a win you never entered as a scam.
4. Enter giveaways only through channels the brand itself publishes.

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
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake giveaway QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake giveaway QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake giveaway QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-giveaway-qr',
    'What to Do If You Scanned a Fake Giveaway Qr',
    'what to do if you scanned fake giveaway qr',
    'Scanned a fake giveaway QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-27',
    `
### First, do not panic

A fake giveaway QR code promises a prize, voucher, or free product, and the claim step is where the scam happens: a form that collects personal data, a payment for shipping, or a sign-in that steals credentials.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the claim page and do not submit payment or credentials.
2. If you entered a password, change it from a clean session and enable two-factor authentication.
3. If you paid, contact your bank or card issuer about disputing the payment.
4. Keep the giveaway message or page address for the report.

### What to check next

- Check the accounts you entered for unfamiliar activity.
- Report the giveaway to the impersonated brand.
- Report the post or message to the platform where you found it.
- Warn others who may have entered the same giveaway.

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
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake giveaway QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake giveaway QR code?',
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
    'how-to-spot-fake-tax-refund',
    'How to Spot a Fake Tax Refund Before You Scan',
    'how to spot fake tax refund',
    'Learn how to spot a fake tax refund QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-28',
    `
### What is happening here

A fake tax refund QR code claims you are owed money and asks you to scan to claim it. Tax authorities do not send surprise refund QR codes, and they do not ask you to confirm bank details through a scanned link.

Refund notices arrive by text, email, and post. They borrow official-looking language and logos, and they push you to act before the supposed refund expires.

### Red flags to check before you scan

- The notice claims a refund you were not expecting, with a precise-sounding amount.
- It asks you to confirm bank details, card details, or a one-time code through a QR link.
- The sender is a message or email address, not an official portal you already use.
- The wording threatens that the refund expires within hours.
- The domain does not belong to the tax authority.

### Verify before you trust it

1. Check your tax account through the official portal by typing the address yourself.
2. Do not use the link or QR code in the notice to reach the tax authority.
3. Check whether the tax authority has actually sent you a message in its official portal.
4. Ask a trusted adviser or the authority official helpline if you are unsure.

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
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake tax refund QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake tax refund QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake tax refund QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-tax-refund',
    'What to Do If You Scanned a Fake Tax Refund',
    'what to do if you scanned fake tax refund',
    'Scanned a fake tax refund QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-28',
    `
### First, do not panic

A fake tax refund QR code claims you are owed money and asks you to scan to claim it. Tax authorities do not send surprise refund QR codes, and they do not ask you to confirm bank details through a scanned link.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter bank, card, or account details.
2. If you entered bank details, contact your bank at once.
3. If you entered account credentials, change the password from a clean session.
4. Keep the notice for the report.

### What to check next

- Check your bank and tax accounts for unfamiliar activity.
- Report the notice to the tax authority through its official phishing report channel.
- Report the message to your phone or email provider.
- Warn family members, since refund scams often target many people at once.

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
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake tax refund QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake tax refund QR code?',
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
