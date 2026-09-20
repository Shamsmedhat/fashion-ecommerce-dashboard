import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  results?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  total,
  limit,
  results,
  onPageChange,
  className,
}: PaginationProps) {
  // Hooks
  const { t } = useTranslation();

  // Variables
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 sm:flex-row",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">
        {t("pagination-showing", {
          count: formatNumber(results ?? 0),
          total: formatNumber(total),
        })}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {t("pagination-page", {
            page: formatNumber(page),
            total: formatNumber(totalPages),
          })}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            aria-label={t("pagination-previous")}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            aria-label={t("pagination-next")}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
