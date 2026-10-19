import type { Article } from '../articles';
import { art } from './helper';

export const batch68: Article[] = [
  art(
    'qr-code-resume-cv',
    'QR Code on Your CV or Resume: Link Recruiters to Your Portfolio and Profile',
    'qr code resume cv portfolio',
    'Add a QR code to your CV to link recruiters to your portfolio, LinkedIn, GitHub, or personal website — setup, placement, and best practices.',
    'Business & Regional',
    '5 min read',
    '2027-05-21',
    `
### Why a QR Code Belongs on a Modern CV

A printed CV has fixed space. A QR code on that CV opens unlimited space: a full portfolio, video introduction, GitHub profile, live project demos, published articles, and anything else that demonstrates your skills. The recruiter who picks up your CV and is intrigued by your background can see your work in 10 seconds.

### What to Link the CV QR To

**Option 1 — Personal portfolio website:**
The strongest choice. A personal site (yourname.dev, yourname.co.uk) showcases work, personality, and professionalism. Recruiters spend more time here than anywhere else.

**Option 2 — LinkedIn profile:**
Simpler to set up, universally recognised. Your LinkedIn URL (\`linkedin.com/in/yourname\`) provides professional history, endorsements, and recommendations.

**Option 3 — A link-in-bio page:**
A single QR links to a landing page with buttons for: LinkedIn, Portfolio, GitHub, CV download, Email. One QR, multiple destinations — useful if your work spans multiple platforms.

**Option 4 — GitHub profile (for developers):**
If your strongest work is in code repositories, link directly to your GitHub. Ensure your profile is polished with a README and pinned repositories.

### CV QR Placement

| CV Format | Recommended Placement |
|---|---|
| A4 printed CV | Top-right corner beside contact details, 15–20mm |
| A4 with header band | Within the header area near name/title |
| Two-column CV | Top of right column, beside contact section |
| Creative/design CV | Integrated into the design layout |

Size: 15–18 mm is sufficient for close-range scanning. Include a label: "Scan to view portfolio" or "Scan for full profile."

### What the Linked Page Should Include

The landing page a recruiter reaches after scanning should answer: "Why should we hire this person?"

- Professional summary (2–3 sentences)
- 3–5 portfolio pieces with descriptions and outcomes
- Links to all relevant professional profiles
- Downloadable PDF version of the CV
- Contact form or email link

Make it mobile-first — recruiters often scan on their phones while reviewing CVs on the commute or in a meeting.

### Keeping the QR Current

Use a dynamic QR or a redirect URL you control. When you update your portfolio, change jobs, or switch platforms, update the redirect destination. The QR on printed CVs you have already distributed continues to work perfectly.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'Will a recruiter actually scan the QR on my CV?',
        answer:
          'Research on recruiter behaviour suggests that intrigued recruiters — those who have read your CV and want to see more — do scan CV QR codes. QRs are less effective as cold attention-grabbers (a recruiter scanning every code on every CV is unlikely). Design the QR as a conversion tool for already-interested recruiters, not as a gimmick to be noticed.',
      },
      {
        question: 'Is a QR code on a CV appropriate for all industries?',
        answer:
          'Yes, though the linked content should match industry expectations. For technical roles (developers, designers, engineers), a GitHub or portfolio QR is expected and impressive. For traditional sectors (law, finance, medicine), link to a polished LinkedIn or personal website rather than a code repository. The QR demonstrates digital literacy in any field — the linked content demonstrates domain expertise.',
      },
      {
        question: 'Should the QR code on my CV link to a private or public portfolio?',
        answer:
          'Public, with appropriate content curation. Remove any client work that is under NDA or that you do not have permission to showcase. Use a "View case study on request" placeholder for protected work. Your public portfolio should represent your best work — do not link to a raw GitHub profile full of abandoned or unfinished projects without curating it first.',
      },
    ]
  ),
  art(
    'qr-code-linkedin-profile-card',
    'QR Code for LinkedIn: Share Your Profile Instantly Without Typing URLs',
    'qr code linkedin profile networking',
    'Create a QR code for your LinkedIn profile to share at networking events, on business cards, and in email signatures.',
    'Business & Regional',
    '4 min read',
    '2027-05-22',
    `
### LinkedIn's Built-In QR vs External Generator

LinkedIn includes a built-in QR code feature accessible in the app (tap your profile photo → QR code). This creates a QR that links to your profile. It is convenient but cannot be printed at high resolution or customised.

For printed materials (business cards, CVs, badges), generate your own QR from your LinkedIn public profile URL:

\`https://www.linkedin.com/in/your-custom-url\`

This generates a scalable, printable QR that you control fully.

### Customising Your LinkedIn URL First

Before creating a QR, customise your LinkedIn URL to something readable:

**Default:** \`linkedin.com/in/firstname-lastname-abc123\`
**Custom:** \`linkedin.com/in/firstnamelastname\`

Go to: LinkedIn profile → Edit public profile & URL → Custom URL. A clean URL makes the QR destination more trustworthy and the text URL readable alongside the QR.

### Where to Place a LinkedIn QR

**Business card (back):**
"Scan to connect on LinkedIn" with a 15–18 mm QR. The most common and effective use.

**Event badge:**
At conferences and networking events, a QR on your badge or name card enables instant profile viewing without the exchange of physical cards.

**Email signature:**
A small QR image in your email signature (hosted as an image in your email client) links to your profile. Useful in email exchanges where the recipient wants to know more about you.

**CV:**
As covered in the previous article — alongside or instead of a portfolio QR.

### LinkedIn QR for Recruiters and Hiring Managers

Hiring managers and recruiters who are hiring for roles can include a LinkedIn QR in job advertisements linking to their LinkedIn profile. Candidates who scan see the recruiter's profile and can connect before applying — building a direct relationship beyond the ATS (Applicant Tracking System) process.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question:
          'Does the LinkedIn QR code require the person scanning to have a LinkedIn account?',
        answer:
          'Without a LinkedIn account, scanning the QR opens the public LinkedIn profile page in a browser — visible to anyone for profiles set to public view. The person can see your photo, headline, and summary without an account. Connecting, messaging, or viewing full experience details requires a LinkedIn account. The QR is accessible to all; full functionality requires login.',
      },
      {
        question: 'Can I use my LinkedIn QR to grow my connections from offline networking events?',
        answer:
          'Yes — this is one of the strongest use cases. Displaying your LinkedIn QR at your networking station or on a placard means anyone who passes can connect with you digitally without exchanging cards. Display it with "Scan to connect" and accept the incoming connection requests same day. The QR reduces the awkwardness of asking for connection details in person.',
      },
      {
        question: 'How do I test a QR code before sharing it?',
        answer:
          'Scan it with at least two different phones, in the lighting where it will be used, and confirm the destination opens correctly. Test the printed size too, since a code that works on screen can fail once printed small.',
      },
    ]
  ),
  art(
    'qr-code-job-seeker-portfolio',
    'QR Code Portfolio for Job Seekers: Showcasing Work Beyond the CV',
    'qr code job seeker portfolio showcase',
    'Build a QR-linked portfolio for job searching — what to include, how to structure it, and how to present it across different industries.',
    'Business & Regional',
    '5 min read',
    '2027-05-23',
    `
### The Portfolio Gap in Traditional Applications

A CV tells an employer what you have done. A portfolio shows them. For creative, technical, and knowledge-worker roles, a QR-linked portfolio on your CV transforms a description of experience into evidence of capability.

### What Belongs in a QR Portfolio

**For developers and engineers:**
- 3–5 projects with descriptions, tech stack, your specific contribution, and a live demo or GitHub link
- Any open-source contributions with measurable impact
- Technical writing, conference talks, or documentation you have authored

**For designers and creatives:**
- Case studies (brief, process, outcome) for 3–5 significant projects
- Before and after comparisons
- Client testimonials or measurable results (increased conversion, awards)
- Process work — showing how you think, not just the final output

**For marketers and strategists:**
- Campaign overviews with results (% increase in reach, conversion, revenue)
- Content samples (articles, copy, social posts)
- Data analysis and reporting examples (anonymised if needed)

**For all professionals:**
- LinkedIn recommendations from managers and colleagues
- Relevant certifications (with verification links)
- Published articles or thought leadership content
- Measurable outcomes from each role

### Structuring the Portfolio Page

Design for a recruiter with 2 minutes:

1. **Headline:** Name + role you are seeking + 1-line value proposition
2. **Highlights:** 3 bullet points of career achievements
3. **Portfolio pieces:** 3–5 items, each with a thumbnail, title, and 2-sentence description
4. **Contact:** Email, LinkedIn, phone

Provide a "Full case study" link per portfolio piece for recruiters who want depth — but keep the landing page light so those with less time still get the key message.

### Free Tools for Building a Portfolio Page

- **Notion:** Shareable public page, well-suited for professional portfolios
- **Google Sites:** Free, hosted on Google, accessible publicly
- **Carrd.co:** Single-page websites for professionals, free tier available
- **Adobe Portfolio:** Free with Creative Cloud subscription
- **GitHub Pages:** Free hosting for developer portfolios (HTML/CSS/Jekyll)
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'How long should each portfolio case study be on a QR-linked portfolio page?',
        answer:
          "Aim for 200–400 words per case study with visuals. The structure: context (what was the challenge?), contribution (what did you specifically do?), outcome (what measurably changed?). This format respects a recruiter's time while providing enough depth to evaluate relevance. Longer case studies can be offered as downloadable PDFs linked from the page.",
      },
      {
        question: 'What if I cannot share client work publicly due to confidentiality?',
        answer:
          'Include the project with enough context to be meaningful, without proprietary details. For example: "Redesigned the onboarding flow for a fintech client with 50,000+ users — resulted in a 32% improvement in completion rate." Metrics and structure can usually be shared; proprietary data and client names can be withheld. Offer "Full case study available under NDA on request" for particularly sensitive work.',
      },
      {
        question: 'Can a QR portfolio work for a first-time job seeker with no work history?',
        answer:
          'Yes — include university projects, freelance work, personal projects, volunteer contributions, and any speculative work (a mock campaign brief, a redesign concept, a personal code project). Recruiters for entry-level roles understand that university-leavers have limited paid experience. A thoughtfully curated student portfolio is significantly more impressive than no portfolio at all.',
      },
    ]
  ),
  art(
    'qr-code-business-card-job-search',
    'QR Codes on Business Cards for Job Seekers: Networking That Works',
    'qr code business card job search networking',
    'Design a job seeker business card with a QR code — what to include, where to hand it out, and how it improves networking outcomes.',
    'Business & Regional',
    '4 min read',
    '2027-05-24',
    `
### Why Job Seekers Should Have Business Cards

Job seekers often think business cards are only for employed professionals. In fact, a job seeker's business card — with a clear role description, contact details, and QR code — is one of the most effective networking tools available. It signals professionalism, leaves a physical reminder, and provides instant access to your full profile.

### Job Seeker Business Card Design

**Front of card:**
- Your name (prominent)
- Target role title: "Frontend Developer" / "Marketing Manager" / "UX Designer"
- Email address
- Phone number
- LinkedIn URL (short custom URL)

**Back of card:**
- QR code (20–22 mm) with label "Scan to view my portfolio / connect on LinkedIn"
- Optionally: 1-sentence value proposition ("5 years in product design — I make complex things simple")

### Where to Distribute Job Seeker Cards

**Networking events:** Industry meetups, professional society events, alumni events. Hand the card proactively after conversations — "Here's my card, I'd love to stay in touch."

**Career fairs:** Keep a stack of 50–100 cards. Hand to every recruiter who shows interest.

**Coffee meetings:** When someone offers to make introductions, have a card ready. It is far more memorable than exchanging LinkedIn handles on the spot.

**Industry conferences:** Attendee networking is high-value. Your card at a conference distinguishes you from the digital-only majority.

### The Follow-Up

After distributing cards, connect on LinkedIn with a personalised note: "Great to meet you at [event] — I mentioned I'm looking for [role] opportunities." This converts the card exchange into a digital connection before the memory fades.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
- The [blog](/blog) collects more guides on sizing, printing, security, and payments for QR codes.
`,
    [
      {
        question: 'Should a job seeker business card say "unemployed" or their current status?',
        answer:
          'No. Include your target role title and key skills, not your employment status. "Frontend Developer" is your professional identity. Your current employment situation is not relevant on the card. If directly asked, explain you are actively seeking new opportunities — but the card itself is a professional presentation tool, not a disclosure document.',
      },
      {
        question: 'How many job seeker business cards should I print?',
        answer:
          'Print 100–200 for an active search period. This typically costs under £20 from UK online printers (Vistaprint, Moo, Printed.com). Reprint when details change (new phone number, updated portfolio URL). Since the QR uses a dynamic redirect, your portfolio can be updated without reprinting.',
      },
      {
        question: 'What size should a printed QR code be?',
        answer:
          'Size depends on scan distance and module count. As a starting point, keep the printed code at least as wide as the distance-to-scan ratio your generator recommends, then test a print at full size before ordering a full run.',
      },
    ]
  ),
  art(
    'qr-code-professional-profile',
    'QR Code Professional Profile: Build a Scannable Personal Brand Hub',
    'qr code professional profile personal brand',
    'Create a QR-linked professional profile page that centralises your career story, achievements, and contact details for networking and job seeking.',
    'Business & Regional',
    '5 min read',
    '2027-05-25',
    `
### The Professional Profile Page Concept

A professional profile page is a personal website that focuses specifically on your professional identity — not a general personal site with everything, but a curated career hub. This page is the destination for your QR code across all professional materials.

### What a Professional Profile Page Should Include

**Header section:**
- Professional headshot (high quality)
- Name and professional title
- 1–2 sentence professional summary
- Location and open-to-work status
- Key contact options (email, LinkedIn, phone)

**Career highlights:**
- 3–5 bullet-point career achievements with metrics
- Industries and sectors worked in
- Core skills (not a generic list — specific, demonstrated skills)

**Portfolio / evidence:**
- 3–5 project highlights with outcomes
- Publications, talks, or articles
- Certifications with verification links

**Social proof:**
- 2–3 LinkedIn recommendations (with permission to display)
- Client or colleague testimonials
- Media mentions or award references

**Contact section:**
- Direct email link
- Calendly or booking link for informational meetings
- LinkedIn connection button

### Building the Page

**No-code options:**
- **About.me:** Designed specifically for professional profile pages
- **Carrd.co:** Simple, beautiful single-page sites
- **Notion:** Publish a page publicly from your workspace
- **LinkedIn Creator Mode:** Your LinkedIn profile itself can serve as the hub

**Low-cost hosted options:**
- **yourname.com** with a simple theme (Squarespace, Framer, or WordPress)

### The QR Code for Your Profile

Generate a QR from your profile URL. Use this QR across:

- CV / resume
- Business cards
- Email signature
- Conference badges
- Social media bio links

A single professional URL and QR that you maintain as your authoritative career presence simplifies all professional networking and application contexts.
    

### Putting this into practice

Start with the smallest real test you can run. Generate the code, print it at the exact size you plan to use, and scan it with two different phones in the lighting where it will live. Check that the destination page loads quickly on a mobile connection and that the call to action next to the code tells people what they will get. If anything feels slow or unclear, fix it before you print a full batch, because reprints cost more than a short test. Keep a note of the size, material, and placement that worked so the next batch starts from a proven setup.

### Common mistakes to avoid

The most common mistakes are easy to avoid once you know them. Long payloads make modules tiny, low contrast makes edges hard to read, and text placed too close to the border eats the quiet zone the scanner needs. Covering a corner finder pattern with a logo or a sticker breaks detection entirely, and a code placed behind glare or on a curved surface fails even when the print is perfect. Review each of these points on a proof copy, and treat any failure as a reason to adjust the design rather than a reason to blame the scanner.

### Quick checklist

- Keep the payload as short as practical so modules stay large.
- Keep dark modules on a light background with strong contrast.
- Leave a clear quiet zone on all four sides of the symbol.
- Test the printed code at the real viewing distance and lighting.
- Confirm the destination page loads fast on a phone.
- Recheck the code after any change to the link, design, or placement.

### Related tools and guides

- For local payments, the [Pakistan payment QR](/pakistan-payment-qr) page explains the regional flow and what customers see.
- The [regional payment QR](/regional-payment-qr) guide covers payment codes used across different markets.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [scan guide](/scan-guide) explains how phone cameras find and decode a code.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Should a professional profile page be public or gated behind a login?',
        answer:
          'Public. A gated profile defeats the purpose — recruiters and contacts who scan your QR expect immediate access to your information. Keep personally sensitive details (full home address, personal phone) off the public page, using a contact form instead. Your professional experience, portfolio, and career highlights should be freely accessible to anyone who scans.',
      },
      {
        question: 'How often should I update my professional profile page?',
        answer:
          'Update it whenever something material changes: a new role, a significant project completion, a new certification, a published piece of work. Quarterly review is good practice. Keep the "currently available" or "open to opportunities" status current — an outdated status misleads recruiters who scan your QR from old materials.',
      },
      {
        question:
          'Can a professional profile page help with freelance client acquisition as well as job seeking?',
        answer:
          'Yes and it is often more effective for freelancers than job seekers. A freelance profile page replaces the traditional agency portfolio for solo practitioners. Include services, pricing guidance (or "from" rates), client case studies, and a direct booking or enquiry mechanism. QR codes on your business card and in your email signature convert warm contacts into enquiries efficiently.',
      },
    ]
  ),
];
