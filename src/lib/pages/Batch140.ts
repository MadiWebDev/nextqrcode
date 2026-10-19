import type { Article } from '../articles';
import { art } from './helper';

export const batch140: Article[] = [
  art(
    'qr-color-rules',
    'QR Color Rules for Scannable Codes',
    'qr color rules',
    'Practical qr color rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '6 min read',
    '2027-08-22',
    `
QR color decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for color, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for color

Color is the first thing people notice about a QR code, and it is also one of the easiest things to get wrong. A branded color can make a code feel like part of a poster, a menu, or a pack, but only when the code still reads quickly on a real phone in real light.

Keep the code darker than its background, keep the hue shift modest, and keep the finder patterns solid and easy to find. When any of those three conditions weakens, scanning slows down or stops.

### How color affects scanning

Use one foreground color for the whole symbol rather than a patchwork of colors that compete for attention. A single solid foreground keeps every module the same darkness, so the phone camera can separate code from background without guessing. If you want a second color, reserve it for the frame or the call to action outside the symbol, not for modules inside it.

Test the color on the actual background it will sit on, not on a white artboard. A navy code that looks strong on white can turn muddy on a cream menu, and a green code can vanish against a green shelf edge. Print a small proof, hold it at the real viewing distance, and scan it under the lighting where it will live before you approve the palette.

### Setting up color before you print

Keep the finder patterns in the same foreground color as the rest of the symbol. Recoloring the three corner squares, or giving each one a different color, makes detection harder because the camera looks for a consistent dark shape in three corners. Branding belongs around the code, not inside the finder patterns.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses color and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR color pair tester](/qr-color-pair-tester) to check your choices before you commit to a design.
- Use the [QR contrast checker](/qr-contrast-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most important rule for color?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the color rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my color choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-color-examples-that-work',
    'QR Color Examples That Work',
    'qr color examples that work',
    'Real-world qr color examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '7 min read',
    '2027-08-22',
    `
Seeing color done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A cafe prints its menu code in deep teal on warm white card, with black text beside it. The teal is dark, the background is light, and the code scans at arm length even in dim evening light. A parcel label uses a single dark plum for the code on white stock, so warehouse scanners read it without hunting for contrast.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A conference badge uses dark slate for the code and leaves the sponsor logo outside the symbol. Attendees scan the badge while walking past a stand, and the consistent foreground keeps the read fast. A shop window poster uses dark forest green on pale cream, with the code large enough to read from the pavement.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A product pack uses a dark brown code on a cream panel, rather than letting the code sit directly on a patterned pack background. The cream panel gives the code a calm, even background, and the brown stays dark enough to separate cleanly. The result looks branded without asking the scanner to fight the packaging.

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

- Try the [QR color pair tester](/qr-color-pair-tester) to check your choices before you commit to a design.
- Use the [QR contrast checker](/qr-contrast-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'Which color example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the color examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these color examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-color-mistakes-to-avoid',
    'QR Color Mistakes to Avoid',
    'qr color mistakes to avoid',
    'The most common qr color mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '5 min read',
    '2027-08-23',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small color mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Coloring some modules lighter than others so the code looks faded or watercolored. The camera needs a consistent dark level, and pale modules read as background.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Putting a colored code directly on a colored or photographic background without a light panel behind it. The background competes with the code and the quiet zone disappears.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Inverting the code so light modules sit on a dark background without testing it on several phones. Some scanners cope, others do not, and print makes the problem worse.

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

- Try the [QR color pair tester](/qr-color-pair-tester) to check your choices before you commit to a design.
- Use the [QR contrast checker](/qr-contrast-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What is the most common color mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a color mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for color mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-color',
    'How to Test QR Color',
    'how to test qr color',
    'A step-by-step way to test qr color on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '6 min read',
    '2027-08-23',
    `
Testing color is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a color test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Print the color proof at final size, scan it with two different phones, then scan it again in weaker light and at a slight angle. If any scan hesitates, darken the foreground or lighten the background before you reprint.

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

- Try the [QR color pair tester](/qr-color-pair-tester) to check your choices before you commit to a design.
- Use the [QR contrast checker](/qr-contrast-checker) to confirm the numbers and guardrails for this element.
- Check the [QR size calculator](/qr-size-calculator) for a practical way to verify the finished code.
- Check the [QR scanner](/qr-scanner) for a practical way to verify the finished code.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Browse the [blog](/blog) for more guides on sizing, printing, and design for QR codes.
`,
    [
      {
        question: 'What do I need to test color?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a color test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest color?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-contrast-rules',
    'QR Contrast Rules for Scannable Codes',
    'qr contrast rules',
    'Practical qr contrast rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '7 min read',
    '2027-08-23',
    `
QR contrast decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for contrast, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for contrast

Contrast is the difference in brightness between the dark modules and the light background, and it is the single most important factor in whether a code scans. A code with strong contrast reads quickly; a code with weak contrast forces the camera to guess where modules end and background begins.

Aim for a clear brightness gap, not a subtle one. The foreground should read as clearly dark and the background as clearly light, with no mid-tone muddle in between. If you have to squint to see the modules, the scanner will struggle too.

### How contrast affects scanning

Judge contrast by brightness, not by hue alone. Red on green can look different to the eye yet similar in brightness to a camera, and two colors that look distinct in a design tool can collapse into a similar grey when printed. Convert a proof to greyscale in your head by checking whether the modules still stand out when color is removed.

Protect contrast through the whole production chain. A design that looks strong on screen can lose contrast when printed on absorbent stock, laminated, or photographed under warm shop lighting. Ink spread, glare, and fading all eat contrast, so the proof must be judged on the finished material, not on screen.

### Setting up contrast before you print

Keep the quiet zone at full background brightness. A shadow, a tint, or a pattern creeping into the quiet zone lowers the effective contrast at the very edge the scanner uses to find the code. The quiet zone is part of the contrast system, not empty decoration.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses contrast and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR contrast checker](/qr-contrast-checker) to check your choices before you commit to a design.
- Use the [QR color pair tester](/qr-color-pair-tester) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most important rule for contrast?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the contrast rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my contrast choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-contrast-examples-that-work',
    'QR Contrast Examples That Work',
    'qr contrast examples that work',
    'Real-world qr contrast examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '5 min read',
    '2027-08-24',
    `
Seeing contrast done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A pharmacy label uses near-black modules on white stock with a plain white quiet zone. The brightness gap is large, the edges are crisp, and the code reads even when the label is small. A museum ticket uses dark charcoal on pale grey card, and the designer checks the printed ticket under gallery lighting before approving it.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A delivery box uses dark ink on a kraft panel that has been given a white printed patch behind the code. Without the patch the kraft background was too dark for reliable reads; with it, the code reads at a normal scanning distance. A gym poster uses dark ink on a pale background with no pattern behind the code.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A restaurant table card uses dark modules on a cream card and keeps the card away from direct window glare. The card is small, but the brightness gap is large, so phones lock on quickly. A retail shelf edge uses black on white with no tint behind the code, even though the surrounding shelf design is colorful.

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

- Try the [QR contrast checker](/qr-contrast-checker) to check your choices before you commit to a design.
- Use the [QR color pair tester](/qr-color-pair-tester) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'Which contrast example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the contrast examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these contrast examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
  art(
    'qr-contrast-mistakes-to-avoid',
    'QR Contrast Mistakes to Avoid',
    'qr contrast mistakes to avoid',
    'The most common qr contrast mistakes that break scanning, and how to spot and fix each one before a print run.',
    'Printing & Sizing',
    '6 min read',
    '2027-08-24',
    `
Most QR codes that fail do not fail because the idea was wrong; they fail because a small contrast mistake slipped through unnoticed. This guide collects the mistakes that show up most often, explains why each one breaks scanning, and shows how to fix it. Read it before you approve a design, and use it as a checklist when you review a proof. A mistake caught on one proof costs minutes; the same mistake caught after a full print run costs the run, the reprint, and the time you lose while the corrected version is made.

### Mistake one: crowding the code

Pairing two mid-tone colors that look different in hue but similar in brightness, such as red on green or blue on purple. The camera sees similar greys and cannot separate modules from background.

Fix it by pulling decoration, text, and color back outside the code panel, and by checking the quiet zone on all four sides of the proof. The code needs a calm island, and the fix is usually a matter of moving things outward rather than redesigning the whole piece.

### Mistake two: weakening the background or the margin

Letting a background tint, shadow, or photo darken the light modules or the quiet zone. The code loses its clean edge and the scanner hunts for a boundary that is no longer there.

Fix it by restoring a solid, light background behind the code and a clean margin around it. If the surrounding design cannot give up that space, enlarge the panel or move the code to a calmer area. A code that fights its own background will keep failing, however often you reprint it.

### Mistake three: trusting the screen instead of the proof

Trusting the screen preview instead of a printed proof. Screens are backlit and flattering; print, laminate, and room light all reduce the gap the scanner relies on.

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

- Try the [QR contrast checker](/qr-contrast-checker) to check your choices before you commit to a design.
- Use the [QR color pair tester](/qr-color-pair-tester) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most common contrast mistake?',
        answer:
          'The most common mistake is letting decoration, color, or text crowd the code or its quiet zone. The design looks finished on screen, but the scanner loses the clean edge it needs. Check the margin and the background on a printed proof, and pull decoration back outside the code panel.',
      },
      {
        question: 'Can a contrast mistake be fixed after printing?',
        answer:
          'Sometimes a small fix helps, such as adding a light panel behind a code or moving it away from glare, but most printed mistakes need a reprint. That is why a proof at the final size, scanned in the real light, matters so much. Catch the mistake on one proof, not on a full run.',
      },
      {
        question: 'How do I check a design for contrast mistakes before I approve it?',
        answer:
          'Work through a short checklist: contrast, quiet zone, code colors, background evenness, placement, and a test scan on two phones. Ask someone who has not seen the design to scan it at the real distance. Fresh eyes catch problems that the designer has stopped seeing.',
      },
    ]
  ),
  art(
    'how-to-test-qr-contrast',
    'How to Test QR Contrast',
    'how to test qr contrast',
    'A step-by-step way to test qr contrast on a real proof, with pass checks and fixes for anything that fails.',
    'Printing & Sizing',
    '7 min read',
    '2027-08-24',
    `
Testing contrast is not a formality; it is the step that separates a design that looks good from a code that actually works. This guide gives you a repeatable test you can run on any proof, with clear pass checks and fixes for the failures you are most likely to see. You do not need specialist equipment: a printed proof at the final size, two different phones, and the real lighting and viewing distance are enough. Run the test every time something changes, and keep a note of what passed so the next batch starts from a proven setup.

### What you need for a contrast test

You need a proof printed at the final size on the real material, two different phones with different cameras, and access to the real placement with its real lighting. Bring a ruler or a simple module guide if you want to check the quiet zone precisely, and bring a pen to mark the proof with what you find. Photograph the printed code, view the photo in greyscale, and scan the print in the dimmest light it will face. If the modules still stand out clearly in greyscale and the scan is instant, the contrast is doing its job.

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

- Try the [QR contrast checker](/qr-contrast-checker) to check your choices before you commit to a design.
- Use the [QR color pair tester](/qr-color-pair-tester) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What do I need to test contrast?',
        answer:
          'You need a proof at the final size on the real material, two different phones, and the real lighting and viewing distance. A screen preview alone is not a test, because it hides print blur, glare, and brightness problems. Keep a note of the size, material, and placement that passed so the next batch starts from a proven setup.',
      },
      {
        question: 'How do I judge whether a contrast test has passed?',
        answer:
          'A test passes when the code scans quickly on both phones, at the real distance, in the real light, without leaning in or shading the code. A scan that needs several tries, a closer distance, or a hand shading the code is a fail, even if it eventually reads. Fix the design and test again.',
      },
      {
        question: 'How often should I retest contrast?',
        answer:
          'Retest whenever anything changes: the link, the colors, the size, the material, the placement, or the printer. Retest a fresh batch even when nothing has changed on paper, because printers and stocks vary. A quick scan of a new proof costs minutes and prevents a run of unusable codes.',
      },
    ]
  ),
  art(
    'qr-logo-placement-rules',
    'QR Logo Placement Rules for Scannable Codes',
    'qr logo placement rules',
    'Practical qr logo placement rules that keep a QR code scannable, with clear checks to apply before you print or publish.',
    'Printing & Sizing',
    '5 min read',
    '2027-08-25',
    `
QR logo placement decides whether a QR code feels like part of your design or like an afterthought stuck onto it, and it also decides whether the code scans. This guide sets out the working rules for logo placement, explains why each rule matters, and shows how to apply it on real materials. The rules are practical rather than theoretical: each one can be checked on a proof with your eyes and a phone, before you spend money on a print run. If you follow them, your code will look intentional and still read quickly in the place where it will actually be used.

### The core rules for logo placement

A logo in the middle of a QR code can make the code recognisably yours, but it also covers data that the scanner needs to read. Logo placement is a trade between branding and readability, and the only safe way to make that trade is to keep the logo small, central, and well separated from the finder patterns.

Place the logo in the centre, keep it modest in size, and use an error correction level that can absorb the covered modules. The centre is the safest spot because it sits far from the three corner finder patterns and the timing patterns that the scanner uses to orient itself.

### How logo placement affects scanning

Size the logo against the code, not against the page. A logo that looks small on a poster can still be large relative to a small code, and a logo that looks fine on screen can cover too much once the code is printed small. Decide the logo size as a share of the code width, then keep that share fixed across sizes.

Give the logo a clean, solid backing patch so its edges do not dissolve into the modules behind it. A logo with a white or light rounded backing reads as one clear shape, while a logo with a transparent or busy edge lets modules show through and confuses both the eye and the scanner.

### Setting up logo placement before you print

Never let the logo touch or overlap a finder pattern, and never let a tagline or icon spill into the quiet zone. The finder patterns are the landmarks the scanner searches for first; covering even part of one can stop detection before decoding starts.

Start with the plainest version that meets the brief, then add branding step by step, testing after each addition. If a step makes scanning slower, that step is the one to simplify. This gradual approach keeps the design honest: you can see exactly which choice helped and which choice hurt. Keep a copy of the last version that scanned instantly, so you can always fall back to a known-good design if a later variation fails.

### Putting this into practice

Pick one live design that uses logo placement and run it through this guide today. Print a proof at the final size, check the rules against it, and fix the first problem you find. Then scan the corrected proof with two phones in the real light. Keep the passing proof as a reference, and use it as the starting point for the next design so you are not solving the same problems twice.

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

- Try the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to check your choices before you commit to a design.
- Use the [QR error budget calculator](/qr-error-budget-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'What is the most important rule for logo placement?',
        answer:
          'Keep the code easy for a camera to read: strong contrast, a clean quiet zone, and an undisturbed symbol. Everything else is presentation around those three conditions. If a design choice weakens any of them, change the design rather than hoping the scanner will cope.',
      },
      {
        question: 'Can I bend the logo placement rules for a small code?',
        answer:
          'Small codes need the rules more, not less, because every module is already tiny and printing blur eats the margin for error. If the code must be small, keep the design plainer, shorten the payload, and test the printed proof at the real distance before you approve it.',
      },
      {
        question: 'How do I know my logo placement choices are safe before printing?',
        answer:
          'Make a proof at the final size on the real material, scan it with two different phones in the real light, and check the quiet zone on all four sides. If any scan hesitates, fix the design and proof again. A short test is far cheaper than a reprint.',
      },
    ]
  ),
  art(
    'qr-logo-placement-examples-that-work',
    'QR Logo Placement Examples That Work',
    'qr logo placement examples that work',
    'Real-world qr logo placement examples that work, showing how the same principles play out on menus, posters, packs, and cards.',
    'Printing & Sizing',
    '6 min read',
    '2027-08-25',
    `
Seeing logo placement done well is faster than reading a list of rules, so this guide walks through examples that work in real places. Each example keeps the same discipline underneath the design: a clean code, a clear margin, strong contrast, and a message that tells people what they get. The examples cover different surfaces and distances, from a card held at arm length to a poster read from across a room. Use them as starting points, copy the structure, adapt the colors and words to your brand, and always test your own version before you print.

### Example one: a small, everyday use

A coffee brand places a small circular mark in the centre of a menu code, on a white disc, with the rest of the code untouched. The mark is instantly recognisable, and the code still scans at the table. A charity places a small heart icon in the centre of a donation code on a collection poster.

The lesson is restraint. The code itself stays plain, the message is short, and the surrounding design does the branding. A reader who glances at the card understands what to do in a second, and a phone locks on without hunting.

### Example two: a larger, public use

A conference puts a compact sponsor mark in the centre of a large registration code on a banner. Because the code is large, the central mark stays small relative to the symbol, and scanning from a few steps away still works. A retail pack puts a small logo in the centre of a product code and keeps the pack code generous in size.

The lesson is scale. A larger code earns a larger margin and a larger message, and the design respects that. The code is not squeezed into a leftover corner; it is given the space its viewing distance demands.

### Example three: a branded, busy surface

A clinic places a small cross emblem in the centre of an appointment code on a leaflet. The emblem sits on a plain backing, the code is printed at a comfortable size, and the leaflet is tested on two phones before printing. The branding is visible without crowding the finder patterns.

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

- Try the [QR logo safe area calculator](/qr-logo-safe-area-calculator) to check your choices before you commit to a design.
- Use the [QR error budget calculator](/qr-error-budget-calculator) to confirm the numbers and guardrails for this element.
- Check the [QR safety checker](/qr-safety-checker) for a practical way to verify the finished code.
- Check the [printed QR tester](/printed-qr-tester) for a practical way to verify the finished code.
- Check the [QR placement guide](/qr-placement-guide) for a practical way to verify the finished code.
- Check the [blog](/blog) for a practical way to verify the finished code.
`,
    [
      {
        question: 'Which logo placement example should I copy first?',
        answer:
          'Start with the simplest example that matches your placement: the same kind of surface, the same viewing distance, and the same lighting. Copy the structure, not the exact colors, and then adapt the frame and message to your own brand. Test your version as a proof before you commit to it.',
      },
      {
        question: 'Do the logo placement examples work on both print and screen?',
        answer:
          'Most do, but each home needs its own file and its own test. A printed example needs a proof on the real stock, while a screen example needs a check on real phones at several brightness levels. Do not assume a design that works in one home will work in the other.',
      },
      {
        question: 'What makes these logo placement examples different from a plain code?',
        answer:
          'Each example keeps the code itself clean and puts the creativity in the frame, the message, and the placement around it. That separation is what lets the design look branded while the code stays easy to scan. If a variation moves decoration into the symbol, it stops being a safe example.',
      },
    ]
  ),
];
