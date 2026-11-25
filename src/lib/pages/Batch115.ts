import type { Article } from '../articles';
import { art } from './helper';

export const batch115: Article[] = [
  art(
    'how-to-test-a-qr-code-before-printing-it',
    'How to Test a QR code before printing it',
    'how to test a qr code before printing it',
    'Learn how to set up a QR code properly, from planning and testing to a small pilot before you rely on it.',
    'Fundamentals',
    '5 min read',
    '2027-05-31',
    `
### Why this setup step matters

Many QR code problems are not scanning problems at all. They are setup problems: the wrong destination, no way to check whether the code still works, or no plan for what happens when the link changes. When you set up a QR code, a little planning now saves a reprint, a confused visitor, or a dead code later. This guide walks through that planning in order.

Start by writing down the job the code must do and how you will know it worked. For a QR code, the destination is the destination page, and the code will appear in a proof sheet before the full run. That single sentence shapes every decision below, from the kind of code you create to how you test it and how you check it after launch.

### Step-by-step: Test a QR code before printing it

1. **Define the job and the success check.** Write down what a visitor should be able to do after scanning, and how you will verify it. A code without a clear job drifts into a dead link or a confusing page.

2. **Prepare the destination and keep it stable.** Open the destination page on a phone and confirm it works. Whenever possible, point the code at a page you control, so you can fix the destination without reprinting the code.

3. **Set up the controls the code needs.** Apply the expiry, access, tracking, or redirect settings that this use case requires, and write them down. Settings that exist only in someone's memory get lost when that person moves on.

4. **Generate the code from the finished setup.** Create the code only after the destination and the controls are in place. Test codes built from drafts cause confusion when the draft changes.

5. **Keep contrast, size, and quiet zone clean.** Even a well-managed code fails if it is hard to scan. Use dark modules on a light background, a clear margin, and a size matched to the viewing distance.

6. **Run a small pilot before you rely on it.** Scan the proof on two phones in the real lighting. Share it with a small group first, watch what they do, and fix anything that confuses them before a wider release.

7. **Schedule a recheck.** Put a reminder in your calendar to rescan the code and confirm the destination still works. Codes on long-lived materials need a routine check, not a one-time test.

### Tips that make it work

- **Keep one owner and one record.** Note who owns the code, where it is placed, and what it points to. Shared codes with no owner go stale.
- **Test the failure path, not only the happy path.** Check what a visitor sees if the link expires, the page moves, or access is denied, and make that message helpful.
- **Start small and expand.** A pilot on one placement teaches you more than a full rollout built on guesses.
- **Write the call to action for the visitor.** Tell people what scanning gives them and what happens next, so they scan with confidence.

### Putting this into practice

Start with the smallest version that still feels real. Create a QR code for one page, one placement, and one audience, then scan the proof on two phones in the real lighting. If the test passes, expand to the next placement. If it fails, change one thing at a time until it passes, and record what fixed it. That record becomes your checklist for every future code of this kind.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Print Proof Checklist](/qr-print-proof-checklist) tool, which handles the setup described above.
- Build it with the [QR Offline Verifier](/qr-offline-verifier) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'How often should I recheck a QR code?',
        answer:
          'Recheck it whenever the destination, the placement, or the settings change, and on a routine schedule otherwise. Codes on long-lived materials deserve a periodic rescan to catch moved pages, expired settings, or faded print. Put the recheck in your calendar and note who owns the code, so it does not depend on memory.',
      },
      {
        question: 'What goes wrong most often when setting up a QR code?',
        answer:
          'The most common failure is pointing the code at a destination that was not finished or tested, followed by skipping the real-world scan test. Settings that were never written down also cause trouble when someone else has to update the code. Finish the destination, run a small pilot, and record the setup so a future update is straightforward.',
      },
      {
        question: 'Can I test a QR code before rolling it out widely?',
        answer:
          'Yes, and you should. Build it for one real destination and one real placement, then scan the proof on two phones in the real lighting. Watch how a first-time visitor reacts and fix anything that confuses them. A small pilot that surfaces a problem is far cheaper than a full rollout that repeats it.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-business-card',
    'How to Print a QR Code on a Business Card',
    'how to print a qr code on a business card',
    'How to print a QR code on a business card that actually scans: vCard or link, exact sizes for standard cards, finishes to avoid, and a proof routine.',
    'Fundamentals',
    '12 min read',
    '2027-05-31',
    `
### 1. The card has one second to do its job

A business card is exchanged in a moment and judged in another. The QR code on it has a simple job: turn that moment into a saved contact, a booked call or a visited portfolio before the card reaches a pocket, a desk drawer or a recycling bin. When it works, your details are in the other person's phone — spelled correctly, with your photo and links — before you have finished shaking hands. When it fails, it fails for boring, fixable reasons: the code is too small, too dense, too glossy, or printed over a photograph.

This is a complete how-to: what the code should contain, how to create it with our free generators, the exact sizes and print specifications for standard cards, and how to proof the result so the box of 500 you order is a box that works.

### 2. Decide what the code contains: vCard or link

Two payloads dominate business cards, and the choice shapes everything else.

**A vCard** packs your contact details — name, title, company, phone, email, website, address — into the code itself. One scan and the phone offers 'Add contact' with everything filled in. No internet needed, nothing hosted, works forever. The cost is density: a full vCard is a lot of data, so the code's pattern is fine and it needs more print size and more care.

**A link** to a contact page, booking page or portfolio. The code stays small and coarse because the payload is short, and you can update the page later — new role, new number, same card. The costs: it needs a connection, and the page must be maintained for as long as the cards circulate.

Choose by use. If you hand cards to people who will save your number — trades, sales, services, networking — the vCard is the direct hit. If the card is a portfolio or booking tool — creatives, consultants, clinics — the link earns its place. Some cards carry a small link code on the front and nothing else; some carry the vCard on the back where there is room to print it properly. What does not work is cramming a maximal vCard into a minimal space: density is the enemy, and section 4 gives the sizes that keep each payload scannable.

Whichever you choose, include less than you think. Name, title, company, one phone, one email, one website is a complete professional contact. Every extra field — second phone, fax, full postal address, social handles typed into the card — makes the pattern denser and the scan slower.

### 3. Step-by-step: create and print the code

**Step 1 — Prepare the details.** Write out exactly what the contact should contain, and check the phone number and email character by character. The code will reproduce a typo faithfully on 500 cards.

**Step 2 — Open the generator.** For a vCard, use our [vCard QR code generator](/vcard-qr-code-generator). For a link, use the [URL QR code generator](/url-qr-code-generator) with your contact or booking page address. Making cards for a whole team? The [bulk business card QR generator](/bulk-business-card-qr-generator) builds one code per person from a single list.

**Step 3 — Generate and test on screen.** Scan the preview with your phone and save the contact. Open the saved contact and read it: right name order, right number, no stray fields. If it is a link, follow it on mobile data and time the page load.

**Step 4 — Set error correction.** For cards, choose **Q** as the default — cards live in wallets and pockets and get scuffed — and **H** if the design places a logo in the code. Higher correction also means a denser pattern, which is another reason to keep the payload lean.

**Step 5 — Customise within limits.** A brand colour for the code is acceptable at full strength — dark navy, deep green, black. Light tints, gradients and reversed (light-on-dark) codes are the three classic card failures; avoid all three. If a logo sits in the centre, keep it under about a fifth of the code's area.

**Step 6 — Download the production file.** SVG, always, for print. A PNG screenshot placed in a design tool is how crisp codes become fuzzy ones. If your designer works in a print package, hand them the SVG and the size specification from section 4, in writing.

**Step 7 — Place it in the artwork.** Back of the card is the natural home: the whole face is available, and the code can be printed at a proper size with its quiet zone intact. Front placement works when the design reserves a clean corner panel for it. Keep the code away from trim edges (allow the standard bleed, and keep the code and its quiet zone inside the safe area), away from folds — cards do not fold, but they do sit against embossing and foil — and off photographs entirely.

**Step 8 — Order a proof, not a box.** Every printer offers a proof or a short run. Take it. Section 6 is the proof routine; do not skip it because the screen preview looked fine. Screens do not have toner, varnish or trim.

### 4. Sizes and print specifications

Standard cards are 85 × 55 mm in most of the world and 3.5 × 2 inches (89 × 51 mm) in the US. Within that small canvas:

- **vCard code:** print at **25 × 25 mm** or larger. A full vCard is dense; 25 mm is the size at which it scans quickly on ordinary phones under ordinary light. 30 mm is better if the design allows it.
- **Link code:** a short URL can print at **20 × 20 mm** reliably. Treat 18 mm as the absolute floor and only for a genuinely short payload.
- **Never below 15 mm** for anything on a card. Codes smaller than that are decoration, not tools.
- **Quiet zone:** at least 4 modules of clear space around the code — on a card, that means a clean margin of roughly 3–4 mm on every side, with no text, rules or logo intruding.
- **Resolution:** the code in the artwork must be vector (SVG) or, if raster is unavoidable, at least 300 dpi at final size. Print itself should be a standard 300 dpi process or better.
- **Stock and finish:** matte or silk stock scans best. Gloss is workable if the code area is left unvarnished. **Spot UV, foil and heavy gloss over the code are scan-killers** — they reflect, they shimmer under light, and cameras lose the modules. If the design uses spot UV, mask the code out of it. Embossing under the code distorts the grid; keep the code on a flat area.
- **Colour:** dark code, light card. If the card itself is dark, print the code inside a white or pale panel — a 'quiet card' — rather than reversing the code. It looks deliberate and it scans.

### 5. What good looks like: three card layouts that work

**The classic back.** Front carries name, title, logo and the human-readable essentials. Back carries the vCard code at 28 mm, centred, with one line of instruction: 'Scan to save my contact'. The instruction matters — a surprising number of people still do not know a card code is for scanning, and the line costs nothing.

**The booking card.** For clinics, salons, trades and consultants whose goal is the appointment, not the contact: a link code on the back opening the booking page, with the phone number printed large for those who prefer to call. The card's job is a booked slot; measure it by bookings.

**The portfolio card.** Creatives put a link code to the portfolio or showreel, kept short through a page on their own domain. The page can be updated for every show or season while the card stays the same — the strongest argument for the link payload.

### 6. The proof routine

With the printed proof in hand:

1. Scan with two phones — one recent, one older or cheaper — in office light and in daylight.
2. Save the contact (or follow the link) and read what arrives: correct fields, correct order, working number.
3. Test the card as it will be used: out of a wallet, off a desk, at a slight angle, not lovingly squared to the camera.
4. Check the trim: the code and its quiet zone fully inside the cut, nothing clipped.
5. Check the finish: no varnish or foil over the code; no emboss crossing it.

If any step fails, the fix is in the artwork or the specification, not in hope. Adjust and re-proof. A box of 500 wrong cards costs more than two proofs.

### 7. Common mistakes and how to fix them

**The code is a tiny design accent.** A 12 mm code in the corner looks elegant and scans like a rumour. Fix: 20 mm minimum for links, 25 mm for vCards — presence is the point.

**Too much data in the vCard.** Every field you add shrinks the modules. Fix: name, title, company, one phone, one email, one website. The saved contact can be enriched later; the scan has to succeed first.

**Code printed over a photo or texture.** The camera cannot find the modules against a busy background. Fix: a clean pale panel behind the code, always.

**Spot UV or foil over the code.** Beautiful in the hand, invisible to the camera at half the angles. Fix: mask the code area out of the finish, and check the proof at an angle, where the failure shows.

**Reversed colours.** White code on a black card defeats many camera apps. Fix: pale panel, dark code — the panel becomes a design feature.

**Out-of-date details on a static code.** A vCard code cannot be edited after printing. Fix: proofread like it is carved in stone (it is), and prefer a link payload if your details change often. When details do change, the honest options are new cards or a redirect you control — never a sticker over the code.

**No instruction line.** People cannot scan what they do not notice. Fix: five words under the code — 'Scan to save my contact' or 'Scan to book' — matched to the payload.

### 8. Privacy and security notes

A vCard on a card contains exactly what you would print on the card, handed to the same people you would hand the card to — the exposure is the same, just more convenient. Think once about which number and email belong on it: many professionals use a work mobile and a role email rather than personal ones, because cards travel further than expected and photographs of cards travel furthest of all.

A link code points at a page you control; keep that page free of anything you would not print, and remember it can be visited by anyone the card reaches. Our generators build both payload types in your browser: the details you enter are not sent to or stored by us, there are no accounts, and the codes are static — they never expire, and they cannot be edited, which is why section 3 starts with checking the details character by character.

### 9. Related tools and guides

- The [vCard QR code generator](/vcard-qr-code-generator) builds the save-my-contact code.
- The [bulk business card QR generator](/bulk-business-card-qr-generator) makes a team's codes from one list.
- The [URL QR code generator](/url-qr-code-generator) builds booking and portfolio link codes.
- The [printed QR tester](/printed-qr-tester) verifies the proof before the full order.
- Our [QR code sizes for printing](/blog/qr-code-sizes-for-printing) guide covers every other print placement.
`,
    [
      {
        question: 'How big should the QR code be on a business card?',
        answer:
          'Print a vCard code at 25 x 25 mm or larger — a full contact is dense and needs the room. A short link code can go to 20 x 20 mm. Never print below 15 mm, and keep a clear quiet zone of roughly 3-4 mm around the code.',
      },
      {
        question: 'Should the code contain a vCard or a link?',
        answer:
          'Choose a vCard if the goal is a saved contact — it works offline and never expires. Choose a link if the goal is a booking or portfolio page, or if your details change often, because the page can be updated while the card stays the same.',
      },
      {
        question: 'Can I use my brand colours and logo in the code?',
        answer:
          'Yes, carefully. Use a dark full-strength brand colour on a light card, raise error correction to Q or H if a logo sits in the centre, and keep the logo under about a fifth of the code\'s area. Avoid light tints, gradients and reversed colours.',
      },
      {
        question: 'Why does my printed card code not scan?',
        answer:
          'Spot UV, foil and heavy gloss over the code reflect light and hide the modules from cameras at many angles. Mask the code area out of the finish, keep the code on a flat, matte area, and check the printed proof at an angle before ordering the run.',
      },
      {
        question: 'What details should a vCard on a card include?',
        answer:
          'Name, job title, company, one phone number, one email and one website. That is a complete professional contact. Extra fields make the pattern denser and the scan slower — the contact can be enriched after it is saved, but the scan has to succeed first.',
      },
      {
        question: 'How do I make codes for my whole team?',
        answer:
          'For one person, generate and test the single code. For a team, our bulk business card generator builds one code per person from a single list — then scan-test each person\'s proof, because a swap between two colleagues\' cards is the classic bulk error.',
      },
      {
        question: 'What happens if my phone number changes after printing?',
        answer:
          'It cannot be edited — a static code is permanent. That is why the details are checked character by character before printing. If details change often, use a link code pointing at a page you control, and update the page instead of the card.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-flyer',
    'How to Print a QR code on a flyer',
    'how to print a qr code on a flyer',
    'Learn how to print a QR code on a flyer so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '7 min read',
    '2027-05-31',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a flyer, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the flyer layout is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a flyer

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof flyer at arm's length and confirm the page opens. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

The fastest way to learn this is to run one complete pass end to end. Set up a QR code on a flyer, place it in the flyer layout, and scan the proof flyer at arm's length and confirm the page opens. Note the size, material, and wording that worked, and keep that note with the exported code file. The next time you need the same kind of code, you will start from a setup you have already proven instead of guessing again.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Size Presets](/qr-size-presets) tool, which handles the setup described above.
- Build it with the [QR Print Sheet Planner](/qr-print-sheet-planner) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a flyer be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a flyer scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a flyer scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-poster',
    'How to Print a QR code on a poster',
    'how to print a qr code on a poster',
    'Learn how to print a QR code on a poster so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '5 min read',
    '2027-06-01',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a poster, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the poster layout is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a poster

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof poster from the expected viewing distance. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

Start with the smallest version that still feels real. Create a QR code on a poster for one page, one placement, and one audience, then scan the proof poster from the expected viewing distance. If the test passes, expand to the next placement. If it fails, change one thing at a time until it passes, and record what fixed it. That record becomes your checklist for every future code of this kind.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Billboard Size Calculator](/qr-billboard-size-calculator) tool, which handles the setup described above.
- Build it with the [QR Size Presets](/qr-size-presets) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a poster be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a poster scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a poster scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-banner',
    'How to Print a QR code on a banner',
    'how to print a qr code on a banner',
    'Learn how to print a QR code on a banner so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '6 min read',
    '2027-06-01',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a banner, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the banner layout is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a banner

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof banner from the expected viewing distance. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

Put this into practice with a single real example before you scale it. Build a QR code on a banner for one real destination, place it where it will actually be used, and scan the proof banner from the expected viewing distance. Watch how a first-time visitor reacts: do they notice the code, understand what scanning gives them, and reach the right page without help. If any step feels slow or unclear, fix that step now. A small test that surfaces a problem is far cheaper than a full rollout that repeats it.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Billboard Size Calculator](/qr-billboard-size-calculator) tool, which handles the setup described above.
- Build it with the [QR Fade Risk Checker](/qr-fade-risk-checker) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a banner be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a banner scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a banner scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-vehicle',
    'How to Print a QR code on a vehicle',
    'how to print a qr code on a vehicle',
    'Learn how to print a QR code on a vehicle so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '7 min read',
    '2027-06-01',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a vehicle, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on vehicle doors and rear panels is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a vehicle

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof on the vehicle in daylight and confirm it opens. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

The fastest way to learn this is to run one complete pass end to end. Set up a QR code on a vehicle, place it in vehicle doors and rear panels, and scan the proof on the vehicle in daylight and confirm it opens. Note the size, material, and wording that worked, and keep that note with the exported code file. The next time you need the same kind of code, you will start from a setup you have already proven instead of guessing again.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [Curved Surface QR Calculator](/qr-curved-surface-calculator) tool, which handles the setup described above.
- Build it with the [QR Fade Risk Checker](/qr-fade-risk-checker) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a vehicle be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a vehicle scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a vehicle scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-t-shirt',
    'How to Print a QR code on a T-shirt',
    'how to print a qr code on a t shirt',
    'Learn how to print a QR code on a T-shirt so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '5 min read',
    '2027-06-02',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a T-shirt, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the shirt front or back is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a T-shirt

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof shirt while worn and confirm it opens. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

Start with the smallest version that still feels real. Create a QR code on a T-shirt for one page, one placement, and one audience, then scan the proof shirt while worn and confirm it opens. If the test passes, expand to the next placement. If it fails, change one thing at a time until it passes, and record what fixed it. That record becomes your checklist for every future code of this kind.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [Curved Surface QR Calculator](/qr-curved-surface-calculator) tool, which handles the setup described above.
- Build it with the [QR Fade Risk Checker](/qr-fade-risk-checker) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a T-shirt be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a T-shirt scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a T-shirt scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-mug',
    'How to Print a QR code on a mug',
    'how to print a qr code on a mug',
    'Learn how to print a QR code on a mug so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '6 min read',
    '2027-06-02',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a mug, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the mug body is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a mug

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof mug from a normal holding distance. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

Put this into practice with a single real example before you scale it. Build a QR code on a mug for one real destination, place it where it will actually be used, and scan the proof mug from a normal holding distance. Watch how a first-time visitor reacts: do they notice the code, understand what scanning gives them, and reach the right page without help. If any step feels slow or unclear, fix that step now. A small test that surfaces a problem is far cheaper than a full rollout that repeats it.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [Curved Surface QR Calculator](/qr-curved-surface-calculator) tool, which handles the setup described above.
- Build it with the [QR Module Size Calculator](/qr-module-size-calculator) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a mug be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a mug scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a mug scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-a-sticker',
    'How to Print a QR code on a sticker',
    'how to print a qr code on a sticker',
    'Learn how to print a QR code on a sticker so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '7 min read',
    '2027-06-02',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on a sticker, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the sticker surface is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on a sticker

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof sticker after sticking it to the real surface. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

The fastest way to learn this is to run one complete pass end to end. Set up a QR code on a sticker, place it in the sticker surface, and scan the proof sticker after sticking it to the real surface. Note the size, material, and wording that worked, and keep that note with the exported code file. The next time you need the same kind of code, you will start from a setup you have already proven instead of guessing again.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Label Count Calculator](/qr-label-count-calculator) tool, which handles the setup described above.
- Build it with the [QR Print Cost Calculator](/qr-print-cost-calculator) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on a sticker be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on a sticker scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on a sticker scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
  art(
    'how-to-print-a-qr-code-on-packaging',
    'How to Print a QR code on packaging',
    'how to print a qr code on packaging',
    'Learn how to print a QR code on packaging so it scans reliably, from sizing and contrast to a proof copy checked in the real lighting.',
    'Fundamentals',
    '5 min read',
    '2027-06-03',
    `
### Why printing needs its own plan

A QR code that scans perfectly on a screen can fail on paper. Ink spreads, materials reflect light, surfaces curve, and viewing distances change. When you print a QR code on packaging, you are choosing a physical object that has to survive handling, sunlight, and real-world placement. This guide walks through those decisions in order, so the printed result scans as reliably as the digital proof.

Begin with the surface and the viewing distance, because those two facts drive every other choice. A code on the pack front or side panel is read from a particular distance, in particular light, by people who may be moving. Size, contrast, and material all follow from that. Guessing any of them and hoping the printer compensates is how most failed print runs happen.

### Step-by-step: Print a QR code on packaging

1. **Confirm the surface and viewing distance.** Measure how far away a scanner will stand and note the lighting, glare, and whether the surface is flat, curved, or textured. These details decide the size and material.

2. **Choose a size for that distance.** A code meant to be read from far away must be larger, with bigger modules that a camera can resolve. Print a proof at the planned size and scan it from the real distance before committing.

3. **Generate the code from the final destination.** Use the finished link or payload, keep it as short as practical, and avoid regenerating from a draft that may change after printing.

4. **Export at high resolution.** A small web image stretched to print size turns soft and blurry, which hurts scanning. Export a vector file or a high-resolution image so edges stay crisp at the final size.

5. **Protect contrast and the quiet zone.** Keep dark modules on a light background, keep the margin around the symbol clear, and keep text, borders, and artwork from crowding the code.

6. **Print one proof and test it hard.** Scan the proof pack on a shelf and confirm the page opens. Check it in the actual lighting, at the actual distance, on two different phones. A proof that fails is cheap; a full run that fails is not.

7. **Run the batch, then spot-check the finished pieces.** Print the full run, then scan several finished pieces from across the run. If the printer drifts, ink runs low, or a material batch changes, spot checks catch it before the pieces go out.

### Tips that make it work

- **Test the real material, not plain paper.** A proof on the actual stock, laminate, or surface behaves differently from a proof on office paper.
- **Watch for glare and reflections.** Glossy finishes and glass can hide modules from a camera at certain angles. Tilt the proof and check it from several angles.
- **Keep the code away from folds and seams.** A crease through the symbol breaks the pattern. Leave room so the code sits on a flat, undisturbed area.
- **Keep a reference proof.** File one approved proof with notes on size, material, and settings so reprints match the version that worked.

### Putting this into practice

Start with the smallest version that still feels real. Create a QR code on packaging for one page, one placement, and one audience, then scan the proof pack on a shelf and confirm the page opens. If the test passes, expand to the next placement. If it fails, change one thing at a time until it passes, and record what fixed it. That record becomes your checklist for every future code of this kind.

### Common mistakes to avoid

- **Pointing at an unfinished destination.** A code that opens a draft, a broken page, or the wrong page wastes the scan and the trust that came with it. Finish the destination first.
- **Skipping the real-world test.** A code that scans on a monitor can fail on paper, on a wall, or in glare. Always test the finished piece in the place it will be used.
- **Crowding the quiet zone.** Text, borders, and artwork that touch the symbol make scanning slower and less reliable. Keep the margin around the code clear.
- **Forgetting the code after launch.** Links move, pages change, and materials fade. A code with no owner and no recheck schedule quietly goes stale.

### Quick checklist

- Destination finished and checked on a phone.
- Code generated from the final destination.
- Strong contrast with a clear quiet zone on all sides.
- Call to action beside the code explains the benefit.
- Tested on two phones in the real lighting and placement.
- Owner and recheck reminder recorded.

### Related tools and guides

- Build it with the [QR Print Sheet Planner](/qr-print-sheet-planner) tool, which handles the setup described above.
- Build it with the [Quiet Zone Calculator](/qr-quiet-zone-calculator) tool, which handles the setup described above.
- Check the result with the [QR Scanner](/qr-scanner) before you print or publish.
- Check the result with the [QR Safety Checker](/qr-safety-checker) before you print or publish.
- Check the result with the [QR Size Calculator](/qr-size-calculator) before you print or publish.
- Check the result with the [Printed QR Tester](/printed-qr-tester) before you print or publish.
- Check the result with the [QR Placement Guide](/qr-placement-guide) before you print or publish.
- Explore more in the [Blog](/blog) guide for related setups and examples.
`,
    [
      {
        question: 'What size should a QR code on packaging be?',
        answer:
          "Size depends on how far away the scanner will stand and how dense the code is. A code read at arm's length can be small, while a code read across a room must be much larger. Print a proof at the planned size and scan it from the real viewing distance. If it struggles, increase the size or shorten the encoded content rather than hoping a reprint will fix it.",
      },
      {
        question: 'Why does a QR code on packaging scan on screen but not after printing?',
        answer:
          'Printing can soften edges, lower contrast, or shrink the code below the size you tested. Paper texture, ink spread, and glossy reflections also affect scanning. Always test a proof printed on the real material, in the real lighting, and check it from the real viewing distance before running the full batch.',
      },
      {
        question: 'How do I keep a QR code on packaging scannable over time?',
        answer:
          'Choose a material suited to the environment, keep the code away from folds, wear, and direct abrasion, and check it periodically. Outdoor codes need protection from sun and weather, and handled items need a durable finish. Keep an approved proof on file so reprints match the version that worked.',
      },
    ]
  ),
];
