import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 6, columns = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3 rounded-lg border border-border p-4", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-5 flex-1", colIndex === 0 && "max-w-12")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
