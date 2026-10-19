import type { Article } from '../articles';
import { art } from './helper';

export const batch144: Article[] = [
  art(
    'qr-sizing-rules',
    'QR Sizing Rules for Scannable Codes',
    'qr sizing rules',
    'Practical qr sizing rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-04',
    `
QR sizing decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for sizing, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for sizing

Sizing is the decision about how large a QR code should be printed or displayed for the distance people will scan it from. A code that is too small forces people to crouch, zoom, or give up; a code that is too large wastes space that could carry the message.

Size the code for the scanning distance, not for the space left over on the page. Start from where people will stand, then work backwards to a size that reads comfortably from there. A code on a business card is scanned at arm length, while a code on a poster may be scanned from several steps away.

### How sizing affects scanning

Keep the modules large enough to survive printing. Long web addresses and dense payloads make modules tiny, so a short link or a higher-capacity layout keeps modules bigger at the same printed size. If the code must carry a long payload, print it larger to compensate.

Leave the code large enough that the smallest details survive the print process. Ink spread, low-resolution printing, and textured stock all blur module edges, and a code that is already small has no margin for that blur. A proof printed on the real stock is the honest check.

### Setting up sizing before you print

Test the size in the real setting, at the real distance, with real phones. A size that looks generous on screen can feel small on a wall, and a size that looks fine in the studio can fail in dim light. The test is cheap; the reprint is not.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses sizing and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most important rule for sizing?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the sizing rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my sizing choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-sizing-examples-that-work',
    'QR Sizing Examples That Work',
    'qr sizing examples that work',
    'Real-world qr sizing examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-05',
    `
Seeing sizing done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A business card prints the code at a size that reads at arm length, with the contact details beside it. The card is small, but the code is not squeezed into a corner. A flyer prints the code large enough to read while the flyer is held at a normal reading distance.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A poster prints the code so it reads from the aisle, not only from right in front of it. The headline pulls people in, and the code is large enough to scan without walking up to the wall. A shop window prints the code so it reads from the pavement.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A product label prints the code at a size that survives the label cutter and the shelf distance. The label is tested on a real shelf before the run. A conference banner prints the code large enough for attendees walking past.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'Which sizing example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the sizing examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these sizing examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-sizing-mistakes-to-avoid',
    'QR Sizing Mistakes to Avoid',
    'qr sizing mistakes to avoid',
    'The most common qr sizing mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-05',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small sizing mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Shrinking the code to fit a leftover gap, so it reads only when the phone is held very close. People will not crouch or zoom for a code that does not explain itself.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Using a long payload in a small code, so the modules become tiny and fragile. Shorten the link or print the code larger.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Approving a size from a screen preview without a printed proof. Screen size tells you nothing about print size, and print blur eats small modules first.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most common sizing mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a sizing mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for sizing mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-sizing',
    'How to Test QR Sizing',
    'how to test qr sizing',
    'A step-by-step way to test qr sizing on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-05',
    `
Testing sizing is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a sizing test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Print the code at the planned size, stand at the real scanning distance, and scan it with two phones. If you have to step closer to get a read, the code is too small.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What do I need to test sizing?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a sizing test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest sizing?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-placement-rules',
    'QR Placement Rules for Scannable Codes',
    'qr placement rules',
    'Practical qr placement rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-06',
    `
QR placement decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for placement, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for placement

Placement is where a QR code sits on a page, a pack, a wall, or a screen, and where people are expected to stand when they scan it. Good placement puts the code at a comfortable height, in good light, and away from folds, curves, and glare. Bad placement can defeat an otherwise perfect code.

Place the code where a person can stand comfortably in front of it, at a natural height and distance. A code on the floor, behind a counter, or at the top of a tall banner forces an awkward scan that many people will not attempt. Eye level or hand level, with space to step back, is the safe default.

### How placement affects scanning

Keep the code flat, or nearly flat, facing the scanner. A code wrapped around a bottle, folded across a crease, or stuck on a sharply curved surface distorts the grid and makes decoding hard. If the surface curves, use a smaller code on the flattest part, or move the code to a flat label.

Keep the code out of glare, shadow, and direct reflections. A code behind glass, under a spotlight, or in a patch of sun can lose a corner to reflection. Move the code, tilt it slightly, or choose a matte finish rather than hoping the scanner will cope.

### Setting up placement before you print

Keep the code away from folds, seams, cutters, and handling wear. A code that straddles a fold will crack along the fold, and a code on a handle or a flap will wear away. Place it on a stable, protected area that survives real use.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses placement and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most important rule for placement?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the placement rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my placement choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-placement-examples-that-work',
    'QR Placement Examples That Work',
    'qr placement examples that work',
    'Real-world qr placement examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-06',
    `
Seeing placement done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A cafe puts the menu code on the table card, flat on the table, where diners can scan it while seated. The card is matte, the code is at hand level, and the table is not in direct sun. A shop puts the code on a window at eye level with space to step back.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A clinic puts the check-in code on a stand at the reception desk, at hand height, away from the window glare. Patients scan it while standing in the queue. A museum puts the code on a wall label at eye level, beside the exhibit text.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A gym puts the booking code on a poster at eye level near the entrance, with floor space in front of it. A warehouse puts the bin code on the flat front of the bin, not on the curved edge or the lid that gets handled.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'Which placement example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the placement examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these placement examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-placement-mistakes-to-avoid',
    'QR Placement Mistakes to Avoid',
    'qr placement mistakes to avoid',
    'The most common qr placement mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-06',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small placement mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Placing the code too high, too low, or behind an obstacle so people cannot stand in front of it. A code that needs a stretch or a crouch will be ignored.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Wrapping the code around a curve, a fold, or a seam. The grid distorts, and the scanner cannot reconstruct the pattern.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Putting the code where glare, shadow, or handling wear will damage it. A code in a sun patch or on a handle has a short useful life.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most common placement mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a placement mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for placement mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-placement',
    'How to Test QR Placement',
    'how to test qr placement',
    'A step-by-step way to test qr placement on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '5 min read',
    '2027-09-07',
    `
Testing placement is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a placement test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Stand where a real user will stand, hold your phone naturally, and scan the code in the real light. If you have to stretch, tilt, or shade the code with your hand, move it.

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

- Try the [QR size presets](/qr-size-presets) to check your choices before you commit to a design.
- Use the [QR minimum size checker](/qr-minimum-size-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What do I need to test placement?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a placement test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest placement?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-typography-rules',
    'QR Typography Rules for Scannable Codes',
    'qr typography rules',
    'Practical qr typography rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '6 min read',
    '2027-09-07',
    `
QR typography decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for typography, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for typography

Typography is the text that sits near a QR code: the call to action, the instructions, the web address, and any supporting notes. Good typography makes the code usable by people who cannot or do not want to scan; bad typography leaves them stranded and makes the code look untrustworthy.

Set the supporting text large enough to read at the real viewing distance, in a plain, legible typeface. A call to action that is tiny or set in a decorative script will not be read, and a web address in a fussy font will be mistyped. Legibility beats style for anything that carries instructions.

### How typography affects scanning

Keep the text clear of the code and the quiet zone. Text that crowds the symbol can be mistaken for modules, and text that sits inside the margin breaks the clean edge the scanner needs. Give the text its own space, separated from the code by a clear gap.

Print the destination address as text beside the code, in a form people can actually type. A short, memorable address beats a long string of parameters, and a line break in the middle of a domain name invites mistakes. If the address is long, use a short redirect and print that instead.

### Setting up typography before you print

Use sentence case and plain words for instructions, and keep the message to one or two lines. A short line that says what happens after the scan is more useful than a paragraph of marketing copy. People decide in a glance whether to scan.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses typography and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR call to action builder](/qr-call-to-action-builder) to check your choices before you commit to a design.
- Use the [QR frame designer](/qr-frame-designer) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most important rule for typography?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the typography rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my typography choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-typography-examples-that-work',
    'QR Typography Examples That Work',
    'qr typography examples that work',
    'Real-world qr typography examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '7 min read',
    '2027-09-07',
    `
Seeing typography done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A restaurant card sets Scan to view the menu in a clear, readable size beneath the code, with the web address underneath in plain type. Diners who prefer not to scan can type the address. A clinic leaflet sets the booking line and the phone number in the same clear style.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A museum label sets a short instruction beside the code in a size that reads at arm length. The label text is calm, the code is the focus, and the address is printed for anyone who wants it. A shop poster sets the call to action large enough to read from the pavement.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A conference badge sets a short line under the code in a plain font, with the session address printed below. Attendees can scan or type, and the badge stays readable. A charity poster sets Scan to donate in a bold, plain weight that reads at a distance.

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

- Try the [QR call to action builder](/qr-call-to-action-builder) to check your choices before you commit to a design.
- Use the [QR frame designer](/qr-frame-designer) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'Which typography example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the typography examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these typography examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
];
