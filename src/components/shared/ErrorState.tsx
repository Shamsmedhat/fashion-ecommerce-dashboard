import type { ReactElement } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps): ReactElement {
  // Hooks
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-12 text-center",
        className,
      )}
    >
      <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
      <p className="text-base font-medium text-foreground">
        {title ?? t("state-error-title")}
      </p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {message ?? t("state-error-generic")}
      </p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {t("action-retry")}
        </Button>
      ) : null}
    </div>
  );
}
