import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ImageDropzone } from "@/components/shared/ImageDropzone";
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
import { Textarea } from "@/components/ui/textarea";
import {
  buildProductEditSchema,
  type ProductEditFields,
} from "../schemas/product.schema";
import { useUpdateProduct } from "../hooks/use-product-mutations";
import type { Product } from "../types/product";
import type { Category } from "@/features/categories/types/category";

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  // Hooks
  const { t } = useTranslation();
  const { isPending, updateProduct } = useUpdateProduct(product._id);

  // Form & validation
  const form = useForm<ProductEditFields>({
    resolver: zodResolver(buildProductEditSchema(t)),
    defaultValues: {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      coverImage: [],
      images: [],
    },
  });

  // Functions
  function onSubmit(values: ProductEditFields) {
    updateProduct(values, {
      // Drop the picked files once saved so another save doesn't upload them again.
      onSuccess: () => form.reset({ ...values, coverImage: [], images: [] }),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              {/* Label */}
              <FormLabel>{t("field-description")}</FormLabel>

              {/* Field */}
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              {/* Label */}
              <FormLabel>{t("field-category")}</FormLabel>

              {/* Field */}
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover image */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              {/* Field */}
              <FormControl>
                <ImageDropzone
                  mode="single"
                  label={t("field-cover-image")}
                  value={field.value}
                  onChange={field.onChange}
                  existingUrls={product.coverImage ? [product.coverImage] : []}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gallery images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              {/* Field */}
              <FormControl>
                <ImageDropzone
                  mode="multiple"
                  maxFiles={3}
                  label={t("field-gallery-images")}
                  value={field.value}
                  onChange={field.onChange}
                  existingUrls={product.images}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("action-saving") : t("action-save")}
        </Button>
      </form>
    </Form>
  );
}
