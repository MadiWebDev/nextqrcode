/**
 * Programmatic SEO pages (spec §11, reconciled by D-RB-01): the full
 * data model and the automated quality gate are built as specified;
 * only pages that PASS the gate ship, and the starter set is small
 * on purpose while the platform's indexing freeze holds. A page must
 * have a unique title and description, substantial role-specific
 * content, the required blocks (intro, employer expectations, skills,
 * template recommendation, mistakes, FAQ) and low similarity to its
 * siblings. Failing pages are excluded from routes and the sitemap
 * by `publishedSeoPages()` — the gate is the shipping filter.
 */

export interface SeoPage {
  slug: string;
  type: 'role' | 'country' | 'guide';
  title: string;
  description: string;
  h1: string;
  intro: string[];
  lookFor?: string[];
  skills?: string[];
  templateId?: string;
  templateWhy?: string;
  mistakes?: string[];
  sectionGuide?: Array<{ heading: string; text: string }>;
  sections?: Array<{ heading: string; paragraphs: string[] }>;
  faqs: Array<{ q: string; a: string }>;
}

export const SEO_PAGES: SeoPage[] = [
  {
    slug: 'nurse',
    type: 'role',
    title: 'Nurse Resume Template & Examples — Free, ATS-Safe',
    description:
      'Build a nurse resume that gets shortlisted: registration first, ward skills quantified, ATS-safe template. Free with real PDF/DOCX downloads, no sign-up.',
    h1: 'Nurse resume template',
    intro: [
      'Nurse recruitment moves fast and shortlisting is ruthless: a nurse manager may give your resume twenty seconds before deciding. What they look for in those seconds is registration status, ward or specialism, and evidence that you can run a bay of patients safely. Everything else — however impressive — is read later, if at all.',
      'This page shows how to structure a nurse resume that answers those three questions immediately, which clinical skills to name, and the mistakes that quietly sink applications. The recommended template below is ATS-safe, because most hospital groups now screen with applicant tracking software before a human ever sees your name.',
    
      'One more thing matters in nursing: tone. Shortlisting managers read for steadiness — precise dates, consistent titles, no exaggeration about scope of practice. A resume that describes exactly the care you are registered and competent to give, at the volume you actually handle, reads as safe. In a profession where safety is the product, that impression is the interview.',
    ],
    lookFor: [
      'Current registration or licence, stated near the top with its number where local practice allows',
      'Ward specialisms in plain words: acute medical, surgical, ICU, A&E, community, theatres',
      'Patient loads and acuity you have handled ("bay of 8–10 acute patients")',
      'Medication, IV therapy, wound care and escalation practice described concretely',
      'Mentoring, preceptorship or link-nurse roles that show seniority',
    ],
    skills: ['Patient assessment', 'Medication administration', 'IV cannulation & therapy', 'Wound care', 'Infection prevention & control', 'Care planning', 'SBAR handover', 'ECG monitoring', 'Catheterisation', 'Discharge planning', 'Safeguarding', 'Electronic patient records'],
    templateId: 'nurse-clinical',
    templateWhy:
      'Clinical Care puts registration and certifications directly under the summary — exactly where a shortlisting manager looks — in a strict single column that hospital ATS software parses cleanly.',
    mistakes: [
      'Burying your registration under education or page two; if it is not visible in the first scan, you may never be read properly',
      'Writing duties ("responsible for patient care") instead of scale and outcomes (patients per shift, audits passed, incidents prevented)',
      'Listing every placement from training as equal-weight experience; recent, relevant wards deserve the space',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Three lines maximum: registration, years and settings, one distinguishing strength. "Registered nurse with six years across acute medical and surgical wards, practised in IV therapy and precepting students" gives a manager everything needed to keep reading.' },
      { heading: 'Experience', text: 'Order by recency and weight recent wards heaviest. Each entry: ward type and patient load in the first bullet, a measurable improvement or audit result in the second, mentoring or link roles in the third. Agency and bank shifts can group into one entry with total period and settings covered.' },
      { heading: 'Skills', text: 'Split clinical skills from ward practice. Clinical: the procedures you are signed off for. Practice: handover method, documentation systems, discharge planning. Only list competencies you could be observed performing tomorrow.' },
      { heading: 'Certifications', text: 'Registration first, then life-support and specialist courses with years. Expired items come off until renewed — an out-of-date BLS on a shortlisted resume creates a problem where none existed.' },
    ],
    faqs: [
      { q: 'Should a nurse resume include a photo?', a: 'In most hospital and public-sector hiring, no — photos add nothing to clinical shortlisting and some systems strip them. Private clinics in some regions do expect one; if the advert asks, use a designed template instead.' },
      { q: 'How long should a nurse resume be?', a: 'Two pages suits most nurses with more than five years of experience. Newly qualified nurses should aim for one strong page rather than padding.' },
      { q: 'What goes first: experience or certifications?', a: 'Registration and current certifications come first for nurses — they are eligibility criteria, not extras. Then experience in reverse-chronological order.' },
      { q: 'Can I use the same resume for ICU and ward roles?', a: 'Keep one master resume, then reorder the summary and skills for each specialism. The version you send should lead with the skills the specific ward named in its advert.' },
    ],
  },
  {
    slug: 'teacher',
    type: 'role',
    title: 'Teacher Resume Template & Examples — Free CV Builder',
    description:
      'A teacher resume that shows subjects, grade levels and classroom results in the order schools scan for. Free ATS-safe template, PDF & DOCX, no watermark.',
    h1: 'Teacher resume template',
    intro: [
      'Schools shortlist differently from companies: the first filter is almost always "can this person teach the subject and the year groups we need, starting when we need them?" Your resume should answer that in the first three lines — subjects, phases or grade levels, and years of experience — before any philosophy.',
      'After eligibility, heads of department look for evidence: results trends, class sizes, responsibilities beyond the classroom. This guide lays out that structure, the skills vocabulary schools actually use, and the recommended template with a full fictional example you can open and adapt.',
    
      'Presentation counts for more in teaching than applicants expect, because your resume is the first writing sample a school sees. Clean structure, consistent dates and careful proofreading quietly evidence the organisation you will bring to a classroom. The fictional example on the recommended template shows the expected standard: every claim on it is the kind a head of department could verify at interview.',
    ],
    lookFor: [
      'Subjects and grade levels taught, stated in the headline or first summary line',
      'Classroom results with numbers: attainment trends, value-added, exam pass rates',
      'Class sizes and lesson loads that show you can handle a real timetable',
      'Responsibilities beyond teaching: mentoring, clubs, curriculum work, safeguarding roles',
      'Teaching licence or QTS-equivalent status and any curriculum frameworks (Cambridge, IB, national)',
      'Continuity: schools read dates closely because pupils suffer from churn; stable tenure and clearly explained moves are quietly powerful evidence of the reliability a timetable demands.',
    ],
    skills: ['Lesson planning', 'Formative assessment', 'Differentiation', 'Behaviour management', 'Data-informed teaching', 'Safeguarding', 'Parent communication', 'Curriculum development', 'Google Classroom / LMS', 'Exam preparation', 'Parent-teacher meetings', 'SEN support', 'EAL learners', 'Report writing'],
    templateId: 'teacher-classroom-classic',
    templateWhy:
      'Classroom Classic orders a teacher\u2019s story the way schools read it — qualifications and experience first, certifications verifiable at a glance — in a clean single column.',
    mistakes: [
      'Leading with a long teaching philosophy while the subjects you can teach appear nowhere in the first half page',
      'Vague claims like "passionate educator" with no class sizes, results or responsibilities to back them',
      'Treating every school the same; a two-line summary tweak naming the school\u2019s phase and curriculum is worth more than a redesign',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Subjects, phases and one result. "Mathematics teacher, grades 6–10, seven years, with a record of lifting middle-band attainment" is a complete professional identity in a single sentence.' },
      { heading: 'Experience', text: 'Per school: timetable load, class sizes, exam classes taught, then results and responsibilities. Order bullets by what a head of department values — outcomes before activities.' },
      { heading: 'Education & training', text: 'Degree and teaching qualification with subjects; then licences and curriculum training (Cambridge, IB, safeguarding) as certifications with years.' },
      { heading: 'Skills', text: 'Name classroom technology you genuinely use — LMS platforms, assessment tools, interactive boards — separately from pedagogy skills like differentiation and formative assessment.' },
    ],
    faqs: [
      { q: 'Should I include my teaching philosophy on my resume?', a: 'A short version helps — two or three sentences as its own section — but it should never push subjects, grades and results off the first page.' },
      { q: 'How do I show results without breaking confidentiality?', a: 'Use trends and percentages, never identifiable student data: "grade 9 average rose from 61% to 74% over two terms" is both safe and persuasive.' },
      { q: 'Do schools use ATS software?', a: 'Large school groups and international school recruiters increasingly do. A single-column template with standard headings (Experience, Education, Skills) is the safe default.' },
      { q: 'What if I am a new teacher with little experience?', a: 'Lead with your training placements, subjects and any tutoring, mentoring or youth work — and quantify those too (students taught, sessions run).' },
      { q: 'Should newly qualified teachers use a different format?', a: 'The structure stays the same, but the weight shifts: training placements, subjects and any tutoring or mentoring experience carry the page, and education moves above experience until you have two substantive posts.' },
    ],
  },
  {
    slug: 'software-engineer',
    type: 'role',
    title: 'Software Engineer Resume Template — ATS-Safe & Free',
    description:
      'Software engineer resume structure that survives ATS screening and impresses hiring panels: scope, scale, stack. Free template with PDF/DOCX export.',
    h1: 'Software engineer resume template',
    intro: [
      'Engineering resumes are read twice by different audiences. First, software (and often a recruiter) scans for the stack, the seniority signals and the companies. Then a hiring manager or staff engineer reads for scope: what you owned, at what scale, with what effect. A resume that serves only one of those readers fails the other.',
      'The structure below front-loads a precise skills section for the scan, then writes experience bullets in the scope-scale-result pattern panels probe in interviews. The recommended template is deliberately plain — engineering hiring rewards clarity over decoration at every level.',
    
      'A note on honesty, because panels test it: every technology and metric on an engineering resume is a promise to discuss it under questioning. The strongest resumes are not the longest lists but the ones where each line survives a forty-minute deep-dive. Write the version of your experience you can defend in a room with the people who built the systems you describe.',
    ],
    lookFor: [
      'A skills section naming languages, platforms and tools in plain text (not logos or rating bars)',
      'Scope words: owned, led, designed, migrated — attached to systems with real scale numbers',
      'Impact metrics: latency, cost, deploy frequency, incident reduction, users served',
      'Seniority evidence: mentoring, design reviews, roadmap ownership, cross-team work',
      'Links to a portfolio or code profile where the work can be inspected',
    ],
    skills: ['TypeScript', 'Python', 'Go', 'PostgreSQL', 'Kubernetes', 'AWS', 'CI/CD', 'System design', 'API design', 'Observability', 'Code review', 'Mentoring'],
    templateId: 'staff-engineer',
    templateWhy:
      'Staff Engineer puts skills above experience for fast keyword matching and gives projects their own entries — the format senior panels expect — while staying fully ATS-parseable.',
    mistakes: [
      'Skill bars and percentage ratings ("JavaScript 90%") that parsers cannot read and engineers do not believe',
      'Listing technologies with no evidence of depth; one bullet showing how you used a tool beats five name-drops',
      'Two-column designed templates for big-company portals, where column order often scrambles in parsing',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Level, domain and scale: "Staff engineer, payments platform, systems serving forty million monthly users". Two lines; the detail belongs below.' },
      { heading: 'Skills', text: 'Group by kind — languages, platforms, practices — and order by relevance to the target role. This section is written for the search box as much as the human.' },
      { heading: 'Experience', text: 'Each bullet: verb of ownership, system, scale, measurable effect. Cut bullets that merely describe the team’s work without your part in it.' },
      { heading: 'Projects', text: 'Side or open-source work earns its place when it demonstrates a skill your job has not. One or two lines each: what it is, what it proves.' },
    ],
    faqs: [
      { q: 'Should a software engineer resume be one page?', a: 'One page under ~8 years of experience; two beyond that if every line earns its place. Staff-level engineers are routinely read at two pages.' },
      { q: 'Do I list every technology I have touched?', a: 'No. List what you could discuss confidently in an interview, grouped by type. Depth signals beat breadth at senior levels.' },
      { q: 'Are side projects worth including?', a: 'Yes, when they show initiative or a skill your job has not let you use — one or two lines each, with what you built and what it does.' },
      { q: 'What file format do companies prefer?', a: 'PDF for anything sent to a human; DOCX only when a portal explicitly asks. Both here are generated from the same content, so the words never diverge.' },
      { q: 'How do I show impact without access to exact metrics?', a: 'Use the measures you do know — team size, traffic order of magnitude, release cadence, on-call scope — and mark estimates as approximations. Panels respect honest scale markers and distrust suspiciously precise numbers.' },
    ],
  },
  {
    slug: 'accountant',
    type: 'role',
    title: 'Accountant Resume Template & Examples — Free, ATS-Safe',
    description:
      'Accountant resume guide: systems, standards and close metrics in the order finance teams scan. Free ATS-safe template with real PDF and DOCX downloads.',
    h1: 'Accountant resume template',
    intro: [
      'Finance hiring is a checklist exercise before it is anything else: qualifications, systems, standards and the size of what you have handled. A financial controller scanning your resume is matching it against the close calendar, the audit and the software stack they run — your layout should make that matching effortless.',
      'This page sets out the accountant resume structure that does it: credentials visible early, month-end and audit experience quantified, and a skills section that names standards (IFRS, VAT, payroll) exactly as job adverts phrase them.',
    
      'Accountants are hired on trust signals as much as technique. Consistent dates, an unambiguous qualification record and referees who can confirm the close responsibilities you claim all matter. So does restraint: a precise, unadorned document suits the profession. The template recommended here is deliberately the plainest in our finance set, because finance readers reward exactly that.',
    ],
    lookFor: [
      'Professional qualification and stage (ACCA, CPA, CIMA…) stated unambiguously',
      'Month-end close ownership: how fast, how many entities, what size of ledger',
      'Systems by name: SAP, QuickBooks, Xero, Oracle, advanced Excel',
      'Standards and compliance: IFRS, local GAAP, VAT/GST, payroll taxes, audit support',
      'Numbers everywhere: budget size, transaction volumes, days shaved off the close',
    ],
    skills: ['Month-end close', 'Management accounts', 'Budgeting & forecasting', 'Variance analysis', 'IFRS', 'VAT returns', 'Bank reconciliations', 'Audit support', 'SAP / QuickBooks / Xero', 'Advanced Excel', 'Payroll processing', 'Fixed assets', 'Intercompany reconciliations'],
    templateId: 'accountant-ledger',
    templateWhy:
      'Ledger & Close uses dot-leader dates that keep tenures scannable and a strict single column so screening software reads every finance keyword in order.',
    mistakes: [
      'Describing duties instead of the close: "prepared reports" says nothing; "management accounts for 3 units by day 4" says everything',
      'Hiding your qualification stage — part-qualified is fine, ambiguity is not',
      'Forgetting the scale: entity count, turnover or budget size is what separates assistant from accountant level',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Qualification and stage, years, sectors, and your close metric. "Management accountant, CPA part-III, seven years across manufacturing and retail, close delivered by day four" is the whole pitch.' },
      { heading: 'Experience', text: 'Lead with close ownership and reporting lines; follow with systems migrations, audit outcomes and any process you measurably improved.' },
      { heading: 'Skills', text: 'Standards and taxes as their own group — IFRS, VAT, payroll — because screeners search them literally. Systems separately, with depth markers where honest.' },
      { heading: 'Certifications', text: 'Qualification body, stage and expected completion where relevant. Short courses (advanced Excel, a tax update) belong here with years.' },
    ],
    faqs: [
      { q: 'Should I list Excel as a skill?', a: 'Only with specifics: pivot tables, Power Query, XLOOKUP, modelling. "Advanced Excel (Power Query, financial models)" is credible; a bare "Excel" is assumed anyway.' },
      { q: 'How far back should my accounting experience go?', a: 'Ten to fifteen years in detail; earlier roles can compress to title, employer and dates. Qualifications never expire off the page.' },
      { q: 'Do finance teams use ATS?', a: 'Most mid-size and large employers do, and agencies definitely do. Standard headings and plain-text skills are the safe format.' },
      { q: 'Part-qualified: how do I phrase it?', a: 'Name the body, the papers passed and the expected completion date: "ACCA — 9 of 13 papers, completion expected Dec 2026".' },
      { q: 'Should I include non-accounting jobs?', a: 'Only briefly, and only if they show transferable reliability — cash handling, supervision, systems. One line each; your accounting story needs the space more.' },
    ],
  },
  {
    slug: 'driver',
    type: 'role',
    title: 'Driver Resume Template (HGV & Delivery) — Free CV',
    description:
      'Driver resume that leads with licence categories, safety record and endorsements. Free ATS-safe template, print-ready PDF, no sign-up or watermark.',
    h1: 'Driver resume template',
    intro: [
      'Transport managers do not read resumes the way office recruiters do. The first check is legal: licence categories, CPC or endorsements, and any points or bans. The second is trust: accidents, attendance and how you treat the vehicle and the paperwork. Everything on your resume should serve those two checks.',
      'The structure below puts licences where a transport manager looks first, then turns your driving history into clean, dated, verifiable lines — the format agencies and fleet operators can process fastest, including through their screening software.',
    
      'Availability and reliability are the unspoken sections of every driver resume. Mention your notice period or immediate availability in the summary, keep your address area-level (depot distance matters to planners), and make sure phone numbers are current — driving recruitment moves by phone, often same-day. A resume that gets the logistics of hiring you right signals the organisation you will bring to the job.',
    ],
    lookFor: [
      'Licence categories in full (B, C, CE, D…) with CPC/endorsement status and expiry awareness',
      'Safety record stated plainly: accident-free years, points (or none), tachograph compliance',
      'Vehicle types and work patterns: multi-drop, trunking, long-haul, temperature-controlled',
      'Volumes: drops per day, routes, mileage — the numbers that prove pace',
      'Vehicle care habits: defect reporting, daily checks, load securing',
      'Customer manner at the door: for delivery and service drivers, the employer’s reputation is quite literally in your hands at each stop, and one line evidencing complaint-free or complimented deliveries lands well.',
    ],
    skills: ['Category CE driving', 'Multi-drop planning', 'Load securing', 'Tachograph compliance', 'Daily vehicle checks', 'POD paperwork', 'Route planning apps', 'Customer handover', 'Refrigerated loads', 'Night driving', 'ADR awareness', 'Forklift assistance', 'Winter driving', 'Customer collections'],
    templateId: 'driver-logistics',
    templateWhy:
      'On the Road leads with a licences section and keeps the driving history as clean dated lines — built for transport managers and the agency systems they use.',
    mistakes: [
      'Making the reader hunt for your licence categories — if they are not visible in five seconds, the application stalls',
      'Omitting your safety record; in driving, a clean record is a headline achievement, not a detail',
      'Vague dates and gaps; driving history needs to be continuous and explainable for insurance and compliance',
      'Photocopy-quality licence details: categories transcribed wrongly or illegibly. Type them exactly as printed on the card — a wrong category letter can fail an agency compliance check before any human reads further.',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Licence categories, years, accident-free record and availability in two lines. This is the paragraph a transport manager reads twice.' },
      { heading: 'Licences', text: 'Its own section, directly under the summary: categories, CPC status, endorsements, and any ADR or specialist tickets with expiry years.' },
      { heading: 'Experience', text: 'Per employer: vehicle types, work pattern, drops or mileage, on-time record. Continuous dates matter — explain any gap in one factual line.' },
      { heading: 'Skills', text: 'Load securing, tachograph practice, vehicle checks, paperwork and customer handover. Practical, checkable items only.' },
    ],
    faqs: [
      { q: 'Should I include my licence number on my resume?', a: 'Categories yes, the full number no — share the number at offer stage. It is sensitive data and this builder keeps such fields out by default unless you choose otherwise.' },
      { q: 'How do I explain a licence points history?', a: 'State current points honestly if asked; do not volunteer a narrative. A long clean period since is your strongest framing, with dates.' },
      { q: 'Do driving agencies use ATS?', a: 'Large agencies and logistics firms do. Plain formatting with standard headings keeps your licence details machine-readable.' },
      { q: 'What if most of my experience is with one employer?', a: 'That is a strength in driving — it signals reliability. Break the role into routes, vehicles and responsibilities so the depth shows.' },
      { q: 'I have a gap in my driving history. How should I handle it?', a: 'Account for it in one factual line with dates — caring responsibilities, illness, work in another trade. Driving employers run continuity checks; an explained gap is routine, an unexplained one is a question mark.' },
    ],
  },


  {
    slug: 'chef',
    type: 'role',
    title: 'Chef Resume Template & Examples — Free CV Builder',
    description:
      'Chef resume structure kitchens respect: stations, covers, hygiene credentials and brigade experience. Free template with photo option, PDF & DOCX export.',
    h1: 'Chef resume template',
    intro: [
      'Executive chefs and kitchen managers read resumes between services, in minutes. They are looking for where you have worked, which stations you can run alone, how many covers you can push out, and whether your hygiene credentials are current. Prestige names help, but a brigade leader cares most about whether you will survive a Friday night.',
      'This page lays out the chef resume in that reading order: a tight summary naming your cuisine and level, experience written in stations and covers, and food-safety certification where it can be verified at a glance.',
    
      'Kitchens are small worlds, and claims travel. Write only the stations you can genuinely hold under pressure, because a trial shift will test exactly what the resume promises — most chefs would rather hire an honest chef de partie than an embellished sous. If you stage-trial well above your current title, say so as experience, not as the title itself.',
    ],
    lookFor: [
      'Stations you can run solo (larder, sauce, grill, pastry) and those you can support',
      'Covers per service and brigade size — the honest scale of your kitchens',
      'Cuisine specialisms and any signature techniques, stated without poetry',
      'Food hygiene / HACCP certification level and date',
      'Kitchen economics you have touched: ordering, stock, waste, GP awareness',
      'Calm under volume: any honest evidence of holding a section through peak service — covers survived, events catered — tells a head chef more than adjectives about passion ever will.',
    ],
    skills: ['Sauce section', 'Larder & garde manger', 'Grill', 'Menu development', 'Stock control & ordering', 'HACCP', 'Food hygiene', 'Brigade training', 'Allergen management', 'Costing', 'Butchery basics', 'Pastry support', 'Menu costing', 'Kitchen porter supervision'],
    templateId: 'chef-culinary',
    templateWhy:
      'Chef’s Whites suits kitchens that hire on presentation as well as skill — an elegant centred layout with room for a photo where the house expects one.',
    mistakes: [
      'Listing restaurants without stations or covers, leaving the reader to guess your level',
      'Letting an expired hygiene certificate sit on the page — check dates before every application',
      'Writing menus instead of evidence: dishes belong in a portfolio, results belong on the resume',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Level, cuisine, and the scale of your busiest kitchen. "Sous chef, modern French, nine-chef brigade serving ninety covers" sets the reader’s expectations precisely.' },
      { heading: 'Experience', text: 'Stations and covers first in every entry. Add ordering, waste or training responsibilities where you held them — they mark the step from cook to chef.' },
      { heading: 'Skills', text: 'Sections you run, sections you support, then standards: hygiene level, HACCP practice, allergen management, costing awareness.' },
      { heading: 'Certifications', text: 'Hygiene and safety certificates with years, then competition or specialist training. Currency is credibility here.' },
    ],
    faqs: [
      { q: 'Should a chef resume have a photo?', a: 'It depends on the market: many European and Gulf kitchens expect one, most UK/US kitchens do not mind either way. If the advert shows a formal house style, include a clean professional photo.' },
      { q: 'How do I show progression from commis to chef de partie?', a: 'Keep each role separate with its own dates and stations. Progression inside one brigade is a strong story — make the promotions visible.' },
      { q: 'Do large hotel groups use ATS for chefs?', a: 'Yes, the big groups screen centrally. Keep headings standard even if your target kitchen is small; the same file may pass through a group portal.' },
      { q: 'Should I include stages and short trials?', a: 'Include significant stages (a month or more, or a notable house) as brief experience lines. One-week trials belong in conversation, not on the page.' },
      { q: 'Should I list every kitchen I have worked in?', a: 'List the substantive ones in full. Very short stints can group into one line ("agency and trial work across Lyon bistros, 2017–2018") so the chronology stays honest without fragmenting the page.' },
    ],
  },
  {
    slug: 'sales-executive',
    type: 'role',
    title: 'Sales Executive Resume Template — Numbers-First & Free',
    description:
      'Sales resume that leads with quota attainment, deal size and territory growth. Free designed template with awards sidebar, PDF/DOCX downloads, no sign-up.',
    h1: 'Sales executive resume template',
    intro: [
      'Sales leaders hire the way they manage: by the numbers. Before your work history is read, your resume is scanned for quota attainment, deal size, cycle and territory — and if those numbers are missing, the assumption is they were not worth printing. A sales resume is the first pitch: it should close the reader on interviewing you.',
      'This guide shows the numbers-first structure: attainment in the summary, every role carrying its target-versus-result line, and an awards record where a VP of Sales expects to find it.',
    
      'A final structural point: order your roles by relevance, not just time, when a past role outsells your current one for the target job — a short "selected achievements" line in the summary can carry a flagship result from two roles ago. Sales leaders skim chronology but stop for numbers, wherever they sit on the page.',
    ],
    lookFor: [
      'Quota and attainment per role, in the role’s first bullet ("127% of €1.1m quota")',
      'Average deal size, cycle length and win rate where you know them',
      'Territory or vertical growth: accounts opened, revenue built from zero',
      'President’s Club, top-performer rankings and other verifiable recognition',
      'Selling method and stack: MEDDICC, Salesforce, outreach tooling',
      'Pipeline discipline: hiring managers ask how you run a pipeline; a line about forecast accuracy, stage hygiene or weekly review habits signals a professional rather than a lucky closer.',
    ],
    skills: ['B2B sales', 'Discovery (MEDDICC)', 'Negotiation', 'Forecasting', 'Territory planning', 'Salesforce', 'Outreach', 'Account growth', 'Demo delivery', 'Pipeline management', 'Channel partnerships', 'Trade shows', 'CRM hygiene', 'Tender responses'],
    templateId: 'sales-executive',
    templateWhy:
      'Pipeline Pro pairs a confident band header with an awards-and-tools sidebar, so attainment and recognition sit exactly where sales leadership looks.',
    mistakes: [
      'Revenue claims with no quota context — a big number against an unknown target proves nothing',
      'Activity metrics (calls made, emails sent) presented as results; outcomes close interviews',
      'One resume for every segment; enterprise and SMB buyers are different jobs and your summary should say which you are',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Segment, product type and your best attainment figure. A sales summary without a number is a missed first pitch.' },
      { heading: 'Experience', text: 'First bullet of every role: quota versus result. Then deal size, territory build and method. Rank roles by selling relevance if chronology undersells you.' },
      { heading: 'Awards', text: 'President’s Club, rankings and club trips with years — verifiable recognition belongs in its own visible section, not scattered through bullets.' },
      { heading: 'Skills', text: 'Methodology and stack: discovery frameworks, CRM, sequencing tools. Add vertical expertise (healthcare, manufacturing) as its own line.' },
    ],
    faqs: [
      { q: 'Should I put exact revenue numbers on my resume?', a: 'Yes, with context: your number, the quota, and the period. Employers verify at reference stage, so keep every figure defensible.' },
      { q: 'What if I missed quota in a role?', a: 'Show the context honestly — a territory rebuild, a team-wide shortfall year — and weight the page toward the roles and quarters where you delivered.' },
      { q: 'Do sales roles go through ATS?', a: 'At larger companies, yes. Keep a plain-text-friendly structure under the design: this template’s text remains fully extractable.' },
      { q: 'How long should a sales resume be?', a: 'One page for most; two only with a long, consistently strong record. Sales leaders respect brevity as a selling skill in itself.' },
      { q: 'How do I handle a role where I sold under a team quota?', a: 'State the team result and your personal contribution separately: "team closed €3.2m against €3m; my accounts contributed €1.1m". Blending the two is the fastest way to lose credibility at reference stage.' },
      { q: 'Should my resume mention specific client names?', a: 'Name clients only where your contract and norms allow. Otherwise describe them precisely — "a national grocery chain", "three FTSE-listed manufacturers" — which carries the same information safely.' },
    ],
  },
  {
    slug: 'data-analyst',
    type: 'role',
    title: 'Data Analyst Resume Template — ATS-Safe & Free',
    description:
      'Data analyst resume guide: tools first, then analyses that changed decisions. Free ATS-safe template with projects section, real PDF/DOCX downloads.',
    h1: 'Data analyst resume template',
    intro: [
      'Analytics hiring managers screen for two things in sequence: the toolkit (SQL depth, a BI platform, Python or not) and proof that your work changed a decision. Most analyst resumes nail the first and fumble the second, listing dashboards nobody can picture. The fix is structural: skills up front for the scan, projects written as decisions for the read.',
      'This page gives that structure, the vocabulary data teams actually search for, and a template whose projects section is built for analyses rather than job duties.',
    
      'Analysts should treat the resume itself as a small data product: consistent formatting, no unexplained gaps, numbers that reconcile. Hiring managers notice when a candidate who promises data quality submits a document whose dates and figures wobble. The example on the recommended template keeps every metric modest and checkable — that restraint is deliberate and worth imitating.',
    ],
    lookFor: [
      'SQL first and honestly graded — it is the one tool every data role shares',
      'BI platform by name (Looker, Tableau, Power BI) plus modelling tools (dbt) where used',
      'Analyses described by decision: what was asked, what you found, what changed',
      'Data scale: table sizes, event volumes, markets covered',
      'Stakeholder evidence: who used your work and how often',
      'Communication range: evidence that you present findings to non-technical audiences — workshops run, packs adopted, decisions documented — separates shortlisted analysts from purely technical candidates.',
    ],
    skills: ['SQL', 'Python (pandas)', 'Looker / Tableau / Power BI', 'dbt', 'A/B test analysis', 'Cohort analysis', 'Data modelling', 'Excel / Sheets', 'Stakeholder reporting', 'Data quality checks', 'Experiment design', 'Data visualisation', 'Survey analysis', 'Forecasting support'],
    templateId: 'data-analyst',
    templateWhy:
      'Insight Report leads with skills and gives selected analyses their own project entries — the order data hiring managers described on this page.',
    mistakes: [
      'Listing tools you opened once; interviewers probe the second bullet of your skills list',
      'Dashboard counts without audiences or outcomes ("built 20 dashboards" — for whom, used how?)',
      'Burying SQL mid-list; for most analyst roles it is the first keyword screened',
      'Portfolio links that need permission or are dead: a hiring manager clicks once. Host notebooks and dashboards publicly, and re-check every link before each application round.',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Toolkit headline plus one decision your work changed. "Data analyst — SQL, Looker, Python — whose pricing analysis recovered seven figures of margin" is the template to imitate.' },
      { heading: 'Skills', text: 'SQL first, then analysis methods, then reporting platforms. Grade depth honestly in brackets where it helps: (advanced), (working).' },
      { heading: 'Projects', text: 'Your best two or three analyses as project entries: question, method in one line, decision taken, measured effect.' },
      { heading: 'Experience', text: 'Duties compress; outcomes expand. Reporting cadence and stakeholder level ("weekly pack for the executive team") show seniority better than task lists.' },
    ],
    faqs: [
      { q: 'Should a data analyst resume include a portfolio?', a: 'A link to one strong public analysis (notebook, write-up, dashboard screenshot with synthetic data) outperforms three vague project bullets. Never use employer data.' },
      { q: 'Python or Excel — which matters more?', a: 'Depends on the team; the advert tells you. List both honestly with your depth in each, and let the JD matcher on this page show you which the posting emphasises.' },
      { q: 'How technical should my bullets be?', a: 'Technical about method, plain about impact: "identified a pricing leak worth S$1.2m a year through margin analysis by SKU" serves both readers.' },
      { q: 'Do data teams use ATS?', a: 'Yes — keyword screening on tools is standard. Plain-text skills sections matter more in analytics than almost any other field.' },
      { q: 'I am switching into data from another field. What transfers?', a: 'Any role where you measured, reported or decided with data: operations reporting, finance assistance, research, quality work. Frame those bullets analytically — question, method, decision — and put your tools training up front.' },
    ],
  },
  {
    slug: 'customer-support',
    type: 'role',
    title: 'Customer Support Resume Template — Free & ATS-Safe',
    description:
      'Customer support resume built on metrics and tone: CSAT, response times, channels, languages. Free ATS-safe template with real PDF/DOCX downloads.',
    h1: 'Customer support resume template',
    intro: [
      'Support hiring runs on evidence of two things: how you handle volume and how you handle people. The first is measurable — tickets a day, first-response time, CSAT — and the second shows in how you write the resume itself. A support resume that quantifies the measurable and reads warmly and clearly has already passed half the interview.',
      'Below is the structure support managers scan for, including the languages table that matters enormously in support hiring and is so often buried or missing.',
    
      'Support roles are increasingly remote, and remote hiring adds one more scan: can this person write? Your summary and bullets are assessed as writing samples in a way few other professions match. Short sentences, correct spelling of the tools you name, and a human tone will do more for a support application than any design choice on the page.',
    ],
    lookFor: [
      'CSAT or quality scores with the volume behind them (4.9/5 over 6,000 conversations)',
      'Channels you cover: chat, email, phone, social — with daily volumes',
      'First-response and resolution times against team targets',
      'Languages with honest levels, especially written fluency for chat/email roles',
      'De-escalation, knowledge-base writing or coaching evidence for senior roles',
      'Judgment under pressure: an example of protecting a customer relationship or a policy boundary under provocation, told in one line, shows the discretion support leads promote for.',
    ],
    skills: ['Live chat support', 'Email support', 'Phone support', 'De-escalation', 'Zendesk / Intercom', 'Knowledge-base writing', 'Quality assurance', 'Complaint handling', 'Onboarding customers', 'Multilingual support', 'Social media support', 'Returns & refunds', 'Subscription support', 'Escalation handling', 'Billing queries', 'Onboarding calls', 'Community moderation'],
    templateId: 'customer-support',
    templateWhy:
      'Support Star puts measured service results and language coverage in the exact order support managers scan, in an ATS-safe single column.',
    mistakes: [
      'Claiming "excellent communication skills" with no metrics and a resume full of typos — in support, the document is the demonstration',
      'Hiding languages in a paragraph; make them a labelled list with levels',
      'Listing tools without channels or volumes, so the reader cannot tell chat from phone experience',
      'Quoting metrics from a different queue: blending chat satisfaction scores with phone resolution figures confuses the story. Keep channel metrics labelled by channel so the numbers stay credible.',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Channels, volume and one score. "Chat and email specialist handling sixty conversations a day at 4.9/5 CSAT" tells a support lead exactly where you fit.' },
      { heading: 'Experience', text: 'Per role: channels and daily volume first, then a quality or coaching result, then tools. Promotion from agent to specialist should be visible as separate entries.' },
      { heading: 'Skills', text: 'Support craft (de-escalation, complaint handling, knowledge-base writing) separately from platforms (Zendesk, Intercom) — screeners search both lists differently.' },
      { heading: 'Languages', text: 'A dedicated list with honest levels and a note on written versus spoken strength. In support hiring this section routinely decides shortlists.' },
    ],
    faqs: [
      { q: 'What metrics should I include if my company did not share them?', a: 'Use what you legitimately know: your queue volumes, your schedules, your QA review scores. Never invent a CSAT — interviewers from the same industry can smell it.' },
      { q: 'Should I mention difficult-customer experience?', a: 'Yes, framed as de-escalation outcomes: complaint types handled, resolutions reached, escalations avoided. Specifics beat adjectives.' },
      { q: 'Do support teams screen with ATS?', a: 'BPOs and large product companies do, heavily on tools and languages. Standard headings and a real languages section are essential.' },
      { q: 'Can I apply for remote support roles with this?', a: 'Yes — add your home setup facts (connection, headset, quiet space, time zones you can cover) as a short line in the summary if the role is remote.' },
      { q: 'How do I show empathy as a skill without sounding soft?', a: 'Through outcomes: complaint resolution rates, saved cancellations, positive mentions by name in reviews, QA scores for tone. Empathy that produced a number is evidence; empathy as an adjective is not.' },
    ],
  },
  {
    slug: 'electrician',
    type: 'role',
    title: 'Electrician Resume Template & Examples — Free CV',
    description:
      'Electrician resume that leads with licence, tickets and fault-finding record. Free ATS-safe template, print-ready PDF, no sign-up and no watermark.',
    h1: 'Electrician resume template',
    intro: [
      'Electrical firms and contractors hire on proof of competence that can be checked: your licence, your testing tickets, and the kind of work you can be sent to alone. A resume for an electrician is therefore closer to a credentials document than a sales pitch — clarity and currency of tickets matter more than flair.',
      'This page sets out the order contractors read in: licences high, then installation and fault-finding experience with the systems named, then the compliance habits that keep their insurance valid.',
    
      'Contractors also read for independence: can you be sent alone, in a van, with a job sheet, and be trusted with the customer and the certificate book? Evidence of lone working, service calls and completed paperwork should be explicit rather than assumed. If you hold a clean driving licence and your own tools, one factual line in the summary covers two questions every contractor asks.',
    ],
    lookFor: [
      'Licence status and grade, with testing/inspection tickets and their currency',
      'Work types you can run solo: installs, rewires, fault finding, EICR/testing, three-phase',
      'Settings: domestic, commercial, industrial — and typical job sizes',
      'First-time fix rates or call volumes for service work',
      'Compliance habits: safe isolation, certification paperwork, regulations knowledge',
      'Paperwork reliability: test certificates, minor-works documentation and job sheets completed accurately and on time — contractors promote the electricians whose paperwork never causes an office problem.',
    ],
    skills: ['Fault finding', 'Consumer unit replacement', 'EICR testing & inspection', 'Three-phase systems', 'EV charger installation', 'Rewires', 'Safe isolation', 'Certification', 'Cable containment', 'Emergency lighting', 'Solar PV basics', 'Fire alarm systems', 'Data cabling', 'Portable appliance testing', 'Emergency lighting', 'Consumer unit upgrades', 'EV charger installation'],
    templateId: 'electrician-trades',
    templateWhy:
      'Licensed Electrician places licences and tickets above experience and keeps everything machine-readable — the two things contractors and their agency systems check first.',
    mistakes: [
      'Expired tickets presented without dates, or current ones buried — dates are the credibility',
      'Describing only installation when your strength is fault finding; name the diagnostic work explicitly',
      'No mention of paperwork; certification and test documentation are part of the trade, and firms know it',
      'Listing tools and test equipment as skills without context: the instrument names matter less than the certification work you use them for — pair equipment with the testing it supports.',
    ],
    sectionGuide: [
      { heading: 'Summary', text: 'Licence grade, years, and the work you can be sent to alone. Two lines, entirely factual.' },
      { heading: 'Licences & tickets', text: 'Directly under the summary: licence, testing tickets, specialist endorsements, each with its year or expiry. This section is the application, in miniature.' },
      { heading: 'Experience', text: 'Per firm: settings, job types and volumes. Service electricians should state call rates and first-time fix; installation electricians, project types and sizes.' },
      { heading: 'Skills', text: 'Fault finding, testing, containment, certification paperwork — the practical vocabulary contractors and agencies both search.' },
    ],
    faqs: [
      { q: 'Should I include my licence number?', a: 'State the licence and grade; share the number at offer stage. This builder keeps ID numbers out of your resume unless you deliberately add them as sensitive fields.' },
      { q: 'How do I present apprenticeship experience?', a: 'As its own entry with the firm, dates and the work you progressed to doing unsupervised by the end — progression is the point.' },
      { q: 'Do agencies screen electricians with software?', a: 'The large ones do, mainly on licence and ticket keywords. Keep those words exact and standard.' },
      { q: 'What about tools and van?', a: 'If you have your own tools and a clean driving licence, say so in one line — for service roles it is a genuine hiring factor.' },
      { q: 'I am self-employed. How do I present that?', a: 'As experience with your trading name, the work types, typical job sizes and how work reaches you (repeat clients, contractor partnerships). Add insurance and scheme registration details where relevant — they are hiring facts for contractors who subcontract.' },
      { q: 'Should I include non-electrical work?', a: 'Briefly, if it shows reliability, driving or customer-facing trust. Keep it to a line or two; your tickets and electrical record are the application.' },
      { q: 'How should apprentices present unfinished qualifications?', a: 'List the qualification in progress with the college, the stage reached and the expected completion month, then lead the experience with supervised work you already perform independently — fault-finding assistance, second-fix work, containment. Employers hiring improvers expect partial tickets; what they screen for is momentum and honest scope.' },
    ],
  },
  {
    slug: 'pakistan',
    type: 'country',
    title: 'CV Template for Pakistan — Format, Photo & Tips (Free)',
    description:
      'How to format a CV for jobs in Pakistan: what to include, photo and personal details conventions, and a free template with Urdu-friendly fonts and PDF export.',
    h1: 'CV format for Pakistan',
    intro: [
      'Pakistani employers — from Karachi banks to Lahore tech firms and Islamabad NGOs — still read CVs more personally than most Western markets: a fuller document is normal, personal details are often expected, and a photograph remains common outside the tech sector. At the same time, multinationals and larger local groups now screen with software, so the safe Pakistani CV is both complete and cleanly formatted.',
      'This page explains the conventions honestly — including where practice is changing — and points you to a template that handles both worlds, with proper Urdu and Roman Urdu support when you need a bilingual document.',
    
      'A practical note on process: much Pakistani hiring still runs through walk-ins, referrals and printed copies alongside portals. Keep a clean printed version of the same file — this builder’s PDF prints exactly as it previews — and carry copies to interviews. The document that gets you shortlisted online and the one you hand across the desk should be identical.',
    ],
    lookFor: [
      'Full contact details with a professional email; WhatsApp-reachable mobile numbers are normal and expected',
      'Education with boards/universities and years — Pakistani recruiters verify these, and gaps need explaining',
      'CNIC and date of birth: commonly requested at later stages; many employers accept them on the CV, but share them knowingly, not by default',
      'Computer skills stated concretely (MS Office is assumed; name what else you genuinely use)',
      'References: "available on request" is accepted; named references with phone numbers remain common in traditional sectors',
    ],
    skills: ['MS Office', 'Urdu & English communication', 'Data entry', 'Record keeping', 'Customer dealing', 'Report writing', 'Internet research', 'Team coordination'],
    templateId: 'universal-minimal',
    templateWhy:
      'Universal Minimal is the safe default for Pakistani applications: standard headings that both government-style panels and company ATS software read correctly, with sensitive fields (CNIC, date of birth) available as deliberate opt-ins rather than defaults.',
    mistakes: [
      'Copying a relative’s CV format from a decade ago — declarations and objective statements have largely given way to a short professional summary',
      'Printing your CNIC number on copies you hand out widely; it is identity data, and reputable employers ask for it at the right stage',
      'A photo in a suit taken against a wedding backdrop; if you include one, make it plain, recent and professional',
    ],
    sectionGuide: [
      { heading: 'Personal details', text: 'Name, city, mobile and email at the top. CNIC, date of birth and marital status only where the employer’s format asks — this builder keeps them as opt-in sensitive fields so the choice stays yours per application.' },
      { heading: 'Education', text: 'Degree, institution, board or university and passing year, most recent first. Pakistani recruiters read this section closely; keep scores in the local convention (division or CGPA as awarded).' },
      { heading: 'Experience', text: 'Organisation, designation and dates, with bullets on responsibilities that carry numbers — files handled, customers served, targets met. Government experience should name the department and BPS grade where relevant.' },
      { heading: 'Skills & languages', text: 'Computer skills concretely, then languages with honest fluency: Urdu and English are the working pair for most roles; regional languages are a genuine asset for field and community work.' },
    ],
    faqs: [
      { q: 'Should a Pakistani CV include a photo?', a: 'For banks, sales, hospitality and many local firms, yes — it is still customary. For tech, multinationals and online portals, it is optional and often better omitted. Match the sector, not a universal rule.' },
      { q: 'CV or resume — which word do Pakistani employers use?', a: 'CV is the everyday word in Pakistan for the same document. Length expectations run to two pages for experienced professionals.' },
      { q: 'Can I make a CV in Urdu?', a: 'Yes — this builder includes a Nastaliq Urdu font pair and right-to-left layout. Bilingual applications (English CV with an Urdu cover note) are common for government and community-facing roles.' },
      { q: 'Should I include my CNIC on the CV?', a: 'Only when an employer or a government form explicitly requires it. This builder treats CNIC as a sensitive field: off by default, added only by your choice.' },
    ],
  },
  {
    slug: 'uae-gulf',
    type: 'country',
    title: 'CV Template for UAE & Gulf Jobs — Format Guide (Free)',
    description:
      'Gulf job CV conventions explained: photo, nationality, visa status and personal details Gulf employers expect — plus a free template built for Gulf applicants.',
    h1: 'CV format for UAE & Gulf jobs',
    intro: [
      'Gulf recruitment — the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain — runs on its own conventions. Recruiters in Dubai or Riyadh expect personal details that would be unusual in Europe: nationality, visa status, date of birth and often a photograph, because work permits and quotas make those facts operational, not decorative. A European-style stripped CV can read as incomplete to a Gulf recruiter.',
      'At the same time, the big Gulf employers and agencies screen with software at serious volume. This page balances both: the details Gulf hiring expects, in a format machines still parse, with an honest note on which details to share at which stage.',
    
      'Recruitment timelines in the Gulf reward readiness: candidates who can join quickly, whose documents are attested or attestable, and whose CV already answers the permit questions get called first. If your educational certificates are already attested for your target country, one factual line saying so can move you up a shortlist — it removes a step the employer would otherwise have to schedule.',
    ],
    lookFor: [
      'Nationality and current location stated clearly — permit logistics depend on them',
      'Visa status (visit, employment, family, GCC national) and notice period / availability to join',
      'Photograph: expected in most Gulf sectors outside pure tech; professional and recent',
      'Driving licence where relevant — a UAE/GCC licence is a genuine asset for sales and field roles',
      'Gulf or regional experience highlighted; employers weight local market familiarity heavily',
    ],
    skills: ['Regional market experience', 'Arabic (state your level honestly)', 'Customer service', 'Sales & negotiation', 'MS Office', 'Documentation & PRO processes', 'Team supervision', 'Reporting'],
    templateId: 'gulf-job-seeker',
    templateWhy:
      'Overseas / Gulf Job Seeker was designed for this market: photo placement Gulf recruiters expect, a personal-details structure agencies recognise, and clean text underneath for their screening systems.',
    mistakes: [
      'Sending a photo-less, detail-less European CV to traditional Gulf employers and reading as unprepared',
      'Claiming a UAE driving licence or transferable visa you do not hold — verification is routine and fast',
      'Salary expectations on the CV; Gulf negotiation happens after shortlisting, not on the document',
    ],
    sectionGuide: [
      { heading: 'Personal details', text: 'Nationality, current country, visa status and availability to join — the operational facts Gulf recruiters screen on. Date of birth is commonly included; passport number never.' },
      { heading: 'Summary', text: 'Role, years, Gulf or regional experience, and one measurable strength. Mention a GCC driving licence here if the role involves movement.' },
      { heading: 'Experience', text: 'Employer, location by emirate or city, and results with numbers. Prior Gulf experience should be unmistakable — name the market explicitly rather than assuming the reader knows the company.' },
      { heading: 'Skills & languages', text: 'Arabic with an honest level, English fluency assumed and evidenced by the document itself, then trade skills and systems. Certifications with issuing body and year.' },
    ],
    faqs: [
      { q: 'Should I include my passport number on a Gulf CV?', a: 'No. Passport numbers are requested after offer, by the employer’s PRO. Nationality and visa status belong on the CV; the passport number does not.' },
      { q: 'Do Gulf employers really want a photo?', a: 'Most do, especially in sales, hospitality, real estate and customer-facing work. Use a plain professional headshot; never a cropped group photo.' },
      { q: 'What length is a Gulf CV?', a: 'Two pages is standard, three acceptable for senior or technical roles with certifications to list.' },
      { q: 'Should my CV be in Arabic or English?', a: 'English is the working language of Gulf private hiring; Arabic versions help for government and some Saudi roles. This builder supports Arabic script with proper right-to-left layout.' },
      { q: 'My current visa is a visit visa. Should I say so?', a: 'Yes — recruiters plan around it, and discovering it late ends processes. State the visa type and its validity window factually in the personal details; it is logistics, not a weakness.' },
    ],
  },
  {
    slug: 'united-kingdom',
    type: 'country',
    title: 'UK CV Template & Format Guide — No Photo, Two Pages',
    description:
      'UK CV conventions done properly: no photo, no date of birth, two pages, achievement-led. Free ATS-safe templates with PDF and DOCX downloads, no sign-up.',
    h1: 'UK CV format',
    intro: [
      'UK CVs follow stricter conventions than most applicants expect: no photograph, no date of birth, no full address — equality law and habit both point the same way — and a firm two-page ceiling for all but academic and medical CVs. Recruiters spend seconds on the first pass, and increasingly that pass is done by software before a person is involved.',
      'This page covers the current UK format: the personal statement that replaced the objective, achievement-led experience, and what to leave off entirely — with templates that enforce the conventions by design.',
    
      'One UK habit worth copying whatever your field: tailor the personal statement and the top three bullets of your most recent role to each application, and leave the rest stable. Recruiters consistently report that this small tailoring — fifteen minutes of work — separates shortlisted CVs from the pile far more reliably than any redesign.',
    ],
    lookFor: [
      'A three-line personal statement tailored to the role — not a generic objective',
      'Achievements with numbers in every recent role; duties are assumed from the job title',
      'Right-to-work clarity where relevant, stated factually in one line',
      'Skills and systems named exactly as adverts phrase them, for both recruiters and their software',
      'Education ordered by relevance: recent graduates lead with it, experienced hires demote it',
      'Right-to-work clarity: employers cannot ask discriminatory questions, but a CV that quietly confirms eligibility to work in the UK removes friction from shortlisting where the role is UK-based.',
    ],
    skills: ['Stakeholder communication', 'MS Office / Google Workspace', 'Data handling', 'Report writing', 'Customer service', 'Team leadership', 'Time management', 'Problem solving', 'Minute taking', 'Diary management', 'Event coordination'],
    templateId: 'one-page-compact',
    templateWhy:
      'One-Page Compact enforces UK discipline — tight, achievement-led, no photo — while the two-page version of the same design serves experienced hires. Both stay ATS-safe.',
    mistakes: [
      'Including a photo or date of birth out of habit from other markets — in the UK both mark a CV as unfamiliar with local norms',
      'The phrase "curriculum vitae" as a heading and a third page of early-career detail; two pages, current decade in depth',
      'References with names and phone numbers printed on the CV; "references available on request" is the UK norm and protects your referees',
      'Including a full postal address: town and region are enough for applications and protect your privacy. Full addresses belong on offer paperwork, not on a document you upload widely.',
    ],
    sectionGuide: [
      { heading: 'Personal statement', text: 'Three lines, rewritten per application: current role, strongest relevant evidence, target. No "objective", no first person pronouns debate — plain, specific, current.' },
      { heading: 'Experience', text: 'Achievements with numbers under each employer; duties only where they are not obvious from the title. Most recent role gets the most space; anything over ten years old compresses hard.' },
      { heading: 'Skills', text: 'A compact section mirroring the advert’s vocabulary — systems, methods, qualifications — in plain text for both the recruiter and the parser.' },
      { heading: 'Education', text: 'Degree and institution, then professional qualifications with bodies and years. School results matter only for graduates; experienced hires can reduce them to one line or omit.' },
    ],
    faqs: [
      { q: 'How long should a UK CV be?', a: 'Two pages maximum for professional roles; one page for graduates and early careers. Academic and medical CVs are the accepted exceptions.' },
      { q: 'Do UK employers use ATS?', a: 'Most medium and large employers do, as do the big job boards’ apply flows. Single-column layouts with standard headings are the safe standard.' },
      { q: 'Should I include my full address?', a: 'Town or city only. Full postal addresses are unnecessary and a needless data exposure.' },
      { q: 'Personal statement or objective?', a: 'A personal statement: two or three lines on who you are, what you do best and what you are targeting — written fresh for each application’s sector.' },
      { q: 'Should I include references on a UK CV?', a: 'No. "References available on request" is the convention; it protects your referees’ details and saves space. Employers ask at offer stage.' },
    ],
  },
  {
    slug: 'india',
    type: 'country',
    title: 'Resume Template for India — Fresher & Experienced (Free)',
    description:
      'Indian resume conventions for freshers and experienced hires: format, declarations, what MNC portals expect. Free templates with PDF/DOCX, no watermark.',
    h1: 'Resume format for India',
    intro: [
      'Indian hiring spans two worlds at once. Campus and fresher hiring still runs on structured biodata-style documents where education detail is the main event, while MNC and startup hiring uses global, software-screened formats where a fresher’s projects and internships do the talking. Knowing which world you are applying to matters more than any single formatting rule.',
      'This page separates the two honestly — what traditional Indian employers expect, what portals and MNCs screen for — and offers templates for both, including an education-first design for freshers.',
    
      'For experienced professionals applying to Indian MNCs and startups, the global rules now apply in full: achievement-led bullets, no declarations, no personal details beyond contact, and a skills section that mirrors the job description’s real vocabulary. Keep the traditional format only for the employers who still ask for it by name.',
    ],
    lookFor: [
      'For freshers: education with institution, university/board, year and score — this is your track record and recruiters read it closely',
      'Internships and projects described like jobs: what you built or did, tools used, outcome',
      'Technical and certification skills named exactly (Java, SQL, Tally, GST) — portal filters are literal',
      'For experienced hires: the global format — achievements with numbers, no personal details beyond contact',
      'A professional email address; the college-era nickname address quietly costs interviews',
    ],
    skills: ['Communication', 'MS Office', 'Tally / GST basics', 'Data entry', 'Programming fundamentals', 'Teamwork', 'Presentation', 'Internet research', 'Hindi & English', 'Documentation', 'Client coordination', 'MS Office suite', 'Internet research', 'Data entry accuracy'],
    templateId: 'fresher-graduate',
    templateWhy:
      'Fresher / Graduate puts education first with room for projects and internships — the structure Indian campus and fresher hiring actually reads — and stays parseable by the portals.',
    mistakes: [
      'The old declaration-and-signature block on an MNC application; it belongs to traditional formats and reads as dated elsewhere',
      'Father’s name, religion and full home address on a modern resume — personal data that portals neither need nor protect well',
      'A ten-row academic table from class 10 onward when you have a degree and projects; keep 10th/12th to one line each once you graduate',
      'Submitting the same resume to government and private employers: the formats genuinely differ — declarations and personal details expected in one are noise in the other. Keep two versions and label the files clearly.',
    ],
    sectionGuide: [
      { heading: 'Education (freshers)', text: 'Degree, institution, university, year and score first — for freshers this section is the resume. Class 10 and 12 compress to one line each once you hold a degree.' },
      { heading: 'Projects & internships', text: 'Written like experience: your role, the tools, what was delivered. For most fresher shortlists this section, not the objective line, decides the interview.' },
      { heading: 'Experience (experienced hires)', text: 'Global format: employer, title, dates, achievement bullets with numbers. Personal details beyond contact information do not belong here for MNC applications.' },
      { heading: 'Skills', text: 'Exact technical vocabulary — languages, frameworks, Tally, GST, tools — because portal filters match literally. Certifications with providers and years strengthen this section materially.' },
    ],
    faqs: [
      { q: 'Should a fresher resume have a photo?', a: 'For most private and MNC hiring, no. Some traditional and government-adjacent applications still expect one — follow the specific application’s instructions when they exist.' },
      { q: 'Is a declaration required on an Indian resume?', a: 'Only in traditional formats and some government applications. For company and portal applications, skip it — your cover email carries the same assurance.' },
      { q: 'How long should a fresher resume be?', a: 'One page. Recruiters for fresher roles process high volumes; a dense, honest single page beats two padded ones.' },
      { q: 'Do Indian job portals use ATS filters?', a: 'Yes — keyword filters on skills, education and experience are standard on the major portals. Exact skill words from the job description, where true, matter.' },
      { q: 'Should I add my photograph for Indian government jobs?', a: 'Follow the specific notification’s instructions — many government applications require a photo as part of the form itself rather than the resume. For private and MNC applications, omit it.' },
      { q: 'How do I explain a preparation gap after graduation?', a: 'Name it plainly in one line — the examination prepared for, the attempt years, and any coaching, freelancing or family-business work alongside. Recruiters in India see thousands of such profiles; a straightforward account reads as maturity, while silence invites assumptions.' },
    ],
  },
  {
    slug: 'ats-resume-guide',
    type: 'guide',
    title: 'How ATS Resume Screening Works — A Plain-Language Guide',
    description:
      'What applicant tracking systems actually do to your resume, what they cannot do, and the formatting rules that genuinely matter. No myths, no keyword stuffing.',
    h1: 'How ATS screening actually works',
    intro: [
      'Few topics in job hunting attract more bad advice than applicant tracking systems. The truth is less dramatic than the myths: an ATS is mostly a database with a parser and a search box. Understanding those three parts tells you exactly which formatting rules matter and which "ATS hacks" are theatre.',
      'This guide explains the pipeline step by step, the checks worth passing, and the limits of any "ATS score" — including the honest checklist built into this resume builder.',
    ],
    sections: [
      {
        heading: 'Step 1: parsing — your resume becomes fields',
        paragraphs: [
          'When you upload a resume, the parser tries to convert it into database fields: name, email, phone, job titles, employers, dates, education, skills. Everything a recruiter later searches or filters lives in those fields. If the parser cannot find your email or merges two jobs into one, no keyword brilliance downstream can rescue the record.',
          'Parsers are good with conventional documents and bad with clever ones. Two-column layouts can interleave text from both columns into nonsense. Tables, text boxes, headers/footers and images of text are frequent failure points. This is why the standard advice — single column, standard headings, real text — exists: it is about field extraction, not aesthetics.',
        ],
      },
      {
        heading: 'Step 2: search and filters — humans asking questions',
        paragraphs: [
          'After parsing, recruiters search the database the way you search email: keywords, job titles, locations, years of experience, must-have skills from the job description. Some employers add knockout questions (licences, work authorisation) in the application form itself — those are not the resume’s job at all.',
          'The practical consequence: the exact words of the profession matter. If the advert says "accounts payable" and your resume says "paying suppliers", a literal search may miss you. Mirroring the posting’s genuine vocabulary — where it truthfully describes your experience — is the one "optimisation" that is both honest and effective.',
        ],
      },
      {
        heading: 'Step 3: ranking — the part nobody can fully know',
        paragraphs: [
          'Some systems rank candidates by keyword overlap or questionnaire scores. The weights are proprietary, differ by employer, and change without notice. Anyone selling a guaranteed score or a 100% match is selling fiction: there is no universal ATS to beat, only individual employers’ configurations.',
          'What you can control: a parseable document, the posting’s true keywords present where honest, measurable achievements a human will reward in the next stage, and applying early while the search pool is small.',
        ],
      },
      {
        heading: 'What to do, concretely',
        paragraphs: [
          'Use standard headings (Experience, Education, Skills). Keep one column for portal applications. Put skills in plain words, spelled as the advert spells them. Include dates in a consistent format. Save as PDF unless DOCX is requested — modern parsers handle both, but PDF preserves exactly what you saw. Never keyword-stuff: repeating terms invisibly or dishonestly fails the human stage and, increasingly, parser-side duplication checks.',
          'Finally, remember the parser is not the employer. A resume that only satisfies software reads terribly to the recruiter who opens it next. The goal is a document both can read — which is what the templates and the checklist in this builder are designed to produce.',
        ],
      },
    ],
    faqs: [
      { q: 'Can a tool tell me my ATS score?', a: 'It can estimate formatting and keyword basics — the checklist here does exactly that, labelled as an estimate. It cannot reproduce a specific employer’s proprietary ranking, and tools claiming otherwise are guessing.' },
      { q: 'PDF or DOCX for ATS?', a: 'Both parse well in modern systems. Follow the portal’s instruction if it gives one; otherwise PDF preserves your layout for the human stage.' },
      { q: 'Do photos break ATS?', a: 'Photos are ignored or stripped by most parsers rather than breaking them — the real cost is the space and the two-column designs that usually accompany them. For portal applications, skip the photo; for human-sent applications in photo-expecting markets, include it.' },
      { q: 'Should I copy the job description into my resume invisibly?', a: 'No. Hidden-text tricks are detectable, read as dishonest, and collapse at interview. Mirror genuine vocabulary in your real bullets instead.' },
    ],
  },
  {
    slug: 'cover-letter-guide',
    type: 'guide',
    title: 'How to Write a Cover Letter That Gets Read — Guide',
    description:
      'A practical cover letter structure: the four paragraphs that matter, tone choices, and what to cut. Includes a free generator that drafts from your resume.',
    h1: 'How to write a cover letter',
    intro: [
      'Most cover letters fail in the first two lines, because they announce that the writer is writing a cover letter. The ones that get read do a different job: they connect this specific employer to this specific applicant with evidence, in about four short paragraphs, and then stop.',
      'This guide gives the structure, the tone decision, and the cuts that make letters shorter and stronger. The builder on this site can draft a starter from your resume’s real facts — the guide explains how to turn that draft into a letter that sounds like you.',
    ],
    sections: [
      {
        heading: 'Paragraph 1: the application, stated plainly',
        paragraphs: [
          'Name the role and where you saw it, then one line on what you currently do that makes you relevant. "I am writing to apply for…" is acceptable but weak; "I am a ward nurse with six years on acute medical wards, applying for the senior staff nurse post" does the same job with information in it.',
          'If you were referred or have a genuine connection to the organisation, this is its place — one clause, no name-dropping theatre.',
        ],
      },
      {
        heading: 'Paragraph 2: your strongest matching evidence',
        paragraphs: [
          'Pick the one or two achievements from your resume closest to this job’s core problem and expand them slightly: context, what you did, the result with its number. This paragraph is why tailored letters beat generic ones — the same achievement framed for a hospital reads differently than for a clinic.',
          'Resist summarising your whole career here. Depth on the relevant beats breadth every time.',
        ],
      },
      {
        heading: 'Paragraph 3: why this employer',
        paragraphs: [
          'The paragraph most applicants skip and most hiring managers weight. Name something specific — a service they run, a value they publish, a change they are going through — and connect it truthfully to your experience or motivation. If the paragraph could be sent unchanged to a competitor, it is not finished.',
          'Keep it short. Two or three sentences of specific beats six of flattery.',
        ],
      },
      {
        heading: 'Paragraph 4: the close, and the tone decision',
        paragraphs: [
          'Close by welcoming an interview, thanking the reader briefly, and signing off in the register you opened with. Formal tones suit law, finance, government and traditional sectors; warm tones suit smaller teams, care, education and creative work; confident tones suit sales and leadership roles. When in doubt, formal-warm — courteous, specific, unadorned — travels everywhere.',
          'Length: one page, roughly 250–400 words. If your letter needs a second page, the problem is selection, not space.',
        
          'One closing discipline: read the letter aloud once. Any sentence you stumble over is a sentence a tired recruiter will skim, and the skim is where good applications quietly end.',
        
          'Finally, resist repeating the resume verbatim: the letter should interpret your best evidence, not duplicate it. If a sentence appears unchanged in both documents, rewrite one — repetition reads as padding to the person deciding your shortlist.',
        ],
      },
    ],
    faqs: [
      { q: 'Do cover letters still matter?', a: 'Where they are requested or optional-but-read — smaller employers, care and education sectors, traditional professions — yes, materially. At high-volume portals they are often skipped; a strong one costs you twenty minutes and can only help where read.' },
      { q: 'Should my cover letter repeat my resume?', a: 'No — it should interpret it. The resume lists; the letter connects two or three of those facts to this employer’s situation.' },
      { q: 'Can I use the same letter for every job?', a: 'The skeleton, yes; the letter, no. Paragraph 3 must change every time, and paragraph 2 should be re-aimed at each posting’s core need.' },
      { q: 'What if I do not know the hiring manager’s name?', a: '"Dear Hiring Manager" or the team name ("Dear ICU Recruitment Team") are both professional. Five minutes of searching the advert and the organisation’s site often finds a name — worth it where formality matters.' },
      { q: 'How long should a cover letter be?', a: 'One page, roughly 250 to 400 words. If it runs long, the fix is selection: cut the second-best achievement and every sentence that could describe any applicant, before touching the type size.' },
    ],
  },
];

// ── Quality gate ─────────────────────────────────────────────────────────────

function wordSetOf(page: SeoPage): Set<string> {
  const text = [
    page.title, page.description, page.h1,
    ...page.intro,
    ...(page.lookFor ?? []),
    ...(page.skills ?? []),
    page.templateWhy ?? '',
    ...(page.mistakes ?? []),
    ...(page.sectionGuide ?? []).flatMap((g) => [g.heading, g.text]),
    ...(page.sections ?? []).flatMap((s) => [s.heading, ...s.paragraphs]),
    ...page.faqs.flatMap((f) => [f.q, f.a]),
  ]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');
  return new Set(text.split(/\s+/).filter((w) => w.length > 2));
}

export interface GateFailure {
  slug: string;
  reasons: string[];
}

/** Evaluate one page; similarity is checked against its siblings. */
export function evaluateSeoPage(page: SeoPage, siblings: SeoPage[]): string[] {
  const reasons: string[] = [];
  const words = wordSetOf(page);
  if (words.size < 300) reasons.push(`only ${words.size} unique content words (minimum 300)`);
  if (page.title.length < 25 || page.title.length > 75) reasons.push('title length outside 25–75 characters');
  if (page.description.length < 110 || page.description.length > 170)
    reasons.push('meta description outside 110–170 characters');
  if (page.intro.length < 2) reasons.push('needs at least two intro paragraphs');
  if (page.faqs.length < 3) reasons.push('needs at least three FAQs');
  if (page.type !== 'guide') {
    if (!page.templateId) reasons.push('role/country pages must recommend a template');
    if ((page.lookFor?.length ?? 0) < 4) reasons.push('needs at least four employer-expectation points');
    if ((page.skills?.length ?? 0) < 6) reasons.push('needs at least six skills');
    if ((page.mistakes?.length ?? 0) < 3) reasons.push('needs at least three mistakes');
  } else if ((page.sections?.length ?? 0) < 4) {
    reasons.push('guides need at least four sections');
  }
  const dupTitle = siblings.find((s) => s.slug !== page.slug && s.title === page.title);
  if (dupTitle) reasons.push(`title duplicates ${dupTitle.slug}`);
  for (const sib of siblings) {
    if (sib.slug === page.slug || sib.type !== page.type) continue;
    const other = wordSetOf(sib);
    const inter = [...words].filter((w) => other.has(w)).length;
    const union = new Set([...words, ...other]).size;
    const similarity = union === 0 ? 0 : inter / union;
    if (similarity > 0.52) reasons.push(`too similar to ${sib.slug} (${similarity.toFixed(2)} > 0.52)`);
  }
  return reasons;
}

export function gateReport(pages: SeoPage[] = SEO_PAGES): GateFailure[] {
  return pages
    .map((page) => ({ slug: page.slug, reasons: evaluateSeoPage(page, pages) }))
    .filter((r) => r.reasons.length > 0);
}

/** Only gate-passing pages become routes and sitemap entries. */
export function publishedSeoPages(): SeoPage[] {
  const failing = new Set(gateReport().map((f) => f.slug));
  return SEO_PAGES.filter((p) => !failing.has(p.slug));
}
