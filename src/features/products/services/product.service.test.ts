import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/store/auth.store";
import { AppError } from "@/utils/app-errors";
import { createProductService, updateProductService } from "./product.service";
import { uploadProductImagesService } from "./upload.service";

type FetchInit = { headers?: Record<string, string>; body?: unknown; method?: string };
type FetchCall = { url: string; init: FetchInit };

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/demo-cloud/image/upload";

const signature = {
  timestamp: 1700000000,
  folder: "products",
  signature: "signed-hash",
  cloudName: "demo-cloud",
  apiKey: "key-123",
};

function jsonResponse(payload: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    json: async () => payload,
  };
}

function imageFile(name: string): File {
  return new File(["bytes"], name, { type: "image/jpeg" });
}

// Routes the mocked fetch by URL: signature endpoint, Cloudinary upload, then the products API.
function stubFetch(cloudinary?: () => ReturnType<typeof jsonResponse>) {
  const fetchMock = vi.fn(async (url: string, init: FetchInit = {}) => {
    if (url.endsWith("/products/upload-signature")) {
      return jsonResponse({ status: "success", data: signature });
    }
    if (url === CLOUDINARY_UPLOAD_URL) {
      if (cloudinary) return cloudinary();
      const file = (init.body as FormData).get("file") as File;
      return jsonResponse({
        secure_url: `https://res.cloudinary.com/demo-cloud/image/upload/v1/products/${file.name}`,
      });
    }
    return jsonResponse({ status: "success", data: { product: { _id: "p1" } } });
  });
  vi.stubGlobal("fetch", fetchMock);

  return {
    calls: (): FetchCall[] =>
      fetchMock.mock.calls.map(([url, init]) => ({ url, init: init ?? {} })),
  };
}

function hostedUrl(name: string): string {
  return `https://res.cloudinary.com/demo-cloud/image/upload/v1/products/${name}`;
}

beforeEach(() => {
  useAuthStore.setState({ token: "admin-token", user: null });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("uploadProductImagesService", () => {
  it("requests one signature and uploads every file to Cloudinary with the signed params", async () => {
    const { calls } = stubFetch();

    const urls = await uploadProductImagesService([imageFile("a.jpg"), imageFile("b.jpg")]);

    expect(urls).toEqual([hostedUrl("a.jpg"), hostedUrl("b.jpg")]);

    const signatureCalls = calls().filter((c) => c.url.endsWith("/products/upload-signature"));
    expect(signatureCalls).toHaveLength(1);
    expect(signatureCalls[0].init.headers?.Authorization).toBe("Bearer admin-token");

    const uploads = calls().filter((c) => c.url === CLOUDINARY_UPLOAD_URL);
    expect(uploads).toHaveLength(2);

    const form = uploads[0].init.body as FormData;
    expect(uploads[0].init.method).toBe("POST");
    expect(form.get("api_key")).toBe("key-123");
    expect(form.get("timestamp")).toBe("1700000000");
    expect(form.get("folder")).toBe("products");
    expect(form.get("signature")).toBe("signed-hash");
    expect((form.get("file") as File).name).toBe("a.jpg");
  });

  it("never sends the admin token to Cloudinary", async () => {
    const { calls } = stubFetch();

    await uploadProductImagesService([imageFile("a.jpg")]);

    const upload = calls().find((c) => c.url === CLOUDINARY_UPLOAD_URL);
    expect(upload?.init.headers).toBeUndefined();
  });

  it("makes no request when there are no files", async () => {
    const { calls } = stubFetch();

    await expect(uploadProductImagesService([])).resolves.toEqual([]);
    expect(calls()).toHaveLength(0);
  });

  it("throws an AppError carrying Cloudinary's message when an upload is rejected", async () => {
    stubFetch(() => jsonResponse({ error: { message: "Invalid Signature" } }, 401));

    const error = await uploadProductImagesService([imageFile("a.jpg")]).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).message).toBe("Invalid Signature");
  });
});

describe("createProductService", () => {
  // Regression: the API has no multipart parser, so a FormData body arrived empty
  // and was rejected with "Variants must be an array!".
  it("sends JSON with hosted image URLs and a real variants array", async () => {
    const { calls } = stubFetch();

    await createProductService({
      name: "Linen shirt",
      description: "A breathable linen shirt",
      categoryId: "cat-1",
      coverImage: [imageFile("cover.jpg")],
      images: [imageFile("g1.jpg"), imageFile("g2.jpg")],
      variants: [{ size: "M", color: "white", price: 500, stock: 3 }],
    });

    const create = calls().at(-1);
    expect(create?.url.endsWith("/products")).toBe(true);
    expect(create?.init.method).toBe("POST");
    expect(create?.init.headers?.["Content-Type"]).toBe("application/json");
    expect(JSON.parse(create?.init.body as string)).toEqual({
      name: "Linen shirt",
      description: "A breathable linen shirt",
      categoryId: "cat-1",
      coverImage: hostedUrl("cover.jpg"),
      images: [hostedUrl("g1.jpg"), hostedUrl("g2.jpg")],
      variants: [{ size: "M", color: "white", price: 500, stock: 3 }],
    });
  });

  it("does not create the product when an image upload fails", async () => {
    const { calls } = stubFetch(() => jsonResponse({ error: { message: "File too large" } }, 400));

    await expect(
      createProductService({
        name: "Linen shirt",
        description: "A breathable linen shirt",
        categoryId: "cat-1",
        coverImage: [imageFile("cover.jpg")],
        images: [],
        variants: [{ size: "M", color: "white", price: 500, stock: 3 }],
      }),
    ).rejects.toThrow("File too large");

    expect(calls().some((c) => c.url.endsWith("/products"))).toBe(false);
  });
});

describe("updateProductService", () => {
  const textFields = {
    name: "Linen shirt",
    description: "A breathable linen shirt",
    categoryId: "cat-1",
  };

  it("sends only the text fields and uploads nothing when no image was picked", async () => {
    const { calls } = stubFetch();

    await updateProductService("p1", { ...textFields, coverImage: [], images: [] });

    expect(calls()).toHaveLength(1);
    expect(calls()[0].url.endsWith("/products/p1")).toBe(true);
    expect(calls()[0].init.method).toBe("PATCH");
    expect(JSON.parse(calls()[0].init.body as string)).toEqual(textFields);
  });

  it("replaces only the cover when only a new cover was picked", async () => {
    const { calls } = stubFetch();

    await updateProductService("p1", {
      ...textFields,
      coverImage: [imageFile("cover.jpg")],
      images: [],
    });

    expect(JSON.parse(calls().at(-1)?.init.body as string)).toEqual({
      ...textFields,
      coverImage: hostedUrl("cover.jpg"),
    });
  });

  it("replaces only the gallery when only gallery images were picked", async () => {
    const { calls } = stubFetch();

    await updateProductService("p1", {
      ...textFields,
      coverImage: [],
      images: [imageFile("g1.jpg"), imageFile("g2.jpg")],
    });

    expect(JSON.parse(calls().at(-1)?.init.body as string)).toEqual({
      ...textFields,
      images: [hostedUrl("g1.jpg"), hostedUrl("g2.jpg")],
    });
  });
});
