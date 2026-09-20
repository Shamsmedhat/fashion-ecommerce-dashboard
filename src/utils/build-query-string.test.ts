import { describe, expect, it } from "vitest";

import { buildQueryString } from "@/utils/build-query-string";

describe("buildQueryString", () => {
  it("serializes string, number, and boolean values", () => {
    expect(buildQueryString({ page: 1, sort: "name", active: true })).toBe(
      "page=1&sort=name&active=true",
    );
  });

  it("skips undefined, null, and empty-string values", () => {
    expect(buildQueryString({ a: "x", b: undefined, c: null, d: "" })).toBe("a=x");
  });

  it("returns an empty string when there are no usable params", () => {
    expect(buildQueryString({ a: undefined, b: null, c: "" })).toBe("");
  });
});
