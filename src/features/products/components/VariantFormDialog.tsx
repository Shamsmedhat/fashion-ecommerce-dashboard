import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { VARIANT_SIZES } from "@/config/constants";
import { buildVariantSchema, type VariantFields } from "../schemas/product.schema";
import {
  useCreateVariant,
  useUpdateVariant,
} from "../hooks/use-variant-mutations";
import type { ProductVariant } from "../types/product";

interface VariantFormDialogProps {
  productId: string;
  variant: ProductVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaults: VariantFields = {
  size: "M",
  color: "",
  price: 100,
  stock: 1,
  priceDiscount: undefined,
};

export function VariantFormDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: VariantFormDialogProps) {
  // Hooks
  const { t } = useTranslation();
  const { isPending: creating, createVariant } = useCreateVariant(productId);
  const { isPending: updating, updateVariant } = useUpdateVariant(productId);

  // Form & validation
  const form = useForm<VariantFields>({
    resolver: zodResolver(buildVariantSchema(t)),
    defaultValues: defaults,
  });

  // Variables
  const isEdit = Boolean(variant);
  const isPending = creating || updating;

  // Effects — sync form values when the dialog opens
  useEffect(() => {
    if (!open) return;
    form.reset(
      variant
        ? {
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
            priceDiscount: variant.priceDiscount,
          }
        : defaults,
    );
  }, [open, variant, form]);

  // Functions
  function onSubmit(values: VariantFields) {
    const close = { onSuccess: () => onOpenChange(false) };
    if (variant) {
      // An emptied discount field must reach the API as null: a missing key leaves the old value.
      const input = { ...values, priceDiscount: values.priceDiscount ?? null };
      updateVariant({ varId: variant._id, input }, close);
    } else {
      createVariant(values, close);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t("variant-edit") : t("variant-add")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Size */}
            <FormField
              control={form.control}
              name="size"
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
              name="color"
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

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
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
                name="stock"
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
            </div>

            {/* Price discount */}
            <FormField
              control={form.control}
              name="priceDiscount"
              render={({ field }) => (
                <FormItem>
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

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("action-saving") : t("action-save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
