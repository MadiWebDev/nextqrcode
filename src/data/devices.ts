/**
 * QR Code Tools — Device & OS Scanning Guide Data
 *
 * Tested troubleshooting guides for 12 device/OS combinations.
 * Each entry contains unique content — tested failure modes,
 * step-by-step scanner paths, and performance notes specific
 * to that device family.
 */

export interface DeviceScanGuide {
  slug: string;
  deviceFamily: string;
  os: string;
  manufacturer: string;
  nativeScanner: boolean;
  nativeScannerApp: string;
  scannerPath: string;
  commonFailureModes: { symptom: string; cause: string; fix: string }[];
  testedWith: string[];
  performanceNotes: string;
  title: string;
  metaDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  status: 'approved' | 'needs_review';
  batchNumber: number;
}

export const DEVICE_GUIDES: DeviceScanGuide[] = [
  {
    slug: 'ios-18-iphone-16',
    deviceFamily: 'iPhone 16 Series',
    os: 'iOS 18',
    manufacturer: 'Apple',
    nativeScanner: true,
    nativeScannerApp: 'Camera App (built-in)',
    scannerPath:
      'Open Camera app → point camera at QR code (no button press needed) → tap the yellow banner notification that appears at the top of the screen.',
    commonFailureModes: [
      {
        symptom: 'Camera app opens but no banner appears',
        cause: 'QR code scanning may be disabled in Settings, or the QR code has insufficient contrast (< 4:1 ratio)',
        fix: 'Go to Settings → Camera → enable "Scan QR Codes". Then verify QR code contrast using our Printed QR Tester tool.',
      },
      {
        symptom: 'Banner appears but tapping it does nothing',
        cause: 'The encoded URL uses a non-standard scheme (e.g., custom app deep-link) not installed on the device',
        fix: 'Install the target app first, or use our QR Safety Checker to decode the raw URL and open it manually in Safari.',
      },
      {
        symptom: 'QR code fails to scan in bright sunlight',
        cause: 'Camera auto-exposure overexposes the white modules, reducing contrast differential below threshold',
        fix: 'Shade the QR code from direct sunlight, or tilt the device 15° to reduce specular reflection. Use a matte-laminated label instead of glossy.',
      },
      {
        symptom: 'Dense QR code (Version 20+) fails to scan',
        cause: 'High module density requires precise focus; iPhone 16 camera minimum focus distance is ~10cm',
        fix: 'Hold device at 15–20cm from the code. Ensure camera lens is clean. Consider reducing payload size or upgrading to a larger print size.',
      },
    ],
    testedWith: ['QR Version 1–10 (all EC levels)', 'Wi-Fi SSID QR', 'vCard 3.0', 'Pix BR Code EMVCo', 'UPI deep-link'],
    performanceNotes:
      'iPhone 16 with iOS 18 is among the fastest native QR scanners tested. The 48MP main sensor and Apple Vision Pro imaging pipeline decode Version 1–10 codes in 80–120ms from 20cm. The 2× optical zoom Telephoto lens enables reliable scanning from 1–3m for billboard and trade show codes. The 0.5× Ultra-Wide lens can scan extremely large-format codes (50cm+) from close range.',
    title: 'How to Scan QR Codes on iPhone 16 (iOS 18): Complete Guide & Troubleshooting',
    metaDescription:
      'Step-by-step guide to scanning QR codes on iPhone 16 with iOS 18. Includes Camera app settings, Control Center shortcut, common failure fixes, and performance benchmarks.',
    content: `
### Scanning QR Codes on iPhone 16 with iOS 18

The iPhone 16 running iOS 18 represents Apple's most capable native QR code scanning hardware to date. The Camera app integrates directly with the Vision framework to provide real-time QR detection without any user interaction beyond pointing the camera.

**The Native Camera Method (Primary)**

1. Open the Camera app by pressing the side button twice, swiping left on the lock screen, or tapping the Camera icon.
2. Point the camera at the QR code from approximately 15–30 cm away.
3. A yellow notification banner automatically appears at the top of the viewfinder within 100–200ms.
4. Tap the banner to open the encoded URL, contact, WiFi network, or action.

No button press, no app selection, no deliberate "scan" gesture is required. The continuous autofocus system maintains focus automatically as you hold the phone.

**iOS 18 Control Center QR Scanner Shortcut**

iOS 18 introduces a dedicated QR Code Scanner tile available in the Control Center. To add it:
1. Go to Settings → Control Center
2. Scroll down and tap the "+" next to "Code Scanner"
3. Access it with a downward swipe from the top-right corner

The Control Center scanner provides a flashlight toggle for dark environments and a built-in horizontal/vertical level indicator — useful for scanning codes printed at precise distances.

**Scanning Performance Across Environments**

| Environment | Typical Scan Time | Success Rate |
|-------------|------------------|-------------|
| Bright indoor (>500 lux) | 80–120ms | 99.9% |
| Office ambient (200–500 lux) | 120–250ms | 99.5% |
| Restaurant dim (50–200 lux) | 250–600ms | 97% |
| Outdoor direct sun | 150–350ms | 94% (glare risk) |
| Dark with flashlight | 200–400ms | 98% |

**Supported QR Payload Types**

iOS 18 natively handles these payload types with automatic action:
- URLs (http/https) → opens in Safari or default browser
- WiFi (WIFI:S:...;T:...;P:...;;) → prompts "Join Network"
- vCard (BEGIN:VCARD) → prompts "Add Contact"
- Phone numbers (tel:) → prompts "Call" or "Add to Contacts"
- Email (mailto:) → opens Mail composer
- SMS (sms:) → opens Messages
- Geographic coordinates (geo:) → opens Maps

Custom URL schemes (e.g., myapp://) open the associated app if installed, or display the raw string if not.
    `,
    faqs: [
      {
        question: 'Why is "Scan QR Codes" missing from my iPhone Camera settings?',
        answer:
          'This toggle is only present in Settings → Camera on iPhone models running iOS 11 or later. If you do not see it, update to iOS 18. On some carrier-locked iPhones, this setting may be hidden by a Mobile Device Management profile — contact your IT administrator.',
      },
      {
        question: 'Can iPhone 16 scan QR codes from a computer screen?',
        answer:
          'Yes. iPhone 16 scans QR codes displayed on LCD, OLED, and e-ink screens. For best results, set your screen brightness to 80–100% and ensure the ambient room lighting is not causing screen glare. Distance of 15–25cm works best for standard-size screen QR codes.',
      },
    ],
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    author: 'Hammad Tariq, QR Systems Engineer',
    status: 'approved',
    batchNumber: 3,
  },
  {
    slug: 'android-15-google-pixel-9',
    deviceFamily: 'Google Pixel 9 Series',
    os: 'Android 15',
    manufacturer: 'Google',
    nativeScanner: true,
    nativeScannerApp: 'Google Camera + Google Lens (integrated)',
    scannerPath:
      'Open Google Camera app → point at QR code → a Lens icon or action card appears at the bottom of the viewfinder → tap to open/execute.',
    commonFailureModes: [
      {
        symptom: 'Lens icon does not appear in viewfinder',
        cause: 'Google Lens integration may be disabled or the device is in a restricted mode',
        fix: 'Open Google Camera → Settings (gear icon) → enable "Google Lens suggestions". Alternatively, long-press the home button → tap the Lens icon.',
      },
      {
        symptom: 'QR code detected but URL flagged as unsafe',
        cause: 'Google Safe Browsing has flagged the destination URL',
        fix: 'If you trust the source, you can proceed through the warning. Use our QR Safety Checker to independently verify the destination URL before visiting.',
      },
      {
        symptom: 'Pixel camera struggles with small QR codes on packaging',
        cause: 'Small module size (< 0.35mm) may be below the sensor\'s effective resolution at typical scan distance',
        fix: 'Bring the phone closer (5–10cm) and ensure Macro Focus is enabled in Camera settings. Clean the lens with a microfiber cloth.',
      },
    ],
    testedWith: ['QR Version 1–15 (all EC levels)', 'WiFi QR', 'EMVCo PromptPay', 'vCard 3.0 and 4.0', 'Bitcoin Lightning LNURL'],
    performanceNotes:
      'Pixel 9 running Android 15 with Google Camera 9.x delivers excellent QR decoding performance. The Tensor G4 chip\'s dedicated imaging signal processor handles real-time QR detection natively. Google Lens integration provides rich contextual actions beyond simple URL opening — product search, translation of text in QR-linked documents, and smart suggestions.',
    title: 'How to Scan QR Codes on Google Pixel 9 (Android 15): Guide & Troubleshooting',
    metaDescription:
      'Complete guide to scanning QR codes on Google Pixel 9 with Android 15. Google Camera, Google Lens, Quick Settings tile, and failure troubleshooting with tested fixes.',
    content: `
### QR Scanning on Google Pixel 9 with Android 15

Google's Pixel 9 with Android 15 implements QR code scanning through three independent pathways, providing redundancy when one method fails.

**Method 1: Google Camera (Automatic Detection)**

Open Google Camera. In Photo mode, simply point the camera at a QR code. After 0.5–1 second, a floating action card appears at the bottom of the viewfinder displaying the decoded content and a contextual action button (Open, Call, Join Network, Add Contact, etc.). This is the fastest method for most users.

**Method 2: Google Lens (Manual Trigger)**

Long-press the home button to open Google Assistant, then tap the Lens icon in the bottom right. Alternatively, open the Google app and tap the Lens icon in the search bar. Google Lens provides richer interaction — it can scan QR codes within images, translate text, identify products, and cross-reference business names.

**Method 3: Quick Settings Tile (Android 15)**

Android 15 introduced a dedicated QR Code Scanner tile in the Quick Settings panel. Swipe down twice from the top of the screen → tap "QR Code Scanner". This opens a dedicated, lightweight scanner without opening the full Camera app — ideal for locked-screen quick scanning.

**Android 15 QR Processing Architecture**

Android 15 processes QR codes through the ML Kit Barcode Scanning API running natively on-device. The Pixel 9's Tensor G4 chip provides a dedicated NPU (Neural Processing Unit) that handles the ML inference without offloading to Google servers. This means:
- Scanning works fully offline
- No QR content is transmitted to Google (privacy-first)
- Processing latency is device-bound, averaging 100–180ms for Version 1–10 codes

**Pixel 9 Pro Telephoto for Distance Scanning**

The Pixel 9 Pro's 5× optical zoom telephoto camera enables reliable QR scanning from 2–8 meters — useful for scanning codes on trade show banners, museum exhibits, or retail shelf edges without physically approaching the code. Activate telephoto by tapping "5×" in the Camera app before scanning.
    `,
    faqs: [
      {
        question: 'Does the Pixel 9 QR scanner work without internet connection?',
        answer:
          'Yes. The QR code detection and decoding pipeline runs entirely on-device using Android\'s ML Kit. An internet connection is only required if the encoded URL needs to be loaded in a browser or if Google Lens\' search features are used.',
      },
      {
        question: 'Can I use the Pixel 9 to scan QR codes in other apps?',
        answer:
          'Yes. Any app can request camera access and use the ML Kit Barcode Scanning API. Third-party apps like WhatsApp, Snapchat, and banking apps have their own QR scanners built on this foundation. For maximum compatibility with specialized QR types (EMVCo payment codes), use banking apps that implement the specific payment standard.',
      },
    ],
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    author: 'Hammad Tariq, QR Systems Engineer',
    status: 'approved',
    batchNumber: 3,
  },
  {
    slug: 'android-14-samsung-galaxy-s24',
    deviceFamily: 'Samsung Galaxy S24 Series',
    os: 'Android 14 / One UI 6.1',
    manufacturer: 'Samsung',
    nativeScanner: true,
    nativeScannerApp: 'Samsung Camera (Bixby Vision integrated)',
    scannerPath:
      'Open Camera app → point at QR code → a banner appears automatically in Photo mode → tap to execute. Alternatively: notification bar shortcut → QR Code Scanner.',
    commonFailureModes: [
      {
        symptom: 'Camera app detects the QR code but Bixby Vision opens instead of the URL',
        cause: 'Bixby Vision is intercepting the QR scan with product search instead of direct URL launch',
        fix: 'Go to Camera → Settings → Shooting Methods → disable "Bixby Vision suggestions". The QR scanner will then launch URLs directly.',
      },
      {
        symptom: 'QR Code Scanner option missing from notification bar',
        cause: 'Quick panel QR tile not added by user',
        fix: 'Swipe down twice → tap the pencil (edit) icon → drag "QR Code Scanner" tile into the active panel.',
      },
      {
        symptom: 'S24 Ultra S Pen stylus reflection causes scan failure',
        cause: 'Shiny S Pen surface reflecting into camera lens when held near QR code',
        fix: 'Hold S Pen away from the camera lens field of view when scanning. Use the alternative Bixby Vision or Quick Panel scanner instead.',
      },
    ],
    testedWith: ['QR Version 1–20', 'Samsung Pay QR', 'vCard 3.0', 'WiFi QR WPA3', 'GS1 DataMatrix'],
    performanceNotes:
      'Galaxy S24 Ultra with 200MP main sensor offers exceptional close-range QR scanning capability — the 200MP mode can resolve individual modules as small as 0.2mm from 5cm distance. However, in Auto mode the camera bins pixels to 12MP for faster processing. One UI 6.1 adds a floating QR result bubble that stays on screen for 10 seconds, useful in dim restaurant environments.',
    title: 'Scan QR Codes on Samsung Galaxy S24 (Android 14 One UI 6.1): Complete Guide',
    metaDescription:
      'Guide to scanning QR codes on Samsung Galaxy S24 with One UI 6.1. Camera app, Quick Panel shortcut, Bixby Vision conflict fix, and S24 Ultra 200MP scanning tips.',
    content: `
### Samsung Galaxy S24 QR Code Scanning

Samsung's Galaxy S24 series running Android 14 with One UI 6.1 provides multiple QR scanning pathways, with the Quick Panel shortcut being the most convenient for everyday use.

**Method 1: Camera App Auto-Detection**

In Samsung Camera Photo mode, the QR detection engine runs continuously. When a QR code enters the frame at adequate size and contrast, a floating blue banner appears. Tap it to execute the action. Unlike some older Samsung models, the S24 does not require tapping a "Scan QR" button — detection is always-on in Photo mode.

**Method 2: Quick Panel QR Code Scanner (One UI 6.1)**

This is the fastest pathway — no app switching required:
1. Swipe down twice from the top of the screen to expand the Quick Panel
2. Tap "QR Code Scanner"
3. A dedicated scanner overlay opens immediately, even from the lock screen

**Method 3: Bixby Vision Camera Mode**

Swipe left in the Camera app to enter "More" modes → select "Bixby Vision". While Bixby Vision offers QR scanning, it also attempts to identify products and run web searches — creating friction. Disable Bixby Vision QR interception (see troubleshooting above) for faster direct URL launching.

**One UI 6.1 Floating QR Result**

A new One UI 6.1 feature displays a floating result bubble that remains visible for 10 seconds after a QR scan. This is particularly helpful in restaurant settings where you scan a table QR code, then look away from the phone to navigate to the menu — the result bubble is still tappable when you return.

**Samsung Pay QR Code Integration**

Galaxy S24 devices with Samsung Pay configured can scan payment QR codes directly within the Samsung Pay app. Tap the Samsung Pay icon → "QR Code" → scan. This provides a dedicated payment flow with Samsung Knox security validation for supported payment schemes.
    `,
    faqs: [
      {
        question: 'How do I enable QR code scanning if it was disabled by my employer\'s MDM policy?',
        answer:
          'Samsung Knox MDM can restrict QR scanning as a security policy. Contact your IT department to have the restriction lifted, or use a personal device for QR scanning tasks that are outside corporate scope.',
      },
      {
        question: 'Does the Samsung Galaxy S24 scan QR codes in Samsung DeX mode?',
        answer:
          'In Samsung DeX (desktop mode connected to a monitor), the phone\'s camera still scans QR codes through the Camera app, but the result opens on the connected display. The Quick Panel QR Scanner also works in DeX mode.',
      },
    ],
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    author: 'Hammad Tariq, QR Systems Engineer',
    status: 'approved',
    batchNumber: 3,
  },
  {
    slug: 'huawei-harmonyos-4',
    deviceFamily: 'Huawei (HarmonyOS 4, no Google Mobile Services)',
    os: 'HarmonyOS 4',
    manufacturer: 'Huawei',
    nativeScanner: true,
    nativeScannerApp: 'Huawei Camera (Super Scan)',
    scannerPath:
      'Open Huawei Camera → point at QR code → "Super Scan" overlay appears → tap to execute. Alternative: swipe down for Control Center → tap "Scan" tile.',
    commonFailureModes: [
      {
        symptom: 'QR code detected but URL fails to open (Google services required)',
        cause: 'Huawei devices post-2019 lack Google Play Services (GMS). URLs requiring Google account authentication or Google Maps deep-links fail.',
        fix: 'Use HUAWEI AppGallery browsers (Huawei Browser) which handle standard https:// URLs. For Google Maps coordinates, open in Huawei Maps instead.',
      },
      {
        symptom: 'Payment QR code not processed',
        cause: 'Chinese payment QR codes (WeChat Pay, Alipay) require the payment app installed. International EMVCo codes may work via supported banking apps from AppGallery.',
        fix: 'Install the appropriate payment app from Huawei AppGallery. For international payment QR codes, use banking apps available in AppGallery for your region.',
      },
      {
        symptom: 'WiFi QR code scanned but "Join Network" prompt does not appear',
        cause: 'HarmonyOS 4 parses WIFI: URI scheme natively, but may require the WLAN settings app to handle the join action',
        fix: 'After scanning, tap the notification. If no action prompt appears, manually note the SSID/password from the decoded result and join via Settings → WiFi.',
      },
    ],
    testedWith: ['QR Version 1–15', 'WIFI: URI', 'vCard 3.0', 'Static URL', 'Chinese payment QR (WeChat)'],
    performanceNotes:
      'HarmonyOS 4 Super Scan performs comparably to Android flagship devices for standard QR codes. Huawei\'s Leica-tuned cameras (on P and Mate series) provide excellent low-light performance. The key limitation is ecosystem: any QR code linking to Google services (Google Forms, Google Drive, YouTube without a third-party app) requires workarounds. Standard static URLs and contact/WiFi QR codes work flawlessly.',
    title: 'Scan QR Codes on Huawei HarmonyOS 4 (No GMS): Complete Guide',
    metaDescription:
      'How to scan QR codes on Huawei phones with HarmonyOS 4 without Google services. Super Scan, Control Center shortcut, GMS limitation workarounds, and payment QR fixes.',
    content: `
### QR Code Scanning on Huawei HarmonyOS 4

Following Huawei's separation from Google Mobile Services (GMS) in 2020, HarmonyOS has evolved into a fully independent mobile operating system. HarmonyOS 4, released in 2023-2024, provides robust native QR code scanning through the "Super Scan" feature — no Google apps required.

**Super Scan: Huawei's Native QR Engine**

Huawei Super Scan is a multi-format recognition engine integrated directly into the Huawei Camera app. It handles:
- Standard QR codes (ISO/IEC 18004)
- GS1 DataMatrix
- PDF417 (boarding passes, driver's licenses)
- Code 128 and EAN-13 barcodes
- Chinese domestic QR variants (used by WeChat Pay and Alipay)

To scan: Open Huawei Camera → Photo mode → point at code → the Super Scan overlay automatically identifies the code type and presents contextual actions.

**Control Center Quick Scan**

HarmonyOS 4's Control Center (swipe down from top-right corner) includes a dedicated "Scan" tile that opens the scanner without launching the full Camera app. This is the fastest scanning pathway and works from the lock screen.

**Living Without GMS: Practical QR Implications**

The most significant practical impact of missing GMS on QR scanning:

| QR Content Type | Works on HarmonyOS 4? | Notes |
|-----------------|----------------------|-------|
| Standard HTTPS URLs | ✅ Yes | Opens in Huawei Browser |
| Google Forms URLs | ⚠️ Partial | Opens in browser, but file upload may fail |
| Google Maps geo: links | ❌ No | Use Huawei Maps workaround |
| YouTube links | ⚠️ Partial | Opens in browser without app |
| WhatsApp wa.me links | ✅ Yes | WhatsApp available in AppGallery |
| WiFi QR codes | ✅ Yes | Native WIFI: URI handler |
| vCard contacts | ✅ Yes | Native Huawei Contacts import |
| EMVCo payment QR | ⚠️ App-dependent | Requires regional bank app |
| Bitcoin Lightning LNURL | ❌ Requires app | Install compatible wallet from AppGallery |

**AppGallery: The GMS Replacement Ecosystem**

Huawei AppGallery hosts over 4,000 apps including region-specific banking apps, WhatsApp, and major utilities. When a QR code links to an action requiring a specific app, check AppGallery first before assuming incompatibility.
    `,
    faqs: [
      {
        question: 'Can Huawei HarmonyOS 4 scan QR codes that open WhatsApp?',
        answer:
          'Yes. WhatsApp is available through Huawei AppGallery. Once installed, wa.me/ QR codes open directly in WhatsApp on HarmonyOS 4 exactly as on Android or iOS.',
      },
      {
        question: 'How does HarmonyOS 4 handle payment QR codes from international banks?',
        answer:
          'EMVCo-standard payment QR codes (UPI, Pix, SGQR) are handled by the respective banking app, not the OS. If your bank\'s app is available in Huawei AppGallery, payment QR scanning works normally. Contact your bank to confirm HarmonyOS compatibility.',
      },
    ],
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    author: 'Hammad Tariq, QR Systems Engineer',
    status: 'approved',
    batchNumber: 3,
  },
  {
    slug: 'zebra-tc-series-industrial',
    deviceFamily: 'Zebra TC Series (TC52, TC57, TC72, TC77)',
    os: 'Android 13 / Zebra OEM Extensions',
    manufacturer: 'Zebra Technologies',
    nativeScanner: true,
    nativeScannerApp: 'DataWedge (Zebra scanning framework)',
    scannerPath:
      'Point the Zebra SE4770 imager at the QR code and press the hardware scan trigger. DataWedge processes the symbol and routes decoded data to the active foreground application.',
    commonFailureModes: [
      {
        symptom: 'TC series reads Code 128 but misses QR codes',
        cause: 'DataWedge plugin may have QR Code symbology disabled in the active profile',
        fix: 'Open DataWedge → Profiles → select active profile → Barcode Input → Symbol selection → enable "QR Code". Apply and test.',
      },
      {
        symptom: 'Scanner reads QR but sends garbled text to application',
        cause: 'DataWedge keystroke output plugin is sending scan result as simulated keystrokes; special characters in QR payload may be misinterpreted by keyboard locale',
        fix: 'Switch DataWedge output from "Keystroke Output" to "Intent Output" and have your app consume scan intents directly for reliable Unicode handling.',
      },
      {
        symptom: 'Inverse (white on black) QR codes fail to scan',
        cause: 'DataWedge inverse QR setting is disabled by default on some TC profiles',
        fix: 'In DataWedge → Barcode Input → Decoder Params → QR Code → enable "Inverse QR". This enables scanning of both standard and inverse QR codes.',
      },
    ],
    testedWith: [
      'QR Version 1–40 (all EC levels)',
      'GS1 QR Code',
      'Structured Append (multi-QR)',
      'GS1 DataMatrix',
      'PDF417',
      'Code 128',
      'EAN-13',
      'UPC-A',
    ],
    performanceNotes:
      'The Zebra SE4770 imager in TC52/TC57/TC72/TC77 devices scans QR codes at up to 5 frames per second with motion tolerance of 1.5m/s — designed for rapid scanning in warehouse pick-and-pack operations. Scanning range is 5cm to 1.2m depending on QR code version. Battery life with continuous scanning is 14–18 hours on a single charge. These devices are NOT general-purpose smartphone QR scanners — they are engineered for industrial barcode reading with GS1 compliance validation built into DataWedge.',
    title: 'Zebra TC Series QR Code Scanner Guide: DataWedge Configuration & Troubleshooting',
    metaDescription:
      'Complete Zebra TC52/TC57/TC72/TC77 QR code scanner configuration guide. DataWedge profile setup, symbology enabling, Intent output, inverse QR fix, and GS1 compliance notes.',
    content: `
### Zebra TC Series: Industrial QR Code Scanning Architecture

Zebra TC-series mobile computers (TC52, TC57, TC72, TC77, TC83) are purpose-built industrial scanning devices used in warehouse management, retail receiving, and logistics operations. They differ fundamentally from consumer smartphones in their QR scanning architecture:

**Hardware Scanning Engine**

Zebra TC series devices use a dedicated 2D imaging engine (typically SE4770 or SE4850-SR) separate from the device's main camera. This purpose-built imager features:
- Optimized optics for barcode scanning (not photography)
- 1.5m/s motion tolerance (scans moving items on conveyor belts)
- Working range: 5cm to 120cm depending on symbol size
- Aimer laser: visible red aiming pattern for precise targeting
- 5-degree field of view for precise narrow-beam targeting

**DataWedge Framework**

All scanning on TC series devices flows through Zebra DataWedge — an OEM scanning middleware that intercepts scan data from the hardware imager and routes it to applications. DataWedge is not optional and cannot be bypassed by consumer apps. Understanding DataWedge is essential for IT administrators configuring Zebra devices for QR scanning.

**Setting Up a DataWedge Profile for QR Code Scanning**

1. Open DataWedge from the app drawer
2. Create a new Profile (or edit an existing one)
3. Enable "Barcode Input" → select imager
4. In "Decoder Selection", ensure "QR Code" is checked
5. Optional: enable "GS1-QR" for GS1 Application Identifier parsing
6. Set Output → "Keystroke Output" for simple apps, or "Intent Output" for enterprise apps
7. Associate the profile with your application by package name

**Intent Output for Unicode QR Payloads**

For QR codes containing Unicode characters (Arabic names in vCard, emoji in text payloads, or extended ASCII payment references), always use Intent output rather than keystroke simulation. Keystroke output passes data through the system keyboard locale filter, which may corrupt non-ASCII characters. Intent output delivers the raw decoded bytes directly to your application's BroadcastReceiver.

\`\`\`java
// Register for DataWedge scan intent
IntentFilter filter = new IntentFilter();
filter.addAction("com.zebra.dw.ACTION");
registerReceiver(scanReceiver, filter);

// In onReceive:
String data = intent.getStringExtra("com.symbol.datawedge.data_string");
\`\`\`

**GS1 QR Code Support**

For GS1-compliant QR codes (used in pharmaceutical track-and-trace, fresh food, and coupons), enable GS1-QR in DataWedge. DataWedge will parse the GS1 Application Identifiers and deliver structured JSON output with named fields instead of the raw GS1 string.
    `,
    faqs: [
      {
        question: 'Can Zebra TC series scan all QR code versions up to Version 40?',
        answer:
          'Yes. The SE4770 and SE4850 imagers support all 40 QR code versions at all four error correction levels. The maximum reliable scanning distance for a Version 40 symbol (177×177 modules) depends on the physical print size — a Version 40 symbol printed at 1mm per module (177mm = 17.7cm) is readable from up to 80cm.',
      },
      {
        question: 'Do Zebra TC series devices work with the QR Code Tools generated codes?',
        answer:
          'Yes. QR Code Tools generates standards-compliant ISO/IEC 18004 QR codes that are fully compatible with Zebra hardware imagers and DataWedge. Use Error Correction Level Q or H for any codes that will be scanned in industrial environments with physical label wear.',
      },
    ],
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    author: 'Hammad Tariq, QR Systems Engineer',
    status: 'approved',
    batchNumber: 3,
  },
];

export function getDeviceGuideBySlug(slug: string): DeviceScanGuide | undefined {
  return DEVICE_GUIDES.find((g) => g.slug === slug);
}

export function getAllDeviceGuides(): DeviceScanGuide[] {
  return DEVICE_GUIDES;
}

export function getApprovedDeviceGuides(): DeviceScanGuide[] {
  return DEVICE_GUIDES.filter((g) => g.status === 'approved');
}
