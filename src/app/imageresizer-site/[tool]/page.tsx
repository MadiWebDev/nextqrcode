import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS, toolBySlug } from '../_lib/registry';
import { ToolShell } from '../_components/ToolShell';
import { ResizerTool } from '../_components/ResizerTool';
import { BulkResizerTool } from '../_components/BulkResizerTool';
import { CompressorTool } from '../_components/CompressorTool';
import { ExactKbTool } from '../_components/ExactKbTool';
import { ConverterTool } from '../_components/ConverterTool';
import { CropTool } from '../_components/CropTool';
import { RotateFlipTool } from '../_components/RotateFlipTool';
import EditorTool from '../_components/EditorTool';
import PipelineTool from '../_components/PipelineTool';
import BulkCompressTool from '../_components/BulkCompressTool';
import BulkConvertTool from '../_components/BulkConvertTool';
import BulkWatermarkTool from '../_components/BulkWatermarkTool';
import SocialTool from '../_components/SocialTool';
import PassportTool from '../_components/PassportTool';
import MetadataTool from '../_components/MetadataTool';
import ExifRemoverTool from '../_components/ExifRemoverTool';
import RedactTool from '../_components/RedactTool';
import ColorPickerTool from '../_components/ColorPickerTool';
import CalculatorsTool from '../_components/CalculatorsTool';
import ImagesToPdfTool from '../_components/ImagesToPdfTool';
import PdfToImagesTool from '../_components/PdfToImagesTool';
import { Base64ToImageTool, ImageToBase64Tool } from '../_components/Base64Tool';
import CircleCropTool from '../_components/CircleCropTool';
import FaviconTool from '../_components/FaviconTool';
import GridSplitTool from '../_components/GridSplitTool';
import ColorBlindTool from '../_components/ColorBlindTool';
import OgCardTool from '../_components/OgCardTool';
import GifMakerTool from '../_components/GifMakerTool';

const SITE = 'https://imageresizer.freeqrcode.tools';

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `${SITE}/${tool.slug}` },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `${SITE}/${tool.slug}`,
      type: 'website',
      siteName: 'Free QR Code Tools – Image Resizer',
    },
    twitter: { card: 'summary_large_image', title: tool.title, description: tool.description },
  };
}

function ToolBody({ slug }: { slug: string }) {
  switch (slug) {
    case 'resize-image':
      return <ResizerTool />;
    case 'bulk-image-resizer':
      return <BulkResizerTool />;
    case 'compress-image':
      return <CompressorTool />;
    case 'compress-image-to-100kb':
      return <ExactKbTool />;
    case 'image-converter':
      return <ConverterTool />;
    case 'crop-image':
      return <CropTool />;
    case 'rotate-image':
      return <RotateFlipTool variant="rotate" />;
    case 'flip-image':
      return <RotateFlipTool variant="flip" />;
    case 'image-editor':
      return <EditorTool />;
    case 'image-pipeline':
      return <PipelineTool />;
    case 'bulk-image-compressor':
      return <BulkCompressTool />;
    case 'bulk-image-converter':
      return <BulkConvertTool />;
    case 'bulk-watermark':
      return <BulkWatermarkTool />;
    case 'social-image-resizer':
      return <SocialTool />;
    case 'passport-photo-maker':
      return <PassportTool />;
    case 'image-metadata-viewer':
      return <MetadataTool />;
    case 'remove-exif-data':
      return <ExifRemoverTool />;
    case 'blur-image':
      return <RedactTool />;
    case 'image-color-picker':
      return <ColorPickerTool />;
    case 'aspect-ratio-calculator':
      return <CalculatorsTool variant="aspect" />;
    case 'dpi-calculator':
      return <CalculatorsTool variant="dpi" />;
    case 'print-size-calculator':
      return <CalculatorsTool variant="print" />;
    case 'images-to-pdf':
      return <ImagesToPdfTool />;
    case 'pdf-to-images':
      return <PdfToImagesTool />;
    case 'image-to-base64':
      return <ImageToBase64Tool />;
    case 'base64-to-image':
      return <Base64ToImageTool />;
    case 'circle-crop-image':
      return <CircleCropTool />;
    case 'favicon-generator':
      return <FaviconTool />;
    case 'instagram-grid-splitter':
      return <GridSplitTool />;
    case 'color-blindness-simulator':
      return <ColorBlindTool />;
    case 'og-image-generator':
      return <OgCardTool />;
    case 'gif-maker':
      return <GifMakerTool />;
    case 'jpg-to-png':
      return <ConverterTool lockFormat="png" />;
    case 'png-to-jpg':
      return <ConverterTool lockFormat="jpeg" />;
    case 'jpg-to-webp':
      return <ConverterTool lockFormat="webp" />;
    case 'png-to-webp':
      return <ConverterTool lockFormat="webp" />;
    case 'heic-to-jpg':
      return <ConverterTool lockFormat="jpeg" />;
    default:
      return null;
  }
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) notFound();
  return (
    <ToolShell tool={tool}>
      <ToolBody slug={slug} />
    </ToolShell>
  );
}
