import type { ReactElement } from "react";
import { LogOut, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/store/auth.store";
import { getInitials } from "@/utils/format";

interface DashboardTopbarProps {
  onOpenSidebar: () => void;
}

export function DashboardTopbar({ onOpenSidebar }: DashboardTopbarProps): ReactElement {
  // Hooks
  const { t } = useTranslation();
  const { logout } = useLogout();

  // Store
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
      {/* Sidebar toggle (drawer mode only) */}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("nav-open-menu")}
        onClick={onOpenSidebar}
        className="lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      <LanguageSwitcher />
      <ThemeToggle />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 ps-1.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">
                {getInitials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {user?.name ?? t("admin")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate text-sm font-medium">{user?.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
