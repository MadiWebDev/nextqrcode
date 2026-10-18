/**
 * Scan-ability guard for generated QR codes.
 *
 * Pure, dependency-light scoring: given the render parameters of a QR code,
 * estimate how reliably real-world scanners will decode it and explain why.
 *
 * Scoring model (0–100, starts at 100):
 * - contrast ratio < 3   → "Poor contrast"  −40 (heavy)
 * - contrast ratio < 4.5  → "Low contrast"   −15 (medium)
 * - inverted colors (light modules on dark background) −10
 * - logo covering > 25% of the code −25
 * - logo without EC level H or Q    −20
 * - very dense code (> 77 modules per side, i.e. above ~version 15) −10,
 *   plus −10 more when rendered smaller than 4 px per module
 * - quiet zone narrower than the 4-module minimum −10
 * - empty payload → score 0 immediately
 */
import QRCode from 'qrcode';
import { getContrastRatio } from '@/lib/qr-helpers';
import type { ECLevel } from '@/types';

/** Penalties applied to the score, in points. */
const PENALTY = {
  poorContrast: 40,
  lowContrast: 15,
  inverted: 10,
  largeLogo: 25,
  logoNeedsEc: 20,
  dense: 10,
  denseSmallRender: 10,
  quietZone: 10,
} as const;

/** Minimum quiet-zone width (modules) per the QR specification. */
const MIN_QUIET_ZONE_MODULES = 4;

/** Minimum module size (cm) for reliable scanning at close range. */
const MIN_MODULE_CM = 0.075; // 0.75 mm

/** Module count above which a code is considered very dense (~version 15). */
const DENSE_MODULE_THRESHOLD = 77;

/** Render resolution below which a dense code is hard to resolve. */
const MIN_PX_PER_MODULE_DENSE = 4;

export interface ScanabilityInput {
  /** Foreground (module) color, hex like `#000000`. */
  fgColor: string;
  /** Background color, hex like `#ffffff`. */
  bgColor: string;
  /** Whether a logo is overlaid on the code. */
  hasLogo: boolean;
  /** Logo width as a fraction of the code width (0–1). */
  logoSizeRatio: number;
  /** Encoded payload length in characters. */
  payloadLength: number;
  /** Error-correction level used when generating the code. */
  ecLevel: ECLevel;
  /** Quiet-zone width in modules. */
  quietZoneModules: number;
  /** Rendered canvas width in pixels. */
  outputSizePx: number;
}

export interface PrintSize {
  /** Smallest side length (cm) that still scans reliably at close range. */
  minCm: number;
  /** Recommended side length (cm) for comfortable everyday scanning. */
  recommendedCm: number;
}

export interface ScanabilityResult {
  /** 0–100. 100 = no issues found. */
  score: number;
  /** Human-readable explanations, one per detected issue. */
  warnings: string[];
  /** Suggested physical print sizes. */
  printSize: PrintSize;
}

/**
 * Parse a `#rgb` / `#rrggbb` hex color into linear-lightness luminance
 * (relative luminance per WCAG, 0 = black … 1 = white).
 */
function hexToLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const channel = (i: number): number => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/**
 * Estimate the QR symbol size (modules per side, excluding quiet zone)
 * for a payload of the given length and error-correction level.
 *
 * Uses the real `qrcode` encoder with a representative byte-mode payload so
 * the version estimate matches what the app actually generates.
 */
export function estimateModules(payloadLength: number, ecLevel: ECLevel): number {
  if (payloadLength <= 0) return 0;
  const representative = 'x'.repeat(payloadLength); // lowercase → byte mode
  return QRCode.create(representative, { errorCorrectionLevel: ecLevel }).modules.size;
}

/**
 * Estimate the recommended print size (side length in cm) for scanning
 * from a given distance. Rule of thumb: the code side should be at least
 * one tenth of the scan distance (1 m distance → 10 cm code).
 */
export function printSizeFor(distanceM: number): number {
  if (!Number.isFinite(distanceM) || distanceM <= 0) return 0;
  return Math.round(distanceM * 10 * 10) / 10;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * Score how reliably a QR code with the given render parameters will scan.
 */
export function scoreScanability(input: ScanabilityInput): ScanabilityResult {
  const warnings: string[] = [];
  let score = 100;

  if (input.payloadLength <= 0) {
    return {
      score: 0,
      warnings: ['Empty payload — there is nothing to encode.'],
      printSize: { minCm: 0, recommendedCm: 0 },
    };
  }

  // --- Contrast -----------------------------------------------------------
  const ratio = getContrastRatio(input.fgColor, input.bgColor);
  const ratioLabel = `${ratio.toFixed(1)}:1`;
  if (ratio < 3) {
    warnings.push(`Poor contrast (${ratioLabel}) — may not scan.`);
    score -= PENALTY.poorContrast;
  } else if (ratio < 4.5) {
    warnings.push(
      `Low contrast (${ratioLabel}) — increase the difference between the module and background colors.`
    );
    score -= PENALTY.lowContrast;
  }

  // --- Inverted colors ------------------------------------------------------
  if (hexToLuminance(input.fgColor) > hexToLuminance(input.bgColor)) {
    warnings.push('Inverted colors: dark-on-light scans most reliably.');
    score -= PENALTY.inverted;
  }

  // --- Logo -----------------------------------------------------------------
  if (input.hasLogo) {
    if (input.logoSizeRatio > 0.25) {
      warnings.push('Logo covers >25% of the code — may break scanning.');
      score -= PENALTY.largeLogo;
    }
    if (input.ecLevel !== 'H' && input.ecLevel !== 'Q') {
      warnings.push('Logo overlays require error-correction level H or Q.');
      score -= PENALTY.logoNeedsEc;
    }
  }

  // --- Density ----------------------------------------------------------------
  const modules = estimateModules(input.payloadLength, input.ecLevel);
  if (modules > DENSE_MODULE_THRESHOLD) {
    warnings.push(
      `Very dense code (${modules}×${modules} modules) — print it larger or shorten the payload.`
    );
    score -= PENALTY.dense;
    if (input.outputSizePx > 0 && input.outputSizePx / modules < MIN_PX_PER_MODULE_DENSE) {
      warnings.push(
        'Render size is too small for such a dense code — increase the output resolution.'
      );
      score -= PENALTY.denseSmallRender;
    }
  }

  // --- Quiet zone -------------------------------------------------------------
  if (input.quietZoneModules < MIN_QUIET_ZONE_MODULES) {
    warnings.push(
      `Quiet zone is only ${input.quietZoneModules} modules — scanners need at least ${MIN_QUIET_ZONE_MODULES}.`
    );
    score -= PENALTY.quietZone;
  }

  // --- Print size ---------------------------------------------------------------
  const totalModules = modules + 2 * Math.max(0, input.quietZoneModules);
  const minCm = round1(totalModules * MIN_MODULE_CM);
  const recommendedCm = round1(minCm * 1.5);

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    warnings,
    printSize: { minCm, recommendedCm },
  };
}
