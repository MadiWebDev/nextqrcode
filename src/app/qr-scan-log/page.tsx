'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotebookPen, Download, Trash2 } from 'lucide-react';

type Verdict = 'safe' | 'suspicious' | 'blocked';

interface Entry {
  id: string;
  at: string;
  payload: string;
  location: string;
  verdict: Verdict;
}

const STORAGE_KEY = 'qr-scan-log-entries-v1';

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is Entry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as Entry).id === 'string' &&
        typeof (e as Entry).payload === 'string' &&
        typeof (e as Entry).at === 'string'
    );
  } catch {
    return [];
  }
}

function toCsv(entries: Entry[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [['Date', 'Payload', 'Location note', 'Verdict'].map(esc).join(',')];
  for (const e of entries) lines.push([e.at, e.payload, e.location, e.verdict].map(esc).join(','));
  return lines.join('\r\n');
}

const VERDICT_LABEL: Record<Verdict, string> = {
  safe: 'Safe',
  suspicious: 'Suspicious',
  blocked: 'Blocked',
};

const FAQS = [
  {
    question: 'Where is this log stored?',
    answer:
      'In your own browser, using localStorage on this device. Nothing is uploaded or synced. Clearing your browser storage, using a private window, or switching devices will lose or hide the log — export a CSV copy if the record matters.',
  },
  {
    question: 'What is worth logging about a QR scan?',
    answer:
      'The payload or destination, where you saw the code, when you scanned it, and your verdict. That combination is what makes the log useful later: it lets you spot a code that keeps reappearing, a location that keeps producing suspicious codes, or a destination that changed.',
  },
  {
    question: 'How should I judge a scan safe or suspicious?',
    answer:
      'Safe means the destination matched what you expected and behaved normally. Suspicious means something was off — an unexpected redirect, a lookalike domain, a login prompt you did not expect, or a code in a place it did not belong. Blocked means you stopped before opening it. When in doubt, log it as suspicious; you can revise it later.',
  },
  {
    question: 'Should a scan log contain passwords or personal data?',
    answer:
      'No. Log the payload and the context, never credentials, tokens, or personal details. A log that contains secrets becomes a target of its own. If a payload itself contains sensitive data, log a description of it instead of the full text.',
  },
];

export default function QRScanLogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [payload, setPayload] = useState('');
  const [location, setLocation] = useState('');
  const [verdict, setVerdict] = useState<Verdict>('safe');
  const [filter, setFilter] = useState<'all' | Verdict>('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setEntries(loadEntries());
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!loaded) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch {
        setNotice('Browser storage is full or unavailable — new entries may not persist.');
      }
    });
    return () => cancelAnimationFrame(id);
  }, [entries, loaded]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (filter !== 'all' && e.verdict !== filter) return false;
      if (q && !`${e.payload} ${e.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, filter, search]);

  const addEntry = () => {
    if (!payload.trim()) {
      setNotice('Enter the scanned payload or destination first.');
      return;
    }
    const entry: Entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      payload: payload.trim(),
      location: location.trim(),
      verdict,
    };
    setEntries((list) => [entry, ...list]);
    setPayload('');
    setLocation('');
    setNotice('Entry logged.');
  };

  const removeEntry = (id: string) => setEntries((list) => list.filter((e) => e.id !== id));
  const clearAll = () => {
    setEntries([]);
    setNotice('Log cleared.');
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-scan-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(() => {
    const c: Record<Verdict, number> = { safe: 0, suspicious: 0, blocked: 0 };
    for (const e of entries) c[e.verdict] += 1;
    return c;
  }, [entries]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Scan Log',
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
          { label: 'QR Scan Log', href: '/qr-scan-log' },
        ]}
      />
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <NotebookPen className="w-3.5 h-3.5" />
          <span>Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Scan Log
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Log your own QR scans locally in your browser: date, payload, location note, and your
          verdict. Filter the log, export it as CSV, and keep a record of the codes you have trusted
          — and the ones you did not.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Log a scan</h2>
            <div className="space-y-1.5">
              <Label htmlFor="log-payload">Scanned payload or destination</Label>
              <Input
                id="log-payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Example: https://example.com/menu — never log passwords or tokens.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-location">Location note</Label>
              <Input
                id="log-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">Example: Cafe window, Main Street</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Your verdict
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(VERDICT_LABEL) as Verdict[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVerdict(v)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold ${verdict === v ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    {VERDICT_LABEL[v]}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={addEntry} className="w-full">
              Add log entry
            </Button>
            {notice && <p className="text-xs text-muted-foreground">{notice}</p>}
            <p className="text-xs text-muted-foreground">
              Stored only in this browser (localStorage). Export a CSV copy if the record matters.
            </p>
          </Card>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Your log</h2>
              <p className="text-xs text-muted-foreground">
                {entries.length} total — {counts.safe} safe · {counts.suspicious} suspicious ·{' '}
                {counts.blocked} blocked
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | Verdict)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-label="Filter by verdict"
              >
                <option value="all">All verdicts</option>
                <option value="safe">Safe</option>
                <option value="suspicious">Suspicious</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No entries match. Log your first scan on the left.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Date</th>
                      <th className="py-2 pr-3 font-semibold">Payload</th>
                      <th className="py-2 pr-3 font-semibold">Location</th>
                      <th className="py-2 pr-3 font-semibold">Verdict</th>
                      <th className="py-2 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className="border-t border-border/50 align-top">
                        <td className="py-2 pr-3 whitespace-nowrap">
                          {new Date(e.at).toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 font-mono break-all max-w-[220px]">{e.payload}</td>
                        <td className="py-2 pr-3">{e.location || '—'}</td>
                        <td className="py-2 pr-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${e.verdict === 'safe' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : e.verdict === 'suspicious' ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}
                          >
                            {VERDICT_LABEL[e.verdict]}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry(e.id)}
                            aria-label="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Export filtered as CSV
              </Button>
              <Button size="sm" variant="outline" onClick={clearAll} className="gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Clear log
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Why keep a log of QR codes you scan</h2>
        <p className="text-base leading-relaxed">
          A single QR scan is a forgettable moment. A log of scans is a memory. Most people cannot
          say what they scanned last week, where they saw it, or whether the destination behaved
          oddly. That amnesia is exactly what a swapped code relies on: the same sticker, in the
          same place, quietly redirecting scanners for weeks while nobody connects the dots. A log
          turns isolated moments into a pattern — the same suspicious destination appearing at two
          locations, a code that changed its behaviour, a venue whose codes keep turning hostile.
        </p>
        <p className="text-base leading-relaxed">
          The verdict is the most valuable field. Safe, suspicious, and blocked are judgements you
          make in the moment, when the context is fresh: the code was where you expected it, the
          page matched the promise, the redirect felt wrong, the login prompt arrived uninvited.
          Record the judgement even when you are unsure — especially when you are unsure. A
          suspicious entry you later revise is still more useful than a blank you cannot
          reconstruct. Over time, your own log becomes a personal reputation database for the places
          and senders whose codes you encounter.
        </p>
        <p className="text-base leading-relaxed">
          For teams, a shared habit of logging is even more powerful. Facilities staff who log the
          codes they inspect, marketing staff who log the codes they publish, and support staff who
          log the codes customers report create a record that makes incidents tractable. When a
          customer reports a malicious code on a poster, the log answers the questions that
          otherwise take days: when was it last checked, what did it point at, who owned it, and
          which other codes share the same destination.
        </p>
        <p className="text-base leading-relaxed">
          Keep the log honest and lean. Record the payload and the context, and never record
          credentials, tokens, or personal details — a log full of secrets becomes a target of its
          own. If a payload itself contains sensitive data, log a description instead of the full
          text. Export a CSV copy when the record matters, because browser storage is local,
          fragile, and tied to one device. And review the log on a schedule: suspicious entries
          deserve follow-up, blocked entries deserve a second look, and safe entries deserve a quiet
          confidence that your codes are behaving.
        </p>
        <p className="text-base leading-relaxed">
          The deeper habit is the point. Logging a scan takes ten seconds, and it changes how you
          look at codes: from passive scanning to active noticing. You start to see the sticker that
          was not there yesterday, the code whose frame does not match, the destination that
          drifted. That attention is the real defence — the log is just where it accumulates.
        </p>
      </article>

      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About QR Scan Logs
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
    </div>
  );
}
