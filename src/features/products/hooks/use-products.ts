import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { STALE_TIMES } from "@/config/query.config";
import {
  getBestSellingService,
  getProductService,
  getProductsService,
  getTopRatingService,
} from "../services/product.service";
import type { ProductFilters } from "../types/product";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProductsService(filters as Record<string, string | number | undefined>),
    staleTime: STALE_TIMES.STANDARD,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductService(id),
    enabled: Boolean(id),
    staleTime: STALE_TIMES.STANDARD,
  });
}

export function useBestSelling() {
  return useQuery({
    queryKey: queryKeys.products.bestSelling,
    queryFn: () => getBestSellingService(),
    staleTime: STALE_TIMES.LONG,
  });
}

export function useTopRating() {
  return useQuery({
    queryKey: queryKeys.products.topRating,
    queryFn: () => getTopRatingService(),
    staleTime: STALE_TIMES.LONG,
  });
}
