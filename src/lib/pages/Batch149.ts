import type { Article } from '../articles';
import { art } from './helper';

export const batch149: Article[] = [
  art(
    'qr-print-vs-screen-mistakes-to-avoid',
    'QR Print Vs Screen Mistakes to Avoid',
    'qr print vs screen mistakes to avoid',
    'The most common qr print versus screen mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-21',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small print versus screen mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Using one file for both print and screen, so the print version is too low in resolution or the screen version has the wrong background. One file cannot serve two homes well.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Approving a print code from a screen preview, or a screen code from a bright monitor. Each home needs its own proof in its own conditions.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Forgetting that print mistakes need a reprint while screen mistakes can be fixed quickly. Print deserves the longer proof, not the shorter one.

Fix it by printing a proof at the final size on the real material and scanning it in the real light. Screens are backlit and flattering, and they hide ink spread, glare, and texture. The proof is the only honest version of the design, and it should be the version you approve.

### Putting this into practice

Take your current design and check it against the three mistakes above, one at a time, on a printed proof. Mark each problem you find, fix it, and proof again. Do not approve a design until it passes all three checks. Keep the checklist with the project file so the next designer does not repeat the same mistakes.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR DPI calculator](/qr-dpi-calculator) to check your choices before you commit to a design.
- Use the [QR print proof checklist](/qr-print-proof-checklist) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most common print versus screen mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a print versus screen mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for print versus screen mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-print-vs-screen',
    'How to Test QR Print Vs Screen',
    'how to test qr print vs screen',
    'A step-by-step way to test qr print versus screen on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-21',
    `
Testing print versus screen is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a print versus screen test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Print the print version on the real stock and scan it, then display the screen version on a phone at low brightness and scan it. If either fails, fix that file before the run.

### Step-by-step test

First, look at the proof without scanning. Check the code background is even, the quiet zone is clear on all four sides, and nothing touches the symbol. Second, stand at the real scanning distance and scan with the first phone, noting how quickly it locks on. Third, repeat with the second phone, then repeat again in the weakest light the code will face, and at a slight angle. Fourth, check the supporting text: read the call to action aloud from the real distance, and type any printed address into a phone to confirm it lands on the right page.

### How to judge pass or fail, and what to fix

A pass is a fast, first-try scan on both phones, at the real distance, in the real light, with no leaning, shading, or retrying. A scan that eventually works after several tries is a fail, because real users will give up before the third try. If the code fails, change one thing at a time: widen the margin, strengthen the contrast, simplify the decoration, or enlarge the code. Test again after each change, and keep the version that passes as your reference for the next batch.

### Putting this into practice

Run the test above on your next proof before you approve it, and write down the result: phones used, distance, lighting, and whether each scan passed on the first try. File the passing proof with the project so the next batch can be compared against it. A short written record turns a one-off test into a repeatable standard.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR DPI calculator](/qr-dpi-calculator) to check your choices before you commit to a design.
- Use the [QR print proof checklist](/qr-print-proof-checklist) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What do I need to test print versus screen?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a print versus screen test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest print versus screen?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-co-branding-rules',
    'QR Co-Branding Rules for Scannable Codes',
    'qr co branding rules',
    'Practical qr co-branding rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-22',
    `
QR co-branding decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for co-branding, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for co-branding

Co-branding puts two brands beside one QR code, for example a retailer and a supplier, or a venue and a sponsor. Co-branding can share trust and reach, but it also doubles the visual competition around the code. The code needs one clear owner and one clear message, even when two brands share the space.

Give the code one primary brand and one call to action, and let the second brand support rather than compete. Two equal logos, two messages, and two colors fighting for attention leave people unsure who the code belongs to. Decide which brand owns the destination, and make that brand the one the code answers to.

### How co-branding affects scanning

Place the partner logo outside the code panel, with a clear gap, and keep the partner name in the supporting text rather than inside the symbol. The code panel belongs to the code; the partner belongs to the frame, the headline, or the footer. A partner mark inside the code is a logo-placement risk as well as a branding muddle.

Agree the code colors, the call to action, and the destination before the design starts. Co-branded projects fail when each partner expects their own colors, their own message, and their own landing page. One code can only carry one destination, so the partners must agree it in advance.

### Setting up co-branding before you print

Test the co-branded layout as a whole, not as two separate brand blocks. Two brands that each look good alone can clash when combined, and the clash usually lands on the code. A proof of the combined layout shows whether the code still stands out.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses co-branding and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most important rule for co-branding?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the co-branding rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my co-branding choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-co-branding-examples-that-work',
    'QR Co-Branding Examples That Work',
    'qr co branding examples that work',
    'Real-world qr co-branding examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-22',
    `
Seeing co-branding done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A retailer and a supplier share a poster with a code that leads to a joint offer. The retailer logo sits above the code, the supplier logo sits in the footer, and the call to action names the offer. The code sits on a white panel, clearly owned by the offer. A venue and a sponsor share a banner with one code and one message.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A charity and a corporate partner share a donation code. The charity owns the destination, the partner logo sits in the frame, and the line reads Scan to donate. Donors know where the money goes. A school and a local business share a fundraising poster with one code.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A conference and a sponsor share a registration code. The conference owns the destination, the sponsor logo sits beside the frame, and the call to action names registration. Attendees scan without wondering who runs the page. A museum and a sponsor share an exhibit code.

The lesson is separation. The brand carries the pattern and the color, while the code carries a calm panel and a clean margin. The two jobs stay separate, and both succeed. Whenever a design tries to make the code itself carry the pattern, scanning suffers.

### Putting this into practice

Pick the example closest to your placement and rebuild it with your own brand and message. Keep the structure the same: a clean code, a clear margin, and a short message. Print it at the final size, scan it with two phones, and compare it with the example. If your version scans as quickly as the example, you have a safe design to build on.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'Which co-branding example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the co-branding examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these co-branding examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-co-branding-mistakes-to-avoid',
    'QR Co-Branding Mistakes to Avoid',
    'qr co branding mistakes to avoid',
    'The most common qr co-branding mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-22',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small co-branding mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Giving two brands equal weight around one code, so nobody knows who owns the destination. Equal weight reads as confusion, not partnership.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Placing a partner logo inside the code or inside the quiet zone. The partner mark becomes a scanning risk and a branding muddle.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Letting each partner add their own message, color, and link to one code. One code can only carry one destination and one promise.

Fix it by printing a proof at the final size on the real material and scanning it in the real light. Screens are backlit and flattering, and they hide ink spread, glare, and texture. The proof is the only honest version of the design, and it should be the version you approve.

### Putting this into practice

Take your current design and check it against the three mistakes above, one at a time, on a printed proof. Mark each problem you find, fix it, and proof again. Do not approve a design until it passes all three checks. Keep the checklist with the project file so the next designer does not repeat the same mistakes.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most common co-branding mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a co-branding mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for co-branding mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-co-branding',
    'How to Test QR Co-Branding',
    'how to test qr co branding',
    'A step-by-step way to test qr co-branding on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-23',
    `
Testing co-branding is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a co-branding test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Show the co-branded layout to someone who knows neither brand and ask who the code belongs to and what scanning gives them. If they cannot answer, simplify the hierarchy.

### Step-by-step test

First, look at the proof without scanning. Check the code background is even, the quiet zone is clear on all four sides, and nothing touches the symbol. Second, stand at the real scanning distance and scan with the first phone, noting how quickly it locks on. Third, repeat with the second phone, then repeat again in the weakest light the code will face, and at a slight angle. Fourth, check the supporting text: read the call to action aloud from the real distance, and type any printed address into a phone to confirm it lands on the right page.

### How to judge pass or fail, and what to fix

A pass is a fast, first-try scan on both phones, at the real distance, in the real light, with no leaning, shading, or retrying. A scan that eventually works after several tries is a fail, because real users will give up before the third try. If the code fails, change one thing at a time: widen the margin, strengthen the contrast, simplify the decoration, or enlarge the code. Test again after each change, and keep the version that passes as your reference for the next batch.

### Putting this into practice

Run the test above on your next proof before you approve it, and write down the result: phones used, distance, lighting, and whether each scan passed on the first try. File the passing proof with the project so the next batch can be compared against it. A short written record turns a one-off test into a repeatable standard.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What do I need to test co-branding?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a co-branding test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest co-branding?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-iconography-rules',
    'QR Iconography Rules for Scannable Codes',
    'qr iconography rules',
    'Practical qr iconography rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-23',
    `
QR iconography decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for iconography, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for iconography

Iconography is the small set of icons used around a QR code: a scan icon, a phone icon, an arrow, or a small symbol that hints at the destination. Icons can help people understand a code at a glance, but they only help when they are simple, familiar, and kept well away from the symbol itself.

Use icons that people already recognise, such as a simple scan frame, a phone, or an arrow pointing at the code. An unfamiliar or clever icon needs explaining, which defeats its purpose. The icon should confirm the action, not invent a new visual language.

### How iconography affects scanning

Keep icons outside the code and the quiet zone, with a clear gap. An icon that touches the symbol, overlaps the margin, or sits inside the code panel can be mistaken for part of the pattern. Icons belong in the frame, the call to action line, or the surrounding layout, not in the symbol.

Use one icon, not a row of them. A single scan icon beside the call to action helps; a row of icons for menu, booking, payment, and directions confuses. If the code leads to one destination, it needs one icon.

### Setting up iconography before you print

Check that the icon still reads at the real size. An icon that looks crisp on screen can turn into a blob at small print sizes, and a detailed icon can vanish on a textured surface. Test the icon at the smallest size you plan to use.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses iconography and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR call to action builder](/qr-call-to-action-builder) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most important rule for iconography?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the iconography rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my iconography choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-iconography-examples-that-work',
    'QR Iconography Examples That Work',
    'qr iconography examples that work',
    'Real-world qr iconography examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-23',
    `
Seeing iconography done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A cafe uses a simple scan icon beside the line Scan to view the menu. Diners recognise the icon and the message together. A shop uses a phone icon beside Scan to see today deals.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A clinic uses a simple calendar icon beside Scan to book an appointment. Patients grasp the purpose before they scan. A museum uses a headphones icon beside Scan for the audio guide.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A gym uses an arrow icon pointing toward the code beside Scan to book a free trial. The arrow draws the eye to the code without touching it. A library uses a book icon beside Scan to join the library.

The lesson is separation. The brand carries the pattern and the color, while the code carries a calm panel and a clean margin. The two jobs stay separate, and both succeed. Whenever a design tries to make the code itself carry the pattern, scanning suffers.

### Putting this into practice

Pick the example closest to your placement and rebuild it with your own brand and message. Keep the structure the same: a clean code, a clear margin, and a short message. Print it at the final size, scan it with two phones, and compare it with the example. If your version scans as quickly as the example, you have a safe design to build on.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR call to action builder](/qr-call-to-action-builder) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'Which iconography example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the iconography examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these iconography examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-iconography-mistakes-to-avoid',
    'QR Iconography Mistakes to Avoid',
    'qr iconography mistakes to avoid',
    'The most common qr iconography mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-24',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small iconography mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Using a clever or unfamiliar icon that nobody recognises. An icon that needs a caption to be understood is not helping anyone.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Placing icons inside the code, inside the quiet zone, or tight against the symbol. Icons near the code read as extra pattern and slow detection.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Using a row of icons for one code, so people cannot tell which icon matches the destination. One code, one destination, one icon.

Fix it by printing a proof at the final size on the real material and scanning it in the real light. Screens are backlit and flattering, and they hide ink spread, glare, and texture. The proof is the only honest version of the design, and it should be the version you approve.

### Putting this into practice

Take your current design and check it against the three mistakes above, one at a time, on a printed proof. Mark each problem you find, fix it, and proof again. Do not approve a design until it passes all three checks. Keep the checklist with the project file so the next designer does not repeat the same mistakes.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR call to action builder](/qr-call-to-action-builder) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most common iconography mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a iconography mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for iconography mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-iconography',
    'How to Test QR Iconography',
    'how to test qr iconography',
    'A step-by-step way to test qr iconography on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-24',
    `
Testing iconography is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a iconography test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Show the layout to someone who has not seen it and ask what the code does, without letting them read the text. If the icon alone does not hint at the action, simplify it or drop it.

### Step-by-step test

First, look at the proof without scanning. Check the code background is even, the quiet zone is clear on all four sides, and nothing touches the symbol. Second, stand at the real scanning distance and scan with the first phone, noting how quickly it locks on. Third, repeat with the second phone, then repeat again in the weakest light the code will face, and at a slight angle. Fourth, check the supporting text: read the call to action aloud from the real distance, and type any printed address into a phone to confirm it lands on the right page.

### How to judge pass or fail, and what to fix

A pass is a fast, first-try scan on both phones, at the real distance, in the real light, with no leaning, shading, or retrying. A scan that eventually works after several tries is a fail, because real users will give up before the third try. If the code fails, change one thing at a time: widen the margin, strengthen the contrast, simplify the decoration, or enlarge the code. Test again after each change, and keep the version that passes as your reference for the next batch.

### Putting this into practice

Run the test above on your next proof before you approve it, and write down the result: phones used, distance, lighting, and whether each scan passed on the first try. File the passing proof with the project so the next batch can be compared against it. A short written record turns a one-off test into a repeatable standard.

### Common mistakes to avoid

Even when the main rules are followed, small slips still creep in. The most common ones are letting decoration drift into the quiet zone, choosing colors that look distinct but share a brightness, and approving a design from a screen preview instead of a printed proof. Another frequent slip is changing one part of a working design, such as the link or the paper, without retesting the whole thing. Treat every change as a reason to run a fresh proof, and treat any hesitation in a test scan as a signal to simplify rather than to hope the next phone will cope better.

### Quick checklist

- Keep dark modules on a light, even background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Keep the finder patterns solid, undisturbed, and easy to find.
- Check the code at the real size, on the real material, in the real light.
- Confirm the call to action names the payoff and the typed alternative works.
- Recheck the code after any change to the link, design, size, or placement.

### Related tools and guides

- Try the [QR frame designer](/qr-frame-designer) to check your choices before you commit to a design.
- Use the [QR call to action builder](/qr-call-to-action-builder) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What do I need to test iconography?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a iconography test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest iconography?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
];
