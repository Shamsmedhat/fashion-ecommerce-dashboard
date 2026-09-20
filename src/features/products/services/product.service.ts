import { apiFetch } from "@/services/api";
import { buildQueryString } from "@/utils/build-query-string";
import type {
  ProductResponse,
  ProductsResponse,
  VariantsResponse,
} from "../types/product";

export interface VariantInput {
  size?: string;
  color?: string;
  price: number;
  stock: number;
  priceDiscount?: number;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  categoryId?: string;
}

export async function getProductsService(
  filters?: Record<string, string | number | undefined>,
): Promise<ProductsResponse> {
  const query = filters ? buildQueryString({ ...filters }) : "";
  return apiFetch<ProductsResponse>(`/products${query ? `?${query}` : ""}`);
}

export async function getBestSellingService(): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>("/products/best-selling");
}

export async function getTopRatingService(): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>("/products/top-rating");
}

export async function getProductService(id: string): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`);
}

export async function getProductVariantsService(
  id: string,
): Promise<VariantsResponse> {
  return apiFetch<VariantsResponse>(`/products/${id}/variants`);
}

export async function createProductService(
  formData: FormData,
): Promise<ProductResponse> {
  return apiFetch<ProductResponse>("/products", {
    method: "POST",
    body: formData,
  });
}

// Accepts FormData (when images change) or a plain JSON body otherwise.
export async function updateProductService(
  id: string,
  body: FormData | ProductUpdateInput,
): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteProductService(id: string): Promise<void> {
  await apiFetch<undefined>(`/products/${id}`, { method: "DELETE" });
}

export async function createVariantService(
  id: string,
  input: VariantInput,
): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}/variants`, {
    method: "POST",
    body: input,
  });
}

export async function updateVariantService(
  id: string,
  varId: string,
  input: Partial<VariantInput>,
): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}/variants/${varId}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteVariantService(id: string, varId: string): Promise<void> {
  await apiFetch<undefined>(`/products/${id}/variants/${varId}`, {
    method: "DELETE",
  });
}
