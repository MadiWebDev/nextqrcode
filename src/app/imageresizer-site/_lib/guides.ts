/**
 * Original guides for the image site. Each is written for this site,
 * links to the tools that do the job it describes, and carries real
 * publish/update dates for Article schema. No scraped or spun content.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  intro: string[];
  sections: GuideSection[];
  relatedTools: string[];
  relatedGuides: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-resize-an-image-without-losing-quality',
    title: 'How to Resize an Image Without Losing Quality',
    description:
      'Downscaling is lossless in practice; upscaling never invents detail. The rules that keep resized images sharp — and the settings that matter.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      '"Without losing quality" means two different things depending on direction. Making an image smaller throws pixels away in a controlled way and can look perfect. Making it bigger asks the software to invent pixels that were never captured — that always softens, no matter what the marketing says. This guide explains both honestly and shows the settings that keep results sharp.',
    ],
    sections: [
      {
        heading: 'Downscaling: the safe direction',
        paragraphs: [
          'When you shrink an image, the resizer averages neighbourhoods of pixels into single pixels. Fine detail below the new resolution disappears, but the picture as a whole stays truthful — a 4000px photo at 800px looks crisp because the eye never missed the discarded detail at that display size.',
          'Two habits keep downscales sharp. First, resize in one step from the original rather than in stages through other tools (every re-encode of a JPG compounds loss). Second, export at a sensible quality: 82–90 for JPG/WebP keeps files small with no visible artefacts on photos.',
        ],
      },
      {
        heading: 'Upscaling: what actually happens',
        paragraphs: [
          'Upscaling interpolates: the software estimates in-between pixels from their neighbours. Good resampling (multi-step, high-quality smoothing) plus a touch of sharpening can make a 2× enlargement look respectable, especially for screens. It cannot recreate eyelashes, text or texture that the original never resolved.',
          'So-called "AI upscalers" hallucinate plausible detail — sometimes impressive, sometimes wrong (faces and text suffer most). Treat any upscaled image as an interpretation, and never upscale for official documents, ID photos or anything evidentiary.',
        ],
      },
      {
        heading: 'The settings that matter',
        paragraphs: ['In rough order of impact:'],
        bullets: [
          'Start from the largest, least-compressed original you have.',
          'Keep the aspect ratio locked unless you deliberately want distortion.',
          'Downscale in one pass; avoid chains of tools.',
          'Choose the format by content: JPG/WebP for photos, PNG for graphics and text.',
          'Add mild sharpening after a big downscale — thumbnails often look soft without it.',
        ],
      },
      {
        heading: 'Try it',
        paragraphs: [
          'The Image Resizer on this site downscales with high-quality smoothing and shows before/after sizes. The Editor\'s Enhance mode does multi-step resampling with an unsharp mask for enlargements — labelled honestly as resampling, because that is what it is.',
        ],
      },
    ],
    relatedTools: ['resize-image', 'image-editor', 'compress-image'],
    relatedGuides: ['image-file-formats-explained', 'how-to-compress-images-for-a-website'],
  },
  {
    slug: 'image-file-formats-explained',
    title: 'Image File Formats Explained: JPG, PNG, WebP, AVIF, GIF, HEIC',
    description:
      'What each image format is actually for, where each one fails, and a simple rule for picking the right one every time.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 6,
    intro: [
      'Formats are trade-offs, not rankings. Each of the six you will meet daily makes a different bargain between size, quality, transparency and compatibility. Learn the bargains once and you will never guess again.',
    ],
    sections: [
      {
        heading: 'JPG — the universal photograph',
        paragraphs: [
          'Lossy, no transparency, supported by literally everything made since the 1990s. JPG discards information your eye mostly cannot see, which is why a 5MB camera file becomes a 400KB web photo. Its weakness: every re-save degrades it a little more, and sharp edges (text, logos) grow fuzzy halos. Best for: photos you share, email or print. Avoid for: masters you will edit repeatedly, graphics with text.',
        ],
      },
      {
        heading: 'PNG — lossless and proud of it',
        paragraphs: [
          'PNG keeps every pixel exactly, supports full transparency, and produces big files for it. Screenshots, logos, diagrams and anything with crisp edges or text belong here. Photos in PNG are usually a waste — 3–8× a JPG with no visible gain. Best for: graphics, screenshots, transparency, archival masters of non-photo images.',
        ],
      },
      {
        heading: 'WebP — the web\'s modern default',
        paragraphs: [
          'Google\'s format does lossy (like JPG) and lossless (like PNG), plus transparency and animation, typically 25–35% smaller than JPG at the same quality. Every modern browser displays it. Best for: websites. Caution: some older desktop apps and email clients still cannot open it.',
        ],
      },
      {
        heading: 'AVIF — the newest, the smallest, the catch',
        paragraphs: [
          'AVIF compresses further than WebP and handles HDR colour. Display support is now broad, but creating AVIF files in the browser works only in Chrome — other browsers cannot encode it at all, and honest tools will tell you that rather than fake it. Best for: cutting-edge web delivery when you control the pipeline.',
        ],
      },
      {
        heading: 'GIF and HEIC — the specialists',
        paragraphs: [
          'GIF survives on one trick: universal animation. Its 256-colour limit makes photos band and bloat; use it for simple animations and memes, and prefer video or WebP for photographic motion. HEIC is the iPhone\'s efficient storage format — excellent masters, miserable compatibility. Convert HEIC to JPG when a photo needs to leave the Apple ecosystem.',
        ],
      },
      {
        heading: 'The one-line rule',
        paragraphs: [
          'Photos for the web: WebP (JPG for maximum compatibility). Graphics and transparency: PNG or WebP. Masters: keep the original format untouched. Animation: GIF for support, video/WebP for quality. When in doubt, the Converter shows you real file sizes for each format — decide from numbers, not folklore.',
        ],
      },
    ],
    relatedTools: ['image-converter', 'jpg-to-webp', 'heic-to-jpg', 'compress-image'],
    relatedGuides: ['how-to-compress-images-for-a-website', 'how-to-convert-heic-to-jpg'],
  },
  {
    slug: 'how-to-compress-images-for-a-website',
    title: 'How to Compress Images for a Website (Without Wrecking Them)',
    description:
      'The three levers of image weight — dimensions, format, quality — in the order that matters, with targets for heroes, content images and thumbnails.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'Images are most of the weight of most web pages, and nearly all of that weight is optional. Compression is not one trick but three levers pulled in the right order: size the image to its slot, pick the modern format, then tune quality. Here is the workflow professionals use.',
    ],
    sections: [
      {
        heading: 'Lever 1: dimensions (the big one)',
        paragraphs: [
          'A 4000px photo displayed in an 800px slot carries ~25× the pixels it needs. Resize to roughly 1.5–2× the displayed size (the extra covers retina screens) and you have already won most of the battle — before any "compression" happens. A hero image rarely needs more than 1920px across; inline content 1200px; thumbnails 600px.',
        ],
      },
      {
        heading: 'Lever 2: format',
        paragraphs: [
          'WebP beats JPG by roughly a third at equal quality and is supported by every modern browser; AVIF goes further where your pipeline can create it. Graphics with transparency: WebP or PNG. The Smart Pick mode in our Compressor encodes JPG, WebP and AVIF (where supported) at the same quality and shows you the three real sizes — pick from evidence.',
        ],
      },
      {
        heading: 'Lever 3: quality',
        paragraphs: [
          'Quality sliders are not linear: 100→90 usually halves a JPG; 85 is the photo sweet spot; below 70, skies band and faces waxy. Compress a copy, view at 100% zoom, and back off one step from the point artefacts appear. For portals with hard limits (job sites, marketplaces), skip the guessing: an exact-KB compressor targets the byte size directly.',
        ],
      },
      {
        heading: 'Targets worth aiming for',
        paragraphs: ['Reasonable budgets per image on a content page:'],
        bullets: [
          'Hero / banner: under 200KB',
          'Inline article image: 60–120KB',
          'Product photo: 100–200KB (zoom quality matters)',
          'Thumbnail: under 30KB',
          'Whole page image weight: under ~1MB total',
        ],
      },
      {
        heading: 'Do it in bulk',
        paragraphs: [
          'Nobody should hand-compress forty product photos. Set the recipe once (max dimension + WebP + quality 82), run the whole folder through the Bulk Compressor or a saved Pipeline, and spot-check the largest and smallest results.',
        ],
      },
    ],
    relatedTools: ['compress-image', 'compress-image-to-100kb', 'bulk-image-compressor', 'image-pipeline'],
    relatedGuides: ['image-file-formats-explained', 'how-to-resize-an-image-without-losing-quality'],
  },
  {
    slug: 'what-is-exif-data-and-why-it-matters',
    title: 'What Is EXIF Data — and Why Your Photos\' GPS Is in It',
    description:
      'EXIF explained in plain language: what your camera writes into every photo, what it reveals about you, and how to check and remove it.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'Every photo your phone takes carries a hidden diary entry: the camera model, the lens, the exact second — and, unless you turned it off, the GPS coordinates of where you were standing, accurate to a few metres. That diary is EXIF data, and it travels with the file wherever the file goes.',
    ],
    sections: [
      {
        heading: 'What EXIF contains',
        paragraphs: ['A typical phone photo records:'],
        bullets: [
          'Device make, model and sometimes serial numbers',
          'Date and time (the camera clock, not the file date)',
          'Exposure settings: aperture, shutter, ISO, focal length',
          'GPS latitude/longitude and altitude',
          'Software used, and an embedded thumbnail of the image',
          'Orientation (how the camera was held)',
        ],
      },
      {
        heading: 'Where it actually bites',
        paragraphs: [
          'Most big social platforms strip EXIF on upload — posting there is relatively safe. The leaks happen everywhere else: photos sent as email attachments or "original quality" in chats, marketplace listings uploaded from a computer, photos embedded in documents, files shared via cloud links. A seller photographing items at home can publish their home\'s coordinates with every listing.',
          'The embedded thumbnail deserves a mention too: it is a miniature of the original image stored inside the file — famously, it once kept showing the uncropped version of photos whose owners believed they had cropped something out.',
        ],
      },
      {
        heading: 'Check, then strip',
        paragraphs: [
          'You cannot manage what you cannot see, so look first: the Metadata Viewer parses a photo\'s EXIF in your browser and prints GPS plainly if present. Removing it is trivial and permanent for the copy: re-encoding the pixels writes a fresh file with no metadata. Our EXIF Remover does that and then re-parses its own output, showing you the empty report as proof.',
        ],
      },
      {
        heading: 'Prevention on your phone',
        paragraphs: [
          'Both iPhone and Android let you switch off location tagging in the camera settings, and iOS can strip location per-share from the share sheet. Prevention plus a strip-before-publish habit covers nearly every real-world case.',
        ],
      },
    ],
    relatedTools: ['image-metadata-viewer', 'remove-exif-data', 'blur-image'],
    relatedGuides: ['passport-photo-requirements-guide', 'how-to-convert-heic-to-jpg'],
  },
  {
    slug: 'passport-photo-requirements-guide',
    title: 'Passport Photo Requirements: Sizes, Backgrounds and the Rules That Get Photos Rejected',
    description:
      'The common passport and visa photo rules across the US, UK, EU, Pakistan, Canada and more — and the mistakes that actually cause rejections.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 6,
    intro: [
      'Passport photos fail more often for boring reasons than exotic ones: the wrong background, a shadow across the face, a head that is too big in the frame, glasses glare. This guide collects the widely published requirements and the practical rules behind them. Always confirm with your issuing authority — they, not any guide or tool, decide acceptance.',
    ],
    sections: [
      {
        heading: 'The sizes (they are not all the same)',
        paragraphs: [
          'The two dominant families are 2×2 inch (51×51mm — United States, Pakistan, India) and 35×45mm (United Kingdom, Schengen/EU, Australia). Canada is the outlier at 50×70mm; China uses 33×48mm; the UAE commonly 43×55mm. At the standard 300 DPI, 2×2in is exactly 600×600 pixels and 35×45mm is 413×531 — if your file is some other pixel size, it is not the official print size, whatever the website that sold it to you claims.',
        ],
      },
      {
        heading: 'Backgrounds',
        paragraphs: [
          'Most authorities demand a plain, light background — white for the US, Pakistan, Canada, India and China; plain light grey or cream for the UK; a plain light background for Schengen. "Plain" means no patterns, no doors or furniture edges, and crucially no shadow of your head on the wall behind you. Stand half a metre from the wall and light the room evenly.',
        ],
      },
      {
        heading: 'The person rules (where most rejections live)',
        paragraphs: ['Across nearly all authorities:'],
        bullets: [
          'Face the camera directly, head centred, eyes open and clearly visible',
          'Neutral expression (the US allows a natural smile; the UK asks for a plain expression)',
          'No glasses in US photos (since 2016); the UK and EU strongly discourage them',
          'No head coverings except for religious or medical reasons (with documentation where required); the face must be fully visible',
          'No uniforms, no headphones, nothing in the hair that hides the hairline',
          'The photo must be recent — typically taken within the last 6 months',
        ],
      },
      {
        heading: 'Head size and position',
        paragraphs: [
          'Specifications define the head\'s share of the frame — for the US, the head (chin to crown) must be 1–1⅜ inches of the 2-inch height; ICAO-style rules (UK/EU) put the face at roughly 70–80% of the height. This is why a positioning guide matters more than the crop: our Passport Photo Maker overlays crown/chin guides for exactly this, while being explicit that the guide is approximate.',
        ],
      },
      {
        heading: 'What software cannot fix',
        paragraphs: [
          'A maker tool can size, crop and centre a photo. It cannot honestly repaint a patterned backdrop into a compliant white wall (edge artefacts around hair are a classic rejection), remove a shadow across your face, or open your eyes. Take the photo correctly against the right background — it takes two minutes and beats every filter.',
        ],
      },
    ],
    relatedTools: ['passport-photo-maker', 'crop-image', 'print-size-calculator'],
    relatedGuides: ['what-is-exif-data-and-why-it-matters', 'dpi-printing-explained'],
  },
  {
    slug: 'instagram-image-sizes-guide',
    title: 'Instagram Image Sizes 2026: Posts, Stories, Reels and the Profile Grid',
    description:
      'Every Instagram size that matters — feed posts (square, portrait, landscape), Stories, Reels, profile photos — plus how the 3-column grid trick works.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'Instagram displays a handful of shapes and quietly crops everything else. Upload at the platform\'s own sizes and the crop is yours; upload anything else and the crop is theirs. Here are the sizes, with the reasoning that helps you remember them.',
    ],
    sections: [
      {
        heading: 'Feed posts',
        paragraphs: [
          'Square is 1080×1080. Portrait posts at 1080×1350 (4:5) take the most vertical space in the feed — the largest footprint Instagram allows — which is why serious posters default to them. Landscape is 1080×566 (1.91:1). Anything narrower than 1080 across is upscaled by Instagram and softens.',
        ],
      },
      {
        heading: 'Stories, Reels and profile',
        paragraphs: [
          'Stories and Reels are 1080×1920 (9:16) — but keep text and faces out of the top and bottom ~250px, where the interface overlays your name, caption and buttons. Profile photos upload at 320×320 and display as a circle: keep the subject centred with margin, or pre-crop with a circle tool so you see the actual result.',
        ],
      },
      {
        heading: 'The profile grid trick',
        paragraphs: [
          'Profiles show a 3-column grid of your most recent posts. Split one large image into tiles (3×3 is classic) and post them in reverse — bottom-right tile first — and the grid assembles into a single big picture as you post. Our Grid Splitter numbers the tiles in posting order, which is the part everyone gets wrong by hand.',
        ],
      },
      {
        heading: 'One workflow that covers everything',
        paragraphs: [
          'Keep one master (the full-resolution original), and export per placement from it: the Social Media Resizer has every Instagram size as a preset, cover-cropping or containing as the content demands. Never edit the exported copies — always branch from the master.',
        ],
      },
    ],
    relatedTools: ['social-image-resizer', 'instagram-grid-splitter', 'circle-crop-image'],
    relatedGuides: ['how-to-resize-an-image-without-losing-quality', 'og-images-and-social-cards-guide'],
  },
  {
    slug: 'how-to-make-a-favicon',
    title: 'How to Make a Favicon: Sizes, the Real ICO Format, and the HTML',
    description:
      'A complete favicon is a set, not a file: favicon.ico (16/32/48), PNG icons, Apple touch icon and Android sizes — plus the tags that wire them up.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'The single 16×16 file of 2005 is gone. A complete modern favicon set covers browser tabs, bookmarks, iPhone home screens and Android launchers — five or six files, each a different size, plus a few lines of HTML. The good news: generating the set from one logo takes a minute once you know what belongs in it.',
    ],
    sections: [
      {
        heading: 'The set',
        paragraphs: ['A complete, practical set today:'],
        bullets: [
          'favicon.ico — the container browsers and Windows still ask for first; holds 16, 32 and 48px versions',
          'favicon-16x16.png and favicon-32x32.png — explicit PNG icons for modern browsers',
          'apple-touch-icon.png (180×180) — the iOS home-screen icon',
          'android-chrome-192x192.png and 512x512.png — Android/PWA icons',
        ],
      },
      {
        heading: 'The ICO is a container, not a picture',
        paragraphs: [
          'A real .ico is a tiny archive: a header, a directory, and an image per size (PNG-compressed in modern files). Renaming a PNG to .ico produces a file some browsers tolerate and others silently ignore — one reason "my favicon works in Chrome but not in…" is such a common bug report. Generate a true ICO (our generator packs it to spec) and the whole class of problems disappears.',
        ],
      },
      {
        heading: 'Designing for 16 pixels',
        paragraphs: [
          'At 16×16, your detailed logo is soup. Use the boldest simplified mark you have — one letter, one shape, strong contrast — and actually inspect the 16px render before shipping. Many brands maintain a dedicated mini-mark for exactly this; if yours has one, generate the small sizes from it and the large (192/512) from the full logo.',
        ],
      },
      {
        heading: 'The HTML',
        paragraphs: [
          'Place the files at your site root and add the link tags (icon for the .ico and PNGs, apple-touch-icon for the 180). Our Favicon Generator produces the set and includes the exact snippet as favicon-links.html in the ZIP — paste it into your <head> and you are done.',
        ],
      },
    ],
    relatedTools: ['favicon-generator', 'image-to-base64', 'resize-image'],
    relatedGuides: ['image-file-formats-explained', 'og-images-and-social-cards-guide'],
  },
  {
    slug: 'dpi-printing-explained',
    title: 'DPI and Printing Explained: How Big Can You Print a Photo?',
    description:
      'DPI is pixels divided by inches — nothing more mystical. How to work out print sizes, why 300 is the standard, and when less is fine.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      '"Is this image 300 DPI?" is the most common meaningless question in printing — DPI is not a property an image has on its own. It only exists once a physical size is chosen. This short guide makes the idea click, with the maths to answer print questions yourself.',
    ],
    sections: [
      {
        heading: 'The whole concept in one line',
        paragraphs: [
          'DPI = pixels ÷ inches. A 3000px-wide image printed 10 inches wide runs at 300 DPI; printed 30 inches wide, the same file is 100 DPI. The file did not change — the size did. When a printer asks for "300 DPI at A4", they are really asking for about 2480×3508 pixels (A4 at 300 per inch).',
        ],
      },
      {
        heading: 'Why 300, and when less is fine',
        paragraphs: [
          'At reading distance, ~300 dots per inch is roughly the resolving limit of typical eyesight, so prints look continuous. But viewing distance rescues lower resolutions: a poster read from a metre away looks sharp at 150 DPI, a billboard from thirty metres at under 30. Match the DPI to how the print will actually be seen, not to a magic number.',
        ],
      },
      {
        heading: 'Working it out',
        paragraphs: [
          'Size (inches) = pixels ÷ DPI. Pixels needed = inches × DPI. Our DPI Calculator and Print Size Calculator do both directions instantly, with the common presets (72 screen, 150 draft, 300 print) built in — handy when a lab\'s requirement is phrased in any of the three forms.',
        ],
      },
      {
        heading: 'The metadata trap',
        paragraphs: [
          'Image files contain a DPI field that some software shows ("this image is 72 DPI"). It is only a default suggestion for layout programs — changing it resizes the print on paper without touching a single pixel. Never judge printability by that number; judge by pixels and intended size.',
        ],
      },
    ],
    relatedTools: ['dpi-calculator', 'print-size-calculator', 'passport-photo-maker'],
    relatedGuides: ['passport-photo-requirements-guide', 'how-to-resize-an-image-without-losing-quality'],
  },
  {
    slug: 'how-to-convert-heic-to-jpg',
    title: 'How to Convert HEIC to JPG (and Why Your iPhone Uses HEIC)',
    description:
      'HEIC keeps iPhone storage small but breaks half the world\'s software. Convert to JPG privately on-device — single photos or a whole camera roll.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 4,
    intro: [
      'Since iOS 11, iPhones save photos as HEIC by default. It is a genuinely better format — about half the size of JPG at the same quality — with one fatal flaw: vast amounts of the world\'s software still cannot open it. Here is how to convert, and how to stop needing to.',
    ],
    sections: [
      {
        heading: 'Convert one photo (or fifty)',
        paragraphs: [
          'Drop the .heic file into the HEIC to JPG converter. The decoding happens on your device using a WebAssembly decoder that loads only when a HEIC file appears — nothing is uploaded, which matters for personal photos. For a camera-roll backlog, the Bulk Converter takes the whole folder and returns a ZIP of JPGs.',
        ],
      },
      {
        heading: 'Quality notes',
        paragraphs: [
          'HEIC masters are high quality, so encode the JPG at 90+ to keep them that way. The conversion is one-way in practice: keep the HEIC originals as your archive, and treat the JPGs as the working/sharing copies. Colour is preserved; the metadata (including GPS) is stripped by the re-encode — usually a bonus when sharing.',
        ],
      },
      {
        heading: 'Stop the problem at the source',
        paragraphs: [
          'If you mostly share photos outside the Apple ecosystem: on the iPhone, Settings → Camera → Formats → "Most Compatible" makes new photos JPG natively (at roughly double the storage). Alternatively, Settings → Photos can auto-convert on transfer to a computer. Most people land on: shoot HEIC, convert when sharing — which is exactly the workflow above.',
        ],
      },
    ],
    relatedTools: ['heic-to-jpg', 'bulk-image-converter', 'image-converter'],
    relatedGuides: ['image-file-formats-explained', 'what-is-exif-data-and-why-it-matters'],
  },
  {
    slug: 'animated-gif-guide',
    title: 'Animated GIFs: Making Them, Shrinking Them, and Knowing Their Limits',
    description:
      'GIF turned 35+ and refuses to die. How animation encoding works, how to make GIFs from images, resize them without flattening, and keep files sane.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'The GIF is a 1987 format with a 256-colour palette that somehow became the internet\'s favourite moving picture. Working with it well means respecting its limits — and never letting a tool silently flatten your animation into a still.',
    ],
    sections: [
      {
        heading: 'Making a GIF from images',
        paragraphs: [
          'A GIF is a stack of frames plus a delay per frame and a loop count. 100–200ms per frame (5–10 fps) reads as motion; 500ms reads as a slideshow. The GIF Maker here takes any image sequence, normalises frames to one size (mixed sizes jump around otherwise), and encodes with your delay and loop settings.',
        ],
      },
      {
        heading: 'Resizing and converting — without the silent flatten',
        paragraphs: [
          'Many "GIF resizers" quietly keep only the first frame. Ours decodes every frame and resizes them all when the output is GIF, and when you convert an animation to a still format, the file is named "-first-frame" so the choice is explicit, never a surprise. Converting GIF → GIF in the Converter also preserves the animation end-to-end.',
        ],
      },
      {
        heading: 'Why GIF files get huge',
        paragraphs: ['Three multiplicative causes:'],
        bullets: [
          'Dimensions — halving width and height quarters the pixels',
          'Frame count — 3 seconds at 20fps is 60 full frames',
          'Colour and noise — camera noise is GIF poison; every grain becomes data',
        ],
      },
      {
        heading: 'Shrink strategy',
        paragraphs: [
          'Cut dimensions first (480px wide is plenty for chat), then frame rate (10–12fps still reads smoothly), then duration. If it is still heavy and the destination allows it, send an MP4/WebP instead — the same clip is often 5–10× smaller. GIF\'s remaining kingdom is universal support: every chat, forum and email-ish surface plays it.',
        ],
      },
    ],
    relatedTools: ['gif-maker', 'resize-image', 'bulk-image-converter', 'image-converter'],
    relatedGuides: ['image-file-formats-explained', 'how-to-compress-images-for-a-website'],
  },
  {
    slug: 'og-images-and-social-cards-guide',
    title: 'OG Images and Social Cards: The Picture Your Link Wears',
    description:
      'When your link is shared, the OG image is the whole first impression. Sizes, safe design rules, and the meta tags that connect it.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'Share any link in a chat or feed and the picture that appears — the OG image — decides whether the link looks like a story or a shrug. It is 1200×630 pixels of pure first impression, and most sites either skip it or let a random page image do the job badly.',
    ],
    sections: [
      {
        heading: 'The size and the tags',
        paragraphs: [
          'The standard card is 1200×630 (X uses 1200×628; one asset at 1200×630 serves both acceptably). It is wired up with meta tags in your page\'s <head>: og:image (absolute URL), og:title, og:description, and twitter:card summary_large_image for X. Platforms cache aggressively — change the file name or add a version query when you update the card, or the old one may haunt shares for days.',
        ],
      },
      {
        heading: 'Design rules that survive shrinking',
        paragraphs: ['Cards are usually seen small, in a feed, at a glance:'],
        bullets: [
          'One headline, big — if it is not readable at thumbnail size, it is decoration',
          'High contrast: photo backgrounds need a dark overlay under text',
          'Brand present but quiet — a small wordmark, not a billboard',
          'Keep text inside a central safe zone; some surfaces crop edges',
          'Compose per article/page type, not one generic card for the whole site',
        ],
      },
      {
        heading: 'Compose it here',
        paragraphs: [
          'The OG Image Generator builds cards at exact sizes with measured, wrapping text (it shrinks long titles to fit instead of letting them clip), your background photo under a contrast overlay, and a brand line — export PNG or JPG and drop it into your template.',
        ],
      },
    ],
    relatedTools: ['og-image-generator', 'social-image-resizer', 'favicon-generator'],
    relatedGuides: ['how-to-make-a-favicon', 'instagram-image-sizes-guide'],
  },
  {
    slug: 'bulk-image-workflows-and-pipelines',
    title: 'Bulk Image Workflows: Pipelines, Presets and Never Doing the Same Edit Twice',
    description:
      'If you prepare images the same way every week, stop doing it by hand. Building reusable pipelines and presets for resize/watermark/convert recipes.',
    publishedAt: '2026-11-13',
    updatedAt: '2026-11-13',
    readingMinutes: 5,
    intro: [
      'The tenth time you resize a batch to 1600px, watermark it and convert to WebP — by hand, file by file — is the moment to admit the recipe deserves to exist as a thing, not a habit. That is what pipelines and presets are: your recipe, saved, runnable over a whole folder.',
    ],
    sections: [
      {
        heading: 'Anatomy of a good recipe',
        paragraphs: [
          'Most real recipes are three to five steps: normalise (crop/resize), brand (watermark/border), optimise (format + quality). Order matters and is predictable: crop before resize, watermark after resize (so its relative size is consistent), format last. Write the steps down once and the pipeline keeps them in exactly that order, every run.',
        ],
      },
      {
        heading: 'Pipelines vs one-off bulk tools',
        paragraphs: [
          'If the job is one operation — compress everything to 200KB, convert a folder to WebP — the dedicated bulk tools are faster to set up. Pipelines earn their keep when the recipe has multiple steps or repeats weekly: product photos, real-estate sets, social batches, marketplace listings.',
        ],
      },
      {
        heading: 'Presets: recipes you can share',
        paragraphs: [
          'Save a pipeline (or a bulk tool\'s settings) as a named preset and it persists in your browser. Export presets as JSON to move them between machines or hand them to a teammate — the file is settings only, no images, so sharing it leaks nothing. Importing a preset never runs anything by itself; it just loads the recipe.',
        ],
      },
      {
        heading: 'A sane production habit',
        paragraphs: [
          'Keep originals untouched in their own folder, always. Run the recipe into a separate output folder (or ZIP), spot-check the first, middle and last results, and only then publish. Every tool here works on copies — your masters stay pristine, which is what makes experimentation free.',
        ],
      },
    ],
    relatedTools: ['image-pipeline', 'bulk-image-resizer', 'bulk-image-compressor', 'bulk-watermark'],
    relatedGuides: ['how-to-compress-images-for-a-website', 'animated-gif-guide'],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
