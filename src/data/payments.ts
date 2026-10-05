export interface PaymentScheme {
  slug: string;
  name: string;
  country: string;
  governingBody: string;
  standardSpec: string;
  currency: string;
  defaultPayloadPattern: string;
  fields: { key: string; label: string; placeholder: string; defaultValue: string; regex?: string }[];
  regulatoryNotes: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

export const PAYMENT_SCHEMES: PaymentScheme[] = [
  {
    slug: 'swiss-qr-bill',
    name: 'Swiss QR-Bill (ISO 20022)',
    country: 'Switzerland',
    governingBody: 'SIX Group & Swiss National Bank',
    standardSpec: 'Swiss Implementation Guidelines for QR-bill (SPC)',
    currency: 'CHF / EUR',
    defaultPayloadPattern: 'SPC\n0200\n1\nCH1234567890123456789\nS\nMerchant AG\nBahnhofstrasse 1\n8001\nZurich\nCH',
    fields: [
      { key: 'iban', label: 'Swiss IBAN / QR-IBAN', placeholder: 'CH1234567890123456789', defaultValue: 'CH5604835012345678000' },
      { key: 'creditorName', label: 'Creditor Legal Name', placeholder: 'Must match commercial register', defaultValue: 'Alpine Supply AG' },
      { key: 'amount', label: 'Amount (CHF / EUR)', placeholder: '150.00', defaultValue: '120.00' },
      { key: 'reference', label: 'Structured Reference (QRR / SCOR)', placeholder: '27-digit reference', defaultValue: '210000000003139471530009017' }
    ],
    regulatoryNotes: 'Under SIX Group Swiss Payment Standards, the QR-Bill replaces all legacy red and orange payment slips (BV/ESR). It must feature the Swiss Cross in the center with a dedicated quiet zone.',
    content: `
The Swiss QR-bill is the mandatory standard for automated invoicing and payments throughout Switzerland and Liechtenstein. Governed by SIX Group under ISO 20022 guidelines, the QR-bill integrates a digital payment section at the bottom of paper and electronic invoices.

The data payload follows the Swiss Payments Code (SPC) version 0200 standard, containing 31 structured text lines separated by line breaks (CRLF). Crucially, the visual QR code must feature the distinctive Swiss Cross badge ($7 \times 7\text{ mm}$ with a white boundary) placed precisely in the center, utilizing Error Correction Level M.

Our generator enforces official Swiss banking string delimiters and validation for standard IBAN and QR-IBAN routing.
    `,
    faqs: [
      { question: 'What is the Swiss Cross in the center of the QR code?', answer: 'The Swiss Cross is a mandatory national visual identifier measuring 7 x 7 mm on standard print slips. It signals to Swiss banking apps that the code contains ISO 20022 SPC invoice data.' },
      { question: 'What is the difference between a QR-IBAN and a standard IBAN?', answer: 'A QR-IBAN has a special Institution Identification (IID) range (between 30000 and 31999) and is used exclusively with 27-digit structured QR References (QRR).' }
    ]
  },
  {
    slug: 'brazil-pix-emv',
    name: 'Brazil Pix BR Code (EMVCo)',
    country: 'Brazil',
    governingBody: 'Banco Central do Brasil (BCB)',
    standardSpec: 'Manual de Padrões para Iniciação do Pix (EMVCo TLV)',
    currency: 'BRL',
    defaultPayloadPattern: '00020126...520400005303986540510.005802BR59...60...62...6304...',
    fields: [
      { key: 'pixKey', label: 'Chave Pix (CPF, CNPJ, Email, Celular ou Aleatória)', placeholder: 'user@email.com or CNPJ', defaultValue: 'financeiro@empresa.com.br' },
      { key: 'merchantName', label: 'Nome do Beneficiário (Max 25 chars)', placeholder: 'Loja Exemplo', defaultValue: 'Sao Paulo Comercio LTDA' },
      { key: 'city', label: 'Cidade do Beneficiário (Max 15 chars)', placeholder: 'SAO PAULO', defaultValue: 'SAO PAULO' },
      { key: 'amount', label: 'Valor (R$)', placeholder: '25.00', defaultValue: '49.90' },
      { key: 'txid', label: 'Identificador (TxID - Max 25 chars)', placeholder: '*** ou Código Interno', defaultValue: 'PEDIDO1092' }
    ],
    regulatoryNotes: 'Banco Central do Brasil mandates that Pix Static QR Codes (BR Code) strictly adhere to EMVCo Merchant-Presented Mode specifications with CRC16-CCITT checksum validation.',
    content: `
Pix is the instant payment network established by the Central Bank of Brazil (Banco Central do Brasil), processing over 3 billion monthly transactions. Pix allows instant, 24/7 transfers between individuals, commercial establishments, and government agencies in under 10 seconds.

The Pix QR code—known formally as the **BR Code**—follows the international EMVCo Tag-Length-Value (TLV) specification. Key data blocks include Tag \`26\` (Merchant Account Information specifying \`br.gov.bcb.pix\` and the Pix key), Tag \`52\` (MCC), Tag \`53\` (Currency 986 for Brazilian Real), Tag \`54\` (Transaction Amount), Tag \`58\` (Country Code \`BR\`), Tag \`59\` (Merchant Name), Tag \`60\` (City), and Tag \`63\` (CRC-16/CCITT checksum).

Our generator constructs the raw BR Code payload and calculates the required 4-character hexadecimal polynomial checksum client-side.
    `,
    faqs: [
      { question: 'What Pix keys can be used in this generator?', answer: 'You can use any valid Pix key registered with the Central Bank: CPF, CNPJ, email address, mobile number (+55...), or EVP random alphanumeric key.' },
      { question: 'How is the CRC16 checksum calculated for Pix?', answer: 'The CRC-16/CCITT (polynomial 0x1021, initial value 0xFFFF) is calculated over the entire string up to Tag 6304, and the 4-digit hex result is appended to the end.' }
    ]
  },
  {
    slug: 'singapore-sgqr',
    name: 'Singapore SGQR (PayNow & NETS)',
    country: 'Singapore',
    governingBody: 'Monetary Authority of Singapore (MAS)',
    standardSpec: 'Singapore Quick Response Code (SGQR) Specification',
    currency: 'SGD',
    defaultPayloadPattern: '00020101021126...5204...53037025802SG59...60...6304...',
    fields: [
      { key: 'uenOrMobile', label: 'PayNow Proxy (UEN or Mobile Number)', placeholder: '201912345A or +6591234567', defaultValue: '202012345K' },
      { key: 'merchantName', label: 'Merchant Trade Name', placeholder: 'Kopitiam Store', defaultValue: 'Marina Bay Foods Pte Ltd' },
      { key: 'amount', label: 'Amount (SGD - Optional)', placeholder: '10.50', defaultValue: '15.00' },
      { key: 'ref', label: 'Bill Reference', placeholder: 'INV-101', defaultValue: 'TAB-04' }
    ],
    regulatoryNotes: 'SGQR is co-owned by MAS and the Infocomm Media Development Authority (IMDA). It consolidates multiple electronic payment schemes onto a single unified label.',
    content: `
Singapore's SGQR scheme is the world's first unified payment QR code, launched by the Monetary Authority of Singapore (MAS) and the Infocomm Media Development Authority (IMDA). SGQR eliminates countertop clutter by combining multiple domestic and international payment schemes—including PayNow, NETS, GrabPay, and DBS PayLah!—into a single scannable symbol.

The underlying structure adheres to EMVCo standards using Tag-Length-Value encoding with Singapore country code \`SG\` and currency code \`702\` (Singapore Dollar). When scanned by any compliant banking or e-wallet application, the app parses its specific merchant identifier sub-tag and routes the transaction instantly.
    `,
    faqs: [
      { question: 'Can tourists scan SGQR codes with overseas banking apps?', answer: 'Yes, if their overseas app participates in bilateral cross-border linkages (such as PromptPay-PayNow or DuitNow-PayNow).' },
      { question: 'What is the difference between PayNow UEN and Mobile?', answer: 'UEN (Unique Entity Number) is used for registered businesses and corporations; mobile numbers (+65) are used by individuals and sole proprietors.' }
    ]
  }
];

export function getPaymentSchemeBySlug(slug: string): PaymentScheme | undefined {
  return PAYMENT_SCHEMES.find((p) => p.slug === slug);
}

export function getAllPaymentSchemes(): PaymentScheme[] {
  return PAYMENT_SCHEMES;
}
