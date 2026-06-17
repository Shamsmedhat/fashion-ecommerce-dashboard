import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { revalidateStorefront } from "@/services/revalidate";
import { getErrorMessage } from "@/utils/catch-error";
import {
  createVariantService,
  deleteVariantService,
  updateVariantService,
  type VariantInput,
} from "../services/product.service";

function useInvalidateProduct(id: string) {
  // Queries
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
  };
}

export function useCreateVariant(id: string) {
  // Hooks
  const { t } = useTranslation();
  const invalidate = useInvalidateProduct(id);

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (input: VariantInput) => createVariantService(id, input),
    onSuccess: () => {
      invalidate();
      revalidateStorefront(["products", `product-${id}`]);
      toast.success(t("variant-created"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, createVariant: mutate };
}

export function useUpdateVariant(id: string) {
  // Hooks
  const { t } = useTranslation();
  const invalidate = useInvalidateProduct(id);

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: ({ varId, input }: { varId: string; input: Partial<VariantInput> }) =>
      updateVariantService(id, varId, input),
    onSuccess: () => {
      invalidate();
      revalidateStorefront(["products", `product-${id}`]);
      toast.success(t("variant-updated"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, updateVariant: mutate };
}

export function useDeleteVariant(id: string) {
  // Hooks
  const { t } = useTranslation();
  const invalidate = useInvalidateProduct(id);

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (varId: string) => deleteVariantService(id, varId),
    onSuccess: () => {
      invalidate();
      revalidateStorefront(["products", `product-${id}`]);
      toast.success(t("variant-deleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, deleteVariant: mutate };
}
