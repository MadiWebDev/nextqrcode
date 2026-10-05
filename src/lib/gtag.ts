// Google Analytics 4 (GA4) & Google Tag Helper
// Supports Google Consent Mode v2

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent' | 'set',
      targetIdOrAction: string | Date | Record<string, unknown>,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    adsbygoogle?: unknown[];
  }
}

/**
 * Log pageview in GA4
 */
export function pageview(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
}

export interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Log generic custom event in GA4
 */
export function event({ action, category, label, value, ...rest }: GTagEvent) {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

/**
 * Helper to update Google Consent Mode v2 states
 */
export function updateGoogleConsent(granted: boolean) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const status = granted ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });
}

/**
 * Standard QR Code Tools event tracking helpers
 */
export function trackQRGenerated(qrType: string) {
  event({
    action: 'generate_qr',
    category: 'QR Code Tools',
    label: qrType,
  });
}

export function trackQRDownloaded(format: string, qrType?: string) {
  event({
    action: 'download_qr',
    category: 'Export',
    label: `${qrType || 'unknown'} - ${format}`,
    export_format: format,
    qr_type: qrType,
  });
}

export function trackQRCopied(qrType?: string) {
  event({
    action: 'copy_qr',
    category: 'Export',
    label: qrType || 'unknown',
  });
}

export function trackToolUsed(toolName: string) {
  event({
    action: 'use_tool',
    category: 'Tools',
    label: toolName,
  });
}
