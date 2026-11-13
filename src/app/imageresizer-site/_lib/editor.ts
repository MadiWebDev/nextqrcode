/**
 * The professional editor's render pipeline.
 *
 * Non-destructive by construction: the editor holds a settings object and
 * this function re-renders from the untouched original every time. Undo /
 * redo are just settings snapshots. Stage order is fixed and documented in
 * the UI: crop → resize → rotate/flip → background → adjustments →
 * corners → border → watermark.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './engine/canvas-env';
import { cropImage, flipImage, rotateImage } from './engine/crop';
import { renderResize } from './engine/resize';
import {
  applyAdjustments,
  DEFAULT_ADJUSTMENTS,
  isDefaultAdjustments,
  type AdjustmentSet,
} from './engine/adjustments';
import {
  addBorder,
  drawImageWatermark,
  drawQrOverlay,
  drawTextWatermark,
  roundCorners,
  setBackground,
  type WatermarkPosition,
} from './engine/effects';
import { enhanceToSize } from './engine/enhance';

export interface EditorSettings {
  /** Crop as fractions of the source (null = no crop). */
  crop: { x: number; y: number; w: number; h: number } | null;
  /** Exact resize target in px (null = keep stage size). */
  resize: { width: number; height: number } | null;
  /** Enhance mode: multi-step resampling + unsharp mask at the resize stage. */
  enhance: boolean;
  angle: number;
  flipH: boolean;
  flipV: boolean;
  /** Fill transparent pixels with this colour (null = keep transparency). */
  background: string | null;
  adjustments: AdjustmentSet;
  /** Rounded corner radius in px at final size. */
  cornerRadius: number;
  borderWidth: number;
  borderColor: string;
  textWatermark: {
    text: string;
    position: WatermarkPosition;
    opacity: number;
    sizeFraction: number;
    color: string;
  } | null;
  imageWatermark: {
    position: Exclude<WatermarkPosition, 'tile'>;
    opacity: number;
    widthFraction: number;
  } | null;
  /** QR code overlay (the QR drawable is generated from `text` by the UI). */
  qrOverlay: {
    text: string;
    position: Exclude<WatermarkPosition, 'tile'>;
    opacity: number;
    widthFraction: number;
  } | null;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  crop: null,
  resize: null,
  enhance: false,
  angle: 0,
  flipH: false,
  flipV: false,
  background: null,
  adjustments: { ...DEFAULT_ADJUSTMENTS },
  cornerRadius: 0,
  borderWidth: 0,
  borderColor: '#111827',
  textWatermark: null,
  imageWatermark: null,
  qrOverlay: null,
};

/**
 * Render the full pipeline. Drawables that aren't serializable into
 * settings (the watermark logo, the generated QR code) are passed via
 * `extras`.
 */
export function renderEditorPipeline(
  env: CanvasEnv,
  source: Drawable,
  settings: EditorSettings,
  extras?: { watermarkImage?: Drawable | null; qrImage?: Drawable | null }
): CanvasSurface {
  let current: CanvasSurface | Drawable = source;

  if (settings.crop) {
    current = cropImage(env, current, {
      x: settings.crop.x * current.width,
      y: settings.crop.y * current.height,
      width: settings.crop.w * current.width,
      height: settings.crop.h * current.height,
    });
  }
  if (settings.resize) {
    current = settings.enhance
      ? enhanceToSize(env, current, settings.resize.width, settings.resize.height)
      : renderResize(env, current, {
          targetWidth: settings.resize.width,
          targetHeight: settings.resize.height,
        });
  }
  if (settings.angle !== 0) {
    current = rotateImage(env, current, settings.angle);
  }
  if (settings.flipH || settings.flipV) {
    current = flipImage(env, current, settings.flipH, settings.flipV);
  }
  if (settings.background) {
    current = setBackground(env, current, settings.background);
  }
  if (!isDefaultAdjustments(settings.adjustments)) {
    current = applyAdjustments(env, current, settings.adjustments);
  }
  if (settings.cornerRadius > 0) {
    current = roundCorners(env, current, settings.cornerRadius);
  }
  if (settings.borderWidth > 0) {
    current = addBorder(env, current, settings.borderWidth, settings.borderColor);
  }
  if (settings.textWatermark && settings.textWatermark.text.trim()) {
    current = drawTextWatermark(env, current, settings.textWatermark);
  }
  if (settings.imageWatermark && extras?.watermarkImage) {
    current = drawImageWatermark(env, current, extras.watermarkImage, settings.imageWatermark);
  }
  if (settings.qrOverlay && settings.qrOverlay.text.trim() && extras?.qrImage) {
    current = drawQrOverlay(env, current, extras.qrImage, settings.qrOverlay);
  }

  if (current === source) {
    const canvas = env.createCanvas(source.width, source.height);
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }
  return current as CanvasSurface;
}
