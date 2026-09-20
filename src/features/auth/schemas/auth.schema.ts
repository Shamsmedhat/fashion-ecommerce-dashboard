import { z } from "zod";

type Translate = (key: string) => string;

export function buildLoginSchema(t: Translate) {
  return z.object({
    identifier: z.string().min(1, t("validation-identifier-required")),
    password: z.string().min(1, t("validation-password-required")),
  });
}

// Type derived from the schema shape (messages aside).
export type LoginFields = z.infer<ReturnType<typeof buildLoginSchema>>;
