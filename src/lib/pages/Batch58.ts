import type { Article } from '../articles';
import { art } from './helper';

export const batch58: Article[] = [
  art(
    'qr-code-charity-donation',
    'QR Code Donation Links for Charities: Set Up, Promote, and Track Giving',
    'qr code charity donation link',
    'How charities can use QR codes to accept donations — platforms, print placement, Gift Aid capture, and tracking campaign performance.',
    'Business & Regional',
    '5 min read',
    '2027-04-01',
    `
### Why QR Codes Work for Charity Donations

A QR code at a charity event, on a collection tin, or in a printed appeal converts impulse generosity into instant action. Without a QR, the impulse to give passes before the donor finds the donation page. With a QR, the gap between intention and action is two seconds.

### Donation Platform Selection

Choose a platform that supports QR-linked donation pages:

| Platform | Best For | Transaction Fee |
|---|---|---|
| JustGiving | UK charity fundraising | 1.9% + 20p |
| Donorbox | Mid-size charities, recurring giving | 1.5% platform fee |
| PayPal Giving Fund | Zero platform fees via PayPal | 0% platform fee |
| Stripe + custom page | Full control, lower fees at scale | 1.4% + 20p (EU) |
| CAF Donate | UK registered charities | Small setup fee |

**Gift Aid:** Ensure your chosen platform captures Gift Aid declarations for UK donors. Gift Aid adds 25p per £1 donated at no cost to the donor — it is a legal requirement to capture this correctly.

### Creating the Donation QR

1. Set up your donation page on your chosen platform
2. Configure the campaign: name, target, description, donation amounts
3. Copy the donation page URL
4. Generate a static QR (the donation page URL is stable)
5. Test the QR on multiple devices — ensure it loads the donation page directly, not a login screen

For recurring campaigns (annual appeal), use a dynamic QR so you can update the destination for each campaign year without reprinting materials.

### Print Placement Strategy

| Placement | Context | Expected Conversion |
|---|---|---|
| Collection bucket insert card | In-person giving moment | High — immediate intent |
| Event programme | Audience during event | Medium — requires phone out |
| Direct mail appeal | Reader at home | Medium — convenient timing |
| Poster in charity shop | Browsing customer | Low — lower intent |
| Window cling | Passing foot traffic | Low — distance, no intent signal |

### Tracking Donation Campaign Performance

Use UTM parameters on the donation page URL per campaign source:

- \`utm_source=collection-bucket\` for bucket inserts
- \`utm_source=direct-mail-appeal\` for letters
- \`utm_source=event-programme\` for events

In Google Analytics 4, view sessions by UTM source to see which channel drives the most donation page visits. Compare with your donation platform data to see conversion rate per channel.

### Post-Donation QR Experience

After donating, the confirmation page should include:

- QR or link to share the campaign on social media
- Impact statement ("Your £25 provides school meals for one child for a month")
- Invitation to set up a Direct Debit for regular giving
- Tax relief information (Gift Aid)
    

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
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'Do QR code donations qualify for Gift Aid in the UK?',
        answer:
          "Yes, if the donation platform captures a Gift Aid declaration during the checkout flow. The platform collects the donor's name, UK address, and confirmation that they are a UK taxpayer. The charity then claims Gift Aid from HMRC. The QR itself is simply the access mechanism — it does not affect Gift Aid eligibility.",
      },
      {
        question: 'Can a charity use a QR code on a collection tin for cash alternatives?',
        answer:
          'Yes, and this is increasingly common as cash carrying declines. A QR on the collection tin offers a card/digital payment alternative for donors who carry no cash. Position it at eye level on the tin with a clear message: "Prefer to pay by card? Scan here." This captures donations from donors who would otherwise walk past.',
      },
      {
        question:
          'What is the minimum donation that makes a QR donation worthwhile given platform fees?',
        answer:
          'Platform fees typically take 1.5–2% plus a fixed charge per transaction. For most platforms, donations above £2 are cost-positive after fees. For very small donations (50p, £1), some fixed fees make the net receipt negligible. Design suggested donation amounts on the QR landing page to guide donors towards meaningful amounts — £5, £10, £20 are effective anchor points.',
      },
    ]
  ),
  art(
    'qr-code-volunteer-signup',
    'QR Code Volunteer Sign-Up for Charities: From Event Booth to Online Registration',
    'qr code volunteer sign up charity',
    'Use QR codes to streamline charity volunteer registration — event booth sign-ups, skills capture, vetting, and onboarding via QR links.',
    'Business & Regional',
    '4 min read',
    '2027-04-02',
    `
### Turning Interest Into Sign-Ups Instantly

Volunteer recruitment often relies on leaflets, web forms, and word of mouth — channels with significant drop-off between interest and registration. A QR code at the moment of interest (a charity stall, an event, a printed appeal) shortens the path to sign-up dramatically.

### QR Volunteer Registration Flow

**Destination page contents:**

1. A brief "Why volunteer with us?" statement (2–3 sentences)
2. Current volunteering opportunities with brief descriptions
3. Time commitment guide (2 hours per week, one Saturday per month, etc.)
4. Registration form: name, email, phone, availability, skills
5. DBS check explanation (if applicable)
6. Confirmation: what happens next

Keep the form under 2 minutes to complete. Long forms at the point of initial interest lose registrants — capture essentials now, gather more detail later.

### Event Booth Implementation

At charity events, fairs, and fundraising activities:

- Display a large QR on the table with "Sign up to volunteer — takes 2 minutes"
- Have a tablet available for those who cannot scan (older volunteers, damaged phone screens)
- Collect paper sign-up sheets as a backup
- Staff member verbally offers the QR: "You can sign up right now — just scan that code"

### Skills-Based Volunteer Matching

Include a skills tick-list in the registration form (accessible via QR):

- IT/Digital
- Driving (own vehicle)
- Languages spoken
- Medical/First Aid
- Teaching/training
- Manual labour
- Administration
- Creative/design

Matching volunteers to relevant roles via skills data (collected at QR sign-up) increases volunteer engagement and retention vs generic placement.

### GDPR Considerations for Volunteer Data

Volunteers' personal data requires the same careful handling as donor data:

- Collect only what you need for the stated purpose
- Include a privacy notice link on the registration form
- Capture explicit consent for marketing communications (newsletter, future volunteer calls)
- Store data securely and review retention periods annually
    

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
        question: 'Can QR codes help with ongoing volunteer scheduling after initial sign-up?',
        answer:
          'Yes. Once volunteers are registered, send a QR-linked monthly availability form where they indicate which upcoming shifts they can cover. This is easier than email-based scheduling and feeds into a simple rota management system. Tools like When I Work, TeamUp, or a Google Sheet with automated reminders work well for small charities.',
      },
      {
        question:
          'How do we track which recruitment channels bring in the most volunteer sign-ups?',
        answer:
          'Create unique QR codes per channel — one for event booths, one for posters, one for leaflets. Each links to the same registration form but with a different UTM source parameter in the URL. Compare sign-up volume and quality (completion rate, engagement) by source to focus recruitment effort on the most productive channels.',
      },
      {
        question: 'Should event QR codes be printed or shown on a screen?',
        answer:
          'Use printed codes for signage and tickets that guests keep, and screens for codes that change, such as live schedules. Test screen codes under event lighting, since glare can block scans.',
      },
    ]
  ),
  art(
    'qr-code-nonprofit-fundraising',
    'QR Codes for Nonprofit Fundraising Campaigns: Strategy and Execution',
    'qr code nonprofit fundraising campaign',
    'A complete guide to using QR codes in nonprofit fundraising — from campaign planning to donor journey design and results measurement.',
    'Business & Regional',
    '5 min read',
    '2027-04-03',
    `
### QR Codes in the Fundraising Toolkit

QR codes sit alongside direct mail, digital advertising, and events in the nonprofit fundraising toolkit. Their advantage: they bridge physical materials (letters, banners, collection tins) to digital donation and engagement flows. Used well, they reduce friction and increase conversion at every touchpoint.

### Campaign Planning with QR in Mind

Before designing materials, answer:

1. **What action do we want donors to take?** (Donate, volunteer, share, attend)
2. **Where will the QR appear?** (Letter, poster, event, social)
3. **What is the destination?** (Donation page, impact page, event booking)
4. **How will we track performance?** (UTM parameters, redirect analytics)
5. **What is the contingency if the destination URL changes?** (Dynamic QR if needed)

Map each material to a specific QR destination and tracking URL before print production begins.

### Donor Journey Design

**Awareness → Interest → Action → Loyalty**

| Stage | QR Role | Destination |
|---|---|---|
| Awareness | Poster, outdoor | Impact video or key facts page |
| Interest | Direct mail | Personalised campaign page |
| Action | Event / collection point | Donation form |
| Loyalty | Thank you card | Regular giving sign-up |

Each QR in the journey should match the donor's current stage. A poster QR that goes directly to a donation form skips the awareness and interest stages — appropriate for warm audiences, too aggressive for cold ones.

### Major Donor QR Applications

For high-value donors (£1,000+), QR codes can link to:

- Personalised impact reports showing their specific contribution's effect
- Exclusive briefing documents or research papers
- Private event booking pages
- One-click pledge forms for capital campaigns

A personalised QR in a major donor impact report shows sophistication and demonstrates that the charity uses technology effectively — increasing donor confidence.

### Measuring Fundraising QR Performance

| Metric | What It Measures |
|---|---|
| QR scan count | Awareness (how many scanned) |
| Landing page sessions | Interest (how many engaged) |
| Donation page views | Intent (how many considered donating) |
| Completed donations | Conversion (how many donated) |
| Average donation value | Quality (how much per donor) |
| Cost per donation | Efficiency (campaign cost ÷ donations) |
    

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
        question: 'Are QR codes more effective in direct mail appeals than standard URLs?',
        answer:
          'Yes for most demographics. QR codes reduce the friction of typing a long URL — especially for mobile-first donors who prefer scanning to typing. Include both the QR and a short typed URL for maximum accessibility. Charities report 15–35% higher response rates on direct mail pieces that include a QR alongside the URL compared to URL only.',
      },
      {
        question: 'Should each fundraising campaign have its own dedicated QR code?',
        answer:
          'Yes. A unique QR per campaign (or per channel within a campaign) enables accurate attribution. If you use one QR code for all campaigns, you cannot tell which campaign drove which donations. Separate QR codes per campaign, per material type, and per distribution channel provide the granularity needed for proper fundraising analytics.',
      },
      {
        question: 'How do I test a QR code before sharing it?',
        answer:
          'Scan it with at least two different phones, in the lighting where it will be used, and confirm the destination opens correctly. Test the printed size too, since a code that works on screen can fail once printed small.',
      },
    ]
  ),
  art(
    'qr-code-charity-impact-report',
    'QR Codes in Charity Impact Reports: Linking Donors to Live Evidence',
    'qr code charity impact report donor',
    'Use QR codes in printed and digital impact reports to link donors to supporting evidence, video testimonials, and programme updates.',
    'Business & Regional',
    '4 min read',
    '2027-04-04',
    `
### The Limits of Printed Impact Reports

A printed impact report captures a moment in time. By the time it is printed and distributed, some statistics have changed, new stories have emerged, and the programme has progressed. QR codes within the impact report link donors to live, updated versions of each story.

### Strategic QR Placement in Impact Reports

**Statistical panels:**
A QR alongside a key statistic ("We delivered 1,200 meals last quarter") links to a live dashboard or updated page showing current data. Donors see the most recent figures, not last quarter's print.

**Case study pages:**
A QR links to a video testimonial from the beneficiary described in print. The personal, visual story that print cannot fully convey becomes accessible.

**Programme update section:**
A QR links to a web page with the latest programme news since the report was printed. Donors who receive the report months after printing see current progress.

**Further reading:**
QRs link to research papers, external evaluations, and third-party evidence supporting the charity's claims. This builds credibility and demonstrates transparency.

### Creating a Video Testimonial Library

A library of video testimonials accessible via QR in the impact report adds powerful emotional depth. Production guidance:

- 60–90 seconds per testimonial video
- Beneficiary speaks in their own words about specific impact
- Filmed with consent (full written consent, stored against the video record)
- Hosted on YouTube (unlisted, QR linked) or Vimeo
- Subtitled for accessibility

### Donor-Specific Impact QRs

For major donors, generate a personalised QR in the impact report that links to a page showing their specific contribution's impact:

"Your donation of £5,000 funded the training of 12 teachers in Term 1. Here is their story."

This level of personalisation increases retention of high-value donors significantly — they feel the direct connection between their giving and real-world change.
    

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
        question: 'How do we handle consent for using beneficiary stories and QR-linked videos?',
        answer:
          'Obtain explicit written consent before filming, naming, or linking to any beneficiary content. The consent should specify: the purpose (fundraising communications, impact reports), the formats (print, video, digital), the distribution channels, and the duration. Retain consent records securely. For vulnerable adults or children, follow enhanced consent procedures and involve a welfare officer.',
      },
      {
        question:
          'Can QR codes in impact reports drive additional donations beyond the report itself?',
        answer:
          'Yes. Include a "Donate" QR on the back page of the impact report or on each case study page. Donors reading an impactful story are at their highest motivation point. A QR linking directly to the donation page at that moment captures giving intent that would otherwise be lost before the donor reaches a computer.',
      },
      {
        question: 'How do I test a QR code before sharing it?',
        answer:
          'Scan it with at least two different phones, in the lighting where it will be used, and confirm the destination opens correctly. Test the printed size too, since a code that works on screen can fail once printed small.',
      },
    ]
  ),
  art(
    'qr-code-donation-campaign',
    'Running a QR Code Donation Campaign: A Step-by-Step Playbook',
    'qr code donation campaign step by step',
    'Plan, execute, and measure a QR code donation campaign — from goal setting and material design to launch, monitoring, and reporting.',
    'Business & Regional',
    '5 min read',
    '2027-04-05',
    `
### Campaign Planning Phase (4–6 Weeks Before Launch)

**Define the goal:**
- Fundraising target (£10,000 by [date])
- Number of new donors (200 first-time donors)
- Donor reactivation (50 lapsed donors)

**Define the audience:**
- Existing donors (warm audience, direct mail QR)
- Event attendees (contextual, high-intent audience)
- General public (cold audience, poster/outdoor QR)

**Define the channels:**
Map each audience to their primary channel (direct mail, event, social). Each channel gets its own QR code.

### Material Design Phase (3–4 Weeks Before)

- Design donation page on chosen platform
- Add UTM parameters to the page URL per channel
- Generate one dynamic QR per channel
- Design materials incorporating the QR with clear CTA text
- Print review: test-scan all QR codes on printed proofs

Common error: generating QR codes before the destination URL is finalised, then updating the URL but forgetting to regenerate static QR codes.

**Solution:** Always use dynamic QR codes for campaigns so destination URLs can be updated post-print if needed.

### Launch Phase

- Deploy materials to all channels simultaneously
- Monitor scan counts on Day 1 (expected spike)
- Check donation platform for conversion data
- Alert team if any QR is generating scans but zero donations (landing page issue)

### Mid-Campaign Optimisation

At the campaign midpoint:

1. Check scan count by channel — are all QRs getting scans?
2. Check donation conversion rate by channel — which is converting best?
3. If one channel has high scans but low conversion: review the landing page for that traffic source
4. If one channel has low scans: consider QR visibility (too small, poor CTA, wrong placement)

### Reporting and Learning

Post-campaign report should capture:

| Metric | Channel A | Channel B | Channel C |
|---|---|---|---|
| Print run / distribution | | | |
| QR scans | | | |
| Landing page sessions | | | |
| Donations | | | |
| Total raised | | | |
| Cost per donation | | | |

This data feeds the next campaign's planning — allocating budget to the highest-performing channels.
    

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
- The [UPI QR code generator](/upi-qr-code-generator) builds payment codes for UPI-based transfers.
- The [bulk generator](/bulk-generator) builds many codes from a table when one-off generation would take too long.
- Test every code with the [QR scanner](/qr-scanner) on more than one phone before you publish or print it.
- The [UTM builder](/utm-builder) adds campaign parameters so scans show up separately in your analytics.
`,
    [
      {
        question: 'How long should a QR donation campaign run to get meaningful data?',
        answer:
          'A minimum of 4 weeks provides enough data for analysis. Direct mail campaigns peak in scans within the first 2 weeks of delivery. Event-based QR codes produce their scans on the event day. Poster and outdoor campaigns need 4–8 weeks to accumulate meaningful data as they rely on repeated exposure over time.',
      },
      {
        question: 'What should we do if our QR donation campaign underperforms?',
        answer:
          'Diagnose the bottleneck. Check scan count first — if low, the issue is visibility or placement. If scans are good but donations are low, the issue is the landing page or the ask itself. Fix the most probable cause and test the updated version with a small additional run before adjusting the entire campaign. Document findings for future planning.',
      },
      {
        question:
          'Can QR donation codes be used at third-party events the charity does not organise?',
        answer:
          'Yes. Supply partner event organisers with printed materials (table cards, programme inserts) containing your donation QR. Ensure the QR links to your official donation page, not a temporary landing page that could expire. Brief the event team on the QR and its purpose so they can encourage guests to scan during relevant moments.',
      },
    ]
  ),
];
