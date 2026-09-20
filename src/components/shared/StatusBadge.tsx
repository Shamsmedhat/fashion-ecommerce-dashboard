import type { ReactElement } from "react";

export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "pre-order"
  | "discontinued";

const config: Record<
  InventoryStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  "in-stock": {
    label: "In Stock",
    badgeClass: "badge-success",
    dotClass: "dot dot-success",
  },
  "low-stock": {
    label: "Low Stock",
    badgeClass: "badge-danger",
    dotClass: "dot dot-danger",
  },
  "pre-order": {
    label: "Pre-Order",
    badgeClass: "badge-warning",
    dotClass: "dot dot-warning",
  },
  discontinued: {
    label: "Discontinued",
    badgeClass: "badge-warning",
    dotClass: "dot dot-warning",
  },
};

export function StatusBadge({
  status,
}: {
  status: InventoryStatus;
}): ReactElement {
  const { label, badgeClass, dotClass } = config[status];

  return (
    <span className={badgeClass}>
      <span className={dotClass} />
      {label}
    </span>
  );
}
