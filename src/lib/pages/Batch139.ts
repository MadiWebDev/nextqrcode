import type { Article } from '../articles';
import { art } from './helper';

export const batch139: Article[] = [
  art(
    'why-your-qr-code-scans-but-the-app-will-not-open',
    'Why Your QR Code Scans But The App Will Not Open and How to Fix It',
    'why your qr code scans but the app will not open',
    'Diagnose a code that scans but the app will not open: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-19',
    `
### What you are seeing

The code scans, but the app it should open does not launch: nothing happens, a browser page opens instead, or an error appears. The scan worked, so the fault sits in the app handover: the link, the app association, or the fallback behaviour. App links depend on the phone, the app, and the site working together, so a code that opens an app on one phone can fail on another. The fix is to trace the handover and to make sure visitors who lack the app still reach something useful.

### Likely causes

1. **Link points at the app, not the content** — A link that targets the app directly can fail on phones without the app, instead of falling back to a web page. Test: open the link on a phone without the app.
2. **App link association not set up** — An app link that is not correctly associated with the domain opens in the browser instead of the app. Test: check the app link setup for the domain.
3. **App not installed on the phone** — A phone without the app cannot open it, and a code with no fallback leaves the visitor stranded. Test: check whether the app is installed on the failing phone.
4. **Redirect breaks the app link** — A redirect can strip the app link information, so the phone treats the destination as an ordinary web page. Test: follow the redirect chain and compare the app behaviour.
5. **Link mistyped or outdated** — A mistyped link or a link to a removed app page can fail to open anything. Test: decode the payload and compare the link with the intended app page.

### Step-by-step fix

1. Decode the payload and write down the exact link it carries.
2. Test the link on a phone with the app and on a phone without it.
3. Check the app link association for the domain.
4. Fix the link, the redirect, or the app link setup, whichever breaks the handover.
5. Add a web fallback page so visitors without the app still reach the content.
6. Retest on two phones, with and without the app.

### Putting this into practice

In practice, the fallback is the fix that matters most. Most visitors who scan a code do not have your app installed, so a code that only works with the app fails for most of its audience. Point the code at a page that offers the app and the content, and let the phone choose. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Pointing a public QR code at an app-only link with no web fallback for visitors who lack the app.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the app will not open will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the app will not open.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The link opens the app where the app is installed
- Visitors without the app reach a useful web page
- The journey passes on two phones, with and without the app
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
        question: 'Why does my QR code not open the app?',
        answer:
          'The link may target the app without a fallback, the app link association may not be set up, the app may not be installed, or a redirect may break the handover. Decode the payload, test on phones with and without the app, and check the app link setup.',
      },
      {
        question: 'Should a QR code link to an app or to a web page?',
        answer:
          'Link to a web page that offers the app and the content. That way, visitors with the app can open it and visitors without it still reach the content. An app-only link strands every visitor who lacks the app.',
      },
      {
        question: 'Why does an app QR code work on one phone but not another?',
        answer:
          'The phones may differ in whether the app is installed, whether the app link association is set up, or how the browser handles the link. Test on phones with and without the app, and provide a web fallback.',
      },
    ]
  ),
  art(
    'scans-but-the-app-will-not-open-step-by-step-fix',
    'Scans But The App Will Not Open: Step-by-Step Fix',
    'scans but the app will not open step by step fix',
    'Repair a code that scans but the app will not open with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-19',
    `
### What you are seeing

This fix makes the code open the app where the app is available, and a useful page everywhere else. You will decode the payload, check the app link setup, and test the journey on phones with and without the app. Verify the fallback as well as the app launch, because the fallback is what most visitors will actually see.

### Likely causes

1. **Link points at the app, not the content** — Quick test: open the link on a phone without the app.
2. **App link association not set up** — Quick test: check the app link setup for the domain.
3. **App not installed on the phone** — Quick test: check whether the app is installed on the failing phone.
4. **Redirect breaks the app link** — Quick test: follow the redirect chain and compare the app behaviour.
5. **Link mistyped or outdated** — Quick test: decode the payload and compare the link with the intended app page.

### Step-by-step fix

Step 1: Decode the payload and write down the exact link it carries.
Step 2: Test the link on a phone with the app installed and on a phone without it.
Step 3: If the app does not launch on a phone that has it, check the app link association for the domain.
Step 4: If a redirect breaks the handover, point the code at the final link or fix the redirect.
Step 5: If the link is mistyped or outdated, regenerate the code from the correct app page link.
Step 6: Add a web fallback page so visitors without the app still reach the content.
Step 7: Retest on two phones, one with the app and one without, and confirm both journeys work.

### Putting this into practice

In practice, test every app code on two phones: one with the app and one without. A code that only passes on the phone with the app is a code that fails for most visitors. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Pointing a public QR code at an app-only link with no web fallback for visitors who lack the app.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the app will not open will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the app will not open.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The link opens the app where the app is installed
- Visitors without the app reach a useful web page
- The journey passes on two phones, with and without the app
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
        question: 'How do I fix a QR code where the app will not open?',
        answer:
          'Decode the payload, test the link on phones with and without the app, and check the app link setup. Fix the link, the redirect, or the association, and add a web fallback page. Retest on two phones, with and without the app.',
      },
      {
        question: 'What fallback should an app QR code have?',
        answer:
          'A web page that shows the same content and offers the app as a choice. Visitors without the app reach the content immediately, and visitors who want the app can install it from there.',
      },
      {
        question: 'How do I test an app QR code?',
        answer:
          'Scan it on a phone with the app and on a phone without it. Confirm the app launches on the first and the web fallback loads on the second. A code that only passes on one of those phones is not finished.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-map-shows-the-wrong-place',
    'Why Your QR Code Scans But The Map Shows The Wrong Place and How to Fix It',
    'why your qr code scans but the map shows the wrong place',
    'Diagnose a code that scans but the map shows the wrong place: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-19',
    `
### What you are seeing

The code scans, the map opens, but the pin lands in the wrong place: the wrong building, the wrong end of the street, or an empty field. The scan worked, so the fault sits in the location the code carries: the coordinates, the address, or the map link. A wrong pin is worse than no pin, because visitors follow it confidently in the wrong direction. The fix is to decode the location, compare it with the real place, and correct the coordinates or the address.

### Likely causes

1. **Coordinates mistyped in the payload** — A coordinate with a mistyped digit, a swapped latitude and longitude, or a missing minus sign can land the pin far from the intended place. Test: decode the payload and read the coordinates.
2. **Address ambiguous or misread** — An address that matches several places, or that the map service reads differently, can pin the wrong one. Test: search the address in the map service and compare the pin.
3. **Map link points at the wrong place** — A map link copied from the wrong pin, or from a search result, can carry the wrong location. Test: open the link and compare the pin with the intended place.
4. **Pin placed on the building, not the entrance** — A pin on the centre of a large site can send visitors to the wrong side of the building. Test: compare the pin with the entrance visitors should use.
5. **Outdated map data** — A new road, a renamed place, or a moved entrance can make the map data disagree with reality. Test: compare the map with the real location on the ground.

### Step-by-step fix

1. Decode the payload and write down the exact location it carries.
2. Open the location in the map service and compare the pin with the real place.
3. Find the correct coordinates for the entrance visitors should use.
4. Rebuild the code with the verified coordinates or the corrected address.
5. Scan the rebuilt code and compare the pin with the real location.
6. Retest on two phones and confirm the pin lands on the right place.

### Putting this into practice

In practice, the pin is the product. A map code that points at the building instead of the entrance sends visitors to the wrong door, which is a failure even when the coordinates are technically close. Choose the pin for the entrance, test it on the ground, and check it again whenever the site changes. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Copying a map link from the wrong pin and sending visitors to the wrong end of the site.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the map shows the wrong place will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the map shows the wrong place.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded coordinates match the intended entrance
- The pin lands on the right place on two phones
- The coordinates are recorded in the job file
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR placement guide](/qr-placement-guide)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code show the wrong place on the map?',
        answer:
          'The coordinates may be mistyped, swapped, or missing a minus sign, the address may be ambiguous, or the link may have been copied from the wrong pin. Decode the payload, compare the location with the real place, and rebuild the code with verified coordinates.',
      },
      {
        question: 'Should a map QR code use coordinates or an address?',
        answer:
          'Coordinates are more precise, because an address can match several places or be read differently by the map service. Use verified coordinates for the entrance visitors should use, and test the pin on the ground.',
      },
      {
        question: 'Why does the map pin land on the building but not the entrance?',
        answer:
          'The pin was placed on the building centre rather than the entrance. Choose the pin for the entrance visitors should use, and test it by scanning and comparing the pin with the real location.',
      },
    ]
  ),
  art(
    'scans-but-the-map-shows-the-wrong-place-step-by-step-fix',
    'Scans But The Map Shows The Wrong Place: Step-by-Step Fix',
    'scans but the map shows the wrong place step by step fix',
    'Repair a code that scans but the map shows the wrong place with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-20',
    `
### What you are seeing

This fix makes the map code point at the right place. You will decode the location, check it against the real address, and rebuild the code with verified coordinates. Verify the fix by scanning and comparing the pin with the real location on two phones.

### Likely causes

1. **Coordinates mistyped in the payload** — Quick test: decode the payload and read the coordinates.
2. **Address ambiguous or misread** — Quick test: search the address in the map service and compare the pin.
3. **Map link points at the wrong place** — Quick test: open the link and compare the pin with the intended place.
4. **Pin placed on the building, not the entrance** — Quick test: compare the pin with the entrance visitors should use.
5. **Outdated map data** — Quick test: compare the map with the real location on the ground.

### Step-by-step fix

Step 1: Decode the payload and write down the exact location it carries.
Step 2: Open the location in the map service and compare the pin with the real place.
Step 3: Find the correct coordinates for the entrance visitors should use, and write them down.
Step 4: Rebuild the code with the verified coordinates, using the map generator or a verified map link.
Step 5: Scan the rebuilt code on two phones and compare the pin with the real location.
Step 6: If the pin still lands wrong, check for swapped coordinates, a missing minus sign, or an ambiguous address.
Step 7: Retest the final code on two phones and confirm the pin lands on the entrance visitors should use.

### Putting this into practice

In practice, keep the verified coordinates in the job file alongside the address. When the code is reprinted, the coordinates are checked against the record instead of being copied from memory. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Copying a map link from the wrong pin and sending visitors to the wrong end of the site.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the map shows the wrong place will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the map shows the wrong place.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded coordinates match the intended entrance
- The pin lands on the right place on two phones
- The coordinates are recorded in the job file
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR placement guide](/qr-placement-guide)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code where the map shows the wrong place?',
        answer:
          'Decode the payload, compare the pin with the real place, and find the correct coordinates for the entrance. Rebuild the code with the verified coordinates and retest on two phones, comparing the pin with the real location.',
      },
      {
        question: 'How do I verify map coordinates before printing?',
        answer:
          'Scan the code on two phones and compare the pin with the real location on the ground. Check the coordinates against the job record, and watch for swapped coordinates or a missing minus sign.',
      },
      {
        question: 'What if the map data itself is wrong?',
        answer:
          'Report the map error to the map provider, and in the meantime point the code at coordinates that land correctly on the current map, with a short note beside the code naming the entrance. Recheck the pin after the map data is corrected.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-review-page-will-not-load',
    'Why Your QR Code Scans But The Review Page Will Not Load and How to Fix It',
    'why your qr code scans but the review page will not load',
    'Diagnose a code that scans but the review page will not load: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-20',
    `
### What you are seeing

The code scans, but the review page will not load: a blank page, an error, or a page that never finishes. The scan worked, so the fault sits in the review destination: the link, the review platform, or the page itself. A review code that fails loses the feedback at the moment the visitor is most willing to give it, which is why it deserves a fast fix. The fix is to test the review destination on its own, then the QR journey.

### Likely causes

1. **Review link expired or changed** — A review link that changed, expired, or was replaced can fail for every visitor. Test: open the review link directly.
2. **Review platform blocking the visit** — A review platform can block visitors who are signed out, in the wrong region, or on an unsupported browser. Test: open the link in a second browser and while signed in.
3. **Redirect dropping the review target** — A redirect can strip the review identifier from the link, landing visitors on a generic page that does not load. Test: follow the redirect chain and watch the review identifier.
4. **Page script or pop-up blocking the form** — A script error or a blocking pop-up can stop the review form from appearing. Test: check whether the page loads without the form.
5. **Link mistyped in the payload** — A mistyped review link can land visitors on a page that does not exist. Test: decode the payload and compare the link with the intended review link.

### Step-by-step fix

1. Decode the payload and write down the exact review link it carries.
2. Open the review link directly, outside the QR journey.
3. Follow the redirect chain and check that it preserves the review target.
4. Fix the link, the redirect, or the page, whichever blocks the review form.
5. Regenerate the code if the payload carries the wrong link.
6. Retest by scanning the code and reaching a working review form on two phones.

### Putting this into practice

In practice, test the review destination on its own before you blame the code. A review link that fails when opened directly is a destination problem, and no QR fix can repair it. A link that works directly but fails from the code points at the payload or the redirect. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Assuming a review QR code still works months after launch without ever retesting the destination.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the review page will not load will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the review page will not load.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The review link loads directly in a phone browser
- Redirects preserve the review target
- Scanning reaches a working review form on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'Why does my QR code not open the review page?',
        answer:
          'The review link may have changed or expired, the platform may block the visit, a redirect may drop the review identifier, or the payload may carry a mistyped link. Decode the payload, open the link directly, and follow the redirect chain to find the fault.',
      },
      {
        question: 'Can a QR code link directly to a review form?',
        answer:
          'Yes, when the review platform provides a direct link to the form. Link to that direct address rather than to a generic page, and test the full journey by scanning and reaching the form on two phones.',
      },
      {
        question: 'Why does a review page load for me but not for visitors?',
        answer:
          'Your signed-in state, your browser, or your location may let you through while visitors are blocked. Test the destination in a private window, while signed out, and in a second browser to see what visitors actually get.',
      },
    ]
  ),
  art(
    'scans-but-the-review-page-will-not-load-step-by-step-fix',
    'Scans But The Review Page Will Not Load: Step-by-Step Fix',
    'scans but the review page will not load step by step fix',
    'Repair a code that scans but the review page will not load with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-20',
    `
### What you are seeing

This fix restores the review page behind the code. You will test the review link on its own, check the platform and the page, and repair whichever step blocks it. Verify the fix by scanning and reaching a working review form on two phones.

### Likely causes

1. **Review link expired or changed** — Quick test: open the review link directly.
2. **Review platform blocking the visit** — Quick test: open the link in a second browser and while signed in.
3. **Redirect dropping the review target** — Quick test: follow the redirect chain and watch the review identifier.
4. **Page script or pop-up blocking the form** — Quick test: check whether the page loads without the form.
5. **Link mistyped in the payload** — Quick test: decode the payload and compare the link with the intended review link.

### Step-by-step fix

Step 1: Decode the payload and write down the exact review link it carries.
Step 2: Open the review link directly in a phone browser. If it fails there, the destination is the problem.
Step 3: Follow the redirect chain and check that it preserves the review identifier all the way to the final page.
Step 4: If the link changed or expired, get the current review link from the platform and regenerate the code.
Step 5: If the page loads without the form, fix the page or link to the review form directly.
Step 6: Test the destination in a second browser and while signed in, to separate a platform block from a link fault.
Step 7: Retest by scanning the code on two phones and reaching a working review form.

### Putting this into practice

In practice, keep the review link under regular check, because review platforms change their links and rules. A review code that worked at launch can fail months later when the platform changes, and the first person to notice is a visitor whose feedback is lost. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Assuming a review QR code still works months after launch without ever retesting the destination.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the review page will not load will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the review page will not load.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The review link loads directly in a phone browser
- Redirects preserve the review target
- Scanning reaches a working review form on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'How do I fix a QR code where the review page will not load?',
        answer:
          'Open the review link directly. If it fails there, fix the destination or get the current review link. If it works there, decode the payload, follow the redirect chain, and regenerate the code from the correct link. Retest by scanning on two phones.',
      },
      {
        question: 'Should I reprint a review QR code if the platform changed the link?',
        answer:
          'If the code points at a redirect you control, update the redirect and the printed copies heal. If the payload itself carries the old link, regenerate and reprint the code from the current review link.',
      },
      {
        question: 'How often should I retest a review QR code?',
        answer:
          'Check the destination whenever the review platform changes, and at least on a regular schedule you set for the code. A review code that fails silently loses feedback every day until someone notices.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-booking-page-errors',
    'Why Your QR Code Scans But The Booking Page Errors and How to Fix It',
    'why your qr code scans but the booking page errors',
    'Diagnose a code that scans but the booking page errors: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-21',
    `
### What you are seeing

The code scans, the booking page opens, but the booking fails: an error message, a form that will not submit, or a calendar that shows no availability. The scan worked, so the fault sits in the booking journey: the link, the booking settings, or the page itself. A booking code that errors loses the booking at the moment the visitor decided to commit, which is the worst time to fail. The fix is to walk the booking journey manually and to find the step that errors.

### Likely causes

1. **Booking link expired or changed** — A booking link that changed, expired, or was replaced can error for every visitor. Test: open the booking link directly.
2. **Booking settings blocking the request** — A booking calendar with no availability, a closed service, or a rule that blocks the requested date can error. Test: check the booking settings and availability.
3. **Link missing the booking details** — A booking link that should carry a service, a date, or a location can error when those details are missing or mistyped. Test: decode the payload and compare the link with the intended booking link.
4. **Redirect dropping the booking details** — A redirect can strip the booking parameters from the link, landing visitors on a generic page that errors. Test: follow the redirect chain and watch the booking parameters.
5. **Page script or form fault** — A script error or a form fault can stop the booking from submitting even when the link is correct. Test: complete a booking manually without the QR code.

### Step-by-step fix

1. Decode the payload and write down the exact booking link it carries.
2. Walk the booking journey manually, without the QR code, and note where it errors.
3. Check the booking settings and availability for the service.
4. Follow the redirect chain and check that it preserves the booking details.
5. Fix the link, the redirect, the settings, or the page, whichever errors.
6. Retest by scanning the code and completing a test booking on two devices.

### Putting this into practice

In practice, the manual booking test splits this problem in two. If the booking fails without the code, the booking setup is at fault. If it works manually but fails from the code, the payload or the redirect is at fault. That test tells you where to fix. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Relaunching a booking QR code after a scan test, without ever completing a test booking.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the booking page errors will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the booking page errors.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The booking link works directly in a phone browser
- The booking settings allow the requested booking
- A test booking completes from a scan on two devices
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'Why does my QR code open a booking page that errors?',
        answer:
          'The booking link may have changed, the booking settings may block the request, the link may be missing booking details, a redirect may drop them, or the page may have a form fault. Decode the payload, walk the booking manually, and follow the redirect chain to find the fault.',
      },
      {
        question: 'Can a QR code prefill a booking?',
        answer:
          'Yes, when the booking link carries the service, date, or location and the booking page accepts them. Test the full journey by scanning and completing a test booking, because a scan that opens the page does not prove the booking works.',
      },
      {
        question: 'Why does a booking work for me but error for visitors?',
        answer:
          'Your signed-in state, your test data, or your browser may let you through while visitors are blocked. Test the booking in a private window, while signed out, and on two devices to see what visitors actually get.',
      },
    ]
  ),
  art(
    'scans-but-the-booking-page-errors-step-by-step-fix',
    'Scans But The Booking Page Errors: Step-by-Step Fix',
    'scans but the booking page errors step by step fix',
    'Repair a code that scans but the booking page errors with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-21',
    `
### What you are seeing

This fix restores the booking journey behind the code. You will walk the booking manually, check the link and the booking settings, and repair the step that errors. Verify the fix by scanning and completing a test booking on two devices.

### Likely causes

1. **Booking link expired or changed** — Quick test: open the booking link directly.
2. **Booking settings blocking the request** — Quick test: check the booking settings and availability.
3. **Link missing the booking details** — Quick test: decode the payload and compare the link with the intended booking link.
4. **Redirect dropping the booking details** — Quick test: follow the redirect chain and watch the booking parameters.
5. **Page script or form fault** — Quick test: complete a booking manually without the QR code.

### Step-by-step fix

Step 1: Decode the payload and write down the exact booking link it carries.
Step 2: Walk the booking journey manually, without the QR code, and note the step that errors.
Step 3: Check the booking settings, availability, and rules for the service.
Step 4: Follow the redirect chain and check that it preserves the booking details.
Step 5: Fix the link, the redirect, the settings, or the page, whichever is at fault.
Step 6: If the payload carries the wrong link, regenerate the code from the correct booking link.
Step 7: Retest by scanning the code and completing a test booking on two devices.

### Putting this into practice

In practice, never relaunch a booking code on the strength of a scan test. Only a completed test booking proves the journey works. Keep that test booking in your launch checklist for every booking code. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Relaunching a booking QR code after a scan test, without ever completing a test booking.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the booking page errors will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the booking page errors.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The booking link works directly in a phone browser
- The booking settings allow the requested booking
- A test booking completes from a scan on two devices
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'How do I fix a QR code where the booking page errors?',
        answer:
          'Walk the booking manually to find the failing step, check the booking settings, and follow the redirect chain. Fix the link, the redirect, the settings, or the page, whichever errors. Retest by scanning and completing a test booking on two devices.',
      },
      {
        question: 'Should I reprint a booking QR code if the booking link changed?',
        answer:
          'If the code points at a redirect you control, update the redirect and the printed copies heal. If the payload itself carries the old link, regenerate and reprint the code from the current booking link.',
      },
      {
        question: 'How do I test a booking QR code before launch?',
        answer:
          'Scan the code on two devices and complete a test booking, including the full form and confirmation. A scan that opens the page is not a passing test; a completed test booking is.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-download-stops-halfway',
    'Why Your QR Code Scans But The Download Stops Halfway and How to Fix It',
    'why your qr code scans but the download stops halfway',
    'Diagnose a code that scans but the download stops halfway: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-21',
    `
### What you are seeing

The code scans, the download starts, then stops partway: a stalled progress bar, a failed download message, or a file that arrives incomplete. The scan worked, so the fault sits in the download: the file, the server, the connection, or the phone storage. A half-downloaded file is worse than no file, because the visitor may not realise it is incomplete. The fix is to test the download on its own, then the QR journey, and to make the file and the page forgiving of weak connections.

### Likely causes

1. **File too large for the connection** — A large file can stall or fail on a weak mobile connection. Test: try the download on a strong connection and compare.
2. **Server interrupting the download** — A server timeout, a limit, or a fault can cut the download short. Test: download the file directly on a desktop and check whether it completes.
3. **Link points at an incomplete or moved file** — A file that was replaced, moved, or only partly uploaded can produce a truncated download. Test: check the file on the server and compare its size with the expected size.
4. **Phone storage full** — A phone with no free storage stops the download partway. Test: check the storage on the failing phone.
5. **Redirect breaking the download** — A redirect can interrupt the download or send the browser to a page instead of the file. Test: follow the redirect chain and watch the download behaviour.

### Step-by-step fix

1. Decode the payload and write down the exact download link it carries.
2. Download the file directly on a desktop and confirm it completes.
3. Check the file size on the server against the expected size.
4. Test the download on a strong connection and on a weak one.
5. Fix the file, the server, or the link, whichever interrupts the download.
6. Retest by scanning the code and downloading the complete file on two phones.

### Putting this into practice

In practice, the file size is the first suspect for a download that stops halfway. A file that downloads fine on office WiFi can stall on a weak mobile signal, which is the connection your visitors use. Keep download files as small as you can, and link to a page that describes the file so visitors can retry with context. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Linking a QR code to a huge file and assuming visitors will wait for it on a weak mobile signal.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the download stops halfway will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the download stops halfway.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The file downloads completely on a desktop
- The server file size matches the expected size
- Scanning downloads the complete file on two phones
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
        question: 'Why does my QR code download stop halfway?',
        answer:
          'The file may be too large for the connection, the server may interrupt the download, the file on the server may be incomplete, the phone storage may be full, or a redirect may break the download. Download the file directly on a desktop, check its size, and test on a strong connection to find the fault.',
      },
      {
        question: 'Can a QR code itself interrupt a download?',
        answer:
          'No. The code only carries the link. The download depends on the file, the server, the connection, and the phone. A code that opens the right link has done its job; the interruption sits downstream.',
      },
      {
        question: 'Why does a download work on WiFi but stop on mobile data?',
        answer:
          'The mobile connection may be too weak or unstable for a large file. Test on a strong connection to confirm, and reduce the file size or split it so the download survives a weak signal.',
      },
    ]
  ),
  art(
    'scans-but-the-download-stops-halfway-step-by-step-fix',
    'Scans But The Download Stops Halfway: Step-by-Step Fix',
    'scans but the download stops halfway step by step fix',
    'Repair a code that scans but the download stops halfway with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-22',
    `
### What you are seeing

This fix makes the download behind the code complete reliably. You will test the file on its own, check the server and the file size, and repair the link, the file, or the serving setup. Verify the fix by scanning and downloading the complete file on two phones.

### Likely causes

1. **File too large for the connection** — Quick test: try the download on a strong connection and compare.
2. **Server interrupting the download** — Quick test: download the file directly on a desktop and check whether it completes.
3. **Link points at an incomplete or moved file** — Quick test: check the file on the server and compare its size with the expected size.
4. **Phone storage full** — Quick test: check the storage on the failing phone.
5. **Redirect breaking the download** — Quick test: follow the redirect chain and watch the download behaviour.

### Step-by-step fix

Step 1: Decode the payload and write down the exact download link it carries.
Step 2: Download the file directly on a desktop and confirm it completes with the expected size.
Step 3: Check the file on the server. Re-upload it if it is incomplete or truncated.
Step 4: Test the download on a strong connection, then on a weak mobile connection.
Step 5: If the file is large, split it, compress it, or link to a page that offers it as a choice.
Step 6: Fix any redirect that interrupts the download, or point the code at the direct file link.
Step 7: Retest by scanning the code and downloading the complete file on two phones.

### Putting this into practice

In practice, check the downloaded file size against the expected size after every test. A file that arrives short is a file that failed, even if the phone reports the download as complete. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Linking a QR code to a huge file and assuming visitors will wait for it on a weak mobile signal.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the download stops halfway will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the download stops halfway.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The file downloads completely on a desktop
- The server file size matches the expected size
- Scanning downloads the complete file on two phones
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
        question: 'How do I fix a QR code where the download stops halfway?',
        answer:
          'Download the file directly on a desktop, check its size on the server, and test on a strong connection. Re-upload an incomplete file, reduce the file size, or fix the redirect. Retest by scanning and downloading the complete file on two phones.',
      },
      {
        question: 'Should a QR code link directly to a large file?',
        answer:
          'Prefer linking to a page that describes the file and offers the download as a choice. Visitors get context, a file size, and a way to retry. A direct link to a huge file fails silently on weak connections.',
      },
      {
        question: 'How do I confirm a download completed?',
        answer:
          'Compare the downloaded file size with the expected size, and open the file to confirm it is complete. A progress bar that disappears is not proof; a complete file with the right size is.',
      },
    ]
  ),
];
