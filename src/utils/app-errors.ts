export type AppErrorType = "authentication" | "authorization" | "general";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: AppErrorType;

  constructor(message: string, statusCode: number, type: AppErrorType = "general") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.type = type;
  }

  get isAuthentication() {
    return this.type === "authentication";
  }

  get isAuthorization() {
    return this.type === "authorization";
  }
}

