import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { revalidateStorefront } from "@/services/revalidate";
import { getErrorMessage } from "@/utils/catch-error";
import {
  createProductService,
  deleteProductService,
  updateProductService,
  type ProductUpdateInput,
} from "../services/product.service";

export function useCreateProduct() {
  // Navigation
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (formData: FormData) => createProductService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      revalidateStorefront(["products", "best-selling"]);
      toast.success(t("product-created"));
      navigate({ to: "/dashboard/products" });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, createProduct: mutate };
}

export function useUpdateProduct(id: string) {
  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (body: FormData | ProductUpdateInput) =>
      updateProductService(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      revalidateStorefront(["products", `product-${id}`, "best-selling"]);
      toast.success(t("product-updated"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, updateProduct: mutate };
}

export function useDeleteProduct() {
  // Navigation
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (id: string) => deleteProductService(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      revalidateStorefront(["products", `product-${id}`, "best-selling"]);
      toast.success(t("product-deleted"));
      navigate({ to: "/dashboard/products" });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, deleteProduct: mutate };
}
