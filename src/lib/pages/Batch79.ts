import type { Article } from '../articles';
import { art } from './helper';

export const batch79: Article[] = [
  art(
    'qr-payments-with-fast',
    'QR Payments with FAST: Setup, Fees, and Best Uses',
    'qr payments with fast',
    'What a merchant needs to accept FAST QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '5 min read',
    '2027-01-31',
    `
A FAST QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. FAST is a fast bank-transfer service associated with Singapore. Customers typically pay from their bank app, so the merchant code needs to carry the right payee details. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with FAST works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the FAST app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with FAST

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues FAST merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where FAST fits best

FAST fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep FAST as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use FAST, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your FAST merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a FAST payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed FAST code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-duitnow',
    'QR Payments with Duitnow: Setup, Fees, and Best Uses',
    'qr payments with duitnow',
    'Set up DuitNow QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '6 min read',
    '2027-01-31',
    `
For merchants whose customers already carry DuitNow, accepting it can be as simple as printing one code and learning the confirmation screen. DuitNow is a national instant-transfer service associated with Malaysia. Customers often pay using a phone number or ID as the identifier, so the merchant shares a code rather than account numbers. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with DuitNow works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the DuitNow app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with DuitNow

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues DuitNow merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where DuitNow fits best

DuitNow fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep DuitNow as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use DuitNow, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your DuitNow merchant code shows your business name as the payee.
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
        question: 'How do I reconcile DuitNow payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with DuitNow?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside DuitNow?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-paylib',
    'QR Payments with Paylib: Setup, Fees, and Best Uses',
    'qr payments with paylib',
    'How QR payments with Paylib work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '7 min read',
    '2027-01-31',
    `
QR payments with Paylib follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the Paylib app or a participating bank app, and the payment is confirmed on screen. Paylib is a bank-linked payment service associated with France. Customers usually pay from their bank app using a phone number, so the merchant code keeps the flow short. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with Paylib works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Paylib app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Paylib

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Paylib merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Paylib fits best

Paylib fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Paylib as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Paylib, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Paylib merchant code shows your business name as the payee.
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
        question: 'Do customers need the Paylib app to pay?',
        answer:
          'In most setups the customer pays from the Paylib app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does Paylib charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-satispay',
    'QR Payments with Satispay: Setup, Fees, and Best Uses',
    'qr payments with satispay',
    'A plain-language guide to accepting Satispay by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '5 min read',
    '2027-02-01',
    `
If your customers use Satispay, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. Satispay is a wallet app associated with Italy. Customers typically pay from an app balance, so a printed merchant code at the till is enough to start. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with Satispay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Satispay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Satispay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Satispay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Satispay fits best

Satispay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Satispay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Satispay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your Satispay merchant code shows your business name as the payee.
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
        question: 'Can I put a Satispay QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with Satispay?',
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
    'qr-payments-with-yoomoney',
    'QR Payments with Yoomoney: Setup, Fees, and Best Uses',
    'qr payments with yoomoney',
    'What a merchant needs to accept YooMoney QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '6 min read',
    '2027-02-01',
    `
A YooMoney QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. YooMoney is a wallet service associated with Russia. Customers often pay from a wallet balance, so the merchant mainly needs a clear code and a confirmation routine. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with YooMoney works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the YooMoney app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with YooMoney

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues YooMoney merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where YooMoney fits best

YooMoney fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep YooMoney as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use YooMoney, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your YooMoney merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a YooMoney payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed YooMoney code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-rakuten-pay',
    'QR Payments with Rakuten Pay: Setup, Fees, and Best Uses',
    'qr payments with rakuten pay',
    'Set up Rakuten Pay QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '7 min read',
    '2027-02-01',
    `
For merchants whose customers already carry Rakuten Pay, accepting it can be as simple as printing one code and learning the confirmation screen. Rakuten Pay is a wallet app associated with Japan. Customers typically pay from a wallet tied to a loyalty account, so the receipt step matters for points as well as payment. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with Rakuten Pay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Rakuten Pay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Rakuten Pay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Rakuten Pay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Rakuten Pay fits best

Rakuten Pay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Rakuten Pay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Rakuten Pay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Rakuten Pay merchant code shows your business name as the payee.
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
        question: 'How do I reconcile Rakuten Pay payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with Rakuten Pay?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside Rakuten Pay?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-line-pay',
    'QR Payments with Line Pay: Setup, Fees, and Best Uses',
    'qr payments with line pay',
    'How QR payments with LINE Pay work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '5 min read',
    '2027-02-02',
    `
QR payments with LINE Pay follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the LINE Pay app or a participating bank app, and the payment is confirmed on screen. LINE Pay is a wallet inside a messaging app associated with Japan, Taiwan, and Thailand. Customers often pay from inside an app they already use daily, so the scan step feels familiar. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with LINE Pay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the LINE Pay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with LINE Pay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues LINE Pay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where LINE Pay fits best

LINE Pay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep LINE Pay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use LINE Pay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your LINE Pay merchant code shows your business name as the payee.
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
        question: 'Do customers need the LINE Pay app to pay?',
        answer:
          'In most setups the customer pays from the LINE Pay app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does LINE Pay charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-naver-pay',
    'QR Payments with Naver Pay: Setup, Fees, and Best Uses',
    'qr payments with naver pay',
    'A plain-language guide to accepting Naver Pay by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '6 min read',
    '2027-02-02',
    `
If your customers use Naver Pay, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. Naver Pay is a wallet service associated with South Korea. Customers often pay from a wallet tied to an account they already use for shopping and services. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with Naver Pay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Naver Pay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Naver Pay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Naver Pay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Naver Pay fits best

Naver Pay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Naver Pay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Naver Pay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your Naver Pay merchant code shows your business name as the payee.
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
        question: 'Can I put a Naver Pay QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with Naver Pay?',
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
    'qr-payments-with-toss-pay',
    'QR Payments with Toss Pay: Setup, Fees, and Best Uses',
    'qr payments with toss pay',
    'What a merchant needs to accept Toss Pay QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '7 min read',
    '2027-02-02',
    `
A Toss Pay QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. Toss Pay is a wallet and finance app associated with South Korea. Customers typically pay from an app they already use for money tasks, so a printed merchant code fits the counter flow. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with Toss Pay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Toss Pay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Toss Pay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Toss Pay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Toss Pay fits best

Toss Pay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Toss Pay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Toss Pay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Toss Pay merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a Toss Pay payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed Toss Pay code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-payconiq',
    'QR Payments with Payconiq: Setup, Fees, and Best Uses',
    'qr payments with payconiq',
    'Set up Payconiq QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '5 min read',
    '2027-02-03',
    `
For merchants whose customers already carry Payconiq, accepting it can be as simple as printing one code and learning the confirmation screen. Payconiq is a mobile payment app associated with Belgium, the Netherlands, and Luxembourg. Customers usually pay from a bank-linked app, so the merchant code centres on a clear payee and amount. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with Payconiq works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Payconiq app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Payconiq

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Payconiq merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Payconiq fits best

Payconiq fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Payconiq as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Payconiq, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your Payconiq merchant code shows your business name as the payee.
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
        question: 'How do I reconcile Payconiq payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with Payconiq?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside Payconiq?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
];
