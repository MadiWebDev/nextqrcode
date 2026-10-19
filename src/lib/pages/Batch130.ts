import type { Article } from '../articles';
import { art } from './helper';

export const batch130: Article[] = [
  art(
    'why-your-qr-code-wont-scan-at-all',
    "Why Your QR Code Won't Scan At All and How to Fix It",
    'why your qr code wont scan at all',
    'Diagnose a code that will not scan at all: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-07-20',
    `
### What you are seeing

You point a phone camera at the code and nothing happens: no preview banner, no link, no vibration, no error. The same phone scans other codes normally, so the problem sits with this code, its surface, or its placement rather than with the phone. A total failure like this usually has one dominant cause, which means a short, ordered diagnosis finds it fast. Work through the causes below from most to least likely before you reprint anything, because reprinting the same broken artwork only repeats the failure.

### Likely causes

1. **Damaged or covered finder patterns** — The three large squares in the corners tell the scanner where the code is. If a logo, sticker, fold, scratch, or crop covers any part of one, the scanner may never lock on. Test: look at all three corners closely and compare them with the original digital file; any corner that looks different from the file is suspect.
2. **Quiet zone eaten by nearby text or trim** — Scanners need a clear margin around the symbol, about four modules wide, on all four sides. Text, borders, or a page edge that crowds the code can prevent detection even when the code itself is perfect. Test: check whether any ink, rule, or edge sits close to the code on any side.
3. **Contrast too low to separate modules** — A code printed in pale colours, on a coloured background, or on a reflective surface can look fine to the eye while the camera sees a grey blur. Test: photograph the code and view the photo in greyscale; if neighbouring modules blur together, contrast is the problem.
4. **Payload is malformed or empty** — A code that encodes a broken link, an unsupported scheme, or nothing at all may scan without ever producing an action, which looks like a total failure. Test: decode the code with a payload inspector and read exactly what it contains.
5. **Print too small for the scan distance** — A code that works at arm's length can fail completely at poster distance because the camera cannot resolve the modules. Test: walk up to the code slowly; if it starts scanning at close range, size and distance are the problem.

### Step-by-step fix

1. Photograph the code in the light where it will be used and compare the photo with the original file, corner by corner.
2. Clear or restore the quiet zone on all four sides, and move any text, rule, or border away from the symbol.
3. Reprint one proof in dark modules on a plain light background and scan it before touching anything else.
4. Decode the payload and confirm it is exactly the destination or data you intended, with no stray characters.
5. Test the proof at the real viewing distance on two different phones, one iPhone and one Android if you can.
6. Only when the proof scans reliably, reprint the full run from the corrected file and spot-check the first copies off the printer.

### Putting this into practice

In practice, most dead codes fail for a visible reason: a covered corner, a crowded margin, or colours that looked bolder on screen than they print. Build a habit of scanning one proof copy at the real distance before any print run, and keep that proof with the job file so the next reprint starts from a known-good sample. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Reprinting the full run from the same file before testing a single proof, which turns one broken code into hundreds.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that will not scan at all will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that will not scan at all.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are fully visible and match the digital file
- A clear quiet zone surrounds the code on all four sides
- Dark modules sit on a plain light background with strong contrast
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code scan in the design file but not after printing?',
        answer:
          'Printing changes contrast, sharpness, and size, and any of the three can push a marginal code over the edge. A glossy stock can add reflections, a small size can blur modules together, and a colour shift can weaken contrast. Always test the printed proof, not just the screen version, because the screen version hides exactly the faults that printing introduces.',
      },
      {
        question: 'Can a logo inside a QR code stop it scanning?',
        answer:
          'Yes, when the logo covers a finder pattern, eats too much of the centre, or leaves too little undamaged data for the error correction to recover. Keep any logo small, centred, and clear of the three corner squares, and test the final artwork on two phones before you print. If the logo version fails and the plain version works, shrink or remove the logo.',
      },
      {
        question: 'Does the phone camera matter when a code will not scan at all?',
        answer:
          'It can, but test the code before blaming the phone. Try a second phone and a dedicated scanner app, and clean the camera lens. If the code fails on every device while other codes scan fine, the fault is in the code itself, and the causes above will find it.',
      },
    ]
  ),
  art(
    'wont-scan-at-all-step-by-step-fix',
    "Won't Scan At All: Step-by-Step Fix",
    'wont scan at all step by step fix',
    'Repair a code that will not scan at all with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-07-20',
    `
### What you are seeing

This fix walks you from a completely dead code to a verified working one in a single pass. You will isolate whether the fault is in the artwork, the payload, the print, or the placement, then repair only the part that failed. Keep the original file and one printed proof beside you while you work, and retest after every change so you know exactly which step fixed it. Do not reorder the steps: the early checks are cheap and catch the faults that make later steps pointless.

### Likely causes

1. **Damaged or covered finder patterns** — Quick test: hold the original digital file next to the printed code and compare all three corner squares.
2. **Quiet zone eaten by nearby text or trim** — Quick test: measure the clear margin on all four sides and look for nearby ink or trim edges.
3. **Contrast too low to separate modules** — Quick test: view a photo of the code in greyscale and check that dark and light modules separate cleanly.
4. **Payload is malformed or empty** — Quick test: decode the code and read the raw payload instead of trusting the preview banner.
5. **Print too small for the scan distance** — Quick test: step closer until the code scans, and note the distance where it first locks on.

### Step-by-step fix

Step 1: Photograph the failing code and compare it with the original digital file. Note every difference, starting with the three corner finder patterns.
Step 2: Check the quiet zone. Clear at least four modules of empty margin on all four sides and remove anything crowding the symbol.
Step 3: Print a single test proof in plain black on white at the intended size. Scan it in the real lighting. If this proof scans, the fault is in the original artwork or colours, not the payload.
Step 4: Decode the payload and read it character by character. Fix any typo, missing scheme, or stray space, then regenerate the code from the corrected payload.
Step 5: Test the corrected proof at the real distance on two phones. Move closer and further away to find the range where it locks on.
Step 6: If it still fails, regenerate at a larger size with a shorter payload and a higher error-correction setting, then retest.
Step 7: Reprint the full run only after the proof scans on both phones. Keep the proof as your reference for the next batch.

### Putting this into practice

In practice, the fix that sticks is the one you verify twice: once on the proof and once on the first copies off the real printer. File the corrected artwork with a short note naming what failed and what you changed, so a colleague reprinting the job does not reintroduce the same fault. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Reprinting the full run from the same file before testing a single proof, which turns one broken code into hundreds.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that will not scan at all will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that will not scan at all.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are fully visible and match the digital file
- A clear quiet zone surrounds the code on all four sides
- Dark modules sit on a plain light background with strong contrast
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'What is the first thing to check when a QR code will not scan?',
        answer:
          'Check the three corner finder patterns and the quiet zone first. Those two checks take under a minute and explain a large share of total failures. If a corner is covered or the margin is crowded, fix that before investigating the payload or the printer.',
      },
      {
        question: 'Should I regenerate the code or fix the print?',
        answer:
          'Fix the print first if the digital file scans on screen, because the artwork is then proven good. Regenerate only when the digital file itself fails, when the payload is wrong, or when you need a shorter payload or a larger size. Regenerating a good file wastes a step and can introduce a new typo.',
      },
      {
        question: 'How do I prove the fix worked before reprinting?',
        answer:
          'Scan the corrected proof on two different phones at the real viewing distance and in the real lighting, and decode the payload to confirm the content. If both phones lock on quickly and the decoded content is correct, the fix is proven. Keep that proof as the reference for the run.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-slowly',
    'Why Your QR Code Scans Slowly and How to Fix It',
    'why your qr code scans slowly',
    'Diagnose a code that scans slowly: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-07-20',
    `
### What you are seeing

The code does scan, but only after a long hover, repeated refocusing, or several attempts. Slow scanning frustrates people: many will give up and walk away before the banner appears, so a slow code behaves almost like a broken one in the real world. The delay usually comes from the camera struggling to resolve the modules, which points at density, size, contrast, or lighting rather than at the destination. Diagnose the slowest part of the process first, because a code that locks on quickly but loads slowly has a different fix.

### Likely causes

1. **Dense modules from a long payload** — A long URL packs many small modules into the symbol, and the camera needs a steadier hold and a better focus to resolve them. Test: compare your code with a short-payload version of the same design; if the short version locks on faster, density is the cause.
2. **Code too small for the distance** — Small modules force the camera to work harder, especially in dim light or on older phones. Test: step closer; if the code locks on quickly at close range but hesitates at the real distance, size is the cause.
3. **Weak contrast or glare** — Low contrast and reflections both slow down the camera's ability to separate dark and light modules. Test: shade the code with your hand or tilt it away from the light; if it locks on faster, contrast or glare is the cause.
4. **Camera focus fighting a busy background** — A patterned background, nearby text, or a curved surface gives the autofocus competing targets. Test: hold a plain sheet behind the code or flatten the surface; if focus settles faster, the background is the cause.
5. **Destination page is heavy** — Sometimes the scan itself is fast but the page that opens feels slow, and people blame the code. Test: watch for the preview banner; if the banner appears quickly but the page crawls, the page is the cause.

### Step-by-step fix

1. Shorten the payload: use a short domain path, drop tracking parameters you do not need, and regenerate.
2. Enlarge the code or move it closer to where people will stand when they scan it.
3. Raise the contrast with darker modules on a plain light background, and move the code out of direct glare.
4. Give the code a plain background and a flat surface so the camera focuses on the symbol, not the surroundings.
5. Simplify the destination page for mobile, and retest the full journey from scan to loaded page.
6. Retest on two phones, including an older one, and keep the version that locks on fastest.

### Putting this into practice

In practice, the biggest speed win is usually a shorter payload plus a slightly larger code. Those two changes cost nothing and they make every phone's job easier. Test with the oldest phone your audience might use, because a code that is merely slow on a new phone can be unusable on an older one. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Judging speed on a brand-new phone under bright office light, then discovering the code crawls for real visitors in dimmer conditions.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans slowly will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans slowly.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload is as short as the destination allows
- The code locks on quickly at the real distance on two phones
- The destination page loads promptly on a mobile connection
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code take several seconds to scan?',
        answer:
          'The camera is usually struggling to resolve small or low-contrast modules, so it hunts for focus before it can decode. A long payload, a small print size, weak contrast, glare, or a busy background all slow that process down. Shorten the payload, enlarge the code, raise the contrast, and retest in the real lighting.',
      },
      {
        question: 'Does error correction level affect scan speed?',
        answer:
          'It can, because a higher level packs more data into the symbol and makes the modules denser, which the camera must resolve. Use the lowest error-correction level that still protects the code for its environment, and prefer a shorter payload over a higher correction level when speed matters.',
      },
      {
        question: 'Can a dirty camera lens make a QR code scan slowly?',
        answer:
          'Yes, and it is worth ruling out first. A smudged lens softens the whole image, which hurts dense or low-contrast codes the most. Clean the lens and retest before you redesign the code.',
      },
    ]
  ),
  art(
    'scans-slowly-step-by-step-fix',
    'Scans Slowly: Step-by-Step Fix',
    'scans slowly step by step fix',
    'Repair a code that scans slowly with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-07-21',
    `
### What you are seeing

This fix shortens the time from pointing the camera to seeing the preview banner. You will work through the physical causes first, because a code the camera cannot resolve quickly cannot be fixed by changing the destination. Then you will check the payload and the page it opens. Time each attempt with a slow count so you can tell whether a change actually helped instead of guessing.

### Likely causes

1. **Dense modules from a long payload** — Quick test: generate a short-payload version and compare lock-on time with the original.
2. **Code too small for the distance** — Quick test: step closer and see whether lock-on time drops sharply.
3. **Weak contrast or glare** — Quick test: shade the code and tilt it away from reflections, then compare lock-on time.
4. **Camera focus fighting a busy background** — Quick test: hold plain paper behind the code and see whether focus settles faster.
5. **Destination page is heavy** — Quick test: note whether the preview banner or the page load is the slow part.

### Step-by-step fix

Step 1: Time the current code. Point the camera at it and count slowly until the preview banner appears. Write the count down.
Step 2: Shorten the payload as far as you can without losing the destination, then regenerate the code.
Step 3: Print a proof at a larger size than the original and test it at the real distance on two phones.
Step 4: Increase contrast and remove glare: darker modules, plain light background, and a position away from direct light or reflections.
Step 5: Flatten the surface and clear the surroundings so the camera has one clean target to focus on.
Step 6: Open the destination on a phone and simplify anything that delays the page, such as heavy images or pop-ups.
Step 7: Time the fixed code the same way you timed the original. Accept the fix only when the banner appears clearly faster on both phones.

### Putting this into practice

In practice, keep a before-and-after timing note with the job: the original lock-on count and the fixed one. That note tells you whether the change helped and gives the next person a baseline, instead of leaving them to guess whether the code is fast enough. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Judging speed on a brand-new phone under bright office light, then discovering the code crawls for real visitors in dimmer conditions.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans slowly will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans slowly.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload is as short as the destination allows
- The code locks on quickly at the real distance on two phones
- The destination page loads promptly on a mobile connection
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I measure whether my fix made scanning faster?',
        answer:
          'Time the scan the same way before and after: point the camera at the code from the real distance and count until the preview banner appears. Use the same phone and lighting for both measurements. A real improvement shows up as a clearly shorter count on two different phones, not just on one lucky attempt.',
      },
      {
        question: 'Should I make the code bigger or the payload shorter first?',
        answer:
          'Shorten the payload first, because it costs nothing and it makes the modules larger even at the same print size. Then enlarge the code if it is still slow. Doing both together is fine, but changing the payload first tells you how much of the problem was density.',
      },
      {
        question: 'What if the scan is fast but the page loads slowly?',
        answer:
          'Then the code is fixed and the page is the problem. Simplify the destination page for mobile: fewer heavy images, no blocking pop-ups, and a fast-loading layout. Test the whole journey from scan to readable page, because visitors judge the experience by the page, not by the scan.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-on-iphone-but-not-android',
    'Why Your QR Code Scans On Iphone But Not Android and How to Fix It',
    'why your qr code scans on iphone but not android',
    'Diagnose a code that scans on iPhone but not Android: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-07-21',
    `
### What you are seeing

The code works on an iPhone yet fails on Android phones, or works on some Android phones and not others. This split almost always comes from differences in how the code is decoded: the built-in camera app, the decoding library, the payload format, or the way the phone handles the action the code requests. Android is not one identical camera, so test on more than one Android device before you conclude anything. The fix is to make the payload use the most standard, widely supported format rather than a format that only one platform tolerates.

### Likely causes

1. **Non-standard payload format** — Some payloads use a format variant that one platform parses leniently and another rejects, such as an unusual WiFi, contact, or calendar encoding. Test: decode the payload and check it against the standard field layout for that payload type.
2. **Android camera app lacks built-in scanning** — Some Android camera apps do not scan QR codes natively, so the phone appears to fail when it simply never tried. Test: open a dedicated scanner app on the same Android phone; if that scans it, the camera app is the gap.
3. **Payload action handled differently on Android** — An action such as joining WiFi, saving a contact, or opening an app can be supported on one platform and blocked or handled differently on the other. Test: note what happens after the banner appears; if Android shows the banner but the action fails, the action handling differs.
4. **Encoding problem with special characters** — Accented characters, symbols, or a wrong character encoding can decode cleanly on one platform and garble on another. Test: decode the payload on both platforms and compare the text character by character.
5. **Camera focus or lens behaviour on that Android model** — Some Android models struggle with close focus or with glare in a way that looks like a code failure. Test: try the same Android phone on other codes and try a different distance.

### Step-by-step fix

1. Decode the payload and write down exactly what it contains, including every field and separator.
2. Rebuild the payload in the standard format for its type, using the generator for that type rather than hand-typing the format.
3. Test on two different Android phones, using both the built-in camera and a scanner app.
4. Simplify any special characters in the payload and retest.
5. Confirm the action the code requests works on Android, and offer a typed fallback next to the code.
6. Retest on iPhone to confirm you did not break the platform that worked.

### Putting this into practice

In practice, the reliable cure is to stop hand-crafting payloads and use the purpose-built generator for each type. Hand-typed WiFi, contact, and calendar payloads are where the cross-platform differences hide. A generator produces the standard layout that both platforms expect, and a two-phone test catches anything it misses. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Testing on a single Android phone and concluding that all Android phones behave the same way.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans on iPhone but not Android will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans on iPhone but not Android.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload uses the standard format for its type
- The code scans on two different Android phones
- The action after the scan works on Android, not just the preview
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why do some Android phones not scan QR codes with the camera app?',
        answer:
          'Some Android camera apps do not include built-in QR scanning, or it is switched off in settings. The phone is not broken; it simply never attempts a decode. A dedicated scanner app reads the same code fine, which confirms the camera app is the gap rather than the code.',
      },
      {
        question: 'Is a QR code that only works on iPhone a payload problem?',
        answer:
          'Often, yes. iPhone decoding tends to be forgiving about format quirks, while Android decoders can be stricter about field order, separators, and encoding. Rebuilding the payload in the standard format with the right generator usually closes the gap.',
      },
      {
        question: 'Do I need to make separate QR codes for iPhone and Android?',
        answer:
          'Almost never. One code in the standard format should work on both platforms. Separate codes double your maintenance and confuse visitors. Fix the payload format instead, and keep one code that passes on both.',
      },
    ]
  ),
  art(
    'scans-on-iphone-but-not-android-step-by-step-fix',
    'Scans On Iphone But Not Android: Step-by-Step Fix',
    'scans on iphone but not android step by step fix',
    'Repair a code that scans on iPhone but not Android with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-07-21',
    `
### What you are seeing

This fix makes the code work on both platforms by removing the platform-specific assumption that iPhone happened to forgive. You will decode the payload, rebuild it in the most standard format, and verify it on at least two Android devices with different camera apps. Keep the iPhone passing at every step: a fix that trades one platform for the other is not a fix.

### Likely causes

1. **Non-standard payload format** — Quick test: decode the payload and compare its field layout with the standard format for that type.
2. **Android camera app lacks built-in scanning** — Quick test: try a dedicated scanner app on the same Android phone.
3. **Payload action handled differently on Android** — Quick test: check whether Android shows the preview banner but fails on the action that follows.
4. **Encoding problem with special characters** — Quick test: decode the payload on both platforms and compare the text exactly.
5. **Camera focus or lens behaviour on that Android model** — Quick test: try the same Android phone on other codes and at a different distance.

### Step-by-step fix

Step 1: On the failing Android phone, open a dedicated scanner app and try the code. Record whether the built-in camera, the scanner app, or neither can read it.
Step 2: Decode the payload and inspect every field. Rebuild it with the matching generator instead of hand-typing the format.
Step 3: Remove or simplify special characters, and confirm the character encoding is standard.
Step 4: Print a fresh proof from the rebuilt payload and test it on two Android phones with different camera apps.
Step 5: Walk through the full action on Android, not just the scan: does the WiFi join, the contact save, or the page open?
Step 6: Add a short typed fallback beside the code for the action it performs, so Android users have another path.
Step 7: Retest the final proof on iPhone and on both Android phones, and keep the version that passes everywhere.

### Putting this into practice

In practice, keep one Android test device in your kit that represents your audience, and test every new payload type on it before launch. A code that only ever meets an iPhone during testing will keep surprising you in the field. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Testing on a single Android phone and concluding that all Android phones behave the same way.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans on iPhone but not Android will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans on iPhone but not Android.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload uses the standard format for its type
- The code scans on two different Android phones
- The action after the scan works on Android, not just the preview
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How many Android phones should I test on?',
        answer:
          'Test on at least two Android phones from different makers, using both the built-in camera and a scanner app. Android camera behaviour varies between makers and models, so one device proves little. If both pass, the code is in good shape for most of the Android audience.',
      },
      {
        question: 'What if the code scans on Android but the action fails?',
        answer:
          'Then the payload format is readable but the action is not supported or is blocked on that device. Rebuild the payload in the standard format, simplify it, and confirm the action is one Android supports. Add a typed fallback beside the code so users can complete the action manually.',
      },
      {
        question: 'Can I fix an iPhone-only code without breaking iPhone?',
        answer:
          'Yes. Rebuilding in the standard format keeps iPhone working, because iPhone decoders handle standard payloads well. Retest on iPhone after every change so you catch any regression immediately instead of discovering it after reprinting.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-on-android-but-not-iphone',
    'Why Your QR Code Scans On Android But Not Iphone and How to Fix It',
    'why your qr code scans on android but not iphone',
    'Diagnose a code that scans on Android but not iPhone: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-07-22',
    `
### What you are seeing

The code works on Android yet fails on iPhone, or works on some iPhones and not others. iPhone decoding is strict about certain payload shapes and about how the camera app hands the result to the next app, so a code that Android forgives can still stall on iPhone. The split can also come from the iPhone camera setup: an older iOS version, a disabled scan setting, or a lens and focus quirk. Work through the payload first, then the phone, because a payload fix helps every iPhone while a phone setting only helps one.

### Likely causes

1. **Payload shape iPhone rejects** — Some payloads use field orders, separators, or action formats that Android tolerates and iPhone refuses, particularly for WiFi, contacts, and calendar events. Test: decode the payload and compare it with the standard layout for that type.
2. **iPhone Scan QR Codes setting switched off** — iPhone has a camera setting that enables QR scanning, and when it is off the camera simply ignores codes. Test: open the camera settings on the failing iPhone and confirm the scanning option is on.
3. **Action iPhone will not perform automatically** — iPhone may show the preview banner yet refuse the follow-on action, such as joining a network or saving a contact with unusual fields. Test: watch whether the banner appears; if it does but the action fails, the action is the problem.
4. **Encoding or special characters** — Characters outside the basic set can decode differently between platforms, and iPhone may show garbled text or refuse the payload. Test: decode on both platforms and compare the text exactly.
5. **Focus, distance, or lens issue on that iPhone** — A smudged lens, a scratched camera cover, or a focus struggle at close range can look like a code failure. Test: try the same iPhone on other codes and at a different distance.

### Step-by-step fix

1. Confirm the iPhone camera scanning setting is on and the lens is clean.
2. Decode the payload and compare it with the standard layout for its type.
3. Rebuild the payload with the matching generator and simplify any unusual fields or characters.
4. Test on two iPhones at the real distance, and watch both the banner and the follow-on action.
5. Add a typed fallback beside the code for the action it performs.
6. Retest on Android to confirm the fix did not break the platform that worked.

### Putting this into practice

In practice, check the phone before you rebuild the code: a switched-off scanning setting explains a failure in seconds and saves a redesign. Once the phone is ruled out, rebuild the payload in the standard format, because that is the fix that helps every iPhone rather than just the one in your hand. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Assuming every iPhone behaves identically, when settings, iOS version, and lens condition all vary.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans on Android but not iPhone will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans on Android but not iPhone.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- iPhone camera scanning is enabled on the test phone
- The payload uses the standard format for its type
- The code scans and completes its action on two iPhones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code not scan on iPhone but works on Android?',
        answer:
          'iPhone decoding can be stricter about payload shape, and the iPhone camera scanning setting may be off. Check the setting first, then decode the payload and rebuild it in the standard format for its type. A standard-format payload built with the right generator usually passes on both platforms.',
      },
      {
        question: 'Where is the QR scanning setting on iPhone?',
        answer:
          'It lives in the camera settings on the phone. If it is switched off, the camera app ignores QR codes entirely, which looks exactly like a broken code. Switch it on, then retest before changing the artwork.',
      },
      {
        question: 'Can an iPhone fail on a code because of the action, not the scan?',
        answer:
          'Yes. The banner can appear while the follow-on action, such as joining WiFi or saving a contact, fails or is blocked. In that case the scan worked and the action needs the fix: rebuild the payload in the standard format and add a typed fallback.',
      },
    ]
  ),
  art(
    'scans-on-android-but-not-iphone-step-by-step-fix',
    'Scans On Android But Not Iphone: Step-by-Step Fix',
    'scans on android but not iphone step by step fix',
    'Repair a code that scans on Android but not iPhone with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-07-22',
    `
### What you are seeing

This fix makes the code work on iPhone without breaking Android. You will verify the iPhone camera setup, rebuild the payload in the most standard format, and confirm the full action on iPhone. Test on two iPhones if you can, because one phone's settings can mislead you. Keep Android passing at every step.

### Likely causes

1. **Payload shape iPhone rejects** — Quick test: decode the payload and compare its layout with the standard format for that type.
2. **iPhone Scan QR Codes setting switched off** — Quick test: check the iPhone camera settings for the QR scanning option.
3. **Action iPhone will not perform automatically** — Quick test: check whether the preview banner appears even though the action fails.
4. **Encoding or special characters** — Quick test: decode on both platforms and compare the text character by character.
5. **Focus, distance, or lens issue on that iPhone** — Quick test: try the same iPhone on other codes and at a different distance.

### Step-by-step fix

Step 1: On the failing iPhone, check that QR scanning is enabled in the camera settings and clean the lens.
Step 2: Point the iPhone camera at a known-good code. If that also fails, the phone setup is the problem, not your code.
Step 3: Decode your payload and rebuild it with the matching generator in the standard format.
Step 4: Simplify special characters and unusual fields, then print a fresh proof.
Step 5: Test the proof on two iPhones, watching both the preview banner and the action that follows.
Step 6: Add a short typed fallback beside the code so iPhone users can complete the action manually.
Step 7: Retest the final proof on Android and on both iPhones, and keep the version that passes everywhere.

### Putting this into practice

In practice, keep one iPhone in your test kit even if your team mostly uses Android. Cross-platform codes fail in exactly the gap between the two test setups, and one device on each side closes it. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Assuming every iPhone behaves identically, when settings, iOS version, and lens condition all vary.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans on Android but not iPhone will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans on Android but not iPhone.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- iPhone camera scanning is enabled on the test phone
- The payload uses the standard format for its type
- The code scans and completes its action on two iPhones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'What should I check first on a failing iPhone?',
        answer:
          'Check the camera scanning setting and the lens, then test a known-good code on the same phone. If the known-good code also fails, the phone is the problem. If it scans, your payload is the problem, and rebuilding it in the standard format is the next step.',
      },
      {
        question: 'Do I need separate codes for iPhone and Android?',
        answer:
          'No. One code in the standard format should work on both. Separate codes double maintenance and confuse visitors. Fix the payload format and keep a single code that passes on both platforms.',
      },
      {
        question: 'How do I confirm the fix without breaking Android?',
        answer:
          'Retest the fixed proof on Android after every change, not just at the end. If Android still passes and two iPhones now pass, the fix is complete. Keep that proof as the reference version.',
      },
    ]
  ),
  art(
    'why-your-qr-code-works-on-screen-but-not-in-print',
    'Why Your QR Code Works On Screen But Not In Print and How to Fix It',
    'why your qr code works on screen but not in print',
    'Diagnose a code that works on screen but not in print: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-07-22',
    `
### What you are seeing

The code scans perfectly from a monitor or a phone screen, then fails once printed. Printing changes the code in ways the screen hides: ink spreads, colours shift, resolution drops, glossy stock reflects, and small modules blur together. A screen test therefore proves the payload, not the print. The fix is to treat the printed proof as the real test and to design the print for the material and printer you will actually use.

### Likely causes

1. **Wrong file type or resolution for print** — A small raster image stretched to poster size turns sharp modules into soft blocks. Test: check the exported file size and type; a vector export or a high-resolution raster at the printed size behaves far better.
2. **Ink spread on absorbent stock** — Ink soaks into uncoated or recycled stock and thickens the dark modules until the light gaps close up. Test: compare the proof with the digital file under magnification; thickened modules point at ink spread.
3. **Colour shift on the real printer** — A colour pair that looks high-contrast on screen can print weakly, especially on a printer low on ink or using a limited palette. Test: print the code in plain black on white; if that scans, colour is the cause.
4. **Glossy stock reflections** — Gloss and lamination create hot spots that wash out modules under overhead light. Test: tilt the proof or shade it; if scanning improves, reflections are the cause.
5. **Size shrunk to fit the layout** — A code that scanned at full size in the design file may have been scaled down to fit a card or label, making the modules too small to resolve. Test: measure the printed code and compare it with the size you designed.

### Step-by-step fix

1. Export a fresh file for print: vector format where possible, or a high-resolution raster sized for the printed dimensions.
2. Print one proof on the exact stock and printer you will use for the run.
3. Compare the proof with the digital file, looking for thickened modules, weak colour, or reflections.
4. Reprint the proof in plain black on white at a slightly larger size and test it in the real lighting.
5. Adjust the print settings or stock, or enlarge the code, until the proof scans reliably on two phones.
6. Only then approve the full run, and spot-check the first copies off the printer.

### Putting this into practice

In practice, the screen test and the print test answer different questions, and you need both. The screen test proves the payload is right. The printed proof proves the ink, stock, size, and lighting are right. Never let a passing screen test skip the printed proof. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Approving a full print run from a screen test and discovering the failure only after hundreds of copies are printed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that works on screen but not in print will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that works on screen but not in print.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- One proof on the real stock scans on two phones
- The printed modules match the digital file without thickening or glare
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR minimum size checker](/qr-minimum-size-checker)
- [QR contrast checker](/qr-contrast-checker)
- [QR print proof checklist](/qr-print-proof-checklist)
- [QR DPI calculator](/qr-dpi-calculator)
- [QR quiet zone calculator](/qr-quiet-zone-calculator)
- [printed QR tester](/printed-qr-tester)
- [QR size calculator](/qr-size-calculator)
`,
    [
      {
        question: 'Why does a QR code scan on my monitor but not on paper?',
        answer:
          'Printing changes contrast, sharpness, size, and reflections, and any of those can break a code that looked perfect on screen. Ink spread thickens modules, colour shifts weaken contrast, and glossy stock adds reflections. A printed proof on the real stock is the only test that covers all of those changes.',
      },
      {
        question: 'Is a PDF export better than a PNG for printing QR codes?',
        answer:
          'A vector PDF usually prints more sharply than a raster PNG, because the printer renders the modules at its own resolution instead of stretching fixed pixels. If you must use a raster file, export it at the exact printed size with plenty of pixels so the modules stay crisp.',
      },
      {
        question: 'Does glossy paper really stop QR codes scanning?',
        answer:
          'It can, because reflections wash out modules under overhead light. The code may scan fine at one angle and fail at another. Matte stock, a different placement, or a larger size usually fixes it, and a tilt test on the proof will confirm whether reflections are the cause.',
      },
    ]
  ),
  art(
    'works-on-screen-but-not-in-print-step-by-step-fix',
    'Works On Screen But Not In Print: Step-by-Step Fix',
    'works on screen but not in print step by step fix',
    'Repair a code that works on screen but not in print with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-07-23',
    `
### What you are seeing

This fix takes a code that passes on screen and makes it pass on paper. You will print a single proof on the real stock, find which print property broke it, and correct the artwork or the print settings. Do not approve a full run from a screen test. Approve it from a printed proof scanned in the real lighting.

### Likely causes

1. **Wrong file type or resolution for print** — Quick test: check the export type and pixel size against the printed size.
2. **Ink spread on absorbent stock** — Quick test: compare the printed modules with the digital file under magnification.
3. **Colour shift on the real printer** — Quick test: print a plain black-on-white proof and see whether it scans.
4. **Glossy stock reflections** — Quick test: tilt the proof and shade it to see whether scanning improves.
5. **Size shrunk to fit the layout** — Quick test: measure the printed code and compare it with the designed size.

### Step-by-step fix

Step 1: Export a fresh print file as a vector, or as a raster sized for the exact printed dimensions.
Step 2: Print one proof on the real stock and the real printer. Do not judge the run from a different printer or paper.
Step 3: Scan the proof in the real lighting on two phones, and compare the printed modules with the digital file.
Step 4: If the modules look thickened, increase the code size, raise the contrast, or switch to a less absorbent stock.
Step 5: If reflections are the problem, switch to matte stock or move the code away from direct light.
Step 6: Reprint a single corrected proof and scan it at the real distance on two phones.
Step 7: Approve the run only after the corrected proof passes, and check the first copies off the printer against it.

### Putting this into practice

In practice, keep the approved printed proof with the job file and mark it as the reference. When a reprint fails, comparing the new copies with that proof tells you immediately whether the artwork, the stock, or the printer changed. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Approving a full print run from a screen test and discovering the failure only after hundreds of copies are printed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that works on screen but not in print will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that works on screen but not in print.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- One proof on the real stock scans on two phones
- The printed modules match the digital file without thickening or glare
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR minimum size checker](/qr-minimum-size-checker)
- [QR contrast checker](/qr-contrast-checker)
- [QR print proof checklist](/qr-print-proof-checklist)
- [QR DPI calculator](/qr-dpi-calculator)
- [QR quiet zone calculator](/qr-quiet-zone-calculator)
- [printed QR tester](/printed-qr-tester)
- [QR size calculator](/qr-size-calculator)
`,
    [
      {
        question: 'What is the correct way to proof a QR code for print?',
        answer:
          'Print one copy on the exact stock and printer you will use, at the exact size, then scan it in the real lighting on two phones. Compare the printed modules with the digital file. Approve the run only when that proof passes, and keep it as the reference for the run.',
      },
      {
        question: 'Should I enlarge the code or change the stock first?',
        answer:
          'Enlarge the code first if the modules look small or thickened, because size is the cheapest change. Change the stock if reflections or ink soak are clearly the problem. A single corrected proof tells you which change helped before you commit to the run.',
      },
      {
        question: 'How do I stop a reprint from failing the same way?',
        answer:
          'File the corrected artwork, the print settings, the stock, and the approved proof together. Note what failed and what you changed. The next reprint then starts from a proven setup instead of repeating the same experiment.',
      },
    ]
  ),
];
