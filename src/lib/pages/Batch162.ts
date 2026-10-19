import type { Article } from '../articles';
import { art } from './helper';

export const batch162: Article[] = [
  art(
    'how-to-measure-qr-device-mix',
    'How to Measure QR Device Mix',
    'how to measure qr device mix',
    'Learn how to measure device mix for QR campaigns, including the formula, the data you need, and a worked example with clearly labelled illustrative numbers.',
    'Business & Regional',
    '7 min read',
    '2027-11-03',
    `
### What device mix tells you

Device mix is the breakdown of scans by device and operating system. It tells you which phones your audience actually uses, so you can test and optimise for the devices that matter instead of the one in your pocket.

Device mix is about coverage, not preference. A group that is small in scans can still be large in revenue.

### How to compute device mix

Device share = scans from one device group divided by total scans, multiplied by 100.

Illustrative example numbers, not real-world data: 240 of 400 scans from one operating system gives 240 / 400 x 100 = 60% for that group. If the remaining 40% come from the other major system, both deserve testing, not just the majority.

### How to collect the data

Read device data from your analytics or redirect tool, and group small categories into an Other bucket so the picture stays readable.

Keep the raw counts, not just the final percentage. Raw counts let you recompute the metric if you later fix the definition, and they make it possible to spot a denominator problem, such as a week where exposures were estimated instead of counted. Store the counts in one place with the date range, the placements included, and the name of the person who pulled them. That small discipline turns a spreadsheet into an audit trail.

### Reading the result

Never judge device mix as a single number. Break it down by operating system, device model group, and browser. A campaign that looks average overall may be strong in one segment and weak in another, and the fix is completely different in each case. Compare the same placement against its own past, and compare different placements only when their audiences and contexts are genuinely similar. A short trend over four or more comparable periods is worth far more than a single snapshot, because it separates a real shift from weekly noise.

Also check the relationship between device mix and the metrics around it. If scans rise while conversions fall, the new scanners may be less interested visitors, or the landing page may have changed. If cost rises while device mix stays flat, you are paying more for the same outcome. Metrics make sense in groups, not in isolation, and the habit of reading two or three together prevents most misreadings.

### Putting this into practice

Start with one code and one placement. Define device mix in one sentence, collect the two numbers it needs for two full weeks, and compute the result by hand once so you trust the pipeline. Then set up the same measurement for your other placements, using identical definitions and identical date ranges. When the numbers arrive, write down the one action they suggest, the owner of that action, and the date you will recheck. Measurement without a decision attached is bookkeeping, and bookkeeping does not improve campaigns.

### Common mistakes to avoid

- Assuming your own phone represents your audience.
- Ignoring a small device group that converts unusually well.
- Judging a result after two days and changing a working placement.
- Comparing placements with different audiences as if they were equal.
- Reporting a percentage without the raw counts behind it.

### Quick checklist

- Define device mix in one sentence and keep the definition stable.
- Collect both sides of the ratio for the same period and placements.
- Segment by operating system, device model group, and browser.
- Compare against your own past before judging the number.
- Record the raw counts, date range, and method with every reading.
- Attach one decision, one owner, and one recheck date to each report.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Plan goals, placements, quantities, and QA with the [QR campaign planner](/qr-campaign-planner) before the first print run.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- Check proofs under real conditions with the [printed QR tester](/printed-qr-tester) before a full run.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What data do I need to measure device mix?',
        answer:
          'You need both sides of the ratio: the count of the event, such as scans, and the base it is measured against, such as exposures. Without the base, the count cannot be compared across placements or periods. Record the date range and the exact definition you used, so a later reading is comparable.',
      },
      {
        question: 'How often should I check device mix?',
        answer:
          'Check it on a fixed cadence that matches the campaign, such as weekly for active campaigns and monthly for always-on codes. More frequent checks help during a launch, when problems are cheapest to fix. Avoid reacting to a single day of data, since daily numbers swing for reasons that have nothing to do with quality.',
      },
      {
        question: 'Why does device mix look different across placements?',
        answer:
          'Placements differ in audience, dwell time, lighting, and intent, so the same code can perform very differently in two spots. Segment the numbers by placement before judging them. A placement that looks weak in aggregate may be strong once you compare it only with similar placements.',
      },
    ]
  ),
  art(
    'how-to-improve-qr-device-mix',
    'How to Improve QR Device Mix',
    'how to improve qr device mix',
    'Practical ways to improve device mix for QR campaigns, starting with diagnosis, then tested changes that lift results without guessing.',
    'Business & Regional',
    '5 min read',
    '2027-11-04',
    `
### Why improving device mix is worth the effort

Device mix is the breakdown of scans by device and operating system. It tells you which phones your audience actually uses, so you can test and optimise for the devices that matter instead of the one in your pocket.

Device mix is about coverage, not preference. A group that is small in scans can still be large in revenue.

### Diagnose before you change anything

Improvement starts with diagnosis, not with redesign. Before changing a code, split device mix by operating system, device model group, and browser and look for the weakest segment. The weakest segment is where a fix buys the most, because it holds the largest pool of lost value. Also check the steps around device mix: a problem upstream, such as poor placement, can masquerade as a problem with the code itself, and a problem downstream, such as a slow landing page, can waste scans that were earned fairly. Fix the constraint, not the symptom.

Write down your diagnosis in one paragraph before you touch anything. State what you observed, which segment is weakest, and what you believe is causing it. This paragraph is your hypothesis, and it keeps the work honest: if the fix does not move the number, the hypothesis was wrong, and you learn something instead of merely changing things.

### Levers that move device mix

- Test the destination on both major phone systems, not just your own.
- Fix layout and speed problems on the device group that converts worst.
- Keep the payload short so older or slower phones decode quickly.

Work through the levers in order of expected impact per unit of effort. A lever that costs nothing and affects every scanner beats a lever that costs a print run and affects one placement. For each lever, state the change, the cost, and the segment it should move, then implement only that change. Bundling several changes together feels productive, but it destroys your ability to learn which one worked.

### Test the change properly

Device share = scans from one device group divided by total scans, multiplied by 100.

Illustrative example numbers, not real-world data: 240 of 400 scans from one operating system gives 240 / 400 x 100 = 60% for that group. If the remaining 40% come from the other major system, both deserve testing, not just the majority.

Run the change as a comparison wherever you can: the old version against the new version, on comparable placements, over the same kind of period. Keep everything else stable, and decide in advance how long the test runs and what counts as a win. A test that ends the moment one variant pulls ahead is not a test, it is a reaction. If traffic is too small for a formal test, change one thing, record the before and after numbers, and treat the result as suggestive rather than proven.

### Putting this into practice

Pick one placement and one lever. Apply the change, leave it alone for a full cycle, and measure device mix with the same definition you used before. If the number improves, roll the change out to similar placements. If it does not, revert it and test the next lever. This loop, repeated steadily, improves campaigns faster than occasional large redesigns, because every cycle teaches you something about your own audience.

### Common mistakes to avoid

- Assuming your own phone represents your audience.
- Ignoring a small device group that converts unusually well.
- Changing several things at once and not knowing which one worked.
- Declaring victory after one good day instead of a full cycle.
- Copying a tactic that worked for a different audience or placement.

### Quick checklist

- Diagnose by segment before changing anything.
- Write the hypothesis down in one paragraph.
- Change one lever at a time.
- Decide the test length and the win condition in advance.
- Measure before and after with identical definitions.
- Roll out winners, revert losers, and record what you learned.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Design a fair comparison with the [QR A/B test planner](/qr-a-b-test-planner), including sample size and decision rules.
- Review placement, height, and lighting in the [QR placement guide](/qr-placement-guide) before moving any code.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- When many codes share one campaign, the [bulk generator](/bulk-generator) keeps tagging and formats consistent.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is the fastest way to improve device mix?',
        answer:
          'Start by finding the biggest leak or the weakest segment, then fix that one thing. Small, targeted fixes beat broad redesigns because they are cheaper to test and easier to attribute. Measure before and after with the same definition so you can tell whether the fix worked.',
      },
      {
        question: 'Should I change several things at once to improve device mix?',
        answer:
          'Usually not, because simultaneous changes make it impossible to know which one mattered. Change one variable at a time, or run a controlled test with clean variants. The exception is a broken experience, where fixing the obvious faults together is better than testing them one by one.',
      },
      {
        question: 'How long before I see improvement in device mix?',
        answer:
          'Allow at least one full cycle of your audience, such as a full week for a store or a full month for a monthly offer. Early movement is often noise, and cutting a change short wastes the effort. Decide the review date before you start, and judge the result only then.',
      },
    ]
  ),
  art(
    'qr-device-mix-benchmarks-explained',
    'QR Device Mix Benchmarks Explained',
    'qr device mix benchmarks explained',
    'What device mix benchmarks can and cannot tell you, why they vary, and how to build your own baseline instead of copying a published number.',
    'Business & Regional',
    '6 min read',
    '2027-11-04',
    `
### What benchmarks can and cannot do

Device mix is the breakdown of scans by device and operating system. It tells you which phones your audience actually uses, so you can test and optimise for the devices that matter instead of the one in your pocket.

Benchmarks for device mix are tempting because they promise a shortcut: one number that tells you whether you are doing well. In practice, a benchmark is only as useful as its definition, and definitions vary widely. One source may count every scan, another may count only unique scanners, and a third may measure a different placement type entirely. Two benchmarks that disagree are not a puzzle to solve; they are a signal that the underlying measurements differ. Treat any benchmark as a rough reference, never as a verdict.

### Why benchmarks for device mix vary

Benchmarks vary for reasons that have nothing to do with quality. Placement changes everything: a code at a checkout behaves differently from a code on a poster. Audience matters too: existing customers scan for different reasons than strangers do. Offer strength, season, device mix, and time of day all shift the number. Even the definition shifts it: changing the denominator or the time window changes the result without changing the campaign at all. Device mix is about coverage, not preference. A group that is small in scans can still be large in revenue.

This variation is why copying a published benchmark as a target is risky. You may be comparing your menu code against someone else's checkout code, or your first month against their twelfth. The gap you see may be a measurement gap, not a performance gap, and chasing it can lead you to fix things that were never broken.

### How to build your own baseline

Your own baseline is the benchmark that matters most, because it shares your definition, your placements, and your audience. Build it in four steps. First, write down the definition: Device share = scans from one device group divided by total scans, multiplied by 100. Second, measure it for a fixed period on a stable placement and record the raw counts, the date range, and the method. Third, repeat the measurement for two or three more comparable periods. Fourth, use the range you observed as your baseline, not a single point, because a range respects normal variation.

Illustrative example numbers, not real-world data: 240 of 400 scans from one operating system gives 240 / 400 x 100 = 60% for that group. If the remaining 40% come from the other major system, both deserve testing, not just the majority.

Once the baseline exists, judge new results against it. A result inside the baseline range is normal variation. A result outside the range for two consecutive periods is a signal worth investigating. This approach is slower than copying a published number, but it is honest, and it improves as your own history grows.

### Comparing fairly

When you do compare against an external figure, check four things: the definition, the placement type, the audience, and the period. If any of them differ materially, adjust your expectations or skip the comparison. Compare like with like, and note the differences in writing so the next person who reads the comparison understands its limits. Also remember that benchmarks describe a group, not a promise: being below a benchmark does not prove failure, and being above it does not prove excellence.

### Putting this into practice

Pick one placement and build a baseline for device mix over the next four comparable periods. Record the definition, the raw counts, and the method alongside every reading. At the end of the four periods, write down the baseline range and the one improvement you will test next. From then on, every new reading gets judged against your own baseline first and against external figures only as a secondary check.

### Common mistakes to avoid

- Assuming your own phone represents your audience.
- Ignoring a small device group that converts unusually well.
- Treating a published benchmark as a target without checking its definition.
- Comparing placements with different audiences and calling the gap a performance gap.
- Freezing a baseline forever instead of updating it each quarter.

### Quick checklist

- Write the definition down before comparing anything.
- Build your own baseline from three or more comparable periods.
- Use a range, not a single point, as the baseline.
- Check definition, placement, audience, and period before using an external figure.
- Update the baseline each quarter.
- Judge two consecutive out-of-range readings as a signal, not one.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Plan goals, placements, quantities, and QA with the [QR campaign planner](/qr-campaign-planner) before the first print run.
- Keep a simple record of your own observations with the [QR scan log](/qr-scan-log) so field notes are not lost.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Review placement, height, and lighting in the [QR placement guide](/qr-placement-guide) before moving any code.
- Check proofs under real conditions with the [printed QR tester](/printed-qr-tester) before a full run.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is a good device mix for my campaign?',
        answer:
          'The honest answer is that it depends on your placement, audience, offer, and definition, so a single published number cannot set your target. Your own past performance on a comparable placement is the most useful reference. Use external figures only as a rough sanity check, never as a promise.',
      },
      {
        question: 'Why do published benchmarks for device mix disagree?',
        answer:
          'They disagree because they measure different things: different placements, audiences, definitions, and time windows. One source may count all scans while another counts only unique scanners, which produces very different numbers. Always check the definition behind a benchmark before comparing your numbers with it.',
      },
      {
        question: 'How do I build my own baseline for device mix?',
        answer:
          'Pick one definition, measure it for a fixed period on a stable placement, and record the result with its date range and method. Repeat the measurement for two or three more periods, then use the range you observed as your baseline. Update it each quarter so it reflects your current audience rather than an old one.',
      },
    ]
  ),
  art(
    'qr-device-mix-mistakes-to-avoid',
    'QR Device Mix Mistakes to Avoid',
    'qr device mix mistakes to avoid',
    'The most common device mix mistakes in QR campaigns, why each one distorts decisions, and how to fix each one.',
    'Business & Regional',
    '7 min read',
    '2027-11-04',
    `
### Why device mix mistakes are expensive

Device mix is the breakdown of scans by device and operating system. It tells you which phones your audience actually uses, so you can test and optimise for the devices that matter instead of the one in your pocket.

Mistakes in measuring or managing device mix are expensive because they corrupt decisions. A wrong number does not just sit in a report; it moves budget, kills working placements, and rewards failing ones. Device mix is about coverage, not preference. A group that is small in scans can still be large in revenue. The good news is that most mistakes are repeatable and preventable. They come from a short list of causes, and a short checklist catches nearly all of them.

### Mistake 1: Measuring with an unstable definition

The single most damaging mistake is changing the definition mid-campaign. Counting unique scanners one month and all scans the next makes the trend meaningless, even though both numbers are called device mix. Fix it by writing the definition down: Device share = scans from one device group divided by total scans, multiplied by 100. Keep that definition stable, and if you must change it, note the change in the report and restart the trend from that point rather than pretending the old and new numbers are comparable.

### Mistake 2: Comparing unlike placements

A code at a checkout, a code on a poster, and a code in an email serve different moments and different intents. Comparing their device mix as if they were equal leads to confident, wrong conclusions, such as killing a placement that was actually performing well for its context. Fix it by segmenting before judging: compare each placement against its own past, and only compare across placements when audience and context are genuinely similar.

### Mistake 3: Ignoring the denominator

People remember the numerator and forget the denominator. Scans rose, so the campaign improved, or so the story goes, until someone notices exposures rose faster and device mix actually fell. Fix it by always reporting both sides of the ratio and the raw counts behind them. A percentage without its counts is a claim without evidence.

### Mistake 4: Reacting to noise

Daily numbers swing for reasons that have nothing to do with quality: weather, weekdays, holidays, and one large group passing a poster. Reacting to a single day means changing working placements on the basis of noise. Fix it by deciding the review cadence in advance, using comparable periods, and requiring two consecutive out-of-range readings before acting.

### Mistake 5: Blaming the code for a downstream problem

Assuming your own phone represents your audience. and Ignoring a small device group that converts unusually well. both appear in reports that blame the QR code for problems elsewhere in the journey. Before redesigning the code, check the steps around it: placement, lighting, landing page, form, and offer. The code is often the most visible part of the journey and the least guilty.

### Putting this into practice

Audit your current device mix reporting against the five mistakes above. For each one, write down whether it applies to your reports and the one fix you will make this week. Then re-issue the last report with the fixes applied: stable definition, segmented comparisons, both sides of the ratio, a sensible review cadence, and a check of the surrounding steps. The corrected report may tell a different story, and that different story is the point.

### Common mistakes to avoid

- Assuming your own phone represents your audience.
- Ignoring a small device group that converts unusually well.
- Changing the definition mid-campaign without noting it.
- Judging a placement against an unlike placement.
- Reacting to one day of data instead of a full comparable period.

### Quick checklist

- Write the definition down and keep it stable.
- Segment by operating system, device model group, and browser before judging.
- Report both sides of the ratio and the raw counts.
- Use comparable periods and a fixed review cadence.
- Check the steps around the code before blaming the code.
- Note any method change alongside the numbers it affects.

### Related tools and guides

- Design a fair comparison with the [QR A/B test planner](/qr-a-b-test-planner), including sample size and decision rules.
- Check a whole batch of destinations at once with the [QR batch validator](/qr-batch-validator) before printing.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before sharing a code widely.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is the most common mistake with device mix?',
        answer:
          'The most common mistake is comparing numbers that were built from different definitions, periods, or placements. The result looks like a trend but is really a measurement change. Write the definition down, keep it stable, and note any change in method alongside the numbers.',
      },
      {
        question: 'How do I know if my device mix numbers are wrong?',
        answer:
          'Look for signs that do not fit: sudden jumps with no campaign change, totals that do not reconcile with another tool, or a metric that contradicts every related metric. Recompute one period by hand from raw counts to check the pipeline. If the hand calculation disagrees, trust the hand calculation and fix the pipeline.',
      },
      {
        question: 'Can I fix historical device mix data?',
        answer:
          'Sometimes you can, if the raw counts still exist and only the formula was wrong. If the raw data is missing or the tagging was broken, the honest move is to mark the period as unreliable and start clean measurement from now. Reconstructed history built on guesses will mislead the next decision.',
      },
    ]
  ),
  art(
    'how-to-measure-qr-location-mix',
    'How to Measure QR Location Mix',
    'how to measure qr location mix',
    'Learn how to measure location mix for QR campaigns, including the formula, the data you need, and a worked example with clearly labelled illustrative numbers.',
    'Business & Regional',
    '5 min read',
    '2027-11-05',
    `
### What location mix tells you

Location mix is the breakdown of scans by where each code is placed. It shows which rooms, shelves, streets, or pages earn their keep and which placements are decoration.

A quiet location can still be valuable if its scanners convert at a much higher rate, so read location mix beside conversion rate.

### How to compute location mix

Location share = scans from one location divided by total scans, multiplied by 100.

Illustrative example numbers, not real-world data: 180 of 400 scans came from the front entrance, giving 180 / 400 x 100 = 45% for that location. The remaining scans split across three other spots, which makes the entrance the clear winner in this example.

### How to collect the data

Give every location its own destination or UTM tag. Without per-location tagging, you cannot attribute a single shared link to the place that produced the scan.

Keep the raw counts, not just the final percentage. Raw counts let you recompute the metric if you later fix the definition, and they make it possible to spot a denominator problem, such as a week where exposures were estimated instead of counted. Store the counts in one place with the date range, the placements included, and the name of the person who pulled them. That small discipline turns a spreadsheet into an audit trail.

### Reading the result

Never judge location mix as a single number. Break it down by store, floor, shelf, poster position, and city. A campaign that looks average overall may be strong in one segment and weak in another, and the fix is completely different in each case. Compare the same placement against its own past, and compare different placements only when their audiences and contexts are genuinely similar. A short trend over four or more comparable periods is worth far more than a single snapshot, because it separates a real shift from weekly noise.

Also check the relationship between location mix and the metrics around it. If scans rise while conversions fall, the new scanners may be less interested visitors, or the landing page may have changed. If cost rises while location mix stays flat, you are paying more for the same outcome. Metrics make sense in groups, not in isolation, and the habit of reading two or three together prevents most misreadings.

### Putting this into practice

Start with one code and one placement. Define location mix in one sentence, collect the two numbers it needs for two full weeks, and compute the result by hand once so you trust the pipeline. Then set up the same measurement for your other placements, using identical definitions and identical date ranges. When the numbers arrive, write down the one action they suggest, the owner of that action, and the date you will recheck. Measurement without a decision attached is bookkeeping, and bookkeeping does not improve campaigns.

### Common mistakes to avoid

- Using one shared link for every location and then guessing which worked.
- Judging a location after a few days instead of a full trading cycle.
- Judging a result after two days and changing a working placement.
- Comparing placements with different audiences as if they were equal.
- Reporting a percentage without the raw counts behind it.

### Quick checklist

- Define location mix in one sentence and keep the definition stable.
- Collect both sides of the ratio for the same period and placements.
- Segment by store, floor, shelf, poster position, and city.
- Compare against your own past before judging the number.
- Record the raw counts, date range, and method with every reading.
- Attach one decision, one owner, and one recheck date to each report.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Plan goals, placements, quantities, and QA with the [QR campaign planner](/qr-campaign-planner) before the first print run.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- Check proofs under real conditions with the [printed QR tester](/printed-qr-tester) before a full run.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What data do I need to measure location mix?',
        answer:
          'You need both sides of the ratio: the count of the event, such as scans, and the base it is measured against, such as exposures. Without the base, the count cannot be compared across placements or periods. Record the date range and the exact definition you used, so a later reading is comparable.',
      },
      {
        question: 'How often should I check location mix?',
        answer:
          'Check it on a fixed cadence that matches the campaign, such as weekly for active campaigns and monthly for always-on codes. More frequent checks help during a launch, when problems are cheapest to fix. Avoid reacting to a single day of data, since daily numbers swing for reasons that have nothing to do with quality.',
      },
      {
        question: 'Why does location mix look different across placements?',
        answer:
          'Placements differ in audience, dwell time, lighting, and intent, so the same code can perform very differently in two spots. Segment the numbers by placement before judging them. A placement that looks weak in aggregate may be strong once you compare it only with similar placements.',
      },
    ]
  ),
  art(
    'how-to-improve-qr-location-mix',
    'How to Improve QR Location Mix',
    'how to improve qr location mix',
    'Practical ways to improve location mix for QR campaigns, starting with diagnosis, then tested changes that lift results without guessing.',
    'Business & Regional',
    '6 min read',
    '2027-11-05',
    `
### Why improving location mix is worth the effort

Location mix is the breakdown of scans by where each code is placed. It shows which rooms, shelves, streets, or pages earn their keep and which placements are decoration.

A quiet location can still be valuable if its scanners convert at a much higher rate, so read location mix beside conversion rate.

### Diagnose before you change anything

Improvement starts with diagnosis, not with redesign. Before changing a code, split location mix by store, floor, shelf, poster position, and city and look for the weakest segment. The weakest segment is where a fix buys the most, because it holds the largest pool of lost value. Also check the steps around location mix: a problem upstream, such as poor placement, can masquerade as a problem with the code itself, and a problem downstream, such as a slow landing page, can waste scans that were earned fairly. Fix the constraint, not the symptom.

Write down your diagnosis in one paragraph before you touch anything. State what you observed, which segment is weakest, and what you believe is causing it. This paragraph is your hypothesis, and it keeps the work honest: if the fix does not move the number, the hypothesis was wrong, and you learn something instead of merely changing things.

### Levers that move location mix

- Move underperforming codes to spots with more dwell time and foot traffic.
- Localise the call to action so it matches what people do in that spot.
- Double down on the best location before paying for more locations.

Work through the levers in order of expected impact per unit of effort. A lever that costs nothing and affects every scanner beats a lever that costs a print run and affects one placement. For each lever, state the change, the cost, and the segment it should move, then implement only that change. Bundling several changes together feels productive, but it destroys your ability to learn which one worked.

### Test the change properly

Location share = scans from one location divided by total scans, multiplied by 100.

Illustrative example numbers, not real-world data: 180 of 400 scans came from the front entrance, giving 180 / 400 x 100 = 45% for that location. The remaining scans split across three other spots, which makes the entrance the clear winner in this example.

Run the change as a comparison wherever you can: the old version against the new version, on comparable placements, over the same kind of period. Keep everything else stable, and decide in advance how long the test runs and what counts as a win. A test that ends the moment one variant pulls ahead is not a test, it is a reaction. If traffic is too small for a formal test, change one thing, record the before and after numbers, and treat the result as suggestive rather than proven.

### Putting this into practice

Pick one placement and one lever. Apply the change, leave it alone for a full cycle, and measure location mix with the same definition you used before. If the number improves, roll the change out to similar placements. If it does not, revert it and test the next lever. This loop, repeated steadily, improves campaigns faster than occasional large redesigns, because every cycle teaches you something about your own audience.

### Common mistakes to avoid

- Using one shared link for every location and then guessing which worked.
- Judging a location after a few days instead of a full trading cycle.
- Changing several things at once and not knowing which one worked.
- Declaring victory after one good day instead of a full cycle.
- Copying a tactic that worked for a different audience or placement.

### Quick checklist

- Diagnose by segment before changing anything.
- Write the hypothesis down in one paragraph.
- Change one lever at a time.
- Decide the test length and the win condition in advance.
- Measure before and after with identical definitions.
- Roll out winners, revert losers, and record what you learned.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Design a fair comparison with the [QR A/B test planner](/qr-a-b-test-planner), including sample size and decision rules.
- Review placement, height, and lighting in the [QR placement guide](/qr-placement-guide) before moving any code.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- When many codes share one campaign, the [bulk generator](/bulk-generator) keeps tagging and formats consistent.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is the fastest way to improve location mix?',
        answer:
          'Start by finding the biggest leak or the weakest segment, then fix that one thing. Small, targeted fixes beat broad redesigns because they are cheaper to test and easier to attribute. Measure before and after with the same definition so you can tell whether the fix worked.',
      },
      {
        question: 'Should I change several things at once to improve location mix?',
        answer:
          'Usually not, because simultaneous changes make it impossible to know which one mattered. Change one variable at a time, or run a controlled test with clean variants. The exception is a broken experience, where fixing the obvious faults together is better than testing them one by one.',
      },
      {
        question: 'How long before I see improvement in location mix?',
        answer:
          'Allow at least one full cycle of your audience, such as a full week for a store or a full month for a monthly offer. Early movement is often noise, and cutting a change short wastes the effort. Decide the review date before you start, and judge the result only then.',
      },
    ]
  ),
  art(
    'qr-location-mix-benchmarks-explained',
    'QR Location Mix Benchmarks Explained',
    'qr location mix benchmarks explained',
    'What location mix benchmarks can and cannot tell you, why they vary, and how to build your own baseline instead of copying a published number.',
    'Business & Regional',
    '7 min read',
    '2027-11-05',
    `
### What benchmarks can and cannot do

Location mix is the breakdown of scans by where each code is placed. It shows which rooms, shelves, streets, or pages earn their keep and which placements are decoration.

Benchmarks for location mix are tempting because they promise a shortcut: one number that tells you whether you are doing well. In practice, a benchmark is only as useful as its definition, and definitions vary widely. One source may count every scan, another may count only unique scanners, and a third may measure a different placement type entirely. Two benchmarks that disagree are not a puzzle to solve; they are a signal that the underlying measurements differ. Treat any benchmark as a rough reference, never as a verdict.

### Why benchmarks for location mix vary

Benchmarks vary for reasons that have nothing to do with quality. Placement changes everything: a code at a checkout behaves differently from a code on a poster. Audience matters too: existing customers scan for different reasons than strangers do. Offer strength, season, device mix, and time of day all shift the number. Even the definition shifts it: changing the denominator or the time window changes the result without changing the campaign at all. A quiet location can still be valuable if its scanners convert at a much higher rate, so read location mix beside conversion rate.

This variation is why copying a published benchmark as a target is risky. You may be comparing your menu code against someone else's checkout code, or your first month against their twelfth. The gap you see may be a measurement gap, not a performance gap, and chasing it can lead you to fix things that were never broken.

### How to build your own baseline

Your own baseline is the benchmark that matters most, because it shares your definition, your placements, and your audience. Build it in four steps. First, write down the definition: Location share = scans from one location divided by total scans, multiplied by 100. Second, measure it for a fixed period on a stable placement and record the raw counts, the date range, and the method. Third, repeat the measurement for two or three more comparable periods. Fourth, use the range you observed as your baseline, not a single point, because a range respects normal variation.

Illustrative example numbers, not real-world data: 180 of 400 scans came from the front entrance, giving 180 / 400 x 100 = 45% for that location. The remaining scans split across three other spots, which makes the entrance the clear winner in this example.

Once the baseline exists, judge new results against it. A result inside the baseline range is normal variation. A result outside the range for two consecutive periods is a signal worth investigating. This approach is slower than copying a published number, but it is honest, and it improves as your own history grows.

### Comparing fairly

When you do compare against an external figure, check four things: the definition, the placement type, the audience, and the period. If any of them differ materially, adjust your expectations or skip the comparison. Compare like with like, and note the differences in writing so the next person who reads the comparison understands its limits. Also remember that benchmarks describe a group, not a promise: being below a benchmark does not prove failure, and being above it does not prove excellence.

### Putting this into practice

Pick one placement and build a baseline for location mix over the next four comparable periods. Record the definition, the raw counts, and the method alongside every reading. At the end of the four periods, write down the baseline range and the one improvement you will test next. From then on, every new reading gets judged against your own baseline first and against external figures only as a secondary check.

### Common mistakes to avoid

- Using one shared link for every location and then guessing which worked.
- Judging a location after a few days instead of a full trading cycle.
- Treating a published benchmark as a target without checking its definition.
- Comparing placements with different audiences and calling the gap a performance gap.
- Freezing a baseline forever instead of updating it each quarter.

### Quick checklist

- Write the definition down before comparing anything.
- Build your own baseline from three or more comparable periods.
- Use a range, not a single point, as the baseline.
- Check definition, placement, audience, and period before using an external figure.
- Update the baseline each quarter.
- Judge two consecutive out-of-range readings as a signal, not one.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Plan goals, placements, quantities, and QA with the [QR campaign planner](/qr-campaign-planner) before the first print run.
- Keep a simple record of your own observations with the [QR scan log](/qr-scan-log) so field notes are not lost.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Review placement, height, and lighting in the [QR placement guide](/qr-placement-guide) before moving any code.
- Check proofs under real conditions with the [printed QR tester](/printed-qr-tester) before a full run.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is a good location mix for my campaign?',
        answer:
          'The honest answer is that it depends on your placement, audience, offer, and definition, so a single published number cannot set your target. Your own past performance on a comparable placement is the most useful reference. Use external figures only as a rough sanity check, never as a promise.',
      },
      {
        question: 'Why do published benchmarks for location mix disagree?',
        answer:
          'They disagree because they measure different things: different placements, audiences, definitions, and time windows. One source may count all scans while another counts only unique scanners, which produces very different numbers. Always check the definition behind a benchmark before comparing your numbers with it.',
      },
      {
        question: 'How do I build my own baseline for location mix?',
        answer:
          'Pick one definition, measure it for a fixed period on a stable placement, and record the result with its date range and method. Repeat the measurement for two or three more periods, then use the range you observed as your baseline. Update it each quarter so it reflects your current audience rather than an old one.',
      },
    ]
  ),
  art(
    'qr-location-mix-mistakes-to-avoid',
    'QR Location Mix Mistakes to Avoid',
    'qr location mix mistakes to avoid',
    'The most common location mix mistakes in QR campaigns, why each one distorts decisions, and how to fix each one.',
    'Business & Regional',
    '5 min read',
    '2027-11-06',
    `
### Why location mix mistakes are expensive

Location mix is the breakdown of scans by where each code is placed. It shows which rooms, shelves, streets, or pages earn their keep and which placements are decoration.

Mistakes in measuring or managing location mix are expensive because they corrupt decisions. A wrong number does not just sit in a report; it moves budget, kills working placements, and rewards failing ones. A quiet location can still be valuable if its scanners convert at a much higher rate, so read location mix beside conversion rate. The good news is that most mistakes are repeatable and preventable. They come from a short list of causes, and a short checklist catches nearly all of them.

### Mistake 1: Measuring with an unstable definition

The single most damaging mistake is changing the definition mid-campaign. Counting unique scanners one month and all scans the next makes the trend meaningless, even though both numbers are called location mix. Fix it by writing the definition down: Location share = scans from one location divided by total scans, multiplied by 100. Keep that definition stable, and if you must change it, note the change in the report and restart the trend from that point rather than pretending the old and new numbers are comparable.

### Mistake 2: Comparing unlike placements

A code at a checkout, a code on a poster, and a code in an email serve different moments and different intents. Comparing their location mix as if they were equal leads to confident, wrong conclusions, such as killing a placement that was actually performing well for its context. Fix it by segmenting before judging: compare each placement against its own past, and only compare across placements when audience and context are genuinely similar.

### Mistake 3: Ignoring the denominator

People remember the numerator and forget the denominator. Scans rose, so the campaign improved, or so the story goes, until someone notices exposures rose faster and location mix actually fell. Fix it by always reporting both sides of the ratio and the raw counts behind them. A percentage without its counts is a claim without evidence.

### Mistake 4: Reacting to noise

Daily numbers swing for reasons that have nothing to do with quality: weather, weekdays, holidays, and one large group passing a poster. Reacting to a single day means changing working placements on the basis of noise. Fix it by deciding the review cadence in advance, using comparable periods, and requiring two consecutive out-of-range readings before acting.

### Mistake 5: Blaming the code for a downstream problem

Using one shared link for every location and then guessing which worked. and Judging a location after a few days instead of a full trading cycle. both appear in reports that blame the QR code for problems elsewhere in the journey. Before redesigning the code, check the steps around it: placement, lighting, landing page, form, and offer. The code is often the most visible part of the journey and the least guilty.

### Putting this into practice

Audit your current location mix reporting against the five mistakes above. For each one, write down whether it applies to your reports and the one fix you will make this week. Then re-issue the last report with the fixes applied: stable definition, segmented comparisons, both sides of the ratio, a sensible review cadence, and a check of the surrounding steps. The corrected report may tell a different story, and that different story is the point.

### Common mistakes to avoid

- Using one shared link for every location and then guessing which worked.
- Judging a location after a few days instead of a full trading cycle.
- Changing the definition mid-campaign without noting it.
- Judging a placement against an unlike placement.
- Reacting to one day of data instead of a full comparable period.

### Quick checklist

- Write the definition down and keep it stable.
- Segment by store, floor, shelf, poster position, and city before judging.
- Report both sides of the ratio and the raw counts.
- Use comparable periods and a fixed review cadence.
- Check the steps around the code before blaming the code.
- Note any method change alongside the numbers it affects.

### Related tools and guides

- Design a fair comparison with the [QR A/B test planner](/qr-a-b-test-planner), including sample size and decision rules.
- Check a whole batch of destinations at once with the [QR batch validator](/qr-batch-validator) before printing.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Run unfamiliar destinations through the [QR safety checker](/qr-safety-checker) before sharing a code widely.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is the most common mistake with location mix?',
        answer:
          'The most common mistake is comparing numbers that were built from different definitions, periods, or placements. The result looks like a trend but is really a measurement change. Write the definition down, keep it stable, and note any change in method alongside the numbers.',
      },
      {
        question: 'How do I know if my location mix numbers are wrong?',
        answer:
          'Look for signs that do not fit: sudden jumps with no campaign change, totals that do not reconcile with another tool, or a metric that contradicts every related metric. Recompute one period by hand from raw counts to check the pipeline. If the hand calculation disagrees, trust the hand calculation and fix the pipeline.',
      },
      {
        question: 'Can I fix historical location mix data?',
        answer:
          'Sometimes you can, if the raw counts still exist and only the formula was wrong. If the raw data is missing or the tagging was broken, the honest move is to mark the period as unreliable and start clean measurement from now. Reconstructed history built on guesses will mislead the next decision.',
      },
    ]
  ),
  art(
    'how-to-measure-qr-campaign-roi',
    'How to Measure QR Campaign Roi',
    'how to measure qr campaign roi',
    'Learn how to measure campaign ROI for QR campaigns, including the formula, the data you need, and a worked example with clearly labelled illustrative numbers.',
    'Business & Regional',
    '6 min read',
    '2027-11-06',
    `
### What campaign ROI tells you

Campaign ROI compares the value a QR campaign produces against what it cost. It is the number that decides whether a campaign deserves more budget, a redesign, or retirement.

ROI hides timing. A campaign can look weak in week one and strong by week six, so judge it over its full life.

### How to compute campaign ROI

ROI = revenue minus cost, divided by cost, multiplied by 100. A result of 0% means the campaign broke even. A result of 100% means it returned twice what it cost.

Illustrative example numbers, not real-world data: revenue of 5,000 currency units minus a cost of 2,000 gives 3,000, and 3,000 / 2,000 x 100 = 150% ROI. If revenue falls to 2,000 with the same cost, ROI becomes 0% and the campaign only broke even.

### How to collect the data

Track revenue that came through the QR destination, subtract the full campaign cost including design, print, placement, and tracking, and use the same date range for both sides.

Keep the raw counts, not just the final percentage. Raw counts let you recompute the metric if you later fix the definition, and they make it possible to spot a denominator problem, such as a week where exposures were estimated instead of counted. Store the counts in one place with the date range, the placements included, and the name of the person who pulled them. That small discipline turns a spreadsheet into an audit trail.

### Reading the result

Never judge campaign ROI as a single number. Break it down by placement, offer, and campaign month. A campaign that looks average overall may be strong in one segment and weak in another, and the fix is completely different in each case. Compare the same placement against its own past, and compare different placements only when their audiences and contexts are genuinely similar. A short trend over four or more comparable periods is worth far more than a single snapshot, because it separates a real shift from weekly noise.

Also check the relationship between campaign ROI and the metrics around it. If scans rise while conversions fall, the new scanners may be less interested visitors, or the landing page may have changed. If cost rises while campaign ROI stays flat, you are paying more for the same outcome. Metrics make sense in groups, not in isolation, and the habit of reading two or three together prevents most misreadings.

### Putting this into practice

Start with one code and one placement. Define campaign ROI in one sentence, collect the two numbers it needs for two full weeks, and compute the result by hand once so you trust the pipeline. Then set up the same measurement for your other placements, using identical definitions and identical date ranges. When the numbers arrive, write down the one action they suggest, the owner of that action, and the date you will recheck. Measurement without a decision attached is bookkeeping, and bookkeeping does not improve campaigns.

### Common mistakes to avoid

- Crediting revenue to the QR code that a different channel actually produced.
- Leaving staff time, design, and tracking costs out of the total.
- Judging a result after two days and changing a working placement.
- Comparing placements with different audiences as if they were equal.
- Reporting a percentage without the raw counts behind it.

### Quick checklist

- Define campaign ROI in one sentence and keep the definition stable.
- Collect both sides of the ratio for the same period and placements.
- Segment by placement, offer, and campaign month.
- Compare against your own past before judging the number.
- Record the raw counts, date range, and method with every reading.
- Attach one decision, one owner, and one recheck date to each report.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Plan goals, placements, quantities, and QA with the [QR campaign planner](/qr-campaign-planner) before the first print run.
- Tag every destination consistently with the [UTM builder](/utm-builder) so each scan can be traced to its placement.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- Check proofs under real conditions with the [printed QR tester](/printed-qr-tester) before a full run.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What data do I need to measure campaign ROI?',
        answer:
          'You need both sides of the ratio: the count of the event, such as scans, and the base it is measured against, such as exposures. Without the base, the count cannot be compared across placements or periods. Record the date range and the exact definition you used, so a later reading is comparable.',
      },
      {
        question: 'How often should I check campaign ROI?',
        answer:
          'Check it on a fixed cadence that matches the campaign, such as weekly for active campaigns and monthly for always-on codes. More frequent checks help during a launch, when problems are cheapest to fix. Avoid reacting to a single day of data, since daily numbers swing for reasons that have nothing to do with quality.',
      },
      {
        question: 'Why does campaign ROI look different across placements?',
        answer:
          'Placements differ in audience, dwell time, lighting, and intent, so the same code can perform very differently in two spots. Segment the numbers by placement before judging them. A placement that looks weak in aggregate may be strong once you compare it only with similar placements.',
      },
    ]
  ),
  art(
    'how-to-improve-qr-campaign-roi',
    'How to Improve QR Campaign Roi',
    'how to improve qr campaign roi',
    'Practical ways to improve campaign ROI for QR campaigns, starting with diagnosis, then tested changes that lift results without guessing.',
    'Business & Regional',
    '7 min read',
    '2027-11-06',
    `
### Why improving campaign ROI is worth the effort

Campaign ROI compares the value a QR campaign produces against what it cost. It is the number that decides whether a campaign deserves more budget, a redesign, or retirement.

ROI hides timing. A campaign can look weak in week one and strong by week six, so judge it over its full life.

### Diagnose before you change anything

Improvement starts with diagnosis, not with redesign. Before changing a code, split campaign ROI by placement, offer, and campaign month and look for the weakest segment. The weakest segment is where a fix buys the most, because it holds the largest pool of lost value. Also check the steps around campaign ROI: a problem upstream, such as poor placement, can masquerade as a problem with the code itself, and a problem downstream, such as a slow landing page, can waste scans that were earned fairly. Fix the constraint, not the symptom.

Write down your diagnosis in one paragraph before you touch anything. State what you observed, which segment is weakest, and what you believe is causing it. This paragraph is your hypothesis, and it keeps the work honest: if the fix does not move the number, the hypothesis was wrong, and you learn something instead of merely changing things.

### Levers that move campaign ROI

- Cut spending on placements with low conversion before adding new ones.
- Improve the landing page, since conversion gains raise ROI without new print costs.
- Renegotiate placement fees using measured returns as evidence.

Work through the levers in order of expected impact per unit of effort. A lever that costs nothing and affects every scanner beats a lever that costs a print run and affects one placement. For each lever, state the change, the cost, and the segment it should move, then implement only that change. Bundling several changes together feels productive, but it destroys your ability to learn which one worked.

### Test the change properly

ROI = revenue minus cost, divided by cost, multiplied by 100. A result of 0% means the campaign broke even. A result of 100% means it returned twice what it cost.

Illustrative example numbers, not real-world data: revenue of 5,000 currency units minus a cost of 2,000 gives 3,000, and 3,000 / 2,000 x 100 = 150% ROI. If revenue falls to 2,000 with the same cost, ROI becomes 0% and the campaign only broke even.

Run the change as a comparison wherever you can: the old version against the new version, on comparable placements, over the same kind of period. Keep everything else stable, and decide in advance how long the test runs and what counts as a win. A test that ends the moment one variant pulls ahead is not a test, it is a reaction. If traffic is too small for a formal test, change one thing, record the before and after numbers, and treat the result as suggestive rather than proven.

### Putting this into practice

Pick one placement and one lever. Apply the change, leave it alone for a full cycle, and measure campaign ROI with the same definition you used before. If the number improves, roll the change out to similar placements. If it does not, revert it and test the next lever. This loop, repeated steadily, improves campaigns faster than occasional large redesigns, because every cycle teaches you something about your own audience.

### Common mistakes to avoid

- Crediting revenue to the QR code that a different channel actually produced.
- Leaving staff time, design, and tracking costs out of the total.
- Changing several things at once and not knowing which one worked.
- Declaring victory after one good day instead of a full cycle.
- Copying a tactic that worked for a different audience or placement.

### Quick checklist

- Diagnose by segment before changing anything.
- Write the hypothesis down in one paragraph.
- Change one lever at a time.
- Decide the test length and the win condition in advance.
- Measure before and after with identical definitions.
- Roll out winners, revert losers, and record what you learned.

### Related tools and guides

- Model the numbers before you commit with the [QR analytics simulator](/qr-analytics-simulator), which shows every formula behind the projection.
- Design a fair comparison with the [QR A/B test planner](/qr-a-b-test-planner), including sample size and decision rules.
- Review placement, height, and lighting in the [QR placement guide](/qr-placement-guide) before moving any code.
- Match printed size to viewing distance with the [QR size calculator](/qr-size-calculator) before you approve artwork.
- When many codes share one campaign, the [bulk generator](/bulk-generator) keeps tagging and formats consistent.
- Test every code in the real location with the [QR scanner](/qr-scanner) on more than one phone.
- The [blog](/blog) collects more guides on sizing, printing, security, and measurement for QR codes.
`,
    [
      {
        question: 'What is the fastest way to improve campaign ROI?',
        answer:
          'Start by finding the biggest leak or the weakest segment, then fix that one thing. Small, targeted fixes beat broad redesigns because they are cheaper to test and easier to attribute. Measure before and after with the same definition so you can tell whether the fix worked.',
      },
      {
        question: 'Should I change several things at once to improve campaign ROI?',
        answer:
          'Usually not, because simultaneous changes make it impossible to know which one mattered. Change one variable at a time, or run a controlled test with clean variants. The exception is a broken experience, where fixing the obvious faults together is better than testing them one by one.',
      },
      {
        question: 'How long before I see improvement in campaign ROI?',
        answer:
          'Allow at least one full cycle of your audience, such as a full week for a store or a full month for a monthly offer. Early movement is often noise, and cutting a change short wastes the effort. Decide the review date before you start, and judge the result only then.',
      },
    ]
  ),
];
