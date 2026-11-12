import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BulkClient } from './BulkClient';
import { AdSlot } from '@/components/AdSlot';
import { RelatedTools } from '@/components/seo/RelatedTools';

const BULK_FAQS = [
  {
    question: 'What CSV format does the bulk generator accept?',
    answer:
      'Two formats, one row per line. Either a bare payload per line (files are named qr-1, qr-2, …), or CSV with payload,filename columns — the split happens on the first comma and surrounding double quotes are stripped. Empty lines are skipped. There is no file upload: paste the text straight from your spreadsheet.',
  },
  {
    question: 'Why is there a 500-code limit?',
    answer:
      'Generation happens in a Web Worker on your own device, so the limit keeps a batch comfortably within the memory and time a browser tab can spare. For more than 500 codes, run several batches — for example one per product line or location — which also keeps the ZIPs manageable.',
  },
  {
    question: 'Is my data uploaded to a server?',
    answer:
      'No. The list you paste is processed entirely in your browser: a Web Worker renders each code, the ZIP is assembled locally with JSZip, and the download is generated from a blob on your device. Closing the tab removes everything.',
  },
  {
    question: 'What happens if some rows fail to generate?',
    answer:
      'A row fails when its payload cannot be encoded as a QR code — almost always because the text is too long for QR capacity. Failed rows are counted and skipped; every successful code still lands in the ZIP, and the tool reports exactly how many failed so you can shorten those payloads and re-run just them.',
  },
  {
    question: 'Should I choose PNG or SVG for printing?',
    answer:
      'SVG is a vector format that scales to any print size without blurring, so choose it for labels, packaging and signage produced by a designer or print shop. PNG is a fixed-size raster (you set 128–1,024 pixels); choose it for documents, slides, emails and web use, at a size at least twice the final printed size in pixels.',
  },
];


export const metadata: Metadata = {
  title: 'Bulk QR Code Generator — CSV to ZIP',
  description:
    'Generate up to 500 QR codes at once from a list of payloads. Paste text or CSV with payload,filename columns, choose PNG or SVG, and download everything as a ZIP. 100% in-browser — your data never leaves your device.',
  alternates: { canonical: `${siteConfig.url}/bulk-generator` },
  openGraph: {
    title: 'Bulk QR Code Generator — CSV to ZIP',
    description:
      'Generate up to 500 QR codes at once, download them as a ZIP. Runs entirely in your browser.',
    url: `${siteConfig.url}/bulk-generator`,
  },
};

export default function BulkGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/#tools' },
          { name: 'Bulk QR Generator', url: '/bulk-generator' },
        ]}
        baseUrl={siteConfig.url}
      />
      <Breadcrumbs items={[{ label: 'Bulk QR Generator', href: '/bulk-generator' }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Bulk QR Code Generator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Turn a list of URLs, text, or WiFi credentials into QR codes in one shot. Paste your rows,
          pick PNG or SVG with your error-correction level, and download a ready-to-use{' '}
          <code className="text-foreground">qr-bulk.zip</code>. Everything runs locally in your
          browser.
        </p>
      </header>
      <BulkClient />
      <AdSlot id="bulk-generator-after-tool" format="horizontal-banner" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: BULK_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">How bulk generation works</h2>
        <p className="text-muted-foreground leading-relaxed">
          Paste your list, choose a format, and press Generate. Your rows are handed to a Web Worker
          — a background thread in the browser — which renders one QR code at a time and reports
          progress back as it goes, so the page stays responsive even on a 500-row batch. When
          rendering finishes, the results are packed into a single ZIP archive (assembled locally
          with JSZip) and offered as <code className="text-foreground">qr-bulk.zip</code>. Nothing
          is uploaded: the payloads you paste, the images generated and the ZIP itself never leave
          your device. That makes the tool safe for lists you would not paste into a random server —
          internal asset URLs, unreleased product links, or per-guest WiFi credentials.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Every row is independent. One bad row does not stop the batch: it is counted as failed,
          skipped, and reported in the final tally, while every successful row is written into the
          ZIP under its own filename. Rows keep the order of your input, so file order in the
          archive matches your spreadsheet.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Input format, precisely</h2>
        <p className="text-muted-foreground leading-relaxed">
          The input box accepts one row per line, in either of two shapes. A bare payload per line
          gets an automatic filename (<code className="text-foreground">qr-1</code>,{' '}
          <code className="text-foreground">qr-2</code>, …). A CSV row of{' '}
          <code className="text-foreground">payload,filename</code> is split on the first comma — so
          payloads may themselves contain commas after the first one only inside the filename side;
          keep URLs comma-free or put them in bare-payload form. Surrounding double quotes around
          either field are stripped, which means output pasted from most spreadsheet exports works
          as-is. Filenames are sanitised before use: anything that is not a letter, number or dash
          becomes a dash, runs of dashes collapse, and names are truncated to 60 characters. If two
          rows end up with the same filename, the later one gets its row number appended, so no file
          ever silently overwrites another inside the ZIP.
        </p>
        <pre className="text-sm bg-muted rounded-xl p-4 overflow-x-auto">{`https://example.com/menu,main-menu
https://example.com/promo,summer-promo
WIFI:T:WPA;S:CafeGuest;P:coffee123;;,cafe-wifi
Just a plain text payload`}</pre>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>Paste your rows, or press “Load sample” to see the format with working examples.</li>
          <li>
            Choose PNG or SVG, the pixel size for PNG (128–1,024 px), and an error-correction level.
          </li>
          <li>Press “Generate QR codes” and watch the progress bar count through your rows.</li>
          <li>
            Download <code className="text-foreground">qr-bulk.zip</code> and unpack it wherever the
            codes are needed.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Specifications and limits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border/70 rounded-xl overflow-hidden">
            <tbody className="[&_td]:border-b [&_td]:border-border/50 [&_td]:px-4 [&_td]:py-2.5 align-top">
              <tr>
                <td className="font-semibold text-foreground w-44">Batch size</td>
                <td className="text-muted-foreground">1 to 500 rows per run</td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Input</td>
                <td className="text-muted-foreground">
                  Pasted text: one payload per line, or CSV payload,filename per line; empty lines
                  skipped
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Formats</td>
                <td className="text-muted-foreground">PNG (raster) or SVG (vector)</td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">PNG size</td>
                <td className="text-muted-foreground">
                  128–1,024 px, in 64 px steps; 512 px by default
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Error correction</td>
                <td className="text-muted-foreground">
                  L (7% recovery), M (15%, default), Q (25%) or H (30%)
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Filenames</td>
                <td className="text-muted-foreground">
                  Sanitised to letters, numbers and dashes, max 60 characters; duplicates are
                  suffixed with the row number instead of overwriting
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-foreground">Output</td>
                <td className="text-muted-foreground">
                  One ZIP named qr-bulk.zip containing one file per successful row
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Choosing the right settings</h2>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Format.</strong> Pick SVG whenever the codes are
          headed for print production — it scales cleanly from a 15&nbsp;mm asset label to a poster.
          Pick PNG for screens, documents and quick sharing, and set the size generously: a code
          printed at 30&nbsp;mm should be generated at 512&nbsp;px or more so the print stays crisp.{' '}
          <strong className="text-foreground">Error correction.</strong> Higher levels survive more
          damage — scratches, dirt, a logo placed over the centre — but pack the same data into a
          denser grid. Use M for clean indoor labels, Q for warehouse and outdoor use, and H when
          codes will be handled roughly or partially covered. Use L only for short payloads shown on
          screens. <strong className="text-foreground">Payload length.</strong> Short payloads scan
          faster at any size. If a row points to a long URL, consider whether every query parameter
          earns its place before generating five hundred dense codes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Real use cases</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Asset and inventory labels.</strong> Export your
            asset register&apos;s URL column, paste it with the asset IDs as filenames, and print
            the resulting codes as labels — every label scans straight to that item&apos;s record.
          </li>
          <li>
            <strong className="text-foreground">Event badges and table tents.</strong> Generate a
            check-in code per attendee from the registration list, or a menu/feedback code per
            table, each named so the print shop can match file to person or table without a key.
          </li>
          <li>
            <strong className="text-foreground">Multi-location WiFi.</strong> One row per branch
            with that branch&apos;s SSID and password in the standard WIFI payload format produces a
            sign-ready code per location in a single run.
          </li>
          <li>
            <strong className="text-foreground">Product inserts at scale.</strong> A different
            manual, warranty or setup link per SKU becomes one named file per SKU, ready to drop
            into the packaging artwork.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">“Too many rows.”</strong> The batch cap is 500.
            Split the list into chunks — the row counter under the input box shows how many rows
            were detected before you run.
          </li>
          <li>
            <strong className="text-foreground">Some rows failed.</strong> The done message reports
            the failure count. The usual cause is a payload longer than QR capacity allows; shorten
            those payloads (or drop tracking parameters) and re-run only the failed rows.
          </li>
          <li>
            <strong className="text-foreground">Filenames look different than typed.</strong>{' '}
            Spaces, underscores and punctuation are converted to dashes and names are capped at 60
            characters, so files are safe on every operating system and print pipeline.
          </li>
          <li>
            <strong className="text-foreground">The worker failed to start.</strong> Very old
            browsers or strict extension blocking can prevent Web Workers; reload the page or try a
            current browser.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-4">
          {BULK_FAQS.map((f) => (
            <div key={f.question} className="border border-border/70 rounded-xl p-4 bg-card">
              <dt className="font-semibold text-foreground">{f.question}</dt>
              <dd className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <RelatedTools currentPath="/bulk-generator" />
    </div>
  );
}

