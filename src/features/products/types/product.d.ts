export type VariantSize = "S" | "M" | "L" | "XL" | "XXL";

export interface ProductVariant {
  _id: string;
  sku: string;
  size: VariantSize;
  color: string;
  price: number;
  priceDiscount?: number;
  soldCount: number;
  stock: number;
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  coverImage: string;
  images: string[];
  variants: ProductVariant[];
  variantsNum?: number;
  ratingsAverage?: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductsResponse extends ListMeta {
  status: "success";
  data: { products: Product[] };
}

export interface ProductResponse {
  status: "success";
  data: { product: Product };
}

export interface VariantsResponse {
  status: "success";
  data: { variants: ProductVariant[] };
}

export interface UploadSignatureResponse {
  status: "success";
  data: {
    timestamp: number;
    folder: string;
    signature: string;
    cloudName: string;
    apiKey: string;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  mainCategory?: string;
  "variants.color"?: string;
  "variants.size"?: string;
}
