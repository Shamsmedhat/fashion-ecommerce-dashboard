// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "@/i18n";
import type { ProductVariant } from "../types/product";
import { VariantManager } from "./VariantManager";

const { createVariant, updateVariant, deleteVariant } = vi.hoisted(() => ({
  createVariant: vi.fn(),
  updateVariant: vi.fn(),
  deleteVariant: vi.fn(),
}));

vi.mock("../hooks/use-variant-mutations", () => ({
  useCreateVariant: () => ({ isPending: false, createVariant }),
  useUpdateVariant: () => ({ isPending: false, updateVariant }),
  useDeleteVariant: () => ({ isPending: false, deleteVariant }),
}));

function variant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    _id: "v1",
    sku: "MEN-SHO-BLA-M-001-1234",
    size: "M",
    color: "black",
    price: 500,
    priceDiscount: 400,
    soldCount: 0,
    stock: 3,
    images: [],
    ...overrides,
  };
}

const deleteButtons = () => screen.getAllByRole("button", { name: i18n.t("action-delete") });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("VariantManager", () => {
  it("does not allow deleting a product's only variant", () => {
    render(<VariantManager productId="p1" variants={[variant()]} />);

    expect(deleteButtons()[0]).toBeDisabled();
  });

  it("allows deleting a variant when another one remains", () => {
    render(
      <VariantManager
        productId="p1"
        variants={[variant(), variant({ _id: "v2", sku: "MEN-SHO-BLA-L-002-5678", size: "L" })]}
      />,
    );

    deleteButtons().forEach((button) => expect(button).toBeEnabled());
  });

  // Regression: an emptied discount field was dropped from the request, so the discount stayed.
  it("sends null for a discount that was cleared while editing", async () => {
    render(
      <VariantManager
        productId="p1"
        variants={[variant(), variant({ _id: "v2", sku: "MEN-SHO-BLA-L-002-5678", size: "L" })]}
      />,
    );

    await userEvent.click(screen.getAllByRole("button", { name: i18n.t("action-edit") })[0]);
    const dialog = await screen.findByRole("dialog");
    await userEvent.clear(within(dialog).getByLabelText(i18n.t("field-price-discount")));
    await userEvent.click(within(dialog).getByRole("button", { name: i18n.t("action-save") }));

    expect(updateVariant).toHaveBeenCalledTimes(1);
    expect(updateVariant.mock.calls[0][0]).toEqual({
      varId: "v1",
      input: { size: "M", color: "black", price: 500, stock: 3, priceDiscount: null },
    });
  });

  it("keeps a discount that was not touched", async () => {
    render(
      <VariantManager
        productId="p1"
        variants={[variant(), variant({ _id: "v2", sku: "MEN-SHO-BLA-L-002-5678", size: "L" })]}
      />,
    );

    await userEvent.click(screen.getAllByRole("button", { name: i18n.t("action-edit") })[0]);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: i18n.t("action-save") }));

    expect(updateVariant.mock.calls[0][0].input.priceDiscount).toBe(400);
  });
});
