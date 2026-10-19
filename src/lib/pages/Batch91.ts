import type { Article } from '../articles';
import { art } from './helper';

export const batch91: Article[] = [
  art(
    'how-to-spot-malicious-redirect',
    'How to Spot a Malicious Redirect Before You Scan',
    'how to spot malicious redirect',
    'Learn how to spot a malicious redirect before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-12',
    `
### What is happening here

A malicious redirect is a QR code that sends you through one or more hops before landing somewhere harmful. The first destination can look innocent, which is why checking only the first link is not enough.

Redirects are normal on the web, and that is what makes them useful to attackers. A code can point to a short link, a tracking service, or a compromised page, and each hop can change where you end up.

### Red flags to check before you scan

- The QR destination is a short link, tracking link, or redirect service that hides the final page.
- The page you land on does not match what the sign, message, or code promised.
- The browser address changes several times in a row before the page settles.
- The final page asks for sign-in or payment even though the code promised information or a menu.
- The domain of the final page is unrelated to the organisation named on the sign.

### Verify before you trust it

1. Use a redirect chain viewer or a link expander to see each hop before you open the final page.
2. Read the full final address, not just the first hop, and compare it with the expected domain.
3. If the chain passes through unfamiliar domains, stop and reach the destination by typing the official address.
4. Treat a code that bounces through unrelated sites as untrusted, even if the last page looks polished.

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
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a malicious redirect just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a malicious redirect?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a malicious redirect even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-malicious-redirect',
    'What to Do If You Scanned a Malicious Redirect',
    'what to do if you scanned malicious redirect',
    'Scanned a malicious redirect? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-12',
    `
### First, do not panic

A malicious redirect is a QR code that sends you through one or more hops before landing somewhere harmful. The first destination can look innocent, which is why checking only the first link is not enough.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter credentials, card details, or codes.
2. If you entered a password, change it from a clean session and enable two-factor authentication.
3. If you entered card details, contact your card issuer and ask about blocking further charges.
4. Clear the browser tab and avoid pressing back through the redirect chain.

### What to check next

- Check the accounts the page asked about for unfamiliar sign-ins or changes.
- Report the code to the business or publisher whose name was used.
- Keep the original QR image or a note of the first link, so the chain can be investigated.
- Warn anyone else who may have scanned the same code.

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
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a malicious redirect. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a malicious redirect?',
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
    'how-to-spot-typosquat-domain',
    'How to Spot a Typosquat Domain Before You Scan',
    'how to spot typosquat domain',
    'Learn how to spot a typosquat domain before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-12',
    `
### What is happening here

A typosquat domain is a web address that looks almost identical to a real brand, with one letter swapped, added, missing, or replaced by a lookalike character. A QR code makes this harder to catch, because you never type the address yourself.

Typosquat codes appear on fake signs, in messages, and in ads that mimic a known brand. The page may copy the brand colours and layout, so the only clue is the address itself.

### Red flags to check before you scan

- The domain has a small spelling change: a swapped letter, a doubled letter, a missing letter, or a hyphen that does not belong.
- The domain uses a different ending than the brand normally uses, or adds an extra word such as support, secure, or verify.
- Characters look slightly odd, such as a zero in place of the letter O, or a lookalike character from another alphabet.
- The page asks you to sign in or pay before showing any content that proves it is the real brand.
- The QR code appears in a context the real brand would not use, such as a random flyer or an unexpected message.

### Verify before you trust it

1. Read the domain character by character in the URL preview before you open it.
2. Compare it with the domain you have bookmarked or the one printed on the brand official materials.
3. Use a typosquat checker to compare the domain against common typo variants.
4. Type the brand address yourself instead of following the code when anything looks off.

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
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a typosquat domain just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a typosquat domain?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a typosquat domain even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-typosquat-domain',
    'What to Do If You Scanned a Typosquat Domain',
    'what to do if you scanned typosquat domain',
    'Scanned a typosquat domain? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-13',
    `
### First, do not panic

A typosquat domain is a web address that looks almost identical to a real brand, with one letter swapped, added, missing, or replaced by a lookalike character. A QR code makes this harder to catch, because you never type the address yourself.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter credentials, card details, or verification codes.
2. If you signed in, change the password from a clean session and enable two-factor authentication.
3. If you paid, contact your bank or card issuer about disputing the payment.
4. Keep a note of the lookalike domain for your report.

### What to check next

- Check the real account for unfamiliar sign-ins, orders, or settings changes.
- Report the lookalike domain to the impersonated brand through its official channel.
- Report the domain to your browser or registrar abuse channel if one is offered.
- Warn colleagues or family who may have seen the same code.

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
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a typosquat domain. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a typosquat domain?',
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
    'how-to-spot-url-shortener-abuse',
    'How to Spot a Url Shortener Abuse Before You Scan',
    'how to spot url shortener abuse',
    'Learn how to spot URL shortener abuse before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-03-13',
    `
### What is happening here

URL shortener abuse happens when a QR code points to a shortened link that hides where you will actually end up. Short links are common and often harmless, but they remove the one check that matters most: seeing the destination before you open it.

Shortened links appear on posters, in messages, in social posts, and on printed materials where a long address would be awkward. Attackers use the same services because the short link looks tidy and gives nothing away.

### Red flags to check before you scan

- The QR destination is a short link with no hint of the final domain.
- The code promises a well-known brand but the short link gives no brand signal at all.
- The message or sign pressures you to scan now, leaving no time to check.
- The short link sits in an unexpected message, flyer, or email rather than on official materials.
- The page you reach after the redirect does not match what was promised.

### Verify before you trust it

1. Expand the short link with a redirect chain viewer before you open it.
2. Read the final domain carefully and compare it with the brand you expect.
3. If the final domain is unfamiliar or unrelated, stop and reach the brand by typing its address.
4. Prefer codes on official materials, where the printed destination can be checked against the brand.

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
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan URL shortener abuse just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for URL shortener abuse?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report URL shortener abuse even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-url-shortener-abuse',
    'What to Do If You Scanned a Url Shortener Abuse',
    'what to do if you scanned url shortener abuse',
    'Scanned URL shortener abuse? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-03-13',
    `
### First, do not panic

URL shortener abuse happens when a QR code points to a shortened link that hides where you will actually end up. Short links are common and often harmless, but they remove the one check that matters most: seeing the destination before you open it.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter credentials, card details, or codes.
2. If you signed in, change the password from a clean session and enable two-factor authentication.
3. If you paid, contact your bank or card issuer about disputing the payment.
4. Do not follow further links from the page you reached.

### What to check next

- Check the accounts the page asked about for unfamiliar activity.
- Report the short link and the QR code to the brand being impersonated.
- Report the message to your phone or email provider if it arrived unsolicited.
- Keep a note of the short link for any report you file.

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
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned URL shortener abuse. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning URL shortener abuse?',
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
    'how-to-spot-open-redirect',
    'How to Spot a Open Redirect Before You Scan',
    'how to spot open redirect',
    'Learn how to spot an open redirect before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-03-14',
    `
### What is happening here

An open redirect is a real, trusted website that forwards visitors to an address supplied in the link. Attackers abuse this by building a QR code whose first hop is a trusted domain, while the final hop is a fake login or payment page.

The trick works because the preview shows a domain people recognise. The dangerous part is buried in the parameters after the domain, where most scanners never look.

### Red flags to check before you scan

- The QR destination is a long address on a trusted domain with a redirect, next, return, or URL parameter.
- The parameter points to an unrelated or unfamiliar domain.
- The final page asks for sign-in or payment even though the code promised something routine.
- The message or sign leans on the trusted brand name while the real destination is different.
- The address contains several nested links or encoded text that hides the final hop.

### Verify before you trust it

1. Inspect the full address, including the parameters after the question mark, before you open it.
2. Look at where the redirect parameter points and compare that domain with the brand you expect.
3. Use a redirect chain viewer to list each hop in plain form.
4. Reach the brand by typing its address yourself if the redirect target looks wrong.

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
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan an open redirect just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for an open redirect?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report an open redirect even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-open-redirect',
    'What to Do If You Scanned a Open Redirect',
    'what to do if you scanned open redirect',
    'Scanned an open redirect? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-03-14',
    `
### First, do not panic

An open redirect is a real, trusted website that forwards visitors to an address supplied in the link. Attackers abuse this by building a QR code whose first hop is a trusted domain, while the final hop is a fake login or payment page.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter credentials, card details, or codes.
2. If you signed in, change the password from a clean session and enable two-factor authentication.
3. If you paid, contact your bank or card issuer about disputing the payment.
4. Do not trust the page just because the first domain looked familiar.

### What to check next

- Check the real account for unfamiliar sign-ins or changes.
- Report the abused redirect to the site owner through its official security contact.
- Keep a copy of the full QR destination for the report.
- Warn anyone who may have scanned the same code.

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
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned an open redirect. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning an open redirect?',
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
    'how-to-spot-session-hijack-via-qr',
    'How to Spot a Session Hijack Via Qr Before You Scan',
    'how to spot session hijack via qr',
    'Learn how to spot session hijacking through a QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-03-14',
    `
### What is happening here

Session hijacking through a QR code happens when a code tricks you into approving a sign-in or linking a device that hands control of your account to someone else. The page may look like a normal login or device-pairing screen.

This pattern appears in fake login pages, fake device-linking flows, and messages that ask you to scan to approve access. The danger is not the scan itself but the approval you are asked to give afterwards.

### Red flags to check before you scan

- The code asks you to sign in or approve a session you did not start.
- The page asks for a code, password, or approval while you are already signed in elsewhere.
- The request arrives unexpectedly, with no action of yours that would need approval.
- The page shows vague details about the device, location, or app requesting access.
- The message pressures you to approve now or lose access.

### Verify before you trust it

1. Stop and check your account for pending sign-in requests in the official app or security settings.
2. Confirm whether you started a sign-in or pairing flow before you approve anything.
3. Read the device and session details shown in your account, not only on the page the code opened.
4. Decline any approval you did not initiate, and sign in through a channel you trust.

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

- Run the destination through the [QR expiry checker](/qr-expiry-checker) before you trust a code you did not expect.
- Inspect the code with the [QR print proof checklist](/qr-print-proof-checklist) before you trust a code you did not expect.
- Check the address with the [QR redirect chain viewer](/qr-redirect-chain-viewer) before you trust a code you did not expect.
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan session hijacking through a QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for session hijacking through a QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question:
          'Should I report session hijacking through a QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-session-hijack-via-qr',
    'What to Do If You Scanned a Session Hijack Via Qr',
    'what to do if you scanned session hijack via qr',
    'Scanned session hijacking through a QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-03-15',
    `
### First, do not panic

Session hijacking through a QR code happens when a code tricks you into approving a sign-in or linking a device that hands control of your account to someone else. The page may look like a normal login or device-pairing screen.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Open your account security settings and sign out of unfamiliar sessions and devices.
2. Change the password from a clean session and enable two-factor authentication.
3. Review connected apps and linked devices, and remove anything you do not recognise.
4. If the account controls money or email, check recent activity and alert the provider.

### What to check next

- Check for password changes, forwarding rules, or new recovery details you did not set.
- Report the code and the page to the service being impersonated.
- Tell your IT or security contact if the account is a work account.
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

- Run the destination through the [QR scan log](/qr-scan-log) before you trust a code you did not expect.
- Inspect the code with the [QR typosquat checker](/qr-typosquat-checker) before you trust a code you did not expect.
- Check the address with the [QR tamper evidence planner](/qr-tamper-evidence-planner) before you trust a code you did not expect.
- Practise spotting patterns with the [QR consent note builder](/qr-consent-note-builder) before you trust a code you did not expect.
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question:
          'I scanned session hijacking through a QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning session hijacking through a QR code?',
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
