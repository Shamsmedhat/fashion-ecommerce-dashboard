import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderState } from "@/components/shared/PlaceholderState";

// TODO(backend): needs GET /orders, GET /orders/:id, PATCH /orders/:id (no admin order endpoints exist yet)
export const Route = createFileRoute("/dashboard/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  // Hooks
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav-orders")} description={t("overview-subtitle")} />
      <PlaceholderState
        title={t("orders-placeholder-title")}
        description={t("orders-placeholder-desc")}
        todoNote="TODO(backend): GET /orders"
      />
    </div>
  );
}
