import type { Article } from '../articles';
import { art } from './helper';

export const batch99: Article[] = [
  art(
    'how-to-spot-fake-airdrop',
    'How to Spot a Fake Airdrop Before You Scan',
    'how to spot fake airdrop',
    'Learn how to spot a fake airdrop QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-04-07',
    `
### What is happening here

A fake airdrop QR code promises free tokens for connecting a wallet or completing a claim. The claim page may request a wallet approval that drains assets, or a seed phrase that hands over the wallet entirely.

Fake airdrops spread through social posts, messages, and fake project pages. They borrow the name of a real or plausible project and add a countdown to push fast action.

### Red flags to check before you scan

- The airdrop is not announced on the project official site or verified accounts.
- The claim page asks for a seed phrase, private key, or password.
- The approval request asks for broad or unlimited access to your wallet assets.
- The offer promises a large allocation for a trivial action.
- The QR code arrived in an unexpected message rather than through the project official channels.

### Verify before you trust it

1. Check the project official site and verified accounts for the airdrop.
2. Read every wallet approval line by line, and reject broad or unlimited permissions.
3. Never enter a seed phrase or private key on any page.
4. Use a separate wallet with no valuable assets for any unfamiliar site, if you test it at all.

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
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake airdrop QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake airdrop QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake airdrop QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-airdrop',
    'What to Do If You Scanned a Fake Airdrop',
    'what to do if you scanned fake airdrop',
    'Scanned a fake airdrop QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-04-08',
    `
### First, do not panic

A fake airdrop QR code promises free tokens for connecting a wallet or completing a claim. The claim page may request a wallet approval that drains assets, or a seed phrase that hands over the wallet entirely.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Disconnect the wallet from the site in your wallet settings at once.
2. Revoke the approval using your wallet token approval manager or a reputable revocation tool.
3. Move remaining assets to a fresh wallet if you approved broad permissions.
4. Do not approve further transactions from the same site.

### What to check next

- Check the wallet history for outgoing transfers you did not intend.
- Report the site to the project being impersonated and to your wallet provider.
- Warn the community channels where the code was shared.
- Keep the site address and approval details for the report.

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
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake airdrop QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake airdrop QR code?',
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
    'how-to-spot-fake-nft-mint',
    'How to Spot a Fake Nft Mint Before You Scan',
    'how to spot fake nft mint',
    'Learn how to spot a fake NFT mint QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-04-08',
    `
### What is happening here

A fake NFT mint QR code promises a limited collection, a guaranteed mint spot, or a free mint, and routes you to a page that requests a wallet approval that can drain tokens or NFTs.

Fake mints spread through social posts, messages, and fake project pages. They copy the art and branding of a real or plausible collection and add a countdown to push fast minting.

### Red flags to check before you scan

- The mint is not announced on the project official site or verified accounts.
- The page promises a guaranteed spot, a free mint, or a rare token for connecting quickly.
- The approval request asks for broad or unlimited access to your wallet assets.
- The domain does not match the project official site.
- The QR code arrived in an unexpected message rather than through the project official channels.

### Verify before you trust it

1. Check the project official site and verified accounts for the mint.
2. Read every wallet approval line by line, and reject broad or unlimited permissions.
3. Never enter a seed phrase or private key on any page.
4. Use a separate wallet with no valuable assets for any unfamiliar site, if you test it at all.

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
- Practise spotting patterns with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Review the chain with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Keep a record with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Plan protection with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake NFT mint QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake NFT mint QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake NFT mint QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-nft-mint',
    'What to Do If You Scanned a Fake Nft Mint',
    'what to do if you scanned fake nft mint',
    'Scanned a fake NFT mint QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-04-08',
    `
### First, do not panic

A fake NFT mint QR code promises a limited collection, a guaranteed mint spot, or a free mint, and routes you to a page that requests a wallet approval that can drain tokens or NFTs.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Disconnect the wallet from the site in your wallet settings at once.
2. Revoke the approval using your wallet token approval manager or a reputable revocation tool.
3. Move remaining assets to a fresh wallet if you approved broad permissions.
4. Do not approve further transactions from the same site.

### What to check next

- Check the wallet history for outgoing transfers you did not intend.
- Report the site to the project being impersonated and to your wallet provider.
- Warn the community channels where the code was shared.
- Keep the site address and approval details for the report.

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
- Review the chain with the [blog](/blog) before you trust a code you did not expect.
- Keep a record with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Plan protection with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Run the destination through the [UTM builder](/utm-builder) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake NFT mint QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake NFT mint QR code?',
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
    'how-to-spot-fake-government-notice',
    'How to Spot a Fake Government Notice Before You Scan',
    'how to spot fake government notice',
    'Learn how to spot a fake government notice QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '5 min read',
    '2027-04-09',
    `
### What is happening here

A fake government notice QR code claims a fine, a benefit, a licence issue, or a required action, and asks you to scan to respond. Government departments do send notices, but they do not usually demand action through a QR code in a surprise message.

Fake notices arrive by text, email, and post. They copy department names, logos, and reference formats, and they warn of fines or lost benefits to push fast action.

### Red flags to check before you scan

- The notice demands action through a QR code or link, with no matching message in the official portal.
- It threatens an immediate fine, loss of benefits, or legal action if you do not act within hours.
- It asks for bank details, card details, or a one-time code to confirm your identity.
- The sender address or domain does not belong to the department.
- The reference number, name, or address details do not match your records.

### Verify before you trust it

1. Check your account in the official portal by typing the address yourself.
2. Do not use the QR code or link in the notice to reach the department.
3. Call the department on a number from its official site, not from the notice.
4. Ask a trusted adviser if you are unsure whether the notice is genuine.

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
- Practise spotting patterns with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Review the chain with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Keep a record with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Plan protection with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake government notice QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake government notice QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question:
          'Should I report a fake government notice QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-government-notice',
    'What to Do If You Scanned a Fake Government Notice',
    'what to do if you scanned fake government notice',
    'Scanned a fake government notice QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '6 min read',
    '2027-04-09',
    `
### First, do not panic

A fake government notice QR code claims a fine, a benefit, a licence issue, or a required action, and asks you to scan to respond. Government departments do send notices, but they do not usually demand action through a QR code in a surprise message.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not enter bank, card, or account details.
2. If you entered bank details, contact your bank at once.
3. If you entered account credentials, change the password from a clean session.
4. Keep the notice for the report.

### What to check next

- Check your bank and government accounts for unfamiliar activity.
- Report the notice to the department through its official fraud or phishing channel.
- Report the message to your phone or email provider.
- Warn family members, since government notice scams often target many people at once.

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
- Review the chain with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Keep a record with the [blog](/blog) before you trust a code you did not expect.
- Plan protection with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Run the destination through the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
`,
    [
      {
        question:
          'I scanned a fake government notice QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake government notice QR code?',
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
    'how-to-spot-fake-census-qr',
    'How to Spot a Fake Census Qr Before You Scan',
    'how to spot fake census qr',
    'Learn how to spot a fake census QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '7 min read',
    '2027-04-09',
    `
### What is happening here

A fake census QR code arrives on a door hanger, letter, or message claiming you must complete a census form. Real census work is announced through official channels, and it never asks for bank details or passwords through a QR code.

Fake census notices appear on door hangers, in letterboxes, and in messages. They borrow official language and logos, and they ask for household details that can be used for identity fraud.

### Red flags to check before you scan

- The notice asks for bank details, passwords, or one-time codes to complete the census.
- The form asks for far more personal detail than a census needs, or asks for it from every household member at once.
- The sender, domain, or letterhead does not match the official statistics authority.
- The notice arrived outside a census period or with no official announcement you can verify.
- The QR code is the only route offered, with no official phone number or office you can check.

### Verify before you trust it

1. Check the official statistics authority site for the census dates and the official completion routes.
2. Do not use the QR code or link in the notice to reach the authority.
3. Call the authority on a number from its official site, not from the notice.
4. Check whether the notice matches the format the authority publishes.

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
- Practise spotting patterns with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Review the chain with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Keep a record with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
- Plan protection with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake census QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake census QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake census QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-census-qr',
    'What to Do If You Scanned a Fake Census Qr',
    'what to do if you scanned fake census qr',
    'Scanned a fake census QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '5 min read',
    '2027-04-10',
    `
### First, do not panic

A fake census QR code arrives on a door hanger, letter, or message claiming you must complete a census form. Real census work is announced through official channels, and it never asks for bank details or passwords through a QR code.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the form and do not submit bank, password, or identity details.
2. If you submitted identity documents or sensitive details, consider reporting identity exposure to the relevant authority.
3. If you entered account credentials, change the password from a clean session.
4. Keep the notice for the report.

### What to check next

- Check your accounts for unfamiliar activity.
- Report the notice to the statistics authority and to local police if identity details were shared.
- Warn neighbours if identical notices are circulating on your street.
- Keep a note of the address and time the notice arrived.

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
- Review the chain with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Keep a record with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Plan protection with the [blog](/blog) before you trust a code you did not expect.
- Run the destination through the [QR scanner](/qr-scanner) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake census QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake census QR code?',
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
    'how-to-spot-fake-voting-info',
    'How to Spot a Fake Voting Info Before You Scan',
    'how to spot fake voting info',
    'Learn how to spot a fake voting info QR code before you scan: the red flags, the verification steps, and the habits that keep you safe.',
    'Security & Scanning',
    '6 min read',
    '2027-04-10',
    `
### What is happening here

A fake voting info QR code claims to show your polling place, registration status, or ballot details, and routes you to a page that harvests personal data or spreads wrong election information. Voting information belongs in official election channels.

Fake voting notices appear on flyers, social posts, and messages near elections. They may look helpful, but the details they give can be wrong, and the forms they link to can harvest personal data.

### Red flags to check before you scan

- The notice gives polling details that do not match the official election authority information.
- It asks for passwords, bank details, or one-time codes to check your registration.
- The domain does not belong to the official election authority.
- The message pressures you to act now or claims your registration will be cancelled.
- The flyer or post cannot be traced to an official source.

### Verify before you trust it

1. Check your registration and polling place through the official election authority site by typing the address yourself.
2. Do not use the QR code or link in the notice to check your registration.
3. Compare the details with the official election information for your area.
4. Ask the election authority through its official contact channel if you are unsure.

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
- Practise spotting patterns with the [QR placement guide](/qr-placement-guide) before you trust a code you did not expect.
- Review the chain with the [QR safety checker](/qr-safety-checker) before you trust a code you did not expect.
- Keep a record with the [QR size calculator](/qr-size-calculator) before you trust a code you did not expect.
- Plan protection with the [bulk generator](/bulk-generator) before you trust a code you did not expect.
`,
    [
      {
        question: 'Can I scan a fake voting info QR code just to see where it goes?',
        answer:
          'No. Scanning to investigate is how the trap works. The page that opens can be a fake login or payment form, and opening it is already a step into the scam. Verify through a separate channel you trust, such as the organisation official app or site, instead of using the code to check itself.',
      },
      {
        question: 'What is the single most useful check for a fake voting info QR code?',
        answer:
          'Read the destination carefully before you open it, and compare it with the domain you already know. Most of these scams rely on you skipping that check. If the domain does not match, or if the code asks for credentials or payment you did not expect, stop and reach the organisation through an address you typed yourself.',
      },
      {
        question: 'Should I report a fake voting info QR code even if I did not enter anything?',
        answer:
          'Yes. A report helps the impersonated organisation warn others and helps platforms remove the fake page. Include the time, the place or message, and a photo or copy of the code if you can take one safely. Reporting a code you did not fall for is one of the most useful things you can do.',
      },
    ]
  ),
  art(
    'what-to-do-if-you-scanned-fake-voting-info',
    'What to Do If You Scanned a Fake Voting Info',
    'what to do if you scanned fake voting info',
    'Scanned a fake voting info QR code? Work through the containment steps, recovery checks, and reporting actions that limit the damage.',
    'Security & Scanning',
    '7 min read',
    '2027-04-10',
    `
### First, do not panic

A fake voting info QR code claims to show your polling place, registration status, or ballot details, and routes you to a page that harvests personal data or spreads wrong election information. Voting information belongs in official election channels.

If you already scanned, the next few minutes matter more than the scan itself. What you do now can limit the damage, and most of the steps below take only a few minutes each.

### Contain it right now

1. Close the page and do not submit passwords, bank details, or identity documents.
2. If you submitted sensitive details, consider reporting identity exposure to the relevant authority.
3. If you entered account credentials, change the password from a clean session.
4. Keep the notice for the report.

### What to check next

- Check your accounts for unfamiliar activity.
- Report the notice to the election authority and to the platform where you found it.
- Warn others in your area if the same notice is circulating.
- Use only official election channels for voting information.

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
- Review the chain with the [QR scanner](/qr-scanner) before you trust a code you did not expect.
- Keep a record with the [printed QR tester](/printed-qr-tester) before you trust a code you did not expect.
- Plan protection with the [UTM builder](/utm-builder) before you trust a code you did not expect.
- Run the destination through the [blog](/blog) before you trust a code you did not expect.
`,
    [
      {
        question: 'I scanned a fake voting info QR code. Does that mean my device is infected?',
        answer:
          'Scanning alone rarely infects a device, because the harm usually comes from what you enter or approve afterwards. The important question is what the page asked for and what you gave it. Work through the containment steps above for that exposure, and have the device checked if you installed anything the page suggested.',
      },
      {
        question: 'How quickly should I act after scanning a fake voting info QR code?',
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
