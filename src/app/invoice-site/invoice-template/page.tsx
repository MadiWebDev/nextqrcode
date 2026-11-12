import type { Metadata } from 'next';
import { SeoLanding } from '../_components/SeoLanding';

export const metadata: Metadata = {
  title: 'Invoice Templates — 10 Free Professional Designs',
  description:
    'Ten genuinely different invoice templates — Classic, Modern, Minimal, Corporate, Creative, Freelancer, Elegant, Executive, Retail and International — one design system for preview and PDF.',
  alternates: { canonical: 'https://invoicegenerator.freeqrcode.tools/invoice-template' },
  openGraph: {
    title: 'Invoice Templates — 10 Free Professional Designs',
    description:
      'Browse ten distinct invoice designs and what each is for — then use any of them free, with your logo and colours.',
    url: 'https://invoicegenerator.freeqrcode.tools/invoice-template',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function TemplatesPage() {
  return (
    <SeoLanding
      slug="/invoice-template"
      title="Invoice Templates"
      standfirst="Ten templates, ten different answers to the same question — what should your business look like on paper? A template here is a complete design system, not a colour swap: header architecture, table style, totals treatment and typography all change together, and the design you pick renders identically in the live preview and the PDF your client receives."
      sections={[
        {
          heading: 'Meet the ten designs',
          paragraphs: [
            'Classic is the serif-headed traditional layout accountants have trusted for decades — right for legal, consulting and any client whose accounts department files paper. Modern leads with a full-width brand band in your colour and a filled table header; it is the default for a reason, suiting most service businesses. Minimal strips everything back to a plain header and ruled lines for designers and studios whose work should be the loudest thing in the room. Corporate centres the masthead and boxes the totals — the gravitas template for B2B suppliers and firms.',
            'Creative runs a side band down the page for agencies and makers. Freelancer is the minimal layout warmed with a coloured band, built for solo professionals who want personality without noise. Elegant pairs serif type with a striped table for boutiques, events and premium services. Executive is the corporate structure with a stronger band, for agencies and firms billing at the top of their market. Retail centres a compact masthead with a striped table that stays readable at till-point lengths. International uses the serif masthead with room for tax IDs, bank and SWIFT details — the cross-border document.',
          ],
        },
        {
          heading: 'Switching templates never touches your numbers',
          paragraphs: [
            'Design and data are separate by construction: an invoice stores its figures and its template choice independently, so re-skinning last month\u2019s invoice for a reprint changes nothing but the look — totals, tax treatment and payment history are byte-identical. Per-invoice design settings ride along: an accent colour override, font scale, paper size (A4 or Letter), orientation, and toggles for showing the logo, the status stamp, the payments-received block, notes and terms. A template gallery in the editor shows a live miniature of each design with your real business name before you commit.',
            'Defaults make it effortless: pick a house template in your first invoice and every new one starts there, while a client-facing exception — the corporate client who gets Corporate, the boutique who gets Elegant — is one click per invoice.',
          ],
        },
        {
          heading: 'One design system, every document',
          paragraphs: [
            'The same design language follows your paperwork beyond the invoice itself: client statements, and the quote, receipt, proforma, credit-note and debit-note documents in the companion tools, all share the typography and structure your clients learn to recognise. That consistency is a quiet trust signal — a business whose documents all look like relatives reads as a business with systems, and systems get paid before improvisation does. Pick the family look once, in the template gallery, and let it compound.',
          ],
        },
        {
          heading: 'Choosing well: match the reader, not your mood',
          paragraphs: [
            'The reader of your invoice is usually not your client-contact but their accounts process: a person (or a scanning system) extracting number, dates, totals, tax and bank details under time pressure. Choose the template that makes those five things unmissable for your typical reader — boxed totals and centred mastheads for traditional accounts departments, banded colour for small teams who read on phones. Whichever you choose, keep it consistent across a client relationship: recognisable invoices get paid faster, because nobody has to stop and verify that this differently-shaped document is really from you.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'Are all ten templates free?',
          answer:
            'Yes — every template, the gallery, per-invoice design settings and the PDF export are free, with no watermark on any design.',
        },
        {
          question: 'Does the PDF match the preview for every template?',
          answer:
            'Yes. One template definition drives both renderers — header style, table style, totals treatment and typography — so the PDF your client opens is the design you approved on screen.',
        },
        {
          question: 'Can different clients get different templates?',
          answer:
            'Yes — the template is chosen per invoice and stored with it. Your profile sets the starting point; override it whenever a client or a document type calls for a different look.',
        },
        {
          question: 'Can I change the template on an old invoice?',
          answer:
            'Any time. Open it, pick a different design, and download a fresh PDF — the financial content is untouched because design and data are stored separately.',
        },
      ]}
      related={[
        { href: '/printable-invoice-template', label: 'Printable invoice templates' },
        { href: '/invoice-for-freelancers', label: 'Invoices for freelancers' },
        { href: '/invoice-for-small-business', label: 'Invoices for small businesses' },
        { href: '/blog/what-to-include-on-an-invoice', label: 'Guide: what an invoice must include' },
      ]}
    />
  );
}
