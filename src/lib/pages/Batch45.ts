import type { Article } from '../articles';
import { art } from './helper';

export const batch45: Article[] = [
  art(
    'qr-code-for-sports-equipment',
    'QR Codes on Sports Equipment: Authenticity, Fitting Guides, and Warranty Registration',
    'qr code sports equipment authenticity fitting warranty',
    'Use QR codes on sports equipment for anti-counterfeiting, personalised fitting guides, warranty registration, and performance tracking.',
    'Business & Regional',
    '4 min read',
    '2027-01-01',
    `
### 1. Anti-Counterfeiting Authentication QR

A QR on the equipment links to the brand's authentication page. First-scan detection records that the unit has been verified — a second scan flags as a possible counterfeit or resale item. For premium sports equipment (golf clubs, performance footwear, rackets), counterfeiting is a significant revenue and safety concern.

### 2. Personalised Fitting Guide QR

A QR on the product links to the fitting guide: measurement instructions, size charts, and a recommendation engine. For footwear and wearable equipment, a QR-guided fitting process reduces returns and improves performance outcomes — a well-fitted product performs better and the athlete is more satisfied.

### 3. Warranty Registration QR

A QR pre-fills the warranty registration with the product's serial number and model. The customer adds their details and purchase date. Registration data enables the brand to contact owners during a recall or safety notice and builds a first-party customer database.

### 4. Maintenance and Care QR

A QR on the equipment links to the maintenance guide: cleaning procedures, storage recommendations, inspection points, and service intervals. Well-maintained equipment lasts longer — brands that help customers maintain their purchase extend satisfaction and reduce returns.

### 5. Performance Data Integration QR

For smart sports equipment (connected sensors, smart balls, wearable monitors), a QR links to the platform for syncing and reviewing performance data. The QR is the most reliable cross-platform entry point for connecting physical equipment to its digital ecosystem.
    `,
    [
      {
        question: 'Can a QR authentication check be beaten by counterfeiters?',
        answer:
          'A static QR can be copied. Cryptographic QR schemes (NTAG424 NFC hybrid, or one-time-use tokens) are significantly harder to counterfeit. For very high-value equipment, NFC with a cryptographic chip is more robust than QR alone.',
      },
      {
        question:
          'Should sports equipment QR codes be placed where they will be exposed to sweat and outdoor conditions?',
        answer:
          'No. Place QRs in protected locations: inside the tongue of footwear, inside the shaft of a racket, or on the inside of a carry bag pocket. Outdoor-exposed QRs must use weatherproof materials and UV-resistant printing.',
      },
    ]
  ),
  art(
    'qr-code-for-supermarkets',
    'QR Codes in Supermarkets: Smart Shopping, Price Matching, and Product Transparency',
    'qr code supermarket smart shopping price match transparency',
    'Use QR codes in supermarkets for recipe inspiration, nutritional detail, price comparison, and supply chain transparency.',
    'Business & Regional',
    '5 min read',
    '2027-01-02',
    `
### 1. Recipe Inspiration QR on Shelf Edge

A QR on the shelf edge next to a key ingredient links to recipe ideas using that ingredient. Retailers who implement recipe QRs on fresh produce and key pantry staples report a 6–12% increase in multi-item basket size for shoppers who scan. The QR converts a single-item purchase decision into a recipe-driven shop.

### 2. Nutritional Detail QR

A QR on the shelf edge or product links to the full nutritional profile beyond the mandatory label: glycaemic load, micronutrient breakdown, ingredient origin, and processing method. Increasingly required by health-conscious consumers who want more than front-of-pack traffic light labels.

### 3. Own Brand Supply Chain Transparency QR

A QR on the supermarket's own-brand products links to the supply chain story: UK farmer suppliers, factory location, sustainability commitments, and quality assurance process. Consumer trust in own-brand products is built on transparency — a QR is the most scalable way to deliver it at the product level.

### 4. Price Match and Offer QR

A QR on the price card links to the price match guarantee page and current promotional offers for that product. Combines the shopper's in-store intent with price confidence — reducing the "let me check online first" abandon behaviour.

### 5. Special Dietary Filter QR

A QR at the entrance to the free-from, vegan, or kosher aisle links to the store's online shopping filtered by that dietary category. Shoppers new to a dietary requirement get a comprehensive product list; habitual shoppers discover new products in their category.
    `,
    [
      {
        question: 'Are QR codes on supermarket shelf edges effective for most shoppers?',
        answer:
          'Scan rates are higher in premium and health food sections where shoppers are more research-oriented. Mainstream FMCG shelf edges show lower scan rates (1–3%) but high volume. Recipe and nutritional detail QRs consistently outperform generic "learn more" QRs.',
      },
      {
        question: 'Who manages the content behind supermarket shelf-edge QR codes?',
        answer:
          'Typically a joint responsibility: the retailer manages the placement infrastructure (shelf labels, retailer app integration), and the supplier provides the product-specific content. Contractual clarity on content responsibility prevents broken or outdated links at scale.',
      },
    ]
  ),
  art(
    'qr-code-for-banking-atms',
    'QR Codes on ATMs: Cashless Transactions, Cardless Withdrawals, and Fraud Prevention',
    'qr code atm cashless withdrawal fraud prevention',
    'Use QR codes on ATMs for cardless cash withdrawals, mobile banking app connections, and security alerts.',
    'Business & Regional',
    '5 min read',
    '2027-01-03',
    `
### 1. Cardless QR Withdrawal

Several major banks now offer cardless ATM withdrawal via QR. The customer:
1. Initiates the withdrawal in the banking app, specifying the amount.
2. Approaches the ATM, which displays a QR.
3. Scans the QR with the banking app — the app authenticates and authorises.
4. Cash is dispensed without a physical card.

This eliminates card skimming at ATMs and allows withdrawals on behalf of others (parents sending children cash) without sharing the card.

### 2. Mobile Banking App Connection QR

A QR on the ATM screen or the ATM fascia links to the bank's mobile app on the appropriate app store. A QR on an ATM reaches customers at a banking touchpoint with high intent — a significantly better acquisition context than a generic app store listing.

### 3. QR Fraud Alert Scan

Banks in some markets offer an ATM safety checker: scan a QR to report suspicious ATM devices (card skimmers, pin-hole cameras) directly to the fraud team. The QR is on the ATM fascia and the report includes the ATM ID from the QR, so the fraud team knows exactly which terminal has been flagged.

### 4. Receipt QR for Instant Support

A QR on the ATM receipt links to: balance check, transaction query, report a problem with this transaction, and the fraud reporting hotline. Converts the paper receipt (low-value traditional channel) into a high-intent customer service touchpoint.

### 5. ATM Availability QR

A QR on an out-of-service ATM links to the nearest alternative ATMs on a live map and the bank's ATM availability service status. Customers who arrive at a non-functional ATM are guided immediately to an alternative rather than leaving frustrated.
    `,
    [
      {
        question: 'Is cardless QR ATM withdrawal secure?',
        answer:
          'Yes, when implemented correctly. The withdrawal requires authentication in the banking app (biometrics or PIN) and a time-limited QR session (typically 2–3 minutes). The security is at least equivalent to card-based withdrawal and removes card skimming risk.',
      },
      {
        question: 'Can I use a cardless QR withdrawal to send cash to a family member?',
        answer:
          'Some banks support "share cash" functionality: generate a withdrawal QR in your app and share the code with a family member who scans it at the ATM. The amount is debited from your account; the cash is collected by them. Check your specific bank\'s cardless withdrawal product features.',
      },
    ]
  ),
  art(
    'qr-code-for-crowdfunding',
    'QR Codes for Crowdfunding Campaigns: Physical Amplification and Backer Conversion',
    'qr code crowdfunding campaign backer conversion',
    'Amplify crowdfunding campaigns with QR codes on physical materials, PR mailers, and events to convert offline audiences to online backers.',
    'Business & Regional',
    '4 min read',
    '2027-01-04',
    `
### 1. Physical-to-Digital Backer Conversion

Crowdfunding campaigns live and die by launch momentum. Physical QR materials give campaigns reach beyond social media:

- QR on flyers distributed at maker markets, indie retail, and community events.
- QR on PR mailers sent to journalists and influencers.
- QR on the prototype or product shown at demo events.
- QR on posters in partner stores and spaces.

Each of these physical touchpoints reaches an audience that the campaign's social media may never reach organically.

### 2. Campaign Page QR

The QR encodes the campaign URL on Kickstarter, Indiegogo, or a direct crowdfunding platform. Include UTM parameters (\`utm_source=flyer-london\`) so the platform analytics show which physical placements are converting backers.

### 3. Early Backer Incentive QR

A QR on event materials links to a special early-backer page with a limited-time discount or exclusive tier not publicly listed on the campaign page. Urgency and exclusivity for in-person audiences drive immediate conversion.

### 4. Update and Momentum QR

A QR in campaign updates and backer communications links to the social media feed for the campaign. Backers who are already invested promote the campaign — making it easy to share the campaign QR to their own networks.

### 5. Fulfilment and Progress QR

A QR in backer update emails links to the fulfilment progress page: current production stage, estimated delivery date, and quality photos. Backers who are kept informed with regular QR-linked updates have significantly lower refund request rates.
    `,
    [
      {
        question:
          "Should a crowdfunding campaign QR link to the platform page or to the creator's own website?",
        answer:
          'Directly to the campaign page on the crowdfunding platform — it has the backing mechanics, social proof (backer count and amount raised), and the "back this project" CTA already built in. An intermediate website page adds a step and reduces conversion.',
      },
      {
        question:
          'Can a QR code on a product prototype at a live demo event drive significant backer numbers?',
        answer:
          'Yes. Live demo QRs convert at among the highest rates of any channel — the prospect has just experienced the product in person, which is the strongest possible social proof. Always have the QR prominently available at the moment of demonstration.',
      },
    ]
  ),
  art(
    'qr-code-for-stickers-and-streetwear',
    'QR Codes on Stickers and Streetwear: Drops, Communities, and Easter Eggs',
    'qr code sticker streetwear drop community easter egg',
    'Create QR codes for sticker culture, streetwear drops, and brand easter eggs that reward curious scanners with exclusive content.',
    'Business & Regional',
    '4 min read',
    '2027-01-05',
    `
### 1. The Sticker QR Cultural Moment

Stickers are one of the original urban street media formats. A sticker with a QR code is an invitation to the curious: scan and see what happens. The scan rate for well-placed, visually interesting sticker QRs in high-footfall urban environments is often higher than traditional out-of-home advertising — the audience self-selects by curiosity.

### 2. Streetwear Drop QR

A QR on a piece of streetwear or a sticker pack links to the exclusive drop page: limited units, countdown timer, and purchase link. The garment or sticker is both the product and the marketing medium. Wearing or displaying it distributes the QR passively through the wearer's daily movements.

### 3. Community QR Easter Egg

A QR hidden in brand artwork, product labels, or packaging links to an exclusive community page: a Discord server, a private fan community, or an early access list. Only those who find and scan the hidden QR gain access. Discovery and exclusivity are powerful community building tools.

### 4. Rotating Content QR

A dynamic QR on a sticker or branded surface rotates its destination daily or weekly: today it links to a new track, tomorrow to a news drop, next week to a collaboration reveal. Repeat scanners are rewarded for their loyalty with fresh content at each interaction.

### 5. Location-Specific QR Art

A QR embedded in street art or location-specific murals links to content specific to that location: the story behind the artwork, the artist's profile, and related creative work. Location-bound QR art creates a reason to visit a specific place — an analogue of a geofenced digital experience.
    `,
    [
      {
        question: 'Are QR codes on stickers in public spaces legal in the UK?',
        answer:
          'Flyposting (adhering stickers or posters to public property without permission) is illegal. QR stickers on your own property, at events with permission, or on commercial displays with permission are legal. Always obtain permission for the surface before placing a QR sticker.',
      },
      {
        question: 'What makes a sticker QR get scanned by passersby?',
        answer:
          'Visual intrigue (unusual design, hint of mystery), clear CTA ("scan to unlock"), and placement at eye level in a low-distraction environment. Sticker QRs competing with advertising clutter in a busy area scan less than a single QR in a calm, focused context.',
      },
    ]
  ),
  art(
    'qr-code-url-shortener-comparison',
    'QR Code URL Shorteners Compared: Bitly, TinyURL, Rebrandly, and Self-Hosted Options',
    'qr code url shortener bitly rebrandly comparison',
    'Compare the leading URL shorteners for QR code campaigns on analytics, custom domains, reliability, and cost.',
    'Fundamentals',
    '6 min read',
    '2027-01-06',
    `
### 1. Why Use a URL Shortener with QR Codes

A URL shortener provides a redirect layer between the QR code (which is fixed once printed) and the destination URL (which can be updated). It also provides scan analytics that the destination web server cannot easily attribute to specific QR placements.

The three functions: analytics, updatability, and URL shortening (reducing QR complexity for simple payloads).

### 2. Bitly

**Strengths:** Brand recognition, reliable uptime, comprehensive analytics (scans by date, device, OS, location). Custom domains on paid plans. Free tier available with limited features.

**Weaknesses:** Aggressive pricing changes. Free tier limits have tightened significantly since 2023. Data portability concerns — links created under a paid account may not be accessible if the subscription lapses.

**Best for:** Established businesses with a budget for a reliable service and need for standard analytics.

### 3. Rebrandly

**Strengths:** Focused on branded short links (your-brand.link/slug). Strong custom domain support on even entry-level plans. Better link management and tagging than Bitly.

**Weaknesses:** Analytics less granular than Bitly at equivalent price points. Smaller network effect.

**Best for:** Businesses for whom branded short URLs are a priority for trust and aesthetics.

### 4. TinyURL

**Strengths:** Free. Simple. Has been reliably available since 2002. Custom aliases on the tinyurl.com domain on free tier.

**Weaknesses:** No analytics on free tier. No custom domain. No redirect updating on free tier. Limited to tinyurl.com branding, which reduces trust for professional campaigns.

**Best for:** Personal use, temporary campaigns, or when zero cost and simplicity are the only requirements.

### 5. Self-Hosted (YOURLS, Kutt, or Shlink)

**Strengths:** Full data ownership. No third-party dependency. Custom domain. Analytics controlled entirely by you. Zero ongoing cost once hosted (beyond hosting costs).

**Weaknesses:** Requires technical setup and maintenance. Reliability depends on your hosting infrastructure. No built-in support.

**Best for:** Businesses with technical resources, high QR volume, or strong data sovereignty requirements. The right choice for most serious QR deployments at scale.
    `,
    [
      {
        question: 'What happens to my QR codes if my URL shortener service shuts down?',
        answer:
          'All your printed QRs immediately stop working if the redirect service shuts down. This is the single most important risk in using a third-party shortener. Mitigate by: using a self-hosted solution, exporting your redirect data regularly as a backup, or using a custom domain (so you can migrate redirects to a different service without reprinting QRs).',
      },
      {
        question: 'Do URL shortener redirects affect QR code SEO?',
        answer:
          "Directly, no — QR codes are not indexed by search engines. Indirectly, the destination page's SEO is unaffected by a 301 redirect via a shortener in most practical implementations.",
      },
    ]
  ),
  art(
    'qr-code-future-trends-2027',
    'The Future of QR Codes: Trends Shaping 2027 and Beyond',
    'qr code future trends 2027',
    'Explore the emerging trends shaping QR code technology in 2027: GS1 Digital Link, eSIM QRs, AI-integrated scanning, and Web3 applications.',
    'Fundamentals',
    '7 min read',
    '2027-01-07',
    `
### 1. GS1 Digital Link Becomes the Retail Standard

GS1 Digital Link (ISO/IEC 18975) is replacing traditional EAN barcodes on consumer products. By 2027, major retailers (Walmart, Tesco, Carrefour) are in active pilots to accept GS1 Digital Link QR at point of sale — replacing the 1D barcode for checkout and providing a consumer-facing product information layer simultaneously. A single QR carries the GTIN (product ID), batch, serial, and expiry AND links to the product's digital product passport.

### 2. AI-Integrated Scanning

AI models embedded in QR scanner applications will in 2027 begin to provide context-aware scan results: the AI understands what the QR is likely for (payment, authentication, marketing, wayfinding) based on context signals and presents the most relevant action prompt — not just a raw URL or decoded string. Frictionless smart scanning.

### 3. eSIM Provisioning QR

eSIM activation via QR code is the standard mechanism for embedding mobile connectivity in IoT devices, wearables, and smartphones (Apple iPhone 14+ in the US markets, growing globally). QR eSIM codes provision a mobile connection without a physical SIM card. As eSIM proliferates across categories, QR eSIM will be one of the most frequent technical QR applications globally.

### 4. Web3 and NFT-Linked QR

QR codes encoding blockchain wallet addresses and NFT metadata links are increasingly common in physical art, collectibles, and luxury goods. The QR links the physical object to its blockchain-registered provenance and ownership record. As NFT markets mature past speculation into provenance and authentication use cases, physical-to-blockchain QR bridges will be a standard product category.

### 5. Lenticular and Holographic QR Media

Emerging print technologies combine lenticular (depth-shifting) and holographic effects with scannable QR patterns. These visually striking QRs attract scans through novelty and are harder to replicate with standard printing — relevant for anti-counterfeiting and premium brand applications. Scanner compatibility requires validation on the specific implementation.

### 6. QR in Spatial Computing (Apple Vision Pro and successors)

Spatial computing platforms recognise QR codes in the physical environment and overlay digital content directly at the code's location without a separate scan action. The QR becomes an anchor for AR spatial content — walking past a QR in a spatial computing device activates the associated experience automatically.
    `,
    [
      {
        question: 'Will QR codes eventually be replaced by a superior technology?',
        answer:
          'QR codes have survived 30 years of "replacement" predictions. Their advantages — open standard, zero cost to produce, universal device support — are durable. The most likely evolution is QR becoming more capable (GS1 Digital Link, cryptographic signing) rather than being replaced. NFC is the closest competitor for short-range applications but QR retains the distance and cost advantages.',
      },
      {
        question:
          'When will GS1 Digital Link QR replace the standard 1D barcode at retail checkouts?',
        answer:
          'GS1\'s "Sunrise 2027" programme targeted 2027 for retail checkout systems to be able to scan GS1 Digital Link QR codes. This is a capability target, not a replacement mandate. Full retail transition to QR-first barcoding will be a gradual process spanning the late 2020s and early 2030s.',
      },
    ]
  ),
  art(
    'qr-code-for-outdoor-advertising',
    'QR Codes on Outdoor Advertising: Billboard Size, Viewing Distance, and Campaign ROI',
    'qr code outdoor advertising billboard size viewing distance',
    'Optimise QR codes for outdoor advertising formats including billboards, bus shelters, and transit displays with the right size, distance, and tracking.',
    'Printing & Sizing',
    '5 min read',
    '2027-01-08',
    `
### 1. The Outdoor QR Scan Distance Challenge

Outdoor advertising is viewed from greater distances than any other QR placement. The 10:1 distance-to-size ratio means a 6-sheet poster (1800 × 1200 mm) viewed from 3 metres needs a minimum 300 mm QR — roughly 1/6 of the poster width. A billboard viewed from 20 metres needs a 2000 mm QR — often impractical.

Practical rule: only include a QR on outdoor formats where the expected scanning distance is ≤5 metres. Smaller formats (bus shelter, railway platform, shopping centre interior) are more effective than large-format roadside billboards for QR applications.

### 2. Best Outdoor Formats for QR

| Format | Viewing Distance | QR Practical? |
|---|---|---|
| 6-sheet (bus shelter) | 0.5–3 m | ✓ Yes (200 mm+) |
| 48-sheet roadside | 10–50 m | ✗ No for most scanners |
| Shopping mall digital | 1–5 m | ✓ Yes if displayed large enough |
| Railway platform 4-sheet | 1–4 m | ✓ Yes |
| Van/vehicle livery (parked) | 0.5–2 m | ✓ Yes |

### 3. QR Size for 6-Sheet Bus Shelter

A 6-sheet bus shelter poster is the workhorse of outdoor QR advertising. At 1800 × 1200 mm, viewed from up to 2 metres by someone standing at the shelter:

- Minimum QR size: 200 × 200 mm (10:1 at 2 m).
- Recommended QR size: 250 × 250 mm for reliable scanning with movement and lighting variation.
- Quiet zone: minimum 25 mm on all sides (at 0.5 mm module size for a Version 5-ish code).

### 4. Tracking Outdoor QR Scan ROI

Outdoor QR campaigns should use placement-specific UTM parameters (\`utm_content=busstop-oxford-street\`) so analytics show which locations generate scans. Compare scan rate to footfall data (from the outdoor advertising company's audience measurement) to calculate approximate scan rate.

### 5. Digital Out of Home (DOOH) QR

Digital screens (DOOH) can display rotating QR codes, time-specific campaigns, and daypart targeting. A QR displayed on a DOOH panel can change destination by time of day (morning commute vs evening leisure) using dynamic QR with redirect-layer time-based routing.
    `,
    [
      {
        question: 'Should I put a QR code on a motorway billboard?',
        answer:
          'No. Motorway billboards are viewed at 70+ mph from 50+ metres. The scan distance requirement makes the QR impractically large, and attempting to scan while driving is dangerous. Outdoor QR belongs on pedestrian-speed or stationary-viewer formats only.',
      },
      {
        question: 'What is the typical scan rate for a bus shelter QR in a UK high street?',
        answer:
          'Well-positioned bus shelter QR campaigns with compelling CTAs in high footfall locations typically achieve 0.3–1.5% scan rates of estimated daily footfall impressions. A small percentage of a large number can still be significant volume — a stop with 10,000 daily impressions at 0.5% is 50 scans per day.',
      },
    ]
  ),
  art(
    'qr-code-for-catering-and-events-industry',
    'QR Codes for Contract Catering and Events Industry: Pre-Order, Dietary, and EPOS Integration',
    'qr code catering events pre-order dietary epos',
    'Use QR codes in contract catering and events for digital pre-ordering, dietary preference capture, cashless payment, and EPOS integration.',
    'Business & Regional',
    '4 min read',
    '2027-01-09',
    `
### 1. Pre-Order QR for Corporate Events

A QR on conference delegate badges and event invitations links to the pre-order catering system: breakfast, lunch, and refresh choices, dietary requirements, and session-specific collection times. Pre-orders reduce on-the-day catering waste by 20–40% and virtually eliminate the experience of running out of a popular option.

### 2. Dietary and Allergen Capture QR

A QR on the event registration confirmation links to the dietary preference and allergen form. Collecting dietary data digitally before the event allows the caterer to prepare accurate quantities, label individual portions, and brief serving staff — far more reliable than paper dietary cards.

### 3. Cashless Payment QR at Events

A QR at each service point links to the cashless payment system for the event. Delegates pay with card or mobile wallet rather than cash or paper vouchers. Cashless events have higher average spend, shorter service queues, and complete transaction records for budget reconciliation.

### 4. EPOS Integration

QR order data feeds directly into the EPOS system, which coordinates kitchen production, inventory depletion, and revenue reporting. Integrated QR ordering eliminates manual ticket entry errors and gives the events manager a real-time view of order volumes and revenue.

### 5. Post-Event Feedback QR

A QR on the event closing slides or delegate packs links to the catering feedback form: food quality, service speed, dietary accommodation, and overall satisfaction. Post-event catering feedback via QR achieves higher response rates and more structured data than verbal feedback or email surveys.
    `,
    [
      {
        question:
          'Can a QR pre-order system handle dietary requirements for 500 delegates at a corporate event?',
        answer:
          'Yes. Enterprise catering management platforms (Catercloud, Nourish, Fooditude) support QR-linked pre-ordering at scale with allergen management integrated into production. For events of this size, pre-ordering is not just convenient — it is the only reliable way to manage dietary complexity.',
      },
      {
        question: 'Should event catering QR codes be reused between events?',
        answer:
          "No. Each event should have a unique QR linked to that event's ordering system. Reusing QRs risks routing delegates from a future event to a past event's order system, causing confusion and incorrect orders.",
      },
    ]
  ),
  art(
    'qr-code-for-disaster-relief',
    'QR Codes in Disaster Relief and Humanitarian Aid: Registration, Resource Distribution, and Communication',
    'qr code disaster relief humanitarian aid registration',
    'Deploy QR codes in humanitarian operations for survivor registration, resource distribution, health communication, and family reunification.',
    'Business & Regional',
    '5 min read',
    '2027-01-10',
    `
### 1. Survivor Registration QR

A QR at registration points in displacement camps or emergency centres links to the survivor registration form: name, family composition, location of origin, and special needs (medical conditions, unaccompanied children). Digital registration feeds databases shared between relief agencies, improving coordination and preventing double registration.

### 2. Aid Distribution Tracking QR

Each registered individual or household receives a wristband or card with a QR. At distribution points, relief workers scan the QR to:
- Confirm the household's entitlement.
- Record items distributed.
- Flag if distribution has already occurred (preventing duplicate distribution).

QR-based distribution tracking reduces diversion and ensures equitable access to limited resources.

### 3. Health Information QR

A QR on posters and information cards links to health information in the population's language: cholera prevention, water treatment, vaccination schedules, and sanitation guidance. Multi-language digital content is far more practical to update than printed materials in a rapidly evolving emergency.

### 4. Family Reunification QR

A QR links to a family reunification registry where separated family members register to find each other. Used in coordination with ICRC's Restoring Family Links database. QR access via shared phones lowers the barrier for people without personal devices.

### 5. Connectivity-Resilient Design

Humanitarian QR deployments must function in low-connectivity environments:
- Key forms must work offline (data queued locally, synced when connectivity returns).
- Aid distribution QRs should validate against a locally cached manifest, not a real-time database call.
- Printed QR distribution cards must be readable after water exposure (weather-resistant materials).
    `,
    [
      {
        question: 'Do disaster-affected populations have smartphones to scan QR codes?',
        answer:
          'Smartphone penetration is significant even in low-income contexts, and shared-phone usage extends QR access further. QR is one access method among several in humanitarian operations — it is not assumed to be universal and is used alongside non-digital processes for populations without device access.',
      },
      {
        question: 'How is displaced person QR data protected in a humanitarian context?',
        answer:
          'ICRC and UNHCR have strict data protection frameworks for displaced person data. QR-collected registration data must be encrypted in transit and at rest, access-controlled, not shared with government authorities without legal basis, and subject to data minimisation principles.',
      },
    ]
  ),
];
