/**
 * PNG/JPEG export of a rendered resume page.
 *
 * The page element is serialized into a self-contained SVG
 * (foreignObject) with computed styles inlined and images converted
 * to data URLs (SVG-as-image cannot load blob: or external URLs),
 * drawn to a canvas at print resolution, and encoded. Webfonts cannot
 * be embedded into this path, so text falls back to the closest
 * system font — the UI states this difference plainly.
 */

const INLINE_PROPS = [
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
  'letter-spacing', 'color', 'background-color', 'text-align',
  'text-transform', 'text-decoration-line', 'border-top', 'border-bottom',
  'border-left', 'border-right', 'border-radius', 'padding', 'margin',
  'width', 'height', 'display', 'flex-direction', 'justify-content',
  'align-items', 'gap', 'grid-template-columns', 'white-space',
  'vertical-align', 'opacity', 'box-sizing', 'overflow', 'position',
] as const;

async function blobUrlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function inlineStyles(source: HTMLElement, clone: HTMLElement): Promise<void> {
  const computed = window.getComputedStyle(source);
  let css = '';
  for (const prop of INLINE_PROPS) css += `${prop}:${computed.getPropertyValue(prop)};`;
  clone.setAttribute('style', `${clone.getAttribute('style') ?? ''};${css}`);
  const srcKids = source.children;
  const cloneKids = clone.children;
  for (let i = 0; i < srcKids.length && i < cloneKids.length; i++) {
    await inlineStyles(srcKids[i] as HTMLElement, cloneKids[i] as HTMLElement);
  }
  if (source instanceof HTMLImageElement && clone instanceof HTMLImageElement) {
    const src = source.currentSrc || source.src;
    if (src.startsWith('blob:')) clone.src = await blobUrlToDataUrl(src);
    clone.removeAttribute('srcset');
  }
}

/** Render one .resume-page element to a PNG or JPEG Blob at ~300dpi. */
export async function exportPageImage(
  pageEl: HTMLElement,
  format: 'png' | 'jpeg',
): Promise<Blob> {
  const rect = pageEl.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const scale = 300 / 96; // CSS px are 1/96in; 300dpi target
  const clone = pageEl.cloneNode(true) as HTMLElement;
  await inlineStyles(pageEl, clone);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${new XMLSerializer().serializeToString(clone)}</foreignObject></svg>`;
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('image-render-failed'));
      img.src = svgUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas-unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('image-encode-failed'))),
        format === 'png' ? 'image/png' : 'image/jpeg',
        0.92,
      );
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
