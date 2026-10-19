import type { Article } from '../articles';
import { art } from './helper';

export const batch137: Article[] = [
  art(
    'why-your-qr-code-prints-with-the-logo-covering-a-finder-pattern',
    'Why Your QR Code Prints With The Logo Covering A Finder Pattern and How to Fix It',
    'why your qr code prints with the logo covering a finder pattern',
    'Diagnose a code that prints with the logo covering a finder pattern: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-12',
    `
### What you are seeing

The printed code carries a logo that overlaps one of the three corner finder patterns. The design may have looked balanced on screen, but the scanner cannot find a symbol whose corner is hidden. This is a common failure with branded codes, because the logo is placed for looks rather than for scanning, and the screen preview does not punish it. The fix is to move the logo to the centre, shrink it, or remove it, and to prove the result with a scan test.

### Likely causes

1. **Logo placed over a corner for balance** — A logo positioned near a corner for visual balance can drift over the finder pattern. Test: compare the proof corners with the original code.
2. **Logo too large for the code** — A logo that is too large for the symbol can reach a corner even when it starts in the centre. Test: check the logo size against the code size.
3. **Logo moved during layout** — A logo that was centred in the design can shift during layout or scaling. Test: compare the layout file with the approved design.
4. **Proof checked by eye only** — A logo overlapping a corner can look intentional to the eye, so a visual check misses it. Test: scan the proof.
5. **Error correction too low for the logo** — A logo that covers data modules needs enough error correction to recover them, and a low setting leaves no margin. Test: compare a plain version with the logo version.

### Step-by-step fix

1. Inspect all three corners of the proof and mark any logo overlap.
2. Move the logo to the centre of the code, clear of all three corners.
3. Shrink the logo until it leaves a clear margin around every corner.
4. Raise the error-correction level if the logo covers data modules.
5. Print one corrected proof and scan it on two phones.
6. Remove the logo entirely if the corrected version still fails.

### Putting this into practice

In practice, the centre is the only safe place for a logo, and small is the only safe size. Keep the logo centred, keep it modest, and keep every corner fully clear. Test the branded artwork on two phones before printing, because a branded code that fails is worse than a plain code that works. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Placing a logo for visual balance without checking whether it touches a finder pattern.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with the logo covering a finder pattern will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with the logo covering a finder pattern.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are fully clear of the logo
- The logo is small and centred
- The branded proof scans on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR minimum size checker](/qr-minimum-size-checker)
- [QR contrast checker](/qr-contrast-checker)
- [QR print proof checklist](/qr-print-proof-checklist)
- [QR DPI calculator](/qr-dpi-calculator)
- [QR quiet zone calculator](/qr-quiet-zone-calculator)
- [printed QR tester](/printed-qr-tester)
- [QR size calculator](/qr-size-calculator)
`,
    [
      {
        question: 'Why does a logo over a finder pattern break a QR code?',
        answer:
          'The scanner uses the three corner squares to find and orient the symbol. A logo covering any part of one hides that reference, so the scanner cannot lock on. Keep every finder pattern fully clear, and place the logo in the centre instead.',
      },
      {
        question: 'How large can a logo inside a QR code be?',
        answer:
          'Small enough to leave all three corners clear and to leave enough undamaged data for the error correction to recover. There is no single safe size, so test the branded artwork on two phones. If it fails, shrink the logo or remove it.',
      },
      {
        question: 'Does higher error correction allow a bigger logo?',
        answer:
          'It helps, because the code can recover more damaged modules, but it does not protect the finder patterns. A logo over a corner breaks the code at any error-correction level. Keep the corners clear first, then use error correction for the central modules.',
      },
    ]
  ),
  art(
    'prints-with-the-logo-covering-a-finder-pattern-step-by-step-fix',
    'Prints With The Logo Covering A Finder Pattern: Step-by-Step Fix',
    'prints with the logo covering a finder pattern step by step fix',
    'Repair a code that prints with the logo covering a finder pattern with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-12',
    `
### What you are seeing

This fix moves the logo clear of all three finder patterns and proves the branded code still scans. You will check every corner, reposition the logo, and test the corrected artwork on two phones. Keep the logo small and centred, because a logo that touches a corner costs you every scan.

### Likely causes

1. **Logo placed over a corner for balance** — Quick test: compare the proof corners with the original code.
2. **Logo too large for the code** — Quick test: check the logo size against the code size.
3. **Logo moved during layout** — Quick test: compare the layout file with the approved design.
4. **Proof checked by eye only** — Quick test: scan the proof.
5. **Error correction too low for the logo** — Quick test: compare a plain version with the logo version.

### Step-by-step fix

Step 1: Inspect all three corners of the proof and mark any logo overlap.
Step 2: Move the logo to the centre of the code, clear of all three corners.
Step 3: Shrink the logo until it leaves a clear margin around every corner and covers only central modules.
Step 4: Raise the error-correction level so the code can recover the modules the logo covers.
Step 5: Print one corrected proof and scan it on two phones.
Step 6: If the corrected version still fails, shrink the logo further or remove it.
Step 7: Approve the run only when the branded proof scans on two phones and all three corners are clear.

### Putting this into practice

In practice, keep the plain version of every branded code as a fallback. If the branded version fails its proof test, the plain version lets you ship on time instead of redesigning under pressure. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Placing a logo for visual balance without checking whether it touches a finder pattern.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that prints with the logo covering a finder pattern will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that prints with the logo covering a finder pattern.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- All three finder patterns are fully clear of the logo
- The logo is small and centred
- The branded proof scans on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR minimum size checker](/qr-minimum-size-checker)
- [QR contrast checker](/qr-contrast-checker)
- [QR print proof checklist](/qr-print-proof-checklist)
- [QR DPI calculator](/qr-dpi-calculator)
- [QR quiet zone calculator](/qr-quiet-zone-calculator)
- [printed QR tester](/printed-qr-tester)
- [QR size calculator](/qr-size-calculator)
`,
    [
      {
        question: 'How do I fix a QR code with a logo covering a finder pattern?',
        answer:
          'Move the logo to the centre, shrink it until every corner is clear, and raise the error-correction level. Print one corrected proof and scan it on two phones. Remove the logo if the corrected version still fails.',
      },
      {
        question: 'Where should a logo go inside a QR code?',
        answer:
          'In the centre, small, and clear of all three corner finder patterns. A centred logo covers only data modules, which error correction can recover. A logo anywhere near a corner risks the pattern the scanner needs.',
      },
      {
        question: 'Should I keep a plain version of a branded QR code?',
        answer:
          'Yes. Keep the plain version as a fallback so a failed branded proof does not block the job. A plain code that scans is always better than a branded code that does not.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-coupon-does-not-apply',
    'Why Your QR Code Scans But The Coupon Does Not Apply and How to Fix It',
    'why your qr code scans but the coupon does not apply',
    'Diagnose a code that scans but the coupon does not apply: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-13',
    `
### What you are seeing

The code scans, the shop page or till opens, but the coupon does not apply: no discount, an invalid-code message, or a full-price total. The scan worked, so the fault sits in the coupon itself: the code it carries, the offer behind it, the dates, or the rules that decide who qualifies. Coupon failures are expensive, because the visitor did the work and got nothing. The fix is to trace the coupon from the scan to the till and to find the rule or value that rejects it.

### Likely causes

1. **Coupon code mistyped in the payload** — A wrong character in the encoded coupon code sends a code the till does not recognise. Test: decode the payload and compare the coupon code with the offer record.
2. **Offer expired or not yet started** — A coupon scanned outside its valid dates is correctly rejected by the till. Test: check the offer start and end dates against the scan date.
3. **Coupon already redeemed** — A single-use coupon that was already used is correctly rejected on the next scan. Test: check the redemption record for the coupon code.
4. **Eligibility rule blocks the visitor** — A minimum spend, a product exclusion, or a location rule can reject a coupon that is otherwise valid. Test: read the offer rules and compare them with the basket.
5. **Till or site not reading the coupon field** — A coupon can fail when the till or the site does not pick up the code from the QR journey. Test: enter the same coupon code manually and see whether it applies.

### Step-by-step fix

1. Decode the payload and write down the exact coupon code it carries.
2. Compare the code with the offer record, including the dates and the rules.
3. Check whether the coupon was already redeemed.
4. Test the same coupon code by entering it manually.
5. Fix the coupon, the offer, or the code, whichever is at fault.
6. Retest with a real redemption on two devices before relaunching.

### Putting this into practice

In practice, the manual-entry test is the fastest way to split this problem in two. If the code works when typed, the QR journey is at fault. If it fails when typed, the offer is at fault. That single test tells you which side to fix. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Testing a coupon QR code by scanning it, without ever completing a redemption.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the coupon does not apply will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the coupon does not apply.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded coupon code matches the offer record
- The offer is within its valid dates
- A real redemption applies the discount
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [coupon QR code generator](/coupon-qr-code-generator)
- [bulk coupon QR generator](/bulk-coupon-qr-generator)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'Why does my QR code scan but the coupon does not apply?',
        answer:
          'The coupon code may be mistyped in the payload, the offer may be expired, the coupon may already be redeemed, an eligibility rule may block it, or the till may not pick up the code from the QR journey. Decode the payload, check the offer, and test the same code manually to split the fault.',
      },
      {
        question: 'Can a QR code carry a coupon directly?',
        answer:
          'Yes. The code can encode the coupon code or a link that applies it. Either way, the offer behind it must be live, in date, and eligible for the basket. Test the full redemption, not just the scan, before launch.',
      },
      {
        question: 'Why does a coupon work when typed but not when scanned?',
        answer:
          'The QR journey is at fault: the payload carries a different code, the link drops the coupon parameter, or the site does not pick up the code from the QR landing. Decode the payload and compare the scanned journey with the manual journey step by step.',
      },
    ]
  ),
  art(
    'scans-but-the-coupon-does-not-apply-step-by-step-fix',
    'Scans But The Coupon Does Not Apply: Step-by-Step Fix',
    'scans but the coupon does not apply step by step fix',
    'Repair a code that scans but the coupon does not apply with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-13',
    `
### What you are seeing

This fix traces the coupon from scan to till and finds the rule that rejects it. You will test the coupon value, the offer dates, the eligibility rules, and the till behaviour, then repair the coupon, the offer, or the code. Verify the fix with a real redemption test, not just a scan test.

### Likely causes

1. **Coupon code mistyped in the payload** — Quick test: decode the payload and compare the coupon code with the offer record.
2. **Offer expired or not yet started** — Quick test: check the offer start and end dates against the scan date.
3. **Coupon already redeemed** — Quick test: check the redemption record for the coupon code.
4. **Eligibility rule blocks the visitor** — Quick test: read the offer rules and compare them with the basket.
5. **Till or site not reading the coupon field** — Quick test: enter the same coupon code manually and see whether it applies.

### Step-by-step fix

Step 1: Decode the payload and write down the exact coupon code it carries.
Step 2: Compare the code with the offer record, including the spelling, the dates, and the rules.
Step 3: Check the redemption record to see whether the coupon was already used.
Step 4: Enter the same coupon code manually. If it applies manually, the QR journey is at fault; if it fails manually, the offer is at fault.
Step 5: Fix the coupon code, the offer dates, or the eligibility rules, whichever is wrong.
Step 6: If the payload was wrong, regenerate the code from the corrected coupon.
Step 7: Retest with a real redemption on two devices and confirm the discount applies.

### Putting this into practice

In practice, test every coupon code with a real redemption before launch, not just a scan. A scan that opens the right page proves the code carries the coupon; only a redemption proves the coupon applies. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Testing a coupon QR code by scanning it, without ever completing a redemption.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the coupon does not apply will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the coupon does not apply.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded coupon code matches the offer record
- The offer is within its valid dates
- A real redemption applies the discount
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [coupon QR code generator](/coupon-qr-code-generator)
- [bulk coupon QR generator](/bulk-coupon-qr-generator)
- [QR expiry checker](/qr-expiry-checker)
- [QR batch validator](/qr-batch-validator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'How do I fix a QR coupon that will not apply?',
        answer:
          'Decode the payload, compare the coupon code with the offer record, and test the code manually. Fix the coupon, the offer dates, or the QR journey, whichever is at fault. Retest with a real redemption on two devices.',
      },
      {
        question: 'Should I reprint a coupon QR code if the offer changed?',
        answer:
          'If the printed code points at a redirect or a coupon record you control, update the offer behind it and the printed copies heal. If the payload itself carries the wrong coupon code, regenerate and reprint the code.',
      },
      {
        question: 'How do I test a coupon QR code before launch?',
        answer:
          'Scan the code and complete a real redemption on two devices, including the full basket and till steps. A scan that opens the right page is not a passing test; a redemption that applies the discount is.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-payment-fails',
    'Why Your QR Code Scans But The Payment Fails and How to Fix It',
    'why your qr code scans but the payment fails',
    'Diagnose a code that scans but the payment fails: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-13',
    `
### What you are seeing

The code scans, the payment page opens, but the payment fails: a declined transaction, an error at checkout, or a payment page that never loads the amount. The scan worked, so the fault sits in the payment journey: the amount, the account, the payment method, or the page that collects it. Payment failures lose sales and trust at once, so treat them as urgent. The fix is to trace the payment journey step by step and to find the step that rejects it.

### Likely causes

1. **Wrong amount or currency in the payload** — A payment code that carries the wrong amount or currency can be rejected by the payment service. Test: decode the payload and compare the amount with the intended charge.
2. **Wrong account or merchant details** — A payment code that points at the wrong account, or at an account that is not set up to receive payments, fails at the payment step. Test: confirm the account details with the payment provider record.
3. **Payment page or checkout broken** — A checkout page with a script error, a missing field, or a blocked payment method can fail even when the code is correct. Test: walk through the checkout manually without the QR code.
4. **Payment method not supported** — A payment method the customer uses may not be supported by the checkout or the account. Test: try a different payment method on the same checkout.
5. **Expired or single-use payment link** — A payment link that expired or was already used can fail at the payment step. Test: check the link dates and usage record.

### Step-by-step fix

1. Decode the payload and write down the exact payment details it carries.
2. Walk through the checkout manually without the QR code.
3. Compare the amount, the account, and the payment method with the intended setup.
4. Fix the payload, the checkout, or the account, whichever is at fault.
5. Test the payment journey on two devices with a real test payment.
6. Relaunch only when the full journey reaches a confirmation.

### Putting this into practice

In practice, the manual checkout test splits this problem in two, just as with coupons. If the checkout fails without the code, the payment setup is at fault. If it works manually but fails from the code, the payload or the QR journey is at fault. That test tells you where to fix. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Relaunching a payment QR code after a scan test, without ever completing a test payment.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the payment fails will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the payment fails.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded payment details match the intended charge
- The checkout works manually without the QR code
- A test payment reaches a confirmation
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR expiry checker](/qr-expiry-checker)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR batch validator](/qr-batch-validator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [QR payload inspector](/qr-payload-inspector)
`,
    [
      {
        question: 'Why does my QR code scan but the payment fail?',
        answer:
          'The payload may carry the wrong amount or account, the checkout may be broken, the payment method may not be supported, or the payment link may have expired. Decode the payload, walk through the checkout manually, and compare the details with the intended setup.',
      },
      {
        question: 'Is a failed QR payment a problem with the code?',
        answer:
          'Rarely. The code only carries the payment details or the checkout link. Most payment failures sit in the checkout, the account setup, or the payment method. Test the checkout manually to find the failing step.',
      },
      {
        question: 'Why does a QR payment fail for one customer but not another?',
        answer:
          'The customers may use different payment methods, banks, or devices, and one of those paths may be unsupported or blocked. Test the journey with more than one payment method and on two devices before concluding the code is at fault.',
      },
    ]
  ),
  art(
    'scans-but-the-payment-fails-step-by-step-fix',
    'Scans But The Payment Fails: Step-by-Step Fix',
    'scans but the payment fails step by step fix',
    'Repair a code that scans but the payment fails with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-14',
    `
### What you are seeing

This fix traces the payment journey from scan to confirmation and finds the step that fails. You will check the payload, the amount, the account details, and the checkout behaviour, then repair whichever step is at fault. Verify the fix with a real test payment in the same conditions your customers use.

### Likely causes

1. **Wrong amount or currency in the payload** — Quick test: decode the payload and compare the amount with the intended charge.
2. **Wrong account or merchant details** — Quick test: confirm the account details with the payment provider record.
3. **Payment page or checkout broken** — Quick test: walk through the checkout manually without the QR code.
4. **Payment method not supported** — Quick test: try a different payment method on the same checkout.
5. **Expired or single-use payment link** — Quick test: check the link dates and usage record.

### Step-by-step fix

Step 1: Decode the payload and write down the exact payment details it carries.
Step 2: Walk through the checkout manually, without the QR code, and note where it fails.
Step 3: Compare the amount, the currency, and the account details with the intended setup.
Step 4: If the payload is wrong, regenerate the code from the corrected payment details.
Step 5: If the checkout is broken, fix the page or the payment settings and test the checkout on its own.
Step 6: If the account is not set up to receive payments, complete the setup with the provider before relaunching.
Step 7: Retest the full journey from scan to confirmation on two devices with a real test payment.

### Putting this into practice

In practice, never relaunch a payment code on the strength of a scan test. Only a completed test payment, reaching a confirmation, proves the journey works. Keep that test payment in your launch checklist for every payment code. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Relaunching a payment QR code after a scan test, without ever completing a test payment.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the payment fails will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the payment fails.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded payment details match the intended charge
- The checkout works manually without the QR code
- A test payment reaches a confirmation
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR expiry checker](/qr-expiry-checker)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR batch validator](/qr-batch-validator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [QR payload inspector](/qr-payload-inspector)
`,
    [
      {
        question: 'How do I fix a QR code where the payment fails?',
        answer:
          'Decode the payload, walk through the checkout manually, and compare the amount, currency, and account details. Fix the payload, the checkout, or the account, whichever is at fault. Retest with a real test payment on two devices.',
      },
      {
        question: 'Should I reprint a payment QR code if the account changed?',
        answer:
          'If the code points at a checkout page you control, update the page and the printed copies heal. If the payload itself carries the old account or amount, regenerate and reprint the code from the corrected details.',
      },
      {
        question: 'How do I test a payment QR code safely?',
        answer:
          "Use the payment provider's test mode or a small real test payment, and walk the full journey from scan to confirmation. Confirm the amount, the account, and the confirmation message. Do not rely on a scan test alone.",
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-form-is-empty',
    'Why Your QR Code Scans But The Form Is Empty and How to Fix It',
    'why your qr code scans but the form is empty',
    'Diagnose a code that scans but the form is empty: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-14',
    `
### What you are seeing

The code scans, the form opens, but the fields that should be prefilled are empty: no name, no reference, no answers carried over from the code. The scan worked, so the fault sits in the handover between the code and the form: the payload, the link parameters, or the form itself. Visitors who expected a ready-filled form meet a blank one and must start over, which is exactly the friction the code was meant to remove. The fix is to trace the handover and to find where the values get lost.

### Likely causes

1. **Link parameters missing or mistyped** — A prefill that depends on link parameters fails when a parameter name is mistyped, missing, or encoded wrongly. Test: decode the payload and compare the parameters with the form field names.
2. **Form does not accept prefill** — A form that was never set up to accept prefilled values ignores the parameters the code sends. Test: open the form with the parameters typed manually in the address bar.
3. **Redirect drops the parameters** — A redirect can strip the parameters from the address, so the form receives a bare link with no values. Test: follow the redirect chain and watch the parameters.
4. **Field names changed** — A form whose field names changed after the code was printed no longer matches the parameters the code sends. Test: compare the current field names with the parameters in the code.
5. **Values contain characters that break the link** — Special characters in a prefilled value can break the link if they are not encoded correctly. Test: try a simple value with plain characters and compare.

### Step-by-step fix

1. Decode the payload and write down the exact link and parameters it carries.
2. Compare the parameter names with the current form field names.
3. Open the form with the parameters typed manually and check whether they fill.
4. Follow the redirect chain and check that it preserves the parameters.
5. Fix the link, the redirect, or the form, whichever drops the values.
6. Retest by scanning the code and confirming every expected field arrives filled.

### Putting this into practice

In practice, the manual-parameter test splits this problem in two. If typing the parameters into the address bar fills the form, the code or the redirect is at fault. If it does not fill the form, the form setup is at fault. That test tells you which side to fix. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Regenerating the QR code when the form itself was never set up to accept prefilled values.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the form is empty will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the form is empty.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The parameter names match the current form field names
- Redirects preserve the parameters
- Scanning the code fills every expected field
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'Why does my QR code open a form with empty fields?',
        answer:
          'The link parameters may be missing or mistyped, the form may not accept prefill, a redirect may strip the parameters, or the field names may have changed. Decode the payload, compare the parameters with the field names, and test the parameters manually to find the fault.',
      },
      {
        question: 'Can a QR code prefill a form?',
        answer:
          'Yes, when the form is set up to accept values from the link and the code carries the right parameters. The form, the link, and any redirects must all preserve the values. Test the full journey by scanning the code and checking every field.',
      },
      {
        question: 'Why did prefill stop working after a form update?',
        answer:
          'The update may have renamed a field, removed the prefill setup, or added a redirect that drops the parameters. Compare the current field names with the parameters in the code, and check the redirect chain after every form change.',
      },
    ]
  ),
  art(
    'scans-but-the-form-is-empty-step-by-step-fix',
    'Scans But The Form Is Empty: Step-by-Step Fix',
    'scans but the form is empty step by step fix',
    'Repair a code that scans but the form is empty with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-14',
    `
### What you are seeing

This fix restores the prefilled values to the form. You will decode the payload, check the link parameters, and test the form field by field, then repair the link or the form. Verify the fix by scanning the code and confirming every expected field arrives filled.

### Likely causes

1. **Link parameters missing or mistyped** — Quick test: decode the payload and compare the parameters with the form field names.
2. **Form does not accept prefill** — Quick test: open the form with the parameters typed manually in the address bar.
3. **Redirect drops the parameters** — Quick test: follow the redirect chain and watch the parameters.
4. **Field names changed** — Quick test: compare the current field names with the parameters in the code.
5. **Values contain characters that break the link** — Quick test: try a simple value with plain characters and compare.

### Step-by-step fix

Step 1: Decode the payload and write down the exact link and parameters it carries.
Step 2: Compare the parameter names with the current form field names, letter by letter.
Step 3: Open the form with the parameters typed manually in the address bar. If they do not fill, the form is at fault.
Step 4: Follow the redirect chain and check that every hop preserves the parameters.
Step 5: Fix the parameter names, the redirect, or the form prefill setup, whichever is at fault.
Step 6: If the payload was wrong, regenerate the code from the corrected link.
Step 7: Retest by scanning the code on two phones and confirming every expected field arrives filled.

### Putting this into practice

In practice, keep a record of the parameter names and the form fields they fill, and check it whenever the form changes. A form edit that renames a field silently breaks every code that prefills it. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Regenerating the QR code when the form itself was never set up to accept prefilled values.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the form is empty will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the form is empty.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The parameter names match the current form field names
- Redirects preserve the parameters
- Scanning the code fills every expected field
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [survey QR code generator](/survey-qr-code-generator)
- [feedback QR code generator](/feedback-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [UTM builder](/utm-builder)
`,
    [
      {
        question: 'How do I fix a QR code that opens an empty form?',
        answer:
          'Decode the payload, compare the parameters with the form field names, and test the parameters manually. Fix the link, the redirect, or the form, whichever drops the values. Retest by scanning and confirming every field fills.',
      },
      {
        question: 'Should I reprint the code or fix the form?',
        answer:
          'Fix the form or the redirect if the payload is correct, because the printed copies then heal. Reprint only if the payload itself carries the wrong parameter names or values.',
      },
      {
        question: 'How do I test form prefill before launch?',
        answer:
          'Scan the code on two phones and confirm every expected field arrives filled. Also test the form with the parameters typed manually, so you know the form itself accepts prefill before you blame the code.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-video-will-not-play',
    'Why Your QR Code Scans But The Video Will Not Play and How to Fix It',
    'why your qr code scans but the video will not play',
    'Diagnose a code that scans but the video will not play: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-15',
    `
### What you are seeing

The code scans, the video page opens, but the video will not play: a black player, a spinning loader, or an error message. The scan worked, so the fault sits in the video, the page, or the playback conditions: a removed video, a restricted video, a blocked player, or a connection too weak for the stream. Visitors who expected a video meet a dead player, which feels like a broken promise. The fix is to test the video on its own, then the page, then the QR journey.

### Likely causes

1. **Video removed, private, or restricted** — A video that was deleted, set to private, or restricted by region or age will not play for visitors. Test: open the video directly and check its availability.
2. **Player blocked by the browser or app** — An in-app browser, a content blocker, or a restrictive setting can block the video player. Test: open the same page in a different browser.
3. **Page loads but the player fails** — A script error or a missing player component can leave a dead player on an otherwise working page. Test: open the page on a desktop and on a phone and compare.
4. **Connection too weak for the stream** — A weak mobile signal can stall a video that plays fine on fast WiFi. Test: try the video on a strong connection.
5. **Link points at the wrong video** — A mistyped link or a redirect can land visitors on a different video or a non-video page. Test: decode the payload and compare the link with the intended video.

### Step-by-step fix

1. Decode the payload and write down the exact link it carries.
2. Open the video directly, outside the QR journey, and confirm whether it plays.
3. Open the destination page in a second browser and on a desktop.
4. Fix the video availability, the page, or the link, whichever is at fault.
5. Regenerate the code if the payload points at the wrong video.
6. Retest by scanning the code and watching the video play on two phones.

### Putting this into practice

In practice, test the video on its own before you blame the code. A video that will not play when opened directly is a video problem, and no QR fix can repair it. A video that plays directly but not from the code points at the link or the page. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Reprinting a video QR code when the video itself was set to private.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the video will not play will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the video will not play.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The video plays when opened directly
- The page player works on two phones
- Scanning the code plays the intended video
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code open a video that will not play?',
        answer:
          'The video may be removed, private, or restricted, the player may be blocked, the page may have a player fault, or the connection may be too weak. Open the video directly to separate the video from the code, then fix whichever side fails.',
      },
      {
        question: 'Can a QR code itself stop a video playing?',
        answer:
          'No. The code only carries the link. Playback depends on the video, the page, the browser, and the connection. A code that opens the right page has done its job; the playback fault sits downstream.',
      },
      {
        question: 'Why does the video play on WiFi but not on mobile data?',
        answer:
          'The mobile connection may be too weak for the stream, or the network may restrict video. Test on a strong connection to confirm, and keep the video lightweight so it plays on a weak signal as well as on WiFi.',
      },
    ]
  ),
  art(
    'scans-but-the-video-will-not-play-step-by-step-fix',
    'Scans But The Video Will Not Play: Step-by-Step Fix',
    'scans but the video will not play step by step fix',
    'Repair a code that scans but the video will not play with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-15',
    `
### What you are seeing

This fix restores playback to the video behind the code. You will test the video on its own, check the page and the playback conditions, and repair whichever step blocks it. Verify the fix by scanning the code and watching the video play on two phones.

### Likely causes

1. **Video removed, private, or restricted** — Quick test: open the video directly and check its availability.
2. **Player blocked by the browser or app** — Quick test: open the same page in a different browser.
3. **Page loads but the player fails** — Quick test: open the page on a desktop and on a phone and compare.
4. **Connection too weak for the stream** — Quick test: try the video on a strong connection.
5. **Link points at the wrong video** — Quick test: decode the payload and compare the link with the intended video.

### Step-by-step fix

Step 1: Decode the payload and write down the exact link it carries.
Step 2: Open the video directly in a phone browser. If it does not play there, the video itself is the problem.
Step 3: Open the destination page in a second browser and on a desktop, and compare the player behaviour.
Step 4: If the video is private, removed, or restricted, restore its availability or point the code at a working video.
Step 5: If the player fails on the page, fix the page or link to the video directly.
Step 6: If the link is wrong, regenerate the code from the correct video link.
Step 7: Retest by scanning the code on two phones and watching the video play to the end.

### Putting this into practice

In practice, keep video codes pointed at videos you control and monitor. A video that goes private or is removed after the code is printed leaves every visitor facing a dead player. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Reprinting a video QR code when the video itself was set to private.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the video will not play will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the video will not play.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The video plays when opened directly
- The page player works on two phones
- Scanning the code plays the intended video
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR redirect chain viewer](/qr-redirect-chain-viewer)
- [QR expiry checker](/qr-expiry-checker)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code where the video will not play?',
        answer:
          'Open the video directly. If it does not play, fix the video availability. If it plays directly but not from the code, fix the link or the page. Retest by scanning and watching the video play on two phones.',
      },
      {
        question: 'Should I link a QR code to a video page or to the video directly?',
        answer:
          'Link to the page that hosts the video when visitors need context, and to the video directly when playback is the whole point. Either way, test the full journey by scanning and watching the video play.',
      },
      {
        question: 'How do I stop video codes breaking when videos change?',
        answer:
          'Point codes at stable video pages you control and monitor, and check the destination whenever the video changes. A video that goes private after printing breaks every code that points at it.',
      },
    ]
  ),
];
