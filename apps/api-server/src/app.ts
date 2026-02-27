import fs from "node:fs";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { requireAuth } from "./middleware/auth.js";
import { issueCsrfCookie, requireCsrf } from "./middleware/csrf.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { authPublicRouter, authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { healthRouter } from "./routes/health.js";
import { mediaRouter } from "./routes/media.js";
import { pagesRouter } from "./routes/pages.js";
import { postsRouter } from "./routes/posts.js";
import { settingsRouter } from "./routes/settings.js";
import { sendError } from "./utils/responses.js";

fs.mkdirSync(env.uploadDir, { recursive: true });

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(issueCsrfCookie);

app.use("/uploads", express.static(env.uploadDir));

app.use("/api", healthRouter);
app.use("/api/auth", authPublicRouter);

app.use((req, res, next) => {
  if (req.path === "/api/health" || req.path === "/api/auth/login") {
    return next();
  }
  return requireAuth(req, res, next);
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/api") || req.path === "/api/auth/login") return next();
  return requireCsrf(req, res, next);
});

app.use("/api/posts", postsRouter);
app.use("/api/pages", pagesRouter);
app.use("/api/media", mediaRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return sendError(res, 404, "NOT_FOUND", "Resource not found");
  }
  return next();
});

app.use(notFound);
app.use(errorHandler);
