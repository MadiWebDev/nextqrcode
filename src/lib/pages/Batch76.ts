import type { Article } from '../articles';
import { art } from './helper';

export const batch76: Article[] = [
  art(
    'qr-payments-with-pix',
    'QR Payments with PIX: Setup, Fees, and Best Uses',
    'qr payments with pix',
    'How QR payments with PIX work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '5 min read',
    '2027-01-21',
    `
QR payments with PIX follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the PIX app or a participating bank app, and the payment is confirmed on screen. PIX is an instant bank-transfer system associated with Brazil. A customer usually pays from their own bank app, so the merchant does not need special hardware. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with PIX works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the PIX app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with PIX

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues PIX merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where PIX fits best

PIX fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep PIX as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use PIX, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your PIX merchant code shows your business name as the payee.
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
        question: 'Do customers need the PIX app to pay?',
        answer:
          'In most setups the customer pays from the PIX app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does PIX charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-promptpay',
    'QR Payments with Promptpay: Setup, Fees, and Best Uses',
    'qr payments with promptpay',
    'A plain-language guide to accepting PromptPay by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '6 min read',
    '2027-01-21',
    `
If your customers use PromptPay, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. PromptPay is a national proxy-payment service associated with Thailand. Customers often pay using a phone number or national ID as the identifier, so the merchant shares a code rather than account numbers. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with PromptPay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the PromptPay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with PromptPay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues PromptPay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where PromptPay fits best

PromptPay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep PromptPay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use PromptPay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your PromptPay merchant code shows your business name as the payee.
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
        question: 'Can I put a PromptPay QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with PromptPay?',
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
    'qr-payments-with-m-pesa',
    'QR Payments with M Pesa: Setup, Fees, and Best Uses',
    'qr payments with m pesa',
    'What a merchant needs to accept M-Pesa QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '7 min read',
    '2027-01-21',
    `
A M-Pesa QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. M-Pesa is a mobile-money service associated with Kenya. Many customers pay from a mobile-money balance rather than a bank account, which shapes how confirmations look. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with M-Pesa works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the M-Pesa app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with M-Pesa

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues M-Pesa merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where M-Pesa fits best

M-Pesa fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep M-Pesa as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use M-Pesa, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your M-Pesa merchant code shows your business name as the payee.
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
        question: 'What if the internet connection drops during a M-Pesa payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed M-Pesa code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-wechat-pay',
    'QR Payments with Wechat Pay: Setup, Fees, and Best Uses',
    'qr payments with wechat pay',
    'Set up WeChat Pay QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '5 min read',
    '2027-01-22',
    `
For merchants whose customers already carry WeChat Pay, accepting it can be as simple as printing one code and learning the confirmation screen. WeChat Pay is a wallet inside a messaging app associated with China. Customers typically pay from inside an app they already use every day, so the scan step feels familiar. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with WeChat Pay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the WeChat Pay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with WeChat Pay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues WeChat Pay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where WeChat Pay fits best

WeChat Pay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep WeChat Pay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use WeChat Pay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your WeChat Pay merchant code shows your business name as the payee.
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
        question: 'How do I reconcile WeChat Pay payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with WeChat Pay?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside WeChat Pay?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-alipay',
    'QR Payments with Alipay: Setup, Fees, and Best Uses',
    'qr payments with alipay',
    'How QR payments with Alipay work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '6 min read',
    '2027-01-22',
    `
QR payments with Alipay follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the Alipay app or a participating bank app, and the payment is confirmed on screen. Alipay is a large wallet app associated with China. Merchant codes are often displayed at the till, and the customer scans with a wallet app they already use. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with Alipay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Alipay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Alipay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Alipay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Alipay fits best

Alipay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Alipay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Alipay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your Alipay merchant code shows your business name as the payee.
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
        question: 'Do customers need the Alipay app to pay?',
        answer:
          'In most setups the customer pays from the Alipay app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does Alipay charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-paypay',
    'QR Payments with Paypay: Setup, Fees, and Best Uses',
    'qr payments with paypay',
    'A plain-language guide to accepting PayPay by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '7 min read',
    '2027-01-22',
    `
If your customers use PayPay, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. PayPay is a wallet app associated with Japan. A printed code at the till lets customers pay without the merchant handling cash. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with PayPay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the PayPay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with PayPay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues PayPay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where PayPay fits best

PayPay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep PayPay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use PayPay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your PayPay merchant code shows your business name as the payee.
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
        question: 'Can I put a PayPay QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with PayPay?',
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
    'qr-payments-with-kakaopay',
    'QR Payments with Kakaopay: Setup, Fees, and Best Uses',
    'qr payments with kakaopay',
    'What a merchant needs to accept KakaoPay QR payments: provider setup, printed codes, confirmations, and reconciliation.',
    'Business & Regional',
    '5 min read',
    '2027-01-23',
    `
A KakaoPay QR payment is a scan, a check, and a confirmation. The merchant presents a code, the customer scans it, and both sides see the result. KakaoPay is a wallet app associated with South Korea. Customers often pay from a wallet tied to an app they already use for messaging and daily tasks. Before you rely on it, it helps to understand what the customer sees, how you confirm the payment, and which settings matter most.

### How a QR payment with KakaoPay works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the KakaoPay app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with KakaoPay

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues KakaoPay merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where KakaoPay fits best

KakaoPay fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep KakaoPay as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use KakaoPay, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your KakaoPay merchant code shows your business name as the payee.
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
        question: 'Should the amount be filled in, or should the customer type it?',
        answer:
          'A filled-in amount is safer for anything above a trivial sum, because it removes typing errors. A blank-amount code suits a counter where the customer pays the same small price each time, but it relies on the customer entering the amount correctly. Where your provider supports per-sale codes, use them for invoices, deliveries, and higher-value sales.',
      },
      {
        question: 'What if the internet connection drops during a KakaoPay payment?',
        answer:
          'Wait for your own merchant confirmation before treating the sale as complete, and keep a written note of any reference the customer can show. A payment can look sent on the customer side while the merchant side has not updated yet. Agree a fallback in advance, such as asking the customer to wait a moment, retrying, or using another payment method.',
      },
      {
        question: 'How do I stop someone swapping my printed KakaoPay code?',
        answer:
          'Check the code at the start of each day and compare it against a spare copy kept behind the counter. Fix the code to the counter or frame it so a sticker cannot be laid over it unnoticed, and teach staff to look for overlays. A tampered code is a real risk in public spaces, so a quick daily check is cheap insurance.',
      },
    ]
  ),
  art(
    'qr-payments-with-gcash',
    'QR Payments with Gcash: Setup, Fees, and Best Uses',
    'qr payments with gcash',
    'Set up GCash QR payments with confidence, from your first merchant code to a reliable daily confirmation routine.',
    'Business & Regional',
    '6 min read',
    '2027-01-23',
    `
For merchants whose customers already carry GCash, accepting it can be as simple as printing one code and learning the confirmation screen. GCash is a mobile wallet associated with the Philippines. Customers often pay from a wallet balance on their phone, so a printed code at the counter is enough to get started. This article walks through the flow, the setup, and a practical checklist for the first week.

### How a QR payment with GCash works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the GCash app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with GCash

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues GCash merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where GCash fits best

GCash fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep GCash as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use GCash, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Start with a single till and a single printed code. Run a small live payment with a second phone, confirm the money lands in the right account, and show every person who takes payments how to check the merchant confirmation. Keep a notebook by the till for the first week and log anything odd, such as a slow confirmation or a customer who scanned the wrong code. That log is what turns a rough first week into a reliable routine.

### Common mistakes to avoid

Three mistakes cause most QR payment trouble. The first is a code printed too small or placed where glare hits it, so customers scan repeatedly and give up. The second is no agreed fallback when a confirmation is slow, which leaves staff improvising under pressure. The third is skipping the daily reconciliation, so a missing payment is only noticed days later when nobody remembers the sale. Fix those three and most days run without drama.

### Quick checklist

- Your GCash merchant code shows your business name as the payee.
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
        question: 'How do I reconcile GCash payments at the end of the day?',
        answer:
          'Compare the receipts or provider statement against your till record for the day, and chase anything that does not match while the details are fresh. A short daily check catches a missing, duplicated, or mis-keyed payment before it becomes a dispute. Keep the habit even on quiet days, because that is when a single missing payment is easiest to spot.',
      },
      {
        question: 'Can visitors from another country pay with GCash?',
        answer:
          'It depends on whether their bank or wallet app supports the code your merchant setup produces, so do not assume it will work. Keep a second payment option for visitors, and label the code clearly so a visitor can tell before scanning whether it applies to them. If visitors are a large share of your sales, ask your provider which customer apps can scan your code.',
      },
      {
        question: 'Should I still accept cash alongside GCash?',
        answer:
          'Keeping cash as an option is sensible while some customers lack a suitable app, have a dead battery, or simply prefer cash. QR payments reduce cash handling rather than replacing it overnight. Decide which method is the default for each sale type, and make sure staff apply the rule consistently.',
      },
    ]
  ),
  art(
    'qr-payments-with-paytm',
    'QR Payments with Paytm: Setup, Fees, and Best Uses',
    'qr payments with paytm',
    'How QR payments with Paytm work, how to set up a merchant code, and where this payment method fits best.',
    'Business & Regional',
    '7 min read',
    '2027-01-23',
    `
QR payments with Paytm follow a simple scan-to-pay pattern: the merchant shows a code, the customer scans it with the Paytm app or a participating bank app, and the payment is confirmed on screen. Paytm is a wallet and payments app associated with India. A merchant code at the counter lets customers pay from a wallet or a linked bank account. This guide explains how the flow works, how a merchant sets it up, and where this kind of payment fits best.

### How a QR payment with Paytm works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the Paytm app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with Paytm

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues Paytm merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where Paytm fits best

Paytm fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep Paytm as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use Paytm, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Before you print a full batch, test one code end to end. Generate it, print it at the real size, scan it with two different phones in the real lighting, and confirm the payee name and amount look right. Then run one genuine small payment and reconcile it against your statement. A twenty-minute test now saves a day of untangling payments later.

### Common mistakes to avoid

Watch out for a code that has been swapped or covered. In a public space, check the code at the start of each day and compare it with a spare copy you keep behind the counter. Also watch for amount errors: when customers type the amount by hand, a missing digit is easy. Where your provider supports it, generate per-sale codes with the amount filled in for anything above a trivial sum. And keep the code away from the edge of a sign where it can be trimmed or folded.

### Quick checklist

- Your Paytm merchant code shows your business name as the payee.
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
        question: 'Do customers need the Paytm app to pay?',
        answer:
          'In most setups the customer pays from the Paytm app or a participating bank app that can read the code. Ask your provider which apps can scan your merchant code, and signpost the answer at the till. Customers who do not have a suitable app will need your second payment option.',
      },
      {
        question: 'What should I do if a customer says the payment went through but I see nothing?',
        answer:
          'Ask the customer to wait while you check your own merchant confirmation and statement, and do not hand over goods on the strength of a customer screen alone. If the payment truly went through, it usually appears shortly or the provider can trace it from the reference. Keep a written note of the time, amount, and any reference shown.',
      },
      {
        question: 'Does Paytm charge the merchant a fee?',
        answer:
          'Fee terms depend on your provider and agreement, so check the current fee schedule before you set prices. Ask about any per-transaction charge, monthly charge, payout timing, and refund handling. A fee quoted by another merchant may not match your own agreement, so rely on your own paperwork.',
      },
    ]
  ),
  art(
    'qr-payments-with-phonepe',
    'QR Payments with Phonepe: Setup, Fees, and Best Uses',
    'qr payments with phonepe',
    'A plain-language guide to accepting PhonePe by QR: the scan-to-pay flow, setup steps, fees to check, and pitfalls.',
    'Business & Regional',
    '5 min read',
    '2027-01-24',
    `
If your customers use PhonePe, a QR code at the till can be a short path to a completed sale. The customer opens the app they already use, scans your code, checks the payee and amount, and confirms. PhonePe is a payments app associated with India. Merchant codes are commonly printed and placed at the till for customers to scan. The sections below cover the flow, the setup steps, fees to check, and the mistakes that cause failed payments.

### How a QR payment with PhonePe works

The flow has the same four steps in almost every setting:

1. **The merchant shows a code.** This can be a printed code fixed to the counter, a code on a small stand, or a code generated for one specific sale with the amount already filled in.
2. **The customer scans it.** The customer opens the PhonePe app or a participating bank app, points the camera at the code, and the app reads the payment details.
3. **The customer checks and confirms.** The app shows the payee name and the amount. The customer confirms the payment, often with a PIN, fingerprint, or face check.
4. **Both sides see a confirmation.** The customer sees a success screen, and the merchant checks their own confirmation before handing over the goods.

Two details make the difference between a smooth till and a disputed sale. First, a code with the amount already filled in removes the most common error, which is the customer typing the wrong amount. Second, the merchant should confirm the payment in their own app or on their own receipt record, not only by glancing at the customer phone screen. A customer screen can be faked or can show an older payment, so your own confirmation is the one that counts.

If your setup supports both a printed merchant code and a customer-presented code, learn which one your provider expects for each sale type. A printed merchant code suits counter sales, while a customer-presented code suits situations where the merchant scans the customer phone. Mixing them up is a common cause of a failed first attempt.

### Setting up QR payments with PhonePe

Follow these steps in order, and test with a small real payment before you rely on the code for a full day of trade:

1. **Check what your provider supports.** Your bank, wallet provider, or payment provider can tell you whether it issues PhonePe merchant codes, what the customer sees, and how merchant confirmations arrive.
2. **Complete verification.** Most providers ask for business or identity details before issuing a merchant code. Gather the documents first so the application is not left half finished.
3. **Get your merchant code.** Ask for a code that shows your business name as the payee. A code that shows a bare account number or an unfamiliar name will make customers hesitate.
4. **Decide between a fixed code and per-sale codes.** A fixed printed code suits a counter where customers enter the amount. A per-sale code with the amount filled in suits invoices, deliveries, and higher-value sales where a typo would be costly.
5. **Print and place it.** Print at a size that scans comfortably from a normal standing distance, keep the code flat and glare-free, and place it where the customer naturally stands to pay.
6. **Run a live test.** Pay yourself a small amount with a different phone, check that the merchant confirmation arrives, and confirm the money lands in the expected account.
7. **Train anyone who takes payments.** Everyone at the till should know the confirmation routine, the fallback when a confirmation is slow, and how to handle a customer who says the payment went through but your side shows nothing.
8. **Reconcile daily.** Compare the day QR receipts against your provider statement. A short daily check catches a missing or duplicated payment while the details are still fresh.

On fees, do not guess. Ask your provider for the current fee schedule, including any per-transaction charge, monthly charge, payout timing, and refund handling, and read it before you set prices. Fee terms change, and a fee quoted by another merchant may not match your own agreement.

### Where PhonePe fits best

PhonePe fits best where your customers already use it. Counter sales are the natural starting point: the customer is standing in front of you, the amount is clear, and the scan takes seconds. It also suits invoices and deliveries, where a code on the invoice lets the customer pay from their phone without a return visit, and a code on a delivery note covers payment on handover.

It suits less well where the amount is not known until late, where several people share one till, or where the customer needs a formal receipt from a separate system. In those cases, keep PhonePe as one option alongside your existing method, and decide in advance which method is the default for each sale type. A mixed setup works when staff know the rule; it fails when every sale becomes a negotiation about how to pay.

If some customers do not use PhonePe, keep a second option available and signpost both. A customer who cannot pay is a lost sale, and a short sign that names each accepted method prevents an awkward conversation at the till.

### Putting this into practice

Pick one counter, one code, and one confirmation routine, and run it for a week. Print the code at the size you will actually use, test it with two different phones, and write down the exact steps staff should follow when a confirmation is slow. At the end of the week, compare the QR receipts against your statement and fix whatever caused the most friction before you roll the setup out to other tills.

### Common mistakes to avoid

The most common mistake is trusting the customer phone screen alone. A screenshot or an older confirmation can look convincing, so always check your own merchant confirmation before handing over goods. The next most common mistake is a code that shows the wrong payee name, which makes careful customers refuse to pay and sends others to the wrong account. Test the code yourself before it goes public. Finally, do not let the printed code fade, curl, or sit behind glare: a code that fails three times in a row will push customers back to cash.

### Quick checklist

- Your PhonePe merchant code shows your business name as the payee.
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
        question: 'Can I put a PhonePe QR code on an invoice?',
        answer:
          'Yes, a code on an invoice lets the customer pay from their phone without a return visit. Where your provider supports it, generate a per-sale code with the amount already filled in, so the customer cannot mistype it. Print the business name beside the code so the customer can confirm the payee before confirming.',
      },
      {
        question: 'How do refunds work with PhonePe?',
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
