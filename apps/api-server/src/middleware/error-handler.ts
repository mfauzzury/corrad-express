import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { sendError } from "../utils/responses.js";

export function notFound(_req: Request, res: Response) {
  sendError(res, 404, "NOT_FOUND", "Resource not found");
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed", error.flatten());
  }

  console.error(error);
  return sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
}
