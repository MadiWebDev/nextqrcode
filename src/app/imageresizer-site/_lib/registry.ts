/**
 * Tool registry — the single source of truth for every tool on the image
 * site. Routes, navigation, landing content and (in Phase F) the sitemap
 * are all generated from this list. A tool only appears here once it is
 * fully functional: no placeholder entries, ever.
 */

export type ToolCategory =
  | 'resize'
  | 'compress'
  | 'convert'
  | 'crop'
  | 'edit'
  | 'bulk'
  | 'social'
  | 'passport'
  | 'privacy'
  | 'utility';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  resize: 'Resize',
  compress: 'Compress',
  convert: 'Convert',
  crop: 'Crop',
  edit: 'Edit',
  bulk: 'Bulk tools',
  social: 'Social media',
  passport: 'Passport & ID',
  privacy: 'Privacy',
  utility: 'Utilities',
};

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolDef {
  slug: string;
  name: string;
  /** Unique SEO title. */
  title: string;
  /** Unique meta description. */
  description: string;
  h1: string;
  category: ToolCategory;
  /** One-line summary used in cards and listings. */
  summary: string;
  intro: string[];
  howTo: string[];
  faqs: ToolFaq[];
  related: string[];
}

export const TOOLS: ToolDef[] = [
  {
    slug: 'resize-image',
    name: 'Image Resizer',
    title: 'Resize Image Online Free – Change Image Dimensions in Pixels | Free QR Code Tools',
    description:
      'Resize JPG, PNG, WebP, GIF and more to exact pixel dimensions online for free. Lock the aspect ratio, fit or fill, choose quality — processed privately in your browser.',
    h1: 'Resize Image Online',
    category: 'resize',
    summary: 'Change any image to exact pixel dimensions, by width, height or percentage.',
    intro: [
      'This free image resizer changes an image to the exact dimensions you need — a 1200×630 social card, a 300×300 avatar, a 1920-pixel-wide hero image — without installing software or creating an account. Type a width and height, lock the aspect ratio if you want proportions preserved, and pick how the image fits: stretch, fit inside with letterboxing, or fill and crop.',
      'Everything happens in your browser. The file is decoded locally, resized with high-quality resampling, and re-encoded in the format you choose — nothing is uploaded, so even confidential screenshots and unreleased product photos stay on your device.',
    ],
    howTo: [
      'Drop an image onto the uploader (or click to browse, or paste from the clipboard).',
      'Enter the target width and height in pixels — with the lock on, one value updates the other automatically.',
      'Choose a fit mode if both dimensions are set, and an output format and quality.',
      'Press Resize and check the real result dimensions and file size.',
      'Download the resized image.',
    ],
    faqs: [
      {
        q: 'Can I resize without distorting the image?',
        a: 'Yes — keep the aspect-ratio lock on, or use "Fit inside" mode: the whole image scales proportionally and any empty space becomes letterboxing (transparent, or a colour you pick for JPG). "Fill & crop" also preserves proportions by cropping the overflow.',
      },
      {
        q: 'What happens when I enlarge an image?',
        a: 'The resizer will make the canvas bigger, but it cannot invent detail that was never captured — enlarged photos look softer. For best results, start from the largest original you have.',
      },
      {
        q: 'Does resizing preserve an animated GIF?',
        a: 'Yes. When you load an animated GIF and keep GIF output with "Keep animation" on, every frame is resized and the animation is re-encoded with its original timing.',
      },
    ],
    related: ['bulk-image-resizer', 'compress-image', 'crop-image'],
  },
  {
    slug: 'bulk-image-resizer',
    name: 'Bulk Image Resizer',
    title: 'Bulk Image Resizer – Resize Multiple Images at Once, Free | Free QR Code Tools',
    description:
      'Resize dozens of images in one batch with the same dimensions, format and quality. Watch per-file progress, download individually or as one ZIP — all in your browser.',
    h1: 'Bulk Image Resizer',
    category: 'bulk',
    summary: 'Apply the same resize to many images at once and download them all as a ZIP.',
    intro: [
      'Preparing a folder of product photos, a class set of ID pictures or a whole camera dump one file at a time is nobody’s idea of fun. This bulk resizer applies one set of dimensions, one format and one quality level to every image you drop in, processes them in a controlled queue (so your device never runs out of memory), and lets you download each result or everything together as a ZIP.',
      'Files are processed on your device in small parallel batches with live progress per file. A file that fails — a corrupt download, an unsupported variant — is reported with the reason and can be retried or removed without disturbing the rest of the batch.',
    ],
    howTo: [
      'Drop multiple images (or a whole selection from your file manager) onto the uploader.',
      'Set the shared target size — exact pixels, percentage, or a maximum dimension — plus format and quality.',
      'Press Process and watch the queue; pause or cancel at any time.',
      'Download individual results, or "Download all (ZIP)" for the full set.',
    ],
    faqs: [
      {
        q: 'How many images can I process at once?',
        a: 'You can queue as many as you like; the queue processes two at a time so even a low-end phone stays responsive. Very large batches of huge photos will simply take longer — progress is shown per file.',
      },
      {
        q: 'Do all images have to be the same size to start with?',
        a: 'No. Each image is resized from its own original dimensions to the shared target. With aspect lock on, images keep their own proportions and are fitted within the target box.',
      },
      {
        q: 'What if one file is corrupt?',
        a: 'It is marked with the error and skipped; the rest of the batch continues. You can retry it or remove it from the list.',
      },
    ],
    related: ['resize-image', 'compress-image', 'image-converter'],
  },
  {
    slug: 'compress-image',
    name: 'Image Compressor',
    title: 'Compress Image Online Free – Reduce JPG, PNG & WebP File Size | Free QR Code Tools',
    description:
      'Compress images online for free with real quality control. Reduce JPG, PNG and WebP file sizes for websites, email and forms — see before/after sizes instantly.',
    h1: 'Compress Image Online',
    category: 'compress',
    summary: 'Shrink image file sizes with quality, format and dimension controls.',
    intro: [
      'Big photos slow down websites, bounce off email limits and get rejected by upload forms. This compressor re-encodes your image with a quality level you choose, optionally caps its dimensions, and shows you the exact before/after file sizes — so the trade-off between size and quality is yours to make, not a black box’s.',
      'Format choice matters: JPG and WebP squeeze photos hardest, WebP usually wins at the same visual quality, and PNG stays lossless (its size lever is dimensions, and the tool says so plainly). Metadata such as camera EXIF and GPS is stripped by re-encoding, which often saves extra kilobytes on phone photos.',
    ],
    howTo: [
      'Drop the image you want to compress.',
      'Pick an output format and drag the quality slider — lower quality, smaller file.',
      'Optionally cap the maximum dimension to shrink very large photos further.',
      'Press Compress and compare the real sizes, then download.',
    ],
    faqs: [
      {
        q: 'What quality setting should I use?',
        a: 'For web photos, 75–85% is the sweet spot: visually near-identical, typically 60–80% smaller. For images that will be printed or edited further, stay at 90%+ or keep the original.',
      },
      {
        q: 'Why doesn’t PNG compress as much as JPG?',
        a: 'PNG is lossless — every pixel is preserved exactly, so there is no quality dial to turn. Its file size only drops when dimensions drop. If you need a small file more than perfect pixels, JPG or WebP will get you much further.',
      },
      {
        q: 'Need a file under an exact limit, like 100 KB?',
        a: 'Use the Compress to Exact KB tool — it searches quality and dimensions automatically and tells you honestly whether the target was reached.',
      },
    ],
    related: ['compress-image-to-100kb', 'resize-image', 'image-converter'],
  },
  {
    slug: 'compress-image-to-100kb',
    name: 'Compress to Exact KB',
    title: 'Compress Image to 100KB, 50KB, 20KB Online – Exact File Size Tool | Free QR Code Tools',
    description:
      'Compress an image to an exact maximum size — 20KB, 50KB, 100KB, 200KB, 500KB or 1MB. The tool searches quality and dimensions and honestly reports whether the target was met.',
    h1: 'Compress Image to an Exact Size',
    category: 'compress',
    summary: 'Hit a hard file-size limit — 100 KB for a form, 200 KB for a portal — automatically.',
    intro: [
      'Government portals, exam forms, job applications and visa systems love hard limits: "photo must be under 100 KB". Guessing quality sliders until a file fits is miserable, so this tool does the searching for you. Tell it the maximum size and it binary-searches the encoder quality; if quality alone cannot get there, it progressively reduces dimensions too — and reports exactly what it did.',
      'Honesty is built in: the result always shows the real output size and whether your target was achieved. A target that is physically impossible for a noisy image at a sensible size is reported as not achieved, with the smallest result found — never a fake success message.',
    ],
    howTo: [
      'Drop the image that needs to fit a size limit.',
      'Enter the target — use the preset chips (20 KB–1 MB) or type your own.',
      'Choose the output format (JPG or WebP reach small sizes best).',
      'Press Compress to target and read the verdict: achieved, or the smallest possible result with the reason.',
      'Download the file — named with its real size target so you can find it later.',
    ],
    faqs: [
      {
        q: 'Which preset should I choose?',
        a: 'Choose the largest size your form or portal allows — a 200 KB photo looks noticeably better than a 20 KB one. Common limits: 20–50 KB for exam/ID photos, 100–200 KB for job and visa portals, 500 KB–1 MB for general document uploads.',
      },
      {
        q: 'Why did my image get smaller in dimensions too?',
        a: 'Some images (especially noisy or highly detailed photos) cannot reach a very small target at full size even at the lowest quality. The tool then trades dimensions for bytes and tells you the final size it used.',
      },
      {
        q: 'Can it always hit the target?',
        a: 'No tool honestly can. Pure noise-like images have a floor below which they cannot shrink at readable dimensions. When that happens you get the smallest result found and a plain explanation — plus the option to allow a smaller output size.',
      },
    ],
    related: ['compress-image', 'resize-image', 'bulk-image-resizer'],
  },
  {
    slug: 'image-converter',
    name: 'Image Converter',
    title: 'Image Converter Online Free – JPG, PNG, WebP, AVIF, HEIC, TIFF | Free QR Code Tools',
    description:
      'Convert images between JPG, PNG, WebP, AVIF and GIF online for free. Open HEIC, TIFF, BMP and SVG files too. Real conversion in your browser — nothing uploaded.',
    h1: 'Convert Image Format Online',
    category: 'convert',
    summary: 'Turn any picture into JPG, PNG, WebP, AVIF or GIF — and open HEIC, TIFF and SVG files.',
    intro: [
      'Every platform wants a different format: the iPhone shoots HEIC, designers hand over TIFFs, websites run best on WebP, and some stubborn form only accepts JPG. This converter opens JPG, PNG, WebP, AVIF, GIF, BMP, TIFF, HEIC/HEIF, SVG and ICO files and saves them as JPG, PNG, WebP, AVIF or GIF — entirely in your browser.',
      'The limits are stated, not hidden: AVIF saving works in Chrome-based browsers (you will be told if yours cannot, with WebP offered instead); HEIC and TIFF are opened with decoders bundled into the page and are converted out to web formats; converting a transparent image to JPG flattens it onto a background colour you choose, because JPG has no transparency.',
    ],
    howTo: [
      'Drop the image to convert — its real format is detected from the file itself, not its name.',
      'Choose the output format and quality (where the format has one).',
      'If converting to JPG, pick the background colour used behind transparent areas.',
      'Press Convert, verify the new format and size, and download.',
    ],
    faqs: [
      {
        q: 'How do I convert an iPhone HEIC photo to JPG?',
        a: 'Drop the .heic file here and choose JPG. The photo is decoded locally by a decoder bundled with this page (nothing is uploaded) and re-encoded as a standard JPG any system can open.',
      },
      {
        q: 'Why is AVIF greyed out in my browser?',
        a: 'Creating AVIF files currently works in Chrome-based browsers; Firefox and Safari can view AVIF but not encode it on the web platform. WebP is offered instead — it compresses nearly as well and works everywhere.',
      },
      {
        q: 'Will converting PNG to JPG keep transparency?',
        a: 'JPG cannot store transparency, so transparent pixels are flattened onto the background colour you select (white by default). If you need transparency preserved, choose PNG or WebP output.',
      },
    ],
    related: ['compress-image', 'resize-image', 'compress-image-to-100kb'],
  },
  {
    slug: 'crop-image',
    name: 'Crop Image',
    title: 'Crop Image Online Free – Crop JPG, PNG & WebP to Any Size or Ratio | Free QR Code Tools',
    description:
      'Crop images online for free with a drag-to-select editor: freeform or fixed ratios (1:1, 4:3, 16:9), precise pixel coordinates, touch support. No upload, no watermark.',
    h1: 'Crop Image Online',
    category: 'crop',
    summary: 'Cut out exactly the part of the picture you need — by dragging, or by the pixel.',
    intro: [
      'Cropping is the fastest way to fix a photo: remove the bystander at the edge, tighten a product shot, or cut a square avatar out of a wide picture. This cropper gives you a drag-to-select frame with corner and edge handles, fixed aspect ratios (square, 4:3, 3:2, 16:9 and more), a rule-of-thirds grid, and precise numeric coordinates for when "about right" is not right enough.',
      'The preview is the export: the selection you see is mapped to the exact source pixels, so what you frame is what downloads. It works with mouse, keyboard-friendly inputs and touch gestures on phones and tablets.',
    ],
    howTo: [
      'Drop the image you want to crop.',
      'Drag the selection frame, pull its handles, or type exact X/Y/width/height values.',
      'Optionally lock an aspect ratio such as 1:1 for profile pictures.',
      'Choose the output format and press Crop & download.',
    ],
    faqs: [
      {
        q: 'Can I crop to exact pixel coordinates?',
        a: 'Yes — the X, Y, width and height fields accept exact source-pixel values and stay in sync with the drag frame, so you can rough out a crop by hand and fine-tune it numerically.',
      },
      {
        q: 'How do I crop a perfect square for a profile picture?',
        a: 'Choose the 1:1 ratio lock, drag the frame over the subject, and export. The social-media tools also include ready-made profile sizes for each platform.',
      },
      {
        q: 'Does cropping reduce quality?',
        a: 'The cropped region is copied pixel-for-pixel from the decoded original; only re-encoding to a lossy format (JPG/WebP) applies the quality you select. Choose PNG output for a mathematically lossless crop.',
      },
    ],
    related: ['resize-image', 'rotate-image', 'image-converter'],
  },
  {
    slug: 'rotate-image',
    name: 'Rotate Image',
    title: 'Rotate Image Online Free – Turn JPG, PNG & WebP Photos | Free QR Code Tools',
    description:
      'Rotate images online for free: 90°, 180°, 270° or any angle, with the canvas grown to fit. Fix sideways phone photos privately in your browser.',
    h1: 'Rotate Image Online',
    category: 'edit',
    summary: 'Fix sideways photos — quarter turns, half turns, or any angle.',
    intro: [
      'Phone cameras usually store orientation as metadata, and some apps ignore it — leaving your photo sideways or upside down. This rotator bakes the correct orientation into the pixels themselves: quarter turns (90°, 180°, 270°) are pixel-exact, and a free-angle mode straightens slightly tilted shots with the canvas automatically grown so nothing is clipped.',
      'Rotating to JPG flattens the corners created by angled rotations onto a background colour you choose; PNG and WebP keep them transparent.',
    ],
    howTo: [
      'Drop the sideways (or tilted) image.',
      'Use the 90° buttons for quick fixes, or enter any angle to straighten a tilt.',
      'Pick the output format and background colour if needed.',
      'Press Rotate & download.',
    ],
    faqs: [
      {
        q: 'Why does my photo look fine in one app and sideways in another?',
        a: 'Cameras record an EXIF orientation flag instead of rotating the pixels. Viewers that honour the flag show it upright; others don’t. Rotating here rewrites the actual pixels, so the photo is upright everywhere.',
      },
      {
        q: 'Will a 90° rotation lose quality?',
        a: 'A quarter turn just rearranges pixels — with PNG output it is fully lossless. JPG re-encoding applies the quality you select (90%+ is visually indistinguishable).',
      },
    ],
    related: ['flip-image', 'crop-image', 'resize-image'],
  },
  {
    slug: 'flip-image',
    name: 'Flip Image',
    title: 'Flip Image Online Free – Mirror Photos Horizontally or Vertically | Free QR Code Tools',
    description:
      'Flip images horizontally or vertically online for free. Mirror a selfie, correct mirrored text, or create mirror effects — instantly, in your browser.',
    h1: 'Flip Image Online',
    category: 'edit',
    summary: 'Mirror an image left-to-right or top-to-bottom.',
    intro: [
      'Front cameras save selfies mirrored; scanners and screen recordings flip things too. This tool mirrors an image horizontally (left ↔ right) or vertically (top ↔ bottom) in one click, pixel-for-pixel — a lossless rearrangement with no quality settings to worry about when you export as PNG.',
      'Flipping horizontally is also the quick fix when text in a photo reads backwards, and the pair of flips together equals a 180° rotation.',
    ],
    howTo: [
      'Drop the image to mirror.',
      'Choose Flip horizontally or Flip vertically (you can apply both).',
      'Check the preview, choose a format, and download.',
    ],
    faqs: [
      {
        q: 'What is the difference between flip and rotate?',
        a: 'A flip mirrors the image (like looking in a mirror — left and right swap). A rotation turns it (like rotating paper on a desk). Mirrored text reads correctly after a horizontal flip, not after a rotation.',
      },
      {
        q: 'Does flipping reduce quality?',
        a: 'No pixels are blended or resampled — they are only rearranged. Export as PNG for a fully lossless result, or JPG/WebP at the quality you choose.',
      },
    ],
    related: ['rotate-image', 'crop-image', 'resize-image'],
  },
];

export function toolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): ToolDef[] {
  return TOOLS.filter((t) => t.category === category);
}
