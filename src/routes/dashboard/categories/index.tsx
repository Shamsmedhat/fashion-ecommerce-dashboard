import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/skeletons/shared/table.skeleton";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useDeleteCategory } from "@/features/categories/hooks/use-category-mutations";
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "@/config/constants";
import type { Category } from "@/features/categories/types/category";

const searchSchema = z.object({
  page: z.number().int().min(1).catch(DEFAULT_PAGE).default(DEFAULT_PAGE),
  limit: z.number().int().min(1).max(100).catch(DEFAULT_LIMIT).default(DEFAULT_LIMIT),
  sort: z.string().catch(DEFAULT_SORT).default(DEFAULT_SORT),
});

export const Route = createFileRoute("/dashboard/categories/")({
  validateSearch: searchSchema,
  component: CategoriesPage,
});

function CategoriesPage() {
  // Navigation
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, limit, sort } = Route.useSearch();

  // Hooks
  const { t } = useTranslation();

  // State
  const [toDelete, setToDelete] = useState<Category | null>(null);

  // Queries
  const { data, isLoading, isError, refetch } = useCategories({ page, limit, sort });
  const allCategories = useCategories({ limit: 100 });

  // Mutation
  const { isPending: isDeleting, deleteCategory } = useDeleteCategory();

  // Variables
  const categories = data?.data.categories ?? [];
  const total = data?.total ?? 0;
  const lookup = new Map(
    (allCategories.data?.data.categories ?? []).map((c) => [c._id, c.name]),
  );

  // Functions
  function parentName(parentId: string | null): string {
    if (!parentId) return t("category-parent-none");
    return lookup.get(parentId) ?? parentId;
  }

  function onConfirmDelete() {
    if (!toDelete) return;
    deleteCategory(toDelete._id, { onSettled: () => setToDelete(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("categories-title")}
        description={t("categories-subtitle")}
        action={
          <Button asChild>
            <Link to="/dashboard/categories/new">
              <Plus className="h-4 w-4" />
              {t("categories-new")}
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton columns={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState title={t("state-empty-title")} description={t("state-empty-description")} />
      ) : (
        <div className="space-y-4">
          <CategoriesTable
            categories={categories}
            parentName={parentName}
            onDelete={setToDelete}
          />
          <Pagination
            page={page}
            total={total}
            limit={limit}
            results={categories.length}
            onPageChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("category-delete-title")}
        description={t("category-delete-description")}
        onConfirm={onConfirmDelete}
        confirmLabel={t("action-delete")}
        isPending={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
