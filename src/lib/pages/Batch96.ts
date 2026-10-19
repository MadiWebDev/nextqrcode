import type { Article } from '../articles';
import { art } from './helper';

export const batch96: Article[] = [
  art(
    'how-to-spot-fake-bank-alert',
    'How to Spot a Fake Bank Alert Before You Scan',
    'how to spot fake bank alert',
    'Learn how to spot a fake bank alert before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-28',
    `
### What is happening here

A fake bank alert QR code claims suspicious activity on your account and asks you to scan to verify or unblock it. The page that opens is a copy of your bank login, built to capture credentials.

Bank alerts arrive by text, email, and message. Attackers know that a warning about your money gets attention fast, which is why this scam works.

### Red flags to check before you scan

- The alert claims urgent account activity but gives no detail you can verify without scanning.
- The message asks you to scan a QR code to verify, unlock, or secure the account.
- The sender address or number does not match your bank known contact details.
- The page asks for a password, one-time code, or card details after the scan.
- The wording threatens account closure within hours.

### Verify before you trust it

1. Do not scan the code. Open your banking app yourself, or call the bank on the number on your card.
2. Check recent transactions and alerts inside the official app.
3. Compare the sender details with the bank known contact channels.
4. Treat any alert that demands a QR scan as suspicious.

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
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake bank alert just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake bank alert?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake bank alert even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-bank-alert',
    'What to Do If You Scanned a Fake Bank Alert',
    'what to do if you scanned fake bank alert',
    'Scanned a fake bank alert? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-29',
    `
### First, do not panic

A fake bank alert QR code claims suspicious activity on your account and asks you to scan to verify or unblock it. The page that opens is a copy of your bank login, built to capture credentials.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter credentials, card details, or codes.
2. If you entered credentials, change the password from a clean session and enable two-factor authentication.
3. If you entered card details, contact your bank at once and ask for the card to be blocked.
4. Call your bank on its official number and describe what happened.

### What to check next

- Check your accounts for unfamiliar transactions and report them to the bank.
- Ask the bank to review recent sign-ins and to reset security settings if needed.
- Report the alert to the bank fraud team and to your phone or email provider.
- Keep the alert message for the report.

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
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake bank alert. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake bank alert?',
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
    'how-to-spot-fake-2fa-prompt',
    'How to Spot a Fake 2Fa Prompt Before You Scan',
    'how to spot fake 2fa prompt',
    'Learn how to spot a fake two-factor prompt before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-29',
    `
### What is happening here

A fake two-factor prompt uses a QR code to capture the one-time code or approval that protects your account. The attacker may already have your password, and the code is the last piece they need.

These prompts appear on fake login pages, in messages claiming an account review, and in calls or chats where someone asks you to read out or enter a code.

### Red flags to check before you scan

- The prompt asks for a code you did not request, or for approval of a sign-in you did not start.
- The page or caller pressures you to share the code immediately.
- The login page arrived from a QR code in an unexpected message.
- The request does not show clear details about the device, app, or location signing in.
- The message claims your account will be locked unless you confirm the code now.

### Verify before you trust it

1. Check your account security settings for pending sign-in requests before you approve anything.
2. Decline any approval or code request you did not initiate.
3. Sign in through the official app or site yourself, rather than through the code you were sent.
4. Never read a one-time code to a caller, however official they sound.

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

- Run the destination through the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Inspect the code with the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Check the address with the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake two-factor prompt just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake two-factor prompt?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake two-factor prompt even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-2fa-prompt',
    'What to Do If You Scanned a Fake 2Fa Prompt',
    'what to do if you scanned fake 2fa prompt',
    'Scanned a fake two-factor prompt? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-29',
    `
### First, do not panic

A fake two-factor prompt uses a QR code to capture the one-time code or approval that protects your account. The attacker may already have your password, and the code is the last piece they need.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Decline the request and close the page at once.
2. If you shared a code, change the password from a clean session and review active sessions.
3. Sign out of unfamiliar sessions and devices in your account settings.
4. Check the account for changes to recovery details, forwarding, or linked apps.

### What to check next

- Report the fake prompt to the service being impersonated.
- Tell your IT or security contact if the account is a work account.
- Warn anyone who received the same message.
- Keep a note of the time and the page address for the report.

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

- Run the destination through the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Inspect the code with the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Check the address with the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Practise spotting patterns with the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake two-factor prompt. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake two-factor prompt?',
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
    'how-to-spot-fake-software-update',
    'How to Spot a Fake Software Update Before You Scan',
    'how to spot fake software update',
    'Learn how to spot a fake software update before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-30',
    `
### What is happening here

A fake software update QR code promises a fix, a new version, or a security patch, and routes you to a download that is not the real update. Installing it can expose your device and your accounts.

Fake updates appear on pop-ups, flyers, messages, and scam pages that mimic a brand or a device maker. They exploit the sensible habit of keeping software up to date.

### Red flags to check before you scan

- The update arrives through a QR code on a flyer, message, or pop-up rather than your device own update system.
- The page promises a version, feature, or fix that the official site does not mention.
- The download comes from an unfamiliar domain or a file host, not the official store or maker site.
- The page pressures immediate installation and warns of dire consequences if you wait.
- The installer requests broad permissions or asks you to disable security settings.

### Verify before you trust it

1. Update through your device own settings or the official app store, not through a QR link.
2. Check the maker official site for the version and release notes.
3. Compare the download domain with the official domain before you download anything.
4. Decline any installer that asks you to disable security protections.

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

- Run the destination through the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Inspect the code with the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Check the address with the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake software update just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake software update?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake software update even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-software-update',
    'What to Do If You Scanned a Fake Software Update',
    'what to do if you scanned fake software update',
    'Scanned a fake software update? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-30',
    `
### First, do not panic

A fake software update QR code promises a fix, a new version, or a security patch, and routes you to a download that is not the real update. Installing it can expose your device and your accounts.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Do not install the file. If you already did, uninstall it and run a trusted security scan.
2. If you signed in during the install, change that password from a clean session.
3. If you entered card details, contact your card issuer.
4. Check the device for new apps, profiles, or settings you did not approve.

### What to check next

- Check your accounts for unfamiliar activity.
- Report the fake update page to the brand being impersonated.
- Report the message or flyer to the platform or venue where you found it.
- Keep a note of the download address for the report.

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

- Run the destination through the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Inspect the code with the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Check the address with the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Practise spotting patterns with the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake software update. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake software update?',
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
    'how-to-spot-fake-public-wifi-login',
    'How to Spot a Fake Public Wifi Login Before You Scan',
    'how to spot fake public wifi login',
    'Learn how to spot a fake public WiFi login before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-30',
    `
### What is happening here

A fake public WiFi login QR code joins you to a network that looks like the venue WiFi, then shows a login page that harvests credentials or payment details. The network itself may also expose your traffic.

Fake WiFi codes appear on table cards, reception signs, and flyers near cafes, libraries, and transport hubs. People expect a login page on public WiFi, which makes the fake one easy to accept.

### Red flags to check before you scan

- The QR code is a sticker on a sign rather than part of the venue printed materials.
- The login page asks for a password, social sign-in, or card details to use free WiFi.
- The network name is almost identical to the venue name, with a small spelling change.
- There are two similar networks and staff cannot confirm which one is theirs.
- The page looks generic, with no venue branding or with branding that does not match the venue.

### Verify before you trust it

1. Ask staff for the exact network name and confirm the spelling.
2. Compare the network name on your phone with the name on official venue materials.
3. Avoid signing in to sensitive accounts on a network you have not verified.
4. Use mobile data for banking, email, and work when the WiFi cannot be confirmed.

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

- Run the destination through the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Inspect the code with the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Check the address with the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake public WiFi login just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake public WiFi login?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake public WiFi login even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-public-wifi-login',
    'What to Do If You Scanned a Fake Public Wifi Login',
    'what to do if you scanned fake public wifi login',
    'Scanned a fake public WiFi login? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-31',
    `
### First, do not panic

A fake public WiFi login QR code joins you to a network that looks like the venue WiFi, then shows a login page that harvests credentials or payment details. The network itself may also expose your traffic.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Disconnect from the network and forget it in your WiFi settings.
2. Do not enter credentials or card details on the login page.
3. If you entered credentials, change them from a trusted connection and enable two-factor authentication.
4. If you entered card details, contact your card issuer.

### What to check next

- Check accounts you used on that network for unfamiliar activity.
- Tell the venue so it can check for rogue networks and fake signs.
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

- Run the destination through the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Inspect the code with the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Check the address with the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Practise spotting patterns with the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake public WiFi login. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake public WiFi login?',
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
    'how-to-spot-fake-hotel-wifi',
    'How to Spot a Fake Hotel Wifi Before You Scan',
    'how to spot fake hotel wifi',
    'Learn how to spot a fake hotel WiFi QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-31',
    `
### What is happening here

A fake hotel WiFi QR code copies the hotel network name and login page. Guests scan it expecting internet access and instead hand over credentials or payment details to a fake portal.

Hotel WiFi codes appear on desk cards, key packets, and lobby signs. Travellers are tired, in a hurry, and often connect before they have reason to doubt the network.

### Red flags to check before you scan

- The QR code is a sticker on the desk card or lobby sign rather than printed as part of it.
- The login page asks for card details or a social sign-in to access WiFi that was advertised as included.
- The network name is almost identical to the hotel name, with a small spelling change or an extra word.
- There are two similar networks and reception cannot confirm which one is the hotel own.
- The page branding does not match the hotel materials in the room.

### Verify before you trust it

1. Ask reception for the exact network name and confirm the spelling.
2. Compare the network name on your phone with the name on the hotel official materials.
3. Use the hotel official app or reception desk to confirm the login steps.
4. Avoid banking and sensitive accounts on a network you have not verified.

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

- Run the destination through the [QR phishing pattern trainer](/qr-phishing-pattern-trainer) before you trust a code you did not expect.
- Inspect the code with the [QR checksum generator](/qr-checksum-generator) before you trust a code you did not expect.
- Check the address with the [QR payload inspector](/qr-payload-inspector) before you trust a code you did not expect.
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake hotel WiFi QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake hotel WiFi QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake hotel WiFi QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-hotel-wifi',
    'What to Do If You Scanned a Fake Hotel Wifi',
    'what to do if you scanned fake hotel wifi',
    'Scanned a fake hotel WiFi QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-31',
    `
### First, do not panic

A fake hotel WiFi QR code copies the hotel network name and login page. Guests scan it expecting internet access and instead hand over credentials or payment details to a fake portal.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Disconnect from the network and forget it in your WiFi settings.
2. Do not enter credentials or card details on the fake login page.
3. If you entered credentials, change them from a trusted connection and enable two-factor authentication.
4. If you entered card details, contact your card issuer.

### What to check next

- Check accounts you used on that network for unfamiliar activity.
- Tell reception so the hotel can check for rogue networks and fake cards.
- Report the incident to the hotel and to local police if money or accounts were affected.
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

- Run the destination through the [QR offline verifier](/qr-offline-verifier) before you trust a code you did not expect.
- Inspect the code with the [QR batch validator](/qr-batch-validator) before you trust a code you did not expect.
- Check the address with the [QR allowlist builder](/qr-allowlist-builder) before you trust a code you did not expect.
- Practise spotting patterns with the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake hotel WiFi QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake hotel WiFi QR code?',
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
