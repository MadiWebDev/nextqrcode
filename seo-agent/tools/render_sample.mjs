/**
 * Rendered-vs-raw word-count sample (Step 1): loads a stratified sample of
 * the 856 not-indexed URLs in headless Chromium and compares the main-content
 * word count of the JS-rendered DOM against the raw-HTML extraction.
 * Run from repo root:  node seo-agent/tools/render_sample.mjs
 * Polite: sequential loads with a delay between pages.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const urls = readFileSync('seo-agent/output/render-sample-urls.txt', 'utf8')
  .split('\n').map(s => s.trim()).filter(Boolean);

const browser = await chromium.launch({ proxy: proxyFromEnv() });

// This environment egresses through a proxy given in env vars; Chromium
// does not inherit it automatically. Credentials are read at runtime and
// never logged or written to disk.
function proxyFromEnv() {
  const raw = process.env.https_proxy || process.env.HTTPS_PROXY;
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return {
      server: `${u.protocol}//${u.host}`,
      username: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
    };
  } catch { return undefined; }
}
const page = await browser.newPage();
const rows = [['url', 'rendered_words', 'rendered_h1', 'title_rendered']];
for (const url of urls) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    try { await page.goto(url, { waitUntil: 'load', timeout: 45000 }); } catch {}
  }
  await page.waitForTimeout(800);
  let data = null;
  for (let attempt = 0; attempt < 3 && !data; attempt++) {
    try {
      data = await page.evaluate(() => {
        // NOTE: innerText on a detached clone is always "" in Chromium
        // (no layout), so hide boilerplate in the live DOM, read, restore.
        const hide = document.querySelectorAll(
          'header,footer,nav,form,iframe,[aria-hidden="true"]');
        hide.forEach(el => { el.dataset._seoPrev = el.style.display; el.style.display = 'none'; });
        const text = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
        hide.forEach(el => { el.style.display = el.dataset._seoPrev || ''; });
        return {
          words: text ? text.split(' ').length : 0,
          h1: document.querySelectorAll('h1').length,
          title: document.title || '',
        };
      });
    } catch { await page.waitForTimeout(1200); }
  }
  if (!data) data = { words: -1, h1: -1, title: 'EVALUATE-FAILED' };
  rows.push([url, data.words, data.h1, JSON.stringify(data.title)]);
  console.log(url, data.words);
  await page.waitForTimeout(600);
}
await browser.close();
writeFileSync('seo-agent/output/render-sample.csv',
  rows.map(r => r.join(',')).join('\n') + '\n');
console.log('wrote seo-agent/output/render-sample.csv');
