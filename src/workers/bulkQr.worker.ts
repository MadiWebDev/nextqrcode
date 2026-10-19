/**
 * Bulk QR generation Web Worker.
 *
 * Self-contained: imports `qrcode` directly so the worker bundle carries its
 * own copy. Receives a {@link BulkQrRequest} with the rows to render, and
 * posts back typed {@link BulkQrMessage} progress messages (one per row,
 * carrying `{ index, dataUrl }`) followed by a final `done` message.
 */

import QRCode from 'qrcode';

/** One row of bulk input: the payload to encode and the base file name. */
export interface BulkRow {
  payload: string;
  filename: string;
}

export type BulkFormat = 'png' | 'svg';
export type BulkErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/** Message sent from the main thread to start generation. */
export interface BulkQrRequest {
  rows: BulkRow[];
  format: BulkFormat;
  /** Output image size in pixels (PNG) / SVG width. */
  size: number;
  ecLevel: BulkErrorCorrectionLevel;
}

/** Per-row progress message: carries the generated QR for `index`. */
export interface BulkQrProgress {
  type: 'progress';
  index: number;
  total: number;
  /**
   * PNG: full `data:image/png;base64,…` URL. SVG: raw SVG markup (not a data
   * URL — written straight to the `.svg` file).
   */
  dataUrl: string;
}

/** Posted when a single row fails; generation continues with the next row. */
export interface BulkQrRowError {
  type: 'row-error';
  index: number;
  message: string;
}

/** Posted once after the last row has been attempted. */
export interface BulkQrDone {
  type: 'done';
  total: number;
  succeeded: number;
  failed: number;
}

export type BulkQrMessage = BulkQrProgress | BulkQrRowError | BulkQrDone;

function postMessageToMain(message: BulkQrMessage): void {
  // `postMessage` is global inside a worker scope.
  postMessage(message);
}

self.onmessage = async (event: MessageEvent<BulkQrRequest>): Promise<void> => {
  const { rows, format, size, ecLevel } = event.data;
  const total = rows.length;
  let succeeded = 0;
  let failed = 0;

  for (let index = 0; index < total; index += 1) {
    const row = rows[index];
    try {
      const dataUrl =
        format === 'svg'
          ? await QRCode.toString(row.payload, {
              type: 'svg',
              errorCorrectionLevel: ecLevel,
              width: size,
              margin: 2,
            })
          : await QRCode.toDataURL(row.payload, {
              errorCorrectionLevel: ecLevel,
              width: size,
              margin: 2,
            });
      succeeded += 1;
      postMessageToMain({ type: 'progress', index, total, dataUrl });
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : 'QR generation failed';
      postMessageToMain({ type: 'row-error', index, message });
    }
  }

  postMessageToMain({ type: 'done', total, succeeded, failed });
};
