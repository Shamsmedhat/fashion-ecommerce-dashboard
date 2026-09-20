import { z } from "zod";

type Translate = (key: string) => string;

export function buildCategorySchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .min(3, t("validation-name-min"))
      .max(45, t("validation-name-max")),
    // Empty string represents "no parent" (main category) in the select.
    parentId: z.string(),
  });
}

export type CategoryFields = z.infer<ReturnType<typeof buildCategorySchema>>;
