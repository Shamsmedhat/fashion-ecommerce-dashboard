import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  // Hooks
  const { t, i18n } = useTranslation();

  // Functions
  function changeLanguage(lng: string) {
    void i18n.changeLanguage(lng);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("language")}
          className={cn(className)}
        >
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={cn(i18n.resolvedLanguage === lng && "font-semibold")}
          >
            {t(`language-${lng}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
