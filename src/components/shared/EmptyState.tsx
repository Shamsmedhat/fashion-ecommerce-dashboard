import type { ReactElement, ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center",
        className,
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-muted-foreground" />
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
