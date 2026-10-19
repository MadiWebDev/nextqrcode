import type { Article } from '../articles';
import { art } from './helper';

export const batch134: Article[] = [
  art(
    'why-your-qr-code-shows-someone-elses-content',
    "Why Your QR Code Shows Someone Else'S Content and How to Fix It",
    'why your qr code shows someone elses content',
    "Diagnose a code that shows someone else's content: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.",
    'Fundamentals',
    '6 min read',
    '2027-08-02',
    `
### What you are seeing

The code scans, but the page belongs to someone else: another business, a stranger's profile, or content you have never seen. This is the most alarming QR failure, because visitors may assume you sent them to that content. The usual causes are mundane rather than sinister: a reused code file, a mistyped domain, a redirect that was changed, or a sticker placed over your code. Treat it as urgent regardless of the cause, because every scan until it is fixed goes to the wrong owner.

### Likely causes

1. **Sticker placed over the original code** — A printed code pasted over yours sends visitors to the other person's destination. Test: inspect the physical code for a raised edge, a second layer, or a mismatch with the printed URL beside it.
2. **Reused code file from another job** — A code file copied from another project carries its original destination. Test: check the artwork history and the destination it encodes.
3. **Typo in the domain** — A small typo can turn your domain into a domain owned by someone else. Test: compare the decoded domain with your real domain letter by letter.
4. **Redirect changed or hijacked** — A redirect rule or a shortener entry that was edited, or an account that was compromised, can send visitors elsewhere. Test: follow the redirect chain and check the change history.
5. **Short code or shortener collision** — A short link can be mistyped or can collide with someone else's short link. Test: open the encoded URL on its own and confirm whose content it serves.

### Step-by-step fix

1. Stop using the code immediately and take the physical copy down if it is in a public place.
2. Decode the payload and write down the exact URL it contains.
3. Compare the decoded domain with your real domain, letter by letter.
4. Inspect the physical code for an overlay sticker or a second layer.
5. Check the redirect settings and change history for the code.
6. Replace the code with a fresh one from your own domain and verify the destination on two phones.

### Putting this into practice

In practice, printing the destination URL beside the code is the cheapest protection against this failure. Visitors can compare the scanned address with the printed one, and a sticker overlay becomes obvious the moment the two disagree. Pair that with regular physical inspections of public codes. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Leaving a tampered code in place while investigating, so more visitors reach the wrong content.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows someone else's content will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows someone else's content.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded domain is your own domain
- The physical code shows no overlay or second layer
- The replacement destination is verified on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR safety checker](/qr-safety-checker)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR phishing pattern trainer](/qr-phishing-pattern-trainer)
- [QR allowlist builder](/qr-allowlist-builder)
- [QR tamper evidence planner](/qr-tamper-evidence-planner)
- [QR scan log](/qr-scan-log)
`,
    [
      {
        question: "Why does my QR code show someone else's content?",
        answer:
          'A sticker may have been placed over your code, the code file may have been reused from another job, the domain may be mistyped, or a redirect may have been changed. Decode the payload, compare the domain with yours, inspect the physical code for an overlay, and check the redirect history.',
      },
      {
        question: 'Has my QR code been hacked?',
        answer:
          'Not necessarily. A reused file or a typo is more common than an attack. Treat it as urgent either way: take the code down, check for tampering, and check the redirect settings. If anything was changed without your knowledge, secure the account and inspect your other codes.',
      },
      {
        question: 'How do I prove a QR code is really mine?',
        answer:
          'Print the destination URL beside the code so visitors can compare the scanned address with the printed one. Use your own recognisable domain, and keep a record of the intended destination for every code you print.',
      },
    ]
  ),
  art(
    'shows-someone-elses-content-step-by-step-fix',
    "Shows Someone Else'S Content: Step-by-Step Fix",
    'shows someone elses content step by step fix',
    "Repair a code that shows someone else's content with a step-by-step procedure, verification after each stage, and a proof test before the full run.",
    'Fundamentals',
    '7 min read',
    '2027-08-02',
    `
### What you are seeing

This fix stops the code sending visitors to someone else's content and proves the destination is yours. You will decode the payload, check for tampering, and repair the link, the redirect, or the physical code. If you find evidence of tampering, replace the physical code and check any other codes in the same location.

### Likely causes

1. **Sticker placed over the original code** — Quick test: inspect the physical code for a raised edge or a second layer.
2. **Reused code file from another job** — Quick test: check the artwork history and the destination it encodes.
3. **Typo in the domain** — Quick test: compare the decoded domain with your real domain letter by letter.
4. **Redirect changed or hijacked** — Quick test: follow the redirect chain and check the change history.
5. **Short code or shortener collision** — Quick test: open the encoded URL on its own and confirm whose content it serves.

### Step-by-step fix

Step 1: Take the physical code down or cover it so no more visitors reach the wrong content.
Step 2: Decode the payload and write down the exact URL it contains.
Step 3: Compare the decoded domain with your real domain letter by letter.
Step 4: Inspect the physical code for an overlay sticker, a second layer, or a mismatch with the printed URL beside it.
Step 5: Check the redirect settings and change history, and secure the account if anything was changed without your knowledge.
Step 6: Generate a fresh code from your own domain, with the printed URL beside it so visitors can verify the destination.
Step 7: Inspect every other code in the same location for tampering, and test the replacement on two phones.

### Putting this into practice

In practice, treat any report of someone else's content as an incident, not a glitch. Take the code down, check the other codes in the same spot, and find the cause before you put a replacement up, or the replacement can suffer the same fate. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Leaving a tampered code in place while investigating, so more visitors reach the wrong content.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that shows someone else's content will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that shows someone else's content.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded domain is your own domain
- The physical code shows no overlay or second layer
- The replacement destination is verified on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR safety checker](/qr-safety-checker)
- [QR typosquat checker](/qr-typosquat-checker)
- [QR phishing pattern trainer](/qr-phishing-pattern-trainer)
- [QR allowlist builder](/qr-allowlist-builder)
- [QR tamper evidence planner](/qr-tamper-evidence-planner)
- [QR scan log](/qr-scan-log)
`,
    [
      {
        question: "How do I fix a QR code that shows someone else's content?",
        answer:
          'Take the code down, decode the payload, and compare the domain with yours. Inspect the physical code for an overlay and check the redirect history. Generate a fresh code from your own domain and test it on two phones before putting it back up.',
      },
      {
        question: 'What if someone stuck a fake code over mine?',
        answer:
          'Remove the overlay, inspect every other code in the same location, and consider tamper-evident stock or a placement that is harder to reach. Report the incident to the venue or the platform involved, and tell visitors what happened if any were affected.',
      },
      {
        question: 'Should I reuse the same destination after a tampering incident?',
        answer:
          'Only after you have found and fixed the cause. If a redirect was changed, secure the account and restore the correct redirect. If the physical code was covered, replace it and improve the placement. A replacement installed over an unfixed cause can be tampered with again.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-blurry',
    'Why Your QR Code Prints Blurry and How to Fix It',
    'why your qr code prints blurry',
    'Diagnose a code that prints blurry: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-03',
    `
### What you are seeing

The printed code looks soft: the module edges smudge together, the corners look rounded, and the scanner struggles or fails. Blurry printing comes from the file, the printer, or the stock, and the screen version usually looks sharp, which hides the problem until the proof comes off the printer. A blurry code is not a minor cosmetic fault; every blurred module edge is information the scanner has to guess. The fix is to find which stage softens the image and to correct that stage.

### Likely causes

1. **Low-resolution raster stretched to print size** — A small image enlarged for print spreads each pixel across several printed dots, which softens every edge. Test: check the exported pixel size against the printed size.
2. **Printer set to draft or economy mode** — A draft mode lays down less ink and can leave ragged, soft edges. Test: reprint the same file at the printer's normal or high-quality setting.
3. **Ink spread on absorbent stock** — Ink soaks into uncoated stock and thickens the modules until the gaps close up. Test: compare the proof with the digital file under magnification.
4. **Scaling in the layout software** — A code resized inside a layout program can land on fractional pixels or be resampled, which blurs the edges. Test: place the code at its native size and reprint.
5. **Worn print head or low ink** — A clogged nozzle or low toner can leave faint, uneven modules. Test: print a test page and check for banding, gaps, or faint areas.

### Step-by-step fix

1. Export a fresh file for print: vector where possible, or a raster sized for the exact printed dimensions.
2. Set the printer to its normal or high-quality mode, not draft or economy.
3. Print one proof on the real stock and compare it with the digital file.
4. If the modules look thickened, switch to a less absorbent stock or enlarge the code.
5. If the edges look ragged, check the print head and the ink or toner level.
6. Approve the run only when a proof is crisp and scans on two phones.

### Putting this into practice

In practice, the proof is the whole test. A screen preview cannot show ink spread, draft-mode softness, or a clogged nozzle. Print one proof on the real stock, compare it with the digital file, and scan it before you approve anything. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Approving a print run from a screen preview and discovering the blur only after the run is printed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints blurry will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints blurry.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- The proof is crisp with clean module edges
- The proof scans on two phones
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
        question: 'Why does my QR code print blurry?',
        answer:
          'The file may be low-resolution, the printer may be in draft mode, the stock may soak up ink, or the layout software may have resampled the image. Check the export, the printer settings, and the stock, and compare a printed proof with the digital file to find which stage softens the image.',
      },
      {
        question: 'Does a blurry QR code still scan?',
        answer:
          'Sometimes, if the blur is mild and the error correction can recover the damage. Do not rely on that. A blurry code fails more often, scans more slowly, and fails first on older phones. Fix the blur instead of hoping the scanner compensates.',
      },
      {
        question: 'Will a higher-resolution export fix a blurry print?',
        answer:
          'It fixes blur caused by a low-resolution file, but not blur caused by ink spread, draft mode, or a worn print head. Diagnose the stage that softens the image, because each cause needs its own fix.',
      },
    ]
  ),
  art(
    'prints-blurry-step-by-step-fix',
    'Prints Blurry: Step-by-Step Fix',
    'prints blurry step by step fix',
    'Repair a code that prints blurry with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-03',
    `
### What you are seeing

This fix traces the blur from the file to the finished print and sharpens the stage that softens it. You will check the export, the printer settings, and the stock, then reprint a single proof and compare it with the digital file. Approve the run only when the proof is crisp.

### Likely causes

1. **Low-resolution raster stretched to print size** — Quick test: check the exported pixel size against the printed size.
2. **Printer set to draft or economy mode** — Quick test: reprint the same file at the printer's normal or high-quality setting.
3. **Ink spread on absorbent stock** — Quick test: compare the proof with the digital file under magnification.
4. **Scaling in the layout software** — Quick test: place the code at its native size and reprint.
5. **Worn print head or low ink** — Quick test: print a test page and check for banding, gaps, or faint areas.

### Step-by-step fix

Step 1: Export a fresh print file as a vector, or as a raster sized for the exact printed dimensions.
Step 2: Set the printer to its normal or high-quality mode and print one proof on the real stock.
Step 3: Compare the proof with the digital file under good light, looking for soft edges, thickened modules, or gaps.
Step 4: If the image is soft, re-export at a higher resolution and reprint one proof.
Step 5: If the modules are thickened, switch to a less absorbent stock or enlarge the code.
Step 6: If the print is ragged or uneven, clean the print head and check the ink or toner level, then reprint.
Step 7: Approve the run only when the proof is crisp and scans on two phones, and check the first copies against it.

### Putting this into practice

In practice, file the approved proof with the job and mark it as the reference. When a later reprint looks soft, comparing it with that proof tells you whether the file, the printer, or the stock changed. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Approving a print run from a screen preview and discovering the blur only after the run is printed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints blurry will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints blurry.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- The proof is crisp with clean module edges
- The proof scans on two phones
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
        question: 'How do I fix a QR code that prints blurry?',
        answer:
          'Export a fresh print file at the right resolution, set the printer to normal or high quality, and print one proof on the real stock. Compare the proof with the digital file, fix the stage that softens the image, and reprint the proof until it is crisp.',
      },
      {
        question: 'Should I use a vector file for printing QR codes?',
        answer:
          'Yes, where possible. A vector file lets the printer render the modules at its own resolution instead of stretching fixed pixels, which keeps the edges sharp at any size. If you must use a raster file, export it at the exact printed size with plenty of pixels.',
      },
      {
        question: 'How do I tell ink spread from low resolution?',
        answer:
          'Compare the proof with the digital file under magnification. Ink spread thickens the dark modules and closes the light gaps, while low resolution softens every edge evenly. Thickened modules point at the stock; evenly soft edges point at the file or the printer setting.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-too-small',
    'Why Your QR Code Prints Too Small and How to Fix It',
    'why your qr code prints too small',
    'Diagnose a code that prints too small: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-03',
    `
### What you are seeing

The printed code comes out smaller than you designed: a tiny square on a label, a card, or a receipt that no phone can read comfortably. Small codes fail because the modules shrink below the size the camera can resolve, especially in dim light or at arm's length. The usual cause is a layout squeeze: the code was shrunk to fit a crowded design, a label template, or a receipt width. The fix is to give the code the size the scan distance requires, even if that means redesigning the layout around it.

### Likely causes

1. **Layout squeezed the code to fit** — A crowded label, card, or receipt leaves little room, so the code is shrunk until it fits. Test: measure the printed code and compare it with the designed size.
2. **Label or receipt template fixed the size** — A template with a fixed image box can scale the code down without warning. Test: check the template image box size against the code size.
3. **Payload too dense for the available space** — A long payload needs a larger code to keep its modules readable, so the same space that fits a short code starves a dense one. Test: compare a short-payload version at the same printed size.
4. **Printer scaled the job to fit the page** — A fit-to-page setting can shrink the whole job, including the code, without any visible warning. Test: check the print settings and measure the printed output.
5. **Code placed where people stand far away** — A small code that works at arm's length fails at the distance people actually stand. Test: scan the code from the real audience distance.

### Step-by-step fix

1. Measure the printed code and write down its actual size.
2. Test it at the real viewing distance on two phones.
3. Shorten the payload so the modules get larger at the same size.
4. Enlarge the code to the size that passes at the real distance.
5. Redesign the layout if the code needs more room than the layout allows.
6. Reprint one proof at the corrected size and confirm it scans before approving the run.

### Putting this into practice

In practice, the code size is a requirement, not a decoration. Decide the size from the scan distance first, then design the layout around it. A layout that leaves no room for a readable code is a layout that needs redesigning, not a code that needs shrinking. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Shrinking the code to fit a crowded layout instead of redesigning the layout to fit a readable code.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints too small will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints too small.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The printed size matches the designed size
- The code scans at the real viewing distance on two phones
- No fit-to-page scaling shrinks the job
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
        question: 'Why does my QR code print too small?',
        answer:
          'The layout squeezed it, a template fixed its image box, a fit-to-page setting shrank the job, or a dense payload needs more space than the layout allows. Measure the printed code, compare it with the designed size, and check the template and print settings.',
      },
      {
        question: 'How small can a printed QR code be?',
        answer:
          'It depends on the payload length, the scan distance, the contrast, and the lighting, so there is no single safe size. Test a proof at the real distance on two phones and enlarge the code until it scans there. Size for the furthest reader, not the nearest.',
      },
      {
        question: 'Does shortening the link let me print a smaller code?',
        answer:
          'Yes, because a shorter payload means fewer modules, so each module is larger at the same print size. Shorten the payload before you accept a small size, and retest at the real distance after every change.',
      },
    ]
  ),
  art(
    'prints-too-small-step-by-step-fix',
    'Prints Too Small: Step-by-Step Fix',
    'prints too small step by step fix',
    'Repair a code that prints too small with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-04',
    `
### What you are seeing

This fix restores the code to a size that scans at the real distance. You will measure the printed code, compare it with the size you designed, and either enlarge it, shorten the payload, or redesign the layout. Do not accept a code that only scans when the phone is pressed against it.

### Likely causes

1. **Layout squeezed the code to fit** — Quick test: measure the printed code and compare it with the designed size.
2. **Label or receipt template fixed the size** — Quick test: check the template image box size against the code size.
3. **Payload too dense for the available space** — Quick test: compare a short-payload version at the same printed size.
4. **Printer scaled the job to fit the page** — Quick test: check the print settings and measure the printed output.
5. **Code placed where people stand far away** — Quick test: scan the code from the real audience distance.

### Step-by-step fix

Step 1: Measure the printed code and compare it with the size you designed. Note how much it shrank.
Step 2: Test the printed code at the real viewing distance on two phones.
Step 3: Shorten the payload as far as you can, then regenerate the code.
Step 4: Enlarge the code to the size that passes at the real distance, and check that the new size fits the layout.
Step 5: If the layout cannot fit the working size, redesign the layout: drop an element, move the code, or use a larger label.
Step 6: Check the print settings for any fit-to-page scaling, and switch it off.
Step 7: Reprint one proof at the corrected size and confirm it scans at the real distance on two phones.

### Putting this into practice

In practice, write the minimum working size on the job file alongside the viewing distance. The next person to reuse the layout then knows the code cannot shrink below that size without breaking. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Shrinking the code to fit a crowded layout instead of redesigning the layout to fit a readable code.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints too small will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints too small.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The printed size matches the designed size
- The code scans at the real viewing distance on two phones
- No fit-to-page scaling shrinks the job
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
        question: 'How do I fix a QR code that prints too small?',
        answer:
          'Measure the printed code, shorten the payload, and enlarge the code to the size that passes at the real distance. If the layout cannot fit that size, redesign the layout. Reprint one proof and confirm it scans on two phones before approving the run.',
      },
      {
        question: 'What if the label is too small for a readable code?',
        answer:
          'Shorten the payload to enlarge the modules, use the simplest layout you can, or move to a larger label. If none of those fit, the label itself is the wrong format for a QR code, and a different carrier, such as a card or a poster, is the honest fix.',
      },
      {
        question: 'How do I stop the printer shrinking my QR code?',
        answer:
          'Switch off any fit-to-page or scale-to-fit setting, set the print scale explicitly, and measure the printed output. A proof measured with a ruler catches a scaling problem that a screen preview hides.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-wrong-colors',
    'Why Your QR Code Prints With Wrong Colors and How to Fix It',
    'why your qr code prints with wrong colors',
    'Diagnose a code that prints with wrong colours: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-04',
    `
### What you are seeing

The printed code comes out in colours that differ from the design: washed-out modules, a shifted hue, a background that darkened, or a pair that looked high-contrast on screen and prints weakly. Colour problems matter because scanning depends on contrast, not on how attractive the colours look. A printer, a stock, or a colour profile can each shift the result, and the screen preview hides all three. The fix is to print a proof, compare it with the design, and correct the stage that shifted the colour.

### Likely causes

1. **Screen colours do not match print colours** — A monitor and a printer reproduce colour differently, so a pair that looks bold on screen can print weakly. Test: compare a printed proof with the screen design under good light.
2. **Wrong colour profile or mode** — A file prepared for screen can print unexpectedly when the printer expects a different colour mode. Test: check the file colour settings and the printer profile.
3. **Stock changes the colour** — Coloured, recycled, or coated stock can shift the printed colour, and a dark stock can darken the background. Test: print the same file on plain white stock and compare.
4. **Low ink or toner** — A printer low on one colour can drop or weaken that colour across the whole job. Test: print a test page and check for missing or faint colours.
5. **Colour pair too close in lightness** — Two colours that differ in hue but not in lightness can look distinct to the eye while the camera sees them as similar greys. Test: view a photo of the code in greyscale.

### Step-by-step fix

1. Print one proof on the real stock and compare it with the screen design.
2. View a photo of the proof in greyscale to judge the contrast the camera sees.
3. Check the file colour settings and the printer profile.
4. Test the same file on plain white stock to separate a stock problem from a printer problem.
5. Strengthen the pair: darker modules, lighter background, and more lightness difference.
6. Fall back to black on white if the colour pair will not print reliably, and retest.

### Putting this into practice

In practice, judge QR colours by their greyscale contrast, not by how they look in colour. The camera reads lightness differences, so a pair that differs only in hue can fail even when it looks striking. Test every colour pair as a printed proof in greyscale before you approve it. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Approving a colour pair from a screen preview without ever printing a proof on the real stock.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with wrong colours will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with wrong colours.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The printed colours match the design on the real stock
- Greyscale contrast is strong on the printed proof
- The proof scans on two phones
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
        question: 'Why does my QR code print with wrong colours?',
        answer:
          'The screen and the printer reproduce colour differently, the file colour settings may not match the printer, the stock can shift the colour, or the printer may be low on ink. Print a proof on the real stock, compare it with the design, and test the same file on plain white stock to separate the causes.',
      },
      {
        question: 'Can coloured QR codes scan reliably?',
        answer:
          'Yes, when the pair has strong lightness contrast and prints as designed. Dark modules on a light background work best. Test the pair as a printed proof in greyscale, because the camera reads lightness, not hue. Fall back to black on white if the pair will not print reliably.',
      },
      {
        question: 'Why does my QR code look fine on screen but weak in print?',
        answer:
          'The screen shows colours with light behind them, while print shows colours with ink on stock. The same pair can lose contrast in that translation, especially on coloured or absorbent stock. A printed proof on the real stock is the only reliable test.',
      },
    ]
  ),
  art(
    'prints-with-wrong-colors-step-by-step-fix',
    'Prints With Wrong Colors: Step-by-Step Fix',
    'prints with wrong colors step by step fix',
    'Repair a code that prints with wrong colours with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-04',
    `
### What you are seeing

This fix finds which stage changed the colours and restores a pair that prints with strong contrast. You will compare the proof with the design, check the printer and the stock, and reprint a single corrected proof. Fall back to black on white if a colour pair will not print reliably.

### Likely causes

1. **Screen colours do not match print colours** — Quick test: compare a printed proof with the screen design under good light.
2. **Wrong colour profile or mode** — Quick test: check the file colour settings and the printer profile.
3. **Stock changes the colour** — Quick test: print the same file on plain white stock and compare.
4. **Low ink or toner** — Quick test: print a test page and check for missing or faint colours.
5. **Colour pair too close in lightness** — Quick test: view a photo of the code in greyscale and check the contrast.

### Step-by-step fix

Step 1: Print one proof on the real stock and compare it with the screen design under good light.
Step 2: Photograph the proof and view it in greyscale. If the modules blur together, contrast is the problem.
Step 3: Check the file colour settings and the printer profile for a mismatch.
Step 4: Print the same file on plain white stock. If it improves, the stock is shifting the colour.
Step 5: Strengthen the pair: darken the modules, lighten the background, and increase the lightness difference.
Step 6: Check the ink or toner level and print a test page if a colour looks faint or missing.
Step 7: Reprint one corrected proof and confirm it scans on two phones. Fall back to black on white if the colour pair still fails.

### Putting this into practice

In practice, keep one approved colour pair per stock, proven by a printed proof. A pair that prints well on white coated stock may fail on kraft or recycled stock, and the proof is what tells you. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Approving a colour pair from a screen preview without ever printing a proof on the real stock.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with wrong colours will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with wrong colours.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The printed colours match the design on the real stock
- Greyscale contrast is strong on the printed proof
- The proof scans on two phones
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
        question: 'How do I fix a QR code that prints with wrong colours?',
        answer:
          'Print a proof on the real stock, check the file colour settings and the printer profile, and test on plain white stock to isolate the stock. Strengthen the pair or fall back to black on white, then reprint one proof and confirm it scans.',
      },
      {
        question: 'Should I use black on white for important QR codes?',
        answer:
          'Yes, when reliability matters more than decoration. Black on white gives the strongest contrast on every printer and stock, and it removes colour shift as a failure mode. Use colour only when a proof has shown the pair prints reliably.',
      },
      {
        question: 'How do I test QR colour contrast?',
        answer:
          'Photograph the printed proof and view it in greyscale. If the dark and light modules separate cleanly, the contrast is strong. A contrast checker can also score a colour pair before you print, but the printed proof is the final test.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-a-cut-off-quiet-zone',
    'Why Your QR Code Prints With A Cut-Off Quiet Zone and How to Fix It',
    'why your qr code prints with a cut off quiet zone',
    'Diagnose a code that prints with a cut-off quiet zone: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-05',
    `
### What you are seeing

The printed code works in the design file but fails on paper because the quiet zone, the clear margin around the symbol, is cut off by a page edge, a trim line, or nearby text. Scanners need that margin to find the symbol and separate it from its surroundings. Without it, the code blends into whatever sits beside it and the scanner cannot tell where the symbol starts. The fix is to restore the margin on all four sides, even if that means shrinking the surrounding design rather than the code.

### Likely causes

1. **Code placed too close to the trim edge** — A code near a page edge can lose its margin when the sheet is trimmed, especially if the trim allowance is tight. Test: compare the proof with the design file and check the margin at the trim side.
2. **Text or graphics crowding the code** — A headline, a rule, or a border that sits close to the code eats the margin on that side. Test: look for any ink, however light, inside the margin on any side.
3. **Background pattern reaching the code** — A patterned or coloured background that runs up to the code removes the clear margin even when no text is near. Test: check whether the background behind the code is plain.
4. **Code scaled without its margin** — A code image that was cropped or scaled in the layout can lose its margin while the symbol itself looks complete. Test: compare the proof margin with the margin in the exported file.
5. **Bleed or trim shift in production** — A small shift during printing or trimming can cut a margin that looked fine in the design file. Test: check several copies from the run, not just one.

### Step-by-step fix

1. Inspect all four sides of the proof and note where the margin is missing or tight.
2. Move any text, rule, or graphic away from the code on the affected sides.
3. Move the code away from the trim edge, or add trim allowance so the margin survives cutting.
4. Give the code a plain background panel if the background pattern reaches it.
5. Re-export the code with its margin included, rather than cropping the image to the symbol.
6. Reprint one proof and confirm the margin is clear on all four sides before approving the run.

### Putting this into practice

In practice, the quiet zone is part of the code, not decoration around it. When you place a code, place its margin with it, and treat anything inside the margin as a defect. A proof check that includes all four margins catches this failure before it reaches the full run. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Cropping the code image tight to the symbol in the layout and deleting the margin the scanner needs.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with a cut-off quiet zone will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with a cut-off quiet zone.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- A clear margin surrounds the code on all four sides
- No text, rule, or pattern sits inside the margin
- Several copies from the run keep the margin after trimming
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
        question: 'What is the quiet zone of a QR code?',
        answer:
          'It is the clear margin around the symbol, about four modules wide, on all four sides, that lets the scanner find the symbol and separate it from its surroundings. Without it, the scanner cannot tell where the code starts, and the code may fail even though the symbol itself is perfect.',
      },
      {
        question: 'Can a QR code scan without a quiet zone?',
        answer:
          'Sometimes, in ideal conditions with a clean background, but it is unreliable. Any nearby text, pattern, or page edge can break detection. Always keep a full quiet zone rather than relying on a code that happens to scan without one.',
      },
      {
        question: 'How do I add a quiet zone to a printed QR code?',
        answer:
          'Export the code with its margin included, place it on a plain background, and keep text, rules, and trim edges clear of the margin on all four sides. A quiet-zone adder can pad an existing image, but re-exporting with the margin is cleaner.',
      },
    ]
  ),
  art(
    'prints-with-a-cut-off-quiet-zone-step-by-step-fix',
    'Prints With A Cut-Off Quiet Zone: Step-by-Step Fix',
    'prints with a cut off quiet zone step by step fix',
    'Repair a code that prints with a cut-off quiet zone with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-05',
    `
### What you are seeing

This fix restores a full quiet zone around the printed code. You will inspect all four sides of the proof, find what is eating the margin, and move the code, the trim, or the nearby text until the margin is clear. Verify the proof on two phones, because a margin that looks adequate to the eye can still be too tight for the scanner.

### Likely causes

1. **Code placed too close to the trim edge** — Quick test: compare the proof with the design file and check the margin at the trim side.
2. **Text or graphics crowding the code** — Quick test: look for any ink inside the margin on any side.
3. **Background pattern reaching the code** — Quick test: check whether the background behind the code is plain.
4. **Code scaled without its margin** — Quick test: compare the proof margin with the margin in the exported file.
5. **Bleed or trim shift in production** — Quick test: check several copies from the run, not just one.

### Step-by-step fix

Step 1: Inspect all four sides of the proof and mark every side where the margin is missing or tight.
Step 2: Move any text, rule, or graphic away from the code on the affected sides.
Step 3: Move the code away from the trim edge, or add trim allowance so the margin survives cutting.
Step 4: If a background pattern reaches the code, place the code on a plain background panel with a clear margin.
Step 5: Re-export the code with its margin included, and check that the layout does not crop the image to the symbol.
Step 6: Reprint one proof and check the margin on all four sides, then scan it on two phones.
Step 7: Check several copies from the run for trim shift, and keep the proof as the reference.

### Putting this into practice

In practice, add a margin check to the proof routine: four sides, every copy you inspect. Trim shift means the first copy off the printer is not proof that the last copy is fine, so check more than one. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Cropping the code image tight to the symbol in the layout and deleting the margin the scanner needs.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with a cut-off quiet zone will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with a cut-off quiet zone.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- A clear margin surrounds the code on all four sides
- No text, rule, or pattern sits inside the margin
- Several copies from the run keep the margin after trimming
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
        question: 'How do I fix a QR code with a cut-off quiet zone?',
        answer:
          'Move the text, graphics, or trim edge that is eating the margin, or move the code to a spot with room for a full margin on all four sides. Re-export with the margin included, reprint one proof, and confirm the margin is clear before approving the run.',
      },
      {
        question: 'How wide should the quiet zone be?',
        answer:
          'About four modules wide on every side, measured from the outer edge of the symbol. Keep it clear of all ink, patterns, and trim edges. When in doubt, make the margin wider rather than narrower.',
      },
      {
        question: 'What if the layout has no room for a quiet zone?',
        answer:
          'Then the layout needs redesigning: move the code, shrink the surrounding elements, or use a larger carrier. A code without a quiet zone is a code that fails, so the margin is not optional space you can trade away.',
      },
    ]
  ),
];
