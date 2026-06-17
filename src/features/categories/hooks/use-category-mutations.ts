import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { revalidateStorefront } from "@/services/revalidate";
import { getErrorMessage } from "@/utils/catch-error";
import {
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
  type CategoryInput,
} from "../services/category.service";

export function useCreateCategory() {
  // Navigation
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (input: CategoryInput) => createCategoryService(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      revalidateStorefront(["categories", "main-categories"]);
      toast.success(t("category-created"));
      navigate({ to: "/dashboard/categories" });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, createCategory: mutate };
}

export function useUpdateCategory(id: string) {
  // Navigation
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (input: Partial<CategoryInput>) => updateCategoryService(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      revalidateStorefront(["categories", "main-categories"]);
      toast.success(t("category-updated"));
      navigate({ to: "/dashboard/categories" });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, updateCategory: mutate };
}

export function useDeleteCategory() {
  // Queries
  const queryClient = useQueryClient();

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (id: string) => deleteCategoryService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      revalidateStorefront(["categories", "main-categories"]);
      toast.success(t("category-deleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return { isPending, deleteCategory: mutate };
}
