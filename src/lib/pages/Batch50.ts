import type { Article } from '../articles';
import { art } from './helper';

export const batch50: Article[] = [
  art(
    'qr-code-color-customisation-guide',
    'QR Code Colour Customisation: A Complete Guide to Branded QR Designs',
    'qr code colour customisation guide',
    'Learn how to safely customise QR code colours — foreground, background, gradients, and brand palettes — without breaking scannability.',
    'Fundamentals',
    '5 min read',
    '2027-02-20',
    `
### Why Colour Customisation Matters

A plain black-and-white QR code works, but it blends into nothing. A branded QR code with your brand colours reinforces recognition, increases scan rates by up to 35% in A/B tests, and communicates professionalism. The challenge: colour changes reduce contrast and can push error correction to its limits.

### The Golden Rule: Dark on Light

QR scanners look for dark modules on a light background. The camera firmware calculates a contrast threshold between the foreground (modules) and background. If the contrast ratio falls below approximately 3:1, many scanners will fail to decode reliably.

**Safe:** Dark navy on white, dark green on cream, dark burgundy on pale grey.
**Risky:** Medium blue on light blue, orange on yellow, dark grey on dark blue.
**Never:** Light colours on white, dark colours on black.

### Calculating Contrast Safely

Use the WCAG contrast ratio formula — the same used for accessibility:

| Foreground | Background | Contrast Ratio | Scannable? |
|---|---|---|---|
| #000000 (black) | #FFFFFF (white) | 21:1 | Always |
| #1A237E (dark navy) | #FFFFFF (white) | 14.2:1 | Yes |
| #2E7D32 (dark green) | #F5F5F5 (off-white) | 9.1:1 | Yes |
| #FF6F00 (amber) | #FFFFFF (white) | 3.0:1 | Marginal |
| #FF6F00 (amber) | #FFF9C4 (pale yellow) | 1.5:1 | No |

Aim for a minimum 4:1 ratio. Use a tool like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify any colour combination before printing.

### Brand Colour Integration

Most brand guidelines specify a primary and secondary colour. Map these to QR modules:

- **Primary brand colour → foreground modules** (must be the darker colour)
- **White or light brand background → module background**
- **Secondary accent → frame border or call-to-action text**, not the modules themselves

If your brand primary is a light colour (pastels, yellow, lime), it cannot be used as the foreground. Use a darker shade from your extended palette instead.

### Gradients and Patterns

Gradients applied to QR modules are high-risk. A gradient that fades from dark to light across the code creates regions where the local contrast drops below the scanner threshold. If using gradients:

- Apply only to the background, not the modules
- Keep module colour uniform and dark
- Test with at least three different scanner apps before printing

### Error Correction as a Safety Net

Higher error correction levels allow more of the code to be damaged or misread before decoding fails:

- **Level L (7%)** — low tolerance, maximum data density
- **Level M (15%)** — standard choice for colour customisation
- **Level Q (25%)** — recommended for complex colour changes or logo embeds
- **Level H (30%)** — use when applying logos or heavy colour effects

When using non-standard colours, always use Level Q or H error correction.

### Testing Before Printing

Never print without testing. Scan your customised QR with:
1. iPhone Camera app (iOS 11+)
2. Google Lens on Android
3. A budget Android phone in poor lighting

If all three scan reliably, the design is safe to print. If any fails, increase contrast or switch to Level H error correction.
    

### Related tools and guides

- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- The [templates](/templates) collection offers ready-made layouts for common QR use cases.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
`,
    [
      {
        question:
          "Can I use my brand's primary colour as the QR code foreground even if it is bright?",
        answer:
          'Only if it provides at least 4:1 contrast against your chosen background. Bright or light brand colours (yellows, pastels, lime greens) typically do not meet this threshold against white. Use a darker tonal variant of your brand colour instead, and test scannability on multiple devices before committing to print.',
      },
      {
        question: 'Does inverting a QR code (white modules on dark background) work?',
        answer:
          'Most modern scanner apps handle inverted QR codes, but not all. Older firmware and some industrial scanners expect dark-on-light. Inverted codes also fail printed on glossy dark materials that cause glare. Unless you need it for aesthetic reasons, stick to dark-on-light for maximum compatibility.',
      },
      {
        question: 'How much of a QR code can I replace with a logo before it stops scanning?',
        answer:
          'With error correction Level H (30%), you can safely obscure up to 30% of the code area. In practice, keep logo placement to the centre 20–25% and ensure the three finder patterns in the corners are fully intact. Always test after adding a logo — the actual tolerance varies by QR version and data density.',
      },
    ]
  ),
  art(
    'branded-qr-code-design-rules',
    'Branded QR Codes: Design Rules That Keep Scannability Intact',
    'branded qr code design rules',
    'Apply brand identity to QR codes without sacrificing scan rates — rules for colour, shape, logos, and frames that work in print and digital.',
    'Fundamentals',
    '5 min read',
    '2027-02-21',
    `
### The Conflict Between Branding and Function

A QR code is a machine-readable symbol first. Design modifications that look great on screen may fail entirely when printed on a matte label, scanned in dim lighting, or reproduced at small sizes. Understanding where the guardrails are lets you push creative boundaries confidently.

### Module Shape Customisation

Standard QR codes use square modules. Many generators allow rounded, circular, or dot-shaped modules. These work well if:

- The shape fills at least 60% of the module cell area
- Adjacent modules remain visually distinct (no merging)
- The quiet zone (white border) remains intact

Heavily rounded or dot modules reduce the effective module size and can cause misreads at small print sizes. Test at the intended print size — not on screen at 300%.

### Logo Embedding Rules

A central logo is the most common branded QR feature. Rules:

1. Use error correction Level H (30%) — this creates enough redundancy to tolerate the obscured area
2. Keep the logo within the central 20–25% of the total QR area
3. Use a white padding border around the logo so it does not merge with surrounding modules
4. Do not place logos near the three finder pattern corners
5. Test on physical print, not only screen

### Frame and Call-to-Action Design

A frame with call-to-action text ("Scan to order", "Tap here for the menu") dramatically increases scan rates. Design guidelines:

- Frame background can be any colour — it is outside the QR matrix
- CTA text should be concise (3–5 words)
- Ensure the frame does not encroach on the quiet zone (4-module white border)
- Frame border radius and decorative elements are unrestricted

### Typography Around QR Codes

Nearby text does not affect scannability if it respects the quiet zone. Best practice:

- Leave at least 4 modules of white space between the QR edge and any printed text
- Use contrasting text colour so the CTA is readable independent of the QR
- Avoid text or graphics that visually merge with the QR modules at a glance

### Print Specifications for Branded QRs

| Print Method | Recommended Format | Minimum Size |
|---|---|---|
| Offset/digital print | SVG or PDF vector | 25 × 25 mm |
| Screen/web | SVG or PNG @2x | 200 × 200 px |
| Embroidery/engraving | High-contrast, simple modules only | Test at actual size |
| Fabric/textile | Simple black-on-white, standard modules | 40 × 40 mm |

Always export from the generator as SVG for print. Raster (PNG/JPG) QR codes scaled up blur at the edges and increase scan failure rates.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- The [error correction simulator](/error-correction-simulator) shows how damage tolerance changes the density of the symbol at each level.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [scan guide](/scan-guide) explains how phone cameras find and decode a code.
- The [templates](/templates) collection offers ready-made layouts for common QR use cases.
- Create a fresh code with the [URL QR code generator](/url-qr-code-generator) when the destination is a web page.
`,
    [
      {
        question: 'Is it safe to use rounded module shapes in a QR code?',
        answer:
          'Yes, if each module still covers most of its cell area and adjacent modules remain distinct. Heavily rounded or teardrop-shaped modules reduce effective scan area and can fail at small sizes or in poor lighting. Use Level M or higher error correction and test on a physical print at the intended final size before approving the design.',
      },
      {
        question: 'Can the frame around a QR code include a border that touches the modules?',
        answer:
          'No. The quiet zone — a minimum 4-module-wide white border surrounding the QR matrix — must be preserved. A frame border that touches or overlaps the quiet zone confuses scanners trying to locate the finder patterns. Keep all decorative frame elements outside this white margin.',
      },
      {
        question: 'Should I export a branded QR code as PNG or SVG for print?',
        answer:
          'SVG for anything printed. SVG is resolution-independent vector data, so it stays perfectly sharp at any size from a business card to a billboard. PNG is pixel-based and blurs when scaled beyond its original resolution. Most professional QR generators export SVG — use this format for any print material.',
      },
    ]
  ),
  art(
    'dark-light-qr-code-contrast',
    'Dark-on-Light QR Codes: Why Contrast Is Non-Negotiable',
    'dark on light qr code contrast rule',
    'Understand the dark-on-light contrast requirement for QR codes — what contrast ratio you need, what breaks it, and how to verify before printing.',
    'Printing & Sizing',
    '4 min read',
    '2027-02-22',
    `
### Why QR Scanners Require Dark on Light

QR scanner algorithms work by converting the captured image to a binary (black/white) bitmap using adaptive thresholding. The algorithm divides the image into regions, calculates the average luminance of each region, and assigns any pixel below the threshold to "dark" (module) and above it to "light" (background).

If the contrast between foreground and background is too low, the thresholding step produces a noisy bitmap where module boundaries are ambiguous. The decoder then fails to locate the finder patterns and decoding fails.

### The 4:1 Minimum Threshold

Camera-based QR decoders in smartphones are generally calibrated to require a luminance contrast ratio of approximately 4:1 between module and background. This matches the WCAG AA accessibility minimum and is a practical industry benchmark.

The ISO/IEC 18004 standard specifies a minimum print contrast signal (PCS) of 0.6, which roughly maps to a 4:1 luminance ratio.

### Common Contrast Failures

| Situation | Why It Fails |
|---|---|
| Dark brown QR on dark kraft paper | Background too dark — contrast under 2:1 |
| Yellow QR on white background | Yellow is near-white in luminance — contrast under 1.5:1 |
| Blue QR on dark navy background | Both dark — contrast near 1:1 |
| Grey QR on white background | Low contrast if grey is too light |
| QR printed on metallic/foil surface | Reflective surface confuses thresholding |

### Testing Contrast Before Printing

**Method 1 — Online tool:** Upload or screenshot your QR and check it using WebAIM Contrast Checker or the Colour Contrast Analyser desktop app. Eyedropper the module colour and background colour. Look for a ratio above 4:1.

**Method 2 — Greyscale test:** Convert the QR image to greyscale. If modules and background appear almost the same shade, the contrast is insufficient.

**Method 3 — Distance test:** Print a small test copy and scan it from 30 cm in average indoor lighting. If any of three scanner apps fails, adjust contrast before final production print.

### Fixing Low-Contrast Designs

- Darken the foreground colour
- Lighten the background colour
- Add a white padding border around the entire QR (increases effective background contrast)
- Switch to black modules if the colour customisation cannot meet the threshold
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- Check print proofs with the [printed QR tester](/printed-qr-tester) so problems show up before a full run.
- The [QR placement guide](/qr-placement-guide) covers height, lighting, glare, and surfaces that affect scan success.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- When a one-dimensional symbol fits better, the [barcode generator](/barcode-generator) covers retail and inventory formats.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'Does a white QR code on a black background (inverted) scan correctly?',
        answer:
          'Many modern apps handle it, but it is not universally supported. Inverted QR codes can fail on older scanner firmware, some industrial barcode readers, and on printed surfaces where the dark background absorbs light rather than reflecting it. Dark modules on a light background is the universal safe choice.',
      },
      {
        question:
          'Can I print a QR code directly onto brown kraft paper without a white background?',
        answer:
          'It depends on the kraft paper shade and ink colour. Medium brown kraft with black ink typically achieves a 5–7:1 contrast ratio and scans fine. Dark kraft with dark ink will fail. Add a white rectangular background behind the QR code if the paper colour is too dark to guarantee adequate contrast.',
      },
      {
        question: 'How do I test a QR code before sharing it?',
        answer:
          'Scan it with at least two different phones, in the lighting where it will be used, and confirm the destination opens correctly. Test the printed size too, since a code that works on screen can fail once printed small.',
      },
    ]
  ),
  art(
    'qr-code-foreground-background-best-practices',
    'QR Code Foreground and Background Colour: Best Practice Combinations',
    'qr code foreground background colour best practices',
    'Verified colour combinations for QR codes that scan reliably in print and digital — with contrast ratios and use-case recommendations.',
    'Printing & Sizing',
    '4 min read',
    '2027-02-23',
    `
### Understanding Foreground vs Background

**Foreground:** The dark module colour — the actual data-bearing squares in the QR grid.
**Background:** The light colour behind the modules — can be white, off-white, or a light brand colour.

Both colours matter equally. A dark foreground on a dark background fails as surely as a light foreground on white.

### Verified Safe Combinations

| Foreground Hex | Background Hex | Description | Contrast |
|---|---|---|---|
| #000000 | #FFFFFF | Classic black/white | 21:1 |
| #1A237E | #FFFFFF | Dark navy / white | 14.2:1 |
| #1B5E20 | #FFFFFF | Dark green / white | 11.6:1 |
| #B71C1C | #FFFFFF | Dark red / white | 7.8:1 |
| #4A148C | #FFFFFF | Deep purple / white | 10.2:1 |
| #000000 | #FFF9C4 | Black / pale yellow | 19.5:1 |
| #1A237E | #E8EAF6 | Dark navy / light lavender | 9.4:1 |
| #1B5E20 | #F1F8E9 | Dark green / pale green | 8.7:1 |

### Combinations to Avoid

| Foreground | Background | Issue |
|---|---|---|
| Any mid-tone | Same mid-tone hue | Near-zero contrast |
| #FF6F00 (amber) | #FFFFFF | Only 3.0:1 — marginal |
| #FDD835 (yellow) | #FFFFFF | 1.7:1 — fails |
| #546E7A (blue-grey) | #ECEFF1 (near-white) | 3.6:1 — below threshold |

### Background Colours Beyond White

Using a light brand colour as the background (instead of pure white) is safe as long as the foreground achieves 4:1+ contrast against it. Light backgrounds that work well:

- Off-white / ivory (#FFFFF0, #FAFAF5)
- Light grey (#F5F5F5, #EEEEEE)
- Pale blue (#E3F2FD)
- Pale yellow (#FFFDE7)
- Light cream (#FFF8E1)

Avoid light backgrounds with any saturation that could conflict with the foreground hue.

### The Impact of Print Medium

The same digital colour combination can have different real-world contrast depending on print method:

- **Laser print:** Consistent colour reproduction, safe for verified combos
- **Inkjet:** Slight colour bleed — tested combinations may have marginally lower real-world contrast
- **Screen print / fabric:** Ink absorption can lighten dark colours — increase foreground darkness by 10–15%
- **Foil/metallic:** Reflective surfaces distort perceived contrast — avoid or add a matte coating
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- Use the [QR size calculator](/qr-size-calculator) to match the printed size to the expected scan distance before you commit to a print run.
- Check print proofs with the [printed QR tester](/printed-qr-tester) so problems show up before a full run.
- The [QR placement guide](/qr-placement-guide) covers height, lighting, glare, and surfaces that affect scan success.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- When a one-dimensional symbol fits better, the [barcode generator](/barcode-generator) covers retail and inventory formats.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'Is off-white a safe background for a QR code?',
        answer:
          'Yes. Off-white backgrounds (#FFFFF0, #FFF8E1, #F5F5F5) provide slightly reduced contrast compared to pure white but still achieve 15:1+ against black or near-black foregrounds. Off-white is often preferable for print materials where pure white looks stark or clashes with surrounding design.',
      },
      {
        question: 'What happens if I accidentally swap foreground and background colours?',
        answer:
          'The QR code will be light modules on a dark background — an inverted code. This may scan on modern smartphone apps but will fail on many barcode scanners, some QR reader apps, and certain automated systems. Always ensure the modules are the darker colour and the background the lighter one.',
      },
      {
        question: 'Can I put a logo in the middle of a QR code?',
        answer:
          'Yes, if you use a high error correction level and keep the logo small enough that it covers only the center data area. Never cover the three corner finder patterns, and test the result on several phones.',
      },
    ]
  ),
  art(
    'qr-code-brand-colors-safe-combinations',
    'Using Brand Colours in QR Codes: Safe Palettes and What to Avoid',
    'qr code brand colours safe combinations',
    'How to map your brand colour palette to a QR code design that scans reliably — with worked examples for common brand colour profiles.',
    'Business & Regional',
    '5 min read',
    '2027-02-24',
    `
### The Brand Colour Challenge

Most brand guidelines were not written with QR code generation in mind. They specify a primary, secondary, and accent colour — none of which may be appropriate for QR module colouring without modification.

Understanding your brand palette's luminance values is the first step to creating a QR code that is both on-brand and scannable.

### Mapping Palette to QR Roles

| Brand Colour Role | QR Code Role | Condition |
|---|---|---|
| Primary (if dark) | Module foreground | Must be darkest available colour |
| Secondary (if light) | Module background | Must provide 4:1+ contrast with foreground |
| Accent | Frame border / CTA text | Outside the QR matrix — unrestricted |
| White/off-white space | Module background | Usually the safest choice |

### Worked Examples by Brand Archetype

**Dark blue brand (e.g., financial services):**
- Primary: #0D47A1 (dark blue) → safe as foreground against white (12.5:1 contrast)
- White #FFFFFF → background
- Accent gold #FFD600 → frame text only

**Green brand (e.g., sustainability/food):**
- Primary: #1B5E20 (dark green) → safe as foreground (11.6:1)
- Pale green #F1F8E9 → background
- White with green frame border → clean and on-brand

**Red brand (e.g., food/retail):**
- Primary red varies widely. #B71C1C (dark red) works (7.8:1). #F44336 (medium red) is marginal (4.5:1 against white) — use Level H error correction.
- Avoid bright red (#FF0000) — only 4.0:1 at the boundary.

**Yellow/orange brand (e.g., energy/consumer):**
- Yellow (#FFEB3B) as foreground against white = 1.1:1. Never usable as foreground.
- Solution: Use dark charcoal (#212121) or dark brand navy as module colour, with yellow as frame background or CTA highlight.

### Creating a Style-Consistent QR Without Compromising Contrast

1. Start with your darkest brand colour as the foreground
2. Use white or your lightest background as the module background
3. Apply brand colour to the surrounding frame/label design — not the modules
4. Add your logo in the centre using Level H error correction
5. Scan test on three devices

This approach consistently produces QR codes that are recognisably on-brand while maintaining scan reliability.

### When to Request a Brand Guideline Update

If your brand's entire palette is mid-tones or pastels, the QR code simply cannot use those colours for module foreground without failure. The correct action: document the constraint in your brand guidelines with a note that "QR code applications use [dark colour] foreground on white background per scan reliability requirements." This is a normal brand extension rule — like how logo colours change on dark backgrounds.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before you share a code widely.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Our brand uses only pastel colours. How can we make a branded QR code?',
        answer:
          'If your entire palette is light or pastel, none of those colours can safely be used as QR module foreground. Instead, apply brand colours to the surrounding frame, background wash, or call-to-action text. Use dark neutral — near-black or dark charcoal — for the modules themselves, and include your logo in the centre with Level H error correction.',
      },
      {
        question: 'Can we use a gradient background behind the QR code modules?',
        answer:
          'A gradient on the outer background (behind the entire QR including quiet zone) is fine if the area directly under the modules maintains consistent contrast. A gradient that passes through the module area from light to dark is risky — the scan threshold varies across the code. Apply gradients to the surrounding design, not the QR matrix background.',
      },
      {
        question: 'How do we ensure our branded QR code looks the same across different printers?',
        answer:
          'Specify colours in CMYK for print rather than RGB hex, and provide a minimum contrast specification to your print supplier. Request a physical proof before bulk printing. Screen-to-print colour shift is common — verify the printed foreground still appears significantly darker than the background under typical room lighting.',
      },
    ]
  ),
];
