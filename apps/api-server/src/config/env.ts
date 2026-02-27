import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

const rootDir = process.cwd();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  sessionSecret: process.env.SESSION_SECRET ?? "change-me",
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS ?? 24),
  cookieName: process.env.COOKIE_NAME ?? "cms_session",
  csrfCookieName: process.env.CSRF_COOKIE_NAME ?? "cms_csrf",
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR ?? "uploads"),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB ?? 5) * 1024 * 1024,
};

export const isProduction = env.nodeEnv === "production";
