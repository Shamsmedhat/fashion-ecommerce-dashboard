import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/skeletons/shared/table.skeleton";
import {
  ProductFiltersBar,
  type ProductFilterValues,
} from "@/features/products/components/ProductFiltersBar";
import { ProductsTable } from "@/features/products/components/ProductsTable";
import { useProducts } from "@/features/products/hooks/use-products";
import { useDeleteProduct } from "@/features/products/hooks/use-product-mutations";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "@/config/constants";
import type { Product, ProductFilters } from "@/features/products/types/product";

const searchSchema = z.object({
  page: z.number().int().min(1).catch(DEFAULT_PAGE).default(DEFAULT_PAGE),
  limit: z.number().int().min(1).max(100).catch(DEFAULT_LIMIT).default(DEFAULT_LIMIT),
  sort: z.string().catch(DEFAULT_SORT).default(DEFAULT_SORT),
  mainCategory: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
});

export const Route = createFileRoute("/dashboard/products/")({
  validateSearch: searchSchema,
  component: ProductsPage,
});

function ProductsPage() {
  // Navigation
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  // Hooks
  const { t } = useTranslation();

  // State
  const [nameQuery, setNameQuery] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  // Queries
  const filters: ProductFilters = {
    page: search.page,
    limit: search.limit,
    sort: search.sort,
    mainCategory: search.mainCategory,
    "variants.color": search.color,
    "variants.size": search.size,
  };
  const { data, isLoading, isError, refetch } = useProducts(filters);
  const categoriesQuery = useCategories({ limit: 200 });

  // Mutation
  const { isPending: isDeleting, deleteProduct } = useDeleteProduct();

  // Variables
  const allProducts = data?.data.products ?? [];
  const products = nameQuery
    ? allProducts.filter((product) =>
        product.name.toLowerCase().includes(nameQuery.toLowerCase()),
      )
    : allProducts;
  const total = data?.total ?? 0;
  const categoryLookup = new Map(
    (categoriesQuery.data?.data.categories ?? []).map((c) => [c._id, c.name]),
  );
  const filterValues: ProductFilterValues = {
    sort: search.sort,
    mainCategory: search.mainCategory,
    color: search.color,
    size: search.size,
  };

  // Functions
  function categoryName(categoryId: string): string {
    return categoryLookup.get(categoryId) ?? categoryId;
  }

  function onFilterChange(patch: Partial<ProductFilterValues>) {
    navigate({ search: (prev) => ({ ...prev, ...patch, page: DEFAULT_PAGE }) });
  }

  function onConfirmDelete() {
    if (!toDelete) return;
    deleteProduct(toDelete._id, { onSettled: () => setToDelete(null) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products-title")}
        description={t("products-subtitle")}
        action={
          <Button asChild>
            <Link to="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              {t("products-new")}
            </Link>
          </Button>
        }
      />

      <ProductFiltersBar
        categories={categoriesQuery.data?.data.categories ?? []}
        values={filterValues}
        nameQuery={nameQuery}
        onNameQueryChange={setNameQuery}
        onChange={onFilterChange}
      />

      {isLoading ? (
        <TableSkeleton columns={7} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : products.length === 0 ? (
        <EmptyState title={t("state-empty-title")} description={t("state-empty-description")} />
      ) : (
        <div className="space-y-4">
          <ProductsTable
            products={products}
            categoryName={categoryName}
            onDelete={setToDelete}
          />
          <Pagination
            page={search.page}
            total={total}
            limit={search.limit}
            results={allProducts.length}
            onPageChange={(next) =>
              navigate({ search: (prev) => ({ ...prev, page: next }) })
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("product-delete-title")}
        description={t("product-delete-description")}
        onConfirm={onConfirmDelete}
        confirmLabel={t("action-delete")}
        isPending={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
