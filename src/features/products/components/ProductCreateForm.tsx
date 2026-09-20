import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

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
import { VARIANT_SIZES } from "@/config/constants";
import {
  buildProductCreateSchema,
  type ProductCreateFields,
} from "../schemas/product.schema";
import { useCreateProduct } from "../hooks/use-product-mutations";
import type { Category } from "@/features/categories/types/category";

interface ProductCreateFormProps {
  categories: Category[];
}

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  // Hooks
  const { t } = useTranslation();
  const { isPending, createProduct } = useCreateProduct();

  // Form & validation
  const form = useForm<ProductCreateFields>({
    resolver: zodResolver(buildProductCreateSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      coverImage: [],
      images: [],
      variants: [{ size: "M", color: "", price: 100, stock: 1 }],
    },
  });

  const variants = useFieldArray({ control: form.control, name: "variants" });

  // Functions
  function onSubmit(values: ProductCreateFields) {
    const formData = new FormData();
    formData.append("coverImage", values.coverImage[0]);
    values.images.forEach((file) => formData.append("images", file));
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId);
    formData.append("variants", JSON.stringify(values.variants));
    createProduct(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Core details */}
          <div className="space-y-5 rounded-lg border border-border p-6">
            <h2 className="font-serif text-lg font-bold">{t("product-core-details")}</h2>

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
                        <SelectValue placeholder={t("products-filter-category")} />
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
          </div>

          {/* Images */}
          <div className="space-y-5 rounded-lg border border-border p-6">
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
                    />
                  </FormControl>

                  {/* Feedback */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4 rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">{t("variants")}</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => variants.append({ size: "M", color: "", price: 100, stock: 1 })}
            >
              <Plus className="h-4 w-4" />
              {t("variant-add")}
            </Button>
          </div>

          {form.formState.errors.variants?.root ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.variants.root.message}
            </p>
          ) : null}

          <div className="space-y-4">
            {variants.fields.map((variantField, index) => (
              <div
                key={variantField.id}
                className="grid items-end gap-3 rounded-md border border-border p-4 sm:grid-cols-5"
              >
                {/* Size */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("field-size")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VARIANT_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.color`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("field-color")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("field-price")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("field-stock")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove + discount */}
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.priceDiscount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("field-price-discount")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? undefined : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("action-delete")}
                    disabled={variants.fields.length <= 1}
                    onClick={() => variants.remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("action-saving") : t("action-create")}
        </Button>
      </form>
    </Form>
  );
}
