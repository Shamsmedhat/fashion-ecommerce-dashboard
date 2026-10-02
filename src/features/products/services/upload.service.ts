import { apiFetch } from "@/services/api";
import { AppError } from "@/utils/app-errors";
import type { UploadSignatureResponse } from "../types/product";

type UploadSignature = UploadSignatureResponse["data"];

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export async function getUploadSignatureService(): Promise<UploadSignatureResponse> {
  return apiFetch<UploadSignatureResponse>("/products/upload-signature");
}

async function uploadImage(file: File, signature: UploadSignature): Promise<string> {
  // Only the signed params (folder, timestamp) may be sent besides the file and credentials.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("folder", signature.folder);
  formData.append("signature", signature.signature);

  // Dedicated fetch — must NOT use apiFetch (it would send the admin JWT to Cloudinary).
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = (await res.json().catch(() => null)) as CloudinaryUploadResponse | null;

  if (!res.ok || !data?.secure_url) {
    throw new AppError(data?.error?.message ?? "Image upload failed", res.status, "general");
  }

  return data.secure_url;
}

// Uploads image files straight to Cloudinary (the API never receives image bytes)
// and returns their hosted URLs in the same order as the input.
export async function uploadProductImagesService(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const { data: signature } = await getUploadSignatureService();

  return Promise.all(files.map((file) => uploadImage(file, signature)));
}
