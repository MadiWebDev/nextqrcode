import { NextRequest, NextResponse } from 'next/server';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mediaType = (formData.get('type') as string) || 'auto';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine resource type for Cloudinary
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'auto';
    if (mediaType === 'image') resourceType = 'image';
    else if (mediaType === 'video' || mediaType === 'audio') resourceType = 'video'; // Cloudinary handles audio under video

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.',
          unconfigured: true,
        },
        { status: 503 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, 'qrcode-tools', resourceType);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
