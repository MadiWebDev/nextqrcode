export interface CountryData {
  slug: string;
  name: string;
  isoCode: string;
  callingCode: string;
  nationalPrefix: string;
  sampleNumber: string;
  mobileRegex: string;
  localCarriers: string[];
  commonScenarios: { title: string; message: string }[];
  regulatoryNotes: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

export const COUNTRIES: CountryData[] = [
  {
    slug: 'pakistan',
    name: 'Pakistan',
    isoCode: 'PK',
    callingCode: '+92',
    nationalPrefix: '0',
    sampleNumber: '3001234567',
    mobileRegex: '^(0?3[0-4][0-9]{8})$',
    localCarriers: ['Jazz (PMCL)', 'Telenor Pakistan', 'Zong (CMPak)', 'Ufone (PTML)'],
    commonScenarios: [
      { title: 'Cash on Delivery (COD) Order Confirmation', message: 'Hello! I would like to confirm my order #{{order_id}}. Please dispatch via courier.' },
      { title: 'Direct Customer WhatsApp Support', message: 'As-salamu alaykum! I have an inquiry regarding your services in Lahore/Karachi.' },
      { title: 'Restaurant Takeaway Order', message: 'Hi, I would like to place a pickup order from your menu.' }
    ],
    regulatoryNotes: 'Under Pakistan Telecommunication Authority (PTA) regulations, commercial WhatsApp business accounts must disclose business registration details and provide clear opt-out commands.',
    content: `
Pakistan features one of the highest WhatsApp penetration rates in South Asia, with over 50 million active users. For local businesses—ranging from e-commerce boutiques in Karachi to electronics retailers in Lahore—WhatsApp serves as the primary transaction channel for Cash-on-Delivery (COD) verification, customer support, and order tracking.

When generating a WhatsApp QR code for Pakistan (+92), the single most common error is the inclusion of the domestic national dialing prefix "0". In Pakistan, domestic mobile numbers are written as \`0300 1234567\`. However, when constructing international ITU-T E.164 deep-link URLs (\`https://wa.me/923001234567\`), the leading zero must be stripped. Retaining the leading zero results in an invalid 11-digit international number that fails to open the chat window.

Our generator enforces strict PTA cellular prefix validation across all four licensed national mobile network operators: Jazz (\`030x\`, \`032x\`), Telenor (\`034x\`), Zong (\`031x\`), and Ufone (\`033x\`). The resulting QR code opens directly into the native WhatsApp or WhatsApp Business application on both Android and iOS devices.
    `,
    faqs: [
      { question: 'Do I include the leading "0" when generating a WhatsApp QR code for Pakistan?', answer: 'No. Remove the initial "0". For example, if your number is 0300-1234567, enter it as 3001234567 under the +92 country code.' },
      { question: 'Does this WhatsApp QR code work for Pakistani business accounts?', answer: 'Yes. It works identically with standard WhatsApp messenger and WhatsApp Business accounts.' },
      { question: 'Can I add a prefilled Urdu message?', answer: 'Yes. Our generator fully supports UTF-8 encoded Urdu text (e.g., "السلام علیکم! مجھے مزید معلومات چاہیے").' }
    ]
  },
  {
    slug: 'india',
    name: 'India',
    isoCode: 'IN',
    callingCode: '+91',
    nationalPrefix: '0',
    sampleNumber: '9876543210',
    mobileRegex: '^(0?[6-9][0-9]{9})$',
    localCarriers: ['Reliance Jio', 'Bharti Airtel', 'Vodafone Idea (Vi)', 'BSNL'],
    commonScenarios: [
      { title: 'E-commerce Catalog Inquiry', message: 'Hi! I saw your product on Instagram and would like to check price and availability.' },
      { title: 'Clinic / Doctor Appointment', message: 'Hello doctor, I would like to book a consultation slot for tomorrow.' },
      { title: 'UPI Payment Confirmation', message: 'Hi, I have completed the UPI payment. Sharing the transaction screenshot.' }
    ],
    regulatoryNotes: 'In accordance with TRAI regulations, unsolicited commercial communication via messaging platforms is strictly monitored under the National Customer Preference Register (NCPR).',
    content: `
With more than 500 million active users, India is WhatsApp's largest global market. Indian consumers increasingly expect physical storefronts, print advertisements, and restaurant menus to feature an instant "Click-to-Chat" WhatsApp QR code.

The Department of Telecommunications (DoT) standardizes Indian 10-digit mobile numbering across the 6, 7, 8, and 9 series. When formatted for international deep links, the syntax strictly requires \`https://wa.me/91XXXXXXXXXX\`. Any space, dash, bracket, or domestic zero prefix will break the link.

Our generator formats your WhatsApp link into a high-contrast vector QR code compatible with UPI payment workflows, local catalog showcases, and customer support desks across all telecom circles.
    `,
    faqs: [
      { question: 'What is the correct WhatsApp link format for Indian numbers?', answer: 'https://wa.me/91XXXXXXXXXX where XXXXXXXXXX is your 10-digit mobile number starting with 6, 7, 8, or 9.' },
      { question: 'Can I prefill an order inquiry message?', answer: 'Yes. You can encode prefilled messages such as "Hi, please send your product catalog" into the QR code.' }
    ]
  },
  {
    slug: 'united-states',
    name: 'United States',
    isoCode: 'US',
    callingCode: '+1',
    nationalPrefix: '1',
    sampleNumber: '2025550143',
    mobileRegex: '^(1?[2-9][0-9]{2}[2-9][0-9]{6})$',
    localCarriers: ['Verizon Wireless', 'AT&T Mobility', 'T-Mobile US'],
    commonScenarios: [
      { title: 'Customer Concierge Service', message: 'Hello! I need assistance with my recent order.' },
      { title: 'Real Estate Property Inquiry', message: 'Hi, I am standing outside 123 Main St and would like the listing price and tour info.' },
      { title: 'Service Quote Request', message: 'Hi! I would like to request an estimate for home services.' }
    ],
    regulatoryNotes: 'Commercial text and messaging campaigns in the United States must comply with the Telephone Consumer Protection Act (TCPA) and CTIA messaging guidelines, including explicit opt-in consent.',
    content: `
In the United States, WhatsApp adoption has experienced double-digit annual growth, particularly for international trade, real estate yard signs, and luxury retail concierge services.

North American Numbering Plan (NANP) phone numbers consist of a 3-digit area code followed by a 7-digit subscriber number (NPA-NXX-XXXX). When formatting for international WhatsApp links, the string must be \`https://wa.me/1NXXXXXXXXX\`.

Placing a WhatsApp QR code on print marketing collateral—such as direct mail flyers, real estate yard signs, and trade show banners—provides an immediate, high-converting alternative to traditional email forms.
    `,
    faqs: [
      { question: 'Do I need to include the "1" country code for US numbers?', answer: 'Yes. WhatsApp requires the international country code 1 before the 10-digit area code and number (e.g. 12025550143).' },
      { question: 'Can US landline numbers receive WhatsApp messages?', answer: 'Only if the landline has been verified using the WhatsApp Business application through phone-call voice verification.' }
    ]
  },
  {
    slug: 'united-arab-emirates',
    name: 'United Arab Emirates',
    isoCode: 'AE',
    callingCode: '+971',
    nationalPrefix: '0',
    sampleNumber: '501234567',
    mobileRegex: '^(0?5[0-9]{8})$',
    localCarriers: ['e& (Etisalat)', 'du (Emirates Integrated Telecommunications)'],
    commonScenarios: [
      { title: 'Dubai Luxury Real Estate Lead', message: 'Hello! I would like more details and payment plans for the Downtown Dubai project.' },
      { title: 'Table Reservation & Shisha Lounge', message: 'Hi, I would like to reserve a table for 4 guests tonight at 8 PM.' },
      { title: 'Car Rental & Concierge Booking', message: 'Hi! I am inquiring about luxury vehicle rental rates in Dubai.' }
    ],
    regulatoryNotes: 'Telecommunications and Digital Government Regulatory Authority (TDRA) guidelines require commercial marketing entities to respect consumer privacy and register verified commercial accounts.',
    content: `
The United Arab Emirates (UAE) represents one of the most mobile-first economies globally, where WhatsApp is the ubiquitous standard for commerce, dining reservations, and luxury real estate inquiries across Dubai and Abu Dhabi.

UAE mobile numbers are issued by Etisalat and du under the \`05x\` series (such as \`050\`, \`052\`, \`054\`, \`055\`, \`056\`, and \`058\`). When formatted for WhatsApp deep linking, the domestic zero is omitted: \`https://wa.me/9715XXXXXXXX\`.

Our generator produces dual-language print designs with native Arabic calligraphy and English typography, ideal for luxury countertop stands, hotel concierge desks, and storefront windows.
    `,
    faqs: [
      { question: 'How are UAE mobile numbers structured for WhatsApp?', answer: 'Strip the initial 0 and append to +971. For example, 050 123 4567 becomes https://wa.me/971501234567.' },
      { question: 'Is WhatsApp calling supported in UAE?', answer: 'While VoIP calling features may be restricted on local networks, text messaging, image sharing, and catalog browsing on WhatsApp work seamlessly.' }
    ]
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    isoCode: 'GB',
    callingCode: '+44',
    nationalPrefix: '0',
    sampleNumber: '7911123456',
    mobileRegex: '^(0?7[0-9]{9})$',
    localCarriers: ['EE', 'O2 UK', 'Vodafone UK', 'Three UK'],
    commonScenarios: [
      { title: 'Tradesperson / Contractor Quote', message: 'Hi! I need a quote for plumbing/electrical work at my flat.' },
      { title: 'Pub & Restaurant Table Booking', message: 'Hello, looking to book a table for Sunday roast for 6 people.' },
      { title: 'Retail Customer Returns', message: 'Hi, I would like to inquire about returning an online order.' }
    ],
    regulatoryNotes: 'UK GDPR and Privacy and Electronic Communications Regulations (PECR) apply to commercial direct messaging, requiring transparent sender identification and opt-out mechanisms.',
    content: `
In the United Kingdom, WhatsApp is used by over 80% of smartphone owners. Small businesses, independent tradespeople, and boutique hospitality venues rely heavily on WhatsApp as a direct, frictionless customer service desk.

UK mobile numbers begin with the domestic prefix \`07\` followed by 9 digits (e.g. \`07911 123456\`). When constructing the international WhatsApp URI, the leading \`0\` is removed and replaced by \`44\`: \`https://wa.me/447911123456\`.
    `,
    faqs: [
      { question: 'How do I format a UK 07 mobile number for WhatsApp?', answer: 'Drop the leading 0 and prepend 44. Example: 07911 123456 becomes https://wa.me/447911123456.' },
      { question: 'Can I print this QR code on British business cards?', answer: 'Yes. It produces a crisp vector QR code that fits perfectly on standard 85 x 55 mm UK business cards.' }
    ]
  }
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export function getAllCountries(): CountryData[] {
  return COUNTRIES;
}
