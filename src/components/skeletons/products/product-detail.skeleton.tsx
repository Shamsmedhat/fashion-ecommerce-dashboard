import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4 rounded-lg border border-border p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
