import { ImageResponse } from 'next/og';

export const alt = 'Social Media Calendar — free, private content planner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated OG card for the Social Media Calendar site. */
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
          background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px' }}>
          {['#f59e0b', '#34d399', '#f472b6', '#a78bfa', '#38bdf8'].map((c) => (
            <div key={c} style={{ width: '54px', height: '54px', borderRadius: '12px', background: c }} />
          ))}
        </div>
        <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1 }}>
          Social Media Calendar
        </div>
        <div style={{ fontSize: '30px', marginTop: '20px', opacity: 0.9 }}>
          Plan every platform in one private calendar — free, no sign-up, data stays in your browser.
        </div>
        <div style={{ fontSize: '22px', marginTop: '44px', opacity: 0.75 }}>
          socialcalendar.freeqrcode.tools
        </div>
      </div>
    ),
    size,
  );
}
