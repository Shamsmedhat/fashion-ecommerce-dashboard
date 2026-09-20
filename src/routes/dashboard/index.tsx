import { createFileRoute } from "@tanstack/react-router";
import { FolderTree, Layers, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProductTilesSkeleton,
  StatCardsSkeleton,
} from "@/components/skeletons/shared/stat-cards.skeleton";
import { ProductMiniList } from "@/features/products/components/ProductMiniList";
import {
  useBestSelling,
  useProducts,
  useTopRating,
} from "@/features/products/hooks/use-products";
import {
  useCategories,
  useMainCategories,
} from "@/features/categories/hooks/use-categories";
import { formatNumber } from "@/utils/format";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  // Hooks
  const { t } = useTranslation();

  // Queries
  const productsCount = useProducts({ limit: 1 });
  const categoriesCount = useCategories({ limit: 1 });
  const mainCategories = useMainCategories();
  const bestSelling = useBestSelling();
  const topRating = useTopRating();

  // Variables
  const kpiLoading =
    productsCount.isLoading || categoriesCount.isLoading || mainCategories.isLoading;
  const kpiError =
    productsCount.isError || categoriesCount.isError || mainCategories.isError;

  const kpis = [
    {
      key: "products",
      label: t("kpi-total-products"),
      value: productsCount.data?.total ?? 0,
      Icon: Package,
    },
    {
      key: "categories",
      label: t("kpi-total-categories"),
      value: categoriesCount.data?.total ?? 0,
      Icon: FolderTree,
    },
    {
      key: "main",
      label: t("kpi-main-categories"),
      value: mainCategories.data?.total ?? mainCategories.data?.results ?? 0,
      Icon: Layers,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={t("overview-title")} description={t("overview-subtitle")} />

      {/* KPIs */}
      {kpiLoading ? (
        <StatCardsSkeleton count={3} />
      ) : kpiError ? (
        <ErrorState
          onRetry={() => {
            void productsCount.refetch();
            void categoriesCount.refetch();
            void mainCategories.refetch();
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map(({ key, label, value, Icon }) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="font-serif text-3xl font-bold">{formatNumber(value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">{t("overview-metrics-note")}</p>

      {/* Best sellers */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold">{t("best-sellers")}</h2>
        {bestSelling.isLoading ? (
          <ProductTilesSkeleton count={6} />
        ) : bestSelling.isError ? (
          <ErrorState onRetry={() => bestSelling.refetch()} />
        ) : (bestSelling.data?.data.products.length ?? 0) === 0 ? (
          <EmptyState title={t("overview-no-products")} />
        ) : (
          <ProductMiniList products={bestSelling.data?.data.products ?? []} />
        )}
      </section>

      {/* Top rated */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold">{t("top-rated")}</h2>
        {topRating.isLoading ? (
          <ProductTilesSkeleton count={6} />
        ) : topRating.isError ? (
          <ErrorState onRetry={() => topRating.refetch()} />
        ) : (topRating.data?.data.products.length ?? 0) === 0 ? (
          <EmptyState title={t("overview-no-products")} />
        ) : (
          <ProductMiniList products={topRating.data?.data.products ?? []} showRating />
        )}
      </section>
    </div>
  );
}
