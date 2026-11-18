/**
 * Starter guide set for the Social Media Calendar (spec §28 + the
 * standing indexing-freeze rule): a small number of genuinely original,
 * differentiated guides — NOT templated programmatic pages. Expansion
 * beyond this set waits until the site's indexing freeze lifts.
 * Every guide passes scripts/check-socialcalendar-seo.mjs.
 */
export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string[];
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  related: string[];
  updatedAt: string;
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-plan-a-social-media-content-calendar',
    title: 'How to Plan a Social Media Content Calendar (Step by Step)',
    h1: 'How to Plan a Social Media Content Calendar',
    description:
      'A practical, step-by-step method to plan a month of social media content: set pillars, pick a realistic cadence, batch creation, and review what worked.',
    intro: [
      'A content calendar is not a posting schedule — it is a decision you make once so you stop making it every day. When the plan exists, the daily question changes from "what should I post?" to "is today\'s post ready?", and that single change is what makes social media sustainable for small teams.',
      'This guide walks through the exact method used by lean marketing teams: define content pillars, choose a cadence you can actually keep, plan in themes, batch the creation work, and close the loop with a monthly review. It assumes no team, no budget, and no tool loyalty — the method works on paper, in a spreadsheet, or in a dedicated planner like this one.',
    ],
    sections: [
      {
        heading: 'Step 1: Decide what the calendar is for',
        paragraphs: [
          'Before choosing a single post, write down the one or two outcomes the next 90 days of content should produce: more enquiries, more bookings, a launch, a hiring push. Every later decision — pillars, cadence, formats — is judged against those outcomes. Content that serves none of them is decoration, and decoration is the first thing to cut when time gets short.',
          'Pick one primary metric per outcome (profile visits, link clicks, replies, saves) and write it at the top of your plan. You will check it in the monthly review; until then, it simply keeps the plan honest.',
        ],
      },
      {
        heading: 'Step 2: Set three to five content pillars',
        paragraphs: [
          'Pillars are the recurring themes your account is about. A local bakery might use: baking education, behind the scenes, products and offers, and community. Pillars stop the blank-page problem because "Tuesday is education day" is a much easier brief than "post something good".',
          'Give each pillar a target share of your output — education 40%, community 25%, behind the scenes 20%, offers 15% is a healthy starting mix for most brands. Offers rarely deserve more than a fifth of the calendar; audiences follow you for the other four-fifths.',
        ],
        bullets: [
          'Fewer than 3 pillars feels repetitive; more than 5 feels scattered.',
          'Every pillar should map to a question your audience actually asks.',
          'Review the mix quarterly, not weekly — pillars are strategy, not tactics.',
        ],
      },
      {
        heading: 'Step 3: Choose a cadence you can survive',
        paragraphs: [
          'The best posting frequency is the highest one you can sustain for six months without quality collapsing. For most small teams that is three to five posts a week on one or two platforms — not daily posts on six. Consistency compounds; bursts evaporate.',
          'Anchor posts to fixed weekday slots (Monday education, Wednesday product, Friday community) so the calendar fills itself. Leave one flexible slot a week for timely content: a trend, a customer moment, a reaction to news in your niche.',
        ],
      },
      {
        heading: 'Step 4: Plan a month, in one sitting',
        paragraphs: [
          'Block 60–90 minutes at the end of each month. First, mark the fixed points: holidays, launches, events, deadlines. Second, lay recurring series into their slots. Third, assign a pillar and a working title to every remaining slot. Titles are enough — captions come later, in batches.',
          'A useful test of a finished month plan: every post has a date, a platform, a pillar and a one-line brief. If a slot lacks a brief, it will become a scramble later; either brief it now or delete the slot. An honest gap beats a guilty one.',
        ],
      },
      {
        heading: 'Step 5: Batch creation, review monthly',
        paragraphs: [
          'Create in batches: one session for all photos, one for captions, one for video. Batching is two to three times faster than making posts one at a time because you stop paying the context-switching cost between camera, writer and editor mindsets.',
          'Close the month with a 30-minute review: which three posts earned the most saves, shares or replies, and which pillar produced them? Feed that answer into next month\'s mix. Planning without this loop is just scheduling; with it, the calendar gets smarter every month.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How far ahead should I plan my content calendar?',
        a: 'One month is the sweet spot for most small teams: far enough to batch work and see the pillar mix, close enough to stay relevant. Keep a rolling list of ideas for the following month so planning day starts from material, not from zero.',
      },
      {
        q: 'How many times a week should a small business post?',
        a: 'Three to five posts a week on your main platform beats daily posting you cannot sustain. What matters most is a rhythm your audience can predict and you can keep for at least six months.',
      },
      {
        q: 'What should every calendar entry include?',
        a: 'A date and time, the platform, a working title or brief, the content pillar, and a status (idea, draft, in review, scheduled, published). Media and the final caption can be attached later, during batch creation.',
      },
      {
        q: 'Should I plan different content for each platform?',
        a: 'Plan one core idea, then adapt it per platform: the same topic becomes a carousel on Instagram, a text post on LinkedIn and a short video on TikTok. Fully separate plans per platform multiply your workload for very little gain.',
      },
      {
        q: 'What do I do when I fall behind the calendar?',
        a: 'Shrink the plan, do not abandon it. Drop to your two strongest pillars and your most reliable slot for two weeks. A smaller calendar you follow rebuilds momentum; an ambitious one you ignore just creates guilt.',
      },
      {
        q: 'Do I need a paid tool to run a content calendar?',
        a: 'No. The method matters more than the tool: paper, spreadsheets and free planners all work. A dedicated calendar tool earns its place when you need drag-and-drop planning, per-platform previews, approvals or exports — not before.',
      },
    ],
    related: ['content-pillars-strategy', 'social-media-calendar-for-small-business', 'content-calendar-vs-spreadsheet'],
    updatedAt: '2026-11-17',
  },
  {
    slug: 'content-pillars-strategy',
    title: 'Content Pillars: How to Build a Strategy That Never Runs Dry',
    h1: 'Content Pillars: A Practical Strategy Guide',
    description:
      'What content pillars are, how to choose yours, the percentages that keep a feed balanced, and worked pillar sets for six kinds of business.',
    intro: [
      'Content pillars are the small set of themes an account returns to again and again. They are the difference between an account that feels like a coherent publication and one that feels like a noticeboard. If your last ten posts could belong to ten different businesses, you do not have a pillar problem of quantity — you have no pillars at all.',
      'This guide explains how to derive pillars from your audience\'s real questions, how to weight them, and how to use them as a weekly planning system. It ends with worked examples you can adapt rather than copy.',
    ],
    sections: [
      {
        heading: 'Where pillars actually come from',
        paragraphs: [
          'Good pillars come from three sources: the questions customers ask before buying, the work you do that nobody sees, and the outcomes your product creates. List your last twenty customer questions — from DMs, emails, sales calls, reviews. Group them. The groups are draft pillars, written in your audience\'s language rather than your marketing department\'s.',
          'Test each candidate pillar with one question: "Could we publish on this theme twice a month for a year without repeating ourselves?" If not, it is a campaign, not a pillar. Campaigns are fine — they just live on top of pillars for a few weeks and then end.',
        ],
      },
      {
        heading: 'The percentage mix that keeps feeds healthy',
        paragraphs: [
          'Assign every pillar a target share and check the actual mix monthly. A dependable default for service and product businesses alike: 40% education (teach, explain, demystify), 25% connection (behind the scenes, people, community), 20% proof (results, testimonials, case studies), 15% promotion (offers, launches, calls to action).',
          'The exact numbers matter less than the discipline of measuring. Most accounts that "feel too salesy" discover they are running 50% promotion. Most that "never sell anything" discover promotion is at 2%. The calendar does not lie once pillars are tagged.',
        ],
        bullets: [
          'Education earns saves and shares — your reach engine.',
          'Proof earns trust — the content that converts profile visitors.',
          'Connection earns replies — the content algorithms quietly reward.',
          'Promotion earns revenue — keep it scarce enough to stay welcome.',
        ],
      },
      {
        heading: 'Worked examples',
        paragraphs: [
          'A physiotherapy clinic: injury education 40%, exercise demos 25%, patient progress stories 20%, appointment availability 15%. A B2B software tool: workflow tutorials 40%, customer teardowns 25%, product updates 20%, hiring and culture 15%. A wedding photographer: planning advice 35%, real weddings 30%, behind the scenes 20%, availability and offers 15%.',
          'Notice what all three share: the biggest pillar teaches, the smallest sells. If your mix inverts that, engagement usually falls within a month — audiences can smell a sales channel.',
        ],
      },
      {
        heading: 'Running pillars week to week',
        paragraphs: [
          'Give each pillar a home slot — Monday education, Thursday proof — and the weekly plan assembles itself. When a slot is empty, open the idea bank for that pillar instead of improvising a promotion. Keep a running list of ten future ideas per pillar; planning day becomes selection, not invention.',
          'Rebalance quarterly. If education consistently outperforms, it may earn 50%. If a pillar underperforms for a full quarter despite good execution, replace it — pillars serve the audience, not your original plan.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many content pillars should I have?',
        a: 'Three to five. Fewer makes the account feel narrow; more makes it feel scattered and impossible to plan. Four is the most common working number.',
      },
      {
        q: 'What is a good pillar percentage mix?',
        a: 'A reliable starting point: 40% education, 25% connection or community, 20% proof such as testimonials and results, and 15% promotion. Measure your actual mix monthly and adjust deliberately rather than by drift.',
      },
      {
        q: 'How do I find pillars for a brand-new account?',
        a: 'Mine the questions customers ask before buying, the process behind your work, and the outcomes you create. Group twenty real questions into themes — those themes are your first pillars.',
      },
      {
        q: 'Can one post belong to two pillars?',
        a: 'It can touch two themes, but tag it with the primary one. Clean tagging is what makes the monthly mix measurement meaningful; double-tagging everything makes the numbers useless.',
      },
      {
        q: 'How often should pillars change?',
        a: 'Review them quarterly. A pillar should survive at least a full quarter of consistent execution before you judge it — most "failing" pillars were simply under-posted.',
      },
    ],
    related: ['how-to-plan-a-social-media-content-calendar', 'how-to-repurpose-content', 'social-media-calendar-for-small-business'],
    updatedAt: '2026-11-17',
  },
  {
    slug: 'best-times-to-post-on-social-media',
    title: 'Best Times to Post on Social Media: Guidance, Not Gospel',
    h1: 'Best Times to Post on Social Media',
    description:
      'General best-time guidance for Instagram, TikTok, LinkedIn, Facebook, X and more — plus how to find your own audience\'s real best time from your data.',
    intro: [
      'Every "best time to post" chart on the internet is an average of millions of accounts that are not yours. Those averages are a reasonable place to start and a terrible place to stop. This guide gives you the commonly published guidance for each major platform — clearly labelled as general guidance — and then shows you the simple method to replace it with your own numbers within a month.',
      'Timing is a multiplier, not a foundation: it can lift a good post by a modest margin, and it cannot rescue a weak one. Get the content right first, then tune the clock.',
    ],
    sections: [
      {
        heading: 'General guidance by platform',
        paragraphs: [
          'Instagram: weekday mornings (7–9), lunch (12) and early evening (19) are the most consistent windows; weekends favour late morning. Facebook: mid-morning to mid-afternoon on weekdays. TikTok: early morning and evening, with late slots (22) often outperforming for younger audiences. LinkedIn: Tuesday to Thursday at the start of the workday and at lunch. X: weekday mornings ride the news cycle. Pinterest: evenings and weekends, when project planning happens.',
          'Treat these as hypotheses. They were compiled from other people\'s audiences, in other time zones, in other niches. Your audience of night-shift nurses or early-rising farmers will not behave like the average of everyone.',
        ],
      },
      {
        heading: 'Find your own best time in four weeks',
        paragraphs: [
          'Post at deliberately varied times for four weeks — same content quality, same formats, different slots — and log two numbers per post after 48 hours: reach and engagement (likes plus weighted comments, shares and saves). Group results by weekday-and-hour. Any slot with at least three posts gives you a usable signal; the winner is rarely the published "best time".',
          'Then lock your top two slots as your calendar defaults and keep one experimental slot a week. Audiences drift with seasons, school terms and algorithm changes, so re-run the test twice a year. This is exactly the computation the Intelligence tab of this calendar performs automatically once you log performance for your posts.',
        ],
        bullets: [
          'Change one variable at a time — time or format, not both.',
          'Wait 48 hours before judging a post; late reach is real.',
          'Compare within a platform and format, never across them.',
          'Three posts per slot is a minimum signal; five is comfortable.',
        ],
      },
      {
        heading: 'Time zones: the silent timing killer',
        paragraphs: [
          'If your audience spans time zones, "post at 9" is meaningless until you say whose 9. Plan in the zone where most of your audience lives, and check what your chosen hour looks like for the second-largest group. A 9:00 post for London lands at 4:00 in New York and 13:00 in Karachi — one of those audiences is asleep.',
          'Tools that schedule in your browser\'s local zone while your audience lives elsewhere are a common source of mysteriously dead posts. Always confirm which zone a scheduling time refers to before trusting it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the single best time to post on Instagram?',
        a: 'There is no universal answer, but weekday 7–9am and 7pm in your audience\'s time zone are the most reliable starting windows. Test them against your own results for a month and keep the winner.',
      },
      {
        q: 'Do posting times actually matter?',
        a: 'Yes, modestly. Timing affects how much early engagement a post gets, which influences distribution. But content quality and consistency matter far more — a great post at an average time beats an average post at the "perfect" time.',
      },
      {
        q: 'How do I find my audience\'s best time?',
        a: 'Vary your posting times for four weeks, log reach and engagement per post, and group by weekday and hour. Slots with three or more posts give a usable signal. Repeat the test twice a year.',
      },
      {
        q: 'Should I post at the same time every day?',
        a: 'A predictable rhythm helps your audience form a habit, but locking every post to one slot means you never learn whether another slot is better. Keep anchor slots and one experimental slot per week.',
      },
      {
        q: 'Which time zone should I schedule in?',
        a: 'The zone where the largest share of your audience lives. If your audience is split, choose the zone of your highest-value segment and accept the compromise for the rest.',
      },
    ],
    related: ['how-to-plan-a-social-media-content-calendar', 'content-pillars-strategy', 'how-to-repurpose-content'],
    updatedAt: '2026-11-17',
  },
  {
    slug: 'how-to-repurpose-content',
    title: 'How to Repurpose One Post Into a Week of Content',
    h1: 'How to Repurpose Content Without Repeating Yourself',
    description:
      'A practical repurposing system: turn one strong idea into a video, a carousel, a thread and a story — each native to its platform, none a lazy copy.',
    intro: [
      'Repurposing is not reposting. Reposting is the same file uploaded twice; repurposing is the same idea rebuilt for a different context. The distinction matters because audiences forgive — even reward — a familiar idea in a new form, and punish obvious recycling.',
      'The economics are hard to argue with: a single well-researched idea costs most of its effort in the thinking. Turning that thinking into four platform-native posts costs a fraction more and multiplies the surface area the idea can work on.',
    ],
    sections: [
      {
        heading: 'Start with a pillar post worth multiplying',
        paragraphs: [
          'Choose source material with substance: a tutorial, a teardown, a story with numbers, a strong opinion with reasoning. Thin sources produce thin derivatives. Your best-performing post of the last quarter is usually the right candidate — the market has already validated the idea.',
          'Extract the skeleton before touching any format: the hook, the three key points, the proof, the call to action. Every derivative keeps the skeleton and changes the flesh.',
        ],
      },
      {
        heading: 'The derivative map',
        paragraphs: [
          'From a video: cut the strongest 30 seconds into a Short, a TikTok and a Reel (new hook each time — the first two seconds are platform-specific), and turn the transcript\'s key point into a LinkedIn text post. From a carousel: export the slides as a LinkedIn document post, narrate them as a slideshow video, and tease slide one as a Story. From a text post: split it into an X thread, expand it with a personal example for LinkedIn, and design its key line as an Instagram quote graphic.',
          'Space derivatives at least three days apart and never let two versions of the same idea run on the same day. Staggering makes each one feel like its own post that happens to rhyme with something familiar.',
        ],
        bullets: [
          'Video → Short/TikTok/Reel cuts + transcript text post.',
          'Carousel → document post + narrated slideshow + Story teaser.',
          'Text → thread + expanded post + quote graphic.',
          'Anything → a follow-up post answering the best comment it received.',
        ],
      },
      {
        heading: 'Keep derivatives honest',
        paragraphs: [
          'Update anything time-sensitive before reusing: prices, dates, statistics, "new" claims. A repurposed post that advertises last month\'s offer is worse than no post. Link derivatives back to their source in your planner so the family stays traceable — when the source needs a correction, you can find every version.',
          'Track performance per derivative, not per idea alone. You will usually find one format consistently outperforms for your audience; that format becomes the default first derivative next time.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is repurposing the same as reposting?',
        a: 'No. Reposting uploads the identical content again. Repurposing rebuilds the same idea natively for another format or platform — a video becomes a carousel, a thread, a quote graphic — with a fresh hook and updated details.',
      },
      {
        q: 'How long should I wait before repurposing a post?',
        a: 'For a different platform or format, three days is a practical minimum so the versions do not collide. For the same platform and format, wait at least a month — or recycle it as evergreen content after its original run has fully cooled.',
      },
      {
        q: 'Which posts are worth repurposing?',
        a: 'Your proven performers and your most substantial pieces: tutorials, teardowns, stories with specifics. The idea should survive being expressed four different ways; if it cannot, it was a moment, not a pillar post.',
      },
      {
        q: 'Will my audience notice the repetition?',
        a: 'Most will not encounter every version — each platform\'s audience barely overlaps, and algorithms show any single post to a minority of followers. Those who do notice usually experience it as a theme, not a repeat, when the format genuinely changes.',
      },
      {
        q: 'How do I keep track of derivatives?',
        a: 'Link each derivative to its source post in your planner, and note which format each version used. When the source is corrected or retired, you can find and update the whole family instead of hunting.',
      },
    ],
    related: ['content-pillars-strategy', 'how-to-plan-a-social-media-content-calendar', 'best-times-to-post-on-social-media'],
    updatedAt: '2026-11-17',
  },
  {
    slug: 'social-media-calendar-for-small-business',
    title: 'Social Media Planning for Small Businesses: The 2-Hour Week',
    h1: 'Social Media Planning for Small Businesses',
    description:
      'A realistic two-hour weekly system for owners and tiny teams: one platform done well, batched creation, and a calendar that survives busy weeks.',
    intro: [
      'Most small businesses do not fail at social media because of bad content. They fail because the plan assumed a marketing department they do not have. When the owner is also the photographer, copywriter and community manager, the system has to fit inside real life — about two focused hours a week.',
      'This guide is that system: ruthless platform focus, a fixed weekly rhythm, batching, and a fallback mode for the weeks when the business catches fire.',
    ],
    sections: [
      {
        heading: 'Pick one platform and win it',
        paragraphs: [
          'Two hours a week cannot feed four platforms well. Choose the one where your customers demonstrably are — the one that already produces enquiries, however informally — and make it excellent. Add a second platform only after the first runs on autopilot habits for a full quarter.',
          'Being absent from a platform is a neutral fact. Being present with a dead, three-months-stale profile is a negative signal. Focus is not a limitation; it is the strategy.',
        ],
      },
      {
        heading: 'The two-hour weekly rhythm',
        paragraphs: [
          'Thirty minutes planning: choose this week\'s three posts from your pillar idea list and assign slots. Sixty minutes creating: shoot all visuals in one block (same light, same setup), then write all captions in one block. Thirty minutes scheduling and engaging: load everything into the calendar, then reply to comments and messages from the week.',
          'Protect the slot like a supplier meeting — same time weekly, phone on silent. The rhythm matters more than the exact hours; a mediocre plan executed weekly beats a brilliant one executed in bursts.',
        ],
        bullets: [
          'Plan: 30 min — pick from the idea bank, never from a blank page.',
          'Create: 60 min — visuals first, captions second, no switching.',
          'Schedule & engage: 30 min — load the week, answer the people.',
        ],
      },
      {
        heading: 'Busy-week fallback mode',
        paragraphs: [
          'Some weeks the business wins and marketing loses. Decide your fallback in advance: one post, your strongest pillar, your most reliable format, even if it is just a photo and two honest sentences about the week. A visible pulse keeps the account alive; silence for a month restarts you from zero.',
          'Keep two evergreen posts permanently in reserve — content with no expiry date, ready to drop in. Reserves turn a crisis week from a gap into a shrug.',
        ],
      },
      {
        heading: 'What to measure (and what to ignore)',
        paragraphs: [
          'Track three numbers monthly: enquiries or bookings that mention social, profile visits, and saves-plus-shares on your best post. Ignore follower count week to week — it is a lagging, noisy vanity metric that will talk you out of a working system.',
          'Every quarter, ask one question: "Did social produce anything the business can name?" If yes, keep going and consider a second platform. If no, the problem is the offer or the pillar mix — not the posting frequency.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much time should a small business spend on social media?',
        a: 'About two focused hours a week is enough for one platform done well: 30 minutes planning, 60 creating in batches, 30 scheduling and replying. More time helps only after that rhythm is stable.',
      },
      {
        q: 'Which platform should a small business start with?',
        a: 'The one your existing customers already use and respond on — check where enquiries and mentions already come from. One platform executed consistently beats four platforms updated sporadically.',
      },
      {
        q: 'What if I miss a week of posting?',
        a: 'Use fallback mode: one simple post from your strongest pillar, or a reserve evergreen post. Then resume the normal rhythm the following week without trying to "make up" the missed posts.',
      },
      {
        q: 'Should the owner post, or should I hire it out?',
        a: 'Owners usually produce the most credible content because they hold the stories and expertise. Hire help for production (editing, design) before handing over the voice — audiences can tell when the owner disappears.',
      },
      {
        q: 'How soon will social media produce results?',
        a: 'Expect leading signals (saves, shares, profile visits, first mentions in enquiries) within four to eight consistent weeks. Revenue effects typically lag a quarter. Judge the system quarterly, not weekly.',
      },
    ],
    related: ['how-to-plan-a-social-media-content-calendar', 'content-pillars-strategy', 'content-calendar-vs-spreadsheet'],
    updatedAt: '2026-11-17',
  },
  {
    slug: 'content-calendar-vs-spreadsheet',
    title: 'Content Calendar vs Spreadsheet: An Honest Comparison',
    h1: 'Content Calendar vs Spreadsheet: Which Do You Need?',
    description:
      'Spreadsheets are genuinely fine for many teams. Here is where they shine, where they break, and the five signals that you have outgrown yours.',
    intro: [
      'This page is published by a company that makes a content calendar tool, so let us earn your trust the direct way: for plenty of people, a spreadsheet is the right choice, and this guide will tell you if you are one of them. A tool you do not need is a cost; a spreadsheet you have outgrown is a different, hidden cost. The skill is knowing which side of the line you are on.',
      'No feature checklist marketing — just the honest trade-offs, from someone who has run calendars in both.',
    ],
    sections: [
      {
        heading: 'Where spreadsheets genuinely shine',
        paragraphs: [
          'A spreadsheet is free, infinitely flexible, and already understood by everyone on the team. For one person posting a few times a week on one platform, with no approval flow and no media library to speak of, it is not a compromise — it is the correct tool. Setting up a dedicated system would cost more time than it saves.',
          'Spreadsheets are also excellent thinking tools: pillar-mix calculations, posting-time experiments and performance logs all live happily in cells. Several sections of a good calendar workflow should stay in a spreadsheet forever.',
        ],
      },
      {
        heading: 'Where spreadsheets start to break',
        paragraphs: [
          'The cracks appear in a predictable order. First, media: captions in cells, images in a folder, and no way to see them together. Second, time: a date in a cell carries no timezone, no per-platform preview and no warning that three posts landed on the same day. Third, people: "which version is final?" becomes unanswerable once two humans edit the same sheet. Fourth, insight: the sheet knows what you planned, but computing pillar balance or spotting a two-week gap means manual counting.',
          'None of these are fatal individually. Together they create the familiar Sunday-night scramble: the plan exists, but nobody trusts it, so it gets rebuilt from memory every week.',
        ],
      },
      {
        heading: 'Five signals you have outgrown the spreadsheet',
        paragraphs: [
          'One: you plan for three or more platforms with different formats. Two: someone else must approve posts before they ship. Three: you have been surprised by an empty week or a doubled day more than once. Four: finding last month\'s media takes longer than making it did. Five: you cannot answer "what share of our content is promotional?" without an hour of counting.',
          'Two or more signals means a dedicated calendar will pay for itself in recovered time — especially a free one. Zero or one signal means keep the spreadsheet and spend the effort on better content instead.',
        ],
        bullets: [
          'Stay: solo, 1–2 platforms, no approvals, low volume.',
          'Switch: multi-platform, approvals, recurring series, pillar tracking.',
          'Either way: keep performance logs — they inform both systems.',
        ],
      },
      {
        heading: 'Migrating without the big-bang rewrite',
        paragraphs: [
          'Do not migrate history. Export next month\'s planned rows as CSV, import them into the calendar, and run both systems in parallel for exactly one planning cycle. The spreadsheet retires the day the calendar produces its first monthly review — by then the habit, not the file format, has changed.',
          'This calendar imports CSV with column mapping and a dry-run preview precisely because that is how real migrations happen: cautiously, reversibly, and with the old system still standing until the new one proves itself.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is a spreadsheet good enough for a content calendar?',
        a: 'For a solo creator or tiny team on one or two platforms with no approval workflow, yes — genuinely. Spreadsheets break down as platforms, people and volume grow, not before.',
      },
      {
        q: 'What does a dedicated calendar do that a spreadsheet cannot?',
        a: 'Visual drag-and-drop planning with timezone-correct times, per-platform caption limits and previews, media attached to posts, approval workflows, automatic gap and pillar-balance detection, and one-click exports and sharing.',
      },
      {
        q: 'Can I migrate my spreadsheet calendar without losing data?',
        a: 'Yes: export the planned rows as CSV and import them with column mapping. Migrate only the future — next month onwards — rather than your whole history, and run both in parallel for one cycle.',
      },
      {
        q: 'How much does a dedicated content calendar cost?',
        a: 'It ranges from free to hundreds per month for enterprise suites. This calendar is free and stores data locally in your browser; paid tools mainly add team accounts, direct publishing integrations and support.',
      },
      {
        q: 'When should a team definitely switch?',
        a: 'When two or more of these are true: three or more platforms, an approval step, recurring series, surprise empty weeks, or no easy way to measure your content mix. At that point the spreadsheet is costing more time than the switch.',
      },
    ],
    related: ['how-to-plan-a-social-media-content-calendar', 'social-media-calendar-for-small-business', 'content-pillars-strategy'],
    updatedAt: '2026-11-17',
  },
];
