'use client';

/**
 * Pipeline builder: design an ordered chain of image operations once, save
 * it as a preset, and run it over a whole batch. Steps are the same engine
 * operations the single tools use; disabled steps are skipped; order is
 * exactly the order shown.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT } from '../_lib/engine/types';
import { encodeCanvasOutput } from '../_lib/encode-output';
import {
  BUILTIN_PIPELINES,
  STEP_LABELS,
  defaultStep,
  runPipeline,
  type PipelineDef,
  type PipelineStep,
  type PipelineStepType,
} from '../_lib/pipeline';
import { BulkProcessor, type BulkProcessOutcome } from './BulkProcessor';
import { FormatSelect } from './ResultPanel';
import { PresetBar } from './PresetBar';
import { HistoryPanel } from './HistoryPanel';

const btnCls =
  'rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50';
const inputCls =
  'w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm';

function sanitizePipeline(data: unknown): PipelineDef | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Partial<PipelineDef>;
  if (!Array.isArray(d.steps)) return null;
  const steps = d.steps.filter(
    (s): s is PipelineStep =>
      !!s && typeof s === 'object' && typeof (s as PipelineStep).type === 'string' &&
      (s as PipelineStep).type in STEP_LABELS && typeof (s as PipelineStep).params === 'object'
  );
  return {
    name: typeof d.name === 'string' ? d.name : 'My pipeline',
    steps: steps.map((s) => ({ ...s, enabled: s.enabled !== false })),
    outputFormat: (['jpeg', 'png', 'webp', 'avif'] as const).includes(
      d.outputFormat as 'jpeg'
    )
      ? (d.outputFormat as PipelineDef['outputFormat'])
      : 'jpeg',
    quality: typeof d.quality === 'number' ? Math.min(1, Math.max(0.05, d.quality)) : 0.85,
  };
}

export default function PipelineTool() {
  const [def, setDef] = useState<PipelineDef>(() =>
    JSON.parse(JSON.stringify(BUILTIN_PIPELINES[0])) as PipelineDef
  );
  const [addType, setAddType] = useState<PipelineStepType>('resize-percent');
  const [note, setNote] = useState<string | null>(null);

  const updateStep = (id: string, patch: Partial<PipelineStep>) =>
    setDef((d) => ({ ...d, steps: d.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const updateParam = (id: string, key: string, value: number | string | boolean) =>
    setDef((d) => ({
      ...d,
      steps: d.steps.map((s) =>
        s.id === id ? { ...s, params: { ...s.params, [key]: value } } : s
      ),
    }));
  const moveStep = (id: string, dir: -1 | 1) =>
    setDef((d) => {
      const idx = d.steps.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= d.steps.length) return d;
      const steps = [...d.steps];
      [steps[idx], steps[target]] = [steps[target], steps[idx]];
      return { ...d, steps };
    });
  const removeStep = (id: string) =>
    setDef((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== id) }));

  const processFile = async (file: File): Promise<BulkProcessOutcome> => {
    const decoded = await decodeImage(browserEnv, file);
    try {
      const canvas = runPipeline(browserEnv, decoded.surface, def);
      const blob = await encodeCanvasOutput(canvas, def.outputFormat, def.quality);
      return {
        blob,
        filename: buildOutputName(
          '{name}-processed',
          { originalName: file.name, width: canvas.width, height: canvas.height, format: def.outputFormat },
          EXT_BY_FORMAT[def.outputFormat]
        ),
      };
    } finally {
      decoded.release();
    }
  };

  const numParam = (step: PipelineStep, key: string, label: string, min: number, max: number, stepSize = 1) => (
    <label className="block min-w-24 flex-1">
      <span className="text-xs font-medium">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={stepSize}
        value={Number(step.params[key] ?? 0)}
        onChange={(e) => updateParam(step.id, key, Number(e.target.value))}
        className={inputCls}
      />
    </label>
  );

  const stepParams = (step: PipelineStep) => {
    switch (step.type) {
      case 'crop-percent':
        return (
          <div className="flex flex-wrap gap-2">
            {numParam(step, 'x', 'Left %', 0, 100)}
            {numParam(step, 'y', 'Top %', 0, 100)}
            {numParam(step, 'w', 'Width %', 1, 100)}
            {numParam(step, 'h', 'Height %', 1, 100)}
          </div>
        );
      case 'resize-percent':
        return <div className="flex flex-wrap gap-2">{numParam(step, 'percent', 'Percent', 1, 400)}</div>;
      case 'resize-exact':
        return (
          <div className="flex flex-wrap items-end gap-2">
            {numParam(step, 'width', 'Max width px', 1, 16000)}
            {numParam(step, 'height', 'Max height px', 1, 16000)}
            <label className="block min-w-28 flex-1">
              <span className="text-xs font-medium">Fit</span>
              <select
                value={String(step.params.fit ?? 'contain')}
                onChange={(e) => updateParam(step.id, 'fit', e.target.value)}
                className={inputCls}
              >
                <option value="contain">Fit inside (keep aspect)</option>
                <option value="stretch">Stretch to exact size</option>
              </select>
            </label>
          </div>
        );
      case 'rotate':
        return <div className="flex flex-wrap gap-2">{numParam(step, 'angle', 'Angle°', -360, 360)}</div>;
      case 'flip':
        return (
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={step.params.horizontal === true}
                onChange={(e) => updateParam(step.id, 'horizontal', e.target.checked)}
                className="accent-blue-700"
              />
              Horizontal
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={step.params.vertical === true}
                onChange={(e) => updateParam(step.id, 'vertical', e.target.checked)}
                className="accent-blue-700"
              />
              Vertical
            </label>
          </div>
        );
      case 'adjust':
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {numParam(step, 'brightness', 'Brightness', -100, 100)}
            {numParam(step, 'contrast', 'Contrast', -100, 100)}
            {numParam(step, 'saturation', 'Saturation', -100, 100)}
            {numParam(step, 'grayscale', 'Grayscale %', 0, 100)}
          </div>
        );
      case 'background':
      case 'border':
        return (
          <div className="flex flex-wrap items-end gap-2">
            {step.type === 'border' && numParam(step, 'width', 'Width px', 0, 200)}
            <label className="block">
              <span className="text-xs font-medium">Colour</span>
              <input
                type="color"
                value={String(step.params.color ?? '#111827')}
                onChange={(e) => updateParam(step.id, 'color', e.target.value)}
                className="block h-9 w-16 rounded border border-border"
                aria-label="Colour"
              />
            </label>
          </div>
        );
      case 'corners':
        return <div className="flex flex-wrap gap-2">{numParam(step, 'radius', 'Radius px', 0, 500)}</div>;
      case 'watermark-text':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={String(step.params.text ?? '')}
              maxLength={60}
              onChange={(e) => updateParam(step.id, 'text', e.target.value)}
              className={inputCls}
              aria-label="Watermark text"
              placeholder="Watermark text"
            />
            <div className="flex flex-wrap items-end gap-2">
              <label className="block min-w-32 flex-1">
                <span className="text-xs font-medium">Position</span>
                <select
                  value={String(step.params.position ?? 'bottom-right')}
                  onChange={(e) => updateParam(step.id, 'position', e.target.value)}
                  className={inputCls}
                >
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="top-right">Top right</option>
                  <option value="top-left">Top left</option>
                  <option value="center">Centre</option>
                  <option value="tile">Tiled</option>
                </select>
              </label>
              {numParam(step, 'opacity', 'Opacity %', 5, 100)}
              {numParam(step, 'size', 'Size % of width', 2, 15)}
              <label className="block">
                <span className="text-xs font-medium">Colour</span>
                <input
                  type="color"
                  value={String(step.params.color ?? '#ffffff')}
                  onChange={(e) => updateParam(step.id, 'color', e.target.value)}
                  className="block h-9 w-16 rounded border border-border"
                  aria-label="Watermark colour"
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const settings = (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={def.name}
            maxLength={60}
            onChange={(e) => setDef((d) => ({ ...d, name: e.target.value }))}
            className="min-w-44 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold"
            aria-label="Pipeline name"
          />
          <select
            defaultValue=""
            onChange={(e) => {
              const found = BUILTIN_PIPELINES.find((b) => b.name === e.target.value);
              if (found) {
                setDef(JSON.parse(JSON.stringify(found)) as PipelineDef);
                setNote(`Loaded the built-in "${found.name}" pipeline — edit it freely.`);
              }
              e.target.value = '';
            }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
            aria-label="Load a built-in pipeline"
          >
            <option value="" disabled>
              Built-in pipelines…
            </option>
            {BUILTIN_PIPELINES.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={btnCls}
            onClick={() => setDef({ name: 'My pipeline', steps: [], outputFormat: 'jpeg', quality: 0.85 })}
          >
            Start blank
          </button>
        </div>

        <ol className="mt-4 space-y-2">
          {def.steps.map((step, i) => (
            <li key={step.id} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="checkbox"
                  checked={step.enabled}
                  onChange={(e) => updateStep(step.id, { enabled: e.target.checked })}
                  className="accent-blue-700"
                  aria-label={`Enable step ${i + 1}`}
                />
                <span className="text-sm font-semibold">
                  {i + 1}. {STEP_LABELS[step.type]}
                </span>
                <span className="ml-auto flex gap-1">
                  <button type="button" className={btnCls} onClick={() => moveStep(step.id, -1)} disabled={i === 0} aria-label="Move step up">
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnCls}
                    onClick={() => moveStep(step.id, 1)}
                    disabled={i === def.steps.length - 1}
                    aria-label="Move step down"
                  >
                    ↓
                  </button>
                  <button type="button" className={btnCls} onClick={() => removeStep(step.id)} aria-label="Remove step">
                    ✕
                  </button>
                </span>
              </div>
              {step.enabled && <div className="mt-2">{stepParams(step)}</div>}
            </li>
          ))}
          {def.steps.length === 0 && (
            <li className="rounded-lg bg-accent/50 p-3 text-sm text-muted-foreground">
              No steps yet — add your first step below. Files will still be re-encoded to the
              output format (which strips metadata).
            </li>
          )}
        </ol>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="block min-w-44 flex-1">
            <span className="text-xs font-medium">Add a step</span>
            <select
              value={addType}
              onChange={(e) => setAddType(e.target.value as PipelineStepType)}
              className={inputCls}
            >
              {(Object.keys(STEP_LABELS) as PipelineStepType[]).map((t) => (
                <option key={t} value={t}>
                  {STEP_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => setDef((d) => ({ ...d, steps: [...d.steps, defaultStep(addType)] }))}
          >
            Add step
          </button>
        </div>

        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <FormatSelect
            value={def.outputFormat}
            onChange={(f) => setDef((d) => ({ ...d, outputFormat: f as PipelineDef['outputFormat'] }))}
            formats={[
              { value: 'jpeg', label: 'JPG' },
              { value: 'png', label: 'PNG' },
              { value: 'webp', label: 'WebP' },
              { value: 'avif', label: 'AVIF' },
            ]}
          />
          {def.outputFormat !== 'png' && (
            <label className="block">
              <span className="text-xs font-medium">Quality · {Math.round(def.quality * 100)}%</span>
              <input
                type="range"
                min={10}
                max={100}
                value={Math.round(def.quality * 100)}
                onChange={(e) => setDef((d) => ({ ...d, quality: Number(e.target.value) / 100 }))}
                className="mt-2 w-full accent-blue-700"
                aria-label="Output quality"
              />
            </label>
          )}
        </div>
        {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
      </div>

      <PresetBar
        scope="pipeline"
        getCurrent={() => def}
        onLoad={(data) => {
          const clean = sanitizePipeline(data);
          if (clean) {
            setDef(clean);
            setNote('Pipeline preset loaded.');
          } else {
            setNote('That preset is not a valid pipeline — nothing was changed.');
          }
        }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <BulkProcessor
        settings={settings}
        processFile={processFile}
        zipName="pipeline-images.zip"
        dropLabel="Drop images to run through this pipeline"
        historyLabel="Pipeline"
      />
      <HistoryPanel />
    </div>
  );
}
