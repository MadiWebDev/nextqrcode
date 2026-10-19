/**
 * Regional payment rail spec registry (Phase 8).
 *
 * Drives the disclaimer UI for regional payment QR types: which rails have a
 * spec-verified payload builder in this codebase (`@/lib/qr/regional-payments`)
 * and which do not. Every `specUrl` below was read during the Phase 8 source
 * review ("Last reviewed: 2026-10-19").
 */
export interface RegionalPaymentSpec {
  /** Stable identifier used by the disclaimer UI. */
  id: 'upi' | 'pix' | 'epc' | 'raast';
  /** Display name of the rail. */
  name: string;
  /** Region where the rail operates. */
  region: string;
  /** Official spec / standard URL. */
  specUrl: string;
  /** ISO date the source was last reviewed. */
  lastReviewed: string;
  /** Whether this repo ships a spec-verified payload builder for the rail. */
  supported: boolean;
  /** Human-readable status note (shown in the disclaimer UI). */
  notes: string;
}

export const REGIONAL_PAYMENT_SPECS: RegionalPaymentSpec[] = [
  {
    id: 'upi',
    name: 'UPI (Unified Payments Interface)',
    region: 'India',
    specUrl:
      'https://www.npci.org.in/uploads/Circular18_Bank_Compliances_to_enbale_UPI_Merchantecosystem_0_2b8c52b989.pdf',
    lastReviewed: '2026-10-19',
    supported: true,
    notes:
      'NPCI UPI Linking Specification. Supported: the `upi://pay` collect URI (payloads.ts) ' +
      'and the merchant intent deep link (upiIntent: mc/tid/tr/refUrl/mode/orgid/sign), dispatched ' +
      'as an OS intent by the merchant app. Signed-merchant `sign` values must come from the ' +
      'merchant\u2019s PSP — this builder only formats the URI, it does not sign.',
  },
  {
    id: 'pix',
    name: 'Pix (BR Code)',
    region: 'Brazil',
    specUrl: 'https://www.bcb.gov.br/estabilidadefinanceira/pix',
    lastReviewed: '2026-10-19',
    supported: true,
    notes:
      'Banco Central do Brasil "Manual de Padr\u00f5es para Inicia\u00e7\u00e3o do Pix" (BR Code, ' +
      'EMVCo merchant-presented mode). Supported: static QR (chave Pix, subfield 01) and dynamic QR ' +
      '(PSP receiver URL, subfield 25) with CRC16-CCITT. Dynamic URLs must come from the receiver\u2019s ' +
      'PSP — this builder does not host or sign the payment payload the URL points to.',
  },
  {
    id: 'epc',
    name: 'EPC GiroCode (SEPA credit transfer)',
    region: 'Europe (SEPA)',
    specUrl:
      'https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation',
    lastReviewed: '2026-10-19',
    supported: true,
    notes:
      'EPC069-12 "Quick Response Code: Guidelines to Enable Data Capture for the Initiation of a ' +
      'SEPA Credit Transfer". Supported: structured GiroCode builder (versions 001/002, BIC + IBAN ' +
      'validation, purpose code, RF or unstructured reference, 331-byte cap). Currency is always EUR.',
  },
  {
    id: 'raast',
    name: 'Raast',
    region: 'Pakistan',
    specUrl: 'https://www.sbp.org.pk/disd/2022/CL1.htm',
    lastReviewed: '2026-10-19',
    supported: false,
    notes:
      'A Raast QR standard exists — SBP DI&SD Circular Letter No. 1 of 2022 standardises the ' +
      'interoperable QR container (EMVCo base, Merchant Account Information IDs 28\u201330 reserved ' +
      'for Raast). However, the field-level MAI format is explicitly delegated to the Raast scheme ' +
      'operator (\u00a79.2.2 / \u00a711.3 iv of the standard) and is not published by SBP; the only ' +
      'worked example (Annex-A) even contradicts the normative ID table (uses tag 27 instead of ' +
      '28\u201330). No payload builder is shipped rather than fabricate field semantics. Raast QR ' +
      'codes are issued by the user\u2019s bank/EMI.',
  },
];

/** Look up a rail's spec entry by id. */
export function getRegionalPaymentSpec(id: RegionalPaymentSpec['id']): RegionalPaymentSpec {
  const spec = REGIONAL_PAYMENT_SPECS.find((s) => s.id === id);
  if (!spec) throw new Error(`Unknown regional payment rail: ${id}`);
  return spec;
}
