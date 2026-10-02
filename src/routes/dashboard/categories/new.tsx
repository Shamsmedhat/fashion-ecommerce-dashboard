import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useCategories } from "@/features/categories/hooks/use-categories";

export const Route = createFileRoute("/dashboard/categories/new")({
  component: NewCategoryPage,
});

function NewCategoryPage() {
  // Hooks
  const { t } = useTranslation();

  // Queries
  const { data, isLoading, isError, refetch } = useCategories({ limit: 100 });

  // Variables
  const options = data?.data.categories ?? [];

  return (
    <div>
      <PageHeader
        title={t("categories-new")}
        action={
          <Button variant="outline" asChild>
            <Link to="/dashboard/categories">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("action-back")}
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="max-w-lg space-y-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <CategoryForm parentOptions={options} />
      )}
    </div>
  );
}
