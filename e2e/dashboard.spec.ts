import { expect, test, type Page } from "@playwright/test";

// 1x1 transparent PNG — enough for the upload flow.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

const unique = (label: string) => `${label} ${Date.now().toString().slice(-7)}`;

async function signIn(page: Page): Promise<void> {
  await page.goto("/auth/login");
  // The form opens pre-filled with the demo admin account.
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard\/?$/);
}

// Uploads go straight from the browser to Cloudinary; the tests answer in its place.
async function stubCloudinary(page: Page): Promise<string[]> {
  const uploadedTo: string[] = [];

  await page.route("https://api.cloudinary.com/**", async (route) => {
    const [, cloudName] = route.request().url().match(/v1_1\/([^/]+)\//) ?? [];
    const publicId = `e2e-${Date.now()}-${uploadedTo.length}`;
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/products/${publicId}.png`;
    uploadedTo.push(url);
    await route.fulfill({ json: { secure_url: url } });
  });

  return uploadedTo;
}

test("signs in with the pre-filled demo account and shows the catalogue totals", async ({
  page,
}) => {
  await signIn(page);

  await expect(page.getByText("Total products")).toBeVisible();
  // 3 main categories in the seed — the card used to show the count of all categories.
  await expect(
    page.locator("[data-slot=card]").filter({ hasText: "Main categories" }),
  ).toContainText("3");
});

test("creates a product: the image goes to Cloudinary and the API receives JSON", async ({
  page,
}) => {
  const uploads = await stubCloudinary(page);
  const name = unique("E2E Linen Shirt");
  await signIn(page);

  await page.goto("/dashboard/products/new");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Description").fill("A breathable linen shirt created by the e2e suite");
  await page.getByLabel("Category").click();
  await page.getByRole("option", { name: "men/upperbody", exact: true }).click();
  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({ name: "cover.png", mimeType: "image/png", buffer: PNG });
  await page.getByLabel("Color").fill("white");
  await page.getByLabel("Price", { exact: true }).fill("450");

  const createRequest = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().endsWith("/products"),
  );
  await page.getByRole("button", { name: "Create" }).click();
  const body = (await createRequest).postDataJSON();

  expect(uploads).toHaveLength(1);
  expect(body.coverImage).toBe(uploads[0]);
  expect(body.variants).toEqual([{ size: "M", color: "white", price: 450, stock: 1 }]);

  await expect(page.getByText("Product created")).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/products\/?(\?.*)?$/);
  await expect(page.getByRole("link", { name })).toBeVisible();
});

test("edits a variant: sets a discount, then removes it", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard/products");
  await page.getByRole("link", { name: "Men Classic Leather Sneakers" }).click();

  const editFirstVariant = () => page.getByRole("button", { name: "Edit" }).first().click();
  const dialog = page.getByRole("dialog");

  await editFirstVariant();
  await dialog.getByLabel("Price", { exact: true }).fill("1200");
  await dialog.getByLabel("Discounted price").fill("999");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Variant updated")).toBeVisible();
  await expect(dialog).toBeHidden();

  // A discount at or above the price is refused by the form before any request.
  await editFirstVariant();
  await dialog.getByLabel("Discounted price").fill("1200");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog.getByText("Discount must be less than the price")).toBeVisible();

  // Emptying the field removes the discount.
  await dialog.getByLabel("Discounted price").fill("");
  const update = page.waitForResponse(
    (response) => response.request().method() === "PATCH" && response.url().includes("/variants/"),
  );
  await dialog.getByRole("button", { name: "Save" }).click();
  const product = (await (await update).json()).data.product;

  expect((await update).status()).toBe(200);
  expect(product.variants[0].priceDiscount ?? null).toBeNull();
});

test("deletes an unused category but refuses one that still has products", async ({ page }) => {
  const name = unique("E2E Outlet");
  await signIn(page);

  await page.goto("/dashboard/categories/new");
  await page.getByLabel("Name").fill(name);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Category created")).toBeVisible();

  // Matched on a whole cell, so "men/shoes" does not also pick "women/shoes".
  const row = (text: string) =>
    page.getByRole("row").filter({ has: page.getByText(text, { exact: true }) });
  const confirm = page.getByRole("alertdialog").getByRole("button", { name: "Delete" });

  await row(name).getByRole("button", { name: "Delete" }).click();
  await confirm.click();
  await expect(page.getByText("Category deleted")).toBeVisible();
  await expect(row(name)).toHaveCount(0);

  await row("men/shoes").getByRole("button", { name: "Delete" }).click();
  await confirm.click();
  await expect(page.getByText(/still has products/i)).toBeVisible();
  await expect(row("men/shoes")).toHaveCount(1);
});

test("an expired session sends the admin back to the login page", async ({ page }) => {
  await signIn(page);

  await page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("auth-storage") ?? "{}");
    stored.state.token = "expired.or.revoked.token";
    localStorage.setItem("auth-storage", JSON.stringify(stored));
  });
  await page.goto("/dashboard/products");

  await expect(page).toHaveURL(/\/auth\/login/);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the navigation is a drawer opened from the top bar", async ({ page }) => {
    await signIn(page);
    const productsLink = page.getByRole("link", { name: "Products" });

    await expect(productsLink).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await productsLink.click();

    await expect(page).toHaveURL(/\/dashboard\/products/);
    await expect(productsLink).toBeHidden();
  });
});
