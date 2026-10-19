/**
 * QR Code Tools — Glossary Entry Data
 *
 * 30 technical QR/barcode terms with 300+ words of unique content each.
 * Pages at /glossary/[slug] require:
 *  ✓ Distinct search intent from sibling entries
 *  ✓ Formula/diagram where applicable
 *  ✓ Related tool links for internal linking (≥3 out)
 *  ✓ FAQ schema pairs
 */

export interface GlossaryEntry {
  slug: string;
  term: string;
  category:
    | 'encoding'
    | 'error-correction'
    | 'printing'
    | 'security'
    | 'standards'
    | 'scanning'
    | 'payments'
    | 'formats';
  shortDefinition: string;
  fullExplanation: string;
  relatedTerms: string[];
  relatedTools: string[];
  hasDiagramDescription: boolean;
  diagramDescription?: string;
  formulaLatex?: string;
  faqs: { question: string; answer: string }[];
  /** True only when the entry cites a real, verifiable spec URL. */
  requiresSources?: boolean;
  sources?: { label: string; url: string }[];
  status: 'approved' | 'needs_review';
  author: string;
  publishedAt: string;
  updatedAt: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    slug: 'module',
    term: 'Module',
    category: 'encoding',
    shortDefinition:
      'The smallest single square unit of a QR code matrix, representing one binary bit — dark for 1, light for 0.',
    fullExplanation: `
A module is the fundamental atomic unit of a QR code symbol. Every QR code is constructed from a square grid of modules, where each module represents exactly one binary digit: a dark (filled) module encodes a logical 1, and a light (empty) module encodes a logical 0.

The physical size of a module — denoted Wx in technical literature — directly determines both the printable dimensions of the QR code symbol and its minimum scanning distance. The relationship is straightforward: a Version 1 QR code contains a 21×21 module grid (441 modules total), while a Version 40 QR code expands to a 177×177 grid (31,329 modules total). As the version number increases, the total number of modules grows quadratically, increasing both data capacity and the physical size of the printed symbol at any given module width.

**Module Width and Print Sizing**

For reliable scanning by smartphone cameras, ISO/IEC 18004 specifies a minimum module width of 0.25mm, though practical engineering practice establishes 0.35mm as the realistic minimum for standard CMOS sensors in good lighting. The recommended minimum for commercial printing applications is 0.50mm per module.

The total printed symbol width can be calculated as:
Symbol Width = (Number of Modules per Row) × (Module Width)

For a Version 5 QR code (37 modules across) printed at a module width of 0.5mm:
Symbol Width = 37 × 0.5mm = 18.5mm

Adding the mandatory 4-module quiet zone on each side (4 × 2 sides × 0.5mm = 4mm per side):
Total Print Area Width = 18.5mm + 4mm + 4mm = 26.5mm

**Functional vs Data Modules**

Not all modules in a QR code encode user data. The symbol contains two distinct regions:

1. **Functional Pattern Modules:** The three finder patterns (7×7 each), timing tracks, separators, and alignment patterns consume a fixed number of modules that scale with version. These modules carry no encoded data — they serve as optical reference markers for the scanner.

2. **Data and Error Correction Modules:** The remaining modules encode the user's data codewords interleaved with Reed-Solomon parity codewords.

At higher QR versions, functional patterns occupy a smaller fraction of total modules, improving encoding efficiency. In Version 1, functional patterns consume approximately 36% of available modules; in Version 40, they represent only about 9%.

**Module Reflectance and Contrast**

The optical effectiveness of a module depends on its reflectance differential from the background. ISO/IEC 18004 requires the absolute difference in reflectance between dark modules (Rmin) and light modules (Rmax) to satisfy:
Rmax - Rmin ≥ 0.50 × Rmax

In practical terms, for white paper (Rmax ≈ 0.90), dark modules must have reflectance below 0.45 — easily achieved with standard black ink on coated paper. Problems arise when using colored inks, metallic substrates, or printing dark modules on dark-colored packaging.
    `,
    relatedTerms: [
      'finder-pattern',
      'quiet-zone',
      'version',
      'timing-pattern',
      'alignment-pattern',
    ],
    relatedTools: ['/qr-size-calculator', '/printed-qr-tester', '/qr-placement-guide'],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
      {
        label: 'Denso Wave — QR Code technology overview',
        url: 'https://www.denso-wave.com/en/technology/vol1.html',
      },
    ],
    hasDiagramDescription: true,
    diagramDescription:
      'Grid showing a 7×7 finder pattern with individual modules labeled dark/light, alongside a zoomed module with Wx dimension annotation and reflectance scale.',
    formulaLatex: 'W_{symbol} = N_{modules} \\times W_x + 8 \\times W_x',
    faqs: [
      {
        question: 'What is the minimum module size for a QR code to be scannable?',
        answer:
          'ISO/IEC 18004 specifies an absolute minimum of 0.25mm per module, but practical scanning reliability begins at 0.35mm for good lighting conditions. For commercial print production, use a minimum of 0.50mm per module.',
      },
      {
        question: 'Do dark modules always represent 1 and light modules represent 0?',
        answer:
          'In the raw bit stream, yes — dark = 1 and light = 0. However, after data masking is applied (one of 8 XOR patterns), some bits are flipped. The physical module colors are the post-masking representation, not the raw data bits.',
      },
      {
        question: 'How do I calculate the printed size of a QR code from its modules?',
        answer:
          'Multiply the modules per side — 21 + 4 × (version − 1) — by your module width, then add 8 module-widths for the quiet zone (4 per side). A Version 5 code (37 modules) at 0.5 mm modules needs 22.5 mm total.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'finder-pattern',
    term: 'Finder Pattern',
    category: 'encoding',
    shortDefinition:
      'Three identical concentric square markers at the top-left, top-right, and bottom-left corners of every QR code, enabling 360-degree orientation detection.',
    fullExplanation: `
Finder patterns — formally called Position Detection Patterns in ISO/IEC 18004 — are the three large square structures visible in the corners of every standard QR code. Their placement at three corners (top-left, top-right, and bottom-left) is deliberate and asymmetric: the absence of a fourth pattern in the bottom-right corner provides unambiguous orientation information to the scanner.

**The 1:1:3:1:1 Module Ratio**

The defining characteristic of a finder pattern is its cross-sectional module ratio of 1:1:3:1:1. Reading across any horizontal, vertical, or diagonal line through the center of the pattern, the scanner will encounter:
- 1 dark module (outer ring)
- 1 light module (separator gap)
- 3 dark modules (solid center square)
- 1 light module (separator gap)
- 1 dark module (outer ring)

This 1:1:3:1:1 ratio is unique in the natural world of text and imagery: it does not occur in typical printed content, architectural backgrounds, or common packaging graphics. Computer vision algorithms scan each captured camera frame in real time, searching for this specific ratio in linear pixel runs. When three instances of the ratio are found at mutually perpendicular orientations consistent with a square symbol, the decoder concludes a QR code has been located.

The mathematical uniqueness of this ratio allows the scanner to detect QR codes in 360-degree rotations, extreme angles of inclination (up to ~60° off-axis), and under partial obstruction. Modern smartphone QR decoders typically achieve detection in under 15 milliseconds from the moment the symbol enters the camera frame.

**Physical Structure**

Each finder pattern consists of three concentric squares:
- **Outer ring:** A 7×7 dark module square forming the outermost boundary
- **Inner white band:** A 5×5 light module square (one module wide border)
- **Center core:** A 3×3 dark module filled square at the center

Immediately surrounding each finder pattern is a one-module-wide separation band of light modules called a Separator. The separator prevents the finder pattern from merging visually with adjacent data modules, which could corrupt the scanner's ratio detection algorithm.

**Finder Patterns vs Alignment Patterns**

Beginners sometimes confuse finder patterns with alignment patterns (the smaller concentric squares that appear in QR codes of Version 2 and above). The key differences:
- Finder patterns are always exactly 7×7 modules; alignment patterns are always 5×5 modules
- Finder patterns only appear at three fixed corners; alignment patterns appear in a calculated grid across the symbol interior
- Finder patterns serve orientation and boundary detection; alignment patterns correct local distortion and warping
    `,
    relatedTerms: ['module', 'timing-pattern', 'alignment-pattern', 'quiet-zone', 'version'],
    relatedTools: ['/error-correction-simulator', '/printed-qr-tester', '/qr-safety-checker'],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
      {
        label: 'Denso Wave — QR Code technology overview',
        url: 'https://www.denso-wave.com/en/technology/vol1.html',
      },
    ],
    hasDiagramDescription: true,
    diagramDescription:
      'Labeled QR code anatomy diagram highlighting all three finder patterns with 1:1:3:1:1 ratio annotation, separators, and the deliberate absence of a fourth pattern in the bottom-right corner.',
    faqs: [
      {
        question: 'Why are there only 3 finder patterns and not 4?',
        answer:
          'The bottom-right corner intentionally has no finder pattern. This asymmetry provides unambiguous orientation information — a scanner seeing three patterns but not a fourth in the bottom-right corner instantly knows the exact rotation and reading direction of the symbol.',
      },
      {
        question: 'Can a QR code be decoded if one finder pattern is damaged?',
        answer:
          'With sufficient error correction headroom, yes. If a finder pattern is partially obscured, the decoder may be able to infer its location from the other two patterns and the symbol boundaries. However, complete destruction of two or more finder patterns causes total decoding failure regardless of error correction level.',
      },
      {
        question: 'What is the separator around a finder pattern?',
        answer:
          'A one-module-wide band of light modules surrounding each finder pattern. It keeps the 7×7 pattern visually distinct from adjacent data modules so the 1:1:3:1:1 ratio detection is not corrupted by neighboring dark modules.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'reed-solomon',
    term: 'Reed-Solomon Error Correction',
    category: 'error-correction',
    shortDefinition:
      'A non-binary BCH polynomial error correction algorithm used in QR codes to mathematically reconstruct damaged or missing data codewords.',
    fullExplanation: `
Reed-Solomon error correction is the mathematical engine that makes QR codes resilient to physical damage, dirt, occlusion, and printing defects. Invented in 1960 by Irving S. Reed and Gustave Solomon at MIT Lincoln Laboratory, it was originally developed for deep-space communication and satellite telemetry — environments where data corruption is unavoidable and retransmission is impossible.

**Algebraic Foundation: Galois Field GF(2⁸)**

QR codes implement Reed-Solomon over the finite field GF(2⁸) — also called Galois Field 256. In this algebraic system:
- Elements are integers from 0 to 255 (representing 8-bit bytes, or codewords)
- Addition is XOR (bitwise exclusive-or)
- Multiplication uses the primitive polynomial p(x) = x⁸ + x⁴ + x³ + x² + 1

The irreducible primitive polynomial defines how multiplications "wrap around" beyond 255 — analogous to how clock arithmetic wraps 13 back to 1. This wrap-around property guarantees that every non-zero multiplication result stays within the 0–255 range.

**Encoding: Generating Parity Codewords**

Given k data codewords, the encoder generates n-k parity (error correction) codewords. The complete codeword array has length n = k + (n-k). The encoding process:

1. Treat the k data codewords as coefficients of polynomial D(x)
2. Multiply by x^(n-k) to make room for the remainder
3. Divide x^(n-k)·D(x) by the generator polynomial g(x):
   g(x) = (x - α⁰)(x - α¹)...(x - α^(n-k-1))
   where α is a primitive root (typically α = 2 in GF(2⁸))
4. The remainder polynomial R(x) contains the n-k parity codewords

These parity codewords are appended after the data codewords in the final QR code payload.

**Decoding: Error Detection and Correction**

When a received codeword array R'(x) is evaluated at points α⁰ through α^(n-k-1), the resulting values (called syndromes) reveal whether any errors occurred:
- All zero syndromes → no errors detected
- Non-zero syndromes → errors present; the syndrome polynomial encodes location and magnitude

The decoder uses algorithms such as the Berlekamp-Massey or Euclidean algorithm to solve for the error locator polynomial, then applies the Chien search to find error positions, and finally applies Forney's algorithm to compute error magnitudes. Up to t = ⌊(n-k)/2⌋ full random errors can be corrected.

**QR Code Error Correction Levels**

| Level | Recovery | Typical Use |
|-------|----------|-------------|
| L | ~7% | High-density displays |
| M | ~15% | Standard marketing (default) |
| Q | ~25% | Industrial environments |
| H | ~30% | Logo-embedded QR codes |
    `,
    relatedTerms: ['ec-level', 'mask-pattern', 'version', 'structured-append', 'micro-qr'],
    relatedTools: ['/error-correction-simulator', '/qr-size-calculator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Block diagram showing the Reed-Solomon encoder pipeline: data codewords → polynomial division → parity codeword generation → interleaved final codeword stream.',
    formulaLatex:
      't = \\left\\lfloor \\frac{n-k}{2} \\right\\rfloor \\quad \\text{(maximum correctable errors)}',
    faqs: [
      {
        question: 'How much of a QR code can be physically damaged and still scan?',
        answer:
          "At Error Correction Level H, up to 30% of the data codewords can be corrupted or missing. This translates to roughly 30% of the symbol's surface area, though the damage must not destroy all three finder patterns or the format information strips.",
      },
      {
        question: 'Why does QR use Reed-Solomon instead of a simpler checksum?',
        answer:
          'Simple checksums (like CRC) can detect errors but cannot correct them — you can tell something is wrong, but not what or where. Reed-Solomon can both detect and mathematically reconstruct the original data without requiring a retransmission, which is essential for printed physical media.',
      },
      {
        question:
          'What is the difference between error detection and error correction in QR codes?',
        answer:
          'Detection only reveals that errors exist; correction locates them and reconstructs the original codewords. Reed-Solomon does both: syndrome evaluation detects errors, then the decoder solves for error positions and magnitudes, correcting up to half the number of parity codewords in random errors.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'quiet-zone',
    term: 'Quiet Zone',
    category: 'printing',
    shortDefinition:
      'The mandatory unprinted white border of at least 4 modules surrounding all four sides of a QR code, required for reliable scanner binarization.',
    fullExplanation: `
The quiet zone is arguably the most frequently violated QR code specification in commercial print production. Despite being one of the simplest requirements to implement — leave blank space around the code — quiet zones are chronically cropped by graphic designers unaware of their functional necessity.

**Why the Quiet Zone Is Not Decorative**

Camera sensors do not understand "QR code" as a concept. They capture raw photon intensity data across millions of pixels and deliver this as a raster image to the decoding software. The decoder's first processing step is binarization: converting each pixel to either black (1) or white (0) using an adaptive thresholding algorithm.

For binarization to work correctly at the symbol boundary, the algorithm requires a region of known constant luminance — the light substrate — against which it calibrates its dark/light threshold. If a dark element (text, a decorative border, a photo, or packaging color) touches or intrudes into this calibration zone, the threshold calculation shifts and the finder pattern's outer dark ring loses its sharp binarization boundary. The 1:1:3:1:1 ratio becomes corrupted and the scanner cannot locate the symbol.

**The 4-Module Minimum**

ISO/IEC 18004 Section 7.3.7 specifies a quiet zone width of at least 4X on all four sides, where X is the module width. At a module width of 1mm, the quiet zone must be at least 4mm wide on each edge — giving a total quiet zone "frame" of 8mm added to both the horizontal and vertical dimensions of the symbol.

For a Version 3 QR code (29 modules) at 1mm module width:
- Symbol body: 29mm × 29mm
- Quiet zone: 4mm × 4 sides
- Total print area: 37mm × 37mm

Shrinking the quiet zone to 2 modules — a temptation when space is tight — increases scan failure rates by 15–40% depending on lighting conditions and scanner quality.

**Real-World Quiet Zone Violations**

The most common quiet zone violations in commercial printing:
1. **Text or taglines placed immediately below the QR code** without sufficient clearance
2. **Colored backgrounds** that extend into the quiet zone region
3. **Bleed marks and registration marks** on print production files that overlap the quiet zone
4. **Die-cut boundaries** on stickers that trim into the quiet zone
5. **Image frames or borders** placed around QR codes for aesthetic effect

Our QR generator enforces the minimum quiet zone in all exported files. The SVG export includes the quiet zone as part of the viewBox dimensions.
    `,
    relatedTerms: ['module', 'finder-pattern', 'version', 'timing-pattern'],
    relatedTools: ['/qr-size-calculator', '/printed-qr-tester', '/qr-placement-guide'],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
      {
        label: 'Denso Wave — QR Code technology overview',
        url: 'https://www.denso-wave.com/en/technology/vol1.html',
      },
    ],
    hasDiagramDescription: true,
    diagramDescription:
      'Side-by-side comparison: correct QR code with labeled 4-module quiet zone vs. incorrect version with text cropping into the quiet zone and a red "SCAN FAIL" overlay.',
    formulaLatex: 'W_{total} = W_{symbol} + 2 \\times 4 \\times W_x',
    faqs: [
      {
        question: 'Can the quiet zone be a color other than white?',
        answer:
          'Yes, the quiet zone can be any color that matches the light modules of the QR code, as long as it provides at least a 4:1 luminance contrast ratio against the dark modules. A cream, light gray, or pale yellow quiet zone is acceptable; a dark or saturated quiet zone is not.',
      },
      {
        question: 'Does the quiet zone need to be exactly 4 modules, or can it be more?',
        answer:
          'Four modules is the minimum. More is always better — 5 or 6 modules provides additional scanning reliability in harsh print environments. Never go below 4 modules on any side.',
      },
      {
        question: 'What is the most common quiet zone mistake in print design?',
        answer:
          'Placing text, taglines, or decorative borders immediately adjacent to the code. Designers treat the quiet zone as empty margin to be used, but it is a functional calibration area — anything dark intruding into it shifts the binarization threshold and can prevent detection.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'ec-level',
    term: 'Error Correction Level',
    category: 'error-correction',
    shortDefinition:
      'One of four Reed-Solomon redundancy levels (L, M, Q, H) that determines how much of a QR code can be damaged while remaining decodable.',
    fullExplanation: `
Error correction level is the single most consequential quality decision a QR code designer makes. Choosing incorrectly leads to either unnecessarily dense symbols (from over-engineering) or catastrophic scan failures in real-world conditions (from under-engineering).

**The Four Levels**

ISO/IEC 18004 defines four error correction levels identified by single-letter codes:

**Level L (Low) — ~7% recovery:**
Approximately 7% of total codewords can be recovered. Level L produces the smallest, least dense QR symbols because fewer parity codewords need to be added. It is appropriate for clean, controlled display environments — digital screens, PDF documents, and freshly printed paper in office settings. Never use Level L for any code that will be physically printed and handled.

**Level M (Medium) — ~15% recovery:**
The de facto standard for commercial marketing materials. Recovers approximately 15% of damaged codewords. Suitable for business cards, brochures, posters, and most general-purpose applications. Produces symbols approximately 25% larger than Level L for equivalent data.

**Level Q (Quartile) — ~25% recovery:**
Used in industrial environments where labels are subject to abrasion, chemical exposure, and mechanical handling. Logistics carton labels, pharmaceutical packaging, and outdoor signage benefit from Level Q's extended recovery margin.

**Level H (High) — ~30% recovery:**
The maximum error correction level. Required whenever a brand logo or graphic is embedded in the center of the QR symbol — the logo deliberately destroys data modules, which must be reconstructed by parity codewords. Level H symbols are approximately 65% larger than Level L symbols for identical data payloads.

**The Size-vs-Resilience Trade-off**

The trade-off is direct and linear: higher error correction = more parity codewords = larger QR version = denser symbol = more modules = larger print area. For a URL of 50 characters:
- Version 3-L: 29×29 modules
- Version 3-M: 29×29 modules (same version, different partition)
- Version 4-Q: 33×33 modules
- Version 5-H: 37×37 modules

**Practical Decision Guide**

Use this hierarchy:
1. **Logo embedded?** → Always Level H, no exceptions
2. **Outdoor, industrial, or logistics?** → Level Q minimum
3. **General retail and marketing?** → Level M (default)
4. **High-density digital display, maximum data?** → Level L only if no physical print is involved
    `,
    relatedTerms: ['reed-solomon', 'version', 'module', 'mask-pattern', 'logo-safe-area'],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    relatedTools: ['/error-correction-simulator', '/qr-size-calculator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Four-panel comparison of the same URL at L, M, Q, H levels showing increasing module density, with recovery percentage and minimum print size noted beneath each.',
    faqs: [
      {
        question: 'Can I increase error correction on an already-printed QR code?',
        answer:
          'No. Error correction level is encoded into the format information bits of the QR code during generation. To change it, you must regenerate and reprint the code.',
      },
      {
        question: 'Does a higher error correction level make the QR code scan more slowly?',
        answer:
          'Slightly. A higher EC level produces a larger symbol with more modules, requiring the scanner to process more pixels. In practice, modern smartphone cameras decode all four levels in under 200ms — the difference is imperceptible to users.',
      },
      {
        question: 'Which error correction level should I use for a QR code with a logo?',
        answer:
          'Always Level H. The logo deliberately destroys data modules, and only the ~30% recovery of Level H leaves enough parity to reconstruct them plus handle normal print wear. Lower levels make logo codes fragile.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'emvco-tlv',
    term: 'EMVCo TLV (Tag-Length-Value)',
    category: 'payments',
    shortDefinition:
      'The international data encoding standard used by EMVCo for payment QR codes (Pix, UPI, SGQR, Raast, PromptPay), using nested Tag-Length-Value data objects.',
    fullExplanation: `
EMVCo Tag-Length-Value encoding is the structural backbone of virtually every modern national instant payment QR code system — from Brazil's Pix to India's UPI, Singapore's SGQR, Pakistan's Raast, and Thailand's PromptPay. Understanding TLV encoding is essential for any developer, payment integrator, or FinTech engineer building QR-based payment products.

**The TLV Data Model**

In EMVCo's Merchant-Presented QR Code Specification (MPM), each piece of payment data is encoded as a data object consisting of three components:

1. **Tag (ID):** A two-digit ASCII decimal string identifying the data field. Tags range from "00" to "99".
2. **Length:** A two-digit ASCII decimal string indicating the number of characters in the Value field.
3. **Value:** The actual data content, exactly the number of characters specified in Length.

For example, the Payload Format Indicator tag:
- Tag: "00"
- Length: "02" (2 characters)
- Value: "01"
- Complete data object: "000201"

This compact encoding produces human-readable ASCII strings that are simultaneously machine-parseable without a schema lookup table — the length field tells the parser exactly where each value ends.

**Nested Data Objects**

EMVCo TLV supports hierarchical nesting through merchant account information tags (26 through 51). A payment network registers its sub-tags within a parent tag. For example, Brazil's Pix uses Tag 26 for merchant account information, with sub-tags for the GUI ("br.gov.bcb.pix") and the Pix key.

A minimal Pix static QR payload structure:
00020126 (Payload Format Indicator = 01)
26 (Merchant Account Information, variable length)
  0014br.gov.bcb.pix (GUI sub-tag)
  0115financeiro@empresa.com.br (Key sub-tag)
5204 (MCC)
5303986 (Currency, 986 = BRL)
54XX (Amount, optional)
5802BR (Country code)
59XX (Merchant name)
60XX (City)
62XX (Additional data field template)
6304XXXX (CRC-16/CCITT checksum, mandatory last field)

**The CRC-16/CCITT Checksum (Tag 63)**

Every EMVCo payment QR code must end with a 4-character hexadecimal CRC-16/CCITT checksum computed over the entire payload string up to and including "6304". This checksum uses:
- Polynomial: 0x1021
- Initial value: 0xFFFF
- Input/output reflection: none

The CRC provides tamper detection — any modification to the payment amount, merchant name, or Pix key invalidates the checksum and causes banking apps to reject the code.

**Why Not Just Use JSON?**

TLV encoding was chosen over JSON for payment QR codes because:
1. It is more compact (no quotes, brackets, or key names)
2. It supports fixed-width parsing without a full JSON parser
3. It aligns with ISO 7816 smart card standards already embedded in payment terminal firmware
4. It naturally supports forward compatibility — unknown tags are skipped rather than causing parse failures
    `,
    relatedTerms: ['bip-21', 'eip-681', 'upi-intent', 'epc-girocode', 'vcard'],
    relatedTools: [
      '/payment-qr/brazil-pix-emv',
      '/payment-qr/india-upi',
      '/payment-qr/singapore-sgqr',
      '/regional-payment-qr',
    ],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated EMVCo TLV payload breakdown for a Pix QR code, with each Tag-Length-Value triplet color-coded and labeled with field name, showing the nested merchant account information structure.',
    faqs: [
      {
        question: 'What happens if the CRC-16 checksum in a payment QR code is wrong?',
        answer:
          'Banking applications validate the CRC before processing any payment. An incorrect checksum causes the app to display an "invalid QR code" error and refuse the transaction. Any modification to any field — including adding a space or changing letter case — invalidates the checksum.',
      },
      {
        question: 'Do all EMVCo payment QR codes use the same tag numbers?',
        answer:
          'The top-level tags (00, 26-51, 52, 53, 54, 58, 59, 60, 62, 63) are globally standardized by EMVCo. However, the sub-tags within Merchant Account Information (tags 26-51) are scheme-specific — each payment network (Pix, UPI, Raast) registers its own sub-tag structure with its governing body.',
      },
      {
        question: 'What is Tag 63 in an EMVCo payment QR code?',
        answer:
          'The mandatory final data object carrying a 4-character CRC-16/CCITT checksum computed over the entire payload. Banking apps validate it before processing — any alteration to amount, merchant, or key invalidates the checksum and the payment is rejected.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'data-matrix',
    term: 'Data Matrix',
    category: 'formats',
    shortDefinition:
      'A 2D square or rectangular matrix barcode standardized under ISO/IEC 16022, widely used in pharmaceutical, aerospace, and electronics manufacturing for ultra-small part marking.',
    fullExplanation: `
Data Matrix is a two-dimensional matrix barcode defined by ISO/IEC 16022, and it represents a fundamentally different engineering trade-off from QR codes. While QR codes are optimized for consumer scanning via smartphone cameras, Data Matrix was designed from inception for high-precision industrial imaging — laser engraving on circuit boards, dot-peening on aerospace components, and pharmaceutical direct-part marking (DPM) on surgical instruments.

**Physical Structure**

A Data Matrix symbol consists of:
1. **Finder Pattern ("L" Shape):** A solid dark line along two adjacent edges (bottom and left) that anchors the symbol's position and orientation. Unlike QR's three-corner finder patterns, Data Matrix uses this L-shaped border for its orientation reference.
2. **Alternating Timing Border:** The remaining two edges (top and right) feature an alternating dark-light pattern that defines the symbol's size and module pitch.
3. **Data Region:** The interior cells encode user data and Reed-Solomon error correction using the ECC 200 algorithm.

**Data Matrix vs QR Code: Key Differences**

| Property | Data Matrix | QR Code |
|-----------|-------------|---------|
| Standard | ISO/IEC 16022 | ISO/IEC 18004 |
| Min symbol size | 10×10 modules | 21×21 modules (V1) |
| Error correction | Reed-Solomon ECC 200 | Reed-Solomon over GF(2⁸) |
| Optimal use case | DPM, micro-labels | Consumer smartphone scanning |
| Smartphone readability | Limited (needs specialized app) | Native (all cameras) |
| Typical scan distance | 2–200mm (close-range industrial) | 5cm – 5m (consumer range) |
| Orientation detection | L-shape + timing border | Three finder patterns |

**GS1 Data Matrix in Pharmaceuticals**

The pharmaceutical industry uses GS1 DataMatrix — a specific implementation of Data Matrix with GS1 Application Identifier encoding — as the mandatory standard for unit-of-use drug labeling under:
- US FDA 21 CFR Part 820 (Device Labeling)
- EU Falsified Medicines Directive (FMD) 2011/62/EU
- WHO PQ Programme for Essential Medicines

GS1 DataMatrix on pharmaceutical packaging encodes the GTIN (01), expiration date (17), batch/lot number (10), and serial number (21) — enabling track-and-trace from manufacturing to patient administration.

**Why Data Matrix Is Not a QR Code Replacement**

For consumer-facing marketing applications, Data Matrix is not interchangeable with QR codes. Most native smartphone cameras (iOS Camera app, Google Lens) can decode Data Matrix but with lower reliability than QR codes, particularly in low-contrast environments or with small print sizes. Data Matrix lacks QR's consumer recognition — the majority of end users encountering a Data Matrix symbol on consumer packaging do not know to scan it.
    `,
    relatedTerms: ['micro-qr', 'rmqr', 'model-1-vs-model-2', 'version', 'gs1-digital-link'],
    relatedTools: ['/barcode-generator', '/printed-qr-tester', '/qr-size-calculator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Side-by-side visual: a Data Matrix symbol with the L-shape finder and timing border labeled, next to a QR code of equivalent data capacity, showing module count difference.',
    faqs: [
      {
        question: 'Can a standard smartphone camera scan Data Matrix codes?',
        answer:
          'Both iOS (since iOS 15 with System Camera) and Android (Google Lens) can decode ECC 200 Data Matrix codes. However, reliability is lower than with QR codes for small symbols or low-contrast print — specialized industrial barcode scanner apps provide more robust decoding.',
      },
      {
        question: 'Why do pharmaceutical packages use Data Matrix instead of QR codes?',
        answer:
          'Data Matrix was chosen for pharmaceutical DPM (Direct Part Marking) because it can be physically engraved or laser-etched onto glass vials, plastic ampoules, and metal surgical instruments at very small sizes (down to 1mm) that remain decodable by industrial cameras — smaller than practical QR code minimum sizes.',
      },
      {
        question: 'What does ECC 200 mean in Data Matrix?',
        answer:
          'The Reed-Solomon error correction scheme used by all modern Data Matrix symbols. ECC 200 replaced the older ECC 000–140 schemes and is the only version you should generate today; every current reader expects it.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'vcard',
    term: 'vCard Format',
    category: 'standards',
    shortDefinition:
      'An IETF-standardized electronic business card format (RFC 2426 for v3.0, RFC 6350 for v4.0) encoded into QR codes for instant contact import on iOS and Android.',
    fullExplanation: `
The vCard format — officially named the "vCard MIME Directory Profile" — is the universally accepted standard for encoding contact information in a machine-readable, platform-independent structure. When encoded into a QR code, a vCard enables smartphone users to scan a business card, product label, or conference badge and instantly add the contact to their phone's address book without manual data entry.

**vCard 3.0 vs vCard 4.0**

Two versions of vCard are relevant for QR code applications:

**vCard 3.0 (RFC 2426, 1998):** The older standard with near-universal support. Both iOS Camera app and Android Camera/Google Lens natively parse vCard 3.0 without requiring a third-party app. Despite its age, vCard 3.0 remains the recommended version for QR code digital business cards due to its universal device support.

**vCard 4.0 (RFC 6350, 2011):** The modern revision with richer property types, URI-based type parameters, and mandatory UTF-8 encoding. While technically superior, vCard 4.0 has inconsistent native camera support — particularly on older Android devices and legacy desktop email clients. Use vCard 4.0 only when you can control the scanning environment and verify app compatibility.

**Canonical vCard 3.0 Structure**

A complete vCard 3.0 payload for a QR code:
\`\`\`
BEGIN:VCARD
VERSION:3.0
N:Surname;GivenName;AdditionalName;Prefix;Suffix
FN:Display Name
ORG:Company Name
TITLE:Job Title
TEL;TYPE=WORK,VOICE:+12025551234
TEL;TYPE=CELL:+12025555678
EMAIL;TYPE=PREF,INTERNET:name@company.com
URL:https://company.com
ADR;TYPE=WORK:;;Street;City;State;PostalCode;Country
PHOTO;VALUE=URI:https://cdn.company.com/headshot.jpg
END:VCARD
\`\`\`

**Payload Size and QR Version Implications**

Each additional field increases the character count and forces the QR code into a higher version (denser symbol). Practical guidelines:
- **Minimal vCard (name + phone + email):** ~80 characters → Version 3 at Level M
- **Standard vCard (all fields above):** ~250 characters → Version 7 at Level M
- **vCard with base64 photo:** 3,000+ characters → Version 25+ at Level M (often unscannable on paper)

**Recommendation:** Never embed base64-encoded photos directly in vCard QR codes. Instead, use a URL reference to a hosted headshot image — this keeps the payload under 300 characters and the QR code in a scannable size range.

**Encoding Special Characters**

vCard properties containing commas, colons, or backslashes must be escaped with a backslash:
- Comma in address: \`Street\\, Suite 100\`
- Colon in URL: vCard parsers handle colons in URLs correctly when the property type is URL
- Semicolons separate N field components — include empty fields for unused components
    `,
    relatedTerms: ['mecard', 'encoding-modes', 'version', 'eci-mode', 'short-link'],
    requiresSources: true,
    sources: [
      {
        label: 'RFC 6350 — vCard Format Specification',
        url: 'https://www.rfc-editor.org/rfc/rfc6350',
      },
    ],
    relatedTools: ['/vcard-qr-code-generator', '/bulk-vcard-qr', '/bulk-vcard-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated vCard 3.0 payload with each property line labeled, and a corresponding QR code showing the version (density) impact of adding vs removing the PHOTO field.',
    faqs: [
      {
        question:
          'Does the vCard QR code work directly with the iPhone Camera app without a third-party scanner?',
        answer:
          'Yes. iOS Camera app since iOS 11 natively detects and parses vCard 3.0 payloads, displaying a "Add Contact" banner when a vCard QR code is scanned. vCard 4.0 may not be recognized by all iOS versions without a dedicated contacts app.',
      },
      {
        question:
          'How do I handle non-Latin characters (Arabic, Chinese, Korean) in a vCard QR code?',
        answer:
          'Use Byte Mode encoding in the QR generator with UTF-8 character encoding selected. vCard 3.0 technically uses ISO-8859-1 by default, but modern parsers universally accept UTF-8. Explicitly add the CHARSET=UTF-8 parameter to affected properties if you encounter import errors on legacy systems.',
      },
      {
        question: 'Should I use vCard 3.0 or 4.0 in a QR code?',
        answer:
          'Use 3.0 for maximum compatibility — every phone camera app parses it natively. vCard 4.0 (RFC 6350) is technically superior with UTF-8 throughout, but older devices and desktop clients handle it inconsistently.',
      },
    ],
    status: 'approved',
    author: 'CodexEngr, QR Systems Engineer',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
  },
  {
    slug: 'timing-pattern',
    term: 'Timing Pattern',
    category: 'encoding',
    shortDefinition:
      'A single-module-wide alternating dark-and-light track running horizontally and vertically between the finder patterns, giving the scanner a ruler for measuring module pitch and symbol density.',
    fullExplanation: `
The timing pattern is one of the quiet workhorses of the QR code symbol: two thin tracks of alternating dark and light modules that run the full width and height of the code, threading between the finder patterns. The horizontal track sits in the sixth row of the module grid and the vertical track in the sixth column, each beginning with a dark module adjacent to a finder pattern and alternating dark, light, dark, light all the way across.

**Why the scanner needs a ruler**

When a camera captures a QR code, the image is distorted by perspective: the code may be photographed at an angle, at an unknown distance, and at an unknown rotation. Before the decoder can read a single data bit, it must answer a deceptively hard question — exactly how wide is one module in this particular image, and how many modules wide is the symbol?

The timing pattern answers both questions at once. Because its dark-light alternation is perfectly regular — one module dark, one module light — the decoder can count the alternations along each track and derive two critical facts: the number of modules per row/column (which reveals the QR version) and the pixel width of a single module (which calibrates all subsequent sampling). Without this calibration track, the decoder would have to guess the module grid from the finder patterns alone, which is far less reliable under perspective distortion.

**Relationship to version sizing**

The length of the timing track grows with the QR version. In a Version 1 symbol (21 modules per side), the horizontal timing track spans the modules between the two top finder patterns; in a Version 40 symbol (177 modules per side), it spans a much longer run. Because the number of alternations is directly tied to the symbol size, the timing pattern acts as a redundant cross-check on the version information: the decoder can verify that the version implied by the timing track matches the version information blocks (present in Version 7 and above) and the format data. This redundancy is one reason QR codes remain decodable even when parts of the symbol are damaged.

**Functional patterns are never masked**

Timing pattern modules are functional patterns, not data modules. They are excluded from data masking (the XOR step applied to data and error-correction modules) and carry no user payload. Their fixed, predictable appearance is precisely what makes them useful as a calibration reference. When you enable "rounded dots" or artistic styling in a QR generator, a well-built encoder leaves the timing tracks — like the finder patterns — geometrically intact, because distorting them degrades the decoder's ability to establish the module grid.

**Practical implications for print**

Timing patterns are thin — one module wide — which makes them the first casualty of poor print quality. Ink spread (dot gain) on absorbent paper can cause adjacent dark modules to bleed together, and low-resolution printing can blur the alternation into a gray smear. If your printed QR code scans inconsistently, examine the timing tracks under magnification: they should resolve as crisp, evenly spaced stripes. The minimum module widths in the print-size guidance exist largely to keep these one-module features optically distinct.
    `,
    relatedTerms: ['finder-pattern', 'alignment-pattern', 'module', 'version', 'mask-pattern'],
    relatedTools: ['/error-correction-simulator', '/qr-size-calculator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Zoomed QR code excerpt showing the horizontal and vertical timing tracks as alternating dark/light single-module stripes between two finder patterns, with an arrow indicating how the decoder counts alternations to derive module width.',
    faqs: [
      {
        question: 'What does the timing pattern look like in a QR code?',
        answer:
          'It looks like a thin dashed line — a single-module-wide track of alternating dark and light squares running horizontally and vertically between the finder patterns. Most people never notice it because the eye is drawn to the large finder squares.',
      },
      {
        question:
          'Why does the scanner need the timing pattern if it already found the finder patterns?',
        answer:
          'Finder patterns tell the scanner where the code is and how it is rotated. The timing pattern tells it how big each module is in pixels and how many modules the symbol contains, which is the calibration needed to sample every data module at the correct location.',
      },
      {
        question: 'Can I style or recolor the timing pattern?',
        answer:
          'You should not. Timing tracks must remain high-contrast, single-module alternating stripes. Recoloring them to low-contrast brand colors or rounding them into dots degrades the module-grid calibration and causes scan failures, especially at an angle.',
      },
      {
        question: 'What happens if the timing pattern is damaged?',
        answer:
          'Minor damage is survivable because the decoder cross-checks timing data against the finder geometry and version information blocks. Severe damage to both tracks usually causes total decode failure, since the scanner cannot establish the sampling grid.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'alignment-pattern',
    term: 'Alignment Pattern',
    category: 'encoding',
    shortDefinition:
      'A 5×5 concentric-square marker placed in a grid across larger QR symbols (Version 2 and up) that corrects local warping, letting scanners read codes printed on curved, tilted, or uneven surfaces.',
    fullExplanation: `
Alignment patterns are the smaller concentric squares — 5 modules by 5 modules — that appear scattered across the interior of larger QR codes. While finder patterns handle global positioning (where is the code, which way is up), alignment patterns handle local distortion: the subtle warping that occurs when a QR code is printed on a curved bottle, photographed at a steep angle, or stuck to a slightly wrinkled label.

**How distortion breaks the sampling grid**

A QR decoder works by overlaying an ideal square grid on the camera image and sampling the center of each grid cell. On a perfectly flat code photographed straight-on, one global grid fits the whole symbol. But on a curved surface — a coffee cup, a pipe, a rounded product package — the modules near the edges are compressed relative to the center. A single global grid no longer matches reality: sample points drift off the true module centers, and the decode error rate climbs steeply.

Alignment patterns solve this by providing local anchor points. The decoder locates each 5×5 pattern in the image, compares its observed position against the ideal grid, and computes a local correction for the surrounding region. In effect, the symbol is divided into sub-regions, each calibrated independently — a piecewise correction that tracks the curvature of the surface.

**Placement follows a lookup table**

Unlike finder patterns, which sit at three fixed corners, alignment pattern centers are positioned according to a version-dependent lookup table defined in the specification. A Version 2 symbol carries a single alignment pattern near the bottom-right; as the version grows, the patterns form an expanding grid, reaching seven positions along each axis at Version 40. Positions that would overlap the finder patterns or their separators are omitted. This scaling is deliberate: larger symbols cover more physical area and therefore encounter more distortion, so they need denser correction coverage.

**Structure: a miniature finder**

Each alignment pattern is a 5×5 module structure with the same concentric logic as a finder pattern: a dark 5×5 outer square, a light 3×3 ring, and a single dark center module. The 1:1:1:1:1-ish cross-section through the center gives the vision algorithm a distinctive signature to hunt for, similar in spirit to the finder pattern's 1:1:3:1:1 ratio but smaller and unambiguous at its scale. The single dark center module is the precise anchor point the decoder uses for its local grid correction.

**Design and print implications**

Because alignment patterns are functional patterns, they must never be covered by logos, recolored to low contrast, or absorbed into decorative styling. A common failure mode in "designer QR codes" is a logo or graphic that overlaps an alignment pattern near the center of the symbol; the code may still scan head-on in good light but fails the moment it is photographed at an angle, because the decoder has lost the local reference it needs for that region. When evaluating a styled QR code, check that every alignment pattern — not just the three big finders — remains crisp and high-contrast.
    `,
    relatedTerms: ['finder-pattern', 'timing-pattern', 'module', 'version', 'mask-pattern'],
    relatedTools: ['/printed-qr-tester', '/qr-size-calculator', '/error-correction-simulator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Version 7 QR code with all six alignment patterns circled, plus an inset showing a code on a curved bottle where the decoder uses nearby alignment patterns to correct the warped sampling grid.',
    faqs: [
      {
        question: 'How is an alignment pattern different from a finder pattern?',
        answer:
          'Finder patterns are 7×7 modules at three fixed corners and handle global position and orientation. Alignment patterns are 5×5 modules in a version-dependent grid across the symbol interior and correct local distortion like curvature and perspective.',
      },
      {
        question: 'Do small QR codes have alignment patterns?',
        answer:
          'No. Version 1 symbols have no alignment patterns — the symbol is small enough that a single global grid suffices. The first alignment pattern appears at Version 2, and the count grows with version up to a 7×7 grid of positions at Version 40.',
      },
      {
        question: 'Can a QR code on a curved bottle really be scanned?',
        answer:
          'Yes, within limits. Alignment patterns let the decoder correct moderate curvature, such as a label on a bottle or can. Extreme curvature that hides modules from the camera, or codes wrapped so far around a small cylinder that timing tracks are occluded, will still fail.',
      },
      {
        question: 'Can I cover an alignment pattern with my logo?',
        answer:
          'No. Covering any alignment pattern removes the local distortion reference for its region. The code may scan in ideal conditions but will fail at angles or on curved surfaces. Keep logos centered and clear of all functional patterns.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'version',
    term: 'QR Code Version',
    category: 'encoding',
    shortDefinition:
      'The size class of a QR code symbol, numbered 1 to 40, where each step adds 4 modules per side — Version 1 is 21×21 modules and Version 40 is 177×177.',
    fullExplanation: `
Every QR code belongs to one of 40 versions, and the version number is simply a size class. Version 1 is the smallest symbol at 21×21 modules; each successive version adds 4 modules to each side, so Version 2 is 25×25, Version 3 is 29×29, and the largest, Version 40, is 177×177. The relationship is exact and linear: a Version V symbol measures 21 + 4(V − 1) modules per side. This is the first number a generator decides (usually automatically) once it knows your data length and error correction level.

**Version determines data capacity**

Data capacity grows roughly quadratically with version, because capacity scales with symbol area while functional patterns consume a shrinking fraction of it. At Error Correction Level L, a Version 1 symbol holds 41 numeric digits, 25 alphanumeric characters, or 17 bytes; a Version 40 symbol at the same level holds 7,089 numeric digits, 4,296 alphanumeric characters, or 2,953 bytes. Raising the error correction level trades capacity for resilience: the same Version 40 symbol at Level H holds far fewer data codewords because more of its area is devoted to parity. The practical consequence is that a generator choosing a version is really solving a small optimization problem — find the smallest version whose data region, after subtracting functional patterns and parity codewords, fits the payload.

**Version information blocks**

Versions 1 through 6 carry no explicit version marking; the decoder infers the version from the timing pattern and finder geometry. Versions 7 and above add dedicated version information: an 18-bit pattern (6 data bits protected by a BCH error-correcting code) placed in two 6×3 module blocks near the top-right and bottom-left finders. This explicit marking exists because at large symbol sizes, inferring the version from geometry alone becomes error-prone, particularly under perspective distortion. If you ever need to identify a code's version by eye, count the modules along one edge and apply the size formula — or look for the version information blocks flanking the finders.

**How generators select a version**

Quality QR generators select the minimal version automatically: they encode the payload, compute the required data codewords at the chosen error correction level, and pick the smallest version whose capacity covers it. Manual version selection is occasionally useful — for example, pinning a version so that a batch of codes shares identical geometry for a fixed-size print template — but overriding the automatic choice upward only makes the symbol denser than necessary, which hurts scannability. Overriding it downward produces an unencodable payload and a generator error.

**Version and physical print size**

Version interacts directly with print sizing. A Version 10 symbol (57 modules per side) printed at 0.5 mm per module is 28.5 mm wide before the quiet zone; the same symbol at 0.25 mm per module is 14.25 mm but approaches the reliability floor for phone cameras. Long URLs at high error correction levels can easily push a code into the Version 10–15 range, which is why shortening the encoded URL (or using a dynamic QR code) is the most effective way to keep printed symbols small and scannable.
    `,
    relatedTerms: ['module', 'finder-pattern', 'ec-level', 'mask-pattern', 'encoding-modes'],
    relatedTools: ['/qr-size-calculator', '/error-correction-simulator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Scale comparison of Version 1, 10, 25, and 40 symbols at identical module size, with the size formula annotated and version information block locations highlighted on the Version 10 example.',
    formulaLatex: 'S = 21 + 4(V - 1) \\quad \\text{(modules per side for version } V \\text{)}',
    faqs: [
      {
        question: 'How many QR code versions are there?',
        answer:
          'Forty. Version 1 is 21×21 modules and each version adds 4 modules per side, up to Version 40 at 177×177 modules. The original Model 1 specification only defined versions 1–14; Model 2 extended the range to 40.',
      },
      {
        question: 'How do I know which version my QR code is?',
        answer:
          'Count the modules along one edge of the symbol and solve 21 + 4(V − 1) = count. For example, 37 modules means Version 5. Most generators also report the version in their advanced or debug output.',
      },
      {
        question: 'What is the maximum data a QR code can hold?',
        answer:
          'A Version 40 symbol at Error Correction Level L holds 7,089 numeric digits, 4,296 alphanumeric characters, or 2,953 bytes. In practice, codes this dense are hard to scan from print — keep payloads short for real-world use.',
      },
      {
        question: 'Should I choose the QR version manually?',
        answer:
          'Usually no. Let the generator pick the smallest version that fits your data at your chosen error correction level. Manually pinning a version is only useful when you need identical geometry across a batch, such as a fixed print template.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'mask-pattern',
    term: 'Mask Pattern',
    category: 'encoding',
    shortDefinition:
      'One of 8 XOR patterns applied to the data modules of a QR code to break up large dark or light areas that would confuse the scanner, recorded in the format information bits.',
    fullExplanation: `
A mask pattern is an exclusive-or (XOR) transformation applied to the data and error-correction modules of a QR code — one of exactly eight patterns, numbered 000 through 111, defined by simple arithmetic on each module's row (i) and column (j). Mask 000, for example, flips every module where (i + j) mod 2 equals zero, producing a checkerboard effect. The functional patterns (finders, timing, alignment, separators) are never masked; only the modules carrying payload data are transformed.

**Why masking exists**

Raw encoded data is not random. A payload of mostly zeros, a long URL with repeated characters, or structured binary data can produce large solid blocks of dark or light modules, long straight runs, or accidental patches that mimic the finder pattern's 1:1:3:1:1 signature. These regularities are hostile to the decoder: solid regions give the binarization algorithm no edges to lock onto, and finder-like accidents create false position candidates that slow or break detection.

Masking breaks up these regularities by XOR-ing the data area with a pseudo-random-looking pattern. Because the mask is deterministic and its number is stored in the symbol's format information, the decoder simply applies the same XOR a second time to undo it (XOR is its own inverse) and recover the original bits.

**How the encoder chooses: penalty scoring**

The specification defines four penalty rules that quantify how "decoder-hostile" a masked symbol is: long runs of same-colored modules in rows or columns, 2×2 blocks of identical color, regions resembling the finder pattern ratio, and overall imbalance between dark and light modules. A compliant encoder applies all eight masks to the data area, scores each result against these rules, and selects the mask with the lowest total penalty. This is why the same payload can produce visually different QR codes in different generators only if one of them skips this step — a correct encoder converges on the optimal mask deterministically.

**Format information carries the mask number**

The decoder needs to know which mask was applied. That information lives in the format information: a 15-bit sequence placed in two copies near the finders, encoding the 2-bit error correction level and the 3-bit mask number, protected by its own error-correcting code so it survives moderate damage. If the format information is unreadable, the decoder can brute-force all eight masks and test which one yields valid data — a fallback most libraries implement, though it costs decode time.

**What this means for designers**

You cannot and should not choose a mask manually — it is an encoder-internal optimization, and any generator worth using performs the full 8-mask evaluation. Where masking matters to you is in understanding two things: first, that the "random-looking" texture of a QR code is deliberate engineering, not noise; and second, that heavy artistic styling of the data area (large color blocks, gradients) fights against the very uniformity the mask was chosen to achieve. Keep data modules crisp, high-contrast, and geometrically square, and the mask can do its job.
    `,
    relatedTerms: ['reed-solomon', 'ec-level', 'finder-pattern', 'timing-pattern', 'version'],
    relatedTools: ['/error-correction-simulator', '/qr-size-calculator', '/qr-safety-checker'],
    hasDiagramDescription: true,
    diagramDescription:
      'The same payload shown unmasked (with a large solid dark block) versus masked with pattern 000, annotated with the four penalty rules and the format information location that records the chosen mask.',
    formulaLatex:
      '\\text{Mask } 000: (i + j) \\bmod 2 = 0 \\quad \\text{(8 masks numbered 000–111)}',
    faqs: [
      {
        question: 'How many mask patterns does a QR code have?',
        answer:
          'Eight, numbered 000 to 111. Each is defined by a simple arithmetic condition on the module row and column, such as (i + j) mod 2 = 0 for mask 000. The encoder tries all eight and keeps the one with the lowest penalty score.',
      },
      {
        question: 'Can I pick the mask pattern for my QR code?',
        answer:
          'No, and you should not need to. Mask selection is an automatic encoder optimization defined by the specification. Any compliant generator evaluates all eight masks and selects the best one for your data.',
      },
      {
        question: 'Are the finder patterns affected by masking?',
        answer:
          'No. Masking applies only to data and error-correction modules. Finder patterns, timing patterns, alignment patterns, separators, and format/version information are functional patterns and are never masked.',
      },
      {
        question: 'How does the scanner know which mask was used?',
        answer:
          'The 3-bit mask number is stored in the 15-bit format information near the finder patterns, protected by its own error-correcting code. The decoder reads it, applies the same XOR to unmask the data, and decodes normally.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'encoding-modes',
    term: 'Encoding Modes',
    category: 'encoding',
    shortDefinition:
      'The four data compaction schemes in QR codes — numeric, alphanumeric, byte, and kanji — each with a 4-bit mode indicator and a packing method tuned to its character set.',
    fullExplanation: `
QR codes do not store text as plain bytes. Before any error correction or masking, the payload is compacted using one of four encoding modes, each designed for a different kind of data. The mode is announced by a 4-bit mode indicator at the start of the bit stream, followed by a character count indicator whose length depends on the symbol version, followed by the compacted data bits.

**Numeric mode (0001): digits only**

Numeric mode encodes the characters 0–9 at maximum density: every group of three digits is packed into 10 bits, a leftover pair into 7 bits, and a single leftover digit into 4 bits. Three decimal digits carry about 9.97 bits of information, so 10 bits per triplet is nearly optimal. This mode exists because so many real-world QR payloads are digit strings — phone numbers, serial numbers, IDs, amounts — and the density gain over byte mode is roughly 3.3×. If your payload is purely numeric, a good generator selects this mode automatically.

**Alphanumeric mode (0010): a 45-character set**

Alphanumeric mode supports 45 characters: digits 0–9, uppercase A–Z, space, and the symbols $ % * + − . / :. Pairs of characters are packed into 11 bits (45 × 45 = 2025 combinations fits in 11 bits), with a single trailing character taking 6 bits. This is the classic mode for URLs in uppercase, WiFi credentials without special characters, and industrial identifiers. Note the case restriction: lowercase letters are not in the set, so "https://Example.com" cannot use pure alphanumeric mode — the lowercase letters force a switch to byte mode.

**Byte mode (0100): 8-bit data**

Byte mode stores raw 8-bit bytes, interpreted by default as ISO-8859-1 (Latin-1). This is the universal fallback: URLs with lowercase letters, UTF-8 text, and binary data all travel in byte mode. Modern practice pairs byte mode with an ECI designator for UTF-8, which is how QR codes carry Arabic, Urdu, Chinese, emoji, and other non-Latin text. Byte mode is the least dense for digit-heavy data but the most general.

**Kanji mode (1000): Shift JIS efficiency**

Kanji mode compacts characters from the Shift JIS encoding (the Japanese standard) at 13 bits per character, covering the JIS X 0208 character set. Each character's two Shift JIS bytes are combined into a 13-bit value. This mode is a legacy of QR's Japanese origins and remains relevant for Japanese-language payloads, though UTF-8 byte mode has largely superseded it for new applications.

**Mixed modes and the character count indicator**

A single QR symbol can chain multiple segments in different modes — for example, a numeric segment for a phone number followed by a byte segment for a name — each with its own mode indicator and count. The character count indicator that follows each mode indicator is 10, 12, or 14 bits for numeric mode (and correspondingly shorter for other modes) depending on whether the version is 1–9, 10–26, or 27–40, because larger versions need wider counters. Sophisticated encoders analyze the payload and choose the optimal segmentation automatically; the difference between naive all-byte encoding and optimal mixed-mode encoding can change the required version for long payloads.
    `,
    relatedTerms: ['version', 'mask-pattern', 'structured-append', 'eci-mode', 'mecard'],
    relatedTools: ['/url-qr-code-generator', '/vcard-qr-code-generator', '/qr-size-calculator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Bit-stream diagram showing mode indicator, character count indicator, and data bits for the same digit string encoded in numeric mode versus byte mode, with the bit-count savings labeled.',
    faqs: [
      {
        question: 'Which encoding mode is used for a URL?',
        answer:
          'Usually byte mode, because URLs contain lowercase letters which are not in the 45-character alphanumeric set. An all-uppercase URL without special characters could use alphanumeric mode, but generators default to byte mode for URLs to be safe.',
      },
      {
        question: 'Why does numeric mode matter if byte mode can store anything?',
        answer:
          'Density. Numeric mode stores about 3.3 digits per byte versus 1 digit per byte in byte mode. For a 40-digit serial number, that is the difference between 14 bytes and 40 bytes of payload — potentially a whole QR version smaller.',
      },
      {
        question: 'How do QR codes store Chinese, Arabic, or emoji text?',
        answer:
          'In byte mode with the text encoded as UTF-8, announced by an ECI designator (000026 means UTF-8). The scanner reads the ECI header, interprets the following bytes as UTF-8, and renders the correct characters.',
      },
      {
        question: 'What is kanji mode used for today?',
        answer:
          'Kanji mode compacts Shift JIS Japanese text at 13 bits per character. It is a legacy of QR codes’ Japanese origins; new applications typically use UTF-8 byte mode instead, but decoders still support it for compatibility.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'structured-append',
    term: 'Structured Append',
    category: 'encoding',
    shortDefinition:
      'A QR feature that splits one logical payload across up to 16 separate symbols, each carrying its position, the total count, and a parity byte so the scanner can reassemble them in order.',
    fullExplanation: `
Structured append is the QR code's answer to payloads that are too large for a single symbol — or too large to print at a scannable size. Instead of forcing a long payload into one extremely dense Version 40 symbol, structured append divides the data into as many as 16 separate QR symbols. Each symbol carries a structured-append header (mode indicator 0011) containing three pieces of bookkeeping: the symbol's position in the sequence, the total number of symbols, and a parity byte. The scanner reads the symbols in any order, groups them by matching parity, sorts by position, and concatenates the payloads.

**The parity byte: how symbols find each other**

The parity byte is the elegant part of the design. Before splitting, the encoder XORs every byte of the original data together to produce a single parity byte, and stamps that byte into every symbol of the set. When the scanner encounters structured-append symbols, it groups symbols with identical parity values — so two different structured-append sets photographed in the same session cannot be mixed up. Position and total-count fields (4 bits each, allowing positions 1–16) then determine the reassembly order. Every symbol in the set must share the same parity, and the set is only complete when all positions from 1 to the total have been scanned.

**When splitting beats one big code**

A single Version 40 symbol at high error correction is enormous, dense, and unforgiving to print: tiny modules, extreme sensitivity to ink spread, and a large minimum physical size. Splitting the same payload into four Version 10 symbols can be dramatically more practical — each symbol is larger-modulated, more damage-tolerant, and easier to scan with a phone camera. Structured append is also the standard mechanism behind multi-symbol industrial labels, where a product's full data record (serial, batch, dates, identifiers) is distributed across several small codes on a label rather than one giant one.

**Reader support and practical limits**

The main limitation is decoder support: while structured append is part of the ISO specification, not every consumer scanning app implements reassembly, and support varies across phone camera apps. In practice, the feature shines in controlled environments — factory floors, logistics, healthcare — where the scanning software is known and compliant. For consumer marketing, splitting a payload across multiple codes that a casual user must scan in sequence is poor UX; a short URL or dynamic QR code is almost always the better answer. Additional constraints: all symbols should use the same error correction level, the parity must be computed over the pre-split data exactly as specified, and damaged symbols in the set can only be recovered if their own error correction covers the damage — there is no cross-symbol redundancy.

**Structured append versus alternatives**

Before reaching for structured append, consider the alternatives. If the payload is a long URL, shortening it (or using a dynamic QR code that encodes a short redirect) usually collapses the problem to a single small symbol. Structured append earns its place when the payload itself is inherently large and cannot be shortened — signed data, encrypted blobs, complete records that must be verifiable offline. In those cases it is the standards-based, interoperable way to span symbols, preferable to any proprietary multi-code scheme.
    `,
    relatedTerms: ['encoding-modes', 'version', 'reed-solomon', 'mask-pattern', 'fnc1'],
    relatedTools: ['/qr-splitter-scanner', '/qr-size-calculator', '/barcode-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'A long payload split into four QR symbols, each labeled with position/total/parity header fields, and arrows showing the scanner reassembling them into the original data in the correct order.',
    faqs: [
      {
        question: 'How many QR codes can structured append link together?',
        answer:
          'Up to 16 symbols. Each carries a 4-bit position field and a 4-bit total field, so positions 1 through 16 are addressable, plus a parity byte computed over the original data that binds the set together.',
      },
      {
        question: 'Do all 16 symbols need to be scanned?',
        answer:
          'Yes — the payload is only complete when every position from 1 to the total has been captured. There is no cross-symbol redundancy, so each individual symbol must be decodable on its own (aided by its own error correction level).',
      },
      {
        question: 'Will my phone camera app reassemble structured-append codes?',
        answer:
          'Maybe. Structured append is in the ISO specification, but consumer camera apps vary in support — many decode each symbol standalone without reassembling. It is most reliable in controlled environments with known, compliant scanning software.',
      },
      {
        question: 'When should I use structured append instead of a shorter URL?',
        answer:
          'Use it when the payload is inherently large and cannot be shortened: signed or encrypted data, complete offline-verifiable records, or industrial data sets. For long URLs, a short link or dynamic QR code is simpler and more user-friendly.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'static-qr-code',
    term: 'Static QR Code',
    category: 'formats',
    shortDefinition:
      'A QR code whose encoded data is final and immutable — the destination URL, text, or contact details are baked into the pattern itself and can never be changed or tracked.',
    fullExplanation: `
A static QR code encodes its complete payload directly in the symbol's modules. When someone scans it, the phone reads the data straight out of the pattern — a URL, a WiFi password, a vCard, a plain text message — with no intermediary server involved. The code is self-contained: it works offline, it never expires, it costs nothing to maintain, and no analytics are possible because nothing ever "phones home."

**The permanence trade-off**

The defining property of a static code is immutability. Once printed, the destination cannot be edited. If you print 10,000 product packages with a static QR code pointing to a URL and that URL later changes, every one of those codes is permanently wrong — the only fix is reprinting. This makes static codes ideal for data that genuinely never changes (a WiFi password for a home network, a vCard for a person, a product serial number, an emergency instruction card) and dangerous for anything with a shelf life (campaign landing pages, event registrations, app download links that migrate between stores).

**Privacy and reliability advantages**

Because no server sits between the scan and the data, static codes have real advantages. They work without internet connectivity — the vCard or WiFi credentials decode entirely on-device. They leak no scan data to any third party, which matters for sensitive contexts like medical instructions, internal facility codes, or jurisdictions with strict data rules. They cannot be "turned off" by a service shutting down, and they carry no subscription cost. A static QR code printed today will decode identically in twenty years, assuming the print survives.

**When the data must live in the code**

Some payloads only make sense as static codes. A WiFi QR code must contain the actual SSID and password — there is nothing to redirect to. A Bitcoin address QR should contain the address itself so the payer's wallet can verify it without trusting a redirect service. An EPC GiroCode or UPI intent encodes payment parameters that banking apps parse directly. In all these cases, inserting a redirect server would add failure modes and trust issues for zero benefit.

**Density: the hidden cost of static**

The main engineering cost of static codes is density. A long URL baked into the symbol forces a high QR version — a 100-character URL at Error Correction Level M lands around Version 7–8 — which means smaller modules at any given print size and a harder scan. The standard mitigation is to shorten the payload before encoding: strip tracking parameters, use a short domain, or prefer compact formats. If the payload cannot be shortened and the printed code becomes uncomfortably dense, that is the signal to switch to a dynamic QR code instead.
    `,
    relatedTerms: ['dynamic-qr-code', 'short-link', 'scan-analytics', 'encoding-modes', 'version'],
    relatedTools: ['/url-qr-code-generator', '/vcard-qr-code-generator', '/wifi-qr-code-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Side-by-side flow diagrams: a static QR scan resolving directly on-device with no network call, versus a dynamic QR scan hitting a redirect server first.',
    faqs: [
      {
        question: 'What is the difference between a static and dynamic QR code?',
        answer:
          'A static code contains the final data directly and can never be changed or tracked. A dynamic code contains a short redirect URL pointing to a server, so the destination can be edited later and scans can be counted.',
      },
      {
        question: 'Do static QR codes expire?',
        answer:
          'No. A static code has no server component, so there is nothing to expire, shut down, or charge you for. It remains valid as long as the printed symbol is legible and the encoded data (like a URL) still works.',
      },
      {
        question: 'Can I track scans of a static QR code?',
        answer:
          'Not from the code itself — there is no redirect to count. The only analytics available are server-side: if the code encodes a URL, your web analytics will show the visits, but you cannot distinguish QR scans from other traffic without UTM parameters.',
      },
      {
        question: 'When should I choose a static QR code?',
        answer:
          'Choose static when the data never changes and you want zero ongoing cost or dependency: WiFi credentials, contact cards, serial numbers, payment addresses, and offline instructions. Choose dynamic for campaigns, menus, or anything you might need to edit.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'dynamic-qr-code',
    term: 'Dynamic QR Code',
    category: 'formats',
    shortDefinition:
      'A QR code that encodes a short redirect URL instead of the final data, so the destination can be changed after printing and every scan can be counted and analyzed.',
    fullExplanation: `
A dynamic QR code does not contain your content — it contains a pointer to it. The symbol encodes a short URL hosted on a redirect service; when scanned, the phone opens that URL, the service logs the scan, and the visitor is forwarded to the real destination. The printed pattern never changes, but everything it points to can: the destination URL, the campaign it belongs to, even the content type.

**Editability: fix mistakes after print**

The headline benefit is post-print editing. A restaurant reprints menus seasonally; with a dynamic code, the printed symbol stays identical while the linked menu updates. A marketing team discovers a typo in a campaign URL after 50,000 flyers ship; with a dynamic code, they fix the redirect target in seconds instead of reprinting. This editability is the reason dynamic codes dominate commercial print: the cost of a reprint almost always exceeds the cost of the redirect service.

**Scan analytics come free with the architecture**

Because every scan passes through the redirect server, counting and characterizing scans is inherent to the design: total scans, scans over time, device types, approximate geography, and referrers. UTM parameters can be appended at redirect time so web analytics attribute the traffic correctly. None of this is possible with static codes, where the scan never touches a server you control.

**The dependency you are buying**

Dynamic codes trade permanence for flexibility, and the price is dependency. The redirect service must stay online, stay in business, and keep your links active for as long as the printed codes circulate. If the service shuts down, changes its terms, or lets a domain lapse, every printed code dies simultaneously — a correlated failure mode that static codes simply do not have. Evaluate providers on link longevity guarantees, export options, and what happens to your redirects if you cancel. For codes printed on durable goods, packaging, or signage with multi-year lifespans, weigh this dependency carefully against the convenience.

**Security considerations**

A dynamic code's redirect is also a trust decision by the scanner. Security-conscious users cannot tell from the pattern alone where a dynamic code will land, which is why preview features ("you are about to visit…") and reputable short domains matter. From the owner's side, the redirect service becomes a high-value target: compromising it would let an attacker reroute all of a brand's printed codes at once. Use providers with access controls, change audit logs, and HTTPS everywhere.

**Choosing between static and dynamic**

The decision rule is simple: if the destination might ever change, or you need scan data, use dynamic. If the data is permanent, must work offline, or must outlive any service provider, use static. Many organizations use both — static codes for WiFi, contacts, and equipment labels; dynamic codes for campaigns, menus, and anything customer-facing with a shelf life.
    `,
    relatedTerms: ['static-qr-code', 'short-link', 'scan-analytics', 'utm-parameters', 'deep-link'],
    relatedTools: ['/url-qr-code-generator', '/utm-builder', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'Flow diagram of a dynamic QR scan: phone → short URL → redirect service (logs scan, looks up current destination) → final landing page, with an edit arrow showing the destination being changed post-print.',
    faqs: [
      {
        question: 'Can I change the destination of a QR code after printing it?',
        answer:
          'Only if it is a dynamic QR code. Dynamic codes encode a redirect URL, so you can change where it points at any time. A static code’s data is baked into the pattern and can never be changed — it must be reprinted.',
      },
      {
        question: 'Do dynamic QR codes need the internet to work?',
        answer:
          'Yes. The scan must reach the redirect server to resolve the destination. In offline environments — factories, remote sites, airplanes — use static codes whose data decodes entirely on-device.',
      },
      {
        question: 'What happens to my dynamic QR codes if the service shuts down?',
        answer:
          'They stop working, because the short URLs they encode no longer resolve. This is the core risk of dynamic codes. Choose providers with longevity guarantees, keep an export of your link mappings, and prefer dynamic codes for campaigns rather than permanent signage.',
      },
      {
        question: 'Are dynamic QR codes less secure than static ones?',
        answer:
          'They add a trust layer: the scanner cannot see the final destination from the pattern alone. Mitigate this with a reputable short domain, HTTPS redirects, link preview features, and provider access controls with audit logs.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'short-link',
    term: 'Short Link',
    category: 'formats',
    shortDefinition:
      'A compact redirect URL (often on a branded domain) that sits behind a dynamic QR code, keeping the encoded payload tiny so the printed symbol stays small, sparse, and easy to scan.',
    fullExplanation: `
A short link is a brief URL — typically a short domain plus a few characters, like brand.to/sale25 — that redirects to a longer destination. In the QR code world, short links are the engine inside dynamic QR codes: instead of encoding a 120-character campaign URL directly into the symbol (forcing a dense, hard-to-scan code), the generator encodes a 20-character short link, and the redirect service resolves it to the full destination at scan time.

**Density is the reason short links exist**

QR code density is driven almost entirely by payload length. Every extra character pushes the symbol toward a higher version with more, smaller modules. A 120-character URL at Error Correction Level M needs around Version 9 (53×53 modules); the same destination behind a 22-character short link fits in Version 3 (29×29). At a fixed print size, the short-link code has modules nearly twice as wide — dramatically easier for phone cameras, especially in poor light or at a distance. Shortening the payload is the single highest-leverage optimization available to a QR designer, and short links are how you do it without losing the destination.

**Branded versus generic short domains**

Short links can live on a generic shortening domain or on a branded one (yourbrand.link/offer). Branded domains earn more scan trust — users who preview the URL see your name, not a stranger's — and they protect you from the reputation problems of public shorteners, whose domains are sometimes flagged by security filters because of abuse by others. They also survive provider changes better: if you control the domain, you can repoint it to a new redirect service without reprinting codes.

**Anatomy of a redirect**

A production short-link service does more than a 301 redirect. At minimum it records the scan (timestamp, coarse device and geography), enforces the current destination mapping, and appends any configured UTM parameters before forwarding. Better services add link expiration, password protection, device-based routing (send iOS users to the App Store and Android users to Google Play), and A/B destination testing. All of this logic lives behind the short URL, invisible to the scanner but powerful for the owner.

**Longevity and ownership**

The caution with short links mirrors that of dynamic QR codes: the link must resolve for as long as printed codes circulate. Free or anonymous shorteners owe you nothing and may recycle or delete links; links on domains you control, backed by a service with explicit longevity commitments, are the safe choice for print. Before printing at volume, verify the redirect chain end to end — scan the code, confirm the landing page, check that UTM parameters survive, and confirm the link works from a logged-out browser with no cookies.
    `,
    relatedTerms: [
      'dynamic-qr-code',
      'scan-analytics',
      'deep-link',
      'utm-parameters',
      'static-qr-code',
    ],
    relatedTools: ['/url-qr-code-generator', '/utm-builder', '/qr-safety-checker'],
    hasDiagramDescription: true,
    diagramDescription:
      'Comparison of two QR symbols: one encoding a 120-character URL (dense, Version 9) and one encoding a 22-character short link (sparse, Version 3), with module widths labeled at the same print size.',
    faqs: [
      {
        question: 'Why do dynamic QR codes use short links?',
        answer:
          'To keep the encoded payload tiny. A 22-character short link fits in a small, sparse QR version with wide modules that scan easily; encoding the full 120-character URL directly would force a dense, hard-to-scan symbol.',
      },
      {
        question: 'Should I use a branded short domain?',
        answer:
          'Yes for anything customer-facing. Branded domains build scan trust, avoid the spam-filter reputation problems of public shorteners, and let you move redirect providers without reprinting by repointing a domain you control.',
      },
      {
        question: 'Can short links expire?',
        answer:
          'They can if the service sets an expiry or deletes inactive links — which is exactly why free anonymous shorteners are risky for print. Use a service with explicit longevity guarantees for codes that will circulate for months or years.',
      },
      {
        question: 'Do short links slow down the scan experience?',
        answer:
          'Negligibly. A well-run redirect resolves in well under a second. The far bigger speed factor is decode time: the sparser symbol that the short link enables scans noticeably faster than a dense one.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'deep-link',
    term: 'Deep Link',
    category: 'formats',
    shortDefinition:
      'A URL that opens a specific screen inside a mobile app rather than a web page, letting a QR code launch app content directly — with a web fallback for users without the app.',
    fullExplanation: `
A deep link is a URL that resolves inside a mobile application instead of (or in addition to) a web browser. Where an ordinary link opens a homepage, a deep link opens a specific product page, a playlist, a document, or a checkout screen within the app. Encoded in a QR code, deep links bridge the physical-to-app journey: scan a code on a restaurant table and land directly on that restaurant's ordering screen in the app, not on a generic website.

**The three mechanisms**

Deep linking on modern phones works through three mechanisms. Custom URI schemes (myapp://product/123) are the oldest: simple to implement, but any app can claim a scheme and there is no verification of ownership. Universal Links (iOS) and App Links (Android) use ordinary https URLs with a verification file hosted on the domain (apple-app-site-association / assetlinks.json), so the operating system can cryptographically confirm that the app is authorized for the domain — this is the current best practice. The third pattern is deferred deep linking, where a click first passes through an attribution service that remembers the context and delivers it after the user installs the app.

**Why QR codes pair naturally with deep links**

QR codes are scanned overwhelmingly on phones, which is exactly where deep links work. The pairing solves the classic app-acquisition problem: a code on packaging or in-store signage can route existing app users straight into the relevant screen while sending everyone else somewhere useful. Without a deep link, the best a code can do is open a mobile web page and hope the user finds the app from there — a journey with heavy drop-off at every step.

**The fallback problem**

The hard part of QR deep linking is handling users who do not have the app. A raw custom-scheme QR code does nothing at all on a phone without the app — the scan appears broken. Robust implementations therefore encode an https URL (a Universal Link / App Link, or a smart routing URL) rather than a bare scheme: users with the app go straight into it, and users without it land on a mobile web page that offers the App Store / Google Play download, ideally carrying the original context through the install via deferred deep linking. Always test the no-app path, because it is the path most scanners will take.

**Deferred deep links and attribution**

Marketing teams often want to know which physical placement drove an install. Deferred deep linking services fingerprint the scan context (via the routing URL's parameters) and, after install, deliver the user to the intended in-app screen while attributing the install to the scan. This is powerful for measuring offline-to-app funnels, but it involves third-party SDKs and device fingerprinting, so review the privacy implications and platform policies before deploying it.

**Practical checklist**

Use verified Universal Links / App Links over custom schemes; always provide a web fallback; carry context parameters (product ID, campaign) through the routing URL; test on both platforms with and without the app installed; and keep the final URL short enough that the QR symbol stays scannable — deep link URLs with long parameter strings benefit from sitting behind a short link.
    `,
    relatedTerms: [
      'dynamic-qr-code',
      'short-link',
      'scan-analytics',
      'utm-parameters',
      'static-qr-code',
    ],
    relatedTools: ['/url-qr-code-generator', '/utm-builder', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'Decision flowchart for a QR deep-link scan: app installed → open in-app screen; app missing → mobile web fallback with store badges and context preserved for post-install routing.',
    faqs: [
      {
        question: 'What happens if someone scans an app deep-link QR code without the app?',
        answer:
          'With a proper https-based Universal Link or App Link, they land on a mobile web fallback page — usually with App Store and Google Play buttons. A bare custom-scheme code (myapp://) does nothing on phones without the app, which is why the https pattern is preferred.',
      },
      {
        question: 'What is the difference between a deep link and a deferred deep link?',
        answer:
          'A deep link opens a specific in-app screen for users who already have the app. A deferred deep link additionally remembers the context through the install process, so a new user who installs the app after scanning still lands on the intended screen.',
      },
      {
        question: 'Are Universal Links better than custom URI schemes for QR codes?',
        answer:
          'Yes. Universal Links (iOS) and App Links (Android) are verified against your domain, cannot be hijacked by another app, and degrade gracefully to a web page. Custom schemes are unverified and fail silently without the app.',
      },
      {
        question: 'Can I track which QR placement drove an app install?',
        answer:
          'Yes, by encoding distinct routing URLs per placement and using deferred deep linking with attribution. The routing service matches the install back to the scan context. Review privacy rules and SDK data collection before deploying this.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'micro-qr',
    term: 'Micro QR Code',
    category: 'formats',
    shortDefinition:
      'A compact QR variant with a single finder pattern and symbol sizes from 11×11 to 17×17 modules, designed for marking very small parts and labels where a full QR code cannot fit.',
    fullExplanation: `
Micro QR is a shrunken sibling of the standard QR code, created for applications where even the smallest regular QR symbol is too large: printed circuit boards, electronic components, surgical instruments, small pharmaceutical labels, and tiny asset tags. Where a standard QR code bottoms out at 21×21 modules, Micro QR defines four versions — M1 through M4 — at 11×11, 13×13, 15×15, and 17×17 modules respectively.

**One finder pattern instead of three**

The most visible difference is structural: Micro QR carries only a single finder pattern in the top-left corner, plus a shortened timing track along two edges. Dropping two finder patterns and the alignment patterns saves precious modules in symbols this small. Orientation is unambiguous with one finder because the symbol's asymmetry is total — there is only one corner with the 1:1:3:1:1 marker. The trade-off is reduced tolerance for rotation and perspective distortion compared with full QR, which is acceptable because Micro QR is typically read by fixed industrial cameras at controlled distances, not by hand-held phones at odd angles.

**Capacity and error correction**

Capacities are modest, as the sizes suggest. An M4 symbol at Error Correction Level L holds 35 numeric digits (or 21 alphanumeric characters); M1, the tiniest, holds just a handful of digits and offers error detection rather than full correction. Only two error correction levels (L and M) are defined for Micro QR — the higher Q and H levels would consume too much of the tiny data area to be useful. The quiet zone requirement is also relaxed to 2 modules, reflecting the controlled imaging environments where these codes are deployed.

**Where Micro QR fits — and where it does not**

Micro QR is an industrial format, standardized alongside QR in ISO/IEC 18004. Its natural habitat is direct part marking: laser-etched or dot-peened onto metal, printed on miniature labels, or etched into silicon, then read by machine-vision systems on production lines. It is not a consumer format. Phone camera apps vary wildly in Micro QR support — many will not detect the single-finder symbol at all — so never use Micro QR for anything a customer is expected to scan. If the use case involves human scanning with phones, use a standard QR code and solve the space problem with a short payload, not a smaller symbology.

**Choosing between Micro QR and alternatives**

For ultra-small marking, the decision tree runs: Micro QR for the smallest machine-readable footprints within the QR ecosystem; Data Matrix for even smaller sizes and the broadest industrial reader support (it is the dominant choice in electronics and aerospace); and standard QR whenever a phone might be the reader. The three symbologies overlap in capability but differ in ecosystem — reader support, not raw specification, usually decides.
    `,
    relatedTerms: ['model-1-vs-model-2', 'rmqr', 'version', 'module', 'finder-pattern'],
    relatedTools: ['/barcode-generator', '/qr-size-calculator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Size comparison of Micro QR M1 through M4 beside a standard Version 1 QR code at the same module pitch, highlighting the single finder pattern and the 2-module quiet zone.',
    faqs: [
      {
        question: 'Can a phone camera scan a Micro QR code?',
        answer:
          'Usually not reliably. Micro QR has a single finder pattern and many consumer scanning apps do not implement it. It is designed for industrial machine-vision readers. Use standard QR codes for anything a customer will scan.',
      },
      {
        question: 'How small can a Micro QR code be?',
        answer:
          'M1 is 11×11 modules — at a 0.25 mm module pitch that is under 3 mm square plus a 2-module quiet zone. M4 (17×17) holds up to 35 numeric digits at Error Correction Level L.',
      },
      {
        question: 'Why does Micro QR have only one finder pattern?',
        answer:
          'To save space. In symbols this small, two extra 7×7 finder patterns would consume most of the data area. One finder is enough for orientation because the symbol is fully asymmetric, and industrial readers image these codes under controlled conditions.',
      },
      {
        question: 'Micro QR or Data Matrix for tiny part marking?',
        answer:
          'Data Matrix is the more widely supported choice in electronics and aerospace direct-part marking, with broader reader compatibility. Choose Micro QR when you specifically need QR-ecosystem tooling; otherwise Data Matrix is usually the safer industrial default.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'rmqr',
    term: 'rMQR Code',
    category: 'formats',
    shortDefinition:
      'A rectangular variant of the QR code — taller widths than heights from 43×7 up to 139×17 modules — designed for narrow spaces like receipts, labels, and component reels where a square code cannot fit.',
    fullExplanation: `
rMQR (rectangular Micro QR) is Denso Wave's answer to a mundane but pervasive problem: many real-world surfaces are long and narrow, not square. Receipt headers, shipping label margins, electronic component reels, cable flags, and the edges of circuit boards offer thin rectangular strips where a square QR code simply does not fit. rMQR keeps QR's encoding, error correction, and reader logic but repackages the symbol as a rectangle, with widths always exceeding heights.

**Rectangular geometry**

rMQR symbols are named R-height×width: from R7×43 (7 modules tall, 43 wide) up to R17×139, with several intermediate sizes. The finder pattern arrangement is adapted to the rectangle — corner markers positioned for the elongated shape — while the data encoding, Reed-Solomon error correction, masking, and format information follow the same principles as standard QR. The quiet zone and high-contrast requirements are unchanged: a rectangle does not relax the optical rules, it only changes the aspect ratio.

**Why not just use a smaller square QR?**

The alternative to rMQR is shrinking a square QR until it fits the narrow dimension — but that shrinks the data capacity with the square of the size reduction, often below what the payload needs, and produces tiny modules that are hard to print and scan. A rectangular symbol uses the available long dimension fully: an R17×139 code has far more data modules than any square code that fits in a 17-module-tall strip. For the same strip height, rMQR carries several times the payload of the largest square code that fits.

**Ecosystem and reader support**

rMQR was introduced by Denso Wave in 2022 and subsequently standardized by ISO, which gives it a solid specification foundation. The practical caveat is the same as with Micro QR: reader support lags the standard. Industrial machine-vision libraries have adopted it, but consumer phone camera apps generally do not decode rMQR. Deploy it where the readers are known and controlled — production lines, warehouse scanners, purpose-built apps — and stick with square QR for consumer-facing placements.

**Design guidance**

Treat rMQR like any QR symbol for print discipline: minimum module widths, 4-module-equivalent quiet zones, dark-on-light contrast, and no styling of the finder or timing structures. The elongated shape actually helps placement on real packaging — a code that runs along the bottom edge of a label is less likely to be covered by handling than a square code floating in the middle. When planning label layouts, consider rMQR early: retrofitting a rectangular strip for a square code late in a packaging design cycle is a common source of quiet-zone violations.
    `,
    relatedTerms: ['micro-qr', 'model-1-vs-model-2', 'version', 'module', 'print-size'],
    relatedTools: ['/barcode-generator', '/qr-size-calculator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'An R7×43 and an R17×139 rMQR symbol beside the largest square QR code that fits the same strip height, showing the rectangular symbol’s far greater data area.',
    faqs: [
      {
        question: 'What does rMQR stand for?',
        answer:
          'Rectangular Micro QR. It is a QR code variant with a rectangular rather than square symbol, designed for narrow spaces like receipt headers, label margins, and component reels.',
      },
      {
        question: 'What sizes does rMQR come in?',
        answer:
          'Symbols range from R7×43 (7 modules tall, 43 wide) up to R17×139, with intermediate sizes between. Width always exceeds height — that is the point of the format.',
      },
      {
        question: 'Can phones scan rMQR codes?',
        answer:
          'Generally no — consumer camera apps do not yet implement rMQR decoding. It is intended for industrial and enterprise readers (machine vision, warehouse scanners, dedicated apps) where the reading software is known.',
      },
      {
        question: 'When should I choose rMQR over a regular QR code?',
        answer:
          'When the available space is a narrow strip and a square code would have to shrink below a usable payload or module size. If a square code fits comfortably, prefer it for maximum reader compatibility.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'mecard',
    term: 'MeCard Format',
    category: 'standards',
    shortDefinition:
      'A compact contact-exchange format created by NTT DoCoMo (MECARD:N:name;TEL:...;;) that encodes business-card data in fewer characters than vCard, popular for simple contact QR codes.',
    fullExplanation: `
MeCard is a lightweight contact data format developed by NTT DoCoMo for encoding business-card information in QR codes and NFC tags. Where vCard is a full IETF standard with dozens of properties and multiple versions, MeCard is deliberately minimal: a single-line, semicolon-delimited structure that captures the fields people actually put on contact QR codes — name, phone numbers, email, address, URL, and a short note — in as few characters as possible.

**Format anatomy**

A MeCard payload is one logical line beginning with the literal MECARD: and ending with a double semicolon. Fields are tagged with short uppercase identifiers:

MECARD:N:Doe,John;TEL:+12025551234;TEL:+12025555678;EMAIL:john@example.com;URL:https://example.com;ADR:;;123 Main St;Springfield;IL;62701;USA;;

The defined fields are N (name, surname-first with a comma), TEL (repeatable for multiple numbers), EMAIL, URL, ADR (with empty components preserved by consecutive semicolons), BDAY, NICKNAME, and NOTE. There is no versioning, no character-set negotiation, and no photo support — the format trades vCard's expressiveness for brevity, which directly translates into a smaller, more scannable QR symbol.

**MeCard versus vCard**

The practical difference is payload size. A minimal contact (name, one phone, one email) runs roughly 60–80 characters in MeCard versus 100–140 in vCard 3.0 — enough to drop a QR version or two at the same error correction level. vCard counters with universality: it is the IETF standard, supports organizations, titles, multiple structured addresses, and imports cleanly into every major contacts app and email client. MeCard counters with simplicity: easier to generate by hand, easier to parse, and natively recognized by both iOS and Android camera apps for the core fields.

**Reader support reality**

Both iOS Camera and Android's QR handling recognize MECARD payloads and offer to create a contact, covering name, phone, email, URL, and address for the overwhelmingly common cases. Edge fields (BDAY, NICKNAME, NOTE) have spottier support — some parsers import them, others silently drop them. If your contact card needs organization, job title, or multiple labeled phone numbers (work vs. mobile vs. fax), vCard is the safer choice; parsers treat unrecognized MeCard extensions inconsistently.

**When to choose MeCard**

Choose MeCard for the simplest contact QR codes: a personal card with name, phone, email, and website, where every character saved keeps the symbol sparse. Event badges, stickers, and engraved plates — anywhere the printed code is small — benefit from MeCard's compactness. Choose vCard when the contact is a full business identity with company, title, and structured addresses, or when the codes feed into enterprise systems that expect the standard format. Either way, encode in byte mode with UTF-8 for non-Latin names, and test the scan-to-contact flow on both iOS and Android before printing.
    `,
    relatedTerms: ['vcard', 'encoding-modes', 'static-qr-code', 'version', 'short-link'],
    relatedTools: ['/vcard-qr-code-generator', '/bulk-vcard-qr', '/bulk-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated MeCard payload with each field tag labeled, beside a vCard encoding of the same contact, with character counts and resulting QR versions compared.',
    faqs: [
      {
        question: 'What is the difference between MeCard and vCard?',
        answer:
          'MeCard is a compact, single-line format (MECARD:N:...;;) by NTT DoCoMo covering basic contact fields with minimal overhead. vCard is the fuller IETF standard with organizations, titles, and structured addresses. MeCard produces smaller QR codes; vCard offers broader compatibility.',
      },
      {
        question: 'Do iPhones recognize MeCard QR codes?',
        answer:
          'Yes. iOS Camera natively detects MECARD payloads and offers to create a contact with the name, phone, email, URL, and address fields. Android handles it equally well.',
      },
      {
        question: 'Can MeCard include a company name and job title?',
        answer:
          'Not cleanly — MeCard has no ORG or TITLE fields. Some generators abuse the NOTE field for this, but parsers handle it inconsistently. For business identities with company and title, use vCard instead.',
      },
      {
        question: 'How do I format multiple phone numbers in MeCard?',
        answer:
          'Repeat the TEL field: MECARD:N:Doe,John;TEL:+12025551234;TEL:+12025555678;;. Parsers import each as a separate number, though type labels (work/mobile) are not supported.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'bip-21',
    term: 'BIP-21 (Bitcoin URI Scheme)',
    category: 'payments',
    shortDefinition:
      'The standardized bitcoin: URI format (bitcoin:address?amount=0.5&label=...) that lets QR codes open a wallet with the recipient address and payment amount pre-filled.',
    fullExplanation: `
BIP-21 defines the bitcoin: URI scheme — the standard way to express a Bitcoin payment request as a clickable link or a scannable QR code. A BIP-21 URI looks like this:

bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.0025&label=Example%20Store&message=Order%201234

When a wallet app scans a QR code containing this URI, it opens a payment screen with the recipient address, the amount, and the label already filled in; the user only confirms and signs. Without BIP-21, every wallet would invent its own QR payload format and codes would not be interoperable.

**URI anatomy**

The scheme is bitcoin:, followed directly by the recipient address (no double slash — bitcoin:address, not bitcoin://address). Optional query parameters follow the standard ?key=value&key=value form: amount denominated in BTC as a decimal number (0.0025, not satoshis), label for the recipient name shown in the wallet, and message for the payment reference. Unknown parameters must be ignored by wallets, and a recognized-but-required parameter can be prefixed with req- to signal that wallets unable to process it must refuse the payment rather than silently dropping it.

**Why the address stays human-readable in the code**

A core design decision in BIP-21 is that the QR code contains the actual address, not a redirect or lookup key. The payer's wallet can validate the address checksum (bech32 for bc1q... addresses, base58check for legacy formats) entirely offline before any funds move. This matters for security: a static BIP-21 QR code printed on an invoice or donation placard needs no server, cannot be rerouted by compromising a redirect service, and remains valid indefinitely. The trade-off is address reuse — a static donation address links all incoming payments on the public blockchain, which is why many merchants generate a fresh BIP-21 URI per invoice.

**Amount handling and precision**

The amount parameter is expressed in BTC with up to 8 decimal places. Wallets convert to satoshis internally and must handle the decimal precisely — floating-point rounding bugs here would literally cost money, so implementations parse the amount as a decimal string. If amount is omitted, the wallet opens with the address pre-filled and lets the user enter the amount manually, which is the pattern used for donation codes.

**QR-specific best practices**

BIP-21 URIs are short enough to encode statically at low QR versions: even with label and message, they typically fit in Version 3–4 at Error Correction Level M. Use bech32 (bc1q...) addresses — they are all-lowercase, which packs efficiently in alphanumeric mode, and their checksums catch transcription errors. Always test the scan against at least two independent wallets before printing, and never place a Bitcoin QR code behind a URL shortener: the redirect would hide the address from the payer's verification and add a trusted third party to a trustless payment.
    `,
    relatedTerms: ['eip-681', 'epc-girocode', 'upi-intent', 'static-qr-code', 'safe-browsing'],
    relatedTools: ['/bitcoin-qr-code-generator', '/qr-safety-checker', '/url-qr-code-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated BIP-21 URI with scheme, address, amount, label, and message segments labeled, and arrows showing how a wallet maps each segment onto its payment confirmation screen.',
    faqs: [
      {
        question: 'What does a Bitcoin QR code contain?',
        answer:
          'A BIP-21 URI: bitcoin: followed by the recipient address, with optional amount (in BTC, e.g. amount=0.0025), label, and message parameters. The wallet parses it and pre-fills the payment screen.',
      },
      {
        question: 'Is the amount in a BIP-21 URI in bitcoin or satoshis?',
        answer:
          'Bitcoin, as a decimal number with up to 8 decimal places (e.g. amount=0.0025). Wallets convert to satoshis internally using exact decimal parsing to avoid rounding errors.',
      },
      {
        question: 'Should I reuse one Bitcoin QR code for all customers?',
        answer:
          'Avoid it. Address reuse links all your incoming payments together on the public blockchain, harming privacy. Generate a fresh address (and thus a fresh BIP-21 QR code) per invoice; static codes are best for donations where reuse is accepted.',
      },
      {
        question: 'Why not put the Bitcoin payment behind a short link?',
        answer:
          'Because the payer can no longer verify the destination address before paying — the redirect hides it and becomes a trusted third party that could be compromised to reroute funds. BIP-21 is designed to be encoded directly and statically.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'BIP-21 — URI Scheme for Bitcoin Payments',
        url: 'https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'eip-681',
    term: 'EIP-681 (Ethereum URI Scheme)',
    category: 'payments',
    shortDefinition:
      'The standardized ethereum: URI format for payment requests (ethereum:0xaddress?value=... or ethereum:pay-.../transfer) that lets QR codes open a wallet with address, amount, and token details pre-filled.',
    fullExplanation: `
EIP-681 defines the ethereum: URI scheme — Ethereum's counterpart to BIP-21 — for expressing payment and transaction requests as links and QR codes. It covers two patterns: simple native-currency transfers and contract interactions such as ERC-20 token transfers. A basic request looks like:

ethereum:0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359?value=2.014e18

while a token payment uses the pay- request form that names the token contract, the chain, and the function to call with its parameters. A wallet scanning the QR code parses the URI, resolves the chain and contract, and presents a confirmation screen with the recipient, amount, and token pre-filled.

**The two URL forms**

The simpler form — ethereum: followed by an address with optional query parameters — handles plain ETH transfers: value denominates the amount in wei (the smallest ether unit, 10^-18 ETH), so 2.014e18 wei is 2.014 ETH. Scientific notation is explicitly supported for these large integers. The pay- form — ethereum:pay-<contractAddress>@<chainId>/<functionName>?<parameters> — describes a contract call, typically transfer on an ERC-20 token contract, with parameters like address=<recipient> and uint256=<tokenAmount>. The @chainId segment pins the request to a specific network (1 for Ethereum mainnet), preventing a mainnet payment from being replayed on a testnet or sidechain.

**Why chain ID matters in a QR code**

Including the chain ID is a security feature, not bookkeeping. Ethereum addresses are valid across all EVM-compatible chains, so a bare address is ambiguous: the same 0x... string could receive mainnet ETH, a testnet token, or funds on a completely different rollup. The pay- URL's @chainId removes that ambiguity at the URI level, and wallets must reject the request if they are not on the indicated chain rather than silently substituting the current one.

**QR-specific considerations**

EIP-681 URIs are longer than BIP-21 ones — contract addresses, chain IDs, function names, and parameters add up — but they still encode comfortably as static QR codes at modest versions. Because the payload contains the full transaction semantics, static encoding is the right choice: no redirect server should sit between the payer and the transaction details. The address checksum (EIP-55 mixed-case encoding) lets wallets validate the address offline before signing. Test scans against at least two wallets, verify the chain ID resolves to the intended network, and double-check token decimal handling: uint256 token amounts are in the token's smallest unit, and misplacing decimals is the most common expensive mistake.

**EIP-681 versus plain addresses**

Encoding just a raw 0x address in a QR code works — wallets will open a send screen — but it forfeits everything EIP-681 adds: the amount, the token contract, the chain binding, and any reference label. For invoices, donations with suggested amounts, and token payments, the full URI form is strictly better and costs only a slightly denser symbol.
    `,
    relatedTerms: ['bip-21', 'epc-girocode', 'upi-intent', 'encoding-modes', 'safe-browsing'],
    relatedTools: ['/bitcoin-qr-code-generator', '/url-qr-code-generator', '/qr-safety-checker'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated EIP-681 pay- URL with contract address, chain ID, function name, and parameters labeled, mapped onto a wallet confirmation screen showing token, amount, and network.',
    faqs: [
      {
        question: 'What is the difference between the two EIP-681 URL forms?',
        answer:
          'The plain form (ethereum:0xaddress?value=...) requests a native ETH transfer with the amount in wei. The pay- form (ethereum:pay-<contract>@<chainId>/<function>?...) describes a contract call, typically an ERC-20 token transfer, pinned to a specific chain.',
      },
      {
        question: 'What units is the value parameter in?',
        answer:
          'Wei — the smallest ether unit (10^-18 ETH). Scientific notation is supported, so 2.014 ETH is written value=2.014e18. Token amounts in the pay- form are in the token’s smallest unit, so check the token’s decimals carefully.',
      },
      {
        question: 'Why does the URL include a chain ID?',
        answer:
          'Because the same address exists on every EVM chain. The @chainId segment (e.g. @1 for Ethereum mainnet) binds the request to one network so funds cannot be sent on the wrong chain, and wallets must reject mismatched chains.',
      },
      {
        question: 'Can I just encode a raw Ethereum address in the QR code?',
        answer:
          'You can, and wallets will open a send screen — but you lose the amount, token, chain binding, and labels that EIP-681 provides. For invoices and token payments, always use the full URI form.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'EIP-681 — Transaction Request Format',
        url: 'https://eips.ethereum.org/EIPS/eip-681',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'epc-girocode',
    term: 'EPC GiroCode (European Payment QR)',
    category: 'payments',
    shortDefinition:
      'The European Payments Council QR format for SEPA credit transfers — a line-based BCD payload with beneficiary, IBAN, and amount that banking apps scan to pre-fill a bank transfer.',
    fullExplanation: `
GiroCode is the consumer brand name for the EPC QR code: a standardized payload defined by the European Payments Council that encodes a SEPA credit transfer as a scannable QR code. Print it on an invoice, and the customer's banking app scans it and opens a transfer screen with the beneficiary name, IBAN, amount, and reference already filled in — eliminating the transcription errors that plague manual IBAN entry.

**The BCD payload format**

The payload is a strict line-based structure beginning with the service tag BCD, followed by the version (001), the character encoding indicator (1 for UTF-8), and the function code SCT (SEPA credit transfer). After the header come the business fields in fixed order: beneficiary BIC, beneficiary name (up to 70 characters), beneficiary IBAN, the amount as a currency code plus decimal value (EUR123.45 with a dot separator), an optional 4-character purpose code, a reference (either a structured creditor reference starting with RF or up to 140 characters of unstructured remittance text), and an optional hint line. Each field sits on its own line; empty optional fields are represented by empty lines, and the total payload is capped so the resulting symbol stays practical.

**Why banks trust it**

Banking apps validate the payload structurally before presenting it: the BCD tag and version must match, the IBAN checksum must verify, and the amount format must parse. Because the data is fully self-contained and static, there is no redirect to compromise and no server that can be taken over to reroute payments — the payer's app shows exactly what the code contains, and the IBAN's built-in check digits catch most corruption or tampering. This static, verifiable design is why the format works for printed invoices that circulate for months.

**GiroCode versus EPC QR**

The two names describe the same technical format. "EPC QR code" is the standards body's name (defined in the EPC's QR code guidelines for SEPA credit transfers); "GiroCode" is the brand under which German banks and payment providers market it to consumers and businesses. A code generated to the EPC specification scans correctly in any compliant banking app regardless of which name the generator uses.

**Practical generation guidance**

Generate GiroCodes statically — the payload is final at invoice time and must not depend on any service. Validate the IBAN (including its check digits) before encoding; a single wrong digit produces a valid-looking code that fails at the bank. Keep the beneficiary name within its length limit and prefer the structured RF creditor reference for automated reconciliation, falling back to unstructured remittance text for human-readable references. Test the scan with at least two banking apps, since field-label rendering varies, and print at a size where the modules remain crisp — these codes often appear on invoices printed on office printers, where ink spread is the main enemy.
    `,
    relatedTerms: ['bip-21', 'eip-681', 'upi-intent', 'emvco-tlv', 'encoding-modes'],
    relatedTools: ['/qr-safety-checker', '/url-qr-code-generator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated GiroCode payload with each line (BCD tag, version, BIC, name, IBAN, amount, reference) labeled, mapped onto a banking app transfer screen with matching fields highlighted.',
    faqs: [
      {
        question: 'What is the difference between GiroCode and EPC QR code?',
        answer:
          'Technically nothing — they are the same format. EPC QR code is the European Payments Council’s standards name; GiroCode is the consumer brand German banks use. Codes generated to the EPC specification work in any compliant banking app.',
      },
      {
        question: 'How is the amount formatted in a GiroCode?',
        answer:
          'As a three-letter ISO currency code followed by the decimal amount with a dot separator, e.g. EUR123.45. The amount line is one of the fixed-order lines in the BCD payload.',
      },
      {
        question: 'Do GiroCodes work outside the Eurozone?',
        answer:
          'The format targets SEPA credit transfers, which cover the Eurozone plus several additional European countries. The beneficiary account must be SEPA-reachable; the payer’s bank must support scanning EPC payloads.',
      },
      {
        question: 'Can a GiroCode be tampered with to redirect my payment?',
        answer:
          'The payload is static and self-contained, so there is no server to compromise. The banking app displays the beneficiary name and IBAN before you confirm — always verify these match the invoice, since a reprinted code could physically replace the original.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'upi-intent',
    term: 'UPI Intent (India Payment QR)',
    category: 'payments',
    shortDefinition:
      'The upi://pay deep-link format that lets a QR code open any UPI app (GPay, PhonePe, Paytm, BHIM) with the payee VPA, name, amount, and note pre-filled for instant settlement.',
    fullExplanation: `
UPI intent is the deep-link mechanism behind India's Unified Payments Interface QR codes: a upi://pay URL whose query parameters carry everything a payment needs. A typical intent looks like:

upi://pay?pa=merchant@upi&pn=Example%20Store&am=250.00&cu=INR&tn=Order%201234

When scanned, the phone offers the installed UPI apps; the chosen app opens with the payee, amount, and note pre-filled, and the user authorizes with their UPI PIN. Settlement is effectively instant and works across all participating banks and apps — the interoperability that made UPI the world's highest-volume real-time payment rail.

**Parameter anatomy**

The core parameters are pa (payee address — the Virtual Payment Address like name@bank), pn (payee name shown to the payer), am (amount in rupees), cu (currency, INR), and tn (transaction note or reference). Optional parameters cover merchant codes, sub-merchant details, and callback URLs for transaction status. The VPA is the key abstraction: it decouples the payment identity from the underlying bank account, so merchants can print one QR code without exposing account numbers, and can rotate or revoke VPAs without reprinting if the printed code sits behind a managed mapping.

**Static print versus dynamic intent**

UPI QR codes appear in two deployments. Static printed codes (the stickers on shop counters) usually encode a fixed VPA with no amount — the customer enters the amount at payment time. Dynamic intents generated per transaction include the exact amount and a unique reference, enabling automated reconciliation: the merchant's system matches the callback or statement entry against the order. Dynamic codes are also single-purpose — each encodes one expected payment — which simplifies fraud monitoring.

**Collect requests versus intents**

Do not confuse a upi://pay intent (a push: the payer initiates and authorizes) with a UPI collect request (a pull: the payee requests and the payer approves in-app). QR codes overwhelmingly encode intents, because the scan-to-pay flow is payer-initiated. Collect flows belong inside apps, not on printed codes.

**Security and verification**

The payer's app displays the payee name (pn) resolved against the VPA before the PIN screen — this is the verification moment, and users should be taught to check it, since a sticker-swap attack (pasting an attacker's QR over a merchant's) is the classic UPI QR fraud. From the merchant side, verify settlement through bank statements or the app's transaction history, not merely the customer's "payment successful" screen, which can be faked. For QR generation, always URL-encode parameter values, keep the amount to two decimals, and test the scan across at least two UPI apps before mass printing.
    `,
    relatedTerms: ['bip-21', 'epc-girocode', 'eip-681', 'emvco-tlv', 'deep-link'],
    relatedTools: ['/upi-qr-code-generator', '/regional-payment-qr', '/pakistan-payment-qr'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated upi://pay URL with pa, pn, am, cu, and tn parameters labeled, mapped onto a UPI app payment screen showing the verified payee name before the PIN prompt.',
    faqs: [
      {
        question: 'What do the parameters in a UPI QR code mean?',
        answer:
          'pa is the payee’s Virtual Payment Address (name@bank), pn the display name, am the amount, cu the currency (INR), and tn the transaction note. Together they let any UPI app pre-fill the payment screen from a single scan.',
      },
      {
        question: 'Do I need to include the amount in the QR code?',
        answer:
          'Not for counter stickers — the customer enters the amount. Include it for per-transaction codes (invoices, checkout pages) so the amount is locked and reconciliation is automatic.',
      },
      {
        question: 'How do I protect against QR sticker-swap fraud?',
        answer:
          'Teach payers to verify the payee name shown by their UPI app before entering the PIN, and verify settlement via your own bank statement or app history rather than the customer’s success screen. Tamper-evident placement of printed codes also helps.',
      },
      {
        question: 'What is the difference between a UPI intent and a collect request?',
        answer:
          'An intent (upi://pay) is payer-initiated: the customer scans and pushes the payment. A collect request is payee-initiated: the merchant requests and the customer approves inside their app. QR codes encode intents.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'gs1-digital-link',
    term: 'GS1 Digital Link',
    category: 'standards',
    shortDefinition:
      'The GS1 standard that encodes product identifiers (like the GTIN) as an ordinary web URI — e.g. https://id.gs1.org/01/09520123456788 — so one QR code serves shoppers, scanners, and supply-chain systems.',
    fullExplanation: `
GS1 Digital Link is a standard that turns GS1 identifiers — the GTIN on every retail product, plus batch, serial, and expiry qualifiers — into ordinary web URIs. Instead of a barcode that only carries a bare number meaningful to supply-chain software, a GS1 Digital Link looks like this:

https://id.gs1.org/01/09520123456788/10/ABC123?3103=000195

Any web user, scanner, or app can follow it. The domain's resolver reads the identifier and qualifiers in the path and decides what to return: a consumer scanning with a phone gets the product page; a retail scanner gets structured data; a supply-chain system gets traceability records. One code, many audiences.

**URI anatomy**

The path encodes GS1 Application Identifiers as segments: /01/ is always followed by the 14-digit GTIN, /10/ by the batch or lot, /21/ by the serial number, /17/ by the expiry date, and /3103/ by the net weight. Query parameters carry additional attributes. Because the identifiers travel in a standard URI, the entire web stack — DNS, HTTPS, caching, link shorteners, analytics — works unchanged. The resolver behind the domain is the only GS1-specific component, and GS1 publishes the resolver behavior so anyone can implement one.

**One code for the whole product journey**

The traditional setup needs two symbols: a 1D barcode for the checkout scanner and a QR code for the consumer, each carrying different data. GS1 Digital Link collapses this to a single QR code (or DataMatrix) that point-of-sale scanners read for the GTIN while phones read for the web experience. This is the technical foundation of GS1's industry migration toward 2D barcodes at retail checkout — one symbol serving pricing, traceability, consumer engagement, and regulatory data simultaneously.

**Compression and the QR context**

Full URIs with several qualifiers are long, which pushes QR symbols to higher versions. The standard therefore defines a compression method that packs the AI element string into a compact binary form for constrained carriers, though the URI form remains primary for QR. In practice, most deployments keep the link short — GTIN plus one or two qualifiers on a short brand domain — and let the resolver expand the experience server-side.

**Resolver trust and governance**

Whoever controls the domain controls what every scan resolves to, so domain governance matters: brands typically use their own domains (brand.com/01/...) rather than a shared one, keeping control of the redirect logic, the consumer experience, and the scan data. The identifiers themselves remain globally unique and verifiable regardless of domain, because the GTIN check digit and GS1 company prefix allocation are independent of the web layer.
    `,
    relatedTerms: ['fnc1', 'model-1-vs-model-2', 'deep-link', 'structured-append', 'data-matrix'],
    relatedTools: ['/barcode-generator', '/url-qr-code-generator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Annotated GS1 Digital Link URI with GTIN, batch, and attribute segments labeled, branching into three consumers: a phone showing a product page, a POS scanner reading the GTIN, and a traceability system.',
    faqs: [
      {
        question: 'How is GS1 Digital Link different from a regular QR code with a URL?',
        answer:
          'The URL follows a standard structure encoding GS1 identifiers (GTIN, batch, serial) as path segments, and the domain runs a resolver that serves different responses to different scanners — a phone gets a product page, a POS scanner gets structured GTIN data — from the same code.',
      },
      {
        question: 'What does /01/ mean in a GS1 Digital Link?',
        answer:
          'It is the URI form of GS1 Application Identifier 01, which introduces the 14-digit GTIN (Global Trade Item Number). Other qualifiers like /10/ (batch) and /21/ (serial) follow the same pattern.',
      },
      {
        question: 'Can one QR code really replace both the barcode and the consumer QR?',
        answer:
          'Yes — that is the design goal. A 2D symbol carrying a GS1 Digital Link gives POS scanners the GTIN they need while giving phones a web experience, which is why the retail industry is migrating toward single 2D symbols at checkout.',
      },
      {
        question: 'Who controls what the link resolves to?',
        answer:
          'Whoever controls the domain. Brands normally use their own domains so they keep control of the consumer experience, redirects, and scan data, while the GTIN itself stays globally unique and verifiable.',
      },
    ],
    requiresSources: true,
    sources: [
      { label: 'GS1 Digital Link Standard', url: 'https://www.gs1.org/standards/gs1-digital-link' },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'model-1-vs-model-2',
    term: 'QR Code Model 1 vs Model 2',
    category: 'standards',
    shortDefinition:
      'The two generations of the QR symbology: the original Model 1 (versions 1–14, never ISO-standardized) and Model 2 (versions 1–40 with alignment patterns), which is the QR code everyone uses today.',
    fullExplanation: `
QR codes exist in two models, and virtually every QR code you have ever scanned is Model 2. Model 1 was Denso Wave's original 1994 design; Model 2 is the enhanced 1997 revision that became the ISO standard. The distinction matters today mainly for compatibility archaeology — old readers, legacy specifications, and the occasional exam question — but understanding what changed explains several features of the modern symbol.

**What Model 1 looked like**

Model 1 defined versions 1 through 14, topping out at a 73×73 module symbol. It had the three finder patterns and timing patterns familiar from Model 2, but no alignment patterns — the grid had no local distortion correction, which limited reliable reading to flat surfaces photographed fairly straight-on. Its format information layout and version encoding also differed, and its maximum data capacity was a fraction of Model 2's. Denso Wave published Model 1 as a company specification; it was never submitted to ISO.

**What Model 2 added**

Model 2 extended the version range to 40 (177×177 modules), introduced the 5×5 alignment patterns that make curved-surface and angled reading practical, reworked the format and version information for better error protection, and refined the masking and error-correction partitioning. Critically, Model 2 was standardized as ISO/IEC 18004 (first edition 2000), which is what turned QR from a Japanese automotive-industry tool into a global symbology with interoperable readers. Every "QR code" generated by modern software, printed on packaging worldwide, and decoded by phone cameras is Model 2.

**Telling them apart**

In the wild, Model 1 symbols are essentially extinct — you will encounter them only in legacy industrial systems installed before the 2000s. If you do find one, the giveaways are the absence of alignment patterns on a symbol larger than Version 1 and a subtly different finder-pattern separator geometry. Modern decoders are generally Model 2-only; many will fail on Model 1 symbols, which is one more reason legacy systems get upgraded rather than maintained.

**Why the history matters for practitioners**

Three practical lessons survive from the Model 1 era. First, the version-14 ceiling is why some very old documentation mentions 73×73 as the maximum QR size — if you inherit such a document, update it. Second, alignment patterns exist because Model 1's real-world failure on anything but flat, straight-on surfaces taught the industry that local distortion correction is non-negotiable; this is the same reason you should never cover alignment patterns with logos today. Third, the Model 2 format-information design (with its own error correction) is why modern codes survive damage to the metadata areas that would have killed a Model 1 symbol. When someone asks whether "QR codes" support a feature, the answer is almost always about Model 2 — and Model 2 is the only model worth generating.
    `,
    relatedTerms: ['micro-qr', 'rmqr', 'version', 'structured-append', 'encoding-modes'],
    relatedTools: ['/qr-size-calculator', '/error-correction-simulator', '/barcode-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Side-by-side Model 1 (version 14, no alignment patterns) and Model 2 (version 14, alignment grid present) symbols with the structural differences annotated.',
    faqs: [
      {
        question: 'Which QR code model do phones scan?',
        answer:
          'Model 2 — exclusively, in practice. Every modern generator produces Model 2, and phone camera apps implement Model 2 decoding. Model 1 survives only in pre-2000s legacy industrial installations.',
      },
      {
        question: 'What was the biggest change from Model 1 to Model 2?',
        answer:
          'The addition of alignment patterns for local distortion correction, plus the version range extension from 14 to 40. Model 2 also reworked format/version information and was standardized as ISO/IEC 18004.',
      },
      {
        question: 'How can I tell a Model 1 QR code from Model 2?',
        answer:
          'Look for alignment patterns: a symbol larger than Version 1 with no 5×5 alignment markers is likely Model 1. In practice you will almost never encounter one outside legacy equipment.',
      },
      {
        question: 'Is Model 1 still valid for new deployments?',
        answer:
          'No. Model 1 was never ISO-standardized, has a fraction of Model 2’s capacity, lacks distortion correction, and is unreadable by most modern decoders. Always generate Model 2.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
      {
        label: 'Denso Wave — QR Code technology overview',
        url: 'https://www.denso-wave.com/en/technology/vol1.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'fnc1',
    term: 'FNC1 (Function 1 Character)',
    category: 'standards',
    shortDefinition:
      'A special mode indicator that turns a QR code into a GS1-compliant symbol: in first position it signals GS1 Application Identifier data, in second position it marks an industry-specific application.',
    fullExplanation: `
FNC1 (Function 1 Character) is a mode indicator that changes what the data in a QR code means. A normal QR symbol carries free-form data; a symbol with FNC1 in the first position carries structured GS1 Application Identifier data — the same data language used in GS1-128 barcodes and GS1 DataMatrix across global supply chains. This single indicator is what makes "GS1 QR codes" a distinct, standards-tracked thing rather than just QR codes that happen to contain numbers.

**First position: GS1 mode**

When the encoder places the FNC1 indicator (mode 0101) in the first data position, the entire symbol is interpreted as a concatenation of GS1 Application Identifiers: (01) for GTIN, (10) for batch, (17) for expiry, (21) for serial, and hundreds more. Because AI data elements have variable lengths, the FNC1 character itself doubles as the field separator — encoded as a special non-data character that tells the parser where one AI element ends and the next begins. A scanner reading a first-position-FNC1 symbol knows to parse the payload as AI data and can validate it against GS1 rules (check digits, fixed lengths, valid AI combinations).

**Second position: application identification**

FNC1 in the second position (mode 1001) works differently: it is immediately followed by a single-byte application indicator that identifies which industry specification governs the data that follows. This mechanism lets industry groups define their own structured payloads inside QR codes while remaining distinguishable from both plain data and GS1 data. It sees far less use than first-position FNC1 but exists for the same reason — a machine-readable declaration of "how to parse what follows."

**FNC1 versus plain data: why it matters**

Two QR codes can contain the identical digit string yet mean different things depending on FNC1. The digits 09520123456788 in a plain symbol are just fourteen digits; in a first-position-FNC1 symbol they parse as AI (01) — a GTIN — and supply-chain software treats them accordingly, validating the check digit and looking up the product. Omitting FNC1 when the downstream system expects GS1 data causes misparses; adding it when the reader expects plain data can confuse consumer apps. Match the indicator to the ecosystem.

**Relationship to GS1 Digital Link**

FNC1-based GS1 QR and GS1 Digital Link solve overlapping problems differently. FNC1 packs AI element strings into the symbol's binary data area — compact, machine-first, unreadable as a URL. Digital Link expresses the same identifiers as a web URI — longer, but clickable, resolvable, and consumer-friendly. New consumer-facing deployments generally prefer Digital Link; FNC1 remains dominant in closed-loop supply chains, healthcare unit-dose marking, and anywhere the existing GS1 scanning infrastructure expects AI syntax.

**Practical encoding notes**

Generating FNC1 symbols requires a generator with explicit GS1 mode — it must place the indicator, format the AI string with correct separators, and compute any required check digits. Verify the output with a GS1-syntax-aware verifier, not just a phone camera: a phone may decode the raw characters without confirming the AI structure is valid. And remember the quiet zone and print-quality rules apply with full force — a GS1 symbol that fails verification on a production line stops the line.
    `,
    relatedTerms: [
      'gs1-digital-link',
      'encoding-modes',
      'eci-mode',
      'structured-append',
      'data-matrix',
    ],
    relatedTools: ['/barcode-generator', '/printed-qr-tester', '/url-qr-code-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Bit-stream diagram showing the FNC1 first-position indicator followed by AI element strings with FNC1 separators, contrasted with the same digits encoded as plain data.',
    faqs: [
      {
        question: 'What does FNC1 do in a QR code?',
        answer:
          'In first position, it declares the payload as GS1 Application Identifier data (GTIN, batch, expiry…) with FNC1 as the field separator. In second position, it identifies an industry-specific application. Without it, the same digits are just plain data.',
      },
      {
        question: 'How is a GS1 QR code different from a normal QR code?',
        answer:
          'Structurally it is the same symbol; the difference is the FNC1 first-position indicator, which tells scanners to parse the payload as GS1 AI data with validation rules, instead of treating it as free-form text.',
      },
      {
        question: 'Should I use FNC1 or GS1 Digital Link for product packaging?',
        answer:
          'Use GS1 Digital Link for consumer-facing packaging (it is a clickable URL carrying the same identifiers). Use FNC1 GS1 QR for closed supply-chain and healthcare marking where existing scanners expect AI syntax.',
      },
      {
        question: 'Can phone cameras read FNC1 QR codes?',
        answer:
          'They decode the characters but generally do not parse the AI structure — you get the raw digit string, not labeled fields. Proper validation needs GS1-aware software or a verifier.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'eci-mode',
    term: 'ECI Mode (Extended Channel Interpretation)',
    category: 'standards',
    shortDefinition:
      'A QR mode indicator (0111) followed by a designator number that tells the scanner which character encoding the bytes use — most commonly 000026 for UTF-8.',
    fullExplanation: `
QR code byte mode stores raw 8-bit values, but bytes are meaningless without a character encoding: the same byte is 'é' in Latin-1, part of a multi-byte sequence in UTF-8, and something else entirely in Shift JIS. ECI (Extended Channel Interpretation) mode is the mechanism that resolves this ambiguity. The encoder inserts the ECI mode indicator (0111) followed by a variable-length designator number, and every byte after it is interpreted in the named encoding until another ECI designator or the end of the symbol.

**The designator numbers that matter**

ECI designators are registered values. The ones you will actually encounter: 3 for ISO-8859-1 (Latin-1, the default interpretation when no ECI is present), 26 for UTF-8 (the modern universal choice), and 20 for Shift JIS. The designator uses a variable-length encoding of its own — small values take one byte, larger values take more — so the common cases cost almost nothing. A QR code carrying Urdu, Arabic, Chinese, or emoji text is, under the hood, byte mode plus ECI 000026 plus UTF-8 bytes.

**Why the default is not UTF-8**

The specification predates UTF-8's total victory: byte mode's default interpretation is ISO-8859-1. In practice, most modern phone decoders assume UTF-8 for byte-mode data even without an ECI header — which is why unmarked UTF-8 QR codes usually "just work." But "usually" is doing heavy lifting there. Enterprise scanners, industrial readers, and strict decoders follow the specification: without ECI 26, bytes above 127 are Latin-1, and your Urdu or Chinese text arrives as mojibake. Explicit ECI is the difference between working by accident and working by contract.

**Encoder and decoder responsibilities**

A correct encoder adds the ECI designator automatically when you select UTF-8 output — you should never hand-craft these bits. The designator applies from its position forward, so mixed-encoding symbols are possible (Latin-1 segment, then an ECI switch to UTF-8), though rarely needed. On the decode side, applications must honor the designator: a surprising number of hand-rolled QR parsers ignore ECI and hard-code UTF-8, which works until someone scans a legitimate Latin-1 or Shift JIS symbol. If you write decoder-side code, handle ECI properly; if you buy scanning software, verify it does.

**Testing multilingual codes**

Generate the code, scan it with at least two independent apps (one iOS, one Android), and check every non-ASCII character individually — mojibake often corrupts only some characters, and a quick glance can miss it. Pay special attention to combining characters and right-to-left scripts, where rendering issues can masquerade as encoding issues. For vCard and MeCard payloads with non-Latin names, the same ECI 26 mechanism applies inside the contact format.
    `,
    relatedTerms: ['encoding-modes', 'fnc1', 'mecard', 'vcard', 'structured-append'],
    relatedTools: ['/url-qr-code-generator', '/vcard-qr-code-generator', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'Bit-stream diagram: ECI mode indicator 0111, designator 000026, then UTF-8 bytes of a non-Latin word, with a comparison showing the same bytes misrendered as Latin-1 without the ECI header.',
    faqs: [
      {
        question: 'What ECI designator means UTF-8?',
        answer:
          '000026. When a QR encoder outputs UTF-8 text, it inserts mode indicator 0111 followed by designator 26 so compliant decoders interpret the following bytes as UTF-8 rather than the default Latin-1.',
      },
      {
        question: 'Do I need ECI if my text is English only?',
        answer:
          'No. Pure ASCII text is identical in virtually all encodings, so no designator is needed. ECI matters the moment any byte above 127 appears — accented letters, non-Latin scripts, or emoji.',
      },
      {
        question: 'Why does my Arabic/Chinese QR text show as garbled characters?',
        answer:
          'The bytes are likely correct UTF-8 but the decoder is interpreting them as Latin-1 because no ECI 26 designator is present. Regenerate the code with explicit UTF-8/ECI output and the text will decode correctly.',
      },
      {
        question: 'Can one QR code mix two character encodings?',
        answer:
          'Yes. An ECI designator applies from its position forward, so a symbol can carry a Latin-1 segment, then an ECI switch, then a UTF-8 segment. This is legal but rarely necessary — UTF-8 alone covers nearly everything.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'scan-analytics',
    term: 'Scan Analytics',
    category: 'scanning',
    shortDefinition:
      'The measurement of QR code scans over time — counts, devices, locations, and referrers — collected when scans pass through a dynamic QR redirect service.',
    fullExplanation: `
Scan analytics is the practice of measuring what happens after a QR code is printed: how many times it is scanned, when, on what devices, from where, and what the scanners do next. It turns a printed code from a blind leap into a measurable channel — the offline equivalent of web analytics — and it is the primary business justification for dynamic QR codes.

**What gets measured**

A redirect-based analytics pipeline captures, at minimum: total and unique scans, scans over time (hourly, daily, campaign lifetime), device breakdown (iOS vs Android, phone vs tablet), coarse geography (country, city — derived from IP), and the scan context (which placed code was scanned, if each placement uses a distinct URL). Downstream, UTM parameters connect the scan to web analytics, revealing bounce rate, conversion, and revenue per placement. The richest setups join scan events to CRM or POS data, closing the loop from a poster on a wall to a purchase in a store.

**How the data is collected**

Collection requires the scan to touch a server you control — which is why analytics is inseparable from dynamic QR codes. The redirect service logs each resolution: timestamp, user agent, IP-derived location, and the link identity. Static codes cannot produce analytics by themselves; the only signal is server-side web traffic if the code encodes a URL, and that traffic is indistinguishable from other sources without UTM tagging. Third-party analytics SDKs in custom scanning apps can instrument even static codes, but only for users of that app.

**Unique scans versus total scans**

The most misread metric in scan analytics is the raw scan count. A single curious user who scans, shows a friend, and scans again generates three events. Unique-scan estimation typically keys on a device or browser fingerprint plus a time window, but fingerprinting on mobile web is deliberately limited by the platforms, so "unique" is always an estimate. Report both numbers, and treat repeat-scan rate as a signal in itself — high repeats on an instruction code suggest users keep coming back to it, which may be good (a manual) or bad (confusing packaging).

**Privacy and consent**

Scan analytics collects personal-data-adjacent signals — IP addresses, device characteristics, location inferences — and the rules governing them vary by jurisdiction. The conservative posture: collect the minimum needed (aggregates over raw logs where possible), set short retention on raw IP data, disclose the analytics in your privacy policy, and check local requirements before enabling precise location or cross-session identity. Apple's and Google's platform constraints already limit what is collectible; design your metrics around aggregates rather than individuals.

**Using analytics to improve placements**

Analytics earns its keep when it changes decisions. Compare scan-through rates across placements (packaging vs. receipt vs. poster) to reallocate print spend; watch the time-of-day curve to schedule staff or promotions; correlate device mix with landing-page performance to catch mobile UX problems; and A/B test destinations behind identical-looking codes to optimize conversion. A code with near-zero scans is also data — it tells you the placement is invisible, the call-to-action is weak, or the audience has no reason to scan.
    `,
    relatedTerms: [
      'dynamic-qr-code',
      'short-link',
      'utm-parameters',
      'scan-distance',
      'static-qr-code',
    ],
    relatedTools: ['/utm-builder', '/url-qr-code-generator', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'Analytics dashboard mockup for a QR campaign: scan volume over time, device split, top locations, and per-placement comparison bars, with arrows from each printed code to its tracked short URL.',
    faqs: [
      {
        question: 'Can I see who scanned my QR code?',
        answer:
          'No — scan analytics reports aggregates (counts, device types, cities), not identities. Scans are anonymous web requests; identifying individuals would require them to log in after scanning, which most campaigns do not do.',
      },
      {
        question: 'Why do I need dynamic QR codes for analytics?',
        answer:
          'Because analytics requires the scan to pass through your server, and only dynamic codes route through a redirect service you control. Static codes decode entirely on-device, leaving no trace you can measure.',
      },
      {
        question: 'What is the difference between scans and unique scans?',
        answer:
          'Scans count every redirect event, including repeats by the same person. Unique scans estimate distinct devices using fingerprints and time windows — always an approximation on mobile, since platforms limit fingerprinting.',
      },
      {
        question: 'How long should I keep scan log data?',
        answer:
          'As short as your analysis needs allow. Aggregate early (daily counts, device shares) and expire raw logs with IP addresses quickly. State the retention in your privacy policy and check local data-protection rules.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'scan-distance',
    term: 'Scan Distance',
    category: 'scanning',
    shortDefinition:
      'The range of distances from which a QR code can be reliably decoded — governed by a rule of thumb that maximum distance is roughly ten times the symbol’s width.',
    fullExplanation: `
Scan distance is the practical operating range of a printed QR code: too close and the camera cannot focus or fit the symbol in frame; too far and the modules shrink below what the sensor can resolve. Getting this range right is a placement decision — a code on a business card is scanned from centimeters away, a code on a billboard from meters — and it is determined almost entirely by the symbol's physical size.

**The 10-to-1 rule of thumb**

The industry's working rule, originating from Denso Wave's guidance, is that the maximum reliable scan distance is approximately ten times the symbol's width (including the quiet zone). A 3 cm code scans from about 30 cm; a 30 cm code from about 3 m; a 1 m code from about 10 m. This is a rule of thumb, not a law of physics — modern phone cameras with high-resolution sensors and good lighting often exceed it, while dirty lenses, glare, and low light shrink it. But as a planning tool it is remarkably useful: it converts any placement ("viewed from across a 4-meter aisle") directly into a minimum print size ("at least 40 cm wide").

**What actually limits distance**

Three factors set the ceiling. First, module resolution: at long range each module covers fewer sensor pixels, and once modules approach 2–3 pixels wide the decoder cannot binarize them reliably. Second, focus: phone cameras have minimum focus distances (typically 8–15 cm), so tiny codes cannot be scanned by jamming the phone against them — the common failure mode for very small codes. Third, the environment: glare on glossy prints, low light forcing noisy high-ISO capture, and motion blur from an unsteady hand all effectively shorten the range. The 10:1 rule assumes decent light and a steady hand; budget margin for real conditions.

**Designing for the placement**

Work backwards from the viewing distance. Trade-show badge (30 cm viewing): a 3 cm code is the floor — go 4–5 cm for comfort. Retail shelf talker (1 m): 10 cm minimum. Window poster viewed from the sidewalk (3 m): 30 cm. Billboard (20 m+): 2 m or larger, which usually means rethinking whether a QR code belongs there at all. Also consider the approach path: a code scanned while walking past needs to be larger than one scanned while standing still, because motion blur and short dwell time penalize small symbols.

**Minimum sizes and the floor**

Below the 10:1 ceiling there is also a floor: the smallest reliably scannable printed code is generally around 2×2 cm (about 0.8 inches square) for a low-version symbol at standard module widths, scanned from 15–25 cm. Below that, focus limits and module resolution make scanning a lottery even in perfect light. If your layout demands a smaller code, the only lever is reducing the payload (shorter URL, lower version) to widen the modules — never shrink the modules themselves past the print-size minimums.

**Testing at distance**

Always test at the real distance, with real phones, in real light. Generate the code, print it at final size on the final substrate, walk to the expected viewing distance, and scan with two or three different phone models — including at least one mid-range device, since flagship cameras flatter small codes. If it does not scan first-try at distance, enlarge the code or shorten the payload; do not ship hoping users will walk closer.
    `,
    relatedTerms: ['print-size', 'contrast-ratio', 'module', 'quiet-zone', 'scan-analytics'],
    relatedTools: ['/qr-size-calculator', '/printed-qr-tester', '/qr-placement-guide'],
    hasDiagramDescription: true,
    diagramDescription:
      'Diagram showing the 10:1 rule: a 3 cm code with a 30 cm scan cone, a 30 cm poster with a 3 m cone, and callouts for focus minimum distance and module resolution limits.',
    faqs: [
      {
        question: 'How far away can a QR code be scanned?',
        answer:
          'As a rule of thumb, about ten times the symbol’s width: a 3 cm code from ~30 cm, a 30 cm poster from ~3 m. Better cameras and lighting extend this; glare, low light, and motion shrink it.',
      },
      {
        question: 'Why won’t my tiny QR code scan even up close?',
        answer:
          'Phone cameras have a minimum focus distance (usually 8–15 cm). Below that the image is blurry. Tiny codes also push modules near the sensor’s resolution limit. The practical floor for printed codes is about 2×2 cm.',
      },
      {
        question: 'How big should a QR code on a billboard be?',
        answer:
          'Apply the 10:1 rule in reverse: for a 20 m viewing distance you need roughly a 2 m symbol. At that scale, reconsider whether a QR code is the right tool — an SMS short code or memorable URL often works better.',
      },
      {
        question: 'Does walking past a code require a bigger size?',
        answer:
          'Yes. Motion blur and short dwell time penalize small symbols, so codes scanned on the move (aisles, transit ads) should be upsized beyond the 10:1 minimum for the viewing distance.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'svg-vs-png',
    term: 'SVG vs PNG for QR Codes',
    category: 'printing',
    shortDefinition:
      'The two export formats that matter for QR codes: SVG (vector, infinitely scalable, ideal for print) versus PNG (raster, fixed pixels, ideal for screens) — choose by destination.',
    fullExplanation: `
Every QR generator offers multiple download formats, but the decision that matters is vector versus raster: SVG against PNG. They encode the same symbol in fundamentally different ways, and choosing wrong is a leading cause of blurry, unscannable printed codes.

**SVG: the print format**

SVG (Scalable Vector Graphics) describes the QR code as geometry — rectangles positioned on a grid — rather than as pixels. It has no resolution: the same file renders perfectly at 2 cm on a business card and at 2 m on a banner, because the printer or RIP rasterizes the vectors at the device's native resolution. SVG files for QR codes are tiny (kilobytes), remain razor-sharp at any size, and can be edited in vector tools to adjust colors or add quiet-zone padding. For anything that will be printed — packaging, signage, merchandise, stationery — SVG (or PDF, which embeds the same vector data) is the correct choice, full stop.

**PNG: the screen format**

PNG is a raster format: a fixed grid of pixels. A 1000×1000 px PNG looks crisp displayed at 1000 px or smaller, but scaling it up forces interpolation — the sharp module edges that decoders depend on turn into gradients, and scan reliability collapses. PNG is the right choice for screens: websites, apps, presentations, social posts, and digital signage, where the display resolution is known and fixed. Export at 2–4× the display size for retina sharpness, and keep the background opaque (transparent PNGs over busy backgrounds can destroy contrast).

**The DPI trap**

The classic failure is taking a small PNG — say 300×300 px — and placing it in a print layout at 10 cm wide. At that size the effective resolution is about 76 DPI, far below the 300 DPI print standard, and each module becomes a blurry blob. The fix is not "a bigger PNG" (though a 3000 px PNG at 300 DPI works for a 25 cm print); the fix is using the SVG, which cannot have this problem by construction. If your printer or designer asks for "high-res," send the vector file.

**PDF and EPS: vectors in print clothing**

Print workflows often want PDF rather than SVG. A vector PDF containing the QR code is equivalent to SVG for quality purposes and slots directly into professional print pipelines (InDesign, Illustrator, packaging prepress). EPS serves the same role in older workflows. What matters is that the QR data remains vector through the entire chain to the RIP — one rasterization step at an intermediate resolution reintroduces the DPI trap.

**Practical export checklist**

For print: download SVG or vector PDF, verify the quiet zone is included in the artwork bounds, set dark modules to 100% K (black) for single-color jobs, and never let layout software resample the file. For screen: download PNG at 2–4× display size, keep transparency off unless the background is guaranteed light and plain, and test the actual displayed size — a code that looks fine at full-screen may be unscannable as a thumbnail.
    `,
    relatedTerms: ['print-size', 'contrast-ratio', 'dot-style', 'logo-safe-area', 'quiet-zone'],
    relatedTools: ['/qr-size-calculator', '/printed-qr-tester', '/qr-sticker-sheet-printer'],
    hasDiagramDescription: true,
    diagramDescription:
      'Zoomed comparison: an SVG QR module edge staying razor-sharp at 800% zoom versus a low-resolution PNG module edge dissolving into interpolated gray pixels, with DPI annotations.',
    faqs: [
      {
        question: 'Should I download my QR code as SVG or PNG for printing?',
        answer:
          'SVG (or vector PDF). Vectors have no resolution limit, so the code prints razor-sharp at any size. PNG is fixed-pixel; enlarging it for print blurs the module edges that scanners need.',
      },
      {
        question: 'What resolution PNG do I need for a printed QR code?',
        answer:
          'If you must use PNG for print, target 300 DPI at final size — a 10 cm code needs roughly 1200×1200 px. But prefer SVG: it sidesteps the resolution question entirely.',
      },
      {
        question: 'Can I use a transparent-background PNG?',
        answer:
          'Only over a guaranteed light, plain background. Transparency over photos, gradients, or dark colors destroys the contrast the decoder needs. For safety, export with an opaque light background.',
      },
      {
        question: 'Is PDF better than SVG for print shops?',
        answer:
          'They are equivalent if the PDF contains vector QR data — both keep the modules as geometry until the printer rasterizes them. Send whichever your print workflow prefers, and confirm the file was not rasterized in transit.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'dot-style',
    term: 'Dot Style (Rounded Modules)',
    category: 'printing',
    shortDefinition:
      'A decorative rendering that draws QR data modules as rounded dots or circles instead of squares — attractive for branding, but it must preserve module separation and contrast to stay scannable.',
    fullExplanation: `
Dot style is the most popular QR aesthetic treatment: instead of drawing each dark module as a sharp square, the generator renders them as rounded dots, circles, or squircles. The result looks friendlier and more "designed" — closer to a brand pattern than a machine symbol — which is why it dominates QR codes on premium packaging, event branding, and social media profiles. Done correctly it scans perfectly; done carelessly it produces beautiful, unscannable coasters.

**What rounding actually changes optically**

A square module fills its entire grid cell; a circle inscribed in the same cell covers about 79% of the area, leaving the corners empty. The decoder does not care about corners — it samples near each module's center — so moderate rounding is optically harmless. The danger zone is over-rounding: dots so small or so widely spaced that the dark area per module drops toward the binarization threshold, especially after ink spread on absorbent paper shrinks the light gaps between dots. The failure mode is subtle: the code scans fine on screen (where pixels are perfect) and fails in print (where dots bleed).

**Rules for safe dot styling**

Keep the dot diameter at 85–100% of the module pitch — nearly touching, not dainty. Never let rounded styling touch the finder patterns' critical geometry: the 1:1:3:1:1 ratio must survive, so either keep finders square or use the generator's matched "eye" styles designed to preserve detectability. Maintain full dark-on-light contrast; dot style does not excuse gray dots on white. Use Error Correction Level M minimum (H if the design is aggressive), and always verify with a print proof on the final substrate — screen previews lie about dot gain.

**Dots versus other module styles**

Rounded dots are one point on a spectrum of module treatments that also includes diamonds, stars, hearts, and brand-icon modules. The optical principle is identical for all of them: the decoder samples module centers, so any shape that keeps a solid dark region at each dark module's center, keeps light modules clear, and preserves grid geometry will decode. Shapes that fragment the center (outlines, thin strokes) or merge adjacent modules (overlapping blobs) will not. When a generator offers a novelty module shape, ask whether it was tested against real decoders at print size — many were only tested on screen.

**When to skip styling**

Skip dot styling for industrial, logistics, healthcare, and accessibility-critical codes, where decode reliability under poor conditions outweighs aesthetics. Skip it for very small codes (under ~2.5 cm), where rounding eats a large fraction of each module. And skip it whenever the code must survive photocopying or faxing — processes that punish delicate geometry. For marketing codes at generous sizes with proper proofing, dot style is a safe and effective brand treatment.
    `,
    relatedTerms: ['eye-pattern', 'svg-vs-png', 'contrast-ratio', 'module', 'logo-safe-area'],
    relatedTools: ['/url-qr-code-generator', '/qr-safety-checker', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'Three renderings of the same QR data area: square modules, safe rounded dots at 90% pitch, and over-rounded sparse dots — with a magnified inset showing ink spread closing the gaps in the third case.',
    faqs: [
      {
        question: 'Do rounded-dot QR codes scan as well as square ones?',
        answer:
          'Yes, if the dots cover ~85–100% of the module pitch and contrast stays high. The decoder samples module centers, which remain dark. Over-rounded sparse dots fail, especially in print where ink spread closes the gaps.',
      },
      {
        question: 'Can I round the finder pattern squares too?',
        answer:
          'Only with styles specifically designed to preserve the 1:1:3:1:1 detection ratio. Heavily rounded or decorative finders are the top cause of styled-code scan failures — when in doubt, keep the finders square and style only the data modules.',
      },
      {
        question: 'Why does my dot-style code scan on screen but not in print?',
        answer:
          'Ink spread (dot gain) on paper shrinks the light gaps between your dots, merging them into blobs the decoder cannot binarize. Screen pixels are perfect; print is not. Proof on the final substrate and keep dots nearly touching.',
      },
      {
        question: 'What error correction level should I use with styled modules?',
        answer:
          'Level M minimum, Level H for aggressive styling. The extra parity compensates for the optical degradation that decorative modules introduce, particularly under poor lighting.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'eye-pattern',
    term: 'Eye Pattern (Custom Finder Style)',
    category: 'encoding',
    shortDefinition:
      'A styled rendering of the QR finder patterns — the “eyes” of the code — where the outer square and inner dot take custom shapes and colors while preserving the 1:1:3:1:1 detection ratio.',
    fullExplanation: `
"Eye pattern" is designer shorthand for the finder patterns — the three large concentric squares that read as the "eyes" of a QR code — when they are given custom styling: rounded outer frames, circular inner dots, leaf or droplet shapes, brand colors, or inverted treatments. Custom eyes are the highest-impact branding lever on a QR code because the finders dominate its visual identity; they are also the highest-risk, because the finders are the detection mechanism.

**The ratio that must survive**

Every eye style, no matter how decorative, must preserve what the vision algorithm actually detects: the 1:1:3:1:1 dark-light-dark-dark-dark-light-dark module ratio through the pattern's center, in all orientations. Styles that keep three nested regions (dark outer, light middle, dark center) with roughly the specified proportions scan reliably. Styles that break the nesting — a single-color blob, an outline-only frame with no solid regions, a photo or gradient filling the eye — destroy the ratio and with it the decoder's ability to find the code at all. This is a hard optical constraint, not a taste guideline.

**Color rules for eyes**

The classic safe treatment is a brand-colored outer frame with a dark (or brand-colored) center dot, on the code's light background. What fails: low-contrast eyes (light blue on white), eyes whose outer frame matches the background, and multicolor or gradient eyes where the binarization threshold lands unpredictably. Inverted eyes (light eye on a dark code) are a special case — some decoders handle inverse video, most phone cameras do not; treat inverted codes as decorative experiments, never as production assets.

**Eyes versus data modules**

A common mistake is styling the eyes aggressively while leaving data modules square, or vice versa. Decoders do not require stylistic consistency — each region is judged on its own optical merits — but humans do read the code as one design, so matched eye-and-module styles (rounded eyes with rounded dots) look intentional while mixed treatments look broken. More importantly, verify the quiet zone and separators survive eye styling: custom eyes with thick outer frames sometimes bleed into the separator gap or the quiet zone, merging with nearby dark modules and corrupting the ratio from the outside in.

**Testing custom eyes**

Eye styles must be tested more rigorously than data-module styles, because eye failure is total (no detection) rather than gradual (some modules misread, corrected by parity). Test protocol: print at final size on final substrate, scan with three different phone models in good and poor light, scan at 30° and 60° angles, and scan at the maximum intended distance. If any test fails, simplify the eyes first — they are the usual culprit. Keep a square-eye fallback version of every production code so a failing style can be swapped without redesigning the layout.
    `,
    relatedTerms: [
      'finder-pattern',
      'alignment-pattern',
      'dot-style',
      'contrast-ratio',
      'mask-pattern',
    ],
    relatedTools: ['/qr-safety-checker', '/printed-qr-tester', '/url-qr-code-generator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Four eye styles on identical codes — square, rounded, circular, and a broken decorative style — with the 1:1:3:1:1 scanline overlaid to show which preserve the detection ratio.',
    faqs: [
      {
        question: 'Can I customize the three big squares of a QR code?',
        answer:
          'Yes, within limits. Custom “eye” styles must preserve the 1:1:3:1:1 dark-light ratio through the pattern center and keep high contrast. Rounded frames and circular centers are safe; outline-only or photo-filled eyes usually break detection.',
      },
      {
        question: 'Why did my QR code stop scanning after I styled the eyes?',
        answer:
          'The styling almost certainly broke the 1:1:3:1:1 detection ratio or the contrast — the two things the vision algorithm needs. Simplify the eyes back toward solid nested regions and retest.',
      },
      {
        question: 'Can the eyes be a different color than the data modules?',
        answer:
          'Yes, and this is common (e.g. brand-colored eyes with black data modules). Keep the eye colors dark-on-light with strong contrast against the background; avoid gradients inside the eye.',
      },
      {
        question: 'Are inverted (light-on-dark) QR codes safe?',
        answer:
          'No. Most phone cameras expect dark modules on a light background and fail on inverted codes. Treat inversion as an experimental look, never for production codes people must scan.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'ISO/IEC 18004 — QR Code bar code symbology specification',
        url: 'https://www.iso.org/standard/62021.html',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'logo-safe-area',
    term: 'Logo Safe Area',
    category: 'printing',
    shortDefinition:
      'The central region of a QR code where a brand logo may be overlaid — kept clear of finder, timing, and alignment patterns, sized so error correction can reconstruct the covered modules.',
    fullExplanation: `
The logo safe area is the central zone of a QR symbol where a brand mark can be placed without destroying decodability. It exists because of a deliberate engineering trade: covering data modules with a logo is damage, and Reed-Solomon error correction is designed to repair damage — so a logo is simply pre-planned, aesthetically-pleasing damage, provided it stays within what the error correction level can reconstruct.

**Where the safe area is**

The safe area is the center of the symbol, clear of all functional patterns: the three finder patterns and their separators in the corners, the timing tracks along row and column 6, and the alignment-pattern grid distributed across the interior. In practice this means a centered square or circle whose edges stop well short of every functional marker. On small versions (1–4) the functional patterns crowd the center and the safe area is tiny — which is why logo codes should use larger versions with room to breathe. Never let the logo touch a finder pattern, cover a timing track, or overlap an alignment pattern; damage to functional patterns is not repairable by error correction in the same way data damage is.

**How big the logo can be**

The governing rule: the obscured modules must be comfortably within the error correction budget. At Level H (~30% recovery), a centered logo covering roughly a fifth of the symbol's side length in each dimension is the widely used rule of thumb — conservative enough to leave headroom for real-world print defects and partial occlusion on top of the deliberate logo damage. Larger logos demand either accepting fragility or increasing the symbol version so the logo represents a smaller fraction of total modules. There is no exact percentage in the standard; treat any generator that allows a logo to cover half the symbol with suspicion, regardless of its claims.

**Error correction level is non-negotiable**

Logo embedding requires Error Correction Level H, no exceptions. Levels L, M, and Q do not reserve enough parity to reconstruct a logo-sized hole plus the inevitable real-world damage (ink spread, glare, a thumbprint). If your generator does not let you set the error correction level, verify it defaults to H when a logo is added — if it does not, the codes it produces are fragile by construction.

**Logo artwork requirements**

The logo itself should be a simple, high-contrast mark: solid shapes read better than fine detail at small sizes, and the logo should sit on a light backing shape (usually white or the code's background color) so its edges do not merge with surrounding dark modules. Intricate logos with thin strokes or photographic detail become mush at logo-safe-area sizes — use a simplified lockup. Keep the logo as vector artwork in the source file so it stays sharp, and flatten it into the export only at final render.

**Verification**

A logo code must be verified more strictly than a plain code: it has deliberately consumed much of its damage budget before leaving the printer. Test scans at angles, in poor light, at maximum distance, and with the code slightly dirty or scuffed. If it fails any of these, shrink the logo or grow the symbol — never ship a logo code that only scans in perfect conditions.
    `,
    relatedTerms: ['ec-level', 'contrast-ratio', 'eye-pattern', 'dot-style', 'print-size'],
    relatedTools: ['/url-qr-code-generator', '/error-correction-simulator', '/printed-qr-tester'],
    hasDiagramDescription: true,
    diagramDescription:
      'QR code with the central logo safe area shaded green, functional patterns shaded red (no-go zones), and three logo sizes showing safe, marginal, and oversized relative to the error-correction budget.',
    faqs: [
      {
        question: 'How big can the logo in the middle of a QR code be?',
        answer:
          'As a rule of thumb, keep it to about a fifth of the symbol’s side length, centered, using Error Correction Level H. Larger logos consume the damage budget that real-world wear also needs.',
      },
      {
        question: 'Why must logo QR codes use Error Correction Level H?',
        answer:
          'Because the logo deliberately destroys data modules, and only Level H (~30% recovery) reserves enough parity to reconstruct a logo-sized hole plus inevitable print defects. Lower levels make logo codes fragile.',
      },
      {
        question: 'Can the logo overlap the three big corner squares?',
        answer:
          'Never. Finder patterns, timing tracks, and alignment patterns are functional — damage to them is not reconstructable the way data damage is. Keep the logo strictly in the central safe area.',
      },
      {
        question: 'Does the logo artwork itself matter for scanning?',
        answer:
          'Yes. Use a simple, high-contrast mark on a light backing so its edges don’t merge with nearby dark modules. Intricate or photographic logos turn to mush at small sizes — use a simplified lockup.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'contrast-ratio',
    term: 'Contrast Ratio',
    category: 'printing',
    shortDefinition:
      'The luminance difference between a QR code’s dark modules and its light background — the single most important optical property for reliable scanning, requiring dark-on-light with strong separation.',
    fullExplanation: `
Contrast ratio is the luminance difference between the dark modules and the light background of a QR code, and it is the dominant factor in whether a camera can binarize the symbol — decide, for every pixel, whether it is a 1 or a 0. Every other optical property (print sharpness, lighting, lens quality) matters less than this one: a high-contrast code survives poor conditions, and a low-contrast code fails in good ones.

**How the decoder sees contrast**

The decoding pipeline converts the camera image to black-and-white using an adaptive threshold: pixels darker than the local threshold become 1, lighter become 0. This works when the dark and light populations are well separated — the histogram shows two clean humps. As contrast drops, the humps merge: the threshold starts misclassifying dark modules as light and vice versa, first at edges and in shadows, then everywhere. The specification formalizes this as a reflectance requirement between dark and light modules; in plain terms, the darks must be genuinely dark and the lights genuinely light, with daylight between them.

**Dark on light is the rule**

Production QR codes must be dark modules on a light background — black on white being the gold standard. Inverted codes (white on black) fail on most phone cameras, which assume dark-on-light during detection. Colored codes are acceptable only when the luminance contrast remains strong: dark navy on white works; medium gray on light gray does not, even though both are "dark on light" to the human eye. Cameras measure luminance, not hue — a saturated red and a medium green can be nearly identical in luminance and therefore unscannable together.

**Backgrounds are part of the code**

The quiet zone and any area the code sits on must preserve the contrast relationship. A QR code printed on a colored or photographic background inherits that background as its "light" modules — if the background is mid-tone or busy, binarization fails regardless of how black the modules are. The fix is a solid light backing panel (usually white) extending through the full quiet zone. Transparency is the same trap: a transparent PNG over an unpredictable background gambles the contrast on every placement.

**Testing contrast objectively**

Do not trust your eyes — human vision adapts to contrast far better than cameras do. Test with a scan, not a glance: print the code, photograph it with a mid-range phone in the intended lighting, and confirm first-try decoding. For critical applications (pharmaceutical, industrial), barcode verifiers grade symbol contrast against ISO 15415 on an A–F scale; a grade below C warrants redesign. A useful field expedient is the photocopy test: photocopy the code and try scanning the copy — contrast problems that are marginal in the original become obvious in the copy.

**Common contrast killers**

Brand guidelines are the usual suspect: marketing teams specify brand colors for modules ("our QR codes are teal") without checking luminance. Metallic and foil substrates create specular reflections that blow out to white in patches. Laminates and glossy coatings add glare hotspots. Watermarked or textured paper modulates the background luminance within the symbol. Each of these can be managed — matte laminate instead of gloss, a white underprint on foil, testing the actual brand color pair — but only if contrast is treated as an engineering requirement rather than an aesthetic preference.
    `,
    relatedTerms: ['print-size', 'eye-pattern', 'dot-style', 'logo-safe-area', 'scan-distance'],
    relatedTools: ['/printed-qr-tester', '/qr-safety-checker', '/qr-size-calculator'],
    hasDiagramDescription: true,
    diagramDescription:
      'Five QR swatches from black-on-white to gray-on-gray with luminance histograms beneath each, showing the two histogram humps merging as contrast falls and the scan result flipping from pass to fail.',
    faqs: [
      {
        question: 'Can a QR code be white on a black background?',
        answer:
          'Not reliably. Most phone cameras assume dark modules on a light background during detection and fail on inverted codes. Keep production codes dark-on-light; treat inversion as an experimental look only.',
      },
      {
        question: 'Can I use brand colors instead of black?',
        answer:
          'Yes, if the luminance contrast stays strong — dark navy or dark green on white scans fine. Cameras measure luminance, not hue, so test the actual color pair: medium tones on light backgrounds are the usual failure.',
      },
      {
        question: 'Why did my QR code fail on a photo background?',
        answer:
          'The busy background became your “light” modules, destroying the luminance separation the decoder needs. Place the code on a solid light backing panel that extends through the full quiet zone.',
      },
      {
        question: 'How can I objectively check contrast before printing?',
        answer:
          'Scan a print proof with a mid-range phone in the intended lighting — that is the real test. For critical uses, a barcode verifier grades symbol contrast per ISO 15415; anything below a C grade should be redesigned.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'print-size',
    term: 'QR Code Print Size',
    category: 'printing',
    shortDefinition:
      'The physical dimensions of a printed QR code, driven by module width: plan at least 2×2 cm for close scanning, scale by the 10:1 distance rule, and never print modules below ~0.5 mm.',
    fullExplanation: `
Print size is where QR theory meets the physical world: a symbol that is mathematically perfect at any size becomes unscannable below a minimum physical dimension, because cameras, printers, and human hands all have resolution limits. Sizing a printed QR code correctly means balancing three numbers — the module width, the symbol version, and the viewing distance.

**Module width: the atomic unit**

The module width (the physical size of one module square) is the controlling dimension. The specification's absolute minimum is 0.25 mm per module, but that figure assumes ideal industrial imagers; for phone cameras in real conditions, 0.35 mm is the practical floor and 0.5 mm is the recommended minimum for commercial print. Below these widths, ink spread merges adjacent modules, sensors cannot resolve individuals, and the timing tracks — one module wide — dissolve first.

**Computing the total size**

Total symbol width = (modules per side) × (module width), plus the quiet zone of 4 modules on each side. A Version 4 code (33 modules) at 0.5 mm modules: 33 × 0.5 = 16.5 mm for the symbol, plus 8 × 0.5 = 4 mm of quiet zone, for 20.5 mm total. Work this arithmetic before committing to a layout — designers who allocate "about 2 cm" for a Version 10 code discover too late that it needs nearly 4 cm at safe module widths.

**Minimum sizes by use case**

For close-range scanning (business cards, product labels, receipts viewed at 15–30 cm), the practical minimum is about 2×2 cm including quiet zone, for low-version symbols (1–4). Below 2 cm, phone focus limits and module resolution make scanning unreliable. For each step up in viewing distance, scale by the 10:1 rule: 1 m viewing needs ~10 cm, 3 m needs ~30 cm. Packaging viewed at arm's length (50 cm) wants 4–5 cm codes. These are minimums — larger is always safer, and the cost of a larger code is only layout space.

**Version versus size: the density lever**

When a code does not fit its allocated space, the instinct is to shrink the modules — the wrong lever. The right lever is reducing the payload: a shorter URL drops the version, which at fixed module width shrinks the symbol. Halving the URL length can easily save two versions (16 modules per side), while halving the module width from 0.5 mm to 0.25 mm destroys scannability. If the payload cannot be shortened, the layout must grow — there is no optical trick that makes dense tiny codes reliable.

**Substrate and process effects**

The minimum module width assumes good print processes. Absorbent uncoated paper, flexographic printing on corrugated, and thermal printing all exhibit dot gain that effectively requires wider modules — budget 0.6–0.75 mm for rough substrates. Conversely, coated stock, offset litho, and laser marking hold 0.4 mm comfortably. Always proof on the final substrate and process: a code that scans from a laser proof may fail from the production flexo press.

**Resolution of placed artwork**

Vector artwork (SVG/PDF) has no resolution limit and is always preferred. If raster artwork is unavoidable, supply at least 300 DPI at final size — a 5 cm code needs roughly 600×600 px minimum, and more is better. Never upscale a small PNG to fit a large layout; the interpolated module edges will fail binarization.
    `,
    relatedTerms: ['scan-distance', 'contrast-ratio', 'quiet-zone', 'module', 'version'],
    relatedTools: ['/qr-size-calculator', '/printed-qr-tester', '/qr-sticker-sheet-printer'],
    hasDiagramDescription: true,
    diagramDescription:
      'Sizing chart: Version 2, 5, and 10 symbols at 0.5 mm module width with total dimensions labeled, plus a substrate guide showing minimum module widths for coated, uncoated, and thermal printing.',
    formulaLatex: 'W_{total} = (21 + 4(V-1) + 8) \\times W_x',
    faqs: [
      {
        question: 'What is the smallest I can print a QR code?',
        answer:
          'About 2×2 cm including the quiet zone, for low-version symbols (1–4) scanned at close range. Below that, phone focus limits and module resolution make scanning unreliable. Keep modules at least 0.5 mm wide for commercial print.',
      },
      {
        question: 'How do I calculate the printed size of my QR code?',
        answer:
          'Multiply modules per side (21 + 4 × (version − 1)) by your module width, then add 8 module-widths for the quiet zone (4 per side). A Version 4 code at 0.5 mm modules needs 20.5 mm total.',
      },
      {
        question: 'My QR code doesn’t fit the layout — should I just print it smaller?',
        answer:
          'No — shrink the payload, not the modules. A shorter URL drops the QR version and shrinks the symbol at safe module widths. Reducing module width below ~0.5 mm destroys scannability.',
      },
      {
        question: 'Does the paper or printing method affect the minimum size?',
        answer:
          'Yes. Absorbent paper, flexo on corrugated, and thermal printing suffer dot gain — budget 0.6–0.75 mm modules. Coated stock and offset hold 0.4 mm. Always proof on the final substrate and process.',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'utm-parameters',
    term: 'UTM Parameters',
    category: 'scanning',
    shortDefinition:
      'The five standard URL query tags (utm_source, utm_medium, utm_campaign, utm_term, utm_content) that attribute QR-driven web traffic to the exact code, placement, and campaign in analytics.',
    fullExplanation: `
UTM parameters are the five standardized query parameters — utm_source, utm_medium, utm_campaign, utm_term, and utm_content — appended to a URL to tell web analytics exactly where a visit came from. For QR codes, they solve the attribution blind spot: a scan opens a browser like any other visit, and without UTM tags the analytics platform cannot distinguish a poster scan from a Google search. With them, every placement becomes a measurable channel.

**The five parameters**

utm_source identifies the origin: the specific code or placement, e.g. utm_source=packaging-qr or utm_source=receipt-qr. utm_medium describes the channel — qr is the conventional value, distinguishing scans from email, social, or paid traffic. utm_campaign names the initiative: summer-sale-2026. The optional utm_term and utm_content differentiate variants: utm_content=front-vs-back for A/B testing two placements, or utm_term for the keyword in paid contexts. The convention source/medium/campaign is required for clean reporting; term and content are for granularity.

**Why QR codes need them especially**

Most traffic sources self-identify: Google passes a referrer, email tools tag automatically. QR scans arrive as direct traffic — no referrer, no context — because the journey starts in the physical world. Without UTM tags, a successful QR campaign is invisible in analytics, indistinguishable from users typing the URL. Tagging is what converts "the website got more traffic" into "the packaging QR drove 4,200 sessions at 3.1% conversion."

**Encoding UTMs in QR codes**

UTM parameters lengthen the URL, which increases QR density — a full five-parameter tag set can add 80+ characters. The standard solution is to put the tagged URL behind a short link: the QR encodes the short URL (keeping the symbol sparse), and the redirect service appends or forwards the UTM parameters at resolve time. This also keeps the tags editable: change the campaign name without reprinting. When generating tagged URLs, keep values lowercase, use hyphens instead of spaces, and be consistent — Summer_Sale and summer-sale report as two different campaigns.

**Hygiene and governance**

UTM discipline breaks down without conventions. Maintain a shared taxonomy document: allowed utm_source values per placement, the medium value (qr), and campaign naming rules. Audit periodically for typos and duplicates, because analytics cannot merge them retroactively. Never put personally identifiable information in UTM values — they are logged by analytics platforms and often visible in server logs. And remember that UTMs describe the click, not the person: they attribute the session, which is exactly the right granularity for placement analytics.
    `,
    relatedTerms: [
      'scan-analytics',
      'dynamic-qr-code',
      'short-link',
      'deep-link',
      'static-qr-code',
    ],
    relatedTools: ['/utm-builder', '/url-qr-code-generator', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'A tagged URL with each utm_ parameter labeled and mapped to its analytics report dimension, plus a diagram showing the short link in the QR code expanding to the full tagged URL at redirect time.',
    faqs: [
      {
        question: 'What are the five UTM parameters?',
        answer:
          'utm_source (the specific code/placement), utm_medium (the channel, e.g. qr), utm_campaign (the initiative name), plus optional utm_term and utm_content for variant-level detail like A/B placements.',
      },
      {
        question: 'Why do QR codes need UTM parameters?',
        answer:
          'Because scans arrive as direct traffic with no referrer — analytics cannot tell a poster scan from someone typing the URL. UTM tags are the only way to attribute visits and conversions to specific codes and placements.',
      },
      {
        question: 'Won’t UTM parameters make my QR code too dense?',
        answer:
          'They lengthen the URL, yes. Put the tagged URL behind a short link: the QR encodes the short URL (sparse symbol) and the redirect service expands it to the full tagged URL at scan time.',
      },
      {
        question: 'Should UTM values be uppercase or lowercase?',
        answer:
          'Lowercase, consistently. Analytics treats Summer_Sale and summer-sale as different campaigns and cannot merge them retroactively. Keep a shared naming taxonomy for your team.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'Google Analytics — Campaign URL Builder help',
        url: 'https://support.google.com/analytics/answer/1033867',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'safe-browsing',
    term: 'Google Safe Browsing',
    category: 'security',
    shortDefinition:
      'Google’s threat-intelligence service that flags malicious URLs — the backend that lets QR scanners, browsers, and apps warn users before opening a phishing or malware link from a code.',
    fullExplanation: `
Google Safe Browsing is a threat-intelligence service that maintains continuously updated lists of unsafe web resources: phishing pages, malware distribution sites, unwanted software hosts, and deceptive content. When a QR scanner, browser, or app checks a URL against Safe Browsing before opening it, users get a warning interstitial instead of the attack page. For QR codes — where the destination is invisible until scanned — this check is the primary automated defense against malicious codes.

**Why QR codes need URL reputation**

A QR code's payload is opaque to humans: no one can tell by looking at the pattern whether it encodes your restaurant menu or a credential-harvesting clone of your bank. Attackers exploit this with sticker-swap attacks (pasting malicious codes over legitimate ones), phishing codes in emails and flyers, and malicious URLs in public places. Safe Browsing does not make a code "verified safe" — it flags known-bad destinations, which catches the large fraction of attacks that reuse infrastructure.

**How the check works**

Clients use one of two APIs. The Lookup API sends a URL (or its hash prefix) and gets a verdict: safe or matching a threat list. The Update API — used by Chrome, Firefox, and Safari — downloads hashed threat lists locally and checks URLs on-device, preserving privacy by never sending every browsed URL to Google. QR scanner apps with safety features typically use the Lookup API at scan time: decode the payload, extract the URL, check it, and show a green/amber/red verdict before opening the browser.

**Coverage and limits**

Safe Browsing is strongest against known threats and phishing kits that get reported and crawled quickly; it is weaker against zero-hour attacks on fresh domains, which may not yet be listed. It checks URLs, not QR payloads per se — a code encoding a non-URL payload (vCard, WiFi) has nothing to check, and a code behind a URL shortener is only as checkable as the final destination the scanner resolves. Scanner apps that check only the short URL without following the redirect give a false sense of security.

**What this means for legitimate QR publishers**

Keep your domains clean: if your site gets compromised and lands on a threat list, every QR code pointing to it starts triggering warnings — a brand-damaging event that persists until the listing is cleared via Search Console. Use HTTPS everywhere, monitor your domains' Safe Browsing status, and prefer branded short domains with good reputations over abused public shorteners. For high-trust applications (payments, banking, government), consider displaying the destination URL for user confirmation in addition to any automated check — human verification of the domain remains the strongest defense against lookalike phishing.
    `,
    relatedTerms: ['punycode', 'deep-link', 'short-link', 'dynamic-qr-code', 'static-qr-code'],
    relatedTools: ['/qr-safety-checker', '/url-qr-code-generator', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'Scan-time safety flow: QR decoded → URL extracted → Safe Browsing lookup → green safe screen or red warning interstitial, with a note on the zero-hour gap for fresh malicious domains.',
    faqs: [
      {
        question: 'Does Google Safe Browsing scan QR codes?',
        answer:
          'Indirectly. Safe Browsing maintains lists of malicious URLs; QR scanner apps with safety features decode the code, extract the URL, and check it against those lists before opening — warning the user if it matches a threat.',
      },
      {
        question: 'Can Safe Browsing catch every malicious QR code?',
        answer:
          'No. It is strong against known threats but weaker against zero-hour attacks on brand-new domains not yet listed. It also only checks URLs — and scanners should follow short-link redirects to check the final destination, not just the short URL.',
      },
      {
        question: 'My legitimate QR code triggers a Safe Browsing warning — why?',
        answer:
          'Your destination domain or URL is on a threat list, usually because the site was compromised or shares infrastructure (like a public shortener domain) with attackers. Check Search Console’s security report and request a review after cleanup.',
      },
      {
        question: 'Should I rely on Safe Browsing instead of showing the URL?',
        answer:
          'No — use both. Automated checks catch known threats; displaying the destination URL lets users verify the domain themselves, which is the strongest defense against lookalike phishing domains.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'Google Safe Browsing — developer documentation',
        url: 'https://developers.google.com/safe-browsing',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
  {
    slug: 'punycode',
    term: 'Punycode (IDN Encoding)',
    category: 'security',
    shortDefinition:
      'The ASCII-compatible encoding (RFC 3492) that represents non-Latin domain names — the xn-- labels behind internationalized domains — critical for spotting homograph phishing in QR URLs.',
    fullExplanation: `
Punycode is the encoding defined by RFC 3492 that represents Unicode domain names using only ASCII characters, producing the distinctive xn-- labels you see in internationalized URLs. The German domain münchen.de becomes xn--mnchen-3ya.de under the hood; the DNS system, which only understands ASCII, resolves the punycode form while browsers display the Unicode form to users. Every non-Latin domain on the internet — Arabic, Chinese, Cyrillic, Urdu — reaches you via punycode.

**Why QR security cares about punycode**

QR codes hide their destinations, and internationalized domain names hide in plain sight. The homograph attack exploits Unicode lookalikes: a phishing domain like "аpple.com" with a Cyrillic 'а' renders almost identically to "apple.com" with a Latin 'a' in most fonts, but resolves to the attacker's server. In punycode the deception is visible — xn--pple-43d.com is obviously not apple.com — which is why security-conscious QR scanners display the punycode or ASCII form of URLs rather than the pretty Unicode rendering. If your scanner shows you xn-- labels, that is a feature, not a bug.

**How the encoding works**

Punycode compresses a Unicode string into ASCII by separating the basic (ASCII) characters, which pass through unchanged, from the non-basic characters, which are encoded as deltas from insertion positions using a variable-length integer scheme with bias adaptation. The result is prefixed with xn-- (the ACE prefix for IDNA) and is case-insensitive. The algorithm is deterministic and compact for the common case — a domain that is mostly ASCII with a few non-Latin characters encodes nearly as short as the ASCII original — which matters when the URL must fit in a QR payload budget.

**IDNA and the display rules**

Punycode is the codec; IDNA (Internationalized Domain Names in Applications) is the framework governing when and how it is used. Modern browsers apply IDNA2008 with contextual rules and often refuse to display Unicode for mixed-script domains that look like homograph attacks, falling back to punycode display. QR scanner apps should follow the same principle: decode the URL from the code, convert any internationalized domain to its ASCII/punycode form for the confirmation screen, and let the user see what the DNS will actually resolve.

**Guidance for QR publishers**

If your brand uses a non-Latin domain, be aware that security-aware users and scanners will see the xn-- form — consider also maintaining an ASCII domain for QR-encoded links to avoid confusion and homograph suspicion. Never mix scripts within a single domain label in QR destinations; it triggers homograph heuristics in browsers and scanners alike. And when reviewing QR safety reports, read the punycode: the ASCII form is the ground truth of where the code actually goes.
    `,
    relatedTerms: ['safe-browsing', 'deep-link', 'short-link', 'encoding-modes', 'eci-mode'],
    relatedTools: ['/qr-safety-checker', '/url-qr-code-generator', '/qr-scanner'],
    hasDiagramDescription: true,
    diagramDescription:
      'A homograph attack visualized: “аpple.com” (Cyrillic a) versus “apple.com” (Latin a) rendered identically, with their punycode forms xn--pple-43d.com and apple.com shown below revealing the difference.',
    faqs: [
      {
        question: 'What does xn-- at the start of a URL mean?',
        answer:
          'It marks a punycode-encoded internationalized domain name — the ASCII form of a domain containing non-Latin characters (e.g. münchen.de → xn--mnchen-3ya.de). DNS only understands ASCII, so this encoding bridges Unicode domains to the DNS.',
      },
      {
        question: 'How does punycode relate to QR code phishing?',
        answer:
          'Attackers register lookalike domains using non-Latin characters that resemble Latin ones (homograph attacks). In punycode the fake is obvious (xn--pple-43d.com ≠ apple.com), so good QR scanners show the ASCII form on the confirmation screen.',
      },
      {
        question: 'Should I use a non-Latin domain in my QR codes?',
        answer:
          'Cautiously. Security-aware scanners display the xn-- form, which can confuse users and trigger homograph suspicion. For QR destinations, an ASCII domain is usually the safer, more trusted choice.',
      },
      {
        question: 'Is punycode the same as IDNA?',
        answer:
          'No. Punycode (RFC 3492) is the encoding algorithm that converts Unicode to ASCII. IDNA is the broader framework of rules governing when and how internationalized domain names are processed and displayed.',
      },
    ],
    requiresSources: true,
    sources: [
      {
        label: 'RFC 3492 — Punycode: A Bootstring encoding of Unicode',
        url: 'https://www.rfc-editor.org/rfc/rfc3492',
      },
    ],
    status: 'approved',
    author: 'Codexengr, QR Systems Engineer',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
  },
];

export function getGlossaryEntryBySlug(slug: string): GlossaryEntry | undefined {
  return GLOSSARY_ENTRIES.find((e) => e.slug === slug);
}

export function getAllGlossaryEntries(): GlossaryEntry[] {
  return GLOSSARY_ENTRIES;
}

export function getGlossaryEntriesByCategory(category: GlossaryEntry['category']): GlossaryEntry[] {
  return GLOSSARY_ENTRIES.filter((e) => e.category === category);
}

export function getApprovedGlossaryEntries(): GlossaryEntry[] {
  return GLOSSARY_ENTRIES.filter((e) => e.status === 'approved');
}

export const GLOSSARY_CATEGORIES: GlossaryEntry['category'][] = [
  'encoding',
  'error-correction',
  'printing',
  'security',
  'standards',
  'scanning',
  'payments',
  'formats',
];
