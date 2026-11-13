'use client';

/**
 * Before/after comparison slider: the "after" image fills the frame, the
 * "before" image is clipped to the left of a draggable divider. Both images
 * share the frame so unchanged-aspect edits align pixel-for-pixel.
 */
import { useState } from 'react';

export default function CompareSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original',
  afterLabel = 'Edited',
}: {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full select-none overflow-hidden rounded-xl bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt="Edited result" className="block max-h-[520px] w-full object-contain" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow">
          ⇄
        </span>
      </div>
      <span className="absolute top-2 left-2 rounded bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
        {beforeLabel}
      </span>
      <span className="absolute top-2 right-2 rounded bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
        {afterLabel}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparison slider position"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
