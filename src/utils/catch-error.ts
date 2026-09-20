import { AppError } from "./app-errors";

export function catchError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message, 500, "general");
  return new AppError("Unknown error", 500, "general");
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}
