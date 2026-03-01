import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";

import { sendError } from "../utils/responses.js";

export function notFound(_req: Request, res: Response) {
  sendError(res, 404, "NOT_FOUND", "Resource not found");
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return sendError(res, 400, "VALIDATION_ERROR", "Validation failed", error.flatten());
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return sendError(res, 413, "FILE_TOO_LARGE", "Uploaded file is too large");
    }
    return sendError(res, 400, "UPLOAD_ERROR", error.message);
  }

  if (error instanceof Error && error.message === "Unsupported file type") {
    return sendError(res, 400, "UNSUPPORTED_FILE_TYPE", "Unsupported file type");
  }

  console.error(error);
  return sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
}
