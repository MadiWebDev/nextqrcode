'use client';

/** 30-day scan time series (Recharts area chart). */

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyScans } from '@/components/dashboard/types';

function shortLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? isoDate
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function ScanChart({ data }: { data: DailyScans[] }) {
  const total = data.reduce((n, d) => n + d.scans, 0);
  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No scans in the last 30 days yet.
      </p>
    );
  }
  return (
    <div className="h-64 w-full" role="img" aria-label="Scans per day over the last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={shortLabel}
            tick={{ fontSize: 12 }}
            minTickGap={28}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(label) => shortLabel(String(label ?? ''))}
            formatter={(value) => [value, 'Scans']}
          />
          <Area
            type="monotone"
            dataKey="scans"
            name="Scans"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
