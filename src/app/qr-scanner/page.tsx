import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ScannerClient } from './ScannerClient';
import { AdSlot } from '@/components/AdSlot';
import { RelatedTools } from '@/components/seo/RelatedTools';

const SCANNER_FAQS = [
  {
    question: 'Is this QR scanner private? Where do my scans go?',
    answer:
      'Nowhere. Decoding runs entirely in your browser using the jsQR library — the camera frames and any image you upload are processed on your device and are never sent to a server. You can verify this by loading the page, switching your device offline, and scanning: it still works.',
  },
  {
    question: 'Does the scanner open links automatically?',
    answer:
      'No. When a code contains a URL, the scanner shows you the destination host, the full URL, and any safety warnings first. The link only opens if you explicitly tap “Open link”, and you can copy the text instead if you would rather inspect it elsewhere.',
  },
  {
    question: 'Which code types can this scanner read?',
    answer:
      'It reads standard QR codes (the square two-dimensional codes used for links, WiFi credentials, contact cards and payments). It does not decode one-dimensional barcodes such as UPC or EAN — the decoder is QR-only by design, which keeps it fast and accurate for the codes people meet every day.',
  },
  {
    question: 'Why does it say “No QR code found in this image”?',
    answer:
      'The usual causes are a blurry or low-resolution photo, glare across the code, the quiet-zone margin being cropped out, or the code being too small in the frame. Retake the photo straight-on, fill more of the frame with the code, avoid flash reflections, and make sure the full code including its blank border is visible.',
  },
  {
    question: 'Can I scan a QR code from a screenshot or a photo on my phone?',
    answer:
      'Yes. Use the “Upload image” tab and choose the screenshot or photo. The image is scaled down to at most 1,600 pixels on its longest side before decoding, which is still far more detail than a QR decoder needs, and the file never leaves your device.',
  },
];


export const metadata: Metadata = {
  title: 'QR Code Scanner — Read QR Codes with Camera or Image',
  description:
    'Free online QR code scanner. Scan QR codes with your camera or upload an image. URL safety check included — shortener, HTTP and lookalike-domain warnings. 100% private, in-browser decoding.',
  alternates: { canonical: `${siteConfig.url}/qr-scanner` },
  openGraph: {
    title: 'QR Code Scanner — Read QR Codes with Camera or Image',
    description:
      'Scan QR codes with your camera or upload an image. Built-in URL safety check. Everything runs in your browser.',
    url: `${siteConfig.url}/qr-scanner`,
  },
};

export default function QrScannerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/#tools' },
          { name: 'QR Scanner', url: '/qr-scanner' },
        ]}
        baseUrl={siteConfig.url}
      />
      <Breadcrumbs items={[{ label: 'QR Scanner', href: '/qr-scanner' }]} />

      <AdSlot id="qr-scanner-top" format="horizontal-banner" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground max-w-2xl">
          Read any QR code with your camera or by uploading an image. If the code contains a link,
          you&apos;ll see a safety analysis of the destination before you decide to open it —
          nothing is ever opened automatically.
        </p>
      </header>
      <ScannerClient />

      <AdSlot id="qr-scanner-after-tool" format="horizontal-banner" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: SCANNER_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">How this scanner works</h2>
        <p className="text-muted-foreground leading-relaxed">
          The scanner uses the open-source jsQR decoder, running entirely in your browser. With the
          camera method, each video frame is copied to an off-screen canvas and jsQR looks for the
          three finder patterns that mark a QR code&apos;s corners. Once it locates them, it samples
          the module grid, undoes the data mask, and runs Reed–Solomon error correction to recover
          the payload — the same mathematics your phone&apos;s built-in scanner uses. Scanning stops
          automatically the moment a code is decoded, and the camera stream is switched off. With
          the upload method, your image is drawn to a canvas (scaled so its longest side is at most
          1,600 pixels) and decoded the same way. At no point is any frame, image or result
          transmitted anywhere: there is no server component to this tool at all.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          What you do next depends on the payload. If it is a web address, you get a safety analysis
          (detailed below) and a choice: open the link, or copy it and inspect it somewhere else. If
          it is anything else — plain text, WiFi credentials, a contact card, a payment string — the
          decoded text is shown in full so you can copy it exactly as encoded.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Step by step</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Camera:</strong> open the Camera tab and choose
            “Start camera scan”. Your browser will ask for camera permission; allow it, then hold
            the QR code steady inside the frame. The rear camera is requested automatically on
            phones. The scan finishes by itself when a code is found.
          </li>
          <li>
            <strong className="text-foreground">Image:</strong> open the Upload image tab and pick a
            photo, screenshot or scan that contains the code. Cropping tightly around the code
            (while keeping its blank border) gives the most reliable result.
          </li>
          <li>
            <strong className="text-foreground">Review:</strong> read the decoded result. For a
            link, check the destination host and every safety warning before deciding. For text,
            verify it matches what you expected.
          </li>
          <li>
            <strong className="text-foreground">Act:</strong> open the link only if you trust it, or
            copy the payload for use elsewhere. “Scan again” resets everything and stops the camera.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">The URL safety check, exactly</h2>
        <p className="text-muted-foreground leading-relaxed">
          QR codes hide their destination until you scan them, which is why “quishing” (QR phishing)
          works. This scanner never opens a link for you, and for every URL it runs five concrete
          checks and shows a warning for each one that triggers:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">URL shorteners</strong> — the host is matched
            against known shorteners (bit.ly, tinyurl.com, t.co, goo.gl, is.gd, buff.ly, ow.ly and
            short.link, including their subdomains), because a short link hides the real destination
            until you visit it.
          </li>
          <li>
            <strong className="text-foreground">Not HTTPS</strong> — a plain-HTTP destination means
            anything you type on that page travels unencrypted, so passwords and payment details are
            at risk.
          </li>
          <li>
            <strong className="text-foreground">Punycode hosts</strong> — a host containing{' '}
            <code className="text-foreground">xn--</code> encodes non-Latin characters and may be
            impersonating a trusted site.
          </li>
          <li>
            <strong className="text-foreground">Non-Latin characters</strong> — internationalised
            characters in the domain are a classic lookalike technique, swapping a Latin letter for
            an identical-looking one from another alphabet.
          </li>
          <li>
            <strong className="text-foreground">Lookalike letter pairs</strong> — combinations such
            as <code className="text-foreground">rn</code>,{' '}
            <code className="text-foreground">vv</code>, <code className="text-foreground">cl</code>
            , <code className="text-foreground">0o</code> and{' '}
            <code className="text-foreground">1l</code> in the host suggest a typosquat domain
            designed to be misread at a glance.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          “Looks clean” means none of these five checks triggered — it is not a guarantee that a
          site is safe, and a warning is not proof of fraud. Treat the result as evidence, and judge
          it against context: a short link on a poster from a known business is different from the
          same link on a sticker covering a parking meter&apos;s original code.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Specifications and limits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border/70 rounded-xl overflow-hidden">
            <tbody className="[&_td]:border-b [&_td]:border-border/50 [&_td]:px-4 [&_td]:py-2.5 align-top">
              <tr>
                <td className="font-semibold text-foreground w-44">Symbology</td>
                <td className="text-muted-foreground">QR codes only (decoded locally with jsQR)</td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Inputs</td>
                <td className="text-muted-foreground">
                  Device camera (rear camera preferred on mobile) or an uploaded image file
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Image handling</td>
                <td className="text-muted-foreground">
                  Uploaded images are scaled to a maximum of 1,600 px on the longest side before
                  decoding; the original file is not stored or sent anywhere
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Output</td>
                <td className="text-muted-foreground">
                  The decoded payload: a URL with host display and safety warnings, or the full
                  decoded text with a copy button
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Automatic actions</td>
                <td className="text-muted-foreground">
                  None. Links are never opened, dialled or acted on without your explicit tap
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Requirements</td>
                <td className="text-muted-foreground">
                  A browser with camera access (getUserMedia) on a secure (HTTPS) page for camera
                  scanning; image upload works in any modern browser
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Real use cases</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Checking a code before you trust it.</strong> A
            sticker on a parking meter, a code taped to a restaurant window, a “pay here” sign in a
            car park — scan it here first and read the real destination instead of being taken there
            blind.
          </li>
          <li>
            <strong className="text-foreground">Proofing your own printed codes.</strong> Before a
            print run of flyers, labels or packaging goes out, scan the proof with this tool and
            confirm the payload is character-for-character the URL you intended — including the UTM
            parameters.
          </li>
          <li>
            <strong className="text-foreground">Recovering a link from a photo.</strong> A colleague
            sends a photo of a whiteboard or a conference badge. Upload the image and copy the
            decoded text instead of retyping a long URL by hand.
          </li>
          <li>
            <strong className="text-foreground">
              Reading codes on a desktop with no phone handy.
            </strong>{' '}
            Screenshots, emailed codes and codes displayed on another screen all decode from an
            uploaded image.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Camera permission denied.</strong> Allow camera
            access for this site in your browser settings, or switch to image upload — both methods
            decode identically.
          </li>
          <li>
            <strong className="text-foreground">No camera found / camera busy.</strong> Close other
            apps or tabs using the camera (video calls are the usual culprit) and try again, or
            upload a photo instead.
          </li>
          <li>
            <strong className="text-foreground">Code will not decode.</strong> Move closer so the
            code fills more of the frame, steady the device, wipe glare off glossy prints, and make
            sure the whole code — including the blank quiet zone around it — is in shot. Damaged
            codes may still decode thanks to error correction, but deep scratches through a finder
            pattern defeat any scanner.
          </li>
          <li>
            <strong className="text-foreground">The result is not a link.</strong> Many codes carry
            WiFi credentials, contact cards or plain text. The scanner shows the full decoded text
            so you can use it manually — for a WiFi payload, for example, the network name and
            password appear after the <code className="text-foreground">S:</code> and{' '}
            <code className="text-foreground">P:</code> markers.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-4">
          {SCANNER_FAQS.map((f) => (
            <div key={f.question} className="border border-border/70 rounded-xl p-4 bg-card">
              <dt className="font-semibold text-foreground">{f.question}</dt>
              <dd className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedTools currentPath="/qr-scanner" />
    </div>
  );
}

