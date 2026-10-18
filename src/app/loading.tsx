import { Skeleton } from '@/components/ui/skeleton';

/** Root loading state — skeleton shell shown during route transitions. */
export default function Loading() {
  return (
    <div className="page-wrap" aria-busy="true" aria-label="Loading">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
