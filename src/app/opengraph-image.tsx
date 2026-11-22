import { ImageResponse } from 'next/og';

export const alt = 'QR Studio — free QR code generator, no sign-up';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default OG card for the main QR Studio site (pages without their own card). */
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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px' }}>
          {['#38bdf8', '#34d399', '#f59e0b', '#f472b6', '#a78bfa'].map((c) => (
            <div key={c} style={{ width: '54px', height: '54px', borderRadius: '12px', background: c }} />
          ))}
        </div>
        <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1 }}>
          Free QR Code Generator
        </div>
        <div style={{ fontSize: '30px', marginTop: '20px', opacity: 0.9 }}>
          QR codes for URLs, WiFi, WhatsApp, vCards and payments — with logos and colours. No sign-up.
        </div>
        <div style={{ fontSize: '22px', marginTop: '44px', opacity: 0.75 }}>
          freeqrcode.tools
        </div>
      </div>
    ),
    size,
  );
}
