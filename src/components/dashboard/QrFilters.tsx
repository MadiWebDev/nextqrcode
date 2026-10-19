'use client';

/**
 * Dashboard list filters. Updates the URL query string via router.replace so
 * the server component re-renders with the new filter set. Debounces the
 * free-text search; selects apply immediately.
 */

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  QR_MODES,
  QR_STATUSES,
  QR_VISIBILITIES,
  type DashboardFilters,
} from '@/components/dashboard/types';

function buildParams(base: URLSearchParams, filters: DashboardFilters): string {
  const params = new URLSearchParams();
  // Preserve unrelated params (e.g. pagination added later).
  base.forEach((value, key) => {
    if (!['q', 'visibility', 'status', 'mode'].includes(key)) params.set(key, value);
  });
  if (filters.q) params.set('q', filters.q);
  if (filters.visibility) params.set('visibility', filters.visibility);
  if (filters.status) params.set('status', filters.status);
  if (filters.mode) params.set('mode', filters.mode);
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function QrFilters({ initial }: { initial: DashboardFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<DashboardFilters>(initial);
  const [searchInput, setSearchInput] = useState(initial.q);

  // Debounce free-text search → q param.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => {
        if (prev.q === searchInput) return prev;
        const next = { ...prev, q: searchInput };
        router.replace(`${pathname}${buildParams(searchParams, next)}`, { scroll: false });
        return next;
      });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function update(patch: Partial<DashboardFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    if (patch.q !== undefined) setSearchInput(patch.q);
    router.replace(`${pathname}${buildParams(searchParams, next)}`, { scroll: false });
  }

  const hasActive =
    filters.q !== '' || filters.visibility !== '' || filters.status !== '' || filters.mode !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1">
        <Label htmlFor="qr-search">Search QR codes</Label>
        <Input
          id="qr-search"
          type="search"
          placeholder="Search by title, type, or ID…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div>
        <Label htmlFor="filter-visibility">Visibility</Label>
        <Select
          value={filters.visibility || 'all'}
          onValueChange={(v) =>
            update({ visibility: v === 'all' ? '' : (v as DashboardFilters['visibility']) })
          }
        >
          <SelectTrigger id="filter-visibility" className="w-36">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {QR_VISIBILITIES.map((v) => (
              <SelectItem key={v} value={v} className="capitalize">
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-status">Status</Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) =>
            update({ status: v === 'all' ? '' : (v as DashboardFilters['status']) })
          }
        >
          <SelectTrigger id="filter-status" className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {QR_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-mode">Mode</Label>
        <Select
          value={filters.mode || 'all'}
          onValueChange={(v) =>
            update({ mode: v === 'all' ? '' : (v as DashboardFilters['mode']) })
          }
        >
          <SelectTrigger id="filter-mode" className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {QR_MODES.map((m) => (
              <SelectItem key={m} value={m} className="capitalize">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActive && (
        <button
          type="button"
          onClick={() => {
            const cleared: DashboardFilters = { q: '', visibility: '', status: '', mode: '' };
            setFilters(cleared);
            setSearchInput('');
            router.replace(`${pathname}${buildParams(searchParams, cleared)}`, { scroll: false });
          }}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
