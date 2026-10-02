import type { ProductFilters } from "@/features/products/types/product";
import type { CategoryFilters } from "@/features/categories/types/category";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters?: ProductFilters) => ["products", "list", filters] as const,
    detail: (id: string) => ["products", "detail", id] as const,
    bestSelling: ["products", "best-selling"] as const,
    topRating: ["products", "top-rating"] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (filters?: CategoryFilters) => ["categories", "list", filters] as const,
    main: ["categories", "main"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
    children: (id: string) => ["categories", "children", id] as const,
  },
} as const;
