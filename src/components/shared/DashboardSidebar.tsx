import type { ReactElement } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

import { BrandMark } from "@/components/shared/BrandMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { labelKey: "nav-dashboard", to: "/dashboard", Icon: LayoutDashboard, exact: true },
  { labelKey: "nav-products", to: "/dashboard/products", Icon: Package, exact: false },
  { labelKey: "nav-categories", to: "/dashboard/categories", Icon: FolderTree, exact: false },
  { labelKey: "nav-orders", to: "/dashboard/orders", Icon: ShoppingBag, exact: false },
  { labelKey: "nav-customers", to: "/dashboard/customers", Icon: Users, exact: false },
  { labelKey: "nav-reviews", to: "/dashboard/reviews", Icon: MessageSquareText, exact: false },
] as const;

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps): ReactElement {
  // Router
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hooks
  const { t } = useTranslation();

  return (
    <>
      {/* Backdrop (drawer mode only) */}
      {isOpen ? (
        <button
          type="button"
          aria-label={t("nav-close-menu")}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "flex w-64 shrink-0 flex-col border-e border-border bg-card",
          // Below lg: an off-canvas drawer sliding in from the start edge (LTR and RTL).
          "max-lg:fixed max-lg:inset-y-0 max-lg:start-0 max-lg:z-40 max-lg:transition-transform",
          !isOpen && "max-lg:invisible max-lg:-translate-x-full max-lg:rtl:translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <BrandMark size="sm" />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("nav-close-menu")}
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ labelKey, to, Icon, exact }) => {
            const isActive = exact
              ? pathname === to || pathname === `${to}/`
              : pathname === to || pathname.startsWith(`${to}/`);

            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer nav */}
        <div className="border-t border-border p-3">
          <Link
            to="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/dashboard/settings")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("nav-settings")}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
