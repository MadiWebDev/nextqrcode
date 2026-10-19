import type { Article } from '../articles';
import { art } from './helper';

export const batch135: Article[] = [
  art(
    'why-your-qr-code-prints-with-banding-lines',
    'Why Your QR Code Prints With Banding Lines and How to Fix It',
    'why your qr code prints with banding lines',
    'Diagnose a code that prints with banding lines: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-05',
    `
### What you are seeing

The printed code shows horizontal or vertical bands running through it: stripes of lighter or darker ink that break up the modules. Banding comes from the printer, not the artwork, and the screen version looks clean, which is why it surprises people. A band that crosses a finder pattern or a data area can corrupt enough modules to make the code fail or slow down badly. The fix is a printer fix, not an artwork fix, so start at the printer.

### Likely causes

1. **Clogged or misaligned print head** — A nozzle that is blocked or a head that is misaligned lays down uneven ink, which shows as stripes. Test: print the printer's nozzle check or alignment page.
2. **Draft or high-speed print mode** — A fast or economy mode can leave visible bands where the head passes overlap unevenly. Test: reprint the same file at normal or high quality.
3. **Low ink or toner** — A cartridge running low can fade in bands as the supply varies. Test: check the ink or toner levels and print a test page.
4. **Paper feed problem** — A roller that slips or a sheet that feeds unevenly can leave a band where the feed stuttered. Test: check whether the bands appear in the same place on every copy.
5. **Wrong media setting** — A printer set for the wrong stock can lay down the wrong amount of ink for that surface, which shows as banding. Test: confirm the media setting matches the stock.

### Step-by-step fix

1. Print the printer's nozzle check and alignment page and fix any fault it shows.
2. Clean the print head using the printer's cleaning routine, then reprint the test page.
3. Switch the print mode to normal or high quality, not draft or high-speed.
4. Check the ink or toner level and replace a low cartridge.
5. Confirm the media setting matches the stock you are using.
6. Reprint one proof and confirm the bands are gone before approving the run.

### Putting this into practice

In practice, banding is a printer maintenance signal. A printer that bands on a QR code is banding on everything else too, so the fix helps every job, not just this one. Build a short printer check into the start of any important run: nozzle check, test page, then the proof. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Reprinting the full run on a banding printer in the hope that the next copies will come out clean.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with banding lines will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with banding lines.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The nozzle check and test page are clean
- The proof shows no banding lines
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
        question: 'Why does my QR code print with banding lines?',
        answer:
          "Banding comes from the printer: a clogged or misaligned head, a draft or high-speed mode, low ink, a feed problem, or a wrong media setting. Run the printer's nozzle check, clean the head, switch to normal quality, and reprint a proof to confirm the bands are gone.",
      },
      {
        question: 'Can a QR code with banding still scan?',
        answer:
          'Sometimes, if the bands are faint and miss the critical areas. Do not rely on that. A band through a finder pattern or a data area can break the code, and banding varies from copy to copy, so a proof that scans does not guarantee the whole run scans.',
      },
      {
        question: 'Is banding caused by the QR artwork?',
        answer:
          'Almost never. The screen version looks clean because the artwork is clean. Banding appears in the print, which points at the printer, the settings, or the stock. Fix the printer before you touch the artwork.',
      },
    ]
  ),
  art(
    'prints-with-banding-lines-step-by-step-fix',
    'Prints With Banding Lines: Step-by-Step Fix',
    'prints with banding lines step by step fix',
    'Repair a code that prints with banding lines with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-06',
    `
### What you are seeing

This fix removes the banding from the print by finding the printer fault that causes it. You will clean and test the printer, adjust the print settings, and reprint a single proof until the bands are gone. Do not approve a run while banding is visible, because a band that looks mild can still break the code.

### Likely causes

1. **Clogged or misaligned print head** — Quick test: print the printer's nozzle check or alignment page.
2. **Draft or high-speed print mode** — Quick test: reprint the same file at normal or high quality.
3. **Low ink or toner** — Quick test: check the ink or toner levels and print a test page.
4. **Paper feed problem** — Quick test: check whether the bands appear in the same place on every copy.
5. **Wrong media setting** — Quick test: confirm the media setting matches the stock.

### Step-by-step fix

Step 1: Print the printer's nozzle check and alignment page. Fix any fault it shows.
Step 2: Run the printer's head-cleaning routine, then reprint the test page and confirm the bands are gone.
Step 3: Switch the print mode to normal or high quality and reprint one proof of the code.
Step 4: Check the ink or toner level, and replace a low cartridge before reprinting.
Step 5: Confirm the media setting matches the stock, and adjust it if the stock changed.
Step 6: Check the paper feed: use fresh, flat stock and confirm the bands do not repeat in the same place.
Step 7: Reprint one proof and confirm it is band-free and scans on two phones before approving the run.

### Putting this into practice

In practice, keep a dated note of the last head cleaning and cartridge change with the printer. When banding appears, that note tells you whether maintenance is overdue or the fault is new. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Reprinting the full run on a banding printer in the hope that the next copies will come out clean.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with banding lines will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with banding lines.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The nozzle check and test page are clean
- The proof shows no banding lines
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
        question: 'How do I fix a QR code that prints with banding?',
        answer:
          "Run the printer's nozzle check and alignment, clean the head, switch to normal or high quality, and check the ink level and media setting. Reprint one proof and confirm the bands are gone before approving the run.",
      },
      {
        question: 'What if cleaning the head does not remove the banding?',
        answer:
          'Check the ink or toner level, the media setting, and the paper feed, and try fresh stock. If the bands persist in the same place on every copy, the printer may need servicing. Do not approve a run on a printer that still bands.',
      },
      {
        question: 'Should I print QR codes in draft mode to save ink?',
        answer:
          'No. Draft mode risks banding, faint modules, and soft edges, all of which break codes. Use normal or high quality for any code that will be scanned by visitors. The ink saved by draft mode is not worth a failed run.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-faded-modules',
    'Why Your QR Code Prints With Faded Modules and How to Fix It',
    'why your qr code prints with faded modules',
    'Diagnose a code that prints with faded modules: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-06',
    `
### What you are seeing

The printed code looks pale: the dark modules are grey rather than black, and the scanner struggles or fails. Faded modules lose contrast, which is the property the scanner depends on most. The cause is usually ink, toner, or a print setting, though a file problem can also leave the modules pale. The screen version looks bold, which hides the problem until the proof appears. The fix is to find the stage that weakens the ink and to restore solid, dark modules.

### Likely causes

1. **Low ink or toner** — A cartridge running low lays down pale, uneven modules. Test: check the ink or toner level and print a test page.
2. **Economy or toner-save mode** — A toner-save or economy setting deliberately reduces the ink, which fades the modules. Test: switch the setting off and reprint.
3. **File with pale module colour** — A design that uses grey or a pale colour for the modules prints pale even on a healthy printer. Test: check the module colour in the file.
4. **Stock that absorbs or resists ink** — A stock that soaks up ink or resists it can leave pale modules. Test: print the same file on plain white stock and compare.
5. **Wrong media setting** — A printer set for the wrong stock can lay down too little ink for that surface. Test: confirm the media setting matches the stock.

### Step-by-step fix

1. Check the module colour in the file and set it to a solid dark colour.
2. Switch off any economy or toner-save mode.
3. Check the ink or toner level and replace a low cartridge.
4. Confirm the media setting matches the stock.
5. Print one proof on the real stock and compare it with the digital file.
6. Reprint the proof until the modules are dark, then approve the run.

### Putting this into practice

In practice, faded modules are easy to miss on a quick glance, because the code still looks like a code. Judge the proof by contrast, not by shape: hold it next to the digital file and check that the dark modules are truly dark. A greyscale photo of the proof makes fading obvious. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Leaving toner-save mode on for a QR print run and wondering why the codes look pale.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with faded modules will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with faded modules.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The modules are a solid dark colour in the file
- Economy and toner-save modes are off
- The proof modules are dark with strong contrast
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
        question: 'Why does my QR code print with faded modules?',
        answer:
          'The printer may be low on ink, an economy or toner-save mode may be reducing the ink, the file may use a pale module colour, or the stock and media setting may not match. Check the file colour, the printer settings, the ink level, and the stock, and compare a proof with the digital file.',
      },
      {
        question: 'Can a faded QR code still scan?',
        answer:
          'Sometimes, in good light on a strong camera, but it is unreliable. Fading removes the contrast the scanner depends on, so faded codes fail first in dim light and on older phones. Restore solid dark modules instead of relying on a faded code that happens to scan.',
      },
      {
        question: 'Does the stock affect how dark QR modules print?',
        answer:
          'Yes. A stock that soaks up ink or resists it can leave pale modules, and a coloured stock can weaken the contrast. Test the same file on plain white stock to separate a stock problem from a printer problem.',
      },
    ]
  ),
  art(
    'prints-with-faded-modules-step-by-step-fix',
    'Prints With Faded Modules: Step-by-Step Fix',
    'prints with faded modules step by step fix',
    'Repair a code that prints with faded modules with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-06',
    `
### What you are seeing

This fix restores solid dark modules to the printed code. You will check the file, the printer settings, the ink or toner, and the stock, then reprint a single proof and compare it with the digital file. Approve the run only when the modules are dark and the contrast is strong.

### Likely causes

1. **Low ink or toner** — Quick test: check the ink or toner level and print a test page.
2. **Economy or toner-save mode** — Quick test: switch the economy setting off and reprint.
3. **File with pale module colour** — Quick test: check the module colour in the file.
4. **Stock that absorbs or resists ink** — Quick test: print the same file on plain white stock and compare.
5. **Wrong media setting** — Quick test: confirm the media setting matches the stock.

### Step-by-step fix

Step 1: Check the module colour in the file. Set the modules to a solid dark colour.
Step 2: Switch off any economy, toner-save, or draft setting on the printer.
Step 3: Check the ink or toner level and replace a low cartridge.
Step 4: Confirm the media setting matches the stock you are using.
Step 5: Print one proof on the real stock and compare the modules with the digital file.
Step 6: If the modules are still pale, test the same file on plain white stock to separate a stock problem from a printer problem.
Step 7: Reprint one proof and confirm the modules are dark and the code scans on two phones before approving the run.

### Putting this into practice

In practice, switch the economy mode off for every QR job and leave it off. Toner-save settings exist for internal drafts, not for codes that visitors must scan. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Leaving toner-save mode on for a QR print run and wondering why the codes look pale.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with faded modules will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with faded modules.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The modules are a solid dark colour in the file
- Economy and toner-save modes are off
- The proof modules are dark with strong contrast
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
        question: 'How do I fix a QR code that prints with faded modules?',
        answer:
          'Set the modules to a solid dark colour in the file, switch off economy and toner-save modes, and check the ink level and media setting. Print one proof on the real stock and confirm the modules are dark before approving the run.',
      },
      {
        question: 'Should I use toner-save mode for QR codes?',
        answer:
          'No. Toner-save mode deliberately lays down less ink, which fades the modules and weakens the contrast the scanner needs. Use normal or high quality for any code that visitors will scan.',
      },
      {
        question: 'How do I judge whether modules are dark enough?',
        answer:
          'Compare the proof with the digital file under good light, and photograph the proof in greyscale. If the dark modules look solid and separate cleanly from the light modules, the contrast is strong enough. If they look grey, the print needs fixing.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-smudged-ink',
    'Why Your QR Code Prints With Smudged Ink and How to Fix It',
    'why your qr code prints with smudged ink',
    'Diagnose a code that prints with smudged ink: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-07',
    `
### What you are seeing

The printed code shows smeared ink: modules that bleed into their neighbours, a smear across one corner, or a fingerprint of ink where the sheet was handled. Smudging destroys the sharp module edges the scanner needs, and a smudge over a finder pattern can kill the code outright. The cause is usually wet ink, the wrong stock, or handling before the print dried. The fix is to let the ink dry, match the stock to the printer, and handle the sheets carefully.

### Likely causes

1. **Ink not dry before handling or stacking** — Sheets stacked or handled while the ink is wet smear the modules. Test: let a proof dry fully before touching it and compare.
2. **Wrong stock for the printer** — A stock that does not absorb the printer's ink stays wet and smears at the lightest touch. Test: print the same file on the printer's recommended stock.
3. **Too much ink for the stock** — A high-coverage or high-quality setting can lay down more ink than the stock can hold. Test: reduce the print quality setting one step and reprint.
4. **Humidity or cold slowing drying** — Damp or cold conditions slow drying and keep the ink wet longer. Test: dry a proof in a warmer, drier spot and compare.
5. **Roller or guide smearing the sheet** — A dirty roller or a guide that touches the printed side can smear a line across the code. Test: check whether the smudge appears in the same place on every copy.

### Step-by-step fix

1. Print one proof and let it dry fully before touching or stacking it.
2. Confirm the stock is suitable for the printer and the ink.
3. Reduce the print quality setting if the stock is overloaded with ink.
4. Improve drying: warmer, drier air and more time before stacking.
5. Clean the rollers and guides if the smudge repeats in the same place.
6. Reprint one proof and confirm it is smudge-free before approving the run.

### Putting this into practice

In practice, smudging is a handling failure as often as a printer failure. Give printed sheets time to dry, stack them carefully, and avoid touching the code area. A code that prints cleanly and smudges in handling is still a failed code. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Stacking freshly printed sheets before the ink dries and smearing every code in the pile.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with smudged ink will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with smudged ink.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof dries clean without smudging
- The stock suits the printer and the ink
- Sheets are handled and stacked only after drying
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
        question: 'Why does my QR code print with smudged ink?',
        answer:
          'The ink was still wet when the sheet was handled or stacked, the stock does not suit the printer, too much ink was laid down, or a roller smeared the sheet. Let a proof dry fully, check the stock, and clean the rollers if the smudge repeats in the same place.',
      },
      {
        question: 'Can a smudged QR code still scan?',
        answer:
          'Sometimes, if the smudge is light and misses the critical areas. A smudge over a finder pattern or across several modules usually breaks the code. Do not ship smudged codes; reprint them, because smudging varies from copy to copy.',
      },
      {
        question: 'Does glossy stock smudge more than matte stock?',
        answer:
          'It can, because ink sits on the surface longer instead of soaking in. Glossy stock needs more drying time and more careful handling. If smudging persists, switch to matte stock or a stock recommended for your printer.',
      },
    ]
  ),
  art(
    'prints-with-smudged-ink-step-by-step-fix',
    'Prints With Smudged Ink: Step-by-Step Fix',
    'prints with smudged ink step by step fix',
    'Repair a code that prints with smudged ink with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-07',
    `
### What you are seeing

This fix produces a smudge-free print by fixing the drying, the stock, and the handling. You will test the current setup, change one variable at a time, and reprint a single proof until it comes out clean. Do not approve a run while smudging is visible, because a smudged code fails unpredictably.

### Likely causes

1. **Ink not dry before handling or stacking** — Quick test: let a proof dry fully before touching it and compare.
2. **Wrong stock for the printer** — Quick test: print the same file on the printer's recommended stock.
3. **Too much ink for the stock** — Quick test: reduce the print quality setting one step and reprint.
4. **Humidity or cold slowing drying** — Quick test: dry a proof in a warmer, drier spot and compare.
5. **Roller or guide smearing the sheet** — Quick test: check whether the smudge appears in the same place on every copy.

### Step-by-step fix

Step 1: Print one proof and set it aside to dry fully. Do not touch or stack it.
Step 2: Compare the dried proof with a proof handled immediately. If the dried one is clean, handling is the cause.
Step 3: Confirm the stock is suitable for the printer and the ink. Switch to a recommended stock if it is not.
Step 4: Reduce the print quality setting one step if the stock is overloaded with ink, then reprint.
Step 5: Improve drying conditions: warmer, drier air, and more time before stacking or trimming.
Step 6: Clean the rollers and guides if the smudge repeats in the same place on every copy.
Step 7: Reprint one proof, let it dry, and confirm it is smudge-free and scans on two phones before approving the run.

### Putting this into practice

In practice, build drying time into the schedule for any QR run. A run that must be trimmed, folded, or packed the moment it leaves the printer will smudge, however good the print itself is. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Stacking freshly printed sheets before the ink dries and smearing every code in the pile.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with smudged ink will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with smudged ink.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof dries clean without smudging
- The stock suits the printer and the ink
- Sheets are handled and stacked only after drying
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
        question: 'How do I fix a QR code that prints with smudged ink?',
        answer:
          'Let the proof dry fully, confirm the stock suits the printer, reduce the ink load if the stock is overloaded, and clean the rollers if the smudge repeats. Reprint one proof and confirm it is smudge-free before approving the run.',
      },
      {
        question: 'How long should I let QR prints dry?',
        answer:
          'Until the ink is fully dry to a light touch on a test sheet, in the same conditions as the run. Damp or cold air slows drying, so allow more time in those conditions. Do not stack or trim sheets before they are dry.',
      },
      {
        question: 'What if the printer itself smears the code?',
        answer:
          'Check the rollers and guides for ink build-up and clean them. Confirm the stock is suitable and the print quality setting is not overloading it. If the smear repeats in the same place on every copy, the printer path is the cause.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-low-contrast',
    'Why Your QR Code Prints With Low Contrast and How to Fix It',
    'why your qr code prints with low contrast',
    'Diagnose a code that prints with low contrast: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-07',
    `
### What you are seeing

The printed code looks washed out: the dark modules and the light background are too close in lightness, and the scanner struggles to separate them. Low contrast is the most common reason a code that looks acceptable to the eye fails on a camera, because the eye forgives a weak pair that the camera cannot. The cause can be the colour pair, the stock, the printer, or a background that darkened in print. The fix is to measure the contrast the camera sees and to strengthen the pair until the proof passes.

### Likely causes

1. **Colour pair too close in lightness** — Two colours that differ in hue but not in lightness look distinct to the eye while the camera sees similar greys. Test: view a photo of the code in greyscale.
2. **Background darkened in print** — A light background can print darker than designed, especially on coloured or recycled stock. Test: compare the printed background with the design.
3. **Modules printed pale** — Low ink, an economy mode, or a pale module colour can leave grey modules instead of dark ones. Test: check the ink level, the printer settings, and the module colour.
4. **Stock reduces the contrast** — Coloured, textured, or glossy stock can weaken the difference between modules and background. Test: print the same file on plain white stock and compare.
5. **Background pattern behind the code** — A pattern or photograph behind the code breaks up the background and confuses the scanner. Test: check whether the background behind the code is plain.

### Step-by-step fix

1. Photograph the proof and view it in greyscale to judge the contrast the camera sees.
2. Darken the modules and lighten the background, increasing the lightness difference.
3. Print the code on a plain white background panel if the stock or pattern weakens the contrast.
4. Check the ink level and switch off any economy mode.
5. Test a black-on-white proof on the same stock as a baseline.
6. Reprint one proof and confirm it scans on two phones before approving the run.

### Putting this into practice

In practice, judge every QR colour pair in greyscale, because that is what the camera sees. A pair that looks lively in colour but flat in greyscale will fail. Make the greyscale check part of every proof, and treat a weak greyscale result as a defect, not a matter of taste. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Choosing a QR colour pair by how it looks in colour and never checking it in greyscale.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with low contrast will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with low contrast.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- Greyscale contrast is strong on the printed proof
- The background behind the code is plain and light
- The proof scans on two phones in the real lighting
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
        question: 'Why does my QR code print with low contrast?',
        answer:
          'The colour pair may be too close in lightness, the background may have darkened in print, the modules may be pale, or the stock or a background pattern may weaken the difference. View a photo of the proof in greyscale to see the contrast the camera sees, then strengthen the pair.',
      },
      {
        question: 'What colour combinations scan best?',
        answer:
          'Dark modules on a plain light background scan best, with black on white as the most reliable combination. Any pair with a large lightness difference can work, but it must be proven with a printed proof in greyscale, not just a screen preview.',
      },
      {
        question: 'Can I use a dark background with light modules?',
        answer:
          'It is risky. Many scanners expect dark modules on a light background, and an inverted code can fail even when the contrast is strong. Keep dark modules on a light background unless you have tested the inverted version thoroughly on two phones.',
      },
    ]
  ),
  art(
    'prints-with-low-contrast-step-by-step-fix',
    'Prints With Low Contrast: Step-by-Step Fix',
    'prints with low contrast step by step fix',
    'Repair a code that prints with low contrast with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-08',
    `
### What you are seeing

This fix restores strong contrast to the printed code. You will judge the proof in greyscale, strengthen the module and background colours, and reprint a single proof until the scanner separates the modules cleanly. Fall back to black on white if a decorative pair will not print with enough contrast.

### Likely causes

1. **Colour pair too close in lightness** — Quick test: view a photo of the code in greyscale and check the separation.
2. **Background darkened in print** — Quick test: compare the printed background with the design.
3. **Modules printed pale** — Quick test: check the ink level, the printer settings, and the module colour.
4. **Stock reduces the contrast** — Quick test: print the same file on plain white stock and compare.
5. **Background pattern behind the code** — Quick test: check whether the background behind the code is plain.

### Step-by-step fix

Step 1: Photograph the proof and view it in greyscale. Note how cleanly the modules separate.
Step 2: Darken the modules and lighten the background to increase the lightness difference.
Step 3: If the background pattern or stock weakens the contrast, place the code on a plain white panel.
Step 4: Check the ink or toner level and switch off any economy or toner-save mode.
Step 5: Print a black-on-white proof on the same stock as a baseline and compare it with the colour version.
Step 6: Reprint one corrected proof and test it on two phones in the real lighting.
Step 7: Approve the run only when the proof passes, and fall back to black on white if the colour pair still fails.

### Putting this into practice

In practice, keep black on white as the default for any code that must work in poor light or on an unfamiliar stock. Decorative pairs are fine when a proof shows they print with strong contrast, but they should earn that trust with a proof, not with a screen preview. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Choosing a QR colour pair by how it looks in colour and never checking it in greyscale.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with low contrast will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with low contrast.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- Greyscale contrast is strong on the printed proof
- The background behind the code is plain and light
- The proof scans on two phones in the real lighting
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
        question: 'How do I fix a QR code that prints with low contrast?',
        answer:
          'Darken the modules, lighten the background, and place the code on a plain white panel if the stock or pattern weakens the contrast. Check the ink level and switch off economy mode. Reprint one proof and confirm it scans on two phones.',
      },
      {
        question: 'How do I test QR contrast before printing?',
        answer:
          'Use a contrast checker to score the colour pair, and view the design in greyscale. Both help, but the printed proof is the final test, because the stock and printer change the result.',
      },
      {
        question: 'Should I fall back to black on white?',
        answer:
          'Yes, if a colour pair will not print with strong contrast after a reasonable fix. Black on white is the most reliable combination on every printer and stock, and a code that scans is worth more than a decorative pair that fails.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-mirrored',
    'Why Your QR Code Prints Mirrored and How to Fix It',
    'why your qr code prints mirrored',
    'Diagnose a code that prints mirrored: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-08',
    `
### What you are seeing

The printed code is a mirror image of the design: left and right are swapped, and no phone can scan it. A mirrored code looks almost identical to a correct one at a glance, which is why it survives a casual proof check. The cause is usually a print or transfer step that flips the image: an iron-on transfer, a stamp, an engraving, a print-on-the-reverse process, or a flipped image in the layout. The fix is to catch the flip at the proof stage and to correct the file or the process so the finished print reads correctly.

### Likely causes

1. **Transfer or reverse print process flips the image** — Iron-on transfers, some stamps, and reverse printing deliberately flip the image, so the finished print is mirrored unless the file is pre-flipped. Test: compare the finished print with the digital file.
2. **Image flipped in the layout** — A designer can accidentally flip the code image while arranging the layout. Test: compare the layout file with the original export.
3. **Plate or engraving reversed** — A plate, screen, or engraving made from a flipped image produces a mirrored print. Test: compare the plate or screen with the digital file.
4. **Viewing the print from the reverse side** — A code printed on a transparent material can look mirrored when viewed from the back. Test: view the print from the intended side.
5. **Proof checked without scanning** — A mirrored code looks plausible to the eye, so a visual proof check misses it. Test: scan the proof instead of only looking at it.

### Step-by-step fix

1. Compare the proof with the digital file, checking the position of the three finder patterns.
2. Scan the proof. A mirrored code will not scan, which confirms the flip.
3. Find the step that flips the image: the layout, the plate, or the transfer process.
4. Correct that step: unflip the layout image, or pre-flip the file for a transfer process.
5. Print one corrected proof and scan it on two phones.
6. Approve the run only when the proof scans and the finder patterns match the file.

### Putting this into practice

In practice, the finder patterns are the giveaway: a correct code has them in three corners, and a mirrored code has them in the mirrored corners. Check the corner positions on every proof, and scan the proof instead of only looking at it. A scan test catches a mirror flip that the eye misses. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Proofing a mirrored code by eye only, without scanning it, and approving a run that no phone can read.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints mirrored will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints mirrored.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof finder patterns match the digital file
- The proof scans on two phones
- The transfer or plate orientation is correct for the process
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
        question: 'Why does my QR code print mirrored?',
        answer:
          'A transfer, stamp, engraving, or reverse-print process flips the image, or the layout accidentally flipped the code. Compare the proof with the digital file and check the finder pattern corners. Correct the layout or pre-flip the file for the process, then scan a proof to confirm.',
      },
      {
        question: 'Can a mirrored QR code still scan?',
        answer:
          'No. Mirroring reverses the data layout, so scanners cannot decode it. A mirrored code looks almost identical to a correct one, which is why a scan test, not a visual check, is the proof that matters.',
      },
      {
        question: 'How do I tell a mirrored QR code from a correct one?',
        answer:
          'Compare the finder pattern corners with the digital file. In a correct code, the three large corner squares sit where the file puts them. In a mirrored code, they sit in the mirrored corners. Scanning the proof is the surest test.',
      },
    ]
  ),
  art(
    'prints-mirrored-step-by-step-fix',
    'Prints Mirrored: Step-by-Step Fix',
    'prints mirrored step by step fix',
    'Repair a code that prints mirrored with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-08',
    `
### What you are seeing

This fix produces a print that reads correctly instead of mirrored. You will compare the proof with the digital file, find the step that flips the image, and correct that step. Verify the finished print against the file, because a file that looks right on screen can still print mirrored.

### Likely causes

1. **Transfer or reverse print process flips the image** — Quick test: compare the finished print with the digital file.
2. **Image flipped in the layout** — Quick test: compare the layout file with the original export.
3. **Plate or engraving reversed** — Quick test: compare the plate or screen with the digital file.
4. **Viewing the print from the reverse side** — Quick test: view the print from the intended side.
5. **Proof checked without scanning** — Quick test: scan the proof instead of only looking at it.

### Step-by-step fix

Step 1: Compare the proof with the digital file. Check which corners hold the finder patterns.
Step 2: Scan the proof. A mirrored code will not scan, which confirms the flip.
Step 3: Compare the layout file with the original export to see whether the layout flipped the image.
Step 4: If the process flips the image, such as a transfer, pre-flip the file so the finished print reads correctly.
Step 5: If the plate or screen is reversed, remake it from the correct orientation.
Step 6: Print one corrected proof and scan it on two phones.
Step 7: Approve the run only when the proof scans and the finder patterns match the digital file.

### Putting this into practice

In practice, add a scan test to the proof routine for every process that flips the image, such as transfers, stamps, and engraving. The scan is the test that proves the finished print reads correctly. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Proofing a mirrored code by eye only, without scanning it, and approving a run that no phone can read.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints mirrored will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints mirrored.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof finder patterns match the digital file
- The proof scans on two phones
- The transfer or plate orientation is correct for the process
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
        question: 'How do I fix a QR code that prints mirrored?',
        answer:
          'Find the step that flips the image and correct it: unflip the layout image, or pre-flip the file for a transfer process. Print one corrected proof, compare the finder patterns with the file, and scan it on two phones.',
      },
      {
        question: 'Should I pre-flip QR codes for iron-on transfers?',
        answer:
          'Yes. A transfer flips the image when it is applied, so the file must be flipped in advance for the finished print to read correctly. Print one transfer proof, apply it, and scan the finished result before running the batch.',
      },
      {
        question: 'What if the code looks right but will not scan?',
        answer:
          'Compare the finder patterns with the file and scan the proof. A mirrored code is one of several faults that look fine to the eye and fail the scan. The scan test, not the visual check, decides whether the proof passes.',
      },
    ]
  ),
];
