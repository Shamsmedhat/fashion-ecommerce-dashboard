import type { Product } from "../types/product";

export function getStockTotal(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + (variant.stock ?? 0), 0);
}

export function getPriceBounds(product: Product): { min: number; max: number } | null {
  if (product.variants.length === 0) return null;
  const prices = product.variants.map((variant) => variant.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
