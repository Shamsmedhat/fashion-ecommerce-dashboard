import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderState } from "@/components/shared/PlaceholderState";

// TODO(backend): needs GET /reviews, DELETE /reviews/:id (review model exists but has no routes/controller)
export const Route = createFileRoute("/dashboard/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  // Hooks
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav-reviews")} description={t("overview-subtitle")} />
      <PlaceholderState
        title={t("reviews-placeholder-title")}
        description={t("reviews-placeholder-desc")}
        todoNote="TODO(backend): GET /reviews"
      />
    </div>
  );
}
