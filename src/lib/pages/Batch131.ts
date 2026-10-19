import type { Article } from '../articles';
import { art } from './helper';

export const batch131: Article[] = [
  art(
    'why-your-qr-code-works-in-print-but-not-on-screen',
    'Why Your QR Code Works In Print But Not On Screen and How to Fix It',
    'why your qr code works in print but not on screen',
    'Diagnose a code that works in print but not on screen: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-07-23',
    `
### What you are seeing

The printed code scans fine, yet the same code shown on a monitor, a projector, or a phone screen fails. Screens introduce their own faults: low display resolution, screen glare, moire interference between the module grid and the pixel grid, brightness set too low, and colour profiles that weaken contrast. A code that was designed for print may also be shown too small on screen, or scaled by a browser in a way that blurs the modules. The fix is to treat the screen display as its own medium with its own proof, not as a smaller version of the print.

### Likely causes

1. **Browser or app scaling blurs the modules** — A code image stretched or shrunk by a page layout can land on fractional pixels, which blurs the module edges. Test: view the code at its native size; if it scans at native size but not when scaled, scaling is the cause.
2. **Moire interference on the display** — The regular module grid can clash with the screen pixel grid and create shimmering bands that confuse the camera. Test: zoom the display slightly or move the scanning phone; if the pattern shifts and scanning improves, moire is the cause.
3. **Low brightness or glare on the screen** — A dim screen or a reflection across the display washes out the modules. Test: raise the brightness and shade the screen; if scanning improves, brightness or glare is the cause.
4. **Code displayed too small** — A code sized for a poster may be shown at thumbnail size in a slide or a web page, making the modules too small to resolve. Test: enlarge the on-screen code; if it starts scanning, size is the cause.
5. **Low-contrast colours on the display** — A colour pair that prints with strong contrast can look weaker on a particular screen, especially on a projector. Test: switch to plain black on white on the same screen; if that scans, colour is the cause.

### Step-by-step fix

1. Show the code at a size that keeps the modules crisp on that screen, and avoid fractional scaling.
2. Raise the screen brightness and remove reflections from the display.
3. Use plain black modules on a white background for screen display.
4. Add a plain white margin around the code on screen so the camera has a clean target.
5. Test on the actual screen your audience will use, at the distance they will stand.
6. Keep a print version and a screen version as separate exports if their sizes differ.

### Putting this into practice

In practice, screens punish small codes and low contrast more than paper does, because the camera is reading light emitted by the display rather than light reflected from ink. Give the on-screen code more size and more contrast than you think it needs, and test it on the weakest screen in the room, not the best one. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Assuming a code that passes on paper will automatically pass on a projector or a dim monitor.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that works in print but not on screen will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that works in print but not on screen.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The on-screen code is shown large enough to resolve cleanly
- Brightness is up and reflections are controlled
- The screen version passes on two phones at audience distance
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
        question: 'Why does a QR code scan on paper but not on a projector screen?',
        answer:
          'Projectors add low contrast, glare, moire interference, and a soft image, all of which hurt scanning. The code may also be displayed too small for the viewing distance. Enlarge it, raise the contrast, and test from the back of the room, because that is where the weakest scan happens.',
      },
      {
        question: 'Does screen brightness affect QR scanning?',
        answer:
          'Yes. A dim screen washes out the difference between dark and light modules, and a very bright screen can add glare. Raise the brightness to a comfortable level, shade the screen from direct light, and retest. Plain black on white is the most forgiving combination on a display.',
      },
      {
        question: 'Should I use a different QR file for screen and print?',
        answer:
          'Usually, yes. Print needs a high-resolution or vector file, while screen needs a version sized so the modules land cleanly on the display pixels. Keeping two exports avoids the compromise where one file is slightly wrong for both media.',
      },
    ]
  ),
  art(
    'works-in-print-but-not-on-screen-step-by-step-fix',
    'Works In Print But Not On Screen: Step-by-Step Fix',
    'works in print but not on screen step by step fix',
    'Repair a code that works in print but not on screen with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-07-23',
    `
### What you are seeing

This fix makes the on-screen code scan as reliably as the printed one. You will check the display size, the scaling, the brightness, and the background, then prepare a screen-specific version of the code if needed. Test on the actual screen and device your audience will use, because a laptop monitor and a projector behave very differently.

### Likely causes

1. **Browser or app scaling blurs the modules** — Quick test: view the code at its native size and compare scanning with the scaled display.
2. **Moire interference on the display** — Quick test: zoom the display slightly and see whether scanning improves.
3. **Low brightness or glare on the screen** — Quick test: raise screen brightness and shade the screen, then retest.
4. **Code displayed too small** — Quick test: enlarge the on-screen code and see whether it starts scanning.
5. **Low-contrast colours on the display** — Quick test: show a plain black-on-white version on the same screen.

### Step-by-step fix

Step 1: Display the code at its native size on the real screen and test it from the audience distance.
Step 2: If it fails, enlarge the on-screen code and retest. Note the size where it starts scanning.
Step 3: Raise the screen brightness, shade the screen, and remove reflections.
Step 4: Replace the colour version with plain black on white and retest on the same screen.
Step 5: If moire shimmer appears, change the display size slightly or move the scanning phone until the pattern clears.
Step 6: Export a screen-specific version at the size that passed, and test it on two phones.
Step 7: Save the screen version separately from the print version so future edits do not mix them up.

### Putting this into practice

In practice, keep two exports for every code that appears in both media: a print export and a screen export. They have different size and contrast needs, and a single file that compromises between them often fails on the screen while passing on paper. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Assuming a code that passes on paper will automatically pass on a projector or a dim monitor.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that works in print but not on screen will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that works in print but not on screen.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The on-screen code is shown large enough to resolve cleanly
- Brightness is up and reflections are controlled
- The screen version passes on two phones at audience distance
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
        question: 'How do I fix a QR code that will not scan on a screen?',
        answer:
          'Enlarge it, switch to black on white, raise the brightness, and remove reflections. Then test on the actual screen at the audience distance. If it still fails, change the display size slightly to break up moire interference and retest.',
      },
      {
        question: 'What size should a QR code be on a slide?',
        answer:
          'Large enough that the modules stay crisp from the back of the room, with a clear white margin around the symbol. There is no single size that fits every room, so test from the furthest seat your audience will use and enlarge the code until it scans there.',
      },
      {
        question: 'Can I reuse the print file on a screen?',
        answer:
          'You can try, but check the result on the real screen first. A print file scaled down by a page layout can blur the modules. A screen-specific export at the size that passed your test is the safer choice.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-in-daylight-but-not-at-night',
    'Why Your QR Code Scans In Daylight But Not At Night and How to Fix It',
    'why your qr code scans in daylight but not at night',
    'Diagnose a code that scans in daylight but not at night: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-07-24',
    `
### What you are seeing

The code works in bright daylight and fails after dark, or works under strong indoor light and fails in a dim corridor. Night scanning fails for physical reasons: the camera gets less light, the autofocus hunts, reflections from a nearby lamp can be worse than daylight glare, and a code printed in weak colours loses what little contrast it had. The destination is rarely the problem, because the scan itself never completes. The fix is to make the code readable in the worst light it will face, not in the best.

### Likely causes

1. **Too little light for the camera** — In dim light the camera raises its sensitivity, which adds noise and softens the module edges. Test: shine a phone torch on the code; if it scans with extra light, low light is the cause.
2. **Weak contrast that daylight masked** — Bright daylight can carry a low-contrast code that dim light cannot, because the camera has less signal to work with. Test: compare a black-on-white proof with the original in the same dim light.
3. **Glare from a nearby lamp** — A single bright lamp at night creates a hard reflection that daylight spreads more evenly. Test: shade the code or change the viewing angle; if it scans, glare is the cause.
4. **Code too small for dim-light focusing** — Small modules need good light and a steady focus, both of which are harder at night. Test: step closer in the dark; if it scans at close range, size and light together are the cause.
5. **Reflective or glossy surface** — Glossy lamination and glass covers reflect a nearby lamp straight into the camera at night. Test: view the code from a slight angle so the reflection moves off the symbol.

### Step-by-step fix

1. Test the code at night in the exact spot where it will be used, on two phones.
2. Enlarge the code so the modules stay resolvable in dim light.
3. Switch to dark modules on a plain light background with the strongest contrast you can use.
4. Move the code away from direct lamps and glossy reflections, or switch to matte stock.
5. Add lighting near the code, or move the code to a spot that already has steady light.
6. Retest at night after every change, and keep the version that passes in the dark.

### Putting this into practice

In practice, daylight is the easy case and night is the real test. A code that only passes in daylight will fail exactly when visitors need it most, such as an evening event or a night entrance. Always run the night test in the real location, because a corridor, a car park, and a street frontage each fail in different ways. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Testing a night placement under bright office light and calling it fixed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans in daylight but not at night will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans in daylight but not at night.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code passes a test in the real night location
- Contrast is strong with dark modules on a light background
- No lamp reflection falls across the symbol at night
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
        question: 'Why does my QR code stop scanning at night?',
        answer:
          'The camera gets less light, which adds noise and softens the module edges, and any weakness in contrast, size, or glare that daylight masked becomes decisive. Test the code in the real night conditions, enlarge it, raise the contrast, and control reflections from nearby lamps.',
      },
      {
        question: 'Will a phone torch help visitors scan at night?',
        answer:
          'It can help a single visitor, but it is not a fix for the code. Design the code so it scans in the ambient night light of the location, with a larger size, stronger contrast, and a position away from glare. Visitors should not need a torch to use your code.',
      },
      {
        question: 'Does reflective stock make night scanning worse?',
        answer:
          'Yes, because a nearby lamp reflects off gloss and lamination straight into the camera. Matte stock, a different angle, or moving the code away from the lamp usually fixes it. Test the proof at night from a slight angle to confirm.',
      },
    ]
  ),
  art(
    'scans-in-daylight-but-not-at-night-step-by-step-fix',
    'Scans In Daylight But Not At Night: Step-by-Step Fix',
    'scans in daylight but not at night step by step fix',
    'Repair a code that scans in daylight but not at night with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-07-24',
    `
### What you are seeing

This fix makes the code scan after dark as well as it scans in daylight. You will test the code in the actual night conditions, then change the size, contrast, placement, and lighting so the camera gets a clean image. Do not judge the fix under office light; judge it where the code will actually be scanned at night.

### Likely causes

1. **Too little light for the camera** — Quick test: shine a phone torch on the code and see whether it scans.
2. **Weak contrast that daylight masked** — Quick test: compare a black-on-white proof with the original in the same dim light.
3. **Glare from a nearby lamp** — Quick test: shade the code and change the viewing angle at night.
4. **Code too small for dim-light focusing** — Quick test: step closer in the dark and see whether it starts scanning.
5. **Reflective or glossy surface** — Quick test: view the code from a slight angle so any reflection moves off the symbol.

### Step-by-step fix

Step 1: Go to the real location after dark and test the code on two phones. Note the exact light and angle.
Step 2: Shine a phone torch on the code. If it scans with extra light, low light is confirmed as the cause.
Step 3: Print a larger black-on-white proof and test it in the same night conditions.
Step 4: Move the proof away from lamps and reflections, or switch to matte stock if glare persists.
Step 5: If the location stays dark, add a steady light near the code or move the code to a lit spot.
Step 6: Retest the fixed proof at night on two phones, from the distance people will actually stand.
Step 7: Approve the fix only on the night test, and note the night conditions in the job file.

### Putting this into practice

In practice, write the night result into the job file: the location, the light, and the phones you tested. The next person to reprint the code then knows the fix was proven in the dark, not just under office lights. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Testing a night placement under bright office light and calling it fixed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans in daylight but not at night will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans in daylight but not at night.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code passes a test in the real night location
- Contrast is strong with dark modules on a light background
- No lamp reflection falls across the symbol at night
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
        question: 'How do I test a QR code for night use?',
        answer:
          'Go to the real location after dark and test on two phones from the distance visitors will stand. Try it with and without a phone torch so you know how much the ambient light matters. Approve the fix only when it passes without the torch.',
      },
      {
        question: 'Should I add lighting or enlarge the code first?',
        answer:
          'Enlarge the code and raise the contrast first, because those changes travel with the code wherever it goes. Add lighting if the location stays too dark after that, since lighting fixes only one location while a stronger code works everywhere.',
      },
      {
        question: 'What if the code must stay small at night?',
        answer:
          'Shorten the payload so the modules get larger at the same size, raise the contrast, and use matte stock. If it still fails, the size itself is the limit, and you will need a larger code or a better-lit position.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-up-close-but-not-from-a-distance',
    'Why Your QR Code Scans Up Close But Not From A Distance and How to Fix It',
    'why your qr code scans up close but not from a distance',
    'Diagnose a code that scans up close but not from a distance: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-07-24',
    `
### What you are seeing

The code scans when you hold the phone near it and fails when you step back to the distance where people will actually stand. Distance scanning fails because the camera cannot resolve modules that are too small, too dense, or too low in contrast for the range. Posters, banners, windows, and billboards all suffer from this, because the designer judges the code at arm's length while the audience stands metres away. The fix is to size the code for the furthest reader, not the nearest one.

### Likely causes

1. **Code too small for the viewing distance** — Modules shrink with distance until the camera cannot separate them. Test: step closer until it scans, and note the distance where it first locks on.
2. **Payload too dense** — A long payload packs many small modules into the symbol, which vanish first at distance. Test: compare a short-payload version at the same size and distance.
3. **Weak contrast over distance** — Contrast that looks adequate up close fades with distance, haze, and glare. Test: compare a black-on-white proof at the same distance.
4. **Glare or reflections at the viewing angle** — From further away, the viewing angle changes and reflections can cover the symbol. Test: view the code from the audience position and check for reflections.
5. **Code placed too high, low, or behind an obstruction** — A code behind a barrier, at an awkward height, or at a sharp angle forces the camera to read a distorted symbol. Test: stand where the audience stands and check the angle and obstructions.

### Step-by-step fix

1. Measure the distance from the code to the furthest reader, and use that distance for every test.
2. Shorten the payload so the modules get larger at the same print size.
3. Enlarge the printed code until it locks on from the furthest point.
4. Raise the contrast with dark modules on a plain light background.
5. Move the code to a clear, well-lit position at a comfortable height and a straight-on angle.
6. Retest from the furthest point on two phones before approving the run.

### Putting this into practice

In practice, the distance test is the one that matters for posters, windows, and signs. A code that scans at arm's length but not from the queue or the pavement is a code that most visitors will never use. Always test from the furthest realistic point, and size for that reader. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Sizing a poster code by how it looks on a desk, then discovering visitors cannot scan it from the queue.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans up close but not from a distance will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans up close but not from a distance.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code locks on from the furthest reader position
- The payload is as short as the destination allows
- The code sits at a clear, straight-on, well-lit position
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
        question: 'How large should a QR code be for scanning from a distance?',
        answer:
          'It depends on the distance, the payload length, the contrast, and the lighting, so there is no single size that fits every case. As a working method, print a proof, test it from the furthest point your audience will stand, and enlarge it until it locks on there. Size for the furthest reader, not the nearest.',
      },
      {
        question: 'Does shortening the link help distance scanning?',
        answer:
          'Yes. A shorter payload means fewer modules, so each module is larger at the same print size, and larger modules survive distance far better. Shorten the link before you enlarge the print, because it is free and it helps every distance.',
      },
      {
        question: 'Why does my poster QR code only scan when people walk up to it?',
        answer:
          "The code is too small or too dense for the distance people first see it from. Visitors judge the code from where they stand, not from arm's length. Enlarge the code, shorten the payload, raise the contrast, and test from the furthest point.",
      },
    ]
  ),
  art(
    'scans-up-close-but-not-from-a-distance-step-by-step-fix',
    'Scans Up Close But Not From A Distance: Step-by-Step Fix',
    'scans up close but not from a distance step by step fix',
    'Repair a code that scans up close but not from a distance with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-07-25',
    `
### What you are seeing

This fix makes the code scan from the real viewing distance. You will measure the distance your audience stands at, then resize the code and simplify the payload until it locks on from there. Test from the furthest point, not the nearest, because the furthest reader is the one you are currently losing.

### Likely causes

1. **Code too small for the viewing distance** — Quick test: step closer until it scans and note the distance where it first locks on.
2. **Payload too dense** — Quick test: compare a short-payload version at the same size and distance.
3. **Weak contrast over distance** — Quick test: compare a black-on-white proof at the same distance.
4. **Glare or reflections at the viewing angle** — Quick test: view the code from the audience position and check for reflections.
5. **Code placed too high, low, or behind an obstruction** — Quick test: stand where the audience stands and check the angle and obstructions.

### Step-by-step fix

Step 1: Stand where the furthest reader will stand and test the code on two phones. Write down the distance.
Step 2: Shorten the payload as far as you can, then regenerate the code.
Step 3: Print a larger proof and test it from the same furthest point.
Step 4: Increase the contrast and remove any reflections visible from the audience position.
Step 5: Reposition the code to a clear, straight-on spot at a comfortable height if the angle or an obstruction is hurting the scan.
Step 6: Retest the proof from the furthest point on two phones, and also from a mid-range point.
Step 7: Approve the run only when the furthest-point test passes, and record the distance and size in the job file.

### Putting this into practice

In practice, record the viewing distance and the final size together in the job file. When the same design is reused at a different distance, those two numbers tell you immediately whether the code needs to grow. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Sizing a poster code by how it looks on a desk, then discovering visitors cannot scan it from the queue.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans up close but not from a distance will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans up close but not from a distance.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The code locks on from the furthest reader position
- The payload is as short as the destination allows
- The code sits at a clear, straight-on, well-lit position
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
        question: 'How do I test a QR code for distance scanning?',
        answer:
          'Stand at the furthest point your audience will use, hold the phone as they would, and test on two phones. Note the distance. Enlarge the code or shorten the payload until it locks on from that point, then confirm it still scans up close.',
      },
      {
        question: 'Should I enlarge the code or move it closer to people?',
        answer:
          'Do both if you can: enlarge the code for the distance, and move it to a spot where people naturally pause closer to it. A code beside a queue or an entrance gets closer readers than a code high on a wall.',
      },
      {
        question: 'What if the code must stay small on a poster?',
        answer:
          'Shorten the payload to enlarge the modules, raise the contrast, and place the code where people stand closest to the poster. If it still fails from the furthest point, the size itself is the limit and the code needs to grow or move.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-from-a-distance-but-not-up-close',
    'Why Your QR Code Scans From A Distance But Not Up Close and How to Fix It',
    'why your qr code scans from a distance but not up close',
    'Diagnose a code that scans from a distance but not up close: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-07-25',
    `
### What you are seeing

The code scans from across the room yet fails when you hold the phone close to it. This is the reverse of the usual distance problem, and it usually comes from the camera, not the code: at close range the phone cannot focus, the code overflows the camera frame, or the lens distorts the edges. A very large code on a wall or a board is the classic case, because visitors walk right up to it and the phone cannot fit the whole symbol in view. The fix is to make the close-range experience work without breaking the distance scan.

### Likely causes

1. **Phone cannot focus that close** — Every camera has a minimum focus distance, and a phone held too close to a large code produces a blurred image. Test: pull the phone back slowly; if the code locks on as you retreat, focus distance is the cause.
2. **Code overflows the camera frame** — A large code held at close range does not fit in the viewfinder, so the scanner never sees the whole symbol. Test: check whether all three corner squares are visible in the frame at the failing distance.
3. **Lens distortion at close range** — Wide-angle phone lenses can bend the edges of a large code when held very close, which distorts the module grid. Test: move back slightly or switch to the standard lens; if it scans, distortion is the cause.
4. **Glare at close range** — Holding the phone close can put the flash or a nearby light reflection right across the symbol. Test: tilt the phone or switch the flash off; if it scans, glare is the cause.
5. **Visitors stand too close because of the placement** — A code in a narrow corridor or right beside a door forces people to stand closer than the code needs. Test: watch where people naturally stand and compare it with the working range.

### Step-by-step fix

1. Find the closest distance where the code scans, and the furthest distance where it still scans.
2. Add a short instruction such as step back to scan, placed where visitors will see it before they raise the phone.
3. If the code is very large, reduce it to a size that fits a phone frame at arm's length.
4. Move the code to a spot where people can naturally stand at a comfortable scanning distance.
5. Reduce glare with matte stock or a position away from direct light.
6. Retest at arm's length and at the full distance on two phones.

### Putting this into practice

In practice, the close-range failure is a placement problem as much as a code problem. A large code on a narrow wall forces people to stand too close, while the same code on an open wall works fine. Fix the distance people stand at, not just the code, and the close-range failures disappear. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Enlarging the code to fix distance scanning until it no longer fits a phone frame up close.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans from a distance but not up close will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans from a distance but not up close.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The whole symbol fits the camera frame at arm's length
- The code passes at both arm's length and the full distance
- A short instruction tells visitors where to stand
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
        question: 'Why does my QR code scan from far away but not up close?',
        answer:
          'At close range the phone may be inside its minimum focus distance, the code may overflow the camera frame, or the lens may distort the edges. Pull the phone back slowly and the code will usually lock on. A smaller code, a better position, or a step-back instruction fixes the close-range case.',
      },
      {
        question: 'Can a QR code be too big to scan?',
        answer:
          'Yes, when it is so large that the whole symbol does not fit in the camera frame at the distance people stand. The scanner needs all three corner squares in view. Reduce the size or move the code to a spot where people can step back far enough to fit it in frame.',
      },
      {
        question: 'Does phone zoom help with close-range scanning?',
        answer:
          "Zooming in makes it worse, because it crops the symbol further. Pull back instead of zooming, and let the whole code fit in the frame. If the code is too large to fit at arm's length, reduce the printed size.",
      },
    ]
  ),
  art(
    'scans-from-a-distance-but-not-up-close-step-by-step-fix',
    'Scans From A Distance But Not Up Close: Step-by-Step Fix',
    'scans from a distance but not up close step by step fix',
    'Repair a code that scans from a distance but not up close with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-07-25',
    `
### What you are seeing

This fix makes the code scan both up close and from a distance. You will find the closest distance that fails, then adjust the size, the placement, and the instructions so visitors naturally scan from a range that works. Test at arm's length and at the full distance, because a fix that only helps one end leaves the other broken.

### Likely causes

1. **Phone cannot focus that close** — Quick test: pull the phone back slowly and note where the code first locks on.
2. **Code overflows the camera frame** — Quick test: check whether all three corner squares fit in the camera frame.
3. **Lens distortion at close range** — Quick test: move back slightly or use the standard lens and retest.
4. **Glare at close range** — Quick test: tilt the phone and switch the flash off, then retest.
5. **Visitors stand too close because of the placement** — Quick test: watch where people naturally stand and compare it with the working range.

### Step-by-step fix

Step 1: Test the code at several distances and write down the range where it scans, from closest to furthest.
Step 2: If the code overflows the frame up close, reduce the printed size until the whole symbol fits at arm's length.
Step 3: Move the code to a spot where visitors can stand at a comfortable distance, away from walls and doorways that force them too close.
Step 4: Add a short step-back instruction beside the code so visitors hold the phone at the right range.
Step 5: Control glare with matte stock or a new angle, and retest with the flash off.
Step 6: Retest at arm's length and at the full distance on two phones.
Step 7: Keep the version that passes at both ends, and record the working range in the job file.

### Putting this into practice

In practice, write the working range on the job file: the closest and furthest distances that passed. That range tells the next person whether the code fits the space it will live in. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Enlarging the code to fix distance scanning until it no longer fits a phone frame up close.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans from a distance but not up close will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans from a distance but not up close.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The whole symbol fits the camera frame at arm's length
- The code passes at both arm's length and the full distance
- A short instruction tells visitors where to stand
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
        question: 'How do I find the working range of a QR code?',
        answer:
          'Test it at several distances, starting very close and stepping back slowly, and write down where it first locks on and where it stops locking on. That range is the working range. Fix the size and placement so your audience naturally stands inside it.',
      },
      {
        question: 'Should I shrink a large code that fails up close?',
        answer:
          "Yes, if it overflows the frame at arm's length. Shrink it until the whole symbol fits at a comfortable distance, then confirm it still scans from the furthest point. A code that passes at both ends is the goal.",
      },
      {
        question: 'What instruction should I put beside a large QR code?',
        answer:
          'A short line telling visitors where to stand, such as step back to scan, placed where they see it before raising the phone. Keep it brief and place it close to the code so people connect the instruction with the action.',
      },
    ]
  ),
  art(
    'why-your-qr-code-opens-the-wrong-url',
    'Why Your QR Code Opens The Wrong Url and How to Fix It',
    'why your qr code opens the wrong url',
    'Diagnose a code that opens the wrong URL: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-07-26',
    `
### What you are seeing

The code scans, but the page that opens is not the page you intended: an old page, a different product, a staging site, or a stranger's content. A wrong destination is one of the most damaging QR failures, because visitors blame you for sending them somewhere unexpected, and a printed run can carry the wrong link for months. The cause is almost always upstream of the code: a typo in the payload, an old file reused, a redirect that points elsewhere, or a dynamic code whose destination was changed. The fix is to verify the payload and the redirect chain before you reprint.

### Likely causes

1. **Typo in the encoded URL** — One wrong character in the payload sends visitors to a different address or a dead page. Test: decode the payload and read the URL character by character against the intended address.
2. **Old artwork reused for a new campaign** — A code file from an earlier job gets reused with its old destination still inside. Test: check the file history and the date the artwork was created.
3. **Redirect chain points elsewhere** — The encoded URL may be correct while a redirect rule, a shortener, or a campaign tool sends visitors to the wrong page. Test: follow the redirect chain hop by hop and note where it diverges.
4. **Dynamic code destination was changed** — A dynamic code points at a redirect that someone updated, intentionally or by mistake. Test: check the redirect settings and change history for the code.
5. **Lookalike domain or typosquat** — A domain that looks almost right, with a swapped letter or a different ending, can send visitors to someone else's site. Test: compare the decoded domain with your real domain letter by letter.

### Step-by-step fix

1. Decode the payload and write down the exact URL it contains.
2. Compare that URL with the intended destination, character by character.
3. Follow the redirect chain from the encoded URL to the final page and note every hop.
4. Fix the fault at its source: the payload, the redirect rule, or the destination page.
5. Regenerate the code from the corrected URL and test the full journey on two phones.
6. If printed copies already exist, replace them and add a check that stops old artwork being reused.

### Putting this into practice

In practice, wrong-URL failures are process failures: an old file reused, a redirect edited without a note, or a proof that nobody followed to the final page. Keep one record per code that names its intended destination, and check every proof against that record before printing. That single habit prevents most wrong-destination reprints. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Fixing the printed code without checking the redirect chain, so the new code lands on the same wrong page.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that opens the wrong URL will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that opens the wrong URL.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded payload matches the intended destination exactly
- Every redirect hop lands on the intended page
- The final page is the intended one on two phones
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
        question: 'Why does my QR code open the wrong website?',
        answer:
          'The encoded URL is wrong, a redirect sends visitors elsewhere, or an old code file was reused with its previous destination. Decode the payload, compare it with the intended address, and follow the redirect chain to find where the journey diverges. Fix the fault at its source rather than patching the symptom.',
      },
      {
        question: 'Can a QR code be hijacked to open a different URL?',
        answer:
          'Yes, if a sticker is placed over the original code, or if a dynamic code redirect is changed by someone with access. Compare the scanned URL with the printed URL beside the code, and protect dynamic code accounts with strong access control. If you suspect tampering, replace the code and check the redirect settings.',
      },
      {
        question: 'How do I check where a QR code really goes?',
        answer:
          'Decode the payload to read the encoded URL, then open it in a browser and watch the address bar through every redirect to the final page. A redirect chain viewer shows the hops without opening the page. Check the final page, not just the first hop.',
      },
    ]
  ),
  art(
    'opens-the-wrong-url-step-by-step-fix',
    'Opens The Wrong Url: Step-by-Step Fix',
    'opens the wrong url step by step fix',
    'Repair a code that opens the wrong URL with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-07-26',
    `
### What you are seeing

This fix traces the code from scan to final page and corrects the link at the point where it goes wrong. You will decode the payload, follow every redirect, and fix the payload, the redirect, or the destination page, whichever is actually at fault. Verify the full journey on two phones before you reprint, because a fix that only corrects the first hop can still land on the wrong page.

### Likely causes

1. **Typo in the encoded URL** — Quick test: decode the payload and compare the URL with the intended address character by character.
2. **Old artwork reused for a new campaign** — Quick test: check when the artwork file was created and which campaign it belonged to.
3. **Redirect chain points elsewhere** — Quick test: follow the redirect chain hop by hop and note where it diverges.
4. **Dynamic code destination was changed** — Quick test: check the redirect settings and change history for the dynamic code.
5. **Lookalike domain or typosquat** — Quick test: compare the decoded domain with your real domain letter by letter.

### Step-by-step fix

Step 1: Decode the payload and write down the exact URL it contains.
Step 2: Compare that URL with the intended destination character by character, including the domain ending.
Step 3: Open the encoded URL in a browser and follow every redirect to the final page, noting each hop.
Step 4: If the encoded URL is wrong, regenerate the code from the correct URL.
Step 5: If the encoded URL is right but a redirect is wrong, fix the redirect rule or the shortener setting.
Step 6: If the destination page itself is wrong, fix the page or restore the correct content.
Step 7: Test the corrected code on two phones, following it all the way to the final page, and confirm the page is the intended one.

### Putting this into practice

In practice, keep the intended destination written on the job file and check the proof against it out loud if you can. A second pair of eyes on a URL catches the typo that the person who typed it keeps missing. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Fixing the printed code without checking the redirect chain, so the new code lands on the same wrong page.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that opens the wrong URL will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that opens the wrong URL.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded payload matches the intended destination exactly
- Every redirect hop lands on the intended page
- The final page is the intended one on two phones
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
        question: 'How do I fix a QR code that opens the wrong URL?',
        answer:
          'Decode the payload, compare it with the intended address, and follow the redirect chain. Regenerate the code if the payload is wrong, fix the redirect if a hop is wrong, and fix the page if the destination itself is wrong. Test the corrected code on two phones all the way to the final page.',
      },
      {
        question: 'Should I reprint or fix a redirect for a wrong-URL code?',
        answer:
          'Fix the redirect if the printed code points at a redirect you control, because the printed copies then heal without reprinting. Reprint if the encoded URL itself is wrong, because no redirect fix can change what is printed on the paper.',
      },
      {
        question: 'How do I stop old QR artwork being reused with the wrong link?',
        answer:
          'Name files with the campaign and destination, keep one record per code naming its intended URL, and check every proof against that record. Retire old artwork instead of leaving it in the shared folder where it can be picked up by mistake.',
      },
    ]
  ),
];
