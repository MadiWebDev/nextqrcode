# YMYL manual sample — sourcing & disclaimer check (Step 2, 2026-11-17)

Method: 26 pages drawn from the 213 screening-flagged YMYL URLs in the 856
(up to 3 per risk group, blog posts preferred, earners first). Each page's
extracted main content was scanned for **source signals** (mentions of
'official', named authorities such as IRS/CDC/WHO/FDA/ECP/NADRA/FBR, official
domains, 'according to', 'sources', regulation/guideline references) and
**disclaimer signals** ('disclaimer', 'not legal/medical/financial/tax
advice', 'consult a/your …', 'informational purposes/only'). Signal scan is a
heuristic: a page can cite a source in words the patterns miss. The pattern
that matters is the aggregate, stated under the table.

| Page | Groups | Issue | Protect | Impr | Source signals | Disclaimer signals |
|---|---|---|---|---|---|---|
| /blog/direct-part-marking-qr-codes-on-metal | medical | crawled | YES | 117 | — | — |
| /blog/how-to-spot-sticker-overlay-scam | donations | crawled | YES | 6 | official | — |
| /blog/india-upi-qr-code-specifications | legal,financial | crawled | YES | 9 | — | — |
| /blog/mistakes-printing-qr-codes-on-acrylic | insurance | crawled | YES | 1 | — | — |
| /blog/pakistan-raast-qr-code-format | financial | crawled | YES | 26 | — | — |
| /blog/qr-code-for-charity-events | donations | crawled | YES | 7 | named authority | — |
| /blog/qr-code-for-construction-sites | government | crawled | YES | 22 | — | — |
| /blog/qr-code-for-election-voter-information | elections | crawled | YES | 21 | — | — |
| /blog/qr-code-for-immigration-documents | immigration,government | crawled | YES | 37 | official | — |
| /blog/qr-code-for-insurance-telematics | insurance | crawled | YES | 2 | — | — |
| /blog/qr-code-for-mental-health-resources | medical | crawled | YES | 63 | — | — |
| /blog/qr-code-for-passport-photos | immigration,government | crawled | YES | 12 | named authority | — |
| /blog/qr-code-for-pharmaceutical-packaging | medical | crawled | YES | 23 | regulation | — |
| /blog/qr-code-for-probate-and-estate | tax,financial,government | crawled | YES | 6 | — | — |
| /blog/qr-code-for-public-toilets | legal | crawled | YES | 28 | — | — |
| /blog/qr-code-for-taxi-driver-onboarding | insurance | crawled | YES | 3 | — | — |
| /blog/qr-code-for-vehicle-identification | government | crawled | YES | 15 | — | — |
| /blog/qr-code-for-voter-registration-drives | elections,government | crawled | YES | 2 | named authority, official | — |
| /blog/qr-code-for-wills-and-legal-documents | legal,government | crawled | YES | 14 | official | — |
| /blog/qr-code-government-services | elections,medical,tax,government | crawled | no | 8 | official domain, named authority, official | — |
| /blog/qr-code-payment-how-it-works | financial | crawled | YES | 27 | — | — |
| /blog/qr-code-university-attendance | immigration | crawled | YES | 11 | named authority | — |
| /blog/qr-payments-with-paytm | tax | crawled | YES | 17 | named authority | — |
| /blog/qr-vs-rfid-warehouse-logistics | financial | crawled | YES | 21 | — | — |
| /blog/thailand-promptpay-qr-code-format | tax,financial | crawled | YES | 7 | — | — |
| /blog/what-to-do-if-you-scanned-fake-charity-qr | medical,donations | crawled | YES | 18 | named authority | — |

## Result

**Disclaimer signals: 0 of 26 pages.** Not one sampled YMYL page — including
`/blog/qr-code-for-election-voter-information`, `/blog/qr-code-for-mental-health-resources`,
`/blog/qr-code-for-wills-and-legal-documents`, `/blog/qr-code-for-probate-and-estate`,
`/blog/qr-code-for-immigration-documents` — carries a disclaimer, a
'not advice' notice, a 'consult a professional' pointer, or an
'informational purposes' statement that the scan can find.

**Source signals: 11 of 26 pages have at least one; 15 have none.** Where
present, the signal is usually a passing mention of the word 'official' or a
named body — not a citation a reader could verify (no linked sources, no
dated references in the extracted text).

Verdict for Step 4: the sampled YMYL pages read as templated advice without
verifiable sourcing and without disclaimers. Under the program's hard rules
they belong in the high-risk class: REMOVE or full rewrite with named
sources — never a generated-text refresh. (Evidence: this file +
output/ymyl-sample.json; ledger E-041.)
