import { ImageResponse } from 'next/og';
import QRCodeLib from 'qrcode';
import { dbConnect, isDbConfigured } from '@/lib/db/mongoose';
import { QrCode } from '@/models/QrCode';
import { siteConfig } from '@/config/site';
import { getQrTypeMeta } from '@/lib/qr/type-meta';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

/**
 * Dynamic OG image for public QR pages: renders the actual QR code
 * (generated server-side with the `qrcode` package) next to the title.
 * Only meaningful for active codes; otherwise falls back to brand art.
 */
export default async function OgImage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  let encoded = siteConfig.url;
  let title = 'QR Studio';
  let label = 'QR Code';

  try {
    if (isDbConfigured()) {
      await dbConnect();
      const qr = (await QrCode.findOne({ publicId }).lean()) as unknown as {
        mode: string;
        payload?: string;
        title?: string;
        type: string;
        status: string;
      } | null;
      if (qr && qr.status === 'active') {
        encoded =
          qr.mode === 'dynamic'
            ? `${siteConfig.url}/r/${publicId}`
            : (qr.payload ?? siteConfig.url);
        const meta = getQrTypeMeta(qr.type);
        label = meta.label;
        title = qr.title?.trim() || `${meta.label} QR Code`;
      }
    }
  } catch {
    /* fall back to brand art */
  }

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCodeLib.toDataURL(encoded, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 460,
    });
  } catch {
    qrDataUrl = '';
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: 80,
      }}
    >
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          width={460}
          height={460}
          alt=""
          style={{ borderRadius: 24, background: 'white', padding: 12 }}
        />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
        <div style={{ fontSize: 28, opacity: 0.7 }}>{label} QR Code</div>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 26, opacity: 0.7 }}>Scan with any phone camera · QR Studio</div>
      </div>
    </div>,
    { ...size }
  );
}
