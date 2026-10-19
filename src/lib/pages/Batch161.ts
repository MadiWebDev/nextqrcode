import type { Article } from '../articles';
import { art } from './helper';

export const batch161: Article[] = [
  art(
    'qr-cost-per-scan-benchmarks-explained',
    'QR Cost Per Scan Benchmarks Explained',
    'qr cost per scan benchmarks explained',
    'What cost per scan benchmarks can and cannot tell you, why they vary, and how to build your own baseline instead of copying a published number.',
    'Business & Regional',
    '6 min read',
    '2027-10-31',
    `
### What benchmarks can and cannot do

Cost per scan spreads the full cost of a QR placement across the scans it produces. It turns a vague sense that print is expensive into a number you can compare across placements and campaigns.

Benchmarks for cost per scan are tempting because they promise a shortcut: one number that tells you whether you are doing well. In practice, a benchmark is only as useful as its definition, and definitions vary widely. One source may count every scan, another may count only unique scanners, and a third may measure a different placement type entirely. Two benchmarks that disagree are not a puzzle to solve; they are a signal that the underlying measurements differ. Treat any benchmark as a rough reference, never as a verdict.

### Why benchmarks for cost per scan vary

Benchmarks vary for reasons that have nothing to do with quality. Placement changes everything: a code at a checkout behaves differently from a code on a poster. Audience matters too: existing customers scan for different reasons than strangers do. Offer strength, season, device mix, and time of day all shift the number. Even the definition shifts it: changing the denominator or the time window changes the result without changing the campaign at all. Cost per scan is a cost-efficiency number, not a profit number. Pair it with conversion value before judging a placement.

This variation is why copying a published benchmark as a target is risky. You may be comparing your menu code against someone else's checkout code, or your first month against their twelfth. The gap you see may be a measurement gap, not a performance gap, and chasing it can lead you to fix things that were never broken.

### How to build your own baseline

Your own baseline is the benchmark that matters most, because it shares your definition, your placements, and your audience. Build it in four steps. First, write down the definition: Cost per scan = total campaign cost divided by total scans. Second, measure it for a fixed period on a stable placement and record the raw counts, the date range, and the method. Third, repeat the measurement for two or three more comparable periods. Fourth, use the range you observed as your baseline, not a single point, because a range respects normal variation.

Illustrative example numbers, not real-world data: a total cost of 1,200 currency units divided by 400 scans gives 3.00 per scan. If the same placement produces 800 scans next month at the same cost, cost per scan falls to 1.50.

Once the baseline exists, judge new results against it. A result inside the baseline range is normal variation. A result outside the range for two consecutive periods is a signal worth investigating. This approach is slower than copying a published number, but it is honest, and it improves as your own history grows.

### Comparing fairly

When you do compare against an external figure, check four things: the definition, the placement type, the audience, and the period. If any of them differ materially, adjust your expectations or skip the comparison. Compare like with like, and note the differences in writing so the next person who reads the comparison understands its limits. Also remember that benchmarks describe a group, not a promise: being below a benchmark does not prove failure, and being above it does not prove excellence.

### Putting this into practice

Pick one placement and build a baseline for cost per scan over the next four comparable periods. Record the definition, the raw counts, and the method alongside every reading. At the end of the four periods, write down the baseline range and the one improvement you will test next. From then on, every new reading gets judged against your own baseline first and against external figures only as a secondary check.

### Common mistakes to avoid

- Counting only printing cost and ignoring design, placement, and tracking.
- Comparing one month of cost against a different month of scans.
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
        question: 'What is a good cost per scan for my campaign?',
        answer:
          'The honest answer is that it depends on your placement, audience, offer, and definition, so a single published number cannot set your target. Your own past performance on a comparable placement is the most useful reference. Use external figures only as a rough sanity check, never as a promise.',
      },
      {
        question: 'Why do published benchmarks for cost per scan disagree?',
        answer:
          'They disagree because they measure different things: different placements, audiences, definitions, and time windows. One source may count all scans while another counts only unique scanners, which produces very different numbers. Always check the definition behind a benchmark before comparing your numbers with it.',
      },
      {
        question: 'How do I build my own baseline for cost per scan?',
        answer:
          'Pick one definition, measure it for a fixed period on a stable placement, and record the result with its date range and method. Repeat the measurement for two or three more periods, then use the range you observed as your baseline. Update it each quarter so it reflects your current audience rather than an old one.',
      },
    ]
  ),
  art(
    'qr-cost-per-scan-mistakes-to-avoid',
    'QR Cost Per Scan Mistakes to Avoid',
    'qr cost per scan mistakes to avoid',
    'The most common cost per scan mistakes in QR campaigns, why each one distorts decisions, and how to fix each one.',
    'Business & Regional',
    '7 min read',
    '2027-10-31',
    `
### Why cost per scan mistakes are expensive

Cost per scan spreads the full cost of a QR placement across the scans it produces. It turns a vague sense that print is expensive into a number you can compare across placements and campaigns.

Mistakes in measuring or managing cost per scan are expensive because they corrupt decisions. A wrong number does not just sit in a report; it moves budget, kills working placements, and rewards failing ones. Cost per scan is a cost-efficiency number, not a profit number. Pair it with conversion value before judging a placement. The good news is that most mistakes are repeatable and preventable. They come from a short list of causes, and a short checklist catches nearly all of them.

### Mistake 1: Measuring with an unstable definition

The single most damaging mistake is changing the definition mid-campaign. Counting unique scanners one month and all scans the next makes the trend meaningless, even though both numbers are called cost per scan. Fix it by writing the definition down: Cost per scan = total campaign cost divided by total scans. Keep that definition stable, and if you must change it, note the change in the report and restart the trend from that point rather than pretending the old and new numbers are comparable.

### Mistake 2: Comparing unlike placements

A code at a checkout, a code on a poster, and a code in an email serve different moments and different intents. Comparing their cost per scan as if they were equal leads to confident, wrong conclusions, such as killing a placement that was actually performing well for its context. Fix it by segmenting before judging: compare each placement against its own past, and only compare across placements when audience and context are genuinely similar.

### Mistake 3: Ignoring the denominator

People remember the numerator and forget the denominator. Scans rose, so the campaign improved, or so the story goes, until someone notices exposures rose faster and cost per scan actually fell. Fix it by always reporting both sides of the ratio and the raw counts behind them. A percentage without its counts is a claim without evidence.

### Mistake 4: Reacting to noise

Daily numbers swing for reasons that have nothing to do with quality: weather, weekdays, holidays, and one large group passing a poster. Reacting to a single day means changing working placements on the basis of noise. Fix it by deciding the review cadence in advance, using comparable periods, and requiring two consecutive out-of-range readings before acting.

### Mistake 5: Blaming the code for a downstream problem

Counting only printing cost and ignoring design, placement, and tracking. and Comparing one month of cost against a different month of scans. both appear in reports that blame the QR code for problems elsewhere in the journey. Before redesigning the code, check the steps around it: placement, lighting, landing page, form, and offer. The code is often the most visible part of the journey and the least guilty.

### Putting this into practice

Audit your current cost per scan reporting against the five mistakes above. For each one, write down whether it applies to your reports and the one fix you will make this week. Then re-issue the last report with the fixes applied: stable definition, segmented comparisons, both sides of the ratio, a sensible review cadence, and a check of the surrounding steps. The corrected report may tell a different story, and that different story is the point.

### Common mistakes to avoid

- Counting only printing cost and ignoring design, placement, and tracking.
- Comparing one month of cost against a different month of scans.
- Changing the definition mid-campaign without noting it.
- Judging a placement against an unlike placement.
- Reacting to one day of data instead of a full comparable period.

### Quick checklist

- Write the definition down and keep it stable.
- Segment by placement type, print run, and campaign month before judging.
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
        question: 'What is the most common mistake with cost per scan?',
        answer:
          'The most common mistake is comparing numbers that were built from different definitions, periods, or placements. The result looks like a trend but is really a measurement change. Write the definition down, keep it stable, and note any change in method alongside the numbers.',
      },
      {
        question: 'How do I know if my cost per scan numbers are wrong?',
        answer:
          'Look for signs that do not fit: sudden jumps with no campaign change, totals that do not reconcile with another tool, or a metric that contradicts every related metric. Recompute one period by hand from raw counts to check the pipeline. If the hand calculation disagrees, trust the hand calculation and fix the pipeline.',
      },
      {
        question: 'Can I fix historical cost per scan data?',
        answer:
          'Sometimes you can, if the raw counts still exist and only the formula was wrong. If the raw data is missing or the tagging was broken, the honest move is to mark the period as unreliable and start clean measurement from now. Reconstructed history built on guesses will mislead the next decision.',
      },
    ]
  ),
  art(
    'how-to-measure-qr-unique-vs-repeat-scans',
    'How to Measure QR Unique Vs Repeat Scans',
    'how to measure qr unique vs repeat scans',
    'Learn how to measure unique versus repeat scans for QR campaigns, including the formula, the data you need, and a worked example with clearly labelled illustrative numbers.',
    'Business & Regional',
    '5 min read',
    '2027-11-01',
    `
### What unique versus repeat scans tells you

Unique versus repeat scans split your scan total into first-time scanners and people who have scanned before. The split tells you whether a code is still reaching new people or mainly serving returning visitors.

Neither a high unique share nor a high repeat share is good on its own. The right mix depends on whether the code exists to acquire, serve, or retain.

### How to compute unique versus repeat scans

Unique share = unique scanners divided by total scans, multiplied by 100. Repeat share = 100 minus unique share.

Illustrative example numbers, not real-world data: 300 unique scanners out of 400 total scans gives 300 / 400 x 100 = 75% unique and 25% repeat. A loyalty code would reasonably show the opposite pattern, with repeat scans in the majority.

### How to collect the data

Use a redirect or analytics tool that distinguishes devices or sessions, and decide in advance what counts as a repeat, such as a second scan within 30 days.

Keep the raw counts, not just the final percentage. Raw counts let you recompute the metric if you later fix the definition, and they make it possible to spot a denominator problem, such as a week where exposures were estimated instead of counted. Store the counts in one place with the date range, the placements included, and the name of the person who pulled them. That small discipline turns a spreadsheet into an audit trail.

### Reading the result

Never judge unique versus repeat scans as a single number. Break it down by placement, offer type, and time since launch. A campaign that looks average overall may be strong in one segment and weak in another, and the fix is completely different in each case. Compare the same placement against its own past, and compare different placements only when their audiences and contexts are genuinely similar. A short trend over four or more comparable periods is worth far more than a single snapshot, because it separates a real shift from weekly noise.

Also check the relationship between unique versus repeat scans and the metrics around it. If scans rise while conversions fall, the new scanners may be less interested visitors, or the landing page may have changed. If cost rises while unique versus repeat scans stays flat, you are paying more for the same outcome. Metrics make sense in groups, not in isolation, and the habit of reading two or three together prevents most misreadings.

### Putting this into practice

Start with one code and one placement. Define unique versus repeat scans in one sentence, collect the two numbers it needs for two full weeks, and compute the result by hand once so you trust the pipeline. Then set up the same measurement for your other placements, using identical definitions and identical date ranges. When the numbers arrive, write down the one action they suggest, the owner of that action, and the date you will recheck. Measurement without a decision attached is bookkeeping, and bookkeeping does not improve campaigns.

### Common mistakes to avoid

- Treating every scan as a new person and overestimating reach.
- Resetting the code or link and losing the history that identifies repeats.
- Judging a result after two days and changing a working placement.
- Comparing placements with different audiences as if they were equal.
- Reporting a percentage without the raw counts behind it.

### Quick checklist

- Define unique versus repeat scans in one sentence and keep the definition stable.
- Collect both sides of the ratio for the same period and placements.
- Segment by placement, offer type, and time since launch.
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
        question: 'What data do I need to measure unique versus repeat scans?',
        answer:
          'You need both sides of the ratio: the count of the event, such as scans, and the base it is measured against, such as exposures. Without the base, the count cannot be compared across placements or periods. Record the date range and the exact definition you used, so a later reading is comparable.',
      },
      {
        question: 'How often should I check unique versus repeat scans?',
        answer:
          'Check it on a fixed cadence that matches the campaign, such as weekly for active campaigns and monthly for always-on codes. More frequent checks help during a launch, when problems are cheapest to fix. Avoid reacting to a single day of data, since daily numbers swing for reasons that have nothing to do with quality.',
      },
      {
        question: 'Why does unique versus repeat scans look different across placements?',
        answer:
          'Placements differ in audience, dwell time, lighting, and intent, so the same code can perform very differently in two spots. Segment the numbers by placement before judging them. A placement that looks weak in aggregate may be strong once you compare it only with similar placements.',
      },
    ]
  ),
  art(
    'how-to-improve-qr-unique-vs-repeat-scans',
    'How to Improve QR Unique Vs Repeat Scans',
    'how to improve qr unique vs repeat scans',
    'Practical ways to improve unique versus repeat scans for QR campaigns, starting with diagnosis, then tested changes that lift results without guessing.',
    'Business & Regional',
    '6 min read',
    '2027-11-01',
    `
### Why improving unique versus repeat scans is worth the effort

Unique versus repeat scans split your scan total into first-time scanners and people who have scanned before. The split tells you whether a code is still reaching new people or mainly serving returning visitors.

Neither a high unique share nor a high repeat share is good on its own. The right mix depends on whether the code exists to acquire, serve, or retain.

### Diagnose before you change anything

Improvement starts with diagnosis, not with redesign. Before changing a code, split unique versus repeat scans by placement, offer type, and time since launch and look for the weakest segment. The weakest segment is where a fix buys the most, because it holds the largest pool of lost value. Also check the steps around unique versus repeat scans: a problem upstream, such as poor placement, can masquerade as a problem with the code itself, and a problem downstream, such as a slow landing page, can waste scans that were earned fairly. Fix the constraint, not the symptom.

Write down your diagnosis in one paragraph before you touch anything. State what you observed, which segment is weakest, and what you believe is causing it. This paragraph is your hypothesis, and it keeps the work honest: if the fix does not move the number, the hypothesis was wrong, and you learn something instead of merely changing things.

### Levers that move unique versus repeat scans

- Give returning scanners a reason to come back, such as updated content or a new offer.
- Open new placements when unique scans flatten but repeat scans stay strong.
- Rotate creative so regulars notice the code again instead of tuning it out.

Work through the levers in order of expected impact per unit of effort. A lever that costs nothing and affects every scanner beats a lever that costs a print run and affects one placement. For each lever, state the change, the cost, and the segment it should move, then implement only that change. Bundling several changes together feels productive, but it destroys your ability to learn which one worked.

### Test the change properly

Unique share = unique scanners divided by total scans, multiplied by 100. Repeat share = 100 minus unique share.

Illustrative example numbers, not real-world data: 300 unique scanners out of 400 total scans gives 300 / 400 x 100 = 75% unique and 25% repeat. A loyalty code would reasonably show the opposite pattern, with repeat scans in the majority.

Run the change as a comparison wherever you can: the old version against the new version, on comparable placements, over the same kind of period. Keep everything else stable, and decide in advance how long the test runs and what counts as a win. A test that ends the moment one variant pulls ahead is not a test, it is a reaction. If traffic is too small for a formal test, change one thing, record the before and after numbers, and treat the result as suggestive rather than proven.

### Putting this into practice

Pick one placement and one lever. Apply the change, leave it alone for a full cycle, and measure unique versus repeat scans with the same definition you used before. If the number improves, roll the change out to similar placements. If it does not, revert it and test the next lever. This loop, repeated steadily, improves campaigns faster than occasional large redesigns, because every cycle teaches you something about your own audience.

### Common mistakes to avoid

- Treating every scan as a new person and overestimating reach.
- Resetting the code or link and losing the history that identifies repeats.
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
        question: 'What is the fastest way to improve unique versus repeat scans?',
        answer:
          'Start by finding the biggest leak or the weakest segment, then fix that one thing. Small, targeted fixes beat broad redesigns because they are cheaper to test and easier to attribute. Measure before and after with the same definition so you can tell whether the fix worked.',
      },
      {
        question: 'Should I change several things at once to improve unique versus repeat scans?',
        answer:
          'Usually not, because simultaneous changes make it impossible to know which one mattered. Change one variable at a time, or run a controlled test with clean variants. The exception is a broken experience, where fixing the obvious faults together is better than testing them one by one.',
      },
      {
        question: 'How long before I see improvement in unique versus repeat scans?',
        answer:
          'Allow at least one full cycle of your audience, such as a full week for a store or a full month for a monthly offer. Early movement is often noise, and cutting a change short wastes the effort. Decide the review date before you start, and judge the result only then.',
      },
    ]
  ),
  art(
    'qr-unique-vs-repeat-scans-benchmarks-explained',
    'QR Unique Vs Repeat Scans Benchmarks Explained',
    'qr unique vs repeat scans benchmarks explained',
    'What unique versus repeat scans benchmarks can and cannot tell you, why they vary, and how to build your own baseline instead of copying a published number.',
    'Business & Regional',
    '7 min read',
    '2027-11-01',
    `
### What benchmarks can and cannot do

Unique versus repeat scans split your scan total into first-time scanners and people who have scanned before. The split tells you whether a code is still reaching new people or mainly serving returning visitors.

Benchmarks for unique versus repeat scans are tempting because they promise a shortcut: one number that tells you whether you are doing well. In practice, a benchmark is only as useful as its definition, and definitions vary widely. One source may count every scan, another may count only unique scanners, and a third may measure a different placement type entirely. Two benchmarks that disagree are not a puzzle to solve; they are a signal that the underlying measurements differ. Treat any benchmark as a rough reference, never as a verdict.

### Why benchmarks for unique versus repeat scans vary

Benchmarks vary for reasons that have nothing to do with quality. Placement changes everything: a code at a checkout behaves differently from a code on a poster. Audience matters too: existing customers scan for different reasons than strangers do. Offer strength, season, device mix, and time of day all shift the number. Even the definition shifts it: changing the denominator or the time window changes the result without changing the campaign at all. Neither a high unique share nor a high repeat share is good on its own. The right mix depends on whether the code exists to acquire, serve, or retain.

This variation is why copying a published benchmark as a target is risky. You may be comparing your menu code against someone else's checkout code, or your first month against their twelfth. The gap you see may be a measurement gap, not a performance gap, and chasing it can lead you to fix things that were never broken.

### How to build your own baseline

Your own baseline is the benchmark that matters most, because it shares your definition, your placements, and your audience. Build it in four steps. First, write down the definition: Unique share = unique scanners divided by total scans, multiplied by 100. Repeat share = 100 minus unique share. Second, measure it for a fixed period on a stable placement and record the raw counts, the date range, and the method. Third, repeat the measurement for two or three more comparable periods. Fourth, use the range you observed as your baseline, not a single point, because a range respects normal variation.

Illustrative example numbers, not real-world data: 300 unique scanners out of 400 total scans gives 300 / 400 x 100 = 75% unique and 25% repeat. A loyalty code would reasonably show the opposite pattern, with repeat scans in the majority.

Once the baseline exists, judge new results against it. A result inside the baseline range is normal variation. A result outside the range for two consecutive periods is a signal worth investigating. This approach is slower than copying a published number, but it is honest, and it improves as your own history grows.

### Comparing fairly

When you do compare against an external figure, check four things: the definition, the placement type, the audience, and the period. If any of them differ materially, adjust your expectations or skip the comparison. Compare like with like, and note the differences in writing so the next person who reads the comparison understands its limits. Also remember that benchmarks describe a group, not a promise: being below a benchmark does not prove failure, and being above it does not prove excellence.

### Putting this into practice

Pick one placement and build a baseline for unique versus repeat scans over the next four comparable periods. Record the definition, the raw counts, and the method alongside every reading. At the end of the four periods, write down the baseline range and the one improvement you will test next. From then on, every new reading gets judged against your own baseline first and against external figures only as a secondary check.

### Common mistakes to avoid

- Treating every scan as a new person and overestimating reach.
- Resetting the code or link and losing the history that identifies repeats.
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
        question: 'What is a good unique versus repeat scans for my campaign?',
        answer:
          'The honest answer is that it depends on your placement, audience, offer, and definition, so a single published number cannot set your target. Your own past performance on a comparable placement is the most useful reference. Use external figures only as a rough sanity check, never as a promise.',
      },
      {
        question: 'Why do published benchmarks for unique versus repeat scans disagree?',
        answer:
          'They disagree because they measure different things: different placements, audiences, definitions, and time windows. One source may count all scans while another counts only unique scanners, which produces very different numbers. Always check the definition behind a benchmark before comparing your numbers with it.',
      },
      {
        question: 'How do I build my own baseline for unique versus repeat scans?',
        answer:
          'Pick one definition, measure it for a fixed period on a stable placement, and record the result with its date range and method. Repeat the measurement for two or three more periods, then use the range you observed as your baseline. Update it each quarter so it reflects your current audience rather than an old one.',
      },
    ]
  ),
  art(
    'qr-unique-vs-repeat-scans-mistakes-to-avoid',
    'QR Unique Vs Repeat Scans Mistakes to Avoid',
    'qr unique vs repeat scans mistakes to avoid',
    'The most common unique versus repeat scans mistakes in QR campaigns, why each one distorts decisions, and how to fix each one.',
    'Business & Regional',
    '5 min read',
    '2027-11-02',
    `
### Why unique versus repeat scans mistakes are expensive

Unique versus repeat scans split your scan total into first-time scanners and people who have scanned before. The split tells you whether a code is still reaching new people or mainly serving returning visitors.

Mistakes in measuring or managing unique versus repeat scans are expensive because they corrupt decisions. A wrong number does not just sit in a report; it moves budget, kills working placements, and rewards failing ones. Neither a high unique share nor a high repeat share is good on its own. The right mix depends on whether the code exists to acquire, serve, or retain. The good news is that most mistakes are repeatable and preventable. They come from a short list of causes, and a short checklist catches nearly all of them.

### Mistake 1: Measuring with an unstable definition

The single most damaging mistake is changing the definition mid-campaign. Counting unique scanners one month and all scans the next makes the trend meaningless, even though both numbers are called unique versus repeat scans. Fix it by writing the definition down: Unique share = unique scanners divided by total scans, multiplied by 100. Repeat share = 100 minus unique share. Keep that definition stable, and if you must change it, note the change in the report and restart the trend from that point rather than pretending the old and new numbers are comparable.

### Mistake 2: Comparing unlike placements

A code at a checkout, a code on a poster, and a code in an email serve different moments and different intents. Comparing their unique versus repeat scans as if they were equal leads to confident, wrong conclusions, such as killing a placement that was actually performing well for its context. Fix it by segmenting before judging: compare each placement against its own past, and only compare across placements when audience and context are genuinely similar.

### Mistake 3: Ignoring the denominator

People remember the numerator and forget the denominator. Scans rose, so the campaign improved, or so the story goes, until someone notices exposures rose faster and unique versus repeat scans actually fell. Fix it by always reporting both sides of the ratio and the raw counts behind them. A percentage without its counts is a claim without evidence.

### Mistake 4: Reacting to noise

Daily numbers swing for reasons that have nothing to do with quality: weather, weekdays, holidays, and one large group passing a poster. Reacting to a single day means changing working placements on the basis of noise. Fix it by deciding the review cadence in advance, using comparable periods, and requiring two consecutive out-of-range readings before acting.

### Mistake 5: Blaming the code for a downstream problem

Treating every scan as a new person and overestimating reach. and Resetting the code or link and losing the history that identifies repeats. both appear in reports that blame the QR code for problems elsewhere in the journey. Before redesigning the code, check the steps around it: placement, lighting, landing page, form, and offer. The code is often the most visible part of the journey and the least guilty.

### Putting this into practice

Audit your current unique versus repeat scans reporting against the five mistakes above. For each one, write down whether it applies to your reports and the one fix you will make this week. Then re-issue the last report with the fixes applied: stable definition, segmented comparisons, both sides of the ratio, a sensible review cadence, and a check of the surrounding steps. The corrected report may tell a different story, and that different story is the point.

### Common mistakes to avoid

- Treating every scan as a new person and overestimating reach.
- Resetting the code or link and losing the history that identifies repeats.
- Changing the definition mid-campaign without noting it.
- Judging a placement against an unlike placement.
- Reacting to one day of data instead of a full comparable period.

### Quick checklist

- Write the definition down and keep it stable.
- Segment by placement, offer type, and time since launch before judging.
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
        question: 'What is the most common mistake with unique versus repeat scans?',
        answer:
          'The most common mistake is comparing numbers that were built from different definitions, periods, or placements. The result looks like a trend but is really a measurement change. Write the definition down, keep it stable, and note any change in method alongside the numbers.',
      },
      {
        question: 'How do I know if my unique versus repeat scans numbers are wrong?',
        answer:
          'Look for signs that do not fit: sudden jumps with no campaign change, totals that do not reconcile with another tool, or a metric that contradicts every related metric. Recompute one period by hand from raw counts to check the pipeline. If the hand calculation disagrees, trust the hand calculation and fix the pipeline.',
      },
      {
        question: 'Can I fix historical unique versus repeat scans data?',
        answer:
          'Sometimes you can, if the raw counts still exist and only the formula was wrong. If the raw data is missing or the tagging was broken, the honest move is to mark the period as unreliable and start clean measurement from now. Reconstructed history built on guesses will mislead the next decision.',
      },
    ]
  ),
  art(
    'how-to-measure-qr-time-to-scan',
    'How to Measure QR Time To Scan',
    'how to measure qr time to scan',
    'Learn how to measure time to scan for QR campaigns, including the formula, the data you need, and a worked example with clearly labelled illustrative numbers.',
    'Business & Regional',
    '6 min read',
    '2027-11-02',
    `
### What time to scan tells you

Time to scan is how long it takes a person to go from noticing a QR code to completing a scan. It captures friction that raw scan counts hide, because people who give up never appear in your analytics.

If people must hunt for the code, aim their camera carefully, or retry twice, many will simply walk away.

### How to compute time to scan

Time to scan is usually reported as a median, not an average, so one very slow attempt does not distort the result. Median time to scan = the middle value when all timed attempts are sorted fastest to slowest.

Illustrative example numbers, not real-world data: in a timed test with 20 volunteers, the middle attempt took 12 seconds. After enlarging the code and improving the lighting, a repeat test showed a median of 7 seconds, which is a useful before-and-after comparison even though the numbers come from a small test.

### How to collect the data

Time volunteers with a stopwatch in the real location, or measure the gap between page-load signals if your tooling supports it. Test in the actual lighting and at the actual distance, not at a desk.

Keep the raw counts, not just the final percentage. Raw counts let you recompute the metric if you later fix the definition, and they make it possible to spot a denominator problem, such as a week where exposures were estimated instead of counted. Store the counts in one place with the date range, the placements included, and the name of the person who pulled them. That small discipline turns a spreadsheet into an audit trail.

### Reading the result

Never judge time to scan as a single number. Break it down by distance, lighting, code size, and phone type. A campaign that looks average overall may be strong in one segment and weak in another, and the fix is completely different in each case. Compare the same placement against its own past, and compare different placements only when their audiences and contexts are genuinely similar. A short trend over four or more comparable periods is worth far more than a single snapshot, because it separates a real shift from weekly noise.

Also check the relationship between time to scan and the metrics around it. If scans rise while conversions fall, the new scanners may be less interested visitors, or the landing page may have changed. If cost rises while time to scan stays flat, you are paying more for the same outcome. Metrics make sense in groups, not in isolation, and the habit of reading two or three together prevents most misreadings.

### Putting this into practice

Start with one code and one placement. Define time to scan in one sentence, collect the two numbers it needs for two full weeks, and compute the result by hand once so you trust the pipeline. Then set up the same measurement for your other placements, using identical definitions and identical date ranges. When the numbers arrive, write down the one action they suggest, the owner of that action, and the date you will recheck. Measurement without a decision attached is bookkeeping, and bookkeeping does not improve campaigns.

### Common mistakes to avoid

- Testing only with your own phone and assuming everyone scans that fast.
- Measuring at a desk under bright light instead of in the real location.
- Judging a result after two days and changing a working placement.
- Comparing placements with different audiences as if they were equal.
- Reporting a percentage without the raw counts behind it.

### Quick checklist

- Define time to scan in one sentence and keep the definition stable.
- Collect both sides of the ratio for the same period and placements.
- Segment by distance, lighting, code size, and phone type.
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
        question: 'What data do I need to measure time to scan?',
        answer:
          'You need both sides of the ratio: the count of the event, such as scans, and the base it is measured against, such as exposures. Without the base, the count cannot be compared across placements or periods. Record the date range and the exact definition you used, so a later reading is comparable.',
      },
      {
        question: 'How often should I check time to scan?',
        answer:
          'Check it on a fixed cadence that matches the campaign, such as weekly for active campaigns and monthly for always-on codes. More frequent checks help during a launch, when problems are cheapest to fix. Avoid reacting to a single day of data, since daily numbers swing for reasons that have nothing to do with quality.',
      },
      {
        question: 'Why does time to scan look different across placements?',
        answer:
          'Placements differ in audience, dwell time, lighting, and intent, so the same code can perform very differently in two spots. Segment the numbers by placement before judging them. A placement that looks weak in aggregate may be strong once you compare it only with similar placements.',
      },
    ]
  ),
  art(
    'how-to-improve-qr-time-to-scan',
    'How to Improve QR Time To Scan',
    'how to improve qr time to scan',
    'Practical ways to improve time to scan for QR campaigns, starting with diagnosis, then tested changes that lift results without guessing.',
    'Business & Regional',
    '7 min read',
    '2027-11-02',
    `
### Why improving time to scan is worth the effort

Time to scan is how long it takes a person to go from noticing a QR code to completing a scan. It captures friction that raw scan counts hide, because people who give up never appear in your analytics.

If people must hunt for the code, aim their camera carefully, or retry twice, many will simply walk away.

### Diagnose before you change anything

Improvement starts with diagnosis, not with redesign. Before changing a code, split time to scan by distance, lighting, code size, and phone type and look for the weakest segment. The weakest segment is where a fix buys the most, because it holds the largest pool of lost value. Also check the steps around time to scan: a problem upstream, such as poor placement, can masquerade as a problem with the code itself, and a problem downstream, such as a slow landing page, can waste scans that were earned fairly. Fix the constraint, not the symptom.

Write down your diagnosis in one paragraph before you touch anything. State what you observed, which segment is weakest, and what you believe is causing it. This paragraph is your hypothesis, and it keeps the work honest: if the fix does not move the number, the hypothesis was wrong, and you learn something instead of merely changing things.

### Levers that move time to scan

- Print the code larger so phones lock on faster from a normal standing distance.
- Improve contrast and lighting, and remove glare from glass or laminate.
- Place the code where people can pause for a moment instead of in a walkway.

Work through the levers in order of expected impact per unit of effort. A lever that costs nothing and affects every scanner beats a lever that costs a print run and affects one placement. For each lever, state the change, the cost, and the segment it should move, then implement only that change. Bundling several changes together feels productive, but it destroys your ability to learn which one worked.

### Test the change properly

Time to scan is usually reported as a median, not an average, so one very slow attempt does not distort the result. Median time to scan = the middle value when all timed attempts are sorted fastest to slowest.

Illustrative example numbers, not real-world data: in a timed test with 20 volunteers, the middle attempt took 12 seconds. After enlarging the code and improving the lighting, a repeat test showed a median of 7 seconds, which is a useful before-and-after comparison even though the numbers come from a small test.

Run the change as a comparison wherever you can: the old version against the new version, on comparable placements, over the same kind of period. Keep everything else stable, and decide in advance how long the test runs and what counts as a win. A test that ends the moment one variant pulls ahead is not a test, it is a reaction. If traffic is too small for a formal test, change one thing, record the before and after numbers, and treat the result as suggestive rather than proven.

### Putting this into practice

Pick one placement and one lever. Apply the change, leave it alone for a full cycle, and measure time to scan with the same definition you used before. If the number improves, roll the change out to similar placements. If it does not, revert it and test the next lever. This loop, repeated steadily, improves campaigns faster than occasional large redesigns, because every cycle teaches you something about your own audience.

### Common mistakes to avoid

- Testing only with your own phone and assuming everyone scans that fast.
- Measuring at a desk under bright light instead of in the real location.
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
        question: 'What is the fastest way to improve time to scan?',
        answer:
          'Start by finding the biggest leak or the weakest segment, then fix that one thing. Small, targeted fixes beat broad redesigns because they are cheaper to test and easier to attribute. Measure before and after with the same definition so you can tell whether the fix worked.',
      },
      {
        question: 'Should I change several things at once to improve time to scan?',
        answer:
          'Usually not, because simultaneous changes make it impossible to know which one mattered. Change one variable at a time, or run a controlled test with clean variants. The exception is a broken experience, where fixing the obvious faults together is better than testing them one by one.',
      },
      {
        question: 'How long before I see improvement in time to scan?',
        answer:
          'Allow at least one full cycle of your audience, such as a full week for a store or a full month for a monthly offer. Early movement is often noise, and cutting a change short wastes the effort. Decide the review date before you start, and judge the result only then.',
      },
    ]
  ),
  art(
    'qr-time-to-scan-benchmarks-explained',
    'QR Time To Scan Benchmarks Explained',
    'qr time to scan benchmarks explained',
    'What time to scan benchmarks can and cannot tell you, why they vary, and how to build your own baseline instead of copying a published number.',
    'Business & Regional',
    '5 min read',
    '2027-11-03',
    `
### What benchmarks can and cannot do

Time to scan is how long it takes a person to go from noticing a QR code to completing a scan. It captures friction that raw scan counts hide, because people who give up never appear in your analytics.

Benchmarks for time to scan are tempting because they promise a shortcut: one number that tells you whether you are doing well. In practice, a benchmark is only as useful as its definition, and definitions vary widely. One source may count every scan, another may count only unique scanners, and a third may measure a different placement type entirely. Two benchmarks that disagree are not a puzzle to solve; they are a signal that the underlying measurements differ. Treat any benchmark as a rough reference, never as a verdict.

### Why benchmarks for time to scan vary

Benchmarks vary for reasons that have nothing to do with quality. Placement changes everything: a code at a checkout behaves differently from a code on a poster. Audience matters too: existing customers scan for different reasons than strangers do. Offer strength, season, device mix, and time of day all shift the number. Even the definition shifts it: changing the denominator or the time window changes the result without changing the campaign at all. If people must hunt for the code, aim their camera carefully, or retry twice, many will simply walk away.

This variation is why copying a published benchmark as a target is risky. You may be comparing your menu code against someone else's checkout code, or your first month against their twelfth. The gap you see may be a measurement gap, not a performance gap, and chasing it can lead you to fix things that were never broken.

### How to build your own baseline

Your own baseline is the benchmark that matters most, because it shares your definition, your placements, and your audience. Build it in four steps. First, write down the definition: Time to scan is usually reported as a median, not an average, so one very slow attempt does not distort the result. Median time to scan = the middle value when all timed attempts are sorted fastest to slowest. Second, measure it for a fixed period on a stable placement and record the raw counts, the date range, and the method. Third, repeat the measurement for two or three more comparable periods. Fourth, use the range you observed as your baseline, not a single point, because a range respects normal variation.

Illustrative example numbers, not real-world data: in a timed test with 20 volunteers, the middle attempt took 12 seconds. After enlarging the code and improving the lighting, a repeat test showed a median of 7 seconds, which is a useful before-and-after comparison even though the numbers come from a small test.

Once the baseline exists, judge new results against it. A result inside the baseline range is normal variation. A result outside the range for two consecutive periods is a signal worth investigating. This approach is slower than copying a published number, but it is honest, and it improves as your own history grows.

### Comparing fairly

When you do compare against an external figure, check four things: the definition, the placement type, the audience, and the period. If any of them differ materially, adjust your expectations or skip the comparison. Compare like with like, and note the differences in writing so the next person who reads the comparison understands its limits. Also remember that benchmarks describe a group, not a promise: being below a benchmark does not prove failure, and being above it does not prove excellence.

### Putting this into practice

Pick one placement and build a baseline for time to scan over the next four comparable periods. Record the definition, the raw counts, and the method alongside every reading. At the end of the four periods, write down the baseline range and the one improvement you will test next. From then on, every new reading gets judged against your own baseline first and against external figures only as a secondary check.

### Common mistakes to avoid

- Testing only with your own phone and assuming everyone scans that fast.
- Measuring at a desk under bright light instead of in the real location.
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
        question: 'What is a good time to scan for my campaign?',
        answer:
          'The honest answer is that it depends on your placement, audience, offer, and definition, so a single published number cannot set your target. Your own past performance on a comparable placement is the most useful reference. Use external figures only as a rough sanity check, never as a promise.',
      },
      {
        question: 'Why do published benchmarks for time to scan disagree?',
        answer:
          'They disagree because they measure different things: different placements, audiences, definitions, and time windows. One source may count all scans while another counts only unique scanners, which produces very different numbers. Always check the definition behind a benchmark before comparing your numbers with it.',
      },
      {
        question: 'How do I build my own baseline for time to scan?',
        answer:
          'Pick one definition, measure it for a fixed period on a stable placement, and record the result with its date range and method. Repeat the measurement for two or three more periods, then use the range you observed as your baseline. Update it each quarter so it reflects your current audience rather than an old one.',
      },
    ]
  ),
  art(
    'qr-time-to-scan-mistakes-to-avoid',
    'QR Time To Scan Mistakes to Avoid',
    'qr time to scan mistakes to avoid',
    'The most common time to scan mistakes in QR campaigns, why each one distorts decisions, and how to fix each one.',
    'Business & Regional',
    '6 min read',
    '2027-11-03',
    `
### Why time to scan mistakes are expensive

Time to scan is how long it takes a person to go from noticing a QR code to completing a scan. It captures friction that raw scan counts hide, because people who give up never appear in your analytics.

Mistakes in measuring or managing time to scan are expensive because they corrupt decisions. A wrong number does not just sit in a report; it moves budget, kills working placements, and rewards failing ones. If people must hunt for the code, aim their camera carefully, or retry twice, many will simply walk away. The good news is that most mistakes are repeatable and preventable. They come from a short list of causes, and a short checklist catches nearly all of them.

### Mistake 1: Measuring with an unstable definition

The single most damaging mistake is changing the definition mid-campaign. Counting unique scanners one month and all scans the next makes the trend meaningless, even though both numbers are called time to scan. Fix it by writing the definition down: Time to scan is usually reported as a median, not an average, so one very slow attempt does not distort the result. Median time to scan = the middle value when all timed attempts are sorted fastest to slowest. Keep that definition stable, and if you must change it, note the change in the report and restart the trend from that point rather than pretending the old and new numbers are comparable.

### Mistake 2: Comparing unlike placements

A code at a checkout, a code on a poster, and a code in an email serve different moments and different intents. Comparing their time to scan as if they were equal leads to confident, wrong conclusions, such as killing a placement that was actually performing well for its context. Fix it by segmenting before judging: compare each placement against its own past, and only compare across placements when audience and context are genuinely similar.

### Mistake 3: Ignoring the denominator

People remember the numerator and forget the denominator. Scans rose, so the campaign improved, or so the story goes, until someone notices exposures rose faster and time to scan actually fell. Fix it by always reporting both sides of the ratio and the raw counts behind them. A percentage without its counts is a claim without evidence.

### Mistake 4: Reacting to noise

Daily numbers swing for reasons that have nothing to do with quality: weather, weekdays, holidays, and one large group passing a poster. Reacting to a single day means changing working placements on the basis of noise. Fix it by deciding the review cadence in advance, using comparable periods, and requiring two consecutive out-of-range readings before acting.

### Mistake 5: Blaming the code for a downstream problem

Testing only with your own phone and assuming everyone scans that fast. and Measuring at a desk under bright light instead of in the real location. both appear in reports that blame the QR code for problems elsewhere in the journey. Before redesigning the code, check the steps around it: placement, lighting, landing page, form, and offer. The code is often the most visible part of the journey and the least guilty.

### Putting this into practice

Audit your current time to scan reporting against the five mistakes above. For each one, write down whether it applies to your reports and the one fix you will make this week. Then re-issue the last report with the fixes applied: stable definition, segmented comparisons, both sides of the ratio, a sensible review cadence, and a check of the surrounding steps. The corrected report may tell a different story, and that different story is the point.

### Common mistakes to avoid

- Testing only with your own phone and assuming everyone scans that fast.
- Measuring at a desk under bright light instead of in the real location.
- Changing the definition mid-campaign without noting it.
- Judging a placement against an unlike placement.
- Reacting to one day of data instead of a full comparable period.

### Quick checklist

- Write the definition down and keep it stable.
- Segment by distance, lighting, code size, and phone type before judging.
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
        question: 'What is the most common mistake with time to scan?',
        answer:
          'The most common mistake is comparing numbers that were built from different definitions, periods, or placements. The result looks like a trend but is really a measurement change. Write the definition down, keep it stable, and note any change in method alongside the numbers.',
      },
      {
        question: 'How do I know if my time to scan numbers are wrong?',
        answer:
          'Look for signs that do not fit: sudden jumps with no campaign change, totals that do not reconcile with another tool, or a metric that contradicts every related metric. Recompute one period by hand from raw counts to check the pipeline. If the hand calculation disagrees, trust the hand calculation and fix the pipeline.',
      },
      {
        question: 'Can I fix historical time to scan data?',
        answer:
          'Sometimes you can, if the raw counts still exist and only the formula was wrong. If the raw data is missing or the tagging was broken, the honest move is to mark the period as unreliable and start clean measurement from now. Reconstructed history built on guesses will mislead the next decision.',
      },
    ]
  ),
];
