'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { AdSlot } from '@/components/AdSlot';

type EcLevel = 'L' | 'M' | 'Q' | 'H';

interface Check {
  label: string;
  detail: string;
  status: 'pass' | 'warn' | 'fail';
}

const SELF_TEST = [
  'Print the code at the size it will really be used, with its white margin intact.',
  'Scan it with the oldest phone your audience might use, not just the newest.',
  'Scan it at the real distance: arm length for a card, a step back for a poster.',
  'Scan it in the real light: dim room, sunlight, and through glass if it will sit behind any.',
  'Scan it after lamination or protective film is applied.',
  'Scan it from a slight angle, as a passerby would.',
  'Confirm the destination page loads on a slow mobile connection.',
  'Confirm the printed text beside the code matches the destination.',
];

const FAQS = [
  {
    question: 'Does passing these offline checks guarantee the code will scan?',
    answer:
      'No. Offline checks catch encoding mistakes — empty payloads, illegal characters, excessive length, and damaged structure. Real scannability also depends on print size, contrast, lighting, and camera quality, which is why the self-test checklist on this page matters as much as the automated checks.',
  },
  {
    question: 'Which error-correction level should I use?',
    answer:
      'Level M suits most clean print work. Level Q or H suits codes that will be handled roughly, printed on textured stock, or covered with a logo, because they tolerate more damage. Higher levels make the code denser, so a very long payload at level H may need a larger print size.',
  },
  {
    question: 'Why does a long URL make a QR code harder to scan?',
    answer:
      'More characters mean more modules — the small squares in the grid. More modules at the same print size means smaller squares, which are harder for cameras to resolve. Shortening the URL, or linking through a short redirect you control, reduces density and improves scanning.',
  },
  {
    question: 'What is the white margin around a QR code for?',
    answer:
      'It is the quiet zone, and scanners use it to find the edges of the code. The quiet zone must be at least four modules wide on every side. Cropping it, or letting text or graphics touch the finder squares, is one of the most common causes of scan failure.',
  },
];

export default function QROfflineVerifierPage() {
  const [payload, setPayload] = useState('');
  const [ecLevel, setEcLevel] = useState<EcLevel>('M');
  const [checked, setChecked] = useState<boolean[]>(SELF_TEST.map(() => false));

  const checks = useMemo<Check[]>(() => {
    const list: Check[] = [];
    if (!payload) {
      list.push({
        label: 'Payload is present',
        detail: 'Enter a payload to verify it.',
        status: 'fail',
      });
      return list;
    }
    list.push({
      label: 'Payload is present',
      detail: `${payload.length} character(s) entered.`,
      status: 'pass',
    });
    const byteLength = new TextEncoder().encode(payload).length;
    if (byteLength !== payload.length) {
      list.push({
        label: 'Encoding',
        detail: `Contains non-ASCII characters; encoded as ${byteLength} UTF-8 bytes. Some older scanners handle non-ASCII text poorly.`,
        status: 'warn',
      });
    } else {
      list.push({
        label: 'Encoding',
        detail: 'Plain ASCII text — readable by the widest range of scanners.',
        status: 'pass',
      });
    }
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(payload)) {
      list.push({
        label: 'Control characters',
        detail:
          'Contains control characters, which can confuse some scanners and text handling. Remove them if possible.',
        status: 'warn',
      });
    } else {
      list.push({
        label: 'Control characters',
        detail: 'No control characters found.',
        status: 'pass',
      });
    }
    if (/^\s|\s$/.test(payload)) {
      list.push({
        label: 'Leading / trailing whitespace',
        detail:
          'Starts or ends with whitespace, which scanners may trim or preserve inconsistently. Trim the payload.',
        status: 'warn',
      });
    } else {
      list.push({
        label: 'Leading / trailing whitespace',
        detail: 'No leading or trailing whitespace.',
        status: 'pass',
      });
    }
    let versionNote = 'Could not build a QR symbol from this payload.';
    let versionStatus: 'pass' | 'warn' | 'fail' = 'fail';
    let densityNote = '';
    try {
      const qr = QRCodeLib.create(payload, { errorCorrectionLevel: ecLevel });
      const size = qr.modules.size;
      const version = (size - 17) / 4;
      versionNote = `Encodes as QR version ${version} (${size} × ${size} modules) at error-correction level ${ecLevel}.`;
      versionStatus = 'pass';
      if (version >= 20) {
        densityNote = 'Very dense symbol — print it large and test on a budget phone.';
        versionStatus = 'warn';
      } else if (version >= 12) {
        densityNote = 'Dense symbol — allow generous print size.';
      }
    } catch {
      versionNote =
        'This payload is too long to encode at the chosen error-correction level. Shorten it or lower the level.';
    }
    list.push({
      label: 'QR symbol build',
      detail: versionNote + (densityNote ? ` ${densityNote}` : ''),
      status: versionStatus,
    });
    if (/^https?:\/\//i.test(payload)) {
      try {
        const u = new URL(payload);
        list.push({
          label: 'URL structure',
          detail: `Valid URL on host ${u.hostname} with ${u.protocol === 'https:' ? 'HTTPS' : 'plain HTTP'}. ${u.protocol === 'https:' ? '' : 'Prefer HTTPS for anything visitors will trust.'}`,
          status: u.protocol === 'https:' ? 'pass' : 'warn',
        });
      } catch {
        list.push({
          label: 'URL structure',
          detail: 'Starts like a URL but does not parse. Check for spaces or illegal characters.',
          status: 'fail',
        });
      }
    }
    if (payload.length > 2000) {
      list.push({
        label: 'Length',
        detail:
          'Very long payload. Consider a short link you control instead of encoding the full text.',
        status: 'warn',
      });
    }
    return list;
  }, [payload, ecLevel]);

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const doneCount = checked.filter(Boolean).length;

  const toggleCheck = (i: number) => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Offline Verifier',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'QR Offline Verifier', href: '/qr-offline-verifier' },
        ]}
      />

      <AdSlot id="qr-offline-verifier-top" format="horizontal-banner" />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Offline Verifier
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Verify a QR payload without any network request: format checks, length, encoding, a real
          QR symbol build that reports the version and module count, and a scannability self-test
          checklist. Everything runs in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">1. Enter the payload</h2>
            <div className="space-y-1.5">
              <Label htmlFor="verify-payload">Exact payload text</Label>
              <Textarea
                id="verify-payload"
                rows={4}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/welcome
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Error-correction level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as EcLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEcLevel(level)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold ${ecLevel === level ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                L tolerates the least damage; H tolerates the most but makes a denser code.
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">2. Scannability self-test checklist</h2>
            <p className="text-xs text-muted-foreground">
              {doneCount} of {SELF_TEST.length} checks done.
            </p>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(doneCount / SELF_TEST.length) * 100}%` }}
              />
            </div>
            {SELF_TEST.map((item, i) => (
              <label key={i} className="flex items-start gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => toggleCheck(i)}
                  className="mt-0.5"
                />
                <span className={checked[i] ? 'line-through text-muted-foreground' : ''}>
                  {item}
                </span>
              </label>
            ))}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">Verification result</h2>
            <p className="text-xs text-muted-foreground">
              {passCount} of {checks.length} automated checks pass.
            </p>
            {checks.map((c, i) => (
              <div key={i} className="rounded-lg border border-border/70 p-3">
                <p className="text-xs font-semibold flex gap-2 items-start">
                  {c.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : c.status === 'warn' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  {c.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 ml-6">
                  {c.detail}
                </p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              These checks run entirely offline. They verify the payload, not the printed code —
              finish the self-test checklist for the physical half of the job.
            </p>
          </Card>
        </div>
      </div>

      <AdSlot id="qr-offline-verifier-after-tool" format="horizontal-banner" />

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          What offline verification can and cannot prove
        </h2>
        <p className="text-base leading-relaxed">
          Offline verification answers a narrow but important question: is this payload well-formed
          and encodable? A payload with a typo, a stray control character, or a length that exceeds
          the symbol&apos;s capacity will fail here before it fails in front of a customer. The
          symbol build on this page is a real one — it constructs the QR matrix and reports the
          version and module count — so a payload that cannot be encoded at your chosen
          error-correction level is caught honestly, in your browser, with no network involved.
        </p>
        <p className="text-base leading-relaxed">
          Density is the finding most people overlook. A short URL encodes as a low-version symbol
          with large, forgiving modules. A long URL with tracking parameters encodes as a dense grid
          of small modules that demand a larger print size and a better camera. When the verifier
          reports a high version number, treat it as a design instruction: either shorten the
          payload — a short redirect you control is the usual fix — or print the code larger and
          test it on the weakest phone your audience uses. Density is not a defect, but it raises
          the price of every other mistake.
        </p>

        <AdSlot id="qr-offline-verifier-in-content" format="in-article" />

        <p className="text-base leading-relaxed">
          Encoding pitfalls are subtler. Plain ASCII text is the safest payload: every scanner
          handles it. Non-ASCII characters — accented letters, emoji, non-Latin scripts — encode as
          UTF-8 bytes and lengthen the payload, and some older scanners handle them poorly. Test
          non-ASCII payloads on real devices before printing. Leading and trailing whitespace is
          another quiet failure: some scanners trim it, some preserve it, and a URL with a trailing
          space can break in ways that are invisible on the printed page. Trim payloads, and compare
          the decoded text against the intended text character by character.
        </p>
        <p className="text-base leading-relaxed">
          Error-correction level is a trade-off, not a quality score. Level L produces the least
          dense symbol for a given payload, which scans most easily on a clean print. Level H
          tolerates the most damage — scuffs, lamination, a logo in the centre — but makes the
          symbol denser. Match the level to the environment: clean indoor print gets M, rough
          handling and textured stock get Q or H, and anything with a logo overlay needs H plus a
          larger print size and a physical test.
        </p>
        <p className="text-base leading-relaxed">
          None of this proves the printed code scans, which is why the self-test checklist exists.
          Print at the real size, with the real margin, on the real stock, and scan it at the real
          distance in the real light with the worst phone you can find. Check it after lamination,
          after mounting behind glass, and from a slight angle. A payload can be perfect and a
          printed code can still fail — verification is two halves, and the physical half is the one
          most teams skip.
        </p>
      </article>

      <AdSlot id="qr-offline-verifier-pre-related" format="horizontal-banner" />

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Offline Verification
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot id="qr-offline-verifier-bottom" format="horizontal-banner" />

    </div>
  );
}
