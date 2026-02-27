import type { Response } from "express";

export function sendOk<T>(res: Response, data: T, meta?: Record<string, unknown>) {
  res.json({ data, ...(meta ? { meta } : {}) });
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });
}
