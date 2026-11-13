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
  {
    slug: 'image-editor',
    name: 'Image Editor',
    title: 'Free Online Image Editor — Adjust, Watermark, Resize, Style | Image Resizer',
    description:
      'Edit photos free in your browser: brightness, contrast, saturation, hue, blur, sharpen, watermarks, borders, rounded corners, crop, resize and rotate — non-destructive with undo/redo. Nothing is uploaded.',
    h1: 'Free Online Image Editor',
    category: 'edit',
    summary:
      'A full photo editor in the browser: adjustments, watermarks, frames, crop/resize and undoable history — private by design.',
    intro: [
      'This editor chains the jobs people usually open five different tools for: fix the light, crop and resize, add a border or rounded corners, stamp a watermark, and export — in one workspace, in a fixed stage order, with every step undoable. Nothing is destructive: the editor keeps your original untouched and re-renders the result from it, so you can change any earlier decision without starting over.',
      'Adjust exposure, brightness, contrast, saturation and hue; blur, sharpen or pixelate; invert or convert toward grayscale and sepia. Add a text watermark (including a tiled pattern for proofs) or your own logo, fill transparent backgrounds, and compare before/after with the built-in slider before you download.',
      'Like everything on this site, editing happens entirely in your browser — the photo is never uploaded, and exporting strips EXIF metadata as a side benefit.',
    ],
    howTo: [
      'Drop the photo you want to edit.',
      'Work through the tool tabs — Adjust, Transform, Crop & Resize, Style, Watermark — in any order; stages always apply in the documented order.',
      'Use Undo/Redo freely; drag the Compare slider to check before vs after.',
      'Open Export, pick a format and quality, and download.',
    ],
    faqs: [
      {
        q: 'Is my original photo changed?',
        a: 'Never. The editor stores only your edit settings and re-renders a new image from the untouched original every time. Downloading gives you a new file; the original on your device is not modified.',
      },
      {
        q: 'Can I undo an edit from earlier?',
        a: 'Yes — every committed change is a history step. Undo walks back step by step (up to 50), Redo reapplies, and Reset all returns to the original in one click.',
      },
      {
        q: 'In what order are edits applied?',
        a: 'Crop → resize → rotate/flip → background fill → adjustments → rounded corners → border → watermark. A fixed order keeps results predictable: for example the border always frames the final cropped, rotated image.',
      },
      {
        q: 'Does the watermark tool support my logo?',
        a: 'Yes. Upload a logo image (PNG with transparency works best) and place it in any corner or the centre, with opacity and width controls. You can combine it with a text watermark.',
      },
      {
        q: 'Which format should I export?',
        a: 'PNG for logos, screenshots and anything with rounded corners or transparency; JPG for photos (smallest everyday files); WebP for the web; AVIF where your browser supports creating it (Chrome).',
      },
    ],
    related: ['resize-image', 'crop-image', 'compress-image', 'rotate-image'],
  },
  {
    slug: 'image-pipeline',
    name: 'Image Pipeline Builder',
    title: 'Image Processing Pipeline Builder — Chain Steps, Batch Process Free',
    description:
      'Build a reusable image workflow — crop, resize, rotate, adjust, watermark, borders — save it as a preset, then run it over a whole batch at once. Free, private, in your browser.',
    h1: 'Image Processing Pipeline Builder',
    category: 'bulk',
    summary:
      'Chain image operations into a reusable workflow, save it, and batch-process entire folders with it.',
    intro: [
      'If you prepare images the same way every week — resize to 1600px, add your watermark, convert to WebP — a pipeline turns that recipe into a one-click batch job. Add steps in order (crop, resize, rotate, flip, colour adjustments, background fill, rounded corners, borders, text watermark), switch steps off without deleting them, reorder freely, and save the whole thing as a named preset you can export and share as JSON.',
      'Three built-in pipelines (Web optimize, Social square, Watermark & compress) show what is possible and are fully editable. Everything runs in your browser through the same engine as the single tools — a pipeline never does anything a single tool cannot.',
    ],
    howTo: [
      'Start from a built-in pipeline or a blank one, and name it.',
      'Add steps and set each step\'s values; use the checkboxes to test variations.',
      'Save the pipeline as a preset (My presets) if you will reuse it.',
      'Drop a batch of images and download the results individually or as a ZIP.',
    ],
    faqs: [
      {
        q: 'In what order do steps run?',
        a: 'Exactly the order shown, top to bottom — the numbers on each step are the execution order. Reorder with the arrow buttons; the same steps in a different order can give different results (for example, a border added before a rotation is rotated with the image).',
      },
      {
        q: 'Where are my pipeline presets stored?',
        a: 'In this browser\'s local storage, as settings-only JSON (no images). Export them to a file to move them to another machine, and import from the same bar.',
      },
      {
        q: 'Can a pipeline hit an exact file size?',
        a: 'Pipelines control format and quality. For exact KB targets across a batch, use the Bulk Compressor\'s exact-size mode instead.',
      },
    ],
    related: ['bulk-image-resizer', 'bulk-image-compressor', 'image-editor', 'bulk-watermark'],
  },
  {
    slug: 'bulk-image-compressor',
    name: 'Bulk Image Compressor',
    title: 'Bulk Image Compressor — Compress Many Images at Once, Free',
    description:
      'Compress a whole batch of images at once: by quality, or to an exact target size per file with honest per-file reporting. ZIP download. Free and private — nothing is uploaded.',
    h1: 'Bulk Image Compressor',
    category: 'bulk',
    summary:
      'Compress dozens of images in one run — by quality or to an exact KB target per file.',
    intro: [
      'The single-image compressor, scaled up: drop a whole shoot or a folder of product photos and compress them all with one settings block. Choose quality mode for everyday shrinking, or exact-size mode to bring every file to the same target (200KB for a portal upload, 500KB for email) — files that genuinely cannot reach the target are delivered at the smallest size found and named "-smallest-possible", so the report is honest per file.',
      'Processing runs two files at a time with per-file progress, pause/resume, cancel and retry, and everything downloads as one ZIP.',
    ],
    howTo: [
      'Pick a mode: quality, or exact target size.',
      'Choose the output format (JPG for photos, WebP for the web).',
      'Drop your images and watch per-file progress.',
      'Download files individually or as a ZIP.',
    ],
    faqs: [
      {
        q: 'What does "-smallest-possible" in a file name mean?',
        a: 'In exact-size mode, that file could not reach your target even at the lowest quality and smallest dimensions the algorithm allows (usually a very noisy photo or a tiny target). You still get the smallest version found — the name just refuses to pretend it hit the target.',
      },
      {
        q: 'How many images can I compress at once?',
        a: 'There is no fixed count limit; the queue processes two at a time so your browser stays responsive. Very large batches on low-memory devices may be slower — split them if the tab struggles.',
      },
      {
        q: 'Does bulk compression remove metadata?',
        a: 'Yes — every file is re-encoded, which strips EXIF and GPS metadata. Use the Metadata Viewer first if you need to record anything from it.',
      },
    ],
    related: ['compress-image', 'compress-image-to-100kb', 'bulk-image-resizer', 'image-pipeline'],
  },
  {
    slug: 'bulk-image-converter',
    name: 'Bulk Image Converter',
    title: 'Bulk Image Converter — Convert Many Images to JPG, PNG, WebP, AVIF or GIF',
    description:
      'Convert a whole batch of images to one format — JPG, PNG, WebP, AVIF or GIF — with HEIC and TIFF inputs supported. Animated GIFs stay animated to GIF. Free, in-browser.',
    h1: 'Bulk Image Converter',
    category: 'bulk',
    summary:
      'Convert dozens of images to one format in a single run — HEIC and TIFF inputs welcome.',
    intro: [
      'A folder of mixed formats becomes one consistent set: pick the target format and quality, drop everything — JPG, PNG, WebP, HEIC from iPhones, TIFF scans, even SVG and BMP — and download a ZIP of converted files. Animated GIFs keep their animation when converting to GIF; converting an animation to a still format uses the first frame and says so in the file name.',
      'AVIF output is offered only where your browser can genuinely create AVIF files (Chrome); the tool tells you plainly when it cannot.',
    ],
    howTo: [
      'Choose the target format and quality.',
      'Drop the images to convert.',
      'Download converted files individually or as one ZIP.',
    ],
    faqs: [
      {
        q: 'Can I convert HEIC photos from my iPhone in bulk?',
        a: 'Yes — HEIC/HEIF files are decoded on-device when dropped (that decoder loads only when a HEIC file appears). The same applies to TIFF scans (first page).',
      },
      {
        q: 'What happens to animated GIFs?',
        a: 'Converting GIF → GIF preserves every frame and delay. Converting an animated GIF to a still format (JPG/PNG/WebP/AVIF) uses the first frame, and the output file is named "-first-frame" so there is no silent surprise.',
      },
      {
        q: 'Is metadata kept?',
        a: 'No — conversion re-encodes, which strips EXIF/GPS. That is usually what you want before publishing; use the Metadata Viewer to inspect files first if needed.',
      },
    ],
    related: ['image-converter', 'bulk-image-compressor', 'bulk-image-resizer', 'image-pipeline'],
  },
  {
    slug: 'bulk-watermark',
    name: 'Bulk Watermark',
    title: 'Bulk Watermark Tool — Add a Text Watermark to Many Images at Once',
    description:
      'Apply the same text watermark to a whole batch of images: position, opacity, size and colour controls, consistent branding across every file. Free and private.',
    h1: 'Bulk Watermark Tool',
    category: 'bulk',
    summary:
      'One watermark, every photo: brand a whole batch consistently in a single run.',
    intro: [
      'Photographers and sellers watermark whole shoots, not single files. Set your text, position (including a tiled pattern for proofing), opacity, size and colour once, drop the batch, and every image comes out marked identically — sized relative to each image, so a watermark looks the same on a thumbnail and a full-size export.',
      'For one-off images with logos and finer control, the Image Editor\'s watermark tab adds logo overlays and per-image tweaks.',
    ],
    howTo: [
      'Type your watermark text and pick position, opacity, size and colour.',
      'Choose the output format and quality.',
      'Drop the batch and download individually or as a ZIP.',
    ],
    faqs: [
      {
        q: 'Does the watermark scale per image?',
        a: 'Yes — size is a percentage of each image\'s width, so mixed-size batches get visually consistent marks instead of one absolute size that looks huge on small files.',
      },
      {
        q: 'Can I watermark with my logo image instead of text?',
        a: 'In the Image Editor, yes (Watermark tab → Logo watermark). This bulk tool is text-only by design — it keeps batch branding fast and predictable.',
      },
      {
        q: 'Can a watermark be removed later?',
        a: 'Not from the exported files — that is the point. Your originals are never modified, so keep them safe; the watermarked copies are the ones you publish.',
      },
    ],
    related: ['image-editor', 'bulk-image-resizer', 'image-pipeline', 'bulk-image-compressor'],
  },
  {
    slug: 'social-image-resizer',
    name: 'Social Media Image Resizer',
    title: 'Social Media Image Resizer — Exact Sizes for Instagram, Facebook, YouTube & More',
    description:
      'Resize images to the exact published sizes for Instagram, Facebook, YouTube, TikTok, LinkedIn, Pinterest, X, WhatsApp and 9 more platforms. Cover-crop or contain, free and private.',
    h1: 'Social Media Image Resizer',
    category: 'social',
    summary: 'Exact, platform-published sizes for 17 social platforms — pick a placement and get the perfect file.',
    intro: [
      'Every platform crops uploads to its own sizes, and guessing costs you the edges of your design. Pick the platform and placement — Instagram portrait post, YouTube thumbnail, LinkedIn background, Etsy listing — and this tool produces exactly the published pixel size, either cover-cropped to fill the frame or contained on a background colour of your choice.',
      'The preset library covers 17 platforms and is reviewed against the platforms\' own documentation (review date shown in the tool). Platforms change specs occasionally, so treat the numbers as the best documented starting point — every preset states its size openly before you commit.',
    ],
    howTo: [
      'Choose the platform and placement.',
      'Drop your image and pick Cover (fill, may crop edges) or Contain (whole image on a background).',
      'Create and download the exact-size file.',
    ],
    faqs: [
      {
        q: 'Cover or Contain — which should I choose?',
        a: 'Cover fills the entire frame and crops whatever does not fit — best for photos where the centre matters. Contain shows the whole image with background bars — best for graphics, logos and anything with text near the edges that must not be cut.',
      },
      {
        q: 'Why do platforms compress my upload anyway?',
        a: 'Platforms re-encode everything to their own pipeline. Uploading at exactly their published size (and avoiding a second resize on their side) keeps the result closest to your original.',
      },
      {
        q: 'Are these sizes guaranteed current?',
        a: 'They were reviewed against platform documentation on the date shown in the tool. Platforms do change specs without notice; when one does, the manual Image Resizer accepts any custom size.',
      },
    ],
    related: ['resize-image', 'instagram-grid-splitter', 'og-image-generator', 'crop-image'],
  },
  {
    slug: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    title: 'Passport & Visa Photo Maker — US, UK, Pakistan, EU, Canada, India & More',
    description:
      'Make passport, visa and ID photos to official size: country presets with sources and verification dates, positioning guide, exact 300 DPI export and printable sheets. No biometric claims.',
    h1: 'Passport & Visa Photo Maker',
    category: 'passport',
    summary: 'Country-preset ID photos at exact print size, with the official source for every spec — plus print sheets.',
    intro: [
      'Pick your country and document, and the tool works to the published specification: physical size, pixel dimensions at 300 DPI, and background guidance — every preset shows its official source and the date we last verified it. Position your portrait with zoom and move controls against an on-screen guide (crown and chin lines), then export the exact-size photo or a printable sheet (A4 or 4×6 inch) with cut guides.',
      'Two honesty rules: this tool does no face recognition or biometric measurement — the guide is approximate and the issuing authority\'s template prevails; and a background colour can only fill transparency, it cannot repaint the wall behind you. Acceptance is always the authority\'s decision — check the final photo against the official guidance before submitting.',
    ],
    howTo: [
      'Choose the country / document preset and read its specification and source.',
      'Drop a head-and-shoulders photo taken against the required background.',
      'Zoom and move until the head sits inside the oval guide.',
      'Render the exact-size photo, or make a print sheet PDF and print at 100% scale.',
    ],
    faqs: [
      {
        q: 'Will my photo definitely be accepted?',
        a: 'No tool can promise that — acceptance depends on lighting, expression, shadows, head size and the officer\'s or automated checker\'s judgement. This tool guarantees the measurable parts (size, dimensions, DPI) and shows you the official guidance for the rest.',
      },
      {
        q: 'Can it change my photo\'s background to white?',
        a: 'Not honestly: repainting a real backdrop around hair and shoulders is an AI segmentation job, and a bad edge is a common rejection cause. The background setting here only fills transparent areas (e.g. a cut-out PNG). Take the photo against the right background — the preset tells you which.',
      },
      {
        q: 'How do I print the sheet correctly?',
        a: 'Print the PDF at 100% / "actual size" (never "fit to page"), on photo paper. The cut guides are drawn at the exact official size, so a ruler check of one photo confirms the whole sheet.',
      },
      {
        q: 'Is my photo uploaded anywhere?',
        a: 'No. Cropping, rendering and the print sheet all happen in your browser.',
      },
    ],
    related: ['crop-image', 'image-editor', 'resize-image', 'remove-exif-data'],
  },
  {
    slug: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    title: 'Image Metadata & EXIF Viewer — See What Your Photos Reveal',
    description:
      'View EXIF, camera settings and GPS coordinates hidden in JPG, PNG and WebP photos — parsed locally in your browser. Nothing is uploaded, GPS is shown only to you.',
    h1: 'Image Metadata & EXIF Viewer',
    category: 'privacy',
    summary: 'See exactly what a photo reveals: camera, settings, timestamps and GPS — before you share it.',
    intro: [
      'Photos carry a hidden diary: camera model, lens, exposure, the time the shutter fired — and often the GPS coordinates of exactly where you were standing. This viewer parses that metadata from the file bytes (JPEG EXIF/TIFF, PNG text and eXIf chunks, WebP EXIF presence) and shows it in plain language.',
      'Everything happens in your browser: the file is never uploaded, and GPS coordinates are displayed only on your screen. If the viewer finds location data in a photo you plan to post, the EXIF Remover can strip it in one click.',
    ],
    howTo: [
      'Drop a JPG, PNG or WebP file.',
      'Read the parsed fields — camera, dimensions, timestamps, software.',
      'Check the GPS warning if location is embedded, and strip it before sharing.',
    ],
    faqs: [
      {
        q: 'Why does my photo have no metadata?',
        a: 'Many apps strip metadata on export or upload (most social platforms do), screenshots usually have none, and images saved from the web are often already clean. "No metadata found" is a real, common result.',
      },
      {
        q: 'Can this viewer see metadata in HEIC or TIFF files?',
        a: 'The viewer covers the formats that carry web-style EXIF (JPG, PNG, WebP). Converting a HEIC with our converter strips its metadata in the process either way.',
      },
      {
        q: 'Is the GPS location sent anywhere for a map?',
        a: 'No. Coordinates are printed as numbers on your screen only — no map service is called and nothing leaves the browser.',
      },
    ],
    related: ['remove-exif-data', 'blur-image', 'image-converter'],
  },
  {
    slug: 'remove-exif-data',
    name: 'EXIF & Metadata Remover',
    title: 'Remove EXIF & GPS Metadata from Photos — Verified Clean',
    description:
      'Strip EXIF, GPS and camera metadata from photos by re-encoding, then verify: the tool re-parses the output file and shows the empty report as proof. Free, in-browser.',
    h1: 'EXIF & Metadata Remover',
    category: 'privacy',
    summary: 'Remove GPS and camera metadata — and see the verification report parsed from the cleaned file itself.',
    intro: [
      'The reliable way to remove metadata is to re-encode the pixels without it — which is exactly what this tool does, keeping the same format and full resolution. Then it does something most removers skip: it parses the produced file again and shows you the after-report, so "clean" is verified from the actual bytes you are about to download, not just promised.',
      'The before report shows what was in the file (camera, timestamps, GPS) so you know what you just protected. Your image never leaves the browser in either step.',
    ],
    howTo: [
      'Drop the photo and read its before-report.',
      'Click "Strip metadata & verify".',
      'Check the after-report is empty, then download the clean file.',
    ],
    faqs: [
      {
        q: 'Does stripping change the picture itself?',
        a: 'The pixels are re-encoded at high quality in the same format and dimensions. There can be a tiny, usually invisible, generation loss in JPG/WebP; PNG output is lossless.',
      },
      {
        q: 'What exactly is removed?',
        a: 'Everything the container carried: EXIF (camera, settings, timestamps), GPS coordinates, thumbnail images embedded in the EXIF, and PNG text chunks. The image content is untouched.',
      },
      {
        q: 'Why verify afterwards?',
        a: 'Because "removed" claims are easy to make and hard to check. Re-parsing the output file with the same parser as the Metadata Viewer means you can see the empty result yourself.',
      },
    ],
    related: ['image-metadata-viewer', 'blur-image', 'compress-image', 'bulk-image-converter'],
  },
  {
    slug: 'blur-image',
    name: 'Blur & Redact Image',
    title: 'Blur, Pixelate or Hide Parts of an Image — Faces, Plates, Addresses',
    description:
      'Draw rectangles over faces, number plates, addresses or screens and blur, pixelate or black them out. Redaction is baked into the pixels. Free and private.',
    h1: 'Blur & Redact Image',
    category: 'privacy',
    summary: 'Hide the parts of a photo that should not be shared — blur, pixelate or solid black, per region.',
    intro: [
      'Before a photo goes public, the sensitive parts have to go: faces of bystanders, number plates, house numbers, names on documents, data on screens. Draw a rectangle over each one and choose its treatment — blur for a soft cover, pixelate for the classic mosaic, or solid black for total redaction — with a strength control per region.',
      'The treatments are baked into the exported pixels (not a layer that can be peeled off), and re-encoding strips the metadata too. Check the full image once before sharing: redaction only covers what you drew over.',
    ],
    howTo: [
      'Drop the image.',
      'Drag on empty space to draw each region; drag inside a region to move it.',
      'Set each region\'s treatment and strength, then apply and download.',
    ],
    faqs: [
      {
        q: 'Blur or pixelate or black — which is safest?',
        a: 'Solid black is absolute: nothing remains. Heavy pixelation with large blocks is effectively irreversible. Light blur is the weakest — fine for aesthetics (e.g. softening a background face) but not for truly sensitive data like document numbers. When in doubt, go black or big-block pixelate.',
      },
      {
        q: 'Can someone undo the effect from my exported file?',
        a: 'No — the exported pixels are the treated pixels; the original data underneath is gone from that file. Keep your own original private, of course.',
      },
      {
        q: 'Does it detect faces automatically?',
        a: 'No — deliberately. Automatic detection that misses one face is worse than a tool that makes you look at the image yourself. Drawing regions takes seconds and you stay in control.',
      },
    ],
    related: ['remove-exif-data', 'image-metadata-viewer', 'image-editor', 'crop-image'],
  },
  {
    slug: 'image-color-picker',
    name: 'Image Colour Picker & Palette',
    title: 'Image Colour Picker — Pick Any Pixel, Extract the Palette',
    description:
      'Click any pixel of an image to get its exact HEX, RGB and HSL values, and extract the dominant colour palette with one click. Free, in your browser.',
    h1: 'Image Colour Picker & Palette Extractor',
    category: 'utility',
    summary: 'Exact pixel colours (HEX/RGB/HSL) plus the image\'s dominant palette — click to copy.',
    intro: [
      'Designers constantly need "that exact colour" from a photo or screenshot. Click any pixel and this tool reads the real value from the decoded image data (not a screen approximation), giving HEX, RGB and HSL with one-click copy. The palette extractor analyses the whole image and returns its dominant colours — weighted toward the vivid ones a human would actually name — with each colour\'s share of the image.',
    ],
    howTo: [
      'Drop an image.',
      'Click any point to sample its exact colour; copy the format you need.',
      'Extract the palette for the image\'s main colours, and click a swatch to copy it.',
    ],
    faqs: [
      {
        q: 'How accurate is the picked colour?',
        a: 'Exact at the pixel: it reads the decoded image data directly. Note that JPG/WebP compression means neighbouring pixels differ slightly — the value shown is the true value of the pixel you clicked.',
      },
      {
        q: 'How is the palette chosen?',
        a: 'Pixels are grouped into colour buckets, each bucket averaged, weighted toward saturated colours, and near-duplicates merged — so you get the six colours that describe the image, not six shades of its background.',
      },
    ],
    related: ['image-editor', 'color-blindness-simulator', 'og-image-generator'],
  },
  {
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    title: 'Aspect Ratio Calculator — Simplify Ratios & Resize Proportionally',
    description:
      'Calculate aspect ratios from any dimensions, simplify them (1920×1080 = 16:9), and work out proportional resize dimensions instantly.',
    h1: 'Aspect Ratio Calculator',
    category: 'utility',
    summary: 'Turn any width×height into its ratio, and compute matching sizes that keep it.',
    intro: [
      'Enter any width and height and get the simplified aspect ratio (1920×1080 becomes 16:9), the decimal form, and a proportional resize calculator: give a new width and the matching height is worked out for you. Handy before cropping, embedding video, or briefing a designer.',
    ],
    howTo: ['Enter width and height.', 'Read the simplified ratio.', 'Optionally type a new width to get the matching height.'],
    faqs: [
      {
        q: 'What are the common ratios?',
        a: '16:9 (video, YouTube), 4:5 (Instagram portrait), 1:1 (square posts), 3:2 (classic photo), 4:3 (older screens, iPad), 21:9 (ultrawide), 9:16 (Stories, Reels, TikTok).',
      },
      {
        q: 'Why does my ratio show huge numbers?',
        a: 'Some dimensions share no common divisor (e.g. 1000×563 is already simplest). The decimal form is then the practical one to use.',
      },
    ],
    related: ['dpi-calculator', 'print-size-calculator', 'crop-image', 'resize-image'],
  },
  {
    slug: 'dpi-calculator',
    name: 'DPI Calculator',
    title: 'DPI Calculator — Pixels, Inches and Print Resolution',
    description:
      'Work out the effective DPI of an image at a print size, or how many pixels you need for 300 DPI at any width. Instant, with quality guidance.',
    h1: 'DPI Calculator',
    category: 'utility',
    summary: 'Effective DPI at any print size — and the pixels needed to hit 300 DPI.',
    intro: [
      'DPI is just pixels divided by inches — which means the same image is 300 DPI in a wallet print and 72 DPI on a poster. Enter an image width and a print width to see its effective resolution (with a plain-English quality verdict), or set a target DPI to learn how many pixels that print size really needs.',
    ],
    howTo: ['Enter image width in pixels and print width in inches.', 'Read the effective DPI and verdict.', 'Or set a target DPI to get the required pixel width.'],
    faqs: [
      {
        q: 'Is 300 DPI always required?',
        a: 'It is the standard for close-viewed print (books, flyers). Posters viewed from a distance look fine at 100–150 DPI; billboards often run below 30. Viewing distance is what matters.',
      },
      {
        q: 'Can I just set an image to 300 DPI to improve it?',
        a: 'Changing the DPI number alone adds no pixels — printers would simply print it smaller. Real improvement needs more pixels (see the Print Size Calculator for what your pixels can cover).',
      },
    ],
    related: ['print-size-calculator', 'aspect-ratio-calculator', 'passport-photo-maker'],
  },
  {
    slug: 'print-size-calculator',
    name: 'Print Size Calculator',
    title: 'Print Size Calculator — How Big Can I Print This Image?',
    description:
      'Enter pixel dimensions and a DPI to get the maximum print size in inches, centimetres and millimetres — with screen/draft/print presets.',
    h1: 'Print Size Calculator',
    category: 'utility',
    summary: 'From pixels + DPI to real-world size: inches, centimetres and millimetres.',
    intro: [
      'A 3000×2000 photo is not "big" or "small" until you pick a print quality. Choose a DPI — 300 for close-up print, 150 for a poster, 72 for screen equivalence — and see the physical size your pixels cover, in inches, centimetres and millimetres.',
    ],
    howTo: ['Enter the image width and height in pixels.', 'Choose or type a DPI.', 'Read the print size in your preferred unit.'],
    faqs: [
      {
        q: 'What size is a phone photo in print?',
        a: 'A typical 4000×3000 phone photo at 300 DPI prints at about 13.3×10 inches (34×25 cm) — comfortably A4-ish. At poster quality (150 DPI) it reaches roughly A3.',
      },
      {
        q: 'Why do labs ask for 300 DPI files?',
        a: 'At normal reading distance, 300 dots per inch is around the limit of what the eye can resolve, so prints look continuous rather than pixelly.',
      },
    ],
    related: ['dpi-calculator', 'aspect-ratio-calculator', 'passport-photo-maker'],
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    title: 'Images to PDF Converter — Combine Photos into One PDF Free',
    description:
      'Combine multiple images into a single PDF: A4, Letter or fit-to-image pages, margins, page order control. Free, private, in your browser.',
    h1: 'Images to PDF Converter',
    category: 'convert',
    summary: 'Many images, one tidy PDF — with page size, margins and order under your control.',
    intro: [
      'Drop a set of images and get one PDF: choose A4 or US Letter pages (orientation follows each image), or fit each page to its image at 150 DPI. Reorder pages with the arrow buttons, set margins and JPEG quality, and download a single file that is easy to email, upload or print.',
      'This is the companion of the main site\'s PDF tools, tuned for the image workflow: images are placed on white pages, re-encoded (which strips their metadata), and never uploaded anywhere.',
    ],
    howTo: [
      'Drop all the images (order can be fixed afterwards).',
      'Arrange pages with the ↑ ↓ buttons and set page size, margins and quality.',
      'Create and download the PDF.',
    ],
    faqs: [
      {
        q: 'What order do pages appear in?',
        a: 'The list order, top to bottom. Files are added in drop order; use the arrows to fix any page before creating the PDF.',
      },
      {
        q: 'Why are my PNGs on white backgrounds?',
        a: 'These PDF pages are opaque, so transparent images are flattened onto white. That matches how the document will look printed.',
      },
      {
        q: 'Can I turn a PDF back into images?',
        a: 'Yes — the PDF to Images tool does the reverse, rendering pages at your chosen DPI.',
      },
    ],
    related: ['pdf-to-images', 'image-converter', 'compress-image'],
  },
  {
    slug: 'pdf-to-images',
    name: 'PDF to Images',
    title: 'PDF to Image Converter — Render PDF Pages to JPG or PNG at Any DPI',
    description:
      'Convert PDF pages to JPG or PNG images at 72–300 DPI, with page-range selection and ZIP download. Runs locally via pdf.js — your document is never uploaded.',
    h1: 'PDF to Images Converter',
    category: 'convert',
    summary: 'Turn PDF pages into images at print or screen resolution — pick the pages, pick the DPI.',
    intro: [
      'Sometimes you need the pages of a PDF as pictures: for a presentation, a thumbnail, a social post, or a system that only accepts images. Drop a PDF and this tool renders the pages you choose (all, or a range like 1-3,5) at 72 DPI for screens up to 300 DPI for print, as JPG or PNG.',
      'Rendering uses Mozilla\'s pdf.js entirely in your browser — the document never leaves your device. Very large renders are sensibly capped so a huge page at 300 DPI cannot freeze your tab.',
    ],
    howTo: [
      'Drop or browse for a PDF.',
      'Choose the pages, resolution and format.',
      'Render, then download pages individually or as a ZIP.',
    ],
    faqs: [
      {
        q: 'Which DPI should I pick?',
        a: '72–150 DPI for screens, slides and thumbnails; 300 DPI when the image will be printed. Higher DPI means proportionally larger files.',
      },
      {
        q: 'Can it open a password-protected PDF?',
        a: 'No — encrypted PDFs are refused with a clear message. Remove the password in your PDF app first if you have the right to.',
      },
      {
        q: 'Why do pages render on white?',
        a: 'PDF pages can have transparent regions; images are rendered over white so JPG output never turns unexpectedly black.',
      },
    ],
    related: ['images-to-pdf', 'image-converter', 'compress-image'],
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    title: 'Image to Base64 Converter — Get the Data URL for Any Image',
    description:
      'Convert an image to a Base64 data URL for HTML, CSS or JSON. Shows the real size overhead (Base64 is ~33% larger). Copy or download the string.',
    h1: 'Image to Base64 Converter',
    category: 'utility',
    summary: 'One drop → a ready-to-paste data URL, with the true size cost shown.',
    intro: [
      'Base64 embeds an image as text — handy for tiny icons in CSS, email templates, JSON payloads and quick demos. Drop an image and get the complete data URL (prefix included), its exact length, and the honest overhead: Base64 always inflates data by about a third, which is why it suits small assets, not hero photos.',
    ],
    howTo: ['Drop an image.', 'Copy the data URL, or download it as a .txt file.', 'Paste it into your HTML, CSS or JSON.'],
    faqs: [
      {
        q: 'When should I NOT use Base64?',
        a: 'For anything large or reused: a separate image file is cached by browsers and smaller on the wire. Base64 shines for very small images (a few KB) that would otherwise cost an extra request.',
      },
      {
        q: 'What is a data URL?',
        a: 'A URL that contains the data itself: data:image/png;base64,… — browsers decode it inline wherever a normal image URL works.',
      },
    ],
    related: ['base64-to-image', 'favicon-generator', 'image-converter'],
  },
  {
    slug: 'base64-to-image',
    name: 'Base64 to Image',
    title: 'Base64 to Image Converter — Decode a Data URL Back to a Picture',
    description:
      'Paste a Base64 string or data URL and get the image back: format detected from the real bytes, preview and download. Invalid input gets a clear error.',
    h1: 'Base64 to Image Converter',
    category: 'utility',
    summary: 'Paste Base64, get your image back — format sniffed from the bytes, not the label.',
    intro: [
      'Got a wall of Base64 from an API, a log or an old email? Paste it here (with or without the data: prefix) and the tool decodes it, detects the real format from the magic bytes — JPG, PNG, GIF or WebP — previews it, and lets you download the file. Malformed strings get a specific error instead of a broken picture.',
    ],
    howTo: ['Paste the data URL or raw Base64.', 'Click decode.', 'Check the preview and detected format, then download.'],
    faqs: [
      {
        q: 'It says the decoded bytes are not an image — why?',
        a: 'The string decoded fine, but the content is something else (text, audio, a zip…). The tool checks the file signature rather than trusting any prefix, and tells you instead of offering a corrupt download.',
      },
      {
        q: 'My string has line breaks — is that OK?',
        a: 'Yes, whitespace is ignored for raw Base64. The data: prefix form is also accepted as-is.',
      },
    ],
    related: ['image-to-base64', 'image-converter', 'image-metadata-viewer'],
  },
  {
    slug: 'circle-crop-image',
    name: 'Circle Crop Image',
    title: 'Circle Crop Image — Round Profile Pictures with Transparent Corners',
    description:
      'Crop a photo into a perfect circle with transparent corners (real PNG transparency). Zoom and position controls, sizes up to 2048px. For avatars and profile pictures.',
    h1: 'Circle Crop Image',
    category: 'crop',
    summary: 'Round avatars done right: a true circle with transparent corners, at the size you choose.',
    intro: [
      'Profile pictures everywhere are round, but uploading a square and hoping the platform\'s mask aligns is a gamble. This tool makes the circle itself: position your photo with zoom and move controls, pick an output size, and get a PNG whose corners are genuinely transparent (shown on a checkerboard so you can verify). Upload it anywhere and it sits perfectly on any background.',
    ],
    howTo: ['Drop the image.', 'Zoom and move until the circle frames the subject.', 'Pick a size and create the PNG.'],
    faqs: [
      {
        q: 'Why PNG only?',
        a: 'Transparency needs a format with an alpha channel. JPG has none — its "corners" would turn black or white. PNG (and WebP) keep them transparent; this tool exports PNG for maximum compatibility.',
      },
      {
        q: 'What size should I pick?',
        a: '512px covers nearly every avatar slot; 1024px if the image will also be shown large (team pages, speaker bios). Bigger than your source means upscaling, which softens — the tool allows it but the source resolution is the quality ceiling.',
      },
    ],
    related: ['crop-image', 'social-image-resizer', 'favicon-generator', 'passport-photo-maker'],
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon & App Icon Generator',
    title: 'Favicon Generator — Full Icon Set + Real .ico File from One Image',
    description:
      'Generate the complete favicon set from one image: favicon.ico (real ICO container), 16/32/48 PNG, Apple touch icon, Android 192/512, ZIP download and the HTML snippet.',
    h1: 'Favicon & App Icon Generator',
    category: 'utility',
    summary: 'One logo in → every icon a website needs out, including a genuine .ico and the HTML to use them.',
    intro: [
      'A modern site needs more than one favicon: the classic .ico, PNG icons for browsers, an Apple touch icon for home screens, and Android/PWA sizes. Drop one image and this tool generates the full set at exact sizes — the .ico is a real ICO container with PNG entries packed to the format spec, not a renamed PNG — plus a ZIP and the exact HTML link tags to paste into your page.',
    ],
    howTo: ['Drop a logo or image (square, simple and bold works best at 16px).', 'Generate the set and preview each size.', 'Download individually or as a ZIP, and paste the HTML snippet into your site.'],
    faqs: [
      {
        q: 'What makes a good favicon source?',
        a: 'A square logo with strong shapes and contrast. Fine detail vanishes at 16×16 — most brands use a simplified mark or a single letter for small sizes. Generate the set and actually look at the 16px result before shipping.',
      },
      {
        q: 'Is the .ico a real ICO file?',
        a: 'Yes — it is built to the ICO container specification with 16, 32 and 48px PNG entries inside, which Windows and browsers read natively. A renamed PNG would silently fail in several of those places.',
      },
      {
        q: 'Where do the files go on my site?',
        a: 'In the site root (where the snippet\'s paths point). The included favicon-links.html has the exact tags.',
      },
    ],
    related: ['image-to-base64', 'resize-image', 'og-image-generator', 'circle-crop-image'],
  },
  {
    slug: 'instagram-grid-splitter',
    name: 'Instagram Grid Splitter',
    title: 'Instagram Grid Splitter — Cut One Photo into a 3×3 Profile Grid',
    description:
      'Split one image into 3×1, 3×2, 3×3 or custom grid tiles, numbered in posting order (post 01 first), with a ZIP download. Make the big-picture profile grid.',
    h1: 'Instagram Grid Splitter',
    category: 'social',
    summary: 'One striking image → a full profile grid, with tiles numbered in the order to post them.',
    intro: [
      'The giant-image profile grid is one of Instagram\'s most striking layouts — and the fiddliest to produce by hand. Drop one image, choose 3×1 (banner), 3×2 or 3×3 (or a custom grid), and the tool centre-crops and slices it into tiles. The catch everyone trips on is order: Instagram shows your newest post first, so the tiles come numbered in posting order — post 01 (the bottom-right piece) first, and the mosaic assembles itself correctly as you post.',
    ],
    howTo: ['Drop a high-resolution image (at least ~1080px per tile column ideally).', 'Choose the grid size and split.', 'Preview the mosaic with posting numbers, then download the ZIP and post in order.'],
    faqs: [
      {
        q: 'Why is tile 01 the bottom-right?',
        a: 'Because the feed is reverse-chronological: your last post lands top-left. To end with the image reading correctly, the piece that belongs top-left must be posted last, and the bottom-right piece first. The numbers handle it — just post in order.',
      },
      {
        q: 'What resolution should the source be?',
        a: 'Each tile displays up to 1080px wide, so a 3-wide grid wants ≈3240px across for full sharpness. Smaller sources still work — tiles are simply softer.',
      },
      {
        q: 'Can I use other grid shapes?',
        a: 'Yes — rows and columns go to 6 each. Note Instagram profiles always show 3 columns, so column counts of 3 keep rows aligned on the profile page.',
      },
    ],
    related: ['social-image-resizer', 'crop-image', 'resize-image'],
  },
  {
    slug: 'color-blindness-simulator',
    name: 'Colour-Blindness Simulator',
    title: 'Colour-Blindness Simulator — See Your Image Through 7 Vision Types',
    description:
      'Simulate protanopia, deuteranopia, tritanopia, anomalous variants and achromatopsia with published Machado matrices. Check designs and charts for accessibility.',
    h1: 'Colour-Blindness Simulator',
    category: 'utility',
    summary: 'How does your image read to the 1 in 12 men with red-green deficiency? See it, then fix it.',
    intro: [
      'Charts that rely on red-versus-green, warning icons distinguished only by hue, text on a coloured background — colour-vision deficiency quietly breaks all of them for millions of users. This simulator renders your image through the published Machado, Oliveira & Fernandes (2009) matrices for seven vision types, so you can see exactly what survives and export the simulation for design reviews.',
    ],
    howTo: ['Drop the image (design, chart, photo).', 'Step through the vision types — start with deuteranopia, the most common.', 'Where meaning disappears, add labels, patterns, icons or brightness contrast.'],
    faqs: [
      {
        q: 'How accurate is the simulation?',
        a: 'It uses the standard physiologically-based matrices used across the industry for the -opia types at full severity and the -omaly types at 0.6 severity. Individual vision varies, but as a design check ("does the meaning survive?") it is the accepted approach.',
      },
      {
        q: 'What is the most common deficiency?',
        a: 'Deuteranomaly/deuteranopia (green) then protan defects (red) — together roughly 8% of men and 0.5% of women. Tritan (blue) defects are rare and usually acquired.',
      },
    ],
    related: ['image-color-picker', 'image-editor', 'og-image-generator'],
  },
  {
    slug: 'og-image-generator',
    name: 'OG Image Generator',
    title: 'OG Image Generator — Social Share Cards (1200×630) in Seconds',
    description:
      'Compose Open Graph share cards: background image or colour, accent bar, wrapped title, subtitle and brand line at exact 1200×630 (plus X and blog sizes). Export PNG/JPG.',
    h1: 'OG / Social Card Generator',
    category: 'social',
    summary: 'The card that appears when your link is shared — designed in the browser, exported at exact size.',
    intro: [
      'When a link is shared, the OG image is the headline, cover and advert in one. This composer builds it properly: 1200×630 exactly (plus X-card and blog-header sizes), your background photo cover-fitted under a contrast overlay (or a solid brand colour), an accent bar, a title that is measured and wrapped with real font metrics — shrinking to fit rather than clipping — a subtitle and a brand line. Export as PNG or JPG and wire it into your page\'s og:image tag.',
    ],
    howTo: ['Pick a card size and type your title, subtitle and brand.', 'Choose colours; optionally add a background photo.', 'Watch the live preview and download the PNG or JPG.'],
    faqs: [
      {
        q: 'What size is an OG image?',
        a: '1200×630px is the standard recommendation across Facebook, LinkedIn and X (X cards use 1200×628, also offered here). Smaller images may be shown as thumbnails instead of full cards.',
      },
      {
        q: 'Why does my long title get an ellipsis?',
        a: 'If a title cannot fit three lines at the minimum readable size, it is truncated with an ellipsis and the tool tells you. Shorten it — sub-60-character titles almost always fit cleanly.',
      },
    ],
    related: ['social-image-resizer', 'favicon-generator', 'image-color-picker'],
  },
  {
    slug: 'gif-maker',
    name: 'GIF Maker',
    title: 'GIF Maker — Turn Images into an Animated GIF (Delay & Loop Control)',
    description:
      'Create animated GIFs from a sequence of images: reorder frames, set the delay per frame, choose looping, resize. Encoded locally with gifenc.',
    h1: 'GIF Maker from Images',
    category: 'edit',
    summary: 'A sequence of stills → a proper animated GIF, with delay and loop controls.',
    intro: [
      'Drop a sequence of images — product angles, drawing steps, photo bursts — order them, set how long each frame shows, choose looping, and get a real animated GIF encoded in your browser. Frames are cover-resized to a consistent size (set by the first frame\'s shape, or a width you pick) so mixed inputs animate cleanly instead of jumping.',
    ],
    howTo: ['Drop at least two images.', 'Reorder frames with the arrows; set delay and looping.', 'Create the GIF — it downloads and previews, motion included.'],
    faqs: [
      {
        q: 'What delay should I use?',
        a: '100–200ms (5–10 fps) reads as smooth motion; 500ms suits step-by-step slides; 40–60ms is video-like but inflates file size because every frame is stored in full.',
      },
      {
        q: 'Why does my GIF look grainy?',
        a: 'GIF is limited to 256 colours per frame — photographs band and dither. It is the price of the format\'s universal support; for photographic motion, short WebP or MP4 files are smaller and smoother.',
      },
      {
        q: 'Can I edit an existing animated GIF?',
        a: 'Yes, elsewhere on this site: the Resizer and Bulk Resizer preserve animation when outputting GIF, and the Converter keeps animations when converting GIF → GIF.',
      },
    ],
    related: ['image-converter', 'bulk-image-converter', 'resize-image', 'image-editor'],
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    title: 'JPG to PNG Converter — Free, Full Quality, In Your Browser',
    description:
      'Convert JPG to PNG instantly and privately. Useful for editing pipelines and tools that need PNG — with an honest note that PNG cannot restore detail JPG already lost.',
    h1: 'JPG to PNG Converter',
    category: 'convert',
    summary: 'JPG in, PNG out — for editing workflows that need a lossless working file.',
    intro: [
      'Sometimes the next tool in your chain demands a PNG. This converts any JPG (and PNG/WebP/HEIC/TIFF inputs too) to a full-resolution PNG in your browser. One honest caveat: PNG is lossless going forward, but it cannot restore detail the JPG already threw away — the PNG will be pixel-identical to your JPG, just in a bigger, lossless container.',
    ],
    howTo: ['Drop the JPG.', 'Convert and download the PNG.'],
    faqs: [
      {
        q: 'Will the PNG look better than the JPG?',
        a: 'No — it will look identical. The benefit is that further edits and saves no longer degrade it, because PNG never re-compresses.',
      },
      {
        q: 'Why is the PNG so much bigger?',
        a: 'Lossless storage of photographic content typically runs 3–8× a quality JPG. That is the real cost of "no further loss".',
      },
    ],
    related: ['png-to-jpg', 'image-converter', 'png-to-webp'],
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    title: 'PNG to JPG Converter — Smaller Files, Transparency Filled Your Way',
    description:
      'Convert PNG to JPG for much smaller photo files. Choose what fills transparency (JPG has none). Free, private, full-resolution.',
    h1: 'PNG to JPG Converter',
    category: 'convert',
    summary: 'PNG screenshots and exports → compact JPGs, with the transparency fill under your control.',
    intro: [
      'PNG is a heavyweight format for photographs. Converting photo-like PNGs to JPG typically cuts the file by 70–90% at quality 85–90, with no visible difference. Because JPG has no transparency, you choose the background colour transparent areas are filled with (white by default) — check logos and cut-outs before you commit.',
    ],
    howTo: ['Drop the PNG.', 'Pick quality and the transparency fill colour.', 'Convert and download the JPG.'],
    faqs: [
      {
        q: 'What quality should I choose?',
        a: '85–90 for photos you will view or share (visually indistinguishable, big savings); 95+ when the JPG feeds further editing.',
      },
      {
        q: 'My logo PNG has transparency — what happens?',
        a: 'Transparent areas are filled with the background colour you pick. If you need the transparency itself preserved, keep PNG or use WebP instead.',
      },
    ],
    related: ['jpg-to-png', 'image-converter', 'compress-image'],
  },
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    title: 'JPG to WebP Converter — Shrink Website Photos by ~30%',
    description:
      'Convert JPG to WebP for the web: typically 25–35% smaller at the same quality, supported by every modern browser. Free and in-browser.',
    h1: 'JPG to WebP Converter',
    category: 'convert',
    summary: 'The easiest website speed win: same photos, roughly a third smaller.',
    intro: [
      'WebP was built for exactly this: photographic images, visibly identical, roughly 25–35% smaller than JPG at matched quality — and every modern browser displays it. Drop your JPGs and convert at the quality you choose; for whole folders, the Bulk Converter runs the same conversion over a batch.',
    ],
    howTo: ['Drop the JPG.', 'Set quality (82–88 is the web sweet spot).', 'Convert and download the WebP.'],
    faqs: [
      {
        q: 'Is WebP really supported everywhere?',
        a: 'All modern browsers (Chrome, Edge, Firefox, Safari 14+) display WebP. Very old software and some desktop apps still prefer JPG — keep JPGs for email attachments to unknown recipients.',
      },
      {
        q: 'WebP or AVIF?',
        a: 'AVIF compresses a bit further and is growing fast, but creating AVIF files works only in Chrome today, and encoding is slower. WebP is the safe default for a whole site.',
      },
    ],
    related: ['png-to-webp', 'image-converter', 'bulk-image-converter'],
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    title: 'PNG to WebP Converter — Keep Transparency, Cut the Weight',
    description:
      'Convert PNG to WebP with transparency preserved (or lossless mode) at a fraction of the size. Perfect for web graphics, logos and overlays.',
    h1: 'PNG to WebP Converter',
    category: 'convert',
    summary: 'Web graphics with alpha, minus the PNG bloat.',
    intro: [
      'WebP does the two things web graphics need at once: an alpha channel like PNG, and compression like JPG. Logos, overlays and UI graphics typically shrink 50–80% versus PNG at the quality setting, and this converter keeps the transparency intact. (For pixel-perfect archival copies, keep the PNG master — conversion at a quality setting is lossy; that trade is the point.)',
    ],
    howTo: ['Drop the PNG.', 'Set quality — higher for crisp logo edges.', 'Convert and download the WebP.'],
    faqs: [
      {
        q: 'Is transparency really preserved?',
        a: 'Yes — WebP has a full alpha channel and this converter keeps it. Preview the result on the checkerboard pattern in the result panel to verify.',
      },
      {
        q: 'What quality for logos?',
        a: '90–100. Flat graphics with sharp edges show compression artefacts sooner than photos, and the files are small anyway.',
      },
    ],
    related: ['jpg-to-webp', 'image-converter', 'png-to-jpg'],
  },
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    title: 'HEIC to JPG Converter — Open iPhone Photos Anywhere, Free',
    description:
      'Convert HEIC/HEIF photos from iPhone to universally-compatible JPG, decoded privately on your device. No upload, no sign-up, full resolution.',
    h1: 'HEIC to JPG Converter',
    category: 'convert',
    summary: 'iPhone photos that Windows, websites and grandma\'s PC can actually open.',
    intro: [
      'iPhones shoot HEIC by default — efficient, but still refused by half the websites, Windows PCs and office software on earth. This converter decodes HEIC entirely on your device (the decoder loads only when a HEIC file is dropped) and gives you a standard full-resolution JPG that works everywhere. For a whole camera roll, the Bulk Converter does the same in batch.',
    ],
    howTo: ['Drop the .heic or .heif photo.', 'Convert and download the JPG.'],
    faqs: [
      {
        q: 'Is my photo uploaded for conversion?',
        a: 'No — HEIC decoding runs in your browser via a WebAssembly decoder. That is also why the first HEIC drop may take a moment: the decoder loads on demand.',
      },
      {
        q: 'What about Live Photos?',
        a: 'A Live Photo\'s still image converts normally; the short video component is a separate .mov file and is not part of the HEIC still.',
      },
      {
        q: 'Does conversion lose quality?',
        a: 'The JPG is encoded at the quality you choose (90 default) from the full HEIC decode — for sharing and printing purposes the result is equivalent. Keep the HEIC as your master archive.',
      },
    ],
    related: ['image-converter', 'bulk-image-converter', 'jpg-to-webp'],
  },
];

export function toolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): ToolDef[] {
  return TOOLS.filter((t) => t.category === category);
}
