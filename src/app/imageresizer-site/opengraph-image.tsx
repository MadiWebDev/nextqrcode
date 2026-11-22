import { ImageResponse } from 'next/og';

export const alt = 'Image Resizer — resize, compress and convert images free, privately in your browser';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** OG card for the Image Resizer site. */
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px' }}>
          {['#f59e0b', '#34d399', '#38bdf8', '#f472b6', '#e9d5ff'].map((c) => (
            <div key={c} style={{ width: '54px', height: '54px', borderRadius: '12px', background: c }} />
          ))}
        </div>
        <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1 }}>
          Free Online Image Resizer
        </div>
        <div style={{ fontSize: '30px', marginTop: '20px', opacity: 0.9 }}>
          Resize, compress, crop and convert images — privately in your browser, nothing uploaded.
        </div>
        <div style={{ fontSize: '22px', marginTop: '44px', opacity: 0.75 }}>
          imageresizer.freeqrcode.tools
        </div>
      </div>
    ),
    size,
  );
}
