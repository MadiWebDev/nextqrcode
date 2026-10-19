import type { Article } from '../articles';
import { art } from './helper';

export const batch92: Article[] = [
  art(
    'how-to-spot-wifi-evil-twin',
    'How to Spot a Wifi Evil Twin Before You Scan',
    'how to spot wifi evil twin',
    'Learn how to spot a WiFi evil twin before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-15',
    `
### What is happening here

A WiFi evil twin is a fake wireless network that copies the name of a real one. A QR code that joins you to WiFi can connect you to the fake network without you ever typing the network name, which makes the deception easy to miss.

Evil twins appear near cafes, hotels, airports, and conference venues, where people expect open or shared WiFi. The QR code may sit on a table card, a reception sign, or a flyer.

### Red flags to check before you scan

- The network name is almost identical to the real one, with a small spelling change or an extra word.
- There are two networks with nearly the same name, and staff cannot confirm which one is theirs.
- The QR code is a sticker added to a sign rather than printed as part of it.
- The network asks for a sign-in, personal details, or payment before giving access, when the venue offers free WiFi.
- The connection drops, behaves oddly, or shows security warnings after you join.

### Verify before you trust it

1. Ask staff for the exact network name and confirm the spelling before you connect.
2. Compare the network name shown by your phone with the name on official venue materials.
3. Avoid entering passwords, bank details, or sensitive accounts on a public network you have not verified.
4. Use mobile data for sensitive tasks when the WiFi cannot be confirmed.

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

- Run the destination through the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Inspect the code with the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Check the address with the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a WiFi evil twin just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a WiFi evil twin?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a WiFi evil twin even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-wifi-evil-twin',
    'What to Do If You Scanned a Wifi Evil Twin',
    'what to do if you scanned wifi evil twin',
    'Scanned a WiFi evil twin? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-15',
    `
### First, do not panic

A WiFi evil twin is a fake wireless network that copies the name of a real one. A QR code that joins you to WiFi can connect you to the fake network without you ever typing the network name, which makes the deception easy to miss.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Disconnect from the network at once and forget it in your WiFi settings.
2. Do not sign in to bank, email, or work accounts on the suspect network.
3. If you entered credentials, change them from a trusted connection and enable two-factor authentication.
4. If you entered card details, contact your card issuer.

### What to check next

- Check accounts you used on that network for unfamiliar activity.
- Tell the venue so it can check for rogue access points and fake signs.
- Report the incident to the venue and to local police if money or accounts were affected.
- Keep a note of the fake network name and the time you connected.

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

- Run the destination through the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Inspect the code with the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Check the address with the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Practise spotting patterns with the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a WiFi evil twin. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a WiFi evil twin?',
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
    'how-to-spot-payment-qr-swap',
    'How to Spot a Payment Qr Swap Before You Scan',
    'how to spot payment qr swap',
    'Learn how to spot a payment QR swap before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-16',
    `
### What is happening here

A payment QR swap happens when a merchant real QR code is covered or replaced with one that sends money to someone else. The customer believes they paid the shop, the shop never receives the money, and the attacker walks away with the payment.

Swaps target market stalls, cafes, donation boxes, and any counter where a printed payment code sits in the open. The attacker only needs a printed sticker and a short moment alone.

### Red flags to check before you scan

- The payment code is a sticker placed over the original print, with raised or peeling edges.
- The payee name shown in your payment app does not match the business name.
- The amount or account details look different from what the seller quoted.
- The code sits on a loose card that can be picked up and swapped, rather than fixed signage.
- Staff cannot confirm the code, or the code does not match one shown elsewhere in the shop.

### Verify before you trust it

1. Read the payee name and details in your payment app before you confirm the payment.
2. Ask the seller to confirm the payee name out loud before you send money.
3. Compare the code with another display in the shop, or with the code in the business official app.
4. Stop the payment if the payee name does not match the business.

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

- Run the destination through the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Inspect the code with the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Check the address with the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a payment QR swap just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a payment QR swap?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a payment QR swap even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-payment-qr-swap',
    'What to Do If You Scanned a Payment Qr Swap',
    'what to do if you scanned payment qr swap',
    'Scanned a payment QR swap? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-16',
    `
### First, do not panic

A payment QR swap happens when a merchant real QR code is covered or replaced with one that sends money to someone else. The customer believes they paid the shop, the shop never receives the money, and the attacker walks away with the payment.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Contact your bank or payment provider at once and ask about reversing or disputing the payment.
2. Do not send a second payment to the same code.
3. Keep the payment confirmation, including the payee name, amount, and time.
4. Tell the merchant immediately so they can check their code and warn other customers.

### What to check next

- Check your payment app for further unexpected transactions.
- Report the swapped code to the merchant and to local police if money was lost.
- If you entered credentials on a page the code opened, change the password from a clean session.
- Keep photos of the swapped code for the report.

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

- Run the destination through the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Inspect the code with the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Check the address with the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Practise spotting patterns with the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a payment QR swap. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a payment QR swap?',
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
    'how-to-spot-clipboard-hijack',
    'How to Spot a Clipboard Hijack Before You Scan',
    'how to spot clipboard hijack',
    'Learn how to spot a clipboard hijack before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-16',
    `
### What is happening here

A clipboard hijack happens when a page you reach from a QR code replaces something you copied, such as a wallet address or payment reference, with an attacker address. You paste what you think you copied and send money or data to the wrong place.

This pattern targets people copying long addresses or reference numbers. The page may ask you to copy a value, then silently substitute its own when you paste it elsewhere.

### Red flags to check before you scan

- A page asks you to copy an address, code, or reference and then paste it into another app.
- The pasted value looks different from the one you copied, even by a few characters.
- The page keeps focus, refreshes, or asks you to copy again after you already copied.
- The destination app shows a recipient or reference you do not recognise.
- The page came from a QR code you did not verify before scanning.

### Verify before you trust it

1. Before you confirm any paste, compare the pasted value with the original character by character.
2. Check the first and last characters of long addresses, and a few in the middle, rather than trusting the shape.
3. If the pasted value differs, delete it and re-copy from the original source.
4. Do not confirm a payment when the recipient does not match what you expected.

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
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a clipboard hijack just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a clipboard hijack?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a clipboard hijack even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-clipboard-hijack',
    'What to Do If You Scanned a Clipboard Hijack',
    'what to do if you scanned clipboard hijack',
    'Scanned a clipboard hijack? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-17',
    `
### First, do not panic

A clipboard hijack happens when a page you reach from a QR code replaces something you copied, such as a wallet address or payment reference, with an attacker address. You paste what you think you copied and send money or data to the wrong place.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Stop the transfer if it has not been sent, and contact your bank or provider if it has.
2. Do not paste the value again from the same page.
3. If you entered credentials on the page, change the password from a clean session.
4. Close the page and clear the clipboard if your device offers that option.

### What to check next

- Check the transaction history for any transfer you did not intend.
- Report the page to the service being impersonated.
- Warn anyone who may have used the same code or page.
- Keep a note of the copied and pasted values for the report.

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
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a clipboard hijack. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a clipboard hijack?',
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
    'how-to-spot-fake-app-download',
    'How to Spot a Fake App Download Before You Scan',
    'how to spot fake app download',
    'Learn how to spot a fake app download before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-17',
    `
### What is happening here

A fake app download uses a QR code to push you toward an unofficial copy of an app, or a lookalike with a similar name and icon. Installing it can expose your data, show aggressive ads, or request permissions the real app would never need.

These codes appear on flyers, in messages, on social posts, and on fake support pages. They promise a faster install, a free premium version, or a version the official store supposedly removed.

### Red flags to check before you scan

- The code points to a download outside the official app store, or to a store page for an app with a slightly different name.
- The listing has few reviews, a new publisher, or a publisher name that does not match the brand.
- The page promises free premium features, unlocked content, or a version the store removed.
- The app requests broad permissions, such as contacts, messages, or accessibility, that the task does not need.
- The QR code arrived in an unexpected message rather than on the brand official site or materials.

### Verify before you trust it

1. Search for the app in your official app store instead of following the QR link.
2. Check the publisher name, review history, and linked website on the store listing.
3. Compare the app icon and name with the brand official site.
4. Decline downloads from unknown sites, even if the page looks professional.

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
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake app download just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake app download?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake app download even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-app-download',
    'What to Do If You Scanned a Fake App Download',
    'what to do if you scanned fake app download',
    'Scanned a fake app download? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-17',
    `
### First, do not panic

A fake app download uses a QR code to push you toward an unofficial copy of an app, or a lookalike with a similar name and icon. Installing it can expose your data, show aggressive ads, or request permissions the real app would never need.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Do not install the app. If you already did, uninstall it at once.
2. Review the permissions the app was granted and revoke anything broad or unnecessary.
3. If you signed in to the app, change that password from a clean session and enable two-factor authentication.
4. If you entered card details, contact your card issuer.

### What to check next

- Check your accounts for unfamiliar activity and your device for unexpected apps or profiles.
- Report the fake listing to the app store or the brand being impersonated.
- Tell anyone who may have scanned the same code.
- Keep a note of the download link for the report.

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
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake app download. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake app download?',
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
    'how-to-spot-fake-survey-qr',
    'How to Spot a Fake Survey Qr Before You Scan',
    'how to spot fake survey qr',
    'Learn how to spot a fake survey QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-18',
    `
### What is happening here

A fake survey QR code promises a reward, discount, or prize draw in exchange for a few questions. The survey itself is the harvest: each answer adds personal detail that can be used for further scams or account attacks.

These codes appear on receipts, flyers, social posts, and in messages. The reward is the bait, and the survey questions grow more personal as you go.

### Red flags to check before you scan

- The reward sounds generous for a short survey, such as a large gift card for a few taps.
- The survey asks for personal details a feedback form would not need: full date of birth, address, account numbers, or passwords.
- The survey is hosted on an unfamiliar domain rather than the brand official site.
- The code appears on a flyer or message with no verifiable link to the brand it names.
- The survey pushes you toward a payment, shipping fee, or sign-in to claim the reward.

### Verify before you trust it

1. Check whether the brand is actually running the survey by visiting its official site or social account.
2. Read the questions before answering, and stop if they move from feedback to personal data.
3. Never enter passwords, card details, or one-time codes to claim a survey reward.
4. Treat any survey that demands payment to release a prize as a scam.

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
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake survey QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake survey QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake survey QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-survey-qr',
    'What to Do If You Scanned a Fake Survey Qr',
    'what to do if you scanned fake survey qr',
    'Scanned a fake survey QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-18',
    `
### First, do not panic

A fake survey QR code promises a reward, discount, or prize draw in exchange for a few questions. The survey itself is the harvest: each answer adds personal detail that can be used for further scams or account attacks.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the survey and do not submit further answers.
2. If you entered account credentials, change the password from a clean session.
3. If you entered card details, contact your card issuer.
4. If you entered personal details, watch for follow-up scam messages and consider reporting it.

### What to check next

- Check the accounts you mentioned in the survey for unfamiliar activity.
- Report the survey to the brand being impersonated.
- Report the message or flyer to the platform or venue where you found it.
- Keep a screenshot or photo for the report.

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
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake survey QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake survey QR code?',
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
