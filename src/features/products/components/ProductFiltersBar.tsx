import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VARIANT_SIZES } from "@/config/constants";
import type { Category } from "@/features/categories/types/category";

const ALL = "__all__";

export interface ProductFilterValues {
  sort: string;
  mainCategory?: string;
  color?: string;
  size?: string;
}

interface ProductFiltersBarProps {
  categories: Category[];
  values: ProductFilterValues;
  nameQuery: string;
  onNameQueryChange: (value: string) => void;
  onChange: (patch: Partial<ProductFilterValues>) => void;
}

const sortOptions = [
  { value: "-createdAt", labelKey: "products-sort-newest" },
  { value: "createdAt", labelKey: "products-sort-oldest" },
  { value: "name", labelKey: "products-sort-name-asc" },
  { value: "-name", labelKey: "products-sort-name-desc" },
  { value: "-variants.price", labelKey: "products-sort-price-desc" },
] as const;

export function ProductFiltersBar({
  categories,
  values,
  nameQuery,
  onNameQueryChange,
  onChange,
}: ProductFiltersBarProps) {
  // Hooks
  const { t } = useTranslation();

  // State
  const [colorDraft, setColorDraft] = useState(values.color ?? "");

  // Functions
  function commitColor() {
    onChange({ color: colorDraft.trim() || undefined });
  }

  return (
    <div className="grid gap-4 rounded-lg border border-border p-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Client-side name search */}
      <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
        <Label>{t("products-search-label")}</Label>
        <div className="relative">
          <Search className="absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-2.5" />
          <Input
            value={nameQuery}
            onChange={(e) => onNameQueryChange(e.target.value)}
            placeholder={t("products-search-placeholder")}
            className="ps-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">{t("products-search-hint")}</p>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label>{t("products-filter-category")}</Label>
        <Select
          value={values.mainCategory ?? ALL}
          onValueChange={(value) =>
            onChange({ mainCategory: value === ALL ? undefined : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("products-filter-all")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div className="space-y-1.5">
        <Label>{t("products-filter-size")}</Label>
        <Select
          value={values.size ?? ALL}
          onValueChange={(value) =>
            onChange({ size: value === ALL ? undefined : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("products-filter-all")}</SelectItem>
            {VARIANT_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <Label>{t("products-filter-color")}</Label>
        <Input
          value={colorDraft}
          onChange={(e) => setColorDraft(e.target.value)}
          onBlur={commitColor}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitColor();
          }}
          placeholder={t("products-filter-color")}
        />
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label>{t("products-sort")}</Label>
        <Select value={values.sort} onValueChange={(value) => onChange({ sort: value })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
