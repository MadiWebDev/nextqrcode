import type { Article } from '../articles';
import { art } from './helper';

export const batch3: Article[] = [
  art(
    'qr-code-size-for-trade-show-banners',
    'Trade Show Banner QR Codes: Sizing for Aisle Distance and Crowds',
    'qr code size trade show banner',
    'Pick the right QR size and placement for booth banners and pop-up displays.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-04',
    `
### 1. Distance Math

Visitors usually scan from 1 to 3 meters. At the 10:1 rule, that means 10 to 30 cm. Crowded halls and poor lighting justify the conservative 8:1 ratio, so budget 15 to 40 cm.

### 2. Placement

* Position the code between chest and eye level (about 120 to 160 cm from the floor).
* Keep it away from the bottom third, where people block it.
* Leave a clear quiet zone; do not overlap it with graphics.

### 3. Call to Action

State what the scan delivers ("Scan for the 2-minute demo"). Large banners also help to include a short typed URL as a fallback.

### 4. Printing

Use vector files at the finished banner size and matte material to limit glare from booth lighting.
    `,
    [
      { question: 'What size QR code works on a roll-up banner?', answer: 'Typically 15 to 25 cm when scanned from 1.5 to 2.5 meters.' },
      { question: 'Should I add a short URL under the code?', answer: 'Yes. It helps people without scanning and serves as a backup if lighting is poor.' },
    ]
  ),
  art(
    'qr-codes-on-t-shirts-and-apparel',
    'QR Codes on Apparel: Heat Transfer, Stretch, and Wash Durability',
    'qr code on tshirt',
    'Make QR codes that still scan after wearing and washing, using the right method, size, and placement.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-05',
    `
### 1. Size and Placement

Fabric folds and stretches, so go larger: 8 to 12 cm is common. Place the code on the flat area of the chest or back and avoid seams, underarms, and collars.

### 2. Methods

* **Screen printing and DTG:** Good sharpness, check ink spread on textured cotton.
* **Heat transfer vinyl:** Crisp edges and high contrast; use matte vinyl.
* **Embroidery:** Generally poor for small modules; only for very large, low-version codes.

### 3. Design Rules

Use level Q or H, a high-contrast dark-on-light layout, and keep the payload short. Print a solid light patch behind the code on dark garments.

### 4. Test

Wash and wear a sample at least five times, then scan it at a normal distance.
    `,
    [
      { question: 'Do QR codes survive washing?', answer: 'Quality screen prints and vinyl transfers usually do. Cracking and fading reduce contrast over time, so test samples.' },
      { question: 'Can I print a white QR on a black shirt?', answer: 'Inverted codes are unreliable on many scanners. Use a dark code on a light patch instead.' },
    ]
  ),
  art(
    'qr-codes-on-glass-and-windows',
    'QR Codes on Glass and Storefront Windows: Mirroring, Glare, and Backing',
    'qr code on glass window',
    'Avoid reversed prints, reflections, and see-through backgrounds when placing QR codes on windows.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-06',
    `
### 1. Reverse Printing

If the graphic is applied to the inside face of the glass and viewed from outside, the artwork must be mirrored so it reads correctly through the pane. Many scanners can decode a mirrored code, but do not rely on it. Confirm by scanning from the viewing side.

### 2. Background Problem

Window codes lose contrast because the background changes with daylight and what is behind the glass. Use an opaque white backing panel behind the code, or print a solid light patch.

### 3. Glare

Reflections from sun and street lights can wash out modules. Prefer matte film and angle the placement away from direct reflections.

### 4. Height and Safety

Place it at a comfortable standing height, away from traffic where people might step off the pavement to scan.
    `,
    [
      { question: 'Should the QR code be mirrored on a window?', answer: 'If printed on the inside face and viewed from outside, the artwork must be reversed so it reads correctly. Always verify from the outside.' },
      { question: 'Can I put a QR code on a backlit window?', answer: 'Only with sufficient contrast and a solid light backing. Test at different times of day.' },
    ]
  ),
  art(
    'direct-part-marking-qr-codes-on-metal',
    'Direct Part Marking: QR and Data Matrix on Metal and Industrial Parts',
    'direct part marking qr code',
    'Laser etching, dot peen, and chemical etching for permanent codes on metal parts, and how to keep them readable.',
    'Printing & Sizing',
    '6 min read',
    '2026-08-07',
    `
### 1. Why DPM

Labels burn, peel, or wear off in harsh environments. Direct part marking engraves the symbol into the surface so it lasts for the life of the part.

### 2. Methods

* **Laser marking:** High precision, small modules, good for electronics and medical parts.
* **Dot peen:** Pressed dots into metal. Works on rough surfaces, and modules are dots rather than squares.
* **Chemical or electrochemical etching:** Good contrast on stainless steel.

### 3. Reading Challenges

Reflective, curved, or low-contrast surfaces need controlled lighting and industrial imagers. Quality guidance for these marks is given in ISO/IEC TR 29158.

### 4. Design Tips

Use Data Matrix where space is tight, error correction at the higher end, and verify every mark with a dedicated verifier rather than a phone.
    `,
    [
      { question: 'Can a phone read a dot peen code?', answer: 'Sometimes, but industrial imagers with proper lighting are much more reliable.' },
      { question: 'Which symbology is best for metal parts?', answer: 'Data Matrix is common because of its compact size, though QR works when scanners support it.' },
    ]
  ),
  art(
    'cmyk-vs-rgb-black-for-qr-code-printing',
    'CMYK, RGB, and Rich Black: Color Settings That Keep QR Codes Scannable',
    'qr code cmyk print settings',
    'Why QR codes should use pure single-ink black in print and how to avoid misregistration.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-08',
    `
### 1. Use 100% K

For offset and digital print, set the code to 0C 0M 0Y 100K. A rich black built from four inks can misregister slightly, creating colored fringes on small modules and softening edges.

### 2. Avoid Conversion Surprises

RGB black (0,0,0) converted automatically to CMYK can become a four-ink mix. Create the code in CMYK or convert it deliberately and check the separations.

### 3. Overprint

Make sure black overprint settings do not cause modules to merge with light-colored knockout areas in the background.

### 4. Brand Colors

If you must use a color, choose a dark one with strong luminance contrast against the background. See our contrast guide for numeric targets.
    `,
    [
      { question: 'Should QR codes be rich black?', answer: 'No. Use 100% K only to avoid misregistration on small modules.' },
      { question: 'Is a dark brand color acceptable?', answer: 'Yes, if luminance contrast is strong, but pure black on white remains the safest choice.' },
    ]
  ),
  art(
    'dot-gain-and-print-growth-in-qr-codes',
    'Dot Gain and Print Growth: Why Printed QR Codes Fail Even When They Look Fine',
    'qr code dot gain print growth',
    'Understand ink spread, how it distorts modules, and how to compensate on different stocks.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-09',
    `
### 1. What Is Print Growth

Ink spreads on paper fibers. Dark modules grow, and light gaps shrink. If growth is large, isolated light modules fill in and adjacent dark modules merge.

### 2. Where It Is Worst

Uncoated paper, newsprint, and corrugated board spread ink most. Coated and synthetic stocks spread the least.

### 3. Compensation

* Use larger modules on absorbent stock.
* Ask the printer for a slightly reduced dark module size (a few percent) if their proofing shows growth.
* Avoid very high version numbers on rough substrates.

### 4. Verify

Print a proof on the real stock and test on older phones in typical lighting. Formal grading under ISO/IEC 15415 reports a print growth measurement.
    `,
    [
      { question: 'How can I tell if print growth is the issue?', answer: 'Zoom into a printed proof. If thin light modules are filled in or dark modules touch, growth is excessive.' },
      { question: 'Does a bigger QR code fix it?', answer: 'Larger modules reduce the relative effect, which usually helps.' },
    ]
  ),
  art(
    'qr-codes-on-thermal-label-printers',
    'QR Codes on Thermal Label Printers: 203 DPI and 300 DPI Module Math',
    'thermal printer qr code size',
    'Calculate module sizes in printer dots to avoid blurry or fractional-dot QR labels.',
    'Printing & Sizing',
    '6 min read',
    '2026-08-10',
    `
### 1. Dots, Not Millimeters

A 203 dpi printhead lays down about 8 dots per mm, so one dot is about 0.125 mm. A 300 dpi head has dots about 0.085 mm.

### 2. Use Whole-Dot Modules

Fractional scaling creates uneven modules. Pick an integer number of dots per module:
* 203 dpi, 4 dots per module = 0.5 mm
* 300 dpi, 6 dots per module = about 0.51 mm

### 3. Worked Example

A Version 2 code (25 modules) plus an 8-module quiet zone is 33 modules. At 4 dots each on 203 dpi:
$$33 \\times 4 = 132\\text{ dots} \\approx 16.5\\text{ mm}$$

### 4. Tips

Set darkness and speed so modules neither fade nor bloom, and print the code from a vector or exact-pixel bitmap, not a resampled image.
    `,
    [
      { question: 'Why is my thermal QR code fuzzy?', answer: 'It was probably resampled to a non-integer scale. Render it at exact dot multiples.' },
      { question: 'What module size works on 203 dpi?', answer: 'Four dots (about 0.5 mm) is a solid baseline; three dots (about 0.38 mm) is near the limit.' },
    ]
  ),
  art(
    'qr-code-size-for-posters-and-flyers',
    'QR Code Size for Posters and Flyers: A4, A3, and Wall Display Guide',
    'qr code size poster flyer',
    'Recommended QR dimensions for handheld flyers, A4 and A3 posters, and wall displays.',
    'Printing & Sizing',
    '5 min read',
    '2026-08-11',
    `
### 1. Quick Reference

| Format | Typical scan distance | Recommended code size |
|---|---|---|
| Handheld flyer (A5) | 30 to 40 cm | 3 to 4 cm |
| A4 flyer or notice | 40 to 60 cm | 4 to 5 cm |
| A3 poster at a wall | 1 to 1.5 m | 10 to 15 cm |
| Large wall display | 2 to 3 m | 20 to 30 cm |

### 2. Placement

Place the code in the lower third so people can hold a phone comfortably, and never at the extreme corner where trimming can cut the quiet zone.

### 3. Add Context

Include a short call to action and a fallback URL. Use matte paper to avoid glare from overhead lights.
    `,
    [
      { question: 'How large should a QR be on an A3 poster?', answer: 'About 10 to 15 cm when viewed from 1 to 1.5 meters.' },
      { question: 'Should posters use level H?', answer: 'Only when adding a logo or expecting wear. Otherwise level M gives a less dense code.' },
    ]
  ),
  art(
    'qr-code-print-quality-grading-iso-15415',
    'QR Code Print Quality Grading: ISO/IEC 15415 Grades A to F Explained',
    'qr code print quality iso 15415',
    'How verifiers grade printed QR codes and which parameters determine whether a symbol passes.',
    'Printing & Sizing',
    '6 min read',
    '2026-08-12',
    `
### 1. The Grading Scale

ISO/IEC 15415 grades 2D symbols from 4 (A) down to 0 (F). The overall grade is the lowest of the individual parameter grades, so one weak parameter lowers the whole result.

### 2. Parameters

* Symbol contrast
* Modulation
* Fixed pattern damage
* Decode
* Axial nonuniformity
* Grid nonuniformity
* Unused error correction
* Print growth

### 3. Practical Targets

Commercial specifications commonly require grade C (2.0) or better, with B (3.0) preferred for critical applications. Grading uses a calibrated verifier, not a phone.

### 4. Using Grades

Grading helps printers fix specific faults, such as low contrast or uneven print growth, before a full production run.
    `,
    [
      { question: 'Can I grade a QR code with my phone?', answer: 'No. Phones decode but do not provide calibrated ISO grades. Use a verifier.' },
      { question: 'What grade should I target?', answer: 'Aim for C or better, B or better for critical labels.' },
    ]
  ),
  art(
    'how-to-spot-fake-qr-codes',
    'How to Spot a Fake QR Code: Physical and Digital Warning Signs',
    'how to spot fake qr code',
    'A practical checklist for identifying tampered or malicious QR codes before you open them.',
    'Security & Scanning',
    '6 min read',
    '2026-08-13',
    `
### 1. Physical Warning Signs

* Sticker edges, bubbles, or a code that sits slightly higher than the surrounding print.
* A code on a surface where one would not expect it, such as a meter that has no payment sticker elsewhere.
* Different print quality compared with the rest of the sign.

### 2. Check the Link Before Opening

Most camera apps show the destination URL before opening. Read the domain carefully. Look for misspellings, extra words, unusual endings, or a shortener that hides the real target.

### 3. Behavior Red Flags

* Requests for passwords, card details, or one-time codes.
* Urgent threats or prizes.
* Prompts to install an app from outside the official store.

### 4. If In Doubt

Type the official web address yourself or use the organization's app instead of the code.
    `,
    [
      { question: 'Can I tell a malicious QR code just by looking at it?', answer: 'No. The symbol looks the same either way. Judge the destination URL and the context.' },
      { question: 'What should I do if I opened a suspicious link?', answer: 'Close it, do not enter details, and change passwords if you did. Report it to the organization concerned.' },
    ]
  ),
];