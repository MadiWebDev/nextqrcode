import type { Article } from '../articles';
import { art } from './helper';

export const batch138: Article[] = [
  art(
    'why-your-qr-code-scans-but-the-wifi-will-not-connect',
    'Why Your QR Code Scans But The Wifi Will Not Connect and How to Fix It',
    'why your qr code scans but the wifi will not connect',
    'Diagnose a code that scans but the WiFi will not connect: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-15',
    `
### What you are seeing

The code scans, but the phone will not join the WiFi network: nothing happens, an error appears, or the phone asks for a password the code was meant to supply. The scan worked, so the fault sits in the WiFi payload: the network name, the password, the security type, or the way the phone handles the join request. WiFi codes fail silently more than most, because the phone often shows no clear error. The fix is to decode the payload and to check every field against the real network settings.

### Likely causes

1. **Wrong network name in the payload** — A network name with a typo, a missing character, or the wrong capitalisation points the phone at a network that does not exist. Test: decode the payload and compare the name with the router settings.
2. **Wrong password in the payload** — A password with a typo or an outdated value makes the phone fail to join without a clear error. Test: join the network manually with the same password.
3. **Wrong security type** — A payload that names the wrong security type, such as the wrong WPA variant, can fail on phones that enforce the type. Test: check the security type in the router settings.
4. **Non-standard payload format** — A hand-typed WiFi payload with a wrong field order or separator can fail on one platform and work on another. Test: decode the payload and compare it with the standard format.
5. **Phone already knows the network differently** — A phone that already has a saved entry for the network, with an old password, can ignore the code or clash with it. Test: forget the network on the phone and scan again.

### Step-by-step fix

1. Decode the payload and write down the network name, password, and security type it carries.
2. Compare every field with the router settings, including capitalisation.
3. Join the network manually with the same password to confirm the network itself works.
4. Rebuild the code with the WiFi generator in the standard format.
5. Forget the network on the test phone, then scan the rebuilt code.
6. Retest on two phones that have never joined the network.

### Putting this into practice

In practice, never hand-type a WiFi payload. The format is fussy about separators, field order, and escaping, and a single misplaced character breaks the join. Use the WiFi generator, copy the network name and password from the router settings, and test on a phone that has never joined the network. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Testing a WiFi code on a phone that already knows the network, so a broken payload appears to work.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the WiFi will not connect will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the WiFi will not connect.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded network name, password, and security type match the router
- The code is built in the standard format
- Two fresh phones join from the scan alone
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [WiFi QR code generator](/wifi-qr-code-generator)
- [bulk WiFi QR generator](/bulk-wifi-qr-generator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'Why does my QR code scan but the WiFi will not connect?',
        answer:
          'The payload may carry the wrong network name, password, or security type, the format may be non-standard, or the phone may have a stale saved entry for the network. Decode the payload, compare every field with the router settings, and test on a phone that has forgotten the network.',
      },
      {
        question: 'Can a QR code join a hidden WiFi network?',
        answer:
          'It can, when the payload marks the network as hidden and carries the correct name, password, and security type. Hidden networks are less forgiving of payload errors, so build the code with the generator and test it on a phone that has never joined the network.',
      },
      {
        question: 'Why does a WiFi QR code work on one phone but not another?',
        answer:
          'The platforms handle the WiFi payload differently, and a non-standard format can pass on one and fail on the other. Rebuild the code in the standard format with the generator, and test on both platforms before printing.',
      },
    ]
  ),
  art(
    'scans-but-the-wifi-will-not-connect-step-by-step-fix',
    'Scans But The Wifi Will Not Connect: Step-by-Step Fix',
    'scans but the wifi will not connect step by step fix',
    'Repair a code that scans but the WiFi will not connect with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-16',
    `
### What you are seeing

This fix makes the WiFi code join the network. You will decode the payload, compare every field with the router settings, and rebuild the code in the standard format. Verify the fix by scanning with a phone that has never joined the network, because a phone that already knows the network can hide a payload fault.

### Likely causes

1. **Wrong network name in the payload** — Quick test: decode the payload and compare the name with the router settings.
2. **Wrong password in the payload** — Quick test: join the network manually with the same password.
3. **Wrong security type** — Quick test: check the security type in the router settings.
4. **Non-standard payload format** — Quick test: decode the payload and compare it with the standard format.
5. **Phone already knows the network differently** — Quick test: forget the network on the phone and scan again.

### Step-by-step fix

Step 1: Decode the payload and write down the network name, password, and security type it carries.
Step 2: Compare every field with the router settings, including capitalisation and special characters.
Step 3: Join the network manually with the same password. If that fails, the network details are wrong.
Step 4: Forget the network on the test phone so the phone has no saved entry to hide behind.
Step 5: Rebuild the code with the WiFi generator in the standard format, using the verified details.
Step 6: Scan the rebuilt code on a phone that has never joined the network.
Step 7: Retest on two phones, and confirm each one joins the network from the scan alone.

### Putting this into practice

In practice, test WiFi codes on a forgetful phone: forget the network, scan, and confirm the join. A phone that already knows the network will join regardless of what the code carries, which hides a broken payload until a real visitor tries it. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Testing a WiFi code on a phone that already knows the network, so a broken payload appears to work.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the WiFi will not connect will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the WiFi will not connect.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded network name, password, and security type match the router
- The code is built in the standard format
- Two fresh phones join from the scan alone
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [WiFi QR code generator](/wifi-qr-code-generator)
- [bulk WiFi QR generator](/bulk-wifi-qr-generator)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
`,
    [
      {
        question: 'How do I fix a QR code where the WiFi will not connect?',
        answer:
          'Decode the payload, compare the network name, password, and security type with the router settings, and rebuild the code with the WiFi generator. Forget the network on the test phone, scan the rebuilt code, and confirm the join on two phones.',
      },
      {
        question: 'Should I hand-type a WiFi QR payload?',
        answer:
          'No. Hand-typed payloads are where the format errors hide. Use the WiFi generator, which produces the standard layout, and copy the network details from the router settings rather than from memory.',
      },
      {
        question: 'How do I test a WiFi QR code honestly?',
        answer:
          'Forget the network on the test phone, then scan the code and confirm the phone joins from the scan alone. Test on two phones that have never joined the network. A phone that already knows the network proves nothing.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-contact-will-not-save',
    'Why Your QR Code Scans But The Contact Will Not Save and How to Fix It',
    'why your qr code scans but the contact will not save',
    'Diagnose a code that scans but the contact will not save: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-16',
    `
### What you are seeing

The code scans, but the contact does not save: the phone shows nothing, shows a garbled entry, or saves a contact with missing fields. The scan worked, so the fault sits in the contact payload: the format, the field names, or a character the phone cannot parse. Contact codes come in two main formats, and a payload that mixes them or mistypes a field can fail on one platform while working on another. The fix is to decode the payload and to rebuild it in the clean standard format.

### Likely causes

1. **Mixed or non-standard format** — A payload that mixes two contact formats, or uses a field the phone does not recognise, can fail or save a partial entry. Test: decode the payload and compare it with the standard format.
2. **Field name the phone does not recognise** — A mistyped or unusual field name can make the phone drop that field or the whole entry. Test: check each field name against the standard list.
3. **Special characters breaking the format** — A comma, semicolon, or line break inside a value can break the field structure if it is not escaped. Test: try a simple contact with plain characters and compare.
4. **Too many fields for the phone to handle** — A contact packed with every possible field can trip a limit or a parsing fault on some phones. Test: try a minimal contact with name and phone only.
5. **Phone permission or app handling** — A phone that blocks the contacts app, or an app that handles the scan instead of the contacts app, can stop the save. Test: check whether the phone shows a save prompt at all.

### Step-by-step fix

1. Decode the payload and write down every field it carries.
2. Compare the format and the field names with the standard contact format.
3. Rebuild the contact with the contact generator, using plain characters where possible.
4. Test a minimal contact first: name and phone only.
5. Add the remaining fields one group at a time and retest after each group.
6. Retest the full contact on two phones and confirm every field lands correctly.

### Putting this into practice

In practice, start minimal and add fields until it breaks. A contact with name and phone that saves tells you the format works; the field that breaks the save when you add it is the culprit. That approach finds the fault faster than staring at a long payload. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Packing every possible field into a contact code and never testing whether it saves on a real phone.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the contact will not save will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the contact will not save.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload uses the standard contact format
- A minimal contact saves on two phones
- The full contact saves with every field in place
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [MeCard QR code generator](/mecard-qr-code-generator)
- [vCard QR code generator](/vcard-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code scan but the contact will not save?',
        answer:
          'The payload may mix formats, use a field name the phone does not recognise, contain a special character that breaks the structure, or pack in too many fields. Decode the payload, compare it with the standard format, and rebuild it with the contact generator.',
      },
      {
        question: 'Should I use vCard or MeCard for a contact QR code?',
        answer:
          "Use the format your generator produces and your audience's phones support. The compact format suits older phones, while the fuller format carries more fields. Either way, test the saved contact on two phones, because a payload that looks right can still fail to save.",
      },
      {
        question: 'Why does a contact save on one phone but not another?',
        answer:
          'The platforms parse contact payloads differently, and a non-standard field or an unescaped character can fail on one and pass on the other. Rebuild the payload in the standard format and test on both platforms.',
      },
    ]
  ),
  art(
    'scans-but-the-contact-will-not-save-step-by-step-fix',
    'Scans But The Contact Will Not Save: Step-by-Step Fix',
    'scans but the contact will not save step by step fix',
    'Repair a code that scans but the contact will not save with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-16',
    `
### What you are seeing

This fix makes the contact code save a complete, correct contact. You will decode the payload, compare it with the standard format, and rebuild it with the contact generator. Verify the fix by scanning and confirming every field lands in the right place on two phones.

### Likely causes

1. **Mixed or non-standard format** — Quick test: decode the payload and compare it with the standard format.
2. **Field name the phone does not recognise** — Quick test: check each field name against the standard list.
3. **Special characters breaking the format** — Quick test: try a simple contact with plain characters and compare.
4. **Too many fields for the phone to handle** — Quick test: try a minimal contact with name and phone only.
5. **Phone permission or app handling** — Quick test: check whether the phone shows a save prompt at all.

### Step-by-step fix

Step 1: Decode the payload and write down every field it carries.
Step 2: Compare the format and the field names with the standard contact format.
Step 3: Rebuild a minimal contact with the contact generator: name and phone only.
Step 4: Scan the minimal contact on two phones and confirm it saves.
Step 5: Add the remaining fields one group at a time, retesting after each group.
Step 6: Simplify any value with special characters that breaks the save, and retest.
Step 7: Retest the full contact on two phones and confirm every field lands in the right place.

### Putting this into practice

In practice, keep the contact payload to the fields visitors actually need. Every extra field is another chance for a parsing fault, and a contact with the essential fields that saves beats a complete contact that does not. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Packing every possible field into a contact code and never testing whether it saves on a real phone.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the contact will not save will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the contact will not save.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The payload uses the standard contact format
- A minimal contact saves on two phones
- The full contact saves with every field in place
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [MeCard QR code generator](/mecard-qr-code-generator)
- [vCard QR code generator](/vcard-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code where the contact will not save?',
        answer:
          'Decode the payload, rebuild a minimal contact with the contact generator, and confirm it saves on two phones. Add the remaining fields one group at a time until you find the field that breaks the save, then simplify or drop it.',
      },
      {
        question: 'What fields should a contact QR code carry?',
        answer:
          'The essentials: name, phone, and email, plus the organisation or address if visitors need them. Keep the payload focused, because every extra field is another chance for a parsing fault.',
      },
      {
        question: 'How do I test a contact QR code?',
        answer:
          'Scan it on two phones and check the saved entry field by field. Confirm the name, phone, email, and any other fields land in the right places. A scan that shows a prompt is not a passing test; a saved contact with correct fields is.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-calendar-event-is-wrong',
    'Why Your QR Code Scans But The Calendar Event Is Wrong and How to Fix It',
    'why your qr code scans but the calendar event is wrong',
    'Diagnose a code that scans but the calendar event is wrong: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '5 min read',
    '2027-08-17',
    `
### What you are seeing

The code scans, but the calendar event it creates is wrong: the wrong date, the wrong time, a missing location, or a garbled title. The scan worked, so the fault sits in the event payload: the date format, the time zone, or a field the phone parses differently. Calendar payloads are fussy about date and time shapes, and a small format error can shift an event by hours or days. The fix is to decode the payload and to rebuild it with the calendar generator in the standard format.

### Likely causes

1. **Date or time in the wrong format** — A date written in a format the phone does not expect can be misread, shifting the event. Test: decode the payload and read the date and time fields.
2. **Time zone missing or wrong** — An event without a time zone, or with the wrong one, can appear hours early or late on the visitor's phone. Test: compare the time zone in the payload with the intended one.
3. **Hand-typed payload with a format error** — A hand-typed event payload can carry a wrong separator, a missing field, or a wrong field order. Test: compare the payload with the standard event format.
4. **Missing end time** — An event without an end time can appear with a default length that does not match the real event. Test: check whether the payload carries an end time.
5. **Special characters in the title or location** — A comma, semicolon, or line break in a title or location can break the field structure. Test: try a simple title with plain characters and compare.

### Step-by-step fix

1. Decode the payload and write down the title, start, end, location, and time zone it carries.
2. Compare every value with the intended event details.
3. Rebuild the event with the calendar generator, using the verified details.
4. Scan the rebuilt code and read the created event carefully, including the time zone.
5. Fix any field that differs, and retest.
6. Retest the final code on two phones and confirm the event is correct.

### Putting this into practice

In practice, the time zone is the field that bites. An event that looks right in your calendar can appear hours off on a visitor's phone if the time zone is missing or wrong. Always set the time zone explicitly, and always read the created event on a test phone before printing. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Hand-typing a calendar payload and shifting the event by hours because the time zone was missing.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the calendar event is wrong will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the calendar event is wrong.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded date, time, and time zone match the intended event
- The event carries an explicit end time
- Scanning creates the correct event on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [calendar event QR code generator](/calendar-event-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code create a calendar event at the wrong time?',
        answer:
          'The payload may carry the wrong date format, a missing or wrong time zone, or a hand-typed format error. Decode the payload, compare the date, time, and time zone with the intended event, and rebuild it with the calendar generator.',
      },
      {
        question: 'Should a QR calendar event include a time zone?',
        answer:
          'Yes. Without a time zone, phones interpret the time using their own settings, which can shift the event by hours. Set the time zone explicitly and verify the created event on a test phone.',
      },
      {
        question: 'Why does a calendar QR code work on one phone but not another?',
        answer:
          'The platforms parse event payloads differently, and a non-standard format can pass on one and fail on the other. Rebuild the payload in the standard format with the generator and test on both platforms.',
      },
    ]
  ),
  art(
    'scans-but-the-calendar-event-is-wrong-step-by-step-fix',
    'Scans But The Calendar Event Is Wrong: Step-by-Step Fix',
    'scans but the calendar event is wrong step by step fix',
    'Repair a code that scans but the calendar event is wrong with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '6 min read',
    '2027-08-17',
    `
### What you are seeing

This fix makes the calendar code create the correct event. You will decode the payload, compare the date, time, and time zone with the intended event, and rebuild it with the calendar generator. Verify the fix by scanning and reading the created event on two phones before you print.

### Likely causes

1. **Date or time in the wrong format** — Quick test: decode the payload and read the date and time fields.
2. **Time zone missing or wrong** — Quick test: compare the time zone in the payload with the intended one.
3. **Hand-typed payload with a format error** — Quick test: compare the payload with the standard event format.
4. **Missing end time** — Quick test: check whether the payload carries an end time.
5. **Special characters in the title or location** — Quick test: try a simple title with plain characters and compare.

### Step-by-step fix

Step 1: Decode the payload and write down the title, start, end, location, and time zone it carries.
Step 2: Compare every value with the intended event details, including the time zone.
Step 3: Rebuild the event with the calendar generator, using the verified details and an explicit end time.
Step 4: Scan the rebuilt code on two phones and read the created event field by field.
Step 5: If a field differs, correct it in the generator and rebuild the code.
Step 6: Simplify any title or location with special characters that breaks the event, and retest.
Step 7: Retest the final code on two phones and confirm the event matches the intended details exactly.

### Putting this into practice

In practice, keep the event details in one record: title, start, end, location, and time zone. Build the code from that record, and check the proof against the same record, so a typo in either place gets caught. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Hand-typing a calendar payload and shifting the event by hours because the time zone was missing.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the calendar event is wrong will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the calendar event is wrong.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded date, time, and time zone match the intended event
- The event carries an explicit end time
- Scanning creates the correct event on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [calendar event QR code generator](/calendar-event-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code that creates the wrong calendar event?',
        answer:
          'Decode the payload, compare the title, start, end, location, and time zone with the intended event, and rebuild it with the calendar generator. Scan the rebuilt code on two phones and read the created event field by field.',
      },
      {
        question: 'What details should a calendar QR code carry?',
        answer:
          'Title, start, end, location, and time zone, plus a short description if visitors need it. An explicit end time matters, because an event without one gets a default length that may not match the real event.',
      },
      {
        question: 'How do I test a calendar QR code?',
        answer:
          'Scan it on two phones and read the created event carefully: date, start, end, location, and time zone. Do not just confirm that an event appears; confirm that it is the right event.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-email-has-no-subject',
    'Why Your QR Code Scans But The Email Has No Subject and How to Fix It',
    'why your qr code scans but the email has no subject',
    'Diagnose a code that scans but the email has no subject: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '7 min read',
    '2027-08-17',
    `
### What you are seeing

The code scans, the email app opens, but the subject line is empty, or the body is missing, or the recipient is wrong. The scan worked, so the fault sits in the email payload: the address, the subject, or the body was mistyped, misplaced, or dropped by the phone's handling. Email payloads are sensitive to separators and encoding, and a small format error can lose a field while the rest survives. The fix is to decode the payload and to rebuild it with the email generator.

### Likely causes

1. **Subject or body field mistyped** — A subject or body field with a wrong name, a missing separator, or a typo can be dropped while the rest of the message survives. Test: decode the payload and read every field.
2. **Non-standard email payload format** — A hand-typed email payload can use a separator or field order the phone does not recognise. Test: compare the payload with the standard email format.
3. **Special characters breaking the format** — A character such as an ampersand or a line break in the subject or body can break the field structure if it is not encoded. Test: try a simple subject with plain characters and compare.
4. **Phone email app handles the payload differently** — Some email apps accept only part of the payload, such as the address without the subject. Test: try the same code with a second email app.
5. **Body too long for the payload** — A very long body can be truncated or dropped by the phone. Test: try a short body and compare.

### Step-by-step fix

1. Decode the payload and write down the recipient, subject, and body it carries.
2. Compare every field with the intended message.
3. Rebuild the email with the email generator, using plain characters in the subject.
4. Scan the rebuilt code and read the drafted email carefully.
5. Fix any field that is missing or wrong, and retest.
6. Retest the final code on two phones and confirm the full message is correct.

### Putting this into practice

In practice, the subject is the field that gets lost first, because it sits in the part of the payload that format errors hit hardest. Build the email with the generator, keep the subject short and plain, and always read the drafted email on a test phone before printing. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Hand-typing an email payload and losing the subject to a format error nobody noticed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the email has no subject will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the email has no subject.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded recipient, subject, and body match the intended message
- The subject uses short, plain text
- Scanning drafts the full message on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [email QR code generator](/email-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code open an email with no subject?',
        answer:
          'The subject field may be mistyped, the payload format may be non-standard, or a special character may have broken the field structure. Decode the payload, compare every field with the intended message, and rebuild it with the email generator.',
      },
      {
        question: 'Can a QR code prefill an email subject and body?',
        answer:
          "Yes, when the payload uses the standard email format and the phone's email app accepts it. Build the code with the email generator, keep the subject short and plain, and test the drafted email on two phones.",
      },
      {
        question: 'Why does the email subject appear on one phone but not another?',
        answer:
          'Email apps handle the payload differently, and a non-standard format can pass on one and fail on the other. Rebuild the payload in the standard format and test on both platforms.',
      },
    ]
  ),
  art(
    'scans-but-the-email-has-no-subject-step-by-step-fix',
    'Scans But The Email Has No Subject: Step-by-Step Fix',
    'scans but the email has no subject step by step fix',
    'Repair a code that scans but the email has no subject with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '5 min read',
    '2027-08-18',
    `
### What you are seeing

This fix makes the email code open a fully addressed message. You will decode the payload, compare the recipient, subject, and body with the intended message, and rebuild it with the email generator. Verify the fix by scanning and reading the drafted email on two phones.

### Likely causes

1. **Subject or body field mistyped** — Quick test: decode the payload and read every field.
2. **Non-standard email payload format** — Quick test: compare the payload with the standard email format.
3. **Special characters breaking the format** — Quick test: try a simple subject with plain characters and compare.
4. **Phone email app handles the payload differently** — Quick test: try the same code with a second email app.
5. **Body too long for the payload** — Quick test: try a short body and compare.

### Step-by-step fix

Step 1: Decode the payload and write down the recipient, subject, and body it carries.
Step 2: Compare every field with the intended message, letter by letter.
Step 3: Rebuild the email with the email generator, using the verified recipient, subject, and body.
Step 4: Keep the subject short and use plain characters where possible, then rebuild.
Step 5: Scan the rebuilt code on two phones and read the drafted email field by field.
Step 6: If a field is still missing, test the same code in a second email app to separate a payload fault from an app limit.
Step 7: Retest the final code on two phones and confirm the recipient, subject, and body are all correct.

### Putting this into practice

In practice, keep the intended message in one record: recipient, subject, and body. Build the code from that record and check the proof against the same record, so a typo in either place gets caught. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Hand-typing an email payload and losing the subject to a format error nobody noticed.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the email has no subject will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the email has no subject.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded recipient, subject, and body match the intended message
- The subject uses short, plain text
- Scanning drafts the full message on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [email QR code generator](/email-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code where the email has no subject?',
        answer:
          'Decode the payload, compare the recipient, subject, and body with the intended message, and rebuild it with the email generator. Scan the rebuilt code on two phones and read the drafted email field by field.',
      },
      {
        question: 'Should I keep email QR subjects short?',
        answer:
          'Yes. A short, plain subject survives encoding and app differences far better than a long one with special characters. Put the detail in the body, and keep the subject to the essential few words.',
      },
      {
        question: 'How do I test an email QR code?',
        answer:
          'Scan it on two phones and read the drafted email: recipient, subject, and body. Confirm every field is correct. A scan that opens the email app is not a passing test; a drafted message with the right fields is.',
      },
    ]
  ),
  art(
    'why-your-qr-code-scans-but-the-sms-goes-to-the-wrong-number',
    'Why Your QR Code Scans But The Sms Goes To The Wrong Number and How to Fix It',
    'why your qr code scans but the sms goes to the wrong number',
    'Diagnose a code that scans but the SMS goes to the wrong number: the likely causes in order, with a test for each one, and a fix you can verify before reprinting.',
    'Fundamentals',
    '6 min read',
    '2027-08-18',
    `
### What you are seeing

The code scans, the messaging app opens, but the message is addressed to the wrong number, or the prefilled text is missing or wrong. The scan worked, so the fault sits in the SMS payload: the number, the country code, or the message text. A wrong number is a serious failure, because a visitor can send a private message to a stranger. The fix is to decode the payload and to check every character of the number before anyone uses the code again.

### Likely causes

1. **Wrong number in the payload** — A digit mistyped in the payload sends the message to a different number. Test: decode the payload and compare the number digit by digit with the intended number.
2. **Missing or wrong country code** — A number without a country code, or with the wrong one, can route to a different person or fail. Test: check the country code in the payload.
3. **Formatting characters breaking the number** — Spaces, brackets, or dashes inside the number can break the parsing on some phones. Test: compare a plain-digit version with the formatted version.
4. **Non-standard SMS payload format** — A hand-typed SMS payload can use a separator or field order the phone does not recognise. Test: compare the payload with the standard SMS format.
5. **Message text lost or garbled** — A message with special characters can be dropped or garbled if it is not encoded correctly. Test: try a short message with plain characters and compare.

### Step-by-step fix

1. Decode the payload and write down the exact number and message it carries.
2. Compare the number digit by digit with the intended number, including the country code.
3. Rebuild the SMS with the SMS generator, using plain digits for the number.
4. Scan the rebuilt code and read the drafted message without sending it.
5. Fix any field that differs, and retest.
6. Retest the final code on two phones and confirm the number and message are correct.

### Putting this into practice

In practice, a wrong number is the failure to take most seriously, because a visitor can send a private message to a stranger before anyone notices. Check the number digit by digit, include the country code, and read the drafted message on a test phone before printing. Never let a wrong-number code stay in circulation while you investigate. Keep a short note of what you tested, what failed, and what you changed, so the next person starts from evidence rather than guesswork. A fix that is written down survives staff changes and reprints; a fix that lives only in memory gets repeated.

### Common mistakes to avoid

- Letting a wrong-number SMS code stay in circulation while investigating the cause.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the SMS goes to the wrong number will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the SMS goes to the wrong number.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded number matches the intended number digit by digit
- The country code is correct
- Scanning drafts the right message on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [SMS QR code generator](/sms-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'Why does my QR code send an SMS to the wrong number?',
        answer:
          'The payload may carry a mistyped number, a missing or wrong country code, or formatting characters that break the parsing. Decode the payload, compare the number digit by digit with the intended number, and rebuild it with the SMS generator using plain digits.',
      },
      {
        question: 'Should an SMS QR code include the country code?',
        answer:
          'Yes. A number without a country code can route incorrectly, especially for visitors on different networks. Include the full international number with the country code and plain digits.',
      },
      {
        question: 'Can a QR code prefill an SMS message?',
        answer:
          'Yes, when the payload uses the standard SMS format. Keep the message short and plain, because special characters can break the encoding. Test the drafted message on two phones before printing.',
      },
    ]
  ),
  art(
    'scans-but-the-sms-goes-to-the-wrong-number-step-by-step-fix',
    'Scans But The Sms Goes To The Wrong Number: Step-by-Step Fix',
    'scans but the sms goes to the wrong number step by step fix',
    'Repair a code that scans but the SMS goes to the wrong number with a step-by-step procedure, verification after each stage, and a proof test before the full run.',
    'Fundamentals',
    '7 min read',
    '2027-08-18',
    `
### What you are seeing

This fix makes the SMS code address the right number with the right message. You will decode the payload, compare the number and the message with the intended values, and rebuild the code with the SMS generator. Verify the fix by scanning and reading the drafted message on two phones, without sending it.

### Likely causes

1. **Wrong number in the payload** — Quick test: decode the payload and compare the number digit by digit with the intended number.
2. **Missing or wrong country code** — Quick test: check the country code in the payload.
3. **Formatting characters breaking the number** — Quick test: compare a plain-digit version with the formatted version.
4. **Non-standard SMS payload format** — Quick test: compare the payload with the standard SMS format.
5. **Message text lost or garbled** — Quick test: try a short message with plain characters and compare.

### Step-by-step fix

Step 1: Decode the payload and write down the exact number and message it carries.
Step 2: Compare the number digit by digit with the intended number, including the country code.
Step 3: Remove formatting characters from the number and use plain digits.
Step 4: Rebuild the SMS with the SMS generator, using the verified number and a short, plain message.
Step 5: Scan the rebuilt code on two phones and read the drafted message without sending it.
Step 6: If the number is still wrong, check the source record the code was built from and correct it there.
Step 7: Retest the final code on two phones and confirm the number and message are correct before printing.

### Putting this into practice

In practice, keep the intended number in one record and build the code from it, then check the proof against the same record. Two people checking the digits independently catches the typo that one person keeps missing. Record the before-and-after behaviour with the job file, so the fix is provable rather than anecdotal. When the same failure appears again, that record tells you whether the old fix held or a new cause appeared.

### Common mistakes to avoid

- Letting a wrong-number SMS code stay in circulation while investigating the cause.
- Reprinting the full run before a single proof passes, which turns one failure into many.
- Testing on one phone in ideal conditions instead of two phones in the real conditions where a code that scans but the SMS goes to the wrong number will be used.
- Changing the artwork and the placement at the same time, so you cannot tell which change fixed a code that scans but the SMS goes to the wrong number.- Skipping the proof test because the change looked small, when small changes cause most repeat failures.

### Quick checklist

- The decoded number matches the intended number digit by digit
- The country code is correct
- Scanning drafts the right message on two phones
- The corrected proof passes on two phones in the real conditions
- The fix is recorded in the job file so the next reprint starts from a proven setup
- Every printed copy is checked against the approved proof
- The proof is retested after any later change to the link, design, or placement

### Related tools and guides

- [SMS QR code generator](/sms-qr-code-generator)
- [QR payload inspector](/qr-payload-inspector)
- [QR offline verifier](/qr-offline-verifier)
- [QR scan log](/qr-scan-log)
- [QR safety checker](/qr-safety-checker)
- [blog](/blog)
`,
    [
      {
        question: 'How do I fix a QR code where the SMS goes to the wrong number?',
        answer:
          'Decode the payload, compare the number digit by digit with the intended number, and rebuild it with the SMS generator using plain digits and the correct country code. Scan the rebuilt code on two phones and read the drafted message without sending it.',
      },
      {
        question: 'How do I test an SMS QR code safely?',
        answer:
          'Scan it on two phones and read the drafted message, including the recipient number, without sending it. Confirm the number and the message are correct. Do not send a test message to a real number unless the recipient expects it.',
      },
      {
        question: 'What if the number is right but the message is missing?',
        answer:
          'The message field may be mistyped, the format may be non-standard, or a special character may have broken the encoding. Rebuild the code with the generator using a short, plain message, and retest.',
      },
    ]
  ),
];
