import type { NextFunction, Response } from "express";

import { env } from "../config/env.js";
import type { AuthedRequest } from "../types.js";
import { randomToken } from "../utils/crypto.js";
import { sendError } from "../utils/responses.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function issueCsrfCookie(req: AuthedRequest, res: Response, next: NextFunction) {
  const current = req.cookies?.[env.csrfCookieName];
  const token = current || randomToken(24);
  res.cookie(env.csrfCookieName, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });
  req.csrfTokenValue = token;
  next();
}

export function requireCsrf(req: AuthedRequest, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const csrfCookie = req.cookies?.[env.csrfCookieName];
  const csrfHeader = req.header("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return sendError(res, 403, "CSRF_MISMATCH", "Invalid CSRF token");
  }

  return next();
}
