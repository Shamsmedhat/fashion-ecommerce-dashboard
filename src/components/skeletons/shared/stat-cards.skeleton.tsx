import { Skeleton } from "@/components/ui/skeleton";

interface StatCardsSkeletonProps {
  count?: number;
}

export function StatCardsSkeleton({ count = 3 }: StatCardsSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ProductTilesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-lg border border-border p-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
