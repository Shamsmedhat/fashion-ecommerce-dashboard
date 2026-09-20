import { apiFetch } from "@/services/api";
import { buildQueryString } from "@/utils/build-query-string";
import type {
  CategoriesResponse,
  CategoryFilters,
  CategoryResponse,
} from "../types/category";

export interface CategoryInput {
  name: string;
  parentId?: string | null;
}

export async function getCategoriesService(
  filters?: CategoryFilters,
): Promise<CategoriesResponse> {
  const query = filters ? buildQueryString({ ...filters }) : "";
  return apiFetch<CategoriesResponse>(`/categories${query ? `?${query}` : ""}`);
}

export async function getMainCategoriesService(): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>("/categories/main");
}

export async function getCategoryService(id: string): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/categories/${id}`);
}

export async function getCategoryChildrenService(
  id: string,
): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>(`/categories/children/${id}`);
}

export async function createCategoryService(
  input: CategoryInput,
): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>("/categories", {
    method: "POST",
    body: input,
  });
}

export async function updateCategoryService(
  id: string,
  input: Partial<CategoryInput>,
): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/categories/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteCategoryService(id: string): Promise<void> {
  await apiFetch<undefined>(`/categories/${id}`, { method: "DELETE" });
}
