import type { ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps): ReactElement {
  // Hooks
  const { t } = useTranslation();

  // Variables
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        {/* Decorative grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.06]"
        />
        <BrandMark tone="invert" size="md" className="relative" />

        <div className="relative max-w-md space-y-4">
          <h2 className="font-serif text-4xl leading-tight font-bold">
            {t("auth-hero-title")}
          </h2>
          <p className="text-sm leading-relaxed text-current/70">
            {t("auth-hero-subtitle")}
          </p>
        </div>

        <p className="relative text-xs tracking-wide text-current/60">
          {t("auth-rights", { year })}
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col bg-background text-foreground">
        <div className="flex items-center justify-end gap-2 p-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm space-y-8">
            {/* Mobile brand */}
            <div className="flex justify-center lg:hidden">
              <BrandMark size="lg" />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
