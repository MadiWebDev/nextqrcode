import type { Article } from '../articles';
import { art } from './helper';

export const batch136: Article[] = [
  art(
    'why-your-qr-code-prints-inverted',
    'Why Your QR Code Prints Inverted and How to Fix It',
    'why your qr code prints inverted',
    'Diagnose a code that prints inverted: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-09',
    `
### What you are seeing

The printed code shows light modules on a dark background, the reverse of the design. Inverted codes look striking, but many scanners expect dark modules on a light background and fail on an inverted symbol, even when the contrast is strong. The inversion can come from a design choice, a print setting, or a material that reverses the image. The fix is to restore the standard polarity and to test any inverted design thoroughly before you commit to it.

### Likely causes

1. **Design uses inverted colours** — A design that deliberately puts light modules on a dark background inverts the code. Test: compare the proof with the standard dark-on-light version.
2. **Print setting inverts the image** — A negative, invert, or reverse setting in the printer or layout can flip the polarity. Test: check the print and layout settings for an invert option.
3. **Material reverses the appearance** — A dark stock with a light ink, or an engraving that removes the dark surface, can produce an inverted appearance. Test: compare the finished print with the design file.
4. **Background panel darkened in print** — A background that prints darker than designed can swallow the distinction between modules and background. Test: compare the printed background with the design.
5. **Proof never scanned** — An inverted code can look fine to the eye, so a visual proof check misses the polarity fault. Test: scan the proof.

### Step-by-step fix

1. Compare the proof with the design file and confirm the polarity is inverted.
2. Scan the proof to confirm whether it fails.
3. Check the design, the layout, and the print settings for an invert option.
4. Restore dark modules on a light background in the file or the settings.
5. Print one corrected proof and scan it on two phones.
6. Approve an inverted design only if it passes a scan test on two phones.

### Putting this into practice

In practice, dark on light is the safe polarity, and inverted codes are a gamble. Some scanners handle them and some do not, so an inverted code that passes on your phone can fail on a visitor's. Use the standard polarity unless you have a strong reason and a passing scan test on two phones. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Shipping an inverted code because it looked stylish, without ever scanning the proof.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints inverted will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints inverted.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The modules are dark on a light background
- No invert setting is active in the layout or printer
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
        question: 'Why does my QR code print inverted?',
        answer:
          'The design may use light modules on a dark background, a print or layout setting may invert the image, or the material may reverse the appearance. Compare the proof with the design file, check the settings for an invert option, and restore dark modules on a light background.',
      },
      {
        question: 'Can an inverted QR code scan?',
        answer:
          'Sometimes, on scanners that handle inverted symbols, but many scanners expect dark modules on a light background and fail on an inverted code. Do not rely on an inverted code unless it passes a scan test on two phones in the real conditions.',
      },
      {
        question: 'Are white QR codes on black backgrounds reliable?',
        answer:
          'No. They are one of the least reliable combinations, because many scanners do not decode inverted symbols. Use dark modules on a light background for any code that visitors must scan, and treat an inverted design as an exception that needs proof.',
      },
    ]
  ),
  art(
    'prints-inverted-step-by-step-fix',
    'Prints Inverted: Step-by-Step Fix',
    'prints inverted step by step fix',
    'Repair a code that prints inverted with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-09',
    `
### What you are seeing

This fix restores the standard dark-on-light polarity to the printed code. You will find the step that inverted the image, correct it, and reprint a single proof. If an inverted design is genuinely required, you will prove it with a scan test on two phones before approving it.

### Likely causes

1. **Design uses inverted colours** — Quick test: compare the proof with the standard dark-on-light version.
2. **Print setting inverts the image** — Quick test: check the print and layout settings for an invert option.
3. **Material reverses the appearance** — Quick test: compare the finished print with the design file.
4. **Background panel darkened in print** — Quick test: compare the printed background with the design.
5. **Proof never scanned** — Quick test: scan the proof.

### Step-by-step fix

Step 1: Compare the proof with the design file and confirm the polarity is inverted.
Step 2: Scan the proof on two phones to confirm whether the inverted version fails.
Step 3: Check the design, the layout, and the print settings for an invert, negative, or reverse option.
Step 4: Restore dark modules on a light background in the file or the settings.
Step 5: If the material causes the inversion, switch to a light stock with dark ink, or reverse the artwork for that material.
Step 6: Print one corrected proof and scan it on two phones.
Step 7: Approve the run only when the proof scans. Keep an inverted design only if it passes on two phones.

### Putting this into practice

In practice, add a polarity check to the proof routine: confirm the modules are dark and the background is light before you scan. A proof that is inverted is a proof that fails, however attractive it looks. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Shipping an inverted code because it looked stylish, without ever scanning the proof.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints inverted will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints inverted.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The modules are dark on a light background
- No invert setting is active in the layout or printer
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
        question: 'How do I fix a QR code that prints inverted?',
        answer:
          'Find the step that inverted it: the design, a layout or print setting, or the material. Restore dark modules on a light background, reprint one proof, and scan it on two phones. Keep an inverted design only if it passes that test.',
      },
      {
        question: 'What if the material forces an inverted code?',
        answer:
          'Engraving or light ink on dark stock can force an inverted appearance. In that case, test the inverted version on two phones before approving it, and consider a light label or plate on the dark surface instead, so the code itself keeps the standard polarity.',
      },
      {
        question: 'How do I check polarity on a proof?',
        answer:
          'Look at the proof and confirm the modules are dark and the background is light, then scan it. The visual check catches the inversion and the scan test proves whether the code works.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-stretched',
    'Why Your QR Code Prints Stretched and How to Fix It',
    'why your qr code prints stretched',
    'Diagnose a code that prints stretched: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-09',
    `
### What you are seeing

The printed code is stretched in one direction: wider than tall, or taller than wide, so the square symbol becomes a rectangle. Stretching distorts the module grid, and the scanner, which expects square modules in a square symbol, struggles or fails. The cause is almost always a layout step: the image was dragged to fit a box, a template distorted it, or a print setting scaled the axes differently. The fix is to restore the square proportions and to lock them in the layout.

### Likely causes

1. **Image dragged to fit a box** — Dragging a corner or a side handle in the layout stretches the code to fill a rectangular box. Test: compare the proof proportions with the original file.
2. **Template box with different proportions** — A template image box that is not square forces the code into a rectangle. Test: check the template image box proportions.
3. **Print scaling with different axes** — A print setting that scales width and height differently stretches the whole job. Test: check the print scale settings and measure the output.
4. **Curved or uneven surface** — A code applied to a curved or stretched surface can distort after application. Test: check whether the distortion follows the surface curve.
5. **Proof never measured** — A mild stretch looks plausible to the eye, so a visual proof check misses it. Test: measure the proof with a ruler.

### Step-by-step fix

1. Measure the proof: width and height should be equal.
2. Compare the proof with the original file to confirm the stretch.
3. Find the step that stretched it: the layout, the template, or the print scaling.
4. Restore the square proportions and lock the aspect ratio in the layout.
5. Reprint one proof, measure it, and scan it on two phones.
6. Approve the run only when the proof is square and scans.

### Putting this into practice

In practice, the ruler is the test that catches stretching. A stretched code can look almost right, especially when the distortion is mild, but the scanner reads the grid, not the appearance. Measure every proof, and lock the aspect ratio in the layout so the next edit cannot stretch it again. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Dragging a QR image to fill a rectangular box and distorting the module grid.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints stretched will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints stretched.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof measures square, width equal to height
- The aspect ratio is locked in the layout
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
        question: 'Why does my QR code print stretched?',
        answer:
          'The image was dragged to fit a rectangular box, the template image box is not square, or a print setting scaled the axes differently. Measure the proof with a ruler, restore the square proportions, and lock the aspect ratio in the layout.',
      },
      {
        question: 'Can a stretched QR code still scan?',
        answer:
          'A mild stretch sometimes scans, because scanners tolerate a little distortion. A stronger stretch fails, and the tolerance varies between phones. Do not rely on it: restore the square proportions and prove the fix with a scan test.',
      },
      {
        question: 'Does stretching a QR code break it permanently?',
        answer:
          'No, if you still have the original file. Re-export the code, place it without distortion, and reprint. The stretched print is scrap, but the artwork is recoverable as long as the original file is intact.',
      },
    ]
  ),
  art(
    'prints-stretched-step-by-step-fix',
    'Prints Stretched: Step-by-Step Fix',
    'prints stretched step by step fix',
    'Repair a code that prints stretched with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-10',
    `
### What you are seeing

This fix restores the code to a true square. You will measure the proof, find the layout or print step that stretched it, and correct that step. Verify the corrected proof by measuring it and scanning it, because a stretched code can look almost right to the eye.

### Likely causes

1. **Image dragged to fit a box** — Quick test: compare the proof proportions with the original file.
2. **Template box with different proportions** — Quick test: check the template image box proportions.
3. **Print scaling with different axes** — Quick test: check the print scale settings and measure the output.
4. **Curved or uneven surface** — Quick test: check whether the distortion follows the surface curve.
5. **Proof never measured** — Quick test: measure the proof with a ruler.

### Step-by-step fix

Step 1: Measure the proof with a ruler. Width and height should be equal.
Step 2: Compare the proof with the original file to confirm the stretch direction.
Step 3: Check the layout: undo any drag that distorted the image and lock the aspect ratio.
Step 4: Check the template image box. Make it square, or fit the code inside it without distortion.
Step 5: Check the print scale settings and confirm both axes scale equally.
Step 6: Reprint one proof, measure it, and scan it on two phones.
Step 7: Approve the run only when the proof is square and scans, and check the first copies against it.

### Putting this into practice

In practice, lock the aspect ratio on every QR image in every template you use. A locked ratio turns a careless drag into a resize that keeps the code square, which is exactly the protection a stretched code needs. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Dragging a QR image to fill a rectangular box and distorting the module grid.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints stretched will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints stretched.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The proof measures square, width equal to height
- The aspect ratio is locked in the layout
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
        question: 'How do I fix a QR code that prints stretched?',
        answer:
          'Measure the proof, find the layout, template, or print step that stretched it, and restore the square proportions with the aspect ratio locked. Reprint one proof, measure it, and scan it on two phones.',
      },
      {
        question: 'How do I stop a QR code being stretched in a template?',
        answer:
          'Make the template image box square, lock the aspect ratio, and fit the code inside the box without distortion. Check the template after every edit, because a template change can reintroduce the distortion.',
      },
      {
        question: 'What if the surface itself stretches the code?',
        answer:
          'A code applied to a curved or stretchable surface can distort after application. Use a flat, rigid carrier for the code, or place the code where the surface stays flat. A distorted code on a curved surface needs a different placement, not a different file.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-pixelated',
    'Why Your QR Code Prints Pixelated and How to Fix It',
    'why your qr code prints pixelated',
    'Diagnose a code that prints pixelated: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-10',
    `
### What you are seeing

The printed code shows visible square pixels and jagged edges instead of crisp modules. Pixelation comes from a raster file with too few pixels for the printed size, so each module is built from coarse blocks that the scanner reads unreliably. The screen version can look acceptable at a small display size, which hides the problem until the print is enlarged. The fix is to export a file with enough resolution for the printed size, or to use a vector file that has no pixels at all.

### Likely causes

1. **Raster file too small for the print size** — A small image enlarged for print spreads each pixel across several dots, which shows as visible blocks. Test: check the exported pixel size against the printed size.
2. **Screenshot used as the print file** — A screenshot of a code carries screen resolution, which is far too low for print. Test: check whether the file came from a screenshot.
3. **Layout enlarged the image** — An image placed small and enlarged in the layout inherits the same pixel shortage. Test: check the placed size against the exported size.
4. **Compression degraded the image** — A heavily compressed file can blur and block the module edges. Test: check the file format and compression.
5. **Printer set to low resolution** — A printer set to a low resolution can render even a good file coarsely. Test: check the printer resolution setting.

### Step-by-step fix

1. Check the exported file: format, pixel size, and source.
2. Re-export the code at the exact printed size with plenty of pixels, or as a vector file.
3. Place the image at its native size in the layout, without enlarging it.
4. Set the printer to its normal or high resolution.
5. Print one proof and compare the module edges with the digital file.
6. Approve the run only when the proof is crisp and scans on two phones.

### Putting this into practice

In practice, the file is the fix. A vector export removes pixelation entirely, because the printer renders the modules at its own resolution. Whenever a print file is available as a vector, use it, and keep screenshots for screen mock-ups, never for print. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Using a screenshot of a QR code as the print file and discovering the pixelation only on the finished run.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints pixelated will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints pixelated.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- The proof shows crisp module edges
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
        question: 'Why does my QR code print pixelated?',
        answer:
          'The raster file has too few pixels for the printed size, the file came from a screenshot, the layout enlarged the image, or the printer is set to low resolution. Re-export as a vector or at the exact printed size, and set the printer to normal or high resolution.',
      },
      {
        question: 'Can a pixelated QR code still scan?',
        answer:
          'Sometimes, if the pixelation is mild and the module shapes survive. Coarse pixelation blurs the module edges and makes scanning unreliable, especially on older phones. Fix the file instead of relying on a pixelated code that happens to scan.',
      },
      {
        question: 'Is a vector file always better for printing QR codes?',
        answer:
          'Yes, for print. A vector file has no fixed pixels, so the printer renders the modules crisply at any size. A raster file needs enough pixels for the printed size, which is easy to get wrong when the size changes.',
      },
    ]
  ),
  art(
    'prints-pixelated-step-by-step-fix',
    'Prints Pixelated: Step-by-Step Fix',
    'prints pixelated step by step fix',
    'Repair a code that prints pixelated with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-10',
    `
### What you are seeing

This fix replaces the pixelated print with a crisp one. You will check the export resolution, re-export at the right size or as a vector, and reprint a single proof. Approve the run only when the proof shows clean module edges.

### Likely causes

1. **Raster file too small for the print size** — Quick test: check the exported pixel size against the printed size.
2. **Screenshot used as the print file** — Quick test: check whether the file came from a screenshot.
3. **Layout enlarged the image** — Quick test: check the placed size against the exported size.
4. **Compression degraded the image** — Quick test: check the file format and compression.
5. **Printer set to low resolution** — Quick test: check the printer resolution setting.

### Step-by-step fix

Step 1: Check the exported file: its format, its pixel size, and whether it came from a screenshot.
Step 2: Re-export the code as a vector file, or as a raster sized for the exact printed dimensions.
Step 3: Place the image at its native size in the layout. Do not enlarge it there.
Step 4: Set the printer to its normal or high resolution.
Step 5: Print one proof on the real stock and inspect the module edges under good light.
Step 6: If the edges are still coarse, re-export at a higher resolution and reprint.
Step 7: Approve the run only when the proof is crisp and scans on two phones.

### Putting this into practice

In practice, check the export resolution before you print, not after. A quick look at the file properties tells you whether the file can carry the printed size, and it saves a wasted proof. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Using a screenshot of a QR code as the print file and discovering the pixelation only on the finished run.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints pixelated will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints pixelated.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The print file is vector or high-resolution at the printed size
- The proof shows crisp module edges
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
        question: 'How do I fix a QR code that prints pixelated?',
        answer:
          'Re-export the code as a vector, or as a raster sized for the exact printed dimensions. Place it at its native size, set the printer to normal or high resolution, and reprint one proof. Approve the run only when the proof is crisp.',
      },
      {
        question: 'What resolution do I need for a printed QR code?',
        answer:
          'Enough pixels that the modules stay crisp at the printed size, which depends on the size and the printer. A vector file sidesteps the question entirely, which is why it is the recommended choice for print.',
      },
      {
        question: 'Can I upscale a pixelated QR code to fix it?',
        answer:
          'No. Upscaling a low-resolution image invents pixels that were never there, so the edges stay soft. Re-export the code from the source at the right resolution instead of stretching the pixelated file.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-with-a-missing-finder-pattern',
    'Why Your QR Code Prints With A Missing Finder Pattern and How to Fix It',
    'why your qr code prints with a missing finder pattern',
    'Diagnose a code that prints with a missing finder pattern: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-11',
    `
### What you are seeing

The printed code is missing one of its three large corner squares, or one corner is so damaged that the scanner cannot recognise it. Without all three finder patterns, the scanner cannot locate or orient the symbol, so the code fails outright. The cause is usually physical: a logo, a sticker, a fold, a trim, or a print fault that removes a corner. The fix is to restore all three corners and to protect them from anything that covers or cuts them.

### Likely causes

1. **Logo or graphic covering a corner** — A logo, a badge, or a decorative element placed over a corner hides the finder pattern. Test: compare the proof corners with the digital file.
2. **Trim cutting off a corner** — A code placed too close to the trim edge can lose a corner when the sheet is cut. Test: check the margin at the trim side on several copies.
3. **Fold, crease, or damage across a corner** — A fold line, a scratch, or a scuff that crosses a corner can destroy the pattern. Test: inspect the proof corners for folds or damage.
4. **Print fault in one corner** — A clogged nozzle, a band, or a faded area can wipe out a corner. Test: check whether the same corner fails on every copy.
5. **Sticker or label overlapping the code** — A sticker, a price label, or a seal placed over the code can cover a corner. Test: look for any overlapping label on the finished item.

### Step-by-step fix

1. Inspect all three corners of the proof and note which one is missing or damaged.
2. Compare the proof corners with the digital file.
3. Remove anything covering the corner: a logo, a sticker, a fold, or a trim overlap.
4. Move the code away from the trim edge if trimming cut the corner.
5. Fix the print fault if the same corner fails on every copy.
6. Reprint one proof and confirm all three corners are complete before approving the run.

### Putting this into practice

In practice, the finder patterns are sacred: nothing may cover, cut, or damage them. Keep logos centred and small, keep stickers and labels clear of the corners, and keep the code away from folds and trim edges. A corner check on every proof takes seconds and catches this failure before it reaches the run. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Placing a logo over a corner finder pattern and discovering the code cannot be found by any scanner.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with a missing finder pattern will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with a missing finder pattern.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are complete and match the file
- No logo, sticker, fold, or trim touches a corner
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
        question: 'Why does my QR code print with a missing finder pattern?',
        answer:
          'Something covered, cut, or damaged a corner: a logo, a sticker, a fold, a trim, or a print fault. Compare the proof corners with the digital file, remove the covering element, and reprint a proof with all three corners complete.',
      },
      {
        question: 'Can a QR code scan with only two finder patterns?',
        answer:
          'No, not reliably. The scanner needs all three corner squares to locate and orient the symbol. A code with a missing or damaged finder pattern fails outright, so restore all three corners before approving the run.',
      },
      {
        question: 'How much of a finder pattern can be covered?',
        answer:
          'None. Even a small overlap can break detection, because the scanner reads the shape of the whole pattern. Keep every finder pattern fully clear of logos, stickers, folds, and trim.',
      },
    ]
  ),
  art(
    'prints-with-a-missing-finder-pattern-step-by-step-fix',
    'Prints With A Missing Finder Pattern: Step-by-Step Fix',
    'prints with a missing finder pattern step by step fix',
    'Repair a code that prints with a missing finder pattern with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-11',
    `
### What you are seeing

This fix restores all three finder patterns to the printed code. You will inspect every corner of the proof, find what removed or damaged the missing corner, and correct the artwork, the trim, or the placement. Verify all three corners on the corrected proof before approving the run.

### Likely causes

1. **Logo or graphic covering a corner** — Quick test: compare the proof corners with the digital file.
2. **Trim cutting off a corner** — Quick test: check the margin at the trim side on several copies.
3. **Fold, crease, or damage across a corner** — Quick test: inspect the proof corners for folds or damage.
4. **Print fault in one corner** — Quick test: check whether the same corner fails on every copy.
5. **Sticker or label overlapping the code** — Quick test: look for any overlapping label on the finished item.

### Step-by-step fix

Step 1: Inspect all three corners of the proof and mark the one that is missing or damaged.
Step 2: Compare the proof corners with the digital file to confirm what changed.
Step 3: Remove or move anything covering the corner, such as a logo, a sticker, or an overlapping label.
Step 4: If trimming cut the corner, move the code away from the trim edge and add trim allowance.
Step 5: If a fold crosses the corner, move the code away from the fold line.
Step 6: If the same corner fails on every copy, fix the printer fault, then reprint.
Step 7: Reprint one proof, confirm all three corners are complete, and scan it on two phones before approving the run.

### Putting this into practice

In practice, add a three-corner check to the proof routine: top left, top right, bottom left, all complete and matching the file. A proof that fails the corner check is a proof that fails, however good the rest of it looks. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Placing a logo over a corner finder pattern and discovering the code cannot be found by any scanner.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with a missing finder pattern will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with a missing finder pattern.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are complete and match the file
- No logo, sticker, fold, or trim touches a corner
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
        question: 'How do I fix a QR code with a missing finder pattern?',
        answer:
          'Find what removed the corner: a logo, a sticker, a fold, a trim, or a print fault. Remove or move that element, reprint one proof, and confirm all three corners are complete and the code scans on two phones.',
      },
      {
        question: 'Should I move the logo or shrink it?',
        answer:
          'Move it to the centre and keep it small and clear of all three corners. If it still touches a corner, remove it. A logo that covers a finder pattern costs you every scan, which is a bad trade for decoration.',
      },
      {
        question: 'What if trimming keeps cutting a corner?',
        answer:
          'Move the code away from the trim edge and add trim allowance so the margin and the corner survive cutting. Check several copies from the run, because trim shift varies across the run.',
      },
    ]
  ),
  art(
    'why-your-qr-code-prints-on-the-wrong-paper',
    'Why Your QR Code Prints On The Wrong Paper and How to Fix It',
    'why your qr code prints on the wrong paper',
    'Diagnose a code that prints on the wrong paper: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-11',
    `
### What you are seeing

The code prints on the wrong stock: a glossy sheet when you needed matte, a thin paper when you needed card, a coloured stock when you needed white, or a label stock that does not suit the printer. The wrong paper changes contrast, drying, sharpness, and durability, so a code that scans on the right stock can fail on the wrong one. The cause is usually a tray mix-up, a stock substitution, or a job ticket that never named the stock. The fix is to confirm the stock before the run and to reprint on the correct material.

### Likely causes

1. **Wrong tray or stock loaded** — A printer with several trays can pull the wrong stock if the tray selection is wrong. Test: check the stock in the tray against the job ticket.
2. **Stock substituted without notice** — A supplier or colleague can substitute a similar-looking stock that behaves differently. Test: compare the used stock with the specified stock.
3. **Job ticket never named the stock** — A job with no specified stock gets printed on whatever is loaded. Test: check whether the job ticket names the stock.
4. **Stock unsuited to the printer** — A stock that does not suit the printer can smudge, fade, or reflect. Test: check the stock against the printer's recommended media.
5. **Stock unsuited to the environment** — A stock that suits the printer can still fail outdoors, in damp conditions, or under handling. Test: check the stock against the conditions where the code will live.

### Step-by-step fix

1. Identify the stock that was actually used and compare it with the specified stock.
2. Check the printer tray selection and the job ticket.
3. Choose the stock the job requires for its printer and its environment.
4. Print one proof on the correct stock and scan it on two phones.
5. Update the job ticket to name the stock, the tray, and the print settings.
6. Reprint the run on the correct stock and spot-check the first copies.

### Putting this into practice

In practice, the job ticket is the fix. A ticket that names the stock, the tray, and the print settings prevents the tray mix-up and the silent substitution. A ticket that says print it leaves the stock to chance, and chance picks whatever is loaded. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Leaving the stock off the job ticket and discovering the run was printed on whatever was loaded.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints on the wrong paper will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints on the wrong paper.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The stock matches the job ticket
- The stock suits the printer and the environment
- The proof on the correct stock scans on two phones
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
        question: 'Why does my QR code print on the wrong paper?',
        answer:
          'The printer pulled from the wrong tray, the stock was substituted, or the job ticket never named the stock. Check the tray, the stock, and the ticket, then reprint a proof on the correct stock and update the ticket.',
      },
      {
        question: 'Does the paper really affect QR scanning?',
        answer:
          'Yes. The stock changes contrast, ink drying, sharpness, reflections, and durability. A code that scans on white matte stock can fail on glossy, coloured, or absorbent stock. Test the code on the stock it will actually use.',
      },
      {
        question: 'What stock is best for QR codes?',
        answer:
          'It depends on the printer and the environment. Plain white matte stock is the safest default for indoor print. Outdoor, damp, or handled codes need a stock and finish suited to those conditions. Test a proof on the chosen stock before the run.',
      },
    ]
  ),
  art(
    'prints-on-the-wrong-paper-step-by-step-fix',
    'Prints On The Wrong Paper: Step-by-Step Fix',
    'prints on the wrong paper step by step fix',
    'Repair a code that prints on the wrong paper with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-12',
    `
### What you are seeing

This fix gets the code onto the correct stock. You will identify the stock that was used, compare it with the stock the job requires, and reprint a single proof on the right material. Update the job ticket so the next reprint uses the same correct stock.

### Likely causes

1. **Wrong tray or stock loaded** — Quick test: check the stock in the tray against the job ticket.
2. **Stock substituted without notice** — Quick test: compare the used stock with the specified stock.
3. **Job ticket never named the stock** — Quick test: check whether the job ticket names the stock.
4. **Stock unsuited to the printer** — Quick test: check the stock against the printer's recommended media.
5. **Stock unsuited to the environment** — Quick test: check the stock against the conditions where the code will live.

### Step-by-step fix

Step 1: Identify the stock that was actually used. Compare it with the stock the job specifies.
Step 2: Check the printer tray selection and confirm the correct tray is loaded.
Step 3: Choose the correct stock for the printer and for the conditions where the code will live.
Step 4: Print one proof on the correct stock and scan it on two phones.
Step 5: Update the job ticket to name the stock, the tray, and the print settings.
Step 6: Reprint the run on the correct stock.
Step 7: Spot-check the first copies against the proof and confirm the stock matches the ticket.

### Putting this into practice

In practice, keep a sample of the approved stock with the job file. When a reprint arrives on the wrong paper, comparing it with that sample settles the question in seconds. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Leaving the stock off the job ticket and discovering the run was printed on whatever was loaded.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints on the wrong paper will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints on the wrong paper.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The stock matches the job ticket
- The stock suits the printer and the environment
- The proof on the correct stock scans on two phones
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
        question: 'How do I fix a QR code printed on the wrong paper?',
        answer:
          'Identify the stock that was used, choose the correct stock for the printer and the environment, and reprint a proof on it. Update the job ticket to name the stock, the tray, and the settings so the next reprint uses the right material.',
      },
      {
        question: 'Can I salvage a run printed on the wrong paper?',
        answer:
          'Only if the wrong stock still scans reliably in the real conditions and lasts as long as the job needs. Test it honestly on two phones. If it fails or will not last, reprint on the correct stock rather than shipping a run you know is wrong.',
      },
      {
        question: 'How do I stop the wrong stock being used again?',
        answer:
          'Name the stock, the tray, and the print settings on the job ticket, and keep a sample of the approved stock with the job file. Check the first copies against the sample before the run proceeds.',
      },
    ]
  ),
];
