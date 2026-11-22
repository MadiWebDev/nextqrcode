import { ImageResponse } from 'next/og';

export const alt = 'Invoice Generator — free professional invoices, no sign-up, no watermark';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** OG card for the Invoice Generator site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px' }}>
          {['#a7f3d0', '#34d399', '#fbbf24', '#f472b6', '#93c5fd'].map((c) => (
            <div key={c} style={{ width: '54px', height: '54px', borderRadius: '12px', background: c }} />
          ))}
        </div>
        <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1 }}>
          Free Invoice Generator
        </div>
        <div style={{ fontSize: '30px', marginTop: '20px', opacity: 0.9 }}>
          Professional invoices in minutes — taxes, payment QR and PDF download. No sign-up, no watermark.
        </div>
        <div style={{ fontSize: '22px', marginTop: '44px', opacity: 0.75 }}>
          invoicegenerator.freeqrcode.tools
        </div>
      </div>
    ),
    size,
  );
}
