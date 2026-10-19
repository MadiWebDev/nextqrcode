import type { Article } from '../articles';
import { art } from './helper';

export const batch77: Article[] = [
  art(
    'qr-payments-with-dana',
    'QR Payments with DANA: Setup, Fees, and Best Uses',
    'qr payments with dana',
    'What a merchant needs to accept DANA QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '6 min read',
    '2027-01-24',
    `
A DANA QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. DANA is a wallet app associated with Indonesia. Customers typically pay from a wallet balance, so the merchant only needs a printed code and a way to check confirmations. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with DANA works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the DANA app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with DANA

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues DANA merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where DANA fits best

DANA fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep DANA as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use DANA, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your DANA merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a DANA payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed DANA code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-ovo',
    'QR Payments with OVO: Setup, Fees, and Best Uses',
    'qr payments with ovo',
    'Set up OVO QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '7 min read',
    '2027-01-24',
    `
For merchants whose customers already carry OVO, accepting it can be as simple as printing one code and learning the confirmation screen. OVO is a wallet app associated with Indonesia. A printed code at the till lets customers pay from a wallet they already use. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with OVO works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the OVO app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with OVO

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues OVO merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where OVO fits best

OVO fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep OVO as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use OVO, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your OVO merchant code shows your business name as the payee.
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
        question: 'How do I reconcile OVO payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with OVO?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside OVO?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-touch-n-go',
    'QR Payments with Touch N Go: Setup, Fees, and Best Uses',
    'qr payments with touch n go',
    'How QR payments with Touch n Go work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '5 min read',
    '2027-01-25',
    `
QR payments with Touch n Go follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the Touch n Go app or a participating bank app, and the payment is confirmed on screen. Touch n Go is a wallet and card ecosystem associated with Malaysia. Customers often pay from a wallet balance, so a printed code at the counter covers most everyday purchases. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with Touch n Go works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Touch n Go app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Touch n Go

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Touch n Go merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Touch n Go fits best

Touch n Go fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Touch n Go as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Touch n Go, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your Touch n Go merchant code shows your business name as the payee.
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
        question: 'Do customers need the Touch n Go app to pay?',
        answer:
          'In most setups the customer pays from the Touch n Go app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does Touch n Go charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-vietqr',
    'QR Payments with Vietqr: Setup, Fees, and Best Uses',
    'qr payments with vietqr',
    'A plain-language guide to accepting VietQR by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '6 min read',
    '2027-01-25',
    `
If your customers use VietQR, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. VietQR is a national QR standard associated with Vietnam. A single standard code can work across participating bank apps, which simplifies the till for the merchant. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with VietQR works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the VietQR app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with VietQR

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues VietQR merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where VietQR fits best

VietQR fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep VietQR as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use VietQR, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your VietQR merchant code shows your business name as the payee.
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
        question: 'Can I put a VietQR QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with VietQR?',
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
    'qr-payments-with-qrph',
    'QR Payments with QRPH: Setup, Fees, and Best Uses',
    'qr payments with qrph',
    'What a merchant needs to accept QRPH QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '7 min read',
    '2027-01-25',
    `
A QRPH QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. QRPH is a national QR standard associated with the Philippines. One standard code can be scanned from participating apps, so the merchant does not need a separate code per app. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with QRPH works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the QRPH app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with QRPH

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues QRPH merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where QRPH fits best

QRPH fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep QRPH as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use QRPH, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your QRPH merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a QRPH payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed QRPH code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-sgqr',
    'QR Payments with SGQR: Setup, Fees, and Best Uses',
    'qr payments with sgqr',
    'Set up SGQR QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '5 min read',
    '2027-01-26',
    `
For merchants whose customers already carry SGQR, accepting it can be as simple as printing one code and learning the confirmation screen. SGQR is a national QR standard associated with Singapore. One combined code can cover several participating payment options, which keeps a small counter tidy. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with SGQR works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the SGQR app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with SGQR

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues SGQR merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where SGQR fits best

SGQR fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep SGQR as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use SGQR, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your SGQR merchant code shows your business name as the payee.
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
        question: 'How do I reconcile SGQR payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with SGQR?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside SGQR?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-khqr',
    'QR Payments with KHQR: Setup, Fees, and Best Uses',
    'qr payments with khqr',
    'How QR payments with KHQR work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '6 min read',
    '2027-01-26',
    `
QR payments with KHQR follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the KHQR app or a participating bank app, and the payment is confirmed on screen. KHQR is a national QR standard associated with Cambodia. A standard code lets customers pay from participating bank and wallet apps without the merchant printing many codes. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with KHQR works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the KHQR app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with KHQR

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues KHQR merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where KHQR fits best

KHQR fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep KHQR as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use KHQR, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your KHQR merchant code shows your business name as the payee.
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
        question: 'Do customers need the KHQR app to pay?',
        answer:
          'In most setups the customer pays from the KHQR app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does KHQR charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-laoqr',
    'QR Payments with Laoqr: Setup, Fees, and Best Uses',
    'qr payments with laoqr',
    'A plain-language guide to accepting LaoQR by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '7 min read',
    '2027-01-26',
    `
If your customers use LaoQR, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. LaoQR is a national QR standard associated with Laos. A standard code keeps the till simple when customers use different participating apps. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with LaoQR works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the LaoQR app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with LaoQR

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues LaoQR merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where LaoQR fits best

LaoQR fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep LaoQR as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use LaoQR, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your LaoQR merchant code shows your business name as the payee.
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
        question: 'Can I put a LaoQR QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with LaoQR?',
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
    'qr-payments-with-emvco',
    'QR Payments with Emvco: Setup, Fees, and Best Uses',
    'qr payments with emvco',
    'What a merchant needs to accept EMVCo QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '5 min read',
    '2027-01-27',
    `
A EMVCo QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. EMVCo is a global QR specification associated with international. The specification describes how merchant-presented and customer-presented codes should be structured, which helps different apps read the same code. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with EMVCo works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the EMVCo app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with EMVCo

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues EMVCo merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where EMVCo fits best

EMVCo fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep EMVCo as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use EMVCo, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your EMVCo merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a EMVCo payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed EMVCo code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-mvisa',
    'QR Payments with Mvisa: Setup, Fees, and Best Uses',
    'qr payments with mvisa',
    'Set up mVisa QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '6 min read',
    '2027-01-27',
    `
For merchants whose customers already carry mVisa, accepting it can be as simple as printing one code and learning the confirmation screen. mVisa is a card-network QR approach associated with international. The approach ties a QR payment to a card account, so customers pay by scanning rather than tapping or inserting a card. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with mVisa works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the mVisa app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with mVisa

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues mVisa merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where mVisa fits best

mVisa fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep mVisa as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use mVisa, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your mVisa merchant code shows your business name as the payee.
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
        question: 'How do I reconcile mVisa payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with mVisa?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside mVisa?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
];
