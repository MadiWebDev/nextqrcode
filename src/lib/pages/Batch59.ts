import type { Article } from '../articles';
import { art } from './helper';

export const batch59: Article[] = [
  art(
    'qr-code-minimum-print-size',
    'QR Code Minimum Print Size: How Small Can You Go Without Losing Scannability?',
    'qr code minimum print size',
    'Definitive guide to QR code minimum print sizes — by QR version, error correction level, print method, and scanning distance.',
    'Printing & Sizing',
    '6 min read',
    '2027-04-06',
    `
### Why Size Matters

A QR code that is too small to scan is worse than no QR code — it wastes print real estate and frustrates users who try and fail. Understanding the relationship between physical size, QR version, and scanner capability lets you specify the correct minimum size for every application.

### The Fundamental Relationship

A QR code is made up of modules (the small squares). The minimum physical size is determined by: **modules × minimum module size**.

The minimum module size a camera can reliably resolve is approximately **0.25 mm** under ideal conditions (good lighting, close range, modern phone). For reliable performance across all conditions, use a minimum of **0.5 mm per module**.

| QR Version | Module Count | At 0.5mm/module | At 1mm/module |
|---|---|---|---|
| V1 | 21 × 21 | 10.5 × 10.5 mm | 21 × 21 mm |
| V3 | 29 × 29 | 14.5 × 14.5 mm | 29 × 29 mm |
| V5 | 37 × 37 | 18.5 × 18.5 mm | 37 × 37 mm |
| V10 | 57 × 57 | 28.5 × 28.5 mm | 57 × 57 mm |

For typical business card and label applications (V2–V5), the practical minimum is **25 × 25 mm** for reliable scanning under normal conditions.

### ISO/IEC 18004 Minimum Size Guidance

The QR code standard does not specify a hard minimum size — it specifies a minimum module size relative to the reader system's capabilities. For consumer smartphone scanning, the practical industry minimum is:

- **25 × 25 mm** for typical content (URL, vCard, WiFi credentials)
- **20 × 20 mm** only for very simple content (V1–V2) with Level H error correction under ideal conditions

### Minimum Sizes by Use Case

| Application | Recommended Minimum | Notes |
|---|---|---|
| Business card | 20 × 20 mm | V1–V3 only; test before printing |
| Product label | 25 × 25 mm | Standard reliable minimum |
| A5/A4 flyer | 30 × 30 mm | Slightly larger for low-quality print |
| Outdoor poster (< 2m) | 40 × 40 mm | For 1m scanning distance |
| Outdoor billboard (> 2m) | Use sizing formula | See distance section |

### Effect of Error Correction Level

Higher error correction levels (Q, H) add more data to the QR, increasing the version number and module count. This means a V5 QR at Level H is larger than a V3 QR at Level L for the same content. For size-constrained applications, use Level M or L and compensate by optimising your content (use short URLs, avoid unnecessary data).

### The Quiet Zone

Every minimum size specification assumes the quiet zone (4-module white border) is included. A QR printed at 25 mm with the quiet zone not factored in is effectively smaller and may fail to scan. Always add the quiet zone to your size specification.
    `,
    [
      {
        question: 'What is the absolute smallest QR code that a modern iPhone will scan?',
        answer: 'Under ideal laboratory conditions (perfect lighting, static subject, close focus), current iPhone camera systems can scan QR codes as small as 5–8 mm. In real-world conditions — typical indoor lighting, hand tremor, print quality variation — 20 mm is the practical reliable minimum. Below this size, scan failures become common enough to be problematic.',
      },
      {
        question: 'Does shrinking the QR code reduce the amount of data it can store?',
        answer: 'No. Shrinking the physical size does not change the data capacity — the same information is encoded whether the QR is 10 mm or 100 mm. What changes is scannability: a smaller QR requires a closer scanning distance and better lighting. The data capacity is determined by the QR version and error correction level, not the physical dimensions.',
      },
      {
        question: 'Why does my printed QR code fail to scan even though the digital version scans fine?',
        answer: 'Print introduces several degradation factors: ink bleeding (spread beyond the module boundary), paper texture creating noise, and low printer DPI causing fuzzy module edges. Test a physical print proof under the actual lighting conditions of the deployment environment, not under a desk lamp or bright office light. Low-quality printers at sub-300 DPI are a common cause of print-specific scan failures.',
      },
    ]
  ),
  art(
    'qr-code-dpi-print-guide',
    'QR Code DPI Guide: What Resolution You Need for Perfect Print Quality',
    'qr code dpi resolution print quality',
    'Choose the right DPI for printing QR codes — from business cards to billboards — with settings for common print methods and software.',
    'Printing & Sizing',
    '5 min read',
    '2027-04-07',
    `
### Understanding DPI for QR Codes

DPI (dots per inch) measures how many ink dots a printer places per inch of output. For a QR code, DPI determines how sharply the module edges are reproduced. Blurry module edges reduce contrast and increase scan failure rates.

### Minimum DPI by Print Method

| Print Method | Minimum DPI | Recommended DPI |
|---|---|---|
| Standard inkjet (home) | 150 | 300 |
| Standard laser (office) | 300 | 600 |
| Professional digital print | 300 | 600 |
| Offset litho (commercial) | 300 | 1200+ (lineart) |
| Screen print | 65 lpi equivalent | 150 dpi |
| Embroidery | N/A (not suitable) | Use simplified design |
| Label printer (thermal) | 203 DPI | 300 DPI |

### The Vector Advantage

The solution to DPI entirely is to use SVG (vector) format. A vector QR code has no resolution — it is mathematically defined lines and shapes that render at perfect quality at any size. When your print shop asks for artwork, supply SVG or PDF vector, not PNG or JPEG.

If you must use raster (PNG/JPEG):

- Calculate the required pixel dimensions: output size in inches × DPI
- Example: 50mm × 50mm at 300 DPI = (50/25.4) × 300 = 591 × 591 pixels minimum
- Always use PNG, never JPEG (JPEG compression artefacts destroy module edges)

### Checking Your QR Image Quality

Before submitting to print, zoom in to the QR image at 100% in an image editor:

- Module edges should be sharp and clean
- No grey anti-aliasing between the dark module and white background
- No blurring, feathering, or halo effects around modules

If you see any of the above issues, either:
1. Use a higher DPI version of the raster image, or
2. Use the SVG/vector version

### DPI for Specific Applications

**Business card (85 × 54 mm):**
QR at 20 × 20 mm area. At 300 DPI: 236 × 236 pixels minimum.

**A5 Flyer:**
QR at 40 × 40 mm area. At 300 DPI: 472 × 472 pixels minimum.

**A0 Poster:**
QR at 100 × 100 mm area. At 300 DPI: 1181 × 1181 pixels. Use vector.

### Thermal Label Printers

Many label printers operate at 203 DPI (8 dots/mm). At this resolution, QR codes smaller than 30 × 30 mm may fail. Key recommendations:

- Use 300 DPI thermal printers where scan reliability is critical (warehouse, pharmaceutical, healthcare)
- Test at actual print size before deploying at scale
- Use simple content (low QR version) to maximise module size at any given physical size
    `,
    [
      {
        question: 'Can I print a QR code from a screenshot and have it scan reliably?',
        answer: 'Screenshots are typically 72–96 DPI at screen resolution — far too low for quality print. A screenshot of a QR code printed at 50mm will be extremely blurry and likely unscannable. Always generate the QR fresh from a proper generator that offers high-resolution PNG export or SVG vector download.',
      },
      {
        question: 'Does the paper finish (matte vs gloss) affect QR scannability at the same DPI?',
        answer: 'Yes. Gloss paper can cause specular reflection (glare) that confuses scanner thresholding, particularly at oblique scan angles. Matte or silk paper is generally more reliable for QR code scanning. If gloss is required for design reasons, ensure the QR is printed with high contrast and test under typical scanning conditions including lighting at various angles.',
      },
      {
        question: 'What DPI setting should I use when exporting a QR code from Canva or Adobe?',
        answer: 'Export at 300 DPI minimum for any print application. In Canva, use "Download → PDF Print" which outputs at print-appropriate resolution. In Adobe Illustrator, export as SVG (no DPI limit) or as PNG at 300 DPI minimum. In Photoshop, set image size to 300 DPI before generating or placing the QR, and ensure no resampling degrades quality.',
      },
    ]
  ),
  art(
    'qr-code-print-material-comparison',
    'QR Code Print Materials Compared: Paper, Vinyl, Metal, and Fabric',
    'qr code print material comparison',
    'Compare QR code print performance across paper, vinyl, metal, fabric, and other materials — durability, contrast, and scanning considerations.',
    'Printing & Sizing',
    '5 min read',
    '2027-04-08',
    `
### Why Material Matters for QR Scanning

QR scanning depends on: optical contrast between modules and background, surface reflectivity, and print/substrate bond quality. Different materials affect all three. Choosing the wrong material for the deployment environment leads to faded, illegible, or unreliably scanning QR codes.

### Paper

**Coated (gloss/silk):**
Excellent print quality — sharp module edges due to minimal ink absorption. Risk: glare from reflective coating. Outdoor durability: low (moisture, UV). Best for indoor print materials.

**Uncoated (matte):**
Slight ink spread but minimal glare. Good scan reliability in normal lighting. Outdoor: low durability. Best for standard business documents.

**Synthetic paper (Polyart, Teslin):**
Waterproof, durable paper substitute. Prints like coated paper. Significantly more durable outdoors. Good for outdoor labels that still need paper-like finish.

### Vinyl

**Matt white vinyl:**
Excellent print surface, no glare, high durability. The best all-around material for outdoor QR codes. UV-resistant inks can last 5–7 years outdoors.

**Clear vinyl:**
Risk: the printed area may have reduced contrast against coloured surfaces underneath. Always add a white background layer behind the QR when printing on clear vinyl.

**Reflective vinyl:**
Never use for QR codes — the reflective surface causes extreme glare that renders the QR unscannable in most lighting conditions.

### Metal (Stainless Steel, Aluminium)

**Engraved or embossed:**
The QR pattern is physically raised or recessed. High durability (decades). Scannable if the contrast between the metal surface and the engraved area is sufficient. Satin or brushed finishes reduce glare better than mirror-polished surfaces.

**Printed on metal:**
Ceramic inks on aluminium (used in outdoor environmental signage) provide high-quality, long-lasting QR code printing. Excellent for permanent installations.

### Fabric and Textile

Standard printing on fabric is not recommended for QR codes — ink bleeding into fibres reduces module edge definition. For wristbands and fabric products:

- Use rigid wristband material (Tyvek, plastic-coated fabric)
- Keep QR codes simple (low version, short data)
- Print at larger sizes (40 × 40 mm minimum)
- Test before bulk production

### Summary Table

| Material | Durability | Glare Risk | QR Quality | Best For |
|---|---|---|---|---|
| Coated paper | Low | Medium | High | Indoor print |
| Vinyl (matte) | High | Low | High | Outdoor labels |
| Metal (engraved) | Very high | Low (satin) | Medium | Permanent signage |
| Synthetic paper | Medium | Low | High | Outdoor labels, tags |
| Fabric | Low | Low | Low | Wristbands (simplified) |
    `,
    [
      {
        question: 'How long does a QR code printed on standard vinyl last outdoors?',
        answer: 'Vinyl with UV-resistant laminate and UV-stable inks lasts 5–7 years in typical outdoor conditions. Unlaminated vinyl with standard inks fades significantly within 1–2 years when exposed to direct sunlight. For permanent outdoor installations, use UV-laminated vinyl or engraved metal for maximum lifespan.',
      },
      {
        question: 'Can a QR code be laser engraved onto wood?',
        answer: 'Yes. Laser engraving on wood creates a contrast between the raw wood and the engraved (darker, charred) areas. Scan reliability depends on the wood type and laser settings — darker woods with less natural contrast may need a painted background or a lighter laser setting that maximises the contrast. Test on the actual wood species before full production.',
      },
      {
        question: 'Are QR codes on stickers reliably scannable when applied to curved surfaces?',
        answer: 'Moderate curve (e.g., a cylindrical bottle) reduces scan reliability as the QR is distorted when viewed from an angle. QR codes with error correction Level Q or H handle some distortion. For highly curved surfaces, either increase the error correction level, reduce data density, or use a sticker that applies flat to a curved section rather than wrapping around the entire curve.',
      },
    ]
  ),
  art(
    'qr-code-outdoor-print-size',
    'QR Code Size for Outdoor Print: Billboards, Posters, and Signage',
    'qr code size outdoor print billboard',
    'Calculate the correct QR code size for outdoor applications — posters, A-frames, shop fronts, and billboards — based on viewing distance.',
    'Printing & Sizing',
    '5 min read',
    '2027-04-09',
    `
### The Distance Rule for Outdoor QR Codes

A QR code must be large enough to be captured clearly by a smartphone camera at the intended scanning distance. The formula:

**QR size (mm) = Scanning distance (metres) × 10**

| Scanning Distance | Recommended Minimum QR Size |
|---|---|
| 0.3 m (arm's length) | 30 × 30 mm |
| 0.5 m (typical standing) | 50 × 50 mm |
| 1 m (at a poster) | 100 × 100 mm |
| 2 m (shop window) | 200 × 200 mm |
| 3 m (A-frame / kerb sign) | 300 × 300 mm |
| 5 m (large banner) | 500 × 500 mm |
| 10 m+ (billboard) | QR codes not practical |

At distances above 5–6 metres, the scanning experience degrades significantly — smartphone cameras struggle to resolve and focus a QR at this range in real-world conditions. Billboards at 10+ metres should not rely on QR codes as the primary response mechanism.

### A-Frame and Pavement Sign

An A-frame sign viewed from the pavement requires a QR of at least 150 × 150 mm for comfortable scanning from a standing position at 1.5m. Place the QR at the top third of the sign where it is closest to eye level when the viewer has stopped to read the sign.

### Shop Window QR

Scanning from outside a shop window (1.5–2m): minimum 150–200 mm QR. Factors that reduce effective scan distance:

- Glass reflections (mitigated by scanning at angle)
- Frosted or tinted glass (avoid placing QR behind these)
- QR on the interior side of the glass (double the glass reflection risk)

**Best practice for shop windows:** Print the QR on a vinyl sticker applied to the outside surface of the window. This eliminates glass reflection and maximises contrast.

### Environment and Lighting Considerations

**Bright direct sunlight:** Gloss materials cause glare. Use matte vinyl or add anti-glare laminate.

**Artificial interior lighting:** QR codes in shop windows or on illuminated signage face changing light conditions through the day. Test scanning at peak contrast reduction times (noon sunlight for west-facing windows).

**Night and low light:** Standard QR codes are passive — they do not emit light. In low-light environments, the scanning area must be illuminated. A small light directed at the QR (common in hospitality settings) dramatically improves night scanning.
    `,
    [
      {
        question: 'Can a billboard include a QR code if viewers are driving past at speed?',
        answer: 'No — QR codes on roadside billboards are ineffective and potentially dangerous if they encourage drivers to use phones while driving. They are counterproductive even if legal in a given jurisdiction. On billboards, use a memorable short URL or phone number. QR codes on billboards are appropriate only at locations where pedestrians stop and read, not vehicle-speed pass-by contexts.',
      },
      {
        question: 'How do we ensure our outdoor QR code does not fade or become unscannable over time?',
        answer: 'Use UV-stable inks and UV-resistant overlaminate for outdoor vinyl. Budget for annual inspection of permanent outdoor QR codes — check physical condition and verify scannability with multiple devices. Replace materials before degradation becomes visible. For permanent outdoor installations (wayfinding, heritage trails), engraved or ceramic-printed signs with no ink layer are more durable than vinyl.',
      },
      {
        question: 'What is the maximum realistic viewing distance for a QR code on an outdoor poster?',
        answer: 'In controlled testing, modern smartphones can scan a QR from 3–4 metres when the QR is at least 300 × 300 mm and the lighting is good. In real-world conditions, expect reliable scanning from 2–2.5 metres. Design your QR size based on the expected scanning distance — not the maximum possible camera capability.',
      },
    ]
  ),
  art(
    'qr-code-business-card-size-guide',
    'QR Code Size on Business Cards: The Exact Dimensions That Work',
    'qr code size business card dimensions',
    'Find the optimal QR code size for business cards — balancing scan reliability, design space, and content density for different card sizes.',
    'Printing & Sizing',
    '4 min read',
    '2027-04-10',
    `
### Standard Business Card Dimensions

| Region | Standard Size |
|---|---|
| UK / Europe | 85 × 55 mm |
| US | 89 × 51 mm (3.5 × 2 in) |
| Japan | 91 × 55 mm |
| Square (modern) | 55 × 55 mm |

For a standard UK business card (85 × 55 mm), the QR code can occupy 20–25 mm on the back face without dominating the design.

### Recommended QR Sizes for Business Cards

| Card Face | QR Size | Notes |
|---|---|---|
| Back only | 20–25 mm | Sufficient for V1–V4 content |
| Front bottom-right | 15–18 mm | Small but functional for V1–V2 only |
| Half back (landscape) | 25 × 25 mm | Good design balance |
| Square card front | 25 × 25 mm | Square cards have more room |

**Minimum recommended:** 20 × 20 mm for a URL-only QR (V2–V3, Level M).

**Note:** A vCard with full contact information is V5–V8. At 20 × 20 mm, this may fail. For vCard QR codes on business cards, use 25 × 25 mm and Level M error correction.

### Design Layout for Back-of-Card QR

**Option A — Full back:**
QR centred on the back face with CTA text above: "Scan to save my details / see my portfolio / view my work." Clean and impactful.

**Option B — Bottom-right quadrant:**
Text, social icons, or a secondary graphic on the remaining 75% of the back face. More information-rich but requires careful layout to avoid crowding the QR.

**Option C — Front card with small QR:**
Integrated into the front card design. Requires minimum 15 mm and V1–V2 content only (short URL or email).

### Content Optimisation for Small QR

To fit a URL in a small QR (V1–V3):

1. Use a short URL — yourname.com or go.co/yourname rather than yourcompany.com/team/your-name-profile-page
2. Use a URL shortener: bit.ly or a custom short domain
3. Use HTTPS — the protocol adds characters but is non-negotiable for security

A 25-character URL generates a V2 QR — cleanly scannable at 20 × 20 mm.
A 100-character URL generates a V5–V6 QR — needs 25–30 mm minimum.
    `,
    [
      {
        question: 'Should the QR code on a business card go on the front or back?',
        answer: 'Back of card is strongly preferred. The front should communicate your name, title, company, and key contact at a glance — cluttering it with a QR reduces the quality of that first impression. The back is the appropriate place for supplementary digital interaction. Exception: premium cards where the QR is the design feature and no back-face text is needed.',
      },
      {
        question: 'What content should a business card QR link to for maximum impact?',
        answer: 'Link to a personal landing page that combines: a brief professional bio, links to your portfolio or LinkedIn, a vCard download button, and a contact form. This delivers far more than a vCard alone and keeps the content easily updatable without reprinting cards. A personal domain (yourname.com) makes the page memorable and brandable.',
      },
      {
        question: 'Can I include multiple QR codes on a single business card?',
        answer: 'Technically yes, but practically inadvisable. Multiple QR codes on a business card create visual clutter and decision fatigue. Choose one primary action — save contact details, visit portfolio, connect on LinkedIn — and commit to one QR. If the back needs multiple links, consider a landing page that lists all options, linked from a single QR.',
      },
    ]
  ),
];
