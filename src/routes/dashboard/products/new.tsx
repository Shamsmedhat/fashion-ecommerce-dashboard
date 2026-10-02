import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductDetailSkeleton } from "@/components/skeletons/products/product-detail.skeleton";
import { ProductCreateForm } from "@/features/products/components/ProductCreateForm";
import { useCategories } from "@/features/categories/hooks/use-categories";

export const Route = createFileRoute("/dashboard/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  // Hooks
  const { t } = useTranslation();

  // Queries
  const { data, isLoading, isError, refetch } = useCategories({ limit: 100 });

  // Variables
  const categories = data?.data.categories ?? [];

  return (
    <div>
      <PageHeader
        title={t("products-new")}
        action={
          <Button variant="outline" asChild>
            <Link to="/dashboard/products">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("action-back")}
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ProductCreateForm categories={categories} />
      )}
    </div>
  );
}
