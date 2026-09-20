import { Link } from "@tanstack/react-router";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber, formatPriceRange } from "@/utils/format";
import { getPriceBounds, getStockTotal } from "../utils/product-stats";
import type { Product } from "../types/product";

interface ProductsTableProps {
  products: Product[];
  categoryName: (categoryId: string) => string;
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  categoryName,
  onDelete,
}: ProductsTableProps) {
  // Hooks
  const { t } = useTranslation();

  // Variables
  const columns: DataTableColumn<Product>[] = [
    {
      id: "cover",
      header: t("col-cover"),
      cell: (product) =>
        product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.name}
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            <ImageOff className="h-4 w-4 text-muted-foreground" />
          </div>
        ),
    },
    {
      id: "name",
      header: t("col-name"),
      cell: (product) => (
        <Link
          to="/dashboard/products/$id"
          params={{ id: product._id }}
          className="font-medium hover:underline"
        >
          {product.name}
        </Link>
      ),
    },
    {
      id: "category",
      header: t("col-category"),
      cell: (product) => (
        <span className="text-muted-foreground">{categoryName(product.categoryId)}</span>
      ),
    },
    {
      id: "price",
      header: t("col-price-range"),
      cell: (product) => {
        const bounds = getPriceBounds(product);
        return bounds ? formatPriceRange(bounds.min, bounds.max) : "—";
      },
    },
    {
      id: "variants",
      header: t("col-variants"),
      cell: (product) => (
        <Badge variant="secondary">{formatNumber(product.variants.length)}</Badge>
      ),
    },
    {
      id: "stock",
      header: t("col-stock"),
      cell: (product) => formatNumber(getStockTotal(product)),
    },
    {
      id: "created",
      header: t("col-created"),
      cell: (product) => (
        <span className="text-muted-foreground">{formatDate(product.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("actions")}</span>,
      headClassName: "text-end",
      cellClassName: "text-end",
      cell: (product) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label={t("action-edit")}>
            <Link to="/dashboard/products/$id" params={{ id: product._id }}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("action-delete")}
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={products} getRowId={(row) => row._id} />;
}
