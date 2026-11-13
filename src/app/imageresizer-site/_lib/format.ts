/** Small display formatting helpers shared by the image tools. */

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value >= 100 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
}

export function formatPercentChange(before: number, after: number): string {
  if (before <= 0) return '—';
  const change = ((after - before) / before) * 100;
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/** Parse a KB/MB target the user typed ("100", "100KB", "1 MB") into bytes. */
export function parseTargetSize(input: string): number | null {
  const m = /^\s*([\d.]+)\s*(kb|mb|k|m|b)?\s*$/i.exec(input);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  const unit = (m[2] ?? 'kb').toLowerCase();
  if (unit === 'mb' || unit === 'm') return Math.round(value * 1024 * 1024);
  if (unit === 'b') return Math.round(value);
  return Math.round(value * 1024);
}
