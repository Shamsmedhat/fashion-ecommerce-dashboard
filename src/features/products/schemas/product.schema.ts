import { z } from "zod";

import { VARIANT_SIZES } from "@/config/constants";

type Translate = (key: string) => string;

export function buildVariantSchema(t: Translate) {
  return z
    .object({
      size: z.enum(VARIANT_SIZES),
      color: z.string().min(1, t("validation-name-min")),
      price: z.number().min(100, t("validation-price-min")),
      stock: z.number().int().min(0, t("validation-stock-min")),
      priceDiscount: z.number().optional(),
    })
    .refine(
      (variant) =>
        variant.priceDiscount === undefined || variant.priceDiscount < variant.price,
      { message: t("validation-discount-less"), path: ["priceDiscount"] },
    );
}

export function buildProductCreateSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .min(3, t("validation-name-min"))
      .max(45, t("validation-name-max")),
    description: z
      .string()
      .min(12, t("validation-description-min"))
      .max(255, t("validation-description-max")),
    categoryId: z.string().min(1, t("validation-category-required")),
    coverImage: z
      .array(z.instanceof(File))
      .min(1, t("validation-cover-required")),
    images: z.array(z.instanceof(File)).max(3, t("validation-gallery-max")),
    variants: z.array(buildVariantSchema(t)).min(1, t("validation-variants-min")),
  });
}

export function buildProductEditSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .min(3, t("validation-name-min"))
      .max(45, t("validation-name-max")),
    description: z
      .string()
      .min(12, t("validation-description-min"))
      .max(255, t("validation-description-max")),
    categoryId: z.string().min(1, t("validation-category-required")),
    coverImage: z.array(z.instanceof(File)),
    images: z.array(z.instanceof(File)).max(3, t("validation-gallery-max")),
  });
}

export type VariantFields = z.infer<ReturnType<typeof buildVariantSchema>>;
export type ProductCreateFields = z.infer<ReturnType<typeof buildProductCreateSchema>>;
export type ProductEditFields = z.infer<ReturnType<typeof buildProductEditSchema>>;
