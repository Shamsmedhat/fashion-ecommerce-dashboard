export interface Category {
  _id: string;
  name: string;
  slug: string;
  path: string;
  parentId: string | null;
  createdAt: string;
}

export interface CategoriesResponse extends ListMeta {
  status: "success";
  data: { categories: Category[] };
}

export interface CategoryResponse {
  status: "success";
  data: { category: Category };
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  sort?: string;
  parentId?: string;
}
