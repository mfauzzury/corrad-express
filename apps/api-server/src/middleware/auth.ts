import type { NextFunction, Response } from "express";

import { env } from "../config/env.js";
import { prisma } from "../prisma.js";
import type { AuthedRequest } from "../types.js";
import { signToken } from "../utils/crypto.js";
import { sendError } from "../utils/responses.js";

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const rawToken = req.cookies?.[env.cookieName];
  if (!rawToken) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required");
  }

  const tokenHash = signToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    }
    return sendError(res, 401, "SESSION_EXPIRED", "Session expired or invalid");
  }

  req.auth = {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };

  return next();
}
