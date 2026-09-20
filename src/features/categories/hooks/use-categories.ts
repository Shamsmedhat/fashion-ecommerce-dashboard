import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { STALE_TIMES } from "@/config/query.config";
import {
  getCategoriesService,
  getCategoryService,
  getMainCategoriesService,
} from "../services/category.service";
import type { CategoryFilters } from "../types/category";

export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () => getCategoriesService(filters),
    staleTime: STALE_TIMES.STANDARD,
  });
}

export function useMainCategories() {
  return useQuery({
    queryKey: queryKeys.categories.main,
    queryFn: () => getMainCategoriesService(),
    staleTime: STALE_TIMES.LONG,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategoryService(id),
    enabled: Boolean(id),
    staleTime: STALE_TIMES.STANDARD,
  });
}
