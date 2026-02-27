import bcrypt from "bcryptjs";
import { Router } from "express";

import { env, isProduction } from "../config/env.js";
import { loginRateLimit } from "../middleware/rate-limit.js";
import { prisma } from "../prisma.js";
import type { AuthedRequest } from "../types.js";
import { randomToken, signToken } from "../utils/crypto.js";
import { sendError, sendOk } from "../utils/responses.js";
import { loginSchema } from "./schemas.js";

export const authRouter = Router();
export const authPublicRouter = Router();

authPublicRouter.post("/login", loginRateLimit, async (req, res) => {
  const payload = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!validPassword) {
    return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const rawToken = randomToken();
  const tokenHash = signToken(rawToken);
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  res.cookie(env.cookieName, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    expires: expiresAt,
  });

  return sendOk(res, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

authRouter.post("/logout", async (req, res) => {
  const rawToken = req.cookies?.[env.cookieName];
  if (rawToken) {
    const tokenHash = signToken(rawToken);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  res.clearCookie(env.cookieName, { path: "/" });
  return sendOk(res, { success: true });
});

authRouter.get("/me", async (req: AuthedRequest, res) => {
  if (!req.auth) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required");
  }

  return sendOk(res, {
    user: {
      id: req.auth.userId,
      email: req.auth.email,
      name: req.auth.name,
    },
    csrfToken: req.csrfTokenValue ?? req.cookies?.[env.csrfCookieName] ?? "",
  });
});
