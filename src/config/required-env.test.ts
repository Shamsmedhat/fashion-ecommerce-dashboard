import { describe, expect, it } from "vitest";

import { assertRequiredEnv, findMissingEnv } from "./required-env";

const complete = {
  VITE_API_URL: "https://api.example.com/api/v1",
  VITE_STOREFRONT_URL: "https://shop.example.com",
};

describe("required build environment", () => {
  it("accepts a complete environment", () => {
    expect(findMissingEnv(complete)).toEqual([]);
    expect(() => assertRequiredEnv(complete)).not.toThrow();
  });

  it("reports every missing or blank variable", () => {
    expect(findMissingEnv({ VITE_API_URL: "  " })).toEqual([
      "VITE_API_URL",
      "VITE_STOREFRONT_URL",
    ]);
  });

  // Regression: a deploy without VITE_API_URL built fine and then failed every request with 405.
  it("fails the build with the variable name instead of shipping empty URLs", () => {
    expect(() => assertRequiredEnv({ VITE_STOREFRONT_URL: complete.VITE_STOREFRONT_URL })).toThrow(
      /VITE_API_URL/,
    );
  });
});
