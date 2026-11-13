/**
 * Minimal local typings for the two untyped decoder/encoder packages the
 * engine dynamic-imports. Only the surface the engine actually uses is
 * declared — verified against the installed dist sources.
 */
declare module 'gifenc' {
  export interface GifEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette?: number[][];
        first?: boolean;
        repeat?: number;
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        dispose?: number;
      }
    ): void;
    finish(): void;
    bytes(): Uint8Array;
    stream(): unknown;
    reset(): void;
  }
  export function GIFEncoder(options?: { auto?: boolean }): GifEncoderInstance;
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: string; oneBitAlpha?: boolean }
  ): number[][];
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: string
  ): Uint8Array;
}

declare module 'utif' {
  export interface UtifImage {
    width: number;
    height: number;
    [key: string]: unknown;
  }
  const UTIF: {
    decode(buffer: ArrayBuffer): UtifImage[];
    decodeImage(buffer: ArrayBuffer, image: UtifImage): void;
    toRGBA8(image: UtifImage): Uint8Array;
    replaceIMG(): void;
  };
  export default UTIF;
}
