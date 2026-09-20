import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderState } from "@/components/shared/PlaceholderState";

// TODO(backend): needs GET /users, GET /users/:id (no admin customer endpoints exist yet)
export const Route = createFileRoute("/dashboard/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  // Hooks
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav-customers")} description={t("overview-subtitle")} />
      <PlaceholderState
        title={t("customers-placeholder-title")}
        description={t("customers-placeholder-desc")}
        todoNote="TODO(backend): GET /users"
      />
    </div>
  );
}
