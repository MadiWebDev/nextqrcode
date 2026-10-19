import type { Article } from '../articles';
import { art } from './helper';

export const batch78: Article[] = [
  art(
    'qr-payments-with-swish',
    'QR Payments with Swish: Setup, Fees, and Best Uses',
    'qr payments with swish',
    'How QR payments with Swish work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '7 min read',
    '2027-01-27',
    `
QR payments with Swish follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the Swish app or a participating bank app, and the payment is confirmed on screen. Swish is a bank-linked mobile payment service associated with Sweden. Customers usually pay from a bank-linked app, so the merchant code mainly needs to carry the right payee and amount. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with Swish works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Swish app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Swish

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Swish merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Swish fits best

Swish fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Swish as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Swish, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Swish merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [bulk ticket QR generator](/bulk-ticket-qr-generator)
- [church QR suite](/church-qr-suite)
- [QR consent note builder](/qr-consent-note-builder)
- [payment QR codes](/payment-qr)
- [bulk generator](/bulk-generator)
- [QR scanner](/qr-scanner)
- [QR size guide](/qr-size-guide)
`,
    [
      {
        question: 'Do customers need the Swish app to pay?',
        answer:
          'In most setups the customer pays from the Swish app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does Swish charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-vipps',
    'QR Payments with Vipps: Setup, Fees, and Best Uses',
    'qr payments with vipps',
    'A plain-language guide to accepting Vipps by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '5 min read',
    '2027-01-28',
    `
If your customers use Vipps, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. Vipps is a mobile payment app associated with Norway. Customers typically pay from an app linked to their bank, so the merchant flow centres on a clear code and a quick confirmation. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with Vipps works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Vipps app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Vipps

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Vipps merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Vipps fits best

Vipps fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Vipps as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Vipps, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your Vipps merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [donation QR code generator](/donation-qr-code-generator)
- [retail QR suite](/retail-qr-suite)
- [QR batch validator](/qr-batch-validator)
- [payment QR codes](/payment-qr)
- [QR safety checker](/qr-safety-checker)
- [QR scanner](/qr-scanner)
- [printed QR tester](/printed-qr-tester)
`,
    [
      {
        question: 'Can I put a Vipps QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with Vipps?',
        answer:
          'Refunds usually go through the same provider that processed the original payment, following that provider refund process. Ask your provider how refunds are started, how long they take, and whether the customer sees the refund in the same app. Keep the original payment reference, because it is what the provider will ask for.',
      },
      {
        question: 'Do I need a separate code for each till?',
        answer:
          'A separate code per till makes reconciliation easier, because you can tell which till took each payment. A single shared code is simpler to print, but it makes it harder to trace a disputed payment to one counter. For two or more tills, separate codes are usually worth the small extra effort.',
      },
    ]
  ),
  art(
    'qr-payments-with-mobilepay',
    'QR Payments with Mobilepay: Setup, Fees, and Best Uses',
    'qr payments with mobilepay',
    'What a merchant needs to accept MobilePay QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '6 min read',
    '2027-01-28',
    `
A MobilePay QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. MobilePay is a mobile payment app associated with Denmark and Finland. Customers usually pay from a bank-linked app, so the merchant needs a clear code and a reliable confirmation step. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with MobilePay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the MobilePay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with MobilePay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues MobilePay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where MobilePay fits best

MobilePay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep MobilePay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use MobilePay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your MobilePay merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [coupon QR code generator](/coupon-qr-code-generator)
- [restaurant QR suite](/restaurant-qr-suite)
- [QR consent note builder](/qr-consent-note-builder)
- [UPI QR code generator](/upi-qr-code-generator)
- [QR size calculator](/qr-size-calculator)
- [QR placement guide](/qr-placement-guide)
- [blog](/blog)
`,
    [
      {
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a MobilePay payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed MobilePay code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-bizum',
    'QR Payments with Bizum: Setup, Fees, and Best Uses',
    'qr payments with bizum',
    'Set up Bizum QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '7 min read',
    '2027-01-28',
    `
For merchants whose customers already carry Bizum, accepting it can be as simple as printing one code and learning the confirmation screen. Bizum is a bank-linked instant payment service associated with Spain. Customers often pay using a phone number as the identifier, so the merchant code replaces sharing account details. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with Bizum works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Bizum app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Bizum

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Bizum merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Bizum fits best

Bizum fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Bizum as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Bizum, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Bizum merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [ticket QR code generator](/ticket-qr-code-generator)
- [hotel QR suite](/hotel-qr-suite)
- [QR checksum generator](/qr-checksum-generator)
- [regional payment QR guide](/regional-payment-qr)
- [bulk generator](/bulk-generator)
- [UTM builder](/utm-builder)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'How do I reconcile Bizum payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with Bizum?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside Bizum?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-twint',
    'QR Payments with Twint: Setup, Fees, and Best Uses',
    'qr payments with twint',
    'How QR payments with TWINT work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '5 min read',
    '2027-01-29',
    `
QR payments with TWINT follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the TWINT app or a participating bank app, and the payment is confirmed on screen. TWINT is a mobile payment app associated with Switzerland. Customers typically pay from a bank-linked wallet, so the merchant flow is a scan, a check, and a confirmation. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with TWINT works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the TWINT app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with TWINT

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues TWINT merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where TWINT fits best

TWINT fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep TWINT as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use TWINT, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your TWINT merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [loyalty card QR code generator](/loyalty-card-qr-code-generator)
- [salon QR suite](/salon-qr-suite)
- [QR expiry checker](/qr-expiry-checker)
- [Pakistan payment QR guide](/pakistan-payment-qr)
- [QR scanner](/qr-scanner)
- [QR size calculator](/qr-size-calculator)
- [printed QR tester](/printed-qr-tester)
`,
    [
      {
        question: 'Do customers need the TWINT app to pay?',
        answer:
          'In most setups the customer pays from the TWINT app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does TWINT charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-mb-way',
    'QR Payments with Mb Way: Setup, Fees, and Best Uses',
    'qr payments with mb way',
    'A plain-language guide to accepting MB Way by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '6 min read',
    '2027-01-29',
    `
If your customers use MB Way, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. MB Way is a mobile payment service associated with Portugal. Customers often pay using a phone number linked to their bank, so the merchant code keeps account details out of the conversation. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with MB Way works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the MB Way app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with MB Way

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues MB Way merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where MB Way fits best

MB Way fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep MB Way as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use MB Way, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your MB Way merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [feedback QR code generator](/feedback-qr-code-generator)
- [farm QR suite](/farm-qr-suite)
- [QR campaign planner](/qr-campaign-planner)
- [payment QR codes](/payment-qr)
- [QR placement guide](/qr-placement-guide)
- [bulk generator](/bulk-generator)
- [blog](/blog)
`,
    [
      {
        question: 'Can I put a MB Way QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with MB Way?',
        answer:
          'Refunds usually go through the same provider that processed the original payment, following that provider refund process. Ask your provider how refunds are started, how long they take, and whether the customer sees the refund in the same app. Keep the original payment reference, because it is what the provider will ask for.',
      },
      {
        question: 'Do I need a separate code for each till?',
        answer:
          'A separate code per till makes reconciliation easier, because you can tell which till took each payment. A single shared code is simpler to print, but it makes it harder to trace a disputed payment to one counter. For two or more tills, separate codes are usually worth the small extra effort.',
      },
    ]
  ),
  art(
    'qr-payments-with-bancontact',
    'QR Payments with Bancontact: Setup, Fees, and Best Uses',
    'qr payments with bancontact',
    'What a merchant needs to accept Bancontact QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '7 min read',
    '2027-01-29',
    `
A Bancontact QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. Bancontact is a card and mobile payment scheme associated with Belgium. Customers often pay from a bank app, so a printed merchant code at the till covers most counter payments. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with Bancontact works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Bancontact app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Bancontact

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Bancontact merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Bancontact fits best

Bancontact fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Bancontact as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Bancontact, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Bancontact merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [menu QR code generator](/menu-qr-code-generator)
- [taxi QR suite](/taxi-qr-suite)
- [QR analytics simulator](/qr-analytics-simulator)
- [UPI QR code generator](/upi-qr-code-generator)
- [QR safety checker](/qr-safety-checker)
- [QR size guide](/qr-size-guide)
- [QR scanner](/qr-scanner)
`,
    [
      {
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a Bancontact payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed Bancontact code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-blik',
    'QR Payments with BLIK: Setup, Fees, and Best Uses',
    'qr payments with blik',
    'Set up BLIK QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '5 min read',
    '2027-01-30',
    `
For merchants whose customers already carry BLIK, accepting it can be as simple as printing one code and learning the confirmation screen. BLIK is a mobile payment system associated with Poland. Customers often generate a short code in their bank app, so the merchant flow may use a customer-presented code rather than a printed one. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with BLIK works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the BLIK app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with BLIK

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues BLIK merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where BLIK fits best

BLIK fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep BLIK as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use BLIK, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your BLIK merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [bulk donation QR generator](/bulk-donation-qr-generator)
- [pharmacy QR suite](/pharmacy-qr-suite)
- [QR A/B test planner](/qr-a-b-test-planner)
- [regional payment QR guide](/regional-payment-qr)
- [printed QR tester](/printed-qr-tester)
- [UTM builder](/utm-builder)
- [blog](/blog)
`,
    [
      {
        question: 'How do I reconcile BLIK payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with BLIK?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside BLIK?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-mir',
    'QR Payments with MIR: Setup, Fees, and Best Uses',
    'qr payments with mir',
    'How QR payments with MIR work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '6 min read',
    '2027-01-30',
    `
QR payments with MIR follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the MIR app or a participating bank app, and the payment is confirmed on screen. MIR is a card payment system associated with Russia. QR flows tied to the card system let customers pay by scanning instead of presenting a card. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with MIR works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the MIR app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with MIR

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues MIR merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where MIR fits best

MIR fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep MIR as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use MIR, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your MIR merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [bulk coupon QR generator](/bulk-coupon-qr-generator)
- [museum QR suite](/museum-qr-suite)
- [QR batch validator](/qr-batch-validator)
- [Pakistan payment QR guide](/pakistan-payment-qr)
- [QR size calculator](/qr-size-calculator)
- [QR placement guide](/qr-placement-guide)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'Do customers need the MIR app to pay?',
        answer:
          'In most setups the customer pays from the MIR app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does MIR charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-fps',
    'QR Payments with FPS: Setup, Fees, and Best Uses',
    'qr payments with fps',
    'A plain-language guide to accepting FPS by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '7 min read',
    '2027-01-30',
    `
If your customers use FPS, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. FPS is a faster-payment system associated with Hong Kong. Customers often pay using a phone number, email, or account identifier, so the merchant code replaces sharing account details. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with FPS works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the FPS app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with FPS

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues FPS merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where FPS fits best

FPS fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep FPS as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use FPS, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your FPS merchant code shows your business name as the payee.
- The code is printed large enough to scan from a normal standing distance.
- The code sits flat, glare-free, and clear of folds or stickers.
- You have tested a live payment and confirmed it in your own account.
- Staff know the confirmation routine and the slow-confirmation fallback.
- Per-sale codes with the amount filled in are used for higher-value sales.
- You have read the current fee schedule, payout timing, and refund handling.

### Related tools and guides

- [bulk ticket QR generator](/bulk-ticket-qr-generator)
- [church QR suite](/church-qr-suite)
- [QR consent note builder](/qr-consent-note-builder)
- [payment QR codes](/payment-qr)
- [bulk generator](/bulk-generator)
- [QR scanner](/qr-scanner)
- [QR size guide](/qr-size-guide)
`,
    [
      {
        question: 'Can I put a FPS QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with FPS?',
        answer:
          'Refunds usually go through the same provider that processed the original payment, following that provider refund process. Ask your provider how refunds are started, how long they take, and whether the customer sees the refund in the same app. Keep the original payment reference, because it is what the provider will ask for.',
      },
      {
        question: 'Do I need a separate code for each till?',
        answer:
          'A separate code per till makes reconciliation easier, because you can tell which till took each payment. A single shared code is simpler to print, but it makes it harder to trace a disputed payment to one counter. For two or more tills, separate codes are usually worth the small extra effort.',
      },
    ]
  ),
];
