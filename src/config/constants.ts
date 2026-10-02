export const JSON_HEADER = {
  "Content-Type": "application/json",
} as const;

// Public demo admin — pre-filled on the login form so reviewers can sign in directly.
export const DEMO_CREDENTIALS = {
  identifier: "01111803604",
  password: "Shams@123",
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT = "-createdAt";

export const VARIANT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

// Client-side upload guard (backend handles the real processing via Cloudinary).
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_GALLERY_IMAGES = 3;
