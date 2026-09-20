import type { ReactElement } from "react";
import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export interface PlaceholderStateProps {
  title: string;
  description: string;
  todoNote: string;
  className?: string;
}

export function PlaceholderState({
  title,
  description,
  todoNote,
  className,
}: PlaceholderStateProps): ReactElement {
  // Hooks
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center",
        className,
      )}
    >
      <Construction className="mb-4 h-10 w-10 text-muted-foreground" />
      <span className="mb-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground uppercase">
        {t("placeholder-not-available")}
      </span>
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <code className="mt-4 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
        {todoNote}
      </code>
    </div>
  );
}
