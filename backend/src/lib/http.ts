import type { NextFunction, Request, RequestHandler, Response } from "express";

export class HttpError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    void handler(req, res, next).catch(next);
  };

export function readString(value: unknown, field: string, maxLength = 2000): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, "VALIDATION_ERROR", `${field} is required`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new HttpError(400, "VALIDATION_ERROR", `${field} exceeds ${maxLength} characters`);
  }
  return normalized;
}
