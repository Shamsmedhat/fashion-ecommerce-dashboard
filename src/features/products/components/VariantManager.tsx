import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/utils/format";
import { useDeleteVariant } from "../hooks/use-variant-mutations";
import { VariantFormDialog } from "./VariantFormDialog";
import type { ProductVariant } from "../types/product";

interface VariantManagerProps {
  productId: string;
  variants: ProductVariant[];
}

export function VariantManager({ productId, variants }: VariantManagerProps) {
  // Hooks
  const { t } = useTranslation();

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [toDelete, setToDelete] = useState<ProductVariant | null>(null);

  // Mutation
  const { isPending: isDeleting, deleteVariant } = useDeleteVariant(productId);

  // Variables — the API refuses to delete a product's only variant.
  const isLastVariant = variants.length <= 1;

  // Functions
  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(variant: ProductVariant) {
    setEditing(variant);
    setDialogOpen(true);
  }

  function onConfirmDelete() {
    if (!toDelete) return;
    deleteVariant(toDelete._id, { onSettled: () => setToDelete(null) });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold">{t("variants")}</h2>
          <p className="text-xs text-muted-foreground">{t("variants-note")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          {t("variant-add")}
        </Button>
      </div>

      {variants.length === 0 ? (
        <EmptyState title={t("state-empty-title")} />
      ) : (
        <ul className="divide-y divide-border">
          {variants.map((variant) => (
            <li
              key={variant._id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{variant.size}</Badge>
                <span className="text-sm capitalize">{variant.color}</span>
                <span className="text-xs text-muted-foreground">{variant.sku}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {formatCurrency(variant.price)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("field-stock")}: {formatNumber(variant.stock)}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("action-edit")}
                    onClick={() => openEdit(variant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("action-delete")}
                    title={isLastVariant ? t("variant-keep-one") : undefined}
                    disabled={isLastVariant}
                    onClick={() => setToDelete(variant)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <VariantFormDialog
        productId={productId}
        variant={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("variant-delete-title")}
        description={t("variant-delete-description")}
        onConfirm={onConfirmDelete}
        confirmLabel={t("action-delete")}
        isPending={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
