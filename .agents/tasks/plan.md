# Implementation Plan: Fix Blog Articles for Content Audit & Sitemap

**Goal:** Fix all articles in `src/lib/pages/Batch1.ts` through `Batch69.ts` (total: 69 batch files) so they pass the content audit requirements and appear correctly in the sitemap.

**Audit Requirements (from scripts/content-audit.ts):**

- ≥400 words in content
- 3–6 unique FAQs (currently many have only 2)
- ≥5 internal links extracted from markdown
- Byline present (already satisfied via helper)
- Last-reviewed date (already satisfied via helper)

**Current Issues (from docs/CONTENT_AUDIT.md):**

- 479 articles have only 2 FAQs (<3 minimum)
- 556 articles have insufficient internal links (<5 minimum)
- 514 articles have too few words (<400 minimum)

**Wiring Status:**

- ✅ `NEW_ARTICLES` in `src/lib/pages/index.ts` correctly aggregates all 69 batches
- ✅ `getAllArticles()` in `src/lib/articles.ts` returns `NEW_ARTICLES`
- ✅ Sitemap (`src/app/sitemap.ts`) calls `auditedBlogArticles()` which filters based on audit manifest
- ✅ No wiring gaps found

---

## Universal Internal Link Targets

These are the site's main static routes extracted from the sitemap and tools (use markdown format in article content: `[text](/path)`):

**Tools:**

- /qr-size-calculator
- /qr-safety-checker
- /qr-scanner
- /bulk-generator
- /printed-qr-tester
- /error-correction-simulator
- /qr-splitter-scanner
- /animated-qr-transfer
- /medical-id-qr
- /wifi-sign-generator
- /pakistan-payment-qr
- /regional-payment-qr
- /qr-sticker-sheet-printer
- /pet-tag-qr
- /bulk-vcard-qr
- /utm-builder
- /qr-placement-guide
- /barcode-generator

**Type Generators:**

- /url-qr-code-generator
- /wifi-qr-code-generator
- /vcard-qr-code-generator
- /whatsapp-qr-code-generator
- /upi-qr-code-generator
- /bitcoin-qr-code-generator

**Core Pages:**

- /about
- /contact
- /privacy
- /terms
- /blog

---

## Implementation Steps

- [ ] 1. **Create a batch-processing script to audit and identify issues per article**

      Create `scripts/analyze-batches.ts` that reads each Batch1–69 file, extracts each article, counts:
      - Word count in content
      - FAQ count
      - Internal links (markdown format `[text](/path)`)

      Output a JSON report to `.agents/tasks/batch-analysis.json` mapping each slug to its deficiencies.

      **Files:** `scripts/analyze-batches.ts`

      **Verify:** Run `npx tsx scripts/analyze-batches.ts` and confirm `.agents/tasks/batch-analysis.json` exists with correct counts.

- [ ] 2. **Add third FAQ to all articles with only 2 FAQs**

      For each article in Batch1–69 that has exactly 2 FAQs, add a contextually relevant third FAQ question/answer pair. The new FAQ should:
      - Be unique (not duplicate existing questions in the article)
      - Be relevant to the article topic
      - Follow the pattern of existing FAQs (practical, user-focused questions)

      **Strategy:** Process batches sequentially. For each article with 2 FAQs, read the content, understand the topic, and craft a third FAQ that complements the existing two.

      **Files:** `src/lib/pages/Batch1.ts` through `src/lib/pages/Batch69.ts` (all 69 files)

      **Verify:** Run `npx tsx scripts/analyze-batches.ts` again and confirm no article has fewer than 3 FAQs.

- [ ] 3. **Add ≥5 internal links to article content**

      For each article with fewer than 5 internal markdown links in its content, add links following this pattern:
      - Insert links naturally within existing sentences where contextually relevant
      - Use the universal link targets from the list above
      - Format: `[descriptive text](/path)`
      - Distribute links throughout the content (not all in one paragraph)
      - Priority targets by article category:
        - **Fundamentals:** Link to /qr-size-calculator, /error-correction-simulator, /qr-scanner
        - **Printing & Sizing:** Link to /qr-size-calculator, /printed-qr-tester, /qr-placement-guide
        - **Security & Scanning:** Link to /qr-safety-checker, /qr-scanner
        - **Business & Regional:** Link to /pakistan-payment-qr, /regional-payment-qr, /bulk-generator

      **Strategy:** For each article, identify 5–7 contextually appropriate places to add links. Match tools/generators to the article's subject. Example: an article about WiFi QR codes should link to `/wifi-qr-code-generator`, `/qr-size-calculator`, and `/qr-scanner`.

      **Files:** `src/lib/pages/Batch1.ts` through `src/lib/pages/Batch69.ts`

      **Verify:** Run `npx tsx scripts/analyze-batches.ts` and confirm every article has ≥5 internal links.

- [ ] 4. **Expand short articles to ≥400 words**

      For each article with <400 words in content, expand the existing sections or add new subsections to reach the minimum. Expansion should:
      - Stay on topic and provide genuine value
      - Maintain the technical, authoritative tone of existing content
      - Add practical examples, use cases, or technical details
      - Not introduce fabricated statistics or claims (per project rules)

      **Strategy:** Identify the 514 articles under 400 words. For each, determine which section is underdeveloped and expand it with:
      - Additional technical detail
      - More concrete examples
      - Practical guidance or warnings
      - Related considerations (e.g., "Common mistakes to avoid", "When to use this approach")

      **Files:** `src/lib/pages/Batch1.ts` through `src/lib/pages/Batch69.ts`

      **Verify:** Run `npx tsx scripts/analyze-batches.ts` and confirm every article has ≥400 words in content.

- [ ] 5. **Run full content audit and verify all articles pass**

      Execute the official content audit script to generate the audit manifest and confirm all blog articles pass.

      **Command:** `npm run content:audit`

      **Verify:**
      - Check `docs/CONTENT_AUDIT.md` — the "Blog remediation backlog" section should show 0 pages failing
      - Check `src/content/__generated__/audit-manifest.json` — all `/blog/*` entries should have `"passed": true`
      - Output should show something like "Content audit: 747/747 passed" (or close to it)

- [ ] 6. **Build the project and verify no TypeScript errors**

      Run a full TypeScript compilation to ensure all batch file edits are syntactically correct and the project builds.

      **Command:** `npm run typecheck && npm run build`

      **Verify:**
      - `tsc --noEmit` exits 0
      - `npm run build` completes successfully
      - No errors related to Article type mismatches or malformed FAQ/content fields

---

## Notes

**Data Shape (from Batch1.ts example):**

```typescript
art(
  slug: string,
  title: string,
  primaryKeyword: string,
  description: string,
  category: 'Fundamentals' | 'Printing & Sizing' | 'Security & Scanning' | 'Business & Regional',
  readTime: string,
  publishedAt: string,  // e.g. '2026-07-15'
  content: string,      // Markdown content — this is where internal links go
  faqs: Array<{ question: string; answer: string }>
)
```

**Internal Links Extraction Logic (from content-audit.ts):**

```typescript
function extractInternalLinks(markdown: string): string[] {
  const re = /\[[^\]]*\]\((\/[^)\s]*)\)/g;
  // Matches: [any text](/path)
}
```

**FAQ Uniqueness Check (from content-audit.ts):**

```typescript
const questions = a.faqs.map((f) => f.question.trim().toLowerCase());
if (new Set(questions).size !== questions.length) {
  fail(url, 'duplicate FAQ questions within the page');
}
```

**Word Count Logic (from content-audit.ts):**

```typescript
const words = a.content.split(/\s+/).filter(Boolean).length;
if (words < 400) fail(url, `content is ${words} words (<400 minimum)`);
```

**Byline & Date (from helper.ts):**

- Byline: `'Codexengr, QR Systems Engineer'` (already applied to all articles via helper)
- updatedAt: `'2026-10-05'` (already applied to all articles via helper)

---

## Verification Command Summary

```bash
# After each step:
npx tsx scripts/analyze-batches.ts

# Final verification:
npm run content:audit
npm run typecheck
npm run build
```

Expected final outcome:

- All 586+ blog articles in Batch1–69 pass the content audit
- Articles appear in the sitemap at `/blog/[slug]`
- Zero TypeScript compilation errors
