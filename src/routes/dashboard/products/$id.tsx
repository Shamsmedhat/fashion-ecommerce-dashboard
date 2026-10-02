import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductDetailSkeleton } from "@/components/skeletons/products/product-detail.skeleton";
import { ProductEditForm } from "@/features/products/components/ProductEditForm";
import { VariantManager } from "@/features/products/components/VariantManager";
import { useProduct } from "@/features/products/hooks/use-products";
import { useDeleteProduct } from "@/features/products/hooks/use-product-mutations";
import { useCategories } from "@/features/categories/hooks/use-categories";

export const Route = createFileRoute("/dashboard/products/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  // Navigation
  const { id } = Route.useParams();

  // Hooks
  const { t } = useTranslation();

  // State
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Queries
  const { data, isLoading, isError, refetch } = useProduct(id);
  const categoriesQuery = useCategories({ limit: 100 });

  // Mutation
  const { isPending: isDeleting, deleteProduct } = useDeleteProduct();

  // Variables
  const product = data?.data.product;
  const categories = categoriesQuery.data?.data.categories ?? [];

  return (
    <div>
      <PageHeader
        title={product?.name ?? t("nav-products")}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard/products">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t("action-back")}
              </Link>
            </Button>
            {product ? (
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
                {t("action-delete")}
              </Button>
            ) : null}
          </div>
        }
      />

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !product ? (
        <EmptyState title={t("product-not-found")} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-border p-6">
            <h2 className="font-serif text-lg font-bold">{t("product-core-details")}</h2>
            <ProductEditForm product={product} categories={categories} />
          </div>
          <VariantManager productId={product._id} variants={product.variants} />
        </div>
      )}

      {product ? (
        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title={t("product-delete-title")}
          description={t("product-delete-description")}
          onConfirm={() => deleteProduct(product._id)}
          confirmLabel={t("action-delete")}
          isPending={isDeleting}
          variant="destructive"
        />
      ) : null}
    </div>
  );
}
