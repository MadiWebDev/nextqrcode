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
