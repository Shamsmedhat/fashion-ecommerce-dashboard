import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import type { Category } from "../types/category";

interface CategoriesTableProps {
  categories: Category[];
  parentName: (parentId: string | null) => string;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  parentName,
  onDelete,
}: CategoriesTableProps) {
  // Hooks
  const { t } = useTranslation();

  // Variables
  const columns: DataTableColumn<Category>[] = [
    {
      id: "name",
      header: t("col-name"),
      cell: (category) => <span className="font-medium">{category.name}</span>,
    },
    {
      id: "slug",
      header: t("col-slug"),
      cell: (category) => (
        <span className="text-muted-foreground">{category.slug}</span>
      ),
    },
    {
      id: "path",
      header: t("col-path"),
      cell: (category) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{category.path}</code>
      ),
    },
    {
      id: "parent",
      header: t("col-parent"),
      cell: (category) => (
        <span className="text-muted-foreground">{parentName(category.parentId)}</span>
      ),
    },
    {
      id: "created",
      header: t("col-created"),
      cell: (category) => (
        <span className="text-muted-foreground">{formatDate(category.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("actions")}</span>,
      headClassName: "text-end",
      cellClassName: "text-end",
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label={t("action-edit")}>
            <Link to="/dashboard/categories/$id" params={{ id: category._id }}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("action-delete")}
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={categories} getRowId={(row) => row._id} />;
}
