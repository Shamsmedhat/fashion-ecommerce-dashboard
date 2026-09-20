import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "invert";
}

const SIZES = {
  sm: { box: "size-8 text-xs", name: "text-xs", tag: "text-[9px]" },
  md: { box: "size-9 text-sm", name: "text-sm", tag: "text-[10px]" },
  lg: { box: "size-12 text-lg", name: "text-base", tag: "text-[11px]" },
} as const;

export function BrandMark({
  className,
  showText = true,
  size = "md",
  tone = "default",
}: BrandMarkProps): ReactElement {
  // Hooks
  const { t } = useTranslation();

  // Variables
  const dims = SIZES[size];
  const isInvert = tone === "invert";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Monogram */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center font-serif font-bold",
          dims.box,
          isInvert
            ? "border border-current/25 bg-current/10 text-current"
            : "bg-primary text-primary-foreground",
        )}
      >
        FE
      </div>

      {/* Wordmark */}
      {showText ? (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-serif font-bold tracking-wide", dims.name)}>
            {t("app-name")}
          </span>
          <span
            className={cn(
              "font-medium uppercase tracking-[0.18em]",
              dims.tag,
              isInvert ? "text-current/70" : "text-muted-foreground",
            )}
          >
            {t("app-tagline")}
          </span>
        </div>
      ) : null}
    </div>
  );
}
