import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildCategorySchema, type CategoryFields } from "../schemas/category.schema";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../hooks/use-category-mutations";
import type { Category } from "../types/category";

const NONE = "__none__";

interface CategoryFormProps {
  category?: Category;
  parentOptions: Category[];
}

export function CategoryForm({ category, parentOptions }: CategoryFormProps) {
  // Hooks
  const { t } = useTranslation();

  // Mutations
  const { isPending: creating, createCategory } = useCreateCategory();
  const { isPending: updating, updateCategory } = useUpdateCategory(category?._id ?? "");

  // Form & validation
  const form = useForm<CategoryFields>({
    resolver: zodResolver(buildCategorySchema(t)),
    defaultValues: {
      name: category?.name ?? "",
      parentId: category?.parentId ?? "",
    },
  });

  // Variables
  const isEdit = Boolean(category);
  const isPending = creating || updating;
  const options = parentOptions.filter((option) => option._id !== category?._id);

  // Functions
  function onSubmit(values: CategoryFields) {
    const parentId = values.parentId ? values.parentId : null;
    if (isEdit) {
      updateCategory({ name: values.name, parentId });
    } else {
      createCategory({
        name: values.name,
        ...(parentId ? { parentId } : {}),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* Label */}
              <FormLabel>{t("field-name")}</FormLabel>

              {/* Field */}
              <FormControl>
                <Input {...field} />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parent */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              {/* Label */}
              <FormLabel>{t("field-parent")}</FormLabel>

              {/* Field */}
              <Select
                value={field.value ? field.value : NONE}
                onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE}>{t("category-parent-none")}</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("action-saving")
            : isEdit
              ? t("action-save")
              : t("action-create")}
        </Button>
      </form>
    </Form>
  );
}
