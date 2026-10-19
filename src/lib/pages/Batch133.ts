import type { Article } from '../articles';
import { art } from './helper';

export const batch133: Article[] = [
  art(
    'why-your-qr-code-asks-for-a-login',
    'Why Your QR Code Asks For A Login and How to Fix It',
    'why your qr code asks for a login',
    'Diagnose a code that asks for a login: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-07-30',
    `
### What you are seeing

The code scans, but instead of the expected page the visitor meets a login screen. A login prompt usually means the destination requires authentication, or the link points at a private version of the page rather than the public one. Sometimes the link is correct and the page genuinely needs a login, in which case the code is working and the expectation is wrong. The fix starts by deciding which of those is true, because a private page and a wrong link need opposite repairs.

### Likely causes

1. **Link points at a private or draft page** — A link copied from an editing view, a preview, or a members-only area carries its access requirement with it. Test: open the URL in a private window while signed out.
2. **Page access settings changed** — A page that was public can become restricted when permissions change, a membership rule is added, or a document is moved to a private folder. Test: check the page access settings and recent changes.
3. **Redirect sends visitors to a login** — A redirect rule can send public visitors to a login page when the target page is restricted or the rule is misconfigured. Test: follow the redirect chain and note where the login appears.
4. **Login is genuinely required** — Some destinations, such as an account page or a members area, legitimately require a login. Test: confirm with the page owner whether the code is meant for signed-in users only.
5. **Shared or expired session link** — A link that carries a session, a token, or a one-time view can demand a fresh login from anyone else. Test: check whether the URL contains a session or token parameter.

### Step-by-step fix

1. Open the destination in a private window while signed out and confirm the login appears.
2. Decide whether the page is meant to be public or restricted.
3. If it should be public, fix the page access settings or point the code at the public version.
4. If a redirect causes the login, fix the redirect rule.
5. If the login is intended, add a clear note beside the code so visitors know before they scan.
6. Retest the journey while signed out on two phones.

### Putting this into practice

In practice, the login surprise comes from copying a link while signed in. The link works for the person who copied it and demands a login from everyone else. Always test a new code in a private window while signed out, because that is the state your visitors are in. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Printing a shared password beside the code to work around a login that should not be there.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that asks for a login will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that asks for a login.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The destination behaves correctly while signed out
- The code points at the public version where the page is public
- Any required login is explained beside the code
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code ask for a login?',
        answer:
          'The destination requires authentication, or the link points at a private, draft, or session-specific version of the page. Open the URL in a private window while signed out to confirm. If the page should be public, fix the access settings or the link; if the login is intended, tell visitors before they scan.',
      },
      {
        question: 'Can a QR code bypass a login?',
        answer:
          'No, and it should not try. A code that promises a public page but lands on a login is a broken promise, not a shortcut. Fix the link or the page access so the journey matches what the code advertises.',
      },
      {
        question: 'Why does the link work for me but ask others to log in?',
        answer:
          'Because you are signed in. A link copied from an editing view, a preview, or a private area works for you and demands a login from everyone else. Test every new code in a private window while signed out to see what visitors actually get.',
      },
    ]
  ),
  art(
    'asks-for-a-login-step-by-step-fix',
    'Asks For A Login: Step-by-Step Fix',
    'asks for a login step by step fix',
    'Repair a code that asks for a login with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-07-30',
    `
### What you are seeing

This fix decides whether the login is intended or a mistake, then repairs the link or the page access. You will test the destination while signed out, check who the page is meant for, and make the public journey work without a login where the code promises a public page. Never paper over a login with a shared password printed beside the code.

### Likely causes

1. **Link points at a private or draft page** — Quick test: open the URL in a private window while signed out.
2. **Page access settings changed** — Quick test: check the page access settings and recent changes.
3. **Redirect sends visitors to a login** — Quick test: follow the redirect chain and note where the login appears.
4. **Login is genuinely required** — Quick test: confirm with the page owner whether the code is meant for signed-in users only.
5. **Shared or expired session link** — Quick test: check whether the URL contains a session or token parameter.

### Step-by-step fix

Step 1: Open the destination in a private window while signed out and confirm the login prompt.
Step 2: Decide with the page owner whether the page is meant to be public or restricted.
Step 3: If it should be public, fix the access settings or replace the link with the public address.
Step 4: If a redirect sends visitors to a login, fix the redirect rule so it reaches the intended page.
Step 5: If the link carries a session or token, replace it with a clean public link and regenerate the code.
Step 6: If the login is intended, add a clear note beside the code explaining that a login is required.
Step 7: Retest while signed out on two phones and confirm the journey matches the promise beside the code.

### Putting this into practice

In practice, keep public codes and private codes in separate records, and never print a private link on a public poster. A public code that asks for a login wastes every scan it receives. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Printing a shared password beside the code to work around a login that should not be there.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that asks for a login will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that asks for a login.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The destination behaves correctly while signed out
- The code points at the public version where the page is public
- Any required login is explained beside the code
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code that asks for a login?',
        answer:
          'Test the destination while signed out, then decide whether the page should be public. Fix the access settings, the redirect, or the link so the public journey works. If the login is intended, explain it beside the code. Retest while signed out on two phones.',
      },
      {
        question: 'What if the page must stay private?',
        answer:
          'Then the code is for a restricted audience, and the material beside it should say so and name the account visitors need. Do not print a private code in a public place, and do not print a shared password beside it.',
      },
      {
        question: 'How do I avoid copying a private link into a QR code?',
        answer:
          'Always copy the public address, never a preview, editing, or session link. Test the new code in a private window while signed out before printing. That one check catches the private-link mistake every time.',
      },
    ]
  ),
  art(
    'why-your-qr-code-downloads-a-file-instead-of-opening-a-page',
    'Why Your QR Code Downloads A File Instead Of Opening A Page and How to Fix It',
    'why your qr code downloads a file instead of opening a page',
    'Diagnose a code that downloads a file instead of opening a page: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-07-30',
    `
### What you are seeing

The code scans, but instead of opening a web page the phone starts downloading a file. The visitor expected a page and got a download prompt, which feels wrong and often gets cancelled. The cause is usually the destination: the link points straight at a file, the server serves the file as a download, or the page address is actually a file address. The fix is to decide what the visitor should get, a page or a file, and to make the link and the server behaviour match that promise.

### Likely causes

1. **Link points straight at a file** — A link to a document or media file, rather than to a page that contains it, triggers a download in many phone browsers. Test: open the URL in a browser and see whether it downloads.
2. **Server sends a download header** — A server can be configured to send a file as a download even when a browser could display it. Test: check how the same file behaves when opened from a plain link on a web page.
3. **File type the phone cannot display** — Some file types have no in-browser viewer on a phone, so the phone falls back to downloading them. Test: try the file on a second phone or in a different browser.
4. **Wrong link copied** — A download link copied from a file manager or a sharing dialogue can replace the intended page link. Test: compare the encoded URL with the intended page address.
5. **Redirect lands on a file** — A redirect rule or shortener can send visitors to a file instead of the page. Test: follow the redirect chain and note where it ends.

### Step-by-step fix

1. Decode the payload and write down the exact URL it contains.
2. Open that URL in a phone browser and confirm the download behaviour.
3. Decide whether the visitor should get a page or a file.
4. If a page is intended, point the code at the page that contains or describes the file.
5. If a download is intended, keep the file link and say so beside the code.
6. Retest the journey on two phones and confirm it matches the promise.

### Putting this into practice

In practice, the surprise is the problem more than the download itself. Visitors who expect a page and get a download feel tricked, while visitors who were told to expect a file accept it. Match the link to the promise, and put the promise in words beside the code. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Linking a code straight at a file while the poster promises a web page.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that downloads a file instead of opening a page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that downloads a file instead of opening a page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code delivers what the material beside it promises
- A page link opens a page and a file link is labelled as a download
- The journey passes on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR expiry checker](/qr-expiry-checker)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR payload inspector](/qr-payload-inspector)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [PDF QR code generator](/pdf-qr-code-generator)
`,
    [
      {
        question: 'Why does my QR code download a file instead of opening a page?',
        answer:
          'The link points straight at a file, the server serves it as a download, or a redirect lands on a file instead of a page. Decode the payload and open the URL to confirm. Point the code at the page if a page is intended, or label the download if a file is intended.',
      },
      {
        question: 'Is it wrong for a QR code to download a file?',
        answer:
          'Not if visitors were told to expect it. A code on a handout that says scan to download the guide is fine. A code on a poster that promises a web page but triggers a download feels wrong. Match the link to the promise beside the code.',
      },
      {
        question: 'Can I make a file open in the browser instead of downloading?',
        answer:
          'Sometimes. Linking to a viewer page, or serving the file so the browser can display it, keeps visitors in the browser. Whether that works depends on the file type and the phone. Test the exact file on two phones before you promise a browser view.',
      },
    ]
  ),
  art(
    'downloads-a-file-instead-of-opening-a-page-step-by-step-fix',
    'Downloads A File Instead Of Opening A Page: Step-by-Step Fix',
    'downloads a file instead of opening a page step by step fix',
    'Repair a code that downloads a file instead of opening a page with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-07-31',
    `
### What you are seeing

This fix makes the code deliver what the material beside it promises. You will check what the link points at, how the server serves it, and what the visitor sees, then change the link or the serving behaviour. If a download is intended, say so beside the code so visitors are not surprised.

### Likely causes

1. **Link points straight at a file** — Quick test: open the URL in a browser and see whether it downloads.
2. **Server sends a download header** — Quick test: check how the same file behaves when opened from a plain link on a page.
3. **File type the phone cannot display** — Quick test: try the file on a second phone or in a different browser.
4. **Wrong link copied** — Quick test: compare the encoded URL with the intended page address.
5. **Redirect lands on a file** — Quick test: follow the redirect chain and note where it ends.

### Step-by-step fix

Step 1: Decode the payload and write down the exact URL it contains.
Step 2: Open that URL in a phone browser and confirm whether it downloads or displays.
Step 3: Decide whether the visitor should get a page or a file, and check what the material beside the code promises.
Step 4: If a page is intended, replace the link with the page address and regenerate the code.
Step 5: If a download is intended, confirm the file type is one phones can open, and add a note beside the code that it downloads a file.
Step 6: If the server forces a download where a display was intended, change the serving behaviour or link to a viewer page.
Step 7: Retest the journey on two phones and confirm it delivers what the material promises.

### Putting this into practice

In practice, prefer linking to a page that describes the file and offers the download as a choice. That gives visitors context, a chance to confirm, and a way back, instead of a bare download prompt from a code they just scanned. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Linking a code straight at a file while the poster promises a web page.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that downloads a file instead of opening a page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that downloads a file instead of opening a page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code delivers what the material beside it promises
- A page link opens a page and a file link is labelled as a download
- The journey passes on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR expiry checker](/qr-expiry-checker)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR payload inspector](/qr-payload-inspector)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [PDF QR code generator](/pdf-qr-code-generator)
`,
    [
      {
        question: 'How do I fix a QR code that downloads a file instead of opening a page?',
        answer:
          'Decode the payload, open the URL, and decide whether a page or a file is intended. Replace the link with the page address if a page is intended, or label the download if a file is intended. Retest on two phones.',
      },
      {
        question: 'Should QR codes link to files directly?',
        answer:
          'Prefer linking to a page that describes the file and offers the download as a choice. Direct file links skip the context and can surprise visitors with a download prompt. A page link is the safer default for public codes.',
      },
      {
        question: 'What if the download is intended but visitors cancel it?',
        answer:
          'Make the promise explicit beside the code: name the file and say it will download. Visitors who know what is coming are far more likely to accept the download than visitors who were surprised by it.',
      },
    ]
  ),
  art(
    'why-your-qr-code-triggers-an-app-store-page',
    'Why Your QR Code Triggers An App Store Page and How to Fix It',
    'why your qr code triggers an app store page',
    'Diagnose a code that triggers an app store page: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-07-31',
    `
### What you are seeing

The code scans, but instead of the expected page the visitor lands on an app store listing. The code may encode a store link, the destination may redirect to a store page, or the site may push app visitors toward the store automatically. Sometimes the store page is exactly what was intended, and the code is working. The fix starts by deciding whether the store page is the promise or a detour, because those two cases need opposite repairs.

### Likely causes

1. **Code encodes a store link** — The payload itself points at an app store listing rather than at the intended page. Test: decode the payload and read the URL.
2. **Site redirects mobile visitors to the store** — A site rule that pushes app-capable visitors toward the store can hijack a QR journey that was meant to reach a page. Test: open the destination on a desktop and on a phone and compare.
3. **Smart banner or app prompt intercepts the visit** — A banner or script that promotes the app can push visitors to the store before they see the page. Test: watch whether the page appears briefly before the store page takes over.
4. **Shortener or campaign link targets the store** — A short link or campaign redirect can point at the store listing instead of the page. Test: follow the redirect chain from the encoded URL.
5. **Store page is genuinely the destination** — Some codes are meant to send visitors to an app listing, such as a download-an-app poster. Test: check what the material beside the code promises.

### Step-by-step fix

1. Decode the payload and write down the exact URL it contains.
2. Open the destination on a desktop and on a phone and compare the journeys.
3. Follow the redirect chain and note where the store page enters.
4. If the store page is not intended, fix the link, the redirect, or the site rule that causes it.
5. If the store page is intended, make the promise explicit beside the code.
6. Retest the journey on two phones and confirm it matches the promise.

### Putting this into practice

In practice, the store detour usually comes from a site rule that made sense for general visitors but breaks the QR journey. A QR visitor has already chosen to visit a specific page, so pushing them to the store feels like a bait-and-switch. Exempt the QR destination from the app push, or send the code straight to the page. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Testing a QR destination only on a desktop and missing the mobile rule that diverts visitors to the store.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that triggers an app store page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that triggers an app store page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The journey reaches the promised page on a phone
- No site rule diverts QR visitors to the store
- Any intended store destination is explained beside the code
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [app store QR code generator](/app-store-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'Why does my QR code open the app store instead of the page?',
        answer:
          'The code may encode a store link, a redirect may target the store, or the site may push mobile visitors toward the app. Decode the payload, follow the redirect chain, and compare the phone and desktop journeys to find where the store page enters.',
      },
      {
        question: 'Is it wrong for a QR code to open the app store?',
        answer:
          'Not if that is what the material promises. A code that says scan to download the app should open the store. A code that promises a page but lands on the store is a broken promise. Match the destination to the promise beside the code.',
      },
      {
        question: 'Can a website force QR visitors to the app store?',
        answer:
          'A site rule or banner can divert mobile visitors to the store, even when the QR code points at a page. Exempt the QR destination from the app push, or fix the rule, so QR visitors reach the page they were promised.',
      },
    ]
  ),
  art(
    'triggers-an-app-store-page-step-by-step-fix',
    'Triggers An App Store Page: Step-by-Step Fix',
    'triggers an app store page step by step fix',
    'Repair a code that triggers an app store page with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-07-31',
    `
### What you are seeing

This fix traces the journey from scan to store page and removes the detour where the store page is not intended. You will check the payload, the redirects, and the site behaviour, then repair the link or the site rule. If the store page is intended, make that promise explicit beside the code.

### Likely causes

1. **Code encodes a store link** — Quick test: decode the payload and read the URL.
2. **Site redirects mobile visitors to the store** — Quick test: open the destination on a desktop and on a phone and compare.
3. **Smart banner or app prompt intercepts the visit** — Quick test: watch whether the page appears briefly before the store page takes over.
4. **Shortener or campaign link targets the store** — Quick test: follow the redirect chain from the encoded URL.
5. **Store page is genuinely the destination** — Quick test: check what the material beside the code promises.

### Step-by-step fix

Step 1: Decode the payload and write down the exact URL it contains.
Step 2: Open the URL on a desktop and on a phone. Note whether the phone journey diverges to the store.
Step 3: Follow the redirect chain and note the hop where the store page appears.
Step 4: If the payload is a store link and a page was intended, regenerate the code from the page address.
Step 5: If a site rule or banner pushes visitors to the store, fix the rule or remove the intercept for the QR destination.
Step 6: If the store page is intended, add a clear note beside the code that scanning opens the app store page.
Step 7: Retest the journey on two phones and confirm it matches the promise beside the code.

### Putting this into practice

In practice, test every QR destination on a real phone, not just on a desktop. Desktop tests miss the mobile-only rules and banners that divert phone visitors to the store. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Testing a QR destination only on a desktop and missing the mobile rule that diverts visitors to the store.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that triggers an app store page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that triggers an app store page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The journey reaches the promised page on a phone
- No site rule diverts QR visitors to the store
- Any intended store destination is explained beside the code
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [app store QR code generator](/app-store-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'How do I stop a QR code opening the app store?',
        answer:
          'Decode the payload, follow the redirect chain, and find where the store page enters. Fix the link, the redirect, or the site rule that diverts visitors. Retest on a phone to confirm the journey reaches the promised page.',
      },
      {
        question: 'What if the app store page is the intended destination?',
        answer:
          'Then keep it, but make the promise explicit beside the code so visitors know scanning opens the store page. A visitor who expects a page and gets a store listing feels misled, while a visitor who expects the store is happy to land there.',
      },
      {
        question: 'How do I test for a store detour?',
        answer:
          'Open the destination on a phone, not just on a desktop, and watch the full journey from scan to final page. Mobile-only rules and banners only appear on the phone journey, so a desktop test cannot catch them.',
      },
    ]
  ),
  art(
    'why-your-qr-code-shows-the-wrong-language',
    'Why Your QR Code Shows The Wrong Language and How to Fix It',
    'why your qr code shows the wrong language',
    'Diagnose a code that shows the wrong language: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-01',
    `
### What you are seeing

The code scans, but the page appears in the wrong language: a different language from the one the material beside the code uses, or from the language the visitor expects. Language selection usually comes from the link, the site settings, or the visitor's browser, and a QR code can carry a link that pins the wrong language. The fix is to find which layer chose the language and to make the code carry the right one.

### Likely causes

1. **Link points at the wrong language version** — A link copied from a page in one language carries that language with it, even when the code is printed beside text in another language. Test: compare the encoded URL with the address of the correct language version.
2. **Site picks language from the visitor browser** — A site that auto-detects language from the browser can serve a language the visitor did not expect, especially on a shared or borrowed phone. Test: open the same URL in a browser set to the expected language.
3. **Redirect drops the language part of the address** — A redirect can strip the language segment from the address and land visitors on the default language. Test: follow the redirect chain and watch the language segment.
4. **Language switcher not stored for QR visitors** — A visitor who picks a language on the site may lose the choice if the site stores it in a way that does not survive the QR journey. Test: pick the language on the site, then follow the QR journey again.
5. **Content not translated for that page** — The page itself may exist only in one language, so every visitor sees that language regardless of the link. Test: check whether a translated version of the page exists.

### Step-by-step fix

1. Decode the payload and write down the exact URL it contains.
2. Open the correct language version of the page and copy its exact address.
3. Compare the two addresses and note where the language part differs.
4. Follow the redirect chain and check that it preserves the language segment.
5. Point the code at the correct language address and regenerate it if needed.
6. Retest on two phones, including one with a different browser language.

### Putting this into practice

In practice, the wrong-language mistake comes from copying a link while viewing the page in the wrong language. The link quietly carries that language into every printed copy. Copy links from the language version the code will serve, and check the proof in that language before printing. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Copying a link while viewing the page in the wrong language and printing it beside text in another language.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows the wrong language will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows the wrong language.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The encoded URL points at the intended language version
- Redirects preserve the language segment
- The page appears in the intended language on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code open the page in the wrong language?',
        answer:
          'The link may point at the wrong language version, a redirect may drop the language segment, or the site may pick a language from the visitor browser. Decode the payload, compare it with the correct language address, and follow the redirect chain to find where the language changes.',
      },
      {
        question: 'Can a QR code force a page language?',
        answer:
          'It can point at the address of the language version you want, which is the reliable way to set the language for QR visitors. Whether the site keeps that language depends on its redirect and language rules, so test the full journey and fix any rule that overrides the choice.',
      },
      {
        question:
          'Why does the page show the right language for me but the wrong one for visitors?',
        answer:
          'Your browser language, your stored preference, or your signed-in profile may be choosing the language for you. Visitors with different settings get a different result. Test in a private window and on a phone with a different browser language to see what visitors actually get.',
      },
    ]
  ),
  art(
    'shows-the-wrong-language-step-by-step-fix',
    'Shows The Wrong Language: Step-by-Step Fix',
    'shows the wrong language step by step fix',
    'Repair a code that shows the wrong language with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-01',
    `
### What you are seeing

This fix traces the language choice from the code to the page and pins the correct language. You will check the encoded URL, the site language settings, and the browser behaviour, then repair whichever layer chose wrong. Test with the language your audience actually uses, not just with your own browser defaults.

### Likely causes

1. **Link points at the wrong language version** — Quick test: compare the encoded URL with the address of the correct language version.
2. **Site picks language from the visitor browser** — Quick test: open the same URL in a browser set to the expected language.
3. **Redirect drops the language part of the address** — Quick test: follow the redirect chain and watch the language segment.
4. **Language switcher not stored for QR visitors** — Quick test: pick the language on the site, then follow the QR journey again.
5. **Content not translated for that page** — Quick test: check whether a translated version of the page exists.

### Step-by-step fix

Step 1: Decode the payload and write down the exact URL it contains.
Step 2: Open the correct language version of the page and copy its exact address.
Step 3: Compare the two addresses and note where the language segment differs or is missing.
Step 4: Follow the redirect chain and confirm it preserves the language segment all the way to the final page.
Step 5: Fix the redirect or the site language rule if it drops or overrides the language.
Step 6: Regenerate the code from the correct language address if the payload was wrong.
Step 7: Retest on two phones, including one with a different browser language, and confirm the page appears in the intended language.

### Putting this into practice

In practice, keep one proof per language version when a code is printed beside translated material. A proof in the wrong language is easy to miss if you only check that the page loads. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Copying a link while viewing the page in the wrong language and printing it beside text in another language.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows the wrong language will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows the wrong language.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The encoded URL points at the intended language version
- Redirects preserve the language segment
- The page appears in the intended language on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code that shows the wrong language?',
        answer:
          'Decode the payload, copy the address of the correct language version, and compare them. Fix the redirect if it drops the language segment, and regenerate the code from the correct address if the payload was wrong. Retest on two phones with different browser languages.',
      },
      {
        question: 'Should I use separate codes for each language?',
        answer:
          'Yes, when the code is printed beside text in a specific language. One code per language, each pointing at its own language version, is clearer and more reliable than one code that guesses the visitor language.',
      },
      {
        question: 'What if the page has no translated version?',
        answer:
          'Then no link fix can produce a translation. Either translate the page, point the code at the closest available language, or add a note beside the code naming the language visitors will see. Do not promise a language the page cannot deliver.',
      },
    ]
  ),
  art(
    'why-your-qr-code-shows-an-outdated-page',
    'Why Your QR Code Shows An Outdated Page and How to Fix It',
    'why your qr code shows an outdated page',
    'Diagnose a code that shows an outdated page: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-01',
    `
### What you are seeing

The code scans, but the page shows old content: a past event, an expired offer, last season's prices, or a superseded notice. The scan worked and the link may be exactly the one you printed, which is what makes this failure sneaky: nothing looks broken until someone reads the content. Outdated pages come from codes that point at content nobody updates, or at pages whose updates never reach the printed copies. The fix is to point printed codes at content you maintain, and to refresh the destination before the old content embarrasses you.

### Likely causes

1. **Code points at a frozen campaign page** — A campaign page that is never updated keeps showing its original content long after the campaign ends. Test: compare the page content with the current offer or notice.
2. **Redirect still points at an old page** — A redirect that was never updated after a content refresh keeps sending visitors to the superseded version. Test: follow the redirect chain to the final page and check its content.
3. **Cached page served to visitors** — A cached copy of the page can keep showing old content even after the live page is updated. Test: open the page in a private window and compare it with the edited version.
4. **Code reused from an old campaign** — An old code file reused for a new campaign carries its old destination with it. Test: check the artwork history and the destination it encodes.
5. **Content updated in one place but not the other** — A business can update a page in one language, channel, or system while the QR destination still serves the old version. Test: compare the QR destination with the current source of truth.

### Step-by-step fix

1. Decode the payload and open the destination to confirm the outdated content.
2. Find the current content and its correct address.
3. Update the page if it is meant to be live, or redirect the code to the current page.
4. Clear or check the cache so visitors get the updated version.
5. If the code was reused from an old campaign, regenerate it from the current destination.
6. Retest on two phones and confirm the final page shows current content.

### Putting this into practice

In practice, printed codes need a content owner and a review date. A code with no owner keeps pointing at content nobody checks, and the first person to notice the stale page is a visitor. Give every printed code a review date and a named owner, and check the destination when the date arrives. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Reprinting a code that points at a campaign page nobody owns, so the content goes stale again within weeks.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows an outdated page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows an outdated page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The final page shows current content on two phones
- Redirects point at the current page
- The destination has an owner and a review date
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code show old content?',
        answer:
          'The code points at a page that nobody updated, a redirect that still targets the old version, or a cached copy of the page. Decode the payload, compare the destination with the current content, and update the page, the redirect, or the cache, whichever is stale.',
      },
      {
        question: 'Can I update a printed QR code without reprinting it?',
        answer:
          'Yes, if the code points at an address you control. Update the page content at that address, or change the redirect to point at the current page, and the printed copies serve the new content. If the encoded URL itself is wrong, you must reprint.',
      },
      {
        question: 'How often should I check QR destinations for stale content?',
        answer:
          'Set a review date for every printed code, tied to how fast its content changes: before each campaign, season, or price change, and at least when the review date arrives. A code with no review date will eventually serve stale content.',
      },
    ]
  ),
  art(
    'shows-an-outdated-page-step-by-step-fix',
    'Shows An Outdated Page: Step-by-Step Fix',
    'shows an outdated page step by step fix',
    'Repair a code that shows an outdated page with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-02',
    `
### What you are seeing

This fix replaces the stale destination with current content and protects the code against the next update. You will check what the code points at, find the current content, and either update the page or redirect the code to the live version. Verify the final page shows current content on two phones, not just that it loads.

### Likely causes

1. **Code points at a frozen campaign page** — Quick test: compare the page content with the current offer or notice.
2. **Redirect still points at an old page** — Quick test: follow the redirect chain to the final page and check its content.
3. **Cached page served to visitors** — Quick test: open the page in a private window and compare it with the edited version.
4. **Code reused from an old campaign** — Quick test: check the artwork history and the destination it encodes.
5. **Content updated in one place but not the other** — Quick test: compare the QR destination with the current source of truth.

### Step-by-step fix

Step 1: Decode the payload and open the destination. Write down what is outdated.
Step 2: Find the current content and its correct address.
Step 3: If the page is meant to be live, update its content and confirm the update is published.
Step 4: If the content has moved, add or update a redirect from the old address to the current page.
Step 5: Check the cache: open the page in a private window and confirm the updated content appears.
Step 6: If the code was reused from an old campaign, regenerate it from the current destination.
Step 7: Retest on two phones and confirm the final page shows current content, not just that it loads.

### Putting this into practice

In practice, point printed codes at pages you update in place rather than at campaign pages you replace. A stable page that you refresh survives far longer than a campaign page that goes stale. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Reprinting a code that points at a campaign page nobody owns, so the content goes stale again within weeks.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows an outdated page will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows an outdated page.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The final page shows current content on two phones
- Redirects point at the current page
- The destination has an owner and a review date
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR safety checker](/qr-safety-checker)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code that shows an outdated page?',
        answer:
          'Decode the payload, find the current content, and update the page or the redirect. Clear the cache so visitors see the update. Regenerate the code only if the payload itself is wrong. Retest on two phones and confirm the content is current.',
      },
      {
        question: 'Should I update the page or redirect to a new page?',
        answer:
          'Update the page in place when the code points at a stable address you intend to keep. Redirect when the content has genuinely moved to a new address. Either way, confirm the final page shows current content before you close the job.',
      },
      {
        question: 'How do I stop QR content going stale again?',
        answer:
          'Give every printed code an owner and a review date, and point codes at stable pages you update in place. Check the destination when the review date arrives, before campaigns, and whenever the content changes.',
      },
    ]
  ),
];
