import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";

import { env } from "../config/env.js";
import { prisma } from "../prisma.js";
import { sendError, sendOk } from "../utils/responses.js";

const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    const safeBase = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");
    const ext = path.extname(safeBase);
    const name = path.basename(safeBase, ext);
    const filename = `${name}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadBytes },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  },
});

export const mediaRouter = Router();

mediaRouter.get("/", async (_req, res) => {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return sendOk(res, items);
});

mediaRouter.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return sendError(res, 400, "FILE_REQUIRED", "No file uploaded");
  }

  const record = await prisma.media.create({
    data: {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      width: null,
      height: null,
      altText: null,
      path: file.path,
      url: `/uploads/${file.filename}`,
    },
  });

  return sendOk(res, record);
});

mediaRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "Media not found");
  }

  const linkedPost = await prisma.post.findFirst({ where: { featuredImageId: id } });
  if (linkedPost) {
    return sendError(res, 409, "MEDIA_IN_USE", "Media is in use by at least one post");
  }

  await prisma.media.delete({ where: { id } });

  try {
    fs.unlinkSync(existing.path);
  } catch {
    // noop
  }

  return sendOk(res, { success: true });
});
