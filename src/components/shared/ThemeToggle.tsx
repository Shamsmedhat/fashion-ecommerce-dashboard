import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // Hooks
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();

  // Variables
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={t("toggle-theme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(className)}
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
