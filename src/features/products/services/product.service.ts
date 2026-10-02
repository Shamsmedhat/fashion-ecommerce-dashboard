import { apiFetch } from "@/services/api";
import { buildQueryString } from "@/utils/build-query-string";
import type {
  ProductCreateFields,
  ProductEditFields,
} from "../schemas/product.schema";
import type {
  ProductResponse,
  ProductsResponse,
  VariantsResponse,
} from "../types/product";
import { uploadProductImagesService } from "./upload.service";

export interface VariantInput {
  size?: string;
  color?: string;
  price: number;
  stock: number;
  priceDiscount?: number;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  categoryId: string;
  coverImage: string;
  images: string[];
  variants: VariantInput[];
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  categoryId?: string;
  coverImage?: string;
  images?: string[];
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

// The API accepts JSON with Cloudinary URLs only, so the files are uploaded first.
export async function createProductService(
  fields: ProductCreateFields,
): Promise<ProductResponse> {
  const [coverImage, ...images] = await uploadProductImagesService([
    fields.coverImage[0],
    ...fields.images,
  ]);

  const body: ProductCreateInput = {
    name: fields.name,
    description: fields.description,
    categoryId: fields.categoryId,
    coverImage,
    images,
    variants: fields.variants,
  };

  return apiFetch<ProductResponse>("/products", {
    method: "POST",
    body,
  });
}

// Image fields are sent only when new files were picked; a new gallery replaces the old one.
export async function updateProductService(
  id: string,
  fields: ProductEditFields,
): Promise<ProductResponse> {
  const newCover = fields.coverImage[0];
  const urls = await uploadProductImagesService([
    ...(newCover ? [newCover] : []),
    ...fields.images,
  ]);
  const images = newCover ? urls.slice(1) : urls;

  const body: ProductUpdateInput = {
    name: fields.name,
    description: fields.description,
    categoryId: fields.categoryId,
    ...(newCover ? { coverImage: urls[0] } : {}),
    ...(images.length > 0 ? { images } : {}),
  };

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
