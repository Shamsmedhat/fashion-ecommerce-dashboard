import { Link } from "@tanstack/react-router";
import { ImageOff, Star } from "lucide-react";

import { formatNumber, formatPriceRange } from "@/utils/format";
import { getPriceBounds } from "../utils/product-stats";
import type { Product } from "../types/product";

interface ProductMiniListProps {
  products: Product[];
  showRating?: boolean;
}

export function ProductMiniList({ products, showRating }: ProductMiniListProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const bounds = getPriceBounds(product);
        return (
          <li key={product._id}>
            <Link
              to="/dashboard/products/$id"
              params={{ id: product._id }}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
            >
              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {bounds ? formatPriceRange(bounds.min, bounds.max) : "—"}
                </p>
              </div>
              {showRating && product.ratingsAverage ? (
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {formatNumber(product.ratingsAverage)}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
